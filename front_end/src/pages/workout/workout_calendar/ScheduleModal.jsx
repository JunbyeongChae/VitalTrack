import React, {useEffect, useMemo, useState} from 'react'
import {useScheduleContext} from "./Context";
import {Button, Form, Modal} from "react-bootstrap";
import Select from "react-select/base";
import AsyncSelect from "react-select/async";
import CreatableSelect from "react-select/creatable";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleRight, faCheck, faXmark} from "@fortawesome/free-solid-svg-icons";


const ScheduleModal = () => {
    const {schedules, setSchedules, selectedDate, selectedSchedule,
        modalMode, setModalMode, showModal, setShowModal} = useScheduleContext()





    const pastelColors = [
        '#76c3c5', // Pastel Green
        '#ff8d8d', // Pastel Red
        '#f7bc52', // Pastel Orange
        '#e6e648', // Pastel Yellow
        '#a4c4ff', // Pastel Blue
        '#ffbaf7', // Pastel Pink
        '#c78dfe'  // Pastel Purple
    ]
    const currentHour = new Date().getHours()
    const [scheduleId, setScheduleId] = useState(0)
    const [title, setTitle] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("")
    const [allDay, setAllDay] = useState(false)
    const [scheduleColor, setScheduleColor] = useState(pastelColors[0])
    const [existingScheduleId, setExistingScheduleId] = useState(null) // 수정할 이벤트 ID 상태로 관리
    const [isFinished, setIsFinished] = useState(false) //사용자가 운동 완료 체크할수있도록
    const [durationMinutes, setDurationMinutes] = useState(0)
    const [workoutTypes, setWorkoutTypes] = useState([])
    const [selectedWorkoutType, setSelectedWorkoutType] = useState(null)

    useEffect(() => {
        // JSON 파일을 로드하여 운동 종목을 설정
        fetch('/workoutTypes.json') //위치: /public/workoutTypes.json
            .then((response) => response.json())
            .then((data) =>{
                setWorkoutTypes(data)
            })
            .catch((error) => console.error('운동 종목 불러오기 오류:', error));
    }, [])

    useEffect(() => {
        if(modalMode === 'insert') { //일정 추가
            addSchedule()
        }
        else if(modalMode === 'update') { //일정 수정
            updateSchedule(selectedSchedule)
        }
    }, [modalMode])
    
    //일정 추가
   const addSchedule = () => {
        setStartTime(currentHour < 10 ? `0${currentHour+1}:00` : `${currentHour+1}:00`); // hour를 startTime에 반영 (2자리로 표시)
        setEndTime(currentHour < 10 ? `0${currentHour+2}:00` : `${currentHour+2}:00`); // hour를 startTime에 반영 (2자리로 표시)
        setStartDate(selectedDate)
        setEndDate(selectedDate)
        setIsFinished(false)

        const currentScheduleId = schedules.length > 0 ? schedules[schedules.length - 1].id + 1 : 1;
        setScheduleId(currentScheduleId)

        setShowModal(true)
    }

    //일정 수정
   const updateSchedule = (schedule) => {
        setSelectedWorkoutType({label: schedule.title, value: schedule.extendedProps.workoutId})
        setExistingScheduleId(schedule.id)
        setIsFinished(schedule.extendedProps.isFinished)
        setDurationMinutes(schedule.extendedProps.durationMinutes)
        // startTime, endTime은 schedule.start와 schedule.end에서 시간 정보를 추출해서 설정
        const start = new Date(schedule.start);
        const end = new Date(schedule.end);
        // 시간을 두 자릿수로 맞추기 위해 'getHours'와 'getMinutes' 사용
        const startTimeFormatted = `${start.getHours() < 10 ? '0' : ''}${start.getHours()}:${start.getMinutes() < 10 ? '0' : ''}${start.getMinutes()}`;
        const endTimeFormatted = `${end.getHours() < 10 ? '0' : ''}${end.getHours()}:${end.getMinutes() < 10 ? '0' : ''}${end.getMinutes()}`;
        setStartTime(startTimeFormatted)
        setEndTime(endTimeFormatted)
        // 날짜는 toISOString()으로 형식화하여 설정
        setStartDate(start.toISOString().split('T')[0])
        setEndDate(end.toISOString().split('T')[0])
        setAllDay(schedule.allDay)
        // 색상 및 모달 표시 상태 설정
        setScheduleColor(schedule.color)
        setShowModal(true)
   }



    const handleSave = () => {
        if(!selectedWorkoutType) {
            alert('운동 종목을 선택하세요!')
            return
        }
        let newSchedule
        //console.log(selectedWorkoutType)
        if(modalMode === 'insert') {
            newSchedule = {
                id: scheduleId, // 새로 추가하는 이벤트는 id가 필요
                title : selectedWorkoutType.label,
                start: allDay ? startDate : `${startDate}T${startTime}`,
                end: allDay ? endDate : `${endDate}T${endTime}`,
                color: scheduleColor,
                allDay,
                extendedProps: {
                    isFinished: false, // 기본값 설정
                    durationMinutes: '',
                    workoutId: selectedWorkoutType.value
                }
            }
            setSchedules([...schedules, newSchedule])
            console.log("scheduleId: ", scheduleId)
        } else if(modalMode === 'update') {
            // 수정하는 경우
            newSchedule = {
                id: existingScheduleId, // 기존 이벤트의 id 그대로 사용
                title: selectedWorkoutType.label,
                start: allDay ? startDate : `${startDate}T${startTime}`,
                end: allDay ? endDate : `${endDate}T${endTime}`,
                color: scheduleColor,
                allDay,
                extendedProps: {
                    isFinished: isFinished,
                    durationMinutes: durationMinutes,
                    workoutId: selectedWorkoutType.value
                }
            }
            setSchedules(schedules.map(schedule => schedule.id === existingScheduleId ? newSchedule : schedule)); // 기존 이벤트 수정
            console.log("existingScheduleId: ",existingScheduleId)
        }
        console.log(modalMode)
        handleClose()
    } //end of handleSave

    const handleClose = ()=> {
        setShowModal(false)
        setAllDay(false)
        setScheduleColor(pastelColors[0])
        setTitle("")
        setModalMode('')
        setIsFinished(false)
        setSelectedWorkoutType(null)
    }

  return (
    <>
        <Modal show={showModal} onHide={handleClose} centered>

            <Modal.Header closeButton className="custom-header">
                <Button
                    variant="primary"
                    onClick={handleClose}
                    className="border-0 p-0"
                >
                    <FontAwesomeIcon
                        icon={faXmark}
                        className="border-0"
                    />
                </Button>
                <Modal.Title>운동 일정</Modal.Title>
                <Button
                    variant="primary"
                    onClick={handleSave}
                    className="border-0 p-0"
                >
                    <FontAwesomeIcon
                        icon={faCheck}
                        className="border-0"
                    />
                </Button>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <CreatableSelect
                            isClearable
                            value={selectedWorkoutType}
                            onChange={setSelectedWorkoutType}
                            placeholder="운동 종목을 선택. Create 금지!! 있는것중에 선택하기"
                            options={workoutTypes.map((workout) => ({
                                value: workout.id,
                                label: workout.name,
                            }))}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3 custom-form-group">
                        <div className="date-time-box left-box">
                            <Form.Control
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                            {!allDay &&
                                <Form.Control
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    step="300" // 5분 단위 - 응 반영 안됨
                                />
                            }
                        </div>
                        <FontAwesomeIcon icon={faAngleRight}/>
                        <div className="date-time-box right-box">
                            <Form.Control
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                            {!allDay &&
                                <Form.Control
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    /*disabled={allDay}*/
                                />
                            }
                        </div>
                        <div>
                            <button
                                type="button"
                                onClick={() => {
                                    setAllDay(!allDay);
                                    setEndTime("");
                                    setStartTime("");
                                }}
                                className={`${allDay ?
                                    "bg-teal-400 text-white border-teal-400" :
                                    "bg-transparent text-gray-600 border-teal-300"
                                } border-2 font-bold rounded-full text-sm w-20 h-9 text-center`}
                            >
                                종일
                            </button>
                        </div>
                    </Form.Group>


                </Form>
                <Form.Group className="mb-3">
                    <Form.Label>색상 선택</Form.Label>
                    <div className="flex gap-2 mt-2 items-center">
                        {pastelColors.map((color) => (
                            <div
                                key={color}
                                className="color-option mr-2"
                                style={{
                                    width: '30px',
                                    height: '30px',
                                    backgroundColor: color,
                                    borderRadius: '50%',
                                    border: scheduleColor === color ? '3px solid #000' : '1px solid #ccc',
                                    cursor: 'pointer'
                                }}
                                onClick={() => setScheduleColor(color)}
                            />
                        ))}
                    </div>
                </Form.Group>
            </Modal.Body>
        </Modal>
    </>
  )
}

export default ScheduleModal