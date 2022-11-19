<template>
  <div class="app-container">
    <div class="app-container-top" style="background-color: #c9c7c7;">
      <div class="app-container-top-one">
        <div class="act-one-d-left" style="width: 22%;"></div>
        <div class="act-one-d-title">

        </div>
        <div class="act-one-d-btn-group">
          <Button class="actod-btn" @click="openQpage" v-if="status == 3">新增</Button>
          <Button class="actod-btn" @click="saveData" v-if="status == 1 || status == 2">保存</Button>
          <Button class="actod-btn" @click="giveUp" v-if="status == 1 || status == 2">放弃</Button>
          <Button class="actod-btn" @click="startEdit"
                  v-if="status == 3 && (!isSettle) && hasBlank(formItems.verifyUsername) ">修改
          </Button>
          <Button class="actod-btn" @click="startDel"
                  v-if=" hasBlank(formItems.verifyUsername) && (!isSettle)">删除
          </button>
          <Button class="actod-btn" @click="importEntry" v-if="status == 1 || status == 2">引入
          </Button>
          <Button class="actod-btn" @click="startReview" v-if="status == 3 && (!isSettle)">
            {{ hasBlank(formItems.verifyUsername) ? '审核' : '弃审' }}
          </button>
          <Button class="actod-btn" v-if="status == 1 && hasBlank(formItems.id)" @click="openQpage">
            盘点范围
          </button>
          <Button class="actod-btn"
                  v-if="(status == 1 || status == 2) && hasBlank(formItems.verifyUsername)"
                  @click="startBalance">相符
          </button>
          <Button v-if="status == 3" class="actod-btn" @click="exportExcel()">导出</Button>
          <Button v-if="status == 3" class="actod-btn" @click="printData()">打印</Button>
          <Button class="actod-btn actod-btn-last" @click="closeCurrent()">退出</Button>
        </div>
      </div>
      <div class="app-container-top-two" :class="status != 3?'status-look':''">
        <div class="act-two-d-left">
          <AccountPicker theme="one" @reloadTable="dynamicAdReload"/>
        </div>
        <div class="act-two-d-center">
<!--          <span>管理代码：</span>
          <Select class="acttdrd-search-select" v-model:value="pageParameter.managementCode"
                  style="width: 200px;" placeholder="FA">
            <template #suffixIcon>
              <SearchOutlined/>
            </template>
            <SelectOption v-for="item in faAccountList" :value="item.split('==')[0]">FA{{
                item.split('==')[1] + ' - ' + item.split('==')[2]
              }}
            </SelectOption>
          </Select>-->
        </div>
        <div class="act-two-d-right">
          <div class="acttd-right-d-search">
            <InputSearch
              class="acttdrd-search-input"
              placeholder="资产编码"
              style="border-left:1px solid #c9c9c9;"
            />
          </div>
          <div class="acttd-right-d-btns">
            <Button class="acttdrd-btn" @click="pageReload()">
              <SyncOutlined :style="{ fontSize: '14px' }"/>
            </Button>
            <Popover placement="bottom">
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
              <Button class="acttdrd-btn">
                <SettingFilled :style="{ fontSize: '14px' }"/>
              </Button>
            </Popover>
            <Button class="acttdrd-btn">
              <FilterFilled :style="{ fontSize: '14px' }"/>
            </Button>
          </div>
        </div>
      </div>
    </div>
    <div class="app-container-bottom" :style="{height: (windowHeight+60)+'px'}">
      <div class="acb-head">
        <div class="acbgead-one">
          <div class="acbgead-one-triangle">
            <div></div>
            <div>
              <span
                style="color: white;">{{
                  status == 0 ? '暂存' : status == 1 ? '新增' : status == 2 ? '编辑' : '查看'
                }}</span>
            </div>
          </div>
          <div class="acbgead-one-changes" :class="status == 1 || status == 2 ?'status-look':''">
            <VerticalRightOutlined @click="contentSwitch('first')"/>&nbsp;
            <LeftOutlined @click="contentSwitch('prev')"/>&nbsp;
            <RightOutlined @click="contentSwitch('next')"/>&nbsp;
            <VerticalLeftOutlined @click="contentSwitch('tail')"/>
          </div>
          <span style="font-size: 22px;color: #0096c7;font-weight: bold;">盘点单</span>
          <span
            style="font-size: 18px;color: red;font-weight: bold;margin-left: 5%;display: inline-block"
            v-if="!hasBlank(formItems.verifyUsername)">已审核</span><span
          v-else>&emsp;&emsp;&emsp;</span>
        </div>
        <div class="acbgead-two" :class="status == 3?'status-look':''">
          <span>盘点截止日期：</span>
          <DatePicker :locale="localeCn" :disabled="true" v-model:value="formItems.endDate"
                      placeholder="" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                      style="width: 120px"/>
          <span>单据编号：</span> <Input v-model:value="formItems.pdId"
                                    style="width: 12%"/>
          <span>盘点方式：</span>
          <Select style="width: 12%" :disabled="true" v-model:value="formItems.pdMethod">
            <SelectOption value="0">按全部资产盘点</SelectOption>
            <SelectOption value="1">按资产类别盘点</SelectOption>
            <SelectOption value="2">按使用部门盘点</SelectOption>
            <SelectOption value="3">按所属项目盘点</SelectOption>
            <SelectOption value="4">按责任人盘点</SelectOption>
            <SelectOption value="5">按存放位置盘点</SelectOption>
            <SelectOption value="6">按使用状况盘点</SelectOption>
          </Select>
          <span>盘点范围：</span><Input :disabled="true" style="width: 20%"
                                   v-model:value="formItems.pdRangeText"/>
          <br/>
          <span>盘点部门：</span> <Select style="width: 10%" v-model:value="formItems.pdDept">
          <Select-option v-for="d in deptList" :value="d.uniqueCode">
            {{ d.label }}
          </Select-option>
        </Select>
          <span>盘点人：</span> <Select style="width: 8%" v-model:value="formItems.pdUsername">
          <SelectOption v-for="item in psnList.filter(it=>it.id != formItems.pdjdUsername)"
                        :value="item.id">{{ item.psnName }}
          </SelectOption>
        </Select>
          <span>监管盘点部门：</span> <Select style="width: 10%" v-model:value="formItems.pdjdDept">
          <Select-option v-for="d in deptList" :value="d.uniqueCode">
            {{ d.label }}
          </Select-option>
        </Select>
          <span>监管盘点人：</span> <Select style="width: 8%" v-model:value="formItems.pdjdUsername">
          <SelectOption v-for="item in psnList.filter(it=>it.id != formItems.pdUsername)"
                        :value="item.id">{{ item.psnName }}
          </SelectOption>
        </Select>
          <span>审核人：</span><Input :disabled="true" style="width: 7%"
                                  v-model:value="formItems.verifyUsername"/>
          <br/><br/>
        </div>
      </div>
      <div class="acb-centent" :class="status == 3?'status-look':''">
        <!--  针对过滤框显示添加的内容高度  -->
        <BasicTable
          ref="tableRef"
          :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
          :row-selection="{ type: 'checkbox',fixed: true,selectedRowKeys: tableSelectedRowKeys, onChange: onSelectChange }"
          :scroll="{ y: windowHeight-160 }"
          :rowKey="r=>r.cardUnique"
          :loading="loadMark"
          size="small"
          @register="registerTable"
        >
          <template #cardUnique="{ record }">
            {{formatUniqueCodeCard(record.cardUnique,'cardCode')}}
          </template>
          <template #cardName="{ record }">
            {{formatUniqueCodeCard(record.cardUnique,'faName')}}
          </template>
          <template #cardType="{ record }">
            {{formatUniqueCodeCard(record.cardUnique,'speciType')}}
          </template>
          <template #realityAmount="{ record }">
            <template v-if="record?.edit">
              <InputNumber v-model:value="record.temp"
                           :formatter="value =>`${value}`.replace(/[^\d]/g, '')"
                           :parser="value =>`${value}`.replace(/[^\d]/g,'')"
                           style="width: 85%;"
                           @keyup.enter="record.edit = null;record.realityAmount=record.temp;"/>
              <CheckOutlined @click="record.edit = null;record.realityAmount=record.temp;"/>
            </template>
            <template v-else>
              <span class="a-table-font-arial">{{
                  record.realityAmount
                }}
              <EditOutlined v-if="status == 1 || status == 2"
                            @click="record.edit = true;record.temp=record.realityAmount"/></span>
            </template>
          </template>
          <template #outcome="{ record }">
            <span
              :style="showCurrentText(record.bookAmount, record.realityAmount).indexOf('亏')!= -1?{color: 'red'}:{color: 'green'}">
            {{ showCurrentText(record.bookAmount, record.realityAmount) }}</span>
          </template>
          <template #outcome2="{ record }">
            {{ showCurrentText(record.debookAmount, record.derealityAmount) }}
          </template>
        </BasicTable>
        <Query
          @query="loadPage"
          @register="registerQueryPage"
        />
        <Import
          @save="introduceData"
          @register="registerImportPage"
        />
      </div>
    </div>

  </div>
