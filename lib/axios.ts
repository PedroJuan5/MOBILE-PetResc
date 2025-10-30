import axios, { AxiosError } from "axios"; 

const api = axios.create({
  baseURL: "http://192.168.56.1:3000",
  headers: { "Content-Type": "application/json" },
});

export default api;
export { AxiosError };