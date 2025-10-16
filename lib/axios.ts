import axios, { AxiosError } from "axios"; 

const api = axios.create({
  baseURL: "http://10.92.199.36:3000",
  headers: { "Content-Type": "application/json" },
});

export default api;
export { AxiosError };