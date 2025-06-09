import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { fetchGroups, joinGroup } from "../api/groupAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://124.50.249.203:8080"; 
const FloatingMenu = ({ visible, setVisible, selectedGroup, emotionMap }) => {

  if (!selectedGroup) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalscreen}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        />
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setVisible(false)}
          >
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
         <ScrollView style={styles.scrollContainer}>
  <Image
    source={
      selectedGroup.image
        ? typeof selectedGroup.image === "number"
          ? selectedGroup.image
          : { uri: selectedGroup.image.uri || selectedGroup.image }
        : require("../assets/tokki.jpg")
    }
    style={styles.groupImageLarge}
    resizeMode="cover"
  />

  <Text style={styles.categoryTitle}>감정 카테고리</Text>
  <Text>{emotionMap[selectedGroup.emotion] || "기타"}</Text>

  <View style={styles.divider} />

  <Text style={styles.categoryTitle}>그룹 설명</Text>
  <Text>{selectedGroup.description}</Text>

  <View style={styles.divider} />

  <Text style={styles.categoryTitle}>그룹 태그</Text>
  <View style={styles.tagContainer}>
    {selectedGroup.tags.map((tag, index) => (
      <Text key={index} style={styles.tagItem}>
        {tag}
      </Text>
    ))}
  </View>
</ScrollView>

        </View>
      </View>
    </Modal>
  );
};

const GroupListScreen = ({ route }) => {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [titleKeyword, setTitleKeyword] = useState("");
  const [tagKeyword, setTagKeyword] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState("");
  const [serverGroups, setServerGroups] = useState([]);
const handleJoinGroup = async (group) => {
  if (!group.groupId) {
    Alert.alert("알림", "그룹 ID가 유효하지 않습니다.");
    return;
  }

  const userId = await AsyncStorage.getItem("userId"); // ✅ 유저 ID 가져오기
  const result = await joinGroup(group.groupId, userId);

if (result !== null) {
  Alert.alert("성공", `${group.title || group.name}에 가입되었습니다!`);
  loadGroups();
} else {
  Alert.alert("실패", "이미 가입된 그룹이거나 문제가 발생했습니다.");
}

};



  const emotionMap = {
    joy: "기쁨",
    sadness: "슬픔",
    anger: "분노",
    calm: "평온",
    anxiety: "불안",
  };

  const emotionOptions = ["", "joy", "sadness", "anger", "calm", "anxiety"];

  const loadGroups = async () => {
    const data = await fetchGroups({
      title: titleKeyword,
      tag: tagKeyword,
      emotion: selectedEmotion,
    });

    const converted = data.map((group) => ({
      ...group,
      tags: group.tags ? group.tags.split(",") : [],
      image: group.profileImageUrl
        ? { uri: `${BASE_URL}${group.profileImageUrl}` }
        : require("../assets/tokki.jpg"),
    }));

    setServerGroups(converted);
  };

  useEffect(() => {
    loadGroups();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.newGroup) {
        const newGroup = route.params.newGroup;

        const formattedGroup = {
          ...newGroup,
          tags: newGroup.tags ? newGroup.tags.split(",") : [],
          image: newGroup.imageUrl
            ? { uri: newGroup.imageUrl }
            : require("../assets/tokki.jpg"),
        };

        setServerGroups([formattedGroup]);

        navigation.setParams({ newGroup: null });
      }
    }, [route.params?.newGroup])
  );

