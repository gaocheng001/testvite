import {defineStore} from 'pinia';
import {store} from '/@/store';
import {findAllAccvoucherTemplate} from "/@/api/record/system/accvoucher_template";
import {message} from "ant-design-vue";
import {reactive} from "vue";

export const useAccvoucherXjStore = defineStore({
  id: 'useAccvoucherXj',
  state: (): any => ({
    columns: [
      /*      {
              title: 'ID',
              dataIndex: 'id',
              width: '50px',
              ifShow: true,
            },*/
      {
        title: '序号',
        width: '60px',
        fixed: 'left',
        dataIndex: 'cdfine30',
        slots: {customRender: 'cdfine30'}
      },
      {
        title: '制单日期',
        dataIndex: 'dbillDate',
        width: '120px',
      },
      {
        title: '凭证字号',
        dataIndex: 'inoId',
        width: '120px'
        , slots: {customRender: 'csignAndInoId'}
      },
      {
        title: '流量分配',
        dataIndex: 'cashProject',
        width: '120px'
        , slots: {customRender: 'cashProject'}
      },
      {

        title: '摘要',
        dataIndex: 'cdigest',
        ellipsis: true,
        width: '250px'
        , align: 'left'
      },
      {
        title: '附单据数',
        dataIndex: 'idoc',
        width: '100px',
        ifShow: true
      },
      {
        title: '科目编码',
        dataIndex: 'ccode',
        ellipsis: true,
        width: '120px', align: 'left'
      },
      {
        title: '科目名称',
        dataIndex: 'ccodeName',
        ellipsis: true,
        width: '200px', align: 'left'
      },
      {
        title: '辅助项',
        dataIndex: 'cdfine',
        width: '120px',
        ellipsis: true,
        ifShow: true, align: 'left'
      },
      {
        title: '币种',
        dataIndex: 'foreignCurrency',
        width: '120px',
        ellipsis: true,
        ifShow: true,
        align: 'left'
      },
      {
        title: '原币金额',
        dataIndex: 'nfrat',
        width: '120px',
        ellipsis: true,
        ifShow: true,
        align: 'right'
      },
      {
        title: '汇率',
        dataIndex: 'mdF',
        width: '100px',
        ifShow: true
      },
      {
        title: '计量单位',
        dataIndex: 'unitMeasurement',
        width: '100px',
        ifShow: true, align: 'left'
      },
      {
        title: '借方数量',
        dataIndex: 'ndS',
        width: '100px',
        ifShow: true, align: 'left'
      },
      {
        title: '借方数量',
        dataIndex: 'ncS',
        width: '100px',
        ifShow: true, align: 'left'
      },
      {
        title: '原币借方金额',
        dataIndex: 'nfratMd',
        width: '100px',
        ifShow: true, align: 'right'
      },
      {
        title: '原币贷方金额',
        dataIndex: 'nfratMc',
        width: '100px',
        ifShow: true, align: 'right'
      },
      {
        title: '单价',
        dataIndex: 'cunitPrice',
        width: '100px',
        ifShow: true, align: 'right'
      },
      {
        title: '借方金额',
        dataIndex: 'md',
        width: '100px',
        ellipsis: true,
        slots: {customRender: 'mdmoney'}
      },
      {
        title: '贷方金额',
        dataIndex: 'mc',
        width: '100px',
        ellipsis: true,
        slots: {customRender: 'mcmoney'}
      },
      {
        title: '制单人',
        dataIndex: 'cbill',
        ellipsis: true,
        width: '100px', align: 'left'
      },
      {
        title: '出纳',
        dataIndex: 'ccashier',
        ellipsis: true,
        width: '100px', align: 'left',
        ifShow: true
      },
      {
        title: '审核人',
        dataIndex: 'ccheck',
        ellipsis: true,
        width: '100px', align: 'left'
      },
      {
        title: '主管签字',
        dataIndex: 'cdirector',
        ellipsis: true, align: 'left',
        width: '100px',
      },
      {
        title: '记账人',
        dataIndex: 'cbook',
        ellipsis: true, align: 'left',
        width: '100px',
      }
    ],
    columns2: [
      {
        title: '操作',
        dataIndex: 'operation',
        width: '80px',
        align: 'center',
        customHeaderCell: () => {		// 表头加粗
          return {style: {'font-weight':'bold'}} // return 想要设置的样式
        },
        slots: { customRender: 'operation' },
      },
      {
        title: '序号',
        width: '90px',
        dataIndex: 'num',
        key: '0',
        align: 'center',
        customHeaderCell: () => {		// 表头加粗
          return {style: {'font-weight':'bold'}} // return 想要设置的样式
        },
        slots: {customRender: 'num'}
      },
      {
        title: '对应序号',
        dataIndex: 'dnum',
        key: '1',
        align: 'center',
        customHeaderCell: () => {		// 表头加粗
          return {style: {'font-weight':'bold'}} // return 想要设置的样式
        },
        width: '90px',
      },
      {
        title: '现金流量科目',
        dataIndex: 'codename',
        key: '2',
        width: '150px',
        align: 'center',
        customHeaderCell: () => {		// 表头加粗
          return {style: {'font-weight':'bold'}} // return 想要设置的样式
        },
        slots: {customRender: 'codename'}
      },
      {
        title: '摘要',
        dataIndex: 'cdigest',
        width: '150px',
        align: 'center',
        customHeaderCell: () => {		// 表头加粗
          return {style: {'font-weight':'bold'}} // return 想要设置的样式
        },
        key: '3',
      },
      {
        title: '对方科目',
        dataIndex: 'dccode',
        key: '4',
        width: '150px',
        align: 'center',
        customHeaderCell: () => {		// 表头加粗
          return {style: {'font-weight':'bold'}} // return 想要设置的样式
        },
        slots: { customRender: 'dccode' },
      },
      {
        title: '流量编码',
        dataIndex: 'projectnum',
        width: '90px',
        align: 'center',
        key: '5',
        customHeaderCell: () => {		// 表头加粗
          return {style: {'font-weight':'bold'}} // return 想要设置的样式
        },
        slots: {customRender: 'projectnum'}
      },
      {
        title: '现金流量项目',
        dataIndex: 'projectname',
        width: '200px',
        align: 'center',
        key: '6',
        customHeaderCell: () => {		// 表头加粗
          return {style: {'font-weight':'bold'}} // return 想要设置的样式
        },
        slots: { customRender: 'projectname' },
      },
      {
        title: '资金方向',
        dataIndex: 'fx',
        width: '90px',
        align: 'center',
        key: '7',
        customHeaderCell: () => {		// 表头加粗
          return {style: {'font-weight':'bold'}} // return 想要设置的样式
        },
        slots: { customRender: 'fx' },
      },
      {
        title: '本币金额',
        dataIndex: 'money',
        key: '8',
        align: 'center',
        width: '120px',
        customHeaderCell: () => {		// 表头加粗
          return {style: {'font-weight':'bold'}} // return 想要设置的样式
        },
        slots: { customRender: 'money' },
      },

    ]
  }),
  getters: {
    getColumns: (state) => (value) => {
      return value == '1'?state.columns:state.columns2
    },
  },
  actions: {
    async verifyAccvoucherTemplateSum(exec: any) {
      // 校验 凭证模板表有无数据
      const a = await findAllAccvoucherTemplate()
      if (a.length === 0) {
        message.error('请先设置凭证导入模板，再进行导入!')
        return false
      } else {
        exec()
      }
    }
  }
});

// Need to be used outside the setup
export function useAccvoucherStoreWidthOut() {
  return useAccvoucherXjStore(store);
}

