<template>
  <BasicModal
    width="700px"
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
        <span style="font-size: 14px"> 成本核算</span>
      </div>
    </template>
    <div style="display: inline-flex;justify-content: space-between;width: 100%;">
      <div style="width: calc(100% - 150px);height: 100%;">
        <div style="text-align: center;padding: 10px 0 5px;">
          <SearchOutlined style="font-size: 24px;color: #0096c7;margin-top: 2px"/>
          <span style="line-height:30px;font-size: 24px;color: #0096c7;font-weight: bold;">&ensp;供应商应付余额表</span>
        </div>
        <div class="nc-open-content">
          <div class="open-content-up">
            <div class="border-div">
              <span>业务范围</span>
              <AccountPicker  theme="three" @reloadTable="dynamicAdReload"/>
            </div>
            <div class="border-div">
              <span>核算条件</span>
              <label>业务期间：</label>
              &emsp;&emsp;&emsp;
              <a-select
                v-model:value="strDate"
                show-search
                :disabled="dateselflg"
                style="width: 125px;"
                @focus="focusStrDate"
                @change="handleChangeStrDate"
              >
                <a-select-option
                  v-for="item in strDateList"
                  :value="item.stockYear+''+item.stockMonth"
                >
                  {{ item.stockYear+''+item.stockMonth }}
                </a-select-option>
                <template #suffixIcon><CaretDownOutlined style="color:#666666;"/></template>
              </a-select>~
              <a-select
                v-model:value="endDate"
                show-search
                :disabled="dateselflg"
                style="width: 125px"
                @focus="focusEndDate"
                @change="handleChangeEndDate"
              >
                <a-select-option
                  v-for="item in endDateList"
                  :value="item.stockYear+''+item.stockMonth"
                >
                  {{ item.stockYear+''+item.stockMonth }}
                </a-select-option>
                <template #suffixIcon><CaretDownOutlined style="color:#666666;"/></template>
              </a-select>
              <br>
              <label>供应商分类：</label>
              &emsp;&emsp;&nbsp;
              <a-select
                  v-model:value="supClass"
                  :filter-option="filterOption"
                  show-search
                  style="width: 260px;"
                >
                  <a-select-option
                    v-for="item in supClassList"
                    :name="item.cusCclassName"
                    :value="item.uniqueCustclass"
                  >
                    {{ item.cusCclassName }}
                  </a-select-option>
                  <template #suffixIcon><CaretDownOutlined style="color:#666666;"/></template>
                </a-select>
              &nbsp;
              <a style="font-weight: bold;font-size: 18px;"><LinkOutlined @click="supClassPopShow" /></a>
              <br>
              <label>结算供应商：</label>
              &emsp;&emsp;&nbsp;
              <a-select
                v-model:value="jssup"
                show-search
                style="width: 260px;"
              >
                <a-select-option
                  v-for="item in jssupList"
                  :value="item.uniqueCode"
                >
                  {{ item.custName }}
                </a-select-option>
                <template #suffixIcon><CaretDownOutlined style="color:#666666;"/></template>
              </a-select>
              &nbsp;
              <a style="font-weight: bold;font-size: 18px;"><LinkOutlined @click="supPopShow('sup')" /></a>
              <br>
              <label>单据状态：</label>
              <a-select
                v-model:value="dataType"
                style="width: 260px;text-align: center;margin-left: 52px;"
              >
                <a-select-option
                  v-for="item in dataTypeList"
                  :value="item.value"
                >
                  {{ item.title }}
                </a-select-option>
                <template #suffixIcon><CaretDownOutlined style="color:#666666;"/></template>
              </a-select>
              <br>
              <label>业务部门：</label>
              &emsp;&emsp;&emsp;&nbsp;
              <a-select
                :allowClear="true"
                show-search
                :filter-option="filterDeptOption"
                style="width: 260px"
                :options="dataMap['dept']"
                v-model:value="dept"
              >
                <template #suffixIcon><CaretDownOutlined style="color:#666666;"/></template>
              </a-select>&nbsp;
              <a style="font-weight: bold;font-size: 18px;"><LinkOutlined @click="openHeadSelectContent('dept')" /></a>
              <br>
              <label>业务员：</label>
              &emsp;&emsp;&emsp;&emsp;&nbsp;
              <a-select
                :allowClear="true"
                show-search
                :filter-option="filterPsnOption"
                style="width: 260px"
                :options="dataMap['user']"
                v-model:value="psn"
              >
                <template #suffixIcon><CaretDownOutlined style="color:#666666;"/></template>
              </a-select>
              &nbsp;
              <a style="font-weight: bold;font-size: 18px;"><LinkOutlined @click="openHeadSelectContent('psn')" /></a>
            </div>
          </div>
        </div>
      </div>
      <div class="right-btns">
        <Button style="width: 100px;" shape="round" @click="handleOk"  type="primary">开始</Button>
        <Button style="width: 100px;margin-top: 10px" shape="round" @click="handleClose">取消</Button>
      </div>
    </div>

    <SupperModalPop @throwData="throwSupData" @register="registerModalPopPage"/>
    <SupParentModalPop @throwData="throwJsSupData" @register="registerJssupModalPopPage"/>
    <SupClassModalPop @throwData="throwSupClassData" @register="registerSupClassModalPopPage"/>
    <DeptModalPop @register="registerSelectDeptPage" @save="modalDeptData"/>
    <SelectPsn @register="registerSelectPsnPage" @save="modalPsnData"/>
