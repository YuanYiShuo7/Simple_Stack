import { ElNotification } from 'element-plus'; // 如果使用Element Plus

export const showToast = (message: string, type: 'success' | 'warning' | 'info' | 'error' = 'info') => {
  ElNotification({
    title: type.charAt(0).toUpperCase() + type.slice(1),
    message,
    type,
    duration: 3000
  });
};