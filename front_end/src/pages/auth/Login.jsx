import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../firebaseConfig';

// mySQL사용으로 전체 수정 : 채준병
// 로그인 페이지
const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    memEmail: '',
    memPw: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                memEmail: formData.memEmail,
                memPw: formData.memPw,
            }),
        });

        const userData = await response.json();

        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            alert(`${userData.memNick}님, 환영합니다!`);
            navigate('/');
        } else {
            throw new Error(userData.error || '로그인 실패');
        }
    } catch (err) {
        alert(`로그인 중 오류가 발생했습니다: ${err.message}`);
    }
};

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // DB에서 사용자 존재 여부 확인
      const response = await fetch(`/api/auth/getUserByEmail?email=${user.email}`);
      const userData = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        alert(`${userData.memNick}님, 환영합니다!`);
        navigate('/');
      } else {
        alert('회원정보를 찾을 수 없습니다. 회원가입을 진행해주세요.');
        navigate('/signup', {
          state: {
            email: user.email,
            name: user.displayName,
            uid: user.uid
          }
        });
      }
    } catch (error) {
      setError(`Google 로그인 실패: ${error.message}`);
    }
  };

  return (
    <div
      className="flex flex-col h-screen justify-center items-center bg-white font-[Inter]"
      style={{
        padding: '0',
        margin: '0',
        gap: '0.5rem',
        height: '86vh',
        minHeight: '600px'
      }}>
      <main className="flex flex-col justify-center items-center p-2 w-full flex-grow">
        <div className="w-full max-w-md flex flex-col justify-center space-y-3">
          <div className="flex flex-col items-center space-y-1">
            <img src="../images/logo.png" alt="Logo" className="h-16" />
            <h2 className="text-xl font-semibold text-gray-700">Sign in to your account</h2>
          </div>

          <form className="space-y-3" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">E-mail</label>
              <input type="email" name="memEmail" placeholder="Insert your email" value={formData.memEmail} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" name="memPw" placeholder="Enter your password" value={formData.memPw} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <button type="submit" className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-700 transition">
              Login
            </button>
          </form>

          <div className="text-center text-gray-600 text-sm">Or sign in with</div>

          {/* Google 로그인 버튼 */}
          <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition">
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="h-4 w-4 mr-2" />
            Sign in with Google
          </button>

          <div className="text-center text-gray-600 text-sm mt-1">
            Don't have an account?{' '}
            <a href="/signup" className="text-indigo-600 hover:underline">
              Sign up
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
