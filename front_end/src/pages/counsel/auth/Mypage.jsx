import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import * as echarts from 'echarts';

const Mypage = ({ user }) => {
  const navigate = useNavigate();
  const weightChartRef = useRef(null);
  const bmiChartRef = useRef(null);
  const [formData, setFormData] = useState({
    height: user?.height || '',
    weight: user?.weight || '',
    targetWeight: '',
  });

  const [bmi, setBmi] = useState(null);
  const [bmiStatus, setBmiStatus] = useState('');
  const [normalWeightRange, setNormalWeightRange] = useState('');
  const [loading, setLoading] = useState(true);

  // 🔹 오늘 날짜 가져오기
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayDate = getCurrentDate();

  // 로그인 상태 확인 후 사용자 데이터 가져오기
  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        navigate(0);
      } else {
        alert('로그인이 필요합니다.');
        navigate('/login');
      }
      return;
    }

    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFormData({
            height: userData.height || '',
            weight: userData.weight || '',
            targetWeight: userData.targetWeight || '',
          });
        }
      } catch (err) {
        console.error('사용자 데이터를 불러오는 데 실패했습니다.', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate]);

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // BMI 자동 계산 및 정상 체중 범위 업데이트
  useEffect(() => {
    if (formData.height && formData.weight) {
      const heightInMeters = formData.height / 100;
      const calculatedBmi = (formData.weight / (heightInMeters * heightInMeters)).toFixed(1);
      setBmi(calculatedBmi);

      // BMI 상태 설정
      if (calculatedBmi < 18.5) {
        setBmiStatus('저체중 🟡');
      } else if (calculatedBmi >= 18.5 && calculatedBmi < 24.9) {
        setBmiStatus('정상 🟢');
      } else if (calculatedBmi >= 25 && calculatedBmi < 29.9) {
        setBmiStatus('과체중 🟠');
      } else {
        setBmiStatus('비만 🔴');
      }

      // 정상 체중 범위 계산
      const minNormalWeight = (18.5 * heightInMeters * heightInMeters).toFixed(1);
      const maxNormalWeight = (24.9 * heightInMeters * heightInMeters).toFixed(1);
      setNormalWeightRange(`${minNormalWeight}kg ~ ${maxNormalWeight}kg`);
    }
  }, [formData.height, formData.weight]);

  useEffect(() => {
    if (weightChartRef.current && bmiChartRef.current) {
      const weightChart = echarts.init(weightChartRef.current);
      const bmiChart = echarts.init(bmiChartRef.current);

      const weightOption = {
        animation: false,
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
        yAxis: { type: 'value' },
        series: [
          {
            data: [75.2, 75.4, 75.1, 75.5, 75.3, 75.6, 75.5],
            type: 'line',
            smooth: true,
            lineStyle: { color: '#3B82F6' },
            itemStyle: { color: '#3B82F6' }
          }
        ]
      };

      const bmiOption = {
        animation: false,
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
        yAxis: { type: 'value' },
        series: [
          {
            name: 'BMI',
            type: 'bar',
            data: [22.1, 22.3, 22.2, 22.4, 22.3, 22.5, 22.4],
            itemStyle: { color: '#EF4444' }
          }
        ]
      };


      weightChart.setOption(weightOption);
      bmiChart.setOption(bmiOption);

      window.addEventListener('resize', () => {
        weightChart.resize();
        bmiChart.resize();
      });

      return () => {
        window.removeEventListener('resize', () => {
          weightChart.resize();
          bmiChart.resize();
        });
      };
    }
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      {/* 제목을 가운데 정렬하고 날짜를 오른쪽 끝에 배치 */}
      <div className="relative mb-4">
        <h2 className="text-2xl font-bold text-center">{user?.name}님의 건강 정보</h2>
        <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
          {todayDate}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* 왼쪽 - 건강 정보 입력 */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">신장 (cm)</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">체중 (kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">목표 체중 (kg)</label>
            <input
              type="number"
              name="targetWeight"
              value={formData.targetWeight}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">BMI 자동 계산</label>
            <input
              type="text"
              value={bmi || ''}
              readOnly
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">BMI 건강 상태</label>
            <input
              type="text"
              value={bmiStatus}
              readOnly
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">정상 BMI 체중 범위</label>
            <input
              type="text"
              value={normalWeightRange}
              readOnly
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200"
            />
          </div>
        </div>

        {/* 오른쪽 - 건강 데이터 시각화 */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">{user?.name}님의 건강 데이터</h3>
          <div className="flex flex-col space-y-4">
            <h2 className="bg-white p-4 rounded-md shadow-md text-center">
              체중 변화 추이
            </h2>
            <div ref={weightChartRef} className='h-80 mt-4'></div>
            <h2 className="bg-white p-4 rounded-md shadow-md text-center">
              BMI 변화 그래프
            </h2>
            <div ref={bmiChartRef} className='h-80 mt-4'></div>
          </div>
        </div>
      </div>
       {/* CRUD 버튼 */}
       <div className="flex justify-center space-x-4 mt-6">
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md">
          생성
        </button>
        <button className="px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-md">
          조회
        </button>
        <button className="px-4 py-2 text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 rounded-md">
          수정
        </button>
        <button className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md">
          삭제
        </button>
      </div>
    </div>
  );
};

export default Mypage;
