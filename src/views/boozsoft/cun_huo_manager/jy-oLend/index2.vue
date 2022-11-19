<template>
  <div class="app-container">
    <div class="app-container-top" style="background-color: #c9c7c7;">
      <div class="app-container-top-one">
        <div class="act-one-d-left" style="width: 22%;"></div>
        <div class="act-one-d-title">

        </div>
        <div class="act-one-d-btn-group">
          <Button class="actod-btn" @click="startEdit('add')" v-if="status == 3">新增</Button>
          <Button class="actod-btn" @click="saveData" v-if="status == 1 || status == 2">保存</Button>
          <Button class="actod-btn" @click="giveUp" v-if="status == 1 || status == 2">放弃</Button>
          <Button class="actod-btn" @click="startEdit('edit')"
                  v-if="status == 3">修改
          </Button>
          <Button class="actod-btn" @click="startDel"
          >删除
          </button>
          <Button class="actod-btn" @click="startReview(true)" v-if="status == 3 ">审核</button>

          <PrintTest></PrintTest>
          <Hello></Hello>
          <!--          <Button v-if="status == 3" class="actod-btn" @click="exportExcel()">导出</Button>
                    <Button v-if="status == 3" class="actod-btn" @click="printData()">打印</Button>-->
          <Button class="actod-btn actod-btn-last" @click="openHelloPopPage(true,{})">批次管理</Button>
          <Button class="actod-btn actod-btn-last" @click="hello345">获取表单数据</Button>
          <Button class="actod-btn actod-btn-last" @click="outBefore">退出</Button>
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
              placeholder="入库单号"
              style="border-left:1px solid #c9c9c9;"
            />
          </div>
          <div class="acttd-right-d-btns">
            <Button class="acttdrd-btn" @click="pageReload()">
              <SyncOutlined :style="{ fontSize: '14px' }"/>
            </Button>
            <Popover placement="bottom">
              <template #content>
                <Button style="width: 120px;margin-bottom: 2px" @click="openSetting">表头栏目设置</Button>
                <br/>
                <Popconfirm
                  ok-text="保存"
                  cancel-text="关闭"
                  @confirm="confirm"
                  @cancel="cancel">
                  <template #icon><b>栏目设置</b><br></template>
                  <template #title>
                    <div style="width: 640px">
                      <Table bordered :data-source="dynamicColumnData" :columns="dynamicColumns"
                             childrenColumnName="children" :pagination="false"
                             style="max-height: 500px;overflow-y: auto" class="lanmu-table">
                        <template #checkBox="{ text, record }">
                          <Checkbox v-model:checked="record.check" :disabled="record.isFixed"/>
                        </template>
                        <template #widthInput="{ text, record }">
                          <div class="editable-cell">
                            <div v-if="editableData[record.key]"
                                 class="editable-cell-input-wrapper">
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
                            <div v-if="editableData[record.key]"
                                 class="editable-cell-input-wrapper">
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
                  <Button style="width: 120px;margin-bottom: 2px">表体栏目设置</Button>
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
              <Button class="acttdrd-btn">
                <SettingFilled :style="{ fontSize: '14px' }"/>
              </Button>
            </Popover>
            <Popover placement="bottom"><!-- v-if="status != 3" -->
              <template #content>
                <span class="group-btn-span-special2" @click="titleValue = 0"
                      :style="titleValue===0?{backgroundColor: '#0096c7',color: 'white'}:''">
                &nbsp;蓝字入库单&ensp;<CheckOutlined
                  v-if="titleValue===0"/></span><br/>
                <span class="group-btn-span-special2" @click="titleValue = 1"
                      :style="titleValue===1?{backgroundColor: '#0096c7',color: 'white'}:''">
                &nbsp;红字入库单&ensp;<CheckOutlined
                  v-if="titleValue===1"/></span>
                <br/>
                <span class="group-btn-span-special2" @click="titleValue = 2"
                      :style="titleValue===2?{backgroundColor: '#0096c7',color: 'white'}:''">
                &nbsp;红字回冲单&ensp;<CheckOutlined
                  v-if="titleValue===2"/></span>
              </template>
              <Button class="acttdrd-btn">
                <PicLeftOutlined :style="{ fontSize: '14px' }"/>
              </Button>
            </Popover>
          </div>
        </div>
      </div>
    </div>
    <div class="app-container-bottom" :style="{height: (windowHeight+70)+'px'}">
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
          <span style="font-size: 22px;font-weight: bold;"
                :style="{color: titleValue===0?'#0096c7':'red'}">{{
              titleContents[titleValue]
            }}</span>
          <span
            style="font-size: 18px;color: red;font-weight: bold;margin-left: 5%;display: inline-block"
            v-if="!hasBlank(formItems.verifyUsername)">已审核</span><span
          v-else>&emsp;&emsp;&emsp;</span>
        </div>
        <div class="acbgead-two" :style="status == 3?{ pointerEvents: 'none'}:{}">
          <DynamicForm v-model:getFormValue="getFormValue" :datasource="dynamicFormModel" :formDataFun="formFuns"
                       :accId="dynamicTenantId" @open="openHeadSelectContent"/>
        </div>
      </div>
      <div class="acb-centent">
        <!--  针对过滤框显示添加的内容高度 :class="status == 3?'status-look':''"  -->
        <!--       :rowKey="r=>r.assetsCode"-->
        <BasicTable
          ref="tableRef"
          :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
          :clickToRowSelect="false"
          :loading="loadMark"
          :row-selection="{ type: 'checkbox',selectedRowKeys: tableSelectedRowKeys, onChange: onSelectChange }"
          :scroll="{ x: totalColumnWidth,y: windowHeight-(150 + (formRowNum*52))}"
          size="small"
          @register="registerTable"
        >
          <template #cwhcodeName="{ record }">
            <ColGrid :label="record?.cwhcodeName" :record="record">
              <CunChuPoint :record="record" :ckListOptions="ckListOptions"/>
            </ColGrid>
          </template>
          <template #cinvode="{ record }">
            <ColGrid :label="record?.cinvode" :record="record">
              <CinvodeName :record="record" :cardListOptions="cardListOptions"/>
            </ColGrid>
          </template>
          <template #cinvodeName="{ record }">
            <ColGrid :label="record?.cinvodeName" :record="record">
              <CinvodeName :record="record" :cardListOptions="cardListOptions"/>
            </ColGrid>
          </template>
          <template #cunitid="{ record }">
            <div>
              <span>{{
                  record.cunitType == '1' ? formatUniqueJiLiang(record.cunitid) : record.cunitidText
                }}</span>
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
            <template v-if="record?.editSix">
              <InputNumber v-model:value="record.tempSix"
                           class="baseQuantity"
                           :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           style="width: 82%;"
                           @keyup.enter="/*tableDataChange(record);*/focusNext(record,'baseQuantity')"/>
              <CheckOutlined
                @click="record.editSix = null;record.baseQuantity=record.tempSix;tableDataChange(record)"/>
            </template>
            <template v-else>

              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempSix=record.baseQuantity,record.editSix = true;">
                    <span class="a-table-font-arial">{{
                        (record.baseQuantity == null ? '' : parseFloat(record.baseQuantity).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }}</span>
              </div>
            </template>
          </template>
          <template #subQuantity1="{ record }">
            <span class="a-table-font-arial">{{
                (record.subQuantity1 == null ? '' : record.subQuantity1 + '').replace(/[^\d]/g, '')
              }}
             </span>
          </template>
          <template #subQuantity2="{ record }">
            <span class="a-table-font-arial">{{
                (record.subQuantity2 == null ? '' : record.subQuantity2 + '').replace(/[^\d]/g, '')
              }}
             </span>
          </template>
          <template #price="{ record }">
            <template v-if="record?.editNine">
              <InputNumber v-model:value="record.tempNine" class="price"
                           :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           style="width: 82%;"
                           @keyup.enter="focusNext(record,'price')"/>
              <CheckOutlined
                @click="record.editNine = null;record.price=record.tempNine;tableDataChange(record)"/>
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
                @click="record.editTen = null;record.icost=record.tempTen;tableDataChange(record)"/>
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
          <template #isGive="{ record }">
            <Switch v-model:checked="record.isGive" :disabled="status == 3" size="small"
                    @change="record.price=0;record.icost=0"/>
          </template>
          <template #batchId="{ record }">
            <ColGrid :label="record?.cwhcodeName" :record="record">
              <BatchId :record="record" :ckListOptions="ckListOptions"/>
            </ColGrid>
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
          <template #dpdate="{ record }">
            <template v-if="record?.editFifteen">
              <DatePicker v-model:value="record.dpdate" value-format="YYYY-MM-DD"
                          class="dvdate"
                          format="YYYY-MM-DD" style="width: 82%;"
                          @openChange="(b)=>null!=record.tempFifteen && !b?focusNext(record,'dvdate'):null"/>
              <CheckOutlined @click="record.editFifteen = null;record.dvdate=record.tempFifteen;"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempFifteen=record.dvdate,record.editFifteen = true;">
                <span class="a-table-font-arial">{{ record.dpdate }}</span>
              </div>
            </template>
          </template>

          <template #dvdate="{ record }">
            <template v-if="record?.editFifteen">
              <DatePicker v-model:value="record.tempFifteen" value-format="YYYY-MM-DD"
                          class="dvdate"
                          format="YYYY-MM-DD" style="width: 82%;"
                          @openChange="(b)=>null!=record.tempFifteen && !b?focusNext(record,'dvdate'):null"/>
              <CheckOutlined @click="record.editFifteen = null;record.dvdate=record.tempFifteen;"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempFifteen=record.dvdate,record.editFifteen = true;">
                <span class="a-table-font-arial">{{ record.dvdate }}</span>
              </div>
            </template>
          </template>
          <template #bcheck="{ record }">
            {{ formatUniqueOperator(record.bcheckUser) }}
          </template>
          <template #footer>
            <div class="nc-summary">
              <div>
                <span>合计</span>
              </div>
              <div>
                <span>数量:</span>
                <span>&ensp;{{ formItems?.squantity }}</span>
              </div>
              <div>
                <span>金额:</span>
                <span>&ensp;{{ formItems?.icost }}</span>
              </div>
              <div>
                <span>制单人:</span>
                <span>&ensp;{{ formatUniqueOperator(formItems?.cmaker) }}</span>
              </div>
              <div>
                <span>业务部门:</span>
                <span>&ensp; {{
                    formItems?.bcheck == null ? '' : formatUniqueOperator(formItems?.bcheckUser)
                  }}</span>
              </div>
            </div>
          </template>
        </BasicTable>
        <Import
          @save="introduceData"
          @register="registerImportPage"
        />
        <Query
          @query="loadPage"
          @register="registerQueryPage"
        />
      </div>
    </div>
    <SupperModalPop @throwData="modalData" @register="registerModalPopPage"/>
    <DeptModalPop @register="registerSelectDeptPage" @save="modalData"/>
    <StockCangKuModalPop @register="registerStockCangKuModalPage" @throwData="modalData"/>
    <SelectPsn @register="registerSelectPsnPage" @save="modalData"/>
    <BatchPop @register="registerHelloPopPage" @save="modalData"/>

    <StockInfiModalPop @register="registerStockInfoModalPage" @throwData="modalData"/>
  </div>
</template>

<script setup="props, {emit}" lang="ts">
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
  Tabs
} from "ant-design-vue";
import Query from "./popup/query.vue";
import Import from "./popup/import.vue";
import DynamicForm from './component/DynamicForm.vue';
import PrintTest from './print/index.vue';
import Hello from './hello/index.vue';
import ColGrid from './component/ColGrid.vue'
import CinvodeName from './component/grids/CinvodeName/index.vue'
import CunChuPoint from './component/grids/CunChuPoint/index.vue'
import BatchId from './component/grids/BatchId/index.vue'
import {
  CheckOutlined,
  EditOutlined,
  LeftOutlined,
  PicLeftOutlined,
  RightOutlined,
  SearchOutlined,
  SettingFilled,
  SortAscendingOutlined,
  SortDescendingOutlined,
  SyncOutlined,
  VerticalLeftOutlined,
  VerticalRightOutlined
} from '@ant-design/icons-vue';
import {getCurrentInstance, nextTick, onMounted, provide, reactive, ref} from "vue";
import {useMessage} from "/@/hooks/web/useMessage";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {JsonTool, ObjTool} from "/@/api/task-api/tools/universal-tools";
import {BasicTable, useTable} from '/@/components/Table'
import {useModal} from '/@/components/Modal'
import {delChuZhi, findFaAssetInfoByCode, reviewChuZhi} from "/@/api/fa/fa-assets-minus";
import BatchPop from './popup/BatchPop.vue'
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {useRoute} from "vue-router";
/**********************栏目设置**********************/
import {assemblyDynamicColumn, initDynamics} from "./data";
import {findDbLanMuList, saveLanMuList,} from '/@/api/record/system/accvoucher';
import {getCurrentAccountName, hasBlank} from "/@/api/task-api/tast-bus-api";
import {cloneDeep} from "lodash-es";
import {usePlatformsStore} from "/@/store/modules/platforms";
import {GenerateDynamicColumn} from "/@/views/boozsoft/global/stock-caigou-dh/DynamicForm";
import SupperModalPop from "/@/views/boozsoft/global/popup/supplier/modalPop.vue";
import DeptModalPop from "/@/views/boozsoft/global/popup/dept/select-dept.vue";
import StockCangKuModalPop
  from "/@/views/boozsoft/global/popup/stockCangKuModalPop.vue";
