<template>
  <div>
    <div class="app-container lcr-theme-div">
      <div>
        <div>
          <AccountBookTwoTone style="color: #0096c7;font-size: 50px;"/>
        </div>
        <div> <AccountPicker theme="three"  @reloadTable="dynamicAdReload"/></div>
      </div>
      <div style="padding-top: 15px;">
        <div>  <b class="noneSpan" style="font-size: 26px;color: #0096c7;">销售价格表</b></div>
      </div>
      <div>
        <div>
          <Button type="button"
                  class="ant-btn ant-btn-me"
                  @click="addPage()">添加
          </Button>
          <Button type="button"
                  class="ant-btn ant-btn-me"
                  @click="clearData()">清空
          </Button>
          <Button type="button"
                  class="ant-btn ant-btn-me"
                  @click="importPop()">导入
          </Button>
          <Button type="button"
                  class="ant-btn ant-btn-me"
                  @click="exportexcel()">导出
          </Button>
          <Button type="button"
                  class="ant-btn ant-btn-me"
                  @click="closeCurrent()">退出
          </Button>
        </div>
        <div>
          <a-select v-model:value="selectSearchValue" class="acttdrd-search-select"
                    @change="selectSearch2">
            <a-select-option value="ccode">存货编码</a-select-option>
            <a-select-option value="ccodeName">存货名称</a-select-option>
          </a-select>
          <a-input-search placeholder="" v-model:value="inputsearchtext"
                          class="acttdrd-search-input" @search="selectSearch"/>

            <Button class="acttdrd-btn" @click="findAllInitialBalance(),findByAccStyleAll()">
              <SyncOutlined :style="{ fontSize: '14px' }"/>
            </Button>
            <a-popover placement="bottom">
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
                          <div class="editable-cell" :disabled="record.disabled">
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
                          <div class="editable-cell" :disabled="record.disabled">
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
                                         :disabled="record.disabled">
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
              <Button class="acttdrd-btn">
                <SettingFilled :style="{ fontSize: '14px' }"/>
              </Button>
            </a-popover>
        </div>
      </div>
    </div>
    <div class="bg-white" :style="{height: (windowHeight)+'px',marginLeft:'10px',display: 'inline',width: showCatalog?'280px':'20px',float: 'left',marginTop: '5px',overflow:showCatalog?'auto':'hidden',overflowY:'hidden'}" >
      <div style="width: 100%; height: 32px;background-color: #d9d9d9;padding-top:5px;font-weight: bold;text-align: center;">
        存货分类
        <div style="float: right;">
          <a style="color: black;font-size: 14px;" @click="openAddPage()"><PlusCircleTwoTone /></a>&emsp;
        </div>
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
    </div>
    <div class="app-container-bottom" :style="{height: (windowHeight)+'px',display: 'inline',width: showCatalog?'calc( 100% - 295px )':'calc( 100% - 22px )',float: 'right',marginTop: '5px'}">
      <BasicTable
        ref="tableRef"
        :row-selection="{ type: 'checkbox', selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
        :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
        :columns="tableColumns"
        :scroll="{ x: totalColumnWidth,y: pageParameter.queryMark=='1'?(windowHeight-10):(windowHeight-40) }"
        :dataSource="tableData"
        :loading="loading"
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
          <a @click="openSelectContent(record)"><span style="color: #0096c7;"  class="a-table-font-arial" >{{record.stockNum }}</span></a>
        </template>
        <template #stockName="{ record }">
          <a @click="openSelectContent(record)"><span style="color: #0096c7;"  class="a-table-font-arial" >{{record.stockName }}</span></a>
        </template>
        <template #memberprice="{ record }">
          <template v-if="record.roweditflg">
              <a-input-number v-model:value="record.memberprice"
                              :formatter="value =>`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value =>`${value}`.replace(/\$\s?|(,*)/g,'')"
                               :precision="10" style="width: 85%;margin: -5px 0"

                              @keyup.enter="record.memberpriceEdit = null;dbSave(record)"/>
              <CheckOutlined @click="record.memberpriceEdit = null;dbSave(record)"/>

          </template>
          <template v-else>
            <span class="a-table-font-arial" :style="(record.memberprice < 0 )?{color: 'red'}:{}">{{
                record.memberprice == 0 ? '' : money(record.memberprice)
              }}</span>
          </template>
        </template>
        <template #regularPrice="{ record }">
          <template v-if="record.roweditflg">
              <a-input-number v-model:value="record.regularPrice"
                              :formatter="value =>`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value =>`${value}`.replace(/\$\s?|(,*)/g,'')"
                               :precision="10" style="width: 85%;margin: -5px 0"
                              @keyup.enter="record.regularPriceEdit = null;dbSave(record)"/>
              <CheckOutlined @click="record.regularPriceEdit = null;dbSave(record)"/>
          </template>
          <template v-else>
            <span class="a-table-font-arial" :style="(record.regularPrice < 0 )?{color: 'red'}:{}">{{
                record.regularPrice == 0 ? '' : money(record.regularPrice)
              }}</span>
          </template>
        </template>
        <template #minPrice="{ record }">
          <template v-if="record.roweditflg">
              <a-input-number v-model:value="record.minPrice"
                              :formatter="value =>`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value =>`${value}`.replace(/\$\s?|(,*)/g,'')"
                               :precision="10" style="width: 85%;margin: -5px 0"
                              @keyup.enter="record.minPriceEdit = null;dbSave(record)"/>
              <CheckOutlined @click="record.minPriceEdit = null;dbSave(record)"/>
          </template>
          <template v-else>
            <span class="a-table-font-arial" :style="(record.minPrice < 0 )?{color: 'red'}:{}">{{
                record.minPrice == 0 ? '' : money(record.minPrice)
              }}</span>
          </template>
        </template>
        <template #maxPrice="{ record }">
          <template v-if="record.roweditflg">
              <a-input-number v-model:value="record.maxPrice"
                              :formatter="value =>`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value =>`${value}`.replace(/\$\s?|(,*)/g,'')"
                               :precision="10" style="width: 85%;margin: -5px 0"

                              @keyup.enter="record.maxPriceEdit = null;dbSave(record)"/>
              <CheckOutlined @click="record.maxPriceEdit = null;dbSave(record)"/>

          </template>
          <template v-else>
            <span class="a-table-font-arial" :style="(record.maxPrice < 0 )?{color: 'red'}:{}">{{
                record.maxPrice == 0 ? '' : money(record.maxPrice)
              }}</span>
          </template>
        </template>
        <template #invscost1="{ record }">
          <template v-if="record.roweditflg">
              <a-input-number v-model:value="record.invscost1"
                              :formatter="value =>`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value =>`${value}`.replace(/\$\s?|(,*)/g,'')"
                               :precision="10" style="width: 85%;margin: -5px 0"

                              @keyup.enter="record.invscost1Edit = null;dbSave(record)"/>
              <CheckOutlined @click="record.invscost1Edit = null;dbSave(record)"/>

          </template>
          <template v-else>
            <span class="a-table-font-arial" :style="(record.invscost1 < 0 )?{color: 'red'}:{}">{{
                record.invscost1 == 0 ? '' : money(record.invscost1)
              }}</span>
          </template>
        </template>
        <template #invscost2="{ record }">
          <template v-if="record.roweditflg">
              <a-input-number v-model:value="record.invscost2"
                              :formatter="value =>`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value =>`${value}`.replace(/\$\s?|(,*)/g,'')"
                               :precision="10" style="width: 85%;margin: -5px 0"

                              @keyup.enter="record.invscost2Edit = null;dbSave(record)"/>
              <CheckOutlined @click="record.invscost2Edit = null;dbSave(record)"/>

          </template>
          <template v-else>
            <span class="a-table-font-arial" :style="(record.invscost2 < 0 )?{color: 'red'}:{}">{{
                record.invscost2 == 0 ? '' : money(record.invscost2)
              }}</span>
          </template>
        </template>
        <template #invscost3="{ record }">
          <template v-if="record.roweditflg">
              <a-input-number v-model:value="record.invscost3"
                              :formatter="value =>`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value =>`${value}`.replace(/\$\s?|(,*)/g,'')"
                               :precision="10" style="width: 85%;margin: -5px 0"

                              @keyup.enter="record.invscost3Edit = null;dbSave(record)"/>
              <CheckOutlined @click="record.invscost3Edit = null;dbSave(record)"/>

          </template>
          <template v-else>
            <span class="a-table-font-arial" :style="(record.invscost3 < 0 )?{color: 'red'}:{}">{{
                record.invscost3 == 0 ? '' : money(record.invscost3)
              }}</span>
          </template>
        </template>
        <template #invscost4="{ record }">
          <template v-if="record.roweditflg">
              <a-input-number v-model:value="record.invscost4"
                              :formatter="value =>`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value =>`${value}`.replace(/\$\s?|(,*)/g,'')"
                               :precision="10" style="width: 85%;margin: -5px 0"

                              @keyup.enter="record.invscost4Edit = null;dbSave(record)"/>
              <CheckOutlined @click="record.invscost4Edit = null;dbSave(record)"/>

          </template>
          <template v-else>
            <span class="a-table-font-arial" :style="(record.invscost4 < 0 )?{color: 'red'}:{}">{{
                record.invscost4 == 0 ? '' : money(record.invscost4)
              }}</span>
          </template>
        </template>
        <template #invscost5="{ record }">
          <template v-if="record.roweditflg">
              <a-input-number v-model:value="record.invscost5"
                              :formatter="value =>`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value =>`${value}`.replace(/\$\s?|(,*)/g,'')"
                               :precision="10" style="width: 85%;margin: -5px 0"

                              @keyup.enter="record.invscost5Edit = null;dbSave(record)"/>
              <CheckOutlined @click="record.invscost5Edit = null;dbSave(record)"/>

          </template>
          <template v-else>
            <span class="a-table-font-arial" :style="(record.invscost5 < 0 )?{color: 'red'}:{}">{{
                record.invscost5 == 0 ? '' : money(record.invscost5)
              }}</span>
          </template>
        </template>
        <template #invscost6="{ record }">
          <template v-if="record.roweditflg">
              <a-input-number v-model:value="record.invscost6"
                              :formatter="value =>`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value =>`${value}`.replace(/\$\s?|(,*)/g,'')"
                               :precision="10" style="width: 85%;margin: -5px 0"

                              @keyup.enter="record.invscost6Edit = null;dbSave(record)"/>
              <CheckOutlined @click="record.invscost6Edit = null;dbSave(record)"/>

          </template>
          <template v-else>
            <span class="a-table-font-arial" :style="(record.invscost6 < 0 )?{color: 'red'}:{}">{{
                record.invscost6 == 0 ? '' : money(record.invscost6)
              }}</span>
          </template>
        </template>
        <template #invscost7="{ record }">
          <template v-if="record.roweditflg">
              <a-input-number v-model:value="record.invscost7"
                              :formatter="value =>`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value =>`${value}`.replace(/\$\s?|(,*)/g,'')"
                               :precision="10" style="width: 85%;margin: -5px 0"

                              @keyup.enter="record.invscost7Edit = null;dbSave(record)"/>
              <CheckOutlined @click="record.invscost7Edit = null;dbSave(record)"/>

          </template>
          <template v-else>
            <span class="a-table-font-arial" :style="(record.invscost7 < 0 )?{color: 'red'}:{}">{{
                record.invscost7 == 0 ? '' : money(record.invscost7)
              }}</span>
          </template>
        </template>
        <template #invscost8="{ record }">
          <template v-if="record.roweditflg">
              <a-input-number v-model:value="record.invscost8"
                              :formatter="value =>`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value =>`${value}`.replace(/\$\s?|(,*)/g,'')"
                               :precision="10" style="width: 85%;margin: -5px 0"

                              @keyup.enter="record.invscost8Edit = null;dbSave(record)"/>
              <CheckOutlined @click="record.invscost8Edit = null;dbSave(record)"/>

          </template>
          <template v-else>
            <span class="a-table-font-arial" :style="(record.invscost8 < 0 )?{color: 'red'}:{}">{{
                record.invscost8 == 0 ? '' : money(record.invscost8)
              }}</span>
          </template>
        </template>
        <template #newPrice="{ record }">
          <template v-if="record.roweditflg">
              <a-input-number v-model:value="record.newPrice"
                              :formatter="value =>`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value =>`${value}`.replace(/\$\s?|(,*)/g,'')"
                              :precision="10" style="width: 85%;margin: -5px 0"
                              @keyup.enter="record.newPriceEdit = null;dbSave(record)"/>
              <CheckOutlined @click="record.newPriceEdit = null;dbSave(record)"/>

          </template>
          <template v-else>
            <span class="a-table-font-arial" :style="(record.newPrice < 0 )?{color: 'red'}:{}">{{
                record.newPrice == 0 ? '' : money(record.newPrice)
              }}</span>
          </template>
        </template>
        <template #stockMarketUnit="{ record }">
             <span>{{ formatUnit(record) }}</span>
        </template>
      </BasicTable>


      <ImprotExcel @save="reloadProjects" @register="registerImportPage"/>
      <ThisEdit @register="registerEditPage" @save="findAllInitialBalance" :placement="'top'" :database="databaseTrue"></ThisEdit>
      <Edit @throwData="loadPage" @register="registerEditPage"/>
      <div style="position: absolute; bottom: -8.5%; right: 15%;font-size: 13px; color: black;z-index: 99999999;">
        {{`共 ${paginationNumber} 条记录   &nbsp;&nbsp;每页 1000 条`}}
      </div>
    </div>

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
  SearchOutlined,
  PrinterOutlined,ProfileOutlined,AccountBookTwoTone,
  UsbOutlined,ShrinkOutlined,ArrowsAltOutlined
} from '@ant-design/icons-vue';
import {BasicTable, useTable} from '/@/components/Table';
import Edit from './popup/edit.vue'

