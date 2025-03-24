import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import { Link } from 'react-router';
import { getWeightChanges } from '../services/authLogic';
import AirQuality from "../services/AirQuality";
import AIHealthAnalysis from '../services/AIHealthAnalysis';
import {getScheduleListDB} from "../services/workoutLogic";
import {useScheduleContext} from "./workout/Context";
import WoChart from "./workout/WoChart";

const UserHome = () => {
  const [bmiStatus, setBmiStatus] = useState('')
  const user = JSON.parse(localStorage.getItem('user'))
  const { memNo } = user
  const { schedules, setSchedules, lastWeekData, setLastWeekData, signal } = useScheduleContext()

  // BMI 판정을 계산하는 함수
  const calculateBmiStatus = () => {
    const memBmi = parseFloat(user.memBmi);
    if (memBmi < 18.5) {
      setBmiStatus('저체중 🟡');
    } else if (memBmi < 23) {
      setBmiStatus('정상 🟢');
    } else if (memBmi < 25) {
      setBmiStatus('과체중 🟡');
    } else if (memBmi < 30) {
      setBmiStatus('경도비만 🟠');
    } else if (memBmi < 35) {
      setBmiStatus('중등도비만 🔴');
    } else {
      setBmiStatus('고도비만 ⚠️');
    } 
  };
  //체중변화 차트
  useEffect(() => {
    const fetchWeightData = async () => {
      try {
        const data = await getWeightChanges(user.memNo);
        const dates = data.map(item => item.weightDate);
        const weights = data.map(item => item.weight);

        const weightChart = echarts.init(document.getElementById('weightChart'));
        //const activityChart = echarts.init(document.getElementById('activityChart'));

        const weightOption = {
          animation: false,
          tooltip: { trigger: 'axis' },
          xAxis: { type: 'category', data: dates },
          yAxis: { type: 'value' },
          series: [
            {
              data: weights,
              type: 'line',
              smooth: true,
              lineStyle: { color: '#3B82F6' },
              itemStyle: { color: '#3B82F6' },
            },
          ],
        };

        /*const activityOption = {
          animation: false,
          tooltip: { trigger: 'axis' },
          xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
          yAxis: { type: 'value' },
          series: [
            {
              name: 'Steps',
              type: 'bar',
              data: [8000, 9200, 7800, 8432, 7900, 8700, 8200],
              itemStyle: { color: '#3B82F6' }
            }
          ]
        };*/

        weightChart.setOption(weightOption);
        //activityChart.setOption(activityOption);

        window.addEventListener('resize', () => {
          weightChart.resize();
          //activityChart.resize();
        });
      } catch (error) {
        console.error('체중 데이터 가져오기 실패:', error.message);
      }
    };

    fetchWeightData();
    calculateBmiStatus();
    scheduleList()

    return () => {
      window.removeEventListener('resize', () => {});
    };
  }, []);

  //전체 운동 일정 조회 - DB 경유
  const scheduleList = async () => {
    // /api -> 웹페이지 요청이 아닌 RESTful API 요청임을 명시
    const response = await getScheduleListDB({memNo})
    let schedules = []
    if(response){
      schedules = response.data
    }

    const formattedSchedules = schedules.map((schedule) => {
      // 'T'로 바꿔서 ISO 형식으로 변환
      const formattedStart = schedule.scheduleStart.replace(" ", "T");  // start 날짜 변환
      const formattedEnd = schedule.scheduleEnd.replace(" ", "T");  // end 날짜 변환

      return {
        id: schedule.scheduleId, // 기존 이벤트의 id 그대로 사용
        title: schedule.workoutName,
        start: formattedStart,  // 변환된 start 날짜 사용
        end: formattedEnd,  // 변환된 end 날짜 사용
        color: schedule.color,
        allDay: schedule.allDay,
        extendedProps: {
          isFinished: schedule.isFinished,
          workoutId: schedule.workoutId,
          workoutTimeMin: schedule.workoutTimeMin,
          kcal : schedule.kcal
        }
      }
    })
    setSchedules(formattedSchedules)
  } //end of scheduleList
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
  // 1. 일정 데이터를 불러옴
  useEffect(() => {
    const fetchData = async () => {
      await scheduleList()
    }
    fetchData()
  }, [signal]) // 일정 CRUD 변경 발생시 signal 변경됨 -> 그때마다 스케줄 재랜더링
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
    <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <i className="fas fa-weight text-custom"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">현재 체중</p>
              <h3 className="text-lg font-semibold text-gray-900">{localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).memWeight : 'N/A'} kg</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <i className="fas fa-heartbeat text-green-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">BMI</p>
              <h3 className="text-lg font-semibold text-gray-900">{localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).memBmi : 'N/A'} - {bmiStatus}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <i className="fas fa-fire text-red-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">운동칼로리</p>
              <h3 className="text-lg font-semibold text-gray-900">2,231 kcal</h3>
            </div>
          </div>
        </div>
        <AirQuality />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900">나의 체중변화</h2>
            <div id="weightChart" className="h-80 mt-4"></div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center">
              <h2 className="text-lg font-medium text-gray-900">일주일 운동량</h2>
              <Link to={'/workout'} className="ml-auto text-blue-500 hover:text-blue-700 border p-4">
                운동 관리
              </Link>
            </div>
            {lastWeekData.weekSchedules.length > 0 ?
                <>
           {/* <div id="activityChart" className="h-80 mt-4"></div>*/}
            <WoChart lastWeekDays={lastWeekData.yoils} lastWeekKcal={lastWeekData.kcal}/>
                </>
                :
                <p className="text-center mt-10 text-gray-500">지난주 운동량이 없습니다.</p>
            }
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900">오늘 운동스케쥴</h2>
            <div className="mt-4 space-y-4">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <p className="ml-3 text-sm text-gray-500">달리기 - 7:00 AM</p>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                <p className="ml-3 text-sm text-gray-500">파워요가 - 9:00 AM</p>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <p className="ml-3 text-sm text-gray-500">윗몸일으키기 - 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900">오늘 섭취 칼로리</h2>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Calories</span>
                <span className="text-sm font-medium text-gray-900">
                  {localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).memKcal.toLocaleString() : 'N/A'} / {localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).memKcal.toLocaleString() : 'N/A'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-custom rounded-full h-2" style={{ width: '75%' }}></div>
              </div>
            </div>
            <button className="mt-4 w-full bg-custom text-white !rounded-button py-2 px-4 hover:bg-blue-500 bg-blue-400">
              <i className="fas fa-plus mr-2"></i>식단 기록
            </button>
          </div>
        </div>
        <AIHealthAnalysis user={user} />
      </div>
    </main>
  );
};

export default UserHome;