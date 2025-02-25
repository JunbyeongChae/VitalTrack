import React from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-4 shadow-md rounded-lg">
                <h1 className="text-xl font-bold">Today's Summary</h1>
                <Button className="bg-black text-white">+ Add Food</Button>
            </div>

            {/* Summary Section */}
            <div className="grid grid-cols-3 gap-6 mt-4">
                <Card className="col-span-2 p-4">
                    <h2 className="text-lg font-semibold">Macronutrients</h2>
                    <div className="space-y-2 mt-2">
                        <div>Protein: 25g/90g</div>
                        <Progress value={25} max={90} />
                        <div>Carbs: 45g/150g</div>
                        <Progress value={45} max={150} />
                        <div>Fat: 15g/40g</div>
                        <Progress value={15} max={40} />
                    </div>
                    <div className="mt-4">
                        <h2 className="text-lg font-semibold">Water Intake</h2>
                        <Progress value={4} max={8} />
                        <Button className="mt-2 bg-blue-500 text-white">+ Add Water</Button>
                    </div>
                </Card>

                <Card className="p-4">
                    <h2 className="text-lg font-semibold">Quick Add</h2>
                    <Button className="w-full mt-2 bg-gray-200">Search Foods</Button>
                    <Button className="w-full mt-2 bg-gray-200">Recent Meals</Button>
                    <Button className="w-full mt-2 bg-gray-200">Create Custom Meal</Button>
                </Card>
            </div>

            {/* Meals Today */}
            <div className="mt-6 grid grid-cols-4 gap-4">
                {["Breakfast", "Lunch", "Dinner", "Snacks"].map((meal) => (
                    <Card key={meal} className="p-4">
                        <h2 className="text-lg font-semibold">{meal}</h2>
                        <Button className="mt-2 bg-gray-200">+ Add to {meal}</Button>
                    </Card>
                ))}
            </div>

            {/* Food Diary */}
            <div className="mt-6 p-4 bg-white shadow-md rounded-lg">
                <h2 className="text-lg font-semibold">Food Diary</h2>
                <ul className="mt-2 space-y-2">
                    {["Oatmeal with Berries", "Orange Juice", "Chicken Salad"].map((food, index) => (
                        <li key={index} className="flex justify-between">
                            <span>{food}</span>
                            <span>100 cal</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Community Section */}
            <div className="mt-6 grid grid-cols-2 gap-4">
                <Card className="p-4">
                    <h2 className="text-lg font-semibold">Daily Challenge</h2>
                    <Progress value={3} max={5} />
                </Card>
                <Card className="p-4">
                    <h2 className="text-lg font-semibold">Success Stories</h2>
                    <p>Sarah lost 15 lbs in 3 months</p>
                    <p>John reached his goal weight</p>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
