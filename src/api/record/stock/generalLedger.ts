import {defineStore} from 'pinia';
// @ts-ignore
import {store} from '/@/store';

export const ktzcStore = defineStore({
  id: 'ktzcStore',
  state: (): any => ({
    J:[
      {
        title: '单据日期',
        dataIndex: 'ddate',
        key: '0',
        ellipsis: true,
        slots: { customRender: 'ddate' },
        fixed: 'left'
      },
      {
        title: '单据类型',
        dataIndex: 'billStyle',
        key: '1',
        ellipsis: true,
        slots: { customRender: 'billStyle' },
        fixed: 'left'
      },
      {
        title: '单据编号',
        dataIndex: 'ccode',
        key: '2',
        ellipsis: true,
        slots: { customRender: 'ccode' },
        fixed: 'left'
      },
      {
        title: '存储位置',
        dataIndex: 'address',
        key: '3',
        ellipsis: true,
        slots: { customRender: 'address' },
      },
      {
        title: '业务类型',
        dataIndex: 'bstyle',
        key: '4',
        ellipsis: true,
        slots: { customRender: 'bstyle' },
      },
      {
        title: '往来单位',
        dataIndex: 'cvencode',
        key: '5',
        ellipsis: true,
        slots: { customRender: 'cvencode' },
      },
      {
        title: '项目',
        dataIndex: 'citemCode',
        key: '6',
        ellipsis: true,
        slots: { customRender: 'citemCode' },
      },
      {
        title: '批号',
        dataIndex: 'batchId',
        key: '7',
        ellipsis: true,
        slots: { customRender: 'batchId' },
      },
      {
        title: '生产日期',
        dataIndex: 'dpdate',
        key: '8',
        ellipsis: true,
        slots: { customRender: 'dpdate' },
      },
      {
        title: '失效日期',
        dataIndex: 'dvdate',
        key: '9',
        ellipsis: true,
        slots: { customRender: 'dvdate' },
      },
      {
        title: '收入',
        dataIndex: 'shouru',
        key: '10',
        children: [
          {
            title: '主数量',
            dataIndex: 'baseQuantity',
            key: '10-1',
            align: 'right',
            slots: { customRender: 'baseQuantity' },
          }
        ],
      },
      {
        title: '发出',
        dataIndex: 'fachu',
        key: '11',
        children: [
          {
            title: '主数量',
            dataIndex: 'baseQuantity1',
            key: '11-1',
            align: 'right',
            slots: { customRender: 'baseQuantity1' },
          }
        ],
      },
      {
        title: '结存',
        dataIndex: 'jiecun',
        key: '12',
        children: [
          {
            title: '主数量',
            dataIndex: 'baseQuantity2',
            key: '12-1',
            align: 'right',
            slots: { customRender: 'baseQuantity2' },
          }
        ],
      },
    ],
    SJ: [
      {
        title: '单据日期',
        dataIndex: 'ddate',
        key: '0',
        ellipsis: true,
        slots: { customRender: 'ddate' },
        fixed: 'left'
      },
      {
        title: '单据类型',
        dataIndex: 'billStyle',
        key: '1',
        ellipsis: true,
        slots: { customRender: 'billStyle' },
        fixed: 'left'
      },
      {
        title: '单据编号',
        dataIndex: 'ccode',
        key: '2',
        ellipsis: true,
        slots: { customRender: 'ccode' },
        fixed: 'left'
      },
      {
        title: '存储位置',
        dataIndex: 'address',
        key: '3',
        ellipsis: true,
        slots: { customRender: 'address' },
      },
      {
        title: '业务类型',
        dataIndex: 'bstyle',
        key: '4',
        ellipsis: true,
        slots: { customRender: 'bstyle' },
      },
      {
        title: '往来单位',
        dataIndex: 'cvencode',
        key: '5',
        ellipsis: true,
        slots: { customRender: 'cvencode' },
      },
      {
        title: '项目',
        dataIndex: 'citemCode',
        key: '6',
        ellipsis: true,
        slots: { customRender: 'citemCode' },
      },
      {
        title: '批号',
        dataIndex: 'batchId',
        key: '7',
        ellipsis: true,
        slots: { customRender: 'batchId' },
      },
      {
        title: '生产日期',
        dataIndex: 'dpdate',
        key: '8',
        ellipsis: true,
        slots: { customRender: 'dpdate' },
      },
      {
        title: '失效日期',
        dataIndex: 'dvdate',
        key: '9',
        ellipsis: true,
        slots: { customRender: 'dvdate' },
      },
      {
        title: '收入',
        dataIndex: 'shouru',
        key: '10',
        children: [
          {
            title: '主数量',
            dataIndex: 'baseQuantity',
            key: '10-1',
            align: 'right',
            slots: { customRender: 'baseQuantity' },
          },
          {
            title: '单价',
            dataIndex: 'price',
            key: '10-2',
            align: 'right',
            slots: { customRender: 'price' },
          },
          {
            title: '金额',
            dataIndex: 'isum',
            key: '10-3',
            align: 'right',
            slots: { customRender: 'isum' },
          }
        ],
      },
      {
        title: '发出',
        dataIndex: 'fachu',
        key: '11',
        children: [
          {
            title: '主数量',
            dataIndex: 'baseQuantity1',
            key: '11-1',
            align: 'right',
            slots: { customRender: 'baseQuantity1' },
          },
          {
            title: '单价',
            dataIndex: 'price1',
            key: '11-2',
            align: 'right',
            slots: { customRender: 'price1' },
          },
          {
            title: '金额',
            dataIndex: 'isum1',
            key: '11-3',
            align: 'right',
            slots: { customRender: 'isum1' },
          }
        ],
      },
      {
        title: '结存',
        dataIndex: 'jiecun',
        key: '12',
        children: [
          {
            title: '主数量',
            dataIndex: 'baseQuantity2',
            key: '12-1',
            align: 'right',
            slots: { customRender: 'baseQuantity2' },
          },
          {
            title: '单价',
            dataIndex: 'price2',
            key: '12-2',
            align: 'right',
            slots: { customRender: 'price2' },
          },
          {
            title: '金额',
            dataIndex: 'isum2',
            key: '12-3',
            align: 'right',
            slots: { customRender: 'isum2' },
          }
        ],
      },
    ],
  }),
  getters: {
    getColumns: (state) => (value) => {
      /*if(value == 'J'){
        state.J.filter(s=>s.title==='累计发生')[0]['defaultHidden']=!flag
        return state.J
      }else  if(value == 'SJ'){
        state.SJ.filter(s=>s.title==='累计发生')[0]['defaultHidden']=!flag
        return state.SJ
      }*/
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

