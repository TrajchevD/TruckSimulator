-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: trucksimulator
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Temporary view structure for view `aktivniprodukti`
--

DROP TABLE IF EXISTS `aktivniprodukti`;
/*!50001 DROP VIEW IF EXISTS `aktivniprodukti`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `aktivniprodukti` AS SELECT 
 1 AS `ProductID`,
 1 AS `Model`,
 1 AS `Price`,
 1 AS `LicensePlate`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer` (
  `CustomerID` int NOT NULL,
  `CustomerName` varchar(100) DEFAULT NULL,
  `CustomerSurName` varchar(100) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `CustomerContact` varchar(20) DEFAULT NULL,
  `Password` varchar(255) NOT NULL,
  PRIMARY KEY (`CustomerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES (1,'Marko','Markovski','marko@example.com','Street 123, Skopje','070123456','marko123'),(2,'Elena','Stojanova','elena@example.com','Boulevard 45, Bitola','071987654','elena123'),(3,'David','Trajchev','davidtrajchev@gmail.com','UL.ANASTAS MITREV BR.4/1-2','076999813','$2b$10$1zc9OAt9TJLKGx7qQe2p7.8kVFao1dqOiPNacw4eT7EXGVFNQ1AsW'),(4,'David-v2','Trajchev','V2davidtrajchev@gmail.com','UL.ANASTAS MITREV BR.4/1-2','077999813','$2b$10$4IlcLjFqjDtQd0bOMxLP7eyU4hUBlUm.iBp2mOoHtX3KnDKYtXQPe'),(5,'Davidd','Trajchev','ddavidtrajchev@gmail.com','UL.ANASTAS MITREV BR.4/1-2','076999813','$2b$10$Ujq1p39MmCJob/lP7mrW5.Z12rjApH8mKAVBQyYzc0IJMHhoB86GC');
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customerfeedback`
--

DROP TABLE IF EXISTS `customerfeedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customerfeedback` (
  `FeedbackID` int NOT NULL,
  `CustomerID` int DEFAULT NULL,
  `ProductID` int DEFAULT NULL,
  `Rating` int DEFAULT NULL,
  `Comment` text,
  `FeedbackDate` date DEFAULT NULL,
  `TransactionID` int DEFAULT NULL,
  PRIMARY KEY (`FeedbackID`),
  KEY `CustomerID` (`CustomerID`),
  KEY `ProductID` (`ProductID`),
  KEY `fk_feedback_transaction` (`TransactionID`),
  CONSTRAINT `customerfeedback_ibfk_1` FOREIGN KEY (`CustomerID`) REFERENCES `customer` (`CustomerID`),
  CONSTRAINT `customerfeedback_ibfk_2` FOREIGN KEY (`ProductID`) REFERENCES `product` (`ProductID`),
  CONSTRAINT `fk_feedback_transaction` FOREIGN KEY (`TransactionID`) REFERENCES `procurement` (`TransactionID`),
  CONSTRAINT `customerfeedback_chk_1` CHECK ((`Rating` between 1 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customerfeedback`
--

LOCK TABLES `customerfeedback` WRITE;
/*!40000 ALTER TABLE `customerfeedback` DISABLE KEYS */;
INSERT INTO `customerfeedback` VALUES (1,1,1,5,'Odlichen kamion, mnogu zadovolen!','2025-04-05',1),(2,2,2,4,'Dobar kamion, no malo skapo.','2025-04-15',2),(3,3,1,1,'test 1 feedback','2025-05-22',22),(4,3,1,5,'test 2 feedback','2025-05-22',20),(5,3,1,3,'test 3 feedback','2025-05-22',11),(6,3,2,5,'Test za Procurement','2025-05-26',23),(7,3,2,3,'test test','2025-05-26',24),(8,3,3,5,'ff','2025-05-28',26),(9,3,2,5,'test so wallet ','2025-05-29',28),(10,3,1,1,'dd','2025-05-29',29),(11,3,1,5,'tt','2025-06-01',44),(12,3,2,1,'rtrf','2025-06-01',43),(13,3,4,5,'test v3','2025-06-01',48),(14,3,4,5,'sdsd','2025-06-04',61),(15,3,3,5,'final test','2025-06-08',65),(16,3,7,3,'-','2025-06-08',70);
/*!40000 ALTER TABLE `customerfeedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `EmployeeID` int NOT NULL,
  `EmployeeName` varchar(100) DEFAULT NULL,
  `EmployeeSurName` varchar(100) DEFAULT NULL,
  `Position` varchar(100) DEFAULT NULL,
  `Department` varchar(100) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Password` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`EmployeeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (1,'Ivan','Petrov','Sales Manager','Sales','ivan@example.com','ivan123'),(2,'Ana','Kostova','Maintenance Specialist','Maintenance','ana@example.com','ana123'),(1000,'Admin','User','Admin','Admin','admin@example.com','admin123'),(1001,'David','Trajchev','Test','Maintenance','david@example.com','david123'),(1002,'Leon','Zlatkovski','Test 2','Sales','leon@example.com','leon123'),(1003,'Test','test','Test 3','Sales','test@example.com','test123'),(1004,'v2 test','v2 test','v2 test','Sales','v2 test@example.com','v2 test123'),(1005,'V2','TEST','V2 tESTER','Maintenance','v2@example.com','v2123');
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `maintenance`
--

DROP TABLE IF EXISTS `maintenance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maintenance` (
  `MainID` int NOT NULL,
  `EmployeeID` int DEFAULT NULL,
  `ProductID` int DEFAULT NULL,
  `MainDate` date DEFAULT NULL,
  `Description` text,
  `Cost` decimal(10,2) DEFAULT NULL,
  `Status` enum('Pending','Completed') DEFAULT 'Pending',
  `StartTime` datetime DEFAULT CURRENT_TIMESTAMP,
  `EndTime` datetime DEFAULT NULL,
  PRIMARY KEY (`MainID`),
  KEY `EmployeeID` (`EmployeeID`),
  KEY `ProductID` (`ProductID`),
  CONSTRAINT `maintenance_ibfk_1` FOREIGN KEY (`EmployeeID`) REFERENCES `employee` (`EmployeeID`),
  CONSTRAINT `maintenance_ibfk_2` FOREIGN KEY (`ProductID`) REFERENCES `product` (`ProductID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maintenance`
--

LOCK TABLES `maintenance` WRITE;
/*!40000 ALTER TABLE `maintenance` DISABLE KEYS */;
INSERT INTO `maintenance` VALUES (2,2,2,'2025-05-04','0',0.00,'Completed','2025-06-01 13:27:50',NULL),(3,2,NULL,'2025-05-22','',0.00,'Pending','2025-06-01 13:27:50',NULL),(4,2,NULL,'2025-05-22','',0.00,'Pending','2025-06-01 13:27:50',NULL),(5,2,1,'2025-05-22','test test',100.00,'Completed','2025-06-01 13:27:50',NULL),(6,2,1,'2025-05-22','asasasasasa',0.00,'Completed','2025-06-01 13:27:50',NULL),(7,2,2,'2025-05-22','0',0.00,'Completed','2025-06-01 13:27:50',NULL),(8,2,2,'2025-05-22','test2-0 completed',100.00,'Completed','2025-06-01 13:27:50',NULL),(9,2,3,'2025-05-26','Zavrshen Test',100.00,'Completed','2025-06-01 13:27:50',NULL),(10,2,3,'2025-05-26','ss',1.00,'Completed','2025-06-01 13:27:50',NULL),(11,2,1,'2025-05-26','test 22',100.00,'Completed','2025-06-01 13:27:50',NULL),(12,2,1,'2025-05-27','test v2 works',0.00,'Completed','2025-06-01 13:27:50',NULL),(13,2,1,'2025-05-29','works',0.00,'Completed','2025-06-01 13:27:50',NULL),(14,2,1,'2025-05-29','xx',0.00,'Completed','2025-06-01 13:27:50',NULL),(15,2,1,'2025-06-01','test 3 done',10.00,'Completed','2025-06-01 13:32:02','2025-06-01 13:33:58'),(16,2,2,'2025-06-04','ff',0.00,'Completed','2025-06-04 00:36:29','2025-06-04 00:40:40'),(17,2,6,'2025-06-08','final test done',0.00,'Completed','2025-06-08 13:43:12','2025-06-08 13:43:28'),(18,2,2,'2025-06-08','FF',1.00,'Completed','2025-06-08 20:38:06','2025-06-08 20:38:26');
/*!40000 ALTER TABLE `maintenance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `procurement`
--

DROP TABLE IF EXISTS `procurement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `procurement` (
  `TransactionID` int NOT NULL,
  `EmployeeID` int DEFAULT NULL,
  `CustomerID` int DEFAULT NULL,
  `ProductID` int DEFAULT NULL,
  `ProcurementDate` date DEFAULT NULL,
  `Quantity` int DEFAULT NULL,
  `Status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `Notified` tinyint(1) DEFAULT '0',
  `GroupID` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`TransactionID`),
  KEY `EmployeeID` (`EmployeeID`),
  KEY `CustomerID` (`CustomerID`),
  KEY `ProductID` (`ProductID`),
  CONSTRAINT `procurement_ibfk_1` FOREIGN KEY (`EmployeeID`) REFERENCES `employee` (`EmployeeID`),
  CONSTRAINT `procurement_ibfk_2` FOREIGN KEY (`CustomerID`) REFERENCES `customer` (`CustomerID`),
  CONSTRAINT `procurement_ibfk_3` FOREIGN KEY (`ProductID`) REFERENCES `product` (`ProductID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `procurement`
--

LOCK TABLES `procurement` WRITE;
/*!40000 ALTER TABLE `procurement` DISABLE KEYS */;
INSERT INTO `procurement` VALUES (1,1,1,1,'2025-04-01',1,'Rejected',0,NULL),(2,1,2,2,'2025-04-10',1,'Rejected',0,NULL),(3,1,2,3,'2025-05-04',1,'Rejected',0,NULL),(4,1,3,1,'2025-05-20',1,'Approved',1,NULL),(5,1,3,2,'2025-05-20',1,'Approved',1,NULL),(6,1,3,1,'2025-05-20',1,'Rejected',1,NULL),(7,1,3,1,'2025-05-20',1,'Rejected',1,NULL),(8,1,3,3,'2025-05-20',1,'Rejected',1,NULL),(9,1,3,3,'2025-05-20',1,'Approved',1,NULL),(10,2,3,3,'2025-05-20',1,'Rejected',1,NULL),(11,2,3,1,'2025-05-20',1,'Approved',1,NULL),(12,2,3,2,'2025-05-20',1,'Rejected',1,NULL),(13,2,3,3,'2025-05-20',1,'Approved',1,NULL),(14,2,3,2,'2025-05-20',1,'Approved',1,NULL),(15,2,3,3,'2025-05-20',1,'Approved',1,NULL),(16,2,3,1,'2025-05-20',1,'Approved',1,NULL),(17,2,3,2,'2025-05-20',1,'Approved',1,NULL),(18,2,3,1,'2025-05-20',1,'Approved',1,NULL),(19,2,3,1,'2025-05-20',1,'Rejected',1,NULL),(20,2,3,1,'2025-05-20',1,'Approved',1,NULL),(21,2,3,2,'2025-05-20',1,'Rejected',1,NULL),(22,1,3,1,'2025-05-22',1,'Approved',1,NULL),(23,1,3,2,'2025-05-26',1,'Approved',1,NULL),(24,1,3,2,'2025-05-26',1,'Approved',1,NULL),(25,NULL,3,1,'2025-05-26',1,'Rejected',1,NULL),(26,1,3,3,'2025-05-27',1,'Approved',1,NULL),(27,1,3,4,'2025-05-28',1,'Approved',1,NULL),(28,1,3,2,'2025-05-29',1,'Approved',1,NULL),(29,1,3,1,'2025-05-29',1,'Approved',1,NULL),(30,1,3,5,'2025-05-31',1,'Approved',1,NULL),(31,1,3,3,'2025-05-31',1,'Approved',1,NULL),(32,1,3,2,'2025-05-31',1,'Approved',1,NULL),(33,1,3,1,'2025-05-31',1,'Approved',1,NULL),(34,1,3,2,'2025-05-31',1,'Approved',1,'59fa5a1c-1057-4d73-8c52-0452a016e540'),(35,1,3,2,'2025-05-31',1,'Approved',1,'59fa5a1c-1057-4d73-8c52-0452a016e540'),(36,1,3,2,'2025-05-31',1,'Approved',1,'59fa5a1c-1057-4d73-8c52-0452a016e540'),(37,1,3,4,'2025-05-31',1,'Approved',1,'59fa5a1c-1057-4d73-8c52-0452a016e540'),(38,1,3,5,'2025-05-31',1,'Approved',1,'4eddd7f5-c077-453a-9c92-7319764eb2d9'),(39,1,3,4,'2025-05-31',1,'Approved',1,'3d2fefa9-f9ba-4c15-a33d-8554f554a289'),(40,1,3,4,'2025-05-31',1,'Approved',1,'3d2fefa9-f9ba-4c15-a33d-8554f554a289'),(41,1,3,4,'2025-06-01',1,'Approved',1,'3d2fefa9-f9ba-4c15-a33d-8554f554a289'),(42,1,3,4,'2025-06-01',1,'Approved',1,'3d2fefa9-f9ba-4c15-a33d-8554f554a289'),(43,1,3,2,'2025-06-01',1,'Approved',1,'3d2fefa9-f9ba-4c15-a33d-8554f554a289'),(44,1,3,1,'2025-06-01',1,'Approved',1,'4f4d2173-9167-40f7-bdd3-223316070bd8'),(45,1,3,4,'2025-06-01',1,'Approved',1,'06392197-9788-4af9-b2c5-18482655ef0b'),(46,1,3,2,'2025-06-01',1,'Approved',1,'06392197-9788-4af9-b2c5-18482655ef0b'),(47,1,3,2,'2025-06-01',1,'Approved',1,'09909582-a574-4a4c-9ee7-52e443345ed9'),(48,1,3,4,'2025-06-01',1,'Approved',1,'09909582-a574-4a4c-9ee7-52e443345ed9'),(49,1,3,5,'2025-06-01',1,'Approved',1,'a1e0a1de-14eb-45fa-b58c-682a5ea5f357'),(50,1,3,1,'2025-06-01',1,'Approved',1,'cecc23a9-21a8-4dce-9b90-b3e7980fdecf'),(51,1,3,3,'2025-06-01',1,'Approved',1,'cecc23a9-21a8-4dce-9b90-b3e7980fdecf'),(52,1,3,2,'2025-06-01',1,'Approved',1,'74589bc5-00b8-4914-9bc4-640a6e9653d9'),(53,1,3,4,'2025-06-01',1,'Approved',1,'74589bc5-00b8-4914-9bc4-640a6e9653d9'),(54,1,5,4,'2025-06-03',1,'Approved',1,'38a3bb62-7d7f-413d-81c5-b89e2b44cb22'),(55,1,3,1,'2025-06-03',1,'Approved',1,'f4b1417e-8695-469a-a36f-a0819ed61ac3'),(56,1,3,2,'2025-06-03',1,'Approved',1,'54fecf01-70e3-4e48-b2aa-0dad10ea2138'),(57,1,3,2,'2025-06-03',1,'Approved',1,'27e5fd60-78b0-4ba2-aca5-9bd6243e7940'),(58,1,3,4,'2025-06-03',1,'Approved',1,'b0d94491-5ef1-458b-b55e-6e291702fb16'),(59,1,3,2,'2025-06-03',1,'Approved',1,'2963e415-3cd8-4ce1-8ac4-f6b400646447'),(60,1,3,3,'2025-06-04',1,'Approved',1,'f8e05dc9-cb2d-4c1a-bac4-c6eaf0ad03b8'),(61,1,3,4,'2025-06-04',1,'Approved',1,'f8e05dc9-cb2d-4c1a-bac4-c6eaf0ad03b8'),(62,1,3,2,'2025-06-04',1,'Approved',1,'26c2e101-ea4c-42c0-b1f4-0b70e4370c22'),(63,1,3,4,'2025-06-04',1,'Approved',1,'26c2e101-ea4c-42c0-b1f4-0b70e4370c22'),(64,1,3,8,'2025-06-04',1,'Approved',1,'52485536-17f9-42f5-8706-e2a6f14dc86b'),(65,1,3,3,'2025-06-08',1,'Approved',1,'6dac92de-4b41-4161-b983-d8ca4949d33a'),(66,1,3,9,'2025-06-08',1,'Approved',1,'6dac92de-4b41-4161-b983-d8ca4949d33a'),(67,1,3,6,'2025-06-08',1,'Approved',1,'4092b7e8-c3e0-4a68-a8b7-19761f532763'),(68,1,3,13,'2025-06-08',1,'Approved',1,'2b55f879-8240-42f0-9bcf-e4c8b8edd9c3'),(69,1,3,13,'2025-06-08',1,'Approved',1,'9bcb6489-69f5-4607-b152-e3b78ef98f85'),(70,1,3,7,'2025-06-08',1,'Approved',1,'04456eef-b97e-4269-a235-15a03248449e');
/*!40000 ALTER TABLE `procurement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `procurement_request`
--

DROP TABLE IF EXISTS `procurement_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `procurement_request` (
  `RequestID` int NOT NULL AUTO_INCREMENT,
  `CustomerID` int NOT NULL,
  `ProductID` int NOT NULL,
  `Quantity` int DEFAULT '1',
  `RequestedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `Status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `PaymentMethod` varchar(20) DEFAULT NULL,
  `PaymentStatus` enum('Reserved','Charged','Refunded') DEFAULT 'Reserved',
  `MonthlyPay` decimal(10,2) DEFAULT NULL,
  `TotalPrice` decimal(10,2) DEFAULT NULL,
  `Duration` int DEFAULT NULL,
  `CardID` int DEFAULT NULL,
  `TransactionType` enum('Buy','Rent') DEFAULT 'Buy',
  `GroupID` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`RequestID`),
  KEY `CustomerID` (`CustomerID`),
  KEY `ProductID` (`ProductID`),
  CONSTRAINT `procurement_request_ibfk_1` FOREIGN KEY (`CustomerID`) REFERENCES `customer` (`CustomerID`),
  CONSTRAINT `procurement_request_ibfk_2` FOREIGN KEY (`ProductID`) REFERENCES `product` (`ProductID`)
) ENGINE=InnoDB AUTO_INCREMENT=109 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `procurement_request`
--

LOCK TABLES `procurement_request` WRITE;
/*!40000 ALTER TABLE `procurement_request` DISABLE KEYS */;
INSERT INTO `procurement_request` VALUES (1,3,2,1,'2025-05-28 18:48:35','Rejected',NULL,'Reserved',95000.00,2280000.00,24,NULL,'Buy',NULL),(2,3,2,1,'2025-05-28 19:30:58','Rejected',NULL,'Reserved',95000.00,2280000.00,24,NULL,'Buy',NULL),(3,3,2,1,'2025-05-28 19:43:39','Rejected',NULL,'Reserved',95000.00,2280000.00,24,NULL,'Buy',NULL),(4,3,2,1,'2025-05-28 19:49:48','Rejected',NULL,'Reserved',NULL,95000.00,NULL,NULL,'Buy',NULL),(5,3,1,1,'2025-05-28 19:54:24','Rejected',NULL,'Reserved',120000.00,2880000.00,24,NULL,'Buy',NULL),(6,3,2,1,'2025-05-28 19:54:53','Rejected',NULL,'Reserved',95000.00,2280000.00,24,NULL,'Buy',NULL),(7,3,2,1,'2025-05-28 19:56:40','Rejected',NULL,'Reserved',100.00,2400.00,24,NULL,'Buy',NULL),(38,3,2,1,'2025-05-29 00:59:48','Approved','Card','Reserved',NULL,100.00,NULL,5,'Buy',NULL),(39,3,1,1,'2025-05-29 03:25:03','Rejected','Card','Reserved',2.81,36.53,13,5,'Rent',NULL),(40,3,1,1,'2025-05-29 23:35:28','Approved','Card','Reserved',NULL,101.00,NULL,5,'Buy',NULL),(41,3,1,1,'2025-05-30 00:10:51','Rejected','Card','Reserved',2.81,64.63,23,5,'Rent',NULL),(47,3,1,1,'2025-05-31 18:43:41','Rejected','Card','Reserved',NULL,3500.00,NULL,5,'Buy',NULL),(48,3,5,1,'2025-05-31 18:43:41','Approved','Card','Reserved',NULL,3300.00,NULL,5,'Buy',NULL),(49,3,1,1,'2025-05-31 18:57:00','Approved','Card','Reserved',NULL,3500.00,NULL,5,'Buy',NULL),(50,3,2,1,'2025-05-31 18:57:00','Approved','Card','Reserved',NULL,100.00,NULL,5,'Buy',NULL),(51,3,3,1,'2025-05-31 18:57:00','Approved','Card','Reserved',NULL,30000.00,NULL,5,'Buy',NULL),(52,3,4,1,'2025-05-31 19:07:38','Rejected','Card','Reserved',NULL,100.00,NULL,5,'Buy',NULL),(53,3,5,1,'2025-05-31 19:07:38','Rejected','Card','Reserved',NULL,3300.00,NULL,5,'Buy',NULL),(54,3,4,1,'2025-05-31 20:21:09','Rejected','Card','Refunded',NULL,100.00,NULL,5,'Buy','a3a71529-9c8d-4a0a-9d5a-aa454801b4ff'),(55,3,5,1,'2025-05-31 20:21:09','Rejected','Card','Refunded',NULL,3300.00,NULL,5,'Buy','a3a71529-9c8d-4a0a-9d5a-aa454801b4ff'),(56,3,4,1,'2025-05-31 20:26:49','Rejected','Card','Refunded',NULL,100.00,NULL,5,'Buy','ec53361e-8cc9-40e7-bb4f-1367573b76f8'),(57,3,5,1,'2025-05-31 20:26:49','Rejected','Card','Refunded',NULL,3300.00,NULL,5,'Buy','ec53361e-8cc9-40e7-bb4f-1367573b76f8'),(58,3,4,1,'2025-05-31 20:32:22','Rejected','Card','Refunded',NULL,100.00,NULL,5,'Buy','ab516bca-b99e-4c3a-8654-2c0116f60ef1'),(59,3,5,1,'2025-05-31 20:32:22','Rejected','Card','Refunded',NULL,3300.00,NULL,5,'Buy','ab516bca-b99e-4c3a-8654-2c0116f60ef1'),(60,3,4,1,'2025-05-31 21:43:51','Rejected','Card','Refunded',NULL,100.00,NULL,5,'Buy','d2f79fc8-dc44-4110-9abc-15a46d792e45'),(61,3,4,1,'2025-05-31 22:08:55','Rejected','Card','Refunded',NULL,100.00,NULL,5,'Buy','e07e9e86-66fd-437a-b2e1-d0fafce7690a'),(62,3,2,1,'2025-05-31 22:15:55','Approved','Card','Reserved',NULL,100.00,NULL,5,'Buy','59fa5a1c-1057-4d73-8c52-0452a016e540'),(63,3,4,1,'2025-05-31 22:15:55','Approved','Card','Reserved',NULL,100.00,NULL,5,'Buy','59fa5a1c-1057-4d73-8c52-0452a016e540'),(64,3,5,1,'2025-05-31 22:27:56','Approved','Card','Reserved',91.67,91.67,1,5,'Rent','4eddd7f5-c077-453a-9c92-7319764eb2d9'),(65,3,4,1,'2025-05-31 23:46:50','Approved','Card','Reserved',NULL,100.00,NULL,5,'Buy','3d2fefa9-f9ba-4c15-a33d-8554f554a289'),(66,3,2,1,'2025-05-31 23:46:50','Approved','Card','Reserved',NULL,100.00,NULL,5,'Buy','3d2fefa9-f9ba-4c15-a33d-8554f554a289'),(67,3,1,1,'2025-06-01 00:12:25','Approved','Card','Reserved',97.22,3499.92,36,5,'Rent','4f4d2173-9167-40f7-bdd3-223316070bd8'),(68,3,4,1,'2025-06-01 00:19:19','Approved','Card','Reserved',NULL,100.00,NULL,5,'Buy','06392197-9788-4af9-b2c5-18482655ef0b'),(69,3,2,1,'2025-06-01 00:19:19','Approved','Card','Reserved',NULL,100.00,NULL,5,'Buy','06392197-9788-4af9-b2c5-18482655ef0b'),(70,3,2,1,'2025-06-01 02:28:44','Approved','Card','Reserved',NULL,100.00,NULL,5,'Buy','09909582-a574-4a4c-9ee7-52e443345ed9'),(71,3,4,1,'2025-06-01 02:28:44','Approved','Card','Reserved',NULL,100.00,NULL,5,'Buy','09909582-a574-4a4c-9ee7-52e443345ed9'),(72,3,5,1,'2025-06-01 02:29:14','Approved','Card','Reserved',91.67,2750.10,30,5,'Rent','a1e0a1de-14eb-45fa-b58c-682a5ea5f357'),(73,3,1,1,'2025-06-01 02:40:15','Rejected','Card','Refunded',NULL,3500.00,NULL,5,'Buy','de010939-bd22-4e53-beb4-64a1839d0705'),(74,3,3,1,'2025-06-01 02:40:15','Rejected','Card','Refunded',NULL,30000.00,NULL,5,'Buy','de010939-bd22-4e53-beb4-64a1839d0705'),(75,3,1,1,'2025-06-01 02:52:09','Rejected','Card','Refunded',NULL,3500.00,NULL,5,'Buy','896e19a0-3948-49d3-ad1a-b342a958c298'),(76,3,3,1,'2025-06-01 02:52:09','Rejected','Card','Refunded',NULL,30000.00,NULL,5,'Buy','896e19a0-3948-49d3-ad1a-b342a958c298'),(77,3,1,1,'2025-06-01 02:59:13','Approved','Card','Reserved',NULL,3500.00,NULL,5,'Buy','cecc23a9-21a8-4dce-9b90-b3e7980fdecf'),(78,3,3,1,'2025-06-01 02:59:13','Approved','Card','Reserved',NULL,30000.00,NULL,5,'Buy','cecc23a9-21a8-4dce-9b90-b3e7980fdecf'),(79,3,2,1,'2025-06-01 03:12:18','Approved','Card','Reserved',NULL,100.00,NULL,5,'Buy','74589bc5-00b8-4914-9bc4-640a6e9653d9'),(80,3,4,1,'2025-06-01 03:12:18','Approved','Card','Reserved',NULL,100.00,NULL,5,'Buy','74589bc5-00b8-4914-9bc4-640a6e9653d9'),(81,5,2,1,'2025-06-02 11:52:48','Rejected','Card','Refunded',NULL,100.00,NULL,9,'Buy','a9420694-235d-4f22-b622-1a77e03f737e'),(82,5,4,1,'2025-06-02 11:52:48','Rejected','Card','Refunded',NULL,100.00,NULL,9,'Buy','a9420694-235d-4f22-b622-1a77e03f737e'),(83,3,1,1,'2025-06-02 12:31:02','Rejected','Card','Refunded',NULL,3500.00,NULL,5,'Buy','197813dc-a87f-49a4-8b8b-7ecc92b3619d'),(84,3,2,1,'2025-06-02 12:31:02','Rejected','Card','Refunded',NULL,100.00,NULL,5,'Buy','197813dc-a87f-49a4-8b8b-7ecc92b3619d'),(85,3,4,1,'2025-06-03 19:51:32','Rejected','Card','Refunded',NULL,100.00,NULL,5,'Buy','74f61e0d-69bf-42e2-8558-2d2167822b59'),(86,5,4,1,'2025-06-03 19:53:55','Approved','Card','Reserved',NULL,100.00,NULL,9,'Buy','38a3bb62-7d7f-413d-81c5-b89e2b44cb22'),(87,3,2,1,'2025-06-03 20:59:36','Rejected','Card','Refunded',NULL,100.00,NULL,5,'Buy','5ce75e52-6001-4688-b4b1-79fe0e720506'),(88,3,1,1,'2025-06-03 21:00:11','Approved','Card','Reserved',NULL,3500.00,NULL,5,'Buy','f4b1417e-8695-469a-a36f-a0819ed61ac3'),(89,3,2,1,'2025-06-03 21:17:28','Approved','Card','Reserved',NULL,100.00,NULL,5,'Buy','54fecf01-70e3-4e48-b2aa-0dad10ea2138'),(90,3,2,1,'2025-06-03 21:33:19','Approved','Card','Reserved',NULL,100.00,NULL,5,'Buy','27e5fd60-78b0-4ba2-aca5-9bd6243e7940'),(91,3,4,1,'2025-06-03 21:42:16','Approved','Card','Reserved',NULL,100.00,NULL,5,'Buy','b0d94491-5ef1-458b-b55e-6e291702fb16'),(92,3,2,1,'2025-06-03 21:44:21','Approved','Card','Reserved',NULL,100.00,NULL,5,'Buy','2963e415-3cd8-4ce1-8ac4-f6b400646447'),(93,3,3,1,'2025-06-04 00:34:15','Approved','Card','Reserved',NULL,300.00,NULL,5,'Buy','f8e05dc9-cb2d-4c1a-bac4-c6eaf0ad03b8'),(94,3,4,1,'2025-06-04 00:34:15','Approved','Card','Reserved',NULL,100.00,NULL,5,'Buy','f8e05dc9-cb2d-4c1a-bac4-c6eaf0ad03b8'),(95,3,2,1,'2025-06-04 13:10:35','Approved','Card','Reserved',NULL,100.00,NULL,5,'Buy','26c2e101-ea4c-42c0-b1f4-0b70e4370c22'),(96,3,4,1,'2025-06-04 13:10:35','Approved','Card','Reserved',NULL,100.00,NULL,5,'Buy','26c2e101-ea4c-42c0-b1f4-0b70e4370c22'),(97,3,8,1,'2025-06-04 13:50:20','Approved','Card','Reserved',NULL,300.00,NULL,5,'Buy','52485536-17f9-42f5-8706-e2a6f14dc86b'),(98,3,3,1,'2025-06-08 13:42:07','Approved','Card','Reserved',NULL,300.00,NULL,5,'Buy','6dac92de-4b41-4161-b983-d8ca4949d33a'),(99,3,9,1,'2025-06-08 13:42:07','Approved','Card','Reserved',NULL,300.00,NULL,5,'Buy','6dac92de-4b41-4161-b983-d8ca4949d33a'),(100,3,6,1,'2025-06-08 15:01:18','Approved','Card','Reserved',NULL,3500.00,NULL,5,'Buy','4092b7e8-c3e0-4a68-a8b7-19761f532763'),(101,3,13,1,'2025-06-08 18:24:02','Approved','Card','Reserved',NULL,100.00,NULL,5,'Buy','2b55f879-8240-42f0-9bcf-e4c8b8edd9c3'),(102,3,13,1,'2025-06-08 18:29:02','Approved','Card','Reserved',NULL,100.00,NULL,5,'Buy','9bcb6489-69f5-4607-b152-e3b78ef98f85'),(103,3,12,1,'2025-06-08 18:34:25','Rejected','Card','Refunded',NULL,100.00,NULL,5,'Buy','aebc6836-90cb-491e-8b27-92a92b93fc62'),(104,3,11,1,'2025-06-08 18:34:25','Rejected','Card','Refunded',NULL,100.00,NULL,5,'Buy','aebc6836-90cb-491e-8b27-92a92b93fc62'),(105,3,11,1,'2025-06-08 18:56:31','Rejected','Card','Refunded',NULL,100.00,NULL,5,'Buy','8b6d340b-f2cd-451f-97e6-fd802ead53ba'),(106,5,10,1,'2025-06-08 18:57:55','Rejected','Card','Refunded',NULL,100.00,NULL,9,'Buy','eb151b4f-ca2c-405f-8bd9-fc2267468c63'),(107,3,7,1,'2025-06-08 20:06:48','Rejected','Card','Refunded',97.22,97.22,1,5,'Rent','ce325e94-9a32-421e-91b9-11f94e084231'),(108,3,7,1,'2025-06-08 20:11:06','Approved','Card','Reserved',97.22,97.22,1,5,'Rent','04456eef-b97e-4269-a235-15a03248449e');
/*!40000 ALTER TABLE `procurement_request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `ProductID` int NOT NULL,
  `Model` varchar(100) DEFAULT NULL,
  `Price` decimal(10,2) DEFAULT NULL,
  `LicensePlate` varchar(50) DEFAULT NULL,
  `Status` enum('available','sold','rented','maintenance') NOT NULL,
  PRIMARY KEY (`ProductID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,'Volvo FH16',3500.00,'SK-1234-AB','sold'),(2,'Scania R500',100.00,'BT-5678-CD','available'),(3,'Kögel Trailer',300.00,'SK-2468-EF','available'),(4,'DAF(808)',100.00,'SK-1111-LL','available'),(5,'Test V2',3300.00,'SK-1111-TT','available'),(6,'Volvo FH16',3500.00,'SK-1235-AB','sold'),(7,'Volvo FH16',3500.00,'SK-1236-AB','available'),(8,'Kögel Trailer',300.00,'SK-2469-EF','available'),(9,'Kögel Trailer',300.00,'SK-2470-EF','available'),(10,'DAF(808)',100.00,'SK-1112-LL','available'),(11,'DAF(808)',100.00,'SK-1113-LL','available'),(12,'Scania R500',100.00,'BT-5679-CD','available'),(13,'Scania R500',100.00,'BT-5680-CD','available');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_type`
--

DROP TABLE IF EXISTS `t_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_type` (
  `TransactionID` int NOT NULL,
  `Type` enum('Rent','Buy') NOT NULL,
  `Duration` int DEFAULT NULL,
  `MonthlyPay` decimal(10,2) DEFAULT NULL,
  `TotalPrice` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`TransactionID`),
  CONSTRAINT `t_type_ibfk_1` FOREIGN KEY (`TransactionID`) REFERENCES `procurement` (`TransactionID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_type`
--

LOCK TABLES `t_type` WRITE;
/*!40000 ALTER TABLE `t_type` DISABLE KEYS */;
INSERT INTO `t_type` VALUES (3,'Buy',NULL,NULL,30000.00),(11,'Buy',NULL,NULL,120000.00),(12,'Rent',24,3958.33,95000.00),(13,'Rent',2,15000.00,30000.00),(14,'Rent',2,2638.89,5277.78),(15,'Buy',NULL,NULL,30000.00),(16,'Rent',36,3333.33,119999.88),(17,'Buy',NULL,NULL,95000.00),(18,'Buy',NULL,NULL,120000.00),(19,'Rent',2,3333.33,6666.66),(20,'Rent',20,3333.33,66666.60),(21,'Buy',NULL,NULL,95000.00),(22,'Buy',NULL,NULL,120000.00),(23,'Rent',1,2638.89,2638.89),(24,'Buy',NULL,NULL,95000.00),(25,'Buy',NULL,NULL,120000.00),(26,'Buy',NULL,NULL,30000.00),(27,'Rent',2,2.78,5.56),(28,'Buy',NULL,NULL,100.00),(29,'Buy',NULL,NULL,101.00),(30,'Buy',NULL,NULL,3300.00),(31,'Buy',NULL,NULL,30000.00),(32,'Buy',NULL,NULL,100.00),(33,'Buy',NULL,NULL,3500.00),(40,'Buy',NULL,NULL,100.00),(41,'Buy',NULL,NULL,100.00),(42,'Buy',NULL,NULL,100.00),(43,'Buy',NULL,NULL,100.00),(44,'Rent',36,97.22,3499.92),(45,'Buy',NULL,NULL,100.00),(46,'Buy',NULL,NULL,100.00),(47,'Buy',NULL,NULL,100.00),(48,'Buy',NULL,NULL,100.00),(49,'Rent',30,91.67,2750.10),(50,'Buy',NULL,NULL,3500.00),(51,'Buy',NULL,NULL,30000.00),(52,'Buy',NULL,NULL,100.00),(53,'Buy',NULL,NULL,100.00),(54,'Buy',NULL,NULL,100.00),(55,'Buy',NULL,NULL,3500.00),(56,'Buy',NULL,NULL,100.00),(57,'Buy',NULL,NULL,100.00),(58,'Buy',NULL,NULL,100.00),(59,'Buy',NULL,NULL,100.00),(60,'Buy',NULL,NULL,300.00),(61,'Buy',NULL,NULL,100.00),(62,'Buy',NULL,NULL,100.00),(63,'Buy',NULL,NULL,100.00),(64,'Buy',NULL,NULL,300.00),(65,'Buy',NULL,NULL,300.00),(66,'Buy',NULL,NULL,300.00),(67,'Buy',NULL,NULL,3500.00),(68,'Buy',NULL,NULL,100.00),(69,'Buy',NULL,NULL,100.00),(70,'Rent',1,97.22,97.22);
/*!40000 ALTER TABLE `t_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trailer`
--

DROP TABLE IF EXISTS `trailer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trailer` (
  `ProductID` int NOT NULL,
  `Capacity` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`ProductID`),
  CONSTRAINT `trailer_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `product` (`ProductID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trailer`
--

LOCK TABLES `trailer` WRITE;
/*!40000 ALTER TABLE `trailer` DISABLE KEYS */;
INSERT INTO `trailer` VALUES (3,20.50),(5,99.00),(8,20.50),(9,20.50);
/*!40000 ALTER TABLE `trailer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `transakciisodetali`
--

DROP TABLE IF EXISTS `transakciisodetali`;
/*!50001 DROP VIEW IF EXISTS `transakciisodetali`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `transakciisodetali` AS SELECT 
 1 AS `TransactionID`,
 1 AS `CustomerName`,
 1 AS `CustomerSurName`,
 1 AS `Model`,
 1 AS `Type`,
 1 AS `Duration`,
 1 AS `MonthlyPay`,
 1 AS `TotalPrice`,
 1 AS `ProcurementDate`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `truck`
--

DROP TABLE IF EXISTS `truck`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `truck` (
  `ProductID` int NOT NULL,
  `HP` int DEFAULT NULL,
  PRIMARY KEY (`ProductID`),
  CONSTRAINT `truck_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `product` (`ProductID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `truck`
--

LOCK TABLES `truck` WRITE;
/*!40000 ALTER TABLE `truck` DISABLE KEYS */;
INSERT INTO `truck` VALUES (1,750),(2,500),(4,999),(6,750),(7,750),(10,999),(11,999),(12,500),(13,500);
/*!40000 ALTER TABLE `truck` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `views`
--

DROP TABLE IF EXISTS `views`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `views` (
  `CustomerID` int NOT NULL,
  `ProductID` int NOT NULL,
  PRIMARY KEY (`CustomerID`,`ProductID`),
  KEY `ProductID` (`ProductID`),
  CONSTRAINT `views_ibfk_1` FOREIGN KEY (`CustomerID`) REFERENCES `customer` (`CustomerID`),
  CONSTRAINT `views_ibfk_2` FOREIGN KEY (`ProductID`) REFERENCES `product` (`ProductID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `views`
--

LOCK TABLES `views` WRITE;
/*!40000 ALTER TABLE `views` DISABLE KEYS */;
INSERT INTO `views` VALUES (1,1),(2,2),(1,3);
/*!40000 ALTER TABLE `views` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wallet`
--

DROP TABLE IF EXISTS `wallet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wallet` (
  `WalletID` int NOT NULL AUTO_INCREMENT,
  `CustomerID` int NOT NULL,
  `Balance` decimal(10,2) NOT NULL DEFAULT '0.00',
  `CardNumber` varchar(16) DEFAULT NULL,
  `ExpiryDate` date DEFAULT NULL,
  `CVV` varchar(4) DEFAULT NULL,
  `CardHolderName` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`WalletID`),
  KEY `CustomerID` (`CustomerID`),
  CONSTRAINT `wallet_ibfk_1` FOREIGN KEY (`CustomerID`) REFERENCES `customer` (`CustomerID`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wallet`
--

LOCK TABLES `wallet` WRITE;
/*!40000 ALTER TABLE `wallet` DISABLE KEYS */;
INSERT INTO `wallet` VALUES (5,3,27006257.09,'4444444444444444','2027-12-31','123','David Trajchev'),(6,4,3000.00,'5500000000000004','2028-11-30','456','David-v2 Trajchev'),(7,2,3000.00,'5500000000000000','2026-11-30','456','Elena Stojanova'),(8,2,3000.00,'5500000000000001','2026-11-30','456','David Trajchev'),(9,5,2705.56,'5500000000000001','2026-11-30','456','David Trajchev');
/*!40000 ALTER TABLE `wallet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `aktivniprodukti`
--

/*!50001 DROP VIEW IF EXISTS `aktivniprodukti`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `aktivniprodukti` AS select `product`.`ProductID` AS `ProductID`,`product`.`Model` AS `Model`,`product`.`Price` AS `Price`,`product`.`LicensePlate` AS `LicensePlate` from `product` where (`product`.`Status` = 'available') */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `transakciisodetali`
--

/*!50001 DROP VIEW IF EXISTS `transakciisodetali`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `transakciisodetali` AS select `p`.`TransactionID` AS `TransactionID`,`c`.`CustomerName` AS `CustomerName`,`c`.`CustomerSurName` AS `CustomerSurName`,`pr`.`Model` AS `Model`,`t`.`Type` AS `Type`,`t`.`Duration` AS `Duration`,`t`.`MonthlyPay` AS `MonthlyPay`,`t`.`TotalPrice` AS `TotalPrice`,`p`.`ProcurementDate` AS `ProcurementDate` from (((`procurement` `p` join `customer` `c` on((`p`.`CustomerID` = `c`.`CustomerID`))) join `product` `pr` on((`p`.`ProductID` = `pr`.`ProductID`))) join `t_type` `t` on((`p`.`TransactionID` = `t`.`TransactionID`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-08 20:47:29
