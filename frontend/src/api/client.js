import axios from "axios";

// Empty baseURL uses relative /api paths so deployed HTTPS frontend talks directly to deployed backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  timeout: 30000,
});

export default api;
