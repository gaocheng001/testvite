<template>
  <div class="app-container">
    <div class="app-container-top lcr-theme-div" style="background-color: rgb(41 150 199)">
      <div>
        <div>
          <CopyOutlined style="color: white;font-size: 50px;"/>
        </div>
        <div>  <AccountPicker theme="three" :readonly="status>1" :dataFun="accountPickerFuns" @reloadTable="dynamicAdReload"/></div>
      </div>
      <div></div>
      <div>
        <div>
            <Button class="actod-btn" @click="router.push('/stock-assem-assemble-list')">查询</Button>
            <!-- 审核后的 -->
            <span v-if="formItems.bcheck=='1'">
              <Button :disabled="ymPeriod" class="actod-btn" @click="startEdit('add')">新增</Button>
              <Button :disabled="ymPeriod" class="actod-btn actod-btn-last" @click="formItems.bcheck=='1'?startReview(false):startReview(true)">{{ formItems.bcheck=='1'?'弃审':'审核' }}</Button>
            </span>
            <!-- 未审核 -->
            <span v-else>
              <span v-if="status < 3">
              <Button class="actod-btn" @click="saveData">保存</Button>
              <Button class="actod-btn" @click="giveUp">放弃</Button>
              <Button class="actod-btn" @click="bomShow">展开</Button>
                <Button class="actod-btn" @click="tableAdd" v-if="status == 1 || status == 2">插行</Button>
              <Button class="actod-btn" @click="tableDel">删行</Button>
            </span>
              <span v-else>
                <Button :disabled="ymPeriod" class="actod-btn" @click="startEdit('add')">新增</Button>
                <Button :disabled="ymPeriod" class="actod-btn" @click="startEdit('edit')">修改</Button>
                <Button :disabled="ymPeriod" class="actod-btn" @click="startDel">删除</Button>
                <Popover placement="bottom">
                <template #content>
                  <Button style="width: 120px;margin-bottom: 2px" @click="setCKD_data">生成其他出库单</Button><br/>
                  <Button style="width: 120px;margin-bottom: 2px" @click="setCGRKD_data">生成其他入库单</Button><br/>
                </template>
                <Button :disabled="ymPeriod" class="actod-btn">
                  生单
                </Button>
              </Popover>
                <Button :disabled="ymPeriod" class="actod-btn actod-btn-last" @click="formItems.bcheck=='1'?startReview(false):startReview(true)">{{ formItems.bcheck=='1'?'弃审':'审核' }}</Button>
              </span>
            </span>
          <Popover placement="bottom">
            <template #content>
