import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig'; // Firebase 설정 파일 가져오기

const Header = ({ user, setUser }) => {
  const navigate = useNavigate();

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      alert('로그아웃하였습니다.');
      navigate('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div
              className="flex-shrink-0 flex items-center cursor-pointer"
              onClick={() => navigate('/')} // 로고 클릭 시 홈으로 이동
            >
              <img className="h-12 w-auto" src="../images/logo.png" alt="Logo" />
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <a href="/" className="border-b-2 border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
                Dashboard
              </a>
              <a href="/progress" className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Progress
              </a>
              <a href="/nutrition" className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Nutrition
              </a>
              <a href="/community" className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Community
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {!user ? (
              <>
                <a href="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-white border border-gray-300 rounded-md hover:bg-gray-700">
                  Login
                </a>
                <a href="/signup" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md">
                  Sign up
                </a>
              </>
            ) : (
              <>
                <span className="text-gray-700">{user.name}님</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                >
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
