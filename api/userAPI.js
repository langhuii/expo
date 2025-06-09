import axios from 'axios';

// Java 백엔드 서버 주소로 수정
const BASE_URL = "http://124.50.249.203:8080";

/**
 * 사용자 정보 가져오기 (GET)
 */
export const fetchUserProfile = async (userId) => {
  try {
    const res = await axios.get(`${BASE_URL}/user/${userId}`); // ✅ URL은 fetch 방식 유지
    return res.data;
  } catch (err) {
    console.error("프로필 불러오기 오류:", err);
    return null;
  }
};

/**
 * 사용자 정보 수정하기 (PUT - 이름/이미지)
 */
export const updateUserProfile = async (userId, name, imageUri) => {
  const formData = new FormData();
  formData.append("name", name);

  if (imageUri) {
    formData.append("profileImage", {
      uri: imageUri,
      name: "profile.jpg",
      type: "image/jpeg",
    });
  }

  try {
    const res = await axios.put(`${BASE_URL}/user/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    console.error("프로필 업데이트 실패:", err);
    return null;
  }
};
