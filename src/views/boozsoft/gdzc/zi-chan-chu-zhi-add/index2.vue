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
                  v-if="status == 3 && (!isSettle) && hasBlank(formItems.verifyUsername)">修改
          </Button>
          <Button class="actod-btn" @click="tableAdd" v-if="status == 1 || status == 2">增行</Button>
          <Button class="actod-btn" @click="startDel" v-if="status == 1 || status == 2">删行</Button>
          <Button class="actod-btn" @click="startDel"
                  v-if="status == 3 && (!isSettle) && hasBlank(formItems.verifyUsername)">删除
          </button>
          <Button class="actod-btn" @click="startReview" v-if="status == 3 && (!isSettle)">
            {{ hasBlank(formItems.verifyUsername) ? '审核' : '弃审' }}
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
          <span style="font-size: 22px;color: #0096c7;font-weight: bold;">资产处置单</span>
          <span
            style="font-size: 18px;color: red;font-weight: bold;margin-left: 5%;display: inline-block"
            v-if="!hasBlank(formItems.verifyUsername)">已审核</span><span
          v-else>&emsp;&emsp;&emsp;</span>
        </div>
        <div class="acbgead-two" :class="status == 3?'status-look':''">
          <span>处置日期：</span>
          <DatePicker :locale="localeCn" v-model:value="formItems.handleDate"
                      :disabled="status != 1"
                      :disabled-date="disabledDate"
                      placeholder="" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                      style="width: 120px"/>
          <span>单据编号：</span> <Input v-model:value="formItems.czId"
                                    style="width: 8%"/>
          <span>处置方式：</span>
          <Select style="width: 10%" v-model:value="formItems.czMethod">
            <SelectOption v-for="it in minusList" :value="it.uniqueCode"
                          :label="it.ecCode+' '+it.ecName">{{ it.ecCode + ' ' + it.ecName }}
            </SelectOption>
          </Select>
          <span>处置部门：</span> <Select style="width: 10%" v-model:value="formItems.czDept">
          <SelectOption v-for="d in deptList" :value="d.uniqueCode">
            {{ d.label }}
          </SelectOption>
        </Select>
          <span>处置人：</span> <Select style="width: 8%" v-model:value="formItems.czUser"
                                    @change="userChange">
          <SelectOption v-for="item in psnList"
                        :value="item.id">{{ item.psnName }}
          </SelectOption>
        </Select>
          <span>审核人：</span><Input :disabled="true" style="width: 7%"
                                  v-model:value="formItems.verifyUsername"/>
          <br/><br/>
        </div>
      </div>
      <div class="acb-centent">
        <!--  针对过滤框显示添加的内容高度  -->
        <!--    :class="status == 3?'status-look':''"      :rowKey="r=>r.assetsCode"-->
        <BasicTable
          ref="tableRef"
          :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
          :row-selection="{ type: 'checkbox',fixed: true,selectedRowKeys: tableSelectedRowKeys, onChange: onSelectChange }"
          :scroll="{ y: windowHeight-160 }"
          :loading="loadMark"
          size="small"
          @register="registerTable"
        >
          <template #sysId="{ record }">
            <template v-if="record?.editOne">
              <Select
                v-model:value="record.tempOne"
                show-search
                style="width: 88%;"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                :options="cardListOptions"
                @search="value=>handleSearch(value,'one')"
                @change="value=>handleChange(value,'one')"
              ></Select>
              <CheckOutlined
                @click="record.editOne = null;record.sysId=record.tempOne;rowDataGrab(record,'one');"/>
            </template>
            <template v-else>
              <span class="a-table-font-arial">{{ record.sysId }}
              <SearchOutlined v-if="status == 1 || status == 2"
                            @click="record.editOne = true;record.editTwo = null;record.editThree = null;record.tempOne=record.sysId"/></span>
            </template>
          </template>
          <template #assetsCode="{ record }">
            <template v-if="record?.editTwo">
              <Select
                v-model:value="record.tempTwo"
                show-search
                style="width: 88%;"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                :options="cardListOptions"
                @search="value=>handleSearch(value,'two')"
                @change="value=>handleChange(value,'two')"
              ></Select>
              <CheckOutlined
                @click="record.editTwo = null;record.assetsCode=record.tempTwo;rowDataGrab(record,'two');"/>
            </template>
            <template v-else>
              <span class="a-table-font-arial">{{ record.assetsCode }}
              <SearchOutlined v-if="status == 1 || status == 2"
                            @click="record.editOne = null;record.editTwo = true;record.editThree = null;record.tempTwo=record.assetsCode"/></span>
            </template>
          </template>
          <template #assetsName="{ record }">
            <template v-if="record?.editThree">
              <Select
                v-model:value="record.tempThree"
                show-search
                style="width: 92%;"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                :options="cardListOptions"
                @search="value=>handleSearch(value,'three')"
                @change="value=>handleChange(value,'three')"
              ></Select>
              <CheckOutlined
                @click="record.editThree = null;record.assetsName=record.tempThree;rowDataGrab(record,'three');"/>
            </template>
            <template v-else>
              <span>{{ record.assetsName }}
              <SearchOutlined v-if="status == 1 || status == 2"
                            @click="record.editOne = null;record.editTwo = null;record.editThree = true;record.editThree = true;record.tempThree=record.assetsName"/></span>
            </template>
          </template>
          <template #minusMethod="{ record }">
            <template v-if="record?.editFour">
              <Select v-model:value="record.tempFour" style="width: 90%;">
                <SelectOption v-for="it in minusList" :value="it.uniqueCode" :label="it.ecName">
                  {{ it.ecName }}
                </SelectOption>
              </Select>
              <CheckOutlined @click="record.editFour = null;record.minusMethod=record.tempFour;"/>
            </template>
            <template v-else>
              <span>{{ formatUniqueChuZhi(record.minusMethod) }}
              <EditOutlined v-if="status == 1 || status == 2"
                            @click="record.editFour = true;record.tempFour=record.minusMethod"/></span>
            </template>
          </template>

          <template #clearIncome="{ record }">
            <template v-if="record?.editFive">
              <InputNumber v-model:value="record.tempFive"
                           :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           style="width: 88%;"
                           @keyup.enter="record.editFive = null;record.clearIncome=record.tempFive;"/>
              <CheckOutlined @click="record.editFive = null;record.clearIncome=record.tempFive;"/>
            </template>
            <template v-else>
              <span class="a-table-font-arial">{{
                  (record.clearIncome == null ? '' : record.clearIncome + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }}
              <EditOutlined v-if="status == 1 || status == 2"
                            @click="record.editFive = true;record.tempFive=record.clearIncome"/></span>
            </template>
          </template>

          <template #clearFee="{ record }">
            <template v-if="record?.editSix">
              <InputNumber v-model:value="record.tempSix"
                           :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           style="width: 88%;"
                           @keyup.enter="record.editSix = null;record.clearFee=record.tempSix;"/>
              <CheckOutlined @click="record.editSix = null;record.clearFee=record.tempSix;"/>
            </template>
            <template v-else>
              <span
                class="a-table-font-arial">{{
                  (record.clearFee == null ? '' : record.clearFee + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }}
              <EditOutlined v-if="status == 1 || status == 2"
                            @click="record.editSix = true;record.tempSix=record.clearFee"/></span>
            </template>
          </template>
        </BasicTable>
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
} from '@ant-design/icons-vue';
import {onMounted, reactive, ref, computed, watch, onActivated, onUpdated} from "vue";
import {useMessage} from "/@/hooks/web/useMessage";
import {getCurrentAccountName, hasBlank} from "/@/api/task-api/tast-bus-api";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-GDZC.vue";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {psnFindByFlag} from "/@/api/psn/psn";

const {createErrorModal, createConfirm} = useMessage()
const {closeCurrent} = useTabs(router);
const [registerImportPage, {openModal: openImportPageM}] = useModal()
const windowHeight = (window.innerHeight - 300)
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
        formItems.value.czId = route.query.pId
        await contentSwitch('curr')
      }
    } else {
      await contentSwitch('tail')
    }
  }
}
const route = useRoute();

