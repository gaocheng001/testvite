<template>
  <div class="app-container">
        <!-- 请注释下行，不要删除下行，方便快速定位页面  -->
<!--   <div><textarea>应付账龄分析的页面</textarea>复制内容快速定位页面</div>-->
    <div class="app-container-top">

      <div class="app-container-head">
        <div class="container-head-title" style="float: left;">
          <b class="noneSpan" style="font-size: 60px;"><BarChartOutlined /></b>
        </div>
        <div class="container-head-title" style="padding-left: 35%;text-align: center;margin-top: 20px;">
          <b class="noneSpan" style="font-size: 26px;">应付账龄分析</b>
          <div style="font-size: 14px;text-align: center;margin-top: 30px;">
            <span style="font-size: 14px;font-weight: bold;">
              截止日期：{{endDate}}
            </span>
          </div>
        </div>
        <div class="ant-btn-group" style="float: right">
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="openQuery()"
          ><span>查询</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="excelData()"
          ><span>导出</span></button>
<!--          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="printData()"
          ><span>打印</span></button>-->
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="closeCurrent()"
          ><span>退出</span></button>
        </div>
      </div>

      <div style="clear: none"/>
      <div style="margin-top: -30px;margin-left: 80px;">
        <div style="display: inline-block;float: left;margin-left: 1%;margin-top: -20px;">
          <AccountPicker theme="three" readonly @reloadTable="dynamicAdReload"/>
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
          <Popover placement="bottom">
            <template #content>
                <span class="group-btn-span-special2" @click="bcheck = '';reloadTable()"
                      :style="bcheck===''?{backgroundColor: '#0096c7',color: 'white'}:''">
                &nbsp;全部&emsp;&emsp;&emsp;<CheckOutlined v-if="bcheck===''"/></span><br/>
              <span class="group-btn-span-special2" @click="bcheck = '1';reloadTable()"
                    :style="bcheck==='1'?{backgroundColor: '#0096c7',color: 'white'}:''">
                &nbsp;已审核&emsp;&emsp;<CheckOutlined v-if="bcheck==='1'"/></span>
              <br/>
              <span class="group-btn-span-special2" @click="bcheck = '0';reloadTable()"
                    :style="bcheck==='0'?{backgroundColor: '#0096c7',color: 'white'}:''">
                &nbsp;未审核&emsp;&emsp;<CheckOutlined v-if="bcheck==='0'"/></span>
            </template>
            <Button class="acttdrd-btn">
              <PicLeftOutlined :style="{ fontSize: '14px' }"/>
            </Button>
          </Popover>
        </div>
        <div style="float: right; position: relative">
          <Select v-model:value="formItems.selectType" style="width: 120px;font-size: 12px;" class="special_select">
            <SelectOption style="font-size: 12px;" value="1">单据编码</SelectOption>
            <SelectOption style="font-size: 12px;" value="2">供应商简称</SelectOption>
            <SelectOption style="font-size: 12px;" value="3">仓库</SelectOption>
            <SelectOption style="font-size: 12px;" value="4">存货名称</SelectOption>
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
    <div class="app-container-bottom">
      <BasicTable
        ref="tableRef"
        :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
        @register="registerTable"
        :dataSource="tableData"
        :scroll="{ x: totalColumnWidth,y: windowHeight }"
        :loading="loadMark"
        v-show="typeFlag=='0'"
      >
        <template #cvencodeJs="{ record }">{{formatCvencode(record.cvencodeJs)}}</template>
        <template #cvenNameJs="{ record }">{{formatCvenName(record.cvencodeJs)}}</template>
        <template #isum="{ record }">
          <a v-if="record.isum!=null && record.isum!=''" @click="openYsmx(record)">
            {{toThousandFilter(record.isum)}}
          </a>
        </template>
        <template #hxIsum="{ record }">
          <a v-if="record.hxIsum!=null && record.hxIsum!='' && record.hxIsum!=0" @click="openSkmx(record)">
            {{toThousandFilter(record.hxIsum)}}
          </a>
        </template>
        <template #whxIsum="{ record }">{{toThousandFilter(record.whxIsum)}}</template>
        <template #money1="{ record }">
          <span v-if="record.money1!=null && record.money1!='' && record.money1!=0">
            {{toThousandFilter(record.money1)}}
          </span>
        </template>
        <template #money2="{ record }">
          <span v-if="record.money2!=null && record.money2!='' && record.money2!=0">
            {{toThousandFilter(record.money2)}}
          </span>
        </template>
        <template #money3="{ record }">
          <span v-if="record.money3!=null && record.money3!='' && record.money3!=0">
            {{toThousandFilter(record.money3)}}
          </span>
        </template>
        <template #money4="{ record }">
          <span v-if="record.money4!=null && record.money4!='' && record.money4!=0">
            {{toThousandFilter(record.money4)}}
          </span>
        </template>
        <template #money5="{ record }">
          <span v-if="record.money5!=null && record.money5!='' && record.money5!=0">
            {{toThousandFilter(record.money5)}}
          </span>
        </template>
        <template #money6="{ record }">
          <span v-if="record.money6!=null && record.money6!='' && record.money6!=0">
            {{toThousandFilter(record.money6)}}
          </span>
        </template>
        <template #money7="{ record }">
          <span v-if="record.money7!=null && record.money7!='' && record.money7!=0">
            {{toThousandFilter(record.money7)}}
          </span>
        </template>
        <template #money8="{ record }">
          <span v-if="record.money8!=null && record.money8!='' && record.money8!=0">
            {{toThousandFilter(record.money8)}}
          </span>
        </template>
        <template #money9="{ record }">
          <span v-if="record.money9!=null && record.money9!='' && record.money9!=0">
            {{toThousandFilter(record.money9)}}
          </span>
        </template>
        <template #money10="{ record }">
          <span v-if="record.money10!=null && record.money10!='' && record.money10!=0">
            {{toThousandFilter(record.money10)}}
          </span>
        </template>

        <!--        <template #footer>
                  <div class="nc-summary">
                    <div>
                      <span>合计</span>
                    </div>
                    <div>
                      <span>应付金额:</span>
                      <span>&ensp;{{ toThousandFilter(isum) }}</span>
                    </div>
                    <div>
                      <span>已付金额:</span>
                      <span>&ensp;{{ toThousandFilter(hxIsum) }}</span>
                    </div>
                    <div>
                      <span>未付金额:</span>
                      <span>&ensp;{{ toThousandFilter(whxIsum) }}</span>
                    </div>
                    <div>
                      <span>开票金额:</span>
                      <span>&ensp;{{ toThousandFilter(kpIsum) }}</span>
                    </div>
                  </div>
                </template>-->
        <template #summary>
          <TableSummary fixed>
            <TableSummaryRow style="background-color: #cccccc;font-weight: bold;">
