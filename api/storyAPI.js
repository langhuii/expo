// 📦 api/storyApi.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORY_API = 'http://172.16.105.189:8080/api/stories';
const STORY_UPLOAD_API = 'http://172.16.105.189:8080/api/story-files/upload';

// 🔑 인증 헤더 생성
const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem('token');
  if (!token) throw new Error('로그인이 필요합니다.');
  return { Authorization: `Bearer ${token}` };
};

// 📄 스토리 목록 조회
export const fetchStories = async () => {
  const headers = await getAuthHeader();
  const response = await axios.get(STORY_API, { headers });
  return response.data;
};

// 📤 이미지 업로드
export const uploadImage = async (uri) => {
  const formData = new FormData();
  const uniqueFileName = `${Date.now()}_story.jpg`;
  formData.append('file', {
    uri,
    type: 'image/jpeg',
    name:  uniqueFileName,
  });
  const headers = await getAuthHeader();
  const response = await axios.post(STORY_UPLOAD_API, formData, {
    headers: { ...headers, 'Content-Type': 'multipart/form-data' },
  });

  console.log("📤 이미지 업로드 응답:", response.data);

  const relativeUrl = response.data; // ✅ 바로 여기가 핵심 수정
  const fullUrl = `http://172.16.105.189:8080${relativeUrl}`;
  return fullUrl;
};

// 📝 스토리 업로드
export const uploadStory = async (imageUrl) => {
  const headers = await getAuthHeader();
  const userId = await AsyncStorage.getItem('userId');

  const payload = {
    userId,
    text: `스토리 이미지입니다 - ${Date.now()}`,
    imageUrl,
  };

  console.log("📦 스토리 업로드 요청:", payload);

  await axios.post(STORY_API, payload, { headers });
};

// ❌ 스토리 삭제
export const deleteStory = async (storyId) => {
  const headers = await getAuthHeader();
  await axios.delete(`${STORY_API}/${storyId}`, { headers });
};