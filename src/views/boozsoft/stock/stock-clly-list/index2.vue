<template>
  <div>
    <div class="app-container lcr-theme-div">
      <div>
        <div>
          <ProfileOutlined />
        </div>
        <div> <AccountPicker theme="three" readonly @reloadTable="dynamicAdReload"/></div>
      </div>
      <div>
        <div>  <b class="noneSpan" style="font-size: 24px;color: #0096c7;">领用出库单列表</b></div>
        <div><span style="font-size: 14px;font-weight: bold;">期间：{{qijianText}}</span></div>
      </div>
      <div>
        <div>
            <button
              type="button"
              class="ant-btn ant-btn-me"
              @click="openQuery()"
            ><span>查询</span></button>
            <button
              type="button"
              class="ant-btn ant-btn-me"
              @click="router.push({path: '/kc-xsDepot',query: {type:'add',ccode:''}})"
            ><span>新增</span></button>
            <button
              type="button"
              class="ant-btn ant-btn-me"
              @click="editFun()"
            ><span>修改</span></button>
            <button
              type="button"
              class="ant-btn ant-btn-me"
              @click="startDel"
            ><span>删除</span></button>
            <button
              type="button"
              class="ant-btn ant-btn-me"
            ><span>变更</span></button>
            <button
              type="button"
              class="ant-btn ant-btn-me" @click="startReview(true)"
            ><span>审核</span></button>
            <button
              type="button"
              class="ant-btn ant-btn-me" @click="startReview(false)"
            ><span>弃审</span></button>
            <button
              type="button"
              class="ant-btn ant-btn-me"
              @click="openExcel()"
            ><span>导入</span></button>
            <button
              type="button"
              class="ant-btn ant-btn-me"
              @click="closeCurrent()"
            ><span>退出</span></button>
        </div>
        <div>
          <div class="acttd-right-d-search">
            <Select v-model:value="formItems.selectType"
                    class="acttdrd-search-select">
              <SelectOption style="font-size: 12px;" value="1">单据编码</SelectOption>
              <SelectOption style="font-size: 12px;" value="2">供应商简称</SelectOption>
              <SelectOption style="font-size: 12px;" value="3">仓库</SelectOption>
              <SelectOption style="font-size: 12px;" value="4">存货名称</SelectOption>
            </Select>
            <InputSearch
              class="acttdrd-search-input"
              @search="onSearch"
            />
          </div>
          <div>
            <Button class="ant-btn-me">
              <SyncOutlined :style="{ fontSize: '14px' }"/>
            </Button>
            <Popover class="ant-btn-default" placement="bottom">
              <template #content>
              <span v-show="typeFlag=='0'">
                <a-popconfirm
                  ok-text="确定"
                  cancel-text="放弃"
                  @confirm="confirm"
                  @cancel="cancel">
                <template #icon><b>栏目设置</b><br></template>
                <template #title>
                  <a-table bordered :data-source="dynamicColumnData" :columns="dynamicColumns"
                           childrenColumnName="children" :pagination="false"
                           style="max-height: 500px;overflow-y: auto" class="lanmu-table">
                    <template #checkBox="{ text, record }">
                      <a-checkbox v-model:checked="record.check" :disabled="record.isFixed"/>
                    </template>
                    <template #widthInput="{ text, record }">
                      <div class="editable-cell">
                        <div v-if="editableData[record.key]" class="editable-cell-input-wrapper">
                          <a-input type="number" v-model:value="editableData[record.key].width"
                                   @pressEnter="save(record.key,record.min,record.max)"
                                   style="width: 80px"/>
                          <check-outlined class="editable-cell-icon-check"
                                          @click="save(record.key,record.min,record.max)"/>
                        </div>
                        <div v-else class="editable-cell-text-wrapper">
                          {{ text || ' ' }}
                          <edit-outlined class="editable-cell-icon" @click="edit(record.key)"/>
                          <span style="float: right;">{{ record.min + '~' + record.max }}</span>
                        </div>
                      </div>
                    </template>
                    <template #nameInput="{ text, record }">
                      <div class="editable-cell">
                        <div v-if="editableData[record.key]" class="editable-cell-input-wrapper">
                          <a-input type="text" v-model:value="editableData[record.key].nameNew"
                                   @pressEnter="saveName(record.key)" style="width: 100px"/>
                          <check-outlined class="editable-cell-icon-check"
                                          @click="saveName(record.key)"/>
                        </div>
                        <div v-else class="editable-cell-text-wrapper">
                          {{ text || ' ' }}
                          <edit-outlined class="editable-cell-icon" @click="edit(record.key)"/>
                        </div>
                      </div>
                    </template>
                    <template #alignRadio="{ text, record }">
                      <a-radio-group default-value="a" size="small" v-model:value="record.align"
                                     :disabled="record.align==''">
                        <a-radio-button value="left">
                          左
                        </a-radio-button>
                        <a-radio-button value="center">
                          中
                        </a-radio-button>
                        <a-radio-button value="right">
                          右
                        </a-radio-button>
                      </a-radio-group>
                    </template>
                  </a-table>
                </template>
                <a-button style="width: 120px;margin-bottom: 2px">栏目设置</a-button>
              </a-popconfirm>
              </span>
                <span v-show="typeFlag=='1'">
                <a-popconfirm
                  ok-text="确定"
                  cancel-text="放弃"
                  @confirm="confirm1"
                  @cancel="cancel1">
                <template #icon><b>栏目设置</b><br></template>
                <template #title>
                  <a-table bordered :data-source="dynamicColumnData1" :columns="dynamicColumns1"
                           childrenColumnName="children" :pagination="false"
                           style="max-height: 500px;overflow-y: auto" class="lanmu-table">
                    <template #checkBox="{ text, record }">
                      <a-checkbox v-model:checked="record.check" :disabled="record.isFixed"/>
                    </template>
                    <template #widthInput="{ text, record }">
                      <div class="editable-cell">
                        <div v-if="editableData1[record.key]" class="editable-cell-input-wrapper">
                          <a-input type="number" v-model:value="editableData1[record.key].width"
                                   @pressEnter="save1(record.key,record.min,record.max)"
                                   style="width: 80px"/>
                          <check-outlined class="editable-cell-icon-check"
                                          @click="save1(record.key,record.min,record.max)"/>
                        </div>
                        <div v-else class="editable-cell-text-wrapper">
                          {{ text || ' ' }}
                          <edit-outlined class="editable-cell-icon" @click="edit1(record.key)"/>
                          <span style="float: right;">{{ record.min + '~' + record.max }}</span>
                        </div>
                      </div>
                    </template>
                    <template #nameInput="{ text, record }">
                      <div class="editable-cell">
                        <div v-if="editableData1[record.key]" class="editable-cell-input-wrapper">
                          <a-input type="text" v-model:value="editableData1[record.key].nameNew"
                                   @pressEnter="saveName1(record.key)" style="width: 100px"/>
                          <check-outlined class="editable-cell-icon-check"
                                          @click="saveName1(record.key)"/>
                        </div>
                        <div v-else class="editable-cell-text-wrapper">
                          {{ text || ' ' }}
                          <edit-outlined class="editable-cell-icon" @click="edit1(record.key)"/>
                        </div>
                      </div>
                    </template>
                    <template #alignRadio="{ text, record }">
                      <a-radio-group default-value="a" size="small" v-model:value="record.align"
                                     :disabled="record.align==''">
                        <a-radio-button value="left">
                          左
                        </a-radio-button>
                        <a-radio-button value="center">
                          中
                        </a-radio-button>
                        <a-radio-button value="right">
                          右
                        </a-radio-button>
                      </a-radio-group>
                    </template>
                  </a-table>
                </template>
                <a-button style="width: 120px;margin-bottom: 2px">栏目设置</a-button>
              </a-popconfirm>
              </span>
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
              <Button>
                <SettingFilled :style="{ fontSize: '14px' }"/>
              </Button>
            </Popover>
            <Popover class="ant-btn-default" placement="bottom">
              <template #content>
              <span class="group-btn-span-special2" @click="typeFlag='0'" :style="typeFlag=='0'?{backgroundColor: '#0096c7',color: 'white'}:''" style="width: 130px;">
                按明细显示&emsp;<CheckOutlined v-if="typeFlag=='0'"/>
              </span><br/>
                <span class="group-btn-span-special2" @click="typeFlag='1'" :style="typeFlag=='1'?{backgroundColor: '#0096c7',color: 'white'}:''" style="width: 130px;">
                按汇总显示&emsp;<CheckOutlined v-if="typeFlag=='1'"/>
              </span>
              </template>
              <Button>
                <PicLeftOutlined :style="{ fontSize: '14px' }"/>
              </Button>
            </Popover>
            <Popover class="ant-btn-default" placement="bottom">
              <template #content>
              <span class="group-btn-span-special2 p_specifics" @click="excelDataCode()" style="width: 130px;text-align: left;padding: 5px 10%;">
                导出含编码明细
              </span><br/>
                <span class="group-btn-span-special2 p_specifics" @click="excelData()" style="width: 130px;text-align: left;padding: 5px 10%;">
                导出普通明细
              </span><br/>
                <span class="group-btn-span-special2 p_specifics" @click="excelDataList()" style="width: 130px;text-align: left;padding: 5px 10%;">
                导出汇总列表
              </span>
              </template>
              <Button>
                <UsbOutlined :style="{ fontSize: '14px' }"/>
              </Button>
            </Popover>
            <Popover class="ant-btn-default" placement="bottom">
              <template #content>
              <span class="group-btn-span-special2 p_specifics" style="width: 120px;text-align: left;padding: 5px 10%;">
                打印当前列表
              </span><br/>
                <span class="group-btn-span-special2 p_specifics" style="width: 120px;text-align: left;padding: 5px 10%;">
                单据打印
              </span>
              </template>
              <Button class="ant-btn-me">
                <PrinterOutlined :style="{ fontSize: '14px' }"/>
              </Button>
            </Popover>
          </div>
        </div>
      </div>
    </div>
    <div class="app-container">
        <BasicTable
                ref="tableRef"
                :row-selection="{ type: 'checkbox', selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
                :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
                @register="registerTable"
                :dataSource="tableData"
                :scroll="{ x: totalColumnWidth,y: windowHeight }"
                :loading="loadMark"
                v-show="typeFlag=='0'"
        >
            <template #bcheck="{ record }">
          <span v-if="record.bcheck != null">
            <Tag :color="record.bcheck === '1' ? 'green' : 'volcano'">
              {{ record.bcheck === '1' ? '已审核' : '未审核' }}
            </Tag>
          </span>
            </template>
            <template #icost="{ record }">{{ toThousandFilter(record.icost) }}</template>
            <template #baseQuantity="{ record }">{{ toThousandFilter(record.baseQuantity) }}</template>
            <template #isum="{ record }">{{ toThousandFilter(record.isum) }}</template>
            <template #cvencode="{ record }">{{ formatCvencode(record.cvencode) }}</template>
            <template #cvencodeJs="{ record }">{{ formatCvencode(record.cvencodeJs) }}</template>
            <template #cpersoncode="{ record }">{{ formatCpersoncode(record.cpersoncode) }}</template>
            <template #cwhcode="{ record }">{{ formatCwhcode(record.cwhcode) }}</template>
            <template #cmaker="{ record }">{{ formatUser(record.cmaker) }}</template>
            <template #bcheckUser="{ record }">{{ formatUser(record.bcheckUser) }}</template>
            <template #cinvode="{ record }">{{ formatCinvode(record.cinvode) }}</template>
            <template #ggxh="{ record }">{{ formatGgxh(record.cinvode) }}</template>
          <template #summary>
            <TableSummary fixed>
              <TableSummaryRow style="background-color: #cccccc;">
                <TableSummaryCell class="nc-summary" :index="0" :align="'center'">合</TableSummaryCell>
                <TableSummaryCell class="nc-summary" :index="1" :align="'center'">计</TableSummaryCell>
                <TableSummaryCell class="nc-summary" v-for="cell in getCurrSummary('one')"  :index="cell.ind" :align="cell.align"><span class="a-table-font-arial">{{null == summaryModel[cell.dataIndex]?'':summaryModel[cell.dataIndex].toFixed(2)}}</span></TableSummaryCell>
              </TableSummaryRow>
            </TableSummary>
          </template>
        </BasicTable>
        <BasicTable
                ref="tableRef1"
                :row-selection="{ type: 'checkbox', selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange1 }"
                :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
                @register="registerTable1"
                :dataSource="tableData1"
                :scroll="{ x: totalColumnWidth1,y: windowHeight1 }"
                :loading="loadMark"
                v-show="typeFlag=='1'"
        >
            <template #bcheck="{ record }">
          <span v-if="record.bcheck != null">
            <Tag :color="record.bcheck === '1' ? 'green' : 'volcano'">
              {{ record.bcheck === '1' ? '已审核' : '未审核' }}
            </Tag>
          </span>
            </template>
            <template #icost="{ record }">{{ toThousandFilter(record.icost) }}</template>
            <template #squantity="{ record }">{{ toThousandFilter(record.squantity) }}</template>
            <template #isum="{ record }">{{ toThousandFilter(record.isum) }}</template>
            <template #cvencode="{ record }">{{ formatCvencode(record.cvencode) }}</template>
            <template #cvencodeJs="{ record }">{{ formatCvencode(record.cvencodeJs) }}</template>
            <template #cpersoncode="{ record }">{{ formatCpersoncode(record.cpersoncode) }}</template>
            <template #cwhcode="{ record }">{{ formatCwhcode(record.cwhcode) }}</template>
            <template #cmaker="{ record }">{{ formatUser(record.cmaker) }}</template>
            <template #bcheckUser="{ record }">{{ formatUser(record.bcheckUser) }}</template>
          <template #summary>
            <TableSummary fixed>
              <TableSummaryRow style="background-color: #cccccc;">
                <TableSummaryCell class="nc-summary" :index="0" :align="'center'">合</TableSummaryCell>
                <TableSummaryCell class="nc-summary" :index="1" :align="'center'">计</TableSummaryCell>
                <TableSummaryCell class="nc-summary" v-for="cell in getCurrSummary('two')"  :index="cell.ind" :align="cell.align"><span class="a-table-font-arial">{{null == summaryModel[cell.dataIndex]?'':summaryModel[cell.dataIndex].toFixed(2)}}</span></TableSummaryCell>
              </TableSummaryRow>
            </TableSummary>
          </template>
        </BasicTable>
      <div class="pagination-text" v-show="showPaginationText">
        {{`共 ${paginationNumber} 条记录 每页 200 条`}}
      </div>
    </div>
    <Query @query="saveQuery" @register="registerQueryPage"/>
    <Excel @save="saveExcel" @register="registerExcelPage"/>
