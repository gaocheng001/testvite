<template>
  <BasicModal
    width="500px"
    v-bind="$attrs"
    title="计提折旧"
    @ok="handleOk()"
    @cancel="handleClose()"
    :loading="loadMark"
    @register="register"
  >
    <div class="nc-open-content" style="margin-top: 10px;margin-bottom: 10px;height: 240px;">
      <div class="open-content-up">
        <AccountPicker theme="two" @reloadTable="dynamicAdReload"/>
        <br/>
        <label>管理类型：</label>
        <Select v-model:value="formItems.manageCode" @change="reloadPeriod()" placeholder="管理类型" style="width: 50%">
          <SelectOption v-for="item in accountList" :value="item.id">FA{{item.faAccId}}-{{item.faAccName}}</SelectOption>
        </Select>
        <br/><br/>
        <label>折旧期间：</label>
        <Select v-model:value="formItems.month" placeholder="折旧期间" style="width: 50%;" :disabled="true">
          <SelectOption v-for="item in periodList" :value="item.imonth">{{item.imonth}}月</SelectOption>
        </Select>
        <br/><br/>
      </div>
    </div>
  </BasicModal>
</template>

<script setup="props, { content }" lang="ts">
import {onMounted, ref, unref} from 'vue';
import {BasicModal, useModalInner} from '/@/components/Modal';
import {Select, Input, DatePicker} from 'ant-design-vue';
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker.vue";
import {getCurrentAccountName} from "/@/api/task-api/tast-bus-api";
import router from "/@/router";
import {useTabs} from "/@/hooks/web/useTabs";
import {useMessage} from "/@/hooks/web/useMessage";
import {
  findCardMasterByIymonth,
  findChangeByCardUnique, findChangeDeptByCardUnique, findChangeProjectByCardUnique,
  findFaAssetTypeByFlagAndBend, findZhejiuMethodByFlag
} from "/@/api/fa/fa-card";
import {findFaAccountByAccId} from "/@/api/record/gdzc/zc-options";
import {
  deleteByManageCodeAndIyearAndImonth, findByManageCodeAndIyearAndImonth,
  findPeriodByUniqueCode,
  saveFaDepreciationList, saveFaPeriod
} from "/@/api/fa/fa-jiti_zhejiu";
import {add, div, mul, pad, sub} from "/@/views/boozsoft/gdzc/gu-ding-zi-chan-add/calculation";
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
const zhejiuMethodList = ref([])
const periodList:any = ref([])
//加载管理代码
async function reloadList(){
  accountList.value = await findFaAccountByAccId(defaultAdName.value)
  zhejiuMethodList.value = await useRouteApi(findZhejiuMethodByFlag,{schemaName: dynamicTenantId})({})
  if (accountList.value.length>0){
    formItems.value.manageCode = accountList.value[0].id
    await reloadPeriod()
  }
}
//加载期间
const period:any = ref({})
async function reloadPeriod(){
  periodList.value = await findPeriodByUniqueCode({code:formItems.value.manageCode,year:year.value})
  periodList.value.forEach(item => {
    if (item.isSettle!='1'){
      period.value = item
      formItems.value.month = item.imonth
    }
  })
}
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
  if (formItems.value.month==null || formItems.value.month==''){
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '折旧期间不能为空！'
    })
    return false
  }
  loadMark.value = true
  //删除折旧表信息
  await useRouteApi(deleteByManageCodeAndIyearAndImonth,{schemaName: dynamicTenantId})({code:formItems.value.manageCode,year:formItems.value.year,month:formItems.value.month})
  //获取折旧表计算值
  await calculationJitizhejiu()
  //保存折旧表
  await useRouteApi(saveFaDepreciationList,{schemaName: dynamicTenantId})(depreciationList.value)
  //修改期间表折旧状态
  period.value.isZhejiu = '1'
  await saveFaPeriod(period.value)
  loadMark.value = false
  emit('save', unref(formItems));
  closeModal();
  return true;
}

