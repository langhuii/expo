import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles } from "../styles/globalStyles";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchUserProfile, updateUserProfile } from "../api/userAPI";

export default function MemberProfileScreen() {
  const navigation = useNavigation();

  // 🔹 상태 정의
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState("");
  const [points, setPoints] = useState(0);
  const [profileImage, setProfileImage] = useState(null);
  const [imageUri, setImageUri] = useState(null);

  // 🔹 사용자 정보 불러오기
  useEffect(() => {
    const loadUser = async () => {
      const id = await AsyncStorage.getItem("userId");
      if (!id) return;

      setUserId(id);
      const user = await fetchUserProfile(id);

      if (user) {
        setName(user.name || "사용자");
        setPoints(user.points || 0);
        setProfileImage(user.imageUrl ? { uri: user.imageUrl } : null);
      }
    };

    loadUser();
  }, []);

  // 🔹 이미지 선택 함수
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("갤러리 접근 권한이 필요합니다.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
      setImageUri(selectedImageUri);
      setProfileImage({ uri: selectedImageUri });
    }
  };

  // 🔹 프로필 저장
  const handleSave = async () => {
    if (!userId) return;

    const updated = await updateUserProfile(userId, name, imageUri);
    if (updated) {
      Alert.alert("성공", "프로필이 업데이트되었습니다!");
    } else {
      Alert.alert("실패", "프로필 업데이트에 실패했습니다.");
    }
  };

  // 🔹 렌더링
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {/* 📸 프로필 이미지 */}
        <View style={styles.profileContainer}>
          <TouchableOpacity style={styles.profileImageContainer} onPress={pickImage}>
            <Image
              source={profileImage ? profileImage : require("../assets/profile.jpg")}
              style={styles.profileImage}
            />
            <View style={styles.addIcon}>
              <Ionicons name="camera-outline" size={25} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        {/* ✏️ 이름 입력 */}
        <View style={styles.nameInputContainer}>
          <TextInput
            value={name}
            onChangeText={setName}
            style={[styles.nameInput, globalStyles.text]}
          />
          <Ionicons name="pencil-outline" size={20} color="black" />
        </View>

        {/* 💾 저장 버튼 */}
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>저장하기</Text>
        </TouchableOpacity>

        {/* 📦 카드 목록 */}
        <View style={styles.cardContainer}>
          {/* 감정 기록 */}
          <TouchableOpacity style={styles.card}>
            <Text style={[styles.cardText, globalStyles.text]}>
              {name} 님의 감정 기록 보러가기
            </Text>
          </TouchableOpacity>

          {/* 포인트 정보 */}
          <TouchableOpacity style={styles.card}>
            <Text style={[styles.cardText, globalStyles.text]}>
              {name} 님의 현재 포인트는 {points} pt 입니다
            </Text>
            <Text style={[styles.detailText, globalStyles.textBold]}>▶ 상세보기</Text>
          </TouchableOpacity>

          {/* 전체 그룹 보기 */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("GroupListScreen")}
          >
            <Text style={[styles.cardText, globalStyles.text]}>
              Group 을 찾거나 가입하세요
            </Text>
            <Text style={[styles.detailText, globalStyles.textBold]}>▶ 상세보기</Text>
          </TouchableOpacity>

          {/* 가입한 그룹 보기 */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("MyGroups")}
          >
            <Text style={[styles.cardText, globalStyles.text]}>
              {name} 님이 가입한 그룹 보기
            </Text>
            <Text style={[styles.detailText, globalStyles.textBold]}>▶ 내 그룹</Text>
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
  addIcon: {
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
    justifyContent: "center", // 세로 중앙
  },
  cardText: {
    fontSize: 16,
  },
  detailText: {
    fontSize: 14,
    textAlign: "right",
    marginTop: 5,
    lineHeight: 20,  //  줄 높이, 글자 밀림짤림 방지
  },
}); 