<!--    <StockPeriodOpen  @register="registerModalPopPage"/>-->
  </div>
</template>
<script setup="props, {emit}" lang="ts">
import {BasicTable, useTable} from '/@/components/Table'
import {useModal} from '/@/components/Modal'
import {onMounted, reactive, ref} from 'vue'
import {
    CheckOutlined,
    PicLeftOutlined,
    PrinterOutlined,
    SettingFilled,
    SortAscendingOutlined,
    SortDescendingOutlined,
    SyncOutlined,
    UsbOutlined,EditOutlined,ProfileOutlined
} from '@ant-design/icons-vue'
import {
    Button,
    Checkbox as ACheckbox,
    Input,
    message,
    Popconfirm as APopconfirm,
    Popover,
    Radio as ARadio,
    Select,
    Table as ATable,
    Tag,
} from 'ant-design-vue'
import {useMessage} from "/@/hooks/web/useMessage";
import {getCurrentAccountName, hasBlank} from "/@/api/task-api/tast-bus-api";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {toThousandFilter} from "/@/views/boozsoft/gdzc/gu-ding-zi-chan-add/calculation";
import Query from './popup/query.vue'
//导入
import Excel from './popup/excel.vue'
//导出
import {defaultV, sheet_from_array_of_arrays, Workbook, writeExcel} from "/@/utils/boozsoft/excel/excel2";
import XLSX from "xlsx-js-style";
/**********************明细栏目设置**********************/
import {assemblyDynamicColumn, initDynamics} from "./data";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {findStockDbLanMuList, saveStockLanMuList} from "/@/api/record/system/stock-column-view-settings";
import {cloneDeep} from "lodash-es";
/**********************汇总栏目设置**********************/
import {initDynamics as initDynamics1} from "./data1";
import {
   batchReviewCkd, delBatch,
  findOutByTypeList,
} from "/@/api/record/stock/stock-xhd";
import {JsonTool} from "/@/api/task-api/tools/universal-tools";

