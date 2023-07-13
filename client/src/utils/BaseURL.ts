import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error.response.data.err)
);

// instance.interceptors.response.use(
//   function (response) {
//     return response;
//   },
//   function (error) {
//     return Promise.reject(error);
//   }
// );

export default instance;
