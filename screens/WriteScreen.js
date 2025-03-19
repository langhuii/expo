import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const WriteScreen = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  return (
    <View style={{ top:30, flex: 1, backgroundColor: '#fff', padding: 20 }}>
      
      {/* 🔙 뒤로가기 버튼 & 등록 버튼 */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={30} color="black"  />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => {/* 저장 기능 추가 예정 */}}
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
          paddingBottom: 5
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
          height: 300
        }}
      />

      {/* 하단 툴바 (사진, 텍스트 옵션 등) */}
      <View style={{ top: 650, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#ccc' }}>
        <TouchableOpacity>
          <Icon name="camera" size={25} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="text" size={25} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="list" size={25} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={{ fontWeight: 'bold' }}>저장</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WriteScreen;
