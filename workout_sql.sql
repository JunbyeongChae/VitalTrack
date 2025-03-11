CREATE database final_proj_hn character set utf8 default collate utf8mb3_general_ci;

#시작할때마다 이거 먼저 활성화!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
use final_proj_hn; #(데이터베이스 이름) 

select * from workout_types;

ALTER TABLE workout_types ADD COLUMN workout_id INT AUTO_INCREMENT PRIMARY KEY;
ALTER TABLE workout_types CHANGE workout_id workoutid int;
ALTER TABLE workout_types CHANGE met_value met text;
ALTER TABLE workout_types CHANGE workout_name name text;

drop table member_info;

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


-- 운동 스케줄 (Workout Schedule)
CREATE TABLE workoutschedule (
    scheduleId    INT AUTO_INCREMENT PRIMARY KEY,
    scheduleStart      DATETIME,
	scheduleEnd      DATETIME,
    workoutId      INT NOT NULL,
    durationMinutes      INT,
    kcal      INT,
    isFinished    BOOLEAN DEFAULT FALSE,
    memNo         INT NOT NULL,
    CONSTRAINT fk_schedule_member FOREIGN KEY (memNo) REFERENCES memberinfo(memNo),
    CONSTRAINT fk_schedule_workout FOREIGN KEY (workoutId) REFERENCES workout_types(workoutId)
) ENGINE=InnoDB;
