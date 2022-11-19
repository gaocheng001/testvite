<template>
  <BasicModal
    width="900px"
    ::minHeight="500"
    :height="500"
    v-bind="$attrs"
    title="选择科目"
    @ok="handleOk()"
    @register="register"
  >
    <template #title>
      <div style="display: flex;" class="vben-basic-title">
        <span style="line-height: 25px;font-size: 20px;">
          <SearchOutlined style="width:25px;margin-right: 10px;"/>
          选择科目
        </span>
      </div>
    </template>
    <div style="background-color: #158eb8;height: 50px;padding-top: 10px;padding-left:10px;border-radius: 5px;">
      <a-select style="width: 100px;" v-model:value="pageParameter.ccode">
        <a-select-option value="ccode">科目编码</a-select-option>
        <a-select-option value="ccodeName">科目名称</a-select-option>
        <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
      </a-select>
      <a-input-search placeholder="" v-model:value="inputsearch" style="width: 200px; border-radius: 4px" @search="findBySerach"/>
      <div style="float: right;margin-right: 5px;">
        <button type="button" class="ant-btn ant-btn-me" @click="openAddPage"><span>添加</span></button>
        <button type="button" class="ant-btn ant-btn-me" @click="reload"><span>刷新</span></button>
      </div>
    </div>
    <div class="bg-white" style="display: inline;width: 30%;float: left;margin-top: 5px;">
      <div style="width: 100%; height: 26px;text-align: center;background-color: rgb(216 216 216);">
        <label style="font-size: 14px;font-weight: bold;">科目目录</label>
      </div>
      <BasicTree
        defaultExpandAll
        :click-row-to-expand="false"
        :tree-data="treeData"
        :loading="loading"
        v-model:selectedKeys="selectedKeys2"
        v-model:expandedKeys="expandedKeys"
        @select="handleSelect"
      />
    </div>
    <div style="display: inline;width: 69.5%;float: right;margin-top: 5px;">
      <BasicTable @register="registerTable" :scroll="{ y: 400 }" :class="'a-table-font-size-12'" :row-selection="{ type: 'radio',selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" @row-dbClick="rowDbClick">
        <template #bcash="{ record }">
            <span v-if="record.bcash == '1'">
              <CheckOutlined />
            </span>
        </template>
        <template #bbank="{ record }">
            <span v-if="record.bbank == '1'">
              <CheckOutlined />
            </span>
        </template>
        <template #bdaybook="{ record }">
            <span v-if="record.bdaybook == '1'">
              <CheckOutlined />
            </span>
      </template>
        <template #bnum="{ record }">
            <span v-if="record.bnum == '1'">
              <CheckOutlined />
            </span>
      </template>
        <template #currency="{ record }">
            <span v-if="record.currency == '1'">
              <CheckOutlined />
            </span>
        </template>
      </BasicTable>
    </div>
    <AddPage @save="saveData" @register="registerSavePage" />
  </BasicModal>
</template>
<script setup="props, { content }" lang="ts">
import AddPage from './save.vue';
import {BasicTable, useTable} from '/@/components/Table';
import { BasicTree } from '/@/components/Tree';
import { SearchOutlined,CheckOutlined,CaretDownOutlined } from '@ant-design/icons-vue';
import { onMounted, reactive, ref, toRaw, unref } from 'vue';
import {BasicModal, useModal, useModalInner} from '/@/components/Modal';
import {
  Select as ASelect,
  Table as ATable,
  Form as AForm,
  Input as AInput,
  Statistic as AStatistic,
} from 'ant-design-vue';
import {getCurrentAccountName} from "/@/api/task-api/tast-bus-api";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useMessage} from "/@/hooks/web/useMessage";
import {
  company_saveCodekemu, company_findByAllCode, company_findByAllCodeTree,
} from "/@/api/codekemu/codekemu";
import {acctemplateFindByAccId} from "/@/api/acctemplate/acctemplate";
import {findByAccStyle, findByStandardUnique} from "/@/api/accstandard/accstandard";
import {findAllByAccCountPartColumn} from "/@/api/record/system/account";
const ASelectOption = ASelect.Option;
const AInputSearch = AInput.Search;
const AStatisticCountdown = AStatistic.Countdown;
const AFormItem = AForm.Item;
const { createErrorModal } = useMessage()
const emit=defineEmits(['register']);
const database = ref(getCurrentAccountName(true));
const iyear = ref('');
const accId = ref('');
const loading = ref(true);
const treeData:any = ref([]);
const selectedKeys2:any = ref([]);
const expandedKeys:any = ref([]);
const dataSource:any = ref([]);
const columns = [
  {
    title: '科目编码',
    dataIndex: 'ccode',
    key: 'ccode',
    ellipsis:true,
    align:'left',
    slots: { customRender: 'ccode' },
    width:200
  },
  {
    title: '科目名称',
    dataIndex: 'ccodeName',
    key: 'ccodeName',
    align:'left',width:400,
    ellipsis:true
  }
  // ,{
  //   title: '辅助项',
  //   dataIndex: 'fuzhu',
  //   key: 'fuzhu',
  //   align:'left',
  //   ellipsis:true
  // },{
  //   title: '现金账',
  //   dataIndex: 'bcash',
  //   key: 'bcash',
  //   ellipsis:true,width:80,
  //   slots: { customRender: 'bcash' },
  // },{
  //   title: '银行账',
  //   dataIndex: 'bbank',
  //   key: 'bbank',
  //   width:80,
  //   ellipsis:true,
  //   slots: { customRender: 'bbank' },
  // },{
  //   title: '日记账',
  //   dataIndex: 'bdaybook',
  //   key: 'bdaybook',
  //   width:80,
  //   ellipsis:true,
  //   slots: { customRender: 'bdaybook' },
  // },{
  //   title: '数量核算',
  //   dataIndex: 'bnum',
  //   key: 'bnum',
  //   width:80,
  //   ellipsis:true,
  //   slots: { customRender: 'bnum' },
  // },{
  //   title: '外币核算',
  //   dataIndex: 'currency',
  //   key: 'currency',
  //   width:80,
  //   ellipsis:true,
  //   slots: { customRender: 'currency' },
  // }
];
const selectedRowKeys:any = ref([]);
const selectedRowData:any = ref({});
const styleList:any = ref([]);
const inputsearch:any = ref('');

