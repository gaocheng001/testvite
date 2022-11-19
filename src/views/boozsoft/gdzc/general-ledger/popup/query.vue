<template>
  <BasicModal
    width="600px"
    v-bind="$attrs"
    title="固定资产总账"
    @ok="handleOk()"
    :loading="loading"
    @cancel="handleClose()"
    @register="register"
  >
    <div class="nc-open-content">
      <div class="open-content-up">
        <ul>
          <li>
            <AccountPicker theme="two" @reloadTable="dynamicAdReload"/>
          </li>
          <li>
            <span><span style="color: red">*</span>管理类型：</span>
            <Select
              v-model:value="accountCode"
              show-search
              option-filter-prop="children"
              style="width: 210px;text-align: center;"
              :filter-option="filterOption"
            >
              <SelectOption
                v-for="item in accountList"
                :key="item.id"
                :value="item.id"
              >
                {{ 'FA'+item.faAccId +'-'+ item.faAccName }}
              </SelectOption>
            </Select>
          </li>
          <li>
            <span><span style="color: red">*</span>期间：</span>
            <Select
              v-model:value="strDate"
              show-search
              :filter-option="filterOption"
              style="width: 190px;text-align: center;"
            >
            </Select>
            <span> -- </span>
            <Select
              v-model:value="strDate"
              show-search
              :filter-option="filterOption"
              style="width: 190px;text-align: center;"
            >
            </Select>
          </li>
<!--          <li>
            <span>条&emsp;&emsp;件：</span>
            <Select style="width: 210px;text-align: center;" v-model:value="styleValue" @change="handleChangeLb">
              <SelectOption v-for="d in styleList" :value="d.value">
                {{ d.label }}
              </SelectOption>
            </Select>
          </li>v-if="showLb"-->
          <li >
            <span>资产类别：</span>
            <Select style="width: 398px;text-align: center;" v-model:value="lb" >
              <SelectOption v-for="d in lbList" :value="d.ecCode">
                {{ d.ecName }}
              </SelectOption>
            </Select>
          </li>
<!--         v-if="showXm" -->
          <li >
            <span>项&emsp;&emsp;目：</span>
            <Select style="width: 398px;text-align: center;"  >
              <SelectOption v-for="d in xmList" :value="d.value">
                {{ d.label }}
              </SelectOption>
            </Select>
          </li>
<!--      v-if="showBm"    -->
          <li >
            <span>部&emsp;&emsp;门：</span>
            <Select style="width: 398px;text-align: center;"  >
              <SelectOption v-for="d in bmList" :value="d.value">
                {{ d.label }}
              </SelectOption>
            </Select>
          </li>
<!--          <li>
            <span v-if="jcIsShow">类别级次：</span>
            <Select
              default-value="1"
              v-if="jcIsShow"
              v-model:value="minJc"
              @change="handleChangeMinCj"
              style="width: 90px; text-align: center;">
              <SelectOption v-for="d in jcList"  :value="d.value">
                {{ d.label }}
              </SelectOption>
            </Select>
            <span v-if="jcIsShow">&emsp;~&emsp;</span>
            <Select
              default-value="1"
              v-model:value="maxJc"
              @focus="handleFocusMaxCj"
              v-if="jcIsShow"
              style="width: 90px; text-align: center">
              <SelectOption v-for="d in maxJcList"  :value="d.value">
                {{ d.label }}
              </SelectOption>
            </Select>
          </li>-->
        </ul>
      </div>
    </div>
  </BasicModal>
</template>

<script setup="props, {content}" lang="ts">
import {ref, unref, onMounted, reactive} from 'vue'
import {BasicModal, useModalInner} from '/@/components/Modal'
import {
  DatePicker as ADatePicker,
  Select ,
  Input,
  Radio as ARadio,
  Tabs as ATabs, message
} from "ant-design-vue"
import { useTabs } from '/@/hooks/web/useTabs';
import router from "/@/router";
import {
  findMaxJc,
  findPeriod,
  findAccountList, findFaAssetType
} from '/@/api/record/gdzc/generalLedger/data';
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {getCurrentAccountName, hasBlank} from "/@/api/task-api/tast-bus-api";
import {useUserStore} from "/@/store/modules/user";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-GDZC.vue";

