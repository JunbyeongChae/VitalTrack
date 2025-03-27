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

  // 🔄 세션 만료 및 연장 처리
  useEffect(() => {
    let warned = false;
    let extendTimeoutId = null;
    let intervalId = null;

    const checkSession = () => {
      const expiresAt = localStorage.getItem('expiresAt');
      if (!expiresAt) return;

      const remainingMs = Number(expiresAt) - Date.now();

      if (remainingMs <= 0) {
        clearInterval(intervalId);
        if (extendTimeoutId) clearTimeout(extendTimeoutId);
        toast.warn('세션이 만료되었습니다. 다시 로그인해주세요.');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('expiresAt');
        setUser(null);
        setCurrentUser(null);
        navigate('/login');
        return;
      }

      if (remainingMs <= 60000 && !warned) {
        warned = true;
        toast.info(
          ({ closeToast }) => (
            <div>
              <p>1분 후 세션이 만료됩니다.</p>
              <button
                onClick={() => {
                  const newExpiresAt = Date.now() + 1000 * 60 * 60;
                  localStorage.setItem('expiresAt', newExpiresAt.toString());
                  warned = false;
                  closeToast();
                  toast.success('세션이 1시간 연장되었습니다.');
                }}
                className="text-blue-500 hover:underline mt-2">
                세션 연장하기
              </button>
            </div>
          ),
          { autoClose: false, toastId: 'session-expire-warning' }
        );

        extendTimeoutId = setTimeout(() => {
          toast.dismiss('session-expire-warning');
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          localStorage.removeItem('expiresAt');
          setUser(null);
          setCurrentUser(null);
          navigate('/login');
        }, remainingMs);
      }

      const minutes = Math.floor(remainingMs / 60000);
      const seconds = Math.floor((remainingMs % 60000) / 1000);
      setTimeLeft(`세션 남은 시간: ${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    intervalId = setInterval(checkSession, 1000);
    return () => {
      clearInterval(intervalId);
      if (extendTimeoutId) clearTimeout(extendTimeoutId);
    };
  }, [navigate, setUser]);

  // 페이지 이동 시 세션 만료 상태를 UI에 반영
  useEffect(() => {
    const expiresAt = localStorage.getItem('expiresAt');
    const storedUser = localStorage.getItem('user');
    const isExpired = expiresAt && Date.now() > Number(expiresAt);
    const hasUser = !!storedUser;

    if (isExpired) {
      // 세션이 만료된 경우에만 알림
      toast.error('세션이 만료되어 로그아웃되었습니다.');
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

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('expiresAt');
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
        {/* 오른쪽: 데스크탑 전용 세션시간 및 버튼 */}
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
        {/* 모바일: 햄버거 메뉴 오른쪽 끝 */}
        <div className="md:hidden flex items-center ml-auto">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700 focus:outline-none text-3xl">
            {isMobileMenuOpen ? <>&times;</> : <>&#9776;</>}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 (좌우 여백 추가) */}
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
