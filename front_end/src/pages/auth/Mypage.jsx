import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserByEmail, updateUser, checkPassword, deleteUser } from '../../services/authLogic';
import { toast} from 'react-toastify';

const Mypage = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    // 회원정보 수정을 위한 폼 데이터 수정 : 채준병
    // memId 제거, memPw, confirmPassword, birth 추가
    memEmail: '',
    memPw: '',
    confirmPassword: '',
    memNick: '',
    memPhone: '',
    memHeight: '',
    memWeight: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    memAge: ''
  });
  const [bmiStatus, setBmiStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const todayDate = new Date().toISOString().split('T')[0];

  // 생년월일 선택용 배열 생성
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const fetchUserData = async () => {
    try {
      const data = await getUserByEmail(user.memEmail);
      setUserData(data);
      setFormData({
        memEmail: data.memEmail || '',
        memNick: data.memNick || '',
        memPhone: data.memPhone || '',
        memHeight: data.memHeight || '',
        memWeight: data.memWeight || '',
        birthYear: data.birthYear || '',
        birthMonth: data.birthMonth || '',
        birthDay: data.birthDay || '',
        memAge: data.memAge || ''
      });
      calculateBmiStatus(data.memBmi);
    } catch (error) {
      toast.error('사용자 데이터를 불러오는 데 실패했습니다.', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 새로고침 시 localStorage에서 user 정보 복구
    const storedUser = localStorage.getItem('user');
    if (!user && storedUser) {
      setUser(JSON.parse(storedUser));
      return;
    }
  
    if (!user) {
      toast.success('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
  
    fetchUserData();
  }, [user, navigate]);

  const calculateBmiStatus = (memBmi) => {
    if (memBmi < 18.5) setBmiStatus('저체중 🟡');
    else if (memBmi < 23) setBmiStatus('정상 🟢');
    else if (memBmi < 25) setBmiStatus('과체중 🟡');
    else if (memBmi < 30) setBmiStatus('경도비만 🟠');
    else if (memBmi < 35) setBmiStatus('중등도비만 🔴');
    else setBmiStatus('고도비만 ⚠️');
  };

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
  

  // 입력값 처리 함수 (복원)
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedFormData = { ...formData, [name]: value };
  
    // 생년월일 입력 시 나이 자동 계산
    if (updatedFormData.birthYear && updatedFormData.birthMonth && updatedFormData.birthDay) {
      updatedFormData.memAge = calculateAge(updatedFormData.birthYear, updatedFormData.birthMonth, updatedFormData.birthDay);
    }
  
    setFormData(updatedFormData);
  };

  // authLogic.js로 일부 이동

  const handleUpdate = async () => {
    if (formData.memPw && formData.memPw !== formData.confirmPassword) {
      toast.warn('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    try {
      await updateUser(formData);
      toast.success('회원 정보가 업데이트되었습니다.');
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  const handleRefresh = () => {
    fetchUserData();
    toast.success('새로고침 완료!');
  };

  // authLogic.js로 일부 이동
  const handleDeleteAccount = async () => {
    const password = prompt('비밀번호를 한 번 더 입력하세요:');
    if (!password) return;
  
    try {
      const checkResult = await checkPassword(user.memEmail, password);
      if (!checkResult.success) {
        toast.warn('비밀번호가 일치하지 않습니다.');
        return;
      }
  
      const confirmDelete = window.confirm('정말 탈퇴하시겠습니까?');
      if (!confirmDelete) return;
  
      const result = await deleteUser(user.memEmail);
      if (result.success) {
        toast.success('회원탈퇴가 완료되었습니다.');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
      } else {
        toast.warn(result.message);
      }
    } catch (error) {
      console.error('회원탈퇴 오류:', error);
      toast.error(error.message);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <div className="relative mb-4">
        <h2 className="text-2xl font-bold text-center">{userData?.memNick}님의 회원 정보</h2>
        <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">{todayDate}</span>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-100 p-4 rounded-lg">
          {/* 이메일 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">이메일</label>
            <input type="text" name="memEmail" value={formData?.memEmail || ''} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white-200" />
          </div>
          {/* 비밀번호 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">비밀번호 (수정 시 입력)</label>
            <input type="password" name="memPw" placeholder="비밀번호를 입력하세요." value={formData.memPw} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          {/* 비밀번호 확인 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">비밀번호 확인</label>
            <input type="password" name="confirmPassword" placeholder="비밀번호를 다시 입력하세요." value={formData.confirmPassword} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          {/* 닉네임 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">닉네임</label>
            <input type="text" name="memNick" value={formData?.memNick || ''} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white-200" />
          </div>
          {/* 전화번호 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">전화번호</label>
            <input type="number" name="memPhone" value={formData?.memPhone || ''} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white-200" />
          </div>
          {/* 생년월일 */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">생년월일</label>
            <div className="flex gap-2">
              <select name="birthYear" value={formData.birthYear} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="">연도</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}년
                  </option>
                ))}
              </select>
              <select name="birthMonth" value={formData.birthMonth} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="">월</option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}월
                  </option>
                ))}
              </select>
              <select name="birthDay" value={formData.birthDay} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="">일</option>
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}일
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">나이 (세)</label>
            <input type="number" value={formData.memAge || userData?.memAge || ''} readOnly className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200" />
          </div>
          {/* 신장, 체중 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">신장 (cm)</label>
            <input type="number" name="memHeight" value={formData?.memHeight || ''} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white-200" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">체중 (kg)</label>
            <input type="number" name="memWeight" value={formData?.memWeight || ''} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white-200" />
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">BMI & 건강 상태</label>
            <input type="text" value={`${userData?.memBmi || ''} (${bmiStatus})`} readOnly className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">권장 칼로리</label>
            <input type="text" value={userData?.memKcal || ''} readOnly className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">권장 탄수화물 섭취 범위 (g)</label>
            <input type="text" value={`${userData?.carbMin} ~ ${userData?.carbMax}`} readOnly className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">권장 단백질 섭취 범위 (g)</label>
            <input type="text" value={`${userData?.proteinMin} ~ ${userData?.proteinMax}`} readOnly className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">권장 지방 섭취 범위 (g)</label>
            <input type="text" value={`${userData?.fatMin} ~ ${userData?.fatMax}`} readOnly className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200" />
          </div>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex justify-center space-x-4 mt-6">
        <button onClick={handleUpdate} className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md">
          정보수정
        </button>
        <button onClick={handleRefresh} className="px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-md">
          새로고침
        </button>
        <button onClick={handleDeleteAccount} className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md">
          회원탈퇴
        </button>
      </div>
    </div>
  );
};

export default Mypage;
