import React, {useEffect, useState} from 'react'
import {motion} from "framer-motion";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction"
import {Button, Form, Modal, Popover} from "react-bootstrap"; // needed for dayClick
import "./style/WorkoutCalendar.css"
import DateClick from "./DateClick";
import {useScheduleContext} from "./Context";

const WorkoutCalendar = () => {
    const {schedules, setSchedules, selectedDate, setSelectedDate, dateSchedules, setDateSchedules} = useScheduleContext()

    const dateClick = (info) => {
            const clickedDate = info.dateStr
            setSelectedDate(clickedDate)
            // 선택한 날짜에 해당하는 일정들 필터링
            const schedulesOnSelectedDate = schedules.filter(schedule => {
                if (!schedule.start) return false; // start 값이 없으면 제외
                const scheduleStart = new Date(schedule.start);
                if (isNaN(scheduleStart.getTime())) return false; // 유효하지 않은 날짜 제외
                return scheduleStart.toISOString().split('T')[0] === clickedDate;
            }) //end of schedulesOnSelectedDate

            // 선택한 날짜에 해당하는 이벤트가 있다면 dateSchedules에 설정
            if (schedulesOnSelectedDate.length > 0) {
                setDateSchedules(schedulesOnSelectedDate);
            } else {
                setDateSchedules([]); // 선택한 날짜에 일정이 없으면 null로 설정
            }
    }
    useEffect(() => {
        if (selectedDate) {
            dateClick({ dateStr: selectedDate});
        }
    }, [schedules]) // schedules가 변경될 때만 실행

    const calHeight = ()=>{
        if(selectedDate){
            return "calc(100vh - 400px)"
        }else {
            return "90vh"
        }
    }


    return (
        <>
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        start: '',
                        center: 'title',
                        end: 'today prev,next',
                    }}
                    locale="kr"
                    dayMaxEvents={true} // when too many schedules in a day, show the popover
                    events={schedules}
                    height={calHeight()}
                    dateClick={dateClick}
                    selectable={true} // 날짜 선택 가능
                    editable={true}
                    /*eventChange={handleScheduleChange} // 여기서 핸들러 연결*/
                    dayCellContent={(args) => {
                        // 날짜에서 '일'을 제거한 숫자만 반환
                        return args.date.getDate();
                    }}
                    eventContent={(eventInfo) => {
                       // console.log(eventInfo.event.extendedProps)
                        return (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                pointerSchedules: 'none', // 이벤트 위에서 커서 반응 없게
                                overflow: 'hidden', // 칸 넘어가는 글자 숨김
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis', // 글자 초과시 "..." 처리
                                maxWidth: '100%' // 칸 너비에 맞춤
                            }}>
                                {/* 동그란 점 */}
                                <div
                                    style={{
                                        backgroundColor: eventInfo.event.backgroundColor,
                                        width: '10px',
                                        height: '10px',
                                        borderRadius: '50%',  // 동그란 모양
                                        marginRight: '5px', // 타이틀과 색상 간격
                                        flexShrink: 0 // 점이 숨겨지지 않게 고정
                                    }}
                                />
                                {/* 타이틀 */}
                                <span>
                                    {eventInfo.event.extendedProps.isFinished ? "✅" : ""}
                                    {eventInfo.event.title}
                                </span>
                            </div>
                        );
                    }}
                    /*eventChange={(info) => {
                        // 이벤트 상태 변경 시 처리
                        setSchedules(events.map(event =>
                            event.id === info.event.id ? { ...event, isFinished: info.event.extendedProps.isFinished } : event
                        ));
                    }}*/
                />

            {selectedDate && <DateClick/> }

            </>

            )
            }

            export default WorkoutCalendar