const InputSearch = Input.Search
const SelectOption = Select.Option
const ARadioButton = ARadio.Button
const ARadioGroup = ARadio.Group
const TableSummary = ATable.Summary
const TableSummaryRow = TableSummary.Row
const TableSummaryCell = TableSummary.Cell
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

const [registerQueryPage, {openModal: openQueryPage}] = useModal()
//文件导入
const val = ref({
  openOne: 0,
  total: 0
})
const qijianText = ref('')
const openQuery = async () => {
  val.value.openOne = 0
  openQueryPage(true, {
    data: val
  })
}

async function saveQuery(e) {
  let data = e.data
  dynamicTenant.value = e.dynamic
  dynamicTenantId.value = data.constant.tenantId
  pageParameter.queryMark = data.constant.queryType
  pageParameter.query = data.variable
  if (!hasBlank(data.variable.periodStart)){
    qijianText.value = formatText(data.variable.periodStart)+ ' - '+formatText(data.variable.periodEnd)
  }else{
    qijianText.value = (data.variable.dateStart.replaceAll(/-/g,'.')+ ' - '+data.variable.dateEnd.replaceAll(/-/g,'.'))
  }
  reloadTable()
  reloadList(e.map)
}
const formatText = (text) => {
  return text.substring(0,4) +'.'+text.substring(4,6)
}
const replenishTrs = (list) =>{
 let l = list.length
  for (let i = 0; i < (30-l); i++) {
    list.push({})
  }
  return list
}
const typeFlag = ref('0')

const dynamicTenantId = ref(getCurrentAccountName(true))
const dynamicTenant = ref(null)

const tableData:any = ref([]);
const tableDataAll:any = ref([]);
const tableData1:any = ref([]);
const tableDataAll1:any = ref([]);
const loadMark = ref(false)
const summaryTotal = reactive({baseQuantity:0.00,isum: 0.0})
const showPaginationText = ref(false)
const paginationNumber = ref(0)
async function reloadTable(){
  loadMark.value = true
  loadMark.value = true
  showPaginationText.value = false
  let num = 0;
  let sum = 0
  let len = 0
  if (pageParameter.queryMark == '1'){
    tableDataAll.value = await useRouteApi(findOutByTypeList,{schemaName: dynamicTenantId})(pageParameter)
    len = tableDataAll.value.length
    tableData.value = replenishTrs(JsonTool.parseProxy(tableDataAll.value))
    await setPagination({
      total: tableData.value.length
    })
    for (let it of tableDataAll.value) {
      num += parseFloat(it.baseQuantity).toFixed(10)
      sum += parseFloat(it.isum).toFixed(4)
    }
  }else {
    tableDataAll1.value = await useRouteApi(findOutByTypeList,{schemaName: dynamicTenantId})(pageParameter)
    len = tableDataAll1.value.length
    tableData1.value =  replenishTrs(JsonTool.parseProxy(tableDataAll1.value))
    await setPagination1({
      total: tableData1.value.length
    })

    for (let it of tableDataAll.value) {
      num += parseFloat(it.baseQuantity).toFixed(10)
      sum += parseFloat(it.isum).toFixed(4)
    }
  }
  summaryTotal.baseQuantity = num
  summaryTotal.isum = sum
  calculateTotal(pageParameter.queryMark=='1'?'one':'two')
  loadMark.value = false
  paginationNumber.value = len
  showPaginationText.value = true
}

const psnList:any = ref([])
const supplierList:any = ref([])
const cangkuList:any = ref([])
const userList:any = ref([])
const stockList:any = ref([])
async function reloadList(map) {
 /* psnList.value = await useRouteApi(getPsnList,{schemaName: dynamicTenantId})({})
  const res = await useRouteApi(findAllByFlag,{schemaName: dynamicTenantId})('1')
  supplierList.value = res.items
  cangkuList.value = await useRouteApi(findCangkuAllList,{schemaName: dynamicTenantId})({})
  const res1 = await findAll({})
  userList.value = res1.items
  stockList.value = await useRouteApi(findStockAllList, {schemaName: dynamicTenantId})({})*/
  psnList.value = map['user']
  userList.value = map['operator']
  supplierList.value = map['cust']
  cangkuList.value = map['warehouse']
  stockList.value = map['stock']
}

const CrudApi = {
  // list: useRouteApi(findCardMasterAll, {schemaName: dynamicTenantId}),
  columns: [
    {
      title: '状态',
      dataIndex: 'bcheck',
      width: 80,
      align: 'center',
      ellipsis: true,
      slots: { customRender: 'bcheck' }
    },
    {
      title: '单据日期',
      dataIndex: 'ddate',
      width: 100,
      align: 'left',
      ellipsis: true,
    },
    {
      title: '单据编码',
      dataIndex: 'ccode',
      width: 100,
      align: 'left',
      ellipsis: true,
    },
    {
      title: '销售客户简称',
      dataIndex: 'cvencode',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'cvencode'}
    }, {
      title: '结算客户简称',
      dataIndex: 'cvencodeJs',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'cvencodeJs'}
    },
    {
      title: '业务员',
      dataIndex: 'cpersoncode',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'cpersoncode'}
    },
    {
      title: '仓库',
      dataIndex: 'cwhcode',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'cwhcode'}
    },
    {
      title: '存货名称',
      dataIndex: 'cinvode',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'cinvode'}
    },
    {
      title: '规格型号',
      dataIndex: 'ggxh',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'ggxh'}
    },
    {
      title: '数量',
      dataIndex: 'baseQuantity',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'baseQuantity'}
    },
    {
      title: '无税金额',
      dataIndex: 'icost',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'icost'}
    },
    {
      title: '价税合计',
      dataIndex: 'isum',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'isum'}
    },
    {
      title: '备注',
      dataIndex: 'cmemo',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'cmemo'}
    },
    {
      title: '经手人',
      dataIndex: 'cmaker',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'cmaker'}
    },
    {
      title: '审核人',
      dataIndex: 'bcheckUser',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'bcheckUser'}
    }, {
      title: '审核时间',
      dataIndex: 'bcheckTime',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'bcheckTime'}
    }
  ]
}

