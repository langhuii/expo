import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
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
  const [Username, setUserName] = useState("사용자");

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
      { type: "영화", title: "위플래쉬", description: "뉴욕 음악학교의 열정과 고통, 플레쳐 교수와 드러머 앤드류의 극한 경쟁 이야기",image: require("../assets/images/whiplash.png"), },
      { type: "음악", title: "MANIAC - StrayKids", description: "폭발적 에너지를 담은 스트레이키즈 대표곡",image: require("../assets/images/maniac.png") },
      { type: "도서", title: "인간실격", description: "순수했던 청년의 자아 붕괴와 사회적 파멸의 이야기" ,image: require("../assets/images/person.png")},
      { type: "드라마", title: "킹덤", description: "조선시대 좀비 재난의 긴장감 넘치는 전개",image: require("../assets/images/kingdom.png")},
    ],
  };

  useEffect(() => {
    if (contentList && contentList.length === 4) {
      setRecommended(contentList);
    } else {
      const key = Object.keys(contentMap).find((k) => userEmotion.includes(k));
      setRecommended(contentMap[key] || contentMap.default);
    }
    setLoading(false);
  }, []);

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
  return (
    <View style={styles.container}>
  
      {/* 🎬 영화 */}
      <Animated.View style={[styles.circle, styles.circleYellow, animatedStyle1, { top: 130, left: 20 }]}>
      {recommended[0]?.image && (
    <Image source={recommended[0].image} style={styles.circleImage} resizeMode="cover" />
  )}
  {recommended[0]?.imageUrl && (
    <Image source={{ uri: recommended[0].imageUrl }} style={styles.circleImage} resizeMode="cover" />
  )}
        <View style={styles.overlayContent}>
          <Text style={styles.circleText}>
            🎬 {recommended[0]?.type}{"\n"}{recommended[0]?.title}
          </Text>
          <Text style={styles.circleSubText}>
            {recommended[0]?.description}
          </Text>
        </View>
      </Animated.View>
      
  
      {/* 🎧 음악 */}
      <Animated.View style={[styles.circle, styles.circleGreen, animatedStyle2, { top: 150, right: -60 }]}>
      {recommended[1]?.image && (
    <Image source={recommended[1].image} style={styles.circleImage} resizeMode="cover" />
  )}
  {recommended[1]?.imageUrl && (
    <Image source={{ uri: recommended[1].imageUrl }} style={styles.circleImage} resizeMode="cover" />
  )}
        <View style={styles.overlayContent}>
          <Text style={styles.circleText}>
            🎧 {recommended[1]?.type}{"\n"}{recommended[1]?.title}
          </Text>
          <Text style={styles.circleSubText}>
            {recommended[1]?.description}
          </Text>
        </View>
      </Animated.View>
  
      {/* 📚 도서 */}
      <Animated.View style={[styles.circle, styles.circleBlue, animatedStyle3, { bottom: 80, left: -90 }]}>
      {recommended[2]?.image && (
    <Image source={recommended[2].image} style={styles.circleImage} resizeMode="cover" />
  )}
  {recommended[2]?.imageUrl && (
    <Image source={{ uri: recommended[2].imageUrl }} style={styles.circleImage} resizeMode="cover" />
  )}
        <View style={styles.overlayContent}>
          <Text style={styles.circleText}>
            📚 {recommended[2]?.type}{"\n"}{recommended[2]?.title}
          </Text>
          <Text style={styles.circleSubText}>
            {recommended[2]?.description}
          </Text>
        </View>
      </Animated.View>
  
      {/* 📺 드라마 */}
      <Animated.View style={[styles.circle, styles.circlePink, animatedStyle4, { bottom: 180, right: -30 }]}>
      {recommended[3]?.image && (
    <Image source={recommended[3].image} style={styles.circleImage} resizeMode="cover" />
  )}
  {recommended[3]?.imageUrl && (
    <Image source={{ uri: recommended[3].imageUrl }} style={styles.circleImage} resizeMode="cover" />
  )}
        <View style={styles.overlayContent}>
          <Text style={styles.circleText}>
            📺 {recommended[3]?.type}{"\n"}{recommended[3]?.title}
          </Text>
          <Text style={styles.circleSubText}>
            {recommended[3]?.description}
          </Text>
        </View>
      </Animated.View>
  
      {/* 📝 설명 텍스트 */}
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
  circleImage: {
    width: "100%",
    height: "100%",
    borderRadius: 9999,
    position: "absolute", 
    top: 0,
    left: 0,
  },
  
  overlayContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    zIndex: 1, // 이미지 위에 오게
    justifyContent: "flex-start", // 위쪽 정렬
  },
  
  circleText: {
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "rgba(255,255,255,1)", // 확인용 배경
  },
  
  circleSubText: {
    color: "#000",
    fontSize: 10,
    textAlign: "center",
    marginTop: 4,
    backgroundColor: "rgba(255,255,255,1)", // 확인용 배경
  },
  
});

