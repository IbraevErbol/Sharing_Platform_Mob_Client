import 'react-native-reanimated';
import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { HomeScreen, ProfileScreen, LoginScreen, RegisterScreen, CreatePostScreen, PostDetailScreen } from './pages';
import { EditProfileScreen } from './pages/EditProfileScreen';
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          drawerPosition: "left", 
          headerStyle: { backgroundColor: "#6200ea" },
          headerTintColor: "#fff",
        }}
      >
        <Drawer.Screen 
          name="MainDrawer" 
          component={HomeStackNavigator} 
          options={{title: 'Главная'}}
        />
        <Drawer.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{title: 'Профиль'}}
        />
        <Drawer.Screen 
          name="CreatePost" 
          component={CreatePostNavigator} 
          options={{title: 'Создать пост'}}
        />
        <Drawer.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{title: 'Войти'}}
        />
        <Drawer.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{title: 'Регистрация'}}
        />
      </Drawer.Navigator>
    </NavigationContainer>

  );
}
function HomeStackNavigator(){
  return (
    <Stack.Navigator initialRouteName='Main'>
      <Stack.Screen 
        name="Main" 
        component={HomeScreen} 
        options={{
          title: 'Главная',
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="PostDetail" 
        component={PostDetailScreen} 
        options={{title: 'Публикация'}}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Редактировать профиль' }}
      />
    </Stack.Navigator>
  )
}

function CreatePostNavigator() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(null); 
  const navigation = useNavigation();

  React.useEffect(() => {
    const checkAuth = async() => {
      const token = await AsyncStorage.getItem('token');
      setIsLoggedIn(!!token);
    };
    checkAuth();
  },[]);

  React.useEffect(() => {
    if (isLoggedIn === false) {
      Alert.alert(
        'Предупреждение',
        'Вы должны быть авторизованы, чтобы создать пост',
        [
          { text: 'Войти', onPress: () => navigation.navigate('Login') },
          { text: 'Отмена', style: 'cancel' },
        ]
      );
    }
  }, [isLoggedIn]);
  if(isLoggedIn === null){
    return null;
  }

  return isLoggedIn ? <CreatePostScreen /> : null;
}