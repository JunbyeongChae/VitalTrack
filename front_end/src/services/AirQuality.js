import React, { useEffect, useState } from "react";

const AirQuality = () => {
  const [airQuality, setAirQuality] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_KEY = "ab855123509d75ec1967804a51c1e2cc";
    const fetchAirQuality = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=37.5665&lon=126.9780&appid=${API_KEY}`
        );
        const data = await response.json();

        if (data.list && data.list.length > 0) {
          setAirQuality(data.list[0].main.aqi);
        }
      } catch (error) {
        console.error("미세먼지 데이터를 가져오는 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAirQuality();
  }, []);

  // AQI(대기질 지수) 등급 정의
  const getAirQualityLabel = (aqi) => {
    switch (aqi) {
      case 1: return { label: "좋음", color: "green" };
      case 2: return { label: "보통", color: "blue" };
      case 3: return { label: "나쁨", color: "orange" };
      case 4: return { label: "매우 나쁨", color: "red" };
      case 5: return { label: "위험", color: "purple" };
      default: return { label: "알 수 없음", color: "gray" };
    }
  };

  const airQualityInfo = getAirQualityLabel(airQuality);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-gray-100">
          <i className="fas fa-wind text-gray-600"></i>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">오늘의 미세먼지</p>
          {loading ? (
            <h3 className="text-lg font-semibold text-gray-900">불러오는 중...</h3>
          ) : (
            <h3 className="text-lg font-semibold text-gray-900" style={{ color: airQualityInfo.color }}>
              {airQualityInfo.label}
            </h3>
          )}
        </div>
      </div>
    </div>
  );
};

export default AirQuality;
