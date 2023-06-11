from django.urls import reverse
from django.test import TestCase
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from rest_framework.test import APIClient
from rest_framework import status
from app.models.authapp import M_UserLogin, M_UserGroup, M_UserGroupMember, M_UserMainGroup
import datetime

class SignupTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.data1 = {                                  # Initialize Sample Data #1
                        'loginid': 2, 
                        'email': 'charls@mail.com',
                        'username': 'charls.c',
                        'password': '12345',
                     }
        
        self.data_with_wrong_email = {                  # Initialize Sample Data #2
                        'loginid': 3,
                        'email': 'charls.mail.com',
                        'username': 'Fe.Ang',
                        'password': '1234'
                     }
        
        self.data_with_empty_username = {               # Initialize Sample Data #3
                        'loginid': 4,
                        'email': 'emptyme1@mail.com',
                        'username': '',
                        'password': '1234'
                     }
        
        self.data_with_empty_email = {                  # Initialize Sample Data #4
                        'loginid': 5,
                        'email': '',
                        'username': 'emptyme2',
                        'password': '1234'
                     }
        
        self.data_with_empty_password = {               # Initialize Sample Data #5
                        'loginid': 6,
                        'email': 'emptyme3@mail.com',
                        'username': 'emptyme3',
                        'password': ''
                     }
        
        self.user_group = M_UserGroup.objects.create(   # Initialize test UserGroup
                        UserGroupID = 1,
                        UserGroupCode = 'STF',
                        UserGroupName = 'TestGroup',
                     )
        
        M_UserMainGroup.objects.create(                 # Initialize test UserMainGroup
                        UserMainGroupID = 1,
                        UserMainGroupName = 'TEST',
                        UserMainGroupDescription = 'Test Description'
                     )
        
      
    def test_signup_duplicate_username(self):
        dummy_user = M_UserLogin.objects.create(        # Create dummy data that have the same username as data1 to treat as a duplicate
                        UserLoginID = 1,
                        UserLoginEmail = 'mail@mail.com',
                        UserLoginName = 'charls.c',
                        UserLoginPassword = '1234',
                     )
        
        M_UserGroupMember.objects.create(               # Create UserGroupMember with dummy_user's id
                        UserGroupMemberID = 1,
                        UserGroupID = self.user_group,
                        UserLoginID = dummy_user
                     )
        
        url = reverse('api:signup')
        
        response = self.client.post(url, self.data1, format='json')
        
        self.assertEqual(response.status_code == 400, True) 
        self.assertEqual(self.data1['username'] == dummy_user.UserLoginName, True)
        
    def test_signup_duplicate_email(self):
        dummy_user = M_UserLogin.objects.create(        # Created dummy_user with same email as data1 to treat as duplicate email
                        UserLoginID = 99,
                        UserLoginEmail = 'charls@mail.com',
                        UserLoginName = 'chuck.c',
                        UserLoginPassword = '1234',
                     )
        
        url = reverse('api:signup')
        
        response = self.client.post(url, self.data1, format='json')
        
        self.assertEqual(response.status_code == 400, True) 
        self.assertEqual(self.data1['email'] == dummy_user.UserLoginEmail, True)
        
    def test_signup_email_format(self):
        url = reverse('api:signup')
        isWrongEmail = ''
        
        wrong_email = self.data1['email']       # Get the wrong email format
        
        try:
            validate_email(wrong_email)                         # validates email, if email is correct
            isWrongEmail = False
            return 1                                            # if data email is validated, test result passed.
        except ValidationError:
            isWrongEmail = True                                 # if data email format is wrong, continue to assertion
            
        response = self.client.post(url, self.data_with_wrong_email, format='json')
        
        self.assertEqual(isWrongEmail, True, 'Test Error: End point accepts unvalidated email')
            
    def test_signup_empty_fields(self):
        url = reverse('api:signup')
            
        response = self.client.post(url, self.data_with_empty_username, format='json')
        self.assertEqual(response.status_code != 400, True, 'Test Error: End point accepts empty username')        
        
        response = self.client.post(url, self.data_with_empty_email, format='json')
        self.assertEqual(response.status_code != 400, True, 'Test Error: End point accepts empty email')
        
        response = self.client.post(url, self.data_with_empty_password, format='json')
        self.assertEqual(response.status_code != 400, True, 'Test Error: End point accepts empty password')
        