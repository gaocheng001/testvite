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
        <span style="font-size: 14px">应付款管理</span>
      </div>
    </template>
    <div style="display: inline-flex;justify-content: space-between;width: 100%;">
      <div style="width: calc(100% - 150px);height: 100%;">
        <div style="text-align: center;padding: 10px 0 5px;">
          <SearchOutlined style="font-size: 24px;color: #0096c7;margin-top: 2px"/>
          <span style="line-height:30px;font-size: 24px;color: #0096c7;font-weight: bold;">&ensp;应付款核销明细表</span>
        </div>
        <div class="nc-open-content">
          <div class="open-content-up">
            <div class="border-div">
              <span>业务范围</span>
              <AccountPicker  theme="three" @reloadTable="dynamicAdReload"/>
            </div>
            <div class="border-div">
              <span>核算条件</span>
              <div>
                <span class="red_span">*</span>
                <label>业务期间：</label>
                <a-date-picker
                  v-model:value="formItems.ddate1"
                  placeholder=""
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  :disabled-date="disabledStartDate"
                  style="width: 120px;"
                /> ~
                <a-date-picker
                  v-model:value="formItems.ddate2"
                  placeholder=""
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  :disabled-date="disabledEndDate"
                  style="width: 120px;"
                />
              </div>
              <div>
                <span class="red_span"></span>
                <label>结算供应商：</label>
                <a-select
                  v-model:value="formItems.cvencode"
                  show-search
                  allow-clear
                  style="width: 240px;"
                >
                  <a-select-option v-for="item in customerList" :value="item.id" >
                    {{ item.custName }}
                  </a-select-option>
                  <template #suffixIcon><CaretDownOutlined style="color:#666666;"/></template>
                </a-select>
                &nbsp;
                <a style="font-weight: bold;font-size: 18px;"><LinkOutlined @click="openHeadSelectContent('cvencodeJs')" /></a>
              </div>
              <div>
                <span class="red_span"></span>
                <label>单据状态：</label>
                <a-select
                  v-model:value="formItems.bcheck"
                  show-search
                  style="width: 240px;"
                >
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="1">已审核</a-select-option>
                  <a-select-option value="0">未审核</a-select-option>
                  <template #suffixIcon><CaretDownOutlined style="color:#666666;"/></template>
                </a-select>
              </div>
              <div>
                <span class="red_span"></span>
                <label>业务部门：</label>
                <a-select
                  v-model:value="formItems.cdepcode"
                  show-search
                  allow-clear
                  style="width: 240px;"
                >
                  <a-select-option v-for="item in deptList" :value="item.id" >
                    {{ item.deptName }}
                  </a-select-option>
                  <template #suffixIcon><CaretDownOutlined style="color:#666666;"/></template>
                </a-select>
                &nbsp;
                <a style="font-weight: bold;font-size: 18px;"><LinkOutlined @click="openHeadSelectContent('cdepcode')" /></a>
              </div>
              <div>
                <span class="red_span"></span>
                <label>业务员：</label>
                <a-select
                  v-model:value="formItems.cpersoncode"
                  show-search
                  allow-clear
                  style="width: 240px;"
                >
                  <a-select-option v-for="item in psnList" :value="item.id" >
                    {{ item.psnName }}
                  </a-select-option>
                  <template #suffixIcon><CaretDownOutlined style="color:#666666;"/></template>
                </a-select>
                &nbsp;
                <a style="font-weight: bold;font-size: 18px;"><LinkOutlined @click="openHeadSelectContent('cpersoncode')" /></a>
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

    <SupperModalPop @throwData="modalData" @register="registerModalPopPage"/>
    <DeptModalPop @register="registerSelectDeptPage" @save="modalData"/>
    <SelectPsn @register="registerSelectPsnPage" @save="modalData"/>
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
import {useUserStore, useUserStoreWidthOut} from "/@/store/modules/user";
import {useMessage} from "/@/hooks/web/useMessage";
import {nextTick, onMounted, reactive, ref, unref} from "vue";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import router from "/@/router";
import {useTabs} from "/@/hooks/web/useTabs";
import {getCurrentAccountName, hasBlank, pointMessage} from "/@/api/task-api/tast-bus-api";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import SupperModalPop from "/@/views/boozsoft/global/popup/customer_info/modalPop.vue";
import DeptModalPop from "/@/views/boozsoft/global/popup/dept/select-dept.vue";
import SelectPsn from "/@/views/boozsoft/global/popup/dept/select-psn.vue"
import {findPsnByFlag} from "/@/api/record/system/psn";
import {findDeptByFlag} from "/@/api/record/system/dept";
import {findAll} from "/@/api/record/supplier_data/supplier";
import {GetCustomerClassTree} from "/@/api/record/system/supplier_class";
import {useAccountPickerCache} from "/@/store/modules/boozsoft/components/AccountPicker/cache";
import moment from "moment";
import {findByStockAccId} from "/@/api/record/system/stock-account";
const AInputSearch = AInput.Search;
const ASelectOption = ASelect.Option;
const ARangePicker = ADatePicker.RangePicker

