const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      requiresGuest: true
    }
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home/index.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/dashboard/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'editor']
    }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404/index.vue')
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/403/index.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'any',
    redirect: '/404'
  }
];

export default routes;