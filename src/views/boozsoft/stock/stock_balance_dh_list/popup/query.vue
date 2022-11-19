<template>
  <BasicModal
    width="900px"
    class="spaceLogo"
    v-bind="$attrs"
    @ok="handleOk()"
    @cancel="handleClose()"
    @register="register"
    :canFullscreen="false"
    :footer="null"
    loadingTip="查询参数初始化中"
  >
    <template #title>
      <div style="height: 30px;width: 100%;background-color: #5f375c;color: white;line-height: 30px;">
        <AppstoreOutlined  style="margin: 0 2px;font-size: 14px;"/>
        <span style="font-size: 14px">期初管理</span>
      </div>
    </template>
    <div style="display: inline-flex;justify-content: space-between;width: 100%;">
      <div style="width: calc(100% - 150px);height: 100%;">
        <div style="text-align: center;padding: 10px 0 5px;">
          <SearchOutlined style="font-size: 24px;color: #0096c7;margin-top: 2px"/>
          <span style="line-height:30px;font-size: 24px;color: #0096c7;font-weight: bold;">&ensp;期初到货单查询</span>
        </div>
        <div class="nc-open-content">
          <div class="open-content-up">
            <div class="border-div">
              <span>业务范围</span>
              <AccountPicker  theme="three" @reloadTable="codeChange"/>
            </div>
            <div class="border-div">
              <span>查询条件</span>
              <div>
                <label style="margin-left: 10px;">业务年度：</label>
                <a-select
                  v-model:value="stockyear"
                  style="width: 100px;text-align: center;margin-left: 22px;"
                >
                  <a-select-option
                    v-for="item in stockyearList"
                    :key="item"
                    :value="item"
                  >
                    {{ item }}
                  </a-select-option>
                  <template #suffixIcon><CaretDownOutlined style="color:#666666;"/></template>
                </a-select>

                <label style="margin-left: 100px;">仓库：</label>
                <a-select
                  v-model:value="stockcangku"
                  style="width: 200px;margin-left: 75px;"
                >
                  <a-select-option
                    v-for="item in stockcangkuList"
                    :key="item.id"
                    :value="item.id"
                  >
                    {{ item.ckName }}
                  </a-select-option>
                  <template #suffixIcon><CaretDownOutlined style="color:#666666;"/></template>
                </a-select>
                &nbsp;
                <a style="font-weight: bold;font-size: 18px;color: #0a84ff;"><LinkOutlined @click="openCangKuOne" /></a>
              </div>
              <div>
                <label style="margin-left: 10px;">审核状态：</label>
                <a-select
                  v-model:value="stockBcheck"
                  style="width: 100px;text-align: center;margin-left: 22px;"
                >
                  <a-select-option
                    v-for="item in stockBcheckList"
                    :key="item.value"
                    :value="item.value"
                  >
                    {{ item.title }}
                  </a-select-option>
                  <template #suffixIcon><CaretDownOutlined style="color:#666666;"/></template>
                </a-select>

                <label style="margin-left: 100px;">供应商名称：</label>
                <a-select
                  :allowClear="true"
                  show-search
                  v-model:value="stockSup"
                  :filter-option="filterSupOption"
                  style="width: 200px;margin-left: 35px;"
                >
                  <a-select-option
                    v-for="item in stockSupList"
                    :key="item.custName"
                    :value="item.id"
                  >
                    {{ item.custName }}
                  </a-select-option>
                  <template #suffixIcon><CaretDownOutlined style="color:#666666;"/></template>
                </a-select>
                &nbsp;
                <a style="font-weight: bold;font-size: 18px;color: #0a84ff;"><LinkOutlined @click="openSup" /></a>
              </div>
              <div>
                <label style="margin-left: 10px;">存货分类：</label>
                <a-select
                  allowClear
                  show-search
                  v-model:value="stockClass"
                  :filter-option="filterClassOption"
                  @change="stockClassChange"
                  style="width: 150px;margin-left: 22px;"
                >
                  <a-select-option
                    v-for="item in stockClassList"
                    :key="item.stockCclassName"
                    :value="item.uniqueStockclass"
                  >
                    {{ item.stockCclassName }}
                  </a-select-option>
                  <template #suffixIcon><CaretDownOutlined style="color:#666666;"/></template>
                </a-select>
                &nbsp;
                <a style="font-weight: bold;font-size: 18px;color: #0a84ff;"><LinkOutlined @click="openStockClass" /></a>

                <label style="margin-left: 20px;">存货档案：</label>
                <a-select
                  :allowClear="true"
                  show-search
                  :filter-option="filterClassOption"
                  v-model:value="stockInfo"
                  style="width: 200px;margin-left: 48px;"
                >
                  <a-select-option
                    v-for="item in stockInfoList"
                    :key="item.stockName"
                    :value="item.stockNum"
                  >
                    {{ item.stockName }}
                  </a-select-option>
                  <template #suffixIcon><CaretDownOutlined style="color:#666666;"/></template>
                </a-select>
                &nbsp;
                <a style="font-weight: bold;font-size: 18px;color: #0a84ff;"><LinkOutlined @click="openStockInfo" /></a>
              </div>
              <div>
                <label style="margin-left: 10px;">业务部门：</label>
                <a-select
                  :allowClear="true"
                  show-search
                  :filter-option="filterClassOption"
                  v-model:value="dept"
                  style="width: 150px;margin-left: 23px;"
                >
                  <a-select-option
                    v-for="item in deptList"
                    :key="item.deptName"
                    :value="item.uniqueCode"
                  >
                    {{ item.deptName }}
                  </a-select-option>
                  <template #suffixIcon><CaretDownOutlined style="color:#666666;"/></template>
                </a-select>
                &nbsp;
                <a style="font-weight: bold;font-size: 18px;color: #0a84ff;"><LinkOutlined @click="openDept" /></a>

                <label style="margin-left: 21px;">业务员：</label>
                <a-select
                  :allowClear="true"
                  show-search
                  :filter-option="filterClassOption"
                  v-model:value="person"
                  style="width: 200px;margin-left: 60px;"
                >
                  <a-select-option
                    v-for="item in personList"
                    :key="item.psnName"
                    :value="item.uniqueCode"
                  >
                    {{ item.psnName }}
                  </a-select-option>
                  <template #suffixIcon><CaretDownOutlined style="color:#666666;"/></template>
                </a-select>
                &nbsp;
                <a style="font-weight: bold;font-size: 18px;color: #0a84ff;"><LinkOutlined @click="openPerson" /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right-btns">
        <Button style="width: 100px;" shape="round" @click="handleOk"  type="primary">查询</Button>
        <Button style="width: 100px;margin-top: 10px" shape="round" @click="handleClose">取消</Button>
      </div>
    </div>

    <StockCangKuOneModalPop @throwData="throwStockCangKuData" @register="registerStockCangKuOneModalPage" />
    <SupModalPop @throwData="throwSupData" @register="registerSupModalPage" />
    <ClassAll @throwData="throwClassData" @register="registerClassModalPage" />
    <StockInfoModalPop @throwData="throwStockInfoData" @register="registerStockInfoModalPage" />
    <DeptModalPop @register="registerSelectDeptPage" @save="deptData"/>
    <SelectPsn @register="registerSelectPsnPage" @save="personData"/>

  </BasicModal>
