<template>
  <div>
    <div class="app-container lcr-theme-div">
      <div>
        <div>
          <ProfileOutlined style="color: #0096c7;font-size: 50px;"/>
        </div>
        <div> <AccountPicker theme="three" readonly @reloadTable="dynamicAdReload"/></div>
      </div>
      <div>
        <div>  <b class="noneSpan" style="font-size: 26px;color: #0096c7;">入库调整单</b></div>
        <div><span style="font-size: 14px;font-weight: bold;"><span style="  font-weight: bold;color: #666666;">日期：</span>{{ strDate }} - {{ endDate }}</span></div>
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
            @click="router.push({path: '/cb-depot',query: {type:'add',ccode:''}})"
          ><span>新增</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="delList()"
          ><span>删除</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            ant-click-animating-without-extra-node="false"
            @click="toAudit()"
          ><span>审核</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            ant-click-animating-without-extra-node="false"
            @click="toAuditBack()"
          ><span>弃审</span></button>
          <button type="button" class="ant-btn ant-btn-me" @click="closeCurrent(),router.push('/zhongZhang/home/welcome')"><span>退出</span></button>
        </div>
        <div>
          <div>
            <Select v-model:value="formItems.selectType" style="width: 120px;font-size: 12px;font-weight: bold;" class="special_select">
              <SelectOption style="font-size: 12px;" value="1">单据编码</SelectOption>
              <SelectOption style="font-size: 12px;" value="2">供应商简称</SelectOption>
              <SelectOption style="font-size: 12px;" value="3">仓库</SelectOption>
              <SelectOption style="font-size: 12px;" value="4">存货名称</SelectOption>
            </Select>
            <!-- 搜索 -->
            <InputSearch
              placeholder=""
              style="width: 200px; border-radius: 4px;margin-right: 4px"
              @search="onSearch"
            />
          </div>
          <div>
            <Button class="ant-btn-me">
              <SyncOutlined :style="{ fontSize: '14px' }" @click="reloadTable"/>
            </Button>
            <Popover class="ant-btn-default" placement="bottom">
              <template #content>
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
                             style="max-height: 500px;overflow-y: auto" :class="'a-table-font-size-12'">
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
          </div>
        </div>
      </div>
    </div>

    <div class="app-container" style="width:85%">
      <Loading :loading="compState.loading" :absolute="compState.absolute" :tip="compState.tip" />
      <BasicTable
        ref="tableRef1"
        :row-selection="{ type: 'checkbox', selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
        :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
        @register="registerTable1"
        :dataSource="tableData1"
        :scroll="{ y: windowHeight }"
        :loading="loadMark"
        v-show="typeFlag=='1'"
      >
        <template #ccode="{ record }">
          <a @click="toRouter(record,'list')">{{record.ccode}}</a>
        </template>
        <template #bcheck="{ record }">
          <span v-if="record.bcheck!=='11'">
            <Tag :color="record.bcheck === '1' ? 'green' : 'volcano'">
              {{ record.bcheck === '1' ? '已审核' : '未审核' }}
            </Tag>
          </span>
        </template>
        <template #icost="{ record }">
          <span :style="record.icost<0?{color:'red'}:{}">
            {{toThousandFilter(record.icost)}}
          </span>
        </template>
        <template #squantity="{ record }">
           <span :style="record.squantity<0?{color:'red'}:{}">
            {{toThousandFilter(record.squantity)}}
          </span>
        </template>
        <template #fymoney="{ record }">
           <span :style="record.fymoney<0?{color:'red'}:{}">
            {{toThousandFilter(record.fymoney)}}
          </span>
        </template>

      </BasicTable>
      <div class="pagination-text" v-show="showPaginationText">
        {{`共 ${paginationNumber} 条记录   &nbsp;&nbsp;每页 200 条`}}
      </div>
    </div>
    <Query @save="saveQuery" @register="registerQueryPage"/>
    <Excel @save="saveExcel" @register="registerExcelPage"/>
    <Print @save="loadPrint" @register="registerPrintPage"/>
  </div>
