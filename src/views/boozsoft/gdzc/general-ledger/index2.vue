<template>
  <div class="app-container">
    <div class="app-container-top">
      <div class="app-container-top-one">
        <div class="act-one-d-left" style="font-weight: bold; padding: 0 6px; width: 14%; color: #666666;">管理类型：<span style="color: black;">{{kmList.length > 0? kmList.filter(it=>it.ecCode == pageParameter.km)[0]['ecName'] : ''}}</span></div>
        <div class="act-one-d-title">
          <span class="acto-d-title-span">固定资产总账</span>
        </div>
        <div class="act-one-d-btn-group">
          <Button class="actod-btn" @click="openQueryPage()">查询</Button>
          <Button class="actod-btn"><span>导出</span></button>
          <Button class="actod-btn" @click="openPrint()"><span>打印</span></button>
          <Button class="actod-btn actod-btn-last" @click="closeCurrent()">退出</Button>
        </div>
      </div>
      <div class="app-container-top-two">
        <div class="act-two-d-left">
          <AccountPicker v-if="pageMode=='1'"  readonly=""  theme="one" @reloadTable="dynamicAdReload"/>
        </div>
        <div class="act-two-d-center">
          <span>期间：</span>{{pageParameter.strDate + '~'+pageParameter.strDate}}
        </div>
        <div class="act-two-d-right">
          <div class="acttd-right-d-search">
            <Select   :filter-option="filterOption"
                      @change="handleChangeMinKm"
                      v-model:value="pageParameter.km"
                    class="acttdrd-search-select">
              <SelectOption   style="width: 180px;font-size: 14px;" v-for="d in kmList" :value="d.ecCode">
                {{ d.ecName }}
              </SelectOption>
            </Select>
            <InputSearch
              class="acttdrd-search-input"
              @search="pageSearch"
              v-model:value="pageParameter.searchConditon.value"
            />
          </div>
          <div class="acttd-right-d-btns">
            <Button class="acttdrd-btn" @click="closeFilterV(),pageReload()">
              <SyncOutlined :style="{ fontSize: '14px' }"/>
            </Button>
            <Popover placement="bottom">
              <template #content>
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
                            <div v-if="editableData[record.key]"
                                 class="editable-cell-input-wrapper">
                              <Input type="text" v-model:value="editableData[record.key].nameNew"
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
              <Button class="acttdrd-btn">
                <SettingFilled :style="{ fontSize: '14px' }"/>
              </Button>
            </Popover>
            <Popover placement="bottom">
              <template #content>

              </template>
              <Button class="acttdrd-btn">
                <PicLeftOutlined :style="{ fontSize: '14px' }"/>
              </Button>
            </Popover>
            <Button class="acttdrd-btn" @click="()=>{
            if (!visible){ visible = true;reloadColumns()}
            return false
          }">
              <FilterFilled :style="{ fontSize: '14px' }"/>
            </Button>
          </div>
        </div>
      </div>
