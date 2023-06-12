from django.db import models

class M_Reference(models.Model):
    ReferenceID = models.BigIntegerField(primary_key=True)
    ReferenceGroup = models.CharField(max_length=100, null=True, blank=True)
    ReferenceCode = models.CharField(max_length=100, null=True, blank=True)
    ReferenceShortDescription = models.CharField(max_length=100, null=True, blank=True)
    ReferenceLongDescription = models.CharField(max_length=200, null=True, blank=True)
    ReferenceGroupCode = models.CharField(max_length=20, null=True, blank=True)
    ReferenceSequence = models.BigIntegerField(null=True, blank=True)
    ReferenceTableStatusID = models.BigIntegerField(default=1)
    DateAdded = models.DateTimeField(auto_now_add=True)
    DateUpdated = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        # managed = False
        db_table = 'M_Reference'
        
    def __str__(self):
        return f'{self.ReferenceID}' 

class M_Branch(models.Model):
    BranchID = models.BigIntegerField(primary_key=True)
    BranchName = models.CharField(max_length=50)
    BranchCode = models.CharField(max_length=10, default=None)
    EntityNameID = models.BigIntegerField()
    ReferenceTableStatusID = models.BigIntegerField(default=1)
    DateAdded = models.DateTimeField(auto_now_add=True)
    DateUpdated = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        # managed = False
        db_table = 'M_Branch'
        
    def __str__(self):
        return f'{self.BranchID}'

class M_EntityName(models.Model):
    EntityNameID = models.BigIntegerField(primary_key=True)
    EntityNameCode = models.CharField(max_length=10)
    EntityName = models.CharField(max_length=500)
    EntityNameDate = models.DateField(null=True, blank=True)
    ReferenceTableStatusID = models.BigIntegerField(default=1)
    DateAdded = models.DateTimeField(auto_now_add=True)
    DateUpdated = models.DateTimeField(null=True, blank=True)

    class Meta:
        # managed = False
        db_table = 'M_EntityName'
        
    def __str__(self):
        return f'{self.EntityNameID}'

class M_Entity(models.Model):
    EntityID = models.BigIntegerField(primary_key=True)
    EntityNameID = models.BigIntegerField(null=True, blank=True)
    UserLoginID = models.BigIntegerField(null=True, blank=True)
    BranchID = models.BigIntegerField(null=True, blank=True)
    ReferenceTableStatusID = models.BigIntegerField(default=1)
    DateAdded = models.DateTimeField(auto_now_add=True)
    DateUpdated = models.DateTimeField(null=True, blank=True)

    class Meta:
        # managed = False
        db_table = 'M_Entity'
        
    def __str__(self):
        return f'{self.EntityID}'

class M_System(models.Model):
    SystemID = models.BigIntegerField(primary_key=True)
    EntityNameID = models.BigIntegerField(null=True, blank=True)
    SystemCode = models.CharField(max_length=50, null=True, blank=True)
    SystemName = models.CharField(max_length=100, null=True, blank=True)
    SystemDescription = models.TextField(null=True, blank=True)
    ReferenceTableStatusID = models.BigIntegerField(default=1)
    DateAdded = models.DateTimeField(auto_now_add=True)
    DateUpdated = models.DateTimeField(null=True, blank=True)

    class Meta:
        # managed = False
        db_table = 'M_System'
        
    def __str__(self):
        return f'{self.SystemID}'

class M_UserGroup(models.Model):
    UserGroupID = models.BigIntegerField(primary_key=True)
    UserGroupCode = models.CharField(max_length=10, null=True, blank=True)
    UserGroupName = models.CharField(max_length=50, null=True, blank=True)
    ReferenceTableStatusID = models.BigIntegerField(default=1)
    DateAdded = models.DateTimeField(auto_now_add=True)
    DateUpdated = models.DateTimeField(null=True, blank=True)

    class Meta:
        # managed = False
        db_table = 'M_UserGroup'
        
    def __str__(self):
        return f'{self.UserGroupID}'

