import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, Alert, Keyboard, ImageBackground, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { TextInput, Button, Text, Provider as PaperProvider, Surface, Avatar, Headline, Caption, useTheme } from "react-native-paper";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router } from "expo-router";
import { SIGNIN_API } from "@/api/signin";
import { CustomButton } from "@/components/Button/CustomButton";
import { UserContext, UserContextType } from "@/context/userContext";

export default function Index() {
  // State for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();


  const userContext = useContext(UserContext)
  console.log(userContext, 'us')

  // if(us){
  //   const {} = us
  // }

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      if (token) {
        router.replace("/tasks");
      }
  }

  // Function to handle login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await SIGNIN_API(email, password)

      // Handle successful login
      if (response.data) {
        Alert.alert("Success", "Login successful!");
        console.log(response.data.data.fname, 'MY Name');
        const accessToken = response.data.data.accessToken;
        const fName = response.data.data.fname;
        const lName = response.data.data.lname
        const role = response.data.data.role;
        await AsyncStorage.setItem("accessToken", accessToken);
        if(userContext){
          userContext.setUser(fName, lName, role)
        }
        // await AsyncStorage.setItem("username", userName);
        await AsyncStorage.setItem("role", role);
        console.log('Token has been set');

        // Redirect to Tasks Screen
        router.replace("/tasks");
      }
      console.log("Login Response:", response.data);
    } catch (error) {
      // Handle login error
      Alert.alert("Error", "Login failed. Please check your credentials.");
      // console.error("Login Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const goToSignup = () => {
    router.replace("/signup");
  };

  return (
    <PaperProvider>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ImageBackground
          source={{ uri: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" }}
          style={styles.backgroundImage}
        >
          <View style={styles.overlay} />
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
            onStartShouldSetResponder={() => {
              Keyboard.dismiss();
              return false;
            }}
          >
            <Surface style={styles.formContainer}>
              {/* Header with Logo */}
              <View style={styles.header}>
                <Avatar.Icon 
                  size={80} 
                  icon="login" 
                  color="#fff" 
                  style={{ backgroundColor: theme.colors.primary }} 
                />
                <Headline style={styles.title}>Welcome Back</Headline>
                <Caption style={styles.subtitle}>Log in to your Cave Digital account</Caption>
              </View>
              
              <View style={styles.formFields}>
                {/* Email Input */}
                <TextInput
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                  keyboardType="email-address"
                  mode="outlined"
                  left={<TextInput.Icon icon="email" />}
                  theme={{ roundness: 10 }}
                  autoCapitalize="none"
                />

                {/* Password Input */}
                <TextInput
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  style={styles.input}
                  secureTextEntry={!showPassword}
                  mode="outlined"
                  left={<TextInput.Icon icon="lock" />}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? "eye-off" : "eye"}
                      onPress={() => setShowPassword(!showPassword)}
                      forceTextInputFocus={false}
                    />
                  }
                  theme={{ roundness: 10 }}
                />

                {/* Login Button */}
                <CustomButton
                  mode="contained"
                  onPress={handleLogin}
                  loading={loading}
                  disabled={loading}
                  style={styles.button}
                  labelStyle={styles.buttonLabel}
                  theme={{ roundness: 25 }}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </CustomButton>

                {/* Forgot Password */}
                {/* <Button
                  mode="text"
                  onPress={() => Alert.alert("Info", "Password reset feature coming soon!")}
                  style={styles.forgotPassword}
                >
                  Forgot Password?
                </Button> */}

                {/* Signup Link */}
                <View style={styles.signupLink}>
                  <Text style={styles.signupText}>Don't have an account? </Text>
                  <CustomButton
                    mode="text"
                    onPress={goToSignup}
                    style={styles.textButton}
                    labelStyle={styles.textButtonLabel}
                  >
                    Create Account
                  </CustomButton>
                </View>
              </View>
            </Surface>
          </ScrollView>
        </ImageBackground>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  formContainer: {
    borderRadius: 15,
    padding: 20,
    elevation: 4,
    // backgroundColor: "rgba(255, 255, 255, 0.95)",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  formFields: {
    marginTop: 10,
  },
  input: {
    marginBottom: 15,
    backgroundColor: "transparent",
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
    elevation: 3,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "bold",
    paddingVertical: 4,
  },
  forgotPassword: {
    alignSelf: "center",
    marginTop: 15,
  },
  signupLink: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  signupText: {
    color: "#666",
  },
  textButton: {
    margin: 0,
    padding: 0,
  },
  textButtonLabel: {
    margin: 0,
  },
});