</template>

<script setup="props, {content}" lang="ts">
import {onMounted, ref,reactive} from 'vue'
import {BasicModal, useModal, useModalInner} from '/@/components/Modal'
import {
  Button,
  Checkbox as ACheckbox,
  DatePicker as ADatePicker,
  Input as AInput,
  Radio as ARadio,
  Select as ASelect,
  Tabs as ATabs
} from "ant-design-vue"
import {FileSearchOutlined, SearchOutlined,LinkOutlined,AppstoreOutlined,CaretDownOutlined} from '@ant-design/icons-vue';
import {useTabs} from '/@/hooks/web/useTabs';
import router from "/@/router";
import {useUserStore} from "/@/store/modules/user";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {periodAllList} from "/@/api/record/group/im-unit";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {findAll as stockCangKuAll} from "/@/api/record/stock/stock-cangku";

import StockCangKuOneModalPop from "/@/views/boozsoft/stock/stock_cangku/popup/stockCangKuOneModalPop.vue";
import SupModalPop from "/@/views/boozsoft/global/popup/supplier/modalPop.vue";
import ClassAll from "/@/views/boozsoft/stock/stock_class/popup/classAllModalPop.vue";
import StockInfoModalPop from "/@/views/boozsoft/stock/stock_info/popup/stockInfoModalPop.vue";
import DeptModalPop from "/@/views/boozsoft/global/popup/dept/select-dept.vue";
import SelectPsn from "/@/views/boozsoft/global/popup/dept/select-psn.vue";

