import {defineStore} from 'pinia';
// @ts-ignore
import {store} from '/@/store';

export const kcWarningStore = defineStore({
  id: 'kcWarningStore',
  state: (): any => ({
    J:[
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        align: 'left',ellipsis: true,
        width: 100,fixed: 'left',slots: { customRender: 'state' }
      },{
        title: '临近天数',
        dataIndex: 'days',
        key: 'days',
        align: 'left',ellipsis: true,
        width: 100,fixed: 'left'
      },
      {
        title: '仓储位置',
        dataIndex: 'cwhcodeName',
        key: 'cwhcodeName',
        align: 'left',ellipsis: true,
        width: 100,fixed: 'left'
      },
      {
        title: '存货编码',
        dataIndex: 'stockNum',
        key: 'stockNum',
        align: 'left',ellipsis: true,
        width: 100,fixed: 'left'
      },
      {
        title: '存货名称',
        dataIndex: 'stockName',
        key: 'stockName',
        align: 'left',ellipsis: true,
        width: 100,fixed: 'left'
      },
      {
        title: '规格型号',
        dataIndex: 'stockGgxh',
        key: 'stockGgxh',
        align: 'left',ellipsis: true,
        width: 100,fixed: 'left'
      },
      {
        title: '主计量',
        dataIndex: 'stockUnitName',
        key: 'stockUnitName',
        align: 'center',
        width: 60,fixed: 'left'
      },
      {
        title: '计量1',
        dataIndex: 'stockUnitName1',
        key: 'stockUnitName1',
        align: 'center',
        width: 60,fixed: 'left'
      },
      {
        title: '计量2',
        dataIndex: 'stockUnitName2',
        key: 'stockUnitName2',
        align: 'center',
        width: 60,fixed: 'left'
      },
      {
        title: '批次',
        dataIndex: 'batchId',
        key: 'batchId',
        align: 'left',ellipsis: true,
        width: 100,fixed: 'left'
      },
      {
        title: '生产日期',
        dataIndex: 'dpdate',
        key: 'dpdate',
        align: 'left',
        width: 100,
      },
      {
        title: '失效日期',
        dataIndex: 'dvdate',
        key: 'dvdate',
        align: 'left',
        width: 100,
      },
      {
        title: '现存量',
        dataIndex: 'baseQuantity',
        children: [
          {
            title: '主数量',
            dataIndex: 'baseQuantity',
            key: '10-1',
            align: 'right',width: 100,ellipsis: true,slots: { customRender: 'baseQuantity' }
          },
          {
            title: '数量1',
            dataIndex: 'subQuantity1',
            key: '10-2',
            align: 'right',width: 100,ellipsis: true,slots: { customRender: 'subQuantity1' }
          },
          {
            title: '数量2',
            dataIndex: 'subQuantity2',
            key: '10-3',
            align: 'right',width: 100,ellipsis: true,slots: { customRender: 'subQuantity2' }
          }
        ],
      },
    ],
  }),
  getters: {
    getColumns: (state) => (value) => {
      if(value == 'J'){
        return state.J
      }
      return state.J
    },
  },
  actions: {

  }
});

// Need to be used outside the setup
export function useGlStoreWidthOut() {
  return kcWarningStore(store);
}

