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
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState("");
  const [points, setPoints] = useState(0);
  const [profileImage, setProfileImage] = useState(null);
  const [imageUri, setImageUri] = useState(null);

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

  const handleSave = async () => {
    if (!userId) return;

    const updated = await updateUserProfile(userId, name, imageUri);
    if (updated) {
      Alert.alert("성공", "프로필이 업데이트되었습니다!");
    } else {
      Alert.alert("실패", "프로필 업데이트에 실패했습니다.");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={[styles.scrollContainer, { flexGrow: 1 }]}>

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

       <View style={styles.nameRowContainer}>
          <View style={styles.nameInputWrapper}>
            <Ionicons name="pencil-outline" size={20} color="black" style={styles.inputIcon} />
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="이름을 입력하세요"
              style={[styles.nameInputImproved, globalStyles.text]}
            />
          </View>

          <TouchableOpacity style={styles.saveButtonInline} onPress={handleSave}>
            <Text style={styles.saveButtonText}>저장</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Calendar", { userId })}
          >
            <Text style={[styles.cardText, globalStyles.text]}>
              {name} 님의 감정 기록 보러가기
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("GroupListScreen")}
          >
            <Text style={[styles.cardText, globalStyles.text]}>
              Group 을 찾거나 가입하세요
            </Text>
            <Text style={[styles.detailText, globalStyles.textBold]}>▶ 상세보기</Text>
          </TouchableOpacity>

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
    marginTop: 40,
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
    marginTop: 20,
  },
  addIcon: {
    position: "absolute",
    bottom: 0,
    right: -8,
    backgroundColor: "#00000080",
    borderRadius: 15,
    padding: 5,
  },
  nameRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    width: "90%",
    columnGap: 10,
  },
  nameInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF6D3",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flex: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 10,
  },
  nameInputImproved: {
    flex: 1,
    fontSize: 16,
  },
  saveButtonInline: {
    backgroundColor: "#FAD648",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 15,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  cardContainer: {
    width: "90%",
    marginTop: 30,
  },
  card: {
    backgroundColor: "#FCE8A8",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    justifyContent: "center",
  },
  cardText: {
    fontSize: 16,
  },
  detailText: {
    fontSize: 14,
    textAlign: "right",
    marginTop: 5,
    lineHeight: 20,
  },
});
