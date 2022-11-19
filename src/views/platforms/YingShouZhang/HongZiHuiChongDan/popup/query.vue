<template>
  <BasicModal
    width="600px"
    v-bind="$attrs"
    title="查询条件"
    @ok="handleOk()"
    @cancel="handleClose()"
    :loading="loadMark"
    @register="register"
  >
    <template #title>
      <div style="display: flex;" class="vben-basic-title">
        <SearchOutlined style="line-height:40px;font-size: 34px;color: #0096c7;"/>
        <span style="line-height:50px;font-size: 30px;color: #0096c7;">&ensp;查询条件</span>
      </div>
      <div style="display: inline-block;position:absolute;right: 70px;top: 20px;background:#ffffff">
        <FileSearchOutlined style="font-size: 70px;color: #e7e7e7;"/>
      </div>
    </template>
    <div class="nc-open-content" style="margin-top: 50px;margin-bottom: 20px;">
      <div class="open-content-up" style="margin-left: 20px;">
        <div style="margin-left: 30px;">
          <AccountPicker theme="three" @reloadTable="dynamicAdReload"/>
        </div>
        <br/><br/>
        <label>单据类型：</label>
        <a-select
          v-model:value="formItems.billStyle"
          :allowClear="true"
          show-searchplaceholder=""
          style="width: 60%;"
        >
          <template #suffixIcon><CaretDownOutlined /></template>
          <a-select-option value="SKD">收款单</a-select-option>
          <a-select-option value="YSD">应收单</a-select-option>
        </a-select>
        <br/><br/>
        <label>往来单位：</label>
        <a-select
          v-model:value="formItems.cvencode"
          :allowClear="true"
          show-searchplaceholder=""
          style="width: 60%;"
        >
          <template #suffixIcon><CaretDownOutlined /></template>
          <a-select-option v-for="item in customerList" :value="item.id" >
            {{ item.custName }}
          </a-select-option>
        </a-select>
        <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;" @click="openHeadSelectContent('cvencode')"/>
        <br/><br/>
        <label>截止日期：</label>
        <a-date-picker
          v-model:value="formItems.endDate"
          placeholder="截止日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          style="width: 60%;"
        />
<!--        <br/><br/>
        <label>部门：</label>
        <a-select
          v-model:value="formItems.cdepcode"
          :allowClear="true"
          show-searchplaceholder=""
          style="width: 60%;"
        >
          <template #suffixIcon><CaretDownOutlined /></template>
          <a-select-option v-for="item in deptList" :value="item.id" >
            {{ item.deptName }}
          </a-select-option>
        </a-select>
        <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;" @click="openHeadSelectContent('cdepcode')"/>
        <br/><br/>
        <label>业务员：</label>
        <a-select
          v-model:value="formItems.cpersoncode"
          :allowClear="true"
          show-searchplaceholder=""
          style="width: 60%;"
        >
          <template #suffixIcon>
            <CaretDownOutlined />
          </template>
          <a-select-option v-for="item in psnList" :value="item.id" >
            {{ item.psnName }}
          </a-select-option>
        </a-select>
        <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;" @click="openHeadSelectContent('cpersoncode')"/>
        <br/><br/>-->
      </div>

      <SupperModalPop @throwData="modalData" @register="registerModalPopPage"/>
      <DeptModalPop @register="registerSelectDeptPage" @save="modalData"/>
      <SelectPsn @register="registerSelectPsnPage" @save="modalData"/>
    </div>
  </BasicModal>
</template>

