import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { checkEmailExists, checkIdExists, registerMember } from '../../services/authLogic';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Toastify CSS

// mySQL사용으로 전체 수정
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
    memId: '',
    memPw: '',
    confirmPassword: '',
    memNick: prefilledData.name || '',
    memPhone: '',
    memEmail: prefilledData.email || '',
    memHeight: '',
    memWeight: '',
    memGen: '',
    memAge: '',
    activityLevel: ''
  });

  const [errors, setErrors] = useState({}); // 오류 메시지 상태 추가
  const [agreed, setAgreed] = useState(false); // 개인정보 동의 체크 상태

  // 입력값 검증
  const validateField = async(name, value) => {
    let message = '';
    switch (name) {
      case 'memEmail':
        if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)) {
            message = '올바른 이메일 형식으로 입력해 주세요.';
        } else {
          const emailExists = await checkEmailExists(value);
          message = emailExists ? '이미 사용 중인 이메일입니다.' : '사용 가능한 이메일입니다.';
        }
        break;
      case 'memId':
        if (!/^[a-zA-Z0-9]{5,15}$/.test(value)) {
          message = '아이디는 5~15자의 영문과 숫자로 입력해 주세요.';
        } else {
          const result = await checkIdExists(value);
          message = result.exists ? '이미 사용 중인 아이디입니다.' : '사용 가능한 아이디입니다.';
        }
        break;
      case 'memPw':
        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/.test(value)) {
          message = '비밀번호는 8~20자의 영문, 숫자를 포함해야 합니다.';
        }
        break;
      case 'confirmPassword':
        if (value !== formData.memPw) {
          message = '비밀번호와 비밀번호 확인이 일치하지 않습니다.';
        } else if (value === formData.memPw && value !== '') {
          message = '비밀번호가 일치합니다.';
        }
        break;
      case 'memPhone':
        if (!/^010\d{7,8}$/.test(value)) {
          message = "전화번호는 '010'으로 시작하고, 10~11자리 숫자만 입력해 주세요.";
        }
        break;
      case 'memHeight':
        if (!/^(5[0-9]|[6-9][0-9]|1[0-9]{2}|2[0-4][0-9]|250)$/.test(value)) {
          message = '신장은 50cm에서 250cm 사이 소수점 제외한 정수로 입력해 주세요.';
        }
        break;
      case 'memWeight':
        if (!/^([1-9][0-9]|[1-9][0-9]{1,2}|300)$/.test(value)) {
          message = '체중은 10kg에서 300kg 사이 소수점 제외한 정수로 입력해 주세요.';
        }
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  const handleBlur = (e) => {
    validateField(e.target.name, e.target.value); // onBlur 시 검증 함수 호출
  };

  // 생년월일 입력 시 memAge 자동 계산
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

    // 생년월일 입력 시 memAge 자동 계산
    if (updatedFormData.birthYear && updatedFormData.birthMonth && updatedFormData.birthDay) {
      updatedFormData.memAge = calculateAge(updatedFormData.birthYear, updatedFormData.birthMonth, updatedFormData.birthDay);
    }

    setFormData(updatedFormData);
    console.log('Updated memAge:', updatedFormData.memAge); // 디버깅 로그
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(errors); // errors 객체 출력
    if (Object.values(errors).some((msg) => msg && !msg.includes('사용 가능') && !msg.includes('비밀번호가 일치합니다.'))) return; // 오류가 있으면 제출 방지
    try {
      const result = await registerMember(formData);
      // 성공 메시지 처리
      if (result.status === 'success') {
        toast.success(result.message);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        navigate('/login');
      }
    } catch (err) {
      toast.error(`회원가입 중 오류가 발생했습니다: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white font-[Inter]">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg space-y-4 border-4 border-gray-700">
        {/* 순서 변경 : 채준병 */}
        {/* 이메일 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">이메일</label>
          <input type="email" name="memEmail" placeholder="이메일을 입력하세요" value={formData.memEmail} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" onBlur={handleBlur} required />
          {errors.memEmail && <div style={{ color: errors.memEmail.includes('가능') ? 'green' : 'red' }}>{errors.memEmail}</div>}
        </div>

        {/* 아이디 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">아이디</label>
          <input type="text" name="memId" placeholder="아이디를 입력하세요.(5~15자, 영문+숫자)" value={formData.memId} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" onBlur={handleBlur} required />
          {errors.memId && <div style={{ color: errors.memId.includes('가능') ? 'green' : 'red' }}>{errors.memId}</div>}
        </div>

        {/* 비밀번호 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">비밀번호</label>
          <input type="password" name="memPw" placeholder="비밀번호를 입력하세요(8~20자, 영문+숫자+특수문자)" value={formData.memPw} onChange={handleChange} onBlur={handleBlur} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          {errors.memPw && <div style={{ color: 'red' }}>{errors.memPw}</div>}
        </div>

        {/* 비밀번호 확인 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">비밀번호 확인</label>
          <input type="password" name="confirmPassword" placeholder="비밀번호를 다시 입력하세요" value={formData.confirmPassword} onChange={handleChange} onBlur={handleBlur} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          {errors.confirmPassword && <div style={{ color: errors.confirmPassword === '비밀번호가 일치합니다.' ? 'green' : 'red' }}>{errors.confirmPassword}</div>}
        </div>

        {/* 닉네임 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">닉네임</label>
          <input type="text" name="memNick" placeholder="닉네임을 입력하세요" value={formData.memNick} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
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
          <input type="tel" name="memPhone" placeholder="전화번호를 입력하세요. (-제외)" value={formData.memPhone} onChange={handleChange} onBlur={handleBlur} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          {errors.memPhone && <div style={{ color: 'red' }}>{errors.memPhone}</div>}
        </div>

        {/* 성별 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">성별</label>
          <div className="flex space-x-4 mt-1">
            <label className="flex items-center">
              <input type="radio" name="memGen" checked={formData.memGen === 'male'} onChange={() => setFormData({ ...formData, memGen: 'male' })} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" required />
              <span className="ml-2 text-sm text-gray-700">남성</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio" // checkbox -> radio 수정 : 채준병
                name="memGen"
                checked={formData.memGen === 'female'}
                onChange={() => setFormData({ ...formData, memGen: 'female' })}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                required
              />
              <span className="ml-2 text-sm text-gray-700">여성</span>
            </label>
          </div>
        </div>

        {/* 신장 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">신장 (cm)</label>
          <input type="number" name="memHeight" placeholder="신장을 입력하세요" value={formData.memHeight || ''} onChange={handleChange} onBlur={handleBlur} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" min="1" step="1" required />
          {errors.memHeight && <div style={{ color: 'red' }}>{errors.memHeight}</div>}
        </div>
        {/* 체중 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">체중 (kg)</label>
          <input type="number" name="memWeight" placeholder="체중을 입력하세요" value={formData.memWeight} onChange={handleChange} onBlur={handleBlur} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" min="1" step="1" required />
          {errors.memWeight && <div style={{ color: 'red' }}>{errors.memWeight}</div>}
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
