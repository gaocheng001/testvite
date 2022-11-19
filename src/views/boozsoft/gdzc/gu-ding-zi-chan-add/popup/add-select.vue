<template>
  <BasicModal
    width="500px"
    v-bind="$attrs"
    title="新增资产"
    @ok="handleOk()"
    @cancel="handleClose()"
    :loading="loadMark"
    @register="register"
  >
    <div class="nc-open-content" style="margin-top: 20px;margin-bottom: 20px;height: 240px;">
      <div class="open-content-up">
        <AccountPicker theme="two" @reloadTable="dynamicAdReload" style="margin-left: 2%;"/>
        <br/>
<!--        <label>管理类型：</label>
        <Select v-model:value="formItems.manageCode" placeholder="管理类型" style="width: 50%">
          <SelectOption v-for="item in accountList" :value="item.id">FA{{item.faAccId}}-{{item.faAccName}}</SelectOption>
        </Select>
        <br/><br/>-->
        <label>单据日期：</label>
        <DatePicker
          v-model:value="formItems.cdate"
          placeholder="单据日期"
          :locale="localeCn"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          :disabled-date="disabledDate"
          style="width: 50%;"
        />
        <br/><br/>
        <label>资产类别：</label>
        <Select v-model:value="formItems.faClass" placeholder="资产类别" style="width: 50%">
          <SelectOption v-for="item in assetTypeList" :value="item.uniqueCode">{{item.ecName}}</SelectOption>
        </Select>
        <br/><br/>
<!--        <label>折旧分配：</label>
        <Select v-model:value="formItems.zhejiuType" placeholder="折旧分配" style="width: 50%">
          <SelectOption value="0">支持多部门</SelectOption>
          <SelectOption value="1">支持多项目</SelectOption>
        </Select>-->
      </div>
    </div>
  </BasicModal>
</template>

<script setup="props, { content }" lang="ts">
import {onMounted, ref, unref} from 'vue';
import {BasicModal, useModalInner} from '/@/components/Modal';
import {Select, Input, DatePicker, message} from 'ant-design-vue';
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
// import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker.vue";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-GDZC.vue";
import {getCurrentAccountName, hasBlank} from "/@/api/task-api/tast-bus-api";
import router from "/@/router";
import {useTabs} from "/@/hooks/web/useTabs";
import {useMessage} from "/@/hooks/web/useMessage";
import localeCn from 'ant-design-vue/es/date-picker/locale/zh_CN';
import {findFaAssetTypeByFlagAndBend} from "/@/api/fa/fa-card";
import {findFaAccountByAccId} from "/@/api/record/gdzc/zc-options";
import {findAssetsDate} from "/@/api/record/group/im-unit";
import moment from "moment";
const {
  createErrorModal
} = useMessage()
const InputSearch = Input.Search;
const SelectOption = Select.Option;

const {closeCurrent} = useTabs(router);

const emit = defineEmits(['register', 'save']);

const dynamicTenantId = ref(getCurrentAccountName(true))
const defaultAdName = ref(useCompanyOperateStoreWidthOut().getSchemaName)
const year = ref()

const formItems: any = ref({});
const [register, {closeModal}] = useModalInner((data) => {
  formItems.value.openOne = data.data.openOne;
  formItems.value.zhejiuType = '0'
});

onMounted(async () => {
})

async function handleOk() {
  if (formItems.value.manageCode==null || formItems.value.manageCode==''){
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '管理类型不能为空！'
    })
    return false
  }
  if (formItems.value.cdate==null || formItems.value.cdate==''){
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '单据日期不能为空！'
    })
    return false
  }
  if (formItems.value.faClass==null || formItems.value.faClass==''){
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '资产类别不能为空！'
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
  }
}
const assetTypeList:any = ref([])
const accountList:any = ref([])
async function reloadList(){
  assetTypeList.value = await useRouteApi(findFaAssetTypeByFlagAndBend,{schemaName:dynamicTenantId})({})
  if (assetTypeList.value.length>0){
    formItems.value.faClass = assetTypeList.value[0].uniqueCode
  }
  /*accountList.value = await findFaAccountByAccId(defaultAdName.value)
  if (accountList.value.length>0){
    formItems.value.manageCode = accountList.value[0].id
    const time = await findAssetsDate({code: formItems.value.manageCode, iyear: year.value})
    formItems.value.cdate = time.date
  }*/
}

const disabledDate = (current) => {
  // 获取区间最小区间
  if (!hasBlank(formItems.value.cdate)) {
    let variable = formItems.value.cdate.substring(0, 7)
    let min = moment(variable.substring(0,7) + '-01', 'YYYY-MM-DD')
    let max = moment(variable, 'YYYY-MM-DD').endOf('month')
    return current < min || current > max
  }
};

const loadMark = ref(false)
async function dynamicAdReload(obj) {
  loadMark.value = true
  defaultAdName.value = obj.accId
  dynamicTenantId.value = obj.accountMode
  year.value = obj.year
  formItems.value.manageCode = obj.managementCode
  if (obj.managementCode==null || obj.managementCode==''){
    message.warning('请先建立该公司下资产账后进行操作！')
    loadMark.value = false
  } else {
    const time = await findAssetsDate({code: obj.managementCode, iyear: year.value})
    formItems.value.cdate = time.date
    await reloadList()
    formItems.value.defaultAdName = obj.accId
    formItems.value.dynamicTenantId = obj.accountMode
    formItems.value.year = obj.year
    formItems.value.thisAdInfo = obj
    loadMark.value = false
  }
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
:deep(.ant-select-single:not(.ant-select-customize-input) .ant-select-selector .ant-select-selection-search-input), :deep(.ant-input) {
  border: none;
  //border-bottom: solid 1px rgb(191, 191, 191) !important;
  width: 100%;
  font-size: 14px;
  font-weight: bold;
}

:deep(.ant-picker){
  border: none;
  border-bottom: solid 1px rgb(191, 191, 191) !important;
  input {
    border: none;
    font-size: 14px;
    font-weight: bold;
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
