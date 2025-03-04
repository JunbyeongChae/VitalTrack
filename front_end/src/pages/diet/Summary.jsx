import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

const Summary = () => {
    const calorieChartRef = useRef(null);
    const nutritionChartRef = useRef(null);

    useEffect(() => {
        // Calorie Chart
        if (calorieChartRef.current) {
            const calorieChartInstance = echarts.init(calorieChartRef.current);
            calorieChartInstance.setOption({
/*
                title: { text: "Calories", left: "center" },
*/
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
/*
                title: { text: "Macronutrients", left: "center" },
*/
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

    return (
        <div className="bg-white w-full h-auto p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Today's Summary</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Calorie Chart */}
                <div className="bg-gray-50 p-6 rounded-lg shadow-md flex flex-col items-center">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">Calories</h3>
                    <div ref={calorieChartRef} className="w-full" style={{ height: "150px" }}></div>
                    <p className="text-gray-600 mt-4">
                        <span className="font-semibold text-green-500">350</span> / 1,200 kcal
                    </p>
                </div>

                {/* Macronutrient Chart */}
                <div className="bg-gray-50 p-6 rounded-lg shadow-md flex flex-col items-center">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">Macronutrients</h3>
                    <div ref={nutritionChartRef} className="w-full" style={{ height: "200px" }}></div>
                </div>

                {/* Water Intake Section */}
                <div className="bg-gray-50 p-6 rounded-lg shadow-md flex flex-col items-center">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">Water Intake</h3>
                    <div className="grid grid-cols-4 gap-2 mt-4">
                        {[...Array(8)].map((_, index) => (
                            <div
                                key={index}
                                className={`w-6 h-12 ${
                                    index < 4 ? "bg-blue-400" : "bg-gray-200"
                                } rounded-md`}
                            ></div>
                        ))}
                    </div>
                    <p className="text-gray-600 mt-4">
                        <span className="font-semibold">4</span> / 8 glasses
                    </p>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mt-4">
                        Add Water
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Summary;