<!--              <Button style="width: 120px;margin-bottom: 2px" @click="xySourcePop">来源单据</Button><br>-->
              <Button style="width: 120px;margin-bottom: 2px" @click="xySourcePop">下游单据</Button>
            </template>
            <Button v-if="status ==3"  class="actod-btn">联查</Button>
          </Popover>
          <Button class="actod-btn actod-btn-last" @click="closeCurrent(),giveUp(),router.push('/zhongZhang/home/welcome')">退出</Button>
        </div>
        <div>
          <div class="acttd-right-d-search">
            <ReceiptSearch v-if="status==3" :default-data="searchData" :dynamic-tenant-id="dynamicTenantId" @toggle="toReceipt"/>
          </div>
          <div class="acttd-right-d-btns" v-if="status==3">
            <Button class="acttdrd-btn" @click="pageReload()">
              <SyncOutlined :style="{ fontSize: '14px' }"/>
            </Button>
            <Popover placement="bottom">
              <template #content>
                <Button style="width: 120px;margin-bottom: 2px" @click="openPrint2">打印单据</Button>
                <br/>
                <Button style="width: 120px;margin-bottom: 2px" @click="toPrintPage">模版设置</Button>
              </template>
              <Button class="acttdrd-btn">
                <PrinterOutlined :style="{ fontSize: '14px' }"/>
              </Button>
            </Popover>
            <Popover placement="bottom" v-model:visible="visible3">
              <template #content>
                <Button style="width: 120px;margin-bottom: 2px" @click="openSetting">表头栏目设置</Button>
                <br/>
                <DynamicColumn :defaultData="initDynamics()['DATA']" :dynamicData="dynamicColumnData" :lanmuInfo="lanMuData" @reload="reloadColumns"/>
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
          </div>
          <div class="acttd-right-d-btns" v-else>
            <Button v-if="status<3" class="acttdrd-btn" @click="pageReload()">
              <BarcodeOutlined :style="{ fontSize: '20px',display:'inline-flex' }"/>
            </Button>
          </div>
        </div>
      </div>
    </div>
    <div class="app-container-bottom" :style="{height: (windowHeight+80)+'px'}">
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
            <VerticalRightOutlined @click="contentSwitch('first','')"/>&nbsp;
            <LeftOutlined @click="contentSwitch('prev','')"/>&nbsp;
            <RightOutlined @click="contentSwitch('next','')"/>&nbsp;
            <VerticalLeftOutlined @click="contentSwitch('tail','')"/>
            <span v-if="status=='3'">
              &nbsp;
              <Tag v-if="formItems.bcheck=='1'" :color="'volcano' ">
                已审核
              </Tag>
              <Tag v-if="parseFloat(formItems.rukuSum)==0" :color="'volcano' ">
                未入库
              </Tag>
              <Tag v-if="parseFloat(formItems.rukuSum)>0&&parseFloat(formItems.rukuSum)!==parseFloat(formItems.baseQuantity)" :color="'volcano' ">
                入库中
              </Tag>
              <Tag v-if="parseFloat(formItems.rukuSum)>0&&parseFloat(formItems.rukuSum)==parseFloat(formItems.baseQuantity)" :color="'volcano' ">
                已入库
              </Tag>
            </span>
          </div>
          <span style="font-size: 22px;font-weight: bold;margin-right: 300px;" :style="{color: titleValue==0?'#0096c7':'#c0392b'}">{{ titleContents[titleValue] }}</span>
        </div>
        <div class="acbgead-two" :style="status == 3?{ pointerEvents: 'none'}:{}">
          <DynamicForm :datasource="dynamicFormModel" :formDataFun="formFuns" :accId="dynamicTenantId" :trCheckFlag="trCheckFlag" @open="openHeadSelectContent" :dynamicTenant="dynamicTenant" @feiyongJeCheck="feiyongJeCheck" @bomCheck="bomShow" @cnumberCheck="cnumberCheck"/>
        </div>
      </div>
      <div class="acb-centent">
        <BasicTable
          ref="tableRef"
          :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
          :clickToRowSelect="false"
          :loading="loadMark"
          :row-selection="{ type: 'checkbox',selectedRowKeys: tableSelectedRowKeys, onChange: onSelectChange }"
          :scroll="{ x: totalColumnWidth,y: windowHeight-(100 + (formRowNum*39))}"
          size="small"
          @register="registerTable"
        >
          <template #fcStyle="{ record }" >
            <div>
              {{ fcStyleList.filter(it => it.value == record.fcStyle)[0]?.title}}
            </div>
          </template>
          <template #bcheck1="{ record }">
            <template v-if="record.editThree&&trCheckFlag">
              <Select
                v-model:value="record.tempThree"
                show-search
                class="bcheck1"
                style="width: 82%;"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                :options="cardListOptions"
                @search="value=>handleSearch(value,'three')"
                @keyup.enter="tempType='three';focusNext(record,'bcheck1')"
              ></Select>
              <SearchOutlined @click="tempType = 'three';openSelectContent(record,'cinvode')"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempThree=record.bcheck1,record.editThree = true;">
                <span class="a-table-font-arial">{{ record?.bcheck1 }}</span>
              </div>
            </template>
          </template>
          <template #cinvode="{ record }">
            <template v-if="record.editTwo&&trCheckFlag">
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
                @change="value=>handleChange(value,'one')"
                @search="value=>handleSearch(value,'one')"
                @keyup.enter="tempType='one';focusNext(record,'cinvode')"
              ></Select>
              <SearchOutlined @click="tempType = 'one';openSelectContent(record,'cinvode')"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempTwo=record.cinvode,record.editTwo = true;">
                <span class="a-table-font-arial">{{ record?.cinvode }}</span>
              </div>
            </template>
          </template>
          <template #cinvodeName="{ record }">
            <template v-if="record.editEleven&&trCheckFlag">
              <Select
                v-model:value="record.tempEleven"
                show-search
                style="width: 82%;"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                :options="cardListOptions"
                @change="value=>handleChange(value,'two')"
                @search="value=>handleSearch(value,'two')"
                @keyup.enter="tempType='two';focusNext(record,'cinvode')"
              ></Select>
              <SearchOutlined @click="tempType = 'two';openSelectContent(record,'cinvode')"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempEleven=record.cinvodeName,record.editEleven = true;">
                <span class="a-table-font-arial">{{ record?.cinvodeName }}</span>
              </div>
            </template>
          </template>
          <template #cgUnitId="{ record }" >
            <template v-if="record.editCgUnitId&&trCheckFlag">
              <Select
                v-model:value="record.tempCgUnitId"
                :default-active-first-option="false"
                :filter-option="false"
                :not-found-content="null"
                style="width: 82%;"
                class="cgUnitId"
                @keyup.enter="focusNext(record,'cgUnitId')"
                @change="cgUnitIdChange(record);"
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
            <template v-if="record?.editCnumber&&trCheckFlag">
              <InputNumber v-model:value="record.tempCnumber"
                           class="cnumber"
                           :min="1"
                           :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           style="width: 82%;"
                           @keyup.enter="focusNext(record,'cnumber');"/>
              <CheckOutlined
                @click="record.editCnumber = null;record.cnumber=record.tempCnumber;tableDataChange(record,'cnumber');"/>
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
          <template #cunitid="{ record }">
            <div>
              <span>{{cunitFormat(record.unitList,record.cunitid)}}</span>
            </div>
          </template>
          <template #baseQuantity="{ record }">
            <span class="a-table-font-arial">{{
                (record.baseQuantity == null || record.baseQuantity == 0 ? '' : parseFloat(record.baseQuantity).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }}
             </span>
          </template>
          <template #cmemo="{ record }">
            <template v-if="record?.editThirteen&&trCheckFlag">
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
          <template #price="{ record }">
            <template v-if="record?.editNine&&trCheckFlag">
              <InputNumber v-model:value="record.tempNine"
                           class="price"
                           :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           style="width: 82%;"
                           @keyup.enter="focusNext(record,'price');"/>
              <CheckOutlined @click="record.editNine = null;record.price=record.tempNine;tableDataChange(record,'price');"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempNine=record.price,record.editNine = true;">
                    <span class="a-table-font-arial">{{
                        (record.price == null ? '' : parseFloat(record.price).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }}</span>
              </div>
            </template>
          </template>
          <template #icost="{ record }">
            <template v-if="record?.editTen&&trCheckFlag">
              <InputNumber v-model:value="record.tempTen"
                           class="icost"
                           :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           style="width: 82%;"
                           @keyup.enter="focusNext(record,'icost');"/>
              <CheckOutlined @click="record.editTen = null;record.icost=record.tempTen;tableDataChange(record,'icost');"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempTen=record.icost,record.editTen = true;">
                    <span class="a-table-font-arial">{{
                        (record.icost == null ? '' : parseFloat(record.icost).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }}</span>
              </div>
            </template>
          </template>
          <template #fyftIsum="{ record }">
            <template v-if="record?.editFyftIsum&&record.fcStyle=='Z'&&trCheckFlag">
              <InputNumber v-model:value="record.tempFyftIsum"
                           class="fyftIsum"
                           :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           style="width: 82%;"
                           @keyup.enter="focusNext(record,'fyftIsum');"/>
              <CheckOutlined @click="record.editFyftIsum = null;record.fyftIsum=record.tempFyftIsum;tableDataChange(record,'fyftIsum');"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempFyftIsum=record.fyftIsum,record.editFyftIsum = true;">
                    <span class="a-table-font-arial">{{
                        (record.fyftIsum == null ? '' : parseFloat(record.fyftIsum).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }}</span>
              </div>
            </template>
          </template>
          <template #icostTotal="{ record }">
            <span class="a-table-font-arial">{{
                (record.icostTotal == null || record.icostTotal == 0 ? '' : parseFloat(record.icostTotal).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }}
             </span>
          </template>
          <template #citem="{ record }">
            <template v-if="record.editCitem&&trCheckFlag">
              <Select
                v-model:value="record.tempCitem"
                show-search
                class="citem"
                style="width: 82%;"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                :options="proList"
                @change="value=>handleChange(value,'one')"
                @search="value=>handleSearch(value,'one')"
                @keyup.enter="focusNext(record,'citem')"
              ></Select>
              <SearchOutlined @click="openSelectContent(record,'citem')"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempCitem=record.citem,record.editCitem = true;">
                <span class="a-table-font-arial">{{ record?.citem }}</span>
              </div>
            </template>
          </template>
          <template #summary>
            <TableSummary fixed>
              <TableSummaryRow style="background-color: #cccccc;font-weight: bold;">
                <TableSummaryCell class="nc-summary" :index="0" :align="'center'">合</TableSummaryCell>
                <TableSummaryCell class="nc-summary" :index="1" :align="'center'">计</TableSummaryCell>
                <TableSummaryCell class="nc-summary" v-for="cell in getCurrSummary()"  :index="cell.ind" :align="cell.align"><span class="a-table-font-arial">{{null == summary[cell.dataIndex]?'':summary[cell.dataIndex]}}</span></TableSummaryCell>
              </TableSummaryRow>
            </TableSummary>
          </template>
        </BasicTable>
      </div>
    </div>
    <Import @save="introduceData" @register="registerImportPage" />
    <Query @query="loadPage" @register="registerQueryPage" />
    <DeptModalPop @register="registerSelectDeptPage" @save="modalData"/>
    <StockCangKuModalPop @register="registerStockCangKuModalPage" @throwData="modalData"/>
    <SelectPsn @register="registerSelectPsnPage" @save="modalData"/>
    <Print @save="loadPrint" @register="registerPrintPage"/>
    <StockInfiModalPop @register="registerStockInfoModalPage" @throwData="modalData"/>
    <XySource @register="registerXySourcePage"/>

  </div>
</template>

<script setup="props, {emit}" lang="ts">
import {
  Button,
  DatePicker,
  Input,
  InputNumber,
  message,
  Popover,
  Radio,
  Select,
  Table,
  Tabs,
  Tag,
} from "ant-design-vue";
import Query from "./popup/query.vue";
import Import from "./popup/import.vue";
import XySource from './popup/xySource.vue';
import Print from '/@/views/boozsoft/stock/stock-caigou-rk/popup/print.vue';
import DynamicForm from './component/DynamicForm.vue';
import DynamicColumn from "/@/views/boozsoft/stock/stock_sales_add/component/DynamicColumn.vue";
import {
  BarcodeOutlined,
  CheckOutlined,
  CopyOutlined,
  LeftOutlined,
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
import {getCurrentInstance, nextTick, reactive, ref,provide} from "vue";
import {useMessage} from "/@/hooks/web/useMessage";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {JsonTool, NumberTool, ObjTool} from "/@/api/task-api/tools/universal-tools";
import {BasicTable, useTable} from '/@/components/Table'
import {useModal} from '/@/components/Modal'
import {findFaAssetInfoByCode} from "/@/api/fa/fa-assets-minus";

import {useUserStoreWidthOut} from "/@/store/modules/user";
import {onBeforeRouteLeave, useRoute} from "vue-router";
import {assemblyDynamicColumn, initDynamics} from "./data";
import {hasBlank, trim} from "/@/api/task-api/tast-bus-api";
import {usePlatformsStore} from "/@/store/modules/platforms";
import {GenerateDynamicColumn} from "/@/views/boozsoft/stock/stock-assem-assemble/component/DynamicForm";
import StockCangKuModalPop
  from "/@/views/boozsoft/stock/stock_cangku/popup/stockCangKuModalPop.vue";
import StockInfiModalPop from "/@/views/boozsoft/stock/stock_info/popup/stockInfoModalPop.vue";
import {
  findAll as findAllJiLang,
  findUnitAssociationList,
  findUnitInfoList
} from "/@/api/record/system/unit-mea";
import {findCunHuoAllList} from "/@/api/record/stock/stock-caigou";
import {
  findBillCode,
  findByStockPeriodIsClose,
  findByWarSearch,
  findStockPeriodYmFlag,
  reviewSetCGRKG,
  reviewSetCGRKGMx,
  xyCsourceSave,
} from "/@/api/record/stock/stock-ruku";
import {
  delStockBorrowByccode,
  findByStockBorrow,
  findByStockBorrowTableUnitRate,
  getStockBorrowNewCode,
  saveStockBorrowMxPojoList,
  saveStockBorrowPojo,
  stockBorrowSave
} from "/@/api/record/stock/stock-borrow";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import dayjs from "dayjs";
import {findCangkuJoinName} from "/@/api/record/stock/stock-cangku-level-record";
import {
  getByStockBalanceTask,
  stockBalanceTaskEditNewTime,
  stockBalanceTaskSave,
  stockTaskDelById,
  updateStockCurrentRevision
} from "/@/api/record/stock/stock_balance";
import {findByStockNum2, singleUnitOfMea} from "/@/api/record/stock/stock";
import {useNewPrint} from "/@/utils/boozsoft/print/print";
import {saveLog} from "/@/api/record/system/group-sys-login-log";
import {dataModelBuildingTwoData} from "/@/views/boozsoft/stock/stock_other_add/popup/ts/printData";
import {
  getPrintStencilParameter
} from "/@/views/boozsoft/stock/stock_sales_add/popup/ts/printTemplate";
import ReceiptSearch from "/@/views/boozsoft/stock/stock_sales_add/component/ReceiptSearch.vue";
import {getUnitRate} from "/@/api/record/system/stock-wareh";
import {
  verifyDataState,
  delStockAd,
  findAllStockAd,
  getNewStockAdNum, getStockAdsUnitRate, getXyQTRKD_And_QTCKD,
  saveStockAd,
  saveStockAds
} from "/@/api/record/stock/stock-ad";
import {findByBomUniqueId, findEntryList} from "/@/api/record/stock/stock-bom";
import {addResizeListener} from "/@/utils/event";

const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const InputSearch = Input.Search
const SelectOption = Select.Option
const TabPane = Tabs.TabPane
const TableSummary = Table.Summary
const TableSummaryRow = Table.Summary.Row
const TableSummaryCell = Table.Summary.Cell
const {createErrorModal, createConfirm, createWarningModal} = useMessage()
const {closeCurrent} = useTabs(router);
const [registerQueryPage, {openModal: openQueryPageM}] = useModal()
const [registerImportPage, {openModal: openImportPageM}] = useModal()
const [registerPrintPage, {openModal: openPrintPage}] = useModal()

const route = useRoute();
const windowHeight = (window.innerHeight - 310)
const dynamicTenant:any = ref('')
const dynamicTenantId = ref('')
const stockAccountObj:any = ref('')
const dynamicAccId = ref('')
const dynamicYear = ref('')
const titleContents = ['组装拆卸单']
const titleValue = ref(0)
const formRowNum = ref(1)
const tempType =  ref('')
const pageParameter:any = reactive({
  showRulesSize: 'MIN',
  searchConditon: {
    requirement: '',
    value: '',
  }
})
const changeBtns = ref({
  first: true,
  prev: true,
  next: true,
  tail: true,
})
const fcStyleList = ref([{value:'F',title:'父件'},{value:'Z',title:'子件'}])
const trCheckFlag = ref(false)
const formItems: any = ref({})
const jiList:any = ref([])
const duoJlMxList:any = ref([])
const manyJiList:any = ref([])
const ckListOptions:any = ref([])
const userList = ref([])
const proList = ref([])
const custList = ref([])
const supList = ref([])
const deptList = ref([])
const operatorList = ref([])
const cardListOptions:any = ref([])
const assetsCardList:any = ref([])
const routeData:any = route.query;
const ymPeriod:any = ref(false)
const summary = ref({})
// 任务
const taskInfo:any = ref('')

// 不可选日期
const disabledDate = (current) => {
  return current && current < dayjs().subtract(1, 'day').endOf('day');
};

//金额格式化
function toThousandFilter(num:any) {
  if (num=='' || num==null){
    return ''
  }
  return (+num || 0).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
}

const visible3:any = ref(false)
// 1发票或0到货 立账
const apSourceFlag:any = ref('')
const dynamicAdReload = async (obj) => {
  console.log('当前时间：'+new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "))
  dynamicTenant.value = obj
  apSourceFlag.value = obj.target.apSourceFlag
  dynamicTenantId.value = obj.accountMode
  dynamicAccId.value = obj.accId
  dynamicYear.value = obj.stockYear
  searchData.value.year = obj.stockYear
  lanMuData.value.accId=obj.accountMode
  visible3.value = true
  await columnReload()
  await reloadList()
  lanMuData.value.changeNumber+=1
}

const dynamicFormModel:any = ref([])
const formFuns:any = ref({
  getFormValue: () => {
  }, setFormValue: () => {
  }, getSelectMap: () => {
  }
})
const columnReload = async () => {
  dynamicFormModel.value = await GenerateDynamicColumn(dynamicTenantId.value) || []
  formRowNum.value = Math.ceil((dynamicFormModel.value.filter(it=>it.isShow).length/4))-1
}
const accountPickerFuns = ref({
  resetCoCode: (v) => {}
})
const pageReload = async () => {
  if(routeData.ccode!==undefined){
    if (!hasBlank(routeData.co) && dynamicTenant.value?.coCode !=routeData.co){
      accountPickerFuns.value.resetCoCode(routeData.co)
      return false
    }
  }
  // 列表跳转过来
  if(routeData.ccode!==undefined){
    await contentSwitch('tail',routeData.ccode)
  }else{
    await contentSwitch(formItems.value.id == null?'tail':'curr','')
  }
}

async function reloadList() {
  jiList.value = await useRouteApi(findAllJiLang, {schemaName: dynamicTenantId})({unitName: ''})
  manyJiList.value = await useRouteApi(findUnitInfoList, {schemaName: dynamicTenantId})({})
  duoJlMxList.value = await useRouteApi(findUnitAssociationList, {schemaName: dynamicTenantId})({})
  assetsCardList.value = (await useRouteApi(findCunHuoAllList, {schemaName: dynamicTenantId})({date: useCompanyOperateStoreWidthOut().getLoginDate}))
  nextTick(()=>{
    ckListOptions.value = formFuns.value.getSelectMap()['warehouse']
    operatorList.value = formFuns.value.getSelectMap()['operator']
    supList.value = formFuns.value.getSelectMap()['supplier']
    userList.value = formFuns.value.getSelectMap()['user']
    custList.value = formFuns.value.getSelectMap()['cust']
    proList.value = formFuns.value.getSelectMap()['project']
    deptList.value = formFuns.value.getSelectMap()['dept']
  })
}
const cmakerTime=ref('')
async function contentSwitch(action,ccode) {
  loadMark.value = true
  let res = await useRouteApi(findAllStockAd, {schemaName: dynamicTenantId})({
    iyear: dynamicYear.value || '2022',
    action: action,
    ccode: ccode,
    curr: formFuns.value.getFormValue()?.ccode || ''
  })
  if (null != res) {
    countStockPeriodYmFlag(res.iyear,'1')
    formItems.value = JsonTool.parseProxy(res)
    cmakerTime.value=formItems.value.cmakerTime
    if(hasBlank(cmakerTime.value)){
      cmakerTime.value=new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," ")
    }

    res.entryList = null
    // 格式化 费用金额
    res.feiyongJe = !hasBlank(res.feiyongJe)?parseFloat(res.feiyongJe).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','):''

    formFuns.value.setFormValue(res)
    if (!hasBlank(formItems.value.entryList)) {
      let list = JsonTool.parseObj(formItems.value.entryList).map(it => resetRow(it))
      // 查找级别档案名称
      for (let i = 0; i < list.length; i++) {
        list[i].unitList=[]
        let stock=await useRouteApi(findByStockNum2, {schemaName: dynamicTenantId})(list[i].cinvode)
        // 查询计量明细
        let res:any =  manyJiList.value.filter(it=>it.id == stock?.stockMeasurementUnit)[0]
        if (res != null){
          let list2 = JsonTool.parseObj(res.detail) || []
          list2=list2.filter(jl=>!hasBlank(jl.unitName))
          list[i].unitList.push({conversionRate:list2[0]?.conversionRate,title:list2[0]?.unitName,value:list2[0]?.id,ggxh:stock?.stockGgxh,txm:stock?.stockBarcode})
          if(list2.length==2){
            list[i].unitList.push({conversionRate:list2[1]?.conversionRate,title:list2[1]?.unitName,value:list2[1]?.id,ggxh:stock?.stockUnitGgxh1,txm:stock?.stockUnitBarcode1})
          }
          if(list2.length==3){
            list[i].unitList.push({conversionRate:list2[1]?.conversionRate,title:list2[1]?.unitName,value:list2[1]?.id,ggxh:stock?.stockUnitGgxh1,txm:stock?.stockUnitBarcode1})
            list[i].unitList.push({conversionRate:list2[2]?.conversionRate,title:list2[2]?.unitName,value:list2[2]?.id,ggxh:stock?.stockUnitGgxh2,txm:stock?.stockUnitBarcode2})
          }
          let data=list[i].unitList.filter(a=>a.value==list[i].cgUnitId)[0]
          list[i].bcheck1=data?.txm
          list[i].cinvodeType=data?.ggxh
        }
        else{
          list[i].unitList=jiList.value.filter(a=>a.id==list[i].cgUnitId).map(it=>{it.conversionRate=it.conversionRate;it.title=it.unitName;it.value=it.id;it.ggxh=stock?.stockGgxh;it.txm=stock?.stockBarcode;return it;})
        }
      }
      let len = list.length
      for (let i = 0; i < (50 - len); i++) {
        list.push({})
      }
      setTableData(list)
      calculateTotal()
    }
    formItems.value.entryList = null
  } else {
    let list:any=[]
    for (let i = 0; i < 50; i++) {
      list.push({})
    }
    setTableData(list)
    formFuns.value.setFormValue({})
    formItems.value={}
    message.success('暂无数据！')
  }
  loadMark.value = false
  visible3.value = false
}

const getCurrSummary  = () => {
  return (getColumns().filter(it=>it.title != '序号' && it.ifShow).map((it,ind)=>{it['ind']=ind+2;return it;}))
}
const calculateTotal = () => {
  let list = JsonTool.parseProxy(getDataSource().filter(it=>!hasBlank(it.cinvode)))
  if (list.length == 0){
    summary.value = {}
    return false;
  }
  let cnumber = 0
  let baseQuantity = 0
  let icost = 0
  let fyftIsum = 0
  let icostTotal = 0
  let deshMoney = 0
  let sjshMoney = 0
  for (let i = 0; i < list.length; i++) {
    const e = list[i];
    icost+=parseFloat(e['icost'] || 0)
    fyftIsum+=parseFloat(e['fyftIsum'] || 0)
    icostTotal+=parseFloat(e['icostTotal'] || 0)
    deshMoney+=parseFloat(e['deshMoney'] || 0)
    sjshMoney+=parseFloat(e['sjshMoney'] || 0)
    cnumber+=parseFloat(e['cnumber'] || 0)
    baseQuantity+=parseFloat(e['baseQuantity'] || 0)
  }
  summary.value={
    icost: icost==0?null:toThousandFilter(icost),
    sjshMoney: sjshMoney==0?null:toThousandFilter(sjshMoney),
    deshMoney: deshMoney==0?null:toThousandFilter(deshMoney),
    icostTotal: icostTotal==0?null:toThousandFilter(icostTotal),
    fyftIsum: fyftIsum==0?null:toThousandFilter(fyftIsum),
    cnumber: cnumber==0?null:parseFloat(cnumber).toFixed(2),
    baseQuantity: baseQuantity==0?null:parseFloat(baseQuantity).toFixed(2),
  }
}
// 0 暂存 1 新建 2编辑 3查看
const status = ref(3)

const CrudApi = {
  columns: [
    {
      title: '类型',
      dataIndex: 'fcStyle',
      ellipsis: true,width: 120,slots: {customRender: 'fcStyle'},
    },{
      title: '项目',
      dataIndex: 'citem',
      ellipsis: true,width: 120,slots: {customRender: 'citem'},
    },
    {
      title: '条形码',
      dataIndex: 'bcheck1',
      ellipsis: true,
      width: 120,slots: {customRender: 'bcheck1'},
    },
    {
      title: '存货编码',
      dataIndex: 'cinvode',
      ellipsis: true,
      slots: {customRender: 'cinvode'},
      width: 120
    },
    {
      title: '存货名称',
      dataIndex: 'cinvodeName',
      ellipsis: true,
      slots: {customRender: 'cinvodeName'},
      width: 200
    },
    {
      title: '规格型号',
      dataIndex: 'cinvodeType',
      ellipsis: true,
      slots: {customRender: 'cinvodeType'},
      width: 120
    },{
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
    },{
      title: '单价',
      dataIndex: 'price',
      slots: {customRender: 'price'},
      ellipsis: true,
    },{
      title: '材料金额',
      dataIndex: 'icost',
      slots: {customRender: 'icost'},
      ellipsis: true,
    },{
      title: '费用金额',
      dataIndex: 'fyftIsum',
      slots: {customRender: 'fyftIsum'},
      ellipsis: true,
    },{
      title: '金额',
      dataIndex: 'icostTotal',
      slots: {customRender: 'icostTotal'},
      ellipsis: true,
    },{
      title: '出入库单号',
      dataIndex: 'rukuCode',
      slots: {customRender: 'rukuCode'},
      ellipsis: true,
    },{
      title: '定额损耗',
      dataIndex: 'deshMoney',
      slots: {customRender: 'deshMoney'},
      ellipsis: true,
    },{
      title: '实际损耗',
      dataIndex: 'sjshMoney',
      slots: {customRender: 'sjshMoney'},
      ellipsis: true,
    },
    {
      title: '备注',
      dataIndex: 'cmemo',
      ellipsis: true,
      width: 120,
      slots: {customRender: 'cmemo'},
    }
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
  indexColumnProps:{ fixed:true },
  pagination: false
})

const tableSelectedRowKeys = ref([])
const tableSelectedRowObjs = ref([])
const onSelectChange = (k, o) => {
  tableSelectedRowKeys.value = k
  tableSelectedRowObjs.value = o
}

async function findBySearch(val) {
  loadMark.value = true
  let bySearchData=await useRouteApi(findByWarSearch, {schemaName: dynamicTenantId})({billStyle: 'QTRKD',ccode:val})
  if(!hasBlank(bySearchData)){
    await contentSwitch('tail',bySearchData.ccode)
  }
  else{
    message.error('没有对应的单据！')
    loadMark.value = false
  }
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
const rowDelData:any=ref([])
const tableDel = async () => {
  if (tableSelectedRowKeys.value.length == 1) {
    let list:any = getDataSource()
    let selectIndex = list.findIndex(it => it.key === tableSelectedRowKeys.value[0])

    // 修改状态下删除行
    if(status.value==2){
      rowDelData.value.push(list.filter(it => it.key === tableSelectedRowKeys.value[0]))
    }

    list.splice(selectIndex, 1)
    setTableData(list)
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
   // 结账操作
  let jzMethod= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'月末结账',method:'月末结账'})
  if(!hasBlank(jzMethod)){
    return message.error('提示：操作员'+jzMethod.caozuoName+'正在对当前账套进行月末结账处理，不能进行单据新增操作，请销后再试！')
  }
  let date = useCompanyOperateStoreWidthOut().getLoginDate
  // 日期是否已结账
  let temp=await useRouteApi(findByStockPeriodIsClose, {schemaName: dynamicTenantId})({iyear:date.split('-')[0],month:date.split('-')[1]})
  if(temp>0){
    setTimeout(()=>{
      message.error('单据日期已结账！')
    },1000)
  }

  let maxR = 50
  if (type === 'add') {
    status.value = 1
    let date = useCompanyOperateStoreWidthOut().getLoginDate
    // 获取最新
    let code = await generateCode()
    formItems.value = {
      ddate: date,
      adStyle: 'ZZ',
      bomLevel: '1',
      cnumber: '1',
      ccode: code,
      rate: dynamicTenant.value.target.cgRate,
      invoiceStyle: '1',
    }
    formFuns.value.setFormValue({
      ddate: date,
      adStyle: 'ZZ',
      bomLevel: '1',
      cnumber: '1',
      ccode: code,
      rate: dynamicTenant.value.target.cgRate,
      invoiceStyle: '1',
    })
    let list:any = []
    for (let i = 0; i < maxR; i++) {
      list.push({})
    }
    tempTaskSave('新增')
    setTableData(list)
  }
  else {
    if(formItems.value.ccode==undefined){return }
    // 执行操作前判断单据是否存在
    let ccodeBcheck=formItems.value.ccode+'>>>'+(hasBlank(formItems.value.bcheck)?'0':formItems.value.bcheck)
    let msg=await useRouteApi(verifyDataState, { schemaName: dynamicTenantId })({operation:'audit',list:[ccodeBcheck]})
    if(hasBlank(msg)){
      return message.error("单据已发生变化,请刷新当前单据！")
    }
    // 任务
    let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'组装拆卸单',method:'修改'})
    if(taskData==''){
      tempTaskSave('修改')
    }else{
      for (let i = 0; i < taskData.length; i++) {
        // 任务不是当前操作员的
        if(taskData[i]?.caozuoUnique!==useUserStoreWidthOut().getUserInfo.id){
          return createWarningModal({ content: taskData[i]?.username+'正在'+taskData[i]?.method+'组装拆卸单,不能同时进行操作！' });
        }
        await useRouteApi(stockBalanceTaskEditNewTime, { schemaName: dynamicTenantId })(taskData[i]?.id)
      }
    }
    status.value = 2
    let list = getDataSource()
    let dLen = list.length
    for (let i = 0; i < (maxR - dLen); i++) {
      list.push({})
    }
    setTableData(list)
  }

}
async function tempTaskDel(id) {
  await useRouteApi(stockTaskDelById, { schemaName: dynamicTenantId })(id)
}
async function tempTaskSave(method) {
  console.log(useUserStoreWidthOut().getUserInfo)
  await useRouteApi(stockBalanceTaskSave, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,userName:useUserStoreWidthOut().getUserInfo.id,functionModule:'组装拆卸单',method:method,recordNum:formItems.value.ccode,caozuoModule:'stock'})
    .then((a)=>{
      taskInfo.value=a
      console.log('任务='+JSON.stringify(a))
    })
}
async function generateCode() {
  let jsNewNum=await useRouteApi(getNewStockAdNum, {schemaName: dynamicTenantId})({})
  jsNewNum='AD-'+new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,7).replace("T"," ").replace("-","")+'-'+jsNewNum
  return jsNewNum
}

const startDel = async () => {
  if (null == formItems.value || hasBlank(formItems.value.id)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '暂无任何单据！'
    })
  } else {
    // 执行操作前判断单据是否存在
    let ccodeBcheck=formItems.value.ccode+'>>>'+(hasBlank(formItems.value.bcheck)?'0':formItems.value.bcheck)
    let msg=await useRouteApi(verifyDataState, { schemaName: dynamicTenantId })({operation:'del',list:[ccodeBcheck]})
    if(hasBlank(msg)){
      return message.error("单据已发生变化,请刷新当前单据！")
    }

   // 结账操作
    let jzMethod= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'月末结账',method:'月末结账'})
    if(!hasBlank(jzMethod)){
      return message.error('提示：操作员'+jzMethod.caozuoName+'正在对当前账套进行月末结账处理，不能进行单据新增操作，请销后再试！')
    }
    // 任务
    let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'组装拆卸单',method:'修改,审核,删除',recordNum:formItems.value.ccode})
    if(!hasBlank(taskData)){
      for (let i = 0; i < taskData.length; i++) {
        // 任务不是当前操作员的
        if(taskData[i]?.caozuoUnique!==useUserStoreWidthOut().getUserInfo.id){
          return createWarningModal({ content: taskData[i]?.username+'正在'+taskData[i]?.method+'组装拆卸单,不能同时进行操作！' });
        }
        await useRouteApi(stockBalanceTaskEditNewTime, { schemaName: dynamicTenantId })(taskData[i]?.id)
      }
    }

    tempTaskSave('删除')
    createConfirm({
      iconType: 'warning',
      title: '组装拆卸单删除',
      content: '您确定要进行组装拆卸单删除吗!',
      onOk: async () => {
        await useRouteApi(delStockAd, {schemaName: dynamicTenantId})({id: formItems.value.id})
        tempTaskDel(taskInfo.value?.id)
        saveLogData('删除')
        message.success('删除成功！')
        await contentSwitch('tail','')
      },onCancel: () => {
        tempTaskDel(taskInfo.value?.id)
        return false
      }
    });
  }
}

