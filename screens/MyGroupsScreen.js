import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchMyGroups, fetchLeaveGroup } from "../api/groupAPI";
import { Ionicons } from "@expo/vector-icons";

export default function MyGroupsScreen({ navigation }) {
  const defaultGroups = [
    {
      id: "default1",
      name: "기본 운동 그룹",
      tags: ["#운동", "#기본"],
      category: "운동",
      description: "기본적으로 포함된 운동 그룹",
      image: require("../assets/running.jpg"),
    },
    {
      id: "default2",
      name: "기본 독서 그룹",
      tags: ["#독서", "#기본"],
      category: "도서",
      description: "기본적으로 포함된 독서 그룹",
      image: require("../assets/book.jpg"),
    },
  ];

  const [myGroups, setMyGroups] = useState(defaultGroups);

  useEffect(() => {
    const load = async () => {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        try {
          const data = await fetchMyGroups(userId);
          const filtered = data.filter(serverGroup => !defaultGroups.some(d => d.id === serverGroup.id));
          setMyGroups([...defaultGroups, ...filtered]);
        } catch (error) {
          Alert.alert("그룹 목록을 불러오지 못했습니다.", error.message);
        }
      } else {
        Alert.alert("로그인 상태가 아닙니다.");
      }
    };
    load();
  }, []);

  const handleGroupClick = (group) => {
    navigation.navigate("GroupFeed", { group });
  };

  const handleLeaveGroup = async (groupId) => {
    const isDefault = groupId.toString().startsWith("default");

    if (isDefault) {
      setMyGroups(prevGroups => prevGroups.filter(group => group.id !== groupId));
      Alert.alert("탈퇴 완료", "기본 그룹에서 나갔습니다. (예시..)");
      return;
    }

    const userId = await AsyncStorage.getItem("userId");
    if (!userId) {
      Alert.alert("오류", "로그인 상태가 아닙니다.");
      return;
    }

    try {
      const result = await fetchLeaveGroup(userId, groupId);
      if (result) {
        Alert.alert("탈퇴 성공", "그룹에서 탈퇴되었습니다.");
        setMyGroups(prevGroups => prevGroups.filter(group => group.id !== groupId));
      } else {
        Alert.alert("탈퇴 실패", "그룹 탈퇴에 실패했습니다.");
      }
    } catch (error) {
      Alert.alert("탈퇴 실패", "서버에서 그룹을 탈퇴하는 데 문제가 발생했습니다.");
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleGroupClick(item)}>
      <View style={styles.card}>
        <Image
          source={
            item.image
              ? typeof item.image === "number"
                ? item.image
                : { uri: item.image }
              : require("../assets/tokki.jpg")
          }
          style={styles.image}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.tags}>{item.tags.join(" ")}</Text>
        </View>

        <TouchableOpacity
          style={styles.leaveButton}
          onPress={() => handleLeaveGroup(item.id)}
        >
          <Text style={styles.leaveButtonText}>탈퇴하기</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>내 그룹 목록</Text>
        <View style={{ width: 30 }} />
      </View>

      <Text style={styles.header}>🎉 가입한 그룹 목록</Text>
      <FlatList
        data={myGroups}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.noGroupsText}>가입한 그룹이 없습니다.</Text>}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#FFF8DC",
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
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFE4A1",
    borderRadius: 15,
    marginBottom: 15,
    padding: 10,
    alignItems: "center",
    position: "relative", // 버튼이 카드 위에 표시될 수 있도록 함
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  tags: {
    color: "#666",
    marginVertical: 5,
  },
  days: {
    fontSize: 13,
    color: "#333",
  },
  leaveButton: {
    position: "absolute", // 카드의 오른쪽 하단에 버튼 배치
    bottom: 10,
    right: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#FF6347", // 버튼 배경색
    borderRadius: 20,
    alignSelf: "center", // 중앙 정렬
    marginTop: 10, // 위쪽 마진 추가
  },
  leaveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  noGroupsText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
});
