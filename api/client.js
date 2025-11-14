import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = "https://43eca66ba2c5.ngrok-free.app/api"; // ngrok 주소 + /api

export const client = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

// 요청마다 토큰 자동 첨부
client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));
