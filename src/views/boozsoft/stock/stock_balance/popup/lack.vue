<template>
  <BasicModal
    width="900px"
    v-bind="$attrs"
    :closable="false"
    @register="register"
    :showOkBtn="false"
  >
    <template #title>
      <div style="height: 30px;width: 100%;background-color: #5f375c;color: white;line-height: 30px;text-align: left;">
        <AppstoreOutlined  style="margin: 0 2px;font-size: 14px;"/>
        <span style="font-size: 14px">&emsp;{{ queryType=='xcl'?'现存量':'可用量' }}不足</span>
      </div>
    </template>
    <div style="display: inline-flex;justify-content: space-between;width: 100%;">
      <BasicTable @register="registerTable" :dataSource="tableData" :scroll="{y:150}" :class="'a-table-font-size-12'">
        <template #baseQuantity="{ record }">
          {{ toThousandFilter(record.baseQuantity) }}
        </template>
        <template #lackBaseQuantity="{ record }">
          {{ toThousandFilter(record.lackBaseQuantity) }}
        </template>
      </BasicTable>
    </div>
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
  Statistic as AStatistic,
} from 'ant-design-vue';
import {getCurrentAccountName} from "/@/api/task-api/tast-bus-api";
import {BasicTable, useTable} from '/@/components/Table';
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {findCangkuJoinName} from "/@/api/record/stock/stock-cangku-level-record";

  const ASelectOption = ASelect.Option;
  const AInputSearch = AInput.Search;
  const AStatisticCountdown = AStatistic.Countdown;
  const AFormItem = AForm.Item;
  const emit=defineEmits(['register']);
  const formItems:any = ref({})
  const database = ref(getCurrentAccountName(true));
  const tableData = ref([]);
  const queryType = ref('');

  const CrudApi:any = {
    columns: [
      {
        title: '仓储位置',
        dataIndex: 'cangkuName',
        ellipsis: true,
        align: 'left',width:60
      },
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
        align: 'right',width:80,slots: {customRender: 'baseQuantity'}
      },{
        title: '不足数量',
        dataIndex: 'lackBaseQuantity',
        ellipsis: true,
        align: 'right',width:80,slots: {customRender: 'lackBaseQuantity'}
      },{
        title: '批号',
        dataIndex: 'batchId',
        ellipsis: true,
        align: 'left',width:80
      }
    ]
  }
  const [registerTable, { reload,setTableData }] = useTable({
    columns: CrudApi.columns,
    bordered: true,
    pagination:false,
  });

  // 数据库模式名称
  const dynamicTenantId = ref('')
  const [register, { closeModal }] = useModalInner( async (data) => {
    dynamicTenantId.value=data.dynamicTenantId
    for (let i = 0; i < data.data.length; i++) {
      data.data[i].cangkuName=await getCKName(data.data[i].cwhcode)
    }
    tableData.value=data.data
    queryType.value=data.queryType
  });

async function getCKName(id) {
  let str=''
  let cangkuJoinName=await useRouteApi(findCangkuJoinName,{schemaName: dynamicTenantId})(  {id:id})
  if(cangkuJoinName.length>0){
    str=cangkuJoinName[0].cangkuRecordJoinName
  }
  return str
}
//金额格式化
function toThousandFilter(num:any) {
  if (num=='' || num==null){
    return ''
  }
  return (+num || 0).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
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
