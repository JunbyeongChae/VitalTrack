/* 임시로 숨김처리된 컴포넌트 (우측 사이드바) */

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
                <h2 className="text-xl font-bold text-gray-800">커뮤니티</h2>

                {/* Daily Challenge Section */}
                <div className="mt-10">
                    <h3 className="text-lg font-semibold text-gray-700">다이어트 상담</h3>
                    <div className="mt-4 space-y-4">
                        {/* Success Story 1 */}
                        <div className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm">
                            <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"></div>
                            <div className="ml-4">
                                <p className="text-gray-800 font-medium">
                                    세 달 만에 8kg 감량했어요!
                                </p>
                                <p className="text-sm text-gray-500">2시간 전</p>
                            </div>
                        </div>

                        {/* Success Stories Section */}
                        <div className="mt-10">
                            <h3 className="text-lg font-semibold text-gray-700">다이어트 성공기</h3>
                            <div className="mt-4 space-y-4">
                                {/* Success Story 1 */}
                                <div className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm">
                                    <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"></div>
                                    <div className="ml-4">
                                        <p className="text-gray-800 font-medium">
                                            세 달 만에 8kg 감량했어요!
                                        </p>
                                        <p className="text-sm text-gray-500">2시간 전</p>
                                    </div>
                                </div>

                                {/* Success Story 2 */}
                                <div className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm">
                                    <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"></div>
                                    <div className="ml-4">
                                        <p className="text-gray-800 font-medium">
                                            다이어트 목표 달성!
                                        </p>
                                        <p className="text-sm text-gray-500">5시간 전</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Root;