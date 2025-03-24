import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { toast } from 'react-toastify';

const Header = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(user); // 즉시 UI 반영을 위해 별도 상태 관리
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // 모바일 메뉴 상태
  const [timeLeft, setTimeLeft] = useState(null); // 세션 남은 시간 상태 추가

  // 네비게이션 클릭 핸들러
  const handleNavClick = (path) => {
    if (!user) {
      toast.error('로그인이 필요합니다.', { position: 'top-center' });
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  // 새로고침해도 로그인 상태 유지
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'undefined') {
        setCurrentUser(JSON.parse(storedUser));
      } else {
        setCurrentUser(null);
      }
    } catch (e) {
      console.error('localStorage user 파싱 실패:', e);
      setCurrentUser(null);
    }
  }, [user]); // user 값이 변경될 때마다 실행

  // 세션 만료까지 남은 시간 1초마다 업데이트
  useEffect(() => {
    const updateRemainingTime = () => {
      const expiresAt = localStorage.getItem('expiresAt');
      if (expiresAt) {
        const remainingMs = Number(expiresAt) - Date.now();
        if (remainingMs > 0) {
          const minutes = Math.floor(remainingMs / 60000);
          const seconds = Math.floor((remainingMs % 60000) / 1000);
          setTimeLeft(`세션 남은 시간: ${minutes}:${seconds.toString().padStart(2, '0')}`);
        } else {
          setTimeLeft(null);
        }
      }
    };
    updateRemainingTime();
    const interval = setInterval(updateRemainingTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
      setUser(null);
      setCurrentUser(null); // UI 즉시 반영
      toast.success('로그아웃하였습니다.');
      navigate('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-md w-full">
      <div className="w-full flex justify-between items-center h-20 px-4 md:px-8"> {/* ✅ 좌우 여백 추가 */}
        {/* 왼쪽: 로고 & 네비게이션 */}
        <div className="flex items-center space-x-8">
          {/* 로고 클릭 시 홈으로 이동 */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
            <img className="h-14 w-auto sm:h-16" src="/images/logo_title.png" alt="Logo" />
          </div>
          {/* 네비게이션 메뉴 */}
          <div className="hidden md:flex space-x-6">
            <button onClick={() => navigate('/')} className="text-lg font-semibold text-gray-600 hover:text-indigo-600 transition">
              Home
            </button>
            <button onClick={() => handleNavClick('/healthInfo')} className="text-lg font-semibold text-gray-600 hover:text-indigo-600 transition">
              건강정보
            </button>
            <button onClick={() => handleNavClick('/workout')} className="text-lg font-semibold text-gray-600 hover:text-indigo-600 transition">
              운동관리
            </button>
            <button onClick={() => handleNavClick('/diet')} className="text-lg font-semibold text-gray-600 hover:text-indigo-600 transition">
              식단관리
            </button>
            <button onClick={() => handleNavClick('/adivsor')} className="text-lg font-semibold text-gray-600 hover:text-indigo-600 transition">
              영양상담
            </button>
          </div>
        </div>

        {/* 모바일 햄버거 메뉴 버튼 */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700 focus:outline-none text-3xl">
            {isMobileMenuOpen ? <>&times;</> : <>&#9776;</>}
          </button>
        </div>

        {/* 오른쪽: 로그인 상태에 따른 버튼 UI 변경 */}
        <div className="flex items-center space-x-4">
          {!currentUser ? (
            <>
              <button onClick={() => navigate('/login')} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition">
                로그인
              </button>
              <button onClick={() => navigate('/signup')} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition">
                회원가입
              </button>
            </>
          ) : (
            <>
                {/* 닉네임 앞에 남은 시간 표시 */}
                {timeLeft && <span className="text-sm text-gray-500 mr-3">({timeLeft})</span>}
              <button onClick={() => handleNavClick('/mypage')} className="text-sm sm:text-base md:text-lg font-medium text-gray-700 hover:text-indigo-600 transition">
                  {currentUser.memNick}님
                </button>
              <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition">
                로그아웃
              </button>
            </>
          )}
        </div>
      </div>

      {/* ✅ 모바일 메뉴 (좌우 여백 추가) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-md w-full px-4">
          <div className="flex flex-col items-start space-y-3 p-4 w-full">
            {['/', '/healthInfo', '/workout', '/diet', '/counsel'].map((path, idx) => (
              <button
                key={idx}
                onClick={() => {
                  handleNavClick(path);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left text-base sm:text-lg font-semibold text-gray-600 hover:text-indigo-600 transition">
                {['Home', '건강정보', '운동관리', '식단관리', '영양상담'][idx]}
              </button>
            ))}
            {!currentUser ? (
              <>
                <button
                  onClick={() => {
                    handleNavClick('/login');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left text-sm sm:text-base text-gray-700 border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-700 hover:text-white transition">
                  로그인
                </button>
                <button
                  onClick={() => {
                    handleNavClick('/signup');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left text-sm sm:text-base text-white bg-indigo-600 hover:bg-indigo-700 rounded-md px-4 py-2 transition">
                  회원가입
                </button>
              </>
            ) : (
              <>
                <button onClick={() => handleNavClick('/mypage')} className="text-sm sm:text-base md:text-lg font-medium text-gray-700 hover:text-indigo-600 transition">
                  {currentUser.memNick}님
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left text-sm sm:text-base text-white bg-indigo-600 hover:bg-indigo-700 rounded-md px-4 py-2 transition">
                  로그아웃
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
);

};

export default Header;
