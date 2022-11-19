<template>
  <div>
        <!-- 请注释下行，不要删除下行，方便快速定位页面  -->
<!--   <div><textarea>手工核销的页面</textarea>复制内容快速定位页面</div>-->
    <div class="app-container">

      <div class="app-container-head">
        <div class="container-head-title" style="float: left;">
          <b class="noneSpan" style="font-size: 60px;"><ToolOutlined /></b>
        </div>
        <div class="container-head-title" style="padding-left: 35%;text-align: center;margin-top: 20px;">
          <b class="noneSpan" style="font-size: 26px;">手动核销</b>
          <div style="font-size: 14px;text-align: center;margin-top: 20px;">
            <span style="font-size: 14px;font-weight: bold;">
              截止日期：{{ endDate }}
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
            @click="saveData()"
          ><span>保存</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="balanceTaskDel();closeCurrent()"
          ><span>退出</span></button>
        </div>
      </div>

      <div style="clear: none"/>
      <div style="margin-top: -30px;margin-left: 80px;">
        <div style="display: inline-block;float: left;margin-top: -35px;">
          <AccountPicker theme="three" readonly @reloadTable="dynamicAdReload"/>
        </div>
        <div style="display: inline-block;float: left;margin-left: 12px;font-weight: bold;">
          <span style="color:#666666;">结算客户名称：</span>{{ formatCvencode(cvencode) }}
        </div>

        <div style="float: right; margin-left: 10px;">
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
        </div>
        <div style="float: right; position: relative">
<!--          <Select v-model:value="formItems.selectType" style="width: 120px;font-size: 12px;" class="special_select">
            <SelectOption style="font-size: 12px;" value="1">单据编码</SelectOption>
            <SelectOption style="font-size: 12px;" value="2">供应商简称</SelectOption>
            <SelectOption style="font-size: 12px;" value="3">仓库</SelectOption>
            <SelectOption style="font-size: 12px;" value="4">存货名称</SelectOption>
          </Select>
          <InputSearch
            placeholder=""
            style="width: 200px; border-radius: 4px"
            @search="onSearch"
          />-->
        </div>
      </div>

      <div style="clear:both"/>

    </div>
    <div class="app-container" style="height: 325px;padding-top: 10px;margin-top: 5px;">
      <span style="font-size: 18px;padding-left: 10px;color: #0096c7;font-weight: bold;">付款单</span>
      <div style="float: right;padding-right: 10px;">
        <Button class="ant-btn-sm actod-btn" @click="">选单</Button>
        <Button class="ant-btn-sm actod-btn" @click="tableDel">删单</Button>
      </div>
      <BasicTable
        class="a1 table1"
        :row-selection="{ type: 'checkbox', selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
        @register="registerTable"
        :scroll="{ y: 220 }"
        :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
        :dataSource="tableData"
        :loading="loadMark"
      >
        <template #billStyle="{ record }">{{formatBillStyle(record.billStyle)}}</template>
        <template #isum="{ record }">
          <span v-if="record.isum!=null && record.isum!=''">{{toThousandFilter(record.isum)}}</span>
        </template>
        <template #whxIsum="{ record }">
          <span v-if="record.isum!=null && record.isum!=''">{{toThousandFilter(record.whxIsum)}}</span>
        </template>
        <template #cvencode="{ record }">{{formatCvencode(record.cvencode)}}</template>
        <template #cvencodeJs="{ record }">{{formatCvencode(record.cvencodeJs)}}</template>
        <template #cmakerId="{ record }">{{formatCpersoncode(record.cmakerId)}}</template>
        <template #cdepcode="{ record }">{{formatCdepcode(record.cdepcode)}}</template>
        <template #hxStyle="{ record }">
          <span v-if="record.hxStyle=='SKD'">收款单</span>
          <span v-if="record.hxStyle=='FKD'">付款单</span>
        </template>
        <template #hxMoney="{ record,index }">
          <template v-if="record.editOne">
            <InputNumber v-model:value="record.tempOne" class="hxMoney" style="width: 85%;" @blur="checkMoney(record,index,'hxMoney')" @keyup.enter="focusNext(record,'hxMoney')"/>
            <CheckOutlined @click="record.editOne = null;record.hxMoney=record.tempOne;tableDataChange(record,'hxMoney')"/>
          </template>
          <template v-else>
            <div @click="record.editOne = true;" :class="record.isum && (status == 1 || status == 2)?'suspended-div':'status-look'">
              <span class="a-table-font-arial">{{toThousandFilter(record.hxMoney)}}</span>
            </div>
          </template>
        </template>
        <template #idiscount="{ record,index }">
          <template v-if="record.editTwo">
            <InputNumber v-model:value="record.tempTwo" class="idiscount" style="width: 85%;" @blur="checkMoney(record,index,'idiscount')" @keyup.enter="focusNext(record,'idiscount')"/>
            <CheckOutlined @click="record.editTwo = null;record.idiscount=record.tempTwo;tableDataChange(record,'idiscount')"/>
          </template>
          <template v-else>
            <div @click="record.editTwo = true;" :class="record.isum && (status == 1 || status == 2)?'suspended-div':'status-look'">
              <span class="a-table-font-arial">{{toThousandFilter(record.idiscount)}}</span>
            </div>
          </template>
        </template>
        <template #ljhxIsum="{ record }">{{toThousandFilter(record.ljhxIsum)}}</template>

