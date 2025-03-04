import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSearch, faAppleAlt, faCarrot, faDrumstickBite, faBreadSlice } from "@fortawesome/free-solid-svg-icons";



const AddMealModal = ({ isOpen, onClose, onAddMeal }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const searchResults = [
        { id: 1, name: "Greek Yogurt", calories: 59, serving: "100g" },
        { id: 2, name: "Banana", calories: 105, serving: "1 medium" },
        { id: 3, name: "Chicken Breast", calories: 165, serving: "100g" },
    ];

    const recentSearches = ["Greek Yogurt", "Banana", "Chicken Breast"];
    const popularCategories = [
        { name: "Fruits", icon: faAppleAlt },
        { name: "Vegetables", icon: faCarrot },
        { name: "Proteins", icon: faDrumstickBite },
        { name: "Grains", icon: faBreadSlice },

    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-[640px] max-h-[90vh] overflow-hidden shadow-lg">
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">Quick Add Foods</h2>
                        <button className="text-gray-400 hover:text-gray-500" onClick={onClose}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                    <div className="mt-4 relative">
                        <input
                            type="text"
                            placeholder="Search for foods..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
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
                        <h3 className="text-sm font-medium text-gray-500 mb-3">Recent Searches</h3>
                        <div className="flex flex-wrap gap-2">
                            {recentSearches.map((search, index) => (
                                <button
                                    key={index}
                                    className="rounded-button px-3 py-1.5 bg-gray-100 text-gray-700 text-sm hover:bg-gray-200"
                                    onClick={() => setSearchQuery(search)}
                                >
                                    {search}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Popular Categories Section */}
                    <div className="p-6">
                        <h3 className="text-sm font-medium text-gray-500 mb-3">Popular Categories</h3>
                        <div className="grid grid-cols-4 gap-4">
                            {popularCategories.map((category, index) => (
                                <button
                                    key={index}
                                    className="rounded-button p-4 bg-gray-50 hover:bg-gray-100 text-center"
                                >
                                    <FontAwesomeIcon
                                        icon={category.icon} // Use the dynamic FontAwesome icons here
                                        className="text-custom text-xl mb-2"
                                    />
                                    <div className="text-sm text-gray-700">{category.name}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Search Results */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-gray-500 mb-3">Search Results</h3>
                        {searchResults.map((result) => (
                            <div
                                key={result.id}
                                className="bg-white border border-gray-200 rounded-lg p-4"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium text-gray-900">{result.name}</h4>
                                        <p className="text-sm text-gray-500">
                                            {result.serving} • {result.calories} calories
                                        </p>
                                    </div>
                                    <button
                                        className="rounded-button px-4 py-2 bg-custom text-black hover:bg-custom/90"
                                        onClick={() => onAddMeal(result)}
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddMealModal;