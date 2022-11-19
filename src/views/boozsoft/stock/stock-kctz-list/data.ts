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
      name: '单据状态',
      nameNew: '单据状态',
      check: true,
      width: 80,
      max: 120,
      min: 80,
      isFixed: true,
      align: 'center'
    },
    {
      key: '1',
      name: '单据日期',
      nameNew: '单据日期',
      check: true,
      width: 80,
      max: 120,
      min: 80,
      isFixed: true,
      align: 'center'
    },
    {
      key: '2',
      name: '单据类型',
      nameNew: '单据类型',
      check: true,
      width: 150,
      max: 200,
      min: 80,
      isFixed: true,
      align: 'left'
    },
    {
      key: '3',
      name: '单据编号',
      nameNew: '单据编号',
      check: true,
      width: 150,
      max: 200,
      min: 80,
      isFixed: true,
      align: 'left'
    },
    {
      key: '4',
      name: '往来单位',
      nameNew: '往来单位',
      check: true,
      width: 150,
      max: 300,
      min: 100,
      align: 'left'
    },
    {
      key: '5',
      name: '项目',
      nameNew: '项目',
      check: false,
      width: 180,
      max: 200,
      min: 100,
      align: 'left'
    },
/*    {
      key: '6',
      name: '批号',
      nameNew: '批号',
      check: true,
      width: 180,
      max: 200,
      min: 100,
      align: 'left'
    },
    {
      key: '7',
      name: '生效日期',
      nameNew: '生效日期',
      check: true,
      width: 120,
      max: 150,
      min: 100,
      align: 'center'
    },
    {
      key: '8',
      name: '失效日期',
      nameNew: '失效日期',
      check: true,
      width: 120,
      max: 150,
      min: 100,
      align: 'center'
    },*/
    {
      key: '6',
      name: '收入',
      nameNew: '收入',
      check: true,
      width: 450,
      max: 600,
      min: 100,
      isFixed: true,
      children: [
        {
          key: '6-1',
          name: '主数量',
          nameNew: '主数量',
          check: true,
          width: 120,
          max: 200,
          min: 100,
          isFixed: true,
          align: 'right'
        },
      ]
    },
    {
      key: '7',
      name: '发出',
      nameNew: '发出',
      check: true,
      width: 150,
      max: 600,
      min: 100,
      isFixed: true,
      children: [
        {
          key: '7-1',
          name: '数量(主单位)',
          nameNew: '数量(主单位)',
          check: true,
          width: 120,
          max: 200,
          min: 100,
          isFixed: true,
          align: 'right'
        },
      ]
    },
    {
      key: '8',
      name: '结存',
      nameNew: '结存',
      check: true,
      width: 150,
      max: 600,
      min: 100,
      isFixed: true,
      children: [
        {
          key: '8-1',
          name: '数量(主单位)',
          nameNew: '数量(主单位)',
          check: true,
          width: 120,
          max: 200,
          min: 100,
          isFixed: true,
          align: 'right'
        },
      ]
    },
  ],
  SJ: [
    {
      key: '0',
      name: '单据状态',
      nameNew: '单据状态',
      check: true,
      width: 60,
      max: 100,
      min: 60,
      isFixed: true,
      align: 'center'
    },
    {
      key: '1',
      name: '单据日期',
      nameNew: '单据日期',
      check: true,
      width: 80,
      max: 120,
      min: 80,
      isFixed: true,
      align: 'center'
    },
    {
      key: '2',
      name: '单据类型',
      nameNew: '单据类型',
      check: true,
      width: 80,
      max: 120,
      min: 80,
      isFixed: true,
      align: 'center'
    },
    {
      key: '3',
      name: '单据编号',
      nameNew: '单据编号',
      check: true,
      width: 80,
      max: 120,
      min: 80,
      isFixed: true,
      align: 'left'
    },
    {
      key: '4',
      name: '往来单位',
      nameNew: '往来单位',
      check: true,
      width: 150,
      max: 300,
      min: 100,
      align: 'left'
    },
    {
      key: '5',
      name: '项目',
      nameNew: '项目',
      check: true,
      width: 180,
      max: 200,
      min: 100,
      align: 'left'
    },
/*    {
      key: '6',
      name: '批号',
      nameNew: '批号',
      check: true,
      width: 180,
      max: 200,
      min: 100,
      align: 'left'
    },
    {
      key: '7',
      name: '生效日期',
      nameNew: '生效日期',
      check: true,
      width: 120,
      max: 150,
      min: 100,
      align: 'center'
    },
    {
      key: '8',
      name: '失效日期',
      nameNew: '失效日期',
      check: true,
      width: 120,
      max: 150,
      min: 100,
      align: 'center'
    },*/
    {
      key: '6',
      name: '收入',
      nameNew: '收入',
      check: true,
      width: 450,
      max: 600,
      min: 100,
      isFixed: true,
      children: [
        {
          key: '6-1',
          name: '主数量',
          nameNew: '主数量',
          check: true,
          width: 80,
          max: 150,
          min: 80,
          isFixed: true,
          align: 'right'
        },
        {
          key: '6-2',
          name: '单价',
          nameNew: '单价',
          check: true,
          width: 80,
          max: 150,
          min: 80,
          isFixed: true,
          align: 'right'
        },
        {
          key: '6-3',
          name: '金额',
          nameNew: '金额',
          check: true,
          isFixed: true,
          width: 80,
          max: 150,
          min: 80,
          align: 'right'
        },
      ]
    },
    {
      key: '7',
      name: '发出',
      nameNew: '发出',
      check: true,
      width: 450,
      max: 600,
      min: 100,
      isFixed: true,
      children: [
        {
          key: '7-1',
          name: '主数量',
          nameNew: '主数量',
          check: true,
          width: 80,
          max: 150,
          min: 80,
          isFixed: true,
          align: 'right'
        },
        {
          key: '7-2',
          name: '单价',
          nameNew: '单价',
          check: true,
          width: 80,
          max: 150,
          min: 80,
          isFixed: true,
          align: 'right'
        },
        {
          key: '7-3',
          name: '金额',
          nameNew: '金额',
          check: true,
          isFixed: true,
          width: 80,
          max: 150,
          min: 80,
          align: 'right'
        },
      ]
    },
    {
      key: '8',
      name: '结存',
      nameNew: '结存',
      check: true,
      width: 450,
      max: 600,
      min: 100,
      isFixed: true,
      children: [
        {
          key: '8-1',
          name: '主数量',
          nameNew: '主数量',
          check: true,
          width: 80,
          max: 150,
          min: 80,
          isFixed: true,
          align: 'right'
        },
        {
          key: '8-2',
          name: '平均单价',
          nameNew: '平均单价',
          check: true,
          isFixed: true,
          width: 80,
          max: 150,
          min: 80,
          align: 'right'
        },
        {
          key: '8-3',
          name: '金额',
          nameNew: '金额',
          check: true,
          isFixed: true,
          width: 80,
          max: 150,
          min: 80,
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