import SelectPsn from "/@/views/boozsoft/global/popup/dept/select-psn.vue";
import StockInfiModalPop from "/@/views/boozsoft/global/popup/stockInfoModalPop.vue";
import {findAll as findAllJiLang, findUnitInfoById} from "/@/api/record/system/unit-mea";
import {
  delRuKu,
  findBillByCondition,
  findBillCode,
  reviewRuKu,
  saveRuKu
} from "/@/api/record/stock/stock-ruku";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {GetStockJrjcsAll} from "/@/api/boozsoft/YinShouZhangKuan/StockJrjcs";
import CinvodeNameGrid
  from "/@/views/boozsoft/cun_huo_manager/jy-oLend/component/grids/CinvodeNameGrid.vue";

const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const InputSearch = Input.Search
const SelectOption = Select.Option
const TabPane = Tabs.TabPane

const {createErrorModal, createConfirm, createWarningModal} = useMessage()
const {closeCurrent} = useTabs(router);
const [registerQueryPage, {openModal: openQueryPageM}] = useModal()
const [registerImportPage, {openModal: openImportPageM}] = useModal()
const [registerHelloPopPage, {openModal: openHelloPopPage}] = useModal()
const windowHeight = (window.innerHeight - 300)
const dynamicTenantId = ref('')
const dynamicAccId = ref('')
const dynamicYear = ref('')
const titleContents = ['借出借用单', '采购到货单', '采购回冲单']
const titleValue = ref(0)
const formRowNum = ref(1)
const pageParameter = reactive({
  showRulesSize: 'MIN',
  searchConditon: {
    requirement: '',
    value: '',
  },
  type: 'CGDHD'
})
const changeBtns = ref({
  first: true,
  prev: true,
  next: true,
  tail: true,
})
const formItems: any = ref({})
const jiList = ref([])
const ckListOptions = ref([])
const operatorList = ref([])
const cardListOptions = ref([])
const assetsCardList = ref([])
const dynamicAdReload = async (obj) => {
  dynamicTenantId.value = obj.accountMode
  dynamicAccId.value = obj.accId
  dynamicYear.value = obj.stockYear
  await columnReload()
  await reloadList()
  resetDynamicColumnData()
}
const dynamicFormModel = ref([])
const formFuns = ref({
  getFormValue: () => {
  }, setFormValue: () => {
  }, getSelectMap: () => {
  }
})
const columnReload = async () => {
  dynamicFormModel.value = await GenerateDynamicColumn(dynamicTenantId.value) || []
  formRowNum.value = Math.ceil((dynamicFormModel.value.filter(it => it.isShow).length / 4)) - 1
}
const route = useRoute();