</template>

<script setup="props, {emit}" lang="ts">
import {
  Input,
  InputNumber,
  Select,
  Popover,
  Tabs,
  DatePicker,
  Button,
  Radio,
  message
} from "ant-design-vue";
import Query from "./popup/query.vue";
import Import from "./popup/import.vue";
import localeCn from 'ant-design-vue/es/date-picker/locale/zh_CN';

const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const InputSearch = Input.Search
const SelectOption = Select.Option
const TabPane = Tabs.TabPane
import {
  SettingFilled,
  SyncOutlined,
  FilterFilled,
  CheckOutlined,
  EditOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  VerticalLeftOutlined,
  VerticalRightOutlined,
  LeftOutlined,
  RightOutlined, SearchOutlined
} from '@ant-design/icons-vue'
import {onMounted, reactive, ref, computed, watch, onActivated, onUpdated} from "vue";
import {useMessage} from "/@/hooks/web/useMessage";
import {getCurrentAccountName, hasBlank} from "/@/api/task-api/tast-bus-api";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-GDZC.vue";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {
  findFaAssetTypeByFlagAndBend, findCardMasterEffectiveAll,
  findFaUsageStatusByFlagAndBend, findLocationByFlagAndBend,
} from "/@/api/fa/fa-card";
import {psnFindByFlag} from "/@/api/psn/psn";

const {
  createErrorModal, createConfirm
} = useMessage()
const {closeCurrent} = useTabs(router);
const [registerQueryPage, {openModal: openQueryPageM}] = useModal()
const [registerImportPage, {openModal: openImportPageM}] = useModal()
const windowHeight = (window.innerHeight - 300)
const assetCardList = ref([])
const assetTypeList = ref([])
const faAccountList = ref([])
const dynamicTenantId = ref(getCurrentAccountName(true))
const pageParameter = reactive({
  showRulesSize: 'MIN',
  searchConditon: {
    requirement: '',
    value: '',
  },
  managementCode: ''
})
const formItems: any = ref({})
const changeBtns = ref({
  first: true,
  prev: true,
  next: true,
  tail: true,
})
import {JsonTool} from "/@/api/task-api/tools/universal-tools";

const isSettle = ref(false)
const dynamicAdReload = async (obj) => {
  dynamicTenantId.value = obj.accountMode
  pageParameter.managementCode = obj.managementCode
  if (pageParameter.managementCode == '') {
    message.warning('请先建立资产账后进行操作！')
  }else {
    assetsDate.value = obj.managementYearInfo.date
    await reloadList()
    formItems.value = {}
    setTableData([])
    if (null != route.query && Object.keys(route.query).length >= 2) {
      pageParameter.managementCode  = route.query.code
      if (route.query.status == '1') {
        openQpage()
      } else {
        formItems.value.pdId = route.query.pId
        await contentSwitch('curr')
      }
    } else {
      await contentSwitch('tail')
    }
  }
}
const route = useRoute();

