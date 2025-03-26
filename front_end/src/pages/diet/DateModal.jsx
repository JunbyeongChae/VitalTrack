/* 식단관리 페이지 우측 상단 일자를 클릭하면 날짜를 선택할 수 있는 모달이 표시됨 */

import React, { useState, useEffect } from "react";

const DateModal = ({ isOpen, selectedDate, onClose, onDateChange }) => {
    const [year, setYear] = useState(selectedDate.getFullYear());
    const [month, setMonth] = useState(selectedDate.getMonth());
    const [days, setDays] = useState([]); // Days in the selected month
    const [viewMode, setViewMode] = useState("month"); // 'month' or 'day'

    // 해당 월의 날짜를 표시
    const generateDays = (month, year) => {
        const daysInMonth = new Date(year, month + 1, 0).getDate(); // Number of days in the month
        return Array.from({ length: daysInMonth }, (_, i) => i + 1); // [1, 2, ..., daysInMonth]
    };

    // 일자를 선택하면 그에 따라 연, 월이 설정됨
    useEffect(() => {
        setDays(generateDays(month, year));
    }, [month, year]);

    // 월 선택기
    const handlePrevMonth = () => {
        if (month === 0) {
            // 현재가 1월이면 돌아가기 버튼을 눌렀을 때 작년 12월이 표시됨
            setMonth(11);
            setYear((prevYear) => prevYear - 1);
        } else {
            setMonth((prevMonth) => prevMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (month === 11) {
            // 현재가 12월이면 앞으로 가기 버튼을 눌렀을 때 다음년도 1월이 표시됨
            setMonth(0);
            setYear((prevYear) => prevYear + 1);
        } else {
            setMonth((prevMonth) => prevMonth + 1);
        }
    };

    // 일자를 클릭했을 때의 이벤트
    const handleDateSelection = (day) => {
        // 일자 클릭시 날짜와 시간대가 지정됨
        const newDate = new Date(year, month, day, 12, 0, 0);
        onDateChange(newDate);
        onClose();
    };

    // 월별 보기로 넘어가는 기능
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

                {/* 월별 보기  */}
                {viewMode === "month" && (
                    <div className="grid grid-cols-3 gap-2 mb-6">
                        {Array.from({ length: 12 }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setMonth(i);
                                    setViewMode("day");
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

                {/* 일별 보기 */}
                {viewMode === "day" && (
                    <>
                        {/* 월, 연도 선택시 헤더부분 */}
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

                        {/* 캘린더 안 일자선택부분 */}
                        <div className="grid grid-cols-7 gap-2 mb-6 text-center">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                <span key={day} className="font-medium">
                                    {day}
                                </span>
                            ))}
                            {Array.from({ length: new Date(year, month, 1).getDay() }).map(
                                (_, i) => (
                                    <div key={i} />
                                )
                            )}
                            {days.map((day) => (
                                <button
                                    key={day}
                                    onClick={() => handleDateSelection(day)}
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

                {/* 취소 버튼 */}
                <div className="flex mt-6 justify-center">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-400 text-white font-medium rounded-lg"
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DateModal;