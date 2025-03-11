import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/include/Header';
import Footer from './components/include/Footer';
import Home from './pages/Home';
import Dashboard from './pages/diet/Dashboard';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import CounselList from './pages/counsel/CounselList';
import CounselDBWrite from './pages/counsel/CounselDBWrite';
import WorkoutPage from "./pages/WorkoutPage";

const App = () => {
  const [user, setUser] = useState(null); // 로그인 상태 관리

  // 새로고침해도 로그인 상태 유지 (localStorage 활용)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="bg-gray-50 font-[Inter]">
      <Header />
      <Home />
      <Footer />
    </div>
  );
};

export default App;
