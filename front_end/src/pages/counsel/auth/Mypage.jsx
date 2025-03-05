import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import * as echarts from 'echarts';

const Mypage = ({ user }) => {
  const navigate = useNavigate();
  const weightChartRef = useRef(null);
  const bmiChartRef = useRef(null);
  const [age, setAge] = useState(null);
  const [formData, setFormData] = useState({
    height: user?.height || '',
    weight: user?.weight || '',
    targetWeight: '',
  });

  const [bmi, setBmi] = useState(null);
  const [calorie, setCalorie] = useState(null);
  const [bmiStatus, setBmiStatus] = useState('');
  const [normalWeightRange, setNormalWeightRange] = useState('');
  const [loading, setLoading] = useState(true);

  const handleUpdate = async () => {
    const userRef = doc(db, 'users', user.uid);
    const today = new Date().toISOString().split('T')[0];
    try{
      await updateDoc(userRef, {
        height : formData.height,
        weight : formData.weight,
        targetWeight : formData.targetWeight,
        bmi : bmi,
        calorie : calorie,
        [`weightRecords.${today}`] : {weight : formData.weight, bmi : bmi}
      });
      alert('정보가 성공적으로 업데이트됐습니다.')
    }catch(error){
      console.error('정보 저장 중 오류가 발생했습니다.', error);
      alert('정보 저장에 실패하였습니다.');
    }
  }

  // 오늘 날짜 가져오기
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

          if (userData.birthDate) {
            const userAge = calculateAge(userData.birthDate);
            setAge(userAge);
          
          if (userData.gender && userData.activityLevel) {
            const calculatedCalorie = await infoCalorie(userData, userAge);
            setCalorie(calculatedCalorie);
            }
          }
        }
      } catch (err) {
        console.error('사용자 데이터를 불러오는 데 실패했습니다.', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate]);
  
  //나이 계산 함수
  const calculateAge = (birthDate) => {
    if (!birthDate || typeof birthDate !== "string") {
      console.error("잘못된 birthDate 값:", birthDate);
      return null;
    }
  
    const [year, month, day] = birthDate.split("-").map(Number);
    if (!year || !month || !day) {
      console.error("birthDate 형식 오류:", birthDate);
      return null;
    }
  
    const birthDateObj = new Date(year, month - 1, day);
    const today = new Date();
  
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
  
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
  
    return age;
  };
  
  //칼로리 계산함수
  const infoCalorie = async (userData, userAge, weight) => {
    let calorie = 0;
    const heightInMeters = userData.height / 100;
  
    if (userData.gender === 'male') {
      if (userData.activityLevel === 'sedentary') {
        calorie = (662 - (9.53 * userAge)) + (1.0 * ((15.91 * weight) + (539.6 * heightInMeters)));
      } else if (userData.activityLevel === 'lowactive') {
        calorie = (662 - (9.53 * userAge)) + (1.11 * ((15.91 * weight) + (539.6 * heightInMeters)));
      } else if (userData.activityLevel === 'active') {
        calorie = (662 - (9.53 * userAge)) + (1.25 * ((15.91 * weight) + (539.6 * heightInMeters)));
      } else if (userData.activityLevel === 'veryactive') {
        calorie = (662 - (9.53 * userAge)) + (1.48 * ((15.91 * weight) + (539.6 * heightInMeters)));
      }
    } else {
      if (userData.activityLevel === 'sedentary') {
        calorie = (354 - (6.91 * userAge)) + (1.0 * ((9.36 * weight) + (726 * heightInMeters)));
      } else if (userData.activityLevel === 'lowactive') {
        calorie = (354 - (6.91 * userAge)) + (1.12 * ((9.36 * weight) + (726 * heightInMeters)));
      } else if (userData.activityLevel === 'active') {
        calorie = (354 - (6.91 * userAge)) + (1.27 * ((9.36 * weight) + (726 * heightInMeters)));
      } else if (userData.activityLevel === 'veryactive') {
        calorie = (354 - (6.91 * userAge)) + (1.45 * ((9.36 * weight) + (726 * heightInMeters)));
      }
    }
  
    return Math.round(calorie);
  };
  

  // 입력값 변경 핸들러
  const handleChange = async (e) => {
    const { name, value } = e.target;
  
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  
    if (name === 'weight') {
      updateCalorie({ ...formData, weight: value }); // 최신 몸무게 값 반영
    }
  };

  const updateCalorie = async (updatedData) => {
    const userData = await getUserData();
    if (userData) {
      const calculatedCalorie = await infoCalorie(userData, age, updatedData.weight);
      setCalorie(calculatedCalorie);
    }
  };

  const getUserData = async () => {
    if (!user || !user.uid) return null;
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    return userDoc.exists() ? userDoc.data() : null;
  };

  // BMI 자동 계산 및 정상 체중 범위 업데이트
  useEffect(() => {
    if (formData.height && formData.weight) {
      const heightInMeters = formData.height / 100;
      const calculatedBmi = (formData.weight / (heightInMeters * heightInMeters)).toFixed(1);
      setBmi(calculatedBmi);

      // BMI 상태 설정
      if (calculatedBmi < 18.5) {
        setBmiStatus('저체중 ');
      } else if (calculatedBmi >= 18.5 && calculatedBmi < 23) {
        setBmiStatus('정상 🟢');
      } else if (calculatedBmi >= 23 && calculatedBmi < 25) {
        setBmiStatus('과체중 ');
      } else if (calculatedBmi >= 25 && calculatedBmi < 30) {
        setBmiStatus('경도비만 🟡');
      } else if (calculatedBmi >= 30 && calculatedBmi < 35) {
        setBmiStatus('중등도비만 🟠')
      } else {
        setBmiStatus('고도비만 🔴')
      }

      // 정상 체중 범위 계산
      const minNormalWeight = (18.5 * heightInMeters * heightInMeters).toFixed(1);
      const maxNormalWeight = (23 * heightInMeters * heightInMeters).toFixed(1);
      setNormalWeightRange(`${minNormalWeight}kg ~ ${maxNormalWeight}kg`);
    }
  }, [formData.height, formData.weight]);

  useEffect(() => {
    if (!weightChartRef.current || !bmiChartRef.current) return;
  
    // 기존 차트 제거
    const existingWeightChart = echarts.getInstanceByDom(weightChartRef.current);
    if (existingWeightChart) existingWeightChart.dispose();
  
    const existingBmiChart = echarts.getInstanceByDom(bmiChartRef.current);
    if (existingBmiChart) existingBmiChart.dispose();
  
    setTimeout(() => {
      const weightChart = echarts.init(weightChartRef.current);
      const bmiChart = echarts.init(bmiChartRef.current);
      const today = new Date()
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(today.getDate() - (6 - i)); // 가장 오래된 날짜부터 채우기
        return `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    });

      const weightOption = {
        animation: false,
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: last7Days },
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
        xAxis: { type: 'category', data: last7Days },
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
  
      // Resize 이벤트 핸들러 추가
      const handleResize = () => {
        weightChart.resize();
        bmiChart.resize();
      };
  
      window.addEventListener('resize', handleResize);
  
      return () => {
        window.removeEventListener('resize', handleResize);
        weightChart.dispose();
        bmiChart.dispose();
      };
    }, 100); // DOM 업데이트 후 실행하도록 setTimeout 사용
  }, [formData.weight, formData.height, bmi]);
  
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
            <label className="block text-sm font-medium text-gray-700">나이 (세)</label>
            <input
              type="number"
              name="age"
              value={age || ''}
              readOnly
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
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
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">에너지 필요 추정량(TEE)</label>
            <input
              type="text"
              value={calorie || ''}
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
            <div ref={weightChartRef} className='h-60 mt-4'></div>
            <h2 className="bg-white p-4 rounded-md shadow-md text-center">
              BMI 변화 그래프
            </h2>
            <div ref={bmiChartRef} className='h-60 mt-4'></div>
          </div>
        </div>
      </div>
       {/* CRUD 버튼 */}
       <div className="flex justify-center space-x-4 mt-6">
        <button onClick={handleUpdate} className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md">
          정보수정
        </button>
        <button className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md">
          회원탈퇴
        </button>
      </div>
    </div>
  );
};

export default Mypage;