const pageReload = async () => {
  if (!hasBlank(pageParameter.managementCode) && !hasBlank(formItems.value.czId)) {
    await contentSwitch('curr')
  }
}
const psnList = ref([])
const deptList = ref([])
// 处置方式
const minusList = ref([])
const assetsDate = ref('')
const isSettle = ref(false) //当前年月是否记账

async function reloadList() {
  if ('' != pageParameter.managementCode){
    minusList.value = (await useRouteApi(getCutModeAllList, {schemaName: dynamicTenantId})({})).filter(it => it.isAccrual == '2' && it.bend == '1')
    psnList.value = await useRouteApi(psnFindByFlag, {schemaName: dynamicTenantId})({})
    deptList.value = await useRouteApi(findDeptAll, {schemaName: dynamicTenantId})({});
  }
}

async function contentSwitch(action) {
  if (!hasBlank(pageParameter.managementCode)) {
    loadMark.value = true
    let res = await useRouteApi(findFaChuZhiByCondition, {schemaName: dynamicTenantId})({
      code: pageParameter.managementCode,
      action: action,
      curr: formItems.value.czId
    })
    if (null != res) {
      let oldDate = formItems.value.handleDate || ''
      formItems.value = res
      if (!hasBlank(formItems.value.beiyong5)) {
        setTableData([])
        setTableData(JsonTool.parseObj(formItems.value.beiyong5))
      }
      formItems.value.beiyong5 = null
      if (oldDate.substring(0,7) != formItems.value.handleDate.substring(0,7)){
        let e = await findFaCheckByDate({code: pageParameter.managementCode, date: formItems.value.handleDate})
        isSettle.value = (null == e || e.isSettle == '1')
      }
    } else {
      message.success('暂无数据！')
    }
    loadMark.value = false
  }
}

