import React, { useState, useEffect } from "react";
import MealSection from "./MealSection";
import AddMealModal from "./AddMealModal";
import Food from "../../Food";
import axios from "axios";


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
                const groupedMeals = { 아침: [], 점심: [], 저녁: [], 간식: [] };

                mealsResponse.forEach((meal, index) => {
                    const { mealType, foodName, calories, memo, id } = meal;
                    if (groupedMeals[mealType]) {
                        groupedMeals[mealType].push({
                            id: id || `meal-${mealType}-${index}`,
                            name: foodName,
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

    const findFoodByName = (name) => foods.find((food) => food.name.includes(name));

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
                mealType: modalSection, // The meal section (e.g., "아침", "점심")
                foodName: meal.name, // Name of the food
                calories: meal.calories, // Number of calories
                memo: meal.memo || "", // Optional memo
            };

            console.log("Saving meal data:", mealData);

            // Make a POST request to save the meal
            const response = await axios.post("http://localhost:8000/api/meals", mealData);

            // Response should return the saved meal
            const savedMeal = response.data;

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


    const handleDeleteMeal = (sectionName, mealId) => {
        setSections((prevSections) => ({
            ...prevSections,
            [sectionName]: prevSections[sectionName].filter((meal) => meal.id !== mealId),
        }));
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
        <div className="meals-page px-4 py-6">
            <h1 className="text-xl font-bold mb-4">오늘의 식단</h1>

            <div className="meal-sections grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MealSection
                    title="아침"
                    meals={sections.아침}
                    onAddClick={() => openModal("아침")}
                    onDeleteMeal={(meal) => console.log("Delete meal:", meal)}
                />
                <MealSection
                    title="점심"
                    meals={sections.점심}
                    onAddClick={() => openModal("점심")}
                    onDeleteMeal={(meal) => console.log("Delete meal:", meal)}
                />
                <MealSection
                    title="저녁"
                    meals={sections.저녁}
                    onAddClick={() => openModal("저녁")}
                    onDeleteMeal={(meal) => console.log("Delete meal:", meal)}
                />
                <MealSection
                    title="간식"
                    meals={sections.간식}
                    onAddClick={() => openModal("간식")}
                    onDeleteMeal={(meal) => console.log("Delete meal:", meal)}
                />
            </div>
            <AddMealModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onAddMeal={addMealToSection}
                foods={foods} // Pass food data to modal
            />
        </div>
    );
};

export default Meals;