const startReview = async (b) => {
  // 执行操作前判断单据是否存在
  let ccodeBcheck=formItems.value.ccode+'>>>'+(hasBlank(formItems.value.bcheck)?'0':formItems.value.bcheck)
  let msg=await useRouteApi(verifyDataState, { schemaName: dynamicTenantId })({operation:'audit',list:[ccodeBcheck]})
  if(hasBlank(msg)){
    return message.error("单据已发生变化,请刷新当前单据！")
  }
  // 结账操作
  let jzMethod= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'月末结账',method:'月末结账'})
  if(!hasBlank(jzMethod)){
    return message.error('提示：操作员'+jzMethod.caozuoName+'正在对当前账套进行月末结账处理，不能进行单据新增操作，请销后再试！')
  }
  // 任务
  let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'组装拆卸单',method:'修改,审核,删除',recordNum:formItems.value.ccode})
  if(!hasBlank(taskData)){
    for (let i = 0; i < taskData.length; i++) {
      // 任务不是当前操作员的
      if(taskData[i]?.caozuoUnique!==useUserStoreWidthOut().getUserInfo.id){
        return createWarningModal({ content: taskData[i]?.username+'正在'+taskData[i]?.method+'组装拆卸单,不能同时进行操作！' });
      }
      await useRouteApi(stockBalanceTaskEditNewTime, { schemaName: dynamicTenantId })(taskData[i]?.id)
    }
  }


  let xydata=await useRouteApi(getXyQTRKD_And_QTCKD, { schemaName: dynamicTenantId })({ccode:formItems.value.ccode})
  if(hasBlank(xydata) || parseFloat(xydata.qtckd)==0){
    return message.error('提示：没有生成其他出库单,不能审核!')
  }else if(parseFloat(xydata.qtrkd)==0){
    return message.error('提示：没有生成其他入库单,不能审核!')
  }


}
const sum = (...arr) => [].concat(...arr).reduce((acc, val) => Number(acc) + Number(val), 0);
// 随机数
function randomString(length) {
  var str = '0123456789abcdefghijklmnopqrstuvwxyz';
  var result = '';
  for (var i = length; i > 0; --i)
    result += str[Math.floor(Math.random() * str.length)];
  return result;
}