import {BasicTable, useTable} from '/@/components/Table'
import {useModal} from '/@/components/Modal'
import {
  delChuZhi,
  findFaAssetInfoByCode, findFaAssetListByCondition,
  findFaInvoiceByDate,
  findFaChuZhiByCondition, reviewChuZhi,
  saveChuZhi
} from "/@/api/fa/fa-assets-minus";
import {
  findAssetsDate,
  findAssetsUniqueCodeAndCode,
  findByAuthAssetsByUniqueCode
} from "/@/api/record/group/im-unit";
import {findDeptAll} from "/@/api/record/generalLedger/data";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {useRoute} from "vue-router";
import {object} from "vue-types";
// 0 暂存 1 新建 2编辑 3查看
const status = ref(3)

const CrudApi = {
  columns: [
    {
      title: '系统编码',
      dataIndex: 'sysId',
      ellipsis: true,
      slots: {customRender: 'sysId'},
      width: 130
    },
    {
      title: '资产编码',
      dataIndex: 'assetsCode',
      ellipsis: true,
      slots: {customRender: 'assetsCode'},
      width: 130
    },
    {
      title: '资产名称',
      dataIndex: 'assetsName',
      ellipsis: true,
      align: 'left',
      slots: {customRender: 'assetsName'},
      width: 300
    },
    {
      title: '规格型号',
      dataIndex: 'speciType',
      ellipsis: true,
      align: 'left',
      width: 100
    },
    {
      title: '数量',
      dataIndex: 'bookAmount',
      ellipsis: true,
      width: 80,
    },
    /* {
       title: '计量单位',
       dataIndex: 'measureUnit',
       ellipsis: true,
       width: 120,
     },*/
    {
      title: '原值',
      dataIndex: 'yuanzhi',
      ellipsis: true,
      width: 120,
      align: 'right'
    },/* {
      title: '本月计提',
      dataIndex: 'jtBy',
      ellipsis: true,
      width: 120,
      align: 'right'
    },*/ {
      title: '累计折旧/摊销',
      dataIndex: 'zjLj',
      ellipsis: true,
      width: 120,
      align: 'right'
    }, {
      title: '净值',
      dataIndex: 'jingzhi',
      ellipsis: true,
      width: 120,
      align: 'right'
    },
    {
      title: '处置方式',
      dataIndex: 'minusMethod',
      ellipsis: true,
      width: 180,
      slots: {customRender: 'minusMethod'},
    }, {
      title: '清理收入',
      dataIndex: 'clearIncome',
      ellipsis: true,
      width: 140,
      slots: {customRender: 'clearIncome'},
      align: 'right'
    }, {
      title: '清理费用',
      dataIndex: 'clearFee',
      ellipsis: true,
      width: 140,
      slots: {customRender: 'clearFee'},
      align: 'right'
    }
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
const tableSelectedRowObjs = ref([])
const onSelectChange = (k, o) => {
  tableSelectedRowKeys.value = k
  tableSelectedRowObjs.value = o
}

const openQpage = async () => {
  if (!hasBlank(pageParameter.managementCode)) {
    let res = await useRouteApi(findFaInvoiceByDate, {schemaName: dynamicTenantId})({code: pageParameter.managementCode,date: assetsDate.value})
    if (null != res && !res.isError) {
      formItems.value = {id: null,makerUsername: useUserStoreWidthOut().getUserInfo.username}
      formItems.value.handleDate = res.date
      formItems.value.czId = res.code
      if (minusList.value.length > 0) {
        formItems.value.czMethod = minusList.value[0].uniqueCode
      }
      let maxR = 20
      let list = []
      for (let i = 0; i < maxR; i++) {
        list.push({minusMethod: formItems.value.czMethod})
      }
      setTableData(list)
      status.value = 1
    } else {
      createErrorModal({
        iconType: 'warning',
        title: '温馨提示',
        content: '固定资产账当前月份已结账不能进行新增操作！'
      })
    }
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请先给该公司创建固定资产账！'
    })
  }
}

