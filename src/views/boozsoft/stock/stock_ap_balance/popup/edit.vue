<template>
  <BasicModal
    width="500px"
    :height="300"
    v-bind="$attrs"
    :closable="false"
    @ok="handleOk()"
    @register="register"
  >
    <template #title>
      <div style="display: flex;color: #0096c7;">
        <span style="line-height:40px;font-size: 28px;">
          <FormOutlined style="font-size: 24px;font-weight: bold"/>
        </span>
        <span style="line-height:40px;font-size: 22px;">
          &nbsp;&nbsp;应付款期初余额
        </span>
      </div>
    </template>
    <div
      class="nc-open-content"
      style="height: 100%;overflow: auto;"
    >
      <div class="open-content-up" style="text-align: center;margin-top: 30px;">
        <label style="margin-left: 40px;">应付类型：</label>
        <a-select allowClear style="width: 200px;" v-model:value="formItems.arStyle" @change="arStyleChange">
          <a-select-option value="XSFP">销售发票</a-select-option>
          <a-select-option value="YFK">应付款</a-select-option>
          <a-select-option value="YUFK">预付款</a-select-option>
          <a-select-option value="YFPJ">应付票据</a-select-option>
          <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
        </a-select>
        <br>
        <label style="margin-left: 40px;">客户名称：</label>
        <a-input style="width: 200px;" v-model:value="formItems.arCustName"/>
        <br>
        <label style="margin-left: 40px;">付款方向：</label>
        <a-select style="width: 200px;" v-model:value="formItems.arDir">
          <a-select-option v-for=" item in arDirList" :value="item.value" >{{item.title}}</a-select-option>
          <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
        </a-select>
        <br>
        <label style="margin-left: 40px;">预付账款：</label>
        <a-input style="width: 200px;" :readonly="ysIsumBenbiReadonly" v-model:value="formItems.ysIsumBenbi" oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,10})?).*$/g, '$1')"
                 onkeyup="value=value.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'')"
                 onblur="value = value == ''?'0.00':(parseFloat(value).toFixed(4).replace(/\d+/, function (n) {return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) { return $1 + ','})}));"
                 onfocus="value = value == '0.00'?'':value.replace(/,/g,'')"
                 @keyup="ysIsumBenbiMoney"/>
        <br>
        <label style="margin-left: 40px;">应付账款：</label>
        <a-input style="width: 200px;" :readonly="arIsumBenbiReadonly" v-model:value="formItems.arIsumBenbi"
                 oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,10})?).*$/g, '$1')"
                 onkeyup="value=value.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'')"
                 onblur="value = value == ''?'0.00':(parseFloat(value).toFixed(4).replace(/\d+/, function (n) {return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) { return $1 + ','})}));"
                 onfocus="value = value == '0.00'?'':value.replace(/,/g,'')"
                 @keyup="arIsumBenbiMoney"
        />
        <br>
        <label style="margin-left: 40px;">期初余额：</label>
        <a-input readonly style="width: 200px;" v-model:value="formItems.isumBenbi" oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,10})?).*$/g, '$1')"/>
        <br>
        <label style="margin-left: 70px;">项目：</label>
        <a-input style="width: 200px;" v-model:value="proName"/>
        &nbsp;
        <a style="font-weight: bold;font-size: 18px;"><LinkOutlined @click="openSelectProject" /></a>
        <br>
        <label style="margin-left: 40px;">单据日期：</label>
        <a-date-picker style="width: 200px;" v-model:value="formItems.ddate" @change="ddateChange"/>
      </div>
    </div>
    <SelectProject @save="saveSelectProject" @register="registerSelectProjectPage"/>
  </BasicModal>
</template>
<script setup="props, { content }" lang="ts">
import {CaretDownOutlined, FormOutlined, LinkOutlined} from '@ant-design/icons-vue'
import {ref} from 'vue';
import {BasicModal, useModal, useModalInner} from '/@/components/Modal';
import {
  DatePicker as ADatePicker,
  Form as AForm,
  Input as AInput,
  Select as ASelect,
  Statistic as AStatistic,
} from 'ant-design-vue';
import {getCurrentAccountName} from "/@/api/task-api/tast-bus-api";
import {useMessage} from "/@/hooks/web/useMessage";
import {getThisAdInfoData} from "/@/api/record/system/financial-settings";
import SelectProject from '/@/views/boozsoft/global/popup/project/select-project.vue'
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {stockArBalanceSave} from "/@/api/record/stock/stock_ap_balance";
import dayjs from "dayjs";


