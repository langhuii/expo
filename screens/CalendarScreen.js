import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState("");
  const [comment, setComment] = useState("");

  // 감정 이모지 데이터 (예시)
  const markedDates = {
    "2024-04-10": { marked: true, emoji: "😃" },
    "2024-04-15": { marked: true, emoji: "😊" },
    "2024-04-20": { marked: true, emoji: "😢" },
    "2024-04-28": { marked: true, emoji: "🤔" },
  };

  return (
    <View style={styles.container}>
      {/* 상단 월 제목 */}
      <Text style={styles.headerText}>APRIL</Text>

      {/* 캘린더 UI */}
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          monthFormat={"yyyy MM"}
          hideExtraDays={true}
          markedDates={Object.keys(markedDates).reduce((acc, date) => {
            acc[date] = {
              selected: selectedDate === date,
              selectedColor: "#FFEBB2",
              customStyles: { text: { color: "#000" } },
            };
            return acc;
          }, {})}
          renderDay={(day, item) => (
            <View style={styles.dayContainer}>
              <Text style={styles.dayText}>{day?.day}</Text>
              {markedDates[day?.dateString] && (
                <Text style={styles.emoji}>{markedDates[day.dateString].emoji}</Text>
              )}
            </View>
          )}
          theme={{
            backgroundColor: "#FFFBF0",
            calendarBackground: "#FFFBF0",
            textSectionTitleColor: "#000",
            selectedDayBackgroundColor: "#FFD700",
            selectedDayTextColor: "#000",
            todayTextColor: "#FF6347",
            arrowColor: "#FFD700",
            monthTextColor: "#000",
          }}
        />
      </View>

      {/* 감정 기록 입력 UI */}
      <View style={styles.commentContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="한 줄 코멘트 작성"
          value={comment}
          onChangeText={setComment}
        />
        <TouchableOpacity style={styles.commentButton}>
          <Ionicons name="pencil" size={20} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ✅ 스타일 설정
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E1",
    alignItems: "center",
    paddingTop: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  calendarContainer: {
    width: "90%",
    backgroundColor: "#FFFBF0",
    borderRadius: 20,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  dayContainer: {
    alignItems: "center",
  },
  dayText: {
    fontSize: 16,
    color: "#000",
  },
  emoji: {
    fontSize: 16,
    marginTop: 2,
  },
  commentContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5CC",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 20,
    width: "90%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
    color: "#000",
  },
  commentButton: {
    marginLeft: 10,
  },
});