const pageReload = async () => {
  if (!hasBlank(pageParameter.managementCode) && !hasBlank(formItems.value.pdId)) {
    await contentSwitch('curr')
  }
}
const usageStatusList = ref([])
const psnList = ref([])
const proList = ref([])
const deptList = ref([])
const locationList = ref([])
const assetsDate = ref('')
async function reloadList() {
  if (!hasBlank(pageParameter.managementCode)){
    assetCardList.value = await useRouteApi(findCardMasterEffectiveAll, {schemaName: dynamicTenantId})({})
    assetTypeList.value = await useRouteApi(findFaAssetTypeByFlagAndBend, {schemaName: dynamicTenantId})({})
    usageStatusList.value = await useRouteApi(findFaUsageStatusByFlagAndBend, {schemaName: dynamicTenantId})({})
    psnList.value = await useRouteApi(psnFindByFlag, {schemaName: dynamicTenantId})({})
    deptList.value = await useRouteApi(findDeptAll, {schemaName: dynamicTenantId})({});
    locationList.value = await useRouteApi(findLocationByFlagAndBend, {schemaName: dynamicTenantId})({})
    proList.value = await useRouteApi(findAllProject, {schemaName: dynamicTenantId})({})
  }
}

async function contentSwitch(action) {
  if (!hasBlank(pageParameter.managementCode)) {
    loadMark.value = true
    let res = await useRouteApi(findFaPanDianByCondition, {schemaName: dynamicTenantId})({
      code: pageParameter.managementCode,
      action: action,
      curr: formItems.value.pdId
    })
    if (null != res) {
      let oldDate = formItems.value.endDate || ''
      formItems.value = res
      formItems.value.pdRangeText = formItems.value.pdRange == null ? '全部' : getCurrRangeText(formItems.value.pdMethod, formItems.value.pdMethod != '0' ? JsonTool.parseObj(formItems.value.pdRange) : formItems.value.pdRange)
      if (!hasBlank(formItems.value.beiyong5)) {
        setTableData([])
        setTableData(JsonTool.parseObj(formItems.value.beiyong5))
      }
      formItems.value.beiyong5 = null
      if (oldDate.substring(0, 7) != formItems.value.endDate.substring(0, 7)) {
        let e = await findFaCheckByDate({
          code: pageParameter.managementCode,
          date: formItems.value.endDate
        })
        isSettle.value = (null == e || e.isSettle == '1')
      }
    } else {
      formItems.value = {}
      setTableData([])
      message.success('暂无数据！')
    }
    loadMark.value = false
  }
}

import {BasicTable, useTable} from '/@/components/Table'
import {useModal} from '/@/components/Modal'
import {
  delPanDing,
  findFaAssetByCondition, findFaCheckByDate,
  findFaInvoiceByDate,
  findFaPanDianByCondition, reviewPanDing,
  savePanDing
} from "/@/api/fa/fa-pandian";
import {
  findAssetsDate,
  findAssetsUniqueCodeAndCode,
  findByAuthAssetsByUniqueCode
} from "/@/api/record/group/im-unit";
import {findDeptAll, findSupAll} from "/@/api/record/generalLedger/data";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {useRoute} from "vue-router";
import {object} from "vue-types";
// 0 暂存 1 新建 2编辑 3查看
const status = ref(3)

const CrudApi = {
  columns: [
    {
      title: '资产编码',
      dataIndex: 'cardUnique',
      ellipsis: true,
      slots: {customRender: 'cardUnique'},
      width: 150
    },
    {
      title: '资产名称',
      dataIndex: 'cardName',
      ellipsis: true,
      align: 'left',
      slots: {customRender: 'cardName'},
      width: 300
    },
    {
      title: '规格型号',
      dataIndex: 'cardType',
      ellipsis: true,
      align: 'left',
      slots: {customRender: 'cardType'},
      width: 120
    },
    {
      title: '数量',
      dataIndex: 'leftNumber',
      width: 340,
      children: [
        {
          title: '账面数量',
          dataIndex: 'bookAmount',
          key: '4-1',
          width: 120
        },
        {
          title: '实际数量',
          dataIndex: 'realityAmount',
          key: '4-2',
          slots: {customRender: 'realityAmount'},
          width: 120
        },
        {
          title: '盘点结果',
          dataIndex: 'outcome',
          key: '4-3',
          slots: {customRender: 'outcome'},
          width: 100
        },
      ],
    },
    {
      title: '存放位置',
      dataIndex: 'leftNumber2',
      width: 340,
      children: [
        {
          title: '账面数量',
          dataIndex: 'debookAmount',
          key: '5-1',
          width: 120
        },
        {
          title: '实际数量',
          dataIndex: 'derealityAmount',
          key: '5-2',
          width: 120
        },
        {
          title: '盘点结果',
          dataIndex: 'deoutcome',
          key: '5-3',
          slots: {customRender: 'deoutcome'},
          width: 100
        },
      ],
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
  columns: CrudApi.columns,
  bordered: true,
  showIndexColumn: false,
  pagination: {
    pageSize: 30,
    showSizeChanger: true,
    pageSizeOptions: ['30', '50', '100'],
    showTotal: t => `总共${t}条数据`
  },
})

const tableSelectedRowKeys = ref([])
const onSelectChange = (k, o) => {
  tableSelectedRowKeys.value = k
}

const confirm = () => {

}

const cancel = () => {

}

function showCurrentText(v, v2) {
  let text = ''
  if (!hasBlank(v + '') && (!hasBlank(v2 + ''))) {
    if (parseInt(v2) > parseInt(v)) {
      text = '盘盈'
    } else if (parseInt(v) > parseInt(v2)) {
      text = '盘亏'
    }
  }
  return text;
}

const openQpage = () => {
  if (!hasBlank(pageParameter.managementCode)) {
    openQueryPageM(true, {
      data: {
        code: pageParameter.managementCode,
        assetTypeList: assetTypeList.value,
        usageStatusList: usageStatusList.value,
        locationList: locationList.value,
        deptList: deptList.value,
        psnList: psnList.value,
        proList: proList.value,
        date: status.value == 1 ? formItems.value.endDate : '',
        assetsDate: assetsDate.value
      }
    })
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请先给该公司创建固定资产账！'
    })
  }
}
const startEdit = () => {
  if (!hasBlank(pageParameter.managementCode)) {
    status.value = 2
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请先给该公司创建固定资产账！'
    })
  }
}
const startBalance = () => {
  let tableData = getDataSource()
  if (tableData.length > 0) {
    loadMark.value = true
    tableData.forEach(o => {
      if (tableSelectedRowKeys.value.length == 0 || (tableSelectedRowKeys.value.indexOf(o.cardUnique) != -1)) {
        o.realityAmount = o.bookAmount
        o.derealityAmount = o.debookAmount
      }
    })
    setTableData(tableData)
    tableSelectedRowKeys.value = []
    loadMark.value = false
  }
}

