import {defineStore} from 'pinia';
import {store} from '/@/store';
import {message} from "ant-design-vue";
import {reactive} from "vue";

export const useGdGlStore = defineStore({
  id: 'useGdGlStore',
  state: (): any => ({
    T1:[
      {
        title: '期间',
        dataIndex: 'number',
        key: 'number',
        align: 'center',
        slots: { customRender: 'number' },
      },
      {
        title: '摘要',
        dataIndex: 'lb',
        key: 'lb',
        align: 'left',
        slots: { customRender: 'lb' },
      }, 
      {
        title: '原值',
        key: 'yz',
        dataIndex: 'yz',
        children: [
          {
            title: '借方',
            dataIndex: 'yjf',
            key: '2-1',
            align: 'right',
            slots: { customRender: 'yjf' },
          },
          {
            title: '贷方',
            dataIndex: 'ydf',
            key: '2-2',
            align: 'right',
            slots: { customRender: 'ydf' },
          },
          {
            title: '余额',
            dataIndex: 'yye',
            key: '2-3',
            align: 'right',
            slots: { customRender: 'yye' },
          }
        ],
      },
      {
        title: '累计折旧',
        key: 'zj',
        dataIndex: 'zj',
        children: [
          {
            title: '借方',
            dataIndex: 'zjf',
            key: '3-1',
            align: 'right',
            slots: { customRender: 'zjf' },
          },
          {
            title: '贷方',
            dataIndex: 'zdf',
            key: '3-2',
            align: 'right',
            slots: { customRender: 'zdf' },
          },
          {
            title: '余额',
            dataIndex: 'zye',
            key: '3-3',
            align: 'right',
            slots: { customRender: 'zye' },
          }
        ],
      },
/*      {
        title: '减值准备',
        key: 'jz',
        dataIndex: 'jz',
        children: [
          {
            title: '借方',
            dataIndex: 'jjf',
            key: '4-1',
            align: 'right',
            slots: { customRender: 'jjf' },
          },
          {
            title: '贷方',
            dataIndex: 'jdf',
            key: '4-2',
            align: 'right',
            slots: { customRender: 'jdf' },
          },
          {
            title: '余额',
            dataIndex: 'jye',
            key: '4-3',
            align: 'right',
            slots: { customRender: 'jye' },
          }
        ],
      },*/
      {
        title: '净值',
        dataIndex: 'jingzhih',
        key: 'jingzhih',
        children: [
          {
            title: '余额',
            dataIndex: 'jingzhi',
            key: '4-1',
            align: 'right',
            slots: { customRender: 'jingzhi' },
          }
        ],
      }
    ],
    T2: [
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
        align: 'center',
      },
      {
        title: '日期',
        dataIndex: 'rq',
        key: 'rq',
        align: 'center',
      },
      {
        title: '项目',
        dataIndex: 'xm',
        key: 'xm',
        align: 'center',
      },
      {
        title: '原值',
        key: 'yz',
        dataIndex: 'yz',
        children: [
          {
            title: '借方',
            dataIndex: 'yjf',
            key: '3-1',
            align: 'right',
            slots: { customRender: 'yjf' },
          },
          {
            title: '贷方',
            dataIndex: 'ydf',
            key: '3-2',
            align: 'right',
            slots: { customRender: 'ydf' },
          },
          {
            title: '余额',
            dataIndex: 'yye',
            key: '3-3',
            align: 'right',
            slots: { customRender: 'yye' },
          }
        ],
      },
      {
        title: '累计折旧',
        key: 'zj',
        dataIndex: 'zj',
        children: [
          {
            title: '借方',
            dataIndex: 'zjf',
            key: '4-1',
            align: 'right',
            slots: { customRender: 'zjf' },
          },
          {
            title: '贷方',
            dataIndex: 'zdf',
            key: '4-2',
            align: 'right',
            slots: { customRender: 'zdf' },
          },
          {
            title: '余额',
            dataIndex: 'zye',
            key: '4-3',
            align: 'right',
            slots: { customRender: 'zye' },
          }
        ],
      },
      {
        title: '减值准备',
        key: 'jz',
        dataIndex: 'jz',
        children: [
          {
            title: '借方',
            dataIndex: 'jjf',
            key: '4-1',
            align: 'right',
            slots: { customRender: 'jjf' },
          },
          {
            title: '贷方',
            dataIndex: 'jdf',
            key: '4-2',
            align: 'right',
            slots: { customRender: 'jdf' },
          },
          {
            title: '余额',
            dataIndex: 'jye',
            key: '4-3',
            align: 'right',
            slots: { customRender: 'jye' },
          }
        ],
      },
      {
        title: '净值',
        dataIndex: 'jingzhi',
        key: 'jingzhi',
        align: 'right',
        slots: { customRender: 'jingzhi' },
      }
    ],
    T3: [
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
        align: 'center',
      },
      {
        title: '日期',
        dataIndex: 'rq',
        key: 'rq',
        align: 'center',
      },
      {
        title: '部门',
        dataIndex: 'bm',
        key: 'bm',
        align: 'center',
      },
      {
        title: '原值',
        key: 'yz',
        dataIndex: 'yz',
        children: [
          {
            title: '借方',
            dataIndex: 'yjf',
            key: '3-1',
            align: 'right',
            slots: { customRender: 'yjf' },
          },
          {
            title: '贷方',
            dataIndex: 'ydf',
            key: '3-2',
            align: 'right',
            slots: { customRender: 'ydf' },
          },
          {
            title: '余额',
            dataIndex: 'yye',
            key: '3-3',
            align: 'right',
            slots: { customRender: 'yye' },
          }
        ],
      },
      {
        title: '累计折旧',
        key: 'zj',
        dataIndex: 'zj',
        children: [
          {
            title: '借方',
            dataIndex: 'zjf',
            key: '4-1',
            align: 'right',
            slots: { customRender: 'zjf' },
          },
          {
            title: '贷方',
            dataIndex: 'zdf',
            key: '4-2',
            align: 'right',
            slots: { customRender: 'zdf' },
          },
          {
            title: '余额',
            dataIndex: 'zye',
            key: '4-3',
            align: 'right',
            slots: { customRender: 'zye' },
          }
        ],
      },
      {
        title: '减值准备',
        key: 'jz',
        dataIndex: 'jz',
        children: [
          {
            title: '借方',
            dataIndex: 'jjf',
            key: '4-1',
            align: 'right',
            slots: { customRender: 'jjf' },
          },
          {
            title: '贷方',
            dataIndex: 'jdf',
            key: '4-2',
            align: 'right',
            slots: { customRender: 'jdf' },
          },
          {
            title: '余额',
            dataIndex: 'jye',
            key: '4-3',
            align: 'right',
            slots: { customRender: 'jye' },
          }
        ],
      },
      {
        title: '净值',
        dataIndex: 'jingzhi',
        key: 'jingzhi',
        align: 'right',
        slots: { customRender: 'jingzhi' },
      }
    ],
    T4: [
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
        align: 'center',
      },
      {
        title: '日期',
        dataIndex: 'rq',
        key: 'rq',
        align: 'center',
      },
      {
        title: '资产类别',
        dataIndex: 'lb',
        key: 'lb',
        align: 'center',
      },
      {
        title: '项目',
        dataIndex: 'xm',
        key: 'xm',
        align: 'center',
      },
      {
        title: '原值',
        key: 'yz',
        dataIndex: 'yz',
        children: [
          {
            title: '借方',
            dataIndex: 'yjf',
            key: '3-1',
            align: 'right',
            slots: { customRender: 'yjf' },
          },
          {
            title: '贷方',
            dataIndex: 'ydf',
            key: '3-2',
            align: 'right',
            slots: { customRender: 'ydf' },
          },
          {
            title: '余额',
            dataIndex: 'yye',
            key: '3-3',
            align: 'right',
            slots: { customRender: 'yye' },
          }
        ],
      },
      {
        title: '累计折旧',
        key: 'zj',
        dataIndex: 'zj',
        children: [
          {
            title: '借方',
            dataIndex: 'zjf',
            key: '4-1',
            align: 'right',
            slots: { customRender: 'zjf' },
          },
          {
            title: '贷方',
            dataIndex: 'zdf',
            key: '4-2',
            align: 'right',
            slots: { customRender: 'zdf' },
          },
          {
            title: '余额',
            dataIndex: 'zye',
            key: '4-3',
            align: 'right',
            slots: { customRender: 'zye' },
          }
        ],
      },
      {
        title: '减值准备',
        key: 'jz',
        dataIndex: 'jz',
        children: [
          {
            title: '借方',
            dataIndex: 'jjf',
            key: '4-1',
            align: 'right',
            slots: { customRender: 'jjf' },
          },
          {
            title: '贷方',
            dataIndex: 'jdf',
            key: '4-2',
            align: 'right',
            slots: { customRender: 'jdf' },
          },
          {
            title: '余额',
            dataIndex: 'jye',
            key: '4-3',
            align: 'right',
            slots: { customRender: 'jye' },
          }
        ],
      },
      {
        title: '净值',
        dataIndex: 'jingzhi',
        key: 'jingzhi',
        align: 'right',
        slots: { customRender: 'jingzhi' },
      }
    ],
    T5: [
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
        align: 'center',
      },
      {
        title: '日期',
        dataIndex: 'rq',
        key: 'rq',
        align: 'center',
      },
      {
        title: '资产类别',
        dataIndex: 'lb',
        key: 'lb',
        align: 'center',
      },
      {
        title: '部门',
        dataIndex: 'bm',
        key: 'bm',
        align: 'center',
      },
      {
        title: '原值',
        key: 'yz',
        dataIndex: 'yz',
        children: [
          {
            title: '借方',
            dataIndex: 'yjf',
            key: '3-1',
            align: 'right',
            slots: { customRender: 'yjf' },
          },
          {
            title: '贷方',
            dataIndex: 'ydf',
            key: '3-2',
            align: 'right',
            slots: { customRender: 'ydf' },
          },
          {
            title: '余额',
            dataIndex: 'yye',
            key: '3-3',
            align: 'right',
            slots: { customRender: 'yye' },
          }
        ],
      },
      {
        title: '累计折旧',
        key: 'zj',
        dataIndex: 'zj',
        children: [
          {
            title: '借方',
            dataIndex: 'zjf',
            key: '4-1',
            align: 'right',
            slots: { customRender: 'zjf' },
          },
          {
            title: '贷方',
            dataIndex: 'zdf',
            key: '4-2',
            align: 'right',
            slots: { customRender: 'zdf' },
          },
          {
            title: '余额',
            dataIndex: 'zye',
            key: '4-3',
            align: 'right',
            slots: { customRender: 'zye' },
          }
        ],
      },
      {
        title: '减值准备',
        key: 'jz',
        dataIndex: 'jz',
        children: [
          {
            title: '借方',
            dataIndex: 'jjf',
            key: '4-1',
            align: 'right',
            slots: { customRender: 'jjf' },
          },
          {
            title: '贷方',
            dataIndex: 'jdf',
            key: '4-2',
            align: 'right',
            slots: { customRender: 'jdf' },
          },
          {
            title: '余额',
            dataIndex: 'jye',
            key: '4-3',
            align: 'right',
            slots: { customRender: 'jye' },
          }
        ],
      },
      {
        title: '净值',
        dataIndex: 'jingzhi',
        key: 'jingzhi',
        align: 'right',
        slots: { customRender: 'jingzhi' },
      }
    ],
    T6: [
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
        align: 'center',
      },
      {
        title: '日期',
        dataIndex: 'rq',
        key: 'rq',
        align: 'center',
      },
      {
        title: '项目',
        dataIndex: 'xm',
        key: 'xm',
        align: 'center',
      },
      {
        title: '资产类别',
        dataIndex: 'lb',
        key: 'lb',
        align: 'center',
      },
      {
        title: '原值',
        key: 'yz',
        dataIndex: 'yz',
        children: [
          {
            title: '借方',
            dataIndex: 'yjf',
            key: '3-1',
            align: 'right',
            slots: { customRender: 'yjf' },
          },
          {
            title: '贷方',
            dataIndex: 'ydf',
            key: '3-2',
            align: 'right',
            slots: { customRender: 'ydf' },
          },
          {
            title: '余额',
            dataIndex: 'yye',
            key: '3-3',
            align: 'right',
            slots: { customRender: 'yye' },
          }
        ],
      },
      {
        title: '累计折旧',
        key: 'zj',
        dataIndex: 'zj',
        children: [
          {
            title: '借方',
            dataIndex: 'zjf',
            key: '4-1',
            align: 'right',
            slots: { customRender: 'zjf' },
          },
          {
            title: '贷方',
            dataIndex: 'zdf',
            key: '4-2',
            align: 'right',
            slots: { customRender: 'zdf' },
          },
          {
            title: '余额',
            dataIndex: 'zye',
            key: '4-3',
            align: 'right',
            slots: { customRender: 'zye' },
          }
        ],
      },
      {
        title: '减值准备',
        key: 'jz',
        dataIndex: 'jz',
        children: [
          {
            title: '借方',
            dataIndex: 'jjf',
            key: '4-1',
            align: 'right',
            slots: { customRender: 'jjf' },
          },
          {
            title: '贷方',
            dataIndex: 'jdf',
            key: '4-2',
            align: 'right',
            slots: { customRender: 'jdf' },
          },
          {
            title: '余额',
            dataIndex: 'jye',
            key: '4-3',
            align: 'right',
            slots: { customRender: 'jye' },
          }
        ],
      },
      {
        title: '净值',
        dataIndex: 'jingzhi',
        key: 'jingzhi',
        align: 'right',
        slots: { customRender: 'jingzhi' },
      }
    ],
    T7: [
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
        align: 'center',
      },
      {
        title: '日期',
        dataIndex: 'rq',
        key: 'rq',
        align: 'center',
      },
      {
        title: '部门',
        dataIndex: 'bm',
        key: 'bm',
        align: 'center',
      },
      {
        title: '资产类别',
        dataIndex: 'lb',
        key: 'lb',
        align: 'center',
      },
      {
        title: '原值',
        key: 'yz',
        dataIndex: 'yz',
        children: [
          {
            title: '借方',
            dataIndex: 'yjf',
            key: '3-1',
            align: 'right',
            slots: { customRender: 'yjf' },
          },
          {
            title: '贷方',
            dataIndex: 'ydf',
            key: '3-2',
            align: 'right',
            slots: { customRender: 'ydf' },
          },
          {
            title: '余额',
            dataIndex: 'yye',
            key: '3-3',
            align: 'right',
            slots: { customRender: 'yye' },
          }
        ],
      },
      {
        title: '累计折旧',
        key: 'zj',
        dataIndex: 'zj',
        children: [
          {
            title: '借方',
            dataIndex: 'zjf',
            key: '4-1',
            align: 'right',
            slots: { customRender: 'zjf' },
          },
          {
            title: '贷方',
            dataIndex: 'zdf',
            key: '4-2',
            align: 'right',
            slots: { customRender: 'zdf' },
          },
          {
            title: '余额',
            dataIndex: 'zye',
            key: '4-3',
            align: 'right',
            slots: { customRender: 'zye' },
          }
        ],
      },
      {
        title: '减值准备',
        key: 'jz',
        dataIndex: 'jz',
        children: [
          {
            title: '借方',
            dataIndex: 'jjf',
            key: '4-1',
            align: 'right',
            slots: { customRender: 'jjf' },
          },
          {
            title: '贷方',
            dataIndex: 'jdf',
            key: '4-2',
            align: 'right',
            slots: { customRender: 'jdf' },
          },
          {
            title: '余额',
            dataIndex: 'jye',
            key: '4-3',
            align: 'right',
            slots: { customRender: 'jye' },
          }
        ],
      },
      {
        title: '净值',
        dataIndex: 'jingzhi',
        key: 'jingzhi',
        align: 'right',
        slots: { customRender: 'jingzhi' },
      }
    ],
    T8: [
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
        align: 'center',
      },
      {
        title: '日期',
        dataIndex: 'rq',
        key: 'rq',
        align: 'center',
      },
      {
        title: '项目',
        dataIndex: 'xm',
        key: 'xm',
        align: 'center',
      },
      {
        title: '部门',
        dataIndex: 'bm',
        key: 'bm',
        align: 'center',
      },
      {
        title: '原值',
        key: 'yz',
        dataIndex: 'yz',
        children: [
          {
            title: '借方',
            dataIndex: 'yjf',
            key: '3-1',
            align: 'right',
            slots: { customRender: 'yjf' },
          },
          {
            title: '贷方',
            dataIndex: 'ydf',
            key: '3-2',
            align: 'right',
            slots: { customRender: 'ydf' },
          },
          {
            title: '余额',
            dataIndex: 'yye',
            key: '3-3',
            align: 'right',
            slots: { customRender: 'yye' },
          }
        ],
      },
      {
        title: '累计折旧',
        key: 'zj',
        dataIndex: 'zj',
        children: [
          {
            title: '借方',
            dataIndex: 'zjf',
            key: '4-1',
            align: 'right',
            slots: { customRender: 'zjf' },
          },
          {
            title: '贷方',
            dataIndex: 'zdf',
            key: '4-2',
            align: 'right',
            slots: { customRender: 'zdf' },
          },
          {
            title: '余额',
            dataIndex: 'zye',
            key: '4-3',
            align: 'right',
            slots: { customRender: 'zye' },
          }
        ],
      },
      {
        title: '减值准备',
        key: 'jz',
        dataIndex: 'jz',
        children: [
          {
            title: '借方',
            dataIndex: 'jjf',
            key: '4-1',
            align: 'right',
            slots: { customRender: 'jjf' },
          },
          {
            title: '贷方',
            dataIndex: 'jdf',
            key: '4-2',
            align: 'right',
            slots: { customRender: 'jdf' },
          },
          {
            title: '余额',
            dataIndex: 'jye',
            key: '4-3',
            align: 'right',
            slots: { customRender: 'jye' },
          }
        ],
      },
      {
        title: '净值',
        dataIndex: 'jingzhi',
        key: 'jingzhi',
        align: 'right',
        slots: { customRender: 'jingzhi' },
      }
    ],
    T9: [
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
        align: 'center',
      },
      {
        title: '日期',
        dataIndex: 'rq',
        key: 'rq',
        align: 'center',
      },
      {
        title: '部门',
        dataIndex: 'bm',
        key: 'bm',
        align: 'center',
      },
      {
        title: '项目',
        dataIndex: 'xm',
        key: 'xm',
        align: 'center',
      },
      {
        title: '原值',
        key: 'yz',
        dataIndex: 'yz',
        children: [
          {
            title: '借方',
            dataIndex: 'yjf',
            key: '3-1',
            align: 'right',
            slots: { customRender: 'yjf' },
          },
          {
            title: '贷方',
            dataIndex: 'ydf',
            key: '3-2',
            align: 'right',
            slots: { customRender: 'ydf' },
          },
          {
            title: '余额',
            dataIndex: 'yye',
            key: '3-3',
            align: 'right',
            slots: { customRender: 'yye' },
          }
        ],
      },
      {
        title: '累计折旧',
        key: 'zj',
        dataIndex: 'zj',
        children: [
          {
            title: '借方',
            dataIndex: 'zjf',
            key: '4-1',
            align: 'right',
            slots: { customRender: 'zjf' },
          },
          {
            title: '贷方',
            dataIndex: 'zdf',
            key: '4-2',
            align: 'right',
            slots: { customRender: 'zdf' },
          },
          {
            title: '余额',
            dataIndex: 'zye',
            key: '4-3',
            align: 'right',
            slots: { customRender: 'zye' },
          }
        ],
      },
      {
        title: '减值准备',
        key: 'jz',
        dataIndex: 'jz',
        children: [
          {
            title: '借方',
            dataIndex: 'jjf',
            key: '4-1',
            align: 'right',
            slots: { customRender: 'jjf' },
          },
          {
            title: '贷方',
            dataIndex: 'jdf',
            key: '4-2',
            align: 'right',
            slots: { customRender: 'jdf' },
          },
          {
            title: '余额',
            dataIndex: 'jye',
            key: '4-3',
            align: 'right',
            slots: { customRender: 'jye' },
          }
        ],
      },
      {
        title: '净值',
        dataIndex: 'jingzhi',
        key: 'jingzhi',
        align: 'right',
        slots: { customRender: 'jingzhi' },
      }
    ],
  }),
  getters: {
    getColumns: (state) => (value) => {
      if(value == 'T1'){
        return state.T1
      }else  if(value == 'T2'){
        return state.T2
      }else  if(value == 'T3'){
        return state.T3
      }else  if(value == 'T4'){
        return state.T4
      }else  if(value == 'T5'){
        return state.T5
      }else  if(value == 'T6'){
        return state.T6
      }else  if(value == 'T7'){
        return state.T7
      }else  if(value == 'T8'){
        return state.T8
      }else{
        return state.T9
      }
      return state.T1
    },
  },
  actions: {

  }
});

// Need to be used outside the setup
export function useGdGlStoreWidthOut() {
  return useGdGlStore(store);
}