const {
  createErrorModal
} = useMessage()

const { closeCurrent } = useTabs(router);
const emit = defineEmits(['register', 'save'])

const dynamicTenantId = ref(getCurrentAccountName(true))
const defaultAdName = ref(useCompanyOperateStoreWidthOut().getSchemaName)
const year = ref()

const formItems: any = ref({});

const [register, {closeModal, setModalProps}] = useModalInner((data) => {
  formItems.value.openOne = data.data.openOne;
  if (hasBlank(formItems.value.ddate1)) {
    // formItems.value.ddate1 = useCompanyOperateStoreWidthOut().getLoginDate
    formItems.value.ddate1 = useCompanyOperateStoreWidthOut().getLoginDate.substring(0,7)+'-01'
  }
  if (hasBlank(formItems.value.ddate2)) {
    // formItems.value.ddate2 = moment(formItems.value.ddate1, 'YYYY-MM-DD').endOf('month').format('YYYY-MM-DD')
    formItems.value.ddate2 = useCompanyOperateStoreWidthOut().getLoginDate
  }
  if (hasBlank(formItems.value.bcheck)) {
    formItems.value.bcheck = ''
  }
  setModalProps({ minHeight: 375 });
})

onMounted(async () => {
})

const disabledStartDate = (current) => {
  // 获取区间最小区间
  if (!hasBlank(formItems.value.ddate2)) {
    let variable = formItems.value.ddate2
    let max = moment(variable, 'YYYY-MM-DD')
    return current > max
  }
};

const disabledEndDate = (current) => {
  // 获取区间最小区间
  if (!hasBlank(formItems.value.ddate1)) {
    let variable = formItems.value.ddate1
    let min = moment(variable, 'YYYY-MM-DD')
    return current < min
  }
};

async function handleOk() {
  if (formItems.value.ddate1==null || formItems.value.ddate1==''){
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '业务期间不能为空！'
    })
    return false
  }
  if (formItems.value.ddate2==null || formItems.value.ddate2==''){
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '业务期间不能为空！'
    })
    return false
  }
  /*if (formItems.value.riqi==null || formItems.value.riqi==''){
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '业务期间不能为空！'
    })
    return false
  }
  formItems.value.ddate1 = formItems.value.riqi[0].format('YYYY-MM-DD')
  formItems.value.ddate2 = formItems.value.riqi[1].format('YYYY-MM-DD')*/
  emit('save', unref(formItems));
  closeModal();
  return true;
}

async function handleClose() {
  if (null != formItems.value.openOne && formItems.value.openOne == 1) {
    await closeCurrent()
    await router.push('/')
  }else{
    await closeModal()
  }
}

