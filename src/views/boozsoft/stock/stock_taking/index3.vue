<template>
  <div>
    <div class="app-container lcr-theme-div">
      <div>
        <div>
          <ProfileOutlined style="color: #0096c7;font-size:60px;"/>
        </div>
        <div style="margin-top:20px;">
          <div>
            <span class="ap-title">账套代码：</span>
            <span  class="ap-text">{{routemsg.coCode}}</span>
            <span class="ap-title">账套名称：</span>
            <span  class="ap-text">{{routemsg.companyName}}</span>
          </div>
          <div style="margin-top:10px;">
            <span class="ap-title">盘点单号：</span>
            <span  class="ap-text">{{routemsg.ccode}}</span>
            <span style="padding-left:10px;" class="ap-title">盘点仓库：</span>
            <span  class="ap-text">{{routemsg.cname}}</span>

            <a-tag v-if="routemsg.bcheck === '1'" color="#f50">已审核</a-tag>
          </div>
        </div>

      </div>

      <div>
        <div>  <b class="noneSpan" style="font-size: 26px;color: #0096c7;">盘点单明细</b></div>
        <div><span style="font-size: 14px;font-weight: bold;"><span style="  font-weight: bold;color: #666666;">日期：</span>{{routemsg.activityDate}}</span></div>
      </div>

      <div>
        <div>
          <Button   class="ant-btn ant-btn-me"
                  ant-click-animating-without-extra-node="false"
                  v-if="routemsg.bcheck != '1'"
                  @click="openSelectContent()">增行
          </Button>
          <Button  class="ant-btn ant-btn-me"
                  ant-click-animating-without-extra-node="false"
                  v-if="routemsg.bcheck != '1'"
                  @click="delLines()">删行
          </Button>
          <Button class="ant-btn ant-btn-me"
                  ant-click-animating-without-extra-node="false"
                  v-if="routemsg.bcheck != '1'"
                  @click="openExcel()">导入
          </Button>
          <Button class="ant-btn ant-btn-me"
                  ant-click-animating-without-extra-node="false"
                  v-if="routemsg.bcheck != '1'"
                  @click="doAutoPd()">盘点
          </Button>
          <Button class="ant-btn ant-btn-me"
                  ant-click-animating-without-extra-node="false"
                  v-if="routemsg.bcheck != '1'"
                  @click="delList()">清空
          </Button>
          <Button class="ant-btn ant-btn-me"
                  ant-click-animating-without-extra-node="false"
                  v-if="routemsg.bcheck === '1'"
                  @click="toAuditBack()">弃审
          </Button>
          <Button class="ant-btn ant-btn-me"
                  ant-click-animating-without-extra-node="false"
                  v-if="routemsg.bcheck != '1'"
                  @click="toAudit()">审核
          </Button>
          <a-popover  placement="bottom">
            <template #content>
              <Button class="group-btn-span-special2" style="width: 150px;margin-bottom: 2px"  @click="gotoPy()">其他入库单（盘盈）</Button><br/>
              <Button class="group-btn-span-special2" style="width: 150px;margin-bottom: 2px" @click="gotoPk">其他出库单（盘亏）</Button>
            </template>
            <button
              type="button"
              class="ant-btn ant-btn-me"
              v-if="routemsg.bcheck === '1'"
              ant-click-animating-without-extra-node="false"
            ><span>联查</span></button></a-popover>

          <Button class="ant-btn ant-btn-me"
                  ant-click-animating-without-extra-node="false"
                  v-if="routemsg.bcheck == '1'"
                  @click="exportExcelNow()">导出
          </Button>
          <Button class="ant-btn ant-btn-me"
                  ant-click-animating-without-extra-node="false"
                  v-if="routemsg.bcheck == '1'"
                  @click="openPrint()">打印
          </Button>
          <Button class="ant-btn ant-btn-me"
                  ant-click-animating-without-extra-node="false"
                  @click="closeCurrent(),router.push('/zhongZhang/home/welcome')">退出</Button>
        </div>
        <div>
          <div style="line-height: 38px;padding-right: 60px;">
            <span style="padding-left:10px;" class="ap-title">盘点范围：</span>
            <span  class="ap-text">{{fomartStyle(routemsg.bstyle)}}</span>
          </div>
          <div>
            <a-select v-model:value="selectSearchValue" style="width: 150px;font-size: 12px;font-weight: bold;text-align:left;" class="special_select">
              <a-select-option value="ccode">存货编码</a-select-option>
              <a-select-option value="ccodeName">存货名称</a-select-option>
            </a-select>
            <!-- 搜索 -->
            <a-input-search placeholder="" v-model:value="inputsearchtext"
                            style="width: 150px; border-radius: 4px;margin-right: 4px" @search="selectSearch"/>
          </div>

          <a-button class="ant-btn-me">
            <SyncOutlined :style="{ fontSize: '14px' }" @click="findAllInitialBalance()"/>
          </a-button>
          <a-popover class="ant-btn-default" placement="bottom">
            <template #content>
            <a-popconfirm
                ok-text="保存"
                cancel-text="关闭"
                placement="leftTop"
                @confirm="confirm"
                @cancel="cancel">
                <template #icon><b>栏目设置</b><br></template>
                <template #title>
                  <div style="width: 640px">
                    <a-table bordered :class="'a-table-font-size-12'" :data-source="dynamicColumnData" :columns="dynamicColumns"
                             childrenColumnName="children" :pagination="false"
                             style="max-height: 500px;overflow-y: auto" class="lanmu-table" >
                      <template #checkBox="{ text, record }">
                        <a-checkbox v-model:checked="record.check" :disabled="record.isFixed"/>
                      </template>
                      <template #widthInput="{ text, record }">
                        <div class="editable-cell">
                          <div v-if="editableData[record.key]"
                               class="editable-cell-input-wrapper">
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
                          <div v-if="editableData[record.key]"
                               class="editable-cell-input-wrapper">
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
                  </div>
                </template>
                <Button style="width: 120px;margin-bottom: 2px">栏目设置</Button>
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
        </div>
      </div>

    </div>


    <div class="bg-white" :style="{height: (windowHeight+50)+'px',marginLeft:'10px',display: 'inline',width: showCatalog?'280px':'20px',float: 'left',marginTop: '1px',overflow:showCatalog?'auto':'hidden',overflowY:'hidden'}" >
      <Loading :loading="compState.loading" :absolute="compState.absolute" :tip="compState.tip" />
      <div v-show="showCatalog" style="width: 100%; height: 26px;text-align: center;background-color: rgb(216 216 216);">
        <label style="font-size: 14px;font-weight: bold;">存货分类</label>
      </div>
      <BasicTree
        v-show="showCatalog"
        defaultExpandAll
        :click-row-to-expand="false"
        :tree-data="treeData"
        :loading="loading2"
        v-model:selectedKeys="selectedKeys2"
        v-model:expandedKeys="expandedKeys"
        @select="handleSelect"/>
      <div v-show="!showCatalog" style="width: 20px;text-align: center; height: 100%;background-color: rgb(216 216 216);padding-top: 10%">
        <ArrowsAltOutlined class="exit-class" style="padding: 3px" title="展开"  @click="showCatalog=!showCatalog"/>
        <label style="font-size: 14px;font-weight: bold;">存货分类</label>
      </div>
    </div>

    <div class="app-container" :style="{height: (windowHeight)+'px',display: 'inline',width: showCatalog?'calc( 100% - 310px )':'calc( 100% - 22px )',float: 'right',marginTop: '0px'}">

      <BasicTable
        ref="tableRef"
        :row-selection="{ type: 'checkbox', selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
        :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
        :columns="tableColumns"
        :scroll="{ x: totalColumnWidth,y: windowHeight }"
        :dataSource="tableData"
        :loading="loading"
        :bordered="true"
        size="small"
        @register="registerTable"
        :showIndexColumn="true"
        @row-click="doEdit"
        :indexColumnProps="{width: 60, fixed: 'left', title: '序号'}"
        :pagination="{
          pageSize: 1000,
          simple: true,
        }"
      >
        <template #stockNum="{ record }">
          <template v-if="record.roweditflg">
            <template v-if="record?.stockNumEdit">
              <Select
                v-model:value="record.stockNum"
                :default-active-first-option="false"
                :filter-option="false"
                :not-found-content="null"
                :options="ckListOptions.map(it=>({value: it.id,label: it.ckName}))"
                :show-arrow="false"
                show-search
                style="width: 82%;"
                class="cwhcode"
                @keyup.enter="focusNext($event,record,'stockNum')"
              ></Select>
              <SearchOutlined @click="openSelectContent()"/>
            </template>
            <template v-else>
              <span >{{
                  record.stockNum
                }}
               <SearchOutlined @click="openSelectContent()"/></span>

              <!--              <EditOutlined @click="record.stockNumEdit = true;record.oldstockNum=record.stockNum"/>-->
            </template>
          </template>
          <template v-else>
            <span >{{
                record.stockNum
              }}</span>
          </template>
        </template>

        <template #quantityPd="{ record }">
          <template v-if="record.roweditflg">
            <template v-if="record?.quantityPdEdit">
              <a-input-number v-model:value="record.quantityPd"
                              :formatter="value =>`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value =>`${value}`.replace(/\$\s?|(,*)/g,'')"
                               min="0" :precision="10" style="width: 85%;margin: -5px 0"
                              @keyup.enter="record.quantityPdEdit = null;dbSave(record);slChange(record,'1')"/>
              <CheckOutlined v-if="record.stockNum!=null" @click="record.quantityPdEdit = null;dbSave(record);slChange(record,'1')"/>
            </template>
            <template v-else>
              <span >{{
                  record.quantityPd != null ?  money(record.quantityPd) : money(record.baseQuantity)
                }}
              <EditOutlined v-if="record.stockNum!=null" @click="record.quantityPdEdit = true;record.oldQuantityPd=record.quantityPd"/></span>
            </template>
          </template>
          <template v-else>
            <span >{{
                record.quantityPd != null ?  money(record.quantityPd) : record.quantityPd = record.baseQuantity,money(record.baseQuantity)
              }}</span>
          </template>
        </template>
        <template #subPandian1="{ record }">
          <template v-if="record.roweditflg">
            <template v-if="record?.subPandian1Edit && record.cunitidType === '多计量'">
              <a-input-number v-model:value="record.subPandian1"
                              :formatter="value =>`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value =>`${value}`.replace(/\$\s?|(,*)/g,'')"
                              :precision="10" style="width: 85%;margin: -5px 0"  min="0"
                              @keyup.enter="record.subPandian1Edit = null;dbSave(record);slChange(record,'2')"/>
              <CheckOutlined v-if="record.stockNum!=null" @click="record.subPandian1Edit = null;dbSave(record);slChange(record,'2')"/>
            </template>
            <template v-else>
              <span >{{
                  record.subPandian1 != null ?   money(record.subPandian1) : money(record.subQuantity1)
                }}
              <EditOutlined v-if="record.stockNum!=null" @click="record.subPandian1Edit = true;record.oldSubPandian1=record.subPandian1"/></span>
            </template>
          </template>
          <template v-else>
            <span >{{
                record.subPandian1 != null ?   money(record.subPandian1) : record.subPandian1 = record.subQuantity1,money(record.subQuantity1)
              }}</span>
          </template>
        </template>
        <template #subPandian2="{ record }">
          <template v-if="record.roweditflg">
            <template v-if="record?.subPandian2Edit && record.cunitidType === '多计量'">
              <a-input-number v-model:value="record.subPandian2"
                              :formatter="value =>`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value =>`${value}`.replace(/\$\s?|(,*)/g,'')"
                              :precision="10" style="width: 85%;margin: -5px 0"  min="0"
                              @keyup.enter="record.subPandian2Edit = null;dbSave(record);slChange(record,'3')"/>
              <CheckOutlined v-if="record.stockNum!=null" @click="record.subPandian2Edit = null;dbSave(record);slChange(record,'3')"/>
            </template>
            <template v-else>
              <span >{{
                  record.subPandian2 != null ?   money(record.subPandian2) : money(record.subQuantity2)
                }}
              <EditOutlined v-if="record.stockNum!=null" @click="record.subPandian2Edit = true;record.oldSubPandian2=record.subPandian2"/></span>
            </template>
          </template>
          <template v-else>
            <span >{{
                record.subPandian2 != null ?   money(record.subPandian2) : record.subPandian2 = record.subQuantity2,money(record.subQuantity2)
              }}</span>
          </template>
        </template>

        <template #batchId="{ record }">
          <template v-if="record.roweditflg&&record.id==null">
            <Input v-if="record.stockNum!=null" v-model:value="record.tempBatchId"
                   style="width: 82%;" class="batchId"
                   @keyup.enter="dbSave(record);"/>
            <CheckOutlined v-if="record.stockNum!=null" @click="record.editBatchId = null;record.batchId=record.tempBatchId;dbSave(record);"/>
          </template>
          <template v-else>
            <div
              @click="record.tempBatchId=record.batchId,record.editBatchId = true;">
              <span >{{ record.batchId }}</span>
            </div>
          </template>
        </template>
        <template #dpdate="{ record }">
          <template v-if="record.roweditflg&&record.id==null">
            <DatePicker v-if="record.stockNum!=null" v-model:value="record.tempDpdate" value-format="YYYY-MM-DD"
                        class="dpdate"
                        format="YYYY-MM-DD" style="width: 82%;"
                        />
            <CheckOutlined v-if="record.stockNum!=null" @click="record.editDpdate = null;record.dpdate=record.tempDpdate;dbSave(record);"/>
          </template>
          <template v-else>
            <div  @click="record.tempDpdate=record.dpdate,record.editDpdate = true;">
              <span >{{ record.dpdate }}</span>
            </div>
          </template>
        </template>
        <template #dvdate="{ record }">
          <template v-if="record.roweditflg&&record.id==null">
            <DatePicker v-if="record.stockNum!=null" v-model:value="record.tempFifteen" value-format="YYYY-MM-DD"
                        class="dvdate"
                        format="YYYY-MM-DD" style="width: 82%;"
                        />
            <CheckOutlined v-if="record.stockNum!=null" @click="record.editFifteen = null;record.dvdate=record.tempFifteen;dbSave(record);"/>
          </template>
          <template v-else>
            <div
              @click="record.tempFifteen=record.dvdate,record.editFifteen = true;">
              <span >{{ record.dvdate }}</span>
            </div>
          </template>
        </template>

        <template #baseQuantity="{ record }">
          <span>{{ record.bq != null ? money2(record.bq) : money2(record.baseQuantity) }}</span>
        </template>
        <template #subQuantity1="{ record }">
          <span>{{ record.sq1 != null ? money2(record.sq1) : money2(record.subQuantity1) }}</span>
        </template>
        <template #subQuantity2="{ record }">
          <span>{{ record.sq2 != null ? money2(record.sq2) : money2(record.subQuantity2) }}</span>
        </template>

        <template #quantityUk="{ record }">
          <span >{{
              money(record.quantityPd - record.bq)
            }}</span>
        </template>
        <template #quantityUk1="{ record }">
          <span >{{
              money(record.subPandian1 - record.sq1)
            }}</span>
        </template>
        <template #quantityUk2="{ record }">
          <span >{{
              money(record.subPandian2 -  record.sq2)
            }}</span>
        </template>

        <template #cunitid="{ record }">
          <span>{{ formatUnit(record) }}</span>
        </template>
        <template #cunitidF1="{ record }">
          <span>{{ formatCunitid(record.rate1,record.fnames1) }}</span>
        </template>
        <template #cunitidF2="{ record }">
          <span>{{ formatCunitid(record.rate2,record.fnames2) }}</span>
        </template>

        <template #summary>
          <TableSummary fixed>
            <TableSummaryRow>
              <TableSummaryCell class="nc-summary" :index="0" :align="'center'"></TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="1" :align="'center'"></TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="2" :align="'center'">合计</TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="3" ></TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="4" ></TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="5" ></TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="6" ></TableSummaryCell>

              <TableSummaryCell class="nc-summary" :index="7" :align="'right'">
              </TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="8" ></TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="9" :align="'right'">
              </TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="10" :align="'right'">
                {{ money(formItems.sumPd1) }}
              </TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="11" :align="'right'">{{ money(formItems.sumP1) }}</TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="12" :align="'right'">
              </TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="13" :align="'right'">
                {{ money(formItems.sumPd2) }}
              </TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="14" :align="'right'">{{ money(formItems.sumP2) }}</TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="15" :align="'right'">
              </TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="16" :align="'right'">
                {{ money(formItems.sumPd3) }}
              </TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="17" >{{ money(formItems.sumP3) }}</TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="18" >{{  money(formItems.sumYk1) }}</TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="19" >{{  money(formItems.sumYk2) }}</TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="20" >{{  money(formItems.sumYk3) }}</TableSummaryCell>

            </TableSummaryRow>
          </TableSummary>
        </template>
      </BasicTable>

      <div style="position: absolute;  bottom: 2%; right: 12%; font-size: 13px; color: black; z-index: 99999999;" v-show="showPaginationText">
        {{`共 ${paginationNumber} 条记录   &nbsp;&nbsp;每页 200 条`}}
      </div>
      <ImprotExcel @save="reloadProjects" @register="registerImportPage"/>
      <ImprotExcelFz @save="reloadProjects" @register="registerImportPageFz"/>
      <ThisEdit @register="registerEditPage" @save="findAllInitialBalance" :placement="'top'" :database="databaseTrue"></ThisEdit>
      <CodeModalPop @throwData="modalData" @register="registerCodePopPage" />
    </div>



    <StockInfiModalPop @register="registerStockInfoModalPage" @throwData="stockAdd"/>

    <Print @save="loadPrint" @register="registerPrintPage"/>
  </div>

