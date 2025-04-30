import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, ScrollView, Dimensions, Modal, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 10,
  },
  menuText: {
    fontSize: 16,
  },
});

const { width, height } = Dimensions.get('window');

const FeedScreen = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([
    { id: '1', user: 'Brian K', date: '2024.12.19', likes: 2400, comments: 0, image: require('../assets/post1.jpg'), profile: require('../assets/profile1.jpg'), liked: false },
    { id: '2', user: 'Felix', date: '2024.12.19', likes: 1800, comments: 0, image: require('../assets/post2.jpg'), profile: require('../assets/profile2.jpg'), liked: false },
  ]);
  const [stories, setStories] = useState([]);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState({});
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  /*댓글삭제*/
  const handleDeleteComment = (index) => {
    setComments(prevComments => ({
      ...prevComments,
      [selectedPostId]: prevComments[selectedPostId].filter((_, i) => i !== index) // 클릭한 댓글만 제외
    }));
  };
  
 // ✅ 프로필 박스를 클릭하면 메뉴가 뜨도록 설정
 const handleProfilePress = (user) => {
  setSelectedUser(user);  // 선택한 사용자 정보 저장
  setMenuVisible(true);  // 메뉴 열기
};

// ✅ 모달 닫기 함수
const handleCloseMenu = () => {
  setMenuVisible(false);
  setSelectedUser(null);
};

  /** 📌 16:9 비율로 사진 촬영하여 스토리 추가 */
  const handleAddStory = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('카메라 접근 권한이 필요합니다.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [9, 16],  // 🔥 16:9 비율 적용
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
      <View style={{ backgroundColor: '#FFD59E', padding: 15, alignItems: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>SNS</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ padding: 10, height:78 }}>
        <TouchableOpacity onPress={handleAddStory} style={{ marginRight: 10}}>
          <Icon name="add-circle" size={50} color="#FFA500" />
        </TouchableOpacity>
        {stories.length > 0 && (
          <TouchableOpacity onPress={handleSelectStory}>
            <Image source={{ uri: stories[stories.length - 1] }} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }} />
          </TouchableOpacity>
        )}
      </ScrollView>

      <FlatList
  data={posts}
  keyExtractor={item => item.id}
  renderItem={({ item }) => (
    <View style={{ margin: 20, padding: 15, backgroundColor: '#FFF8DC', minHeight: 300, borderRadius: 10 }}>
      
      <View style={{ position: 'relative' }}>
        
        <TouchableOpacity
          onPress={() => handleProfilePress(item)}
          style={{ 
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 223, 186, 0.9)',
            borderRadius: 20,
            paddingVertical: 5,
            paddingHorizontal: 10,
            alignSelf: 'flex-start'
          }}
        >
          <Image source={item.profile} style={{ width: 30, height: 30, borderRadius: 15, marginRight: 5 }} />
          <View>
            <Text style={{ fontWeight: 'bold', fontSize: 14 }}>{item.user}</Text>
            <Text style={{ color: 'gray', fontSize: 12 }}>{item.date}</Text>
          </View>
        </TouchableOpacity>

        <Image 
  source={item.image} 
          style={{ width: '100%', height: 1000, borderRadius: 10, marginTop: 10 }} 
/>


        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 50 }}>
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

      <Modal visible={menuVisible} transparent={true} animationType="fade" onRequestClose={handleCloseMenu}>
        <TouchableOpacity style={styles.modalBackground} onPress={handleCloseMenu}>
          <View style={styles.menuContainer}>
            {selectedUser && (
              <>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>{selectedUser.user}</Text>
                <TouchableOpacity style={styles.menuItem} onPress={() => alert(`${selectedUser.user}님의 프로필 보기`)}>
                  <Text style={styles.menuText}>사용자 프로필 보기</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => alert(`${selectedUser.user}님에게 쪽지 보내기`)}>
                  <Text style={styles.menuText}>쪽지 보내기</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

    </View> // ✅ View 태그 닫는 위치 수정
  )}
/>

      <Modal visible={selectedStoryIndex !== null} transparent={true} animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' }}>
          {selectedStoryIndex !== null && (
           <>
              <Image source={{ uri: stories[selectedStoryIndex] }} style={{ width: width, height: width * 9 / 16 }} resizeMode="contain" />

              <TouchableOpacity onPress={handleCloseStoryModal} style={{ position: 'absolute', top: 40, right: 20 }}>
                <Icon name="close" size={35} color="white" />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleDeleteStory} style={{ position: 'absolute', bottom: 100, right: 20 }}>
                <Icon name="trash" size={35} color="red" />
              </TouchableOpacity>

              {selectedStoryIndex > 0 && (
                <TouchableOpacity onPress={handlePrevStory} style={{ position: 'absolute', left: 20 }}>
                  <Icon name="chevron-back" size={40} color="white" />
                </TouchableOpacity>
              )}

              {selectedStoryIndex < stories.length - 1 && (
                <TouchableOpacity onPress={handleNextStory} style={{ position: 'absolute', right: 20 }}>
                  <Icon name="chevron-forward" size={40} color="white" />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </Modal>

      <TouchableOpacity
  onPress={() => navigation.navigate('WriteScreen')} // 글 작성 화면으로 이동
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
    zIndex: 10, // ✅ 다른 요소 위에 배치
  }}
>
  <Icon name="add" size={30} color="white" />
</TouchableOpacity>

<Modal visible={selectedPostId !== null} transparent={true} animationType="slide">
  <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
    <View style={{backgroundColor: 'white', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: height * 0.5 }}>
    <View style={{ maxHeight: height * 0.4, marginTop: 10 }}>

  <TouchableOpacity onPress={handleCloseCommentModal} style={{borderWidth:1, borderRadius: 20, position: 'absolute', top: -26, right: -10, zIndex: 2}}
       >
       <Icon name="close" size={20} color="black" />
      </TouchableOpacity>
  
  <FlatList
    data={comments[selectedPostId] || []}
    keyExtractor={(item, index) => index.toString()}
    renderItem={({ item, index }) => (
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: 10, 
        borderBottomWidth: 1, 
        borderBottomColor: '#eee' 
      }}>

        <Text>{item}</Text>


        <TouchableOpacity onPress={() => handleDeleteComment(index)}>
          <Icon name="trash" size={20} color="red" />
        </TouchableOpacity>
      </View>
    )}
  />
</View>

      <TextInput
        value={commentText}
        onChangeText={setCommentText}
        placeholder="댓글을 입력하세요..."
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 10, marginBottom: 10 }}
      />

      <TouchableOpacity onPress={handleAddComment} style={{ alignSelf: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 7, borderRadius: 10, marginLeft: 600, width:90 }}>
        <Text style={{ alignSelf: 'center', color: 'white', fontWeight: 'bold' }}>댓글 추가</Text>
      </TouchableOpacity>

    </View>
  </View>
</Modal>

    </View>
  );
};

export default FeedScreen;