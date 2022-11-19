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
      key: '0',
      name: '条形码',
      nameNew: '条形码',
      check: true,
      width: 120,
      max: 150,
      min: 100,
      align: 'left'
    }, {
      key: '1',
      name: '存货编码',
      nameNew: '存货编码',
      check: true,
      width: 120,
      max: 150,
      min: 100,
      align: 'left'
    }, {
      key: '2',
      name: '存货名称',
      nameNew: '存货名称',
      check: true,
      width: 200,
      max: 300,
      min: 100,
      align: 'left'
    }, {
      key: '3',
      name: '规格型号',
      nameNew: '规格型号',
      check: true,
      width: 120,
      max: 150,
      min: 100,
      align: 'left'
    }, {
      key: '4',
      name: '计量单位',
      nameNew: '计量单位',
      check: true,
      width: 100,
      max: 150,
      min: 100,
      align: 'center'
    }, {
      key: '5',
      name: '数量',
      nameNew: '数量',
      check: true,
      width: 120,
      max: 150,
      min: 100,
      align: 'center'
    }, {
      key: '6',
      name: '价税合计',
      nameNew: '价税合计',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'right'
    }, {
      key: '7',
      name: '累计出库数量',
      nameNew: '累计出库数量',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'center'
    }, {
      key: '8',
      name: '累计退货数量',
      nameNew: '累计退货数量',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'center'
    }, {
      key: '9',
      name: '累计开票数量',
      nameNew: '累计开票数量',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'center'
    }
  ],
  '2': [
    {
      key: '0',
      name: '销售客户编码',
      nameNew: '销售客户编码',
      check: true,
      width: 120,
      max: 150,
      min: 100,
      align: 'left'
    }, {
      key: '1',
      name: '销售客户名称',
      nameNew: '销售客户名称',
      check: true,
      width: 200,
      max: 300,
      min: 150,
      align: 'left'
    }, {
      key: '2',
      name: '结算客户名称',
      nameNew: '结算客户名称',
      check: true,
      width: 200,
      max: 300,
      min: 150,
      align: 'left'
    }, {
      key: '3',
      name: '主数量',
      nameNew: '主数量',
      check: true,
      width: 120,
      max: 150,
      min: 100,
      align: 'center'
    }, {
      key: '4',
      name: '无税金额',
      nameNew: '无税金额',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'right'
    },{
      key: '5',
      name: '税额',
      nameNew: '税额',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'right'
    }, {
      key: '6',
      name: '价税合计',
      nameNew: '价税合计',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'right'
    }, {
      key: '7',
      name: '累计出库数量',
      nameNew: '累计出库数量',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'center'
    }, {
      key: '8',
      name: '累计退货数量',
      nameNew: '累计退货数量',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'center'
    }, {
      key: '9',
      name: '累计开票数量',
      nameNew: '累计开票数量',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'center'
    }, {
      key: '10',
      name: '累计结款金额',
      nameNew: '累计结款金额',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'right'
    }
  ],
  '3': [
    {
      key: '0',
      name: '业务员',
      nameNew: '业务员',
      check: true,
      width: 120,
      max: 150,
      min: 100,
      align: 'left'
    },
    {
      key: '1',
      name: '销售客户编码',
      nameNew: '销售客户编码',
      check: true,
      width: 120,
      max: 150,
      min: 100,
      align: 'left'
    }, {
      key: '2',
      name: '销售客户名称',
      nameNew: '销售客户名称',
      check: true,
      width: 200,
      max: 300,
      min: 150,
      align: 'left'
    }, {
      key: '3',
      name: '结算客户名称',
      nameNew: '结算客户名称',
      check: true,
      width: 200,
      max: 300,
      min: 150,
      align: 'left'
    }, {
      key: '4',
      name: '主数量',
      nameNew: '主数量',
      check: true,
      width: 120,
      max: 150,
      min: 100,
      align: 'center'
    },{
      key: '5',
      name: '价税合计',
      nameNew: '价税合计',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'right'
    }, {
      key: '6',
      name: '累计出库数量',
      nameNew: '累计出库数量',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'center'
    }, {
      key: '7',
      name: '累计退货数量',
      nameNew: '累计退货数量',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'center'
    }, {
      key: '8',
      name: '累计开票数量',
      nameNew: '累计开票数量',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'center'
    }, {
      key: '9',
      name: '累计结款金额',
      nameNew: '累计结款金额',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'right'
    }
  ],
  '4': [
    {
      key: '0',
      name: '地区',
      nameNew: '地区',
      check: true,
      width: 200,
      max: 300,
      min: 150,
      align: 'left'
    },
    {
      key: '1',
      name: '销售客户编码',
      nameNew: '销售客户编码',
      check: true,
      width: 120,
      max: 150,
      min: 100,
      align: 'left'
    }, {
      key: '2',
      name: '销售客户名称',
      nameNew: '销售客户名称',
      check: true,
      width: 200,
      max: 300,
      min: 150,
      align: 'left'
    }, {
      key: '3',
      name: '结算客户名称',
      nameNew: '结算客户名称',
      check: true,
      width: 200,
      max: 300,
      min: 150,
      align: 'left'
    }, {
      key: '4',
      name: '主数量',
      nameNew: '主数量',
      check: true,
      width: 120,
      max: 150,
      min: 100,
      align: 'center'
    },{
      key: '5',
      name: '价税合计',
      nameNew: '价税合计',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'right'
    }, {
      key: '6',
      name: '累计出库数量',
      nameNew: '累计出库数量',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'center'
    }, {
      key: '7',
      name: '累计退货数量',
      nameNew: '累计退货数量',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'center'
    }, {
      key: '8',
      name: '累计开票数量',
      nameNew: '累计开票数量',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'center'
    }, {
      key: '9',
      name: '累计结款金额',
      nameNew: '累计结款金额',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'right'
    }
  ]
})
const columnPropertyModel = {
  '1': [
    {
      title: '条形码',
      dataIndex: 'cinvodeBarcode',
      width: 120,
      align: 'left',
      ellipsis: true,
      slots: {customRender: 'cinvodeBarcode'}
    },
    {
      title: '存货编码',
      dataIndex: 'cinvode',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: {customRender: 'cinvode'}
    }, {
      title: '存货名称',
      dataIndex: 'cinvodeName',
      width: 200,
      align: 'left',
      ellipsis: true,
      slots: {customRender: 'cinvodeName'}
    },
    {
      title: '规格型号',
      dataIndex: 'speciType',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: {customRender: 'speciType'}
    },
    {
      title: '计量单位',
      dataIndex: 'cunitid',
      width: 150,
      align: 'center',
      ellipsis: true,
      slots: {customRender: 'cunitid'}
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      width: 150,
      align: 'center',
      ellipsis: true,
      slots: {customRender: 'quantity'}
    },
    {
      title: '价税合计',
      dataIndex: 'isum',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: {customRender: 'isum'}
    }, {
      title: '累计出库数量',
      dataIndex: 'isumChuku',
      width: 150,
      align: 'center',
      ellipsis: true,
      slots: {customRender: 'isumChuku'}
    }, {
      title: '累计退货数量',
      dataIndex: 'isumTuiHuo',
      width: 150,
      align: 'center',
      ellipsis: true,
      slots: {customRender: 'isumTuiHuo'}
    }, {
      title: '累计开票数量',
      dataIndex: 'isumFapiao',
      width: 150,
      align: 'center',
      ellipsis: true,
      slots: {customRender: 'isumFapiao'}
    }],
  '2': [
    {
      title: '销售客户编码',
      dataIndex: 'cvencodeCode',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: {customRender: 'cvencodeCode'}
    }, {
      title: '销售客户名称',
      dataIndex: 'cvencode',
      width: 200,
      align: 'left',
      ellipsis: true,
      slots: {customRender: 'cvencode'}
    },
    {
      title: '结算客户名称',
      dataIndex: 'cvencodeJs',
      width: 200,
      align: 'left',
      ellipsis: true,
      slots: {customRender: 'cvencodeJs'}
    },
    {
      title: '主数量',
      dataIndex: 'baseQuantity',
      width: 150,
      align: 'center',
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
    }, {
      title: '累计出库数量',
      dataIndex: 'isumChuku',
      width: 150,
      align: 'center',
      ellipsis: true,
      slots: {customRender: 'isumChuku'}
    }, {
      title: '累计退货数量',
      dataIndex: 'isumTuiHuo',
      width: 150,
      align: 'center',
      ellipsis: true,
      slots: {customRender: 'isumTuiHuo'}
    }, {
      title: '累计开票数量',
      dataIndex: 'isumFapiao',
      width: 150,
      align: 'center',
      ellipsis: true,
      slots: {customRender: 'isumFapiao'}
    }, {
      title: '累计结款金额',
      dataIndex: 'hxIsum',
      width: 200,
      align: 'right',
      ellipsis: true,
      slots: {customRender: 'hxIsum'}
    }],
  '3': [
    {
      title: '业务员',
      dataIndex: 'cpersoncode',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: {customRender: 'cpersoncode'}
    },
    {
      title: '销售客户编码',
      dataIndex: 'cvencodeCode',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: {customRender: 'cvencodeCode'}
    }, {
      title: '销售客户名称',
      dataIndex: 'cvencode',
      width: 200,
      align: 'left',
      ellipsis: true,
      slots: {customRender: 'cvencode'}
    },
    {
      title: '结算客户名称',
      dataIndex: 'cvencodeJs',
      width: 200,
      align: 'left',
      ellipsis: true,
      slots: {customRender: 'cvencodeJs'}
    },
    {
      title: '主数量',
      dataIndex: 'baseQuantity',
      width: 150,
      align: 'center',
      ellipsis: true,
      slots: {customRender: 'baseQuantity'}
    },
    {
      title: '价税合计',
      dataIndex: 'isum',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: {customRender: 'isum'}
    }, {
      title: '累计出库数量',
      dataIndex: 'isumChuku',
      width: 150,
      align: 'center',
      ellipsis: true,
      slots: {customRender: 'isumChuku'}
    }, {
      title: '累计退货数量',
      dataIndex: 'isumTuiHuo',
      width: 150,
      align: 'center',
      ellipsis: true,
      slots: {customRender: 'isumTuiHuo'}
    }, {
      title: '累计开票数量',
      dataIndex: 'isumFapiao',
      width: 150,
      align: 'center',
      ellipsis: true,
      slots: {customRender: 'isumFapiao'}
    }, {
      title: '累计结款金额',
      dataIndex: 'hxIsum',
      width: 200,
      align: 'right',
      ellipsis: true,
      slots: {customRender: 'hxIsum'}
    }],
  '4': [
    {
      title: '地区',
      dataIndex: 'region',
      width: 200,
      align: 'left',
      ellipsis: true,
      slots: {customRender: 'region'}
    },
    {
      title: '销售客户编码',
      dataIndex: 'cvencodeCode',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: {customRender: 'cvencodeCode'}
    }, {
      title: '销售客户名称',
      dataIndex: 'cvencode',
      width: 200,
      align: 'left',
      ellipsis: true,
      slots: {customRender: 'cvencode'}
    },
    {
      title: '结算客户名称',
      dataIndex: 'cvencodeJs',
      width: 200,
      align: 'left',
      ellipsis: true,
      slots: {customRender: 'cvencodeJs'}
    },
    {
      title: '主数量',
      dataIndex: 'baseQuantity',
      width: 150,
      align: 'center',
      ellipsis: true,
      slots: {customRender: 'baseQuantity'}
    },
    {
      title: '价税合计',
      dataIndex: 'isum',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: {customRender: 'isum'}
    }, {
      title: '累计出库数量',
      dataIndex: 'isumChuku',
      width: 150,
      align: 'center',
      ellipsis: true,
      slots: {customRender: 'isumChuku'}
    }, {
      title: '累计退货数量',
      dataIndex: 'isumTuiHuo',
      width: 150,
      align: 'center',
      ellipsis: true,
      slots: {customRender: 'isumTuiHuo'}
    }, {
      title: '累计开票数量',
      dataIndex: 'isumFapiao',
      width: 150,
      align: 'center',
      ellipsis: true,
      slots: {customRender: 'isumFapiao'}
    }, {
      title: '累计结款金额',
      dataIndex: 'hxIsum',
      width: 200,
      align: 'right',
      ellipsis: true,
      slots: {customRender: 'hxIsum'}
    }]
}