const startDel = async () => {
  if (null == formItems.value || hasBlank(formItems.value.id)) {

  } else if (!hasBlank(formItems.value.verifyUsername) || false) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '固定资产账该月已结账或盘点单已审核不能删除！'
    })
  } else {
    if (status.value == 3) {
      createConfirm({
        iconType: 'warning',
        title: '盘点单删除',
        content: '您确定要进行盘点单删除吗!',
        onOk: async () => {
          await useRouteApi(delPanDing, {schemaName: dynamicTenantId})({id: formItems.value.id})
          message.success('删除成功！')
          formItems.value.pdId = ''
          await contentSwitch('prev')
        }
      });
    } else if (status.value == 1 || status.value == 2) {
      if (tableSelectedRowKeys.value.length == 0) {
        createErrorModal({
          iconType: 'warning',
          title: '温馨提示',
          content: '请至少选择一条资产！'
        })
      } else {
        let tables = getDataSource()
        tables = tables.filter(it => tableSelectedRowKeys.value.indexOf(it.cardUnique) == -1)
        setTableData(tables)
        tableSelectedRowKeys.value = []
      }
    }
  }
}

const startReview = async () => {
  let a = useUserStoreWidthOut().getUserInfo.username
  if (!hasBlank(a) && !hasBlank(formItems.value.id)) {
    await useRouteApi(reviewPanDing, {schemaName: dynamicTenantId})({
      id: formItems.value.id,
      verifyUsername: a
    })
    message.success('审核成功！')
    await pageReload()
  } else {
    if (hasBlank(a)) message.error('获取用户信息异常！')
  }
}

const loadMark = ref(false)
const loadPage = async (o) => {
  loadMark.value = true
  o.page = getPaginationRef()?.current
  o.size = getPaginationRef()?.pageSize
  o.code = pageParameter.managementCode
  let res = await useRouteApi(findFaAssetByCondition, {schemaName: dynamicTenantId})(o)
  setTableData([])
  if (res != null && res.items.length > 0) {
    // 是否为一次
    setTableData(res.items)
    // 底部分页信息
    setPagination({total: res.total})
    // 初始化数据
    formItems.value = {}
    formItems.value.endDate = o.expirationDate
    formItems.value.pdMethod = o.condition.choose
    formItems.value.pdRangeText = o.condition.values == null ? '全部' : getCurrRangeText(formItems.value.pdMethod, o.condition.values)
    formItems.value.pdRange = o.condition.values == null ? 'all' : o.condition.values
    // 初始化页面
    let pnum = await useRouteApi(findFaInvoiceByDate, {schemaName: dynamicTenantId})({date: o.expirationDate})
    formItems.value.pdId = pnum || `PD${o.expirationDate.replace(/\-/g, '')}0001`
    formItems.value.makerUsername = useUserStoreWidthOut().getUserInfo.username
    status.value = 1
    formItems.value.status = '1'
  }
  loadMark.value = false
}

function getCurrRangeText(v, values) {
  let str = ''
  switch (v) {
    case '1':
      assetTypeList.value.forEach(it => {
        if (values.indexOf(it.uniqueCode) != -1) str += (it.ecName + ',')
      })
      break
    case '2':
      deptList.value.forEach(it => {
        if (values.indexOf(it.uniqueCode) != -1) str += (it.ecName + ',')
      })
      break
    case '3':
      proList.value.forEach(it => {
        if (values.indexOf(it.uniqueCode) != -1) str += (it.ecName + ',')
      })
      break
    case '4':
      psnList.value.forEach(it => {
        if (values.indexOf(it.uniqueCode) != -1) str += (it.ecName + ',')
      })
      break
    case '5':
      locationList.value.forEach(it => {
        if (values.indexOf(it.uniqueCode) != -1) str += (it.ecName + ',')
      })
      break
    case '6':
      usageStatusList.value.forEach(it => {
        if (values.indexOf(it.uniqueCode) != -1) str += (it.ecName + ',')
      })
      break
  }
  return str == '' ? '全部' : str.substring(0, str.length - 1)
}

//保存验证
function saveCheck() {
  if (formItems.value.pdId == null || formItems.value.pdId == "") {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '单据编号不能为空！'
    })
    return false
  }
  if (formItems.value.pdUsername == null || formItems.value.pdUsername == "") {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '盘点人不能为空！'
    })
    return false
  }
  if (getDataSource().length == 0) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '盘点内容至少存在一条！'
    })
    return false
  }

  return true
}

//数据保存
async function saveData() {
  if (!saveCheck()) {
    return false
  }
  let data = JsonTool.parseProxy(formItems.value)
  data.beiyong5 = JsonTool.json(getDataSource())
  data.manageCode = pageParameter.managementCode
  data.status = '1'
  data.pdRange = data.pdMethod != '0' ? JsonTool.json(data.pdRange) : data.pdRange
  await useRouteApi(savePanDing, {schemaName: dynamicTenantId})(data)
  message.success('保存成功！')
  await pageReload()
  status.value = 3
}

async function giveUp() {
  if (status.value == 1) {
    await contentSwitch('first')
  } else if (status.value == 2) {
    await contentSwitch('curr')
  }
  tableSelectedRowKeys.value = []
  status.value = 3
}

async function importEntry() {
  openImportPageM(true, {
    query: {
      code: pageParameter.managementCode,
      expirationDate: formItems.value.endDate,
      condition: {choose: formItems.value.pdMethod, values: formItems.value.pdRange}
    },
    schemaName: dynamicTenantId.value
  })
}

function introduceData(list) {
  if (list.length > 0) {
    let tables = getDataSource()
    let existeds = tables.map(it => it.cardUnique)
    list.forEach(it => {
      if (existeds.indexOf(it.cardUnique) != -1) {
        tables[tables.findIndex(it2 => it2.cardUnique == it.cardUnique)].realityAmount = it.realityAmount
      } else {
        tables.push(it)
      }
    })
    setTableData(tables)
  }
}

