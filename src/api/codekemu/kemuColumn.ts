import {defineStore} from 'pinia';
import {store} from '/@/store';

export const kemuGlStore = defineStore({
  id: 'kemuGlStore',
  state: (): any => ({
    J:[
      {
        title: '状态',
        dataIndex: 'flag',
        slots: { customRender: 'flag' },
        width: 100,fixed: 'left'
      },
      {
        title: '科目级次',
        dataIndex: 'igrade',
        width: 100,fixed: 'left'
      },
      {
        title: '科目编码',
        align: 'left',
        dataIndex: 'ccode',
        slots: { customRender: 'ccode' },
        width: 100,fixed: 'left'
      },
      {
        title: '科目名称',
        dataIndex: 'ccodeName',
        align: 'left',
        slots: { customRender: 'ccodeName' },
        width: 100,fixed: 'left',ellipsis: true
      },{
        title: '科目类型',
        dataIndex: 'cclass',
      },
      {
        title: '方向',
        dataIndex: 'bprogerty',
        slots: { customRender: 'bprogerty' },
        width: 100,
      },
      {
        title: '辅助核算项',
        dataIndex: 'fuzhu',
      },
      {
        title: '现金账',
        dataIndex: 'bcash',
        slots: { customRender: 'bcash' },
      },
      {
        title: '银行账',
        dataIndex: 'bbank',
        slots: { customRender: 'bbank' },
        
      },
      {
        title: '日记账',
        dataIndex: 'bdaybook',
        slots: { customRender: 'bdaybook' },
      },
      // {
      //   title: '数量核算',
      //   dataIndex: 'bnum',
      //   slots: { customRender: 'bnum' },
      // },
      {
        title: '数量/单位',
        dataIndex: 'menterage',
      },
      // {
      //   title: '外币核算',
      //   dataIndex: 'currency',
      //   slots: { customRender: 'currency' },
      // },
      {
        title: '外币/名称',
        dataIndex: 'currencyType',
        slots: { customRender: 'currencyType' },
      },
      {
        title: '下级控制',
        dataIndex: 'lowerControl',
        slots: { customRender: 'lowerControl' },
        defaultHidden:true
      },
      {
        title: '辅助控制',
        dataIndex: 'fuzhuControl',
        slots: { customRender: 'fuzhuControl' },
        defaultHidden:true
      },

    ]
  }),
  getters: {
    getColumns: (state) => (value,flag) => {
      if(value == 'J'){
        // state.J.filter(s=>s.title==='累计发生')[0]['defaultHidden']=!flag
        return state.J
      }
    },
  },
  actions: {

  }
});

// Need to be used outside the setup
export function useGlStoreWidthOut() {
  return kemuGlStore(store);
}

