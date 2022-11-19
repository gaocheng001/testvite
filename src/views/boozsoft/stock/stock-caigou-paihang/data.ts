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
  '1': [
     {
      key: '1',
      name: '存货编码',
      nameNew: '存货编码',
      check: true,isFixed: true,
      width: 120,
      max: 150,
      min: 100,
      align: 'left'
    }, {
      key: '2',
      name: '存货名称',
      nameNew: '存货名称',
      check: true,isFixed: true,
      width: 200,
      max: 300,
      min: 100,
      align: 'left'
    },{
      key: '12',
      name: '条形码',
      nameNew: '条形码',
      check: true,isFixed: false,
      width: 150,
      max: 300,
      min: 100,
      align: 'left'
    },{
      key: '13',
      name: '规格型号',
      nameNew: '规格型号',
      check: true,isFixed: false,
      width: 100,
      max: 300,
      min: 100,
      align: 'left'
    }, {
      key: '14',
      name: '计量单位',
      nameNew: '计量单位',
      check: true,isFixed: false,
      width: 80,
      max: 150,
      min: 80,
      align: 'center'
    },{
      key: '15',
      name: '数量',
      nameNew: '数量',
      check: true,isFixed: false,
      width: 80,
      max: 150,
      min: 80,
      align: 'right'
    },
    {
      key: '5',
      name: '主计量',
      nameNew: '主计量',
      check: true,isFixed: false,
      width: 60,
      max: 150,
      min: 60,
      align: 'center'
    },
    {
      key: '4',
      name: '主数量',
      nameNew: '主数量',
      check: true,isFixed: false,
      width: 80,
      max: 150,
      min: 80,
      align: 'right'
    },
    {
      key: '7',
      name: '无税金额',
      nameNew: '无税金额',
      check: true,isFixed: false,
      width: 100,
      max: 150,
      min: 100,
      align: 'right'
    },{
      key: '8',
      name: '税额',
      nameNew: '税额',
      check: true,isFixed: false,
      width: 100,
      max: 150,
      min: 100,
      align: 'right'
    },{
      key: '9',
      name: '价税合计',
      nameNew: '价税合计',
      check: true,isFixed: false,
      width: 100,
      max: 150,
      min: 100,
      align: 'right'
    },
  ],
  '2': [
    {
      key: '0',
      name: '供应商编码',
      nameNew: '供应商编码',
      check: true,isFixed: true,
      width: 120,
      max: 150,
      min: 100,
      align: 'left'
    }, {
      key: '1',
      name: '供应商名称',
      nameNew: '供应商名称',
      check: true,isFixed: true,
      width: 150,
      max: 300,
      min: 150,
      align: 'left'
    }, {
      key: '2',
      name: '结算供应商编码',
      nameNew: '结算供应商编码',
      check: true,isFixed: false,
      width: 150,
      max: 300,
      min: 150,
      align: 'left'
    },
    {
      key: '11',
      name: '结算供应商名称',
      nameNew: '结算供应商名称',
      check: true,isFixed: false,
      width: 150,
      max: 300,
      min: 150,
      align: 'left'
    },{
      key: '12',
      name: '数量',
      nameNew: '数量',
      check: true,isFixed: false,
      width: 100,
      max: 150,
      min: 100,
      align: 'right'
    },
    {
      key: '4',
      name: '主数量',
      nameNew: '主数量',
      check: true,isFixed: false,
      width: 100,
      max: 150,
      min: 100,
      align: 'right'
    },
    {
      key: '7',
      name: '无税金额',
      nameNew: '无税金额',
      check: true,isFixed: false,
      width: 120,
      max: 150,
      min: 100,
      align: 'right'
    },{
      key: '8',
      name: '税额',
      nameNew: '税额',
      check: true,isFixed: false,
      width: 100,
      max: 150,
      min: 100,
      align: 'right'
    },{
      key: '9',
      name: '价税合计',
      nameNew: '价税合计',
      check: true,isFixed: false,
      width: 100,
      max: 150,
      min: 100,
      align: 'right'
    },
  ],
})
const columnPropertyModel = {
  '1': [
    {
      title: '存货编码',
      dataIndex: 'cinvode',
      width: 150,
      align: 'left',
      ellipsis: true,
    }, {
      title: '存货名称',
      dataIndex: 'stockName',
      width: 200,
      align: 'left',
      ellipsis: true,
    },{
      title: '条形码',
      dataIndex: 'stockBarcode',
      width: 200,
      align: 'left',
      ellipsis: true,
    },{
      title: '规格型号',
      dataIndex: 'stockGgxh',
      width: 200,
      align: 'left',
      ellipsis: true,
    },{
      title: '计量单位',
      dataIndex: 'unitName',
      width: 60,
      align: 'left',
      ellipsis: true,
    },{
      title: '数量',
      dataIndex: 'cnumber',
      width: 200,
      align: 'right',
      ellipsis: true,slots: {customRender: 'cnumber'}
    },{
      title: '主计量',
      dataIndex: 'mainUnitName',
      width: 200,
      align: 'right',
      ellipsis: true
    },
    {
      title: '主数量',
      dataIndex: 'baseQuantity',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: {customRender: 'baseQuantity'}
    },
    {
      title: '无税金额',
      dataIndex: 'icost',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: {customRender: 'icost'}
    },
    {
      title: '税额',
      dataIndex: 'itaxprice',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: {customRender: 'itaxprice'}
    },
    {
      title: '价税合计',
      dataIndex: 'isum',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: {customRender: 'isum'}
    }
    ],
  '2': [
    {
      title: '供应商编码',
      dataIndex: 'custCode',
      width: 150,
      align: 'left',
      ellipsis: true,
    }, {
      title: '供应商名称',
      dataIndex: 'custName',
      width: 200,
      align: 'left',
      ellipsis: true,
    },
    {
      title: '结算供应商编码',
      dataIndex: 'jscustCode',
      width: 200,
      align: 'left',
      ellipsis: true,
    },
    {
      title: '结算供应商名称',
      dataIndex: 'jscustName',
      width: 200,
      align: 'left',
      ellipsis: true,
    },
    {
      title: '数量',
      dataIndex: 'cnumber',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: {customRender: 'cnumber'}
    },
    {
      title: '主数量',
      dataIndex: 'baseQuantity',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: {customRender: 'baseQuantity'}
    },
    {
      title: '无税金额',
      dataIndex: 'icost',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: {customRender: 'icost'}
    },
    {
      title: '税额',
      dataIndex: 'itaxprice',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: {customRender: 'itaxprice'}
    },
    {
      title: '价税合计',
      dataIndex: 'isum',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: {customRender: 'isum'}
    }],
}
export function getTablePropertys(key) {
  return columnPropertyModel[key]
}
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
