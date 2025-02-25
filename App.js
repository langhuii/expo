import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import * as SplashScreen from "expo-splash-screen";

console.log("앱 실행됨"); // 앱 실행 확인용 로그

SplashScreen.preventAutoHideAsync(); // 앱 시작 시 스플래시 화면 유지

const { width, height } = Dimensions.get("window"); // 기기 화면 크기 가져오기

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000)); // 3초 대기
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>홈 화면</Text>
    </View>
  );
}

// ✅ 스타일 수정 (애니메이션 크기 및 정렬)
const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 20,
  },
});
