import React, {useEffect} from 'react'
import * as echarts from "echarts";
import {useScheduleContext} from "./Context";

const WoChart = () => {
  const { lastWeekData } = useScheduleContext()

  useEffect(() => {
    if (lastWeekData.yoils.length === 0) return; // 데이터가 없으면 실행 안 함

    const activityChartWO = echarts.init(document.getElementById('activityChartWO'));
    const activityOption = {
      animation: false,
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: lastWeekData.yoils },
      yAxis: { type: 'value' },
      series: [
        {
          name: 'KCAL',
          type: 'bar',
          data: lastWeekData.kcal,
          itemStyle: { color: '#76c3c5' }
        }
      ]
    };
    activityChartWO.setOption(activityOption)

    const handleResize = () => activityChartWO.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      activityChartWO.dispose(); // 메모리 누수 방지
    };
  }, [lastWeekData])

  return (
      <>
        <div
            className="text-right text-sm mt-5 mr-5 text-[#323232]">{lastWeekData.term[0]} ~ {lastWeekData.term[1]}</div>
        <div
            className="text-right text-lg font-bold mr-5 mt-2 text-teal-500">평균 {lastWeekData.kcalMean.toFixed(0)} kcal
        </div>
        <div id="activityChartWO" className="h-96"></div>
      </>
  )
}

export default WoChart