import {findByQueryPlan, saveQueryPlan} from "/@/api/query-plan/queryPlan";
import {useNcLogger} from "/@/utils/boozsoft/record/recordUtils";

const userStore = useUserStore();
const { closeCurrent } = useTabs(router);
const ARangePicker = ADatePicker.RangePicker
const SelectOption = Select.Option
const InputSearch = Input.Search
const ARadioGroup = ARadio.Group
const ARadioButton = ARadio.Button
const ATabPane = ATabs.TabPane
const emit=defineEmits(['register','save'])
const data = []
const formItems: any = ref({})
let changeBeforeModel: any = {}
// 会计区间
const rqList: any = ref([{
  uniqueCode: '1',
  iyear: '2021',
  imonth: '12'
}])
// 会计科目
const kmList: any = ref([])
//级次
const jcList: any = ref([])
//币种
const bzList: any = ref([])
const year = new Date().getFullYear();
const years = useCompanyOperateStoreWidthOut().getLoginDate.split('-')[0];
const month = useCompanyOperateStoreWidthOut().getLoginDate.split('-')[1];
const endDate = ref<String>(years+'-'+month)
const strDate = ref<String>(years + '-01');
let endDateList: any = ref([])
let strDateList: any = ref([])
const pzType: any = ref([]);

let loading: any = ref(true)

const pzTypeList: any = ref([]);

let showLb: any = ref(true)
let showXm: any = ref(false)
let showBm: any = ref(false)

const jc = ref<number>(1)
let maxJcList: any = ref([])
let minJcList: any = ref([])
const minJc = ref<number>(1)
const maxJc = ref<number>(1)

const showStyle = ref<string>('T1')
const fontSize = ref<string>('MIN')
const jd = ref<number>(2)
const ishaveRjz = ref<boolean>(true)
const isShowQjlh = ref<boolean>(false)

const kmKj = ref<string>('')

const userId = ref<string>('')

let styleValue: any = ref('T1');
let styleList: any = ref([
  {
    value: 'T1',
    label: '类别'
  },{
    value: 'T2',
    label: '项目'
  },{
    value: 'T3',
    label: '部门'
  },{
    value: 'T4',
    label: '类别项目'
  },{
    value: 'T5',
    label: '类别部门'
  },{
    value: 'T6',
    label: '部门类别'
  },{
    value: 'T7',
    label: '项目类别'
  },{
    value: 'T8',
    label: '项目部门'
  },{
    value: 'T9',
    label: '部门项目'
  }
]);

let lbList: any = ref([]);
let xmList: any = ref([]);
let bmList: any = ref([]);

let lb: any = ref();


const queryPlan: any = ref([]);
const activeKey: any = ref('');
const databaseyear = ref(year);
// 页面变量
const pageParameter = reactive({
  companyCode: '',
  companyName: '',
})
//查询条件
const seach : any = ref({})

const [register, {closeModal, setModalProps, changeOkLoading}] = useModalInner((data) => {
  // 方式2
  formItems.value.openOne = data.data.openOne
  changeBeforeModel = JSON.parse(JSON.stringify(formItems.value))
  getQueryPlan()
  setModalProps({minHeight: 360});
  if(loading.value === true){
    changeOkLoading(true);
  }
})
let isChanged: boolean = false

