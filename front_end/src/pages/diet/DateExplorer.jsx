/* 식단관리 페이지 우측 상단에 있는 날짜선택기 */

import React, { useState } from "react";
import DateModal from "./DateModal";


const DateExplorer = ({ selectedDate, onDateChange }) => {
    const [isModalOpen, setModalOpen] = useState(false); // Modal visibility

    const handleDayChange = (delta) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + delta); // Change the date by delta days
        onDateChange(newDate); // Inform the parent about the date change
    };

    return (
        <div className="flex space-x-4 items-center justify-center my-4">
            <button
                onClick={() => handleDayChange(-1)}
                className="text-xl font-bold text-gray-600"
            >
                {"<<"}
            </button>

            <span
                className="text-xl font-semibold cursor-pointer"
                onClick={() => setModalOpen(true)} // Open modal
            >
                {`${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`}

            </span>

            <button
                onClick={() => handleDayChange(1)}
                className="text-xl font-bold text-gray-600"
            >
                {">>"}
            </button>

            {/* Date Picker Modal */}
            <DateModal
                isOpen={isModalOpen}
                selectedDate={selectedDate}
                onClose={() => setModalOpen(false)}
                onDateChange={(newDate) => {
                    onDateChange(newDate); // Inform parent of the new date
                    setModalOpen(false); // Close modal
                }}
            />
        </div>
    );
};

export default DateExplorer;