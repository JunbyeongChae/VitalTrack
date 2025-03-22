import React, { useEffect, useState } from 'react';

const AIHealthAnalysis = ({ user }) => {
  const [avgCalories, setAvgCalories] = useState(0);
  const [avgWorkoutTime, setAvgWorkoutTime] = useState(0);
  const [calorieFeedback, setCalorieFeedback] = useState('');
  const [workoutFeedback, setWorkoutFeedback] = useState('');

  useEffect(() => {
    if (!user) return;

    // 더미 데이터 (Mysql의 exerciserecords와 diet_records 기반으로 반응되도록 수정하기!)
    const calorieData = [2200, 2000, 2500, 2300, 2100, 2400, 2150]; // 지난 7일 칼로리 데이터
    const workoutData = [40, 45, 40, 40, 35, 40, 38]; // 지난 7일 운동 시간 (분)

    // 평균 칼로리 & 운동 시간 계산
    const avgCal = Math.round(calorieData.reduce((sum, cal) => sum + cal, 0) / calorieData.length);
    const avgWorkout = Math.round(workoutData.reduce((sum, time) => sum + time, 0) / workoutData.length);

    setAvgCalories(avgCal);
    setAvgWorkoutTime(avgWorkout);

    // 칼로리 피드백 (첫 번째 줄)
    if (avgCal > 2300) {
      setCalorieFeedback('칼로리 섭취가 많아요! 식단 조절 추천 🍽️');
    } else if (avgCal < 1800) {
      setCalorieFeedback('칼로리가 부족해요! 더 영양가 있는 음식 추천 🥗');
    } else {
      setCalorieFeedback('칼로리 섭취 균형이 좋아요! 😊');
    }

    // 운동 피드백 (아래 분리)
    if (avgWorkout < 40) {
      setWorkoutFeedback('운동을 10~15분 더 늘려보세요! 🏋️‍♂️');
    } else {
      setWorkoutFeedback('');
    }
  }, [user]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900">건강 데이터 분석 🔍</h2>
      <p className="mt-2 text-gray-700">📊 이번 주 평균 칼로리 섭취: <strong>{avgCalories} kcal</strong></p>
      <p className="mt-2 text-gray-700">🏋️‍♂️ 평균 운동 시간: <strong>{avgWorkoutTime}분/일</strong></p>
      
      {/* AI 피드백 (칼로리 먼저) */}
      <p className="mt-4 text-gray-700">💡 결과 분석 : <strong>{calorieFeedback}</strong></p>
      
      {/* 운동 피드백을 아래로 분리 */}
      {workoutFeedback && (
        <p className="mt-1 text-gray-700"><strong>{workoutFeedback}</strong></p>
      )}
    </div>
  );
};

export default AIHealthAnalysis;
