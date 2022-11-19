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
      field: 'unitType',
      label: '单位类型',
      component: 'Select',
      componentProps: '',
      required: true,
      readonly: true,
      serial: 3,
      isShow: true
    },,
    {
      columnType: '1',
      field: 'unitValue',
      label: '业务单位',
      component: 'Select',
      componentProps: 'cust',
      required: true,
      readonly: false,
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
      isShow: true
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
      field: 'bstyle',
      label: '收发方式',
      component: 'Select',
      componentProps: 'method',
      required: true,
      readonly: true,
      serial: 8,
      isShow: true
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
  ]
}
