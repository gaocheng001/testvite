<template>
  <BasicModal
    width="600px"
    v-bind="$attrs"
    title="辅助核算设置"
    @ok="handleOk"
    @cancel="handleClose"
    :canFullscreen="false"
    @register="register"
  >
      <div style="height: 60px;width: 100%;background-color: #2b4bcb">

      </div>
      <a-transfer
        show-search
        :titles="['待选条件', '已选条件']"
        :operations="['确定', '取消']"
        :render="item => item.title"
        :list-style="{width: '250px',height: '300px'}"
        :selected-keys="selectedKeys"
        :target-keys="targetKeys"
        :data-source="filterDatas"
        @change="transferHandleChange"
        @selectChange="transferHandleSelectChange"
      />
  </BasicModal>
</template>

<script setup lang="ts">
import {ref, unref, reactive, onMounted, watch, computed} from 'vue'
import {BasicModal, useModalInner} from '/@/components/Modal'
import {
  message, Transfer as ATransfer
} from "ant-design-vue"
import {SearchOutlined,} from '@ant-design/icons-vue'
import {useUserStore} from "/@/store/modules/user";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {hasBlank} from "/@/api/task-api/tast-bus-api";
import {findKeyLabelAll} from "/@/api/record/system/fuZhuHeSuan";
import {JsonTool} from "/@/api/task-api/tools/universal-tools";

const emit = defineEmits(['register','modify'])
const userStore = useUserStore();
const userId = userStore.getUserInfo.id

const targetKeys: any = ref([])
const selectedKeys: any = ref([])
let filterDatas = ref([])

onMounted(async () => {

});

const formItems: any = ref({})
let changeBeforeModel: any = {}

const deptList = ref([])
const userList = ref([])
const custList = ref([])
const supList = ref([])
const proMaxList = ref([])
const proList = ref([])
/*自定义辅助核算*/
const otherData = ref({})

let opentargetKeysLength = 0

const [register, {closeModal, setModalProps}] = useModalInner(async (data) => {
  // {'assistType': key,'oldValue':value,'dynamicTenant': currentDynamicTenant.value,'userList': userList.value}
  formItems.value = data.data
  changeBeforeModel = JSON.parse(JSON.stringify(formItems.value))
  // 判断当前辅助核算类型
  targetKeys.value = []
  filterDatas.value = []
  try{
    if (formItems.value.assistType == 'cdeptId'){
      if (deptList.value.length === 0) deptList.value = (await useRouteApi(findKeyLabelAll,{schemaName: formItems.value.dynamicTenant})({require: 'fzDept',toTarget: 'false'}))[0]['list']
      deptList.value.forEach(item=>{filterDatas.value.push({key: item.key,title: item.label})})
    }else if (formItems.value.assistType == 'cpersonId'){
      if (userList.value.length === 0) userList.value = formItems.value.userList || [];
      userList.value.forEach(item=>{filterDatas.value.push({key: item.uniqueCode,title: item.psnName})})
    }else if (formItems.value.assistType == 'ccusId'){
      if (custList.value.length === 0) custList.value = (await useRouteApi(findKeyLabelAll, {schemaName: formItems.value.dynamicTenant})({require: 'fzCustom',toTarget: 'false'}))[0]['list']
      userList.value.forEach(item=>{filterDatas.value.push({key: item.key,title: item.label})})
    }else if (formItems.value.assistType == 'csupId'){
      if (supList.value.length === 0) supList.value = (await useRouteApi(findKeyLabelAll, {schemaName: formItems.value.dynamicTenant})({require: 'fzGys',toTarget: 'false'}))[0]['list']
      userList.value.forEach(item=>{filterDatas.value.push({key: item.key,title: item.label})})
    }else if (formItems.value.assistType == 'projectId'){
      if (proMaxList.value.length === 0) proMaxList.value = (await useRouteApi(findKeyLabelAll, {schemaName: formItems.value.dynamicTenant})({require: 'fzItemClass',toTarget: 'false'}))[0]['list']
      userList.value.forEach(item=>{filterDatas.value.push({key: item.projectCateCode,title: item.projectCateName})})
    }else if (formItems.value.assistType.indexOf('cdfine') != -1){
      if (otherData.value[formItems.value.assistType] == null ||  otherData.value[formItems.value.assistType].length === 0){
        let str = parseInt(formItems.value.assistType.replace('cdfine',''))+''
        otherData.value[formItems.value.assistType] = (await useRouteApi(findKeyLabelAll, {schemaName: formItems.value.dynamicTenant})({require: str,toTarget: 'false'}))[0]['list']
      }
      otherData.value[formItems.value.assistType].forEach(item=>{filterDatas.value.push({key: item.key,title: item.label})})
    }
  }catch (e) {

  }

  if (filterDatas.value.length > 0 && !hasBlank(formItems.value.oldValue))targetKeys.value = formItems.value.oldValue.split(',').map(title=>filterDatas.value.filter(item=>item.title===title)[0].key)
  opentargetKeysLength = targetKeys.value.length
  setModalProps({minHeight: 360});
})

// 过滤设置
const transferHandleChange = (nextTargetKeys: string[]) => {
  targetKeys.value = nextTargetKeys;
}
const transferHandleSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
  selectedKeys.value = [...sourceSelectedKeys, ...targetSelectedKeys];
}

const handleOk = () => {
  if (targetKeys.value.length > 0 || opentargetKeysLength > 0)
  emit('modify',{'assistType': formItems.value.assistType,inputMap: {values: targetKeys.value,
      titles: assembleStrData(targetKeys.value.map(key=>filterDatas.value.filter(item=>item.key===key)[0].title))}})
  closeModal()
  return false;
}
const handleClose = () => {
  closeModal()
  return true;
}

const assembleStrData = (arr:any) => {
  let str = ''
  arr.forEach(s=>str+=(s+','))
  return str.substring(0,str.length-1)
}
</script>
