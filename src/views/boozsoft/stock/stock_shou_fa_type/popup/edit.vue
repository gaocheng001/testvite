<template>
  <BasicModal
    width="500px"
    v-bind="$attrs"
    title="收发方式"
    @ok="handleOk()"
    @register="register"
  >
    <template #title>
      <div style="display: flex;" class="vben-basic-title">
        <img src="/@/assets/images/create.svg" style="width:25px;margin-right: 10px;"/>
        <span style="line-height: 25px;font-size: 16px;">收发方式</span>
      </div>
    </template>
    <div
      class="nc-open-content"
      style="height: 100%"
    >
      <div class="open-content-up" style="text-align: center;margin-top: 30px;">
        <label>方式类别：</label>
        <a-radio-group v-model:value="formItems.isAccrual" name="radioGroup" @change="typeCheck">
          <a-radio  value="1">收</a-radio>
          <a-radio value="2">发</a-radio>
        </a-radio-group>
        <label style="font-size: 18px;margin-left: 0;">方式名称：</label>
        <a-input v-model:value="formItems.ecName" placeholder="" class="abc" style="width: 65%;" />
        <span class="red_span">*</span>
        <br/><br/><br/>

<!--        <label>上级方式：</label>-->
<!--        <TreeSelect-->
<!--          v-model:value="formItems.parentId"-->
<!--          style="width: 50%"-->
<!--          @change="changeFl"-->
<!--          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"-->
<!--          :tree-data="treeData"-->
<!--          placeholder="请选择上级方式"-->
<!--          tree-default-expand-all-->
<!--          allow-clear-->
<!--        >-->
<!--        </TreeSelect>-->
<!--        <br><br>-->

        <label>方式编码：</label>
        <a-input v-model:value="formItems.ecCode" @blur="changeCode" :maxlength="codeLength" disabled/>

      </div>
    </div>

  </BasicModal>
</template>
<script setup="props, {content}" lang="ts">
import { onMounted, ref, unref } from 'vue'
import { BasicModal, useModalInner } from '/@/components/Modal'
import {
  // need
  TreeSelect
} from 'ant-design-vue'
 import { psnFindByFlag } from '/@/api/psn/psn'
import {Input as AInput,Select as ASelect,Popover as APopover,Radio as ARadio} from "ant-design-vue";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {findAll2, getDeptList, GetDeptTreeByFlag, getMaxCode} from '/@/api/record/stock/shou-fa'

import {useMessage} from "/@/hooks/web/useMessage";
const ASelectOption = ASelect.Option
const AInputSearch = AInput.Search
const ARadioGroup = ARadio.Group
const ARadioButton = ARadio.Button
const emit=defineEmits(['register','save'])

const {
  createErrorModal
} = useMessage()

const formItems:any = ref({})

const treeData:any = ref([])

const psnList:any = ref({})

let changeBeforeModel:any = {}
const dynamicTenantId = ref()
const shoufaData = ref({})

const [register, { closeModal }] = useModalInner(async (data) => {
  dynamicTenantId.value = data.dynamicTenantId

  GetDeptTreeByFlag().then(res=>{
    function a(deptTree:any) {
      deptTree.forEach(
          (item: any) => {
          if (item.children != null) {
            a(item.children)
          }
          item.title = '(' + item.ecCode + ')' + item.ecName
          item.value = item.id
          item.bend = item.bend
          item.key = item.id
        })
    }
    a(res)
    treeData.value = res
  })
  // 方式2
  formItems.value = {
    id: data.data.id,
    uniqueCode: data.data.uniqueCode,
    ecCode: data.data.ecCode,
    ecName: data.data.ecName,
    isAccrual: data.data.isAccrual,
    parentId: data.data.parentId == 0 ? '' : data.data.parentId,
    uniqueCodeUser: data.data.uniqueCodeUser
  }

  changeBeforeModel = JSON.parse(JSON.stringify(formItems.value))
  shoufaData.value=await useRouteApi(findAll2,{schemaName: dynamicTenantId})('')
})

function typeCheck() {
  if(formItems.value.isAccrual==='1'){
    let shou=shoufaData.value.items.filter(v=>v.ecName==='收').map(item=>item.id).toString()
    formItems.value.parentId=shou
    treeData.value=shoufaData.value.items.filter(v=>v.ecName==='收')
    changeFl()
  }else if(formItems.value.isAccrual==='2'){
    let shou=shoufaData.value.items.filter(v=>v.ecName==='发').map(item=>item.id).toString()
    formItems.value.parentId=shou
    treeData.value=shoufaData.value.items.filter(v=>v.ecName==='发')
    changeFl()
  }
}

