import axios from "axios";
import { API_BASE_URL } from "./constant";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const GET_ALL_TASKS_API = async() =>{
    try{
        const token = await AsyncStorage.getItem('accessToken');
        const response = await axios.get(
            `${API_BASE_URL}/tasks`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
          return response
    } catch(error){
        throw error
    }
}