<!--      <div class="app-container-head">
        <div class="container-head-title" style="float: none;text-align: center;display: revert;margin-left:0px">
          <b class="noneSpan" >{{ titleName }}总账</b>
        </div>

        <div>

          <div style="display: inline-block;margin-left: 1%;font-size: 14px;width: 40%">
            <div style="padding-top: 20px" v-if="pageMode=='1'">
              <AccountPicker theme="three" readonly="" @reloadTable="dynamicAdReload"/>
            </div>
          </div>
          <div style="display: inline-block;font-size: 14px;float: none;text-align: center;display: revert;padding-left: 12%;">
            &emsp;&emsp;<span style="font-size: 14px;">日期：</span><span style="color: black;font-weight: bold">{{ pageParameter.strDate }}</span>
          </div>
        </div>

        <div style="clear:both" />

        <div style="margin-top: .1%;">
          <div style="display: inline-block;margin-left: 1%;font-size: 14px;width: 50%">
            <div style="display: inline-block;font-size: 14px;padding-top: 8px">
              <span style="font-size: 14px;">条件：</span>
              <a-select
                show-search
                placeholder="请选择"
                option-filter-prop="children"
                style="width: 220px;font-size: 14px;"
                :filter-option="filterOption"
                @change="handleChangeMinKm"
                v-model:value="pageParameter.km"
              >
                <a-select-option   style="width: 180px;font-size: 14px;" v-for="d in kmList" :value="d.ecCode">
                  {{ d.ecName }}
                </a-select-option>
              </a-select>
            </div>
          </div>

          <div style="float: right; margin-left: 10px;margin-top: .5%;">
            <a-button class="ant-btn" @click="closeFilterV(),pageReload()">
              <SyncOutlined :style="{ fontSize: '14px' }" />
            </a-button>

            <a-popover class="ant-btn-default" placement="bottom">
              <template #content>
                <a-popconfirm
                  ok-text="保存"
                  cancel-text="关闭"
                  @confirm="confirm"
                  @cancel="cancel"
                >
                  <template #icon><b>栏目设置</b><br></template>
                  <template #title>
                    <a-table bordered :data-source="dynamicColumnData" :columns="dynamicColumns"
                             childrenColumnName="children" :pagination="false" style="max-height: 500px;overflow-y: auto" class="lanmu-table">
                      <template #checkBox="{ text, record }">
                        <a-checkbox v-model:checked="record.check" :disabled="record.isFixed"/>
                      </template>
                      <template #widthInput="{ text, record }">
                        <div class="editable-cell">
                          <div v-if="editableData[record.key]" class="editable-cell-input-wrapper">
                            <a-input type="number" v-model:value="editableData[record.key].width"
                                     @pressEnter="save(record.key,record.min,record.max)" style="width: 80px"/>
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
                                       :disabled="record.align=='' || record.name=='本币金额' || record.name=='原币金额'
                                        || record.name=='借方' || record.name=='贷方' || record.name=='余额'">
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
              <a-button>
                <SettingFilled :style="{ fontSize: '14px' }"/>
              </a-button>
            </a-popover>

            <a-button @click="()=>{
            if (!visible){ visible = true;reloadColumns()}
            return false
          }">
              <FilterFilled :style="{ fontSize: '14px' }" />
            </a-button>
          </div>

          <div v-if="pageMode=='1'" style="float: right; position: relative;margin-top: .5%;">
            &lt;!&ndash; 搜索 &ndash;&gt;
            <a-select v-model:value="pageParameter.searchConditon.requirement" style="width: 130px;" class="special_select">
              <template v-for="item in searchConditonList.slice(1)">
                <a-select-option v-if="item.ifShow == true" :value="item.dataIndex">
                  {{item.title}}
                </a-select-option>
              </template>
            </a-select>
            <a-input-search
              placeholder=""
              v-model:value="pageParameter.searchConditon.value"
              @search="pageSearch"
              style="width: 150px;border-radius: 4px"
            />
          </div>
        </div>
      </div>-->
    </div>
    <div class="app-container-bottom" :style="{height: (windowHeight+60)+'px',marginTop: '5px'}">
      <div v-if="pageMode=='1'" :style="{height: (windowHeight+60)+'px'}">
        <BasicTable
          ref="tableRef"
          :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
          :scroll="{ x: totalColumnWidth,y: windowHeight }"
          size="small"
          @register="registerTable"
        >

          <template #number="{record,index }">
            <span slot="number" slot-scope="text,record,index">
             {{index+1}}
            </span>
          </template>

          <template #lb="{ record }" class="a-table-money-font-size a-table-font-arial">
            <span style="float: left"  v-if=" record.lbCode.length > 1 && record.lbCode.length < 4">&emsp;&emsp;{{ record.lb }}</span>
            <span style="float: left"  v-if=" record.lbCode.length > 3 && record.lbCode.length < 6">&emsp;&emsp;&emsp;&emsp;{{ record.lb }}</span>
            <span style="float: left"  v-if=" record.lbCode.length > 5 && record.lbCode.length < 8">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;{{ record.lb }}</span>
            <span style="float: left"  v-if=" record.lbCode.length > 7 && record.lbCode.length < 10">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;{{ record.lb }}</span>
            <span style="float: left" v-if=" record.lbCode.length < 3 ">{{ record.lb }}</span>
          </template>

          <template #yye="{ record }" class="a-table-money-font-size a-table-font-arial">
            <span style="color: #0096c7;float: right" >{{ formatData(record.yye) }}</span>
          </template>

          <template #zye="{ record }" class="a-table-money-font-size a-table-font-arial">
            <span style="color: #0096c7;float: right" @click="goto()">{{ formatData(record.zye) }}</span>
          </template>

          <template #jye="{ record }" class="a-table-money-font-size a-table-font-arial">
            <span style="color: #0096c7;float: right" >{{ formatData(record.jye) }}</span>
          </template>

          <template #jingzhi="{ record }" class="a-table-money-font-size a-table-font-arial" >
            <span style="color: #0096c7;float: right" >{{ formatData(record.jingzhi) }}</span>
          </template>

        </BasicTable>
      </div>
      <div :style="{height: (60+windowHeight)+'px',overflowY: 'auto'}" v-else>
        <TablePiece v-if="startRender" :ljchecked="ljchecked" v-model="pageParameter" v-for="accId in queryAccIds"
                    :pageAccName="showCurrentName(accId)" :pageAccId="accId" :exportData="exportData" />
      </div>
      <Drawer
        title="过滤漏斗"
        placement="right"
        :closable="true"
        v-if="visible"
        :mask="false"
        :visible="visible"
        :get-container="false"
        :wrap-style="{ position: 'absolute' }"
        @close="visible=false,reloadColumns()"
      >
        <ul>
          <li>
              <span style="color: black;font-weight: bold">
                借方本币：
              </span>
            <div>
              <a-input v-model:value="pageParameter.filterConditon.amountMinJf"  placeholder="" style="width: 95px;font-size: 10px"/>
              ~
              <a-input v-model:value="pageParameter.filterConditon.amountMaxJf"  placeholder="" style="width: 95px;font-size: 10px;float: right"/>
            </div>
          </li>
          <li style="margin-top: 5%">
              <span style="color: black;font-weight: bold">
                贷方本币：
              </span>
            <div>
              <a-input v-model:value="pageParameter.filterConditon.amountMinDf"  placeholder="" style="width: 95px;font-size: 10px"/>
              ~
              <a-input v-model:value="pageParameter.filterConditon.amountMaxDf"  placeholder="" style="width: 95px;font-size: 10px;float: right"/>
            </div>
          </li>
          <li style="margin-top: 5%">
              <span style="color: black;font-weight: bold">
                余额本币：
              </span>
            <div>
              <a-input v-model:value="pageParameter.filterConditon.amountMinYe"  placeholder="" style="width: 95px;font-size: 10px"/>
              ~
              <a-input v-model:value="pageParameter.filterConditon.amountMaxYe"  placeholder="" style="width: 95px;font-size: 10px;float: right"/>
            </div>
          </li>
        </ul>
        <br/>
        <a-button type="primary"  style="float: right;" @click="filterSearch">
          <span style="font-size: 14px">开始</span>
        </a-button>
      </Drawer>
      <Query
        @save="loadPage"
        @register="registerQueryPage"
      />
      <Print @save="loadPrint" @register="registerPrintPage"/>
      <Loading :loading="compState.loading" :absolute="compState.absolute" :tip="compState.tip" />

    </div>
  </div>
</template>
<script setup lang="ts">
import { BasicTable, useTable } from '/@/components/Table'
import { useModal } from '/@/components/Modal'
import { PageWrapper } from '/@/components/Page'

