import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Alert } from "react-native";

export const handleApiError = async (error: any) => {
    console.log(error.response?.data, "error response");

    const statusCode = error.response?.status

    console.log(statusCode,'statuscode')

    const errorCode = error.response?.data?.errorCode;
    const errorMessage = error.response?.data?.message || "An error occurred.";

    let userFriendlyMessage = "An error occurred. Please try again.";

    switch (errorCode) {
        case "DUPLICATE_ENTRY":
            userFriendlyMessage =
                "The email address is already registered. Please use a different email.";
            break;

        default:
            userFriendlyMessage = errorMessage;
    }

    if (statusCode === 401) {
        await AsyncStorage.removeItem("accessToken");
        router.replace("/");
    }

    console.log(userFriendlyMessage, "friendly message");
    Alert.alert("Error", userFriendlyMessage);
};
