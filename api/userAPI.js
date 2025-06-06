export const updateUserProfile = async (userId, name, imageUri) => {
  const formData = new FormData();
  formData.append("username", name);

  if (imageUri) {
    formData.append("profileImage", {
      uri: imageUri,
      name: "profile.jpg",
      type: "image/jpeg",
    });
  }

  try {
    const token = await AsyncStorage.getItem("token");
    const res = await axios.put(`${BASE_URL}/api/users/${userId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        // Content-Type 자동 설정되게 두기
      },
    });

    return res.data;
  } catch (err) {
    console.error("프로필 업데이트 실패:", err.response?.data || err.message);
    return null;
  }
};
