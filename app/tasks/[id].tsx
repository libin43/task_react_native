import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TaskDetailScreen = () => {
  const { id } = useLocalSearchParams(); // Get the task ID from the URL
  const [task, setTask] = useState({ id: "", title: "", description: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");

  const fetchTask = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Alert.alert("Error", "No access token found. Please log in.");
      //   router.replace("/(auth)/login");
        return;
      }

      const response = await axios.get(
        `https://taskmanager-backend-214z.onrender.com/api/v1/tasks/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTask(response.data.data);
      setUpdatedTitle(response.data.data.title);
      setUpdatedDescription(response.data.data.description);
    } catch (error) {
      console.error("Error fetching task:", error);
      Alert.alert("Error", "Failed to fetch task details.");
    }
  };
  // Fetch task details
  useEffect(() => {

    fetchTask();
  }, [id]);

  // Handle task update
  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Alert.alert("Error", "No access token found. Please log in.");
        return;
      }

      const update = await axios.put(
        `https://taskmanager-backend-214z.onrender.com/api/v1/tasks/${id}`,
        {
          title: updatedTitle,
          description: updatedDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if(update.data.success){
        fetchTask()
      }

      Alert.alert("Success", "Task updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating task:", error);
      Alert.alert("Error", "Failed to update task.");
    }
  };

  // Handle task deletion
  const handleDelete = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Alert.alert("Error", "No access token found. Please log in.");
        return;
      }

      await axios.delete(
        `https://taskmanager-backend-214z.onrender.com/api/v1/tasks/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Success", "Task deleted successfully!");
      router.replace("/home");
    } catch (error) {
      console.error("Error deleting task:", error);
      Alert.alert("Error", "Failed to delete task.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task Details</Text>

      {isEditing ? (
        <>
          <TextInput
            label="Title"
            value={updatedTitle}
            onChangeText={setUpdatedTitle}
            style={styles.input}
          />
          <TextInput
            label="Description"
            value={updatedDescription}
            onChangeText={setUpdatedDescription}
            style={styles.input}
            multiline
          />
          <Button mode="contained" onPress={handleUpdate} style={styles.button}>
            Save Changes
          </Button>
        </>
      ) : (
        <>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <Text style={styles.taskDescription}>{task.description}</Text>
          <Button
            mode="contained"
            onPress={() => setIsEditing(true)}
            style={styles.button}
          >
            Edit Task
          </Button>
        </>
      )}

      <Button
        mode="outlined"
        onPress={handleDelete}
        style={styles.deleteButton}
      >
        Delete Task
      </Button>
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
  taskTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  taskDescription: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
  deleteButton: {
    marginTop: 20,
    borderColor: "red",
  },
});

export default TaskDetailScreen;