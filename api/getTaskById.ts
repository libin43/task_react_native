import axios from "axios";
import { API_BASE_URL } from "./constant";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const GET_TASK_BY_ID_API = async(id: string) =>{
    try{
        const token = await AsyncStorage.getItem('accessToken');
        const response = await axios.get(
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