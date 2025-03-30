import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { toast } from 'react-toastify';

const Header = ({ user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(user); // 즉시 UI 반영을 위해 별도 상태 관리
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // 모바일 메뉴 상태
  const [timeLeft, setTimeLeft] = useState(null); // 세션 남은 시간 상태 추가
  const [hasWarned, setHasWarned] = useState(false); // 세션 만료 경고 상태

  // 네비게이션 클릭 핸들러
  const handleNavClick = (path) => {
    // 로그인 없이 접근 가능한 경로 예외 처리
    const publicRoutes = ['/', '/login', '/signup'];
    if (!user && !publicRoutes.includes(path)) {
      toast.error('로그인이 필요합니다.', { position: 'top-center' });
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  // 새로고침해도 로그인 상태 유지
  useEffect(() => {
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setCurrentUser(parsedUser);
        } catch (error) {
          console.error('Stored user data is invalid:', error);
          setCurrentUser(null);
          localStorage.removeItem('user'); // 유효하지 않은 데이터 제거
        }
      } else {
        setCurrentUser(null);
      }
    }
  }, [user]); // user 값이 변경될 때마다 실행

  // ✅ 연장 버튼 핸들러
  const handleExtendSession = () => {
    const expiresAt = Number(localStorage.getItem('expiresAt'));
    if (!expiresAt || Date.now() > expiresAt) {
      toast.warn('세션이 이미 만료되었습니다. 다시 로그인해주세요.');
      return;
    }

    const newExpires = Date.now() + 1000 * 60 * 60;
    localStorage.setItem('expiresAt', newExpires.toString());
    toast.success('세션이 1시간 연장되었습니다.');
    setHasWarned(false);
  };

  // 로그아웃 처리
  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('expiresAt');
    setUser(null);
    setCurrentUser(null);
    toast.info('로그아웃하였습니다.');
    navigate('/');
  };

  // ✅ 세션 남은 시간 표시 및 만료 감시
  useEffect(() => {
    const interval = setInterval(() => {
      const expiresAt = localStorage.getItem('expiresAt');
      if (expiresAt) {
        const remainingMs = Number(expiresAt) - Date.now();
        if (remainingMs > 0) {
          const minutes = Math.floor(remainingMs / 60000);
          const seconds = Math.floor((remainingMs % 60000) / 1000);
          setTimeLeft(`세션 남은 시간: ${minutes}:${seconds.toString().padStart(2, '0')}`);

          if (remainingMs <= 60_000 && !hasWarned) {
            setHasWarned(true);
            toast.info(
              <div>
                <p className="mb-1 font-bold text-lg">세션이 곧 만료됩니다.</p>
                <button onClick={handleExtendSession} className="ml-2 px-2 py-1 bg-green-500 text-white rounded">
                  연장
                </button>
                <button onClick={handleLogout} className="ml-2 px-2 py-1 bg-red-500 text-white rounded">
                  로그아웃
                </button>
              </div>,
              { autoClose: false }
            );
          }
        } else {
          toast.dismiss(); // ✅ 경고 알림 닫기
          handleLogout(); // ✅ 세션이 실제로 만료되었을 때 자동 로그아웃
        }
      } else {
        setTimeLeft(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [hasWarned]);

  // 페이지 이동 시 세션 만료 상태를 UI에 반영
  useEffect(() => {
    const expiresAt = localStorage.getItem('expiresAt');
    const storedUser = localStorage.getItem('user');
    const isExpired = expiresAt && Date.now() > Number(expiresAt);
    const hasUser = !!storedUser;

    if (isExpired) {
      // 세션이 만료된 경우에만 알림
      toast.error('세션이 만료되어 로그아웃되었습니다.');
      console.log('Header.jsx: useEffect() - 세션 만료 처리');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('expiresAt');
      setUser(null);
      setCurrentUser(null);
    } else if (!hasUser) {
      // 유저 정보가 없으면 상태 초기화 (알림 없음)
      setUser(null);
      setCurrentUser(null);
    }
  }, [location.pathname, setUser]);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-md w-full">
      <div className="w-full flex justify-between items-center h-20 px-4 md:px-8">
        {' '}
        {/* ✅ 좌우 여백 추가 */}
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
        {/* 오른쪽: 로그인 상태에 따른 버튼 UI 변경 */}
        <div className="hidden md:flex items-center space-x-4">
          {currentUser && timeLeft && <span className="text-sm text-gray-500">{timeLeft}</span>}
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
              <button onClick={() => handleNavClick('/mypage')} className="text-sm sm:text-base md:text-lg font-medium text-gray-700 hover:text-indigo-600 transition">
                {currentUser.memNick}님
              </button>
              <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition">
                로그아웃
              </button>
            </>
          )}
        </div>
        {/* 모바일: 햄버거 버튼 */}
        <div className="md:hidden flex items-center ml-auto">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700 focus:outline-none text-3xl">
            {isMobileMenuOpen ? <>&times;</> : <>&#9776;</>}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 (햄버거 내부) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-md w-full px-4">
          <div className="flex flex-col items-start space-y-3 p-4 w-full">
            {['/', '/healthInfo', '/workout', '/diet', '/adivsor'].map((path, idx) => (
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
                <button
                  onClick={() => {
                    handleNavClick('/mypage');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-sm sm:text-base md:text-lg font-medium text-gray-700 hover:text-indigo-600 transition">
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
