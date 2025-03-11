import React, { useState, useEffect } from "react";
import MealSection from "./MealSection";
import AddMealModal from "./AddMealModal";
import Food from "../../Food";

const Meals = () => {
    const [foods, setFoods] = useState([]); // State for food data
    const [sections, setSections] = useState({
        아침: [],
        점심: [],
        저녁: [],
        간식: [],
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalSection, setModalSection] = useState(""); // Section name for the modal

    // Fetch FoodData.json from the backend
    useEffect(() => {
        const fetchFoodData = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/food-data"); // Backend API to fetch data
                if (!response.ok) {
                    throw new Error("Failed to fetch food data.");
                }
                const data = await response.json(); // Parse JSON response
                const foodObjects = data.records.map((record) => new Food(record)); // Map records to Food objects
                setFoods(foodObjects);
            } catch (error) {
                console.error("Error fetching food data:", error);
            }
        };

        fetchFoodData();
    }, []);

    // Utility function to find a food by name
    const findFoodByName = (name) => foods.find((food) => food.name.includes(name));

    // Open and close modal for adding meals
    const openModal = (sectionName) => {
        setModalSection(sectionName);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalSection("");
    };

    const handleAddMeal = (mealName) => {
        const food = findFoodByName(mealName); // Find food by name
        if (food) {
            setSections((prevSections) => ({
                ...prevSections,
                [modalSection]: [
                    ...prevSections[modalSection],
                    { id: food.id, name: food.name, calories: food.calories }, // Minimal details
                ],
            }));
        }
        closeModal();
    };

    const handleDeleteMeal = (sectionName, mealId) => {
        setSections((prevSections) => ({
            ...prevSections,
            [sectionName]: prevSections[sectionName].filter((meal) => meal.id !== mealId),
        }));
    };

    // Event handler for "저장" button
    const handleSaveMeals = async () => {
        try {
            const memberNumber = new URLSearchParams(window.location.search).get("memberNumber");
            const response = await fetch(`http://localhost:8000/api/save-meals/${memberNumber}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(sections), // Send 'sections' as JSON
            });
            if (!response.ok) {
                throw new Error("Failed to save meals.");
            }
            alert("Meals saved successfully!"); // Alert the user on success
        } catch (error) {
            console.error("Error saving meals:", error);
            alert("Error saving meals. Please try again.");
        }
    };

    // Event handler for "초기화" button
    const handleResetMeals = () => {
        setSections({
            아침: [],
            점심: [],
            저녁: [],
            간식: [],
        });
        alert("Meals have been reset!");
    };

    return (
        <div className="meals-container max-w-full mx-auto p-6">
            {/* Updated Section */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800">오늘의 식단</h2>
                <div className="flex space-x-2">
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={handleSaveMeals} // Save meals event
                    >
                        저장
                    </button>
                    <button
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                        onClick={handleResetMeals} // Reset meals event
                    >
                        초기화
                    </button>
                </div>
            </div>

            <div className="meal-grid grid grid-cols-1 md:grid-cols-4 gap-4">
                {Object.entries(sections).map(([sectionName, sectionMeals]) => (
                    <MealSection
                        key={sectionName}
                        title={sectionName}
                        meals={sectionMeals}
                        onAddClick={() => openModal(sectionName)}
                        onDeleteMeal={(mealId) => handleDeleteMeal(sectionName, mealId)}
                    />
                ))}
            </div>

            {/* Pass foods to AddMealModal */}
            <AddMealModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onAddMeal={handleAddMeal}
                foods={foods} // Pass food data to modal
            />
        </div>
    );
};

export default Meals;