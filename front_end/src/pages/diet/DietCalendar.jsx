// src/pages/diet/DietCalendar.jsx
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import calendar styles
import { useNavigate } from "react-router-dom";

const DietCalendar = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const navigate = useNavigate();

    // Function to handle date click and navigate to diet page
    const handleDateChange = (date) => {
        setSelectedDate(date);

        // Format date to pass as a parameter (e.g., yyyy-mm-dd)
        const formattedDate = date.toISOString().split("T")[0];

        // Navigate to the diet page with the selected date
        navigate(`/diet?date=${formattedDate}`);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-4">일자별 보기</h3>
            <Calendar
                onChange={handleDateChange}
                value={selectedDate}
            />
        </div>
    );
};

export default DietCalendar;