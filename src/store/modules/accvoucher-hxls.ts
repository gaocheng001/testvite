import {defineStore} from 'pinia';
import {store} from '/@/store';


export const useHxhistoryStore = defineStore({
  id: 'useHxhistory',
  state: (): any => ({
    columns: [
      {
        title: '序号',
        width: '60px',
        fixed: 'left',
        dataIndex: 'cdfine30',
        slots: {customRender: 'cdfine30'}
      },
      {
        title: '核销日期',
        dataIndex: 'hxdate',
        width: '100px',
      },
      {
        title: '制单日期',
        dataIndex: 'dbillDate',
        width: '100px',
      },
      {
        title: '凭证字号',
        dataIndex: 'inoId',
        width: '60px'
        , slots: {customRender: 'csignAndInoId'}
      },
      {

        title: '摘要',
        dataIndex: 'cdigest',
        ellipsis: true,
        width: '180px'
        , align: 'left'
      },
      {
        title: '往来单位简称',
        dataIndex: 'custname',
        width: '150px',
        ifShow: true
      },
      {
        title: '借方核销金额',
        dataIndex: 'jmoney',
        width: '120px',
        ellipsis: true,
        slots: {customRender: 'jmoney'}
      },
      {
        title: '贷方核销金额',
        dataIndex: 'dmoney',
        width: '120px',
        ellipsis: true,
        slots: {customRender: 'dmoney'}
      },
      {
        title: '核销人',
        dataIndex: 'username',
        width: '60px',
        ellipsis: true,
        slots: {customRender: 'username'}
      },
      {
        title: '核销标记号',
        dataIndex: 'hxcode',
        width: '60px',
        ellipsis: true,
        slots: {customRender: 'hxcode'}
      },

    ],
  }),
  getters: {
    getColumns: (state) => (value) => {
      return value == '1'?state.columns:state.columns2
    },
  },
  actions: {

  }
});

// Need to be used outside the setup
export function useAccvoucherStoreWidthOut() {
  return useHxhistoryStore(store);
}

