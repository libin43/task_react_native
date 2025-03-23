import axios from "axios";
import { API_BASE_URL } from "./constant";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const DELETE_TASK_API = async(id: string) =>{
    try{
        const token = await AsyncStorage.getItem('accessToken');
        const response = await axios.delete(
            `${API_BASE_URL}/tasks/${id.trim()}`,
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