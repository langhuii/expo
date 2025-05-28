import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native'; // ✅ 추가

export default function HomeScreen({ navigation }) {
  const [username, setUsername] = useState('사용자');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isFocused = useIsFocused(); // ✅ 화면 포커스 여부
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const storedName = await AsyncStorage.getItem('username');

        if (token && storedName) {
          setUsername(storedName);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (e) {
        console.error('유저 데이터 불러오기 오류:', e);
        setIsLoggedIn(false);
      }
    };

    if (isFocused) {
      loadUserData(); // ✅ 포커스 될 때마다 데이터 로드
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        <>
          <Text style={styles.welcomeText}>
            <Text style={styles.italicText}>{username}</Text> 님 반가워요 !
          </Text>
          <TouchableOpacity
            style={styles.analysisButton}
            onPress={() => navigation.navigate('Emotion')}
          >
            <Text style={styles.analysisText}>내 감정 분석하러 가기</Text>
            <Ionicons name="arrow-forward" size={18} color="black" />
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={{ fontSize: 18, marginVertical: 20 }}>로그인이 필요합니다.</Text>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.registerButtonText}>로그인 하기</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}


// ✅ 스타일 설정
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDFBF5",
    alignItems: "center",
    paddingTop: 50,
  },
  profileCard: {
    width: "90%",
    backgroundColor: "#FDFBF5",
    borderRadius: 20,
    alignItems: "center",
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,
  },
  profileImage: {
    width: 250,
    height: 250,
    borderRadius: 180,
    top: 10,
    marginBottom: 40,
    borderWidth: 2,
    borderColor: 'black',
  },
  welcomeText: {
    fontSize: 25,
    fontWeight: "bold",
  },
  italicText: {
    fontStyle: "italic",
  },
  analysisButton: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    marginTop: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    elevation: 5,
  },
  analysisText: {
    fontSize: 20,
    marginRight: 10,
  },
  statsCard: {
    width: "90%",
    marginTop: 15,
    backgroundColor: "#FDFBF5",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    gap: 13,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  registerButton: {
  marginTop: 30,
  backgroundColor: "#A7C7FF",
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 10,
  elevation: 3,
},
registerButtonText: {
  color: "white",
  fontWeight: "bold",
  fontSize: 16,
},

});

