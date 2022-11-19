import { defineStore } from 'pinia';
import { store } from '/@/store';

export const useKmMingxiStore = defineStore({
  id: 'kmmingxi',
  state: (): any => ({
    columns: [
      {
        title: '序号',
        width: '60px',
        fixed: 'left',
        slots: { customRender: 'serialNumber' },
      },
      {
        title: '制单日期',
        dataIndex: 'dbillDate',
        width: '120px',
      },
      {
        title: '凭证字号',
        dataIndex: 'inoId',
        width: '120px',
        slots: { customRender: 'csignAndInoId' },
      },
      {
        title: '摘要',
        dataIndex: 'cdigest',
        ellipsis: true,
        width: '250px',
        align: 'left',
      },
      {
        title: '附单据数',
        dataIndex: 'idoc',
        width: '100px',
        ifShow: true,
      },
      {
        title: '科目编码',
        dataIndex: 'ccode',
        ellipsis: true,
        width: '120px',
        align: 'left',
      },
      {
        title: '科目名称',
        dataIndex: 'ccodeName',
        ellipsis: true,
        width: '200px',
        align: 'left',
      },
      {
        title: '辅助项',
        dataIndex: 'cdfine',
        width: '120px',
        ellipsis: true,
        ifShow: true,
        align: 'left',
      },
      {
        title: '币种',
        dataIndex: 'foreignCurrency',
        width: '120px',
        ellipsis: true,
        ifShow: true,
        align: 'left',
      },
      {
        title: '汇率',
        dataIndex: 'mdF',
        width: '100px',
        ifShow: true,
      },
      {
        title: '计量单位',
        dataIndex: 'unitMeasurement',
        width: '100px',
        ifShow: true,
        align: 'left',
      },
      {
        title: '数量',
        dataIndex: 'ndS',
        width: '100px',
        ifShow: true,
        align: 'left',
      },
      {
        title: '单价',
        dataIndex: 'cunitPrice',
        width: '100px',
        ifShow: true,
        align: 'right',
      },
      {
        title: '借方金额',
        dataIndex: 'md',
        width: '100px',
        ellipsis: true,
        slots: { customRender: 'mdmoney' },
      },
      {
        title: '贷方金额',
        dataIndex: 'mc',
        width: '100px',
        ellipsis: true,
        slots: { customRender: 'mcmoney' },
      },
      {
        title: '制单人',
        dataIndex: 'cbill',
        ellipsis: true,
        width: '100px',
        align: 'left',
      },
      {
        title: '审核人',
        dataIndex: 'ccheck',
        ellipsis: true,
        width: '100px',
        align: 'left',
      },
      {
        title: '出纳签字',
        dataIndex: 'ccashier',
        ellipsis: true,
        width: '100px',
        align: 'left',
        ifShow: true,
      },
      {
        title: '记账人',
        dataIndex: 'cbook',
        ellipsis: true,
        align: 'left',
        width: '100px',
      },
    ],
    columns2: [
      /*   {
        title: 'ID',
        dataIndex: 'id',
        width: '50px',
        ifShow: true,
      },*/
      {
        title: '序号',
        width: '100px',
        slots: { customRender: 'serialNumber' },
      },
      {
        title: '制单日期',
        dataIndex: 'dbillDate',
        width: '140px',
        ellipsis: true,
      },
      {
        title: '凭证字号',
        dataIndex: 'inoId',
        ellipsis: true,
        width: '140px',
        slots: { customRender: 'csignAndInoId' },
      },
      {
        title: '摘要',
        dataIndex: 'cdigest',
        ellipsis: true,
        width: '300px',
        align: 'left',
      },
      {
        title: '附单据数',
        dataIndex: 'idoc',
        width: '100px',
        ifShow: true,
      },
      {
        title: '凭证金额',
        dataIndex: 'md',
        ellipsis: true,
        slots: { customRender: 'mdmoney' },
      },
      {
        title: '制单人',
        dataIndex: 'cbill',
        ellipsis: true,
        width: '120px',
        align: 'left',
      },
      {
        title: '审核人',
        dataIndex: 'ccheck',
        ellipsis: true,
        width: '120px',
        align: 'left',
      },
      {
        title: '出纳签字',
        dataIndex: 'ccashier',
        ellipsis: true,
        width: '120px',
        align: 'left',
        ifShow: true,
      },
      {
        title: '记账人',
        dataIndex: 'cbook',
        ellipsis: true,
        width: '120px',
        align: 'left',
      },
    ],
    J: [
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
        width: 50,
      },
      {
        title: '凭证号',
        dataIndex: 'inoId',
        key: 'inoId',
        width: 50,
      },
      {
        title: '期间',
        dataIndex: 'dbillDate',
        key: 'dbillDate',
        width: 50,
      },
      {
        title: '摘要',
        dataIndex: 'cdigest',
        key: 'cdigest',
        width: 50,
        ellipsis: true,
      },
      {
        title: '借方',
        dataIndex: 'md',
        key: 'md',
        width: 50,
      },
      {
        title: '贷方',
        dataIndex: 'mc',
        key: 'mc',
        width: 50,
      },
      {
        title: '方向',
        dataIndex: 'bprogerty',
        key: 'bprogerty',
        width: 50,
      },
      {
        title: '余额',
        dataIndex: 'yue',
        key: 'yue',
        width: 50,
      },
    ],
    SJ: [
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
        width: 20,
      },
      {
        title: '凭证号',
        dataIndex: 'inoId',
        key: 'inoId',
        width: 50,
      },
      {
        title: '期间',
        dataIndex: 'dbillDate',
        key: 'dbillDate',
        width: 50,
      },
      {
        title: '摘要',
        dataIndex: 'cdigest',
        key: 'cdigest',
        width: 50,
        ellipsis: true,
      },
      {
        title: '计量单位',
        dataIndex: 'unitMeasurement',
        key: 'unitMeasurement',
        width: 50,
      },
      {
        title: '借方',
        dataIndex: 'jie',
        key: 'jie',
        width: 50,
        children: [
          {
            title: '数量',
            dataIndex: 'ndS',
            key: 'ndS',
            width: 50,
            slots: { customRender: 'ndS' },
          },
          {
            title: '本币金额',
            dataIndex: 'md',
            key: 'md',
            width: 50,
          },
        ],
      },
      {
        title: '贷方',
        width: 50,
        dataIndex: 'dai',
        key: 'dai',
        children: [
          {
            title: '数量',
            dataIndex: 'ncS',
            key: 'ncS',
            width: 50,
          },
          {
            title: '本币金额',
            dataIndex: 'mc',
            key: 'mc',
            width: 50,
          },
        ],
      },
      {
        title: '方向',
        dataIndex: 'bprogerty',
        key: 'bprogerty',
        width: 50,
      },
      {
        title: '余额',
        width: 50,
        children: [
          {
            title: '数量',
            dataIndex: 'yue_num',
            key: 'yue_num',
            width: 50,
          },
          {
            title: '本币金额',
            dataIndex: 'yue',
            key: 'yue',
            width: 50,
          },
        ],
      },
    ],
    WJ: [
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
        width: 50,
      },
      {
        title: '凭证号',
        dataIndex: 'inoId',
        key: 'inoId',
        width: 50,
      },
      {
        title: '期间',
        dataIndex: 'dbillDate',
        key: 'dbillDate',
        width: 50,
      },
      {
        title: '摘要',
        dataIndex: 'cdigest',
        key: 'cdigest',
        width: 50,
        ellipsis: true,
      },
      {
        title: '外币名称',
        dataIndex: 'foreignCurrency',
        key: 'foreignCurrency',
        width: 50,
      },
      {
        title: '借方',
        width: 50,
        dataIndex: 'jie',
        key: 'jie',
        children: [
          {
            title: '原币金额',
            dataIndex: 'nfrat_md',
            key: 'nfrat_md',
            width: 50,
          },
          {
            title: '本币金额',
            dataIndex: 'md',
            key: 'md',
            width: 50,
          },
        ],
      },
      {
        title: '贷方',
        width: 50,
        dataIndex: 'dai',
        key: 'dai',
        children: [
          {
            title: '原币金额',
            dataIndex: 'nfrat_mc',
            key: 'nfrat_mc',
            width: 50,
          },
          {
            title: '本币金额',
            dataIndex: 'mc',
            key: 'mc',
            width: 50,
          },
        ],
      },
      {
        title: '方向',
        dataIndex: 'bprogerty',
        key: 'bprogerty',
        width: 50,
      },
      {
        title: '余额',
        width: 50,
        children: [
          {
            title: '原币金额',
            dataIndex: 'yue_nfrat',
            key: 'yue_nfrat',
            width: 50,
          },
          {
            title: '汇率',
            dataIndex: 'mdF',
            key: 'mdF',
            width: 50,
          },
          {
            title: '本币金额',
            dataIndex: 'yue',
            key: 'yue',
            width: 50,
          },
        ],
      },
    ],
    SWJ: [
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
        width: 50,
      },
      {
        title: '凭证号',
        dataIndex: 'inoId',
        key: 'inoId',
        width: 50,
      },
      {
        title: '期间',
        dataIndex: 'dbillDate',
        key: 'dbillDate',
        width: 50,
      },
      {
        title: '摘要',
        dataIndex: 'cdigest',
        key: 'cdigest',
        width: 50,
        ellipsis: true,
      },
      {
        title: '计量单位',
        dataIndex: 'unitMeasurement',
        key: 'unitMeasurement',
        width: 50,
      },
      {
        title: '外币名称',
        dataIndex: 'foreignCurrency',
        key: 'foreignCurrency',
        width: 50,
      },
      {
        title: '借方',
        width: 50,
        dataIndex: 'jie',
        key: 'jie',
        children: [
          {
            title: '数量',
            dataIndex: 'ndS',
            key: 'ndS',
            width: 50,
            slots: { customRender: 'ndS' },
          },
          {
            title: '原币金额',
            dataIndex: 'nfrat_md',
            key: 'nfrat_md',
            width: 50,
          },
          {
            title: '本币金额',
            dataIndex: 'md',
            key: 'md',
            width: 50,
          },
        ],
      },
      {
        title: '贷方',
        width: 50,
        dataIndex: 'dai',
        key: 'dai',
        children: [
          {
            title: '数量',
            dataIndex: 'ncS',
            key: 'ncS',
            width: 50,
            slots: { customRender: 'ncS' },
          },
          {
            title: '原币金额',
            dataIndex: 'nfrat_mc',
            key: 'nfrat_mc',
            width: 50,
          },
          {
            title: '本币金额',
            dataIndex: 'mc',
            key: 'mc',
            width: 50,
          },
        ],
      },
      {
        title: '方向',
        dataIndex: 'bprogerty',
        key: 'bprogerty',
        width: 50,
      },
      {
        title: '余额',
        width: 50,
        children: [
          {
            title: '数量',
            dataIndex: 'yue_num',
            key: 'yue_num',
            width: 50,
          },
          {
            title: '原币金额',
            dataIndex: 'yue_nfrat',
            key: 'yue_nfrat',
            width: 50,
          },
          {
            title: '汇率',
            dataIndex: 'mdF',
            key: 'mdF',
            width: 50,
          },
          {
            title: '本币金额',
            dataIndex: 'yue',
            key: 'yue',
            width: 50,
          },
        ],
      },
    ],
  }),
  getters: {
    getColumns: (state) => (value) => {
      return value == 'J'
        ? state.J
        : value == 'SJ'
        ? state.SJ
        : value == 'WJ'
        ? state.WJ
        : state.SWJ;
    },
  },
});

// Need to be used outside the setup
export function useKmMingxiStoreWidthOut() {
  return useKmMingxiStore(store);
}