import {
  DatePicker , Select , Input , Popover, Switch,
  Radio , Upload , Pagination , Popconfirm , Table ,
  Checkbox , message,Drawer ,Button
} from "ant-design-vue"
const RangePicker=DatePicker.RangePicker
const SelectOption=Select.Option
const InputSearch=Input.Search
const RadioGroup=Radio.Group
const RadioButton=Radio.Button
import {
  SortDescendingOutlined,
  SortAscendingOutlined,
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
  FilterFilled,CheckOutlined,EditOutlined,SearchOutlined
} from '@ant-design/icons-vue'
import { findAllAccvoucher, breakNumTidy,findDbLanMuList,saveLanMuList } from '/@/api/record/system/accvoucher'
import { useGdGlStore } from '/@/api/record/gdzc/generalLedger/generalLedger'
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker.vue";
import TablePiece from "./popup/TablePiece.vue";

import {onMounted, provide, reactive, ref} from "vue";
import moment from "moment";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import { initDynamics,assemblyDynamicColumn} from "./data";
import Query from "./popup/query.vue";
import {cloneDeep} from "lodash-es";
import {useMessage} from "/@/hooks/web/useMessage";
import {
  askTask,
  compareTime,
  findByFunctionModule,
  getCurrentAccountName,
  markAnomaly,
  offsetToStr,
  getThisIndexImg
} from "/@/api/task-api/tast-bus-api";
import {findAll} from "/@/api/record/gdzc/generalLedger/data";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import router from "/@/router";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import { exportExcel } from "/@/api/record/generalLedger/excelExport";
import {findByAccId} from "/@/api/record/system/account";
import {useTabs} from "/@/hooks/web/useTabs";
import {useNewPrint} from "/@/utils/boozsoft/print/print";
import {tableStyle} from "/@/store/modules/abc-print";
import Print from "./popup/print.vue";
const {closeCurrent} = useTabs(router);
const { createConfirm,createWarningModal } = useMessage();
// 全局常量
const glStore = useGdGlStore()

// 页面变量
const pageParameter = reactive({
  pzType: '',
  queryMark: 'T1',
  showRulesSize: 'MIN',
  condition: {},
  searchConditon: {
    requirement: 'fx',
    value: '',
  },
  filterConditon: {
    amountMinDf: '',
    amountMaxDf: '',
    amountMinJf: '',
    amountMaxJf: '',
    amountMinYe: '',
    amountMaxYe: '',
  },
  reloadMark: false,
  km: "",
  minKm:"" ,
  maxKm: "",
  // 显示期间
  endDate: "",
  strDate: "",
  //显示未记账
  ibook: true,
  // 级次
  minJc: "1",
  maxJc: "1",
  moji: 1,
  jd: 2,
  dw: '',
  wb: '',

  //科目类别权限
  userId: '',
  year: '',
  accId: '',
  isType: '',
  isCode: '',
})

const styleName = ref<String>("金额式")
// 科目名称标题
const titleName = ref<String>("")
// 会计科目
const kmList: any = ref([])
//币种名称
const bzName = ref<String>("")
//显示未记账
const ibook = ref<boolean>(true)
const showStyle = ref([
  {
    'name': '金额式',
    'value': 'T1'
  },{
    'name': '数量金额式',
    'value': 'T2'
  },{
    'name': '外币金额式',
    'value': 'T3'
  },{
    'name': '数量外币式',
    'value': 'T4'
  }
])

const val = {
  openOne: 0
}
const visible = ref(false);
const searchConditonList = ref([])
const lanMuData = {'accId':'','menuName':'资产总账','type':'',objects: '',username:useUserStoreWidthOut().getUserInfo.username}
// 表格参数
const loadMark = ref(false)
const tableSelectedRowKeys = ref([])
const tableSelectedRowObjs = ref([])
const windowWidth  = (document.documentElement.clientWidth -70)
const windowHeight  = (document.documentElement.clientHeight -350)
const totalColumnWidth = ref(0)
// 数据库模式名称
const databases = ref(getCurrentAccountName(false))
// 数据库模式名称
const database = ref(getCurrentAccountName(true));
let databasesName = ref(getCurrentAccountName(true))
const CrudApi = {
  list: useRouteApi(findAll, {schemaName: database}),
  columns: JSON.parse(JSON.stringify(glStore.getColumns(pageParameter.queryMark)))
}
const tableRef = ref(null)

// 组件实例区
const [registerTable, { reload,setColumns,getColumns,getDataSource,setTableData }] = useTable({
  api: CrudApi.list,
  columns: CrudApi.columns,
  bordered: true,
  loading: loadMark.value,
  immediate: false,
  canResize: true,
  /*  showSummary: true,
    summaryData: [],*/
  showIndexColumn: false , //显示序号列
  pagination:{ pageSize: 200,showSizeChanger: true, pageSizeOptions: ['200','500','1000','1500'],showTotal: t => `总共${t}条数据` },
  /*actionColumn: {
    width: 80,
    title: '操作',
    dataIndex: 'action',
    slots: { customRender: 'action' }
  } as　BasicTable*/
  tableSetting: {
    // 是否显示刷新按钮
    redo: true,
    // 是否显示尺寸调整按钮
    size: true,
    // 是否显示字段调整按钮
    setting: true,
    // 是否显示全屏按钮
    fullScreen: true,
  }
})
const [registerQueryPage, { openModal: openQueryPageM }] = useModal()
const [registerPrintPage, {openModal: openPrintPage}] = useModal()

