import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarChart } from 'react-native-chart-kit';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;
const BASE_URL = 'http://124.50.249.203:8080';

const parseJwt = (token) => {
  try {
    if (!token) throw new Error('토큰 없음');

    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const parsed = JSON.parse(jsonPayload);
    console.log('✅ JWT Payload:', parsed);
    return parsed;
  } catch (e) {
    console.error('❌ JWT 파싱 실패:', e);
    return null;
  }
};

export default function HomeScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [emotionStats, setEmotionStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('token');
        const decoded = parseJwt(token);

        if (!decoded) {
          console.error('❌ 디코딩 실패로 인해 사용자 정보를 불러올 수 없습니다.');
          setLoading(false);
          return;
        }

        const userId = decoded.userId || decoded.id || decoded.sub;
        console.log('✔️ 유저 아이디:', userId);
        await AsyncStorage.setItem('userId', userId.toString());

        const profileRes = await axios.get(`${BASE_URL}/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log('🎯 백엔드 프로필 응답:', profileRes.data);
        setUsername(profileRes.data.username);
        if (profileRes.data.profileImageUrl) {
            const refreshed = `${BASE_URL}${profileRes.data.profileImageUrl}?t=${Date.now()}`;
            setProfileImageUrl(refreshed);
          } else {
            setProfileImageUrl(null);
          }
        const statsRes = await axios.get(`${BASE_URL}/api/emotion/stats/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('📊 감정 통계 응답:', statsRes.data);
        setEmotionStats(statsRes.data);
      } catch (error) {
        console.error('데이터 로딩 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // 최초 실행

    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });

    return unsubscribe;
  }, [navigation]);

  const chartData = emotionStats
    ? {
        labels: Object.keys(emotionStats),
        datasets: [{ data: Object.values(emotionStats).map(v => v * 100) }]
        
      }
    : {
        labels: ['😀', '😭', '😡', '😑', '😫'],
        datasets: [{ data: [0, 0, 0, 0, 0] }]
      };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <>
          <View style={styles.profileCard}>
            <Image
              source={
                profileImageUrl && profileImageUrl !== 'null'
                  ? { uri: profileImageUrl }
                  : require('../assets/profile.jpg')
              }
              style={styles.profileImage}
            />
            <Text style={styles.welcomeText}>
              <Text style={styles.italicText}>{username}</Text> 님 반가워요!
            </Text>
          </View>

          <TouchableOpacity
            style={styles.analysisButton}
            onPress={() => navigation.navigate('Emotion')}
          >
            <Text style={styles.analysisText}>내 감정 분석하러 가기</Text>
            <Ionicons name="arrow-forward" size={18} color="black" />
          </TouchableOpacity>

          <Text style={styles.chartTitle}>📊 이번 달 감정 통계</Text>
          <BarChart
            data={chartData}
            width={screenWidth - 40}
            height={220}
            fromZero
            segments={5}
            yAxisInterval={1}
            maxValue={Math.max(...Object.values(emotionStats || {}), 5)}
            showBarTops={true}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              barPercentage: 0.6,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: () => '#000',
              propsForBackgroundLines: {
                stroke: '#e0e0e0',
                strokeDasharray: '',
              },
              propsForLabels: {
                fontSize: 12,
              }
            }}
            style={{ marginVertical: 8, borderRadius: 16 }}
            yAxisSuffix="%"
            verticalLabelRotation={30}
          />
        </>
      )}
    </ScrollView>
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
    marginBottom:30,
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
chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center'
  },

});