</template>
<script setup lang="ts">
import {
  EditOutlined,
  CaretDownOutlined,
  CheckOutlined,
  LinkOutlined,
  ExclamationCircleOutlined,
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
  SortAscendingOutlined,
  SearchOutlined,ProfileOutlined,
  PrinterOutlined,PlusCircleTwoTone, DeleteTwoTone,
  UsbOutlined,ShrinkOutlined,ArrowsAltOutlined
} from '@ant-design/icons-vue';
import {BasicTable, useTable} from '/@/components/Table';
import StockInfiModalPop from "/@/views/boozsoft/stock/stock_info/popup/stockInfoModalPop.vue";
import Print from "./popup/print.vue";

import CodeModalPop from '/@/views/boozsoft/global/popup/accode2/modalPop.vue';
import {
  DatePicker as ADatePicker,
  Select as ASelect,
  Input as AInput, InputNumber as AInputNumber,
  Popover as APopover,
  Radio as ARadio,
  Pagination as APagination,
  Popconfirm as APopconfirm,
  Table as ATable,
  Checkbox as ACheckbox,
  Statistic as AStatistic, Modal as AModal,DatePicker,
  Drawer as ADrawer, Collapse, message, Divider, Button, Progress,Tag as ATag,
  BadgeRibbon as ABadgeRibbon,Badge as ABadge
} from "ant-design-vue"
import { BasicTree } from '/@/components/Tree';
import {useModal} from '/@/components/Modal';
import {
  saveSubjectInitialBalance,
  delInitalBalance,
  emptyAll
} from '/@/api/subjectInitialBalance/subjectInitialBalance';