const loadMark = ref(false)

//保存验证
function saveCheck(list) {
  let form = formFuns.value.getFormValue();
  if (list.length == 0) {
    createWarningModal({
      title: '温馨提示',
      content: '列表完整内容至少存在一条!存货编码为必选项,单价为必填项,请补充完整!'
    })
    return false
  }else{
    let fyftIsum= sumArr(list.filter(it =>it.fcStyle=='Z').map(tx=>tx.fyftIsum))
    if(!hasBlank(form.feiyongJe)&&parseFloat(form.feiyongJe)!==parseFloat(fyftIsum)){
      let text=form.fcStyle=='ZZ'?'子件费用金额合计与父件费用金额不相等':'父件费用金额与子件费用金额合计不相等'
      createWarningModal({
        title: '温馨提示',
        content: text
      })
      return false
    }
  }
  return true
}

//数据保存
async function saveData() {
  let id = formItems.value.id
  formItems.value = formFuns.value.getFormValue()
  formItems.value.id = id // 制单人
  if(status.value==1){
    formItems.value.ccode =  await generateCode()
  }
  formItems.value.iyear = dynamicYear.value
  formItems.value.cmaker = useUserStoreWidthOut().getUserInfo.id // 制单人
  formItems.value.adStyle =formFuns.value.getFormValue()?.adStyle
  formItems.value.cmakerTime=!hasBlank(cmakerTime.value)?cmakerTime.value:new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," ")
  // 去除格式化
  formItems.value.feiyongJe = !hasBlank(formItems.value.feiyongJe)?formItems.value.feiyongJe.replace(/\$\s?|(,*)/g, ''):''

  // 新的明细
  let list = getDataSource().filter(it => !hasBlank(it.cinvode) && !hasBlank(it.price) )
  if (saveCheck(list)) {
    list = list.map(it => ObjTool.dels(it, Object.keys(it).map(i => i.startsWith('edit') || i.startsWith('temp')))) //清理辅助字段
    for (let i = 0; i < list.length; i++) {
      let o=list[i]
      o['id']=status.value==1?null:o['id']
      o['adStyle']=formFuns.value.getFormValue()?.adStyle
      o['iyear'] = dynamicYear.value
      o['lineCode'] = o['key']
      o['lineId'] = (i + 1) + ''
      o['ccode']=formItems.value.ccode
      o['ddate']=formFuns.value.getFormValue()?.ddate
    }
    if (formItems.value?.id == null){
      formItems.value.ccode = await generateCode()
    }

    await useRouteApi(saveStockAd, {schemaName: dynamicTenantId})(formItems.value)
    await useRouteApi(saveStockAds, {schemaName: dynamicTenantId})(list)

    tempTaskDel(taskInfo.value?.id)
    /************** 记录操作日志 ****************/
    saveLogData(status.value==1?'新增':'修改')
    /************** 记录操作日志 ****************/
    message.success('保存成功！')
    await contentSwitch('tail','')
    status.value = 3
    trCheckFlag.value = false
  }
}
async function editStockCurrentRevison(map) {
  if(!hasBlank(map.id)){
    await useRouteApi(updateStockCurrentRevision,{schemaName: dynamicTenantId})(map)
  }
}
async function giveUp() {
  // 删除指定栏目
  setColumns(getColumns().filter(a=>{return a.dataIndex!='showNumber'} ))

  if (status.value == 1) {
    await contentSwitch('first','')
  } else if (status.value == 2) {
    await contentSwitch('curr','')
  }
  if(!hasBlank(taskInfo.value)){
    tempTaskDel(taskInfo.value?.id)
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
    setTableData(tables)
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

const rowDataGrab = async (rowObj, type: string) => {
  let arr:any = assetsCardList.value.filter(it => (type == 'one' ? (it.sysId == rowObj.sysId) : type == 'two' ? (it.assetsCode == rowObj.assetsCode) : (it.assetsName == rowObj.assetsName)))
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
    let filterList = getDataSource()
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
    let res = assetsCardList.value.filter(it=>it[type == 'one'?'stockNum':type == 'two'?'stockName':'stockBarcode']?.indexOf(value) !=-1)
    let data:any = []
    res = res.filter(it => filterList.indexOf(it.stockNum) == -1)
    res.forEach((r: any) => {
      data.push({
        value: r[type == 'one' ? 'stockNum' :type == 'two'? 'stockName':'stockBarcode'],
        label: type !== 'three'?(r['stockNum'] + ' ' + r['stockName']):(r['stockBarcode']),
      });
    });
    callback(data);
  }
  timeout = setTimeout(fake, 300);
}

const mark = usePlatformsStore().getCurrentPlatformId
const visible = ref(false);
const windowWidth = (window.innerWidth - (70))
const totalColumnWidth = ref(0)
const dynamicColumnData = ref({value:[]})
const editableData = reactive({});
const tableRef:any = ref(null)
const lanMuData = ref({
  accId: dynamicTenantId.value,
  menuName: '组装拆卸单',
  type: '列表',
  objects: '',
  username: useUserStoreWidthOut().getUserInfo.username,
  changeNumber:0
})
const reloadColumns = () => {
  let newA = JSON.parse(JSON.stringify(CrudApi.columns))
  newA = assemblyDynamicColumn(dynamicColumnData.value.value, newA)
  setColumns(newA)
  initTableWidth(newA)
  pageReload()
}
function initTableWidth(thisCs) {
  let total = 60+60
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
const thisEditObj:any = ref(null)
const thisEditType:any = ref('')
const [registerSelectDeptPage, {openModal: openSelectDeptPage}] = useModal()
const [registerStockCangKuModalPage, {openModal: openStockCangKuModalPage}] = useModal();
const [registerSelectPsnPage, {openModal: openSelectPsnPage}] = useModal()
const [registerXySourcePage, {openModal: openXySourcePage}] = useModal()
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
    case 'cinvode':
      openStockInfoModalPage(true, {
        dynamicTenantId: dynamicTenantId.value
      })
      break;
  }
}
const modalData = (o) => {
  if (thisEditObj.value) {
    if (thisEditType.value == 'cinvode') {
      thisEditObj.value['cinvodeInfo'] = o[0]
      thisEditObj.value['tempTwo'] = o[0].stockNum
      thisEditObj.value['tempEleven'] = o[0].stockName
      thisEditObj.value['bcheck1'] = o[0].stockBarcode
    } else {
      thisEditObj.value['tempOne'] = o[0].id
      thisEditObj.value['tempCangkuId'] = o[0].cangkuId
      thisEditObj.value['cwhcodeInfo'] = o[0]
      thisEditObj.value['cwhcodeText'] = o[0].cangkuName
      thisEditObj.value['cangkuDuli'] = o[0].cangkuFlag
    }
    focusNext(thisEditObj.value,thisEditType.value)
  } else {
    let e:any = formFuns.value.getFormValue()
    e[thisEditType.value] = thisEditType.value == 'cvencode' || thisEditType.value == 'cwhcode' ? o[0].id : thisEditType.value == 'cdepcode' ? o.uniqueCode : o.id
    if(thisEditType.value == 'cvencode'){
      let cvencodeJslist=dynamicFormModel.value.filter(a=>a.field=='cvencodeJs')[0].list.filter(a=>a.uniqueCode==o[0]?.uniqueCodeCcus)
      e['cvencodeJs']=hasBlank(o[0]?.uniqueCodeCcus)?e['cvencode']:cvencodeJslist[0]?.id
    }
    formFuns.value.setFormValue(e)
  }
}
const assemblyName = (arr) => {
  let text = ''
  for (let i = 0; i < arr.length; i++) {

  }
  text = ckListOptions.value.filter(it=>it.id == arr[0])[0]?.ckName
  return text
}
const resetRow = (record) => {
  record['key'] = record.lineCode
  let o = assetsCardList.value.filter(it => it.stockNum == record.cinvode )[0]
  record.cinvodeName = o?.stockName || ''
  record.cinvodeType = o?.stockGgxh // 规格型号
  record.bcheck1 = o?.stockBarcode // 条形码
  record.isGive = record.isGive == '1'
  // 计量类型
  record.cunitType = o?.stockMeasurementType ==  '单计量'?'1':'0'
  if (record.cunitType == '0'){ //
    let res:any =  manyJiList.value.filter(it=>it.id == o?.stockMeasurementUnit)[0]
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
    let res:any = jiList.value.filter(it => it.id == o?.stockMeasurementUnit)[0]
    if (null !=  res && res.length >0){
      record.unitInfo = res[0]
      record.unitList = res.map(it=>{it.value=it.id;it.title=it.unitName;it.ggxh=o?.stockGgxh;it.txm =o?.stockBarcode;return it;})
    }
  }
  record.isBatch = o?.stockPropertyBatch == '1'
  return record;
}
// 时间格式化
function formatTimer(value) {
  let date:any = new Date(value);
  let y = date.getFullYear();
  let MM = date.getMonth() + 1;
  MM = MM < 10 ? "0" + MM : MM;
  let d = date.getDate();
  d = d < 10 ? "0" + d : d;
  let h = date.getHours();
  h = h < 10 ? "0" + h : h;
  let m = date.getMinutes();
  m = m < 10 ? "0" + m : m;
  let s = date.getSeconds();
  s = s < 10 ? "0" + s : s;
  return y + "-" + MM + "-" + d;
}
const dateFormat = 'YYYY-MM-DD';

