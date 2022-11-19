<template>
  <BasicModal
    width="900px"
    v-bind="$attrs"
    @ok="handleOk()"
    @cancel="closeOk()"
    :showOkBtn="isEdit"
    :showCancelBtn="isEdit"
    @register="register"
  >
    <Loading :loading="compState.loading" :absolute="compState.absolute" :tip="compState.tip" />
    <template #title>
      <div style="display: flex;color: #0096c7;margin-left: 10px;">
        <span style="line-height:40px;font-size: 28px;">
          <FormOutlined style="font-size: 29px;font-weight: bold"/>
        </span>
        <span style="line-height:40px;font-size: 28px;">
          &nbsp;&nbsp;批改存货信息
        </span>
      </div>
      <div style="display: inline-block;position:absolute;right: 40px;top: 10px;z-index: 100000;background:#ffffff">
        <img src="/cus.png" style="height:90px;margin-right: 55px;"/>
      </div>
    </template>

    <div :class="'nc-open-content'" style="margin-top: 100px;">
      <div class="open-content-up">
        <label>存货分类：</label>
        <a-select
          v-model:value="formItems.stockClass"
          show-search
          option-filter-prop="children"
          style="width: 27%"
          allow-clear
        >
          <a-select-option
            v-for="sc in stockClassTreeData"
            :key="sc.uniqueStockclass"
            :value="sc.uniqueStockclass"
          >
            {{ sc.stockCclassName }}
          </a-select-option>
          <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
        </a-select>
        <label style="margin-left: 55px;">默认仓库：</label>
        <a-select
          v-model:value="formItems.stockCangku"
          show-search
          option-filter-prop="children"
          style="width: 27%"
          allow-clear
        >
          <a-select-option
            v-for="ck in cangkuList"
            :filterOption="filterCangkuOption"
            :key="ck.ckName"
            :value="ck.id"
          >
            {{ ck.ckName }}
          </a-select-option>
          <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
        </a-select>
        &nbsp;
        <a style="font-weight: bold;font-size: 18px;"><LinkOutlined @click="stockCangKuModalShow" /></a>

        <label>默认供应商：</label>
        <a-select
          v-model:value="formItems.stockSup"
          show-search
          option-filter-prop="children"
          style="width: 27%;"
          allow-clear
          :filter-option="filterDeptOption"
        >
          <a-select-option
            v-for="sup in supplierList"
            :key="sup.custName"
            :value="sup.uniqueCode"
          >
            {{ sup.custName }}
          </a-select-option>
          <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
        </a-select>
        &nbsp;
        <a style="font-weight: bold;font-size: 18px;"><LinkOutlined @click="supModalShow" /></a>

        <label>品牌：</label>
        <a-input style="width: 235px;" v-model:value="formItems.pinpai" autocomplete="off" />

        <label>有效时长：</label>
        <a-input-number style="width: 235px;" v-model:value="formItems.shichang" autocomplete="off" />

        <label style="margin-left: 56px;">预警天数：</label>
        <a-input-number style="width: 235px;" v-model:value="formItems.yujing" autocomplete="off" />
        <label>批次管理：</label>
        <a-select
          :disabled="disabledTrue"
          v-model:value="formItems.pici"
          style="width: 27%;"
          allow-clear
        >
          <a-select-option value="1" > 是 </a-select-option>
          <a-select-option value="0" > 否 </a-select-option>
          <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
        </a-select>
        <label style="margin-left: 56px;">应税劳务费用：</label>
        <a-select
          v-model:value="formItems.yslw"
          style="width: 27%;"
          allow-clear
          @change="yslwChange"
        >
          <a-select-option value="1" > 是 </a-select-option>
          <a-select-option value="0" > 否 </a-select-option>
          <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
        </a-select>
      </div>
    </div>

    <template #footer>
      <div v-if="!isEdit">
        <a-button @click="closeOk()" type="primary">关闭</a-button>
      </div>
      <div v-if="isEdit">
        <a-button @click="closeOk()">取消</a-button>
        <a-button @click="handleOk('close')" :disabled="saveClick" type="primary">保存</a-button>
      </div>
    </template>
    <ModalPop @throwData="parentModalData" @register="registerParentModalPopPage" />
    <SupModalPop @throwData="throwSupData" @register="registerSupModalPopPage" />
    <PsnSelect @save="saveSelectPsn" @register="registerSelectPsnPage" />
    <DeptSelect @save="saveSelectDept" @register="registerSelectDeptPage" />
    <StockCangKuModalPop @throwData="throwStockCangKuData" @register="registerStockCangKuModalPage" />
  </BasicModal>
