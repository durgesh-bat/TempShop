-- MySQL dump 10.13  Distrib 9.2.0, for Win64 (x86_64)
--
-- Host: localhost    Database: tempshop
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `account_address`
--

DROP TABLE IF EXISTS `account_address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account_address` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `label` varchar(50) NOT NULL,
  `street` varchar(255) NOT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `postal_code` varchar(20) NOT NULL,
  `country` varchar(100) NOT NULL,
  `is_default` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `account_address_user_id_a1553eba_fk_account_client_id` (`user_id`),
  CONSTRAINT `account_address_user_id_a1553eba_fk_account_client_id` FOREIGN KEY (`user_id`) REFERENCES `account_client` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_address`
--

LOCK TABLES `account_address` WRITE;
/*!40000 ALTER TABLE `account_address` DISABLE KEYS */;
INSERT INTO `account_address` VALUES (1,'Belwa','Brahmpur','Gorakhpur','UP','273203','India',1,'2025-10-29 14:32:21.143961',1),(2,'Paradise Hostal','Modipuram','Meerut','UP','250110','IN',0,'2025-10-30 04:08:06.304041',1),(3,'Lalapur','Lalapur','gorakhpur','up','273203','India',0,'2025-11-02 05:33:09.492119',6);
/*!40000 ALTER TABLE `account_address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `account_client`
--

DROP TABLE IF EXISTS `account_client`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account_client` (
  `id` bigint NOT NULL AUTO_INCREMENT,
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
  `phone_number` varchar(15) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `email_verification_token` varchar(100) DEFAULT NULL,
  `is_email_verified` tinyint(1) NOT NULL,
  `email_otp` varchar(6) DEFAULT NULL,
  `otp_created_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_client`
--

LOCK TABLES `account_client` WRITE;
/*!40000 ALTER TABLE `account_client` DISABLE KEYS */;
INSERT INTO `account_client` VALUES (1,'pbkdf2_sha256$1000000$ACLkouBW5yPWo4IN84qm1O$Xr2WDabTMBbRTMh1gIAtk4pvvP127JUifhmbZMzIzVM=',NULL,0,'durgesh','Durgesh','Kumar','jarvisjs283@gmail.com',0,1,'2025-10-28 04:17:29.615163','7080594874','image/upload/v1761656456/profiles/Screenshot_From_2025-01-25_18-31-49_vyxf26.png','gE2rITwYsX5ODs9UUl6B2F4NdSt08dFE2uuGri935ps',1,NULL,NULL),(2,'pbkdf2_sha256$1000000$4We4aEWzT7vmpujlNSpa2k$qtju9r3RFpJ6yuzJDMNLADvwbq9454qDhFFhdbcUFnU=','2025-11-02 05:27:00.310800',1,'admin','','','',1,1,'2025-10-28 11:27:43.817835',NULL,NULL,NULL,0,NULL,NULL),(3,'pbkdf2_sha256$1000000$BgykZknj49xQev2eW1whZp$SQmeMSRB/1uveC3B/q7SxeO40+K32Khbc+kSeN8MQdY=',NULL,0,'durgesh1','Durgesh','Kumar','exejarvis@gmail.com',0,1,'2025-10-28 23:14:52.737192','7080594874',NULL,'uw8kKrjLZDEAsYns6b4SrbqR3CA5K5oGzuLue9X2kVE',1,NULL,NULL),(4,'pbkdf2_sha256$1000000$tK82YeiNtYxyfGA2fsl6Iv$7CVdd7nKKwRMWMcduCZB1EjOuawOE/PCved7s59mq9I=',NULL,0,'root','','','root@gmail.com',0,1,'2025-10-29 04:22:39.772056',NULL,NULL,'4lG9Yt1zrtlIUTAOftDgjCc5ZYeYh3xkE_V1mcJJIq4',0,NULL,NULL),(5,'pbkdf2_sha256$1000000$VEup5cE9c32kul8WVwBzJV$Y5+Y5AJTWgqaLaSTqWoplUZhQlSDQmlcDyNGsqfEtQw=',NULL,0,'durgeshshop1','','','codeforge.code@gmail.com',0,1,'2025-10-29 14:47:42.220448',NULL,NULL,'y7k3pM1-xQOPD_6wMoDzysh9Hqd0IasKXjlTDst3soE',0,NULL,NULL),(6,'pbkdf2_sha256$1000000$hzGRsJFwW76ReA1Im3Bg0i$nfX8HqwsiEe0m4RbjO6ipuF7mss4Ll3rEq+vXdRS6to=',NULL,0,'aman','','','thor54876@gmail.com',0,1,'2025-11-02 05:29:20.863434',NULL,NULL,'qaz8JyDksGgpee-6aaUFumzx4bY8M3lLdDcJXQbydeM',0,NULL,NULL),(7,'pbkdf2_sha256$1000000$mzJz0Lp1E25tSpjAKaqOSd$zGUfV1TeRoDPr+0seBKU2IEDB4QcnHPqMPaCPERzHk4=',NULL,0,'rahul','','','rahulchauhan273203@gmail.com',0,1,'2025-11-02 14:33:53.350257',NULL,NULL,'A9hMncz_7Vk2ooQ-boFT2Oel1UOWZRycLfh8rrISGsM',0,NULL,NULL);
/*!40000 ALTER TABLE `account_client` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `account_client_groups`
--

DROP TABLE IF EXISTS `account_client_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account_client_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `client_id` bigint NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `account_client_groups_client_id_group_id_c11fcb23_uniq` (`client_id`,`group_id`),
  KEY `account_client_groups_group_id_68213f09_fk_auth_group_id` (`group_id`),
  CONSTRAINT `account_client_groups_client_id_228dd8b2_fk_account_client_id` FOREIGN KEY (`client_id`) REFERENCES `account_client` (`id`),
  CONSTRAINT `account_client_groups_group_id_68213f09_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_client_groups`
--

