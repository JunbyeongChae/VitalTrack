const Meals = () => {
    const meals = [
        { name: "Breakfast", items: ["Oatmeal with Berries", "Orange Juice"], calories: 250 },
        { name: "Lunch", items: ["Chicken Salad"], calories: 100 },
        { name: "Dinner", items: [], calories: 0 },
        { name: "Snacks", items: [], calories: 0 },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {meals.map((meal, index) => (
                <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md">
                    <h3 className="font-semibold">{meal.name} ({meal.calories} cal)</h3>
                    <ul className="mt-2">
                        {meal.items.map((item, i) => (
                            <li key={i} className="text-sm">{item}</li>
                        ))}
                    </ul>
                    <button className="mt-2 text-blue-500">+ Add to {meal.name}</button>
                </div>
            ))}
        </div>
    );
};

export default Meals;