</template>
<script setup="props, { content }" lang="ts">
import {
  CaretDownOutlined,
  FileSearchOutlined,
  FormOutlined,
  LinkOutlined,
  PlusCircleOutlined
} from '@ant-design/icons-vue'
import {
  Cascader,
  DatePicker,
  Input as AInput,
  InputNumber as AInputNumber,
  Radio as ARadio,
  Select as ASelect,
  Statistic as AStatistic,
  Tabs as ATabs
} from 'ant-design-vue';
import {reactive, ref, unref} from 'vue';
import {BasicModal, useModal, useModalInner} from '/@/components/Modal';
import {
  auditCustomerSave, batchEditCust, duLiSaveApi,
  findAllByFlag,
  findAllCountry,
  findAllSysTradeNature, findByCustMaxNum,
  verifyByCustAbbname,
  verifyByCustSregcode,
  verifyCustAccount,
  verifyCustomerId,
  verifyCustomerName,
  verifyCustomerNum,
} from '/@/api/record/costomer_data/customer';
import {findAllByFlag as supfindAllSupByFlag} from '/@/api/record/supplier_data/supplier';
import {findAllByCusBendEq1} from '/@/api/record/system/customer_class';
import {findAllProvince, findByZoneId} from '/@/api/record/system/zone';
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useUserStoreWidthOut} from '/@/store/modules/user';
import ModalPop from '/@/views/boozsoft/global/popup/customer_info/modalPop.vue';
import SupModalPop from '/@/views/boozsoft/global/popup/supplier/modalPop.vue';
import PsnSelect from '/@/views/boozsoft/global/popup/dept/select-psn.vue';
import DeptSelect from '/@/views/boozsoft/global/popup/dept/select-dept.vue';
import StockCangKuModalPop from '/@/views/boozsoft/stock/stock_cangku/popup/stockCangKuOneModalPop.vue';
/******************* 弹框加载中 **************************/
import {Loading} from '/@/components/Loading';
import {useMessage} from "/@/hooks/web/useMessage";
import {saveLog} from "/@/api/record/system/group-sys-login-log";
import {load} from "/@/api/record/encoding_rules/FileEncodingRules";
import {hasBlank} from "/@/api/task-api/tast-bus-api";
import {findStockCaiGouList} from "/@/api/record/stock/stock-caigou";
import {getPsnList} from "/@/api/record/system/psn";
import {getDeptListById} from "/@/api/record/system/dept";
import {findAllStockClassBend1, stockSaveApi} from "/@/api/record/stock/stock_class";
import {findByAll as findByAllCangku} from "/@/api/record/stock/stock-cangku";
import {findByXclAndKeyong, findStockCurr} from "/@/api/record/stock/stock-currents";
import {batchStockData} from "/@/api/record/stock/stock";
``
const [registerParentModalPopPage, { openModal: openParentMoalPopPage }] = useModal();
const [registerSupModalPopPage, { openModal: openSupMoalPopPage }] = useModal();
const [registerSelectPsnPage, { openModal: openSelectPsnPage }] = useModal();
const [registerSelectDeptPage, { openModal: openSelectDeptPage }] = useModal();
const [registerStockCangKuModalPage, { openModal: openStockCangKuModalPage }] = useModal();

