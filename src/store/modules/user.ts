import type { UserInfo } from '/#/store';
import {useSsoStoreWidthOut} from '/@/store/modules/sso';
import type { ErrorMessageMode } from '/@/utils/http/axios/types';

import { defineStore } from 'pinia';
import { store } from '/@/store';

import { RoleEnum } from '/@/enums/roleEnum';
import { PageEnum } from '/@/enums/pageEnum';
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY } from '/@/enums/cacheEnum';

import { getAuthCache, setAuthCache } from '/@/utils/auth';
import {  LoginParams } from '/@/api/sys/model/userModel';

import {getUserInfo, doLogout, loginApi, commitMockToken} from '/@/api/sys/user';

import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import router from '/@/router';
import {usePlatformsStoreWidthOut} from "/@/store/modules/platforms";
import {GetUserInfoByUserIdModel} from "/@/api/sys/model/userModel";
import {querySystemUserInfo} from "/@/api/sys/user";
import {clearConfigCache} from 'prettier';
import {nextTick} from "vue";

interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  roleList: RoleEnum[];
  sessionTimeout?: boolean;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    token: undefined,
    // roleList
    roleList: [],
    // Whether the login expired
    sessionTimeout: false,
  }),
  getters: {
    getUserInfo(): UserInfo {
      return this.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getToken(): string {
      return this.token || getAuthCache<string>(TOKEN_KEY);
    },
    getRoleList(): RoleEnum[] {
      return this.roleList.length > 0 ? this.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY);
    },
    getSessionTimeout(): boolean {
      return !!this.sessionTimeout;
    },
  },
  actions: {
    isSsoBack(){
      return false
    },
    setToken(info: string | undefined) {
      this.token = info;
      setAuthCache(TOKEN_KEY, info);
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    setUserInfo(info: UserInfo) {
      this.userInfo = info;
      setAuthCache(USER_INFO_KEY, info);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    resetState() {
      this.userInfo = null;
      this.token = '';
      this.roleList = [];
      this.sessionTimeout = false;
    },

    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      try {
        // await doLogout();
      } catch {
        console.log('注销Token失败');
      }
      this.setToken(undefined);
      // qing chu huan cun
      goLogin && router.push(PageEnum.BASE_LOGIN);
    },
    isNoLogin(){
      return !this.getToken
    },
    setState(info){
      this.setToken(info.token);
      this.setUserInfo(info.user)
      this.setRoleList(info.roles)
    },
    async goLogin(info) {
      this.setState(info);

      nextTick(async () => {
        router.push('/hello/aaa')
        setTimeout(async ()=>{
          await usePlatformsStoreWidthOut().resetPlatformsCache()
          await usePlatformsStoreWidthOut().goNcDesktop()
        },100)
      })


    },
    // async goLogin() {
    //   this.setToken(await useSsoStoreWidthOut().goGetToken());
    //
    //   const systemUserInfo = await querySystemUserInfo()
    //   const {user, roles} = systemUserInfo
    //   this.setUserInfo(user)
    //   this.setRoleList(roles)
    //   await usePlatformsStoreWidthOut().reloadLayoutList()
    //   return
    // },
    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: 'warning',
        title: t('sys.app.logoutTip'),
        content: t('sys.app.logoutMessage'),
        onOk: async () => {
          await this.logout(false);
        },
      });
    },
  },
});


// Need to be used outside the setup
export function useUserStoreWidthOut() {
  return useUserStore(store);
}