const CrudApi1 = {
  // list: useRouteApi(findCardMasterAll, {schemaName: dynamicTenantId}),
  columns: [
    {
      title: '状态',
      dataIndex: 'bcheck',
      width: 80,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'bcheck' }
    },
    {
      title: '单据日期',
      dataIndex: 'ddate',
      width: 100,
      align: 'left',
      ellipsis: true,
    },
    {
      title: '单据编码',
      dataIndex: 'ccode',
      width: 100,
      align: 'left',
      ellipsis: true,
    },
    {
      title: '销售客户简称',
      dataIndex: 'cvencode',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'cvencode'}
    }, {
      title: '结算客户简称',
      dataIndex: 'cvencodeJs',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'cvencodeJs'}
    },
    {
      title: '业务员',
      dataIndex: 'cpersoncode',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'cpersoncode'}
    },
    {
      title: '仓库',
      dataIndex: 'cwhcode',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'cwhcode'}
    },
    {
      title: '数量',
      dataIndex: 'squantity',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'squantity'}
    },
    {
      title: '无税金额',
      dataIndex: 'icost',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'icost'}
    },
    {
      title: '价税合计',
      dataIndex: 'isum',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'isum'}
    },
    {
      title: '备注',
      dataIndex: 'cmemo',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'cmemo'}
    },
    {
      title: '经手人',
      dataIndex: 'cmaker',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'cmaker'}
    },
    {
      title: '审核人',
      dataIndex: 'bcheckUser',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'bcheckUser'}
    }, {
      title: '审核时间',
      dataIndex: 'bcheckTime',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'bcheckTime'}
    }
  ]
}

function formatCvencode(cvencode){
  let str = cvencode
  supplierList.value.forEach(item=>{
    if(item.id==cvencode){
      str = item.custName
    }
  })
  return str
}

function formatCpersoncode(cpersoncode){
  let str = cpersoncode
  psnList.value.forEach(item=>{
    if(item.id == cpersoncode){
      str = item.psnName
    }
  })
  return str
}

function formatCwhcode(cwhcode){
  let str = cwhcode
  cangkuList.value.forEach(item=>{
    if(item.id == cwhcode){
      str = item.ckName
    }
  })
  return str
}

function formatUser(user){
  let str = user
  userList.value.forEach(item=>{
    if(item.id == user){
      str = item.realName
    }
  })
  return str
}

function formatCinvode(cinvode){
  let str = cinvode
  stockList.value.forEach(item=>{
    if (item.stockNum == cinvode){
      str = item.stockName
    }
  })
  return str
}

function formatGgxh(cinvode){
  let str = ''
  stockList.value.forEach(item=>{
    if (item.stockNum == cinvode){
      str = item.stockGgxh
    }
  })
  return str
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
  // api: CrudApi.list,
  columns: CrudApi.columns,
  bordered: true,
  showIndexColumn: true,
  indexColumnProps:{ fixed:true },
  pagination: {
    pageSize: 200,
    simple: true,
  },
  /*actionColumn: {
    width: 120,
    title: '操作',
    dataIndex: 'action',
    slots: {customRender: 'action'}
  }*/
})

// 这是示例组件
const [registerTable1, {
  reload: reload1,
  getDataSource: getDataSource1,
  setTableData: setTableData1,
  setPagination: setPagination1,
  getPaginationRef: getPaginationRef1,
  getColumns: getColumns1,
  setColumns: setColumns1
}] = useTable({
  // api: CrudApi.list,
  columns: CrudApi1.columns,
  bordered: true,
  showIndexColumn: true,
  pagination: {
    pageSize: 200,
    simple: true,
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
const checkRow1: any = ref([])
const onSelectChange = (selectedRowKeys, row) => {
    // console.log('selectedRowKeys changed: ', row);
    state.selectedRowKeys = selectedRowKeys;
    checkRow.value = row
};

const onSelectChange1 = (selectedRowKeys, row) => {
    // console.log('selectedRowKeys changed: ', row);
    state.selectedRowKeys = selectedRowKeys;
    checkRow1.value = row
};
const pageParameter: any = reactive({
    queryMark: '',
    type:'LYCKD',
    showRulesSize: 'MIN',
    query: {}
})

function onSearch() {
}

const defaultPage = ref(false)
onMounted(async() => {
  val.value.openOne = 1
  openQueryPage(true, {
    data: val.value
  })
  resetDynamicColumnData()
  resetDynamicColumnData1()
})

const [registerExcelPage, {openModal: openExcelPage}] = useModal()
//文件导入
const openExcel = async () => {
  openExcelPage(true, {})
}

async function saveExcel(data) {}

const excelDataCode = () => {
  // console.log("导出成功！")
  let list: any = []
  const arrData = tableData.value
  arrData.forEach(item=>{
    let item1 = {}
    item1[0] = item.bcheck=='1'?'已审核':'未审核'
    item1[1] = item.ddate
    item1[2] = item.ccode
    item1[3] = item.cvencode==null?'':supplierList.value.filter(aa=>aa.id==item.cvencode).map(aa=>aa.custCode)
    item1[4] = formatCvencode(item.cvencode)
    item1[5] = item.cpersoncode==null?'':psnList.value.filter(aa=>aa.id==item.cpersoncode).map(aa=>aa.psnCode)
    item1[6] = item.cpersoncode==null?'':formatCpersoncode(item.cpersoncode)
    item1[7] = item.cwhcode==null?'':cangkuList.value.filter(aa=>aa.id==item.cwhcode).map(aa=>aa.ckNum)
    item1[8] = formatCwhcode(item.cwhcode)
    item1[9] = item.cinvode
    item1[10] = formatCinvode(item.cinvode)
    item1[11] = formatGgxh(item.cinvode)
    item1[12] = toThousandFilter(item.baseQuantity)
    item1[13] = toThousandFilter(item.icost)
    item1[14] = toThousandFilter(item.isum)
    item1[15] = item.cmemo
    item1[16] = formatUser(item.cmaker)
    item1[17] = item.bcheckUser==null?'':formatUser(item.bcheckUser)
    list.push(item1)
  })
  console.log(list)
  const sheet:any = [
    {
      title: '采购入库单列表',
      multiHeader: [
        ['状态', '单据日期', '单据编码', '供应商编码', '供应商简称', '业务员编码', '业务员名称', '仓库编码', '仓库名称', '存货编码', '存货名称', '规格型号', '数量','无税金额','价税合计','备注','经手人','审核人']
      ],
      table: list,
      keys: [0, 1, 2, 3, 4, 5, 6, 7, 8,9,10,11,12,13,14,15,16,17],
      merges: [],
      sheetName: '采购入库单列表',
      cellStyle: [
        {
          cell: 'A1',
          font: {
            name: '宋体',
            sz: 14,
            color: {rgb: "000000"},
            bold: true,
          },
          border: {color: {rgb: "ffffff"}}
        },
      ],
      colWidth: [8, 8, 10, 15, 12, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15]
    }
  ]
  // 处理数据前
  if (!sheet || sheet.length <= 0) {
    this.onError('Table data cannot be empty')
    return
  }
  const wb:any = Workbook()
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
      const titleLength:any = Math.max(tHeaderLength, multiHeaderLength, keys.length)
      // 第一个元素为title，剩余以空字符串填充
      title = [title].concat(Array(titleLength - 1).fill(''))
      // 处理标题的合并\
      const cell = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      let mergeSecond = 'A1'
      if (titleLength > 26) {
        const one = parseInt(titleLength) / 26
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
    /*if (foot || foot === '') {
      foot && data.push(foot);
      const str = ('A' + data.length) + (':I' + data.length)
      merges.push(str)
    }*/
    const ws = sheet_from_array_of_arrays(data,'');
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
          } else if (i.substring(0, 1) == 'A') {
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "left",
              }
            }
          } else if (i.substring(0, 1) == 'C' || i.substring(0, 1) == 'D'
            || i.substring(0, 1) == 'E' || i.substring(0, 1) == 'F'
            || i.substring(0, 1) == 'G' || i.substring(0, 1) == 'H'
            || i.substring(0, 1) == 'I' || i.substring(0, 1) == 'K'
            || i.substring(0, 1) == 'L' || i.substring(0, 1) == 'P'
            || i.substring(0, 1) == 'Q' || i.substring(0, 1) == 'R') {
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "left",
              }
            }
          } else if (i.substring(0, 1) == 'M' || i.substring(0, 1) == 'N' || i.substring(0, 1 ) == 'O') {
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "right",
              }
            }
          }
          /*if (foot.length > 0) {
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
                  horizontal: "left",
                }
              }
            }
          }*/
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
  writeExcel(wb, bookType, '材料出库单列表_'+pageParameter.companyName)
}

