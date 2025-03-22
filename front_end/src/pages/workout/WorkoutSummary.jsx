import React, {useEffect, useState} from 'react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faClock,
    faFlagCheckered,
    faPersonRunning,
} from "@fortawesome/free-solid-svg-icons";
import {getFutureWorkoutDB, getLastWorkoutDB} from "../../services/workoutLogic";
import {useScheduleContext} from "./Context";

const WorkoutSummary = () => {

    const user = JSON.parse(localStorage.getItem('user'));
    const { memNo } = user
    const { schedules } = useScheduleContext()
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }
    const [lastWoDay, setLastWoDay] = useState()
    const [lastWorkout, setLastWorkout] = useState({})
    const [futureWoDay, setFutureWoDay] = useState()
    const [futureWoTime, setFutureWoTime] = useState()
    const [dayDiff, setDayDiff] = useState()
    const [futureWorkout, setFutureWorkout] = useState({})


    useEffect(() => {

        const fetchWorkouts_future = async () => {
            if (futureWorkout.length === 0) return; // 데이터가 없으면 실행 안 함

            const futureData = await getFutureWorkout()

            if (futureData?.scheduleStart) {
                //console.log(futureData.scheduleStart) //2025-03-22 05:00:00
                const futureWoDay = new Date(futureData.scheduleStart).toLocaleDateString(options)
                setFutureWoDay(futureWoDay)

                /*const startTimeFormatted = `${start.getHours() < 10 ? '0' : ''}${start.getHours()}:${start.getMinutes() < 10 ? '0' : ''}${start.getMinutes()}`;
                setFutureWoTime(startTimeFormatted)*/

                if (futureWoDay) { //오늘부터 몇일 남았냐?
                    const todayDate = new Date()
                    const futureDate = new Date(futureWoDay); // futureWoDay를 Date 객체로 변환
                    // 오늘 날짜가 futureWoDay와 같은지 비교
                    if (todayDate.toDateString() === futureDate.toDateString()) {
                        setDayDiff("오늘 곧 시작해요!");
                    } else {
                        const timeDiff = futureDate - todayDate;
                        const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                        setDayDiff(dayDiff+"일 뒤에 시작해요!");
                    }
                }
            }
        }

        const fetchWorkouts_last = async () => {
            if (lastWorkout.length === 0) return; // 데이터가 없으면 실행 안 함

            const lastData = await getLastWorkout()

            if (lastData?.scheduleStart) {
                const lastWoDay = new Date(lastData.scheduleStart).toLocaleDateString(options)
                //setLastWoDay(lastWoDay.toLocaleDateString('ko-KR', options));
                setLastWoDay(lastWoDay)
            }
        }

        fetchWorkouts_future()
        fetchWorkouts_last()
    }, [schedules]) //end of useEffect()

    //앞으로 할 운동
    const getFutureWorkout = async () => {
        const response = await getFutureWorkoutDB({memNo: memNo})
        let futureWorkout = response.data || [];

        setFutureWorkout(futureWorkout);
        return response.data
    }
    //최근 한 운동
    const getLastWorkout = async ()=>{
        const response = await getLastWorkoutDB({memNo: memNo})
        let lastWorkout1 = response.data || [];
        console.log(lastWorkout1)
        setLastWorkout(lastWorkout1);

        return response.data
    }


  return (
      <>
          <div className="workoutSummary flex flex-1 justify-between items-center space-x-6">

              <div className="workout-box_title flex flex-col items-center justify-center flex-1 w-full">

                  <div className="flex text-center items-baseline">
                      <h3 className="text-lg font-bold">최근 운동 </h3>
                      {/*<h3 className="text-sm ml-2"> {lastWoDay}</h3>*/}
                  </div>
                  <div
                      className="workout-box content-center border border-gray-300 rounded-3xl p-5 w-full h-32 shadow-md">
                      {lastWorkout.length>0 ? (
                          <>
                              <div className="flex items-center justify-between ml-16 mr-16">
                                  <div className="flex flex-col items-center justify-center">
                                      <FontAwesomeIcon icon={faPersonRunning} className="text-teal-500 text-5xl"/>
                                      <div className="text-teal-500 font-bold">{lastWorkout.kcal} KCAL</div>
                                  </div>
                                  <div className="flex flex-col items-left justify-start">
                                      <div className="font-bold">{lastWorkout.workoutName}</div>
                                      <div className="text-[#323232]">
                                          {String(Math.floor(lastWorkout.workoutTimeMin / 60)).padStart(2, '0')}:
                                          {String(lastWorkout.workoutTimeMin % 60).padStart(2, '0')}
                                          :00
                                      </div>
                                      <h3 className="text-sm text-gray-400 mt-1"> {lastWoDay}</h3>
                                  </div>
                              </div>
                          </>
                      ) : (
                          <p>아직 운동을 하지 않았어요!</p>
                      )}
                  </div>

              </div>

              <div className="workout-box_title flex flex-col items-center justify-center flex-1 w-full ">

                      <div className="flex text-center items-baseline">
                          <h3 className="text-center text-lg font-bold">예정 운동</h3>
                      </div>
                      <div
                          className="workout-box content-center border border-gray-300 rounded-3xl p-5 w-full h-32 shadow-md ">
                          {futureWorkout.length>0 ? (
                              <>
                                  <div className="flex items-center justify-center space-x-4">
                                      <FontAwesomeIcon icon={faFlagCheckered} className="text-gray-400 mr-4 text-6xl"  />
                                      <div className="flex flex-col items-left justify-center">
                                          <div className="font-bold">{futureWorkout.workoutName}</div>
                                          <div className="text-sm text-[#323232]">{dayDiff}</div>
                                          <div
                                              className="flex flex-row justify-between items-center text-sm text-gray-400 mt-1">
                                              <div>{futureWoDay}</div>
                                              <FontAwesomeIcon icon={faClock}/>
                                          </div>
                                      </div>
                                  </div>
                              </>
                          ) : (
                              <p>운동 계획이 없습니다.</p>
                          )}
                      </div>
              </div>

          </div>
          </>
          )
          }

          export default WorkoutSummary