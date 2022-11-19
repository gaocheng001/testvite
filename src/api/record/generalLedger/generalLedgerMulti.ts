import {defineStore} from 'pinia';
import {store} from '/@/store';
import {message} from "ant-design-vue";
import {reactive} from "vue";

export const useMultiStore = defineStore({
  id: 'useMultiStore',
  state: (): any => ({
    J:[
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
        align: 'center',
      },
      {
        title: '日期',
        dataIndex: 'dbillDate',
        key: 'dbillDate',
        align: 'center',
      },
      {
        title: '凭证字号',
        dataIndex: 'inoId',
        key: 'inoId',
        align: 'center',
      },
      {
        title: '摘要',
        dataIndex: 'cdigest',
        key: 'cdigest',
        align: 'center',
      },
      {
        title: '借方',
        dataIndex: 'sjmoney',
        key: 'sjmoney',
        align: 'right',
        slots: { customRender: 'sjmoney' },
      },
      {
        title: '贷方',
        dataIndex: 'sdmoney',
        key: 'sdmoney',
        align: 'right',
        slots: { customRender: 'sdmoney' },
      },
      {
        title: '方向',
        dataIndex: 'fx',
        key: 'fx',
        align: 'center',
      },
      {
        title: '余额',
        dataIndex: 'symoney',
        key: 'symoney',
        align: 'right',
        slots: { customRender: 'symoney' },
      }
    ]
  }),
  getters: {
    getColumns: (state) => (value) => {
      if(value == 'J'){
        return state.J
      }else  if(value == 'SJ'){
        return state.SJ
      }else  if(value == 'WJ'){
        return state.WJ
      }else{
        return state.SWJ
      }
      return state.J
    },
  },
  actions: {

  }
});

// Need to be used outside the setup
export function useMultiStoreWidthOut() {
  return useMultiStore(store);
}