<!--        <template #footer>
          <div class="nc-summary">
            <div style="width: 8%;">
              <span>合计</span>
            </div>
            <div style="width: 19%;">
              <span>付款金额:</span>
              <span>&ensp;{{ toThousandFilter(isum) }}</span>
            </div>
            <div style="width: 19%;">
              <span>未结算金额:</span>
              <span>&ensp;{{ toThousandFilter(wjsIsum) }}</span>
            </div>
            <div style="width: 19%;">
              <span>本次结算金额:</span>
              <span>&ensp;{{ toThousandFilter(bcjsIsum) }}</span>
            </div>
            <div style="width: 15%;">
              <span>折扣金额:</span>
              <span>&ensp;{{ toThousandFilter(zkIsum) }}</span>
            </div>
            <div style="width: 19%;">
              <span>累计结算金额:</span>
              <span>&ensp;{{ toThousandFilter(ljjsIsum) }}</span>
            </div>
          </div>
        </template>-->
        <template #summary>
          <TableSummary fixed>
            <TableSummaryRow style="background-color: #cccccc;font-weight: bold;">
              <TableSummaryCell class="nc-summary" :index="0" :align="'center'">合</TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="1" :align="'center'">计</TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="2" :align="'center'"></TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="3" :align="'center'"></TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="4" :align="'center'"></TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="5" :align="'center'"></TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="6" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{ toThousandFilter(isum) }}</TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="7" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{ toThousandFilter(wjsIsum) }}</TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="8" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{ toThousandFilter(bcjsIsum) }}</TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="9" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{ toThousandFilter(zkIsum) }}</TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="10" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{ toThousandFilter(ljjsIsum) }}</TableSummaryCell>
            </TableSummaryRow>
          </TableSummary>
        </template>
      </BasicTable>
    </div>

    <div class="app-container" style="height: 325px;padding-top: 10px;">
      <span style="font-size: 18px;padding-left: 10px;color: #0096c7;font-weight: bold;">核销明细</span>
      <div style="float: right;padding-right: 10px;">
        <Button class="ant-btn-sm actod-btn" @click="countFentan">分摊</Button>
        <Button class="ant-btn-sm actod-btn" @click="openSelectXhd">选单</Button>
        <Button class="ant-btn-sm actod-btn" @click="tableDel1">删单</Button>
      </div>
      <BasicTable
        class="a1 table1"
        :row-selection="{ type: 'checkbox', selectedRowKeys: state1.selectedRowKeys, onChange: onSelectChange1 }"
        @register="registerTable1"
        :scroll="{ y: 220 }"
        :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
        :dataSource="tableData1"
        :loading="loadMark"
      >
        <template #hxStyle="{ record }">
          <span>{{formatHxStyle(record.hxStyle)}}</span>
        </template>
        <template #ddate="{ record }">
          <span>{{record.ddate}}</span>
        </template>
        <template #hxCcode="{ record }">
          <span>{{record.hxCcode}}</span>
        </template>
        <template #cvencode="{ record }">
          <span>{{formatCvencode(record.cvencode)}}</span>
        </template>
        <template #isum="{ record }">
          <span v-if="record.isum!=null && record.isum!=''">{{toThousandFilter(record.isum)}}</span>
        </template>
        <template #whxIsum="{ record }">
          <span>{{toThousandFilter(record.whxIsum)}}</span>
        </template>
        <template #hxMoney="{ record,index }">
          <template v-if="record.editOne">
            <InputNumber v-model:value="record.tempOne" class="hxMoney" style="width: 85%;" @blur="checkMoney1(record,index,'hxMoney')" @keyup.enter="focusNext1(record,'hxMoney')"/>
            <CheckOutlined @click="record.editOne = null;record.hxMoney=record.tempOne;tableDataChange(record,'hxMoney')"/>
          </template>
          <template v-else>
            <div @click="record.editOne = true;" :class="record.isum && (status == 1 || status == 2)?'suspended-div':'status-look'">
              <span class="a-table-font-arial">{{toThousandFilter(record.hxMoney)}}</span>
            </div>
          </template>
        </template>
        <template #idiscount="{ record,index }">
          <template v-if="record.editTwo">
            <InputNumber v-model:value="record.tempTwo" class="idiscount" style="width: 85%;" @blur="checkMoney1(record,index,'idiscount')" @keyup.enter="focusNext1(record,'idiscount')"/>
            <CheckOutlined @click="record.editTwo = null;record.idiscount=record.tempTwo;tableDataChange(record,'idiscount')"/>
          </template>
          <template v-else>
            <div @click="record.editTwo = true;" :class="record.isum && (status == 1 || status == 2)?'suspended-div':'status-look'">
              <span class="a-table-font-arial">{{toThousandFilter(record.idiscount)}}</span>
            </div>
          </template>
        </template>
        <template #cmemo="{ record }">
          <span>{{record.cmemo}}</span>
        </template>

<!--        <template #footer>
          <div class="nc-summary">
            <div>
              <span>合计</span>
            </div>
            <div>
              <span>应付金额:</span>
              <span>&ensp;{{ toThousandFilter(isum1) }}</span>
            </div>
            <div>
              <span>未结算金额:</span>
              <span>&ensp;{{ toThousandFilter(hxIsum) }}</span>
            </div>
            <div>
              <span>本次结算金额:</span>
              <span>&ensp;{{ toThousandFilter(hxMoney) }}</span>
            </div>
            <div>
              <span>折扣金额:</span>
              <span>&ensp;{{ toThousandFilter(idiscount) }}</span>
            </div>
          </div>
        </template>-->
        <template #summary>
          <TableSummary fixed>
            <TableSummaryRow style="background-color: #cccccc;font-weight: bold;">
              <TableSummaryCell class="nc-summary" :index="0" :align="'center'">合</TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="1" :align="'center'">计</TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="2" :align="'center'"></TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="3" :align="'center'"></TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="4" :align="'center'"></TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="5" :align="'center'"></TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="6" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{ toThousandFilter(isum1) }}</TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="7" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{ toThousandFilter(hxIsum) }}</TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="8" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{ toThousandFilter(hxMoney) }}</TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="9" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{ toThousandFilter(idiscount) }}</TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="10" :align="'center'"></TableSummaryCell>
            </TableSummaryRow>
          </TableSummary>
        </template>
      </BasicTable>
    </div>

    <Query @save="saveQuery" @register="registerQueryPage"/>
    <SelectXhd
      @save="saveSelectXhd"
      @register="registerSelectXhdPage"
    />
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
  BarChartOutlined,
  ToolOutlined
} from '@ant-design/icons-vue'
import {
  Select,
  Input,
  InputNumber,
  Popover,
  Button,
  Tag,
  message,
  Checkbox as ACheckbox,
  Radio as ARadio,
  Table as ATable,
  Popconfirm as APopconfirm, Table,
} from 'ant-design-vue'
import {useMessage} from "/@/hooks/web/useMessage";
import {getCurrentAccountName, getThisIndexImg, hasBlank} from "/@/api/task-api/tast-bus-api";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {add, sub, toThousandFilter} from "../YingShouKuanQiChuYuE/calculation";
import Query from './popup/query.vue'
import {findAll as findCustAll} from "/@/api/record/supplier_data/supplier";
import {
  findQuxiaohexiaoList, findWhxskd, saveStockXyCsource, saveWriteOff, saveYsyf,
} from "/@/api/record/system/arApYsyf";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {findByFkWhxCgdhd} from "/@/api/record/system/hexiao";
import {
  findByCvencode,
  saveArXySource,
  saveBeginBalance
} from "/@/api/record/system/arBeginBalance";
import {getPsnList} from "/@/api/record/system/psn";
import {findDeptByFlag} from "/@/api/record/system/dept";

const InputSearch = Input.Search
const SelectOption = Select.Option
const ARadioButton = ARadio.Button
const ARadioGroup = ARadio.Group
const TableSummary = Table.Summary
const TableSummaryRow = TableSummary.Row
const TableSummaryCell = TableSummary.Cell

