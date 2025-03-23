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
import { GET_TASK_BY_ID_API } from "@/api/getTaskById";
import { UPDATE_TASK_API } from "@/api/updateTask";
import { DELETE_TASK_API } from "@/api/deleteTask";
import { validateDescription, validateTitle } from "@/utils/validation";
import { handleApiError } from "@/utils/errorHandler";

const TaskDetailScreen = () => {
  const theme = useTheme();
  const { id }: {id: string} = useLocalSearchParams(); // Get the task ID from the URL
  const [task, setTask] = useState({ _id: "", title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [titleError, setTitleError] = useState("")
  const [descriptionError, setDescriptionError] = useState("")


  const handleTitleChange = (value: string) => {
    setUpdatedTitle(value);
    setTitleError(validateTitle(value))
  };

  const handleDescriptionChange = (value: string) => {
    setUpdatedDescription(value)
    setDescriptionError(validateDescription(value))
  }

  const fetchTask = async () => {
    setLoading(true);
    try {
      const response = await GET_TASK_BY_ID_API(id)
      setTask(response.data.data);
      setUpdatedTitle(response.data.data.title);
      setUpdatedDescription(response.data.data.description);
    } catch (error) {
      handleApiError(error)
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
      setLoading(true);

      const update = await UPDATE_TASK_API(id, updatedTitle, updatedDescription)
      if (update.data.success) {
        setIsEditing(false);
        fetchTask();
        Alert.alert("Success", "Task updated successfully!");
      }
    } catch (error) {
      handleApiError(error)
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
    );
  };

  // Handle task deletion
  const handleDelete = async () => {

    setLoading(true);
    try {
      await DELETE_TASK_API(id)
      Alert.alert("Success", "Task deleted successfully!");
      router.replace("/tasks");
    } catch (error) {
      handleApiError(error)
    } finally{
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
              onChangeText={handleTitleChange}
              style={styles.input}
              mode="outlined"
              error={!updatedTitle.trim()}
            />
                {titleError ? <Text style={styles.errorText}>{titleError}</Text> : null}
          
            <TextInput
              label="Description"
              value={updatedDescription}
              onChangeText={handleDescriptionChange}
              style={styles.input}
              multiline
              mode="outlined"
              numberOfLines={4}
            />

                  {descriptionError ? <Text style={styles.errorText}>{descriptionError}</Text> : null}

            <Card.Actions >
              <Button
                mode="contained"
                onPress={handleUpdate}
                style={styles.actionButton}
                icon="content-save"
                loading={loading}
                disabled={loading || !!titleError || !!descriptionError}
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
  taskContainer: {
    padding: 15
  },
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