//获取当前年月
const nowDate = ()=>{
  const nowDate = new Date();
  const date = {
    year: nowDate.getFullYear(),
    month: nowDate.getMonth() + 1,
    date: nowDate.getDate(),
  }
  const newmonth = date.month>10?date.month:date.month
  return date.year + '-' + newmonth
}
const recordName = 'gd-general-ledger'
const {ncLogger} = useNcLogger({recordName})
// 数据库模式名称
const databases = ref(getCurrentAccountName(false))
const accId = ref(getCurrentAccountName(true))
async function handleOk() {
  formItems.value.queryMode = '1'

  if(strDate.value.length <= 0 && endDate.value <= 0 ){
    message.error('请选择日期!');
    return
  }

  formItems.value.strDate = strDate.value

  formItems.value.accountCode = accountCode.value

  formItems.value.lbList = lbList.value
  formItems.value.lb = lb.value

  formItems.value.jc = jc.value
  if(jc.value === 1){
    formItems.value.minJc = minJc.value
    formItems.value.maxJc = maxJc.value
  }
  formItems.value.showStyle = showStyle.value
  formItems.value.fontSize = fontSize.value
  formItems.value.styleValue = styleValue.value

  formItems.value.accId = databases.value
  // 过滤会计科目  重新过滤
  /*let list = kmList.value

  if(maxKm.value){
    list = list.filter(o =>  o.ccode <= maxKm.value)
  }
  if(minKm.value){
    list = list.filter(o =>  o.ccode >= minKm.value)
  }

  if(jc.value === 2){
    list = list.filter(o =>  o.bend === '1')
  }else{
    if(minJc.value){
      list = list.filter(o =>  minJc.value <= o.igrade)
    }
    if(maxJc.value){
      list = list.filter(o =>  o.igrade <= maxJc.value)
    }
  }*/

  formItems.value.pageParameter = pageParameter;

  const queryPlanEntity={
    accountId:databaseTrue.value,
    owningMenuName:'资产总账',
    owningPlan:activeKey.value,
    planPerson:userStore.getUserInfo.id,
    queryConditions:{
      ishaveRjz:formItems.value.ishaveRjz,
      bend:formItems.value.jc,
      strDate:formItems.value.strDate,
      endDate:formItems.value.endDate,
      minJc:formItems.value.minJc,
      maxJc:formItems.value.maxJc,
      bz:formItems.value.bz,
      fontSize:formItems.value.fontSize,
      styleValue:formItems.value.styleValue,
      pzType:pzType.value
    }
  }
  await saveQueryPlan(queryPlanEntity);
  //添加日志
  ncLogger.info("资产总账查询:"+JSON.stringify(queryPlanEntity))
  emit('save', {data: unref(formItems)});
  closeModal()
  return true
}

function timeformat(dateData) {
  let date = new Date(dateData);
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  let d = date.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m ;
}

async function handleClose() {
  if (null != formItems.value.openOne && formItems.value.openOne == 1) {
    await closeCurrent();
    router.push('/');
  }
}

async function handleChangeStrDate() {
  // 开始日期变动  如果开始日期大于结束于日期 则重置结束日期
  if(endDate.value){
    if(strDate.value > endDate.value){
      endDate.value = strDate.value
    }
    userId.value = userStore.getUserInfo.id

  }
}
async function handleChangeEndDate() {
  // 开始日期变动  如果结束日期小于开始日期 则重置开始日期
  if(strDate.value){
    if(strDate.value > endDate.value){
      strDate.value = endDate.value
    }
    // 会计科目
    userId.value = userStore.getUserInfo.id

  }
}

async function focusEndDate() {
  if(strDate.value){
    endDateList.value = rqList.value.filter( o => o.value >= strDate.value)
  }else{
    endDateList.value = rqList.value
  }
}

const handleChangeMinKm = () => {

};
const handleFocusMaxKm = () => {
  //获取焦点时 如果最小科目已选择 判断过滤小于最小科目的数据

};

const filterOption = (input: string, option: any) => {
  return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}

const handleChangeMinCj = () => {
  if(maxJc.value && maxJc.value < minJc.value){
    maxJc.value = minJc.value
  }
};

