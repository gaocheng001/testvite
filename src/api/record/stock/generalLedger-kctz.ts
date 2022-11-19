import {defineStore} from 'pinia';
// @ts-ignore
import {store} from '/@/store';

export const chtzStore = defineStore({
  id: 'chtzStore',
  state: (): any => ({
    J:[
      {
        title: '单据状态',
        dataIndex: 'bcheck',
        key: '0',
        ellipsis: true,
        slots: { customRender: 'bcheck' },
        fixed: 'left'
      },
      {
        title: '单据日期',
        dataIndex: 'ddate',
        key: '1',
        ellipsis: true,
        slots: { customRender: 'ddate' },
        fixed: 'left'
      },
      {
        title: '单据类型',
        dataIndex: 'billStyle',
        key: '2',
        ellipsis: true,
        slots: { customRender: 'billStyle' },
        fixed: 'left'
      },
      {
        title: '单据编号',
        dataIndex: 'ccode',
        key: '3',
        ellipsis: true,
        slots: { customRender: 'ccode' },
        fixed: 'left'
      },
      {
        title: '往来单位',
        dataIndex: 'comcode',
        key: '4',
        ellipsis: true,
        slots: { customRender: 'comcode' },
      },
      {
        title: '项目',
        dataIndex: 'citemcode',
        key: '5',
        ellipsis: true,
        slots: { customRender: 'citemcode' },
      },
      /*{
        title: '批号',
        dataIndex: 'batchId',
        key: '6',
        ellipsis: true,
        slots: { customRender: 'batchId' },
      },
      {
        title: '生效日期',
        dataIndex: 'dpdate',
        key: '7',
        ellipsis: true,
        slots: { customRender: 'dpdate' },
      },
      {
        title: '失效日期',
        dataIndex: 'dvdate',
        key: '8',
        ellipsis: true,
        slots: { customRender: 'dvdate' },
      },*/
      {
        title: '收入',
        dataIndex: 'shouru',
        key: '6',
        children: [
          {
            title: '主数量',
            dataIndex: 'bq',
            key: '6-1',
            align: 'right',
            slots: { customRender: 'bq' },
          }
        ],
      },
      {
        title: '发出',
        dataIndex: 'fachu',
        key: '7',
        children: [
          {
            title: '主数量',
            dataIndex: 'bq1',
            key: '7-1',
            align: 'right',
            slots: { customRender: 'bq1' },
          }
        ],
      },
      {
        title: '结存',
        dataIndex: 'jiecun',
        key: '8',
        children: [
          {
            title: '主数量',
            dataIndex: 'bq2',
            key: '8-1',
            align: 'right',
            slots: { customRender: 'bq2' },
          }
        ],
      },
    ],
    SJ: [
      {
        title: '单据状态',
        dataIndex: 'bcheck',
        key: '0',
        ellipsis: true,
        fixed: 'left',
        slots: { customRender: 'bcheck' },
      },
      {
        title: '单据日期',
        dataIndex: 'ddate',
        key: '1',
        ellipsis: true,
        slots: { customRender: 'ddate' },
        fixed: 'left'
      },
      {
        title: '单据类型',
        dataIndex: 'billStyle',
        key: '2',
        ellipsis: true,
        slots: { customRender: 'billStyle' },
        fixed: 'left'
      },
      {
        title: '单据编号',
        dataIndex: 'ccode',
        key: '3',
        ellipsis: true,
        slots: { customRender: 'ccode' },
        fixed: 'left'
      },
      {
        title: '往来单位',
        dataIndex: 'comcode',
        key: '4',
        ellipsis: true,
        slots: { customRender: 'comcode' },
      },
      {
        title: '项目',
        dataIndex: 'citemcode',
        key: '5',
        ellipsis: true,
        slots: { customRender: 'citemcode' },
      },
     /* {
        title: '批号',
        dataIndex: 'batchId',
        key: '6',
        ellipsis: true,
        slots: { customRender: 'batchId' },
      },
      {
        title: '生效日期',
        dataIndex: 'dpdate',
        key: '7',
        ellipsis: true,
        slots: { customRender: 'dpdate' },
      },
      {
        title: '失效日期',
        dataIndex: 'dvdate',
        key: '8',
        ellipsis: true,
        slots: { customRender: 'dvdate' },
      },*/
      {
        title: '收入',
        dataIndex: 'shouru',
        key: '6',
        children: [
          {
            title: '主数量',
            dataIndex: 'bq',
            key: '6-1',
            align: 'right',
            slots: { customRender: 'bq' },
          },
          {
            title: '单价',
            dataIndex: 'price',
            key: '6-2',
            align: 'right',
            slots: { customRender: 'price' },
          },
          {
            title: '金额',
            dataIndex: 'icost',
            key: '6-3',
            align: 'right',
            slots: { customRender: 'icost' },
          }
        ],
      },
      {
        title: '发出',
        dataIndex: 'fachu',
        key: '7',
        children: [
          {
            title: '主数量',
            dataIndex: 'bq1',
            key: '7-1',
            align: 'right',
            slots: { customRender: 'bq1' },
          },
          {
            title: '单价',
            dataIndex: 'price1',
            key: '7-2',
            align: 'right',
            slots: { customRender: 'price1' },
          },
          {
            title: '金额',
            dataIndex: 'icost1',
            key: '7-3',
            align: 'right',
            slots: { customRender: 'icost1' },
          }
        ],
      },
      {
        title: '结存',
        dataIndex: 'jiecun',
        key: '8',
        children: [
          {
            title: '主数量',
            dataIndex: 'bq2',
            key: '8-1',
            align: 'right',
            slots: { customRender: 'bq2' },
          },
          {
            title: '单价',
            dataIndex: 'price2',
            key: '8-2',
            align: 'right',
            slots: { customRender: 'price2' },
          },
          {
            title: '金额',
            dataIndex: 'icost2',
            key: '8-3',
            align: 'right',
            slots: { customRender: 'icost2' },
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
export function usechtzStoreWidthOut() {
  return chtzStore(store);
}

