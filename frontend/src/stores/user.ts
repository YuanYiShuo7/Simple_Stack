import { defineStore } from 'pinia';
import { reqLogout, reqUpdateUsername, reqUpdateAvatar } from '@/api/user/index';

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

const defaultUserInfo = {
      id: '114514',
      username: 'User',
      avatar: 'src/assets/imgs/default.png',
      email: 'user@example.com',
      roles: [],
};

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: '',
    userInfo:defaultUserInfo,
  }),

  actions: {
    setUserInfo(payload: { token: string; userInfo: any }) {
      this.token = payload.token;
      this.userInfo = payload.userInfo;
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
      this.userInfo = defaultUserInfo;
    },

    initUser() {
      const token = localStorage.getItem('token');
      if (token) {
        this.token = token;
      }
    },

    async updateUsername(data:{username: string}) {
      try {
        const res = await reqUpdateUsername(data);
        if (this.userInfo) {
          this.userInfo.username = res.data.username;
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
        
        const res = await reqUpdateAvatar(formData);
        if (this.userInfo) {
          this.userInfo.avatar = res.data.avatarUrl;
        }
        return res.data.avatarUrl;
      } catch (error) {
        console.error('Avatar upload failed:', error);
        throw error;
      }
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
    userRoles: (state) => state.userInfo?.roles || []
  }
});