const {
  createSuccessModal,
  createErrorModal,
  createWarningModal,
  createConfirm
} = useMessage()

const {closeCurrent} = useTabs(router);
// 0 暂存 1 新建 2编辑 3查看
const status:any = ref(1)

const formItems = ref({
  selectType: '1'
})

const [registerQueryPage, {openModal: openQueryPage}] = useModal()
//文件导入
const cvencode = ref('')
const val = ref({
  openOne: 0,
  total: 0,
  cvencode: cvencode.value,
})
const openQuery = async () => {
  val.value.openOne = 0
  val.value.cvencode = cvencode.value
  openQueryPage(true, {
    data: val
  })
}

const endDate = ref('')
const cdepcode = ref('')
const cpersoncode = ref('')
const apHexiaoAuto:any = ref()
const apSourceFlag:any = ref()
const apCheckFlag:any = ref()
async function saveQuery(data) {
  dynamicTenantId.value = data.dynamicTenantId
  defaultAdName.value = data.defaultAdName
  pageParameter.year = data.year
  cvencode.value = data.cvencode
  endDate.value = data.endDate
  cdepcode.value = data.cdepcode
  cpersoncode.value = data.cpersoncode
  apHexiaoAuto.value = data.apHexiaoAuto
  apSourceFlag.value = data.apSourceFlag
  apCheckFlag.value = data.apCheckFlag
  await reloadTable()
}

const typeFlag = ref('0')

const dynamicTenantId = ref(getCurrentAccountName(true))
const defaultAdName = ref(useCompanyOperateStoreWidthOut().getSchemaName)

const tableData:any = ref([]);
const tableDataAll:any = ref([]);
const loadMark = ref(false)
const saleousingList:any = ref([])
const tableData1:any = ref([]);
const tableDataAll1:any = ref([]);
const arBeginBalanceList:any = ref([])
const ysyfList:any = ref([])
async function reloadTable(){
  loadMark.value = true
  await balanceTaskDel()
  tableData.value = []
  tableData1.value = []
  arBeginBalanceList.value = []
  ysyfList.value = []
  saleousingList.value = []
  //查询应付款期初余额
  const qcList = await useRouteApi(findByCvencode,{schemaName: dynamicTenantId})({cvencode:cvencode.value,iyear:pageParameter.year})
  if (apSourceFlag.value!='1') {
    arBeginBalanceList.value = qcList.filter(item => item.busStyle == 'YFD')
  } else {
    arBeginBalanceList.value = qcList.filter(item => item.arStyle == 'YFD')
  }
  if (arBeginBalanceList.value.length>0) {
    let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:pageParameter.year,name:'应付款期初余额',method:'编辑'})
    if(taskData.length==0){
      await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({iyear:pageParameter.year,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:'应付款期初余额',method:'编辑',caozuoModule:'ap'})
    } else {
      // 任务不是当前操作员的
      if(String(taskData[0]?.caozuoUnique)!==String(useUserStoreWidthOut().getUserInfo.id)){
        await balanceTaskDel()
        val.value.openOne = 1
        cvencode.value = ''
        val.value.cvencode = ''
        openQueryPage(true, {
          data: val
        })
        return createWarningModal({ content: taskData[0]?.username+'正在编辑应付款期初余额,不能同时进行操作！' });
      }else{
        await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({id:taskData[0]?.id,iyear:pageParameter.year,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:'应付款期初余额',method:'编辑',caozuoModule:'ap'})
      }
    }
  }
  const skdList = arBeginBalanceList.value.filter(item=>item.busStyle=='FKD')
  const ysdList = arBeginBalanceList.value.filter(item=>item.busStyle=='YFD')
  tableData.value.push(...skdList.map(item=>{
    item.cvencode = item.cvencodeJS
    item.isum = item.ysIsumBenbi
    item.whxIsum = sub(item.isum,item.hxIsum==null?'0':item.hxIsum)
    item.hxMoney = item.whxIsum
    item.tempOne = item.whxIsum
    item.ljhxIsum = add(item.hxIsum==null?'0':item.hxIsum,item.hxMoney)
    item.type = 'YUE'
    return item
  }))
  ysyfList.value = await useRouteApi(findWhxskd,{schemaName: dynamicTenantId})({year:pageParameter.year,cvencode:cvencode.value})
  for (let i = 0; i < ysyfList.value.length; i++) {
    let item = ysyfList.value[i]
    let danju = item.bdocumStyle!='1'?'付款单':'退款单'
    let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:pageParameter.year,name:danju,method:'修改,删除,审核,弃审',recordNum:item.ccode})
    if(taskData.length==0){
      await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({iyear:pageParameter.year,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:danju,method:'审核',recordNum:item.ccode,caozuoModule:'ap'})
    } else {
      // 任务不是当前操作员的
      if(String(taskData[0]?.caozuoUnique)!==String(useUserStoreWidthOut().getUserInfo.id)){
        await balanceTaskDel()
        val.value.openOne = 1
        cvencode.value = ''
        val.value.cvencode = ''
        openQueryPage(true, {
          data: val
        })
        return createWarningModal({ content: taskData[0]?.username+'正在'+taskData[0]?.method+danju+',不能同时进行操作！' });
      }else{
        await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({id:taskData[0]?.id,iyear:pageParameter.year,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:danju,method:'审核',recordNum:item.ccode,caozuoModule:'ar'})
      }
    }
  }
  tableDataAll.value = ysyfList.value
  tableData.value.push(...tableDataAll.value.map(item=>{
    item.whxIsum = sub(item.isum,item.hxIsum==null?'0':item.hxIsum)
    item.hxMoney = item.whxIsum
    item.tempOne = item.whxIsum
    item.ljhxIsum = add(item.hxIsum==null?'0':item.hxIsum,item.hxMoney)
    item.type = 'FKD'
    return item
  }))
  if (tableData.value.length<10) {
    let num = 10 - tableData.value.length
    for (let i = 0; i < num; i++) {
      tableData.value.push({})
    }
  }
  setTableData(tableData.value)

  const saleList = await useRouteApi(findByFkWhxCgdhd,{schemaName: dynamicTenantId})({year:pageParameter.year,cvencode:cvencode.value})
  if (apSourceFlag.value=='1') {
    saleousingList.value = saleList.filter(item => item.busStyle !='CGDHD' && item.bworkable=='1')
  } else {
    if(apCheckFlag=='1'){
      saleousingList.value = saleList.filter(item => item.busStyle !='CGFP' && item.bworkable=='1')
    } else {
      saleousingList.value = saleList.filter(item => item.busStyle !='CGFP')
    }
  }
  for (let i = 0; i < saleousingList.value.length; i++) {
    let item = saleousingList.value[i]
    let danju = formatHxStyle(item.billStyle)
    let model = item.billStyle=='YF'?'ap':'stock'
    let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:pageParameter.year,name:danju,method:'修改,删除,审核,弃审',recordNum:item.ccode})
    if(taskData.length==0){
      await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({iyear:pageParameter.year,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:danju,method:'审核',recordNum:item.ccode,caozuoModule:model})
    } else {
      // 任务不是当前操作员的
      if(String(taskData[0]?.caozuoUnique)!==String(useUserStoreWidthOut().getUserInfo.id)){
        await balanceTaskDel()
        val.value.openOne = 1
        cvencode.value = ''
        val.value.cvencode = ''
        openQueryPage(true, {
          data: val
        })
        return createWarningModal({ content: taskData[0]?.username+'正在'+taskData[0]?.method+danju+',不能同时进行操作！' });
      }else{
        await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({id:taskData[0]?.id,iyear:pageParameter.year,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:danju,method:'审核',recordNum:item.ccode,caozuoModule:model})
      }
    }
  }
  tableData1.value.push(...ysdList.map(item=>{
    item.hxStyle = item.arStyle
    item.hxCcode = item.ccode
    item.cvencode = item.cvencodeJs
    item.isum = item.arIsumBenbi
    if (item.hxIsum!=null && item.hxIsum !='') {
      item.whxIsum = sub(item.isum, item.hxIsum)
    } else {
      item.whxIsum = item.isum
    }
    item.type = 'YUE'
    return item
  }))
  tableData1.value.push(...saleousingList.value.map(item=>{
    item.hxStyle = item.billStyle
    item.hxCcode = item.ccode
    if (item.hxIsum!=null && item.hxIsum !='') {
      item.whxIsum = sub(item.isum, item.hxIsum)
    } else {
      item.whxIsum = item.isum
    }
    item.type = 'CGDHD'
    return item
  }))
  if (tableData1.value.length<10) {
    let num = 10 - tableData1.value.length
    for (let i = 0; i < num; i++) {
      tableData1.value.push({})
    }
  }
  setTableData1(tableData1.value)
  countTable()
  loadMark.value = false
}

