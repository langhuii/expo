import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function GroupChatScreen({ route }) {
  const { roomId = 'room1', username = 'Me' } = route.params || {}; // 채팅방 ID 및 사용자 이름
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const socketRef = useRef(null);

  // WebSocket 연결 설정
  useEffect(() => {
    const socketUrl = `http://124.50.249.203:8080/ws/chat/${roomId}?name=${username}`;
    socketRef.current = new WebSocket(socketUrl);

    socketRef.current.onopen = () => {
      console.log('✅ WebSocket 연결됨');
    };

    socketRef.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        setMessages((prevMessages) => [message, ...prevMessages]);
      } catch (error) {
        console.error('❌ 메시지 파싱 실패:', error);
      }
    };

    socketRef.current.onerror = (error) => {
      console.error('❌ WebSocket 오류:', error.message);
    };

    socketRef.current.onclose = () => {
      console.log('🔌 WebSocket 연결 종료됨');
    };

    return () => {
      socketRef.current.close();
    };
  }, [roomId, username]);

  // 메시지 전송
  const handleSend = () => {
    if (text.trim() === '') return;

    const chatMessage = {
      user: username,
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      readUsers: []
    };

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(chatMessage));
      setText('');
    } else {
      console.warn('⚠️ WebSocket이 연결되어 있지 않습니다.');
    }
  };

  // 메시지 렌더링
  const renderMessage = ({ item }) => {
    const isMe = item.user === username;
    return (
      <View style={[styles.messageContainer, isMe ? styles.myMessage : styles.otherMessage]}>
        <Text style={styles.user}>{item.user}</Text>
        <Text style={styles.text}>{item.text}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerText}>그룹 채팅</Text>
      </View>

      {/* 채팅 목록 */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        style={styles.chatList}
        inverted
      />

      {/* 입력창 */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="메시지를 입력하세요"
        />
        <TouchableOpacity onPress={handleSend}>
          <Icon name="send" size={24} color="#FFA500" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { height: 60, backgroundColor: '#FFD59E', justifyContent: 'center', alignItems: 'center' },
  headerText: { fontSize: 18, fontWeight: 'bold' },
  chatList: { flex: 1, padding: 10 },
  messageContainer: { padding: 10, borderRadius: 10, marginVertical: 5, maxWidth: '80%' },
  myMessage: { backgroundColor: '#DCF8C6', alignSelf: 'flex-end' },
  otherMessage: { backgroundColor: '#F1F0F0', alignSelf: 'flex-start' },
  user: { fontWeight: 'bold', marginBottom: 2 },
  text: { fontSize: 16 },
  time: { fontSize: 10, color: '#666', alignSelf: 'flex-end', marginTop: 4 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, borderColor: '#ddd' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 10, marginRight: 10, height: 40 },
});

