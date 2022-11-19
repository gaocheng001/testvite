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
      name: '系统栏目名称',
      nameNew: '系统栏目名称',
      check: true,
     width: 200,
     max: 300,
     min: 150,
      align: 'left',
    },  {
      key: '1',
      name: '打印栏目名称',
      nameNew: '打印栏目名称',
      check: true,
      width: 200,
      max: 300,
      min: 150,
      align: 'left'
    }, {
      key: '2',
      name: '对齐方式',
      nameNew: '对齐方式',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'center'
    },{
      key: '3',
      name: '打印宽度',
      nameNew: '打印宽度',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'left'
    }, {
      key: '4',
      name: '字体大小',
      nameNew: '字体大小',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'center'
    },{
      key: '5',
      name: '属性名称',
      nameNew: '属性名称',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'left'
    },{
      key: '6',
      name: '所属区域',
      nameNew: '所属区域',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'left'
    },{
      key: '7',
      name: '是否打印',
      nameNew: '是否打印',
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
      title: '系统栏目名称',
      dataIndex: 'systemName',
      ellipsis: true,
      slots: { customRender: 'systemName' }
    },
    {
      title: '打印栏目名称',
      dataIndex: 'printName',
      ellipsis: true,
      slots: {customRender: 'printName'}
    },
    {
      title: '对齐方式',
      dataIndex: 'alignWay',
      ellipsis: true,
      slots: {customRender: 'alignWay'}
    },
    {
      title: '打印宽度',
      dataIndex: 'printWidth',
      ellipsis: true,
      slots: {customRender: 'printWidth'}
    },
    {
      title: '字体大小',
      dataIndex: 'fontSize',
      ellipsis: true,
      slots: {customRender: 'fontSize'}
    },{
      title: '属性名称',
      dataIndex: 'propertyName',
      ellipsis: true,
      slots: {customRender: 'propertyName'}
    },
    {
      title: '所属区域',
      dataIndex: 'belongArea',
      ellipsis: true,
      slots: {customRender: 'belongArea'}
    }, {
      title: '是否打印',
      dataIndex: 'isPrint',
      ellipsis: true,
      slots: {customRender: 'isPrint'}
    },
    ],
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