const excelData = () => {
  // console.log("导出成功！")
  let list: any = []
  const arrData = tableData.value
  arrData.forEach(item=>{
    let item1 = {}
    item1[0] = item.bcheck=='1'?'已审核':'未审核'
    item1[1] = item.ddate
    item1[2] = item.ccode
    item1[3] = formatCvencode(item.cvencode)
    item1[4] = item.cpersoncode==null?'':formatCpersoncode(item.cpersoncode)
    item1[5] = formatCwhcode(item.cwhcode)
    item1[6] = formatCinvode(item.cinvode)
    item1[7] = formatGgxh(item.cinvode)
    item1[8] = toThousandFilter(item.baseQuantity)
    item1[9] = toThousandFilter(item.icost)
    item1[10] = toThousandFilter(item.isum)
    item1[11] = item.cmemo
    item1[12] = formatUser(item.cmaker)
    item1[13] = item.bcheckUser==null?'':formatUser(item.bcheckUser)
    list.push(item1)
  })
  const sheet:any = [
    {
      title: '采购入库单列表',
      multiHeader: [
        ['状态', '单据日期', '单据编码', '供应商简称', '业务员名称', '仓库名称', '存货名称', '规格型号', '数量','无税金额','价税合计','备注','经手人','审核人']
      ],
      table: list,
      keys: [0, 1, 2, 3, 4, 5, 6, 7, 8,9,10,11,12,13],
      merges: [],
      sheetName: '采购入库单列表',
      cellStyle: [
        {
          cell: 'A1',
          font: {
            name: '宋体',
            sz: 14,
            color: {rgb: "000000"},
            bold: true,
          },
          border: {color: {rgb: "ffffff"}}
        },
      ],
      colWidth: [8, 8, 10, 15, 12, 15, 15, 15, 15, 15, 15, 15, 15, 15]
    }
  ]
  // 处理数据前
  if (!sheet || sheet.length <= 0) {
    this.onError('Table data cannot be empty')
    return
  }
  const wb:any = Workbook()
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
      const titleLength:any = Math.max(tHeaderLength, multiHeaderLength, keys.length)
      // 第一个元素为title，剩余以空字符串填充
      title = [title].concat(Array(titleLength - 1).fill(''))
      // 处理标题的合并\
      const cell = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      let mergeSecond = 'A1'
      if (titleLength > 26) {
        const one = parseInt(titleLength) / 26
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
    /*if (foot || foot === '') {
      foot && data.push(foot);
      const str = ('A' + data.length) + (':I' + data.length)
      merges.push(str)
    }*/
    const ws:any = sheet_from_array_of_arrays(data,'');
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
          } else if (i.substring(0, 1) == 'A') {
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "left",
              }
            }
          } else if (i.substring(0, 1) == 'C' || i.substring(0, 1) == 'D'
            || i.substring(0, 1) == 'E' || i.substring(0, 1) == 'F'
            || i.substring(0, 1) == 'G' || i.substring(0, 1) == 'H'
            || i.substring(0, 1) == 'L' || i.substring(0, 1) == 'M'
            || i.substring(0, 1) == 'N') {
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "left",
              }
            }
          } else if (i.substring(0, 1) == 'I' || i.substring(0, 1) == 'J' || i.substring(0, 1) == 'K') {
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "right",
              }
            }
          }
          /*if (foot.length > 0) {
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
                  horizontal: "left",
                }
              }
            }
          }*/
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
  writeExcel(wb, bookType, '材料出库单列表_'+pageParameter.companyName)
}

