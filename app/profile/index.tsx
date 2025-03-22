import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const ProfileScreen = () => {
    const [userData, setUserData] = useState({
        // fname: "",
        // lname: "",
        // mobile: "",
        // email: "",
        role: "",
        username: '',
    });

    // Fetch user data from Async Storage
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const username = await AsyncStorage.getItem("username")
                const fname = await AsyncStorage.getItem("fname");
                const lname = await AsyncStorage.getItem("lname");
                const mobile = await AsyncStorage.getItem("mobile");
                const email = await AsyncStorage.getItem("email");
                const role = await AsyncStorage.getItem("role");

                // if (fname && lname && mobile && email && role && username) {
                //   setUserData({ fname, lname, mobile, email, role, username });
                // }
                if (username && role) {
                    setUserData({ role, username });
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);

    // Handle logout
    const handleLogout = async () => {
        try {
            // Clear all user-related data from Async Storage
            await AsyncStorage.multiRemove(["fname", "lname", "mobile", "email", "role", "accessToken", "username"]);
            // Navigate to the login screen
            router.replace("/");
            Alert.alert("Success", "Logout successful!");
        } catch (error) {
            console.error("Error logging out:", error);
            Alert.alert("Error", "Logging out.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Profile</Text>

            {/* Display User Information */}
            <View style={styles.userInfo}>
                <Text style={styles.label}>User Name:</Text>
                <Text style={styles.value}>{userData.username}</Text>

                {/* <Text style={styles.label}>First Name:</Text>
        <Text style={styles.value}>{userData.fname}</Text>

        <Text style={styles.label}>Last Name:</Text>
        <Text style={styles.value}>{userData.lname}</Text>

        <Text style={styles.label}>Mobile:</Text>
        <Text style={styles.value}>{userData.mobile}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{userData.email}</Text> */}

                <Text style={styles.label}>Role:</Text>
                <Text style={styles.value}>{userData.role}</Text>
            </View>

            {/* Logout Button */}
            <Button title="Logout" onPress={handleLogout} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    userInfo: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 10,
    },
    value: {
        fontSize: 16,
        marginBottom: 10,
        color: "#555",
    },
});

export default ProfileScreen;