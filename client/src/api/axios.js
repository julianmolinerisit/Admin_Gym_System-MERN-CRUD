import axios from "axios";
import { API_URL } from "../config";

// Creates an axios instance with default configurations
const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export default instance;
