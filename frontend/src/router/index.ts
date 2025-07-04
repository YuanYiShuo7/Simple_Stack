// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { useUserStore } from '@/stores/user';

const router = createRouter({
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
    // Skip auth checks in development for easier testing
    if (import.meta.env.DEV) {
        next();
        return;
    }

    const userStore = useUserStore();
    
    // 初始化用户
    if (!userStore.isLoggedIn && localStorage.getItem('userData')) {
        try {
            await userStore.initUser();
        } catch (error) {
            console.error('Failed to initialize user:', error);
            localStorage.removeItem('userData');
            next('/login');
            return;
        }
    }

    // Check if route requires authentication
    if (to.meta.requiresAuth && !userStore.isLoggedIn) {
        next({
            path: '/login',
            query: { redirect: to.fullPath }
        });
        return;
    }

    // Check if user has required role
    if (to.meta.requiredRole && to.meta.requiredRole !== userStore.userInfo?.role) {
        next('/403');
        return;
    }

    next();
});

export default router