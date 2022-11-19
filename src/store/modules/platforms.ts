import { getAccountList } from '/@/api/record/system/account';
import { getAllPlatform } from '/@/api/sys/menu';
import { getTokenPlatforms } from '/@/api/sys/user';
import { AUTHORIZE_LIST_KEY, ACCOUNT_LIST_KEY } from '/@/enums/cacheEnum';
import router, { resetRouter } from '/@/router';
import { store } from '/@/store';
import { useCompanyOperateStoreWidthOut } from '/@/store/modules/operate-company';
import { getAuthCache, setAuthCache } from '/@/utils/auth';
import { useDbCacheStore } from '/@/utils/cache/localforage';

import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';

import { createPinia, defineStore } from 'pinia';
import { usePermissionStoreWidthOut } from './permission';
import { useUserStoreWidthOut } from '/@/store/modules/user';
import { createApp, nextTick, ref } from 'vue';
import { useMultipleTabStore } from '/@/store/modules/multipleTab';
import {
  abcasdsadsa,
  getCurrentTabStore,
} from '/@/boozsoft/layouts/platforms/components/platform-default/tabs/helloPlatform';
import { iframeLogin, sendMessage } from '/@/utils/Home';
import { getAllAccAuths } from '/@/api/record/system/financial-settings';

function isEmptyPlatformData() {
  return window.platformData == null;
}

async function activeSelected(platforms, id) {
  platforms.forEach((item) => {
    if (item.id == id) {
      item.selected = true;
    } else {
      item.selected = false;
    }
  });
  return new Promise((r, j) => {
    setTimeout(async () => {
      r('ok');
    }, 10);
  });
}

function isIframePlatform(id) {
  return id == 20005 || id == 20013 || id == 20004;
}

function getIframePlatformName(id) {
  if (id == 20013) {
    return '薪酬管理';
  } else if (id == 20005) {
    return '网上报销';
  } else if (id == 20004) {
    return '财税达';
  }
}

async function resetPlatformRouter(id) {
  resetRouter();
  await usePlatformsStoreWidthOut().addRoutesAction(
    await usePermissionStoreWidthOut().buildRoutesAction(id),
  );
}

async function layzyAuthorizeList() {
  let accountList = null; // getAuthCache(AUTHORIZE_LIST_KEY);
  if (accountList == null) {
    const userStore = useUserStoreWidthOut();
    accountList = await getAllAccAuths({ userId: userStore.getUserInfo.id });
    // setAuthCache(AUTHORIZE_LIST_KEY, accountList);
  }
  return accountList;
}

function handlePlatformStore(id) {
  isEmptyPlatformData() && resetPlatformData();
  isEmptyPlatformStore(id) && resetPlatformStore(id);
}

function getPlatform(platforms, id) {
  return platforms.filter((item) => item.id == id)[0];
}

function resetPlatformData() {
  window.platformData = {};
  window.platformData.storeList = ref([]);
}

function isEmptyPlatformStore(id) {
  return window.platformData.storeList.value.filter((item) => item.id == id).length == 0;
}

function resetPlatformStore(id) {
  const store = createPinia();
  window.platformData.storeList.value.push({
    id,
    store: () => store,
  });
  window['h' + id] = () => {
    return useMultipleTabStore(store);
  };
}

// const permissionStore = usePermissionStoreWidthOut()
// import { permissionStore } from './permission'
// import {permissionStore} from "/@/store/modules/permission";

// function getCache(key) {
//   const str = window.localStorage.getItem(key);
//   if(str==null){
//     return null
//   }
//   return JSON.parse(<string>str);
// }
// function setCache(k,v){
//   window.localStorage.setItem(k, JSON.stringify(v));
//
// }

export function getCurrentPlatformIdCache() {
  const currentLayoutId = getAuthCache('currentLayoutId');
  return currentLayoutId;
}

function getNcDesktopPlatformId(platforms) {
  const ncDesktopPlatform = platforms.filter((item) => item.category === 106)[0];
  return ncDesktopPlatform.id;
}

