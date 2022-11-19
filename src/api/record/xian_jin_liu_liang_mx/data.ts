import {defineStore} from 'pinia';
import {store} from '/@/store';
import {message} from "ant-design-vue";
import {reactive} from "vue";

export const useXjllStore = defineStore({
  id: 'useXjllStore',
  state: (): any => ({
    J:[
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
        align: 'center',
        slots: { customRender: 'number' },
      },

      {
        title: '现金流量编码',
        dataIndex: 'xjcode',
        key: 'xjcode',
        align: 'center',
      },
      {
        title: '现金流量项目',
        dataIndex: 'xjname',
        key: 'xjname',
        align: 'center',
      },
      {
        title: '日期',
        dataIndex: 'dbillDate',
        key: 'dbillDate',
        align: 'right',
        slots: { customRender: 'dbillDate' },
      },
      {
        title: '凭证字号',
        dataIndex: 'inoId',
        key: 'inoId',
        align: 'right',
        slots: { customRender: 'inoId' },
      },
      {
        title: '摘要',
        dataIndex: 'cdigest',
        key: 'cdigest',
        align: 'center',
      },
      {
        title: '方向',
        dataIndex: 'fx',
        key: 'fx',
        align: 'center',
        slots: { customRender: 'fx' },
      },
      {
        title: '余额',
        dataIndex: 'money',
        key: 'money',
        align: 'center',
        slots: { customRender: 'money' },
      }
    ],
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
export function useXjllStoreWidthOut() {
  return useXjllStore(store);
}

