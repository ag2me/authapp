# Generated by Django 4.2.2 on 2023-06-10 12:36

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='M_Branch',
            fields=[
                ('BranchID', models.BigIntegerField(primary_key=True, serialize=False)),
                ('BranchName', models.CharField(max_length=50)),
                ('BranchCode', models.CharField(default=None, max_length=10)),
                ('EntityNameID', models.BigIntegerField()),
                ('ReferenceTableStatusID', models.BigIntegerField(default=1)),
                ('DateAdded', models.DateTimeField(auto_now_add=True)),
                ('DateUpdated', models.DateTimeField(blank=True, null=True)),
            ],
            options={
                'db_table': 'M_Branch',
            },
        ),
        migrations.CreateModel(
            name='M_Entity',
            fields=[
                ('EntityID', models.BigIntegerField(primary_key=True, serialize=False)),
                ('EntityNameID', models.BigIntegerField(blank=True, null=True)),
                ('UserLogInID', models.BigIntegerField(blank=True, null=True)),
                ('BranchID', models.BigIntegerField(blank=True, null=True)),
                ('ReferenceTableStatusID', models.BigIntegerField(default=1)),
                ('DateAdded', models.DateTimeField(auto_now_add=True)),
                ('DateUpdated', models.DateTimeField(blank=True, null=True)),
            ],
            options={
                'db_table': 'M_Entity',
            },
        ),
        migrations.CreateModel(
            name='M_EntityName',
            fields=[
                ('EntityNameID', models.BigIntegerField(primary_key=True, serialize=False)),
                ('EntityNameCode', models.CharField(max_length=10)),
                ('EntityName', models.CharField(max_length=500)),
                ('EntityNameDate', models.DateField(blank=True, null=True)),
                ('ReferenceTableStatusID', models.BigIntegerField(default=1)),
                ('DateAdded', models.DateTimeField(auto_now_add=True)),
                ('DateUpdated', models.DateTimeField(blank=True, null=True)),
            ],
            options={
                'db_table': 'M_EntityName',
            },
        ),
        migrations.CreateModel(
            name='M_Reference',
            fields=[
                ('ReferenceID', models.BigIntegerField(primary_key=True, serialize=False)),
                ('ReferenceGroup', models.CharField(blank=True, max_length=100, null=True)),
                ('ReferenceCode', models.CharField(blank=True, max_length=100, null=True)),
                ('ReferenceShortDescription', models.CharField(blank=True, max_length=100, null=True)),
                ('ReferenceLongDescription', models.CharField(blank=True, max_length=200, null=True)),
                ('ReferenceGroupCode', models.CharField(blank=True, max_length=20, null=True)),
                ('ReferenceSequence', models.BigIntegerField(blank=True, null=True)),
                ('ReferenceTableStatusID', models.BigIntegerField(default=1)),
                ('DateAdded', models.DateTimeField(auto_now_add=True)),
                ('DateUpdated', models.DateTimeField(blank=True, null=True)),
            ],
            options={
                'db_table': 'M_Reference',
            },
        ),
        migrations.CreateModel(
            name='M_System',
            fields=[
                ('SystemID', models.BigIntegerField(primary_key=True, serialize=False)),
                ('EntityNameID', models.BigIntegerField(blank=True, null=True)),
                ('SystemCode', models.CharField(blank=True, max_length=50, null=True)),
                ('SystemName', models.CharField(blank=True, max_length=100, null=True)),
                ('SystemDescription', models.TextField(blank=True, null=True)),
                ('ReferenceTableStatusID', models.BigIntegerField(default=1)),
                ('DateAdded', models.DateTimeField(auto_now_add=True)),
                ('DateUpdated', models.DateTimeField(blank=True, null=True)),
            ],
            options={
                'db_table': 'M_System',
            },
        ),
        migrations.CreateModel(
            name='M_UserGroup',
            fields=[
                ('UserGroupID', models.BigIntegerField(primary_key=True, serialize=False)),
                ('UserGroupCode', models.CharField(blank=True, max_length=10, null=True)),
                ('UserGroupName', models.CharField(blank=True, max_length=50, null=True)),
                ('ReferenceTableStatusID', models.BigIntegerField(default=1)),
                ('DateAdded', models.DateTimeField(auto_now_add=True)),
                ('DateUpdated', models.DateTimeField(blank=True, null=True)),
            ],
            options={
                'db_table': 'M_UserGroup',
            },
        ),
        migrations.CreateModel(
            name='M_UserGroupMember',
            fields=[
                ('UserGroupMemberID', models.BigIntegerField(primary_key=True, serialize=False)),
                ('UserGroupID', models.BigIntegerField()),
                ('UserLoginID', models.BigIntegerField(blank=True, null=True)),
                ('EffectiveDate', models.DateTimeField(auto_now_add=True)),
                ('ExpiryDate', models.DateTimeField(blank=True, default=None)),
                ('ReferenceTableStatusID', models.BigIntegerField(default=1)),
                ('DateAdded', models.DateTimeField(auto_now_add=True)),
                ('DateUpdated', models.DateTimeField(blank=True, null=True)),
            ],
            options={
                'db_table': 'M_UserGroupMember',
            },
        ),
        migrations.CreateModel(
            name='M_UserLogin',
            fields=[
                ('UserLoginID', models.BigIntegerField(primary_key=True, serialize=False)),
                ('UserLoginEmail', models.CharField(blank=True, max_length=50, null=True)),
                ('UserLoginName', models.CharField(max_length=100)),
                ('UserLoginPassword', models.CharField(max_length=100)),
                ('ReferenceTableStatusID', models.BigIntegerField(default=1)),
                ('DateAdded', models.DateTimeField(auto_now_add=True)),
                ('DateUpdated', models.DateTimeField(blank=True, null=True)),
            ],
            options={
                'db_table': 'M_UserLogin',
            },
        ),
        migrations.CreateModel(
            name='M_UserMainGroup',
            fields=[
                ('UserMainGroupID', models.BigIntegerField(primary_key=True, serialize=False)),
                ('UserMainGroupName', models.CharField(max_length=50)),
                ('UserMainGroupDescription', models.CharField(max_length=250)),
                ('ReferenceTableStatusID', models.BigIntegerField(default=1)),
                ('DateAdded', models.DateTimeField(auto_now_add=True)),
                ('DateUpdated', models.DateTimeField(blank=True, null=True)),
            ],
            options={
                'db_table': 'M_UserMainGroup',
            },
        ),
        migrations.CreateModel(
            name='M_UserModule',
            fields=[
                ('ModuleID', models.BigIntegerField(primary_key=True, serialize=False)),
                ('SystemID', models.BigIntegerField(blank=True, null=True)),
                ('ModuleName', models.CharField(max_length=50)),
                ('ModuleController', models.CharField(blank=True, max_length=50, null=True)),
                ('ModuleDescription', models.CharField(blank=True, max_length=200, null=True)),
                ('ModuleParentID', models.BigIntegerField()),
                ('ModuleSequence', models.BigIntegerField(blank=True, null=True)),
                ('IsComponent', models.CharField(blank=True, max_length=1, null=True)),
                ('IsDefaultSystemController', models.CharField(blank=True, max_length=1, null=True)),
                ('ReferenceTableStatusID', models.BigIntegerField(default=1)),
                ('DateAdded', models.DateTimeField(auto_now_add=True)),
                ('DateUpdated', models.DateTimeField(blank=True, null=True)),
            ],
            options={
                'db_table': 'M_UserModule',
            },
        ),
        migrations.CreateModel(
            name='M_UserRights',
            fields=[
                ('UserRightID', models.BigIntegerField(primary_key=True, serialize=False)),
                ('SystemID', models.BigIntegerField(blank=True, null=True)),
                ('BranchID', models.BigIntegerField(blank=True, null=True)),
                ('UserGroupID', models.BigIntegerField(blank=True, null=True)),
                ('UserLoginID', models.BigIntegerField(blank=True, null=True)),
                ('ModuleID', models.BigIntegerField()),
                ('IsSystemListAllowed', models.CharField(max_length=1)),
                ('ReferenceTableStatusID', models.BigIntegerField(default=1)),
                ('DateAdded', models.DateTimeField(auto_now_add=True)),
                ('DateUpdated', models.DateTimeField(blank=True, null=True)),
            ],
            options={
                'db_table': 'M_UserRights',
            },
        ),
    ]
