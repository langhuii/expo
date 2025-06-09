import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const GroupChatScreen = () => {
  const [messages, setMessages] = useState([
    { id: '1', user: 'Brian', time: '10:00 AM', text: '안녕하세요!' },
    { id: '2', user: 'Me', time: '10:01 AM', text: '안녕하세요, 반가워요!' },
  ]);
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim() === '') return;
    const newMessage = {
      id: Date.now().toString(),
      user: 'Me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: text.trim(),
    };
    setMessages([newMessage, ...messages]);
    setText('');
  };

  const renderMessage = ({ item }) => {
    const isMe = item.user === 'Me';
    return (
      <View style={[styles.messageContainer, isMe ? styles.myMessage : styles.otherMessage]}>
        <Text style={styles.user}>{item.user}</Text>
        <Text style={styles.text}>{item.text}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerText}>그룹 채팅</Text>
      </View>

      {/* 채팅 목록 */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
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
    </View>
  );
};

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

export default GroupChatScreen;
