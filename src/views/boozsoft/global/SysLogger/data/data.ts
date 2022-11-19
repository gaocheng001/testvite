import {reactive} from "vue";

function createColumn({label}){
  return    {
    key: '0',
    label,
    dataIndex: 'name',
    align: 'center',
    width: 150,
  }
}

const arr=[
  {label:'栏目名称'},
  {label:'栏目名称2'},

]

const dynamicColumnAndDataModel = reactive({
  DEFAULT: [
    ...arr.map(it=>{
      return createColumn({label:it.label})
    }),
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
    ...arr.map(it=>{
      return createColumn({label:it.label})
    }),
    {
      key: '0',
      name: '组织代码2',
      nameNew: '组织代码3',
      check: true,
      isFixed: true,
      width: 120,
      max: 150,
      min: 80,
      align: 'center'
    }
    ,
    {
      key: '1',
      name: '组织名称4',
      nameNew: '组织名称5',
      check: true,
      isFixed: true,
      width: 200,
      max: 300,
      min: 150,
      align: 'left'
    },
    {
      key: '2',
      name: '组织简称',
      nameNew: '组织简称',
      check: true,
      width: 200,
      max: 300,
      min: 150,
      align: 'left'
    }
    ,{
      key: '3',
      name: '所属集团',
      nameNew: '所属集团',
      check: true,
      width: 200,
      max: 200,
      min: 80,
      align: 'center'
    }
    ,{
      key: '4',
      name: '所属行业',
      nameNew: '所属行业',
      check: true,
      width: 200,
      max: 250,
      min: 150,
      align: 'center'
    },{
      key: '5',
      name: '行政区划',
      nameNew: '行政区划',
      check: true,
      width: 200,
      max: 300,
      min: 100,
      align: 'center'
    },{
      key: '6',
      name: '上级组织',
      nameNew: '上级组织',
      check: true,
      width: 200,
      max: 200,
      min: 100,
      align: 'center'
    },{
      key: '7',
      name: '国家(地区)',
      nameNew: '国家(地区)',
      check: true,
      width: 120,
      max: 150,
      min: 100,
      align: 'center'
    }
    ,{
      key: '8',
      name: '启用日期',
      nameNew: '启用日期',
      check: true,
      width: 120,
      max: 150,
      min: 80,
      align: 'center'
    },
    {
      key: '9',
      name: '负责人',
      nameNew: '负责人',
      check: true,
      width: 120,
      max: 150,
      min: 100,
      align: 'center'
    },{
      key: '10',
      name: '联系电话',
      nameNew: '联系电话',
      check: true,
      width: 120,
      max: 150,
      min: 100,
      align: 'center'
    },{
      key: '11',
      name: '会计准则',
      nameNew: '会计准则',
      check: true,
      width: 120,
      max: 150,
      min: 100,
      align: 'center'
    },
    {
      key: '12',
      name: '科目级次',
      nameNew: '科目级次',
      check: true,
      width: 120,
      max: 150,
      min: 100,
      align: 'center'
    },
    {
      key: '13',
      name: '通讯地址',
      nameNew: '通讯地址',
      check: false,
      width: 250,
      max: 300,
      min: 100,
      align: 'left'
    },
    {
      key: '14',
      name: '简介',
      nameNew: '简介',
      check: false,
      width: 200,
      max: 400,
      min: 100,
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