<!--    <StockInfoModalPop @throwData="throwStockData" @register="registerStockPopPage"/>-->
<!--    <StockCangKuModalPop @throwData="throwStockCangkuData" @register="registerStockCangKuPopPage"/>-->
<!--    <ClassAllModalPop @throwData="throwStockClassData" @register="registerStockClassPopPage"/>-->
  </BasicModal>
</template>

<script setup="props, {content}" lang="ts">
/********************************************* 公共参数 ********************************************************/
import {BasicModal, useModal, useModalInner} from '/@/components/Modal'
import {
  message,
  Button,
  Checkbox as ACheckbox,
  DatePicker as ADatePicker,
  Input as AInput,
  Radio as ARadio,
  Select as ASelect,
  Tabs as ATabs
} from "ant-design-vue"
import {AppstoreOutlined, SearchOutlined,CaretDownOutlined,LinkOutlined} from '@ant-design/icons-vue';
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {useUserStore} from "/@/store/modules/user";
import {useMessage} from "/@/hooks/web/useMessage";
import {ref} from "vue";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import router from "/@/router";
import {useTabs} from "/@/hooks/web/useTabs";
import {periodAllList} from "/@/api/record/group/im-unit";
import {hasBlank, pointMessage} from "/@/api/task-api/tast-bus-api";
import moment, {Moment} from 'moment';
import dayjs from "dayjs";
import { findAll as findSupAll} from "/@/api/record/supplier_data/supplier";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {findAll as stockAll} from "/@/api/record/stock/stock";
import {findAll as cangkuAll} from "/@/api/record/stock/stock-cangku";
import {findAllStockClass} from "/@/api/record/stock/stock_class";
import SupperModalPop from "/@/views/boozsoft/global/popup/supplier/modalPop.vue";
import SupParentModalPop from "/@/views/boozsoft/global/popup/supplier/parentModalPop.vue";
import SupClassModalPop from "/@/views/boozsoft/global/popup/sup_class/modalPop.vue";
import DeptModalPop from "/@/views/boozsoft/global/popup/dept/select-dept.vue";
import SelectPsn from "/@/views/boozsoft/global/popup/dept/select-psn.vue";
import StockInfoModalPop from "/@/views/boozsoft/stock/stock_info/popup/stockInfoModalPop.vue";
import ClassAllModalPop from "/@/views/boozsoft/stock/stock_class/popup/classAllModalPop.qvue";
import {GetCustomerClassTree} from "/@/api/record/system/supplier_class";
import {findStockCaiGouList} from "/@/api/record/stock/stock-caigou";

