import axios from "axios";
import { API_BASE_URL } from "./constant";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const CREATE_TASK_API = async (title: string, description: string) => {
    try {
        const token = await AsyncStorage.getItem('accessToken');
        const response = await axios.post(
            `${API_BASE_URL}/tasks`,
            {
                title,
                description,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response
    } catch (error) {
        if(axios.isAxiosError(error)){
            if(error.response?.data){
                
            }
        }
        throw error
    }
}