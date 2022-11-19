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
      name: '单据日期',
      nameNew: '单据日期',
      check: true,
      isFixed: true,
      width: 90,
      max: 120,
      min: 80,
      align: 'center'
    },
    {
      key: '1',
      name: '单据编号',
      nameNew: '单据编号',
      check: true,
      isFixed: true,
      width: 120,
      max: 200,
      min: 100,
      align: 'left'
    },
    {
      key: '2',
      name: '销货状态',
      nameNew: '销货状态',
      check: true,
      isFixed: true,
      width: 80,
      max: 100,
      min: 80,
      align: 'center'
    },{
      key: '3',
      name: '出库状态',
      nameNew: '出库状态',
      check: true,
      width: 80,
      max: 100,
      min: 80,
      align: 'center'
    },{
      key: '4',
      name: '发票状态',
      nameNew: '发票状态',
      check: true,
      width: 80,
      max: 100,
      min: 80,
      align: 'center'
    },{
      key: '5',
      name: '收款状态',
      nameNew: '收款状态',
      check: true,
      width: 80,
      max: 100,
      min: 80,
      align: 'center'
    },
    {
      key: '6',
      name: '销售客户编码',
      nameNew: '销售客户编码',
      check: true,
      width: 120,
      max: 150,
      min: 100,
      align: 'left'
    }, {
      key: '7',
      name: '销售客户名称',
      nameNew: '销售客户名称',
      isFixed: true,
      check: true,
      width: 200,
      max: 300,
      min: 150,
      align: 'left'
    },
    {
      key: '8',
      name: '结算客户编码',
      nameNew: '结算客户编码',
      check: true,
      width: 120,
      max: 150,
      min: 100,
      align: 'left'
    },{
      key: '9',
      name: '结算客户名称',
      nameNew: '结算客户名称',
      check: true,
      width: 200,
      max: 300,
      min: 150,
      align: 'left'
    },
    {
      key: '10',
      name: '业务部门',
      nameNew: '业务部门',
      check: true,
      width: 120,
      max: 200,
      min: 100,
      align: 'left'
    },
    {
      key: '11',
      name: '业务员',
      nameNew: '业务员',
      check: true,
      width: 100,
      max: 150,
      min: 100,
      align: 'left'
    },
    {
      key: '12',
      name: '仓储位置',
      nameNew: '仓储位置',
      check: true,
      width: 90,
      max: 200,
      min: 90,
      align: 'left'
    },

    {
      key: '13',
      name: "条形码",
      nameNew: "条形码",
      check: false,
      width: 150,
      max: 200,
      min: 80, align: 'left'
    },
    {
      key: '14',
      name: '存货编码',
      nameNew: '存货编码',
      check: true,
      width: 100,
      max: 150,
      min: 100,
      align: 'left'
    }, {
      key: '15',
      name: '存货名称',
      nameNew: '存货名称',
      check: true,
      isFixed: true,
      width: 150,
      max: 250,
      min: 150,
      align: 'left'
    }, {
      key: '16',
      name: '规格型号',
      nameNew: '规格型号',
      check: true,
      width: 80,
      max: 150,
      min: 80,
      align: 'left'
    },{
      key: '17',
      name: '主计量',
      nameNew: '主计量',
      isFixed: true,
      check: true,
      width: 80,
      max: 120,
      min: 80,
      align: 'center'
    }, {
      key: '18',
      name: '主数量',
      nameNew: '主数量',
      isFixed: true,
      check: true,
      width: 80,
      max: 120,
      min: 80,
      align: 'center'
    },
    {
      key: '19',
      name: '计量一',
      nameNew: '计量1',
      check: true,
      width: 80,
      max: 120,
      min: 80,
      align: 'center'
    },
    {
      key: '20',
      name: '数量一',
      nameNew: '数量1',
      check: true,
      width: 80,
      max: 120,
      min: 80,
      align: 'center'
    },{
      key: '21',
      name: '计量二',
      nameNew: '计量2',
      check: true,
      width: 80,
      max: 120,
      min: 80,
      align: 'center'
    } ,
    {
      key: '22',
      name: '数量二',
      nameNew: '数量2',
      check: true,
      width: 80,
      max: 120,
      min: 80,
      align: 'center'
    },
    {
      key: '23',
      name: "批号",
      nameNew: "批号",
      check: true,
      width: 150,
      max: 200,
      min: 100, align: 'center'
    },{
      key: '24',
      name: "税率",
      nameNew: "税率",
      check: true,
      width: 100,
      max: 100,
      min: 80,
      align: 'center'
    }, {
      key: '25',
      name: "无税单价",
      nameNew: "无税单价",
      check: false,
      width: 150,
      max: 250,
      min: 100,
      align: 'right'
    }, {
      key: '26',
      name: "无税金额",
      nameNew: "无税金额",
      check: false,
      width: 150,
      max: 250,
      min: 100,
      align: 'right'
    },  {
      key: '27',
      name: "税额",
      nameNew: "税额",
      check: true,
      width: 150,
      max: 250,
      min: 100,
      align: 'right'
    },
    {
      key: '28',
      name: "含税单价",
      nameNew: "含税单价",
      check: true,
      width: 150,
      max: 250,
      min: 100,
      align: 'right'
    },{
      key: '29',
      name: "价税合计",
      nameNew: "价税合计",
      isFixed: true,
      check: true,
      width: 150,
      max: 250,
      min: 100,
      align: 'right'
    },
    {
      key: '30',
      name: "赠品",
      nameNew: "赠品",
      check: true,
      width: 80,
      max: 120,
      min: 80,
      align: 'center'
    },
    {
      key: '31',
      name: '累计退货数量',
      nameNew: '累计退货数量',
      check: false,
      width: 150,
      max: 150,
      min: 100,
      align: 'center'
    }, {
      key: '32',
      name: '未退货数量',
      nameNew: '未退货数量',
      check: false,
      width: 120,
      max: 150,
      min: 100,
      align: 'center'
    },
    {
      key: '33',
      name: '累计出库数量',
      nameNew: '累计出库数量',
      check: false,
      width: 150,
      max: 150,
      min: 100,
      align: 'center'
    },

    {
      key: '34',
      name: '未出库数量',
      nameNew: '未出库数量',
      check: false,
      width: 120,
      max: 150,
      min: 100,
      align: 'center'
    },
    {
      key: '35',
      name: "累计结款金额",
      nameNew: "累计结款金额",
      check: false,
      width: 150,
      max: 250,
      min: 100,
      align: 'right'
    },
    {
      key: '36',
      name: "未结款金额",
      nameNew: "未结款金额",
      check: false,
      width: 150,
      max: 250,
      min: 100,
      align: 'right'
    },
    {
      key: '37',
      name: '累计开票数量',
      nameNew: '累计开票数量',
      check: false,
      width: 150,
      max: 150,
      min: 100,
      align: 'center'
    },
    {
      key: '38',
      name: '未开票数量',
      nameNew: '未开票数量',
      check: false,
      width: 120,
      max: 150,
      min: 100,
      align: 'center'
    },
    {
      key: '39',
      name: "累计开票金额",
      nameNew: "累计开票金额",
      check: false,
      width: 150,
      max: 250,
      min: 100,
      align: 'right'
    },
    {
      key: '40',
      name: "生效日期",
      nameNew: "生效日期",
      check: true,
      width: 120,
      max: 150,
      min: 100,      align: 'center'
    },
    {
      key: '41',
      name: "失效日期",
      nameNew: "失效日期",
      check: true,
      width: 150,
      max: 200,
      min: 100,      align: 'center'
    },
    {
      key: '42',
      name: "备注",
      nameNew: "备注",
      check: true,
      width: 150,
      max: 200,
      min: 10,      align: 'left'
    },{
      key: '43',
      name: "制单人",
      nameNew: "制单人",
      check: true,
      width: 100,
      max: 120,
      min: 80,      align: 'center'
    },{
      key: '44',
      name: "审核人",
      nameNew: "审核人",
      check: true,
      width: 100,
      max: 120,
      min: 80,      align: 'center'
    },
    {
      key: '45',
      name: "复核人",
      nameNew: "复核人",
      check: true,
      width: 100,
      max: 120,
      min: 80,      align: 'center'
    }
  ],
})
const columnPropertyModel = {
  '1': [
    {
      title: '单据日期',
      dataIndex: 'ddate',
      ellipsis: true,
    },
    {
      title: '单据编号',
      dataIndex: 'ccode',
      ellipsis: true,
      slots: {customRender: 'ccode'}
    },
    {
      title: '销货状态',
      dataIndex: 'bcheck',
      ellipsis: true,
      slots: { customRender: 'bcheck' }
    },

    {
      title: '出库状态',
      dataIndex: 'chukuStatus',
      ellipsis: true,
      slots: { customRender: 'chukuStatus' }
    },
    {
      title: '发票状态',
      dataIndex: 'fapiaoStatus',
      ellipsis: true,
      slots: { customRender: 'fapiaoStatus' }
    },
    {
      title: '收款状态',
      dataIndex: 'jiesuanStatus',
      ellipsis: true,
      slots: { customRender: 'jiesuanStatus' }
    },
    {
      title: '销售客户编码',
      dataIndex: 'cvencodeCode',
      ellipsis: true,
      slots: {customRender: 'cvencodeCode'}
    }, {
      title: '销售客户名称',
      dataIndex: 'cvencode',
      ellipsis: true,
      slots: {customRender: 'cvencode'}
    },{
      title: '结算客户编码',
      dataIndex: 'cvencodeJsCode',
      ellipsis: true,
      slots: {customRender: 'cvencodeJsCode'}
    },
    {
      title: '结算客户名称',
      dataIndex: 'cvencodeJs',
      ellipsis: true,
      slots: {customRender: 'cvencodeJs'}
    },
    {
      title: '业务部门',
      dataIndex: 'cdepcode',
      ellipsis: true,
      slots: { customRender: 'cdepcode'}
    },
    {
      title: '业务员',
      dataIndex: 'cpersoncode',
      ellipsis: true,
      slots: { customRender: 'cpersoncode'}
    },
    {
      title: '仓储位置',
      dataIndex: 'cwhcode',
      ellipsis: true,
      slots: {customRender: 'cwhcode'},
    },
    {
      title: '条形码',
      dataIndex: 'cinvodeBarcode',
      ellipsis: true,
      slots: {customRender: 'cinvodeBarcode'},
    },
    {
      title: '存货编码',
      dataIndex: 'cinvode',
      ellipsis: true,
      slots: {customRender: 'cinvode'}
    },
    {
      title: '存货名称',
      dataIndex: 'cinvodeName',
      ellipsis: true,
      slots: {customRender: 'cinvodeName'}
    },
    {
      title: '规格型号',
      dataIndex: 'speciType',
      ellipsis: true,
      slots: {customRender: 'speciType'}
    },

    {
      title: '主计量',
      dataIndex: 'cunitid',
      ellipsis: true,
      slots: {customRender: 'cunitid'}
    },
    {
      title: '主数量',
      dataIndex: 'baseQuantity',
      ellipsis: true,
      slots: {customRender: 'baseQuantity'}
    },
    {
      title: '计量一',
      dataIndex: 'cunitidF1',
      ellipsis: true,
      slots: {customRender: 'cunitidF1'},
    },{
      title: '数量一',
      dataIndex: 'subQuantity1',
      slots: {customRender: 'subQuantity1'},
    },
    {
      title: '计量二',
      dataIndex: 'cunitidF2',
      ellipsis: true,
      slots: {customRender: 'cunitidF2'},
    },
    {
      title: '数量二',
      dataIndex: 'subQuantity2',
      ellipsis: true,
      slots: {customRender: 'subQuantity2'},
    },
    {
      title: '批号',
      dataIndex: 'batchId',
      ellipsis: true,
      slots: {customRender: 'batchId'},
    },  {
      title: '税率',
      dataIndex: 'itaxrate',
      slots: {customRender: 'itaxrate'},
      ellipsis: true,
    },
    {
      title: '无税单价',
      dataIndex: 'price',
      ellipsis: true,
      slots: {customRender: 'price'},
    },
    {
      title: '无税金额',
      dataIndex: 'icost',
      slots: {customRender: 'icost'},
      ellipsis: true,
    },
    {
      title: '含税单价',
      dataIndex: 'taxprice',
      slots: {customRender: 'taxprice'},
      ellipsis: true,
    },
    {
      title: '税额',
      dataIndex: 'itaxprice',
      slots: {customRender: 'itaxprice'},
      ellipsis: true,
    },
    {
      title: '价税合计',
      dataIndex: 'isum',
      slots: {customRender: 'isum'},
      ellipsis: true,
    },
    {
      title: '赠品',
      dataIndex: 'isGive',
      ellipsis: true,
      slots: {customRender: 'isGive'},
    },
    {
      title: '累计退货数量',
      dataIndex: 'isumTuiHuo',
      ellipsis: true,
      slots: {customRender: 'isumTuiHuo'},
    },
    {
      title: '未退货数量',
      dataIndex: 'isumTuiHuo2',
      ellipsis: true,
      slots: {customRender: 'isumTuiHuo2'},
    },
    {
      title: '累计出库数量',
      dataIndex: 'isumChuku',
      ellipsis: true,
      slots: {customRender: 'isumChuku'},
    },
    {
      title: '未出库数量',
      dataIndex: 'isumChuku2',
      ellipsis: true,
      slots: {customRender: 'isumChuku2'},
    },
    {
      title: '累计结款金额',
      dataIndex: 'hxIsum',
      ellipsis: true,
      slots: {customRender: 'hxIsum'},
    },
    {
      title: '未结款金额',
      dataIndex: 'hxIsum2',
      ellipsis: true,
      slots: {customRender: 'hxIsum2'},
    },
    {
      title: '累计开票数量',
      dataIndex: 'isumFapiao',
      ellipsis: true,
      slots: {customRender: 'isumFapiao'},
    },
    {
      title: '未开票数量',
      dataIndex: 'isumFapiao2',
      ellipsis: true,
      slots: {customRender: 'isumFapiao2'},
    },
    {
      title: '累计开票金额',
      dataIndex: 'isumFapiaoAmount',
      ellipsis: true,
      slots: {customRender: 'isumFapiaoAmount'},
    },
    {
      title: '生效日期',
      dataIndex: 'dpdate',
      ellipsis: true,
    },
    {
      title: '失效日期',
      dataIndex: 'dvdate',
      slots: {customRender: 'dvdate'},
      ellipsis: true,
    },
    {
      title: '备注',
      dataIndex: 'cmemo',
      ellipsis: true,
      slots: {customRender: 'cmemo'},
    },
    {
      title: '制单人',
      dataIndex: 'cmaker',
      ellipsis: true,
      slots: {customRender: 'cmaker'},
    },
    {
      title: '审核人',
      dataIndex: 'bcheckUser',
      ellipsis: true,
      slots: {customRender: 'bcheckUser'},
    },
    {
      title: '复核人',
      dataIndex: 'bworkableUser',
      ellipsis: true,
      slots: {customRender: 'bworkableUser'},
    }
  ]
}

export function changeDefaultDynamics(list) {
  // 改变默认数据
  dynamicColumnAndDataModel['DATA'] = list
}

export function initDynamics() {
  return dynamicColumnAndDataModel
}

export function getTablePropertys(key) {
  return columnPropertyModel[key] || columnPropertyModel['1']
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
