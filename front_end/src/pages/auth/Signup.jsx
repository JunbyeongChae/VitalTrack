import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { handleSignup } from '../../service/authLogic'; // 인증 로직 가져오기

const Signup = () => {
  // 일부 authLogic.js로 분리 : 채준병
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
    height: isGoogleSignup ? prefilledData.height || '' : '',
    weight: isGoogleSignup ? prefilledData.weight || '' : '',
    activityLevel: isGoogleSignup ? prefilledData.activityLevel || '' : ''
  });

  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 입력값 상태 업데이트 함수
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const message = await handleSignup(formData, isGoogleSignup, prefilledData, agreed);
      setSuccess(message);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white font-[Inter]">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg space-y-4 border-4 border-gray-700">
        {/* 순서 변경 : 채준병 */}
        {/* 이메일 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">이메일</label>
          <input type="email" name="email" placeholder="이메일을 입력하세요" value={formData.email} disabled={isGoogleSignup} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
        </div>

        {/* 비밀번호 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">비밀번호</label>
          <input type="password" name="password" placeholder="비밀번호를 입력하세요" value={formData.password} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
        </div>

        {/* 비밀번호 확인 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">비밀번호 확인</label>
          <input type="password" name="confirmPassword" placeholder="비밀번호를 다시 입력하세요" value={formData.confirmPassword} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
        </div>

        {/* 이름 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">이름</label>
          <input type="text" name="name" placeholder="이름을 입력하세요" value={formData.name} disabled={isGoogleSignup} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
        </div>

        {/* 생년월일 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">생년월일</label>
          <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
        </div>

        {/* 성별 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">성별</label>
          <div className="flex space-x-4 mt-1">
            <label className="flex items-center">
              <input type="radio" name="gender" checked={formData.gender === 'male'} onChange={() => setFormData({ ...formData, gender: 'male' })} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
              <span className="ml-2 text-sm text-gray-700">남성</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio" // checkbox -> radio 수정 : 채준병
                name="gender"
                checked={formData.gender === 'female'}
                onChange={() => setFormData({ ...formData, gender: 'female' })}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">여성</span>
            </label>
          </div>
        </div>

        {/* 신장 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">신장 (cm)</label>
          <input type="number" name="height" placeholder="신장을 입력하세요" value={formData.height} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        {/* 체중 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">체중 (kg)</label>
          <input type="number" name="weight" placeholder="체중을 입력하세요" value={formData.weight} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>

        {/* 일상 활동량 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">일상 활동량</label>
          <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">선택하세요</option>
            <option value="sedentary">비활동적</option>
            <option value="lowactive">저활동적</option>
            <option value="active">활동적</option>
            <option value="veryactive">매우 활동적</option>
          </select>
        </div>
        <div className="text-sm text-gray-700">
          {/* 일상 활동량 선택지 설명 추가 : 채준병 */}
          <label className="block text-sm font-medium text-gray-700">일상 활동량 선택지 설명</label>
          <p>
            - 비활동적: 주로 앉아서 일하거나 공부하고, 신체활동이 매우 적은 경우 <br />
            - 저활동적: 주로 앉아서 생활하나 가벼운 운동/산책 등을 가끔 수행하는 경우 <br />
            - 활동적: 하루 중 서 있거나 움직이는 시간이 꽤 있고, 규칙적으로 운동(주 3~5회) <br />
            - 매우 활동적: 육체 노동이 많거나 강도 높은 운동(주 6~7회 이상)을 규칙적으로 수행 <br />
          </p>
        </div>

        {/* 개인정보 동의서 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">개인정보 동의서</label>
          <textarea
            readOnly
            className="mt-1 w-full h-32 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
            // 개인정보 처리방침 내용 수정 : 채준병
            value={`개인정보 처리방침\n
1. 수집하는 개인정보의 항목
- 이름, 이메일, 전화번호 등

2. 개인정보의 수집 및 이용목적
- 회원가입 및 서비스 제공을 위한 본인 확인
- 고객상담 및 불만처리
- 고객 맞춤 정보 산출 및 통계학적 분석자료로 활용 (BMI, 운동량, 칼로리, 영양섭취정보 등)
- 기타 새로운 서비스 및 신상품 안내

3. 개인정보의 보유 및 이용기간
- 회원 탈퇴 후 즉시 삭제`}
          />
        </div>

        {/* 동의 체크박스 */}
        <div className="flex items-center">
          <input type="checkbox" checked={agreed} onChange={() => setAgreed(!agreed)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
          <label className="ml-2 text-sm text-gray-700">개인정보 처리방침에 동의합니다</label>
        </div>

        {/* 에러 및 성공 메시지 */}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        {/* 회원가입 버튼 */}
        <button type="submit" className={`w-full py-2 rounded-md text-white transition ${agreed ? 'bg-gray-900 hover:bg-gray-700' : 'bg-gray-300 cursor-not-allowed'}`} disabled={!agreed}>
          회원가입
        </button>
      </form>
    </div>
  );
};

export default Signup;