export const usePlatformsStore = defineStore({
  id: 'layouts',
  state: (): any => ({
    currentType: 'app',
    currentIframe: 'app',
    iframeList: [
      {
        name: '薪酬管理',
        // path: 'http://localhost:8084/gongzi',
        path: 'http://103.139.212.83:8030/gongzi',
        active: false,
        show: false,
        ref: null,
      },
      {
        name: '网上报销',
        // path: 'http://localhost:3000',
        // path: 'http://localhost:8013',
        // path: 'http://localhost:8000',
        path: 'http://wb.mangse.net/',
        active: false,
        show: false,
        ref: null,
      },
      {
        name: '财税达',
        path: 'http://csd.caishuida.cn/',
        active: false,
        show: false,
        ref: null,
      },
    ],
    showLoading: true,
    showPromissSiteBar: false,
    platformView: createAsyncComponent(
      () => import('/@/boozsoft/layouts/platforms/platform-nc-enter/index.vue'),
    ),
    currentLayoutId: {},
    currentPlatform: {},
    // 权限主页列表
    platforms: [
      // {name: '总账', selected: true},
      // {name: '组织管理'},
      // {name: '集团管理(超级管理员)'},
      // {name: '集团管理(管理员)'}
    ],

    // 应用列表
    apps: [
      { name: 'NC平台', selected: true, isCloud: false },
      { name: '薪资系统', isCloud: false },
      { name: '固定资产', isCloud: false },
      { name: '电子票据', isCloud: false },
      { name: '财税达', isCloud: true },
      { name: '网上报销', isCloud: true },
      { name: '员工系统', isCloud: false },
    ],
  }),
  getters: {
    getCurrentType() {
      return this.currentType;
    },
    getIframeList() {
      return this.iframeList;
    },
    getShowLoading(): any {
      return this.showLoading;
    },
    getCurrentLayoutId(): any {
      return this.currentLayoutId;
    },

    getCurrentPlatformId(): any {
      return this.currentLayoutId;
    },
    getCurrentPlatform(): any {
      return this.currentPlatform;
    },

    getShowPromissSiteBar(): any {
      return this.showPromissSiteBar;
    },

    getPlatforms(): any {
      return this.platforms;
    },

    findMenuByRoleList(): any {
      return this.platforms;
    },

    getApps(): any {
      return this.apps;
    },

    getPlatformView(): any {
      return this.platformView;
    },
  },
  actions: {
    resetCurrentPlatformRouter() {
      this.resetCurrentPlatform(this.currentPlatform.id);
    },
    reloadIframe(name) {
      this.iframeList.filter((item) => item.name == name)[0].active = false;
      setTimeout(() => {
        this.iframeList.filter((item) => item.name == name)[0].active = true;
      });
    },
    activeIframe(name) {
      const currentIframe = this.iframeList.filter((item) => item.name == name)[0];
      this.iframeList.forEach((item) => (item.show = false));
      currentIframe.active = true;
      currentIframe.show = true;
      nextTick(() => {
        let user = null;
        if (currentIframe.name == '薪酬管理') {
          user = {
            // user:'dev',
            // password:'1',
            openId: 'admin,1',
          };
        } else if (currentIframe.name == '网上报销') {
          user = {
            // user:'dev',
            // password:'1',
            openId: '13409972396,888888',
          };
        }
        iframeLogin(currentIframe, user);
      });
    },
    setCurrentType(e) {
      this.currentType = e;
    },
    async getPlatformListToNames() {
      const platforms = await getAllPlatform();

      return platforms
        .filter((item) => !item.isOutLink)
        .map((item) => {
          if (item.category == 101) {
            item.name = '【权限系统】' + item.name;
          }
          if (item.category == 102) {
            item.name = '【应用】' + item.name;
          }
          return item;
        });
    },
    commitShowLoading(v): any {
      this.showLoading = v;
    },
    commitCurrentPlatform(item: any): void {
      setAuthCache('currentLayoutId', item.id);
      this.currentLayoutId = item.id;
      this.currentPlatform = item;
    },

    commitPlatforms(platforms: any): void {
      this.platforms = platforms;
    },

    commitApps(apps: any): void {
      this.apps = apps;
    },

    commitShowPromissSiteBar(isShow: boolean): void {
      this.showPromissSiteBar = isShow;
    },

    getPlatformViewComponent(id: any) {
      const key = this.platforms.filter((item) => item.id == id).map((item) => item.name)[0];
      switch (key) {
        case 'NC桌面':
          return createAsyncComponent(
            () => import('/@/boozsoft/layouts/platforms/platform-nc-desktop/index.vue'),
          );
        case '开发模块库':
          return createAsyncComponent(
            () => import('/@/boozsoft/layouts/platforms/platform-devComponents/index.vue'),
          );
        // case '集团管理(超级管理员)':
        //   return createAsyncComponent(() => import('/@/boozsoft/layouts/platforms/platform-group/index.vue'))
        case '集团管理':
          return createAsyncComponent(
            () => import('/@/boozsoft/layouts/platforms/platform-system/index.vue'),
          );

        case '组织管理':
          return createAsyncComponent(
            () => import('/@/boozsoft/layouts/platforms/platform-origin/index.vue'),
          );
        case '系统管理':
          return createAsyncComponent(
            () => import('/@/boozsoft/layouts/platforms/platform-system/index.vue'),
          );
        case '总账':
          return createAsyncComponent(
            () => import('/@/boozsoft/layouts/platforms/platform-account/index.vue'),
          );
        case '现金银行':
          return createAsyncComponent(
            () => import('/@/boozsoft/layouts/platforms/platform-xian-jin-liu-liang/index.vue'),
          );
        case '应收账':
          return createAsyncComponent(
            () => import('/@/boozsoft/layouts/platforms/platform-ying-shou-zhang/index.vue'),
          );
        case '应付账':
          return createAsyncComponent(
            () => import('/@/boozsoft/layouts/platforms/platform-ying-fu-zhang/index.vue'),
          );
        case '主数据':
          return createAsyncComponent(
            () => import('/@/boozsoft/layouts/platforms/platform-system/index.vue'),
          );
        case '机构':
          return createAsyncComponent(
            () => import('/@/boozsoft/layouts/platforms/platform-system/index.vue'),
          );
        case '客户':
          return createAsyncComponent(
            () => import('/@/boozsoft/layouts/platforms/platform-system/index.vue'),
          );
        case '供应商':
          return createAsyncComponent(
            () => import('/@/boozsoft/layouts/platforms/platform-system/index.vue'),
          );
        case '固定资产':
          return createAsyncComponent(
            () => import('/@/boozsoft/layouts/platforms/platform-system/index.vue'),
          );
        default:
          return createAsyncComponent(
            () => import('/@/boozsoft/layouts/platforms/platform-system/index.vue'),
          );
      }
      throw new Error('视图解析错误');
    },

    async addRoutesAction(routes) {
      routes.forEach((route) => {
        // router.addRoute(RootRoute.name!, route as RouteRecordRaw);
        router.addRoute(route);
      });
    },
    goIframePlatform(id) {
      this.setCurrentType('iframe');
      this.activeIframe(getIframePlatformName(id));
    },
    resetCurrentPlatform(id) {
      this.commitCurrentPlatform(getPlatform(this.platforms, id));
    },
    async goAppPlatform(id) {
      this.setCurrentType('app');

      handlePlatformStore(id);
      this.resetCurrentPlatform(id);

      const aa = await Promise.all([resetPlatformRouter(id), this.getPlatformViewComponent(id)]);
      this.platformView = aa[1];
      router.push('/');
    },
    async switchPlatform({ id, goHome }: any) {
      await activeSelected(this.getPlatforms, id);

      if (isIframePlatform(id)) {
        this.goIframePlatform(id);
        return;
      }

      await this.goAppPlatform(id);
    },
    getCurrentHomeName() {
      const platformInfo = this.getCurrentPlatform;

      function getHomeName(platformInfo) {
        let homeName = null;
        if (platformInfo.name == 'NC桌面') {
          homeName = '/ncDesktop/home/welcome';
        }
        if (platformInfo.name == '开发模块库') {
          homeName = '/devComponents/home/welcome';
        }
        if (platformInfo.name == '集团管理') {
          homeName = '/system/home/welcome';
        }
        if (platformInfo.name == '组织管理') {
          homeName = '/origin/home/welcome';
        }
        if (platformInfo.name == '系统管理') {
          homeName = '/system/home/welcome';
        }
        if (platformInfo.name == '总账') {
          homeName = '/zhongZhang/home/welcome';
        }
        if (platformInfo.name == '现金银行') {
          homeName = '/xianJinYinHang/home/welcome';
        }
        if (platformInfo.name == '应收账') {
          homeName = '/yinShouZhang/home/welcome';
        }
        if (platformInfo.name == '应付账') {
          homeName = '/yinFuZhang/home/welcome';
        }
        if (platformInfo.name == '主数据') {
          homeName = '/one/home/welcome';
        }
        if (platformInfo.name == '机构') {
          homeName = '/two/home/welcome';
        }
        if (platformInfo.name == '客户') {
          homeName = '/three/home/welcome';
        }
        if (platformInfo.name == '供应商') {
          homeName = '/four/home/welcome';
        }
        if (platformInfo.name == '固定资产') {
          homeName = '/guDingZiChan/home/welcome';
        }
        return homeName;
      }

      const homeName = getHomeName(platformInfo);

      ;
      return homeName;
    },
    goHome() {
      const homeName = this.getCurrentHomeName();
      router.push(homeName);
    },
    async changeApp(b) {
      console.log(b);
      return 'a';
    },

    async resetPlatformsCache() {
      this.commitPlatforms(await this.getCachePlatforms());
    },
    ...{
      async goCurrentCachePlatform() {
        const currentPlatformId = getCurrentPlatformIdCache();
        await this.resetPlatformsCache();
        await this.switchPlatform({ id: currentPlatformId, goHome: false });
      },
      async goNcDesktop() {
        const ncDesktopPlatformId = getNcDesktopPlatformId(this.getPlatforms);
        await this.switchPlatform({ id: ncDesktopPlatformId, goHome: true }).then();
      },
    },
    async getCachePlatforms() {
      const api = async () => await getTokenPlatforms();
      // const dbCacheStore = await useDbCacheStore();
      let platforms: any = null;
      const cachePlatformsStr = await getAuthCache('platforms');
      if (cachePlatformsStr == null) {
        platforms = await api();
        await setAuthCache('platforms', JSON.stringify(platforms));
      } else {
        platforms = JSON.parse(cachePlatformsStr);
      }

      return platforms;
    },

    //
    // async selectPromissPage(selectItem: any) {
    //
    //   this.platforms.map(item => {
    //     if (selectItem == item) {
    //       item.selected = true;
    //       return selectItem;
    //     }
    //     item.selected = false;
    //     return item;
    //   });
    //
    //
    // }

    async selectApp(b) {
      console.log(b);
      return 'a';
    },
  },
});

// Need to be used outside the setup
export function usePlatformsStoreWidthOut() {
  return usePlatformsStore(store);
}