const excelDataList = () => {
  // console.log("导出成功！")
  let list: any = []
  const arrData = tableData1.value
  arrData.forEach(item=>{
    let item1 = {}
    item1[0] = item.bcheck=='1'?'已审核':'未审核'
    item1[1] = item.ddate
    item1[2] = item.ccode
    item1[3] = formatCvencode(item.cvencode)
    item1[4] = item.cpersoncode==null?'':formatCpersoncode(item.cpersoncode)
    item1[5] = item.cwhcode==null?'':formatCwhcode(item.cwhcode)
    item1[6] = toThousandFilter(item.baseQuantity)
    item1[7] = toThousandFilter(item.icost)
    item1[8] = toThousandFilter(item.isum)
    item1[9] = item.cmemo==null?'':item.cmemo
    item1[10] = formatUser(item.cmaker)
    item1[11] = item.bcheckUser==null?'':formatUser(item.bcheckUser)
    list.push(item1)
  })
  const sheet:any = [
    {
      title: '采购入库单列表',
      multiHeader: [
        ['状态', '单据日期', '单据编码', '供应商简称', '业务员名称', '仓库名称', '数量','无税金额','价税合计','备注','经手人','审核人']
      ],
      table: list,
      keys: [0, 1, 2, 3, 4, 5, 6, 7, 8,9,10,11],
      merges: [],
      sheetName: '采购入库单列表',
      cellStyle: [
        /*{
          cell: 'A1',
          font: {
            name: '宋体',
            sz: 14,
            color: {rgb: "000000"},
            bold: true,
          },
          border: {color: {rgb: "ffffff"}}
        },*/
      ],
      colWidth: [8, 8, 10, 15, 12, 15, 15, 15, 15, 15, 15]
    }
  ]
  // 处理数据前
  if (!sheet || sheet.length <= 0) {
    this.onError('Table data cannot be empty')
    return
  }
  const wb:any = Workbook()
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
    // if (title || title === '') {
    //   // 取表头、多级表头中的最大值
    //   const tHeaderLength = tHeader && tHeader.length || 0
    //   const multiHeaderLength = multiHeader && Math.max(...multiHeader.map(m => m.length)) || 0
    //   const titleLength:any = Math.max(tHeaderLength, multiHeaderLength, keys.length)
    //   // 第一个元素为title，剩余以空字符串填充
    //   title = [title].concat(Array(titleLength - 1).fill(''))
    //   // 处理标题的合并\
    //   const cell = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    //   let mergeSecond = 'A1'
    //   if (titleLength > 26) {
    //     const one = parseInt(titleLength) / 26
    //     const two = titleLength % 26
    //     mergeSecond = cell[one - 1] + cell[two - 1] + '1'
    //   } else {
    //     mergeSecond = cell[titleLength - 1] + '1'
    //   }
    //   const titleMerge = `A1:${mergeSecond}`
    //   if (!merges) {
    //     merges = [titleMerge]
    //   } else {
    //     if (merges.indexOf(titleMerge) === -1) {
    //       merges.push(titleMerge)
    //     }
    //   }
    // }
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
    // title && data.unshift(title);
    //表格底部对应字段
    /*if (foot || foot === '') {
      foot && data.push(foot);
      const str = ('A' + data.length) + (':I' + data.length)
      merges.push(str)
    }*/
    const ws:any = sheet_from_array_of_arrays(data,'');
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
          /*if (i.substring(1) == '1') {
            dataInfo[i.toString()].s = {
              border: {},
              font: font || globalStyle.font,
              alignment: alignment || globalStyle.alignment,
              fill: fill || globalStyle.fill
            }
          } else */
          if (i.substring(1) == '1') {
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
          } else if (i.substring(0, 1) == 'A') {
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "left",
              }
            }
          } else if (i.substring(0, 1) == 'C' || i.substring(0, 1) == 'D'
            || i.substring(0, 1) == 'E' || i.substring(0, 1) == 'F'
            || i.substring(0, 1) == 'J' || i.substring(0, 1) == 'K'
            || i.substring(0, 1) == 'L') {
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "left",
              }
            }
          } else if (i.substring(0, 1) == 'G' || i.substring(0, 1) == 'H' || i.substring(0, 1) == 'I') {
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "right",
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
  writeExcel(wb, bookType, '材料出库单列表_'+pageParameter.companyName)
}

/*start栏目设置*/
const visible = ref(false);
const windowWidth = (window.innerWidth)
const windowHeight = (window.innerHeight - (325))
const totalColumnWidth = ref(0)
const dynamicColumns = initDynamics().DEFAULT
const dynamicColumnData: any = ref([])
let dynamicColumnDataCopy = []
const editableData = reactive({});
const tableRef: any = ref(null)
const lanMuData = {
  'accId': '',
  'menuName': '领用出库单',
  'type': '列表',
  objects: '',
  username: useUserStoreWidthOut().getUserInfo.username,
  userId: useUserStoreWidthOut().getUserInfo.id,
  isType: '0'
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
        saveStockLanMuList(lanMuData).then(res => {
          message.success("数据库同步成功！")
        })
        // 重新赋值
        dynamicColumnDataCopy = JSON.parse(JSON.stringify(dynamicColumnData.value))
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
    let arr: any = key.split('-');
    let one = parseInt(arr[0])
    if (arr.length == 2) {
      editableData[key] = cloneDeep(dynamicColumnData.value[one].children.filter(item => key === item.key)[0]);
    } else {
      let two = parseInt(arr[1]) - 1
      editableData[key] = cloneDeep(dynamicColumnData.value[one].children[two].children.filter(item => key === item.key)[0]);
    }
  } else {
    editableData[key] = cloneDeep(dynamicColumnData.value.filter(item => key === item.key)[0]);
  }
}
const save = (key: string, min: number, max: number) => {
  editableData[key].width = editableData[key].width > max ? max : editableData[key].width < min ? min : editableData[key].width
  if (key.toString().indexOf('-') != -1) {
    let arr: any = key.split('-');
    let one = parseInt(arr[0])
    if (arr.length == 2) {
      Object.assign(dynamicColumnData.value[one].children.filter(item => key === item.key)[0], editableData[key]);
      Object.assign(dynamicColumnData.value[one].children.filter(item => key === item.key)[0], editableData[key]);
    } else {
      let two = parseInt(arr[1]) - 1
      Object.assign(dynamicColumnData.value[one].children[two].children.filter(item => key === item.key)[0], editableData[key]);
    }
  } else {
    Object.assign(dynamicColumnData.value.filter(item => key === item.key)[0], editableData[key]);
  }
  delete editableData[key];
}
const saveName = (key: string) => {
  if (key.toString().indexOf('-') != -1) {
    let arr: any = key.split('-');
    let one = parseInt(arr[0])
    if (arr.length == 2) {
      Object.assign(dynamicColumnData.value[one].children.filter(item => key === item.key)[0], editableData[key]);
      Object.assign(dynamicColumnData.value[one].children.filter(item => key === item.key)[0], editableData[key]);
    } else {
      let two = parseInt(arr[1]) - 1
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
        if (item.key === item2.key && item.name == item2.name) {
          if (item.nameNew != item2.nameNew || item.width != item2.width || item.check != item2.check || item.align != item2.align)
            throw new Error('ok')
        }
      })
      return false
    } catch (e: any) {
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
  let a: any = []
  a = getColumns()
  let last = a.pop()
  let newA = JSON.parse(JSON.stringify(CrudApi.columns))
  newA = assemblyDynamicColumn(dynamicColumnData.value, newA)
  setColumns(newA)
  initTableWidth(newA)
  //searchConditonList.value = newA
}

function resetDynamicColumnData() {
  // 先从数据查询是否已经设置
  lanMuData.accId = getCurrentAccountName(false)
  findStockDbLanMuList(lanMuData).then(res => {
    // 栏目列
    let dbList = res.items
    if (dbList.length > 0) {
      let statiList = initDynamics()['DATA']
      dbList = combineParameters(statiList, dbList)
      dynamicColumnData.value = dbList
      dynamicColumnDataCopy = JSON.parse(JSON.stringify(dbList))
    } else {
      let statiList = initDynamics()['DATA']
      dynamicColumnData.value = statiList
      dynamicColumnDataCopy = JSON.parse(JSON.stringify(statiList))
    }
    // 表格列
    reloadColumns()
    //pageReload()
  })
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
    tableRef.value.$el.style.setProperty('width', (windowWidth + 70 - f) + 'px')
  } else {
    if (visible.value && (windowWidth - 260) < total) total -= (total - (windowWidth - 260))
    totalColumnWidth.value = total
    tableRef.value.$el.style.setProperty('width', (total + 70) + 'px')
  }
}

const pageReload = () => {
  setTableData([]) // 清空可能残留的数据
  reload({
    searchInfo: pageParameter
  })
}
/*明细栏目设置end*/
/*start栏目设置*/
const visible1 = ref(false);
const windowWidth1 = (document.documentElement.clientWidth)
const windowHeight1 = (document.documentElement.clientHeight - (300))
const totalColumnWidth1 = ref(0)
const dynamicColumns1 = initDynamics1().DEFAULT
const dynamicColumnData1: any = ref([])
let dynamicColumnDataCopy1 = []
const editableData1 = reactive({});
const tableRef1: any = ref(null)
const lanMuData1 = {
  'accId': '',
  'menuName': '领用出库单',
  'type': '列表',
  objects: '',
  username: useUserStoreWidthOut().getUserInfo.username,
  userId: useUserStoreWidthOut().getUserInfo.id,
  isType: '1'
}