const tableAdd = () => {
  let list = getDataSource()
  list.push({minusMethod: formItems.value.czMethod})
}

const startEdit = () => {
  if (!hasBlank(pageParameter.managementCode)) {
    status.value = 2
    let maxR = 20
    let list = getDataSource()
    let dLen = list.length
    for (let i = 0; i < (maxR - dLen); i++) {
      list.push({minusMethod: formItems.value.czMethod})
    }
    setTableData(list)
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请先给该公司创建固定资产账！'
    })
  }
}


const startDel = async () => {
  if (null == formItems.value || hasBlank(formItems.value.id)) {

  } else if (!hasBlank(formItems.value.verifyUsername) || false) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '固定资产账该月已结账或处置单已审核不能删除！'
    })
  } else {
    if (status.value == 3) {
      createConfirm({
        iconType: 'warning',
        title: '盘点单删除',
        content: '您确定要进行盘点单删除吗!',
        onOk: async () => {
          await useRouteApi(delChuZhi, {schemaName: dynamicTenantId})({id: formItems.value.id})
          message.success('删除成功！')
          formItems.value.czId = ''
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
        tables = tables.filter(it => tableSelectedRowObjs.value[0]?.key.indexOf(it.key) == -1)
        setTableData(tables)
        tableSelectedRowKeys.value = []
      }
    }
  }
}

const startReview = async () => {
  let a = useUserStoreWidthOut().getUserInfo.username
  if (!hasBlank(a) && !hasBlank(formItems.value.id)) {
    await useRouteApi(reviewChuZhi, {schemaName: dynamicTenantId})({
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

//保存验证
function saveCheck() {
  if (formItems.value.handleDate == null || formItems.value.handleDate == "") {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '处置时间不能为空！'
    })
    return false
  }
  if (formItems.value.czId == null || formItems.value.czId == "") {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '单据编号不能为空！'
    })
    return false
  }
  if (formItems.value.czUser == null || formItems.value.czUser == "") {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '处置人不能为空！'
    })
    return false
  }
  let list = getDataSource()
  if (list.length == 0) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '列表资产内容至少存在一条！'
    })
    return false
  } else if ((list.filter(it => !hasBlank(it.sysId) && !hasBlank(it.assetsCode) && !hasBlank(it.assetsName) && !hasBlank(it.minusMethod))).length == 0) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '列表资产内容:系统编码、资产编码和资产名称、处置方式为必选项,且必须存在一条！'
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
  data.beiyong5 = JsonTool.json((getDataSource().filter(it => !hasBlank(it.sysId) && !hasBlank(it.assetsCode) && !hasBlank(it.assetsName) && !hasBlank(it.minusMethod))))
  data.manageCode = pageParameter.managementCode
  data.status = '1'
  await useRouteApi(saveChuZhi, {schemaName: dynamicTenantId})(data)
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
    let existeds = tables.map(it => it.assetsCode)
    list.forEach(it => {
      if (existeds.indexOf(it.assetsCode) != -1) {
        tables[tables.findIndex(it2 => it2.assetsCode == it.assetsCode)].realityAmount = it.realityAmount
      } else {
        tables.push(it)
      }
    })
    setTableData(tables)
  }
}

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

