import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSearch, faAppleAlt, faCarrot, faDrumstickBite, faBreadSlice } from "@fortawesome/free-solid-svg-icons";

// Utility to normalize search text for better searching
const normalizeText = (text) => {
    return text ? text.normalize("NFC").toLowerCase() : "";
};

const AddMealModal = ({ isOpen, onClose, onAddMeal }) => {
    const [searchQuery, setSearchQuery] = useState(""); // Input query
    const [searchResults, setSearchResults] = useState([]); // Fetched results
    const [recentSearches, setRecentSearches] = useState([]); // Recently searched queries
    const [isLoading, setIsLoading] = useState(false); // Loading indicator
    const [isComposing, setIsComposing] = useState(false); // Support for IME input composition

    const RECENT_SEARCHES_KEY = "recentSearches";

    // Save search query to localStorage
    const saveToLocalStorage = (query) => {
        const existingSearches = JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY)) || [];

        // Avoid duplicates and limit to the last 5 items
        if (!existingSearches.includes(query)) {
            const updatedSearches = [query, ...existingSearches].slice(0, 5);
            localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updatedSearches));
        }
    };

    // Reset search results when modal is opened
    useEffect(() => {
        if (isOpen) {
            setSearchQuery(""); // Clear input
            setSearchResults([]); // Reset search results
        }
    }, [isOpen]);

    const fetchSearchResults = async () => {
        if (!searchQuery.trim()) {
            console.warn("Search query is empty."); // Warn about empty search
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.get(
                "http://localhost:8000/api/foods/search",
                {
                    params: { query: searchQuery },
                }
            );
            setSearchResults(response.data); // Update search results
        } catch (error) {
            console.error("Error fetching data:", error);
            setSearchResults([]);
        } finally {
            setIsLoading(false); // Stop loading indicator
        }
    };

    // Fetch recent searches from localStorage on modal open
    useEffect(() => {
        if (isOpen) {
            const storedSearches = JSON.parse(
                localStorage.getItem(RECENT_SEARCHES_KEY)
            ) || [];
            setRecentSearches(storedSearches); // Populate recent searches from storage
            setSearchQuery(""); // Clear search input
            setSearchResults([]); // Clear search results
        }
    }, [isOpen]);

    // Trigger search on pressing the "Enter" key
    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !isComposing) {
            if (searchQuery.trim()) {
                saveToLocalStorage(searchQuery); // Save recent search to localStorage
                fetchSearchResults(); // Fetch results
            }
        }
    };

    // Trigger search manually when the Search button is clicked
    const handleSearchClick = () => {
        if (searchQuery.trim()) {
            saveToLocalStorage(searchQuery); // Save recent search to localStorage
            fetchSearchResults(); // Fetch results
        }
    };
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

    // Update recent searches on modal open
    useEffect(() => {
        if (isOpen) {
            const storedSearches = JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY)) || [];
            setRecentSearches(storedSearches); // Load stored searches into state
            setSearchQuery(""); // Clear input when modal opens
            setSearchResults([]); // Clear previous results
        }
    }, [isOpen]);

    if (!isOpen) return null; // Return null if modal is closed

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-[640px] max-h-[90vh] overflow-hidden shadow-lg">
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                            식단 추가
                        </h2>
                        <button
                            className="text-gray-400 hover:text-gray-500"
                            onClick={onClose}
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                    <div className="mt-3 relative flex items-center">
                        {/* Search Input */}
                        <input
                            type="text"
                            placeholder="여기에 식품명을 입력하세요..."
                            value={searchQuery}
                            onChange={handleSearchChange} // Update input state
                            onKeyDown={handleKeyPress} // Trigger search on "Enter"
                            onCompositionStart={handleCompositionStart} // Korean IME start
                            onCompositionEnd={handleCompositionEnd} // Korean IME end
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-custom focus:border-custom"
                        />
                        <FontAwesomeIcon
                            icon={faSearch}
                            className="absolute left-3 text-gray-400"
                        />

                        {/* Search Button */}
                        <button
                            onClick={handleSearchClick} // Trigger search manually
                            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                        >
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
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
                                        onClick={() => {
                                            const meal = {
                                                name: result["식품명"],
                                                id: result["식품코드"],
                                                calories: result["에너지(kcal)"],
                                            };

                                            console.log("Meal Data:", meal); // Ensure full meal object is logged

                                            onAddMeal(meal); // Pass full object to onAddMeal
                                        }}
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