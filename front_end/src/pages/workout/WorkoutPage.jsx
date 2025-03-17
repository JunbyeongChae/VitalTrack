import React, {useEffect, useState} from 'react'
import WorkoutCalendar from "./workout_calendar/WorkoutCalendar";
import WorkoutChart from "./WorkoutChart";
import WorkoutSummary from "./WorkoutSummary";
import {ScheduleProvider} from "./workout_calendar/Context";

const WorkoutPage = () => {

    //일자별 운동칼로리 - 막대 그래프 -> WorkoutChart.jsx
  //달력 - 계획 입력, 클릭-모달로 상세보기or하단에 상세보기, 체크 기능 -> WorkoutCalendar.jsx
  //오늘 한 운동 - 운동명 및 칼로리
  //최근 한 운동 - 운동명 및 칼로리
    return (
        <div className="flex">
            <div className="workout-calendar w-3/5 p-5 box-border ml-5">
                <ScheduleProvider>
                <WorkoutCalendar/>
                </ScheduleProvider>
            </div>
            <div className="w-2/5 h-[90%] p-5 mr-5">
                <WorkoutSummary/>
                <WorkoutChart />
            </div>
        </div>
    )
}

export default WorkoutPage