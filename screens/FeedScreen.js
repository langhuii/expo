import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, ScrollView, Dimensions, Modal, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');






const FeedScreen = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([
    { id: '1', user: 'Brian K', date: '2024.12.19', likes: 2400, comments: 10000, image: require('../assets/post1.jpg'), profile: require('../assets/profile1.jpg'), liked: false },
    { id: '2', user: 'Felix', date: '2024.12.19', likes: 1800, comments: 7800, image: require('../assets/post2.jpg'), profile: require('../assets/profile2.jpg'), liked: false },
  ]);
  const [stories, setStories] = useState([]);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState({});

  /** 📌 16:9 비율로 사진 촬영하여 스토리 추가 */
  const handleAddStory = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('카메라 접근 권한이 필요합니다.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],  // 🔥 16:9 비율 적용
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setStories([...stories, result.assets[0].uri]);
    }
  };

  /** 📌 스토리를 선택하면 전체 화면 모달 띄움 */
  const handleSelectStory = () => {
    setSelectedStoryIndex(0);
  };

  /** 🔙 이전 버튼: 전체 화면 스토리 닫기 */
  const handleCloseStoryModal = () => {
    setSelectedStoryIndex(null);
  };

  const handleNextStory = () => {
    if (selectedStoryIndex < stories.length - 1) {
      setSelectedStoryIndex(selectedStoryIndex + 1);
    } else {
      setSelectedStoryIndex(null);
    }
  };

  const handlePrevStory = () => {
    if (selectedStoryIndex > 0) {
      setSelectedStoryIndex(selectedStoryIndex - 1);
    }
  };

  const handleDeleteStory = () => {
    if (selectedStoryIndex !== null) {
      const updatedStories = stories.filter((_, index) => index !== selectedStoryIndex);
      setStories(updatedStories);
      setSelectedStoryIndex(null);
    }
  };

  /** 📌 좋아요 (하트) 기능 */
  const handleLike = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  /** 📌 댓글 기능 */
  const handleCommentPress = (postId) => {
    setSelectedPostId(postId);
  };

  const handleCloseCommentModal = () => {
    setSelectedPostId(null);
  };

  const handleAddComment = () => {
    if (commentText.trim() !== "") {
      setComments({
        ...comments,
        [selectedPostId]: [...(comments[selectedPostId] || []), commentText]
      });
      setCommentText("");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FAE3B4' }}>
      {/* 상단 헤더 */}
      <View style={{ backgroundColor: '#FFD59E', padding: 15, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, alignItems: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>SNS</Text>
      </View>

      {/* 상단 스토리 영역 (최신 스토리만 표시) */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ padding: 10 }}>
        <TouchableOpacity onPress={handleAddStory} style={{ marginRight: 10 }}>
          <Icon name="add-circle" size={50} color="#FFA500" />
        </TouchableOpacity>
        {stories.length > 0 && (
          <TouchableOpacity onPress={handleSelectStory}>
            <Image source={{ uri: stories[stories.length - 1] }} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }} />
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* 피드 목록 */}
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={{ margin: 10, padding: 15, backgroundColor: '#FFF8DC', borderRadius: 10 }}>
            <Image source={item.image} style={{ width: width - 20, height: (width - 20) * 3 / 4, borderRadius: 10, marginVertical: 10 }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
              <TouchableOpacity onPress={() => handleLike(item.id)} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
                <Icon name={item.liked ? "heart" : "heart-outline"} size={24} color="red" />
                <Text style={{ marginLeft: 5 }}>{item.likes}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleCommentPress(item.id)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="chatbubble-outline" size={24} color="black" />
                <Text style={{ marginLeft: 5 }}>{comments[item.id]?.length || item.comments}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* 🔥 전체 화면 스토리 모달 */}
      <Modal visible={selectedStoryIndex !== null} transparent={true} animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' }}>
          {selectedStoryIndex !== null && (
           <>
              {/* 현재 스토리 이미지 */}
              <Image source={{ uri: stories[selectedStoryIndex] }} style={{ width: width, height: width * 9 / 16 }} resizeMode="contain" />

              {/* 닫기 버튼 */}
              <TouchableOpacity onPress={handleCloseStoryModal} style={{ position: 'absolute', top: 40, right: 20 }}>
                <Icon name="close" size={35} color="white" />
              </TouchableOpacity>

              {/* 삭제 버튼 */}
              <TouchableOpacity onPress={handleDeleteStory} style={{ position: 'absolute', bottom: 100, right: 20 }}>
                <Icon name="trash" size={35} color="red" />
              </TouchableOpacity>

              {/* 이전 버튼 */}
              {selectedStoryIndex > 0 && (
                <TouchableOpacity onPress={handlePrevStory} style={{ position: 'absolute', left: 20 }}>
                  <Icon name="chevron-back" size={40} color="white" />
                </TouchableOpacity>
              )}

              {/* 다음 버튼 */}
              {selectedStoryIndex < stories.length - 1 && (
                <TouchableOpacity onPress={handleNextStory} style={{ position: 'absolute', right: 20 }}>
                  <Icon name="chevron-forward" size={40} color="white" />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </Modal>

      {/* 🔥 댓글 모달 */}
      <Modal visible={selectedPostId !== null} transparent={true} animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: height * 0.5 }}>
            <TouchableOpacity onPress={handleCloseCommentModal} style={{ alignSelf: 'flex-end' }}>
              <Icon name="close" size={30} color="black" />
            </TouchableOpacity>
            <TextInput
              value={commentText}
              onChangeText={setCommentText}
              placeholder="댓글을 입력하세요..."
              style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 10, marginBottom: 10 }}
            />
            <TouchableOpacity onPress={handleAddComment}>
              <Text>댓글 추가</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FeedScreen;