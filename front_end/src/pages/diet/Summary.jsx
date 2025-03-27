/* 식단관리 페이지 상단 영양성분차트와 물 섭취량 표시 컴포넌트 */

import React, {useContext, useEffect, useRef, useState} from "react";
import * as echarts from "echarts";
import {MealsContext, useMeals} from "../../contexts/MealsContext";
import axios from "axios";
import {format} from "date-fns";

const Summary = () => {
    const {refreshTriggers} = useContext(MealsContext);
    const {breakfastMeals, lunchMeals, dinnerMeals, snackMeals, loadClientMeals} = useContext(MealsContext);
    const calorieChartRef = useRef(null);
    const nutritionChartRef = useRef(null);
    const [meals, setMeals] = useState([]);
    const [waterIntake, setWaterIntake] = useState(0);
    const maxWaterIntake = 8; // Maximum number of water glasses

    const userData = JSON.parse(localStorage.getItem('user')) || {};
    const [selectedDate, setSelectedDate] = useState(
        localStorage.getItem('selectedDate')?.split(' ')[0] || new Date().toISOString().split('T')[0]
    );

    useEffect(() => {
        loadClientMeals();
    }, [refreshTriggers.summary]);


    // localStorage 변경일자 감지
    useEffect(() => {
        const checkDate = () => {
            const currentDate = localStorage.getItem('selectedDate')?.split(' ')[0];
            if (currentDate && currentDate !== selectedDate) {
                setSelectedDate(currentDate);  // 날짜 변경시 리렌더링
            }
        };

        const intervalId = setInterval(checkDate, 500); // checks every 500ms
        return () => clearInterval(intervalId);
    }, [selectedDate]);

    useEffect(() => {
        // 날짜가 변경되면 해당 일자에 따른 식단 표시
        loadClientMeals();
    }, [selectedDate, loadClientMeals]);


    // 회원별 최소 영양성분, 최대 영양성분 계산을 위한 변수 설정
    const memNo = userData.memNo;
    const targetCalories = parseInt(userData.memKcal) || 2000;
    const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const proteinMin = parseInt(userData.proteinMin) || 50;
    const proteinMax = parseInt(userData.proteinMax) || 100;
    const carbsMin = parseInt(userData.carbMin) || 100;
    const carbsMax = parseInt(userData.carbMax) || 150;
    const fatMin = parseInt(userData.fatMin) || 40;
    const fatMax = parseInt(userData.fatMax) || 60;

    // 목표 섭취량 설정
    const targetProtein = proteinMax;
    const targetCarbs = carbsMax;
    const targetFat = fatMax;

    const calculateConsumedCalories = () => {
        // 해당 일자에 등록된 모든 식사데이터로부터 영양성분(g)과 칼로리를 추출
        const breakfastCalories = breakfastMeals.reduce((sum, meal) => sum + meal.calories, 0);
        const lunchCalories = lunchMeals.reduce((sum, meal) => sum + meal.calories, 0);
        const dinnerCalories = dinnerMeals.reduce((sum, meal) => sum + meal.calories, 0);
        const snackCalories = snackMeals.reduce((sum, meal) => sum + meal.calories, 0);

        // 모든 칼로리를 합산
        const totalCalories = breakfastCalories + lunchCalories + dinnerCalories + snackCalories;
        return totalCalories;
    };

    // 본 컴포넌트에 연산된 수치를 전송
    const calculateMacronutrients = () => {
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

        // 모든 영양성분(탄단지) 수치를 계산
        return {
            protein: breakfastMacros.protein + lunchMacros.protein + dinnerMacros.protein + snackMacros.protein,
            carbs: breakfastMacros.carbs + lunchMacros.carbs + dinnerMacros.carbs + snackMacros.carbs,
            fat: breakfastMacros.fat + lunchMacros.fat + dinnerMacros.fat + snackMacros.fat
        };
    };
    // 컨텍스트로부터 가져온 식단데이터
    useEffect(() => {
        console.log("Context data in Summary:", {
            breakfast: breakfastMeals,
            lunch: lunchMeals,
            dinner: dinnerMeals,
            snack: snackMeals
        });
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
                        show: true  // Hide labels on pie sections if you prefer
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

    }, [breakfastMeals, lunchMeals, dinnerMeals, snackMeals, selectedDate, targetCalories]);

    useEffect(() => {
        const renderChart = () => {
            if (!nutritionChartRef.current) return;

            const macros = calculateMacronutrients();

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
                        name: "섭취량",
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
                        name: "최소섭취량",
                        type: "bar",
                        data: [proteinMin, carbsMin, fatMin],
                        barWidth: "20%",
                        itemStyle: {color: "#e0e0e0"},
                    },
                    {
                        name: "목표섭취량",
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

        return () => clearTimeout(timeoutId);

    }, [breakfastMeals, lunchMeals, dinnerMeals, snackMeals, selectedDate]);

    /* 물 섭취량 DB에서 가져오기 */
    useEffect(() => {
        const fetchMealsAndWaterIntake = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_SPRING_IP}api/meals/${memNo}`, {
                    params: {
                        date: selectedDate
                    }
                });

                const meals = response.data;

                setMeals(meals);

                // 식단기록에서 물 섭취량 자료를 추출
                // 식단기록이 없을 경우 기본섭취량을 0으로 설정
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
    }, [selectedDate]);

    // 물 섭취량 추가
    const handleWaterIntakeChange = async (newWaterIntake) => {
        setWaterIntake(newWaterIntake);

        try {
            // 회원정보 가져오기
            const userData = JSON.parse(localStorage.getItem("user"));
            if (!userData || !userData.memNo) {
                console.error("User information not found");
                return;
            }

            // 선택된 날짜를 사용하거나 선택일자가 없을 경우 금일 날짜를 사용
            const selectedDate = localStorage.getItem("selectedDate");
            const formattedDate = selectedDate
                ? format(new Date(selectedDate), 'yyyy-MM-dd')
                : format(new Date(), 'yyyy-MM-dd');

            // 물 섭취량 DB저장 및 불러오기를 위한 변수 설정
            const payload = {
                memNo: userData.memNo,
                dietDate: formattedDate,
                waterIntake: newWaterIntake
            };

            // 물 섭취량 DB 저장 API
            const response = await axios.post(
                `${process.env.REACT_APP_SPRING_IP}api/meals/water-intake`,
                payload
            );

        } catch (error) {
            console.error('물 섭취량 저장에 실패했습니다 :', error);
        }
    };


    // 물 섭취량 증가 버튼
    const increaseWaterIntake = () => {
        if (waterIntake < maxWaterIntake) {
            handleWaterIntakeChange(waterIntake + 1);
        }
    };

    // 물 섭취량 감소 버튼
    const decreaseWaterIntake = () => {
        if (waterIntake > 0) {
            handleWaterIntakeChange(waterIntake - 1);
        }
    };

    // 물 섭취량 리셋 버튼
    const handleResetWater = async () => {
        try {
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