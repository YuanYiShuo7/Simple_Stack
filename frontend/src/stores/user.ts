//@/stores/user.ts
import { defineStore } from 'pinia';
import { reqLogout, reqUpdateUsername, reqUpdateAvatar, reqUserInfo } from '@/api/user/index';

interface UserState {
  token: string;
  expiresAt: number; // token过期时间戳
  userInfo: {
    username: string;
    email: string;
    avatar: string;
    role: string;
  } | null;
}

const defaultUserInfo = {
  username: 'User',
  avatar: '',
  email: '',
  role: 'user',
};

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: '',
    expiresAt: 0,
    userInfo: defaultUserInfo,
  }),

  actions: {
    setUserInfo(payload: { token: string; expiresIn: number; userInfo: any }) {
      const expiresAt = Date.now() + payload.expiresIn * 1000;
      this.token = payload.token;
      this.expiresAt = expiresAt;
      this.userInfo = payload.userInfo;
      
      // 存储到localStorage
      localStorage.setItem('userData', JSON.stringify({
        token: payload.token,
        expiresAt,
        userInfo: payload.userInfo
      }));
    },

    async logout() {
      try {
        await reqLogout();
      } finally {
        this.resetUserInfo();
        localStorage.removeItem('userData');
      }
    },

    resetUserInfo() {
      this.token = '';
      this.expiresAt = 0;
      this.userInfo = defaultUserInfo;
    },

    async initUser() {
      const userDataStr = localStorage.getItem('userData');
      if (!userDataStr) return;

      const userData = JSON.parse(userDataStr);
      
      // 检查token是否过期
      if (Date.now() > userData.expiresAt) {
        localStorage.removeItem('userData');
        return;
      }

      this.token = userData.token;
      this.expiresAt = userData.expiresAt;
      
      if (userData.userInfo) {
        this.userInfo = userData.userInfo;
      } else {  
        this.resetUserInfo();
        localStorage.removeItem('userData');
      }
    },

    async updateUsername(data: {username: string}) {
      try {
        const res = await reqUpdateUsername(data);
        if (this.userInfo) {
          this.userInfo.username = res.data.username;
          this.updateLocalStorageUserInfo();
        }
        return res.data.username;
      } catch (error) {
        console.error('Failed to update username:', error);
        throw error;
      }
    },

    async updateAvatar(file: File) {
      try {
        const formData = new FormData();
        formData.append('avatar', file); 
        formData.append('email', this.userInfo?.email || ''); 
        const res = await reqUpdateAvatar({formData: formData}); 
        if (this.userInfo) {
          this.userInfo.avatar = res.data.avatarUrl;
          this.updateLocalStorageUserInfo();
        }
        return res.data.avatarUrl;
      } catch (error) {
        console.error('Avatar upload failed:', error);
        throw error;
      }
    },

    updateLocalStorageUserInfo() {
      const userDataStr = localStorage.getItem('userData');
      if (!userDataStr || !this.userInfo) return;
      
      const userData = JSON.parse(userDataStr);
      localStorage.setItem('userData', JSON.stringify({
        ...userData,
        userInfo: this.userInfo
      }));
    }
  },

  getters: {
    isLoggedIn: (state) => !!state.token && state.expiresAt > Date.now(),
  }
});