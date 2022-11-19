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
      width: 70,
      max: 100,
      min: 70,
      align: 'center'
    },
    {
      key: '1',
      name: '单据日期',
      nameNew: '单据日期',
      check: true,isFixed: true,
      width: 90,
      max: 120,
      min: 90,
      align: 'center'
    },
    {
      key: '2',
      name: '单据编号',
      nameNew: '单据编号',
      check: true,isFixed: true,
      width: 100,
      max: 150,
      min: 100,
      align: 'left'
    },
    {
      key: '3',
      name: '单位类型',
      nameNew: '单位类型',
      check: true,isFixed: true,
      width: 100,
      max: 200,
      min: 100,
      align: 'left'
    },
    {
      key: '4',
      name: '借入单位名称',
      nameNew: '借入单位名称',
      check: true,isFixed: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'left'
    },{
      key: '5',
      name: '业务部门',
      nameNew: '业务部门',
      check: true,
      width: 100,
      max: 200,
      min: 100,
      align: 'left'
    },
    {
      key: '6',
      name: '业务员',
      nameNew: '业务员',
      check: true,
      width: 80,
      max: 150,
      min: 80,
      align: 'left'
    },
    {
      key: '7',
      name: '条形码',
      nameNew: '条形码',
      check: true,
      width: 100,
      max: 200,
      min: 100,
      align: 'left'
    },{
      key: '8',
      name: '存货编码',
      nameNew: '存货编码',
      check: true,
      width: 80,
      max: 200,
      min: 80,
      align: 'left'
    },
    {
      key: '9',
      name: '存货名称',
      nameNew: '存货名称',
      check: true,isFixed: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'left'
    },
    {
      key: '10',
      name: '规格型号',
      nameNew: '规格型号',
      check: true,
      width: 100,
      max: 200,
      min: 100,
      align: 'left'
    },
    {
      key: '11',
      name: '计量单位',
      nameNew: '计量单位',
      check: true,isFixed: true,
      width: 80,
      max: 150,
      min: 80,
      align: 'left'
    },
    {
      key: '12',
      name: '数量',
      nameNew: '数量',
      check: true,isFixed: true,
      width: 80,
      max: 150,
      min: 80,
      align: 'right'
    },
    {
      key: '13',
      name: '主计量',
      nameNew: '主计量',
      check: true,
      width: 60,
      max: 100,
      min: 60,
      align: 'left'
    },
    {
      key: '14',
      name: '主数量',
      nameNew: '主数量',
      check: true,
      width: 100,
      max: 150,
      min: 100,
      align: 'right'
    },
    // {
    //   key: '15',
    //   name: '批号',
    //   nameNew: '批号',
    //   check: true,
    //   width: 100,
    //   max: 200,
    //   min: 100,
    //   align: 'left'
    // },
    {
      key: '15',
      name: '预计归还日期',
      nameNew: '预计归还日期',
      check: true,
      width: 100,
      max: 150,
      min: 100,
      align: 'center'
    },{
      key: '16',
      name: '已归还数量',
      nameNew: '已归还数量',
      check: true,
      width: 100,
      max: 200,
      min: 100,
      align: 'right'
    },{
      key: '17',
      name: '未归还数量',
      nameNew: '未归还数量',
      check: true,
      width: 100,
      max: 200,
      min: 100,
      align: 'right'
    },{
      key: '18',
      name: '转换为赠送数量',
      nameNew: '转换为赠送数量',
      check: true,
      width: 100,
      max: 200,
      min: 100,
      align: 'right'
    },{
      key: '19',
      name: '转换为采购数量',
      nameNew: '转换为采购数量',
      check: true,
      width: 100,
      max: 200,
      min: 100,
      align: 'right'
    },{
      key: '20',
      name: '入库数量',
      nameNew: '入库数量',
      check: true,
      width: 80,
      max: 200,
      min: 100,
      align: 'right'
    },{
      key: '21',
      name: '制单人',
      nameNew: '制单人',
      check: true,
      width: 80,
      max: 200,
      min: 80,
      align: 'left'
    },{
      key: '22',
      name: '审核人',
      nameNew: '审核人',
      check: true,
      width: 80,
      max: 200,
      min: 80,
      align: 'left'
    }
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
