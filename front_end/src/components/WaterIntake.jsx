import React, { useState } from "react";

const WaterIntake = () => {
    const [waterCount, setWaterCount] = useState(0); // Current intake count
    const [dailyIntakeGoal, setDailyIntakeGoal] = useState(8); // Daily intake goal
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
    const [newGoal, setNewGoal] = useState(""); // Input value for setting a new goal

    // Increment current water intake count
    const addWater = () => {
        setWaterCount(waterCount + 1);
    };

    // Update the daily goal
    const updateDailyGoal = () => {
        if (newGoal && Number(newGoal) > 0) {
            setDailyIntakeGoal(Number(newGoal));
            setNewGoal(""); // Clear the input field
            setIsModalOpen(false); // Close the modal after updating
        }
    };

    return (
        <div className="water-tracker">
            <h2 className="text-xl font-semibold mb-4">물 섭취량</h2>
            <div className="water-counter">
                <p className="text-lg mb-4">
                    {waterCount} / {dailyIntakeGoal} 컵
                </p>
            </div>
            {/* Add Water Button */}
            <button
                className="add-water-button px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition mb-4"
                onClick={addWater}
            >
                + 추가
            </button>

            {/* Open Modal Button */}
            <button
                className="update-goal-button px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition"
                onClick={() => setIsModalOpen(true)} // Open the modal
            >
                + 수정
            </button>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="modal-content bg-white p-6 rounded shadow-lg">
                        <h3 className="text-lg font-semibold mb-4">Set Your Daily Goal</h3>
                        <input
                            type="number"
                            className="px-2 py-1 border rounded w-full mb-4"
                            placeholder="Enter daily goal"
                            value={newGoal}
                            onChange={(e) => setNewGoal(e.target.value)}
                        />
                        <div className="flex justify-between">
                            <button
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 transition"
                                onClick={() => setIsModalOpen(false)} // Close modal without saving
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition"
                                onClick={updateDailyGoal} // Save new goal and close modal
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WaterIntake;