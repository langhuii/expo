// 📁 loginApi.js - 로그인 관련 API 함수 분리

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const API_BASE = "http://172.16.105.189:8080/api";

export const loginUser = async (email, password, onSuccess) => {
  if (!email || !password) {
    Alert.alert("입력 오류", "이메일과 비밀번호를 입력하세요.");
    return;
  }

  try {
    const response = await axios.post(`${API_BASE}/auth/login`, { email, password });
    const data = response.data;

    if (!data.token || !data.id) {
      Alert.alert("로그인 실패", "등록되지 않은 회원이거나 응답 데이터에 문제가 있습니다.");
      return;
    }

    // 🔐 토큰 및 사용자 ID 저장
    await AsyncStorage.setItem("token", data.token);
    await AsyncStorage.setItem("userId", data.id.toString());

    console.log("🔐 토큰 저장됨:", data.token);
    console.log("👤 userId 저장됨:", data.id);

    if (onSuccess) onSuccess();
  } catch (error) {
    console.error("로그인 오류:", error);
    const message = error.response?.data?.message || "로그인 중 문제가 발생했습니다.";
    Alert.alert("로그인 실패", message);
  }
};
