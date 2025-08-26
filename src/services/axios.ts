import { TOKEN_NAME } from "@/constants/app.constant";
import { getOrCreateViewerId } from "@/lib/viewer";
import axios from "axios";
import cookies from "js-cookie";

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Create Axios instance
const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = cookies.get(TOKEN_NAME);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // attach viewer id for blog tracking
    const viewerId = getOrCreateViewerId();
    if (viewerId && config.headers) {
      config.headers["x-device-web-id"] = viewerId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
