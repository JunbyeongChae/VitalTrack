import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';

const WorkoutChart = () => {
  const [lastWeekDays, setLastWeekDays] = useState([]);
  const [lastWeekTerm, setLastWeekTerm] = useState([]);
  const [kcalMean, setKcalMean] = useState(0);

  useEffect(() => {
    const today = new Date();
    const newDays = [];
    const newTerms = [];
    for (let i = 6; i > -1; i--) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      newDays.push(day.toLocaleDateString('ko-KR', { weekday: 'short' }));
      if (i === 6 || i === 0) {
        newTerms.push(day.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }));
      }
    }
    setLastWeekDays(newDays);
    setLastWeekTerm(newTerms);
  }, []);

  useEffect(() => {
    if (lastWeekDays.length === 0) return; // 데이터가 없으면 실행 안 함

    const activityChart = echarts.init(document.getElementById('activityChart'));
    const activityOption = {
      animation: false,
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: lastWeekDays },
      yAxis: { type: 'value' },
      series: [
        {
          name: 'KCAL',
          type: 'bar',
          data: [50, 450, 850, 500, 1200, 650, 1000],
          itemStyle: { color: '#76c3c5' }
        }
      ]
    };
    activityChart.setOption(activityOption);

    setKcalMean(activityOption.series[0].data.reduce((a, b) => a + b, 0) / activityOption.series[0].data.length);
    const handleResize = () => activityChart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      activityChart.dispose(); // 메모리 누수 방지
    };
  }, [lastWeekDays]); // lastWeekDays가 업데이트된 후에 차트 그리기

  return (
      <>
        <div className="workout-box_title flex flex-col items-center justify-center mt-14">
          <div className="workout-box items-center justify-center border border-gray-300 rounded-3xl p-5 w-full h-full">
            <h2 className="text-center text-xl text-gray-900">일주일 운동량</h2>
            <div className="text-right text-sm mt-5 mr-5">{lastWeekTerm[0]} ~ {lastWeekTerm[1]}</div>
            <div className="text-right text-lg mt-2 font-bold mr-5">하루 평균 {kcalMean.toFixed(0)} KCAL</div>
            <div id="activityChart" className="h-80"></div>
          </div>
        </div>
      </>
  );
};

export default WorkoutChart;
