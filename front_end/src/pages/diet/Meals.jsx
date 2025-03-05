import React, { useState } from "react";
import MealSection from "./MealSection"; // Import MealSection
import AddMealModal from "./AddMealModal"; // Import AddMealModal

const Meals = () => {
    // State to manage meal sections dynamically
    const [sections, setSections] = useState({
        Breakfast: [],
        Lunch: [],
        Dinner: [],
        Snack: [],
    });

    // State to control AddMealModal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalSection, setModalSection] = useState(""); // Section name for which the modal is opened

    // Open modal for a specific section
    const openModal = (sectionName) => {
        setModalSection(sectionName);
        setIsModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setModalSection("");
    };

    // Function to handle adding a meal to a specific section
    const handleAddMeal = (meal) => {
        setSections((prevSections) => ({
            ...prevSections,
            [modalSection]: [...prevSections[modalSection], meal],
        }));
        closeModal(); // Close modal
    };

    // Function to delete a meal from a specific section
    const handleDeleteMeal = (sectionName, mealId) => {
        setSections((prevSections) => ({
            ...prevSections,
            [sectionName]: prevSections[sectionName].filter((meal) => meal.id !== mealId),
        }));
    };

    // Render Meals sections
    return (
        <div className="meals-container max-w-full mx-auto p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">오늘의 식단</h2>
            <div className="meal-grid grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Render MealSection dynamically for each section */}
                {Object.entries(sections).map(([sectionName, sectionMeals]) => (
                    <MealSection
                        key={sectionName}
                        title={sectionName}
                        meals={sectionMeals} // Meals for the specific section
                        onAddClick={() => openModal(sectionName)} // Open AddMealModal for section
                        onDeleteMeal={(mealId) => handleDeleteMeal(sectionName, mealId)} // Direct delete function
                    />
                ))}
            </div>

            {/* AddMealModal */}
            <AddMealModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onAddMeal={handleAddMeal}
            />
        </div>
    );
};

export default Meals;