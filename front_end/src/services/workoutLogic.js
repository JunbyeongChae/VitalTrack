import axios from "axios";

// 공통 요청 헤더에 토큰 추가
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token || token === "null" || token === "undefined") {
    return {}; // 헤더 제거
  }
  return { Authorization: `Bearer ${token}` };
};

export const getScheduleListDB = async (params) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_SPRING_IP}api/workout/getScheduleList`, {
      params,
      headers: getAuthHeaders()
    });
    return response;
  } catch (error) {
    console.error("Error fetching schedules:", error);
  }
};

export const insertScheduleDB = async(schedule) =>{
    try {
        const response = await axios.post(`${process.env.REACT_APP_SPRING_IP}api/workout/insertSchedule`, schedule)
        //console.log(response)
        return response
    } catch (error) {
        throw error
    }
}

export const updateScheduleDB = async(schedule) =>{
    try {
        const response = await axios.put(`${process.env.REACT_APP_SPRING_IP}api/workout/updateSchedule`, schedule)
        //console.log(response)
        return response
    } catch (error) {
        throw error
    }
}

export const updateIsFinishedDB = async(schedule) =>{
    try {
        const response = await axios.put(`${process.env.REACT_APP_SPRING_IP}api/workout/updateIsFinished`, schedule)
        //console.log(response)
        return response
    } catch (error) {
        throw error
    }
}

export const deleteScheduleDB = async(params) =>{
    try {
        const response = await axios.delete(`${process.env.REACT_APP_SPRING_IP}api/workout/deleteSchedule`, {
      params,
      headers: getAuthHeaders()
    }); // axios.get('/api/workout/getScheduleList?scheduleId='+scheduleId+'&memNo='+memNo)
        return response
    } catch (error) {
        throw error
    }
}

export const getFutureWorkoutDB = async(params) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_SPRING_IP}api/workout/getFutureWorkout`, {
      params,
      headers: getAuthHeaders()
    }); // axios.get('/api/workout/getScheduleList?scheduleId='+scheduleId+'&memNo='+memNo)
        return response
    } catch (error) {
        throw error
    }
}

export const getLastWorkoutDB = async(params)=>{
    try {
        const response = await axios.get(`${process.env.REACT_APP_SPRING_IP}api/workout/getLastWorkout`, {
      params,
      headers: getAuthHeaders()
    }); // axios.get('/api/workout/getScheduleList?scheduleId='+scheduleId+'&memNo='+memNo)
        return response
    } catch (error) {
        throw error
    }
}

export const getLast7WorkoutsDB = async(params)=>{
    try{
        const response = await axios.get(`${process.env.REACT_APP_SPRING_IP}api/workout/getLast7Workouts`, {
      params,
      headers: getAuthHeaders()
    });
        //console.log(response)
        return response
    } catch (error){
        throw error
    }
}