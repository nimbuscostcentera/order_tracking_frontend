// axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL:process.env.REACT_APP_BASEURL, // Replace with your API base URL
  timeout: 10000,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add authorization token or other custom headers if needed
    const token = localStorage.getItem('AccessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data; // Simplify the response structure if needed
  },
  (error) => {
    // Handle errors globally
    if (error.response && error.response.status === 401) {
      //console.log("access tokn expire");

      let res = axios.get(
        `${process.env.REACT_APP_BASEURL}/auth-routes/fetch-token`,
        {
          RefreshToken: localStorage.getItem("refreshToken"),
        }
      );
      res
        .then((res) => {
          if (res.status === 200) {
            //console.log("token refresh success");
            localStorage.setItem(
              "AccessToken",
              res.data?.response?.AccessToken
            );
            localStorage.setItem(
              "RefreshToken",
              res.data?.response?.refreshToken
            );
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 402) {
            window.localStorage.clear();
            window.location.reload();
          }
        });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
