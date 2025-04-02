// api/emotionAPI.js
const BASE_URL = "http://192.168.0.100:8080"; // Java 서버 주소

export const fetchEmotionStats = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/emotion-stats?userId=${userId}`);
    if (!response.ok) throw new Error("서버 응답 실패");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("감정 통계 불러오기 오류:", error);
    return null;
  }
};
