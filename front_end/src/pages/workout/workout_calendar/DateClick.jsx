import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useScheduleContext } from '../Context';
import ScheduleModal from './ScheduleModal';
import { Button, Form, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCirclePlus, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { deleteScheduleDB, updateIsFinishedDB } from '../../../services/workoutLogic';

const DateClick = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const { memNo } = user;
  const { schedules, setSchedules, selectedDate, setSelectedDate, setSignal, signal, setDateSchedules, dateSchedules, selectedSchedule, setSelectedSchedule, modalMode, setModalMode } = useScheduleContext();
  const [isFinished, setIsFinished] = useState(false);
  const [show, setShow] = useState(false);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  useEffect(() => {
    // 선택한 날짜에 해당하는 일정들 필터링
    const filteredSchedules = schedules.filter((schedule) => {
      const startDate = schedule.start.split('T')[0];
      return startDate === selectedDate; //string & string
    }); //end of schedulesOnSelectedDate

    // start 시간을 기준으로 일정 정렬 (오름차순)
    const sortedSchedules = filteredSchedules.sort((a, b) => {
      const startA = new Date(a.start);
      const startB = new Date(b.start);
      return startA - startB; // 오름차순 정렬
    });

    // 선택한 날짜에 해당하는 이벤트가 있다면 dateSchedules에 설정
    if (sortedSchedules.length > 0) {
      setDateSchedules(sortedSchedules);
    } else {
      setDateSchedules([]); // 선택한 날짜에 일정이 없으면 null로 설정
    }
  }, [schedules, selectedDate]); //setDateSchedules를 직접 호출하는 schedules, selectedDate를 의존성 배열로!!

  // '+' 버튼 클릭 -> 새 일정 등록 모달 오픈
  const handleAddSchedule = () => setModalMode('insert');
  // 일정명 클릭 -> 수정 모달 오픈
  const scheduleClick = (schedule) => {
    setModalMode('update');
    setSelectedSchedule(schedule);
  };
  // 운동 완료 체크 클릭
  const checkClick = async (schedule) => {
    //운동 완료!
    if (!schedule.extendedProps.isFinished) {
      setSelectedSchedule(schedule); // 어떤 이벤트인지 저장 -> handleSave()에서 사용
      setShow(true); // 운동 소요시간 모달 열기
    } else {
      // 완료 해제 & 소요시간 삭제
      const upd_unFinishedSch = {
        isFinished: !schedule.extendedProps.isFinished,
        workoutTimeMin: 0,
        memNo: memNo,
        scheduleId: schedule.id
      };
      const response = await updateIsFinishedDB(upd_unFinishedSch);
      //console.log(response.status)
      if (response.status === 200) {
        setSignal((prev) => prev + 1);
      }
    }
  };
  // 운동 소요 시간 저장
  const handleSave = async () => {
    // 시간을 분으로 변환하여 처리할 때
    const workoutTimeMin = Number(hours) * 60 + Number(minutes);

    if (workoutTimeMin && !isNaN(workoutTimeMin)) {
      const upd_unFinishedSch = {
        isFinished: !selectedSchedule.extendedProps.isFinished,
        workoutTimeMin: workoutTimeMin,
        memNo: memNo,
        scheduleId: selectedSchedule.id
      };
      const response = await updateIsFinishedDB(upd_unFinishedSch);
      if (response.status === 200) {
        setSignal((prev) => prev + 1);
      }
      handleClose();
    } else {
      alert('‼유효한 시간을 입력해주세요!');
    }
  }; // end of handleSave()

  //일정 삭제
  const deleteSchedule = async (schedule) => {
    const response = await deleteScheduleDB({
      scheduleId: schedule.id,
      memNo: memNo
    });
    if (response.status === 200) {
      setSignal((prev) => prev + 1);
    }
  };

  // Modal 닫기
  const handleClose = () => {
    setShow(false);
    setSelectedSchedule(null);
    setHours(0);
    setMinutes(0);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white bg-opacity-95 backdrop-blur-md pl-6 pr-6 shadow-lg rounded-t-2xl w-full md:w-3/5 h-[390px] border border-gray-300 box-border flex flex-col justify-between" // 수정 내용: 겹침 방지 및 투명도 완화
      >
        <div className="flex mt-5">
          <h2 className="text-center text-xl text-gray-900">
            {new Date(selectedDate).getFullYear()}년 {new Date(selectedDate).getMonth() + 1}월 {new Date(selectedDate).getDate()}일 일정
          </h2>
          <button onClick={() => setSelectedDate(null)} className="text-xl ml-auto mr-3">
            <FontAwesomeIcon icon={faXmark} className="text-gray-600" />
          </button>
        </div>
        <div className="mt-6 overflow-y-auto"> {/* 수정 내용: 스크롤 대응 */}
          {dateSchedules && dateSchedules.length > 0 ? (
            dateSchedules.map((schedule, index) => (
              <div key={index} className="flex items-center space-x-2 btn mt-2 cursor-default transition-transform duration-100 hover:bg-gray-200 p-2 rounded-lg group border-0">
                <button className="cursor-pointer mr-2 border-none" onClick={() => checkClick(schedule)} aria-pressed={schedule.isFinished}>
                  <FontAwesomeIcon icon={faCircleCheck} className={`border-2 rounded-full ${schedule.extendedProps.isFinished ? 'text-gray-500 border-gray-500' : 'border-gray-500 text-white'}`} />
                </button>
                {/* 색상 표시 부분 */}
                <div
                  style={{
                    backgroundColor: schedule.color,
                    width: '5px',
                    height: '40px',
                    borderRadius: '15%',
                    marginRight: '5px' // 타이틀과 색상 간격
                  }}
                />
                {/* 제목과 시간 정보 부분 */}
                <div className="flex flex-grow items-center">
                  <div className="flex-col" onClick={() => scheduleClick(schedule)}>
                    <p>{schedule.title}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(schedule.start).toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="text-gray-700 ml-4">
                    {schedule.extendedProps.workoutTimeMin > 0 && (
                      <p className="ml-10">
                        [ 운동 소요시간 {String(Math.floor(schedule.extendedProps.workoutTimeMin / 60)).padStart(2, '0')}:{String(schedule.extendedProps.workoutTimeMin % 60).padStart(2, '0')}
                        :00 ]
                      </p>
                    )}
                  </div>
                </div>
                <div className="items-center ml-auto cursor-pointer text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <FontAwesomeIcon icon={faTrash} className="text-lg mr-5" onClick={() => deleteSchedule(schedule)} />
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center">
              <div
                style={{
                  backgroundColor: '#c3c3c3',
                  width: '3px',
                  height: '25px',
                  borderRadius: '15%',
                  marginRight: '10px'
                }}
              />
              <p className="text-gray-500 text-lg"> 일정이 없습니다.</p>
            </div>
          )}
        </div>
        <div className="flex ml-auto mt-auto mb-10">
          <button onClick={handleAddSchedule} className="text-teal-400 text-4xl cursor-pointer transition-transform duration-100 hover:text-teal-600">
            <FontAwesomeIcon icon={faCirclePlus} />
          </button>
        </div>
      </motion.div>

      {modalMode && <ScheduleModal />}

      {/*========================={{ 운동 완료 체크시 >> 운동 소요시간 입력받기 }}==================================*/}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>운동 소요시간</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="workoutTimeMin">
            <div className="flex gap-2">
              <Form.Control type="number" placeholder="시간" value={hours} onChange={(e) => setHours(e.target.value)} min="0" className="border border-gray-400 w-16 text-center" />
              시간
              <Form.Control type="number" placeholder="분" value={minutes} onChange={(e) => setMinutes(e.target.value)} min="0" max="59" className="border border-gray-400 w-16 text-center" />분
            </div>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="space-x-2 mt-4">
          <Button variant="primary" onClick={handleSave}>
            저장
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            취소
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DateClick;
