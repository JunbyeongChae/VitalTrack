#시작할때마다 이거 먼저 활성화!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
use vitaltrack; #(데이터베이스 이름) 

select * from memberInfo;
select * from workoutTypes;

commit;

CREATE TABLE workoutTypes (
	workoutId INT AUTO_INCREMENT PRIMARY KEY,
    workoutName varchar(150) NOT NULL,
    metValue decimal(5,2) NOT NULL
);

ALTER TABLE workoutTypes ADD PRIMARY KEY (workoutId);
ALTER TABLE workoutTypes CHANGE workoutId workoutId int;
ALTER TABLE workoutTypes CHANGE metValue metValue decimal(5,2);
ALTER TABLE workoutTypes CHANGE workoutName workoutName varchar(150);

commit;

USE vitaltrack;

ALTER TABLE memberinfo 
ADD COLUMN birthYear VARCHAR(4),
ADD COLUMN birthMonth VARCHAR(2),
ADD COLUMN birthDay VARCHAR(2);

-- 회원정보
CREATE TABLE `memberinfo` (
  `memNo` int NOT NULL AUTO_INCREMENT,
  user`admin` TINYINT NOT NULL DEFAULT '0',
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


-- 운동 스케줄 (Workout Schedule)
CREATE TABLE workoutschedule (
    scheduleId    INT AUTO_INCREMENT PRIMARY KEY,
    workoutId      INT NOT NULL,
    scheduleStart      DATETIME,
	scheduleEnd      DATETIME,
    color			VARCHAR(20),
    allDay    BOOLEAN DEFAULT FALSE,
    isFinished    BOOLEAN DEFAULT FALSE,
    workoutTimeMin      INT,
    kcal      INT,
    memNo         INT NOT NULL,
    CONSTRAINT fk_schedule_member FOREIGN KEY (memNo) REFERENCES memberinfo(memNo),
    CONSTRAINT fk_schedule_workout FOREIGN KEY (workoutId) REFERENCES workoutTypes(workoutId)
) ENGINE=InnoDB;


commit;