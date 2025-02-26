import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig'; // Firebase 설정 파일 가져오기

const Signup = () => {
  const location = useLocation();
  const prefilledData = location.state || {}; // 구글 로그인에서 전달된 데이터
  const isGoogleSignup = !!prefilledData.email; // 구글 로그인 여부 확인

  const [formData, setFormData] = useState({
    gender: isGoogleSignup ? prefilledData.gender || '' : '',
    birthDate: isGoogleSignup ? prefilledData.birthDate || '' : '',
    name: isGoogleSignup ? prefilledData.name || '' : '',
    email: isGoogleSignup ? prefilledData.email || '' : '',
    password: '',
    confirmPassword: '',
    height : isGoogleSignup ? prefilledData.height || '' : '',
    weight : isGoogleSignup ? prefilledData.weight || '' : '',
    activityLevel : isGoogleSignup ? prefilledData.activityLevel || '' : '',
  });

  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 입력값 상태 업데이트 함수
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Firestore에 사용자 데이터 저장
  const saveUserData = async (uid) => {
    try {
      await setDoc(doc(db, 'users', uid), {
        gender: formData.gender,
        birthDate: formData.birthDate,
        name: formData.name,
        email: formData.email,
        createdAt: new Date(),
        height: formData.height,
        weight: formData.weight,
        activityLevel: formData.activityLevel,
      }, { merge : true });
    } catch (err) {
      console.error('Firestore 저장 에러:', err);
    }
  };

  // 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 비밀번호 일치 여부 확인
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!agreed) {
      setError('개인정보 처리방침에 동의해야 합니다.');
      return;
    }

    try {
      let uid;
      if (isGoogleSignup) {
        uid = prefilledData.uid;
        const userDocRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          await saveUserData(uid);
          setSuccess('회원정보가 업데이트되었습니다.');
        } else {
          await saveUserData(uid);
          setSuccess('회원가입이 완료되었습니다.');
        }
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        uid = userCredential.user.uid;
        await saveUserData(uid);
        setSuccess('회원가입이 완료되었습니다.');
      }
      setError('');
    } catch (err) {
      setError(`회원가입 실패: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white font-[Inter]">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4 border-4 border-gray-700"
      >
        {/* 성별 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">성별</label>
          <div className="flex space-x-4 mt-1">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="gender"
                checked={formData.gender === 'male'}
                onChange={() => setFormData({ ...formData, gender: 'male' })}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">남성</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="gender"
                checked={formData.gender === 'female'}
                onChange={() => setFormData({ ...formData, gender: 'female' })}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">여성</span>
            </label>
          </div>
        </div>

        {/* 생년월일 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">생년월일</label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* 이름 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">이름</label>
          <input
            type="text"
            name="name"
            placeholder="이름을 입력하세요"
            value={formData.name}
            disabled={isGoogleSignup}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* 이메일 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">이메일</label>
          <input
            type="email"
            name="email"
            placeholder="이메일을 입력하세요"
            value={formData.email}
            disabled={isGoogleSignup}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* 비밀번호 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">비밀번호</label>
          <input
            type="password"
            name="password"
            placeholder="비밀번호를 입력하세요"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* 비밀번호 확인 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">비밀번호 확인</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="비밀번호를 다시 입력하세요"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* 신장 입력 */}
          <div>
          <label className="block text-sm font-medium text-gray-700">신장 (cm)</label>
          <input
            type="number"
            name="height"
            placeholder="신장을 입력하세요"
            value={formData.height}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        {/* 체중 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">체중 (kg)</label>
          <input
            type="number"
            name="weight"
            placeholder="체중을 입력하세요"
            value={formData.weight}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* 일상 활동량 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">일상 활동량</label>
          <select
            name="activityLevel"
            value={formData.activityLevel}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">선택하세요</option>
            <option value="low">거의 없음 (사무직, 학생 등)</option>
            <option value="moderate">중등도 활동</option>
            <option value="high">고강도 활동 (육체 노동, 운동 선수 등)</option>
          </select>
        </div>

        {/* 개인정보 동의서 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">개인정보 동의서</label>
          <textarea
            readOnly
            className="mt-1 w-full h-32 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
            value={`개인정보 처리방침\n
1. 수집하는 개인정보의 항목
- 이름, 이메일, 전화번호 등

2. 개인정보의 수집 및 이용목적
- 회원가입 및 서비스 제공을 위한 본인 확인

3. 개인정보의 보유 및 이용기간
- 회원 탈퇴 후 즉시 삭제`}
          />
        </div>

        {/* 동의 체크박스 */}
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={agreed}
            onChange={() => setAgreed(!agreed)}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-gray-700">개인정보 처리방침에 동의합니다</label>
        </div>

        {/* 에러 및 성공 메시지 */}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        {/* 회원가입 버튼 */}
        <button
          type="submit"
          className={`w-full py-2 rounded-md text-white transition ${
            agreed ? 'bg-gray-900 hover:bg-gray-700' : 'bg-gray-300 cursor-not-allowed'
          }`}
          disabled={!agreed}
        >
          회원가입
        </button>
      </form>
    </div>
  );
};

export default Signup;
