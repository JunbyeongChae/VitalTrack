import React, {useEffect} from 'react'
import * as echarts from "echarts";

const WoChart = (props) => {
  const { lastWeekDays, lastWeekKcal } = props

  useEffect(() => {
    if (lastWeekDays.length === 0) return; // 데이터가 없으면 실행 안 함

    const activityChartWO = echarts.init(document.getElementById('activityChartWO'));
    const activityOption = {
      animation: false,
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: lastWeekDays },
      yAxis: { type: 'value' },
      series: [
        {
          name: 'KCAL',
          type: 'bar',
          data: lastWeekKcal,
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
  }, [lastWeekDays]); // lastWeekDays가 업데이트된 후에 차트 그리기

  return (
      <>
        <div id="activityChartWO" className="h-96"></div>
      </>
  )
}

export default WoChart