import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
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
  Statistic as AStatistic, Modal as AModal,
  Drawer as ADrawer, Collapse, message, Divider, Button, Progress
} from "ant-design-vue"
import { BasicTree } from '/@/components/Tree';
import {useModal} from '/@/components/Modal';
import {
  saveSubjectInitialBalance,
  delInitalBalance,
  emptyAll,
} from '/@/api/subjectInitialBalance/subjectInitialBalance';

import {
  findAll, findListByTypeAndId, savePrice,saveMx
} from '/@/api/record/stock/stock-price';
import {onMounted, ref, reactive} from 'vue';
import ImprotExcel from './popup/improtExcel.vue';
import {aoaToSheetXlsx, jsonToSheetXlsx} from '/@/components/Excel';
import {useUserStore, useUserStoreWidthOut} from '/@/store/modules/user';
import {
  countByTaskId,delFunctionModule,
  getCurrentAccountName,
  hasBlank
} from "/@/api/task-api/tast-bus-api";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {findByAccId, findDataBase} from "/@/api/record/system/account";

import {
  getStockClassTree,improtExcel,clearList
} from "/@/api/record/stock/stock-price";

import {onBeforeRouteLeave} from "vue-router";
import {
  assemblyDynamicColumn,
  combineParameters,
  initDynamics
} from "/@/views/boozsoft/stock/stock_price/data";
import {findDbLanMuList, saveLanMuList} from "/@/api/record/system/accvoucher";
import {cloneDeep} from "lodash-es";
import {useMessage} from "/@/hooks/web/useMessage";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {columnProps} from "ant-design-vue/es/table/interface";

