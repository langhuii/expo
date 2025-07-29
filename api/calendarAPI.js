import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = "http://172.16.105.189:8080/api/calendar";

// 🟢 사용자 캘린더 조회
export const fetchCalendarEntries = async () => {
  const token = await AsyncStorage.getItem("token");
  const userId = await AsyncStorage.getItem("userId");
  if (!token || !userId) throw new Error("토큰 또는 userId 없음");

  const res = await axios.get(`${API_BASE}/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// 🟡 캘린더 항목 추가/수정
export const saveCalendarEntry = async (userId, date, comment, emoji) => {
  const token = await AsyncStorage.getItem("token");
  if (!token || !userId) throw new Error("토큰 또는 userId 없음");

  await axios.post(
    `http://172.16.105.189:8080/api/calendar/${userId}`,
    { date, comment, emoji },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};


// 🔴 캘린더 항목 삭제
export const deleteCalendarEntry = async (date) => {
  const token = await AsyncStorage.getItem("token");
  const userId = await AsyncStorage.getItem("userId");
  if (!token || !userId) throw new Error("토큰 또는 userId 없음");

  await axios.delete(`${API_BASE}/${userId}/${date}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// 🟠 코멘트 수정 (PATCH)
export const patchCalendarComment = async (userId, date, comment) => {
  const token = await AsyncStorage.getItem("token");
  if (!token || !userId) throw new Error("토큰 또는 userId 없음");

  await axios.patch(
    `${API_BASE}/${userId}/${date}/comment`,
    comment,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "text/plain",
      },
    }
  );
};
