import {defineStore} from 'pinia';
import {store} from '/@/store';

export const kmSupYueGlStore = defineStore({
  id: 'kmSupYueGlStore',
  state: (): any => ({
    J:[
      {
        title: '供应商编码',
        dataIndex: 'ccode',
        key: 'ccode',
        align: 'center',fixed: 'left',
        slots: { customRender: 'ccode' },
      },
      {
        title: '供应商名称',
        dataIndex: 'ccodeName',
        key: 'ccodeName',
        align: 'center',
        ellipsis: true,fixed: 'left',
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
        title: '累计发生',
        dataIndex: 'ljMd',
        defaultHidden: false,
        children: [
          {
            title: '本币借方',
            dataIndex: 'ljMd',
            key: '4-1',
            align: 'right',
            slots: { customRender: 'ljMd' },
          },
          {
            title: '本币贷方',
            dataIndex: 'ljMc',
            key: '4-2',
            align: 'right',
            slots: { customRender: 'ljMc' },
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
        title: '供应商编码',
        dataIndex: 'ccode',
        key: 'ccode',
        align: 'left',fixed: 'left',
        slots: { customRender: 'ccode' },
      },
      {
        title: '供应商名称',
        dataIndex: 'ccodeName',
        key: 'ccodeName',
        align: 'left',
        ellipsis: true,fixed: 'left',
        slots: { customRender: 'ccodeName' },
      },
      {
        title: '计量单位',
        dataIndex: 'unitMeasurement',
        key: 'unitMeasurement',
        align: 'center',
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
        title: '累计发生',
        dataIndex: 'ljMd',
        defaultHidden: false,
        children: [
          {
            title: '数量',
            dataIndex: 'ljNum',
            key: '5-1',
            align: 'right',
            slots: { customRender: 'ljNum' },
          },
          {
            title: '本币借方',
            dataIndex: 'ljMd',
            key: '5-2',
            align: 'right',
            slots: { customRender: 'ljMd' },
          },
          {
            title: '本币贷方',
            dataIndex: 'ljMc',
            key: '5-3',
            align: 'right',
            slots: { customRender: 'ljMc' },
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
        title: '供应商编码',
        dataIndex: 'ccode',
        key: 'ccode',
        align: 'left',fixed: 'left',
        slots: { customRender: 'ccode' },
      },
      {
        title: '供应商名称',
        dataIndex: 'ccodeName',
        key: 'ccodeName',
        align: 'left',
        ellipsis: true,fixed: 'left',
        slots: { customRender: 'ccodeName' },
      },
      {
        title: '外币名称',
        dataIndex: 'foreignCurrency',
        key: 'foreignCurrency',
        align: 'center',
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
        title: '累计发生',
        dataIndex: 'ljMd',
        defaultHidden: false,
        children: [
          {
            title: '原币金额',
            dataIndex: 'ljNfrat',
            key: '5-1',
            align: 'right',
            slots: { customRender: 'ljNfrat' },
          },
          {
            title: '本币借方',
            dataIndex: 'ljmd',
            key: '5-2',
            align: 'ljMd',
            slots: { customRender: 'ljmd' },
          },
          {
            title: '本币贷方',
            dataIndex: 'ljMc',
            key: '5-3',
            align: 'right',
            slots: { customRender: 'ljMc' },
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
        title: '供应商编码',
        dataIndex: 'ccode',
        key: 'ccode',
        align: 'left',fixed: 'left',
        slots: { customRender: 'ccode' },
      },
      {
        title: '供应商名称',
        dataIndex: 'ccodeName',
        key: 'ccodeName',
        align: 'left',
        ellipsis: true,fixed: 'left',
        slots: { customRender: 'ccodeName' },
      },
      {
        title: '计量单位',
        dataIndex: 'unitMeasurement',
        key: 'unitMeasurement',
        align: 'center',
      },
      {
        title: '外币名称',
        dataIndex: 'foreignCurrency',
        key: 'foreignCurrency',
        align: 'center',
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
        title: '累计发生',
        dataIndex: 'ljMd',
        defaultHidden: false,
        children: [
          {
            title: '数量',
            dataIndex: 'ljNum',
            key: '6-1',
            align: 'right',
            slots: { customRender: 'ljNum' },
          },
          {
            title: '原币金额',
            dataIndex: 'ljNfrat',
            key: '6-2',
            align: 'right',
            slots: { customRender: 'ljNfrat' },
          },
          {
            title: '本币借方',
            dataIndex: 'ljMd',
            key: '6-3',
            align: 'right',
            slots: { customRender: 'ljMd' },
          },
          {
            title: '本币贷方',
            dataIndex: 'ljMc',
            key: '6-4',
            align: 'right',
            slots: { customRender: 'ljMc' },
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
        state.J.filter(s=>s.title==='累计发生')[0]['defaultHidden']=!flag
        return state.J
      }else  if(value == 'SJ'){
        state.SJ.filter(s=>s.title==='累计发生')[0]['defaultHidden']=!flag
        return state.SJ
      }else  if(value == 'WJ'){
        state.WJ.filter(s=>s.title==='累计发生')[0]['defaultHidden']=!flag
        return state.WJ
      }else{
        state.SWJ.filter(s=>s.title==='累计发生')[0]['defaultHidden']=!flag
        return state.SWJ
      }
      return state.J
    },
  },
});

// Need to be used outside the setup
export function useGlStoreWidthOut() {
  return kmSupYueGlStore(store);
}

