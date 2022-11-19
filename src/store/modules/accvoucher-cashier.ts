import {defineStore} from 'pinia';
import {store} from '/@/store';
import {findAllAccvoucherTemplate} from "/@/api/record/system/accvoucher_template";
import {message} from "ant-design-vue";
import {reactive} from "vue";

export const useAccvoucherStore = defineStore({
  id: 'accvoucher',
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
        slots: {customRender: 'serialNumber'}
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
        title: '结算方式',
        dataIndex: 'pjCsettle',
        ellipsis: true,
        width: '120px', align: 'left',
        slots: {customRender: 'pjCsettle'}
      },
      {
        title: '结算号码',
        dataIndex: 'pjId',
        ellipsis: true,
        width: '120px', align: 'left'
      },
      {
        title: '结算日期',
        dataIndex: 'pjDate',
        ellipsis: true,
        width: '120px', align: 'left'
      },
      {
        title: '结算单位名称',
        dataIndex: 'pjUnitName',
        ellipsis: true,
        width: '200px', align: 'left'
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
        title: '数量',
        dataIndex: 'ndS',
        width: '100px',
        ifShow: true, align: 'left'
      },
      {
        title: '单价',
        dataIndex: 'cunitPrice',
        width: '100px',
        ifShow: true, align: 'right'
      },
      {
        title: '本币借方金额',
        dataIndex: 'md',
        width: '120px',
        ellipsis: true,
        slots: {customRender: 'mdmoney'}
      },
      {
        title: '本币贷方金额',
        dataIndex: 'mc',
        width: '120px',
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
   /*   {
        title: 'ID',
        dataIndex: 'id',
        width: '50px',
        ifShow: true,
      },*/
      {
        title: '序号',
        width: '100px',
        slots: {customRender: 'serialNumber'}
      },
      {
        title: '制单日期',
        dataIndex: 'dbillDate',
        width: '140px',
        ellipsis: true
      },
      {
        title: '凭证字号',
        dataIndex: 'inoId',
        ellipsis: true,
        width: '140px',
        slots: {customRender: 'csignAndInoId'}
      },
      {
        title: '摘要',
        dataIndex: 'cdigest',
        ellipsis: true,
        width: '300px', align: 'left'
      },
      {
        title: '附单据数',
        dataIndex: 'idoc',
        width: '100px',
        ifShow: true
      },
      {
        title: '凭证金额',
        dataIndex: 'md',
        ellipsis: true,
        slots: {customRender: 'mdmoney'}
      },
      {
        title: '制单人',
        dataIndex: 'cbill',
        ellipsis: true,
        width: '120px', align: 'left'
      },
      {
        title: '出纳',
        dataIndex: 'ccashier',
        ellipsis: true,
        width: '120px', align: 'left',
        ifShow: true
      },
      {
        title: '审核人',
        dataIndex: 'ccheck',
        ellipsis: true,
        width: '120px', align: 'left'
      },
      {
        title: '主管签字',
        dataIndex: 'cdirector',
        ellipsis: true, align: 'left',
        width: '120px',
      },
      {
        title: '记账人',
        dataIndex: 'cbook',
        ellipsis: true,
        width: '120px',
        align: 'left'
      }
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
  return useAccvoucherStore(store);
}

