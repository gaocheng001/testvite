import {defineStore} from 'pinia';
// @ts-ignore
import {store} from '/@/store';

export const ktzcStore = defineStore({
  id: 'ktzcStore',
  state: (): any => ({
    J:[
      {
        title: '存货编码',
        dataIndex: 'ddate',
        key: '0',
        ellipsis: true,
        fixed: 'left'
      },
      {
        title: '存货名称',
        dataIndex: 'billStyle',
        key: '1',
        ellipsis: true,
        slots: { customRender: 'billStyle' },
        fixed: 'left'
      },
      {
        title: '规格型号',
        dataIndex: 'ccode',
        key: '2',
        ellipsis: true,
        slots: { customRender: 'ccode' },
        fixed: 'left'
      },
      {
        title: '主计量',
        dataIndex: 'address',
        key: '3',
        ellipsis: true,
        slots: { customRender: 'address' },
      },
      {
        title: '计量1',
        dataIndex: 'bstyle',
        key: '4',
        ellipsis: true,
        slots: { customRender: 'bstyle' },
      },
      {
        title: '计量2',
        dataIndex: 'cvencode',
        key: '5',
        ellipsis: true,
        slots: { customRender: 'cvencode' },
      },
      {
        title: '现存量',
        dataIndex: 'jiecun',
        key: '6',
        children: [
          {
            title: '主数量',
            dataIndex: 'baseQuantity2',
            key: '6-1',
            align: 'right',
            slots: { customRender: 'baseQuantity2' },
          },
          {
            title: '数量1',
            dataIndex: 'price2',
            key: '6-2',
            align: 'right',
            slots: { customRender: 'price2' },
          },
          {
            title: '数量2',
            dataIndex: 'isum2',
            key: '6-3',
            align: 'right',
            slots: { customRender: 'isum2' },
          }
        ],
      },
      {
        title: '可用量',
        dataIndex: 'jiecun',
        key: '7',
        children: [
          {
            title: '主数量',
            dataIndex: 'baseQuantity2',
            key: '7-1',
            align: 'right',
            slots: { customRender: 'baseQuantity2' },
          },
          {
            title: '数量1',
            dataIndex: 'price2',
            key: '7-2',
            align: 'right',
            slots: { customRender: 'price2' },
          },
          {
            title: '数量2',
            dataIndex: 'isum2',
            key: '7-3',
            align: 'right',
            slots: { customRender: 'isum2' },
          }
        ],
      },
      {
        title: '在途可用量',
        dataIndex: 'jiecun',
        key: '8',
        children: [
          {
            title: '主数量',
            dataIndex: 'baseQuantity2',
            key: '8-1',
            align: 'right',
            slots: { customRender: 'baseQuantity2' },
          },
          {
            title: '数量1',
            dataIndex: 'price2',
            key: '8-2',
            align: 'right',
            slots: { customRender: 'price2' },
          },
          {
            title: '数量2',
            dataIndex: 'isum2',
            key: '8-3',
            align: 'right',
            slots: { customRender: 'isum2' },
          }
        ],
      },
      {
        title: '在途出库量',
        dataIndex: 'jiecun',
        key: '9',
        children: [
          {
            title: '主数量',
            dataIndex: 'baseQuantity2',
            key: '9-1',
            align: 'right',
            slots: { customRender: 'baseQuantity2' },
          },
          {
            title: '数量1',
            dataIndex: 'price2',
            key: '9-2',
            align: 'right',
            slots: { customRender: 'price2' },
          },
          {
            title: '数量2',
            dataIndex: 'isum2',
            key: '9-3',
            align: 'right',
            slots: { customRender: 'isum2' },
          }
        ],
      },
    ],
  }),
  getters: {
    getColumns: (state) => (value) => {
      if(value == 'J'){
        return state.J
      }else  if(value == 'SJ'){
        return state.SJ
      }
      return state.J
    },
  },
  actions: {

  }
});

// Need to be used outside the setup
export function useGlStoreWidthOut() {
  return ktzcStore(store);
}

