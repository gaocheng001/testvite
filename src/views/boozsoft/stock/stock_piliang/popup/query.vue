<template>
  <BasicModal
    width="700px"
    v-bind="$attrs"
    :ok-text="step===0 || step===1?'下一步':'完成'" :cancel-text="step===2 || step===1?'上一步':'放弃'"
    :showOkBtn="showNext"
    @ok="handleOk()"
    @cancel="handleClose()"
    @register="register"
    :canFullscreen="false"
  >
    <template #title>
      <div style="height: 30px;width: 100%;background-color: #5f375c;color: white;line-height: 30px;">
        <AppstoreOutlined  style="margin: 0 2px;font-size: 14px;"/>
        <span style="font-size: 14px">销售管理</span>
      </div>
    </template>
    <div class="nc-open-content" style="height: 100%">
      <SecondaryTitle>新增批量销货单</SecondaryTitle>
      <span style="margin-left: 1em;color: black;font-weight: bold;">{{
          step===0 ?'步骤一：添加并完善销货单表头信息':step===1 ?'步骤二：选择并添加需要批量销售的存货':'步骤三：选择并添加需要批量销售的客户'
        }}</span>
      <div class="content-down" v-show="step===0">
        <ul>
          <li>
            <div class="special-border-div">
              <span>业务范围</span>
              <AccountPicker theme="three" @reloadTable="dynamicAdReload" style="display: flex;"/>
            </div>
          </li>
          <li>
            <div class="special-border-div">
              <span>单据信息</span>
              <div>
                <div>
                  <div style="width: 50%;float: left;">
                    <label>批量入库单号：</label>
                    <Input
                      ref="focus1"
                      readonly
                      :filter-option="filterOption"
                      @keyup.enter.native="focus2.focus()"
                      v-model:value="formItems.ccode"
                      placeholder=""
                      style="width: 50%;border: none"
                    />
                    <span class="red_span">⋆</span>
                  </div>
                  <div style="width: 50%;float: left;">
                    <label>单据日期：</label>
                    <DatePicker ref="focus2" v-model:value="formItems.ddate" value-format="YYYY-MM-DD"
                                :filter-option="filterOption"
                                @keyup.enter.native="focus3.focus()"
                                format="YYYY-MM-DD"
                                placeholder="" style="width: 50%"/>
                    <span class="red_span">⋆</span>
                  </div>
                </div>
                <div>
                  <label>仓库：</label>
                  <Select
                    ref="focus3"
                    v-model:value="formItems.cwhcode"
                    placeholder=""
                    style="width: 75%;border: none"
                    :filter-option="filterOption"
                    @keyup.enter.native="focus4.focus()"
                    :options="selectModel['warehouse']"
                  > <template #option="{ value: val, label ,title }">{{ title }}</template></Select>
                  <span class="red_span2"><PaperClipOutlined @click="openSelectContent('cwhcode')"/></span>
                </div>
                <div style="margin-top: 5px">
                  <div style="width: 50%;float: left;">
                    <label>业务部门：</label>
                    <Select
                      ref="focus4"
                      v-model:value="formItems.cdepcode"
                      placeholder=""
                      style="width: 50%;border: none"
                      :filter-option="filterOption"
                      @keyup.enter.native="focus5.focus()"
                      :options="selectModel['dept']"
                    > <template #option="{ value: val, label ,title }">{{ title }}</template></Select>
                    <span class="red_span2"><PaperClipOutlined  @click="openSelectContent('cdepcode')"/></span>
                  </div>
                  <div style="width: 50%;float: left;">
                    <label>业务员：</label>
                    <Select
                      ref="focus5"
                      v-model:value="formItems.cpersoncode"
                      placeholder=""
                      style="width: 50%;border: none"
                      :options="selectModel['user']"
                      :filter-option="filterOption"
                    > <template #option="{ value: val, label ,title }">{{ title }}</template></Select>
                    <span class="red_span2"><PaperClipOutlined @click="openSelectContent('cpersoncode')"/></span>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>

      </div>
      <div class="content-down" v-show="step===1 || step===2">
        <div style="width:100%;background-color: #158eb8;height: 50px;padding: 10px;border-radius: 5px;display: inline-flex;justify-content: space-between;">
          <div>
            <Select style="width: 100px;" v-model:value="searchConditon.requirement">
              <template v-if="step===1 ">
                <SelectOption value="stockNum">存货编码</SelectOption>
                <SelectOption value="stockName">存货名称</SelectOption>
                <SelectOption value="stockBarcode">条形码</SelectOption>
              </template>
              <template v-else>
                <SelectOption value="custCode">客户编码</SelectOption>
                <SelectOption value="custName">客户名称</SelectOption>
              </template>
              <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
            </Select>
            <!--       @search="findByStockByEnterTime()"   -->
            <a-input-search placeholder="" v-model:value="searchConditon.value" style="width: 200px; border-radius: 4px" @search="tableSearch" />
          </div>
          <div  v-if="step===2 ">
            <RadioGroup v-model:value="searchConditon.radio">
              <Radio style="color: white;" value="all">全部</Radio>
              <Radio style="color: white;" value="org">客户组</Radio>
            </RadioGroup>
          </div>
          <div>
            <Button @click="add">添加</Button>
            <Button @click="del">删除</Button>
          </div>
        </div>
        <div>
          <BasicTable
            :row-selection="{ type: 'checkbox',fixed: true,selectedRowKeys: tableSelectedRowKeys, onSelect: onSelectChange ,getCheckboxProps: onCheckChange}"
            :scroll="{ y: 260 }"
            class="alone-basic-table"
            size="small"
            @register="registerTable"
          >
            <template #xyBillStyle="{ record }">
            </template>
          </BasicTable>
        </div>
