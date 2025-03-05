import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";

const Summary = () => {
    const calorieChartRef = useRef(null);
    const nutritionChartRef = useRef(null);
    const [waterIntake, setWaterIntake] = useState(0); // State to track water intake
    const maxWaterIntake = 8; // Maximum number of water glasses

    useEffect(() => {
        // Calorie Chart
        if (calorieChartRef.current) {
            const calorieChartInstance = echarts.init(calorieChartRef.current);
            calorieChartInstance.setOption({
                series: [
                    {
                        name: "Calories",
                        type: "pie",
                        radius: ["50%", "70%"],
                        data: [
                            { value: 350, name: "Consumed", itemStyle: { color: "#4caf50" } },
                            { value: 850, name: "Remaining", itemStyle: { color: "#e0e0e0" } },
                        ],
                    },
                ],
            });
        }

        // Macronutrient Chart (Horizontal Bar Graph)
        if (nutritionChartRef.current) {
            const nutritionChartInstance = echarts.init(nutritionChartRef.current);
            nutritionChartInstance.setOption({
                tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
                xAxis: { type: "value", axisLabel: { formatter: "{value} g" } },
                yAxis: { type: "category", data: ["Protein", "Carbs", "Fat"] },
                series: [
                    {
                        name: "Consumed",
                        type: "bar",
                        data: [25, 45, 15],
                        barWidth: "40%",
                        itemStyle: { color: "#4caf50" },
                    },
                    {
                        name: "Target",
                        type: "bar",
                        data: [90, 150, 40],
                        barWidth: "40%",
                        itemStyle: { color: "#e0e0e0" },
                    },
                ],
                legend: { top: "10%" },
            });
        }

        return () => {
            if (calorieChartRef.current) echarts.dispose(calorieChartRef.current);
            if (nutritionChartRef.current) echarts.dispose(nutritionChartRef.current);
        };
    }, []);

    // Function to handle water intake increment
    const handleAddWater = () => {
        if (waterIntake < maxWaterIntake) {
            setWaterIntake(waterIntake + 1);
        } else {
            alert("오늘의 물 섭취량을 모두 채웠습니다!");
        }
    };

    // Function to handle water intake reset
    const handleResetWater = () => {
        setWaterIntake(0);
    };

    return (
        <div className="bg-white w-full h-auto p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">일일섭취량</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Calorie Chart */}
                <div className="bg-gray-50 p-6 rounded-lg shadow-md flex flex-col items-center">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">칼로리</h3>
                    <div ref={calorieChartRef} className="w-full" style={{ height: "150px" }}></div>
                    <p className="text-gray-600 mt-4">
                        <span className="font-semibold text-green-500">350</span> / 1,200 kcal
                    </p>
                </div>

                {/* Macronutrient Chart */}
                <div className="bg-gray-50 p-6 rounded-lg shadow-md flex flex-col items-center">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">탄단지</h3>
                    <div ref={nutritionChartRef} className="w-full" style={{ height: "200px" }}></div>
                </div>

                {/* Water Intake Section */}
                <div className="bg-gray-50 p-6 rounded-lg shadow-md flex flex-col items-center">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">수분섭취량</h3>
                    <div className="grid grid-cols-4 gap-2 mt-4">
                        {[...Array(maxWaterIntake)].map((_, index) => (
                            <div
                                key={index}
                                className={`w-6 h-12 ${
                                    index < waterIntake ? "bg-blue-500" : "bg-gray-300"
                                } rounded-lg`}
                            />
                        ))}
                    </div>

                    {/* Buttons Section */}
                    <div className="flex mt-4 space-x-2">
                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                            onClick={handleAddWater}
                        >
                            물 추가
                        </button>

                        <button
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                            onClick={handleResetWater}
                        >
                            초기화
                        </button>
                    </div>

                    <p className="text-gray-600 mt-4">{waterIntake} / {maxWaterIntake}</p>
                </div>
            </div>
        </div>
    );
};

export default Summary;