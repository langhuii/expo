import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const BASE_URL = "https://43eca66ba2c5.ngrok-free.app"; //백주소

export const fetchRecommendations = async (emotion) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await axios.post(
      `${BASE_URL}/api/recommend`,
      { emotion },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data.recommendations; // 배열로 응답
  } catch (err) {
    console.error("추천 콘텐츠 불러오기 실패:", err);
    return null;
  }
};
