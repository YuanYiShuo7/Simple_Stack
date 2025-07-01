import { defineStore } from 'pinia';
import { reqLogout } from '@/api/user/index';

interface UserState {
  token: string;
  userInfo: {
    id: string;
    username: string;
    email: string;
    avatar: string;
    roles: string[];
  } | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: '',
    userInfo: null
  }),
  actions: {
    setUserInfo(payload: { token: string; userInfo: any }) {
      this.token = payload.token;
      this.userInfo = payload.userInfo;
      // 存储token到localStorage
      localStorage.setItem('token', payload.token);
    },
    async logout() {
      try {
        await reqLogout();
      } finally {
        this.resetUserInfo();
        localStorage.removeItem('token');
      }
    },
    resetUserInfo() {
      this.token = '';
      this.userInfo = null;
    },
    // 初始化用户状态
    initUser() {
      const token = localStorage.getItem('token');
      if (token) {
        this.token = token;
        // 这里可以添加自动获取用户信息的逻辑
      }
    }
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
    userRoles: (state) => state.userInfo?.roles || []
  }
});