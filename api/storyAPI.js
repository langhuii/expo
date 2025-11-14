// 📂 api/storyAPI.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const NGROK_BASE = 'https://43eca66ba2c5.ngrok-free.app';
const STORY_API = `${NGROK_BASE}/api/stories`;
const STORY_UPLOAD_API = `${NGROK_BASE}/api/story-files/upload`;

/**
 * 🔑 인증 헤더 생성
 */
const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem('token'); // ✅ 키명 확인
  console.log('🔐 [DEBUG] token(head):', token ? token.slice(0, 25) + '...' : '❌ 없음');

  if (!token) {
    throw new Error('로그인이 필요합니다.');
  }
  return { Authorization: `Bearer ${token}` };
};

/**
 * 📄 스토리 목록 불러오기
 */
export const fetchStories = async () => {
  const headers = await getAuthHeader();
  console.log('📨 [DEBUG] fetchStories 헤더:', headers);

  const { data } = await axios.get(STORY_API, { headers });
  return data;
};

/**
 * 📤 이미지 업로드 (영구 저장소 복사 후 업로드)
 */
export const uploadImage = async (uri) => {
  try {
    const headers = await getAuthHeader();

    // 1) URI 디코딩
    const decodedUri = decodeURI(uri);
    console.log('🖼 [DEBUG] 원본 URI:', uri);
    console.log('🛠 [DEBUG] 디코딩 URI:', decodedUri);

    // 2) 파일 존재 여부 확인
    const fileInfo = await FileSystem.getInfoAsync(decodedUri);
    if (!fileInfo.exists) {
      throw new Error(`원본 파일이 존재하지 않습니다: ${decodedUri}`);
    }

    // 3) 안전한 경로로 복사
    const fileName = `${Date.now()}_story.jpg`;
    const safePath = `${FileSystem.documentDirectory}${fileName}`;
    await FileSystem.copyAsync({ from: decodedUri, to: safePath });
    console.log('📂 [DEBUG] 복사된 안전 경로:', safePath);

    // 4) FormData 생성
    const formData = new FormData();
    formData.append('file', {
      uri: safePath,
      type: 'image/jpeg',
      name: fileName,
    });

    // 5) 서버 업로드 요청
    const { data } = await axios.post(STORY_UPLOAD_API, formData, {
      headers: {
        ...headers,
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('📤 [DEBUG] 업로드 응답 데이터:', data);

    // 6) URL 반환 처리
    if (typeof data === 'string') {
      return data.startsWith('http') ? data : `${NGROK_BASE}${data}`;
    }
    if (data?.url) {
      return data.url.startsWith('http') ? data.url : `${NGROK_BASE}${data.url}`;
    }

    throw new Error('업로드 응답 형식을 알 수 없습니다.');
  } catch (error) {
    if (error.response) {
      console.log('❌ [DEBUG] 서버 응답 상태:', error.response.status);
      console.log('❌ [DEBUG] 서버 응답 데이터:', error.response.data);
    } else {
      console.log('❌ [DEBUG] 요청 실패:', error.message);
    }
    throw error;
  }
};

/**
 * 📝 스토리 업로드 (이미지 URL 기반)
 */
export const uploadStory = async (imageUrl) => {
  try {
    const headers = await getAuthHeader();
    const userId = await AsyncStorage.getItem('userId');

    const payload = {
      userId: Number(userId),
      text: `스토리 이미지입니다 - ${Date.now()}`,
      imageUrl,
    };

    console.log('📦 [DEBUG] 스토리 업로드 요청:', payload);

    // 📌 서버 응답(data)에 id가 포함된 단일 스토리 객체가 들어옴
    const { data } = await axios.post(STORY_API, payload, { headers });

    console.log('✅ [DEBUG] 스토리 업로드 완료:', data);

    // 📌 배열이 아니라 객체 그대로 리턴 (id 포함)
    return data;

  } catch (error) {
    if (error.response) {
      console.log('❌ [DEBUG] 서버 응답 상태:', error.response.status);
      console.log('❌ [DEBUG] 서버 응답 데이터:', error.response.data);
    } else {
      console.log('❌ [DEBUG] 요청 실패:', error.message);
    }
    throw error;
  }
};


/**
 * 🗑 스토리 삭제
 */
export const deleteStory = async (storyId) => {
  try {
    const headers = await getAuthHeader();
    console.log(`🗑 [DEBUG] 스토리 삭제 요청: ${storyId}`);

    await axios.delete(`${STORY_API}/${storyId}`, { headers });
    console.log('✅ [DEBUG] 스토리 삭제 완료');
  } catch (error) {
    if (error.response) {
      console.log('❌ [DEBUG] 서버 응답 상태:', error.response.status);
      console.log('❌ [DEBUG] 서버 응답 데이터:', error.response.data);
    } else {
      console.log('❌ [DEBUG] 요청 실패:', error.message);
    }
    throw error;
  }
};
