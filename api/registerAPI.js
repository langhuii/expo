// 📁 registerApi.js - 회원가입 관련 API 함수 분리

import axios from "axios";
import { Alert } from "react-native";

const API_BASE = "http://172.16.105.189:8080/api";

export const sendVerificationCode = async (email) => {
  try {
    await axios.post(`${API_BASE}/users/send-code`, null, {
      params: { email },
    });
    Alert.alert("인증 코드 전송", "입력한 이메일로 인증 코드가 전송되었습니다.");
  } catch (error) {
    Alert.alert("오류", "인증 코드 전송에 실패했습니다.");
  }
};

export const verifyEmailCode = async (email, code, onSuccess) => {
  try {
    await axios.post(`${API_BASE}/users/verify-email`, null, {
      params: { email, code },
    });
    Alert.alert("성공", "이메일 인증이 완료되었습니다.");
    if (onSuccess) onSuccess();
  } catch (error) {
    Alert.alert("실패", "인증 코드가 올바르지 않거나 인증되지 않았습니다.");
  }
};

export const registerUser = async (userInfo, onSuccess) => {
  const { username, birthdate, email, password, phoneNumber } = userInfo;
  if (!username || !birthdate || !email || !password || !phoneNumber) {
    Alert.alert("입력 오류", "모든 정보를 입력하세요.");
    return;
  }

  try {
    await axios.post(`${API_BASE}/users/signup`, {
      username,
      birthdate,
      email,
      password,
      phoneNumber,
    });

    Alert.alert("회원가입 성공", "로그인 화면으로 이동합니다.");
    if (onSuccess) onSuccess();
  } catch (error) {
    console.error("회원가입 오류:", error.response?.data || error.message);
    if (error.response?.status === 400) {
      Alert.alert("회원가입 실패", error.response?.data?.message || "입력 형식을 확인해주세요.");
    } else {
      Alert.alert("서버 오류", "서버와 연결할 수 없습니다.");
    }
  }
};