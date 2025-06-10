import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity, Modal, Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { fetchStories, deleteStory } from '../api/storyAPI';

const StoryScreen = () => {
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null); // ✅ 바뀐 부분

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      const data = await fetchStories();
      console.log('✅ 받아온 스토리 데이터:', data);
      setStories(data);
    } catch (error) {
      console.error('스토리 불러오기 실패:', error);
    }
  };

  const handleDeleteStory = async () => {
    if (!selectedStory) return;
    Alert.alert(
      '스토리 삭제',
      '정말 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteStory(selectedStory.id);
              setStories(stories.filter((s) => s.id !== selectedStory.id));
              setSelectedStory(null);
            } catch (error) {
              console.error('스토리 삭제 실패:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF3E0' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', padding: 15 }}>스토리</Text>

      {/* 스토리 썸네일 */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 10, paddingBottom: 10 }}>
        {stories.filter((story) => !!story.imageUrl)
        .map((story, index) => (
          <TouchableOpacity key={index} onPress={() => setSelectedStory(story)}>
            <Image
              source={{ uri: `http://124.50.249.203:8080${story.imageUrl}` }}
              style={{ width: 60, height: 60, borderRadius: 30, marginRight: 10 }}
              onError={() => console.log('🛑 이미지 로딩 실패:', story.imageUrl)}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 스토리 전체보기 모달 */}
      {selectedStory && (
        <Modal visible transparent>
          <View style={{ flex: 1, backgroundColor: '#000000cc', justifyContent: 'center', alignItems: 'center' }}>
            <Image
              source={{ uri: `http://124.50.249.203:8080${selectedStory.imageUrl}` }}
              style={{ width: '90%', height: '70%', borderRadius: 15 }}
              resizeMode="contain"
            />
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <TouchableOpacity onPress={() => setSelectedStory(null)} style={{ marginHorizontal: 15 }}>
                <Text style={{ color: 'white', fontSize: 18 }}>닫기</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteStory} style={{ marginHorizontal: 15 }}>
                <Text style={{ color: 'red', fontSize: 18 }}>삭제</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default StoryScreen;
