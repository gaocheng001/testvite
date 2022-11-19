<template>
  <div>
    <div class="app-container">

      <div class="app-container-head">
<!--        <img :src="getThisIndexImg()" class="container-head-img" draggable="false">-->
        <div class="container-head-title" style="margin-left: 40%;text-align: center;">
          <b class="noneSpan">资产卡片样式列表</b>
<!--          <div style="font-size: 14px;text-align: center;margin-top: 20px;">
          <span style="font-size: 14px;font-weight: bold;">
            资产节点日期：<DatePicker v-model:value="pageParameter.cdate" :locale="localeCn" placeholder="时点日期" format="YYYY-MM-DD" style="width: 120px;"/>
          </span>
          </div>-->
        </div>
        <div class="ant-btn-group" style="float: right">
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="addPage()"
          ><span>新增</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
          ><span>修改</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="delList()"
          ><span>删除</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="closeCurrent()"
          ><span>退出</span></button>
        </div>
      </div>

      <div style="clear: none"/>
      <div style="">
        <div style="float: left;">
          <AccountPicker theme="one" @reloadTable="dynamicAdReload"/>
        </div>

        <div style="float: right; margin-left: 10px">
          <Button class="ant-btn-me">
            <SyncOutlined :style="{ fontSize: '14px' }"/>
          </Button>
          <Popover class="ant-btn-default" placement="bottom">
            <template #content>
              <Popconfirm
                ok-text="确定"
                cancel-text="放弃"
                @confirm="confirm"
                @cancel="cancel">
                <template #icon><b>栏目设置</b><br></template>
                <template #title>
                  <div style="width:665px">
                  <Table bordered :data-source="dynamicColumnData" :columns="dynamicColumns" class="lanmu-table"
                           childrenColumnName="children" :pagination="false"
                           style="max-height: 650px;overflow-y: auto">
                    <template #checkBox="{ text, record }">
                      <Checkbox v-model:checked="record.check" :disabled="record.isFixed"/>
                    </template>
                    <template #widthInput="{ text, record }">
                      <div class="editable-cell">
                        <div v-if="editableData[record.key]" class="editable-cell-input-wrapper">
                          <Input type="number" v-model:value="editableData[record.key].width"
                                   @pressEnter="save(record.key,record.min,record.max)"
                                   style="width: 80px"/>
                          <CheckOutlined class="editable-cell-icon-check"
                                          @click="save(record.key,record.min,record.max)"/>
                        </div>
                        <div v-else class="editable-cell-text-wrapper">
                          {{ text || ' ' }}
                          <EditOutlined class="editable-cell-icon" @click="edit(record.key)"/>
                          <span style="float: right;">{{ record.min + '~' + record.max }}</span>
                        </div>
                      </div>
                    </template>
                    <template #nameInput="{ text, record }">
                      <div class="editable-cell">
                        <div v-if="editableData[record.key]" class="editable-cell-input-wrapper">
                          <Input type="text" v-model:value="editableData[record.key].nameNew"
                                   @pressEnter="saveName(record.key)" style="width: 100px"/>
                          <CheckOutlined class="editable-cell-icon-check"
                                          @click="saveName(record.key)"/>
                        </div>
                        <div v-else class="editable-cell-text-wrapper">
                          {{ text || ' ' }}
                          <EditOutlined class="editable-cell-icon" @click="edit(record.key)"/>
                        </div>
                      </div>
                    </template>
                    <template #alignRadio="{ text, record }">
                      <RadioGroup default-value="a" size="small" v-model:value="record.align"
                                     :disabled="record.align==''">
                        <RadioButton value="left">
                          左
                        </RadioButton>
                        <RadioButton value="center">
                          中
                        </RadioButton>
                        <RadioButton value="right">
                          右
                        </RadioButton>
                      </RadioGroup>
                    </template>
                  </Table>
                  </div>
                </template>
                <Button style="width: 120px;margin-bottom: 2px">栏目设置</Button>
              </Popconfirm>
              <br/>
              <span class="group-btn-span-special2" @click="pageParameter.showRulesSize = 'MAX'"
                    :style="pageParameter.showRulesSize==='MAX'?{backgroundColor: '#0096c7',color: 'white'}:''">
                <SortDescendingOutlined/>&nbsp;大号字体&ensp;<CheckOutlined
                v-if="pageParameter.showRulesSize==='MAX'"/></span><br/>
              <span class="group-btn-span-special2" @click="pageParameter.showRulesSize = 'MIN'"
                    :style="pageParameter.showRulesSize==='MIN'?{backgroundColor: '#0096c7',color: 'white'}:''">
                <SortAscendingOutlined/>&nbsp;小号字体&ensp;<CheckOutlined
                v-if="pageParameter.showRulesSize==='MIN'"/></span>
            </template>
            <!--            <template #title>
                          <b>设置表格字号</b></template>-->
            <a-button>
              <SettingFilled :style="{ fontSize: '14px' }"/>
            </a-button>
          </Popover>
          <Button class="ant-btn-me">
            <UsbOutlined/>
          </Button>
          <Button class="ant-btn-me">
            <PrinterOutlined/>
          </Button>
          <Popover class="ant-btn-default" placement="bottom">
            <Button>
              <PicLeftOutlined :style="{ fontSize: '14px' }"/>
            </Button>
          </Popover>
