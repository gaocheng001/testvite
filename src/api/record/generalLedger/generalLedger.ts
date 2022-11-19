import {defineStore} from 'pinia';
import {store} from '/@/store';
import {message} from "ant-design-vue";
import {reactive} from "vue";

export const useGlStore = defineStore({
  id: 'useGlStore',
  state: (): any => ({
    J:[
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
        align: 'center',
        width: '80px',
      },
      {
        title: '期间',
        dataIndex: 'num',
        key: 'num',
        align: 'center',
        width: '100px',
      },
      {
        title: '摘要',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        width: '180px',
      },
      {
        title: '借方',
        dataIndex: 'sjmoney',
        key: 'sjmoney',
        align: 'right',
        width: '180px',
        slots: { customRender: 'sjmoney' },
      },
      {
        title: '贷方',
        dataIndex: 'sdmoney',
        key: 'sdmoney',
        align: 'right',
        width: '180px',
        slots: { customRender: 'sdmoney' },
      },
      {
        title: '方向',
        dataIndex: 'fx',
        key: 'fx',
        width: '80px',
        align: 'center',
      },
      {
        title: '余额',
        dataIndex: 'symoney',
        key: 'symoney',
        align: 'right',
        width: '180px',
        slots: { customRender: 'symoney' },
      }
    ],
    SJ: [
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
        fixed: '',
        align: 'center',
      },
      {
        title: '期间',
        dataIndex: 'num',
        key: 'num',
        align: 'center',
        fixed: '',
      },
      {
        title: '摘要',
        dataIndex: 'name',
        key: 'name',
        fixed: '',
        align: 'center',
      },
      {
        title: '计量单位',
        dataIndex: 'dw',
        key: 'dw',
        fixed: '',
        align: 'center',
      },
      {
        title: '借方',
        key: 'jf',
        dataIndex: 'jf',
        children: [
         {
            title: '数量',
            dataIndex: 'sjnum',
            key: '4-1',
            align: 'right',
            slots: { customRender: 'sjnum' },
          },
          {
            title: '本币金额',
            dataIndex: 'sjmoney',
            key: '4-2',
            align: 'right',
            slots: { customRender: 'sjmoney' },
          }
        ],
      },
      {
        title: '贷方',
        key: 'df',
        dataIndex: 'df',
        children: [
          {
            title: '数量',
            dataIndex: 'sdnum',
            key: '5-1',
            align: 'right',
            slots: { customRender: 'sdnum' },
          },
          {
            title: '本币金额',
            dataIndex: 'sdmoney',
            key: '5-2',
            align: 'right',
            slots: { customRender: 'sdmoney' },
          }
        ],
      },
      {
        title: '方向',
        dataIndex: 'fx',
        key: 'fx',
        align: 'center',
      },
      {
        title: '余额',
        dataIndex: 'ye',
        key: 'ye',
        children: [
          {
            title: '数量',
            dataIndex: 'synum',
            key: '7-1',
            align: 'right',
            slots: { customRender: 'synum' },
          },
          {
            title: '本币金额',
            dataIndex: 'symoney',
            key: '7-2',
            align: 'right',
            slots: { customRender: 'symoney' },
          }
        ],
      }
    ],
    WJ: [
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
        fixed: '',
        align: 'center',
      },
      {
        title: '期间',
        dataIndex: 'num',
        key: 'num',
        fixed: '',
      },
      {
        title: '摘要',
        dataIndex: 'name',
        key: 'name',
        fixed: '',
      },
      {
        title: '原币名称',
        dataIndex: 'wb',
        key: 'wb',
        fixed: '',
        align: 'center',
      },
      {
        title: '借方',
        dataIndex: 'jf',
        children: [
          {
            title: '原币金额',
            dataIndex: 'sjwb',
            key: '4-1',
            align: 'right',
            slots: { customRender: 'sjwb' },
          },
          {
            title: '本币金额',
            dataIndex: 'sjmoney',
            key: '4-2',
            align: 'right',
            slots: { customRender: 'sjmoney' },
          }
        ],
      },
      {
        title: '贷方',
        dataIndex: 'df',
        children: [
          {
            title: '原币金额',
            dataIndex: 'sdwb',
            key: '5-1',
            align: 'right',
            slots: { customRender: 'sdwb' },
          },
          {
            title: '本币金额',
            dataIndex: 'sdmoney',
            key: '5-2',
            align: 'right',
            slots: { customRender: 'sdmoney' },
          }
        ],
      },
      {
        title: '方向',
        dataIndex: 'fx',
        key: 'fx',
        align: 'center',
      },
      {
        title: '余额',
        dataIndex: 'ye',
        children: [
          {
            title: '原币金额',
            dataIndex: 'sywb',
            key: '7-1',
            align: 'right',
            slots: { customRender: 'sywb' },
          },
          {
            title: '本币金额',
            dataIndex: 'symoney',
            key: '7-2',
            align: 'right',
            slots: { customRender: 'symoney' },
          }
        ],
      }
    ],
    SWJ: [
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
        fixed: '',
        align: 'center',
      },
      {
        title: '期间',
        dataIndex: 'num',
        key: 'num',
        fixed: '',
      },
      {
        title: '摘要',
        dataIndex: 'name',
        key: 'name',
        fixed: '',
      },
      {
        title: '计量单位',
        dataIndex: 'dw',
        key: 'dw',
        fixed: '',
      },
      {
        title: '原币名称',
        dataIndex: 'wb',
        key: 'wb',
        fixed: '',
      },
      {
        title: '借方',
        dataIndex: 'jf',
        children: [
          {
            title: '数量',
            dataIndex: 'sjnum',
            key: '5-1',
            align: 'right',
            slots: { customRender: 'sjnum' },
          },
          {
            title: '原币金额',
            dataIndex: 'sjwb',
            key: '5-2',
            align: 'right',
            slots: { customRender: 'sjwb' },
          },
          {
            title: '本币金额',
            dataIndex: 'sjmoney',
            key: '5-3',
            align: 'right',
            slots: { customRender: 'sjmoney' },
          }
        ],
      },
      {
        title: '贷方',
        dataIndex: 'df',
        children: [
          {
            title: '数量',
            dataIndex: 'sdnum',
            key: '6-1',
            align: 'right',
            slots: { customRender: 'sdnum' },
          },
          {
            title: '原币金额',
            dataIndex: 'sdwb',
            key: '6-2',
            align: 'right',
            slots: { customRender: 'sdwb' },
          },
          {
            title: '本币金额',
            dataIndex: 'sdmoney',
            key: '6-3',
            align: 'right',
            slots: { customRender: 'sdmoney' },
          }
        ],
      },
      {
        title: '方向',
        dataIndex: 'fx',
        key: 'fx',
        align: 'center',
      },
      {
        title: '余额',
        dataIndex: 'ye',
        children: [
          {
            title: '数量',
            dataIndex: 'synum',
            key: '8-1',
            align: 'right',
            slots: { customRender: 'synum' },
          },
          {
            title: '原币金额',
            dataIndex: 'sywb',
            key: '8-2',
            align: 'right',
            slots: { customRender: 'sywb' },
          },
          {
            title: '本币金额',
            dataIndex: 'symoney',
            key: '8-3',
            align: 'right',
            slots: { customRender: 'symoney' },
          }
        ],
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
  return useGlStore(store);
}

