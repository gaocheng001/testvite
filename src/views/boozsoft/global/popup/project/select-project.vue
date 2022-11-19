<template>
    <BasicModal
      width="900px"
      v-bind="$attrs"
      title="选择项目"
      @ok="handleOk()"
      wrapClassName="head-title"
      @register="register"
      okText="确定"
    >
      <template #title>
        <div style="display: flex;height:30px;" class="vben-basic-title">
        <span style="font-size: 24px;line-height:30px;">
          <SearchOutlined style="font-size: 28px;font-weight: bold"/>&nbsp;&nbsp;选择项目
        </span>
        </div>
      </template>
      <div class="nc-open-content" style="margin:0;padding:0;">
        <div class="open-content-up" style="margin:0;padding:0;">
          <div style="background:#0096c7;padding:10px;border-radius: 2px;margin-bottom:10px;display: flex;justify-content : space-between;">
            <div class="a1" style="color: #ffffff;font-weight: bold;">
              <span v-if="projectClassCtl=='1'">
                项目大类：<a-select v-model:value="itemCode" @change="changCate()" placeholder="请选择项目大类" style="min-width: 200px;">
                  <a-select-option v-for="item in itemList" :key="item.itemCode" :value="item.itemCode">
                    ({{ item.itemCode }}){{ item.itemName }}
                  </a-select-option>
                </a-select>
              </span>
              <span v-if="projectClassCtl!='1'">
                项目栏目样式：
                <a-select v-model:value="cateCode" @change="changCate()" placeholder="请选择项目样式" style="min-width: 200px;">
                  <a-select-option v-for="cate in cateList" :key="cate.projectCateCode" :value="cate.projectCateCode">
                    ({{ cate.projectCateCode }}){{ cate.projectCateName }}
                  </a-select-option>
                </a-select>
              </span>
              &emsp;
              <a-select v-model:value="formItems.selectType" style="width: 120px;font-size: 12px;" class="special_select">
                <a-select-option style="font-size: 12px;" value="projectCode">项目编码</a-select-option>
                <a-select-option style="font-size: 12px;" value="projectName">项目名称</a-select-option>
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
            <div class="bg-white">
              <div style="width: 100%;height: 35px; background:#cccccc;text-align: center;font-weight: bold;margin-bottom: 2px;">
                <label style="font-size: 14px;color:#000000;width: 100%;text-align: center;">项目分类</label>
              </div>
              <BasicTree
                title=""
                :click-row-to-expand="false"
                :tree-data="treeData"
                :replace-fields="{ key: 'projectClassCode', title: 'value' }"
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
import {Select as ASelect, Input as AInput, Checkbox as ACheckbox,Button as AButton} from 'ant-design-vue'

const AInputSearch = AInput.Search
const ASelectOption = ASelect.Option
import {useMessage} from "/@/hooks/web/useMessage";
import {BasicTable, useTable} from "/@/components/Table";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {getProjectItemList} from "/@/api/record/system/project-item";
import {cateFindStateFlag} from "/@/api/project_category/project_category";
import {findProClassTree} from "/@/api/record/system/project_class";
import {findProjectByCateCode, saveProject} from "/@/api/record/system/project";

const {
  createErrorModal,
  createWarningModal
} = useMessage()

const emit = defineEmits(['register', 'save'])

const formItems: any = ref({
  selectType: 'projectCode',
  selectValue: ''
})
const accountList: any = ref([])
const dynamicTenantId = ref('')
const tableData:any = ref([]);
const tableDataAll:any = ref([]);
const projectClassCtl:any = ref([])
const cateList:any = ref([])
const itemList:any = ref([])
const cateCode:any = ref('')
const itemCode:any = ref('')
const [register, {closeModal,setModalProps}] = useModalInner(async(data) => {
  dynamicTenantId.value = data.dynamicTenantId
  projectClassCtl.value = data.projectClassCtl
  const cate = await useRouteApi(cateFindStateFlag, {schemaName: dynamicTenantId})({})
  cateList.value = cate
  if (cateList.value==null || cateList.value.length==0){
    createWarningModal({title: '温馨提示', content: '暂无项目样式，请先添加项目样式！'});
    return false
  } else {
    cateCode.value = cateList.value[0].projectCateCode
  }
  if (projectClassCtl.value=='1'){
    const res: any = await useRouteApi(getProjectItemList,{schemaName: dynamicTenantId})({})
    itemList.value = res
    if (itemList.value==null || itemList.value.length==0){
      createWarningModal({title: '温馨提示', content: '暂无项目大类信息，请先添加项目大类档案！'});
      return false
    } else {
      itemCode.value = itemList.value[0].itemCode
      cateCode.value = itemList.value[0].cateCode
    }
  }
  await changCate()
  // await reloadProject()
  state.selectedRowKeys = []
  checkRow.value = []
})

