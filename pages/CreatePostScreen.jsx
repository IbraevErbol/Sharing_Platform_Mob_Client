import React, { useState, useEffect } from 'react'
import { View, TextInput, Button, Alert, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export const CreatePostScreen = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        const requestPermission = async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Ошибка', 'Необходимо разрешение для выбора изображений');
            }
        };

        requestPermission();
    }, []);

    const handleImagePick = async() => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if(!result.canceled){
            setImage(result.assets[0].uri)
        }
    }

    const handleCreatePost = async() => {
        const token = await AsyncStorage.getItem('token');
        if(!token) {
            Alert.alert('Ошибка', 'Вы должны быть авторизованы для создания поста.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (image) {
            formData.append('image', {
                uri: image,
                type: 'image/jpeg',
                name: 'image.jpg',
            });
        }

        try {
            const response = await axios.post('https://sharing-platform-mob-server.onrender.com/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            Alert.alert('Успех', 'Пост создан успешно!');
            navigation.navigate('MainDrawer');
            // console.log('Пост создан:', response.data);
        } catch (error) {
            console.error('Ошибка при создании поста:', error);
            Alert.alert('Ошибка', 'Не удалось создать пост. Попробуйте снова.');
        }
    }
  return (
    <View style={{padding: 20}}>
        <TextInput 
            value={title}   
            onChangeText={setTitle}
            placeholder='Заголовок'
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom:20, paddingLeft: 10}} 
        />
        <TextInput 
            value={content}   
            onChangeText={setContent}
            placeholder='Контент'
            style={{ height: 100, borderColor: 'gray', borderWidth: 1, marginBottom:20, paddingLeft: 10, textAlignVertical: 'top' }}    
            multiline 
        />
        <Button title='Выбрать изображение' onPress={handleImagePick} />
        {image && <Text style={{marginTop: 10}}>Изображение выбрано!</Text>}
        <Button title='Создать пост' onPress={handleCreatePost}></Button>
    </View>
  )
}