const pageParameter = reactive({
  ccode: 'ccode',
  value: '',
  cclass: '',
  iyear: '',
})

const [registerSavePage, { openModal: openSavePage }] = useModal();
// 这是示例组件
const [registerTable, { reload,getSelectRows,getDataSource,setTableData }] = useTable({
  api: useRouteApi(company_findByAllCode,{schemaName: database}),
  columns: columns,
  loading: loading.value,
  bordered: true,
  pagination:{ pageSize: 50,showSizeChanger: true, pageSizeOptions: ['50','100'],showTotal: t => `总共${t}条数据` },
  searchInfo: pageParameter
});
const [register, { closeModal }] = useModalInner( async (data) => {
  database.value=data.database
  accId.value=data.accId
  iyear.value=data.iyear
  pageParameter.iyear=data.iyear
  findByAccStyleAll()
  reload()
});

function findBySerach() {
  selectedKeys2.value=['0']
  pageParameter.value=inputsearch
  pageParameter.cclass=''
  reload()
}

function onSelectChange(a,b) {
  if(a.length>0){
    selectedRowKeys.value=a
    selectedRowData.value=b
  }
}

// 获取科目类型
async function findByAccStyleAll() {
  const codelistall= await acctemplateFindByAccId(accId.value)
  const accstandard= await findByStandardUnique(codelistall.uniqueAccStandard)
  const accStyleUnique= await findByAccStyle(accstandard.accStyleUnique)
  styleList.value=[]
  for (let i = 0; i < accStyleUnique.length; i++) {
    styleList.value.push(accStyleUnique[i].cclass)
  }
  let map={ style:styleList.value.join(','),iyear:iyear.value }
  fetch(map)
}

async function fetch(map) {
  const deptTree = await useRouteApi(company_findByAllCodeTree,{schemaName: database})(map)
  function a(customerTree) {
    if(customerTree!==''){
      customerTree.forEach((item) => {
        if (item.children != null) {
          a(item.children);
        }
        item.title=item.title
        item.key=item.key+'>>'+item.bend
      });
    }
  }
  a(deptTree);
  treeData.value = []
  selectedKeys2.value=['0']
  expandedKeys.value=['0']
  treeData.value.push({title: '全部',key:'0',children: deptTree})
}
// 选中分类
function handleSelect(obj) {
  if(obj.toString()!==''){
    if(!isNaN(obj.toString().split('>>')[0])){
      pageParameter.value=obj.toString().split('>>')[0]
      pageParameter.cclass=''
      reload()
    }else{
      pageParameter.value=''
      pageParameter.cclass=obj.toString().split('>>')[0]
      reload()
    }
  }else{
    selectedKeys2.value=['0']
    pageParameter.value=''
    pageParameter.cclass=''
    reload()
  }
}
async function handleOk() {
  if(selectedRowData.value!==''){
    emit('throwData', unref(selectedRowData.value[0]));
    closeModal();
  }
}

function rowDbClick(data) {
  selectedRowData.value=[data]
  handleOk()
}

async function openAddPage() {
  const val = {
    standardUnique: '',
    templateID: '',
    jici: '',
    styleName: '',
    iyear: database.value.split('-')[2],
    independent: '',
    database: database.value,
    accId: accId.value,
  };
  let temp=await findAllByAccCountPartColumn(accId.value)
  val.standardUnique=temp.uniqueAccStandard
  val.templateID=temp.templateId
  val.jici=temp.ccodeLevel
  val.styleName=temp.stylist
  val.independent=temp.independent
  openSavePage(true, {
    data: val,
    ccodeInfo: '',
    all: 'yes',
    ibudgetAccounting: temp.ibudgetAccounting,
    modalType:'pop'
  });
}
async function saveData(data) {
  await useRouteApi(company_saveCodekemu, { schemaName: database })({
    params: data,
    accId: database.value,
    username: '',
  });
  reload()
  if (data.closeflag === 'add') {
    openAddPage()
  }
}

//js切割字符串
function setString(str, len) {
  var strlen = 0;
  var s = '';
  for (var i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 128) {
      strlen += 2;
    } else {
      strlen += 1.2;
    }
    s += str.charAt(i);
    if (strlen >= len) {
      return s + '...';
    }
  }
  return s;
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
