<template>
  <BasicModal
    width="500px"
    v-bind="$attrs"
    title="供应商分类"
    @ok="handleOk()"
    @register="register"
  >
    <template #title>
      <div style="display: flex;" class="vben-basic-title">
        <img src="/create.svg" style="width:25px;margin-right: 10px;"/>
        <span style="line-height: 25px;font-size: 16px;">供应商分类</span>
      </div>
    </template>
    <div
      class="nc-open-content"
      style="height: 100%"
    >
      <div class="open-content-up" style="text-align: center;margin-top: 30px;">
        <label style="font-size: 18px;margin-left: 0;">分类名称：</label>
        <a-input v-model:value="formItems.cusCclassName" placeholder="" class="abc" style="width: 65%;" />
        <span class="red_span">*</span>
        <br/><br/><br/>
        <label>分类编码：</label>
        <a-input v-model:value="formItems.cusClass" placeholder=""/>
        <span class="red_span">*</span>
        <br/><br/>

        <label>上级分类：</label>
        <TreeSelect
          disabled
          v-model:value="formItems.parentId"
          style="width: 50%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data="treeData"
          placeholder="请选择上级分类"
          tree-default-expand-all
          allow-clear
        >
        </TreeSelect>
        <span class="red_span"></span>
      </div>
    </div>
  </BasicModal>
</template>
<script setup="props, { content }" lang="ts">
import { onMounted, reactive, ref, toRaw, unref } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import {
  GetCustomerClassTree,
  verifyCusClass,
  verifyCusClassName,
} from '/@/api/record/system/supplier_class';
import {
  TreeSelect,
  Form as AForm,
  Select as ASelect,
  Input as AInput,
  Statistic as AStatistic,
  message,
} from 'ant-design-vue';
import {getCurrentAccountName} from "/@/api/task-api/tast-bus-api";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useMessage} from "/@/hooks/web/useMessage";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {saveLog} from "/@/api/record/system/group-sys-login-log";
const ASelectOption = ASelect.Option;
const AInputSearch = AInput.Search;
const AStatisticCountdown = AStatistic.Countdown;
const AFormItem = AForm.Item;
const { createErrorModal,createWarningModal } = useMessage()
const emit=defineEmits(['register']);
const accountInfo:any = ref({})
const formItems:any = ref({})
const oldformItems:any = ref({})
const database = ref(getCurrentAccountName(true));
const treeData = ref([]);
const inputDisabled = ref(false);
const oldcusClass = ref('');
const oldcusCclassName = ref('');

// 数据库模式名称
const [register, { closeModal }] = useModalInner( async (data) => {
  formItems.value.cusClass=''
  formItems.value.cusCclassName=''
  formItems.value.parentId=''
  accountInfo.value=data.accountInfo

  // 供应商信息传入
  if(data.database!==undefined){database.value=data.database}
  formItems.value.parentId = data.data.parentId;
  const aa=await useRouteApi(GetCustomerClassTree,{schemaName: database})('')
  function a(aa) {
    aa.forEach((item) => {
      if (item.children != null) {
        a(item.children);
      }
      item.title = '(' + item.cusClass + ')' + item.cusCclassName;
      item.value = item.uniqueCustclass;
      item.key = item.uniqueCustclass;
    });
  }
  a(aa);
  treeData.value=aa

  oldformItems.value=data.data
  formItems.value.id = data.data.id,
  formItems.value.uniqueCustclass = data.data.uniqueCustclass,
  formItems.value.cusClass = data.data.cusClass,
  formItems.value.cusClassGrade = data.data.cusClassGrade,
  formItems.value.parentId = data.data.parentId=='0'?'':data.data.parentId,
  formItems.value.cusCclassName = data.data.cusCclassName,
  formItems.value.cusBend = data.data.cusBend,
  formItems.value.flag = data.data.flag,
  formItems.value.cusGradeCode = data.data.cusGradeCode;

  oldcusClass.value=data.data.cusClass
  oldcusCclassName.value=data.data.cusCclassName
  if(formItems.value.cusClass==='9999'){inputDisabled.value=true}
});


async function handleOk() {
  if(oldcusCclassName.value!==formItems.value.cusCclassName){
    const sumName = await useRouteApi(verifyCusClassName,{schemaName: database})({parentId: formItems.value.parentId,cusClassName: formItems.value.cusCclassName});
    if (sumName > 0) {
      return createErrorPop('同级别分类名称已存在！');
    }
  }else{
    if(formItems.value.cusCclassName===undefined || formItems.value.cusCclassName===''){
      return createErrorPop('分类名称不能为空！');
    }
  }

  if(oldcusClass.value!==formItems.value.cusClass){
    const sumNum = await useRouteApi(verifyCusClass,{schemaName: database})(formItems.value.cusClass);
    if (sumNum > 0) {
      return createErrorPop('分类编码已存在！');
    }
  }else{
    if(formItems.value.cusClass===undefined || formItems.value.cusClass===''){
      return createErrorPop('分类编码不能为空！');
    }
  }

  let log=''
  if(oldformItems.value.cusClass!==formItems.value.cusClass){
    log+='分类编码【'+oldformItems.value.cusClass+','+formItems.value.cusClass+'】,'
  }
  if(oldformItems.value.cusCclassName!==formItems.value.cusCclassName){
    log+='分类名称【'+oldformItems.value.cusCclassName+','+formItems.value.cusCclassName+'】,'
  }
  // 埋点-操作日志
  if(log!==''){
    let arrlog='操作内容【修改供应商分类】,账套代码【'+accountInfo.value.coCode+'】,账套名称【'+accountInfo.value.companyName+'】,'+log.substring(0,log.length-1)
    /************** 记录操作日志 ****************/
    let logmap={
      loginTime:new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "),
      userId: useUserStoreWidthOut().getUserInfo.username,
      userName: useUserStoreWidthOut().getUserInfo.realName,
      optModule:'master_data',
      optFunction:'供应商分类',
      optRange:'1',
      uniqueCode:database.value,
      optAction:'修改',
      optContent:arrlog,
    }
    await saveLog(logmap)
    /************** 记录操作日志 ****************/
  }
  emit('save', unref(formItems));
  closeModal();
}
function createErrorPop(text) {
  createWarningModal({
    iconType: 'warning',
    title: '提示',
    content: text
  })
  return false
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
