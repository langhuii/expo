const BASE_URL = "http://192.168.0.100:8080"; // Java 서버 주소로

export const fetchUserProfile = async (userId) => {
  try {
    const res = await fetch(`${BASE_URL}/user/${userId}`);
    if (!res.ok) throw new Error("서버 응답 실패");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("프로필 불러오기 오류:", error);
    return null;
  }
};
