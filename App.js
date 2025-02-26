import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as SplashScreen from "expo-splash-screen";

import HomeScreen from "./screens/HomeScreen";
import EmotionScreen from "./screens/EmotionScreen";
import CalendarScreen from "./screens/CalendarScreen";
import FeedScreen from "./screens/FeedScreen";
import WriteScreen from './screens/WriteScreen';

console.log("앱 실행됨"); // 앱 실행 확인용 로그

SplashScreen.preventAutoHideAsync(); // 스플래시 화면 유지

const { width, height } = Dimensions.get("window"); // 기기 화면 크기 가져오기

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        console.log("스플래시 화면 준비 중...");
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
        <Text style={styles.text}>스플래시 화면</Text>
      </View>
    );
  }

  function MainTabs() {
    return (
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,}} 
        />
        <Tab.Screen
          name="Feed"
          component={FeedScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="heart-outline" size={size} color={color} />,}} 
        />
        <Tab.Screen
          name="Calendar"
          component={CalendarScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} />,}} 
        />
      </Tab.Navigator>
    );
  }

  return (
    
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Emotion" component={EmotionScreen} />
        <Stack.Screen name="WriteScreen" component={WriteScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  text: {
    fontSize: 20,
  },
});