<!--        <label>存货：</label>
        <Select
          v-model:value="formItems.cinvodes"
          placeholder=""
          mode="multiple"
          style="width: 60%;border: none"
          :filter-option="filterOption"
          :options="selectModel['stock']"
        > <template #option="{ value: val, label ,title }">{{ title }}</template></Select>
        <span class="red_span2"><PaperClipOutlined @click="openSelectContent('cinvodes')"/></span>-->
      </div>
<!--      <div class="content-down" v-show="step===2">
        <label>销售客户：</label>
        <Select
          v-model:value="formItems.cvencodes"
          placeholder=""
          mode="multiple"
          style="width: 60%;border: none"
          :filter-option="filterOption"
          :options="selectModel['cust']"
        > <template #option="{ value: val, label ,title }">{{ title }}</template></Select>
        <span class="red_span2"><PaperClipOutlined @click="openSelectContent('cvencodes')"/></span>
&lt;!&ndash;        <label>结算客户：</label>
        <Select
          v-model:value="formItems.cvencodesJs"
          placeholder=""
          mode="multiple"
          style="width: 60%;border: none"
          :filter-option="filterOption"
          :options="selectModel['cust']"
        > <template #option="{ value: val, label ,title }">{{ title }}</template></Select>
        <span class="red_span2"><PaperClipOutlined @click="openSelectContent('cvencodesJs')"/></span>&ndash;&gt;
      </div>-->
    </div>
    <DeptModalPop @register="registerSelectDeptPage" @save="modalData"/>
    <SelectPsn @register="registerSelectPsnPage" @save="modalData"/>
    <StockCangKuModalPop @register="registerStockCangKuModalPage" @throwData="modalData"/>
    <StockInfiModalPop @register="registerStockInfoModalPage" @throwData="modalData"/>
    <CustModalPop @throwData="modalData" @register="registerModalPopPage" />
    <FileContentSelect
      @save="loadList"
      @register="registerQueryPage"
    />
  </BasicModal>
