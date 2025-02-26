import Header from "./Header";
import Summary from "./Summary";
import Meals from "./Meals";
import FoodDiary from "./FoodDiary";
import Community from "./Community";

const Dashboard = () => {
    return (
        <div className="bg-gray-100 min-h-screen">
            <Header />
            <div className="container mx-auto px-4 py-6">
                <Summary />
                <div className="mt-6">
                    <Meals />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <FoodDiary />
                    <Community />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
