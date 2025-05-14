import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";

export default function CalendarScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [comment, setComment] = useState("");
  const [markedDates, setMarkedDates] = useState({});
  const [comments, setComments] = useState({});
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  const emojiList = [" 😃 ", " 😊 ", " 😢 ", " 😡 ", " 🤔 "];

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setComment("");
    setSelectedEmoji(markedDates[day.dateString]?.emoji || "");
    setEditingIndex(null);
  };

  const saveCommentAndEmoji = () => {
    if (!selectedDate) return;

    let updated = { ...comments };

    if (!updated[selectedDate]) {
      updated[selectedDate] = [];
    }

    if (editingIndex !== null) {
      updated[selectedDate][editingIndex] = comment;
      setEditingIndex(null);
    } else {
      updated[selectedDate].push(comment);
    }

    setComments(updated);
    setComment("");

    setMarkedDates({
      ...markedDates,
      [selectedDate]: {
        marked: true,
        dotColor: "#FF6347",
        selected: true,
        selectedColor: "#FFEBB2",
        customStyles: {
          container: { alignItems: "center", justifyContent: "center" },
          text: { color: "#000" },
        },
        emoji: selectedEmoji || markedDates[selectedDate]?.emoji || "",
      },
    });
  };

  const deleteComment = (index) => {
    const updated = { ...comments };
    updated[selectedDate].splice(index, 1);
    if (updated[selectedDate].length === 0) delete updated[selectedDate];
    setComments(updated);
  };

  const editComment = (index) => {
    setComment(comments[selectedDate][index]);
    setEditingIndex(index);
  };

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>소속 그룹</Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={handleDayPress}
          monthFormat={"yyyy MM"}
          hideExtraDays
          markedDates={markedDates}
          style={styles.calendar}
          dayComponent={({ date, state }) => (
            <TouchableOpacity
              onPress={() => handleDayPress({ dateString: date.dateString })}
              style={styles.dayContainer}
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
                <Text style={styles.emoji}>
                  {markedDates[date.dateString].emoji}
                </Text>
              )}
            </TouchableOpacity>
          )}
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
                    setMarkedDates({
                      ...markedDates,
                      [selectedDate]: {
                        ...markedDates[selectedDate],
                        emoji: emoji,
                      },
                    });
                  }}
                  style={[
                    styles.emojiButton,
                    markedDates[selectedDate]?.emoji === item &&
                      styles.selectedEmoji,
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
            <TouchableOpacity onPress={saveCommentAndEmoji}>
              <Ionicons name="checkmark" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </>
      )}

      <View style={styles.memoContainer}>
        <FlatList
          data={comments[selectedDate] || []}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.commentItem}>
              <Text style={styles.commentText}>{item}</Text>
              <View style={styles.commentActions}>
                <TouchableOpacity onPress={() => editComment(index)}>
                  <Ionicons name="pencil" size={18} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteComment(index)}>
                  <Ionicons name="trash" size={18} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E1", // ✅ 배경 유지
    alignItems: "center",
    paddingTop: 0, // ✅ 위쪽 패딩 제거
  },
  
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5, // 🔽 간결한 네비
    paddingHorizontal: 15,
    width: "100%", // 전체 너비 채우기
  },
  
  calendarContainer: {
    width: "90%",
    height: 420,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    padding: 10,
    marginTop: 10, // 🔽 자연스럽게 아래 위치
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  
  navTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  calendarContainer: {
    width: "90%",
    height: 420,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    padding: 10,
    marginTop: 50,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  calendar: {
    height: "100%",
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
  },
  dayContainer: {
    width: 50,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    margin: 2,
    position: "relative",
    flexDirection: "column",
  },
  dayText: {
    fontSize: 18,
    color: "#000",
    position: "absolute",
    bottom: 5,
    marginBottom: 30,
  },
  emoji: {
    fontSize: 18,
    marginTop: 2,
    backgroundColor: "#FFF5CC",
    borderRadius: 10,
    minHeight: 20,
  },
  emojiContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 30,
  },
  emojiText: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  emojiButton: {
    padding: 8,
    marginHorizontal: 5,
    backgroundColor: "#FFF5CC",
    borderRadius: 10,
  },
  selectedEmoji: {
    backgroundColor: "#FFD700",
    borderWidth: 1,
    borderColor: "#FFA500",
  },
  commentContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5CC",
    borderRadius: 20,
    padding: 10,
    width: "90%",
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
    color: "#000",
  },
  memoContainer: {
    width: "90%",
    backgroundColor: "#FFFBF0",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  commentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#FFF",
    borderRadius: 10,
  },
  commentText: {
    fontSize: 14,
    color: "#000",
  },
  commentActions: {
    flexDirection: "row",
    gap: 10,
  },
});
