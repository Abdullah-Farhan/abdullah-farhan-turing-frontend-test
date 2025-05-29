import axios from 'axios';

const createAxiosInstance = (token) => {
  const instance = axios.create({
    baseURL: 'https://frontend-test-api.aircall.dev',
  });

  if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        return;
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export default createAxiosInstance;