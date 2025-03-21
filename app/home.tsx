import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Alert } from "react-native";
import { Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import axios from "axios";

type Task = {
    _id: string;
    title: string;
};

const HomeScreen = () => {
    const [tasks, setTasks] = useState<Task[]>([]);

    // Fetch tasks (dummy data for now)
    useEffect(() => {
        const fetchTasks = async () => {
            // Replace this with an API call to fetch tasks
            //   const dummyTasks = [
            //     { id: "1", title: "Task 1" },
            //     { id: "2", title: "Task 2" },
            //     { id: "3", title: "Task 3" },
            //   ];
            const token = await AsyncStorage.getItem('accessToken')


            try {
                const tasks = await axios.get(
                    "https://taskmanager-backend-214z.onrender.com/api/v1/tasks",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                console.log(tasks.data, 'its tasks')
                if (tasks.data.data) {
                    setTasks(tasks.data.data)
                }
            } catch (error) {
                Alert.alert("Error", "Login failed. Please check your credentials.");
                console.error("Login Error:", error);
            } finally {
                // setLoading(false);
            }

            //   setTasks(dummyTasks);
        };

        fetchTasks();
    }, []);

    //   const handleLogout = async () => {
    //     try {
    //       await AsyncStorage.removeItem("accessToken");
    //       router.replace("/(auth)/login");
    //     } catch (error) {
    //       console.error("Error logging out:", error);
    //     }
    //   };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tasks</Text>

            {/* Display tasks */}
            {
                tasks.length > 0 ?
                    <FlatList
                        data={tasks}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <View style={styles.taskItem}>
                                <Text>{item.title}</Text>
                            </View>
                        )}
                    /> : <Text>You donot have task. Create tasks</Text>
            }

            {/* Logout Button */}
            {/* <Button
        mode="contained"
        onPress={handleLogout}
        style={styles.button}
      >
        Logout
      </Button> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    taskItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    button: {
        marginTop: 20,
    },
});

export default HomeScreen;