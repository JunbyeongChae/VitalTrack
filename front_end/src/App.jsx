import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/include/Header";
import Footer from "./components/include/Footer";
import Home from "./pages/Home";
import Dashboard from "./components/Dashboard";

const App = () => {
    return (
        <Router> {/* ✅ Wrap everything inside <Router> */}
            <div className="bg-gray-50 font-[Inter] min-h-screen flex flex-col">
                <Header /> {/* ✅ Header appears on all pages */}
                <div className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/nutrition" element={<Dashboard />} />
                    </Routes>
                </div>
                <Footer /> {/* ✅ Footer appears on all pages */}
            </div>
        </Router>
    );
};

export default App;
