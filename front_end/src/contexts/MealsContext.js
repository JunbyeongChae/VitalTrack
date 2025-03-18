import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
export const MealsContext = createContext();

// Custom hook to use the meals context
export const useMeals = () => useContext(MealsContext);

export const MealsProvider = ({ children }) => {
    // Initialize meal states
    const [breakfastMeals, setBreakfastMeals] = useState([]);
    const [lunchMeals, setLunchMeals] = useState([]);
    const [dinnerMeals, setDinnerMeals] = useState([]);
    const [snackMeals, setSnackMeals] = useState([]);

    // Target calorie goal - could be from user profile/settings
    const [targetCalories, setTargetCalories] = useState(1200);

    // Calculate consumed calories
    const calculateConsumedCalories = () => {
        const allMeals = [...breakfastMeals, ...lunchMeals, ...dinnerMeals, ...snackMeals];
        return allMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
    };

    // Calculate macronutrients
    const calculateMacros = () => {
        const allMeals = [...breakfastMeals, ...lunchMeals, ...dinnerMeals, ...snackMeals];
        return {
            protein: allMeals.reduce((sum, meal) => sum + (meal.protein || 0), 0),
            carbs: allMeals.reduce((sum, meal) => sum + (meal.carbs || 0), 0),
            fat: allMeals.reduce((sum, meal) => sum + (meal.fat || 0), 0)
        };
    };

    return (
        <MealsContext.Provider value={{
            breakfastMeals,
            lunchMeals,
            dinnerMeals,
            snackMeals,
            targetCalories,
            setTargetCalories,
            calculateConsumedCalories,
            calculateMacros
        }}>
            {children}
        </MealsContext.Provider>
    );
};