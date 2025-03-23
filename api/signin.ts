import axios from "axios";
import { API_BASE_URL } from "./constant";

export const SIGNIN_API = async(email: string, password: string) =>{
    try{
        const response = await axios.post(
            `${API_BASE_URL}/auth/login`,
            {
              email,
              password,
            }
          );
          return response
    } catch(error){
        throw error
    }
}