const pageReload = async () => {
  await contentSwitch(formItems.value.id == null ? 'tail' : 'curr')
}

async function reloadList() {
  jiList.value =[]
  assetsCardList.value = []
}

async function contentSwitch(action) {
  loadMark.value = true
  let res = await useRouteApi(findBillByCondition, {schemaName: dynamicTenantId})({
    type: pageParameter.type,
    iyear: dynamicYear.value || '2022',
    action: action,
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
      for (let i = 0; i < (25 - len); i++) {
        list.push({})
      }

    }
    formItems.value.entryList = null
  } else {
    message.success('暂无数据！')
  }
  loadMark.value = false
}

// 0 暂存 1 新建 2编辑 3查看
const status = ref(1)

const CrudApi = {
  columns: [
    {
      title: '存储位置ID',
      dataIndex: 'cwhcode',
      ellipsis: true,
      ifShow:false,
      width: 120
    },
    {
      title: '存储位置',
      dataIndex: 'cwhcodeName',
      ellipsis: true,
      slots: {customRender: 'cwhcodeName'},
      width: 120
    },
    {
      title: '条形码',
      dataIndex: '',
      ellipsis: true,
      slots: {customRender: ''},
      width: 120
    },
    {
      title: '存货编码',
      dataIndex: 'cinvode',
      ellipsis: true,
      slots: {customRender: 'cinvode'},
      width: 200
    },
    {
      title: '存货名称',
      dataIndex: 'cinvodeName',
      ellipsis: true,
      slots: {customRender: 'cinvodeName'},
      width: 120
    },
    {
      title: '规格型号',
      dataIndex: 'stockGgxh',
      ellipsis: true,
      align: 'left',
      width: 100
    },

    {
      title: '批号',
      dataIndex: 'batchId',
      slots: {customRender: 'batchId'},
      ellipsis: true,
      width: 120,
      align: 'right'
    },
    {
      title: '主计量',
      dataIndex: 'baseQuantity',
      slots: {customRender: 'baseQuantity'},
      ellipsis: true,
      width: 80,
    },
    {
      title: '数量',
      dataIndex: 'subQuantity12',
      ellipsis: true,
      slots: {customRender: 'subQuantity12'},
      align: 'left',
      width: 100
    }, {
      title: '计量1',
      dataIndex: 'subQuantity1',
      ellipsis: true,
      slots: {customRender: 'subQuantity1'},
      width: 80,
    },
    {
      title: '数量1',
      dataIndex: 'cunitidF2',
      ellipsis: true,
      align: 'left',
      slots: {customRender: 'cunitidF2'},
      width: 100
    },
    {
      title: '计量2',
      dataIndex: 'subQuantity2',
      ellipsis: true,
      slots: {customRender: 'subQuantity2'},
      width: 80,
    },
    {
      title: '数量2',
      dataIndex: 'price',
      ellipsis: true,
      slots: {customRender: 'price'},
      width: 120,
    },
    {
      title: '生产日期',
      dataIndex: 'dpdate',
      ellipsis: true,
      width: 120,
      slots: {customRender: 'dpdate'},
    },
    {
      title: '失效日期',
      dataIndex: 'dvdate',
      ellipsis: true,
      slots: {customRender: 'dvdate'},
      width: 150,
    },
    {
      title: '预计归还日期',
      dataIndex: 'asdasdsa',
      ellipsis: true,
      slots: {customRender: ''},
      width: 150,
    },

  ]
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
  pagination: {
    pageSize: 50,
    hideOnSinglePage: true,
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
  if (true) {
    openQueryPageM(true, {schemaName: dynamicTenantId.value})
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请先给该公司创建固定资产账！'
    })
  }
}

