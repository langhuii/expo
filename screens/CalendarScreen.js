import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from "react-native";
import { Calendar } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState("");
  const [comment, setComment] = useState("");
  const [markedDates, setMarkedDates] = useState({});
  const [comments, setComments] = useState({});
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  const emojiList = ["😃", "😊", "😢", "😡", "🤔"];

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setComment("");
    setSelectedEmoji(markedDates[day.dateString]?.emoji || "");
    setEditingIndex(null);
  };

  const saveCommentAndEmoji = () => {
    if (!selectedDate) return;

    let updatedComments = { ...comments };
    if (!updatedComments[selectedDate]) {
      updatedComments[selectedDate] = [];
    }

    if (editingIndex !== null) {
      updatedComments[selectedDate][editingIndex] = comment;
      setEditingIndex(null);
    } else {
      updatedComments[selectedDate].push(comment);
    }

    setComments(updatedComments);
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
    let updatedComments = { ...comments };
    updatedComments[selectedDate].splice(index, 1);
    if (updatedComments[selectedDate].length === 0) {
      delete updatedComments[selectedDate];
    }
    setComments(updatedComments);
  };

  const editComment = (index) => {
    setComment(comments[selectedDate][index]);
    setEditingIndex(index);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>APRIL</Text>

      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={handleDayPress}
          monthFormat={"yyyy MM"}
          hideExtraDays={true}
          markedDates={markedDates}
          dayComponent={({ date, state }) => (
            <TouchableOpacity onPress={() => handleDayPress({ dateString: date.dateString })} style={styles.dayContainer}>
              <Text style={[styles.dayText, state === "disabled" && { color: "gray" }]}>{date.day}</Text>
              {markedDates[date.dateString]?.emoji && (
                <Text style={styles.emoji}>{markedDates[date.dateString].emoji}</Text>
              )}
            </TouchableOpacity>
          )}
        />
      </View>

      {selectedDate ? (
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
                    setSelectedEmoji(prevEmoji => prevEmoji === item ? "" : item);
                    setMarkedDates({
                      ...markedDates,
                      [selectedDate]: {
                        ...markedDates[selectedDate],
                        emoji: selectedEmoji === item ? "" : item,
                      },
                    });
                  }}
                  style={[styles.emojiButton, markedDates[selectedDate]?.emoji === item && styles.selectedEmoji]}
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
            <TouchableOpacity style={styles.commentButton} onPress={saveCommentAndEmoji}>
              <Ionicons name="checkmark" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </>
      ) : null}

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
  container: { flex: 1, backgroundColor: "#FFF8E1", alignItems: "center", paddingTop: 20 },
  headerText: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  calendarContainer: { width: "90%", backgroundColor: "#FFFBF0", borderRadius: 20, padding: 10 },
  dayContainer: { alignItems: "center" },
  dayText: { fontSize: 16, color: "#000" },
  emoji: { fontSize: 16, marginTop: 2 },
  emojiContainer: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  emojiText: { fontSize: 16, fontWeight: "bold", marginRight: 10 },
  emojiButton: { padding: 8, marginHorizontal: 5, backgroundColor: "#FFF5CC", borderRadius: 10 },
  selectedEmoji: { backgroundColor: "#FFD700", borderWidth: 1, borderColor: "#FFA500" },
  commentContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF5CC", borderRadius: 20, padding: 10, marginTop: 10, width: "90%" },
  commentInput: { flex: 1, fontSize: 14, color: "#000" },
  commentButton: { marginLeft: 10 },
  memoContainer: { width: "90%", backgroundColor: "#FFFBF0", borderRadius: 10, padding: 10, marginTop: 10 },
  commentItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 10, backgroundColor: "#FFF", borderRadius: 10 },
  commentActions: { flexDirection: "row", gap: 10 },
});