const parameter = reactive({
  showRulesSize: 'MIN',
  companyCode: '',
  companyName: '',
  ifUnit: false,
  total: 0,
  thisAdInfo: {},
  thisLeftKey: '',
  flag:'1',
  database: dynamicTenantId.value,
  accId: defaultAdName.value,
  username: useUserStoreWidthOut().getUserInfo.username,
  uniqueCustclass:'',
  searchConditon: {
    requirement: 'custName',
    value: '',
  },
})

const psnList:any = ref([])
const deptList:any = ref([])
const customerList:any = ref([])
const custClassList:any = ref([])
async function reloadList(){
  parameter.database = dynamicTenantId.value
  parameter.accId = defaultAdName.value
  psnList.value = await useRouteApi(findPsnByFlag,{schemaName: dynamicTenantId})({})
  deptList.value = await useRouteApi(findDeptByFlag,{schemaName: dynamicTenantId})({})
  const res = await useRouteApi(findAll,{schemaName: dynamicTenantId})(parameter)
  customerList.value = res.items
  custClassList.value = await useRouteApi(GetCustomerClassTree,{schemaName: dynamicTenantId})({})
}

const thisEditObj:any = ref(null)
const thisEditType:any = ref('')

const [registerModalPopPage, {openModal: openMoalPopPage}] = useModal();
const [registerSelectDeptPage, {openModal: openSelectDeptPage}] = useModal()
const [registerSelectPsnPage, {openModal: openSelectPsnPage}] = useModal()

const openHeadSelectContent = (type) => {
  thisEditType.value = type
  switch (type) {
    case 'cvencode':
      openMoalPopPage(true, {
        database: dynamicTenantId.value,
        accId: defaultAdName.value,
      });
      break;
    case 'cvencodeJs':
      openMoalPopPage(true, {
        database: dynamicTenantId.value,
        accId: defaultAdName.value,
      });
      break;
    case 'cdepcode':
      openSelectDeptPage(true, {
        dynamicTenantId: dynamicTenantId.value
      })
      break;
    case 'cpersoncode':
      openSelectPsnPage(true, {
        dynamicTenantId: dynamicTenantId.value
      })
      break;
  }
}

const modalData = (o) => {
  console.log(thisEditObj.value)
  console.log(thisEditType.value)
  if (thisEditType.value=='cvencode'){
    formItems.value.cvencode = o[0].id
  }
  if (thisEditType.value=='cvencodeJs'){
    formItems.value.cvencodeJs = o[0].id
  }
  if (thisEditType.value=='cdepcode'){
    formItems.value.cdepcode = o.id
  }
  if (thisEditType.value=='cpersoncode'){
    formItems.value.cpersoncode = o.id
  }
}

const loadMark = ref(false)
async function dynamicAdReload(obj) {
  loadMark.value = true
  defaultAdName.value = obj.accId
  dynamicTenantId.value = obj.accountMode
  year.value = obj.year

  formItems.value.defaultAdName = obj.accId
  formItems.value.dynamicTenantId = obj.accountMode
  formItems.value.year = obj.year
  formItems.value.thisAdInfo = obj

  const res = await findByStockAccId(obj.accId)
  formItems.value.arHexiaoAuto = res.arHexiaoAuto
  formItems.value.arSourceFlag = res.arSourceFlag
  formItems.value.arCheckFlag = res.arCheckFlag

  await reloadList()

  useAccountPickerCache().set(obj)

  loadMark.value = false
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
      padding-left: 1em;
      padding-right: 1em;
    }
    :deep(.account-picker){
      >div{
        text-align: left;
      }
    }

    label {
      text-align: left;
      width: 100px;
      display: inline-block;
      color: #535353;
      font-size: 13px;
      font-weight: bold;
    }

    :deep(.red_span) {
      color: red;
      font-weight: bold;
      display: inline-block;
      width: 20px;
      text-align: left;
    }
  }

}

.right-btns{
  width: 150px;background-color: #f1f1f1;padding: 10% 4%;height: 375px;
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
