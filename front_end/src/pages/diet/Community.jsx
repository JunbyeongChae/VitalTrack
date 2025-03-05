import React from 'react';

const Root = () => {
    React.useEffect(() => {
        // Initialize the code
        return () => {};
    }, []);

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            {/* Community Section */}
            <div className="bg-white p-6 rounded-xl shadow-md max-w-2xl mx-auto">
                <h2 className="text-xl font-bold text-gray-800">Community</h2>

                {/* Daily Challenge Section */}
                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-700">Daily Challenge</h3>
                    <p className="mt-2 text-gray-600">
                        Track all your meals today and earn 50 points!
                    </p>
                    <div className="w-full bg-gray-200 h-2 rounded-full mt-4">
                        <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: "60%" }} // Adjust progress percentage here
                        ></div>
                    </div>
                    <span className="text-gray-600 text-sm mt-2 block text-right">3/5</span>
                </div>

                {/* Success Stories Section */}
                <div className="mt-10">
                    <h3 className="text-lg font-semibold text-gray-700">Success Stories</h3>
                    <div className="mt-4 space-y-4">
                        {/* Success Story 1 */}
                        <div className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm">
                            <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"></div>
                            <div className="ml-4">
                                <p className="text-gray-800 font-medium">
                                    Sarah lost 15 lbs in 3 months
                                </p>
                                <p className="text-sm text-gray-500">2 hours ago</p>
                            </div>
                        </div>
                        {/* Success Story 2 */}
                        <div className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm">
                            <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"></div>
                            <div className="ml-4">
                                <p className="text-gray-800 font-medium">
                                    John reached his goal weight
                                </p>
                                <p className="text-sm text-gray-500">5 hours ago</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Root;