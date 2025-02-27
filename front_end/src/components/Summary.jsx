const Summary = () => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold">Today's Summary</h2>

            {/* 칼로리, 영양섭취량, 물 섭취량을 옆으로 나란히 배치 */}
            <div className="flex justify-between items-start gap-4 mt-4">
                {/* 칼로리 */}
                <div className="text-2xl font-bold w-1/3">
                    <div>칼로리</div>
                    <span className="text-3xl font-bold text-green-500">350/1,200</span>
                </div>
                {/* 영양섭취량 */}
                <div className="text-2xl font-bold w-1/3">
                    <div>영양섭취량</div>
                    <ul className="text-lg">
                        <li>Protein: 25g/90g</li>
                        <li>Carbs: 45g/150g</li>
                        <li>Fat: 15g/40g</li>
                    </ul>
                </div>
                {/* 물 섭취량 */}
                <div className="text-2xl font-bold w-1/3">
                    <div>물 섭취량</div>
                    <ul className="text-lg">
                        <li>4/8 glasses</li>
                        <li>
                            <button className="bg-blue-500 text-white px-3 py-2 rounded mt-2">
                                + Add Water
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Summary;