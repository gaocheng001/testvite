<template>
  <BasicModal
    width="700px"
    :height="400"
    class="spaceLogo"
    v-bind="$attrs"
    @ok="handleOk()"
    @cancel="handleClose()"
    @register="register"
    :canFullscreen="false"
    :maskClosable="false"
    :draggable="false"
    :footer="null"
    loadingTip="查询参数初始化中"
  >
    <template #title>
      <div style="height: 30px;width: 100%;background-color: #5f375c;color: white;line-height: 30px;">
        <AppstoreOutlined  style="margin: 0 2px;font-size: 14px;"/>
        <span style="font-size: 14px">库存管理</span>
      </div>
    </template>
    <div style="display: inline-flex;justify-content: space-between;width: 100%;">
      <div style="width: calc(100% - 150px);height: 100%;">
        <div style="text-align: center;padding: 10px 0 5px;">
          <SearchOutlined style="font-size: 24px;color: #0096c7;margin-top: 2px"/>
          <span style="line-height:30px;font-size: 24px;color: #0096c7;font-weight: bold;">&ensp;金额收发存汇总表</span>
        </div>
        <div
          class="nc-open-content">
          <div class="open-content-up">
            <div class="border-div">
              <span>业务范围</span>
              <AccountPicker  theme="three" @reloadTable="dynamicAdReload"/>
            </div>
            <div class="border-div">
              <span>查询条件</span>
              <div style="margin-left: 14px;">
                <ul>
                  <li style="margin: 2% 0px;">
                    <label style="text-align: left">截止日期：</label>
                    <a-date-picker :allowClear="false" placeholder="" style="width: 320px;margin-left: 25px;" v-model:value="strDate" @change="verifyDate"/>
                  </li>
                  <li style="margin: 2% 0px;">
                    <label style="text-align: left">仓库：</label>
                    <Select :allowClear="true" v-model:value="ckId" style="width: 70%;margin-left: 57px;">
                      <SelectOption :value="data.cangkuId" v-for="data in ckList">{{data.cangkuName}}</SelectOption>
                      <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
                    </Select>
                    &ensp;
                    <a style="font-weight: bold;font-size: 18px;"><LinkOutlined @click="cangkuPopShow('cangku')" /></a>
                  </li>
                  <li style="margin: 2% 0px;">
                    <label style="text-align: left">单据状态：</label>
                    <Select v-model:value="dataType" style="width: 70%;margin-left: 28px;text-align: center;">
                      <SelectOption :value="data.value" v-for="data in dataTypeList">{{data.title}}</SelectOption>
                      <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
                    </Select>
                  </li>
                  <li style="    margin: 2% 0px;">
                    <label style="text-align: left">存货分类：</label>
                    <Select v-model:value="stockClassId" mode="tags" style="width: 70%;margin-left: 25px;" @change="stockClassChange">
                      <SelectOption :value="data.uniqueStockclass" v-for="data in stockClassList">{{ data.stockCclassName }}</SelectOption>
                      <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
                    </Select>
                    &ensp; <a style="font-weight: bold;font-size: 18px;"><LinkOutlined @click="cangkuPopShow('class')" /></a>
                  </li>
                  <li  style="    margin: 2% 0px;">
                    <label style="text-align: left">存货名称：</label>
                    <Select mode="tags" v-model:value="stockId" style="width: 70%;margin-left: 25px;">
                      <SelectOption :value="data.id" v-for="data in stockList">{{ data.stockNum }}-{{ data.stockName }} </SelectOption>
                      <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
                    </Select>
                    &ensp;
                    <a style="font-weight: bold;font-size: 18px;"><LinkOutlined @click="cangkuPopShow('stock')" /></a>
                  </li>
                </ul>
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

    <StockCangKuModalPop @throwData="throwStockCangKuData" @register="registerStockCangKuPage"/>
    <ClassAllModalPop @throwData="classAllThrowData" @register="registerStockClassPage"/>
    <StockInfoModalPop @save="stockInfoData" @register="registerStockInfoPage" />
  </BasicModal>
