import { CREATE_TASK_API } from "@/api/createTask";
import { handleApiError } from "@/utils/errorHandler";
import { validateDescription, validateTitle } from "@/utils/validation";
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

  const theme = useTheme();

  const handleTitleChange = (value: string) => {
    setTitle(value);
   setTitleError(validateTitle(value))
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value)
     setDescriptionError(validateDescription(value))
  }

  const handleCreateTask = async () => {
    console.log(title, 'title', description, 'description')


    setLoading(true);

    try {
      const task = await CREATE_TASK_API(title, description)

      if (task.data) {
        Alert.alert("Success", "Task created successfully!");
        router.replace('/tasks')
      }
    } catch (error) {
      handleApiError(error)
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