<!--          <Button class="ant-btn-me">
            <PieChartFilled :style="{ fontSize: '14px' }" />
          </Button>-->
          <!--        <Popover placement="bottom">
                    <Button>
                      <SettingFilled :style="{ fontSize: '14px' }" />
                    </Button>
                  </Popover>-->
<!--        <Button>
          <PicLeftOutlined :style="{ fontSize: '14px' }" />
        </Button>-->
<!--        <Button>
          <EditFilled :style="{ fontSize: '14px' }" />
        </Button>-->
          <!--        <Popover placement="bottom">
                  </Popover>

                  <Button>
                    <EditFilled :style="{ fontSize: '14px' }" />
                  </Button>

                  <Button @click="activeKey=!activeKey">
                    <PieChartFilled :style="{ fontSize: '14px' }" />
                  </Button>
                  <Button>
                    <FilterFilled :style="{ fontSize: '14px' }" />
                  </Button>-->
        </div>
        <div style="float: right; position: relative">
          <Select v-model:value="formItems.selectType" style="width: 120px;font-size: 12px;" class="special_select">
            <SelectOption style="font-size: 12px;" value="1">系统编号</SelectOption>
            <SelectOption style="font-size: 12px;" value="2">资产卡片编码</SelectOption>
            <SelectOption style="font-size: 12px;" value="3">资产卡片名称</SelectOption>
          </Select>
          <!-- 搜索 -->
          <InputSearch
            placeholder=""
            style="width: 200px; border-radius: 4px"
            @search="onSearch"
          />
        </div>
      </div>

      <div style="clear:both"/>

    </div>
    <div class="app-container">
      <PageWrapper dense content-full-height fixed-height content-class="flex">
        <BasicTable
          :row-selection="{ type: 'checkbox', selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
          :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
          @register="registerTable"
          :dataSource="tableData"
        >
          <template #styleCode="{ record }"><span class="tableUStyle" @click="openEdit(record)">{{ record.styleCode }}</span></template>
        </BasicTable>
      </PageWrapper>
    </div>
    <Add
      @save="saveAdd"
      @register="registerAddPage"
    />
  </div>
</template>
<script setup="props, {emit}" lang="ts">
import {PageWrapper} from '/@/components/Page'
import { BasicTable, useTable } from '/@/components/Table'
import { useModal } from '/@/components/Modal'
import {onMounted, reactive, ref} from 'vue'
import Icon from '/@/components/Icon/index'
import {
  CaretDownFilled,
  FormOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SettingFilled,
  SyncOutlined,
  PicLeftOutlined,
  EditFilled,
  PieChartFilled,
  FilterFilled,
  SortDescendingOutlined,
  CheckOutlined,
  SortAscendingOutlined,
  PrinterOutlined,
  UsbOutlined,
  EditOutlined
} from '@ant-design/icons-vue'
import {
  Select,
  Input,
  DatePicker,
  Popover,
  Button,
  Tabs,
  Tag,
  Popconfirm,
  Checkbox,
  Radio,
  Table,
  message
} from 'ant-design-vue'
import {useMessage} from "/@/hooks/web/useMessage";
import {getCurrentAccountName, getThisIndexImg} from "/@/api/task-api/tast-bus-api";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker.vue";
import Add from './popup/add.vue'
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {findFaStyleHeadAll} from "/@/api/fa/fa-style";

const InputSearch = Input.Search
const SelectOption = Select.Option
const TabPane = Tabs.TabPane
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

const {
  createSuccessModal,
  createErrorModal,
  createWarningModal,
  createConfirm
} = useMessage()

const {closeCurrent} = useTabs(router);

const windowHeight = (window.innerHeight)

const formItems = ref({
  selectType: '1'
})

const typeFlag = ref('0')

const dynamicTenantId = ref(getCurrentAccountName(true))
const defaultAdName = ref(useCompanyOperateStoreWidthOut().getSchemaName)

const tableData:any = ref([]);
const tableDataAll:any = ref([]);
const loadMark = ref(false)

async function reloadTable(){
  loadMark.value = true
  const res = await useRouteApi(findFaStyleHeadAll, {schemaName: dynamicTenantId})({})
  tableDataAll.value = res.items
  tableData.value = tableDataAll.value
  await setPagination({
    total: tableData.value.length
  })
  loadMark.value = false
}
const CrudApi = {
  columns: [
    {
      title: '样式编码',
      dataIndex: 'styleCode',
      width: '15%',
      fixed: 'left',
      ellipsis: true,
      slots: { customRender: 'styleCode'}
    },
    {
      title: '样式名称',
      dataIndex: 'styleName',
      width: '30%',
      fixed: 'left',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '说明',
      dataIndex: 'remarks',
      width: '40%',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '是否系统',
      dataIndex: 'sysFlag',
      width: '15%',
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'sysFlag'}
    },
  ],
}

