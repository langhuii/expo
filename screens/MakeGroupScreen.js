import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function MakeGroupScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [groupImage, setGroupImage] = useState(null);

  // ✅ 갤러리에서 사진 선택
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setGroupImage(result.assets[0].uri);
    }
  };

  // ✅ 태그 추가 (최대 3개)
  const addTag = () => {
    if (tags.length < 3) {
      setTags([...tags, `태그${tags.length + 1}`]);
    } else {
      Alert.alert("알림", "최대 3개의 태그만 등록할 수 있습니다.");
    }
  };

  // ✅ 그룹 생성 완료 버튼 클릭 (그룹 생성 후 `GroupListScreen`으로 전달)
  const handleCreateGroup = () => {
    if (title.trim() === "" || description.length < 30) {
      Alert.alert("오류", "제목을 입력하고 설명을 30자 이상 작성해주세요.");
      return;
    }

    // 새로운 그룹 객체 생성
    const newGroup = {
      id: Date.now().toString(), // 고유 ID 생성
      name: title,
      tags: tags.length > 0 ? tags : ["#새로운모임"], // 기본 태그
      days: 0, // 새 그룹이므로 0일째
      image: groupImage ? { uri: groupImage } : require("../assets/tokki.jpg"),
    };

    // ✅ `navigation.navigate`를 사용하여 `GroupListScreen`으로 이동하면서 새로운 그룹 추가
    navigation.navigate("GroupListScreen", { newGroup });
  };

  return (
    <View style={styles.container}>
      {/* 🔙 뒤로 가기 & 완료 버튼 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>그룹 만들기</Text>
        <TouchableOpacity onPress={handleCreateGroup}>
          <Text style={styles.completeButton}>완료</Text>
        </TouchableOpacity>
      </View>

      {/* 📸 그룹 이미지 추가 */}
      <View style={styles.imageContainer}>
        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          {groupImage ? (
            <Image source={{ uri: groupImage }} style={styles.groupImage} />
          ) : (
            <Ionicons name="add" size={30} color="black" />
          )}
        </TouchableOpacity>
      </View>

      {/* 제목 입력 */}
      <TextInput 
        style={styles.inputTitle}
        placeholder="제목"
        placeholderTextColor="#BDBDBD"
        value={title}
        onChangeText={setTitle}
      />

      {/* 설명 입력 */}
      <TextInput
        style={styles.inputDescription}
        placeholder="함께하고 싶은 모임 활동을 자세히 소개해주세요.\n(30자 이상)"
        placeholderTextColor="#BDBDBD"
        multiline
        value={description}
        onChangeText={setDescription}
      />

      {/* 주제 선택 */}
      <Text style={styles.sectionTitle}>어떤 주제로 모임을 하고 싶나요?</Text>
      <TouchableOpacity style={styles.subjectButton}>
        <Text style={styles.subjectButtonText}>주제 선택</Text>
      </TouchableOpacity>

      {/* 태그 추가 */}
      <Text style={styles.sectionTitle}>모임을 표현할 태그를 등록해 주세요.</Text>
      <View style={styles.tagContainer}>
        {tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
        {tags.length < 3 && (
          <TouchableOpacity onPress={addTag}>
            <Ionicons name="add-circle-outline" size={24} color="gray" />
          </TouchableOpacity>
        )}
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
    color: "#333",
  },
  completeButton: {
    fontSize: 16,
    color: "#333",
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
  groupImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  inputTitle: {
    fontSize: 16,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0C49A",
    marginBottom: 15,
  },
  inputDescription: {
    fontSize: 14,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0C49A",
    height: 80,
    textAlignVertical: "top",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
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
    color: "#333",
  },
  tagContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0C49A",
    paddingBottom: 10,
  },
  tag: {
    backgroundColor: "#FCE29F",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  tagText: {
    fontSize: 14,
    color: "#333",
  },
});
