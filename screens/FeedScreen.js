import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, Image, TouchableOpacity, FlatList,
  ScrollView, Alert, Modal, Dimensions
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { fetchPosts, likePost } from '../api/postAPI';
import { fetchStories, uploadImage, uploadStory, deleteStory } from '../api/storyAPI';

const BASE_URL = "https://43eca66ba2c5.ngrok-free.app";
const screenWidth = Dimensions.get('window').width - 70; // 패딩 고려

// 📌 원본 비율 유지 이미지 컴포넌트
const DynamicImage = ({ uri }) => {
  const [imageHeight, setImageHeight] = useState(200);

  useEffect(() => {
    if (uri) {
      Image.getSize(
        uri,
        (width, height) => {
          const ratio = height / width;
          setImageHeight(screenWidth * ratio);
        },
        (error) => console.log("🛑 이미지 크기 가져오기 실패:", error)
      );
    }
  }, [uri]);

  return (
    <Image
      source={{ uri }}
      style={{ width: '100%', height: imageHeight, borderRadius: 10, marginTop: 10 }}
      resizeMode="cover"
    />
  );
};

const FeedScreen = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [comments, setComments] = useState({});
  const [menuVisible, setMenuVisible] = useState(false); 
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadPosts();
    loadStories();
  }, []);

  // 🔄 글쓰기 화면에서 돌아오면 자동으로 게시글 새로고침
  useFocusEffect(
    useCallback(() => {
      loadPosts();
    }, [])
  );

  const loadPosts = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('로그인이 필요합니다.');
      const data = await fetchPosts(token);

      // ✅ 서버 응답 확인용 로그
      console.log("📥 피드 API 응답:", JSON.stringify(data, null, 2));

      setPosts(data);
    } catch (error) {
      console.error('게시글 불러오기 실패:', error.response?.data || error.message || error);
    }
  };

  const loadStories = async () => {
    try {
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
  };

  // 📌 공통 업로드 함수
  const processStoryUpload = async (sourceUri) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('로그인이 필요합니다.');

      // 1. Optimistic UI
      const tempId = `temp-${Date.now()}`;
      const tempStory = {
        id: tempId,
        imageUrl: sourceUri,
        text: '업로드 중...',
        userId: null,
        temp: true,
      };
      setStories((prev) => [tempStory, ...prev]);

      // 2. 파일 복사 → 업로드
      const fileName = `${Date.now()}_story.jpg`;
      const safePath = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.copyAsync({ from: sourceUri, to: safePath });

      const imageUrl = await uploadImage(safePath);
      const newStory = await uploadStory(imageUrl, token);

      const finalStory = {
        ...newStory,
        imageUrl,
        temp: false,
      };

      // 3. 임시 스토리 교체
      setStories((prev) =>
        prev.map((s) => (s.id === tempId ? finalStory : s))
      );

      Alert.alert('스토리 업로드 완료');
    } catch (error) {
      console.error(
        '스토리 업로드 실패:',
        error.response?.data || error.message || error
      );
      setStories((prev) => prev.filter((s) => !s?.temp));
      Alert.alert('스토리 업로드에 실패했습니다.');
    }
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
      const sourceUri = result.assets?.[0]?.uri || result.uri;
      await processStoryUpload(sourceUri);
    }
  };

  const openGalleryForStory = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('갤러리 접근 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const sourceUri = result.assets?.[0]?.uri || result.uri;
      await processStoryUpload(sourceUri);
    }
  };

  const handleDeleteStory = async (storyId) => {
    if (!storyId || storyId.toString().startsWith('temp')) {
      Alert.alert('삭제 불가', '아직 업로드 중인 스토리는 삭제할 수 없습니다.');
      return;
    }

    try {
      await deleteStory(storyId);
      Alert.alert('삭제 완료', '스토리가 삭제되었습니다.');
      setSelectedStory(null);
      loadStories();
    } catch (error) {
      console.error(
        '스토리 삭제 실패:',
        error.response?.data || error.message
      );
      Alert.alert('삭제 실패', '스토리를 삭제하는 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FAE3B4' }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', padding: 10 }}>피드</Text>

      {/* 🟣 스토리 바 */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ padding: 10, height: 90 }}>
        {/* 📌 플러스 버튼 */}
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ marginRight: 10 }}>
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
            <Icon name="add" size={30} color="#FFA500" />
          </View>
        </TouchableOpacity>

        {stories.map((story, index) =>
          story && story.imageUrl ? (
            <TouchableOpacity key={story.id || index} onPress={() => setSelectedStory(story)}>
              <Image
                source={{ uri: story.imageUrl }}
                style={{ width: 60, height: 60, borderRadius: 30, marginHorizontal: 5, backgroundColor: '#eee' }}
                onError={() => console.log('🛑 이미지 로딩 실패:', story.imageUrl)}
              />
            </TouchableOpacity>
          ) : null
        )}
      </ScrollView>

      {/* 🟣 스토리 업로드 메뉴 모달 */}
      <Modal visible={menuVisible} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: '#00000099', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: 250 }}>
            <TouchableOpacity
              style={{ padding: 15, flexDirection: 'row', alignItems: 'center' }}
              onPress={() => {
                setMenuVisible(false);
                openCameraForStory();
              }}
            >
              <Icon name="camera-outline" size={24} color="#FFA500" style={{ marginRight: 10 }} />
              <Text>카메라로 촬영</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ padding: 15, flexDirection: 'row', alignItems: 'center' }}
              onPress={() => {
                setMenuVisible(false);
                openGalleryForStory();
              }}
            >
              <Icon name="images-outline" size={24} color="#00BFFF" style={{ marginRight: 10 }} />
              <Text>갤러리에서 선택</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ padding: 15, alignItems: 'center' }}
              onPress={() => setMenuVisible(false)}
            >
              <Text style={{ color: 'red' }}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 🟣 스토리 전체보기 모달 */}
      {selectedStory && (
        <Modal visible transparent>
          <View style={{ flex: 1, backgroundColor: '#000000cc', justifyContent: 'center', alignItems: 'center' }}>
            <Image
              source={{ uri: selectedStory.imageUrl }}
              style={{ width: '90%', height: '70%' }}
              resizeMode="contain"
            />
            <TouchableOpacity onPress={() => setSelectedStory(null)} style={{ marginTop: 20 }}>
              <Text style={{ color: 'white', fontSize: 18 }}>닫기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeleteStory(selectedStory.id)}
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
            {/* 작성자 */}
            <TouchableOpacity
              onPress={() => handleProfilePress(item)}
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
             <Image
            source={
              item.authorProfileUrl
                ? { uri: `${BASE_URL}${item.authorProfileUrl}` }
                : { uri: 'https://via.placeholder.com/30' }
            }
            style={{ width: 30, height: 30, borderRadius: 15, marginRight: 5 }}
          />
              <View>
                <Text>{item.author || '알 수 없음'}</Text>
                <Text style={{ fontSize: 12, color: 'gray' }}>
                  {item.date || ''}
                </Text>
              </View>
            </TouchableOpacity>

            {/* 🔥 글 제목 */}
            {item.title ? (
              <Text style={{ marginTop: 8, fontSize: 18, fontWeight: 'bold', color: '#222' }}>
                {item.title}
              </Text>
            ) : null}

            {/* 🔥 글 내용 */}
            {item.content ? (
              <Text style={{ marginTop: 5, fontSize: 16, color: '#333' }}>
                {item.content}
              </Text>
            ) : null}

            {/* 글 이미지 (원본 비율 유지) */}
            {item.imageUrl ? (
              <DynamicImage uri={`${BASE_URL}${item.imageUrl}`} />
            ) : null}

            {/* 좋아요 & 댓글 */}
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
