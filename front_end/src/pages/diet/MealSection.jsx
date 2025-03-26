/* Meals 컴포넌트에서 추가된 식단을 표시하는 섹션 */

import React, {useCallback, useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';

const MealSection = ({ title, meals, onAddMeal, onDeleteMeal }) => {
    const [selectedMeal, setSelectedMeal] = useState(null);


    const handleMealClick = (meal) => {
        setSelectedMeal(meal); // Open delete modal
    };

    const closeDeleteModal = () => {
        setSelectedMeal(null); // Close modal
    };

    return (
        <div className="meal-section bg-gray-100 p-4 rounded-lg shadow-md flex flex-col justify-between w-full">
            {/* 섹션 헤더 */}
            <div className="section-header flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">{title}</h2>
                <span className="flex items-center text-sm text-gray-600 font-medium">
                    Total: {meals.reduce((sum, meal) => sum + meal.calories, 0)} kcal
                </span>
            </div>

            {/* 식단 목록 */}
            <div className="meal-list mb-4 overflow-y-scroll max-h-56">
                {meals.length > 0 ? (
                    meals.map((meal) => (
                        <div
                            key={meal.recordId}
                            onClick={() => handleMealClick(meal)} // 식단 삭제 모달 열기
                            className="meal-item flex items-center justify-between p-3 bg-white shadow rounded mb-2 cursor-pointer hover:bg-gray-100 transition"
                        >
                            <div>
                                <h3 className="meal-name text-sm font-medium">{meal.name}</h3>
                                <p className="text-gray-500 text-xs">
                                    {meal.unit || "1 Serving"} • {meal.calories} kcal
                                </p>
                                {/* Display macronutrients if available */}
                                {(meal.protein || meal.carbs || meal.fat) && (
                                    <p className="text-gray-500 text-xs">
                                        탄: {meal.carbs?.toFixed(1) || 0}g •
                                        단: {meal.protein?.toFixed(1) || 0}g •
                                        지: {meal.fat?.toFixed(1) || 0}g
                                    </p>
                                )}
                            </div>
                            {meal.photo ? (
                                <img
                                    src={meal.photo}
                                    alt={meal.name}
                                    className="w-12 h-12 object-cover rounded"
                                />
                            ) : (
                                <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded">
                                    🍅
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center text-sm">
                        아직 추가된 식단이 없습니다.
                    </p>
                )}
            </div>
            {/* Add Button */}
            <button
                className="w-full mt-4 py-2 bg-green-500 text-white rounded-md flex items-center justify-center hover:bg-green-600 transition-colors"
                onClick={() => onAddMeal(title)}
            >
                <FontAwesomeIcon icon={faPlus} /> Add {title}
            </button>

            {/* Delete Confirmation Modal */}
            {selectedMeal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-sm w-full shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">식단 삭제하기</h3>
                        <p className="text-gray-600 mb-6">
                            <span className="font-semibold"> {selectedMeal.name} </span>식단을 정말 삭제하시겠습니까?
                        </p>
                        <div className="flex justify-end space-x-4">
                            {/* 취소 버튼 */}
                            <button
                                onClick={closeDeleteModal}
                                className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
                            >
                                취소
                            </button>
                            {/* 삭제 버튼 */}
                            <button
                                onClick={() => {
                                    onDeleteMeal(selectedMeal.recordId);
                                    closeDeleteModal();
                                }}
                                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
                            >
                                <FontAwesomeIcon icon={faTrash} className="mr-2" />
                                삭제
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MealSection;