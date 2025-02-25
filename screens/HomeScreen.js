import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { ProgressBar } from "../components/ProgressBar";
 // 감정 통계 그래프 컴포넌트
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* 프로필 카드 */}
      <View style={styles.profileCard}>
        <Image source={require("../assets/profile.jpg")} style={styles.profileImage} />
        <Text style={styles.welcomeText}>
          <Text style={styles.italicText}>Brian K</Text> 님 반가워요 !
        </Text>
        <TouchableOpacity style={styles.analysisButton}>
          <Text style={styles.analysisText}>내 감정 분석하러 가기</Text>
          <Ionicons name="arrow-forward" size={18} color="black" />
        </TouchableOpacity>
      </View>

      {/* 감정 통계 */}
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>이 달의 감정통계</Text>
        <ProgressBar color="#A7C7FF" progress={0.8} />
        <ProgressBar color="#F8AFA6" progress={0.6} />
        <ProgressBar color="#F9E79F" progress={0.5} />
        <ProgressBar color="#A9DFBF" progress={0.3} />
      </View>

      {/* 하단 네비게이션 바 */}
      <View style={styles.navBar}>
        <Ionicons name="home-outline" size={28} />
        <Ionicons name="calendar-outline" size={28} />
        <Ionicons name="heart-outline" size={28} />
        <Ionicons name="musical-notes-outline" size={28} />
        <Ionicons name="person-outline" size={28} />
      </View>
    </View>
  );
}

// ✅ 스타일 설정
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDFBF5",
    alignItems: "center",
    paddingTop: 20,
  },
  profileCard: {
    width: "90%",
    backgroundColor: "#FDFBF5",
    borderRadius: 20,
    alignItems: "center",
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  italicText: {
    fontStyle: "italic",
  },
  analysisButton: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    marginTop: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    elevation: 5,
  },
  analysisText: {
    fontSize: 14,
    marginRight: 10,
  },
  statsCard: {
    width: "90%",
    marginTop: 20,
    backgroundColor: "#FDFBF5",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    position: "absolute",
    bottom: 0,
    paddingVertical: 10,
    backgroundColor: "#FDFBF5",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    elevation: 5,
  },
});
