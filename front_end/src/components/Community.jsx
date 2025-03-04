const Community = () => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold">Community</h2>
            <p className="mt-2">Daily Challenge</p>
            <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "60%" }}></div>
            </div>
            <h3 className="mt-4">Success Stories</h3>
            <p className="text-sm mt-2">Sarah lost 15 lbs in 3 months</p>
            <p className="text-sm mt-2">John reached his goal weight</p>
        </div>
    );
};

export default Community;