const flg = ref()
const codeLength:any = ref(3)
async function changeFl() {
  //根据选中 去限制方式编码输入长度
  //3-2-2-2-2
  let str
  treeForeach(treeData.value,str)
  const a = flg.value
  if(formItems.value.parentId){
    if(a.length === 3){
      codeLength.value = 5
    }else if(a.length === 5){
      codeLength.value = 7
    }else if(a.length === 7){
      codeLength.value = 9
    }else if(a.length === 9){
      codeLength.value = 11
    }
    //请求改编码下最大code
    const res = await useRouteApi(getMaxCode,{schemaName: dynamicTenantId})(formItems.value.parentId)
    formItems.value.ecCode = formItems.value.isAccrual+res
  }else{
    if(formItems.value.ecCode.length >3){
      formItems.value.ecCode = ''
    }
  }
}

async function treeForeach(tree,str) {
  tree.forEach(data=>{
    if(data.id === formItems.value.parentId){
      flg.value = data.ecCode
      str = data.id
      return
    }
    data.children && treeForeach(data.children,str)
  })
}
const vid = ref('0')
async function treeForeach2(tree,str) {
  vid.value = '0'
  tree.forEach(data=>{
    if(data.key === str){
      vid.value = data.id
      return
    }
    data.children && treeForeach2(data.children,str)
  })
}
async function changeCode() {
  //根据输入值判断 3 重置上级
  if(formItems.value.ecCode != '' && formItems.value.ecCode.length === 3){
    formItems.value.parentId = ''
    codeLength.value = 3
  }else if(formItems.value.ecCode != '' && formItems.value.ecCode.length === 5 || formItems.value.ecCode.length === 7){
    //5 7  判断有无  有选中  无 重置自己
    //截取前3位  截取前5位  formItems.value.ecCode.length - 2
    treeForeach2(treeData.value,formItems.value.ecCode.substring(0,formItems.value.ecCode.length - 2))
    if(vid.value === '0'){
      formItems.value.ecCode = ''
    }else{
      formItems.value.parentId = vid.value
    }
  }else{
    //其他长度 直接重置
    formItems.value.ecCode = ''
  }
}

let isChanged:boolean = false
async function handleOk() {
  const res = await getDeptList()
  const deptList = res.items
  if(formItems.value.ecCode==''|| formItems.value.ecCode==null){
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '方式编码不能为空！'
    })
    return false
  }
  if (formItems.value.ecName == '' || formItems.value.ecName == null) {
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '方式名称不能为空！'
    })
    return false
  }
  if (formItems.value.ecCode != changeBeforeModel.ecCode && formItems.value.ecCode != '' && formItems.value.ecCode != null) {
    for (let i = 0; i < deptList.length; i++) {
      const dept = deptList[i];
      if (dept.ecCode == formItems.value.ecCode) {
        createErrorModal({
          iconType: 'warning',
          title: '提示',
          content: '方式编码重复不允许添加！'
        })
        return false
      }
    }
  }
  if (formItems.value.ecName != changeBeforeModel.ecName && formItems.value.ecName != '' && formItems.value.ecName != null) {
    for (let i = 0; i < deptList.length; i++) {
      const dept = deptList[i];
      if (dept.ecName == formItems.value.ecName) {
        createErrorModal({
          iconType: 'warning',
          title: '提示',
          content: '方式名称重复不允许添加！'
        })
        return false
      }
    }
  }
  isChanged = !(formItems.value.uniqueCode == changeBeforeModel.uniqueCode
    && formItems.value.ecCode == changeBeforeModel.ecCode
    && formItems.value.ecName == changeBeforeModel.ecName
    && formItems.value.parentId == changeBeforeModel.parentId
    && formItems.value.uniqueCodeUser == changeBeforeModel.uniqueCodeUser)
  if(isChanged){
    if(formItems.value.parentId){
      treeFind(treeData.value,formItems.value.parentId)
      if(findTree.value.bend){
        formItems.value.bend = findTree.value.bend
      }else{
        formItems.value.bend = '0'
      }
    }
    emit('save', unref(formItems))
    closeModal()
    return true
  }
  closeModal()
  // alert("没有改变过")
  return false
}
const findTree = ref()
async function treeFind(tree,str) {
  tree.forEach(data=>{
    if(data.id === str){
      findTree.value = data
      return
    }
    data.children && treeFind(data.children,str)
  })
}


onMounted(async () => {
})

const handleChange = () => {
  console.log('selected ${key}')
}
const filterOption = (input: string, option: any) => {
  return option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
}

function handleFocus() {
}

function handleBlur() {
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
