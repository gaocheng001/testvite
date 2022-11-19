import {defineStore} from "pinia";
import {store} from "/@/store";

export const useUsePingzhengStore = defineStore({
  id: 'useUsePingzhengStore',
  state: () => ({

  }),
  getters: {
  },
  actions: {
    usePingZheng(){

    }
  }
})
// Need to be used outside the setup
export function useUsePingzhengStoreWidthOut() {
  return useUsePingzhengStore(store);
}
