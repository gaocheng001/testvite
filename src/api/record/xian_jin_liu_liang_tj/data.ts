import {defineStore} from 'pinia';
import {store} from '/@/store';
import {message} from "ant-design-vue";
import {reactive} from "vue";

export const useXJTjStore = defineStore({
  id: 'useXJTjStore',
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
        title: '现金流量项目分类名称',
        dataIndex: 'xjtypename',
        key: 'xjtypename',
        align: 'center',
        slots: { customRender: 'xjtypename' },
      },
      {
        title: '现金流量项目编码',
        dataIndex: 'xjcode',
        key: 'xjcode',
        align: 'center',
        slots: { customRender: 'xjcode' },
      },
      {
        title: '现金流量项目名称',
        dataIndex: 'xjname',
        key: 'xjname',
        align: 'center',
        slots: { customRender: 'xjname' },
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
      return state.J
    },
  },
  actions: {

  }
});

// Need to be used outside the setup
export function useXJTJStoreWidthOut() {
  return useXJTjStore(store);
}