<!--              <TableSummaryCell :index="0" :align="'center'" style="background-color: #cccccc;font-weight: bold;"></TableSummaryCell>
              <TableSummaryCell :index="1" :align="'center'" style="background-color: #cccccc;font-weight: bold;"></TableSummaryCell>
              <TableSummaryCell :index="2" :align="'center'" style="background-color: #cccccc;font-weight: bold;"></TableSummaryCell>-->
              <TableSummaryCell :index="0" :colSpan="3" :align="'center'" style="background-color: #cccccc;font-weight: bold;">合&emsp;&emsp;计</TableSummaryCell>
              <TableSummaryCell :index="3" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{toThousandFilter(isum)}}</TableSummaryCell>
              <TableSummaryCell :index="4" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{toThousandFilter(hxIsum)}}</TableSummaryCell>
              <TableSummaryCell :index="5" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{toThousandFilter(whxIsum)}}</TableSummaryCell>
              <TableSummaryCell :index="6" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{toThousandFilter(money1)}}</TableSummaryCell>
              <TableSummaryCell :index="7" :align="'right'" style="background-color: #cccccc;font-weight: bold;"></TableSummaryCell>
              <TableSummaryCell :index="8" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{toThousandFilter(money2)}}</TableSummaryCell>
              <TableSummaryCell :index="9" :align="'right'" style="background-color: #cccccc;font-weight: bold;"></TableSummaryCell>
              <TableSummaryCell :index="10" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{toThousandFilter(money3)}}</TableSummaryCell>
              <TableSummaryCell :index="11" :align="'right'" style="background-color: #cccccc;font-weight: bold;"></TableSummaryCell>
              <TableSummaryCell :index="12" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{toThousandFilter(money4)}}</TableSummaryCell>
              <TableSummaryCell :index="13" :align="'right'" style="background-color: #cccccc;font-weight: bold;"></TableSummaryCell>
              <TableSummaryCell :index="14" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{toThousandFilter(money5)}}</TableSummaryCell>
              <TableSummaryCell :index="15" :align="'right'" style="background-color: #cccccc;font-weight: bold;"></TableSummaryCell>
              <TableSummaryCell :index="16" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{toThousandFilter(money6)}}</TableSummaryCell>
              <TableSummaryCell :index="17" :align="'right'" style="background-color: #cccccc;font-weight: bold;"></TableSummaryCell>
              <TableSummaryCell :index="18" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{toThousandFilter(money7)}}</TableSummaryCell>
              <TableSummaryCell :index="19" :align="'right'" style="background-color: #cccccc;font-weight: bold;"></TableSummaryCell>
              <TableSummaryCell :index="20" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{toThousandFilter(money8)}}</TableSummaryCell>
              <TableSummaryCell :index="21" :align="'right'" style="background-color: #cccccc;font-weight: bold;"></TableSummaryCell>
              <TableSummaryCell :index="22" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{toThousandFilter(money9)}}</TableSummaryCell>
              <TableSummaryCell :index="23" :align="'right'" style="background-color: #cccccc;font-weight: bold;"></TableSummaryCell>
              <TableSummaryCell :index="24" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{toThousandFilter(money10)}}</TableSummaryCell>
              <TableSummaryCell :index="25" :align="'right'" style="background-color: #cccccc;font-weight: bold;"></TableSummaryCell>
            </TableSummaryRow>
          </TableSummary>
        </template>
      </BasicTable>
      <div class="pagination-text" v-show="showPaginationText">
        共 {{paginationNumber}} 条记录&nbsp;&nbsp; 每页 1000 条
      </div>
    </div>
    <Query @save="saveQuery" @register="registerQueryPage"/>
  </div>
</template>
<script setup="props, {emit}" lang="ts">
import { BasicTable, useTable } from '/@/components/Table'
import { useModal } from '/@/components/Modal'
import {nextTick, onMounted, reactive, ref} from 'vue'
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
  UsbOutlined,
  PrinterOutlined,
  EditOutlined,
  BarChartOutlined
} from '@ant-design/icons-vue'
import {
  Select,
  Input,
  Popover,
  Button,
  Tag,
  message,
  Checkbox as ACheckbox,
  Radio as ARadio,
  Table as ATable,
  Popconfirm as APopconfirm,
} from 'ant-design-vue'
import {useMessage} from "/@/hooks/web/useMessage";
import {getCurrentAccountName, getThisIndexImg, hasBlank} from "/@/api/task-api/tast-bus-api";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {
 add,
 div, mul,
 sub,
 toThousandFilter
} from "../YingShouKuanQiChuYuE/calculation";
import Query from './popup/query.vue'
import {findAll as findCustAll} from "/@/api/record/supplier_data/supplier";

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
const openQuery = async () => {
  val.value.openOne = 0
  openQueryPage(true, {
    data: val
  })
}

const cvencode = ref('')
const endDate = ref('')
const apHexiaoAuto:any = ref()
const apSourceFlag:any = ref()
const apCheckFlag:any = ref()
async function saveQuery(data) {
  dynamicTenantId.value = data.dynamicTenantId
  defaultAdName.value = data.defaultAdName
  pageParameter.year = data.endDate.split('-')[0]
  endDate.value = data.endDate
  cvencode.value = data.cvencode
  bcheck.value = data.bcheck
  apHexiaoAuto.value = data.apHexiaoAuto
  apSourceFlag.value = data.apSourceFlag
  apCheckFlag.value = data.apCheckFlag
  await reloadList()
  await reloadTable()
}

const typeFlag = ref('0')

const dynamicTenantId = ref(getCurrentAccountName(true))
const defaultAdName = ref(useCompanyOperateStoreWidthOut().getSchemaName)

const tableData:any = ref([]);
const tableDataAll:any = ref([]);

const showPaginationText = ref(false)
const paginationNumber = ref(0)

