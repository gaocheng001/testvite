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
      key: '2',
      title: '显示名称',
      dataIndex: 'nameNew',
      width: 150,
      align: 'left',
      slots: { customRender: 'nameInput', },
    },
    {
      key: '3',
      title: '宽度(范围)',
      dataIndex: 'width',
      align: 'center',
      width: 140,
      slots: { customRender: 'widthInput', },
    },
    {
      key: '4',
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
      name: "条形码",
      nameNew: "条形码",
      check: true,
      width: 90,
      max: 200,
      min: 90,align: 'left'
    },
    {
      key: '1',
      name: '存货编码',
      nameNew: '存货编码',
      check: true,
      isFixed: true,
      width: 120,
      max: 200,
      min: 120,
      align: 'left'
    },
    {
      key: '2',
      name: '存货名称',
      nameNew: '存货名称',
      check: true,
      isFixed: true,
      width: 200,
      max: 300,
      min: 100,
      align: 'left'
    },
    {
      key: '3',
      name: '规格型号',
      nameNew: '规格型号',
      check: true,
      isFixed: true,
      width: 80,
      max: 200,
      min: 80,
      align: 'left'
    },
    {
      key: '4',
      name: '计量单位',
      nameNew: '计量单位',
      check: true,
      isFixed: true,
      width: 90,
      max: 150,
      min: 90,
      align: 'center'
    },
    {
      key: '5',
      name: '数量',
      nameNew: '数量',
      check: true,
      isFixed: true,
      width: 100,
      max: 150,
      min: 100,
      align: 'right'
    },
    {
      key: '6',
      name: '主计量',
      nameNew: '主计量',
      check: false,
      width: 60,
      max: 150,
      min: 60,
      align: 'center'
    },
    {
      key: '7',
      name: '主数量',
      nameNew: '主数量',
      check: false,
      width: 80,
      max: 150,
      min: 80,
      align: 'right'
    },
    {
      key: '8',
      name: "批号",
      nameNew: "批号",
      check: true,
      width: 150,
      max: 200,
      min: 100,
    },
    {
      key: '9',
      name: "生产日期",
      nameNew: "生产日期",
      check: false,
      width: 120,
      max: 150,
      min: 100,
    },
    {
      key: '10',
      name: "失效日期",
      nameNew: "失效日期",
      check: true,
      width: 150,
      max: 200,
      min: 100,
    },
    {
      key: '11',
      name: "备注",
      nameNew: "备注",
      check: true,
      width: 150,
      max: 200,
      min: 100,
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
