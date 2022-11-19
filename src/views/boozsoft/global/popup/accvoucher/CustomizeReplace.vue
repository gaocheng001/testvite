<template>
  <BasicModal
    width="600px"
    v-bind="$attrs"
    title="凭证内容替换"
    :canFullscreen="false"
    @ok="handleOk"
    :showOkBtn="showNext"
    @register="register">
    <template #title>
      <div style="display: flex;" class="vben-basic-title">
        <PlusCircleOutlined style="font-size: 50px;color: #0096c7;"/>
        <span style="line-height:50px;font-size: 30px;color: #0096c7;">&ensp;替换</span>
      </div>
      <div style="display: inline-block;position:absolute;right: 120px;top: 20px;background:#ffffff">
        <img src="/@/assets/images/th.png" draggable="false" style="height:100px;margin-right: 10px;"/>
      </div>
    </template>
    <div class="nc-open-content">
<!--      <div class="cont-top">
        <span>注意事项</span>
        <div>
          <p>1.内容替换包括了凭证摘要、会计科目、借贷方金额、辅助核算项;</p>
          <p>2.替换必须在凭证未记账状态下进行，已记账凭证不能进行替换;</p>
          <p>3.凭证已经经过出纳签字、审核、主管签字,不能进行内容替换;</p>
          <p>4.已经进行过往来核销和银行对账核销的凭证，不能进行内容替换;</p>
          <p>5.替换后内容不可逆，无法进行还原操作,请谨慎操作。</p>
        </div>
      </div>-->
      <div class="cont-bottom">
        <label>选择替换内容:</label>
        <Select style="width: 76%" v-model:value="openParameter.type" @change="contentRuleChange">
          <SelectOption value="cdigest">摘要</SelectOption>
          <SelectOption value="ccode">会计科目</SelectOption>
          <SelectOption value="cdfine">辅助核算项</SelectOption>
          <SelectOption value="md">借方金额</SelectOption>
          <SelectOption value="mc">贷方金额</SelectOption>
          <SelectOption value="pjCsettle">结算方式</SelectOption>
        </Select>
        <br/>
        <label>辅助核算项:</label><Select style="width: 76%" v-model:value="openParameter.cdfineValue"
                :disabled="openParameter.type != 'cdfine'"
                @change="cdfineRuleChange"
                :options="fzItems.map(fz => ({ value: fz.key,label: fz.title }))"/>
        <br/>
        <label>替换前内容:</label><Input v-model:value="openParameter.before" v-if="isInput"
                                       placeholder="请输入内容"
                                       style="width: 76%"/>
        <Select style="width: 76%" v-model:value="openParameter.before" v-else @change="boforeChange"
                :options="beforeList.map(fz => ({ value: fz.key,label: fz.title }))"
                placeholder="请选择内容"/><br/>
        <label>替换后内容:</label><Input v-model:value="openParameter.after" v-if="isInput"
                                       placeholder="请输入内容"
                                       style="width: 76%"/>
        <Select style="width: 76%" v-model:value="openParameter.after" v-else
                :options="afterList.map(fz => ({ value: fz.key,label: fz.title }))"
                placeholder="请选择内容"/>
      </div>
    </div>
  </BasicModal>
</template>
<script setup="props, {content}" lang="ts">
import {onMounted, ref} from 'vue'
import {BasicModal, useModalInner} from '/@/components/Modal';
import {useMessage} from "/@/hooks/web/useMessage";

const {createWarningModal} = useMessage()
import {Select, Input} from "ant-design-vue";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {findAllFuzhuHesuanList} from "/@/api/record/system/fuzhu-hesuan";
import {findKeyLabelAll} from "/@/api/record/system/fuZhuHeSuan";
import {JsonTool} from "/@/api/task-api/tools/universal-tools";
import {findCodeKmByPeriod, findCodeKmLastByYear} from "/@/api/record/generalLedger/data";
import {useUserStore} from "/@/store/modules/user";
import {findSettModesByFlag} from "/@/api/record/system/sett-modes";
import {hasBlank} from "/@/api/task-api/tast-bus-api";
import {
  startVoucherReplaceProcedural,
} from "/@/api/record/system/accvoucher";
import {PlusCircleOutlined} from '@ant-design/icons-vue';
const SelectOption = Select.Option
const InputSearch = Input.Search

