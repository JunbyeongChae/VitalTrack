import React, { useState, useEffect } from "react";
import MealSection from "./MealSection";
import AddMealModal from "./AddMealModal";
import Food from "../../Food"

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
                const response = await fetch("http://localhost:4000/api/food-data"); // Backend API to fetch data
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

    const findFoodByName = (name) => foods.find((food) => food.name.includes(name));

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

    return (
        <div className="meals-container max-w-full mx-auto p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">오늘의 식단</h2>
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
