import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { ProgressBar } from "../components/ProgressBar"; // 감정 통계 그래프 컴포넌트
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ 프로필 이미지 저장/불러오기용

export default function HomeScreen({ navigation }) {
  const [profileImage, setProfileImage] = useState(null);

  // ✅ AsyncStorage에서 프로필 이미지 불러오기
  useEffect(() => {
    const loadProfileImage = async () => {
      const savedImage = await AsyncStorage.getItem("profileImage");
      if (savedImage) {
        setProfileImage(savedImage); // 저장된 이미지 URL이 있으면 적용
      }
    };
    loadProfileImage();
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
          <Text style={styles.italicText}>Brian K</Text> 님 반가워요 !
        </Text>
        <TouchableOpacity style={styles.analysisButton} onPress={() => navigation.navigate("Emotion")}>
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

