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
    /*   {
         key: '1',
         title: '显示',
         dataIndex: 'check',
         align: 'center',
         width: 80,
         slots: {customRender: 'checkBox'},
       },*/
    {
      key: '3',
      title: '显示名称',
      dataIndex: 'nameNew',
      width: 150,
      align: 'left',
      slots: {customRender: 'nameInput',},
    },
    {
      key: '4',
      title: '宽度(范围)',
      dataIndex: 'width',
      align: 'center',
      width: 140,
      slots: {customRender: 'widthInput',},
    },
    {
      key: '5',
      title: '对齐方式',
      dataIndex: 'align',
      align: 'center',
      width: 140,
      slots: {customRender: 'alignRadio'},
    }
  ],
  DATA1: [
    {
      key: '0',
      name: '存货编码',
      nameNew: '存货编码',
      check: true,
      width: 120,
      max: 180,
      min: 50,
      align: 'left'
    },
    {
      key: '1',
      name: '存货名称',
      nameNew: '存货名称',
      check: true,
      width: 180,
      max: 200,
      min: 120,
      align: 'left'
    }, {
      key: '2',
      name: '规格型号',
      nameNew: '规格型号',
      check: true,
      width: 100,
      max: 120,
      min: 60,
      align: 'left'
    },
    {
      key: '3',
      name: '条形码',
      nameNew: '条形码',
      check: true,
      width: 120,
      max: 180,
      min: 50,
      align: 'left'
    },{
      key: '4',
      name: '批号',
      nameNew: '批号',
      check: true,
      width: 120,
      max: 160,
      min: 100,
      align: 'left'
    },
    {
      key: '5',
      name: '开始日期',
      nameNew: '开始日期',
      check: true,
      width: 140,
      max: 180,
      min: 120,
      align: 'center'
    },
    {
      key: '6',
      name: '结束日期',
      nameNew: '结束日期',
      check: true,
      width: 140,
      max: 180,
      min: 120,
      align: 'center'
    },
    {
      key: '7',
      name: '主计量',
      nameNew: '主计量',
      check: true,
      width: 100,
      max: 120,
      min: 80,
      align: 'right'
    },
    {
      key: '8',
      name: '账面主数量',
      nameNew: '账面主数量',
      check: true,
      width: 120,
      max: 150,
      min: 100,
      align: 'right'
    },
    {
      key: '9',
      name: '盘点主数量',
      nameNew: '盘点主数量',
      check: true,
      width: 120,
      max: 150,
      min: 100,
      align: 'right'
    },
    {
      key: '10',
      name: '计量1',
      nameNew: '计量1',
      check: true,
      width: 100,
      max: 120,
      min: 80,
      align: 'right'
    },
    {
      key: '11',
      name: '账面数量1',
      nameNew: '账面数量1',
      check: true,
      width: 120,
      max: 150,
      min: 100,
      align: 'right'
    },{
      key: '12',
      name: '盘点数量1',
      nameNew: '盘点数量1',
      check: true,
      width: 120,
      max: 150,
      min: 100,
      align: 'right'
    },
    {
      key: '13',
      name: '计量2',
      nameNew: '计量2',
      check: true,
      width: 100,
      max: 120,
      min: 80,
      align: 'right'
    },
    {
      key: '14',
      name: '账面数量2',
      nameNew: '账面数量2',
      check: true,
      width: 120,
      max: 150,
      min: 100,
      align: 'right'
    },{
      key: '15',
      name: '盘点数量2',
      nameNew: '盘点数量2',
      check: true,
      width: 120,
      max: 150,
      min: 100,
      align: 'right'
    },{
      key: '16',
      name: '盈亏主数量',
      nameNew: '盈亏主数量',
      check: true,
      width: 120,
      max: 150,
      min: 100,
      align: 'right'
    },{
      key: '17',
      name: '盈亏数量1',
      nameNew: '盈亏数量1',
      check: true,
      width: 120,
      max: 150,
      min: 100,
      align: 'right'
    },{
      key: '18',
      name: '盈亏数量2',
      nameNew: '盈亏数量2',
      check: true,
      width: 120,
      max: 150,
      min: 100,
      align: 'right'
    }
  ],
})
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
  let value = 0
  if (index.toString().indexOf('-') != -1) {
    let arr = index.split('-');
    if (arr.length == 2) {
      value = thisData[parseInt(arr[0]) - 1].children[parseInt(arr[1]) - 1].width
    } else {
      value = thisData[parseInt(arr[0])-1].children[parseInt(arr[1]) - 1].children[parseInt(arr[2]) - 1].width
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

export function changeDefaultDynamics(list, num) {
  // 改变默认数据
  dynamicColumnAndDataModel['DATA' + num] = list
}

export function initDynamics() {
  return dynamicColumnAndDataModel
}

export function assemblyDynamicColumn(lanmuList: any, columnList: any) {
  columnList.forEach(cObj => {
    lanmuList.forEach((lObj, index) => {
      if (cObj.title === lObj.name) {
        cObj.title = thisName(index + '', lanmuList)
        cObj.width = thisWidth(index + '', lanmuList)
        cObj.align = thisAlign(index + '', lanmuList)
        cObj.ifShow = thisIsShow(index + '', lanmuList)
        if (null != cObj?.children && cObj?.children.length > 0){
          cObj.children.forEach(chiObj => {
            chiObj.width = thisWidth(chiObj.key + '', lanmuList)
          })
        }
      }
    })
  })
  return columnList;
}

export const voucherNoAutocomplete = (val, rule) => {
  let numberStr = parseInt(val) + ''
  let difference = rule - numberStr.length
  let prefix = ''
  let i = 0
  while (i < difference) {
    prefix += '0'
    i++;
  }
  return prefix + numberStr
}


export function isRealNum(val) {
  // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除，
  if (val === "" || val == null) {
    return false;
  }
  if (!isNaN(val)) {
    //对于空数组和只有一个数值成员的数组或全是数字组成的字符串，isNaN返回false，例如：'123'、[]、[2]、['123'],isNaN返回false,   //所以如果不需要val包含这些特殊情况，则这个判断改写为if(!isNaN(val) && typeof val === 'number' )
    return true;
  } else {
    return false;
  }
}
export function money(val: any) { // 金额格式化
  if (val == null) val = ''
  val = val.toString().replace(/\$|\,/g, '')
  if (isNaN(val)) {
    val = '0'
  }
  const sign = (val === (val = Math.abs(val)))
  val = Math.floor(val * 100 + 0.50000000001)
  let cents: string = (val % 100) + ''
  val = Math.floor(val / 100).toString()
  if (parseInt(cents) < 10) {
    cents = '0' + cents
  }
  for (let i = 0; i < Math.floor((val.length - (1 + i)) / 3); i++) {
    val = val.substring(0, val.length - (4 * i + 3)) + ',' + val.substring(val.length - (4 * i + 3))
  }
  let re = (((sign) ? '' : '') + val + '.' + cents)
  return re == ('0.00' || '0') ? '' : re
}
export function combineParameters(staticList: any, dbList: any) {
  staticList.forEach(item => {
    dbList.forEach(item2 => {
      if (item.key === item2.key && item.name === item2.name) {
        item.nameNew = item2.nameNew
        item.width = parseInt(item2.width)
        item.check = item2.check == 'true'
        item.align = item2.align
      }
    })
  })
  return staticList
}
export const intervalWorking = (val) => {
  return val.replace(/-/g,'.').replace(/~/g,'-')
}