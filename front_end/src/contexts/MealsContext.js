import React, { createContext, useState, useEffect, useCallback } from 'react'; // Add useCallback

export const MealsContext = createContext();

export const MealsProvider = ({ children }) => {
  const [breakfastMeals, setBreakfastMeals] = useState([]);
  const [lunchMeals, setLunchMeals] = useState([]);
  const [dinnerMeals, setDinnerMeals] = useState([]);
  const [snackMeals, setSnackMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const selectedDateString = localStorage.getItem('selectedDate');
  const selectedDate = selectedDateString ? selectedDateString.split(' ')[0] : new Date().toISOString().split('T')[0];

  // Wrap with useCallback
  const loadClientMeals = useCallback(async () => {
    try {
      setIsLoading(true);
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData || !userData.memNo) {
        setIsLoading(false);
        return;
      }

      const { memNo } = userData;
      const token = localStorage.getItem('token');

      const response = await fetch(`${process.env.REACT_APP_SPRING_IP}api/meals/${memNo}?date=${selectedDate}`, {
        headers: {
          Authorization: `Bearer ${token || ''}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch client meals: ${response.statusText}`);
      }

      const mealsResponse = await response.json();

      const breakfast = [];
      const lunch = [];
      const dinner = [];
      const snack = [];

      mealsResponse.forEach(({ mealType, name, calories, memo, recordId, carbs, protein, fat }) => {
        const formattedMeal = {
          id: recordId,
          recordId,
          name,
          calories: Number(calories),
          unit: 'Serving',
          memo: memo || '',
          photo: null,
          carbs: carbs || 0,
          protein: protein || 0,
          fat: fat || 0
        };

        switch (mealType) {
          case 'Breakfast':
            breakfast.push(formattedMeal);
            break;
          case 'Lunch':
            lunch.push(formattedMeal);
            break;
          case 'Dinner':
            dinner.push(formattedMeal);
            break;
          case 'Snack':
            snack.push(formattedMeal);
            break;
          default:
            console.warn(`Unexpected mealType: ${mealType}`);
        }
      });

      setBreakfastMeals(breakfast);
      setLunchMeals(lunch);
      setDinnerMeals(dinner);
      setSnackMeals(snack);
    } catch (err) {
      console.error('Error loading meals:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]); // Include selectedDate as dependency

  useEffect(() => {
    loadClientMeals();
  }, [loadClientMeals]);

  // Immutable methods to modify arrays dynamically
  const addMeal = (mealType, newMeal) => {
    switch (mealType) {
      case 'Breakfast':
        setBreakfastMeals((prev) => [...prev, newMeal]);
        break;
      case 'Lunch':
        setLunchMeals((prev) => [...prev, newMeal]);
        break;
      case 'Dinner':
        setDinnerMeals((prev) => [...prev, newMeal]);
        break;
      case 'Snack':
        setSnackMeals((prev) => [...prev, newMeal]);
        break;
      default:
        console.warn(`Unexpected mealType: ${mealType}`);
    }
  };

  const removeMeal = (mealType, recordIdToRemove) => {
    switch (mealType) {
      case 'Breakfast':
        setBreakfastMeals((prev) => prev.filter((meal) => meal.recordId !== recordIdToRemove));
        break;
      case 'Lunch':
        setLunchMeals((prev) => prev.filter((meal) => meal.recordId !== recordIdToRemove));
        break;
      case 'Dinner':
        setDinnerMeals((prev) => prev.filter((meal) => meal.recordId !== recordIdToRemove));
        break;
      case 'Snack':
        setSnackMeals((prev) => prev.filter((meal) => meal.recordId !== recordIdToRemove));
        break;
      default:
        console.warn(`Unexpected mealType: ${mealType}`);
    }
  };

  // Context value
  return (
    <MealsContext.Provider
      value={{
        breakfastMeals,
        lunchMeals,
        dinnerMeals,
        snackMeals,
        addMeal,
        removeMeal,
        loadClientMeals,
        isLoading,
        error
      }}>
      {children}
    </MealsContext.Provider>
  );
};
