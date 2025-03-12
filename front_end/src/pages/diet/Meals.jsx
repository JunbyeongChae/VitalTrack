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

    // Fetch FoodData20250312.json from the backend
    useEffect(() => {
        const fetchFoodData = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/food-data");

                // DEBUG: Check raw response and log
                const rawResponse = await response.text();
                console.log("Raw API Response:", rawResponse);

                if (!response.ok) {
                    throw new Error(`Server Error: ${rawResponse}`);
                }

                // Parse JSON after validating response format
                const data = JSON.parse(rawResponse);
                const foodObjects = data.records.map((record) => new Food(record));
                setFoods(foodObjects);
            } catch (error) {
                console.error("Error fetching food data:", error);
            }
        };//end of fetchFoodData
        const loadClientMeals = async () => {
            try {
                const memberNumber = new URLSearchParams(window.location.search).get("memberNumber");

                if (!memberNumber) {
                    console.warn("No member number found in the URL.");
                    return;
                }

                const response = await fetch(`http://localhost:8000/api/meals/${memberNumber}`);
                const rawResponse = await response.text();
                console.log("Raw API Response for meals:", rawResponse);

                if (!response.ok) {
                    throw new Error(`Failed to fetch client meals: ${rawResponse}`);
                }

                const mealsResponse = JSON.parse(rawResponse);

                const formattedSections = {
                    아침: mealsResponse.아침 || [],
                    점심: mealsResponse.점심 || [],
                    저녁: mealsResponse.저녁 || [],
                    간식: mealsResponse.간식 || [],
                };

                console.log("Loaded client meals and formatted into sections:", formattedSections);

                setSections(formattedSections);
            } catch (error) {
                console.error("Error loading client meals:", error);
            }
        };
        fetchFoodData();
        loadClientMeals(); // Fetch client meals
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

    const handleAddMeal = (meal) => {
        console.log("Incoming Meal Object:", meal);

        setSections((prevSections) => {
            console.log("Previous sections state:", prevSections);
            console.log("Current modalSection:", modalSection);

            if (!prevSections[modalSection]) {
                console.error(
                    `Error: Section "${modalSection}" does not exist.`,
                    prevSections
                );
                return prevSections;
            }

            // Explicitly validate properties before processing
            const updatedMeal = {
                id: meal.id || "(no id specified)", // Fallback if property is undefined
                name: meal.name || "(no name specified)",
                calories: meal.calories || 0, // Default to 0 if calories is missing
            };

            console.log("Validated Updated Meal Object:", updatedMeal);

            // Prevent adding invalid meals
            if (!updatedMeal.id || !updatedMeal.name || updatedMeal.calories === undefined) {
                console.error("Invalid Meal Data:", updatedMeal);
                return prevSections;
            }

            const updatedSection = [...prevSections[modalSection], updatedMeal];
            console.log(`Updated section "${modalSection}" after adding:`, updatedSection);

            return {
                ...prevSections,
                [modalSection]: updatedSection,
            };
        });

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