import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import WaterIntake from "./WaterIntake"; // Import the updated WaterIntake component

const Summary = () => {
    // Refs for the charts
    const calorieChartRef = useRef(null);
    const nutritionChartRef = useRef(null);

    useEffect(() => {
        // Calorie Chart
        if (calorieChartRef.current) {
            const calorieChartInstance = echarts.init(calorieChartRef.current);
            calorieChartInstance.setOption({
                title: {
                    text: "칼로리",
                    left: "center",
                },
                series: [
                    {
                        name: "칼로리",
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

        // Nutrition Chart
        if (nutritionChartRef.current) {
            const nutritionChartInstance = echarts.init(nutritionChartRef.current);
            nutritionChartInstance.setOption({
                title: {
                    text: "영양섭취량",
                    left: "center",
                },
                tooltip: {
                    trigger: "axis",
                },
                xAxis: {
                    type: "category",
                    data: ["Protein", "Carbs", "Fat"],
                },
                yAxis: {
                    type: "value",
                },
                series: [
                    {
                        name: "Consumed",
                        type: "bar",
                        data: [25, 45, 15],
                        itemStyle: { color: "#4caf50" },
                    },
                    {
                        name: "Target",
                        type: "bar",
                        data: [90, 150, 40],
                        itemStyle: { color: "#e0e0e0" },
                    },
                ],
            });
        }

        return () => {
            // Cleanup logic (if needed for charts)
        };
    }, []);

    return (
        <div className="bg-white p-10 rounded-xl shadow-md">
            <h2 className="text-lg font-bold">Today's Summary</h2>

            <div className="flex justify-between items-start gap-6 mt-6">
                {/* Calorie Chart */}
                <div className="w-1/3 text-center">
                    <div ref={calorieChartRef} style={{ width: "100%", height: "200px" }}></div>
                </div>

                {/* Nutrition Chart */}
                <div className="w-1/3 text-center">
                    <div ref={nutritionChartRef} style={{ width: "100%", height: "200px" }}></div>
                </div>

                {/* Updated Water Intake Counter */}
                <div className="w-1/3 text-center">
                    <WaterIntake />
                </div>
            </div>
        </div>
    );
};

export default Summary;