import axios from "axios";
import { API_BASE_URL } from "./constant";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UPDATE_TASK_API = async(id: string, title: string, description: string) =>{
    try{
        const token = await AsyncStorage.getItem('accessToken');
        const response = await axios.put(
            `${API_BASE_URL}/tasks/${id.trim()}`,
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
    } catch(error){
        throw error
    }
}