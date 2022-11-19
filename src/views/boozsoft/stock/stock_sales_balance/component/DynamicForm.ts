export const defaultRows = () => {
  return [
    {
      columnType: '1',
      field: 'ccode',
      label: '单据编号',
      component: 'Input',
      componentProps: null,
      required: true,
      readonly: true,
      serial: 1,
      isShow: true
    }, {
      columnType: '1',
      field: 'ddate',
      label: '单据日期',
      component: 'DatePicker',
      componentProps: null,
      required: true,
      readonly: true,
      serial: 2,
      isShow: true
    },
    {
      columnType: '1',
      field: 'cvencode',
      label: '销售客户',
      component: 'Select',
      componentProps: 'cust',
      required: true,
      readonly: true,
      serial: 3,
      isShow: true
    },
    {
      columnType: '1',
      field: 'cvencodeJs',
      label: '结算客户',
      component: 'Select',
      componentProps: 'cust',
      required: true,
      readonly: true,
      serial: 4,
      isShow: true
    },
    {
      columnType: '1',
      field: 'cwhcode',
      label: '仓库',
      component: 'Select',
      componentProps: 'warehouse',
      required: true,
      readonly: false,
      serial: 5,
      isShow: true
    },
    {
      columnType: '1',
      field: 'cdepcode',
      label: '业务部门',
      component: 'Select',
      componentProps: 'dept',
      required: false,
      readonly: false,
      serial: 6,
      isShow: false
    },
    {
      columnType: '1',
      field: 'cpersoncode',
      label: '业务员',
      component: 'Select',
      componentProps: 'user',
      required: false,
      readonly: false,
      serial: 7,
      isShow: true
    },
    {
      columnType: '1',
      field: 'sgspperson',
      label: '质检员',
      component: 'Select',
      componentProps: 'user',
      required: false,
      readonly: false,
      serial: 8,
      isShow: false
    },
    {
      columnType: '1',
      field: 'cmemo',
      label: '备注',
      component: 'Input',
      componentProps: null,
      required: false,
      readonly: false,
      serial: 9,
      isShow: true
    },
    {
      columnType: '1',
      field: 'xsRate',
      label: '销售税率',
      component: 'InputNumber',
      componentProps: null,
      required: false,
      readonly: false,
      serial: 10,
      isShow: true
    },{
      columnType: '1',
      field: 'deliveryUser',
      label: '送货人',
      component: 'Select',
      componentProps: 'user',
      required: false,
      readonly: true,
      serial: 11,
      isShow: true
    }
  ]
}
