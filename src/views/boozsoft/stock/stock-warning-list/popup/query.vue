<template>
  <BasicModal
    width="700px"
    :height="330"
    class="spaceLogo"
    v-bind="$attrs"
    @ok="handleOk()"
    @cancel="handleClose()"
    @register="register"
    :canFullscreen="false"
    :maskClosable="false"
    :draggable="false"
    :footer="null"
    :loading="modelLoadIng"
    loadingTip="查询参数初始化中"
  >
    <template #title>
      <div style="height: 30px;width: 100%;background-color: #5f375c;color: white;line-height: 30px;text-align: left;">
        <AppstoreOutlined  style="margin: 0 2px;font-size: 14px;"/>
        <span style="font-size: 14px">存货管理</span>
      </div>
    </template>
    <div style="display: inline-flex;justify-content: space-between;width: 100%;">
      <div style="width: calc(100% - 150px);height: 100%;">
        <div style="text-align: center;padding: 10px 0 5px;">
          <SearchOutlined style="font-size: 24px;color: #0096c7;margin-top: 2px"/>
          <span style="line-height:30px;font-size: 24px;color: #0096c7;font-weight: bold;">&ensp;存货有效期预警表</span>
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
                    <label style="text-align: left">仓库：</label>
                    <Select :allowClear="true" v-model:value="ckId" style="width: 70%;margin-left: 58px;text-align: center;">
                      <SelectOption :value="data.cangkuId" v-for="data in ckList">{{data.cangkuName}}</SelectOption>
                      <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
                    </Select>
                    &ensp;
                    <a style="font-weight: bold;font-size: 18px;color: #0a84ff;"><LinkOutlined @click="cangkuPopShow('cangku')" /></a>
                  </li>

                  <li  style="    margin: 2% 0px;">
                    <label style="text-align: left">存货名称：</label>
                    <Select :allowClear="true" v-model:value="stockId" style="width: 70%;margin-left: 28px;text-align: center;">
                      <SelectOption :value="data.cangkuId" v-for="data in ckList">{{data.cangkuName}}</SelectOption>
                      <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
                    </Select>
                    &ensp;
                    <a style="font-weight: bold;font-size: 18px;color: #0a84ff;"><LinkOutlined @click="cangkuPopShow('stock')" /></a>
                  </li>

                  <li style="margin: 2% 0px;">
                    <label style="text-align: left">有效状态：</label>
                    <Select v-model:value="state" style="width: 70%;margin-left: 28px;" >
                      <SelectOption value="" key="">全部</SelectOption>
                      <SelectOption value="正常" key="正常">正常</SelectOption>
                      <SelectOption value="临近" key="临近">临近</SelectOption>
                      <SelectOption value="失效" key="失效">失效</SelectOption>
                      <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
                    </Select>
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
    <StockInfoModalPop @throwData="stockInfoData" @register="registerStockInfoPage" />
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
  Select ,
  Tabs as ATabs,Button,
  message
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
import {ref} from "vue";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import StockCangKuModalPop from "/@/views/boozsoft/stock/stock_cangku/popup/stockCangKuModalPop.vue";
import ClassAllModalPop from "/@/views/boozsoft/stock/stock_class/popup/classAllModalPop.vue";
import StockInfoModalPop from "/@/views/boozsoft/stock/stock_info/popup/stockInfoModalPop.vue";
import router from "/@/router";
import {useTabs} from "/@/hooks/web/useTabs";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {findAllStockClass} from "/@/api/record/stock/stock_class";
import {findAll} from "/@/api/record/stock/stock";
import {findCangkuJoinName} from "/@/api/record/stock/stock-cangku-level-record";
import { findAll as sotckCangKuAll } from '/@/api/record/stock/stock-cangku';
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
const modelLoadIng = ref(false)
const openType = ref('')
const databaseTrue = ref('')
const formItems: any = ref({});
//************************************* new ***************************
const ckId: any = ref('');
const ckList: any = ref([]);
const stockClassId: any = ref([]);
const stockClassList: any = ref([]);
const state: any = ref('');
const stockId: any = ref([]);
const stockList: any = ref([]);
const batchId: any = ref('');
const dpdate: any = ref<String>('');
const dvdate: any = ref<String>('');
const dpdate2: any = ref<String>('');
const dvdate2: any = ref<String>('');

const [registerStockCangKuPage, {openModal: openStockCangKuPage}] = useModal()
const [registerStockClassPage, {openModal: openStockClassPage}] = useModal()
const [registerStockInfoPage, { openModal: openStockInfoPage }] = useModal();

const [register, {closeModal, setModalProps}] = useModalInner((data) => {
  console.log(data.data.openOne)
  formItems.value.openOne = data.data.openOne;
  openType.value=data.openType
  setModalProps({ minHeight: 330 });
})
const dynamicAdReload = async (obj) =>{
  ckId.value=''
  ckList.value=[]
  stockClassId.value=[]
  stockClassList.value=[]
  stockId.value=[]
  stockList.value=[]
  batchId.value=''
  dpdate.value=''
  dvdate.value=''

  databaseTrue.value=obj.accountMode
  modelLoadIng.value=true
  stockCangku()
  findAllStock()
  findByStockClass()
  modelLoadIng.value=false
}
const filterOption = (input: string, option: any) => {
  return option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0;
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
  stockId.value=data.map(a=>a.id)
}
function classAllThrowData(data) {
  stockClassId.value=data
}

function throwStockCangKuData(data) {
  ckList.value=[]
  ckId.value=data[0].cangkuId
  ckList.value.push(data[0])
}

// 日期格式化
function timeformat(dateData) {
  let date = new Date(dateData);
  let y = date.getFullYear();
  let m:any = date.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  let d:any = date.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}

function handleOk() {
  let map={
    ckId:hasBlank(ckId.value)?'':ckId.value,
    state:state.value,
    stockId:stockId.value,
    ckList:ckList.value,
    databaseTrue:databaseTrue.value,
    stockCclassName:stockClassList.value.filter(a=>JSON.parse(JSON.stringify(stockClassId.value)).indexOf(a.uniqueStockclass)!=-1).map(a=>a.stockCclassName),
    stockNum:stockList.value.filter(a=>JSON.parse(JSON.stringify(stockId.value)).indexOf(a.stockNum)!=-1).map(a=>a.stockNum),
    stockName:stockList.value.filter(a=>JSON.parse(JSON.stringify(stockId.value)).indexOf(a.stockNum)!=-1).map(a=>a.stockName)
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
    let templist:any=[]
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
function datePickerChange(){
  if(!hasBlank(dpdate.value)&&!hasBlank(dpdate2.value)){
    let strYear=timeformat(dpdate.value).split('-')[0]
    let endYear=timeformat(dpdate2.value).split('-')[0]
    if(parseInt(strYear)!==parseInt(endYear)){
      dpdate.value=null;dpdate2.value=null
      return message.error('不允许跨年！')
    }
  }
}
function datePickerChange2(){
  if(!hasBlank(dvdate.value)&&!hasBlank(dvdate2.value)){
    let strYear=timeformat(dvdate.value).split('-')[0]
    let endYear=timeformat(dvdate2.value).split('-')[0]
    if(parseInt(strYear)!==parseInt(endYear)){
      dvdate.value=null;dvdate2.value=null
      return message.error('不允许跨年！')
    }
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
  :deep(.ant-select-selector),:deep(.ant-picker), :deep(.ant-input-affix-wrapper) {
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
    background: none;
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
  width: 150px;background-color: #f1f1f1;padding: 10% 4%;height: 490px;
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
