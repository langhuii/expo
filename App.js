import React, { useEffect, useState } from "react";
import { View, Text,Image, StyleSheet } from "react-native";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";


// 📌 화면 컴포넌트 불러오기
import HomeScreen from "./screens/HomeScreen";
import EmotionScreen from "./screens/EmotionScreen";
import CalendarScreen from "./screens/CalendarScreen";
import FeedScreen from "./screens/FeedScreen";
import WriteScreen from "./screens/WriteScreen";
import MemberProfileScreen from "./screens/MemberProfileScreen";
import GroupListScreen from "./screens/GroupListScreen"; 
import MakeGroupScreen from "./screens/MakeGroupScreen"; 
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import RecommendationScreen from "./screens/RecommendationScreen";
import MyGroupsScreen from "./screens/MyGroupsScreen";
import GroupFeedScreen from "./screens/GroupFeedScreen"; 
import GroupChatScreen from "./screens/GroupChatScreen"; 



SplashScreen.preventAutoHideAsync(); // 스플래시 화면 유지

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ✅ **하단 탭 네비게이션**
function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }} 
      />
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="heart-outline" size={size} color={color} />,
        }} 
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} />,
        }} 
      />
      <Tab.Screen
        name="Profile"
        component={MemberProfileScreen}  
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
        }} 
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        console.log("스플래시 화면 준비 중...");

        // 📌 폰트 로드 (로컬 폰트 추가)
        await Font.loadAsync({
          "BagelFatOne-Regular": require("./assets/fonts/BagelFatOne-Regular.ttf"),
        });

        await new Promise(resolve => setTimeout(resolve, 2000)); // 2초 대기
        console.log("스플래시 화면 준비 완료");
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
        SplashScreen.hideAsync(); // 스플래시 화면 숨김
      }
    }

    prepare();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.splashContainer}>
        {/* 🌟 스플래시 이미지 */}
        <Image 
          source={require("./assets/test.png")} 
        />
        
        {/* 🌟 기존 텍스트 */}
        <Text style={styles.text}>스플래시 화면</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Emotion" component={EmotionScreen} />
        <Stack.Screen name="WriteScreen" component={WriteScreen} />
        <Stack.Screen name="GroupListScreen" component={GroupListScreen} options={{ title: "그룹 목록" }} />
        <Stack.Screen name="MakeGroup" component={MakeGroupScreen} options={{ title: "그룹 만들기" }} />
        <Stack.Screen name="RecommendationScreen" component={RecommendationScreen} />
        <Stack.Screen name="MyGroups" component={MyGroupsScreen} />
        <Stack.Screen name="GroupFeed" component={GroupFeedScreen} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}
// ✅ 스타일 설정
const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  text: {
    fontSize: 20,
    fontFamily: "BagelFatOne-Regular", // 📌 일관된 글씨체 적용
  },
});
