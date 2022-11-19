<template>
  <BasicModal
    width="1000px"
    v-bind="$attrs"
    :ok-text="'确定'"
    :showOkBtn="showNext"
    @ok="handleOk()"
    @cancel="handleClose()"
    @register="register"
    :canFullscreen="false"
  >
    <template #title>
      <div
        style="height: 30px;width: 100%;background-color: #5f375c;color: white;line-height: 30px;text-align: left;">
        <AppstoreOutlined style="margin: 0 2px;font-size: 14px;"/>
        <span style="font-size: 14px">存货管理</span><!---->
      </div>
    </template>
    <div class="nc-open-content" style="height: 100%">
      <div class="content-title">
        <div><span></span></div>
        <div>
          <SecondaryTitle :iconType="'query'">选择销售出库单</SecondaryTitle>
        </div>
        <div></div>
      </div>


      <div class="content-up"  style="background-color: #158eb8;height: 50px;padding-top: 10px;padding-left:10px;border-radius: 5px;display: inline-flex;justify-content: space-between;">
        <AccountPicker theme="three" @reloadTable="dynamicAdReload"/>
        <div>
          <label>仓库：</label>
          <Select
            v-model:value="formItems.cwhcode"
            style="width: 140px;border: none"
            :filter-option="filterOption"
            :options="cangkuList"
          > <template #option="{ value: val, label ,title }">{{ title }}</template></Select>
          <span class="red_span2"><PaperClipOutlined @click="openSelectContent('cwhcode')"/></span>
          <label>日期：</label>
          <DatePicker v-model:value="formItems.dates[0]"  style="width: 114px;"  format="YYYY-MM-DD"  valueFormat="YYYY-MM-DD" />      <span>~  </span>
          <DatePicker v-model:value="formItems.dates[1]"  style="width: 114px;"  format="YYYY-MM-DD"  valueFormat="YYYY-MM-DD" />
<!--          <RangePicker
            :placeholder="['','']"
            v-model:value="formItems.dates" valueFormat="YYYY-MM-DD"
            style="width: 250px;text-align-last: center"
          />-->
          &nbsp;
          <Button @click="query">
<!--     type="primary"       <template #icon><SearchOutlined /></template>-->
            选单
          </Button>
        </div>

      </div>
      <div class="content-down" >
<!--        <div>
          <span>销售出库单据列表</span>
          <Button size="small" @click="delRow">删除</Button>
        </div>-->
        <BasicTable
          :row-key="r=>r.ccode"
          :row-selection="{ type: 'checkbox',fixed: true,selectedRowKeys: tableSelectedRowKeys, onSelect: onSelectChange ,onSelectAll: onSelectChange2,getCheckboxProps: onCheckChange}"
          :scroll="{ y: 340 }"
          class="alone-basic-table"
          size="small"
          @register="registerTable">
<!--
          <template #xyccode="{ record }">
            <a @click="goRuter(record)">{{ record.xyccode }}</a>
          </template>-->
        </BasicTable>
      </div>
    </div>
    <StockCangKuModalPop @register="registerStockCangKuModalPage" @throwData="modalData"/>
  </BasicModal>
</template>
<script setup="props, {content}" lang="ts">
import {nextTick, ref, unref} from 'vue';
import {BasicModal, useModal, useModalInner} from '/@/components/Modal'
import {useMessage} from "/@/hooks/web/useMessage";
import {DatePicker, Button, Radio, Select} from 'ant-design-vue';
import {SearchOutlined,PaperClipOutlined, AppstoreOutlined} from '@ant-design/icons-vue';
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {hasBlank} from "/@/api/task-api/tast-bus-api";
import StockCangKuModalPop from "/@/views/boozsoft/stock/stock_cangku/popup/stockCangKuModalPop.vue";

import {
  findBillLastDate,
  findAllJhzxByDate,
} from "/@/api/record/stock/stock-xhd";
import {
  findBillCode,
} from "/@/api/record/stock/stock-jhzx";
import router from "/@/router";
import {useTabs} from "/@/hooks/web/useTabs";
import {findStockPeriodInfoByYm} from "/@/api/record/group/im-unit";
import {useTable,BasicTable} from "/@/components/Table";
import {findStockCaiGouList} from "/@/api/record/stock/stock-caigou";

const {createWarningModal} = useMessage()
const RadioGroup = Radio.Group
const RadioButton = Radio.Button
const SelectOption = Select.Option
const RangePicker = DatePicker.RangePicker

