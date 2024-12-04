import axios from "axios";
import { useEffect, useState } from "react";
import { View, Alert, Text, StyleSheet, Image } from "react-native";

const styles = StyleSheet.create({
    container:{
        flex: 1,
        padding: 20,
    },
    postTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    postContent: {
        fontSize: 18,
        marginBottom: 20,
    },
    postImage: {
        width: '100%',
        height: 300,
        borderRadius: 10,
        marginBottom: 20,
    }
})

export const PostDetailScreen = ({route}) => {
    const { postId} = route.params;
    const [post, setPost] = useState(null);

    useEffect(()=> {
        const fetchPost = async() => {
            try {
                const response = await axios.get(`http://192.168.0.139:2000/posts/${postId}`);
                setPost(response.data)
                
            } catch (error) {
                console.error("Ошибка при загрузке поста:", error);
                Alert.alert('Ошибка', 'Не удалось загрузить пост');
            }
        }
        fetchPost();
    }, [postId]);
    if(!post){
        return <Text>Загрузка...</Text>
    }
    const formattedDate = new Date(post.createdAt).toLocaleDateString();
    // console.log(post.author);
    return (
        <View style={styles.container}>
            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postContent}>{post.content}</Text>
            {post.imageUrl ? (
                <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
            ) : null}
            <Text>Создано: {post.author ? post.author.username : 'Неизвестно'}</Text>
            <Text>Дата: {formattedDate}</Text>
        </View>
    )
}