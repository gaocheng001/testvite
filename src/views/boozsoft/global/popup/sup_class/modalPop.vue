<template>
  <BasicModal
    width="900px"
    :minHeight="500"
    :height="500"
    v-bind="$attrs"
    :closable="false"
    @ok="handleOk()"
    @register="register"
  >
    <template #title>
      <div style="display: flex;" class="vben-basic-title">
        <span style="line-height: 25px;font-size: 20px;">
          <SearchOutlined style="width:25px;margin-right: 10px;"/>
          选择供应商分类
        </span>
      </div>
    </template>
    <div style="background-color: #158eb8;height: 50px;padding-top: 10px;padding-left:10px;border-radius: 5px;">
      <div style="float: right;margin-right: 5px;">
<!--        <a-radio-group v-model:value="multipleFlag" @change="selectedRowKeys=[],selectedRowData=[]">-->
<!--          <a-radio :value="false">-->
<!--            单选-->
<!--          </a-radio>-->
<!--          <a-radio :value="true">-->
<!--            多选-->
<!--          </a-radio>-->
<!--        </a-radio-group>-->
        <button type="button" class="ant-btn ant-btn-me" @click="findByCusAuthData"><span>刷新</span></button>
      </div>
    </div>
    <div class="bg-white" style="display: inline;width: 30%;float: left;margin-top: 5px;">
      <div style="width: 100%; height: 26px;text-align: center;background-color: rgb(216 216 216);">
        <label style="font-size: 14px;font-weight: bold;">供应商分类</label>
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
      <BasicTable @register="registerTable" :scroll="{ y: 400 }" :class="'a-table-font-size-12'" :row-selection="{ type: multipleFlag?'checkbox':'radio',selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" @row-dbClick="rowDbClick">

      </BasicTable>
    </div>
    <AddPage @save="saveData"
             @dulisave="dulisaveData"
             @register="registerSavePage" />
  </BasicModal>
</template>
<script setup="props, { content }" lang="ts">
import { CaretDownOutlined } from '@ant-design/icons-vue'
import AddPage from './edit.vue';
import {BasicTable, useTable} from '/@/components/Table';
import { BasicTree } from '/@/components/Tree';
import { SearchOutlined } from '@ant-design/icons-vue';
import { onMounted, reactive, ref, toRaw, unref } from 'vue';
import {BasicModal, useModal, useModalInner} from '/@/components/Modal';
import {
  Radio as ARadio,
  Select as ASelect,
  Form as AForm,
  Input as AInput,
  Statistic as AStatistic,
} from 'ant-design-vue';
import {getCurrentAccountName} from "/@/api/task-api/tast-bus-api";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useMessage} from "/@/hooks/web/useMessage";
import {findAllByAccCountPartColumn, findByAccId} from "/@/api/record/system/account";
import {
  getCusClassAuthorData,
  GetCustomerClassTree,
  findAllCustomerClass,
  findAllSupClass
} from "/@/api/record/system/supplier_class";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {
  customerAddApi,
  duLiSaveApi,
  findAll,
  getCusDataAuthorData
} from "/@/api/record/supplier_data/supplier";
import {getCusTypeSeeSwitch} from "/@/api/record/system/customer_class";
const ASelectOption = ASelect.Option;
const AInputSearch = AInput.Search;
const AStatisticCountdown = AStatistic.Countdown;
const AFormItem = AForm.Item;
const ARadioGroup = ARadio.Group
const { createWarningModal } = useMessage()
const emit=defineEmits(['register']);
const database = ref(getCurrentAccountName(true));
// 1独立账套。0集团账套
const independent = ref('0');
const accId = ref('');
const loading = ref(true);
const treeData:any = ref([]);
const selectedKeys2:any = ref([]);
const expandedKeys:any = ref([]);
const dataSource:any = ref([]);
const columns = [
  {
    title: '分类编码',
    dataIndex: 'cusClass',
    key: 'cusClass',
    ellipsis:true,
    align:'left',
    width:150
  },
  {
    title: '分类名称',
    dataIndex: 'cusCclassName',
    key: 'cusCclassName',
    align:'left',
    ellipsis:true
  },
  {
    title: '上级名称',
    dataIndex: 'superClassName',
    key: 'custName',
    align:'left',
    ellipsis:true
  }
];
const selectedRowKeys:any = ref([]);
const selectedRowData:any = ref([]);
const styleList:any = ref([]);
// 单选\多选
const multipleFlag:any = ref(false);

const pageParameter = reactive({
  page:1,
  size:10000,
  searchValue:'',
  superid:'',
  companyCode: '',
  companyName: '',
  ifUnit: false,
  total: 0,
  thisAdInfo: {},
  thisLeftKey: '',
  flag:'1',
  database: database.value,
  accId: accId.value,
  username: useUserStoreWidthOut().getUserInfo.username,
  uniqueCustclass:'',
  searchConditon: {
    requirement: 'custName',
    value: '',
  },
})