const confirm1 = (e: MouseEvent) => {
  // 询问
  createConfirm({
    iconType: 'warning',
    title: '栏目同步',
    content: '是否将刚才设置同步数据库!',
    onOk: async () => {
      // 调整数据库 列参数
      lanMuData1.accId = getCurrentAccountName(false)
      lanMuData1.objects = JSON.stringify(filterModifyData(dynamicColumnData1.value, dynamicColumnDataCopy1))
      if (lanMuData1.objects == '[]') {
        createWarningModal({content: '请先做修改后再进行确认同步数据库！'})
      } else {
        saveStockLanMuList(lanMuData1).then(res => {
          message.success("数据库同步成功！")
        })
        // 重新赋值
        dynamicColumnDataCopy1 = JSON.parse(JSON.stringify(dynamicColumnData1.value))
      }
    }
  });
  // 重新获取数据
  reloadColumns1()
}
const cancel1 = (e: MouseEvent) => {
  // 恢复默认
  dynamicColumnData1.value = []
  dynamicColumnData1.value = dynamicColumnDataCopy1
}
const edit1 = (key: string) => {
  if (key.toString().indexOf('-') != -1) {
    let arr: any = key.split('-');
    let one = parseInt(arr[0])
    if (arr.length == 2) {
      editableData1[key] = cloneDeep(dynamicColumnData1.value[one].children.filter(item => key === item.key)[0]);
    } else {
      let two = parseInt(arr[1]) - 1
      editableData1[key] = cloneDeep(dynamicColumnData1.value[one].children[two].children.filter(item => key === item.key)[0]);
    }
  } else {
    editableData1[key] = cloneDeep(dynamicColumnData1.value.filter(item => key === item.key)[0]);
  }
}
const save1 = (key: string, min: number, max: number) => {
  editableData1[key].width = editableData1[key].width > max ? max : editableData1[key].width < min ? min : editableData1[key].width
  if (key.toString().indexOf('-') != -1) {
    let arr: any = key.split('-');
    let one = parseInt(arr[0])
    if (arr.length == 2) {
      Object.assign(dynamicColumnData1.value[one].children.filter(item => key === item.key)[0], editableData1[key]);
      Object.assign(dynamicColumnData1.value[one].children.filter(item => key === item.key)[0], editableData1[key]);
    } else {
      let two = parseInt(arr[1]) - 1
      Object.assign(dynamicColumnData1.value[one].children[two].children.filter(item => key === item.key)[0], editableData1[key]);
    }
  } else {
    Object.assign(dynamicColumnData1.value.filter(item => key === item.key)[0], editableData1[key]);
  }
  delete editableData[key];
}
const saveName1 = (key: string) => {
  if (key.toString().indexOf('-') != -1) {
    let arr: any = key.split('-');
    let one = parseInt(arr[0])
    if (arr.length == 2) {
      Object.assign(dynamicColumnData1.value[one].children.filter(item => key === item.key)[0], editableData1[key]);
      Object.assign(dynamicColumnData1.value[one].children.filter(item => key === item.key)[0], editableData1[key]);
    } else {
      let two = parseInt(arr[1]) - 1
      Object.assign(dynamicColumnData1.value[one].children[two].children.filter(item => key === item.key)[0], editableData1[key]);
    }
  } else {
    Object.assign(dynamicColumnData1.value.filter(item => key === item.key)[0], editableData1[key]);
  }
  delete editableData1[key];
}

function filterModifyData1(lanMuList: any, copyList) {
  let a = lanMuList.filter(item => {
    try {
      copyList.forEach(item2 => {
        if (item.key === item2.key && item.name == item2.name) {
          if (item.nameNew != item2.nameNew || item.width != item2.width || item.check != item2.check || item.align != item2.align)
            throw new Error('ok')
        }
      })
      return false
    } catch (e: any) {
      if (e.message == 'ok') {
        return true
      } else {
        return false
      }
    }
  })
  return a;
}