const tableDataChange =  async (r,c) => {
  calculateTotal()
  switch (c) {
    case 'cnumber':
      r.tempFifteen=useCompanyOperateStoreWidthOut().getLoginDate
      r.yjdate=r.tempFifteen
      if (titleValue.value != 0 && parseFloat(r.cnumber) > 0) r.cnumber = 0 - (Math.abs(r.cnumber))
      let o:any = assetsCardList.value.filter(it => tempType.value=='one'?(it.stockNum == r.cinvode) :tempType.value=='three'? (it.stockBarcode == r.bcheck1) : (it.stockName == r.cinvodeName))[0]
      r.cinvodeInfo = o
      if(r.cinvodeInfo.stockMeasurementType=='单计量'){
        r.baseQuantity=r.cnumber
        tableDataChange(r,'price')
      }
      else{
        slChange0(r)
      }
      break;
    case 'cinvode':
      if (r.cinvodeName == null) r.cinvodeName = r.tempEleven
      if (r.bcheck1 == null ) r.bcheck1 = r.tempThree
      chChange(r)
      break;
    case 'price':
      if (!hasBlank(r.cnumber) && !hasBlank(r.price)) {
        let n:any = parseFloat(r.cnumber).toFixed(10)
        if (titleValue.value != 0 && n > 0) n = 0 - (Math.abs(n))
        if (titleValue.value == 0 && n < 0) n = 0 - Math.abs(n)
        let d:any = parseFloat(r.price).toFixed(10)
        if (titleValue.value != 0 && d > 0) d = 0 - (Math.abs(d))
        if (titleValue.value == 0 && d < 0) d = Math.abs(d)

        r.icost = titleValue.value == 0?parseFloat(String(n * d)).toFixed(4) + '':parseFloat(String(n * d)).toFixed(4)*-1
        r.tempTen = r.icost
        r.price = Math.abs(d)

        let fyftIsum=hasBlank(r.fyftIsum)?'0':r.fyftIsum
        r.icostTotal=parseFloat(r.icost)+parseFloat(fyftIsum)
      }
      break;
    case 'icost':
      if (!hasBlank(r.cnumber) && !hasBlank(r.tempTen)) { //反算 单价
        let n:any = parseFloat(r.cnumber).toFixed(10)
        if (titleValue.value != 0 && n > 0) n = 0 - (Math.abs(n))
        if (titleValue.value == 0 && n < 0) n = Math.abs(n)
        let d:any = parseFloat(r.tempTen).toFixed(4)
        if (titleValue.value != 0 && d > 0) d = 0 - (Math.abs(d))
        if (titleValue.value == 0 && d < 0) d = Math.abs(d)
        r.icost = d
        r.tempTen =r.icost

        let price:any= parseFloat(String(d / parseFloat(n))).toFixed(10)
        r.price =Math.abs(price)
        r.tempNine=r.price

        let fyftIsum=hasBlank(r.fyftIsum)?'0':r.fyftIsum
        r.icostTotal=parseFloat(r.icost)+parseFloat(fyftIsum)
      }
      break;
    case 'fyftIsum':
      let icost=hasBlank(r.icost)?'0':r.icost
      let fyftIsum=hasBlank(r.tempFyftIsum)?'0':r.fyftIsum
      r.fyftIsum=fyftIsum
      r.tempFyftIsum=r.fyftIsum
      r.icostTotal=parseFloat(icost)+parseFloat(fyftIsum)
      break;
  }
}
const findByUnitListFirst = async (record) => {
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
  }
  else{
    let djl= await useRouteApi(singleUnitOfMea, {schemaName: dynamicTenantId})('')
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
}
const findByUnitList = async (record) => {
  let o:any = assetsCardList.value.filter(it => tempType.value=='one'?(it.stockNum == record.cinvode) :tempType.value=='three'? (it.stockBarcode == record.bcheck1) : (it.stockName == record.cinvodeName))[0]
  record.unitList=[]
  record.fcStyle = 'Z'
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
  }
  else{
    let djl= await useRouteApi(singleUnitOfMea, {schemaName: dynamicTenantId})('')
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
      let isnum  = (r?.unitInfo?.unitType == '2')
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
    tableDataChange(r,'taxprice')
  }
}
const bomShowSlChange0 = (r) => {
  if ( r.cunitType == '0' && r.unitInfo != null){ // 存在多计量的清空
    // 运算辅助数量
    let list = JsonTool.parseObj(r.unitInfo.detail) || []
    list=list.filter(jl=>!hasBlank(jl.unitName))
    if (list.length > 0){
      let conversionRate=list.filter(a=>a.id==r.cgUnitId)[0]?.conversionRate
      r.baseQuantity=parseFloat(r.tempCnumber)*parseFloat(conversionRate)*parseFloat(formFuns.value.getFormValue()?.cnumber)
      r.tempSix=r.baseQuantity

      let n:any = parseFloat(r.baseQuantity).toFixed(10)
      let isnum  = (r?.unitInfo?.unitType == '2')
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
    tableDataChange(r,'taxprice')
  }
}
const chChange = async (record) => {
  let list=getDataSource().filter(tx=>!hasBlank(tx.cinvode)&&tx.cinvode==record.cinvode)
  if(list.length>1){
    record.cinvode=null
    return message.error('同一存货不允许重复出现')
  }
  findByUnitList(record)
  record.baseQuantity=null
  record.subQuantity1=null
}

const outBefore = () => {
  if (status.value != 3){
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
const {proxy} :any= getCurrentInstance()
/**
 * @param e 回车确定事件
 * @param r rowObj
 * @param c className
 * @param t mark
 */
const focusNext =  async (r, c) => {
  // 得到当前临时标记
  if(c=='bcheck1'){
    c=r.tempThree==undefined?'bcheck1':'cinvode'
  }
  let t = getNextMark(c,false)
  Object.keys(r).map(i=>{if (i.startsWith('edit')) r[i] = null})
  r[`${c}`] = r[`temp${t}`];
  // 列表值发生变动 监听调整
  tableDataChange(r,c)
    // 查找下一个
    let list = getDataSource();
    let filters:any = ['bcheck1','cinvodeType','cinvodeName','baseQuantity','cunitid']

    let cols:any = getColumns().filter(it=>it.title!='序号' &&  filters.indexOf(it.dataIndex) == -1 && it.ifShow)
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
        list[index][`${nextC}`] = list[index][`temp${nextMark}`];
        setTableData(list)
      }
    nextTick(() => {
      let doms:any = nextC == 'batchId' || nextC == 'cmemo' ? document.getElementsByClassName(nextC)[0] : document.getElementsByClassName(nextC)[0]?.getElementsByTagName('input')[0]
      if (null != doms) doms.focus()
    })
  }
}
const getNextMark = (c,b) => {
  let model = {cnumber:'Cnumber',cgUnitId:'CgUnitId',cinvode:'Two',price:'Nine',icost:'Ten',fyftIsum:'FyftIsum',cmemo:'Thirteen'}
  return model[c]
}


// 判断是否有结账月
async function countStockPeriodYmFlag(year,flags) {
  let temp=await findStockPeriodYmFlag(year,flags)
  ymPeriod.value=temp>0?true:false
}

// 查看下游数据
function xySourcePop() {
  openXySourcePage(true, {
    database: dynamicTenantId.value,
    ccode:formItems.value.ccode
  })
}

function sumArr(arr) {
  return arr.reduce(function(prev, curr, idx, arr){
    return prev + curr;
  });
}
function openPrint2() {
  if (hasBlank(formItems.value.id)){
    message.info('暂未发现可打印单据！')
    return false;
  }
  openPrintPage(true, {
    data: {
      dynamicTenantId: dynamicTenantId.value,
      defaultAdName: useCompanyOperateStoreWidthOut().getSchemaName,
      year: '',
      mark:  router.currentRoute?.value?.fullPath.replace('/',''),
      pageName:'其他入库单'
    }
  })
}
const loadPrint = (obj) => {
  const dataArr = JsonTool.parseProxy(getDataSource().filter(it=>it.cinvode!=null))
  loadMark.value = true
  let etc = JsonTool.parseProxy(formItems.value)
  if (dataArr.length == 0) {
    loadMark.value = false
    return false;
  }else { // 数据处理
    etc.unitValue =etc.unitType=='etc'?etc.unitValue:etc.unitType=='cust'?getCustName(etc.unitValue):etc.unitType=='suplier'?getSupName(etc.unitValue):etc.unitType=='user'?getUserName(etc.unitValue):etc.unitType=='project'?getProName(etc.unitValue):getDeptName(etc.unitValue)
    etc.unitType = getUnitType(etc.unitType)
    etc.cwhcode = ckListOptions.value.filter(it => it.id == etc.cwhcode)[0]?.ckName
    etc.cdepcode = hasBlank(etc.cdepcode)?'':(formFuns.value.getSelectMap()['dept']?.filter(it=>it.value == etc.cdepcode)[0]?.label || '')
    etc.cpersoncode = hasBlank(etc.cpersoncode)?'':getUserName(etc.cpersoncode)
    etc.cwhcodeUser = hasBlank(etc.cwhcodeUser)?'':getUserName(etc.cwhcodeUser)
    etc.bcheckUser = etc.bcheck == null?'': formatUniqueOperator(etc?.bcheckUser)
    etc.cmaker = formatUniqueOperator(etc?.cmaker)
    dataArr.forEach((item,index)=>{
      item['cwhcode'] = item.cangkuDuli == '0'? assemblyName(item.cwhcode.split("\\")):ckListOptions.value.filter(it => it.id == item.cwhcode)[0]?.ckName
      item['cgUnitId'] = cunitFormat(item.unitList,item.cgUnitId)
      item['cnumber'] =  parseFloat(item.cnumber).toFixed(2)
      item['cunitid'] = cunitFormat(item.unitList,item.cunitid)
      item['baseQuantity'] = parseFloat(item.baseQuantity).toFixed(2)
      item['price'] =  parseFloat(item.price).toFixed(2)
      item['icost'] = parseFloat(item.icost).toFixed(2)
      item['isGive'] = item['isGive']?'是':'否'
    })
  }
  let type = obj.template
  let maxRowLen = obj.rowNumber
  let dateModel = dataModelBuildingTwoData(dataArr,etc,maxRowLen,obj.list)
  let {fx, size, fun} = getPrintStencilParameter(type,obj.list)
  useNewPrint({data: [fx,  'mm', size,false]}, (doc) => {
    loadMark.value = false
    dateModel.forEach((printObj,index)=>{
      fun(doc, printObj, maxRowLen)
      if (index < (dateModel.length-1)) doc.addPage()
    })
  })
}

const getUnitType = (v) => {
  return v=='etc'?'其他':v=='cust'?'客户':v=='supplier'?'供应商':v=='user'?'员工':v=='project'?'项目':'';
}
const getProName = (v) => {
  return setString((proList.value.filter(it=>v==it.value)[0]?.label || ''),16)
}
const getSupName = (v) => {
  return setString((supList.value.filter(it=>v==it.value)[0]?.label || ''),16)
}
const getCustName = (v) => {
  return setString((custList.value.filter(it=>v==it.value)[0]?.label || ''),16)
}
const getUserName = (v) => {
  return (userList.value.filter(it => it.value == v)[0]?.label || '')
}
const getDeptName = (v) => {
  return (deptList.value.filter(it => it.value == v)[0]?.label || '')
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

async function cgUnitIdChange(record) {
  record.cinvodeType= record.unitList.filter(a=>a.value==record.tempCgUnitId)[0].ggxh
  record.bcheck1= record.unitList.filter(a=>a.value==record.tempCgUnitId)[0].txm
  record.cgUnitId=record.unitList.filter(a=>a.value==record.tempCgUnitId)[0].value
  let conversionRate=JsonTool.parseObj(record.unitInfo.detail).filter(tx=>tx.id==record.cgUnitId)[0].conversionRate
  record.baseQuantity=record.cnumber*conversionRate
}
/*变更专区*/
const cunitFormat = (list,id) => {
  if (null == list || hasBlank(id)) return id;
  let it = list.filter(it=>it.value == id)[0]
  return  null == it?id:it.title
}

async function saveLogData(optAction) {
  let logmap={
    loginTime:new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "),
    userId: useUserStoreWidthOut().getUserInfo.username,
    userName: useUserStoreWidthOut().getUserInfo.realName,
    optRange:'1',
    optModule:'stock',
    optFunction:'借用借入单',
    uniqueCode:formItems.value?.ccode,
    optAction:optAction,
    accId:dynamicAccId.value,
    optContent:'操作内容【借用借入单】,单据编号【'+formItems.value?.ccode+'】',
  }
  await saveLog(logmap)
}

const toPrintPage = () => {
  router.push({
    path:'/sz-print-template',
    query: {name: router.currentRoute?.value?.meta?.title,mark:  router.currentRoute?.value?.fullPath.replace('/','')},
  })
}

/********** 单据搜索 *********/
const showSearch=ref(false)
const searchData = ref({
  year: '',
  qValue: '',
  style: '0',
  model: 'JR',
})
const toReceipt = async (v) => {
  nextTick(async ()=>contentSwitch('tail',v))
}
/********** 单据搜索 *********/
async function getCKDNewCode(date) {
  return await useRouteApi(findBillCode, {schemaName: dynamicTenantId})({
    type: 'QTCKD',
    date: date,
    key: '3-11',
    prefix:'QT'
  })
}
// 生成其他出库单
async function setCKD_data() {
  let ddate=''
  if(parseFloat(useCompanyOperateStoreWidthOut().getLoginDate.replaceAll('-',''))<parseFloat(formItems.value.ddate.replaceAll('-',''))){
    ddate=formItems.value.ddate
  }else{
    ddate=useCompanyOperateStoreWidthOut().getLoginDate
  }

  let oldNum=formItems.value.ccode
  let oldddate=formItems.value.ddate
  let newRuKuNum=await getCKDNewCode(ddate)

  let res = await useRouteApi(findAllStockAd, {schemaName: dynamicTenantId})({
    iyear: dynamicYear.value || '2022',
    action: 'tail',
    ccode: formItems.value.ccode,
    bdocumStyle: '0',
    curr: ''
  })

  let list = JsonTool.parseObj(res.entryList).map(it => resetRow(it))
  let oldlist = JsonTool.parseObj(res.entryList).map(it => resetRow(it))

  let cmakerTime=new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," ")
  createConfirm({
    iconType: 'warning',
    title: '生成其他出库单',
    content: '您确定要生成其他出库单吗？',
    onOk: async () => {
      // 生成出库单明细
      let listarr:any=[]
      for (let i = 0; i < list.length; i++) {
        let temp=list[i]
        let parentLineCode=temp.lineCode
        // 寻找就数据
        let oldData=oldlist.filter(a=>a.key==temp.key)
        let unitRate= await useRouteApi(getStockAdsUnitRate, {schemaName: dynamicTenantId})({cgUnitId:temp.cgUnitId,ccode:temp.ccode})
        temp.cnumber=parseFloat(oldData[0]?.baseQuantity)/parseFloat(unitRate)
        let baseQuantity:any=parseFloat(temp.cnumber)
        temp.tempCnumber=baseQuantity
        temp.cnumber=baseQuantity

        // 计算主计量....
        slChange0(temp)

        temp.id=null
        temp.bdocumStyle='0'
        temp.billStyle='QTCKD'
        temp.ccode=newRuKuNum
        temp.lineCode=randomString(30)
        temp.bcheckTime=''
        temp.bcheckUser=''
        temp.isumRuku='0'
        temp.isumJiesuan='0'
        temp.sourcetype=formFuns.value.getFormValue()?.adStyle
        temp.sourcecode=oldNum
        temp.sourcedetailId=parentLineCode
        temp.sourcedate=oldddate
        temp.baccFlag=dynamicTenant.value.target.apSourceFlag
        temp.baccUser=dynamicTenant.value.target.apSourceFlag=='1'?useUserStoreWidthOut().getUserInfo?.id:''
        temp.baccDate=dynamicTenant.value.target.apSourceFlag=='1'?new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "):''
        temp.priceZangu=temp.price
        temp.icostZangu=temp.icost
        temp.cmakerTime=cmakerTime
        if(baseQuantity>0){
          listarr.push(temp)
        }
      }
      if(listarr.length==0){
        message.error('数量不足，无法生成其他入库单')
        return false;
      }

      res.id=null
      res.sourcetype=formFuns.value.getFormValue()?.adStyle
      res.sourcecode=oldNum
      formItems.value.cmakerTime=cmakerTime
      res.entryList = JsonTool.json(listarr)
      res.oldlist = JsonTool.json(oldlist)
      // 跳转其他出库单页签
      message.success(`跳转其他出库单页签！`)
      router.push({path:'kc-out-qtDepot',query:{type:'add',ccode:JSON.stringify(res)}})
    }
  })
}
// 生成其他入库单
async function setCGRKD_data() {
  // let xydata=await useRouteApi(getXyQTRKD_And_QTCKD, { schemaName: dynamicTenantId })({ccode:formItems.value.ccode})
  // if(hasBlank(xydata) || parseFloat(xydata.qtckd)==0){
  //   return message.error('提示：请先生成其他出库单!')
  // }

  let ddate=''
  if(parseFloat(useCompanyOperateStoreWidthOut().getLoginDate.replaceAll('-',''))<parseFloat(formItems.value.ddate.replaceAll('-',''))){
    ddate=formItems.value.ddate
  }else{
    ddate=useCompanyOperateStoreWidthOut().getLoginDate
  }

  let oldNum=formItems.value.ccode
  let oldddate=formItems.value.ddate
  let newRuKuNum=await useRouteApi(findBillCode, {schemaName: dynamicTenantId})({type: "QTRKD",date:  ddate,prefix: "",key: '3-13'})

  let res = await useRouteApi(findAllStockAd, {schemaName: dynamicTenantId})({
    iyear: dynamicYear.value || '2022',
    action: 'tail',
    ccode: formItems.value.ccode,
    bdocumStyle: '0',
    curr: ''
  })

  let list = JsonTool.parseObj(res.entryList).map(it => resetRow(it))
  let oldlist = JsonTool.parseObj(res.entryList).map(it => resetRow(it))

  let cmakerTime=new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," ")
  createConfirm({
    iconType: 'warning',
    title: '生成其他入库单',
    content: '您确定要生成其他入库单吗？',
    onOk: async () => {
      // 生成入库单明细
      let listarr:any=[]
      for (let i = 0; i < list.length; i++) {
        let temp=list[i]
        let parentLineCode=temp.lineCode
        // 寻找就数据
        let oldData=oldlist.filter(a=>a.key==temp.key)
        let unitRate= await useRouteApi(getStockAdsUnitRate, {schemaName: dynamicTenantId})({cgUnitId:temp.cgUnitId,ccode:temp.ccode})
        temp.cnumber=parseFloat(oldData[0]?.baseQuantity)/parseFloat(unitRate)
        let baseQuantity:any=parseFloat(temp.cnumber)
        temp.tempCnumber=baseQuantity
        temp.cnumber=baseQuantity

        // 计算主计量....
        slChange0(temp)

        temp.id=null
        temp.bdocumStyle='0'
        temp.billStyle='QTRKD'
        temp.ccode=newRuKuNum
        temp.lineCode=randomString(30)
        temp.price='0'
        temp.icost='0'
        temp.bcheckTime=''
        temp.bcheckUser=''
        temp.isumRuku='0'
        temp.isumJiesuan='0'
        temp.sourcetype='ZZCXD'
        temp.sourcecode=oldNum
        temp.sourcedetailId=parentLineCode
        temp.sourcedate=oldddate
        temp.baccFlag=dynamicTenant.value.target.apSourceFlag
        temp.baccUser=dynamicTenant.value.target.apSourceFlag=='1'?useUserStoreWidthOut().getUserInfo?.id:''
        temp.baccDate=dynamicTenant.value.target.apSourceFlag=='1'?new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "):''
        temp.priceZangu=temp.price
        temp.icostZangu=temp.icost
        temp.cmakerTime=cmakerTime
        if(baseQuantity>0){
          listarr.push(temp)
        }
      }
      if(listarr.length==0){
        message.error('数量不足，无法生成其他入库单')
        return false;
      }

      res.id=null
      res.sourcetype='ZZCXD'
      res.sourcecode=oldNum
      res.unitType='etc'
      res.unitValue='组装拆卸单生成'
      res.sourceDataType='ZZCXD'
      formItems.value.cmakerTime=cmakerTime
      res.entryList = JsonTool.json(listarr)
      res.oldlist = JsonTool.json(oldlist)
      // 跳转入库单页面
      message.success(`跳转其他入库单页签！`)
      router.push({path:'kc-qtDepot',query:{type:'add',ccode:JSON.stringify(res)}})
    }
  })
}
provide('simpJlList',jiList)
provide('manyJlList',manyJiList)
// 监听路由离开
onBeforeRouteLeave(giveUp)


