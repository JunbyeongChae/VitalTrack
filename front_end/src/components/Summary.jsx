const Summary = () => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold">Today's Summary</h2>
            <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">Calories</div>
                <div className="text-3xl font-bold text-green-500">350/1,200</div>
            </div>
            <div className="mt-4">
                <p>Protein: 25g/90g</p>
                <p>Carbs: 45g/150g</p>
                <p>Fat: 15g/40g</p>
            </div>
            <div className="mt-4">
                <p>Water Intake: 4/8 glasses</p>
                <button className="bg-blue-500 text-white px-3 py-2 rounded mt-2">+ Add Water</button>
            </div>
        </div>
    );
};

export default Summary;
