import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

let tokenCache: string | null = null;

async function getToken() {
  if (tokenCache) return tokenCache;

  if (Platform.OS === "web") {
    tokenCache = localStorage.getItem("@PetResc:token");
    return tokenCache;
  }

  tokenCache = await SecureStore.getItemAsync("@PetResc:token");
  return tokenCache;
}

const api = axios.create({
  baseURL: "https://petresc.onrender.com/api",
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
