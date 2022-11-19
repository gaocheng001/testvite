<template>
  <div>

    <div class="act-one-d-btn-group" style="text-align: right;padding-right: 10px;padding-top: 7px;padding-bottom: 1px;">

      <span  style="float: left;font-size: 16px;font-weight: bold;color: rgb(0, 150, 199);">转换后明细:</span>
      <Button class="actod-btn" v-if="status == 1 || status == 2" @click="tableFt" >分摊</Button>
      <Button class="actod-btn" v-if="status == 1 || status == 2" @click="tableAdd" >插行</Button>
      <Button class="actod-btn" v-if="status == 1 || status == 2" @click="tableDel" >删行</Button>
    </div>

    <div style="clear:both"/>
    <BasicTable
      ref="tableRef1"
      :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
      :clickToRowSelect="false"
      :loading="loadMark"
      :row-selection="{ type: 'checkbox',selectedRowKeys: tableSelectedRowKeys, onChange: onSelectChange }"
      :scroll="{ x: totalColumnWidth,y: windowHeight-(150)}"
      size="small"
      @register="registerTable"
    >
      <template #cwhcode="{ record }">
        <template v-if="record.editOne">
          <Select
            v-model:value="record.tempOne"
            :default-active-first-option="false"
            :filter-option="false"
            :not-found-content="null"
            :options="ckListOptions.map(it=>({value: it.id,label: it.ckName}))"
            :show-arrow="false"
            show-search
            style="width: 82%;"
            class="cwhcode"
            @keyup.enter="focusNext(record,'cwhcode')"
          ></Select>
          <SearchOutlined @click="openSelectContent(record,'cwhcode')"/>
        </template>
        <template v-else>
          <div @click="record.tempOne=record.cwhcode,record.editOne = true;"
               :class="status == 1 || status == 2?'suspended-div':'status-look'">
            <span>{{ record.cwhcodeText }}</span>
          </div>
        </template>
      </template>
      <template #cinvode="{ record }">
        <template v-if="record.editTwo">
          <Select
            v-model:value="record.tempTwo"
            show-search
            class="cinvode"
            style="width: 82%;"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            :options="cardListOptions"
            @search="value=>handleSearch(value,'one')"
            @keyup.enter="chFocus = 'one';tempType='one';focusNext(record,'cinvode')"
          ></Select>
          <SearchOutlined @click="openSelectContent(record,'cinvode')"/>
        </template>
        <template v-else>
          <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
               @click="record.tempTwo=record.cinvode,record.editTwo = true;">
            <span class="a-table-font-arial">{{ record.cinvode }}</span>
          </div>
        </template>
      </template>
      <template #cinvodeName="{ record }">
        <template v-if="record.editEleven">
          <Select
            v-model:value="record.tempEleven"
            show-search
            style="width: 82%;"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            :options="props.cardListOptions"
            @search="value=>handleSearch(value,'two')"
            @keyup.enter="chFocus = 'two';focusNext(record,'cinvode')"
          ></Select>
          <SearchOutlined @click="openSelectContent(record,'cinvode')"/>
        </template>
        <template v-else>
          <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
               @click="record.tempEleven=record.cinvodeName,record.editEleven = true;">
            <span class="a-table-font-arial">{{ record?.cinvodeName }}</span>
          </div>
        </template>
      </template>
      <template #cinvodeBarcode="{ record }">
        <template v-if="record.editThree">
          <Select
            v-model:value="record.tempThree"
            show-search
            style="width: 82%;"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            :options="props.cardListOptions"
            @search="value=>handleSearch(value,'three')"
            @keyup.enter="chFocus = 'three';focusNext(record,'cinvode')"
          ></Select>
          <SearchOutlined @click="openSelectContent(record,'cinvode')"/>
        </template>
        <template v-else>
          <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
               @click="record.tempThree=record.cinvodeBarcode,record.editThree = true;">
            <span class="a-table-font-arial">{{ record?.cinvodeBarcode }}</span>
          </div>
        </template>
      </template>

      <template #cunitid="{ record }">
        <div>
          <span>{{cunitFormat(record.unitList,record.cunitid)}}</span>
        </div>
      </template>
      <template #cunitidF1="{ record }">
        <div v-if="record.cunitType != '1'">
          <span>{{ record.cunitidF1 }}</span>
        </div>
      </template>
      <template #cunitidF2="{ record }">
        <div v-if="record.cunitType != '1'">
          <span>{{ record.cunitidF2 }}</span>
        </div>
      </template>
      <template #baseQuantity="{ record }">
            <span class="a-table-font-arial">{{
                (record.baseQuantity == null || record.baseQuantity == 0 ? '' : parseFloat(record.baseQuantity).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }}
             </span>
      </template>
      <template #cgUnitId="{ record }" >
        <template v-if="record.editCgUnitId">
          <Select
            v-model:value="record.tempCgUnitId"
            :default-active-first-option="false"
            :filter-option="false"
            :not-found-content="null"
            style="width: 82%;"
            class="cgUnitId"
            @keyup.enter="focusNext(record,'cgUnitId')"
            @change="cgUnitIdChange(record);verifyRowXCLData(record)"
          >
            <SelectOption v-for="tem in record.unitList" :value="tem.value">
              {{ tem.title }}
            </SelectOption>
          </Select>
          <CheckOutlined @click="record.editCgUnitId = null;record.cgUnitId=record.tempCgUnitId;tableDataChange(record,'cgUnitId')"/>
        </template>
        <template v-else>
          <div @click="record.tempCgUnitId=record.cgUnitId,record.editCgUnitId = true;" :class="status == 1 || status == 2?'suspended-div':'status-look'">
            <span>{{ hasBlank(record.unitList)?null:record.unitList.filter(it => it.value == record.cgUnitId)[0]?.title}}</span>
          </div>
        </template>
      </template>
      <template #cnumber="{ record }">
        <template v-if="record?.editCnumber">
          <InputNumber v-model:value="record.tempCnumber"
                       class="cnumber"
                       :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                       :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                       style="width: 82%;"
                       @keyup.enter="focusNext(record,'cnumber');"/>
          <CheckOutlined @click="record.editCnumber = null;record.cnumber=record.tempCnumber;tableDataChange(record,'cnumber');"/>
        </template>
        <template v-else>
          <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
               @click="record.tempCnumber=record.cnumber,record.editCnumber = true;">
                    <span class="a-table-font-arial">{{
                        (record.cnumber == null ? '' : parseFloat(record.cnumber).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }}</span>
          </div>
        </template>
      </template>
      <template #price="{ record }">
        <template v-if="record?.editNine">
          <InputNumber v-model:value="record.tempNine" class="price"
                       :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                       :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                       style="width: 82%;"
                       @keyup.enter="focusNext(record,'price')"/>
          <CheckOutlined
            @click="record.editNine = null;record.price=record.tempNine;tableDataChange(record,'price')"/>
        </template>
        <template v-else>
          <div :class="record.isGive ||  status == 3?'status-look':'suspended-div'"
               @click="record.tempNine=record.price,record.editNine = true;">
         <span class="a-table-font-arial">{{
             (record.price == null ? '' : parseFloat(record.price).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
           }}</span>
          </div>
        </template>
      </template>
      <template #icost="{ record }">
        <template v-if="record?.editTen">
          <InputNumber v-model:value="record.tempTen" class="icost"
                       :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                       :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                       style="width: 82%;"
                       @keyup.enter="focusNext(record,'icost')"/>
          <CheckOutlined
            @click="record.editTen = null;record.icost=record.tempTen;tableDataChange(record,'icost')"/>
        </template>
        <template v-else>
          <div :class="record.isGive ||  status == 3?'status-look':'suspended-div'"
               @click="record.tempTen=record.icost,record.editTen = true;">
          <span class="a-table-font-arial">{{
              (record.icost == null ? '' : parseFloat(record.icost).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }}</span>
          </div>
        </template>
      </template>
      <template #fyprice="{ record }">
        <template v-if="record?.editTens">
          <InputNumber v-model:value="record.tempTens" class="fyprice"
                       :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                       :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                       style="width: 82%;"
                       @keyup.enter="focusNext(record,'fyprice')"/>
          <CheckOutlined
            @click="record.editTens = null;record.fyprice=record.tempTens;tableDataChange(record,'fyprice')"/>
        </template>
        <template v-else>
          <div :class="record.isGive ||  status == 3?'status-look':'suspended-div'"
               @click="record.tempTens=record.fyprice,record.editTens = true;">
          <span class="a-table-font-arial">{{
              (record.fyprice == null ? '' : parseFloat(record.fyprice).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }}</span>
          </div>
        </template>
      </template>
      <template #batchId="{ record }">
        <template v-if="record?.editTwelve && record.isBatch">
          <Input v-model:value="record.tempTwelve"
                 style="width: 82%;" class="batchId"
                 @keyup.enter="focusNext(record,'batchId')"/>
          <CheckOutlined @click="record.editTwelve = null;record.batchId=record.tempTwelve;"/>
        </template>
        <template v-else>
          <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
               @click="record.tempTwelve=record.batchId,record.editTwelve = true;">
            <span class="a-table-font-arial">{{ record.batchId }}</span>
          </div>
        </template>
      </template>
      <template #cmemo="{ record }">
        <template v-if="record?.editThirteen">
          <Input v-model:value="record.tempThirteen"
                 style="width: 82%;" class="cmemo"
                 @keyup.enter="focusNext(record,'cmemo')"/>
          <CheckOutlined @click="record.editThirteen = null;record.cmemo=record.tempThirteen;"/>
        </template>
        <template v-else>
          <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
               @click="record.tempThirteen=record.cmemo,record.editThirteen = true;">
            <span class="a-table-font-arial">{{ record.cmemo }}</span>
          </div>
        </template>
      </template>
      <template #dvdate="{ record }">
        <template v-if="record?.editDvdate">
          <DatePicker v-model:value="record.tempDvdate" value-format="YYYY-MM-DD"
                      class="dvdate"
                      format="YYYY-MM-DD" style="width: 82%;"
                      @openChange="(b)=>null!=record.tempDvdate && !b?focusNext(record,'dvdate'):null"/>
          <CheckOutlined @click="record.editDvdate = null;record.dvdate=record.tempDvdate;"/>
        </template>
        <template v-else>
          <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
               @click="record.tempDvdate=record.dvdate,record.editDvdate = true;">
            <span class="a-table-font-arial">{{ record.dvdate }}</span>
          </div>
        </template>
      </template>

      <template #dpdate="{ record }">
        <template v-if="record?.editDpdate">
          <DatePicker v-model:value="record.tempDpdate" value-format="YYYY-MM-DD"
                      class="dpdate"
                      format="YYYY-MM-DD" style="width: 82%;"
                      @openChange="(b)=>null!=record.tempDpdate && !b?focusNext(record,'dpdate'):null"/>
          <CheckOutlined @click="record.editDpdate = null;record.dpdate=record.tempDpdate;"/>
        </template>
        <template v-else>
          <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
               @click="record.tempDpdate=record.dpdate,record.editDpdate = true;">
            <span class="a-table-font-arial">{{ record.dpdate }}</span>
          </div>
        </template>
      </template>
      <template #bcheck="{ record }">
        {{ formatUniqueOperator(record.bcheckUser)}}
      </template>
      <template #hjicost="{ record }">

        {{ (record.icost == null ? '' : parseFloat(sumIcost(record.icost,record.fyprice)).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}}

      </template>
      <template #footer>
        <div class="nc-summary">
          <div>
            <span>合计</span>
          </div>
          <div>
            <span>数量:</span>
            <span>{{ parseFloat(formItems?.squantity|| '0').toFixed(2) }}</span>
          </div>
          <div>
            <span>金额:</span>
            <span>{{ formatData(parseFloat(formItems?.icost || '0').toFixed(2))}}</span>
          </div>
        </div>
      </template>
    </BasicTable>

    <StockCangKuModalPop @register="registerStockCangKuModalPage" @throwData="modalData"/>
    <SelectPsn @register="registerSelectPsnPage" @save="modalData"/>
    <StockInfiModalPop @register="registerStockInfoModalPage" @throwData="modalData"/>
    <BatchSelector @register="registerBatchSelectorPage" @throwData="modalData"/>
  </div>
</template>
<script setup lang="ts">
import {BasicTable, useTable} from '/@/components/Table'
import {
  Button,
  Checkbox,
  DatePicker,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Popover,
  Radio,
  Select,
  Switch,
  Table,
  Tabs,
  Tag
} from "ant-design-vue";
import {
  CheckOutlined,
  EditOutlined,
  FileSearchOutlined,
  LeftOutlined,
  PicLeftOutlined,
  PrinterOutlined,
  RightOutlined,
  SearchOutlined,
  SettingFilled,
  SortAscendingOutlined,
  SortDescendingOutlined,
  SyncOutlined,
  VerticalLeftOutlined,
  VerticalRightOutlined
} from '@ant-design/icons-vue';
import BatchSelector from "/@/views/boozsoft/stock/stock_sales_add/component/BatchNumberSelector.vue";
import StockCangKuModalPop from "/@/views/boozsoft/stock/stock_cangku/popup/stockCangKuModalPop.vue";
import StockInfiModalPop from "/@/views/boozsoft/stock/stock_info/popup/stockInfoModalPop.vue";
import {onMounted, reactive, ref, watch,inject,defineExpose,nextTick} from "vue";
import {initDynamics, assemblyDynamicColumn} from "../data";
import {useMessage} from "/@/hooks/web/useMessage";
import {hasBlank} from "/@/api/task-api/tast-bus-api";
import {useUserStore, useUserStoreWidthOut} from "/@/store/modules/user";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useRoute} from "vue-router";
import router from "/@/router";
import {GenerateDynamicColumn} from "/@/views/boozsoft/stock/stock_conversion_add/component/DynamicForm";
import {findAll as findAllJiLang, findUnitInfoList} from "/@/api/record/system/unit-mea";
import {findCunHuoAllList} from "/@/api/record/stock/stock-caigou";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {findAll as findAllPrice} from "/@/api/record/stock/stock-price";
import {findDbLanMuList} from "/@/api/record/system/accvoucher";
import {delBefore, findBillByCondition} from "/@/api/record/stock/stock-xtzhd";
import {findCangkuAllList} from "/@/api/record/system/stock-wareh";
import {JsonTool, NumberTool, ObjTool, uuid} from "/@/api/task-api/tools/universal-tools";
import {findFaAssetInfoByCode} from "/@/api/fa/fa-assets-minus";
import {useModal} from "/@/components/Modal";
import {singleUnitOfMea} from "/@/api/record/stock/stock";
import {verifyStockRowXCL} from "/@/api/record/stock/stock-currents";
import {getCkPrice} from "/@/api/record/stock/stock_cost";

const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const InputSearch = Input.Search
const SelectOption = Select.Option
const TabPane = Tabs.TabPane
const {createErrorModal, createConfirm, createWarningModal} = useMessage()
const props = defineProps(['modelValue', 'exportData','seachData','accId','dynamicAccId','dynamicYear','status','dynamicTenant','formFuns','cardListOptions','icost'])
const targetKeys = ref([])

const pageParameter = reactive({
  showRulesSize: 'MIN',
  searchConditon: {
    requirement: '',
    value: '',
  },
  type: 'XTZHCKD'
})

const visible = ref(false);
const searchConditonList = ref([])
const lanMuData = {
  'accId': 'postgres',
  'menuName': '形态转换单新增',
  'type': '列表',
  objects: '',
  username: useUserStoreWidthOut().getUserInfo.username
}

// 表格参数
const loadMark = ref(false)
const windowWidth = (document.documentElement.clientWidth - 70)
const windowHeight = (window.innerHeight - 300)
const totalColumnWidth = ref(0)

const tableRef1 = ref(null)
const userName = useUserStoreWidthOut().getUserInfo.username
const userStore = useUserStore();
// 数据库模式名称
const database = ref('');
const dynamicTenant = ref(null)
const dynamicAccId = ref(props.dynamicAccId)
const dynamicYear = ref(props.dynamicYear)
const titleContents = ['形态转换单', '形态转换单']
const titleValue = ref(0)
const formRowNum = ref(1)
const ymPeriod:any = ref(false)
const dynamicFormModel = ref([])
const formFuns = ref({
  getFormValue: () => {
  }, setFormValue: () => {
  }, getSelectMap: () => {
  }
})
const chFocus = ref('one')
const formItems: any = ref({})
const jiList = ref([])
const manyJiList = ref([])
const ckListOptions = ref([])
const operatorList = ref([])
const cardListOptions = ref([])
const assetsCardList = ref([])
const stockPriceList = ref([])
const searchList = ref([])
const CrudApi = {
  columns: [
    {
      title: '仓储位置',
      dataIndex: 'cwhcode',
      ellipsis: true,
      fixed:'left',
      slots: {customRender: 'cwhcode'},
      width: 120
    },
    {
      title: '存货编码',
      dataIndex: 'cinvode',
      ellipsis: true,
      fixed:'left',
      slots: {customRender: 'cinvode'},
      width: 120
    },
    {
      title: '存货名称',
      dataIndex: 'cinvodeName',
      ellipsis: true,
      fixed:'left',
      slots: {customRender: 'cinvodeName'},
      width: 200
    },
    {
      title: '规格型号',
      dataIndex: 'cinvodeType',
      ellipsis: true,
      fixed:'left',
      slots: {customRender: 'cinvodeType'},
      width: 120
    },
    {
      title: '计量单位',
      dataIndex: 'cgUnitId',
      ellipsis: true,
      slots: {customRender: 'cgUnitId'},
      width: 120
    },{
      title: '数量',
      dataIndex: 'cnumber',
      ellipsis: true,
      slots: {customRender: 'cnumber'},
      width: 120
    },
    {
      title: '主计量',
      dataIndex: 'cunitid',
      ellipsis: true,
      align: 'left',
      slots: {customRender: 'cunitid'},
      width: 100
    },{
      title: '主数量',
      dataIndex: 'baseQuantity',
      slots: {customRender: 'baseQuantity'},
      ellipsis: true,
      width: 80,
    },
    {
      title: '批号',
      dataIndex: 'batchId',
      ellipsis: true,
      slots: {customRender: 'batchId'},
      width: 150,
    },
    {
      title: '生产日期',
      dataIndex: 'dpdate',
      ellipsis: true,
      slots: {customRender: 'dpdate'},
      width: 150,
    },
    {
      title: '失效日期',
      dataIndex: 'dvdate',
      slots: {customRender: 'dvdate'},
      ellipsis: true,
      width: 150,
    },
    {
      title: '无税单价',
      dataIndex: 'price',
      ellipsis: true,
      slots: {customRender: 'price'},
      width: 120,
    },
    {
      title: '无税金额',
      dataIndex: 'icost',
      slots: {customRender: 'icost'},
      ellipsis: true,
      width: 120,
      align: 'right'
    },
    {
      title: '费用金额',
      dataIndex: 'fyprice',
      slots: {customRender: 'fyprice'},
      ellipsis: true,
      width: 120,
      align: 'right'
    },
    {
      title: '合计金额',
      dataIndex: 'hjicost',
      slots: {customRender: 'hjicost'},
      ellipsis: true,
      width: 120,
      align: 'right'
    },
    {
      title: '备注',
      dataIndex: 'cmemo',
      ellipsis: true,
      width: 120,
      slots: {customRender: 'cmemo'},
    },
  ],
}

// 这是示例组件
const [registerTable, {
  reload,
  getDataSource,
  setTableData,
  setPagination,
  getPaginationRef,
  getColumns,
  setColumns
}] = useTable({
  columns: CrudApi.columns,
  bordered: true,
  showIndexColumn: true,
  pagination: false,

})


const columnReload = async () => {
  dynamicFormModel.value = await GenerateDynamicColumn(props.accId) || []
  formRowNum.value = Math.ceil((dynamicFormModel.value.filter(it=>it.isShow).length/4))-1
}

const pageReload = async () => {
  await contentSwitch(formItems.value.id == null?'tail':'curr')
}

async function contentSwitch(action) {
  loadMark.value = true
  let res = await useRouteApi(findBillByCondition, {schemaName: props.accId})({
    type: pageParameter.type,
    iyear: dynamicYear.value || '2022',
    action: action,
    flgs: '1',
    curr: formFuns.value.getFormValue()?.ccode || ''
  })
  if (null != res) {
    formItems.value = JsonTool.parseProxy(res)
    res.entryList = null
    formFuns.value.setFormValue(res)
    titleValue.value = parseInt(res.bdocumStyle || 0)
    if (!hasBlank(formItems.value.entryList)) {
      let list = JsonTool.parseObj(formItems.value.entryList).map(it => resetRow(it))
      let len = list.length
      for (let i = 0; i < (7 - len); i++) {
        list.push({})
      }
      setTableData(list)
    }
    //计算数量金额总和
    let list = getDataSource()
    let a = '0.00'
    let b = '0'
    list.forEach(v=>{
      if (!hasBlank(v.icost)) {
        a = parseFloat(doadd(a, v.icost))
      }
      if (!hasBlank(v.cnumber)) {
        b = add(b, v.cnumber)
      }
    })
    formItems.value.squantity = b
    formItems.value.icost  = a
    pageParameter.searchConditon.value = ''
    searchList.value = []
    formItems.value.entryList = null
  } else {
    let list:any = []
    for (let i = 0; i < 7; i++) {
      list.push({})
    }
    setTableData(list)
    formFuns.value.setFormValue({})
    formItems.value={}
  }
  loadMark.value = false
}
async function contentSwitch2(action,curr) {
  loadMark.value = true
  let res = await useRouteApi(findBillByCondition, {schemaName: props.accId})({
    type: pageParameter.type,
    iyear: dynamicYear.value || '2022',
    action: action,
    flgs: '1',
    curr: curr || ''
  })
  if (null != res) {
    formItems.value = JsonTool.parseProxy(res)
    res.entryList = null
    formFuns.value.setFormValue(res)
    titleValue.value = parseInt(res.bdocumStyle || 0)
    if (!hasBlank(formItems.value.entryList)) {
      let list = JsonTool.parseObj(formItems.value.entryList).map(it => resetRow(it))
      let len = list.length
      for (let i = 0; i < (7 - len); i++) {
        list.push({})
      }
      setTableData(list)
    }
    //计算数量金额总和
    let list = getDataSource()
    let a = '0'
    let b = '0'
    list.forEach(v=>{
      if (!hasBlank(v.icost)) {
        a = add(a, v.icost)
      }
      if (!hasBlank(v.cnumber)) {
        b = add(b, v.cnumber)
      }
    })
    formItems.value.squantity = b
    formItems.value.icost  = a

    pageParameter.searchConditon.value = ''
    searchList.value = []
    formItems.value.entryList = null
  } else {
    let list:any = []
    for (let i = 0; i < 7; i++) {
      list.push({})
    }
    setTableData(list)
    formFuns.value.setFormValue({})
    formItems.value={}
  }
  loadMark.value = false
}
//加
function add(a, b) {
  let c, d, e;
  try {
    c = a.toString().split(".")[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split(".")[1].length;
  } catch (f) {
    d = 0;
  }
  return e = Math.pow(10, Math.max(c, d)), (a * e + b * e) / e;
}
const resetRow = (record) => {
  let o = assetsCardList.value.filter(it => it.stockNum == record.cinvode)[0]
  record['key'] = record.lineCode
  record.cinvodeName = o?.stockName || ''
  record.cinvodeType = o?.stockGgxh // 规格型号
  record.bcheck1 = o?.stockBarcode // 条形码
  record.cwhcodeText = ckListOptions.value.filter(it => it.id == record.cwhcode)[0]?.ckName

  // 计量类型
  record.cunitType = o?.stockMeasurementType ==  '单计量'?'1':'0'
  if (record.cunitType == '0'){ //
    let res =  manyJiList.value.filter(it=>it.id == o?.stockMeasurementUnit)[0]
    if (res != null) {
      record.unitInfo = res
      let list = JsonTool.parseObj(res.detail) || []
      record.unitList = list.map(it=>{it.value=it.id;it.title=it.unitName;it.ggxh='';it.txm ='';return it;})
      if (list.length > 0) {
        record.unitList[0].ggxh = o?.stockGgxh
        record.unitList[0].barcode = o?.stockBarcode
        if (list.length > 1) {
          record.unitList[1].ggxh = o?.stockUnitGgxh1
          record.unitList[1].barcode = o?.stockUnitBarcode1
          if (list.length > 2){
            record.unitList[2].ggxh = o?.stockUnitGgxh2
            record.unitList[2].barcode = o?.stockUnitBarcode2
          }
        }
      }
    }
  }else {
    let res = jiList.value.filter(it => it.id == o?.stockMeasurementUnit)
    if (null !=  res && res.length >0){
      record.unitInfo = res[0]
      record.unitList = res.map(it=>{it.value=it.id;it.title=it.unitName;it.ggxh=o?.stockGgxh;it.txm =o?.stockBarcode;return it;})
    }
  }
  record.isBatch = o?.stockPropertyBatch == '1'
  return record;
}
const assemblyName = (arr) => {
  let text = ''
  for (let i = 0; i < arr.length; i++) {

  }
  text = ckListOptions.value.filter(it=>it.id == arr[0])[0]?.ckName
  return text
}
async function reloadList() {
  ckListOptions.value = await useRouteApi(findCangkuAllList, {schemaName: props.accId})({})
  jiList.value = await useRouteApi(findAllJiLang, {schemaName: props.accId})({unitName: ''})
  manyJiList.value = await useRouteApi(findUnitInfoList, {schemaName: props.accId})({})
  assetsCardList.value = (await useRouteApi(findCunHuoAllList, {schemaName: props.accId})({date: useCompanyOperateStoreWidthOut().getLoginDate}))
  //cardListOptions.value = assetsCardList.value
  stockPriceList.value = (await useRouteApi(findAllPrice, {schemaName: props.accId})({stockClass: '0'}))
}
const dynamicColumnData = ref([])
let dynamicColumnDataCopy = []


/*start栏目设置*/

function formatUniqueJiLiang(uniqueCodeUser) {
  let str = uniqueCodeUser
  jiList.value.forEach(
    function (psn: any) {
      if (psn.id == uniqueCodeUser) {
        str = psn.unitName
      }
    }
  )
  return str || ''
}

function formatUniqueOperator(uniqueCodeUser) {
  let str = uniqueCodeUser
  operatorList.value.forEach(
    function (psn: any) {
      if (psn.id == uniqueCodeUser) {
        str = psn.realName
      }
    }
  )
  return str || ''
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


const reloadColumns = () => {
  let newA = JSON.parse(JSON.stringify(CrudApi.columns))
  newA = assemblyDynamicColumn(dynamicColumnData.value, newA)
  setColumns(newA)
  initTableWidth(newA)
  searchConditonList.value = newA
}

function combineParameters(staticList: any, dbList: any) {
  staticList.forEach(item => {
    dbList.forEach(item2 => {
      if (item.key === item2.key && item.name === item2.name) {
        item.nameNew = item2.nameNew
        item.width = parseInt(item2.width)
        item.check = item2.check == 'true'
        item.align = item2.align
      }
    })
  })
  return staticList
}
function initTableWidth(thisCs) {
  let total = 60
  thisCs.forEach(item => {
    if (item.ifShow == null || item.ifShow)
      total += parseInt(item.width)
  })
  /*  // 去除操作咧宽
    total -= 100*/
  if (total > windowWidth) {
    let f = 0
    if (visible.value) f = 260
    totalColumnWidth.value = Number(windowWidth) - f
    tableRef.value.$el.style.setProperty('width', (windowWidth + 40 - f) + 'px')
  } else {
    if (visible.value && (windowWidth - 260) < total) total -= (total - (windowWidth - 260))
    totalColumnWidth.value = total
    tableRef.value.$el.style.setProperty('width', (total + 40) + 'px')
  }
}
/*栏目设置end*/

const tableSelectedRowKeys = ref([])
const tableSelectedRowObjs = ref([])
const onSelectChange = (k, o) => {
  tableSelectedRowKeys.value = k
  tableSelectedRowObjs.value = o
}



let timeout: any;
let currentValue = '';
const handleSearch = async (val: string, type: string) => {
  if (!hasBlank(val)) {
    // 排除已存在到存货
    let filterList = getDataSource()
    await fetchs(val, type, filterList, (d: any[]) => (cardListOptions.value = d));
  }
};

async function fetchs(value: string, type: string, filterList: any, callback: any) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;

  async function fake() {
    /*let qData = {
      date: formFuns.value.getFormValue().ddate,
      type: type,
      qValue: value,
    }
    let res = await useRouteApi(findCunHuoListByCondition, {schemaName: dynamicTenantId})(qData) || []*/
    let k = type == 'one' ? 'stockNum' : type == 'three' ? 'stockBarcode' : 'stockName'
    let res = assetsCardList.value.filter(it => null != it[k] && it[k].indexOf(value) != -1)
    let data = []
    res = res.filter(it => filterList.indexOf(it.stockNum) == -1)
    res.forEach((r: any) => {
      data.push({
        value: r[type == 'one' ? 'stockNum' : type == 'three' ? 'stockBarcode' : 'stockName'],
        label: type == 'three' ? r['stockBarcode'] : (r['stockNum'] + ' ' + r['stockName']),
      });
    });
    callback(data);
  }
  timeout = setTimeout(fake, 300);
}
function formatData(data:any){
  let str = ""
  if(data != null){
    // 千分位保留2位小数
    var source = String(data).split("."); //按小数点分成2部分
    source[0] = source[0].replace( new RegExp('(\\d)(?=(\\d{3})+$)' , 'ig'), "$1,");//只将整数部分进行都好分割
    str = source.join("." );//再将小数部分合并进来
  }
  return str;
}
function sumIcost(a,b){
  if(hasBlank(a) || a == undefined){
    a = 0
  }
  if(hasBlank(b) || b == undefined){
    b = 0
  }
  return doadd(a,b) ==0?'':doadd(a,b);
}

/**
 * @param e 回车确定事件
 * @param r rowObj
 * @param c className
 * @param t mark
 */
const focusNext =  (r, c) => {
  // 得到当前临时标记
  let t = getNextMark(c, false)
  Object.keys(r).map(i => {
    if (i.startsWith('edit')) r[i] = null
  })
  r[`${c}`] = r[`temp${t}`];
  // 列表值发生变动 监听调整
  tableDataChange(r, c)
  // 查找下一个
  let list = getDataSource();
  let filters = [ 'bcheck', 'cinvodeType','cunitid',  'baseQuantity','cinvodeName','cinvodeBarcode','hjicost']
  // 要求填批号才填写
  if (!r.isBatch)filters.push('batchId')
  if (!r.isIndate)filters.push('dpdate'),filters.push('dvdate')
  let cols:any = getColumns().filter(it=>it?.title!='序号' &&  filters.indexOf(it?.dataIndex) == -1)
  let index = list.findIndex(it => it.key == r.key)
  let nextC = cols[0].dataIndex // 获取下一个列位置
  if (index == list.length - 1 && cols[cols.length - 1].dataIndex == c) { // 最后一行最后一列回车追加
    list.push({editOne: true})
    setTableData(list)
  } else {
    let cObj = cols[cols.findIndex(it => it.dataIndex == c) + 1]
    if (cObj != null) {
      nextC = cols[cols.findIndex(it => it.dataIndex == c) + 1].dataIndex
      // 的到指定位置
      let nextMark = getNextMark(nextC, false)
      r[`edit${nextMark}`] = true;
      r[`temp${nextMark}`] = r[`${nextC}`];
    } else { //之后一列时换行
      nextC = cols[0].dataIndex
      let nextMark = getNextMark(nextC, false)
      ++index
      list[index][`edit${nextMark}`] = true
      list[index][`temp${nextMark}`] = list[index][`${nextC}`];
      setTableData(list)
    }
  }
  nextTick(() => {
    let doms:any = nextC == 'batchId' || nextC == 'cmemo' ? document.getElementsByClassName(nextC)[0] : document.getElementsByClassName(nextC)[0]?.getElementsByTagName('input')[0]
    if (null != doms) doms.focus()
  })
}
const getNextMark = (c,b) => {
  let model = {
    cnumber:'Cnumber',
    cgUnitId:'CgUnitId',
    cwhcode:'One',
    cinvode:'Two',
    price:'Nine',
    icost:'Ten',
    batchId:'Twelve',
    dpdate:'Dpdate',
    dvdate:'Dvdate',
    cmemo:'Thirteen',
    baseQuantity: 'Six',
    fyprice:'Tens'
  }
  if (b) {
    // 获取下一个
    let keys = Object.keys(model)
    return model[keys[keys.findIndex(k => k == c) + 1]]
  } else {
    return model[c]
  }
}

const tempType =  ref('one')
const tableDataChange =  (r,c) => {

  if(titleValue.value != 0 && c=='cnumber' ){
    r.tempCnumber=parseFloat(r.tempCnumber) > 0?0 - (Math.abs(parseFloat(r.tempCnumber))):r.tempCnumber
    r.cnumber=r.tempCnumber
  }else if(titleValue.value != 0 && c=='icost' ){
    r.tempTen=parseFloat(r.tempTen) > 0?0 - (Math.abs(parseFloat(r.tempTen))):Math.abs(r.tempTen)
    r.icost=r.tempNine
  }

  let h = formFuns.value.getFormValue();
  if (hasBlank(r.cwhcode) && !hasBlank(h.cwhcode)){
    let cangkuInfo =  ckListOptions.value.filter(it => it.id == h.cwhcode)[0]
    if (null != cangkuInfo) {
      r['cangkuDuli'] = cangkuInfo.ckIsDuli
      if (cangkuInfo.ckIsDuli == '1') {
        r['cwhcode'] = h.cwhcode
        r['cwhcodeText'] = cangkuInfo.ckName
      }
    }
  }
  switch (c) {
    case 'batchId':
      slChange0(r)
      break;
    case 'cwhcode':
      let cangkuInfo = ckListOptions.value.filter(it => it.id == r.cwhcode)[0]
      if (null != cangkuInfo) {
        if (cangkuInfo.ckIsDuli == '1') {
          r['cwhcodeText'] = cangkuInfo.ckName
        }
      }
      break;
    case 'cinvode':
      if (chFocus.value == 'two') r.cinvodeName = r.tempEleven
      if (chFocus.value == 'three') r.cinvodeBarcode = r.tempThree
      chChange(r)
      break;
    case 'dpdate':
      r.dpdate = r.tempDpdate
      chChange(r)
      break;
    case 'dvdate':
      r.dvdate = r.tempDvdate
      chChange(r)
      break;
    case 'baseQuantity':
    case 'fyprice':
      if (!hasBlank(r.baseQuantity) && !hasBlank(r.price)) {
        let n = parseFloat(r.baseQuantity).toFixed(10)
        if (titleValue.value != 0 && n > 0) n = 0 - (Math.abs(n))
        let d = parseFloat(r.price).toFixed(10)
        //let t = parseFloat(r.fyprice).toFixed(10)
        //r.icost = parseFloat(n * d).toFixed(10)
      }
      slChange(r,c)
      break;
    case 'price':
      setTimeout(()=>{
        let list = getDataSource();
        r.flgs = '1'
        //计算数量金额总和
        let a = '0'
        let b = '0'
        list.forEach(v=>{
          if (!hasBlank(v.icost)) {
            a = add(a, v.icost)
          }
          if (!hasBlank(v.cnumber)) {
            b = add(b, v.cnumber)
          }
        })
        formItems.value.squantity = b
        formItems.value.icost  = a
      },1000)
      break;
    case 'cnumber':
      let o:any = assetsCardList.value.filter(it => tempType.value=='one'?(it.stockNum == r.cinvode) :tempType.value=='three'? (it.stockBarcode == r.bcheck1) : (it.stockName == r.cinvodeName))[0]
      r.cinvodeInfo = o
      if(r.cinvodeInfo?.stockMeasurementType=='单计量'){
        r.baseQuantity=r.cnumber
        tableDataChange(r,'price')
      }
      else{
        slChange0(r)
      }
      break;
  }
  return r;
}
const slChange0 = (r) => {
  if ( r.cunitType == '0' && r.unitInfo != null){ // 存在多计量的清空
    // 运算辅助数量
    let list = JsonTool.parseObj(r.unitInfo.detail) || []
    list=list.filter(jl=>!hasBlank(jl.unitName))
    if (list.length > 0){
      let conversionRate=list.filter(a=>a.id==r.cgUnitId)[0]?.conversionRate
      r.baseQuantity=parseFloat(r.tempCnumber)*parseFloat(conversionRate)
      r.tempSix=r.baseQuantity

      let n:any = parseFloat(r.baseQuantity).toFixed(10)
      let isnum  = (r.unitInfo.unitType == '2')
      let conversionRate1:any=0
      let conversionRate2:any=0
      if(list.length==2){
        conversionRate1=list[1]?.conversionRate
      }else if(list.length==3){
        conversionRate1=list[1]?.conversionRate
        conversionRate2=list[2]?.conversionRate
      }
      let one:any =  parseFloat(String(n/parseFloat(conversionRate1))).toFixed(10)
      let two:any =  list.length==3?parseFloat(String(n/parseFloat(conversionRate2))).toFixed(10):null
      if (isnum){ //取整数}
        r.baseQuantity = isNaN(n)?null:NumberTool.toCeil(n,2)+''
        r.subQuantity1 = isNaN(one)?null:NumberTool.toCeil(one,2)+''
        r.subQuantity2 = isNaN(two)?null:NumberTool.toCeil(two,2)+''
        r.tempSubQuantity1 = r.subQuantity1
        r.tempSubQuantity2 = r.subQuantity2
      }else {
        r.subQuantity1 = isNaN(one)?null:one+''
        r.subQuantity2 = isNaN(two)?null:two+''
        r.tempSubQuantity1 = r.subQuantity1
        r.tempSubQuantity2 = r.subQuantity2
      }
    }
    else{
      r.baseQuantity = "0.0000000000"
      r.subQuantity1 = "0.0000000000"
      r.subQuantity2 = "0.0000000000"
      r.tempSix = r.subQuantity1
      r.tempSubQuantity2 = r.subQuantity2
      r.tempSubQuantity2 = r.baseQuantity
    }
  }
  setTimeout(()=>{
    let list = getDataSource();
    r.flgs = '1'
    //计算数量金额总和
    let a = '0'
    let b = '0'
    list.forEach(v=>{
      if (!hasBlank(v.icost)) {
        a = add(a, v.icost)
      }
      if (!hasBlank(v.cnumber)) {
        b = add(b, v.cnumber)
      }
    })
    formItems.value.squantity = b
    formItems.value.icost  = a
  },1000)
}

//加
function doadd(a, b) {
  if(!a || isNaN(a)){
    a = 0
  }
  if(!b|| isNaN(b)){
    b = 0
  }
  let c, d, e;
  try {
    c = a.toString().split(".")[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split(".")[1].length;
  } catch (f) {
    d = 0;
  }
  return e = Math.pow(10, Math.max(c, d)), (a * e + b * e) / e;
}
const slChange = (r,c) => {
  if (c == 'baseQuantity' && r.cunitType == '0' && r.unitInfo != null){ // 存在多计量的清空
    // 运算辅助数量
    let list = JsonTool.parseObj(r.unitInfo.detail) || []
    if (list.length > 0){
      let n = parseFloat(r.baseQuantity).toFixed(10)
      let isnum  = (r.unitInfo.unitType == '2')
      let one =  parseFloat((n/parseFloat(list[1].conversionRate))).toFixed(10)
      let two =  null != list[2]?parseFloat((n/parseFloat(list[2].conversionRate))).toFixed(10):0
      if (isnum){ //取整数}
        r.baseQuantity = NumberTool.toCeil(n,2)+''
        r.subQuantity1 = NumberTool.toCeil(one,2)+''
        r.subQuantity2 = NumberTool.toCeil(two,2)+''
      }else {
        r.subQuantity1 = one+''
        r.subQuantity2 = two+''
      }
    }else {
      r.subQuantity1 = "0.0000000000"
      r.subQuantity2 = "0.0000000000"
    }
  }else {
    r.subQuantity1 = "0.0000000000"
    r.subQuantity2 = "0.0000000000"
  }
}
const chChange = (record) => {

  if(hasBlank(record.cwhcode)){
    message.error('请先选择仓库!')
    return
  }
  if(hasBlank(record.cinvode)){
    message.error('请先选择存货!')
    return
  }
  findByUnitList(record)
  // 校验现存量
  verifyRowXCLData(record)

}
// 按行校验存货现存量
async function verifyRowXCLData(r) {
  // 入库保存修改现存量：0可用量  1查现存量 dynamicTenant.value.target?.kcCgrkCheck=='1'?'xcl':'keyong'
  await useRouteApi(verifyStockRowXCL, {schemaName: props.accId})({
    queryType:'keyong',
    cinvode:r.cinvode,
    cwhcode:r.cwhcode,
    batchId:r.batchId,
    dpdate:r.dpdate,
    dvdate:r.dpdate,
    iyear:dynamicYear.value,
    rkBcheck:props.dynamicTenant.target?.kcCgrkCheck,
    ckBcheck:props.dynamicTenant.target?.kcXsckCheck})
    .then((t)=>{
      let conversionRate= r.unitList.filter(j=>j.value==r.cgUnitId)[0]?.conversionRate
      r.xcl=parseFloat(t/conversionRate).toFixed(2)
    })
}
const findByUnitList = async (record) => {
  let o:any = assetsCardList.value.filter(it => tempType.value=='one'?(it.stockNum == record.cinvode) :tempType.value=='three'? (it.stockBarcode == record.bcheck1) : (it.stockName == record.cinvodeName))[0]
  record.unitList=[]
  record.cinvodeInfo = o
  record.cinvodeName = o?.stockName
  record.cinvode = o?.stockNum
  record.cinvodeType = o?.stockGgxh // 规格型号
  record.bcheck1 = o?.stockBarcode // 条形码
  // 计量类型
  record.cunitType = o?.stockMeasurementType == '单计量'?'1':'0'
  record.cunitid = o?.stockUnitId // 主计量
  record.isBatch = o?.stockPropertyBatch == '1' // 批号必须输入
  record.isIndate = o?.stockIndateManage == '1' // 有效期必须输入
  if (o?.stockMeasurementType == '多计量' && !hasBlank(o?.stockMeasurementUnit)){
    let res:any =  manyJiList.value.filter(it=>it.id == o?.stockMeasurementUnit)[0]
    if (res != null){
      record.unitInfo = res
      let list = JsonTool.parseObj(res.detail) || []
      list=list.filter(jl=>!hasBlank(jl.unitName))
      if (list.length > 0){
        if(!hasBlank(o?.stockUnitName)){
          let conversionRate= list.filter(j=>j.unitName==o?.stockUnitName)[0]?.conversionRate
          record.unitList=[{title:o?.stockUnitName,value:o?.stockUnitId,ggxh:o?.stockGgxh,txm:o?.stockBarcode,conversionRate:conversionRate}]
        }
        else{
          // 可能是之前的存货档案,也可能是导入进来的
          let res:any =  manyJiList.value.filter(it=>it.id == o?.stockMeasurementUnit)[0]
          if (res != null){
            let list = JsonTool.parseObj(res.detail) || []
            list=list.filter(jl=>!hasBlank(jl.unitName))
            for (let i = 0; i < list.length; i++) {
              if(i==0){
                record.unitList.push({title:list[i].unitName,value:list[i].id,ggxh:o?.stockGgxh,txm:o?.stockBarcode})
              }else{
                record.unitList.push({title:list[i].unitName,value:list[i].id,ggxh:'',txm:''})
              }
            }
            record.cgUnitId=record.unitList[0].value
            record.tempCgUnitId=record.cgUnitId
          }
        }
        if (list.length ==2) {
          record.cunitidF1 = list[1].id
          record.rate1 = list[1].conversionRate
          if (!hasBlank(o?.stockUnitName1)) {
            record.unitList.push({
              title: o?.stockUnitName1,
              value: o?.stockUnitId1,
              ggxh: o?.stockUnitGgxh1,
              txm: o?.stockUnitBarcode1,
              conversionRate:list[1].conversionRate
            })
          }
        } else if (list.length ==3){
          record.cunitidF1 = list[1].id
          record.cunitidF2 = list[2].id
          record.rate1 = list[1]?.conversionRate
          record.rate2 = list[2]?.conversionRate
          if(!hasBlank(o?.stockUnitName2)){
            record.unitList.push({
              title: o?.stockUnitName1,
              value: o?.stockUnitId1,
              ggxh: o?.stockUnitGgxh1,
              txm: o?.stockUnitBarcode1,
              conversionRate:list[1].conversionRate
            })
            record.unitList.push({title:o?.stockUnitName2,value:o?.stockUnitId2,ggxh:o?.stockUnitGgxh2,txm:o?.stockUnitBarcode2,conversionRate:list[2].conversionRate})
          }
        }
      }
    }
  }else{
    let djl= await useRouteApi(singleUnitOfMea, {schemaName: props.accId})('')
    if(djl.length>0){
      let djlData=djl.filter(a=>a.id==o?.stockMeasurementUnit)[0]
      record.unitList.push({title:djlData?.unitName,value:djlData?.id,ggxh:o?.stockGgxh,txm:o?.stockBarcode})
      record.tempCgUnitId=djlData?.id
      record.cgUnitId=record.tempCgUnitId
    }
  }

  if(record.unitList.length>0){
    // 存货档案中采购单位
    if(hasBlank(record.cinvodeInfo.stockPurchaseUnit)){
      record.cgUnitId=record.unitList[0].value
    } else{
      let data=record.unitList.filter(a=>a.value==record.cinvodeInfo.stockPurchaseUnit)[0]
      record.cinvodeType = data?.ggxh // 规格型号
      record.bcheck1 = data?.txm // 条形码
      record.cgUnitId=record.cinvodeInfo.stockPurchaseUnit
    }
    record.tempCgUnitId=record.cgUnitId
  }
  if (!record.isBatch) findByStockPrice(record)
}

// 存货成本单价
async function findByStockPrice(data) {
  let price=await useRouteApi(getCkPrice, {schemaName: props.accId})({
    rkBcheck:props.dynamicTenant.target?.kcCgrkCheck,
    ckBcheck:props.dynamicTenant.target?.kcXsckCheck,
    stockNum:data.cinvode,
    stockCangku:data.cwhcode,
    batchId:!hasBlank(data.batchId)?data.batchId:"",
    ddate:formFuns.value.getFormValue().cwhcode,
    year:dynamicYear.value
  })
  data.tempNine=!isNaN(price)?parseFloat(price).toFixed(2):null
  data.price=data.tempNine
}

const thisEditObj = ref(null)
const thisEditType = ref('')
const [registerModalPopPage, {openModal: openMoalPopPage}] = useModal();
const [registerSelectDeptPage, {openModal: openSelectDeptPage}] = useModal()
const [registerStockCangKuModalPage, {openModal: openStockCangKuModalPage}] = useModal();
const [registerSelectPsnPage, {openModal: openSelectPsnPage}] = useModal()
const [registerXySourcePage, {openModal: openXySourcePage}] = useModal()
const [registerlySourcePage, {openModal: openLySourcePage}] = useModal()

const [registerStockInfoModalPage, {openModal: openStockInfoModalPage}] = useModal();
const [registerBatchSelectorPage, {openModal: opneBatchSelectorPage}] = useModal();
const openSelectContent = (o, type) => {
  thisEditObj.value = o
  thisEditType.value = type
  switch (type) {
    case 'cinvode':
      openStockInfoModalPage(true, {
        database: props.accId,
      })
      break;
    case 'cwhcode':
      let data = formFuns.value.getFormValue()
      openStockCangKuModalPage(true, {
        database: props.accId,
        ckIsDuli: null != o ? o['cangkuDuli'] : null,
        entity: null != o ? ckListOptions.value.filter(it => it.id == data.cwhcode)[0] : null
      })
      break;
    case 'batchId':
      opneBatchSelectorPage(true, {
        database: props.accId,
        row: o
      })
      break;
  }
}
const openHeadSelectContent = (type) => {
  thisEditType.value = type
  switch (type) {
    case 'cvencode':
      openMoalPopPage(true, {
        database: props.accId,
        accId: props.dynamicAccId,
      });
      break;
    case 'cdepcode':
      openSelectDeptPage(true, {
        dynamicTenantId: props.accId
      })
      break;
    case 'cwhcode':
      openStockCangKuModalPage(true, {
        database:props.accId,
      })
      break;
    case 'cpersoncode':
      openSelectPsnPage(true, {
        dynamicTenantId: props.accId
      })
      break;

  }
}
const modalData = (o) => {
  if (thisEditObj.value) {
    if (thisEditType.value == 'cinvode') {
      thisEditObj.value['tempTwo'] = o[0].stockNum
      thisEditObj.value['cinvodeName'] = o[0].stockName
      thisEditObj.value['cinvodeType'] = o[0].stockGgxh
      thisEditObj.value['cunitidText'] = o[0].stockUnitName
      focusNext(thisEditObj.value,thisEditType.value)
    } else if (thisEditType.value == 'batchId') {
      if (o.length == 1) {
        thisEditObj.value['tempTwelve'] = o[0].batchId
        thisEditObj.value['dpdate'] = o[0].dpdate
        thisEditObj.value['dvdate'] = o[0].dvdate
        focusNext(thisEditObj.value,thisEditType.value)
      } else {
        let arr = []
        const temp = ObjTool.dels(JsonTool.parseProxy(thisEditObj.value), ['key','editTwelve'])
        o.forEach((v)=>{
          let t = JsonTool.parseProxy(temp)
          t.key = uuid().replaceAll(/\-/g,'')
          t['batchId'] = v.batchId
          t['dpdate'] = v.dpdate
          t['dvdate'] = v.dvdate
          // 调整数量
          t['baseQuantity'] = v.outQuantity
          arr.push(tableDataChange(t, 'baseQuantity'))
        })
        let tables = getDataSource()
        let index = tables.findIndex(it => it.key == thisEditObj.value['key'])
        tables.splice(index, 1, ...arr)
        setTableData(tables)
      }
    } else {
      if (thisEditObj.value['cangkuDuli'] == '0') {
        thisEditObj.value['tempOne'] = o[0].cangkuId
        thisEditObj.value['cwhcodeInfo'] = o[0]
        thisEditObj.value['cwhcodeText'] = o[0].cangkuName
      } else {
        thisEditObj.value['tempOne'] = o[0].id
        thisEditObj.value['cwhcodeText'] = o[0].cangkuName
      }
      focusNext(thisEditObj.value,thisEditType.value)
    }
    thisEditObj.value = null
  } else {
    let e = formFuns.value.getFormValue()
    e[thisEditType.value] = thisEditType.value == 'cvencode' || thisEditType.value == 'cwhcode' ? o[0].id : thisEditType.value == 'cdepcode' ? o.uniqueCode : o.id
    formFuns.value.setFormValue(e)
  }
}
// 0 暂存 1 新建 2编辑 3查看
const status = ref(3)
const startEditTwo = async (type,b) => {
  let maxR = 7
  if (type === 'add') {
    status.value = 1
    formFuns.value = b
    let list = []
    for (let i = 0; i < maxR; i++) {
      list.push({})
    }
    setTableData(list)
  }else if(type === 'giveUp'){
    status.value = 3
  }else {
    status.value = 2
    let list = getDataSource()
    let dLen = list.length
    for (let i = 0; i < (maxR - dLen); i++) {
      list.push({})
    }
    setTableData(list)
  }
}
const cunitFormat = (list,id) => {
  if (null == list || hasBlank(id)) return id;
  let it = list.filter(it=>it.value == id)[0]
  return  null == it?id:it.title
}
const tableAdd = () => {
  if (tableSelectedRowKeys.value.length == 1) {
    let list = getDataSource()
    let selectIndex = list.findIndex(it => it.key === tableSelectedRowKeys.value[0])
    list.splice(selectIndex, 0, {})
    setTableData(list)
    tableSelectedRowKeys.value = []
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请选择插入行次！'
    })
  }
}
const tableDel = () => {
  if (tableSelectedRowKeys.value.length == 1) {
    let list = getDataSource()
    let selectIndex = list.findIndex(it => it.key === tableSelectedRowKeys.value[0])
    list.splice(selectIndex, 1)
    setTableData(list)
    //计算数量金额总和
    let a = '0'
    let b = '0'
    list.forEach(v=>{
      if (!hasBlank(v.icost)) {
        a = add(a, v.icost)
      }
      if (!hasBlank(v.cnumber)) {
        b = add(b, v.cnumber)
      }
    })
    formItems.value.squantity = b
    formItems.value.icost  = a
    tableSelectedRowKeys.value = []
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请选择删除行次！'
    })
  }
}
const tableFt = () => {
  //获取所有信息 根据总金额 数量 分摊
  let list = getDataSource().filter(it => it.cnumber != null && it.cwhcode != null && it.cinvode != null);
  let m = props.formFuns.getFormValue().fymoney
  let n = formItems.value.icost
  let sq = formItems.value.squantity
  let i = props.icost
  if(list.length > 0){
    if(list.length == 1){
      list.forEach(v=>{
        v.icost = i
        let s = parseFloat(v.icost/v.cnumber)
        v.price = Math.round(s * 100) / 100
        if(!hasBlank(v.icost)){
          v.fyprice = m
        }
      })
    }else{
      let sum = 0
      let sumf = 0
      list.forEach(v=>{
          let t = parseFloat((i*(v.cnumber/sq)))
          v.icost = Math.round(t * 100) / 100

          let p = parseFloat(v.icost/v.cnumber)
          v.price = Math.round(p * 100) / 100

          let s = parseFloat((m*(v.cnumber/sq)))
          v.fyprice = Math.round(s * 100) / 100
          sum = sum + v.icost
          sumf = sumf + v.fyprice
      })
      //分摊结束 如果转换后金额不一致 大就那最后一个金额减 小则加
      if(i != sum){
        if(i>sum){
          list[list.length-1].icost = parseFloat(list[list.length-1].icost)+(parseFloat(i)-parseFloat(sum))
        }else{
          list[list.length-1].icost = parseFloat(list[list.length-1].icost)-(parseFloat(i)-parseFloat(sum))
        }
      }

      if(m != sumf){
        if(m>sumf){
          list[list.length-1].fyprice = parseFloat(list[list.length-1].fyprice)+(parseFloat(m)-parseFloat(sumf))
        }else{
          list[list.length-1].fyprice = parseFloat(list[list.length-1].fyprice)-(parseFloat(m)-parseFloat(sumf))
        }
      }
    }

    //计算数量金额总和
    let list2 = getDataSource()
    let a = '0'
    let b = '0'
    list2.forEach(v=>{
      if (!hasBlank(v.icost)) {
        a = add(a, v.icost)
      }
      if (!hasBlank(v.cnumber)) {
        b = add(b, v.cnumber)
      }
    })
    formItems.value.squantity = b
    formItems.value.icost  = a

    let len = list.length
    for (let i = 0; i < (7 - len); i++) {
      list.push({})
    }
    setTableData(list)
  }
}

async function getTablePieceData(){
  let list = getDataSource().filter(it => !hasBlank(it.cwhcode) && !hasBlank(it.cinvode) && !hasBlank(it.cunitid) && !hasBlank(it.baseQuantity) && !hasBlank(it.icost + '') && !hasBlank(it.price + ''))
  return  list
}

/**
 * 根据主数量得到数量
 * @param r
 */
const getUnitNumberOrPrice = (r,z,i) => {
  if (r.xsUnitId == r.cunitid){
    return z
  }else {
    let c = z
    let index = r.unitList.findIndex(it => it.value == r.xsUnitId)
    if (index == 1 && r.unitList.length > 1) {
      c = i==2? (z / parseFloat(r.unitList[1].conversionRate)):(z * parseFloat(r.unitList[1].conversionRate))
    } else if (index == 2 && r.unitList.length > 2) {
      c = i==2? (z / parseFloat(r.unitList[2].conversionRate)):(z * parseFloat(r.unitList[2].conversionRate))
    }
    return c.toFixed(i)
  }
}

defineExpose({startEditTwo,getTablePieceData,pageReload,reloadList,contentSwitch2})

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
        margin: 0 5rem;
      }
    }

    .acb-centent {
      margin: 5px 4% 0;

      :deep(.nc-summary) {
        font-size: 14px;
        font-weight: bold;
        width: 100%;

        > div {
          background-color: #d8d8d8;
          padding: 5px;
          width: 15%;
          margin: 0 1px;
          display: inline-flex;
          justify-content: space-between;
        }
        > div:nth-of-type(1) {
          width: 24%;
          display: inline-block;
          text-align: center;
        }
      }
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
.lanmu-table{
  :deep(.ant-table-content){
    .ant-table-thead{
      tr{
        th{
          padding: 5px 8px !important;
          text-align: center !important;
        }
      }
    }
    .ant-table-tbody{
      tr{
        td{
          padding:0 5px !important;
          font-size: 12px !important;
          .ant-radio-button-wrapper{
            font-size: 12px;
          }
        }
      }

    }
  }
}
.suspended-div {
  width: 100%;
  height: 22px;

  .anticon-form {
    float: right;
    line-height: 22px;
    display: none;
  }
}
.suspended-div:hover {
  cursor: text;
  background-color: #e4e7e7;
  .anticon-form {
    display: block;
  }
}
</style>
<style lang="less" scoped>
@import '/@/assets/styles/global-menu-index1.less';
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
</style>