import {findAll as supAll} from "/@/api/record/supplier_data/supplier";
import {findAllStockClass} from "/@/api/record/stock/stock_class";
import {findAll} from "/@/api/record/stock/stock";
import {findCangkuJoinName} from "/@/api/record/stock/stock-cangku-level-record";
import {findDeptByFlag} from "/@/api/record/system/dept";
import {psnFindByFlag} from "/@/api/psn/psn";


const emit = defineEmits(['register', 'save'])
const ARangePicker = ADatePicker.RangePicker
const ASelectOption = ASelect.Option
const AInputSearch = AInput.Search
const ARadioGroup = ARadio.Group
const ARadioButton = ARadio.Button
const ACheckboxGroup = ACheckbox.Group
const ATabPane = ATabs.TabPane
const userStore = useUserStore();
const {closeCurrent} = useTabs(router);


const database: any = ref('')
const accId: any = ref('')
//*********************** new ********************
const stockyear: any = ref('')
const stockyearList: any = ref([])
const stockcangku: any = ref('')
const stockcangkuList: any = ref([])
const stockBcheck: any = ref('')
const stockBcheckList: any = ref([{title:'全部',value:''},{title:'未审核',value:'0'},{title:'已审核',value:'1'}])
const stockSup: any = ref('')
const stockSupList: any = ref([])
const stockClass: any = ref('')
const stockClassList: any = ref([])
const stockInfo: any = ref('')
const stockInfoList: any = ref([])
const dept: any = ref('')
const deptList: any = ref([])
const person: any = ref('')
const personList: any = ref([])
const formItems: any = ref({})

const [registerStockCangKuOneModalPage, { openModal: openStockCangKuOneModalPage }] = useModal();
const [registerSupModalPage, { openModal: openSupModalPage }] = useModal();
const [registerClassModalPage, { openModal: openClassModalPage }] = useModal();
const [registerStockInfoModalPage, { openModal: openStockInfoModalPage }] = useModal();
const [registerSelectDeptPage, {openModal: openSelectDeptPage}] = useModal()
const [registerSelectPsnPage, {openModal: openSelectPsnPage}] = useModal()

const [register, {closeModal, setModalProps}] = useModalInner((data) => {
  formItems.value = data.data
  setModalProps({minHeight: 330});
})


let count = 0
const codeChange = async (data) => {
  database.value=data.accountMode
  accId.value=data.accId


  ++count
  if (count == 2) return false; // 防止重复打开
  // 获取存货期间
  let temp=await periodAllList({id:data.target.id})
  stockyearList.value=Array.from(new Set(temp.map(a=>a.stockYear)));
  stockyear.value=stockyearList.value[0]

  // 仓库
  let cangku=await useRouteApi(stockCangKuAll, { schemaName: data.accountMode })({searchConditon:{requirement:'',value:''}})
  stockcangkuList.value=cangku.items
  // 供应商
  let sup=await useRouteApi(supAll,{schemaName: data.accountMode})({uniqueCustclass:'',database:'',username:'',flag:'',searchConditon:{requirement:'',value:''}})
  stockSupList.value=sup.items
  // 存货分类
  let stockclasslist=await useRouteApi(findAllStockClass,{schemaName: data.accountMode})({
    stockFlag: '',
    searchValue: '',
    superid: '',
    page:'1',size:'100000'
  })
  stockClassList.value=stockclasslist.items
  // 存货
  findAllStock()
  // 部门
  deptList.value=await useRouteApi(findDeptByFlag,{schemaName: data.accountMode})({})
  // 人员
  personList.value= await useRouteApi(psnFindByFlag,{schemaName: data.accountMode})({})
}

