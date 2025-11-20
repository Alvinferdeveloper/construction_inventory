-- MySQL dump 10.13  Distrib 8.0.37, for Win64 (x86_64)
--
-- Host: localhost    Database: construction
-- ------------------------------------------------------
-- Server version	8.0.37

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
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('05d5cc3e-ef5b-4025-a453-28ef0e371397','956bd7a0ae7036d6a246feaeec74695ec93e98a970cf0c03543f9883c8bd8d8a','2025-11-19 04:38:57.793','20251111041420_better_auth',NULL,NULL,'2025-11-19 04:38:57.584',1),('1f7aea71-d0c1-4a73-ba95-b0052b4ee9c9','2d0624b46f1d8f14ff31324be46cc79b7a1fbeb8c2fb7dd51cc4678b9e25b7c9','2025-11-19 04:38:58.859','20251114154450_add_field_is_default_password',NULL,NULL,'2025-11-19 04:38:58.830',1),('958e4b45-aa31-47c9-b877-7e8b10b924d2','37b83325f7dbe1c78191a9f6ae118f66743d797c872c8e8338d666a7cebcc46a','2025-11-19 04:38:58.667','20251111045613_nuevosmodelos',NULL,NULL,'2025-11-19 04:38:57.796',1),('aa09ec17-11eb-4000-a4e9-94262127844f','533ee5b6c1de6df8e878db451911742c0e51cbd89b56f1e74e203f37956ba74b','2025-11-19 04:42:44.799','20251119044244_fix_missing_bodega_id',NULL,NULL,'2025-11-19 04:42:44.686',1),('bde1dc5f-e681-49c2-90e5-837901b60ce5','970953ace8bd493a684cd8d51f8953124a35180112658acbaea802034f1d7569','2025-11-19 04:38:58.827','20251113195725_soft_delete_and_is_active_fields',NULL,NULL,'2025-11-19 04:38:58.669',1),('e12d6ec9-1e66-4bf2-8ff9-2bea82ae366e','0e9beecbf246cf5ae3698ddeb35e70a7b744555942f8e7ee37858485c236fd45','2025-11-19 05:08:02.736','20251119050802_add_estado_to_detalle_requisa',NULL,NULL,'2025-11-19 05:08:02.719',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `accountId` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `providerId` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `accessToken` text COLLATE utf8mb4_unicode_ci,
  `refreshToken` text COLLATE utf8mb4_unicode_ci,
  `idToken` text COLLATE utf8mb4_unicode_ci,
  `accessTokenExpiresAt` datetime(3) DEFAULT NULL,
  `refreshTokenExpiresAt` datetime(3) DEFAULT NULL,
  `scope` text COLLATE utf8mb4_unicode_ci,
  `password` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `accounts_providerId_accountId_key` (`providerId`,`accountId`),
  KEY `accounts_userId_fkey` (`userId`),
  CONSTRAINT `accounts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES ('a5u4fLqtk5ruuzpUHX0BGKywrmxnsnyp','aC2OaI9wEAbDP94WfGRDN44Y52TRxXHA','credential','aC2OaI9wEAbDP94WfGRDN44Y52TRxXHA',NULL,NULL,NULL,NULL,NULL,NULL,'cd4363b9ecfa2266dfa4db3546f47269:43ea27db37fd07883ed9aa78eabc57dd7bd30e27bdeb43ffda26cc89a4aa623c658bc31eed01a0cbd6da83069c025f6855c044a54c4b23857b2d13bb66970144','2025-11-19 04:40:25.173','2025-11-19 04:40:25.173'),('cqHGxX6ZshbWdq1pQhNQafeVOpALOXxB','iIx5YVUktDuwCgICvRiJu8rkFRcaUBK8','credential','iIx5YVUktDuwCgICvRiJu8rkFRcaUBK8',NULL,NULL,NULL,NULL,NULL,NULL,'d38168e06bbb9021ad974f248e8c3d81:1777ab106a2a0faf3c5c550bd4e57e4045a1065382e731208c24b6eae9ef0197d24c4814ca240a2a834449829be949827e7a3cea5af6b3a8939519b92d699934','2025-11-19 04:40:25.501','2025-11-19 04:40:25.501'),('rSO0mnRLZ5thwuHGm9nws4u4QBeRDwMj','u4OTsOPp0PT7FG1gBtRDVOx05U2rMNBQ','credential','u4OTsOPp0PT7FG1gBtRDVOx05U2rMNBQ',NULL,NULL,NULL,NULL,NULL,NULL,'0ba931aed07afecbc12b678d7024d5e6:b46c9f636d73747a6495df0023ea50a7002a60e333097fd5521253c2c67a7dcdeac57fa5b6d375eb8769804761d5560a492950f97e6b2f5eaae25fdff5701ae2','2025-11-19 04:40:24.390','2025-11-19 04:40:24.390'),('YZhI7VqQjiRredMGRhNx8gUcIjbl3FlR','1mGVpLGAlBtKN4413s5JbzcUYYRLrBvj','credential','1mGVpLGAlBtKN4413s5JbzcUYYRLrBvj',NULL,NULL,NULL,NULL,NULL,NULL,'621db27e805dbc4ff9e16d5ebf3cff33:db331bae67f964b6fe1271bafbfee5f0e3c71f7366946d4bdfca26774cbe893b23d3e78077e49a4e90d2fb85679d4f1fdaabbb104d9dec592dd84ea12a1bec8c','2025-11-19 04:40:24.837','2025-11-19 04:40:24.837');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bodegas`
--

DROP TABLE IF EXISTS `bodegas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bodegas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ubicacion` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `responsableId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `bodegas_responsableId_fkey` (`responsableId`),
  CONSTRAINT `bodegas_responsableId_fkey` FOREIGN KEY (`responsableId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bodegas`
--

LOCK TABLES `bodegas` WRITE;
/*!40000 ALTER TABLE `bodegas` DISABLE KEYS */;
INSERT INTO `bodegas` VALUES (1,'Bodega Principal','Zona Central','1mGVpLGAlBtKN4413s5JbzcUYYRLrBvj',NULL,1);
/*!40000 ALTER TABLE `bodegas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Herramientas',NULL),(2,'Materiales de Construcción',NULL);
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalle_requisas`
--

DROP TABLE IF EXISTS `detalle_requisas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_requisas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `requisaId` int NOT NULL,
  `materialId` int NOT NULL,
  `cantidad` int NOT NULL,
  `descripcion` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  `bodegaId` int DEFAULT NULL,
  `estado` enum('pendiente','aprobado','rechazado') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pendiente',
  PRIMARY KEY (`id`),
  KEY `detalle_requisas_requisaId_fkey` (`requisaId`),
  KEY `detalle_requisas_materialId_fkey` (`materialId`),
  KEY `detalle_requisas_bodegaId_fkey` (`bodegaId`),
  CONSTRAINT `detalle_requisas_bodegaId_fkey` FOREIGN KEY (`bodegaId`) REFERENCES `bodegas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `detalle_requisas_materialId_fkey` FOREIGN KEY (`materialId`) REFERENCES `materiales` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `detalle_requisas_requisaId_fkey` FOREIGN KEY (`requisaId`) REFERENCES `requisas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_requisas`
--

LOCK TABLES `detalle_requisas` WRITE;
/*!40000 ALTER TABLE `detalle_requisas` DISABLE KEYS */;
INSERT INTO `detalle_requisas` VALUES (1,1,1,5,'Para carpintería','2025-11-19 14:52:17.165',NULL,'pendiente'),(2,1,2,20,'Para cimientos','2025-11-19 14:52:17.165',NULL,'pendiente'),(3,2,1,1,NULL,NULL,1,'aprobado'),(4,3,2,5,NULL,NULL,1,'aprobado'),(6,4,2,10,NULL,NULL,1,'aprobado'),(7,5,2,5,NULL,NULL,1,'aprobado'),(11,6,2,15,NULL,NULL,1,'pendiente'),(12,6,1,5,NULL,NULL,1,'pendiente'),(13,7,1,3,NULL,NULL,1,'pendiente'),(14,8,1,5,NULL,NULL,1,'pendiente'),(15,8,2,6,NULL,NULL,1,'pendiente'),(17,9,2,5,NULL,NULL,1,'pendiente'),(18,9,1,3,NULL,NULL,1,'pendiente');
/*!40000 ALTER TABLE `detalle_requisas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventario`
--

DROP TABLE IF EXISTS `inventario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bodegaId` int NOT NULL,
  `materialId` int NOT NULL,
  `stock_actual` int NOT NULL DEFAULT '0',
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `inventario_bodegaId_materialId_key` (`bodegaId`,`materialId`),
  KEY `inventario_materialId_fkey` (`materialId`),
  CONSTRAINT `inventario_bodegaId_fkey` FOREIGN KEY (`bodegaId`) REFERENCES `bodegas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `inventario_materialId_fkey` FOREIGN KEY (`materialId`) REFERENCES `materiales` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventario`
--

LOCK TABLES `inventario` WRITE;
/*!40000 ALTER TABLE `inventario` DISABLE KEYS */;
INSERT INTO `inventario` VALUES (1,1,1,70,NULL),(2,1,2,175,NULL);
/*!40000 ALTER TABLE `inventario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materiales`
--

DROP TABLE IF EXISTS `materiales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materiales` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unidad_medida` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoriaId` int NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `materiales_categoriaId_fkey` (`categoriaId`),
  CONSTRAINT `materiales_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `categorias` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materiales`
--

LOCK TABLES `materiales` WRITE;
/*!40000 ALTER TABLE `materiales` DISABLE KEYS */;
INSERT INTO `materiales` VALUES (1,'Martillo de uña','unidad',1,NULL),(2,'Cemento Portland','saco',2,NULL);
/*!40000 ALTER TABLE `materiales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movimientos`
--

DROP TABLE IF EXISTS `movimientos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movimientos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `inventarioId` int NOT NULL,
  `tipo` enum('entrada','salida') COLLATE utf8mb4_unicode_ci NOT NULL,
  `cantidad` int NOT NULL,
  `fecha` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `usuarioId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `observaciones` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `movimientos_inventarioId_fkey` (`inventarioId`),
  KEY `movimientos_usuarioId_fkey` (`usuarioId`),
  CONSTRAINT `movimientos_inventarioId_fkey` FOREIGN KEY (`inventarioId`) REFERENCES `inventario` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `movimientos_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movimientos`
--

LOCK TABLES `movimientos` WRITE;
/*!40000 ALTER TABLE `movimientos` DISABLE KEYS */;
INSERT INTO `movimientos` VALUES (1,1,'entrada',100,'2025-11-19 04:40:25.554','1mGVpLGAlBtKN4413s5JbzcUYYRLrBvj','Stock inicial',NULL),(2,2,'entrada',200,'2025-11-19 04:40:25.559','1mGVpLGAlBtKN4413s5JbzcUYYRLrBvj','Stock inicial',NULL);
/*!40000 ALTER TABLE `movimientos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `requisas`
--

DROP TABLE IF EXISTS `requisas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `requisas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `proyecto` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `solicitanteId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `estado` enum('pendiente','en_proceso','aprobada','rechazada','completada') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pendiente',
  `destino` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `requisas_solicitanteId_fkey` (`solicitanteId`),
  CONSTRAINT `requisas_solicitanteId_fkey` FOREIGN KEY (`solicitanteId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `requisas`
--

LOCK TABLES `requisas` WRITE;
/*!40000 ALTER TABLE `requisas` DISABLE KEYS */;
INSERT INTO `requisas` VALUES (1,'Construcción Edificio A','aC2OaI9wEAbDP94WfGRDN44Y52TRxXHA','2025-11-19 04:40:25.564','pendiente','Frente de obra 1','2025-11-19 14:52:17.165'),(2,'Construccion Edificio Unan-leon','aC2OaI9wEAbDP94WfGRDN44Y52TRxXHA','2025-11-19 04:44:02.570','en_proceso',NULL,NULL),(3,'Construccion Edificio Campus','aC2OaI9wEAbDP94WfGRDN44Y52TRxXHA','2025-11-19 05:00:18.631','aprobada',NULL,NULL),(4,'Construccion Edificio Prepa','aC2OaI9wEAbDP94WfGRDN44Y52TRxXHA','2025-11-19 14:47:37.954','en_proceso',NULL,NULL),(5,'Construccion Edificio edificio central','aC2OaI9wEAbDP94WfGRDN44Y52TRxXHA','2025-11-19 14:52:39.510','en_proceso',NULL,NULL),(6,'Construccion Edificio Campus','aC2OaI9wEAbDP94WfGRDN44Y52TRxXHA','2025-11-19 14:59:56.218','pendiente',NULL,NULL),(7,'Construccion Edificio Unan-leon','aC2OaI9wEAbDP94WfGRDN44Y52TRxXHA','2025-11-19 15:09:26.549','pendiente',NULL,NULL),(8,'Construccion Edificio GPO','aC2OaI9wEAbDP94WfGRDN44Y52TRxXHA','2025-11-19 15:15:15.327','pendiente',NULL,NULL),(9,'Construccion Edificio agragraria ','aC2OaI9wEAbDP94WfGRDN44Y52TRxXHA','2025-11-19 15:29:00.315','pendiente',NULL,NULL);
/*!40000 ALTER TABLE `requisas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'ADMINISTRADOR','Acceso total al sistema',NULL),(2,'BODEGUERO','Gestión de inventario y bodegas',NULL),(3,'SUPERVISOR','Supervisa proyectos y requisas',NULL),(4,'JEFE','Jefe de obra o proyecto',NULL),(5,'ADMINISTRADOR','Acceso total al sistema',NULL),(6,'BODEGUERO','Gestión de inventario y bodegas',NULL),(7,'SUPERVISOR','Supervisa proyectos y requisas',NULL),(8,'JEFE','Jefe de obra o proyecto',NULL);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiresAt` datetime(3) NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `ipAddress` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userAgent` text COLLATE utf8mb4_unicode_ci,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sessions_token_key` (`token`),
  KEY `sessions_userId_fkey` (`userId`),
  CONSTRAINT `sessions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('7TIOrPugjS70WvC3YI0XdpYC8GkwQgph','2025-11-27 00:50:43.789','c5EizhEl3ne1dMOhCV5JZCWsyn5iFOii','2025-11-20 00:50:43.793','2025-11-20 00:50:43.793','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36','u4OTsOPp0PT7FG1gBtRDVOx05U2rMNBQ'),('d2uhIgC2XZlv1qSQIaZJza3ukG6X45Ue','2025-11-26 04:40:24.845','MMKcj1GWMSFVrXOsgkpJ0J9GgTt0Zylc','2025-11-19 04:40:24.845','2025-11-19 04:40:24.845','127.0.0.1','node','1mGVpLGAlBtKN4413s5JbzcUYYRLrBvj'),('eqDsm9n5oFuoOnUfRGOc5h33LL4d4GYg','2025-11-26 04:40:24.402','fobW3IYCt5f9oQL3Pf273Qr8OxGruGZm','2025-11-19 04:40:24.403','2025-11-19 04:40:24.403','127.0.0.1','node','u4OTsOPp0PT7FG1gBtRDVOx05U2rMNBQ'),('pgxHbvtADsomcz2HHGyHDLm79QicFMrD','2025-11-26 04:40:25.507','QPTk0qAVhbVoCuY8jVFaAOlyLIUkWATb','2025-11-19 04:40:25.507','2025-11-19 04:40:25.507','127.0.0.1','node','iIx5YVUktDuwCgICvRiJu8rkFRcaUBK8'),('UAQlNvmNgvcQKjbBdwRB5j9spEPJ8Inj','2025-11-26 04:40:25.180','k21FXNuFfNCiVKmEgrxK0H7zTZmyLy0z','2025-11-19 04:40:25.180','2025-11-19 04:40:25.180','127.0.0.1','node','aC2OaI9wEAbDP94WfGRDN44Y52TRxXHA');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direction` text COLLATE utf8mb4_unicode_ci,
  `identification` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emailVerified` tinyint(1) NOT NULL DEFAULT '0',
  `image` text COLLATE utf8mb4_unicode_ci,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `rolId` int NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `isDefaultPassword` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_email_unique` (`email`),
  UNIQUE KEY `user_email_composite_unique` (`email`),
  KEY `users_rolId_fkey` (`rolId`),
  CONSTRAINT `users_rolId_fkey` FOREIGN KEY (`rolId`) REFERENCES `roles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('1mGVpLGAlBtKN4413s5JbzcUYYRLrBvj','Bodeguero User','bodeguero@example.com',NULL,'123456789','123 Main St','444-444444-4444P',1,NULL,1,'2025-11-19 04:40:24.825','2025-11-19 04:40:24.866',6,NULL,1,1),('aC2OaI9wEAbDP94WfGRDN44Y52TRxXHA','Supervisor User','supervisor@example.com',NULL,'123456789','123 Main St','444-444444-4444P',1,NULL,1,'2025-11-19 04:40:25.167','2025-11-19 04:40:25.199',7,NULL,1,1),('iIx5YVUktDuwCgICvRiJu8rkFRcaUBK8','Jefe User','jefe@example.com',NULL,'123456789','123 Main St','444-444444-4444P',1,NULL,1,'2025-11-19 04:40:25.495','2025-11-19 04:40:25.522',8,NULL,1,1),('u4OTsOPp0PT7FG1gBtRDVOx05U2rMNBQ','Admin User','admin@example.com',NULL,'123456789','123 Main St','444-444444-4444P',1,NULL,1,'2025-11-19 04:40:24.370','2025-11-19 04:40:24.452',5,NULL,1,1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `verifications`
--

DROP TABLE IF EXISTS `verifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `verifications` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `identifier` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiresAt` datetime(3) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `verifications`
--

LOCK TABLES `verifications` WRITE;
/*!40000 ALTER TABLE `verifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `verifications` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-19 21:33:00
