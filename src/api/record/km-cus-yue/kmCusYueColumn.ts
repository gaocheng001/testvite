import {defineStore} from 'pinia';
import {store} from '/@/store';

export const kmCusYueGlStore = defineStore({
  id: 'kmCusYueGlStore',
  state: (): any => ({
    J:[
      {
        title: '客户编码',
        dataIndex: 'ccode',
        key: 'ccode',
        align: 'center',fixed: 'left',
        slots: { customRender: 'ccode' },
      },
      {
        title: '客户名称',
        dataIndex: 'ccodeName',
        key: 'ccodeName',
        align: 'center',fixed: 'left',
        ellipsis: true,
        slots: { customRender: 'ccodeName' },
      },
      {
        title: '期初余额',
        dataIndex: 'qcMd',
        children: [
          {
            title: '本币借方',
            dataIndex: 'qcMd',
            key: '2-1',
            align: 'right',
            slots: { customRender: 'qcMd' },
          },
          {
            title: '本币贷方',
            dataIndex: 'qcMc',
            key: '2-2',
            align: 'right',
            slots: { customRender: 'qcMc' },
          }
        ],
      },
      {
        title: '本期发生',
        dataIndex: 'pzMd',
        children: [
          {
            title: '本币借方',
            dataIndex: 'pzMd',
            key: '3-1',
            align: 'right',
            slots: { customRender: 'pzMd' },
          },
          {
            title: '本币贷方',
            dataIndex: 'pzMc',
            key: '3-2',
            align: 'right',
            slots: { customRender: 'pzMc' },
          }
        ],
      },
      {
        title: '期末余额',
        dataIndex: 'qmMd',
        children: [
          {
            title: '本币借方',
            dataIndex: 'qmMd',
            key: '5-1',
            align: 'right',
            slots: { customRender: 'qmMd' },
          },
          {
            title: '本币贷方',
            dataIndex: 'qmMc',
            key: '5-2',
            align: 'right',
            slots: { customRender: 'qmMc' },
          }
        ],
      },
    ],
    SJ: [
      {
        title: '客户编码',
        dataIndex: 'ccode',
        key: 'ccode',
        align: 'left',fixed: 'left',
        slots: { customRender: 'ccode' },
      },
      {
        title: '客户名称',
        dataIndex: 'ccodeName',
        key: 'ccodeName',fixed: 'left',
        align: 'left',ellipsis: true,
        slots: { customRender: 'ccodeName' },
      },
      {
        title: '计量单位',
        dataIndex: 'unitMeasurement',
        key: 'unitMeasurement',
        align: 'center',fixed: 'left',
      },
      {
        title: '期初余额',
        dataIndex: 'qcMd',
        children: [
          {
            title: '数量',
            dataIndex: 'qcNum',
            key: '3-1',
            align: 'right',
            slots: { customRender: 'qcNum' },
          },
          {
            title: '本币借方',
            dataIndex: 'qcMd',
            key: '3-2',
            align: 'right',
            slots: { customRender: 'qcMd' },
          },
          {
            title: '本币贷方',
            dataIndex: 'qcMc',
            key: '3-3',
            align: 'right',
            slots: { customRender: 'qcMc' },
          }
        ],
      },
      {
        title: '本期发生',
        dataIndex: 'pzMd',
        children: [
          {
            title: '数量',
            dataIndex: 'pzNum',
            key: '4-1',
            align: 'right',
            slots: { customRender: 'pzNum' },
          },
          {
            title: '本币借方',
            dataIndex: 'pzMd',
            key: '4-2',
            align: 'right',
            slots: { customRender: 'pzMd' },
          },
          {
            title: '本币贷方',
            dataIndex: 'pzMc',
            key: '4-3',
            align: 'right',
            slots: { customRender: 'pzMc' },
          }
        ],
      },
      {
        title: '期末余额',
        dataIndex: 'qmMd',
        children: [
          {
            title: '数量',
            dataIndex: 'qmNum',
            key: '6-1',
            align: 'right',
            slots: { customRender: 'qmNum' },
          },
          {
            title: '本币借方',
            dataIndex: 'qmMd',
            key: '6-2',
            align: 'right',
            slots: { customRender: 'qmMd' },
          },
          {
            title: '本币贷方',
            dataIndex: 'qmMc',
            key: '6-3',
            align: 'right',
            slots: { customRender: 'qmMc' },
          }
        ],
      },
    ],
    WJ: [
      {
        title: '客户编码',
        dataIndex: 'ccode',
        key: 'ccode',fixed: 'left',
        align: 'left',
        slots: { customRender: 'ccode' },
      },
      {
        title: '客户名称',
        dataIndex: 'ccodeName',
        key: 'ccodeName',fixed: 'left',
        align: 'left',ellipsis: true,
        slots: { customRender: 'ccodeName' },
      },
      {
        title: '外币名称',
        dataIndex: 'foreignCurrency',
        key: 'foreignCurrency',
        align: 'center',fixed: 'left',
      },
      {
        title: '期初余额',
        dataIndex: 'qcMd',
        children: [
          {
            title: '原币金额',
            dataIndex: 'qcNfrat',
            key: '3-1',
            align: 'right',
            slots: { customRender: 'qcNfrat' },
          },
          {
            title: '本币借方',
            dataIndex: 'qcMd',
            key: '3-2',
            align: 'right',
            slots: { customRender: 'qcMd' },
          },
          {
            title: '本币贷方',
            dataIndex: 'qcMc',
            key: '3-3',
            align: 'right',
            slots: { customRender: 'qcMc' },
          }
        ],
      },
      {
        title: '本期发生',
        dataIndex: 'pzMd',
        children: [
          {
            title: '原币金额',
            dataIndex: 'pzNfrat',
            key: '4-1',
            align: 'right',
            slots: { customRender: 'pzNfrat' },
          },
          {
            title: '本币借方',
            dataIndex: 'pzMd',
            key: '4-2',
            align: 'right',
            slots: { customRender: 'pzMd' },
          },
          {
            title: '本币贷方',
            dataIndex: 'pzMc',
            key: '4-3',
            align: 'right',
            slots: { customRender: 'pzMc' },
          }
        ],
      },
      {
        title: '期末余额',
        dataIndex: 'qmMd',
        children: [
          {
            title: '原币金额',
            dataIndex: 'qmNfrat',
            key: '6-1',
            align: 'right',
            slots: { customRender: 'qmNfrat' },
          },
          {
            title: '本币借方',
            dataIndex: 'qmMd',
            key: '6-2',
            align: 'right',
            slots: { customRender: 'qmMd' },
          },
          {
            title: '本币贷方',
            dataIndex: 'qmMc',
            key: '6-3',
            align: 'right',
            slots: { customRender: 'qmMc' },
          }
        ],
      },
    ],
    SWJ: [
      {
        title: '客户编码',
        dataIndex: 'ccode',
        key: 'ccode',
        align: 'left',fixed: 'left',
        slots: { customRender: 'ccode' },
      },
      {
        title: '客户名称',
        dataIndex: 'ccodeName',
        key: 'ccodeName',fixed: 'left',
        align: 'left',ellipsis: true,
        slots: { customRender: 'ccodeName' },
      },
      {
        title: '计量单位',
        dataIndex: 'unitMeasurement',
        key: 'unitMeasurement',
        align: 'center',fixed: 'left',
      },
      {
        title: '外币名称',
        dataIndex: 'foreignCurrency',
        key: 'foreignCurrency',
        align: 'center',fixed: 'left',
      },
      {
        title: '期初余额',
        dataIndex: 'qcMd',
        children: [
          {
            title: '数量',
            dataIndex: 'qcNum',
            key: '4-1',
            align: 'right',
            slots: { customRender: 'qcNum' },
          },
          {
            title: '原币金额',
            dataIndex: 'qcNfrat',
            key: '4-2',
            align: 'right',
            slots: { customRender: 'qcNfrat' },
          },
          {
            title: '本币借方',
            dataIndex: 'qcMd',
            key: '4-3',
            align: 'right',
            slots: { customRender: 'qcMd' },
          },
          {
            title: '本币贷方',
            dataIndex: 'qcMc',
            key: '4-4',
            align: 'right',
            slots: { customRender: 'qcMc' },
          }
        ],
      },
      {
        title: '本期发生',
        dataIndex: 'pzMd',
        children: [
          {
            title: '数量',
            dataIndex: 'pzNum',
            key: '5-1',
            align: 'right',
            slots: { customRender: 'pzNum' },
          },
          {
            title: '原币金额',
            dataIndex: 'pzNfrat',
            key: '5-2',
            align: 'right',
            slots: { customRender: 'pzNfrat' },
          },
          {
            title: '本币借方',
            dataIndex: 'pzMd',
            key: '5-3',
            align: 'right',
            slots: { customRender: 'pzMd' },
          },
          {
            title: '本币贷方',
            dataIndex: 'pzMc',
            key: '5-4',
            align: 'right',
            slots: { customRender: 'pzMc' },
          }
        ],
      },
      {
        title: '期末余额',
        dataIndex: 'qmMd',
        children: [
          {
            title: '数量',
            dataIndex: 'qmNum',
            key: '7-1',
            align: 'right',
            slots: { customRender: 'qmNum' },
          },
          {
            title: '原币金额',
            dataIndex: 'qmNfrat',
            key: '7-2',
            align: 'right',
            slots: { customRender: 'qmNfrat' },
          },
          {
            title: '本币借方',
            dataIndex: 'qmMd',
            key: '7-3',
            align: 'right',
            slots: { customRender: 'qmMd' },
          },
          {
            title: '本币贷方',
            dataIndex: 'qmMc',
            key: '7-4',
            align: 'right',
            slots: { customRender: 'qmMc' },
          }
        ],
      },
    ],
  }),
  getters: {
    getColumns: (state) => (value,flag) => {
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
});

// Need to be used outside the setup
export function useGlStoreWidthOut() {
  return kmCusYueGlStore(store);
}