async function balanceTaskDel() {
  if (arBeginBalanceList.value.length>0) {
    await useRouteApi(stockBalanceTaskDelByUserName, {schemaName: dynamicTenantId})({
      iyear: pageParameter.year,
      userName: useUserStoreWidthOut().getUserInfo.id,
      functionModule: '应付款期初余额',
      method: '编辑',
    })
  }
  for (let i = 0; i < ysyfList.value.length; i++) {
    let item = ysyfList.value[i]
    let danju = item.bdocumStyle != '1' ? '付款单' : '退款单'
    await useRouteApi(stockBalanceTaskDelByUserName, {schemaName: dynamicTenantId})({
      iyear: pageParameter.year,
      userName: useUserStoreWidthOut().getUserInfo.id,
      functionModule: danju,
      method: '审核',
      recordNum:item.ccode
    })
  }
  for (let i = 0; i < saleousingList.value.length; i++) {
    let item = saleousingList.value[i]
    let danju = formatHxStyle(item.billStyle)
    let model = item.billStyle == 'YFD' ? 'ap' : 'stock'
    await useRouteApi(stockBalanceTaskDelByUserName, {schemaName: dynamicTenantId})({
      iyear: pageParameter.year,
      userName: useUserStoreWidthOut().getUserInfo.id,
      functionModule: danju,
      method: '审核',
      recordNum:item.ccode
    })
  }
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

const psnList:any = ref([])
const deptList:any = ref([])
const customerList:any = ref([])
async function reloadList() {
  psnList.value = await useRouteApi(getPsnList,{schemaName: dynamicTenantId})({})
  deptList.value = await useRouteApi(findDeptByFlag,{schemaName: dynamicTenantId})({})
  const res2 = await useRouteApi(findCustAll,{schemaName: dynamicTenantId})(parameter)
  customerList.value = res2.items
}

const CrudApi = {
  columns: [
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
      width: 120,
      align: 'left',
      ellipsis: true,
    },
    {
      title: '部门',
      dataIndex: 'cdepcode',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'cdepcode'}
    },
    {
      title: '业务员',
      dataIndex: 'cpersoncode',
      width: 100,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'cpersoncode'}
    },
    {
      title: '付款金额',
      dataIndex: 'isum',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'isum'}
    },
    {
      title: '未结算金额',
      dataIndex: 'whxIsum',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'whxIsum'}
    },
    {
      title: '本次结算金额',
      dataIndex: 'hxMoney',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'hxMoney'}
    },
    {
      title: '折扣金额',
      dataIndex: 'idiscount',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'idiscount'}
    },
    {
      title: '累计结算金额',
      dataIndex: 'ljhxIsum',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'ljhxIsum'}
    },
  ]
}

const CrudApi1 = {
  columns: [
    {
      title: '单据类型',
      dataIndex: 'hxStyle',
      ellipsis: true,
      slots: {customRender: 'hxStyle'},
      width: 100
    },
    {
      title: '单据日期',
      dataIndex: 'ddate',
      ellipsis: true,
      slots: {customRender: 'ddate'},
      width: 100
    },
    {
      title: '单据编号',
      dataIndex: 'hxCcode',
      ellipsis: true,
      slots: {customRender: 'hxCcode'},
      width: 120
    },
    {
      title: '供应商名称',
      dataIndex: 'cvencode',
      ellipsis: true,
      slots: {customRender: 'cvencode'},
      width: 150
    },
    {
      title: '应付金额',
      dataIndex: 'isum',
      ellipsis: true,
      align: 'right',
      slots: {customRender: 'isum'},
      width: 150
    },{
      title: '未结算金额',
      dataIndex: 'whxIsum',
      slots: {customRender: 'whxIsum'},
      align: 'right',
      ellipsis: true,
      width: 150,
    },
    {
      title: '本次结算金额',
      dataIndex: 'hxMoney',
      ellipsis: true,
      slots: {customRender: 'hxMoney'},
      align: 'right',
      width: 150
    },
    {
      title: '折扣金额',
      dataIndex: 'idiscount',
      ellipsis: true,
      slots: {customRender: 'idiscount'},
      align: 'right',
      width: 150
    },
    {
      title: '备注',
      dataIndex: 'cmemo',
      ellipsis: true,
      slots: {customRender: 'cmemo'},
      width: 200,
    }
  ]
}