</template>
<script setup="props, {emit}" lang="ts">
import {BasicTable, useTable} from '/@/components/Table'
import {useModal} from '/@/components/Modal'
import {onMounted, reactive, ref} from 'vue'
import {
  CheckOutlined,
  EditOutlined,
  PicLeftOutlined,
  ProfileOutlined,
  SettingFilled,
  SortAscendingOutlined,
  SortDescendingOutlined,
  SyncOutlined
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
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {toThousandFilter} from "/@/views/boozsoft/gdzc/gu-ding-zi-chan-add/calculation";
import {
  findAllByCcodeAndBillStyle, findAllMainsList,
  findByTypeList,
  findByTypeLists,
  findCangkuAllList,
  findStockAllList, getPYRKDAndNoBcheck1
} from "/@/api/record/system/stock-wareh";
import {getPsnList} from "/@/api/record/system/psn";
import {findAllByFlag} from "/@/api/record/supplier_data/supplier";
import {findAll} from "/@/api/caozuoyuan/caozuoyuan";
import Query from './popup/query.vue'
import Print from './popup/print.vue'
//导入
import Excel from './popup/excel.vue'
//导出
/**********************汇总栏目设置**********************/
import {
  delRuKu,
  findBillByCondition,
  findBillCode, findByStockPeriodIsClose,
  reviewSetCGRKG,
  reviewSetCGRKGMx,
  saveStockCurrentstockZTRK_Edit_XCL,
  saveStockCurrentstockZTRK_Increase,
  verifyXyCsourceByXyCode,
  xyCsourceSave
} from "/@/api/record/stock/stock-ruku";

import {
  findAllMainList,
} from "/@/api/record/stock/stock-rktzd";
import {
  delCGDHDverifyZTRKSum,
  editByIdZTRK,
  subtractZTRKSum
} from "/@/api/record/stock/stock-currents";
import {findCangkuJoinName} from "/@/api/record/stock/stock-cangku-level-record";
import { exportExcel5} from "/@/api/record/generalLedger/excelExport";
import {assemblyDynamicColumn} from "./data";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {cloneDeep} from "lodash-es";
import {useNewPrint} from "/@/utils/boozsoft/print/print";
import {tableStyle} from "/@/store/modules/abc-print";
import {
  getByStockBalanceTask,
  stockBalanceTaskEditNewTime
} from "/@/api/record/stock/stock_balance";
import { Loading } from '/@/components/Loading';
import {saveLog} from "/@/api/record/system/group-sys-login-log";

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

const windowHeight = (window.innerHeight - (300))
const {closeCurrent} = useTabs(router);
const summaryTotals = ref({})
const formItems = ref({
  selectType: '1'
})

const [registerQueryPage, {openModal: openQueryPage}] = useModal()
const [registerPrintPage, {openModal: openPrintPage}] = useModal()

const openPrint = () => {
  openPrintPage(true, {})
}
const showPaginationText = ref(false)

const loadPrint = (obj) => {
  loadMark.value = true
  const data = tableData1.value.filter(a=>a.bcheck!='11')
  let printList: any = []

  let printUser = ''
  let bcheck = ''
  let buname=hasBlank(formItems.value.buname)?'':formItems.value.buname
  if(obj.printUser){
    printUser = '制表人：' + useUserStoreWidthOut().getUserInfo.username
  }
  if(obj.bcheck){
    bcheck = '审核人：' + buname
  }

  let squantity=0
  let isum=0
  data.forEach((item,index) => {
    let item1 = {}
    item1[0] = index+1
    item1[1] = item.ddate
    item1[2] = setString(item.ccode,15)
    item1[3] = item.custCode
    item1[4] = setString(item.custName,10)
    item1[5] = item.psnName
    item1[6] = item.deptName
    item1[7] = item.cwhcodeUserName
    item1[8] = setString(item.cwhcodeNameJoin,10)
    item1[9] = toThousandFilter(item.squantity)
    item1[10] = toThousandFilter(item.isum)
    item1[11] = item.cmakerName
    item1[12] = item.buname
    squantity+=parseFloat(item.squantity)
    isum+=parseFloat(item.isum)
    printList.push(item1)
  })
  for (let i=0; i<printList.length%27; i++){
    let item1 = {}
    item1[0] = ''
    item1[1] = ''
    item1[2] = ''
    item1[3] = ''
    item1[4] = ''
    item1[5] = ''
    item1[6] = ''
    item1[7] = ''
    item1[8] = ''
    item1[9] = ''
    item1[10] = ''
    item1[11] = ''
    item1[12] = ''
    if(printList.length%27==26){
      item1[1] = '合计'
      item1[9] = toThousandFilter(squantity)
      item1[10] = toThousandFilter(isum)
    }
    printList.push(item1)
  }

  let num = Math.ceil(printList.length/27)
  useNewPrint({data: ['l', 'px', 'a4', true]}, (doc) => {
    loadMark.value = false
    doc.autoTable({
      head: [['', '', '', '', '调拨单列表', '', '', '', '', '', '', '', ''],
        ['核算单位：' + pageParameter.companyName, '', '','', '期间：'+ strDate.value+' - '+endDate.value ,'', '', '', '', '','', '', '单位：元'],
        ['序号', '单据日期', '单据编号', '供应商编码', '供应商名称', '业务员', '业务部门','库管员', '仓库', '数量合计', '价税合计', '经手人', '审核人']],
      body: printList,
      styles: tableStyle(),
      margin: {
        left: 35,
        top: 20,
      },
      addPageContent: (data) => {
        let tabHeigth = data.table.height,
          tabMarginTop = data.settings.margin.top,
          tabSize = data.table.finalY - tabMarginTop,//表格最大Y轴-表格顶部距离得到每页表格的最大值
          tabMarginLeft = data.settings.margin.left;
        if (data.table.finalY)//是否分页 有分页时才有该属性finalY
          if (data.pageNumber != Math.ceil(tabHeigth / tabSize)) return;//如果需要每一页都显示页尾则注释该行代码
        data.doc.setFontSize(9)
        data.doc.setFont('fuhuiR', 'bold')
        doc.autoTableText(
          printUser,
          tabMarginLeft,
          data.cursor.y + 3,
          0
        );
        doc.autoTableText(
          bcheck,
          data.cursor.x/2-25,
          data.cursor.y + 3,
          0
        );
        doc.autoTableText(
          '第'+data.doc.getCurrentPageInfo().pageNumber+'页/共'+num+'页',
          data.cursor.x - 50,
          data.cursor.y + 3,
          0
        );
      },
      didParseCell(data) {
        data.cell.styles.cellPadding = {top: 3, left: 2, right: 2, bottom: 2}
        data.cell.styles.fillColor = [255, 255, 255]
        data.cell.styles.fontSize = 9
        data.cell.styles.lineColor = [150, 150, 150]

        if (data.section == 'head' && data.row.index == 0) {
          data.cell.styles.fontSize = 20
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.lineColor = [255, 255, 255]
          if (data.column.index == 4) {
            data.cell.colSpan = 3
            data.cell.styles.halign = 'right'
          }
        }
        if (data.section == 'head' && data.row.index == 1) {
          data.cell.styles.fontSize = 10
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.lineColor = [255, 255, 255]
          if (data.column.index == 0) {
            data.cell.colSpan = 3
            data.cell.styles.halign = 'left'
          } else if (data.column.index == 4) {
            data.cell.colSpan = 3
            data.cell.styles.cellPadding = {left: 20}
            data.cell.styles.halign = 'center'
          }else {
            data.cell.styles.halign = 'right'
          }
        }
        if (data.section == 'head' && data.row.index == 2) {
          data.cell.styles.fontSize = 10
          data.cell.styles.cellPadding = {top: 4, left: 2, right: 2, bottom: 3}
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.fillColor = [230, 230, 230]
          data.cell.styles.halign = 'center'
        }
        if (data.section == 'body'){
          if (data.row.index%2==1) {
            data.cell.styles.fillColor = [240,240,240]
          }
        }
      },
      columnStyles: {
        0: {maxHeight: 10,cellWidth: 30, halign: 'center'},
        1: {cellWidth: 50, halign: 'left'},
        2: {cellWidth: 60, halign: 'left'},
        3: {cellWidth: 50, halign: 'left'},
        4: {cellWidth: 50, halign: 'left'},
        5: {cellWidth: 40, halign: 'left'},
        6: {cellWidth: 40, halign: 'right'},
        7: {cellWidth: 40, halign: 'left'},
        8: {cellWidth: 50, halign: 'left'},
        9: {cellWidth: 50, halign: 'right'},
        10: {cellWidth: 50, halign: 'right'},
        11: {cellWidth: 35, halign: 'left'},
        12: {cellWidth: 35, halign: 'left'},
      }
    })
  })
}
//js切割字符串
function setString(str, len) {
  var strlen = 0;
  var s = "";
  for (var i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 128) {
      strlen += 2;
    } else {
      strlen += 1.2;
    }
    s += str.charAt(i);
    if (strlen >= len) {
      return s+"...";
    }
  }
  return s;
}

