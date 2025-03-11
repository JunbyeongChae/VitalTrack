import React from 'react'

const WorkoutSummary = () => {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    const todayString = today.toLocaleDateString('ko-KR', options);

  return (
      <>
          <div className="workout-box_title  flex flex-col items-center justify-center mt-10">
              <h3 className="text-center text-lg">{todayString}, 오늘</h3>
              <div className="workout-box content-center border border-gray-300 rounded-3xl p-5 w-full h-full">
                  {1 ? (
                      <>
                          <div className="flex items-center justify-center space-x-4">
                              <i className="text-teal-500 fa-solid fa-person-swimming mr-4 text-5xl"></i>
                              <div className="flex flex-col items-center justify-center">
                                  <div className="font-bold">수영</div>
                                  <div className="flex items-center justify-center space-x-4 mt-3">
                                      <div>01:45:00</div>
                                      <div>1,000 KCAL</div>
                                  </div>
                              </div>
                          </div>
                      </>
                  ) : (
                      <p>운동 계획이 없습니다.</p>
                  )}
              </div>
          </div>
          <div className="workout-box_title flex flex-col items-center justify-center mt-10">
              <h3 className="text-center text-lg">최근 운동</h3>
              <div
                  className="workout-box  items-center justify-center border border-gray-300 rounded-3xl p-5 w-full h-full">
                  <div className="flex items-center justify-center space-x-4">
                      <i className="text-teal-500 fa-solid fa-person-running mr-4 text-5xl"></i>
                      <div className="flex flex-col items-center justify-center">
                          <div className="font-bold">실외 달리기</div>
                          <div className="flex items-center justify-center space-x-4 mt-3">
                              <div>01:00:00</div>
                              <div>650 KCAL</div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </>
  )
}

export default WorkoutSummary