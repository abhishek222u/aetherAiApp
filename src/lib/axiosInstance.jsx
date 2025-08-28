import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://74.225.157.233:3010/api',
});

export default axiosInstance;