const emit = defineEmits(['register'])
const [registerStockCangKuModalPage, {openModal: openStockCangKuModalPage}] = useModal();
const formItems = ref({
  id: null,
  dates: [],
  cwhcode: 'all',
  codes: [],
  cvencodes: [],
  ccode: '',
  ddate: '',
  openOne: 0,
  cdepcode: '',
  kgUserId: ''
})
const cangkuList = ref([])
const step = ref(0)
const isEdit = ref(true)
const showNext = ref(true)

const selectModel = ref({})
const dynamicTenant = ref('')
const thisEditType = ref('')
const dynamicAdReload = async (e) => {
  dynamicTenant.value = e
  reload()
}
import { useCompanyOperateStoreWidthOut } from '/@/store/modules/operate-company';
import {DateTool} from "/@/api/task-api/tools/universal-tools";
import {
  getByStockBalanceTask,
  stockBalanceTaskEditNewTime,
  stockBalanceTaskSave
} from "/@/api/record/stock/stock_balance";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import SecondaryTitle from "/@/views/boozsoft/stock/stock_piliang/popup/SecondaryTitle.vue";
const [register, {closeModal, setModalProps}] = useModalInner(async (data) => {
  step.value = 0
  formItems.value.openOne = data.data.openOne
  setModalProps({minHeight: 300});
  setTableData([])
  tableSelectedRowKeys.value = []
  // 获取最新订单号 与 业务日期

})

const reload = () => {
  nextTick(async ()=>{
    let busDate = useCompanyOperateStoreWidthOut().getLoginDate;
    if (await checkBusDate(busDate)){
      showNext.value = true
      selectModel.value = (await useRouteApi(findStockCaiGouList, {schemaName: dynamicTenant.value.accountMode})('warehouse,dept,user,operator,cust,stock'))
      cangkuList.value = [{value: 'all',title: '默认全部',label: '默认全部'}]
      cangkuList.value.push(...(selectModel.value['warehouse']))
      let longV = (24 * 60 * 60 * 1000) * -30
      let s = DateTool().offsetToStr(new Date(busDate),longV).substring(0,10)
      formItems.value.dates = [s,busDate]
    }
  })
}

async function checkBusDate(date) {
  let dates = date.split('-')
  let list = await findStockPeriodInfoByYm({code:dynamicTenant.value.target.id,date: date})
  formItems.value.ddate = date
  if (list.length == 0){
    createWarningModal({title: "温馨提示",content: '当年度暂未创建，不能新增销货单，请先创建该年度'})
    return false;
  }else {
    if (list.filter(it=>it.istock == '1').length == list.length){
      createWarningModal({title: "温馨提示",content: '当年度已经全部结账，不能新增销货单，请切换公司代码或年度'})
      return false;
    }else if(list.filter(it=>it.stockMonth == dates[1] && it.istock == '1').length > 0){ // 本年月结账
      // 得到当年最后一张销货单日期
      let n =  (await useRouteApi(findBillLastDate, {schemaName: dynamicTenant.value.accountMode})({year: dates[0],type:"XHD"}))
      formItems.value.ddate = n
    }
  }
  return true;
}

async function generateCode(date) {
  return await useRouteApi(findBillCode, {schemaName: dynamicTenant.value.accountMode})({
    type: "JHZXD",
    date: date,
    prefix: "JH",key: '3-11'
  })
}
async function handleOk() {
     showNext.value = false
    let list = getDataSource().filter(it=>tableSelectedRowKeys.value.indexOf(it.ccode) != -1)
    if (hasBlank(formItems.value.dates)) {
      createWarningModal({title: '温馨提醒', content: "日期为必选项！"});
      showNext.value = true
      return false;
    } else if (hasBlank(formItems.value.cwhcode)) {
      createWarningModal({title: '温馨提醒', content: "仓库为必选项！"});
      showNext.value = true
      return false;
    }else if (hasBlank(list)){
      createWarningModal({title: '温馨提醒', content: "请选择中单据！"});
      showNext.value = true
      return false;
    }
    formItems.value.codes = [...new Set(list.map(it=>it.ccode))]
    formItems.value.cvencodes = list.map(it=>it.cvencode)
    formItems.value.codeDates = list.map(it=>it.ddate)
    let busDate = useCompanyOperateStoreWidthOut().getLoginDate
    formItems.value.ddate=busDate
    // 判断是否有人锁定
    let codes = []
    for (let i = 0; i < formItems.value.codes.length; i++) {
      const c = formItems.value.codes[i];
      if (await tempCheck(c)) codes.push(c)
    }
    if (codes.length > 0){
      createWarningModal({title: '温馨提示',content: '操作员'+(opens.value.join())+'正在对当前账套进行拣货装箱处理，以下单号['+codes.join()+']正在参与,不能进行单据新增业务操作，请销后再试！'})
      return false
    }else {
      opens.value = []
      formItems.value.codes.map(async (s)=>{ // 已存在不进行添加操作
        if (existeds.value.indexOf(s) == -1)await tempTaskSave(s)
      })
    }
    formItems.value.ccode = await generateCode(busDate)
    emit('save', {parm: unref(formItems), tenant: dynamicTenant.value,selectModel: selectModel.value,taskIds: taskInfo.value})
    closeModal()
}
const {closeCurrent} = useTabs(router);
async function handleClose() {
    if (null != formItems.value.openOne && formItems.value.openOne == 1)
      await closeCurrent()
    closeModal()
}
const filterOption = (input: string, option: any) => {
  return option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}
