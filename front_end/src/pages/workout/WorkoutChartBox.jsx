import React, { useEffect, useState} from 'react';
//import * as echarts from 'echarts';
//import {getLast7WorkoutsDB} from "../../services/workoutLogic";
import WoChart from "./WoChart";
import {useScheduleContext} from "./Context";

const WorkoutChartBox = () => {
  const { schedules, lastWeekData, setLastWeekData } = useScheduleContext()

  //지난 7일간 운동량 - DB로부터 계산
  const getLast7Workouts = async () => {
    const lastWeek = schedules
        .filter(sc => {
          const now = new Date(); // 현재 시간
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(now.getDate() - 6); // 7일 전 날짜 (오늘 포함이므로 -6)
          sevenDaysAgo.setHours(0, 0, 0, 0); // 7일 전의 00:00:00으로 설정

          const startDate = new Date(sc.start);

          return startDate >= sevenDaysAgo && startDate <= now && sc.extendedProps.isFinished === true;
        }) // 조건 적용
        .sort((a, b) => new Date(a.start) - new Date(b.start)) // scheduleStart 기준 내림차순 정렬
    // const response = await getLast7WorkoutsDB({memNo: memNo})
    setLastWeekData(prev => ({ ...prev, weekSchedules: lastWeek || [] }))
    //console.log(response.data)
    //return lastWeek
  }
  // 2. schedules가 업데이트되면 지난 7일간 운동량 조회
  useEffect(() => {
    //schedules이 삭제되서 빈배열이 돼도 실행함
    if (schedules === undefined || schedules === null) return; // 데이터가 undefined 또는 null이면 종료
    getLast7Workouts()
  }, [schedules]) // schedules 변경될 때마다 실행
  // 3. 지난 7일간 운동량 차트 데이터 세팅
  useEffect(() => {
    if (lastWeekData.weekSchedules.length === 0) return; // 데이터가 없으면 실행 안 함

    const today = new Date();
    const newDays = [];
    const newTerms = [];
    const newKcal = [];

    // lastWeekDB 데이터를 미리 날짜별로 매핑하여 효율적인 비교
    const lastWeekMap = lastWeekData.weekSchedules.reduce((acc, item) => {
      const scheduleDate = new Date(item.start).toLocaleDateString('ko-KR', { weekday: 'short' });
      acc[scheduleDate] = item.extendedProps.kcal; // 날짜를 key로 사용하여 칼로리를 매핑
      return acc;
    }, {});

    let totalKcal = 0
    let activeDays = 0 // 운동한 날의 수를 셈


    for (let i = 6; i > -1; i--) {
      const day = new Date(today);  // 각 날짜마다 새로운 Date 객체를 만들기 위해
      //console.log(day) //Fri Mar 21 2025 17:06:25 GMT+0900 (한국 표준시)
      day.setDate(today.getDate() - i);
      const formattedDay = day.toLocaleDateString('ko-KR', { weekday: 'short' });
      // 해당 날짜에 칼로리가 있으면 해당 값을, 없으면 0을 넣기
      const kcal = lastWeekMap[formattedDay] || 0;
      newKcal.push(kcal);
      newDays.push(formattedDay);
      if (kcal > 0) { // 운동한 날이면
        totalKcal += kcal;
        activeDays += 1;
      }
      if (i === 6 || i === 0) {
        newTerms.push(day.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }));
      }
    } // end of for()

    // 운동한 날이 있다면 평균을 계산
    const averageKcal = activeDays > 0 ? totalKcal / activeDays : 0

    setLastWeekData(prev => ({
      ...prev,
      yoils: newDays,
      term: newTerms,
      kcal: newKcal,
      kcalMean: averageKcal
    }))
  }, [lastWeekData.weekSchedules])

  return (
      <>
          <div className="workout-box items-center justify-center border border-gray-300 rounded-3xl p-5 w-full h-144 mt-6 shadow-md mb-6">
            <h2 className="text-center text-base md:text-lg font-bold text-gray-900">일주일 운동량</h2>
            {lastWeekData.weekSchedules.length > 0 ?
                <>
                  <WoChart />
                </>
          :
          <p className="text-center mt-4 text-sm text-gray-500">지난주 운동량이 없습니다.</p>
          }
      </div>
</>
)
  ;
};

export default WorkoutChartBox;
