import {defineStore} from 'pinia';
// @ts-ignore
import {store} from '/@/store';

export const kcPcXCLStore = defineStore({
  id: 'kcPcXCLStore',
  state: (): any => ({
    J:[
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
            key: '7-1',
            align: 'right',slots: { customRender: 'baseQuantity' }
          },
          {
            title: '数量1',
            dataIndex: 'subQuantity1',
            key: '7-2',
            align: 'right',slots: { customRender: 'subQuantity1' }
          },
          {
            title: '数量2',
            dataIndex: 'subQuantity2',
            key: '7-3',
            align: 'right',slots: { customRender: 'subQuantity2' }
          }
        ],
      },
      {
        title: '可用量',
        dataIndex: 'keyong',
        children: [
          {
            title: '主数量',
            dataIndex: 'keyong',
            key: '8-1',
            align: 'right',slots: { customRender: 'keyong' }
          },
          {
            title: '数量1',
            dataIndex: 'keyong1',
            key: '8-2',
            align: 'right',slots: { customRender: 'keyong1' }
          },
          {
            title: '数量2',
            dataIndex: 'keyong2',
            key: '8-3',
            align: 'right',slots: { customRender: 'keyong2' }
          }
        ],
      },
      {
        title: '在途采购到货',
        dataIndex: 'ztrkQuantityCgdh',
        children: [
          {
            title: '主数量',
            dataIndex: 'ztrkQuantityCgdh',
            key: '9-1',
            align: 'right',width: 100,ellipsis: true,slots: { customRender: 'ztrkQuantityCgdh' }
          },
          {
            title: '数量1',
            dataIndex: 'cgdh1',
            key: '9-2',
            align: 'right',width: 100,ellipsis: true,slots: { customRender: 'cgdh1' }
          },
          {
            title: '数量2',
            dataIndex: 'cgdh2',
            key: '9-3',
            align: 'right',width: 100,ellipsis: true,slots: { customRender: 'cgdh2' }
          }
        ],
      },
      {
        title: '在途采购(其他)入库',
        dataIndex: 'ztrkQuantityCgrk',
        children: [
          {
            title: '主数量',
            dataIndex: 'ztrkQuantityCgrk',
            key: '10-1',
            align: 'right',width: 100,ellipsis: true,slots: { customRender: 'ztrkQuantityCgrk' }
          },
          {
            title: '数量1',
            dataIndex: 'cgrk1',
            key: '10-2',
            align: 'right',width: 100,ellipsis: true,slots: { customRender: 'cgrk1' }
          },
          {
            title: '数量2',
            dataIndex: 'cgrk2',
            key: '10-3',
            align: 'right',width: 100,ellipsis: true,slots: { customRender: 'cgrk2' }
          }
        ],
      },
      {
        title: '在途销售发货',
        dataIndex: 'ztckQuantityXhd',
        children: [
          {
            title: '主数量',
            dataIndex: 'ztckQuantityXhd',
            key: '11-1',
            align: 'right',width: 100,ellipsis: true,slots: { customRender: 'ztckQuantityXhd' }
          },
          {
            title: '数量1',
            dataIndex: 'xhd1',
            key: '11-2',
            align: 'right',width: 100,ellipsis: true,slots: { customRender: 'xhd1' }
          },
          {
            title: '数量2',
            dataIndex: 'xhd2',
            key: '11-3',
            align: 'right',width: 100,ellipsis: true,slots: { customRender: 'xhd2' }
          }
        ],
      },
      {
        title: '在途销售(其他)出库',
        dataIndex: 'ztrkQuantityQtck',
        children: [
          {
            title: '主数量',
            dataIndex: 'ztrkQuantityQtck',
            key: '12-1',
            align: 'right',width: 100,ellipsis: true,slots: { customRender: 'ztrkQuantityQtck' }
          },
          {
            title: '数量1',
            dataIndex: 'qtck1',
            key: '12-2',
            align: 'right',width: 100,ellipsis: true,slots: { customRender: 'qtck1' }
          },
          {
            title: '数量2',
            dataIndex: 'qtck2',
            key: '12-3',
            align: 'right',width: 100,ellipsis: true,slots: { customRender: 'qtck2' }
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
  return kcPcXCLStore(store);
}

