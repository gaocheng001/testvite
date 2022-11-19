import {defineStore} from 'pinia';
import {store} from '/@/store';

export const mxGlStore = defineStore({
  id: 'mxGlStore',
  state: (): any => ({
    J:[
      {
        title: '科目编码',
        dataIndex: 'ccode',
        key: 'ccode',
        align: 'left',
        defaultHidden: true,
        slots: { customRender: 'ccode' },
        width: 100,fixed: 'left'
      },
      {
        title: '科目名称',
        dataIndex: 'ccodeName',
        key: 'ccodeName',
        align: 'left',defaultHidden: true,
        slots: { customRender: 'ccodeName' },
        width: 100,fixed: 'left'
      },
      {
        title: '期间',
        dataIndex: 'dbillDate',
        key: 'dbillDate',
        align: 'center',width: 100,fixed: 'left'
      },
      {
        title: '凭证号',
        dataIndex: 'inoId',
        key: 'inoId',
        align: 'center',width: 100,fixed: 'left'
      },

      {
        title: '摘要',
        dataIndex: 'cdigest',
        key: 'cdigest',
        align: 'center',width: 100,fixed: 'left'
      },
      {
        title: '借方',
        dataIndex: 'md',
        key: 'md',
        align: 'right',
        slots: { customRender: 'md' },
      },
      {
        title: '贷方',
        dataIndex: 'mc',
        key: 'mc',
        align: 'right',
        slots: { customRender: 'mc' },
      },
      {
        title: '方向',
        dataIndex: 'bprogerty',
        key: 'bprogerty',
        align: 'center',
      },
      {
        title: '余额',
          dataIndex: 'yue',
        key: 'yue',
        align: 'right',
        slots: { customRender: 'yue' },
      }
    ],
    SJ: [
      {
        title: '科目编码',
        dataIndex: 'ccode',
        key: 'ccode',
        align: 'left',
        defaultHidden: true,
        slots: { customRender: 'ccode' },
        width: 100,fixed: 'left'
      },
      {
        title: '科目名称',
        dataIndex: 'ccodeName',
        key: 'ccodeName',
        align: 'left',defaultHidden: true,
        slots: { customRender: 'ccodeName' },
        width: 100,fixed: 'left'
      },
      {
        title: '期间',
        dataIndex: 'dbillDate',
        key: 'dbillDate',
        align: 'center',width: 100,fixed: 'left'
      },
      {
        title: '凭证号',
        dataIndex: 'inoId',
        key: 'inoId',
        align: 'center',width: 100,fixed: 'left'
      },

      {
        title: '摘要',
        dataIndex: 'cdigest',
        key: 'cdigest',
        align: 'center',width: 100,fixed: 'left'
      },
      {
        title: '计量单位',
        dataIndex: 'unitMeasurement',
        key: 'unitMeasurement',
        fixed: '',
        align: 'center',
      },
      {
        title: '借方',
        key: 'md',
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
            title: '本币金额',
            dataIndex: 'md',
            key: '5-2',
            align: 'right',
            slots: { customRender: 'md' },
          }
        ],
      },
      {
        title: '贷方',
        key: 'mc',
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
            title: '本币金额',
            dataIndex: 'mc',
            key: '6-2',
            align: 'right',
            slots: { customRender: 'mc' },
          }
        ],
      },
      {
        title: '方向',
        dataIndex: 'bprogerty',
        key: 'bprogerty',
        align: 'center',
      },
      {
        title: '余额',
        dataIndex: 'ye',
        key: 'ye',
        children: [
          {
            title: '数量',
            dataIndex: 'yue_num',
            key: '8-1',
            align: 'right',
            slots: { customRender: 'yue_num' },
          },
          {
            title: '本币金额',
            dataIndex: 'yue',
            key: '8-2',
            align: 'right',
            slots: { customRender: 'yue' },
          }
        ],
      }
    ],
    WJ: [
      {
        title: '科目编码',
        dataIndex: 'ccode',
        key: 'ccode',
        align: 'left',
        defaultHidden: true,
        slots: { customRender: 'ccode' },
        width: 100,fixed: 'left'
      },
      {
        title: '科目名称',
        dataIndex: 'ccodeName',
        key: 'ccodeName',
        align: 'left',defaultHidden: true,
        slots: { customRender: 'ccodeName' },
        width: 100,fixed: 'left'
      },
      {
        title: '期间',
        dataIndex: 'dbillDate',
        key: 'dbillDate',
        align: 'center',width: 100,fixed: 'left'
      },
      {
        title: '凭证号',
        dataIndex: 'inoId',
        key: 'inoId',
        align: 'center',width: 100,fixed: 'left'
      },

      {
        title: '摘要',
        dataIndex: 'cdigest',
        key: 'cdigest',
        align: 'center',width: 100,fixed: 'left'
      },
      {
        title: '外币名称',
        dataIndex: 'foreignCurrency',
        key: 'foreignCurrency',
        fixed: '',
        align: 'center',
      },
      {
        title: '借方',
        dataIndex: 'md',
        children: [
          {
            title: '原币金额',
            dataIndex: 'nfrat_md',
            key: '5-1',
            align: 'right',
            slots: { customRender: 'nfrat_md' },
          },
          {
            title: '本币金额',
            dataIndex: 'md',
            key: '5-2',
            align: 'right',
            slots: { customRender: 'md' },
          }
        ],
      },
      {
        title: '贷方',
        dataIndex: 'mc',
        children: [
          {
            title: '原币金额',
            dataIndex: 'nfrat_mc',
            key: '6-1',
            align: 'right',
            slots: { customRender: 'nfrat_mc' },
          },
          {
            title: '本币金额',
            dataIndex: 'mc',
            key: '6-2',
            align: 'right',
            slots: { customRender: 'mc' },
          }
        ],
      },
      {
        title: '方向',
        dataIndex: 'bprogerty',
        key: 'bprogerty',
        align: 'center',
      },
      {
        title: '余额',
        dataIndex: 'yue',
        children: [
          {
            title: '原币金额',
            dataIndex: 'yue_nfrat',
            key: '8-1',
            align: 'right',
            slots: { customRender: 'yue_nfrat' },
          },
          {
            title: '本币金额',
            dataIndex: 'yue',
            key: '8-2',
            align: 'right',
            slots: { customRender: 'yue' },
          }
        ],
      }
    ],
    SWJ: [
      {
        title: '科目编码',
        dataIndex: 'ccode',
        key: 'ccode',
        align: 'left',
        defaultHidden: true,
        slots: { customRender: 'ccode' },
        width: 100,fixed: 'left'
      },
      {
        title: '科目名称',
        dataIndex: 'ccodeName',
        key: 'ccodeName',
        align: 'left',defaultHidden: true,
        slots: { customRender: 'ccodeName' },
        width: 100,fixed: 'left'
      },
      {
        title: '期间',
        dataIndex: 'dbillDate',
        key: 'dbillDate',
        align: 'center',width: 100,fixed: 'left'
      },
      {
        title: '凭证号',
        dataIndex: 'inoId',
        key: 'inoId',
        align: 'center',width: 100,fixed: 'left'
      },

      {
        title: '摘要',
        dataIndex: 'cdigest',
        key: 'cdigest',
        align: 'center',width: 100,fixed: 'left'
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
        title: '借方',
        dataIndex: 'md',
        children: [
          {
            title: '数量',
            dataIndex: 'ndS',
            key: '6-1',
            align: 'right',
            slots: { customRender: 'ndS' },
          },
          {
            title: '原币金额',
            dataIndex: 'nfrat_md',
            key: '6-2',
            align: 'right',
            slots: { customRender: 'nfrat_md' },
          },
          {
            title: '本币金额',
            dataIndex: 'yue',
            key: '6-3',
            align: 'right',
            slots: { customRender: 'yue' },
          }
        ],
      },
      {
        title: '贷方',
        dataIndex: 'mc',
        children: [
          {
            title: '数量',
            dataIndex: 'ncS',
            key: '7-1',
            align: 'right',
            slots: { customRender: 'ncS' },
          },
          {
            title: '原币金额',
            dataIndex: 'nfrat_mc',
            key: '7-2',
            align: 'right',
            slots: { customRender: 'nfrat_mc' },
          },
          {
            title: '本币金额',
            dataIndex: 'yue',
            key: '7-3',
            align: 'right',
            slots: { customRender: 'yue' },
          }
        ],
      },
      {
        title: '方向',
        dataIndex: 'bprogerty',
        key: 'bprogerty',
        align: 'center',
      },
      {
        title: '余额',
        dataIndex: 'ye',
        children: [
          {
            title: '数量',
            dataIndex: 'yue_num',
            key: '9-1',
            align: 'right',
            slots: { customRender: 'yue_num' },
          },
          {
            title: '原币金额',
            dataIndex: 'yue_nfrat',
            key: '9-2',
            align: 'right',
            slots: { customRender: 'yue_nfrat' },
          },
          {
            title: '本币金额',
            dataIndex: 'yue',
            key: '9-3',
            align: 'right',
            slots: { customRender: 'yue' },
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

// Need to be used outside the setup
export function useGlStoreWidthOut() {
  return mxGlStore(store);
}

