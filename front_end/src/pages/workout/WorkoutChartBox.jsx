import React, {useContext, useEffect, useState} from 'react';
import * as echarts from 'echarts';
import {getLast7WorkoutsDB} from "../../services/workoutLogic";
import WoChart from "./WoChart";
import {useScheduleContext} from "./Context";

const WorkoutChartBox = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const { memNo } = user
  const { schedules } = useScheduleContext()
  const [lastWeekDays, setLastWeekDays] = useState([]);
  const [lastWeekTerm, setLastWeekTerm] = useState([]);
  const [lastWeekDB, setLastWeekDB] = useState([]);
  const [lastWeekKcal, setLastWeekKcal] = useState([]);
  const [kcalMean, setKcalMean] = useState(0);

  const getLast7Workouts = async () => {
    const response = await getLast7WorkoutsDB({memNo: memNo})
    setLastWeekDB(response.data)
    //console.log(response.data)
    return response.data
  }

  useEffect(() => {
    getLast7Workouts()
  }, [schedules]);

  useEffect(() => {
    if (lastWeekDB.length === 0) return; // 데이터가 없으면 실행 안 함

    const today = new Date();
    const newDays = [];
    const newTerms = [];
    const newKcal = [];

    // lastWeekDB 데이터를 미리 날짜별로 매핑하여 효율적인 비교
    const lastWeekMap = lastWeekDB.reduce((acc, item) => {
      const scheduleDate = new Date(item.scheduleStart).toLocaleDateString('ko-KR', { weekday: 'short' });
      acc[scheduleDate] = item.kcal; // 날짜를 key로 사용하여 칼로리를 매핑
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
    const averageKcal = activeDays > 0 ? totalKcal / activeDays : 0;

    setLastWeekDays(newDays)
    setLastWeekTerm(newTerms)
    setLastWeekKcal(newKcal) // 칼로리 배열 업데이트
    setKcalMean(averageKcal)
  }, [lastWeekDB]);

  return (
      <>
          <div className="workout-box items-center justify-center border border-gray-300 rounded-3xl p-5 w-full h-144 mt-6 shadow-md">
            <h2 className="text-center text-lg font-bold text-gray-900">일주일 운동량</h2>
            {lastWeekDB.length > 0 ?
                <>
                <div className="text-right text-sm mt-5 mr-5 text-[#323232]">{lastWeekTerm[0]} ~ {lastWeekTerm[1]}</div>
                <div
                    className="text-right text-lg font-bold mr-5 mt-2 text-teal-500">평균 {kcalMean.toFixed(0)} KCAL</div>
            {/*            <div id="activityChartWO" className="h-80"></div>*/}
              <WoChart lastWeekDays={lastWeekDays} lastWeekKcal={lastWeekKcal}/>
                </>
          :
          <p>아직 운동을 하지 않았어요!</p>
          }
      </div>
</>
)
  ;
};

export default WorkoutChartBox;
