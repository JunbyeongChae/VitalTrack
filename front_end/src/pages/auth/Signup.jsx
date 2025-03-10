import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { registerMember } from '../../services/authLogic';

// mySQL사용으로 전체 수정정
const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefilledData = location.state || {}; //구글 로그인에서 전달된 데이터 받기

  // 생년월일 드롭다운 목록 생성
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => 1900 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const [formData, setFormData] = useState({
    mem_id: '',
    mem_pw: '',
    confirmPassword: '',
    mem_nick: prefilledData.name || '',
    mem_phone: '',
    mem_email: prefilledData.email || '',
    mem_height: '',
    mem_weight: '',
    mem_gen: '',
    mem_age: '',
    activityLevel: ''
  });

  const [agreed, setAgreed] = useState(false);

  // 나이 계산 함수
  const calculateAge = (year, month, day) => {
    const today = new Date();
    const birthDate = new Date(year, month - 1, day);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedFormData = { ...formData, [name]: value };

    // 생년월일 입력 시 mem_age 자동 계산
    if (updatedFormData.birthYear && updatedFormData.birthMonth && updatedFormData.birthDay) {
      updatedFormData.mem_age = calculateAge(updatedFormData.birthYear, updatedFormData.birthMonth, updatedFormData.birthDay);
    }

    setFormData(updatedFormData);

    console.log('Updated mem_age:', updatedFormData.mem_age); // 디버깅 로그 추가
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.mem_age) {
      alert('mem_age error');
      return;
    }

    try {
      const response = await registerMember(formData);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '회원가입 실패');
      }

      alert('회원가입이 완료되었습니다.');
      navigate('/login');
    } catch (err) {
      alert(`회원가입 중 오류가 발생했습니다: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white font-[Inter]">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg space-y-4 border-4 border-gray-700">
        {/* 순서 변경 : 채준병 */}
        {/* 이메일 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">이메일</label>
          <input type="email" name="mem_email" placeholder="이메일을 입력하세요" value={formData.mem_email} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
        </div>

        {/* 아이디 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">아이디</label>
          <input type="text" name="mem_id" placeholder="아이디를 입력하세요" value={formData.mem_id} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
        </div>

        {/* 비밀번호 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">비밀번호</label>
          <input type="password" name="mem_pw" placeholder="비밀번호를 입력하세요" value={formData.mem_pw} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
        </div>

        {/* 비밀번호 확인 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">비밀번호 확인</label>
          <input type="password" name="confirmPassword" placeholder="비밀번호를 다시 입력하세요" value={formData.confirmPassword} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
        </div>

        {/* 닉네임 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">닉네임</label>
          <input type="text" name="mem_nick" placeholder="닉네임을 입력하세요" value={formData.mem_nick} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
        </div>

        {/* 생년월일 입력 */}
        {/* 입력방식 변경 : 채준병 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">생년월일</label>
          <div className="flex space-x-2 mt-1">
            <select name="birthYear" value={formData.birthYear} onChange={handleChange} required className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">연도</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}년
                </option>
              ))}
            </select>
            <select name="birthMonth" value={formData.birthMonth} onChange={handleChange} required className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">월</option>
              {months.map((month) => (
                <option key={month} value={month.toString()}>
                  {month}월
                </option>
              ))}
            </select>
            <select name="birthDay" value={formData.birthDay} onChange={handleChange} required className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">일</option>
              {days.map((day) => (
                <option key={day} value={day.toString()}>
                  {day}일
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 전화번호 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">전화번호</label>
          <input type="tel" name="mem_phone" placeholder="전화번호를 입력하세요. (-제외)" value={formData.mem_phone} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
        </div>

        {/* 성별 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">성별</label>
          <div className="flex space-x-4 mt-1">
            <label className="flex items-center">
              <input type="radio" name="mem_gen" checked={formData.mem_gen === 'male'} onChange={() => setFormData({ ...formData, mem_gen: 'male' })} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
              <span className="ml-2 text-sm text-gray-700">남성</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio" // checkbox -> radio 수정 : 채준병
                name="mem_gen"
                checked={formData.mem_gen === 'female'}
                onChange={() => setFormData({ ...formData, mem_gen: 'female' })}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">여성</span>
            </label>
          </div>
        </div>

        {/* 신장 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">신장 (cm)</label>
          <input type="number" name="mem_height" placeholder="신장을 입력하세요" value={formData.mem_height || ''} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" min="1" step="1" required />
        </div>
        {/* 체중 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">체중 (kg)</label>
          <input type="number" name="mem_weight" placeholder="체중을 입력하세요" value={formData.mem_weight} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" min="1" step="1" required />
        </div>

        {/* 일상 활동량 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">일상 활동량</label>
          <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} required>
            <option value="">선택하세요</option>
            <option value="sedentary">비활동적</option>
            <option value="lowactive">저활동적</option>
            <option value="active">활동적</option>
            <option value="veryactive">매우 활동적</option>
          </select>
        </div>

        {/* 일상 활동량 선택지 설명 */}
        <div className="text-sm text-gray-700">
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

        <button type="submit" className="w-full py-2 rounded-md bg-gray-900 text-white" disabled={!agreed}>
          회원가입
        </button>
      </form>
    </div>
  );
};

export default Signup;
