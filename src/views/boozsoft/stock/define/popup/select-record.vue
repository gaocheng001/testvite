<template>
  <BasicModal
    width="900px"
    v-bind="$attrs"
    title="选择自定义档案"
    @ok="handleOk()"
    wrapClassName="head-title-psn"
    @register="register"
    okText="确定"
  >
    <template #title>
      <div style="display: flex;height:30px;" class="vben-basic-title">
        <span style="font-size: 24px;line-height:30px;">
          <SearchOutlined style="font-size: 28px;font-weight: bold"/>&nbsp;&nbsp;选择自定义档案
        </span>
      </div>
    </template>
    <div class="nc-open-content" style="margin:0;padding:0;">
      <div class="open-content-up" style="margin:0;padding:0;">
        <div style="background:#0096c7;padding:10px;border-radius: 2px;margin-bottom:10px;display: flex;justify-content : space-between;">
          <div class="a1">
            <a-select v-model:value="formItems.selectType" style="width: 120px;font-size: 12px;" class="special_select">
              <a-select-option style="font-size: 12px;" value="ccode">档案编码</a-select-option>
              <a-select-option style="font-size: 12px;" value="cname">档案名称</a-select-option>
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

    <Edit
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
import {findAllStockDefineBodyList, saveStockDefineBody} from "/@/api/record/system/stock-define-body";

const {
  createErrorModal
} = useMessage()

const emit = defineEmits(['register', 'save'])

const formItems: any = ref({
  selectType: 'cname',
  selectValue: ''
})
const activeKey = ref('1')
const accountList: any = ref([])
const dynamicTenantId = ref('')
const tableData:any = ref([]);
const tableDataAll:any = ref([]);
const defineCode:any = ref([])
const [register, {closeModal,setModalProps}] = useModalInner(async(data) => {
  dynamicTenantId.value = data.dynamicTenantId
  defineCode.value = data.defineCode
  await reloadRecord()
  state.selectedRowKeys = []
  checkRow.value = []
})

const columns = [
  {
    title: '档案编码',
    dataIndex: 'ccode',
    ellipsis: true,
    width: 150
  },
  {
    title: '档案名称',
    dataIndex: 'cname',
    align: 'left',
    ellipsis: true,
  },
]

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

const recordList:any = ref([])
const thisCheckKey:any = ref('')
async function reloadRecord(){
  const res:any = await useRouteApi(findAllStockDefineBodyList,{schemaName: dynamicTenantId})(defineCode.value)
  recordList.value = res
  // console.log(thisCheckKey.value)
  tableDataAll.value = recordList.value
  tableData.value = tableDataAll.value
  await setPagination({
    total: tableData.value.length
  })
}

const definedfile:any = ref({})
async function reloadFile() {
  const res = await useRouteApi(findFileByCode, {schemaName: dynamicTenantId})(defineCode.value)
  definedfile.value = res[0]
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
      content: '请选择自定义档案！'
    })
    return false
  }
}

async function onSearch(){
  tableData.value = tableDataAll.value.filter(item => {
    //通过编码过滤
    if (formItems.value.selectType == 'ccode' && formItems.value.selectValue != '') {
      return item.ccode.indexOf(formItems.value.selectValue) != -1
    }
    //通过名称过滤
    if (formItems.value.selectType == 'cname' && formItems.value.selectValue != '') {
      return item.cname.indexOf(formItems.value.selectValue) != -1
    }
    return item
  })
  await setPagination({
    total: tableData.value.length
  })
}

import Edit from './edit.vue'
import {findByCode as findFileByCode} from "/@/api/record/system/stock-define-head";
const val = {
  id: null,
  defineCode: '',
  ccode: '',
  cname: null,
  flag: '1',
  remarks: ''
}

const [registerEditPage, { openModal: openEditPage }] = useModal()
const openAddPage = () => {
  if (definedfile.value.shuxing!='5') {
    val.defineCode = defineCode.value
    openEditPage(true, {
      data: val,
      dynamicTenantId: dynamicTenantId.value
    })
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '添加',
      content: '字段类型为“是否”时，系统自动添加档案，不允许手动添加！'
    })
  }
}

async function saveData(data) {
  await useRouteApi(saveStockDefineBody, {schemaName: dynamicTenantId})(data)
  await reloadRecord()
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
