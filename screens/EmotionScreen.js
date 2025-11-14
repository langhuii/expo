import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function EmotionScreen({ navigation }) {
  const [emotion, setEmotion] = useState("");

  const sendEmotionToServer = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // 1단계: 감정 분석
      const analyzeRes = await axios.post(
        "https://43eca66ba2c5.ngrok-free.app/api/emotion/analyze",
        { text: emotion },
        { headers }
      );
      console.log("🟢 감정 분석 결과:", analyzeRes.data);

      const detectedEmotion = analyzeRes.data.topEmotion;

      // 2단계: 감정 기록
      await axios.post(
        "https://43eca66ba2c5.ngrok-free.app/api/recommend",
        { text: detectedEmotion },
        { headers }
      );

      // 3단계: 추천 콘텐츠 요청
      const recommendRes = await axios.post(
        "https://43eca66ba2c5.ngrok-free.app/api/recommend",
        { emotion: detectedEmotion },
        { headers }
      );
      console.log("🟣 추천 결과:", recommendRes.data);

      return {
        emotion: detectedEmotion,
        content: recommendRes.data.recommendations,
      };
    } catch (error) {
      console.warn("⚠️ 감정 분석 또는 추천 실패:", error.message);
      if (error.response) {
        console.warn("📛 서버 응답 상태:", error.response.status);
        console.warn("📛 서버 응답 내용:", error.response.data);
      } else {
        console.warn("📛 응답이 없음:", error);
      }
      return null;
    }
  };

  const circle1X = useSharedValue(0);
  const circle2X = useSharedValue(0);
  const circle3X = useSharedValue(0);
  const circle4X = useSharedValue(0);

  const animatedStyle1 = useAnimatedStyle(() => ({
    transform: [{ translateX: circle1X.value }],
  }));
  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{ translateX: circle2X.value }],
  }));
  const animatedStyle3 = useAnimatedStyle(() => ({
    transform: [{ translateX: circle3X.value }],
  }));
  const animatedStyle4 = useAnimatedStyle(() => ({
    transform: [{ translateX: circle4X.value }],
  }));

  useEffect(() => {
    circle1X.value = withRepeat(
      withTiming(50, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    circle2X.value = withRepeat(
      withTiming(-50, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    circle3X.value = withRepeat(
      withTiming(30, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    circle4X.value = withRepeat(
      withTiming(-40, { duration: 3500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>내 감정 분석</Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.background}>
        <Animated.View
          style={[
            styles.circle,
            styles.circleYellow,
            animatedStyle1,
            { top: 140, left: 30 },
          ]}
        />
        <Animated.View
          style={[
            styles.circle,
            styles.circleGreen,
            animatedStyle2,
            { top: 170, right: -70 },
          ]}
        />
        <Animated.View
          style={[
            styles.circle,
            styles.circleBlue,
            animatedStyle3,
            { bottom: 50, left: -100 },
          ]}
        />
        <Animated.View
          style={[
            styles.circle,
            styles.circlePink,
            animatedStyle4,
            { bottom: 200, right: -30 },
          ]}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="오늘 당신의 기분을 입력해주세요."
        placeholderTextColor="#aaa"
        value={emotion}
        onChangeText={setEmotion}
      />

      <TouchableOpacity
        style={[
          styles.nextButton,
          emotion.trim() === "" && styles.disabledButton,
        ]}
        disabled={emotion.trim() === ""}
        onPress={async () => {
          const result = await sendEmotionToServer();
          if (result) {
            navigation.navigate("RecommendationScreen", {
              userEmotion: result.emotion,
              contentList: result.content,
            });
          }
        }}
      >
        <Text style={styles.nextButtonText}>다음</Text>
        <Ionicons name="chevron-forward-outline" size={20} color="black" />
      </TouchableOpacity>
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
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 35,
    paddingHorizontal: 10,
    backgroundColor: "#FCE8A8",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "absolute",
    top: 0,
    width: "100%",
  },
  navTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  circle: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.3,
  },
  circleYellow: { backgroundColor: "#FCE8A8", width: 200, height: 200, borderRadius: 100 },
  circleGreen: { backgroundColor: "#A9DFBF" },
  circleBlue: { backgroundColor: "#A7C7FF", width: 300, height: 300, borderRadius: 300 },
  circlePink: { backgroundColor: "#F8AFA6", width: 180, height: 180, borderRadius: 180 },
  input: {
    marginTop: 200,
    width: "80%",
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#ccc",
    textAlign: "center",
    backgroundColor: "white",
  },
  nextButton: {
    position: "absolute",
    bottom: 30, 
    width: "50%",
    borderRadius: 100,
    paddingVertical: 15,
    flexDirection: "row", // 아이콘과 글자 수평 정렬
    justifyContent: "center", // 중앙 정렬
    alignItems: "center", // 세로 정렬 맞춤
    backgroundColor: "#FCE8A8",
    borderColor: "#ccc",
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10, // 아이콘과 간격을 조정
  },
  arrowIcon: {
    width: 20,
    height: 20,
  },
  disabledButton: {
    backgroundColor: "#ddd", // 입력값이 없을 때 버튼 색상 변경
  },
});