const taskInfo = ref([])
const opens = ref([])
const existeds = ref([])

async function tempCheck(code){
  let year= (formItems.value.ddate.substring(0,4))
  let taskData=await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenant.value.accountMode })({iyear:year,name:'销售出库单',method:'审核',recordNum:code})
  if(!hasBlank(taskData)){
    // 任务不是当前操作员的
    if(taskData[0].caozuoUnique!==useUserStoreWidthOut().getUserInfo.username){
      opens.value.push(taskData[0].caozuoUnique)
      return  true;
    }else{
      await useRouteApi(stockBalanceTaskEditNewTime, { schemaName: dynamicTenant.value.accountMode })(taskData[0].id)
      taskInfo.value.push(taskData[0].id)
      existeds.value.push(code)
      return  false;
    }
  }else {
    return  false;
  }
}

async function tempTaskSave(code) {
    await useRouteApi(stockBalanceTaskSave, { schemaName: dynamicTenant.value.accountMode })({iyear:(formItems.value.ddate.substring(0,4)),userName:useUserStoreWidthOut().getUserInfo.username,functionModule:'销售出库单',method:'审核',recordNum:code,caozuoModule:'stock'})
    .then((a)=>{
      taskInfo.value.push(a.id)
    })
}
const openSelectContent = (type) => {
  thisEditType.value = type
  switch (type) {
    case 'cwhcode':
      openStockCangKuModalPage(true, {
        database: dynamicTenant.value.accountMode,
      })
      break;
  }
}

const modalData = (o) => {
  if (thisEditType.value == 'cinvodes' || thisEditType.value == 'cvencodes' || thisEditType.value == 'cvencodesJs'){
    formItems.value[thisEditType.value] = o.map(it=>it.id)
  }else {
    formItems.value[thisEditType.value] = thisEditType.value == 'cwhcode' ? o[0].id : thisEditType.value == 'cdepcode' ? o.uniqueCode : o.id
  }
}

const tableSelectedRowKeys = ref([])

const onSelectChange = (record, selected, obj, nativeEvent) => {
  let o = obj.map(it => it.ccode)
  tableSelectedRowKeys.value = o
}
const onSelectChange2 = (selected, selectedRows, changeRows) => {
  if (selected) {
    tableSelectedRowKeys.value = selectedRows.map(item => item.ccode)
  } else {
    tableSelectedRowKeys.value = []
  }
}
const onCheckChange = (record) => {
  return {disabled: false}
}