</template>

<script setup="props, {content}" lang="ts">
/********************************************* 公共参数 ********************************************************/
import {BasicModal, useModal, useModalInner} from '/@/components/Modal'
import {
  Checkbox as ACheckbox,
  DatePicker as ADatePicker,
  Input as AInput,
  Radio as ARadio,
  Select,
  Tabs as ATabs, Button, message
} from "ant-design-vue"
import {
  CaretDownOutlined,
  AppstoreOutlined,
  LinkOutlined,
  SearchOutlined
} from '@ant-design/icons-vue';
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {useUserStore} from "/@/store/modules/user";
import {useMessage} from "/@/hooks/web/useMessage";
import {ref, watch} from "vue";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import StockCangKuModalPop from "/@/views/boozsoft/stock/stock_cangku/popup/stockCangKuOneModalPop.vue";
import ClassAllModalPop from "/@/views/boozsoft/stock/stock_class/popup/classAllModalPop.vue";
import StockInfoModalPop from "/@/views/boozsoft/stock/stock_info/popup/stockInfoModalPop.vue";
import router from "/@/router";
import {useTabs} from "/@/hooks/web/useTabs";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {findAllStockClass} from "/@/api/record/stock/stock_class";
import {findAll} from "/@/api/record/stock/stock";
import {findCangkuJoinName} from "/@/api/record/stock/stock-cangku-level-record";
import { findAll as sotckCangKuAll } from '/@/api/record/stock/stock-cangku';
import dayjs from "dayjs";
import {findPeriodIyearByUniqueCode} from "/@/api/record/system/account";
import {hasBlank} from "/@/api/task-api/tast-bus-api";
const { closeCurrent } = useTabs(router);
const emit = defineEmits(['register', 'save'])
const ARangePicker = ADatePicker.RangePicker
const SelectOption = Select.Option
const AInputSearch = AInput.Search
const ARadioGroup = ARadio.Group
const ARadioButton = ARadio.Button
const ACheckboxGroup = ACheckbox.Group
const ATabPane = ATabs.TabPane
const userStore = useUserStore();
const busDate = useCompanyOperateStoreWidthOut().getLoginDate
const {createWarningModal} = useMessage();
const companyOperateStore = useCompanyOperateStoreWidthOut()
const openType = ref('')
const databaseObj:any = ref('')
const databaseTrue = ref('')
const formItems: any = ref({});
//************************************* new ***************************
const dataType: any = ref('');
const dataTypeList: any = ref([{title:'全部',value:''},{title:'已审核',value:'1'},{title:'未审核',value:'0'}])
const strDate: any = ref(dayjs(useCompanyOperateStoreWidthOut().getLoginDate));
const ckId: any = ref('');
const ckList: any = ref([]);
const stockClassId: any = ref([]);
const stockClassList: any = ref([]);
const stockId: any = ref([]);
const stockList: any = ref([]);

const [registerStockCangKuPage, {openModal: openStockCangKuPage}] = useModal()
const [registerStockClassPage, {openModal: openStockClassPage}] = useModal()
const [registerStockInfoPage, { openModal: openStockInfoPage }] = useModal();

const [register, {closeModal, setModalProps}] = useModalInner((data) => {
  formItems.value.openOne = data.data.openOne;
  openType.value=data.openType
  setModalProps({ minHeight: 340 });
})