LOCK TABLES `account_client_groups` WRITE;
/*!40000 ALTER TABLE `account_client_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `account_client_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `account_client_user_permissions`
--

DROP TABLE IF EXISTS `account_client_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account_client_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `client_id` bigint NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `account_client_user_perm_client_id_permission_id_c2152324_uniq` (`client_id`,`permission_id`),
  KEY `account_client_user__permission_id_8852aa72_fk_auth_perm` (`permission_id`),
  CONSTRAINT `account_client_user__client_id_d4484046_fk_account_c` FOREIGN KEY (`client_id`) REFERENCES `account_client` (`id`),
  CONSTRAINT `account_client_user__permission_id_8852aa72_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_client_user_permissions`
--

LOCK TABLES `account_client_user_permissions` WRITE;
/*!40000 ALTER TABLE `account_client_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `account_client_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `account_notification`
--

DROP TABLE IF EXISTS `account_notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account_notification` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `message` longtext NOT NULL,
  `type` varchar(20) NOT NULL,
  `is_read` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `account_notification_user_id_520fbbdd_fk_account_client_id` (`user_id`),
  CONSTRAINT `account_notification_user_id_520fbbdd_fk_account_client_id` FOREIGN KEY (`user_id`) REFERENCES `account_client` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_notification`
--

LOCK TABLES `account_notification` WRITE;
/*!40000 ALTER TABLE `account_notification` DISABLE KEYS */;
INSERT INTO `account_notification` VALUES (1,'Added to Cart','Classic Black Hooded Sweatshirt has been added to your cart','cart',1,'2025-11-01 19:13:49.480141',1),(2,'Added to Cart','Classic Comfort Fit Joggers has been added to your cart','cart',1,'2025-11-01 19:14:54.902331',1),(3,'Added to Cart','Sleek Wireless Headphone & Inked Earbud Set has been added to your cart','cart',1,'2025-11-02 04:11:43.398024',1),(4,'Added to Cart','Classic Black Hooded Sweatshirt has been added to your cart','cart',0,'2025-11-02 04:41:55.605600',1),(5,'Added to Cart','Classic Black Hooded Sweatshirt has been added to your cart','cart',0,'2025-11-02 04:41:56.510954',1),(6,'Added to Cart','Knoll Saarinen Executive Conference Chair has been added to your cart','cart',0,'2025-11-02 05:30:18.398536',6),(7,'Added to Cart','Knoll Saarinen Executive Conference Chair has been added to your cart','cart',0,'2025-11-02 05:30:19.576250',6),(8,'Added to Cart','Knoll Saarinen Executive Conference Chair has been added to your cart','cart',0,'2025-11-02 05:30:24.485844',6),(9,'Added to Cart','Knoll Saarinen Executive Conference Chair has been added to your cart','cart',0,'2025-11-02 05:30:29.761283',6),(10,'Added to Cart','Knoll Saarinen Executive Conference Chair has been added to your cart','cart',0,'2025-11-02 05:30:36.510023',6),(11,'Added to Cart','Knoll Saarinen Executive Conference Chair has been added to your cart','cart',0,'2025-11-02 05:30:37.707356',6),(12,'Added to Cart','Chanel Coco Noir Eau De has been added to your cart','cart',0,'2025-11-02 07:37:45.097911',1),(13,'Added to Cart','a has been added to your cart','cart',0,'2025-11-02 10:50:40.727916',1);
/*!40000 ALTER TABLE `account_notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `account_order`
--

DROP TABLE IF EXISTS `account_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account_order` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `total` decimal(10,2) NOT NULL,
  `status` varchar(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `address_id` bigint DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `account_order_address_id_03bdd96e_fk_account_address_id` (`address_id`),
  KEY `account_order_user_id_030a18b5_fk_account_client_id` (`user_id`),
  CONSTRAINT `account_order_address_id_03bdd96e_fk_account_address_id` FOREIGN KEY (`address_id`) REFERENCES `account_address` (`id`),
  CONSTRAINT `account_order_user_id_030a18b5_fk_account_client_id` FOREIGN KEY (`user_id`) REFERENCES `account_client` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_order`
--

LOCK TABLES `account_order` WRITE;
/*!40000 ALTER TABLE `account_order` DISABLE KEYS */;
INSERT INTO `account_order` VALUES (1,10624.00,'processing','2025-10-29 14:34:16.302903','2025-10-29 14:37:34.315577',1,1),(2,124499.17,'pending','2025-10-29 14:44:44.393841','2025-10-29 14:44:44.393841',1,1),(3,23999.00,'pending','2025-10-29 14:45:38.723548','2025-10-29 14:45:38.723548',1,1),(4,6557.00,'pending','2025-10-30 01:39:53.996976','2025-10-30 01:39:53.996976',1,1),(5,5478.00,'delivered','2025-10-30 01:40:48.275458','2025-10-30 01:48:37.524935',1,1),(6,1661.70,'delivered','2025-10-30 01:50:08.662552','2025-10-30 01:51:17.649835',1,1),(7,13958.28,'delivered','2025-10-30 01:53:19.008851','2025-10-30 01:53:46.630848',1,1),(8,332.34,'cancelled','2025-10-30 01:54:22.304725','2025-10-30 01:55:48.624312',1,1),(9,166.17,'delivered','2025-10-30 01:56:19.690351','2025-10-30 01:56:49.402241',1,1),(10,166.17,'pending','2025-10-30 02:02:27.581538','2025-10-30 02:02:27.581538',1,1),(11,41749.17,'delivered','2025-11-02 05:33:29.493658','2025-11-02 05:33:59.595856',3,6),(12,50.00,'pending','2025-11-02 10:50:55.219470','2025-11-02 10:50:55.219470',2,1);
/*!40000 ALTER TABLE `account_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `account_orderitem`
--

DROP TABLE IF EXISTS `account_orderitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account_orderitem` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `quantity` int unsigned NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `order_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  `shopkeeper_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `account_orderitem_order_id_d02554da_fk_account_order_id` (`order_id`),
  KEY `account_orderitem_product_id_f37a01dc_fk_product_product_id` (`product_id`),
  KEY `account_orderitem_shopkeeper_id_288b1e4c_fk_shopkeepe` (`shopkeeper_id`),
  CONSTRAINT `account_orderitem_order_id_d02554da_fk_account_order_id` FOREIGN KEY (`order_id`) REFERENCES `account_order` (`id`),
  CONSTRAINT `account_orderitem_product_id_f37a01dc_fk_product_product_id` FOREIGN KEY (`product_id`) REFERENCES `product_product` (`id`),
  CONSTRAINT `account_orderitem_shopkeeper_id_288b1e4c_fk_shopkeepe` FOREIGN KEY (`shopkeeper_id`) REFERENCES `shopkeeper_shopkeeper` (`id`),
  CONSTRAINT `account_orderitem_chk_1` CHECK ((`quantity` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_orderitem`
--

LOCK TABLES `account_orderitem` WRITE;
/*!40000 ALTER TABLE `account_orderitem` DISABLE KEYS */;
INSERT INTO `account_orderitem` VALUES (1,1,6557.00,1,104,NULL),(2,1,4067.00,1,130,NULL),(3,1,124499.17,2,82,NULL),(4,1,23999.00,3,100,NULL),(5,1,5727.00,4,115,NULL),(6,1,830.00,4,119,7),(7,1,5478.00,5,127,2),(8,10,166.17,6,16,2),(9,84,166.17,7,16,2),(10,2,166.17,8,16,NULL),(11,1,166.17,9,16,2),(12,1,41749.17,11,14,9),(13,1,50.00,12,163,2);
/*!40000 ALTER TABLE `account_orderitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `account_paymentmethod`
--

DROP TABLE IF EXISTS `account_paymentmethod`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account_paymentmethod` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `card_type` varchar(10) NOT NULL,
  `last_four` varchar(4) NOT NULL,
  `expiry_month` int unsigned NOT NULL,
  `expiry_year` int unsigned NOT NULL,
  `is_default` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `account_paymentmethod_user_id_e17c200a_fk_account_client_id` (`user_id`),
  CONSTRAINT `account_paymentmethod_user_id_e17c200a_fk_account_client_id` FOREIGN KEY (`user_id`) REFERENCES `account_client` (`id`),
  CONSTRAINT `account_paymentmethod_chk_1` CHECK ((`expiry_month` >= 0)),
  CONSTRAINT `account_paymentmethod_chk_2` CHECK ((`expiry_year` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_paymentmethod`
--

LOCK TABLES `account_paymentmethod` WRITE;
/*!40000 ALTER TABLE `account_paymentmethod` DISABLE KEYS */;
/*!40000 ALTER TABLE `account_paymentmethod` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `account_recentlyviewed`
--

DROP TABLE IF EXISTS `account_recentlyviewed`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account_recentlyviewed` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `viewed_at` datetime(6) NOT NULL,
  `product_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `account_recentlyviewed_user_id_product_id_47a76b7c_uniq` (`user_id`,`product_id`),
  KEY `account_recentlyviewed_product_id_03ead91d_fk_product_product_id` (`product_id`),
  CONSTRAINT `account_recentlyviewed_product_id_03ead91d_fk_product_product_id` FOREIGN KEY (`product_id`) REFERENCES `product_product` (`id`),
  CONSTRAINT `account_recentlyviewed_user_id_74b15fba_fk_account_client_id` FOREIGN KEY (`user_id`) REFERENCES `account_client` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_recentlyviewed`
--

LOCK TABLES `account_recentlyviewed` WRITE;
/*!40000 ALTER TABLE `account_recentlyviewed` DISABLE KEYS */;
INSERT INTO `account_recentlyviewed` VALUES (1,'2025-10-28 13:08:50.371044',47,1),(2,'2025-10-28 13:08:57.275831',44,1),(3,'2025-10-28 13:09:04.180007',41,1),(4,'2025-10-28 13:09:16.829449',18,1),(5,'2025-10-30 02:09:04.237998',16,1),(6,'2025-10-30 02:01:02.903959',3,1),(7,'2025-10-29 04:46:35.465175',51,1),(8,'2025-10-28 13:17:03.951547',14,1),(9,'2025-10-28 13:22:54.941531',20,1),(10,'2025-10-29 14:44:28.338024',82,1),(11,'2025-10-28 23:55:09.215890',78,1),(12,'2025-11-02 08:24:19.281297',99,1),(13,'2025-10-29 02:29:20.450840',132,1),(14,'2025-10-29 02:29:34.741879',136,1),(15,'2025-10-29 02:30:51.114375',138,1),(16,'2025-10-29 02:33:33.869096',49,1),(17,'2025-10-29 03:02:17.262511',130,1),(18,'2025-10-29 14:01:50.912285',80,1),(19,'2025-11-02 08:24:05.482703',100,1),(20,'2025-11-02 04:34:18.680916',12,1),(21,'2025-10-30 01:39:36.335076',119,1),(22,'2025-11-02 12:49:33.748063',115,1),(23,'2025-10-30 02:05:54.089499',103,1),(24,'2025-11-02 08:25:33.737443',102,1),(25,'2025-11-02 07:49:21.378364',2,1),(26,'2025-11-02 04:34:22.249153',11,1),(27,'2025-11-02 08:24:00.728846',7,1),(28,'2025-11-02 05:30:15.814812',14,6),(29,'2025-11-02 07:44:08.330048',79,1),(30,'2025-11-02 08:22:34.911715',84,1),(31,'2025-11-02 08:23:14.843321',93,1),(32,'2025-11-02 08:23:51.067861',38,1),(33,'2025-11-02 08:23:56.672284',42,1),(34,'2025-11-02 08:25:05.442163',111,1),(35,'2025-11-02 12:49:43.410704',150,1),(36,'2025-11-02 11:43:11.025868',163,1);
/*!40000 ALTER TABLE `account_recentlyviewed` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `account_review`
--

DROP TABLE IF EXISTS `account_review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account_review` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `rating` int unsigned NOT NULL,
  `comment` longtext NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `product_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `account_review_user_id_product_id_afb8450f_uniq` (`user_id`,`product_id`),
  KEY `account_review_product_id_99a3f57a_fk_product_product_id` (`product_id`),
  CONSTRAINT `account_review_product_id_99a3f57a_fk_product_product_id` FOREIGN KEY (`product_id`) REFERENCES `product_product` (`id`),
  CONSTRAINT `account_review_user_id_7a6a51f1_fk_account_client_id` FOREIGN KEY (`user_id`) REFERENCES `account_client` (`id`),
  CONSTRAINT `account_review_chk_1` CHECK ((`rating` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_review`
--

LOCK TABLES `account_review` WRITE;
/*!40000 ALTER TABLE `account_review` DISABLE KEYS */;
/*!40000 ALTER TABLE `account_review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `account_wallet`
--

DROP TABLE IF EXISTS `account_wallet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account_wallet` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `balance` decimal(10,2) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `account_wallet_user_id_813ea5a2_fk_account_client_id` FOREIGN KEY (`user_id`) REFERENCES `account_client` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_wallet`
--

LOCK TABLES `account_wallet` WRITE;
/*!40000 ALTER TABLE `account_wallet` DISABLE KEYS */;
INSERT INTO `account_wallet` VALUES (1,0.00,'2025-10-28 13:22:14.033096',1);
/*!40000 ALTER TABLE `account_wallet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `account_wishlist`
--

DROP TABLE IF EXISTS `account_wishlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account_wishlist` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `added_at` datetime(6) NOT NULL,
  `product_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `account_wishlist_user_id_product_id_c035fa07_uniq` (`user_id`,`product_id`),
  KEY `account_wishlist_product_id_c1e92b10_fk_product_product_id` (`product_id`),
  CONSTRAINT `account_wishlist_product_id_c1e92b10_fk_product_product_id` FOREIGN KEY (`product_id`) REFERENCES `product_product` (`id`),
  CONSTRAINT `account_wishlist_user_id_764406d0_fk_account_client_id` FOREIGN KEY (`user_id`) REFERENCES `account_client` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_wishlist`
--

LOCK TABLES `account_wishlist` WRITE;
/*!40000 ALTER TABLE `account_wishlist` DISABLE KEYS */;
INSERT INTO `account_wishlist` VALUES (9,'2025-10-29 14:14:34.639381',130,1),(12,'2025-10-29 14:22:15.641916',51,1),(14,'2025-10-29 14:25:51.039386',100,1),(16,'2025-10-29 14:44:33.602465',82,1),(19,'2025-11-02 07:44:09.444676',79,1);
/*!40000 ALTER TABLE `account_wishlist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `codename` varchar(100) NOT NULL,
  `content_type_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry','add_logentry',1),(2,'Can change log entry','change_logentry',1),(3,'Can delete log entry','delete_logentry',1),(4,'Can view log entry','view_logentry',1),(5,'Can add permission','add_permission',2),(6,'Can change permission','change_permission',2),(7,'Can delete permission','delete_permission',2),(8,'Can view permission','view_permission',2),(9,'Can add group','add_group',3),(10,'Can change group','change_group',3),(11,'Can delete group','delete_group',3),(12,'Can view group','view_group',3),(13,'Can add content type','add_contenttype',4),(14,'Can change content type','change_contenttype',4),(15,'Can delete content type','delete_contenttype',4),(16,'Can view content type','view_contenttype',4),(17,'Can add session','add_session',5),(18,'Can change session','change_session',5),(19,'Can delete session','delete_session',5),(20,'Can view session','view_session',5),(21,'Can add category','add_category',6),(22,'Can change category','change_category',6),(23,'Can delete category','delete_category',6),(24,'Can view category','view_category',6),(25,'Can add product','add_product',7),(26,'Can change product','change_product',7),(27,'Can delete product','delete_product',7),(28,'Can view product','view_product',7),(29,'Can add product image','add_productimage',8),(30,'Can change product image','change_productimage',8),(31,'Can delete product image','delete_productimage',8),(32,'Can view product image','view_productimage',8),(33,'Can add client','add_client',9),(34,'Can change client','change_client',9),(35,'Can delete client','delete_client',9),(36,'Can view client','view_client',9),(37,'Can add address','add_address',10),(38,'Can change address','change_address',10),(39,'Can delete address','delete_address',10),(40,'Can view address','view_address',10),(41,'Can add wallet','add_wallet',11),(42,'Can change wallet','change_wallet',11),(43,'Can delete wallet','delete_wallet',11),(44,'Can view wallet','view_wallet',11),(45,'Can add payment method','add_paymentmethod',12),(46,'Can change payment method','change_paymentmethod',12),(47,'Can delete payment method','delete_paymentmethod',12),(48,'Can view payment method','view_paymentmethod',12),(49,'Can add order','add_order',13),(50,'Can change order','change_order',13),(51,'Can delete order','delete_order',13),(52,'Can view order','view_order',13),(53,'Can add order item','add_orderitem',14),(54,'Can change order item','change_orderitem',14),(55,'Can delete order item','delete_orderitem',14),(56,'Can view order item','view_orderitem',14),(57,'Can add review','add_review',15),(58,'Can change review','change_review',15),(59,'Can delete review','delete_review',15),(60,'Can view review','view_review',15),(61,'Can add wishlist','add_wishlist',16),(62,'Can change wishlist','change_wishlist',16),(63,'Can delete wishlist','delete_wishlist',16),(64,'Can view wishlist','view_wishlist',16),(65,'Can add cart','add_cart',17),(66,'Can change cart','change_cart',17),(67,'Can delete cart','delete_cart',17),(68,'Can view cart','view_cart',17),(69,'Can add cart item','add_cartitem',18),(70,'Can change cart item','change_cartitem',18),(71,'Can delete cart item','delete_cartitem',18),(72,'Can view cart item','view_cartitem',18),(73,'Can add shopkeeper','add_shopkeeper',19),(74,'Can change shopkeeper','change_shopkeeper',19),(75,'Can delete shopkeeper','delete_shopkeeper',19),(76,'Can view shopkeeper','view_shopkeeper',19),(77,'Can add shopkeeper product','add_shopkeeperproduct',20),(78,'Can change shopkeeper product','change_shopkeeperproduct',20),(79,'Can delete shopkeeper product','delete_shopkeeperproduct',20),(80,'Can view shopkeeper product','view_shopkeeperproduct',20),(81,'Can add shopkeeper order','add_shopkeeperorder',21),(82,'Can change shopkeeper order','change_shopkeeperorder',21),(83,'Can delete shopkeeper order','delete_shopkeeperorder',21),(84,'Can view shopkeeper order','view_shopkeeperorder',21),(85,'Can add shopkeeper document','add_shopkeeperdocument',22),(86,'Can change shopkeeper document','change_shopkeeperdocument',22),(87,'Can delete shopkeeper document','delete_shopkeeperdocument',22),(88,'Can view shopkeeper document','view_shopkeeperdocument',22),(89,'Can add shopkeeper review','add_shopkeeperreview',23),(90,'Can change shopkeeper review','change_shopkeeperreview',23),(91,'Can delete shopkeeper review','delete_shopkeeperreview',23),(92,'Can view shopkeeper review','view_shopkeeperreview',23),(93,'Can add recently viewed','add_recentlyviewed',24),(94,'Can change recently viewed','change_recentlyviewed',24),(95,'Can delete recently viewed','delete_recentlyviewed',24),(96,'Can view recently viewed','view_recentlyviewed',24),(97,'Can add revoked token','add_revokedtoken',25),(98,'Can change revoked token','change_revokedtoken',25),(99,'Can delete revoked token','delete_revokedtoken',25),(100,'Can view revoked token','view_revokedtoken',25),(101,'Can add notification','add_notification',26),(102,'Can change notification','change_notification',26),(103,'Can delete notification','delete_notification',26),(104,'Can view notification','view_notification',26);
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_cart`
--

DROP TABLE IF EXISTS `cart_cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_cart` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `cart_cart_user_id_9b4220b9_fk_account_client_id` (`user_id`),
  CONSTRAINT `cart_cart_user_id_9b4220b9_fk_account_client_id` FOREIGN KEY (`user_id`) REFERENCES `account_client` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_cart`
--

LOCK TABLES `cart_cart` WRITE;
/*!40000 ALTER TABLE `cart_cart` DISABLE KEYS */;
INSERT INTO `cart_cart` VALUES (1,'2025-10-28 04:17:45.442296','2025-10-28 04:17:45.442296',1),(2,'2025-10-28 23:14:58.234881','2025-10-28 23:14:58.234881',3),(3,'2025-10-29 04:41:20.788679','2025-10-29 04:41:20.788679',4),(4,'2025-10-29 14:47:46.082852','2025-10-29 14:47:46.082852',5),(5,'2025-11-02 05:29:25.391692','2025-11-02 05:29:25.391692',6),(6,'2025-11-02 14:34:01.022981','2025-11-02 14:34:01.022981',7);
/*!40000 ALTER TABLE `cart_cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_cartitem`
--

DROP TABLE IF EXISTS `cart_cartitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_cartitem` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `quantity` int unsigned NOT NULL,
  `added_at` datetime(6) NOT NULL,
  `cart_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cart_cartitem_cart_id_product_id_53cce7c3_uniq` (`cart_id`,`product_id`),
  KEY `cart_cartitem_product_id_b24e265a_fk_product_product_id` (`product_id`),
  CONSTRAINT `cart_cartitem_cart_id_370ad265_fk_cart_cart_id` FOREIGN KEY (`cart_id`) REFERENCES `cart_cart` (`id`),
  CONSTRAINT `cart_cartitem_product_id_b24e265a_fk_product_product_id` FOREIGN KEY (`product_id`) REFERENCES `product_product` (`id`),
  CONSTRAINT `cart_cartitem_chk_1` CHECK ((`quantity` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_cartitem`
--

LOCK TABLES `cart_cartitem` WRITE;
/*!40000 ALTER TABLE `cart_cartitem` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_cartitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_account_client_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_account_client_id` FOREIGN KEY (`user_id`) REFERENCES `account_client` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
INSERT INTO `django_admin_log` VALUES (1,'2025-10-29 02:06:20.412914','1','Beauty',2,'[{\"changed\": {\"fields\": [\"Name\", \"Image\"]}}]',6,2),(2,'2025-10-29 02:06:35.308684','17','category_B',3,'',6,2),(3,'2025-10-29 02:07:18.393810','2','Fragrances',2,'[{\"changed\": {\"fields\": [\"Name\", \"Image\"]}}]',6,2),(4,'2025-10-29 02:14:22.203540','16','string',3,'',6,2),(5,'2025-10-29 02:16:35.759667','162','a',3,'',7,2),(6,'2025-10-29 02:16:35.759667','161','Test Product',3,'',7,2),(7,'2025-10-29 02:16:35.759667','160','ur-yueyhubrh-bccuntuu-bccry3y-',3,'',7,2),(8,'2025-10-29 02:16:35.759667','159','ac-33u-cub-uuaceuuucybbbrn-aue',3,'',7,2),(9,'2025-10-29 02:16:35.759667','158','naubea3bau3rcucyuun-chauyuuayb',3,'',7,2),(10,'2025-10-29 02:16:35.759667','157','bntuyna-cyaaucarubr3rtutunecun',3,'',7,2),(11,'2025-10-29 02:16:35.759667','156','cunteb3c3-tn3u-tenaunbtbuue33a',3,'',7,2),(12,'2025-10-29 02:16:35.759667','155','string',3,'',7,2),(13,'2025-10-29 02:16:35.759667','154','New Product',3,'',7,2),(14,'2025-10-29 02:16:35.759667','153','hau3ybebytu3uc3uay-eu3abubytbr',3,'',7,2),(15,'2025-10-29 02:16:35.759667','152','-nnaahu-n--nheucrrby-u3hutbtbb',3,'',7,2),(16,'2025-10-29 02:16:35.759667','151','hyeerb3buyurbtb-yaureb-bbbba33',3,'',7,2),(17,'2025-10-29 02:16:35.759667','149','ynth-tnb3eubbbbauytuunartybucb',3,'',7,2),(18,'2025-10-29 02:22:07.274587','3','Furniture',2,'[{\"changed\": {\"fields\": [\"Name\"]}}]',6,2),(19,'2025-10-29 02:22:23.254787','5','Home-decoration',2,'[{\"changed\": {\"fields\": [\"Name\"]}}]',6,2),(20,'2025-10-29 02:22:30.057710','6','Kitchen-accessories',2,'[{\"changed\": {\"fields\": [\"Name\"]}}]',6,2),(21,'2025-10-29 02:22:37.694507','4','Groceries',2,'[{\"changed\": {\"fields\": [\"Name\"]}}]',6,2),(22,'2025-10-29 02:25:56.107699','4','Groceries',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',6,2),(23,'2025-10-29 02:27:21.121160','5','Home-decoration',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',6,2),(24,'2025-10-29 02:38:47.415961','7','Laptops',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',6,2),(25,'2025-10-29 02:40:38.267538','8','Mens-shirts',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',6,2),(26,'2025-10-29 02:41:16.533892','9','Mens-shoes',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',6,2),(27,'2025-10-29 02:41:56.865231','10','Mens-watches',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',6,2),(28,'2025-10-29 02:42:31.652561','6','Kitchen-accessories',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',6,2),(29,'2025-10-29 02:45:53.726101','11','Mobile-accessories',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',6,2),(30,'2025-10-29 14:37:34.317568','1','Order #1 - durgesh',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',13,2),(31,'2025-10-30 01:43:07.284603','5','Order #5 - durgesh',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',13,2),(32,'2025-10-30 01:48:37.524935','5','Order #5 - durgesh',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',13,2),(33,'2025-10-30 01:50:48.230019','6','Order #6 - durgesh',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',13,2),(34,'2025-10-30 01:51:17.649835','6','Order #6 - durgesh',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',13,2),(35,'2025-10-30 01:53:46.630848','7','Order #7 - durgesh',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',13,2),(36,'2025-10-30 01:55:48.624312','8','Order #8 - durgesh',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',13,2),(37,'2025-10-30 01:56:49.402241','9','Order #9 - durgesh',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',13,2),(38,'2025-11-02 05:33:59.595856','11','Order #11 - aman',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',13,2);
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (10,'account','address'),(9,'account','client'),(26,'account','notification'),(13,'account','order'),(14,'account','orderitem'),(12,'account','paymentmethod'),(24,'account','recentlyviewed'),(15,'account','review'),(25,'account','revokedtoken'),(11,'account','wallet'),(16,'account','wishlist'),(1,'admin','logentry'),(3,'auth','group'),(2,'auth','permission'),(17,'cart','cart'),(18,'cart','cartitem'),(4,'contenttypes','contenttype'),(6,'product','category'),(7,'product','product'),(8,'product','productimage'),(5,'sessions','session'),(19,'shopkeeper','shopkeeper'),(22,'shopkeeper','shopkeeperdocument'),(21,'shopkeeper','shopkeeperorder'),(20,'shopkeeper','shopkeeperproduct'),(23,'shopkeeper','shopkeeperreview');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'product','0001_initial','2025-10-28 04:15:14.560796'),(2,'contenttypes','0001_initial','2025-10-28 04:15:14.671418'),(3,'auth','0001_initial','2025-10-28 04:15:15.234001'),(4,'account','0001_initial','2025-10-28 04:15:15.847830'),(5,'account','0002_address_order_orderitem_paymentmethod_wallet_review_and_more','2025-10-28 04:15:18.056875'),(6,'account','0003_client_email_verification_token_and_more','2025-10-28 04:15:18.456759'),(7,'admin','0001_initial','2025-10-28 04:15:18.748007'),(8,'cart','0001_initial','2025-10-28 04:15:19.581462'),(9,'sessions','0001_initial','2025-10-28 04:15:19.662248'),(10,'shopkeeper','0001_initial','2025-10-28 04:15:21.113920'),(11,'account','0004_recentlyviewed','2025-10-28 13:05:29.112045'),(12,'account','0005_client_email_otp_client_otp_created_at','2025-10-28 22:44:58.281453'),(13,'account','0006_revokedtoken','2025-10-29 13:51:33.908666'),(14,'account','0007_orderitem_shopkeeper','2025-10-30 01:30:43.296545'),(15,'account','0008_notification','2025-11-01 15:52:14.519182');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` VALUES ('dcju07kj67ctkdcpz5nq0j4unmema4u0','.eJxVjEEOwiAQRe_C2hAL4wAu3fcMZGBAqgaS0q6Md7dNutDte-__t_C0LsWvPc1-YnEVSpx-WaD4THUX_KB6bzK2usxTkHsiD9vl2Di9bkf7d1Col23t7Jkj5gtBZjQpgwUeAJPiGDZotLZqcAbQMaEjlTFardDojAHQOPH5AuWRN20:1vELfI:oVasZCepPkRmhWZPmVpiNZB22kfduAzrEe0Id0f51Mk','2025-11-13 05:57:40.805381'),('fei2jdhd7sadxqpzh0287s8pnto75agb','.eJxVjEEOwiAQRe_C2hAL4wAu3fcMZGBAqgaS0q6Md7dNutDte-__t_C0LsWvPc1-YnEVSpx-WaD4THUX_KB6bzK2usxTkHsiD9vl2Di9bkf7d1Col23t7Jkj5gtBZjQpgwUeAJPiGDZotLZqcAbQMaEjlTFardDojAHQOPH5AuWRN20:1vEodW:98sl15U6HGiur_GKfQTIGqPEeuuVa5RAHiXf_ejcCs0','2025-11-14 12:53:46.566613'),('xfnlcj090nn9ejx6jpai0jmgkelcv4o6','.eJxVjEEOwiAQRe_C2hAL4wAu3fcMZGBAqgaS0q6Md7dNutDte-__t_C0LsWvPc1-YnEVSpx-WaD4THUX_KB6bzK2usxTkHsiD9vl2Di9bkf7d1Col23t7Jkj5gtBZjQpgwUeAJPiGDZotLZqcAbQMaEjlTFardDojAHQOPH5AuWRN20:1vFQcG:QHfIsQ26YLV3nLSU5YlzzYMmF4fqI9IhUp-kWrwqdm0','2025-11-16 05:27:00.325186');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_category`
--

DROP TABLE IF EXISTS `product_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_category` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(120) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_category`
--

LOCK TABLES `product_category` WRITE;
/*!40000 ALTER TABLE `product_category` DISABLE KEYS */;
INSERT INTO `product_category` VALUES (1,'Beauty','beauty','image/upload/v1761703579/categories/portrait-beautiful-woman-with-makeup-brushes_xf0zvb.jpg','2025-10-28 11:14:00.292774'),(2,'Fragrances','fragrances','image/upload/v1761703637/categories/f_rf97bz.jpg','2025-10-28 11:14:29.443125'),(3,'Furniture','furniture','image/upload/categories/category_furniture','2025-10-28 11:15:08.596389'),(4,'Groceries','groceries','image/upload/v1761704755/categories/Groceries_kgft0u.png','2025-10-28 11:15:48.419759'),(5,'Home-decoration','home-decoration','image/upload/v1761704839/categories/home-decoration_k30fff.png','2025-10-28 11:17:59.011788'),(6,'Kitchen-accessories','kitchen-accessories','image/upload/v1761705750/categories/Kitchen-accessories_ldcgeq.png','2025-10-28 11:18:32.175291'),(7,'Laptops','laptops','image/upload/v1761705526/categories/Laptops_ssysr4.png','2025-10-28 22:41:37.081970'),(8,'Mens-shirts','mens-shirts','image/upload/v1761705637/categories/Mens-shirts_m9u6cc.png','2025-10-28 22:42:20.304185'),(9,'Mens-shoes','mens-shoes','image/upload/v1761705675/categories/Mens-shoes_pso4hh.png','2025-10-28 22:43:07.962550'),(10,'Mens-watches','mens-watches','image/upload/v1761705716/categories/Mens-watches_n7dibh.png','2025-10-28 22:43:49.887648'),(11,'Mobile-accessories','mobile-accessories','image/upload/v1761705951/categories/Mobile-accessories_zca84h.png','2025-10-28 22:44:41.360738'),(12,'Electronics','electronics','categories/category_electronics','2025-10-28 23:33:23.261181'),(13,'Clothes','clothes','categories/category_clothes','2025-10-29 01:56:40.929856'),(14,'Shoes','shoes','categories/category_shoes','2025-10-29 01:56:44.512107'),(15,'Miscellaneous','miscellaneous','categories/category_miscellaneous','2025-10-29 01:56:45.639670'),(18,'Sports','sports',NULL,'2025-11-02 10:49:52.499225');
/*!40000 ALTER TABLE `product_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_product`
--

DROP TABLE IF EXISTS `product_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_product` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(120) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` longtext NOT NULL,
  `rating` double NOT NULL,
  `is_available` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `category_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `product_product_category_id_0c725779_fk_product_category_id` (`category_id`),
  CONSTRAINT `product_product_category_id_0c725779_fk_product_category_id` FOREIGN KEY (`category_id`) REFERENCES `product_category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=164 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_product`
--

LOCK TABLES `product_product` WRITE;
/*!40000 ALTER TABLE `product_product` DISABLE KEYS */;
INSERT INTO `product_product` VALUES (1,'Essence Mascara Lash Princess','essence-mascara-lash-princess',834.17,'The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.',2.56,0,'2025-10-28 11:14:00.301632','2025-10-31 13:07:01.066337',1),(2,'Eyeshadow Palette with Mirror','eyeshadow-palette-with-mirror',1669.17,'The Eyeshadow Palette with Mirror offers a versatile range of eyeshadow shades for creating stunning eye looks. With a built-in mirror, it\'s convenient for on-the-go makeup application.',2.86,1,'2025-10-28 11:14:10.238420','2025-10-28 11:14:10.238420',1),(3,'Powder Canister','powder-canister',1251.67,'The Powder Canister is a finely milled setting powder designed to set makeup and control shine. With a lightweight and translucent formula, it provides a smooth and matte finish.',4.64,0,'2025-10-28 11:14:15.610328','2025-10-30 02:01:02.785138',1),(4,'Red Lipstick','red-lipstick',1084.67,'The Red Lipstick is a classic and bold choice for adding a pop of color to your lips. With a creamy and pigmented formula, it provides a vibrant and long-lasting finish.',4.36,1,'2025-10-28 11:14:19.194011','2025-10-28 11:14:19.195012',1),(5,'Red Nail Polish','red-nail-polish',750.67,'The Red Nail Polish offers a rich and glossy red hue for vibrant and polished nails. With a quick-drying formula, it provides a salon-quality finish at home.',4.32,1,'2025-10-28 11:14:25.361791','2025-10-28 11:14:25.361791',1),(6,'Calvin Klein CK One','calvin-klein-ck-one',4199.50,'CK One by Calvin Klein is a classic unisex fragrance, known for its fresh and clean scent. It\'s a versatile fragrance suitable for everyday wear.',4.37,1,'2025-10-28 11:14:29.449120','2025-11-02 10:25:17.765621',2),(7,'Chanel Coco Noir Eau De','chanel-coco-noir-eau-de',10854.17,'Coco Noir by Chanel is an elegant and mysterious fragrance, featuring notes of grapefruit, rose, and sandalwood. Perfect for evening occasions.',4.26,1,'2025-10-28 11:14:36.466191','2025-10-28 11:14:36.466191',2),(8,'Dior J\'adore','dior-jadore',7514.17,'J\'adore by Dior is a luxurious and floral fragrance, known for its blend of ylang-ylang, rose, and jasmine. It embodies femininity and sophistication.',3.8,1,'2025-10-28 11:14:43.817080','2025-10-28 11:14:43.817080',2),(9,'Dolce Shine Eau de','dolce-shine-eau-de',5844.17,'Dolce Shine by Dolce & Gabbana is a vibrant and fruity fragrance, featuring notes of mango, jasmine, and blonde woods. It\'s a joyful and youthful scent.',3.96,1,'2025-10-28 11:14:53.513600','2025-10-28 11:14:53.513600',2),(10,'Gucci Bloom Eau de','gucci-bloom-eau-de',6679.17,'Gucci Bloom by Gucci is a floral and captivating fragrance, with notes of tuberose, jasmine, and Rangoon creeper. It\'s a modern and romantic scent.',2.74,1,'2025-10-28 11:15:01.620138','2025-10-28 11:15:01.620138',2),(11,'Annibale Colombo Bed','annibale-colombo-bed',158649.17,'The Annibale Colombo Bed is a luxurious and elegant bed frame, crafted with high-quality materials for a comfortable and stylish bedroom.',4.77,1,'2025-10-28 11:15:08.602390','2025-10-28 11:15:08.602390',3),(12,'Annibale Colombo Sofa','annibale-colombo-sofa',208749.17,'The Annibale Colombo Sofa is a sophisticated and comfortable seating option, featuring exquisite design and premium upholstery for your living room.',3.92,1,'2025-10-28 11:15:16.215948','2025-10-28 11:15:16.215948',3),(13,'Bedside Table African Cherry','bedside-table-african-cherry',25049.17,'The Bedside Table in African Cherry is a stylish and functional addition to your bedroom, providing convenient storage space and a touch of elegance.',2.87,1,'2025-10-28 11:15:23.921508','2025-10-28 11:15:23.922517',3),(14,'Knoll Saarinen Executive Conference Chair','knoll-saarinen-executive-conference-chair',41749.17,'The Knoll Saarinen Executive Conference Chair is a modern and ergonomic chair, perfect for your office or conference room with its timeless design.',4.88,1,'2025-10-28 11:15:32.275989','2025-10-28 11:15:32.275989',3),(15,'Wooden Bathroom Sink With Mirror','wooden-bathroom-sink-with-mirror',66799.17,'The Wooden Bathroom Sink with Mirror is a unique and stylish addition to your bathroom, featuring a wooden sink countertop and a matching mirror.',3.59,1,'2025-10-28 11:15:41.141692','2025-10-28 11:15:41.142695',3),(16,'Apple 1Kg','apple',80.00,'Fresh and crisp apples, perfect for snacking or incorporating into various recipes.',4.19,1,'2025-10-28 11:15:48.425758','2025-11-02 14:28:23.296207',4),(17,'Beef Steak','beef-steak',1084.67,'High-quality beef steak, great for grilling or cooking to your preferred level of doneness.',4.47,1,'2025-10-28 11:15:52.718335','2025-10-28 11:15:52.718335',4),(18,'Cat Food','cat-food',750.67,'Nutritious cat food formulated to meet the dietary needs of your feline friend.',3.13,1,'2025-10-28 11:15:56.734666','2025-10-28 11:15:56.734666',4),(19,'Chicken Meat','chicken-meat',834.17,'Fresh and tender chicken meat, suitable for various culinary preparations.',3.19,1,'2025-10-28 11:16:01.563527','2025-10-28 11:16:01.563527',4),(20,'Cooking Oil','cooking-oil',416.67,'Versatile cooking oil suitable for frying, sautéing, and various culinary applications.',4.8,1,'2025-10-28 11:16:10.155442','2025-10-28 11:16:10.155442',4),(21,'Cucumber','cucumber',124.42,'Crisp and hydrating cucumbers, ideal for salads, snacks, or as a refreshing side.',4.07,1,'2025-10-28 11:16:14.654361','2025-10-28 11:16:14.654361',4),(22,'Dog Food','dog-food',917.67,'Specially formulated dog food designed to provide essential nutrients for your canine companion.',4.55,1,'2025-10-28 11:16:19.334818','2025-10-28 11:16:19.334818',4),(23,'Eggs','eggs',249.67,'Fresh eggs, a versatile ingredient for baking, cooking, or breakfast.',2.53,1,'2025-10-28 11:16:23.476348','2025-10-28 11:16:23.476348',4),(24,'Fish Steak','fish-steak',1251.67,'Quality fish steak, suitable for grilling, baking, or pan-searing.',3.78,1,'2025-10-28 11:16:27.173071','2025-10-28 11:16:27.173071',4),(25,'Green Bell Pepper','green-bell-pepper',107.72,'Fresh and vibrant green bell pepper, perfect for adding color and flavor to your dishes.',3.25,1,'2025-10-28 11:16:31.083808','2025-10-28 11:16:31.083808',4),(26,'Green Chili Pepper','green-chili-pepper',82.67,'Spicy green chili pepper, ideal for adding heat to your favorite recipes.',3.66,1,'2025-10-28 11:16:37.332253','2025-10-28 11:16:37.332253',4),(27,'Honey Jar','honey-jar',583.67,'Pure and natural honey in a convenient jar, perfect for sweetening beverages or drizzling over food.',3.97,1,'2025-10-28 11:16:41.793005','2025-10-28 11:16:41.794004',4),(28,'Ice Cream','ice-cream',458.42,'Creamy and delicious ice cream, available in various flavors for a delightful treat.',3.39,1,'2025-10-28 11:16:46.065884','2025-10-28 11:16:46.065884',4),(29,'Juice','juice',333.17,'Refreshing fruit juice, packed with vitamins and great for staying hydrated.',3.94,1,'2025-10-28 11:16:59.561706','2025-10-28 11:16:59.561706',4),(30,'Kiwi','kiwi',207.92,'Nutrient-rich kiwi, perfect for snacking or adding a tropical twist to your dishes.',4.93,1,'2025-10-28 11:17:03.236383','2025-10-28 11:17:03.236383',4),(31,'Lemon','lemon',65.97,'Zesty and tangy lemons, versatile for cooking, baking, or making refreshing beverages.',3.53,1,'2025-10-28 11:17:06.944802','2025-10-28 11:17:06.944802',4),(32,'Milk','milk',291.42,'Fresh and nutritious milk, a staple for various recipes and daily consumption.',2.61,1,'2025-10-28 11:17:10.945142','2025-10-28 11:17:10.945142',4),(33,'Mulberry','mulberry',416.67,'Sweet and juicy mulberries, perfect for snacking or adding to desserts and cereals.',4.95,1,'2025-10-28 11:17:14.231975','2025-10-28 11:17:14.231975',4),(34,'Nescafe Coffee','nescafe-coffee',667.17,'Quality coffee from Nescafe, available in various blends for a rich and satisfying cup.',4.82,1,'2025-10-28 11:17:18.199739','2025-10-28 11:17:18.199739',4),(35,'Potatoes','potatoes',191.22,'Versatile and starchy potatoes, great for roasting, mashing, or as a side dish.',4.81,1,'2025-10-28 11:17:23.544614','2025-10-28 11:17:23.544614',4),(36,'Protein Powder','protein-powder',1669.17,'Nutrient-packed protein powder, ideal for supplementing your diet with essential proteins.',4.18,1,'2025-10-28 11:17:27.617096','2025-10-28 11:17:27.617096',4),(37,'Red Onions','red-onions',166.17,'Flavorful and aromatic red onions, perfect for adding depth to your savory dishes.',4.2,1,'2025-10-28 11:17:31.210408','2025-10-28 11:17:31.210408',4),(38,'Rice','rice',500.17,'High-quality rice, a staple for various cuisines and a versatile base for many dishes.',3.18,1,'2025-10-28 11:17:35.320177','2025-10-28 11:17:35.320177',4),(39,'Soft Drinks','soft-drinks',166.17,'Assorted soft drinks in various flavors, perfect for refreshing beverages.',4.75,1,'2025-10-28 11:17:38.998310','2025-10-28 11:17:38.998310',4),(40,'Strawberry','strawberry',333.17,'Sweet and succulent strawberries, great for snacking, desserts, or blending into smoothies.',3.08,1,'2025-10-28 11:17:44.093661','2025-10-28 11:17:44.094020',4),(41,'Tissue Paper Box','tissue-paper-box',207.92,'Convenient tissue paper box for everyday use, providing soft and absorbent tissues.',2.69,1,'2025-10-28 11:17:48.473181','2025-10-28 11:17:48.473181',4),(42,'Water','water',82.67,'Pure and refreshing bottled water, essential for staying hydrated throughout the day.',4.96,1,'2025-10-28 11:17:54.620448','2025-10-28 11:17:54.620448',4),(43,'Decoration Swing','decoration-swing',5009.17,'The Decoration Swing is a charming addition to your home decor. Crafted with intricate details, it adds a touch of elegance and whimsy to any room.',3.16,1,'2025-10-28 11:17:59.018500','2025-10-28 11:17:59.018500',5),(44,'Family Tree Photo Frame','family-tree-photo-frame',2504.17,'The Family Tree Photo Frame is a sentimental and stylish way to display your cherished family memories. With multiple photo slots, it tells the story of your loved ones.',4.53,1,'2025-10-28 11:18:05.891724','2025-10-28 11:18:05.891724',5),(45,'House Showpiece Plant','house-showpiece-plant',3339.17,'The House Showpiece Plant is an artificial plant that brings a touch of nature to your home without the need for maintenance. It adds greenery and style to any space.',4.67,1,'2025-10-28 11:18:10.360795','2025-10-28 11:18:10.360795',5),(46,'Plant Pot','plant-pot',1251.67,'The Plant Pot is a stylish container for your favorite plants. With a sleek design, it complements your indoor or outdoor garden, adding a modern touch to your plant display.',3.01,1,'2025-10-28 11:18:17.982425','2025-10-28 11:18:17.982425',5),(47,'Table Lamp','table-lamp',4174.17,'The Table Lamp is a functional and decorative lighting solution for your living space. With a modern design, it provides both ambient and task lighting, enhancing the atmosphere.',3.55,1,'2025-10-28 11:18:27.472980','2025-10-28 11:18:27.472980',5),(48,'Bamboo Spatula','bamboo-spatula',667.17,'The Bamboo Spatula is a versatile kitchen tool made from eco-friendly bamboo. Ideal for flipping, stirring, and serving various dishes.',3.27,1,'2025-10-28 11:18:32.182433','2025-10-28 11:18:32.182433',6),(49,'Black Aluminium Cup','black-aluminium-cup',500.17,'The Black Aluminium Cup is a stylish and durable cup suitable for both hot and cold beverages. Its sleek black design adds a modern touch to your drinkware collection.',4.46,1,'2025-10-28 11:18:37.017339','2025-11-02 10:58:14.179494',6),(50,'Black Whisk','black-whisk',834.17,'The Black Whisk is a kitchen essential for whisking and beating ingredients. Its ergonomic handle and sleek design make it a practical and stylish tool.',3.9,1,'2025-10-28 11:18:45.092619','2025-10-28 11:18:45.092619',6),(51,'Boxed Blender','boxed-blender',3339.17,'The Boxed Blender is a powerful and compact blender perfect for smoothies, shakes, and more. Its convenient design and multiple functions make it a versatile kitchen appliance.',4.56,1,'2025-10-28 11:18:50.827815','2025-10-28 11:18:50.827815',6),(52,'Carbon Steel Wok','carbon-steel-wok',2489.17,'The Carbon Steel Wok is a versatile cooking pan suitable for stir-frying, sautéing, and deep frying. Its sturdy construction ensures even heat distribution for delicious meals.',4.05,1,'2025-10-28 22:39:46.688107','2025-10-28 22:54:47.794803',6),(53,'Chopping Board','chopping-board',1078.17,'The Chopping Board is an essential kitchen accessory for food preparation. Made from durable material, it provides a safe and hygienic surface for cutting and chopping.',3.7,1,'2025-10-28 22:39:52.942472','2025-10-28 22:54:47.794803',6),(54,'Citrus Squeezer Yellow','citrus-squeezer-yellow',746.17,'The Citrus Squeezer in Yellow is a handy tool for extracting juice from citrus fruits. Its vibrant color adds a cheerful touch to your kitchen gadgets.',4.63,1,'2025-10-28 22:39:57.241425','2025-10-28 22:54:47.810438',6),(55,'Egg Slicer','egg-slicer',580.17,'The Egg Slicer is a convenient tool for slicing boiled eggs evenly. It\'s perfect for salads, sandwiches, and other dishes where sliced eggs are desired.',3.09,1,'2025-10-28 22:40:00.463270','2025-10-28 22:54:47.810438',6),(56,'Electric Stove','electric-stove',4149.17,'The Electric Stove provides a portable and efficient cooking solution. Ideal for small kitchens or as an additional cooking surface for various culinary needs.',4.11,1,'2025-10-28 22:40:04.602329','2025-10-28 22:54:47.810438',6),(57,'Fine Mesh Strainer','fine-mesh-strainer',829.17,'The Fine Mesh Strainer is a versatile tool for straining liquids and sifting dry ingredients. Its fine mesh ensures efficient filtering for smooth cooking and baking.',3.04,1,'2025-10-28 22:40:12.284222','2025-10-28 22:54:47.828117',6),(58,'Fork','fork',331.17,'The Fork is a classic utensil for various dining and serving purposes. Its durable and ergonomic design makes it a reliable choice for everyday use.',3.11,1,'2025-10-28 22:40:15.490998','2025-10-28 22:54:47.841852',6),(59,'Glass','glass',414.17,'The Glass is a versatile and elegant drinking vessel suitable for a variety of beverages. Its clear design allows you to enjoy the colors and textures of your drinks.',4.02,1,'2025-10-28 22:40:18.684041','2025-10-28 22:54:47.843867',6),(60,'Grater Black','grater-black',912.17,'The Grater in Black is a handy kitchen tool for grating cheese, vegetables, and more. Its sleek design and sharp blades make food preparation efficient and easy.',3.21,1,'2025-10-28 22:40:25.935247','2025-10-28 22:54:47.843867',6),(61,'Hand Blender','hand-blender',2904.17,'The Hand Blender is a versatile kitchen appliance for blending, pureeing, and mixing. Its compact design and powerful motor make it a convenient tool for various recipes.',3.86,1,'2025-10-28 22:40:29.562573','2025-10-28 22:54:47.857671',6),(62,'Ice Cube Tray','ice-cube-tray',497.17,'The Ice Cube Tray is a practical accessory for making ice cubes in various shapes. Perfect for keeping your drinks cool and adding a fun element to your beverages.',4.71,1,'2025-10-28 22:40:33.083043','2025-10-28 22:54:47.857671',6),(63,'Kitchen Sieve','kitchen-sieve',663.17,'The Kitchen Sieve is a versatile tool for sifting and straining dry and wet ingredients. Its fine mesh design ensures smooth results in your cooking and baking.',3.09,1,'2025-10-28 22:40:36.603744','2025-10-28 22:54:47.857671',6),(64,'Knife','knife',1244.17,'The Knife is an essential kitchen tool for chopping, slicing, and dicing. Its sharp blade and ergonomic handle make it a reliable choice for food preparation.',3.26,1,'2025-10-28 22:40:39.802580','2025-10-28 22:54:47.873391',6),(65,'Lunch Box','lunch-box',1078.17,'The Lunch Box is a convenient and portable container for packing and carrying your meals. With compartments for different foods, it\'s perfect for on-the-go dining.',4.93,1,'2025-10-28 22:40:44.285367','2025-10-28 22:54:47.873391',6),(66,'Microwave Oven','microwave-oven',7469.17,'The Microwave Oven is a versatile kitchen appliance for quick and efficient cooking, reheating, and defrosting. Its compact size makes it suitable for various kitchen setups.',4.82,1,'2025-10-28 22:40:47.565696','2025-10-28 22:54:47.873391',6),(67,'Mug Tree Stand','mug-tree-stand',1327.17,'The Mug Tree Stand is a stylish and space-saving solution for organizing your mugs. Keep your favorite mugs easily accessible and neatly displayed in your kitchen.',2.64,1,'2025-10-28 22:40:56.968122','2025-10-28 22:54:47.873391',6),(68,'Pan','pan',2074.17,'The Pan is a versatile and essential cookware item for frying, sautéing, and cooking various dishes. Its non-stick coating ensures easy food release and cleanup.',2.79,1,'2025-10-28 22:41:02.201735','2025-10-28 22:54:47.889323',6),(69,'Plate','plate',331.17,'The Plate is a classic and essential dishware item for serving meals. Its durable and stylish design makes it suitable for everyday use or special occasions.',3.65,1,'2025-10-28 22:41:05.425420','2025-10-28 22:54:47.889323',6),(70,'Red Tongs','red-tongs',580.17,'The Red Tongs are versatile kitchen tongs suitable for various cooking and serving tasks. Their vibrant color adds a pop of excitement to your kitchen utensils.',4.42,1,'2025-10-28 22:41:08.822438','2025-10-28 22:54:47.889323',6),(71,'Silver Pot With Glass Cap','silver-pot-with-glass-cap',3319.17,'The Silver Pot with Glass Cap is a stylish and functional cookware item for boiling, simmering, and preparing delicious meals. Its glass cap allows you to monitor cooking progress.',3.22,1,'2025-10-28 22:41:12.442854','2025-10-28 22:54:47.905102',6),(72,'Slotted Turner','slotted-turner',746.17,'The Slotted Turner is a kitchen utensil designed for flipping and turning food items. Its slotted design allows excess liquid to drain, making it ideal for frying and sautéing.',3.4,1,'2025-10-28 22:41:16.349323','2025-10-28 22:54:47.905102',6),(73,'Spice Rack','spice-rack',1659.17,'The Spice Rack is a convenient organizer for your spices and seasonings. Keep your kitchen essentials within reach and neatly arranged with this stylish spice rack.',4.87,1,'2025-10-28 22:41:19.166993','2025-10-28 22:54:47.917386',6),(74,'Spoon','spoon',414.17,'The Spoon is a versatile kitchen utensil for stirring, serving, and tasting. Its ergonomic design and durable construction make it an essential tool for every kitchen.',4.03,1,'2025-10-28 22:41:22.925915','2025-10-28 22:54:47.921156',6),(75,'Tray','tray',1410.17,'The Tray is a functional and decorative item for serving snacks, appetizers, or drinks. Its stylish design makes it a versatile accessory for entertaining guests.',4.62,1,'2025-10-28 22:41:26.250760','2025-10-28 22:54:47.927193',6),(76,'Wooden Rolling Pin','wooden-rolling-pin',995.17,'The Wooden Rolling Pin is a classic kitchen tool for rolling out dough for baking. Its smooth surface and sturdy handles make it easy to achieve uniform thickness.',2.92,1,'2025-10-28 22:41:29.720709','2025-10-28 22:54:47.931222',6),(77,'Yellow Peeler','yellow-peeler',497.17,'The Yellow Peeler is a handy tool for peeling fruits and vegetables with ease. Its bright yellow color adds a cheerful touch to your kitchen gadgets.',4.24,1,'2025-10-28 22:41:33.563543','2025-10-28 22:54:47.937018',6),(78,'Apple MacBook Pro 14 Inch Space Grey','apple-macbook-pro-14-inch-space-grey',165999.17,'The MacBook Pro 14 Inch in Space Grey is a powerful and sleek laptop, featuring Apple\'s M1 Pro chip for exceptional performance and a stunning Retina display.',3.65,1,'2025-10-28 22:41:37.087968','2025-10-28 22:54:47.939035',7),(79,'Asus Zenbook Pro Dual Screen Laptop','asus-zenbook-pro-dual-screen-laptop',149399.17,'The Asus Zenbook Pro Dual Screen Laptop is a high-performance device with dual screens, providing productivity and versatility for creative professionals.',3.95,1,'2025-10-28 22:41:44.764240','2025-10-28 22:54:47.947966',7),(80,'Huawei Matebook X Pro','huawei-matebook-x-pro',116199.17,'The Huawei Matebook X Pro is a slim and stylish laptop with a high-resolution touchscreen display, offering a premium experience for users on the go.',4.98,1,'2025-10-28 22:41:55.741926','2025-10-28 22:54:47.952721',7),(81,'Lenovo Yoga 920','lenovo-yoga-920',91299.17,'The Lenovo Yoga 920 is a 2-in-1 convertible laptop with a flexible hinge, allowing you to use it as a laptop or tablet, offering versatility and portability.',2.86,1,'2025-10-28 22:42:03.641016','2025-10-28 22:54:47.954736',7),(82,'New DELL XPS 13 9300 Laptop','new-dell-xps-13-9300-laptop',124499.17,'The New DELL XPS 13 9300 Laptop is a compact and powerful device, featuring a virtually borderless InfinityEdge display and high-end performance for various tasks.',2.67,1,'2025-10-28 22:42:12.372264','2025-10-28 22:54:47.954736',7),(83,'Blue & Black Check Shirt','blue-black-check-shirt',2489.17,'The Blue & Black Check Shirt is a stylish and comfortable men\'s shirt featuring a classic check pattern. Made from high-quality fabric, it\'s suitable for both casual and semi-formal occasions.',3.64,1,'2025-10-28 22:42:20.305997','2025-10-28 22:54:47.968461',8),(84,'Gigabyte Aorus Men Tshirt','gigabyte-aorus-men-tshirt',2074.17,'The Gigabyte Aorus Men Tshirt is a cool and casual shirt for gaming enthusiasts. With the Aorus logo and sleek design, it\'s perfect for expressing your gaming style.',3.18,1,'2025-10-28 22:42:29.884028','2025-10-28 22:54:47.968461',8),(85,'Man Plaid Shirt','man-plaid-shirt',2904.17,'The Man Plaid Shirt is a timeless and versatile men\'s shirt with a classic plaid pattern. Its comfortable fit and casual style make it a wardrobe essential for various occasions.',3.46,1,'2025-10-28 22:42:39.007561','2025-10-28 22:54:47.968461',8),(86,'Man Short Sleeve Shirt','man-short-sleeve-shirt',1659.17,'The Man Short Sleeve Shirt is a breezy and stylish option for warm days. With a comfortable fit and short sleeves, it\'s perfect for a laid-back yet polished look.',2.9,1,'2025-10-28 22:42:47.812630','2025-10-28 22:54:47.968461',8),(87,'Men Check Shirt','men-check-shirt',2323.17,'The Men Check Shirt is a classic and versatile shirt featuring a stylish check pattern. Suitable for various occasions, it adds a smart and polished touch to your wardrobe.',2.72,1,'2025-10-28 22:42:57.905203','2025-10-28 22:54:47.984229',8),(88,'Nike Air Jordan 1 Red And Black','nike-air-jordan-1-red-and-black',12449.17,'The Nike Air Jordan 1 in Red and Black is an iconic basketball sneaker known for its stylish design and high-performance features, making it a favorite among sneaker enthusiasts and athletes.',4.77,1,'2025-10-28 22:43:07.968544','2025-10-28 22:54:47.988966',9),(89,'Nike Baseball Cleats','nike-baseball-cleats',6639.17,'Nike Baseball Cleats are designed for maximum traction and performance on the baseball field. They provide stability and support for players during games and practices.',3.88,1,'2025-10-28 22:43:17.553070','2025-10-28 22:54:47.988966',9),(90,'Puma Future Rider Trainers','puma-future-rider-trainers',7469.17,'The Puma Future Rider Trainers offer a blend of retro style and modern comfort. Perfect for casual wear, these trainers provide a fashionable and comfortable option for everyday use.',4.9,1,'2025-10-28 22:43:27.434309','2025-10-28 22:54:47.999908',9),(91,'Sports Sneakers Off White & Red','sports-sneakers-off-white-red',9959.17,'The Sports Sneakers in Off White and Red combine style and functionality, making them a fashionable choice for sports enthusiasts. The red and off-white color combination adds a bold and energetic touch.',4.77,1,'2025-10-28 22:43:38.742890','2025-10-28 22:54:47.999908',9),(92,'Brown Leather Belt Watch','brown-leather-belt-watch',7469.17,'The Brown Leather Belt Watch is a stylish timepiece with a classic design. Featuring a genuine leather strap and a sleek dial, it adds a touch of sophistication to your look.',4.19,1,'2025-10-28 22:43:49.893153','2025-10-28 22:54:47.999908',10),(93,'Longines Master Collection','longines-master-collection',124499.17,'The Longines Master Collection is an elegant and refined watch known for its precision and craftsmanship. With a timeless design, it\'s a symbol of luxury and sophistication.',3.87,1,'2025-10-28 22:43:57.405642','2025-10-28 22:54:48.015646',10),(94,'Rolex Cellini Date Black Dial','rolex-cellini-date-black-dial',746999.17,'The Rolex Cellini Date with Black Dial is a classic and prestigious watch. With a black dial and date complication, it exudes sophistication and is a symbol of Rolex\'s heritage.',4.97,1,'2025-10-28 22:44:04.603091','2025-10-28 22:54:48.015646',10),(95,'Rolex Cellini Moonphase','rolex-cellini-moonphase',1078999.17,'The Rolex Cellini Moonphase is a masterpiece of horology, featuring a moon phase complication and exquisite design. It reflects Rolex\'s commitment to precision and elegance.',2.58,1,'2025-10-28 22:44:13.871368','2025-10-28 22:54:48.015646',10),(96,'Rolex Datejust','rolex-datejust',912999.17,'The Rolex Datejust is an iconic and versatile timepiece with a date window. Known for its timeless design and reliability, it\'s a symbol of Rolex\'s watchmaking excellence.',3.66,1,'2025-10-28 22:44:23.379862','2025-10-28 22:54:48.031364',10),(97,'Rolex Submariner Watch','rolex-submariner-watch',1161999.17,'The Rolex Submariner is a legendary dive watch with a rich history. Known for its durability and water resistance, it\'s a symbol of adventure and exploration.',2.69,1,'2025-10-28 22:44:32.075590','2025-10-28 22:54:48.039678',10),(98,'Amazon Echo Plus','amazon-echo-plus',8299.17,'The Amazon Echo Plus is a smart speaker with built-in Alexa voice control. It features premium sound quality and serves as a hub for controlling smart home devices.',4.99,1,'2025-10-28 22:44:41.367489','2025-10-28 22:54:48.043690',11),(99,'Apple Airpods','apple-airpods',10789.17,'The Apple Airpods offer a seamless wireless audio experience. With easy pairing, high-quality sound, and Siri integration, they are perfect for on-the-go listening.',4.15,1,'2025-10-28 22:44:47.341380','2025-10-28 22:54:48.048694',11),(100,'Redmi Note 12 Pro 5g','redmi-note-12-pro-5g-64bae65b',23999.00,'The Xiaomi Redmi Note 12 Pro 5G is a mid-range smartphone known for its 120Hz AMOLED display, solid camera system with a 50MP Sony IMX766 sensor, and 67W fast charging. It is powered by the MediaTek Dimensity 1080 processor, providing reliable performance for everyday tasks and moderate gaming. \r\nTop features\r\nDisplay: Features a vibrant 6.67-inch Full HD+ AMOLED screen with a smooth 120Hz refresh rate, Dolby Vision, and HDR10+ support, which is great for multimedia consumption.\r\nCamera: Includes a 50MP main camera with the Sony IMX766 sensor and Optical Image Stabilization (OIS) for stable, detailed photos, even in low light. It also has an 8MP ultrawide and 2MP macro lens.\r\nPerformance: The MediaTek Dimensity 1080 chipset provides ample power for daily use and gaming, supported by an advanced cooling system.\r\nBattery and charging: A large 5000mAh battery provides a full day of usage, and the included 67W turbo charger can reach a 100% charge in under 46 minutes.\r\nDesign and audio: The phone has a flat dual-glass and plastic frame design, an IP53 rating for splash resistance, and includes stereo speakers with Dolby Atmos support.\r\nExtra features: Includes a side-mounted fingerprint sensor, AI face unlock, and a 3.5mm headphone jack.',0,1,'2025-10-28 23:33:23.268677','2025-10-28 23:33:23.268677',12),(101,'Majestic Mountain Graphic T-Shirt','majestic-mountain-graphic-t-shirt',3652.00,'Elevate your wardrobe with this stylish black t-shirt featuring a striking monochrome mountain range graphic. Perfect for those who love the outdoors or want to add a touch of nature-inspired design to their look, this tee is crafted from soft, breathable fabric ensuring all-day comfort. Ideal for casual outings or as a unique gift, this t-shirt is a versatile addition to any collection.',0,1,'2025-10-29 02:00:08.602927','2025-10-29 02:00:08.602927',13),(102,'Classic Black Hooded Sweatshirt','classic-black-hooded-sweatshirt',6557.00,'Elevate your casual wardrobe with our Classic Black Hooded Sweatshirt. Made from high-quality, soft fabric that ensures comfort and durability, this hoodie features a spacious kangaroo pocket and an adjustable drawstring hood. Its versatile design makes it perfect for a relaxed day at home or a casual outing.',0,1,'2025-10-29 02:00:20.070794','2025-10-29 02:00:20.070794',13),(103,'Classic Comfort Fit Joggers','classic-comfort-fit-joggers',2075.00,'Discover the perfect blend of style and comfort with our Classic Comfort Fit Joggers. These versatile black joggers feature a soft elastic waistband with an adjustable drawstring, two side pockets, and ribbed ankle cuffs for a secure fit. Made from a lightweight and durable fabric, they are ideal for both active days and relaxed lounging.',0,1,'2025-10-29 02:00:23.046555','2025-10-29 02:00:23.046555',13),(104,'Classic Comfort Drawstring Joggers','classic-comfort-drawstring-joggers',6557.00,'Experience the perfect blend of comfort and style with our Classic Comfort Drawstring Joggers. Designed for a relaxed fit, these joggers feature a soft, stretchable fabric, convenient side pockets, and an adjustable drawstring waist with elegant gold-tipped detailing. Ideal for lounging or running errands, these pants will quickly become your go-to for effortless, casual wear.',0,1,'2025-10-29 02:00:28.985379','2025-10-29 02:00:28.985379',13),(105,'Classic Red Jogger Sweatpants','classic-red-jogger-sweatpants',8134.00,'Experience ultimate comfort with our red jogger sweatpants, perfect for both workout sessions and lounging around the house. Made with soft, durable fabric, these joggers feature a snug waistband, adjustable drawstring, and practical side pockets for functionality. Their tapered design and elastic cuffs offer a modern fit that keeps you looking stylish on the go.',0,1,'2025-10-29 02:00:33.183773','2025-10-29 02:00:33.183773',13),(106,'Classic Navy Blue Baseball Cap','classic-navy-blue-baseball-cap',5063.00,'Step out in style with this sleek navy blue baseball cap. Crafted from durable material, it features a smooth, structured design and an adjustable strap for the perfect fit. Protect your eyes from the sun and complement your casual looks with this versatile and timeless accessory.',0,1,'2025-10-29 02:00:39.835406','2025-10-29 02:00:39.835406',13),(107,'Classic Blue Baseball Cap','classic-blue-baseball-cap',7138.00,'Top off your casual look with our Classic Blue Baseball Cap, made from high-quality materials for lasting comfort. Featuring a timeless six-panel design with a pre-curved visor, this adjustable cap offers both style and practicality for everyday wear.',0,1,'2025-10-29 02:00:45.472246','2025-10-29 02:00:45.472246',13),(108,'Classic Red Baseball Cap','classic-red-baseball-cap',2905.00,'Elevate your casual wardrobe with this timeless red baseball cap. Crafted from durable fabric, it features a comfortable fit with an adjustable strap at the back, ensuring one size fits all. Perfect for sunny days or adding a sporty touch to your outfit.',0,1,'2025-10-29 02:00:51.712826','2025-10-29 02:00:51.712826',13),(109,'Classic Black Baseball Cap','classic-black-baseball-cap',4814.00,'Elevate your casual wear with this timeless black baseball cap. Made with high-quality, breathable fabric, it features an adjustable strap for the perfect fit. Whether you’re out for a jog or just running errands, this cap adds a touch of style to any outfit.',0,1,'2025-10-29 02:00:58.061554','2025-10-29 02:00:58.061554',13),(110,'Classic Olive Chino Shorts','classic-olive-chino-shorts',6972.00,'Elevate your casual wardrobe with these classic olive chino shorts. Designed for comfort and versatility, they feature a smooth waistband, practical pockets, and a tailored fit that makes them perfect for both relaxed weekends and smart-casual occasions. The durable fabric ensures they hold up throughout your daily activities while maintaining a stylish look.',0,1,'2025-10-29 02:01:04.107572','2025-10-29 02:01:04.107572',13),(111,'Classic High-Waisted Athletic Shorts','classic-high-waisted-athletic-shorts',3569.00,'Stay comfortable and stylish with our Classic High-Waisted Athletic Shorts. Designed for optimal movement and versatility, these shorts are a must-have for your workout wardrobe. Featuring a figure-flattering high waist, breathable fabric, and a secure fit that ensures they stay in place during any activity, these shorts are perfect for the gym, running, or even just casual wear.',0,1,'2025-10-29 02:01:08.611907','2025-10-29 02:01:08.611907',13),(112,'Classic White Crew Neck T-Shirt','classic-white-crew-neck-t-shirt',250.50,'Elevate your basics with this versatile white crew neck tee. Made from a soft, breathable cotton blend, it offers both comfort and durability. Its sleek, timeless design ensures it pairs well with virtually any outfit. Ideal for layering or wearing on its own, this t-shirt is a must-have staple for every wardrobe.',0,1,'2025-10-29 02:01:14.551578','2025-11-02 10:58:27.686023',13),(113,'Classic White Tee - Timeless Style and Comfort','classic-white-tee-timeless-style-and-comfort',6059.00,'Elevate your everyday wardrobe with our Classic White Tee. Crafted from premium soft cotton material, this versatile t-shirt combines comfort with durability, perfect for daily wear. Featuring a relaxed, unisex fit that flatters every body type, it\'s a staple piece for any casual ensemble. Easy to care for and machine washable, this white tee retains its shape and softness wash after wash. Pair it with your favorite jeans or layer it under a jacket for a smart look.',0,1,'2025-10-29 02:01:20.080252','2025-10-29 02:01:20.081250',13),(114,'Classic Black T-Shirt','classic-black-t-shirt',2905.00,'Elevate your everyday style with our Classic Black T-Shirt. This staple piece is crafted from soft, breathable cotton for all-day comfort. Its versatile design features a classic crew neck and short sleeves, making it perfect for layering or wearing on its own. Durable and easy to care for, it\'s sure to become a favorite in your wardrobe.',0,1,'2025-10-29 02:01:25.096778','2025-10-29 02:01:25.096778',13),(115,'Sleek White & Orange Wireless Gaming Controller','sleek-white-orange-wireless-gaming-controller',5727.00,'Elevate your gaming experience with this state-of-the-art wireless controller, featuring a crisp white base with vibrant orange accents. Designed for precision play, the ergonomic shape and responsive buttons provide maximum comfort and control for endless hours of gameplay. Compatible with multiple gaming platforms, this controller is a must-have for any serious gamer looking to enhance their setup.',0,1,'2025-10-29 02:02:32.679345','2025-10-29 02:02:32.679345',12),(116,'Sleek Wireless Headphone & Inked Earbud Set','sleek-wireless-headphone-inked-earbud-set',3652.00,'Experience the fusion of style and sound with this sophisticated audio set featuring a pair of sleek, white wireless headphones offering crystal-clear sound quality and over-ear comfort. The set also includes a set of durable earbuds, perfect for an on-the-go lifestyle. Elevate your music enjoyment with this versatile duo, designed to cater to all your listening needs.',0,1,'2025-10-29 02:02:38.788180','2025-10-29 02:02:38.788180',12),(117,'Sleek Comfort-Fit Over-Ear Headphones','sleek-comfort-fit-over-ear-headphones',2324.00,'Experience superior sound quality with our Sleek Comfort-Fit Over-Ear Headphones, designed for prolonged use with cushioned ear cups and an adjustable, padded headband. Ideal for immersive listening, whether you\'re at home, in the office, or on the move. Their durable construction and timeless design provide both aesthetically pleasing looks and long-lasting performance.',0,1,'2025-10-29 02:02:45.172231','2025-10-29 02:02:45.172231',12),(118,'Efficient 2-Slice Toaster','efficient-2-slice-toaster',3984.00,'Enhance your morning routine with our sleek 2-slice toaster, featuring adjustable browning controls and a removable crumb tray for easy cleaning. This compact and stylish appliance is perfect for any kitchen, ensuring your toast is always golden brown and delicious.',0,1,'2025-10-29 02:02:50.560459','2025-10-29 02:02:50.560459',12),(119,'Sleek Wireless Computer Mouse','sleek-wireless-computer-mouse',830.00,'Experience smooth and precise navigation with this modern wireless mouse, featuring a glossy finish and a comfortable ergonomic design. Its responsive tracking and easy-to-use interface make it the perfect accessory for any desktop or laptop setup. The stylish blue hue adds a splash of color to your workspace, while its compact size ensures it fits neatly in your bag for on-the-go productivity.',0,1,'2025-10-29 02:02:57.042632','2025-10-29 02:02:57.042632',12),(120,'Sleek Modern Laptop with Ambient Lighting','sleek-modern-laptop-with-ambient-lighting',3569.00,'Experience next-level computing with our ultra-slim laptop, featuring a stunning display illuminated by ambient lighting. This high-performance machine is perfect for both work and play, delivering powerful processing in a sleek, portable design. The vibrant colors add a touch of personality to your tech collection, making it as stylish as it is functional.',0,1,'2025-10-29 02:03:03.300071','2025-10-29 02:03:03.300071',12),(121,'Sleek Modern Laptop for Professionals','sleek-modern-laptop-for-professionals',8051.00,'Experience cutting-edge technology and elegant design with our latest laptop model. Perfect for professionals on-the-go, this high-performance laptop boasts a powerful processor, ample storage, and a long-lasting battery life, all encased in a lightweight, slim frame for ultimate portability. Shop now to elevate your work and play.',0,1,'2025-10-29 02:03:10.056836','2025-10-29 02:03:10.056836',12),(122,'Stylish Red & Silver Over-Ear Headphones','stylish-red-silver-over-ear-headphones',3237.00,'Immerse yourself in superior sound quality with these sleek red and silver over-ear headphones. Designed for comfort and style, the headphones feature cushioned ear cups, an adjustable padded headband, and a detachable red cable for easy storage and portability. Perfect for music lovers and audiophiles who value both appearance and audio fidelity.',0,1,'2025-10-29 02:03:16.916212','2025-10-29 02:03:16.916212',12),(123,'Sleek Mirror Finish Phone Case','sleek-mirror-finish-phone-case',2241.00,'Enhance your smartphone\'s look with this ultra-sleek mirror finish phone case. Designed to offer style with protection, the case features a reflective surface that adds a touch of elegance while keeping your device safe from scratches and impacts. Perfect for those who love a minimalist and modern aesthetic.',0,1,'2025-10-29 02:03:23.780325','2025-10-29 02:03:23.780325',12),(124,'Sleek Smartwatch with Vibrant Display','sleek-smartwatch-with-vibrant-display',1328.00,'Experience modern timekeeping with our high-tech smartwatch, featuring a vivid touch screen display, customizable watch faces, and a comfortable blue silicone strap. This smartwatch keeps you connected with notifications and fitness tracking while showcasing exceptional style and versatility.',0,1,'2025-10-29 02:03:29.326263','2025-10-29 02:03:29.327255',12),(125,'Sleek Modern Leather Sofa','sleek-modern-leather-sofa',4399.00,'Enhance the elegance of your living space with our Sleek Modern Leather Sofa. Designed with a minimalist aesthetic, it features clean lines and a luxurious leather finish. The robust metal legs provide stability and support, while the plush cushions ensure comfort. Perfect for contemporary homes or office waiting areas, this sofa is a statement piece that combines style with practicality.',0,1,'2025-10-29 02:03:37.378794','2025-10-29 02:03:37.378794',3),(126,'Mid-Century Modern Wooden Dining Table','mid-century-modern-wooden-dining-table',1992.00,'Elevate your dining room with this sleek Mid-Century Modern dining table, featuring an elegant walnut finish and tapered legs for a timeless aesthetic. Its sturdy wood construction and minimalist design make it a versatile piece that fits with a variety of decor styles. Perfect for intimate dinners or as a stylish spot for your morning coffee.',0,1,'2025-10-29 02:03:45.729251','2025-10-29 02:03:45.729251',3),(127,'Elegant Golden-Base Stone Top Dining Table','elegant-golden-base-stone-top-dining-table',5478.00,'Elevate your dining space with this luxurious table, featuring a sturdy golden metal base with an intricate rod design that provides both stability and chic elegance. The smooth stone top in a sleek round shape offers a robust surface for your dining pleasure. Perfect for both everyday meals and special occasions, this table easily complements any modern or glam decor.',0,1,'2025-10-29 02:03:51.166769','2025-10-29 02:03:51.166769',3),(128,'Modern Elegance Teal Armchair','modern-elegance-teal-armchair',2075.00,'Elevate your living space with this beautifully crafted armchair, featuring a sleek wooden frame that complements its vibrant teal upholstery. Ideal for adding a pop of color and contemporary style to any room, this chair provides both superb comfort and sophisticated design. Perfect for reading, relaxing, or creating a cozy conversation nook.',0,1,'2025-10-29 02:03:58.178948','2025-10-29 02:03:58.178948',3),(129,'Elegant Solid Wood Dining Table','elegant-solid-wood-dining-table',5561.00,'Enhance your dining space with this sleek, contemporary dining table, crafted from high-quality solid wood with a warm finish. Its sturdy construction and minimalist design make it a perfect addition for any home looking for a touch of elegance. Accommodates up to six guests comfortably and includes a striking fruit bowl centerpiece. The overhead lighting is not included.',0,1,'2025-10-29 02:04:06.132481','2025-10-29 02:04:06.132481',3),(130,'Modern Minimalist Workstation Setup','modern-minimalist-workstation-setup',4067.00,'Elevate your home office with our Modern Minimalist Workstation Setup, featuring a sleek wooden desk topped with an elegant computer, stylish adjustable wooden desk lamp, and complimentary accessories for a clean, productive workspace. This setup is perfect for professionals seeking a contemporary look that combines functionality with design.',0,1,'2025-10-29 02:04:15.636898','2025-10-29 02:04:15.636898',3),(131,'Modern Ergonomic Office Chair','modern-ergonomic-office-chair',5893.00,'Elevate your office space with this sleek and comfortable Modern Ergonomic Office Chair. Designed to provide optimal support throughout the workday, it features an adjustable height mechanism, smooth-rolling casters for easy mobility, and a cushioned seat for extended comfort. The clean lines and minimalist white design make it a versatile addition to any contemporary workspace.',0,1,'2025-10-29 02:04:22.040865','2025-10-29 02:04:22.040865',3),(132,'Futuristic Holographic Soccer Cleats','futuristic-holographic-soccer-cleats',3237.00,'Step onto the field and stand out from the crowd with these eye-catching holographic soccer cleats. Designed for the modern player, these cleats feature a sleek silhouette, lightweight construction for maximum agility, and durable studs for optimal traction. The shimmering holographic finish reflects a rainbow of colors as you move, ensuring that you\'ll be noticed for both your skills and style. Perfect for the fashion-forward athlete who wants to make a statement.',0,1,'2025-10-29 02:04:33.301331','2025-10-29 02:04:33.301331',14),(133,'Rainbow Glitter High Heels','rainbow-glitter-high-heels',3237.00,'Step into the spotlight with these eye-catching rainbow glitter high heels. Designed to dazzle, each shoe boasts a kaleidoscope of shimmering colors that catch and reflect light with every step. Perfect for special occasions or a night out, these stunners are sure to turn heads and elevate any ensemble.',0,1,'2025-10-29 02:04:38.941280','2025-10-29 02:04:38.941280',14),(134,'Chic Summer Denim Espadrille Sandals','chic-summer-denim-espadrille-sandals',2739.00,'Step into summer with style in our denim espadrille sandals. Featuring a braided jute sole for a classic touch and adjustable denim straps for a snug fit, these sandals offer both comfort and a fashionable edge. The easy slip-on design ensures convenience for beach days or casual outings.',0,1,'2025-10-29 02:04:46.209207','2025-10-29 02:04:46.209207',14),(135,'Vibrant Runners: Bold Orange & Blue Sneakers','vibrant-runners-bold-orange-blue-sneakers',2241.00,'Step into style with these eye-catching sneakers featuring a striking combination of orange and blue hues. Designed for both comfort and fashion, these shoes come with flexible soles and cushioned insoles, perfect for active individuals who don\'t compromise on style. The reflective silver accents add a touch of modernity, making them a standout accessory for your workout or casual wear.',0,1,'2025-10-29 02:04:52.451861','2025-10-29 02:04:52.451861',14),(136,'Vibrant Pink Classic Sneakers','vibrant-pink-classic-sneakers',6972.00,'Step into style with our Vibrant Pink Classic Sneakers! These eye-catching shoes feature a bold pink hue with iconic white detailing, offering a sleek, timeless design. Constructed with durable materials and a comfortable fit, they are perfect for those seeking a pop of color in their everyday footwear. Grab a pair today and add some vibrancy to your step!',0,1,'2025-10-29 02:06:10.913244','2025-10-29 02:06:10.913244',14),(137,'Futuristic Silver and Gold High-Top Sneaker','futuristic-silver-and-gold-high-top-sneaker',5644.00,'Step into the future with this eye-catching high-top sneaker, designed for those who dare to stand out. The sneaker features a sleek silver body with striking gold accents, offering a modern twist on classic footwear. Its high-top design provides support and style, making it the perfect addition to any avant-garde fashion collection. Grab a pair today and elevate your shoe game!',0,1,'2025-10-29 02:06:20.950953','2025-10-29 02:06:20.950953',14),(138,'Futuristic Chic High-Heel Boots','futuristic-chic-high-heel-boots',2988.00,'Elevate your style with our cutting-edge high-heel boots that blend bold design with avant-garde aesthetics. These boots feature a unique color-block heel, a sleek silhouette, and a versatile light grey finish that pairs easily with any cutting-edge outfit. Crafted for the fashion-forward individual, these boots are sure to make a statement.',0,1,'2025-10-29 02:06:27.680282','2025-10-29 02:06:27.680282',14),(139,'Elegant Patent Leather Peep-Toe Pumps with Gold-Tone Heel','elegant-patent-leather-peep-toe-pumps',4399.00,'Step into sophistication with these chic peep-toe pumps, showcasing a lustrous patent leather finish and an eye-catching gold-tone block heel. The ornate buckle detail adds a touch of glamour, perfect for elevating your evening attire or complementing a polished daytime look.',0,1,'2025-10-29 02:06:33.223113','2025-10-29 02:06:33.223113',14),(140,'Elegant Purple Leather Loafers','elegant-purple-leather-loafers',1411.00,'Step into sophistication with our Elegant Purple Leather Loafers, perfect for making a bold statement. Crafted from high-quality leather with a vibrant purple finish, these shoes feature a classic loafer silhouette that\'s been updated with a contemporary twist. The comfortable slip-on design and durable soles ensure both style and functionality for the modern man.',0,1,'2025-10-29 02:06:39.791668','2025-10-29 02:06:39.791668',14),(141,'Classic Blue Suede Casual Shoes','classic-blue-suede-casual-shoes',3237.00,'Step into comfort with our Classic Blue Suede Casual Shoes, perfect for everyday wear. These shoes feature a stylish blue suede upper, durable rubber soles for superior traction, and classic lace-up fronts for a snug fit. The sleek design pairs well with both jeans and chinos, making them a versatile addition to any wardrobe.',0,1,'2025-10-29 02:06:47.141557','2025-10-29 02:06:47.141557',14),(142,'Sleek Futuristic Electric Bicycle','sleek-futuristic-electric-bicycle',1826.00,'This modern electric bicycle combines style and efficiency with its unique design and top-notch performance features. Equipped with a durable frame, enhanced battery life, and integrated tech capabilities, it\'s perfect for the eco-conscious commuter looking to navigate the city with ease.',0,1,'2025-10-29 02:06:54.621505','2025-10-29 02:06:54.621505',15),(143,'Sleek All-Terrain Go-Kart','sleek-all-terrain-go-kart',3071.00,'Experience the thrill of outdoor adventures with our Sleek All-Terrain Go-Kart, featuring a durable frame, comfortable racing seat, and robust, large-tread tires perfect for handling a variety of terrains. Designed for fun-seekers of all ages, this go-kart is an ideal choice for backyard racing or exploring local trails.',0,1,'2025-10-29 02:07:00.963848','2025-10-29 02:07:00.963848',15),(144,'Radiant Citrus Eau de Parfum','radiant-citrus-eau-de-parfum',6059.00,'Indulge in the essence of summer with this vibrant citrus-scented Eau de Parfum. Encased in a sleek glass bottle with a bold orange cap, this fragrance embodies freshness and elegance. Perfect for daily wear, it\'s an olfactory delight that leaves a lasting, zesty impression.',0,1,'2025-10-29 02:07:08.256355','2025-10-29 02:07:08.256355',15),(145,'Sleek Olive Green Hardshell Carry-On Luggage','sleek-olive-green-hardshell-carry-on-luggage',3984.00,'Travel in style with our durable hardshell carry-on, perfect for weekend getaways and business trips. This sleek olive green suitcase features smooth gliding wheels for easy airport navigation, a sturdy telescopic handle, and a secure zippered compartment to keep your belongings safe. Its compact size meets most airline overhead bin requirements, ensuring a hassle-free flying experience.',0,1,'2025-10-29 02:07:16.115599','2025-10-29 02:07:16.115599',15),(146,'Chic Transparent Fashion Handbag','chic-transparent-fashion-handbag',5063.00,'Elevate your style with our Chic Transparent Fashion Handbag, perfect for showcasing your essentials with a clear, modern edge. This trendy accessory features durable acrylic construction, luxe gold-tone hardware, and an elegant chain strap. Its compact size ensures you can carry your day-to-day items with ease and sophistication.',0,1,'2025-10-29 02:07:22.815384','2025-10-29 02:07:22.815384',15),(147,'Trendy Pink-Tinted Sunglasses','trendy-pink-tinted-sunglasses',3154.00,'Step up your style game with these fashionable black-framed, pink-tinted sunglasses. Perfect for making a statement while protecting your eyes from the glare. Their bold color and contemporary design make these shades a must-have accessory for any trendsetter looking to add a pop of color to their ensemble.',0,1,'2025-10-29 02:07:29.740739','2025-10-29 02:07:29.740739',15),(148,'Elegant Glass Tumbler Set','elegant-glass-tumbler-set',4150.00,'Enhance your drinkware collection with our sophisticated set of glass tumblers, perfect for serving your favorite beverages. This versatile set includes both clear and subtly tinted glasses, lending a modern touch to any table setting. Crafted with quality materials, these durable tumblers are designed to withstand daily use while maintaining their elegant appeal.',0,1,'2025-10-29 02:07:36.189758','2025-10-29 02:07:36.189758',15),(150,'Faisal-6587-01','faisal-6587-01',830.00,'A description',0,1,'2025-10-29 02:07:46.021409','2025-10-29 02:07:46.021409',13),(163,'a','a-2000db60',50.00,'b',0,1,'2025-11-02 10:49:52.517240','2025-11-02 14:28:38.731703',18);
/*!40000 ALTER TABLE `product_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_productimage`
--

DROP TABLE IF EXISTS `product_productimage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_productimage` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `image` varchar(255) NOT NULL,
  `is_primary` tinyint(1) NOT NULL,
  `order` int unsigned NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_productimage_product_id_544084bb_fk_product_product_id` (`product_id`),
  CONSTRAINT `product_productimage_product_id_544084bb_fk_product_product_id` FOREIGN KEY (`product_id`) REFERENCES `product_product` (`id`),
  CONSTRAINT `product_productimage_chk_1` CHECK ((`order` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=333 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_productimage`
--

LOCK TABLES `product_productimage` WRITE;
/*!40000 ALTER TABLE `product_productimage` DISABLE KEYS */;
INSERT INTO `product_productimage` VALUES (1,'products/product_essence-mascara-lash-princess_img_0',1,1,1),(2,'products/product_eyeshadow-palette-with-mirror_img_0',1,1,2),(3,'products/product_powder-canister_img_0',1,1,3),(4,'products/product_red-lipstick_img_0',1,1,4),(5,'products/product_red-nail-polish_img_0',1,1,5),(6,'products/product_calvin-klein-ck-one_img_0',1,1,6),(7,'products/product_calvin-klein-ck-one_img_1',0,2,6),(8,'products/product_calvin-klein-ck-one_img_2',0,3,6),(9,'products/product_chanel-coco-noir-eau-de_img_0',1,1,7),(10,'products/product_chanel-coco-noir-eau-de_img_1',0,2,7),(11,'products/product_chanel-coco-noir-eau-de_img_2',0,3,7),(12,'products/product_dior-jadore_img_0',1,1,8),(13,'products/product_dior-jadore_img_1',0,2,8),(14,'products/product_dior-jadore_img_2',0,3,8),(15,'products/product_dolce-shine-eau-de_img_0',1,1,9),(16,'products/product_dolce-shine-eau-de_img_1',0,2,9),(17,'products/product_dolce-shine-eau-de_img_2',0,3,9),(18,'products/product_gucci-bloom-eau-de_img_0',1,1,10),(19,'products/product_gucci-bloom-eau-de_img_1',0,2,10),(20,'products/product_gucci-bloom-eau-de_img_2',0,3,10),(21,'products/product_annibale-colombo-bed_img_0',1,1,11),(22,'products/product_annibale-colombo-bed_img_1',0,2,11),(23,'products/product_annibale-colombo-bed_img_2',0,3,11),(24,'products/product_annibale-colombo-sofa_img_0',1,1,12),(25,'products/product_annibale-colombo-sofa_img_1',0,2,12),(26,'products/product_annibale-colombo-sofa_img_2',0,3,12),(27,'products/product_bedside-table-african-cherry_img_0',1,1,13),(28,'products/product_bedside-table-african-cherry_img_1',0,2,13),(29,'products/product_bedside-table-african-cherry_img_2',0,3,13),(30,'products/product_knoll-saarinen-executive-conference-chair_img_0',1,1,14),(31,'products/product_knoll-saarinen-executive-conference-chair_img_1',0,2,14),(32,'products/product_knoll-saarinen-executive-conference-chair_img_2',0,3,14),(33,'products/product_wooden-bathroom-sink-with-mirror_img_0',1,1,15),(34,'products/product_wooden-bathroom-sink-with-mirror_img_1',0,2,15),(35,'products/product_wooden-bathroom-sink-with-mirror_img_2',0,3,15),(36,'products/product_apple_img_0',1,1,16),(37,'products/product_beef-steak_img_0',1,1,17),(38,'products/product_cat-food_img_0',1,1,18),(39,'products/product_chicken-meat_img_0',1,1,19),(40,'products/product_chicken-meat_img_1',0,2,19),(41,'products/product_cooking-oil_img_0',1,1,20),(42,'products/product_cucumber_img_0',1,1,21),(43,'products/product_dog-food_img_0',1,1,22),(44,'products/product_eggs_img_0',1,1,23),(45,'products/product_fish-steak_img_0',1,1,24),(46,'products/product_green-bell-pepper_img_0',1,1,25),(47,'products/product_green-chili-pepper_img_0',1,1,26),(48,'products/product_honey-jar_img_0',1,1,27),(49,'products/product_ice-cream_img_0',1,1,28),(50,'products/product_ice-cream_img_1',0,2,28),(51,'products/product_ice-cream_img_2',0,3,28),(52,'products/product_ice-cream_img_3',0,4,28),(53,'products/product_juice_img_0',1,1,29),(54,'products/product_kiwi_img_0',1,1,30),(55,'products/product_lemon_img_0',1,1,31),(56,'products/product_milk_img_0',1,1,32),(57,'products/product_mulberry_img_0',1,1,33),(58,'products/product_nescafe-coffee_img_0',1,1,34),(59,'products/product_potatoes_img_0',1,1,35),(60,'products/product_protein-powder_img_0',1,1,36),(61,'products/product_red-onions_img_0',1,1,37),(62,'products/product_rice_img_0',1,1,38),(63,'products/product_soft-drinks_img_0',1,1,39),(64,'products/product_strawberry_img_0',1,1,40),(65,'products/product_tissue-paper-box_img_0',1,1,41),(66,'products/product_tissue-paper-box_img_1',0,2,41),(67,'products/product_water_img_0',1,1,42),(68,'products/product_decoration-swing_img_0',1,1,43),(69,'products/product_decoration-swing_img_1',0,2,43),(70,'products/product_decoration-swing_img_2',0,3,43),(71,'products/product_family-tree-photo-frame_img_0',1,1,44),(72,'products/product_house-showpiece-plant_img_0',1,1,45),(73,'products/product_house-showpiece-plant_img_1',0,2,45),(74,'products/product_house-showpiece-plant_img_2',0,3,45),(75,'products/product_plant-pot_img_0',1,1,46),(76,'products/product_plant-pot_img_1',0,2,46),(77,'products/product_plant-pot_img_2',0,3,46),(78,'products/product_plant-pot_img_3',0,4,46),(79,'products/product_table-lamp_img_0',1,1,47),(80,'products/product_bamboo-spatula_img_0',1,1,48),(81,'products/product_black-aluminium-cup_img_0',1,1,49),(82,'products/product_black-aluminium-cup_img_1',0,2,49),(83,'products/product_black-whisk_img_0',1,1,50),(84,'products/product_boxed-blender_img_0',1,1,51),(85,'products/product_boxed-blender_img_1',0,2,51),(86,'products/product_carbon-steel-wok_img_0',1,1,52),(87,'products/product_chopping-board_img_0',1,1,53),(88,'products/product_citrus-squeezer-yellow_img_0',1,1,54),(89,'products/product_egg-slicer_img_0',1,1,55),(90,'products/product_electric-stove_img_0',1,1,56),(91,'products/product_electric-stove_img_1',0,2,56),(92,'products/product_electric-stove_img_2',0,3,56),(93,'products/product_electric-stove_img_3',0,4,56),(94,'products/product_fine-mesh-strainer_img_0',1,1,57),(95,'products/product_fork_img_0',1,1,58),(96,'products/product_glass_img_0',1,1,59),(97,'products/product_grater-black_img_0',1,1,60),(98,'products/product_hand-blender_img_0',1,1,61),(99,'products/product_ice-cube-tray_img_0',1,1,62),(100,'products/product_kitchen-sieve_img_0',1,1,63),(101,'products/product_knife_img_0',1,1,64),(102,'products/product_lunch-box_img_0',1,1,65),(103,'products/product_microwave-oven_img_0',1,1,66),(104,'products/product_microwave-oven_img_1',0,2,66),(105,'products/product_microwave-oven_img_2',0,3,66),(106,'products/product_microwave-oven_img_3',0,4,66),(107,'products/product_mug-tree-stand_img_0',1,1,67),(108,'products/product_mug-tree-stand_img_1',0,2,67),(109,'products/product_pan_img_0',1,1,68),(110,'products/product_plate_img_0',1,1,69),(111,'products/product_red-tongs_img_0',1,1,70),(112,'products/product_silver-pot-with-glass-cap_img_0',1,1,71),(113,'products/product_slotted-turner_img_0',1,1,72),(114,'products/product_spice-rack_img_0',1,1,73),(115,'products/product_spoon_img_0',1,1,74),(116,'products/product_tray_img_0',1,1,75),(117,'products/product_wooden-rolling-pin_img_0',1,1,76),(118,'products/product_yellow-peeler_img_0',1,1,77),(119,'products/product_apple-macbook-pro-14-inch-space-grey_img_0',1,1,78),(120,'products/product_apple-macbook-pro-14-inch-space-grey_img_1',0,2,78),(121,'products/product_apple-macbook-pro-14-inch-space-grey_img_2',0,3,78),(122,'products/product_asus-zenbook-pro-dual-screen-laptop_img_0',1,1,79),(123,'products/product_asus-zenbook-pro-dual-screen-laptop_img_1',0,2,79),(124,'products/product_asus-zenbook-pro-dual-screen-laptop_img_2',0,3,79),(125,'products/product_huawei-matebook-x-pro_img_0',1,1,80),(126,'products/product_huawei-matebook-x-pro_img_1',0,2,80),(127,'products/product_huawei-matebook-x-pro_img_2',0,3,80),(128,'products/product_lenovo-yoga-920_img_0',1,1,81),(129,'products/product_lenovo-yoga-920_img_1',0,2,81),(130,'products/product_lenovo-yoga-920_img_2',0,3,81),(131,'products/product_new-dell-xps-13-9300-laptop_img_0',1,1,82),(132,'products/product_new-dell-xps-13-9300-laptop_img_1',0,2,82),(133,'products/product_new-dell-xps-13-9300-laptop_img_2',0,3,82),(134,'products/product_blue-black-check-shirt_img_0',1,1,83),(135,'products/product_blue-black-check-shirt_img_1',0,2,83),(136,'products/product_blue-black-check-shirt_img_2',0,3,83),(137,'products/product_blue-black-check-shirt_img_3',0,4,83),(138,'products/product_gigabyte-aorus-men-tshirt_img_0',1,1,84),(139,'products/product_gigabyte-aorus-men-tshirt_img_1',0,2,84),(140,'products/product_gigabyte-aorus-men-tshirt_img_2',0,3,84),(141,'products/product_gigabyte-aorus-men-tshirt_img_3',0,4,84),(142,'products/product_man-plaid-shirt_img_0',1,1,85),(143,'products/product_man-plaid-shirt_img_1',0,2,85),(144,'products/product_man-plaid-shirt_img_2',0,3,85),(145,'products/product_man-plaid-shirt_img_3',0,4,85),(146,'products/product_man-short-sleeve-shirt_img_0',1,1,86),(147,'products/product_man-short-sleeve-shirt_img_1',0,2,86),(148,'products/product_man-short-sleeve-shirt_img_2',0,3,86),(149,'products/product_man-short-sleeve-shirt_img_3',0,4,86),(150,'products/product_men-check-shirt_img_0',1,1,87),(151,'products/product_men-check-shirt_img_1',0,2,87),(152,'products/product_men-check-shirt_img_2',0,3,87),(153,'products/product_men-check-shirt_img_3',0,4,87),(154,'products/product_nike-air-jordan-1-red-and-black_img_0',1,1,88),(155,'products/product_nike-air-jordan-1-red-and-black_img_1',0,2,88),(156,'products/product_nike-air-jordan-1-red-and-black_img_2',0,3,88),(157,'products/product_nike-air-jordan-1-red-and-black_img_3',0,4,88),(158,'products/product_nike-baseball-cleats_img_0',1,1,89),(159,'products/product_nike-baseball-cleats_img_1',0,2,89),(160,'products/product_nike-baseball-cleats_img_2',0,3,89),(161,'products/product_nike-baseball-cleats_img_3',0,4,89),(162,'products/product_puma-future-rider-trainers_img_0',1,1,90),(163,'products/product_puma-future-rider-trainers_img_1',0,2,90),(164,'products/product_puma-future-rider-trainers_img_2',0,3,90),(165,'products/product_puma-future-rider-trainers_img_3',0,4,90),(166,'products/product_sports-sneakers-off-white-red_img_0',1,1,91),(167,'products/product_sports-sneakers-off-white-red_img_1',0,2,91),(168,'products/product_sports-sneakers-off-white-red_img_2',0,3,91),(169,'products/product_sports-sneakers-off-white-red_img_3',0,4,91),(170,'products/product_brown-leather-belt-watch_img_0',1,1,92),(171,'products/product_brown-leather-belt-watch_img_1',0,2,92),(172,'products/product_brown-leather-belt-watch_img_2',0,3,92),(173,'products/product_longines-master-collection_img_0',1,1,93),(174,'products/product_longines-master-collection_img_1',0,2,93),(175,'products/product_longines-master-collection_img_2',0,3,93),(176,'products/product_rolex-cellini-date-black-dial_img_0',1,1,94),(177,'products/product_rolex-cellini-date-black-dial_img_1',0,2,94),(178,'products/product_rolex-cellini-date-black-dial_img_2',0,3,94),(179,'products/product_rolex-cellini-moonphase_img_0',1,1,95),(180,'products/product_rolex-cellini-moonphase_img_1',0,2,95),(181,'products/product_rolex-cellini-moonphase_img_2',0,3,95),(182,'products/product_rolex-datejust_img_0',1,1,96),(183,'products/product_rolex-datejust_img_1',0,2,96),(184,'products/product_rolex-datejust_img_2',0,3,96),(185,'products/product_rolex-submariner-watch_img_0',1,1,97),(186,'products/product_rolex-submariner-watch_img_1',0,2,97),(187,'products/product_rolex-submariner-watch_img_2',0,3,97),(188,'products/product_amazon-echo-plus_img_0',1,1,98),(189,'products/product_amazon-echo-plus_img_1',0,2,98),(190,'products/product_apple-airpods_img_0',1,1,99),(191,'products/product_apple-airpods_img_1',0,2,99),(192,'products/product_apple-airpods_img_2',0,3,99),(193,'image/upload/v1761694407/products/Redmi_Note_12_pro_ey94y8.jpg',1,0,100),(194,'products/product_majestic-mountain-graphic-t-shirt_img_0',1,0,101),(195,'products/product_majestic-mountain-graphic-t-shirt_img_1',0,1,101),(196,'products/product_majestic-mountain-graphic-t-shirt_img_2',0,2,101),(197,'products/product_classic-black-hooded-sweatshirt_img_0',1,0,102),(198,'products/product_classic-comfort-fit-joggers_img_0',1,0,103),(199,'products/product_classic-comfort-fit-joggers_img_1',0,1,103),(200,'products/product_classic-comfort-fit-joggers_img_2',0,2,103),(201,'products/product_classic-comfort-drawstring-joggers_img_0',1,0,104),(202,'products/product_classic-comfort-drawstring-joggers_img_1',0,1,104),(203,'products/product_classic-red-jogger-sweatpants_img_0',1,0,105),(204,'products/product_classic-red-jogger-sweatpants_img_1',0,1,105),(205,'products/product_classic-red-jogger-sweatpants_img_2',0,2,105),(206,'products/product_classic-navy-blue-baseball-cap_img_0',1,0,106),(207,'products/product_classic-navy-blue-baseball-cap_img_1',0,1,106),(208,'products/product_classic-navy-blue-baseball-cap_img_2',0,2,106),(209,'products/product_classic-blue-baseball-cap_img_0',1,0,107),(210,'products/product_classic-blue-baseball-cap_img_1',0,1,107),(211,'products/product_classic-blue-baseball-cap_img_2',0,2,107),(212,'products/product_classic-red-baseball-cap_img_0',1,0,108),(213,'products/product_classic-red-baseball-cap_img_1',0,1,108),(214,'products/product_classic-red-baseball-cap_img_2',0,2,108),(215,'products/product_classic-black-baseball-cap_img_0',1,0,109),(216,'products/product_classic-black-baseball-cap_img_1',0,1,109),(217,'products/product_classic-black-baseball-cap_img_2',0,2,109),(218,'products/product_classic-olive-chino-shorts_img_0',1,0,110),(219,'products/product_classic-olive-chino-shorts_img_1',0,1,110),(220,'products/product_classic-high-waisted-athletic-shorts_img_0',1,0,111),(221,'products/product_classic-high-waisted-athletic-shorts_img_1',0,1,111),(222,'products/product_classic-high-waisted-athletic-shorts_img_2',0,2,111),(223,'products/product_classic-white-crew-neck-t-shirt_img_0',1,0,112),(224,'products/product_classic-white-crew-neck-t-shirt_img_1',0,1,112),(225,'products/product_classic-white-crew-neck-t-shirt_img_2',0,2,112),(226,'products/product_classic-white-tee-timeless-style-and-comfort_img_0',1,0,113),(227,'products/product_classic-white-tee-timeless-style-and-comfort_img_1',0,1,113),(228,'products/product_classic-white-tee-timeless-style-and-comfort_img_2',0,2,113),(229,'products/product_classic-black-t-shirt_img_0',1,0,114),(230,'products/product_classic-black-t-shirt_img_2',0,2,114),(231,'products/product_sleek-white-orange-wireless-gaming-controller_img_0',1,0,115),(232,'products/product_sleek-white-orange-wireless-gaming-controller_img_1',0,1,115),(233,'products/product_sleek-white-orange-wireless-gaming-controller_img_2',0,2,115),(234,'products/product_sleek-wireless-headphone-inked-earbud-set_img_0',1,0,116),(235,'products/product_sleek-wireless-headphone-inked-earbud-set_img_1',0,1,116),(236,'products/product_sleek-wireless-headphone-inked-earbud-set_img_2',0,2,116),(237,'products/product_sleek-comfort-fit-over-ear-headphones_img_0',1,0,117),(238,'products/product_sleek-comfort-fit-over-ear-headphones_img_1',0,1,117),(239,'products/product_sleek-comfort-fit-over-ear-headphones_img_2',0,2,117),(240,'products/product_efficient-2-slice-toaster_img_0',1,0,118),(241,'products/product_efficient-2-slice-toaster_img_1',0,1,118),(242,'products/product_efficient-2-slice-toaster_img_2',0,2,118),(243,'products/product_sleek-wireless-computer-mouse_img_0',1,0,119),(244,'products/product_sleek-wireless-computer-mouse_img_1',0,1,119),(245,'products/product_sleek-wireless-computer-mouse_img_2',0,2,119),(246,'products/product_sleek-modern-laptop-with-ambient-lighting_img_0',1,0,120),(247,'products/product_sleek-modern-laptop-with-ambient-lighting_img_1',0,1,120),(248,'products/product_sleek-modern-laptop-with-ambient-lighting_img_2',0,2,120),(249,'products/product_sleek-modern-laptop-for-professionals_img_0',1,0,121),(250,'products/product_sleek-modern-laptop-for-professionals_img_1',0,1,121),(251,'products/product_sleek-modern-laptop-for-professionals_img_2',0,2,121),(252,'products/product_stylish-red-silver-over-ear-headphones_img_0',1,0,122),(253,'products/product_stylish-red-silver-over-ear-headphones_img_1',0,1,122),(254,'products/product_stylish-red-silver-over-ear-headphones_img_2',0,2,122),(255,'products/product_sleek-mirror-finish-phone-case_img_0',1,0,123),(256,'products/product_sleek-mirror-finish-phone-case_img_1',0,1,123),(257,'products/product_sleek-mirror-finish-phone-case_img_2',0,2,123),(258,'products/product_sleek-smartwatch-with-vibrant-display_img_0',1,0,124),(259,'products/product_sleek-smartwatch-with-vibrant-display_img_1',0,1,124),(260,'products/product_sleek-smartwatch-with-vibrant-display_img_2',0,2,124),(261,'products/product_sleek-modern-leather-sofa_img_0',1,0,125),(262,'products/product_sleek-modern-leather-sofa_img_1',0,1,125),(263,'products/product_sleek-modern-leather-sofa_img_2',0,2,125),(264,'products/product_mid-century-modern-wooden-dining-table_img_0',1,0,126),(265,'products/product_mid-century-modern-wooden-dining-table_img_1',0,1,126),(266,'products/product_mid-century-modern-wooden-dining-table_img_2',0,2,126),(267,'products/product_elegant-golden-base-stone-top-dining-table_img_0',1,0,127),(268,'products/product_elegant-golden-base-stone-top-dining-table_img_1',0,1,127),(269,'products/product_elegant-golden-base-stone-top-dining-table_img_2',0,2,127),(270,'products/product_modern-elegance-teal-armchair_img_0',1,0,128),(271,'products/product_modern-elegance-teal-armchair_img_1',0,1,128),(272,'products/product_modern-elegance-teal-armchair_img_2',0,2,128),(273,'products/product_elegant-solid-wood-dining-table_img_0',1,0,129),(274,'products/product_elegant-solid-wood-dining-table_img_1',0,1,129),(275,'products/product_elegant-solid-wood-dining-table_img_2',0,2,129),(276,'products/product_modern-minimalist-workstation-setup_img_0',1,0,130),(277,'products/product_modern-minimalist-workstation-setup_img_1',0,1,130),(278,'products/product_modern-minimalist-workstation-setup_img_2',0,2,130),(279,'products/product_modern-ergonomic-office-chair_img_0',1,0,131),(280,'products/product_modern-ergonomic-office-chair_img_1',0,1,131),(281,'products/product_futuristic-holographic-soccer-cleats_img_0',1,0,132),(282,'products/product_futuristic-holographic-soccer-cleats_img_1',0,1,132),(283,'products/product_futuristic-holographic-soccer-cleats_img_2',0,2,132),(284,'products/product_rainbow-glitter-high-heels_img_0',1,0,133),(285,'products/product_rainbow-glitter-high-heels_img_1',0,1,133),(286,'products/product_rainbow-glitter-high-heels_img_2',0,2,133),(287,'products/product_chic-summer-denim-espadrille-sandals_img_0',1,0,134),(288,'products/product_chic-summer-denim-espadrille-sandals_img_1',0,1,134),(289,'products/product_chic-summer-denim-espadrille-sandals_img_2',0,2,134),(290,'products/product_vibrant-runners-bold-orange-blue-sneakers_img_0',1,0,135),(291,'products/product_vibrant-runners-bold-orange-blue-sneakers_img_2',0,2,135),(292,'products/product_vibrant-pink-classic-sneakers_img_0',1,0,136),(293,'products/product_vibrant-pink-classic-sneakers_img_1',0,1,136),(294,'products/product_vibrant-pink-classic-sneakers_img_2',0,2,136),(295,'products/product_futuristic-silver-and-gold-high-top-sneaker_img_0',1,0,137),(296,'products/product_futuristic-silver-and-gold-high-top-sneaker_img_1',0,1,137),(297,'products/product_futuristic-silver-and-gold-high-top-sneaker_img_2',0,2,137),(298,'products/product_futuristic-chic-high-heel-boots_img_0',1,0,138),(299,'products/product_futuristic-chic-high-heel-boots_img_1',0,1,138),(300,'products/product_futuristic-chic-high-heel-boots_img_2',0,2,138),(301,'products/product_elegant-patent-leather-peep-toe-pumps_img_0',1,0,139),(302,'products/product_elegant-patent-leather-peep-toe-pumps_img_1',0,1,139),(303,'products/product_elegant-patent-leather-peep-toe-pumps_img_2',0,2,139),(304,'products/product_elegant-purple-leather-loafers_img_0',1,0,140),(305,'products/product_elegant-purple-leather-loafers_img_1',0,1,140),(306,'products/product_elegant-purple-leather-loafers_img_2',0,2,140),(307,'products/product_classic-blue-suede-casual-shoes_img_0',1,0,141),(308,'products/product_classic-blue-suede-casual-shoes_img_1',0,1,141),(309,'products/product_classic-blue-suede-casual-shoes_img_2',0,2,141),(310,'products/product_sleek-futuristic-electric-bicycle_img_0',1,0,142),(311,'products/product_sleek-futuristic-electric-bicycle_img_1',0,1,142),(312,'products/product_sleek-futuristic-electric-bicycle_img_2',0,2,142),(313,'products/product_sleek-all-terrain-go-kart_img_0',1,0,143),(314,'products/product_sleek-all-terrain-go-kart_img_1',0,1,143),(315,'products/product_sleek-all-terrain-go-kart_img_2',0,2,143),(316,'products/product_radiant-citrus-eau-de-parfum_img_0',1,0,144),(317,'products/product_radiant-citrus-eau-de-parfum_img_1',0,1,144),(318,'products/product_radiant-citrus-eau-de-parfum_img_2',0,2,144),(319,'products/product_sleek-olive-green-hardshell-carry-on-luggage_img_0',1,0,145),(320,'products/product_sleek-olive-green-hardshell-carry-on-luggage_img_1',0,1,145),(321,'products/product_sleek-olive-green-hardshell-carry-on-luggage_img_2',0,2,145),(322,'products/product_chic-transparent-fashion-handbag_img_0',1,0,146),(323,'products/product_chic-transparent-fashion-handbag_img_1',0,1,146),(324,'products/product_chic-transparent-fashion-handbag_img_2',0,2,146),(325,'products/product_trendy-pink-tinted-sunglasses_img_0',1,0,147),(326,'products/product_trendy-pink-tinted-sunglasses_img_1',0,1,147),(327,'products/product_trendy-pink-tinted-sunglasses_img_2',0,2,147),(328,'products/product_elegant-glass-tumbler-set_img_0',1,0,148),(329,'products/product_elegant-glass-tumbler-set_img_1',0,1,148),(330,'products/product_elegant-glass-tumbler-set_img_2',0,2,148),(332,'image/upload/v1762080593/products/2857_odyblj.jpg',1,0,163);
/*!40000 ALTER TABLE `product_productimage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `revoked_tokens`
--

DROP TABLE IF EXISTS `revoked_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `revoked_tokens` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `jti` varchar(255) NOT NULL,
  `revoked_at` datetime(6) NOT NULL,
  `expires_at` datetime(6) NOT NULL,
  `token_type` varchar(10) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `jti` (`jti`),
  KEY `revoked_tokens_user_id_39072743_fk_account_client_id` (`user_id`),
  KEY `revoked_tok_jti_8c2714_idx` (`jti`),
  KEY `revoked_tok_expires_cdc4fe_idx` (`expires_at`),
  CONSTRAINT `revoked_tokens_user_id_39072743_fk_account_client_id` FOREIGN KEY (`user_id`) REFERENCES `account_client` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `revoked_tokens`
--

LOCK TABLES `revoked_tokens` WRITE;
/*!40000 ALTER TABLE `revoked_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `revoked_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shopkeeper_shopkeeper`
--

DROP TABLE IF EXISTS `shopkeeper_shopkeeper`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shopkeeper_shopkeeper` (
  `id` bigint NOT NULL AUTO_INCREMENT,
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
  `phone_number` varchar(15) DEFAULT NULL,
  `alternate_phone_number` varchar(15) DEFAULT NULL,
  `address` longtext,
  `profile_picture` varchar(255) DEFAULT NULL,
  `business_name` varchar(200) DEFAULT NULL,
  `business_type` varchar(100) DEFAULT NULL,
  `is_verified` tinyint(1) NOT NULL,
  `longitude` double DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shopkeeper_shopkeeper`
--

LOCK TABLES `shopkeeper_shopkeeper` WRITE;
/*!40000 ALTER TABLE `shopkeeper_shopkeeper` DISABLE KEYS */;
INSERT INTO `shopkeeper_shopkeeper` VALUES (1,'pbkdf2_sha256$1000000$png7ExCScXTvRO3B7Ozpzb$VkW/bhL7oE01U2GIpl2dfZ+0b3Y/jOujn++Jb6woiUY=',NULL,0,'durgeshshop','','','durgeshkumar@gmail.com',1,1,'2025-10-28 23:28:02.558088','7080594874',NULL,'A',NULL,'Electronic','electronics',0,NULL,NULL),(2,'pbkdf2_sha256$1000000$eFdphSzeJKjF02fyF9VsnD$jIJZVdIUUQg5R2K4edQEQNu8QF9Aa/M+EnuKgGRuLWw=',NULL,0,'shop_electronics','','','electronics@shop.com',1,1,'2025-10-30 01:33:50.766862','9129412918','7080594874','Paradis hostal modipuram meerut up 250110','image/upload/v1762080492/shopkeepers/2687_gblk2r.png','Tech Hub','Electronics',1,NULL,NULL),(3,'pbkdf2_sha256$1000000$xNQIrvxqOVCgrRET13sbNK$Vv0az0NahCWgBiBvZLzodYxR/irvVxr9R0p7qI4K0go=',NULL,0,'shop_fashion','','','fashion@shop.com',1,1,'2025-10-30 01:33:52.489078',NULL,NULL,NULL,NULL,'Style Store','Fashion',1,NULL,NULL),(4,'pbkdf2_sha256$1000000$4Yuk2yEE8Qnmm3teAOANJP$E7y70q5EckPhqGg+S8E8AoIN4iBU6Q2rgY1SSJMwJEo=',NULL,0,'shop_home','','','home@shop.com',1,1,'2025-10-30 01:33:54.686857',NULL,NULL,NULL,NULL,'Home Essentials','Home & Garden',1,NULL,NULL),(5,'pbkdf2_sha256$1000000$U3pRWoBb6qmKWWDm1nTenu$ndbilGDcVJk6k2UEKTtXknGM31gnTtW17/d2maUVAA8=',NULL,0,'shop_sports','','','sports@shop.com',1,1,'2025-10-30 01:33:56.318915',NULL,NULL,NULL,NULL,'Sports Arena','Sports',1,NULL,NULL),(6,'pbkdf2_sha256$1000000$asjhtDSWrv6PmKnNbBPxUm$Dc881P0hEKpWsh2CbPUROFQmxGjBaaDH0v04TbNTsGM=',NULL,0,'shop_books','','','books@shop.com',1,1,'2025-10-30 01:33:57.929341',NULL,NULL,NULL,NULL,'Book Haven','Books',1,NULL,NULL),(7,'pbkdf2_sha256$1000000$jkmoVZcpuFbDp8M8dnVaS9$RVurfT+QrNWVQNV8B8V7cGdrciyinNP3gnGK/t+RZDQ=',NULL,0,'shop_toys','','','toys@shop.com',1,1,'2025-10-30 01:33:59.500569',NULL,NULL,NULL,NULL,'Toy World','Toys',1,NULL,NULL),(8,'pbkdf2_sha256$1000000$beuLxYaAgUFsC6hPqUg4K4$8faWOtWXoqGoxqW1r0o5RX/660rwBZDiLfRyqvYVtaw=',NULL,0,'shop_beauty','','','beauty@shop.com',1,1,'2025-10-30 01:34:01.059693',NULL,NULL,NULL,NULL,'Beauty Palace','Beauty',1,NULL,NULL),(9,'pbkdf2_sha256$1000000$ofS0Bmj00kKDMr2UHtnLdd$/FqiT6VnUMH4CQh3g+54entIFB07zlz1jOFKgyGWA2Q=',NULL,0,'shop_grocery','','','grocery@shop.com',1,1,'2025-10-30 01:34:02.594372',NULL,NULL,NULL,NULL,'Fresh Mart','Grocery',1,NULL,NULL),(10,'pbkdf2_sha256$1000000$aasGO0KXqm9q4zZIDUMjvA$N2lT+6dzEba7gZc3+KSjZixErb7SpSLMVYQqxxdJpRw=',NULL,0,'shop_furniture','','','furniture@shop.com',1,1,'2025-10-30 01:34:04.130686',NULL,NULL,NULL,NULL,'Furniture Plus','Furniture',1,NULL,NULL),(11,'pbkdf2_sha256$1000000$bSdKq9eE6s4sjw85kCwnUe$gdDPCiFdKZQUVimvQtd3QmEV4ydyfo7LrFXfm/V+KM8=',NULL,0,'shop_jewelry','','','jewelry@shop.com',1,1,'2025-10-30 01:34:05.651383',NULL,NULL,NULL,NULL,'Gem Gallery','Jewelry',1,NULL,NULL);
/*!40000 ALTER TABLE `shopkeeper_shopkeeper` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shopkeeper_shopkeeper_groups`
--

DROP TABLE IF EXISTS `shopkeeper_shopkeeper_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shopkeeper_shopkeeper_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `shopkeeper_id` bigint NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `shopkeeper_shopkeeper_gr_shopkeeper_id_group_id_82e5a96d_uniq` (`shopkeeper_id`,`group_id`),
  KEY `shopkeeper_shopkeeper_groups_group_id_014c61b8_fk_auth_group_id` (`group_id`),
  CONSTRAINT `shopkeeper_shopkeepe_shopkeeper_id_489173db_fk_shopkeepe` FOREIGN KEY (`shopkeeper_id`) REFERENCES `shopkeeper_shopkeeper` (`id`),
  CONSTRAINT `shopkeeper_shopkeeper_groups_group_id_014c61b8_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shopkeeper_shopkeeper_groups`
--

LOCK TABLES `shopkeeper_shopkeeper_groups` WRITE;
/*!40000 ALTER TABLE `shopkeeper_shopkeeper_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `shopkeeper_shopkeeper_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shopkeeper_shopkeeper_user_permissions`
--

DROP TABLE IF EXISTS `shopkeeper_shopkeeper_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shopkeeper_shopkeeper_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `shopkeeper_id` bigint NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `shopkeeper_shopkeeper_us_shopkeeper_id_permission_ed518d93_uniq` (`shopkeeper_id`,`permission_id`),
  KEY `shopkeeper_shopkeepe_permission_id_de715556_fk_auth_perm` (`permission_id`),
  CONSTRAINT `shopkeeper_shopkeepe_permission_id_de715556_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `shopkeeper_shopkeepe_shopkeeper_id_8d581e93_fk_shopkeepe` FOREIGN KEY (`shopkeeper_id`) REFERENCES `shopkeeper_shopkeeper` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shopkeeper_shopkeeper_user_permissions`
--

LOCK TABLES `shopkeeper_shopkeeper_user_permissions` WRITE;
/*!40000 ALTER TABLE `shopkeeper_shopkeeper_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `shopkeeper_shopkeeper_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shopkeeper_shopkeeperdocument`
--

DROP TABLE IF EXISTS `shopkeeper_shopkeeperdocument`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shopkeeper_shopkeeperdocument` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `document_type` varchar(150) NOT NULL,
  `document_name` varchar(255) NOT NULL,
  `document_file` varchar(255) NOT NULL,
  `is_verified` tinyint(1) NOT NULL,
  `uploaded_at` datetime(6) NOT NULL,
  `shopkeeper_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `shopkeeper_shopkeepe_shopkeeper_id_11643961_fk_shopkeepe` (`shopkeeper_id`),
  CONSTRAINT `shopkeeper_shopkeepe_shopkeeper_id_11643961_fk_shopkeepe` FOREIGN KEY (`shopkeeper_id`) REFERENCES `shopkeeper_shopkeeper` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shopkeeper_shopkeeperdocument`
--

LOCK TABLES `shopkeeper_shopkeeperdocument` WRITE;
/*!40000 ALTER TABLE `shopkeeper_shopkeeperdocument` DISABLE KEYS */;
/*!40000 ALTER TABLE `shopkeeper_shopkeeperdocument` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shopkeeper_shopkeeperorder`
--

DROP TABLE IF EXISTS `shopkeeper_shopkeeperorder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shopkeeper_shopkeeperorder` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(150) NOT NULL,
  `customer_email` varchar(254) DEFAULT NULL,
  `customer_phone` varchar(15) NOT NULL,
  `customer_address` longtext NOT NULL,
  `order_details` json NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` varchar(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `shopkeeper_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `shopkeeper_shopkeepe_shopkeeper_id_6c4be750_fk_shopkeepe` (`shopkeeper_id`),
  CONSTRAINT `shopkeeper_shopkeepe_shopkeeper_id_6c4be750_fk_shopkeepe` FOREIGN KEY (`shopkeeper_id`) REFERENCES `shopkeeper_shopkeeper` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shopkeeper_shopkeeperorder`
--

LOCK TABLES `shopkeeper_shopkeeperorder` WRITE;
/*!40000 ALTER TABLE `shopkeeper_shopkeeperorder` DISABLE KEYS */;
/*!40000 ALTER TABLE `shopkeeper_shopkeeperorder` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shopkeeper_shopkeeperproduct`
--

DROP TABLE IF EXISTS `shopkeeper_shopkeeperproduct`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shopkeeper_shopkeeperproduct` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `stock_quantity` int unsigned NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `product_id` bigint NOT NULL,
  `shopkeeper_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `shopkeeper_shopkeeperpro_shopkeeper_id_product_id_0834b99e_uniq` (`shopkeeper_id`,`product_id`),
  KEY `shopkeeper_shopkeepe_product_id_1be0e005_fk_product_p` (`product_id`),
  CONSTRAINT `shopkeeper_shopkeepe_product_id_1be0e005_fk_product_p` FOREIGN KEY (`product_id`) REFERENCES `product_product` (`id`),
  CONSTRAINT `shopkeeper_shopkeepe_shopkeeper_id_310189af_fk_shopkeepe` FOREIGN KEY (`shopkeeper_id`) REFERENCES `shopkeeper_shopkeeper` (`id`),
  CONSTRAINT `shopkeeper_shopkeeperproduct_chk_1` CHECK ((`stock_quantity` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=115 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shopkeeper_shopkeeperproduct`
--

LOCK TABLES `shopkeeper_shopkeeperproduct` WRITE;
/*!40000 ALTER TABLE `shopkeeper_shopkeeperproduct` DISABLE KEYS */;
INSERT INTO `shopkeeper_shopkeeperproduct` VALUES (1,10,'2025-10-28 23:33:28.292264','2025-10-28 23:33:28.292264',100,1),(2,57,'2025-10-30 01:33:52.432426','2025-10-30 01:40:48.275458',127,2),(3,20,'2025-10-30 01:33:52.441440','2025-11-02 10:18:03.165294',6,2),(4,40,'2025-10-30 01:33:52.450444','2025-11-02 10:58:14.197917',49,2),(5,47,'2025-10-30 01:33:52.457604','2025-10-30 01:33:52.457604',99,2),(6,20,'2025-10-30 01:33:52.464609','2025-10-30 01:33:52.464609',112,2),(7,100,'2025-10-30 01:33:52.472397','2025-11-02 14:28:23.301084',16,2),(8,59,'2025-10-30 01:33:52.479325','2025-10-30 01:33:52.479325',130,2),(9,22,'2025-10-30 01:33:54.653412','2025-10-30 01:33:54.653412',26,3),(10,15,'2025-10-30 01:33:54.653412','2025-10-30 01:33:54.653412',62,3),(11,32,'2025-10-30 01:33:54.653412','2025-10-30 01:33:54.653412',129,3),(12,50,'2025-10-30 01:33:54.667955','2025-10-30 01:33:54.667955',131,3),(13,78,'2025-10-30 01:33:54.667955','2025-10-30 01:33:54.667955',49,3),(14,26,'2025-10-30 01:33:54.683864','2025-10-30 01:33:54.683864',65,3),(15,14,'2025-10-30 01:33:54.686857','2025-10-30 01:33:54.686857',27,3),(16,62,'2025-10-30 01:33:56.203552','2025-10-30 01:33:56.203552',140,4),(17,84,'2025-10-30 01:33:56.217996','2025-10-30 01:33:56.217996',84,4),(18,34,'2025-10-30 01:33:56.217996','2025-10-30 01:33:56.217996',75,4),(19,73,'2025-10-30 01:33:56.233682','2025-10-30 01:33:56.233682',150,4),(20,30,'2025-10-30 01:33:56.233682','2025-10-30 01:33:56.233682',38,4),(21,45,'2025-10-30 01:33:56.252066','2025-10-30 01:33:56.252066',94,4),(22,33,'2025-10-30 01:33:56.252066','2025-10-30 01:33:56.252066',21,4),(23,93,'2025-10-30 01:33:56.265615','2025-10-30 01:33:56.265615',58,4),(24,49,'2025-10-30 01:33:56.265615','2025-10-30 01:33:56.265615',9,4),(25,84,'2025-10-30 01:33:56.285365','2025-10-30 01:33:56.285365',106,4),(26,83,'2025-10-30 01:33:56.285365','2025-10-30 01:33:56.285365',95,4),(27,14,'2025-10-30 01:33:56.299026','2025-10-30 01:33:56.299026',5,4),(28,86,'2025-10-30 01:33:56.299026','2025-10-30 01:33:56.299026',13,4),(29,82,'2025-10-30 01:33:57.848700','2025-10-30 01:33:57.848700',100,5),(30,75,'2025-10-30 01:33:57.855747','2025-10-30 01:33:57.855747',103,5),(31,81,'2025-10-30 01:33:57.862760','2025-10-30 01:33:57.862760',27,5),(32,55,'2025-10-30 01:33:57.870174','2025-10-30 01:33:57.870174',73,5),(33,90,'2025-10-30 01:33:57.877226','2025-10-30 01:33:57.877226',21,5),(34,11,'2025-10-30 01:33:57.883586','2025-10-30 01:33:57.883586',122,5),(35,38,'2025-10-30 01:33:57.890207','2025-10-30 01:33:57.891207',124,5),(36,91,'2025-10-30 01:33:57.898247','2025-10-30 01:33:57.898247',135,5),(37,98,'2025-10-30 01:33:57.904351','2025-10-30 01:33:57.904351',66,5),(38,17,'2025-10-30 01:33:57.911352','2025-10-30 01:33:57.911352',89,5),(39,21,'2025-10-30 01:33:57.918813','2025-10-30 01:33:57.918813',83,5),(40,83,'2025-10-30 01:33:59.383931','2025-10-30 01:33:59.383931',68,6),(41,67,'2025-10-30 01:33:59.395818','2025-10-30 01:33:59.396767',82,6),(42,67,'2025-10-30 01:33:59.403304','2025-10-30 01:33:59.403304',64,6),(43,83,'2025-10-30 01:33:59.410967','2025-10-30 01:33:59.410967',72,6),(44,18,'2025-10-30 01:33:59.418071','2025-10-30 01:33:59.418071',128,6),(45,34,'2025-10-30 01:33:59.425109','2025-10-30 01:33:59.425109',142,6),(46,73,'2025-10-30 01:33:59.430124','2025-10-30 01:33:59.430124',19,6),(47,62,'2025-10-30 01:33:59.430124','2025-10-30 01:33:59.430124',120,6),(48,33,'2025-10-30 01:33:59.446721','2025-10-30 01:33:59.446721',81,6),(49,42,'2025-10-30 01:33:59.448719','2025-10-30 01:33:59.448719',86,6),(50,75,'2025-10-30 01:33:59.462317','2025-10-30 01:33:59.462317',94,6),(51,79,'2025-10-30 01:33:59.465132','2025-10-30 01:33:59.465132',33,6),(52,80,'2025-10-30 01:33:59.477842','2025-10-30 01:33:59.477842',89,6),(53,32,'2025-10-30 01:33:59.482636','2025-10-30 01:33:59.482636',25,6),(54,21,'2025-10-30 01:33:59.482636','2025-10-30 01:33:59.482636',8,6),(55,88,'2025-10-30 01:34:00.946051','2025-10-30 01:34:00.946051',121,7),(56,68,'2025-10-30 01:34:00.948062','2025-10-30 01:34:00.948062',26,7),(57,45,'2025-10-30 01:34:00.961868','2025-10-30 01:34:00.961868',50,7),(58,65,'2025-10-30 01:34:00.966626','2025-10-30 01:34:00.966626',55,7),(59,92,'2025-10-30 01:34:00.977435','2025-10-30 01:34:00.977435',125,7),(60,21,'2025-10-30 01:34:00.979832','2025-10-30 01:34:00.979832',133,7),(61,88,'2025-10-30 01:34:00.993172','2025-10-30 01:34:00.993172',57,7),(62,45,'2025-10-30 01:34:00.995980','2025-10-30 01:34:00.995980',25,7),(63,76,'2025-10-30 01:34:01.007700','2025-10-30 01:34:01.007700',106,7),(64,21,'2025-10-30 01:34:01.013167','2025-10-30 01:34:01.013167',53,7),(65,98,'2025-10-30 01:34:01.013167','2025-10-30 01:34:01.013167',146,7),(66,22,'2025-10-30 01:34:01.029815','2025-10-30 01:34:01.029815',91,7),(67,30,'2025-10-30 01:34:01.033818','2025-10-30 01:34:01.033818',27,7),(68,65,'2025-10-30 01:34:01.043756','2025-10-30 01:34:01.043756',112,7),(69,47,'2025-10-30 01:34:01.050682','2025-10-30 01:39:54.027971',119,7),(70,23,'2025-10-30 01:34:02.508138','2025-10-30 01:34:02.508138',114,8),(71,40,'2025-10-30 01:34:02.522953','2025-10-30 01:34:02.522953',112,8),(72,62,'2025-10-30 01:34:02.526942','2025-10-30 01:34:02.526942',103,8),(73,92,'2025-10-30 01:34:02.526942','2025-10-30 01:34:02.526942',56,8),(74,19,'2025-10-30 01:34:02.541593','2025-10-30 01:34:02.541593',148,8),(75,14,'2025-10-30 01:34:02.543587','2025-10-30 01:34:02.543587',136,8),(76,52,'2025-10-30 01:34:02.543587','2025-10-30 01:34:02.543587',117,8),(77,42,'2025-10-30 01:34:02.559990','2025-10-30 01:34:02.559990',118,8),(78,13,'2025-10-30 01:34:02.562003','2025-10-30 01:34:02.562003',100,8),(79,20,'2025-10-30 01:34:02.573867','2025-10-30 01:34:02.573867',67,8),(80,47,'2025-10-30 01:34:02.576840','2025-10-30 01:34:02.576840',7,8),(81,90,'2025-10-30 01:34:02.576840','2025-10-30 01:34:02.576840',53,8),(82,32,'2025-10-30 01:34:04.023960','2025-10-30 01:34:04.023960',125,9),(83,35,'2025-10-30 01:34:04.023960','2025-10-30 01:34:04.023960',117,9),(84,59,'2025-10-30 01:34:04.040402','2025-10-30 01:34:04.040402',144,9),(85,63,'2025-10-30 01:34:04.041861','2025-10-30 01:34:04.041861',102,9),(86,13,'2025-10-30 01:34:04.056045','2025-10-30 01:34:04.056045',130,9),(87,88,'2025-10-30 01:34:04.059011','2025-11-02 05:33:29.507458',14,9),(88,24,'2025-10-30 01:34:04.069476','2025-10-30 01:34:04.069476',121,9),(89,49,'2025-10-30 01:34:04.076951','2025-10-30 01:34:04.076951',128,9),(90,20,'2025-10-30 01:34:04.080402','2025-10-30 01:34:04.080402',116,9),(91,10,'2025-10-30 01:34:04.092504','2025-10-30 01:34:04.092504',25,9),(92,83,'2025-10-30 01:34:04.095059','2025-10-30 01:34:04.095059',42,9),(93,84,'2025-10-30 01:34:04.107658','2025-10-30 01:34:04.107658',120,9),(94,32,'2025-10-30 01:34:04.112622','2025-10-30 01:34:04.112622',5,9),(95,68,'2025-10-30 01:34:04.121622','2025-10-30 01:34:04.121622',69,9),(96,60,'2025-10-30 01:34:05.556413','2025-10-30 01:34:05.556413',31,10),(97,28,'2025-10-30 01:34:05.572412','2025-10-30 01:34:05.572412',101,10),(98,70,'2025-10-30 01:34:05.572412','2025-10-30 01:34:05.572412',116,10),(99,18,'2025-10-30 01:34:05.589891','2025-10-30 01:34:05.589891',49,10),(100,58,'2025-10-30 01:34:05.593356','2025-10-30 01:34:05.593356',150,10),(101,62,'2025-10-30 01:34:05.605280','2025-10-30 01:34:05.605280',21,10),(102,14,'2025-10-30 01:34:05.612550','2025-10-30 01:34:05.612550',4,10),(103,17,'2025-10-30 01:34:05.620671','2025-10-30 01:34:05.620671',74,10),(104,89,'2025-10-30 01:34:05.628102','2025-10-30 01:34:05.628102',81,10),(105,75,'2025-10-30 01:34:05.635707','2025-10-30 01:34:05.635707',129,10),(106,46,'2025-10-30 01:34:05.642757','2025-10-30 01:34:05.642757',107,10),(107,87,'2025-10-30 01:34:07.091835','2025-10-30 01:34:07.091835',107,11),(108,77,'2025-10-30 01:34:07.099051','2025-10-30 01:34:07.099051',40,11),(109,17,'2025-10-30 01:34:07.105049','2025-10-30 01:34:07.105049',74,11),(110,67,'2025-10-30 01:34:07.111524','2025-10-30 01:34:07.111524',14,11),(111,19,'2025-10-30 01:34:07.116583','2025-10-30 01:34:07.116583',129,11),(112,41,'2025-10-30 01:34:07.116583','2025-10-30 01:34:07.116583',116,11),(113,57,'2025-10-30 01:34:07.131218','2025-10-30 01:34:07.131218',65,11),(114,100,'2025-11-02 10:49:54.574862','2025-11-02 14:28:38.739567',163,2);
/*!40000 ALTER TABLE `shopkeeper_shopkeeperproduct` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shopkeeper_shopkeeperreview`
--

DROP TABLE IF EXISTS `shopkeeper_shopkeeperreview`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shopkeeper_shopkeeperreview` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `reviewer_name` varchar(100) NOT NULL,
  `reviewer_email` varchar(254) DEFAULT NULL,
  `rating` int unsigned NOT NULL,
  `review_text` longtext,
  `is_verified` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `shopkeeper_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `shopkeeper_shopkeepe_shopkeeper_id_c158defd_fk_shopkeepe` (`shopkeeper_id`),
  CONSTRAINT `shopkeeper_shopkeepe_shopkeeper_id_c158defd_fk_shopkeepe` FOREIGN KEY (`shopkeeper_id`) REFERENCES `shopkeeper_shopkeeper` (`id`),
  CONSTRAINT `shopkeeper_shopkeeperreview_chk_1` CHECK ((`rating` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shopkeeper_shopkeeperreview`
--

LOCK TABLES `shopkeeper_shopkeeperreview` WRITE;
/*!40000 ALTER TABLE `shopkeeper_shopkeeperreview` DISABLE KEYS */;
/*!40000 ALTER TABLE `shopkeeper_shopkeeperreview` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-02 20:04:51
