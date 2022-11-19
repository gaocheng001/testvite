import {reactive} from "vue";

const dynamicColumnAndDataModel = reactive({
  DEFAULT: [
    {
      key: '0',
      title: '栏目名称',
      dataIndex: 'name',
      align: 'left',
      width: 150,
    },
    {
      key: '1',
      title: '显示',
      dataIndex: 'check',
      align: 'center',
      slots: { customRender: 'checkBox' },
    },
    {
      key: '3',
      title: '显示名称',
      dataIndex: 'nameNew',
      width: 150,
      align: 'center',
      slots: { customRender: 'nameInput', },
    },
    {
      key: '4',
      title: '宽度(范围)',
      dataIndex: 'width',
      align: 'center',
      width: 140,
      slots: { customRender: 'widthInput', },
    },
    {
      key: '5',
      title: '对齐方式',
      dataIndex: 'align',
      align: 'center',
      width: 140,
      slots: { customRender: 'alignRadio' },
    }
  ],
  DATA: [
    {
      key: '0',
      name: '单据日期',
      nameNew: '单据日期',
      check: true,isFixed: true,
      width: 100,
      max: 100,
      min: 100,
      align: 'center'
    },
    {
      key: '1',
      name: '单据编号',
      nameNew: '单据编号',
      check: true,isFixed: true,
      width: 120,
      max: 150,
      min: 80,
      align: 'left'
    },
    {
      key: '2',
      name: '到货状态',
      nameNew: '到货状态',
      check: true,isFixed: true,
      width: 80,
      max: 100,
      min: 80,
      align: 'center'
    },
    {
      key: '3',
      name: '入库状态',
      nameNew: '入库状态',
      check: true,
      width: 80,
      max: 100,
      min: 80,
      align: 'center'
    },
    {
      key: '4',
      name: '付款状态',
      nameNew: '付款状态',
      check: true,
      width: 80,
      max: 100,
      min: 80,
      align: 'center'
    },
    {
      key: '5',
      name: '发票状态',
      nameNew: '发票状态',
      check: true,
      width: 80,
      max: 100,
      min: 80,
      align: 'center'
    },
    {
      key: '6',
      name: '业务部门',
      nameNew: '业务部门',
      check: true,
      width: 80,
      max: 250,
      min: 80,
      align: 'left'
    },{
      key: '7',
      name: '业务员',
      nameNew: '业务员',
      check: true,
      width: 80,
      max: 250,
      min: 80,
      align: 'left'
    },
    {
      key: '8',
      name: '供应商编码',
      nameNew: '供应商编码',
      check: false,
      width: 100,
      max: 200,
      min: 100,
      align: 'left'
    },
    {
      key: '9',
      name: '供应商简称',
      nameNew: '供应商简称',
      check: true,isFixed: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'left'
    },
    {
      key: '10',
      name: '结算供应商编码',
      nameNew: '结算供应商编码',
      check: false,
      width: 120,
      max: 200,
      min: 100,
      align: 'left'
    },
    {
      key: '11',
      name: '结算供应商简称',
      nameNew: '结算供应商简称',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'left'
    },
    {
      key: '12',
      name: '仓库',
      nameNew: '仓库',
      check: true,
      width: 100,
      max: 150,
      min: 100,
      align: 'left'
    },
    {
      key: '13',
      name: '条形码',
      nameNew: '条形码',
      check: true,
      width: 80,
      max: 250,
      min: 80,
      align: 'left'
    },
    {
      key: '14',
      name: '存货编码',
      nameNew: '存货编码',
      check: true,
      width: 100,
      max: 200,
      min: 100,
      align: 'left'
    },
    {
      key: '15',
      name: '存货名称',
      nameNew: '存货名称',
      check: true,isFixed: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'left'
    },
    {
      key: '16',
      name: '规格型号',
      nameNew: '规格型号',
      check: true,
      width: 100,
      max: 150,
      min: 100,
      align: 'center'
    },
    {
      key: '17',
      name: '主计量',
      nameNew: '主计量',
      check: true,isFixed: true,
      width: 60,
      max: 100,
      min: 60,
      align: 'center'
    },
    {
      key: '18',
      name: '批号',
      nameNew: '批号',
      check: true,
      width: 80,
      max: 150,
      min: 80,
      align: 'center'
    },
    {
      key: '19',
      name: '主数量',
      nameNew: '主数量',
      check: true,isFixed: true,
      width: 80,
      max: 150,
      min: 80,
      align: 'right'
    },
    {
      key: '20',
      name: '价税合计',
      nameNew: '价税合计',
      check: true,isFixed: true,
      width: 100,
      max: 250,
      min: 100,
      align: 'right'
    },
    {
      key: '21',
      name: '赠品',
      nameNew: '赠品',
      check: true,
      width: 60,
      max: 80,
      min: 60,
      align: 'center'
    },
    {
      key: '22',
      name: '退货数量',
      nameNew: '退货数量',
      check: true,
      width: 80,
      max: 150,
      min: 80,
      align: 'right'
    },
    {
      key: '23',
      name: '累计入库数量',
      nameNew: '累计入库数量',
      check: true,
      width: 100,
      max: 150,
      min: 100,
      align: 'right'
    },
    {
      key: '24',
      name: '未入库数量',
      nameNew: '未入库数量',
      check: true,
      width: 100,
      max: 150,
      min: 100,
      align: 'right'
    },
    {
      key: '25',
      name: '累计结款金额',
      nameNew: '累计结款金额',
      check: true,
      width: 100,
      max: 150,
      min: 100,
      align: 'right'
    },
    {
      key: '26',
      name: '未结款金额',
      nameNew: '未结款金额',
      check: true,
      width: 100,
      max: 150,
      min: 100,
      align: 'right'
    },
    {
      key: '27',
      name: '累计开票数量',
      nameNew: '累计开票数量',
      check: true,
      width: 100,
      max: 150,
      min: 100,
      align: 'right'
    },
    {
      key: '28',
      name: '未开票数量',
      nameNew: '未开票数量',
      check: true,
      width: 100,
      max: 150,
      min: 100,
      align: 'right'
    },
    {
      key: '29',
      name: '已开票金额',
      nameNew: '已开票金额',
      check: true,
      width: 100,
      max: 150,
      min: 100,
      align: 'right'
    },
    {
      key: '30',
      name: '明细备注',
      nameNew: '明细备注',
      check: true,
      width: 80,
      max: 250,
      min: 80,
      align: 'left'
    },{
      key: '31',
      name: '制单人',
      nameNew: '制单人',
      check: true,
      width: 80,
      max: 250,
      min: 80,
      align: 'left'
    },{
      key: '32',
      name: '审核人',
      nameNew: '审核人',
      check: true,
      width: 80,
      max: 250,
      min: 80,
      align: 'left'
    },{
      key: '33',
      name: '复核人',
      nameNew: '复核人',
      check: true,
      width: 80,
      max: 250,
      min: 80,
      align: 'left'
    },
  ]
})