const tableAdd = () => {
  if (tableSelectedRowKeys.value.length == 1) {
    let list = getDataSource()
    let selectIndex = list.findIndex(it => it.key === tableSelectedRowKeys.value[0])
    list.splice(selectIndex, 0, {cwhcode: formFuns.value.getFormValue().cwhcode})
    // setTableData(list)
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
    // setTableData(list)
    tableSelectedRowKeys.value = []
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请选择删除行次！'
    })
  }
}

const startEdit = async (type) => {
  let maxR = 20
  if (type === 'add') {
    status.value = 1
    let date = useCompanyOperateStoreWidthOut().getLoginDate
    // 获取最新
    let code = await generateCode(date)
    formItems.value = {
      ddate: date,
      ccode: code
    }
    formFuns.value.setFormValue({
      ddate: date,
      ccode: code
    })
    let list = []
    for (let i = 0; i < maxR; i++) {
      list.push({})
    }
    // setTableData(list)
  } else {
    status.value = 2
    let list = getDataSource()
    let dLen = list.length
    for (let i = 0; i < (maxR - dLen); i++) {
      list.push({})
    }
    // setTableData(list)
  }

}

async function generateCode(date) {
  return await useRouteApi(findBillCode, {schemaName: dynamicTenantId})({
    type: pageParameter.type,
    date: date
  })
}

const startDel = async () => {
  if (null == formItems.value || hasBlank(formItems.value.id)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '暂无任何单据！'
    })
  } else {
    createConfirm({
      iconType: 'warning',
      title: '入库单删除',
      content: '您确定要进行采购入库单删除吗!',
      onOk: async () => {
        await useRouteApi(delRuKu, {schemaName: dynamicTenantId})({id: formItems.value.id})
        message.success('删除成功！')
        formItems.value.czId = ''
        await contentSwitch('tail')
      }
    });
  }
}

const startReview = async (b) => {
  let a = useUserStoreWidthOut().getUserInfo.id
  if (!hasBlank(a) && !hasBlank(formItems.value.id)) {
    await useRouteApi(reviewRuKu, {schemaName: dynamicTenantId})({
      id: formItems.value.id,
      keys: tableSelectedRowObjs.value.filter(it => null != it?.lineCode).map(it => it.lineCode),
      userId: a,
      type: b
    })
    message.success(`${b ? '审核' : '弃审'}成功！`)
    await pageReload()
  } else {
    if (hasBlank(a)) message.error('获取用户信息异常！')
  }
}

const loadMark = ref(false)
const getFormValue=ref()
//保存验证
function saveCheck(list) {
  let form = formFuns.value.getFormValue();

  if (hasBlank(form.ccode)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '入库单号不能为空！'
    })
    return false
  }

  if (hasBlank(form.ddate)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '入库时间不能为空！'
    })
    return false
  }
  if (hasBlank(form.cvencode)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '供应商不能为空！'
    })
    return false
  }
  if (list.length == 0) {
    createWarningModal({
      title: '温馨提示',
      content: '列表完整内容至少存在一条!仓库级别与存货编码为必选项,主数量、无税单价和本币无税金额为必填项,请补充完整!'
    })
    return false
  }/* else if ((list.filter(it => hasBlank(it.cunitid) || hasBlank(it.baseQuantity) || hasBlank(it.icost + '') || hasBlank(it.price + ''))).length > 0) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '列表内容:仓库级别与存货编码为必选项,主数量、无税单价和本币无税金额为必填项,请补充完整,且必须存在一条！'
    })
    return false
  }*/
  return true
}

//数据保存
async function saveData() {
  function getTableData(){
    return getDataSource().filter(it=>Object.keys(it).length!=1)
  }
  console.log(getTableData())
  // debugger
  // let id = formItems.value.id
  // formItems.value = formFuns.value.getFormValue()
  // formItems.value.id = id // 制单人
  // formItems.value.cmaker = useUserStoreWidthOut().getUserInfo.id // 制单人
  // formItems.value.billStyle = pageParameter.type // 制单人
  // formItems.value.bdocumStyle = titleValue.value == 0 ? "0" : "1" // 制单人
  // let list = getDataSource().filter(it => !hasBlank(it.cwhcode) && !hasBlank(it.cinvode) && !hasBlank(it.cunitid) && !hasBlank(it.baseQuantity) && !hasBlank(it.icost + '') && !hasBlank(it.price + ''))
  // if (saveCheck(list)) {
  //   list = list.map(it => ObjTool.dels(it, Object.keys(it).map(i => i.startsWith('edit') || i.startsWith('temp')))) //清理辅助字段
  //   list.forEach((o, i) => {  //转化
  //     o['lineCode'] = o['key']
  //     o['lineId'] = (i + 1) + ''
  //     o['isGive'] = o['isGive'] ? '1' : '0'
  //     o['cwhcode1'] = ckListOptions.value.filter(it => it.id == o['cwhcode'])[0]?.ckName || '默认仓库'
  //   })
  //   formItems.value.entryList = JsonTool.json(list)
  //   if (formItems.value?.id == null)
  //   formItems.value.ccode = await generateCode(formItems.value.ddate)
  //   await useRouteApi(saveRuKu, {schemaName: dynamicTenantId})(formItems.value)
  //   message.success('保存成功！')
  //   await pageReload()
  //   status.value = 3
  // }
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

const loadPage = (e) => {
  columnReload()
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
    // setTableData(tables)
  }
}


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
    // 排除已存在到存货
    let filterList =[] // getDataSource().filter(it => !hasBlank(it.cinvode)).map(it => it.cinvode)
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
    /*let qData = {
      date: formFuns.value.getFormValue().ddate,
      type: type,
      qValue: value,
    }
    let res = await useRouteApi(findCunHuoListByCondition, {schemaName: dynamicTenantId})(qData) || []*/
    let res = assetsCardList.value.filter(it => it[type == 'one' ? 'stockNum' : 'stockName'].indexOf(value) != -1)
    let data = []
    res = res.filter(it => filterList.indexOf(it.stockNum) == -1)
    res.forEach((r: any) => {
      data.push({
        value: r[type == 'one' ? 'stockNum' : 'stockName'],
        label: (r['stockNum'] + ' ' + r['stockName']),
      });
    });
    callback(data);
  }

  timeout = setTimeout(fake, 300);
}

