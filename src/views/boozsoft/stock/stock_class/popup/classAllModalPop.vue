<template>
  <BasicModal
    width="500px"
    :minHeight="300"
    :height="300"
    v-bind="$attrs"
    :closable="false"
    title="选择科目"
    @ok="handleOk()"
    @register="register"
  >
    <template #title>
      <div style="display: flex;" class="vben-basic-title">
        <span style="line-height: 25px;font-size: 20px;">
          <SearchOutlined style="width:25px;margin-right: 10px;"/>
          存货分类档案
        </span>
      </div>
    </template>
    <a-input-search v-model:value="pageParameter.searchValue" placeholder="" style="width: 200px; border-radius: 4px;margin-left: 25%" @search="searchClass"/>
    <br><br>
    <div style="height: calc(100% - 60px);overflow: auto;">
      <a-tree
        v-model:checkedKeys="checkedKeys"
        checkable
        :defaultExpandAll="true"
        :tree-data="treeData"
      >
      </a-tree>
    </div>
  </BasicModal>
</template>
<script setup="props, { content }" lang="ts">
import {SearchOutlined} from '@ant-design/icons-vue'
import {BasicModal, useModal, useModalInner} from '/@/components/Modal';
import {
  Form as AForm,
  Input as AInput,
  Radio as ARadio,
  Select as ASelect,
  Statistic as AStatistic,
  Tree as ATree,
} from 'ant-design-vue';
import {reactive, ref, unref} from "vue";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {GetStockClassTree, treeStockClass} from "/@/api/record/stock/stock_class";


const ASelectOption = ASelect.Option;
const AInputSearch = AInput.Search;
const AStatisticCountdown = AStatistic.Countdown;
const AFormItem = AForm.Item;
const ARadioGroup = ARadio.Group
const emit=defineEmits(['register','throwData']);
const database:any = ref('');
const treeData:any = ref([]);
const checkedKeys:any = ref([]);
const pageParameter = reactive({
  searchValue: '',
})

const [registerSavePage, { openModal: openSavePage }] = useModal();
const [register, { closeModal }] = useModalInner( async (data) => {
  database.value=data.database
  checkedKeys.value=[]
  fetch()
});

async function searchClass() {
  const deptTree=await useRouteApi(treeStockClass,{schemaName: database})(pageParameter)
  function a(customerTree) {
    customerTree.forEach((item) => {
      if (item.children != null) {
        a(item.children);
      }
      item.title = '[' + item.stockClass + '] ' + item.stockCclassName;
      item.key = item.uniqueStockclass;
    });
  }
  a(deptTree);
  treeData.value = []
  treeData.value=deptTree
}

async function fetch() {
  const deptTree = await useRouteApi(GetStockClassTree,{schemaName: database})('')
  function a(customerTree) {
    customerTree.forEach((item) => {
      if (item.children != null) {
        a(item.children);
      }
      item.title = '[' + item.stockClass + '] ' + item.stockCclassName;
      item.key = item.uniqueStockclass;
    });
  }
  a(deptTree);
  treeData.value = []
  treeData.value=deptTree
}
// 存货分类
function handleSelect(val) {
  if(val.length==0){
    val=['0']
  }
}
// watch(checkedKeys, () => {
//   console.log('checkedKeys', checkedKeys);
// });
async function handleOk() {
  emit('throwData', unref(checkedKeys.value));
  closeModal();
}

</script>
<style>
.ant-modal-title{
  margin-top: -10px;
}
.ant-modal-header{
  height: 10px;
}
.scrollbar__view{
  overflow-y: hidden;
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

.scroll-container .scrollbar__wrap {
  margin-bottom: -5px !important;
}
</style>
<style lang="less" scoped>
:deep(.ant-table-thead th) {
  background-color: #d8d8d8 !important;
  font-weight: bold !important;
  border-left: 1px solid #d8d8d8 !important;
  border-bottom: 1px solid #d8d8d8 !important;
  border-top: 1px solid #d8d8d8 !important;
}
.bg-white{
  width: 220px ;
  min-height: 462px ;
  height: calc(100% - 462px);
  border: 1px #cccccc solid;
  background:white ;
}
.a-table-font-size-12 :deep(td),
.a-table-font-size-12 :deep(th) {
  font-size: 14px !important;
  padding: 2px 8px !important;
}
:deep(.ant-tree .ant-tree-node-content-wrapper.ant-tree-node-selected),
:deep(.ant-table-tbody > tr.ant-table-row-selected > td){
  background-color: #1488b1;
  color: white;
}
</style>
