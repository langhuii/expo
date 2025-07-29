import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, TouchableOpacity, FlatList,
  ScrollView, TextInput, Alert, Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { fetchPosts, likePost } from '../api/postAPI';
import { fetchStories, uploadImage, uploadStory } from '../api/storyAPI'; // 🟣 스토리 관련 API 추가
import { deleteStory } from '../api/storyAPI';

const FeedScreen = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]); // 🟣 추가
  const [selectedStory, setSelectedStory] = useState(null); // 🟣 추가
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState({});
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadPosts();
    loadStories(); // 🟣 스토리 불러오기
  }, []);

  const loadPosts = async () => {
  try {
    console.log('📥 게시글 로딩 시작');
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('로그인이 필요합니다.');
    const data = await fetchPosts(token);
    console.log('✅ 게시글 로딩 완료:', data); // 이거 찍어보기
    setPosts(data);
  } catch (error) {
    console.error('게시글 불러오기 실패:', error.response?.data || error.message || error);
  }
};

const loadStories = async () => {
  try {
    console.log('📥 스토리 로딩 시작');
    const data = await fetchStories();
    
    setStories(data);
  } catch (error) {
    console.error('스토리 불러오기 실패:', error.response?.data || error.message || error);
  }
};

  const handleLike = async (postId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('로그인이 필요합니다.');
      await likePost(postId, token);
      loadPosts();
    } catch (error) {
      console.error('좋아요 실패:', error);
    }
  };

  const handleProfilePress = (user) => {
    setSelectedUser(user);
    setMenuVisible(true);
  };

  const handleAddComment = () => {
    if (commentText.trim() !== '') {
      setComments({
        ...comments,
        [selectedPostId]: [...(comments[selectedPostId] || []), commentText],
      });
      setCommentText('');
    }
  };

  const handleDeleteComment = (index) => {
    setComments((prev) => ({
      ...prev,
      [selectedPostId]: prev[selectedPostId].filter((_, i) => i !== index),
    }));
  };

  const openCameraForStory = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('카메라 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('로그인이 필요합니다.');

        const imageUri = result.assets?.[0]?.uri || result.uri;
        const imageUrl = await uploadImage(imageUri);
        console.log('✅ imageUrl:', imageUrl);

        await uploadStory(imageUrl);
        Alert.alert('스토리 업로드 완료');

        loadStories(); // 🟣 업로드 후 스토리 다시 불러오기
      } catch (error) {
        console.error('스토리 업로드 실패:', error.response?.data || error.message || error);
        Alert.alert('스토리 업로드에 실패했습니다.');
      }
    }
  };

  const handleDeleteStory = async (storyId) => {
  try {
    await deleteStory(storyId);
    Alert.alert('삭제 완료', '스토리가 삭제되었습니다.');
    setSelectedStory(null);  // 모달 닫기
    await loadStories();     // 스토리 목록 갱신
  } catch (error) {
    console.error('스토리 삭제 실패:', error.response?.data || error.message);
    Alert.alert('삭제 실패', '스토리를 삭제하는 중 오류가 발생했습니다.');
  }
};

  return (
    <View style={{ flex: 1, backgroundColor: '#FAE3B4' }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', padding: 10 }}>피드</Text>

      {/* 🟣 스토리 바 */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ padding: 10, height: 78 }}>
        <TouchableOpacity onPress={openCameraForStory} style={{ marginRight: 10 }}>
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              borderWidth: 2,
              borderColor: '#FFA500',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Icon name="camera-outline" size={30} color="#FFA500" />
          </View>
        </TouchableOpacity>

        {stories.map((story, index) => (
          <TouchableOpacity key={index} onPress={() => setSelectedStory(story)}>
            <Image
              source={{ uri: story.imageUrl }}
              style={{ width: 60, height: 60, borderRadius: 30, marginHorizontal: 5 }}
              onError={() => console.log('🛑 이미지 로딩 실패:', story.imageUrl)}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 🟣 스토리 전체보기 모달 */}
      {selectedStory && (
        <Modal visible transparent>
          <View style={{ flex: 1, backgroundColor: '#000000cc', justifyContent: 'center', alignItems: 'center' }}>
            <Image
              source={{ uri:selectedStory.imageUrl }}
              style={{ width: '90%', height: '70%' }}
              resizeMode="contain"
            />
            <TouchableOpacity onPress={() => setSelectedStory(null)} style={{ marginTop: 20 }}>
              <Text style={{ color: 'white', fontSize: 18 }}>닫기</Text>
            </TouchableOpacity>

              {/* ✅ 삭제 버튼 추가 */}
            <TouchableOpacity onPress={() => handleDeleteStory(selectedStory.id)}
          style={{ marginTop: 10, backgroundColor: '#FF5555', padding: 10, borderRadius: 5 }}
      >
        <Text style={{ color: 'white', fontSize: 16 }}>삭제</Text>
      </TouchableOpacity>
          </View>
        </Modal>
      )}

      {/* 게시글 목록 */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id?.toString() || `${Math.random()}`}
        renderItem={({ item }) => (
          <View style={{ margin: 20, padding: 15, backgroundColor: '#FFF8DC', borderRadius: 10 }}>
            <TouchableOpacity onPress={() => handleProfilePress(item)} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={{ uri: item.profileUrl || '' }} style={{ width: 30, height: 30, borderRadius: 15, marginRight: 5 }} />
              <View>
                <Text>{item.user || '알 수 없음'}</Text>
                <Text style={{ fontSize: 12, color: 'gray' }}>{item.date || ''}</Text>
              </View>
            </TouchableOpacity>

            <Image source={{ uri: item.imageUrl || '' }} style={{ width: '100%', height: 250, borderRadius: 10, marginTop: 10 }} />

            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <TouchableOpacity onPress={() => handleLike(item.id)} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
                <Icon name={'heart-outline'} size={24} color="red" />
                <Text style={{ marginLeft: 5 }}>{item.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSelectedPostId(item.id)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="chatbubble-outline" size={24} color="black" />
                <Text style={{ marginLeft: 5 }}>{comments[item.id]?.length || 0}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* 글쓰기 버튼 */}
      <TouchableOpacity
        onPress={() => navigation.navigate('WriteScreen')}
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          backgroundColor: '#FFA500',
          width: 60,
          height: 60,
          borderRadius: 30,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 5,
          elevation: 5,
          zIndex: 10,
        }}
      >
        <Icon name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default FeedScreen;
