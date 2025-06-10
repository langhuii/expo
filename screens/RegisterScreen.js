import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import styled from "styled-components/native";
import { sendVerificationCode, verifyEmailCode, registerUser } from "../api/registerAPI";

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const handleSendCode = () => sendVerificationCode(email);

  const handleVerifyCode = () =>
    verifyEmailCode(email, verificationCode, () => setIsVerified(true));

  const handleRegister = () => {
    if (!isVerified) {
      Alert.alert("인증 필요", "이메일 인증을 먼저 완료하세요.");
      return;
    }

    registerUser({ username, birthdate, email, password, phoneNumber }, () => {
      navigation.navigate("Login");
    });
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
        <Input placeholder="Enter your name" value={username} onChangeText={setUsername} />

        <Label>Date of birth (ex:2000-01-01)</Label>
        <Input placeholder="YYYY-MM-DD" value={birthdate} onChangeText={setBirthdate} />

        <Label>Email</Label>
        <Input placeholder="Enter your email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

        <TouchableOpacity onPress={handleSendCode} style={{ backgroundColor: '#f4c76d', padding: 10, borderRadius: 5, marginBottom: 10 }}>
          <Text style={{ textAlign: 'center', color: '#333' }}>인증 코드 보내기</Text>
        </TouchableOpacity>

        <Input placeholder="인증 코드 입력" value={verificationCode} onChangeText={setVerificationCode} keyboardType="numeric" />

        <TouchableOpacity onPress={handleVerifyCode} style={{ backgroundColor: '#8ecae6', padding: 10, borderRadius: 5, marginBottom: 10 }}>
          <Text style={{ textAlign: 'center', color: '#fff' }}>인증 확인</Text>
        </TouchableOpacity>

        <Label>Password</Label>
        <Input placeholder="Enter your password" value={password} onChangeText={setPassword} secureTextEntry />

        <Label>Phone Number</Label>
        <Input placeholder="Enter your phone number" value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" />

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
