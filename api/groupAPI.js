import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.0.100:8080"; //백 주소

// ✅ 인증 헤더 생성
const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ✅ 그룹 생성 (JSON + 이미지 포함, 아직 이미지 백X)
export const createGroup = async (groupData) => {
  const formData = new FormData();

  const groupInfo = {
    title: groupData.title,
    description: groupData.description,
    tags: groupData.tags,
    emotion: groupData.emotion,
  };

  formData.append(
    "group",
    new Blob([JSON.stringify(groupInfo)], { type: "application/json" })
  );

  if (groupData.imageUri) {
    formData.append("image", {
      uri: groupData.imageUri,
      name: "group.jpg",
      type: "image/jpeg",
    });
  }

  try {
    const res = await axios.post(`${BASE_URL}/groups`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...(await getAuthHeader()),
      },
    });
    return res.data;
  } catch (err) {
    console.error("❌ 그룹 생성 실패:", err.response?.data || err.message);
    return null;
  }
};

// ✅ 그룹 가입하기
export const joinGroup = async (groupId) => {
  try {
    const res = await axios.post(`${BASE_URL}/groups/${groupId}/join`, null, {
      headers: await getAuthHeader(),
    });
    return res.data;
  } catch (error) {
    console.error("❌ 그룹 가입 실패:", error.message);
    return null;
  }
};

// ✅ 그룹 탈퇴하기
export const leaveGroup = async (groupId) => {
  try {
    const res = await axios.post(`${BASE_URL}/groups/${groupId}/leave`, null, {
      headers: await getAuthHeader(),
    });
    return res.data;
  } catch (error) {
    console.error("❌ 그룹 탈퇴 실패:", error.message);
    return null;
  }
};

// ✅ 그룹 목록 가져오기 (전체 or 태그 기반)
export const fetchGroups = async (tag = "") => {
  try {
    const url = tag
      ? `${BASE_URL}/groups/search?tag=${encodeURIComponent(tag)}`
      : `${BASE_URL}/groups`;
    const res = await axios.get(url, {
      headers: await getAuthHeader(),
    });
    return res.data;
  } catch (error) {
    console.error("", error.message);
    return [];
  }
};

// ✅ 내 그룹 목록 가져오기
export const fetchMyGroups = async (userId) => {
  try {
    const res = await axios.get(`${BASE_URL}/users/${userId}/groups`, {
      headers: await getAuthHeader(),
    });
    return res.data;
  } catch (error) {
    console.error("❌ 내 그룹 목록 불러오기 실패:", error.message);
    return [];
  }
};

// ✅ 특정 그룹 상세 정보 가져오기
export const fetchGroupById = async (groupId) => {
  try {
    const res = await axios.get(`${BASE_URL}/groups/${groupId}`, {
      headers: await getAuthHeader(),
    });
    return res.data;
  } catch (error) {
    console.error("❌ 그룹 상세 정보 불러오기 실패:", error.message);
    return null;
  }
};