function formatHxStyle(hxStyle){
  let str = hxStyle
  if (hxStyle=='CGDHD'){
    str = '采购到货单'
  } else if(hxStyle=='YFD') {
    str = '应付单'
  } else if(hxStyle=='CGFP'){
    str = '采购发票'
  }
  return str
}

function formatBillStyle(billStyle){
  let str = billStyle
  if (billStyle=='CGDHD'){
    str = '采购到货单'
  } else if(billStyle=='YFD') {
    str = '应付单'
  } else if(billStyle=='CGFP'){
    str = '采购发票'
  }
  return str
}

function formatCvencode(cvencode){
  let str = cvencode
  customerList.value.forEach(item=>{
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

function formatCdepcode(cdepcode){
  let str = cdepcode
  deptList.value.forEach(item=>{
    if(item.id == cdepcode){
      str = item.deptName
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
  pagination: false,
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
  pagination: false,
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
const onSelectChange = (selectedRowKeys,row) => {
  // console.log('selectedRowKeys changed: ', row);
  state.selectedRowKeys = selectedRowKeys;
  checkRow.value = row
  isum.value = 0
  wjsIsum.value = 0
  bcjsIsum.value = 0
  zkIsum.value = 0
  ljjsIsum.value = 0
  checkRow.value.forEach(item=>{
    if (item.isum!=null && item.isum!=''){
      isum.value = add(isum.value,item.isum)
    }
    if (item.whxIsum!=null && item.whxIsum!=''){
      wjsIsum.value = add(wjsIsum.value,item.whxIsum)
    }
    if (item.hxMoney!=null && item.hxMoney!=''){
      bcjsIsum.value = add(bcjsIsum.value,item.hxMoney)
    }
    if (item.idiscount!=null && item.idiscount!=''){
      zkIsum.value = add(zkIsum.value,item.idiscount)
    }
    if (item.ljhxIsum!=null && item.ljhxIsum!=''){
      ljjsIsum.value = add(ljjsIsum.value,item.ljhxIsum)
    }
  })
};

//选中内容
const state1 = reactive<{
  selectedRowKeys: [];
  loading: boolean;
}>({
  selectedRowKeys: [], // Check here to configure the default column
  loading: false,
});
const checkRow1: any = ref([])
const onSelectChange1 = (selectedRowKeys,row) => {
  // console.log('selectedRowKeys changed: ', row);
  state1.selectedRowKeys = selectedRowKeys;
  checkRow1.value = row
};

const tableDel = () => {
  if (state.selectedRowKeys.length > 0) {
    let list = getDataSource()
    for (let i = 0; i < state.selectedRowKeys.length; i++) {
      let item = state.selectedRowKeys[i]
      let selectIndex = list.findIndex(it => it.key === item)
      list.splice(selectIndex, 1)
    }
    tableData.value = list
    setTableData(list)
    state.selectedRowKeys = []
    countTable()
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请选择删除行次！'
    })
  }
}

const tableDel1 = () => {
  if (state1.selectedRowKeys.length > 0) {
    let list = getDataSource1()
    for (let i = 0; i < state1.selectedRowKeys.length; i++) {
      let item = state1.selectedRowKeys[i]
      let selectIndex = list.findIndex(it => it.key === item)
      list.splice(selectIndex, 1)
    }
    tableData1.value = list
    setTableData1(list)
    state1.selectedRowKeys = []
    countTable()
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请选择删除行次！'
    })
  }
}

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
    data: val
  })
})

function checkMoney(record,index,str){
  let num1 = record.whxIsum
  let num2 = 0
  let num3 = record.hxIsum==null?0:record.hxIsum
  if(record.tempOne!=null && record.tempOne!='') {
    num2 = record.tempOne
  }
  if (num1-num2<0){
    if (str=='hxMoney'){
      record.tempOne = ''
      record.hxMoney = ''
    } else {
      record.hxMoney = record.tempOne
    }
  }
  if (record.tempOne!=null && record.tempOne!=''){
    record.ljhxIsum = add(num3, record.tempOne)
  }
  checkRow1.value.map(item=>{
    for (let i = 0; i < tableData1.value.length; i++) {
      let item1 = tableData1.value[i]
      if (item.hxCcode==item1.hxCcode){
        item.hxMoney = item1.hxMoney
        item.idiscount = item1.idiscount
        item.tempOne = item.hxMoney
        item.tempTwo = item.idiscount
      }
    }
    return item
  })
  tableData.value[index] = record
}

function checkMoney1(record,index,str){
  let num1 = record.whxIsum
  let num2 = 0
  let num3 = 0
  if(record.tempOne!=null && record.tempOne!='') {
    num2 = record.tempOne
  }
  if(record.tempTwo!=null && record.tempTwo!='') {
    num3 = record.tempTwo
  }
  let sum = add(num2,num3)
  if (num1-sum<0){
    if (str=='hxMoney'){
      record.tempOne = ''
      record.hxMoney = ''
    }
    if (str=='idiscount'){
      record.tempTwo = ''
      record.idiscount = ''
    }
  }
  tableData1.value[index] = record
}

const isum:any = ref('0')
const wjsIsum:any = ref('0')
const bcjsIsum:any = ref('0')
const zkIsum:any = ref('0')
const ljjsIsum:any = ref('0')
const isum1:any = ref('0')
const hxIsum:any = ref('0')
const hxMoney:any = ref('0')
const idiscount:any = ref('0')
//计算付款明细和结算明细
function countTable(){
  isum1.value = 0
  hxIsum.value = 0
  hxMoney.value = 0
  idiscount.value = 0
  getDataSource1().forEach(item=>{
    if (item.isum!=null && item.isum!=''){
      isum1.value = add(isum1.value,item.isum)
    }
    if (item.whxIsum!=null && item.whxIsum!=''){
      hxIsum.value = add(hxIsum.value,item.whxIsum)
    }
    if (item.hxMoney!=null && item.hxMoney!=''){
      hxMoney.value = add(hxMoney.value,item.hxMoney)
    }
    if (item.idiscount!=null && item.idiscount!=''){
      idiscount.value = add(idiscount.value,item.idiscount)
    }
  })
}