const { closeCurrent } = useTabs(router);
const emit = defineEmits(['register', 'save'])
const ARangePicker = ADatePicker.RangePicker
const ASelectOption = ASelect.Option
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
const dynamicAccId = ref('')
const formItems: any = ref({});
//************************************* new ***************************
let radiovalue = ref('1');
const riqi: any = ref([]);
const endDate = ref<String>("")
const strDate = ref<String>("")
let endDateList: any = ref([])
let strDateList: any = ref([])
let time: any = ref<Moment[]>([]);
// 日期是否可选
let timeselflg: any = ref(true);
const maxPingzhengQj = ref('')
// 期间是否可选
let dateselflg: any = ref(false);
// 会计区间
const dateList: any = ref([])
const quarterList: any = ref([])
//************************************* 查询条件 ***************************
const strNum: any = ref('')
const endNum: any = ref('')
const dataType: any = ref('1')
const dataTypeList: any = ref([{title:'全部',value:''},{title:'已审核',value:'1'},{title:'未审核',value:'0'}])
const sup: any = ref('')
const supList: any = ref([])
const jssup: any = ref('')
const jssupList: any = ref([])
const stock: any = ref('')
const stockList: any = ref([])
const ggxh: any = ref('')
const ggxhList: any = ref([])
const cangku: any = ref('')
const cangkuList: any = ref([])
const stockClass: any = ref('')
const stockClassList: any = ref([])
const supClass: any = ref('')
const supClassList: any = ref([])
const dept: any = ref('')
const psn: any = ref('')
const dataMap: any = ref({})

const [registerModalPopPage, {openModal: openMoalPopPage}] = useModal();
const [registerJssupModalPopPage, {openModal: openJssupMoalPopPage}] = useModal();
const [registerSupClassModalPopPage, {openModal: openSupClassMoalPopPage}] = useModal();
const [registerStockPopPage, {openModal: openStockPopPage}] = useModal();
const [registerStockCangKuPopPage, {openModal: openStockCangkuPopPage}] = useModal();
const [registerStockClassPopPage, {openModal: openStockClassPopPage}] = useModal();
const [registerSelectDeptPage, {openModal: openSelectDeptPage}] = useModal()
const [registerSelectPsnPage, {openModal: openSelectPsnPage}] = useModal()


const [register, {closeModal, setModalProps}] = useModalInner((data) => {
  formItems.value.openOne = data.data.openOne;
  openType.value=data.openType
  setModalProps({ minHeight: 410 });
})
const dynamicAdReload = async (obj) =>{
  databaseTrue.value=obj.accountMode
  dynamicAccId.value=obj.accId
  modelLoadIng.value=true

  await reLifeQueryParameter(obj.accountMode,obj.target.id)
  await getSup(obj.accountMode)
  await getStock(obj.accountMode)
  await getCangku(obj.accountMode)
  await getStockClass(obj.accountMode)
  await getSupClass(obj.accountMode)

  await reLifeEtcList(obj.accountMode)
  modelLoadIng.value=false
}
const modalDeptData = (o) => {

}
const modalPsnData = (o) => {

}
const openHeadSelectContent = (type) => {
  switch (type) {
    case 'dept':
      openSelectDeptPage(true, {
        currentDynamicTenant: databaseTrue.value
      })
      break;
    case 'psn':
      openSelectPsnPage(true, {
        currentDynamicTenant: databaseTrue.value
      })
      break;
  }
}
async function reLifeEtcList(accountMode) {
  let q = ['user', 'cust', 'dept', 'operator', 'warehouse', 'stock', 'whClass']
  dataMap.value = (await useRouteApi(findStockCaiGouList, {schemaName: accountMode})([...new Set(q)].join(',')))
}
const filterOption = (input: string, option: any) => {
  return option.name.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}
const filterDeptOption = (input: string, option: any) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}
const filterPsnOption = (input: string, option: any) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}

async function getSupClass(accountMode) {
  const data = await useRouteApi(GetCustomerClassTree,{schemaName: accountMode})('')
  if(data.length>0){
    supClassList.value=data.filter(a=>a.cusBend=='1')
  }
}
function supClassPopShow() {
  openSupClassMoalPopPage(true, {
    database: databaseTrue.value,
    accId: dynamicAccId.value,
  });
}
function throwSupClassData(data) {
  supClass.value=data[0].uniqueCustclass
}