onMounted( ()=>{
  /*useCompanyOperateStoreWidthOut().commitSchemaName(
    JSON.parse(window.localStorage.getItem('datasource')).schemaName + '-' + '2021'
  );*/
  val.openOne = 1
  openQueryPageM(true, {
    data: val
  })
  loadMark.value = true
  // setTimeout(async ()=>{ pageReload()},1000)
})
// 实例函数区
function money(val:any) { // 金额格式化
  if(val==null)val=''
  val = val.toString().replace(/\$|\,/g, '')
  if (isNaN(val)) {
    val = '0'
  }
  const sign = (val === (val = Math.abs(val)))
  val = Math.floor(val * 100 + 0.50000000001)
  let cents: string = (val % 100) +''
  val = Math.floor(val / 100).toString()
  if (cents < 10) {
    cents = '0' + cents
  }
  for (let i = 0; i < Math.floor((val.length - (1 + i)) / 3); i++) {
    val = val.substring(0, val.length - (4 * i + 3)) + ',' + val.substring(val.length - (4 * i + 3))
  }
  let re = (((sign) ? '' : '') + val + '.' + cents)
  return re == ('0.00' || '0')?'': re
}
function formatData(data:any){
  let str = ""
  if(data){
    if(0 === data || '0.00'=== data ){
      str = ""
    }else {
      // 千分位保留2位小数
      var source = String(data).split("."); //按小数点分成2部分
      source[0] = source[0].replace( new RegExp('(\\d)(?=(\\d{3})+$)' , 'ig'), "$1,");//只将整数部分进行都好分割
      str = source.join("." );//再将小数部分合并进来
    }

  }
  return str;
}
function formatNum(data:any){
  let str = ""
  if(data){
    if(0 === data){
      str = ""
    }else {
      var source = String(data.toFixed(pageParameter.jd)).split("."); //按小数点分成2部分
      source[0] = source[0].replace( new RegExp('(\\d)(?=(\\d{3})+$)' , 'ig'), "$1,");//只将整数部分进行都好分割
      str = source.join("." );
    }
  }
  return str;
}
const openQueryPage = () => {
  val.openOne = 0
  openQueryPageM(true, {
    data: val
  })
}
// 页面函数区
const onSelectChange = (selectedRowKeys,obj) => {
  tableSelectedRowKeys.value = selectedRowKeys;
  tableSelectedRowObjs.value = obj;
};
const pageReload =  () =>{
 reload({
    searchInfo: pageParameter
  })
}
const breakNumTidyBtn = async() => {
  breakNumTidy()
  pageReload()
}
const onChangeSwitch = async(v)=>{ // 动态列
  styleName.value = showStyle.value.filter(o=> o.value === v)[0].name
  pageParameter.queryMark = v
  resetDynamicColumnData()
  pageParameter.searchConditon.requirement = 'fx'
  pageParameter.searchConditon.value = ''
}
const  pageSearch = async ()=>{
  /* if (''==pageParameter.searchConditon.value.trim())return false*/
  // 搜索前校验格式
  if (''==pageParameter.searchConditon.requirement.trim()){
    message.warn('请选择检索条件')
    return false
  }
  // 校验完成后搜索
  closeFilterV()
  pageReload()
}

const  filterSearch = async ()=>{
  /* if (''==pageParameter.searchConditon.value.trim())return false*/
  // 搜索前校验格式
  let min  = pageParameter.filterConditon.amountMinJf.trim()
  let max  = pageParameter.filterConditon.amountMaxJf.trim()
  if (max != '' ||  min != ''){
    if (min != '' && max != '' && (!isRealNum(min) || !isRealNum(max) || parseFloat(min) == 0 || parseFloat(max) == 0)){
      message.warn('请输入数值类型值并且值不能为0！')
      closeFilterV()
      return false
    }else if (parseFloat(min) > parseFloat(max)){
      message.warn('金额区间最小值部门大于最大值！')
      closeFilterV()
      return false
    }
  }

  let min2  = pageParameter.filterConditon.amountMinDf.trim()
  let max2  = pageParameter.filterConditon.amountMaxDf.trim()
  if (max2 != '' ||  min2 != ''){
    if (min2 != '' && max2 != '' && (!isRealNum(min2) || !isRealNum(max2) || parseFloat(min2) == 0 || parseFloat(max2) == 0)){
      message.warn('请输入数值类型值并且值不能为0！')
      closeFilterV()
      return false
    }else if (parseFloat(min2) > parseFloat(max2)){
      message.warn('金额区间最小值部门大于最大值！')
      closeFilterV()
      return false
    }
  }

  let min3  = pageParameter.filterConditon.amountMinYe.trim()
  let max3  = pageParameter.filterConditon.amountMaxYe.trim()
  if (max != '' ||  min3 != ''){
    if (min3 != '' && max3 != '' && (!isRealNum(min3) || !isRealNum(max3) || parseFloat(min3) == 0 || parseFloat(max3) == 0)){
      message.warn('请输入数值类型值并且值不能为0！')
      closeFilterV()
      return false
    }else if (parseFloat(min3) > parseFloat(max3)){
      message.warn('金额区间最小值部门大于最大值！')
      closeFilterV()
      return false
    }
  }

  // 校验完成后搜索
  pageReload()
}

const closeFilterV = ()=>{
  pageParameter.filterConditon.amountMinDf = ''
  pageParameter.filterConditon.amountMaxDf = ''
  pageParameter.filterConditon.amountMinJf = ''
  pageParameter.filterConditon.amountMaxJf = ''
  pageParameter.filterConditon.amountMinYe = ''
  pageParameter.filterConditon.amountMaxYe = ''
  visible.value = false
  reloadColumns()
}

function isRealNum(val){
  // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除，
  if(val === "" || val ==null){
    return false;
  }
  if(!isNaN(val)){
    //对于空数组和只有一个数值成员的数组或全是数字组成的字符串，isNaN返回false，例如：'123'、[]、[2]、['123'],isNaN返回false,   //所以如果不需要val包含这些特殊情况，则这个判断改写为if(!isNaN(val) && typeof val === 'number' )
    return true; 　　}　else{ 　　　　return false; 　　}
}

/*start栏目设置*/
const dynamicColumns = initDynamics().DEFAULT
const dynamicColumnData = ref([])
let dynamicColumnDataCopy = []
const editableData = reactive({});

