const FoodDiary = () => {
    const diaryEntries = [
        { time: "8:00 AM", name: "Oatmeal with Berries", calories: 180 },
        { time: "8:15 AM", name: "Orange Juice", calories: 70 },
        { time: "12:30 PM", name: "Chicken Salad", calories: 100 },
    ];

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold">Food Diary</h2>
            <ul className="mt-4">
                {diaryEntries.map((entry, index) => (
                    <li key={index} className="flex justify-between border-b py-2">
                        <span>{entry.time} - {entry.name}</span>
                        <span>{entry.calories} cal</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FoodDiary;
