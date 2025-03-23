import { SIGNUP_API } from "@/api/signup";
import { CustomButton } from "@/components/Button/CustomButton";
import axios from "axios";
import { router } from "expo-router";
import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, Text, Keyboard, ImageBackground } from "react-native";
import { TextInput, Button, Provider, useTheme, Surface, Avatar, Headline, Caption } from "react-native-paper";

export default function SignupScreen() {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const [fnameError, setFnameError] = useState("");
  const [lnameError, setLnameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Validate fields
  const validateFields = () => {
    let isValid = true;

    if (!fname.trim()) {
      setFnameError("First name is required.");
      isValid = false;
    }

    if (!lname.trim()) {
      setLnameError("Last name is required.");
      isValid = false;
    }

    if (!email.trim()) {
      setEmailError("Email is required.");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError("Password is required.");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      isValid = false;
    }

    return isValid;
  };

  // Handle signup
  const handleSignup = async () => {
    if (!validateFields()) {
      return; // Stop if validation fails
    }

    setLoading(true);

    try {
      const response = await SIGNUP_API(fname, lname, email, password)

      console.log(response, "User registration response");

      router.replace("/"); // Navigate to the home screen
      Alert.alert("Success", "Signup successful!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error,'its an error')
        console.log(error.response, 'error response');
        const errorCode = error.response?.data.errorCode; // Extract the error code
        const errorMessage = error.response?.data.message || "Signup failed."; // Extract the error message

        let userFriendlyMessage = "An error occurred. Please try again."; // Default message
        switch (errorCode) {
          case "DUPLICATE_ENTRY":
            userFriendlyMessage = "The email address is already registered. Please use a different email.";
            break;
          default:
            userFriendlyMessage = errorMessage; // Fallback to the server message
        }
        console.log(userFriendlyMessage, "friendly message");
        Alert.alert("Error", userFriendlyMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    router.replace("/");
  };

  return (
    <Provider>
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
          >
            <Surface style={styles.formContainer}>
              {/* Header with Logo */}
              <View style={styles.header}>
                <Avatar.Icon 
                  size={80} 
                  icon="account-group" 
                  color="#fff" 
                  style={{ backgroundColor: theme.colors.primary }} 
                />
                <Headline style={styles.title}>Join Cave Digital</Headline>
                <Caption style={styles.subtitle}>Create an account to get started</Caption>
              </View>

   
              <View style={styles.formFields}>
                    <TextInput
                      label="First Name"
                      value={fname}
                      onChangeText={(text) => {
                        setFname(text);
                        setFnameError("");
                      }}
                      mode="outlined"
                      style={styles.input}
                      error={!!fnameError}
                      left={<TextInput.Icon icon="account" />}
                      theme={{ roundness: 10 }}
                    />
                    {fnameError && <Text style={styles.errorText}>{fnameError}</Text>}
           

                  {/* Last Name Input */}
                    <TextInput
                      label="Last Name"
                      value={lname}
                      onChangeText={(text) => {
                        setLname(text);
                        setLnameError("");
                      }}
                      mode="outlined"
                      style={styles.input}
                      error={!!lnameError}
                      left={<TextInput.Icon icon="account" />}
                      theme={{ roundness: 10 }}
                    />
                    {lnameError && <Text style={styles.errorText}>{lnameError}</Text>}


                {/* Email Input */}
                <TextInput
                  label="Email"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setEmailError("");
                  }}
                  mode="outlined"
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={!!emailError}
                  left={<TextInput.Icon icon="email" />}
                  theme={{ roundness: 10 }}
                />
                {emailError && <Text style={styles.errorText}>{emailError}</Text>}

                {/* Password Input */}
                <TextInput
                  label="Password"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setPasswordError("");
                  }}
                  mode="outlined"
                  style={styles.input}
                  secureTextEntry={!showPassword}
                  left={<TextInput.Icon icon="lock" />}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? "eye-off" : "eye"}
                      onPress={() => setShowPassword(!showPassword)}
                      forceTextInputFocus={false}
                    />
                  }
                  error={!!passwordError}
                  theme={{ roundness: 10 }}
                />
                {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

                {/* Signup Button */}
                <CustomButton
                  mode="contained"
                  onPress={handleSignup}
                  style={styles.button}
                  labelStyle={styles.buttonLabel}
                  loading={loading}
                  disabled={loading}
                  theme={{ roundness: 25 }}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </CustomButton>

                {/* Login Link */}
                <View style={styles.loginLink}>
                  <Text style={styles.loginText}>Already have an account? </Text>
                  <CustomButton
                    mode="text"
                    onPress={goToLogin}
                    style={styles.textButton}
                    labelStyle={styles.textButtonLabel}
                  >
                    Sign In
                  </CustomButton>
                </View>
              </View>
            </Surface>
          </ScrollView>
        </ImageBackground>
      </KeyboardAvoidingView>
    </Provider>
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
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
//   halfInput: {
//     width: "48%",
//   },
  input: {
    marginBottom: 5,
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
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  loginLink: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  loginText: {
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