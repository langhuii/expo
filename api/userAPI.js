// api/userAPI.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "../config/config"; // 외부에서 가져옴

// ✅ 확장자 기반 MIME 타입 및 파일명 처리 함수
const getFileInfo = (uri) => {
  const ext = uri?.split(".").pop()?.toLowerCase() || "jpg";
  return {
    name: `profile.${ext}`,
    type:
      ext === "png" ? "image/png" :
      ext === "jpg" || ext === "jpeg" ? "image/jpeg" :
      "application/octet-stream",
  };
};

export const updateUserProfile = async (userId, name, imageUri) => {
  const token = await AsyncStorage.getItem("token");
  const formData = new FormData();

  // ✅ 반드시 username만 담기
  formData.append("data", JSON.stringify({ username: name }));

  // ✅ 이미지가 있을 경우만 첨부
  if (imageUri) {
    const ext = imageUri.split(".").pop().toLowerCase();
    const mimeType = ext === "png"
      ? "image/png"
      : ext === "jpg" || ext === "jpeg"
      ? "image/jpeg"
      : "application/octet-stream";

    formData.append("profileImage", {
      uri: imageUri,
      name: `profile.${ext}`,
      type: mimeType,
    });
  }

  const response = await fetch(`${BASE_URL}/api/users/${userId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      // ❌ content-type 명시하지 마세요 — 자동으로 multipart/form-data로 처리됨
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.log("❌ 실패 응답 내용:", errorText);
    throw new Error("업데이트 실패");
  }

  return await response.json();
};


