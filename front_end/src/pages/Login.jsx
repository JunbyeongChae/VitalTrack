import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, provider } from '../firebaseConfig'; // Firebase 설정 파일 가져오기

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate(); // 페이지 이동을 위한 훅

  // 입력값 업데이트 함수
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 이메일/비밀번호 로그인 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const userDocRef = doc(db, 'users', userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        alert(`${userData.name}님 환영합니다!`);
        setUser({
          uid: userCredential.user.uid,
          name: userData.name,
          email: userData.email,
        });
        navigate('/');
      } else {
        setError('사용자 정보를 찾을 수 없습니다.');
      }
    } catch (err) {
      setError(`로그인 실패: ${err.message}`);
    }
  };

  // Google 로그인 처리
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      // Firestore에 사용자 정보 저장
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          name: user.displayName,
          email: user.email,
          createdAt: new Date(),
        });
      }

      alert(`${user.displayName}님 환영합니다!`);
      setUser({
        uid: user.uid,
        name: user.displayName,
        email: user.email,
      });
      navigate('/');
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
        minHeight: '600px',
      }}
    >
      {/* 로그인 폼 */}
      <main className="flex flex-col justify-center items-center p-2 w-full flex-grow">
        <div className="w-full max-w-md flex flex-col justify-center space-y-3">
          {/* 로고 및 타이틀 */}
          <div className="flex flex-col items-center space-y-1">
            <img src="../images/logo.png" alt="Logo" className="h-16" />
            <h2 className="text-xl font-semibold text-gray-700">
              Sign in to your account
            </h2>
          </div>

          {/* 로그인 폼 입력 */}
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                placeholder="Insert your email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-700 transition"
            >
              Login
            </button>
          </form>
          <div className="text-center text-gray-600 text-sm">Or sign in with</div>
          {/* Google 로그인 버튼 */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              className="h-4 w-4 mr-2"
            />
            Sign in with Google
          </button>

          {/* 하단 링크 */}
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
