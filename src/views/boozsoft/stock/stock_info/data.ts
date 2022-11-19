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
      width: 60,
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
      width: 150,
      slots: { customRender: 'alignRadio' },
    }
  ],
  DATA: [
    {
      key: '0',
      name: '状态',
      nameNew: '状态',
      check: true,
      width: 60,
      max: 80,
      min: 60,
      align: 'center',isFixed:true
    },
    {
      key: '1',
      name: '存货编码',
      nameNew: '存货编码',
      check: true,
      width: 80,
      max: 150,
      min: 80,
      align: 'left',isFixed:true
    },
    {
      key: '2',
      name: '存货名称',
      nameNew: '存货名称',
      check: true,
      width: 100,
      max: 300,
      min: 100,
      align: 'left',isFixed:true
    },
    {
      key: '3',
      name: '规格型号',
      nameNew: '规格型号',
      check: true,
      width: 80,
      max: 150,
      min: 80,
      align: 'left',isFixed:true
    },
    {
      key: '4',
      name: '存货分类',
      nameNew: '存货分类',
      check: true,
      width: 80,
      max: 150,
      min: 80,
      align: 'center',isFixed:true
    }
    ,{
      key: '5',
      name: '条形码',
      nameNew: '条形码',
      check: true,
      width: 80,
      max: 150,
      min: 80,
      align: 'center',
    }
    ,
    {
      key: '6',
      name: '计量方式',
      nameNew: '计量方式',
      check: true,
      width: 80,
      max: 150,
      min: 80,
      align: 'center',isFixed:true
    },{
      key: '7',
      name: '计量单位',
      nameNew: '计量单位',
      check: true,
      width: 80,
      max: 150,
      min: 80,
      align: 'center',isFixed:true
    },{
      key: '8',
      name: '计价方式',
      nameNew: '计价方式',
      check: true,
      width: 80,
      max: 150,
      min: 80,
      align: 'center'
    },{
      key: '9',
      name: '销售',
      nameNew: '销售',
      check: true,
      width: 50,
      max: 70,
      min: 50,
      align: 'center'
    },{
      key: '10',
      name: '采购',
      nameNew: '采购',
      check: true,
      width: 50,
      max: 70,
      min: 50,
      align: 'center'
    },{
      key: '11',
      name: '生产',
      nameNew: '生产',
      check: true,
      width: 50,
      max: 70,
      min: 50,
      align: 'center'
    },{
      key: '12',
      name: '委托',
      nameNew: '委托',
      check: true,
      width: 50,
      max: 70,
      min: 50,
      align: 'center'
    },{
      key: '13',
      name: '应税劳务',
      nameNew: '应税劳务',
      check: true,
      width: 80,
      max: 100,
      min: 80,
      align: 'center'
    },{
      key: '14',
      name: '序列号',
      nameNew: '序列号',
      check: true,
      width: 80,
      max: 100,
      min: 80,
      align: 'center'
    },{
      key: '15',
      name: 'MA管理',
      nameNew: 'MA管理',
      check: true,
      width: 80,
      max: 100,
      min: 80,
      align: 'center'
    },{
      key: '16',
      name: '批次管理',
      nameNew: '批次管理',
      check: true,
      width: 80,
      max: 100,
      min: 80,
      align: 'center'
    },{
      key: '17',
      name: '有效期管理',
      nameNew: '有效期管理',
      check: true,
      width: 100,
      max: 150,
      min: 100,
      align: 'center'
    },{
      key: '18',
      name: '有效期单位',
      nameNew: '有效期单位',
      check: true,
      width: 100,
      max: 150,
      min: 100,
      align: 'center'
    },{
      key: '19',
      name: '有效期时长',
      nameNew: '有效期时长',
      check: true,
      width: 100,
      max: 150,
      min: 100,
      align: 'center'
    },{
      key: '20',
      name: '预警天数',
      nameNew: '预警天数',
      check: true,
      width: 80,
      max: 100,
      min: 80,
      align: 'center'
    },{
      key: '21',
      name: '品牌',
      nameNew: '品牌',
      check: true,
      width: 50,
      max: 70,
      min: 50,
      align: 'center'
    },{
      key: '22',
      name: '存货代码',
      nameNew: '存货代码',
      check: true,
      width: 80,
      max: 100,
      min: 80,
      align: 'left'
    },{
      key: '23',
      name: '助记码',
      nameNew: '助记码',
      check: true,
      width: 80,
      max: 100,
      min: 80,
      align: 'left'
    },{
      key: '24',
      name: '生产厂商',
      nameNew: '生产厂商',
      check: true,
      width: 80,
      max: 150,
      min: 80,
      align: 'left'
    },{
      key: '25',
      name: '生产地点',
      nameNew: '生产地点',
      check: true,
      width: 80,
      max: 100,
      min: 80,
      align: 'left'
    },{
      key: '26',
      name: '生产地',
      nameNew: '生产地',
      check: true,
      width: 80,
      max: 150,
      min: 80,
      align: 'left'
    },{
      key: '27',
      name: '默认供应商',
      nameNew: '默认供应商',
      check: true,
      width: 100,
      max: 150,
      min: 100,
      align: 'left'
    },{
      key: '28',
      name: '默认仓库',
      nameNew: '默认仓库',
      check: true,
      width: 80,
      max: 150,
      min: 80,
      align: 'left'
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
