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

        const loadClientMeals = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem("user"));
                if (!userData || !userData.memNo) {
                    console.warn("No member number found for the logged-in user.");
                    return;
                }

                const memNo = userData.memNo;
                const response = await fetch(`http://localhost:8000/api/meals/${memNo}`);
                const rawResponse = await response.text();
                console.log("Raw API Response for meals:", rawResponse);

                if (!response.ok) {
                    throw new Error(`Failed to fetch client meals: ${rawResponse}`);
                }

                const mealsResponse = JSON.parse(rawResponse);
                const groupedMeals = { Breakfast: [], Lunch: [], Dinner: [], Snack: [] };

                mealsResponse.forEach((meal, index) => {
                    const { mealType, name, calories, memo, recordId } = meal;
                    if (groupedMeals[mealType]) {
                        groupedMeals[mealType].push({
                            id: recordId,
                            recordId: recordId,
                            name: name,
                            calories,
                            unit: "Serving",
                            memo: memo || "",
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

        fetchFoodData();
        loadClientMeals();
    }, []);

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