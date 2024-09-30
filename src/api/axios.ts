import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true, 
});


axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response) {
        const status = error.response.status;
  
        if (status === 401) {
          console.error('Unauthorized. Redirecting to login...');
          window.location.href = '/login'; 
        }
  
        if (status === 403) {
          console.error('Forbidden. You do not have access to this resource.');
        }
  
        if (status === 500) {
          console.error('Server error:', error.response.data.message);
        }
      }
  
      return Promise.reject(error);
    }
  );
  
  export default axiosInstance;