const ASelectOption = ASelect.Option;
const AInputSearch = AInput.Search;
const AStatisticCountdown = AStatistic.Countdown;
const AFormItem = AForm.Item;
const {createConfirm, createWarningModal } = useMessage();
const emit=defineEmits(['register']);
const formItems:any = ref({})
const database = ref(getCurrentAccountName(true));
const startPeriod:any = ref('');
const iyear:any = ref('');
const projectClassCtl:any = ref('');
const arDirList:any = ref([]);
const proUnique:any = ref('');
const proName:any = ref('');
const proItem:any = ref('');
const ysIsumBenbiReadonly:any = ref(true);
const arIsumBenbiReadonly:any = ref(true);


const [registerSelectProjectPage, { openModal: openSelectProjectPage }] = useModal()
// 数据库模式名称
const [register, { closeModal }] = useModalInner( async (data) => {
  database.value=data.database
  iyear.value=data.iyear
  startPeriod.value=data.startPeriod
  formItems.value={}
  console.log(data.data)
  formItems.value.id=data.data.id
  formItems.value.arStyle=data.data.arStyle
  formItems.value.arDir=data.data.arDir
  if(data.data.arDir==1){
    arDirList.value.push({title:'预付',value:'1'})
  }else{
    arDirList.value.push({title:'应付',value:'0'})
  }
  if(data.data.ddate!==''){
    formItems.value.ddate=dayjs(data.data.ddate)
  }
  formItems.value.custId=data.data.custId
  formItems.value.arCustName=data.data.custName
  formItems.value.ysIsumBenbi=toThousandFilter(data.data.ysIsumBenbi)
  formItems.value.arIsumBenbi=toThousandFilter(data.data.arIsumBenbi)
  formItems.value.isumBenbi=toThousandFilter(data.data.isumBenbi)
  formItems.value.lineId=data.data.lineId
  proName.value=data.data.citemName
  proUnique.value=data.data.citemId
  proItem.value=data.data.citemClass

  const account:any = await getThisAdInfoData({'accId': data.database.substring(0,data.database.length-5)})
  if (null != account){
    projectClassCtl.value = account.projectClassCtl
  }
});

async function handleOk() {
  if(formItems.value.arStyle==undefined){
    return createWarningModal({ content: '请选择应付类型！' });
  }else if(formItems.value.arDir==undefined){
    return createWarningModal({ content: '请选择付款方向！' });
  }else if(formItems.value.arDir==0 && (formItems.value.arIsumBenbi==undefined || parseFloat(formItems.value.arIsumBenbi)==0)){
    return createWarningModal({ content: '应付账款必须大于0！' });
  }else if(formItems.value.arDir==1 && (formItems.value.ysIsumBenbi==undefined || parseFloat(formItems.value.ysIsumBenbi)==0)){
    return createWarningModal({ content: '预付账款必须大于0！' });
  }

  if(parseInt(formatTimer(formItems.value.ddate).substring(0,7).replaceAll('-',''))>parseInt(startPeriod.value)){
    return createWarningModal({ content: '单据日期不能大于账套启用期间！' });
  }
  let map={
    id:formItems.value.id,
    iyear:iyear.value,
    cmakerId:useUserStoreWidthOut().getUserInfo.id,
    arStyle:formItems.value.arStyle,
    arDir:formItems.value.arDir,
    ddate:formItems.value.ddate,
    custId:formItems.value.custId,
    citemClass:proItem.value,
    citemId:proUnique.value,
    ysIsumBenbi:formItems.value.ysIsumBenbi!==undefined ||formItems.value.ysIsumBenbi!==''?formItems.value.ysIsumBenbi.replace(/,/g,''):0,
    arIsumBenbi:formItems.value.arIsumBenbi!==undefined ||formItems.value.arIsumBenbi!==''?formItems.value.arIsumBenbi.replace(/,/g,''):0,
    isumBenbi:formItems.value.isumBenbi.replace(/,/g,''),
    bcheck:'0',
    lineId:formItems.value.lineId
  }
  await useRouteApi(stockArBalanceSave, { schemaName: database })(map)
  emit('save', '');
  closeModal();
}
//金额格式化
function toThousandFilter(num:any) {
  if (num=='' || num==null){
    return ''
  }
  return (+num || 0).toFixed(4).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
}

