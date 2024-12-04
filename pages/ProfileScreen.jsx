import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { RefreshControl } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    alignItems: 'center',
  },
  postItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  postDate: {
    fontSize: 12,
    color: "gray",
  },
  deleteButton: {
    color: "red",
    fontSize: 14,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc', // Цвет фона, если нет изображения
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 5,
    elevation: 4, // Для тени на Android
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    marginVertical: 5,
  },
});

export const ProfileScreen = ({ route }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const navigation = useNavigation();
  //-----------------Получение данных пользователя----------------------
  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const response = await axios.get("https://sharing-platform-mob-server.onrender.com/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserInfo(response.data);
      }
    } catch (error) {
      console.error("Ошибка получения данных пользователя:", error);
      Alert.alert("Ошибка", "Не удалось загрузить данные пользователя");
    } finally {
      setLoading(false);
    }
  };
  //---------------Получение постов пользователя------------
  const fetchUserPosts = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const response = await axios.get(
          "https://sharing-platform-mob-server.onrender.com/user/posts",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPosts(response.data);
      }
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось загрузить посты пользователя");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (route.params?.user) {
      setUserInfo(route.params.user);
      setLoading(false);
      fetchUserPosts();
    } else {
      fetchUserData();
    }
  }, [route.params])


  useFocusEffect(
    useCallback(() => {
      fetchUserPosts();
    }, [])
  );
  //---------------Удаление Постов----------------
  const handleDeletePost = async (postId) => {
    try {
      const token = await AsyncStorage.getItem("token");

      await axios.delete(`https://sharing-platform-mob-server.onrender.com/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Ошибка удаления поста:", error.response?.data || error.message);
      Alert.alert("Ошибка", "Не удалось удалить пост");
    }
  };
  //-------------Обновление постов пользователя---------
  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchUserPosts();
    setIsRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <Text>Загрузка...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {/* Аватар и кнопка редактирования */}
      <View style={styles.avatarContainer}>
        {userInfo?.profileImageUrl ? (
          <Image source={{ uri: userInfo.profileImageUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatar}>
            <Text style={{ fontSize: 32, color: '#fff' }}>
              {userInfo?.username?.charAt(0).toUpperCase() || "?"}
            </Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.editIcon}
          onPress={() => navigation.navigate('MainDrawer', { screen: 'EditProfile', params: { userInfo } })}
        >
          <Ionicons name="add-circle-outline" size={24} color="blue" />
        </TouchableOpacity>
      </View>

      {/* Имя пользователя */}
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{userInfo?.username || "Не указано"}</Text>

      {/* Информация о пользователе в две колонки */}
      <View style={styles.infoContainer}>
        <View style={styles.column}>
          <Text style={styles.infoText}>Email: {userInfo?.email || "Не указано"}</Text>
          <Text style={styles.infoText}>Телефон: {userInfo?.phoneNumber || "Не указано"}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.infoText}>Пол: {userInfo?.gender || "Не указано"}</Text>
          <Text style={styles.infoText}>Возраст: {userInfo?.age || "Не указан"}</Text>
        </View>
      </View>

      {/* Информация о созданных пользователем постов */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginVertical: 10 }}>
        Ваши посты:
      </Text>
      {posts.length > 0 ? (<FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <View style={styles.postItem}>
            <View>
              <Text style={styles.postTitle}>{`${index + 1}. ${item.title}`}</Text>
              <Text style={styles.postDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDeletePost(item._id)}>
              <Text style={styles.deleteButton}>Удалить</Text>
            </TouchableOpacity>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      />) : (<Text>У вас нет постов</Text>)}

      <StatusBar style="auto" />
    </View>
  );
};
