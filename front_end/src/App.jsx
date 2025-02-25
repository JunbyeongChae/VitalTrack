import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/include/Header';
import Footer from './components/include/Footer';
import Home from './pages/Home';
import CounselPage from './pages/counsel/CounselList';

const App = () => {
  return (
    <Router>
      <div className="bg-gray-50 font-[Inter]">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/counsel" element={<CounselPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;