</template>
<script setup="props, {content}" lang="ts">
import {nextTick, reactive, ref, unref} from 'vue';
import {BasicModal, useModal, useModalInner} from '/@/components/Modal'
import {useMessage} from "/@/hooks/web/useMessage";
import {DatePicker, Input, Radio, Select,Button} from 'ant-design-vue';
import {PaperClipOutlined, AppstoreOutlined,CaretDownOutlined} from '@ant-design/icons-vue';
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {findStockCaiGouList} from "/@/api/record/stock/stock-caigou";
import {useCompanyOperateStoreWidthOut} from '/@/store/modules/operate-company';
import {hasBlank} from "/@/api/task-api/tast-bus-api";
import DeptModalPop from "/@/views/boozsoft/global/popup/dept/select-dept.vue";
import StockCangKuModalPop from "/@/views/boozsoft/stock/stock_cangku/popup/stockCangKuModalPop.vue";
import SelectPsn from "/@/views/boozsoft/global/popup/dept/select-psn.vue";
import  CustModalPop from '/@/views/boozsoft/global/popup/customer_info/modalPop.vue';
import StockInfiModalPop from "/@/views/boozsoft/stock/stock_info/popup/stockInfoModalPop.vue";
import {findBillCode, findBillLastDate, findXclByZero} from "/@/api/record/stock/stock-xhd";
import router from "/@/router";
import {useTabs} from "/@/hooks/web/useTabs";
import {findStockPeriodInfoByYm} from "/@/api/record/group/im-unit";
import SecondaryTitle from "/@/views/boozsoft/stock/stock_piliang/popup/SecondaryTitle.vue";
import {useTable} from "/@/components/Table";

import BasicTable from "/@/components/Table/src/BasicTable.vue";
import {JsonTool} from "/@/api/task-api/tools/universal-tools";
import FileContentSelect from "/@/views/boozsoft/stock/stock_piliang/popup/FileContentSelect.vue";
import {getByStockBalanceTask} from "/@/api/record/stock/stock_balance";
const {createWarningModal} = useMessage()
const RadioGroup = Radio.Group
const RadioButton = Radio.Button
const SelectOption = Select.Option

const emit = defineEmits(['register','save'])
const [registerSelectDeptPage, {openModal: openSelectDeptPage}] = useModal()
const [registerStockCangKuModalPage, {openModal: openStockCangKuModalPage}] = useModal();
const [registerSelectPsnPage, {openModal: openSelectPsnPage}] = useModal()
const [registerStockInfoModalPage, {openModal: openStockInfoModalPage}] = useModal();
const [registerModalPopPage, { openModal: openMoalPopPage }] = useModal();
const [registerQueryPage, {openModal: openQueryPageM}] = useModal()

const formItems = ref({
  id: null,
  ccode: '',
  ddate: '',
  cdepcode: '',
  cwhcode: '',
  cinvodes: [],
  cvencodes: [],
  cvencodesJs: [],
  openOne: 0
})
const step = ref(0)
const isEdit = ref(true)
const showNext = ref(false)
const focus1 = ref(null)
const focus2 = ref(null)
const focus3 = ref(null)
const focus4 = ref(null)
const focus5 = ref(null)

const selectModel = ref({})
const dynamicTenant = ref('')
const thisEditType = ref('')
const searchConditon = reactive({
  requirement:'stockNum',value:'',radio: 'all'
})
const dynamicAdReload = async (e) => {
  dynamicTenant.value = e
  reload()
}

const [register, {closeModal, setModalProps}] = useModalInner(async (data) => {
  step.value = 0
  formItems.value.openOne = data.data.openOne
  setModalProps({minHeight: 400});
})

