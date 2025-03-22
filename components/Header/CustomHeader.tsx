import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Appbar, Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CustomHeader = ({ title }: {title: string}) => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUsername = async () => {
      const storedUsername = await AsyncStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);
      }
    };
    fetchUsername();
  }, []);

  return (
    <Appbar.Header>
      <Appbar.Content title={title} />
      <View style={styles.usernameContainer}>
        <Text style={styles.usernameText}>{username}</Text>
      </View>
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  usernameContainer: {
    marginRight: 10,
  },
  usernameText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CustomHeader;