import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  fetchCalendarEntries,
  saveCalendarEntry,
  deleteCalendarEntry
} from "../api/calendarAPI";

export default function CalendarScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [comment, setComment] = useState("");
  const [markedDates, setMarkedDates] = useState({});
  const [comments, setComments] = useState({});
  const [selectedEmoji, setSelectedEmoji] = useState("");

  const emojiList = [" 😊 ", " 😭 ", " 😡 ", " 😖 ", " 😐 "];

  useEffect(() => {
    const loadData = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) throw new Error("userId가 없음");

        const entries = await fetchCalendarEntries();
        let commentMap = {};
        let dateMarks = {};

        entries.forEach((entry) => {
          commentMap[entry.date] = entry.comment;
          dateMarks[entry.date] = {
            marked: true,
            dotColor: "#FF6347",
            selected: false,
            emoji: entry.emoji,
          };
        });

        setComments(commentMap);
        setMarkedDates(dateMarks);
      } catch (error) {
        console.error("Error loading calendar data", error);
        Alert.alert("불러오기 실패", "로그인이 필요합니다.");
      }
    };

    loadData();
  }, []);

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setComment(comments[day.dateString] || "");
    setSelectedEmoji(markedDates[day.dateString]?.emoji || "");

    // ✅ 선택된 날짜만 강조
    setMarkedDates((prev) => {
      const updated = {};
      Object.keys(prev).forEach((d) => {
        updated[d] = { ...prev[d], selected: false };
      });
      updated[day.dateString] = {
        ...(prev[day.dateString] || {}),
        selected: true,
        emoji: prev[day.dateString]?.emoji || "",
      };
      return updated;
    });
  };

  const handleSave = async () => {
    if (!selectedDate) return;

    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) return Alert.alert("저장 실패", "userId가 없습니다.");

      await saveCalendarEntry(userId, selectedDate, comment, selectedEmoji);
      

      setComments((prev) => ({
        ...prev,
        [selectedDate]: comment,
      }));

      setMarkedDates((prev) => ({
        ...prev,
        [selectedDate]: {
          ...prev[selectedDate],
          marked: true,
          selected: true,
          emoji: selectedEmoji,
        },
      }));

      setComment("");
    } catch (error) {
      console.error("Error saving entry", error);
      Alert.alert("저장 실패", "감정 또는 코멘트를 저장하는 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async () => {
    if (!selectedDate) return;
    try {
      await deleteCalendarEntry(selectedDate);

      const updated = { ...comments };
      delete updated[selectedDate];
      setComments(updated);

      const marks = { ...markedDates };
      delete marks[selectedDate];
      setMarkedDates(marks);
    } catch (error) {
      console.error("Error deleting entry", error);
      Alert.alert("삭제 실패", "서버에서 삭제하는 중 문제가 발생했습니다.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.navTitle}>감정 캘린더</Text>

      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={markedDates}
          style={styles.calendar}
          dayComponent={({ date, state }) => {
            const isSelected = markedDates[date.dateString]?.selected;
            return (
              <TouchableOpacity
                onPress={() => handleDayPress({ dateString: date.dateString })}
                style={[
                  styles.dayContainer,
                  isSelected && styles.selectedDay, // ✅ 선택 스타일 적용
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    state === "disabled" && { color: "gray" },
                  ]}
                >
                  {date.day}
                </Text>
                {markedDates[date.dateString]?.emoji && (
                  <Text style={styles.emoji}>{markedDates[date.dateString].emoji}</Text>
                )}
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {selectedDate && (
        <>
          <View style={styles.emojiContainer}>
            <Text style={styles.emojiText}>감정 선택:</Text>
            <FlatList
              data={emojiList}
              horizontal
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    const emoji = selectedEmoji === item ? "" : item;
                    setSelectedEmoji(emoji);
                    setMarkedDates((prev) => ({
                      ...prev,
                      [selectedDate]: {
                        ...prev[selectedDate],
                        emoji,
                      },
                    }));
                  }}
                  style={[
                    styles.emojiButton,
                    markedDates[selectedDate]?.emoji === item && styles.selectedEmoji,
                  ]}
                >
                  <Text style={styles.emoji}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>

          <View style={styles.commentContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="한 줄 코멘트 작성"
              value={comment}
              onChangeText={setComment}
            />
            <TouchableOpacity onPress={handleSave}>
              <Ionicons name="checkmark" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </>
      )}

      {selectedDate && comments[selectedDate] && (
        <View style={styles.memoContainer}>
          <View style={styles.commentItem}>
            <Text style={styles.commentText}>{comments[selectedDate]}</Text>
            <View style={styles.commentActions}>
              <TouchableOpacity onPress={() => setComment(comments[selectedDate])}>
                <Ionicons name="pencil" size={18} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete}>
                <Ionicons name="trash" size={18} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  navTitle: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginVertical: 16 },
  calendarContainer: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, marginBottom: 20 },
  calendar: { borderRadius: 8 },
  dayContainer: { alignItems: "center", justifyContent: "center", padding: 6 },
  selectedDay: { backgroundColor: "#FFD580", borderRadius: 20 }, // ✅ 선택된 날짜 강조
  dayText: { fontSize: 16 },
  emoji: { fontSize: 18, marginTop: 2 },
  emojiContainer: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  emojiText: { fontSize: 16, marginRight: 8 },
  emojiButton: {
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedEmoji: { backgroundColor: "#FFEBB2" },
  commentContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  commentInput: { flex: 1, height: 40 },
  memoContainer: { marginTop: 10 },
  commentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  commentText: { fontSize: 14, flex: 1 },
  commentActions: { flexDirection: "row", gap: 10, marginLeft: 10 },
});