//分摊核销
function countFentan(){
  if(checkRow1.value.length>0){
    tableData1.value.forEach(item=>{
      item.hxMoney = ''
      item.idiscount = ''
      return item
    })
    checkRow1.value.forEach(item=>{
      item.hxMoney = ''
      item.idiscount = ''
      return item
    })
    countTable()
    for (let i = 0; i < checkRow1.value.length; i++) {
      let item = checkRow1.value[i]
      if (item.whxIsum != null && item.whxIsum != '') {
        item.hxMoney = '0'
        let whxIsum = 0
        if (sub(zkIsum.value, idiscount.value) > item.whxIsum) {
          item.idiscount = item.whxIsum
        } else {
          item.idiscount = sub(zkIsum.value, idiscount.value)
        }
        if (item.idiscount != null && item.idiscount != '') {
          whxIsum = sub(item.whxIsum, item.idiscount)
        } else {
          whxIsum = item.whxIsum
        }
        if (sub(bcjsIsum.value, hxMoney.value) > whxIsum) {
          item.hxMoney = whxIsum
        } else {
          item.hxMoney = sub(bcjsIsum.value, hxMoney.value)
        }
        item.tempOne = item.hxMoney
      }
      countTable()
    }
    tableData1.value.map(item=>{
      for (let i = 0; i < checkRow1.value.length; i++) {
        let item1 = checkRow1.value[i]
        if (item.hxCcode==item1.hxCcode){
          item.hxMoney = item1.hxMoney
          item.idiscount = item1.idiscount
          item.tempOne = item.hxMoney
          item.tempTwo = item.idiscount
        }
      }
      return item
    })
    setTableData1(tableData1.value)
    state1.selectedRowKeys = []
    checkRow1.value = []
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请选择需要分摊的数据！'
    })
  }
}

//保存
async function saveData(){
  if (sub(bcjsIsum.value,hxMoney.value)!=0){
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '付款单核销金额和核销明细的核销金额必须相同！'
    })
    return false
  }
  if (sub(zkIsum.value,idiscount.value)!=0){
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '付款单折扣金额和核销明细的折扣金额必须相同！'
    })
    return false
  }
  //自动分配
  const list = checkRow.value.filter(item=>item.hxMoney!=null && item.hxMoney!='')
  const list1 = getDataSource1().filter(item=>(item.hxMoney!=null && item.hxMoney!='')||(item.idiscount!=null && item.idiscount!=''))
  const list2 = getDataSource1().filter(item=>(item.hxMoney!=null && item.hxMoney!='')||(item.idiscount!=null && item.idiscount!=''))
  for (let i = 0; i < list.length; i++) {
    const ysyf = list[i]
    let hxMoney = ysyf.hxMoney
    let idiscount = ysyf.hxIdiscount
    ysyf.hxIsum = add(ysyf.hxIsum==null?'0':ysyf.hxIsum, ysyf.hxMoney==null?'0':ysyf.hxMoney)
    ysyf.idiscount = add(ysyf.hxIdiscount==null?'0':ysyf.hxIdiscount, ysyf.idiscount==null?'0':ysyf.idiscount)
    ysyf.hxIdiscount = add(ysyf.hxIdiscount==null?'0':ysyf.hxIdiscount, ysyf.idiscount==null?'0':ysyf.idiscount)
    if (ysyf.type=='FKD') {
      ysyf.busStyle = 'PTFK'
      if (sub(ysyf.isum, ysyf.hxIsum) == 0) {
        ysyf.writeOffStatus = '1'
      } else {
        ysyf.writeOffStatus = '0'
      }
      await useRouteApi(saveYsyf, {schemaName: dynamicTenantId})(ysyf)
    } else {
      if (sub(ysyf.isum, ysyf.hxIsum) == 0) {
        ysyf.hxFlag = '1'
      } else {
        ysyf.hxFlag = '0'
      }
      await useRouteApi(saveBeginBalance,{schemaName: dynamicTenantId})(ysyf)
    }
    for (let j = 0; j < list1.length; j++) {
      const xhd = list1[j]
      if (hxMoney!=0) {
        let hxMoney1 = xhd.hxMoney
        let idiscount1 = xhd.idiscount
        if (sub(hxMoney, xhd.hxMoney) < 0) {
          hxMoney1 = hxMoney
        }
        if (sub(idiscount, xhd.idiscount) < 0) {
          idiscount1 = idiscount
        }
        let writeOff: any = {}
        writeOff.iyear = pageParameter.year
        writeOff.ccode = ysyf.ccode
        writeOff.ddate = ysyf.ddate
        writeOff.billStyle = 'FKD'
        writeOff.hxStyle = xhd.hxStyle
        if (ysyf.cvencode!=null && ysyf.cvencode!='') {
          writeOff.cvencode = ysyf.cvencode
        } else {
          writeOff.cvencode = ysyf.cvencodeJs
        }
        writeOff.hxCcode = xhd.hxCcode
        writeOff.hxIsum = xhd.isum
        writeOff.hxMoney = hxMoney1
        writeOff.idiscount = idiscount1
        writeOff.citemcode = xhd.citemcode
        writeOff.citemClass = xhd.citemClass
        writeOff.currency = ysyf.currency
        writeOff.exRate = ysyf.exRate
        writeOff.hxUser = useUserStoreWidthOut().getUserInfo.id
        if (ysyf.type=='YUE'){
          writeOff.skdQichu = '1'
        }
        if (xhd.type=='YUE'){
          writeOff.ysdQichu = '1'
        }
        await useRouteApi(saveWriteOff,{schemaName: dynamicTenantId})(writeOff)
        //保存下游单据
        let stockXyCsource: any = {}
        stockXyCsource.iyear = pageParameter.year
        if (ysyf.type=='YUE') {
          stockXyCsource.xyBillStyle = 'YUE'
        } else {
          stockXyCsource.xyBillStyle = 'FKD'
        }
        if (xhd.type=='YUE') {
          stockXyCsource.billStyle = 'YUE'
        } else {
          stockXyCsource.billStyle = xhd.hxStyle
        }
        stockXyCsource.ccode = xhd.hxCcode
        stockXyCsource.ccodeDate = xhd.ddate
        stockXyCsource.xyccode = ysyf.ccode
        stockXyCsource.xyccodeDate = ysyf.ddate
        if (xhd.type=='YUE') {
          await useRouteApi(saveArXySource, {schemaName: dynamicTenantId})(stockXyCsource)
        } else {
          await useRouteApi(saveStockXyCsource, {schemaName: dynamicTenantId})(stockXyCsource)
        }

        if (sub(xhd.hxMoney, hxMoney1) == 0 && sub(xhd.idiscount, idiscount1) == 0) {
          list1.splice(j, 1)
        } else {
          list1[i].hxMoney = sub(xhd.hxMoney, hxMoney1)
          list1[i].idiscount = sub(xhd.idiscount, idiscount1)
        }
        hxMoney = sub(hxMoney,hxMoney1)
        idiscount = sub(idiscount,idiscount1)
      }
    }
  }
  for (let j = 0; j < list2.length; j++) {
    const xhd = list2[j]
    //保存销货单
    console.log(xhd.type)
    if (xhd.type=='CGDHD') {
      const item1 = saleousingList.value.filter(a => a.ccode == xhd.hxCcode)
      let saleousing = item1[0]
      if (xhd.hxMoney != null && xhd.hxMoney != '') {
        if (xhd.idiscount != null && xhd.idiscount != '') {
          saleousing.hxIsum = add(saleousing.hxIsum == null ? '0' : saleousing.hxIsum, add(xhd.hxMoney == null ? '0' : xhd.hxMoney, xhd.idiscount))
        } else {
          saleousing.hxIsum = add(saleousing.hxIsum == null ? '0' : saleousing.hxIsum, xhd.hxMoney == null ? '0' : xhd.hxMoney)
        }
        if (saleousing.hxIsum - saleousing.isum == 0) {
          saleousing.hxFlag = '1'
        }
      }
      await useRouteApi(saveWarehousing, {schemaName: dynamicTenantId})(saleousing)
      //修改销货单子表
      const sales = await useRouteApi(findWarehousingsByCcode,{schemaName: dynamicTenantId})({ccode:saleousing.ccode,billStyle:saleousing.billStyle})
      let money = xhd.hxMoney
      let salesList: any = []
      for (let j = 0; j < sales.length; j++) {
        let aa = sales[j]
        if (!hasBlank(money) && money != 0) {
          if (money > 0) {
            if (sub(aa.isum, aa.hxIsum) < money) {
              aa.hxIsum = aa.isum
              money = sub(money, sub(aa.isum, aa.hxIsum == null ? '0' : aa.hxIsum))
              aa.hxFlag = '1'
            } else {
              aa.hxIsum = add(aa.hxIsum == null ? '0' : aa.hxIsum, money)
              money = 0
            }
          } else {
            if (sub(aa.isum, aa.hxIsum) > money) {
              aa.hxIsum = aa.isum
              aa.hxFlag = '1'
              money = sub(money, sub(aa.isum, aa.hxIsum == null ? '0' : aa.hxIsum))
            } else {
              aa.hxIsum = add(aa.hxIsum == null ? '0' : aa.hxIsum, money)
              money = 0
            }
          }
          if (sub(aa.isum, aa.hxIsum) == 0) {
            aa.hxFlag = '1'
          } else {
            aa.hxFlag = '0'
          }
          aa.hzhcNum = add(aa.hzhcNum == null ? '0' : aa.hzhcNum, 1)
          salesList.push(aa)
        }
      }
      await useRouteApi(saveWarehousingsList,{schemaName: dynamicTenantId})(salesList)
    } else {
      if (xhd.idiscount != null && xhd.idiscount != '') {
        xhd.hxIsum = add(xhd.hxIsum == null ? '0' : xhd.hxIsum, add(xhd.hxMoney == null ? '0' : xhd.hxMoney, xhd.idiscount))
      } else {
        xhd.hxIsum = add(xhd.hxIsum == null ? '0' : xhd.hxIsum, xhd.hxMoney == null ? '0' : xhd.hxMoney)
      }
      if (sub(xhd.isum, xhd.hxIsum) == 0) {
        xhd.hxFlag = '1'
      } else {
        xhd.hxFlag = '0'
      }
      await useRouteApi(saveBeginBalance,{schemaName: dynamicTenantId})(xhd)
    }
  }
  await reloadTable()
}