class M_UserGroupMember(models.Model):
    UserGroupMemberID = models.BigIntegerField(primary_key=True)
    UserGroupID = models.ForeignKey('M_UserGroup', on_delete=models.CASCADE, db_constraint=False, db_column='UserGroupID')
    UserLoginID = models.ForeignKey('M_UserLogin', on_delete=models.CASCADE, db_constraint=False, db_column='UserLoginID')
    EffectiveDate = models.DateTimeField(auto_now_add=True)
    ExpiryDate = models.DateTimeField(null=True, blank=True, default=None)
    ReferenceTableStatusID = models.BigIntegerField(default=1)
    DateAdded = models.DateTimeField(auto_now_add=True)
    DateUpdated = models.DateTimeField(null=True, blank=True)

    class Meta:
        # managed = False
        db_table = 'M_UserGroupMember'
        
    def __str__(self):
        return f'{self.UserGroupMemberID}'

class M_UserLogin(models.Model):
    UserLoginID = models.BigIntegerField(primary_key=True)
    UserLoginEmail = models.CharField(max_length=50, null=True, blank=True)
    UserLoginName = models.CharField(max_length=100)
    UserLoginPassword = models.CharField(max_length=100)
    ReferenceTableStatusID = models.BigIntegerField(default=1)
    DateAdded = models.DateTimeField(auto_now_add=True)
    DateUpdated = models.DateTimeField(null=True, blank=True)

    class Meta:
        # managed = False
        db_table = 'M_UserLogin'
        
    def __str__(self):
        return f'{self.UserLoginID}'

class M_UserMainGroup(models.Model):
    UserMainGroupID = models.BigIntegerField(primary_key=True)
    UserMainGroupName = models.CharField(max_length=50)
    UserMainGroupDescription = models.CharField(max_length=250)
    ReferenceTableStatusID = models.BigIntegerField(default=1)
    DateAdded = models.DateTimeField(auto_now_add=True)
    DateUpdated = models.DateTimeField(null=True, blank=True)

    class Meta:
        # managed = False
        db_table = 'M_UserMainGroup'
        
    def __str__(self):
        return f'{self.UserMainGroupID}'

class M_UserModule(models.Model):
    ModuleID = models.BigIntegerField(primary_key=True)
    SystemID = models.BigIntegerField(null=True, blank=True, default=1)
    ModuleName = models.CharField(max_length=50)
    ModuleController = models.CharField(max_length=50, null=True, blank=True)
    ModuleDescription = models.CharField(max_length=200, null=True, blank=True)
    ModuleParentID = models.BigIntegerField()
    ModuleSequence = models.BigIntegerField(null=True,blank=True)
    IsComponent = models.CharField(max_length=1, null=True,blank=True)
    IsDefaultSystemController = models.CharField(max_length=1, null=True,blank=True)
    ReferenceTableStatusID = models.BigIntegerField(default=1)
    DateAdded = models.DateTimeField(auto_now_add=True)
    DateUpdated = models.DateTimeField(null=True, blank=True)

    class Meta:
        # managed = False
        db_table = 'M_UserModule'
        
    def __str__(self):
        return f'{self.ModuleID}'

class M_UserRights(models.Model):
    UserRightID = models.BigIntegerField(primary_key=True)
    SystemID = models.BigIntegerField(null=True, blank=True)
    BranchID = models.BigIntegerField(null=True, blank=True)
    UserGroupID = models.ForeignKey('M_UserGroup', on_delete=models.CASCADE, db_constraint=False, db_column='UserGroupID')
    UserLoginID = models.ForeignKey('M_UserLogin', on_delete=models.CASCADE, db_constraint=False, db_column='UserLoginID')
    ModuleID = models.ForeignKey('M_UserModule', on_delete=models.CASCADE, db_constraint=False, db_column='ModuleID')    
    IsSystemListAllowed = models.CharField(max_length=1)
    ReferenceTableStatusID = models.BigIntegerField(default=1)
    DateAdded = models.DateTimeField(auto_now_add=True)
    DateUpdated = models.DateTimeField(null=True, blank=True)

    class Meta:
        # managed = False
        db_table = 'M_UserRights'
        
    def __str__(self):
        return f'{self.UserRightID}'
