import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f8f8f8',  // Добавил светлый фон для всей страницы
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    inputWrapper: {
        flex: 1,
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#fff', // Белый фон для полей ввода
        borderRadius: 8, // Округленные углы для полей ввода
        borderWidth: 1,  // Граница поля
        borderColor: '#ddd', // Цвет границы
        padding: 10,
        fontSize: 16,
        marginTop: 5,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
        color: '#333',
    },
    extraInfoContainer: {
        marginTop: 20, // Отступ сверху для разделения блоков
        padding: 15,   // Добавляем отступы внутри блока
        backgroundColor: '#fff', // Белый фон
        borderRadius: 10, // Округленные углы блока
        shadowColor: '#000',  // Тень для блока
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,  // Для Android добавляем тень
        marginBottom: 20, // Отступ снизу
    },
});


export const EditProfileScreen = ({ route }) => {
    const { userInfo } = route.params;
    const [name, setName] = useState(userInfo?.username || '');
    const [phoneNumber, setPhoneNumber] = useState(userInfo?.phoneNumber || '');
    const [profileImageUrl, setProfileImageUrl] = useState(userInfo?.profileImageUrl || '');
    const [gender, setGender] = useState(userInfo?.gender || '');
    const [age, setAge] = useState(userInfo?.age || '');

    const navigation = useNavigation();

     // Функция для выбора изображения
     const pickImage = async () => {
        // Запрашиваем разрешения на доступ к камере/галерее
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert("Разрешение на доступ к медиа не предоставлено");
            return;
        }

        // Выбираем изображение
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            aspect: [1, 1],  // Пропорции изображения
            quality: 1,  // Высокое качество
        });

        if (!result.canceled) {
            setProfileImageUrl(result.assets[0].uri); // Обновляем URL картинки профиля
        }
    };


    const handleSave = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            await axios.put('http://192.168.0.139:2000/profile/update',
                { name, phoneNumber, profileImageUrl, gender, age },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            Alert.alert('Успех', 'Профиль обновлен');
            navigation.goBack(); // Возвращаемся к профилю
        } catch (error) {
            console.error(error);
            Alert.alert('Ошибка', 'Не удалось обновить профиль');
        }
    };

    return (
        <View style={styles.container}>
            {/* Секция "Пол и Имя" */}
            <View style={styles.row}>
                <View style={styles.inputWrapper}>
                    <Text>Имя:</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
                        placeholder="Введите ваше имя"
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <Text>Пол:</Text>
                    <Picker
                        selectedValue={gender}
                        // style={styles.input}
                        onValueChange={(itemValue) => setGender(itemValue)}
                    >
                        <Picker.Item label="Мужской" value="Male" />
                        <Picker.Item label="Женский" value="Female" />
                    </Picker>
                </View>

            </View>

            {/* Секция "Номер телефона, Возраст, Картинка профиля" */}
            <View style={styles.extraInfoContainer}>
                <View>
                    <Text style={styles.label}>Телефон:</Text>
                    <TextInput
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        style={styles.input}
                        placeholder="Введите номер телефона"
                        keyboardType="phone-pad"
                    />
                </View>

                <View>
                    <Text style={styles.label}>Возраст:</Text>
                    <TextInput
                        value={age}
                        onChangeText={setAge}
                        style={styles.input}
                        placeholder="Введите возраст"
                        keyboardType="numeric"
                    />
                </View>

                <View>
                    <Text style={styles.label}>URL картинки профиля:</Text>
                    <TextInput
                        value={profileImageUrl}
                        onChangeText={setProfileImageUrl}
                        style={styles.input}
                        placeholder="Введите URL картинки"
                    />
                </View>

                {/* Кнопка для выбора изображения */}
                <Button title="Выбрать изображение" onPress={pickImage} />

                {/* Превью изображения */}
                {profileImageUrl ? (
                    <Image source={{ uri: profileImageUrl }} style={styles.imagePreview} />
                ) : null}
            </View>

            <Button title="Сохранить" onPress={handleSave} />
        </View>
    );
};

