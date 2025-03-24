import React, { useState, useEffect } from "react";

const DateModal = ({ isOpen, selectedDate, onClose, onDateChange }) => {
    // States for year, month, day, and view mode
    const [year, setYear] = useState(selectedDate.getFullYear());
    const [month, setMonth] = useState(selectedDate.getMonth());
    const [days, setDays] = useState([]); // Days in the selected month
    const [viewMode, setViewMode] = useState("month"); // 'month' or 'day'

    // Helper function to generate days for a given month and year
    const generateDays = (month, year) => {
        const daysInMonth = new Date(year, month + 1, 0).getDate(); // Number of days in the month
        return Array.from({ length: daysInMonth }, (_, i) => i + 1); // [1, 2, ..., daysInMonth]
    };

    // Update the days when month or year changes
    useEffect(() => {
        setDays(generateDays(month, year));
    }, [month, year]);

    // Handle month navigation
    const handlePrevMonth = () => {
        if (month === 0) {
            // If current month is January, move to December of the previous year
            setMonth(11);
            setYear((prevYear) => prevYear - 1);
        } else {
            setMonth((prevMonth) => prevMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (month === 11) {
            // If current month is December, move to January of the next year
            setMonth(0);
            setYear((prevYear) => prevYear + 1);
        } else {
            setMonth((prevMonth) => prevMonth + 1);
        }
    };

    // Handle date selection (finalize selection directly on day click)
    const handleDateSelection = (day) => {
        // Set the date and ensure the time is fixed in local time
        const newDate = new Date(year, month, day, 12, 0, 0); // Set time to noon to avoid timezone issues
        onDateChange(newDate); // Send the corrected date back to the parent
        onClose(); // Close the modal
    };

    // Go back to Month View from Day View
    const handleBack = () => setViewMode("month");

    // 일자를 변경하더라도 modal을 켤 때마다 항상 오늘 날짜로 돌아옴
    useEffect(() => {
        if (isOpen) {
            const today = new Date();
            setYear(today.getFullYear());
            setMonth(today.getMonth());
            setDays(generateDays(today.getMonth(), today.getFullYear()));
        }
    }, [isOpen]);

    // Close modal if isOpen is false
    if (!isOpen) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                {/* Header */}
                <h2 className="text-xl font-semibold mb-4 text-center">
                    {viewMode === "month" ? "Select Month & Year" : "Select a Day"}
                </h2>

                {/* Year Controls - Show in both views */}
                <div className="flex items-center justify-center mb-4">
                    <button
                        onClick={() => setYear(year - 1)}
                        className="px-2 py-1 text-gray-500 font-bold"
                    >
                        {"<<"}
                    </button>
                    <span className="text-lg px-4">{year}</span>
                    <button
                        onClick={() => setYear(year + 1)}
                        className="px-2 py-1 text-gray-500 font-bold"
                    >
                        {">>"}
                    </button>
                </div>

                {/* Month View */}
                {viewMode === "month" && (
                    <div className="grid grid-cols-3 gap-2 mb-6">
                        {Array.from({ length: 12 }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setMonth(i); // Set the selected month
                                    setViewMode("day"); // Switch to day view
                                }}
                                className={`p-2 rounded-lg ${
                                    month === i ? "bg-blue-500 text-white" : "bg-gray-200"
                                }`}
                            >
                                {new Date(0, i).toLocaleString("default", { month: "short" })}
                            </button>
                        ))}
                    </div>
                )}

                {/* Day View */}
                {viewMode === "day" && (
                    <>
                        {/* Month and Year Header with Navigation */}
                        <div className="flex items-center justify-center text-lg font-medium mb-4">
                            <button
                                onClick={handlePrevMonth}
                                className="px-2 py-1 text-gray-500 font-bold"
                            >
                                {"<<"}
                            </button>
                            <span className="px-4">
                                {new Date(0, month).toLocaleString("default", {
                                    month: "long",
                                })}{" "}
                            </span>
                            <button
                                onClick={handleNextMonth}
                                className="px-2 py-1 text-gray-500 font-bold"
                            >
                                {">>"}
                            </button>
                        </div>

                        {/* Days in Calendar */}
                        <div className="grid grid-cols-7 gap-2 mb-6 text-center">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                <span key={day} className="font-medium">
                                    {day}
                                </span>
                            ))}
                            {Array.from({ length: new Date(year, month, 1).getDay() }).map(
                                (_, i) => (
                                    <div key={i} />
                                ) // Empty slots for days before the month's start
                            )}
                            {days.map((day) => (
                                <button
                                    key={day}
                                    onClick={() => handleDateSelection(day)} // Select and confirm instantly
                                    className={`p-2 rounded-lg ${
                                        day === selectedDate.getDate() &&
                                        month === selectedDate.getMonth() &&
                                        year === selectedDate.getFullYear()
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200"
                                    }`}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>

                    </>
                )}

                {/* Cancel Button */}
                <div className="flex mt-6 justify-center">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-400 text-white font-medium rounded-lg"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DateModal;