const bcheck:any = ref('')
const loadMark = ref(false)
const isum:any = ref(0)
const hxIsum:any = ref(0)
const whxIsum:any = ref(0)
const money1:any = ref(0)
const money2:any = ref(0)
const money3:any = ref(0)
const money4:any = ref(0)
const money5:any = ref(0)
const money6:any = ref(0)
const money7:any = ref(0)
const money8:any = ref(0)
const money9:any = ref(0)
const money10:any = ref(0)
async function reloadTable(){
  loadMark.value = true
  showPaginationText.value = false
  let len = 0
  tableData.value = []
  tableDataAll.value = []
  if (hasBlank(endDate.value)) {
    endDate.value = useCompanyOperateStoreWidthOut().getLoginDate
  }
  await resetDynamicColumnData()
  const res = await useRouteApi(findYfdByEndDateList,{schemaName: dynamicTenantId})({bcheck:bcheck.value,iyear:pageParameter.year,endDate:endDate.value,apSourceFlag:apSourceFlag.value})
  const res1 = await useRouteApi(findFkdByEndDateList,{schemaName: dynamicTenantId})({bcheck:bcheck.value,iyear:pageParameter.year,endDate:endDate.value})
  tableDataAll.value = res.map(item =>{
    let item1:any = {}
    item1.cvencodeJs = item.cvencodeJs
    item1.cvenNameJs = item.cvencodeJs
    item1.isum = item.isum
    return item1
  })
  tableDataAll.value.forEach(item=>{
    res1.forEach(item1=>{
      if (item.cvencodeJs==item1.cvencode) {
        item.hxIsum = item1.isum
      }
    })
    item.whxIsum = sub(item.isum, item.hxIsum==null?'0':item.hxIsum)
    return item
  })
  if (agingRang.value.length>=1){
    let startDayNumber = agingRang.value[0].startDayNumber
    let date1 = getNextDate(endDate.value,-startDayNumber.split('-')[1])
    let date2 = getNextDate(endDate.value,-startDayNumber.split('-')[0])
    const list = await useRouteApi(findYfdByDateList, {schemaName: dynamicTenantId})({
      bcheck:bcheck.value,
      iyear:pageParameter.year,
      ddate1:date1,
      ddate2:date2,
      apSourceFlag:apSourceFlag.value
    })
    tableDataAll.value.forEach(item=>{
      list.forEach(item1=>{
        if (item.cvencodeJs==item1.cvencodeJs) {
          item.money1 = item1.isum
          if(item.isum!=null && item.isum!='' && item.isum != 0) {
            item.bili1 = ((item.money1 / item.isum)*100).toFixed(2)+'%'
          }
        }
      })
      return item
    })
    if(agingRang.value.length==1){
      let totalDayNumber = add(agingRang.value[0].totalDayNumber,1)
      let ddate = getNextDate(endDate.value,-totalDayNumber)
      const list1 = await useRouteApi(findYfdByEndDateList,{schemaName: dynamicTenantId})({bcheck:bcheck.value,iyear:pageParameter.year,endDate:ddate,apSourceFlag:apSourceFlag.value})
      tableDataAll.value.forEach(item=>{
        list1.forEach(item1=>{
          if (item.cvencodeJs==item1.cvencodeJs) {
            item.money2 = item1.isum
            if(item.isum!=null && item.isum!='' && item.isum != 0) {
              item.bili2 = ((item.money2 / item.isum)*100).toFixed(2)+'%'
            }
          }
        })
        return item
      })
    }
  }
  if (agingRang.value.length>=2){
    let startDayNumber = agingRang.value[1].startDayNumber
    let date1 = getNextDate(endDate.value,-startDayNumber.split('-')[1])
    let date2 = getNextDate(endDate.value,-startDayNumber.split('-')[0])
    const list = await useRouteApi(findYfdByDateList, {schemaName: dynamicTenantId})({
      bcheck:bcheck.value,
      iyear:pageParameter.year,
      ddate1:date1,
      ddate2:date2,
      apSourceFlag:apSourceFlag.value
    })
    tableDataAll.value.forEach(item=>{
      list.forEach(item1=>{
        if (item.cvencodeJs==item1.cvencodeJs) {
          item.money2 = item1.isum
          if(item.isum!=null && item.isum!='' && item.isum != 0) {
            item.bili2 = ((item.money2 / item.isum)*100).toFixed(2)+'%'
          }
        }
      })
      return item
    })
    if(agingRang.value.length==2){
      let totalDayNumber = add(agingRang.value[1].totalDayNumber,1)
      let ddate = getNextDate(endDate.value,-totalDayNumber)
      const list1 = await useRouteApi(findYfdByEndDateList,{schemaName: dynamicTenantId})({bcheck:bcheck.value,iyear:pageParameter.year,endDate:ddate,apSourceFlag:apSourceFlag.value})
      tableDataAll.value.forEach(item=>{
        list1.forEach(item1=>{
          if (item.cvencodeJs==item1.cvencodeJs) {
            item.money3 = item1.isum
            if(item.isum!=null && item.isum!='' && item.isum != 0) {
              item.bili3 = ((item.money3 / item.isum)*100).toFixed(2)+'%'
            }
          }
        })
        return item
      })
    }
  }
  if (agingRang.value.length>=3){
    let startDayNumber = agingRang.value[2].startDayNumber
    let date1 = getNextDate(endDate.value,-startDayNumber.split('-')[1])
    let date2 = getNextDate(endDate.value,-startDayNumber.split('-')[0])
    const list = await useRouteApi(findYfdByDateList, {schemaName: dynamicTenantId})({
      bcheck:bcheck.value,
      iyear:pageParameter.year,
      ddate1:date1,
      ddate2:date2,
      apSourceFlag:apSourceFlag.value
    })
    tableDataAll.value.forEach(item=>{
      list.forEach(item1=>{
        if (item.cvencodeJs==item1.cvencodeJs) {
          item.money3 = item1.isum
          if(item.isum!=null && item.isum!='' && item.isum != 0) {
            item.bili3 = ((item.money3 / item.isum)*100).toFixed(2)+'%'
          }
        }
      })
      return item
    })
    if(agingRang.value.length==3){
      let totalDayNumber = agingRang.value[2].totalDayNumber
      let ddate = getNextDate(endDate.value,-totalDayNumber)
      const list1 = await useRouteApi(findYfdByEndDateList,{schemaName: dynamicTenantId})({bcheck:bcheck.value,iyear:pageParameter.year,endDate:ddate,apSourceFlag:apSourceFlag.value})
      tableDataAll.value.forEach(item=>{
        list1.forEach(item1=>{
          if (item.cvencodeJs==item1.cvencodeJs) {
            item.money4 = item1.isum
            if(item.isum!=null && item.isum!='' && item.isum != 0) {
              item.bili4 = ((item.money4 / item.isum)*100).toFixed(2)+'%'
            }
          }
        })
        return item
      })
    }
  }
  if (agingRang.value.length>=4){
    let startDayNumber = agingRang.value[3].startDayNumber
    let date1 = getNextDate(endDate.value,-startDayNumber.split('-')[1])
    let date2 = getNextDate(endDate.value,-startDayNumber.split('-')[0])
    const list = await useRouteApi(findYfdByDateList, {schemaName: dynamicTenantId})({
      bcheck:bcheck.value,
      iyear:pageParameter.year,
      ddate1:date1,
      ddate2:date2,
      apSourceFlag:apSourceFlag.value
    })
    tableDataAll.value.forEach(item=>{
      list.forEach(item1=>{
        if (item.cvencodeJs==item1.cvencodeJs) {
          item.money4 = item1.isum
          if(item.isum!=null && item.isum!='' && item.isum != 0) {
            item.bili4 = ((item.money4 / item.isum)*100).toFixed(2)+'%'
          }
        }
      })
      return item
    })
    if(agingRang.value.length==4){
      let totalDayNumber = add(agingRang.value[3].totalDayNumber,1)
      let ddate = getNextDate(endDate.value,-totalDayNumber)
      const list1 = await useRouteApi(findYfdByEndDateList,{schemaName: dynamicTenantId})({bcheck:bcheck.value,iyear:pageParameter.year,endDate:ddate,apSourceFlag:apSourceFlag.value})
      tableDataAll.value.forEach(item=>{
        list1.forEach(item1=>{
          if (item.cvencodeJs==item1.cvencodeJs) {
            item.money5 = item1.isum
            if(item.isum!=null && item.isum!='' && item.isum != 0) {
              item.bili5 = ((item.money5 / item.isum)*100).toFixed(2)+'%'
            }
          }
        })
        return item
      })
    }
  }
  if (agingRang.value.length>=5){
    let startDayNumber = agingRang.value[4].startDayNumber
    let date1 = getNextDate(endDate.value,-startDayNumber.split('-')[1])
    let date2 = getNextDate(endDate.value,-startDayNumber.split('-')[0])
    const list = await useRouteApi(findYfdByDateList, {schemaName: dynamicTenantId})({
      bcheck:bcheck.value,
      iyear:pageParameter.year,
      ddate1:date1,
      ddate2:date2,
      apSourceFlag:apSourceFlag.value
    })
    tableDataAll.value.forEach(item=>{
      list.forEach(item1=>{
        if (item.cvencodeJs==item1.cvencodeJs) {
          item.money5 = item1.isum
          if(item.isum!=null && item.isum!='' && item.isum != 0) {
            item.bili5 = ((item.money5 / item.isum)*100).toFixed(2)+'%'
          }
        }
      })
      return item
    })
    if(agingRang.value.length==5){
      let totalDayNumber = add(agingRang.value[4].totalDayNumber,1)
      let ddate = getNextDate(endDate.value,-totalDayNumber)
      const list1 = await useRouteApi(findYfdByEndDateList,{schemaName: dynamicTenantId})({bcheck:bcheck.value,iyear:pageParameter.year,endDate:ddate,apSourceFlag:apSourceFlag.value})
      tableDataAll.value.forEach(item=>{
        list1.forEach(item1=>{
          if (item.cvencodeJs==item1.cvencodeJs) {
            item.money6 = item1.isum
            if(item.isum!=null && item.isum!='' && item.isum != 0) {
              item.bili6 = ((item.money6 / item.isum)*100).toFixed(2)+'%'
            }
          }
        })
        return item
      })
    }
  }
  if (agingRang.value.length>=6){
    let startDayNumber = agingRang.value[5].startDayNumber
    let date1 = getNextDate(endDate.value,-startDayNumber.split('-')[1])
    let date2 = getNextDate(endDate.value,-startDayNumber.split('-')[0])
    const list = await useRouteApi(findYfdByDateList, {schemaName: dynamicTenantId})({
      bcheck:bcheck.value,
      iyear:pageParameter.year,
      ddate1:date1,
      ddate2:date2,
      apSourceFlag:apSourceFlag.value
    })
    tableDataAll.value.forEach(item=>{
      list.forEach(item1=>{
        if (item.cvencodeJs==item1.cvencodeJs) {
          item.money6 = item1.isum
          if(item.isum!=null && item.isum!='' && item.isum != 0) {
            item.bili6 = ((item.money6 / item.isum)*100).toFixed(2)+'%'
          }
        }
      })
      return item
    })
    if(agingRang.value.length==6){
      let totalDayNumber = add(agingRang.value[5].totalDayNumber,1)
      let ddate = getNextDate(endDate.value,-totalDayNumber)
      const list1 = await useRouteApi(findYfdByEndDateList,{schemaName: dynamicTenantId})({bcheck:bcheck.value,iyear:pageParameter.year,endDate:ddate,apSourceFlag:apSourceFlag.value})
      tableDataAll.value.forEach(item=>{
        list1.forEach(item1=>{
          if (item.cvencodeJs==item1.cvencodeJs) {
            item.money7 = item1.isum
            if(item.isum!=null && item.isum!='' && item.isum != 0) {
              item.bili7 = ((item.money7 / item.isum)*100).toFixed(2)+'%'
            }
          }
        })
        return item
      })
    }
  }
  if (agingRang.value.length>=7){
    let startDayNumber = agingRang.value[6].startDayNumber
    let date1 = getNextDate(endDate.value,-startDayNumber.split('-')[1])
    let date2 = getNextDate(endDate.value,-startDayNumber.split('-')[0])
    const list = await useRouteApi(findYfdByDateList, {schemaName: dynamicTenantId})({
      bcheck:bcheck.value,
      iyear:pageParameter.year,
      ddate1:date1,
      ddate2:date2,
      apSourceFlag:apSourceFlag.value
    })
    tableDataAll.value.forEach(item=>{
      list.forEach(item1=>{
        if (item.cvencodeJs==item1.cvencodeJs) {
          item.money7 = item1.isum
          if(item.isum!=null && item.isum!='' && item.isum != 0) {
            item.bili7 = ((item.money7 / item.isum)*100).toFixed(2)+'%'
          }
        }
      })
      return item
    })
    if(agingRang.value.length==7){
      let totalDayNumber = add(agingRang.value[6].totalDayNumber,1)
      let ddate = getNextDate(endDate.value,-totalDayNumber)
      const list1 = await useRouteApi(findYfdByEndDateList,{schemaName: dynamicTenantId})({bcheck:bcheck.value,iyear:pageParameter.year,endDate:ddate,apSourceFlag:apSourceFlag.value})
      tableDataAll.value.forEach(item=>{
        list1.forEach(item1=>{
          if (item.cvencodeJs==item1.cvencodeJs) {
            item.money8 = item1.isum
            if(item.isum!=null && item.isum!='' && item.isum != 0) {
              item.bili8 = ((item.money8 / item.isum)*100).toFixed(2)+'%'
            }
          }
        })
        return item
      })
    }
  }
  if (agingRang.value.length>=8){
    let startDayNumber = agingRang.value[7].startDayNumber
    let date1 = getNextDate(endDate.value,-startDayNumber.split('-')[1])
    let date2 = getNextDate(endDate.value,-startDayNumber.split('-')[0])
    const list = await useRouteApi(findYfdByDateList, {schemaName: dynamicTenantId})({
      bcheck:bcheck.value,
      iyear:pageParameter.year,
      ddate1:date1,
      ddate2:date2,
      apSourceFlag:apSourceFlag.value
    })
    tableDataAll.value.forEach(item=>{
      list.forEach(item1=>{
        if (item.cvencodeJs==item1.cvencodeJs) {
          item.money8 = item1.isum
          if(item.isum!=null && item.isum!='' && item.isum != 0) {
            item.bili8 = ((item.money8 / item.isum)*100).toFixed(2)+'%'
          }
        }
      })
      return item
    })
    if(agingRang.value.length==8){
      let totalDayNumber = add(agingRang.value[7].totalDayNumber,1)
      let ddate = getNextDate(endDate.value,-totalDayNumber)
      const list1 = await useRouteApi(findYfdByEndDateList,{schemaName: dynamicTenantId})({bcheck:bcheck.value,iyear:pageParameter.year,endDate:ddate,apSourceFlag:apSourceFlag.value})
      tableDataAll.value.forEach(item=>{
        list1.forEach(item1=>{
          if (item.cvencodeJs==item1.cvencodeJs) {
            item.money9 = item1.isum
            if(item.isum!=null && item.isum!='' && item.isum != 0) {
              item.bili9 = ((item.money9 / item.isum)*100).toFixed(2)+'%'
            }
          }
        })
        return item
      })
    }
  }
  if (agingRang.value.length>=9){
    let startDayNumber = agingRang.value[8].startDayNumber
    let date1 = getNextDate(endDate.value,-startDayNumber.split('-')[1])
    let date2 = getNextDate(endDate.value,-startDayNumber.split('-')[0])
    const list = await useRouteApi(findYfdByDateList, {schemaName: dynamicTenantId})({
      bcheck:bcheck.value,
      iyear:pageParameter.year,
      ddate1:date1,
      ddate2:date2,
      apSourceFlag:apSourceFlag.value
    })
    tableDataAll.value.forEach(item=>{
      list.forEach(item1=>{
        if (item.cvencodeJs==item1.cvencodeJs) {
          item.money9 = item1.isum
          if(item.isum!=null && item.isum!='' && item.isum != 0) {
            item.bili9 = ((item.money9 / item.isum)*100).toFixed(2)+'%'
          }
        }
      })
      return item
    })
    if(agingRang.value.length==9){
      let totalDayNumber = add(agingRang.value[8].totalDayNumber,1)
      let ddate = getNextDate(endDate.value,-totalDayNumber)
      const list1 = await useRouteApi(findYfdByEndDateList,{schemaName: dynamicTenantId})({bcheck:bcheck.value,iyear:pageParameter.year,endDate:ddate,apSourceFlag:apSourceFlag.value})
      tableDataAll.value.forEach(item=>{
        list1.forEach(item1=>{
          if (item.cvencodeJs==item1.cvencodeJs) {
            item.money10 = item1.isum
            if(item.isum!=null && item.isum!='' && item.isum != 0) {
              item.bili10 = ((item.money10 / item.isum)*100).toFixed(2)+'%'
            }
          }
        })
        return item
      })
    }
  }
  tableDataAll.value = tableDataAll.value.filter(item => item.isum!='0' && item.hxIsum!='0' && item.whxIsum!='0')
  tableData.value = tableDataAll.value
  let num = 50-(tableDataAll.value.length%50)
  for (let i=0;i<num;i++){
    tableData.value.push({})
  }
  await setPagination({
    total: tableData.value.length
  })
  countTable()
  len = tableData.value.filter(item => item.cvencodeJs != null && item.cvencodeJs != '').length
  paginationNumber.value = len
  showPaginationText.value = true
  loadMark.value = false
  // const aa = getNextDate(endDate.value,-30)
  // console.log(aa)
}