import {
  findAll,
  savePrice,
  delPrice,
  delCust,
  addCusts,
  saveMx,
  clearPd,
  delLine,
  getFwList,
  autoPd,
  audit, auditBack, getUnitsList, getUnitList, auditCheck,findByXyCcode,getDataInfo
} from '/@/api/record/stock/stock_taking';
import {onMounted, ref, reactive} from 'vue';
import ImprotExcel from './popup/improtExcel.vue';
import ImprotExcelFz from './popup/improtExcelFz.vue';
import {aoaToSheetXlsx, jsonToSheetXlsx} from '/@/components/Excel';
import {useUserStore, useUserStoreWidthOut} from '/@/store/modules/user';
import {
  countByTaskId,delFunctionModule,
  getCurrentAccountName,
  hasBlank
} from "/@/api/task-api/tast-bus-api";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {findByAccId, findDataBase} from "/@/api/record/system/account";

import {onBeforeRouteLeave, useRoute} from "vue-router";
import {
  assemblyDynamicColumn,
  combineParameters,
  initDynamics
} from "/@/views/boozsoft/stock/stock_taking/data";
import {findDbLanMuList, saveLanMuList} from "/@/api/record/system/accvoucher";
import {cloneDeep} from "lodash-es";
import {useMessage} from "/@/hooks/web/useMessage";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {deleteDept} from "/@/api/record/system/fa-asset-type";
import {findCusAll} from "/@/api/record/generalLedger/data";
import {getStockClassTree} from "/@/api/record/stock/stock-price";
import {JsonTool, NumberTool} from "/@/api/task-api/tools/universal-tools";
import {isNull} from "/@/utils/is";
import {exportExcel} from "/@/api/record/generalLedger/excelExport";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";

const dataSourceTable:any =ref([]);
const columns = [];
const ARangePicker = ADatePicker.RangePicker
const ASelectOption = ASelect.Option
const AInputSearch = AInput.Search
const ARadioGroup = ARadio.Group
const ARadioButton = ARadio.Button
const CollapsePanel = Collapse.Panel
const AStatisticCountdown = AStatistic.Countdown;
const TableSummary = ATable.Summary
const TableSummaryRow = TableSummary.Row
const TableSummaryCell = TableSummary.Cell
const paginationNumber = ref(0)
const {closeCurrent,closeToFullPaths} = useTabs(router);
// 期初记账/恢复期初记账  显示
const ibookflg = ref(false);
// 计时数值
const deadline = ref(Date.now() + 1000 * 10);
// 借贷方金额
const md = ref('');
const mc = ref('');
// 借贷方数量
const numflg = ref(false);
const ncnum = ref('');
// 外币金额
const nfrat = ref('');
const nfratflg = ref(false);
const visible = ref(false);

const isLj = ref(false)
const showCatalog = ref(true)
// 累计借贷方金额
const mdLj = ref('');
const mcLj = ref('');
// 累计借贷方数量
const numflgLj = ref(false);
const ncnumLj = ref('');
const ncnumLj2 = ref('');
// 累计外币金额
const nfratLj = ref('');
const nfratLj2 = ref('');
const nfratflgLj = ref(false);
const showPaginationText = ref(false)

// 弹框2状态
const carryDownModal = ref(false);
const modal2Visible = ref(false);
const lock0K = ref(false);
const edittext = ref('开始编辑');
// 弹框1状态
const modal1Visible = ref(false);
// 试算平衡list
const ssphtext = ref('');
const ystext = ref('');
const textObj = {
  proportion: 100,
  left: {text: '', value: '0', proportion: 100},
  right: {text: '', value: '0', proportion: 100}
}
const ssphlist = ref([]);
const ssphlist2 = ref([]);
// 试算平衡表头
const ssphcolumns = ref([]);
// 单元格可编状态
const roweditflg = ref(false);
const loading = ref(false);
const loading3 = ref(false);
// 账套启用期间
const begintime = ref('');
// 账套启用期间
const iyearlist = ref([]);
// 选中年度
const iyearselected = ref('');
// 显示末级科目
const lastCode = ref(false);
const tableDataAll = ref([]);
const tableData = ref([]);
// 任务管理信息
const taskinfo = ref('');
// 期初弹框回调信息
const datainfo = ref('');
// 期初弹框回调信息
const types = ref('');
// 数据库模式名称
const database = ref(getCurrentAccountName(false));
const databaseTrue = ref(getCurrentAccountName(true));
const databaselist = ref([]);
const userinfo = ref({
  databaseNum: database.value,
  username: useUserStoreWidthOut().getUserInfo.username,
  realName: useUserStoreWidthOut().getUserInfo.realName,
  name: useUserStoreWidthOut().getUserInfo.name,
  phone: useUserStoreWidthOut().getUserInfo.phone,
});
const userStore = useUserStore();
const codelist=ref([])
// 字体
const pageParameter = reactive({
  cclass: '0',
  ccode:'',
  bend:'',
  databasenum: databaseTrue.value,
  queryMark: '1',
  showRulesSize: 'MIN',
  filterConditon: {
    amountMinMc: '',
    amountMaxMc: '',
    amountMinMd: '',
    amountMaxMd: ''
  },
  uniqueAccStandard: '',
  templateId: '',
  activeKey: '',
  reloadMark: false,
  companyCode: '',
  companyName: '',
  ifUnit: false,
})
// 数量/外币 栏目是否显示
const menterage = ref(true)
const currencyType = ref(true)
const tableColumns = ref([

  {
    title: "存货编码",
    dataIndex: "stockNum",
    fixed: 'left',
    slots: {customRender: "stockNum"}
  },
  {
    title: "存货名称",
    dataIndex: "stockName",
    fixed: 'left',
    align: "left"
  },
  {
    title: "规格型号",
    dataIndex: "stockGgxh",
    fixed: 'left',
    align: "left"
  },
  {
    title: "条形码",
    dataIndex: "stockBarcode",
    fixed: 'left',
    slots: {customRender: "stockBarcode"}
  },
  {
    title: "批号",
    dataIndex: "batchId",
    fixed: 'left',
    slots: {customRender: "batchId"},
  },
  {
    title: "开始日期",
    dataIndex: "dpdate",
    slots: {customRender: "dpdate"},
  },
  {
    title: "结束日期",
    dataIndex: "dvdate",
    slots: {customRender: "dvdate"},
  },
  {
    title: "主计量",
    dataIndex: "cunitid",
    slots: {customRender: "cunitid"},
  },
  {
    title: "账面主数量",
    dataIndex: "baseQuantity",
    slots: {customRender: "baseQuantity"},
  },
  {
    title: "盘点主数量",
    dataIndex: "quantityPd",
    slots: {customRender: "quantityPd"},
  },
  {
    title: "计量1",
    dataIndex: "cunitidF1",
    slots: {customRender: "cunitidF1"},
  },
  {
    title: "账面数量1",
    dataIndex: "subQuantity1",
    slots: {customRender: "subQuantity1"},
  },
  {
    title: "盘点数量1",
    dataIndex: "subPandian1",
    slots: {customRender: "subPandian1"},
  },
  {
    title: "计量2",
    dataIndex: "cunitidF2",
    slots: {customRender: "cunitidF2"},
  },
  {
    title: "账面数量2",
    dataIndex: "subQuantity2",
    slots: {customRender: "subQuantity2"},
  },
  {
    title: "盘点数量2",
    dataIndex: "subPandian2",
    slots: {customRender: "subPandian2"},
  },
  {
    title: "盈亏主数量",
    dataIndex: "quantityUk",
    slots: {customRender: "quantityUk"},
  },
  {
    title: "盈亏数量1",
    dataIndex: "quantityUk1",
    slots: {customRender: "quantityUk1"},
  },
  {
    title: "盈亏数量2",
    dataIndex: "quantityUk2",
    slots: {customRender: "quantityUk2"},
  },
])

// 是否非企业机构标识 1是
const icorp = ref('')
// 公司码
const cocode = ref('')
// 账套详细信息
const databaseinfo = ref('')
// 1是 否独立账套
const independent = ref(false)
const cwflag = ref(false);
const ysflag = ref(false);
const modal3Visible = ref(false);
const selectDataBaseValue = ref('');
const selectSearchValue = ref('ccode');
const bwb = ref('');
const qujian = ref('');
// 所有账套集合
const databaseAll = ref([])
const inputsearchtext = ref('')
const templateSelected = ref('')
const standardSelected = ref('')
// 余额录入弹框
const openInfo = ref({
  ccode: '',
  ccodeName: '',
  fx: '',
  currency: ''
})

const loading2 = ref(true);
const treeData:any = ref([]);
const selectedKeys2:any = ref([]);
const expandedKeys:any = ref([]);
const styleList:any = ref([]);

// 这是示例组件
const [registerImportPage, {openModal: openImprotPage}] = useModal();
const [registerImportPageFz, {openModal: openImprotPageFz}] = useModal();

const [registerEditPage, {openModal: openEditPage}] = useModal();
const [registerCodePopPage, {openModal: openCodePopPage}] = useModal();

const tableRef = ref(null)
const windowWidth = (window.innerWidth)
const windowHeight = (window.innerHeight - (320))
const totalColumnWidth = ref(0)
const [registerTable, {
  reload,
  setColumns,
  getDataSource,
  getColumns,
  setTableData,
  getSelectRows
}] = useTable();