async function getSup(accountMode) {
  let supdata=await useRouteApi(findSupAll,{schemaName: accountMode})({uniqueCustclass:'',flag:'',searchConditon:{requirement:'',value:''}})
  supList.value=supdata.items
  let jssup=supdata.items.filter(a=>!hasBlank(a.uniqueCodeCcus))
  jssupList.value=jssup
}
function supPopShow(type) {
  openJssupMoalPopPage(true, {
    database: databaseTrue.value,
    accId: dynamicAccId.value,
  });
}
function throwSupData(data) {
  let temp=data[data.length-1]
  sup.value=temp.uniqueCode
}
function throwJsSupData(data) {
  let temp=data[data.length-1]
  jssup.value=temp.uniqueCode
}


async function getStock(accountMode) {
  let temp=await useRouteApi(stockAll,{schemaName: accountMode})({stockFlag:'', stockClass:'', searchConditon:{requirement:'stockNum', value:''}})
  stockList.value=temp
}
async function stockPopShow() {
  openStockPopPage(true,{
    database:databaseTrue.value,
  })
}
function throwStockData(data) {
  let temp=data[data.length-1]
  stock.value=temp.stockNum
}

async function getCangku(accountMode) {
  let temp=await useRouteApi(cangkuAll,{schemaName: accountMode})({searchConditon:{requirement:'stockNum', value:''}})
  cangkuList.value=temp.items
}
function stockCangKuModalShow() {
  openStockCangkuPopPage(true,{
    database:databaseTrue.value,
  })
}
function throwStockCangkuData(data) {
  let temp=data[data.length-1]
  cangku.value=temp.id
}

async function getStockClass(accountMode) {
  let temp=await useRouteApi(findAllStockClass,{schemaName: accountMode})({page:'1',size:'100000',stockFlag: '', searchValue: '', superid: ''})
  stockClassList.value=temp.items
}
function stockClassModalShow() {
  openStockClassPopPage(true,{
    database:databaseTrue.value,
  })
}
function throwStockClassData(data) {
  let temp=data[data.length-1]
  stockClass.value=temp
}

const reLifeQueryParameter = async (dynamicTenant,id) => {
  // 加载DB所有会计期间与季报数据
  dateList.value = await periodAllList({id: id});
  if (dateList.value.length > 0) {
    const busDates = busDate.split('-');
    // 查看当前业务日期与期间列表年度是否匹配
    let blist = dateList.value.filter(it => it.stockYear == busDates[0])
    if (blist.length > 0) { // 存在与业务日期相匹配的年度 使用业务期间 反之使用最大年度期间
      let busQj = blist.filter(it => it.stockMonth == (busDates[1]))[0]
      maxPingzhengQj.value = (busQj.stockYear+''+busQj.stockMonth)
      strDate.value = (busQj.stockYear+''+busQj.stockMonth)
      endDate.value = (busQj.stockYear+''+busQj.stockMonth)
    } else {
      // 获取最大凭证期间
      const qijian = ''
      if (hasBlank(qijian)) {
        maxPingzhengQj.value = ''
        strDate.value = dateList.value[0].value
        endDate.value = dateList.value[dateList.value.length - 1].value
      } else {
        maxPingzhengQj.value = qijian.substring(0, 4) + '-' + qijian.substring(4, 6)
        strDate.value = maxPingzhengQj.value
        endDate.value = maxPingzhengQj.value
      }
    }
  } else {
    await pointMessage({title: '温馨提示', content: '请先进行账套年度授权后再进行查询操作！', delay: true})
    strDate.value = ''
    endDate.value = ''
  }
}