const handleSearch = async () => {
  console.log("🔍 검색 시작");
  console.log("제목:", titleKeyword);
  console.log("태그:", tagKeyword);
  console.log("감정:", selectedEmotion);
  await loadGroups();
};


  const handleOpenMenu = (group) => {
    setSelectedGroup(group);
    setMenuVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>전체그룹</Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={{ marginBottom: 10 }}>
        <TextInput
          style={[styles.searchInput, { marginBottom: 8 }]}
          placeholder="제목으로 검색"
          value={titleKeyword}
          onChangeText={setTitleKeyword}
        />

        <TextInput
          style={[styles.searchInput, { marginBottom: 8 }]}
          placeholder="태그로 검색"
          value={tagKeyword}
          onChangeText={setTagKeyword}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
          {emotionOptions.map((emotion) => (
            <TouchableOpacity
              key={emotion}
              onPress={() => setSelectedEmotion(emotion)}
              style={{
                backgroundColor: selectedEmotion === emotion ? "#FFD700" : "#eee",
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 12,
                marginRight: 10,
              }}
            >
              <Text>{emotion === "" ? "전체 감정" : emotion}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          onPress={handleSearch}
          style={{ backgroundColor: "#FFD700", padding: 10, borderRadius: 10 }}
        >
          <Text style={{ fontWeight: "bold", textAlign: "center" }}>검색</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={serverGroups}
        keyExtractor={(item, index) =>
          item.groupId ? `groupId-${item.groupId}` :
          item.id ? `id-${item.id}` :
          `fallback-${index}`
        }
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleOpenMenu(item)}>
            <View style={styles.card}>
              <View style={styles.textContainer}>
                <Text style={styles.groupName}>{item.title || item.name}</Text>
                <Text style={styles.tags}>
                  그룹의 지향점은{"\n"}
                  {item.tags.map((tag) => (
                    <Text key={tag} style={styles.tagText}>
                      {tag}{" "}
                    </Text>
                  ))}
                </Text>
                <Text style={{ marginTop: 4, fontSize: 12, color: "gray" }}>
                  감정 카테고리: {emotionMap[item.emotion] || "기타"}
                </Text>
                <TouchableOpacity
                  style={styles.joinButton}
                  onPress={() => handleJoinGroup(item)}
                >
                  <Text style={styles.joinButtonText}>가입하기</Text>
                </TouchableOpacity>
              </View>
              <Image source={item.image} style={styles.groupImage} />
            </View>
          </TouchableOpacity>
        )}
      />

      <FloatingMenu
        visible={menuVisible}
        setVisible={setMenuVisible}
      selectedGroup={selectedGroup}
        emotionMap={emotionMap}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("MakeGroup")}
      >
        <Ionicons name="add" size={30} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default GroupListScreen;

// ✅ 스타일 설정
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8DC",
    padding: 15,
  },
  modalscreen: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // 💡 전체 반투명 처리
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    position: "absolute",
  },
  menuContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    maxHeight: "80%",
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  scrollContainer: {
    paddingTop: 40, // 타이틀과 내용 간격
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  menuContent: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tagItem: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
    fontSize: 13,
    color: "#555",
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 14,
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    marginBottom: 10,
  },
  navTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },  
  card: {         //그룹 
    flexDirection: "row",
    backgroundColor: "#FFD675",
    borderRadius: 30,
    padding: 15,
    marginVertical: 10,
    alignItems: "center",
    elevation: 3,
    width: "98%",
    alignSelf: "center",
    height: 150, 
  },
  textContainer: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  tags: {
    fontSize: 14,
    marginVertical: 5,
  },
  tagText: {
    color: "#555",
  },
  daysText: {
    fontSize: 14,
    color: "#333",
  },
  bold: {
    fontWeight: "bold",
  },
  groupImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginLeft: 10,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#FFD700",
    borderRadius: 30,
    padding: 15,
    elevation: 5,
  },
  joinButton: {
    marginTop: 10,
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  joinButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  tagItem: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
    fontSize: 13,
  },
  joinButton: {
    marginTop: 15,             // 버튼과 텍스트 간의 여백 추가
    backgroundColor: "#4CAF50", // 녹색 배경
    paddingVertical: 12,        // 수직 여백 추가
    paddingHorizontal: 25,      // 수평 여백 추가
    borderRadius: 25,           // 둥근 모서리 적용
    alignSelf: "flex-start",    // 왼쪽 정렬
    marginBottom: 15,           // 버튼과 아래 항목 사이의 여백 추가
    elevation: 3,               // 그림자 효과
    shadowColor: '#000',        // 그림자 색상
    shadowOffset: { width: 0, height: 2 },  // 그림자 오프셋
    shadowOpacity: 0.2,         // 그림자 투명도
    shadowRadius: 3,            // 그림자 반경
  },
  
  joinButtonText: {
    color: "white",             // 흰색 텍스트
    fontWeight: "bold",         // 굵은 텍스트
    fontSize: 12,               // 텍스트 크기 조정
    textAlign: "center",        // 텍스트 중앙 정렬
  },
  groupImageLarge: {
    width: "100%",
    height: 200,
    borderRadius: 50,
    marginBottom: 15,
  },
});