const tableDataChange =  (r,c) => {
  countTable()
}

/**
 * @param e 回车确定事件
 * @param r rowObj
 * @param c className
 * @param t mark
 */
const focusNext =  (r, c) => {
  // 得到当前临时标记
  let t = getNextMark(c,false)
  Object.keys(r).map(i=>{if (i.startsWith('edit')) r[i] = null})
  r[`${c}`] = r[`temp${t}`];
  // 列表值发生变动 监听调整
  tableDataChange(r,c)
  // 查找下一个
  let list = getDataSource();
  let filters = ['hxMoney','idiscount']
  // if (!r.isBatch)filters.push('batchId') 要求填批号才填写
  // let cols:any = getColumns1().filter(it=>it.title!='序号' &&  filters.indexOf(it.dataIndex) == -1)
  let cols:any = getColumns().filter((it:any)=>it.title!='序号')
  let index = list.findIndex(it => it.key == r.key)
  let nextC = cols[0].dataIndex // 获取下一个列位置
  if (index == list.length - 1 && cols[cols.length - 1].dataIndex == c) { // 最后一行最后一列回车追加
    list.push({editOne: true})
    tableData.value = list
    setTableData1(list)
  } else {
    let cObj = cols[cols.findIndex(it => it.dataIndex == c) + 1]
    if (cObj != null) {
      nextC = cols[cols.findIndex(it => it.dataIndex == c) + 1].dataIndex
      // 的到指定位置
      let nextMark = getNextMark1(c, true)
      r[`edit${nextMark}`] = true;
      r[`${nextC}`] = r[`temp${nextMark}`];
    } else { //之后一列时换行
      nextC = cols[0].dataIndex
      let nextMark = getNextMark1(nextC, false)
      ++index
      list[index][`edit${nextMark}`] = true
      list[index][`${nextC}`] = list[index][`temp${nextMark}`];
      tableData.value = list
      setTableData(list)
    }
  }
  nextTick(() => {
    let doms:any = nextC == 'hxMoney' || nextC == 'idiscount' ? document.getElementsByClassName(nextC)[0] : document.getElementsByClassName(nextC)[0]?.getElementsByTagName('input')[0]
    if (null != doms) doms.focus()
  })
}
const getNextMark = (c,b) => {
  let model:any = {hxMoney:'One',idiscount:'Two'}
  if (b){
    // 获取下一个
    let keys= Object.keys(model)
    return model[keys[keys.findIndex(k=>k == c)+1]]
  }else {
    return model[c]
  }
}

/**
 * @param e 回车确定事件
 * @param r rowObj
 * @param c className
 * @param t mark
 */