async function changCate() {
  if (projectClassCtl.value=='1'){
    itemList.value.forEach(item=>{
      if (item.itemCode==itemCode.value){
        cateCode.value = item.cateCode
      }
    })
  }
  await fetch()
  await reloadProject()
}

const columns = [
  {
    title: '项目编码',
    dataIndex: 'projectCode',
    ellipsis: true,
    width: 100
  },
  {
    title: '项目名称',
    dataIndex: 'projectName',
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

const projectList:any = ref([])
const thisCheckKey:any = ref('')
async function reloadProject(){
  // const res:any = await useRouteApi(findDeptByFlag,{schemaName: dynamicTenantId})({})
  const res:any = await useRouteApi(findProjectByCateCode,{schemaName: dynamicTenantId})({
    projectCateCode:cateCode.value,
    itemCode:itemCode.value,
    projectClassCtl:projectClassCtl.value
  })
  projectList.value = res
  // console.log(thisCheckKey.value)
  tableDataAll.value = projectList.value.filter(item=> {
    if (thisCheckKey.value!=null && thisCheckKey.value!='0' && thisCheckKey.value!='' && thisCheckKey.value!='undefined') {
      return thisCheckKey.value.indexOf(item.projectClassCode)!=-1
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
      content: '请选择项目！'
    })
    return false
  }
}

async function onSearch(){
  tableData.value = tableDataAll.value.filter(item => {
    //通过部门编码过滤
    if (formItems.value.selectType == 'projectCode' && formItems.value.selectValue != '') {
      return item.projectCode.indexOf(formItems.value.selectValue) != -1
    }
    //通过部门名称过滤
    if (formItems.value.selectType == 'projectName' && formItems.value.selectValue != '') {
      return item.projectName.indexOf(formItems.value.selectValue) != -1
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
  const classTree = await useRouteApi(findProClassTree, {schemaName: dynamicTenantId})({projectCateCode:itemCode.value,projectClassCtl:projectClassCtl.value})

  function proClassTree(classTree: any) {
    classTree.forEach(
      (item: any) => {
        if (item.children != null) {
          proClassTree(item.children)
        }
        item.id = item.projectClassCode
        item.value = '(' + item.projectClassCode + ')' + item.projectClassName
      })
  }

  function b(classTree: any) {
    let arr: any = []
    arr.push(classTree[0].projectClassCode)
    return arr
  }

  proClassTree(classTree)
  // treeData.value = classTree
  treeData.value = []
  treeData.value.push({
    id: '0',
    key: '0',
    uniqueCode: '0',
    projectClassCode: '0',
    value: '全部',
    children: classTree
  })
  // let checks = b(classTree)
  let checks = b(treeData.value)
  selectedKeys.value = checks
  expandedKeys.value = checks
}

function handleSelect(keys: string, e:any) {
  thisCheckKey.value = keys[0]
  selectTree()
}

async function selectTree() {
  tableDataAll.value = projectList.value.filter(item => {
    if (thisCheckKey.value != null && thisCheckKey.value != '0' && thisCheckKey.value != '' && thisCheckKey.value != 'undefined') {
      return item.projectClassCode==thisCheckKey.value
    }
    return item
  })
  tableData.value = tableDataAll.value
  await setPagination({
    total: tableData.value.length
  })
}

import Add from './add.vue'
const val = {
  id: null,
  uniqueCode: '',
  projectCode: '',
  projectName: '',
  projectCateCode: '',
  projectClassCode: '',
  jiesuan: '0',
  startDate: null,
  endDate: null,
  psnInCharge: '',
  deptCode: '',
  isEdit: true,
  projectClassCtl: '',
  itemCode: '',
  isState: '0'
}

const [registerEditPage, { openModal: openEditPage }] = useModal()
const openAddPage = () => {
  if (projectClassCtl.value=='1'){
    if (itemList.value==null || itemList.value.length==0){
      createWarningModal({
        iconType: 'warning',
        title: '提示',
        content: '暂无项目大类信息，请先添加项目大类档案！'
      })
      return false
    }
  }
  if (cateList.value.length > 0) {
    val.projectCateCode = cateCode.value
    val.projectClassCode = thisCheckKey.value
    val.projectClassCtl = projectClassCtl.value
    val.itemCode = itemCode.value
    val.isState = '0'
    openEditPage(true, {
      data: val
    })
  } else {
    createWarningModal({
      iconType: 'warning',
      title: '提示',
      content: '暂无项目栏目样式信息，请先添加项目栏目样式档案！'
    })
  }
}

async function saveData(data:any) {
  await useRouteApi(saveProject,{schemaName: dynamicTenantId})(data)
  await reloadProject()
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
