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
      name: '状态',
      nameNew: '状态',
      check: true,
      width: 80,
      max: 150,
      min: 80,
      align: 'center'
    },
    {
      key: '1',
      name: '单据日期',
      nameNew: '单据日期',
      check: true,isFixed: true,
      width: 120,
      max: 150,
      min: 80,
      align: 'center'
    },
    {
      key: '2',
      name: '单据编号',
      nameNew: '单据编号',
      check: true,isFixed: true,
      width: 120,
      max: 200,
      min: 80,
      align: 'left'
    },
    {
      key: '3',
      name: '业务类型',
      nameNew: '业务类型',
      check: true,
      width: 80,
      max: 150,
      min: 80,
      align: 'center'
    },
    {
      key: '4',
      name: 'BOM存货名称',
      nameNew: 'BOM存货名称',
      check: true,isFixed: true,
      width: 150,
      max: 300,
      min: 100,
      align: 'left'
    },
    {
      key: '5',
      name: 'BOM版本号',
      nameNew: 'BOM版本号',
      check: true,
      width: 100,
      max: 200,
      min: 100,
      align: 'left'
    },
    {
      key: '6',
      name: 'BOM版本名称',
      nameNew: 'BOM版本名称',
      check: true,
      width: 150,
      max: 300,
      min: 100,
      align: 'left'
    },
    {
      key: '7',
      name: '计量单位',
      nameNew: '计量单位',
      check: true,
      width: 80,
      max: 150,
      min: 80,
      align: 'center'
    },
    {
      key: '8',
      name: '数量',
      nameNew: '数量',
      check: true,
      width: 80,
      max: 150,
      min: 80,
      align: 'right'
    },
    {
      key: '9',
      name: '级次',
      nameNew: '级次',
      check: true,
      width: 60,
      max: 150,
      min: 60,
      align: 'right'
    },
    {
      key: '10',
      name: '业务部门',
      nameNew: '业务部门',
      check: true,
      width: 80,
      max: 150,
      min: 80,
      align: 'left'
    },
    {
      key: '11',
      name: '业务员',
      nameNew: '业务员',
      check: true,
      width: 80,
      max: 150,
      min: 80,
      align: 'left'
    },
    {
      key: '12',
      name: '费用',
      nameNew: '费用',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'right'
    },
    {
      key: '13',
      name: '备注',
      nameNew: '备注',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'left'
    },
    {
      key: '14',
      name: '经手人',
      nameNew: '经手人',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'left'
    },
    {
      key: '15',
      name: '审核人',
      nameNew: '审核人',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'left'
    },
  ],
  MX: [
    {
      key: '0',
      name: '状态',
      nameNew: '状态',
      check: true,
      width: 80,
      max: 150,
      min: 80,
      align: 'center'
    },
    {
      key: '1',
      name: '单据日期',
      nameNew: '单据日期',
      check: true,isFixed: true,
      width: 120,
      max: 150,
      min: 80,
      align: 'center'
    },
    {
      key: '2',
      name: '单据编号',
      nameNew: '单据编号',
      check: true,isFixed: true,
      width: 120,
      max: 200,
      min: 80,
      align: 'left'
    },
    {
      key: '3',
      name: '业务类型',
      nameNew: '业务类型',
      check: true,
      width: 80,
      max: 150,
      min: 80,
      align: 'center'
    },
    {
      key: '4',
      name: 'BOM存货名称',
      nameNew: 'BOM存货名称',
      check: true,isFixed: true,
      width: 150,
      max: 300,
      min: 100,
      align: 'left'
    },
    {
      key: '5',
      name: 'BOM版本号',
      nameNew: 'BOM版本号',
      check: true,
      width: 100,
      max: 200,
      min: 100,
      align: 'left'
    },
    {
      key: '6',
      name: 'BOM版本名称',
      nameNew: 'BOM版本名称',
      check: true,
      width: 150,
      max: 300,
      min: 100,
      align: 'left'
    },
    {
      key: '7',
      name: '计量单位',
      nameNew: '计量单位',
      check: true,
      width: 80,
      max: 150,
      min: 80,
      align: 'center'
    },
    {
      key: '8',
      name: '数量',
      nameNew: '数量',
      check: true,
      width: 80,
      max: 150,
      min: 80,
      align: 'right'
    },
    {
      key: '9',
      name: '级次',
      nameNew: '级次',
      check: true,
      width: 60,
      max: 150,
      min: 60,
      align: 'right'
    },
    {
      key: '10',
      name: '业务部门',
      nameNew: '业务部门',
      check: true,
      width: 80,
      max: 150,
      min: 80,
      align: 'left'
    },
    {
      key: '11',
      name: '业务员',
      nameNew: '业务员',
      check: true,
      width: 80,
      max: 150,
      min: 80,
      align: 'left'
    },
    {
      key: '12',
      name: '费用',
      nameNew: '费用',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'right'
    },
    {
      key: '13',
      name: '类型',
      nameNew: '类型',
      check: true,
      width: 60,
      max: 80,
      min: 60,
      align: 'left'
    },
    {
      key: '14',
      name: '项目',
      nameNew: '项目',
      check: true,
      width: 150,
      max: 300,
      min: 100,
      align: 'left'
    },
    {
      key: '15',
      name: '存货编码',
      nameNew: '存货编码',
      check: true, isFixed: false,
      width: 120,
      max: 150,
      min: 100,
      align: 'left'
    },
    {
      key: '16',
      name: '条形码',
      nameNew: '条形码',
      check: true, isFixed: false,
      width: 150,
      max: 300,
      min: 100,
      align: 'left'
    },
    {
      key: '17',
      name: '存货名称',
      nameNew: '存货名称',
      check: true, isFixed: true,
      width: 200,
      max: 300,
      min: 100,
      align: 'left'
    },
    {
      key: '18',
      name: '规格型号',
      nameNew: '规格型号',
      check: true, isFixed: false,
      width: 100,
      max: 300,
      min: 100,
      align: 'left'
    },
    {
      key: '19',
      name: '计量单位',
      nameNew: '计量单位',
      check: true, isFixed: true,
      width: 80,
      max: 150,
      min: 80,
      align: 'center'
    },
    {
      key: '20',
      name: '数量',
      nameNew: '数量',
      check: true, isFixed: true,
      width: 80,
      max: 150,
      min: 80,
      align: 'right'
    },
    {
      key: '21',
      name: '主计量',
      nameNew: '主计量',
      check: true, isFixed: false,
      width: 60,
      max: 150,
      min: 60,
      align: 'center'
    },
    {
      key: '22',
      name: '主数量',
      nameNew: '主数量',
      check: true, isFixed: false,
      width: 100,
      max: 150,
      min: 100,
      align: 'right'
    },
    {
      key: '23',
      name: '单价',
      nameNew: '单价',
      check: true, isFixed: false,
      width: 100,
      max: 150,
      min: 100,
      align: 'right'
    },
    {
      key: '24',
      name: '材料金额',
      nameNew: '材料金额',
      check: true, isFixed: false,
      width: 100,
      max: 150,
      min: 100,
      align: 'right'
    },
    {
      key: '25',
      name: '费用金额',
      nameNew: '费用金额',
      check: true, isFixed: false,
      width: 100,
      max: 250,
      min: 100,
      align: 'right'
    },
    {
      key: '26',
      name: '金额',
      nameNew: '金额',
      check: true, isFixed: false,
      width: 100,
      max: 250,
      min: 100,
      align: 'right'
    },
    {
      key: '27',
      name: '出入库单号',
      nameNew: '出入库单号',
      check: true, isFixed: false,
      width: 100,
      max: 250,
      min: 100,
      align: 'left'
    },
    {
      key: '28',
      name: '定额损耗',
      nameNew: '定额损耗',
      check: true, isFixed: false,
      width: 100,
      max: 250,
      min: 100,
      align: 'right'
    },
    {
      key: '29',
      name: '实际损耗',
      nameNew: '实际损耗',
      check: true, isFixed: false,
      width: 100,
      max: 250,
      min: 100,
      align: 'right'
    },
    {
      key: '30',
      name: '备注',
      nameNew: '备注',
      check: true, isFixed: false,
      width: 100,
      max: 250,
      min: 100,
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