const reload = () => {
  nextTick(async ()=>{
    let busDate = useCompanyOperateStoreWidthOut().getLoginDate;
    if (await checkBusDate(busDate)){
      showNext.value = true
      formItems.value.ccode = await generateCode(busDate)
      selectModel.value = (await useRouteApi(findStockCaiGouList, {schemaName: dynamicTenant.value.accountMode})('warehouse,dept,user,operator,cust,stock'))
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
    }else if(list.filter(it=>it.stockMonth == dates[1] && it.istock == '1').length > 0){ // 期间已结账
      createWarningModal({title: "温馨提示",content: '当前业务日期期间已经结账，请重新选择单据日期！'})
      return false;
    }else {
      let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenant.value.accountMode })({iyear:dates[0],name:'月末结账',method:'结账',recordNum:''})
      if (!hasBlank(taskData)){
        createWarningModal({title: '温馨提示',content: '操作员'+taskData[0].username+'正在对当前账套进行月末结账处理，不能进行对单据业务操作，请销后再试！'})
        return  false;
      }
      formItems.value.ddate = date
    }
    // 得到当年最后一张销货单日期
    /*let n =  (await useRouteApi(findBillLastDate, {schemaName: dynamicTenant.value.accountMode})({year: dates[0],type:"XHD"}))
    formItems.value.ddate = n*/
  }
  return true;
}

async function generateCode(date) {
  return await useRouteApi(findBillCode, {schemaName: dynamicTenant.value.accountMode})({
    type: "PLXHD",
    date: date,
    prefix: "PL",key: '3-6'
  })
}
async function handleOk() {
  if (step.value === 0){
    if (hasBlank(formItems.value.ccode)) {
      createWarningModal({title: '温馨提醒', content: "单号为必填项！"});
      showNext.value = true
      return false;
    } else if (hasBlank(formItems.value.ddate)) {
      createWarningModal({title: '温馨提醒', content: "单据日期为必选项！"});
      showNext.value = true
      return false;
    } else if (hasBlank(formItems.value.cwhcode)) {
      createWarningModal({title: '温馨提醒', content: "仓库为必选项！"});
      showNext.value = true
      return false;
    }
    step.value = 1
    reloadTable(step.value)
  }else if(step.value === 1){
    formItems.value.cinvodes =   getDataSource().filter(it=>it.stockNum != null && it.stockNum != '').map(it=>it.stockId)
    if ( formItems.value.cinvodes.length == 0){
      createWarningModal({title: '温馨提醒', content: "请通过添加按钮添加存货！"});
      showNext.value = true
      return false;
    }
    tableSelectedRowKeys.value = []
    step.value = 2
    searchConditon.radio = 'all'
    reloadTable(step.value)
  }else if (step.value === 2){
    formItems.value.cvencodes =   getDataSource().filter(it=>it.custCode != null && it.custCode != '').map(it=>it.id)
    if (formItems.value.cvencodes.length == 0){
      createWarningModal({title: '温馨提醒', content: "请通过添加按钮添加客户！"});
      showNext.value = true
      return false;
    }
    tableSelectedRowKeys.value = []
    showNext.value = false
    console.log(unref(formItems))
    emit('save', {parm: unref(formItems), tenant: dynamicTenant.value,selectModel: selectModel.value})
    closeModal()
  }
}
const {closeCurrent} = useTabs(router);
async function handleClose(e) {
  if (step.value == 1){
    step.value = 0
  }if (step.value == 2){
    step.value = 1
  }else {
    if (null != formItems.value.openOne && formItems.value.openOne == 1)
      await closeCurrent()
    closeModal()
  }
  return false
}
const filterOption = (input: string, option: any) => {
  return option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}

