import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Image, Alert, ScrollView, KeyboardAvoidingView, Platform
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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const pickedUri = result.assets?.[0]?.uri;
      if (pickedUri) {
        setImage(pickedUri);
      } else {
        Alert.alert("이미지를 불러오지 못했습니다.");
      }
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

    if (!userId || !token) {
      throw new Error('로그인이 필요합니다.');
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('userId', userId.toString());
    formData.append('author', '익명');

    if (image) {
      const imageData = {
        uri: image,
        name: 'post.jpg',
        type: 'image/jpeg',
      };
      console.log('📸 선택된 이미지 데이터:', imageData); // ✅ 이미지 파일 확인
      formData.append('image', imageData);
    }

    // ✅ FormData에 들어간 값 전체 확인
    for (let pair of formData.entries()) {
      console.log(`📦 FormData key=${pair[0]}:`, pair[1]);
    }

    // 서버 요청
    const response = await createPost(formData, token);

    // ✅ 서버 응답 확인
    console.log('📥 서버 응답:', response);

    if (response?.imageUrl) {
      console.log('🖼️ 서버가 내려준 이미지 URL:', response.imageUrl);
    }

    Alert.alert('게시글이 등록되었습니다.');
    navigation.goBack();
  } catch (error) {
    console.error('🛑 게시글 등록 실패:', error.message);
    Alert.alert('게시글 등록 실패', error.message || '오류가 발생했습니다.');
  }
};


  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* 상단 바 */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 }}>
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


      {/* 입력창 + 이미지 영역 */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
        >
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

        {image && (
  <View style={{ position: 'relative', marginTop: -150 }}>
    <Image
      source={{ uri: image }}
      style={{ width: '100%', height: 500, borderRadius: 10 }}
      resizeMode="cover"
    />
    <TouchableOpacity
      onPress={() => setImage(null)}
      style={{
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 8,
        borderRadius: 20,
      }}
    >
      <Icon name="close" size={20} color="white" />
    </TouchableOpacity>
  </View>
)}

        </ScrollView>
      </KeyboardAvoidingView>

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