export function changeDefaultDynamics(list) {
  // 改变默认数据
  dynamicColumnAndDataModel['DATA'] = list
}

export function initDynamics() {
  return dynamicColumnAndDataModel
}

export function assemblyDynamicColumn(lanmuList: any, columnList: any) {
  columnList.forEach(cObj => {
    if (cObj != null) {
      lanmuList.forEach((lObj, index) => {
        if (cObj.title === lObj.name) {
          cObj.title = thisName(index + '', lanmuList)
          cObj.width = thisWidth(index + '', lanmuList)
          cObj.align = thisAlign(index + '', lanmuList)
          cObj.ifShow = thisIsShow(index + '', lanmuList)
          cObj.pkey = thisSort(index + '', lanmuList)
        }
      })
    }
  })
  return columnList.sort((a, b) => a.pkey - b.pkey);
}

/*********************** 静态方法 ***********************/
// 动态名称
const thisName = (index, thisData) => {
  let value = ''
  if (index.toString().indexOf('-') != -1) {
    let arr = index.split('-');
    if (arr.length == 2) {
      value = thisData[parseInt(arr[0])].children[parseInt(arr[1]) - 1].nameNew
      if ('' == value) value = thisData[parseInt(arr[0])].children[parseInt(arr[1]) - 1].name
    } else {
      value = thisData[parseInt(arr[0])].children[parseInt(arr[1]) - 1].children[parseInt(arr[2]) - 1].nameNew
      if ('' == value) value = thisData[parseInt(arr[0])].children[parseInt(arr[1]) - 1].children[parseInt(arr[2]) - 1].name
    }
  } else {
    value = thisData[index].nameNew
    if ('' == value) value = thisData[index].name
  }
  return value
}
// 当前宽度
const thisWidth = (index, thisData) => {
  let value: any = 0
  if (index.toString().indexOf('-') != -1) {
    let arr = index.split('-');
    if (arr.length == 2) {
      value = thisData[parseInt(arr[0])].children[parseInt(arr[1]) - 1].width
    } else {
      value = thisData[parseInt(arr[0])].children[parseInt(arr[1]) - 1].children[parseInt(arr[2]) - 1].width
    }
  } else {
    value = thisData[index].width
  }
  return parseInt(value)
}
// 是否显示
const thisIsShow = (index, thisData) => {
  let value = false
  if (index.toString().indexOf('-') != -1) {
    let arr = index.split('-');
    if (arr.length == 2) {
      value = thisData[parseInt(arr[0])].children[parseInt(arr[1]) - 1].check
    } else {
      value = thisData[parseInt(arr[0])].children[parseInt(arr[1]) - 1].children[parseInt(arr[2]) - 1].check
    }
  } else {
    value = thisData[index].check
  }
  return value
}
// 对齐方式
const thisAlign = (index, thisData) => {
  let value = 'center';
  if (index.toString().indexOf('-') != -1) {
    let arr = index.split('-');
    if (arr.length == 2) {
      value = thisData[parseInt(arr[0])].children[parseInt(arr[1]) - 1].align
    } else {
      value = thisData[parseInt(arr[0])].children[parseInt(arr[1]) - 1].children[parseInt(arr[2]) - 1].align
    }
  } else {
    value = thisData[index].align
  }
  return value
}
// 排序标识
const thisSort = (index, thisData) => {
  let value = null;
  if (index.toString().indexOf('-') != -1) {
    let arr = index.split('-');
    if (arr.length == 2) {
      value = thisData[parseInt(arr[0])].children[parseInt(arr[1]) - 1].pkey
    } else {
      value = thisData[parseInt(arr[0])].children[parseInt(arr[1]) - 1].children[parseInt(arr[2]) - 1].pkey
    }
  } else {
    value = thisData[index].pkey
  }
  return value
}
