<template>
  <BasicModal width="925px"
              v-bind="$attrs"
              :title="''"
              @register="register">
    <template #title>
      <div style="display: flex;" class="vben-basic-title">
        <SearchOutlined style="font-size: 29px;"/>
        <span style="line-height: 29px;font-size: 20px;margin-left: 10px;">下游单据</span>
      </div>
    </template>
    <div style="background-color: #158eb8;height: 50px;padding-top: 10px;padding-left:10px;border-radius: 5px;">
      <div style="float: right;margin-right: 5px;">
        <RadioGroup v-model:value="queryV" @change="findAllXySource()" v-show="groupList.length > 0" >
          <Radio style="color: white" :value="it.value" v-for="it in groupList">{{it.title}}</Radio>
        </RadioGroup>
        <button type="button" class="ant-btn ant-btn-me" @click="findAllXySource()"><span>刷新</span></button>
      </div>
    </div>
    <div class="nc-query-open-content">
      <div class="content-body">
        <BasicTable
          :scroll="{ y: 340 }"
          class="alone-basic-table"
          size="small"
          :pagination="false"
          @register="registerTable"
        >
          <template #xyBillStyle="{ record }">
            {{formatName(record.xyBillStyle)}}
          </template>
          <template #syccode="{ record }">
            <a @click="goRuter(record)">{{ record.syccode }}</a>
          </template>
          <template #cwhcode="{ record }">{{formatCwhcode(record.cwhcode !=null? record.cwhcode:record.cwhcode1 )}}</template>
          <template #cunitid="{ record }">{{formatUniqueJiLiang(record.cunitid!=null? record.cunitid:record.cunitid1 )}}</template>
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
import {CaretDownOutlined,SearchOutlined} from '@ant-design/icons-vue';
import {Button,DatePicker, Input, message, Radio, Select, Tag} from 'ant-design-vue';
import {BasicTable, useTable} from '/@/components/Table'
import {hasBlank} from "/@/api/task-api/tast-bus-api";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {JsonTool, ObjTool} from "/@/api/task-api/tools/universal-tools";

import {findByXyOutDataSourrce} from "/@/api/record/stock/stock_taking";

import router from "/@/router";

const RangePicker = DatePicker.RangePicker;
const SelectOption = Select.Option;
const RadioGroup = Radio.Group;
const InputSearch = Input.Search;
const emit = defineEmits(['register', 'query']);

const searchConditon = reactive({
  requirement:'xyccode',value:''
})
const schemaName = ref('')
const queryType = ref('')
const ccodeV = ref('')
const queryV = ref('')
const titlePrefix = ref('')
const groupList = ref([])
const tableSelectedRowKeys = ref([])

function formatUniqueJiLiang(uniqueCodeUser) {
  let str = ''
  jiList.value.forEach(
    function (psn: any) {
      if (psn.id == uniqueCodeUser) {
        str = psn.unitName
      }
    }
  )
  if (str == ''){
    let res = manyList.value.filter(it => it.id == uniqueCodeUser)[0]
    if (res != null) {
      let list = JsonTool.parseObj(res.detail) || []
      if (list.length > 0) {
        str = list[0].unitName + `[${list[0].conversionRate}]`
      }
    }
  }
  return str || ''
}
function formatCwhcode(cwhcode){
  let str = cwhcode
  ckList.value.forEach(item=>{
    if(item.id == cwhcode){
      str = item.ckName
    }
  })
  return str
}
function formatName(type){
  let str = ''
 if(type == 'DBCKD'){
   str = '调拨出库单'
 }else{
   str = '调拨入库单'
 }
  return str
}
const onSelectChange = (record, selected, obj, nativeEvent) => {
  let o = obj.map(it => it.field)
  tableSelectedRowKeys.value = o.filter(v => v != 'field1' && v != 'field2' && v != 'field3')
}
const onCheckChange = (record) => {
  return {disabled: (record.label === '到货日期' || record.label === '到货单号' || record.label === '供应商' || record.label === '仓库')}
}

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
      dataIndex: 'syccode',
      width: '130px',
      align: 'left',
      slots: {customRender: 'syccode'}
    },
    {
      title: '单据日期',
      dataIndex: 'ccodeDate',
      width: '100px',
      align: 'left',
    },
    {
      title: '仓库',
      dataIndex: 'ckName',
      width: '120px',
      align: 'left', slots: {customRender: 'ckName'}
    },
    {
      title: '业务部门',
      dataIndex: 'deptName',
      width: '120px',
      align: 'left', slots: {customRender: 'deptName'}
    },
    {
      title: '业务人员',
      dataIndex: 'psnName',
      width: '120px',
      align: 'left', slots: {customRender: 'psnName'}
    },
    {
      title: '备注',
      dataIndex: 'cmemo',
      width: '120px',
      align: 'left',
    }
  ],
  bordered: true,
  showIndexColumn: true,
})
const tableAll = ref([])
const ckList = ref([])
const jiList = ref([])
const manyList = ref([])

const [register, {closeModal, setModalProps}] = useModalInner(async (o) => {
  setModalProps({minHeight: 420});
  schemaName.value = o.database
  queryType.value = o.type
  ccodeV.value = o.code
  ckList.value = o.datas.ck
  jiList.value = o.datas.ji
  manyList.value = o.datas.many
  findAllXySource()
  //数据变化
  resetTool ()
});

const resetTool =  () => {
  if (queryType.value == 'XHD'){
    titlePrefix.value = '销货单'
    groupList.value =[{value: 'XSCKD',title:'销售出库单'},{value: 'XSFP',title:'销售发票'},{value: 'XHD',title:'销货单'}]
    queryV.value =  groupList.value[0].value
  }else if(queryType.value == 'XSCKD'){
    titlePrefix.value = '销售出库单'
    groupList.value =[{value: 'XSFP',title:'销售发票'},{value: 'XHD',title:'销货单'},{value: 'XSCKD',title:'销售出库单'}]
    queryV.value =  groupList.value[0].value
  }else {
    groupList.value =[]
    titlePrefix.value =''
    queryV.value =''
  }
}
async function findAllXySource() {
  let list = await useRouteApi(findByXyOutDataSourrce,{schemaName: schemaName})({billStyle:queryType.value,code:ccodeV.value,type: queryV.value})
  setTableData(list)
  tableAll.value = list;
}
async function handleOk() {
  closeModal();
  return true;
}

// 跳转对应的单据
function goRuter(data) {
  console.log(data.xyBillStyle)
  if (data.xyBillStyle == 'DBRKD'){
    router.push({
      path: '/kc-transferrk-list',
      query: {
        ccode:data.xyccode,
        accId:schemaName.value,
        type:'DBRKD',
        strDate: data.ccodeDate,
        endDate: data.ccodeDate
      }
    });
  }else{
    router.push({
      path: '/kc-transferck-list',
      query: {
        ccode:data.xyccode,
        accId:schemaName.value,
        type:'DBCKD',
        strDate: data.ccodeDate,
        endDate: data.ccodeDate
      }
    });
  }
  handleOk()
}
const openReFresh = () => {
  if (null != tableAll.value && !hasBlank(searchConditon.requirement) && !hasBlank(searchConditon.value)){
    let list =  tableAll.value.filter(it=>it[searchConditon.requirement].indexOf(searchConditon.value) != -1)
    setTableData(list)
  }else if (tableAll.value != null){
    setTableData(JsonTool.parseProxy(tableAll.value))
  }
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
    text-align: right;
    margin-bottom: 1em;
  }
}
</style>
