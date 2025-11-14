// 📁 loginApi.js - 로그인 관련 API 함수 분리

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const API_BASE = "https://43eca66ba2c5.ngrok-free.app/api";

export const loginUser = async (email, password, onSuccess) => {
  if (!email || !password) {
    Alert.alert("입력 오류", "이메일과 비밀번호를 입력하세요.");
    return;
  }

  try {
    const response = await axios.post(`${API_BASE}/auth/login`, { email, password });
    const data = response.data;

    console.log("📦 응답 전체:", response);
    console.log("📦 응답 데이터:", data);

    // 서버 응답: { id, email, token, username }
    const token = data?.token;
    const userId = data?.userId ?? data?.id; // id 또는 userId 모두 대응
    const userEmail = data?.email ?? "";
    const username = data?.username ?? "";

    if (!token || !userId) {
      Alert.alert("로그인 실패", "등록되지 않은 회원이거나 응답 데이터에 문제가 있습니다.");
      return;
    }

    // 🔐 토큰 및 사용자 정보 저장
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("userId", String(userId));
    if (userEmail) await AsyncStorage.setItem("email", userEmail);
    if (username) await AsyncStorage.setItem("username", username);

    console.log("🔐 토큰 저장됨:", token);
    console.log("👤 userId 저장됨:", userId);

    onSuccess?.();
  } catch (error) {
    console.error("로그인 오류:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    const message =
      error.response?.data?.message ||
      (typeof error.response?.data === "string" && error.response?.status === 404
        ? "서버 주소가 잘못되었거나 ngrok 터널이 종료되었습니다."
        : "로그인 중 문제가 발생했습니다.");

    Alert.alert("로그인 실패", message);
  }
};
