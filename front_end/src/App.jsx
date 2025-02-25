import React from 'react';
import Header from './components/include/Header';
import Footer from './components/include/Footer';
import Home from './pages/Home';
import DietManagement from "./components/diet/DietManagement";

const App = () => {
  return (
    <div className="bg-gray-50 font-[Inter]">
      <Header />
      <Home />
      <Footer />
    </div>
  );
};

export default App;
