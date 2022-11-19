<template>
    <BasicModal
      width="900px"
      v-bind="$attrs"
      title="选择部门"
      @ok="handleOk()"
      wrapClassName="head-title"
      @register="register"
      okText="确定"
    >
      <template #title>
        <div style="display: flex;height:30px;" class="vben-basic-title">
        <span style="font-size: 24px;line-height:30px;">
          <SearchOutlined style="font-size: 28px;font-weight: bold"/>&nbsp;&nbsp;选择部门
        </span>
        </div>
      </template>
      <div class="nc-open-content" style="margin:0;padding:0;">
        <div class="open-content-up" style="margin:0;padding:0;">
          <div style="background:#0096c7;padding:10px;border-radius: 2px;margin-bottom:10px;display: flex;justify-content : space-between;">
            <div class="a1">
              <a-select v-model:value="formItems.selectType" style="width: 120px;font-size: 12px;" class="special_select">
                <a-select-option style="font-size: 12px;" value="deptCode">部门编码</a-select-option>
                <a-select-option style="font-size: 12px;" value="deptName">部门名称</a-select-option>
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
                @click="openAddPage()"><span>新增</span></a-button>
              <a-button class="ant-btn ant-btn-me"><span>刷新</span></a-button>
            </div>
          </div>

          <div style="height: 350px;padding:0;display: flex;justify-content : space-between;">
            <div class="bg-white">
              <div style="width: 100%;height: 35px; background:#cccccc;text-align: center;font-weight: bold;margin-bottom: 2px;">
                <label style="font-size: 14px;color:#000000;width: 100%;text-align: center;">树形选择</label>
              </div>
              <BasicTree
                title=""
                :click-row-to-expand="false"
                :tree-data="treeData"
                :replace-fields="{ key: 'id', title: 'value' }"
                v-model:selectedKeys="selectedKeys"
                v-model:expandedKeys="expandedKeys"
                @select="handleSelect"
              />
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
              </BasicTable>
            </div>
          </div>
        </div>
      </div>

      <DeptEdit
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
import {Select as ASelect, Input as AInput, Checkbox as ACheckbox,Button as AButton} from 'ant-design-vue'

const AInputSearch = AInput.Search
const ASelectOption = ASelect.Option
import {useMessage} from "/@/hooks/web/useMessage";
import {BasicTable, useTable} from "/@/components/Table";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {findDeptByFlag, getDeptListById, saveDept} from "/@/api/record/system/dept";
import {GetDeptTreeByFlag} from "/@/api/sys/dept";

const {
  createErrorModal
} = useMessage()

const emit = defineEmits(['register', 'save'])

const formItems: any = ref({
  selectType: 'deptCode',
  selectValue: ''
})

const accountList: any = ref([])
const dynamicTenantId = ref('')
const tableData:any = ref([]);
const tableDataAll:any = ref([]);
const [register, {closeModal,setModalProps}] = useModalInner(async(data) => {
  dynamicTenantId.value = data.dynamicTenantId
  await fetch()
  await reloadDept()
  state.selectedRowKeys = []
  checkRow.value = []
})

const columns = [
  {
    title: '部门编码',
    dataIndex: 'deptCode',
    ellipsis: true,
    width: 100
  },
  {
    title: '部门名称',
    dataIndex: 'deptName',
    align: 'left',
    ellipsis: true,
  },
]
// 这是示例组件
const [registerTable, {reload,setPagination}] = useTable({
  columns: columns,
  bordered: true,
  showIndexColumn: false,
  pagination: false,
  searchInfo: {
    accId: '',
    flag: '0',
  }
})

const deptList:any = ref([])
const thisCheckKey:any = ref('')
async function reloadDept(){

  const res:any = await useRouteApi(findDeptByFlag,{schemaName: dynamicTenantId})({})

  deptList.value = res
  // console.log(thisCheckKey.value)
  tableDataAll.value = deptList.value.filter(item=> {
    if (thisCheckKey.value!=null && thisCheckKey.value!='0' && thisCheckKey.value!='' && thisCheckKey.value!='undefined') {
      return thisCheckKey.value.indexOf(item.id)!=-1
    }
    return item
  })

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
      content: '请选择部门！'
    })
    return false
  }
}

async function onSearch(){
  tableData.value = tableDataAll.value.filter(item => {
    //通过部门编码过滤
    if (formItems.value.selectType == 'deptCode' && formItems.value.selectValue != '') {
      return item.deptCode.indexOf(formItems.value.selectValue) != -1
    }
    //通过部门名称过滤
    if (formItems.value.selectType == 'deptName' && formItems.value.selectValue != '') {
      return item.deptName.indexOf(formItems.value.selectValue) != -1
    }
    return item
  })
  await setPagination({
    total: tableData.value.length
  })
}

import { BasicTree } from '/@/components/Tree'
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
    arr.push(deptTree[0].id)
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
  tableDataAll.value = deptList.value.filter(item => {
    if (thisCheckKey.value != null && thisCheckKey.value != '0' && thisCheckKey.value != '' && thisCheckKey.value != 'undefined') {
      return thisCheckKey.value.indexOf(item.id) != -1
    }
    return item
  })
  tableData.value = tableDataAll.value
  await setPagination({
    total: tableData.value.length
  })
}

function getThisNodeStr(list,str) {
  for (const nods of list) {
    str+=(nods.id+',')
    if (null != nods.children && nods.children.length > 0){
      str = getThisNodeStr(nods.children,str)
    }
  }
  return str
}

import DeptEdit from './deptAdd.vue'
const val = {
  id: null,
  uniqueCode: '',
  deptCode: '',
  deptName: '',
  parentId: '',
  uniqueCodeUser: ''
}

const [registerEditPage, { openModal: openEditPage }] = useModal()
const openAddPage = () => {
  openEditPage(true, {
    data: val,
    dynamicTenantId: dynamicTenantId.value
  })
}

async function saveData(data:any) {
  await useRouteApi(saveDept,{schemaName: dynamicTenantId})(data)
  await fetch()
  await reloadDept()
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
}



</style>
<style>
.head-title .scroll-container .scrollbar__wrap {
  margin-bottom: -45px !important;
}

</style>
