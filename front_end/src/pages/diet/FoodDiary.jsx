import React, { useContext } from "react";
import { MealsContext } from "../../contexts/MealsContext";

const DiaryEntry = ({ title, time, calories, protein, carbs, fat }) => {
    return (
        <div className="flex justify-between items-center p-4">
            {/* Left Section: Food details */}
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div>
                    <div className="text-sm font-semibold">{title}</div>
                    <div className="text-xs text-gray-500">{time}</div>
                </div>
            </div>

            {/* Right Section: Nutrition details */}
            <div className="flex flex-col items-end">
                <div className="text-sm font-semibold">{calories} kcal</div>
                <div className="flex text-xs text-gray-500 gap-3">
                    <span>carb: {carbs}g</span>
                    <span>pro: {protein}g</span>
                    <span>fat: {fat}g</span>
                </div>
            </div>
        </div>
    );
};

const FoodDiary = () => {
    // Access meal data from context
    const { breakfastMeals, lunchMeals, dinnerMeals, snackMeals } = useContext(MealsContext);

    // Format meal data for display
    const formatMealTime = (mealType) => {
        switch(mealType) {
            case 'breakfast': return 'Breakfast';
            case 'lunch': return 'Lunch';
            case 'dinner': return 'Dinner';
            case 'snack': return 'Snack';
            default: return '';
        }
    };

    // Create diary entries from all meal data
    const diaryEntries = [
        ...breakfastMeals.map(meal => ({
            title: meal.name,
            time: `${meal.time || '8:00 AM'} - ${formatMealTime('breakfast')}`,
            calories: meal.calories || 0,
            protein: meal.protein || 0,
            carbs: meal.carbs || 0,
            fat: meal.fat || 0
        })),
        ...lunchMeals.map(meal => ({
            title: meal.name,
            time: `${meal.time || '12:30 PM'} - ${formatMealTime('lunch')}`,
            calories: meal.calories || 0,
            protein: meal.protein || 0,
            carbs: meal.carbs || 0,
            fat: meal.fat || 0
        })),
        ...dinnerMeals.map(meal => ({
            title: meal.name,
            time: `${meal.time || '6:30 PM'} - ${formatMealTime('dinner')}`,
            calories: meal.calories || 0,
            protein: meal.protein || 0,
            carbs: meal.carbs || 0,
            fat: meal.fat || 0
        })),
        ...snackMeals.map(meal => ({
            title: meal.name,
            time: `${meal.time || '3:00 PM'} - ${formatMealTime('snack')}`,
            calories: meal.calories || 0,
            protein: meal.protein || 0,
            carbs: meal.carbs || 0,
            fat: meal.fat || 0
        }))
    ];

    // Sort entries by time if needed
    // diaryEntries.sort((a, b) => { /* add sorting logic */ });

    return (
        <div className="bg-white p-6 rounded-xl shadow-md w-full flex flex-col gap-4 h-auto">
            {/* Title */}
            <h2 className="text-lg font-semibold">식단 기록</h2>

            {/* Diary Entry List */}
            <div className="flex flex-col divide-y divide-gray-200">
                {diaryEntries.length > 0 ? (
                    diaryEntries.map((entry, index) => (
                        <DiaryEntry
                            key={index}
                            title={entry.title}
                            time={entry.time}
                            calories={entry.calories}
                            protein={entry.protein}
                            carbs={entry.carbs}
                            fat={entry.fat}
                        />
                    ))
                ) : (
                    <div className="p-4 text-center text-gray-500">No meals recorded for today</div>
                )}
            </div>
        </div>
    );
};

export default FoodDiary;