const pandiabTypeList = [
  '按全部资产盘点',
  '按资产类别盘点',
  '按使用部门盘点',
  '按所属项目盘点',
  '按责任人盘点',
  '按存放位置盘点',
  '按使用状况盘点'
]

function formatUniqueCodeDept(uniqueCodeDept: any) {
  let str = uniqueCodeDept
  deptList.value.forEach(
    function (dept: any) {
      if (dept.uniqueCode == uniqueCodeDept) {
        str = dept.deptName
      }
    }
  )
  return str || ''
}

function formatUniqueCodeCard(uniqueCodeDept: any, key) {
  let str = uniqueCodeDept
  assetCardList.value.forEach(
    function (dept: any) {
      if (dept.cardUnique == uniqueCodeDept) {
        str = dept[key]
      }
    }
  )
  return str || ''
}


function formatUniqueCodeUser(uniqueCodeUser) {
  let str = uniqueCodeUser
  psnList.value.forEach(
    function (psn: any) {
      if (psn.id == uniqueCodeUser) {
        str = psn.psnName
      }
    }
  )
  return str || ''
}

/*打印导出*/
import {useNewPrint} from "/@/utils/boozsoft/print/print";
import {tableStyle} from "/@/store/modules/abc-print";


function printData() {
  let dataArr = getDataSource()
  if (dataArr.length == 0) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请先新增一条盘点单！'
    })
    return false;
  }
  let printList: any = []
  let isReview = !hasBlank(formItems.value.verifyUsername)
  dataArr.forEach((item, index) => {
    let item1 = {}
    item1[0] = formatUniqueCodeCard(item.cardUnique,'cardCode')
    item1[1] = formatUniqueCodeCard(item.cardUnique,'faName')
    item1[2] = formatUniqueCodeCard(item.cardUnique,'speciType')
    item1[3] = item.bookAmount
    item1[4] = isReview ? item.realityAmount : ''
    item1[5] = isReview ? showCurrentText(item.bookAmount, item.realityAmount) : ''
    item1[6] = item.debookAmount
    item1[7] = isReview ? item.derealityAmount : ''
    item1[8] = isReview ? showCurrentText(item.debookAmount, item.derealityAmount) : ''
    printList.push(item1)
  })
  let maxR = 25;
  if ((maxR - printList.length) > 0) {
    maxR = (maxR - printList.length)
    for (let i = 0; i < maxR; i++) {
      printList.push({0: '', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: ''})
    }
  }
  useNewPrint({data: ['l', 'px', 'a4', true]}, (doc) => {
    loadMark.value = false
    doc.autoTable({
      head: [['', '', '盘点单', '', '', '', '', '', ''],
        ['单据编号：' + formItems.value.pdId, '', '截止日期：' + formItems.value.endDate, '', '', '', `${isReview ? ('审核人：' + formItems.value.verifyUsername) : ''}`, '', '',],
        ['盘点方式：' + pandiabTypeList[parseInt(formItems.value.pdMethod)], '', '盘点范围：' + formItems.value.pdRangeText, '', '', '', '', '', ''],
        ['资产编码', '资产名称', '规格型号', '数量', '', '', '存放位置', '', ''],
        ['', '', '', '账面数量', '实际数量', '盘点结果', '账面数量', '实际数量', '盘点结果']],
      body: printList,
      // startY: 60,
      styles: tableStyle(),
      margin: {
        left: 25,
        top: 20,
        bottom: 20
      },
      addPageContent: (data) => {
        //data.table.finalY 表格最大可容纳y轴坐标，超出时将根据设置决定是否另取一页.在页面需要分页时出现
        let tabHeigth = data.table.height,
          tabMarginTop = data.settings.margin.top,
          tabSize = data.table.finalY - tabMarginTop,//表格最大Y轴-表格顶部距离得到每页表格的最大值
          tabMarginLeft = data.settings.margin.left;
        if (data.table.finalY)//是否分页 有分页时才有该属性finalY
          if (data.pageNumber != Math.ceil(tabHeigth / tabSize)) return;//如果需要每一页都显示页尾则注释该行代码
        //data.cursor.y ,data.cursor.x:表格最后一个单元坐标
        data.doc.setFontSize(9)
        // data.doc.setFont('fuhuiR', 'bold')
        doc.autoTableText(
          '盘点部门：' + (isReview ? formatUniqueCodeDept(formItems.value.pdDept) : ''),
          tabMarginLeft,
          data.cursor.y + 3,
          0
        );
        doc.autoTableText(
          '盘点人：' + (isReview ? formatUniqueCodeUser(formItems.value.pdUsername) : ''),
          (data.cursor.x / 4) * 1.5,
          data.cursor.y + 3,
          0
        );
        doc.autoTableText(
          '监管部门：' + (isReview ? formatUniqueCodeDept(formItems.value.pdjdDept) : ''),
          (data.cursor.x / 4) * 2.5,
          data.cursor.y + 3,
          0
        );
        doc.autoTableText(
          '监管盘点人：' + (isReview ? formatUniqueCodeUser(formItems.value.pdjdUsername) : ''),
          data.cursor.x - 70,
          data.cursor.y + 3,
          0
        );
      },
      didParseCell(data) {
        data.cell.styles.cellPadding = {top: 3, left: 2, right: 2, bottom: 2}
        data.cell.styles.fillColor = [255, 255, 255]
        data.cell.styles.fontSize = 9
        data.cell.styles.lineColor = [150, 150, 150]
        // data.cell.styles.bold = false

        if (data.section == 'head' && data.row.index == 0) {

          data.cell.styles.fontSize = 20
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.lineColor = [255, 255, 255]
          if (data.column.index == 2) {
            data.cell.styles.halign = 'center'
          }
        }
        if (data.section == 'head' && data.row.index == 1) {
          data.cell.styles.fontSize = 10
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.lineColor = [255, 255, 255]
          if (data.column.index == 0) {
            data.cell.colSpan = 2
            data.cell.styles.halign = 'left'
          } else if (data.column.index == 2) {
            // data.cell.styles.textColor = 'red'
            data.cell.styles.halign = 'left'
            data.cell.colSpan = 4
          } else if (data.column.index == 6) {
            data.cell.styles.halign = 'right'
            data.cell.colSpan = 3
          } else {
            data.cell.styles.halign = 'center'
          }
        }

        if (data.section == 'head' && data.row.index == 2) {
          data.cell.styles.fontSize = 10
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.lineColor = [255, 255, 255]
          if (data.column.index == 0) {
            data.cell.colSpan = 2
            data.cell.styles.halign = 'left'
          } else if (data.column.index == 2) {
            data.cell.colSpan = 4
            data.cell.styles.halign = 'left'
          } else if (data.column.index == 6) {
            data.cell.styles.halign = 'right'
            data.cell.colSpan = 3
          } else {
            data.cell.styles.halign = 'right'
          }
        }
        if (data.section == 'head' && data.row.index == 3) {
          data.cell.styles.fontSize = 10
          data.cell.styles.cellPadding = {top: 4, left: 2, right: 2, bottom: 3}
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.fillColor = [200, 200, 200]
          data.cell.styles.halign = 'center'
          if (data.column.index == 0 || data.column.index == 1 || data.column.index == 2) {
            data.cell.styles.valign = 'middle'
            data.cell.rowSpan = 2
          }
          if (data.column.index == 3 || data.column.index == 6) {
            data.cell.colSpan = 3
          }
        }
        if (data.section == 'head' && data.row.index == 4) {
          data.cell.styles.fontSize = 10
          data.cell.styles.cellPadding = {top: 4, left: 2, right: 2, bottom: 3}
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.fillColor = [200, 200, 200]
          data.cell.styles.halign = 'center'
        }
        if (data.section == 'body') {
          if (data.row.index % 2 == 1) {
            data.cell.styles.fillColor = [240, 240, 240]
          }
        }
      },
      columnStyles: {
        0: {cellWidth: 70, halign: 'left'},
        1: {cellWidth: 180, halign: 'left'},
        2: {cellWidth: 80, halign: 'left'},
        3: {cellWidth: 40, halign: 'center'},
        4: {cellWidth: 40, halign: 'center'},
        5: {cellWidth: 45, halign: 'center'},
        6: {cellWidth: 40, halign: 'center'},
        7: {cellWidth: 40, halign: 'center'},
        8: {cellWidth: 45, halign: 'center'},
      }
    })
  })
}

