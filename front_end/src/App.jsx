import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/include/Header';
import Footer from './components/include/Footer';
import Home from './pages/Home';
import UserHome from './pages/UserHome';
import Dashboard from './pages/diet/Dashboard';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import CounselList from './pages/counsel/CounselList';
import Mypage from './pages/auth/Mypage';
import WorkoutPage from './pages/WorkoutPage';
import 'react-toastify/dist/ReactToastify.css'; // Toastify CSS
import { ToastContainer } from 'react-toastify';
import CounselWrite from './pages/counsel/CounselWrite';
import CounselDetail from './pages/counsel/CounselDetail';
import CounselUpdate from './pages/counsel/CounselUpdate';
import CounselAdvisor from './pages/counsel/CounselAdvisor';
import InfoBoardList from './pages/infoboard/InfoBoardList';
import InfoBoardWrite from './pages/infoboard/InfoBoardWrite';
import InfoBoardUpdate from './pages/infoboard/InfoBoardUpdate';
import InfoBoardDetail from './pages/infoboard/InfoBoardDetail';

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
      <ToastContainer position="top-left" theme="colored" autoClose={3000} hideProgressBar closeOnClick pauseOnFocusLoss={false} pauseOnHover style={{ zIndex: 9999 }} />
      <Header user={user} setUser={setUser} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={user ? <UserHome user={user} /> : <Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route path="/mypage" element={<Mypage user={user} setUser={setUser} />} />
          <Route path="/counseladivsor" element={<CounselAdvisor />} />
          <Route path="/counsel" element={<CounselList />} />
          <Route path="/counsel/write" element={<CounselWrite />} />
          <Route path="/counsel/:counselNo" element={<CounselDetail />} />
          <Route path="/counsel/update/:counselNo" element={<CounselUpdate />} />
          <Route path="/healthInfo" element={<InfoBoardList />} />
          <Route path="/healthInfo/write" element={<InfoBoardWrite />} />
          <Route path="/healthInfo/:id" element={<InfoBoardDetail />} />
          <Route path="/healthInfo/update/:id" element={<InfoBoardUpdate />} />
          <Route path="/nutrition" element={<Dashboard />} />
          <Route path="/workout" exact={true} element={<WorkoutPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;
