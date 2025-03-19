import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import styled from "styled-components/native";
import axios from "axios";

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleRegister = async () => {
    if (!username || !birthdate || !email || !password || !phoneNumber) {
      Alert.alert("입력 오류", "모든 정보를 입력하세요.");
      return;
    }

    try {
      const response = await axios.post("https://your-backend.com/api/register", {
        username,
        birthdate,
        email,
        password,
        phone_number: phoneNumber,
      });

      if (response.data.success) {
        Alert.alert("회원가입 성공", "로그인 화면으로 이동합니다.");
        navigation.navigate("Login");
      } else {
        Alert.alert("회원가입 실패", response.data.message || "다시 시도해주세요.");
      }
    } catch (error) {
      console.error("회원가입 오류:", error);
      Alert.alert("오류", "서버와 연결할 수 없습니다.");
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <BackButtonText>◀</BackButtonText>
        </BackButton>
        <HeaderText>회원가입</HeaderText>
      </Header>

      <FormContainer>
        <Label>Name</Label>
        <Input 
          placeholder="Enter your name"
          value={username}
          onChangeText={setUsername}
        />

        <Label>Date of birth ex)2000.01.01</Label>
        <Input 
          placeholder="YYYY.MM.DD"
          value={birthdate}
          onChangeText={setBirthdate}
          keyboardType="numeric"
        />

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

        <Label>Phone Number</Label>
        <Input 
          placeholder="Enter your phone number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />

        <Button onPress={handleRegister}>
          <ButtonText>Sign Up</ButtonText>
        </Button>
      </FormContainer>
    </Container>
  );
};

// Styled Components
const Container = styled.View`
  flex: 1;
  background-color: #f9f3e7;
  align-items: center;
  padding: 20px;
`;

const Header = styled.View`
  flex-direction: row;
  width: 100%;
  align-items: center;
  padding: 15px;
  background-color: #f4c76d;
  border-radius: 10px;
`;

const BackButton = styled.TouchableOpacity`
  padding: 5px;
  margin-right: 10px;
`;

const BackButtonText = styled.Text`
  font-size: 20px;
  color: #333;
`;

const HeaderText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;

const FormContainer = styled.View`
  width: 100%;
  background-color: #fff;
  padding: 20px;
  margin-top: 20px;
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

export default RegisterScreen;
