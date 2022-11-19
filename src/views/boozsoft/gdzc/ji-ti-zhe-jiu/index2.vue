<template>
  <div>
    <div class="app-container">

      <div class="app-container-head">
        <div class="container-head-title" style="margin-left: 40%">
          <b class="noneSpan">折旧清单</b>
          <div style="font-size: 14px;text-align: center;margin-top: 20px;">
          <span style="font-size: 14px;font-weight: bold;">
            折旧期间：<Select v-model:value="month" @change="reloadTable()" placeholder="折旧期间" style="width: 80px;">
              <SelectOption v-for="item in periodList" :value="item.imonth">{{item.imonth}}月</SelectOption>
            </Select>
          </span>
          </div>
        </div>
        <div class="ant-btn-group" style="float: right">
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="openJitizhejiu()"
          ><span>计提折旧</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
          ><span>导出</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
          ><span>打印</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="closeCurrent()"
          ><span>退出</span></button>
        </div>
      </div>

      <div style="clear: none"/>
      <div style="margin-top: -70px;">
        <div>
          <AccountPicker theme="one" @reloadTable="dynamicAdReload"/>
        </div>
        <div style="display: inline-block;float: left;margin-left: 1%;">
          <label>管理代码：</label>
          <Select v-model:value="manageCode" @change="reloadPeriod()" placeholder="管理代码" style="width: 200px;">
            <SelectOption v-for="item in accountList" :value="item.id">FA{{item.faAccId}}-{{item.faAccName}}</SelectOption>
          </Select>&emsp;
        </div>

        <div style="float: right; margin-left: 10px">
          <Button class="ant-btn-me">
            <SyncOutlined :style="{ fontSize: '14px' }"/>
          </Button>
          <Popover class="ant-btn-default" placement="bottom">
            <template #content>
              <span class="group-btn-span-special2" @click="pageParameter.showRulesSize = 'MAX'"
                    :style="pageParameter.showRulesSize==='MAX'?{backgroundColor: '#0096c7',color: 'white'}:''">
                <SortDescendingOutlined/>&nbsp;大号字体&ensp;<CheckOutlined
                v-if="pageParameter.showRulesSize==='MAX'"/></span><br/>
              <span class="group-btn-span-special2" @click="pageParameter.showRulesSize = 'MIN'"
                    :style="pageParameter.showRulesSize==='MIN'?{backgroundColor: '#0096c7',color: 'white'}:''">
                <SortAscendingOutlined/>&nbsp;小号字体&ensp;<CheckOutlined
                v-if="pageParameter.showRulesSize==='MIN'"/></span>
            </template>
            <Button>
              <SettingFilled :style="{ fontSize: '14px' }"/>
            </Button>
          </Popover>
          <Popover class="ant-btn-default" placement="bottom">
            <template #content>
              <span class="group-btn-span-special2"
                    :style="typeFlag=='0'?{backgroundColor: '#0096c7',color: 'white'}:''" style="width: 160px;">
                正常资产&emsp;<CheckOutlined
                v-if="typeFlag=='2'"/></span><br/>
              <span class="group-btn-span-special2"
                    :style="typeFlag=='1'?{backgroundColor: '#0096c7',color: 'white'}:''" style="width: 160px;">
                已拆分资产&emsp;<CheckOutlined
                v-if="typeFlag=='1'"/></span><br/>
              <span class="group-btn-span-special2"
                    :style="typeFlag=='2'?{backgroundColor: '#0096c7',color: 'white'}:''" style="width: 160px;">
                已减少资产&emsp;<CheckOutlined
                v-if="typeFlag=='2'"/></span>
            </template>
            <Button>
              <PieChartFilled :style="{ fontSize: '14px' }"/>
            </Button>
          </Popover>
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
      <BasicTable
        :row-selection="{ type: 'checkbox', selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
        :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
        @register="registerTable"
        :dataSource="tableData"
        :loading="loadMark"
      >
        <template #yuanzhi="{ record }">{{toThousandFilter(record.yuanzhi)}}</template>
        <template #qcLj="{ record }">{{toThousandFilter(sub(record.zjLj,record.zjBy))}}</template>
        <template #zjBy="{ record }">{{toThousandFilter(record.zjBy)}}</template>
        <template #yuezhejiulv="{ record }">{{toThousandFilter(record.yuezhejiulv)}}%</template>
        <template #zjLj="{ record }">{{toThousandFilter(record.zjLj)}}</template>
        <template #gzlBy="{ record }">{{toThousandFilter(record.gzlBy)}}</template>
        <template #gzlLj="{ record }">{{toThousandFilter(record.gzlLj)}}</template>
      </BasicTable>
    </div>
    <Jitizhejiu
      @save="saveJitizhejiu"
      @register="registerJitizhejiuPage"
    />
  </div>
</template>
<script setup="props, {emit}" lang="ts">
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
  SortAscendingOutlined
} from '@ant-design/icons-vue'
import {
  Select,
  Input,
  Popover,
  Button,
  message
} from 'ant-design-vue'
import {useMessage} from "/@/hooks/web/useMessage";
import {getThisAdInfoData} from "/@/api/record/system/financial-settings";
import {getCurrentAccountName, getThisIndexImg} from "/@/api/task-api/tast-bus-api";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker.vue";
import Jitizhejiu from './popup/jitizhejiu.vue'
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {
  deleteCardMasterByCardUnique,
  deleteChangeByCardUnique,
  deleteChangeDeptByCardUnique,
  deleteChangeProjectByCardUnique,
  findCardMasterAll
} from "/@/api/fa/fa-card";
import {findFaAccountByAccId} from "/@/api/record/gdzc/zc-options";
import {findByIyearAndImonth, findPeriodByUniqueCode} from "/@/api/fa/fa-jiti_zhejiu";
import {toThousandFilter,sub} from "../gu-ding-zi-chan-add/calculation";