// date 代表指定的日期，格式：2018-09-27
// day 传-1表始前一天，传1表始后一天
// JS获取指定日期的前一天，后一天
function getNextDate(date, day) {
  let dd = new Date(date);
  dd.setDate(dd.getDate() + day);
  let y = dd.getFullYear();
  let m = dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1;
  let d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
  return y + "-" + m + "-" + d;
}

function countTable(){
  isum.value = 0
  hxIsum.value = 0
  whxIsum.value = 0
  money1.value = 0
  money2.value = 0
  money3.value = 0
  money4.value = 0
  money5.value = 0
  money6.value = 0
  money7.value = 0
  money8.value = 0
  money9.value = 0
  money10.value = 0
  tableData.value.map(item=>{
    isum.value = add(isum.value,item.isum==null?'0':item.isum)
    hxIsum.value = add(hxIsum.value,item.hxIsum==null?'0':item.hxIsum)
    whxIsum.value = add(whxIsum.value,item.whxIsum==null?'0':item.whxIsum)
    money1.value = add(money1.value,item.money1==null?'0':item.money1)
    money2.value = add(money2.value,item.money2==null?'0':item.money2)
    money3.value = add(money3.value,item.money3==null?'0':item.money3)
    money4.value = add(money4.value,item.money4==null?'0':item.money4)
    money5.value = add(money5.value,item.money5==null?'0':item.money5)
    money6.value = add(money6.value,item.money6==null?'0':item.money6)
    money7.value = add(money7.value,item.money7==null?'0':item.money7)
    money8.value = add(money8.value,item.money8==null?'0':item.money8)
    money9.value = add(money9.value,item.money9==null?'0':item.money9)
    money10.value = add(money10.value,item.money10==null?'0':item.money10)
    return item
  })
}

