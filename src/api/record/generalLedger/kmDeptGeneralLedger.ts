import {defineStore} from 'pinia';
import {store} from '/@/store';
import {message} from "ant-design-vue";
import {reactive} from "vue";

export const useDeptGlStore = defineStore({
  id: 'useDeptGlStore',
  state: (): any => ({
    J:[
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
        align: 'center',
      },
      {
        title: '编码',
        dataIndex: 'ccode',
        key: 'ccode',
      },
      {
        title: '名称',
        dataIndex: 'cname',
        key: 'cname',
      },
      {
        title: '期初',
        dataIndex: 'qc',
        children: [
          {
            title: '借方本币',
            dataIndex: 'qcJfMoney',
            key: '3-1',
            align: 'right',
            slots: { customRender: 'qcJfMoney' },
          },
          {
            title: '贷方本币',
            dataIndex: 'qcDfmoney',
            key: '3-2',
            align: 'right',
            slots: { customRender: 'qcDfmoney' },
          },
        ],
      },
      {
        title: '借方',
        dataIndex: 'jf',
        children: [
          {
            title: '借方本币',
            dataIndex: 'jfMoney',
            key: '4-1',
            align: 'right',
            slots: { customRender: 'jfMoney' },
          }
        ],
      },
      {
        title: '贷方',
        dataIndex: 'df',
        children: [
          {
            title: '贷方本币',
            dataIndex: 'dfmoney',
            key: '5-1',
            align: 'right',
            slots: { customRender: 'dfmoney' },
          },
        ],
      },
      {
        title: '累计借方',
        dataIndex: 'ljjf',
        children: [
          {
            title: '借方本币',
            dataIndex: 'ljJfMoney',
            key: '6-1',
            align: 'right',
            slots: { customRender: 'ljJfMoney' },
          }
        ],
      },
      {
        title: '累计贷方',
        dataIndex: 'ljdf',
        children: [
          {
            title: '贷方本币',
            dataIndex: 'ljDfmoney',
            key: '7-1',
            align: 'right',
            slots: { customRender: 'ljDfmoney' },
          },
        ],
      },
      {
        title: '期末',
        dataIndex: 'qm',
        children: [
          {
            title: '借方本币',
            dataIndex: 'qmJfMoney',
            key: '8-1',
            align: 'right',
            slots: { customRender: 'qmJfMoney' },
          },
          {
            title: '贷方本币',
            dataIndex: 'qmDfmoney',
            key: '8-2',
            align: 'right',
            slots: { customRender: 'qmDfmoney' },
          }
        ]
      }
    ],
    SJ: [
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
        fixed: 'left',
        align: 'center',
      },
      {
        title: '编码',
        dataIndex: 'ccode',
        key: 'ccode',
        fixed: 'left',
      },
      {
        title: '名称',
        dataIndex: 'cname',
        key: 'cname',
        fixed: 'left',
      },
      {
        title: '计量单位',
        dataIndex: 'dw',
        key: 'dw',
        fixed: 'left',
        align: 'center',
      },
      {
        title: '期初',
        dataIndex: 'qc',
        children: [
          {
            title: '借方数量',
            dataIndex: 'qcJfnum',
            key: '4-1',
            align: 'center',
            slots: { customRender: 'qcJfnum' },
          },
          {
            title: '借方本币',
            dataIndex: 'qcJfMoney',
            key: '4-2',
            align: 'right',
            slots: { customRender: 'qcJfMoney' },
          },
          {
            title: '贷方数量',
            dataIndex: 'qcDfnum',
            key: '4-3',
            align: 'center',
            slots: { customRender: 'qcDfnum' },
          },
          {
            title: '贷方本币',
            dataIndex: 'qcDfmoney',
            key: '4-4',
            align: 'right',
            slots: { customRender: 'qcDfmoney' },
          },
        ],
      },
      {
        title: '借方',
        dataIndex: 'jf',
        children: [
          {
            title: '借方数量',
            dataIndex: 'jfnum',
            key: '5-1',
            align: 'center',
            slots: { customRender: 'jfnum' },
          },
          {
            title: '借方本币',
            dataIndex: 'jfMoney',
            key: '5-2',
            align: 'right',
            slots: { customRender: 'jfMoney' },
          },
        ],
      },
      {
        title: '贷方',
        dataIndex: 'df',
        children: [
          {
            title: '贷方数量',
            dataIndex: 'dfnum',
            key: '6-1',
            align: 'center',
            slots: { customRender: 'dfnum' },
          },
          {
            title: '贷方本币',
            dataIndex: 'dfmoney',
            key: '6-2',
            align: 'right',
            slots: { customRender: 'dfmoney' },
          },
        ],
      },
      {
        title: '累计借方',
        dataIndex: 'ljjf',
        children: [
          {
            title: '借方数量',
            dataIndex: 'ljJfnum',
            key: '7-1',
            align: 'center',
            slots: { customRender: 'ljJfnum' },
          },
          {
            title: '借方本币',
            dataIndex: 'ljJfMoney',
            key: '7-2',
            align: 'right',
            slots: { customRender: 'ljJfMoney' },
          },
        ],
      },
      {
        title: '累计贷方',
        dataIndex: 'ljdf',
        children: [
          {
            title: '贷方数量',
            dataIndex: 'ljDfnum',
            key: '8-1',
            align: 'center',
            slots: { customRender: 'ljDfnum' },
          },
          {
            title: '贷方本币',
            dataIndex: 'ljDfmoney',
            key: '8-2',
            align: 'right',
            slots: { customRender: 'ljDfmoney' },
          },
        ],
      },
      {
        title: '期末',
        dataIndex: 'qm',
        children: [
          {
            title: '借方数量',
            dataIndex: 'qmJfnum',
            key: '9-1',
            align: 'center',
            slots: { customRender: 'qmJfnum' },
          },
          {
            title: '借方本币',
            dataIndex: 'qmJfMoney',
            key: '9-2',
            align: 'right',
            slots: { customRender: 'qmJfMoney' },
          },
          {
            title: '贷方数量',
            dataIndex: 'qmDfnum',
            key: '9-3',
            align: 'center',
            slots: { customRender: 'qmDfnum' },
          },
          {
            title: '贷方本币',
            dataIndex: 'qmDfmoney',
            key: '9-4',
            align: 'right',
            slots: { customRender: 'qmDfmoney' },
          }
        ]
      }
    ],
    WJ: [
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
        fixed: 'left',
        align: 'center',
      },
      {
        title: '编码',
        dataIndex: 'ccode',
        key: 'ccode',
        fixed: 'left',
      },
      {
        title: '名称',
        dataIndex: 'cname',
        key: 'cname',
        fixed: 'left',
      },
      {
        title: '原币名称',
        dataIndex: 'wb',
        key: 'wb',
        fixed: 'left',
        align: 'center',
      },
      {
        title: '期初',
        dataIndex: 'qc',
        key: 'qc',
        children: [
          {
            title: '借方原币',
            dataIndex: 'qcJfwb',
            key: '4-1',
            align: 'right',
            slots: { customRender: 'qcJfwb' },
          },
          {
            title: '借方本币',
            dataIndex: 'qcJfMoney',
            key: '4-2',
            align: 'right',
            slots: { customRender: 'qcJfMoney' },
          },
          {
            title: '贷方原币',
            dataIndex: 'qcDfwb',
            key: '4-3',
            align: 'right',
            slots: { customRender: 'qcDfwb' },
          },
          {
            title: '贷方本币',
            dataIndex: 'qcDfmoney',
            key: '4-4',
            align: 'right',
            slots: { customRender: 'qcDfmoney' },
          },
        ],
      },
      {
        title: '借方',
        dataIndex: 'jf',
        key: 'jf',
        children: [
          {
            title: '借方原币',
            dataIndex: 'jfwb',
            key: '5-1',
            align: 'right',
            slots: { customRender: 'jfwb' },
          },
          {
            title: '借方本币',
            dataIndex: 'jfMoney',
            key: '5-2',
            align: 'right',
            slots: { customRender: 'jfMoney' },
          },
        ],
      },
      {
        title: '贷方',
        dataIndex: 'df',
        key: 'df',
        children: [
          {
            title: '贷方原币',
            dataIndex: 'dfwb',
            key: '6-1',
            align: 'right',
            slots: { customRender: 'dfwb' },
          },
          {
            title: '贷方本币',
            dataIndex: 'dfmoney',
            key: '6-2',
            align: 'right',
            slots: { customRender: 'dfmoney' },
          },
        ],
      },
      {
        title: '累计借方',
        dataIndex: 'ljjf',
        key: 'ljjf',
        children: [
          {
            title: '借方原币',
            dataIndex: 'ljJfwb',
            key: '7-1',
            align: 'right',
            slots: { customRender: 'ljJfwb' },
          },
          {
            title: '借方本币',
            dataIndex: 'ljJfMoney',
            key: '7-2',
            align: 'right',
            slots: { customRender: 'ljJfMoney' },
          },
        ],
      },
      {
        title: '累计贷方',
        dataIndex: 'ljdf',
        key: 'ljdf',
        children: [
          {
            title: '贷方原币',
            dataIndex: 'ljDfwb',
            key: '8-1',
            align: 'right',
            slots: { customRender: 'ljDfwb' },
          },
          {
            title: '贷方本币',
            dataIndex: 'ljDfmoney',
            key: '8-2',
            align: 'right',
            slots: { customRender: 'ljDfmoney' },
          },
        ],
      },
      {
        title: '期末',
        dataIndex: 'qm',
        key: 'qm',
        children: [
          {
            title: '借方原币',
            dataIndex: 'qmJfwb',
            key: '9-1',
            align: 'right',
            slots: { customRender: 'qmJfwb' },
          },
          {
            title: '借方本币',
            dataIndex: 'qmJfMoney',
            key: '9-2',
            align: 'right',
            slots: { customRender: 'qmJfMoney' },
          },
          {
            title: '贷方原币',
            dataIndex: 'qmDfwb',
            key: '9-3',
            align: 'right',
            slots: { customRender: 'qmDfwb' },
          },
          {
            title: '贷方本币',
            dataIndex: 'qmDfmoney',
            key: '9-4',
            align: 'right',
            slots: { customRender: 'qmDfmoney' },
          }
        ]
      }
    ],
    SWJ: [
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
        fixed: 'left',
        align: 'center',
      },
      {
        title: '编码',
        dataIndex: 'ccode',
        key: 'ccode',
        fixed: 'left',
      },
      {
        title: '名称',
        dataIndex: 'cname',
        key: 'cname',
        fixed: 'left',
      },
      {
        title: '计量单位',
        dataIndex: 'dw',
        key: 'dw',
        fixed: 'left',
        align: 'center',
      },
      {
        title: '原币名称',
        dataIndex: 'wb',
        key: 'wb',
        fixed: 'left',
        align: 'center',
      },
      {
        title: '期初',
        dataIndex: 'qc',
        key: 'qc',
        children: [
          {
            title: '借方数量',
            dataIndex: 'qcJfnum',
            key: '5-1',
            align: 'right',
            slots: { customRender: 'qcJfnum' },
          },
          {
            title: '借方原币',
            dataIndex: 'qcJfwb',
            key: '5-2',
            align: 'right',
            slots: { customRender: 'qcJfwb' },
          },
          {
            title: '借方本币',
            dataIndex: 'qcJfMoney',
            key: '5-3',
            align: 'right',
            slots: { customRender: 'qcJfMoney' },
          },
          {
            title: '贷方数量',
            dataIndex: 'qcDfnum',
            key: '5-4',
            align: 'right',
            slots: { customRender: 'qcDfnum' },
          },
          {
            title: '贷方原币',
            dataIndex: 'qcDfwb',
            key: '5-5',
            align: 'right',
            slots: { customRender: 'qcDfwb' },
          },
          {
            title: '贷方本币',
            dataIndex: 'qcDfmoney',
            key: '5-6',
            align: 'right',
            slots: { customRender: 'qcDfmoney' },
          },
        ],
      },
      {
        title: '借方',
        dataIndex: 'jf',
        key: 'jf',
        children: [
          {
            title: '借方数量',
            dataIndex: 'jfnum',
            key: '6-1',
            align: 'right',
            slots: { customRender: 'jfnum' },
          },
          {
            title: '借方原币',
            dataIndex: 'jfwb',
            key: '6-2',
            align: 'right',
            slots: { customRender: 'jfwb' },
          },
          {
            title: '借方本币',
            dataIndex: 'jfMoney',
            key: '6-3',
            align: 'right',
            slots: { customRender: 'jfMoney' },
          },
        ],
      },
      {
        title: '贷方',
        dataIndex: 'df',
        key: 'df',
        children: [
          {
            title: '贷方数量',
            dataIndex: 'dfnum',
            key: '7-1',
            align: 'right',
            slots: { customRender: 'dfnum' },
          },
          {
            title: '贷方原币',
            dataIndex: 'dfwb',
            key: '7-2',
            align: 'right',
            slots: { customRender: 'dfwb' },
          },
          {
            title: '贷方本币',
            dataIndex: 'dfmoney',
            key: '7-3',
            align: 'right',
            slots: { customRender: 'dfmoney' },
          },
        ],
      },
      {
        title: '累计借方',
        dataIndex: 'ljjf',
        key: 'ljjf',
        children: [
          {
            title: '借方数量',
            dataIndex: 'ljJfnum',
            key: '8-1',
            align: 'right',
            slots: { customRender: 'ljJfnum' },
          },
          {
            title: '借方原币',
            dataIndex: 'ljJfwb',
            key: '8-2',
            align: 'right',
            slots: { customRender: 'ljJfwb' },
          },
          {
            title: '借方本币',
            dataIndex: 'ljJfMoney',
            key: '8-3',
            align: 'right',
            slots: { customRender: 'ljJfMoney' },
          },
        ],
      },
      {
        title: '累计贷方',
        dataIndex: 'ljdf',
        key: 'ljdf',
        children: [
          {
            title: '贷方数量',
            dataIndex: 'ljDfnum',
            key: '9-1',
            align: 'right',
            slots: { customRender: 'ljDfnum' },
          },
          {
            title: '贷方原币',
            dataIndex: 'ljDfwb',
            key: '9-2',
            align: 'right',
            slots: { customRender: 'ljDfwb' },
          },
          {
            title: '贷方本币',
            dataIndex: 'ljDfmoney',
            key: '9-3',
            align: 'right',
            slots: { customRender: 'ljDfmoney' },
          },
        ],
      },
      {
        title: '期末',
        dataIndex: 'qm',
        key: 'qm',
        children: [
          {
            title: '借方数量',
            dataIndex: 'qmJfnum',
            key: '10-1',
            align: 'right',
            slots: { customRender: 'qmJfnum' },
          },
          {
            title: '借方原币',
            dataIndex: 'qmJfwb',
            key: '10-2',
            align: 'right',
            slots: { customRender: 'qmJfwb' },
          },
          {
            title: '借方本币',
            dataIndex: 'qmJfMoney',
            key: '10-3',
            align: 'right',
            slots: { customRender: 'qmJfMoney' },
          },
          {
            title: '贷方数量',
            dataIndex: 'qmDfnum',
            key: '10-4',
            align: 'right',
            slots: { customRender: 'qmDfnum' },
          },
          {
            title: '贷方原币',
            dataIndex: 'qmDfwb',
            key: '10-5',
            align: 'right',
            slots: { customRender: 'qmDfwb' },
          },
          {
            title: '贷方本币',
            dataIndex: 'qmDfmoney',
            key: '10-6',
            align: 'right',
            slots: { customRender: 'qmDfmoney' },
          }
        ]
      }
    ],
  }),
  getters: {
    getColumns: (state) => (value) => {
      if(value == 'J'){
        return state.J
      }else  if(value == 'SJ'){
        return state.SJ
      }else  if(value == 'WJ'){
        return state.WJ
      }else{
        return state.SWJ
      }
      return state.J
    },
  },
  actions: {

  }
});

// Need to be used outside the setup
export function useGlStoreWidthOut() {
  return useDeptGlStore(store);
}

