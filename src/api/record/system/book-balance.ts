import { defHttp } from '/@/utils/http/axios'
import {h, reactive} from "vue";
import {Icon} from "/@/components/Icon";
const dynamicColumnAndDataModel = reactive({
  DEFAULT: [ {
    title: '栏目名称',
    dataIndex: 'name',
    align: 'center',
    width: 150,
  },
    {
      title: '显示',
      dataIndex: 'check',
      align: 'center',
      slots: { customRender: 'checkBox' },
    },
    {
      title: '显示名称',
      dataIndex: 'nameNew',
      width: 150,
      align: 'center',
      slots: { customRender: 'nameInput', },
    },
    {
      title: '宽度(范围)',
      dataIndex: 'width',
      align: 'center',
      width: 140,
      slots: { customRender: 'widthInput', },
    },
    {
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
      name: '序号',
      nameNew: '序号',
      check: true,
      width: 80,
      max: 80,
      min: 60,
      isFixed: true,
      align: 'center'
    },
    {
      key: '1',
      name: '科目编码',
      nameNew: '科目编码',
      check: true,
      width: 200,
      max: 250,
      min: 100,
      isFixed: true,
      align: 'left'
    },
    {
      key: '2',
      name: '科目名称',
      nameNew: '科目名称',
      check: true,
      width: 300,
      max: 350,
      min: 100,
      isFixed: true,
      align: 'left'
    },
    {
      key: '3',
      name: '计量单位',
      nameNew: '计量单位',
      check: true,
      width: 100,
      max: 120,
      min: 80,
      isFixed: false,
      align: 'left'
    },
    {
      key: '4',
      name: '币种',
      nameNew: '币种',
      check: true,
      width: 100,
      max: 140,
      min: 80,
      isFixed: false,
      align: 'left'
    },
    {
      key: '5',
      name: '期初余额',
      nameNew: '期初余额',
      check: true,
      width: 900,
      max: 900,
      min: 300,
      isFixed: false,
      align: '',
      children:[
        {
          key: '5-1',
          name: '借方',
          nameNew: '借方',
          check: true,
          width: 450,
          max: 450,
          min: 150,
          align: 'center',
          isFixed: false,
          children:[
            {
              key: '5-1-1',
              name: '数量',
              nameNew: '数量',
              check: true,
              width: 150,
              max: 300,
              min: 100,
              align: 'center',
              isFixed: false,
            },{
              key: '5-1-2',
              name: '金额',
              nameNew: '金额',
              check: true,
              width: 150,
              max: 300,
              min: 100,
              align: 'right',
              isFixed: false,
            },{
              key: '5-1-3',
              name: '本币',
              nameNew: '本币',
              check: true,
              width: 150,
              max: 300,
              min: 100,
              align: 'right',
              isFixed: false,
            }
          ]
        },{
          key: '5-2',
          name: '贷方',
          nameNew: '贷方',
          check: true,
          width: 450,
          max: 450,
          min: 150,
          align: 'center',
          isFixed: false,
          children:[
            {
              key: '5-2-1',
              name: '数量',
              nameNew: '数量',
              check: true,
              width: 150,
              max: 300,
              min: 100,
              align: 'center',
              isFixed: false,
            },{
              key: '5-2-2',
              name: '金额',
              nameNew: '金额',
              check: true,
              width: 150,
              max: 300,
              min: 100,
              align: 'right',
              isFixed: false,
            },{
              key: '5-2-3',
              name: '本币',
              nameNew: '本币',
              check: true,
              width: 150,
              max: 300,
              min: 100,
              align: 'right',
              isFixed: false,
            }
          ]
        }
      ]
    },{
      key: '6',
      name: '本期发生',
      nameNew: '本期发生',
      check: true,
      width: 900,
      max: 900,
      min: 300,
      isFixed: false,
      align: '',
      children:[
        {
          key: '6-1',
          name: '借方',
          nameNew: '借方',
          check: true,
          width: 450,
          max: 450,
          min: 150,
          align: 'center',
          isFixed: false,
          children:[
            {
              key: '6-1-1',
              name: '数量',
              nameNew: '数量',
              check: true,
              width: 150,
              max: 300,
              min: 100,
              align: 'center',
              isFixed: false,
            },{
              key: '6-1-2',
              name: '金额',
              nameNew: '金额',
              check: true,
              width: 150,
              max: 300,
              min: 100,
              align: 'right',
              isFixed: false,
            },{
              key: '6-1-3',
              name: '本币',
              nameNew: '本币',
              check: true,
              width: 150,
              max: 300,
              min: 100,
              align: 'right',
              isFixed: false,
            }
          ]
        },{
          key: '6-2',
          name: '贷方',
          nameNew: '贷方',
          check: true,
          width: 450,
          max: 450,
          min: 150,
          align: 'center',
          isFixed: false,
          children:[
            {
              key: '6-2-1',
              name: '数量',
              nameNew: '数量',
              check: true,
              width: 150,
              max: 300,
              min: 100,
              align: 'center',
              isFixed: false,
            },{
              key: '6-2-2',
              name: '金额',
              nameNew: '金额',
              check: true,
              width: 150,
              max: 300,
              min: 100,
              align: 'right',
              isFixed: false,
            },{
              key: '6-2-3',
              name: '本币',
              nameNew: '本币',
              check: true,
              width: 150,
              max: 300,
              min: 100,
              align: 'right',
              isFixed: false,
            }
          ]
        }
      ]
    },{
      key: '7',
      name: '本年累计',
      nameNew: '本年累计',
      check: false,
      width: 900,
      max: 900,
      min: 300,
      isFixed: false,
      align: '',
      children:[
        {
          key: '7-1',
          name: '借方',
          nameNew: '借方',
          check: true,
          width: 450,
          max: 450,
          min: 150,
          align: 'center',
          isFixed: false,
          children:[
            {
              key: '7-1-1',
              name: '数量',
              nameNew: '数量',
              check: true,
              width: 150,
              max: 300,
              min: 100,
              align: 'center',
              isFixed: false,
            },{
              key: '7-1-2',
              name: '金额',
              nameNew: '金额',
              check: true,
              width: 150,
              max: 300,
              min: 100,
              align: 'right',
              isFixed: false,
            },{
              key: '7-1-3',
              name: '本币',
              nameNew: '本币',
              check: true,
              width: 150,
              max: 300,
              min: 100,
              align: 'right',
              isFixed: false,
            }
          ]
        },{
          key: '7-2',
          name: '贷方',
          nameNew: '贷方',
          check: true,
          width: 450,
          max: 450,
          min: 150,
          align: 'center',
          isFixed: false,
          children:[
            {
              key: '7-2-1',
              name: '数量',
              nameNew: '数量',
              check: true,
              width: 150,
              max: 300,
              min: 100,
              align: 'center',
              isFixed: false,
            },{
              key: '7-2-2',
              name: '金额',
              nameNew: '金额',
              check: true,
              width: 150,
              max: 300,
              min: 100,
              align: 'right',
              isFixed: false,
            },{
              key: '7-2-3',
              name: '本币',
              nameNew: '本币',
              check: true,
              width: 150,
              max: 300,
              min: 100,
              align: 'right',
              isFixed: false,
            }
          ]
        }
      ]
    },{
      key: '8',
      name: '期末余额',
      nameNew: '期末余额',
      check: true,
      width: 900,
      max: 900,
      min: 300,
      isFixed: false,
      align: '',
      children:[
        {
          key: '8-1',
          name: '借方',
          nameNew: '借方',
          check: true,
          width: 450,
          max: 450,
          min: 150,
          align: 'center',
          isFixed: false,
          children:[
            {
              key: '8-1-1',
              name: '数量',
              nameNew: '数量',
              check: true,
              width: 150,
              max: 300,
              min: 100,
              align: 'center',
              isFixed: false,
            },{
              key: '8-1-2',
              name: '金额',
              nameNew: '金额',
              check: true,
              width: 150,
              max: 300,
              min: 100,
              align: 'right',
              isFixed: false,
            },{
              key: '8-1-3',
              name: '本币',
              nameNew: '本币',
              check: true,
              width: 150,
              max: 300,
              min: 100,
              align: 'right',
              isFixed: false,
            }
          ]
        },{
          key: '8-2',
          name: '贷方',
          nameNew: '贷方',
          check: true,
          width: 450,
          max: 450,
          min: 150,
          align: 'center',
          isFixed: false,
          children:[
            {
              key: '8-2-1',
              name: '数量',
              nameNew: '数量',
              check: true,
              width: 150,
              max: 300,
              min: 100,
              align: 'center',
              isFixed: false,
            },{
              key: '8-2-2',
              name: '金额',
              nameNew: '金额',
              check: true,
              width: 150,
              max: 300,
              min: 100,
              align: 'right',
              isFixed: false,
            },{
              key: '8-2-3',
              name: '本币',
              nameNew: '本币',
              check: true,
              width: 150,
              max: 300,
              min: 100,
              align: 'right',
              isFixed: false,
            }
          ]
        }
      ]
    }]
})