export function changeDefaultDynamics(list) {
  // 改变默认数据
  dynamicColumnAndDataModel['DATA'] = list
}

export function initDynamics() {
  return dynamicColumnAndDataModel
}

export function getTablePropertys(key) {
  return columnPropertyModel[key]
}

export function assemblyDynamicColumn(lanmuList: any, columnList: any) {
  columnList.forEach(cObj => {
    lanmuList.forEach((lObj, index) => {
      if (cObj.title === lObj.name) {
        cObj.title = thisName(index + '', lanmuList)
        cObj.width = thisWidth(index + '', lanmuList)
        cObj.align = thisAlign(index + '', lanmuList)
        cObj.ifShow = thisIsShow(index + '', lanmuList)
      }
    })
  })
  return columnList;
}

/*********************** 静态方法 ***********************/
// 动态名称
const thisName = (index,thisData)=>{
  let value = ''
  if (index.toString().indexOf('-') != -1){
    let arr = index.split('-');
    if (arr.length == 2)  {
      value = thisData[parseInt(arr[0])].children[parseInt(arr[1])-1].nameNew
      if ('' == value)value = thisData[parseInt(arr[0])].children[parseInt(arr[1])-1].name
    }else{
      value = thisData[parseInt(arr[0])].children[parseInt(arr[1])-1].children[parseInt(arr[2])-1].nameNew
      if ('' == value)value = thisData[parseInt(arr[0])].children[parseInt(arr[1])-1].children[parseInt(arr[2])-1].name
    }
  }else{
    value = thisData[index].nameNew
    if ('' == value)value = thisData[index].name
  }
  return value
}
// 当前宽度
const thisWidth = (index,thisData)=>{
  let value:any = 0
  if (index.toString().indexOf('-') != -1){
    let arr = index.split('-');
    if (arr.length == 2)  {
      value = thisData[parseInt(arr[0])].children[parseInt(arr[1])-1].width
    }else{
      value = thisData[parseInt(arr[0])].children[parseInt(arr[1])-1].children[parseInt(arr[2])-1].width
    }
  }else{
    value = thisData[index].width
  }
  return parseInt(value)
}
// 是否显示
const thisIsShow = (index,thisData)=>{
  let value = false
  if (index.toString().indexOf('-') != -1){
    let arr = index.split('-');
    if (arr.length == 2)  {
      value = thisData[parseInt(arr[0])].children[parseInt(arr[1])-1].check
    }else{
      value = thisData[parseInt(arr[0])].children[parseInt(arr[1])-1].children[parseInt(arr[2])-1].check
    }
  }else{
    value = thisData[index].check
  }
  return  value
}
// 对齐方式
const thisAlign = (index,thisData)=>{
  let value = 'center';
  if (index.toString().indexOf('-') != -1){
    let arr = index.split('-');
    if (arr.length == 2)  {
      value = thisData[parseInt(arr[0])].children[parseInt(arr[1])-1].align
    }else{
      value = thisData[parseInt(arr[0])].children[parseInt(arr[1])-1].children[parseInt(arr[2])-1].align
    }
  }else{
    value = thisData[index].align
  }
  return  value
}
