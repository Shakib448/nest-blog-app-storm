import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error.response.data.err)
);

export default instance;
