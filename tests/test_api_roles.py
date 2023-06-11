from django.urls import reverse
from django.test import TestCase
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from rest_framework.test import APIClient
from rest_framework import status
from app.models.authapp import M_UserGroup
import datetime

class PostRoleTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.data1 = {
                        'UserGroupID': 1,
                        'UserGroupCode': 'TEST',
                        'UserGroupName': 'Test Group'
                     }
        self.data2 = {
                        'UserGroupID': 2,
                        'UserGroupCode': 'TEST2',
                        'UserGroupName': 'Test Group'
                     }
        self.correctdata = {
                        'UserGroupID': 3,
                        'UserGroupCode': 'HMN',
                        'UserGroupName': 'Human'
                     }
        
    def test_create_role_duplicate_code_and_name(self):
        dummy_role = M_UserGroup.objects.create(
                        UserGroupID = 1,
                        UserGroupCode = 'TEST2',
                        UserGroupName = 'Test Group'
                    )
        
        url = reverse('api:roles')
        
        response = self.client.post(url, self.data1, format='json')
        self.assertEqual(response.status_code == 400, True, 'Test Error: GroupName already exist')
        
        response = self.client.post(url, self.data2, format='json')
        self.assertEqual(response.status_code == 400, True, 'Test Error: GroupCode already exist')
        
        response = self.client.post(url, self.correctdata, format='json')
        newly_added_group = M_UserGroup.objects.get(UserGroupID=response.data['UserGroupID'])
        self.assertEqual(newly_added_group.UserGroupName, 'Human', 'Test Error: Unknown Error Occur')         #If a supposed to be passing test fails.
        
        
class GetRoleTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.dummy_role = {
                        'UserGroupID': 1,
                        'UserGroupCode': 'YOU',
                        'UserGroupName': 'Animal'
                     }
        
        self.dummy_role2 = {
                        'UserGroupID': 2,
                        'UserGroupCode': 'ME',
                        'UserGroupName': 'Handsome'
                     }
        
        self.dummy_role3 = {
                        'UserGroupID': 3,
                        'UserGroupCode': 'WM',
                        'UserGroupName': 'Wholesome'
                     }
        
        self.dummy_role4 = {
                        'UserGroupID': 4,
                        'UserGroupCode': 'SI',
                        'UserGroupName': 'Someofit'
                     }
        
        url_create = reverse('api:roles')
        
        self.client.post(url_create, self.dummy_role, format='json')        # create role 1
        self.client.post(url_create, self.dummy_role2, format='json')       # create role 2
        self.client.post(url_create, self.dummy_role3, format='json')       # create role 3
        self.client.post(url_create, self.dummy_role4, format='json')       # create role 4
        
        
    def test_get_role_show_by_keyword(self):
        url_get = reverse('api:roles') + '?search=some'

        response = self.client.get(url_get, format='json')             # do the search
        self.assertEqual(len(response.data), 3, 'Test Error: search by keyword return count unmatched. Expected 3 count')
        
        url_get = reverse('api:roles') + '?search=mal'

        response = self.client.get(url_get, format='json')             # do the search
        self.assertEqual(len(response.data), 1, 'Test Error: search by keyword return count unmatched. Expected 1 count')
        
        
    def test_get_role_search_not_case_sensitive(self):
        url_get = reverse('api:roles') + '?search=HaNdSOme'

        response = self.client.get(url_get, format='json')             # do the search
        self.assertEqual(len(response.data), 1, 'Test Error: Search must not case sensitive')
        
        url_get = reverse('api:roles') + '?search=ANI'

        response = self.client.get(url_get, format='json')             # do the search
        self.assertEqual(len(response.data), 1, 'Test Error: Search must not case sensitive')
        
    
        