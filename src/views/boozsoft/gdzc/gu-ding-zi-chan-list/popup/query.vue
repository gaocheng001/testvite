<template>
  <BasicModal
    width="500px"
    v-bind="$attrs"
    title="条件查询"
    @ok="handleOk()"
    @cancel="handleClose()"
    :loading="loadMark"
    @register="register"
  >
    <div class="nc-open-content" style="margin-top: 20px;margin-bottom: 20px;height: 240px;">
      <div class="open-content-up">
        <AccountPicker theme="two" @reloadTable="dynamicAdReload"/>
        <br/>
<!--        <label>管理类型：</label>
        <Select v-model:value="formItems.manageCode" placeholder="管理类型" style="width: 50%;">
          <SelectOption v-for="item in accountList" :value="item.id">FA{{item.faAccId}}-{{item.faAccName}}</SelectOption>
        </Select>
        <br/>-->
        <label>时点日期：</label>
        <DatePicker v-model:value="formItems.cdate" :locale="localeCn" placeholder="时点日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" :disabled-date="disabledDate" style="width: 50%;"/>
        <br/>
        <label>资产类别：</label>
        <TreeSelect
          v-model:value="formItems.faClass"
          style="width: 50%;"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data="assetTypeList"
          placeholder="资产类别"
          tree-default-expand-all
          allow-clear
        >
        </TreeSelect>
        <br/>
        <label>管理部门：</label>
        <TreeSelect
          v-model:value="formItems.dept"
          style="width: 50%;"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data="deptList"
          placeholder="管理部门"
          tree-default-expand-all
          allow-clear
        >
        </TreeSelect>
        <br/>
        <label>项目：</label>
        <Select v-model:value="formItems.zerenUser" placeholder="项目" style="width: 50%;">
          <SelectOption v-for="item in projectList" :value="item.uniqueCode">{{item.projectCode}}-{{item.projectName}}</SelectOption>
        </Select>
        <br/>
        <label>责任人：</label>
        <Select v-model:value="formItems.zerenUser" placeholder="责任人" style="width: 50%;">
          <SelectOption v-for="item in psnList" :value="item.uniqueCode">{{item.psnCode}}-{{item.psnName}}</SelectOption>
        </Select>
        <br/>
        <label>存放位置：</label>
        <Select v-model:value="formItems.addr" placeholder="存放位置" style="width: 50%;">
          <SelectOption v-for="item in locationList" :value="item.uniqueCode">{{item.ecName}}</SelectOption>
        </Select>
        <br/>
        <label>折旧方法：</label>
        <Select v-model:value="formItems.zhejiuMethod" placeholder="折旧方法" style="width: 50%;">
          <SelectOption v-for="item in zhejiuMethodList" :value="item.id">{{item.zjName}}</SelectOption>
        </Select>
      </div>
    </div>
  </BasicModal>
</template>

<script setup="props, { content }" lang="ts">
import {onMounted, ref, unref} from 'vue';
import {BasicModal, useModalInner} from '/@/components/Modal';
import {Select, Input, DatePicker, TreeSelect, message} from 'ant-design-vue';
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
// import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker.vue";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-GDZC.vue";
import {getCurrentAccountName, hasBlank} from "/@/api/task-api/tast-bus-api";
import router from "/@/router";
import {useTabs} from "/@/hooks/web/useTabs";
import {useMessage} from "/@/hooks/web/useMessage";
import {
  findCardMasterByIymonth,
  findChangeByCardUnique, findChangeDeptByCardUnique, findChangeProjectByCardUnique,
  findFaAssetTypeByFlagAndBend, findLocationByFlagAndBend, findZhejiuMethodByFlag
} from "/@/api/fa/fa-card";
import {findFaAccountByAccId} from "/@/api/record/gdzc/zc-options";
import {
  deleteByManageCodeAndIyearAndImonth, findByManageCodeAndIyearAndImonth,
  findPeriodByUniqueCode,
  saveFaDepreciationList, saveFaPeriod
} from "/@/api/fa/fa-jiti_zhejiu";
import {add, div, mul, pad, sub} from "/@/views/boozsoft/gdzc/gu-ding-zi-chan-add/calculation";
import localeCn from 'ant-design-vue/es/date-picker/locale/zh_CN';
import {psnFindByFlag} from "/@/api/psn/psn";
import {GetDeptTreeByFlag} from "/@/api/sys/dept";
import {GetDeptTreeByFlag as GetAssetTypeTreeByFlag} from "/@/api/record/system/fa-asset-type";
import {findAllProject} from "/@/api/record/system/project";
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
});

onMounted(async () => {
})

const accountList:any = ref([])
const assetTypeList:any = ref([])
const deptList:any = ref([])
const projectList:any = ref([])
const psnList:any = ref([])
const locationList:any = ref([])
const zhejiuMethodList:any = ref([])
//加载管理代码
async function reloadList(){
  /*accountList.value = await findFaAccountByAccId(defaultAdName.value)
  if (accountList.value.length>0){
    formItems.value.manageCode = accountList.value[0].id
    const time = await findAssetsDate({code: formItems.value.manageCode, iyear: year.value})
    formItems.value.cdate = time.date
  }*/
  //选择资产类别
  const assetTypeLists = await useRouteApi(GetAssetTypeTreeByFlag,{schemaName: dynamicTenantId})({})
  function assetTypeFun(assetTypeTree: any) {
    assetTypeTree.forEach(
      (item: any) => {
        if (item.children != null) {
          assetTypeFun(item.children)
        }
        item.title = '(' + item.ecCode + ')' + item.ecName
        item.value = item.uniqueCode
        item.key = item.uniqueCode
      })
  }
  assetTypeFun(assetTypeLists)
  assetTypeList.value = assetTypeLists
  //选择部门
  const deptLists =await useRouteApi(GetDeptTreeByFlag, {schemaName: dynamicTenantId})({})
  function deptFun(deptTree: any) {
    deptTree.forEach(
      (item: any) => {
        if (item.children != null) {
          deptFun(item.children)
        }
        item.title = '(' + item.deptCode + ')' + item.deptName
        item.value = item.uniqueCode
        item.key = item.uniqueCode
      })
  }
  deptFun(deptLists)
  deptList.value = deptLists
  projectList.value = await useRouteApi(findAllProject,{schemaName:dynamicTenantId})({})
  psnList.value = await useRouteApi(psnFindByFlag,{schemaName: dynamicTenantId})({})
  locationList.value = await useRouteApi(findLocationByFlagAndBend,{schemaName: dynamicTenantId})({})
  zhejiuMethodList.value = await useRouteApi(findZhejiuMethodByFlag,{schemaName: dynamicTenantId})({})
}

const disabledDate = (current) => {
  // 获取区间最小区间
  if (!hasBlank(formItems.value.cdate)) {
    let variable = formItems.value.cdate.substring(0, 7)
    let max = moment(variable, 'YYYY-MM-DD').endOf('month')
    return current > max
  }
};

const depreciationList:any = ref([])
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
      content: '时点日期不能为空！'
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
    const time = await findAssetsDate({code: formItems.value.manageCode, iyear: year.value})
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
