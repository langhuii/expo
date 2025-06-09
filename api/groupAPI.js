import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://124.50.249.203:8080";

// ✅ 인증 헤더 생성
const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ✅ 그룹 생성
export const createGroup = async (groupData) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const formData = new FormData();

    formData.append("creatorId", groupData.creatorId);

    const groupInfo = {
      title: groupData.title,
      description: groupData.description,
      tags: groupData.tags,
      emotion: groupData.emotion,
    };
    formData.append("group", JSON.stringify(groupInfo));

    if (groupData.imageUri) {
      formData.append("image", {
        uri: groupData.imageUri,
        type: "image/jpeg",
        name: "group.jpg",
      });
    }

    const response = await axios.post(`${BASE_URL}/api/groups`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      transformRequest: (data, headers) => data, // Content-Type 자동 설정 유지
    });

    return response.data;
  } catch (err) {
    console.error("🚨 [createGroup] 실패:", err.response?.data || err.message);
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

// ✅ 내 그룹 목록 가져오기
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
