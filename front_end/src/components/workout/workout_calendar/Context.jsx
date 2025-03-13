import { createContext, useContext, useState } from 'react';

const Context = createContext()

export const ScheduleProvider = ({ children }) => {
    const [schedules, setSchedules] = useState([]);
    const [selectedDate, setSelectedDate] = useState();
    const [dateSchedules, setDateSchedules] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState({});
    const [modalMode, setModalMode] = useState('') //insert (등록) or update (수정)
    const [showModal, setShowModal] = useState(false)

    return (
        <Context.Provider value={{
            schedules, setSchedules, selectedDate, setSelectedDate, dateSchedules, setDateSchedules,
            selectedSchedule, setSelectedSchedule,
            modalMode, setModalMode, showModal, setShowModal }}>
            {children}
        </Context.Provider>
    )
}

export const useScheduleContext = () => useContext(Context)