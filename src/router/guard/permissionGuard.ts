import type { Router, RouteRecordRaw } from 'vue-router';

import { usePermissionStoreWidthOut } from '/@/store/modules/permission';

import { PageEnum } from '/@/enums/pageEnum';
import { useUserStoreWidthOut } from '/@/store/modules/user';

import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';
import {getToken} from "/@/utils/auth";
import {isBoozSoftDevUser, IsBoozSoftDevUser, isUseMock} from "/@/utils/env";
import {useSsoStoreWidthOut} from "/@/store/modules/sso";
import router from "/@/router";

const LOGIN_PATH = PageEnum.BASE_LOGIN;

const whitePathList: PageEnum[] = [LOGIN_PATH];

export function createPermissionGuard(router: Router) {
  const userStore = useUserStoreWidthOut();
  const permissionStore = usePermissionStoreWidthOut();

  router.beforeEach(async (to, from, next) => {
    // Jump to the 404 page after processing the login
    if(from.path === '/hello/aaa' ||to.fullPath==='/hello' ||to.fullPath==='/hello/aaaa'){
      next();
      return
    }
    if ((from.path === LOGIN_PATH && to.name === PAGE_NOT_FOUND_ROUTE.name)) {
      next(PageEnum.BASE_HOME);
      return;
    }

    // Whitelist can be directly entered
    if (whitePathList.includes(to.path as PageEnum)) {
      next();
      return;
    }

    const token = userStore.getToken;
    if(!token){
      ;(async ()=>{
        await router.isReady();
        router.push('/login')
      })();
      // userStore.setToken(await useSsoStoreWidthOut().goGetToken());
      // await userStore.loadUserState()
    }

    if (permissionStore.getIsDynamicAddedRoute) {
      next();
      return;
    }

    // const routes = await permissionStore.buildRoutesAction();
    //
    // routes.forEach((route) => {
    //   router.addRoute((route as unknown) as RouteRecordRaw);
    // });

    const redirectPath = (from.query.redirect || to.path) as string;
    const redirect = decodeURIComponent(redirectPath);
    const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect };
    permissionStore.setDynamicAddedRoute(true);
    next(nextData);
  });
}
