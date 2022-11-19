import {defineStore} from 'pinia';
import {store} from '/@/store';
import {findAllAccvoucherTemplate} from "/@/api/record/system/accvoucher_template";
import {message} from "ant-design-vue";
import {reactive} from "vue";

export const useCdnStore = defineStore({
  id: 'useCdnStore',
  state: (): any => ({

  }),
  getters: {
    getPath:  () => {
      return 'http://nc.boozsoft.cn:81/cdn/nc'
    },
  }
});

// Need to be used outside the setup
export function useCdnStoreWidthOut() {
  return useCdnStore(store);
}