const [registerTable, {getDataSource, setTableData}] = useTable({
  columns: [
 /*   {
      title: '单据类型',
      dataIndex: 'billStyle',
      width: '120px',
      align: 'left',
      slots: {customRender: 'billStyle'}
    },*/
    {
      title: '单据编码',
      dataIndex: 'ccode',
      width: '120px',
      align: 'left',
      slots: {customRender: 'ccode'}
    }, {
      title: '单据日期',
      dataIndex: 'ddate',
      width: '90px',
      align: 'left',
    },{
      title: '仓库',
      dataIndex: 'cwhcode',
      width: '90px',
      align: 'left',format: (v,o)=>selectModel.value['warehouse']?.filter(it=>o.cwhcode == it.id)[0]?.ckName
    },{
      title: '客户名称',
      dataIndex: 'cvencode',
      width: '150px',
      align: 'left',
      format: (v,o)=> selectModel.value['cust']?.filter(it=>o.cvencode == it.value)[0]?.label
    },{
      title: '业务部门',
      dataIndex: 'cdepcode',
      width: '120px',
      align: 'left',
      format: (v,o)=>
         (selectModel.value['dept']?.filter(it=>o.cdepcode == it.value)[0]?.label || '')
    },{
      title: '业务员',
      dataIndex: 'cpersoncode',
      width: '120px',
      align: 'left',
      format: (v,o)=> (selectModel.value['user']?.filter(it=>o.cpersoncode == it.value)[0]?.label||'')
    },{
      title: '备注',
      dataIndex: 'cmemo',
      width: '120px',
      align: 'left',
      ellipsis: true,
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

const query = async () => {
  if (hasBlank(formItems.value.dates)) {
    createWarningModal({title: '温馨提醒', content: "日期为必选项！"});
    showNext.value = true
    return false;
  } else if (hasBlank(formItems.value.cwhcode)) {
    createWarningModal({title: '温馨提醒', content: "仓库为必选项！"});
    showNext.value = true
    return false;
  }else {
    setTableData([])
    let map={
      strDate: formItems.value.dates[0],
      endDate: formItems.value.dates[1],
      cwhcode:formItems.value.cwhcode,
      billStyle:'XSCKD'
    }
    let data=await useRouteApi(findAllJhzxByDate, {schemaName: dynamicTenant.value.accountMode})(map)
    setTableData(data)
  }
}

const delRow = () => {
    if (tableSelectedRowKeys.value.length == 0){
      createWarningModal({title: '温馨提醒', content: "请选中要进行删除的行！"});
    }else{
      let list = getDataSource()
      list = list.filter(it => tableSelectedRowKeys.value.indexOf(it.ccode) == -1)
      setTableData(list)
      tableSelectedRowKeys.value = []
    }
}
</script>
<style lang="less" scoped>
@import '/@/assets/styles/part-open.less';
@import '/@/assets/styles/alone-basic-table.less';
:deep(.ant-calendar-picker-input.ant-input),
:deep(.ant-select-single:not(.ant-select-customize-input)
  .ant-select-selector
  .ant-select-selection-search-input), :deep(.ant-picker), :deep(.ant-input-number), :deep(.ant-input-password) {
  border: none;
  width: 100%;
  border-bottom: solid 1px rgb(191, 191, 191) !important;
  text-align: center;
}

:deep(.ant-form-item-control button) {
  display: none;
}

:deep(.ant-input-number-input) {
  width: 100%;
  border-bottom: solid 1px rgb(191, 191, 191) !important;
}

:deep(.ant-input-number) {
  width: 90%;
  border: none;
}

:deep(.nc-open-content input ) {
  width: 100% !important;
}

:deep(.ant-calendar-picker-input) {
  text-align: center;
}

:deep(.ant-select-single:not(.ant-select-customize-input)
  .ant-select-selector
  .ant-select-selection-search-input) {
  border: none !important;
}

.nc-open-content-look {
  pointer-events: none;
  cursor: default;
}

.nc-open-content {
  padding:  0;
  color: #666666;

  > .content-down {
    >div:nth-of-type(1){
      padding: 0 ;
      width: 100%;
      display: inline-flex;
      justify-content: space-between;
      >span:nth-of-type(1){
        font-weight: bold;
        color: black;
      }
    }
  }

  input {
    width: 32%;
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
  }

  :deep(.ant-upload-picture-card-wrapper) {
    width: 88px;

    .ant-upload-select-picture-card {
      width: 280px;
      height: 80px;
      margin-right: 0;
      margin-bottom: 0;

      .ant-upload {
        //padding: 0;
      }
    }
  }

  :deep(.ant-cascader-input) {
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
  }

  .ant-input:focus {
    box-shadow: none;
  }

  :deep(.ant-select-selector) {
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
  }

  label:not(.ant-radio-button-wrapper) {
    text-align: left;
    width: 65px;
    color: white;
    display: inline-block;
    padding: 6px 10px;
    font-weight: bold;
  }

  .red_span {
    color: red;
    font-weight: bold;
    display: inline-block;
    width: 20px;
    text-align: right;
  }

  .red_span2 {
    color: #0096c7;
    cursor: pointer;
    font-weight: bold;
    display: inline-block;
    width: 20px;
    text-align: right;
  }
}

:deep(.ant-select-disabled) {
  .ant-select-selector {
    background-color: white !important;
    color: black !important;
  }
}
:deep(.account-picker){
  .ap-title,.thisNameSpan{
    color: white !important;
  }
}
</style>