//*********************************************
const bomShow = async () => {
  if(hasBlank(formFuns.value.getFormValue()?.bomCode)){
    return message.error('请选择BOM存货名称!')
  }
  trCheckFlag.value=true
  loadMark.value=true
  tempType.value='one'
  let bomData=await useRouteApi(findByBomUniqueId, {schemaName: dynamicTenantId})({uniqueId:formFuns.value.getFormValue()?.bomCode})
  let bomListData=await useRouteApi(findEntryList, {schemaName: dynamicTenantId})({uniqueId:formFuns.value.getFormValue()?.bomCode})

  let tableList:any=[]
  let temp1:any={
    fcStyle:'F',
    cinvode:bomData.bomId,
    tempCinvode:bomData.bomId,
    cgUnitId:bomData.unitId,
    cnumber:parseFloat(bomData.quantity).toFixed(2),
    tempCnumber:parseFloat(bomData.quantity).toFixed(2),
    baseQuantity:parseFloat(bomData.baseQuantity).toFixed(10),
    fyftIsum:formFuns.value.getFormValue()?.feiyongJe,
  }

  findByUnitListFirst(temp1)
  bomShowSlChange0(temp1)

  let conversionRate=JsonTool.parseObj(temp1.unitInfo.detail).filter(tx=>tx.id==temp1.cgUnitId)[0].conversionRate
  temp1.cnumber=temp1.baseQuantity/conversionRate
  tableList.push(temp1)

  for (let i = 0; i < bomListData.length; i++) {
    let bom=bomListData[i]
    let temp:any={}
    temp.fcStyle='Z'
    temp.cinvode=bom.cinvode
    temp.tempCinvode=bom.cinvode
    temp.cgUnitId=bom.unitIdZhu
    temp.cnumber=parseFloat(bom.isum).toFixed(2)
    temp.tempCnumber=parseFloat(bom.isum).toFixed(2)
    temp.baseQuantity=parseFloat(bom.isumZhu).toFixed(2)
    findByUnitListFirst(temp)
    bomShowSlChange0(temp)

    let conversionRate=JsonTool.parseObj(temp.unitInfo.detail).filter(tx=>tx.id==temp.cgUnitId)[0].conversionRate
    temp.cnumber=temp.baseQuantity/conversionRate
    tableList.push(temp)
  }

  for (let i = tableList.length; i < 50; i++) {
    tableList.push({})
  }
  setTimeout(()=>{
    setTableData(tableList)
    loadMark.value=false
  },300)
}

