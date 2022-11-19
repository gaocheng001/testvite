<template>
  <BasicModal
    width="900px"
    v-bind="$attrs"
    title="选择人员"
    @ok="handleOk()"
    wrapClassName="head-title-psn"
    @register="register"
    okText="确定"
  >
    <template #title>
      <div style="display: flex;height:30px;" class="vben-basic-title">
        <span style="font-size: 24px;line-height:30px;">
          <SearchOutlined style="font-size: 28px;font-weight: bold"/>&nbsp;&nbsp;选择人员
        </span>
      </div>
    </template>
    <div class="nc-open-content" style="margin:0;padding:0;">
      <div class="open-content-up" style="margin:0;padding:0;">
        <div style="background:#0096c7;padding:10px;border-radius: 2px;margin-bottom:10px;display: flex;justify-content : space-between;">
          <div class="a1">
            <a-select v-model:value="formItems.selectType" style="width: 120px;font-size: 12px;" class="special_select">
              <a-select-option style="font-size: 12px;" value="psnCode">人员编码</a-select-option>
              <a-select-option style="font-size: 12px;" value="psnName">人员名称</a-select-option>
            </a-select>
            <a-input-search
              placeholder=""
              style="width: 200px; border-radius: 4px"
              v-model:value="formItems.selectValue"
              @search="onSearch"
            />
          </div>
          <div class="a2">
            <a-button
              class="ant-btn ant-btn-me"
              @click="openAddPage()"
            ><span>新增</span></a-button>
            <a-button
              class="ant-btn ant-btn-me"
            ><span>刷新</span></a-button>
          </div>
        </div>

        <div style="height: 350px;padding:0;display: flex;justify-content : space-between;">
<!--          <div class="bg-white">
            <div style="width: 100%;height: 35px; background:#cccccc;text-align: center;font-weight: bold;margin-bottom: 2px;">
              <label style="font-size: 14px;color:#000000;width: 100%;text-align: center;">树形选择</label>
            </div>
            <BasicTree
              title=""
              :click-row-to-expand="false"
              :tree-data="treeData"
              :replace-fields="{ key: 'uniqueCode', title: 'value' }"
              v-model:selectedKeys="selectedKeys"
              v-model:expandedKeys="expandedKeys"
              @select="handleSelect"
            />
          </div>-->
          <div style="width: 250px;">
            <a-tabs type="card" size="small" class="bg-white" :tabBarGutter="0" v-model:activeKey="activeKey">
              <a-tab-pane key="1" tab="按部门显示" :style="activeKey=='1'?{height: '350px'}:{}">
                <div style="margin-top: -10px;overflow:auto;max-height: 350px;">
                <BasicTree
                  title=""
                  :click-row-to-expand="false"
                  :tree-data="treeData"
                  :replace-fields="{ key: 'uniqueCode', title: 'value' }"
                  v-model:selectedKeys="selectedKeys"
                  v-model:expandedKeys="expandedKeys"
                  @select="handleSelect"
                />
                </div>
              </a-tab-pane>
              <a-tab-pane key="2" tab="按人员类别显示" :style="activeKey=='2'?{height: '350px'}:{}">
                <div style="margin-top: -10px;overflow:auto;max-height: 350px;">
                <BasicTree
                  title=""
                  :click-row-to-expand="false"
                  :tree-data="psnTypeTreeData"
                  :replace-fields="{ key: 'uniqueCode', title: 'value' }"
                  v-model:selectedKeys="psnTypeSelectedKeys"
                  v-model:expandedKeys="psnTypeExpandedKeys"
                  @select="psnTypeHandleSelect"
                />
                </div>
              </a-tab-pane>
            </a-tabs>
          </div>
          <div style="width: calc(100% - 260px); float: right;margin-left: 5px;height: 350px;">
            <BasicTable
              :row-selection="{ type: 'radio', selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
              @row-click="condClick"
              @row-dbClick="handleOk"
              :scroll="{ y: 350 }"
              @register="registerTable"
              :dataSource="tableData"
              class="tables"
            >
              <template #psnSex="{ record }"> {{ formatPsnSex(record.psnSex) }}</template>
              <template #psnType="{ record }"> {{ formatPsnType(record.psnType) }}</template>
            </BasicTable>
          </div>
        </div>
      </div>
    </div>

    <Add
      @save="saveData"
      @register="registerEditPage"
    />

  </BasicModal>
