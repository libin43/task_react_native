import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text, Provider as PaperProvider } from "react-native-paper";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function Index() {
  // State for mobile and password
  const [mobile, setMobile] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)


  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (token) {
        Alert.alert("Info", "You are already logged in.");
        // Navigate to the home screen or perform other actions
      }
    } catch (error) {
      console.error("Error checking login status:", error);
    }
  };

  // Function to handle login
  const handleLogin = async () => {
    if (!mobile || !password) {
      Alert.alert("Error", "Please enter both mobile and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://taskmanager-backend-214z.onrender.com/api/v1/auth/login",
        {
          mobile,
          password,
        }
      );

      // Handle successful login
      if (response.data) {

        Alert.alert("Success", "Login successful!");
        console.log(response.data.data.fname, 'MY Name')
        const accessToken = response.data.data.accessToken
        const userName = `${response.data.data.fname} ${response.data.data.lname}`
        const role = response.data.data.role
        await AsyncStorage.setItem("accessToken", accessToken)
        await AsyncStorage.setItem("username", userName)
        await AsyncStorage.setItem("role", role)
        console.log('Token has been set')

        // Redirect to Home Screen
        router.replace("/tasks");

      }
      console.log("Login Response:", response.data);
    } catch (error) {
      // Handle login error
      Alert.alert("Error", "Login failed. Please check your credentials.");
      console.error("Login Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>

        {/* Mobile Input */}
        <TextInput
          label="Mobile"
          placeholder="Enter asdfjai"
          value={mobile}
          onChangeText={setMobile}
          style={styles.input}
          keyboardType="phone-pad"
          mode="outlined"
        />

        {/* Password Input */}
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
          mode="outlined"
        />

        {/* Login Button */}
        <Button
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
});