const parameter = reactive({
  showRulesSize: 'MIN',
  companyCode: '',
  companyName: '',
  ifUnit: false,
  total: 0,
  thisAdInfo: {},
  thisLeftKey: '',
  flag:'1',
  database: dynamicTenantId.value,
  accId: defaultAdName.value,
  username: useUserStoreWidthOut().getUserInfo.username,
  uniqueCustclass:'',
  searchConditon: {
    requirement: 'custName',
    value: '',
  },
})

const customerList:any = ref([])
async function reloadList() {
  const res2 = await useRouteApi(findCustAll,{schemaName: dynamicTenantId})(parameter)
  customerList.value = res2.items
}

const CrudApi = {
  columns: [
    {
      title: '结算供应商编码',
      dataIndex: 'cvencodeJs',
      align: 'left',
      ellipsis: true,
      fixed: 'left',
      slots: { customRender: 'cvencodeJs'}
    },
    {
      title: '结算供应商名称',
      dataIndex: 'cvenNameJs',
      align: 'left',
      ellipsis: true,
      fixed: 'left',
      slots: { customRender: 'cvenNameJs'}
    },
    {
      title: '应付金额',
      dataIndex: 'isum',
      align: 'right',
      ellipsis: true,
      fixed: 'left',
      slots: { customRender: 'isum'}
    },
    {
      title: '已付金额',
      dataIndex: 'hxIsum',
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'hxIsum'}
    },
    {
      title: '未付金额',
      dataIndex: 'whxIsum',
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'whxIsum'}
    },
    {
      title: '1',
      dataIndex: 'num1',
      align: 'right',
      ellipsis: true,
      children:[
        {
          title: '金额',
          dataIndex: 'money1',
          width: 120,
          align: 'right',
          slots: { customRender: 'money1'}
        },
        {
          title: '比例',
          dataIndex: 'bili1',
          width: 80,
          align: 'right',
          slots: { customRender: 'bili1'}
        },
      ]
    },
    {
      title: '2',
      dataIndex: 'num2',
      align: 'right',
      ellipsis: true,
      children:[
        {
          title: '金额',
          dataIndex: 'money2',
          width: 120,
          align: 'right',
          slots: { customRender: 'money2'}
        },
        {
          title: '比例',
          dataIndex: 'bili2',
          width: 80,
          align: 'right',
          slots: { customRender: 'bili2'}
        },
      ]
    },
    {
      title: '3',
      dataIndex: 'num3',
      align: 'right',
      ellipsis: true,
      children:[
        {
          title: '金额',
          dataIndex: 'money3',
          width: 120,
          align: 'right',
          slots: { customRender: 'money3'}
        },
        {
          title: '比例',
          dataIndex: 'bili3',
          width: 80,
          align: 'right',
          slots: { customRender: 'bili3'}
        },
      ]
    },
    {
      title: '4',
      dataIndex: 'num4',
      align: 'right',
      ellipsis: true,
      children:[
        {
          title: '金额',
          dataIndex: 'money4',
          width: 120,
          align: 'right',
          slots: { customRender: 'money4'}
        },
        {
          title: '比例',
          dataIndex: 'bili4',
          width: 80,
          align: 'right',
          slots: { customRender: 'bili4'}
        },
      ]
    },
    {
      title: '5',
      dataIndex: 'num5',
      align: 'right',
      ellipsis: true,
      children:[
        {
          title: '金额',
          dataIndex: 'money5',
          width: 120,
          align: 'right',
          slots: { customRender: 'money5'}
        },
        {
          title: '比例',
          dataIndex: 'bili5',
          width: 80,
          align: 'right',
          slots: { customRender: 'bili5'}
        },
      ]
    },
    {
      title: '6',
      dataIndex: 'num6',
      align: 'right',
      ellipsis: true,
      children:[
        {
          title: '金额',
          dataIndex: 'money6',
          width: 120,
          align: 'right',
          slots: { customRender: 'money6'}
        },
        {
          title: '比例',
          dataIndex: 'bili6',
          width: 80,
          align: 'right',
          slots: { customRender: 'bili6'}
        },
      ]
    },
    {
      title: '7',
      dataIndex: 'num7',
      align: 'right',
      ellipsis: true,
      children:[
        {
          title: '金额',
          dataIndex: 'money7',
          width: 120,
          align: 'right',
          slots: { customRender: 'money7'}
        },
        {
          title: '比例',
          dataIndex: 'bili7',
          width: 80,
          align: 'right',
          slots: { customRender: 'bili7'}
        },
      ]
    },
    {
      title: '8',
      dataIndex: 'num8',
      align: 'right',
      ellipsis: true,
      children:[
        {
          title: '金额',
          dataIndex: 'money8',
          width: 120,
          align: 'right',
          slots: { customRender: 'money8'}
        },
        {
          title: '比例',
          dataIndex: 'bili8',
          width: 80,
          align: 'right',
          slots: { customRender: 'bili8'}
        },
      ]
    },
    {
      title: '9',
      dataIndex: 'num9',
      align: 'right',
      ellipsis: true,
      children:[
        {
          title: '金额',
          dataIndex: 'money9',
          width: 120,
          align: 'right',
          slots: { customRender: 'money9'}
        },
        {
          title: '比例',
          dataIndex: 'bili9',
          width: 80,
          align: 'right',
          slots: { customRender: 'bili9'}
        },
      ]
    },
    {
      title: '10',
      dataIndex: 'num10',
      align: 'right',
      ellipsis: true,
      children:[
        {
          title: '金额',
          dataIndex: 'money10',
          width: 120,
          align: 'right',
          slots: { customRender: 'money10'}
        },
        {
          title: '比例',
          dataIndex: 'bili10',
          width: 80,
          align: 'right',
          slots: { customRender: 'bili10'}
        },
      ]
    },
  ]
}