</template>

<script setup="props, {content}" lang="ts">
import { PageWrapper } from '/@/components/Page'
import {nextTick, onMounted, reactive, ref, unref} from 'vue'
import {BasicModal, useModal, useModalInner} from '/@/components/Modal'
import {
  SearchOutlined
} from '@ant-design/icons-vue'
import {Select as ASelect, Input as AInput, Checkbox as ACheckbox,Button as AButton,Tabs as ATabs} from 'ant-design-vue'

const AInputSearch = AInput.Search
const ASelectOption = ASelect.Option
const ATabPane = ATabs.TabPane
import {useMessage} from "/@/hooks/web/useMessage";
import {BasicTable, useTable} from "/@/components/Table";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {GetDeptTreeByFlag} from "/@/api/sys/dept";
import {psnFindByFlag} from "/@/api/psn/psn";

const {
  createErrorModal
} = useMessage()

const emit = defineEmits(['register', 'save'])

const formItems: any = ref({
  selectType: 'psnCode',
  selectValue: ''
})
const activeKey = ref('1')
const accountList: any = ref([])
const dynamicTenantId = ref('')
const tableData:any = ref([]);
const tableDataAll:any = ref([]);
const [register, {closeModal,setModalProps}] = useModalInner(async(data) => {
  dynamicTenantId.value = data.dynamicTenantId
  await fetch()
  await fetchPsnType()
  await reloadPsn()
  state.selectedRowKeys = []
  checkRow.value = []
})

const columns = [
  {
    title: '人员编码',
    dataIndex: 'psnCode',
    ellipsis: true,
    width: 100
  },
  {
    title: '人员名称',
    dataIndex: 'psnName',
    align: 'left',
    ellipsis: true,
  },
  {
    title: '性别',
    dataIndex: 'psnSex',
    width: 100,
    ellipsis: true,
    slots: {customRender: 'psnSex'}
  },
  {
    title: '人员属性',
    dataIndex: 'psnType',
    ellipsis: true,
    width: 100,
    slots: {customRender: 'psnType'}
  },
]

function formatPsnSex(sex: String) {
  let str = '男'
  switch (sex) {
    case '0':
      str = '未知的性别'
      break
    case '1':
      str = '男'
      break
    case '2':
      str = '女'
      break
    case '9':
      str = '未说明的性别'
  }
  return str
}

function formatPsnType(type: any) {
  let str = '内部人员'
  switch (type) {
    case '1':
      str = '内部人员'
      break
    case '2':
      str = '外部人员'
      break
  }
  return str
}

// 这是示例组件
const [registerTable, {reload,setPagination}] = useTable({
  columns: columns,
  bordered: true,
  showIndexColumn: false,
  searchInfo: {
    accId: '',
    flag: '0',
  }
})

const psnList:any = ref([])
const thisCheckKey:any = ref('')
async function reloadPsn(){
  const res:any = await useRouteApi(psnFindByFlag,{schemaName: dynamicTenantId})({})
  psnList.value = res
  // console.log(thisCheckKey.value)
  if (activeKey.value=='1') {
    tableDataAll.value = psnList.value.filter(item => {
      if (thisCheckKey.value != null && thisCheckKey.value != '0' && thisCheckKey.value != '' && thisCheckKey.value != 'undefined') {
        return thisCheckKey.value.indexOf(item.uniqueCodeDept) != -1
      }
      return item
    })
  } else {
    tableDataAll.value = psnList.value.filter(item => {
      if (thisCheckKey.value != null && thisCheckKey.value != '0' && thisCheckKey.value != '' && thisCheckKey.value != 'undefined') {
        return thisCheckKey.value.indexOf(item.uniquePsnType) != -1
      }
      return item
    })
  }
  tableData.value = tableDataAll.value
  await setPagination({
    total: tableData.value.length
  })
}

onMounted(async () => {
})

const condClick = () => {

}

