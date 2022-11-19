<template>
  <BasicModal width="950px"
              :height="400"
              v-bind="$attrs"
              :title="''"
              @ok="handleOk()"
              @cancel="handleClose()"
              @register="register">
    <template #title>
      <div style="display: flex;margin:7px;" class="vben-basic-title">
        <SearchOutlined style="font-size: 29px;color: rgb(21, 142, 184)"/>
        <span style="line-height: 29px;font-size: 20px;margin-left: 10px;color: rgb(21, 142, 184)">销售物流送货单生单参照</span>
      </div>
    </template>
    <div class="nc-query-open-content">
      <div style="background-color: #158eb8;height: 50px;padding-top: 10px;padding-left:10px;border-radius: 5px;">
        <div style="float: left;margin-right: 5px;">
          <Select style="width: 100px;" v-model:value="pageParameter.searchConditon.requirement">
            <SelectOption value="ccode">客户名称</SelectOption>
            <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
          </Select>
          <a-input-search placeholder="" v-model:value="pageParameter.searchConditon.value" style="width: 200px; border-radius: 4px" @search="findByTable"/>
          <span style="margin-left: 50px;">
            <RadioGroup v-model:value="pageParameter.dataType" @change="findByTable()">
              <Radio value="XSCKD" style="color: white;">销售出库单</Radio>
            </RadioGroup>
          </span>
        </div>

        <div style="float: right;margin-right: 5px;">
          <button type="button" class="ant-btn ant-btn-me" @click="findByTable"><span>刷新</span></button>
        </div>
      </div>
      <br>
      <div class="content-body">
        <BasicTable
          :row-selection="{ type: 'checkbox',selectedRowKeys: tableSelectedRowKeys, onChange: onSelectChange,getCheckboxProps:rowSelection.getCheckboxProps}"
          :scroll="{ y: 280 }"
          :loading="tableLoading"
          class="alone-basic-table"
          size="small"
          @register="registerTable"
          @row-click="rowClick"
        >
          <template #billStyle="{ record }">
            <span v-if="record.ccode!=undefined">
              销售出库单
            </span>
          </template>
          <template #squantity="{ record }">
            {{ record.squantity>0?parseFloat(record.squantity).toFixed(2):'' }}
          </template>
        </BasicTable>
      </div>
    </div>
  </BasicModal>
</template>
<script setup="props, { content }" lang="ts">
import {reactive, ref} from 'vue';
import {BasicModal, useModal, useModalInner} from '/@/components/Modal';
import {SearchOutlined} from '@ant-design/icons-vue';
import {Button, DatePicker, Radio, Select,message} from 'ant-design-vue';
import {BasicTable, useTable} from '/@/components/Table'
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {hasBlank} from "/@/api/task-api/tast-bus-api";
import {
  findAllByStockSaleousingsTypeAndIyear,
  findByDdateAndType,
  findbyStockSaleousingsCode
} from "/@/api/record/stock/stock-xhd";

const rowSelection = {
  getCheckboxProps: (record) => ({
    disabled: record.billStyle==undefined
  }),
};
const pageParameter = reactive({
  list:'',
  type:'XSCKD',
  dataType:'XSCKD',
  searchConditon: {
    requirement: 'ccode',
    value: '',
  },
})
const RangePicker = DatePicker.RangePicker;
const SelectOption = Select.Option;
const RadioGroup = Radio.Group;
const emit = defineEmits(['register', 'query']);
const formItems = ref({
  openOne: 0
})
const tableLoading = ref(false)
const iyear = ref('')
const database = ref('')
const accId = ref('')
const sourceCust = ref('')
const tableSelectedRowKeys = ref([])
const tableSelectedRowObjs = ref([])
const table1Length = ref(0)

const [registerModalPopPage, { openModal: openMoalPopPage }] = useModal();