const {createConfirm, createWarningModal, createMessage} = useMessage();
// tab默认
const activeKey = ref('1');
const ASelectOption = ASelect.Option;
const AInputSearch = AInput.Search;
const AStatisticCountdown = AStatistic.Countdown;
const ATabPane = ATabs.TabPane;
const ARadioGroup = ARadio.Group
const emit=defineEmits(['save','approveSave','updateKeyWordIsAutoSave', 'edit_database','register']);
const  saveClick= ref(false)
const  isEdit= ref(true)
const disabledTrue: any = ref(false);
const verifyCustAccountFlag: any = ref(true);
const verifyNameFlag: any = ref(true);
const verifyNumFlag: any = ref(true);
const verifyAbbnameFlag: any = ref(true);
const verifySregcodeFlag: any = ref(true);
const accountInfo: any = ref({});
const formItems: any = ref({});
const oldformItems: any = ref({});
const countryList: any = ref([]);
const supplierList: any = ref([]);
const custmerList: any = ref([]);
const custmerClassList: any = ref([]);
const systradenatureList: any = ref([]);
const custflag: any = ref('1');
// 客户分类
const uniqueCustclass: any = ref();
// 省
const provinceList: any = ref();
// 市
const cityList: any = ref([]);
// 区
const districtList: any = ref([]);
// 是否管控
const isControl: any = ref();
// 是否自动分配
const isAuto: any = ref();
// 允许修改关键字
const isKeyword: any = ref();
// 允许允许修改其他信息
const isOther: any = ref();
// 添加/修改 区分标识
const type: any = ref();
/* ************关键字**************** */
// 全称是否可输入状态
const custNameFlag: any = ref(false);
// 简称是否可输入状态
const custAbbnameFlag: any = ref(false);
// 税号是否可输入状态
const custSregcodeFlag: any = ref(false);
/* ************非关键字**************** */
// 管理类型
const manageTypeFlag: any = ref(false);
// 母公司
const uniqueCodeCcusFlag: any = ref(false);
// 供应商
const uniqueCodeSupplierFlag: any = ref(false);
// 省
const provinceFlag: any = ref(false);
// 市
const cityFlag: any = ref(false);
// 区
const areaFlag: any = ref(false);
// 联系人
const contactsFlag: any = ref(false);
// 街道
const address2Flag: any = ref(false);
// 电话
const telephoneFlag: any = ref(false);
// 国家
const countryNameFlag: any = ref(false);
// 手机
const cellPhoneNumFlag: any = ref(false);
// 网址
const websiteFlag: any = ref(false);
// 邮箱
const emailFlag: any = ref(false);
// 行业性质
const industryclassNameFlag: any = ref(false);
// 开户银行
const custBankFlag: any = ref(false);
// 开户地
const bankAreaFlag: any = ref(false);
// 银行账户
const custAccountFlag: any = ref(false);
// 银行行号
const bankCodeFlag: any = ref(false);
const defaultPage: any = ref(true);
const database: any = ref('');
const iyear: any = ref('');
const nameAllError: any = ref('');
const openType: any = ref('');
const zoningList = ref([]);
const zoneVal = ref([]);
const zoneData = ref('');
const custCodeReadonly = ref(true);
const deptList = ref([]);
const psnList = ref([]);
const idlist = ref([]);
const stockNumlist = ref([]);
const stockClassTreeData = ref([]);
const cangkuList = ref([]);
const pageParameter = reactive({
  showRulesSize: 'MIN',
  companyCode: '',
  companyName: '',
  ifUnit: false,
  total: 0,
  thisAdInfo: {},
  thisLeftKey: '',
  flag: '1',
  database: database.value,
  username: useUserStoreWidthOut().getUserInfo.username,
  uniqueCustclass: '',
  searchConditon: {
    requirement: 'ckNum',
    value: '',
  },
  ckIsDuli:''
});


const [register, { closeModal }] = useModalInner(async (data) => {
  database.value=data.database
  iyear.value=data.iyear
  idlist.value=data.idlist
  stockNumlist.value=data.stockNumlist
  formItems.value={}

  stockClass()
  let cangku=await useRouteApi(findByAllCangku,{schemaName: database})(pageParameter)
  cangkuList.value=cangku.items

  await useRouteApi(supfindAllSupByFlag, {schemaName: database})('1').then((res) => {
    supplierList.value = res.items;
  });

  saveClick.value = false
});
// 存货分类
async function stockClass() {
  const aa = await useRouteApi(findAllStockClassBend1, {schemaName: database})('')
  if(aa.length==0){
    let te={stockCclassName:'默认分类',stockClass:'9999'}
    await useRouteApi(stockSaveApi,{schemaName: database})({params:te})
  }
  const a2 = await useRouteApi(findAllStockClassBend1, {schemaName: database})('')
  stockClassTreeData.value = a2
}

const loadingRef = ref(false);
const compState = reactive({
  absolute: false,
  loading: false,
  tip: '加载中...',
});
function openCompFullLoading() {
  openLoading(false);
}
function openLoading(absolute: boolean) {
  compState.absolute = absolute;
  compState.loading = true;
}
/*******************END**************************/
async function findByCus() {
  // 全部客户信息
  await useRouteApi(findAllByFlag,{schemaName: database})('1').then((res) => {
    custmerList.value = res.items;
  });
}

const modalShow = () => {
  openParentMoalPopPage(true, {
    database: database.value,
    accId: database.value.substring(0,database.value.length-5),
  });
}
const supModalShow = () => {
  openSupMoalPopPage(true, {
    database: database.value,
    accId: database.value.substring(0,database.value.length-5),
  });
}
function throwSupData(data) {
  formItems.value.stockSup=data[data.length-1].uniqueCode
}
function parentModalData(data) {
  formItems.value.uniqueCodeCcus=data[data.length-1].uniqueCode
}