const emit = defineEmits(['reload', 'register','log'])
const userStore = useUserStore();
const userId = userStore.getUserInfo.id
const [register, {closeModal, changeOkLoading, setModalProps}] = useModalInner(async (data) => {
  openParameter.value.type = ''
  openParameter.value.after = ''
  openParameter.value.before = ''
  openParameter.value.cdfineValue = ''
  dynamicTenant.value = data.data.dynamicTenant
  openParameter.value.selectedRowKeys = data.data.selectedRowKeys
  selectCodes.value = data.data.selectedCodes
  setModalProps({minHeight: 200});
  await initFzList()
})
const isInput = ref(true)
const showNext = ref(true)
const dynamicTenant = ref('')
// 页面变量
const openParameter = ref({
  type: '',
  before: '',
  after: '',
  cdfineValue: '',
  selectedRowKeys: [],
  operator: userStore.getUserInfo.realName
})
const beforeList = ref([])
const afterList = ref([])
const selectCodes = ref([])
const selectList = ref([])
const fzItems = ref([{
  key: 'cdeptId',
  title: `部门`
}
  , {
    key: 'cpersonId',
    title: `员工`
  },
  {
    key: 'ccusId',
    title: `客户`
  },
  {
    key: 'csupId',
    title: `供应商`
  },
  {
    key: 'projectId',
    title: `项目`
  }])
const initFzList = async () => {
  if (fzItems.value.length == 5) {
    let fzL = await useRouteApi(findAllFuzhuHesuanList, {schemaName: dynamicTenant.value})({})
    if (fzL.length > 0) fzL.forEach(item => fzItems.value.push({
      key: 'cdfine' + item.cdfine,
      title: item.cname
    }))
  }
}

const codeList = ref([])
const jsList = ref([])

const deptList = ref([])
const userList = ref([])
const custList = ref([])
const supList = ref([])
const proMaxList = ref([])
const proList = ref([])
const logContent = ref('')
/*自定义辅助核算*/
const otherData = ref({})
const contentRuleChange = async (v,e) => {
  logContent.value = e.children[0]['children']
  openParameter.value.before = ''
  openParameter.value.after = ''
  if (v == 'cdigest' || v == 'md' || v == 'mc') {
    isInput.value = true
  } else {
    isInput.value = false
    beforeList.value = []
    afterList.value = []
    if (v == 'ccode' || v == 'pjCsettle') {
      if (v == 'ccode') {
        let arrs = dynamicTenant.value.split('-')
        if (codeList.value.length === 0) codeList.value = (await useRouteApi(findCodeKmLastByYear, {schemaName: dynamicTenant.value})({
          iyear: arrs[2],
          accId: arrs[0] + '-' + arrs[1],
          userId: userId
        }))
        // 能选择的科目

       /* codeList.value.forEach(item => {
          beforeList.value.push({
            key: item.ccode + '-' + item.ccodeName,
            title: item.ccode + ' ' + item.ccodeName
          })
        })
        afterList.value = JsonTool.parseProxy(beforeList.value)
        */
        selectList.value=codeList.value.filter(item=>selectCodes.value.indexOf(item.ccode) != -1)
        selectList.value.forEach(item => {
          beforeList.value.push({
            key: item.ccode + '-' + item.ccodeName,
            title: item.ccode + ' ' + item.ccodeName
          })
        })
      } else if (v == 'pjCsettle') {
        if (jsList.value.length === 0) jsList.value = (await useRouteApi(findSettModesByFlag, {schemaName: dynamicTenant.value})({})).items
        jsList.value.forEach(item => {
          beforeList.value.push({key: item.id, title: item.settModesName})
        })
      afterList.value = JsonTool.parseProxy(beforeList.value)
      }
    }
  }
  openParameter.value.cdfineValue = ''
}

const cdfineRuleChange = async (v) => {
  openParameter.value.before = ''
  openParameter.value.after = ''
  beforeList.value = []
  if (v == 'cdeptId') {
    if (deptList.value.length === 0) deptList.value = (await useRouteApi(findKeyLabelAll, {schemaName: dynamicTenant.value})({
      require: 'fzDept',
      toTarget: 'false'
    }))[0]['list']
    deptList.value.forEach(item => {
      beforeList.value.push({key: item.key, title: item.label})
    })
  } else if (v == 'cpersonId') {
    if (userList.value.length === 0) userList.value = (await useRouteApi(findKeyLabelAll, {schemaName: dynamicTenant.value})({
      require: 'fzEmp',
      toTarget: 'false'
    }))[0]['list']
    userList.value.forEach(item => {
      beforeList.value.push({key: item.key, title: item.label})
    })
  } else if (v == 'ccusId') {
    if (custList.value.length === 0) custList.value = (await useRouteApi(findKeyLabelAll, {schemaName: dynamicTenant.value})({
      require: 'fzCustom',
      toTarget: 'false'
    }))[0]['list']
    custList.value.forEach(item => {
      beforeList.value.push({key: item.key, title: item.label})
    })
  } else if (v == 'csupId') {
    if (supList.value.length === 0) supList.value = (await useRouteApi(findKeyLabelAll, {schemaName: dynamicTenant.value})({
      require: 'fzGys',
      toTarget: 'false'
    }))[0]['list']
    supList.value.forEach(item => {
      beforeList.value.push({key: item.key, title: item.label})
    })
  } else if (v == 'projectId') {
    if (proMaxList.value.length === 0) proMaxList.value = (await useRouteApi(findKeyLabelAll, {schemaName: dynamicTenant.value})({
      require: 'fzItemClass',
      toTarget: 'false'
    }))[0]['list']
    proMaxList.value.forEach(item => {
      beforeList.value.push({key: item.key, title: item.label})
    })
  } else if (v.indexOf('cdfine') != -1) {
    if (otherData.value[v] == null || otherData.value[v].length === 0) {
      let str = parseInt(v.replace('cdfine', '')) + ''
      otherData.value[v] = (await useRouteApi(findKeyLabelAll, {schemaName: dynamicTenant.value})({
        require: str,
        toTarget: 'false'
      }))[0]['list']
    }
    otherData.value[v].forEach(item => {
      beforeList.value.push({key: item.key, title: item.label})
    })
  }
  afterList.value = JsonTool.parseProxy(beforeList.value)
}

