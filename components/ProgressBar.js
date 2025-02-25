import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Rect } from "react-native-svg";

export const ProgressBar = ({ color, progress }) => {
  return (
    <View style={styles.container}>
      <Svg width="100%" height="10">
        <Rect x="0" y="0" width="100%" height="10" fill="#E0E0E0" rx="5" />
        <Rect x="0" y="0" width={`${progress * 100}%`} height="10" fill={color} rx="5" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 10,
  },
});
