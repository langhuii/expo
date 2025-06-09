// 📦 api/postApi.js
import axios from 'axios';

const POST_API = 'http://124.50.249.203:8080/admin/posts';

// 게시글 목록 조회
export const fetchPosts = async (token) => {
  const response = await axios.get(POST_API, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// 게시글 좋아요
export const likePost = async (postId, token) => {
  await axios.post(
    `${POST_API}/${postId}/like`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// 게시글 작성
export const createPost = async (formData, token) => {
  const response = await axios.post(POST_API, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
