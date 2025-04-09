import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { fetchRecommendations } from "../api/recommendAPI";

export default function RecommendationScreen({ route }) {
  const { userEmotion } = route.params;
  const [Username, setUserName] = useState("사용자"); 
  // ✅ 기본 콘텐츠 맵
  const contentMap = {
    슬픔: [
      { type: "영화", title: "청설" },
      { type: "음악", title: "HAPPY - DAY6" },
      { type: "도서", title: "내게 무해한 사람 - 최은영" },
      { type: "드라마", title: "응답하라 1988" },
    ],
    기쁨: [
      { type: "영화", title: "인사이드 아웃" },
      { type: "음악", title: "좋은 날 - 아이유" },
      { type: "도서", title: "아몬드 - 손원평" },
      { type: "드라마", title: "미스터 션샤인" },
    ],
    default: [
      { type: "영화", title: "위플래쉬" },
      { type: "음악", title: "MANIAC - StrayKids" },
      { type: "도서", title: "인간실격" },
      { type: "드라마", title: "킹덤" },
    ],
  };

  // ✅ 감정 키 추출 및 기본 추천
  const emotionKey = Object.keys(contentMap).find((key) =>
    userEmotion.includes(key)
  );
  const defaultRecommendation = contentMap[emotionKey] || contentMap.default;

  // ✅ 상태에 기본 추천 세팅
  const [recommended, setRecommended] = useState(defaultRecommendation);

  // ✅ 서버에서 추천 데이터 받아오면 덮어쓰기
  useEffect(() => {
    const loadRecommendations = async () => {
      const data = await fetchRecommendations(userEmotion);
      if (data && data.length === 4) {
        setRecommended(data);
      } // 아니면 기본값 유지
    };

    loadRecommendations();
  }, [userEmotion]);

  // ✅ 애니메이션 설정 (생략 없이 동일)
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
    circle1X.value = withRepeat(withTiming(40, { duration: 3000, easing: Easing.inOut(Easing.ease) }), -1, true);
    circle2X.value = withRepeat(withTiming(-40, { duration: 4000, easing: Easing.inOut(Easing.ease) }), -1, true);
    circle3X.value = withRepeat(withTiming(30, { duration: 3500, easing: Easing.inOut(Easing.ease) }), -1, true);
    circle4X.value = withRepeat(withTiming(-30, { duration: 4500, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circle, styles.circleYellow, animatedStyle1, { top: 130, left: 20 }]}>
        <Text style={styles.circleText}>🎬 영화{"\n"}{recommended[0]?.title}</Text>
      </Animated.View>
      <Animated.View style={[styles.circle, styles.circleGreen, animatedStyle2, { top: 150, right: -60 }]}>
        <Text style={styles.circleText}>🎧 음악{"\n"}{recommended[1]?.title}</Text>
      </Animated.View>
      <Animated.View style={[styles.circle, styles.circleBlue, animatedStyle3, { bottom: 80, left: -90 }]}>
        <Text style={styles.circleText}>📚 도서{"\n"}{recommended[2]?.title}</Text>
      </Animated.View>
      <Animated.View style={[styles.circle, styles.circlePink, animatedStyle4, { bottom: 180, right: -30 }]}>
        <Text style={styles.circleText}>📺 드라마{"\n"}{recommended[3]?.title}</Text>
      </Animated.View>

      <Text style={styles.header}>{Username}님의 감정을 분석하여 추천한 컨텐츠들이에요</Text>
      <Text style={styles.subtext}>
        당신의 감정: <Text style={styles.emotion}>{userEmotion}</Text>
      </Text>
    </View>
  );
}

// 🔹 스타일
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDFBF5",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtext: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  emotion: {
    fontWeight: "bold",
    color: "#F59E0B",
  },
  contentType: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },

  // 🔹 배경 원 스타일
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: -1,
  },
  circle: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center", // 중앙 정렬
    alignItems: "center", // 세로 정렬 맞춤
  },
  circleYellow: {
    backgroundColor: "#FCE8A8",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(252, 232, 168, 0.3)", // RGB + 불투명도
  },
  circleGreen: {
    backgroundColor: "rgba(169, 223, 191, 0.3)", 
  },
  circleBlue: {
    width: 300,
    height: 300,
    borderRadius: 300,
    backgroundColor: "rgba(167, 199, 255, 0.3)", 
},

  circlePink: {
    backgroundColor: "rgba(248, 175, 166, 0.3)", 
    width: 180,
    height: 180,
    borderRadius: 180,
  },
  circleText: {
    textAlign: "center",
    fontSize: 12,
    color: "#000000",
    fontWeight: "bold",
  },
});

