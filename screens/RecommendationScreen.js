import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

export default function RecommendationScreen({ route }) {
  const { userEmotion, contentList } = route.params;
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [Username, setUserName] = useState("username");

  const contentMap = {
    슬픔: [
      { type: "영화", title: "청설", description: "감정이 얽힌 청춘의 이야기" },
      { type: "음악", title: "HAPPY - DAY6", description: "슬픔을 위로하는 밝은 멜로디" },
      { type: "도서", title: "내게 무해한 사람 - 최은영", description: "상처받은 이들을 위한 이야기" },
      { type: "드라마", title: "응답하라 1988", description: "그 시절 우리의 따뜻한 추억" },
    ],
    기쁨: [
      { type: "영화", title: "인사이드 아웃", description: "감정을 이해하는 여행" },
      { type: "음악", title: "좋은 날 - 아이유", description: "기분 좋은 날씨 같은 노래" },
      { type: "도서", title: "아몬드 - 손원평", description: "감정을 느끼지 못하는 소년의 이야기" },
      { type: "드라마", title: "미스터 션샤인", description: "시대를 거스른 사랑과 정의" },
    ],
    default: [
      { type: "영화", title: "위플래쉬", description: "뉴욕 음악학교의 열정과 고통", image: require("../assets/images/whiplash.png") },
      { type: "음악", title: "MANIAC - StrayKids", description: "폭발적 에너지를 담은 곡", image: require("../assets/images/maniac.png") },
      { type: "도서", title: "인간실격", description: "청년의 자아 붕괴와 파멸 이야기", image: require("../assets/images/person.png") },
      { type: "드라마", title: "킹덤", description: "조선시대 좀비 재난의 긴장감", image: require("../assets/images/kingdom.png") },
    ],
  };

  // 🔹 type 정규화 함수
  const normalizeType = (type) => {
    if (!type) return null;
    const lower = type.toLowerCase();
    if (lower.includes("movie") || type.includes("영화")) return "영화";
    if (lower.includes("music") || type.includes("음악")) return "음악";
    if (lower.includes("book")  || type.includes("도서")) return "도서";
    if (lower.includes("drama") || type.includes("드라마") || lower.includes("tv")) return "드라마";
    return type;
  };

  useEffect(() => {
    const fetchUsername = async () => {
      const storedName = await AsyncStorage.getItem("username");
      if (storedName) setUserName(storedName);
    };

    fetchUsername();

    if (contentList && contentList.length === 4) {
      // ✅ 서버에서 온 contentList도 정규화
      setRecommended(contentList.map((item) => ({
        ...item,
        type: normalizeType(item.type),
      })));
    } else {
      const key = Object.keys(contentMap).find((k) => userEmotion.includes(k));
      setRecommended(contentMap[key] || contentMap.default);
    }
    setLoading(false);
  }, []);

  // 🔹 애니메이션 값
  const circle1X = useSharedValue(0);
  const circle2X = useSharedValue(0);
  const circle3X = useSharedValue(0);
  const circle4X = useSharedValue(0);

  const animatedStyle1 = useAnimatedStyle(() => ({ transform: [{ translateX: circle1X.value }] }));
  const animatedStyle2 = useAnimatedStyle(() => ({ transform: [{ translateX: circle2X.value }] }));
  const animatedStyle3 = useAnimatedStyle(() => ({ transform: [{ translateX: circle3X.value }] }));
  const animatedStyle4 = useAnimatedStyle(() => ({ transform: [{ translateX: circle4X.value }] }));

  useEffect(() => {
    circle1X.value = withRepeat(withTiming(40, { duration: 3000, easing: Easing.inOut(Easing.ease) }), -1, true);
    circle2X.value = withRepeat(withTiming(-40, { duration: 4000, easing: Easing.inOut(Easing.ease) }), -1, true);
    circle3X.value = withRepeat(withTiming(30, { duration: 3500, easing: Easing.inOut(Easing.ease) }), -1, true);
    circle4X.value = withRepeat(withTiming(-30, { duration: 4500, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.subtext}>추천 콘텐츠를 불러오는 중입니다...</Text>
      </View>
    );
  }

  // ✅ 정규화된 데이터에서 타입별 추출
  const movie = recommended.find((r) => r.type === "영화");
  const music = recommended.find((r) => r.type === "음악");
  const book  = recommended.find((r) => r.type === "도서");
  const drama = recommended.find((r) => r.type === "드라마");

  return (
    <View style={styles.container}>
      {/* 🎬 영화 */}
      <Animated.View style={[styles.circle, styles.circleYellow, animatedStyle1, { top: 130, left: 20 }]}>
        {movie?.image && <Image source={movie.image} style={styles.circleImage} />}
        {movie?.imageUrl && <Image source={{ uri: movie.imageUrl }} style={styles.circleImage} />}
        <View style={styles.overlayContent}>
          <Text style={styles.circleText}>🎬 {movie?.title}</Text>
          <Text style={styles.circleSubText}>{movie?.description}</Text>
        </View>
      </Animated.View>

      {/* 🎧 음악 */}
      <Animated.View style={[styles.circle, styles.circleGreen, animatedStyle2, { top: 150, right: -60 }]}>
        {music?.image && <Image source={music.image} style={styles.circleImage} />}
        {music?.imageUrl && <Image source={{ uri: music.imageUrl }} style={styles.circleImage} />}
        <View style={styles.overlayContent}>
          <Text style={styles.circleText}>🎧 {music?.title}</Text>
          <Text style={styles.circleSubText}>{music?.description}</Text>
        </View>
      </Animated.View>

      {/* 📚 도서 */}
      <Animated.View style={[styles.circle, styles.circleBlue, animatedStyle3, { bottom: 80, left: -90 }]}>
        {book?.image && <Image source={book.image} style={styles.circleImage} />}
        {book?.imageUrl && <Image source={{ uri: book.imageUrl }} style={styles.circleImage} />}
        <View style={styles.overlayContent}>
          <Text style={styles.circleText}>📚 {book?.title}</Text>
          <Text style={styles.circleSubText}>{book?.description}</Text>
        </View>
      </Animated.View>

      {/* 📺 드라마 */}
      <Animated.View style={[styles.circle, styles.circlePink, animatedStyle4, { bottom: 180, right: -30 }]}>
        {drama?.image && <Image source={drama.image} style={styles.circleImage} />}
        {drama?.imageUrl && <Image source={{ uri: drama.imageUrl }} style={styles.circleImage} />}
        <View style={styles.overlayContent}>
          <Text style={styles.circleText}>📺 {drama?.title}</Text>
          <Text style={styles.circleSubText}>{drama?.description}</Text>
        </View>
      </Animated.View>

      {/* 📝 설명 */}
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
    paddingHorizontal: 20,
    paddingTop: 30,
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
  circle: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  circleYellow: { width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(252, 232, 168, 0.3)" },
  circleGreen: { backgroundColor: "rgba(169, 223, 191, 0.3)" },
  circleBlue: { width: 300, height: 300, borderRadius: 300, backgroundColor: "rgba(167, 199, 255, 0.3)" },
  circlePink: { width: 180, height: 180, borderRadius: 180, backgroundColor: "rgba(248, 175, 166, 0.3)" },
  circleImage: { width: "100%", height: "100%", borderRadius: 9999, position: "absolute", top: 0, left: 0 },
  overlayContent: { flex: 1, justifyContent: "center", alignItems: "center", padding: 10, zIndex: 1 },
  circleText: { fontSize: 13, fontWeight: "bold", textAlign: "center", backgroundColor: "rgba(255,255,255,0.8)" },
  circleSubText: { color: "#000", fontSize: 10, textAlign: "center", marginTop: 4, backgroundColor: "rgba(255,255,255,0.8)" },
});
