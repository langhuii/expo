import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles } from "../styles/globalStyles"; // 글로벌 스타일 불러오기
import * as ImagePicker from "expo-image-picker"; // 갤러리에서 사진 선택 기능 추가

export default function MemberProfileScreen({ navigation }) {
  const [name, setName] = useState("Brian K");
  const [profileImage, setProfileImage] = useState(require("../assets/jieun.jpeg")); // 기본 프로필 이미지는 김지은씨씨

  // ✅ 갤러리에서 사진 선택하는 함수
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("갤러리 접근 권한이 필요합니다.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // 1:1 비율 유지
      quality: 1, // 최고 품질 설정
    });

    if (!result.canceled) {
      setProfileImage({ uri: result.assets[0].uri }); // ✅ 선택한 이미지로 변경
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 🔹 프로필 이미지 */}
        <View style={styles.profileContainer}>
          <TouchableOpacity style={styles.profileImageContainer} onPress={pickImage}>
            <Image source={profileImage} style={styles.profileImage} />
            <View style={styles.addIcon}>
              <Ionicons name="camera-outline" size={25} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        {/* 🔹 회원 이름 입력 */}
        <View style={styles.nameInputContainer}>
          <TextInput 
            value={name}
            onChangeText={setName}
            style={[styles.nameInput, globalStyles.text]}
          />
          <Ionicons name="pencil-outline" size={20} color="black" />
        </View>

        {/* 🔹 카드 목록 */}
        <View style={styles.cardContainer}>
          <TouchableOpacity style={styles.card}>
            <Text style={[styles.cardText, globalStyles.text]}>
              {name} 님의 감정 기록 보러가기
            </Text>
          </TouchableOpacity>

        {/* 🔹 포인트트 */}    
          <TouchableOpacity style={styles.card}>
            <Text style={[styles.cardText, globalStyles.text]}>
              {name} 님의 현재 포인트는 100 pt 입니다.
            </Text>
            <Text style={[styles.detailText, globalStyles.textBold]}>▶ 상세보기</Text>
          </TouchableOpacity>
         {/* 🔹 그룹룹 */}
          <TouchableOpacity style={styles.card}>
            <Text style={[styles.cardText, globalStyles.text]}>
              {name} 님의 Group을 확인하세요
            </Text>
            <Text style={[styles.detailText, globalStyles.textBold]}>▶ 상세보기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// ✅ 스타일 적용
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDFBF5",
  },
  scrollContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  profileContainer: {
    alignItems: "center",
  },
  profileImageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 2,
    borderColor: "gray",
    top: 100,
  },
  addIcon: {  //카메라 스타일일
    position: "absolute",
    bottom: -100,
    right: -8,
    backgroundColor: "#00000080",
    borderRadius: 15,
    padding: 5,
  },
  nameInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FCE8A8",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    width: "80%",
    marginTop: 20,
    top: 100,
  },
  nameInput: {
    fontSize: 18,
    flex: 1,
    textAlign: "center",
  },
  cardContainer: {
    width: "90%",
    marginTop: 30,
    top: 100,
  },
  card: {
    backgroundColor: "#FCE8A8",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    top: 30,
  },
  cardText: {
    fontSize: 16,
  },
  detailText: {
    fontSize: 14,
    textAlign: "right",
    marginTop: 5,
  },
});