// 过滤漏斗
function filterSearch() {
  pageParameter.filterConditon.amountMinMd = pageParameter.filterConditon.amountMinMd === '' ? '0' : pageParameter.filterConditon.amountMinMd
  pageParameter.filterConditon.amountMaxMd = pageParameter.filterConditon.amountMaxMd === '' ? '0' : pageParameter.filterConditon.amountMaxMd
  pageParameter.filterConditon.amountMinMc = pageParameter.filterConditon.amountMinMc === '' ? '0' : pageParameter.filterConditon.amountMinMc
  pageParameter.filterConditon.amountMaxMc = pageParameter.filterConditon.amountMaxMc === '' ? '0' : pageParameter.filterConditon.amountMaxMc

  let all = tableDataAll.value
  tableData.value = all.filter((a) =>
    parseFloat(a.md) >= parseFloat(pageParameter.filterConditon.amountMinMd) && parseFloat(a.md) <= parseFloat(pageParameter.filterConditon.amountMaxMd)
    && parseFloat(a.mc) >= parseFloat(pageParameter.filterConditon.amountMinMc) && parseFloat(a.mc) <= parseFloat(pageParameter.filterConditon.amountMaxMc)
  );
}

function selectSearch2() {
  if (inputsearchtext.value !== '') {
    findAllInitialBalance()
  }
}

// 检索条件
async function selectSearch() {
  loading.value = true;
  let all = tableDataAll.value
  if (selectSearchValue.value === 'ccode') {
    tableData.value = all.filter((a) => a.stockNum !=null && a.stockNum.indexOf(inputsearchtext.value) !== -1);
    tableData.value =  replenishTrs(tableData.value)
    loading.value = false
  }
  if (selectSearchValue.value === 'ccodeName') {
    tableData.value = all.filter((a) => a.stockName !=null && a.stockName.indexOf(inputsearchtext.value) !== -1);
    tableData.value =  replenishTrs(tableData.value)
    loading.value = false
  }

  if (inputsearchtext.value === '') {
    findAllInitialBalance()
  }
}

async function modalok() {
  modal3Visible.value = false
}

async function emptyAllbtn(data) {
  if (data.accvouid !== null) {
    await useRouteApi(emptyAll, {schemaName: databaseTrue.value})(data.accvouid)
    findAllInitialBalance();
  }
}


// 倒计时到时间触发
function onFinish() {
  console.log('30分钟到了');
}


// 导出excel
function exportexcel() {
  var list = [];
  for (let i = 0; i < tableDataAll.value.length; i++) {
    // 所有末级科目
    list.push({
      ccode: tableDataAll.value[i].ccode,
      stockNum: tableDataAll.value[i].stockNum,
      stockName: tableDataAll.value[i].stockName,
      stockGgxh: tableDataAll.value[i].stockGgxh,
      stockMarketUnit: tableDataAll.value[i].stockMarketUnit,
      subQuantity1: money(tableDataAll.value[i].subQuantity1),
      regularPrice: money(tableDataAll.value[i].regularPrice),
      minPrice: money(tableDataAll.value[i].minPrice),
      maxPrice: money(tableDataAll.value[i].maxPrice),
      invscost1: money(tableDataAll.value[i].invscost1),
      invscost2: money(tableDataAll.value[i].invscost2),
      newPrice:  money(tableDataAll.value[i].newPrice)
    });
  }

  jsonToSheetXlsx({
    data: list,
    header: {
      stockNum: '存货编码',
      stockName: '存货名称',
      stockGgxh: '规格型号',
      stockMarketUnit: '默认销售单位',
      subQuantity1: '普通客户价',
      regularPrice: '零售价',
      minPrice: '最低价',
      maxPrice: '最高价',
      invscost1: '一级客户价',
      invscost2: '二级客户价',
      newPrice: '最新进价',
    },
    filename: '存货价格表.xlsx',
  });
}

// 导入弹框
const importPop = (type) => {
  if (hasBlank(type)) {
    openImprotPage(true, {
      databaseTrue: databaseTrue.value,
      database: database.value,
      iyear: iyearselected.value,
      isLiji: pageParameter.queryMark == '2' ? true : false,
    });
  } else {
    openImprotPageFz(true, {
      databaseTrue: databaseTrue.value,
      database: database.value,
      iyear: iyearselected.value,
      isLiji: pageParameter.queryMark == '2' ? true : false ,
    });
  }
};

async function reloadProjects() {
  findAllInitialBalance();
}

/**
 * 简单数组去重
 * @param array
 */
function uniq(array) {
  var temp = []; //一个新的临时数组
  for (var i = 0; i < array.length; i++) {
    if (temp.indexOf(array[i]) == -1) {
      temp.push(array[i]);
    }
  }
  return temp;
}

const del = async (delArr: any, iyear: any) => {
  await useRouteApi(delInitalBalance, {schemaName: databaseTrue.value})({str: delArr, iyear: iyear})
  findAllInitialBalance();
};

// 提交弹框
const submitPop = async () => {

};

const setModal1Visible = async (data: any) => {
};

function findLastDate(date) {
  date = new Date(date);
  date = 0 + (date).getTime() - 1000 * 60 * 60 * 24;
  date = new Date(date);
  date = date.getFullYear() + "-" + (date.getMonth() > 9 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1)) + "-" + (date.getDate() > 9 ? (date.getDate()) : "0" + (date.getDate()));
  return date;
}

// 是否末级科目查询
const lastCodechecked = async (val) => {
  lastCode.value = val.target.checked;
  findAllInitialBalance();
};

const yearChange = async (val) => {
};

const saveData = async (data: any) => {
  await useRouteApi(saveSubjectInitialBalance, {schemaName: databaseTrue.value})({
    params: data,
    accId: database.value,
    userName: userinfo.value.username,
    databasenum: databaseTrue.value,
    saveType: pageParameter.queryMark
  })
  findAllInitialBalance();
};

const formItems: any = ref({})
// 获取list
const findAllInitialBalance = async () => {
  showPaginationText.value = false
  tableData.value = []
  tableDataAll.value = []
  loading.value = true;
  const a = await useRouteApi(findAll, {schemaName: databaseTrue.value})({
    stockClass: pageParameter.cclass,
    ccode: routemsg.value.ccode,
    type: routemsg.value.bstyle,
  })
  tableDataAll.value = a;

  let tableColumns = a.tableColumns;
  if (tableColumns === 'all') {
    menterage.value = false
    currencyType.value = false
  }
  if (tableColumns === 'menterage') {
    menterage.value = false
  }
  if (tableColumns === 'currencyType') {
    currencyType.value = false
  }

  if (null != a) {
    let sum1 = 0;
    let sum2 = 0;
    let sum3 = 0;
    let sum4 = 0;
    let sum5 = 0;
    let sum6 = 0;
    let sum7 = 0;
    let sum8 = 0;
    let sum9 = 0;
    a.forEach(v=>{
      sum7= goadd(sum7, v.quantityPd)
      sum8= goadd(sum8, v.subPandian1)
      sum9= goadd(sum9, v.subPandian2)

      sum1= goadd(sum1, v.baseQuantity)
      sum2= goadd(sum2, v.subQuantity1)
      sum3= goadd(sum3, v.subQuantity2)

      sum4= goadd(sum4, v.quantityUk)
      sum5= goadd(sum5, v.quantityUk1)
      sum6= goadd(sum6, v.quantityUk2)
    })
    formItems.value.sumPd1 = sum1
    formItems.value.sumPd2 = sum2
    formItems.value.sumPd3 = sum3

    formItems.value.sumYk1 = sum4
    formItems.value.sumYk2 = sum5
    formItems.value.sumYk3 = sum6

    formItems.value.sumP1 = sum7
    formItems.value.sumP2 = sum8
    formItems.value.sumP3 = sum9
  }
  let len = a.length
  paginationNumber.value = len
  tableData.value =  replenishTrs(tableDataAll.value)
  loading.value = false;
  showPaginationText.value = true
};
const replenishTrs = (list) =>{
  let l = list.length
  for (let i = 0; i < (50-l); i++) {
    list.push({})
  }
  return list
}
function goadd(a, b) {
  if(!a){
    a = 0
  }
  if(!b){
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
// 金额格式化
function money(val: any) {
  if (val == null) {
    val = '';
    return val;
  }
  if (isNaN(val)) {
    val = '';
    return val;
  }
 if (val == '0.00') {
    val = '';
    return val;
  }
  val = val.toString().replace(/\$|\,\-/g, '');
  if (isNaN(val)) {
    val = '0';
  }
  let fs = val.indexOf('-') != -1
  const sign = val === (val = Math.abs(val));
  val = Math.floor(val * 100 + 0.50000000001);
  let cents = val % 100;
  val = Math.floor(val / 100).toString();
  if (cents < 10) {
    cents = '0' + cents;
  }
  for (let i = 0; i < Math.floor((val.length - (1 + i)) / 3); i++) {
    val =
      val.substring(0, val.length - (4 * i + 3)) + ',' + val.substring(val.length - (4 * i + 3));
  }
  return (sign ? '' : '') + (fs ? '-' : '') + val + '.' + cents;
}
function money2(val: any) {
  if (val == null) {
    val = '';
    return val;
  }
  if (isNaN(val)) {
    val = '';
    return val;
  }
  if (val == '0.00') {
    val = '0';
    return val;
  }
  val = val.toString().replace(/\$|\,\-/g, '');
  if (isNaN(val)) {
    val = '0';
  }
  let fs = val.indexOf('-') != -1
  const sign = val === (val = Math.abs(val));
  val = Math.floor(val * 100 + 0.50000000001);
  let cents = val % 100;
  val = Math.floor(val / 100).toString();
  if (cents < 10) {
    cents = '0' + cents;
  }
  for (let i = 0; i < Math.floor((val.length - (1 + i)) / 3); i++) {
    val =
      val.substring(0, val.length - (4 * i + 3)) + ',' + val.substring(val.length - (4 * i + 3));
  }
  return (sign ? '' : '') + (fs ? '-' : '') + val + '.' + cents;
}

const getAdObjInfoByCoCode = (value, type, accList) => {
  let list = accList.filter(item => item[type] == value)
  return list.length > 0 ? list[0] : null
}



// 获取科目类型
async function findByAccStyleAll() {
  loading2.value = true
  fetch()
}

async function fetch() {
  const deptTree = await useRouteApi(getStockClassTree,{schemaName: databaseTrue})()
  if(deptTree!=null){
    function a(customerTree) {
      customerTree.forEach((item) => {
        if (item.children != null) {
          a(item.children);
        }
        item.title=  item.stockClass +'-'+item.title
        item.key=item.key+'>>'+item.bend
      });
    }
    a(deptTree);
    treeData.value = []
    selectedKeys2.value=['0']
    expandedKeys.value=['0']
    treeData.value.push({title: '全部',key:'0',children: deptTree})
  }
  loading2.value = false;
}
//js切割字符串
function setString(str, len) {
  var strlen = 0;
  var s = '';
  for (var i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 128) {
      strlen += 2;
    } else {
      strlen += 1.2;
    }
    s += str.charAt(i);
    if (strlen >= len) {
      return s + '...';
    }
  }
  return s;
}

function handleSelect(obj) {
  if(obj.toString()!==''){
    if(!isNaN(obj.toString().split('>>')[0])){
      pageParameter.cclass=obj.toString().split('>>')[0]
      findAllInitialBalance()
    }else{
      pageParameter.cclass=obj.toString().split('>>')[0]
      findAllInitialBalance()
    }
  }else{
    selectedKeys2.value=['0']
    pageParameter.cclass='0'
    pageParameter.ccode=''
    findAllInitialBalance()
  }
}
/*start栏目设置*/
const onChangeSwitch = async (v) => { // 动态列
  pageParameter.queryMark = v
  resetDynamicColumnData()
}
const {createConfirm, createWarningModal} = useMessage();
const dynamicColumns = initDynamics().DEFAULT
const dynamicColumnData = ref([])
let dynamicColumnDataCopy = []
const editableData = reactive({});
const lanMuData = {
  'accId': '',
  'menuName': '盘点单',
  'type': '',
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
        dynamicColumnDataCopy = JSON.parse(JSON.stringify(dynamicColumnData.value))
      }
    }
  });
  // 重新获取数据
  reloadColumns()
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