//文件导入
const val = ref({
  openOne: 0,
  total: 0
})
const openQuery = async () => {
  val.value.openOne = 0
  openQueryPage(true, {
    data: val
  })
}

const strDate:any = ref('');
const endDate:any = ref('');
const popData=ref('')
const dataType=ref('')
const coCode = ref('')
const companyName = ref('')
async function saveQuery(data) {
  if(data.strDate.length>6){
    strDate.value=data.strDate.replaceAll('-','.')
    endDate.value=data.endDate.replaceAll('-','.')
  }
  pageParameter.strDate = strDate.value
  pageParameter.endDate = endDate.value

  pageParameter.ccode =  data.ccode
  pageParameter.dataType =   data.dataType
  pageParameter.user =  data.user
  pageParameter.dept =  data.dept
  iyear.value = data.iyear
  dynamicTenantId.value  = data.database
  coCode.value =data.coCode
  companyName.value =data.companyName
  popData.value=data
  tablesData1()

  let logmap={
    loginTime:new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "),
    userId: useUserStoreWidthOut().getUserInfo.username,
    userName: useUserStoreWidthOut().getUserInfo.realName,
    optModule:'stock',
    optFunction:'入库调整单',
    uniqueCode:'',
    optAction:'查询',
    accId:dynamicTenantId.value,
    optContent:'操作内容【入库调整单】,账套代码【'+data.coCode+'】,账套名称【'+data.companyName+'】 下条件为：' +
      '日期【'+ pageParameter.strDate +'-'+ pageParameter.endDate +'】'+
      '单据编码【'+ data.ccode  +'】'+
      '业务部门【'+ data.dept  +'】'+
      '业务人员【'+ data.user  +'】'+
      '审核状态【'+ data.dataType +'】'+
      '的形态转换列表',
  }
  await saveLog(logmap)
}