function formatCvencode(cvencode){
  let str = cvencode
  customerList.value.forEach(item=>{
    if(item.id==cvencode){
      str = item.custCode
    }
  })
  return str
}

function formatCvenName(cvencode){
  let str = cvencode
  customerList.value.forEach(item=>{
    if(item.id==cvencode){
      str = item.custName
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
  pagination: {
    pageSize: 1000,
    // showSizeChanger: false,
    simple:true,
    showTotal: t => `共${t}条记录    每页200条`
  },
  /*pagination: {
    pageSize: 50,
    showSizeChanger: true,
    pageSizeOptions: ['10', '25', '50', '100'],
    showTotal: t => `总共${t}条数据`
  },*/
  /*actionColumn: {
    width: 120,
    title: '操作',
    dataIndex: 'action',
    slots: {customRender: 'action'}
  }*/
})

//打开应付明细
function openYsmx(data){
  // console.log(data)
  router.push({
    path: '/YingFuZhang/ZhangBiao/ZhangBiaoMingXi/YingShouMingXiBiao',
    query: {
      dynamicTenantId:dynamicTenantId.value,
      defaultAdName:defaultAdName.value,
      year:pageParameter.year,
      ddate1:pageParameter.year+'-01-01',
      ddate2:endDate.value,
      cvencode:data.cvencodeJs,
      bcheck:bcheck.value,
      apHexiaoAuto:apHexiaoAuto.value,
      apSourceFlag:apSourceFlag.value,
      apCheckFlag:apCheckFlag.value,
    }
  })
}

//打开收款明细
function openSkmx(data){
  // console.log(data)
  router.push({
    path: '/YingFuZhang/ZhangBiao/ZhangBiaoMingXi/ShouKuanMingXiZhang',
    query: {
      dynamicTenantId:dynamicTenantId.value,
      defaultAdName:defaultAdName.value,
      year:pageParameter.year,
      ddate1:pageParameter.year+'-01-01',
      ddate2:endDate.value,
      cvencode:data.cvencodeJs,
      bcheck:bcheck.value,
      apHexiaoAuto:apHexiaoAuto.value,
      apSourceFlag:apSourceFlag.value,
      apCheckFlag:apCheckFlag.value,
    }
  })
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
  showRulesSize: 'MIN'
})

function onSearch() {
}

const defaultPage = ref(false)
onMounted(async() => {
  resetDynamicColumnData()
  openQueryPage(true, {
    data: {
      openOne: 1
    }
  })
})

//打印
import {useNewPrint} from "/@/utils/boozsoft/print/print";
import {tableStyle} from "/@/store/modules/abc-print";
function printData(){
  // console.log("打印成功！")
  loadMark.value = true
  let printList: any = []
  const arrData = tableDataAll.value.filter(item=>item.cvencode!=null && item.cvencode!='')
  arrData.forEach(item=>{
    let item1 = {}
    item1[0] = formatCvencode(item.cvencode)
    item1[1] = formatCvenName(item.cvenName)
    item1[2] = formatCvencode(item.cvencodeJs)
    item1[3] = formatCvenName(item.cvenNameJs)
    item1[4] = item.isum==null?'':item.isum==0?'':toThousandFilter(item.isum)
    item1[5] = item.hxIsum==null?'':item.hxIsum==0?'':toThousandFilter(item.hxIsum)
    item1[6] = item.whxIsum==null?'':item.whxIsum==0?'':toThousandFilter(item.whxIsum)
    item1[7] = item.kpIsum==null?'':item.kpIsum==0?'':toThousandFilter(item.kpIsum)
    item1[8] = item.bili==null?'':item.bili
    printList.push(item1)
  })
  let a = 27-printList.length%27
  for (let i=0; i<a; i++){
    if (i==a-1) {
      let item1 = {}
      item1[0] = '合计'
      item1[1] = ''
      item1[2] = ''
      item1[3] = ''
      item1[4] = isum.value==null?'':isum.value==0?'':toThousandFilter(isum.value)
      item1[5] = hxIsum.value==null?'':hxIsum.value==0?'':toThousandFilter(hxIsum.value)
      item1[6] = whxIsum.value==null?'':whxIsum.value==0?'':toThousandFilter(whxIsum.value)
      item1[7] = ''
      item1[8] = ''
      printList.push(item1)
    } else {
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
      printList.push(item1)
    }
  }
  let num = Math.ceil(printList.length/27)
  useNewPrint({data: ['l', 'px', 'a4', true]}, (doc) => {
    loadMark.value = false
    doc.autoTable({
      head: [['应付账龄分析','', '', '',  '', '', '', '', ''],
        ['单位：'+pageParameter.companyName, '','', '截止日期：'+endDate.value, '', '', '', '', ''],
        ['采购供应商编码', '采购供应商名称','结算供应商编码', '结算供应商名称', '应付金额', '已付金额', '未付金额', '开票金额', '付款比例']
      ],
      body: printList,
      // startY: 60,
      styles: tableStyle(),
      margin: {
        left: 30,
        top: 20,
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
        /*doc.autoTableText(
          '核算单位：'+pageParameter.companyName,
          tabMarginLeft,
          data.cursor.y + 3,
          0
        );*/
        doc.autoTableText(
          '第'+data.doc.getCurrentPageInfo().pageNumber+'页/共'+num+'页',
          // '第'+data.doc.getCurrentPageInfo().pageNumber+'页',
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
        // data.cell.styles.bold = false

        if (data.section == 'head' && data.row.index == 0) {

          data.cell.styles.fontSize = 20
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.lineColor = [255, 255, 255]
          if (data.column.index == 0) {
            data.cell.colSpan = 9
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
            data.cell.colSpan = 3
            data.cell.styles.halign = 'center'
          } else {
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
            data.cell.styles.fillColor = [240, 240, 240]
          }
        }
      },
      columnStyles: {
        0: {maxHeight: 10, cellWidth: 55, halign: 'left'},
        1: {cellWidth: 80, halign: 'left'},
        2: {cellWidth: 55, halign: 'left'},
        3: {cellWidth: 80, halign: 'left'},
        4: {cellWidth: 60, halign: 'right'},
        5: {cellWidth: 60, halign: 'right'},
        6: {cellWidth: 60, halign: 'right'},
        7: {cellWidth: 60, halign: 'right'},
        8: {cellWidth: 60, halign: 'right'},
      }
    })
  })
}

//导出
import {
  defaultV,
  sheet_from_array_of_arrays,
  Workbook,
  writeExcel
} from "/@/utils/boozsoft/excel/excel2";
import XLSX from "xlsx-js-style";
const excelData = () => {
  // console.log("导出成功！")
  const arrData = tableDataAll.value.filter(item=>item.cvencode!=null && item.cvencode!='')
  arrData.forEach(item=>{
    item.cvencode = item.cvencode==null?'':formatCvencode(item.cvencode)
    item.cvenName = item.cvenName==null?'':formatCvenName(item.cvenName)
    item.cvencodeJs = item.cvencodeJs==null?'':formatCvencode(item.cvencodeJs)
    item.cvenNameJs = item.cvenNameJs==null?'':formatCvenName(item.cvenNameJs)
    item.hxIsum = item.hxIsum==null?'':toThousandFilter(item.hxIsum)
    item.isum = item.isum==null?'':toThousandFilter(item.isum)
    item.whxIsum = item.whxIsum==null?'':toThousandFilter(item.whxIsum)
    item.kpIsum = item.kpIsum==null?'':toThousandFilter(item.kpIsum)
  })
  const sheet:any = [
    {
      title: '应付账龄分析',
      multiHeader: [
        ['单位：'+pageParameter.companyName, '','', '截止日期：'+endDate.value, '', '', '', '', ''],
        ['采购供应商编码', '采购供应商名称','结算供应商编码', '结算供应商名称', '应付金额', '已付金额', '未付金额', '开票金额', '付款比例']
      ],
      table: arrData,
      keys: ['cvencode', 'cvenName', 'cvencodeJs', 'cvenNameJs', 'isum', 'hxIsum', 'whxIsum', 'kpIsum', 'bili'],
      merges: ['A2:C2','D2:F2'],
      sheetName: '应付账龄分析',
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
      colWidth: [15, 20, 15, 20, 15, 15, 15, 15, 15]
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
          if (i.substring(1) == '1' || i.substring(1) == '2') {
            dataInfo[i.toString()].s = {
              border: {},
              font: font || globalStyle.font,
              alignment: alignment || globalStyle.alignment,
              fill: fill || globalStyle.fill
            }
            if (i == 'A2') {
              dataInfo[i.toString()].s = {
                border: {},
                font: font || globalStyle.font,
                alignment: {
                  horizontal: "left",
                },
                fill: fill || globalStyle.fill
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
          } else if (i.substring(0, 1) == 'A') {
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "left",
              }
            }
          } else if (i.substring(0, 1) == 'A' || i.substring(0, 1) == 'B'
            || i.substring(0, 1) == 'C' || i.substring(0, 1) == 'D') {
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "left",
              }
            }
          } else if (i.substring(0, 1) == 'E' || i.substring(0, 1) == 'F'
            || i.substring(0, 1) == 'G' || i.substring(0, 1) == 'H'
            || i.substring(0, 1) == 'I') {
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
  writeExcel(wb, bookType, '应付账龄分析_'+pageParameter.companyName)
}

/**********************明细栏目设置**********************/
import {assemblyDynamicColumn, initDynamics} from "./data";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {findStockDbLanMuList, saveStockLanMuList} from "/@/api/record/system/stock-column-view-settings";
import {cloneDeep} from "lodash-es";
import {findYfdByDateList, findYfdByEndDateList} from "/@/api/record/system/yfd";
import {findFkdByEndDateList} from "/@/api/record/system/arApYsyf";
import {findAllByAccIdModel} from "/@/api/record/system/ar-ap-aging-range";
/*start栏目设置*/
const visible = ref(false);
const windowWidth = (window.innerWidth)
const windowHeight = (window.innerHeight - (340))
const totalColumnWidth = ref(0)
const dynamicColumns = initDynamics().DEFAULT
const dynamicColumnData: any = ref([])
let dynamicColumnDataCopy = []
const editableData = reactive({});
const tableRef: any = ref(null)
const lanMuData = {
  'accId': '',
  'menuName': '应付账龄分析',
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

const agingRang:any = ref([])
const reloadColumns = async () => {
  let a: any = []
  a = getColumns()
  let last = a.pop()
  let newA = JSON.parse(JSON.stringify(CrudApi.columns))
  let list:any = await useRouteApi(findAllByAccIdModel, {schemaName: dynamicTenantId})({
    accId: defaultAdName.value,
    model: 'ar'
  })
  if (list.length==0){
    list = [{
      serialNumber: '1',
      agingModel: 'ar',
      accId: defaultAdName.value,
      startDayNumber: '0-30',
      totalDayNumber: '30',
    },{
      serialNumber: '2',
      agingModel: 'ar',
      accId: defaultAdName.value,
      startDayNumber: '31-60',
      totalDayNumber: '60',
    },{
      serialNumber: '3',
      agingModel: 'ar',
      accId: defaultAdName.value,
      startDayNumber: '91-120',
      totalDayNumber: '90',
    },{
      serialNumber: '4',
      agingModel: 'ar',
      accId: defaultAdName.value,
      startDayNumber: '91-120',
      totalDayNumber: '120',
    },{
      serialNumber: '5',
      agingModel: 'ar',
      accId: defaultAdName.value,
      startDayNumber: '121-180',
      totalDayNumber: '180',
    },{
      serialNumber: '6',
      agingModel: 'ar',
      accId: defaultAdName.value,
      startDayNumber: '181-365',
      totalDayNumber: '365',
    }]
  }
  agingRang.value = list
  let dataColumn = dynamicColumnData.value
  dataColumn.map(item=>{
    for (let i = 0; i < list.length; i++) {
      if (item.name==i+1){
        item.nameNew=list[i].startDayNumber+'天'
        item.check = true
      }
    }
    if (item.name==list.length+1){
      item.nameNew=add(list[list.length-1].totalDayNumber,1)+'天以上'
      item.check = true
    }
    return item
  })
  newA = assemblyDynamicColumn(dataColumn, newA)
  // debugger
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
  await reloadTable()
}
</script>
<style src="./global-menu-index.less" lang="less" scoped="scoped"></style>
<style scoped lang="less">
:deep(.vben-basic-table) {
  .ant-table-wrapper {
    .ant-table-measure-row{
      td{
        padding: 0!important;
      }
    }
  }
}

:deep(.ant-card-body) {
  padding: 16px;
  border-left: 2px solid rgb(1, 143, 251);
  box-shadow: rgb(72 113 140) -3px 1px 7px -1px;
}

.a-table-font-size-16 :deep(td),
.a-table-font-size-16 :deep(th) {
  font-size: 14px !important;
  padding: 2px 8px !important;
  border-color: #aaaaaa !important;
  font-weight: 550;
  color: #000000 !important;
}

.a-table-font-size-12 :deep(td),
.a-table-font-size-12 :deep(th) {
  font-size: 13px !important;
  padding: 2px 8px !important;
  border-color: #aaaaaa !important;
  font-weight: 550;
  color: #000000 !important;
}

.app-container {
  background-color: #f2f2f2;
  padding: 0px;
  margin: 10px 10px 0;
  position: relative;
  :deep(.pagination-text){
    position: absolute;
    bottom: 6px;
    right: 50%;
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
  margin: 0;
}

:deep(.vben-basic-table){
  min-height: 500px;
  height: calc(100% - 160px);
  margin-bottom: 20px;
}

:deep(.ant-input),:deep(.ant-select),:deep(.ant-btn){
  border: 1px solid #c9c9c9;
}

:deep(.nc-summary) {
  font-size: 14px;
  font-weight: bold;
  width: 100%;
  background-color: #cccccc;
  border:none !important;
  border-bottom: 1px solid #000000 !important;

  > div {
    display: inline-block;
    background-color: #d8d8d8;
    padding: 5px;
  }
  > div:nth-of-type(2),> div:nth-of-type(3),> div:nth-of-type(4),> div:nth-of-type(5){
    >span:nth-of-type(1){
      margin-left: 10%;
      float: left;
    }
  }
  > div:nth-of-type(1) {
    width: 23%;
    text-align: center;
  }

  > div:nth-of-type(2) {
    width: 19%;
    margin: 0 1px;
    text-align: right;
  }
  > div:nth-of-type(3) {
    width: 19%;
    text-align: right;
    margin: 0 1px;
  }
  > div:nth-of-type(4) {
    width: 19%;
    margin: 0 1px;
    text-align: right;
  }
  > div:nth-of-type(5) {
    width: 19%;
    margin: 0 1px;
    text-align: right;
  }
}
</style>