function formatUniqueChuZhi(uniqueCodeUser) {
  let str = uniqueCodeUser
  minusList.value.forEach(
    function (psn: any) {
      if (psn.uniqueCode == uniqueCodeUser) {
        str = psn.ecName
      }
    }
  )
  return str || ''
}

const userChange = (v) => {
  let u = psnList.value.filter(it => it.id == v)[0]
  let ds = deptList.value.filter(it => it.uniqueCode == u.uniqueCodeDept)
  if (ds.length > 0) {
    formItems.value.czDept = ds[0].uniqueCode
  }
}
const disabledDate = (current) => {
  // 获取区间最小区间
  if (!hasBlank(formItems.value.handleDate)) {
    let variable = formItems.value.handleDate.substring(0, 7)
    let min = moment(variable + '-01', 'YYYY-MM-DD')
    let max = moment(variable, 'YYYY-MM-DD').endOf('month')
    return current < min || current > max
  }
};
const cardListOptions = ref([])
const assetsCardList = ref([])

const rowDataGrab = async (rowObj, type: string) => {
  let arr = assetsCardList.value.filter(it => (type == 'one' ? (it.sysId == rowObj.sysId) : type == 'two' ? (it.assetsCode == rowObj.assetsCode) : (it.assetsName == rowObj.assetsName)))
  if (arr.length > 0 && rowObj['assetsUniqueCode'] != arr[0].assetsUniqueCode) {
    rowObj['assetsUniqueCode'] = arr[0].assetsUniqueCode
    rowObj['sysId'] = arr[0].sysId
    rowObj['assetsCode'] = arr[0].assetsCode
    rowObj['assetsName'] = arr[0].assetsName
    // 初始化其他参数
    let res = await useRouteApi(findFaAssetInfoByCode, {schemaName: dynamicTenantId})({code: arr[0].assetsUniqueCode}) || []
    if (null != res && res.length > 0) {
      rowObj['speciType'] = res[0].speciType
      rowObj['bookAmount'] = res[0].bookAmount
      rowObj['measureUnit'] = res[0].measureUnit
      rowObj['yuanzhi'] = res[0].yuanzhi
      rowObj['jtBy'] = res[0].jtBy
      rowObj['zjLj'] = res[0].zjLj
      rowObj['jingzhi'] = res[0].jingzhi
    }
    cardListOptions.value = []
  }
}

const handleSearch = async (val: string, type: string) => {
  if (!hasBlank(val)) {
    let filterList = getDataSource().filter(it => !hasBlank(it.assetsUniqueCode)).map(it => it.assetsUniqueCode)
    await fetch(val, type, filterList, (d: any[]) => (cardListOptions.value = d));
  }
};
const handleChange = async (val: string, type: string) => {
  // await fetch(val, type,(d: any[]) => (cardListOptions.value = d));
  // 赋值
};
let timeout: any;
let currentValue = '';

