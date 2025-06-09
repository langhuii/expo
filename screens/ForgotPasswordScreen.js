import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import styled from "styled-components/native";
import axios from "axios";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("입력 오류", "이메일을 입력하세요.");
      return;
    }

    try {
      const response = await axios.post(
        `http://192.168.0.83:8080/api/users/forgot-password`,
        null,
        {
          params: { email },
        }
      );

      Alert.alert("성공", "임시 비밀번호가 이메일로 전송되었습니다.");
      navigation.navigate("Login");
    } catch (error) {
      console.error("비밀번호 찾기 오류:", error.response?.data || error.message);
      if (error.response?.status === 400) {
        Alert.alert("실패", "해당 이메일로 등록된 사용자가 없습니다.");
      } else {
        Alert.alert("오류", "서버와 연결할 수 없습니다.");
      }
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <BackButtonText>◀</BackButtonText>
        </BackButton>
        <HeaderText>비밀번호 찾기</HeaderText>
      </Header>

      <FormContainer>
        <Label>이메일 입력</Label>
        <Input 
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Button onPress={handleResetPassword}>
          <ButtonText>비밀번호 재설정</ButtonText>
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

export default ForgotPasswordScreen;
