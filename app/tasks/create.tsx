import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";

export default function TaskCreateScreen() {

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [loading, setLoading] = useState(false)

    // useEffect(()=>{

    // })

    const handleCreateTask = async () => {
        const token = await AsyncStorage.getItem("accessToken")
        setLoading(true);
        try {
            const task = await axios.post(
                "https://taskmanager-backend-214z.onrender.com/api/v1/tasks",
                {
                    title: title,
                    description: description
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            )
            
        if (task.data) {
            Alert.alert("Success", "Task updated successfully!")
        }

        } catch (error) {
            console.error("Error creating task:", error);
            Alert.alert("Error", "Failed to create task.");
        }
        finally{
            setLoading(false)
        }

    }

    return (
<View style={styles.container}>
      <Text style={styles.title}>Create Task</Text>

      {/* Title Input */}
      <TextInput
        label="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        mode="outlined"
      />

      {/* Description Input */}
      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        mode="outlined"
        multiline
        numberOfLines={4}
      />

      {/* Create Task Button */}
      <Button
        mode="contained"
        onPress={handleCreateTask}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        {loading ? "Creating..." : "Create Task"}
      </Button>
    </View>
    )
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
    },
    input: {
      marginBottom: 15,
    },
    button: {
      marginTop: 10,
    },
  });
  