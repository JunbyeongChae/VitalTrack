import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Toastify CSS

const Header = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(user); // 즉시 UI 반영을 위해 별도 상태 관리

  // 새로고침해도 로그인 상태 유지
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, [user]); // user 값이 변경될 때마다 실행

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
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <ToastContainer position="top-left" theme="colored" autoClose={3000} hideProgressBar closeOnClick pauseOnFocusLoss="false" pauseOnHover />
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* 로고 클릭 시 홈으로 이동 */}
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <img className="h-12 w-auto" src="/images/logo_title.png" alt="Logo" />
            </div>
            {/* 네비게이션 메뉴 */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <button onClick={() => navigate('/')} className="border-b-2 border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
                Home
              </button>
              <button onClick={() => navigate('/healthInfo')} className="border-b-2 border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
                건강정보
              </button>
              <button onClick={() => navigate('/workout')} className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                운동관리
              </button>
              <button onClick={() => navigate('/nutrition')} className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                식단관리
              </button>
              <button onClick={() => navigate('/counsel')} className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                영양상담
              </button>
            </div>
          </div>

          {/* 로그인 상태에 따른 버튼 UI 변경 */}
          <div className="flex items-center space-x-4">
            {!currentUser ? (
              <>
                <button onClick={() => navigate('/login')} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-700 hover:text-white">
                  Login
                </button>
                <button onClick={() => navigate('/signup')} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md">
                  Sign up
                </button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/mypage')} className="text-gray-700 cursor-pointer hover:underline">
                  {currentUser.memNick}님
                </button>
                <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