const typeFlag = ref('1')

const dynamicTenantId = ref(getCurrentAccountName(true))
const defaultAdName = ref(useCompanyOperateStoreWidthOut().getSchemaName)

const tableData:any = ref([]);
const tableDataAll:any = ref([]);
const tableData1:any = ref([]);
const tableDataAll1:any = ref([]);
const loadMark = ref(false)

async function getCKName(id) {
  let str=''
  let cangkuJoinName=await useRouteApi(findCangkuJoinName,{schemaName: dynamicTenantId})(  {id:id})
  if(cangkuJoinName.length>0){
    str=cangkuJoinName[0].cangkuRecordJoinName
  }
  return str
}
async function reloadTable(){
  loadMark.value = true
  tablesData1()
  loadMark.value = false
}

const squantitySum =ref('')
const isumSum =ref('')
async function tablesData1(){
  showPaginationText.value = false
  popData.value.bdocumStyle=dataType.value
  tableDataAll1.value = await useRouteApi(findAllMainList,{schemaName: dynamicTenantId})(popData.value)
  for (let i = 0; i < tableDataAll1.value.length; i++) {
    let temp=await getCKName(tableDataAll1.value[i].cwhcode)
    tableDataAll1.value[i].cwhcodeNameJoin=temp
  }
  assembleTotal(tableDataAll1.value)
  tableData1.value = tableDataAll1.value
  let len = tableData1.value.length
  paginationNumber.value = len

  let len1 = tableData1.value.length
  for (let i = 0; i < (50 - len1); i++) {
    tableData1.value.push({bcheck:'11'})
  }

  let squantity=tableDataAll1.value.filter(a=>!hasBlank(a.id)).map(a=>a.squantity)
  let isum=tableDataAll1.value.filter(a=>!hasBlank(a.id)).map(a=>a.icost)
  squantitySum.value=sumArr(squantity)
  isumSum.value=sumArr(isum)
  await setPagination1({
    total: tableData1.value.length
  })
  showPaginationText.value = true
}

const assembleTotal = (list) => {
  let squantity = 0
  let icost = 0
  for (let o of list) {
    squantity += parseFloat(o.squantity || '0')
    icost += parseFloat(o.icost || '0')
  }
  summaryTotals.value=
    {
      squantity: toThousandFilter(squantity),
      icost: toThousandFilter(icost),
    }
}
const paginationNumber = ref(0)
const psnList:any = ref([])
const supplierList:any = ref([])
const cangkuList:any = ref([])
const userList:any = ref([])
const stockList:any = ref([])
async function reloadList() {

}

