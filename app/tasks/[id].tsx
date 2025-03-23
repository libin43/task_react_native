import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import {
  ActivityIndicator,
  Button,
  TextInput,
  Card,
  Text,
  Divider,
  useTheme
} from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TaskDetailScreen = () => {
  const theme = useTheme();
  const { id } = useLocalSearchParams(); // Get the task ID from the URL
  const [task, setTask] = useState({ _id: "", title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");

  const fetchTask = async () => {
    const token = await AsyncStorage.getItem("accessToken");
    if (!token) {
      Alert.alert("Authentication Error", "No access token found. Please log in.");
      return;
    }

    setLoading(true);
    
    try {


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
    } finally {
      setLoading(false);
    }
  };

  // Fetch task details
  useEffect(() => {
    fetchTask();
  }, [id]);

  // Handle task update
  const handleUpdate = async () => {
    try {
      if (!updatedTitle.trim()) {
        Alert.alert("Validation Error", "Task title cannot be empty");
        return;
      }

      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Alert.alert("Authentication Error", "No access token found. Please log in.");
        return;
      }

      setLoading(true);

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

      if (update.data.success) {
        fetchTask();
        Alert.alert("Success", "Task updated successfully!");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating task:", error);
      Alert.alert("Error", "Failed to update task.");
    } finally {
      setLoading(false);
    }
  };

  // Handle task deletion with confirmation
  const confirmDelete = () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this task? This action cannot be undone.",
      [
        { text: "Cancel" },
        { text: "Delete", onPress: handleDelete, style: "destructive" }
      ],
      // { cancelable: true }
    );
  };

  // Handle task deletion
  const handleDelete = async () => {
    const token = await AsyncStorage.getItem("accessToken");
    if (!token) {
      Alert.alert("Authentication Error", "No access token found. Please log in.");
      return;
    }

    setLoading(true);
    try {
      await axios.delete(
        `https://taskmanager-backend-214z.onrender.com/api/v1/tasks/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Success", "Task deleted successfully!");
      router.replace("/tasks");
    } catch (error) {
      console.error("Error deleting task:", error);
      Alert.alert("Error", "Failed to delete task.");
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUpdatedTitle(task.title);
    setUpdatedDescription(task.description);
  };

  return (
    <View style={styles.taskContainer}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large"  />
          <Text style={styles.loadingText}>Loading task details...</Text>
        </View>
      ) : isEditing ? (
        <Card >
          <Card.Content>
            <TextInput
              label="Title"
              value={updatedTitle}
              onChangeText={setUpdatedTitle}
              style={styles.input}
              mode="outlined"
              error={!updatedTitle.trim()}
            />
            {!updatedTitle.trim() && (
              <Text style={styles.errorText}>Title is required</Text>
            )}
            <TextInput
              label="Description"
              value={updatedDescription}
              onChangeText={setUpdatedDescription}
              style={styles.input}
              multiline
              mode="outlined"
              numberOfLines={4}
            />

            <Card.Actions >
              <Button
                mode="contained"
                onPress={handleUpdate}
                style={styles.actionButton}
                icon="content-save"
                loading={loading}
                disabled={loading || !updatedTitle.trim()}
              >
                Save
              </Button>
              <Button
                mode="outlined"
                onPress={handleCancel}
                style={styles.cancelButton}
                icon="close"
                disabled={loading}
              >
                Cancel
              </Button>
            </Card.Actions>
          </Card.Content>
        </Card>
      ) : (
        <Card>
          <Card.Content>
            {/* <Text style={styles.dateText}>Created: {task._id}</Text> */}
            <Text style={styles.taskTitle}>{task.title}</Text>
            <Divider style={styles.divider} />
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.taskDescription}>
              {task.description || "No description provided."}
            </Text>
          </Card.Content>
          <Card.Actions >
            <Button
              mode="contained"
              onPress={() => setIsEditing(true)}
              icon="pencil"
              style={styles.editButton}
            >
              Edit Task
            </Button>
            <Button
              mode="outlined"
              onPress={confirmDelete}
              icon="delete"
              textColor={theme.colors.error}
              style={styles.deleteButton}
            >
              Delete
            </Button>
          </Card.Actions>
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: "#f5f5f5",
  // },
  // scrollContainer: {
  //   padding: 16,
  // },
  taskContainer: {
    padding: 15
  },
  // card: {
  //   marginBottom: 25,
  //   borderRadius: 20,
  // },
  // dateText: {
  //   fontSize: 12,
  //   marginBottom: 8,
  //   color: "#666",
  // },
  taskTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
    height: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#555",
  },
  taskDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  errorText: {
    color: "red",
    marginTop: -12,
    marginBottom: 12,
    marginLeft: 8,
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    marginRight: 8,
  },
  cancelButton: {
    flex: 1,
    marginLeft: 8,
  },
  // cardActions: {
  //   justifyContent: "space-between",
  //   paddingHorizontal: 16,
  //   paddingBottom: 16,
  // },
  editButton: {
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    flex: 1,
    marginLeft: 8,
    borderColor: "red",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    borderRadius: 12,
    marginTop: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
});

export default TaskDetailScreen;