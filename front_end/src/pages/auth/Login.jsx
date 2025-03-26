import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../firebaseConfig';
import { toast } from 'react-toastify';
import { loginMember, oauthLogin } from '../../services/authLogic';

// mySQL사용으로 전체 수정 : 채준병
// 로그인 페이지
const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    memId: '',
    memPw: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await loginMember(formData);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      toast.success(`${userData.memNick}님, 환영합니다!`);
      navigate('/');
    } catch (err) {
      toast.error(
        <div>
          {err.message}
          <br />
          아이디와 비밀번호를 확인하세요.
        </div>
      );
    }
  };

  // Google 로그인 처리 함수
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      // JWT 포함된 사용자 정보 요청
      const userData = await oauthLogin(user.email);
  
      if (userData) {
        setUser(userData);
        navigate('/');
        toast.success(`${userData.memNick}님, 환영합니다!`);
      }else if(userData === null){
        toast.warn('회원가입이 필요합니다.');
        toast.info('회원가입 페이지로 이동합니다.');
        navigate('/signup');
      }
    } catch (error) {
      if (error.message.includes('구글 로그인 실패')) {
        toast.error('구글 로그인 실패: 서버와의 통신에 문제가 발생했습니다.');
      } else {
        toast.error(`Google 로그인 실패: ${error.message}`);
      }
    }
  };

  return (
    <>
      <main className="flex flex-col justify-center items-center p-4 w-full flex-grow my-20">
        <div className="w-full max-w-md flex flex-col justify-center space-y-3">
          <div className="flex flex-col items-center space-y-1">
            <img src="../images/logo2_login.png" alt="Logo" style={{ height: '200px' }} />
          </div>

          <form className="space-y-3" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xl font-medium text-gray-700">아이디</label>
              <input type="id" name="memId" placeholder="아이디를 입력하세요" value={formData.memId} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xl" required />
            </div>
            <div>
              <label className="block text-xl font-medium text-gray-700">비밀번호</label>
              <input type="password" name="memPw" placeholder="비밀번호를 입력하세요" value={formData.memPw} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xl" required />
            </div>
            <button type="submit" className=" text-xl w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-700 transition">
              로그인
            </button>
          </form>

          <div className="text-center text-gray-600 text-sm">다른 방법으로 로그인</div>

          {/* Google 로그인 버튼 */}
          <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition">
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="h-4 w-4 mr-2" />
            Google
          </button>

          <div className="text-center text-gray-600 text-sm mt-1">
            계정이 없으신가요?{' '}
            <button onClick={() => navigate('/signup')}  className="text-indigo-600 hover:underline">
              회원가입
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Login;
