<template>
  <div class="app-financial-info" :style="{height: (windowHeight-130)+'px'}">
    <div class="a-container-head">
      <div class="a-c-head-title">
        <SettingOutlined style="font-size: 30px;color: #666666;float: left;margin: 0 .5%;"/>
        <h2>期间设置</h2>
        <div style="float: right;margin-top: -40px;" >
          <button type="button" class="ant-btn ant-btn-me" @click="closeCurrent(),router.push('/zhongZhang/home/welcome')"><span>退出</span></button>
        </div>
      </div>
      <div class="a-c-head-btns">
        <div class="ant-btn-group a-c-h-btns-group" style="min-width: 600px">
          <AccountPicker theme="three" @reloadTable="dynamicAdReload" style="width: 100%"/>
        </div>
      </div>
    </div>
    <div class="setting_box"></div>
    <div class="a-container-content">
      <a-tabs type="card" :tabBarGutter="0" v-model:activeKey="activeKey" tabPosition="left">
        <a-tab-pane key="1" :style="activeKey=='1'?{height: (windowHeight-170)+'px',overflowY: 'auto'}:{}">
          <template #tab>
            <span style="line-height: 30px;display: flex;color: white;"><AppstoreOutlined style="font-size: 30px;color: #666666;background-color: white;"/>业务期间</span>
          </template>
          <div class="a-container-content-one">
            <div class="acco-btn">
              <button type="button" class="ant-btn ant-btn-me"><span style="font-weight: bold;"
                                                                     @click="exec('add')">新增</span>
              </button>
              <button type="button" class="ant-btn ant-btn-me"><span style="font-weight: bold;"
                                                                     @click="exec('start')">启用</span>
              </button>
              <button type="button" class="ant-btn ant-btn-me"><span style="font-weight: bold;"
                                                                     @click="exec('del')">删除</span>
              </button>
            </div>
            <div style="width: 1060px;height: 100%">
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
                <BasicTable @register="registerTable" :scroll="{ y: (windowHeight-380) }" :class="'a-table-font-size-12'"
                            :row-selection="{ type: 'radio',selectedRowKeys: selectedRowKeys, onChange: onSelectChange}">
                  <template #stockYear="{ record }">
                    {{ record.stockYear + '.' + record.stockMonth }}
                  </template>
                  <template #stockFlag="{ record }">
                    <Tag :color="'green'" v-if="record.stockFlag == '1'">启用</Tag>
                  </template>
                </BasicTable>
              </div>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script setup="props, {emit}" lang="ts">
import {
  Button as AButton,
  Checkbox as ACheckbox,
  DatePicker as ADatePicker, message,
  Radio as ARadio,
  Radio,
  Select as ASelect,
  Tabs as ATabs,
  Tree as ATree,Tag
} from "ant-design-vue"
import router from "/@/router";
import {reactive, ref, watch} from "vue";
import {AppstoreOutlined, SettingOutlined} from '@ant-design/icons-vue'
import {
  compareTime,
  findByFunctionModule,
  markAnomaly,
  offsetToStr
} from "/@/api/task-api/tast-bus-api";
import {useMessage} from "/@/hooks/web/useMessage";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {useTabs} from "/@/hooks/web/useTabs";
import {findOption, getCurrDefaultModel, saveOption} from "/@/api/record/stock/stock-option";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {
  delYearPeriod,
  findStockPeriodList,
  findStockPeriodTree,
  generateNextYearPeriod, resetPeriodStart
} from "/@/api/record/group/im-unit";

const ATabPane = ATabs.TabPane
const ASelectOption = ASelect.Option
const ACheckboxGroup = ACheckbox.Group
const ARadioGroup = ARadio.Group
const ATreeNode = ATree.TreeNode
const AMonthPicker = ADatePicker.MonthPicker
const RadioGroup = Radio.Group

const windowHeight = (window.innerHeight)
const {
  createErrorModal, createWarningModal, createConfirm
} = useMessage()

const { closeCurrent } =useTabs();
const activeKey= ref('1')
const database = ref('')
const databaseCn = ref('')
const databaseCode = ref('')
/************************************基础选项************************************/
const isEdit = ref(true)
const dataModel = reactive({basisMap:{},controlList:[]})
const dataModelCopy = reactive({basisMap:{},controlList:[]})






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
import {BasicTable, useTable} from '/@/components/Table';
import {BasicTree} from '/@/components/Tree';
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
<style scoped="scoped" lang="less">
@import '/@/assets/styles/financial-info-menu.less';
.acco-sideline-content-one{
  padding: 10px;
  > div{
    width: 33% !important;
    display: inline-block !important;;
    padding: 10px 30px !important;
  }
}
:deep(.ant-checkbox-wrapper){
  >span:nth-of-type(2){
    font-weight: bold;
    color: black;
    font-size: 13px;
  }
}
.special-span{
  font-weight: bold;
  color: black;
  font-size: 13px;
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
</style>
