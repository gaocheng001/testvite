import {defineStore} from 'pinia';
import {store} from '/@/store';

export const yueGlStore = defineStore({
  id: 'yueGlStore',
  state: (): any => ({
    J:[
      {
        title: '部门',
        dataIndex: 'dept',
        key: 'dept',
        defaultHidden: true,ellipsis: true,width:400,
        slots: { customRender: 'dept' },fixed: 'left'
      },
      {
        title: '个人',
        dataIndex: 'psn',
        key: 'psn',
        defaultHidden: true,ellipsis: true,width:400,
        slots: { customRender: 'psn' },fixed: 'left'
      },{
        title: '客户',
        dataIndex: 'cus',
        key: 'cus',
        defaultHidden: true,ellipsis: true,width:400,
        slots: { customRender: 'cus' },fixed: 'left'
      },{
        title: '供应商',
        dataIndex: 'sup',
        key: 'sup',
        defaultHidden: true,ellipsis: true,width:400,
        slots: { customRender: 'sup' },fixed: 'left'
      },{
        title: '项目',
        dataIndex: 'pro',
        key: 'pro',
        defaultHidden: true,ellipsis: true,width:400,
        slots: { customRender: 'pro' },fixed: 'left'
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
        title: '部门',
        dataIndex: 'dept',
        key: 'dept',
        defaultHidden: true,ellipsis: true,
        slots: { customRender: 'dept' },fixed: 'left'
      },
      {
        title: '个人',
        dataIndex: 'psn',
        key: 'psn',
        defaultHidden: true,ellipsis: true,
        slots: { customRender: 'psn' },fixed: 'left'
      },{
        title: '客户',
        dataIndex: 'cus',
        key: 'cus',
        defaultHidden: true,ellipsis: true,
        slots: { customRender: 'cus' },fixed: 'left'
      },{
        title: '供应商',
        dataIndex: 'sup',
        key: 'sup',
        defaultHidden: true,ellipsis: true,
        slots: { customRender: 'sup' },fixed: 'left'
      },{
        title: '项目',
        dataIndex: 'pro',
        key: 'pro',
        defaultHidden: true,ellipsis: true,
        slots: { customRender: 'pro' },fixed: 'left'
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
        title: '部门',
        dataIndex: 'dept',
        key: 'dept',
        defaultHidden: true,ellipsis: true,
        slots: { customRender: 'dept' },fixed: 'left'
      },
      {
        title: '个人',
        dataIndex: 'psn',
        key: 'psn',
        defaultHidden: true,ellipsis: true,
        slots: { customRender: 'psn' },fixed: 'left'
      },{
        title: '客户',
        dataIndex: 'cus',
        key: 'cus',
        defaultHidden: true,ellipsis: true,
        slots: { customRender: 'cus' },fixed: 'left'
      },{
        title: '供应商',
        dataIndex: 'sup',
        key: 'sup',
        defaultHidden: true,ellipsis: true,
        slots: { customRender: 'sup' },fixed: 'left'
      },{
        title: '项目',
        dataIndex: 'pro',
        key: 'pro',
        defaultHidden: true,ellipsis: true,
        slots: { customRender: 'pro' },fixed: 'left'
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
        title: '部门',
        dataIndex: 'dept',
        key: 'dept',
        defaultHidden: true,ellipsis: true,
        slots: { customRender: 'dept' },fixed: 'left'
      },
      {
        title: '个人',
        dataIndex: 'psn',
        key: 'psn',
        defaultHidden: true,ellipsis: true,
        slots: { customRender: 'psn' },fixed: 'left'
      },{
        title: '客户',
        dataIndex: 'cus',
        key: 'cus',
        defaultHidden: true,ellipsis: true,
        slots: { customRender: 'cus' },fixed: 'left'
      },{
        title: '供应商',
        dataIndex: 'sup',
        key: 'sup',
        defaultHidden: true,ellipsis: true,
        slots: { customRender: 'sup' },fixed: 'left'
      },{
        title: '项目',
        dataIndex: 'pro',
        key: 'pro',
        defaultHidden: true,ellipsis: true,
        slots: { customRender: 'pro' },fixed: 'left'
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
    getColumns: (state) => (value,setingColunm) => {
      state.J.forEach(v=>{
        if(v.title==='部门'){
          v.defaultHidden=true
        }
        if(v.title==='个人'){
          v.defaultHidden=true
        }
        if(v.title==='客户'){
          v.defaultHidden=true
        }
        if(v.title==='供应商'){
          v.defaultHidden=true
        }
        if(v.title==='项目'){
          v.defaultHidden=true
        }
      })
      if(value == 'J'){
        if(setingColunm!=undefined){
          for (let i = 0; i < setingColunm.length; i++) {
            state.J.filter(s=>s.title===setingColunm[i])[0]['defaultHidden']=false
          }
        }
        return state.J
      }else  if(value == 'SJ'){
        if(setingColunm!=undefined){
          for (let i = 0; i < setingColunm.length; i++) {
            state.J.filter(s=>s.title===setingColunm[i])[0]['defaultHidden']=false
          }
        }
        return state.SJ
      }else  if(value == 'WJ'){
        if(setingColunm!=undefined){
          for (let i = 0; i < setingColunm.length; i++) {
            state.J.filter(s=>s.title===setingColunm[i])[0]['defaultHidden']=false
          }
        }
        return state.WJ
      }else{
        if(setingColunm!=undefined){
          for (let i = 0; i < setingColunm.length; i++) {
            state.J.filter(s=>s.title===setingColunm[i])[0]['defaultHidden']=false
          }
        }
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
  return yueGlStore(store);
}

