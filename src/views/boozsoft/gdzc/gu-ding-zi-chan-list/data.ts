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
      name: '系统编号',
      nameNew: '系统编号',
      check: true,
      width: 100,
      max: 120,
      min: 80,
      fixed: 'left',
      align: 'left'
    },
    {
      key: '1',
      name: '资产编号',
      nameNew: '资产编号',
      check: true,
      width: 100,
      max: 120,
      min: 80,
      isFixed: true,
      fixed: 'left',
      align: 'left'
    },
    {
      key: '2',
      name: '资产名称',
      nameNew: '资产名称',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      isFixed: true,
      fixed: 'left',
      align: 'left'
    },
    {
      key: '3',
      name: '状态',
      nameNew: '状态',
      check: true,
      width: 100,
      max: 120,
      min: 80,
      align: 'center'
    },
    {
      key: '4',
      name: '入账日期',
      nameNew: '入账日期',
      check: true,
      width: 100,
      max: 120,
      min: 80,
      align: 'center'
    },
    {
      key: '5',
      name: '购买日期',
      nameNew: '购买日期',
      check: true,
      width: 100,
      max: 120,
      min: 80,
      align: 'center'
    },
    {
      key: '6',
      name: '规格型号',
      nameNew: '规格型号',
      check: true,
      width: 100,
      max: 150,
      min: 80,
      align: 'left'
    },
    {
      key: '7',
      name: '资产类别',
      nameNew: '资产类别',
      check: true,
      width: 100,
      max: 150,
      min: 80,
      align: 'left'
    },
    {
      key: '8',
      name: '部门',
      nameNew: '部门',
      check: true,
      width: 150,
      max: 300,
      min: 100,
      align: 'left'
    },
    {
      key: '9',
      name: '项目',
      nameNew: '项目',
      check: true,
      width: 150,
      max: 300,
      min: 100,
      align: 'left'
    },
    {
      key: '10',
      name: '使用年限(月)',
      nameNew: '使用年限(月)',
      check: true,
      width: 100,
      max: 150,
      min: 80,
      align: 'center'
    },
    {
      key: '11',
      name: '已计提年限(月)',
      nameNew: '已计提年限(月)',
      check: true,
      width: 100,
      max: 150,
      min: 80,
      align: 'center'
    },
    {
      key: '12',
      name: '资产原值',
      nameNew: '资产原值',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'right'
    },
    {
      key: '13',
      name: '累计折旧',
      nameNew: '累计折旧',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'right'
    },
    {
      key: '14',
      name: '净值',
      nameNew: '净值',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'right'
    },
    {
      key: '15',
      name: '月折旧额',
      nameNew: '月折旧额',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'right'
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

export function assemblyDynamicColumn(lanmuList:any,columnList:any){
  columnList.forEach(cObj=>{
    lanmuList.forEach((lObj,index)=>{
      if (cObj.title === lObj.name){
        cObj.title = thisName(index+'',lanmuList)
        cObj.width = thisWidth(index+'',lanmuList)
        cObj.align = thisAlign(index+'',lanmuList)
        cObj.ifShow = thisIsShow(index+'',lanmuList)
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
  let value = 0
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
  return  parseInt(value)
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
