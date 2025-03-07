import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSearch, faAppleAlt, faCarrot, faDrumstickBite, faBreadSlice } from "@fortawesome/free-solid-svg-icons";

// Utility to normalize search text for better searching
const normalizeText = (text) => {
    return text ? text.normalize("NFC").toLowerCase() : "";
};

const AddMealModal = ({ isOpen, onClose, onAddMeal }) => {
    const [searchQuery, setSearchQuery] = useState(""); // Current search query
    const [searchResults, setSearchResults] = useState([]); // Fetched search results
    const [isLoading, setIsLoading] = useState(false); // Loading indicator
    const [recentSearches, setRecentSearches] = useState([
        "Greek Yogurt",
        "Banana",
        "Chicken Breast",
    ]); // Recent searches
    const [isComposing, setIsComposing] = useState(false); // Track IME composition for Korean input

    const popularCategories = [
        { name: "과일", icon: faAppleAlt },
        { name: "채소", icon: faCarrot },
        { name: "단백질", icon: faDrumstickBite },
        { name: "곡류", icon: faBreadSlice },
    ];

    // Fetch search results when the searchQuery changes
    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!searchQuery) return;
            setIsLoading(true);

            try {
                const response = await axios.get("http://localhost:8000/api/foods/search", {
                    params: { query: searchQuery },
                });

                setSearchResults(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                setSearchResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSearchResults();
    }, [searchQuery]);

    // Handle input changes
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value); // Update the query directly
    };

    // Handle IME composition start (Korean input starts)
    const handleCompositionStart = () => {
        setIsComposing(true);
    };

    // Handle IME composition end (Korean composition finished)
    const handleCompositionEnd = (e) => {
        setIsComposing(false); // End composition
        setSearchQuery(e.target.value); // Finalize the composed text
    };

    if (!isOpen) return null; // Return null if modal is closed

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-[640px] max-h-[90vh] overflow-hidden shadow-lg">
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">식단 추가</h2>
                        <button className="text-gray-400 hover:text-gray-500" onClick={onClose}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                    <div className="mt-4 relative">
                        <input
                            type="text"
                            placeholder="여기에 식품명을 입력하세요..."
                            value={searchQuery}
                            onChange={handleSearchChange} // Typing handler
                            onCompositionStart={handleCompositionStart} // IME handler start
                            onCompositionEnd={handleCompositionEnd} // IME handler end
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-custom focus:border-custom"
                        />
                        <FontAwesomeIcon
                            icon={faSearch}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                    </div>
                </div>
                {/* Modal Body */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                    {/* Recent Searches */}
                    <div className="mb-8">
                        <h3 className="text-sm font-medium text-gray-500 mb-3">최근 검색기록</h3>
                        <div className="flex flex-wrap gap-2">
                            {recentSearches.map((search, index) => (
                                <button
                                    key={index}
                                    className="rounded-button px-3 py-1.5 bg-gray-100 text-gray-700 text-sm hover:bg-gray-200"
                                    onClick={() => setSearchQuery(search)} // Clicking fills the input
                                >
                                    {search}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Popular Categories */}
                    <div className="p-6">
                        <h3 className="text-sm font-medium text-gray-500 mb-3">인기 카테고리</h3>
                        <div className="grid grid-cols-4 gap-4">
                            {popularCategories.map((category, index) => (
                                <button
                                    key={index}
                                    className="rounded-button p-4 bg-gray-50 hover:bg-gray-100 text-center"
                                >
                                    <FontAwesomeIcon
                                        icon={category.icon}
                                        className="text-custom text-xl mb-2"
                                    />
                                    <div className="text-sm text-gray-700">{category.name}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Search Results */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-gray-500 mb-3">검색 결과</h3>
                        {isLoading ? (
                            <div className="text-sm text-gray-500">검색 중...</div>
                        ) : searchResults.length > 0 ? (
                            searchResults.map((result) => (
                                <div
                                    key={result["식품코드"]}
                                    className="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-50"
                                >
                                    <div>
                                        <p className="font-medium text-sm text-gray-800">{result["식품명"]}</p>
                                        <p className="text-sm text-gray-500">
                                            Calories: {result["에너지(kcal)"] || "N/A"}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => onAddMeal(result["식품명"])} // Pass the name to the add handler
                                        className="text-sm font-medium text-blue-500 hover:text-blue-700"
                                    >
                                        Add
                                    </button>
                                </div>
                            ))
                        ) : (

                            <div className="text-sm text-gray-500">검색 결과가 없습니다.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddMealModal;