import {reactive} from "vue";

const dynamicColumnAndDataModel = reactive({
  DEFAULT: [
    {
      key: '0',
      title: '序号',
      dataIndex: 'serial',
      align: 'center',
      width: 50,
    },
    {
      key: '1',
      title: '栏目名称',
      dataIndex: 'name',
      align: 'left',
      width: 150,
    },
    {
      key: '2',
      title: '显示',
      dataIndex: 'check',
      align: 'center',
      width: 50,
      slots: { customRender: 'checkBox' },
    },
    {
      key: '3',
      title: '显示名称',
      dataIndex: 'nameNew',
      width: 150,
      align: 'left',
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
      slots: { customRender: 'alignRadio' }
    },
    {
      key: '6',
      title: '操作',
      dataIndex: 'operate',
      align: 'center',
      width: 100,
      slots: { customRender: 'operate' }
    }
  ],
  DATA: [
    {
      key: '0',
      name: "条形码",
      nameNew: "条形码",
      check: false,
      width: 150,
      max: 200,
      min: 80, align: 'left'
    }, {
      key: '1',
      name: '存货编码',
      nameNew: '存货编码',
      check: true,
      isFixed: true,
      width: 120,
      max: 200,
      min: 100,
      align: 'left'
    }
    , {
      key: '2',
      name: '存货名称',
      nameNew: '存货名称',
      check: true,
      isFixed: true,
      width: 200,
      max: 250,
      min: 100,
      align: 'left'
    },{
      key: '3',
      name: '规格型号',
      nameNew: '规格型号',
      check: true,
      isFixed: true,
      width: 150,
      max: 200,
      min: 100,
      align: 'left'
    }
    , {
      key: '4',
      name: '计量单位',
      nameNew: '计量单位',
      check: true,
      isFixed: true,
      width: 100,
      max: 150,
      min: 100,
      align: 'center'
    },
    {
      key: '5',
      name: '数量',
      nameNew: '数量',
      check: true,
      isFixed: true,
      width: 100,
      max: 120,
      min: 80,
      align: 'center'
    },
    {
      key: '6',
      name: '主计量',
      nameNew: '主计量',
      check: false,
      width: 80,
      max: 120,
      min: 80,
      align: 'center'
    },
    {
      key: '7',
      name: '主数量',
      nameNew: '主数量',
      check: false,
      width: 80,
      max: 120,
      min: 80,
      align: 'center'
    },  {
      key: '8',
      name: '计量一',
      nameNew: '计量1',
      check: false,
      width: 80,
      max: 120,
      min: 80,
      align: 'center'
    },
    {
      key: '9',
      name: '数量一',
      nameNew: '数量1',
      check: false,
      width: 80,
      max: 120,
      min: 80,
      align: 'center'
    },{
      key: '10',
      name: '计量二',
      nameNew: '计量2',
      check: false,
      width: 80,
      max: 120,
      min: 80,
      align: 'center'
    } ,
    {
      key: '11',
      name: '数量二',
      nameNew: '数量2',
      check: false,
      width: 80,
      max: 120,
      min: 80,
      align: 'center'
    },{
      key: '12',
      name: "税率",
      nameNew: "税率",
      check: true,
      width: 80,
      max: 100,
      min: 80,
      align: 'center'
    }, {
      key: '13',
      name: "无税单价",
      nameNew: "无税单价",
      check: false,
      width: 150,
      max: 250,
      min: 100,
      align: 'right'
    }, {
      key: '14',
      name: "无税金额",
      nameNew: "无税金额",
      check: false,
      width: 150,
      max: 250,
      min: 100,
      align: 'right'
    },  {
      key: '15',
      name: "税额",
      nameNew: "税额",
      check: false,
      width: 150,
      max: 250,
      min: 100,
      align: 'right'
    },
    {
      key: '16',
      name: "含税单价",
      nameNew: "含税单价",
      check: true,
      width: 150,
      max: 250,
      min: 100,
      align: 'right'
    },{
      key: '17',
      name: "价税合计",
      nameNew: "价税合计",
      check: true,
      width: 150,
      max: 250,
      min: 100,
      align: 'right'
    },{
      key: '18',
      name: "赠品",
      nameNew: "赠品",
      check: true,
      width: 80,
      max: 120,
      min: 80,
      align: 'center'
    },
    {
      key: '19',
      name: "审核人",
      nameNew: "审核人",
      check: true,
      width: 100,
      max: 120,
      min: 80,      align: 'center'
    },
    {
      key: '20',
      name: "备注",
      nameNew: "备注",
      check: true,
      width: 150,
      max: 200,
      min: 10,      align: 'left'
    },
    {
      key: '21',
      name: "项目",
      nameNew: "项目",
      check: false,
      width: 100,
      max: 120,
      min: 80,align: 'center'
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
