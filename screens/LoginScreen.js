import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import styled from "styled-components/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert("입력 오류", "이메일과 비밀번호를 모두 입력해주세요.");
    return;
  }

  try {
    const response = await await axios.post("http://124.50.249.203:8080/api/auth/login", {
      email,
      password,
    });


    const { token } = response.data;

    // ✅ 로그인 정보 저장
    await AsyncStorage.setItem("token", token);

    // ✅ 메인 화면 이동
    navigation.replace("Main");
  } catch (error) {
    console.error("❌ 로그인 실패:", error.response?.data || error.message);
    Alert.alert("로그인 실패", error.response?.data?.message || "이메일 또는 비밀번호가 올바르지 않습니다.");
  }
};

  return (
    <Container>
      <Logo source={{ uri: "https://your-image-url.com/logo.png" }} />
      <InputContainer>
        <Label>Email</Label>
        <Input 
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Label>Password</Label>
        <Input 
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button onPress={handleLogin}>
          <ButtonText>Sign In</ButtonText>
        </Button>
        <ForgotPassword onPress={() => navigation.navigate("ForgotPassword")}>
          <ForgotPasswordText>Forgot password?</ForgotPasswordText>
        </ForgotPassword>
        <RegisterButton onPress={() => navigation.navigate("Register")}>
          <RegisterButtonText>Register</RegisterButtonText>
        </RegisterButton>
      </InputContainer>
    </Container>
  );
};

// Styled Components
const Container = styled.View`
  flex: 1;
  background-color: #f9f3e7;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Logo = styled.Image`
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
`;

const InputContainer = styled.View`
  width: 100%;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  shadow-opacity: 0.1;
  shadow-radius: 10px;
  elevation: 3;
`;

const Label = styled.Text`
  font-size: 16px;
  margin-bottom: 5px;
  color: #333;
`;

const Input = styled.TextInput`
  width: 100%;
  height: 40px;
  border-width: 1px;
  border-color: #ccc;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 15px;
`;

const Button = styled.TouchableOpacity`
  background-color: #000;
  padding: 12px;
  border-radius: 5px;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
`;

const ForgotPassword = styled.TouchableOpacity`
  margin-top: 10px;
  align-items: center;
`;

const ForgotPasswordText = styled.Text`
  color: #555;
  font-size: 14px;
`;

const RegisterButton = styled.TouchableOpacity`
  background-color: #f4c76d;
  padding: 12px;
  border-radius: 5px;
  align-items: center;
  margin-top: 10px;
`;

const RegisterButtonText = styled.Text`
  color: #333;
  font-size: 16px;
`;

export default LoginScreen;