//导出Excel
import XLSX from "xlsx-js-style";
import {
  sheet_from_array_of_arrays, Workbook,
  writeExcel, defaultV
} from "/@/utils/boozsoft/excel/excel2";
import {getThisAdInfoData} from "/@/api/record/system/financial-settings";
import {useUserStore} from "/@/store/modules/user";
import {findAllProject} from "/@/api/record/system/project";

async function exportExcel() {
  let dataArr = getDataSource()
  if (dataArr.length == 0) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请先新增一条盘点单！'
    })
    return false;
  }
  let printList: any = []
  let isReview = !hasBlank(formItems.value.verifyUsername)
  dataArr.forEach((item, index) => {
    let item1 = {}
    item1[0] = formatUniqueCodeCard(item.cardUnique,'cardCode')
    item1[1] = formatUniqueCodeCard(item.cardUnique,'faName')
    item1[2] = formatUniqueCodeCard(item.cardUnique,'speciType')
    item1[3] = item.bookAmount || ''
    item1[4] = isReview ? item.realityAmount || '' : ''
    item1[5] = isReview ? showCurrentText(item.bookAmount, item.realityAmount) : ''
    item1[6] = item.debookAmount || ''
    item1[7] = isReview ? item.derealityAmount || '' : ''
    item1[8] = isReview ? showCurrentText(item.debookAmount, item.derealityAmount) : ''
    printList.push(item1)
  })
  const sheet = [
    {
      title: '盘点单',
      multiHeader: [
        ['单据编号：' + formItems.value.pdId, '', '截止日期：' + formItems.value.endDate, '', '', '', `${isReview ? ('审核人：' + formItems.value.verifyUsername) : ''}`, '', '',],
        ['盘点方式：' + pandiabTypeList[parseInt(formItems.value.pdMethod)], '', '盘点范围：' + formItems.value.pdRangeText, '', '', '', '', '', ''],
        ['资产编码', '资产名称', '规格型号', '数量', '', '', '存放位置', '', ''],
        ['', '', '', '账面数量', '实际数量', '盘点结果', '账面数量', '实际数量', '盘点结果'],
      ],
      table: printList,
      foot: ['盘点部门：' + (isReview ? formatUniqueCodeDept(formItems.value.pdDept) : ''), '盘点人：' + (isReview ? formatUniqueCodeUser(formItems.value.pdUsername) : ''),
        '', '监管盘点部门：' + (isReview ? formatUniqueCodeDept(formItems.value.pdjdDept) : ''), '', '', '监管盘点人：' + (isReview ? formatUniqueCodeUser(formItems.value.pdjdUsername) : ''), '', ''],
      keys: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      merges: ['A2:B2', 'A3:B3', 'C2:F2', 'G2:I2', 'C3:F3', 'G3:I3', 'D4:F4', 'G4:I4', "A4:A5", "B4:B5", "C4:C5"],
      sheetName: '盘点单',
      cellStyle: [
        {
          cell: 'A1',
          font: {
            name: '宋体',
            sz: 14,
            color: {rgb: "000000"},
            bold: true,
          },
          /*fill: {
          fgColor: { rgb: "ff7e00" },
        }*/
          border: {color: {rgb: "ffffff"}}
        },
      ],
      colWidth: [15, 33, 15, 8, 8, 8, 8, 8, 8]
    }
  ]
  // 处理数据前
  if (!sheet || sheet.length <= 0) {
    this.onError('Table data cannot be empty')
    return
  }
  const wb = Workbook()
  sheet.forEach((item, index) => {
    let {
      // 标题
      title,
      // 表头
      tHeader,
      // 多级表头
      multiHeader,
      // 表格数据
      table,
      // 表格底部数据
      foot,
      // 合并项
      merges,
      // 数据键值
      keys,
      // 列宽
      colWidth,
      // 表名
      sheetName,
      // 全局样式
      globalStyle,
      // 单元格样式
      cellStyle
    } = item
    sheetName = sheetName || defaultV.sheetName
    // 默认全局样式覆盖
    const dgStyle = defaultV.globalStyle
    if (globalStyle) {
      Object.keys(dgStyle).forEach(key => {
        globalStyle[key] = {...dgStyle[key], ...globalStyle[key]}
      })
    } else {
      globalStyle = dgStyle
    }
    // 处理标题格式
    if (title || title === '') {
      // 取表头、多级表头中的最大值
      const tHeaderLength = tHeader && tHeader.length || 0
      const multiHeaderLength = multiHeader && Math.max(...multiHeader.map(m => m.length)) || 0
      const titleLength = Math.max(tHeaderLength, multiHeaderLength, keys.length)
      // 第一个元素为title，剩余以空字符串填充
      title = [title].concat(Array(titleLength - 1).fill(''))
      // 处理标题的合并\
      const cell = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      let mergeSecond = 'A1'
      if (titleLength > 26) {
        const one = parseInt(titleLength / 26)
        const two = titleLength % 26
        mergeSecond = cell[one - 1] + cell[two - 1] + '1'
      } else {
        mergeSecond = cell[titleLength - 1] + '1'
      }
      const titleMerge = `A1:${mergeSecond}`
      if (!merges) {
        merges = [titleMerge]
      } else {
        if (merges.indexOf(titleMerge) === -1) {
          merges.push(titleMerge)
        }
      }
    }
    //表头对应字段
    let data = table.map(v => keys.map(j => v[j]))
    // 多级表头
    if (multiHeader) {
      // 倒序循环
      for (let i = multiHeader.length - 1; i >= 0; i--) {
        data.unshift(multiHeader[i]);
      }
    }
    tHeader && data.unshift(tHeader);
    title && data.unshift(title);
    //表格底部对应字段
    if (foot || foot === '') {
      foot && data.push(foot);
      const str1 = ('D' + data.length) + (':F' + data.length)
      const str2 = ('G' + data.length) + (':I' + data.length)
      merges.push(str1)
      merges.push(str2)
    }
    const ws = sheet_from_array_of_arrays(data);
    if (merges && merges.length > 0) {
      if (!ws['!merges']) ws['!merges'] = [];
      merges.forEach(merge => {
        ws['!merges'].push(XLSX.utils.decode_range(merge))
      })
    }
    // 如果没有列宽则自适应
    if (!colWidth) {
      // 基准比例，以12为标准
      const benchmarkRate = globalStyle.font.sz && globalStyle.font.sz / 12 || 1
      // 空字符长度
      const nullstr = 10 * benchmarkRate + 2
      // 单个中文字符长度
      const chinese = 2 * benchmarkRate
      // 单个非中文字符长度
      const nChinese = benchmarkRate
      //设置worksheet每列的最大宽度,并+2调整一点列宽
      const sheetColWidth = data.map(row => row.map(val => {
        //先判断是否为null/undefined
        if (!val) {
          return {
            'wch': nullstr
          };
        } else {
          const strArr = val.toString().split('')
          const pattern = new RegExp("[\u4E00-\u9FA5]+")
          let re = strArr.map(str => {
            // 是否为中文
            if (pattern.test(str)) {
              return chinese
            } else {
              return nChinese
            }
          })
          re = re.reduce((total, r) => total + r, 0)
          return {
            'wch': re + 2
          };
        }
      }))
      /*以第一行为初始值*/
      let result = sheetColWidth[0];
      for (let i = 1; i < sheetColWidth.length; i++) {
        for (let j = 0; j < sheetColWidth[i].length; j++) {
          if (result[j]['wch'] < sheetColWidth[i][j]['wch']) {
            result[j]['wch'] = sheetColWidth[i][j]['wch'];
          }
        }
      }
      ws['!cols'] = result;
    } else {
      ws['!cols'] = colWidth.map(i => {
        return {wch: i}
      })
    }

    // 添加工作表
    wb.SheetNames.push(sheetName);
    wb.Sheets[sheetName] = ws;
    let dataInfo = wb.Sheets[wb.SheetNames[index]];

    //全局样式
    (function () {
      Object.keys(dataInfo).forEach(i => {
        if (i == '!ref' || i == '!merges' || i == '!cols') {
        } else {
          dataInfo[i.toString()].s = globalStyle;
          const {border, font, alignment, fill} = globalStyle;
          if (i.substring(1) == '1') {
            dataInfo[i.toString()].s = {
              border: {},
              font: font || globalStyle.font,
              alignment: alignment || globalStyle.alignment,
              fill: fill || globalStyle.fill
            }
          } else if (i.substring(1) == '2') {
            dataInfo[i.toString()].s = {
              border: {},
              font: {
                name: '宋体',
                sz: 10,
                color: {rgb: "000000"},
                bold: true,
              },
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "left",
              }
            }
            if (i == 'C2') {
              dataInfo[i.toString()].s = {
                border: {},
                font: {
                  name: '宋体',
                  sz: 10,
                  color: {rgb: "000000"},
                  bold: true,
                },
                fill: fill || globalStyle.fill,
                alignment: {
                  horizontal: "left",
                }
              }
            }
            if (i == 'G2') {
              dataInfo[i.toString()].s = {
                border: {},
                font: {
                  name: '宋体',
                  sz: 10,
                  color: {rgb: "000000"},
                  bold: true,
                },
                fill: fill || globalStyle.fill,
                alignment: {
                  horizontal: "right",
                }
              }
            }
          } else if (i.substring(1) == '3') {
            dataInfo[i.toString()].s = {
              border: {},
              font: {
                name: '宋体',
                sz: 10,
                color: {rgb: "000000"},
                bold: true,
              },
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "left",
              }
            }
            if (i == 'C3') {
              dataInfo[i.toString()].s = {
                border: {},
                font: {
                  name: '宋体',
                  sz: 10,
                  color: {rgb: "000000"},
                  bold: true,
                },
                fill: fill || globalStyle.fill,
                alignment: {
                  horizontal: "left",
                }
              }
            }
          } else if (i.substring(1) == '4' || i.substring(1) == '5') {
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: {
                name: '宋体',
                sz: 10,
                color: {rgb: "000000"},
                bold: true,
              },
              alignment: alignment || globalStyle.alignment,
              fill: {fgColor: {rgb: "cccccc"}}
            }
          } else if (i.substring(0, 1) == 'A' || i.substring(0, 1) == 'C' || i.substring(0, 1) == 'B') {
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "left",
              }
            }
          } else if (i.substring(0, 1) == 'D' || i.substring(0, 1) == 'E' || i.substring(0, 1) == 'F' || i.substring(0, 1) == 'G' || i.substring(0, 1) == 'H' || i.substring(0, 1) == 'J' || i.substring(0, 1) == 'K') {
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "center",
              }
            }
          }
          if (foot.length > 0) {
            if (i.substring(1) == data.length) {
              dataInfo[i.toString()].s = {
                border: {},
                font: {
                  name: '宋体',
                  sz: 10,
                  color: {rgb: "000000"},
                  bold: true,
                },
                fill: fill || globalStyle.fill,
                alignment: {
                  horizontal: "center",
                }
              }
              if (i.substring(0, 1) == 'A') {
                dataInfo[i.toString()].s = {
                  border: {},
                  font: {
                    name: '宋体',
                    sz: 10,
                    color: {rgb: "000000"},
                    bold: true,
                  },
                  fill: fill || globalStyle.fill,
                  alignment: {
                    horizontal: "left",
                  }
                }
              }
              if (i.substring(0, 1) == 'B') {
                dataInfo[i.toString()].s = {
                  border: {},
                  font: {
                    name: '宋体',
                    sz: 10,
                    color: {rgb: "000000"},
                    bold: true,
                  },
                  fill: fill || globalStyle.fill,
                  alignment: {
                    horizontal: "right",
                  }
                }
              }
            }
          }
        }
      });
    })();


    // 单个样式
    (function () {
      if (!cellStyle || cellStyle.length <= 0) {
        return
      }
      cellStyle.forEach(s => {
        const {border, font, alignment, fill} = s;
        dataInfo[s.cell].s = {
          border: border === {} ? border : border || globalStyle.border,
          font: font || globalStyle.font,
          alignment: alignment || globalStyle.alignment,
          fill: fill || globalStyle.fill
        }
      });
    })();
  })

  const bookType = 'xlsx'
  // 类型默认为xlsx
  writeExcel(wb, bookType, '盘点单')
}
</script>
<style lang="less" scoped="scoped">
@Global-Border-Color: #c9c9c9; // 全局下划线颜色
@Global-Label-Color: #666666; // 全局#c9c9c9颜色
@Global-Comm-BcOrText-Color: #0096c7; // 全局#c9c9c9颜色
.app-container {
  padding: 10px;
  background-color: #b4c8e3;
  margin: 0;
  .app-container-top {
    background-color: #f1f1f1;
    border-radius: 5px 5px 0 0;
    padding: 10px;

    > div {
      width: 100%;
      display: inline-flex;
      justify-content: space-between;
    }

    .app-container-top-one {
      line-height: 40px;

      .act-one-d-img {
        width: 42px;
      }

      .act-one-d-left {

      }

      .act-one-d-title {
        .acto-d-title-span {
          color: @Global-Comm-BcOrText-Color;
          font-weight: bold;
          font-size: 24px;
        }
      }

      .act-one-d-btn-group {
        text-align: right;

        .actod-btn {
          color: @Global-Comm-BcOrText-Color;
          font-size: 14px;
          border-color: @Global-Border-Color;
          border-right: none;
        }

        .actod-btn-last {
          border-right: 1px solid @Global-Border-Color;
        }

        .actod-btn:hover {
          background-color: @Global-Comm-BcOrText-Color;
          color: white;
        }
      }
    }

    .app-container-top-two {
      font-size: 14px;
      line-height: 32px;

      .act-two-d-left {

      }

      .act-two-d-center {
        .acttdrd-search-select {
          width: 120px;

          :deep(.ant-select-selector) {
            border-color: @Global-Border-Color;
            border-radius: 2px 0 0 2px;
          }
        }
      }

      .act-two-d-right {
        display: inline-flex;
        justify-content: space-between;

        .acttd-right-d-search {
          .acttdrd-search-select {
            width: 120px;

            :deep(.ant-select-selector) {
              border-color: @Global-Border-Color;
              border-radius: 2px 0 0 2px;
            }
          }

          .acttdrd-search-input {
            width: 180px;
            border-radius: 0 2px 2px 0;
            border-color: @Global-Border-Color;
            border-left: none;
          }
        }

        .acttd-right-d-btns {
          margin-left: 10px;

          .acttdrd-btn {
            border-color: @Global-Border-Color;
            margin-left: 2px;
          }
        }
      }
    }
  }
  .app-container-bottom {
    background-color: white;

    .acb-head {
      .acbgead-one {
        text-align: center;
        height: 60px;
        line-height: 60px;

        .acbgead-one-triangle {
          > div:nth-of-type(1) {
            width: 0px;
            height: 0px;
            border-top: 60px solid #5141d7;
            border-right: 70px solid transparent;
            position: absolute;
          }

          > div:nth-of-type(2) {
            width: max-content;
            color: #fff;
            transform: rotate(-45deg) translateY(-2px) translateX(10px);
            position: absolute;
          }
        }

        .acbgead-one-changes {
          > span {
            cursor: pointer;
          }

          > span:hover {
            color: black;
          }
        }

        > div:nth-of-type(2) {
          display: inline-block;
          float: left;
          margin-left: 4%;
          font-weight: bold;
          font-size: 24px;
          color: #666666;
        }
      }

      .acbgead-two {
        :deep(.ant-select-selector), :deep(.ant-picker), .ant-input {
          border: none;
          border-bottom: 1px solid #c9c9c9;
          background-color: white;
          color: black;

          .ant-picker-input {
            > input {
              color: black;
            }
          }
        }

        > span {
          font-weight: bold;
          color: #666666;
          margin-left: 4%;
        }
      }
    }

    .acb-centent {
      margin: 0 4%;
    }


  }

  .status-look {
    pointer-events: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
}
</style>
<style  lang="less" scoped>
@import '/@/assets/styles/global-menu-index1.less';
</style>