const CrudApi1 = {
  columns: [
    {
      title: '状态',
      dataIndex: 'bcheck',
      width: 80,
      align: 'left',
      ellipsis: true,fixed: 'left',
      slots: { customRender: 'bcheck' }
    },
    {
      title: '单据日期',
      dataIndex: 'ddate',
      width: 100,
      align: 'left',
      ellipsis: true,fixed: 'left',
    },
    {
      title: '单据编号',
      dataIndex: 'ccode',
      width: 100,
      align: 'left',fixed: 'left',
      ellipsis: true,slots: { customRender: 'ccode' }
    },
    {
      title: '仓库',
      dataIndex: 'cwhcode',
      width: 100,
      align: 'left',fixed: 'left',
      ellipsis: true,slots: { customRender: 'cwhcode' }
    },
    {
      title: '业务部门',
      dataIndex: 'deptName',
      width: 150,
      align: 'left',
      ellipsis: true,
    },
    {
      title: '业务员',
      dataIndex: 'personName',
      width: 150,
      align: 'left',
      ellipsis: true,
    },
    {
      title: '备注',
      dataIndex: 'cmemo',
      width: 150,
      align: 'left',
      ellipsis: true,
    },
    {
      title: '审核人',
      dataIndex: 'buname',
      width: 150,
      align: 'left',
      ellipsis: true,
    },
  ]
}

