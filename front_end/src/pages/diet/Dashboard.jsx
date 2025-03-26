/* 식단관리 페이지 렌더링을 위한 최상위 컴포넌트 */

import React from "react";
import Meals from "./Meals";
import Summary from "./Summary";
import FoodDiary from "./FoodDiary";
import Community from "./Community";
import QuickAdd from "./QuickAdd";
import DietCalendar from "./DietCalendar"; // Import the calendar component

const Dashboard = () => {
    return (
        <div className="flex flex-col lg:flex-row gap-6 px-6 py-8">

            {/* Main Content Section */}
            <div className="w-full lg:w-3/4 grid grid-cols-1 gap-6">
                {/* Today's Summary */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <Summary />
                </div>

                {/* Meals Today */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <Meals />
                </div>

                {/* Food Diary */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <FoodDiary />
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-full lg:w-1/4 flex flex-col gap-6">
                {/* Diet Calendar */}
                <DietCalendar />
                {/*
                // Quick Add Section - Temporarily removed
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <QuickAdd />
                </div>

                // Community Section - Temporarily removed
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <Community />
                </div>
                */}

            </div>
        </div>
    );
};

export default Dashboard;