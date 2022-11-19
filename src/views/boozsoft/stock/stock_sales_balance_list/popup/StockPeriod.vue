<template>
  <BasicModal
    width="700px"
    ::minHeight="400"
    :height="400"
    v-bind="$attrs"
    :cancel-text="'关闭'"
    :canFullscreen="false"
    :show-ok-btn="false"
    @register="register"
  >
    <template #title>
      <div style="display: flex;" class="vben-basic-title">
        <span style="line-height: 25px;font-size: 20px;">
          <ScheduleOutlined style="width:25px;    margin-right: 20px;font-size: 38px;"/>
          <span style="vertical-align: super;">业务期间</span>
        </span>
      </div>
    </template>
    <div
      style="background-color: #158eb8;height: 50px;padding-top: 10px;padding-left:10px;border-radius: 5px;">
      <div style="display: inline-block;">
        <AccountPicker theme="three" @reloadTable="dynamicAdReload"/>
      </div>
      <div style="float: right;margin-right: 5px;">
        <button type="button" class="ant-btn ant-btn-me"><span style="font-weight: bold;"
                                                               @click="exec('add')">新增</span>
        </button>
        <button type="button" class="ant-btn ant-btn-me"><span style="font-weight: bold;"
                                                               @click="exec('start')">启用</span>
        </button>
        <button type="button" class="ant-btn ant-btn-me"><span style="font-weight: bold;"
                                                               @click="exec('del')">删除</span>
        </button>
        <!--        <button type="button" class="ant-btn ant-btn-me"><span style="font-weight: bold;">退出</span></button>-->
      </div>
    </div>
    <div class="bg-white" style="display: inline;width: 30%;float: left;margin-top: 5px;">
      <div style="width: 100%; height: 26px;text-align: center;background-color: rgb(216 216 216);">
        <label style="font-size: 14px;font-weight: bold;">业务年度</label>
      </div>
      <BasicTree
        defaultExpandAll
        :click-row-to-expand="false"
        :tree-data="treeData"
        :replace-fields="{ key: 'key', title: 'title' }"
        :loading="loading"
        v-model:selectedKeys="selectedKeys"
        v-model:expandedKeys="expandedKeys"
        @select="handleSelect"
      />
    </div>
    <div style="display: inline;width: 69.5%;float: right;margin-top: 5px;">
      <BasicTable @register="registerTable" :scroll="{ y: 400 }" :class="'a-table-font-size-12'"
                  :row-selection="{ type: 'radio',selectedRowKeys: selectedRowKeys, onChange: onSelectChange}">
        <template #stockYear="{ record }">
          {{ record.stockYear + '.' + record.stockMonth }}
        </template>
        <template #stockFlag="{ record }">
          <Tag :color="'green'" v-if="record.stockFlag == '1'">启用</Tag>
        </template>
      </BasicTable>
    </div>
  </BasicModal>
</template>
<script setup="props, { content }" lang="ts">
import {BasicTable, useTable} from '/@/components/Table';
import {BasicTree} from '/@/components/Tree';
import {ScheduleOutlined} from '@ant-design/icons-vue';
import {reactive, ref} from 'vue';
import {BasicModal, useModal, useModalInner} from '/@/components/Modal';
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {useMessage} from "/@/hooks/web/useMessage";
import {
  delYearPeriod,
  findStockPeriodList,
  findStockPeriodTree,
  generateNextYearPeriod,
  resetPeriodStart
} from "/@/api/record/group/im-unit";
import {message, Tag} from 'ant-design-vue';

const {createErrorModal} = useMessage()
const emit = defineEmits(['register']);

const loading = ref(true);
const treeData: any = ref([]);
const selectedKeys: any = ref([]);
const expandedKeys: any = ref([]);
const columns = [
  {
    title: '业务期间',
    dataIndex: 'stockYear',
    key: 'stockYear',
    ellipsis: true,
    slots: {customRender: 'stockYear'},
    width: 200
  },
  {
    title: '年度启用期间',
    dataIndex: 'stockFlag',
    key: 'stockFlag',
    ellipsis: true,
    slots: {customRender: 'stockFlag'},
  }
];
const selectedRowKeys: any = ref([]);
const selectedRowData: any = ref({});