const mark = usePlatformsStore().getCurrentPlatformId
const searchConditonList = ref([])
const visible = ref(false);
const windowWidth = (document.documentElement.clientWidth - (70/*+280*/))
const totalColumnWidth = ref(0)
const dynamicColumns = initDynamics().DEFAULT
const dynamicColumnData = ref([])
let dynamicColumnDataCopy = []
const editableData = reactive({});
const tableRef = ref(null)
const lanMuData = {
  'accId': 'postgres',
  'menuName': '采购单新增',
  'type': '列表',
  objects: '',
  username: useUserStoreWidthOut().getUserInfo.username
}
const confirm = (e: MouseEvent) => {
  // 询问
  createConfirm({
    iconType: 'warning',
    title: '栏目同步',
    content: '是否将刚才设置同步数据库!',
    onOk: async () => {
      // 调整数据库 列参数
      lanMuData.accId = getCurrentAccountName(false)
      lanMuData.objects = JSON.stringify(filterModifyData(dynamicColumnData.value, dynamicColumnDataCopy))
      if (lanMuData.objects == '[]') {
        createWarningModal({content: '请先做修改后再进行确认同步数据库！'})
      } else {
        saveLanMuList(lanMuData).then(res => {
          message.success("数据库同步成功！")
        })
        // 重新赋值
        dynamicColumnDataCopy = JSON.parse(JSON.stringify(dynamicColumnData.value.filter(it => it != null)))
      }
    }
  });
  // 重新获取数据
  reloadColumns()
}
const cancel = (e: MouseEvent) => {
  // 恢复默认
  dynamicColumnData.value = []
  dynamicColumnData.value = dynamicColumnDataCopy
}
const edit = (key: string) => {
  if (key.toString().indexOf('-') != -1) {
    let arr = key.split('-');
    let one = parseInt(arr[0])
    if (arr.length == 2) {
      editableData[key] = cloneDeep(dynamicColumnData.value[one].children.filter(item => key === item.key)[0]);
    } else {
      let two = parseInt(arr[1] - 1)
      editableData[key] = cloneDeep(dynamicColumnData.value[one].children[two].children.filter(item => key === item.key)[0]);
    }
  } else {
    editableData[key] = cloneDeep(dynamicColumnData.value.filter(item => key === item.key)[0]);
  }
}
const save = (key: string, min: number, max: number) => {
  editableData[key].width = editableData[key].width > max ? max : editableData[key].width < min ? min : editableData[key].width
  if (key.toString().indexOf('-') != -1) {
    let arr = key.split('-');
    let one = parseInt(arr[0])
    if (arr.length == 2) {
      Object.assign(dynamicColumnData.value[one].children.filter(item => key === item.key)[0], editableData[key]);
      Object.assign(dynamicColumnData.value[one].children.filter(item => key === item.key)[0], editableData[key]);
    } else {
      let two = parseInt(arr[1] - 1)
      Object.assign(dynamicColumnData.value[one].children[two].children.filter(item => key === item.key)[0], editableData[key]);
    }
  } else {
    Object.assign(dynamicColumnData.value.filter(item => key === item.key)[0], editableData[key]);
  }
  delete editableData[key];
}
const saveName = (key: string) => {
  if (key.toString().indexOf('-') != -1) {
    let arr = key.split('-');
    let one = parseInt(arr[0])
    if (arr.length == 2) {
      Object.assign(dynamicColumnData.value[one].children.filter(item => key === item.key)[0], editableData[key]);
      Object.assign(dynamicColumnData.value[one].children.filter(item => key === item.key)[0], editableData[key]);
    } else {
      let two = parseInt(arr[1] - 1)
      Object.assign(dynamicColumnData.value[one].children[two].children.filter(item => key === item.key)[0], editableData[key]);
    }
  } else {
    Object.assign(dynamicColumnData.value.filter(item => key === item.key)[0], editableData[key]);
  }
  delete editableData[key];
}

