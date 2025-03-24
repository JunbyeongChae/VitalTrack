import React, { useState, useEffect } from "react";
import MealSection from "./MealSection";
import AddMealModal from "./AddMealModal";
import Food from "../../Food";
import axios from "axios";

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

    // Extract loadClientMeals outside of useEffect so it can be called from multiple places
    const loadClientMeals = async () => {
        try {
            // Get user data from localStorage
            const userData = JSON.parse(localStorage.getItem("user"));
            if (!userData || !userData.memNo) {
                console.warn("No member number found for the logged-in user.");
                return;
            }

            const memNo = userData.memNo;
            setMemNo(memNo);

            // Get selected date from localStorage
            const selectedDate = localStorage.getItem("selectedDate");
            let dateParam = "";

            if (selectedDate) {
                // Format date from "2025-03-20 12:00:00" to "2025-03-20"
                dateParam = selectedDate.split(" ")[0];
            }

            // Build URL with query parameter if date exists
            const url = `http://localhost:8000/api/meals/${memNo}${dateParam ? `?date=${dateParam}` : ""}`;

            console.log("Fetching meals from:", url);
            const response = await fetch(url);
            const rawResponse = await response.text();
            console.log("Raw API Response for meals:", rawResponse);

            if (!response.ok) {
                throw new Error(`Failed to fetch client meals: ${rawResponse}`);
            }

            const mealsResponse = JSON.parse(rawResponse);
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
        } catch (error) {
            console.error("Error loading client meals:", error);
        }
    };

    // Main useEffect for initial data loading
    useEffect(() => {
        const fetchFoodData = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/food-data");
                const foodObjects = response.data.records.map((record) => new Food(record));
                setFoods(foodObjects);
            } catch (error) {
                console.error("Error fetching food data:", error);
            }
        };

        fetchFoodData();
        loadClientMeals();
    }, []);

    // Add the storage event listener useEffect here
    useEffect(() => {
        // Function to handle date changes
        const handleDateChange = () => {
            console.log("Date change detected, reloading meals");
            loadClientMeals();
        };

        // Listen for our custom event
        window.addEventListener("selectedDateChanged", handleDateChange);

        // Set up initial handling of existing date in localStorage
        const currentSelectedDate = localStorage.getItem("selectedDate");
        if (currentSelectedDate) {
            console.log("Initial date found in localStorage:", currentSelectedDate);
        }

        // Clean up event listener when component unmounts
        return () => {
            window.removeEventListener("selectedDateChanged", handleDateChange);
        };
    }, []);

// Also add this utility function to your component
    const updateSelectedDate = (newDate) => {
        localStorage.setItem("selectedDate", newDate);
        // Dispatch custom event to notify components
        window.dispatchEvent(new CustomEvent("selectedDateChanged"));
    };

    const openModal = (sectionName) => {
        setModalSection(sectionName);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalSection("");
    };


    const saveMeal = async (meal) => {
        try {
            // Get memNo from localStorage to send with each request
            const userData = JSON.parse(localStorage.getItem("user"));
            const memNo = userData?.memNo;

            if (!memNo) {
                console.error("Member number (memNo) is missing for this user.");
                alert("User is not logged in or missing member number. Please log in again.");
                return;
            }

            // Prepare the meal data to send to the API
            const mealData = {
                memNo: memNo, // Member number
                dietDate: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD format
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

// Add this deleteMeal function to your Meals component
    const handleDeleteMeal = async (recordId) => {
        try {
            console.log("Deleting meal with ID:", recordId);
            const response = await axios.delete(`http://localhost:8000/api/meals/${recordId}`);

            if (response.status === 200) {
                // On successful deletion, update the state to remove the meal
                const updatedSections = {...sections};

                // Find and remove the meal from the appropriate section
                Object.keys(updatedSections).forEach(section => {
                    updatedSections[section] = updatedSections[section].filter(meal => meal.recordId !== recordId);
                });

                setSections(updatedSections);
                console.log("Meal deleted successfully");
            }
        } catch (error) {
            console.error("Error deleting meal:", error);
            alert("Failed to delete meal. Please try again.");
        }
    };

    return (
        <div className="meals-page px-4 py-6">
            <h1 className="text-xl font-bold mb-4">오늘의 식단</h1>

            <div className="meal-sections grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Meal sections */}
                {Object.entries(sections).map(([sectionName, sectionMeals]) => (
                    <MealSection
                        key={sectionName}
                        title={sectionName}
                        meals={sectionMeals}
                        onAddClick={() => openModal(sectionName)}
                        onDeleteMeal={handleDeleteMeal} // Pass the delete handler
                    />
                ))}
            </div>

            {/* Add Meal Modal */}
            {isModalOpen && (
                <AddMealModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onAddMeal={addMealToSection}
                    sectionName={modalSection}
                    foodOptions={foods}
                />
            )}
        </div>
    );
};


export default Meals;