const pageParameter = reactive({
  id: '',
  year: 'all',
})
const dynamicTenantInfo = ref(null)
const dynamicTenantId = ref('')
const yearList = ref([])
const [registerSavePage, {openModal: openSavePage}] = useModal();
const {createConfirm, createWarningModal} = useMessage();
// 这是示例组件
const [registerTable, {reload, getSelectRows, getDataSource, setTableData}] = useTable({
  api: findStockPeriodList,
  columns: columns,
  loading: loading.value,
  bordered: true,
  pagination: {
    pageSize: 50,
    showSizeChanger: true,
    pageSizeOptions: ['50', '100'],
    showTotal: t => `总共${t}条数据`
  },
  searchInfo: pageParameter
});

const [register, { closeModal }] = useModalInner( async (data) => {
  // 指定找到所有期间信息
});

const dynamicAdReload = async (e) => {
  dynamicTenantInfo.value = e
  dynamicTenantId.value = e.accountMode
  pageParameter.id = e.target.id
  await initLeftTree()
}

function onSelectChange(a, b) {
  selectedRowKeys.value = a
  selectedRowData.value = b
}

async function initLeftTree() {
  let years = await findStockPeriodTree({id: pageParameter.id})
  treeData.value = [{key: 'all', title: '全部', children: years.map(s => ({key: s, title: s}))}]
  yearList.value = years
  selectedKeys.value = ['all']
  expandedKeys.value = ['all']
}

function handleSelect(keys) {
  if (keys.length > 0)
    pageParameter.year = keys[0]
  reload()
}

const exec = async (e) => {
  if (e == 'add') {
    // 新建下一年度
    let nextYear = parseInt(yearList.value[yearList.value.length - 1]) + 1
    createConfirm({
      iconType: 'warning',
      title: '温馨提示',
      content: `即将生成${nextYear}年度期间，你确认要继续吗?`,
      onOk: async () => {
        let res = await generateNextYearPeriod({id: pageParameter.id, year: nextYear})
        message.success('操作成功!')
        initLeftTree()
        reload()
      },
      onCancel: () => {
        return false
      }
    })
  } else if (e == 'start') {
    // 只能启用第一个期间
    if (selectedRowKeys.value.length == 0 || yearList.value[0] != selectedRowData.value[0].stockYear) {
      createWarningModal({title: '温馨提示', content: '请选择开始年度要启用的期间！'})
    } else if (await check(yearList.value[0])) {
      createWarningModal({title: '温馨提示', content: '该年度已经发生业务单据！'})
    } else {
      createConfirm({
        iconType: 'warning',
        title: '温馨提示',
        content: `即将设置${selectedRowData.value[0].stockYear + '.' + selectedRowData.value[0].stockMonth}期间为启用期间，你确认要继续吗?`,
        onOk: async () => {
          let res = await resetPeriodStart({
            id: pageParameter.id,
            year: yearList.value[0],
            month: selectedRowData.value[0].stockMonth
          })
          message.success('操作成功!')
          reload()
        },
        onCancel: () => {
          return false
        }
      })
    }
  } else if (e == 'del') {
    let delYear = yearList.value[yearList.value.length - 1]
    if (await check(yearList.value[0])) {
      createWarningModal({title: '温馨提示', content: `${delYear}年度已经发生业务单据！`})
    } else {
      createConfirm({
        iconType: 'warning',
        title: '温馨提示',
        content: `即将删除${delYear}期间，你确认要继续吗?`,
        onOk: async () => {
          let res = await delYearPeriod({id: pageParameter.id, year: delYear})
          message.success('操作成功!')
          initLeftTree()
          reload()
        },
        onCancel: () => {
          return false
        }
      })
    }

  }
}

async function check(year) {
  // 检查指定年月期间 是否已经使用
  return true
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
:deep(.ant-table-tbody > tr.ant-table-row-selected > td) {
  background-color: #1488b1;
  color: white;
}

:deep(.account-picker) {
  .ap-title, .thisNameSpan {
    color: white !important;
  }
}
</style>
