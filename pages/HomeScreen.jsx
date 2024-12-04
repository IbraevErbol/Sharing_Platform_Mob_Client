import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import {StyleSheet, View, Text, FlatList, Alert, TouchableOpacity, Image } from 'react-native'
import { RefreshControl } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 10,
  },
  postCard: {
      width: '100%',
      padding: 15,
      marginBottom: 15,
      borderRadius: 10,
      backgroundColor: '#f9f9f9',
      borderColor: '#ddd',
      borderWidth: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 4, // для Android
  },
  postTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
  },
  postContent: {
      fontSize: 16,
      marginBottom: 10,
  },
  postImage: {
      width: '100%',
      height: 200,
      borderRadius: 10,
  },
});

export const HomeScreen = ({navigation}) => {
  const [posts, setPosts] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchPosts = async() => {
    try {
      const response = await axios.get('https://sharing-platform-mob-server.onrender.com/posts');
      setPosts(response.data);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить посты')
    }
  }

  useFocusEffect(
    useCallback(()=>{
      fetchPosts();
    }, [])
  )

  const handlePostPress = (postId) => {
    navigation.navigate('PostDetail', {postId});
  }
  // -----------Рендеринг Постов--------------
  const renderPost = ({item}) => (
    <TouchableOpacity style={styles.postCard} onPress={() => handlePostPress(item._id)}>
      {item.imageUrl ? (
        <Image source={{uri: item.imageUrl }} style={styles.postImage}/>
        
      ): (<Text>No image available</Text>)}
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postContent}>{item.content.substring(0, 100)}...</Text>
    </TouchableOpacity> 
  )
  //------------Обновление Постов---------------
  const onRefresh = async() => {
    setIsRefreshing(true);
    fetchPosts()
    setIsRefreshing(false);
  }
  return (
    <View style={styles.container}>
      <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={(item) => item._id.toString()}
                refreshControl={
                  <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh}/>
                }
            />
    </View>
  )
}
