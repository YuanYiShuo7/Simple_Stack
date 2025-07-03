import axios from 'axios';

// 创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
});

// 添加请求拦截器
request.interceptors.request.use(
  (config) => {
    // 请求发送前的处理逻辑
    
    // 1. 添加认证token（如果存在）
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 2. 设置公共请求头
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    config.headers['Accept'] = 'application/json';
    
    // 3. 如果是POST/PUT请求，且没有设置Content-Type，默认设置为json
    if (['post', 'put', 'patch'].includes(config.method?.toLowerCase())) {
      config.headers['Content-Type'] = 
        config.headers['Content-Type'] || 'application/json';
    }
    
    // 4. 开发环境打印请求信息
    if (import.meta.env.DEV) {
      console.log(`发送请求: ${config.method?.toUpperCase()} ${config.url}`);
      if (config.data) {
        console.log('请求参数:', config.data);
      }
    }
    
    return config;
  },
  (error) => {
    // 请求错误处理
    if (import.meta.env.DEV) {
      console.error('请求拦截器错误:', error);
    }
    return Promise.reject(error);
  }
);

// 添加响应拦截器（完整示例通常需要）
request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('HTTP 状态码:', error.response?.status); // 打印状态码
    console.error('响应数据:', error.response?.data);      // 打印错误数据
    return Promise.reject(error);
  }
);

export default request;