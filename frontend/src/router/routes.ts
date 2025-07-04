// src/router/routes.ts
const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index.vue'),
        meta: {
            requiresAuth: false,
        }
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/views/register/index.vue'),
        meta: {
            requiresAuth: false,
        }
    },
    {
        path: '/forgot-password',
        name: 'forgot-password',
        component: () => import('@/views/forgot-password/index.vue'),
        meta: {
            requiresAuth: false,
        }
    },
    {
    path: '/',
    redirect: '/user/home',
    },
    {
        path: '/user',
        name: 'user-root',
        component: () => import('@/views/user/root/index.vue'),
        meta: {
            requiresAuth: true,
            requiredRole: 'user',
        },
        children: [
            {
                path: 'settings',
                name: 'user-settings',
                component: () => import('@/views/user/user-settings/index.vue')
            },
            {
              path: 'home', // /user/home
              name: 'user-home',
              component: () => import('@/views/user/user-home/index.vue')
            },
            // Add more user routes here
        ]
    },
    // Admin routes (placeholder for future implementation)

    {
        path: '/404',
        name: '404',
        component: () => import('@/views/errors/404/index.vue'),
        meta: {
            requiresAuth: false,
        }
    },
    {
        path: '/403',
        name: '403',
        component: () => import('@/views/errors/403/index.vue'),
        meta: {
            requiresAuth: false,
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        redirect: '/404'
    }
];

export default routes;