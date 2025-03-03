import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPlus, faTimes, faTrash} from '@fortawesome/free-solid-svg-icons';

const MealSection = ({ title, meals, onAddClick, onDeleteMeal }) => {
    const [selectedMeal, setSelectedMeal] = useState(null);

    const handleMealClick = (meal) => {
        setSelectedMeal(meal); // Open delete modal
    };

    const closeDeleteModal = () => {
        setSelectedMeal(null); // Close modal
    };

    return (
        <div className="meal-section bg-gray-100 p-4 rounded-lg shadow-md flex flex-col justify-between w-full">
            {/* Section Header */}
            <div className="section-header flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">{title}</h2>
                <span className="flex items-center text-sm text-gray-600 font-medium">
                    Total: {meals.reduce((sum, meal) => sum + meal.calories, 0)} kcal
                </span>
            </div>

            {/* Meal List */}
            <div className="meal-list mb-4 overflow-y-scroll max-h-56">
                {meals.map((meal) => (
                    <div
                        key={meal.id}
                        onClick={() => handleMealClick(meal)} // Open delete confirmation modal
                        className="meal-item flex items-center justify-between p-3 bg-white shadow rounded mb-2 cursor-pointer hover:bg-gray-100 transition"
                    >
                        <div>
                            <h3 className="meal-name text-sm font-medium">{meal.name}</h3>
                            <p className="text-gray-500 text-xs">
                                {meal.unit} • {meal.calories} kcal
                            </p>
                        </div>
                        <img
                            src={meal.photo}
                            alt={meal.name}
                            className="w-12 h-12 object-cover rounded"
                        />
                    </div>
                ))}
            </div>

            {/* Add Button */}
            <button
                onClick={() => onAddClick(title)}
                className="add-button bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600 transition duration-200 flex items-center gap-2"
            >
                <FontAwesomeIcon icon={faPlus} /> Add to {title}
            </button>

            {/* Delete Confirmation Modal */}
            {selectedMeal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-sm w-full shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Deletion</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete{' '}
                            <span className="font-semibold">{selectedMeal.name}</span>?
                        </p>
                        <div className="flex justify-end space-x-4">
                            {/* Cancel Button */}
                            <button
                                onClick={closeDeleteModal}
                                className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400 transition flex items-center gap-2"
                            >
                                <FontAwesomeIcon icon={faTimes} /> Cancel
                            </button>
                            {/* Delete Button */}
                            <button
                                onClick={() => {
                                    onDeleteMeal(selectedMeal.id); // Trigger deletion
                                    closeDeleteModal(); // Close modal
                                }}
                                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition flex items-center gap-2"
                            >
                                <FontAwesomeIcon icon={faTrash} /> Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MealSection;