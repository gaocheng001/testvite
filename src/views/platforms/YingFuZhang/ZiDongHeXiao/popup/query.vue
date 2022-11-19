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
        <span style="font-size: 14px">应付款</span>
      </div>
    </template>
    <div style="display: inline-flex;justify-content: space-between;width: 100%;">
      <div style="width: calc(100% - 150px);height: 100%;">
        <div style="text-align: center;padding: 10px 0 5px;">
          <SearchOutlined style="font-size: 24px;color: #0096c7;margin-top: 2px"/>
          <span style="line-height:30px;font-size: 24px;color: #0096c7;font-weight: bold;">&ensp;自动核销</span>
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
                <label>截止日期：</label>
                <a-date-picker
                  v-model:value="formItems.endDate"
                  placeholder=""
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  style="width: 300px;"
                />
              </div>
<!--              <div>
                <span class="red_span">*</span>
                <label>结算客户：</label>
                <a-select
                  v-model:value="formItems.cvencode"
                  show-search
                  allow-clear
                  style="width: 300px;"
                >
                  <a-select-option v-for="item in customerList" :value="item.id" >
                    {{ item.custName }}
                  </a-select-option>
                  <template #suffixIcon><CaretDownOutlined style="color:#666666;"/></template>
                </a-select>
                &nbsp;
                <a style="font-weight: bold;font-size: 18px;"><LinkOutlined @click="openHeadSelectContent('cvencodeJs')" /></a>
              </div>-->
              <div>
                <span class="red_span"></span>
                <label>业务部门：</label>
                <a-select
                  v-model:value="formItems.cdepcode"
                  show-search
                  allow-clear
                  style="width: 300px;"
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
                  style="width: 300px;"
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
        <Button style="width: 100px;" shape="round" @click="handleOk"  type="primary">开始核销</Button>
        <Button style="width: 100px;margin-top: 10px" shape="round" @click="handleClose">放弃</Button>
      </div>
    </div>

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
import DeptModalPop from "/@/views/boozsoft/global/popup/dept/select-dept.vue";
import SelectPsn from "/@/views/boozsoft/global/popup/dept/select-psn.vue"
import {findPsnByFlag} from "/@/api/record/system/psn";
import {findDeptByFlag} from "/@/api/record/system/dept";
import moment from "moment";
import {getByStockBalanceTask} from "/@/api/record/stock/stock_balance";
import {saveTaskApi} from "/@/api/record/system/task";
import {findByStockAccId} from "/@/api/record/system/stock-account";
const AInputSearch = AInput.Search;
const ASelectOption = ASelect.Option;
const ARangePicker = ADatePicker.RangePicker

const {
  createErrorModal,
  createWarningModal
} = useMessage()

const { closeCurrent } = useTabs(router);
const emit = defineEmits(['register', 'save'])

const dynamicTenantId = ref(getCurrentAccountName(true))
const defaultAdName = ref(useCompanyOperateStoreWidthOut().getSchemaName)
const year:any = ref('')

const formItems: any = ref({});

const [register, {closeModal, setModalProps}] = useModalInner((data) => {
  formItems.value.openOne = data.data.openOne;
  if (hasBlank(formItems.value.endDate)) {
    formItems.value.endDate = useCompanyOperateStoreWidthOut().getLoginDate
  }
  if (hasBlank(formItems.value.bcheck)) {
    formItems.value.bcheck=''
  }
  setModalProps({ minHeight: 320 });
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
  if (formItems.value.endDate==null || formItems.value.endDate==''){
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '截止日期不能为空！'
    })
    return false
  }
  formItems.value.year = formItems.value.endDate.split('-')[0]
  //是否存在锁定任务（应付款期初余额、付款单、退款单、应付单、采购到货单）
  let qichu= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:formItems.value.year,name:'应付款期初余额',method:'编辑'})
  if(qichu.length>0){
    return createWarningModal({ content: qichu[0]?.username+'正在编辑应付款期初余额,不能同时进行操作！' });
  }
  let shoukuan= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:formItems.value.year,name:'付款单',method:'修改,删除,审核,弃审'})
  if(shoukuan.length>0){
    return createWarningModal({ content: shoukuan[0]?.username+'正在'+shoukuan[0]?.method+'付款单,不能同时进行操作！' });
  }
  let tuikuan= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:formItems.value.year,name:'退款单',method:'修改,删除,审核,弃审'})
  if(tuikuan.length>0){
    return createWarningModal({ content: tuikuan[0]?.username+'正在'+tuikuan[0]?.method+'退款单,不能同时进行操作！' });
  }
  let yingshou= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:formItems.value.year,name:'应付单',method:'修改,删除,审核,弃审'})
  if(yingshou.length>0){
    return createWarningModal({ content: yingshou[0]?.username+'正在'+yingshou[0]?.method+'应付单,不能同时进行操作！' });
  }
  let xiaohuodan= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:formItems.value.year,name:'采购到货单',method:'修改,删除,审核,弃审'})
  if(xiaohuodan.length>0) {
    return createWarningModal({content: xiaohuodan[0]?.username + '正在' + xiaohuodan[0]?.method + '采购到货单,不能同时进行操作！'});
  }
  let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:formItems.value.year,name:'应付自动核销',method:'核销'})
  if(taskData.length==0){
    await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({iyear:formItems.value.year,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:'应付自动核销',method:'核销',caozuoModule:'ap'})
  } else {
    // 任务不是当前操作员的
    if(String(taskData[0]?.caozuoUnique)!==String(useUserStoreWidthOut().getUserInfo.id)){
      return createWarningModal({ content: taskData[0]?.username+'正在应付自动核销,不能同时进行操作！' });
    }else{
      await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({id:taskData[0]?.id,iyear:formItems.value.year,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:'应付自动核销',method:'核销',caozuoModule:'ap'})
    }
  }
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
async function reloadList(){
  parameter.database = dynamicTenantId.value
  parameter.accId = defaultAdName.value
  psnList.value = await useRouteApi(findPsnByFlag,{schemaName: dynamicTenantId})({})
  deptList.value = await useRouteApi(findDeptByFlag,{schemaName: dynamicTenantId})({})
}

const thisEditObj:any = ref(null)
const thisEditType:any = ref('')

const [registerSelectDeptPage, {openModal: openSelectDeptPage}] = useModal()
const [registerSelectPsnPage, {openModal: openSelectPsnPage}] = useModal()

const openHeadSelectContent = (type) => {
  thisEditType.value = type
  switch (type) {
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
  // year.value = obj.year
  year.value = useCompanyOperateStoreWidthOut().getLoginDate.split('-')[0]

  formItems.value.defaultAdName = obj.accId
  formItems.value.dynamicTenantId = obj.accountMode
  // formItems.value.year = obj.year
  formItems.value.year = useCompanyOperateStoreWidthOut().getLoginDate.split('-')[0]
  formItems.value.thisAdInfo = obj

  const res = await findByStockAccId(obj.accId)
  formItems.value.apHexiaoAuto = res.apHexiaoAuto
  formItems.value.apSourceFlag = res.apSourceFlag
  formItems.value.apCheckFlag = res.apCheckFlag

  formItems.value.cvencode = ''
  formItems.value.cdepcode = ''
  formItems.value.cpersoncode = ''

  await reloadList()

  // useAccountPickerCache().set(obj)

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
    :deep(.ant-input){
      border: none !important;
    }
  }

}

.right-btns{
  width: 150px;background-color: #f1f1f1;padding: 10% 4%;height: 320px;
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
