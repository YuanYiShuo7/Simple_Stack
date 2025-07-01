import {createRouter, createWebHistory} from 'vue-router'
import routes from './routes'
import { useUserStore } from '@/stores/user';

let router = createRouter({
    history: createWebHistory(),
    routes: routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        }
        return { top: 0 }
    }
})

router.beforeEach(async (to, from, next) => {

   if (import.meta.env.DEV) {
    next();
    return;
  }

  const userStore = useUserStore();
  const isLoggedIn = userStore.isLoggedIn;
  
  // 初始化用户状态
  if (!isLoggedIn && localStorage.getItem('token')) {
    try {
      await userStore.initUser();
    } catch (error) {
      localStorage.removeItem('token');
    }
  }

  // 检查是否需要登录
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
    return;
  }

  // 检查用户角色权限
  if (to.meta.roles && !to.meta.roles.some(role => userStore.userRoles.includes(role))) {
    next('/403'); // 假设有403页面
    return;
  }

  next();
});

export default router