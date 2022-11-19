<template>
  <BasicModal
    width="500px"
    v-bind="$attrs"
    title="部门档案"
    @ok="handleOk()"
    @register="register"
    :canFullscreen="false"
  >
    <template #title>
      <div style="display: flex;" class="vben-basic-title">
        <span style="line-height:40px;font-size: 28px;">
          <PlusCircleOutlined style="font-size: 34px;font-weight: bold"/>&nbsp;&nbsp;部门信息
        </span>
      </div>
      <div style="display: inline-block;position:absolute;right: 50px;top: 0;z-index: 100000;background:#ffffff">
        <img src="/@/assets/images/person.png" style="height:100px;margin-right: 10px;"/>
      </div>
    </template>
    <div
      class="nc-open-content"
      style="height: 100%"
    >
      <div class="open-content-up" style="text-align: center;margin-top: 60px;">
        <label>上级部门：</label>
        <TreeSelect
          v-model:value="formItems.parentId"
          style="width: 50%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data="treeData"
          placeholder="请选择上级部门"
          tree-default-expand-all
          show-search
          :filter-option="filterOption"
          allow-clear
        >
          <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
        </TreeSelect>
        <span class="red_span"></span>
        <br/>
        <label>部门编码：</label>
        <a-input v-model:value="formItems.deptCode" placeholder=""/>
        <span class="red_span">*</span>
        <br/><br/><br/>

        <label style="font-size: 18px;margin-left: 0;width:130px;">部门名称：</label>
        <a-input v-model:value="formItems.deptName" placeholder="" class="abc" style="width: 60%;" />
        <span class="red_span">*</span>

      </div>
    </div>

    <template #footer>
      <a-button @click="closeModal()">取消</a-button>
      <a-button @click="handleOk()" :disabled="saveClick">保存</a-button>
    </template>

  </BasicModal>
</template>
<script setup="props, {content}" lang="ts">
import { onMounted, ref, unref } from 'vue'
import { BasicModal, useModalInner } from '/@/components/Modal'
import {
  PlusCircleOutlined,
  CaretDownOutlined
} from '@ant-design/icons-vue'
import { GetDeptTreeByFlag } from '/@/api/sys/dept'
import {Input as AInput,Select as ASelect,Popover as APopover,TreeSelect,message} from "ant-design-vue";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {getDeptList, saveDept} from "/@/api/record/system/dept";
import {useMessage} from "/@/hooks/web/useMessage";
const ASelectOption = ASelect.Option
const AInputSearch = AInput.Search

const {
  createErrorModal
} = useMessage()

const emit=defineEmits(['register','save'])

const formItems:any = ref({})

const saveClick:any = ref(false)

const treeData:any = ref([])
const deptList:any = ref([])
const filterOption = (input: string, option: any) => {
  return option.title.indexOf(input) >= 0;
};
let changeBeforeModel:any = {}
const dynamicTenantId = ref()
const [register, { closeModal }] = useModalInner((data) => {
  saveClick.value=false
  dynamicTenantId.value = data.dynamicTenantId
  useRouteApi(GetDeptTreeByFlag,{schemaName: dynamicTenantId})({}).then(res=>{
    function a(deptTree:any) {
      deptTree.forEach(
        (item: any) => {
          if (item.children != null) {
            a(item.children)
          }
          item.title = '(' + item.deptCode + ')' + item.deptName
          item.value = item.id
          item.key = item.id
        })
    }
    a(res)
    treeData.value = res
    deptList.value = res
  })
  // 方式2
  formItems.value = JSON.parse(JSON.stringify(data.data))
  formItems.value.parentId = ''
  changeBeforeModel = JSON.parse(JSON.stringify(formItems.value))
})

