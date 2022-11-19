import {defineStore} from 'pinia';
import {store} from '/@/store';
import {findAllAccvoucherTemplate} from "/@/api/record/system/accvoucher_template";
import {message} from "ant-design-vue";
import {reactive} from "vue";

export const useAccvoucherXSZStore = defineStore({
  id: 'accvoucherxsz',
  state: (): any => ({
    columns: [
      {
        title: '序号',
        width: 100,
        fixed: 'left',
        slots: {customRender: 'serialNumber'}
      },
      {
        title: '制单日期',
        dataIndex: 'dbillDate',
        width: 100,
        fixed: 'left',
      },
      {
        title: '凭证字号',
        dataIndex: 'inoId',
        width: 100,
        fixed: 'left'
        , slots: {customRender: 'csignAndInoId'}
      },
      {
        title: '摘要',
        dataIndex: 'cdigest',
        ellipsis: true,
        width: 100,
        fixed: 'left', align: 'left'
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
        title: '币种',
        dataIndex: 'foreignCurrency',
        width: '120px',
        ellipsis: true,
        ifShow: true,
        align: 'left'
      },
      {
        title: '汇率',
        dataIndex: 'mdF',
        width: '100px',
        ifShow: true,
        align: 'right'
      },
      {
        title: '原币金额',
        dataIndex: 'wbmoney',
        width: '120px',
        ellipsis: true,
        ifShow: true,
        align: 'right',
        slots: {customRender: 'wbmoney'}
      },
      {
        title: '计量单位',
        dataIndex: 'unitMeasurement',
        width: '100px',
        ifShow: true, align: 'left'
      },
      {
        title: '数量',
        dataIndex: 'num',
        width: '100px',
        ifShow: true,
        slots: {customRender: 'num'}
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
        width: '100px',
        ellipsis: true,
        slots: {customRender: 'mdmoney'}
      },
      {
        title: '本币贷方金额',
        dataIndex: 'mc',
        width: '100px',
        ellipsis: true,
        slots: {customRender: 'mcmoney'}
      },
      {
        title: '制单人',
        dataIndex: 'cbill',
        ellipsis: true,
        width: '120px', align: 'left'
      },
      {
        title: '审核人',
        dataIndex: 'ccheck',
        ellipsis: true,
        width: '120px',
        align: 'left'
      },{
        title: '记账人',
        dataIndex: 'cbook',
        ellipsis: true,
        width: '120px',
        align: 'left'
      }
    ],
    columns2: [
      {
        title: '序号',
        width: 100,
        fixed: 'left',
        slots: {customRender: 'serialNumber'}
      },
      {
        title: '制单日期',
        dataIndex: 'dbillDate',
        width: 100,
        fixed: 'left',
        ellipsis: true
      },
      {
        title: '凭证字号',
        dataIndex: 'inoId',
        ellipsis: true,
        width: 100,
        fixed: 'left',
        slots: {customRender: 'csignAndInoId'}
      },
      {
        title: '摘要',
        dataIndex: 'cdigest',
        ellipsis: true,
        width: 100,
        fixed: 'left', align: 'left'
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
        title: '本币借方金额',
        dataIndex: 'md',
        width: '100px',
        ellipsis: true,
        align: 'right',
        slots: {customRender: 'mdmoney'}
      },
      {
        title: '本币贷方金额',
        dataIndex: 'mc',
        width: '100px',
        ellipsis: true,
        align: 'right',
        slots: {customRender: 'mcmoney'}
      },
      {
        title: '制单人',
        dataIndex: 'cbill',
        ellipsis: true,
        width: '120px', align: 'left'
      },
      {
        title: '审核人',
        dataIndex: 'ccheck',
        ellipsis: true,
        width: '120px',
        align: 'left'
      },{
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
      return value == '2'?state.columns:state.columns2
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
  return useAccvoucherXSZStore(store);
}

