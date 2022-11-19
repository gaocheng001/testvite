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
    name: '销货日期',
    nameNew: '销货日期',
    check: true,
    width: 100,
    max: 120,
    min: 80,
    align: 'left'
  },
  {
    key: '1',
    name: '销货单号',
    nameNew: '销货单号',
    check: true,
    width: 120,
    max: 150,
    min: 100,
    align: 'left'
  },
  {
      key: '2',
      name: '客户',
      nameNew: '客户',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'left'
    },
    {
      key: '3',
      name: '部门',
      nameNew: '部门',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'left'
    },
    {
      key: '4',
      name: '仓库',
      nameNew: '仓库',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'left'
    },
    {
      key: '5',
      name: '业务员',
      nameNew: '业务员',
      check: true,
      width: 120,
      max: 150,
      min: 100,
      align: 'left'
    },
    {
      key: '6',
      name: '结算客户编码',
      nameNew: '结算客户编码',
      check: true,
      width: 120,
      max: 150,
      min: 100,
      align: 'left'
    }, {
      key: '7',
      name: '结算客户',
      nameNew: '结算客户',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'left'
    }, {
      key: '8',
      name: '存货编码',
      nameNew: '存货编码',
      check: true,
      width: 120,
      max: 150,
      min: 100,
      align: 'left'
    },{
      key: '9',
      name: '存货',
      nameNew: '存货',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'left'
    },{
      key: '10',
      name: '规格型号',
      nameNew: '规格型号',
      check: true,
      width: 120,
      max: 200,
      min: 100,
      align: 'left'
    },
    {
      key: '11',
      name: '主计量',
      nameNew: '主计量',
      check: true,
      width: 100,
      max: 150,
      min: 80,
      align: 'center'
    },
    {
      key: '12',
      name: '品牌',
      nameNew: '品牌',
      check: true,
      width: 120,
      max: 150,
      min: 100,
      align: 'left'
    },
    {
      key: '13',
      name: '主数量',
      nameNew: '主数量',
      check: true,
      width: 100,
      max: 150,
      min: 80,
      align: 'center'
    }, {
      key: '14',
      name: '含税单价',
      nameNew: '含税单价',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'right'
    },
    {
      key: '15',
      name: '含税金额',
      nameNew: '含税金额',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'right'
    },{
      key: '16',
      name: '最新含税售价',
      nameNew: '最新含税售价',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'right'
    }, {
      key: '17',
      name: '退货数量',
      nameNew: '退货数量',
      check: true,
      width: 100,
      max: 150,
      min: 80,
      align: 'center'
    }, {
      key: '18',
      name: '出库单号',
      nameNew: '出库单号',
      check: true,
      width: 120,
      max: 150,
      min: 100,
      align: 'left'
    }, {
      key: '19',
      name: '累计出库数量',
      nameNew: '累计出库数量',
      check: true,
      width: 100,
      max: 150,
      min: 80,
      align: 'center'
    }, {
      key: '20',
      name: '未出库数量',
      nameNew: '未出库数量',
      check: true,
      width: 100,
      max: 150,
      min: 80,
      align: 'right'
    }, {
      key: '21',
      name: '收款单号',
      nameNew: '收款单号',
      check: true,
      width: 120,
      max: 150,
      min: 100,
      align: 'left'
    },{
      key: '22',
      name: '累计结款金额',
      nameNew: '累计结款金额',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'right'
    },{
      key: '23',
      name: '未结款金额',
      nameNew: '未结款金额',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'right'
    } ,{
      key: '24',
      name: '发票单号',
      nameNew: '收款单号',
      check: true,
      width: 120,
      max: 150,
      min: 100,
      align: 'left'
    },{
      key: '25',
      name: '累计开票含税金额',
      nameNew: '累计开票含税金额',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'right'
    },{
      key: '26',
      name: '未开票含税金额',
      nameNew: '未开票含税金额',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'right'
    },{
      key: '27',
      name: '累计开票税额',
      nameNew: '累计开票税额',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'right'
    },{
      key: '28',
      name: '明细备注',
      nameNew: '明细备注',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'left'
    },
  ],
})
const columnPropertyModel = {
  '1': [
    {
      title: '销货日期',
      dataIndex: 'ddate',
      ellipsis: true,
    },
    {
      title: '销货单号',
      dataIndex: 'ccode',
      ellipsis: true,
      slots: {customRender: 'ccode'}
    },
    {
      title: '客户',
      dataIndex: 'cvencode',
      ellipsis: true,
      slots: {customRender: 'cvencode'}
    },
    {
      title: '部门',
      dataIndex: 'cdepcode',
      ellipsis: true,
      slots: {customRender: 'cdepcode'}
    },
    {
      title: '仓库',
      dataIndex: 'cwhcode',
      ellipsis: true,
      slots: {customRender: 'cwhcode'}
    },
    {
      title: '业务员',
      dataIndex: 'cpersoncode',
      ellipsis: true,
      slots: {customRender: 'cpersoncode'}
    },
    {
      title: '结算客户编码',
      dataIndex: 'cvencodeJsCode',
      ellipsis: true,
      slots: {customRender: 'cvencodeJsCode'}
    },
    {
      title: '结算客户',
      dataIndex: 'cvencodeJs',
      ellipsis: true,
      slots: {customRender: 'cvencodeJs'}
    },
    {
      title: '存货编码',
      dataIndex: 'cinvode',
      ellipsis: true,
      slots: {customRender: 'cinvode'}
    }, {
      title: '存货',
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
      title: '品牌',
      dataIndex: 'brand',
      ellipsis: true,
    },
    {
      title: '主数量',
      dataIndex: 'baseQuantity',
      ellipsis: true,
      slots: {customRender: 'baseQuantity'}
    },
    {
      title: '含税单价',
      dataIndex: 'taxprice',
      ellipsis: true,
      slots: {customRender: 'taxprice'}
    },
    {
      title: '含税金额',
      dataIndex: 'isum',
      ellipsis: true,
      slots: {customRender: 'isum'}
    },  {
      title: '最新含税售价',
      dataIndex: 'lastTaxprice',
      ellipsis: true,
      slots: {customRender: 'lastTaxprice'}
    },
    {
      title: '退货数量',
      dataIndex: 'isumJijian',
      align: 'center',
      ellipsis: true,
      slots: {customRender: 'isumJijian'}
    },
    {
      title: '出库单号',
      dataIndex: 'outCcode',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '累计出库数量',
      dataIndex: 'isumChuku',
      ellipsis: true,
      slots: {customRender: 'isumChuku'}
    }, {
      title: '未出库数量',
      dataIndex: 'isumUnChuku',
      ellipsis: true,
      slots: {customRender: 'isumUnChuku'}
    },
    {
      title: '收款单号',
      dataIndex: 'collCcode',
      ellipsis: true,
      slots: {customRender: 'collCcode'}
    }, {
      title: '累计结款金额',
      dataIndex: 'isumJiesuan',
      ellipsis: true,
      slots: {customRender: 'isumJiesuan'}
    }, {
      title: '未结款金额',
      dataIndex: 'isumUnJiesuan',
      ellipsis: true,
      slots: {customRender: 'isumUnJiesuan'}
    },
    {
      title: '发票单号',
      dataIndex: 'collCcode',
      ellipsis: true,
      slots: {customRender: 'collCcode'}
    },
    {
      title: '累计开票含税金额',
      dataIndex: 'isumFapiao',
      ellipsis: true,
      slots: {customRender: 'isumFapiao'}
    },
    {
      title: '未开票含税金额',
      dataIndex: 'isumUnFapiao',
      ellipsis: true,
      slots: {customRender: 'isumUnFapiao'}
    },
    {
      title: '累计开票税额',
      dataIndex: 'isumTaxFapiao',
      ellipsis: true,
      slots: {customRender: 'isumTaxFapiao'}
    },
    {
      title: '明细备注',
      dataIndex: 'cmemo',
      ellipsis: true,
      slots: {customRender: 'cmemo'}
    }],
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
