import {defineStore} from 'pinia';
// @ts-ignore
import {store} from '/@/store';

export const kcXCLStore666 = defineStore({
  id: 'kcXCLStore666',
  state: (): any => ({
    J:[
      {
        title: '仓储位置',
        dataIndex: 'stockCangkuName',
        key: 'stockCangkuName',
        align: 'left',ellipsis: true,
      },
      {
        title: '存货编码',
        dataIndex: 'stockNum',
        key: 'stockNum',
        align: 'left',ellipsis: true,
      },
      {
        title: '存货名称',
        dataIndex: 'stockName',
        key: 'stockName',
        align: 'left',ellipsis: true,
      },
      {
        title: '规格型号',
        dataIndex: 'stockGgxh',
        key: 'stockGgxh',
        align: 'left',ellipsis: true,
      },
      {
        title: '主计量',
        dataIndex: 'unitName',
        key: 'unitName',
        align: 'center',ellipsis: true,
      },
      {
        title: '计量1',
        dataIndex: 'unitName1',
        key: 'unitName1',
        align: 'left',ellipsis: true,
      },
      {
        title: '计量2',
        dataIndex: 'unitName2',
        key: 'unitName2',
        align: 'left',ellipsis: true,
      },
      {
        title: '期初结存',
        dataIndex: 'qichu',
        children: [
          {
            title: '主数量',
            dataIndex: 'qichu',
            key: '6-1',
            align: 'right',
          },
          {
            title: '数量1',
            dataIndex: 'qichu1',
            key: '6-2',
            align: 'right',
          },
          {
            title: '数量2',
            dataIndex: 'qichu2',
            key: '6-3',
            align: 'right',
          }
        ],
      },
      {
        title: '本期入库',
        dataIndex: 'rk',
        children: [
          {
            title: '主数量',
            dataIndex: 'rk',
            key: '7-1',
            align: 'right',
          },
          {
            title: '数量1',
            dataIndex: 'rk1',
            key: '7-2',
            align: 'right',
          },
          {
            title: '数量2',
            dataIndex: 'rk2',
            key: '7-3',
            align: 'right',
          }
        ],
      },
      {
        title: '本期出库',
        dataIndex: 'ck',
        children: [
          {
            title: '主数量',
            dataIndex: 'ck',
            key: '8-1',
            align: 'right',
          },
          {
            title: '数量1',
            dataIndex: 'ck1',
            key: '8-2',
            align: 'right',
          },
          {
            title: '数量2',
            dataIndex: 'ck2',
            key: '8-3',
            align: 'right',
          }
        ],
      },
      {
        title: '期末结存',
        dataIndex: 'qimo',
        children: [
          {
            title: '主数量',
            dataIndex: 'qimo',
            key: '9-1',
            align: 'right',
          },
          {
            title: '数量1',
            dataIndex: 'qimo1',
            key: '9-2',
            align: 'right',
          },
          {
            title: '数量2',
            dataIndex: 'qimo2',
            key: '9-3',
            align: 'right',
          }
        ],
      },
    ],
  }),
  getters: {
    getColumns: (state) => () => {
      return state.J
    },
  },
  actions: {

  }
});

// Need to be used outside the setup
export function useGlStoreWidthOut() {
  return kcXCLStore666(store);
}

