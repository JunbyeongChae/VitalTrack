-- 기존 DB가 존재할 경우 삭제
DROP DATABASE IF EXISTS vitaltrack;

-- 새로운 DB 생성
CREATE DATABASE vitaltrack;

-- vitaltrack DB 선택
USE vitaltrack;

-- 회원정보
CREATE TABLE `memberinfo` (
  `memNo` int NOT NULL AUTO_INCREMENT,
  `memId` varchar(50) NOT NULL,
  `memPw` varchar(100) NOT NULL,
  `memNick` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `memPhone` varchar(20) NOT NULL,
  `memEmail` varchar(100) NOT NULL,
  `memHeight` decimal(5,2) NOT NULL,
  `memWeight` decimal(5,2) NOT NULL,
  `memBmi` decimal(4,2) NOT NULL,
  `memKcal` int NOT NULL,
  `memGen` varchar(10) NOT NULL,
  `memAge` int NOT NULL,
  `activityLevel` enum('sedentary','lowactive','active','veryactive') NOT NULL,
  `carbMin` int NOT NULL,
  `carbMax` int NOT NULL,
  `proteinMin` int NOT NULL,
  `proteinMax` int NOT NULL,
  `fatMin` int NOT NULL,
  `fatMax` int NOT NULL,
  `admin` tinyint(1) NOT NULL DEFAULT '0',
  `birthYear` varchar(4) DEFAULT NULL,
  `birthMonth` varchar(2) DEFAULT NULL,
  `birthDay` varchar(2) DEFAULT NULL,
  PRIMARY KEY (`memNo`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 상담게시판
CREATE TABLE `counsel` (
  `counselNo` int NOT NULL AUTO_INCREMENT,
  `counselDate` date NOT NULL,
  `counselTitle` varchar(100) NOT NULL,
  `counselContent` text NOT NULL,
  `counselFile` varchar(255) DEFAULT NULL,
  `memNo` int NOT NULL,
  PRIMARY KEY (`counselNo`),
  KEY `fkCounselMember` (`memNo`),
  CONSTRAINT `fkCounselMember` FOREIGN KEY (`memNo`) REFERENCES `memberinfo` (`memNo`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 상담게시판 답변
CREATE TABLE `counselanswer` (
  `answerId` int NOT NULL AUTO_INCREMENT,
  `answerDate` date DEFAULT NULL,
  `answerWriter` varchar(100) NOT NULL,
  `answerContent` varchar(1000) NOT NULL,
  `memNo` int NOT NULL,
  `counselNo` int NOT NULL,
  PRIMARY KEY (`answerId`),
  KEY `fkAnswerMember` (`memNo`),
  KEY `fkAnswerCounsel` (`counselNo`),
  CONSTRAINT `fkAnswerCounsel` FOREIGN KEY (`counselNo`) REFERENCES `counsel` (`counselNo`) ON DELETE CASCADE,
  CONSTRAINT `fkAnswerMember` FOREIGN KEY (`memNo`) REFERENCES `memberinfo` (`memNo`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 식단관리
CREATE TABLE `diet` (
  `dietDate` date NOT NULL,
  `dietMenu` varchar(100) NOT NULL,
  `dietGram` varchar(50) NOT NULL,
  `dietKcal` varchar(50) NOT NULL,
  `dietCarb` varchar(50) DEFAULT NULL,
  `dietSugar` varchar(50) DEFAULT NULL,
  `dietProtein` varchar(50) DEFAULT NULL,
  `dietFat` varchar(50) DEFAULT NULL,
  `dietNa` varchar(50) DEFAULT NULL,
  `memNo` int NOT NULL,
  PRIMARY KEY (`memNo`,`dietDate`),
  CONSTRAINT `fkDietMember` FOREIGN KEY (`memNo`) REFERENCES `memberinfo` (`memNo`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 건강정보 게시판
CREATE TABLE `information` (
  `infoNo` bigint NOT NULL AUTO_INCREMENT,
  `infoTitle` varchar(200) NOT NULL,
  `infoDate` date NOT NULL,
  `infoWriter` varchar(50) NOT NULL,
  `infoContent` text NOT NULL,
  `infoView` int DEFAULT '0',
  `infoLike` int DEFAULT '0',
  `memNo` int NOT NULL,
  PRIMARY KEY (`infoNo`),
  KEY `fkInformationMember` (`memNo`),
  CONSTRAINT `fkInformationMember` FOREIGN KEY (`memNo`) REFERENCES `memberinfo` (`memNo`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 체중변화
CREATE TABLE `weightchange` (
  `weightDate` date NOT NULL,
  `weight` decimal(5,2) NOT NULL,
  `memNo` int NOT NULL,
  PRIMARY KEY (`memNo`,`weightDate`),
  CONSTRAINT `fkWeightMember` FOREIGN KEY (`memNo`) REFERENCES `memberinfo` (`memNo`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 운동관리
CREATE TABLE `workoutschedule` (
  `scheduleId` int NOT NULL AUTO_INCREMENT,
  `workoutDate` date NOT NULL,
  `workoutName` varchar(100) NOT NULL,
  `workoutTime` int DEFAULT NULL,
  `workoutKcal` int DEFAULT NULL,
  `workoutCheck` tinyint DEFAULT NULL,
  `memNo` int NOT NULL,
  PRIMARY KEY (`scheduleId`),
  KEY `fkScheduleMember` (`memNo`),
  CONSTRAINT `fkScheduleMember` FOREIGN KEY (`memNo`) REFERENCES `memberinfo` (`memNo`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 건강정보 게시판 댓글
CREATE TABLE `comment` (
  `commentId` int NOT NULL AUTO_INCREMENT,
  `commentDate` date NOT NULL,
  `commentWriter` varchar(100) NOT NULL,
  `commentContent` varchar(1000) NOT NULL,
  `memNo` int NOT NULL,
  `infoNo` bigint NOT NULL,
  PRIMARY KEY (`commentId`),
  KEY `fkCommentMember` (`memNo`),
  KEY `fkCommentInformation` (`infoNo`),
  CONSTRAINT `fkCommentInformation` FOREIGN KEY (`infoNo`) REFERENCES `information` (`infoNo`) ON DELETE CASCADE,
  CONSTRAINT `fkCommentMember` FOREIGN KEY (`memNo`) REFERENCES `memberinfo` (`memNo`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

commit;

select * from memberinfo;
select * from weightchange;

ALTER table memberinfo AUTO_INCREMENT = 1;