const handleFocusMaxCj = () => {
  //获取焦点时 如果最小科目已选择 判断过滤小于最小科目的数据
  if(minJc.value){
    maxJcList.value = jcList.value.filter( o => o.value >= minJc.value)
  }else{
    maxJcList.value = jcList.value
  }
};
const minkmList = ref([])
const handleChangeJc = () => {
  // 过滤会计科目
  let list = minkmList.value
  if(jc.value === 2){
    list = list.filter(o =>  o.bend === '1')
  }else{
    if(minJc.value){
      list = list.filter(o =>  minJc.value <= o.igrade)
    }
    if(maxJc.value){
      list = list.filter(o =>  o.igrade <= maxJc.value)
    }
  }
  formItems.value.kmList = list;
};

const whetherGroup = ref(false)
// 数据库模式名称
const database = ref(getCurrentAccountName(false))

async function newfindAllCode(s,start) {
  // 会计科目
  let list=await useRouteApi(findPeriod,{schemaName:accId.value})({ strDate: start });
  return list;
}
function tabChange(val) {
  if(val===''){             //----------------------------标准
    ishaveRjz.value = true
    jc.value = 1
    strDate.value = year + '-01'
    endDate.value = year + '-' + month
    minJc.value = 1
    maxJc.value = 1
    styleValue.value = '1'
    fontSize.value = 'MIN'
  }else if(val==='1'){     //----------------------------个人
    getQueryPlan()
  }else if (val === '0'){       //----------------------------集团

  }
}

async function styleChange(val) {

}

const databaseTrue = ref(getCurrentAccountName(true));

onMounted( ()=>{
  AllCondition();
})
async function dynamicAdReload(data) {
  database.value=data.accId
  pageParameter.accId=data.accId
  pageParameter.database=data.accId+'-'+data.year
  databaseyear.value=data.year
  pageParameter.accNameAll=data.target.accName
  console.log(databaseTrue.value)
  console.log(data.accId+'-'+data.year)
  if(databaseTrue.value != data.accId+'-'+data.year){
    changeOkLoading(true);
    loading.value  = true
   // AllCondition();
  }
  databaseTrue.value =data.accId+'-'+data.year

}

const accountList = ref([]);
const accountCode = ref();
async function AllCondition() {
  findByDateBase()

  rqList.value = await findPeriod('1467737844285050880');
  console.log(rqList.value)
  //资产类别
  lbList.value  = await useRouteApi(findFaAssetType, {schemaName: databaseTrue})({});
  lbList.value.unshift({
    ecCode:'0',
    ecName:'全部',
  })
  lb.value = '0'
  //项目
  //xmList.value  = await useRouteApi(findPsnAll, {schemaName: databaseTrue})({});
  //部门
  //bmList.value  = await useRouteApi(findProject, {schemaName: databaseTrue})({});

  userId.value = userStore.getUserInfo.id

  //管理代码
  accountList.value = await findAccountList();
  accountCode.value = accountList.value[0].id

  //级次
  jcList.value = []
  const num = await useRouteApi(findMaxJc, {schemaName: databaseTrue})({});
  console.log(num)
  for (let i = 1; i < parseInt(num) + 1; i++) {
    jcList.value.push({
      label: i,
      value: i,
    });
  }
  console.log(jcList.value)

  changeOkLoading(false);
  loading.value  = false
}
const getAdObjInfoByCoCode = (value, type,accList) => {
  let list = accList.filter(item => item[type] == value)
  return list.length > 0 ? list[0] : null
}

