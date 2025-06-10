import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Image, Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createPost } from '../api/postAPI';

const WriteScreen = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("갤러리 접근 권한이 필요합니다.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.IMAGE],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets?.[0]?.uri || result.uri;
      setImage(uri);
    }
  };

  const handleSubmit = async () => {
    if (!title || !content) {
      Alert.alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');

      console.log('🧾 userId:', userId);
      console.log('🔐 token:', token);

      if (!userId || !token) {
        throw new Error('로그인이 필요합니다.');
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);

      if (image) {
        formData.append('image', {
          uri: image,
          name: 'post.jpg',
          type: 'image/jpeg',
        });
      }

      await createPost(formData, token);
      Alert.alert('게시글이 등록되었습니다.');
      navigation.goBack();
    } catch (error) {
      console.error('🛑 게시글 등록 실패:', error.message);
      Alert.alert('게시글 등록 실패', error.message || '오류가 발생했습니다.');
    }
  };

  return (
    <View style={{ top: 30, flex: 1, backgroundColor: '#fff', padding: 20 }}>
      {/* 상단 바 */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSubmit}
          style={{ backgroundColor: '#FFD580', padding: 10, borderRadius: 20 }}
        >
          <Text style={{ fontWeight: 'bold' }}>등록</Text>
        </TouchableOpacity>
      </View>

      {/* 제목 입력 */}
      <TextInput
        placeholder="제목"
        value={title}
        onChangeText={setTitle}
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          marginTop: 20,
          borderBottomWidth: 1,
          borderBottomColor: '#ccc',
          paddingBottom: 5,
        }}
      />

      {/* 본문 입력 */}
      <TextInput
        placeholder="본문에 #을 이용해 태그를 입력해보세요!"
        value={content}
        onChangeText={setContent}
        multiline
        style={{
          fontSize: 16,
          marginTop: 20,
          textAlignVertical: 'top',
          height: 300,
        }}
      />

      {/* 선택된 이미지 미리보기 */}
      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: '100%', height: 200, marginTop: 20, borderRadius: 10 }}
        />
      )}

      {/* 하단 툴바 */}
      <View style={{
        position: 'absolute', bottom: 0,
        flexDirection: 'row', justifyContent: 'space-around',
        width: '100%', padding: 15,
        borderTopWidth: 1, borderTopColor: '#ccc',
        backgroundColor: 'white',
      }}>
        <TouchableOpacity onPress={pickImage}>
          <Icon name="camera" size={25} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="text" size={25} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="list" size={25} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WriteScreen;
