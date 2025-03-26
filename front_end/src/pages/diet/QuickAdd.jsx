/* 임시로 숨김처리된 컴포넌트 (우측 사이드바) */

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
            <h2 className="text-xl font-semibold mb-4">간편 추가</h2>
            <div className="flex flex-col gap-4">
                {/* Search Foods */}
                <button
                    className="px-4 py-2 bg-white text-black rounded hover:bg-lime-500 transition"
                    onClick={() => handleOpenModal("calories")}
                >
                    + 식품 찾기
                </button>

                {/* Recent Meals Button */}
                <button
                    className="px-4 py-2 bg-white text-black rounded hover:bg-lime-500 transition"
                    onClick={() => handleOpenModal("nutrition")}
                >
                    + 최근 식사
                </button>

                {/* Create Custom Meal Button */}
                <button
                    className="px-4 py-2 bg-white text-black rounded hover:bg-lime-500 transition"
                    onClick={() => handleOpenModal("water")}
                >
                    + 식품데이터 추가
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