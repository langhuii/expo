import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; // ✅ 네비게이션 추가

const groups = [
  {
    id: "1",
    name: "🏃‍♂️🏃‍♀️러닝크루🏃‍♂️🏃‍♀️",
    tags: ["#🏃‍♂️🏃‍♀️러닝크루", "#무기력"],
    days: 100,
    image: require("../assets/running.jpg"), 
  },
  {
    id: "2",
    name: "YTC 양천 테니스 클럽",
    tags: ["#테니스", "#테니스클럽", "#기쁨"],
    days: 14,
    image: require("../assets/tennis.jpg"),
  },
  {
    id: "3",
    name: "북 투게더📖",
    tags: ["#북_투게더📖", "#독서모임", "#평온"],
    days: 10,
    image: require("../assets/book.jpg"),
  },
  {
    id: "4",
    name: "영화 소담회",
    tags: ["#소담회", "#영화감상🍿🎥", "#감동"],
    days: 365,
    image: require("../assets/movie.jpg"),
  },
];

const GroupListScreen = () => {
  const navigation = useNavigation(); // ✅ 네비게이션 객체 추가

  return (
    <View style={styles.container}>
      {/* 🔹 네비게이션 바 */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>소속 그룹</Text>
        <View style={{ width: 30 }} /> {/* 빈 공간 */}
      </View>

      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.textContainer}>
              <Text style={styles.groupName}>{item.name}</Text>

              <Text style={styles.tags}>
                사용 가능한 태그{"\n"}
                {item.tags.map((tag, index) => (
                  <Text key={index} style={styles.tagText}>{tag} </Text>
                ))}
              </Text>

              <Text style={styles.daysText}>
                이 그룹과 함께한지 <Text style={styles.bold}>{`'${item.days}'`}</Text> 일 째 입니다.
              </Text>
            </View>
            <Image source={item.image} style={styles.groupImage} />
          </View>
        )}
      />
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add" size={30} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8DC",
    padding: 15,
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
});

export default GroupListScreen;
