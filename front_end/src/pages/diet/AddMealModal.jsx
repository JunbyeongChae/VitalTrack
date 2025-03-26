/* 식단 추가 모달 */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useMeals } from '../../contexts/MealsContext'


// 한글 입력 처리를 위해 필수적인 함수
const normalizeText = (text) => {
    return text ? text.normalize("NFC").toLowerCase() : "";
};

const AddMealModal = ({ isOpen, onClose, onAddMeal, mealType }) => {
    const { refreshComponents } = useMeals(); // MealsContext에서 함수 가져오기
    const [searchQuery, setSearchQuery] = useState(""); // 검색어
    const [searchResults, setSearchResults] = useState([]); // 검색결과
    const [recentSearches, setRecentSearches] = useState([]); // 최근 검색어
    const [isLoading, setIsLoading] = useState(false); // 로딩상태 표시
    const [isComposing, setIsComposing] = useState(false); // 한글입력 IME 동작여부 확인

    const RECENT_SEARCHES_KEY = "recentSearches";

    const convertToEnumMealType = (korType) => {
      switch (korType) {
        case "아침": return "Breakfast";
        case "점심": return "Lunch";
        case "저녁": return "Dinner";
        case "간식": return "Snack";
        default: return null;
      }
    };

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
            console.warn("검색어를 입력해주세요."); // Warn about empty search
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_SPRING_IP}api/foods/search`,
                {
                    params: { query: searchQuery },
                }
            );
            setSearchResults(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    // 모달이 열리면 localStorage에 저장된 최근 검색결과를 가져옴
    useEffect(() => {
        if (isOpen) {
            const storedSearches = JSON.parse(
                localStorage.getItem(RECENT_SEARCHES_KEY)
            ) || [];
            setRecentSearches(storedSearches);
            setSearchQuery("");
            setSearchResults([]);
        }
    }, [isOpen]);

    // 엔터키를 누르면 검색기능이 작동함
    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !isComposing) {
            if (searchQuery.trim()) {
                saveToLocalStorage(searchQuery);
                fetchSearchResults(); // Fetch results
            }
        }
    };
    // 검색버튼 클릭 마우스 이벤트 감지
    const handleSearchClick = () => {
        if (searchQuery.trim()) {
            saveToLocalStorage(searchQuery);
            fetchSearchResults();
        }
    };
    // 키보드 입력상태 확인
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value); // Update the query directly
    };

    // IME 동작 시작 감지
    const handleCompositionStart = () => {
        setIsComposing(true);
    };

    // IME 동작 종료 감지
    const handleCompositionEnd = (e) => {
        setIsComposing(false); // End composition
        setSearchQuery(e.target.value); // Finalize the composed text
    };

    // 식품검색 모달이 열리면 localStorage에서 최근검색어를 로드함
    useEffect(() => {
        if (isOpen) {
            const storedSearches = JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY)) || [];
            setRecentSearches(storedSearches);
            setSearchQuery("");
            setSearchResults([]);
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
                            onChange={handleSearchChange}
                            onKeyDown={handleKeyPress}
                            onCompositionStart={handleCompositionStart}
                            onCompositionEnd={handleCompositionEnd}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-custom focus:border-custom"
                        />
                        <FontAwesomeIcon
                            icon={faSearch}
                            className="absolute left-3 text-gray-400"
                        />

                        {/* 검색 버튼 */}
                        <button
                            onClick={handleSearchClick}
                            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                        >
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </div>
                </div>

                {/* 모달 */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                    {/* 최근 검색기록 */}
                    <div className="mb-8">
                        <h3 className="text-sm font-medium text-gray-500 mb-3">최근 검색기록</h3>
                        <div className="flex flex-wrap gap-2">
                            {recentSearches.map((search, index) => (
                                <button
                                    key={index}
                                    className="rounded-button px-3 py-1.5 bg-gray-100 text-gray-700 text-sm hover:bg-gray-200"
                                    onClick={() => setSearchQuery(search)} //최근검색어를 클릭하면 검색창에 글씨가 채워짐
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
                                                carbs: result["탄수화물(g)"],
                                                protein: result["단백질(g)"],
                                                fat: result["지방(g)"]
                                            };

                                            console.log("Meal Data:", meal); // Ensure full meal object is logged

                                            onAddMeal(meal, convertToEnumMealType(mealType)); // Pass full object to onAddMeal

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