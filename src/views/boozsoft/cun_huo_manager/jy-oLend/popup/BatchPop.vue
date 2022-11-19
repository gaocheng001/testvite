<template>
  <BasicModal
    :width="1000"
    title="批次"
    :showOkBtn="true"
    :showCancelBtn="true"
    @register="register"
  >
    <HelloForm></HelloForm>
    <BatchTable></BatchTable>
<!--    <BasicTable-->
<!--      :row-key="r=>r.field"-->
<!--      :scroll="{ y: 290 }"-->
<!--      class="alone-basic-table"-->
<!--      size="small"-->
<!--      :rowSelection="{ type: 'checkbox',onChange:abcd }"-->
<!--      @register="registerTable"-->
<!--    >-->
<!--      <template #ztckQuantity>-->
<!--        <div>1</div>-->
<!--      </template>-->

<!--    </BasicTable>-->


<!--    <div>{{ abc }}</div>-->
    <template #footer>

    </template>
  </BasicModal>
</template>
<script setup lang="ts">
import {inject, nextTick, onMounted, provide, ref} from 'vue'
import {BasicModal, useModalInner} from '/@/components/Modal'
import {useMessage} from "/@/hooks/web/useMessage";
import HelloForm from "./components/HelloForm.vue";
const {createErrorModal, createWarningModal} = useMessage()
import {Select,Input as AInput, Button, Tabs, Radio } from 'ant-design-vue';
import {findXianCunBatch} from "/@/api/record/stock/stock-currents";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {findStockColumnList} from "/@/api/record/stock/stock-caigou";
import {lanMuData} from "/@/views/boozsoft/cun_huo_manager/jy-oLend/component/DynamicForm";
import {BasicTable, useTable} from '/@/components/Table'
import BatchTable from "/@/views/boozsoft/cun_huo_manager/jy-oLend/popup/components/BatchTable.vue";
const SelectOption = Select.Option;
const AInputSearch = AInput.Search;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
// 上传文件
const uploading = ref(false)
const fileList = ref([])

const emit = defineEmits(['register', 'save'])
const pageSchemaName = ref('')
const isActiveImpExcel = ref(false)
const queryParameter = ref({})
const record=ref()

provide('record',record)
const [register, {closeModal}] = useModalInner((data) => {
  record.value = data.record
  setTimeout(async ()=>{
    const findXianCunBatchRouteApi=useRouteApi(findXianCunBatch, {schemaName: dynamicTenantId.value})
    let res = await findXianCunBatchRouteApi({
      cwhcode:data.cwhcode,
      code:data.code,
      year:data.year
    })
    setTableData(res)
    console.log(res)
  },1000)

})

const dynamicTenantId=inject('dynamicTenantId')
const abc=ref()


const [registerTable, {getDataSource, setTableData}] = useTable({
  columns: [
    {
      title: '批号',
      dataIndex: 'columnType',
      width: '75px',
      slots: {customRender: 'columnType'}
    },
    {
      title: '主计量',
      dataIndex: 'cunitid',
      width: '130px',
      align: 'left',
      slots: {customRender: 'cunitid'}
    }, {
      title: '现存量',
      dataIndex: 'baseQuantity',
      width: '120px',
      align: 'left',
      slots: {customRender: 'baseQuantity'}
    },
    {
      title: '可用量',
      dataIndex: 'ztckQuantity',
      width: '140px',
      align: 'left',
      slots: {customRender: 'ztckQuantity'}
    },
    {
      title: '出库数量',
      dataIndex: 'chuKuShuLiang',
      width: '140px',
      slots: {customRender: 'ztckQuantity'}
    }, {
      title: '生产日期',
      dataIndex: 'dpdate',
      width: '100px',
      slots: {customRender: 'dpdate'}
    }, {
      title: '失效日期',
      dataIndex: 'dvdate',
      width: '100px',
      slots: {customRender: 'dvdate'}
    }
  ],
  bordered: true,
  showIndexColumn: true,
  pagination: {
    pageSize: 50,
    showSizeChanger: true,
    pageSizeOptions: ['50'],
    showTotal: t => `总共${t}条数据`
  },
})

function abcd(a,b,c){
  console.log(a)
  debugger

}
</script>
