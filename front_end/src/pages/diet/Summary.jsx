import React, {useContext, useEffect, useRef, useState} from "react";
import * as echarts from "echarts";
import {MealsContext, useMeals} from "../../contexts/MealsContext";
import axios from "axios";
import {format} from "date-fns";

const Summary = () => {
    const {breakfastMeals, lunchMeals, dinnerMeals, snackMeals, loadClientMeals} = useContext(MealsContext);
    const calorieChartRef = useRef(null);
    const nutritionChartRef = useRef(null);
    const [meals, setMeals] = useState([]);
    const [waterIntake, setWaterIntake] = useState(0); // State to track water intake
    const maxWaterIntake = 8; // Maximum number of water glasses
    const [summaryData, setSummaryData] = useState({});
    const { refreshCounter } = useMeals();

    const userData = JSON.parse(localStorage.getItem('user')) || {};
    const [selectedDate, setSelectedDate] = useState(
        localStorage.getItem('selectedDate')?.split(' ')[0] || new Date().toISOString().split('T')[0]
    );

    // This effect listens for changes to localStorage date
    useEffect(() => {
        const checkDate = () => {
            const currentDate = localStorage.getItem('selectedDate')?.split(' ')[0];
            if (currentDate && currentDate !== selectedDate) {
                setSelectedDate(currentDate);  // triggers re-render upon date change
            }
        };

        const intervalId = setInterval(checkDate, 500); // checks every 500ms
        return () => clearInterval(intervalId);
    }, [selectedDate]);

    useEffect(() => {
        // When selected date changes, explicitly refresh meals as well
        loadClientMeals();
    }, [selectedDate, loadClientMeals]);


    const memNo = userData.memNo;
    const targetCalories = parseInt(userData.memKcal) || 2000;
    const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    // Extract minimum and maximum protein, carbs, and fat values
    const proteinMin = parseInt(userData.proteinMin) || 50;
    const proteinMax = parseInt(userData.proteinMax) || 100;
    const carbsMin = parseInt(userData.carbMin) || 100;
    const carbsMax = parseInt(userData.carbMax) || 150;
    const fatMin = parseInt(userData.fatMin) || 40;
    const fatMax = parseInt(userData.fatMax) || 60;

// Define target values (you can use max values or average of min/max)
    const targetProtein = proteinMax;
    const targetCarbs = carbsMax;
    const targetFat = fatMax;

    const calculateConsumedCalories = () => {
        // Calculate total calories from all meal categories
        const breakfastCalories = breakfastMeals.reduce((sum, meal) => sum + meal.calories, 0);
        const lunchCalories = lunchMeals.reduce((sum, meal) => sum + meal.calories, 0);
        const dinnerCalories = dinnerMeals.reduce((sum, meal) => sum + meal.calories, 0);
        const snackCalories = snackMeals.reduce((sum, meal) => sum + meal.calories, 0);

        // Sum all calories together
        const totalCalories = breakfastCalories + lunchCalories + dinnerCalories + snackCalories;
        return totalCalories;
    };

    // Add this function to your Summary component
    const calculateMacronutrients = () => {
        // Calculate total macros from all meal categories
        const calculateMealMacros = (meals) => {
            return meals.reduce((total, meal) => {
                return {
                    protein: total.protein + (meal.protein || 0),
                    carbs: total.carbs + (meal.carbs || 0),
                    fat: total.fat + (meal.fat || 0)
                };
            }, {protein: 0, carbs: 0, fat: 0});
        };
        const breakfastMacros = calculateMealMacros(breakfastMeals);
        const lunchMacros = calculateMealMacros(lunchMeals);
        const dinnerMacros = calculateMealMacros(dinnerMeals);
        const snackMacros = calculateMealMacros(snackMeals);

        // Sum up all macros
        return {
            protein: breakfastMacros.protein + lunchMacros.protein + dinnerMacros.protein + snackMacros.protein,
            carbs: breakfastMacros.carbs + lunchMacros.carbs + dinnerMacros.carbs + snackMacros.carbs,
            fat: breakfastMacros.fat + lunchMacros.fat + dinnerMacros.fat + snackMacros.fat
        };
    };
    // Add this to your Summary component to check what's actually in your context
    useEffect(() => {
        console.log("Context data in Summary:", {
            breakfast: breakfastMeals,
            lunch: lunchMeals,
            dinner: dinnerMeals,
            snack: snackMeals
        });
        console.log("Calculated calories:", calculateConsumedCalories());
    }, [breakfastMeals, lunchMeals, dinnerMeals, snackMeals]);

    const consumedCalories = calculateConsumedCalories();
    const remainingCalories = targetCalories - consumedCalories;

    useEffect(() => {
        if (!calorieChartRef.current) return;
        const remainingCalories = Math.max(targetCalories - consumedCalories, 0);
        console.log('Rendering calorie chart using values:', {consumedCalories, remainingCalories});
        let calorieChart = echarts.getInstanceByDom(calorieChartRef.current);
        // If no chart instance, initialize one. Else, reuse it.
        if (!calorieChart) {
            calorieChart = echarts.init(calorieChartRef.current);
        }

        calorieChart.setOption({
            animation: true, // <--- Restore animation explicitly
            animationDuration: 800, // optional, customize animation duration
            animationDurationUpdate: 800, // important: triggers animation on every option update
            animationEasing: 'cubicOut', // optional easing style
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} kcal ({d}%)'
            },
            series: [
                {
                    name: "Daily Calories",
                    type: "pie",
                    radius: ["50%", "70%"],
                    data: [
                        {value: consumedCalories, name: "Consumed", itemStyle: {color: "#4caf50"}},
                        {
                            value: remainingCalories > 0 ? remainingCalories : 0,
                            name: "Remaining",
                            itemStyle: {color: "#e0e0e0"}
                        },
                    ],
                    label: {
                        show: false  // Hide labels on pie sections if you prefer
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                },
            ],
        }, true); // `true` forces ECharts to replace the previous option entirely.

        // Optional: Re-resize on window resize as you're already handling this scenario
        window.addEventListener('resize', calorieChart.resize);

        // Cleanup listener on component unmount
        return () => {
            window.removeEventListener('resize', calorieChart.resize);
        };

    }, [breakfastMeals, lunchMeals, dinnerMeals, snackMeals, selectedDate, targetCalories, refreshCounter]);

    useEffect(() => {
        // explicitly define render function clearly (nested correctly)
        const renderChart = () => {
            if (!nutritionChartRef.current) return;

            const macros = calculateMacronutrients();

            // safely obtain current instance
            let nutritionChartInstance = echarts.getInstanceByDom(nutritionChartRef.current);
            if (nutritionChartInstance) {
            }

            nutritionChartInstance = echarts.init(nutritionChartRef.current);

            nutritionChartInstance.setOption({
                tooltip: {trigger: "axis", axisPointer: {type: "shadow"}},
                xAxis: {type: "value", axisLabel: {formatter: "{value} g"}},
                yAxis: {type: "category", data: ["Protein", "Carbs", "Fat"]},
                series: [
                    {
                        name: "Consumed",
                        type: "bar",
                        data: [
                            macros.protein.toFixed(1),
                            macros.carbs.toFixed(1),
                            macros.fat.toFixed(1),
                        ],
                        barWidth: "20%",
                        itemStyle: {color: "#4caf50"},
                    },
                    {
                        name: "Mininum",
                        type: "bar",
                        data: [proteinMin, carbsMin, fatMin],
                        barWidth: "20%",
                        itemStyle: {color: "#e0e0e0"},
                    },
                    {
                        name: "Target",
                        type: "bar",
                        data: [proteinMax, carbsMax, fatMax],
                        barWidth: "20%",
                        itemStyle: {color: "#90f731"},
                    },
                ],
                legend: {top: "0%"},
                grid: {
                    left: '5%',
                    right: '5%',
                    bottom: '10%',
                    top: '20%',
                    containLabel: true,
                    height: '70%'
                },
            }, {notMerge: true});

            const handleResize = () => nutritionChartInstance.resize();
            window.addEventListener("resize", handleResize);

            return () => {
                window.removeEventListener("resize", handleResize);
                nutritionChartInstance.dispose();
            };
        };

        const timeoutId = setTimeout(renderChart, 0);

        // cleanup timeout explicitly
        return () => clearTimeout(timeoutId);

    }, [breakfastMeals, lunchMeals, dinnerMeals, snackMeals, selectedDate, refreshCounter]);

    useEffect(() => {
        const fetchMealsAndWaterIntake = async () => {
            try {
                const response = await axios.get(`/api/meals/${memNo}`, {
                    params: {
                        date: selectedDate
                    }
                });

                const meals = response.data;

                // Set meals data
                setMeals(meals);

                // Extract water intake from the first meal record
                // If there are no meals, default to 0
                if (meals && meals.length > 0 && meals[0].waterIntake !== null) {
                    setWaterIntake(meals[0].waterIntake);
                } else {
                    setWaterIntake(0);
                }

            } catch (error) {
                console.error("Error fetching meals and water intake:", error);
            }
        };
        fetchMealsAndWaterIntake();
    }, [selectedDate, refreshCounter]);

    // Handle water intake changes
    const handleWaterIntakeChange = async (newWaterIntake) => {
            setWaterIntake(newWaterIntake);

            try {
                // Get user data
                const userData = JSON.parse(localStorage.getItem("user"));
                if (!userData || !userData.memNo) {
                    console.error("User information not found");
                    return;
                }

                // Get selected date or use current date
                const selectedDate = localStorage.getItem("selectedDate");
                const formattedDate = selectedDate
                    ? format(new Date(selectedDate), 'yyyy-MM-dd')
                    : format(new Date(), 'yyyy-MM-dd');

                // Prepare payload for API
                const payload = {
                    memNo: userData.memNo,
                    dietDate: formattedDate,
                    waterIntake: newWaterIntake
                };

                // Make API call to update water intake in the database
                const response = await axios.post(
                    'http://localhost:8000/api/meals/water-intake',
                    payload
                );

                console.log('Water intake updated successfully:', response.data);

            } catch (error) {
                console.error('Error saving water intake:', error);
                // Optionally revert the UI if the update fails
                // setWaterIntake(previousValue);
            }
        };


    // Water intake increase handler
    const increaseWaterIntake = () => {
        if (waterIntake < maxWaterIntake) {
            handleWaterIntakeChange(waterIntake + 1);
        }
    };

    // Water intake decrease handler
    const decreaseWaterIntake = () => {
        if (waterIntake > 0) {
            handleWaterIntakeChange(waterIntake - 1);
        }
    };

    // Function to handle water intake reset
    const handleResetWater = async () => {
        try {
            // Call the same handler with 0
            await handleWaterIntakeChange(0);
        } catch (error) {
            console.error('Error resetting water intake:', error);
        }
    };


    return (
        <div className="bg-white w-full h-auto p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">일일섭취량</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Calorie Chart */}
                <div className="bg-gray-50 p-6 rounded-lg shadow-md flex flex-col items-center">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">칼로리</h3>
                    <div ref={calorieChartRef} className="w-full" style={{height: "150px"}}></div>
                    <p className="text-gray-600 mt-4">
                        <span
                            className="font-semibold text-green-500">{consumedCalories}</span> / {targetCalories} kcal
                    </p>
                </div>

                {/* Macronutrient Chart */}
                <div className="bg-gray-50 p-6 rounded-lg shadow-md flex flex-col items-center">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">탄단지</h3>
                    <div ref={nutritionChartRef} className="w-full" style={{height: "200px"}}></div>
                </div>

                {/* Water Intake Section */}
                <div className="bg-gray-50 p-6 rounded-lg shadow-md flex flex-col items-center">
                    <h3 className="text-lg font-bold text-gray-700 mb-1">수분섭취량</h3>
                    <p className="text-gray-600 mt-1">{waterIntake} / {maxWaterIntake}</p>
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
                            onClick={increaseWaterIntake}
                        >
                            +
                        </button>
                        <button
                            className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg"
                            onClick={decreaseWaterIntake}
                        >
                            -
                        </button>
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                            onClick={handleResetWater}
                        >
                            초기화
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Summary;