const accAuthList = ref([])
async function findByDateBase() {

  accAuthList.value = useCompanyOperateStoreWidthOut().getAccountAuthorizeList
  let codes = getAdObjInfoByCoCode(database.value, 'accId', accAuthList.value)
  if (codes != null) {
    pageParameter.companyCode = codes.coCode
    pageParameter.companyName = codes.accNameCn
  }

}
async function getQueryPlan() {
  let queryPlanIngo= await findByQueryPlan(databaseTrue.value,'资产总账')
  if(queryPlanIngo!=null){
    activeKey.value='1'
    queryPlan.value=queryPlanIngo

    ishaveRjz.value=JSON.parse(queryPlanIngo.queryConditions).ishaveRjz
    jc.value=JSON.parse(queryPlanIngo.queryConditions).bend
    strDate.value=JSON.parse(queryPlanIngo.queryConditions).strDate
    endDate.value=JSON.parse(queryPlanIngo.queryConditions).endDate
    minJc.value=JSON.parse(queryPlanIngo.queryConditions).minJc
    maxJc.value=JSON.parse(queryPlanIngo.queryConditions).maxJc
    //styleValue.value=JSON.parse(queryPlanIngo.queryConditions).styleValue
    console.log(styleValue.value)
    fontSize.value=JSON.parse(queryPlanIngo.queryConditions).fontSize
  }
}
const jcIsShow = ref(true)
function handleChangeLb() {
    //根据类别 显示级次
    if(['T1','T2','T3','T4','T5'].includes(styleValue.value)){
      jcIsShow.value = false
    }else{
      jcIsShow.value = true
    }
  console.log(styleValue.value)
   if('T1' === styleValue.value){
     showLb.value = true
     showXm.value = false
     showBm.value = false
   }else if('T2' === styleValue.value){
     showXm.value = true
     showLb.value = false
     showBm.value = false
   }else if('T3' === styleValue.value){
     showBm.value = true
     showLb.value = false
     showXm.value = false
   }else if('T4' === styleValue.value){
     showLb.value = true
     showXm.value = true
     showBm.value = false
   }else if('T5' === styleValue.value){
     showLb.value = true
     showBm.value = true
     showXm.value = false
   }else if('T6' === styleValue.value){
     showXm.value = true
     showLb.value = true
     showBm.value = false
   }else if('T7' === styleValue.value){
     showBm.value = true
     showLb.value = true
     showXm.value = false
   }else if('T8' === styleValue.value){
     showXm.value = true
     showBm.value = true
     showLb.value = false
   }else if('T9' === styleValue.value){
     showBm.value = true
     showXm.value = true
     showLb.value = false
   }

}

</script>
<style lang="less" scoped>

.ant-btn-group{
  display: inline-block;
}

:deep(.ant-modal) {
  top: 20px;
}

.nc-open-content {
  position: relative;
  .open-content-title {
    > div {
      display: inline-block;
    }

    > div:nth-of-type(1) {
      width: 200px;
      background-color: #efeeee;
      color: black;
      font-size: 20px;
      text-align: center;
      padding: 5px 10px
    }
  }

  .open-content-up {
    position: relative;

    .ocup-position {
      position: absolute;
      left: 0;
      width: 170px;
      background-color: #0096c7;
      color: white;
      font-size: 16px;
      text-align: center;
      padding: 5px 10px;
    }
    .ocup-position:nth-of-type(1) {
      top: 0px;
    }
    .ocup-position:nth-of-type(2) {
      top: 190px;
    }

    ul {
      padding: 10px 30px;

      li {
        margin: 15px 0;

        span {
          font-size: 14px;
          color: #747272;
          font-weight: bold;
        }

        > span:nth-of-type(1), .right_span {
          display: inline-block;
          width: 100px;
        }

        .ant-select {
          font-size: 14px;
        }
      }
    }
  }

  .open-content-foot {
    display: block;
    position: fixed;
    margin-top: 43px;
  }


  .ant-select-selection-search-input {
    border-bottom: none !important;
  }

  .ant-input:focus {
    box-shadow: none;
  }

  :deep(.ant-select-selector) {
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
  }

  label {
    text-align: right;
    width: 110px;
    display: inline-block;
    padding: 5px 10px;
  }

  //.ant-radio-group {
  //  .ant-radio-wrapper {
  //    width: 70px;
  //    .ant-radio-input{
  //      border-color: slategrey;
  //    }
  //  }
  //  p:nth-of-type(2){
  //    margin-bottom: 0;
  //  }
  //}
}


</style>
<style  lang="less" scoped>
@import '/@/assets/styles/part-open.less';
</style>