function toRouter(data,type) {
  if(type=='list'){
    router.push({path: '/cb-depot',query: {ccode:data.ccode}});
  }
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
const [registerTable1, {
  reload: reload1,
  getDataSource: getDataSource1,
  setTableData: setTableData1,
  setPagination: setPagination1,
  getPaginationRef: getPaginationRef1,
  getColumns,
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
  showRulesSize: 'MIN'
})

function onSearch() {
}

const defaultPage = ref(false)
onMounted(async() => {
  val.value.openOne = 1
  openQueryPage(true, {
    data: val,
  })
})

const [registerExcelPage, {openModal: openExcelPage}] = useModal()
//文件导入
const openExcel = async () => {
  openExcelPage(true, {})
}

async function saveExcel(data) {}

const excelThisData = () =>{
  const arrData:any = []
  const columns = getColumns()
  console.log(columns)
  columns.forEach((a,index)=>{
    let temp=tableData1.value[index]
    if(!hasBlank(temp.id)){
      arrData.push(temp)
    }
  })
  if(arrData.length==0)return message.error('没有数据,无法导出!!')

  const tHeader:any = []
  const keys:any = []
  //样式靠右列
  let rightrow:any=[]
  //样式靠左列
  let leftrow:any=[]

  const cell = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
  columns.forEach((v,index)=>{
    if(index != 0){
      keys.push(v.key)
      tHeader.push(v.title)
    }
  })

  let list:any=[]
  arrData.filter(a=>a.bcheck!=='11').forEach((a,index)=>{
    a.bcheck=a.bcheck=='1'?'已审核':'未审核'
    a.ddate=a.ddate==null?'':a.ddate
    a.ccode=a.ccode==null?'':a.ccode
    a.cwhcode=a.cwhcode==null?'':a.cwhcode
    a.cwhcoderk=a.cwhcoderk==null?'':a.cwhcoderk
    a.deptName=a.deptName==null?'':a.deptName
    a.personName=a.personName==null?'':a.personName
    a.cwhcodeUserName=a.cwhcodeUserName==null?'':a.cwhcodeUserName
    a.cmemo=a.cmemo==null?'':a.cmemo
    a.buname=a.buname==null?'':a.buname
    list.push(a)
  })
  console.log(list)
  console.log(keys)
  const sheet =[
    {
      title:'调拨单列表',
      tHeader:tHeader,
      table: list,
      keys: keys,
      sheetName: 'sheet1',
      cellStyle: [],
      rightrow:rightrow,
      leftrow:leftrow,
    },
  ]
  exportExcel5(sheet, 'xlsx','调拨单列表_'+pageParameter.companyName)
}
const excelMxData = async () => {}

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

const pageReload1 = () => {
  reloadTable()
}
/*汇总栏目设置end*/


const dynamicAdReload = async (obj) => {
  // const dataBase:any = await findDataBase(obj.accId,obj.year)
  dynamicTenantId.value = obj.accountMode
  defaultAdName.value = obj.accId
  // 底部分页信息
  pageParameter.thisAdInfo = {}
  pageParameter.thisAdInfo = obj
  pageParameter.dynamicTenantId = obj.accountMode
  pageParameter.defaultAdName = obj.accId
  pageParameter.companyName = obj.companyName
  pageParameter.year = obj.year
  await reloadList()
}
function editFun() {
  if(state.selectedRowKeys.length!==1){
    message.error("只能选择一条数据修改！")
    return false
  }
  let data=getDataSource1().filter(g=>state.selectedRowKeys.indexOf(g.key)!=-1)
  router.push({path: '/kc-cgDepot',query: {type:'edit',ccode:data[0].ccode}});
}
async function delFun() {
  createConfirm({
    iconType: 'warning',
    title: '采购入库单删除',
    content: '您确定要进行采购入库单删除吗!',
    onOk: async () => {
      loadMark.value=true
      let data=getDataSource1().filter(g=>g.id!=null&&state.selectedRowKeys.indexOf(g.key)!=-1)
      let bcheck=data.filter(f=>f.bcheck=='1');
      if(bcheck.length>0){
        loadMark.value=false
        return message.error('只能删除未审核的单据！')
      }

      for (let i = 0; i < data.length; i++) {
        // 明细
        let listmx=await useRouteApi(findAllByCcodeAndBillStyle, {schemaName: dynamicTenantId})({ccode:data[i].ccode,type:'CGRKD'})
        // 不允许零出库
        if(hasBlank(pageParameter.thisAdInfo.target.kcIsLck) || pageParameter.thisAdInfo.target.kcIsLck=='0'){
          // 校验 是否【现存量+在途入库-在途出库-删除数量 > 删除数量】
          let verify=await useRouteApi(delCGDHDverifyZTRKSum, {schemaName: dynamicTenantId})({list:JSON.stringify(listmx)})
          if(verify!==''){
            message.error('存货编码【'+verify+'】,可用量不足，不能删除当前入库单，请增加该存货可用量后重试！')
            return false
          }
        }
        // 返回现存量ID 进行 在途入库数量相减
        let subtract=await useRouteApi(subtractZTRKSum, {schemaName: dynamicTenantId})({list:JSON.stringify(listmx)})
        for (let i = 0; i < subtract.length; i++) {
          await useRouteApi(editByIdZTRK, {schemaName: dynamicTenantId})({id:subtract[i].id,ztrk:subtract[i].number,ztrk1:subtract[i].number1,ztrk2:subtract[i].number2})
        }
        await useRouteApi(delRuKu, {schemaName: dynamicTenantId})({id: data[i].id})
      }
      message.success('删除成功！')
      loadMark.value=false
      await tablesData1()
    }
  });
}

function sumArr(arr) {
  if(arr.length==0)return
  return arr.reduce(function(prev, curr, idx, arr){
    return parseFloat(prev) + parseFloat(curr);
  });
}
// 随机数
function randomString(length) {
  var str = '0123456789abcdefghijklmnopqrstuvwxyz';
  var result = '';
  for (var i = length; i > 0; --i)
    result += str[Math.floor(Math.random() * str.length)];
  return result;
}

const compState = reactive({
  absolute: false,
  loading: false,
  tip: '加载中...',
});
const iyear = ref('2022')

const toAudit = async () => {
  if (checkRow.value.length == 1) {
    if(checkRow.value[0].bcheck === '1'){
      message.error("已审核请勿重复审核！")
      return
    }
    //校验
    compState.loading = true
    let date1:any = useCompanyOperateStoreWidthOut().getLoginDate
    //  1 日期是否已结账
    let temp=await useRouteApi(findByStockPeriodIsClose, {schemaName: dynamicTenantId})({iyear:date1.split('-')[0],month:date1.split('-')[1]})
    console.log('入库单操作：1--->日期是否已结账-->'+temp)
    if(temp>0){
      compState.loading = false
      return message.error('当前业务日期期间已经结账，不能进行单据新增操作，请取消结账后后重试！！')
    }
    //  2 结账操作
    let jzMethod= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:iyear.value,name:'月末结账',method:'月末结账'})
    console.log('入库单操作：2--->结账操作-->'+jzMethod)
    if(!hasBlank(jzMethod)){
      compState.loading = false
      return message.error('提示：操作员'+jzMethod.caozuoName+'正在对当前账套进行月末结账处理，不能进行单据新增操作，请销后再试！')
    }

    //  3 盘点处理
    let pd= await useRouteApi(getPYRKDAndNoBcheck1, { schemaName: dynamicTenantId })(iyear.value)
    console.log('入库单操作：3--->盘点处理-->'+pd)
    if(pd>0){
      return message.error('正在进行盘点处理，不能进行单据新增操作，请销后再试！')
    }

    let a = useUserStoreWidthOut().getUserInfo.id
    if (!hasBlank(a) && !hasBlank(checkRow.value[0].id))  {
      // 审核
      let b = true
      let bcheck=b?'1':'0'
      let bcheckTime=b?new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "):''
      let bcheckUser=b?a:''
      checkRow.value[0].bcheck=bcheck
      checkRow.value[0].bcheckTime=bcheckTime
      checkRow.value[0].bcheckUser=bcheckUser
      await useRouteApi(reviewSetCGRKG, {schemaName: dynamicTenantId})(checkRow.value[0])
      saveLogData('审核',checkRow.value[0].ccode)
      message.success(`${b?'审核':'弃审'}成功！`)
      reloadTable()
      compState.loading = false
    } else {
      if (hasBlank(a)) message.error('获取用户信息异常！')
    }
  } else {
    createWarningModal({
      iconType: 'warning',
      title: '编辑',
      content: '请选择一条进行编辑！'
    })
  }
}
const toAuditBack = async () => {
  //判断范围
  if (checkRow.value.length == 1) {
    if(checkRow.value[0].bcheck != '1'){
      message.error("未审核不能弃审！")
      return
    }
    //校验
    compState.loading = true
    let date1:any = useCompanyOperateStoreWidthOut().getLoginDate
    //  1 日期是否已结账
    let temp=await useRouteApi(findByStockPeriodIsClose, {schemaName: dynamicTenantId})({iyear:date1.split('-')[0],month:date1.split('-')[1]})
    console.log('入库单操作：1--->日期是否已结账-->'+temp)
    if(temp>0){
      compState.loading = false
      return message.error('当前业务日期期间已经结账，不能进行单据新增操作，请取消结账后后重试！！')
    }
    //  2 结账操作
    let jzMethod= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:iyear.value,name:'月末结账',method:'月末结账'})
    console.log('入库单操作：2--->结账操作-->'+jzMethod)
    if(!hasBlank(jzMethod)){
      compState.loading = false
      return message.error('提示：操作员'+jzMethod.caozuoName+'正在对当前账套进行月末结账处理，不能进行单据新增操作，请销后再试！')
    }

    //  3 盘点处理
    let pd= await useRouteApi(getPYRKDAndNoBcheck1, { schemaName: dynamicTenantId })(iyear.value)
    console.log('入库单操作：3--->盘点处理-->'+pd)
    if(pd>0){
      compState.loading = false
      return message.error('正在进行盘点处理，不能进行单据新增操作，请销后再试！')
    }
    let a = useUserStoreWidthOut().getUserInfo.id
    if (!hasBlank(a) && !hasBlank(checkRow.value[0].id)) {
      // 审核
      let b = false
      let bcheck=b?'1':'0'
      let bcheckTime=b?new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "):''
      let bcheckUser=b?a:''
      checkRow.value[0].bcheck=bcheck
      checkRow.value[0].bcheckTime=bcheckTime
      checkRow.value[0].bcheckUser=bcheckUser
      await useRouteApi(reviewSetCGRKG, {schemaName: dynamicTenantId})(checkRow.value[0])
      saveLogData('审核',checkRow.value[0].ccode)
      message.success(`${b?'审核':'弃审'}成功！`)
      reloadTable()
      compState.loading = false
    }else {
      if (hasBlank(a)) message.error('获取用户信息异常！')
    }
  } else {
    createWarningModal({
      iconType: 'warning',
      title: '编辑',
      content: '请选择一条进行编辑！'
    })
  }
}

