import React, { useState, useEffect, useContext } from 'react';
import MealSection from './MealSection';
import AddMealModal from './AddMealModal';
import { format, parseISO } from 'date-fns';
import axios from 'axios';
import { MealsContext } from '../../contexts/MealsContext';

const Meals = () => {
  const [foods, setFoods] = useState([]); // State for food data
  const [sections, setSections] = useState({
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snack: []
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSection, setModalSection] = useState(''); // Section name for the modal
  const [memNo, setMemNo] = useState(null); // Member number state
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  // localStorage에서 날짜를 가져옴
  const selectedDate = localStorage.getItem('selectedDate');
  const dateToSave = selectedDate ? format(parseISO(selectedDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');

  // 사용자의 식단기록을 가져오는 함수
  const loadClientMeals = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // localStorage에서 유저데이터 가져오기
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData || !userData.memNo) {
        console.warn('No member number found for the logged-in user.');
        setError('User information not found');
        setIsLoading(false);
        return;
      }

      const memNo = userData.memNo;
      setMemNo(memNo);

      // 항상 localStorage에 저장된 날짜를 사용
      const selectedDate = localStorage.getItem('selectedDate');

      // 만약 localStorage에 저장된 날짜가 없을 경우 KST(한국 표준시)를 사용
      const dateParam = selectedDate
          ? format(new Date(selectedDate), 'yyyy-MM-dd')
          : (() => {
            const now = new Date();
            const kstDate = new Date(now.getTime() + 9 * 60 * 60000);
            return `${kstDate.getUTCFullYear()}-${String(kstDate.getUTCMonth() + 1).padStart(2, '0')}-${String(kstDate.getUTCDate()).padStart(2, '0')}`;
          })();

      // 회원번호, 날짜로 백엔드에서 식단기록을 가져오는 API
      const url = `${process.env.REACT_APP_SPRING_IP}api/meals/${memNo}${dateParam ? `?date=${dateParam}` : ''}`;

      console.log('Fetching meals from:', url);
      const response = await fetch(url);
      const rawResponse = await response.text();

      if (!response.ok) {
        throw new Error(`식단 기록 불러오기를 실패했습니다. : ${rawResponse}`);
      }

      const mealsResponse = JSON.parse(rawResponse);

      const groupedMeals = { Breakfast: [], Lunch: [], Dinner: [], Snack: [] };

      mealsResponse.forEach((meal) => {
        const { mealType, name, calories, memo, recordId, protein, carbs, fat } = meal;
        if (groupedMeals[mealType]) {
          groupedMeals[mealType].push({
            id: recordId,
            recordId: recordId,
            name: name,
            calories,
            unit: '1 Serving',
            memo: memo || '',
            protein: protein || 0,
            carbs: carbs || 0,
            fat: fat || 0,
            photo: null
          });
        } else {
          console.warn(`식단 타입 오류 : ${mealType}`, meal);
        }
      });
      setSections(groupedMeals);

      const reloadEvent = new CustomEvent('mealsReloaded', {
        detail: {
          timestamp: new Date().getTime(),
          source: 'Meals.jsx',
          meals: groupedMeals
        }
      });
      window.dispatchEvent(reloadEvent);
    } catch (error) {
      console.error('식단 기록 로드에 실패하였습니다.', error);
      setError('식단 기록 로드에 실패하였습니다.' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // DateExplorer의 날짜가 변경되었을 때 그 날짜에 대한 식단자료를 DB에서 가져옴
  useEffect(() => {
    const handleDateChange = () => {
      loadClientMeals();
    };

    window.addEventListener('selectedDateChanged', handleDateChange);
    loadClientMeals();
    return () => {
      window.removeEventListener('selectedDateChanged', handleDateChange);
    };
  }, []);

  const onAddMeal = (section) => {
    setModalSection(section);
    setIsModalOpen(true);
  };

  // MealsContext로부터 공급받은 데이터를 활용
  const { refreshComponents } = useContext(MealsContext);

  const saveMeal = async (selectedFood, selectedMealType, selectedDate) => {
    console.log("👉 선택된 식사 종류:", selectedMealType);
    try {
      // 회원번호를 localStorage에서 가져옴
      const userData = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');

      // ✅ 식사 종류 허용 목록 확인
      const allowedMealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
      if (!allowedMealTypes.includes(selectedMealType)) {
        alert('유효하지 않은 식사 종류입니다.');
        return;
      }

      // ✅ 유효한 날짜인지 확인
      const parsedDate = selectedDate ? new Date(selectedDate) : new Date();
      if (isNaN(parsedDate)) {
        console.error('선택된 날짜가 유효하지 않습니다:', selectedDate);
        alert('날짜가 올바르지 않습니다.');
        return;
      }

      // ✅ 형식을 맞춘 날짜 (yyyy-MM-dd)
      const formattedDate = parsedDate.toISOString().split('T')[0];

      // mealData를 DB로 전송하기 위한 변수 설정
      const mealData = {
        memNo: userData.memNo,
        dietDate: formattedDate, // 예: "2025-03-26"
        mealType: selectedMealType, // 예: "Lunch"
        name: selectedFood.name,
        calories: selectedFood.calories,
        protein: selectedFood.protein,
        carbs: selectedFood.carbs,
        fat: selectedFood.fat,
        memo: ''
      };

      // 식단 기록을 위해 백엔드 서버에 POST 전송 보내기
      const response = await axios.post(`${process.env.REACT_APP_SPRING_IP}api/meals`, mealData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // 식단 저장
      const savedMeal = response.data;
      console.log('식단이 저장되었습니다:', savedMeal);

/*      // 새로운 식단을 표시하기 위해 상태 업데이트
      setSections((prevSections) => ({
        ...prevSections,
        [modalSection]: [...prevSections[modalSection], savedMeal]
      }));*/

      // 성공시 모달 닫기
      closeModal();
/*      window.location.reload();*/
      // 식단 데이터 다시 로드
      // MealsContext의 refreshComponents 함수를 사용하여
      loadClientMeals();
      // summary와 foodDiary 컴포넌트만 리렌더링하도록 트리거
      refreshComponents(['summary', 'foodDiary']);

    } catch (error) {
      console.error('식단 저장에 실패했습니다:', error);
      alert('식단 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const addMealToSection = async (meal, mealType) => {
    saveMeal(meal, mealType, selectedDate);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalSection('');
  };

  // 식단 삭제
  const handleDeleteMeal = async (mealId) => {
    try {
      // 식단 삭제를 위한 API 호출
      await axios.delete(`${process.env.REACT_APP_SPRING_IP}api/meals/${mealId}`);

      // 식단 삭제 후 식단자료를 다시 로드
      loadClientMeals();
      refreshComponents(['summary', 'foodDiary']);
    } catch (error) {
      console.error('식단 자료 삭제에 실패했습니다:', error);
      alert('식단 자료 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 모달 창에서 식단자료 검색 후 추가시 바로 DB에 저장되는 함수
  const handleSaveMeal = async (mealData) => {
    try {
      // 식단자료 DB저장을 위한 데이터 가공
      const mealToSave = {
        ...mealData,
        mealType: modalSection,
        memNo: memNo
      };

      // 식단 저장 API
      await axios.post(`${process.env.REACT_APP_SPRING_IP}api/meals`, mealToSave);

      // 모달 닫기
      setIsModalOpen(false);

      // 저장 결과 출력을 위해 컴포넌트 리렌더링
      loadClientMeals();
    } catch (error) {
      console.error('식단 자료 삭제에 실패했습니다:', error);
      alert('식단 자료 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
      <div className="meals-container p-6">
        <h1 className="text-2xl font-bold mb-6">나의 식단 추가</h1>

        {/* Show loading state */}
        {isLoading && (
            <div className="text-center py-4">
              <p>로딩중...</p>
            </div>
        )}

        {/* Show error message */}
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        {/* Meal sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MealSection title="아침" meals={sections.Breakfast} onAddMeal={onAddMeal} onDeleteMeal={handleDeleteMeal} />
          <MealSection title="점심" meals={sections.Lunch} onAddMeal={onAddMeal} onDeleteMeal={handleDeleteMeal} />
          <MealSection title="저녁" meals={sections.Dinner} onAddMeal={onAddMeal} onDeleteMeal={handleDeleteMeal} />
          <MealSection title="간식" meals={sections.Snack} onAddMeal={onAddMeal} onDeleteMeal={handleDeleteMeal} />
        </div>

        {/* Add Meal Modal */}
        {isModalOpen && <AddMealModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveMeal} onAddMeal={addMealToSection} sectionTitle={modalSection} foods={foods} mealType={modalSection}/>}
      </div>
  );
};

export default Meals;