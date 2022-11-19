import { defineStore } from 'pinia';
import { store } from '/@/store';

export const useDatasourceStore = defineStore({
  id: 'companyOperate',
  actions:{
    switchDatasource({databaseName,schemaName}){

    }
  }
});

// Need to be used outside the setup
export function useDatasourceStoreWidthOut() {
  return useDatasourceStore(store);
}