const StockParameter = reactive({
  stockFlag:'',
  stockClass:'',
  searchConditon:{
    requirement:'',
    value:''
  }
})
async function findAllStock() {
  let temp=await useRouteApi(findAll,{schemaName: database})(StockParameter)
  temp.forEach(async (a)=>{
    if(a.stockCangkuDuli=='0' && a.stockCangku!==''){
      let cangkuJoinName=await useRouteApi(findCangkuJoinName,{schemaName: database})(  {id:a.stockCangku})
      a.stockCangkuName=cangkuJoinName[0].cangkuRecordJoinName
    }
  })
  stockInfoList.value=temp
}

//********************* 仓库弹窗 ******************
function openCangKuOne() {
  openStockCangKuOneModalPage(true,{
    database:database.value,
  })
}
function throwStockCangKuData(data) {
  stockcangku.value=data[0].id
}
//********************* 仓库弹窗END ******************
//********************* 供应商弹窗 ******************
function openSup() {
  openSupModalPage(true,{
    database:database.value,
    accId:accId.value,
  })
}
function throwSupData(data) {
  stockSup.value=data[0].id
}
const filterSupOption = (input: string, option: any) => {
  return option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}
//********************* 仓库弹窗END ******************
//********************* 分类弹窗 ******************
function openStockClass() {
  openClassModalPage(true,{
    database:database.value,
  })
}
function throwClassData(data) {
  stockClass.value=data[0]
}
function stockClassChange(data) {
  stockInfo.value=''
  StockParameter.stockClass=data
  if(data==undefined){
    StockParameter.stockClass=''
  }
  findAllStock()
}
const filterClassOption = (input: string, option: any) => {
  return option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}
//********************* 仓库弹窗END ******************
//********************* 存货弹窗 ******************
function openStockInfo() {
  openStockInfoModalPage(true,{
    database:database.value,
  })
}
function throwStockInfoData(data) {
  stockInfo.value=data[0].stockNum
}
//********************* 存货弹窗END ******************
//********************* 部门弹窗 ******************
function openDept() {
  openSelectDeptPage(true,{
    dynamicTenantId:database.value,
  })
}
function deptData(data) {
  dept.value=data.uniqueCode
}
//********************* 部门弹窗END ******************
//********************* 人员弹窗 ******************
function openPerson() {
  openSelectPsnPage(true,{
    dynamicTenantId:database.value,
  })
}
function personData(data) {
  person.value=data.uniqueCode
}
//********************* 人员弹窗END ******************

async function handleOk() {
  let map={
    stockyear:stockyear.value,
    stockCangku:stockcangku.value,
    stockBcheck:stockBcheck.value,
    stockSup:stockSup.value,
    stockClass:stockClass.value,
    stockInfo:stockInfo.value,
    dept:dept.value,
    person:person.value,
    databaseTrue:database.value,
    type:'QC',
  }
  emit('save', map)
  closeModal()
  return true
}
async function handleClose() {
  if (null != formItems.value.openOne && formItems.value.openOne == 1) {
    await closeCurrent()
    router.push('/zhongZhang/home/welcome')
  }
  closeModal()
}
</script>
<style lang="less" scoped>
:deep(.ant-checkbox){
  margin-top: -8px;
}
.nc-open-content {
  background-image: url(/@/assets/images/homes/bg-pattern.png);
  background-repeat: no-repeat;
  background-position: 66% 8%;
  background-size: contain;
  position: relative;
  :deep(.ant-select-selector),:deep(.ant-input),:deep(.ant-picker), :deep(.ant-input-affix-wrapper) {
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
    background: none;
  }
  .border-div {
    position: relative;
    border: 1px #a29f9f solid;
    margin: 20px 10px;
    padding: 2.5%;

    > span {
      display: block;
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
  width: 150px;background-color: #f1f1f1;padding: 10% 4%;height: 330px;
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

:deep(.ant-radio-button-wrapper){
  color: #0096c7;
}
</style>