const dataSourceTable:any =ref([]);
const columns = [];
const ARangePicker = ADatePicker.RangePicker
const ASelectOption = ASelect.Option
const AInputSearch = AInput.Search
const ARadioGroup = ARadio.Group
const ARadioButton = ARadio.Button
const CollapsePanel = Collapse.Panel
const AStatisticCountdown = AStatistic.Countdown;
const paginationNumber = ref(0)
const {closeCurrent} = useTabs(router);
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
    align: "left",
    fixed: 'left',
    slots: {customRender: "stockName"}
  },
  {
    title: "规格型号",
    dataIndex: "stockGgxh",
    fixed: 'left',
    align: "left"
  },
  {
    title: "主计量",
    dataIndex: "uname",
    align: "left",
    fixed: 'left',
    slots: {customRender: "uname"},
  },
  {
    title: "协议价",
    dataIndex: "memberprice",
    slots: {customRender: "memberprice"},
  },
  {
    title: "零售价",
    dataIndex: "regularPrice",
    slots: {customRender: "regularPrice"},
  },
  {
    title: "最低价",
    dataIndex: "minPrice",
    slots: {customRender: "minPrice"},
  },
  {
    title: "最高价",
    dataIndex: "maxPrice",
    slots: {customRender: "maxPrice"},
  },
  {
    title: "一级客户价",
    dataIndex: "invscost1",
    slots: {customRender: "invscost1"},
  },
  {
    title: "二级客户价",
    dataIndex: "invscost2",
    slots: {customRender: "invscost2"},
  },
  {
    title: "三级客户价",
    dataIndex: "invscost3",
    slots: {customRender: "invscost3"},
  },
  {
    title: "四级客户价",
    dataIndex: "invscost4",
    slots: {customRender: "invscost4"},
  },
  {
    title: "五级客户价",
    dataIndex: "invscost5",
    slots: {customRender: "invscost5"},
  },
  {
    title: "六级客户价",
    dataIndex: "invscost6",
    slots: {customRender: "invscost6"},
  },
  {
    title: "七级客户价",
    dataIndex: "invscost7",
    slots: {customRender: "invscost7"},
  },
  {
    title: "八级客户价",
    dataIndex: "invscost8",
    slots: {customRender: "invscost8"},
  },
  {
    title: "最新进价",
    dataIndex: "newPrice",
    slots: {customRender: "newPrice"},
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

const tableRef = ref(null)
const windowWidth = (document.documentElement.clientWidth - 70)
const windowHeight = (window.innerHeight - 300)
const totalColumnWidth = ref(0)
const [registerTable, {
  reload,
  setColumns,
  getDataSource,
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
  let all = tableDataAll.value
  if (selectSearchValue.value === 'ccode') {
    tableData.value = all.filter((a) => !hasBlank(a.stockNum) && a.stockNum.indexOf(inputsearchtext.value) !== -1);
  }
  if (selectSearchValue.value === 'ccodeName') {
    tableData.value = all.filter((a) => !hasBlank(a.stockName) && a.stockName.indexOf(inputsearchtext.value) !== -1);
  }
  paginationNumber.value = tableData.value.length;
  if(tableData.value.length < 50){
    for (let i = tableData.value.length ; i < 50 ; i++) {
      tableData.value.push({})
    }
  }
  setTableData(tableData.value)
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



// 导出excel
function exportexcel() {
  var list = [];
  for (let i = 0; i < tableDataAll.value.length; i++) {
    if(tableDataAll.value[i].ccode !=null){
     // 所有末级科目
      list.push({
        ccode: tableDataAll.value[i].ccode,
        stockNum: tableDataAll.value[i].stockNum,
        stockName: tableDataAll.value[i].stockName,
        stockGgxh: tableDataAll.value[i].stockGgxh,
        uname: tableDataAll.value[i].uname,
        memberprice: money(tableDataAll.value[i].memberprice) == '0.00'? '': money(tableDataAll.value[i].memberprice),
        regularPrice: money(tableDataAll.value[i].regularPrice)== '0.00'? '': money(tableDataAll.value[i].regularPrice),
        minPrice: money(tableDataAll.value[i].minPrice)== '0.00'? '': money(tableDataAll.value[i].minPrice),
        maxPrice: money(tableDataAll.value[i].maxPrice)== '0.00'? '': money(tableDataAll.value[i].maxPrice),
        invscost1: money(tableDataAll.value[i].invscost1)== '0.00'? '': money(tableDataAll.value[i].invscost1),
        invscost2: money(tableDataAll.value[i].invscost2)== '0.00'? '': money(tableDataAll.value[i].invscost2),
        invscost3: money(tableDataAll.value[i].invscost3)== '0.00'? '': money(tableDataAll.value[i].invscost3),
        invscost4: money(tableDataAll.value[i].invscost4)== '0.00'? '': money(tableDataAll.value[i].invscost4),
        invscost5: money(tableDataAll.value[i].invscost5)== '0.00'? '': money(tableDataAll.value[i].invscost5),
        invscost6: money(tableDataAll.value[i].invscost6)== '0.00'? '': money(tableDataAll.value[i].invscost6),
        invscost7: money(tableDataAll.value[i].invscost7)== '0.00'? '': money(tableDataAll.value[i].invscost7),
        invscost8: money(tableDataAll.value[i].invscost8)== '0.00'? '': money(tableDataAll.value[i].invscost8),
      });
    }

  }

  jsonToSheetXlsx({
    data: list,
    header: {
      stockNum: '存货编码',
      stockName: '存货名称',
      stockGgxh: '规格型号',
      uname: '主计量',
      memberprice: '协议价',
      regularPrice: '零售价',
      minPrice: '最低价',
      maxPrice: '最高价',
      invscost1: '一级客户价',
      invscost2: '二级客户价',
      invscost3: '三级客户价',
      invscost4: '四级客户价',
      invscost5: '五级客户价',
      invscost6: '六级客户价',
      invscost7: '七级客户价',
      invscost8: '八级客户价',
    },
    //销售价格表_账套名称.xlsx
    filename: '销售价格表_'+ companyName.value +'.xlsx',
  });
}

// 导入弹框
const importPop = (type) => {
  openImprotPage(true, {
    dynamicTenantId: databaseTrue.value,
  });

};

async function reloadProjects(data) {
  console.log(data)
  await useRouteApi(improtExcel, {schemaName: databaseTrue.value})(data)
    .then(v=>{
      console.log('导入成功');
      findAllInitialBalance();
    })

}
type Key = columnProps['id'];

const state = reactive<{
  selectedRowKeys: Key[];
  loading: boolean;
}>({
  selectedRowKeys: [], // Check here to configure the default column
  loading: false,
});
const checkRow: any = ref([])
const onSelectChange = (selectedRowKeys, row) => {
  // console.log('selectedRowKeys changed: ', row);
  state.selectedRowKeys = selectedRowKeys;
  checkRow.value = row
};
const clearData = async() => {
  //清空
  if (checkRow.value.length > 0) {
    createConfirm({
      iconType: 'error',
      title: '警告',
      content: '你确认要清空吗?',
      onOk: async () => {
        let item = []
        for (let i = 0; i < checkRow.value.length; i++) {
          if(checkRow.value[i].id){
            item.push(checkRow.value[i].id)
          }
        }

        await useRouteApi(clearList, {schemaName: databaseTrue.value})(item)

        message.success('清空成功！')
        checkRow.value = []
        findAllInitialBalance();
      },
      onCancel: () => {
        return false
      }
    })
  } else {
    createWarningModal({
      iconType: 'warning',
      title: '清空',
      content: '请选择需要清空的内容！'
    })
  }
};
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

// 获取list
const findAllInitialBalance = async () => {

  tableData.value = []
  tableDataAll.value = []
  loading.value = true;
  const a = await useRouteApi(findAll, {schemaName: databaseTrue.value})({
    stockClass: pageParameter.cclass,
  })
  tableDataAll.value = a;
  paginationNumber.value = a.length;
  if(a.length < 30){
    for (let i = a.length ; i < 30 ; i++) {
      a.push({})
    }
  }

  tableData.value = a;
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
  loading.value = false;
};

// 金额格式化
function money(val: any) {
  if (val == null) {
    return  '';
  }
  val = val.toString().replace(/\$|\,\-/g, '');
  if (isNaN(val)) {
    return  '';
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

const companyName = ref('');
const dynamicAdReload = async (obj) => {
  loading.value = true;
  if (taskinfo.value !== ''){
    database.value = obj.accId;
    databaseTrue.value = obj.accountMode;
    iyearselected.value = obj.year;
    companyName.value =  obj.companyName
  }else {
    database.value = obj.accId;
    databaseTrue.value = obj.accountMode;
    iyearselected.value = obj.year;
    companyName.value =  obj.companyName
  }
  resetDynamicColumnData()
  findByAccStyleAll()
  await findAllInitialBalance();
  loading.value = true
  loading.value = false
}

// 获取科目类型
async function findByAccStyleAll() {
  loading2.value = true
  fetch()
}

async function fetch() {
  const deptTree = await useRouteApi(getStockClassTree,{schemaName: databaseTrue})()
  console.log(deptTree)
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
  console.log(obj)
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
    pageParameter.cclass='全部'
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
  'menuName': '存货价格表',
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
    console.log(totalColumnWidth.value)
    tableRef.value.$el.style.setProperty('width', (windowWidth + 62 - f) + 'px')
  } else {
    if (visible.value && (windowWidth - 380) < total) total -= (total - (windowWidth - 380))
    totalColumnWidth.value = total
    tableRef.value.$el.style.setProperty('width', (total + 62) + 'px')
  }
}
/*栏目设置end*/

const dbSave = async (o) => {
  //修改   价格至少有一个不能为空
  await useRouteApi(savePrice,{schemaName: databaseTrue})(o).then(v=>{
    findAllInitialBalance()
    message.success("操作成功！")
  })
}
const dbSave2 = async (o) => {
  console.log(o)
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
  record.roweditflg = false
}

const formatUnit = (record) => {
  let str
  if(record.stockMeasurementType === '单计量'){
    str = record.uname
  }else{
    str = record.unames
  }
  return str
}

const [registerEditPage, {openModal: openEditPage}] = useModal()

const openSelectContent = (record) => {
  console.log(record)
  //弹窗
  openEditPage(true, {
    data: record,
    accId:databaseTrue.value
  })
}
const addPage = (record) => {
  if (checkRow.value.length > 0 && checkRow.value.length < 2) {
    console.log(checkRow.value[0])
    //弹窗
    openEditPage(true, {
      data: checkRow.value[0],
      accId:databaseTrue.value
    })
  } else {
    createWarningModal({
      iconType: 'warning',
      title: '修改',
      content: '请选择一条需要添加的内容！'
    })
  }
}

const loadPage = async (obj) => {
  await useRouteApi(saveMx,{schemaName: databaseTrue})(obj).then(v=>{
    findAllInitialBalance()
    message.success("操作成功！")
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
  margin: 5px 10px;
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

:deep(.vben-basic-table) {
  .ant-table-wrapper {
    .ant-table-tbody {
      tr.ant-table-measure-row{
        visibility: collapse!important;
      }
    }
  }
}
</style>