async function fetch(value: string, type: string, filterList: any, callback: any) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;

  async function fake() {
    let qData = {
      code: pageParameter.managementCode,
      date: formItems.value.handleDate,
      type: type,
      qValue: value,
    }
    let res = await useRouteApi(findFaAssetListByCondition, {schemaName: dynamicTenantId})(qData) || []
    let data = []
    res = res.filter(it => filterList.indexOf(it.assetsUniqueCode) == -1)
    res.forEach((r: any) => {
      data.push({
        value: r[type == 'one' ? 'sysId' : type == 'two' ? 'assetsCode' : 'assetsName'],
        label: type == 'tow' ? (r['assetsCode'] + ' ' + r['assetsName']) : (r['sysId'] + ' ' + r['assetsName']),
      });
    });
    assetsCardList.value = res
    callback(data);
  }

  timeout = setTimeout(fake, 300);
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
    item1[0] = item.sysId
    item1[1] = item.assetsCode
    item1[2] = item.assetsName
    item1[3] = item.speciType || ''
    item1[4] = item.bookAmount || ''
    item1[5] = item.yuanzhi || ''
    item1[6] = item.zjLj || ''
    item1[7] = item.jingzhi || ''
    item1[8] = formatUniqueChuZhi(item.minusMethod)
    item1[9] = item.clearIncome || ''
    item1[10] = item.clearFee || ''
    printList.push(item1)
  })
  let maxR = 26;
  if ((maxR - printList.length) > 0) {
    maxR = (maxR - printList.length)
    for (let i = 0; i < maxR; i++) {
      printList.push({0: '', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: '', 10: ''})
    }
  }
  useNewPrint({data: ['l', 'px', 'a4', true]}, (doc) => {
    loadMark.value = false
    doc.autoTable({
      head: [
        ['资产处置单', '', '', '', '', '', '', '', '', '', '',],
        ['单据编号：' + formItems.value.czId, '', '', '处置日期：' + formItems.value.handleDate, '', '', '', '', '', '处置方式：' + formatUniqueChuZhi(formItems.value.czMethod), '', ''],
        ['系统编码', '资产编码', '资产名称', '规格型号', '数量', '原值', '累计折旧/摊销', '净值', '处置方式', '清理收入', '清理费用'],
      ],
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
          '处置部门：' + (isReview ? formatUniqueCodeDept(formItems.value.czDept) : ''),
          tabMarginLeft,
          data.cursor.y + 3,
          0
        );
        doc.autoTableText(
          '审核人：' + (isReview ? formItems.value.verifyUsername: ''),
          data.cursor.x / 2 -20,
          data.cursor.y + 3,
          0
        );
        doc.autoTableText(
          '处置人：' + (isReview ? formatUniqueCodeUser(formItems.value.czUser) : ''),
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
          if (data.column.index == 0) {
            data.cell.colSpan = 11
            data.cell.styles.halign = 'center'
          }
        }
        if (data.section == 'head' && data.row.index == 1) {
          data.cell.styles.fontSize = 10
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.lineColor = [255, 255, 255]
          if (data.column.index == 0) {
            data.cell.colSpan = 3
            data.cell.styles.halign = 'left'
          } else if (data.column.index == 3) {
            data.cell.styles.halign = 'center'
            data.cell.colSpan = 5
          } else if (data.column.index == 9) {
            data.cell.styles.halign = 'right'
            data.cell.colSpan = 3
          } else {
            data.cell.styles.halign = 'center'
          }
        }

/*        if (data.section == 'head' && data.row.index == 2) {
          data.cell.styles.fontSize = 10
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.lineColor = [255, 255, 255]
          if (data.column.index == 0) {
            data.cell.colSpan = 3
            data.cell.styles.halign = 'left'
          }/!* else if (data.column.index == 2) {
            data.cell.colSpan = 4
            data.cell.styles.halign = 'left'
          } else if (data.column.index == 6) {
            data.cell.styles.halign = 'right'
            data.cell.colSpan = 3
          }*!/ else {
            data.cell.styles.halign = 'right'
          }
        }*/
        if (data.section == 'head' && data.row.index == 2) {
          data.cell.styles.fontSize = 10
          data.cell.styles.cellPadding = {top: 4, left: 2, right: 2, bottom: 3}
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.fillColor = [200, 200, 200]
          data.cell.styles.halign = 'center'
          /*  if (data.column.index == 0 || data.column.index == 1 || data.column.index == 2) {
              data.cell.styles.valign = 'middle'
              data.cell.rowSpan = 2
            }
            if (data.column.index == 3 || data.column.index == 6) {
              data.cell.colSpan = 3
            }*/
        }
        /* if (data.section == 'head' && data.row.index == 4) {
           data.cell.styles.fontSize = 10
           data.cell.styles.cellPadding = {top: 4, left: 2, right: 2, bottom: 3}
           data.cell.styles.fontStyle = 'bold'
           data.cell.styles.fillColor = [230, 230, 230]
           data.cell.styles.halign = 'center'
         }*/
        if (data.section == 'body') {
          if (data.row.index % 2 == 1) {
            data.cell.styles.fillColor = [240, 240, 240]
          }
        }
      },
      columnStyles: {
        0: {cellWidth: 40, halign: 'left'},
        1: {cellWidth: 40, halign: 'left'},
        2: {cellWidth: 100, halign: 'left'},
        3: {cellWidth: 40, halign: 'left'},
        4: {cellWidth: 30, halign: 'center'},
        5: {cellWidth: 55, halign: 'right'},
        6: {cellWidth: 55, halign: 'right'},
        7: {cellWidth: 55, halign: 'right'},
        8: {cellWidth: 55, halign: 'left'},
        9: {cellWidth: 55, halign: 'right'},
        10: {cellWidth: 55, halign: 'right'},
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
import {getCutModeAllList} from "/@/api/record/system/fa-ac";
import moment from "moment";
import {findFaCheckByDate} from "/@/api/fa/fa-pandian";

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
    item1[0] = item.sysId
    item1[1] = item.assetsCode
    item1[2] = item.assetsName
    item1[3] = item.speciType || ''
    item1[4] = item.bookAmount || ''
    item1[5] = item.yuanzhi || ''
    item1[6] = item.zjLj || ''
    item1[7] = item.jingzhi || ''
    item1[8] = formatUniqueChuZhi(item.minusMethod)
    item1[9] = item.clearIncome || ''
    item1[10] = item.clearFee || ''
    printList.push(item1)
  })
  const sheet = [
    {
      title: '资产处置单',
      multiHeader: [
        ['单据编号：' + formItems.value.czId, '', '', '', '处置日期：' + formItems.value.handleDate, '', '', '', '', '处置方式：' + formatUniqueChuZhi(formItems.value.czMethod), '', ''],
        ['系统编码', '资产编码', '资产名称', '规格型号', '数量', '原值', '累计折旧/摊销', '净值', '处置方式', '清理收入', '清理费用']
      ],
      table: printList,
      foot: ['处置部门：' + (isReview ? formatUniqueCodeDept(formItems.value.czDept) : ''), '', '', '', '处置人：' + (isReview ? formatUniqueCodeUser(formItems.value.czUser) : ''),  '', '', '', '',`${isReview ? ('审核人：' + formItems.value.verifyUsername) : '审核人：'}` ,''],
      keys: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      merges: ['A2:C2', 'A3:C3', 'E2:G2', 'J2:K2'],
      sheetName: '资产处置单',
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
      colWidth: [10, 10, 20, 10, 8, 10, 10, 10, 15, 10, 10]
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
      const str1 = ('A' + data.length) + (':C' + data.length)
      const str2 = ('E' + data.length) + (':G' + data.length)
      const str3 = ('J' + data.length) + (':K' + data.length)
      merges.push(str1)
      merges.push(str2)
      merges.push(str3)
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
          // debugger
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
            if (i == 'E2') {
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
            }
            if (i == 'J2') {
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
          } else if (i.substring(0, 1) == 'A' || i.substring(0, 1) == 'C' || i.substring(0, 1) == 'B' || i.substring(0, 1) == 'D' || i.substring(0, 1) == 'I') {
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "left",
              }
            }
          } else if (i.substring(0, 1) == 'F' || i.substring(0, 1) == 'G' || i.substring(0, 1) == 'H' || i.substring(0, 1) == 'J' || i.substring(0, 1) == 'K') {
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "right",
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
              if (i.substring(0, 1) == 'E' || i.substring(0, 1) == 'J') {
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
  writeExcel(wb, bookType, '资产处置单')
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
