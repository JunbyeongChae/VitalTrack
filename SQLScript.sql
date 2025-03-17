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
  PRIMARY KEY (`memNo`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


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
  CONSTRAINT `fkCounselMember` FOREIGN KEY (`memNo`) REFERENCES `memberinfo` (`memNo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


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
  CONSTRAINT `fkAnswerCounsel` FOREIGN KEY (`counselNo`) REFERENCES `counsel` (`counselNo`),
  CONSTRAINT `fkAnswerMember` FOREIGN KEY (`memNo`) REFERENCES `memberinfo` (`memNo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


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
  CONSTRAINT `fkDietMember` FOREIGN KEY (`memNo`) REFERENCES `memberinfo` (`memNo`)
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
  CONSTRAINT `fkInformationMember` FOREIGN KEY (`memNo`) REFERENCES `memberinfo` (`memNo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- 체중변화
CREATE TABLE `weightchange` (
  `weightDate` date NOT NULL,
  `weight` decimal(5,2) NOT NULL,
  `memNo` int NOT NULL,
  PRIMARY KEY (`memNo`,`weightDate`),
  CONSTRAINT `fkWeightMember` FOREIGN KEY (`memNo`) REFERENCES `memberinfo` (`memNo`)
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
  CONSTRAINT `fkScheduleMember` FOREIGN KEY (`memNo`) REFERENCES `memberinfo` (`memNo`)
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
  CONSTRAINT `fkCommentInformation` FOREIGN KEY (`infoNo`) REFERENCES `information` (`infoNo`),
  CONSTRAINT `fkCommentMember` FOREIGN KEY (`memNo`) REFERENCES `memberinfo` (`memNo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- 메인화면
CREATE TABLE `homescreen` (
  `homeId` int NOT NULL AUTO_INCREMENT,
  `memNo` int NOT NULL,
  `scheduleId` int NOT NULL,
  `homeDate` date NOT NULL,
  PRIMARY KEY (`homeId`),
  KEY `fkHomeMember` (`memNo`),
  KEY `fkHomeSchedule` (`scheduleId`),
  CONSTRAINT `fkHomeMember` FOREIGN KEY (`memNo`) REFERENCES `memberinfo` (`memNo`),
  CONSTRAINT `fkHomeSchedule` FOREIGN KEY (`scheduleId`) REFERENCES `workoutschedule` (`scheduleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 운동 기록 테이블 (홈화면용)
CREATE TABLE `exercise_record` (
    `record_id` INT AUTO_INCREMENT PRIMARY KEY,          -- 운동 기록 ID
    `mem_no` INT NOT NULL,                               -- 회원 번호 (외래키)
    `exercise_date` DATE NOT NULL,                       -- 운동 날짜
    `exercise_type` VARCHAR(50) NOT NULL,                -- 운동 종류 (걷기, 러닝 등)
    `duration_minutes` INT NOT NULL,                     -- 운동 시간 (분 단위)
    `calories_burned` INT,                               -- 소모된 칼로리
    `memo` VARCHAR(255),                                 -- 추가 메모
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,     -- 생성일
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 수정일
    FOREIGN KEY (`mem_no`) REFERENCES `memberinfo`(`memNo`) ON DELETE CASCADE
);

-- 식단 기록 테이블 (홈화면용)
CREATE TABLE `diet_record` (
    `record_id` INT AUTO_INCREMENT PRIMARY KEY,          -- 식단 기록 ID
    `mem_no` INT NOT NULL,                               -- 회원 번호 (외래키)
    `diet_date` DATE NOT NULL,                           -- 식사 날짜
    `meal_type` ENUM('아침', '점심', '저녁', '간식') NOT NULL, -- 식사 종류
    `food_name` VARCHAR(100) NOT NULL,                   -- 음식 이름
    `calories` INT NOT NULL,                             -- 섭취한 칼로리
    `memo` VARCHAR(255),                                 -- 메모
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,     -- 생성일
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 수정일
    FOREIGN KEY (`mem_no`) REFERENCES `memberinfo`(`memNo`) ON DELETE CASCADE
);

SELECT * FROM memberinfo WHERE memNo = 10;

ALTER TABLE memberinfo ADD COLUMN admin BOOLEAN DEFAULT false;

commit;