const thisName = (index)=>{
  let value = ''
  if (index.toString().indexOf('-') != -1){
    let arr = index.split('-');
    if (arr.length == 2)  {
      value = dynamicColumnAndDataModel.DATA[parseInt(arr[0])].children[parseInt(arr[1])-1].nameNew
      if ('' == value)value = dynamicColumnAndDataModel.DATA[parseInt(arr[0])].children[parseInt(arr[1])-1].name
    }else{
      value = dynamicColumnAndDataModel.DATA[parseInt(arr[0])].children[parseInt(arr[1])-1].children[parseInt(arr[2])-1].nameNew
      if ('' == value)value = dynamicColumnAndDataModel.DATA[parseInt(arr[0])].children[parseInt(arr[1])-1].children[parseInt(arr[2])-1].name
    }
  }else{
    value = dynamicColumnAndDataModel.DATA[index].nameNew
    if ('' == value)value = dynamicColumnAndDataModel.DATA[index].name
  }
  return value
}
const thisWidth = (index)=>{
  let value = 0
  if (index.toString().indexOf('-') != -1){
    let arr = index.split('-');
    if (arr.length == 2)  {
      value = dynamicColumnAndDataModel.DATA[parseInt(arr[0])].children[parseInt(arr[1])-1].width
    }else{
      value = dynamicColumnAndDataModel.DATA[parseInt(arr[0])].children[parseInt(arr[1])-1].children[parseInt(arr[2])-1].width
    }
  }else{
    value = dynamicColumnAndDataModel.DATA[index].width
  }
  return  parseInt(value)
}
const thisIsShow = (index)=>{
  let value = false
  if (index.toString().indexOf('-') != -1){
    let arr = index.split('-');
    if (arr.length == 2)  {
      value = dynamicColumnAndDataModel.DATA[parseInt(arr[0])].children[parseInt(arr[1])-1].check
    }else{
      value = dynamicColumnAndDataModel.DATA[parseInt(arr[0])].children[parseInt(arr[1])-1].children[parseInt(arr[2])-1].check
    }
  }else{
    value = dynamicColumnAndDataModel.DATA[index].check
  }
  return  value
}
const thisAlign = (index)=>{
  let value = 'center';
  if (index.toString().indexOf('-') != -1){
    let arr = index.split('-');
    if (arr.length == 2)  {
      value = dynamicColumnAndDataModel.DATA[parseInt(arr[0])].children[parseInt(arr[1])-1].align
    }else{
      value = dynamicColumnAndDataModel.DATA[parseInt(arr[0])].children[parseInt(arr[1])-1].children[parseInt(arr[2])-1].align
    }
  }else{
    value = dynamicColumnAndDataModel.DATA[index].align
  }
  return  value
}
const initDirection = (value,index)=>{
  const obj = {
    children: value,
    attrs: {},
  };
  obj.attrs.align = thisAlign(index);
  return obj;
}
let ColumnsModel = {}
const initColumnsModel = ()=>{
  ColumnsModel = {
    J:[
      {
        title: thisName(0),
        dataIndex: 'number',
        key: 'number',
        fixed: 'left',
        align: 'center',
        isShow: thisIsShow(0),
        width: thisWidth(0),
      },
      {
        title: thisName(1),
        dataIndex: 'num',
        key: 'num',
        isShow: thisIsShow(1),
        width: thisWidth(1),
        fixed: 'left',
        customRender: ({ record }) => initDirection(record.num,1)
      },
      {
        title: thisName(2),
        fixed: 'left',
        dataIndex: 'name',
        key: 'name',
        isShow: thisIsShow(2),
        width: thisWidth(2),
        customRender: ({ record }) => initDirection(record.name,2)
      },
      {
        title: thisName(5),
        isShow: thisIsShow(5),
        width: thisWidth(5),
        children: [
          {
            title: thisName('5-1'),
            dataIndex: 'qjj',
            key: 'qjj',
            align: 'center',
            isShow: thisIsShow('5-1'),
            width: thisWidth('5-1'),
            slots: { customRender: thisAlign('5-1') },// :style="fx=='left'?{float: left}:{float: right}}"
          },
          {
            title: thisName('5-2'),
            dataIndex: 'qdj',
            key: 'qdj',
            align: 'center',
            isShow: thisIsShow('5-2'),
            width: thisWidth('5-2'),
            slots: { customRender: thisAlign('5-2') }
          }
        ],
      },
      {
        title: thisName(6),
        isShow: thisIsShow(6),
        width: thisWidth(6),
        children: [
          {
            title: thisName('6-1'),
            dataIndex: 'fjj',
            key: 'fjj',
            align: 'center',
            isShow: thisIsShow('6-1'),
            width: thisWidth('6-1'),
            slots: { customRender: thisAlign('6-1') }
          },
          {
            title: thisName('6-2'),
            dataIndex: 'fdj',
            key: 'fdj',
            align: 'center',
            isShow: thisIsShow('6-2'),
            width: thisWidth('6-2'),
            slots: { customRender: thisAlign('6-2') }
          }
        ],
      },
      {
        title: thisName(7),
        isShow: thisIsShow(7),
        width: thisWidth(7),
        children: [
          {
            title: thisName('7-1'),
            dataIndex: 'ljj',
            key: 'ljj',
            align: 'center',
            width: thisWidth('7-1'),
            isShow: thisIsShow('7-1'),
            slots: { customRender: thisAlign('7-1') }
          },
          {
            title: thisName('7-2'),
            dataIndex: 'ldj',
            key: 'ldj',
            align: 'center',
            width: thisWidth('7-2'),
            isShow: thisIsShow('7-2'),
            slots: { customRender: thisAlign('7-2') }
          }
        ],
      },
      {
        title: thisName(8),
        width: thisWidth(8),
        isShow: thisIsShow(8),
        children: [
          {
            title: thisName('8-1'),
            dataIndex: 'mjj',
            key: 'mjj',
            align: 'center',
            width: thisWidth('8-1'),
            isShow: thisIsShow('8-1'),
            slots: { customRender: thisAlign('8-1') }
          },
          {
            title: thisName('8-2'),
            dataIndex: 'mdj',
            key: 'mdj',
            align: 'center',
            width: thisWidth('8-2'),
            isShow: thisIsShow('8-2'),
            slots: { customRender: thisAlign('8-2') }
          }
        ],
      }
    ],
    SJ: [
      {
        dataIndex: 'number',
        key: 'number',
        title: thisName(0),
        isShow: thisIsShow(0),
        width: thisWidth(0),
        fixed: 'left',
        align: 'center'
      },
      {
        dataIndex: 'num',
        key: 'num',
        title: thisName(1),
        isShow: thisIsShow(1),
        width: thisWidth(1),
        fixed: 'left',
        customRender: ({ record }) => initDirection(record.num,1)
      },
      {
        dataIndex: 'name',
        key: 'name',
        title: thisName(2),
        isShow: thisIsShow(2),
        width: thisWidth(2),
        fixed: 'left',
        customRender: ({ record }) => initDirection(record.name,2)
      },
      {
        dataIndex: 'unit',
        key: 'unit',
        title: thisName(3),
        isShow: thisIsShow(3),
        width: thisWidth(3),
        customRender: ({ record }) => initDirection(record.unit,3)
      },
      {
        title: '期初余额借方',
        isShow: thisIsShow('5-1'),
        width: thisWidth('5-1'),
        children: [
          {
            title: '数量',
            width: thisWidth('5-1-1'),
            isShow: thisIsShow('5-1-1'),
            slots: { customRender: thisAlign('5-1-1')},
            dataIndex: 'qjs',
            key: 'qjs',
            align: 'center'
          },
          {
            title: '金额',
            width: thisWidth('5-1-2'),
            isShow: thisIsShow('5-1-2'),
            slots: { customRender: thisAlign('5-1-2')},
            dataIndex: 'qjj',
            key: 'qjj',
            align: 'center',
          }
        ]
      },
      {
        title: '期初余额贷方',
        width: thisWidth('5-2'),
        isShow: thisIsShow('5-2'),
        children: [
          {
            title: '数量',
            width: thisWidth('5-2-1'),
            isShow: thisIsShow('5-2-1'),
            slots: { customRender: thisAlign('5-2-1')},
            dataIndex: 'qds',
            key: 'qds',
            align: 'center',
          },
          {
            title: '金额',
            width: thisWidth('5-2-2'),
            isShow: thisIsShow('5-2-2'),
            slots: { customRender: thisAlign('5-2-2')},
            dataIndex: 'qdj',
            key: 'qdj',
            align: 'center'
          }
        ]
      },
      {
        title: '本期发生借方',
        isShow: thisIsShow('6-1'),
        width: thisWidth('6-1'),
        children: [
          {
            title: '数量',
            width: thisWidth('6-1-1'),
            isShow: thisIsShow('6-1-1'),
            slots: { customRender: thisAlign('6-1-1')},
            dataIndex: 'fjs',
            key: 'fjs',
            align: 'center'
          },
          {
            title: '金额',
            dataIndex: 'fjj',
            key: 'fjj',
            width: thisWidth('6-1-2'),
            isShow: thisIsShow('6-1-2'),
            slots: { customRender: thisAlign('6-1-2')},
            align: 'center'
          }
        ]
      },
      {
        title: '本期发生贷方',
        isShow: thisIsShow('6-2'),
        width: thisWidth('6-2'),
        children: [
          {
            title: '数量',
            width: thisWidth('6-2-1'),
            isShow: thisIsShow('6-2-1'),
            slots: { customRender: thisAlign('6-2-1')},
            dataIndex: 'fds',
            key: 'fds',
            align: 'center'
          },
          {
            title: '金额',
            dataIndex: 'fdj',
            key: 'fdj',
            width: thisWidth('6-2-2'),
            isShow: thisIsShow('6-2-2'),
            slots: { customRender: thisAlign('6-2-2')},
            align: 'center'
          }
        ]
      },
      {
        title: '本年累计借方',
        isShow: thisIsShow('7-1'),
        width: thisWidth('7-1'),
        children: [
          {
            title: '数量',
            width: thisWidth('7-1-1'),
            isShow: thisIsShow('7-1-1'),
            slots: { customRender: thisAlign('7-1-1')},
            dataIndex: 'ljs',
            key: 'ljs',
            align: 'center'
          },
          {
            title: '金额',
            dataIndex: 'ljj',
            key: 'ljj',
            width: thisWidth('7-1-2'),
            isShow: thisIsShow('7-1-2'),
            slots: { customRender: thisAlign('7-1-2')},
            align: 'center'
          },
        ]
      },
      {
        title: '本年累计贷方',
        isShow: thisIsShow('7-2'),
        width: thisWidth('7-2'),
        children: [
          {
            title: '数量',
            width: thisWidth('7-2-1'),
            isShow: thisIsShow('7-2-1'),
            slots: { customRender: thisAlign('7-2-1')},
            dataIndex: 'lds',
            key: 'lds',
            align: 'center'
          },
          {
            title: '金额',
            dataIndex: 'ldj',
            key: 'ldj',
            width: thisWidth('7-2-2'),
            isShow: thisIsShow('7-2-2'),
            slots: { customRender: thisAlign('7-2-2')},
            align: 'center'
          },
        ]
      },
      {
        title: '期末余额借方',
        isShow: thisIsShow('8-1'),
        width: thisWidth('8-1'),
        children: [
          {
            title: '数量',
            width: thisWidth('8-1-1'),
            isShow: thisIsShow('8-1-1'),
            slots: { customRender: thisAlign('8-1-1')},
            dataIndex: 'mjs',
            key: 'mjs',
            align: 'center'
          },
          {
            title: '金额',
            width: thisWidth('8-1-2'),
            isShow: thisIsShow('8-1-2'),
            slots: { customRender: thisAlign('8-1-2')},
            dataIndex: 'mjj',
            key: 'mjj',
            align: 'center'
          }
        ]
      },
      {
        title: '期末余额贷方',
        isShow: thisIsShow('8-2'),
        width: thisWidth('8-2'),
        children: [
          {
            title: '数量',
            width: thisWidth('8-2-1'),
            isShow: thisIsShow('8-2-1'),
            slots: { customRender: thisAlign('8-2-1')},
            dataIndex: 'mds',
            key: 'mds',
            align: 'center'
          },
          {
            title: '金额',
            width: thisWidth('8-2-2'),
            isShow: thisIsShow('8-2-2'),
            slots: { customRender: thisAlign('8-2-2')},
            dataIndex: 'mdj',
            key: 'mdj',
            align: 'center'
          }
        ]
      }
    ],
    WJ: [
      {
        dataIndex: 'number',
        key: 'number',
        title: thisName(0),
        isShow: thisIsShow(0),
        width: thisWidth(0),
        fixed: 'left',
        align: 'center'
      },
      {
        dataIndex: 'num',
        key: 'num',
        title: thisName(1),
        isShow: thisIsShow(1),
        width: thisWidth(1),
        fixed: 'left',
        customRender: ({ record }) => initDirection(record.num,1)
      },
      {
        dataIndex: 'name',
        key: 'name',
        title: thisName(2),
        isShow: thisIsShow(2),
        width: thisWidth(2),
        fixed: 'left',
        customRender: ({ record }) => initDirection(record.name,2)
      },
      {
        dataIndex: 'type',
        key: 'type',
        title: thisName(4),
        isShow: thisIsShow(4),
        width: thisWidth(4),
        customRender: ({ record }) => initDirection(record.type,4)
      },
      {
        title: '期初余额借方',
        isShow: thisIsShow('5-1'),
        width: thisWidth('5-1'),
        children: [
          {
            title: '金额',
            isShow: thisIsShow('5-1-2'),
            width: thisWidth('5-1-2'),
            slots: { customRender: thisAlign('5-1-2') },
            dataIndex: 'qjj',
            key: 'qjj',
            align: 'center'
          },
          {
            title: '本币',
            dataIndex: 'qjb',
            key: 'qjb',
            isShow: thisIsShow('5-1-3'),
            width: thisWidth('5-1-3'),
            slots: { customRender: thisAlign('5-1-3') },
            align: 'center'
          }
        ]
      },
      {
        title: '期初余额贷方',
        isShow: thisIsShow('5-2'),
        width: thisWidth('5-2'),
        children: [
          {
            title: '金额',
            isShow: thisIsShow('5-2-2'),
            width: thisWidth('5-2-2'),
            slots: { customRender: thisAlign('5-2-2') },
            dataIndex: 'qdj',
            key: 'qdj',
            align: 'center'
          },
          {
            title: '本币',
            dataIndex: 'qdb',
            key: 'qdb',
            isShow: thisIsShow('5-2-3'),
            width: thisWidth('5-2-3'),
            slots: { customRender: thisAlign('5-2-3') },
            align: 'center'
          }
        ]
      },
      {
        title: '本期发生借方',
        isShow: thisIsShow('6-1'),
        width: thisWidth('6-1'),
        children: [
          {
            title: '金额',
            dataIndex: 'fjj',
            key: 'fjj',
            isShow: thisIsShow('6-1-2'),
            width: thisWidth('6-1-2'),
            slots: { customRender: thisAlign('6-1-2') },
            align: 'center'
          },
          {
            title: '本币',
            dataIndex: 'fjb',
            key: 'fjb',
            isShow: thisIsShow('6-1-3'),
            width: thisWidth('6-1-3'),
            slots: { customRender: thisAlign('6-1-3') },
            align: 'center'
          }
        ]
      },
      {
        title: '本期发生贷方',
        isShow: thisIsShow('6-2'),
        width: thisWidth('6-2'),
        children: [
          {
            title: '金额',
            dataIndex: 'fdj',
            key: 'fdj',
            isShow: thisIsShow('6-2-2'),
            width: thisWidth('6-2-2'),
            slots: { customRender: thisAlign('6-2-2') },
            align: 'center'
          },
          {
            title: '本币',
            dataIndex: 'fdb',
            key: 'fdb',
            isShow: thisIsShow('6-2-3'),
            width: thisWidth('6-2-3'),
            slots: { customRender: thisAlign('6-2-3') },
            align: 'center'
          }
        ]
      },
      {
        title: '本年累计借方',
        isShow: thisIsShow('7-1'),
        width: thisWidth('7-1'),
        children: [
          {
            title: '金额',
            dataIndex: 'ljj',
            key: 'ljj',
            isShow: thisIsShow('7-1-2'),
            width: thisWidth('7-1-2'),
            slots: { customRender: thisAlign('7-1-2') },
            align: 'center'
          },
          {
            title: '本币',
            dataIndex: 'ljb',
            key: 'ljb',
            isShow: thisIsShow('7-1-3'),
            width: thisWidth('7-1-3'),
            slots: { customRender: thisAlign('7-1-3') },
            align: 'center'
          }
        ]
      },
      {
        title: '本年累计贷方',
        isShow: thisIsShow('7-2'),
        width: thisWidth('7-2'),
        children: [
          {
            title: '金额',
            dataIndex: 'ldj',
            key: 'ldj',
            isShow: thisIsShow('7-2-2'),
            width: thisWidth('7-2-2'),
            slots: { customRender: thisAlign('7-2-2') },
            align: 'center'
          },
          {
            title: '本币',
            dataIndex: 'ldb',
            key: 'ldb',
            isShow: thisIsShow('7-2-3'),
            width: thisWidth('7-2-3'),
            slots: { customRender: thisAlign('7-2-3') },
            align: 'center'
          }
        ]
      },
      {
        title: '期末余额借方',
        isShow: thisIsShow('8-1'),
        width: thisWidth('8-1'),
        children: [
          {
            title: '金额',
            isShow: thisIsShow('8-1-2'),
            width: thisWidth('8-1-2'),
            slots: { customRender: thisAlign('8-1-2') },
            dataIndex: 'mjj',
            key: 'mjj',
            align: 'center'

          },
          {
            title: '本币',
            isShow: thisIsShow('8-1-3'),
            width: thisWidth('8-1-3'),
            slots: { customRender: thisAlign('8-1-3') },
            dataIndex: 'mjb',
            key: 'mjb',
            align: 'center'
          }
        ]
      },
      {
        title: '期末余额贷方',
        isShow: thisIsShow('8-2'),
        width: thisWidth('8-2'),
        children: [
          {
            title: '金额',
            isShow: thisIsShow('8-2-2'),
            width: thisWidth('8-2-2'),
            slots: { customRender: thisAlign('8-2-2') },
            dataIndex: 'mdj',
            key: 'mdj',
            align: 'center'
          },
          {
            title: '本币',
            isShow: thisIsShow('8-2-3'),
            width: thisWidth('8-2-3'),
            slots: { customRender: thisAlign('8-2-3') },
            dataIndex: 'mdb',
            key: 'mdb',
            align: 'center'
          }
        ]
      }
    ],
    SWJ: [
      {
        title: thisName(0),
        dataIndex: 'number',
        key: 'number',
        isShow: thisIsShow(0),
        width: thisWidth(0),
        fixed: 'left',
        align: 'center'
      },
      {
        title: thisName(1),
        dataIndex: 'num',
        key: 'num',
        isShow: thisIsShow(1),
        width: thisWidth(1),
        fixed: 'left',
        customRender: ({ record }) => initDirection(record.num,1)
      },
      {
        title: thisName(2),
        dataIndex: 'name',
        key: 'name',
        isShow: thisIsShow(2),
        width: thisWidth(2),
        fixed: 'left',
        customRender: ({ record }) => initDirection(record.name,2)
      },
      {
        title: thisName(3),
        dataIndex: 'unit',
        key: 'unit',
        isShow: thisIsShow(3),
        width: thisWidth(3),
        customRender: ({ record }) => initDirection(record.unit,3)
      },
      {
        title: thisName(4),
        dataIndex: 'type',
        key: 'type',
        isShow: thisIsShow(4),
        width: thisWidth(4),
        customRender: ({ record }) => initDirection(record.type,4)
      },
      {
        title: thisName('5-1'),
        isShow: thisIsShow('5-1'),
        width: thisWidth('5-1'),
        children: [
          {
            isShow: thisIsShow('5-1-1'),
            title: thisName('5-1-1'),
            width: thisWidth('5-1-1'),
            slots: { customRender: thisAlign('5-1-1') },
            dataIndex: 'qjs',
            key: 'qjs',
            align: 'center'
          },
          {
            title: thisName('5-1-2'),
            isShow: thisIsShow('5-1-2'),
            width: thisWidth('5-1-2'),
            slots: { customRender: thisAlign('5-1-2') },
            dataIndex: 'qjj',
            key: 'qjj',
            align: 'center'
          },
          {
            dataIndex: 'qjb',
            key: 'qjb',
            title: thisName('5-1-3'),
            isShow: thisIsShow('5-1-3'),
            width: thisWidth('5-1-3'),
            slots: { customRender: thisAlign('5-1-3') },
            align: 'center'
          }
        ]
      },
      {
        title: thisName('5-2'),
        isShow: thisIsShow('5-2'),
        width: thisWidth('5-2'),
        children: [
          {
            title: thisName('5-2-1'),
            isShow: thisIsShow('5-2-1'),
            width: thisWidth('5-2-1'),
            slots: { customRender: thisAlign('5-2-1') },
            dataIndex: 'qds',
            key: 'qds',
            align: 'center'
          },
          {
            title: thisName('5-2-2'),
            isShow: thisIsShow('5-2-2'),
            width: thisWidth('5-2-2'),
            slots: { customRender: thisAlign('5-2-2') },
            dataIndex: 'qdj',
            key: 'qdj',
            align: 'center'
          },
          {
            dataIndex: 'qdb',
            key: 'qdb',
            title: thisName('5-2-3'),
            isShow: thisIsShow('5-2-3'),
            width: thisWidth('5-2-3'),
            slots: { customRender: thisAlign('5-2-3') },
            align: 'center'
          }
        ]
      },
      {
        title: thisName('6-1'),
        isShow: thisIsShow('6-1'),
        width: thisWidth('6-1'),
        children: [
          {
            dataIndex: 'fjs',
            title: thisName('6-1-1'),
            isShow: thisIsShow('6-1-1'),
            width: thisWidth('6-1-1'),
            slots: { customRender: thisAlign('6-1-1') },
            key: 'fjs',
            align: 'center'
          },
          {
            dataIndex: 'fjj',
            key: 'fjj',
            title: thisName('6-1-2'),
            isShow: thisIsShow('6-1-2'),
            width: thisWidth('6-1-2'),
            slots: { customRender: thisAlign('6-1-2') },
            align: 'center'
          },
          {
            dataIndex: 'fjb',
            key: 'fjb',
            title: thisName('6-1-3'),
            isShow: thisIsShow('6-1-3'),
            width: thisWidth('6-1-3'),
            slots: { customRender: thisAlign('6-1-3') },
            align: 'center'
          }
        ]
      },
      {
        title: thisName('6-1'),
        isShow: thisIsShow('6-2'),
        width: thisWidth('6-2'),
        children: [
          {
            title: thisName('6-2-1'),
            isShow: thisIsShow('6-2-1'),
            width: thisWidth('6-2-1'),
            slots: { customRender: thisAlign('6-2-1') },
            dataIndex: 'fds',
            key: 'fds',
            align: 'center'
          },
          {
            dataIndex: 'fdj',
            key: 'fdj',
            title: thisName('6-2-2'),
            isShow: thisIsShow('6-2-2'),
            width: thisWidth('6-2-2'),
            slots: { customRender: thisAlign('6-2-2') },
            align: 'center'
          },
          {
            dataIndex: 'fdb',
            key: 'fdb',
            title: thisName('6-2-3'),
            isShow: thisIsShow('6-2-3'),
            width: thisWidth('6-2-3'),
            slots: { customRender: thisAlign('6-2-3') },
            align: 'center'
          }
        ]
      },
      {
        title: thisName('7-1'),
        isShow: thisIsShow('7-1'),
        width: thisWidth('7-1'),
        children: [
          {
            title: thisName('7-1-1'),
            isShow: thisIsShow('7-1-1'),
            width: thisWidth('7-1-1'),
            slots: { customRender: thisAlign('7-1-1') },
            dataIndex: 'ljs',
            key: 'ljs',
            align: 'center'
          },
          {
            dataIndex: 'ljj',
            key: 'ljj',
            title: thisName('7-1-2'),
            isShow: thisIsShow('7-1-2'),
            width: thisWidth('7-1-2'),
            slots: { customRender: thisAlign('7-1-2') },
            align: 'center'
          },
          {
            dataIndex: 'ljb',
            key: 'ljb',
            title: thisName('7-1-3'),
            isShow: thisIsShow('7-1-3'),
            width: thisWidth('7-1-3'),
            slots: { customRender: thisAlign('7-1-3') },
            align: 'center'
          }
        ]
      },
      {
        title: thisName('7-2'),
        isShow: thisIsShow('7-2'),
        width: thisWidth('7-2'),
        children: [
          {
            title: thisName('7-2-1'),
            isShow: thisIsShow('7-2-1'),
            width: thisWidth('7-2-1'),
            slots: { customRender: thisAlign('7-2-1') },
            dataIndex: 'lds',
            key: 'lds',
            align: 'center'
          },
          {
            dataIndex: 'ldj',
            key: 'ldj',
            title: thisName('7-2-2'),
            isShow: thisIsShow('7-2-2'),
            width: thisWidth('7-2-2'),
            slots: { customRender: thisAlign('7-2-2') },
            align: 'center'
          },
          {
            dataIndex: 'ldb',
            key: 'ldb',
            title: thisName('7-2-3'),
            isShow: thisIsShow('7-2-3'),
            width: thisWidth('7-2-3'),
            slots: { customRender: thisAlign('7-2-3') },
            align: 'center'
          }
        ]
      },
      {
        title: thisName('8-1'),
        isShow: thisIsShow('8-1'),
        width: thisWidth('8-1'),
        children: [
          {
            title: thisName('8-1-1'),
            isShow: thisIsShow('8-1-1'),
            width: thisWidth('8-1-1'),
            slots: { customRender: thisAlign('8-1-1') },
            dataIndex: 'mjs',
            key: 'mjs',
            align: 'center'
          },
          {
            title: thisName('8-1-2'),
            isShow: thisIsShow('8-1-2'),
            width: thisWidth('8-1-2'),
            slots: { customRender: thisAlign('8-1-2') },
            dataIndex: 'mjj',
            key: 'mjj',
            align: 'center'
          },
          {
            title: thisName('8-1-3'),
            isShow: thisIsShow('8-1-3'),
            width: thisWidth('8-1-3'),
            slots: { customRender: thisAlign('8-1-3') },
            dataIndex: 'mjb',
            key: 'mjb',
            align: 'center'
          }
        ]
      },
      {
        title: thisName('8-2'),
        isShow: thisIsShow('8-2'),
        width: thisWidth('8-2'),
        children: [
          {
            title: thisName('8-2-1'),
            isShow: thisIsShow('8-2-1'),
            width: thisWidth('8-2-1'),
            slots: { customRender: thisAlign('8-2-1') },
            dataIndex: 'mds',
            key: 'mds',
            align: 'center'
          },
          {
            title: thisName('8-2-2'),
            isShow: thisIsShow('8-2-2'),
            width: thisWidth('8-2-2'),
            slots: { customRender: thisAlign('8-2-2') },
            dataIndex: 'mdj',
            key: 'mdj',
            align: 'center'
          },
          {
            title: thisName('8-2-3'),
            isShow: thisIsShow('8-2-3'),
            width: thisWidth('8-2-3'),
            slots: { customRender: thisAlign('8-2-3') },
            dataIndex: 'mdb',
            key: 'mdb',
            align: 'center'
          }
        ]
      }
    ],
  }
}
export function getBankCheckList() {
  return defHttp.request({
    url: '/bankcheck/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function saveBankCheck(params:any) {
  return defHttp.request({
    url: '/bankcheck',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function initPageBasicDataByColumns(type:string,isTotal:boolean,reloadMark:boolean) {
  // 获取默认参数
  if (isTotal){
    ColumnsModel[type][1].slots = {}
  }
  let fiterList = ColumnsModel[type]
  return fiterList.filter(item=> item.isShow);
}
export function changeDefaultDynamics(list) {
  // 改变默认数据
  dynamicColumnAndDataModel['DEFAULT'] = list
  initColumnsModel()
}

export function initDynamics() {
 return dynamicColumnAndDataModel
}
export function initPageBasicDataMX() {
  return [{key: 0,date:'',number:'',summary: '期初余额',jf:'',df:'',fx:'平',yue:''}]
}
export function initPageBasicDataMXByColumns() {
  return [{
    title: '日期',
    dataIndex: 'date',
    key: 'date',
    width: 120,
    align: 'center'
  },{
    title: '凭证号',
    dataIndex: 'number',
    key: 'number',
    width: 120,
    align: 'center'
  },{
    title: '摘要',
    dataIndex: 'summary',
    key: 'summary',
    width: 320,
    align: 'center'
  },{
    title: '借方',
    dataIndex: 'jf',
    key: 'jf',
    width: 150,
    align: 'center'
  },{
    title: '贷方',
    dataIndex: 'df',
    key: 'df',
    width: 150,
    align: 'center'
  },{
    title: '方向',
    dataIndex: 'fx',
    key: 'fx',
    width: 80,
    align: 'center'
  },{
    title: '余额',
    dataIndex: 'yue',
    key: 'yue',
    width: 150,
    align: 'center'
  }]
}

export function initPageBasicData() {
  let data = []
  for (let i = 0; i < 210; i++) {
    data.push({
      key: i,
      number: i + 1,
      num: 101+(i+''),
      name: 'John Brown',
      unit: '个',
      type: '人民币',
      qjs: i + 1,
      qjj: '1,000,000.88',
      qjb: '1,000,000.88',
      qds: i + 1,
      qdj: '1,000,000.88',
      qdb: '1,000,000.88',
      fjs: i + 1,
      fjj: '1,000,000.88',
      fjb: '1,000,000.88',
      fds: i + 1,
      fdj: '1,000,000.88',
      fdb: '1,000,000.88',
      ljs: i + 1,
      ljj: '1,000,000.88',
      ljb: '1,000,000.88',
      lds: i + 1,
      ldj: '1,000,000.88',
      ldb: '1,000,000.88',
      mjs: i + 1,
      mjj: '1,000,000.88',
      mjb: '1,000,000.88',
      mds: i + 1,
      mdj: '1,000,000.88',
      mdb: '1,000,000.88',
    });
  }
  return data;
}
export function initPageBasicDataTotal() {
  return [{
    key: 1,
    number: '',
    num: '合计',
    name: '',
    qjs:  '1',
    qjj:  '1000,000,000.88',
    qjb:  '1000,000,000.88',
    qds:  '1',
    qdj:  '1000,000,000.88',
    qdb:  '1000,000,000.88',
    fjs:  '1',
    fjj:  '1000,000,000.88',
    fjb:  '1000,000,000.88',
    fds:  '1',
    fdj:  '1000,000,000.88',
    fdb:  '1000,000,000.88',
    ljs:  '1',
    ljj:  '1000,000,000.88',
    ljb:  '1000,000,000.88',
    lds:  '1',
    ldj:  '1000,000,000.88',
    ldb:  '1000,000,000.88',
    mjs:  '1',
    mjj:  '1000,000,000.88',
    mjb:  '1000,000,000.88',
    mds:  '1',
    mdj:  '1000,000,000.88',
    mdb:  '1000,000,000.88',
  }];
}
initColumnsModel()
const oldCoulums = {
  J:[
    {
      title: '序号',
      dataIndex: 'number',
      key: 'number',
      fixed: 'left',
      align: 'center',
      isShow: thisIsShow(0),
      width: thisWidth(0),
    },
    {
      title: '科目编码',
      dataIndex: 'num',
      key: 'num',
      isShow: thisIsShow(1),
      width: thisWidth(1),
      fixed: 'left',
      customRender: ({ record }) => initDirection(record.num,1)
    },
    {
      title: '科目名称',
      dataIndex: 'name',
      key: 'name',
      isShow: thisIsShow(2),
      width: thisWidth(2),
      customRender: ({ record }) => initDirection(record.name,2)
    },
    {
      title: '期初余额',
      isShow: thisIsShow(5),
      width: thisWidth(5),
      children: [
        {
          title: '借方',
          dataIndex: 'qjj',
          key: 'qjj',
          align: 'center',
          isShow: thisIsShow('5-1'),
          width: thisWidth('5-1'),
          slots: { customRender: thisAlign('5-1') },// :style="fx=='left'?{float: left}:{float: right}}"
        },
        {
          title: '贷方',
          dataIndex: 'qdj',
          key: 'qdj',
          align: 'center',
          isShow: thisIsShow('5-2'),
          width: thisWidth('5-2'),
          slots: { customRender: thisAlign('5-2') }
        }
      ],
    },
    {
      title: '本期发生',
      isShow: thisIsShow(6),
      width: thisWidth(6),
      children: [
        {
          title: '借方',
          dataIndex: 'fjj',
          key: 'fjj',
          align: 'center',
          isShow: thisIsShow('6-1'),
          width: thisWidth('6-1'),
          slots: { customRender: thisAlign('6-1') }
        },
        {
          title: '贷方',
          dataIndex: 'fdj',
          key: 'fdj',
          align: 'center',
          isShow: thisIsShow('6-2'),
          width: thisWidth('6-2'),
          slots: { customRender: thisAlign('6-2') }
        }
      ],
    },
    {
      title: '本年累计',
      isShow: thisIsShow(7),
      width: thisWidth(7),
      children: [
        {
          title: '借方',
          dataIndex: 'ljj',
          key: 'ljj',
          align: 'center',
          width: thisWidth('7-1'),
          isShow: thisIsShow('7-1'),
          slots: { customRender: thisAlign('7-1') }
        },
        {
          title: '贷方',
          dataIndex: 'ldj',
          key: 'ldj',
          align: 'center',
          width: thisWidth('7-2'),
          isShow: thisIsShow('7-2'),
          slots: { customRender: thisAlign('7-2') }
        }
      ],
    },
    {
      title: '期末余额',
      width: thisWidth(8),
      isShow: thisIsShow(8),
      children: [
        {
          title: '借方',
          dataIndex: 'mjj',
          key: 'mjj',
          align: 'center',
          width: thisWidth('8-1'),
          isShow: thisIsShow('8-1'),
          slots: { customRender: thisAlign('8-1') }
        },
        {
          title: '贷方',
          dataIndex: 'mdj',
          key: 'mdj',
          align: 'center',
          width: thisWidth('8-2'),
          isShow: thisIsShow('8-2'),
          slots: { customRender: thisAlign('8-2') }
        }
      ],
    }
  ],
  SJ: [
    {
      title: '序号',
      dataIndex: 'number',
      key: 'number',
      isShow: thisIsShow(0),
      width: thisWidth(0),
      fixed: 'left',
      align: 'center'
    },
    {
      title: '科目编码',
      dataIndex: 'num',
      key: 'num',
      isShow: thisIsShow(1),
      width: thisWidth(1),
      fixed: 'left',
      customRender: ({ record }) => initDirection(record.num,1)
    },
    {
      title: '科目名称',
      dataIndex: 'name',
      key: 'name',
      isShow: thisIsShow(2),
      width: thisWidth(2),
      fixed: 'left',
      customRender: ({ record }) => initDirection(record.name,2)
    },
    {
      title: '计量单位',
      dataIndex: 'unit',
      key: 'unit',
      isShow: thisIsShow(3),
      width: thisWidth(3),
      customRender: ({ record }) => initDirection(record.unit,3)
    },
    {
      title: '期初余额',
      isShow: thisIsShow(5),
      width: thisWidth(5),
      children: [
        {
          title: '借方',
          isShow: thisIsShow('5-1'),
          width: thisWidth('5-1'),
          children: [
            {
              title: '数量',
              width: thisWidth('5-1-1'),
              isShow: thisIsShow('5-1-1'),
              slots: { customRender: thisAlign('5-1-1')},
              dataIndex: 'qjs',
              key: 'qjs',
              align: 'center'
            },
            {
              title: '金额',
              width: thisWidth('5-1-2'),
              isShow: thisIsShow('5-1-2'),
              slots: { customRender: thisAlign('5-1-2')},
              dataIndex: 'qjj',
              key: 'qjj',
              align: 'center',
            }
          ]
        },
        {
          title: '贷方',
          width: thisWidth('5-2'),
          isShow: thisIsShow('5-2'),
          children: [
            {
              title: '数量',
              width: thisWidth('5-2-1'),
              isShow: thisIsShow('5-2-1'),
              slots: { customRender: thisAlign('5-2-1')},
              dataIndex: 'qds',
              key: 'qds',
              align: 'center',
            },
            {
              title: '金额',
              width: thisWidth('5-2-2'),
              isShow: thisIsShow('5-2-2'),
              slots: { customRender: thisAlign('5-2-2')},
              dataIndex: 'qdj',
              key: 'qdj',
              align: 'center'
            }
          ]
        }
      ],
    },
    {
      title: '本期发生',
      isShow: thisIsShow(6),
      width: thisWidth(6),
      children: [
        {
          title: '借方',
          isShow: thisIsShow('6-1'),
          width: thisWidth('6-1'),
          children: [
            {
              title: '数量',
              width: thisWidth('6-1-1'),
              isShow: thisIsShow('6-1-1'),
              slots: { customRender: thisAlign('6-1-1')},
              dataIndex: 'fjs',
              key: 'fjs',
              align: 'center'
            },
            {
              title: '金额',
              dataIndex: 'fjj',
              key: 'fjj',
              width: thisWidth('6-1-2'),
              isShow: thisIsShow('6-1-2'),
              slots: { customRender: thisAlign('6-1-2')},
              align: 'center'
            }
          ]
        },
        {
          title: '贷方',
          isShow: thisIsShow('6-2'),
          width: thisWidth('6-2'),
          children: [
            {
              title: '数量',
              width: thisWidth('6-2-1'),
              isShow: thisIsShow('6-2-1'),
              slots: { customRender: thisAlign('6-2-1')},
              dataIndex: 'fds',
              key: 'fds',
              align: 'center'
            },
            {
              title: '金额',
              dataIndex: 'fdj',
              key: 'fdj',
              width: thisWidth('6-2-2'),
              isShow: thisIsShow('6-2-2'),
              slots: { customRender: thisAlign('6-2-2')},
              align: 'center'
            }
          ]
        }
      ],
    },
    {
      title: '本年累计',
      isShow: thisIsShow(7),
      width: thisWidth(7),
      children: [
        {
          title: '借方',
          isShow: thisIsShow('7-1'),
          width: thisWidth('7-1'),
          children: [
            {
              title: '数量',
              width: thisWidth('7-1-1'),
              isShow: thisIsShow('7-1-1'),
              slots: { customRender: thisAlign('7-1-1')},
              dataIndex: 'ljs',
              key: 'ljs',
              align: 'center'
            },
            {
              title: '金额',
              dataIndex: 'ljj',
              key: 'ljj',
              width: thisWidth('7-1-2'),
              isShow: thisIsShow('7-1-2'),
              slots: { customRender: thisAlign('7-1-2')},
              align: 'center'
            },
          ]
        },
        {
          title: '贷方',
          isShow: thisIsShow('7-2'),
          width: thisWidth('7-2'),
          children: [
            {
              title: '数量',
              width: thisWidth('7-2-1'),
              isShow: thisIsShow('7-2-1'),
              slots: { customRender: thisAlign('7-2-1')},
              dataIndex: 'lds',
              key: 'lds',
              align: 'center'
            },
            {
              title: '金额',
              dataIndex: 'ldj',
              key: 'ldj',
              width: thisWidth('7-2-2'),
              isShow: thisIsShow('7-2-2'),
              slots: { customRender: thisAlign('7-2-2')},
              align: 'center'
            },
          ]
        }
      ],
    },
    {
      title: '期末余额',
      isShow: thisIsShow(8),
      width: thisWidth(8),
      children: [
        {
          title: '借方',
          isShow: thisIsShow('8-1'),
          width: thisWidth('8-1'),
          children: [
            {
              title: '数量',
              width: thisWidth('8-1-1'),
              isShow: thisIsShow('8-1-1'),
              slots: { customRender: thisAlign('8-1-1')},
              dataIndex: 'mjs',
              key: 'mjs',
              align: 'center'
            },
            {
              title: '金额',
              width: thisWidth('8-1-2'),
              isShow: thisIsShow('8-1-2'),
              slots: { customRender: thisAlign('8-1-2')},
              dataIndex: 'mjj',
              key: 'mjj',
              align: 'center'
            }
          ]
        },
        {
          title: '贷方',
          isShow: thisIsShow('8-2'),
          width: thisWidth('8-2'),
          children: [
            {
              title: '数量',
              width: thisWidth('8-2-1'),
              isShow: thisIsShow('8-2-1'),
              slots: { customRender: thisAlign('8-2-1')},
              dataIndex: 'mds',
              key: 'mds',
              align: 'center'
            },
            {
              title: '金额',
              width: thisWidth('8-2-2'),
              isShow: thisIsShow('8-2-2'),
              slots: { customRender: thisAlign('8-2-2')},
              dataIndex: 'mdj',
              key: 'mdj',
              align: 'center'
            }
          ]
        }
      ],
    }
  ],
  WJ: [
    {
      title: '序号',
      dataIndex: 'number',
      key: 'number',
      isShow: thisIsShow(0),
      width: thisWidth(0),
      fixed: 'left',
      align: 'center'
    },
    {
      title: '科目编码',
      dataIndex: 'num',
      key: 'num',
      isShow: thisIsShow(1),
      width: thisWidth(1),
      fixed: 'left',
      customRender: ({ record }) => initDirection(record.num,1)
    },
    {
      title: '科目名称',
      dataIndex: 'name',
      key: 'name',
      isShow: thisIsShow(2),
      width: thisWidth(2),
      fixed: 'left',
      customRender: ({ record }) => initDirection(record.name,2)
    },
    {
      title: '币种',
      dataIndex: 'type',
      key: 'type',
      isShow: thisIsShow(4),
      width: thisWidth(4),
      customRender: ({ record }) => initDirection(record.type,4)
    },
    {
      title: '期初余额',
      isShow: thisIsShow(5),
      width: thisWidth(5),
      children: [
        {
          title: '借方',
          isShow: thisIsShow('5-1'),
          width: thisWidth('5-1'),
          children: [
            {
              title: '金额',
              isShow: thisIsShow('5-1-2'),
              width: thisWidth('5-1-2'),
              slots: { customRender: thisAlign('5-1-2') },
              dataIndex: 'qjj',
              key: 'qjj',
              align: 'center'
            },
            {
              title: '本币',
              dataIndex: 'qjb',
              key: 'qjb',
              isShow: thisIsShow('5-1-3'),
              width: thisWidth('5-1-3'),
              slots: { customRender: thisAlign('5-1-3') },
              align: 'center'
            }
          ]
        },
        {
          title: '贷方',
          isShow: thisIsShow('5-2'),
          width: thisWidth('5-2'),
          children: [
            {
              title: '金额',
              isShow: thisIsShow('5-2-2'),
              width: thisWidth('5-2-2'),
              slots: { customRender: thisAlign('5-2-2') },
              dataIndex: 'qdj',
              key: 'qdj',
              align: 'center'
            },
            {
              title: '本币',
              dataIndex: 'qdb',
              key: 'qdb',
              isShow: thisIsShow('5-2-3'),
              width: thisWidth('5-2-3'),
              slots: { customRender: thisAlign('5-2-3') },
              align: 'center'
            }
          ]
        }
      ],
    },
    {
      title: '本期发生',
      isShow: thisIsShow(6),
      width: thisWidth(6),
      children: [
        {
          title: '借方',
          isShow: thisIsShow('6-1'),
          width: thisWidth('6-1'),
          children: [
            {
              title: '金额',
              dataIndex: 'fjj',
              key: 'fjj',
              isShow: thisIsShow('6-1-2'),
              width: thisWidth('6-1-2'),
              slots: { customRender: thisAlign('6-1-2') },
              align: 'center'
            },
            {
              title: '本币',
              dataIndex: 'fjb',
              key: 'fjb',
              isShow: thisIsShow('6-1-3'),
              width: thisWidth('6-1-3'),
              slots: { customRender: thisAlign('6-1-3') },
              align: 'center'
            }
          ]
        },
        {
          title: '贷方',
          isShow: thisIsShow('6-2'),
          width: thisWidth('6-2'),
          children: [
            {
              title: '金额',
              dataIndex: 'fdj',
              key: 'fdj',
              isShow: thisIsShow('6-2-2'),
              width: thisWidth('6-2-2'),
              slots: { customRender: thisAlign('6-2-2') },
              align: 'center'
            },
            {
              title: '本币',
              dataIndex: 'fdb',
              key: 'fdb',
              isShow: thisIsShow('6-2-3'),
              width: thisWidth('6-2-3'),
              slots: { customRender: thisAlign('6-2-3') },
              align: 'center'
            }
          ]
        }
      ],
    },
    {
      title: '本年累计',
      isShow: thisIsShow(7),
      width: thisWidth(7),
      children: [
        {
          title: '借方',
          isShow: thisIsShow('7-1'),
          width: thisWidth('7-1'),
          children: [
            {
              title: '金额',
              dataIndex: 'ljj',
              key: 'ljj',
              isShow: thisIsShow('7-1-2'),
              width: thisWidth('7-1-2'),
              slots: { customRender: thisAlign('7-1-2') },
              align: 'center'
            },
            {
              title: '本币',
              dataIndex: 'ljb',
              key: 'ljb',
              isShow: thisIsShow('7-1-3'),
              width: thisWidth('7-1-3'),
              slots: { customRender: thisAlign('7-1-3') },
              align: 'center'
            }
          ]
        },
        {
          title: '贷方',
          isShow: thisIsShow('7-2'),
          width: thisWidth('7-2'),
          children: [
            {
              title: '金额',
              dataIndex: 'ldj',
              key: 'ldj',
              isShow: thisIsShow('7-2-2'),
              width: thisWidth('7-2-2'),
              slots: { customRender: thisAlign('7-2-2') },
              align: 'center'
            },
            {
              title: '本币',
              dataIndex: 'ldb',
              key: 'ldb',
              isShow: thisIsShow('7-2-3'),
              width: thisWidth('7-2-3'),
              slots: { customRender: thisAlign('7-2-3') },
              align: 'center'
            }
          ]
        }
      ],
    },
    {
      title: '期末余额',
      isShow: thisIsShow(8),
      width: thisWidth(8),
      children: [
        {
          title: '借方',
          isShow: thisIsShow('8-1'),
          width: thisWidth('8-1'),
          children: [
            {
              title: '金额',
              isShow: thisIsShow('8-1-2'),
              width: thisWidth('8-1-2'),
              slots: { customRender: thisAlign('8-1-2') },
              dataIndex: 'mjj',
              key: 'mjj',
              align: 'center'

            },
            {
              title: '本币',
              isShow: thisIsShow('8-1-3'),
              width: thisWidth('8-1-3'),
              slots: { customRender: thisAlign('8-1-3') },
              dataIndex: 'mjb',
              key: 'mjb',
              align: 'center'
            }
          ]
        },
        {
          title: '贷方',
          isShow: thisIsShow('8-2'),
          width: thisWidth('8-2'),
          children: [
            {
              title: '金额',
              isShow: thisIsShow('8-2-2'),
              width: thisWidth('8-2-2'),
              slots: { customRender: thisAlign('8-2-2') },
              dataIndex: 'mdj',
              key: 'mdj',
              align: 'center'
            },
            {
              title: '本币',
              isShow: thisIsShow('8-2-3'),
              width: thisWidth('8-2-3'),
              slots: { customRender: thisAlign('8-2-3') },
              dataIndex: 'mdb',
              key: 'mdb',
              align: 'center'
            }
          ]
        }
      ],
    }
  ],
  SWJ: [
    {
      title: '序号',
      dataIndex: 'number',
      key: 'number',
      isShow: thisIsShow(0),
      width: thisWidth(0),
      fixed: 'left',
      align: 'center'
    },
    {
      title: '科目编码',
      dataIndex: 'num',
      key: 'num',
      isShow: thisIsShow(1),
      width: thisWidth(1),
      fixed: 'left',
      customRender: ({ record }) => initDirection(record.num,1)
    },
    {
      title: '科目名称',
      dataIndex: 'name',
      key: 'name',
      isShow: thisIsShow(2),
      width: thisWidth(2),
      fixed: 'left',
      customRender: ({ record }) => initDirection(record.name,2)
    },
    {
      title: '计量单位',
      dataIndex: 'unit',
      key: 'unit',
      isShow: thisIsShow(3),
      width: thisWidth(3),
      customRender: ({ record }) => initDirection(record.unit,3)
    },
    {
      title: '币种',
      dataIndex: 'type',
      key: 'type',
      isShow: thisIsShow(4),
      width: thisWidth(4),
      customRender: ({ record }) => initDirection(record.type,4)
    },
    {
      title: '期初余额',
      isShow: thisIsShow(5),
      width: thisWidth(5),
      children: [
        {
          title: '借方',
          isShow: thisIsShow('5-1'),
          width: thisWidth('5-1'),
          children: [
            {
              title: '数量',
              isShow: thisIsShow('5-1-1'),
              width: thisWidth('5-1-1'),
              slots: { customRender: thisAlign('5-1-1') },
              dataIndex: 'qjs',
              key: 'qjs',
              align: 'center'
            },
            {
              title: '金额',
              isShow: thisIsShow('5-1-2'),
              width: thisWidth('5-1-2'),
              slots: { customRender: thisAlign('5-1-2') },
              dataIndex: 'qjj',
              key: 'qjj',
              align: 'center'
            },
            {
              title: '本币',
              dataIndex: 'qjb',
              key: 'qjb',
              isShow: thisIsShow('5-1-3'),
              width: thisWidth('5-1-3'),
              slots: { customRender: thisAlign('5-1-3') },
              align: 'center'
            }
          ]
        },
        {
          title: '贷方',
          isShow: thisIsShow('5-2'),
          width: thisWidth('5-2'),
          children: [
            {
              title: '数量',
              isShow: thisIsShow('5-2-1'),
              width: thisWidth('5-2-1'),
              slots: { customRender: thisAlign('5-2-1') },
              dataIndex: 'qds',
              key: 'qds',
              align: 'center'
            },
            {
              title: '金额',
              isShow: thisIsShow('5-2-2'),
              width: thisWidth('5-2-2'),
              slots: { customRender: thisAlign('5-2-2') },
              dataIndex: 'qdj',
              key: 'qdj',
              align: 'center'
            },
            {
              title: '本币',
              dataIndex: 'qdb',
              key: 'qdb',
              isShow: thisIsShow('5-2-3'),
              width: thisWidth('5-2-3'),
              slots: { customRender: thisAlign('5-2-3') },
              align: 'center'
            }
          ]
        }
      ],
    },
    {
      title: '本期发生',
      isShow: thisIsShow(6),
      width: thisWidth(6),
      children: [
        {
          title: '借方',
          isShow: thisIsShow('6-1'),
          width: thisWidth('6-1'),
          children: [
            {
              title: '数量',
              dataIndex: 'fjs',
              isShow: thisIsShow('6-1-1'),
              width: thisWidth('6-1-1'),
              slots: { customRender: thisAlign('6-1-1') },
              key: 'fjs',
              align: 'center'
            },
            {
              title: '金额',
              dataIndex: 'fjj',
              key: 'fjj',
              isShow: thisIsShow('6-1-2'),
              width: thisWidth('6-1-2'),
              slots: { customRender: thisAlign('6-1-2') },
              align: 'center'
            },
            {
              title: '本币',
              dataIndex: 'fjb',
              key: 'fjb',
              isShow: thisIsShow('6-1-3'),
              width: thisWidth('6-1-3'),
              slots: { customRender: thisAlign('6-1-3') },
              align: 'center'
            }
          ]
        },
        {
          title: '贷方',
          isShow: thisIsShow('6-2'),
          width: thisWidth('6-2'),
          children: [
            {
              title: '数量',
              isShow: thisIsShow('6-2-1'),
              width: thisWidth('6-2-1'),
              slots: { customRender: thisAlign('6-2-1') },
              dataIndex: 'fds',
              key: 'fds',
              align: 'center'
            },
            {
              title: '金额',
              dataIndex: 'fdj',
              key: 'fdj',
              isShow: thisIsShow('6-2-2'),
              width: thisWidth('6-2-2'),
              slots: { customRender: thisAlign('6-2-2') },
              align: 'center'
            },
            {
              title: '本币',
              dataIndex: 'fdb',
              key: 'fdb',
              isShow: thisIsShow('6-2-3'),
              width: thisWidth('6-2-3'),
              slots: { customRender: thisAlign('6-2-3') },
              align: 'center'
            }
          ]
        }
      ],
    },
    {
      title: '本年累计',
      isShow: thisIsShow(7),
      width: thisWidth(7),
      children: [
        {
          title: '借方',
          isShow: thisIsShow('7-1'),
          width: thisWidth('7-1'),
          children: [
            {
              title: '数量',
              isShow: thisIsShow('7-1-1'),
              width: thisWidth('7-1-1'),
              slots: { customRender: thisAlign('7-1-1') },
              dataIndex: 'ljs',
              key: 'ljs',
              align: 'center'
            },
            {
              title: '金额',
              dataIndex: 'ljj',
              key: 'ljj',
              isShow: thisIsShow('7-1-2'),
              width: thisWidth('7-1-2'),
              slots: { customRender: thisAlign('7-1-2') },
              align: 'center'
            },
            {
              title: '本币',
              dataIndex: 'ljb',
              key: 'ljb',
              isShow: thisIsShow('7-1-3'),
              width: thisWidth('7-1-3'),
              slots: { customRender: thisAlign('7-1-3') },
              align: 'center'
            }
          ]
        },
        {
          title: '贷方',
          isShow: thisIsShow('7-2'),
          width: thisWidth('7-2'),
          children: [
            {
              title: '数量',
              isShow: thisIsShow('7-2-1'),
              width: thisWidth('7-2-1'),
              slots: { customRender: thisAlign('7-2-1') },
              dataIndex: 'lds',
              key: 'lds',
              align: 'center'
            },
            {
              title: '金额',
              dataIndex: 'ldj',
              key: 'ldj',
              isShow: thisIsShow('7-2-2'),
              width: thisWidth('7-2-2'),
              slots: { customRender: thisAlign('7-2-2') },
              align: 'center'
            },
            {
              title: '本币',
              dataIndex: 'ldb',
              key: 'ldb',
              isShow: thisIsShow('7-2-3'),
              width: thisWidth('7-2-3'),
              slots: { customRender: thisAlign('7-2-3') },
              align: 'center'
            }
          ]
        }
      ],
    },
    {
      title: '期末余额',
      isShow: thisIsShow(8),
      width: thisWidth(8),
      children: [
        {
          title: '借方',
          isShow: thisIsShow('8-1'),
          width: thisWidth('8-1'),
          children: [
            {
              title: '数量',
              isShow: thisIsShow('8-1-1'),
              width: thisWidth('8-1-1'),
              slots: { customRender: thisAlign('8-1-1') },
              dataIndex: 'mjs',
              key: 'mjs',
              align: 'center'
            },
            {
              title: '金额',
              isShow: thisIsShow('8-1-2'),
              width: thisWidth('8-1-2'),
              slots: { customRender: thisAlign('8-1-2') },
              dataIndex: 'mjj',
              key: 'mjj',
              align: 'center'
            },
            {
              title: '本币',
              isShow: thisIsShow('8-1-3'),
              width: thisWidth('8-1-3'),
              slots: { customRender: thisAlign('8-1-3') },
              dataIndex: 'mjb',
              key: 'mjb',
              align: 'center'
            }
          ]
        },
        {
          title: '贷方',
          isShow: thisIsShow('8-2'),
          width: thisWidth('8-2'),
          children: [
            {
              title: '数量',
              isShow: thisIsShow('8-2-1'),
              width: thisWidth('8-2-1'),
              slots: { customRender: thisAlign('8-2-1') },
              dataIndex: 'mds',
              key: 'mds',
              align: 'center'
            },
            {
              title: '金额',
              isShow: thisIsShow('8-2-2'),
              width: thisWidth('8-2-2'),
              slots: { customRender: thisAlign('8-2-2') },
              dataIndex: 'mdj',
              key: 'mdj',
              align: 'center'
            },
            {
              title: '本币',
              isShow: thisIsShow('8-2-3'),
              width: thisWidth('8-2-3'),
              slots: { customRender: thisAlign('8-2-3') },
              dataIndex: 'mdb',
              key: 'mdb',
              align: 'center'
            }
          ]
        }
      ],
    }
  ],
}
