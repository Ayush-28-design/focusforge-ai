import axios from "axios";

const API = axios.create({
  baseURL: "https://focusforge-ai-production.up.railway.app",
});

export default API;
