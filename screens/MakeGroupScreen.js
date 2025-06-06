import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, Modal, ScrollView
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { createGroup } from "../api/groupAPI";
import * as ImagePicker from "expo-image-picker";

const FloatingMenu = ({ visible, setVisible, setSelectedCategory }) => {
  const categories = [
    { title: "감정", items: ["기쁨", "슬픔", "화남", "평온", "짜증"] },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalscreen}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setVisible(false)} />
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setVisible(false)}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
          <ScrollView style={styles.scrollContainer}>
            {categories.map((category, index) => (
              <View key={index} style={styles.categoryBox}>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <View style={styles.divider} />
                <View style={styles.tagContainer}>
                  {category.items.map((item, i) => (
                    <TouchableOpacity
                      key={i}
                      style={styles.tagButton}
                      onPress={() => {
                        setSelectedCategory(item);
                        setVisible(false);
                      }}
                    >
                      <Text style={styles.tagText}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default function MakeGroupScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [description, setcontent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [groupImage, setGroupImage] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("주제 선택");

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("권한 거부됨", "갤러리 접근 권한이 필요합니다.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setGroupImage(uri);
      console.log("✅ 저장된 이미지 URI:", uri);
    } else {
      Alert.alert("선택 취소됨", "이미지를 선택하지 않았습니다.");
    }
  };

  const addTag = () => {
    if (tagInput.trim() === "") return;
    if (tags.length >= 3) {
      Alert.alert("알림", "최대 3개의 태그만 등록할 수 있습니다.");
      return;
    }
    setTags([...tags, `#${tagInput.trim()}`]);
    setTagInput("");
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleCreateGroup = async () => {
    if (title.trim() === "" || description.length < 30) {
      Alert.alert("오류", "제목을 입력하고 설명을 30자 이상 작성해주세요.");
      return;
    }

    const userId = await AsyncStorage.getItem("userId");
    if (!userId) {
      Alert.alert("로그인 필요", "사용자 정보를 찾을 수 없습니다.");
      return;
    }

    const emotionMap = {
      기쁨: "joy",
      슬픔: "sadness",
      화남: "anger",
      평온: "calm",
      짜증: "anxiety",
    };

    const groupData = {
      creatorId: userId,
      title,
      description,
      tags: tags.length > 0 ? tags.join(",") : "#새로운모임",
      emotion: emotionMap[selectedCategory] || "",
      imageUri: groupImage,
    };

    console.log("📝 그룹 생성 요청 데이터:", groupData);
    const createdGroup = await createGroup(groupData);
    console.log("🚀 서버 응답:", createdGroup);

    if (createdGroup) {
      Alert.alert("성공", "그룹이 생성되었습니다!");
      navigation.navigate("GroupListScreen", { newGroup: createdGroup });
    } else {
      Alert.alert("실패", "그룹 생성에 실패했습니다.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>그룹 만들기</Text>
        <TouchableOpacity onPress={handleCreateGroup}>
          <Text style={styles.completeButton}>완료</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          {groupImage ? (
            <Image source={{ uri: groupImage }} style={styles.groupImage} />
          ) : (
            <Ionicons name="add" size={30} color="black" />
          )}
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.inputTitle}
        placeholder="제목"
        placeholderTextColor="#BDBDBD"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.inputcontent}
        placeholder="함께하고 싶은 모임 활동을 자세히 소개해주세요 (30자 이상)"
        placeholderTextColor="#BDBDBD"
        multiline
        value={description}
        onChangeText={setcontent}
      />

      <TouchableOpacity style={styles.subjectButton} onPress={() => setMenuVisible(true)}>
        <Text style={styles.subjectButtonText}>{selectedCategory}</Text>
      </TouchableOpacity>

      <FloatingMenu
        visible={menuVisible}
        setVisible={setMenuVisible}
        setSelectedCategory={setSelectedCategory}
      />

      <Text style={styles.sectionTitle}>태그 입력</Text>
      <View style={styles.tagInputContainer}>
        <TextInput
          style={styles.tagInput}
          placeholder="태그 입력 후 Enter"
          value={tagInput}
          onChangeText={setTagInput}
          onSubmitEditing={addTag}
        />
      </View>

      <View style={styles.tagContainer}>
        {tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
            <TouchableOpacity onPress={() => removeTag(index)}>
              <Ionicons name="close-circle" size={16} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}


// ✅ 스타일 설정
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBF0",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0C49A",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  completeButton: {
    fontSize: 16,
    fontWeight: "bold",
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  imageButton: {
    backgroundColor: "#FCE29F",
    borderRadius: 50,
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  inputTitle: {
    fontSize: 16,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0C49A",
    marginBottom: 15,
  },
  subjectButton: {
    backgroundColor: "#FCE29F",
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 15,
  },
  subjectButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  // 📌 플로팅 메뉴 스타일
  menuContainer: {
    position: "absolute",
    top: "40%",         // 부모 기준 세로 중앙
    left: "50%",        // 부모 기준 가로 중앙
    transform: [
      { translateX: -150 }, // 너비의 절반만큼 왼쪽으로
      { translateY: -100 }, // 높이의 절반만큼 위로
    ],
    width: 300,
    backgroundColor: "#FFF7D4",
    opacity: 0.95, 
    borderRadius: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  
  categoryBox: {
    marginBottom: 20,
  },
  
  categoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  
  divider: {
    height: 1,
    backgroundColor: "#FFD966",
    marginBottom: 10,
  },
  
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 8,
    rowGap: 10,
    justifyContent: "flex-start",
  },
  
  tagButton: {
    backgroundColor: "#FFE599", // 노란 파스텔 톤
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FFD966",
  },
  
  tagText: {
    fontSize: 14,
    color: "#444",
    fontWeight: "500",
  },
  modalscreen: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.3)", // 💡 전체 반투명 처리
  justifyContent: "center",
  alignItems: "center",
},

modalOverlay: {
  ...StyleSheet.absoluteFillObject, // 전체 덮기
  zIndex: 1,
},
menuContainer: {
  width: 300,
  backgroundColor: "#FFF",
  borderRadius: 15,
  padding: 20,
  zIndex: 2, // 메뉴가 overlay보다 위
},
closeButton: {
  position: "absolute",
  top: 10,
  right: 10,
  padding: 5,
  zIndex: 3,
},
inputcontent: {
  height: 120,            
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 10,
  padding: 15,
  fontSize: 14,
  textAlignVertical: "top", 
  marginBottom: 20,
  backgroundColor: "#FFF",  
},
groupImage: {
  width: 100,
  height: 100,
  marginTop:25,
  borderRadius: 100,
  resizeMode: "cover",
}

});

