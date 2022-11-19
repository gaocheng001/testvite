import {store} from '/@/store'


import {defineStore} from "pinia";
import {usePlatformsStoreWidthOut} from "/@/store/modules/platforms";


function setCache(k, v) {
  window.localStorage.setItem(k, JSON.stringify(v))
}

function getCache(k) {
  return JSON.parse(window.localStorage.getItem(k))
}

export const useTenantPickerStore = defineStore({
  id: 'TenantPicker',
  state: (): any => ({
    tenantInfoList:[],
    tenantInfo:{},
    currentPlatformTenantInfo:{},
    globalTenantInfo:{}
  }),
  getters: {
    getTenantInfo() {

    },

    getCurrentPlatformTenantInfo() {

    },

    getGlobalTenantInfo() {

    }
  },
  actions: {
    // 工作台主页，触发一次绑定到全局
    resetGlobalTenant() {
      const tenantPicker = getCache('tenantPicker')
      tenantPicker.value.global = 'aaaa'
    },
    // 工作台主页，触发一次绑定到全局
    resetCurrentPlatformTenant() {
      const tenantPicker = getCache('tenantPicker')

      function getCurrentPlatformId() {
      }

      tenantPicker.value.platform[getCurrentPlatformId()] = 'bbbb'
    },
    // 页面ReloadTable
    resetTenantForPage() {

    },
    action:{
      resetDesktopTenantGlobal(){
        // 设置全局租户
        this.resetGlobalTenant()
        // 刷新当前平台权限
        usePlatformsStoreWidthOut().resetCurrentPlatformRouter()
      },
      resetCurrentPlatformTenantGlobal(){
        this.resetCurrentPlatformTenant()
        // 刷新当前平台权限
        usePlatformsStoreWidthOut().resetCurrentPlatformRouter()
      }

    }
  }

});

// Need to be used outside the setup
export function useTenantPickerStoreWidthOut() {
  return useTenantPickerStore(store);
}