function combineParameters1(staticList: any, dbList: any) {
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

const reloadColumns1 = () => {
  let a: any = []
  a = getColumns1()
  let last = a.pop()
  let newA = JSON.parse(JSON.stringify(CrudApi1.columns))
  newA = assemblyDynamicColumn(dynamicColumnData1.value, newA)
  setColumns1(newA)
  initTableWidth1(newA)
  //searchConditonList.value = newA
}

function resetDynamicColumnData1() {
  // 先从数据查询是否已经设置
  lanMuData1.accId = getCurrentAccountName(false)
  findStockDbLanMuList(lanMuData1).then(res => {
    // 栏目列
    let dbList = res.items
    if (dbList.length > 0) {
      let statiList = initDynamics1()['DATA']
      dbList = combineParameters1(statiList, dbList)
      dynamicColumnData1.value = dbList
      dynamicColumnDataCopy1 = JSON.parse(JSON.stringify(dbList))
    } else {
      let statiList = initDynamics1()['DATA']
      dynamicColumnData1.value = statiList
      dynamicColumnDataCopy1 = JSON.parse(JSON.stringify(statiList))
    }
    // 表格列
    reloadColumns1()
    //pageReload()
  })
}

function initTableWidth1(thisCs) {
  let total = 60
  thisCs.forEach(item => {
    if (item.ifShow == null || item.ifShow)
      total += parseInt(item.width)
  })
  /*  // 去除操作咧宽
    total -= 100*/
  if (total > windowWidth1) {
    let f = 0
    if (visible.value) f = 260
    totalColumnWidth1.value = Number(windowWidth1) - f
    tableRef1.value.$el.style.setProperty('width', (windowWidth + 70 - f) + 'px')
  } else {
    if (visible1.value && (windowWidth1 - 260) < total) total -= (total - (windowWidth1 - 260))
    totalColumnWidth1.value = total
    tableRef1.value.$el.style.setProperty('width', (total + 70) + 'px')
  }
}

const pageReload1 = () => {
  setTableData1([]) // 清空可能残留的数据
  reload1({
    searchInfo: pageParameter
  })
}
/*汇总栏目设置end*/


const dynamicAdReload = async (obj) => {
    // const dataBase:any = await findDataBase(obj.accId,obj.year)
    return false
    // 底部分页信息
    await reloadList()
    // await reloadTable()
}


const startReview = async (b) => {
    let a = useUserStoreWidthOut().getUserInfo.id
    if (!hasBlank(a)) {
        if (checkRow.value.length == 0) {
            createWarningModal({title: '温馨提示', content: `请选中要进行${b ? '审核' : '弃审'}的单据！`})
        } else if ((b && checkRow.value.filter(it => it.bcheck == '1').length > 0) || (!b && checkRow.value.filter(it => it.bcheck != '1').length > 0)) {
            createWarningModal({title: '温馨提示', content: `选中的${b ? '审核' : '弃审'}的单据中存在已${b ? '审核' : '弃审'}单据，请先排除！`})
        } else {
          let codes = [...new Set(checkRow.value.map(it => it.ccode))]
         /* if (!b){ // 弃审前 检查
            let che = await useRouteApi(unAuditBefore, {schemaName: dynamicTenantId})({
              codes: codes,
            })
            if (null == che  || che.type != '0'){
              if (che.type == '1'){
                createWarningModal({title: '温馨提示',content: '销货单号【'+che.codes+'】已经收款核销，不能取消审核，请取消收款核销关联后继续！'})
              }else {
                createWarningModal({title: '温馨提示',content: '销货单号【'+che.codes+'】已经参照生成【'+codeToName(che.codeType)+'】，不能取消审核，请删除关联单据后继续！'})
              }
              return false;
            }
          }*/
           let isAuto = pageParameter.query.xsShXkd == '1'
            let res = await useRouteApi(batchReviewCkd, {schemaName: dynamicTenantId})({
                codes: codes,
                userId: a,
                type: b,
              auto: false
            })
            message.success(`${b ? '审核' : '弃审'}成功！`)
            reloadTable()
            /* if (b && res != null){
                 message.success(`正在准备跳转查看材料出库单。。。`)
                 // 获取下游单号 打开出库单查看
                 let query = {}
                 query['ccode'] = res.xyccode
                 query['bdate'] = res.xyccodeDate
                 // 去销货单页面
                 setTimeout(()=>{
                     router.push({
                         path:'/kc-xsDepot',
                         query: query,
                     });
                 },2000)
             }*/
        }
    } else {
        if (hasBlank(a)) message.error('获取用户信息异常！')
    }
}
function codeToName(arr) {
  let names = {'XSCKD':'领用出库单'}
  return arr.map(s=>names[s]).filter(s=>s != null && s != '').join(',')
}

const startDel = async () => {
  if(checkRow.value.length == 0){
    createWarningModal({title: '温馨提示', content: `请选择要进行删除的单据！`})
  } else if ((checkRow.value.filter(it => it.bcheck == '1').length > 0)) {
    createWarningModal({title: '温馨提示', content: `选中的单据中存在已审核单据，请先排除！`})
  } else {
     await useRouteApi(delBatch, {schemaName: dynamicTenantId})({code: [...new Set(checkRow.value.map(it => it.ccode))],type: 'XSCKD'})
     message.success('删除成功！')
     reloadTable()
  }
}

function editFun() {
  if(checkRow.value.length !== 1){
    message.error("只能选择一条数据修改！")
    return false
  }
  let data=checkRow.value[0].ccode
  router.push({path: '/kc-xsDepot',query: {type:'edit',ccode:data}});
}

/*** 合计 ***/
const summaryModel = ref({})
const getCurrSummary  = (t) => {
  return ((t=='one'?getColumns():getColumns1()).filter(it=>it.title != '序号' && it.ifShow).map((it,ind)=>{it['ind']=ind+2;return it;}))
}
const calculateTotal = (t) => {
  let list = JsonTool.parseProxy((t=='one'?getDataSource():getDataSource1()).filter(it=>it.cvencode!=null && it.quantity!=null))
  if (list.length == 0){
    summaryModel.value = {}
    return false;
  }
  let num = 0
  let numz = 0
  let num1 = 0
  let num2 = 0
  let wsum = 0
  let sum = 0
  let se = 0
  for (let i = 0; i < list.length; i++) {
    const e = list[i];
    num+=parseFloat(e['quantity'] || 0)
    numz+=parseFloat(e['baseQuantity'] || 0)
    num1+=parseFloat(e['subQuantity1'] || 0)
    num2+=parseFloat(e['subQuantity2'] || 0)
    wsum+=parseFloat(e['icost'] || 0)
    sum+=parseFloat(e['isum'] || 0)
    se+=parseFloat(e['itaxprice'] || 0)
  }
  summaryModel.value={
    quantity: num,
    baseQuantity: numz,
    subQuantity1: num1,
    subQuantity2: num2,
    icost: wsum,isum: sum,itaxprice:se
  }
}
/*** 合计 ***/
</script>
<style scoped lang="less">
@import "../../../../assets/styles/global-menu-index.less";
:deep(.ant-card-body) {
  padding: 16px;
  border-left: 2px solid rgb(1, 143, 251);
  box-shadow: rgb(72 113 140) -3px 1px 7px -1px;
}
:deep(.nc-summary){
  font-weight: bold;
  background-color: #cccccc!important;;
  border-right-color: #cccccc!important;
}
.a-table-font-size-16 :deep(td),
.a-table-font-size-16 :deep(th) {
  font-size: 14px !important;
  padding: 5px 8px !important;
  border-color: #cccccc !important;
  font-weight: 550;
}

.a-table-font-size-12 :deep(td),
.a-table-font-size-12 :deep(th) {
  font-size: 13px !important;
  padding: 2px 8px !important;
  border-color: #cccccc !important;
  font-weight: 600;
}
:deep(.ant-table-measure-row){
  td{
    padding: 0 !important;
  }
}

.app-container:nth-of-type(1) {
  background-color: #f2f2f2;
  padding: 10px ;
}

.app-container:nth-of-type(2) {
  padding: 0px;
  margin: 5px 10px;
  background: #b4c8e3 !important;
  position: relative;
  .pagination-text{
    position: absolute;
    bottom: 6px;
    right: 10%;
    font-size: 13px;
    color: black;
    z-index: 99999999;
  }
}

:deep(.ant-table-thead) th{
  text-align: center !important;
  font-weight: bold;
  //background-color: #f2f2f2 !important;
  background-color: #cccccc !important;
  border-color: #aaaaaa !important;
}

:deep(.vben-basic-table) .ant-table-wrapper {
  padding: 0px;
}

:deep(.vben-basic-table) .ant-table {
  width: 100%;
  margin: 0;
  overflow-x: hidden;
  height: calc(100% - 160px);
  min-height: 500px;
}

:deep(.vben-basic-table) .ant-pagination {
  background-color: #cccccc;
  padding-right: 20px;
  padding-top: 5px;
  padding-bottom: 5px;
  margin-top: 0!important;
  border-top: 1px solid #aaaaaa;
}

:deep(.vben-basic-table){
  min-height: 500px;
  height: calc(100% - 160px);
  margin-bottom: 20px;
}

:deep(.ant-input),:deep(.ant-btn){
  border: 1px solid #c9c9c9;
}
.lcr-theme-div{
  display: inline-flex;justify-content: space-between;width: 99%;height: 100px;
  >div:nth-of-type(1){
    width: 40%;
    position: relative;
    >div:nth-of-type(1){
      width: 64px;display: inline-block;text-align: center;    top: 10px;
      position: inherit;
      :deep(.anticon){
        color: #0096c7;
        font-size: 60px;
      }
    }
    >div:nth-of-type(2){
      width: calc(100% - 64px);
      position: inherit;
      display: inline-block;
      top: -8px;
    }
  }
  >div:nth-of-type(2){
    width: 20%;text-align:center;
    >div:nth-of-type(1){margin-top: 8px;}
  }
  >div:nth-of-type(3){
    width: 40%;text-align: right;
    >div:nth-of-type(1){
      .ant-btn-me {
        color: #0096c7;
      }
    }
    >div:nth-of-type(2){
      display: inline-flex;justify-content: space-between;margin-top: 15px;
    }
    .acttd-right-d-search {
      .acttdrd-search-select {
        width: 150px;
        text-align: left;
        :deep(.ant-select-selector) {
          border-color: @Global-Border-Color;
          border-radius: 2px 0 0 2px;
        }
      }

      .acttdrd-search-input {
        width: 150px;
        :deep(.ant-input){
          border-color: @Global-Border-Color;
          border-left: none;
        }
        :deep(.ant-input-search-button){
          border-color: #c9c9c9;
          border-left: none;
          //color: #0096c7;
        }
      }
    }
  }
}
</style>
