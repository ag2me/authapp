from rest_framework import status

from django.db.models import F, Max, Value, Q, Prefetch, OuterRef, Subquery
from django.core import serializers
from django.http import Http404
from django.db import transaction
from django.http import JsonResponse
from django.shortcuts import render
from django.db.utils import OperationalError
from django.conf import settings
from django.views.generic import (View,TemplateView)
from django.core.exceptions import PermissionDenied
from django.db.models.functions import Concat, Coalesce

from app.helpers.common import Repeated
from app.models.authapp import M_UserLogin, M_UserGroupMember, M_UserGroup, \
    M_UserRights, M_UserModule, M_System, M_Branch, M_Entity
from app.helpers.app_exception import AppException
from system_settings.constant import TABLE_STATUS_ACTIVE, GROUP_CODE_DEFAULT

import json
import os
import datetime

class User():
    def __init__(self):
        pass

    def _get_new_group_member(self, param):
        new_group_member = M_UserGroupMember.objects.select_related('UserGroupID', 'UserLoginID') \
            .filter(UserGroupMemberID=param['UserGroupMemberID']) \
            .values('UserGroupID', 'UserLoginID')        
        
        result = new_group_member.annotate(
             UserGroupName=F('UserGroupID__UserGroupName')
            ,UserLoginName=F('UserLoginID__UserLoginName')
            ,UserLoginEmail=F('UserLoginID__UserLoginEmail')
        )

        return result
    
    def _get_module_id(self, param):
        return M_UserModule.objects.get(ModuleID=param['ModuleID'])
    
    def _get_group_id(self, param):
        return M_UserGroup.objects.get(UserGroupID=param['UserGroupID'])

    def _get_userlogin_id(self, param):
        return M_UserLogin.objects.get(UserLoginID=param['UserLoginID'])
    
    def _get_user_rights_id(self, param):
        if param['is_group']:
            permission = M_UserRights.objects.get(
                SystemID=param['SystemID'],
                BranchID=param['BranchID'],
                UserGroupID=param['UserGroupID'],
                ModuleID=param['ModuleID']
            ) 
        else:
            permission = M_UserRights.objects.get(
                SystemID=param['SystemID'],
                BranchID=param['BranchID'],
                UserLoginID=param['UserLoginID'],
                ModuleID=param['ModuleID']
            )                

        return permission.UserRightID

    def _save_permission(self, param):
        # Get the maximum UserRightID from M_UserRights table
        last_id = M_UserRights.objects.aggregate(Max('UserRightID'))
        max_id = last_id['UserRightID__max']
        UserRightID = max_id + 1 if max_id is not None else 1
        param['UserRightID'] = UserRightID

        # Create a new M_UserRights object
        user_rights_data = {
            'UserRightID': param['UserRightID'],
            'BranchID': param['BranchID'],
            'SystemID': param['SystemID'],
            'ModuleID': self._get_module_id(param),
            'IsSystemListAllowed': param['IsSystemListAllowed']
        }

        if param['is_group']:
            user_rights_data['UserGroupID'] = self._get_group_id(param)
        else:
            user_rights_data['UserLoginID'] = self._get_userlogin_id(param)

        M_UserRights.objects.create(**user_rights_data)

        # Get the last inserted record
        last_inserted = M_UserRights.objects.get(UserRightID=UserRightID)
        result = last_inserted.__dict__  # Retrieve the dictionary representation of the object
        result.pop('_state', None)  # Remove the unnecessary _state key

        return result
    
    def _update_permission(self, param):
        permission = M_UserRights.objects.get(UserRightID=param['UserRightID'])

        # Update the fields of the existing permission record
        permission.BranchID = param['BranchID']

        if not param['is_group']:
            permission.UserLoginID = self._get_userlogin_id(param)
        else:
            permission.UserGroupID = self._get_group_id(param)    

        permission.ModuleID = self._get_module_id(param)    
        permission.IsSystemListAllowed = param['IsSystemListAllowed']
        permission.DateUpdated = datetime.date.today()

        # Save the changes to the database
        permission.save()

        result = {}
        available_rights = M_UserRights.objects.filter(UserRightID=param['UserRightID']).all()
        result = available_rights.values()

        return result

    def _check_permission(self, param, **kwargs):
        is_group = kwargs.get('is_group')
        filter_dict = {
            'SystemID': param['SystemID'],
            'BranchID': param['BranchID'],
            'ModuleID': param['ModuleID']
        }

        if is_group:
            if 'UserGroupID' in param and param['UserGroupID']:
                filter_dict['UserGroupID'] = param['UserGroupID']
        else:
            if 'UserLoginID' in param and param['UserLoginID']:
                filter_dict['UserLoginID'] = param['UserLoginID']

        has_permission = M_UserRights.objects.filter(**filter_dict).exists()

        return has_permission    

    def _get_group_info(self):
        group = M_UserGroup.objects.get(UserGroupCode=GROUP_CODE_DEFAULT)
        return group
    
    def _add_member_to_group(self, param):
        last_id = M_UserGroupMember.objects.last()
        UserGroupMemberID = last_id.UserGroupMemberID + 1 if last_id else 1  # get the max_id
        param['UserGroupMemberID'] = UserGroupMemberID

        M_UserGroupMember.objects.create(
            UserGroupMemberID=param['UserGroupMemberID'],
            UserGroupID=self._get_group_id(param),
            UserLoginID=self._get_userlogin_id(param),
        )

        # Get the last inserted record
        last_inserted = M_UserLogin.objects.get(UserLoginID=UserGroupMemberID)

        return last_inserted

    def _add_entity(self, param):
        entity_exists = M_Entity.objects.filter(UserLoginID=param['UserLoginID'], BranchID=param['BranchID']).exists()

        if entity_exists:
            raise AppException(400, 'entity user is already exist.')

        last_id = M_Entity.objects.last()
        EntityID = last_id.EntityID + 1 if last_id else 1  # get the max_id
        param['EntityID'] = EntityID

        M_Entity.objects.create(
            EntityID=param['EntityID'],
            EntityNameID=param['EntityNameID'],
            UserLoginID=param['UserLoginID'],        
            BranchID=param['BranchID']
        )

        # Get the last inserted record
        last_inserted = M_Entity.objects.get(EntityID=EntityID)

        return last_inserted
    
    def add_new_login(self, param):
        user_exists = M_UserLogin.objects.filter(UserLoginName=param['username']).exists()
        email_exists = M_UserLogin.objects.filter(UserLoginEmail=param['email']).exists()

        if user_exists:
            raise AppException(400, 'username is already exist.')

        if email_exists:
            raise AppException(400, 'email is already exist.')        
        
        last_id = M_UserLogin.objects.last()
        userloginid = last_id.UserLoginID + 1 if last_id else 1  # get the max_id
        param['UserLoginID'] = userloginid

        M_UserLogin.objects.create(
            UserLoginID=param['UserLoginID'],
            UserLoginEmail=param['email'],
            UserLoginName=param['username'],
            UserLoginPassword=settings.DB_PREFIX + param['password'],
            ReferenceTableStatusID=TABLE_STATUS_ACTIVE
        )

        # Get the last inserted record
        last_inserted = M_UserLogin.objects.get(UserLoginID=userloginid)

        return last_inserted
    
    def signup(self, param):
        with transaction.atomic():
            login = self.add_new_login(param)
            param['UserLoginID'] = login.UserLoginID

            param['BranchID'] = 1
            param['EntityNameID'] = 1
            self._add_entity(param)

            group = self._get_group_info()
            param['UserGroupID'] = group.UserGroupID

            self._add_member_to_group(param)

            result_data = {
                'UserLoginID': login.UserLoginID,
                'UserLoginEmail': login.UserLoginEmail,
                'UserLoginName': login.UserLoginName,
                'ReferenceTableStatusID': login.ReferenceTableStatusID
            }

        return result_data
    
    def create_permission(self, param):
        if ('UserGroupID' not in param or not param['UserGroupID']) and ('UserLoginID' not in param or not param['UserLoginID']):
            raise AppException(400, 'To create permission, you have to choose either group or individual. In group you need to pass UserGroupID or UserLoginID for individual')

        if 'UserGroupID' in param and param['UserGroupID'] and 'UserLoginID' in param and param['UserLoginID']:
            raise AppException(400, 'You cannot assign both permission to a group and an individual. Please select one. Either you pass UserGroupID or UserLoginID')

        if 'UserGroupID' in param and param['UserGroupID']:
            if self._check_permission(param, is_group=True):
                param['is_group'] = True
                UserRightID = self._get_user_rights_id(param)
                param['UserRightID'] = UserRightID 

                return self._update_permission(param)
            
        if 'UserLoginID' in param and param['UserLoginID']:    
            if self._check_permission(param, is_group=False):
                param['is_group'] = False            
                UserRightID = self._get_user_rights_id(param)
                param['UserRightID'] = UserRightID

                return self._update_permission(param) 
            
        param['is_group'] = True if 'UserGroupID' in param and param['UserGroupID'] else False
        return self._save_permission(param)            

    def available_permissions(self, param):
        group_permissions = M_UserRights.objects \
            .select_related('UserGroupID','ModuleID') \
            .filter(UserGroupID__UserGroupName__icontains = param['search']) \
            .all().values('ModuleID')
                
        result_group = group_permissions.annotate(
              Desc=F('UserGroupID__UserGroupName')
             ,GroupLoginID=F('UserGroupID')
             ,ModuleName=F('ModuleID__ModuleName')
             ,Controller=F('ModuleID__ModuleController')
             ,ModuleDescription=F('ModuleID__ModuleDescription')
             ,IsComponent=F('ModuleID__IsComponent')             
        )

        individual_permissions = M_UserRights.objects \
            .select_related('UserLoginID','ModuleID') \
            .filter(UserLoginID__UserLoginName__icontains = param['search']) \
            .all().values('ModuleID')
                
        result_individual = individual_permissions.annotate(
              Desc=F('UserLoginID__UserLoginName')
             ,GroupLoginID=F('UserLoginID') 
             ,ModuleName=F('ModuleID__ModuleName')
             ,Controller=F('ModuleID__ModuleController')
             ,ModuleDescription=F('ModuleID__ModuleDescription')
             ,IsComponent=F('ModuleID__IsComponent')             
        ) 

        available_permissions = result_group.union(result_individual)

        return available_permissions

    def available_permission(self, param):
        available_permission = M_UserGroupMember.objects.select_related('UserGroupID', 'UserLoginID'). \
            filter(UserGroupID=param['UserGroupID']).all().values('UserGroupID', 'UserLoginID')        
        result = available_permission.annotate(
             UserGroupName=F('UserGroupID__UserGroupName')
            ,UserLoginName=F('UserLoginID__UserLoginName')
            ,UserLoginEmail=F('UserLoginID__UserLoginEmail')
        )        

        return result              

    def create_role(self, param):
        group_exists = M_UserGroup.objects.filter(UserGroupName=param['UserGroupName']).exists()

        if group_exists:
            raise AppException(400, 'group is already exist.')
                
        last_id = M_UserGroup.objects.last()
        UserGroupID = last_id.UserGroupID + 1 if last_id else 1  # get the max_id
        param['UserGroupID'] = UserGroupID
        
        is_empty = not M_UserGroup.objects.exists()

        if is_empty:
            param['UserGroupCode'] = GROUP_CODE_DEFAULT
        else:
            param['UserGroupCode'] = Repeated.random_string()
                
        
        M_UserGroup.objects.create(
            UserGroupID=param['UserGroupID'],
            UserGroupCode=param['UserGroupCode'],
            UserGroupName=param['UserGroupName'],
        )

        # Get the last inserted record
        group = M_UserGroup.objects.get(UserGroupID=UserGroupID)
 
        result_data = {
            'UserGroupID': group.UserGroupID,
            'UserGroupName': group.UserGroupName,
        }

        return result_data 
    
    def available_roles(self, param):
        result = {}
        user_groups = M_UserGroup.objects.filter(UserGroupName__icontains=param['search']).all()
        result = user_groups.values()
        return result
    
    def assign_permission(self, param):
        result = {}

        login_exist_in_group = M_UserGroupMember.objects.filter(UserGroupID=param['UserGroupID'],UserLoginID=param['UserLoginID']).exists()
        if login_exist_in_group:
            raise AppException(400, 'login is already exist in role')
        
        last_id = M_UserGroupMember.objects.last()
        UserGroupMemberID = last_id.UserGroupMemberID + 1 if last_id else 1  # get the max_id
        param['UserGroupMemberID'] = UserGroupMemberID

        M_UserGroupMember.objects.create(
            UserGroupMemberID=param['UserGroupMemberID'],
            UserGroupID=self._get_group_id(param),
            UserLoginID=self._get_userlogin_id(param),
            EffectiveDate=param['EffectiveDate'],
        )

        group_member = M_UserGroupMember.objects.filter(UserGroupMemberID=UserGroupMemberID)
        result = group_member.values()

        return result
    
    def users_list(self, param):
        result = {}
        users_list = M_UserLogin.objects.filter(UserLoginName__icontains=param['search'], ReferenceTableStatusID=TABLE_STATUS_ACTIVE).all()
        result = users_list.values()
        return result
    
    def add_role(self, param):
        result = {}

        login_exist_in_group = M_UserGroupMember.objects.filter(UserGroupID=param['UserGroupID'],UserLoginID=param['UserLoginID']).exists()
        if login_exist_in_group:
            raise AppException(400, 'login is already exist in role')
        
        last_id = M_UserGroupMember.objects.last()
        UserGroupMemberID = last_id.UserGroupMemberID + 1 if last_id else 1  # get the max_id
        param['UserGroupMemberID'] = UserGroupMemberID

        M_UserGroupMember.objects.create(
            UserGroupMemberID=param['UserGroupMemberID'],
            UserGroupID=self._get_group_id(param),
            UserLoginID=self._get_userlogin_id(param),
            EffectiveDate=param['EffectiveDate'],
        )

        result = self._get_new_group_member(param)
        return result 

    def list_roles(self, param):
        available_permission = M_UserGroupMember.objects.select_related('UserGroupID', 'UserLoginID') \
            .filter(UserLoginID=param['UserLoginID'],ReferenceTableStatusID=TABLE_STATUS_ACTIVE) \
            .all() \
            .values('UserGroupID', 'UserLoginID')        
        result = available_permission.annotate(
             UserGroupName=F('UserGroupID__UserGroupName')
            ,UserLoginName=F('UserLoginID__UserLoginName')
            ,UserLoginEmail=F('UserLoginID__UserLoginEmail')
        )

        return result

    def create_module(self, param):
        module_exists = M_UserModule.objects \
            .filter(ModuleName=param['ModuleName'] \
                ,SystemID=param['SystemID'] \
                ,ModuleController=param['ModuleController']) \
            .exists()

        if module_exists:
            raise AppException(400, 'module is already exist.')
                
        last_id = M_UserModule.objects.last()
        ModuleID = last_id.ModuleID + 1 if last_id else 1  # get the max_id
        param['ModuleID'] = ModuleID
        
        M_UserModule.objects.create(
            ModuleID=param['ModuleID'],
            SystemID=param['SystemID'],
            ModuleName=param['ModuleName'],
            ModuleController=param['ModuleController'],
            ModuleDescription=param['ModuleDescription'],
            ModuleParentID=param['ModuleParentID'],
            ModuleSequence=param['ModuleSequence'],
            IsComponent=param['IsComponent'],
            IsDefaultSystemController=param['IsDefaultSystemController'],
        )

        # Get the last inserted record
        module = M_UserModule.objects.get(ModuleID=ModuleID)
 
        result_data = {
            'ModuleID': module.ModuleID,
            'SystemID': module.SystemID,
            'ModuleName': module.ModuleName,
            'ModuleController': module.ModuleController,
            'ModuleDescription': module.ModuleDescription,
            'ModuleParentID': module.ModuleParentID,
            'ModuleSequence': module.ModuleSequence,
            'IsComponent': module.IsComponent,
            'IsDefaultSystemController': module.IsDefaultSystemController,
        }

        return result_data            

    def available_modules(self, param):
        result = {}
        available_modules = M_UserModule.objects.filter(ModuleName__icontains=param['search']).all()
        result = available_modules.values()
        return result

    def list_permissions(self, param):
        individual_permissions = M_UserRights.objects \
            .select_related('UserLoginID','ModuleID') \
            .filter(UserLoginID = param['UserLoginID']) \
            .all().values('ModuleID')
                
        result_individual = individual_permissions.annotate(
              Desc=F('UserLoginID__UserLoginName')
             ,GroupLoginID=F('UserLoginID') 
             ,ModuleName=F('ModuleID__ModuleName')
             ,Controller=F('ModuleID__ModuleController')
             ,ModuleDescription=F('ModuleID__ModuleDescription')
             ,IsComponent=F('ModuleID__IsComponent')
        ) 

        return result_individual

    def create_system(self, param):
        system_exists = M_System.objects \
            .filter(SystemName=param['SystemName'] \
                ,EntityNameID=param['EntityNameID']) \
            .exists()

        if system_exists:
            raise AppException(400, 'system is already exist.')
                
        last_id = M_System.objects.last()
        SystemID = last_id.SystemID + 1 if last_id else 1  # get the max_id
        param['SystemID'] = SystemID
        
        M_System.objects.create(
            SystemID=param['SystemID'],
            EntityNameID=param['EntityNameID'],
            SystemName=param['SystemName'],
            SystemDescription=param['SystemDescription'],
        )

        # Get the last inserted record
        system = M_System.objects.get(SystemID=SystemID)
 
        result_data = {
            'SystemID': system.SystemID,
            'EntityNameID': system.EntityNameID,
            'SystemName': system.SystemName,
            'SystemDescription': system.SystemDescription,
        }

        return result_data 

    def available_systems(self, param):
        result = {}
        available_systems = M_System.objects.filter(SystemName__icontains=param['search']).all()
        result = available_systems.values()
        return result

    def create_branch(self, param):
        branch_exists = M_Branch.objects \
            .filter(BranchName=param['BranchName'] \
                ,EntityNameID=param['EntityNameID']) \
            .exists()

        if branch_exists:
            raise AppException(400, 'branch is already exist.')
                
        last_id = M_Branch.objects.last()
        BranchID = last_id.BranchID + 1 if last_id else 1  # get the max_id
        param['BranchID'] = BranchID
        
        M_Branch.objects.create(
            BranchID=param['BranchID'],
            EntityNameID=param['EntityNameID'],
            BranchName=param['BranchName'],
            BranchCode=Repeated.random_string(),
        )

        # Get the last inserted record
        branch = M_Branch.objects.get(BranchID=BranchID)
 
        result_data = {
            'BranchID': branch.BranchID,
            'EntityNameID': branch.EntityNameID,
            'BranchName': branch.BranchName,
            'BranchCode': branch.BranchCode,
        }

        return result_data    

    def available_branches(self, param):
        result = {}
        available_branches = M_Branch.objects.filter(BranchName__icontains=param['search']).all()
        result = available_branches.values()
        return result