const confirm = (e: MouseEvent) => {
  // 询问
  createConfirm({
    iconType: 'warning',
    title: '栏目同步',
    content: '是否将刚才设置同步数据库!',
    onOk: async() => {
      // 调整数据库 列参数
      lanMuData.accId = getCurrentAccountName(false)
      lanMuData.objects = JSON.stringify(filterModifyData(dynamicColumnData.value, dynamicColumnDataCopy))
      if (lanMuData.objects == '[]'){
        createWarningModal({content: '请先做修改后再进行确认同步数据库！'})
      }else {
        saveLanMuList(lanMuData).then(res=>{
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

function filterModifyData(lanMuList:any,copyList) {
  let a =  lanMuList.filter(item=> {
    try {
      copyList.forEach(item2=>{
        if (item.key === item2.key && item.name == item2.name){
          if (item.nameNew != item2.nameNew || item.width != item2.width || item.check != item2.check || item.align != item2.align)
            throw new Error('ok')
        }
      })
      return false
    }catch (e) {
      if (e.message == 'ok'){
        return  true
      }else {
        return  false
      }
    }
  })

  //对子节点处理  过滤有子节点并且变动 添加到a
  lanMuList.forEach((item, index)=>{
    if(item.children){
      let b = item.children.filter(item2=>{
        try {
          copyList[index].children.forEach(item3=>{
            if (item2.key === item3.key && item2.name == item3.name){
              if (item2.nameNew != item3.nameNew || item2.width != item3.width || item2.check != item3.check || item2.align != item3.align)
                throw new Error('ok')
            }
          })
          return false
        }catch (e) {
          if (e.message == 'ok'){
            return  true
          }else {
            return  false
          }
        }
      })
      b.forEach(item=>{
        a.push(item);
      })
    }
  })
  return a;
}

const cancel = (e: MouseEvent) => {
  // 恢复默认
  dynamicColumnData.value = []
  dynamicColumnData.value = dynamicColumnDataCopy
}

function resetDynamicColumnData() {
  // 先从数据查询是否已经设置
  lanMuData.accId = getCurrentAccountName(false)
  lanMuData.type = pageParameter.queryMark
  findDbLanMuList(lanMuData).then(res=>{
    // 栏目列
    let dbList = res.items
    if (dbList.length > 0){
      let statiList = initDynamics()[pageParameter.queryMark]
      dbList = combineParameters(statiList,dbList)
      dynamicColumnData.value = dbList
      dynamicColumnDataCopy = JSON.parse(JSON.stringify(dbList))
    }else {
      let statiList = initDynamics()[pageParameter.queryMark]
      dynamicColumnData.value = statiList
      dynamicColumnDataCopy = JSON.parse(JSON.stringify(statiList))
    }
    // 表格列
    reloadColumns()
    pageReload()
  })
}

function combineParameters(staticList:any,dbList:any) {
  staticList.forEach(item=>{
    dbList.forEach(item2=>{
      if (item.key === item2.key && item.name === item2.name){
        item.nameNew = item2.nameNew
        item.width = parseInt(item2.width)
        item.check = item2.check == 'true'
        item.align = item2.align
      }else{
        //对子节点处理
        if(item.children){
          item.children.forEach(item3=>{
            if (item3.key === item2.key && item3.name === item2.name){
              item3.nameNew = item2.nameNew
              item3.width = parseInt(item2.width)
              item3.check = item2.check == 'true'
              item3.align = item2.align
            }
          })
        }
      }
    })
  })
  return staticList
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
const filterOption = (input: string, option: any) => {
  return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
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

const reloadColumns = ()=>{
  let newA = JSON.parse(JSON.stringify(glStore.getColumns(pageParameter.queryMark)))
  newA= assemblyDynamicColumn(dynamicColumnData.value,newA)
  setColumns(newA)
  initTableWidth(newA)
  //多表头 添加子节点筛选
  let seachList = []
  newA.forEach(item=>{
    if(item.children){
      item.children.forEach(item2=>{
        item2.title = item.title + item2.title
        seachList.push(item2)
      })
    }else{
      seachList.push(item)
    }
  })
  searchConditonList.value = seachList
}

function initTableWidth(thisCs){
  let total = 60
  thisCs.forEach(item => {
    if (item.ifShow == null || item.ifShow)
      total += parseInt(item.width)
  })
  if (total > windowWidth) {
    let f = 0
    if (visible.value) f = 260
    totalColumnWidth.value = Number(windowWidth) - f
    // tableRef.value.$el.style.setProperty('width', (windowWidth + 20 - f) + 'px')
  } else {
    if (visible.value && (windowWidth - 260) < total) total -= (total - (windowWidth - 260))
    totalColumnWidth.value = total
    // tableRef.value.$el.style.setProperty('width', (total + 20) + 'px')
  }
}
/*集团查询页面 页面参数*/
const pageMode = ref('1')
const queryAccIds = ref([])
const accAuthList = ref([])
const accNameAll = ref('')
/*栏目设置end*/
const loadPage = async(map)=>{

  let data = map.data
  accNameAll.value = data.pageParameter.accNameAll   // 账套全称
  accAuthList.value = map.accAuthList
  pageMode.value = data.queryMode
  if (pageMode.value == '0') queryAccIds.value = data.accIds
  // 回显筛选条件
  loadMark.value = false
  //设置表头
  pageParameter.queryMark = data.styleValue

  //类别
  kmList.value = data.lbList
  if(data.lb){
    pageParameter.km = data.lb
  }else{
    //pageParameter.km =  kmList.value[0].ecCode
  }
  pageParameter.manageCode =  data.accountCode
  pageParameter.date =  '2021-12'//data.strDate
  pageParameter.type = 'T1'

  // ++++++++++++ 复写公司代码 +++++++++++++++++++
  pageParameter.companyCode=data.pageParameter.companyCode
  pageParameter.companyName=data.pageParameter.companyName
  pageParameter.database=data.pageParameter.database
  database.value=data.pageParameter.database
  loadMark.value = false
  pageParameter.strDate = data.strDate.replaceAll("-",".")
  pageParameter.minJc = data.minJc
  pageParameter.maxJc = data.maxJc

  //权限过滤参数
  pageParameter.userId = data.userId
  pageParameter.year = pageParameter.strDate.split('.')[0]
  pageParameter.accId = data.pageParameter.accId
  if(data.accId){
    pageParameter.accId = data.accId
  }
  if (pageMode.value == '1') {
    resetDynamicColumnData()
    closeFilterV()
    pageParameter.searchConditon.value = ''
  }else {
    // 字页面
    if (data.openOne == 1) {
      startRender.value = true
      pageParameter.reloadMark = false
    } else {
      startRender.value = false
      pageParameter.reloadMark = true
      startRender.value = true
    }
    resetDynamicColumnData()
  }
}

async function handleChangeMinKm(){

  //切换数据
  titleName.value = kmList.value.filter(o=> o.ccode === pageParameter.km)[0].ccodeName
  const dw = kmList.value.filter(o=> o.ccode === pageParameter.km)[0].menterage // 单位
  const wb = kmList.value.filter(o=> o.ccode === pageParameter.km)[0].currencyType //美元
  pageParameter.dw = dw
  pageParameter.wb = wb
  const kmStyle =  kmList.value.filter(o=> o.ccode === pageParameter.km)[0].cbookType //科目样式
  if(kmStyle){
    pageParameter.queryMark  = showStyle.value.filter(o=> o.name === kmStyle)[0].value //显示样式
  }else {
    pageParameter.queryMark  = 'T1';
  }
  closeFilterV()
  pageReload()
}

const userName = useUserStoreWidthOut().getUserInfo.username

const goto = async () => {
  const kmStyle =  kmList.value.filter(o=> o.ccode === pageParameter.km)[0].cbookType //科目样式
  if(kmStyle){
    pageParameter.queryMark  = showStyle.value.filter(o=> o.name === kmStyle)[0].value //显示样式
  }else {
    pageParameter.queryMark  = 'T1';
  }
  const json = {
    ishaveRjz: ibook.value,
    strDate: pageParameter.strDate,
    endDate: pageParameter.endDate,
    minJc: pageParameter.minJc,
    maxJc: pageParameter.maxJc,
    km: kmList.value[0].ccode,
    maxKm:  kmList.value[0].ccode,
    timflg: 'qj',
    showStyle: pageParameter.queryMark,
    fontSize: pageParameter.showRulesSize,
    bz: bzName.value,
    bzName:'全部',
    jc: pageParameter.moji,
    riqi: '',
    openOne: '2',
    database: getCurrentAccountName(true),
  }
  console.log(json)
  router.push({
    path: '/zhongZhang/account-book/ab-kemuzhang/abk-mxtable',
    query: json,
  });
}

const exportExcelNow = async () => {
  const data = JSON.parse(JSON.stringify(getDataSource()))
  const columns = getColumns()
  //筛选条件
  const title = [
    "科目:"+ pageParameter.km +'-'+ titleName.value +"   币种："+ bzName.value +"   样式："+ styleName.value +"   期间："+ pageParameter.strDate +'-'+ pageParameter.endDate +" ",
  ]
  //根据columns 格式化导出excel数据
  const multiHeader = [[],[]]
  const keys = []
  const merges = []
  const cellStyle = [
    {
      cell: 'A1',
      font: {
        sz: 16,
        color: { rgb: "000000" },
        bold: true,
      },
      fill: {
        fgColor: { rgb: "ffffff" },
      }
    },
  ]
  const cell = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
  let flg = 0;
  columns.forEach((v,index)=>{
    //多级表头
    if(v.children){
      multiHeader[0].push(v.title)
      for (let i = 0; i < v.children.length; i++) {
        if(i < v.children.length-1){
          multiHeader[0].push('')
        }
        multiHeader[1].push(v.children[i].title)
        keys.push(v.children[i].dataIndex)
      }
      //根据子节点数量合并单元格 5 56  6 78 7 9 10
      if(flg === 0){
        flg = index
      }
      merges.push('`' + cell[flg] + '3:' + cell[flg + v.children.length-1] +'3`');
      flg = flg + v.children.length
    }else{
      multiHeader[0].push(v.title)
      multiHeader[1].push('')
      keys.push(v.key)
      //合并上下单元格
      merges.push('`' + cell[flg] + '3:' + cell[flg] +'4`');
      flg = flg + 1
    }
  })
  merges.push('`A2:' + cell[keys.length-1] +'2`');

  //数量金额格式化调整
  data.forEach(v=>{
    v.sjnum = formatNum(v.sjnum )
    v.sjwb = formatData(v.sjwb )
    v.sjmoney = formatData(v.sjmoney )
    v.sdnum = formatNum(v.sdnum )
    v.sdwb = formatData(v.sdwb )
    v.sdmoney = formatData(v.sdmoney )
    v.synum = formatNum(v.synum )
    v.sywb = formatData(v.sywb )
    v.symoney = formatData(v.symoney )
  })
  //样式靠右列
  let rightrow=[]
  //样式靠左列
  let leftrow=[]
  if(pageParameter.queryMark === 'J'){
    rightrow=['D','E','G']

  }else if(pageParameter.queryMark === 'SJ'){
    rightrow=['F','H','K']
  }else if(pageParameter.queryMark === 'WJ'){
    rightrow=['F','H','K','E','J']
  }else{
    rightrow=['G','F','H','K','O','J','N']
  }

  const sheet =[
    {
      title: titleName.value,
      tHeader: title,
      multiHeader: multiHeader,
      table: data,
      keys: keys,
      merges: merges,
      sheetName: pageParameter.km +'-'+ titleName.value,
      cellStyle: cellStyle,
      rightrow:rightrow,
      leftrow:leftrow,
    },
  ]
  let name = pageParameter.companyName
  exportExcel(sheet, 'xlsx',name+'-总账-'+pageParameter.strDate+'-'+pageParameter.endDate)
}

const openPrint = () => {
  openPrintPage(true, {
    data: {
      dynamicTenantId: database.value,
      defaultAdName: useCompanyOperateStoreWidthOut().getSchemaName,
      year: pageParameter.strDate.substring(0,4),
    }
  })
}
import { Loading } from '/@/components/Loading';

const loadingRef = ref(false);
const compState = reactive({
  absolute: false,
  loading: false,
  tip: '加载中...',
});
function openCompFullLoading() {
  openLoading(false);
}
function openLoading(absolute: boolean) {
  compState.absolute = absolute;
  compState.loading = true;
}
const loadPrint = (obj) => {
  openCompFullLoading()
  const data = JSON.parse(JSON.stringify(getDataSource()))
  let printList: any = []
  let printUser = ''
  if(obj.printUser){
    printUser = '制表人：' + userName
  }
  let printBz = ''
  if(obj.printBz){
    printBz = '币种：'+ bzName.value
  }
  let printKm = '科目: '+pageParameter.km + '-' + titleName.value
  let title = titleName.value +'总账'
  //根据当前样式调整

  ///金额  数量金额 外币金额  外币数量
  if(pageParameter.queryMark === 'J'){
    //格式化数据
    data.forEach((item,index) => {
      let item1 = {}
      item1[0] = item.num
      item1[1] = item.name
      item1[2] = formatData(item.sjmoney)
      item1[3] = formatData(item.sdmoney)
      item1[4] = item.fx
      item1[5] = formatData(item.symoney)
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
      printList.push(item1)
    }
    let num = Math.ceil(printList.length/27)
    useNewPrint({data: ['l', 'px', 'a4', true]}, (doc) => {
      loadMark.value = false
      doc.autoTable({
        head: [['', '', title, '', '', '',],
          [printKm, '', '期间:' + pageParameter.strDate+' - '+pageParameter.endDate, '', printBz, '单位：元'],
          ['区间', '摘要', '借方', '贷方', '方向', '余额']],
        body: printList,
        // startY: 60,
        styles: tableStyle(),
        margin: {
          left: 50,
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
          doc.autoTableText(
            '核算单位：' + accNameAll.value,
            tabMarginLeft,
            data.cursor.y + 3,
            0
          );
          doc.autoTableText(
            printUser,
            data.cursor.x/2-25,
            data.cursor.y + 3,
            0
          );
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
          //data.cell.styles.fontStyle = 'bold'

          if (data.section == 'head' && data.row.index == 0) {

            data.cell.styles.fontSize = 20
            data.cell.styles.fontStyle = 'bold'
            data.cell.styles.lineColor = [255, 255, 255]
            if (data.column.index == 2) {
              data.cell.colSpan = 2
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
              data.cell.colSpan = 2
              data.cell.styles.halign = 'center'
            } else if (data.column.index == 3) {
              data.cell.colSpan = 1
              data.cell.styles.halign = 'right'
            } else if (data.column.index == 4) {
              data.cell.colSpan = 1
              data.cell.styles.halign = 'right'
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
              data.cell.styles.fillColor = [240,240,240]
            }

          }
        },
        columnStyles: {
          0: {maxHeight: 10,cellWidth: 70, halign: 'center'},
          1: {cellWidth: 90, halign: 'center'},
          2: {cellWidth: 100, halign: 'right'},
          3: {cellWidth: 100, halign: 'right'},
          4: {cellWidth: 70, halign: 'center'},
          5: {cellWidth: 100, halign: 'right'},
        }
      })
      compState.loading = false
    })
  }else if(pageParameter.queryMark === 'SJ'){
    //格式化数据
    data.forEach((item,index) => {
      let item1 = {}
      item1[0] = item.num
      item1[1] = item.name
      item1[2] = item.dw
      item1[3] = item.sjnum
      item1[4] = formatData(item.sjmoney)
      item1[5] = item.sdnum
      item1[6] = formatData(item.sdmoney)
      item1[7] = item.fx
      item1[8] = item.synum
      item1[9] = formatData(item.symoney)
      printList.push(item1)
    })

    let num = Math.ceil(printList.length/27)
    useNewPrint({data: ['l', 'px', 'a4', true]}, (doc) => {
      loadMark.value = false
      doc.autoTable({
        head: [['', '', title, '', '', '',],
          [printKm, '', '期间:' + pageParameter.strDate+'~'+pageParameter.endDate, '', printBz, '单位：元'],
          ['区间', '摘要', '计量单位', '数量', '金额', '数量','金额', '方向', '数量', '金额']],
        body: printList,
        // startY: 60,
        styles: tableStyle(),
        margin: {
          left: 50,
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
          doc.autoTableText(
            '核算单位：' + accNameAll.value,
            tabMarginLeft,
            data.cursor.y + 3,
            0
          );
          doc.autoTableText(
            printUser,
            data.cursor.x/2-25,
            data.cursor.y + 3,
            0
          );
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
            if (data.column.index == 2) {
              data.cell.colSpan = 2
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
              data.cell.colSpan = 2
              data.cell.styles.halign = 'center'
            } else if (data.column.index == 3) {
              data.cell.colSpan = 1
              data.cell.styles.halign = 'right'
            } else if (data.column.index == 4) {
              data.cell.colSpan = 1
              data.cell.styles.halign = 'right'
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
              data.cell.styles.fillColor = [240,240,240]
            }

          }
        },
        columnStyles: {
          0: {maxHeight: 10,cellWidth: 60, halign: 'center'},
          1: {cellWidth: 70, halign: 'center'},
          2: {cellWidth: 60, halign: 'center'},
          3: {cellWidth: 80, halign: 'right'},
          4: {cellWidth: 80, halign: 'right'},
          5: {cellWidth: 80, halign: 'right'},
          6: {cellWidth: 80, halign: 'right'},
          7: {cellWidth: 60, halign: 'center'},
          8: {cellWidth: 80, halign: 'right'},
          9: {cellWidth: 80, halign: 'right'},

        }
      })
    })
  }else if(pageParameter.queryMark === 'WJ'){
    //格式化数据
    data.forEach((item,index) => {
      let item1 = {}
      item1[0] = item.num
      item1[1] = item.name
      item1[2] = item.wb
      item1[3] = item.sjwb
      item1[4] = formatData(item.sjmoney)
      item1[5] = item.sdwb
      item1[6] = formatData(item.sdmoney)
      item1[7] = item.fx
      item1[8] = item.sywb
      item1[9] = formatData(item.symoney)
      printList.push(item1)
    })

    let num = Math.ceil(printList.length/27)
    useNewPrint({data: ['l', 'px', 'a4', true]}, (doc) => {
      loadMark.value = false
      doc.autoTable({
        head: [['', '', title, '', '', '',],
          [printKm, '', '期间:' + pageParameter.strDate+'~'+pageParameter.endDate, '', printBz, '单位：元'],
          ['区间', '摘要', '借方', '贷方', '方向', '余额']],
        body: printList,
        // startY: 60,
        styles: tableStyle(),
        margin: {
          left: 50,
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
          doc.autoTableText(
            '核算单位：' + accNameAll.value,
            tabMarginLeft,
            data.cursor.y + 3,
            0
          );
          doc.autoTableText(
            printUser,
            data.cursor.x/2-25,
            data.cursor.y + 3,
            0
          );
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
            if (data.column.index == 2) {
              data.cell.colSpan = 2
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
              data.cell.colSpan = 2
              data.cell.styles.halign = 'center'
            } else if (data.column.index == 3) {
              data.cell.colSpan = 1
              data.cell.styles.halign = 'right'
            } else if (data.column.index == 4) {
              data.cell.colSpan = 1
              data.cell.styles.halign = 'right'
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
              data.cell.styles.fillColor = [240,240,240]
            }

          }
        },
        columnStyles: {
          0: {maxHeight: 10,cellWidth: 70, halign: 'center'},
          1: {cellWidth: 90, halign: 'center'},
          2: {cellWidth: 100, halign: 'right'},
          3: {cellWidth: 100, halign: 'right'},
          4: {cellWidth: 70, halign: 'center'},
          5: {cellWidth: 100, halign: 'right'},
        }
      })
    })
  }else if(pageParameter.queryMark === 'SWJ'){
    //格式化数据
    data.forEach((item,index) => {
      let item1 = {}
      item1[0] = item.num
      item1[1] = item.name
      item1[2] = item.dw
      item1[3] = item.wb
      item1[4] = item.sjnum
      item1[5] = item.sjwb
      item1[6] = formatData(item.sjmoney)
      item1[7] = item.sdnum
      item1[8] = item.sdwb
      item1[9] = formatData(item.sdmoney)
      item1[10] = item.fx
      item1[11] = item.synum
      item1[12] = item.sywb
      item1[13] = formatData(item.symoney)
      printList.push(item1)
    })
    let num = Math.ceil(printList.length/27)
    useNewPrint({data: ['l', 'px', 'a4', true]}, (doc) => {
      loadMark.value = false
      doc.autoTable({
        head: [['', '', title, '', '', '',],
          [printKm, '', '期间:' + pageParameter.strDate+'~'+pageParameter.endDate, '', printBz, '单位：元'],
          ['区间', '摘要', '借方', '贷方', '方向', '余额']],
        body: printList,
        // startY: 60,
        styles: tableStyle(),
        margin: {
          left: 50,
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
          doc.autoTableText(
            '核算单位：' + accNameAll.value,
            tabMarginLeft,
            data.cursor.y + 3,
            0
          );
          doc.autoTableText(
            printUser,
            data.cursor.x/2-25,
            data.cursor.y + 3,
            0
          );
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
            if (data.column.index == 2) {
              data.cell.colSpan = 2
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
              data.cell.colSpan = 2
              data.cell.styles.halign = 'center'
            } else if (data.column.index == 3) {
              data.cell.colSpan = 1
              data.cell.styles.halign = 'right'
            } else if (data.column.index == 4) {
              data.cell.colSpan = 1
              data.cell.styles.halign = 'right'
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
              data.cell.styles.fillColor = [240,240,240]
            }

          }
        },
        columnStyles: {
          0: {maxHeight: 10,cellWidth: 70, halign: 'center'},
          1: {cellWidth: 90, halign: 'center'},
          2: {cellWidth: 100, halign: 'right'},
          3: {cellWidth: 100, halign: 'right'},
          4: {cellWidth: 70, halign: 'center'},
          5: {cellWidth: 100, halign: 'right'},
        }
      })
    })
  }

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
//减
function sub(a, b) {
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
  return e = Math.pow(10, Math.max(c, d)), (a * e - b * e) / e;
}
// +++++++++++++++++++++ 复写公司代码 +++++++++++++++++++++++++
const dynamicAdReload = async (obj) =>{
  if(pageParameter.strDate!==''){

  }
  loadMark.value = false
}
const startRender = ref(false);
const ljchecked = ref<boolean>(false)
provide('ljchecked',ljchecked)
const exportData=ref({
  map:{}
})
const showCurrentName = (v) => {
  let arr = accAuthList.value.filter(item => item.accId == v)
  if (arr.length > 0) {
    return arr[0].accNameCn
  }
  return ''
}
</script>

<style scoped>
:deep(.table-month-striped) {
  background-color: honeydew;
}
:deep(.table-year-striped)  {
  background-color: lightyellow;
}
:deep(.table-odd-striped)  {
  background-color: #fafafa;
}
.group-btn-span-special2{
  width: 130px;
}
:deep(.ant-checkbox){
  border: 1px solid #2f2a2a;
  border-radius: 4px;
}
</style>
<style  lang="less" scoped>
@import '/@/assets/styles/pingzheng-menu-index.less';
</style>

