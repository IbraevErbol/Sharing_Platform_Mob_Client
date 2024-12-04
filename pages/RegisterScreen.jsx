import axios from "axios";
import { View, TextInput, Button, Alert } from "react-native";
import { useState } from "react";

export const RegisterScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async() => {
        try {
            const response = await axios.post('http://192.168.0.139:2000/register', {
                username, email, password,
            });

            Alert.alert('Успех', 'Регистрация прошла успешно, пожалуйста введите логин и пороль для входа ещё раз');
            navigation.navigate('Login');

            setUsername('');
            setPassword('');
            setEmail('');
        } catch (error) {
            console.error('Ошибка регистрации:', error.response?.data || error.message);
            Alert.alert('Ошибка', error.response?.data?.error || 'Не удалось зарегистрироваться');
        }
    }

  return (
    <View>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Имя пользователя"
      />
      <TextInput 
        value={email} 
        onChangeText={setEmail} 
        placeholder="Email" />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Пароль"
        secureTextEntry
      />
      <Button title="Зарегистрироваться" onPress={handleRegister} />
    </View>
  );
};
