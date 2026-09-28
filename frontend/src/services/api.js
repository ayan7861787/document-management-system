import axios from "axios";

const api = axios.create({
    baseURL: "https://document-management-system-2-h6t4.onrender.com/api",
});

export default api;