//选中内容
const state = reactive<{
  selectedRowKeys: [];
  loading: boolean;
}>({
  selectedRowKeys: [], // Check here to configure the default column
  loading: false,
});
const checkRow: any = ref([])
const onSelectChange = (selectedRowKeys, row) => {
  // console.log('selectedRowKeys changed: ', row);
  if(selectedRowKeys.length>0){
    state.selectedRowKeys = selectedRowKeys;
    checkRow.value = row
  }
};

async function handleOk() {
  if (checkRow.value.length > 0) {
    emit('save', unref(checkRow.value[0]))
    closeModal()
    return true
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '引用',
      content: '请选择人员！'
    })
    return false
  }
}

async function onSearch(){
  tableData.value = tableDataAll.value.filter(item => {
    //通过人员编码过滤
    if (formItems.value.selectType == 'psnCode' && formItems.value.selectValue != '') {
      return item.deptCode.indexOf(formItems.value.selectValue) != -1
    }
    //通过人员名称过滤
    if (formItems.value.selectType == 'psnName' && formItems.value.selectValue != '') {
      return item.psnName.indexOf(formItems.value.selectValue) != -1
    }
    return item
  })
  await setPagination({
    total: tableData.value.length
  })
}

import { BasicTree } from '/@/components/Tree'
import {psnTypeFindAll} from "/@/api/psn-type/psn-type";
const treeData:any = ref([])
const selectedKeys = ref<string[]>([])
const expandedKeys = ref<string[]>([])
async function fetch() {
  let deptTree = await useRouteApi(GetDeptTreeByFlag,{schemaName: dynamicTenantId})({})
  function a(deptTree:any) {
    deptTree.forEach((item: any)  => {
      if (item.children != null) {
        a(item.children)
      }
      item.value = '[' + item.deptCode + ']  ' + item.deptName
    })
  }
  function b(deptTree:any) {
    let arr:any = []
    arr.push(deptTree[0].uniqueCode)
    return  arr
  }
  a(deptTree)
  // treeData.value = deptTree
  treeData.value = []
  treeData.value.push({id:'0',key:'',uniqueCode:'0',value: '全部',children: deptTree})
  // let checks = b(deptTree)
  let checks = b(treeData.value)
  selectedKeys.value = checks
  expandedKeys.value = checks
}

function handleSelect(keys: string, e:any) {
  let keyStr = keys[0]+',';
  if (null != e.selectedNodes && e.selectedNodes.length > 0
    && null != e.selectedNodes[0].children &&  e.selectedNodes[0].children.length > 0){
    keyStr = getThisNodeStr(e.selectedNodes[0].children,keyStr)
  }
  thisCheckKey.value = keyStr.substring(0,keyStr.length-1)
  selectTree()
}

async function selectTree() {
  if (activeKey.value=='1') {
    tableDataAll.value = psnList.value.filter(item => {
      if (thisCheckKey.value != null && thisCheckKey.value != '0' && thisCheckKey.value != '' && thisCheckKey.value != 'undefined') {
        return thisCheckKey.value.indexOf(item.uniqueCodeDept) != -1
      }
      return item
    })
  } else {
    tableDataAll.value = psnList.value.filter(item => {
      if (thisCheckKey.value != null && thisCheckKey.value != '0' && thisCheckKey.value != '' && thisCheckKey.value != 'undefined') {
        return thisCheckKey.value.indexOf(item.uniquePsnType) != -1
      }
      return item
    })
  }
  tableData.value = tableDataAll.value
  await setPagination({
    total: tableData.value.length
  })
}

function getThisNodeStr(list,str) {
  for (const nods of list) {
    str+=(nods.uniqueCode+',')
    if (null != nods.children && nods.children.length > 0){
      str = getThisNodeStr(nods.children,str)
    }
  }
  return str
}

const psnTypeTreeData:any = ref([])
const psnTypeSelectedKeys = ref<string[]>([])
const psnTypeExpandedKeys = ref<string[]>([])
async function fetchPsnType() {
  let res = await useRouteApi(psnTypeFindAll,{schemaName: dynamicTenantId})({})
  let deptTree = res.items

  function a(deptTree:any) {
    deptTree.forEach((item: any) => {
      item.value = '[' + item.psnTypeCode + ']  ' + item.psnTypeName
    })
  }

  function b(deptTree: any) {
    let arr: any = []
    arr.push(deptTree[0].uniqueCode)
    return arr
  }

  a(deptTree)
  psnTypeTreeData.value = []
  psnTypeTreeData.value.push({id: '0', key: '0', uniqueCode: '0', value: '全部', children: deptTree})
  // treeData.value = deptTree
  // let checks = b(deptTree)
  let checks = b(psnTypeTreeData.value)
  psnTypeSelectedKeys.value = checks
  psnTypeExpandedKeys.value = checks
}

