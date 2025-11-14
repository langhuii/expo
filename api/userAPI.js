// api/userAPI.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config/config";

// ✅ 확장자 기반 MIME 타입 및 파일명 처리 함수
const getFileInfo = (uri) => {
  const ext = uri?.split(".").pop()?.toLowerCase() || "jpg";
  return {
    name: `profile.${ext}`,
    type:
      ext === "png"
        ? "image/png"
        : ext === "jpg" || ext === "jpeg"
        ? "image/jpeg"
        : "application/octet-stream",
  };
};

export const updateUserProfile = async (userId, name, imageUri) => {
  const token = await AsyncStorage.getItem("token");
  const formData = new FormData();

  // ✅ username을 직접 필드로 추가
  formData.append("username", name);

  // ✅ 이미지가 있을 경우만 첨부
  if (imageUri) {
    const { name: fileName, type } = getFileInfo(imageUri);
    formData.append("profileImage", {
      uri: imageUri,
      name: fileName,
      type,
    });
  }

  const response = await fetch(`${BASE_URL}/api/users/${userId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      // fetch + FormData는 Content-Type을 자동으로 multipart/form-data로 설정
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
