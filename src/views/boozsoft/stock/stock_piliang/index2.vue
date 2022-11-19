<template>
  <div class="app-container">
    <div class="app-container-top lcr-theme-div">
      <div>
        <div>
          <CopyOutlined style="color: #0096c7;font-size: 50px;"/>
        </div>
        <div>
          <div><AccountPicker  readonly="" theme="three"/></div>
          <div>
            <span style="font-weight: bold;">&emsp;批量单号：{{saveModel.ccode}}</span>
            <span style="font-weight: bold;color: #666666;">&emsp;仓库：&emsp;</span>
            <Select :options="cangKuList" style="width: 120px" v-model:value="saveModel.cwhcode"/> <PaperClipOutlined
            style=" color: #0096c7;cursor: pointer;  font-weight: bold;margin-left: 1rem;"
            @click="openSelectContent(null,'cwhcode')"/>
          </div>
        </div>
      </div>
      <div>
        <div><span class="acto-d-title-span">批量销货单</span></div>
        <div><span style="color: black;font-weight: bold">单据日期：{{saveModel.ddate}}</span></div>
      </div>
      <div>
        <div>
          <Button class="actod-btn" @click="openQueryPage()">新增</Button>
          <Button class="actod-btn" v-if="status == 1" @click="saveData()">保存</Button>
          <Button class="actod-btn" v-if="status == 1" @click="giveUp()">放弃</Button>
          <Button class="actod-btn">替换</Button>
          <Button class="actod-btn">清空</Button>
          <Button class="actod-btn">删行</Button>
          <Button class="actod-btn">拆分</Button>
          <Button class="actod-btn">导入</Button>
          <Button class="actod-btn actod-btn-last" @click="closeCurrent()">退出</Button>
        </div>
        <div>
          <div class="acttd-right-d-search">
            <Select v-model:value="pageParameter.searchConditon.requirement"
                    class="acttdrd-search-select">
              <template v-for="item in searchConditonList">
                <SelectOption v-if="item.ifShow == true" :value="item.dataIndex">
                  {{ item.title }}
                </SelectOption>
              </template>
            </Select>
            <InputSearch
              class="acttdrd-search-input"
              @search="pageSearch"
              v-model:value="pageParameter.searchConditon.value"
            />
          </div>
          <div class="acttd-right-d-btns">
            <Button class="acttdrd-btn" @click="loadMark=true,pageReload()">
              <SyncOutlined :style="{ fontSize: '14px' }"/>
            </Button>
            <Popover placement="bottom" v-model:visible="lanmuVisible">
              <template #content>
                <DynamicColumn  :defaultData="initDynamics()['DATA']" :dynamicData="dynamicColumnModel" :lanmuInfo="lanMuData" @reload="reloadColumns"/>
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
                <span class="group-btn-span-special"
                      @click="pingzhengExport('curr')">导出当前</span><br/>
                <span class="group-btn-span-special">条件导出</span>
              </template>
              <Button class="acttdrd-btn">
                <UsbOutlined :style="{ fontSize: '14px' }"/>
              </Button>
            </Popover>
            <Popover placement="bottom">
              <template #content>
                <span class="group-btn-span-special" @click="openPrintPage('1')">选择打印</span><br/>
                <span class="group-btn-span-special" @click="openPrintPage('3')">条件打印</span><br/>
                <span class="group-btn-span-special">打印列表</span>
              </template>
              <Button class="acttdrd-btn">
                <PrinterOutlined :style="{ fontSize: '14px' }"/>
              </Button>
            </Popover>
            <Button class="acttdrd-btn"
                    @click="()=>{if (!visible){visible = true;reloadColumns();}return false}">
              <FilterFilled :style="{ fontSize: '14px' }"/>
            </Button>

          </div>
        </div>
      </div>
    </div>

    <div class="app-container-bottom" :style="{height: (windowHeight+56)+'px',marginTop: '5px'}">
      <!--  针对过滤框显示添加的内容高度  -->
      <LeftTree v-if="showTree"  :database="manipulateDbName" @select="treeFilter" @save="openStockSelectOpen"/>
      <div style="display: inline-block;height: 100%; float: left;margin-left: 5px;"
           :style="showTree?{width: 'calc(100% - 320px)'}:{width: '99.8%'}">
        <BasicTable
          ref="tableRef"
          :loading="loadMark"
          :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
          :scroll="{ x: totalColumnWidth,y: (windowHeight - 20) }"
          :row-selection="{ type: 'checkbox',selections:false,selectedRowKeys: tableSelectedRowKeys,onSelect: onSelectChange,onSelectAll: onSelectChange2 }"
          size="small"
          @change="pageChange"
          @register="registerTable"
        >
          <template #cwhcode="{ record }">
            <template v-if="record.editOne">
              <Select
                v-model:value="record.tempOne"
                :default-active-first-option="false"
                :filter-option="false"
                :not-found-content="null"
                :options="cangKuList"
                :show-arrow="false"
                show-search
                style="width: 82%;"
                class="cwhcode"
                @keyup.enter="focusNext($event,record,'cwhcode')">
              </Select>
              <SearchOutlined @click="openSelectContent(record,'cwhcode')"/>
            </template>
            <template v-else>
              <div @click="record.tempOne=record.cwhcode,record.editOne = true;" :class="status == 1 || status == 2?'suspended-div':'status-look'">
                <span class="a-table-font-arial">{{record.cangkuDuli=='1' || record.cangkuDuli == null?
                  (cangKuList.length > 0 ? cangKuList.filter(it => it.id == record.cwhcode)[0]?.ckName : record.cwhcode):
                  record?.cwhcodeInfo?.cangkuName
                  }}</span>
              </div>
            </template>
          </template>
          <template #cvencode="{ record }">
            <template v-if="record.editTwo">
              <Select
                v-model:value="record.tempTwo"
                show-search
                class="cvencode"
                style="width: 82%;"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                :options="khListOptions"
                @search="value=>handleSearch(value,'one')"
                @keyup.enter="focusNext($event,record,'cvencode')"
              ></Select>
              <SearchOutlined @click="openSelectContent(record,'cvencode')"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempTwo=record.cvencode,record.editTwo = true;">
                <span>{{ khListList.filter(it=>it.value == record?.cvencode)[0]?.custName }}</span>
              </div>
            </template>
          </template>