function filterModifyData(lanMuList: any, copyList) {
  let a = lanMuList.filter(item => {
    try {
      copyList.forEach(item2 => {
        if (item != null && item2 != null && item?.key === item2.key && item?.name == item2?.name) {
          if (item.nameNew != item2.nameNew || item.width != item2.width || item.check != item2.check || item.align != item2.align)
            throw new Error('ok')
        }
      })
      return false
    } catch (e) {
      if (e.message == 'ok') {
        return true
      } else {
        return false
      }
    }
  })
  return a;
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

const reloadColumns = () => {
  /* let a = []
   a = getColumns()*/
  // let last = a.pop()
  let newA = JSON.parse(JSON.stringify(CrudApi.columns))
  newA = assemblyDynamicColumn(dynamicColumnData.value, newA)
  // newA.push(last)
  setColumns(newA)
  initTableWidth(newA)
  searchConditonList.value = newA
}

function resetDynamicColumnData() {
  // 先从数据查询是否已经设置
  lanMuData.accId = dynamicAccId.value
  findDbLanMuList(lanMuData).then(res => {
    // 栏目列
    let dbList = res.items

    if (dbList.length > 0) {
      let statiList = initDynamics()['DATA']
      dbList = combineParameters(statiList, dbList)
      dynamicColumnData.value = dbList
      dynamicColumnDataCopy = JSON.parse(JSON.stringify(dbList.filter(it => it != null)))
    } else {
      let statiList = initDynamics()['DATA']
      dynamicColumnData.value = statiList
      dynamicColumnDataCopy = JSON.parse(JSON.stringify(statiList))
    }

    // 表格列
    reloadColumns()
    pageReload()
    ckListOptions.value = [
      {
        "id": "1512709242262523904",
        "plantFlag": null,
        "plantUnique": "",
        "ckNum": "1001",
        "ckName": "默认仓库",
        "ckAddress": "",
        "ckCity": "",
        "ckFlag": "1",
        "ckRemark": "",
        "ckNumberFlag": null,
        "ckNumber": 0,
        "ckType": "1",
        "ckGlobalAddress": "CYF12PJRRDEWC97",
        "tenantId": "bjhzzkgl-003-2022",
        "ckJwd": "",
        "ckAddress2": "",
        "ckLevel": "1476793814889926656",
        "ckPsnPhone": "",
        "country": "中国",
        "creatTime": "2022-04-09 16:29:22",
        "ckIsDuli": "1",
        "label": "默认仓库",
        "title": "1001 默认仓库",
        "value": "1512709242262523904",
        "cangkuLevelOrder": null,
        "parentId": null,
        "cangkuId": null
      }, {
        "id": "1513366491532234752",
        "plantFlag": null,
        "plantUnique": "",
        "ckNum": "cs001",
        "ckName": "测试仓库-通道",
        "ckAddress": "",
        "ckCity": "",
        "ckFlag": "1",
        "ckRemark": "",
        "ckNumberFlag": null,
        "ckNumber": 0,
        "ckType": "1",
        "ckGlobalAddress": "FVR6RP32ZM6197V",
        "tenantId": "bjhzzkgl-003-2022",
        "ckJwd": "",
        "ckAddress2": "",
        "ckLevel": "1478202202672730112",
        "ckPsnPhone": "",
        "country": "中国",
        "creatTime": "2022-04-11 12:01:03",
        "ckIsDuli": "0",
        "label": "测试仓库-通道",
        "title": "cs001 测试仓库-通道",
        "value": "1513366491532234752",
        "cangkuLevelOrder": null,
        "parentId": null,
        "cangkuId": null
      }, {
        "id": "1513366580531171328",
        "plantFlag": null,
        "plantUnique": "",
        "ckNum": "cs002",
        "ckName": "测试仓库-库位",
        "ckAddress": "",
        "ckCity": "",
        "ckFlag": "1",
        "ckRemark": "",
        "ckNumberFlag": null,
        "ckNumber": 0,
        "ckType": "1",
        "ckGlobalAddress": "DY9XDFL6ULEX1LY",
        "tenantId": "bjhzzkgl-003-2022",
        "ckJwd": "",
        "ckAddress2": "",
        "ckLevel": "1478202277012574208",
        "ckPsnPhone": "",
        "country": "中国",
        "creatTime": "2022-04-11 12:01:24",
        "ckIsDuli": "0",
        "label": "测试仓库-库位",
        "title": "cs002 测试仓库-库位",
        "value": "1513366580531171328",
        "cangkuLevelOrder": null,
        "parentId": null,
        "cangkuId": null
      }, {
        "id": "1513366659585413120",
        "plantFlag": null,
        "plantUnique": "",
        "ckNum": "cs003",
        "ckName": "测试仓库-通道-货架",
        "ckAddress": "",
        "ckCity": "",
        "ckFlag": "1",
        "ckRemark": "",
        "ckNumberFlag": null,
        "ckNumber": 0,
        "ckType": "1",
        "ckGlobalAddress": "CQR5QG23N6ZBT3J",
        "tenantId": "bjhzzkgl-003-2022",
        "ckJwd": "",
        "ckAddress2": "",
        "ckLevel": "1478202252110991360",
        "ckPsnPhone": "",
        "country": "中国",
        "creatTime": "2022-04-11 12:01:43",
        "ckIsDuli": "0",
        "label": "测试仓库-通道-货架",
        "title": "cs003 测试仓库-通道-货架",
        "value": "1513366659585413120",
        "cangkuLevelOrder": null,
        "parentId": null,
        "cangkuId": null
      }, {
        "id": "1513366783896195072",
        "plantFlag": null,
        "plantUnique": "",
        "ckNum": "cs004",
        "ckName": "测试仓库-通道-货架-库位",
        "ckAddress": "",
        "ckCity": "",
        "ckFlag": "1",
        "ckRemark": "",
        "ckNumberFlag": null,
        "ckNumber": 0,
        "ckType": "1",
        "ckGlobalAddress": "FTOO6S95NORJLUB",
        "tenantId": "bjhzzkgl-003-2022",
        "ckJwd": "",
        "ckAddress2": "",
        "ckLevel": "1478202374869880832",
        "ckPsnPhone": "",
        "country": "中国",
        "creatTime": "2022-04-11 12:02:12",
        "ckIsDuli": "0",
        "label": "测试仓库-通道-货架-库位",
        "title": "cs004 测试仓库-通道-货架-库位",
        "value": "1513366783896195072",
        "cangkuLevelOrder": null,
        "parentId": null,
        "cangkuId": null
      }]
    // operatorList.value = formFuns.value.getSelectMap()['operator']
  })
}
provide('ckListOptions',ckListOptions)

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

const openSetting = () => {
  openQueryPageM(true, {schemaName: dynamicTenantId.value})
}
/*栏目设置end*/
const formEtcData = ref({
  makerMan: '',
  auditMan: '',
})
const thisEditObj = ref(null)
const thisEditType = ref('')
const [registerModalPopPage, {openModal: openMoalPopPage}] = useModal();
const [registerSelectDeptPage, {openModal: openSelectDeptPage}] = useModal()
const [registerStockCangKuModalPage, {openModal: openStockCangKuModalPage}] = useModal();
const [registerSelectPsnPage, {openModal: openSelectPsnPage}] = useModal()

const [registerStockInfoModalPage, {openModal: openStockInfoModalPage}] = useModal();
const openSelectContent = (o, type) => {
  thisEditObj.value = o
  thisEditType.value = type
  switch (type) {
    case 'cinvode':
      openStockInfoModalPage(true, {
        database: dynamicTenantId.value,
      })
      break;
    case 'cwhcode':
      openStockCangKuModalPage(true, {
        database: dynamicTenantId.value,
      })
      break;
  }
}
const openHeadSelectContent = (type) => {
  thisEditType.value = type
  switch (type) {
    case 'cvencode':
      openMoalPopPage(true, {
        database: dynamicTenantId.value,
        accId: dynamicAccId.value,
      });
      break;
    case 'cdepcode':
      openSelectDeptPage(true, {
        dynamicTenantId: dynamicTenantId.value
      })
      break;
    case 'cwhcode':
      openStockCangKuModalPage(true, {
        database: dynamicTenantId.value,
      })
      break;
    case 'cpersoncode':
      openSelectPsnPage(true, {
        dynamicTenantId: dynamicTenantId.value
      })
      break;

  }
}
const modalData = (o) => {
  console.log(o[0])
  thisEditObj.value['cinvode'] = o[0].stockNum
  thisEditObj.value['cinvodeName'] = o[0].stockName

  // if (thisEditObj.value) {
  //   if (thisEditType.value == 'cinvode') {
  //     thisEditObj.value['tempTwo'] = o[0].stockNum
  //     thisEditObj.value['cunitid'] = o[0].stockMeasurementUnit // 计量单位
  //     thisEditObj.value['cinvode'] = o[0].stockNum
  //     thisEditObj.value['cinvodeName'] = o[0].stockName
  //     thisEditObj.value.editTwo = false
  //     chChange(thisEditObj.value, 'one')
  //   } else {
  //     thisEditObj.value[thisEditType.value] = o[0].id
  //     thisEditObj.value.editOne = false
  //   }
  //   tableDataChange(thisEditObj.value)
  //   thisEditObj.value = null
  // } else {
  //   let e = formFuns.value.getFormValue()
  //   e[thisEditType.value] = thisEditType.value == 'cvencode' || thisEditType.value == 'cwhcode' ? o[0].id : thisEditType.value == 'cdepcode' ? o.uniqueCode : o.id
  //   formFuns.value.setFormValue(e)
  // }
}
const resetRow = (record) => {
  record['key'] = record.lineCode
  let o = assetsCardList.value.filter(it => it.stockNum == record.cinvode)[0]
  record.cinvodeName = o?.stockName || ''
  record.cinvodeType = o?.stockGgxh // 规格型号
  record.bcheck1 = o?.stockBarcode // 条形码
  // 计量类型 o.stockMeasurementType
  record.cunitid = o?.stockMeasurementUnit // 计量类型
  record.isGive = record.isGive == '1'
  return record;
}

const tableDataChange = (r, c) => {
  let h = formFuns.value.getFormValue();
  if (hasBlank(r.cwhcode) && !hasBlank(h.cwhcode)) r.cwhcode = h.cwhcode
  switch (c) {
    case 'cinvode':
      chChange(r)
      break;
    case 'baseQuantity' || 'price':
      if (!hasBlank(r.baseQuantity) && !hasBlank(r.price)) {
        let n = parseFloat(r.baseQuantity).toFixed(10)
        if (titleValue.value != 0 && n > 0) n = 0 - (Math.abs(n))
        let d = parseFloat(r.price).toFixed(10)
        r.icost = (n * d).toFixed(4) + ''
        r.tempTen = r.icost
        r.baseQuantity = n + ''
        r.price = d + ''
        if (c == 'baseQuantity' && r.cunitType == '0' && r.unitInfo != null) { // 存在多计量的清空
          // 运算辅助数量
          let list = JsonTool.parseObj(r.unitInfo.detail) || []
          if (list.length > 0) {
            let isnum = (r.unitInfo.unitType == '2')
            let one = parseFloat((n / parseFloat(list[1].conversionRate))).toFixed(10)
            let two = parseFloat((n / parseFloat(list[2].conversionRate))).toFixed(10)
            if (isnum) { //取整数
              r.baseQuantity = Math.ceil(n) + ''
              r.subQuantity1 = Math.ceil(one) + ''
              r.subQuantity2 = Math.ceil(two) + ''
            } else {
              r.subQuantity1 = one + ''
              r.subQuantity2 = two + ''
            }
          }else {
            r.subQuantity1 = "0.0000000000"
            r.subQuantity2 = "0.0000000000"
          }
        }
      }
      break;
    case 'icost':
      if (!hasBlank(r.baseQuantity) && !hasBlank(r.icost)) { //反算 单价
        let n = parseFloat(r.baseQuantity).toFixed(10)
        if (titleValue.value != 0 && n > 0) n = 0 - (Math.abs(n))
        let d = parseFloat(r.icost).toFixed(4)
        r.baseQuantity = n + ''
        r.icost = d + ''
        r.tempTen = d + ''
        r.price = (d / n).toFixed(10) + ''
      } else if (!hasBlank(r.price) && !hasBlank(r.icost)) { //反算 数量
        let n = parseFloat(r.price).toFixed(10)
        let d = parseFloat(r.icost).toFixed(4)
        if (titleValue.value != 0 && d > 0) d = 0 - (Math.abs(d))
        r.price = n + ''
        r.icost = d + ''
        r.tempTen = d + ''
        r.baseQuantity = (d / n).toFixed(10) + ''
        if (c == 'baseQuantity' && r.cunitType == '0' && r.unitInfo != null) { // 存在多计量的清空
          // 运算辅助数量
        }
      }
      break;
  }
}
const chChange = (record) => {
  let o = assetsCardList.value.filter(it => (it.stockNum == record.cinvode) || (it.stockName == record.cinvodeName))[0]
  if (o == undefined) {
    o = assetsCardList.value.filter(it => (it.stockNum == record.tempTwo))[0]
  }

  record.cinvodeName = o?.stockName
  record.cinvode = o?.stockNum
  record.cinvodeType = o?.stockGgxh // 规格型号
  record.bcheck1 = o?.stockBarcode // 条形码
  // 计量类型
  record.cunitType = o.stockMeasurementType == '单计量' ? '1' : '0'
  record.cunitid = o?.stockMeasurementUnit // 计量类型
  record.isBatch = o?.stockPropertyBatch == '1' // 批号必须输入
  if (o.stockMeasurementType == '多计量' && !hasBlank(record.cunitid) && record?.unitInfo == null) {
    useRouteApi(findUnitInfoById, {schemaName: dynamicTenantId})({id: record.cunitid}).then(res => {
      record.unitInfo = res
      let list = JsonTool.parseObj(res.detail) || []
      if (list.length > 0) {
        record.cunitidText = list[0].unitName + `[${list[0].conversionRate}]`
        if (list.length > 1) {
          record.cunitidF1 = list[1].unitName + `[${list[1].conversionRate}]`
          if (list.length > 2)
            record.cunitidF2 = list[2].unitName + `[${list[2].conversionRate}]`
        }
      }
    })
  }
}

const outBefore = () => {
  if (status != 3) {
    createConfirm({
      iconType: 'warning',
      title: '编辑中',
      content: '当前正在处于编辑,退出编辑将丢失,您确定要继续进行吗？',
      onOk: async () => {
        // 调整数据库 列参数
        closeCurrent()
      },
      onCancel: async () => {

      }
    });
  } else {
    closeCurrent()
  }

}
const {proxy} = getCurrentInstance()
/**
 * @param e 回车确定事件
 * @param r rowObj
 * @param c className
 * @param t mark
 */
const focusNext = (r, c) => {
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
  let filters = ['isGive', 'bcheck', 'cinvodeType', 'cunitid', 'cinvodeName']
  // if (!r.isBatch)filters.push('batchId') 要求填批号才填写
  let cols = getColumns().filter(it => it.title != '序号' && filters.indexOf(it.dataIndex) == -1 && it.ifShow)
  let index = list.findIndex(it => it.key == r.key)
  let nextC = cols[0].dataIndex // 获取下一个列位置
  if (index == list.length - 1 && cols[cols.length - 1].dataIndex == c) { // 最后一行最后一列回车追加
    list.push({editOne: true})
    // setTableData(list)
  } else {
    let cObj = cols[cols.findIndex(it => it.dataIndex == c) + 1]
    if (cObj != null) {
      nextC = cols[cols.findIndex(it => it.dataIndex == c) + 1].dataIndex
      // 的到指定位置
      let nextMark = getNextMark(c, true)
      r[`edit${nextMark}`] = true;
      r[`${nextC}`] = r[`temp${nextMark}`];
    } else { //之后一列时换行
      nextC = cols[0].dataIndex
      let nextMark = getNextMark(nextC, false)
      ++index
      list[index][`edit${nextMark}`] = true
      list[index][`${nextC}`] = list[index][`temp${nextMark}`];
      // setTableData(list)
    }
  }
  nextTick(() => {
    let doms = nextC == 'batchId' || nextC == 'cmemo' ? document.getElementsByClassName(nextC)[0] : document.getElementsByClassName(nextC)[0]?.getElementsByTagName('input')[0]
    doms.focus()
  })
}

const getNextMark = (c, b) => {
  let model = {
    cwhcode: 'One',
    'cinvode': 'Two',
    baseQuantity: 'Six',
    baseQuantity: 'Six',/*subQuantity1:'Seven',subQuantity2:'Eight',*/
    price: 'Nine',
    icost: 'Ten',
    batchId: 'Twelve',
    dvdate: 'Fifteen',
    cmemo: 'Thirteen'
  }
  if (b) {
    // 获取下一个
    let keys = Object.keys(model)
    return model[keys[keys.findIndex(k => k == c) + 1]]
  } else {
    return model[c]
  }
}

const abc = {
  id: 1,
  tenantId: 1,
  iyear: '2021',
  ccode: 'JY-202204-0001',
  lineId: 1,
  ddate: 1,
  cinvode: 1,
  cwhcode: 1,
  cwhcode1: 1,
  cwhcode2: 1,
  cwhcode3: 1,
  cwhcode4: 1,
  cwhcode5: 1,
  cwhcode6: 1,
  batchId: 1,
  dpdate: 1,
  dvdate: 1,
  baseQuantity: 1,
  subQuantity1: 1,
  subQuantity2: 1,
  jrjcFlag: 1,
  jrjcCcode: 1,
  jrjcLineId: 1,
  jrjcQuantity: 1,
  jrjcDate: 1,
  cmemo: 1,
  cfree1: 1,
  cfree2: 1,
  cfree3: 1,
  cfree4: 1,
  cfree5: 1,

};

onMounted(()=>{
  setTableData([
    {
      id:'111',
      tenantId:'111',
      iyear:'111',
      ccode:'111',
      lineId:'111',
      ddate:'111',
      cinvode:'111',
      cwhcode:'111',
      cwhcode1:'111',
      cwhcode2:'111',
      cwhcode3:'111',
      cwhcode4:'111',
      cwhcode5:'111',
      cwhcode6:'111',
      batchId:'111',
      dpdate:'111',
      dvdate:'111',
      baseQuantity:'111',
      subQuantity1:'111',
      subQuantity2:'111',
      jrjcFlag:'111',
      jrjcCcode:'111',
      jrjcLineId:'111',
      jrjcQuantity:'111',
      jrjcDate:'111',
      cmemo:'111',
      cfree1:'111',
      cfree2:'111',
      cfree3:'111',
      cfree4:'111',
      cfree5:'111',
    },
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
  ])
})
function hello345(){
  const aa=getFormValue.value()
  console.log(aa)
}
const titleFormItems=ref()
provide('dynamicTenantId',dynamicTenantId);
(async function () {
  const aaa = await GetStockJrjcsAll()
  console.log(aaa)
})()
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
      margin: 0 4%;

      :deep(.nc-summary) {
        font-size: 14px;
        font-weight: bold;
        width: 100%;

        > div {
          display: inline-block;
          background-color: #d8d8d8;
          padding: 5px;
        }

        > div:nth-of-type(2), > div:nth-of-type(3) {
          > span:nth-of-type(1) {
            margin-left: 10%;
            float: left;
          }
        }

        > div:nth-of-type(1) {
          width: 30%;
          text-align: center;
        }

        > div:nth-of-type(2) {
          width: 15%;
          margin: 0 1px;
          text-align: center;
        }

        > div:nth-of-type(3) {
          width: 24%;
          text-align: right;
          margin: 0 1px;
        }

        > div:nth-of-type(4) {
          width: 15%;
          margin: 0 1px;
          text-align: center;
        }

        > div:nth-of-type(5) {
          width: 15%;
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

.lanmu-table {
  :deep(.ant-table-content) {
    .ant-table-thead {
      tr {
        th {
          padding: 5px 8px !important;
          text-align: center !important;
        }
      }
    }

    .ant-table-tbody {
      tr {
        td {
          padding: 0 5px !important;
          font-size: 12px !important;

          .ant-radio-button-wrapper {
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
</style>
