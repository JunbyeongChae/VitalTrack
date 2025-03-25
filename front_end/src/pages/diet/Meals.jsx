import React, { useState, useEffect, useContext } from "react";
import MealSection from "./MealSection";
import AddMealModal from "./AddMealModal";
import { format } from 'date-fns';
import axios from "axios";
import { MealsContext } from '../../contexts/MealsContext';

const Meals = () => {
    const [foods, setFoods] = useState([]); // State for food data
    const [sections, setSections] = useState({
        Breakfast: [],
        Lunch: [],
        Dinner: [],
        Snack: [],
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalSection, setModalSection] = useState(""); // Section name for the modal
    const [memNo, setMemNo] = useState(null); // Member number state
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    const [error, setError] = useState(null); // Add error state

    // Access the context for global state management
    const mealsContext = useContext(MealsContext);

    // Get selected date from localStorage
    const selectedDate = localStorage.getItem("selectedDate");
    const dateToSave = format(selectedDate, 'yyyy-MM-dd');

    // Extract loadClientMeals outside of useEffect so it can be called from multiple places
    const loadClientMeals = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Get user data from localStorage
            const userData = JSON.parse(localStorage.getItem("user"));
            if (!userData || !userData.memNo) {
                console.warn("No member number found for the logged-in user.");
                setError("User information not found");
                setIsLoading(false);
                return;
            }

            const memNo = userData.memNo;
            setMemNo(memNo);

            // Always use selectedDate from localStorage
            const selectedDate = localStorage.getItem("selectedDate");

            // Default to current date in KST format if selectedDate doesn't exist
            const dateParam = selectedDate
                ? format(new Date(selectedDate), 'yyyy-MM-dd')
                : (() => {
                    const now = new Date();
                    const kstDate = new Date(now.getTime() + 9 * 60 * 60000);
                    return `${kstDate.getUTCFullYear()}-${String(kstDate.getUTCMonth() + 1).padStart(2, "0")}-${String(kstDate.getUTCDate()).padStart(2, "0")}`;
                })();

            // Build URL with query parameter if date exists
            const url = `http://localhost:8000/api/meals/${memNo}${dateParam ? `?date=${dateParam}` : ""}`;

            console.log("Fetching meals from:", url);
            const response = await fetch(url);
            const rawResponse = await response.text();

            if (!response.ok) {
                throw new Error(`Failed to fetch client meals: ${rawResponse}`);
            }

            const mealsResponse = JSON.parse(rawResponse);
            console.log("Raw API response:", mealsResponse);

            const groupedMeals = { Breakfast: [], Lunch: [], Dinner: [], Snack: [] };

            mealsResponse.forEach((meal) => {
                const { mealType, name, calories, memo, recordId, protein, carbs, fat } = meal;
                if (groupedMeals[mealType]) {
                    groupedMeals[mealType].push({
                        id: recordId,
                        recordId: recordId,
                        name: name,
                        calories,
                        unit: "1 Serving",
                        memo: memo || "",
                        protein: protein || 0,
                        carbs: carbs || 0,
                        fat: fat || 0,
                        photo: null,
                    });
                } else {
                    console.warn(`Unexpected mealType: ${mealType}`, meal);
                }
            });

            setSections(groupedMeals);
            console.log("Updated Sections:", groupedMeals);

            // If we're part of a context system, notify the context that data has been updated
            if (mealsContext && mealsContext.setMealsData) {
                mealsContext.setMealsData(groupedMeals);
            }

            // Dispatch a custom event to notify other components
            const reloadEvent = new CustomEvent('mealsReloaded', {
                detail: {
                    timestamp: new Date().getTime(),
                    source: 'Meals.jsx',
                    meals: groupedMeals
                }
            });
            window.dispatchEvent(reloadEvent);
        } catch (error) {
            console.error("Error loading client meals:", error);
            setError("Failed to load meals: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Add event listener for date changes
    useEffect(() => {
        const handleDateChange = () => {
            console.log("Date change detected in Meals component");
            loadClientMeals();
        };

        // Listen for the custom event from DietCalendar
        window.addEventListener('selectedDateChanged', handleDateChange);

        // Initial load of meals
        loadClientMeals();

        // Clean up the event listener
        return () => {
            window.removeEventListener('selectedDateChanged', handleDateChange);
        };
    }, []);

    const onAddMeal = (section) => {
        setModalSection(section);
        setIsModalOpen(true);
    };

    const saveMeal = async (meal) => {
        try {
            // Get memNo from localStorage to send with each request
            const userData = JSON.parse(localStorage.getItem("user"));
            const memNo = userData?.memNo;

            // Format the selected date
            let dietDate;
            if (selectedDate) {
                // Parse the date string to a Date object
                const parsedDate = new Date(selectedDate);
                // Format it as YYYY-MM-DD
                dietDate = `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, '0')}-${String(parsedDate.getDate()).padStart(2, '0')}`;
                console.log("Using selected date:", dietDate);
            } else {
                // Use current date as fallback
                const now = new Date();
                dietDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                console.log("No selected date found, using current date:", dietDate);
            }

            // Prepare the meal data to send to the API
            const mealData = {
                memNo: memNo, // Member number
                dietDate: dietDate,
                mealType: modalSection, // The meal section (e.g., "Breakfast", "Lunch")
                name: meal.name, // Name of the food
                calories: meal.calories, // Number of calories
                memo: meal.memo || "", // Optional memo
                protein: meal.protein || 0,
                carbs: meal.carbs || 0, // Note: Ensure field names match between frontend and backend
                fat: meal.fat || 0
            };

            console.log("Saving meal data:", mealData);

            // Make a POST request to save the meal
            const response = await axios.post("http://localhost:8000/api/meals", mealData);

            // Response should return the saved meal
            const savedMeal = response.data;
            console.log("Saved meal:", savedMeal);

            // Update the state to include the newly added meal
            setSections((prevSections) => ({
                ...prevSections,
                [modalSection]: [...prevSections[modalSection], savedMeal],
            }));

            console.log(`Meal added successfully:`, savedMeal);

            // Close the modal after success
            closeModal();

        } catch (error) {
            console.error("Error saving meal:", error);
            alert("Failed to save the meal. Please try again.");
        }
    };

    const addMealToSection = async (meal) => {
        console.log(`Adding meal to section: ${modalSection}`, meal);
        await saveMeal(meal);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalSection("");
    };

    // Handler for deleting meals
    const handleDeleteMeal = async (mealId) => {
        try {
            // Call API to delete the meal
            await axios.delete(`http://localhost:8000/api/meals/${mealId}`);

            // Reload meals to update the UI
            loadClientMeals();
        } catch (error) {
            console.error("Error deleting meal:", error);
            alert("Failed to delete meal. Please try again.");
        }
    };

    // Handler for adding a new meal and closing modal
    const handleSaveMeal = async (mealData) => {
        try {
            // Format the meal data with the selected section (mealType)
            const mealToSave = {
                ...mealData,
                mealType: modalSection,
                memNo: memNo
            };

            // Save the meal
            await axios.post('http://localhost:8000/api/meals', mealToSave);

            // Close modal
            setIsModalOpen(false);

            // Reload meals to update the UI
            loadClientMeals();
        } catch (error) {
            console.error("Error saving meal:", error);
            alert("Failed to save meal. Please try again.");
        }
    };

    return (
        <div className="meals-container p-6">
            <h1 className="text-2xl font-bold mb-6">My Meals</h1>

            {/* Show loading state */}
            {isLoading && (
                <div className="text-center py-4">
                    <p>Loading meals...</p>
                </div>
            )}

            {/* Show error message */}
            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Meal sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MealSection
                    title="Breakfast"
                    meals={sections.Breakfast}
                    onAddMeal={onAddMeal}
                    onDeleteMeal={handleDeleteMeal}
                />
                <MealSection
                    title="Lunch"
                    meals={sections.Lunch}
                    onAddMeal={onAddMeal}
                    onDeleteMeal={handleDeleteMeal}
                />
                <MealSection
                    title="Dinner"
                    meals={sections.Dinner}
                    onAddMeal={onAddMeal}
                    onDeleteMeal={handleDeleteMeal}
                />
                <MealSection
                    title="Snack"
                    meals={sections.Snack}
                    onAddMeal={onAddMeal}
                    onDeleteMeal={handleDeleteMeal}
                />
            </div>

            {/* Add Meal Modal */}
            {isModalOpen && (
                <AddMealModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveMeal}
                    onAddMeal={addMealToSection}
                    sectionTitle={modalSection}
                    foods={foods}
                />
            )}
        </div>
    );
};

export default Meals;