function arStyleChange() {
  arDirList.value=[]
  ysIsumBenbiReadonly.value=true
  arIsumBenbiReadonly.value=true
  formItems.value.isumBenbi=''
  if(formItems.value.arStyle=='YUSK'){
    formItems.value.arIsumBenbi=''
    arDirList.value.push({title:'预付',value:'1'})
    formItems.value.arDir='1'
    ysIsumBenbiReadonly.value=false
  }else if(formItems.value.arStyle!==undefined&&formItems.value.arStyle!=='YUSK'){
    formItems.value.ysIsumBenbi=''
    arDirList.value.push({title:'应付',value:'0'})
    formItems.value.arDir='0'
    arIsumBenbiReadonly.value=false
  }else{
    arDirList.value=[]
    formItems.value.arDir=''
  }
}
const openSelectProject = () => {
  openSelectProjectPage(true, {
    dynamicTenantId: database.value,
    projectClassCtl: projectClassCtl.value,
  })
}
function saveSelectProject(data){
  proUnique.value=data.uniqueCode
  proName.value=data.projectName
  proItem.value=data.projectClassCode
}

function ysIsumBenbiMoney() {
  formItems.value.isumBenbi=toThousandFilter(formItems.value.ysIsumBenbi)
}
function arIsumBenbiMoney() {
  formItems.value.isumBenbi=toThousandFilter(formItems.value.arIsumBenbi)
}
function ddateChange() {
  if(parseInt(formatTimer(formItems.value.ddate).substring(0,7).replaceAll('-',''))>parseInt(startPeriod.value)){
    return createWarningModal({ content: '单据日期不能大于账套启用期间！' });
  }
}
// 时间格式化
function formatTimer(value) {
  let date:any = new Date(value);
  let y = date.getFullYear();
  let MM = date.getMonth() + 1;
  MM = MM < 10 ? "0" + MM : MM;
  let d = date.getDate();
  d = d < 10 ? "0" + d : d;
  let h = date.getHours();
  h = h < 10 ? "0" + h : h;
  let m = date.getMinutes();
  m = m < 10 ? "0" + m : m;
  let s = date.getSeconds();
  s = s < 10 ? "0" + s : s;
  return y + "-" + MM + "-" + d + " " + h + ":" + m;
}

</script>
<style lang="less" scoped>
:deep(.vben-basic-title) {
  color: rgb(1, 129, 226) !important;
}

:deep(.ant-select-single:not(.ant-select-customize-input)
.ant-select-selector
.ant-select-selection-search-input) {
  border: none !important;
}

.vben-basic-title {
  color: rgb(1, 129, 226) !important;
}

.ant-modal-body {
  padding: 0px;
  border: 1px solid rgb(1, 129, 226);
  border-left: none;
  border-right: none;
}

.red_span {
  color: red;
  font-weight: bold;
  display: inline-block;
  width: 20px;
  text-align: right;
}

.nc-open-content {
  input {
    width: 50%;
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
    font-weight: bold;
    font-size: 14px;
  }

  .abc{
    border-bottom: 2px solid #666666 !important;
    font-size: 18px;
  }

  .ant-input:focus {
    box-shadow: none;
  }
  .border_hidden_bottom{
    border: none !important;
    border-bottom: 1px solid #ffffff !important;
  }

  :deep(.ant-select-selector) {
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
    font-weight: bold;
    font-size: 14px;
  }

  label {
    text-align: left;
    width: 110px;
    display: inline-block;
    padding-top: 5px;
    padding-bottom: 5px;
    color: #535353;
    font-size: 13px;
    margin-left: 1em;
    font-weight: bold;
  }

  .open-content-down {
    margin-top: 5%;

    .ant-tabs-tab-active::before {
      position: absolute;
      top: 0px;
      left: 0;
      width: 100%;
      border-top: 2px solid transparent;
      border-radius: 2px 2px 0 0;
      transition: all 0.3s;
      content: '';
      pointer-events: none;
      background-color: rgb(1, 143, 251);
    }
  }
}
</style>
