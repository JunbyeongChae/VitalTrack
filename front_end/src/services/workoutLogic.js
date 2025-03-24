import axios from "axios";

export const getScheduleListDB = async(params)=>{
    try {
        //console.log('Request Params:', params);  // params 값 확인
        const response = await axios.get('api/workout/getScheduleList', { params }); // axios.get('/api/workout/getScheduleList?memNo='+memNo)
        //console.log(response.data)
        return response
    } catch (error) {
        console.error('Error fetching schedules:', error)
    }
}

export const insertScheduleDB = async(schedule) =>{
    try {
        const response = await axios.post('api/workout/insertSchedule', schedule)
        //console.log(response)
        return response
    } catch (error) {
        throw error
    }
}

export const updateScheduleDB = async(schedule) =>{
    try {
        const response = await axios.put('api/workout/updateSchedule', schedule)
        //console.log(response)
        return response
    } catch (error) {
        throw error
    }
}

export const updateIsFinishedDB = async(schedule) =>{
    try {
        const response = await axios.put('api/workout/updateIsFinished', schedule)
        //console.log(response)
        return response
    } catch (error) {
        throw error
    }
}

export const deleteScheduleDB = async(params) =>{
    try {
        const response = await axios.delete('api/workout/deleteSchedule', { params }); // axios.get('/api/workout/getScheduleList?scheduleId='+scheduleId+'&memNo='+memNo)
        return response
    } catch (error) {
        throw error
    }
}

export const getFutureWorkoutDB = async(params) => {
    try {
        const response = await axios.get('api/workout/getFutureWorkout', { params }); // axios.get('/api/workout/getScheduleList?scheduleId='+scheduleId+'&memNo='+memNo)
        return response
    } catch (error) {
        throw error
    }
}

export const getLastWorkoutDB = async(params)=>{
    try {
        const response = await axios.get('api/workout/getLastWorkout', { params }); // axios.get('/api/workout/getScheduleList?scheduleId='+scheduleId+'&memNo='+memNo)
        return response
    } catch (error) {
        throw error
    }
}

export const getLast7WorkoutsDB = async(params)=>{
    try{
        const response = await axios.get('api/workout/getLast7Workouts', { params })
        //console.log(response)
        return response
    } catch (error){
        throw error
    }
}