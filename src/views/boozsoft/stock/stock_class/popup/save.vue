<template>
  <BasicModal
    width="500px"
    v-bind="$attrs"
    title="存货分类"
    @ok="handleOk()"
    @register="register"
  >
    <template #title>
      <div style="display: flex;" class="vben-basic-title">
        <img src="/create.svg" style="width:25px;margin-right: 10px;"/>
        <span style="line-height: 25px;font-size: 16px;">存货分类</span>
      </div>
    </template>
    <div
      class="nc-open-content"
      style="height: 100%"
    >
      <div class="open-content-up" style="text-align: center;margin-top: 30px;">
        <label style="font-size: 18px;margin-left: 0;">分类名称：</label>
        <a-input v-model:value="formItems.stockCclassName" placeholder="" class="abc" style="width: 65%;" />
        <span class="red_span">*</span>
        <br/><br/><br/>
        <label>分类编码：</label>
        <a-input v-model:value="formItems.stockClass" placeholder=""/>
        <span class="red_span">*</span>
        <br/><br/>

        <label>上级分类：</label>
        <TreeSelect
          v-model:value="formItems.parentId"
          style="width: 50%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data="treeData"
          placeholder="请选择上级分类"
          tree-default-expand-all
          allow-clear
          @change="treeChange"
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
    GetStockClassTree,
    verifyStockClass,
    verifyStockClassName,
  } from '/@/api/record/stock/stock_class';
  import {
    TreeSelect,
    Form as AForm,
    Select as ASelect,
    Input as AInput,
    Statistic as AStatistic,
    message,
  } from 'ant-design-vue';
  import {getCurrentAccountName, hasBlank} from "/@/api/task-api/tast-bus-api";
  import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
  import {useMessage} from "/@/hooks/web/useMessage";
  import {countByStockClass} from "/@/api/record/stock/stock";
  const ASelectOption = ASelect.Option;
  const AInputSearch = AInput.Search;
  const AStatisticCountdown = AStatistic.Countdown;
  const AFormItem = AForm.Item;
  const {createConfirm, createWarningModal, createMessage,createErrorModal} = useMessage();
  const emit=defineEmits(['register']);
  const formItems:any = ref({})
  const database = ref(getCurrentAccountName(true));
  const treeData = ref([]);

  // 数据库模式名称
  const [register, { closeModal }] = useModalInner( async (data) => {
    formItems.value.stockClass=''
    formItems.value.stockCclassName=''
    formItems.value.parentId=''
    // 客户信息传入
    if(data.database!==undefined){database.value=data.database}
    formItems.value.parentId = data.data.parentId;
    const aa=await useRouteApi(GetStockClassTree,{schemaName: database})('')
    function a(aa) {
      aa.forEach((item) => {
        if (item.children != null) {
          a(item.children);
        }
        item.title = '(' + item.stockClass + ')' + item.stockCclassName;
        item.value = item.uniqueStockclass;
        item.key = item.uniqueStockclass;
      });
    }
    a(aa);
    treeData.value=aa
  });

  async function treeChange(val) {
    if(!hasBlank(val)){
      let countStockCLass=await useRouteApi(countByStockClass,{schemaName: database})(val);
      if(countStockCLass>0){
        createConfirm({
          iconType: 'warning',
          title: '警告',
          content: '上级分类已有存货档案,继续添加将自动修改成新分类下，确认要添加吗？',
          onOk: async () => {},
          onCancel: () => {
            formItems.value.parentId=""
            return false
          }
        })
      }
    }
  }
  async function handleOk() {
    if(formItems.value.stockCclassName===undefined || formItems.value.stockCclassName===''){
      return createErrorPop('分类名称不能为空！');
    }else{
        const sumName = await useRouteApi(verifyStockClassName,{schemaName: database})({parentId: formItems.value.parentId,stockClassName: formItems.value.stockCclassName});
        if (sumName > 0) {
          return createErrorPop('同级别分类名称已存在！');
        }
    }
    if(formItems.value.stockClass===undefined || formItems.value.stockClass===''){
      return createErrorPop('分类编码不能为空！');
    }else{
      const sumNum = await useRouteApi(verifyStockClass,{schemaName: database})(formItems.value.stockClass);
      if (sumNum > 0) {
        return createErrorPop('分类编码已存在！');
      }
    }
    emit('save', unref(formItems));
    closeModal();
  }
function createErrorPop(text) {
  createErrorModal({
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
