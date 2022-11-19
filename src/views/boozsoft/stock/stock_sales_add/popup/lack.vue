<template>
  <BasicModal
    width="700px"
    v-bind="$attrs"
    :closable="false"
    @register="register"
    :cancel-text="'确定'"
    @cancel="handleClose()"
    :showOkBtn="false"
  >
    <template #title>
      <div style="height: 30px;width: 100%;background-color: #5f375c;color: white;line-height: 30px;text-align: left;">
        <AppstoreOutlined  style="margin: 0 2px;font-size: 14px;"/>
        <span style="font-size: 14px">{{keywords}}不足</span>
      </div>
    </template>
    <div style="display: inline-flex;justify-content: space-between;width: 100%;">
      <BasicTable @register="registerTable" :dataSource="tableData" :scroll="{y:200}" :class="'a-table-font-size-12'">

      </BasicTable>
    </div>
    <Button @click="check" type="primary" v-show="showCheck">按{{keywords}}出库</Button>
  </BasicModal>
</template>
<script setup="props, { content }" lang="ts">
import {AppstoreOutlined} from '@ant-design/icons-vue'
import {ref} from 'vue';
import {BasicModal, useModalInner} from '/@/components/Modal';
import {
  Form as AForm,
  Input as AInput,
  Select as ASelect,
  Statistic as AStatistic, Button, message
} from 'ant-design-vue';
import {getCurrentAccountName} from "/@/api/task-api/tast-bus-api";
import {BasicTable, useTable} from '/@/components/Table';
import {saveLanMuList} from "/@/api/record/system/accvoucher";
import {useMessage} from "/@/hooks/web/useMessage";
const { createConfirm } = useMessage()
  const ASelectOption = ASelect.Option;
  const AInputSearch = AInput.Search;
  const AStatisticCountdown = AStatistic.Countdown;
  const AFormItem = AForm.Item;
  const emit=defineEmits(['register','modify']);
  const formItems:any = ref({})
  const database = ref(getCurrentAccountName(true));
  const tableData = ref([]);
  const solutions = ref([]);
  const solution = ref(false)
  const showCheck = ref(false)
  const CrudApi:any = {
    columns: [
      {
        title: '存货编码',
        dataIndex: 'stockNum',
        ellipsis: true,
        align: 'center',width:100
      },
      {
        title: '存货名称',
        dataIndex: 'stockName',
        ellipsis: true,
        align: 'center',width:100
      },{
        title: '规格型号',
        dataIndex: 'stockGgxh',
        ellipsis: true,
        align: 'center',width:80
      },{
        title: '计量单位',
        dataIndex: 'unitName',
        ellipsis: true,
        align: 'center',width:80
      },{
        title: '单据数量',
        dataIndex: 'baseQuantity',
        ellipsis: true,
        align: 'right',width:80
      },{
        title: '不足数量',
        dataIndex: 'lackBaseQuantity',
        ellipsis: true,
        align: 'right',width:80
      },{
        title: '批号',
        dataIndex: 'batchId',
        ellipsis: true,
        align: 'center',width:80
      }
    ]
  }
  const [registerTable, { reload,setTableData }] = useTable({
    columns: CrudApi.columns,
    bordered: true,
    pagination:false,
  })
  const keywords = ref('可用量')
  const [register, { closeModal,setModalProps }] = useModalInner( async (data) => {
    setModalProps({minHeight: 250});
    tableData.value=data.data
    tableData.value=data.data
    solution.value = false
    keywords.value = (data?.mode=='xcl'?'现存量':'可用量')
    showCheck.value =  data.data.filter(it=>parseFloat(it.baseQuantity) != parseFloat(it.lackBaseQuantity)).length > 0

  });
  function handleClose() {
      // if (solution.value)emit('modify',solutions.value)
        return true;
  }
  const check = () => {
    let a = tableData.value.filter(it=>parseFloat(it.baseQuantity) != parseFloat(it.lackBaseQuantity))
    if (a.length > 0){
      createConfirm({
        iconType: 'warning',
        title: `按${keywords.value}出库`,
        content: `您确定要按${keywords.value}出库吗？确定后请重新保存！`,
        onOk: async () => {
          solution.value = true
          solutions.value =  a.map(it=>{
            it['quantity'] = Math.abs( parseFloat(it.baseQuantity) - parseFloat(it.lackBaseQuantity))
            return it;
          })
          emit('modify',solutions.value)
          handleClose()
        }
      });

    }else {
      solution.value = false
      solutions.value = []
    }
  }
</script>
<style lang="less" scoped>
:deep(.ant-checkbox){
  margin-top: -8px;
}
:deep(.ant-select-selector), :deep(.ant-input-affix-wrapper), :deep(.ant-input),:deep(.ant-picker),:deep(.ant-input-number) {
  border: none !important;
  border-bottom: 1px solid #bdb9b9 !important;
  background: none;
}
.nc-open-content {
  background-image: url(/@/assets/images/homes/bg-pattern.png);
  background-repeat: no-repeat;
  background-position: 66% 8%;
  background-size: contain;
  position: relative;

  .border-div {
    position: relative;
    border: 1px #a29f9f solid;
    margin: 20px 10px;
    padding: 2.5%;

    > span {
      display: block;
      width: 80px;
      text-align: center;
      background-color: white;
      position: absolute;
      left: 50px;
      top: -10px;
      color: #888888;
      font-size: 12px;
      font-weight: bold;
    }
    :deep(.account-picker){
      >div{
        text-align: left;
      }
    }
  }

}

.right-btns{
  width: 150px;background-color: #f1f1f1;padding: 10% 4%;height: 536px;
  :deep(.ant-btn-primary:hover){
    border: 1px solid #5f375c;
  }
}
:global(.ant-modal-header) {
  padding: 10px 0 !important;
}
:global(.ant-modal-close-x){
  height: 30px !important;
  color: white;
}

.a-table-font-size-12 :deep(td),
.a-table-font-size-12 :deep(th) {
  font-size: 13px !important;
  padding: 2px 8px !important;
  border-color: #aaaaaa !important;
  font-weight: 600;
}
</style>
