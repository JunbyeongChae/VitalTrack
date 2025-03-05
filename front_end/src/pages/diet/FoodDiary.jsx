const DiaryEntry = ({ title, time, calories, protein, carbs, fat }) => {
    return (
        <div className="flex justify-between items-center p-4">
            {/* Left Section: Food details */}
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div>
                    <div className="text-sm font-semibold">{title}</div>
                    <div className="text-xs text-gray-500">{time}</div>
                </div>
            </div>

            {/* Right Section: Nutrition details */}
            <div className="flex flex-col items-end">
                <div className="text-sm font-semibold">{calories} cal</div>
                <div className="flex text-xs text-gray-500 gap-3">
                    <span>단: {protein}g</span>
                    <span>탄: {carbs}g</span>
                    <span>지: {fat}g</span>
                </div>
            </div>
        </div>
    );
};

const FoodDiary = () => {
    const diaryEntries = [
        {
            title: 'Oatmeal with Berries',
            time: '8:00 AM - Breakfast',
            calories: 180,
            protein: 6,
            carbs: 30,
            fat: 3,
        },
        {
            title: 'Orange Juice',
            time: '8:15 AM - Breakfast',
            calories: 70,
            protein: 1,
            carbs: 17,
            fat: 0,
        },
        {
            title: 'Chicken Salad',
            time: '12:30 PM - Lunch',
            calories: 100,
            protein: 15,
            carbs: 5,
            fat: 3,
        },
    ];

    return (
        <div className="bg-white p-6 rounded-xl shadow-md w-full flex flex-col gap-4 h-auto">
            {/* Title */}
            <h2 className="text-lg font-semibold">식단 기록</h2>

            {/* Diary Entry List */}
            <div className="flex flex-col divide-y divide-gray-200">
                {diaryEntries.map((entry, index) => (
                    <DiaryEntry
                        key={index}
                        title={entry.title}
                        time={entry.time}
                        calories={entry.calories}
                        protein={entry.protein}
                        carbs={entry.carbs}
                        fat={entry.fat}
                    />
                ))}
            </div>
        </div>
    );
};

export default FoodDiary;