<template>
  <BasicModal width="1100px"
              :height="350"
              v-bind="$attrs"
              :title="''"
              @ok="handleOk()"
              @cancel="handleClose()"
              @register="register">
    <template #title>
      <div style="display: flex;" class="vben-basic-title">
        <SelectOutlined style="font-size: 29px;"/>
        <span style="line-height: 29px;font-size: 20px;margin-left: 10px;">来源单据</span>
      </div>
    </template>
    <div class="nc-query-open-content">
      <div class="content-head">
        <AccountPicker theme="three" @reloadTable="dynamicAdReload"/>
        <Button @click="findData" style="float: right;margin-top: -35px;" type="primary"><template #icon><SearchOutlined /></template>选单</Button>
      </div>
      <div class="content-head">
        <label>日期期间：</label>
        <RangePicker v-model:value="sourceDate" style="width: 224px" />
        &nbsp;&nbsp;
        <label>单据类型：</label>
        <Select
          v-model:value="sourceType"
          placeholder=""
          style="width: 20%;border: none"
        >
          <select-option :value="data.value" v-for="data in sourceTypeList">{{data.title}}</select-option>
        </Select>
        &nbsp;&nbsp;
        <label>客户：</label>
        <Select
          v-model:value="sourceCust"
          placeholder=""
          style="width: 20%;border: none;"
        >
          <select-option :value="data.value" v-for="data in sourceCustList">{{data.title}}</select-option>
        </Select>
        &nbsp;
        <a style="font-weight: bold;font-size: 18px;"><LinkOutlined @click="custModalShow" /></a>
      </div>
      <br>
      <div class="content-body">
        <Button @click="delRow" style="float: right;margin-top: -35px;" type="link">删除</Button>
        <BasicTable
          :row-selection="{ type: 'checkbox',selectedRowKeys: tableSelectedRowKeys, onChange: onSelectChange }"
          :scroll="{ y: 350 }"
          class="alone-basic-table"
          size="small"
          @register="registerTable"
        >
          <template #squantity="{ record }">
            {{ record.squantity>0?parseFloat(record.squantity).toFixed(2):'' }}
          </template>
          <template #squantity1="{ record }">
            {{ record.squantity1>0?parseFloat(record.squantity1).toFixed(2):'' }}
          </template>
          <template #squantity2="{ record }">
            {{ record.squantity2>0?parseFloat(record.squantity2).toFixed(2):'' }}
          </template>
        </BasicTable>
      </div>
    </div>

    <ModalPop @throwData="modalData" @register="registerModalPopPage" />
  </BasicModal>
</template>
<script setup="props, { content }" lang="ts">
import {ref} from 'vue';
import {BasicModal, useModal, useModalInner} from '/@/components/Modal';
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {LinkOutlined, SelectOutlined} from '@ant-design/icons-vue';
import {DatePicker, Radio, Select,Button,message} from 'ant-design-vue';
import {BasicTable, useTable} from '/@/components/Table'
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {getCustAll} from "/@/api/record/costomer_data/customer";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import ModalPop from '/@/views/boozsoft/global/popup/customer_info/modalPop.vue';
import {hasBlank} from "/@/api/task-api/tast-bus-api";
import {findByDdateAndType} from "/@/api/record/stock/stock-xhd";

const RangePicker = DatePicker.RangePicker;
const SelectOption = Select.Option;
const RadioGroup = Radio.Group;
const emit = defineEmits(['register', 'query']);
const formItems = ref({
  openOne: 0
})
const database = ref('')
const accId = ref('')
const sourceDate = ref('')
const sourceType = ref('拣货装箱单')
const sourceTypeList = ref([{title:'拣货装箱单',value:'拣货装箱单'},{title:'销售出库单',value:'销售出库单'}])
const sourceCust = ref('')
const sourceCustList:any = ref([])
const tableSelectedRowKeys = ref([])
const tableSelectedRowObjs = ref([])

const [registerModalPopPage, { openModal: openMoalPopPage }] = useModal();

