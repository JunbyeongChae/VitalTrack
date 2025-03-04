import Button from "../../styles/FormStyles";

const Header = () => {
    return (
        <nav className="flex justify-between items-center p-4 bg-gray-900 text-white">
            <div className="text-xl font-bold"></div>
            <div className="text-gray-400">
                Daily Goal: <span className="text-white">1,200</span> Remaining: <span className="text-white">850</span>
            </div>
            <Button className="bg-blue-500 px-4 py-2">+ Add Food</Button>
        </nav>
    );
};

export default Header;