function radiochange(val) {
  timeselflg.value = val.target.value === '1';
  dateselflg.value = val.target.value === '2';
  if (val.target.value === '1') {
    riqi.value = '';
    strDate.value = maxPingzhengQj.value;
    endDate.value = maxPingzhengQj.value;
  } else {
    strDate.value = '';
    endDate.value = '';
  }
}
async function focusStrDate() {
  strDateList.value = dateList.value
}
async function focusEndDate() {
  if (strDate.value) {
    endDateList.value = dateList.value.filter(o => o.stockYear+''+o.stockMonth >= strDate.value)
  } else {
    endDateList.value = dateList.value
  }
}
async function handleChangeStrDate() {
  endDate.value = strDate.value

  return false;
  if (strDate.value === undefined) {
    endDate.value = '';
    timeselflg.value = false;
  }
  // 开始日期变动  如果开始日期大于结束于日期 则重置结束日期
  if (endDate.value) {
    if (strDate.value > endDate.value) {
      endDate.value = '';
    }
    timeselflg.value = true;
  }
}
function timechange() {
  dateselflg.value = time.value.length > 0;
}
async function handleChangeEndDate() {
  if (endDate.value === undefined) {
    strDate.value = '';
    timeselflg.value = false;
  }
  // 开始日期变动  如果结束日期小于开始日期 则重置开始日期
  if (strDate.value) {
    if (strDate.value > endDate.value) {
      strDate.value = '';
    }
  }
}
const checkChange = (e) => {
  let v = e.target.value
  let dates = [strDate.value.substring(0,4),strDate.value.substring(4,6)]
  switch (v) {
    case '1':
      let the = parseInt(dates[1])
      if (the != 1) {
        strDate.value = dates[0]  + (((the - 1) > 9) ? `${(the - 1)}` : `0${(the - 1)}`)
        endDate.value = strDate.value
      } else {
        message.info('暂无上月！')
      }
      break
    case '2':
      strDate.value = dates[0]  + busDate.split('-')[1]
      endDate.value = strDate.value
      break
    case '3':
      let qList = quarterList.value.filter(it => it.iyear == dates[0])
      if (qList.length > 0) { // 存在季报
        let arr = qList.filter(it => {
          let min = moment(it.iyear + '-' + it.dateStart, 'YYYY-MM-DD')
          let max = moment(it.iyear + '-' + it.dateEnd, 'YYYY-MM-DD')
          let the = moment(strDate.value + '-01', 'YYYY-MM-DD')
          return min <= the && the <= max
        })
        strDate.value = arr[0].iyear + '-' + arr[0].dateStart.substring(0, 2)
        endDate.value = arr[0].iyear + '-' + arr[0].dateEnd.substring(0, 2)
      } else {
        let min = '01'
        let max = '03'
        let v = dates[1]
        switch (v) {
          case '04':case '05':case '06':
            min = '04'
            max = '06'
            break
          case '07' :case '08' :case '09':
            min = '07'
            max = '09'
            break
          case '10' :case '11' :case '12':
            min = '10'
            max = '12'
            break
        }
        strDate.value = dates[0] +  min
        endDate.value = dates[0] +  max
      }
      break
    case '4':
      let list = dateList.value.filter(it => it.stockYear == dates[0])
      strDate.value = dates[0]+list[0].stockMonth
      endDate.value = dates[0]+list[list.length - 1].stockMonth
      break
    case '5':
      let d = dayjs(busDate, 'YYYY-MM-DD')
      riqi.value = [d, d]
      break
    case '6':
      let yday = dayjs(busDate, 'YYYY-MM-DD').add(-1, 'day')
      riqi.value = [yday, yday]
      break
    case '7':
      let yday1 = dayjs(busDate, 'YYYY-MM-DD').add(-2, 'day')
      riqi.value = [yday1, yday1]
      break
    case '8':
      let yday2 = dayjs(busDate, 'YYYY-MM-DD').endOf('month')
      riqi.value = [yday2, yday2]
      break
  }
}



function handleOk() {
  let strTime=strDate.value
  let endTime=endDate.value
  let startDate='0'
  if(strDateList.value.length>0 && strDate.value.substring(4,6)==strDateList.value[0].stockMonth){
    startDate='1'
  }
  let map={
    strDate:strTime,
    endDate:endTime,
    dataType:dataType.value,
    sup:sup.value,
    jssup:jssup.value,
    supClass:supClass.value,
    dept:dept.value,
    psn:psn.value,
    databaseTrue:databaseTrue.value,
    startDate:startDate
  }
  emit('save', map);
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
// 日期格式化
function timeformat(dateData) {
  let date = new Date(dateData);
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  let d = date.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
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
    text-align: left ;

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
  width: 150px;background-color: #f1f1f1;padding: 10% 4%;height: 400px;
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