async function delList() {
  if (checkRow.value.length > 0) {

    // 有无 整理现存量 任务
    let xclTaskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:iyear.value,name:'整理现存量',method:'整理现存量'})
    if(!hasBlank(xclTaskData)){
      return message.error('系统正在进行现存量整理操作，不能进行单据处理，请销后再试！')
    }
    // 结账操作
    let jzMethod= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:iyear.value,name:'月末结账',method:'月末结账'})
    if(!hasBlank(jzMethod)){
      return message.error('提示：操作员'+jzMethod.caozuoName+'正在对当前账套进行月末结账处理，不能进行单据新增操作，请销后再试！')
    }
    // 任务
    let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:iyear.value,name:'入库调整单',method:'修改,审核,删除',recordNum:formItems.value.ccode})
    if(!hasBlank(taskData)){
      for (let i = 0; i < taskData.length; i++) {
        // 任务不是当前操作员的
        if(taskData[i]?.caozuoUnique!==useUserStoreWidthOut().getUserInfo.username){
          return createWarningModal({ content: '当前单据正在被操作员'+taskData[i]?.username+'正在'+taskData[i]?.method+'任务互斥,不能同时进行操作！' });
        }
      }
      await useRouteApi(stockBalanceTaskEditNewTime, { schemaName: dynamicTenantId })(taskData.id)
    }

    createConfirm({
      iconType: 'error',
      title: '警告',
      content: '删除后数据将不能恢复，你确认要删除吗?',
      onOk: async () => {
        for (let i = 0; i < checkRow.value.length; i++) {
          const item = checkRow.value[i]
          //已审核不能修改
          if(checkRow.value[i].bcheck ==='1'){
            message.error("已审核单据不能删除！")
            return
          }
          await useRouteApi(delRuKu, {schemaName: dynamicTenantId})({id: item.id})
          saveLogData('删除',item.ccode)
          /************** 记录操作日志 ****************/
          saveLogData('删除',item.ccode)
          /************** 记录操作日志 ****************/
        }
        checkRow.value = []
        state.selectedRowKeys = []
        message.success('删除成功！')
        reloadTable()
      },
      onCancel: () => {
        return false
      }
    })
  } else {
    createWarningModal({
      iconType: 'warning',
      title: '删除',
      content: '请选择需要删除的内容！'
    })
  }
}

