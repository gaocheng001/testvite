import { defineStore } from 'pinia';
import { store } from '/@/store';

export const usePageDataStore = defineStore({
  id: 'usePageDataStore',
  state: (): any => ({
    datasourcePicker: null,
  }),
  getters: {
    getDatasourcePicker() {
      return this.datasourcePicker;
    },
  },
  actions: {
    commitDatasourcePicker(e) {
      this.datasourcePicker = e;
    },
  },
});

// Need to be used outside the setup
export function usePageDataStoreWidthOut() {
  return usePageDataStore(store);
}

// 财税达
// 1.做nc的凭证
// 2.做vue3版本的凭证
// 3.凭证组件修改，毫无意义
// 4.整体改成nc架构
