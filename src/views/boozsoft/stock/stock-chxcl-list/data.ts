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
  J:[
    {
      key: '0',
      name: '存货编码',
      nameNew: '存货编码',
      check: true,
      width: 100,
      max: 150,
      min: 80,
      isFixed: true,
      align: 'center'
    },
    {
      key: '1',
      name: '存货名称',
      nameNew: '存货名称',
      check: true,
      width: 100,
      max: 200,
      min: 80,
      isFixed: true,
      align: 'left'
    },
    {
      key: '2',
      name: '规格型号',
      nameNew: '规格型号',
      check: true,
      width: 120,
      max: 200,
      min: 80,
      isFixed: true,
      align: 'left'
    },
    {
      key: '3',
      name: '主计量',
      nameNew: '主计量',
      check: true,
      width: 120,
      max: 200,
      min: 80,
      isFixed: true,
      align: 'left'
    },
    {
      key: '4',
      name: '计量1',
      nameNew: '计量1',
      check: true,
      width: 120,
      max: 200,
      min: 80,
      isFixed: true,
      align: 'left'
    },
    {
      key: '5',
      name: '计量2',
      nameNew: '计量2',
      check: true,
      width: 150,
      max: 300,
      min: 100,
      align: 'left'
    },
    {
      key: '6',
      name: '现存量',
      nameNew: '现存量',
      check: true,
      width: 450,
      max: 600,
      min: 100,
      children: [
        {
          key: '6-1',
          name: '主数量',
          nameNew: '主数量',
          check: true,
          width: 150,
          max: 200,
          min: 100,
          isFixed: true,
          align: 'right'
        },
        {
          key: '6-2',
          name: '数量1',
          nameNew: '数量1',
          check: true,
          width: 150,
          max: 200,
          min: 100,
          align: 'right'
        },
        {
          key: '6-3',
          name: '数量2',
          nameNew: '数量2',
          check: true,
          width: 150,
          max: 200,
          min: 100,
          align: 'right'
        },
      ]
    },
    {
      key: '7',
      name: '可用量',
      nameNew: '可用量',
      check: true,
      width: 450,
      max: 600,
      min: 100,
      children: [
        {
          key: '7-1',
          name: '主数量',
          nameNew: '主数量',
          check: true,
          width: 150,
          max: 200,
          min: 100,
          isFixed: true,
          align: 'right'
        },
        {
          key: '7-2',
          name: '数量1',
          nameNew: '数量1',
          check: true,
          width: 150,
          max: 200,
          min: 100,
          align: 'right'
        },
        {
          key: '7-3',
          name: '数量2',
          nameNew: '数量2',
          check: true,
          width: 150,
          max: 200,
          min: 100,
          align: 'right'
        },
      ]
    },
    {
      key: '8',
      name: '在途入库量',
      nameNew: '在途入库量',
      check: true,
      width: 450,
      max: 600,
      min: 100,
      children: [
        {
          key: '8-1',
          name: '主数量',
          nameNew: '主数量',
          check: true,
          width: 150,
          max: 200,
          min: 100,
          isFixed: true,
          align: 'right'
        },
        {
          key: '8-2',
          name: '数量1',
          nameNew: '数量1',
          check: true,
          width: 150,
          max: 200,
          min: 100,
          align: 'right'
        },
        {
          key: '8-3',
          name: '数量2',
          nameNew: '数量2',
          check: true,
          width: 150,
          max: 200,
          min: 100,
          align: 'right'
        },
      ]
    },
    {
      key: '9',
      name: '在途出库量',
      nameNew: '现存量',
      check: true,
      width: 450,
      max: 600,
      min: 100,
      children: [
        {
          key: '9-1',
          name: '主数量',
          nameNew: '主数量',
          check: true,
          width: 150,
          max: 200,
          min: 100,
          isFixed: true,
          align: 'right'
        },
        {
          key: '9-2',
          name: '数量1',
          nameNew: '数量1',
          check: true,
          width: 150,
          max: 200,
          min: 100,
          align: 'right'
        },
        {
          key: '9-3',
          name: '数量2',
          nameNew: '数量2',
          check: true,
          width: 150,
          max: 200,
          min: 100,
          align: 'right'
        },
      ]
    },
  ],
})
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

export function changeDefaultDynamics(list,num) {
  // 改变默认数据
  dynamicColumnAndDataModel[num] = list
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
        //便利子节点
        if(cObj.children){
          cObj.children.forEach((o)=>{
            o.title = thisName(o.key+'',lanmuList)
            o.width = thisWidth(o.key+'',lanmuList)
            o.align = thisAlign(o.key+'',lanmuList)
            o.ifShow = thisIsShow(o.key+'',lanmuList)
          })
        }
      }
    })
  })
  return columnList;
}
