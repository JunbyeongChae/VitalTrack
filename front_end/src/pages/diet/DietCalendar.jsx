import React, { useState, useEffect } from "react";
import DateExplorer from "../diet/DateExplorer";

const DietCalendar = () => {
    // 항상 오늘 날짜로 초기화
    const [selectedDate, setSelectedDate] = useState(new Date());

    // DB에 호환되는 형식으로 일자를 출력함
    const formatDateToDB = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    // 변환된 일자를 localStorage에 저장
    useEffect(() => {
        const formattedDate = formatDateToDB(selectedDate);
        localStorage.setItem("selectedDate", formattedDate);

        // 일자 변경시 localStorage의 값도 변경됨
        const dateChangeEvent = new CustomEvent("selectedDateChanged", {
            detail: {
                date: formattedDate,
                source: 'useEffect',
                timestamp: new Date().getTime()
            }
        });

        // 모든 컴포넌트에 변경된 일자를 전달함
        window.dispatchEvent(dateChangeEvent);

        console.log("일자 변경 및 이벤트 전달", formattedDate);
    }, [selectedDate]);


    // 변환된 선택일자를 기준으로 DB에서 데이터를 불러옴
    useEffect(() => {
        const fetchDatasetForDate = async () => {
            const formattedDate = formatDateToDB(selectedDate);
            console.log("Fetching data for:", formattedDate);
        };

        fetchDatasetForDate();
    }, [selectedDate]);

    // TODAY버튼을 클릭할 때의 동작
    const handleTodayClick = () => {
        const today = new Date();
        setSelectedDate(today);
    };

    // 달력 모달에서 다른 날짜를 클릭할 때의 동작 (날짜 변경처리)
    const handleDateChange = (newDate) => {
        setSelectedDate(newDate);

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