//时间转换
function transformTimestamp(timestamp){
  let a = new Date(timestamp).getTime();
  const date = new Date(a);
  const Y = date.getFullYear() + '-';
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  const D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + '  ';
  const dateString = Y + M + D;
  return dateString;
}
const dynamicAdReload = async (obj) =>{
  databaseObj.value=obj
  databaseTrue.value=obj.accountMode
  ckId.value=''
  ckList.value=[]
  stockClassId.value=[]
  stockClassList.value=[]
  stockId.value=[]
  stockList.value=[]
  verifyDate()
  stockCangku()
  findAllStock()
  findByStockClass()
}
async function verifyDate() {
  let period=await findPeriodIyearByUniqueCode(databaseObj.value.target.id)
  let tmp=period.filter(a=>a==transformTimestamp(strDate.value).split('-')[0])
  if(tmp.length==0){
    strDate.value=period[period.length-1]+'12-31'
  }
}
async function stockCangku() {
  let temp=await useRouteApi(sotckCangKuAll,{schemaName: databaseTrue})({searchConditon: {
      requirement: 'ckNum',
      value: '',
    }})
  ckList.value=[]
  temp.items.forEach(a=>{
    ckList.value.push({cangkuId:a.id,cangkuName:a.ckName})
  })
}
async function findAllStock() {
  let temp=await useRouteApi(findAll,{schemaName: databaseTrue})({
    stockFlag:'',
    stockClass:'',
    searchConditon:{
      requirement:'',
      value:''
    }
  })
  temp.forEach(async (a)=>{
    if(a.stockCangkuDuli=='0' && a.stockCangku!==''){
      let cangkuJoinName=await useRouteApi(findCangkuJoinName,{schemaName: databaseTrue})(  {id:a.stockCangku})
      a.stockCangkuName=cangkuJoinName[0].cangkuRecordJoinName
    }
  })
  stockList.value=temp
}
async function findByStockClass() {
  let temp= await useRouteApi(findAllStockClass,{schemaName: databaseTrue})({
    page: 1,
    size: 10000,
    stockFlag: '',
    searchValue: '',
    superid: ''
  })
  stockClassList.value=temp.items
}
function cangkuPopShow(type) {
  if(type=='cangku'){
    openStockCangKuPage(true,{
      database:databaseTrue.value,
    })
  }else if(type=='class'){
    openStockClassPage(true,{
      database:databaseTrue.value,
    })
  }else if(type=='stock'){
    openStockInfoPage(true,{
      database:databaseTrue.value,
      stockClassId:stockClassId.value
    })
  }
}

function stockInfoData(data) {

}
function classAllThrowData(data) {
  stockClassId.value=data
}

function throwStockCangKuData(data) {
  ckList.value=[]
  ckId.value=data[0].cangkuId
  ckList.value.push(data[0])
}

function handleOk() {
  let map={
    ckId:ckId.value,
    ckName:hasBlank(ckId.value)?'':ckList.value.filter(a=>a.cangkuId==ckId.value)[0].cangkuName,
    stockClassId:stockClassId.value,
    stockId:stockId.value,
    ckList:ckList.value,
    dataType:dataType.value,
    strDate:transformTimestamp(strDate.value),
    databaseTrue:databaseTrue.value,
  }
  emit('throwData', map);
  closeModal();
}

async function handleClose() {
  if (null != formItems.value.openOne && formItems.value.openOne == 1) {
    await closeCurrent();
    router.push('/zhongZhang/home/welcome');
  }else{
    closeModal();
  }
  return true;
}

function stockClassChange(data) {
  if(data.length>0){
    let templist=[]
    data.forEach(a=>{
      let temp=stockList.value.filter(aa=>aa.stockClass==a)
      temp.forEach(aa=>{
        templist.push(aa)
      })
    })
    stockList.value=templist
  }else{
    findAllStock()
  }
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
  :deep(.ant-select-selector), :deep(.ant-input-affix-wrapper),:deep(.ant-picker) {
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
    background: none;
  }
  :deep(.ant-picker-input) > input{
    text-align: center;
  }
  .border-div {
    position: relative;
    border: 1px #a29f9f solid;
    margin: 20px 10px;
    padding: 2.5%;
    text-align: left;

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
  width: 150px;background-color: #f1f1f1;padding: 10% 4%;height: 394px;
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
</style>
