import React, { useEffect, useState } from 'react';
import WorkoutCalendar from './workout_calendar/WorkoutCalendar';
import WorkoutChartBox from './WorkoutChartBox';
import WorkoutSummary from './WorkoutSummary';
import { ScheduleProvider } from './Context';

const WorkoutPage = () => {
  const [mockDataLoaded, setMockDataLoaded] = useState(false);
  const [userWorkouts, setUserWorkouts] = useState([]);

  useEffect(() => {
    const fetchWorkoutData = async () => {
      try {
        const response = await fetch('/workoutTypes.json');
        const workoutTypes = await response.json();

        // 사용자의 운동 데이터가 없을 경우, 목업 데이터 추가
        const mockSchedule = [
          {
            scheduleId: 1,
            workoutId: 1,
            scheduleStart: new Date().toISOString(),
            scheduleEnd: new Date().toISOString(),
            color: '#FF5733',
            allDay: false,
            isFinished: true,
            workoutTimeMin: 30,
            kcal: 200,
            memNo: 1
          }
        ];

        if (!workoutTypes || workoutTypes.length === 0) {
          setUserWorkouts(mockSchedule);
        }

        setMockDataLoaded(true);
      } catch (error) {
        console.error('운동 데이터 로딩 실패:', error);
      }
    };

    fetchWorkoutData();
  }, []);

  //일자별 운동칼로리 - 막대 그래프 -> WorkoutChartBox.jsx
  //달력 - 계획 입력, 클릭-모달로 상세보기or하단에 상세보기, 체크 기능 -> WorkoutCalendar.jsx
  //오늘 한 운동 - 운동명 및 칼로리
  //최근 한 운동 - 운동명 및 칼로리
  return (
    <div className="flex">
      <ScheduleProvider>
        <div className="workout-calendar w-3/5 p-5 box-border ml-5">
          <WorkoutCalendar />
        </div>
        <div className="w-2/5 h-[90%] p-5 mr-5">
          <WorkoutSummary />
          <WorkoutChartBox />
        </div>
      </ScheduleProvider>
    </div>
  );
};

export default WorkoutPage;