<!--          <template #cvencodeName="{ record }">
            <template v-if="record.editEleven">
              <Select
                v-model:value="record.tempEleven"
                show-search
                style="width: 82%;"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                :options="khListOptions"
                @search="value=>handleSearch(value,'two')"
                @keyup.enter="focusNext($event,record,'cinvode')"
              ></Select>
              <SearchOutlined @click="openSelectContent(record,'cinvode')"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempEleven=record.cvencodeName,record.editEleven = true;">
                <span class="a-table-font-arial">{{ record?.cvencodeName }}</span>
              </div>
            </template>
          </template>-->
          <template #cvencodeJs="{ record }">
            <template v-if="record.editThree">
              <Select
                v-model:value="record.tempThree"
                show-search
                class="cvencodeJs"
                style="width: 82%;"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                :options="khListOptions"
                @search="value=>handleSearch(value,'one')"
                @keyup.enter="focusNext($event,record,'cvencodeJs')"
              ></Select>
              <SearchOutlined @click="openSelectContent(record,'cvencodeJs')"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempThree=record.cvencodeJs,record.editThree = true;">
                <span>{{ khListList.filter(it=>it.value == record?.cvencodeJs)[0]?.custName }}</span>
              </div>
            </template>
          </template>
          <template #xsUnitId="{ record }">
            <template v-if="record?.editCunit ">
              <Select v-model:value="record.tempCunit"
                      class="xsUnitId"
                      :options="record.unitList"
                      style="width: 82%;"
                      @keyup.enter="focusNext(record,'xsUnitId')"/>
              <CheckOutlined @click="record.editCunit = null;record.xsUnitId=record.tempCunit;tableDataChange(record,'xsUnitId')"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'" @click="record.tempCunit=record.xsUnitId,record.oldXsUnitId=record.xsUnitId,record.editCunit = true;">
                <span>{{cunitFormat(record.unitList,record.xsUnitId)}}</span>
              </div>
            </template>
          </template>
          <template #quantity="{ record }">
            <template v-if="record?.editQuantity">
              <InputNumber v-model:value="record.tempQuantity"
                           class="quantity"
                           :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           style="width: 82%;"
                           @keyup.enter="focusNext(record,'quantity')"/>
              <CheckOutlined @click="record.editQuantity = null;record.quantity=record.tempQuantity;tableDataChange(record,'quantity')"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempQuantity=record.quantity,record.beseOld=record.quantity,record.editQuantity = true;">
                    <span class="a-table-font-arial">{{
                        (record.quantity == null ? '' : parseFloat(record.quantity).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }}</span>
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
              <span>{{cunitFormat(record.unitList,record.cunitidF1)}}</span>
            </div>
          </template>
          <template #cunitidF2="{ record }">
            <div v-if="record.cunitType != '1'">
              <span>{{cunitFormat(record.unitList,record.cunitidF2)}}</span>
            </div>
          </template>
          <template #baseQuantity="{ record }">
            <template v-if="record?.editSix">
              <InputNumber v-model:value="record.tempSix"
                           class="baseQuantity"
                           :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           style="width: 82%;"
                           @keyup.enter="focusNext(record,'baseQuantity')"/>
              <CheckOutlined @click="record.editSix = null;record.baseQuantity=record.tempSix;tableDataChange(record,'baseQuantity')"/>
            </template>
            <template v-else>
<!--              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempSix=record.baseQuantity,record.editSix = true;">-->
              <div>
                    <span class="a-table-font-arial">{{
                        (record.baseQuantity == null ? '' : parseFloat(record.baseQuantity).toFixed(xsNumWs) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }}</span>
              </div>
            </template>
          </template>

          <template #subQuantity1="{ record }">
                <template v-if="record?.editSeven">
                 <InputNumber v-model:value="record.tempSeven" class="subQuantity1"
                              :formatter="value => `${value}`.replace(/[^\d]/g, '')"
                              style="width: 82%;"
                              @keyup.enter="focusNext(record,'baseQuantity')"/>
                 <CheckOutlined @click="record.editSeven = null;record.subQuantity1=record.tempSeven;tableDataChange(record,'baseQuantity')"/>
               </template>
               <template v-else>
                 <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                      @click="record.tempSeven=record.subQuantity1,record.editSeven = true;">
                       <span class="a-table-font-arial">{{
                           (record.subQuantity1 == null || record.subQuantity1 == 0? '' : parseFloat(record.subQuantity1).toFixed(xsNumWs) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                         }}
                </span>
                 </div>
               </template>
          </template>
          <template #subQuantity2="{ record }">
               <template v-if="record?.editEight">
                 <InputNumber v-model:value="record.tempEight" class="subQuantity2"
                              :formatter="value => `${value}`.replace(/[^\d]/g, '')"
                              style="width: 82%;"
                              @keyup.enter="focusNext(record,'baseQuantity')"/>
                 <CheckOutlined
                   @click="record.editEight = null;record.subQuantity2=record.tempEight;tableDataChange(record,'baseQuantity')"/>
               </template>
               <template v-else>
                 <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                      @click="record.tempEight=record.subQuantity2,record.editEight = true;">
                      <span class="a-table-font-arial">{{
                          (record.subQuantity2 == null || record.subQuantity2 == 0 ? '' : parseFloat(record.subQuantity2).toFixed(xsNumWs) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        }}
                 </span>
                 </div>
               </template>
          </template>
          <template #itaxprice="{ record }">
            <span class="a-table-font-arial">{{
                (record.itaxprice == null ? '' : parseFloat(record.itaxprice).toFixed(xsRateWs) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }}
             </span>
          </template>
          <template #isum="{ record }">
            <template v-if="record?.editIsum">
              <InputNumber v-model:value="record.tempIsum" class="isum"
                           :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           style="width: 82%;"
                           @keyup.enter="focusNext(record,'isum')"/>
              <CheckOutlined
                @click="record.editIsum = null;record.isum=record.tempIsum;tableDataChange(record,'isum')"/>
            </template>
            <template v-else>
              <div :class="record.isGive ||  status == 3?'status-look':'suspended-div'"
                   @click="record.tempIsum=record.isum,record.editIsum = true;">
          <span class="a-table-font-arial">{{
              (record.isum == null ? '' : parseFloat(record.isum).toFixed(xsPriceWs) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
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
                @click="record.editNine = null;record.price=record.tempNine;tableDataChange(record)"/>
            </template>
            <template v-else>
              <div :class="record.isGive ||  status == 3?'status-look':'suspended-div'"
                   @click="record.tempNine=record.price,record.editNine = true;">
         <span class="a-table-font-arial">{{
             (record.price == null ? '' : parseFloat(record.price).toFixed(xsPriceWs) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
           }}</span>
              </div>
            </template>
          </template>
          <template #taxprice="{ record }">
            <template v-if="record?.editTaxprice">
              <InputNumber v-model:value="record.tempTaxprice" class="taxprice"
                           :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           style="width: 82%;"
                           @keyup.enter="focusNext(record,'taxprice')"/>
              <CheckOutlined
                @click="record.editTaxprice = null;record.taxprice=record.tempTaxprice;tableDataChange(record,'taxprice')"/>
            </template>
            <template v-else>
              <div :class="record.isGive ||  status == 3?'status-look':'suspended-div'"
                   @click="record.tempTaxprice=record.taxprice,record.editTaxprice = true;">
                    <span class="a-table-font-arial">{{
                        (record.taxprice == null ? '' : parseFloat(record.taxprice).toFixed(xsPriceWs) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
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
              (record.icost == null ? '' : parseFloat(record.icost).toFixed(xsPriceWs) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }}</span>
              </div>
            </template>
          </template>
          <template #isGive="{ record }">
            <Switch v-model:checked="record.isGive" :disabled="status == 3" size="small"
                    @change="record.price=0;record.icost=0"/>
          </template>
          <template #batchId="{ record }">
            <template v-if="record?.editTwelve && record.isBatch">
              <Input v-model:value="record.tempTwelve"
                     style="width: 82%;" class="batchId" readonly
                     @keyup.enter="openSelectContent(record,'batchId')">
                <template #suffix>
                  <FileSearchOutlined @click="openSelectContent(record,'batchId')"/>
                </template>
              </Input>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
              @click="record.tempTwelve=record.batchId,record.editTwelve = true;"
               >
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
            <template v-if="record?.editFifteen">
              <DatePicker v-model:value="record.tempFifteen" value-format="YYYY-MM-DD"
                          class="dvdate"
                          format="YYYY-MM-DD" style="width: 82%;"
                          @openChange="(b)=>null!=record.tempFifteen && !b?focusNext(record,'dvdate'):null"/>
              <CheckOutlined @click="record.editFifteen = null;record.dvdate=record.tempFifteen;"/>
            </template>
            <template v-else>
<!--          :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempFifteen=record.dvdate,record.editFifteen = true;"    -->
              <div >
                <span class="a-table-font-arial">{{ record.dvdate }}</span>
              </div>
            </template>
          </template>
          <template #bcheck="{ record }">
            {{ formatUniqueOperator(record.bcheckUser)}}
          </template>

          <template #itaxrate="{ record }">
            <template v-if="record?.editItaxrate">
              <InputNumber v-model:value="record.tempItaxrate" class="itaxrate"
                           :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           style="width: 82%;"
                           @keyup.enter="focusNext(record,'itaxrate')"/>
              <CheckOutlined
                @click="record.editItaxrate = null,record.itaxrate=record.tempItaxrate,tableDataChange(record,'itaxrate')"/>
            </template>
            <template v-else>
              <div :class="record.isGive ||  status == 3?'status-look':'suspended-div'"
                   @click="record.tempItaxrate=record.itaxrate,record.editItaxrate = true;">
                    <span class="a-table-font-arial">{{
                        (record.itaxrate == null ? '' : parseFloat(record.itaxrate).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }}</span>
              </div>
            </template>
          </template>
          <template #summary>
            <TableSummary fixed>
              <TableSummaryRow style="background-color: #cccccc;font-weight: bold;">
                <TableSummaryCell class="nc-summary" :index="0" :align="'center'">合</TableSummaryCell>
                <TableSummaryCell class="nc-summary" :index="1" :align="'center'">计</TableSummaryCell>
                <TableSummaryCell class="nc-summary" v-for="cell in getCurrSummary()"  :index="cell.ind" :align="cell.align" :style="cell.ind==4?{width: (cell.width+'px')}:{}"><span class="a-table-font-arial">{{null == summaryModel[cell.dataIndex]?'':summaryModel[cell.dataIndex].toFixed(2)}}</span></TableSummaryCell>
              </TableSummaryRow>
            </TableSummary>
          </template>
        </BasicTable>
      </div>
    </div>
    <Query
      @save="loadPage"
      @register="registerQueryPage"
    />
    <Print
      @save="pageReload()"
      @log="printLog"
      @register="registerPrintPage"
    />
    <StockCangKuModalPop @register="registerStockCangKuModalPage" @throwData="modalData"/>
    <CustModalPop @throwData="modalData" @register="registerModalPopPage" />
    <BatchSelector @register="registerBatchSelectorPage" @throwData="modalData"/>
    <FileContentSelect
      @save="loadList"
      @register="registerContentPage"
    />
    <Lack @register="registerLackPage" />
  </div>
</template>
<script setup lang="ts">
import {BasicTable, useTable} from '/@/components/Table'
import {useModal} from '/@/components/Modal'
import router from '/@/router';
import StockCangKuModalPop
  from "/@/views/boozsoft/stock/stock_cangku/popup/stockCangKuModalPop.vue";
import  CustModalPop from '/@/views/boozsoft/global/popup/customer_info/modalPop.vue';
import BatchSelector from "/@/views/boozsoft/stock/stock_sales_add/component/BatchNumberSelector.vue";
import Lack from '/@/views/boozsoft/stock/stock_sales_add/popup/lack.vue';
import {
  DatePicker,
  Select,
  Input,
  Popover,
  Radio,
  Popconfirm,
  Table,
  Checkbox,
  message,
  Drawer, Collapse, Tooltip,  Button,Switch,InputNumber
} from "ant-design-vue"

const RangePicker = DatePicker.RangePicker
const SelectOption = Select.Option
const InputSearch = Input.Search
const RadioGroup = Radio.Group
const RadioButton = Radio.Button
const CollapsePanel = Collapse.Panel
const TableSummary = Table.Summary
const TableSummaryRow = TableSummary.Row
const TableSummaryCell = TableSummary.Cell
import {
  SortDescendingOutlined,
  SortAscendingOutlined,
  SettingFilled,
  SyncOutlined,
  PicLeftOutlined,
  FilterFilled,
  CheckOutlined,
  SearchOutlined,
  PrinterOutlined,
  UsbOutlined, EditOutlined,
  ExclamationCircleOutlined, PaperClipOutlined,CopyOutlined,FileSearchOutlined
} from '@ant-design/icons-vue';
import {
  findDbLanMuList,
  saveLanMuList,
  delSpecifyPingZheng
} from '/@/api/record/system/accvoucher'
import {useAccvoucherStore} from '/@/store/modules/accvoucher'
import {
  onMounted,
  reactive,
  ref,
  onActivated,
  computed,
  provide,
  getCurrentInstance,
  nextTick
} from "vue";
import moment, {Moment} from "moment";
import {initDynamics, assemblyDynamicColumn,combineParameters} from "./data";
// import Print from "/@/views/boozsoft/system/accvoucher/popup/print.vue";
const Print=null
import Query from "./popup/query.vue";
import {cloneDeep} from "lodash-es";
import {useMessage} from "/@/hooks/web/useMessage";
import {findByFunctionModule, hasBlank, pointMessage} from "/@/api/task-api/tast-bus-api";
import {useUserStore, useUserStoreWidthOut} from "/@/store/modules/user";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useTabs} from "/@/hooks/web/useTabs";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import DynamicColumn from "/@/views/boozsoft/stock/stock_sales_add/component/DynamicColumn.vue";
import {toThousandFilter} from "/@/views/boozsoft/gdzc/gu-ding-zi-chan-add/calculation";
const {closeCurrent} = useTabs(router);
const {createConfirm, createWarningModal} = useMessage();
// 全局常量
const accvoucherStore = useAccvoucherStore()
// 页面变量
const pageParameter = reactive({
  queryMark: '1',
  showRulesSize: 'MIN',
  condition: {},
  searchConditon: {
    requirement: 'cvencode',
    value: '',
  },
  filterConditon: {
    dateMin: '',
    dateMax: '',
    amountMin: '',
    amountMax: '',
    pzNumberMin: '',
    pzNumberMax: '',
  },
  treeConditon: {
    type: '',
    monthVal: '',
    list: [],
  }
})

const val = ref({
  openOne: 0,
  total: 0
})
const cangKuList = ref([])
const operatorList = ref([])
const stockList = ref([])
const stockAllList = ref([])
const stockXclList = ref([])
const userStore = useUserStore();
const visible = ref(false);

const IsTrue = ref(true);
const status = ref(1);
const searchConditonList = ref([])
const lanMuData = ref({
  'accId': '',
  'menuName': '批量销货单',
  'type': '',
  objects: '',
  username: useUserStoreWidthOut().getUserInfo.username,
  changeNumber:0
})
const lanmuVisible = ref(false);
// 表格参数
const loadMark = ref(false)
const tableSelectedRowKeys = ref([])
const tableSelectedRowObjs = ref([])
const showTree = ref(false)
const windowWidth = computed(() => (document.documentElement.clientWidth - 70 - (showTree.value ? 190 : 0)))
const windowHeight = (window.innerHeight - 290)
const totalColumnWidth = ref(0)
const dynamicTenant = ref({})
const summaryModel = ref({})
const manipulateDbName = ref('')
const unitName = ref('')
const unitCode = ref('')
const collapseValue = ref(['1'])
const CrudApi = reactive({
  columns: [{
    title: '销售客户',
    dataIndex: 'cvencode',
    ellipsis: true,
    slots: {customRender: 'cvencode'}
  }/*,{
    title: '客户名称',
    dataIndex: 'cvencodeName',
    ellipsis: true, slots: {customRender: 'cvencodeName'}
  }*/,{
    title: '结算客户',
    dataIndex: 'cvencodeJs',
    ellipsis: true,
    slots: {customRender: 'cvencodeJs'}
  },/*{
    title: '结算客户名称',
    dataIndex: 'cvencodeJsName',
    ellipsis: true, slots: {customRender: 'cvencodeJsName'}
  },*/{
    title: '存储位置',
    dataIndex: 'cwhcode',
    ellipsis: true,
    slots: {customRender: 'cwhcode'}
  }, {
    title: '计量单位',
    dataIndex: 'xsUnitId',
    ellipsis: true,
    slots: {customRender: 'xsUnitId'},
  },{
    title: '数量',
    dataIndex: 'quantity',
    slots: {customRender: 'quantity'},
    ellipsis: true,
  },{
    title: '主计量',
    dataIndex: 'cunitid',
    ellipsis: true,slots: {customRender: 'cunitid'}
  },   {
    title: '主数量',
    dataIndex: 'baseQuantity',
    ellipsis: true,
    slots: {customRender: 'baseQuantity'}
  },{
    title: '计量一',
    dataIndex: 'cunitidF1',
    ellipsis: true,
    slots: {customRender: 'cunitidF1'}
  },{
    title: '数量一',
    dataIndex: 'subQuantity1',
    ellipsis: true,
    slots: {customRender: 'subQuantity1'}
  },{
    title: '计量二',
    dataIndex: 'cunitidF2',
    ellipsis: true,    slots: {customRender: 'cunitidF2'}
  },{
    title: '数量二',
    dataIndex: 'subQuantity2',
    ellipsis: true,
    slots: {customRender: 'subQuantity2'}
  },{
    title: '税率',
    dataIndex: 'itaxrate',
    ellipsis: true,
    slots: {customRender: 'itaxrate'}
  },{
    title: '无税单价',
    dataIndex: 'price',
    ellipsis: true,
    slots: {customRender: 'price'}
  },{
    title: '含税单价',
    dataIndex: 'taxprice',
    ellipsis: true,
    slots: {customRender: 'taxprice'}
  },{
    title: '无税金额',
    dataIndex: 'icost',
    ellipsis: true,
    slots: {customRender: 'icost'}
  },{
    title: '税额',
    dataIndex: 'itaxprice',
    ellipsis: true,
    slots: {customRender: 'itaxprice'}
  },{
    title: '价税合计',
    dataIndex: 'isum',
    ellipsis: true,
    slots: {customRender: 'isum'}
  },
    {
    title: '赠品',
    dataIndex: 'isGive',
    ellipsis: true,
    slots: {customRender: 'isGive'}
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
      title: '审核人',
      dataIndex: 'bcheck',
      ellipsis: true,
      width: 120,
      slots: {customRender: 'bcheck'},
    },
    {
      title: '备注',
      dataIndex: 'cmemo',
      ellipsis: true,
      width: 120,
      slots: {customRender: 'cmemo'},
    },
    {
      title: '条形码',
      dataIndex: 'bcheck1',
      ellipsis: true,
      width: 120,
    },
    {
      title: '项目',
      dataIndex: 'citemcode',
      ellipsis: true,
      width: 120,
    }
  ]
})
const tableRef = ref(null)
const saveModel = ref({})
const leftTemp = ref('all')
const leftModel = ref({})
const xsNumWs = ref(2)
const xsPriceWs = ref(2)
const xsRateWs = ref(2)
// 组件实例区
const [registerTable, {
  setColumns,
  getColumns,
  getDataSource,
  setTableData,
  setPagination,
  getPaginationRef
}] = useTable({
  columns: CrudApi.columns,
  bordered: true,
  showIndexColumn: true, //显示序号列
  indexColumnProps:{ fixed:true },
  pagination: false/*{
    pageSize: 200,
    showSizeChanger: true,
    pageSizeOptions: ['200', '500', '1000'],
    showTotal: t => `总共${t}条数据`,
  }*/
})


const [registerQueryPage, {openModal: openQueryPageM}] = useModal()
const [registerContentPage, {openModal: openContentPageM}] = useModal()
const [registerPrintPage, {openModal: openPrintPageM}] = useModal()
const [registerStockCangKuModalPage, {openModal: openStockCangKuModalPage}] = useModal();
const [registerModalPopPage, { openModal: openMoalPopPage }] = useModal();
const [registerBatchSelectorPage, {openModal: opneBatchSelectorPage}] = useModal();
const [registerLackPage, { openModal: openLackPage }] = useModal();
onMounted(async () => {
  val.value.openOne = 1
  openQueryPageM(true, {
    data: val.value
  })
})

const openQueryPage = () => {
  val.value.openOne = 0
  openQueryPageM(true, {
    data: val
  })
}


//数据保存
async function saveData() {
  status.value=3
  saveModel.value.billStyle = "PLXHD"
  saveModel.value.bdocumStyle = "0"
  saveModel.value.cmaker = useUserStoreWidthOut().getUserInfo.id // 制单人
  if (leftTemp.value != 'all')
    leftModel.value[leftTemp.value] = getDataSource().filter(it => !hasBlank(it.cwhcode)  && !hasBlank(it.cvencode) && !hasBlank(it.cinvode) && !hasBlank(it.cunitid) && !hasBlank(it.baseQuantity) && !hasBlank(it.icost + '') && !hasBlank(it.price + '') && ((it.isBatch && hasBlank(it.batchId) || true)))
  let list = []
  Object.keys(leftModel.value).map(k=>{
    if (leftModel.value[k] != null && leftModel.value[k].length > 0)list.push(...leftModel.value[k])
  })
  if (list.length == 0) {
    createWarningModal({
      title: '温馨提示',
      content: '列表完整内容至少存在一条!仓库级别与存货编码为必选项,主数量、无税单价和本币无税金额为必填项,存在批号的请完善请补充完整!'
    })
    status.value=1
    return false
  }else {
    let delKyes = Object.keys(list[0]).filter(i => i.startsWith('edit') || i.startsWith('temp') )
    delKyes.push(...['cwhcodeInfo','unitInfo'])
    list.forEach((o, i) => {  //转化
      o = ObjTool.dels(o,delKyes)
      o['lineCode'] = o['key']
      o['lineId'] = (i + 1) + ''
      o['isGive'] = o['isGive'] ? '1' : '0'
      // let cangkuInfo =  cangKuList.value.filter(it => it.id == o['cwhcode'])[0]
      if (o.cangkuDuli == '1'){
        o['cwhcode1'] = o['cwhcode']
      }else if (o.cangkuDuli == '0'){
        let arr =  o['cwhcode'].split("\\")
        for (let j = 0; j < arr.length; j++) {
          o[`cwhcode${j+1}`] = arr[j]
        }
      }
    })
    if (!(await stockCheck(list,saveModel.value))) {
      status.value=1
      return false
    }
    saveModel.value.entryList = JsonTool.json(list)
    if (saveModel.value?.id == null)
      saveModel.value.ccode = await generateCode(saveModel.value.ddate)
     await useRouteApi(savePlhd, {schemaName: manipulateDbName})(ObjTool.dels(saveModel.value,['openOne','cinvodes','cvencodes']))
    message.success('保存成功！') //继续新增
    tempTaskDel()
    writeLog('新增')
    status.value = 3
  }
}
async function giveUp() {
  tempTaskDel()
  status.value = 3
  closeCurrent()
}

//存货校验
//存货校验
async function availability(mode,list){
  let checks=[];if (dynamicTenant.value?.target?.kcCgrkCheck == '1')checks.push('cg');if (dynamicTenant.value?.target?.kcXsckCheck == '1')checks.push('xs');
  let parameters =  [...new Set(list.map(it=>(it.cwhcode1+'='+it.cinvode+'='+it.batchId+'='+it.dpdate+'='+it.dvdate)))]
  parameters.forEach((str,index)=>{str+=index})
  return (await useRouteApi(findAvailability, {schemaName: manipulateDbName})({year: saveModel.value.ddate.substring(0,4),mode: (mode || 'all'),checks: JsonTool.json(checks),parameters: JsonTool.json(parameters)})) || []
}
async function stockCheck(list,model) {
  let err = ''
  let xclTaskData= await useRouteApi(getByStockBalanceTask, { schemaName: manipulateDbName })({iyear:model.ddate.substring(0,4),name:'整理现存量',method:'整理现存量'})
  if(!hasBlank(xclTaskData)){
    err ='系统正在进行现存量整理操作，不能进行单据处理，请销后再试！'
  }
  let ic = false
  let icList = []
  // 变更时 或 新增参照出库单时 或 修改 校验可用量
  if ('' == err){
    ic = true
    let checkParm = {xsOutXhd:dynamicTenant.value.target.xsOutXhd == '11',isOut:false}
    let setParm = [...new Set(list.map(it=>(it.cwhcode1+'='+it.cinvode+'='+it.batchId+'='+it.dpdate+'='+it.dvdate)))]
    let numbers = await availability('all',list)
    for (let s of setParm) {
      let parms = s.split('=')
      let tStock =  stockAllList.value.filter(it=>it.stockNum == parms[1])[0]
      let isB =tStock["stockPropertyBatch"] == '1'
      let tList = list.filter(it=>it.cwhcode1 == parms[0] &&  it.cinvode ==  parms[1] && (isB?(it.batchId ==  parms[2] && it.dpdate ==  parms[3] && it.dvdate ==  parms[4]):true))
      let tNum = 0;tList.map(it=> tNum+=parseFloat(it.baseQuantity))
      let kNum = 0; // 可用量
      if (checkParm.xsOutXhd){ // 是否允许超量

      }else {
        if (!checkParm.isOut){ // 如果退货单跳过
          let r = numbers.filter(it=> Object.keys(it).indexOf(s) != -1 )[0][s]
          if (tStock["stockPropertyBatch"] == '1'){
            if (r == null || parseFloat(r) < tNum){
              let lj = 0
              tList.map(it2=>{
                let z = {baseQuantity:0}
                if (r != null){ // 当前现存量不存在
                  let bn = (parseFloat(r) -lj) < 0?0: (parseFloat(r) -lj)
                  z.baseQuantity =it2?.xsUnitId == it2?.cunitId?bn: bn / parseFloat((it2?.unitList[it2?.unitList.findIndex(it => it.id == it2?.xsUnitId)]?.conversionRate))
                }
                let ce = z?.baseQuantity-parseFloat(it2.quantity)
                err+=`仓储位置【${it2.cwhcodeText}】下存货编码【${it2.cinvode}】的存货${tList.length>1?'多行合计总':''}可用量不足,可用量数量【${z.baseQuantity}】,差额数量【${Math.abs(ce>0?0:ce)}】;`
                icList.push({lineId:it2?.lineId,
                  stockNum:s,stockName:tStock.stockName,stockGgxh:tStock.stockGgxh,unitName:cunitFormat(it2?.unitList,it2?.xsUnitId),baseQuantity:it2.quantity,lackBaseQuantity:Math.abs(ce>0?0:ce),batchId:it2.batchId
                })
                lj+=parseFloat(it2.baseQuantity)
              })
            }
          }else {
            kNum = parseFloat(r)
            // 可用量 > 消单数量
            if (kNum < tNum){
              let c = parseFloat((tList[0]?.unitList[tList[0]?.unitList.findIndex(it => it.id == tList[0]?.xsUnitId)]?.conversionRate))
              let rn = tList[0]?.xsUnitId == tList[0]?.cunitId?kNum: kNum / c
              let cn = tList[0]?.xsUnitId == tList[0]?.cunitId?tNum: tNum / c
              err+=`仓储位置【${tList[0].cwhcodeText}】下存货编码【${parms[1]}】的存货${tList.length>1?'多行合计总':''}可用量不足,可用量数量【${rn}】,差额数量【${Math.abs(rn-cn)}】;`
              icList.push({lineId:tList[0]?.lineId,
                stockNum:s,stockName:tStock.stockName,stockGgxh:tStock.stockGgxh,unitName:cunitFormat(tList[0].unitList,tList[0].xsUnitId),baseQuantity:cn,lackBaseQuantity:Math.abs(rn-cn),batchId:tList[0].batchId
              })
            }
          }
        }
      }
    }
  }
  if (err != ''){
    if (!ic) createWarningModal({title: '温馨提示', content: err})
    if (ic) writeLog('新增',saveModel.value,`操作内容【新增销货单】,` + '新增失败,可用量不足！详情:'+err)
    if(ic)openLackPage(true,{data:icList})
    return  false;
  }
  return true;
}
async function generateCode(date) {
  return await useRouteApi(findBillCode, {schemaName: manipulateDbName})({
    type: "PLXHD",
    date: date,
    prefix: "PL",key: '3-6'
  })
}
const openPrintPage = (type) => {
  openPrintPageM(true, {
    data: tableSelectedRowObjs.value,
    schemaName: manipulateDbName.value,
    type: type,
    year: pageParameter.thisInterval.substring(0,4),
    unitName: unitName.value
  })
}

import {
  startVoucherReviewProcedural,
} from '/@/api/record/system/accvoucher';

import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";

const financialParameters = ref({
  icashier: false, // 出纳必须出纳签字
  imanager: false, // 必须主管签字
  projectClassCtl: false
})


const unCheckTable = () => {
  if (tableSelectedRowKeys.value.length > 0) {
    tableSelectedRowKeys.value = []
    tableSelectedRowObjs.value = []
  }
}

const onSelectChange = (record, selected, obj, nativeEvent) => {
  let selectedRowKeys = obj.map(it => pageParameter.queryMark == '1'?it.vouchUnCode:it.uniqueCode)
  if (pageParameter.queryMark == '1' && selectedRowKeys.length > 0) {
    if (selectedRowKeys.length > tableSelectedRowKeys.value.length) { // 选中
      let list = getDataSource()
      // let codes = list.filter(it=>selectedRowKeys.indexOf(it.key)  != -1).map(item => item.uniqueCode);
      let codes = obj.map(item => item.uniqueCode);
      let b = [...new Set(codes)]
      tableSelectedRowObjs.value = list.filter(item => b.indexOf(item.uniqueCode) != -1)
    } else { // 取消勾选 先 找到被取消的
      let b = [...new Set(tableSelectedRowObjs.value.filter(item => selectedRowKeys.indexOf(item.vouchUnCode) == -1).map(item => item.uniqueCode))]
      tableSelectedRowObjs.value = tableSelectedRowObjs.value.filter(item => b.indexOf(item.uniqueCode) == -1)
    }
    tableSelectedRowKeys.value = tableSelectedRowObjs.value.map(item => item.vouchUnCode)
  } else {
    let list = getDataSource()
    tableSelectedRowObjs.value = list.filter(it => selectedRowKeys.indexOf(it.uniqueCode) != -1);
    tableSelectedRowKeys.value = selectedRowKeys;
  }
}

const onSelectChange2 = (selected, selectedRows, changeRows) => {
  if (selected) {
    tableSelectedRowObjs.value = selectedRows
    tableSelectedRowKeys.value = tableSelectedRowObjs.value.map(item => item.vouchUnCode)
  } else {
    tableSelectedRowObjs.value = []
    tableSelectedRowKeys.value = []
  }
}

const currentTableDatasource = ref([])
const pageReload = async (v) => {
  if (v != 'all' && leftTemp.value != 'all')
    leftModel.value[leftTemp.value] = getDataSource().filter(it => !hasBlank(it.cwhcode)  && !hasBlank(it.cvencode) && !hasBlank(it.cinvode) && !hasBlank(it.cunitid) && !hasBlank(it.baseQuantity) && !hasBlank(it.icost + '') && !hasBlank(it.price + ''))
  let o = saveModel.value
  let list = []
  if (v != 'all' && leftModel.value[v] == null){ // 不存在
   list = khListList.value.filter(it=>o.cvencodes.indexOf(it.id) != -1).map(it=>createRow(it,o,v))
  }else if (v != 'all' &&  leftModel.value[v] != null){
    let etcs = leftModel.value[v]
    let c = etcs.map(it=>it.cvencode)
    etcs.push(...khListList.value.filter(it=>o.cvencodes.indexOf(it.id) != -1 && c.indexOf(it.id) == -1).map(it=>createRow(it,o,v)))
    list = etcs
  }
  let l = 30-list.length
  for (let i = 0; i < l; i++) {
    list.push({})
  }
  setTableData(list)
  leftTemp.value = v
  calculateTotal()
}

const createRow = (it,o,v) => {
  let s =  stockList.value.filter(it=>it.id == v)[0]
  let r ={
    cinvode: s.stockNum,cdepcode:o.cdepcode,cpersoncode: o.cpersoncode,cvencode: it.value,cvencodeJs: it.value,cvencodeName: it.label,billStyle:'XHD',
    cunitid: '',cunitidF1: '',cunitidF2: '',cunitType : s.stockMeasurementType == '单计量'?'1':'0',
    isBatch: s?.stockPropertyBatch == '1',itaxrate: (dynamicTenant.value.target.xsRate || 0),unitList:[],xsUnitId:'',
  }
  let cangkuInfo =  cangKuList.value.filter(it => it.id == o.cwhcode)[0]
  if (null != cangkuInfo){
    r['cangkuDuli'] = cangkuInfo.ckIsDuli
    if (cangkuInfo.ckIsDuli == '1')
      r['cwhcode']=o.cwhcode
  }
  if (r.cunitType == '0' && !hasBlank(s?.stockMeasurementUnit) && r?.unitInfo == null) {
    let res = manyJiList.value.filter(it => it.id == s?.stockMeasurementUnit)[0]
    if (res != null) {
      let list = JsonTool.parseObj(res.detail) || []
      r.unitList = list.map(it=>{it.value=it.id;it.label=it.unitName;it.ggxh='';it.barcode ='';return it;})
      if (list.length > 0) {
        r.xsUnitId = (s?.stockMarketUnit?s?.stockMarketUnit: list.filter(it=>it.isMain == 'true')[0]?.id)
        r.cunitid = list[0].id
        r.unitList[0].ggxh = s?.stockGgxh
        r.unitList[0].barcode = s?.stockBarcode
        if (list.length > 1) {
          r.cunitidF1 = list[1].id
          r.unitList[1].ggxh = s?.stockUnitGgxh1
          r.unitList[1].barcode = s?.stockUnitBarcode1
          if (list.length > 2){
            r.unitList[2].ggxh = s?.stockUnitGgxh2
            r.unitList[2].barcode = s?.stockUnitBarcode2
            r.cunitidF2 = list[2].id
          }
        }
      }
    }
  }else if (r.cunitType == '1' &&  !hasBlank(s?.stockMeasurementUnit)){
    let res = jiList.value.filter(it => it.id == s?.stockMeasurementUnit)[0]
    if (null !=  res && res.length >0){
      r.unitList = res.map(it=>{it.value=it.id;it.label=it.unitName;it.ggxh=s?.stockGgxh;it.barcode =s?.stockBarcode;return it;})
      r.xsUnitId = r.unitList[0].value
      r.cunitid = r.unitList[0].value
    }
  }
  return  r
}
const showThis = ref(true)

const delBtn = async () => {
  if (tableSelectedRowKeys.value.length === 0) {
    message.warning('至少选择一张凭证！')
    return false;
  }
  // 判断选择的是否记账
  /*  if (tableSelectedRowObjs.value.filter(item => item.ifrag != '2' && item.ifrag != '3').length > 0) {
      createWarningModal({title: '温馨提示', content: '选择的凭证中存在非暂存或非错误凭证,请刷新页面后重试！'});
      return false;
    }*/
  // 开始校验
  let data = {
    selectedRowKeys: [...new Set(tableSelectedRowObjs.value.map(item => item.uniqueCode))],
    man: lanMuData.value.username
  }
  /*选择的凭证中存在非暂存或非错误凭证*/
  createConfirm({
    iconType: 'warning',
    title: '凭证删除',
    content: '凭证删除后不可恢复，确定删除吗？',
    onOk: async () => {
      // 调整数据库 列参数
      let a = await useRouteApi(delSpecifyPingZheng, {schemaName: manipulateDbName.value})(data)
      if (null != a && !a.error) {
        await pointMessage({type: 'success',title: '处理结果', content: '删除凭证成功！2秒后将刷新列表！', delay: true})
        writeLog("删除",{},"操作内容【删除凭证】删除账套代码【"+unitCode.value+"】,账套名称【"+unitName.value+"】,区间【"+pageParameter.thisInterval+"】下的凭证编号为【"+tableSelectedRowObjs.value.map(it=>it.inoId).join(',')+"】的凭证")
        pageReload()
      } else {
        let text = a.list.map(it=>it.inoId).join(',')
        createWarningModal({title: '温馨提示', content: '删除凭证失败！所选凭证中存在已签字或已记账凭证！'});
      }
    },
    onCancel: async () => {
      tableSelectedRowObjs.value = []
      tableSelectedRowKeys.value = []
    }
  });
}




const pageSearch = async () => {
  /* if (''==pageParameter.searchConditon.value.trim())return false*/
  // 搜索前校验格式
  if ('' == pageParameter.searchConditon.requirement.trim()) {
    message.warn('请选择检索条件')
    return false
  }
  // 校验完成后搜索
  loadMark.value = true
  pageReload()
}



const jiList = ref([])
const manyJiList = ref([])
const stockPriceList = ref([])
async function reloadList() {
  jiList.value = await useRouteApi(findAllJiLang, {schemaName: manipulateDbName})({unitName: ''})
  manyJiList.value = await useRouteApi(findUnitInfoList, {schemaName: manipulateDbName})({})
  stockXclList.value = await useRouteApi(findXclListByYear, {schemaName: manipulateDbName})({year: saveModel.value.ddate.substring(0,4)})
  stockPriceList.value = (await useRouteApi(findAllPrice, {schemaName: manipulateDbName})({stockClass: '0'}))
}

/*start栏目设置*/
const dynamicColumnModel = ref({value:[]})

const reloadColumns = () => {
  let newA = JSON.parse(JSON.stringify(CrudApi.columns))
  newA = assemblyDynamicColumn(dynamicColumnModel.value.value, newA)
  setColumns(newA)
  initTableWidth(newA)
  searchConditonList.value = newA
}

function initTableWidth(thisCs) {
  let total = 60 + 60 // 选择列与序号列
  thisCs.forEach(item => {
    if (item.ifShow == null || item.ifShow)
      total += parseInt(item.width)
  })
  if (total > windowWidth.value) {
    let f = 0
    if (visible.value) f = 380
    totalColumnWidth.value = Number(windowWidth.value) - f
    tableRef.value.$el.style.setProperty('width', (windowWidth.value + 52 - f) + 'px')
  } else {
    if (visible.value && (windowWidth.value - 380) < total) total -= (total - (windowWidth.value - 380))
    totalColumnWidth.value = total
    tableRef.value.$el.style.setProperty('width', (total + 52) + 'px')
  }
}

/*栏目设置end*/



const loadPage = async (data) => {
  status.value = 1
  dynamicTenant.value = data.tenant
  xsNumWs.value = parseInt(data.tenant.target.xsNumWs)
  xsPriceWs.value = parseInt(data.tenant.target.xsPriceWs)
  xsRateWs.value = parseInt(data.tenant.target.xsRateWs)
  manipulateDbName.value = data.tenant.accountMode
  unitName.value = data.tenant.companyName
  unitCode.value = data.tenant.coCode
  lanMuData.value.accId =data.tenant.accId

  cangKuList.value = data.selectModel['warehouse']
  operatorList.value = data.selectModel['operator']

  saveModel.value = data.parm
  stockAllList.value = data.selectModel['stock']
  stockList.value = data.selectModel['stock'].filter(it=>data.parm.cinvodes.indexOf(it.stockNum) != -1)
  khListList.value = data.selectModel['cust']
  leftModel.value = {}
  if (data.parm.openOne == 1) { // 第一次初始化 + 条件查询
    await reloadList()
    // 添加任务
    tempTaskSave('新增')
  } else { // 查询条件查询
    pageParameter.searchConditon.value = ''
    // pageReload()
  }
  showTree.value = true

  //writeLog("查询",{},generateQueryText())
}

const pageChange = (a) => {
  // 分页改变
  loadMark.value = true
  pageReload(a.current)
}


const disabledDate = (current) => {
  // 获取区间最小区间
  let variable = pageParameter.condition.variable
  let min
  let max
  if (!hasBlank(variable.periodStart)) {
    min = moment(variable.periodStart + '-01', 'YYYY-MM-DD')
    max = moment(variable.periodEnd, 'YYYY-MM-DD').endOf('month')
  } else {
    min = moment(variable.dateStart, 'YYYY-MM-DD')
    max = moment(variable.dateEnd, 'YYYY-MM-DD')
  }
  return current < min || current > max
};
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
import LeftTree from "./popup/LeftTree.vue";
import {saveLog} from "/@/api/record/system/group-sys-login-log";
import {JsonTool, NumberTool, ObjTool, uuid} from "/@/api/task-api/tools/universal-tools";
import {
  findAll as findAllJiLang,
  findUnitInfoList
} from "/@/api/record/system/unit-mea";
import {
  batchSelectorList,
  findBillCode,
  findXclListByYear,
  savePlhd
} from "/@/api/record/stock/stock-xhd";
import FileContentSelect from "/@/views/boozsoft/stock/stock_piliang/popup/FileContentSelect.vue";
import {Table as ATable} from "ant-design-vue/lib/components";
import {findByTakingChCodes} from "/@/api/record/stock/stock_taking";
import {
  getByStockBalanceTask,
  stockBalanceTaskSave,
  stockTaskDelById
} from "/@/api/record/stock/stock_balance";
import {findAvailability} from "/@/api/record/stock/stock-currents";
import {findPromotionPrice} from "/@/api/record/stock/stock_promote_price";
import {findCustAndStockPrice} from "/@/api/record/stock/stock_cust_price";
import {findAll as findAllPrice} from "/@/api/record/stock/stock-price";
import {
  manualTypeConversionAttributes
} from "/@/views/boozsoft/stock/stock_sales_add/component/DynamicForm";

/*****************左侧树变化******************/
const treeFilter = (obj) => {
  if (val.value.openOne == 1){ // 初始化栏目
    lanmuVisible.value = true
    setTimeout(()=>{
      lanMuData.value.changeNumber+=1
      lanmuVisible.value = false
    },500)
  }
  val.value.openOne += 1
  pageReload(obj)
}
/*****************左侧树变化******************/

/************写入日志补充************/
async function writeLog(action, a, content) {
  /************** 记录操作日志 ****************/
  if (action == '修改') {
    let old = getDataSource().filter(it => it.id == a.id)[0]
    let keys = (Object.keys(old)).filter(k => old[k] != a[k] && k != 'key')
    let text = `操作内容【${action}批量销货单】,` + '销货单号【' + a.ccode + '】,单据日期【' + a.ddate + '】,'
    /* for (let i = 0; i < keys.length; i++) {
       const k = keys[i];
       let t = CrudApi.columns.filter(t => t.dataIndex == k)[0]?.title
       text += `${t}【${transformText(k, old[k])},${transformText(k, a[k])}】;`
     }*/
    content = text.substring(0, text.length - 1)
  }
  let map = {
    loginTime: new Date(+new Date() + 8 * 3600 * 1000).toJSON().substr(0, 19).replace("T", " "),
    userId: useUserStoreWidthOut().getUserInfo.username,
    userName: useUserStoreWidthOut().getUserInfo.realName,
    optModule: 'stock',
    optFunction: '批量销货单',
    optRange: '2',
    uniqueCode: '',
    optAction: action,accId:lanMuData.value.accId,
    optContent: content || `操作内容【${action}批量销货单】,` + '批量销货单号【' + a.ccode + '】,单据日期【' + a.ddate + '】',
  }
  await saveLog(map)
}

function transformText(key, value) {
  let text = value
  switch (key) {
    case "ibook":
      text = value == '1' ?  '已记账' : '未记账'
      break;
    case "flag":
      text =  value === '1' ? '作废' : value === '2' ? '暂存' : value === '3' ? '错误' : '错误'
      break;
  }
  return text
}
const generateQueryText = () => {
  let text = ''
  if (pageParameter.treeConditon.type = 'month'){
    text+=`期间【${pageParameter.thisInterval}】`
  }else {
    text+=`日期【${pageParameter.thisInterval}】`
  }
  let e =pageParameter.condition
  if (!hasBlank(e.variable.voucherNumberStart) && !hasBlank(e.variable.voucherNumberEnd))text+=`、凭证编号【${e.variable.voucherNumberStart}~${e.variable.voucherNumberEnd}】`
  if (!hasBlank(e.variable.summary))text+=`、摘要【${e.variable.summary}】`
  if (!hasBlank(e.variable.voucherType))text+=`、凭证类别【${e.variable.voucherType}】`
  if (!hasBlank(e.variable.subjectNumber))text+=`、科目编码【${e.variable.subjectNumber}】`
  return "操作内容【查询凭证】,账套代码【"+unitCode.value+"】,账套名称【"+unitName.value+"】下条件为："+text+"的凭证"+(pageParameter.queryMark=='1'?'明细':'分录')+"列表"
}
const replaceLog = (text) => {
  writeLog("替换",{},"操作内容【替换凭证】替换账套代码【"+unitCode.value+"】,账套名称【"+unitName.value+"】,区间【"+pageParameter.thisInterval+"】下凭证编号【"+tableSelectedRowObjs.value.map(it=>it.inoId).join(',')+"】,"+text)
}
const importLog = (number) => {
  writeLog("导入",{},"操作内容【导入凭证】在账套代码【"+unitCode.value+"】,账套名称【"+unitName.value+"】,区间【"+pageParameter.thisInterval+"】下新导入"+number+"张凭证!")
}
const printLog = (text) => {
  writeLog("打印",{},"操作内容【打印凭证】在账套代码【"+unitCode.value+"】,账套名称【"+unitName.value+"】,区间【"+pageParameter.thisInterval+"】下进行了凭证打印!")
}
/************写入日志补充************/

/****************核心业务*****************/
const {proxy} = getCurrentInstance()
const thisEditObj = ref(null)
const khListOptions = ref([])
const khListList = ref([])
const thisEditType = ref('')
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
  let filters = ['isGive','bcheck','cinvodeType','cunitid','cinvodeName','baseQuantity','subQuantity1','subQuantity2','cunitidF1','cunitidF2','itaxprice','dvdate']
   if (!r.isBatch)filters.push('batchId') //要求填批号才填写
  let cols = getColumns().filter(it=>it.title!='序号' &&  filters.indexOf(it.dataIndex) == -1 && it.ifShow)
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
    let doms = nextC == 'cmemo' ? document.getElementsByClassName(nextC)[0] : document.getElementsByClassName(nextC)[0]?.getElementsByTagName('input')[0]
    if (null != doms) doms.focus()
  })
}

const getNextMark = (c,b) => {
  let model = {cvencode:'Two',cvencodeJs:'Three',cwhcode:'One',baseQuantity:'Six',price:'Nine',icost:'Ten',batchId:'Twelve'/*,dvdate:'Fifteen'*/,cmemo:'Thirteen',taxprice: 'Taxprice', itaxrate: 'Itaxrate', isum: 'Isum',xsUnitId:'Cunit',quantity:'Quantity'}
  if (b){
    // 获取下一个
    let keys= Object.keys(model)
    return model[keys[keys.findIndex(k=>k == c)+1]]
  }else {
    return model[c]
  }
}

const tableDataChange =  (r,c) => {
  let h = saveModel.value;
  if (hasBlank(r.cwhcode) && !hasBlank(h.cwhcode) && r.cangkuDuli == '1') r.cwhcode = h.cwhcode
  if (hasBlank(r.itaxrate) && !hasBlank(h.xsRate)){
    r.itaxrate = parseFloat(h.xsRate).toFixed(6)
  }else {
    r.itaxrate = parseFloat(r.itaxrate || 0).toFixed(6)
  }
  switch (c) {
    // case 'baseQuantity':
    case 'xsUnitId':
    case 'quantity':
      let index = r.unitList.findIndex(it=>it.id==r.xsUnitId)
      if (c == 'xsUnitId' && index!=-1){
        r.cinvodeType = r.unitList[index]?.ggxh // 规格型号
        r.cinvodeBarcode = r.unitList[index]?.barcode // 条形码
        if (!hasBlank(r.quantity) && !hasBlank(r.taxprice)){// 切换单价
          let oldIndex =  r.unitList.findIndex(it=>it.id==r.oldXsUnitId)
          let t = parseFloat(r.taxprice)
          let b = parseFloat(r.quantity)
          if (oldIndex == 0){
            t = t*parseFloat(r.unitList[index]?.conversionRate)
            b =  index == 1?r.subQuantity1:r.subQuantity2
          }else if(oldIndex == 1){
            t = index == 0?(t/parseFloat(r.unitList[oldIndex]?.conversionRate)):(t*(parseFloat(r.unitList[index]?.conversionRate) / parseFloat(r.unitList[oldIndex]?.conversionRate)))
            b =  index == 0?r.baseQuantity:r.subQuantity2
          }else if(oldIndex == 2){
            t = t/(parseFloat(r.unitList[oldIndex]?.conversionRate) / parseFloat(r.unitList[index]?.conversionRate))
            b =  index == 0?r.baseQuantity:r.subQuantity1
          }
          r.taxprice = t
          // r.quantity = b
        }
      }
      if (c == 'xsUnitId' && hasBlank(r.quantity))  break;
      // 获取价格
      slChangeNew(r,c)
      if (r.defaultPrice != null){ // 当存在默认价格时
        resetPrice(r)
      }else {
        calculateTotal()
      }
      break;
    case 'price':
      if (!hasBlank(r.quantity) && !hasBlank(r.price)) {
        let n = parseFloat(r.quantity).toFixed(xsNumWs.value)
        // if (titleValue.value != 0 && n > 0) n = 0 - (Math.abs(n))
        let d = parseFloat(r.price).toFixed(xsNumWs.value)
        r.icost = (n * d).toFixed(xsPriceWs.value) + ''
        r.tempTen = r.icost
        r.isum = ( (n * d)*(1+parseFloat(r.itaxrate))).toFixed(xsPriceWs.value) + ''
        r.price = d + ''
        r.taxprice = (d*(1+parseFloat(r.itaxrate))).toFixed(xsNumWs.value) + ''
        r.itaxprice = ((d*parseFloat(r.itaxrate)) * n).toFixed(xsRateWs.value) + ''
        calculateTotal()
      }
      break;
    case 'icost':
      if (!hasBlank(r.quantity) && !hasBlank(r.icost)) { //反算 单价
        let n = parseFloat(r.quantity).toFixed(xsNumWs.value)
        // if (titleValue.value != 0 && n > 0) n = 0 - (Math.abs(n))
        let d = parseFloat(r.icost).toFixed(xsPriceWs.value)
        r.icost = d + ''
        r.isum = ( d*(1+parseFloat(r.itaxrate))).toFixed(xsNumWs.value) + ''
        r.tempTen = d + ''
        r.price = (d / n).toFixed(xsNumWs.value) + ''
        r.taxprice = ((r.price * (1+n))*parseFloat(r.itaxrate)).toFixed(xsNumWs.value) + ''
        r.itaxprice = (d*parseFloat(r.itaxrate)).toFixed(xsRateWs.value) + ''
      } else if (!hasBlank(r.price) && !hasBlank(r.icost)) { //反算 数量
        let n = parseFloat(r.price).toFixed(xsNumWs.value)
        let d = parseFloat(r.icost).toFixed(xsPriceWs.value)
        // if (titleValue.value != 0 && d > 0) d = 0 - (Math.abs(d))
        r.price = n + ''
        r.taxprice = ( n*(1+parseFloat(r.itaxrate))).toFixed(xsNumWs.value) + ''
        r.icost = d + ''
        r.isum = ( d*(1+parseFloat(r.itaxrate))).toFixed(xsNumWs.value) + ''
        r.itaxprice = ( d*(parseFloat(r.itaxrate))).toFixed(xsRateWs.value) + ''
        r.tempTen = d + ''
        // r.baseQuantity = (d / n).toFixed(xsNumWs.value) + ''
        // slChangeNew(r,c)
      }
      calculateTotal()
      break;
    case 'taxprice':// 含税单价
      if (!hasBlank(r.quantity) && !hasBlank(r.taxprice+'')) {
        let n:any = parseFloat(r.quantity).toFixed(10)
        let d:any = parseFloat(r.taxprice).toFixed(10)
        r.isum = (n * d ).toFixed(4) + ''
        r.taxprice = d + ''
        r.icost = (parseFloat(r.isum)/(1+parseFloat((r.itaxrate/100)))).toFixed(10)
        r.price = (parseFloat(r.icost)/n) .toFixed(10)
        r.itaxprice = parseFloat(r.icost)*parseFloat((r.itaxrate/100))
        calculateTotal()
      }
      break;
    case 'itaxrate':// 税率 【itaxprice 税额】
      if (!hasBlank(r.quantity) && !hasBlank(r.taxprice)) {
        let n:any = parseFloat(r.quantity).toFixed(10)
        let d:any = parseFloat(r.taxprice).toFixed(10)
        r.icost = (parseFloat(r.isum)/(1+parseFloat((r.itaxrate/100)))).toFixed(10)
        r.price = (parseFloat(r.icost)/n).toFixed(10)
        r.itaxprice = parseFloat(r.icost)*parseFloat((r.itaxrate/100))
        calculateTotal()
      }
      break;
    case 'isum':// 价税合计
      if (!hasBlank(r.quantity) && !hasBlank(r.isum)) { //反算 单价
        let n:any = parseFloat(r.quantity).toFixed(10)
        let d:any = parseFloat(r.isum).toFixed(4)
        r.isum = d + ''
        r.taxprice = (d/n).toFixed(10) + ''
        r.icost = (parseFloat(r.isum)/(1+parseFloat((r.itaxrate/100)))).toFixed(10)
        r.price = (parseFloat(r.icost)/n) .toFixed(10)
        r.itaxprice = parseFloat(r.icost)*parseFloat((r.itaxrate/100))
      } else if (!hasBlank(r.taxprice) && !hasBlank(r.isum)) { //反算 数量
        let n:any = parseFloat(r.taxprice).toFixed(10)
        let d:any = parseFloat(r.isum).toFixed(4)
        r.taxprice = n + ''
        r.isum = d + ''
        r.quantity = (d / n).toFixed(10) + ''
        r.icost = (parseFloat(r.isum)/(1+parseFloat((r.itaxrate/100)))).toFixed(10)
        r.price = (parseFloat(r.icost)/n) .toFixed(10)
        r.itaxprice = parseFloat(r.icost)*parseFloat((r.itaxrate/100))
        // slChangeNew(r)
        calculateTotal()
      }
      break;
  }
}
const resetPrice = (r) => {
  let p = 0
  let index = r.unitList.findIndex(it=>it.id==r.xsUnitId)
  if (index == 1){
    p = parseFloat(r.defaultPrice) * parseFloat(r.unitList[1].conversionRate)
  }else if (index == 2){
    p = parseFloat(r.defaultPrice) * parseFloat(r.unitList[2].conversionRate)
  }else {
    p = parseFloat(r.defaultPrice)
  }
  r.taxprice = p.toFixed(10)
  tableDataChange(r,'taxprice')
}
const slChangeNew = (r,c) => {
  if (r.cunitType == '1') { // 单计量
    r.baseQuantity = r.quantity
    r.subQuantity1 = "0.0000000000"
    r.subQuantity2 = "0.0000000000"
  } else { //多计量
    let n = parseFloat(r.quantity)
    let index = r.unitList.findIndex(it => it.id == r.xsUnitId)
    if (index == 1 && r.unitList.length > 1) {
      r.subQuantity1 = n.toFixed(10)
      r.baseQuantity = parseFloat((n * parseFloat(r.unitList[1].conversionRate))).toFixed(10)
      if (r.unitList.length > 2) r.subQuantity2 = parseFloat(n * (parseFloat(r.unitList[1].conversionRate)) / (parseFloat(r.unitList[2].conversionRate))).toFixed(10)
    } else if (index == 2 && r.unitList.length > 2) {
      r.subQuantity2 = n.toFixed(10)
      r.baseQuantity = parseFloat(((n * parseFloat(r.unitList[2].conversionRate)) / parseFloat(r.unitList[0].conversionRate))).toFixed(10)
      r.subQuantity1 = parseFloat(((n * parseFloat(r.unitList[2].conversionRate)) / parseFloat(r.unitList[1].conversionRate))).toFixed(10)
    } else {
      r.baseQuantity = n.toFixed(10)
      r.subQuantity1 = parseFloat((n / parseFloat(r.unitList[1].conversionRate))).toFixed(10)
      if (r.unitList.length > 2) r.subQuantity2 = parseFloat((n / parseFloat(r.unitList[2].conversionRate))).toFixed(10)
    }
  }
  if (c== 'quantity' && hasBlank(r.defaultPrice) && !hasBlank(r.cvencode) && !hasBlank(r.cinvode))getCurrStockPrice(r)
}

// 得到 促销价格 》客户价格 》销售价格
const getCurrStockPrice = async (record) => {
  let d = saveModel.value.ddate
  let c = record.cvencode
  let priceLevel = khListList.value.filter(it => it.id == record.cvencode)[0]?.priceLevel
  let k = hasBlank(priceLevel) ? 'memberprice' : manualTypeConversionAttributes(priceLevel);
  let price = (await useRouteApi(findPromotionPrice, {schemaName: manipulateDbName})({date: d,cust: c,stock:record.cinvode}))
  if (null == price ||  0 == price){
    price = (await useRouteApi(findCustAndStockPrice, {schemaName: manipulateDbName})({cust: c,stock:record.cinvode}))
    if (null == price ||  0 == price){
      let p = stockPriceList.value.filter(it => it.stockNum == record.cinvode)[0]
      if (null != p && null != k && null != p[k] && '0' !=  p[k]) price = parseFloat(p[k])
    }
  }
  record.defaultPrice = price;
  resetPrice(record)
}

const slChange = (r,c) => {
  if (c == 'baseQuantity' && r.cunitType == '0' && r.unitInfo != null){ // 存在多计量的清空
    // 运算辅助数量
    let list = JsonTool.parseObj(r.unitInfo.detail) || []
    if (list.length > 0){
      let n = parseFloat(r.baseQuantity).toFixed(xsNumWs.value)
      let isnum  = (r.unitInfo.unitType == '2')
      let one =  parseFloat((n/parseFloat(list[1].conversionRate))).toFixed(xsNumWs.value)
      let two =  parseFloat((n/parseFloat(list[2].conversionRate))).toFixed(xsNumWs.value)
      if (isnum){ //取整数}
        r.baseQuantity = NumberTool.toCeil(n,xsNumWs.value)+''
        r.subQuantity1 = NumberTool.toCeil(one,xsNumWs.value)+''
        r.subQuantity2 = NumberTool.toCeil(two,xsNumWs.value)+''
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
const openSelectContent = (o, type) => {
  thisEditObj.value = o
  thisEditType.value = type
  switch (type) {
    case 'cvencode':
    case 'cvencodeJs':
      openMoalPopPage(true, {
        database:  manipulateDbName.value,
        accId: lanMuData.value.accId
      });
      break;

    case 'cwhcode':
      // 独立仓库打时 几次仓库打开时
      openStockCangKuModalPage(true, {
        database: manipulateDbName.value,
        ckIsDuli: null != o ?o['cangkuDuli']: null,
        entity: null != o? cangKuList.value.filter(it => it.id == saveModel.value.cwhcode)[0]: null
      })
      break;
    case 'batchId':
      opneBatchSelectorPage(true, {
        tenant: dynamicTenant.value,
        row: o,list: stockList.value, mode: 'all'
      })
      break;
  }
}
const handleSearch = async (val: string, type: string) => {
  if (!hasBlank(val)) {
    // 排除已存在到存货
    let filterList =[] // getDataSource().filter(it => !hasBlank(it.cinvode)).map(it => it.cinvode)
    await fetch(val, type, filterList, (d: any[]) => (khListOptions.value = d));
  }
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
    let res = khListList.value.filter(it=>it[type == 'one'?'custCode':'custName'].indexOf(value) !=-1)
    let data = []
    res = res.filter(it => filterList.indexOf(it.custName) == -1)
    res.forEach((r: any) => {
      data.push({
        value: r[type == 'one' ? 'custCode' : 'custName'],
        label: (r['custCode'] + ' ' + r['custName']),
      });
    });
    callback(data);
  }

  timeout = setTimeout(fake, 300);
}

const modalData = (o) => {
  if (thisEditObj.value) {
    if (thisEditType.value == 'cwhcode') { // 仓库
      if (thisEditObj.value['cangkuDuli'] == '0'){
        thisEditObj.value['tempOne'] = o[0].cangkuId
        thisEditObj.value['cwhcodeInfo'] = o[0]
        console.log(thisEditObj.value['cwhcodeInfo'])
      }else {
        thisEditObj.value['tempOne'] = o[0].id
      }
    }else if (thisEditType.value == 'batchId') {
      if (o.length == 1) {
        thisEditObj.value['tempTwelve'] = o[0].batchId
        thisEditObj.value['dpdate'] = o[0].dpdate
        thisEditObj.value['dvdate'] = o[0].dvdate
        thisEditObj.value['cwhcode'] = o[0].cwhcode
        focusNext(thisEditObj.value,thisEditType.value)
      } else {
        createWarningModal({title: '温馨提示', content: '只能批号不能多选！'});
        /*let arr = []
        const temp = ObjTool.dels(JsonTool.parseProxy(thisEditObj.value), ['key','editTwelve'])
        o.forEach((v)=>{
          let t = JsonTool.parseProxy(temp)
          t.key = uuid().replaceAll(/\-/g,'')
          t['batchId'] = v.batchId
          t['dpdate'] = v.dpdate
          t['dvdate'] = v.dvdate
          t['cwhcode'] = v.cwhcode
          t['cwhcodeText'] = ckListOptions.value.filter(it => it.id == v.cwhcode)[0]?.ckName
          // 调整数量
          t['baseQuantity'] = v.outQuantity
          arr.push(tableDataChange(t, 'baseQuantity'))
        })
        let tables = getDataSource()
        let index = tables.findIndex(it => it.key == thisEditObj.value['key'])
        tables.splice(index, 1, ...arr)
        setTableData(tables)*/
      }
    } else {
      thisEditObj.value[(thisEditType.value == 'cvencode'?'tempTwo':'tempThree')] = o[0].id
    }
    focusNext(thisEditObj.value,thisEditType.value)
    thisEditObj.value = null
  } else {
    saveModel.value[thisEditType.value] = o[0].id
  }
}

const openStockSelectOpen = (t) => {
  if (t=='add'){
    openContentPageM(true, {
      data: 1,
      tenant: {accountMode: manipulateDbName.value}
    })
  }else {
    if (stockList.value.length == 1){
      createWarningModal({title: '温馨提示', content: '最后一条存货,不能进行删除！'});
    }else {
      createConfirm({
        iconType: 'warning',
        title: '存货删除',
        content: '存货删除后列表不可恢复，确定删除吗？',
        onOk:  () => {
          if (leftTemp.value && leftTemp.value != 'all'){
            // 存在右边数据 删除
            leftModel.value[leftTemp.value] = null
            showTree.value = false
            stockList.value = stockList.value.filter(it=>it.id != leftTemp.value)
            showTree.value = true
          }
        },
        onCancel:  () => {
        }
      });
    }
  }
}
const loadList = (e) => {
  let list = e.list
  let ycz = stockList.value.map(it=>it.id)
  ycz.push(...list.map(it=>it.stockId))
  ycz = [...new Set(ycz)]
  showTree.value = false
  stockList.value = stockAllList.value.filter(it=>ycz.indexOf(it.id) != -1)
  showTree.value = true
}
// const summaryTotal = reactive({baseQuantity:0.00,subQuantity1: 0.00,subQuantity2: 0.00,isum: 0.0})


/*** 合计 ***/
const getCurrSummary  = () => {
  return (getColumns().filter(it=>it.title != '序号' && it.ifShow).map((it,ind)=>{it['ind']=ind+2;return it;}))
}
const calculateTotal = () => {
  let list = JsonTool.parseProxy(getDataSource().filter(it=>it.cvencode!=null && it.quantity!=null))
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

const cunitFormat = (list,id,k) => {
  if (null == list || hasBlank(id)) return id;
  let it = list.filter(it=>it.id == id)[0]
  return  null == it?id:it.label
}
/****************核心业务*****************/
const taskIds = ref([])
async function tempTaskDel() {
  if(!hasBlank(taskIds.value)){
    taskIds.value.filter(id=>useRouteApi(stockTaskDelById, { schemaName: manipulateDbName })(id)
      .then((a)=>{taskIds.value=taskIds.value.filter(s=>s != id)}))
  }
}

async function tempTaskSave(method) {
  await useRouteApi(stockBalanceTaskSave, { schemaName: manipulateDbName })({iyear:saveModel.value.ddate.substring(0,4),userName:useUserStoreWidthOut().getUserInfo.id,functionModule:'批量销货单',method:method,recordNum:saveModel.value.ccode,caozuoModule:'stock'})
    .then((a)=>{
      taskIds.value.push(a.id)
    })
}
provide('stockList',stockList)
provide('stockXclList',stockXclList)
</script>
<style lang="less" scoped>
@Global-Border-Color: #c9c9c9; // 全局下划线颜色
@Global-Label-Color: #666666; // 全局#c9c9c9颜色
@Global-Comm-BcOrText-Color: #0096c7; // 全局#c9c9c9颜色
@import '/@/assets/styles/global-menu-index1.less';
.lcr-theme-div{
  display: inline-flex;justify-content: space-between;width: 100%;height: 100px;
  >div:nth-of-type(1){
    width: 40%;
    position: relative;
    display: block;
    line-height: 60px;
    >div:nth-of-type(1){width: 64px;display: inline-block;text-align: center;
      position: inherit;
      top: -6px;
    }
    >div:nth-of-type(2){
      width: calc( 100% - 64px);display: inline-block;
     /* :deep(.account-picker){
        .ap-title,.thisNameSpan{
          color: white !important;
        }
      }*/
    }
  }
  >div:nth-of-type(2){
    width: 20%;text-align:center;
    display: inline-block;
    >div:nth-of-type(1){
      color: @Global-Comm-BcOrText-Color;
      font-weight: bold;
      font-size: 24px;
    }
    >div:nth-of-type(2){margin-top: 14px;}
  }
  >div:nth-of-type(3){
    width: 40%;text-align: right;
    display: block;
    >div:nth-of-type(1){
      .actod-btn {
        color: @Global-Comm-BcOrText-Color;
        font-size: 14px;
        margin: 0 1px 0 0;
        border: 1px solid @Global-Border-Color;
      }

    /*  .actod-btn-last {
        border-right: 1px solid @Global-Border-Color;
      }*/

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
          :deep(.ant-input){
            border-color: @Global-Border-Color;
            border-left: none;
          }
          :deep(.ant-input-search-button){
            border-color: #c9c9c9;
            border-left: none;
            color: #0096c7;
          }
        }
      }

      .acttd-right-d-btns {
        margin-left: 10px;

        .acttdrd-btn {
          color: @Global-Comm-BcOrText-Color;
          margin-left: 2px;
          border: 1px solid @Global-Border-Color;
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