let isChanged:boolean = false
async function handleOk() {
  saveClick.value=true
  const res = await useRouteApi(getDeptList,{schemaName: dynamicTenantId})({})
  const deptList = res.items
  if(formItems.value.deptCode==''|| formItems.value.deptCode==null){
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '部门编码不能为空！'
    })
    saveClick.value=false
    return false
  }
  if (formItems.value.deptName == '' || formItems.value.deptName == null) {
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '部门名称不能为空！'
    })
    saveClick.value=false
    return false
  }
  if (formItems.value.deptCode != changeBeforeModel.deptCode && formItems.value.deptCode != '' && formItems.value.deptCode != null) {
    for (let i = 0; i < deptList.length; i++) {
      const dept = deptList[i];
      if (dept.deptCode == formItems.value.deptCode) {
        createErrorModal({
          iconType: 'warning',
          title: '提示',
          content: '部门编码重复不允许添加！'
        })
        saveClick.value=false
        return false
      }
    }
  }
  if (formItems.value.deptName != changeBeforeModel.deptName && formItems.value.deptName != '' && formItems.value.deptName != null) {
    for (let i = 0; i < deptList.length; i++) {
      const dept = deptList[i];
      if (dept.deptName == formItems.value.deptName) {
        createErrorModal({
          iconType: 'warning',
          title: '提示',
          content: '部门名称重复不允许添加！'
        })
        saveClick.value=false
        return false
      }
    }
  }
  isChanged = !(formItems.value.uniqueCode == changeBeforeModel.uniqueCode
    && formItems.value.deptCode == changeBeforeModel.deptCode
    && formItems.value.deptName == changeBeforeModel.deptName
    && formItems.value.parentId == changeBeforeModel.parentId
    && formItems.value.uniqueCodeUser == changeBeforeModel.uniqueCodeUser)
  if(isChanged){
    emit('save', unref(formItems))
    closeModal()
    saveClick.value=false
    return true
  }
  closeModal()
  // alert("没有改变过")
  return false
}

async function handleOkAdd() {
  saveClick.value=true
  const res = await useRouteApi(getDeptList,{schemaName: dynamicTenantId})({})
  const deptList = res.items
  if(formItems.value.deptCode==''|| formItems.value.deptCode==null){
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '部门编码不能为空！'
    })
    saveClick.value=false
    return false
  }
  if (formItems.value.deptName == '' || formItems.value.deptName == null) {
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '部门名称不能为空！'
    })
    saveClick.value=false
    return false
  }
  if (formItems.value.deptCode != changeBeforeModel.deptCode && formItems.value.deptCode != '' && formItems.value.deptCode != null) {
    for (let i = 0; i < deptList.length; i++) {
      const dept = deptList[i];
      if (dept.deptCode == formItems.value.deptCode) {
        createErrorModal({
          iconType: 'warning',
          title: '提示',
          content: '部门编码重复不允许添加！'
        })
        saveClick.value=false
        return false
      }
    }
  }
  if (formItems.value.deptName != changeBeforeModel.deptName && formItems.value.deptName != '' && formItems.value.deptName != null) {
    for (let i = 0; i < deptList.length; i++) {
      const dept = deptList[i];
      if (dept.deptName == formItems.value.deptName) {
        createErrorModal({
          iconType: 'warning',
          title: '提示',
          content: '部门名称重复不允许添加！'
        })
        saveClick.value=false
        return false
      }
    }
  }
  isChanged = !(formItems.value.uniqueCode == changeBeforeModel.uniqueCode
    && formItems.value.deptCode == changeBeforeModel.deptCode
    && formItems.value.deptName == changeBeforeModel.deptName
    && formItems.value.parentId == changeBeforeModel.parentId
    && formItems.value.uniqueCodeUser == changeBeforeModel.uniqueCodeUser)
  if(isChanged){
    // emit('save', unref(formItems))
    await useRouteApi(saveDept, {schemaName: dynamicTenantId})(formItems.value)
    message.success('保存成功！')
    formItems.value = {}
    changeBeforeModel = JSON.parse(JSON.stringify(formItems.value))
    saveClick.value=false
    // closeModal()
    return true
  }
  // closeModal()
  // alert("没有改变过")
  return false
}

onMounted(async () => {
  // await fetch()
})
</script>
<style>
.vben-basic-title {
  color: #0096c7 !important;
  border:none !important;
}

.ant-modal-body {
  padding: 0px;
  border-bottom: 1px solid rgb(1, 129, 226);
  border-left: none;
  border-right: none;
  border-top: none !important;
}
.ant-modal-header{
  border: none !important;
}
</style>
<style lang="less" scoped>
:deep(.vben-basic-title) {
  color: #0096c7 !important;
}
.ant-modal-header{
  border: none !important;
}

:deep(.ant-select-single:not(.ant-select-customize-input)
.ant-select-selector
.ant-select-selection-search-input) {
  border: none !important;
}

.vben-basic-title {
  color: #0096c7 !important;
  border: none !important;
}

.ant-modal-body {
  padding: 0px;
  border-bottom: 1px solid rgb(1, 129, 226);
  border-left: none;
  border-right: none;
  border-top: none !important;
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