const InputSearch = Input.Search
const SelectOption = Select.Option

const {
  createSuccessModal,
  createErrorModal,
  createWarningModal,
  createConfirm
} = useMessage()

const {closeCurrent} = useTabs(router);

const formItems = ref({
  selectType: '1'
})

const typeFlag = ref('0')

const manageCode:any = ref("")
const month:any = ref("12")

const accountList:any = ref([])
async function reloadList(){
  accountList.value = await findFaAccountByAccId(defaultAdName.value)
  if (accountList.value.length>0){
    manageCode.value = accountList.value[0].id
    await reloadPeriod()
  }
}

//加载期间
const periodList = ref()
async function reloadPeriod(){
  periodList.value = await findPeriodByUniqueCode({code:manageCode.value,year:pageParameter.year})
  for (const item of periodList.value) {
    if (item.isSettle!='1'){
      month.value = item.imonth
      await reloadTable()
    }
  }
}

const dynamicTenantId = ref(getCurrentAccountName(true))
const defaultAdName = ref(useCompanyOperateStoreWidthOut().getSchemaName)

const tableData:any = ref([]);
const tableDataAll:any = ref([]);
const loadMark = ref(false)
async function reloadTable(){
  loadMark.value = true
  tableDataAll.value = await useRouteApi(findByIyearAndImonth,{schemaName: dynamicTenantId})({code:manageCode.value,year:pageParameter.year,month:month.value})
  tableData.value = tableDataAll.value
  await setPagination({
    total: tableData.value.length
  })
  loadMark.value = false
}
const CrudApi = {
  // list: useRouteApi(findCardMasterAll, {schemaName: dynamicTenantId}),
  columns: [
    {
      title: '资产卡片编号',
      dataIndex: 'cardCode',
      width: 120,
      align: 'left',
      ellipsis: true,
    },
    {
      title: '资产名称',
      dataIndex: 'faName',
      width: 200,
      align: 'left',
      ellipsis: true,
    },
    {
      title: '规格型号',
      dataIndex: 'speciType',
      width: 150,
      align: 'left',
      ellipsis: true,
    },
    {
      title: '原值',
      dataIndex: 'yuanzhi',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'yuanzhi'}
    },
    {
      title: '期初累计折旧',
      dataIndex: 'qcLj',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'qcLj'}
    },
    {
      title: '本月折旧',
      dataIndex: 'zjBy',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'zjBy'}
    },
    {
      title: '月折旧率',
      dataIndex: 'yuezhejiulv',
      width: 100,
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'yuezhejiulv'}
    },
    {
      title: '期末累计折旧',
      dataIndex: 'zjLj',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'zjLj'}
    },
    {
      title: '本月工作量',
      dataIndex: 'gzlBy',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'gzlBy'}
    },
    {
      title: '累计工作量',
      dataIndex: 'gzlLj',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'gzlLj'}
    },
  ]
}
// 这是示例组件
const [registerTable, {
  reload,
  getDataSource,
  setTableData,
  setPagination,
  getPaginationRef
}] = useTable({
  // api: CrudApi.list,
  columns: CrudApi.columns,
  bordered: true,
  showIndexColumn: false,
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

//计提折旧弹框
const [registerJitizhejiuPage, {openModal: openJitizhejiuPage}] = useModal()
const openJitizhejiu = () => {
  openJitizhejiuPage(true, {
    data: {}
  })
}

//计提折旧保存
async function saveJitizhejiu(data){
  message.success('计提折旧成功!')
  await reloadTable()
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
const onSelectChange = (selectedRowKeys,row) => {
  // console.log('selectedRowKeys changed: ', row);
  state.selectedRowKeys = selectedRowKeys;
  checkRow.value = row
};

const pageParameter: any = reactive({
  cardUnique: '',
  isEdit: '0',
  dynamicTenantId: '',
  defaultAdName: '',
  year: '',
  thisAdInfo: {},
  total: 0,
})

async function delList() {
  if (checkRow.value.length > 0) {
    createConfirm({
      iconType: 'error',
      title: '警告',
      content: '删除后数据将不能恢复，你确认要删除吗?',
      onOk: async () => {
        for (let i = 0; i < checkRow.value.length; i++) {
          const item = checkRow.value[i]
          await useRouteApi(deleteCardMasterByCardUnique, {schemaName: dynamicTenantId})(item.cardUnique)
          await useRouteApi(deleteChangeByCardUnique, {schemaName: dynamicTenantId})(item.cardUnique)
          await useRouteApi(deleteChangeDeptByCardUnique, {schemaName: dynamicTenantId})(item.cardUnique)
          await useRouteApi(deleteChangeProjectByCardUnique, {schemaName: dynamicTenantId})(item.cardUnique)
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
  // 底部分页信息
  pageParameter.thisAdInfo = {}
  pageParameter.thisAdInfo = obj
  pageParameter.dynamicTenantId = obj.accountMode
  pageParameter.defaultAdName = obj.accId
  pageParameter.year = obj.year
  await reloadList()
}
</script>
<style src="../../../../assets/styles/global-menu-index-block.less" lang="less" scoped></style><style lang='less' scoped ></style>
<style src="../../../../assets/styles/global-menu-index.less" lang="less" scoped></style><style lang='less' scoped ></style>
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
</style>
