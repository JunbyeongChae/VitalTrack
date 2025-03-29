import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import './style/WorkoutCalendar.css';
import DateClick from './DateClick';
import { useScheduleContext } from '../Context';
import { getScheduleListDB } from '../../../services/workoutLogic';

const WorkoutCalendar = () => {
  const user = JSON.parse(localStorage.getItem('user')); //문자열 -> 객체로 반환
  const { memNo } = user;
  const { schedules, setSchedules, selectedDate, setSelectedDate, signal } = useScheduleContext();

  useEffect(() => {
    scheduleList();
    if (selectedDate) {
      //signal로 재랜더링 되도 날짜선택은 유지 -> DateClik.jsx 창 오픈되어있도록 하고픔
      dateClick({ dateStr: selectedDate });
    }
  }, [signal]); // schedules가 변경될 때마다 signal 업데이트됨

  //전체 운동 일정 조회 - DB 경유
  const scheduleList = async () => {
    // /api -> 웹페이지 요청이 아닌 RESTful API 요청임을 명시
    const response = await getScheduleListDB({ memNo });
    let schedules = [];
    if (response) {
      schedules = response.data;
    }

    const formattedSchedules = schedules.map((schedule) => {
      // 'T'로 바꿔서 ISO 형식으로 변환
      const formattedStart = schedule.scheduleStart.replace(' ', 'T'); // start 날짜 변환
      const formattedEnd = schedule.scheduleEnd.replace(' ', 'T'); // end 날짜 변환

      return {
        id: schedule.scheduleId, // 기존 이벤트의 id 그대로 사용
        title: schedule.workoutName,
        start: formattedStart, // 변환된 start 날짜 사용
        end: formattedEnd, // 변환된 end 날짜 사용
        color: schedule.color,
        allDay: schedule.allDay,
        extendedProps: {
          isFinished: schedule.isFinished,
          workoutId: schedule.workoutId,
          workoutTimeMin: schedule.workoutTimeMin,
          kcal: schedule.kcal
        }
      };
    });
    setSchedules(formattedSchedules);
  }; //end of scheduleList

  const dateClick = (info) => {
    const clickedDate = info.dateStr;
    setSelectedDate(clickedDate);
  };
  // 수정 내용: 모바일 대응을 위한 캘린더 높이 처리
  const calHeight = () => {
    if (window.innerWidth < 768) return 'auto'; // 모바일에서는 자동 높이로 설정
    return selectedDate ? 'calc(100vh - 485px)' : '100%';
  };

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: '',
          center: 'title',
          end: 'today prev,next'
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
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                pointerSchedules: 'none', // 이벤트 위에서 커서 반응 없게
                overflow: 'hidden', // 칸 넘어가는 글자 숨김
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis', // 글자 초과시 "..." 처리
                maxWidth: '100%' // 칸 너비에 맞춤
              }}>
              {/* 동그란 점 */}
              {!eventInfo.event.allDay && (
                <div
                  style={{
                    backgroundColor: eventInfo.event.backgroundColor,
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%', // 동그란 모양
                    marginRight: '5px', // 타이틀과 색상 간격
                    flexShrink: 0 // 점이 숨겨지지 않게 고정
                  }}
                />
              )}
              {eventInfo.event.extendedProps.isFinished ? '✅' : ''}
              {/* 타이틀 */}
              <span>{eventInfo.event.title}</span>
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

      {selectedDate && <DateClick />}
    </>
  );
};

export default WorkoutCalendar;