const focusNext1 =  (r, c) => {
  // 得到当前临时标记
  let t = getNextMark1(c,false)
  Object.keys(r).map(i=>{if (i.startsWith('edit')) r[i] = null})
  r[`${c}`] = r[`temp${t}`];
  // 列表值发生变动 监听调整
  tableDataChange(r,c)
  // 查找下一个
  let list = getDataSource1();
  let filters = ['hxMoney','idiscount']
  // if (!r.isBatch)filters.push('batchId') 要求填批号才填写
  // let cols:any = getColumns1().filter(it=>it.title!='序号' &&  filters.indexOf(it.dataIndex) == -1)
  let cols:any = getColumns1().filter((it:any)=>it.title!='序号')
  let index = list.findIndex(it => it.key == r.key)
  let nextC = cols[0].dataIndex // 获取下一个列位置
  if (index == list.length - 1 && cols[cols.length - 1].dataIndex == c) { // 最后一行最后一列回车追加
    list.push({editOne: true})
    tableData1.value = list
    setTableData1(list)
  } else {
    let cObj = cols[cols.findIndex(it => it.dataIndex == c) + 1]
    if (cObj != null) {
      nextC = cols[cols.findIndex(it => it.dataIndex == c) + 1].dataIndex
      // 的到指定位置
      let nextMark = getNextMark1(c, true)
      r[`edit${nextMark}`] = true;
      r[`${nextC}`] = r[`temp${nextMark}`];
    } else { //之后一列时换行
      nextC = cols[0].dataIndex
      let nextMark = getNextMark1(nextC, false)
      ++index
      list[index][`edit${nextMark}`] = true
      list[index][`${nextC}`] = list[index][`temp${nextMark}`];
      tableData1.value = list
      setTableData1(list)
    }
  }
  nextTick(() => {
    let doms:any = nextC == 'hxMoney' || nextC == 'idiscount' ? document.getElementsByClassName(nextC)[0] : document.getElementsByClassName(nextC)[0]?.getElementsByTagName('input')[0]
    if (null != doms) doms.focus()
  })
}
const getNextMark1 = (c,b) => {
  let model:any = {hxMoney:'One',idiscount:'Two'}
  if (b){
    // 获取下一个
    let keys= Object.keys(model)
    return model[keys[keys.findIndex(k=>k == c)+1]]
  }else {
    return model[c]
  }
}

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

import SelectXhd from './popup/select-xhd.vue'
import {findWarehousingsByCcode, saveWarehousingsList,saveWarehousing} from "/@/api/record/system/yfd";
import {
  getByStockBalanceTask,
  stockBalanceTaskDelByUserName
} from "/@/api/record/stock/stock_balance";
import {saveTaskApi} from "/@/api/record/system/task";
const [registerSelectXhdPage, { openModal: openSelectXhdPage }] = useModal()
const openSelectXhd = () => {
  if(cvencode.value!=null && cvencode.value!='') {
    openSelectXhdPage(true, {
      dynamicTenantId: dynamicTenantId.value,
      year: pageParameter.year,
      cvencode: cvencode.value,
      list: getDataSource1(),
      apHexiaoAuto: apHexiaoAuto.value,
      apSourceFlag: apSourceFlag.value,
      apCheckFlag: apCheckFlag.value,
    })
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请先选择客户！'
    })
  }
}
async function saveSelectXhd(data){
  // console.log(data)
  tableData1.value = getDataSource1().filter(item=>item.ccode!=null && item.ccode!='')
  data.map(item=>{
    item.hxStyle = item.billStyle
    item.hxCcode = item.ccode
    if (item.hxIsum!=null && item.hxIsum !='') {
      item.whxIsum = sub(item.isum, item.hxIsum)
    } else {
      item.whxIsum = item.isum
    }
    return item
  })
  tableData1.value.push(...data)
  if (tableData1.value.length<10) {
    let num = 10 - tableData1.value.length
    for (let i = 0; i < num; i++) {
      tableData1.value.push({})
    }
  }
}
</script>
<style src="./global-menu-index.less" lang="less" scoped="scoped"></style>
<style scoped lang="less">
@Global-Border-Color: #c9c9c9; // 全局下划线颜色
@Global-Label-Color: #666666; // 全局#c9c9c9颜色
@Global-Comm-BcOrText-Color: #0096c7; // 全局#c9c9c9颜色

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
  font-size: 16px !important;
  padding: 5px 8px !important;
  border-color: #aaaaaa !important;
  font-weight: 550;
}

.a-table-font-size-12 :deep(td),
.a-table-font-size-12 :deep(th) {
  font-size: 13px !important;
  padding: 2px 8px !important;
  border-color: #aaaaaa !important;
  font-weight: 600;
}

.app-container:nth-of-type(1) {
  background-color: #f2f2f2;
  padding: 10px 5px;
  margin: 10px 10px 5px;
}

.app-container:nth-of-type(2) {
  /*padding: 0px;
  margin: 5px 10px;
  background: #b4c8e3 !important;*/
  background-color: #f2f2f2;
  padding: 0px;
  //margin: 5px 10px;
}

.app-container:nth-of-type(3) {
  /*padding: 0px;
  margin: 5px 10px;
  background: #b4c8e3 !important;*/
  background-color: #f2f2f2;
  padding: 0px;
  //margin: 5px 10px;
}

:deep(.ant-table-thead) th{
  text-align: center !important;
  font-weight: bold;
  //background-color: #f2f2f2 !important;
  background-color: #cccccc !important;
  border-color: #aaaaaa !important;
}

:deep(.ant-input),:deep(.ant-select),:deep(.ant-btn){
  border: 1px solid #c9c9c9;
}

.actod-btn {
  color: @Global-Comm-BcOrText-Color;
  font-size: 14px;
  border-color: @Global-Border-Color;
}

.actod-btn-last {
  border-right: 1px solid @Global-Border-Color;
}

.actod-btn:hover {
  background-color: @Global-Comm-BcOrText-Color;
  color: white;
}

:deep(.nc-summary) {
  font-size: 13px;
  font-weight: bold;
  width: 100%;
  background-color: #cccccc;
  border:none !important;

  > div {
    display: inline-block;
    background-color: #d8d8d8;
    padding: 5px;
  }
  > div:nth-of-type(2),> div:nth-of-type(3),> div:nth-of-type(4),> div:nth-of-type(5),> div:nth-of-type(6){
    >span:nth-of-type(1){
      margin-left: 10%;
      float: left;
    }
  }
  > div:nth-of-type(1) {
    width: 19%;
    text-align: center;
  }

  > div:nth-of-type(2) {
    width: 20%;
    margin: 0 1px;
    text-align: right;
  }
  > div:nth-of-type(3) {
    width: 20%;
    text-align: right;
    margin: 0 1px;
  }
  > div:nth-of-type(4) {
    width: 20%;
    margin: 0 1px;
    text-align: right;
  }
  > div:nth-of-type(5) {
    width: 20%;
    text-align: right;
    margin: 0 1px;
  }
  > div:nth-of-type(6) {
    width: 20%;
    text-align: right;
  }
}

:deep(.ant-input-number){
  border: none;
  border-bottom: solid 1px rgb(191, 191, 191) !important;
  width: 100%;
  min-width: 0;

  .ant-input-number-handler-wrap{
    display:none;
  }
  input{
    font-size: 14px;
    font-weight: bold;
    font-family: Arial !important;
  }
}
:deep(.right) input{
  text-align:right;
}

.status-look {
  pointer-events: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
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