const [registerTable, { deleteSelectRowByKey,setTableData,getSelectRows,getDataSource}] = useTable({
  columns: [
    {
      title: '单据类型',
      dataIndex: 'billStyle',
      width: '100px',
      align: 'left',slots: {customRender: 'billStyle'}
    },
    {
      title: '客户名称',
      dataIndex: 'custName',
      width: '140px',
      align: 'left'
    },
    {
      title: '单据日期',
      dataIndex: 'ddate',
      width: '100px',
    }, {
      title: '单据编码',
      dataIndex: 'ccode',
      width: '120px',ellipsis: true,
    },
    {
      title: '备注',
      dataIndex: 'cmemo',
      width: '80px',align: 'right'
    },
    {
      title: '数量合计',
      dataIndex: 'squantity',
      width: '80px',align: 'right',slots: {customRender: 'squantity'}
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
  pagination: false,
})

const onSelectChange = (a,b) => {
  tableSelectedRowKeys.value=a
  tableSelectedRowObjs.value=b
}
function rowClick(a) {
  if(a.id==undefined){
    deleteSelectRowByKey(a.key)
  }
}

//金额格式化
function toThousandFilter(num:any) {
  if (num=='' || num==null){
    return ''
  }
  return (+num || 0).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
}
const filterOption = (input: string, option: any) => {
  return option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}

const [register, {closeModal, setModalProps}] = useModalInner(async (data) => {
  sourceCust.value=data.cvencode
  accId.value=data.dynamicAccId
  database.value=data.dynamicTenantId
  iyear.value=data.iyear
  findByTable()
});

async function findByTable(){
  setTableData([])
  tableLoading.value=true
  let map={
    iyear:iyear.value,
    billStyle:pageParameter.type,
  }
  let data=await useRouteApi(findAllByStockSaleousingsTypeAndIyear, {schemaName: database})(map)
  data=data.filter(a=>a.cvencode==sourceCust.value)
  console.log('审核后的销售出库单='+data.length)
  for (let i = 0; i < 50-data.length; i++) {
    data.push({})
  }
  setTimeout(()=>{
    setTableData(data)
    tableLoading.value=false
  },300)
}

async function handleOk() {
  if(tableSelectedRowObjs.value.length==0){
    return message.error('请选择单据！')
  }
  let list:any=tableSelectedRowObjs.value
  let cinvodeArr=list.map(a=>a.cinvode)
  let batchIdArr=list.map(a=>a.batchId)

  // 封装成对象
  let cin_batchObj:any=[]
  for (let i = 0; i < cinvodeArr.length; i++) {
    let temp:any={}
    temp.cinvode=cinvodeArr[i]
    temp.batchId=batchIdArr[i]
    cin_batchObj.push(temp)
  }

  // es6数组对象去重
  let obj = {};
  cin_batchObj = cin_batchObj.reduce((cur,next) => {
    obj[next.batchId] ? "" : obj[next.batchId] = true && cur.push(next);
    return cur;
  },[]) //设置cur默认类型为数组，并且初始值为空的数组

  // 过滤list中符合同一存货、批次的数据
  let resetList:any=[]
  for (let i = 0; i < cin_batchObj.length; i++) {
    let temp=list.filter(a=>a.cinvode==cin_batchObj[i].cinvode&&a.batchId==cin_batchObj[i].batchId)

    if(temp.length>1){
      let squantity=0
      let baseQuantity=0
      // 合并成一条
      for (let j = 0; j < temp.length; j++) {
        squantity=parseFloat(squantity)+parseFloat(temp[j].squantity)
        baseQuantity=parseFloat(baseQuantity)+parseFloat(temp[j].baseQuantity)
      }
        let obj:any={}
        obj.bcheck=temp[0].bcheck                       // 条形码
        obj.cinvode=temp[0].cinvode                     // 存货编码
        obj.cunitid=temp[0].xsUnitId                   // 计量单位
        obj.baseQuantity=baseQuantity                   // 主数量
        obj.cnumber=squantity                         // 数量
        obj.batchId=temp[0].batchId                     // 批次
        obj.dpdate=temp[0].dpdate                       // 生产日期
        obj.dvdate=temp[0].dvdate                       // 失效日期
        resetList.push(obj)
    }
    else{
      let obj:any={}
      obj.bcheck=temp[0].bcheck                       // 条形码
      obj.cinvode=temp[0].cinvode                     // 存货编码
      obj.cunitid=temp[0].xsUnitId                   // 计量单位
      obj.baseQuantity=temp[0].baseQuantity                   // 主数量
      obj.cnumber=temp[0].squantity                         // 数量
      obj.batchId=temp[0].batchId                     // 批次
      obj.dpdate=temp[0].dpdate                       // 生产日期
      obj.dvdate=temp[0].dvdate                       // 失效日期
      resetList.push(obj)
    }
  }

  emit('throwData', {resetList:resetList,tableSelectedRowObjs:tableSelectedRowObjs.value})
  closeModal()
  return true;
}
const {closeCurrent} = useTabs(router);
async function handleClose() {
  if (null != formItems.value.openOne && formItems.value.openOne == 1)
    await closeCurrent()
  closeModal()
}
</script>
<style lang="less" scoped="scoped">
@import '/@/assets/styles/part-open.less';
@import '/@/assets/styles/alone-basic-table.less';

.nc-query-open-content {
  padding: 1%;
  height: 100%;

  .content-head {
    text-align: left;
    margin-bottom: 1em;
  }
}
</style>