const boforeChange = (v) => {
  if (openParameter.value.type == 'ccode'){
    // 存在辅助核算数量 配对
    let thisCode = v.split('-')[0]
    let boforeCode = codeList.value.filter(item=>item.ccode == thisCode)[0]
    let boforeFzArr = obtainingSubjectAuxiliaryItems(boforeCode)
    let afterCodes = []
    if (boforeFzArr.length == 0){
       afterCodes =  codeList.value.filter(item=>item.ccode != thisCode)
    }else {
       afterCodes =  codeList.value.filter(item=>item.ccode != thisCode &&
         boforeFzArr.toString() == obtainingSubjectAuxiliaryItems(item).toString())
    }
    afterCodes.forEach(item=>{
      afterList.value.push({
        key: item.ccode + '-' + item.ccodeName,
        title: item.ccode + ' ' + item.ccodeName
      })
    })
  }
}
// 根据获取科目存在的辅助核算项
const obtainingSubjectAuxiliaryItems = (codeObj:any) => {
    let fzArrNum = [
      'bperson', 'bcus', 'bsup', 'bdept', 'bitem', 'bnum', 'currency'
      ,'cdfine1','cdfine2','cdfine3','cdfine4','cdfine5','cdfine6','cdfine7','cdfine8','cdfine9','cdfine10',
      ,'cdfine11','cdfine12','cdfine13','cdfine14','cdfine15','cdfine16','cdfine17','cdfine18','cdfine19','cdfine20',
      ,'cdfine21','cdfine22','cdfine23','cdfine24','cdfine25','cdfine26','cdfine27','cdfine28','cdfine29','cdfine30',
    ]
    return fzArrNum.filter((key)=>codeObj[key] == '1')
}

const handleOk = async () => {
  let jeCheck = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
  if (hasBlank(openParameter.value.type)) {
    createWarningModal({title: '温馨提示', content: '请先选择替换内容！'});
  } else if (openParameter.value.type == 'cdfine' && hasBlank(openParameter.value.cdfineValue)) {
    createWarningModal({title: '温馨提示', content: '请先选择要进行替换的辅助核算项！'});
  } else if (hasBlank(openParameter.value.before)) {
    createWarningModal({title: '温馨提示', content: `请先${isInput.value ? '输入' : '选择'}要进行替换操作的内容！`});
  } else if (hasBlank(openParameter.value.after)) {
    createWarningModal({title: '温馨提示', content: `请先${isInput.value ? '输入' : '选择'}要进行替换操作后的内容！`});
  } else if ((openParameter.value.type == 'md' || openParameter.value.type == 'mc') && (!jeCheck.test(openParameter.value.before) || !jeCheck.test(openParameter.value.after))){
    createWarningModal({title: '温馨提示', content: `请先输入正确金额格式内容(保留两位)！`});
  }else {
    openParameter.value.before = openParameter.value.before.trim();
    openParameter.value.after = openParameter.value.after.trim();
    let res = await useRouteApi(startVoucherReplaceProcedural, {schemaName: dynamicTenant.value})(openParameter.value)
    if (null != res && res >= 0) {
      createWarningModal({title: '处理结果', content: `本次共完成${res}张凭证内容替换！`});
      closeModal()
      let v1 =  openParameter.value.before
      let v2 =  openParameter.value.after
      if (!isInput.value){
        v1 = beforeList.value.filter(it=>it.key == v1)[0]?.title
        v2 = afterList.value.filter(it=>it.key == v2)[0]?.title
      }
      emit('log',`替换内容【${logContent.value=='辅助核算项'?fzItems.value.filter(it=>it.key == openParameter.value.cdfineValue)[0]?.title:logContent.value}】,替换前后【${v1},${v2}】,替换成功凭证条数【${res}】`)
      emit('reload')
    }
  }
  return false;
}
</script>
<style lang="less" scoped>
@import '/@/assets/styles/part-open.less';
.nc-open-content {
  :deep(.ant-select-selector) {
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
    font-weight: bold;
  }
  :deep(.ant-tabs-tab-active){
    border-top: 2px solid #0096c7;
  }
  .cont-bottom{
    margin: 12% 5% 5%;
  }
  label {
    width: 120px;
    display: inline-block;
    padding: 10px;
    font-weight: bold;
    color: #666666;
  }
}
</style>