const [registerSavePage, { openModal: openSavePage }] = useModal();
// 这是示例组件
const [registerTable, { getSelectRows,getDataSource,setTableData,setPagination }] = useTable({
  columns: columns,
  bordered: true,
  pagination:{ pageSize: 50,showSizeChanger: true, pageSizeOptions: ['50','100'],showTotal: t => `总共${t}条数据` },
  searchInfo: pageParameter
});
const [register, { closeModal }] = useModalInner( async (data) => {
  selectedRowKeys.value=[]
  selectedRowData.value=[]
  database.value=data.database
  accId.value=data.accId
  multipleFlag.value=false
  fetch()
});

function onSelectChange(a,b) {
  if(a.length>0){
    selectedRowKeys.value=a
    selectedRowData.value=b
  }
}

async function fetch() {
  const deptTree = await useRouteApi(GetCustomerClassTree,{schemaName: database})('')
  function a(customerTree) {
    customerTree.forEach((item) => {
      if (item.children != null) {
        a(item.children);
      }
      item.title = setString('[' + item.cusClass + '] ' + item.cusCclassName,20);
      item.key = item.uniqueCustclass;
    });
  }
  a(deptTree);
  treeData.value = []
  treeData.value.push({title: '全部',key:'0',children: deptTree})
  selectedKeys2.value=['0']
  expandedKeys.value=['0']
  setTimeout(()=>{
    findByCusAuthData()
  },200)
}
async function findByCusClass() {
  treeData.value=[]
  // 是否设置权限控制
  let temp=await getCusTypeSeeSwitch({accId:database.value,dataBaseName:"supplier_class"})
  if(temp!==''){
    let cusClassAuthorData=await getCusClassAuthorData({tableName:'supplier_class',userId:useUserStoreWidthOut().getUserInfo.id,accId:database.value})
    if(cusClassAuthorData.length==1){
      treeData.value.push({title: '['+cusClassAuthorData[0].cusClass+']'+cusClassAuthorData[0].cusCclassName,key:cusClassAuthorData[0].uniqueCustclass,children: []})
      selectedKeys2.value=[cusClassAuthorData[0].uniqueCustclass]
      expandedKeys.value=[cusClassAuthorData[0].uniqueCustclass]

      pageParameter.uniqueCustclass=cusClassAuthorData[0].uniqueCustclass
      setTimeout(()=>{
        findByCusAuthData()
      },200)

    }else if(cusClassAuthorData.length>1){
      let deptTree=await getCusClassAuthorData({tableName:'supplier_class',userId:useUserStoreWidthOut().getUserInfo.id,accId:database.value})
      function a(customerTree) {
        customerTree.forEach((item) => {
          if (item.children != null) {
            a(item.children);
          }
          item.title = setString('[' + item.cusClass + '] ' + item.cusCclassName,20);
          item.key = item.uniqueCustclass;
        });
      }
      a(deptTree);
      treeData.value = []
      treeData.value.push({title: '全部',key:'0',children: deptTree})
      selectedKeys2.value=['0']
      expandedKeys.value=['0']
      setTimeout(()=>{
        findByCusAuthData()
      },200)
    }
  }else{
    fetch()
  }
}

async function findByCusAuthData() {
  pageParameter.uniqueCustclass=selectedKeys2.value[0]
  let temp=await useRouteApi(findAllSupClass,{schemaName: database})(pageParameter)
  if(pageParameter.uniqueCustclass!=='0'){
    temp=temp.filter(a=>(a.uniqueCustclass==pageParameter.uniqueCustclass || a.parentId==pageParameter.uniqueCustclass)&&a.cusBend=='1')
    setTableData(temp)
    setPagination({total: temp.length})
  }else{
    setTableData(temp.filter(a=>a.cusBend=='1'))
    setPagination({total: temp.filter(a=>a.cusBend=='1').length})
  }
}

// 选中分类
function handleSelect(obj) {
  if(obj.toString()!==''){
    pageParameter.uniqueCustclass=obj.toString()
  }else{
    pageParameter.uniqueCustclass='0'
    selectedKeys2.value='0'
  }
  findByCusAuthData();
}
async function handleOk() {
  if(selectedRowData.value.length==0){
    return createWarningModal({content: '请选择数据！'})
  }
  emit('throwData', selectedRowData.value);
  closeModal();
}
function rowDbClick(data) {
  selectedRowData.value=[data]
  handleOk()
}
const val = {
  id: '',
  uniqueCode: '',
  custName: '',
  uniqueCustclass: '',
  custCode: '',
  custAbbname: '',
  custSregcode: '',
  manageType: '',
  uniqueCodeCcus: '',
  uniqueCodeSupplier: '',
  address1: '',
  contacts: '',
  address2: '',
  telephone: '',
  countryName: '',
  cellPhoneNum: '',
  website: '',
  email: '',
  industryclassName: '',
  successState: '',
};
async function openAddPage() {
  let temp=await findAllByAccCountPartColumn(accId.value)
  openSavePage(true, {
    data: val,
    type: 'add',
    defaultPage:temp.independent=='1'?true:false, // 是否独立账套
    database:database.value,
    isEdit:true
  });
}
async function saveData(data) {
  await useRouteApi(customerAddApi, { schemaName: database })(data);
  findByCusAuthData()
  if (data.closeflag === 'add') {
    openAddPage()
  }
}

async function dulisaveData(data) {
  await useRouteApi(duLiSaveApi, { schemaName: database })(data);
  findByCusAuthData()
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
