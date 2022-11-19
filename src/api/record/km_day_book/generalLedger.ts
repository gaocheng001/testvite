import {defineStore} from 'pinia';
import {store} from '/@/store';

export const daybookGlStore = defineStore({
  id: 'daybookGlStore',
  state: (): any => ({
    J:[
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
        align: 'center',
      },
      {
        title: '凭证号',
        dataIndex: 'inoId',
        key: 'inoId',
        align: 'center',
      },
      {
        title: '期间',
        dataIndex: 'dbillDate',
        key: 'dbillDate',
        align: 'center',
      },
      {
        title: '摘要',
        dataIndex: 'cdigest',
        key: 'cdigest',
        align: 'center',
      },
      {
        title: '结算方式',
        dataIndex: 'pjCsettle',
        key: 'pjCsettle',
        align: 'center',
      },
      {
        title: '票据号',
        dataIndex: 'pjId',
        key: 'pjId',
        align: 'center',
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
        title: '序号',
        dataIndex: 'number',
        key: 'number',
        align: 'center',
      },
      {
        title: '凭证号',
        dataIndex: 'inoId',
        key: 'inoId',
        align: 'center',
      },
      {
        title: '期间',
        dataIndex: 'dbillDate',
        key: 'dbillDate',
        align: 'center',
      },
      {
        title: '摘要',
        dataIndex: 'cdigest',
        key: 'cdigest',
        align: 'center',
      },
      {
        title: '结算方式',
        dataIndex: 'pjCsettle',
        key: 'pjCsettle',
        align: 'center',
      },
      {
        title: '票据号',
        dataIndex: 'pjId',
        key: 'pjId',
        align: 'center',
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
            key: '7-1',
            align: 'right',
            slots: { customRender: 'ndS' },
          },
          {
            title: '本币金额',
            dataIndex: 'md',
            key: '7-2',
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
            key: '8-1',
            align: 'right',
            slots: { customRender: 'ncS' },
          },
          {
            title: '本币金额',
            dataIndex: 'mc',
            key: '8-2',
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
            key: '10-1',
            align: 'right',
            slots: { customRender: 'yue_num' },
          },
          {
            title: '本币金额',
            dataIndex: 'yue',
            key: '10-2',
            align: 'right',
            slots: { customRender: 'yue' },
          }
        ],
      }
    ],
    WJ: [
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
        align: 'center',
      },
      {
        title: '凭证号',
        dataIndex: 'inoId',
        key: 'inoId',
        align: 'center',
      },
      {
        title: '期间',
        dataIndex: 'dbillDate',
        key: 'dbillDate',
        align: 'center',
      },
      {
        title: '摘要',
        dataIndex: 'cdigest',
        key: 'cdigest',
        align: 'center',
      },
      {
        title: '结算方式',
        dataIndex: 'pjCsettle',
        key: 'pjCsettle',
        align: 'center',
      },
      {
        title: '票据号',
        dataIndex: 'pjId',
        key: 'pjId',
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
            title: '原币金额',
            dataIndex: 'nfrat_md',
            key: '7-1',
            align: 'right',
            slots: { customRender: 'nfrat_md' },
          },
          {
            title: '本币金额',
            dataIndex: 'md',
            key: '7-2',
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
            key: '8-1',
            align: 'right',
            slots: { customRender: 'nfrat_mc' },
          },
          {
            title: '本币金额',
            dataIndex: 'mc',
            key: '8-2',
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
            key: '10-1',
            align: 'right',
            slots: { customRender: 'yue_nfrat' },
          },
          {
            title: '本币金额',
            dataIndex: 'yue',
            key: '10-2',
            align: 'right',
            slots: { customRender: 'yue' },
          }
        ],
      }
    ],
    SWJ: [
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
        align: 'center',
      },
      {
        title: '凭证号',
        dataIndex: 'inoId',
        key: 'inoId',
        align: 'center',
      },
      {
        title: '期间',
        dataIndex: 'dbillDate',
        key: 'dbillDate',
        align: 'center',
      },
      {
        title: '摘要',
        dataIndex: 'cdigest',
        key: 'cdigest',
        align: 'center',
      },
      {
        title: '结算方式',
        dataIndex: 'pjCsettle',
        key: 'pjCsettle',
        align: 'center',
      },
      {
        title: '票据号',
        dataIndex: 'pjId',
        key: 'pjId',
        align: 'center',
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
            key: '8-1',
            align: 'right',
            slots: { customRender: 'ndS' },
          },
          {
            title: '原币金额',
            dataIndex: 'nfrat_md',
            key: '82',
            align: 'right',
            slots: { customRender: 'nfrat_md' },
          },
          {
            title: '本币金额',
            dataIndex: 'yue',
            key: '8-3',
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
            key: '9-1',
            align: 'right',
            slots: { customRender: 'ncS' },
          },
          {
            title: '原币金额',
            dataIndex: 'nfrat_mc',
            key: '9-2',
            align: 'right',
            slots: { customRender: 'nfrat_mc' },
          },
          {
            title: '本币金额',
            dataIndex: 'yue',
            key: '9-3',
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
            dataIndex: 'synum',
            key: '11-1',
            align: 'right',
            slots: { customRender: 'synum' },
          },
          {
            title: '原币金额',
            dataIndex: 'sywb',
            key: '11-2',
            align: 'right',
            slots: { customRender: 'sywb' },
          },
          {
            title: '本币金额',
            dataIndex: 'symoney',
            key: '11-3',
            align: 'right',
            slots: { customRender: 'symoney' },
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
  return daybookGlStore(store);
}

