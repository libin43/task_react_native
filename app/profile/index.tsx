import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { 
  Avatar, 
  Card, 
  Text, 
  Button, 
  Title, 
  Divider, 
  List
} from "react-native-paper";
import { UserContext } from "@/context/userContext";

const ProfileScreen = () => {
  const [userData, setUserData] = useState({
    role: "",
    username: '',
  });

  const userContext = useContext(UserContext)

  // Fetch user data from Async Storage
  const fetchUserData = async () => {
    try {
      const username = await AsyncStorage.getItem("username");
      const role = await AsyncStorage.getItem("role");

      if (username && role) {
        setUserData({ role, username });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };


  useEffect(() => {
    fetchUserData();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      // Clear all user-related data from Async Storage
      await AsyncStorage.multiRemove([
        "role", 
        "accessToken", 
        "username"
      ]);
      
      // Navigate to the login screen
      router.replace("/");
      Alert.alert("Success", "Logout successful!");
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Error", "Logging out.");
    }
  };

  // Get initials for avatar
  const getInitials = () => {
    return userData.username ? userData.username.charAt(0).toUpperCase() : "U";
  };

  return (
    <View style={styles.container}>

      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileCardContent}>
          <Avatar.Text
            size={80} 
            label={getInitials()} 
            style={styles.avatar} 
          />
          <Title style={styles.username}>{userData.username}</Title>
          <Text style={styles.roleText}>{userData.role}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.detailsCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Account Details</Title>
          <Divider />
          
          <List.Section>
            <List.Item
              title="Username"
              description={userData.username}
              left={() => <List.Icon icon="account" />}
            />
            <Divider />
            <List.Item
              title="Role"
              description={userData.role}
              left={() => <List.Icon icon="shield-account" />}
            />
            
          </List.Section>
        </Card.Content>
      </Card>

      <Button 
        mode="contained" 
        icon="logout" 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        Logout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  profileCard: {
    marginHorizontal: 16,
    margin: 16
  },
  profileCardContent: {
    alignItems: "center",
    paddingVertical: 20,
  },
  avatar: {
    marginBottom: 16,
  },
  username: {
    fontSize: 22,
    marginBottom: 4,
  },
  roleText: {
    fontSize: 16,
    opacity: 0.7,
  },
  detailsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 8,
  },
});

export default ProfileScreen;