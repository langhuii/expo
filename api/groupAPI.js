import axios from "axios";

const BASE_URL = "http://192.168.0.100:8080"; 

// ✅ 그룹 가입하기
export const joinGroup = async (userId, groupId) => {
  try {
    const res = await axios.post(`${BASE_URL}/group/join`, {
      userId,
      groupId,
    });
    return res.data;
  } catch (error) {
    console.error("❌ 그룹 가입 실패:", error.message);
    return null;
  }
};

// ✅ 그룹 만들기
export const createGroup = async (groupData) => {
  const formData = new FormData();
  formData.append("title", groupData.title);
  formData.append("description", groupData.description);
  formData.append("category", groupData.category);
  formData.append("tags", JSON.stringify(groupData.tags));

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
      },
    });
    return res.data;
  } catch (err) {
    console.error("❌ 그룹 생성 실패:", err);
    return null;
  }
};

// ✅ 그룹 목록 가져오기
export const fetchGroups = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/groups`);
    return res.data;
  } catch (error) {
    console.error("❌ 그룹 목록 불러오기 실패:", error);
    return [];
  }
};