const [registerTable, { setTableData,getSelectRows,getDataSource}] = useTable({
  columns: [
    {
      title: '单据编码',
      dataIndex: 'ccode',
      width: '80px',
    },
    {
      title: '单据日期',
      dataIndex: 'ddate',
      width: '80px',
    }, {
      title: '备注',
      dataIndex: 'cmemo',
      width: '120px',ellipsis: true,
    },
    {
      title: '主数量',
      dataIndex: 'squantity',
      width: '60px',slots: {customRender: 'squantity'}
    },
    {
      title: '数量1',
      dataIndex: 'squantity1',
      width: '60px',slots: {customRender: 'squantity1'}
    },
    {
      title: '数量2',
      dataIndex: 'squantity2',
      width: '60px',slots: {customRender: 'squantity2'}
    },
    {
      title: '业务部门',
      dataIndex: 'deptName',
      width: '80px',
    },
    {
      title: '业务员',
      dataIndex: 'cpersonName',
      width: '80px',
    },
    {
      title: '制单人',
      dataIndex: 'cmakerName',
      width: '80px',
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

const dynamicAdReload = async (obj) => {
  accId.value=obj.accId
  database.value=obj.accountMode
  let custAll=await useRouteApi(getCustAll, {schemaName: obj.accountMode})('')
  sourceCustList.value=[]
  custAll.forEach(a=>{
    sourceCustList.value.push({title:a.custName,value:a.id})
  })
}

const [register, {closeModal, setModalProps}] = useModalInner(async (data) => {
  formItems.value.openOne = data.data.openOne
});

const onSelectChange = (k, o) => {
  tableSelectedRowKeys.value = k
  tableSelectedRowObjs.value = o
}
async function handleOk() {
  if(tableSelectedRowKeys.value.length==0){
    message.error('请选择销售出库单！')
    return false
  }
  let list = getDataSource()
  let datas = list.filter(it => tableSelectedRowKeys.value.indexOf(it.key)>-1)
  emit('throwData', {data:datas,database:database.value,accId:accId.value,sourceCust:sourceCust.value})
  closeModal()
  return true;
}
const {closeCurrent} = useTabs(router);
async function handleClose() {
  if (null != formItems.value.openOne && formItems.value.openOne == 1)
    await closeCurrent()
  closeModal()
}

function custModalShow() {
  openMoalPopPage(true, {
    database: database.value,
    accId: accId.value,
  });
}
function modalData(data) {
  let arr=data[data.length-1]
  sourceCust.value=arr.id
}

// 开始选单
async function findData() {
  if(hasBlank(sourceDate.value)){
    message.error('请选择日期期间！')
    return false
  }else if(hasBlank(sourceCust.value)){
    message.error('请选择客户！')
    return false
  }
  if(sourceType.value=='销售出库单'){
    findByXSCKD()
  }
}

// 获取销售出库单
async function findByXSCKD() {
  setTableData([])
  let map={
    strDate:transformTimestamp(sourceDate.value[0]),
    endDate:transformTimestamp(sourceDate.value[1]),
    cvencode:sourceCust.value,
    billStyle:'XSCKD'
  }
  let data=await useRouteApi(findByDdateAndType, {schemaName: database})(map)
  setTableData(data)
}
function transformTimestamp(timestamp){
  let a = new Date(timestamp).getTime();
  const date = new Date(a);
  const Y = date.getFullYear() + '-';
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  const D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + '  ';
  // const s = date.getSeconds(); // 秒
  const dateString = Y + M + D;
  return dateString;
}

function delRow() {
  if(tableSelectedRowObjs.value.length==0){
    message.error('请选择需要删除的数据！')
    return false
  }
  let list = getDataSource()
  let selectIndex = list.findIndex(it => tableSelectedRowKeys.value.indexOf(it.key)>0)
  list.splice(selectIndex, 1)
  let selectIndex2 = tableSelectedRowKeys.value.findIndex(it => tableSelectedRowKeys.value.indexOf(it)>0)
  tableSelectedRowKeys.value.splice(selectIndex2, 1)
  setTableData(list)

}
</script>
<style lang="less" scoped="scoped">
@import '/@/assets/styles/part-open.less';
@import '/@/assets/styles/alone-basic-table.less';

.nc-query-open-content {
  text-align: center;
  padding: 1%;
  height: 100%;

  .content-head {
    text-align: left;
    margin-bottom: 1em;
  }
}
</style>
