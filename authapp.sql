/*
SQLyog Ultimate v12.5.1 (64 bit)
MySQL - 11.1.0-MariaDB : Database - authapp
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`authapp` /*!40100 DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci */;

USE `authapp`;

/*Table structure for table `M_Branch` */

DROP TABLE IF EXISTS `M_Branch`;

CREATE TABLE `M_Branch` (
  `BranchID` bigint(20) NOT NULL,
  `BranchName` varchar(50) NOT NULL,
  `BranchCode` varchar(10) NOT NULL,
  `EntityNameID` bigint(20) NOT NULL,
  `ReferenceTableStatusID` int(11) DEFAULT 1 COMMENT '1=active',
  `DateAdded` datetime DEFAULT current_timestamp(),
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`BranchID`),
  KEY `FK_Branch_EntityID` (`EntityNameID`),
  CONSTRAINT `FK_Branch_EntityNameID` FOREIGN KEY (`EntityNameID`) REFERENCES `M_EntityName` (`EntityNameID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

/*Data for the table `M_Branch` */

insert  into `M_Branch`(`BranchID`,`BranchName`,`BranchCode`,`EntityNameID`,`ReferenceTableStatusID`,`DateAdded`,`DateUpdated`) values 
(1,'Mabolo','BFA9',1,1,'2023-06-11 12:08:05',NULL);

/*Table structure for table `M_Entity` */

DROP TABLE IF EXISTS `M_Entity`;

CREATE TABLE `M_Entity` (
  `EntityID` bigint(20) NOT NULL COMMENT 'kung profile ra ang naa value then treat as customer, pero kung naa brannch or division kay treat as employee',
  `EntityNameID` bigint(20) DEFAULT NULL,
  `UserLogInID` bigint(20) DEFAULT NULL,
  `BranchID` bigint(20) NOT NULL,
  `ReferenceTableStatusID` bigint(20) DEFAULT 1,
  `DateAdded` datetime DEFAULT current_timestamp(),
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`EntityID`),
  KEY `FK_Entity_BranchID` (`BranchID`),
  KEY `FK_Entity_ReferenceTableStatusID` (`ReferenceTableStatusID`),
  KEY `FK_FK_Entity_EntityNameID` (`EntityNameID`),
  KEY `FK_Entity_UserLogInID` (`UserLogInID`),
  CONSTRAINT `FK_Entity_BranchID` FOREIGN KEY (`BranchID`) REFERENCES `M_Branch` (`BranchID`),
  CONSTRAINT `FK_Entity_EntityNameID` FOREIGN KEY (`EntityNameID`) REFERENCES `M_EntityName` (`EntityNameID`),
  CONSTRAINT `FK_Entity_UserLogInID` FOREIGN KEY (`UserLogInID`) REFERENCES `M_UserLogin` (`UserLoginID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

/*Data for the table `M_Entity` */

/*Table structure for table `M_EntityName` */

DROP TABLE IF EXISTS `M_EntityName`;

CREATE TABLE `M_EntityName` (
  `EntityNameID` bigint(20) NOT NULL,
  `EntityNameCode` varchar(10) NOT NULL,
  `EntityName` varchar(500) NOT NULL,
  `EntityNameDate` date DEFAULT NULL,
  `ReferenceTableStatusID` bigint(20) DEFAULT 1,
  `DateAdded` datetime DEFAULT current_timestamp(),
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`EntityNameID`),
  UNIQUE KEY `EntityNameCode` (`EntityNameCode`),
  KEY `FK_EntityName_ReferenceTableStatusID` (`ReferenceTableStatusID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

/*Data for the table `M_EntityName` */

insert  into `M_EntityName`(`EntityNameID`,`EntityNameCode`,`EntityName`,`EntityNameDate`,`ReferenceTableStatusID`,`DateAdded`,`DateUpdated`) values 
(1,'MB','Moreton Bay Company','2023-06-09',1,'2023-06-09 18:21:31',NULL);

/*Table structure for table `M_Reference` */

DROP TABLE IF EXISTS `M_Reference`;

CREATE TABLE `M_Reference` (
  `ReferenceID` bigint(20) NOT NULL,
  `ReferenceGroup` varchar(100) DEFAULT NULL,
  `ReferenceCode` char(10) DEFAULT NULL,
  `ReferenceShortDescription` varchar(100) DEFAULT NULL COMMENT 'Use for linking on other table instead of ID For Faster Troubleshooting',
  `ReferenceLongDescription` varchar(200) DEFAULT NULL,
  `ReferenceGroupCode` varchar(20) DEFAULT NULL,
  `ReferenceSequence` int(4) DEFAULT NULL,
  `ReferenceTableStatusID` bigint(20) DEFAULT 1,
  `DateAdded` datetime DEFAULT current_timestamp(),
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`ReferenceID`),
  UNIQUE KEY `ReferenceCode` (`ReferenceCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

/*Data for the table `M_Reference` */

insert  into `M_Reference`(`ReferenceID`,`ReferenceGroup`,`ReferenceCode`,`ReferenceShortDescription`,`ReferenceLongDescription`,`ReferenceGroupCode`,`ReferenceSequence`,`ReferenceTableStatusID`,`DateAdded`,`DateUpdated`) values 
(1,'TableStatus','A','Active','Active',NULL,1,1,'2023-06-09 18:04:03',NULL),
(2,'TableStatus','IA','In-Active','In-Active',NULL,2,1,'2023-06-09 18:04:24',NULL);

/*Table structure for table `M_System` */

DROP TABLE IF EXISTS `M_System`;

CREATE TABLE `M_System` (
  `SystemID` bigint(20) NOT NULL,
  `EntityNameID` bigint(20) DEFAULT NULL,
  `SystemCode` varchar(50) DEFAULT NULL,
  `SystemName` varchar(100) DEFAULT NULL,
  `SystemDescription` text DEFAULT NULL,
  `ReferenceTableStatusID` int(11) DEFAULT 1,
  `DateAdded` datetime DEFAULT current_timestamp(),
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`SystemID`),
  KEY `FK_System_EntityNameID` (`EntityNameID`),
  CONSTRAINT `FK_System_EntityNameID` FOREIGN KEY (`EntityNameID`) REFERENCES `M_EntityName` (`EntityNameID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

/*Data for the table `M_System` */

insert  into `M_System`(`SystemID`,`EntityNameID`,`SystemCode`,`SystemName`,`SystemDescription`,`ReferenceTableStatusID`,`DateAdded`,`DateUpdated`) values 
(1,1,'AU','Auth System',NULL,1,'2023-06-09 18:38:14',NULL),
(2,1,'POSS','POS System','This is for cashiering and sales monitoring',1,'2023-06-11 11:40:09',NULL);

/*Table structure for table `M_UserGroup` */

DROP TABLE IF EXISTS `M_UserGroup`;

CREATE TABLE `M_UserGroup` (
  `UserGroupID` bigint(20) NOT NULL,
  `UserGroupCode` char(10) DEFAULT NULL,
  `UserGroupName` varchar(50) NOT NULL,
  `ReferenceTableStatusID` bigint(20) DEFAULT 1,
  `DateAdded` datetime DEFAULT current_timestamp(),
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`UserGroupID`),
  KEY `FK_UserGroup_ReferenceTableStatusID` (`ReferenceTableStatusID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

/*Data for the table `M_UserGroup` */

/*Table structure for table `M_UserGroupMember` */

DROP TABLE IF EXISTS `M_UserGroupMember`;

CREATE TABLE `M_UserGroupMember` (
  `UserGroupMemberID` bigint(20) NOT NULL,
  `UserGroupID` bigint(20) NOT NULL,
  `UserLoginID` bigint(20) DEFAULT NULL,
  `EffectiveDate` datetime NOT NULL,
  `ExpiryDate` datetime DEFAULT NULL,
  `ReferenceTableStatusID` int(11) DEFAULT 1,
  `DateAdded` datetime DEFAULT current_timestamp(),
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`UserGroupMemberID`),
  KEY `UserGroup_ID` (`UserGroupID`),
  KEY `FK_UserGroupMember_UserloginID` (`UserLoginID`),
  CONSTRAINT `FK_UserGroupMember_UserGroupID` FOREIGN KEY (`UserGroupID`) REFERENCES `M_UserGroup` (`UserGroupID`),
  CONSTRAINT `FK_UserGroupMember_UserloginID` FOREIGN KEY (`UserLoginID`) REFERENCES `M_UserLogin` (`UserLoginID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

/*Data for the table `M_UserGroupMember` */

/*Table structure for table `M_UserLogin` */

DROP TABLE IF EXISTS `M_UserLogin`;

CREATE TABLE `M_UserLogin` (
  `UserLoginID` bigint(20) NOT NULL,
  `UserLoginEmail` varchar(50) DEFAULT NULL,
  `UserLoginName` varchar(100) NOT NULL,
  `UserLoginPassword` varchar(100) NOT NULL,
  `ReferenceTableStatusID` int(11) DEFAULT 1 COMMENT '0=inactive, 1=active',
  `DateAdded` datetime DEFAULT current_timestamp(),
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`UserLoginID`),
  KEY `index_UserLoginName` (`UserLoginName`),
  KEY `index_UserLoginPassword` (`UserLoginPassword`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

/*Data for the table `M_UserLogin` */

/*Table structure for table `M_UserModule` */

DROP TABLE IF EXISTS `M_UserModule`;

CREATE TABLE `M_UserModule` (
  `ModuleID` bigint(20) NOT NULL,
  `SystemID` bigint(20) DEFAULT NULL,
  `ModuleName` varchar(50) NOT NULL,
  `ModuleController` varchar(50) DEFAULT NULL,
  `ModuleDescription` varchar(200) DEFAULT NULL,
  `ModuleParentID` bigint(20) NOT NULL,
  `ModuleSequence` int(11) DEFAULT NULL,
  `IsComponent` char(1) DEFAULT 'N',
  `IsDefaultSystemController` char(1) DEFAULT 'N',
  `ReferenceTableStatusID` bigint(20) DEFAULT 1 COMMENT '0=inactive, 1=active',
  `DateAdded` datetime DEFAULT current_timestamp(),
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`ModuleID`),
  KEY `FK_UserModule_SystemID` (`SystemID`),
  KEY `FK_UserModule_ReferenceTableStatusID` (`ReferenceTableStatusID`),
  CONSTRAINT `FK_UserModule_SystemID` FOREIGN KEY (`SystemID`) REFERENCES `M_System` (`SystemID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

/*Data for the table `M_UserModule` */

insert  into `M_UserModule`(`ModuleID`,`SystemID`,`ModuleName`,`ModuleController`,`ModuleDescription`,`ModuleParentID`,`ModuleSequence`,`IsComponent`,`IsDefaultSystemController`,`ReferenceTableStatusID`,`DateAdded`,`DateUpdated`) values 
(1,1,'Dashboard','dashboard/',NULL,1,1,'N','Y',1,'2023-06-09 18:49:39',NULL),
(2,1,'Transaction','transaction/','Transaction of the system',1,1,'N','N',1,'2023-06-11 11:13:29',NULL);

/*Table structure for table `M_UserRights` */

DROP TABLE IF EXISTS `M_UserRights`;

CREATE TABLE `M_UserRights` (
  `UserRightID` bigint(20) NOT NULL,
  `SystemID` bigint(20) DEFAULT NULL,
  `BranchID` bigint(20) DEFAULT NULL,
  `UserGroupID` bigint(20) DEFAULT NULL,
  `UserLoginID` bigint(20) DEFAULT NULL,
  `ModuleID` bigint(20) NOT NULL,
  `IsSystemListAllowed` char(1) NOT NULL DEFAULT 'N',
  `ReferenceTableStatusID` int(11) DEFAULT 1 COMMENT '0=inactive, 1=active look to reference table',
  `DateAdded` datetime DEFAULT current_timestamp(),
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`UserRightID`),
  KEY `FK_UserRights_UserGroup_ID` (`UserGroupID`),
  KEY `FK_UserRights_Modules_ID` (`ModuleID`),
  KEY `FK_UserRights_UserLoginID` (`UserLoginID`),
  KEY `FK_UserRights_SystemID` (`SystemID`),
  KEY `FK_UserRights_BranchID` (`BranchID`),
  CONSTRAINT `FK_UserRights_BranchID` FOREIGN KEY (`BranchID`) REFERENCES `M_Branch` (`BranchID`),
  CONSTRAINT `FK_UserRights_ModuleID` FOREIGN KEY (`ModuleID`) REFERENCES `M_UserModule` (`ModuleID`),
  CONSTRAINT `FK_UserRights_SystemID` FOREIGN KEY (`SystemID`) REFERENCES `M_System` (`SystemID`),
  CONSTRAINT `FK_UserRights_UserGroupID` FOREIGN KEY (`UserGroupID`) REFERENCES `M_UserGroup` (`UserGroupID`),
  CONSTRAINT `FK_UserRights_UserLoginID` FOREIGN KEY (`UserLoginID`) REFERENCES `M_UserLogin` (`UserLoginID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

/*Data for the table `M_UserRights` */

/*Table structure for table `auth_group` */

DROP TABLE IF EXISTS `auth_group`;

CREATE TABLE `auth_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

/*Data for the table `auth_group` */

/*Table structure for table `auth_group_permissions` */

DROP TABLE IF EXISTS `auth_group_permissions`;

CREATE TABLE `auth_group_permissions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

/*Data for the table `auth_group_permissions` */

/*Table structure for table `auth_permission` */

DROP TABLE IF EXISTS `auth_permission`;

CREATE TABLE `auth_permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

/*Data for the table `auth_permission` */

insert  into `auth_permission`(`id`,`name`,`content_type_id`,`codename`) values 
(1,'Can add log entry',1,'add_logentry'),
(2,'Can change log entry',1,'change_logentry'),
(3,'Can delete log entry',1,'delete_logentry'),
(4,'Can view log entry',1,'view_logentry'),
(5,'Can add permission',2,'add_permission'),
(6,'Can change permission',2,'change_permission'),
(7,'Can delete permission',2,'delete_permission'),
(8,'Can view permission',2,'view_permission'),
(9,'Can add group',3,'add_group'),
(10,'Can change group',3,'change_group'),
(11,'Can delete group',3,'delete_group'),
(12,'Can view group',3,'view_group'),
(13,'Can add user',4,'add_user'),
(14,'Can change user',4,'change_user'),
(15,'Can delete user',4,'delete_user'),
(16,'Can view user',4,'view_user'),
(17,'Can add content type',5,'add_contenttype'),
(18,'Can change content type',5,'change_contenttype'),
(19,'Can delete content type',5,'delete_contenttype'),
(20,'Can view content type',5,'view_contenttype'),
(21,'Can add session',6,'add_session'),
(22,'Can change session',6,'change_session'),
(23,'Can delete session',6,'delete_session'),
(24,'Can view session',6,'view_session'),
(25,'Can add Token',7,'add_token'),
(26,'Can change Token',7,'change_token'),
(27,'Can delete Token',7,'delete_token'),
(28,'Can view Token',7,'view_token'),
(29,'Can add token',8,'add_tokenproxy'),
(30,'Can change token',8,'change_tokenproxy'),
(31,'Can delete token',8,'delete_tokenproxy'),
(32,'Can view token',8,'view_tokenproxy'),
(33,'Can add m_ branch',9,'add_m_branch'),
(34,'Can change m_ branch',9,'change_m_branch'),
(35,'Can delete m_ branch',9,'delete_m_branch'),
(36,'Can view m_ branch',9,'view_m_branch'),
(37,'Can add m_ entity',10,'add_m_entity'),
(38,'Can change m_ entity',10,'change_m_entity'),
(39,'Can delete m_ entity',10,'delete_m_entity'),
(40,'Can view m_ entity',10,'view_m_entity'),
(41,'Can add m_ entity name',11,'add_m_entityname'),
(42,'Can change m_ entity name',11,'change_m_entityname'),
(43,'Can delete m_ entity name',11,'delete_m_entityname'),
(44,'Can view m_ entity name',11,'view_m_entityname'),
(45,'Can add m_ reference',12,'add_m_reference'),
(46,'Can change m_ reference',12,'change_m_reference'),
(47,'Can delete m_ reference',12,'delete_m_reference'),
(48,'Can view m_ reference',12,'view_m_reference'),
(49,'Can add m_ system',13,'add_m_system'),
(50,'Can change m_ system',13,'change_m_system'),
(51,'Can delete m_ system',13,'delete_m_system'),
(52,'Can view m_ system',13,'view_m_system'),
(53,'Can add m_ user group',14,'add_m_usergroup'),
(54,'Can change m_ user group',14,'change_m_usergroup'),
(55,'Can delete m_ user group',14,'delete_m_usergroup'),
(56,'Can view m_ user group',14,'view_m_usergroup'),
(57,'Can add m_ user group member',15,'add_m_usergroupmember'),
(58,'Can change m_ user group member',15,'change_m_usergroupmember'),
(59,'Can delete m_ user group member',15,'delete_m_usergroupmember'),
(60,'Can view m_ user group member',15,'view_m_usergroupmember'),
(61,'Can add m_ user login',16,'add_m_userlogin'),
(62,'Can change m_ user login',16,'change_m_userlogin'),
(63,'Can delete m_ user login',16,'delete_m_userlogin'),
(64,'Can view m_ user login',16,'view_m_userlogin'),
(65,'Can add m_ user main group',17,'add_m_usermaingroup'),
(66,'Can change m_ user main group',17,'change_m_usermaingroup'),
(67,'Can delete m_ user main group',17,'delete_m_usermaingroup'),
(68,'Can view m_ user main group',17,'view_m_usermaingroup'),
(69,'Can add m_ user module',18,'add_m_usermodule'),
(70,'Can change m_ user module',18,'change_m_usermodule'),
(71,'Can delete m_ user module',18,'delete_m_usermodule'),
(72,'Can view m_ user module',18,'view_m_usermodule'),
(73,'Can add m_ user rights',19,'add_m_userrights'),
(74,'Can change m_ user rights',19,'change_m_userrights'),
(75,'Can delete m_ user rights',19,'delete_m_userrights'),
(76,'Can view m_ user rights',19,'view_m_userrights');

/*Table structure for table `auth_user` */

DROP TABLE IF EXISTS `auth_user`;

CREATE TABLE `auth_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

/*Data for the table `auth_user` */

/*Table structure for table `auth_user_groups` */

DROP TABLE IF EXISTS `auth_user_groups`;

CREATE TABLE `auth_user_groups` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

/*Data for the table `auth_user_groups` */

/*Table structure for table `auth_user_user_permissions` */

DROP TABLE IF EXISTS `auth_user_user_permissions`;

CREATE TABLE `auth_user_user_permissions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

/*Data for the table `auth_user_user_permissions` */

/*Table structure for table `authtoken_token` */

DROP TABLE IF EXISTS `authtoken_token`;

CREATE TABLE `authtoken_token` (
  `key` varchar(40) NOT NULL,
  `created` datetime(6) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `authtoken_token_user_id_35299eff_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

/*Data for the table `authtoken_token` */

/*Table structure for table `django_admin_log` */

DROP TABLE IF EXISTS `django_admin_log`;

CREATE TABLE `django_admin_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext DEFAULT NULL,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) unsigned NOT NULL CHECK (`action_flag` >= 0),
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

/*Data for the table `django_admin_log` */

/*Table structure for table `django_content_type` */

DROP TABLE IF EXISTS `django_content_type`;

CREATE TABLE `django_content_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

/*Data for the table `django_content_type` */

insert  into `django_content_type`(`id`,`app_label`,`model`) values 
(1,'admin','logentry'),
(9,'app','m_branch'),
(10,'app','m_entity'),
(11,'app','m_entityname'),
(12,'app','m_reference'),
(13,'app','m_system'),
(14,'app','m_usergroup'),
(15,'app','m_usergroupmember'),
(16,'app','m_userlogin'),
(17,'app','m_usermaingroup'),
(18,'app','m_usermodule'),
(19,'app','m_userrights'),
(3,'auth','group'),
(2,'auth','permission'),
(4,'auth','user'),
(7,'authtoken','token'),
(8,'authtoken','tokenproxy'),
(5,'contenttypes','contenttype'),
(6,'sessions','session');

/*Table structure for table `django_migrations` */

DROP TABLE IF EXISTS `django_migrations`;

CREATE TABLE `django_migrations` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

/*Data for the table `django_migrations` */

insert  into `django_migrations`(`id`,`app`,`name`,`applied`) values 
(1,'contenttypes','0001_initial','2023-06-10 02:35:12.366867'),
(2,'auth','0001_initial','2023-06-10 02:35:12.991714'),
(3,'admin','0001_initial','2023-06-10 02:35:13.116686'),
(4,'admin','0002_logentry_remove_auto_add','2023-06-10 02:35:13.116686'),
(5,'admin','0003_logentry_add_action_flag_choices','2023-06-10 02:35:13.132583'),
(6,'app','0001_initial','2023-06-10 02:35:13.147933'),
(7,'contenttypes','0002_remove_content_type_name','2023-06-10 02:35:13.241697'),
(8,'auth','0002_alter_permission_name_max_length','2023-06-10 02:35:13.272945'),
(9,'auth','0003_alter_user_email_max_length','2023-06-10 02:35:13.304142'),
(10,'auth','0004_alter_user_username_opts','2023-06-10 02:35:13.319764'),
(11,'auth','0005_alter_user_last_login_null','2023-06-10 02:35:13.382291'),
(12,'auth','0006_require_contenttypes_0002','2023-06-10 02:35:13.382291'),
(13,'auth','0007_alter_validators_add_error_messages','2023-06-10 02:35:13.397873'),
(14,'auth','0008_alter_user_username_max_length','2023-06-10 02:35:13.429153'),
(15,'auth','0009_alter_user_last_name_max_length','2023-06-10 02:35:13.460390'),
(16,'auth','0010_alter_group_name_max_length','2023-06-10 02:35:13.491642'),
(17,'auth','0011_update_proxy_permissions','2023-06-10 02:35:13.507223'),
(18,'auth','0012_alter_user_first_name_max_length','2023-06-10 02:35:13.538466'),
(19,'authtoken','0001_initial','2023-06-10 02:35:13.600968'),
(20,'authtoken','0002_auto_20160226_1747','2023-06-10 02:35:13.632201'),
(21,'authtoken','0003_tokenproxy','2023-06-10 02:35:13.647811'),
(22,'sessions','0001_initial','2023-06-10 02:35:13.694680');

/*Table structure for table `django_session` */

DROP TABLE IF EXISTS `django_session`;

CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

/*Data for the table `django_session` */

insert  into `django_session`(`session_key`,`session_data`,`expire_date`) values 
('4e6j33gikrzan1r5c89o0e3oxznvzy5k','.eJxNkMtOwzAQRX8l8joClVWTVWnaokqURQPrakimTip7pvJjESH-nTF1CTvfe888PF_qw6N7ZT3SfqPqZak2eIZowtoBdUPyKBpTqhfH8dpwj6pW7fvudKqqZaXKufwNbMouPJAGN5L-H24tjEZS0E8rnd4PHVsB5imLu8h9GjZMf0QefDe3FMYwJXJecPYEPLDDwFSsYSoatlegScoO3EeDDVNwbAw6AXvwwyeD6x8lbycf0OZtbiL3e45hKG6OcHvfxq5D7yVZiD6il4ulw2Q7Ib__VnVwEb9_AAwwdr0:1q8I3Y:EsGWxQ1ZRgFaUJ_AYu11eaNyEmWgo_OMo6kdeBwnPCQ','2023-06-25 10:12:20.312330'),
('lbrccwvfogij2ps7dikx9c9vvcswfa6m','.eJxNkDsPwjAMhP8K8lwJFTGgbqVFqBIw8FjYQmtoJTdGeQwI8d9xaAqM992d7eQJJ4tmw7dOVyVkaQIlXpUntzRK121gkEICa8P-XnCDovOyOgr6FneqD_jMHXFutCLU__aqVx1Bpj1RAr-x6ShivWDi0BtgXDXClXade4Tk96IfEjCfLfKtwC03nrBg7QwToRGrUba9sDLNVPzDwzrs4_pBxAm5d-1kIJKr7MHXNVobl-3Ryp-IGHGIfF4HmTMeX28JmmpA:1q7xd3:CDXYuPkkR1BRoC8jG0t6sG2f7EW5spXzYHrT8rThSdA','2023-06-24 12:23:37.510501');

/* Trigger structure for table `M_UserLogin` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `tr_login_bi` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'localhost' */ /*!50003 TRIGGER `tr_login_bi` BEFORE INSERT ON `M_UserLogin` FOR EACH ROW 
BEGIN
    -- Change the password to hashcode
    SET NEW.`UserLoginPassword` = fn_passwordgenerator(TRIM(NEW.`UserLoginPassword`));
END */$$


DELIMITER ;

/* Function  structure for function  `fn_branch` */

/*!50003 DROP FUNCTION IF EXISTS `fn_branch` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` FUNCTION `fn_branch`($TableID		BIGINT,
	$SearchValue		VARCHAR(1000),
	$Flag			INT
) RETURNS varchar(500) CHARSET utf8mb3 COLLATE utf8mb3_general_ci
    DETERMINISTIC
BEGIN
  DECLARE $_Result 		VARCHAR(500);
  
  CASE 
	WHEN $Flag = 1 THEN
             BEGIN
           
			SET $_Result := (			
					SELECT BranchCode 
					FROM M_Branch 
					WHERE 
						  BranchID 		 = $TableID
					      AND ReferenceTableStatusID = 1 
			);
			
             END; -- end sa flag 1
             
	WHEN $Flag = 2 THEN
             BEGIN            
			SET $_Result := (			
					SELECT BranchName 
					FROM M_Branch 
					WHERE 
						  BranchID 		 = $TableID
					      AND ReferenceTableStatusID = 1 
			);
			
             END; -- end sa flag 2             
  END CASE;
		  	
  RETURN $_Result;
END */$$
DELIMITER ;

/* Function  structure for function  `fn_entity` */

/*!50003 DROP FUNCTION IF EXISTS `fn_entity` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` FUNCTION `fn_entity`($TableID		BIGINT,
	$SearchValue		VARCHAR(1000),
	$Flag			INT
) RETURNS varchar(500) CHARSET utf8mb3 COLLATE utf8mb3_general_ci
    DETERMINISTIC
BEGIN
  DECLARE $_Result 		VARCHAR(500);
  
  CASE 
	WHEN $Flag = 1 THEN
             BEGIN            
			SET $_Result := (			
					SELECT EntityNameID
					FROM `M_Entity` 
						
					WHERE 
						  `UserLogInID` = $TableID
					      AND ReferenceTableStatusID = 1 
			);
			
             END; -- end sa flag 1
	WHEN $Flag = 2 THEN
             BEGIN    
			SET $_Result := (			
					SELECT BranchID
					FROM `M_Entity` 
						
					WHERE 
						  `UserLogInID` = $TableID
					      AND ReferenceTableStatusID = 1 
			);
			
             END; -- end sa flag 2                   
  END CASE;
		  	
  RETURN $_Result;
END */$$
DELIMITER ;

/* Function  structure for function  `fn_entityname` */

/*!50003 DROP FUNCTION IF EXISTS `fn_entityname` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` FUNCTION `fn_entityname`($TableID		BIGINT,
	$SearchValue		VARCHAR(1000),
	$Flag			INT
) RETURNS varchar(500) CHARSET utf8mb3 COLLATE utf8mb3_general_ci
    DETERMINISTIC
BEGIN
  DECLARE $_Result 		VARCHAR(500);
  
  CASE 
	WHEN $Flag = 1 THEN
             BEGIN
            
			SET $_Result := (			
					SELECT EntityName 
					FROM M_EntityName 
					WHERE 
						  EntityNameID 		 = $TableID
					      AND ReferenceTableStatusID = 1 
			);
			
             END; -- end sa flag 1
                 
  END CASE;
		  	
  RETURN $_Result;
END */$$
DELIMITER ;

/* Function  structure for function  `fn_passwordgenerator` */

/*!50003 DROP FUNCTION IF EXISTS `fn_passwordgenerator` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`localhost`@`%` FUNCTION `fn_passwordgenerator`($passwd TEXT
) RETURNS text CHARSET latin1 COLLATE latin1_swedish_ci
BEGIN
/*Testing:
select fn_passwordgenerator('123')
*/
  DECLARE $_salt 	TEXT;
  DECLARE $_hashcode	TEXT;
  
  SET $_salt 		= (SELECT SHA1(CONCAT('Kshdnru1*(#$dkjtnda0!@#fdght', $passwd)) AS salt);
  SET $_hashcode 	= (SELECT SHA1(CONCAT($_salt, $passwd)) AS hash_value);  
  	
  RETURN $_hashcode;
END */$$
DELIMITER ;

/* Function  structure for function  `fn_system` */

/*!50003 DROP FUNCTION IF EXISTS `fn_system` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` FUNCTION `fn_system`($TableID		BIGINT,
	$SearchValue		VARCHAR(1000),
	$Flag			INT
) RETURNS varchar(500) CHARSET utf8mb3 COLLATE utf8mb3_general_ci
    DETERMINISTIC
BEGIN
  DECLARE $_Result 		VARCHAR(500);
  
  CASE 
	WHEN $Flag = 1 THEN
             BEGIN            
			SET $_Result := (			
					SELECT SystemID
					FROM M_System	
					WHERE SystemCode = $SearchValue
					      AND ReferenceTableStatusID = 1 
			);
			
             END; -- end sa flag 1
  END CASE;
		  	
  RETURN $_Result;
END */$$
DELIMITER ;

/* Function  structure for function  `fn_systemname` */

/*!50003 DROP FUNCTION IF EXISTS `fn_systemname` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` FUNCTION `fn_systemname`($SystemCode VARCHAR(50)
) RETURNS varchar(100) CHARSET utf8mb3 COLLATE utf8mb3_general_ci
BEGIN
  DECLARE $_SystemName VARCHAR(100);
		
	SELECT 
		SystemName 
	INTO 
		$_SystemName	
	FROM `dzi`.`M_System`
	WHERE TRIM(SystemCode) = TRIM($SystemCode) 
	    AND ReferenceTableStatusID = 1;		
	
		  	
  RETURN $_SystemName;
END */$$
DELIMITER ;

/* Function  structure for function  `fn_usergroup` */

/*!50003 DROP FUNCTION IF EXISTS `fn_usergroup` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` FUNCTION `fn_usergroup`($TableID		BIGINT,
	$SearchValue		VARCHAR(1000),
	$Flag			INT
) RETURNS varchar(500) CHARSET utf8mb3 COLLATE utf8mb3_general_ci
    DETERMINISTIC
BEGIN
  DECLARE $_Result 		VARCHAR(500);
  
  CASE 
	WHEN $Flag = 1 THEN
             BEGIN
       
			SET $_Result := (			
					SELECT GROUP_CONCAT(B.UserGroupCode SEPARATOR '__') 
					FROM `M_UserGroupMember` A
						join M_UserGroup B on B.UserGroupID = A.UserGroupID
					WHERE 
						  A.`UserLoginID`		= $TableID
					      AND A.ReferenceTableStatusID 	= 1 
					      and B.UserGroupCode is not null
			);
			
             END; -- end sa flag 1
	WHEN $Flag = 2 THEN
             BEGIN         
			SET $_Result := (			
					SELECT 
					    group_concat(DISTINCT `UserGroupID` )
					FROM `M_UserGroupMember` 
					WHERE 
					  `UserLoginID`   	   	= $TableID
					AND `ReferenceTableStatusID` 	= 1 
					AND `ExpiryDate` IS NULL 
					OR (`ExpiryDate` >= NOW() 
					   AND `ReferenceTableStatusID` = 1 
					   AND `UserLoginID` = $TableID)
					order by UserGroupID asc   
			);
			
             END; -- end sa flag 2  
                                            
  END CASE;
		  	
  RETURN $_Result;
END */$$
DELIMITER ;

/* Function  structure for function  `fn_userrights` */

/*!50003 DROP FUNCTION IF EXISTS `fn_userrights` */;
DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` FUNCTION `fn_userrights`($TableID		BIGINT,
	$SearchValue		VARCHAR(1000),
	$Flag			INT
) RETURNS varchar(500) CHARSET utf8mb3 COLLATE utf8mb3_general_ci
    DETERMINISTIC
BEGIN
  DECLARE $_Result 		VARCHAR(500);
  
  CASE 
	WHEN $Flag = 1 THEN
             BEGIN
			/*
				Author          : Armando Garing II
				Table Accessed  : 
				Description     : get fn_userrights status
				DateCreated     : April 10, 2023
				
				Testing  : 
				select fn_dzi_userrights(1,null,1)
			*/             
			SET $_Result := (			
					SELECT ReferenceTableStatusID
					FROM `M_UserRights`	
					WHERE `UserRightID` = $TableID
			);
			
             END; -- end sa flag 1
  END CASE;
		  	
  RETURN $_Result;
END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_userrights` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_userrights` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_userrights`(
	 OUT $ReturnIsSuccess	BIGINT  -- For SP Calling
	  ,$JSON		LONGTEXT
)
BEGIN
	DECLARE $_UserRightID			VARCHAR(10)  DEFAULT NULL;
	DECLARE $_SystemID			VARCHAR(10)  DEFAULT NULL;
	DECLARE $_BranchID			VARCHAR(10) DEFAULT NULL;
	DECLARE $_UserGroupID			VARCHAR(10) DEFAULT NULL;
	DECLARE $_UserLoginID			VARCHAR(10)  DEFAULT NULL;	
	DECLARE $_ModuleID			VARCHAR(10)  DEFAULT NULL;
	DECLARE $_IsSystemListAllowed		VARCHAR(10)  DEFAULT NULL;
	DECLARE $_UserNotes			VARCHAR(10)  DEFAULT NULL;
	DECLARE $_ReferenceTableStatusID  	VARCHAR(10)  DEFAULT NULL;
	DECLARE $_Delimiter 	  	  	VARCHAR(50)  DEFAULT NULL;
	DECLARE $_TransactBy  		  	VARCHAR(10)  DEFAULT NULL;
	DECLARE $_Flag 	 	  	  	VARCHAR(50)  DEFAULT NULL;
	DECLARE $_View 	 	  	  	VARCHAR(50);
	DECLARE $_ErrorMsg 	 	  	VARCHAR(1000);
	DECLARE $_DelimiterData		  	LONGTEXT;
	DECLARE $_ErrorNumber	 	  	INT; 
	
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	 BEGIN
	  GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, 
	   @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT;
	  SET @full_error = @text;
	  SELECT '0' AS 'IsSuccess', @full_error AS 'Result';
	  ROLLBACK;
	 END;	
	
	 SET autocommit 		   := 0;
	 SET max_sp_recursion_depth := 255;
	
	/*Do not remove default common parameter start*/
	SET $_ReferenceTableStatusID  	:= TRIM(JSON_UNQUOTE(JSON_EXTRACT($JSON,"$.ReferenceTableStatusID")));	
	SET $_Delimiter  		:= TRIM(JSON_UNQUOTE(JSON_EXTRACT($JSON,"$.Delimiter")));	
	SET $_TransactBy 		:= TRIM(JSON_UNQUOTE(JSON_EXTRACT($JSON,"$.TransactBy")));	
	SET $_Flag 	 		:= TRIM(JSON_UNQUOTE(JSON_EXTRACT($JSON,"$.Flag")));	
	
	IF $_ReferenceTableStatusID 	= 'NULL' OR $_ReferenceTableStatusID  = '' THEN SET $_ReferenceTableStatusID = NULL; END IF;	
	IF $_Delimiter	  	    	= 'NULL' OR $_Delimiter   	      = '' THEN SET $_Delimiter  	     = NULL; END IF;			
	IF $_TransactBy   	    	= 'NULL' OR $_TransactBy  	      = '' THEN SET $_TransactBy 	     = NULL; END IF;			
	IF $_Flag 	  	    	= 'NULL' OR $_Flag 	    	      = '' THEN SET $_Flag       	     = NULL; END IF;			
	/*Do not remove default common parameter end*/		
		
	 CASE $_Flag
	    WHEN 1 THEN 
		 BEGIN
			/*
			Author		: Armando Garing II
			Description     : insert user rights 
			DateCreated     : June 9, 2023
			
			Module used:		
					
				
			CALL sp_userrights(
				@ReturnIsSuccess		
				,'{
					 "SystemID": "1"
					,"BranchID": "1"						
					,"UserGroupID": "1"	
					,"chk-module": "1"
					,"PermissionType": "1"
					,"TransactBy": "1"						
					,"Flag": "1"
					}' 	
				);
				
			select * from M_UserRights order by UserRightID desc;
							
			*/
			SET $_View 	  := 'userrights_1'; 
			SET $_SystemID	  := TRIM(JSON_UNQUOTE(JSON_EXTRACT($JSON,"$.SystemID")));			
			SET $_BranchID 	  := TRIM(JSON_UNQUOTE(JSON_EXTRACT($JSON,"$.BranchID")));
			SET $_UserGroupID := TRIM(JSON_UNQUOTE(JSON_EXTRACT($JSON,"$.UserGroupID")));
			SET $_UserLoginID := TRIM(JSON_UNQUOTE(JSON_EXTRACT($JSON,"$.UserLoginID")));
			SET $_ModuleID    := TRIM(JSON_UNQUOTE(JSON_EXTRACT($JSON,"$.ModuleID")));
			
			IF $_SystemID 	  = 'NULL' OR $_SystemID	= '' THEN SET $_SystemID 	:= NULL; END IF;			
			IF $_BranchID 	  = 'NULL' OR $_BranchID	= '' THEN SET $_BranchID  	:= NULL; END IF;
			IF $_UserGroupID  = 'NULL' OR $_UserGroupID	= '' THEN SET $_UserGroupID  	:= NULL; END IF;
			IF $_UserLoginID  = 'NULL' OR $_UserLoginID	= '' THEN SET $_UserLoginID  	:= NULL; END IF;
			IF $_ModuleID 	  = 'NULL' OR $_ModuleID	= '' THEN SET $_ModuleID  	:= NULL; END IF;
			
			IF $_SystemID IS NULL THEN
				signal SQLSTATE '45000' SET message_text = 'SystemID is required.';	
			ELSEIF $_BranchID IS NULL THEN
				signal SQLSTATE '45000' SET message_text = 'BranchID is required.';												
			ELSEIF $_ModuleID IS NULL THEN
				signal SQLSTATE '45000' SET message_text = 'ModuleID is required.';																								
			ELSE 
			
				IF EXISTS(SELECT * FROM M_UserRights
						WHERE `SystemID` 	= $_SystemID
						  AND `BranchID` 	= $_BranchID
						  AND `UserGroupID`	= $_UserGroupID
						  AND `ModuleID` 	= $_ModuleID) THEN
					
					-- get userrights ID
					SET @_UserRightID = (
								SELECT UserRightID FROM M_UserRights
								WHERE `SystemID` 	= $_SystemID
								  AND `BranchID` 	= $_BranchID
								  AND `UserGroupID`	= $_UserGroupID
								  AND `ModuleID` 	= $_ModuleID					
					);
					
					SET @_DelimiterData := CONCAT('{
									 "UserRightID": "',@_UserRightID,'"
									,"SystemID": "',$_SystemID,'"
									,"BranchID": "',$_BranchID,'"
									,"UserGroupID": "',$_UserGroupID,'"
									,"ModuleID": "',$_ModuleID,'"
									,"TransactBy": "',$_TransactBy,'"
									,"Delimiter": "SP"
									,"Flag": "2"
								    }');
					
					CALL sp_userrights(
								   @UserRightID		
								  ,@_DelimiterData 	
					);					
					SET $_UserRightID = @UserRightID;
					SET $_ErrorNumber := 103;
					
				ELSEIF EXISTS(SELECT * FROM M_UserRights
						WHERE `SystemID` 	= $_SystemID
						  AND `BranchID` 	= $_BranchID
						  AND `UserLoginID`	= $_UserLoginID
						  AND `ModuleID` 	= $_ModuleID) THEN
					-- get userrights ID
					SET @_UserRightID = (
								SELECT UserRightID FROM M_UserRights
								WHERE `SystemID` 	= $_SystemID
								  AND `BranchID` 	= $_BranchID
								  AND `UserLoginID`	= $_UserLoginID
								  AND `ModuleID` 	= $_ModuleID					
					);
					
					SET @_DelimiterData := CONCAT('{
									 "UserRightID": "',@_UserRightID,'"
									,"SystemID": "',$_SystemID,'"
									,"BranchID": "',$_BranchID,'"
									,"UserLoginID": "',$_UserLoginID,'"
									,"ModuleID": "',$_ModuleID,'"
									,"TransactBy": "',$_TransactBy,'"
									,"Delimiter": "SP"
									,"Flag": "2"
								    }');
					CALL sp_userrights(
								   @UserRightID		
								  ,@_DelimiterData 	
					);					
				ELSE
					SET $_UserRightID = (SELECT IFNULL(MAX(`UserRightID`), 0) + 1 FROM M_UserRights);	
					
					INSERT INTO M_UserRights(
						 `UserRightID`
						,`SystemID`
						,`BranchID`
						,`UserGroupID`
						,`UserLoginID`
						,`ModuleID`
						,`AddedbyUserID`
					)VALUE(
						 $_UserRightID
						,$_SystemID
						,$_BranchID
						,$_UserGroupID
						,$_UserLoginID
						,$_ModuleID
						,$_TransactBy
					);
					
					IF ROW_COUNT() > 0 THEN
						SET $_ErrorMsg = 'Success';
						IF $_Delimiter = 'SP' THEN 
						      SET $_ErrorNumber := 100;        -- return  para sa SP
						ELSE
						      SET $_ErrorNumber := 103;
						END IF;						
					ELSE
						signal SQLSTATE '45000' SET message_text = 'error on insert';	
					END IF;					
				END IF;
				
			 END IF;
		END; -- end of flag 1			
	    WHEN 2 THEN 
		 BEGIN
			/*
			Author		: Armando Garing II
			Description     : insert user rights 
			DateCreated     : June 9, 2023
			
			Module used:		
					
				
			CALL sp_userrights(
				@ReturnIsSuccess		
				,'{
					 "UserRightID": "1"
					,"SystemID": "1"
					,"BranchID": "1"						
					,"UserGroupID": "1"	
					,"ModuleID": "1"
					,"PermissionType": "group"
					,"TransactBy": "1"						
					,"Flag": "2"
					}' 	
				);
			*/
			SET $_View 	  := 'userrights_2'; 
			SET $_UserRightID := TRIM(JSON_UNQUOTE(JSON_EXTRACT($JSON,"$.UserRightID")));			
				
			IF $_UserRightID  = 'NULL' OR $_UserRightID	= '' THEN SET $_UserRightID 	:= NULL; END IF;										
			
			IF $_UserRightID IS NULL THEN
				signal SQLSTATE '45000' SET message_text = 'UserRightID is required.';	
			ELSE 
				-- To do
				-- check the reference table status
				IF fn_userrights($_UserRightID,NULL,1) = 1 THEN
					-- if active. set to inactive				
					SET @_ReferenceTableStatusID = 2;
				ELSE
					-- if inactive. set to active	
					SET @_ReferenceTableStatusID = 1;
				END IF;	
				UPDATE `M_UserRights`
					SET 
						 `ReferenceTableStatusID`	= @_ReferenceTableStatusID
						,`DateUpdated` 			= NOW()
						,`UpdatedByUserID` 		= $_TransactBy
					
				WHERE `UserRightID` = $_UserRightID;
				IF ROW_COUNT() > 0 THEN
					SET $_ErrorMsg = 'Success';
					
					IF $_Delimiter = 'SP' THEN 
					      SET $_ErrorNumber := 100;        -- return  para sa SP
					ELSE
					      SET $_ErrorNumber := 103;
					END IF;	
								
				ELSE
					signal SQLSTATE '45000' SET message_text = 'error on update';	
				END IF;				
				
			 END IF;
		END; -- end of flag 2
	    WHEN 3 THEN 
		BEGIN
			/*
				Author          : Armando Garing II
				Table Accessed  : 
				Description     : insert
				DateCreated     : June 9, 2023
				
				Module Used:
				
				CALL sp_userrights(
						    @ReturnIsSuccess
						,'{
						    "Details":
						    [
							{
							    "SystemID":"4",
							    "BranchID":"1",
							    "UserGroupID":"1",
							    "UserLoginID":"",
							    "ModuleID":"1"
							},
							{
							    "SystemID":"4",
							    "BranchID":"1",
							    "UserGroupID":"1",
							    "UserLoginID":"",
							    "ModuleID":"2"
							},
							{
							    "SystemID":"4",
							    "BranchID":"1",
							    "UserGroupID":"1",
							    "UserLoginID":"",
							    "ModuleID":"3"
							}							
						    ],
						    "TransactBy":"1",
						    "Flag":3						    
						}'
				);
			*/
			SET $_View 		:= 'userrights_3';
			SET @_Data = JSON_EXTRACT($JSON,'$.Details');
			SET @_DataLength = JSON_LENGTH(@_Data);
			SET @row_count = 0;
			SET @i = 0;
			
			WHILE @i < @_DataLength DO
							
				SET $_SystemID 	  = JSON_UNQUOTE(JSON_EXTRACT(@_Data,CONCAT('$[',@i,'].SystemID'))); 				
				SET $_BranchID 	  = JSON_UNQUOTE(JSON_EXTRACT(@_Data,CONCAT('$[',@i,'].BranchID'))); 				
				SET $_UserGroupID = JSON_UNQUOTE(JSON_EXTRACT(@_Data,CONCAT('$[',@i,'].UserGroupID'))); 				
				SET $_UserLoginID = JSON_UNQUOTE(JSON_EXTRACT(@_Data,CONCAT('$[',@i,'].UserLoginID'))); 				
				SET $_ModuleID 	  = JSON_UNQUOTE(JSON_EXTRACT(@_Data,CONCAT('$[',@i,'].ModuleID'))); 				
				
				IF $_SystemID 	  = 'NULL' OR $_SystemID    = '' THEN SET $_SystemID    = NULL; END IF;	
				IF $_BranchID 	  = 'NULL' OR $_BranchID    = '' THEN SET $_BranchID    = NULL; END IF;	
				IF $_UserGroupID  = 'NULL' OR $_UserGroupID = '' THEN SET $_UserGroupID = NULL; END IF;							
				IF $_UserLoginID  = 'NULL' OR $_UserLoginID = '' THEN SET $_UserLoginID = NULL; END IF;							
				IF $_ModuleID     = 'NULL' OR $_ModuleID    = '' THEN SET $_ModuleID    = NULL; END IF;											
				
				IF $_SystemID IS NULL THEN
					signal SQLSTATE '45000' SET message_text = 'SystemID is required.';			
				ELSEIF $_BranchID IS NULL THEN
					signal SQLSTATE '45000' SET message_text = 'BranchID is required.';										
				ELSEIF $_ModuleID IS NULL THEN
					signal SQLSTATE '45000' SET message_text = 'ModuleID is required.';																																																													
				ELSE 
					SET $_UserRightID = (SELECT IFNULL(MAX(`UserRightID`), 0) + 1 FROM M_UserRights);	
					
					SET @_IsUserRightExists = FALSE;						
					IF EXISTS(SELECT * FROM M_UserRights
							WHERE `SystemID` 	= $_SystemID
							  AND `BranchID` 	= $_BranchID
							  AND `UserGroupID`	= $_UserGroupID
							  AND `ModuleID` 	= $_ModuleID) THEN
						SET @_IsUserRightExists = TRUE;		
					ELSEIF EXISTS(SELECT * FROM M_UserRights
							WHERE `SystemID` 	= $_SystemID
							  AND `BranchID` 	= $_BranchID
							  AND `UserLoginID`	= $_UserLoginID
							  AND `ModuleID` 	= $_ModuleID) THEN
						SET @_IsUserRightExists = TRUE;	
					END IF;	
						
					if @_IsUserRightExists = FALSE then
						INSERT INTO M_UserRights(
							 `UserRightID`
							,`SystemID`
							,`BranchID`
							,`UserGroupID`
							,`UserLoginID`
							,`ModuleID`
							,`AddedbyUserID`
						)VALUE(
							 $_UserRightID
							,$_SystemID
							,$_BranchID
							,$_UserGroupID
							,$_UserLoginID
							,$_ModuleID
							,$_TransactBy
						);
						
						IF ROW_COUNT() = 0 THEN								
							signal SQLSTATE '45000' SET message_text = 'Error on userrights detail insert.';	
						END IF;						
					end if;				
					
					SET @row_count = @row_count + 1;
				END IF;						
				SET @i= @i + 1;						
			END WHILE;					
			IF @row_count = @_DataLength THEN
				IF $_Delimiter = 'SP' THEN 
				      SET $_ErrorNumber := 100;        -- return  para sa SP
				ELSE
				      SET $_ErrorNumber := 103;
				END IF;						
			ELSE
				signal SQLSTATE '45000' SET message_text = 'Error on loop';     							
			END IF;					
		END; -- end of flag 3	
	     WHEN 4 THEN 
		BEGIN
			/*
				Author          : Armando Garing II
				Description     : search user rights per login
				DateCreated     : June 9, 2023
			
				Module Used: use in Setup > Manage Permission
				
				CALL sp_userrights(
					   @ReturnIsSuccess		
					  ,'{
						"Flag":"4"
					    }' 	
				);
				
			*/
			SET $_View 	  := 'userrights_4'; 
			SET $_SystemID	  := TRIM(JSON_UNQUOTE(JSON_EXTRACT($JSON,"$.SystemID")));			
			SET $_BranchID 	  := TRIM(JSON_UNQUOTE(JSON_EXTRACT($JSON,"$.BranchID")));
			SET $_UserGroupID := TRIM(JSON_UNQUOTE(JSON_EXTRACT($JSON,"$.UserGroupID")));
			SET $_UserLoginID := TRIM(JSON_UNQUOTE(JSON_EXTRACT($JSON,"$.UserLoginID")));
			SET $_ModuleID    := TRIM(JSON_UNQUOTE(JSON_EXTRACT($JSON,"$.ModuleID")));
			
			IF $_SystemID 	  = 'NULL' OR $_SystemID	= '' THEN SET $_SystemID 	:= NULL; END IF;			
			IF $_BranchID 	  = 'NULL' OR $_BranchID	= '' THEN SET $_BranchID  	:= NULL; END IF;
			IF $_UserGroupID  = 'NULL' OR $_UserGroupID	= '' THEN SET $_UserGroupID  	:= NULL; END IF;
			IF $_UserLoginID  = 'NULL' OR $_UserLoginID	= '' THEN SET $_UserLoginID  	:= NULL; END IF;
			IF $_ModuleID 	  = 'NULL' OR $_ModuleID	= '' THEN SET $_ModuleID  	:= NULL; END IF;								
			SELECT 
			   A.`UserRightID`,
			   A.`SystemID`,
			   A.`BranchID`,
			   A.`UserGroupID`,
			   A.`ModuleID`,
			   A.`UserLoginID`,
			   A.`IsSystemListAllowed`,
			   B.`SystemName`,
			   C.`BranchName`,
			   D.`ModuleName`,
			   ifnull(D.`ModuleController`,'') 	as 'ModuleController',
			   E.`UserLoginName`,
			   G.`ReferenceID`			AS StatusID,
			   G.`ReferenceLongDescription`		AS StatusName
			FROM M_UserRights			A
			   INNER JOIN M_System 			B ON B.`SystemID` 	= A.`SystemID`
			   INNER JOIN M_Branch			C ON C.`BranchID` 	= A.`BranchID`
			   INNER JOIN M_UserModule		D ON D.`ModuleID` 	= A.`ModuleID`	
			   INNER JOIN M_UserLogin 		E ON E.`UserLoginID`	= A.`UserLoginID`
			   INNER JOIN M_Reference		G ON G.`ReferenceID`	= A.`ReferenceTableStatusID`
			WHERE A.`UserRightID` 			= IFNULL($_UserRightID,A.`UserRightID`)
			   AND A.`SystemID`			= IFNULL($_SystemID,A.`SystemID`)
			   AND A.`BranchID`			= IFNULL($_BranchID,A.`BranchID`)
			   AND A.`UserLoginID`			= IFNULL($_UserLoginID,A.`UserLoginID`)
			   AND A.`ModuleID`			= IFNULL($_ModuleID,A.`ModuleID`);
			
			IF $_Delimiter = 'SP' THEN 
			      SET $_ErrorNumber := 104;        -- return  para sa SP
			ELSE						
			      SET $_ErrorNumber := 105;						
			END IF;	
			
		END; -- end of flag 4
	     WHEN 5 THEN 
		BEGIN
			/*
				Author          : Armando Garing II
				Description     : search user rights per group
				DateCreated     : June 9, 2023
			
				Module Used: use in Setup > Manage Permission
				
				CALL sp_userrights(
					   @ReturnIsSuccess		
					  ,'{
						"Flag":"4"
					    }' 	
				);
				
			*/
			SET $_View 	  := 'userrights_5'; 
			SET $_SystemID	  := TRIM(JSON_UNQUOTE(JSON_EXTRACT($JSON,"$.SystemID")));			
			SET $_BranchID 	  := TRIM(JSON_UNQUOTE(JSON_EXTRACT($JSON,"$.BranchID")));
			SET $_UserGroupID := TRIM(JSON_UNQUOTE(JSON_EXTRACT($JSON,"$.GroupID")));
			SET $_UserLoginID := TRIM(JSON_UNQUOTE(JSON_EXTRACT($JSON,"$.UserLoginID")));
			SET $_ModuleID    := TRIM(JSON_UNQUOTE(JSON_EXTRACT($JSON,"$.ModuleID")));
			
			IF $_SystemID 	  = 'NULL' OR $_SystemID	= '' THEN SET $_SystemID 	:= NULL; END IF;			
			IF $_BranchID 	  = 'NULL' OR $_BranchID	= '' THEN SET $_BranchID  	:= NULL; END IF;
			IF $_UserGroupID  = 'NULL' OR $_UserGroupID	= '' THEN SET $_UserGroupID  	:= NULL; END IF;
			IF $_UserLoginID  = 'NULL' OR $_UserLoginID	= '' THEN SET $_UserLoginID  	:= NULL; END IF;
			IF $_ModuleID 	  = 'NULL' OR $_ModuleID	= '' THEN SET $_ModuleID  	:= NULL; END IF;								
			SELECT 
			   A.`UserRightID`,
			   A.`SystemID`,
			   A.`BranchID`,
			   A.`UserGroupID`,
			   A.`ModuleID`,
			   A.`UserLoginID`,
			   A.`IsSystemListAllowed`,
			   B.`SystemName`,
			   C.`BranchName`,
			   D.`ModuleName`,
			   IFNULL(D.`ModuleController`,'') 	AS 'ModuleController',
			   E.`UserGroupName`,
			   F.`ReferenceID`			AS StatusID,
			   F.`ReferenceLongDescription`		AS StatusName
			FROM M_UserRights			A
			   INNER JOIN M_System 			B ON B.`SystemID` 	= A.`SystemID`
			   INNER JOIN M_Branch			C ON C.`BranchID` 	= A.`BranchID`
			   INNER JOIN M_UserModule		D ON D.`ModuleID` 	= A.`ModuleID`	
			   INNER JOIN M_UserGroup 		E ON E.`UserGroupID`	= A.`UserGroupID`
			   INNER JOIN M_Reference		F ON F.`ReferenceID`	= A.`ReferenceTableStatusID`
			WHERE A.`UserRightID` 			= IFNULL($_UserRightID,A.`UserRightID`)
			   AND A.`SystemID`			= IFNULL($_SystemID,A.`SystemID`)
			   AND A.`BranchID`			= IFNULL($_BranchID,A.`BranchID`)
			   AND A.`UserGroupID`			= IFNULL($_UserGroupID,A.`UserGroupID`)
			   AND A.`ModuleID`			= IFNULL($_ModuleID,A.`ModuleID`);
			
			IF $_Delimiter = 'SP' THEN 
			      SET $_ErrorNumber := 104;        -- return  para sa SP
			ELSE						
			      SET $_ErrorNumber := 105;						
			END IF;	
			
		END; -- end of flag 5								
	    ELSE
			signal SQLSTATE '45000' SET message_text = 'Flag is required.';
	 END CASE;
	
	
	/* CATCH PARA SA MGA RETURNS START */
	CASE $_ErrorNumber
	     WHEN 100   THEN -- sp return success
		SET autocommit 	       := 0;
		SET $ReturnIsSuccess   := CAST($_UserRightID AS INT);
	     WHEN 101   THEN -- error return for SP
		SET autocommit         := 0;
		SET $ReturnIsSuccess   := 0;
	     WHEN 102  THEN -- error return for model 
		SET autocommit 	       := 0;
		SELECT
		      0       		AS 'IsSuccess'
		     ,$_ErrorMsg    	AS 'Result';
		ROLLBACK;
	     WHEN 103  THEN
		BEGIN
			SET autocommit := 1;
			
			SELECT
				 A.`UserRightID`
				,A.`SystemID`
				,A.`BranchID`
				,A.`UserGroupID`
				,A.`UserLoginID`
				,A.`ModuleID`
				,A.`IsSystemListAllowed`
				,B.`ReferenceLongDescription` 		AS 'TableStatus'				
				,A.`ReferenceTableStatusID`		AS 'TableStatusID'
				,'1'					AS 'IsSuccess'
				,'Success' 				AS 'Result'
				,$_View 				AS 'View'
			FROM `M_UserRights` A
				JOIN M_Reference B ON B.ReferenceID = A.ReferenceTableStatusID
			WHERE
				 A.`UserRightID` = CAST($_UserRightID AS INT);	        
		END;
	     WHEN 104  THEN -- return for select within the sp
		SET autocommit := 0;
	     WHEN 105  THEN -- return for select where the query is coming from model
		SET autocommit := 1;
	     ELSE
		signal SQLSTATE '45000' SET message_text = 'ErrorNumber is required.';	         
	END CASE;  
	/*CATCH PARA SA MGA RETURNS END*/
	
END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_verifylogin` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_verifylogin` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_verifylogin`(
           OUT $ReturnIsSuccess		BIGINT  -- For SP Calling
	  ,$Json			LONGTEXT
)
BEGIN
DECLARE $_UserID 	   		INT DEFAULT 0;
DECLARE $_UserLogin 	 	  	VARCHAR(50) DEFAULT NULL;
DECLARE $_UserPassword 	  	  	VARCHAR(50) DEFAULT NULL;
DECLARE $_TransactBy 			VARCHAR(50) DEFAULT NULL;
DECLARE $_Flag 	 	  	  	VARCHAR(50);
DECLARE $_Delimiter 	  	  	VARCHAR(50) DEFAULT NULL;
DECLARE $_View 	 	  	  	VARCHAR(50);
DECLARE $_ErrorMsg 	 	  	VARCHAR(1000);
DECLARE $_ErrorNumber	 	  	INT; 	
DECLARE EXIT HANDLER FOR SQLEXCEPTION
 BEGIN
  GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, 
   @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT;
  SET @full_error = @text;
  SELECT '0' AS 'IsSuccess', @full_error AS 'Result';
  ROLLBACK;
END;
	SET autocommit := 0;
	SET max_sp_recursion_depth := 255;
	/*Do not remove default common parameter start*/
	SET $_Delimiter  		:= TRIM(JSON_UNQUOTE(JSON_EXTRACT($JSON,"$.Delimiter")));
	SET $_TransactBy 		:= TRIM(JSON_UNQUOTE(JSON_EXTRACT($JSON,"$.TransactBy")));
	SET $_Flag 	 		:= TRIM(JSON_UNQUOTE(JSON_EXTRACT($JSON,"$.Flag")));
	
	IF $_Delimiter	  	    	= 'NULL' OR $_Delimiter   	      = '' THEN SET $_Delimiter  	     = NULL; END IF;
	IF $_TransactBy   	    	= 'NULL' OR $_TransactBy  	      = '' THEN SET $_TransactBy 	     = NULL; END IF;
	IF $_Flag 	  	    	= 'NULL' OR $_Flag 	    	      = '' THEN SET $_Flag       	     = NULL; END IF;
	/*Do not remove default common parameter end*/
	
	CASE $_Flag
	    WHEN 1 THEN 
		/*
			Author          : Armando Garing Ii	
			Table Accessed  : 
			Description     : 
			DateCreated     : June 9, 2023
				
			Module Used:
			
			CALL sp_verifylogin(
						   @ReturnIsSuccess		
						  ,'{
							 "UserLogin": "ZoiloArnalen"
							,"UserPassword": "DYNqwerty"
							,"UserLogIP": "1.1.1.1"
							,"SystemCode": "AU"
							,"TransactBy": "1"
							,"Flag": "1"
						    }' 	
			);				
			
		*/
		BEGIN
			SET $_View 		:= 'verifylogin_1';
			SET $_UserLogin		:= TRIM(JSON_UNQUOTE(JSON_EXTRACT($Json,"$.UserLogin")));
			SET $_UserPassword	:= TRIM(JSON_UNQUOTE(JSON_EXTRACT($Json,"$.UserPassword")));																		
			SET @_SystemCode 	:= TRIM(JSON_UNQUOTE(JSON_EXTRACT($JSON,"$.SystemCode")));
	
			IF $_UserLogin IS NULL OR $_UserLogin = 'NULL' OR $_UserLogin = '' THEN
				signal SQLSTATE '45000' SET message_text = 'Username is required.';	
			ELSEIF $_UserPassword IS NULL OR $_UserPassword = 'NULL' OR $_UserPassword = '' THEN
				signal SQLSTATE '45000' SET message_text = 'Password is required.';													
			ELSE 
				SET @_UserLogin := TRIM($_UserLogin);
				SET @_Password := fn_passwordgenerator(TRIM($_UserPassword));			
				SET $_UserID := (SELECT 
							`UserLoginID` 
						FROM `M_UserLogin` 
						WHERE 
							    (UserLoginName 		= @_UserLogin OR `UserLoginEmail` = @_UserLogin)
							AND UserLoginPassword 	   = @_Password
							AND ReferenceTableStatusID = 1 -- active
							LIMIT 1);
							
				SET @_GroupIDs := (SELECT fn_usergroup($_UserID ,NULL,2));
				SET @_SystemID := CAST(fn_system(NULL,@_SystemCode,1) AS INT);
							
				SELECT
						 
					 `UserLoginID`
					,fn_entity(`UserLoginID`,NULL,2) AS 'DefaultBranchID'
					,fn_usergroup(UserLoginID,NULL,1) 	AS 'GroupCode'	 
					,`UserLoginID`
					,`UserLoginName`
					,`UserLoginEmail`
					,`BranchID`
					,`BranchName`
					,`BranchCode`
					, fn_entity(UserLogInID,NULL,1) AS 'EntityNameID'
					,`EntityName`
					,`ModuleController`
					,`SystemID`				
					,`SystemName`										
					,'1' 				    AS 'IsSuccess'
					,'Success' 			    AS 'Result'				
				FROM (
					SELECT  DISTINCT
							 C.`UserLoginID`	
							,C.`UserLoginName`
							,C.`UserLoginEmail`		
							,Q.`BranchID`
							,I.`ModuleController`
							,M.`SystemID`				
							,M.`SystemName`
							,fn_branch(Q.BranchID,NULL,1) 		AS 'BranchCode'
							,fn_branch(Q.BranchID,NULL,2) 		AS 'BranchName'
							,fn_entityname(Q.EntityNameID,NULL,1) 	AS 'EntityName'
							,Q.EntityNameID							
					FROM M_UserRights		A
						JOIN  M_UserLogin 		C ON C.`UserLoginID` 	= A.`UserLoginID`
						JOIN  M_UserModule 		I ON I.`ModuleID`	= A.ModuleID     
						JOIN  M_System			M ON M.`SystemID`	= I.`SystemID`
						JOIN  M_Entity 			Q ON Q.BranchID 	= A.BranchID
					WHERE	
								(C.UserLoginName 		= @_UserLogin OR C.`UserLoginEmail` = @_UserLogin)
							AND 	C.`UserLoginPassword`  		= @_Password
							AND 	I.IsDefaultSystemController 	= 'Y'								
							AND 	I.`SystemID` 			= @_SystemID
							AND 	A.`ReferenceTableStatusID` 	= 1 -- active
							AND 	C.`ReferenceTableStatusID` 	= 1 -- active				
							AND 	I.`ReferenceTableStatusID` 	= 1 -- active				
							AND 	M.`ReferenceTableStatusID` 	= 1 -- active	
						
					UNION ALL
						
					SELECT  DISTINCT
							 C.`UserLoginID`	
							,C.`UserLoginName`
							,C.`UserLoginEmail`		
							,Q.`BranchID`
							,I.`ModuleController`
							,M.`SystemID`				
							,M.`SystemName`
							,fn_branch(Q.BranchID,NULL,1) 		AS 'BranchCode'
							,fn_branch(Q.BranchID,NULL,2) 		AS 'BranchName'
							,fn_entityname(Q.EntityNameID,NULL,1) 	AS 'EntityName'
							,Q.EntityNameID						
					FROM M_UserRights			A
						JOIN  M_UserGroup 		G ON G.UserGroupID 		= A.UserGroupID
						JOIN  M_UserGroupMember 	H ON H.UserGroupID		= G.UserGroupID
						JOIN  M_UserLogin 		C ON C.UserLoginID 		= H.`UserLoginID`
						JOIN  M_UserModule 		I ON I.`ModuleID` 		= A.ModuleID AND I.ModuleController IS NOT NULL
						JOIN  M_System			M ON M.`SystemID`		= I.`SystemID`				
						JOIN  M_Entity 			Q ON Q.BranchID 		= A.BranchID
					WHERE
							FIND_IN_SET(A.UserGroupID, @_GroupIDs)
							AND	(C.UserLoginName 		= @_UserLogin OR C.`UserLoginEmail` = @_UserLogin)
							AND 	C.`UserLoginPassword`  		= @_Password
							AND 	I.IsDefaultSystemController 	= 'Y'								
							AND 	I.`SystemID` 			= @_SystemID
							AND 	A.`ReferenceTableStatusID` 	= 1 -- active
							AND 	G.`ReferenceTableStatusID` 	= 1 -- active
							AND 	H.`ReferenceTableStatusID` 	= 1 -- active				
							AND 	C.`ReferenceTableStatusID` 	= 1 -- active				
							AND 	I.`ReferenceTableStatusID` 	= 1 -- active				
							AND 	M.`ReferenceTableStatusID` 	= 1 -- active
				) AS Login LIMIT 1;			
			END IF;
		END; -- end sa $Flag 1	
	    ELSE
		signal SQLSTATE '45000' SET message_text = 'Flag is required.';
	END CASE; 
END */$$
DELIMITER ;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
