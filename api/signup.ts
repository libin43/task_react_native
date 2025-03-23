import axios from "axios";
import { API_BASE_URL } from "./constant";

export const SIGNUP_API = async(fname: string, lname: string, email: string, password: string) =>{
    try{
        const response = await axios.post(
            `${API_BASE_URL}/auth/signup`,
            {
                fname,
                lname,
                email,
                role: "USER",
                password,
            }
          );
          return response
    } catch(error){
        throw error
    }
}