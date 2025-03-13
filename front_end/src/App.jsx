import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/include/Header';
import Footer from './components/include/Footer';
import Home from './pages/Home';
import Dashboard from './pages/diet/Dashboard';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import CounselList from './pages/counsel/CounselList';
import Mypage from './pages/auth/Mypage';
import CounselDBWrite from './pages/counsel/CounselDBWrite';
import CounselDetail from './pages/counsel/CounselDetail';
import CounselDBUpdate from './pages/counsel/CounselDBUpdate';
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
    <>
      <Header user={user} setUser={setUser} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route path="/mypage" element={<Mypage user = {user} setUser={setUser} />} />
          <Route path="/counsel" element={<CounselList />} />
          <Route path="/counsel/write" element={<CounselDBWrite />} />
          <Route path="/counsel/:counselNo" element={<CounselDetail />} />
          <Route path="/counsel/update/:counselNo" element={<CounselDBUpdate />} />
          <Route path="/nutrition" element={<Dashboard />} />
          <Route path="/workout" exact={true} element={<WorkoutPage/>}/>
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;
