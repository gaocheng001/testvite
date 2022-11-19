import {defineStore} from 'pinia';
import {store} from '/@/store';
import {message} from "ant-design-vue";
import {reactive} from "vue";

export const useEiStore = defineStore({
  id: 'useEiStore',
  state: (): any => ({
    J:[
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
        align: 'center',
        slots: { customRender: 'number' },
      },
      {
        title: '发票类型',
        dataIndex: 'fpType',
        key: 'fpType',
        align: 'center',
        slots: { customRender: 'fpType' },
      },
      {
        title: '发票日期',
        dataIndex: 'fapiaoDate',
        key: 'fapiaoDate',
        align: 'center',
        slots: { customRender: 'fapiaoDate' },
      },
      {
        title: '发票代码',
        dataIndex: 'fapiaoCode',
        key: 'fapiaoCode',
        align: 'center',
        slots: { customRender: 'fapiaoCode' },
      },
      {
        title: '发票号码',
        dataIndex: 'fapiaoNumber',
        key: 'fapiaoNumber',
        align: 'center',
        slots: { customRender: 'fapiaoNumber' },
      },
      {
        title: '发票单位名称',
        dataIndex: 'buyerSupplier',
        key: 'buyerSupplier',
        align: 'center',
        slots: { customRender: 'buyerSupplier' },
      },
      {
        title: '价税合计',
        dataIndex: 'fapiaoTotalAmount',
        key: 'fapiaoTotalAmount',
        align: 'center',
        slots: { customRender: 'fapiaoTotalAmount' },
      },
      {
        title: '发票金额',
        dataIndex: 'fapiaoMoney',
        key: 'fapiaoMoney',
        align: 'center',
        slots: { customRender: 'fapiaoMoney' },
      },
      {
        title: '发票税额',
        dataIndex: 'fapiaoTaxAmount',
        key: 'fapiaoTaxAmount',
        align: 'center',
        slots: { customRender: 'fapiaoTaxAmount' },
      },
      {
        title: '校验码',
        dataIndex: 'fapiaoCheckCode',
        key: 'fapiaoCheckCode',
        align: 'center',
        slots: { customRender: 'fapiaoCheckCode' },
      },
      {
        title: '发票种类',
        dataIndex: 'ywType',
        key: 'ywType',
        align: 'center',
        customHeaderCell: () => {		// 表头加粗
          return {style: {'font-weight':'bold'}} // return 想要设置的样式
        },
        slots: { customRender: 'ywType' },
      },
      {
        title: '对应凭证',
        dataIndex: 'accuniqueCode',
        key: 'accuniqueCode',
        align: 'center',
        slots: { customRender: 'accuniqueCode' },
      },
      {
        title: '税务验真',
        dataIndex: 'fapiaoCheck',
        key: 'fapiaoCheck',
        align: 'center',
        slots: { customRender: 'fapiaoCheck' },
      },
      {
        title: '单据状态',
        dataIndex: 'djStatus',
        key: 'djStatus',
        align: 'center',
        slots: { customRender: 'djStatus' },
      },
      {
        title: '认证状态',
        dataIndex: 'rzStatus',
        key: 'rzStatus',
        align: 'center',
        slots: { customRender: 'rzStatus' },
      },
      {
        title: '发票状态',
        dataIndex: 'fpStatus',
        key: 'fpStatus',
        align: 'center',
        slots: { customRender: 'fpStatus' },
      },
      {
        title: '操作',
        dataIndex: 'caozuo',
        key: 'caozuo',
        align: 'center',
        slots: { customRender: 'caozuo' },
      },
    ],
  }),
  getters: {
    getColumns: (state) => (value) => {
      return state.J
    },
  },
  actions: {

  }
});

// Need to be used outside the setup
export function useGlStoreWidthOut() {
  return useEiStore(store);
}