const cancel = (e: MouseEvent) => {
  // 恢复默认
  dynamicColumnData.value = []
  dynamicColumnData.value = dynamicColumnDataCopy
}


function resetDynamicColumnData() {
  // 先从数据查询是否已经设置
  lanMuData.accId = getCurrentAccountName(false)
  lanMuData.type = pageParameter.queryMark == '1' ? '标准' : '累计'
  findDbLanMuList(lanMuData).then(res => {
    // 栏目列
    let dbList = res.items
    let statiList = pageParameter.queryMark == '1' ? initDynamics()['DATA' + pageParameter.queryMark] : currentShowColumns('lanmu')
    if (dbList.length > 0) {
      dbList = combineParameters(statiList, dbList)
      dynamicColumnData.value = dbList
      dynamicColumnDataCopy = JSON.parse(JSON.stringify(dbList))
    } else {
      dynamicColumnData.value = statiList
      dynamicColumnDataCopy = JSON.parse(JSON.stringify(statiList))
    }
    // 表格列
    reloadColumns()
    // pageReload()
  })
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

const reloadColumns = () => {
  let newA = JSON.parse(JSON.stringify(pageParameter.queryMark == '1' ? tableColumns.value : currentShowColumns('')))
  newA = assemblyDynamicColumn(dynamicColumnData.value, newA)
  setColumns(newA)
  initTableWidth(newA)
}

function initTableWidth(thisCs) {
  let total = 60 + 60 // 选择列与序号列
  thisCs.forEach(item => {
    if (item.ifShow == null || item.ifShow)
      total += parseInt(item.width)
  })

  if (total > windowWidth) {
    let f = 0
    if (visible.value) f = 380
    totalColumnWidth.value = Number(windowWidth) - f
    tableRef.value.$el.style.setProperty('width', (windowWidth + 62 - f) + 'px')
  } else {
    if (visible.value && (windowWidth - 380) < total) total -= (total - (windowWidth - 380))
    totalColumnWidth.value = total
    tableRef.value.$el.style.setProperty('width', (total + 62) + 'px')
  }
}
/*栏目设置end*/

const dbSave = async (o) => {
  if(routemsg.value.bcheck === '1'){
    message.error("已审核,不允许修改")
    return
  }
  //存货批次管理后 批号日期必填
  console.log(o)

 /* if(o.stockPropertyBatch === '1'){
    if(hasBlank(o.batchId) || hasBlank(o.dvdate) || hasBlank(o.dpdate)){
      message.error("批次管理存货，批号·生效日期·失效日期必填")
      return
    }
  }*/
  //获取成本单价
  console.log(routemsg.value)
  useRouteApi(getCkPriceList,{schemaName: databaseTrue})({
    stockCostAccRo:JSON.stringify([{
      stockNum :o.cinvode,
      stockCangku :o.cwhcode,
      batchId: o.batchId,
    }]),
    ddate :routemsg.value.ddate,
    year : routemsg.value.iyear,
    rkBcheck: routemsg.value?.kcCgrkCheck,
    ckBcheck:  routemsg.value?.kcXsckCheck,
  }).then(res=>{
    if (null != res && res.length > 0){
      o.price = res[0].price
    }
  })
  //修改
  o.ccode = routemsg.value.ccode
  await useRouteApi(saveMx,{schemaName: databaseTrue})(o).then(v=>{
    findAllInitialBalance()
    message.success("操作成功！")
  })
}

const slChange = async (r,num) => {
  if(r.cunitidType === '多计量'){
    if(num === '1'){
      let n:any = parseFloat(r.quantityPd).toFixed(10)
      let isnum  = (r.utypes === '2')//类型-数量
      let one:any = '0.00'
      let two:any = '0.00'
      if(r.rate1){
        one =  parseFloat((n/parseFloat(r.rate1))).toFixed(10)
      }
      if(r.rate2){
        two =  parseFloat((n/parseFloat(r.rate2))).toFixed(10)
      }

      if (isnum){ //取整数}
        r.subPandian1 = isNaN(one)?null:NumberTool.toCeil(one,2)+''
        r.subPandian2 = isNaN(two)?null:NumberTool.toCeil(two,2)+''
      }else {
        r.subPandian1 = isNaN(one)?null:one+''
        r.subPandian2 = isNaN(two)?null:two+''
      }
    }else if(num === '2'){
      let n:any = parseFloat(r.subPandian1).toFixed(10)
      let isnum  = (r.utypes === '2')//类型-数量
      let one:any =  parseFloat((n*parseFloat(r.rate1))).toFixed(10)
      let two:any =  parseFloat((one/parseFloat(r.rate2))).toFixed(10)
      if (isnum){ //取整数}
        r.quantityPd = isNaN(one)?null:NumberTool.toCeil(one,2)+''
        r.subPandian2 = isNaN(two)?null:NumberTool.toCeil(two,2)+''
      }else {
        r.quantityPd = isNaN(one)?null:one+''
        r.subPandian2 = isNaN(two)?null:two+''
      }
    }else{
      let n:any = parseFloat(r.subPandian2).toFixed(10)
      let isnum  = (r.utypes === '2')//类型-数量
      let one:any =  parseFloat((n*parseFloat(r.rate2))).toFixed(10)
      let two:any =  parseFloat((one/parseFloat(r.rate1))).toFixed(10)
      if (isnum){ //取整数}
        r.quantityPd = isNaN(one)?null:NumberTool.toCeil(one,2)+''
        r.subPandian1 = isNaN(two)?null:NumberTool.toCeil(two,2)+''
      }else {
        r.quantityPd = isNaN(one)?null:one+''
        r.subPandian1 = isNaN(two)?null:two+''
      }
    }
  }
}
const changeTableList = (upCcode, dataSourceList) => {
  let up = dataSourceList.filter(it => it.ccode == upCcode)[0]           // 当前上级科目
  let childs = dataSourceList.filter(it => it.superiorCcode == upCcode)  // 当前科目下所有子科目
  let mdSum = 0;
  let mcSum = 0;
  let ldSum = 0;
  let lcSum = 0;
  childs.forEach((it) => {
    mdSum += parseFloat(hasBlank(it.md) ? '0' : it.md)
    mcSum += parseFloat(hasBlank(it.mc) ? '0' : it.mc)
    ldSum += parseFloat(hasBlank(it.ljMd) ? '0' : it.ljMd)
    lcSum += parseFloat(hasBlank(it.ljMc) ? '0' : it.ljMc)
  })
  if (mdSum > mcSum) {
    (up.md = mdSum - mcSum)
    up.mc = 0
  } else {
    up.mc = mcSum - mdSum
    up.md = 0
  }
  if (pageParameter.queryMark == '2') {
    up.ljMd = ldSum
    up.ljMc = lcSum
    let v = up?.bprogerty == '1' ? parseFloat(up?.md) + parseFloat(up?.ljMc) - parseFloat(up?.mc) - parseFloat(up?.ljMd) : parseFloat(up?.mc) + parseFloat(up?.ljMd) - parseFloat(up?.md) - parseFloat(up?.ljMc)
    if (v > 0) {
      if (up?.bprogerty == '1') {
        up.yearMd = v
        up.yearMc = 0
      } else {
        up.yearMc = v
        up.yearMd = 0
      }
    } else {
      if (up?.bprogerty == '1') {
        up.yearMc = Math.abs(v)
        up.yearMd = 0
      } else {
        up.yearMd = Math.abs(v)
        up.yearMc = 0
      }
      up.bprogerty == '1' ? up.bprogerty = '0' : up.bprogerty = '1'
    }
  }
  let index = dataSourceList.findIndex(it => it.ccode == upCcode)
  dataSourceList.splice(index, 1, up)
  if (up.superiorCcode == '0') { // 不存在上级科目
    return dataSourceList
  } else { // 还存在上级
    return changeTableList(up.superiorCcode, dataSourceList)
  }
}
/*************** 中途启用 ****************/
const currentShowColumns = (type) => {
  let flag = false
  if (!menterage.value || !currencyType.value) flag = true
  if (type == 'lanmu') {
    return flag ? initDynamics()['DATA' + pageParameter.queryMark + '2'] : initDynamics()['DATA' + pageParameter.queryMark]
  } else {
    return flag ? tableColumns22.value : tableColumns2.value;
  }
}
function createConfirmPop(text) {
  createConfirm({
    iconType: 'warning',
    title: '警告',
    content: text,
    onOk: async() => {},
  })
}

const filterOption = (input: string, option: any) => {
  return option.data.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const modalRowKey=ref('')
function openSelectCode(data) {
  modalRowKey.value=data.key
  openCodePopPage(true, {
    database: databaseTrue.value,
    accId: database.value,
    iyear: iyearselected.value,
  });
}

function modalData(data) {
  dataSourceTable.value.filter(a=>a.key===modalRowKey.value).map(t=>t.thisCcode=data.ccode+'-'+data.ccodeName)
}

//点击行显示编辑
const doEdit = (record, index) => {
  record.roweditflg = true
}

const formatUnit = (record) => {
  let str = " "
  if(record.cunitidType === '单计量'){
    str = record.cunitname
  }else{
    str = record.cunitnames
  }
  return str
}
const formatCunitid = (a,b) => {
  if(!a){
    return ''
  }
  return (a || '') +'*'+ (b || '')
}
//存货编码选择
const ckListOptions = ref([])
const [registerStockInfoModalPage, {openModal: openStockInfoModalPage}] = useModal();
const openSelectContent = async (record, type) => {
  //查询对应范围
  let list:any=[]
  let cList:any=[]
  if(routemsg.value.bstyle === '1'){
    cList =   await useRouteApi(getFwList,{schemaName: databaseTrue})({
      ccode:routemsg.value.ccode,
      type:routemsg.value.bstyle
    })
  }else if(routemsg.value.bstyle === '2'){
    list = await useRouteApi(getFwList,{schemaName: databaseTrue})({
      ccode:routemsg.value.ccode,
      type:routemsg.value.bstyle
    })
  }else if(routemsg.value.bstyle === '3'){

  }
  //弹出存货编码选择
  //要根据范围显示   存货分类 存货
  openStockInfoModalPage(true, {
    database: databaseTrue.value,
    list: list,
    cList: cList,
  })
}
const stockAdd = async (o) => {
  //获取所有计量单位 给对应的数据
  let umList = await useRouteApi(getUnitList, {schemaName: databaseTrue})({})
  let umsList = await useRouteApi(getUnitsList, {schemaName: databaseTrue})(o.stockMeasurementUnit)
  o.forEach(item=>{
    //去重
    let index = tableData.value.findIndex(obj=> obj.stockNum === item.stockNum)
    if(index < 0){
      //截取
      let newArr = tableData.value.filter(v=> v.stockNum!= null)
      //计量单位对应
      let  cunitname  = ''
      let  cunitnames = ''
      let  fnames1    = ''
      let  rate1      = ''
      let  fnames2    = ''
      let  rate2      = ''
      if(item.stockMeasurementType == '单计量'){
         let f = umList.find(v=> v.id == item.stockMeasurementUnit)
         cunitname  =  f.unitName

      }else{
        let um = []
        umsList.forEach(v=>{
          if(v.umid == item.stockMeasurementUnit){
            um.push(v)
          }
        })
        cunitnames= um[0].unitName
        if(um.length > 1){
            fnames1  = um[1].unitName
            rate1    = um[1].conversionRate
          }
        if(um.length > 2){
          fnames2  = um[2].unitName
          rate2    = um[2].conversionRate
        }
      }

      newArr.push({
        stockNum: item.stockNum,
        stockName: item.stockName,
        stockGgxh: item.stockGgxh,
        stockMarketUnit: item.stockCustomsUnit,
        subQuantity1: '0.00',
        iyear: '2022',
        stockBarcode: item.stockBarcode,
        stockPropertyBatch: item.stockPropertyBatch,
        dpdate: '',
        dvdate: '',
        baseQuantity: '0.00',
        subQuantity1: '0.00',
        subQuantity2: '0.00',

        quantityPd: '0.00',
        subPandian1: '0.00',
        subPandian2: '0.00',

        quantityUk: '0.00',
        quantityUk1: '0.00',
        quantityUk2: '0.00',

        cunitidType: item.stockMeasurementType,
        cunitname :cunitname,
        cunitnames:cunitnames,
        fnames1   :fnames1,
        rate1     :rate1,
        fnames2   :fnames2,
        rate2     :rate2,

      })
      tableData.value =  replenishTrs(newArr)
    }
  })
  setTableData(tableData.value)
}
const add = (record, type) => {
  //弹出存货编码选择
  openStockInfoModalPage(true, {
    database: databaseTrue.value,
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
const onSelectChange = (selectedRowKeys, row) => {
  state.selectedRowKeys = selectedRowKeys;
  checkRow.value = row
};
const delList = () => {
  createConfirm({
    iconType: 'error',
    title: '警告',
    content: '清空后数据将不能恢复，你确认要清空吗?',
    onOk: async () => {
      //验证数据完整性
      let d = await checkData(routemsg.value.ccode)
      if(!d){
        message.error("提示：当前单据不存在，请关闭该页面后重试！！！")
        return
      }
      if(d){
        if(d.bcheck == '1'){
          message.error("提示：当前单据已经审核，不能修改，请弃审单据后重试！！！")
          return
        }
      }
      await useRouteApi(clearPd, {schemaName: databaseTrue})(routemsg.value.ccode)
      message.success('清空成功！')
      findAllInitialBalance()
    },
    onCancel: () => {
      return false
    }
  })
}
const doAutoPd = () => {
  createConfirm({
    iconType: 'error',
    title: '警告',
    content: '盘点后数据将不能恢复，你确认要盘点吗?',
    onOk: async () => {
      //验证数据完整性
      let d = await checkData(routemsg.value.ccode)
      if(!d){
          message.error("提示：当前单据不存在，请关闭该页面后重试！！！")
          return
      }
      if(d){
        if(d.bcheck == '1'){
          message.error("提示：当前单据已经审核，不能修改，请弃审单据后重试！！！")
          return
        }
      }

      await useRouteApi(autoPd, {schemaName: databaseTrue})(routemsg.value.ccode)
      saveLogData('盘点')
      message.success('盘点成功！')
      findAllInitialBalance()
    },
    onCancel: () => {
      return false
    }
  })
}
const delCusts = async() => {
  if(pageParameter.cclass != '0'){
    await useRouteApi(delCust, {schemaName: databaseTrue})(pageParameter.cclass).then(o=>{
      message.success('删除成功！')
      fetch();
    })
  }
};

const [registerCustomerModalPage, {openModal: openCustomerModalPage}] = useModal();

const addCust = () => {
  openCustomerModalPage(true, {
    database: databaseTrue.value,
  })
};

const customerAdd = async(o) => {
  let arr = []
  o.forEach(item=>{
    let index = treeData.value[0].children.findIndex(obj=> obj.custId === item.uniqueCode)
    if(index < 0){
      arr.push({
        custId: item.uniqueCode,
        activityId: routemsg.value.activityId,
        createDate: '2022-04-16',
        createName: userinfo.value.name
    })
    }
  })
  if(arr.length > 0){
    await useRouteApi(addCusts, {schemaName: databaseTrue})(arr).then(r=>{
      message.success("操作成功")
      fetch();
    })
  }
};
const showSearch: any = ref(false)
const searchValue: any = ref()
const searchCust = () => {
  showSearch.value = true
};
const searchTree = () => {
  if(searchValue.value.length > 0){
    treeData.value[0].children = treeData.value[0].children.filter(item=> item.title.includes(searchValue.value))
  }else{
    fetch()
  }
};
const route = useRoute();
const routemsg = ref(route.query);
onMounted( async ()=>{
  databaseTrue.value = routemsg.value.accId
  if (JSON.stringify(routemsg.value).length > 2) {
    if(routemsg.value.activityScope === '1'){
      showCatalog.value = false
    }else{
      findByAccStyleAll()
    }
    await findAllInitialBalance();
    loading.value = true
    resetDynamicColumnData()
    loading.value = false
  }

})
function fomartStyle(flag:any) {
  let str = '仓库'
  switch (flag) {
    case '1':
      str = '存货分类'
      break
    case '2':
      str = '存货档案'
      break
    case '2':
      str = '存货+批号'
      break
  }
  return str
}
//选中存货 然后 弹窗选中客户
const fuzhi = () => {

};

//删行
const delLines = () => {
  if (checkRow.value.length > 0) {
    //已审核不能修改
    if(checkRow.value[0].bcheck ==='1'){
      message.error("已审核单据不能修改！")
      return
    }
    createConfirm({
      iconType: 'error',
      title: '警告',
      content: '选中的数据删除后将不能恢复，你确认要删除吗?',
      onOk: async () => {
        let ids:any = []
        checkRow.value.forEach(v=>{
          if(v.pdid){
            ids.push(v.pdid)
          }
          //let index = tableData.value.indexOf(item=> item.stockNum == v.stockNum)
          //tableData.value.splice(index,1)
        })
        if(ids.length > 0){
          await useRouteApi(delLine, {schemaName: databaseTrue})(ids)
          message.success('删行成功！')
          saveLogData('删除')
          findAllInitialBalance()
        }else{
          message.error("不存在盘点数据,不能删除！")
        }
      },
      onCancel: () => {
        return false
      }
    })
  } else {
    createWarningModal({
      iconType: 'warning',
      title: '编辑',
      content: '请选择一条进行编辑！'
    })
  }
};

const userName = useUserStoreWidthOut().getUserInfo.username
const toAudit = async () => {
  //验证数据完整性
  let da = await checkData(routemsg.value.ccode)
  if(!da){
    message.error("数据异常请刷新页面后操作！")
    return
  }
  if(da.bcheck === '1'){
    message.error("已审核请勿重复审核，请刷新页面后操作！")
    return
  }

  compState.loading = true
  //新增校验
  let date1:any = useCompanyOperateStoreWidthOut().getLoginDate
  //  1 日期是否已结账
  let temp=await useRouteApi(findByStockPeriodIsClose, {schemaName: databaseTrue})({iyear:date1.split('-')[0],month:date1.split('-')[1]})
  console.log('入库单操作：1--->日期是否已结账-->'+temp)
  if(temp>0){
    compState.loading = false
    return message.error('当前业务日期期间已经结账，不能进行单据新增操作，请取消结账后后重试！！')
  }
  //  2 结账操作
  let jzMethod= await useRouteApi(getByStockBalanceTask, { schemaName: databaseTrue })({iyear:'2022',name:'月末结账',method:'月末结账'})
  console.log('入库单操作：2--->结账操作-->'+jzMethod)
  if(!hasBlank(jzMethod)){
    compState.loading = false
    return message.error('提示：操作员'+jzMethod.caozuoName+'正在对当前账套进行月末结账处理，不能进行单据新增操作，请销后再试！')
  }
  //  3 库子是否锁定-测试
  let taskList = await useRouteApi(findByIyearAndCaozuoModule, { schemaName: databaseTrue })({iyear:'2022',caozuoModule:'stock'})
  let d =  taskList.find(v=>v.functionModule.includes('库'))
  if(!hasBlank(d)){
    compState.loading = false
    return message.error('提示：当前存在库字单据正在进行操作，不能进行单据盘点操作，请销后再试！')
  }

  await useRouteApi(audit,{schemaName: databaseTrue})({
    ccode: routemsg.value.ccode,
    user:userName
  })
  routemsg.value.bcheck = '1'
  saveLogData('审核')
  message.success("操作成功")
  compState.loading = false
  findAllInitialBalance()

}
async function saveLogData(optAction) {
  let logmap={
    loginTime:new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "),
    userId: useUserStoreWidthOut().getUserInfo.username,
    userName: useUserStoreWidthOut().getUserInfo.realName,
    optModule:'stock',
    optFunction:'盘点单',
    uniqueCode:formItems.value?.ccode,
    optAction:optAction,
    accId:databaseTrue.value,
    optContent:'操作内容【盘点单】,单据编号【'+formItems.value?.ccode+'】',
  }
  await saveLog(logmap)
}

const dynamicTenant:any = ref('')
const toAuditBack = async () => {
  //验证数据完整性
  let da = await checkData(routemsg.value.ccode)
  if(!da){
    message.error("数据异常请刷新页面后操作！")
    return
  }
  if(da.bcheck != '1'){
    message.error("未审核不能弃审，请刷新页面后操作！")
    return
  }
  compState.loading = true
  //新增校验
  let date1:any = useCompanyOperateStoreWidthOut().getLoginDate
  //  1 日期是否已结账
  let temp=await useRouteApi(findByStockPeriodIsClose, {schemaName: databaseTrue})({iyear:date1.split('-')[0],month:date1.split('-')[1]})
  console.log('入库单操作：1--->日期是否已结账-->'+temp)
  if(temp>0){
    compState.loading = false
    return message.error('当前业务日期期间已经结账，不能进行单据新增操作，请取消结账后后重试！！')
  }
  //  2 结账操作
  let jzMethod= await useRouteApi(getByStockBalanceTask, { schemaName: databaseTrue })({iyear:'2022',name:'月末结账',method:'月末结账'})
  console.log('入库单操作：2--->结账操作-->'+jzMethod)
  if(!hasBlank(jzMethod)){
    compState.loading = false
    return message.error('提示：操作员'+jzMethod.caozuoName+'正在对当前账套进行月末结账处理，不能进行单据新增操作，请销后再试！')
  }
  //  3 库子是否锁定-测试
  let taskList = await useRouteApi(findByIyearAndCaozuoModule, { schemaName: databaseTrue })({iyear:'2022',caozuoModule:'stock'})
  let d =  taskList.find(v=>v.functionModule.includes('库'))
  if(!hasBlank(d)){
    compState.loading = false
    return message.error('提示：当前存在库字单据正在进行操作，不能进行单据盘点操作，请销后再试！')
  }
  let a = await useRouteApi(auditCheck,{schemaName: databaseTrue})({
    ccode:routemsg.value.ccode,
    rkBcheck: routemsg.value?.kcCgrkCheck,
    ckBcheck:  routemsg.value?.kcXsckCheck,
    type:'qs'
  })
  console.log(a)
  if(!a){
    compState.loading = false
    return message.error('现存量不足不能弃审！！！')
  }
  //判断范围
  await useRouteApi(auditBack,{schemaName: databaseTrue})(routemsg.value.ccode)
  routemsg.value.bcheck = '0'
  saveLogData('弃审')
  message.success("操作成功")
  compState.loading = false
  findAllInitialBalance()

}
const databaseCo=ref('')
const gotoPy = async () => {
  //验证数据完整性
  let d = await checkData(routemsg.value.ccode)
  if(!d){
    message.error("数据异常请刷新页面后操作！")
    return
  }
  if(d.bcheck != '1'){
    message.error("未审核不能进行联查，请刷新页面后重试！")
    return
  }
  let dataBaseInfo=await findByStockAccId(databaseTrue.value.substring(0,databaseTrue.value.length-5))
  databaseCo.value=dataBaseInfo?.coCode
  await closeToFullPaths('/kc-transfer')
  await useRouteApi(findByXyCcode, {schemaName: databaseTrue})({ccode:routemsg.value.ccode,year: '2022',type:'QTRKD'})
    .then((t)=>{
      if(t != '0') {
        //获取下游表的信息
        setTimeout(()=>{
          router.push({path: 'kc-qtDepot',query: {type:'info',ccode:t,co: databaseCo.value}});
        },1000)
      }else{
        message.error("不存在其他入库单")
      }
    })
}

const gotoPk = async () => {
  //验证数据完整性
  let d = await checkData(routemsg.value.ccode)
  if(!d){
    message.error("数据异常请刷新页面后操作！")
    return
  }
  if(d.bcheck != '1'){
    message.error("未审核不能进行联查，请刷新页面后重试！")
    return
  }
  let dataBaseInfo=await findByStockAccId(databaseTrue.value.substring(0,databaseTrue.value.length-5))
  databaseCo.value=dataBaseInfo?.coCode
  await closeToFullPaths('/kc-transfer')
  await useRouteApi(findByXyCcode, {schemaName: databaseTrue})({ccode:routemsg.value.ccode,year: '2022',type:'QTCKD'})
    .then((t)=>{
      if(t != '0') {
        //获取下游表的信息
        setTimeout(()=>{
          router.push({path: 'kc-out-qtDepot',query: {type:'info',ccode:t,co: databaseCo.value}});
        },1000)
      }else{
        message.error("不存在其他出库单")
      }
    })
}

async function checkData(ccode) {
  let d = await useRouteApi(getDataInfo, {schemaName: databaseTrue})(ccode)
  return d
}
const exportExcelNow = async () => {
  const data = JSON.parse(JSON.stringify(getDataSource()))
  const columns = getColumns()
  columns.splice(0,1);
  //筛选条件

  const title = [
    "单号: "+ routemsg.value.ccode +"   仓库："+ routemsg.value.cname +"   范围："+ fomartStyle(routemsg.value.bstyle) +"   状态：已审核 ",
  ]
  if(pageParameter.queryMark === 'J'){
    for (let i = 0; i < 6; i++) {
      title.push('')
    }
  }else if(pageParameter.queryMark === 'SJ'){
    for (let i = 0; i < 10; i++) {
      title.push('')
    }
  }else if(pageParameter.queryMark === 'WJ'){
    for (let i = 0; i < 10; i++) {
      title.push('')
    }
  }else if(pageParameter.queryMark === 'SWJ'){
    for (let i = 0; i < 14; i++) {
      title.push('')
    }
  }

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
      },
    },
    {
      cell: 'A2',
      font: {
        sz: 12,
        color: { rgb: "000000" },
      },
      fill: {
        fgColor: { rgb: "ffffff" },
      },
    },
  ]
  const cell = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
  let flg = 0;
  columns.forEach((v,index)=>{
      multiHeader[0].push(v.title)
      multiHeader[1].push('')
      keys.push(v.dataIndex)
      //合并上下单元格
      merges.push('`' + cell[flg] + '3:' + cell[flg] +'4`');
      flg = flg + 1
  })

  //数量金额格式化调整
  let fdata = data.filter(v=> v.invCode != null)
  fdata.forEach(v=>{
    v.cunitidF1 = formatCunitid(v.rate1,v.fnames1)
    v.cunitidF2 = formatCunitid(v.rate2,v.fnames2)
    v.baseQuantity = v.bq != null ? money(v.bq) : money(v.baseQuantity)
    v.subQuantity1 = v.sq1 != null ? money(v.sq1) : money(v.subQuantity1)
    v.subQuantity2 = v.sq2 != null ? money(v.sq2) : money(v.subQuantity2)
    v.quantityUk = money(v.quantityPd - v.bq)
    v.quantityUk1 = money(v.subPandian1 - v.sq1)
    v.quantityUk2 = money(v.subPandian2 - v.sq2)
    v.quantityPd = money(v.quantityPd)
    v.subPandian1 = money(v.subPandian1)
    v.subPandian2 = money(v.subPandian2)
    v.cunitid = v.cunitid != null ? formatUnit(v) !=null ? formatUnit(v) : " " : " "
    v.batchId = v.batchId != null ? v.batchId : " "
    v.dpdate = v.dpdate != null ? v.dpdate : " "
    v.dvdate = v.dvdate != null ? v.dvdate : " "
  })
  //样式靠右列
  let rightrow=[]
  //样式靠左列
  let leftrow=[]
  if(pageParameter.queryMark === 'J'){
    rightrow=['C','D','F']
  }else if(pageParameter.queryMark === 'SJ'){
    rightrow=['E','G','J']

  }else if(pageParameter.queryMark === 'WJ'){
    rightrow=['D','E','F','G','I','J']

  }else{
    rightrow=['F','G','I','J','O','M','N']
  }

  const sheet =[
    {
      title: '盘点单',
      tHeader: title,
      multiHeader: multiHeader,
      table: fdata,
      keys: keys,
      merges: merges,
      sheetName: routemsg.value.ccode,
      cellStyle: cellStyle,
      rightrow:rightrow,
      leftrow:leftrow,
    },
  ]
  let name = pageParameter.companyName
  exportExcel(sheet, 'xlsx',name+'-盘点单')
}


const [registerPrintPage, {openModal: openPrintPage}] = useModal()

const openPrint = () => {
  openPrintPage(true, {
    data: {
      dynamicTenantId: database.value,
      defaultAdName: useCompanyOperateStoreWidthOut().getSchemaName,
      year: '2022',
    }
  })
}
import {useNewPrint} from "/@/utils/boozsoft/print/print";
import {tableStyle} from "/@/store/modules/abc-print";
import {saveLog} from "/@/api/record/system/group-sys-login-log";
import {findByStockPeriodIsClose} from "/@/api/record/stock/stock-ruku";
import {findByIyearAndCaozuoModule, getByStockBalanceTask} from "/@/api/record/stock/stock_balance";
import {findByStockAccId} from "/@/api/record/system/stock-account";
import {getCkPriceList} from "/@/api/record/stock/stock_cost";

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
  loading.value = true
  openCompFullLoading()
  const data = JSON.parse(JSON.stringify(getDataSource()))
  let printList: any = []
  let printUser = ''
  if(obj.printUser){
    printUser = '制单人：' + userName
  }
  let printBz = '仓库：'+ routemsg.value.cname

  let printKm = '盘点单号: '+routemsg.value.ccode

  let title = '盘点单'

  //格式化数据
  let fdata = data.filter(v=> v.stockNum != null)
  fdata.forEach((item,index) => {
    let item1 = {}
    item1[0] = item.stockNum
    item1[1] = item.stockNum != null && item.stockName.length > 6 ? item.stockName.substring(0,7) :item.stockName
    item1[2] = item.stockGgxh
    item1[3] = item.batchId
    item1[4] = item.cunitid != null ? formatUnit(item) !=null ? formatUnit(item) : " " : " "
    item1[5] = item.bq != null ? money(item.bq) : money(item.baseQuantity)
    item1[7] = formatCunitid(item.rate1,item.fnames1)
    item1[8] = item.sq1 != null ? money(item.sq1) : money(item.subQuantity1)
    item1[10] = formatCunitid(item.rate2,item.fnames2)
    item1[11] = item.sq2 != null ? money(item.sq2) : money(item.subQuantity2)
    if(obj.printFlg == '1'){
      item1[6] = money(item.quantityPd)
      item1[9] = money(item.subPandian1)
      item1[12] = money(item.subPandian2)
      item1[13] = money(item.quantityPd - item.bq)
      item1[14] = money(item.subPandian1 - item.sq1)
      item1[15] = money(item.subPandian2 - item.sq2)
    }else{
      item1[6]  = ''
      item1[9]  = ''
      item1[12] = ''
      item1[13] = ''
      item1[14] = ''
      item1[15] = ''
    }

    printList.push(item1)
  })
  for (let i=0; i<printList.length%25; i++){
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
    item1[10] =''
    item1[11] =''
    item1[12] =''
    item1[13] =''
    item1[14] =''
    item1[15] =''
    printList.push(item1)
  }
  let num = Math.ceil(printList.length/25)

  useNewPrint({data: ['l', 'px', 'a4', true]}, (doc) => {
      doc.autoTable({
        head: [['', '','', '', '', '', title, '', '', '', '','', '','', '',''],
          [printKm, '', '','','','',  ''+routemsg.value.activityDate,'', '', '', '', '','','盘点范围:'+fomartStyle(routemsg.value.bstyle),'',''],
          [printBz, '', '','','','', '盘点部门:'+routemsg.value.dname, '', '', '','', '','','盘点人:'+routemsg.value.puname,'',''],
          ['存货编码', '存货名称', '规格型号', '批次', '主计量', '账面数量',
            '盘点数量','计量1', '盘点数1','账面数1','计量2','账面数2','盘点数2','盈亏数量','盈亏数1','盈亏数2']],
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
          doc.autoTableText(
            '库管员：' + routemsg.value.kuname,
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
            if (data.column.index == 6) {
              data.cell.colSpan = 3
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
            } else if (data.column.index == 6) {
              data.cell.colSpan = 3
              data.cell.styles.halign = 'center'
            } else if (data.column.index == 13) {
              data.cell.colSpan = 7
              data.cell.styles.halign = 'right'
            } else {
              data.cell.styles.halign = 'right'
            }
          }
          if (data.section == 'head' && data.row.index == 2) {
            data.cell.styles.fontSize = 10
            data.cell.styles.fontStyle = 'bold'
            data.cell.styles.lineColor = [255, 255, 255]
            if (data.column.index == 0) {
              data.cell.colSpan = 2
              data.cell.styles.halign = 'left'
            } else if (data.column.index == 6) {
              data.cell.colSpan = 3
              data.cell.styles.halign = 'center'
            } else if (data.column.index == 13) {
              data.cell.colSpan = 5
              data.cell.styles.halign = 'right'
            } else {
              data.cell.styles.halign = 'right'
            }
          }
          if (data.section == 'head' && data.row.index == 3) {
            data.cell.styles.fontSize = 9
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
          0: {maxHeight: 10,cellWidth: 40, halign: 'left'},
          1: {cellWidth: 70, halign: 'left'},
          2: {cellWidth: 35, halign: 'left'},
          3: {cellWidth: 35, halign: 'left'},
          4: {cellWidth: 27, halign: 'center'},
          5: {cellWidth: 35, halign: 'right'},
          6: {cellWidth: 35, halign: 'right'},
          7: {cellWidth: 27, halign: 'center'},
          8: {cellWidth: 35, halign: 'right'},
          9: {cellWidth: 35, halign: 'right'},
          10: {cellWidth: 27, halign: 'center'},
          11: {cellWidth: 35, halign: 'right'},
          12: {cellWidth: 35, halign: 'right'},
          13: {cellWidth: 35, halign: 'right'},
          14: {cellWidth: 35, halign: 'right'},
          15: {cellWidth: 35, halign: 'right'},

        }
      })
    loading.value = false
    })

}


const openExcel = async(obj) => {
  //验证数据完整性 
  let d = await checkData(routemsg.value.ccode)
  if(!d){
    message.error("数据异常请刷新页面后操作！")
    return
  }
  openImprotPage(true, {
    databaseTrue: databaseTrue.value,
    year:'2022',
    pdCode:routemsg.value.ccode,
  })
}

</script>
<style src="./global-menu-index.less" lang="less" scoped></style>
<style scoped lang="less">
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
  padding: 2px 8px !important;
  border-color: #aaaaaa !important;
  height: 25px;
  color: black;
}

.a-table-font-size-12 :deep(td),
.a-table-font-size-12 :deep(th) {
  font-size: 13px !important;
  padding: 2px 8px !important;
  border-color: #aaaaaa !important;
  height: 25px;
  color: black;
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
  margin-top: -6px;
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
    >div:nth-of-type(1){width: 64px;display: inline-block;text-align: center;
      position: inherit
    }
    >div:nth-of-type(2){
      width: calc( 100% - 64px);display: inline-block;
    }
  }
  >div:nth-of-type(2){
    width: 20%;text-align:center;padding-top:8px;
    >div:nth-of-type(2){margin-top: 1px;}
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

:deep(.ant-table-tbody) {
  tr.ant-table-measure-row{
    visibility: collapse !important;
  }
}
:deep(.nc-summary){
  font-weight: bold;
  background-color: #cccccc!important;;
  border-right-color: #cccccc!important;
}
.ap-title {
  font-weight: bold;
  color: #666666;
  margin-left: 1em;
}

.ap-text {
  padding: 7px 10px;
  border-radius: 5px;
  font-weight: bold;
  color: black;

}

</style>


