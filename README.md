# LOGIN ROLES, ACCESS AND PERMISSION

* **INTRODUCTION**
  * The "Login Roles, Access, and Permissions" project provides a secure user authorization system with role-based access control and granular permissions. It enables administrators to define roles and assign permissions to users based on their roles. This allows organizations to manage user access effectively, ensuring authorized users can access specific modules and components. 
 
* **FEATURES**
  * **Features of the project include:**
    * _Role-Based Access Control (RBAC):_
        - Define different roles such as administrator, manager, or regular user.
        - Assign specific permissions to each role based on their responsibilities and access requirements.
        - Users are granted access to modules and components based on their assigned role.
    * _Granular Permissions:_
        - A very detail permissions that control access at the feature or data level.
        - Permissions can be assigned to a group or individual.
        - Allows for precise control over what each user or role can do within the system.
     * _Resource Protection:_
        - Protect sensitive data and functionality by allowing access only to authorized users.
        - Control access to specific features, modules, or sections within the application.
        - Prevent unauthorized users from modifying critical settings or accessing restricted information.
     * _Flexible Configuration:_
        - Allow administrators to customize role definitions, permissions, and access rules.
        - Support dynamic updates to role and permission configurations without requiring code changes.
      * _Scalability and Performance:_
        - The system design handles a large number of users and roles efficiently.
        - The system can scale to ensure efficient performance and handle increasing access demands as the user base grows.
     * _Support multiple entities:_ 
       - The system is designed to handle multiple entities, including organizations, companies, or customers.
       - The system is capable of storing and managing data for each entity separately, ensuring that the information is isolated and organized for each entity.
     * _Support multiple branches per entity:_ 
       - In addition to handling multiple entities, the system is also capable of managing multiple branches or divisions within each entity. This functionality enables the establishment of hierarchical structures within the system, facilitating proper organization and management of different branches.
    * _Support access for groups and individuals:_ 
      - The system provides flexible access control mechanisms to manage permissions for both groups and individual users. This ensures that different groups of users and individual users have varying levels of access rights based on their roles and responsibilities within the system. 
      - The access control mechanism ensures that only authorized individuals or groups can perform specific actions or access designated information. Unauthorized access is prevented, maintaining the security and integrity of the system.
  