async function calculationJitizhejiu() {
  depreciationList.value = []
  let ymonth = year.value + '-' + formItems.value.month
  let year1 = year.value
  let month1 = ''
  if (formItems.value.month>1){
    month1 = pad(formItems.value.month-1,2)
  } else {
    year1 = year.value - 1
    month1 = '12'
  }
  const cardMasterList: any = await useRouteApi(findCardMasterByIymonth, {schemaName: dynamicTenantId})({iymonth: year.value + '-' + formItems.value.month})
  const shangyueZhejiuList: any = await useRouteApi(findByManageCodeAndIyearAndImonth, {schemaName: dynamicTenantId})({code:formItems.value.manageCode,year:year1,month:month1})
  for (const item of cardMasterList) {
    const change: any = await useRouteApi(findChangeByCardUnique, {schemaName: dynamicTenantId})(item.cardUnique)
    const changeDeptList = await useRouteApi(findChangeDeptByCardUnique, {schemaName: dynamicTenantId})(item.cardUnique)
    const changeProjectList = await useRouteApi(findChangeProjectByCardUnique, {schemaName: dynamicTenantId})(item.cardUnique)
    let yuezhejiulv = 0
    let yuezhejiue = 0
    if (change.yuezhejiulv!=null && change.yuezhejiulv!=''){
      yuezhejiulv = change.yuezhejiulv
    }
    if (change.yuezhejiue!=null && change.yuezhejiue!=''){
      yuezhejiue = change.yuezhejiue
    }
    let jzdqrTime=item.jzdqrTime.substring(0,7)
    let flag = false
    if (jzdqrTime==ymonth){
      flag = true
    }
    //月折旧额大于0开始计提
    if (yuezhejiue>0) {
      if (item.zhejiuType != '1') {//多部门
        if (changeDeptList.length > 0) {//部门不为空
          changeDeptList.forEach(dept => {
            const syzhejiu = shangyueZhejiuList.filter(zhejiu => zhejiu.cardUnique == item.cardUnique && zhejiu.deptUnique == dept.deptUnique)
            const depreciation: any = {}
            depreciation.uniqueCode = item.uniqueCode
            depreciation.manageCode = item.manageCode
            depreciation.cardUnique = item.cardUnique
            depreciation.iyear = year.value
            depreciation.imonth = formItems.value.month
            if (syzhejiu.length > 0) {//上月计提折旧有值
              if (flag) {//是最后一个月
                //本月 = 原值-累计折旧-净残值
                depreciation.zjBy = sub(sub(mul(change.yuanzhi, div(dept.proportion, 100)), syzhejiu[0].zjLj), mul(mul(change.yuanzhi, div(change.jingcanzhilv, 100)), div(dept.proportion, 100))).toFixed(5)
              } else {
                depreciation.zjBy = mul(yuezhejiue, div(dept.proportion, 100)).toFixed(5)
              }
              depreciation.zjLj = add(syzhejiu[0].zjLj, depreciation.zjBy).toFixed(5)
              if (year.value == year1) {
                depreciation.zjBn = add(syzhejiu[0].zjBn, depreciation.zjBy).toFixed(5)
              } else {
                depreciation.zjBn = depreciation.zjBy
              }
            } else {//上月计提折旧没值
              if (flag) {//是最后一个月
                //本月 = 原值-累计折旧-净残值
                depreciation.zjBy = mul(sub(sub(change.yuanzhi, change.ljzhejiu), mul(change.yuanzhi, div(change.jingcanzhilv, 100))), div(dept.proportion, 100)).toFixed(5)
                depreciation.zjLj = add(mul(change.ljzhejiu, div(dept.proportion, 100)), depreciation.zjBy).toFixed(5)
                depreciation.zjBn = depreciation.zjBy
              } else {
                depreciation.zjBy = mul(yuezhejiue, div(dept.proportion, 100)).toFixed(5)
                depreciation.zjLj = mul(add(change.ljzhejiu, yuezhejiue), div(dept.proportion, 100)).toFixed(5)
                depreciation.zjBn = mul(yuezhejiue, div(dept.proportion, 100)).toFixed(5)
              }
            }
            depreciation.gzlBy = null
            depreciation.gzlLj = null
            depreciation.deptUnique = dept.deptUnique
            depreciation.deptBl = dept.proportion
            if (changeProjectList.length > 0) {
              depreciation.projectUnique = changeProjectList[0].projectUnique
              depreciation.projectBl = dept.proportion
            } else {
              depreciation.projectUnique = ''
              depreciation.projectBl = ''
            }
            depreciationList.value.push(depreciation)
          })
        } else {//部门为空
          const syzhejiu = shangyueZhejiuList.filter(zhejiu => zhejiu.cardUnique == item.cardUnique)
          const depreciation: any = {}
          depreciation.uniqueCode = item.uniqueCode
          depreciation.manageCode = item.manageCode
          depreciation.cardUnique = item.cardUnique
          depreciation.iyear = year.value
          depreciation.imonth = formItems.value.month
          if (syzhejiu.length > 0) {//上月计提折旧有值
            if (flag) {//是最后一个月
              //本月 = 原值-累计折旧-净残值
              depreciation.zjBy = sub(sub(change.yuanzhi, syzhejiu[0].zjLj), mul(change.yuanzhi, div(change.jingcanzhilv, 100))).toFixed(5)
            } else {
              depreciation.zjBy = parseFloat(yuezhejiue).toFixed(5)
            }
            depreciation.zjLj = add(syzhejiu[0].zjLj, depreciation.zjBy).toFixed(5)
            if (year.value == year1) {
              depreciation.zjBn = add(syzhejiu[0].zjBn, depreciation.zjBy).toFixed(5)
            } else {
              depreciation.zjBn = depreciation.zjBy
            }
          } else {
            if (flag) {//是最后一个月
              //本月 = 原值-累计折旧-净残值
              depreciation.zjBy = sub(sub(change.yuanzhi, change.ljzhejiu), mul(change.yuanzhi, div(change.jingcanzhilv, 100))).toFixed(5)
              depreciation.zjLj = add(change.ljzhejiu, depreciation.zjBy).toFixed(5)
              depreciation.zjBn = depreciation.zjBy
            } else {
              depreciation.zjBy = parseFloat(yuezhejiue).toFixed(5)
              depreciation.zjLj = add(change.ljzhejiu, yuezhejiue).toFixed(5)
              depreciation.zjBn = parseFloat(yuezhejiue).toFixed(5)
            }
          }
          depreciation.gzlBy = null
          depreciation.gzlLj = null
          depreciation.deptUnique = ''
          depreciation.deptBl = ''
          if (changeProjectList.length > 0) {
            depreciation.projectUnique = changeProjectList[0].projectUnique
            depreciation.projectBl = '100'
          } else {
            depreciation.projectUnique = ''
            depreciation.projectBl = ''
          }
          depreciationList.value.push(depreciation)
        }
      } else {//多项目
        if (changeProjectList.length > 0) {//项目不为空
          changeProjectList.forEach(project => {
            const syzhejiu = shangyueZhejiuList.filter(zhejiu => zhejiu.cardUnique == item.cardUnique && zhejiu.projectUnique == project.projectUnique)
            const depreciation: any = {}
            depreciation.uniqueCode = item.uniqueCode
            depreciation.manageCode = item.manageCode
            depreciation.cardUnique = item.cardUnique
            depreciation.iyear = year.value
            depreciation.imonth = formItems.value.month
            if (syzhejiu.length > 0) {//上月计提折旧有值
              if (flag) {//是最后一个月
                //本月 = 原值-累计折旧-净残值
                depreciation.zjBy = sub(sub(mul(change.yuanzhi, div(project.proportion, 100)), syzhejiu[0].zjLj), mul(mul(change.yuanzhi, div(change.jingcanzhilv, 100)), div(project.proportion, 100))).toFixed(5)
              } else {
                depreciation.zjBy = mul(yuezhejiue, div(project.proportion, 100)).toFixed(5)
              }
              depreciation.zjLj = add(syzhejiu[0].zjLj, depreciation.zjBy).toFixed(5)
              if (year.value == year1) {
                depreciation.zjBn = add(syzhejiu[0].zjBn, depreciation.zjBy).toFixed(5)
              } else {
                depreciation.zjBn = depreciation.zjBy
              }
            } else {//上月计提折旧没值
              if (flag) {//是最后一个月
                //本月 = 原值-累计折旧-净残值
                depreciation.zjBy = mul(sub(sub(change.yuanzhi, change.ljzhejiu), mul(change.yuanzhi, div(change.jingcanzhilv, 100))), div(project.proportion, 100)).toFixed(5)
                depreciation.zjLj = add(mul(change.ljzhejiu, div(project.proportion, 100)), depreciation.zjBy).toFixed(5)
                depreciation.zjBn = depreciation.zjBy
              } else {
                depreciation.zjBy = mul(yuezhejiue, div(project.proportion, 100)).toFixed(5)
                depreciation.zjLj = mul(add(change.ljzhejiu, yuezhejiue), div(project.proportion, 100)).toFixed(5)
                depreciation.zjBn = mul(yuezhejiue, div(project.proportion, 100)).toFixed(5)
              }
            }
            depreciation.gzlBy = null
            depreciation.gzlLj = null
            if (changeDeptList.length > 0) {
              depreciation.deptUnique = changeDeptList[0].deptUnique
              depreciation.deptBl = project.proportion
            } else {
              depreciation.deptUnique = null
              depreciation.deptBl = null
            }
            depreciation.projectUnique = project.projectUnique
            depreciation.projectBl = project.proportion
            depreciationList.value.push(depreciation)
          })
        } else {//项目为空
          const syzhejiu = shangyueZhejiuList.filter(zhejiu => zhejiu.cardUnique == item.cardUnique)
          const depreciation: any = {}
          depreciation.uniqueCode = item.uniqueCode
          depreciation.manageCode = item.manageCode
          depreciation.cardUnique = item.cardUnique
          depreciation.iyear = year.value
          depreciation.imonth = formItems.value.month
          if (syzhejiu.length > 0) {//上月计提折旧有值
            if (flag) {//是最后一个月
              //本月 = 原值-累计折旧-净残值
              depreciation.zjBy = sub(sub(change.yuanzhi, syzhejiu[0].zjLj), mul(change.yuanzhi, div(change.jingcanzhilv, 100))).toFixed(5)
            } else {
              depreciation.zjBy = parseFloat(yuezhejiue).toFixed(5)
            }
            depreciation.zjLj = add(syzhejiu[0].zjLj, depreciation.zjBy).toFixed(5)
            if (year.value == year1) {
              depreciation.zjBn = add(syzhejiu[0].zjBn, depreciation.zjBy).toFixed(5)
            } else {
              depreciation.zjBn = depreciation.zjBy
            }
          } else {
            if (flag) {//是最后一个月
              //本月 = 原值-累计折旧-净残值
              depreciation.zjBy = sub(sub(change.yuanzhi, change.ljzhejiu), mul(change.yuanzhi, div(change.jingcanzhilv, 100))).toFixed(5)
              depreciation.zjLj = add(change.ljzhejiu, depreciation.zjBy).toFixed(5)
              depreciation.zjBn = depreciation.zjBy
            } else {
              depreciation.zjBy = parseFloat(yuezhejiue).toFixed(5)
              depreciation.zjLj = add(change.ljzhejiu, yuezhejiue).toFixed(5)
              depreciation.zjBn = parseFloat(yuezhejiue).toFixed(5)
            }
          }
          depreciation.gzlBy = null
          depreciation.gzlLj = null
          if (changeProjectList.length > 0) {
            depreciation.deptUnique = changeProjectList[0].deptUnique
            depreciation.deptBl = '100'
          } else {
            depreciation.deptUnique = ''
            depreciation.deptBl = ''
          }
          depreciation.projectUnique = ''
          depreciation.projectBl = ''
          depreciationList.value.push(depreciation)
        }
      }
    }
  }
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
  await reloadList()
  formItems.value.defaultAdName = obj.accId
  formItems.value.dynamicTenantId = obj.accountMode
  formItems.value.year = obj.year
  formItems.value.thisAdInfo = obj
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
