import {defineStore} from 'pinia';
import {store} from '/@/store';

export const huizongGlStore = defineStore({
  id: 'huizongGlStore',
  state: (): any => ({
    J:[
      {
        title: '科目类别',
        dataIndex: 'cclass',
        key: 'cclass',
        align: 'left',
      },
      {
        title: '科目编码',
        dataIndex: 'ccode',
        key: 'ccode',
        align: 'left',
      },
      {
        title: '科目名称',
        dataIndex: 'ccodeName',
        key: 'ccodeName',
        align: 'left',
      },
      {
        title: '借方发生',
        dataIndex: 'md',
        key: 'md',
        align: 'right',
        slots: { customRender: 'md' },
      },
      {
        title: '贷方发生',
        dataIndex: 'mc',
        key: 'mc',
        align: 'right',
        slots: { customRender: 'mc' },
      }
    ],
    SJ: [
      {
        title: '科目类别',
        dataIndex: 'cclass',
        key: 'cclass',
        align: 'left',
      },
      {
        title: '科目编码',
        dataIndex: 'ccode',
        key: 'ccode',
        align: 'left',
      },
      {
        title: '科目名称',
        dataIndex: 'ccodeName',
        key: 'ccodeName',
        align: 'left',
      },
      {
        title: '计量单位',
        dataIndex: 'unitMeasurement',
        key: 'unitMeasurement',
        fixed: '',
        align: 'center',
      },
      {
        title: '借方发生',
        key: 'md',
        dataIndex: 'md',
        children: [
          {
            title: '数量',
            dataIndex: 'ndS',
            key: '4-1',
            align: 'right',
            slots: { customRender: 'ndS' },
          },
          {
            title: '本币',
            dataIndex: 'md',
            key: '4-2',
            align: 'right',
            slots: { customRender: 'md' },
          }
        ],
      },
      {
        title: '贷方发生',
        key: 'mc',
        dataIndex: 'mc',
        children: [
          {
            title: '数量',
            dataIndex: 'ncS',
            key: '5-1',
            align: 'right',
            slots: { customRender: 'ncS' },
          },
          {
            title: '本币',
            dataIndex: 'mc',
            key: '5-2',
            align: 'right',
            slots: { customRender: 'mc' },
          }
        ],
      }
    ],
    WJ: [
      {
        title: '科目类别',
        dataIndex: 'cclass',
        key: 'cclass',
        align: 'left',
      },
      {
        title: '科目编码',
        dataIndex: 'ccode',
        key: 'ccode',
        align: 'left',
      },
      {
        title: '科目名称',
        dataIndex: 'ccodeName',
        key: 'ccodeName',
        align: 'left',
      },
      {
        title: '外币名称',
        dataIndex: 'foreignCurrency',
        key: 'foreignCurrency',
        fixed: '',
        align: 'center',
      },
      {
        title: '借方发生',
        dataIndex: 'md',
        children: [
          {
            title: '原币金额',
            dataIndex: 'nfrat_md',
            key: '4-1',
            align: 'right',
            slots: { customRender: 'nfrat_md' },
          },
          {
            title: '本币',
            dataIndex: 'md',
            key: '4-2',
            align: 'right',
            slots: { customRender: 'md' },
          }
        ],
      },
      {
        title: '贷方发生',
        dataIndex: 'mc',
        children: [
          {
            title: '原币金额',
            dataIndex: 'nfrat_mc',
            key: '5-1',
            align: 'right',
            slots: { customRender: 'nfrat_mc' },
          },
          {
            title: '本币',
            dataIndex: 'mc',
            key: '5-2',
            align: 'right',
            slots: { customRender: 'mc' },
          }
        ],
      }
    ],
    SWJ: [
      {
        title: '科目类别',
        dataIndex: 'cclass',
        key: 'cclass',
        align: 'left',
      },
      {
        title: '科目编码',
        dataIndex: 'ccode',
        key: 'ccode',
        align: 'left',
      },
      {
        title: '科目名称',
        dataIndex: 'ccodeName',
        key: 'ccodeName',
        align: 'left',
      },
      {
        title: '计量单位',
        dataIndex: 'unitMeasurement',
        key: 'unitMeasurement',
        fixed: '',
        align: 'center',
      },
      {
        title: '外币名称',
        dataIndex: 'foreignCurrency',
        key: 'foreignCurrency',
        fixed: '',
        align: 'center',
      },
      {
        title: '借方发生',
        dataIndex: 'md',
        children: [
          {
            title: '数量',
            dataIndex: 'ndS',
            key: '5-1',
            align: 'right',
            slots: { customRender: 'ndS' },
          },
          {
            title: '原币金额',
            dataIndex: 'nfrat_md',
            key: '5-2',
            align: 'right',
            slots: { customRender: 'nfrat_md' },
          },
          {
            title: '本币',
            dataIndex: 'yue',
            key: '5-3',
            align: 'right',
            slots: { customRender: 'md' },
          }
        ],
      },
      {
        title: '贷方发生',
        dataIndex: 'mc',
        children: [
          {
            title: '数量',
            dataIndex: 'ncS',
            key: '6-1',
            align: 'right',
            slots: { customRender: 'ncS' },
          },
          {
            title: '原币金额',
            dataIndex: 'nfrat_mc',
            key: '6-2',
            align: 'right',
            slots: { customRender: 'nfrat_mc' },
          },
          {
            title: '本币金额',
            dataIndex: 'yue',
            key: '6-3',
            align: 'right',
            slots: { customRender: 'mc' },
          }
        ],
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

export function useGlStoreWidthOut() {
  return huizongGlStore(store);
}

