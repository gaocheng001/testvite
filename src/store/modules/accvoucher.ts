import {defineStore} from 'pinia';
import {store} from '/@/store';
import {findAllAccvoucherTemplate} from "/@/api/record/system/accvoucher_template";
import {message} from "ant-design-vue";
import {reactive} from "vue";

export const useAccvoucherStore = defineStore({
  id: 'accvoucher',
  state: (): any => ({
    columns: [
      {
        title: '记账状态',
        dataIndex: 'ibook',
        width: '100px',
        fixed: 'left',
        slots: {customRender: 'ibook'}
      },
      {
        title: '制单日期',
        dataIndex: 'dbillDate',
        width: '120px',
        fixed: 'left',
        className: 'a-table-font-arial'
      },
      {
        title: '凭证字号',
        dataIndex: 'inoId',
        width: '200px',
        fixed: 'left',
        slots: {customRender: 'csignAndInoId'},
      },
      {
        title: '摘要',
        dataIndex: 'cdigest',
        ellipsis: true,
        width: '250px'
        ,fixed: 'left'
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
        width: '200px',
        ifShow: true,
        slots: {customRender: 'pjCsettle'}
      },{
        title: '结算号',
        dataIndex: 'pjId',
        width: '120px',
        ifShow: true,
      }
      ,{
        title: '结算单位',
        dataIndex: 'pjUnitName',
        width: '120px',
        ifShow: true,
      }
      ,{
        title: '结算日期',
        dataIndex: 'pjDate',
        width: '120px',
        ifShow: true,
      }
      ,
      {
        title: '科目编码',
        dataIndex: 'ccode',
        ellipsis: true,
        className: 'a-table-font-arial',
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
        title: '出纳人',
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
        title: '财务主管',
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
        title: '记账状态',
        dataIndex: 'ibook',
        width: '100px',
        fixed: 'left',
        slots: {customRender: 'ibook'}
      },
      {
        title: '制单日期',
        dataIndex: 'dbillDate',
        width: '140px',
        ellipsis: true,
        className: 'a-table-font-arial'
      },
      {
        title: '凭证字号',
        dataIndex: 'inoId',
        ellipsis: true,
        width: '200px',
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
        title: '出纳人',
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
        title: '财务主管',
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

