import axios from "./axios";

// Registers a new user
export const registerRequest = async (user) => axios.post(`/auth/register`, user);

// Logs in a user
export const loginRequest = async (user) => axios.post(`/auth/login`, user);

// Verifies the authentication token
export const verifyTokenRequest = async () => axios.get(`/auth/verify`);