const openSelectContent = (type) => {
  thisEditType.value = type
  switch (type) {
    case 'cdepcode':
      openSelectDeptPage(true, {
        dynamicTenantId: dynamicTenant.value.accountMode
      })
      break;
    case 'cwhcode':
      openStockCangKuModalPage(true, {
        database: dynamicTenant.value.accountMode,
      })
      break;
    case 'cpersoncode':
      openSelectPsnPage(true, {
        dynamicTenantId: dynamicTenant.value.accountMode
      })
      break;
    case 'cinvodes':
      openStockInfoModalPage(true, {
        database:  dynamicTenant.value.accountMode,many: true
      })
      break;
    case 'cvencodes':
    case 'cvencodesJs':
      openMoalPopPage(true, {
        database: dynamicTenant.value.accountMode,
        accId: dynamicTenant.value.accId,many: true
      });
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
const [registerTable, {getDataSource, setTableData,setColumns}] = useTable({
  bordered: true,
  showIndexColumn: false,
  pagination: false/*{
    pageSize: 50,
    showSizeChanger: true,
    pageSizeOptions: ['50'],
    showTotal: t => `总共${t}条数据`
  }*/,
})
const resetColumn = (v) => {
  return (v == 1?[
    {
      title: '存货编码',
      dataIndex: 'stockNum',
      width: '100px',
      align: 'left',
    },
    {
      title: '存货名称',
      dataIndex: 'stockName',
      width: '150px',
      align: 'left',
    },
    {
      title: '规格型号',
      dataIndex: 'stockGgxh',
      width: '100px',
      align: 'left',
    },
    {
      title: '批号',
      dataIndex: 'batchId',
      width: '80px',
      align: 'center'
    } ,
    {
      title: '可用量',
      dataIndex: 'keyong',
      width: '80px',
      align: 'center'
    },{
      title: '失效日期',
      dataIndex: 'dvdate',
      width: '80px',
      align: 'center'
    }
  ]:[{
    title: '客户编码',
    dataIndex: 'custCode',
    width: '100px',
    align: 'left',
  },
    {
      title: '客户名称',
      dataIndex: 'custName',
      width: '150px',
      align: 'left',
    },{
      title: '结算客户编码',
      dataIndex: 'custCode2',
      width: '100px',
      align: 'left',
    },
    {
      title: '结算客户名称',
      dataIndex: 'custName2',
      width: '150px',
      align: 'left',
    }])
}
const stockXcList = ref([])
const tableList = ref([])
const tableSelectedRowKeys = ref([])
const onSelectChange = (record, selected, obj, nativeEvent) => {
  tableSelectedRowKeys.value = obj.map(v => v.key)
}
const onCheckChange = (record) => {
  return {disabled: (step.value==1? record.stockNum==null:record.custCode==null)}
}
const reloadTable = async (v)=>{
  // 重新加载列
  setColumns(resetColumn(v))
}
const add = () => {
  openQueryPageM(true, {
    data: step.value,
    tenant: dynamicTenant.value,
    radio: searchConditon.radio,
    cwhcode: formItems.value.cwhcode
  })
}
const loadList = (e) => {
  let list =JsonTool.parseProxy( e.list)
  let len = list.length
  for (let i = 0; i < (10 - len); i++) {
    list.push({})
  }
  setTableData(list)
}
const del = () => {
 let list =  getDataSource()
 let nL =   list.filter(it=>tableSelectedRowKeys.value.indexOf(it.key)==-1)
  let len = nL.length
  for (let i = 0; i < (10 - len); i++) {
    list.push({})
  }
  setTableData(list)
}
const tableSearch = (v) => {
  createWarningModal({title: '温馨提醒', content: "暂未发现！"});
}
</script>
<style lang="less" scoped>
@import '/@/assets/styles/redTitle-open.less';
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
  padding: 0;
  color: #666666;

  > .content-down {
    text-align: center;
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
    width: 100px;
    display: inline-block;
   color: #666666;
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
  .special-border-div {
    position: relative;
    border: 1px #acabab solid;
    margin: 2.5% 1%;

    > span {
      position: absolute;
      top: -12px;
      left: 50px;
      font-size: 14px;
      background: white;
      padding: 0 15px;
    }

    > div {
      margin: 15px;
      color: black;
      >div{
        display: inline-block;width: 100%;
      }
    }
  }
}

:deep(.ant-select-disabled) {
  .ant-select-selector {
    background-color: white !important;
    color: black !important;
  }
}
</style>
