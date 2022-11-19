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

  T1:[
    {
      key: '0',
      name: '期间',
      nameNew: '期间',
      check: true,
      width: 120,
      max: 120,
      min: 80,
      align: 'center'
    },
    {
      key: '1',
      name: '摘要',
      nameNew: '摘要',
      check: true,
      width: 180,
      max: 180,
      min: 100,
      align: 'left'
    },
    {
      key: '2',
      name: '原值',
      nameNew: '原值',
      check: true,
      width: 350,
      max: 350,
      min: 280,
      align: 'center',
      children: [
        {
          key: '2-1',
          name: '借方',
          nameNew: '借方',
          width: 125,
          max: 175,
          min: 100,
          check: true,
          align: 'center',
        },
        {
          key: '2-2',
          name: '贷方',
          nameNew: '贷方',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        },
        {
          key: '2-3',
          name: '余额',
          nameNew: '余额',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        }
      ],
    },
    {
      key: '3',
      name: '累计折旧',
      nameNew: '累计折旧',
      check: true,
      width: 350,
      max: 350,
      min: 280,
      align: 'center',
      children: [
        {
          key: '3-1',
          name: '借方',
          nameNew: '借方',
          width: 125,
          max: 175,
          min: 100,
          check: true,
          align: 'center',
        },
        {
          key: '3-2',
          name: '贷方',
          nameNew: '贷方',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        },
        {
          key: '3-3',
          name: '余额',
          nameNew: '余额',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        }
      ],
    },
/*    {
      key: '4',
      name: '减值准备',
      nameNew: '减值准备',
      check: true,
      width: 350,
      max: 350,
      min: 280,
      align: 'center',
      children: [
        {
          key: '4-1',
          name: '借方',
          nameNew: '借方',
          width: 125,
          max: 175,
          min: 100,
          check: true,
          align: 'center',
        },
        {
          key: '4-2',
          name: '贷方',
          nameNew: '贷方',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        },
        {
          key: '4-3',
          name: '余额',
          nameNew: '余额',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        }
      ],
    },*/
    {
      key: '4',
      name: '净值',
      nameNew: '净值',
      check: true,
      width: 220,
      max: 220,
      min: 160,
      align: 'center',
      children: [
        {
          key: '4-1',
          name: '余额',
          nameNew: '余额',
          width: 220,
          max: 220,
          min: 160,
          check: true,
          align: 'right',
        }]
    }
  ],
  T2:[
    {
      key: '0',
      name: '序号',
      nameNew: '序号',
      check: true,
      width: 120,
      max: 120,
      min: 80,
      align: 'center'
    },
    {
      key: '1',
      name: '期间',
      nameNew: '期间',
      check: true,
      width: 150,
      max: 180,
      min: 80,
      align: 'center'
    },
    {
      key: '2',
      name: '项目',
      nameNew: '项目',
      check: true,
      width: 180,
      max: 180,
      min: 100,
      align: 'center'
    },
    {
      key: '3',
      name: '原值',
      nameNew: '原值',
      check: true,
      width: 350,
      max: 350,
      min: 280,
      align: 'center',
      children: [
        {
          key: '3-1',
          name: '借方',
          nameNew: '借方',
          width: 125,
          max: 175,
          min: 100,
          check: true,
          align: 'center',
        },
        {
          key: '3-2',
          name: '贷方',
          nameNew: '贷方',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        },
        {
          key: '3-3',
          name: '余额',
          nameNew: '余额',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        }
      ],
    },
    {
      key: '4',
      name: '累计折旧',
      nameNew: '累计折旧',
      check: true,
      width: 350,
      max: 350,
      min: 280,
      align: 'center',
      children: [
        {
          key: '4-1',
          name: '借方',
          nameNew: '借方',
          width: 125,
          max: 175,
          min: 100,
          check: true,
          align: 'center',
        },
        {
          key: '4-2',
          name: '贷方',
          nameNew: '贷方',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        },
        {
          key: '4-3',
          name: '余额',
          nameNew: '余额',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        }
      ],
    },
    {
      key: '5',
      name: '减值准备',
      nameNew: '减值准备',
      check: true,
      width: 350,
      max: 350,
      min: 280,
      align: 'center',
      children: [
        {
          key: '5-1',
          name: '借方',
          nameNew: '借方',
          width: 125,
          max: 175,
          min: 100,
          check: true,
          align: 'center',
        },
        {
          key: '5-2',
          name: '贷方',
          nameNew: '贷方',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        },
        {
          key: '5-3',
          name: '余额',
          nameNew: '余额',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        }
      ],
    },
    {
      key: '6',
      name: '净值',
      nameNew: '净值',
      check: true,
      width: 220,
      max: 220,
      min: 160,
      align: 'center'
    }
  ],
  T3:[
    {
      key: '0',
      name: '序号',
      nameNew: '序号',
      check: true,
      width: 120,
      max: 120,
      min: 80,
      align: 'center'
    },
    {
      key: '1',
      name: '期间',
      nameNew: '期间',
      check: true,
      width: 150,
      max: 180,
      min: 80,
      align: 'center'
    },
    {
      key: '2',
      name: '部门',
      nameNew: '部门',
      check: true,
      width: 180,
      max: 180,
      min: 100,
      align: 'center'
    },
    {
      key: '3',
      name: '原值',
      nameNew: '原值',
      check: true,
      width: 350,
      max: 350,
      min: 280,
      align: 'center',
      children: [
        {
          key: '3-1',
          name: '借方',
          nameNew: '借方',
          width: 125,
          max: 175,
          min: 100,
          check: true,
          align: 'center',
        },
        {
          key: '3-2',
          name: '贷方',
          nameNew: '贷方',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        },
        {
          key: '3-3',
          name: '余额',
          nameNew: '余额',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        }
      ],
    },
    {
      key: '4',
      name: '累计折旧',
      nameNew: '累计折旧',
      check: true,
      width: 350,
      max: 350,
      min: 280,
      align: 'center',
      children: [
        {
          key: '4-1',
          name: '借方',
          nameNew: '借方',
          width: 125,
          max: 175,
          min: 100,
          check: true,
          align: 'center',
        },
        {
          key: '4-2',
          name: '贷方',
          nameNew: '贷方',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        },
        {
          key: '4-3',
          name: '余额',
          nameNew: '余额',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        }
      ],
    },
    {
      key: '5',
      name: '减值准备',
      nameNew: '减值准备',
      check: true,
      width: 350,
      max: 350,
      min: 280,
      align: 'center',
      children: [
        {
          key: '5-1',
          name: '借方',
          nameNew: '借方',
          width: 125,
          max: 175,
          min: 100,
          check: true,
          align: 'center',
        },
        {
          key: '5-2',
          name: '贷方',
          nameNew: '贷方',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        },
        {
          key: '5-3',
          name: '余额',
          nameNew: '余额',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        }
      ],
    },
    {
      key: '6',
      name: '净值',
      nameNew: '净值',
      check: true,
      width: 220,
      max: 220,
      min: 160,
      align: 'center'
    }
  ],

  T4:[
    {
      key: '0',
      name: '序号',
      nameNew: '序号',
      check: true,
      width: 120,
      max: 120,
      min: 80,
      align: 'center'
    },
    {
      key: '1',
      name: '日期',
      nameNew: '日期',
      check: true,
      width: 150,
      max: 180,
      min: 80,
      align: 'center'
    },
    {
      key: '2',
      name: '资产类别',
      nameNew: '资产类别',
      check: true,
      width: 180,
      max: 180,
      min: 100,
      align: 'center'
    },
    {
      key: '3',
      name: '项目',
      nameNew: '项目',
      check: true,
      width: 180,
      max: 180,
      min: 100,
      align: 'center'
    },
    {
      key: '4',
      name: '原值',
      nameNew: '原值',
      check: true,
      width: 350,
      max: 350,
      min: 280,
      align: 'center',
      children: [
        {
          key: '4-1',
          name: '借方',
          nameNew: '借方',
          width: 125,
          max: 175,
          min: 100,
          check: true,
          align: 'center',
        },
        {
          key: '4-2',
          name: '贷方',
          nameNew: '贷方',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        },
        {
          key: '4-3',
          name: '余额',
          nameNew: '余额',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        }
      ],
    },
    {
      key: '5',
      name: '累计折旧',
      nameNew: '累计折旧',
      check: true,
      width: 350,
      max: 350,
      min: 280,
      align: 'center',
      children: [
        {
          key: '5-1',
          name: '借方',
          nameNew: '借方',
          width: 125,
          max: 175,
          min: 100,
          check: true,
          align: 'center',
        },
        {
          key: '5-2',
          name: '贷方',
          nameNew: '贷方',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        },
        {
          key: '5-3',
          name: '余额',
          nameNew: '余额',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        }
      ],
    },
    {
      key: '6',
      name: '减值准备',
      nameNew: '减值准备',
      check: true,
      width: 350,
      max: 350,
      min: 280,
      align: 'center',
      children: [
        {
          key: '6-1',
          name: '借方',
          nameNew: '借方',
          width: 125,
          max: 175,
          min: 100,
          check: true,
          align: 'center',
        },
        {
          key: '6-2',
          name: '贷方',
          nameNew: '贷方',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        },
        {
          key: '6-3',
          name: '余额',
          nameNew: '余额',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        }
      ],
    },
    {
      key: '7',
      name: '净值',
      nameNew: '净值',
      check: true,
      width: 220,
      max: 220,
      min: 160,
      align: 'center'
    }
  ],

  T5:[
    {
      key: '0',
      name: '序号',
      nameNew: '序号',
      check: true,
      width: 120,
      max: 120,
      min: 80,
      align: 'center'
    },
    {
      key: '1',
      name: '日期',
      nameNew: '日期',
      check: true,
      width: 150,
      max: 180,
      min: 80,
      align: 'center'
    },
    {
      key: '2',
      name: '资产类别',
      nameNew: '资产类别',
      check: true,
      width: 180,
      max: 180,
      min: 100,
      align: 'center'
    },
    {
      key: '3',
      name: '部门',
      nameNew: '部门',
      check: true,
      width: 180,
      max: 180,
      min: 100,
      align: 'center'
    },
    {
      key: '4',
      name: '原值',
      nameNew: '原值',
      check: true,
      width: 350,
      max: 350,
      min: 280,
      align: 'center',
      children: [
        {
          key: '4-1',
          name: '借方',
          nameNew: '借方',
          width: 125,
          max: 175,
          min: 100,
          check: true,
          align: 'center',
        },
        {
          key: '4-2',
          name: '贷方',
          nameNew: '贷方',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        },
        {
          key: '4-3',
          name: '余额',
          nameNew: '余额',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        }
      ],
    },
    {
      key: '5',
      name: '累计折旧',
      nameNew: '累计折旧',
      check: true,
      width: 350,
      max: 350,
      min: 280,
      align: 'center',
      children: [
        {
          key: '5-1',
          name: '借方',
          nameNew: '借方',
          width: 125,
          max: 175,
          min: 100,
          check: true,
          align: 'center',
        },
        {
          key: '5-2',
          name: '贷方',
          nameNew: '贷方',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        },
        {
          key: '5-3',
          name: '余额',
          nameNew: '余额',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        }
      ],
    },
    {
      key: '6',
      name: '减值准备',
      nameNew: '减值准备',
      check: true,
      width: 350,
      max: 350,
      min: 280,
      align: 'center',
      children: [
        {
          key: '6-1',
          name: '借方',
          nameNew: '借方',
          width: 125,
          max: 175,
          min: 100,
          check: true,
          align: 'center',
        },
        {
          key: '6-2',
          name: '贷方',
          nameNew: '贷方',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        },
        {
          key: '6-3',
          name: '余额',
          nameNew: '余额',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        }
      ],
    },
    {
      key: '7',
      name: '净值',
      nameNew: '净值',
      check: true,
      width: 220,
      max: 220,
      min: 160,
      align: 'center'
    }
  ],

  T6:[
    {
      key: '0',
      name: '序号',
      nameNew: '序号',
      check: true,
      width: 120,
      max: 120,
      min: 80,
      align: 'center'
    },
    {
      key: '1',
      name: '日期',
      nameNew: '日期',
      check: true,
      width: 150,
      max: 180,
      min: 80,
      align: 'center'
    },
    {
      key: '2',
      name: '项目',
      nameNew: '项目',
      check: true,
      width: 180,
      max: 180,
      min: 100,
      align: 'center'
    },
    {
      key: '3',
      name: '资产类别',
      nameNew: '资产类别',
      check: true,
      width: 180,
      max: 180,
      min: 100,
      align: 'center'
    },
    {
      key: '4',
      name: '原值',
      nameNew: '原值',
      check: true,
      width: 350,
      max: 350,
      min: 280,
      align: 'center',
      children: [
        {
          key: '4-1',
          name: '借方',
          nameNew: '借方',
          width: 125,
          max: 175,
          min: 100,
          check: true,
          align: 'center',
        },
        {
          key: '4-2',
          name: '贷方',
          nameNew: '贷方',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        },
        {
          key: '4-3',
          name: '余额',
          nameNew: '余额',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        }
      ],
    },
    {
      key: '5',
      name: '累计折旧',
      nameNew: '累计折旧',
      check: true,
      width: 350,
      max: 350,
      min: 280,
      align: 'center',
      children: [
        {
          key: '5-1',
          name: '借方',
          nameNew: '借方',
          width: 125,
          max: 175,
          min: 100,
          check: true,
          align: 'center',
        },
        {
          key: '5-2',
          name: '贷方',
          nameNew: '贷方',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        },
        {
          key: '5-3',
          name: '余额',
          nameNew: '余额',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        }
      ],
    },
    {
      key: '6',
      name: '减值准备',
      nameNew: '减值准备',
      check: true,
      width: 350,
      max: 350,
      min: 280,
      align: 'center',
      children: [
        {
          key: '6-1',
          name: '借方',
          nameNew: '借方',
          width: 125,
          max: 175,
          min: 100,
          check: true,
          align: 'center',
        },
        {
          key: '6-2',
          name: '贷方',
          nameNew: '贷方',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        },
        {
          key: '6-3',
          name: '余额',
          nameNew: '余额',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        }
      ],
    },
    {
      key: '7',
      name: '净值',
      nameNew: '净值',
      check: true,
      width: 220,
      max: 220,
      min: 160,
      align: 'center'
    }
  ],

  T7:[
    {
      key: '0',
      name: '序号',
      nameNew: '序号',
      check: true,
      width: 120,
      max: 120,
      min: 80,
      align: 'center'
    },
    {
      key: '1',
      name: '日期',
      nameNew: '日期',
      check: true,
      width: 150,
      max: 180,
      min: 80,
      align: 'center'
    },
    {
      key: '2',
      name: '部门',
      nameNew: '部门',
      check: true,
      width: 180,
      max: 180,
      min: 100,
      align: 'center'
    },
    {
      key: '3',
      name: '资产类别',
      nameNew: '资产类别',
      check: true,
      width: 180,
      max: 180,
      min: 100,
      align: 'center'
    },
    {
      key: '4',
      name: '原值',
      nameNew: '原值',
      check: true,
      width: 350,
      max: 350,
      min: 280,
      align: 'center',
      children: [
        {
          key: '4-1',
          name: '借方',
          nameNew: '借方',
          width: 125,
          max: 175,
          min: 100,
          check: true,
          align: 'center',
        },
        {
          key: '4-2',
          name: '贷方',
          nameNew: '贷方',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        },
        {
          key: '4-3',
          name: '余额',
          nameNew: '余额',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        }
      ],
    },
    {
      key: '5',
      name: '累计折旧',
      nameNew: '累计折旧',
      check: true,
      width: 350,
      max: 350,
      min: 280,
      align: 'center',
      children: [
        {
          key: '5-1',
          name: '借方',
          nameNew: '借方',
          width: 125,
          max: 175,
          min: 100,
          check: true,
          align: 'center',
        },
        {
          key: '5-2',
          name: '贷方',
          nameNew: '贷方',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        },
        {
          key: '5-3',
          name: '余额',
          nameNew: '余额',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        }
      ],
    },
    {
      key: '6',
      name: '减值准备',
      nameNew: '减值准备',
      check: true,
      width: 350,
      max: 350,
      min: 280,
      align: 'center',
      children: [
        {
          key: '6-1',
          name: '借方',
          nameNew: '借方',
          width: 125,
          max: 175,
          min: 100,
          check: true,
          align: 'center',
        },
        {
          key: '6-2',
          name: '贷方',
          nameNew: '贷方',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        },
        {
          key: '6-3',
          name: '余额',
          nameNew: '余额',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        }
      ],
    },
    {
      key: '7',
      name: '净值',
      nameNew: '净值',
      check: true,
      width: 220,
      max: 220,
      min: 160,
      align: 'center'
    }
  ],

  T8:[
    {
      key: '0',
      name: '序号',
      nameNew: '序号',
      check: true,
      width: 120,
      max: 120,
      min: 80,
      align: 'center'
    },
    {
      key: '1',
      name: '日期',
      nameNew: '日期',
      check: true,
      width: 150,
      max: 180,
      min: 80,
      align: 'center'
    },
    {
      key: '2',
      name: '项目',
      nameNew: '项目',
      check: true,
      width: 180,
      max: 180,
      min: 100,
      align: 'center'
    },
    {
      key: '3',
      name: '部门',
      nameNew: '部门',
      check: true,
      width: 180,
      max: 180,
      min: 100,
      align: 'center'
    },
    {
      key: '4',
      name: '原值',
      nameNew: '原值',
      check: true,
      width: 350,
      max: 350,
      min: 280,
      align: 'center',
      children: [
        {
          key: '4-1',
          name: '借方',
          nameNew: '借方',
          width: 125,
          max: 175,
          min: 100,
          check: true,
          align: 'center',
        },
        {
          key: '4-2',
          name: '贷方',
          nameNew: '贷方',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        },
        {
          key: '4-3',
          name: '余额',
          nameNew: '余额',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        }
      ],
    },
    {
      key: '5',
      name: '累计折旧',
      nameNew: '累计折旧',
      check: true,
      width: 350,
      max: 350,
      min: 280,
      align: 'center',
      children: [
        {
          key: '5-1',
          name: '借方',
          nameNew: '借方',
          width: 125,
          max: 175,
          min: 100,
          check: true,
          align: 'center',
        },
        {
          key: '5-2',
          name: '贷方',
          nameNew: '贷方',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        },
        {
          key: '5-3',
          name: '余额',
          nameNew: '余额',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        }
      ],
    },
    {
      key: '6',
      name: '减值准备',
      nameNew: '减值准备',
      check: true,
      width: 350,
      max: 350,
      min: 280,
      align: 'center',
      children: [
        {
          key: '6-1',
          name: '借方',
          nameNew: '借方',
          width: 125,
          max: 175,
          min: 100,
          check: true,
          align: 'center',
        },
        {
          key: '6-2',
          name: '贷方',
          nameNew: '贷方',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        },
        {
          key: '6-3',
          name: '余额',
          nameNew: '余额',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        }
      ],
    },
    {
      key: '7',
      name: '净值',
      nameNew: '净值',
      check: true,
      width: 220,
      max: 220,
      min: 160,
      align: 'center'
    }
  ],

  T9:[
    {
      key: '0',
      name: '序号',
      nameNew: '序号',
      check: true,
      width: 120,
      max: 120,
      min: 80,
      align: 'center'
    },
    {
      key: '1',
      name: '日期',
      nameNew: '日期',
      check: true,
      width: 150,
      max: 180,
      min: 80,
      align: 'center'
    },
    {
      key: '2',
      name: '部门',
      nameNew: '部门',
      check: true,
      width: 180,
      max: 180,
      min: 100,
      align: 'center'
    },
    {
      key: '3',
      name: '项目',
      nameNew: '项目',
      check: true,
      width: 180,
      max: 180,
      min: 100,
      align: 'center'
    },
    {
      key: '4',
      name: '原值',
      nameNew: '原值',
      check: true,
      width: 350,
      max: 350,
      min: 280,
      align: 'center',
      children: [
        {
          key: '4-1',
          name: '借方',
          nameNew: '借方',
          width: 125,
          max: 175,
          min: 100,
          check: true,
          align: 'center',
        },
        {
          key: '4-2',
          name: '贷方',
          nameNew: '贷方',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        },
        {
          key: '4-3',
          name: '余额',
          nameNew: '余额',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        }
      ],
    },
    {
      key: '5',
      name: '累计折旧',
      nameNew: '累计折旧',
      check: true,
      width: 350,
      max: 350,
      min: 280,
      align: 'center',
      children: [
        {
          key: '5-1',
          name: '借方',
          nameNew: '借方',
          width: 125,
          max: 175,
          min: 100,
          check: true,
          align: 'center',
        },
        {
          key: '5-2',
          name: '贷方',
          nameNew: '贷方',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        },
        {
          key: '5-3',
          name: '余额',
          nameNew: '余额',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        }
      ],
    },
    {
      key: '6',
      name: '减值准备',
      nameNew: '减值准备',
      check: true,
      width: 350,
      max: 350,
      min: 280,
      align: 'center',
      children: [
        {
          key: '6-1',
          name: '借方',
          nameNew: '借方',
          width: 125,
          max: 175,
          min: 100,
          check: true,
          align: 'center',
        },
        {
          key: '6-2',
          name: '贷方',
          nameNew: '贷方',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        },
        {
          key: '6-3',
          name: '余额',
          nameNew: '余额',
          check: true,
          width: 125,
          max: 175,
          min: 100,
          align: 'right',
        }
      ],
    },
    {
      key: '7',
      name: '净值',
      nameNew: '净值',
      check: true,
      width: 220,
      max: 220,
      min: 160,
      align: 'center'
    }
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

export function changeDefaultDynamics(list,num) {
  // 改变默认数据
  dynamicColumnAndDataModel[num] = list
}

export function initDynamics() {
  return dynamicColumnAndDataModel
}

export function assemblyDynamicColumn(lanmuList:any,columnList:any){
  console.log(lanmuList)
  console.log(columnList)
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

