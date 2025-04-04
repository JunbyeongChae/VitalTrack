import React, { useCallback, useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/include/Header';
import Footer from './components/include/Footer';
import Home from './pages/Home';
import UserHome from './pages/UserHome';
import Dashboard from './pages/diet/Dashboard';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import CounselList from './pages/counsel/CounselList';
import Mypage from './pages/auth/Mypage';
import 'react-toastify/dist/ReactToastify.css'; // Toastify CSS
import { toast, ToastContainer } from 'react-toastify';
import CounselWrite from './pages/counsel/CounselWrite';
import CounselDetail from './pages/counsel/CounselDetail';
import CounselUpdate from './pages/counsel/CounselUpdate';
import CounselAdvisor from './pages/counsel/CounselAdvisor';
import { MealsProvider } from './contexts/MealsContext';
import InfoBoardList from './pages/infoboard/InfoBoardList';
import InfoBoardWrite from './pages/infoboard/InfoBoardWrite';
import InfoBoardUpdate from './pages/infoboard/InfoBoardUpdate';
import InfoBoardDetail from './pages/infoboard/InfoBoardDetail';
import { isSessionExpired } from './services/authLogic';
import WorkoutPage from './pages/workout/WorkoutPage';
import { ScheduleProvider } from './pages/workout/Context';

const App = () => {
  const [user, setUser] = useState(null); // 로그인 상태 관리
  const [logoutHandled, setLogoutHandled] = useState(false); // 중복 로그아웃 방지
  const navigate = useNavigate(); // 네비게이션 훅 추가

  // 새로고침해도 로그인 상태 유지 (localStorage 활용)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 공통 로그아웃 처리 함수 (중복 방지 포함)
  const performLogout = useCallback(() => {
    if (logoutHandled) return; // 중복 실행 방지
    setLogoutHandled(true); // 실행 플래그 설정
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('expiresAt');
    setUser(null);
    if (window.location.pathname !== '/login') {
      // 현재 경로가 /login이 아닐 때만 이동
      navigate('/');
    }
    toast.info('세션이 만료되어 로그아웃되었습니다.');
    console.log("App.jsx: performLogout() called"); // 로그아웃 처리 확인
  }, [logoutHandled, navigate]);

  // 세션 만료 여부 확인 (앱 진입 시)
  useEffect(() => {
    const expiresAt = localStorage.getItem('expiresAt');
    if (expiresAt && isSessionExpired()) {
      performLogout(); // 공통 함수 호출
    }
  }, [navigate, performLogout]);

  return (
    <>
      <ScheduleProvider>
        <ToastContainer position="top-left" theme="colored" autoClose={3000} hideProgressBar closeOnClick pauseOnFocusLoss={false} pauseOnHover style={{ zIndex: 9999 }} />
        <Header user={user} setUser={setUser} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={user ? <UserHome user={user} /> : <Home />} />
            <Route path="/workout" exact={true} element={<WorkoutPage />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/signup" element={<Signup setUser={setUser} />} />
            <Route path="/mypage" element={<Mypage user={user} setUser={setUser} />} />
            <Route path="/adivsor" element={<CounselAdvisor />} />
            <Route path="/counsel" element={<CounselList />} />
            <Route path="/counsel/write" element={<CounselWrite />} />
            <Route path="/counsel/:counselNo" element={<CounselDetail />} />
            <Route path="/counsel/update/:counselNo" element={<CounselUpdate />} />
            <Route path="/healthInfo" element={<InfoBoardList />} />
            <Route path="/healthInfo/write" element={<InfoBoardWrite />} />
            <Route path="/healthInfo/:infoNo" element={<InfoBoardDetail />} />
            <Route path="/healthInfo/update/:infoNo" element={<InfoBoardUpdate />} />
            <Route
              path="/diet"
              element={
                <MealsProvider>
                  <Dashboard user={user} />
                </MealsProvider>
              }
            />
          </Routes>
        </main>
        <Footer />
      </ScheduleProvider>
    </>
  );
};

export default App;
