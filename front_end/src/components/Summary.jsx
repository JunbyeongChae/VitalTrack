import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

const Summary = () => {
    // Ref 생성
    const calorieChartRef = useRef(null);
    const nutritionChartRef = useRef(null);
    const waterChartRef = useRef(null);

    // ECharts 인스턴스 저장
    let calorieChartInstance = null;
    let nutritionChartInstance = null;
    let waterChartInstance = null;

    // 차트 초기화 및 옵션 설정
    useEffect(() => {
        // 칼로리 차트
        if (calorieChartRef.current) {
            calorieChartInstance = echarts.init(calorieChartRef.current);
            calorieChartInstance.setOption({
                title: {
                    text: '칼로리',
                    left: 'center',
                },
                series: [
                    {
                        name: '칼로리',
                        type: 'pie',
                        radius: ['50%', '70%'],
                        data: [
                            { value: 350, name: 'Consumed', itemStyle: { color: '#4caf50' } },
                            { value: 850, name: 'Remaining', itemStyle: { color: '#e0e0e0' } },
                        ],
                    },
                ],
            });
        }

        // 영양섭취량 차트
        if (nutritionChartRef.current) {
            nutritionChartInstance = echarts.init(nutritionChartRef.current);
            nutritionChartInstance.setOption({
                title: {
                    text: '영양섭취량',
                    left: 'center',
                },
                tooltip: {
                    trigger: 'axis',
                },
                xAxis: {
                    type: 'category',
                    data: ['Protein', 'Carbs', 'Fat'],
                },
                yAxis: {
                    type: 'value',
                },
                series: [
                    {
                        name: 'Consumed',
                        type: 'bar',
                        data: [25, 45, 15],
                        itemStyle: { color: '#4caf50' },
                    },
                    {
                        name: 'Target',
                        type: 'bar',
                        data: [90, 150, 40],
                        itemStyle: { color: '#e0e0e0' },
                    },
                ],
            });
        }

// 물 섭취량 차트
        if (waterChartRef.current) {
            const waterChart = echarts.init(waterChartRef.current);
            waterChart.setOption({
                title: {
                    text: '물 섭취량',
                    left: 'center',
                    textStyle: {
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: '#333',
                    },
                },
                series: [
                    {
                        type: 'gauge',
                        startAngle: 180,
                        endAngle: 0,
                        min: 0,
                        max: 8,
                        splitNumber: 8,
                        axisLine: {
                            lineStyle: {
                                width: 20,
                                color: [[0.5, '#4caf50'], [1, '#e0e0e0']], // Progress colors
                            },
                        },
                        axisLabel: {
                            distance: 25, // Adjust distance of labels
                            textStyle: {
                                fontSize: 12,
                                color: '#777',
                            },
                        },
                        pointer: {
                            show: true,
                            length: '60%',
                            width: 6,
                        },
                        detail: {
                            valueAnimation: true,
                            fontSize: 16,
                            color: '#333',
                            formatter: '{value} glasses',
                        },
                        data: [{ value: 4 }], // 현재 값
                    },
                ],
            });

            // div 크기 동기화 (resize 호출)
            const resizeChart = () => {
                waterChart.resize();
            };

            // 초기에 한 번 강제로 크기 동기화
            resizeChart();

            // 창 크기 변경 이벤트 추가
            window.addEventListener("resize", resizeChart);

            return () => {
                window.removeEventListener("resize", resizeChart);
            };
        }
    }, []);


    return (
        <div className="bg-white p-10 rounded-xl shadow-md">
            <h2 className="text-lg font-bold">Today's Summary</h2>

            <div className="flex justify-between items-start gap-6 mt-6">
                {/* 칼로리 */}
                <div className="w-1/3 text-center">
                    <div ref={calorieChartRef} style={{ width: "100%", height: "200px" }}></div>
                </div>

                {/* 영양섭취량 */}
                <div className="w-1/3 text-center">
                    <div ref={nutritionChartRef} style={{ width: "100%", height: "200px" }}></div>
                </div>

                {/* 물 섭취량 */}
                <div className="w-1/3 text-center">
                    <div ref={waterChartRef} style={{ width: "100%", height: "200px" }}></div>
                </div>
            </div>
        </div>
    );
};

export default Summary;