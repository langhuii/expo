import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image,
  Dimensions, ActivityIndicator, TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { client } from '../api/client'; // ✅ 공통 axios 인스턴스

const screenWidth = Dimensions.get('window').width;

// baseURL이 ".../api"라면 호스트 부분만 뽑기
const getApiOrigin = () => (client.defaults.baseURL || '').replace(/\/api\/?$/, '');

export default function HomeScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [emotionStats, setEmotionStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const inFlightRef = useRef(false); // 🔒 중복 호출 방지

  const logAxiosError = (err) => {
    const r = err?.response;
    console.log("❌ API 실패:",
      r?.status, r?.config?.method?.toUpperCase(), r?.config?.url);
    console.log("❌ req headers:", r?.config?.headers);
    console.log("❌ res data:", r?.data);
  };

  const fetchData = async () => {
    if (inFlightRef.current) return;   // 🔒 중복 방지
    inFlightRef.current = true;

    setLoading(true);
    try {
      // 1) 🆔 userId 확보 (AsyncStorage 우선, 없으면 /users/me)
      let userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        const meRes = await client.get('/users/me');
        userId = String(meRes.data.id ?? meRes.data.userId);
        await AsyncStorage.setItem('userId', userId);
      }
      console.log('✔️ userId(숫자) 사용:', userId);

      // 2) 👤 프로필 조회 (실패 시 기본값)
      try {
        const profileRes = await client.get(`/users/${userId}`);
        const uname = (profileRes.data?.username ?? '').trim();
        setUsername(uname);

        const raw = profileRes.data?.profileImageUrl;
        if (raw) {
          const full = raw.startsWith('http') ? raw : `${getApiOrigin()}${raw}`;
          setProfileImageUrl(`${full}?t=${Date.now()}`); // 캐시 무효화
        } else {
          setProfileImageUrl(null);
        }
      } catch (e) {
        logAxiosError(e);
        // 404/500 등 어떤 이유로든 프로필 실패 → 기본값
        const storedName = (await AsyncStorage.getItem('username')) || '';
        setUsername(storedName.trim() || '사용자');
        setProfileImageUrl(null);
      }

      // 3) 📊 감정 통계 조회 (실패 시 0 데이터)
      try {
        const statsRes = await client.get(`/emotion/stats/${userId}`);
        setEmotionStats(statsRes.data);
      } catch (e) {
        logAxiosError(e);
        setEmotionStats(null); // 차트는 0으로 표시됨
      }

    } catch (error) {
      logAxiosError(error);
    } finally {
      setLoading(false);
      inFlightRef.current = false;
    }
  };

  useEffect(() => {
    fetchData();
    const unsubscribe = navigation.addListener('focus', fetchData);
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
            maxValue={
              emotionStats
                ? Math.max(...Object.values(emotionStats).map(v => v * 100), 5)
                : 100
            }
            showBarTops
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              barPercentage: 0.6,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: () => '#000',
              propsForBackgroundLines: { stroke: '#e0e0e0', strokeDasharray: '' },
              propsForLabels: { fontSize: 12 }
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

