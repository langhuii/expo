import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const BASE_URL = "http://124.50.249.203:8080"; //백 주소

// 감정 분석 요청
export const analyzeEmotion = async (text) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await axios.post(
      `${BASE_URL}/api/emotion/analyze`,
      { text },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data; // { emotion: "기쁨" }
  } catch (error) {
    console.error("감정 분석 실패:", error);
    return null;
  }
};
export const fetchEmotionStats = async () => {
  const token = await AsyncStorage.getItem("token");

  try {
    const res = await axios.get(`${BASE_URL}/api/emotion/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("❌ 감정 통계 불러오기 실패:", err.message);
    return null;
  }
};