async function saveLogData(optAction,ccode) {
  let logmap={
    loginTime:new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "),
    userId: useUserStoreWidthOut().getUserInfo.username,
    userName: useUserStoreWidthOut().getUserInfo.realName,
    optModule:'stock',
    optFunction:'入库调整单',
    uniqueCode:ccode,
    optAction:optAction,
    accId:dynamicTenantId.value,
    optContent:'操作内容【入库调整单】,单据编号【'+ccode+'】',
  }
  await saveLog(logmap)
}
</script>
<style src="./global-menu-index.less" lang="less" scoped></style>
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
  border-color: #aaaaaa !important;
}

.a-table-font-size-12 :deep(td),
.a-table-font-size-12 :deep(th) {
  font-size: 13px !important;
  padding: 2px 8px !important;
  border-color: #aaaaaa !important;
}

.app-container:nth-of-type(1) {
  background-color: #f2f2f2;
  padding: 10px 5px;
  margin: 10px 10px 5px;
}

.app-container:nth-of-type(2) {
  padding: 0px;
  margin: 0px 10px;
  background: #b4c8e3 !important;
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
  margin: 0!important;
}

:deep(.vben-basic-table){
  min-height: 500px;
  height: calc(100% - 160px);
  margin-bottom: 20px;
}

:deep(.ant-input),:deep(.ant-select),:deep(.ant-btn){
  border: 1px solid #c9c9c9;
}

.lcr-theme-div{
  display: inline-flex;justify-content: space-between;width: 99%;height: 100px;
  >div:nth-of-type(1){
    width: 40%;
    position: relative;
    >div:nth-of-type(1){width: 64px;display: inline-block;text-align: center;    top: 12px;
      position: inherit
    }
    >div:nth-of-type(2){
      width: calc( 100% - 64px);display: inline-block;
    }
  }
  >div:nth-of-type(2){
    width: 20%;text-align:center;
    >div:nth-of-type(2){margin-top: 14px;}
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
  }
}
:deep(.nc-summary) {
  font-size: 14px;
  font-weight: bold;
  width: 100%;

  > div {
    display: inline-block;
    background-color: #d8d8d8;
    padding: 5px;
  }
  > div:nth-of-type(1) {
    width: 59.5%;
    text-align: center;
  }

  > div:nth-of-type(2) {
    width: 20%;
    margin: 0 1px;
    text-align: left;
  }
  > div:nth-of-type(3) {
    width: 20%;
    margin: 0 1px;
    text-align: left;
  }
}

.app-container:nth-of-type(2) {
  padding: 0px;
  margin: 0px 10px;
  background: #b4c8e3 !important;
  position: relative;
  .pagination-text{
    position: absolute;
    bottom: 6px;
    right: 20%;
    font-size: 13px;
    color: black;
    z-index: 99999999;
  }
}
:deep(.ant-table-tbody) {
  tr.ant-table-measure-row{
    visibility: collapse !important;
  }
}
</style>
