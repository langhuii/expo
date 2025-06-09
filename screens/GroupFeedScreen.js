import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const GroupFeedScreen = ({ route }) => {
  const { group } = route.params;
  const navigation = useNavigation();

  const [posts, setPosts] = useState([
    {
      id: '1',
      user: 'Brian K',
      date: '2024.12.19',
      likes: 2400,
      comments: 0,
      image: require('../assets/post1.jpg'),
      profile: require('../assets/profile1.jpg'),
      liked: false,
    },
    {
      id: '2',
      user: 'Felix',
      date: '2024.12.19',
      likes: 1800,
      comments: 0,
      image: require('../assets/post2.jpg'),
      profile: require('../assets/profile2.jpg'),
      liked: false,
    },
  ]);

  const [comments, setComments] = useState({});
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [commentText, setCommentText] = useState('');

  const handleLike = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleCommentPress = (postId) => {
    setSelectedPostId(postId);
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
    setComments((prevComments) => ({
      ...prevComments,
      [selectedPostId]: prevComments[selectedPostId].filter((_, i) => i !== index),
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerSide} onPress={() => navigation.goBack()}>
          <Text style={styles.headerIcon}>◀</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>그룹피드</Text>

        <TouchableOpacity
          style={styles.headerSide}
          onPress={() => navigation.navigate('GroupChat')}
        >
          <Ionicons name="chatbubble-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            <TouchableOpacity style={styles.profileContainer}>
              <Image source={item.profile} style={styles.profileImage} />
              <View>
                <Text style={styles.userName}>{item.user}</Text>
                <Text style={styles.date}>{item.date}</Text>
              </View>
            </TouchableOpacity>

            <Image source={item.image} style={styles.postImage} />

            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleLike(item.id)} style={styles.actionButton}>
                <Icon name={item.liked ? 'heart' : 'heart-outline'} size={24} color="red" />
                <Text>{item.likes}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleCommentPress(item.id)} style={styles.actionButton}>
                <Icon name="chatbubble-outline" size={24} color="black" />
                <Text>{comments[item.id]?.length || item.comments}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal visible={selectedPostId !== null} transparent={true} animationType="slide">
        <View style={styles.commentModalBackground}>
          <View style={styles.commentModalContainer}>
            <FlatList
              data={comments[selectedPostId] || []}
              renderItem={({ item, index }) => (
                <View style={styles.commentItem}>
                  <Text>{item}</Text>
                  <TouchableOpacity onPress={() => handleDeleteComment(index)}>
                    <Icon name="trash" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              )}
            />
            <TextInput
              value={commentText}
              onChangeText={setCommentText}
              placeholder="Add a comment..."
              style={styles.commentInput}
            />
            <TouchableOpacity onPress={handleAddComment} style={styles.addCommentButton}>
              <Text style={styles.addCommentText}>Add Comment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default GroupFeedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAE3B4',
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    marginTop:20,
    backgroundColor: '#f4c76d',
    borderRadius: 10,
  },
  headerSide: {
    width: 40,
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 20,
    color: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  postCard: {
    margin: 20,
    padding: 15,
    backgroundColor: '#FFF8DC',
    borderRadius: 10,
    minHeight: 300,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 223, 186, 0.9)',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  date: {
    color: 'gray',
    fontSize: 12,
  },
  postImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginTop: 10,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  commentModalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  commentModalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.5,
  },
  commentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  addCommentButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 7,
    borderRadius: 10,
    width: 150,
    alignSelf: 'center',
  },
  addCommentText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
});
