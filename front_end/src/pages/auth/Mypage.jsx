import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Mypage = ({ user }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    memId : '',
    memEmail : '',
    memNick : '',
    memPhone : '',
    memHeight : '',
    memWeight : '',
  });
  const [bmiStatus, setBmiStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const todayDate = new Date().toISOString().split('T')[0];

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/auth/getUserByEmail?email=${user.memEmail}`);
      const data = await response.json();

      if (data) {
        setUserData(data);
        setFormData({
          memId : data.memId || '',
          memEmail : data.memEmail || '',
          memNick : data.memNick || '',
          memPhone : data.memPhone || '',
          memHeight : data.memHeight || '',
          memWeight : data.memWeight || '',
          memAge: data.memAge !== null ? data.memAge : '',
        });
        calculateBmiStatus(data.memBmi);
      }
    } catch (error) {
      console.error('사용자 데이터를 불러오는 데 실패했습니다.', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    fetchUserData();
  }, [user, navigate]);

  const calculateBmiStatus = (memBmi) => {
    if (memBmi < 18.5) setBmiStatus('저체중 🦴');
    else if (memBmi < 23) setBmiStatus('정상 🟢');
    else if (memBmi < 25) setBmiStatus('과체중 😢');
    else if (memBmi < 30) setBmiStatus('경도비만 🟡');
    else if (memBmi < 35) setBmiStatus('중등도비만 🟠');
    else setBmiStatus('고도비만 🔴');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch('/api/auth/updateUser', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const result = await response.text();
      if (response.ok) {
        alert('회원 정보가 업데이트되었습니다.');
      } else {
        alert(`업데이트 실패: ${result}`);
      }
    } catch (error) {
      console.error('회원 정보 업데이트 실패:', error);
      alert('서버 오류가 발생했습니다.');
    }
  };

  const handleRefresh = () => {
    fetchUserData();
    alert('새로고침 완료!');
  };
  
  
  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <div className="relative mb-4">
        <h2 className="text-2xl font-bold text-center">{userData?.memNick}님의 회원 정보</h2>
        <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
          {todayDate}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">아이디 </label>
            <input type="text" name='memId' value={formData?.memId || ''} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white-200" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">이메일</label>
            <input type="text" name='memEmail' value={formData?.memEmail || ''} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white-200" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">닉네임</label>
            <input type="text" name='memNick' value={formData?.memNick || ''} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white-200" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">전화번호</label>
            <input type="number" name='memPhone' value={formData?.memPhone || ''} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white-200" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">나이 (세)</label>
            <input type="number" value={userData?.memAge || ''} readOnly className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">신장 (cm)</label>
            <input type="number" name='memHeight' value={formData?.memHeight || ''} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white-200" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">체중 (kg)</label>
            <input type="number" name='memWeight' value={formData?.memWeight || ''} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white-200" />
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
      </div>
    </div>
  );
};

export default Mypage;
