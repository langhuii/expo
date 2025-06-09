import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "../config/config";


// ✅ 이미지 확장자 기반 MIME 타입 및 이름 추출
const getFileInfo = (uri, prefix = "profile") => {
  const ext = uri?.split(".").pop()?.toLowerCase() || "jpg";
  return {
    name: `${prefix}.${ext}`,
    type:
      ext === "png" ? "image/png" :
      ext === "jpg" || ext === "jpeg" ? "image/jpeg" :
      "application/octet-stream",
  };
};

// ✅ 토큰 기반 인증 헤더 생성
const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const createGroup = async (groupData) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const formData = new FormData();

    formData.append("creatorId", String(groupData.creatorId));

    const groupInfo = {
      title: groupData.title,
      description: groupData.description,
      tags: groupData.tags,
      emotion: groupData.emotion,
    };
    formData.append("group", JSON.stringify(groupInfo));

    // 이미지 파일 처리
    if (groupData.imageUri) {
      const fileInfo = getFileInfo(groupData.imageUri, "group");

      const imageObject = {
        uri: groupData.imageUri,
        name: fileInfo.name,
        type: fileInfo.type,
      };

      formData.append("image", imageObject);

      // ✅ 이미지 로그
      console.log("📸 이미지 전송 정보:", imageObject);
    }

    // ✅ 전체 FormData 확인 (텍스트용)
    console.log("📦 전송할 groupInfo:", groupInfo);
    console.log("🔑 토큰:", token);

    // ✅ 실제 요청
    const response = await axios.post(`${BASE_URL}/api/groups`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      transformRequest: (data) => data, // FormData 유지
    });

    // ✅ 응답 확인
    console.log("✅ [createGroup] 응답 데이터:", response.data);

    return response.data;
  } catch (err) {
    // ✅ 에러 로그
    console.error("🚨 [createGroup] 실패:", err.response?.data || err.message);
    if (err.request) console.error("❓ [createGroup] 요청 실패:", err.request);
    if (err.config) console.error("⚙️ [createGroup] 요청 config:", err.config);
    return null;
  }
};

// ✅ 그룹 탈퇴
export const leaveGroup = async (groupId, userId) => {
  try {
    const headers = await getAuthHeader();
    const res = await axios.post(`${BASE_URL}/api/groups/${groupId}/leave?userId=${userId}`, null, {
      headers,
    });

    console.log("✅ [leaveGroup] 성공:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ [leaveGroup] 실패:", error.response?.data || error.message);
    return null;
  }
};

// ✅ 그룹 목록 검색
export const fetchGroups = async ({ title = "", tag = "", emotion = "" }) => {
  try {
    const headers = await getAuthHeader();
    const params = {};
    if (title) params.title = title;
    if (tag) params.tag = tag;
    if (emotion) params.emotion = emotion;

    const res = await axios.get(`${BASE_URL}/api/groups/search`, {
      headers,
      params,
    });

    return res.data;
  } catch (error) {
    console.error("❌ [fetchGroups] 실패:", error.response?.data || error.message);
    return [];
  }
};

// ✅ 내 그룹 목록 조회
export const fetchMyGroups = async (userId) => {
  try {
    const headers = await getAuthHeader();
    const res = await axios.get(`${BASE_URL}/api/groups/user/${userId}`, {
      headers,
    });
    return res.data;
  } catch (error) {
    console.error("❌ [fetchMyGroups] 실패:", error.response?.data || error.message);
    return [];
  }
};

// ✅ 그룹 가입
export const joinGroup = async (groupId, userId) => {
  try {
    const token = await AsyncStorage.getItem("token");

    const res = await axios.post(
      `${BASE_URL}/api/groups/${groupId}/join?userId=${userId}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("✅ [joinGroup] 성공:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ [joinGroup] 실패:", err.response?.data || err.message);
    return null;
  }
};
