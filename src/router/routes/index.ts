import type { AppRouteRecordRaw, AppRouteModule } from '/@/router/types';

import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '/@/router/routes/basic';

import { t } from '/@/hooks/web/useI18n';

const modules = import.meta.globEager('./modules/**/*.ts');

const routeModuleList: AppRouteModule[] = [];

Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routeModuleList.push(...modList);
});

export const asyncRoutes = [PAGE_NOT_FOUND_ROUTE, ...routeModuleList];

export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect:'/login',
  component: () => import('/@/views/Root.vue'),
  // redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'Root',
  },
};

export const HelloRoute: AppRouteRecordRaw = {
  path: '/hello',
  name: 'abc',
  component: () => import('/@/views/Root.vue'),
  children:[
    {
      path:'aaa',
      name:'加载中222',
      component: () => import('/@/views/Aaa.vue'),
      meta:{
        title:'加载中222'
      }
    }
  ],
  // redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'abc',
  },
};

export const LoginRoute: AppRouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('/@/views/sys/login/Login.vue'),
  meta: {
    title: t('routes.basic.login'),
  },
};

// Basic routing without permission
export const basicRoutes = [LoginRoute,HelloRoute, RootRoute,REDIRECT_ROUTE];