// 这是示例组件
const [registerTable, {
  reload,
  getDataSource,
  setTableData,
  setColumns,
  getColumns,
  setPagination,
  getPaginationRef
}] = useTable({
  columns: CrudApi.columns,
  bordered: true,
  showIndexColumn: true,
  pagination: {
    pageSize: 50,
    showSizeChanger: true,
    pageSizeOptions: ['10', '25', '50', '100'],
    showTotal: t => `总共${t}条数据`
  },
  /*actionColumn: {
    width: 120,
    title: '操作',
    dataIndex: 'action',
    slots: {customRender: 'action'}
  }*/
})

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
  state.selectedRowKeys = selectedRowKeys;
  checkRow.value = row
};

const pageParameter: any = reactive({
  showRulesSize:'MIN',
  cardUnique: '',
  isEdit: '0',
  dynamicTenantId: '',
  defaultAdName: '',
  year: '',
  thisAdInfo: {},
  total: 0,
})

//新增资产卡片弹框
const [registerAddPage, {openModal: openAddPage}] = useModal()
//添加
const addPage = () => {
  openAddPage(true, {})
}
//修改
function openEdit(data){
}
//保存方法
function saveAdd(data){}

async function delList() {
  if (checkRow.value.length > 0) {
    createConfirm({
      iconType: 'error',
      title: '警告',
      content: '删除后数据将不能恢复，你确认要删除吗?',
      onOk: async () => {
        for (let i = 0; i < checkRow.value.length; i++) {
          const item = checkRow.value[i]
        }
        message.success('删除成功！')
        checkRow.value = []
        state.selectedRowKeys = []
        await reload()
      },
      onCancel: () => {
        return false
      }
    })
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '删除',
      content: '请选择需要删除的内容！'
    })
    return false
  }
}

function onSearch() {
}

const defaultPage = ref(false)
onMounted(async() => {
})

const dynamicAdReload = async (obj) => {
  // const dataBase:any = await findDataBase(obj.accId,obj.year)
  dynamicTenantId.value = obj.accountMode
  defaultAdName.value = obj.accId
  pageParameter.dynamicTenantId = obj.accountMode
  pageParameter.defaultAdName = obj.accId
  pageParameter.year = obj.year
  await reloadTable()
  /*let data: any = {}
  data.page = getPaginationRef().current
  data.size = getPaginationRef().pageSize
  let res: any = await useRouteApi(CrudApi.list, {schemaName: obj.accountMode})(data)
  setTableData([]) // 清空可能残留的数据
  setTableData(res.items)*/
  // 底部分页信息
  pageParameter.thisAdInfo = {}
  pageParameter.thisAdInfo = obj
  pageParameter.total = tableData.value.length
  setPagination({total: tableData.value.length})
}
</script>
<style src="../../../../assets/styles/global-menu-index-block.less" lang="less" scoped></style>
<style src="../../../../assets/styles/global-menu-index.less" lang="less" scoped></style>
<style scoped lang="less">
:deep(.ant-card-body) {
  padding: 16px;
  border-left: 2px solid rgb(1, 143, 251);
  box-shadow: rgb(72 113 140) -3px 1px 7px -1px;
}

.a-table-font-size-16 :deep(td),
.a-table-font-size-16 :deep(th) {
  font-size: 16px !important;
  padding: 5px 8px !important;
}

.a-table-font-size-12 :deep(td),
.a-table-font-size-12 :deep(th) {
  font-size: 14px !important;
  padding: 2px 8px !important;
}

.app-container:nth-of-type(1) {
  background-color: #f2f2f2;
  padding: 10px 5px;
  margin: 10px 10px 5px;
}

.app-container:nth-of-type(2) {
  padding: 0px;
  margin: 5px 10px;
  background: #b4c8e3 !important;
}

:deep(.ant-table-thead) th{
  text-align: center !important;
}

.voucher-list-tree {
  display: inline-block;
  height: calc(100%);
  width: 236px;
  float: left;
  :deep(.ant-select-selector) {
    background-color: #f1f1f1;
    border: none;
    border-bottom: solid 1px rgb(191, 191, 191) !important;
  }

  :deep(.ant-tabs-nav) {
    margin-bottom: 0px;

    .ant-tabs-tab-active {
      background-color: #f1f1f1;
      border-top: 2px solid #0096c7;
      border-bottom: none;
    }
  }

  :deep(.ant-tabs-content) {
    padding: 0 10px 10px;
    background-color: #f1f1f1;

    .scroll-container {
      border: 2px groove #cac2c2;
      background-color: #f1f1f1;
      height: calc(100% - 60px) !important;
      .ant-tree-list{
        background-color: #f1f1f1 !important;
      }
    }
  }
}
.bg-white {
  width: 250px !important;
  min-height: 250px !important;
  height: calc(100% - 170px);
  border: 1px #cccccc solid;
  background: white !important;
  margin-right: .2%;
}
</style>
