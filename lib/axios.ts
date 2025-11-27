import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: "https://petresc.onrender.com",
  headers: { "Content-Type": "application/json" },
});

export default api;
export { AxiosError };
