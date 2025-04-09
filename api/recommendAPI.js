import axios from 'axios';

const BASE_URL = "http://192.168.0.100:8080"; 

export const fetchRecommendations = async (emotion) => {
  try {
    const res = await axios.get(`${BASE_URL}/recommendation/${emotion}`);
    return res.data; // 배열로 반환됨
  } catch (err) {
    console.error("추천 콘텐츠 불러오기 실패:", err);
    return null;
  }
};
