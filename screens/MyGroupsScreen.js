// screens/MyGroupsScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchMyGroups } from "../api/groupAPI";
import { Ionicons } from "@expo/vector-icons"; // ✅ 상단 바 아이콘용

export default function MyGroupsScreen({ navigation }) {
  const [myGroups, setMyGroups] = useState([]);

  // 🔹 서버에서 내 그룹 목록 불러오기
  useEffect(() => {
    const load = async () => {
      const userId = await AsyncStorage.getItem("userId");
      const data = await fetchMyGroups(userId);
      setMyGroups(data);
    };
    load();
  }, []);

  // 🔹 그룹 카드 UI
  const renderItem = ({ item }) => (
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
        <Text style={styles.days}>{item.days}일째 함께하는 중</Text>
      </View>
    </View>
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
});