const feiyongJeCheck = (data) => {
  getDataSource().filter(a=>!hasBlank(a.cinvode))[0].fyftIsum=data
}
const cnumberCheck = async (data) => {
  if(getDataSource().filter(tx=>!hasBlank(tx.cinvode)).length==0){return}
  for (let i = 0; i < getDataSource().filter(tx=>!hasBlank(tx.cinvode)).length; i++) {
    let temp=getDataSource().filter(tx=>!hasBlank(tx.cinvode))[i]
    await bomShowSlChange0(temp)

    let conversionRate=JsonTool.parseObj(temp.unitInfo.detail).filter(tx=>tx.id==temp.cgUnitId)[0].conversionRate
    temp.cnumber=temp.baseQuantity/conversionRate
  }
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
        margin: 0 5rem;
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
:deep(.ant-input-number) {
  border: none !important;
  border-bottom: 1px solid #bdb9b9 !important;
  background: none;
}
.lcr-theme-div{
  display: inline-flex;justify-content: space-between;width: 100%;height: 100px;
  >div:nth-of-type(1){
    width: 40%;
    position: relative;
    display: block;
    >div:nth-of-type(1){width: 64px;display: inline-block;text-align: center;    top: 12px;
      position: inherit
    }
    >div:nth-of-type(2){

      width: calc( 100% - 64px);display: inline-block;
      :deep(.account-picker){
        .ap-title,.thisNameSpan{
          color: white !important;
        }
      }
    }
  }
  >div:nth-of-type(2){
    width: 20%;text-align:center;
    >div:nth-of-type(2){margin-top: 14px;}
  }
  >div:nth-of-type(3){
    width: 43%;text-align: right;
    display: block;
    >div:nth-of-type(1){
      .actod-btn {
        color: @Global-Comm-BcOrText-Color;
        font-size: 14px;
        margin: 0 1px 0 0;
      }

      .actod-btn-last {
        border-right: 1px solid @Global-Border-Color;
      }

      .actod-btn:hover {
        background-color: @Global-Comm-BcOrText-Color;
        color: white;
        font-weight: bold;
        border: 1px solid white;
      }
    }
    >div:nth-of-type(2){
      display: inline-flex;justify-content: space-between;margin-top: 15px;
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
          color: @Global-Comm-BcOrText-Color;
          margin-left: 2px;
        }
        .acttdrd-btn:hover{
          border-color: #ffffff;
          color: #ffffff;
          background-color: @Global-Comm-BcOrText-Color;
        }
      }
    }
  }
}
</style>
