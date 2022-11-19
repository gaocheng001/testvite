import {defineStore} from 'pinia';
import {store} from '/@/store';
import {findAllAccvoucherTemplate} from "/@/api/record/system/accvoucher_template";
import {message} from "ant-design-vue";
import {reactive} from "vue";

export const useAccvoucherHxStore = defineStore({
  id: 'useAccvoucherHx',
  state: (): any => ({
    columns: [
      /*      {
              title: 'ID',
              dataIndex: 'id',
              width: '50px',
              ifShow: true,
            },*/
      {
        title: '序号',
        width: '60px',
        fixed: 'left',
        dataIndex: 'cdfine30',
        slots: {customRender: 'cdfine30'}
      },
      {
        title: '制单日期',
        dataIndex: 'dbillDate',
        width: '100px',
      },
      {
        title: '凭证字号',
        dataIndex: 'inoId',
        width: '60px'
        , slots: {customRender: 'csignAndInoId'}
      },
      {

        title: '摘要',
        dataIndex: 'cdigest',
        ellipsis: true,
        width: '180px'
        , align: 'left'
      },
      {
        title: '往来单位简称',
        dataIndex: 'custname',
        width: '150px',
        ifShow: true
      },
      {
        title: '借方金额',
        dataIndex: 'md',
        width: '120px',
        ellipsis: true,
        slots: {customRender: 'md'}
      },
      {
        title: '贷方金额',
        dataIndex: 'mc',
        width: '120px',
        ellipsis: true,
        slots: {customRender: 'mc'}
      },
      {
        title: '未核销金额',
        dataIndex: 'remainMoney',
        width: '120px',
        ellipsis: true,
        slots: {customRender: 'remainMoney'}
      },
      {
        title: '两清',
        dataIndex: 'hxStatue',
        width: '100px',
        ellipsis: true,
        slots: {customRender: 'hxStatue'}
      },
      {
        title: '核销标记号',
        dataIndex: 'hxcode',
        width: '60px',
        ellipsis: true,
        slots: {customRender: 'hxcode'}
      },

    ],
  }),
  getters: {
    getColumns: (state) => (value) => {
      return value == '1'?state.columns:state.columns2
    },
  },
  actions: {

  }
});

// Need to be used outside the setup
export function useAccvoucherStoreWidthOut() {
  return useAccvoucherHxStore(store);
}