<script setup="props, { content }" lang="ts">
import {onMounted, reactive, ref, unref} from 'vue';
import {BasicModal, useModal, useModalInner} from '/@/components/Modal';
import {Select as ASelect, Input as AInput, DatePicker as ADatePicker} from 'ant-design-vue';
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {getCurrentAccountName} from "/@/api/task-api/tast-bus-api";
import {
  SearchOutlined,
  FileSearchOutlined,
  PaperClipOutlined,
  CaretDownOutlined
} from '@ant-design/icons-vue';
import router from "/@/router";
import {useTabs} from "/@/hooks/web/useTabs";
import {useMessage} from "/@/hooks/web/useMessage";
import {findAll} from "/@/api/record/costomer_data/customer";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {findPsnByFlag} from "/@/api/record/system/psn";
import {findDeptByFlag} from "/@/api/record/system/dept";
// import SupperModalPop from "/@/views/boozsoft/global/popup/customer_info/modalPop.vue";
// import DeptModalPop from "/@/views/boozsoft/global/popup/dept/select-dept.vue";
// import SelectPsn from "/@/views/boozsoft/global/popup/dept/select-psn.vue"
import SupperModalPop from "/@/views/boozsoft/global/popup/customer_info/modalPop.vue";
import DeptModalPop from "/@/views/boozsoft/global/popup/dept/select-dept.vue";
import SelectPsn from "/@/views/boozsoft/global/popup/dept/select-psn.vue"
const {
  createErrorModal
} = useMessage()
const AInputSearch = AInput.Search;
const ASelectOption = ASelect.Option;

const {closeCurrent} = useTabs(router);

const emit = defineEmits(['register', 'save']);

const dynamicTenantId = ref(getCurrentAccountName(true))
const defaultAdName = ref(useCompanyOperateStoreWidthOut().getSchemaName)
const year = ref()

const formItems: any = ref({});
const [register, {closeModal}] = useModalInner((data) => {
  formItems.value.openOne = data.data.openOne;
  formItems.value.endDate = useCompanyOperateStoreWidthOut().getLoginDate

});

onMounted(async () => {
})

async function handleOk() {
  if (formItems.value.cvencode==null || formItems.value.cvencode==''){
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '往来单位不能为空！'
    })
    return false
  }
  if (formItems.value.endDate==null || formItems.value.endDate==''){
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '截止日期不能为空！'
    })
    return false
  }
  emit('save', unref(formItems));
  closeModal();
  return true;
}

async function handleClose() {
  if (null != formItems.value.openOne && formItems.value.openOne == 1) {
    await closeCurrent()
    await router.push('/')
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
async function reloadList(){
  parameter.database = dynamicTenantId.value
  parameter.accId = defaultAdName.value
  psnList.value = await useRouteApi(findPsnByFlag,{schemaName: dynamicTenantId})({})
  deptList.value = await useRouteApi(findDeptByFlag,{schemaName: dynamicTenantId})({})
  const res = await useRouteApi(findAll,{schemaName: dynamicTenantId})(parameter)
  customerList.value = res.items
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

  await reloadList()
  loadMark.value = false
}
</script>
<style>
.vben-basic-title {
  color: rgb(1, 129, 226) !important;
}

.ant-modal-body {
  padding: 0px;
  border: 1px solid rgb(1, 129, 226);
  border-left: none;
  border-right: none;
}
</style>
<style lang="less" scoped>
:deep(.ant-calendar-picker-input.ant-input),
:deep(.ant-select-single:not(.ant-select-customize-input)
      .ant-select-selector
      .ant-select-selection-search-input) {
  border: none;
  border-bottom: solid 1px rgb(191, 191, 191) !important;
  width: 100%;
}

:deep(.ant-picker){
  border: none !important;
  border-bottom: solid 1px rgb(191, 191, 191) !important;
  input {
    font-size: 14px;
    font-weight: bold;
    border: none !important;
  }
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

.nc-open-content {
  input {
    width: 50%;
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
    font-size: 14px;
    font-weight: bold;
  }

  .ant-input:focus {
    box-shadow: none;
  }

  :deep(.ant-select-selector) {
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
    font-size: 14px;
    font-weight: bold;
  }

  label {
    text-align: left;
    width: 90px;
    display: inline-block;
    padding: 5px 10px;
    margin-left: 2em;
    color: #535353;
    font-size: 13px;
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
