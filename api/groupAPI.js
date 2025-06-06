import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://124.50.249.203:8080";

const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};


export const createGroup = async (groupData) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const formData = new FormData();

    formData.append("creatorId", groupData.creatorId);
    formData.append("title", groupData.title);
    formData.append("description", groupData.description);
    formData.append("tags", groupData.tags);
    formData.append("emotion", groupData.emotion);

    // 이미지가 있을 경우에만 추가
    if (groupData.imageUri) {
      formData.append("image", {
        uri: groupData.imageUri,
        type: "image/jpeg",
        name: "group.jpg"
      });
    }

    const response = await axios.post(`${BASE_URL}/api/groups`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    });

    return response.data;
  } catch (err) {
    console.error("🚨 그룹 생성 실패:", err.response?.data || err.message);
    return null;
  }
};

// ✅ 그룹 탈퇴하기
export const leaveGroup = async (groupId) => {
  console.log("🚀 [leaveGroup] 요청 그룹ID:", groupId);
  try {
    const headers = await getAuthHeader();
    const res = await axios.post(`${BASE_URL}/api/groups/${groupId}/leave`, null, {
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
  console.log("🔍 [fetchGroups] 검색 조건:", { title, tag, emotion });

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

    console.log("✅ [fetchGroups] 결과:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ [fetchGroups] 실패:", error.response?.data || error.message);
    return [];
  }
};

// ✅ 내 그룹 목록 가져오기
export const fetchMyGroups = async (userId) => {
  console.log("📥 [fetchMyGroups] 유저ID:", userId);
  try {
    const headers = await getAuthHeader();
    const res = await axios.get(`${BASE_URL}/users/${userId}/groups`, {
      headers,
    });

    console.log("✅ [fetchMyGroups] 결과:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ [fetchMyGroups] 실패:", error.response?.data || error.message);
    return [];
  }
};
