<template>
  <BasicModal width="700px"
              v-bind="$attrs"
              :title="''"
              @register="register">
    <template #title>
      <div style="display: flex;margin-left: 10px;margin-top: 5px;" class="vben-basic-title">
        <SearchOutlined style="font-size: 29px;color: rgb(21, 142, 184)"/>
        <span style="line-height: 29px;font-size: 20px;margin-left: 10px;color: rgb(21, 142, 184)">组装拆卸单下游单据</span>
      </div>
    </template>
    <div class="nc-query-open-content">
      <div style="background-color: #158eb8;height: 50px;padding-top: 10px;padding-left:10px;border-radius: 5px;">
        <div style="float: right;margin-right: 5px;">
          <button type="button" class="ant-btn ant-btn-me" @click="findAllXySource"><span>刷新</span></button>
        </div>
      </div>
      <div class="content-body" style="margin-top: 5px;">
        <BasicTable
          :scroll="{ y: 240 }"
          :loading="tableLoading"
          class="alone-basic-table"
          size="small"
          @register="registerTable"
        >
          <template #xyBillStyle="{ record }">
            {{ record.xyBillStyle=='QTRKD'?'其他入库单':'' }}
          </template>
          <template #xyccode="{ record }">
            <a @click="goRuter(record)">{{ record.xyccode }}</a>
          </template>
        </BasicTable>
      </div>
    </div>
    <template #footer>
      <div style="height: 35px">
        <div style="float: right">
          <Button @click="handleOk" type="primary">关闭</Button>
        </div>
      </div>
    </template>
  </BasicModal>
</template>
<script setup="props, { content }" lang="ts">
import {reactive, ref} from 'vue';
import {BasicModal, useModalInner} from '/@/components/Modal';
import {SearchOutlined} from '@ant-design/icons-vue';
import {Button, DatePicker, Radio, Select} from 'ant-design-vue';
import {BasicTable, useTable} from '/@/components/Table'
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {findByXyDataMainSourrceMap} from "/@/api/record/stock/stock-xy-source";
import router from "/@/router";
import {findCangkuJoinName} from "/@/api/record/stock/stock-cangku-level-record";
import {useTabs} from "/@/hooks/web/useTabs";
import {findByStockAccId} from "/@/api/record/system/stock-account";

const RangePicker = DatePicker.RangePicker;
const SelectOption = Select.Option;
const RadioGroup = Radio.Group;

const emit = defineEmits(['register', 'query']);
const tableLoading: any = ref(false);
const formItems: any = ref({});
const schemaName = ref('')
const ccode = ref('')
const pageParameter = reactive({
  list:'',
  syccode:'',
  sytype:'ZZCXD',
  xytype:'QTRKD',
  searchConditon: {
    requirement: 'ccode',
    value: '',
  },
})

const [registerTable, {getDataSource, setTableData}] = useTable({
  columns: [
    {
      title: '单据类型',
      dataIndex: 'xyBillStyle',
      width: '90px',
      slots: {customRender: 'xyBillStyle'}
    },
    {
      title: '单据编码',
      dataIndex: 'xyccode',
      width: '150px',
      align: 'left',
      slots: {customRender: 'xyccode'}
    },
    {
      title: '仓库',
      dataIndex: 'cwhcodeName',
      width: '140px',
      align: 'left',
    },
    {
      title: '业务员',
      dataIndex: 'psnName',
      width: '100px',
      align: 'left',ellipsis: true,
    },
    {
      title: '业务部门',
      dataIndex: 'deptName',
      width: '100px',
      align: 'left',ellipsis: true,
    },{
      title: '备注',
      dataIndex: 'cmemo',
      width: '140px',ellipsis: true,
    }
  ],
  bordered: true,
  showIndexColumn: true,
  pagination: false
})
const databaseCo=ref('')
const [register, {closeModal, setModalProps}] = useModalInner(async (o) => {
  formItems.value = {}
  schemaName.value = o.database
  ccode.value = o.ccode
  let dataBaseInfo=await findByStockAccId(o.database.substring(0,o.database.length-5))
  databaseCo.value=dataBaseInfo?.coCode
  findAllXySource()
  setModalProps({minHeight: 200});
});

async function findAllXySource() {
  tableLoading.value=true
  pageParameter.syccode=ccode.value
  let list = await useRouteApi(findByXyDataMainSourrceMap,{schemaName: schemaName})(pageParameter)
  let tableLength=0
  for (let i = 0; i < list.length; i++) {
    list[i].cwhcodeName=await getCKName(list[i].cwhcode)
    tableLength++
  }
  if(tableLength==list.length){
    tableLoading.value=false
    let len = list.length
    for (let i = 0; i < (25 - len); i++) {
      list.push({})
    }
    setTableData(list)
  }
}
async function getCKName(id) {
  let str=''
  let cangkuJoinName=await useRouteApi(findCangkuJoinName,{schemaName: schemaName})(  {id:id})
  if(cangkuJoinName.length>0){
    str=cangkuJoinName[0].cangkuRecordJoinName
  }
  return str
}
async function handleOk() {
  closeModal();
  return true;
}
const {closeCurrent,closeToFullPaths} = useTabs();
// 跳转对应的单据
async function goRuter(data) {
  await closeToFullPaths('/kc-qtDepot')
  setTimeout(()=>{
    router.push({path: 'kc-qtDepot',query: {type:'info',ccode:data.xyccode,co: databaseCo.value}});
  },1000)
  handleOk()
}
</script>
<style lang="less" scoped="scoped">
@import '/@/assets/styles/part-open.less';
@import '/@/assets/styles/alone-basic-table.less';

.nc-query-open-content {
  padding: 1%;
  height: 100%;

  .content-head {
    text-align: right;
    margin-bottom: 1em;
  }
}
</style>
