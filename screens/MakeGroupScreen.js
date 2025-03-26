import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, Modal 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

// ✅ 플로팅 메뉴 (주제 선택)
const FloatingMenu = ({ visible, setVisible, setSelectedCategory }) => {
  const categories = [
    { title: "스포츠/레저", items: ["러닝/걷기", "등산/산악", "골프", "야구", "농구", "요가/필라테스", "당구", "수영/다이빙", "피트니스"] },
    { title: "음악", items: ["노래", "악기", "음악"] },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity style={styles.modalOverlay} onPress={() => setVisible(false)} />
      <View style={styles.menuContainer}>
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
      </View>
    </Modal>
  );
};

export default function MakeGroupScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]); // 태그 리스트
  const [tagInput, setTagInput] = useState(""); // 태그 입력값
  const [groupImage, setGroupImage] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false); // 플로팅 메뉴 상태
  const [selectedCategory, setSelectedCategory] = useState("주제 선택"); // 선택된 카테고리

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
    if (tagInput.trim() === "") return; // 빈 입력 방지
    if (tags.length >= 3) {
      Alert.alert("알림", "최대 3개의 태그만 등록할 수 있습니다.");
      return;
    }

    setTags([...tags, `#${tagInput.trim()}`]); // 태그 추가
    setTagInput(""); // 입력 필드 초기화
  };

  // ✅ 태그 삭제 기능
  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  // ✅ 그룹 생성 완료 버튼 클릭
  const handleCreateGroup = () => {
    if (title.trim() === "" || description.length < 30) {
      Alert.alert("오류", "제목을 입력하고 설명을 30자 이상 작성해주세요.");
      return;
    }

    const newGroup = {
      id: Date.now().toString(),
      name: title,
      tags: tags.length > 0 ? tags : ["#새로운모임"],
      days: 0,
      image: groupImage ? { uri: groupImage } : require("../assets/tokki.jpg"),
    };

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
        placeholder="함께하고 싶은 모임 활동을 자세히 소개해주세요 (30자 이상)"
        placeholderTextColor="#BDBDBD"
        multiline
        value={description}
        onChangeText={setDescription}
      />

      {/* 📌 플로팅 메뉴 버튼 */}
      <TouchableOpacity style={styles.subjectButton} onPress={() => setMenuVisible(true)}>
        <Text style={styles.subjectButtonText}>{selectedCategory}</Text>
      </TouchableOpacity>

      {/* 📌 플로팅 메뉴 컴포넌트 */}
      <FloatingMenu visible={menuVisible} setVisible={setMenuVisible} setSelectedCategory={setSelectedCategory} />

      {/* 🔹 태그 입력 필드 */}
      <Text style={styles.sectionTitle}>태그 입력</Text>
      <View style={styles.tagInputContainer}>
        <TextInput
          style={styles.tagInput}
          placeholder="태그 입력 후 Enter"
          value={tagInput}
          onChangeText={setTagInput}
          onSubmitEditing={addTag} // Enter 키 입력 시 태그 추가
        />
        <TouchableOpacity onPress={addTag} style={styles.addTagButton}>
          <Ionicons name="add-circle-outline" size={24} color="gray" />
        </TouchableOpacity>
      </View>

      {/* 🔹 태그 리스트 */}
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
    bottom: 400, 
    right: 20, // ✅ 메뉴 위치 조정
    width: 280, // ✅ 가로 길이 조정
    backgroundColor: "#FDE293",
    borderRadius: 15,
    padding: 15,
  },
  categoryBox: {
    marginBottom: 15,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5C07B",
    marginVertical: 5,
  },

  // 📌 태그(주제) 스타일 (가로 3개씩 정렬)
  tagContainer: {
    flexDirection: "row", 
    flexWrap: "wrap", // 여러 줄로 배치
    alignItems: "center", 
    gap: 5, // 태그 사이 여백 조정
  },
  tag: {
    flexDirection: "row",
    backgroundColor: "#FCE29F",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: "center",
    marginHorizontal: 4, // 좌우 간격 조정
    marginBottom: 6, // 아래쪽 간격 추가
  },
  tagText: {
    fontSize: 14,
    color: "#333",
    marginRight: 5,
  },
  tagButton: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 12,
    marginVertical: 10,
    width: "30%", // ✅ 가로 3개씩 배치
    alignItems: "center",
  },
});