function psnTypeHandleSelect(keys: string, e:any) {
  let keyStr = keys[0]+',';
  if (null != e.selectedNodes && e.selectedNodes.length > 0
    && null != e.selectedNodes[0].children &&  e.selectedNodes[0].children.length > 0){
    keyStr = getThisNodeStr(e.selectedNodes[0].children,keyStr)
  }
  thisCheckKey.value = keyStr.substring(0,keyStr.length-1)
  selectTree()
}

import Add from './add.vue'
import {savePsn} from "/@/api/record/system/psn";
const val = {
  id: null,
  uniqueCode: '',
  psnName: '',
  psnSex: '0',
  psnType: '1',
  psnCode: '',
  uniqueCodeDept: '',
  jobNum: '',
  psnPost: '',
  uniquePsnType: '',
  cellPhoneNum: '',
  countryId: '',
  psnEmail: '',
  psnAddress: '',
  province: '',
  city: '',
  district: '',
  psnQq: '',
  psnWechat: '',
  documentType: '',
  documentCode: '',
  psnStation: '',
  entryDate: null,
  psnBank: '',
  bankArea: '',
  bankAccount: '',
  bankNum: '',
  flag: '1'
}

const [registerEditPage, { openModal: openEditPage }] = useModal()
const openAddPage = () => {
  openEditPage(true, {
    data: val,
    dynamicTenantId: dynamicTenantId.value,
    isState: '0'
  })
}

async function saveData(data:any) {
  await useRouteApi(savePsn,{schemaName: dynamicTenantId})(data)
  await reloadPsn()
}

</script>
<style scoped lang="less">
.ant-modal-header{
  border: none !important;
}
.vben-basic-title {
  color: #0096c7 !important;
  border: none !important;
  margin-bottom: -20px !important;
}

:global(.ant-modal-body) {
  padding: 0px;
  border-bottom: 1px solid rgb(1, 129, 226);
  border-left: none;
  border-right: none;
  margin-bottom: 0!important;
  .scrollbar{
    padding: 0px;
    .scroll-container{
      margin-bottom: 0!important;
    }
  }
}

.nc-open-content {
  input:not(.ant-select-selection-search-input,.ant-input){
    width: 50%;
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
  }

  .ant-input:focus {
    box-shadow: none;
  }

  .ant-select-selector {
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
  }

  label {
    text-align: left;
    width: 110px;
    display: inline-block;
    padding-top: 5px;
    padding-bottom: 5px;
    color: #535353;
  }
}

.search input {
  width: 100%;
  border: none !important;
}

.tables :deep(td),
.tables :deep(th) {
  font-size: 14px !important;
  padding: 2px 8px !important;
}

.tables :deep(th) {
  text-align: center !important;
  font-weight: bold;
  background-color: #cccccc;
  line-height:30px;
}

.bg-white{
  width: 250px !important;
  min-height: 385px !important;
  height: calc(100%);
  border: 1px #cccccc solid;
  background:white !important;
}

:deep(.ant-table-row-selected) td{
  background: #0096c7 !important;
}

:deep(.ant-tree-list){
  margin: 0 !important;
  padding: 0 !important;
  margin-left: -10px !important;
  min-height: 250px !important;
  height: calc(100%);
}

:deep(.ant-tabs-card).ant-tabs-top > .ant-tabs-nav  {
  height: 40px;
  font-weight: bold;
  font-size: 12px;
  .ant-tabs-tab-active,.ant-tabs-card.ant-tabs-top > div > .ant-tabs-nav .ant-tabs-tab-active {
    border-top: 2px solid rgb(1, 143, 251) !important;
  }
}

</style>
<style>
.head-title-psn .scroll-container .scrollbar__wrap {
  margin-bottom: 0px !important;
}

</style>
