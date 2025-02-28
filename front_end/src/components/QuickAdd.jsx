import React, { useState } from "react";
import Modal from "./Modal"; // A reusable modal component

const QuickAdd = () => {
    const [openModal, setOpenModal] = useState(null); // State for controlling which modal is open

    const handleOpenModal = (type) => {
        setOpenModal(type); // Set the type of the modal to open
    };

    const handleCloseModal = () => {
        setOpenModal(null); // Close the modal
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Quick Add</h2>
            <div className="flex flex-col gap-4">
                {/* Search Foods */}
                <button
                    className="px-4 py-2 bg-white text-black rounded hover:bg-lime-400 transition"
                    onClick={() => handleOpenModal("calories")}
                >
                    + Search Foods
                </button>

                {/* Recent Meals Button */}
                <button
                    className="px-4 py-2 bg-white text-black rounded hover:bg-lime-400 transition"
                    onClick={() => handleOpenModal("nutrition")}
                >
                    + Recent Meals
                </button>

                {/* Create Custom Meal Button */}
                <button
                    className="px-4 py-2 bg-white text-black rounded hover:bg-lime-400 transition"
                    onClick={() => handleOpenModal("water")}
                >
                    + Create Custom Meal
                </button>
            </div>

            {/* Modals */}
            {openModal === "calories" && (
                <Modal onClose={handleCloseModal} title="Add Calories">
                    <p>Calorie Add Modal Content Here.</p>
                </Modal>
            )}

            {openModal === "nutrition" && (
                <Modal onClose={handleCloseModal} title="Add Nutrition">
                    <p>Nutrition Add Modal Content Here.</p>
                </Modal>
            )}

            {openModal === "water" && (
                <Modal onClose={handleCloseModal} title="Add Water">
                    <p>Water Add Modal Content Here.</p>
                </Modal>
            )}
        </div>
    );
};

export default QuickAdd;