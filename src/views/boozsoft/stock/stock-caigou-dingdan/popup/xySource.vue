<template>
  <BasicModal width="700px"
              v-bind="$attrs"
              :title="''"
              @register="register">
    <template #title>
      <div style="display: flex;margin-left: 10px;margin-top: 5px;" class="vben-basic-title">
        <SearchOutlined style="font-size: 29px;color: rgb(21, 142, 184)"/>
        <span style="line-height: 29px;font-size: 20px;margin-left: 10px;color: rgb(21, 142, 184)">采购订单下游单据</span>
      </div>
    </template>
    <div class="nc-query-open-content">
      <div style="background-color: #158eb8;height: 50px;padding-top: 10px;padding-left:10px;border-radius: 5px;">
        <div style="float: left;margin-right: 5px;">
          <span>
            <RadioGroup v-model:value="pageParameter.xytype" @change="findAllXySource">
              <Radio value="CGDHD" style="color: white;">采购到货单</Radio>
              <Radio value="CGRKD" style="color: white;">采购入库单</Radio>
              <Radio value="CGFP" style="color: white;">采购发票</Radio>
            </RadioGroup>
          </span>
        </div>

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
            {{ record.xyBillStyle=='CGRKD'?'采购入库单':record.xyBillStyle=='CGFP'?'采购发票':record.xyBillStyle=='CGDHD'?'采购到货单':record.xyBillStyle=='CGJSD'?'采购结算单':'' }}
          </template>
          <template #xyccode="{ record }">
            <a @click="goRuter(record)">{{ record.xyccode }}</a>
          </template>
          <template #baseQuantity="{ record }">
            {{ toThousandFilter(record.baseQuantity) }}
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
import {
  findByXyDataMainSourrceMap,
  findByXyDataSourrceMap,
  findByXyDataSourrceSearch
} from "/@/api/record/stock/stock-xy-source";
import router from "/@/router";
import {findCangkuJoinName} from "/@/api/record/stock/stock-cangku-level-record";
import {hasBlank} from "/@/api/task-api/tast-bus-api";
import {findJieSuanByCaigouDaoHuo} from "/@/api/record/stock/stock-jiesuan";
import {findByStockAccId} from "/@/api/record/system/stock-account";
import {useTabs} from "/@/hooks/web/useTabs";

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
  sytype:'CGDD',
  xytype:'CGDHD',
  searchConditon: {
    requirement: 'ccode',
    value: '',
  },
})

const tableSelectedRowKeys = ref([])
const {closeCurrent,closeToFullPaths} = useTabs();
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
    }, {
      title: '单据日期',
      dataIndex: 'xyccodeDate',
      width: '120px',
      align: 'left',
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
  if(pageParameter.xytype=='CGJSD'){
    list.map(it=>{it.xyBillStyle='CGJSD';it.xyccode=it.ccode;it.xyccodeDate=it.ddate;it.cwhcode='';return it;})
  }
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
//金额格式化
function toThousandFilter(num:any) {
  if (num=='' || num==null){
    return ''
  }
  return (+num || 0).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
}
// 跳转对应的单据
async function goRuter(data) {
  if(pageParameter.xytype=='CGRKD'){
    await closeToFullPaths('/kc-cgDepot')
    router.push({path: 'kc-cgDepot',query: {ccode:data.xyccode,co: databaseCo.value}});
  }else if(pageParameter.xytype=='CGFP'){
    await closeToFullPaths('/cg-bill')
    router.push({path: 'cg-bill',query: {ccode:data.xyccode,co: databaseCo.value}});
  }else if(pageParameter.xytype=='CGDHD'){
    await closeToFullPaths('/cg-arrive')
    router.push({path: 'cg-arrive',query: {ccode:data.xyccode,co: databaseCo.value}});
  }
  handleOk()
}
</script>
<style lang="less" scoped="scoped">
@import '/@/assets/styles/part-open.less';
@import '/@/assets/styles/alone-basic-table.less';

.nc-query-open-content {
  padding: 1%;
  height: 100%;
}
</style>
