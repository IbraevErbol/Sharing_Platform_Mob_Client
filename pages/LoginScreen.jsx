import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const trimmedEmail = email.trim();

      const response = await axios.post('http://192.168.0.139:2000/login', { email: trimmedEmail, password });
      const { token, user } = response.data;

      await AsyncStorage.setItem('token', token);

      navigation.navigate('Profile', {user});
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Login error:', error.response || error.message);
      Alert.alert('Ошибка', 'Не удалось войти в систему');
    }
  };

  return (
    <View>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Пароль"
        secureTextEntry
      />
      <Button title="Войти" onPress={handleLogin} />
    </View>
  );
};

