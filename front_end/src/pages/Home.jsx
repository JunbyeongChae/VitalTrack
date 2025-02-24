import React, { useEffect } from 'react';
import * as echarts from 'echarts';

const Home = () => {
  useEffect(() => {
    const weightChart = echarts.init(document.getElementById('weightChart'));
    const activityChart = echarts.init(document.getElementById('activityChart'));

    const weightOption = {
      animation: false,
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
      yAxis: { type: 'value' },
      series: [
        {
          data: [75.2, 75.4, 75.1, 75.5, 75.3, 75.6, 75.5],
          type: 'line',
          smooth: true,
          lineStyle: { color: '#3B82F6' },
          itemStyle: { color: '#3B82F6' }
        }
      ]
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

    return () => {
      window.removeEventListener('resize', () => {
        weightChart.resize();
        activityChart.resize();
      });
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
              <p className="text-sm font-medium text-gray-500">Current Weight</p>
              <h3 className="text-lg font-semibold text-gray-900">75.5 kg</h3>
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
              <h3 className="text-lg font-semibold text-gray-900">22.4</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100">
              <i className="fas fa-shoe-prints text-indigo-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Daily Steps</p>
              <h3 className="text-lg font-semibold text-gray-900">8,432</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <i className="fas fa-fire text-red-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Calories</p>
              <h3 className="text-lg font-semibold text-gray-900">1,850 kcal</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900">Weight Trend</h2>
            <div id="weightChart" className="h-80 mt-4"></div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900">Activity Overview</h2>
            <div id="activityChart" className="h-80 mt-4"></div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900">Today's Schedule</h2>
            <div className="mt-4 space-y-4">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-custom"></div>
                <p className="ml-3 text-sm text-gray-500">Morning Run - 7:00 AM</p>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                <p className="ml-3 text-sm text-gray-500">Vitamin Supplement - 9:00 AM</p>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <p className="ml-3 text-sm text-gray-500">Gym Workout - 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900">Meal Tracking</h2>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Calories</span>
                <span className="text-sm font-medium text-gray-900">1,850 / 2,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-custom rounded-full h-2" style={{ width: '75%' }}></div>
              </div>
            </div>
            <button className="mt-4 w-full bg-custom text-white !rounded-button py-2 px-4 hover:bg-blue-600">
              <i className="fas fa-plus mr-2"></i>Log Meal
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900">Medication Reminders</h2>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <i className="fas fa-pills text-custom mr-3"></i>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Vitamin D</p>
                    <p className="text-xs text-gray-500">1 pill - Morning</p>
                  </div>
                </div>
                <button className="text-custom hover:text-blue-600">
                  <i className="fas fa-check-circle text-lg"></i>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <i className="fas fa-pills text-custom mr-3"></i>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Omega-3</p>
                    <p className="text-xs text-gray-500">2 pills - Evening</p>
                  </div>
                </div>
                <button className="text-custom hover:text-blue-600">
                  <i className="fas fa-check-circle text-lg"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