async function handleOk() {
  if(JSON.stringify(formItems.value)=='{}'){
    return createWarningModal({ content: '至少批改一条内容!' });
  }
  if(!hasBlank(formItems.value.pici)||!hasBlank(formItems.value.yslw)){
    for (let i = 0; i < idlist.value.split(',').length; i++) {
      let stockcurr= await useRouteApi(findByXclAndKeyong, {schemaName: database})(stockNumlist.value.split(',')[i])
      if(!hasBlank(stockcurr)){
        let baseQuantity=stockcurr.baseQuantity
        let keyong=stockcurr.keyong
        if(baseQuantity>0 || keyong>0){
          return createWarningModal({content:'【'+stockNumlist.value.split(',')[i]+'】已有现存量,批次管理或应税劳务费不能修改！'})
        }
      }
    }
  }

  createConfirm({
    iconType: 'warning',
    title: '警告',
    content: '确定批改存货信息吗？',
    onOk: async () => {
      let map={
        stockClass:hasBlank(formItems.value.stockClass)?"":formItems.value.stockClass,
        stockCangku:hasBlank(formItems.value.stockCangku)?"":formItems.value.stockCangku.join(','),
        stockCangkuDuli:hasBlank(formItems.value.stockCangkuDuli)?"":formItems.value.stockCangkuDuli.join(','),
        stockSup:hasBlank(formItems.value.stockSup)?"":formItems.value.stockSup,
        pinpai:hasBlank(formItems.value.pinpai)?"":formItems.value.pinpai,
        shichang:hasBlank(formItems.value.shichang)?"":formItems.value.shichang,
        yujing:hasBlank(formItems.value.yujing)?"":formItems.value.yujing,
        pici:hasBlank(formItems.value.pici)?"":formItems.value.pici,
        yslw:hasBlank(formItems.value.yslw)?"":formItems.value.yslw,
        idlist:idlist.value
      }
      await useRouteApi(batchStockData,{schemaName: database})(map)
      closeOk()
      saveClick.value=false
    }
  })

}

function clearData() {
  formItems.value={}
  formItems.value.manageType='1'
  formItems.value.isDel='0'
}

const closeOk = () => {
  emit('closeOk');
  closeModal();
}

function zoneChange(a,b) {
  zoneVal.value=a
  zoneData.value=b
}
const filterDeptOption = (input: string, option: any) => {
  return option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}

function openPsn() {
  openSelectPsnPage(true, {
    dynamicTenantId: database.value,
  });
}
function openDept() {
  openSelectDeptPage(true, {
    dynamicTenantId: database.value,
  });
}

function saveSelectPsn(e) {
  formItems.value.custPsn=e.uniqueCode
}
function saveSelectDept(e) {
  formItems.value.custDept=e.uniqueCode
}
const filterCangkuOption = (input: string, option: any) => {
  return option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
function stockCangKuModalShow() {
  openStockCangKuModalPage(true,{
    database:database.value,
  })
}
function throwStockCangKuData(data,cangkuFlag) {
  // cangkuFlag 1=独立仓库。2=级别仓库
  formItems.value.stockCangku=data[0].id
  formItems.value.stockCangkuDuli=cangkuFlag
}

function yslwChange(val) {
  if(!hasBlank(val)&&val=='1'){
    disabledTrue.value=true
    formItems.value.pici=''
    formItems.value.shichang=''
    formItems.value.yujing=''
  }
  else{
    disabledTrue.value=false
  }
}
</script>
<style lang="less" scoped>
:deep(.ant-calendar-picker-input.ant-input), :deep(.ant-select-single:not(.ant-select-customize-input) .ant-select-selector .ant-select-selection-search-input),:deep(.ant-picker),:deep(.ant-input-number) {
  border: none;
  border-bottom: solid 1px rgb(191, 191, 191) !important;
  width: 100%;
  font-weight: bold;
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
    width: 30%;
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

  :deep(.ant-select-selector) {
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
    font-weight: bold;
    font-size: 14px;
  }

  label {
    text-align: left;
    width: 120px;
    display: inline-block;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 2em;
    color: #535353;
    font-size: 13px;
    margin-left: 2em;
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

.nc-open-show-content {

  input {
    width: 30%;
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
    font-weight: bold;
    font-size: 14px;
  }

  .abc{
    border-bottom: 2px solid #666666 !important;
    font-size: 18px;
  }

  pointer-events: none;
  cursor: default;

  .ant-input:focus {
    box-shadow: none;
  }

  :deep(.ant-select-selector) {
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
    font-weight: bold;
    font-size: 14px;
  }

  :deep(.ant-cascader-input) {
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
  }

  label {
    text-align: left;
    width: 120px;
    display: inline-block;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 2em;
    color: #535353;
    font-size: 13px;
    margin-left: 2em;
    font-weight: bold;
  }

  .open-content-down {
    margin-top: 5%;

    :deep(.ant-tabs-tab) {
      pointer-events: auto;
    }

    .ant-tabs-tab-active::before {
      position: absolute;
      top: 0px;
      left: 0;
      width: 100%;
      border-top: 2px solid transparent;
      border-radius: 2px 2px 0 0;
      transition: all 0.3s;
      content: '';
      background-color: rgb(1, 143, 251);
    }
  }
}

:deep(.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab) {
  height: 40px;
  margin: 0;
  margin-right: 2px;
  padding: 0 16px;
  line-height: 38px;
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 2px 2px 0 0;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  font-weight: bold;
  font-size: 13px;
}

</style>
