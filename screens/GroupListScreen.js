import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, TextInput, Modal, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { fetchGroups } from "../api/groupAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ✅ 플로팅 메뉴 (그룹 카테고리와 설명을 포함)
const FloatingMenu = ({ visible, setVisible, selectedGroup }) => {
  if (!selectedGroup) {
    return null; // selectedGroup이 없으면 아무 것도 렌더링하지 않음
  }
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalscreen}>
        {/* 바깥을 누르면 닫기 */}
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setVisible(false)} />

        <View style={styles.menuContainer}>
          {/* ❌ 닫기 버튼 */}
          <TouchableOpacity style={styles.closeButton} onPress={() => setVisible(false)}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>

          <ScrollView style={styles.scrollContainer}>
            <Text style={styles.categoryTitle}>그룹 카테고리</Text>
            <Text>{selectedGroup.category}</Text>
            <View style={styles.divider} />
            <Text style={styles.categoryTitle}>그룹 설명</Text>
            <Text>{selectedGroup.description}</Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const GroupListScreen = ({ route }) => {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false); // 플로팅 메뉴 상태
  const [selectedGroup, setSelectedGroup] = useState(null); // 선택된 그룹 상태
  const [searchKeyword, setSearchKeyword] = useState(""); // 태그 검색 상태

  const defaultGroups = [
    {
      id: "1",
      name: "🏃‍♂️🏃‍♀️러닝크루🏃‍♂️🏃‍♀️",
      tags: ["#🏃‍♂️🏃‍♀️러닝크루", "#무기력"],
      category: "운동",
      description: "함께 러닝을 즐기는 모임입니다.",
      days: 100,
      image: require("../assets/running.jpg"),
    },
    {
      id: "2",
      name: "YTC 양천 테니스 클럽",
      tags: ["#테니스", "#테니스클럽", "#기쁨"],
      category: "운동",
      description: "테니스를 즐기는 사람들의 모임",
      days: 14,
      image: require("../assets/tennis.jpg"),
    },
    {
      id: "3",
      name: "북 투게더📖",
      tags: ["#북_투게더📖", "#독서모임", "#평온"],
      category: "도서",
      description: "책을 읽고 나누는 독서 모임입니다.",
      days: 10,
      image: require("../assets/book.jpg"),
    },
    {
      id: "4",
      name: "영화 소담회",
      tags: ["#소담회", "#영화감상🍿🎥", "#감동"],
      category: "영화",
      description: "영화를 함께 보고 이야기 나누는 모임",
      days: 365,
      image: require("../assets/movie.jpg"),
    },
  ];

  const [serverGroups, setServerGroups] = useState([]);

  const loadGroups = async () => {
    const data = await fetchGroups();
    setServerGroups(data);
  };

  useEffect(() => {
    loadGroups();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.newGroup) {
        loadGroups();
        navigation.setParams({ newGroup: null });
      }
    }, [route.params?.newGroup])
  );

  const allGroups = [...defaultGroups, ...serverGroups];

  // ✅ 태그 기반 필터링
  const filteredGroups = allGroups.filter(group =>
    group.tags.some(tag =>
      tag.toLowerCase().includes(searchKeyword.toLowerCase())
    )
  );

  const handleJoinGroup = async (group) => {
    const userId = await AsyncStorage.getItem("userId");
  
    if (!userId) {
      Alert.alert("오류", "로그인이 필요합니다.");
      return;
    }
  
    const result = await joinGroup(userId, group.id);
  
    if (result) {
      Alert.alert("성공", `${group.name}에 가입되었습니다!`);
      loadGroups(); // 이미 있는 함수 재사용
    } else {
      Alert.alert("실패", "그룹 가입에 실패했습니다.");
    }
  };

  const handleOpenMenu = (group) => {
    setSelectedGroup(group);
    setMenuVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* 🔼 상단 네비게이션 */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>소속 그룹</Text>
        <View style={{ width: 30 }} />
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="주제로 검색해보세요 (예: 영화)"
        value={searchKeyword}
        onChangeText={setSearchKeyword}
      />

      {/* 📃 그룹 리스트 */}
      <FlatList
        data={filteredGroups}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.textContainer}>
              <Text style={styles.groupName}>{item.name}</Text>
              <Text style={styles.tags}>
                그룹의 지향점은{"\n"}
                {item.tags.map((tag, index) => (
                  <Text key={index} style={styles.tagText}>{tag} </Text>
                ))}
              </Text>
              <Text style={styles.daysText}>
                이 그룹과 함께한지 <Text style={styles.bold}>{item.days}</Text> 일 째 입니다.
              </Text>

              {/* 🔹 가입 버튼 추가 */}
              <TouchableOpacity
                style={styles.joinButton}
                onPress={() => handleJoinGroup(item)}
              >
                <Text style={styles.joinButtonText}>가입하기</Text>
              </TouchableOpacity>
            </View>

            <Image
              source={
                item.image
                  ? typeof item.image === "number"
                    ? item.image
                    : { uri: item.image }
                  : require("../assets/tokki.jpg")
              }
              style={styles.groupImage}
            />
          </View>
        )}
      />

      {/* 📌 플로팅 메뉴 컴포넌트 */}
      <FloatingMenu visible={menuVisible} setVisible={setMenuVisible} selectedGroup={selectedGroup} />

      {/* ➕ 그룹 추가 버튼 */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("MakeGroup")}
      >
        <Ionicons name="add" size={30} color="black" />
      </TouchableOpacity>
    </View>
  );
};


// ✅ 스타일 설정
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8DC",
    padding: 15,
  },
  modalscreen: {
    lex: 1,
    backgroundColor: "rgba(0,0,0,0.3)", // 💡 전체 반투명 처리
    justifyContent: "center",
    alignItems: "center",
  },
  searchInput: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 10,
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
  card: {
    flexDirection: "row",
    backgroundColor: "#FFD675",
    borderRadius: 30,
    padding: 15,
    marginVertical: 10,
    alignItems: "center",
    elevation: 3,
    width: "98%",
    alignSelf: "center",
    height: 150, // ✅ 카드 크기 조정 (세로 길게)
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
  
});

export default GroupListScreen;
