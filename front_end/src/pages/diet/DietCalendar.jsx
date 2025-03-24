import React, { useState, useEffect } from "react";
import DateExplorer from "../diet/DateExplorer";

const DietCalendar = () => {
    // Initialize selectedDate from localStorage or default to today's date
    const [selectedDate, setSelectedDate] = useState(() => {
        const storedDate = localStorage.getItem("selectedDate");
        return storedDate ? new Date(storedDate) : new Date(); // Default to today if no stored date
    });

    // Helper function to format date to DB-compatible format
    const formatDateToDB = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Zero-padded month
        const day = String(date.getDate()).padStart(2, "0"); // Zero-padded day
        const hours = String(date.getHours()).padStart(2, "0"); // Zero-padded hours
        const minutes = String(date.getMinutes()).padStart(2, "0"); // Zero-padded minutes
        const seconds = String(date.getSeconds()).padStart(2, "0"); // Zero-padded seconds
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    // Update localStorage and dispatch custom event when selectedDate changes
    useEffect(() => {
        const formattedDate = formatDateToDB(selectedDate); // Convert to DB-compatible format
        localStorage.setItem("selectedDate", formattedDate);

        // Dispatch the custom event to notify Meals component
        window.dispatchEvent(new CustomEvent("selectedDateChanged"));

        console.log("Date updated and event dispatched:", formattedDate);
    }, [selectedDate]);

    // Function to fetch data for the formatted selectedDate
    useEffect(() => {
        const fetchDatasetForDate = async () => {
            const formattedDate = formatDateToDB(selectedDate); // Format date for database
            console.log("Fetching data for:", formattedDate);

            // Example: Fetch data from the database
            // const response = await fetch(`/api/data?date=${formattedDate}`);
            // const data = await response.json();
            // console.log("Data for selectedDate:", data);
        };

        fetchDatasetForDate();
    }, [selectedDate]);

    // Handle Today Button Click
    const handleTodayClick = () => {
        const today = new Date(); // Get today's date
        setSelectedDate(today); // Update the selected date
        // No need to dispatch event here as it will be handled in the useEffect
    };

    // Handle date change from DateExplorer
    const handleDateChange = (newDate) => {
        setSelectedDate(newDate);
        // No need to dispatch event here as it will be handled in the useEffect
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">날짜 선택</h3>
                <button
                    onClick={handleTodayClick}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
                >
                    TODAY
                </button>
            </div>
            <DateExplorer
                selectedDate={selectedDate}
                onDateChange={handleDateChange} // Use our new handler function
            />
        </div>
    );
};

export default DietCalendar;