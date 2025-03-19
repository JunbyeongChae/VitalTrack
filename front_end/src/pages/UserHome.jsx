import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import { Link } from 'react-router';
import { getWeightChanges } from '../services/authLogic';

const UserHome = () => {
  const [bmiStatus, setBmiStatus] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

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

  useEffect(() => {
    const fetchWeightData = async () => {
    try {
      const data = await getWeightChanges(user.memNo);
      const dates = data.map(item => item.weightDate);
      const weights = data.map(item => item.weight);

      const weightChart = echarts.init(document.getElementById('weightChart'));
      const activityChart = echarts.init(document.getElementById('activityChart'));

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

    const activityOption = {
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
    };

    weightChart.setOption(weightOption);
    activityChart.setOption(activityOption);

    window.addEventListener('resize', () => {
      weightChart.resize();
      activityChart.resize();
    });
  } catch (error) {
    console.error('체중 데이터 가져오기 실패:', error.message);
  }
};

    fetchWeightData();
    calculateBmiStatus();

    return () => {
      window.removeEventListener('resize', () => {});
    };
  }, []);

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
              <h2 className="text-lg font-medium text-gray-900">활동량</h2>
              <Link to={'/workout'} className="ml-auto text-blue-500 hover:text-blue-700 border p-4">
                운동 관리
              </Link>
            </div>
            <div id="activityChart" className="h-80 mt-4"></div>
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
                <p className="ml-3 text-sm text-gray-500">달리기기 - 7:00 AM</p>
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
      </div>
    </main>
  );
};

export default UserHome;