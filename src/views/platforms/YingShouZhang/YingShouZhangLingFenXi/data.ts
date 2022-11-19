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
      name: '结算客户编码',
      nameNew: '结算客户编码',
      check: true,
      width: 100,
      max: 200,
      min: 80,
      align: 'left',
      fixed: 'left',
    },
    {
      key: '1',
      name: '结算客户名称',
      nameNew: '结算客户名称',
      check: true,
      width: 200,
      max: 300,
      min: 100,
      align: 'left',
      fixed: 'left',
    },
    {
      key: '2',
      name: '应收金额',
      nameNew: '应收金额',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'right',
      fixed: 'left',
    },
    {
      key: '3',
      name: '已收金额',
      nameNew: '已收金额',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'right'
    },
    {
      key: '4',
      name: '未收金额',
      nameNew: '未收金额',
      check: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'right'
    },
    {
      key: '5',
      name: '1',
      nameNew: '1',
      check: false,
      width: 220,
      max: 300,
      min: 200,
      children: [
        {
          key: '5-1',
          name: '金额',
          nameNew: '金额',
          check: true,
          width: 120,
          max: 150,
          min: 100,
        },
        {
          key: '5-2',
          name: '比例',
          nameNew: '比例',
          check: true,
          width: 100,
          max: 150,
          min: 100,
        },
      ]
    },
    {
      key: '6',
      name: '2',
      nameNew: '2',
      check: false,
      width: 220,
      max: 300,
      min: 200,
      children: [
        {
          key: '6-1',
          name: '金额',
          nameNew: '金额',
          check: true,
          width: 120,
          max: 150,
          min: 100,
        },
        {
          key: '6-2',
          name: '比例',
          nameNew: '比例',
          check: true,
          width: 100,
          max: 150,
          min: 100,
        },
      ]
    },
    {
      key: '7',
      name: '3',
      nameNew: '3',
      check: false,
      width: 220,
      max: 300,
      min: 200,
      children: [
        {
          key: '7-1',
          name: '金额',
          nameNew: '金额',
          check: true,
          width: 120,
          max: 150,
          min: 100,
        },
        {
          key: '7-2',
          name: '比例',
          nameNew: '比例',
          check: true,
          width: 100,
          max: 150,
          min: 100,
        },
      ]
    },
    {
      key: '8',
      name: '4',
      nameNew: '4',
      check: false,
      width: 220,
      max: 300,
      min: 200,
      children: [
        {
          key: '8-1',
          name: '金额',
          nameNew: '金额',
          check: true,
          width: 120,
          max: 150,
          min: 100,
        },
        {
          key: '8-2',
          name: '比例',
          nameNew: '比例',
          check: true,
          width: 100,
          max: 150,
          min: 100,
        },
      ]
    },
    {
      key: '9',
      name: '5',
      nameNew: '5',
      check: false,
      width: 220,
      max: 300,
      min: 200,
      children: [
        {
          key: '9-1',
          name: '金额',
          nameNew: '金额',
          check: true,
          width: 120,
          max: 150,
          min: 100,
        },
        {
          key: '9-2',
          name: '比例',
          nameNew: '比例',
          check: true,
          width: 100,
          max: 150,
          min: 100,
        },
      ]
    },
    {
      key: '10',
      name: '6',
      nameNew: '6',
      check: false,
      width: 220,
      max: 300,
      min: 200,
      children: [
        {
          key: '10-1',
          name: '金额',
          nameNew: '金额',
          check: true,
          width: 120,
          max: 150,
          min: 100,
        },
        {
          key: '10-2',
          name: '比例',
          nameNew: '比例',
          check: true,
          width: 100,
          max: 150,
          min: 100,
        },
      ]
    },
    {
      key: '11',
      name: '7',
      nameNew: '7',
      check: false,
      width: 220,
      max: 300,
      min: 200,
      children: [
        {
          key: '11-1',
          name: '金额',
          nameNew: '金额',
          check: true,
          width: 120,
          max: 150,
          min: 100,
        },
        {
          key: '11-2',
          name: '比例',
          nameNew: '比例',
          check: true,
          width: 100,
          max: 150,
          min: 100,
        },
      ]
    },
    {
      key: '12',
      name: '8',
      nameNew: '8',
      check: false,
      width: 220,
      max: 300,
      min: 200,
      children: [
        {
          key: '12-1',
          name: '金额',
          nameNew: '金额',
          check: true,
          width: 120,
          max: 150,
          min: 100,
        },
        {
          key: '12-2',
          name: '比例',
          nameNew: '比例',
          check: true,
          width: 100,
          max: 150,
          min: 100,
        },
      ]
    },
    {
      key: '13',
      name: '9',
      nameNew: '9',
      check: false,
      width: 220,
      max: 300,
      min: 200,
      children: [
        {
          key: '13-1',
          name: '金额',
          nameNew: '金额',
          check: true,
          width: 120,
          max: 150,
          min: 100,
        },
        {
          key: '13-2',
          name: '比例',
          nameNew: '比例',
          check: true,
          width: 100,
          max: 150,
          min: 100,
        },
      ]
    },
    {
      key: '14',
      name: '10',
      nameNew: '10',
      check: false,
      width: 220,
      max: 300,
      min: 200,
      children: [
        {
          key: '14-1',
          name: '金额',
          nameNew: '金额',
          check: true,
          width: 120,
          max: 150,
          min: 100,
        },
        {
          key: '14-2',
          name: '比例',
          nameNew: '比例',
          check: true,
          width: 100,
          max: 150,
          min: 100,
        },
      ]
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
