import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";

const WaterIntake = () => {
    const [waterCount, setWaterCount] = useState(0); // Track the number of glasses of water

    const addWater = () => {
        setWaterCount(waterCount + 1); // Increment the counter
    };

    return (
        <div className="water-tracker">
            <h2 className="text-xl font-semibold mb-4">Water Intake</h2>
            <div className="water-counter">
                <p className="text-lg mb-4">
                    Glasses of Water: <span className="font-bold">{waterCount}</span>
                </p>
            </div>
            <button
                className="add-water-button px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
                onClick={addWater}
            >
                + Add Water
            </button>
        </div>
    );
};

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

                {/* Water Intake Counter */}
                <div className="w-1/3 text-center">
                    <WaterIntake />
                </div>
            </div>
        </div>
    );
};

export default Summary;