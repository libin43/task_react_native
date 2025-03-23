import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError } from "axios";
import { router } from "expo-router";
import { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text, useTheme } from "react-native-paper";

export default function TaskCreateScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("")

  const theme = useTheme(); // Access the theme from React Native Paper

  const validateTitle = (value: string) => {
    const trimmedValue = value.trim();

    if (trimmedValue.length === 0) {
      setTitleError("Title is required");
      return;
    }

    if (trimmedValue.length > 30) {
      setTitleError("Title should be at most 30 characters");
      return;
    }

    setTitleError(""); // Clear error if valid
    return;
  };

  const validateDescription = (value: string) => {
    const trimmedValue = value.trim();

    if (trimmedValue.length > 100) {
      setDescriptionError("Description should be at most 100 characters");
      return;
    }

    setDescriptionError(""); // Clear error if valid
    return;
  }

  const handleTitleChange = (value: string) => {
    setTitle(value);
    validateTitle(value);
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value)
    validateDescription(value)
  }

  const handleCreateTask = async () => {
    console.log(title, 'title', description, 'description')


    const token = await AsyncStorage.getItem("accessToken");
    setLoading(true);

    try {
      const task = await axios.post(
        "https://taskmanager-backend-214z.onrender.com/api/v1/tasks",
        {
          title: title,
          ...(description.length > 0 && { description: description }),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (task.data) {
        Alert.alert("Success", "Task created successfully!");
        router.replace('/tasks')
      }
    } catch (error) {
      console.error("Error creating task:", error);
      if (axios.isAxiosError(error)) {
        console.log(error, 'its an error')
        console.log(error.response, 'error response');
        const errorCode = error.response?.data.errorCode; // Extract the error code
        const errorMessage = error.response?.data.message || "Signup failed."; // Extract the error message

        // let userFriendlyMessage = "An error occurred. Please try again."; // Default message

        // console.log(userFriendlyMessage, "friendly message");
        await AsyncStorage.multiRemove(["fname", "lname", "mobile", "email", "role", "accessToken", "username"]);
        router.replace('/')
        Alert.alert("Error", errorMessage);
      } else {

        Alert.alert("Error", "Failed to create task.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.primary }]}>New Task</Text>

      {/* Title Input */}
      <TextInput
        label="Title"
        value={title}
        onChangeText={handleTitleChange}
        style={styles.input}
        mode="outlined"
        error={!!titleError}
        theme={{ colors: { primary: theme.colors.primary } }}
      />
      {titleError ? <Text style={styles.errorText}>{titleError}</Text> : null}

      {/* Description Input */}
      <TextInput
        label="Description"
        value={description}
        onChangeText={handleDescriptionChange}
        style={styles.input}
        mode="outlined"
        error={!!descriptionError}
        multiline
        numberOfLines={4}
        theme={{ colors: { primary: theme.colors.primary } }}
      />
      {descriptionError ? <Text style={styles.errorText}>{descriptionError}</Text> : null}

      {/* Create Task Button */}
      <Button
        mode="contained"
        onPress={handleCreateTask}
        loading={loading}
        disabled={loading || !!titleError || !!descriptionError || !title}
        style={styles.button}
        labelStyle={styles.buttonLabel}
        theme={{ colors: { primary: theme.colors.primary } }}
      >
        {loading ? "Creating..." : "Create Task"}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 15,
    backgroundColor: "transparent",
  },
  button: {
    marginTop: 20,
    borderRadius: 8,
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
});