import { createContext, useContext, useState } from 'react';

const Context = createContext()

export const ScheduleProvider = ({ children }) => {
    const [schedules, setSchedules] = useState([]);
    const [selectedDate, setSelectedDate] = useState();
    const [dateSchedules, setDateSchedules] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState({});
    const [modalMode, setModalMode] = useState('') //insert (등록) or update (수정)
    const [showModal, setShowModal] = useState(false)
    const [signal, setSignal] = useState(0)
    const [lastWeekData, setLastWeekData] = useState({
        weekSchedules: [],
        yoils: [],
        term: [],
        kcal: [],
        kcalMean: 0
    })

    return (
        <Context.Provider value={{
            schedules, setSchedules, selectedDate, setSelectedDate, dateSchedules, setDateSchedules,
            selectedSchedule, setSelectedSchedule, lastWeekData, setLastWeekData,
            modalMode, setModalMode, showModal, setShowModal, signal, setSignal }}>
            {children}
        </Context.Provider>
    )
}

export const useScheduleContext = () => useContext(Context)