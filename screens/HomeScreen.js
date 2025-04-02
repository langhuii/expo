import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { ProgressBar } from "../components/ProgressBar"; // 감정 통계 그래프 컴포넌트
import { Ionicons } from "@expo/vector-icons";
import { fetchEmotionStats } from "../api/emotionAPI"; // API 통해 감정 받아오기
import { fetchUserProfile } from "../api/userAPI"; // ✅ 유저 정보 API 추가
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen({ navigation }) {
  const [profileImage, setProfileImage] = useState(null);  //프로필 사진 받아오기.
  const [emotionStats, setEmotionStats] = useState(null); // ✅ 감정 통계 상태 추가
  const [userName, setUserName] = useState("사용자"); // ✅ 이름 상태 추가

useEffect(() => {
  const loadUserData = async () => {
    const id = await AsyncStorage.getItem("userId");
    if (!id) return;

    const userData = await fetchUserProfile(id);
    if (userData) {
      setProfileImage(userData.imageUrl);
      setUserName(userData.name);
    }

    const statsData = await fetchEmotionStats(id);
    if (statsData) {
      setEmotionStats(statsData);
    }
  };

  loadUserData();
}, []);

  return (
    <View style={styles.container}>
      {/* 프로필 카드 */}
      <View style={styles.profileCard}>
        <Image 
          source={profileImage ? { uri: profileImage } : require("../assets/profile.jpg")} 
          style={styles.profileImage} 
        />
        <Text style={styles.welcomeText}>
          <Text style={styles.italicText}>{userName}</Text> 님 반가워요 !
        </Text>
        <TouchableOpacity style={styles.analysisButton} onPress={() => navigation.navigate("Emotion")}>
          <Text style={styles.analysisText}>내 감정 분석하러 가기</Text>
          <Ionicons name="arrow-forward" size={18} color="black" />
        </TouchableOpacity>
      </View>

      {/* 감정 통계 */}
      <View style={styles.statsCard}>
  <Text style={styles.statsTitle}>이 달의 감정통계</Text>
  {emotionStats ? (
    <>
      <ProgressBar color="#A7C7FF" progress={emotionStats.joy} />
      <ProgressBar color="#F8AFA6" progress={emotionStats.sadness} />
      <ProgressBar color="#F9E79F" progress={emotionStats.anger} />
      <ProgressBar color="#A9DFBF" progress={emotionStats.calm} />
    </>
  ) : (
    <Text>감정 데이터를 불러오는 중...</Text>
  )}
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
    paddingTop: 50,
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
    marginBottom: 20,
  },
  profileImage: {
    width: 250,
    height: 250,
    borderRadius: 180,
    top: 10,
    marginBottom: 40,
    borderWidth: 2,
    borderColor: 'black',
  },
  welcomeText: {
    fontSize: 25,
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
    marginTop: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    elevation: 5,
  },
  analysisText: {
    fontSize: 20,
    marginRight: 10,
  },
  statsCard: {
    width: "90%",
    marginTop: 15,
    backgroundColor: "#FDFBF5",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    gap: 13,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