* **DATABASE** 
   *  **The structure accommodates a wide range of permissions, roles, and users per entity, per branch, and per system. It can dynamically and easily add both individual and group entities.** 
   * **MYSQL**
   * **Tables**
     * _M_EntityName:_ 
       - This represents the list of companies using the system. It stores information about the companies that are utilizing the system.
     * _M_System:_ 
       - This represents the list of systems that a company is using. It provides details about the various systems employed by a company.
     * _M_Branch:_ 
       - This represents the list of branches of the companies. It stores information about the different branches or divisions within a company.
     * _M_UserLogin:_ 
        - This is where user information is stored and managed. It includes details about the users who have access to the system.
     * _M_UserModule:_
        - This represents the modules or tasks within the system. It defines the specific functionalities or tasks that users can perform.
     * _M_Entity:_ 
        - This represents the connection between a user and the company they belong to. It establishes the relationship between a user and the company they are associated with.
     * _M_UserGroup:_ 
         - This is where permissions are assigned. It defines different groups of users and the permissions associated with each group.
     * _M_UserRights:_ 
         - This is where the assignment of permissions to roles takes place. It specifies the permissions that are granted to specific roles within the system.
     * _M_UserGroupMember:_ 
         - This represents the assignment of users to specific roles and permissions. It establishes which users are assigned to which user groups and their corresponding permissions.
         
   * **Diagram**
       * [Click me for the image](https://github.com/ag2me/authapp/blob/main/app/static/img/erd.jpg)   
   
* **INSTALLATION**
    * **[Clone Repo :](https://github.com/ag2me/authapp.git)** 
    * **Python**
       - Version compatible  from 3.9 to latest
       - Install virtualenv and wrapper
          - pip install virtualenv
          - pip install virtualenvwrapper-win
       - Create virtual using wrapper
         - mkvirtualenv auth_app_3_10
       - Activate virtual
         - workon auth_app_3_10
       - Install requirements
         - pip install -r requirements.txt
  * **Database** 
       - Download and Install MySQL Server (MariaDB). 
       - Please see the screenshot [LINK](https://github.com/ag2me/authapp/blob/main/app/static/img/sql-dump-path.jpg)
       - Create a database named 'authapp' and then restore the dump file to the created database.
       - If you encounter an error like:
                `{
                    "code": 401,
                    "message": "(1449, \"The user specified as a definer ('localhost'@'%') does not exist\")"
                }`
          while using the endpoints, simply add the user 'localhost' to the database SQL login.
   * **EndPoints Tools**
       - Download and Install postman
       - Create a collection name Auth App.
       - Create an 'Add' request for each endpoint in the API.    
    * **Unit Test** 
       - Used django built-in test case
      
 # API
   * POST `/api/branches/` Create branch 
   * GET `/api/branches/` Get list of branch 
   * POST `/api/systems/` Create system 
   * GET `/api/systems/` Get list of system 
   * POST `/api/modules/` Create module 
   * GET `/api/modules/` Get list of  module 
   * POST `/api/roles/`  Create roles 
   * GET `/api/roles/` Get available roles
   * POST `/api/permissions/` Create permission 
   * GET `/api/permissions/` Get available permission 
   * POST `/api/roles/<int:id>/permissions/` Assigning of permission to a role 
   * GET `/api/roles/1/permissions/` Get available permission to a certain role 
   * POST `/api/signup/` Create signup 
   * POST `/api/login/` To login 
   * POST `/api/users/<int:id>/roles/` Adding of list of roles to the user 
   * GET `/api/users/<int:id>/roles/` Getting the list of roles assigned to a user 
   * GET `/api/users/<int:id>/permissions/`  Get list of permissions assigned to a user  
    
 # HOW TO USE API
   * After completing the installations, we can now begin using the system.
      1. Create the Branch.        
         - This endpoint is used to add a branch for a company/entity.
         - HTTP Method: POST
         - Parameters:
           - The endpoint expects the following parameters to be included in the request body:
           - BranchName: Represents the name/location of the branch.
           - EntityNameID: Contains the ID of the associated EntityName being created.
         - Example Request:
           - POST /api/branches/
           - ```json
             {
               "BranchName": "Mabolo",
               "EntityNameID": 1
             }
             ```
          - Example Response:
            - Upon successful creation of the branch, the API will return the following response:
            - ```json
               {
                 "BranchID": 2,
                 "EntityNameID": 1,
                 "BranchName": "Mabolo",
                 "BranchCode": "BFA9"
               }
              ```

      2. To check branch successfully added.
         - This endpoint retrieves a list of branches for the specified company/entity. 
         - It allows you to search for branches based on the branch name.
         - HTTP Method: GET
         - Parameters:
           - search (string): This parameter represents the branch name to search for.
         - Example Request:
           - GET `/api/branches/?search=Mabolo`
         - Example Response:
           - `{
                 "BranchID": 2,
                 "BranchName": "Mabolo",
                 "BranchCode": "BFA9",
                 "EntityNameID": 1,
                 "ReferenceTableStatusID": 1,
                 "DateAdded": "2023-06-11T12:08:05Z",
                 "DateUpdated": null
             }`      
         - To display all modules
             - Request `/api/branches/`
             - Response `[
                            {
                                "BranchID": 1,
                                "BranchName": "Colon",
                                "BranchCode": "Colon",
                                "EntityNameID": 1,
                                "ReferenceTableStatusID": 1,
                                "DateAdded": "2023-06-09T18:24:59Z",
                                "DateUpdated": null
                            },
                            {
                                "BranchID": 2,
                                "BranchName": "Mabolo",
                                "BranchCode": "BFA9",
                                "EntityNameID": 1,
                                "ReferenceTableStatusID": 1,
                                "DateAdded": "2023-06-11T12:08:05Z",
                                "DateUpdated": null
                            }
                        ]` 
                      
      3. Create System.
         - This endpoint is used to add a new system to the specified entity/company.
         - HTTP Method: POST
         - Parameters: 
            - SystemName (string): The name of the system.
            - EntityNameID (integer): The unique identifier of the entity/company.
            - SystemDescription (string): A description of the system.
         - Example Request:
            - POST `/api/systems/`
            -  `{
                    "SystemName": "Realty System",
                    "EntityNameID": 1,
                    "SystemDescription": "For Realty"
                }`
          - Example Response:
             - `{
                    "SystemID": 3,
                    "EntityNameID": 1,
                    "SystemName": "Realty System",
                    "SystemDescription": "For Realty"
                }`
      4. To check if the created system successfully added.
           - This endpoint retrieves a list of system. 
           - It allows you to search for system based on the system name.
           - HTTP Method: GET
           - Parameters:
             - search (string): This parameter represents the system to search for.
           - Example Request:
             - GET `/api/systems/?search=Realty`
           - Example Response:
             - `{
                   "SystemID": 3,
                   "EntityNameID": 1,
                   "SystemCode": null,
                   "SystemName": "Realty System",
                   "SystemDescription": "For Realty",
                   "ReferenceTableStatusID": 1,
                   "DateAdded": "2023-06-11T15:23:56Z",
                   "DateUpdated": null
               }`
            - To display to all
               - Request `/api/systems/`
               - Response `[
                              {
                                  "SystemID": 1,
                                  "EntityNameID": 1,
                                  "SystemCode": "AU",
                                  "SystemName": "Auth System",
                                  "SystemDescription": null,
                                  "ReferenceTableStatusID": 1,
                                  "DateAdded": "2023-06-09T18:38:14Z",
                                  "DateUpdated": null
                              },
                              {
                                  "SystemID": 2,
                                  "EntityNameID": 1,
                                  "SystemCode": null,
                                  "SystemName": "POS System",
                                  "SystemDescription": "This is for cashiering and sales monitoring",
                                  "ReferenceTableStatusID": 1,
                                  "DateAdded": "2023-06-11T11:40:09Z",
                                  "DateUpdated": null
                              }
                          ]` 
      5. Create Module 
          - Refers to the Modules used for the system. 
          - HTTP Method: POST
          - parameters:
             - ModuleName: This parameter represents the name of the module and the navigation.
             - SystemID: This parameter contains the ID of the system being created.
             - ModuleController: This parameter is used for navigation when the IsComponent parameter is set to 'N'.
             - ModuleDescription: This parameter provides a description of the module.
             - ModuleParentID: Set this parameter to either 1 or 0 to indicate the module's parent ID.
             - ModuleSequence: This parameter represents the sequence number of the module.
             - IsDefaultSystemController: Use 'N' if the module is for navigation purposes. Use 'Y' if the module is for permissions such as create, delete, and others.
           - endpoint `api/modules/`
           - Request `{
                           "ModuleName" : "Transaction"
                           ,"SystemID" : 1
                           ,"ModuleController": "transaction/"
                           ,"ModuleDescription": "Transaction of the system"
                           ,"ModuleParentID":"1"
                           ,"ModuleSequence" : 1
                           ,"IsComponent": "N"
                           ,"IsDefaultSystemController":"N"
                       }`
            - Response
                     `{
                         "ModuleID": 2,
                         "SystemID": 1,
                         "ModuleName": "Transaction",
                         "ModuleController": "transaction/",
                         "ModuleDescription": "Transaction of the system",
                         "ModuleParentID": 1,
                         "ModuleSequence": 1,
                         "IsComponent": "N",
                         "IsDefaultSystemController": "N"
                     }`
      6. To verify the modules added.
           * The statement describes a GET method used to retrieve modules. The parameter used is search, which allows for filtering the modules based on their names using a "like" operator.
           - HTTP Method: GET
           - search (string): This parameter represents the branch name to search for.
             - Request `/api/modules/?search=trans`
             - Response `[
                               {
                                   "ModuleID": 2,
                                   "SystemID": 1,
                                   "ModuleName": "Transaction",
                                   "ModuleController": "transaction/",
                                   "ModuleDescription": "Transaction of the system",
                                   "ModuleParentID": 1,
                                   "ModuleSequence": 1,
                                   "IsComponent": "N",
                                   "IsDefaultSystemController": "N",
                                   "ReferenceTableStatusID": 1,
                                   "DateAdded": "2023-06-11T11:13:29Z",
                                   "DateUpdated": null
                               }
                           ]`
           - To display all modules
               - Request `/api/modules/`
               - Response `[
                              {
                                  "ModuleID": 1,
                                  "SystemID": 1,
                                  "ModuleName": "Dashboard",
                                  "ModuleController": "dashboard/",
                                  "ModuleDescription": null,
                                  "ModuleParentID": 1,
                                  "ModuleSequence": 1,
                                  "IsComponent": "N",
                                  "IsDefaultSystemController": "Y",
                                  "ReferenceTableStatusID": 1,
                                  "DateAdded": "2023-06-09T18:49:39Z",
                                  "DateUpdated": null
                              },
                              {
                                  "ModuleID": 2,
                                  "SystemID": 1,
                                  "ModuleName": "Transaction",
                                  "ModuleController": "transaction/",
                                  "ModuleDescription": "Transaction of the system",
                                  "ModuleParentID": 1,
                                  "ModuleSequence": 1,
                                  "IsComponent": "N",
                                  "IsDefaultSystemController": "N",
                                  "ReferenceTableStatusID": 1,
                                  "DateAdded": "2023-06-11T11:13:29Z",
                                  "DateUpdated": null
                              }
                          ]` 

      7. Create Roles
         - Refers to the process of establishing or defining new roles within a system, roles are used to group users based on their                responsibilities, access levels, or job functions. This includes determining the permissions, privileges, and access rights              associated with each role. Roles can be customized to meet specific organizational needs, such as 'administrator,' 'manager,''user,' or others. This is a POST method where UserGroupName is required.
          - Method: POST
          - Parameters:
            - UserGroupName (string): The desired Name of the group.   
         - endpoint `/api/roles/`
          - Request
              `
                {
                    "UserGroupName": "Manager"
                }    
              `
          - Response
              `
                 {
                     "UserGroupID": 5,
                     "UserGroupName": "Manager"
                 }        
              `          
        8.  Get available roles
            - Refers to the action of retrieving or obtaining a list of roles that are available within a system. This functionality allows users      or administrators to view the various roles that have been defined and can be assigned to users. This is a GET method with no required parameters. If you want to display the GroupName, simply use the 'search' parameter and provide the GroupName as the value. The result is displayed in a similar manner to the 'like' operator.
            - Method: GET
            - Parameters:
               - search (string): This is equivalent to a group name.  
            - endpoint `/api/roles/`
            - Request `/api/roles/?search=Manager`
            - Response 
                     `[
                         {
                             "UserGroupID": 3,
                             "UserGroupCode": "HRMAN",
                             "UserGroupName": "HR Manager",
                             "ReferenceTableStatusID": 1,
                             "DateAdded": "2023-06-09T18:45:44Z",
                             "DateUpdated": null
                         },
                         {
                             "UserGroupID": 5,
                             "UserGroupCode": "9989",
                             "UserGroupName": "Manager",
                             "ReferenceTableStatusID": 1,
                             "DateAdded": "2023-06-11T03:54:09Z",
                             "DateUpdated": null
                         }
                     ]`
            - Request `/api/roles/?`
            - Response `[
                          {
                              "UserGroupID": 1,
                              "UserGroupCode": "STF",
                              "UserGroupName": "Associate HR",
                              "ReferenceTableStatusID": 1,
                              "DateAdded": "2023-06-09T18:44:08Z",
                              "DateUpdated": null
                          },
                          {
                              "UserGroupID": 2,
                              "UserGroupCode": "ADIT",
                              "UserGroupName": "Admin IT",
                              "ReferenceTableStatusID": 1,
                              "DateAdded": "2023-06-09T18:44:53Z",
                              "DateUpdated": null
                          },
                          {
                              "UserGroupID": 3,
                              "UserGroupCode": "HRMAN",
                              "UserGroupName": "HR Manager",
                              "ReferenceTableStatusID": 1,
                              "DateAdded": "2023-06-09T18:45:44Z",
                              "DateUpdated": null
                          },
                          {
                              "UserGroupID": 4,
                              "UserGroupCode": "515D",
                              "UserGroupName": "HouseKeeping",
                              "ReferenceTableStatusID": 1,
                              "DateAdded": "2023-06-11T03:51:39Z",
                              "DateUpdated": null
                          },
                          {
                              "UserGroupID": 5,
                              "UserGroupCode": "9989",
                              "UserGroupName": "Manager",
                              "ReferenceTableStatusID": 1,
                              "DateAdded": "2023-06-11T03:54:09Z",
                              "DateUpdated": null
                          }
                     ]`

     9. Create permission
        - Refers to the process of setting up a new authorization level within a system, it involves defining specific rights and privileges for a          group or individual. These rights and privileges determine their access and actions within the system. This is a POST method where in you can      add by individual or by group, depends on the neeed. If the permission you created already exists, the system will update the changes you've made. If not, then the system will insert the permission    
         - endpoint `/api/permissions/`
         - For a group, you need the UserGroupID, which is the ID of the roles created.
            - Request 
               `{
                    "UserGroupID" : 1
                    ,"SystemID" : 1
                    ,"BranchID" : 1
                    ,"ModuleID" : 1
                    ,"IsSystemListAllowed" : "N"
                 }`

            - Response
               `
                 {
                     "UserRightID": 2,
                     "BranchID": 1,
                     "UserGroupID": 1,
                     "UserLoginID": null,
                     "ModuleID": 1,
                     "IsSystemListAllowed": "N"
                 }   
               `
          - For Individual, you need the UserLoginID which is the ID from the Signup created.
             - Request
                 `
                    {
                        "UserLoginID" : 8
                        ,"SystemID" : 1
                        ,"BranchID": 1
                        ,"ModuleID": 1
                        ,"IsSystemListAllowed": "N"
                    }   
                 ` 
              - Response
                 `
                     {
                        "UserRightID": 3,
                        "SystemID": 1,
                        "BranchID": 1,
                        "UserGroupID": null,
                        "UserLoginID": 8,
                        "ModuleID": 1,
                        "IsSystemListAllowed": "N",
                        "ReferenceTableStatusID": 1,
                        "DateAdded": "2023-06-11T05:47:46Z",
                        "DateUpdated": null
                      } `
       10. Get available permission 
            - This refers to the action of retrieving or obtaining a list of permissions available within a system. This functionality allows users or administrators to view the various permissions that have been defined and can be assigned to users or roles. It is a GET method that allows searching by a group or by individual, or displaying the permissions without using `search` as a parameter
            - endpoint `/api/permissions/`
            - For individuals, simply type the username, and it will return all similar names. This search utilizes the 'like' operator.
                 - Request 
                   `/api/permissions/?search=john`
                 - Response
                   `[
                       {
                           "ModuleID": 1,
                           "Desc": "johngaring",
                           "GroupLoginID": 8,
                           "ModuleName": "Dashboard",
                           "Controller": "dashboard/"
                       }
                   ]` 
            - For Group, simply type the GroupName, and it will return all similar groupname. Still utilizes the 'like' operator.
                 - Request `/api/permissions/?search=ass`
                 - Response 
                          `[
                               {
                                   "ModuleID": 1,
                                   "Desc": "Associate HR",
                                   "GroupLoginID": 1,
                                   "ModuleName": "Dashboard",
                                   "Controller": "dashboard/"
                               }
                           ]`
             - For not using search as a parameter.
                  - Request `/api/permissions/`
                  - Response 
                            `
                               [
                                   {
                                       "ModuleID": 1,
                                       "Desc": "Admin IT",
                                       "GroupLoginID": 2,
                                       "ModuleName": "Dashboard",
                                       "Controller": "dashboard/"
                                   },
                                   {
                                       "ModuleID": 1,
                                       "Desc": "Associate HR",
                                       "GroupLoginID": 1,
                                       "ModuleName": "Dashboard",
                                       "Controller": "dashboard/"
                                   },
                                   {
                                       "ModuleID": 1,
                                       "Desc": "johngaring",
                                       "GroupLoginID": 8,
                                       "ModuleName": "Dashboard",
                                       "Controller": "dashboard/"
                                   }
                               ]           
                            `
     11. Assigning of permission to a role. 
         - Refers to the process of granting specific permissions or access rights to a user or role within a system.This process is                 typically performed using a POST method, where `<int:id>` in the endpoints represents the UserLoginID, which uniquely identifies the user or role. 
          - endpoints `/api/roles/<int:id>/permissions/`
          - Request 
              `
                 {
                    "UserGroupID" : 1
                    ,"EffectiveDate": "11/06/2023"
                 }
              `
          - Response
             `
                [
                    {
                        "UserGroupID": 1,
                        "UserLoginID": 2,
                        "UserGroupName": "Associate HR",
                        "UserLoginName": "CharlsDarwin",
                        "UserLoginEmail": "niceman@gmail.com"
                    }
                ]
             `
     12. Get available permission to a certain role
         - Refers to retrieving the list of permissions available for a specific role in a system. This allows administrators to view and           manage the permissions assigned to that role. This is a GET method where `<int:id>` in the endpoints represents the UserGroupID
          - endponts api/roles/<int:id>/permissions/
          - Request `/api/roles/1/permissions/`
          - Response `[
                          {
                              "UserGroupID": 1,
                              "UserLoginID": 3,
                              "UserGroupName": "Associate HR",
                              "UserLoginName": "CharlsDarwin1",
                              "UserLoginEmail": "nice1man@gmail.com"
                          },
                          {
                              "UserGroupID": 1,
                              "UserLoginID": 4,
                              "UserGroupName": "Associate HR",
                              "UserLoginName": "DayanMae",
                              "UserLoginEmail": "dayanmae@gmail.com"
                          },
                          {
                              "UserGroupID": 1,
                              "UserLoginID": 5,
                              "UserGroupName": "Associate HR",
                              "UserLoginName": "DayanMae1",
                              "UserLoginEmail": "dayanma1e@gmail.com"
                          },
                          {
                              "UserGroupID": 1,
                              "UserLoginID": 6,
                              "UserGroupName": "Associate HR",
                              "UserLoginName": "powershell",
                              "UserLoginEmail": "powershell@gmail.com"
                          },
                          {
                              "UserGroupID": 1,
                              "UserLoginID": 8,
                              "UserGroupName": "Associate HR",
                              "UserLoginName": "johngaring",
                              "UserLoginEmail": "ag2@gmail.com"
                          }
                      ]`
      13. Create Signup 
          -  Refers to the action of adding a new user account to the system. 
          -  Make sure to provide the username, email, and password of the user:
          - Method: POST
          - Parameters:
            - username (string): The desired username for the user.
            - email (string): The email address of the user.
            - password (string): The password for the user's account.
          - endpoint `/api/signup`
          - Request
                `{
                 "username": "johngaring"
                 ,"email" : "ag2@gmail.com"
                 ,"password": "qwerty"
               }`
          - Response
              `{
                  "UserLoginID": 8,
                  "UserLoginEmail": "ag2@gmail.comm",
                  "UserLoginName": "johngaring",
                  "ReferenceTableStatusID": 1
                }`
            
      14. To Login
          - To check if a user has been successfully added. 
          - Method: POST
          - Parameters:
             - username (string): This is the username or email that the user provided during the signup process.
              - password (string): This is the password that the user set during the signup process.
          - endpoint `/api/login/`
          - Request  
                 `
                   {
                       "username": "johngaring"
                       ,"password": "qwerty"
                   }
                 `
          - Response
                `
                  [
                      {
                          "UserLoginID": 8,
                          "DefaultBranchID": null,
                          "GroupCode": "STF",
                          "UserLoginName": "johngaring",
                          "UserLoginEmail": "ag2@gmail.com",
                          "BranchID": 1,
                          "BranchName": "Colon",
                          "BranchCode": "Colon",
                          "EntityNameID": null,
                          "EntityName": "Moreton Bay Company",
                          "ModuleController": "dashboard/",
                          "SystemID": 1,
                          "SystemName": "Auth System",
                          "IsSuccess": "1",
                          "Result": "Success",
                          "IsLogin": true
                      }
                  ]
                `
             

     15. Adding of list of roles to the user 
        - The process of assigning multiple roles to a user within a system refers to allowing the user to have access to different sets of permissions and privileges associated with each role. Typically, the assignment of roles to a user is performed using a POST method, where int:id in the endpoints represents the UserLoginID that uniquely identifies the user. To assign multiple roles, you should replace int:id with the actual UserLoginID of the user. Additionally, the 'UserGroupID' parameter is used to specify the group to which each role belongs, and the EffectiveDate parameter is used to determine when the assignment of roles becomes valid
          - endpoints `/api/users/<int:id>/roles/`
             - `/api/users/2/roles/`
          - Request
             `
                {
                   "UserGroupID" : 1
                   ,"EffectiveDate": "11/06/2023"
                }
             `
          - Response
             `
                [
                    {
                        "UserGroupID": 1,
                        "UserLoginID": 2,
                        "UserGroupName": "Associate HR",
                        "UserLoginName": "CharlsDarwin",
                        "UserLoginEmail": "niceman@gmail.com"
                    }
                ]
             `
     16. Getting the list of roles assigned to a user
        - Refers to the action of retrieving the roles that have been added or assigned to a specific user within a system. This functionality allows administrators or authorized individuals to view the roles associated with a particular user. This is accomplished using a GET method, where <int:id> in the endpoints represents the UserLoginID, which uniquely identifies the user.
          - endpoints `/api/users/<int:id>/roles/`
          - Request `/api/users/8/roles/`
          - Response ` 
                      [
                          {
                              "UserGroupID": 1,
                              "UserLoginID": 8,
                              "UserGroupName": "Associate HR",
                              "UserLoginName": "johngaring",
                              "UserLoginEmail": "ag2@gmail.com"
                          },
                          {
                              "UserGroupID": 5,
                              "UserLoginID": 8,
                              "UserGroupName": "Manager",
                              "UserLoginName": "johngaring",
                              "UserLoginEmail": "ag2@gmail.com"
                          }
                      ]
                   `
     17. Get list of permissions assigned to a user
        - Refers to the process of retrieving a collection of permissions that have been granted or assigned to a specific user within a  system. Permissions dictate what actions a user is allowed to access, modify, or execute specific functions. This is a GET method where `<int:id>` in the endpoints represents the UserLoginID.
          - endpoint `/api/users/<int:id>/permissions/`
          - Request `api/users/2/permissions/`
          - Response `[
                        {
                            "ModuleID": 1,
                            "Desc": "CharlsDarwin",
                            "GroupLoginID": 2,
                            "ModuleName": "Dashboard",
                            "Controller": "dashboard/",
                            "ModuleDescription": null,
                            "IsComponent": "N"
                        }
                    ]`

# HOW TO USE UNIT TEST
* python manage.py test
