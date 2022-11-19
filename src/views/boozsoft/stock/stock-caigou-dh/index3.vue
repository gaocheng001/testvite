<template>
  <div class="app-container">
    <PrintSetting v-if="showPrintSetting"></PrintSetting>
    <PrintModal @register="printModalRegister" :getDataSource="getDataSource" :getColumns="getColumns"></PrintModal>
    <div class="app-container-top lcr-theme-div" style="background-color: rgb(41 150 199)">
      <div>
        <div>
          <CopyOutlined style="color: white;font-size: 50px;"/>
        </div>
        <div>  <AccountPicker theme="three" readonly @reloadTable="dynamicAdReload"/></div>
      </div>
      <div></div>
      <div>
        <div>
          <Button class="actod-btn actod-btn-last" @click="closeCurrent(),router.push('/zhongZhang/home/welcome')">退出</Button>
        </div>
        <div>
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
                <SettingFilled  :style="{ fontSize: '14px' }"/>
              </Button>
            </Popover>
          </div>
        </div>
      </div>
    </div>
    <div class="app-container-bottom" >
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
            <VerticalRightOutlined @click="contentSwitch('first','首页')"/>&nbsp;
            <LeftOutlined @click="contentSwitch('prev','')" title="上页"/>&nbsp;
            <RightOutlined @click="contentSwitch('next','')" title="下页"/>&nbsp;
            <VerticalLeftOutlined @click="contentSwitch('tail','')" title="尾页"/>
            <span v-if="status=='3'">
              &nbsp;
              <Tag v-if="stockWareData.bcheck=='1'" :color="'volcano' ">
                已审核
              </Tag>
              <Tag :color="'volcano'" v-if="stockWareData.rukuStatus == '1'">
                已入库
              </Tag>
              <Tag :color="'volcano'" v-if="stockWareData.hxFlag=='1'">
                已结清
              </Tag>
              <Tag :color="'volcano'" v-if="stockWareData.biandong=='1'">
                已变更
              </Tag>
            </span>
          </div>
          <span style="font-size: 22px;font-weight: bold;margin-right: 300px;" :style="{color: '#0096c7'}">{{ titleContents[titleValue] }}</span>
        </div>
        <div class="acbgead-two" :style="status == 3?{ pointerEvents: 'none'}:{}">
          <DynamicForm :datasource="dynamicFormModel" :formDataFun="formFuns" :accId="dynamicTenantId" :biandong="biandong" :newDateMsg="newDateMsg"
                       @open="openHeadSelectContent" @newDate="findByNewDateCode" :canzhao="canzhao" :sourceType="sourceType"/>
        </div>
      </div>
      <div class="acb-centent">
        <BasicTable
          ref="tableRef"
          :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
          :clickToRowSelect="false"
          :loading="loadMark"
          :row-selection="{ type: 'checkbox',selectedRowKeys: tableSelectedRowKeys, onChange: onSelectChange }"
          :scroll="{ x: totalColumnWidth,y: windowHeight-(150)}"
          size="small"
          @register="registerTable"
        >
          <template #cwhcode="{ record }" >
            <template v-if="biandong=='0'&&record.editOne">
              <Select
                v-model:value="record.tempOne"
                :default-active-first-option="false"
                :filter-option="false"
                :not-found-content="null"
                :options="ckListOptions.map(it=>({value: it.id,label: it.ckName}))"
                :show-arrow="false"
                show-search
                style="width: 82%;"
                class="cwhcode"
                @keyup.enter="focusNext(record,'cwhcode')"
              ></Select>
              <SearchOutlined @click="openSelectContent(record,'cwhcode')"/>
            </template>
            <template v-else>
              <div @click="record.tempOne=record.cwhcode,record.editOne = true;"
                   :class="status == 1 || status == 2?'suspended-div':'status-look'">
                <span>{{ ckListOptions.filter(it => it.id == record.cwhcode).length>0?ckListOptions.filter(it => it.id == record.cwhcode)[0]?.ckName:record.cwhcodeText }}</span>
              </div>
            </template>
          </template>
          <template #bcheck1="{ record }">
            <template v-if="!canzhao&&biandong=='0'&&record.editThree">
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
            <template v-if="!canzhao&&biandong=='0'&&record.editTwo">
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
            <template v-if="!canzhao&&biandong=='0'&&record.editEleven">
              <Select
                v-model:value="record.tempEleven"
                show-search
                style="width: 82%;"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                :options="cardListOptions"
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
            <template v-if="!canzhao&&record.editCgUnitId">
              <Select
                v-model:value="record.tempCgUnitId"
                :default-active-first-option="false"
                :filter-option="false"
                :not-found-content="null"
                style="width: 82%;"
                class="cgUnitId"
                @keyup.enter="focusNext(record,'cgUnitId')"
                @change="cgUnitIdChange(record)"
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
            <template v-if="record?.editCnumber">
              <InputNumber v-model:value="record.tempCnumber"
                           class="cnumber"
                           :min="0"
                           :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           style="width: 82%;"
                           @keyup.enter="focusNext(record,'cnumber');"/>
              <CheckOutlined
                @click="record.editCnumber = null;record.cnumber=record.tempCnumber;tableDataChange(record,'cnumber')"/>
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
            <span class="a-table-font-arial">{{
                (record.baseQuantity == null || record.baseQuantity == 0 ? '' : parseFloat(record.baseQuantity).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }}
             </span>
          </template>
          <template #subQuantity1="{ record }">
            <span class="a-table-font-arial">{{
                (record.subQuantity1 == null || record.subQuantity1 == 0 ? '' : parseFloat(record.subQuantity1).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }}
             </span>
          </template>
          <template #subQuantity2="{ record }">
            <span class="a-table-font-arial">{{
                (record.subQuantity2 == null || record.subQuantity2 == 0 ? '' : parseFloat(record.subQuantity2).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }}
             </span>
          </template>
          <template #price="{ record }">
            <template v-if="!canzhao&&biandong=='0'&&record?.editNine">
              <InputNumber v-model:value="record.tempNine" class="price"
                           :min="0"
                           :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           style="width: 82%;"
                           @click="findBySupPrice(record)"
                           @keyup.enter="focusNext(record,'price')"/>
              <CheckOutlined
                @click="record.editNine = null;record.price=record.tempNine;tableDataChange(record,'price')"/>
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
            <template v-if="!canzhao&&biandong=='0'&&record?.editTen">
              <InputNumber v-model:value="record.tempTen" class="icost"
                           :min="0"
                           :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           style="width: 82%;"
                           @keyup.enter="focusNext(record,'icost')"/>
              <CheckOutlined
                @click="record.editTen = null;record.icost=record.tempTen;tableDataChange(record,'icost')"/>
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
          <!-- 税率-->
          <template #itaxrate="{ record }">
            <template v-if="!canzhao&&biandong=='0'&&record?.editItaxrate">
              <InputNumber v-model:value="record.tempItaxrate" class="itaxrate"
                           :min="0"
                           :max="100"
                           style="width: 82%;"
                           @click="getColumnRate(record)"
                           @keyup.enter="focusNext(record,'itaxrate')"/>
              <CheckOutlined
                @click="record.editItaxrate = null;record.itaxrate=record.tempItaxrate;tableDataChange(record,'itaxrate')"/>
            </template>
            <template v-else>
              <div :class="record.isGive ||  status == 3?'status-look':'suspended-div'"
                   @click="record.tempItaxrate=record.itaxrate,record.editItaxrate = true;">
                <span class="a-table-font-arial">{{ record.itaxrate==0?'':record.itaxrate }}</span>
              </div>
            </template>
          </template>
          <!-- 含税单价-->
          <template #taxprice="{ record }">
            <template v-if="!canzhao&&biandong=='0'&&record?.editTaxprice">
              <InputNumber v-model:value="record.tempTaxprice" class="taxprice"
                           :min="0"
                           :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           style="width: 82%;"
                           @click="findBySupPrice(record)"
                           @keyup.enter="focusNext(record,'taxprice')"/>
              <CheckOutlined
                @click="record.editTaxprice = null;record.taxprice=record.tempTaxprice;tableDataChange(record,'taxprice')"/>
            </template>
            <template v-else>
              <div :class="record.isGive ||  status == 3?'status-look':'suspended-div'"
                   @click="record.tempTaxprice=record.taxprice,record.editTaxprice = true;">
                    <span class="a-table-font-arial">{{
                        (record.taxprice == null ? '' : parseFloat(record.taxprice).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }}</span>
              </div>
            </template>
          </template>
          <!-- 税额 -->
          <template #itaxprice="{ record }">
            <span class="a-table-font-arial">{{
                (record.itaxprice == null ? '' : parseFloat(record.itaxprice).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }}
             </span>
          </template>
          <!-- 价税合计 -->
          <template #isum="{ record }">
            <template v-if="!canzhao&&record?.editIsum">
              <InputNumber v-model:value="record.tempIsum" class="isum"
                           :min="0"
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
              (record.isum == null ? '' : parseFloat(record.isum).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }}</span>
              </div>
            </template>
          </template>
          <template #isGive="{ record }" v-if="!canzhao&&biandong=='0'">
            <Switch v-model:checked="record.isGive" :disabled="status == 3" size="small"
                    @change="isGiveChange(record)"/>
          </template>
          <template #batchId="{ record }">
            <template v-if="biandong=='0'&&record?.editTwelve/* && record.isBatch*/">
              <Input v-model:value="record.tempTwelve"
                     style="width: 82%;" class="batchId"
                     @keyup.enter="focusNext(record,'batchId')"/>
              <CheckOutlined @click="record.editTwelve = null;record.batchId=record.tempTwelve;"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempTwelve=record.batchId,record.editTwelve = true;">
                <span class="a-table-font-arial">{{ record.batchId }}</span>
              </div>
            </template>
          </template>
          <template #cmemo="{ record }">
            <template v-if="!canzhao&&biandong=='0'&&record?.editThirteen">
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
            <template v-if="biandong=='0'&&record?.editDpdate">
              <DatePicker v-model:value="record.tempDpdate" value-format="YYYY-MM-DD"
                          class="dpdate"
                          format="YYYY-MM-DD" style="width: 82%;"
                          @openChange="(b)=>null!=record.tempDpdate && !b?focusNext(record,'dpdate'):null"/>
              <CheckOutlined @click="record.editDpdate = null;record.dpdate=record.tempDpdate;"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'" @click="record.tempDpdate=record.dpdate,record.editDpdate = true;">
                <span class="a-table-font-arial">{{ record.dpdate }}</span>
              </div>
            </template>
          </template>
          <template #dvdate="{ record }">
            <template v-if="biandong=='0'&&record?.editFifteen">
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
            {{ formatUniqueOperator(record.bcheckUser)}}
          </template>
          <template #footer>
            <div class="nc-summary">
              <div>
                <span>合计</span>
              </div>
              <div>
                <span>数量合计:</span>
                <span style="float: right">&ensp;{{ summary.cnumber }}</span>
              </div>
              <div>
                <span>价税合计:</span>
                <span style="float: right">&ensp;{{ summary.isum }}</span>
              </div>
              <div>
                <span>审核人:</span>
                <span style="float: right">&ensp; {{formItems?.bcheck == null?'': formatUniqueOperator(formItems?.bcheckUser)}}</span>
              </div>
            </div>
          </template>
        </BasicTable>
      </div>
    </div>
    <SupperModalPop @throwData="modalData" @register="registerModalPopPage"/>
    <DeptModalPop @register="registerSelectDeptPage" @save="modalData"/>
    <StockCangKuModalPop @register="registerStockCangKuModalPage" @throwData="modalData"/>
    <SelectPsn @register="registerSelectPsnPage" @save="modalData"/>
    <Import @save="introduceData" @register="registerImportPage" />
    <Query  @query="loadPage" @register="registerQueryPage" />
    <StockInfiModalPop @register="registerStockInfoModalPage" @throwData="modalData"/>
    <XySource @register="registerXySourcePage"/>
    <SySource @register="registerSySourcePage"/>
    <SySource @register="registerSySourcePage"/>
    <Print @save="loadPrint" @register="registerPrintPage"/>
    <Lack @register="registerLackPage"/>
    <ChangeItems @register="registerItemsPage"/>

    <a-modal v-model:visible="visible2" title="" :closable="false" :centered="true">
      <template #footer>
        <a-button key="submit" type="primary" @click="visible2=false" >确定</a-button>
      </template>
      <br>
      <p>&emsp;{{ modelText }}</p>
      <p>&emsp;{{ modelText1 }}</p>
      <p>&emsp;{{ modelText2 }}</p>
    </a-modal>
  </div>
</template>

<script setup="props, {emit}" lang="ts">
import moment from "moment";
import {
  Button,
  DatePicker,
  Input,
  InputNumber,
  message,
  Modal as AModal,
  Popover,
  Radio,
  Select,
  Switch,
  Tabs,
  Tag,
} from "ant-design-vue";
import Query from "./popup/query.vue";
import Import from "./popup/import.vue";
import XySource from './popup/xySource.vue';
import SySource from './popup/sySource.vue';
import ChangeItems from './popup/changeItems.vue';
import Print from '/@/views/boozsoft/stock/stock-caigou-rk/popup/print.vue';
import DynamicForm from './component/DynamicForm.vue';
import Lack from '/@/views/boozsoft/stock/stock_balance/popup/lack.vue';
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
import {getCurrentInstance, nextTick, reactive, ref} from "vue";
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
import {useRoute} from "vue-router";
import {useNewPrint} from "/@/utils/boozsoft/print/print";
import {assemblyDynamicColumn, initDynamics} from "./data";
import {hasBlank, trim} from "/@/api/task-api/tast-bus-api";
import {usePlatformsStore} from "/@/store/modules/platforms";
import {GenerateDynamicColumn} from "/@/views/boozsoft/stock/stock-caigou-dh/component/DynamicForm";
// import SupperModalPop from "/@/views/boozsoft/system/supplier/popup/modalPop.vue";
// import DeptModalPop from "/@/views/boozsoft/system/department/popup/select-dept.vue";
// import SelectPsn from "/@/views/boozsoft/system/department/popup/select-psn.vue";
import StockCangKuModalPop from "/@/views/boozsoft/stock/stock_cangku/popup/stockCangKuModalPop.vue";
import StockInfiModalPop from "/@/views/boozsoft/stock/stock_info/popup/stockInfoModalPop.vue";
import {
  findAll as findAllJiLang,
  findUnitAssociationList,
  findUnitInfoList
} from "/@/api/record/system/unit-mea";
import {findCunHuoAllList} from "/@/api/record/stock/stock-caigou";
import {
  delRuKu,
  delXyCsourceByxyCcodeAndxyBillTypeAndBillTypeAndCcode,
  findBillByCondition,
  findBillCode,
  findByStockCurrLock,
  findByStockPeriodIsClose,
  findByStockWareRecentlySupMoney,
  findStockPeriodYmFlag,
  findStockWareByCcode,
  reviewSetCGRKG,
  reviewSetCGRKGMx,
  saveRuKu,
  verifyXyCsourceByXyCode,
  xyCsourceSave,
} from "/@/api/record/stock/stock-ruku";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import dayjs from "dayjs";
import {findCangkuJoinName} from "/@/api/record/stock/stock-cangku-level-record";
import {
  getByStockBalanceTask,
  stockBalanceTaskDelByUserName,
  stockBalanceTaskEditNewTime,
  stockBalanceTaskSave,
  stockTaskDelById,
  updateStockCurrentRevision
} from "/@/api/record/stock/stock_balance";
import {
  editByIdCgrkAdd,
  editByIdZTRK,
  editByIdZTRKAdd,
  findByStockNumVerifyLack,
  findStockCurr,
  saveZTRK_XCL,
  subtractZTRKSum,
} from "/@/api/record/stock/stock-currents";
import {
  deleteByStockWarehLineCode,
  findAllByCcodeAndBillStyle,
  findByStockWarehLinecode,
  getUnitRate,
  stockWarehListSave
} from "/@/api/record/system/stock-wareh";
import {stockSupPriceFindBySupIdAndStockNum} from "/@/api/record/stock/stock_sup_price";
import {
  findByStockNum2,
  findByStockSupplierPrice,
  singleUnitOfMea
} from "/@/api/record/stock/stock";
import {findByLikeEcName} from "/@/api/record/stock/shou-fa";
import {findByStockAccountId} from "/@/api/record/system/stock-account";
import PrintSetting from './print/settings/index.vue'
import PrintModal from './print/Modal/index.vue'
import {
  saveStockWarehousingPOJO,
  saveStockWarehousingsListPOJO,
  getBianDongNewCcode,
  findBianDongBillByCondition,
  findStockWareBianDongByCcode
} from "/@/api/record/stock/stock-ruku-biandong";
import {
  findByIyearAndCcodeAndXyBillStyle,
  verifySyLineCodeExistXyData
} from "/@/api/record/stock/stock-xy-source";
import {saveLog} from "/@/api/record/system/group-sys-login-log";
import {dataModelBuildingTwoData} from "/@/views/boozsoft/stock/stock_sales_add/popup/ts/printData";
import {
  getPrintStencilParameter
} from "/@/views/boozsoft/stock/stock_sales_add/popup/ts/printTemplate";

const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const InputSearch = Input.Search
const SelectOption = Select.Option
const TabPane = Tabs.TabPane

const {createErrorModal, createConfirm, createWarningModal} = useMessage()
const {closeCurrent} = useTabs(router);
const route = useRoute();
const [registerQueryPage, {openModal: openQueryPageM}] = useModal()
const [registerImportPage, {openModal: openImportPageM}] = useModal()
const [registerPrintPage, {openModal: openPrintPage}] = useModal()
const [registerLackPage, {openModal: openLackPage}] = useModal()
const [registerItemsPage, {openModal: openItemsSourcePage}] = useModal()

const windowHeight = (window.innerHeight - 300)
const newDate=ref(new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "))
const summary = ref({})
const biandong = ref('0')
const dynamicTenantId = ref('')
const stockAccountObj:any = ref('')
const dynamicAccId = ref('')
const dynamicYear = ref('')
const titleContents = ['采购到货单（变动前）', '采购到货单（变动前）', '采购回冲单']
const titleValue = ref(0)
const formRowNum = ref(1)
const tempType =  ref('')
const bdocumStyle =  ref('0')
const pageParameter:any = reactive({
  showRulesSize: 'MIN',
  searchConditon: {
    requirement: '',
    value: '',
  },
  type: 'CGDHD'
})

const formItems: any = ref({})
const jiList:any = ref([])
const duoJlMxList:any = ref([])
const manyJiList:any = ref([])
const ckListOptions:any = ref([])
const userList = ref([])
const custList = ref([])
const operatorList = ref([])
const cardListOptions:any = ref([])
const assetsCardList:any = ref([])
const routeData:any = route.query;
const routeDataParams:any = route.params;
const stockWareData:any = ref('')
const ymPeriod:any = ref(false)
const visible3:any = ref(false)
// 是否更改过日期
const newDateMsg:any = ref('0')
// 任务
const taskInfo:any = ref('')
const sourceType:any = ref('')
const canzhao =  ref(false)
const dynamicFormModel:any = ref([])
const formFuns:any = ref({
  getFormValue: () => {
  }, setFormValue: () => {
  }, getSelectMap: () => {
  }
})
// 是否有变动操作
const biandongOper =  ref(false)

async function findByNewDateCode(date) {
  newDateMsg.value=date.msg
  // 获取最新
  let code:any = await generateCode(date.data)
  formItems.value = {
    ccode: code,
  }
  formFuns.value.setFormValue({
    ccode: code,
  })
}

async function getCKName(id) {
  let str=''
  let cangkuJoinName=await useRouteApi(findCangkuJoinName,{schemaName: dynamicTenantId})(  {id:id})
  if(cangkuJoinName.length>0){
    str=cangkuJoinName[0].cangkuRecordJoinName
  }
  return str
}

//金额格式化
function toThousandFilter(num:any) {
  if (num=='' || num==null){
    return ''
  }
  return (+num || 0).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
}

/**
 * 获取表头税率
 * @param r
 */
function getColumnRate(r){
  if(hasBlank(r['tempItaxrate'])){
    r['tempItaxrate']=formFuns.value.getFormValue()?.rate
  }
}

const dynamicAdReload = async (obj) => {
  console.log('当前时间：'+new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "))
  // 获取账套是否允许零出库
  let stockAccount= await useRouteApi(findByStockAccountId, {schemaName: obj.accountMode})(obj.target.id)
  if(stockAccount!==''){
    stockAccountObj.value = stockAccount
  }
  dynamicTenantId.value = obj.accountMode
  dynamicAccId.value = obj.accId
  dynamicYear.value = obj.stockYear

  stockWareData.value=''
  visible3.value = true
  setTimeout(()=>
      visible3.value = false
    ,100)
  await columnReload()
  await reloadList()
  lanMuData.value.changeNumber+=1
}
// 获取单据信息
async function findStockWareByCcodeData(ccode) {
  stockWareData.value=await useRouteApi(findStockWareBianDongByCcode, {schemaName: dynamicTenantId})(ccode)
  console.log(stockWareData.value)
}
const columnReload = async () => {
  dynamicFormModel.value = await GenerateDynamicColumn(dynamicTenantId.value) || []
  formRowNum.value = Math.ceil((dynamicFormModel.value.filter(it=>it.isShow).length/4))-1
}

let count=0
const pageReload = async () => {
  status.value=3
  await columnReload()
  await reloadList()
  stockWareData.value=''
  // 列表跳转过来
  await contentSwitch('tail',routeDataParams.ccode)
  count++
}

async function reloadList() {
  jiList.value = await useRouteApi(findAllJiLang, {schemaName: dynamicTenantId})({unitName: ''})
  manyJiList.value = await useRouteApi(findUnitInfoList, {schemaName: dynamicTenantId})({})
  duoJlMxList.value = await useRouteApi(findUnitAssociationList, {schemaName: dynamicTenantId})({})
  assetsCardList.value = (await useRouteApi(findCunHuoAllList, {schemaName: dynamicTenantId})({date: useCompanyOperateStoreWidthOut().getLoginDate}))
}

async function contentSwitch(action,ccode) {
  loadMark.value = true
  let res = await useRouteApi(findBianDongBillByCondition, {schemaName: dynamicTenantId})({
    type: pageParameter.type,
    iyear: dynamicYear.value || '2022',
    action: action,
    ccode: ccode,
    bdocumStyle: bdocumStyle.value,
    curr: formFuns.value.getFormValue()?.ccode || ''
  })
  if (null != res) {
    findStockWareByCcodeData(res.ccode)
    countStockPeriodYmFlag(res.iyear,'1')
    formItems.value = JsonTool.parseProxy(res)
    res.entryList = null
    formFuns.value.setFormValue(res)
    titleValue.value = parseInt(res.bdocumStyle || 0)
    if (!hasBlank(formItems.value.entryList)) {
      ckListOptions.value = formFuns.value.getSelectMap()['warehouse']
      operatorList.value = formFuns.value.getSelectMap()['operator']
      custList.value = formFuns.value.getSelectMap()['supplier']
      userList.value = formFuns.value.getSelectMap()['user']

      let list = JsonTool.parseObj(formItems.value.entryList).map(it => resetRow(it))
      // 查询是否生成
      if(list.filter(a=>!hasBlank(a.sourcecode)).length>0){
        canzhao.value=true;
        sourceType.value=list[0]?.sourcetype
      }
      // 查找级别档案名称
      for (let i = 0; i < list.length; i++) {
        if(hasBlank(list[i].cwhcodeText)){
          list[i].cwhcodeText=await getCKName(list[i].cwhcode)
        }
        list[i].unitList=[]
        let stock=await useRouteApi(findByStockNum2, {schemaName: dynamicTenantId})(list[i].cinvode)
        // 查询计量明细
        let res:any =  manyJiList.value.filter(it=>it.id == stock?.stockMeasurementUnit)[0]
        if (res != null){
          let list2 = JsonTool.parseObj(res.detail) || []
          list2=list2.filter(jl=>!hasBlank(jl.unitName))
          list[i].unitList.push({title:list2[0]?.unitName,value:list2[0]?.id,ggxh:stock?.stockGgxh,txm:stock?.stockBarcode})
          if(list2.length==2){
            list[i].unitList.push({title:list2[1]?.unitName,value:list2[1]?.id,ggxh:stock?.stockUnitGgxh1,txm:stock?.stockUnitBarcode1})
          }
          if(list2.length==3){
            list[i].unitList.push({title:list2[1]?.unitName,value:list2[1]?.id,ggxh:stock?.stockUnitGgxh1,txm:stock?.stockUnitBarcode1})
            list[i].unitList.push({title:list2[2]?.unitName,value:list2[2]?.id,ggxh:stock?.stockUnitGgxh2,txm:stock?.stockUnitBarcode2})
          }
          let data=list[i].unitList.filter(a=>a.value==list[i].cgUnitId)[0]
          list[i].bcheck1=data?.txm
          list[i].cinvodeType=data?.ggxh
        }
        else{
          list[i].unitList=jiList.value.filter(a=>a.id==list[i].cgUnitId).map(it=>{it.title=it.unitName;it.value=it.id;it.ggxh=stock?.stockGgxh;it.txm=stock?.stockBarcode;return it;})
        }
      }
      assembleTotal(list)
      let len = list.length
      for (let i = 0; i < (25 - len); i++) {
        list.push({})
      }
      setTableData(list)
    }
    formItems.value.entryList = null
  } else {
    let list:any=[]
    for (let i = 0; i < 50; i++) {
      list.push({})
    }
    assembleTotal(list)
    setTableData(list)
    formFuns.value.setFormValue({})
    formItems.value={}
    message.success('暂无数据！')
  }
  loadMark.value = false
}

const assembleTotal = (list) => {
  let isum = 0
  let cnumber = 0
  for (let o of list) {
    cnumber += parseFloat(o.cnumber || '0')
    isum += parseFloat(o.isum || '0')
  }
  summary.value=
    {
      cnumber: toThousandFilter(cnumber),
      isum: toThousandFilter(isum),
    }
}
// 0 暂存 1 新建 2编辑 3查看
const status = ref(3)

const CrudApi = {
  columns: [
    {
      title: '仓储位置',
      dataIndex: 'cwhcode',
      ellipsis: true,
      slots: {customRender: 'cwhcode'},
      width: 120
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
      width: 80,
    },
    {
      title: '无税单价',
      dataIndex: 'price',
      ellipsis: true,
      slots: {customRender: 'price'},
      width: 120,
    },
    {
      title: '无税金额',
      dataIndex: 'icost',
      slots: {customRender: 'icost'},
      ellipsis: true,
      width: 120,
      align: 'right'
    },
    {
      title: '税额',
      dataIndex: 'itaxprice',
      slots: {customRender: 'itaxprice'},
      ellipsis: true,
      width: 120,
      align: 'right'
    },
    {
      title: '税率%',
      dataIndex: 'itaxrate',
      slots: {customRender: 'itaxrate'},
      ellipsis: true,
      width: 120,
      align: 'right'
    },
    {
      title: '含税单价',
      dataIndex: 'taxprice',
      slots: {customRender: 'taxprice'},
      ellipsis: true,
      width: 120,
      align: 'right'
    },
    {
      title: '价税合计',
      dataIndex: 'isum',
      slots: {customRender: 'isum'},
      ellipsis: true,
      width: 120,
      align: 'right'
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
      slots: {customRender: 'dpdate'},
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
      title: '备注',
      dataIndex: 'cmemo',
      ellipsis: true,
      width: 120,
      slots: {customRender: 'cmemo'},
    },
    {
      title: '项目',
      dataIndex: 'citemcode',
      ellipsis: true,
      width: 120,
    },{
      title: '赠品',
      dataIndex: 'isGive',
      ellipsis: true,
      width: 120,
      slots: {customRender: 'isGive'},
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
  tableSelectedRowKeys.value=[]
  tableSelectedRowObjs.value=[]

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
      // 现存量
      let stockcurr= await useRouteApi(findStockCurr, {schemaName: dynamicTenantId})(rowDelData.value[0])
      let temp2=stockcurr.filter(a=>a.cwhcode==rowDelData.value[0][0].cwhcode&& a.invCode==rowDelData.value[0][0].cinvode && a.batchId==rowDelData.value[0][0].batchId && a.dpdate==rowDelData.value[0][0].dpdate && a.dvdate==rowDelData.value[0][0].dpdate)
      for (let j = 0; j < temp2.length; j++) {
        if(parseFloat(rowDelData.value[0][0].baseQuantity)<parseFloat(temp2[j].ztrkQuantityCgdh)){
          message.error('存货编码【'+rowDelData.value[0][0].cinvode+'】在途到货数量不足,不能修改')
          return false
        }
      }
    }
    list.splice(selectIndex, 1)
    setTableData(list)
    tableSelectedRowKeys.value = []
  }
  else {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请选择删除行次！'
    })
  }
}
const rowDelBianDongData:any=ref([])
async function tableDelBiandong() {
  if (tableSelectedRowKeys.value.length == 1){
    let list:any = getDataSource()
    let selectIndex = list.findIndex(it => it.key === tableSelectedRowKeys.value[0])
    let data=list.filter(it => it.key === tableSelectedRowKeys.value[0])[0]
    // 检验上游子表行唯一码是否存在下游
    let xyData=await useRouteApi(verifySyLineCodeExistXyData, { schemaName: dynamicTenantId })({billStyle:'CGDHD',xyIyear:data.iyear,sourcedetailId:data.lineCode})
    if(xyData>0){
      return message.error('已经生成下游表不能删除!!')
    }
    rowDelBianDongData.value.push(data)
    list.splice(selectIndex, 1)
    setTableData(list)
    tableSelectedRowKeys.value = []
  }
  else{
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '只能单行删除！'
    })
  }
}

const startEdit = async (type) => {
  // 有无 整理现存量 任务
  let xclTaskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'整理现存量',method:'整理现存量'})
  if(!hasBlank(xclTaskData)){
    status.value = 3
    return message.error('系统正在进行现存量整理操作，不能进行单据处理，请销后再试！')
  }

  // 结账操作
  let jzMethod= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'月末结账',method:'结账'})
  if(!hasBlank(jzMethod)){
    status.value = 3
    return message.error('提示：操作员'+jzMethod.caozuoName+'正在对当前账套进行月末结账处理，不能进行单据新增操作，请销后再试！')
  }
  let date = useCompanyOperateStoreWidthOut().getLoginDate
  // 日期是否已结账
  let temp=await useRouteApi(findByStockPeriodIsClose, {schemaName: dynamicTenantId})({iyear:date.split('-')[0],month:date.split('-')[1]})
  if(temp>0){
    status.value = 3
    return message.error('当前业务日期期间已经结账，不能进行单据新增操作，请取消结账后后重试！！')
  }

  let maxR = 20
  if (type === 'add') {
    status.value = 1
    stockWareData.value=''
    // 获取最新
    let code = await generateCode(useCompanyOperateStoreWidthOut().getLoginDate)
    formItems.value = {
      ddate: date,
      ccode: code,
      rate: stockAccountObj.value?.cgRate,
      invoiceStyle: 'zyfp',
    }
    formFuns.value.setFormValue({
      ddate: date,
      ccode: code,
      rate: stockAccountObj.value?.cgRate,
      invoiceStyle: 'zyfp',
    })
    let list:any = []
    for (let i = 0; i < maxR; i++) {
      list.push({})
    }
    setTableData(list)
    tempTaskSave('新增')
  }
  else if(type=='edit'){
    // 任务
    let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'采购到货单',method:'修改,审核,删除',recordNum:formItems.value.ccode})
    if(taskData==''){
      tempTaskSave('修改')
    }else{
      for (let i = 0; i < taskData.length; i++) {
        // 任务不是当前操作员的
        if(taskData[i]?.caozuoUnique!==useUserStoreWidthOut().getUserInfo.id){
          return createWarningModal({ content: taskData[i]?.username+'正在'+taskData[i]?.method+'采购到货单,不能同时进行操作！' });
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
  else if(type=='biangeng'){
    let res = await useRouteApi(findBillByCondition, {schemaName: dynamicTenantId})({
      type: pageParameter.type,
      iyear: dynamicYear.value || '2022',
      action: 'curr',
      ccode: '',
      bdocumStyle: bdocumStyle.value,
      curr: formFuns.value.getFormValue()?.ccode || ''
    })
    if(!hasBlank(res.hxFlag)&&res.hxFlag!='0'){
      status.value = 3
      return message.error('当前单据已进行付款核销完成，不能进行变更操作，请手动删除对应核销记录后继续！')
    }else if(!hasBlank(res.hzhcNum)&&res.hzhcNum!='0'){
      status.value = 3
      return message.error('当前单据已进行过红字回冲，不能进行变更操作，请删除对应红字回冲单后继续！')
    }

    let xyPingZheng= await useRouteApi(findByIyearAndCcodeAndXyBillStyle, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,ccode:formItems.value.ccode,xyBillStyle:'PINGZHENG'})
    if(!hasBlank(xyPingZheng)){
      status.value = 3
      return message.error('当前单据已参照生成财务凭证，不能进行变更操作，请手动删除生成的财务凭证后继续！')
    }
    // 任务
    let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'采购到货单',method:'修改,审核,删除',recordNum:formItems.value.ccode})
    if(taskData==''){
      tempTaskSave('变更')
    }else{
      for (let i = 0; i < taskData.length; i++) {
        // 任务不是当前操作员的
        if(taskData[i]?.caozuoUnique!==useUserStoreWidthOut().getUserInfo.id){
          return createWarningModal({ content: taskData[i]?.username+'正在'+taskData[i]?.method+'采购到货单,不能同时进行操作！' });
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
  await useRouteApi(stockBalanceTaskSave, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,userName:useUserStoreWidthOut().getUserInfo.id,functionModule:'采购到货单',method:method,recordNum:formItems.value.ccode,caozuoModule:'stock'})
    .then((a)=>{
      taskInfo.value=a
      console.log('任务='+JSON.stringify(a))
    })
}
async function saveLogData(optAction) {
  let logmap={
    loginTime:new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "),
    userId: useUserStoreWidthOut().getUserInfo.username,
    userName: useUserStoreWidthOut().getUserInfo.realName,
    optModule:'stock',
    optFunction:'采购到货单',
    uniqueCode:formItems.value?.ccode,
    optAction:optAction,
    accId:dynamicAccId.value,
    optContent:'操作内容【采购到货单】,单据编号【'+formItems.value?.ccode+'】',
  }
  await saveLog(logmap)
}
async function generateCode(date) {
  return await useRouteApi(findBillCode, {schemaName: dynamicTenantId})({
    type: "CGDHD",
    date: date,
    prefix: "",key: '3-1'
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
    // 有无 整理现存量 任务
    let xclTaskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'整理现存量',method:'整理现存量'})
    if(!hasBlank(xclTaskData)){ return message.error('系统正在进行现存量整理操作，不能进行单据处理，请销后再试！') }
    // 结账操作
    let jzMethod= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'月末结账',method:'月末结账'})
    if(!hasBlank(jzMethod)){
      return message.error('提示：操作员'+jzMethod.caozuoName+'正在对当前账套进行月末结账处理，不能进行单据新增操作，请销后再试！')
    }
    if(formItems.value.bcheck=='1'){
      return message.error('提示：当前到货单已经审核，不能删除，请弃审单据后重试！！')
    }
    // 任务
    let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'采购到货单',method:'修改,审核,删除',recordNum:formItems.value.ccode})
    if(!hasBlank(taskData)){
      for (let i = 0; i < taskData.length; i++) {
        // 任务不是当前操作员的
        if(taskData[i]?.caozuoUnique!==useUserStoreWidthOut().getUserInfo.id){
          return createWarningModal({ content: taskData[i]?.username+'正在'+taskData[i]?.method+'采购到货单,不能同时进行操作！' });
        }
        await useRouteApi(stockBalanceTaskEditNewTime, { schemaName: dynamicTenantId })(taskData[i]?.id)
      }
    }
    let dataList = getDataSource().filter(it => !hasBlank(it.cwhcode))

    // 数量不足 弹出框提示
    let currData=await useRouteApi(findByStockNumVerifyLack, { schemaName: dynamicTenantId })({list:JSON.stringify(dataList),typeData:'cgdhd'})
    if(currData.length>0){ return  openLackPage(true,{data:currData}) }

    tempTaskSave('删除')
    createConfirm({
      iconType: 'warning',
      title: '采购到货单删除',
      content: '您确定要进行采购到货单删除吗!',
      onOk: async () => {
        let dataList = getDataSource().filter(it => !hasBlank(it.cwhcode))
        // 上游单据 && 是否生成的到货单
        if(canzhao.value){
          for (let i = 0; i < dataList.length; i++) {
            // 删除下游单据
            await useRouteApi(delXyCsourceByxyCcodeAndxyBillTypeAndBillTypeAndCcode, {schemaName: dynamicTenantId})({xyccode:formItems.value.ccode,xybillStyle:'CGDHD',billStyle:dataList[i].sourcetype,ccode:dataList[i].sourcecode})
          }
        }
        // 返回现存量ID
        let subtract=await useRouteApi(subtractZTRKSum, {schemaName: dynamicTenantId})({list:JSON.stringify(dataList)})
        for (let i = 0; i < subtract.length; i++) {
          if(!canzhao.value){
            // 在途到货数量相减
            await useRouteApi(editByIdZTRK, {schemaName: dynamicTenantId})({id:subtract[i].id,ztrk:subtract[i].number})
          }
        }
        await useRouteApi(delRuKu, {schemaName: dynamicTenantId})({id: formItems.value.id})
        // 删除变动记录*暂时注释
        // await useRouteApi(delStockJoinPojo, {schemaName: dynamicTenantId})(formItems.value.ccode)
        tempTaskDel(taskInfo.value?.id)
        saveLogData('删除')
        message.success('删除成功！')
        formItems.value.czId = ''
        await contentSwitch('tail','')
      },onCancel: () => {
        tempTaskDel(taskInfo.value?.id)
        return false
      }
    });
  }
}

const startReview = async (b) => {
  if(formItems.value.bcheck=='1'&&b){
    message.error('此单据已审核！')
    return false
  }
  if(formItems.value.bcheck=='0'&&!b){
    message.error('此单据没有审核！')
    return false
  }
  // 有无 整理现存量 任务
  let xclTaskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'整理现存量',method:'整理现存量'})
  if(!hasBlank(xclTaskData)){
    return message.error('提示：当前业务日期期间已经结账，不能进行单据新增操作，请取消结账后后重试！！')
  }
  // 结账操作
  let jzMethod= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'月末结账',method:'结账'})
  if(!hasBlank(jzMethod)){
    return message.error('提示：操作员'+jzMethod.caozuoName+'正在对当前账套进行月末结账处理，不能进行单据新增操作，请销后再试！')
  }
  let date = useCompanyOperateStoreWidthOut().getLoginDate
  // 日期是否已结账
  let temp=await useRouteApi(findByStockPeriodIsClose, {schemaName: dynamicTenantId})({iyear:date.split('-')[0],month:date.split('-')[1]})
  if(temp>0){
    return message.error('当前业务日期期间已经结账，不能进行单据新增操作，请取消结账后后重试！！')
  }

  // 任务
  let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'采购到货单',method:'修改,审核,删除',recordNum:formItems.value.ccode})
  if(!hasBlank(taskData)){
    for (let i = 0; i < taskData.length; i++) {
      // 任务不是当前操作员的
      if(taskData[i]?.caozuoUnique!==useUserStoreWidthOut().getUserInfo.id){
        return createWarningModal({ content: taskData[i]?.username+'正在'+taskData[i]?.method+'采购到货单,不能同时进行操作！' });
      }
      await useRouteApi(stockBalanceTaskEditNewTime, { schemaName: dynamicTenantId })(taskData[i]?.id)
    }
  }

  let res = await useRouteApi(findBillByCondition, {schemaName: dynamicTenantId})({
    type: pageParameter.type,
    iyear: dynamicYear.value || '2022',
    action: 'tail',
    ccode: formItems.value.ccode,
    bdocumStyle: '0',
    curr: ''
  })

  // 弃审
  if(!b){
    let findByRukuData=await useRouteApi(verifyXyCsourceByXyCode, {schemaName: dynamicTenantId})({year:formItems.value.iyear,code:formItems.value.ccode,xyCode:'CGRKD'})
    if(findByRukuData!=='' ){
      message.error('已经生成采购入库单【编码'+findByRukuData.xyccode+'】,不能弃审！')
      return false;
    }
  }

  loadMark.value=true
  tempTaskSave(b?'审核':'弃审')
  let a:any = useUserStoreWidthOut().getUserInfo?.id
  if (!hasBlank(a) && !hasBlank(formItems.value.id))  {
    // 审核、弃审
    let bcheck=b?'1':'0'
    let bcheckTime=b?newDate.value:''
    let bcheckUser=b?a:''
    res.bcheck=bcheck
    res.bcheckTime=bcheckTime
    res.bcheckUser=bcheckUser
    await useRouteApi(reviewSetCGRKG, {schemaName: dynamicTenantId})(res)
    let list = getDataSource().filter(it => !hasBlank(it.cwhcode) && !hasBlank(it.cinvode) && !hasBlank(it.cunitid) && !hasBlank(it.baseQuantity) && !hasBlank(it.icost + '') && !hasBlank(it.price + ''))
    list.forEach(tx=>{
      tx.isGive=tx.isGive?'1':'0'
      tx.isBatch=tx.isBatch?'1':'0'
      tx.bcheck=bcheck
      tx.bcheckTime=bcheckTime
      tx.bcheckUser=bcheckUser
    })
    await useRouteApi(reviewSetCGRKGMx, {schemaName: dynamicTenantId})(list)

    let tableList = getDataSource().filter(it => !hasBlank(it.cwhcode))
    // 是否参照入库单生成
    let sourceLength:any = tableList.filter(it => !hasBlank(it.sourcetype)&&it.sourcetype!='CGRKD')
    if(b){
      // 到货单审核生成入库单 1是
      if(stockAccountObj.value.cgShDhd=='1' && sourceLength.length==0){
        res.rukuStatus='1'
        await useRouteApi(reviewSetCGRKG, {schemaName: dynamicTenantId})(res)

        // 入库单子表-修改本单据的 累计入库数量
        tableList.forEach(async (temp)=>{
          // 修改本单据的 累计入库数量
          temp.isumRuku=temp.baseQuantity
          temp.bcheck=bcheck
          temp.bcheckTime=bcheckTime
          temp.bcheckUser=bcheckUser
        })
        await useRouteApi(stockWarehListSave, {schemaName: dynamicTenantId})(tableList)

        let oldNum=formItems.value.ccode
        let oldddate=formItems.value.ddate
        let newRuKuNum=await useRouteApi(findBillCode, {schemaName: dynamicTenantId})({type: "CGRKD",date:  useCompanyOperateStoreWidthOut().getLoginDate,prefix: "",key: '3-10'})

        // 生成入库单
        formItems.value.id=null
        formItems.value.ccode=newRuKuNum
        formItems.value.billStyle='CGRKD'
        formItems.value.bcheck=''
        formItems.value.bcheckTime=''
        formItems.value.bcheckUser=''
        formItems.value.bstyle='采购入库'
        await useRouteApi(reviewSetCGRKG, {schemaName: dynamicTenantId})(formItems.value)

        let setRuKuList = getDataSource().filter(it => !hasBlank(it.cwhcode))
        // 生成入库单明细
        setRuKuList.forEach(async (temp)=>{
          let parentLineCode=temp.lineCode
          temp.isGive=temp.isGive?'1':'0'
          temp.isBatch=temp.isBatch?'1':'0'
          temp.id=null
          temp.billStyle='CGRKD'
          temp.ccode=newRuKuNum
          temp.lineCode=randomString(30)
          temp.bcheck='0'
          temp.bcheckTime=''
          temp.bcheckUser=''
          temp.isumRuku=''

          temp.sourcetype='CGDHD'
          temp.sourcecode=oldNum
          temp.sourcedetailId=parentLineCode
          temp.sourcedate=oldddate
        })
        await useRouteApi(reviewSetCGRKGMx, {schemaName: dynamicTenantId})(setRuKuList)
        // 添加下游表
        let xy={iyear:dynamicYear.value,billStyle:'CGDHD',ccode:oldNum,ccodeDate:oldddate,xyBillStyle:'CGRKD',xyccode:newRuKuNum,xyccodeDate:oldddate}
        await useRouteApi(xyCsourceSave, {schemaName: dynamicTenantId})(xy)

        // 在途操作
        let list2 = getDataSource().filter(it => !hasBlank(it.cwhcode))
        list2.forEach(async (a)=>{
          let baseQuantity=a.baseQuantity
          let stockcurr= await useRouteApi(findStockCurr, {schemaName: dynamicTenantId})([a])
          if(stockcurr.length>0){
            // 减少在途到货
            await useRouteApi(editByIdZTRK, {schemaName: dynamicTenantId})({id:stockcurr[0].id,ztrk:baseQuantity})
            // 增加在途入库
            await useRouteApi(editByIdCgrkAdd, {schemaName: dynamicTenantId})({id:stockcurr[0].id,ztrk:baseQuantity})
          }
        })
      }
    }
    tempTaskDel(taskInfo.value?.id)
    saveLogData('审核')
    message.success(`${b?'审核':'弃审'}成功！`)
    pageParameter.type='CGDHD'
    await contentSwitch('tail','')
  } else {
    if (hasBlank(a)) message.error('获取用户信息异常！')
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
  let form:any = formFuns.value.getFormValue();

  if (hasBlank(form.ccode)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '单据编号不能为空！'
    })
    return false
  }

  if (hasBlank(form.ddate)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '单据时间不能为空！'
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
  if (hasBlank(form.rate)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '税率不能为空！'
    })
    return false
  }
  if (hasBlank(form.cwhcode)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '仓库不能为空！'
    })
    return false
  }
  if (form.isGive&&!hasBlank(form.taxprice)&&parseFloat(form.taxprice)!==0) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '赠品不能有含税单价！'
    })
    return false
  }
  if (list.length == 0) {
    createWarningModal({
      title: '温馨提示',
      content: '列表完整内容至少存在一条!存货编码和数量为必填项,请补充完整!'
    })
    return false
  } else{
    let taxprice= list.filter(it =>it.taxprice==null&&it.tempTaxprice==null)
    if(taxprice.length>0){
      createErrorModal({
        iconType: 'warning',
        title: '温馨提示',
        content: '存货编码【'+taxprice.map(a=>a.cinvode)+'】含税单价不能为空！'
      })
      return false
    }
    let isum= list.filter(it =>it.tempIsum==null&&it.isum==null)
    if(isum.length>0){
      createErrorModal({
        iconType: 'warning',
        title: '温馨提示',
        content: '存货编码【'+isum.map(a=>a.cinvode)+'】价税合计不能为空！'
      })
      return false
    }

    let temp= list.filter(it =>it.cinvodeInfo?.stockPropertyBatch=='1' && hasBlank(trim(it.batchId)))
    if(temp.length>0){
      createErrorModal({
        iconType: 'warning',
        title: '温馨提示',
        content: '存货编码【'+temp.map(a=>a.cinvode)+'】批号为必填项！'
      })
      return false
    }
    let temp2= list.filter(it =>it.cinvodeInfo?.stockPropertyBatch=='1' && it.cinvodeInfo?.stockIndateManage=='1' && hasBlank(it.dvdate) && hasBlank(it.dpdate))
    if(temp2.length>0){
      createErrorModal({
        iconType: 'warning',
        title: '温馨提示',
        content: '存货编码【'+temp2.map(a=>a.cinvode)+'】失效日期为必填项！'
      })
      return false
    }
  }
  return true
}

const visible2 = ref(false);
const modelLoading = ref(true);
const modelText = ref('');
const modelText1 = ref('');
const modelText2 = ref('');

//数据保存
async function saveData() {
  let id = formItems.value.id
  formItems.value = formFuns.value.getFormValue()
  formItems.value.id = id // 制单人
  if(status.value==1){
    formItems.value.ccode =  await generateCode(useCompanyOperateStoreWidthOut().getLoginDate)
  }
  formItems.value.cmaker = useUserStoreWidthOut().getUserInfo.id // 制单人
  formItems.value.billStyle = pageParameter.type // 制单人
  formItems.value.bdocumStyle = "0"

  getDataSource().forEach(a=>{
    if(hasBlank(a.cwhcode)&&!hasBlank(a.cinvode)){
      a.cwhcode=formItems.value.cwhcode
    }
  })

  // 新的明细
  let list = getDataSource().filter(it => !hasBlank(it.cwhcode) && !hasBlank(it.cinvode) && !hasBlank(it.cunitid) && !hasBlank(it.baseQuantity))
  // 上游单据明细
  let symxList:any=[]
  if (saveCheck(list)) {
    list = list.map(it => ObjTool.dels(it, Object.keys(it).map(i => i.startsWith('edit') || i.startsWith('temp'))))
    for (let i = 0; i < list.length; i++) {
      let o=list[i]
      o['iyear'] = dynamicYear.value
      o['lineCode'] = o['key']
      o['lineId'] = (i + 1) + ''
      o['isGive'] = o['isGive'] ? '1' : '0'
      o['isBatch']=o['isBatch']?'1':'0'

      o['cwhcode1'] = o['cwhcode']
      if (o.cangkuDuli == '0'){
        let arr =  o['tempCangkuId']
        for (let j = 0; j < arr.split('\\').length; j++) {
          o[`cwhcode${j+1}`] = arr.split('\\')[j]
        }
      }
      // 有上游单据
      if(!hasBlank(o.sourcedetailId)){
        // 上游单据子表数据
        let sourceData=await useRouteApi(findByStockWarehLinecode, {schemaName: dynamicTenantId})(o.sourcedetailId)
        if(parseFloat(o.cnumber)!=parseFloat(o.oldCnumber)){
          sourceData.rukuStatus='0'
        }else{
          sourceData.rukuStatus='1'
        }
        // 参照并且是新增
        if(canzhao.value&&status.value==1){
          sourceData.isumDaohuo=hasBlank(sourceData.isumDaohuo)?o.baseQuantity:parseFloat(sourceData.isumDaohuo)+(parseFloat(o.baseQuantity))
        }else{
          // 一元二次方程
          sourceData.isumDaohuo=parseFloat(hasBlank(sourceData.isumDaohuo)?0:sourceData.isumDaohuo)+(parseFloat(o.baseQuantity)-parseFloat(o.oldBaseQuantity))
        }
        symxList.push(sourceData)
      }
    }

    let temp= await useRouteApi(findByStockCurrLock, {schemaName: dynamicTenantId})({iyear:dynamicYear.value,list:JSON.stringify(list)})
    if(temp[0]['revision']=='1'){
      visible2.value=true
      modelText.value=temp[0]['text']+''
      modelText1.value='现存量已被操作员【'+temp[0]['lockCreatedUserName']+'】锁定'
      modelText2.value='请稍后...'
      return false;
    }else if(temp[0]['revision']=='0'){
      await editStockCurrentRevison({id:temp[0].stockCurrentsId,revision:'1',lockUserId:useUserStoreWidthOut().getUserInfo.id,lockUserDate:newDate.value,lockReason:'CGDHD'})
    }

    visible2.value=false
    modelText.value=''
    modelText1.value=''
    modelText2.value=''
    formItems.value.entryList = JsonTool.json(list)

    if (formItems.value?.id == null)
      formItems.value.ccode = await generateCode(formItems.value.ddate)

    // 在编辑状态下 并且 没有来源单据
    else if(status.value===2){
      // 被删除的行
      if(rowDelData.value.length>0){
        rowDelData.value.forEach(async (a)=>{
          let baseQuantity=a[0].baseQuantity

          // 减去 在途到货
          let stockcurr= await useRouteApi(findStockCurr, {schemaName: dynamicTenantId})([a])
          if(stockcurr.length>0) await useRouteApi(editByIdZTRK, {schemaName: dynamicTenantId})({id:stockcurr[0].id,ztrk:baseQuantity})

          // 有上游单据
          if(canzhao.value){
            // 减去对应的上游单据明细 累计到货数量
            let sourceData=await useRouteApi(findByStockWarehLinecode, {schemaName: dynamicTenantId})(a[0].sourcedetailId)
            sourceData.isumDaohuo=parseFloat(hasBlank(sourceData.isumDaohuo)?0:sourceData.isumDaohuo)-parseFloat(baseQuantity)
            await useRouteApi(stockWarehListSave, {schemaName: dynamicTenantId})([sourceData])

            // 来源主表单据
            let superData:any = await useRouteApi(findBillByCondition, {schemaName: dynamicTenantId})({
              type: a.sourcetype,
              iyear: dynamicYear.value || '2022',
              action: 'tail',
              ccode: a.sourcecode,
              bdocumStyle: '',
              curr: ''
            })
            // 修改上游主表累计到货数量
            superData.daohuoStatus='0'
            await useRouteApi(reviewSetCGRKG, {schemaName: dynamicTenantId})(superData)

            // 增加 在途入库
            let stockcurr= await useRouteApi(findStockCurr, {schemaName: dynamicTenantId})([a])
            if(stockcurr.length>0) await useRouteApi(editByIdCgrkAdd, {schemaName: dynamicTenantId})({id:stockcurr[0].id,ztrk:baseQuantity})
          }
        })
      }
      // 没有上游单据
      if(!canzhao.value){
        for (let i = 0; i < list.length; i++) {
          if(list[i].id!==undefined){
            // 可用量不足 弹出框提示
            let currData=await useRouteApi(findByStockNumVerifyLack, { schemaName: dynamicTenantId })({list:JSON.stringify(list[i]),typeData:'cgrkd'})
            if(currData.length>0){
              return  openLackPage(true,{data:currData})
            }
          }
        }
      }

      let list2 = getDataSource().filter(it => !hasBlank(it.cwhcode) && !hasBlank(it.cinvode) && !hasBlank(it.cunitid) && !hasBlank(it.baseQuantity))
      for (let i = 0; i < list2.length; i++) {
        let stockcurr= await useRouteApi(findStockCurr, {schemaName: dynamicTenantId})([list2[i]])
        if(stockcurr.length>0){
          // 减在途到货
          await useRouteApi(editByIdZTRK, {schemaName: dynamicTenantId})({id:stockcurr[0].id,ztrk:list2[i].oldBaseQuantity})
        }
      }
    }
    // 有上游单据
    if(canzhao.value){
      //上游单据主表
      Array.from(new Set(symxList.map(s=>s.ccode))).forEach(async (main)=>{
        let rukuStatus:any=Array.from(new Set(symxList)).filter(a=>a.ccode==main)[0]?.rukuStatus
        // 修改上游主表累计到货数量
        let syMain=await useRouteApi(findStockWareByCcode, {schemaName: dynamicTenantId})(main)
        if(!hasBlank(rukuStatus)){
          syMain.rukuStatus=rukuStatus
        }
        await useRouteApi(reviewSetCGRKG, {schemaName: dynamicTenantId})(syMain)
        // 参照并保存&添加下游表
        if(canzhao.value&&status.value==1){
          let xy={iyear:dynamicYear.value,billStyle:sourceType.value,ccode:main,ccodeDate:Array.from(new Set(symxList)).filter(a=>a.ccode==main)[0]?.ddate,xyBillStyle:'CGDHD',xyccode:formItems.value.ccode,xyccodeDate:formItems.value.ddate}
          await useRouteApi(xyCsourceSave, {schemaName: dynamicTenantId})(xy)
        }
      })

      // 上游明细
      symxList.forEach(async (temp)=>{
        temp.isGive=temp.isGive?'1':'0'
        temp.isBatch=temp.isBatch?'1':'0'

        let data=list.filter(a=>a.cinvode==temp.cinvode&&(hasBlank(a.batchId)?'':a.batchId)==(hasBlank(temp.batchId)?'':temp.batchId)&& (hasBlank(a.dpdate)?'':a.dpdate)==(hasBlank(temp.dpdate)?'':temp.dpdate)&&(hasBlank(a.dvdate)?'':a.dvdate)==(hasBlank(temp.dvdate)?'':temp.dvdate))
        temp.isumDaohuo=parseFloat(hasBlank(temp.isumDaohuo)?0:temp.isumDaohuo)+parseFloat(hasBlank(data[0]?.baseQuantity)?0:data[0]?.baseQuantity)
      })
      await useRouteApi(stockWarehListSave, {schemaName: dynamicTenantId})(symxList)
    }

    loadMark.value=true
    await useRouteApi(saveRuKu, {schemaName: dynamicTenantId})(formItems.value)
      .then(async (data)=>{
        for (let i = 0; i < list.length; i++) {
          // 没有参照，修改状态 替换了 存货
          if(!hasBlank(list[i].oldCinvode)&&list[i].oldCinvode!==list[i].cinvode&&!canzhao.value){
            let stockcurr= await useRouteApi(findStockCurr, {schemaName: dynamicTenantId})([list[i]])
            let baseQuantity=list[i].baseQuantity
            if(stockcurr.length>0){
              await useRouteApi(editByIdZTRK, {schemaName: dynamicTenantId})({id:stockcurr[0].id,ztrk:baseQuantity})
            }
          }
          else{
            // 现存量存在
            let stockcurr= await useRouteApi(findStockCurr, {schemaName: dynamicTenantId})([list[i]])
            if(stockcurr.length>0){
              // 改在途到货-单独增加
              if(!canzhao.value){
                // 加
                await useRouteApi(editByIdZTRKAdd, {schemaName: dynamicTenantId})({id:stockcurr[0].id,ztrk:list[i].baseQuantity})
              }
            }else{
              // 增加在途入库数量,shenhe: 当作审核
              let map={list:JSON.stringify([list[i]]),shenhe:'1',dataType:'cgdh'}
              await useRouteApi(saveZTRK_XCL, {schemaName: dynamicTenantId})(map)
            }
          }
        }
      })
    editStockCurrentRevison({id:temp[0].stockCurrentsId,revision:'0',lockUserId:'',lockUserDate:''})
    tempTaskDel(taskInfo.value?.id)
    /************** 记录操作日志 ****************/
    saveLogData(status.value==1?'新增':'修改')
    /************** 记录操作日志 ****************/
    message.success('保存成功！')
    await contentSwitch('curr','')
    status.value = 3
  }
}
// 变动后保存
async function saveBiandong() {
  if(!biandongOper.value) pageReload();
  // 新的明细
  let list = getDataSource().filter(it => !hasBlank(it.cwhcode) && !hasBlank(it.cinvode) && !hasBlank(it.cunitid) && !hasBlank(it.baseQuantity) && !hasBlank(it.icost + '') && !hasBlank(it.price + ''))
  if (saveCheck(list)) {
    for (let i = 0; i < list.length; i++) {
      list[i].isGive=list[i].isGive?'1' : '0'
      list[i].isBatch=list[i].isBatch?'1' : '0'

      // 对应的存货现存量
      let stockcurr= await useRouteApi(findStockCurr, {schemaName: dynamicTenantId})([list[i]])
      let cha:any=parseFloat(list[i].oldBaseQuantity)-parseFloat(list[i].baseQuantity)
      console.log(cha,list[i].oldBaseQuantity,list[i].baseQuantity)
      // 减
      if(stockcurr.length>0) await useRouteApi(editByIdZTRK, {schemaName: dynamicTenantId})({id:stockcurr[0].id,ztrk:cha})
    }
    // 新编码
    let newccode=await useRouteApi(getBianDongNewCcode, {schemaName: dynamicTenantId})({})

    formItems.value.biandong='1'
    // 变更前主数据
    await useRouteApi(findStockWareByCcode, {schemaName: dynamicTenantId})(formItems.value.ccode)
      .then(async (a)=>{
        a.id=null
        a.ccode=a.ccode+'-'+newccode
        a.biandong='1'
        a.biandongUser=useUserStoreWidthOut().getUserInfo.id
        a.baindongDate=newDate.value
        // to变更表
        await useRouteApi(saveStockWarehousingPOJO, {schemaName: dynamicTenantId})(a)
      })
    // 变更前子数据
    await useRouteApi(findAllByCcodeAndBillStyle, {schemaName: dynamicTenantId})({ccode:formItems.value.ccode,type:'CGDHD'})
      .then(async (a)=>{
        a.forEach(item=>{
          item.id=null
          item.ccode=item.ccode+'-'+newccode
          item.biandong='1'
          item.biandongUser=useUserStoreWidthOut().getUserInfo.id
          item.baindongDate=newDate.value
        })
        // to变更zi表
        await useRouteApi(saveStockWarehousingsListPOJO, {schemaName: dynamicTenantId})(a)
      })

    formItems.value.squantity=sumArr(list.map(a=>a.baseQuantity))
    formItems.value.rukuStatus='0'
    await useRouteApi(reviewSetCGRKG, {schemaName: dynamicTenantId})(formItems.value)
    await useRouteApi(stockWarehListSave, {schemaName: dynamicTenantId})(list)

    // 执行有删除行的
    if(rowDelBianDongData.value.length>0){
      rowDelBianDongData.value.forEach(async (a)=>{
        await useRouteApi(deleteByStockWarehLineCode, {schemaName: dynamicTenantId})(a.lineCode)
      })
    }
    tempTaskDel(taskInfo.value?.id)
    /************** 记录操作日志 ****************/
    saveLogData('变更')
    /************** 记录操作日志 ****************/
    message.success('保存成功！')
    await pageReload()
    status.value = 3
  }
}
async function editStockCurrentRevison(map) {
  if(!hasBlank(map.id)){
    await useRouteApi(updateStockCurrentRevision,{schemaName: dynamicTenantId})(map)
  }
}
async function giveUp() {
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
  biandong.value = '0'
  canzhao.value=false
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

const disabledDate = (current) => {
  // 获取区间最小区间
  if (!hasBlank(formItems.value.handleDate)) {
    let variable:any = formItems.value.handleDate.substring(0, 7)
    let min = moment(variable + '-01', 'YYYY-MM-DD')
    let max = moment(variable, 'YYYY-MM-DD').endOf('month')
    return current < min || current > max
  }
};


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
  timeout = setTimeout(fake, 100);
}

const mark = usePlatformsStore().getCurrentPlatformId
const visible = ref(false);
const windowWidth = (document.documentElement.clientWidth - (70/*+280*/))
const totalColumnWidth = ref(0)
const dynamicColumnData:any = ref([])
const tableRef:any = ref(null)
const lanMuData = ref({
  accId: 'postgres',
  menuName: '采购到货单',
  type: '列表',
  objects: '',
  username: useUserStoreWidthOut().getUserInfo.username,
  changeNumber:0
})
let count2=0
const reloadColumns = () => {
  if(count2==1) return
  let newA = JSON.parse(JSON.stringify(CrudApi.columns))
  newA = assemblyDynamicColumn(dynamicColumnData.value.value, newA)
  setColumns(newA)
  initTableWidth(newA)
  pageReload()
  count2++
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
const thisEditType = ref('')
const [registerModalPopPage, {openModal: openMoalPopPage}] = useModal();
const [printModalRegister, {openModal: openpPintModalPage}] = useModal();
const [registerSelectDeptPage, {openModal: openSelectDeptPage}] = useModal()
const [registerStockCangKuModalPage, {openModal: openStockCangKuModalPage}] = useModal();
const [registerSelectPsnPage, {openModal: openSelectPsnPage}] = useModal()
const [registerSySourcePage, {openModal: openSySourcePage}] = useModal()
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
    case 'cvencode':
      openMoalPopPage(true, {
        database: dynamicTenantId.value,
        accId: dynamicAccId.value,
      });
      break;
    case 'cvencode2':
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
  if (thisEditObj.value) {
    if (thisEditType.value == 'cinvode') {
      thisEditObj.value['cinvodeInfo'] = o[0]
      thisEditObj.value['tempTwo'] = o[0].stockNum
    } else {
      // if (thisEditObj.value['cangkuDuli'] == '0') {
      thisEditObj.value['tempOne'] = o[0].id
      thisEditObj.value['tempCangkuId'] = o[0].cangkuId
      thisEditObj.value['cwhcodeInfo'] = o[0]
      thisEditObj.value['cwhcodeText'] = o[0].cangkuName
      thisEditObj.value['cangkuDuli'] = o[0].cangkuFlag

      // } else {
      //   thisEditObj.value['tempOne'] = o[0].id
      //   thisEditObj.value['cwhcodeText'] = o[0].cangkuName
      // }
    }
    focusNext(thisEditObj.value,thisEditType.value)
    // thisEditObj.value = null
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
  let o:any = assetsCardList.value.filter(it => it.stockNum == record.cinvode )[0]
  record.cinvodeName = o?.stockName || ''
  record.cinvodeType = o?.stockGgxh // 规格型号
  record.bcheck1 = o?.stockBarcode // 条形码
  record.isGive = record.isGive == '1'
  record.isumRuku = record.isumRuku
  record.cwhcodeText = ckListOptions.value.filter(it => it.id == record.cwhcode)[0]?.ckName

  // 计量类型
  record.cunitType = o?.stockMeasurementType ==  '单计量'?'1':'0'
  if (record.cunitType == '0'){ //
    let res =  manyJiList.value.filter(it=>it.id == o?.stockMeasurementUnit)[0]
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
  if(hasBlank(formFuns.value.getFormValue().cvencode)||hasBlank(formFuns.value.getFormValue().cwhcode)){
    return message.error('表头供应商和仓库不能为空!!')
  }
  if(biandong.value=='1'){
    console.log('主数量='+r.cnumber)
    console.log('原数量='+r.oldBaseQuantity)
    console.log('累计入库='+r.isumRuku)
    // 检查变动后到货单主数量是否大于等于累计入库数量
    if(parseFloat(r.cnumber)<parseFloat(hasBlank(r.isumRuku)?'0':r.isumRuku)){
      r.cnumber=null
      r.baseQuantity=null
      return message.error('到货单已生成下游采购入库单据，到货单数量不能小于下游入库单数量，请重新输入变动数量！')
    }
    // 检查变动后到货单主数量是否大于等于累计开票数量
    if(parseFloat(r.cnumber)<parseFloat(hasBlank(r.isumFapiao)?'0':r.isumFapiao)){
      r.cnumber=null
      r.baseQuantity=null
      return message.error('到货单已生成下游采购发票单据，到货单数量不能小于下游发票数量，请重新输入变动数量！')
    }

    // 若到货数量变小，请检查变动差额是否大于等于可用量
    let stockcurr= await useRouteApi(findStockCurr, {schemaName: dynamicTenantId})([r])
    if(stockcurr.length>0){
      let baseQuantity=parseFloat(r.cnumber)
      let oldBaseQuantity=parseFloat(hasBlank(r.oldBaseQuantity)?'0':r.oldBaseQuantity)
      // 小于
      if(parseFloat(r.cnumber)<parseFloat(hasBlank(r.oldBaseQuantity)?'0':r.oldBaseQuantity)){
        let cha=oldBaseQuantity-baseQuantity
        let keyong=parseFloat(stockcurr[0].baseQuantity)+parseFloat(stockcurr[0].ztrkQuantityCgdh)+parseFloat(stockcurr[0].ztrkQuantityCgrk)+parseFloat(stockcurr[0].ztrkQuantityQtrk)+parseFloat(stockcurr[0].ztrkQuantityCcprk)+parseFloat(stockcurr[0].ztrkQuantityInt)
          -parseFloat(stockcurr[0].ztckQuantityXhd)+parseFloat(stockcurr[0].ztckQuantityXsck)+parseFloat(stockcurr[0].ztckQuantityClly)+parseFloat(stockcurr[0].ztckQuantityQtck)+parseFloat(stockcurr[0].ztckQuantityOut)
        console.log(cha,keyong)
        if(cha<keyong){
          r.cnumber=null
          r.baseQuantity=null
          return message.error('到货单数量变动后减少，致当前存货可用量不足，请重新输入变动数量！')
        }
      }
    }
  }
  else if(biandong.value!='1'&&!canzhao){
    // 改变 存货编码时进行
    if(!hasBlank(r.oldCinvode)&&(!hasBlank(r.cinvode)||!hasBlank(r.tempTwo))&&r.oldCinvode!==r.tempTwo){
      let stockcurr= await useRouteApi(findStockCurr, {schemaName: dynamicTenantId})([r])
      if(stockcurr.length>0&&parseFloat(r.tempSix)<parseFloat(stockcurr[0].ztrkQuantityCgdh)){
        r.tempTwo=r.oldCinvode
        r.tempSix=r.oldBaseQuantity
        return message.error('存货主数量不能小于在途入库数量!!')
      }
    }else{
      let stockcurr= await useRouteApi(findStockCurr, {schemaName: dynamicTenantId})([r])
      if(stockcurr.length>0&&parseFloat(r.tempSix)<parseFloat(stockcurr[0].ztrkQuantityCgdh)){
        r.tempSix=r.oldBaseQuantity
        return message.error('存货主数量不能小于在途入库数量!')
      }
    }
  }

  let h = formFuns.value.getFormValue();
  if (hasBlank(r.cwhcode) && !hasBlank(h.cwhcode)){
    let cangkuInfo:any =  ckListOptions.value.filter(it => it.id == h.cwhcode)[0]
    if (null != cangkuInfo) {
      r['cangkuDuli'] = cangkuInfo.ckIsDuli
      if (cangkuInfo.ckIsDuli == '1') {
        r['cwhcode'] = h.cwhcode
        r['cwhcodeText'] = cangkuInfo.ckName
      }
    }
  }
  r.itaxrate=isNaN(r.itaxrate)?null:r.itaxrate
  switch (c) {
    case 'cgUnitId':
      if(!hasBlank(r.cgUnitId)) biandongOper.value=true
      break;
    case 'cnumber':
      let o:any = assetsCardList.value.filter(it => tempType.value=='one'?(it.stockNum == r.cinvode) :tempType.value=='three'? (it.stockBarcode == r.bcheck1) : (it.stockName == r.cinvodeName))[0]
      r.cinvodeInfo = o
      if(r.cinvodeInfo.stockMeasurementType=='单计量'){
        r.baseQuantity=r.cnumber
        tableDataChange(r,'itaxrate')
      }
      else{
        slChange0(r)
      }
      // 获取供应商价格表
      findBySupPrice(r)
      if(!hasBlank(r.cnumber)) biandongOper.value=true
      break;
    case 'dvdate':
      if (r.cinvodeInfo.stockIndateManage == '1'){
        r.dpdate = formatTimer(dayjs(formatTimer(r.dvdate), dateFormat).subtract(parseInt(r.cinvodeInfo.stockIndateDuration), 'day').add(1, 'day'))
        r.tempDpdate=r.dpdate
      }
      break;
    case 'dpdate':
      if (r.cinvodeInfo.stockIndateManage == '1'){
        r.dvdate = formatTimer(dayjs(formatTimer(r.dpdate), dateFormat).add(parseInt(r.cinvodeInfo.stockIndateDuration), 'day').subtract(1, 'day'))
        r.tempFifteen=r.dvdate
      }
      break;
    case 'bcheck1':
      if(r.bcheck1!==undefined){
        chChange(r)
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
        let d:any = parseFloat(r.price).toFixed(10)
        r.icost = parseFloat(String(n * d)).toFixed(4) + ''
        r.tempTen = r.icost
        r.price = d + ''

        // 含税单价
        let itaxrate:any=hasBlank(r.itaxrate)?1:1+(r.itaxrate/100)
        r.taxprice=r.price*itaxrate>0?parseFloat(String(r.price*itaxrate)).toFixed(10):null
        r.tempTaxprice=r.price*itaxrate>0?parseFloat(String(r.price*itaxrate)).toFixed(10):null
        // 价税合计
        r.isum=parseFloat(String(r.icost*itaxrate)).toFixed(4)
        r.tempIsum=parseFloat(String(r.icost*itaxrate)).toFixed(4)
        // 税额
        r.itaxprice=r.isum-r.icost>0?parseFloat(String(r.isum-r.icost)).toFixed(4):null
      }
      break;
    case 'icost':
      if (!hasBlank(r.cnumber) && !hasBlank(r.icost)) { //反算 单价
        let n:any = parseFloat(r.cnumber).toFixed(10)
        if (titleValue.value != 0 && n > 0) n = 0 - (Math.abs(n))
        let d:any = parseFloat(r.icost).toFixed(4)
        r.icost = d + ''
        r.tempTen = d + ''
        r.price = parseFloat(String(d / n)).toFixed(10) + ''

        // 含税单价
        let itaxrate=hasBlank(r.itaxrate)?1:1+(r.itaxrate/100)
        r.taxprice=r.price*itaxrate>0?parseFloat(String(r.price*itaxrate)).toFixed(10):null
        r.tempTaxprice=r.price*itaxrate>0?parseFloat(String(r.price*itaxrate)).toFixed(10):null
        // 价税合计
        r.isum=parseFloat(String(r.icost*itaxrate)).toFixed(4)
        r.tempIsum=parseFloat(String(r.icost*itaxrate)).toFixed(4)
        // 税额
        r.itaxprice=r.isum-r.icost>0?parseFloat(String(r.isum-r.icost)).toFixed(4):null
      }
      break;// 无税金额
    case 'itaxrate':// 税率 【itaxprice 税额】
      if(!hasBlank(r.cnumber) && !hasBlank(r.itaxrate)){
        let str=''
        if(!hasBlank(r.price)){
          str='price'
        }else if(!hasBlank(r.icost)){
          str='icost'
        }else if(!hasBlank(r.taxprice)){
          str='taxprice'
        }else if(!hasBlank(r.isum)){
          str='isum'
        }
        tableDataChange(r,str)
      }
      break;
    case 'taxprice':// 含税单价
      if (!hasBlank(r.cnumber) && !hasBlank(r.taxprice)) {
        let n:any = parseFloat(r.cnumber).toFixed(10)
        if (titleValue.value != 0 && n > 0) n = 0 - (Math.abs(n))
        let d:any = parseFloat(r.taxprice).toFixed(10)
        r.isum = parseFloat(String(n * d) ).toFixed(4) + ''
        r.tempIsum = r.isum

        // 变动时判断
        if(biandong.value=='1'&&parseFloat(r.isum)<(hasBlank(r.hxIsum)?0:parseFloat(r.hxIsum))){
          r.tempIsum=null
          r.isum=r.tempIsum
          r.tempSix=null
          r.baseQuantity=r.tempSix
          message.error('到货单已完成部分付款核销，到货单价税合计不能小于已付款核销金额，请重新输入价税合计！')
          break;
        }
        let itaxrate:any=hasBlank(r.itaxrate)?1:1+(r.itaxrate/100)
        // 无税金额
        r.tempTen =parseFloat(String(r.isum/itaxrate)).toFixed(4)
        r.icost =r.tempTen
        // 无税单价
        r.tempNine =parseFloat(String(r.icost/n)).toFixed(10)
        r.price =r.tempNine
        // 税额
        r.itaxprice=r.isum-r.icost>0?parseFloat(String(r.isum-r.icost)).toFixed(4):null
      }
      break;
    case 'isum':// 价税合计
      if (!hasBlank(r.cnumber) && !hasBlank(r.isum)) { //反算 单价
        let n:any = parseFloat(r.cnumber).toFixed(10)
        if (titleValue.value != 0 && n > 0) n = 0 - (Math.abs(n))
        let d:any = parseFloat(r.isum).toFixed(4)

        // 变动时判断
        if(biandong.value=='1'&&parseFloat(r.isum)<(hasBlank(r.hxIsum)?0:parseFloat(r.hxIsum))){
          r.tempIsum=null
          r.isum=r.tempIsum
          r.tempSix=null
          r.baseQuantity=r.tempSix
          message.error('到货单已完成部分付款核销，到货单价税合计不能小于已付款核销金额，请重新输入价税合计！')
          break;
        }

        r.taxprice = d/n>0?parseFloat(String(d/n) ).toFixed(10) + '':null
        r.tempTaxprice = r.taxprice

        let itaxrate:any=hasBlank(r.itaxrate)?1:1+(r.itaxrate/100)
        // 无税金额
        r.tempTen =parseFloat(String(r.isum/itaxrate)).toFixed(4)
        r.icost =r.tempTen
        // 无税单价
        r.tempNine =parseFloat(String(r.icost/n)).toFixed(10)
        r.price =r.tempNine
        // 税额
        r.itaxprice=r.isum-r.icost>0?parseFloat(String(r.isum-r.icost)).toFixed(4):null
      }
      break;
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
const chChange = async (record) => {
  let o:any = assetsCardList.value.filter(it => tempType.value=='one'?(it.stockNum == record.cinvode) :tempType.value=='three'? (it.stockBarcode == record.bcheck1) : (it.stockName == record.cinvodeName))[0]
  record.unitList=[]
  record.cinvodeInfo = o
  record.cinvodeName = o?.stockName
  record.cinvode = o?.stockNum
  record.cinvodeType = o?.stockGgxh // 规格型号
  record.bcheck1 = o?.stockBarcode // 条形码
  // 计量类型
  record.cunitType = o?.stockMeasurementType == '单计量'?'1':'0'
  record.cunitid = o?.stockMeasurementUnit // 计量类型
  record.isBatch = o?.stockPropertyBatch == '1' // 批号必须输入
  record.isIndate = o?.stockIndateManage == '1' // 有效期必须输入
  record.baseQuantity=null
  record.subQuantity1=null

  if (o?.stockMeasurementType == '多计量' && !hasBlank(record.cunitid)){
    let res:any =  manyJiList.value.filter(it=>it.id == record.cunitid)[0]
    if (res != null){
      record.unitInfo = res
      let list = JsonTool.parseObj(res.detail) || []
      list=list.filter(jl=>!hasBlank(jl.unitName))
      if (list.length > 0){
        if(!hasBlank(o?.stockUnitName)){
          record.unitList=[{title:o?.stockUnitName,value:o?.stockUnitId,ggxh:o?.stockGgxh,txm:o?.stockBarcode}]
        }
        else{
          // 可能是之前的存货档案,也可能是导入进来的
          let res:any =  manyJiList.value.filter(it=>it.id == record.cunitid)[0]
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
              txm: o?.stockUnitBarcode1
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
              txm: o?.stockUnitBarcode1
            })
            record.unitList.push({title:o?.stockUnitName2,value:o?.stockUnitId2,ggxh:o?.stockUnitGgxh2,txm:o?.stockUnitBarcode2})
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
      console.log(djlData?.id)
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
  await findByPrice(record)
}
const {proxy}:any = getCurrentInstance()

const isGiveChange = (r) => {
  if (r.isGive){
    r.tempNine=0;
    r.price=r.tempNine
    r.tempTen=0;
    r.icost=r.tempTen
    r.tempTaxprice=0;
    r.taxprice=r.tempTaxprice
    r.tempIsum=0;
    r.isum=r.tempIsum
    tableDataChange(r,'taxprice')
  }else {
    message.info('请完善单价！')
  }
}
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
  let filters:any = ['bcheck1','isGive','cinvodeType','cinvodeName','cunitid','cunitidF1','cunitidF2','itaxprice','baseQuantity','subQuantity1', 'subQuantity2']
  // 要求填批号才填写
  if (!r.isBatch)filters.push('batchId')
  if (!r.isIndate)filters.push('dpdate'),filters.push('dvdate')
  // 单计量跳过计量1、2
  // if (r.cunitType=='1')filters.push('subQuantity1'),filters.push('subQuantity2');
  let cols:any = getColumns().filter(it=>it?.title!='序号' &&  filters.indexOf(it?.dataIndex) == -1 && it.ifShow)
  let index = list.findIndex(it => it.key == r.key)
  let nextC = cols[0]?.dataIndex // 获取下一个列位置

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
      getColumnRate(r)
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
  let model = {cnumber:'Cnumber',cgUnitId:'CgUnitId',cwhcode:'One',cinvode:'Two',price:'Nine',icost:'Ten',taxprice:'Taxprice',itaxrate:'Itaxrate',isum:'Isum',batchId:'Twelve',dpdate:'Dpdate',dvdate:'Fifteen',cmemo:'Thirteen'}
  if (b){
    // 获取下一个
    let keys= Object.keys(model)
    return model[keys[keys.findIndex(k=>k == c)+1]]
  }else {
    return model[c]
  }
}

async function findBySupPrice(data) {
  let cinvode=data.cinvode
  let cvencodeJs=formFuns.value.getFormValue().cvencodeJs
  let supPrice=await useRouteApi(stockSupPriceFindBySupIdAndStockNum, {schemaName: dynamicTenantId})({supId:cvencodeJs,stockNum:cinvode})
  let memberprice=supPrice!==''?supPrice.memberprice:null

  if(supPrice!==''){
    // 供应商价格表含税（默认值1是，0或空否）
    if(stockAccountObj.value.cgPriceIsRate=='1'){
      memberprice=memberprice
    }
    else{
      if(data['tempItaxrate']==0){
        memberprice=data['tempNine']
      }else{
        memberprice=memberprice*(data['tempItaxrate']/100)
      }
    }
  }
  else{
    // 若价格表未设置取最近一次进价（默认值1是，0或空否）
    if(stockAccountObj.value.cgPriceZjyc=='1'){
      let temp= await useRouteApi(findByStockWareRecentlySupMoney, {schemaName: dynamicTenantId})({supId:formFuns.value.getFormValue().cvencode})
      memberprice=temp==''?null:temp
    }
  }
  data['tempNine']=hasBlank(data['tempNine'])?memberprice:data['tempNine']
  data['tempTaxprice']=hasBlank(data['tempTaxprice'])?memberprice:data['tempTaxprice']
}

// 判断是否有结账月
async function countStockPeriodYmFlag(year,flags) {
  let temp=await findStockPeriodYmFlag(year,flags)
  ymPeriod.value=temp>0?true:false
}

// 查看来源数据
function sySourcePop() {
  if(formItems.value.ccode==undefined){
    return message.error(`没有来源数据！`)
  }
  openSySourcePage(true, {
    database: dynamicTenantId.value,
    ccode:formItems.value.ccode
  })
}
// 查看下游数据
function xySourcePop() {
  if(formItems.value.ccode==undefined){
    return message.error(`没有下游数据！`)
  }
  openXySourcePage(true, {
    database: dynamicTenantId.value,
    ccode:formItems.value.ccode
  })
}

// 生成采购入库单
async function setCGRKD_data() {
  let ddate=''
  if(parseFloat(useCompanyOperateStoreWidthOut().getLoginDate.replaceAll('-',''))<parseFloat(formItems.value.ddate.replaceAll('-',''))){
    ddate=formItems.value.ddate
  }else{
    ddate=useCompanyOperateStoreWidthOut().getLoginDate
  }

  // 日期是否已结账
  let temp=await useRouteApi(findByStockPeriodIsClose, {schemaName: dynamicTenantId})({iyear:ddate.split('-')[0],month:ddate.split('-')[1]})
  if(temp>0){
    setTimeout(()=>{
      return message.error('当前单据业务期间已经结账，不能进行变更操作，请取消期间结账后继续！！')
    },1000)
  }

  // 有无 任务
  let xclTaskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'采购到货单',method:'生单'})
  if(!hasBlank(xclTaskData)){
    return message.error('当前单据正在被'+xclTaskData.caozuoName+'操作员进行'+xclTaskData.method+'业务处理，任务互斥，请销后再试！')
  }

  createConfirm({
    iconType: 'warning',
    title: '生成采购入库单',
    content: '您确定要生成采购入库单吗!',
    onOk: async () => {
      let oldNum=formItems.value.ccode
      let oldddate=formItems.value.ddate
      let newRuKuNum=await useRouteApi(findBillCode, {schemaName: dynamicTenantId})({type: "CGRKD",date:  ddate,prefix: "",key: '3-10'})

      let res = await useRouteApi(findBillByCondition, {schemaName: dynamicTenantId})({
        type: pageParameter.type,
        iyear: dynamicYear.value || '2022',
        action: 'tail',
        ccode: '',
        bdocumStyle: '0',
        curr: ''
      })

      let list = JsonTool.parseObj(res.entryList).map(it => resetRow(it))
      let oldlist = JsonTool.parseObj(res.entryList).map(it => resetRow(it))
      let list2:any =JsonTool.parseObj(res.entryList).map(it => resetRow(it))
      let list3:any =JsonTool.parseObj(res.entryList).map(it => resetRow(it))

      let cgrkd= list3.filter(a=>a.sourcetype=='CGRKD')
      if(cgrkd.length>0){
        return message.error('当前到货单为参照采购入库单生成，不能进行采购入库单循环生单操作！')
      }
      // 生成入库单明细
      let listarr:any=[]

      for (let i = 0; i < list.length; i++) {
        let temp=list[i]
        temp.isGive=temp.isGive?'1':'0'
        temp.isBatch=temp.isBatch?'1':'0'
        let parentLineCode=temp.lineCode
        // 寻找就数据
        let oldData=oldlist.filter(a=>a.key==temp.key)
        let unitRate= await useRouteApi(getUnitRate, {schemaName: dynamicTenantId})({cgUnitId:temp.cgUnitId,ccode:temp.ccode})

        temp.cnumber=(parseFloat(oldData[0]?.baseQuantity)-parseFloat(hasBlank(oldData[0]?.isumRuku)?0:oldData[0]?.isumRuku))/parseFloat(unitRate?.conversionRate)
        let baseQuantity:any=parseFloat(temp.cnumber)
        temp.tempCnumber=baseQuantity
        temp.cnumber=baseQuantity

        // 计算主计量....
        slChange0(temp)

        temp.id=null
        temp.bdocumStyle='0'
        temp.billStyle='CGRKD'
        temp.ccode=newRuKuNum
        temp.lineCode=randomString(30)
        temp.bcheck='0'
        temp.bcheckTime=''
        temp.bcheckUser=''
        temp.isumRuku=''
        temp.sourcetype='CGDHD'
        temp.sourcecode=oldNum
        temp.sourcedetailId=parentLineCode
        temp.sourcedate=oldddate

        if(baseQuantity>0){
          listarr.push(temp)
        }
      }

      if(listarr.length==0){
        message.error('数量不足，无法生成采购入库单')
        return false;
      }
      await useRouteApi(stockBalanceTaskSave, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,userName:useUserStoreWidthOut().getUserInfo.id,functionModule:'采购到货单',method:'生单'})
      list2.forEach(async (temp)=>{
        temp.isGive=temp.isGive?'1':'0'
        temp.isBatch=temp.isBatch?'1':'0'

        let data=listarr.filter(a=>a.cinvode==temp.cinvode&&(hasBlank(a.batchId)?'':a.batchId)==(hasBlank(temp.batchId)?'':temp.batchId)&& (hasBlank(a.dpdate)?'':a.dpdate)==(hasBlank(temp.dpdate)?'':temp.dpdate)&&(hasBlank(a.dvdate)?'':a.dvdate)==(hasBlank(temp.dvdate)?'':temp.dvdate))
        temp.tempBaseQuantity=parseFloat(hasBlank(data[0]?.baseQuantity)?0:data[0]?.baseQuantity)
        temp.isumRuku=parseFloat(hasBlank(temp.isumRuku)?0:temp.isumRuku)+parseFloat(hasBlank(data[0]?.baseQuantity)?0:data[0]?.baseQuantity)
      })
      // 修改本单据子表的 累计入库数量
      await useRouteApi(stockWarehListSave, {schemaName: dynamicTenantId})(list2)
      res.rukuStatus='1'
      await useRouteApi(reviewSetCGRKG, {schemaName: dynamicTenantId})(res)

      // 生成入库单
      formItems.value.id=null
      formItems.value.ccode=newRuKuNum
      formItems.value.billStyle='CGRKD'
      formItems.value.bcheck=''
      formItems.value.bcheckTime=''
      formItems.value.bcheckUser=''
      formItems.value.bdocumStyle='0'
      formItems.value.isum=sumArr(listarr.map(a=>a.isum))
      formItems.value.icost=sumArr(listarr.map(a=>a.icost))
      formItems.value.squantity=sumArr(listarr.map(a=>a.baseQuantity))
      formItems.value.taxAmount=sumArr(listarr.map(a=>a.itaxprice))

      await useRouteApi(reviewSetCGRKG, {schemaName: dynamicTenantId})(formItems.value)
      await useRouteApi(reviewSetCGRKGMx, {schemaName: dynamicTenantId})(listarr)
      // 添加下游表
      let xy={iyear:dynamicYear.value,billStyle:'CGDHD',ccode:oldNum,ccodeDate:oldddate,xyBillStyle:'CGRKD',xyccode:newRuKuNum,xyccodeDate:oldddate}
      await useRouteApi(xyCsourceSave, {schemaName: dynamicTenantId})(xy)

      // 现存量操作
      listarr.forEach(async (a)=>{
        let baseQuantity=a.baseQuantity
        let stockcurr= await useRouteApi(findStockCurr, {schemaName: dynamicTenantId})([a])
        if(stockcurr.length>0){
          // 减少在途到货
          await useRouteApi(editByIdZTRK, {schemaName: dynamicTenantId})({id:stockcurr[0].id,ztrk:baseQuantity})
          // 增加在途入库
          await useRouteApi(editByIdCgrkAdd, {schemaName: dynamicTenantId})({id:stockcurr[0].id,ztrk:baseQuantity})
        }
      })

      await contentSwitch('curr','')
      message.success(`生成采购入库单成功！`)
      await useRouteApi(stockBalanceTaskDelByUserName, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,userName:useUserStoreWidthOut().getUserInfo.username,functionModule:'采购到货单',method:'生单'})
      // 跳转入库单页面
      router.push({path:'/kc-cgDepot',query:{type:'info',ccode:newRuKuNum}})
    }
  })
}
// 生成退货单
async function setCGTHD_data() {
  let ddate=''
  if(parseFloat(useCompanyOperateStoreWidthOut().getLoginDate.replaceAll('-',''))<parseFloat(formItems.value.ddate.replaceAll('-',''))){
    ddate=formItems.value.ddate
  }else{
    ddate=useCompanyOperateStoreWidthOut().getLoginDate
  }

  // 日期是否已结账
  let temp=await useRouteApi(findByStockPeriodIsClose, {schemaName: dynamicTenantId})({iyear:ddate.split('-')[0],month:ddate.split('-')[1]})
  if(temp>0){
    setTimeout(()=>{
      return message.error('当前单据业务期间已经结账，不能进行变更操作，请取消期间结账后继续！！')
    },1000)
  }

  // 有无 任务
  let xclTaskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'采购到货单',method:'生单'})
  if(!hasBlank(xclTaskData)){
    return message.error('当前单据正在被'+xclTaskData.caozuoName+'操作员进行'+xclTaskData.method+'业务处理，任务互斥，请销后再试！')
  }

  createConfirm({
    iconType: 'warning',
    title: '生成采购退货单',
    content: '您确定要生成采购退货单吗!',
    onOk: async () => {
      let oldNum=formItems.value.ccode
      let oldddate=formItems.value.ddate
      let newRuKuNum=await useRouteApi(findBillCode, {schemaName: dynamicTenantId})({type: "CGDHD",date:  ddate,prefix: "",key: '3-1'})

      let res = await useRouteApi(findBillByCondition, {schemaName: dynamicTenantId})({
        type: pageParameter.type,
        iyear: dynamicYear.value || '2022',
        action: 'tail',
        ccode: '',
        bdocumStyle: '0',
        curr: ''
      })
      let list = JsonTool.parseObj(res.entryList).map(it => resetRow(it))
      let oldlist = JsonTool.parseObj(res.entryList).map(it => resetRow(it))
      let cgrkd= oldlist.filter(a=>a.sourcetype=='CGRKD')
      if(cgrkd.length>0){
        return message.error('当前到货单为参照采购入库单生成，不能进行采购入库单循环生单操作！')
      }
      // 生成入库单明细
      let listarr:any=[]
      titleValue.value=1
      for (let i = 0; i < list.length; i++) {
        let temp=list[i]
        temp.isGive=temp.isGive?'1':'0'
        temp.isBatch=temp.isBatch?'1':'0'
        let parentLineCode=temp.lineCode
        // 寻找就数据
        let oldData=oldlist.filter(a=>a.key==temp.key)
        let unitRate= await useRouteApi(getUnitRate, {schemaName: dynamicTenantId})({cgUnitId:temp.cgUnitId,ccode:temp.ccode})
        temp.cnumber=(parseFloat(oldData[0]?.baseQuantity)-parseFloat(hasBlank(oldData[0]?.isumRuku)?0:oldData[0]?.isumRuku))/parseFloat(unitRate?.conversionRate)
        let baseQuantity:any=parseFloat(temp.cnumber)*-1
        temp.tempCnumber=baseQuantity
        temp.cnumber=baseQuantity

        // 计算主计量....
        slChange0(temp)

        temp.id=null
        temp.bdocumStyle='0'
        temp.billStyle='CGRKD'
        temp.ccode=newRuKuNum
        temp.lineCode=randomString(30)
        temp.bcheck='0'
        temp.bcheckTime=''
        temp.bcheckUser=''
        temp.isumRuku=''
        temp.sourcetype='CGDHD'
        temp.sourcecode=oldNum
        temp.sourcedetailId=parentLineCode
        temp.sourcedate=oldddate

        if(baseQuantity!=0){
          listarr.push(temp)
        }
      }
      titleValue.value=0
      if(listarr.length==0){ return message.error('数量不足，无法生成采购入库单') }
      res.id=null
      res.entryList = JsonTool.json(listarr)
      // 跳转入库单页面
      router.push({path:'/cg-return',query:{type:'add',ccode:JSON.stringify(res)}})
    }
  })
}
function sumArr(arr) {
  if(arr.length==0)return
  return arr.reduce(function(prev, curr, idx, arr){
    return parseFloat(prev) + parseFloat(curr);
  });
}
function sumSub(arr) {
  if(arr.length==0)return
  return arr.reduce(function(prev, curr, idx, arr){
    return parseFloat(prev) - parseFloat(curr);
  });
}
function openPrint(){
  openpPintModalPage(true, {schemaName: dynamicTenantId.value})
}

const showPrintSetting = ref(false)
function openPrintSetting(){
  showPrintSetting.value = true
}

async function findByBdocumStyle() {
  contentSwitch('tail','')
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
      year: '',mark:  router.currentRoute?.value?.fullPath.replace('/',''),
      pageName:'采购到货单'
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
    etc.cvencode = getCustName(etc.cvencode)
    etc.cvencodeJs =  getCustName(etc.cvencodeJs)
    etc.cwhcode = ckListOptions.value.filter(it => it.id == etc.cwhcode)[0]?.ckName
    etc.cdepcode = hasBlank(etc.cdepcode)?'':(formFuns.value.getSelectMap()['dept']?.filter(it=>it.value == etc.cdepcode)[0]?.label || '')
    etc.cpersoncode = hasBlank(etc.cpersoncode)?'':getUserName(etc.cpersoncode)
    etc.bcheckUser = etc.bcheck == null?'': formatUniqueOperator(etc?.bcheckUser)
    etc.cmaker = formatUniqueOperator(etc?.cmaker)
    dataArr.forEach((item,index)=>{
      item['cwhcode'] = item.cangkuDuli == '0'? assemblyName(item.cwhcode.split("\\")):ckListOptions.value.filter(it => it.id == item.cwhcode)[0]?.ckName
      item['cgUnitId'] = cunitFormat(item.unitList,item.cgUnitId)
      item['cnumber'] =  parseFloat(item.cnumber).toFixed(2)
      item['cunitid'] = cunitFormat(item.unitList,item.cunitid)
      item['baseQuantity'] = parseFloat(item.baseQuantity).toFixed(2)
      item['taxprice'] =  parseFloat(item.taxprice).toFixed(2)
      item['isum'] = parseFloat(item.isum).toFixed(2)
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
const getCustName = (v) => {
  return setString((custList.value.filter(it=>v==it.value)[0]?.label || ''),16)
}
const getUserName = (v) => {
  return (userList.value.filter(it => it.value == v)[0]?.label || '')
}
//js切割字符串
function setString(str, len) {
  if(hasBlank(str)) return
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
// 算出单价
async function findByPrice(record) {
  let o:any = assetsCardList.value.filter(it => tempType.value=='one'?(it.stockNum == record.cinvode) :tempType.value=='three'? (it.stockBarcode == record.bcheck1) : (it.stockName == record.cinvodeName))[0]
  record.cinvodeInfo = o
  if (record.cinvodeInfo?.stockMeasurementType == '多计量' && !hasBlank(record.cunitid)){
    let res:any =  manyJiList.value.filter(it=>it.id == record.cunitid)[0]
    if (res != null){
      record.unitInfo = res
      let list = JsonTool.parseObj(res.detail) || []
      list=list.filter(jl=>!hasBlank(jl.unitName))
      if (list.length > 0){
        record.cunitid = list[0].id
        if (list.length > 1){
          record.cunitidF1 = list[1].id
          if (list.length > 2)
            record.cunitidF2 = list[2].id
        }
      }
      await setByPrice(record)
    }
    tableDataChange(record,'cnumber')
  }
  else{
    // 获取对应供应商价格表【采购价格表】
    if(!hasBlank(record.cinvodeInfo.stockSupplier)){
      let data=await useRouteApi(findByStockSupplierPrice, {schemaName: dynamicTenantId})(record.cinvodeInfo.stockNum)
      if(data.length>0){
        let money:any=0
        switch (data[0].supPriceLevel) {
          case '协议价':
            money=data[0].memberprice
            break
          case '零售价':
            money=data[0].regularPrice
            break
          case '最低价':
            money=data[0].minPrice
            break
          case '最高价':
            money=data[0].maxPrice
            break
          case '一级采购价':
            money=data[0].invscost1
            break
          case '二级采购价':
            money=data[0].invscost2
            break
          case '三级采购价':
            money=data[0].invscost3
            break
          case '四级采购价':
            money=data[0].invscost4
            break
          case '五级采购价':
            money=data[0].invscost5
            break
          case '六级采购价':
            money=data[0].invscost6
            break
          case '七级采购价':
            money=data[0].invscost7
            break
          case '八级采购价':
            money=data[0].invscost8
            break
        }

        if(money>0){
          record.tempTaxprice=parseFloat(money).toFixed(2)
          record.taxprice=record.tempTaxprice

          record.baseQuantity=record.cnumber
        }
      }
    }
    tableDataChange(record,'taxprice')
  }
}

async function setByPrice(record){
  // 获取对应供应商价格表【采购价格表】
  if(!hasBlank(record.cinvodeInfo.stockSupplier)){
    let data=await useRouteApi(findByStockSupplierPrice, {schemaName: dynamicTenantId})(record.cinvodeInfo.stockNum)
    if(data.length>0){
      let money:any=0
      switch (data[0].supPriceLevel) {
        case '协议价':
          money=data[0].memberprice
          break
        case '零售价':
          money=data[0].regularPrice
          break
        case '最低价':
          money=data[0].minPrice
          break
        case '最高价':
          money=data[0].maxPrice
          break
        case '一级采购价':
          money=data[0].invscost1
          break
        case '二级采购价':
          money=data[0].invscost2
          break
        case '三级采购价':
          money=data[0].invscost3
          break
        case '四级采购价':
          money=data[0].invscost4
          break
        case '五级采购价':
          money=data[0].invscost5
          break
        case '六级采购价':
          money=data[0].invscost6
          break
        case '七级采购价':
          money=data[0].invscost7
          break
        case '八级采购价':
          money=data[0].invscost8
          break
      }

      let list:any =  duoJlMxList.value.filter(a=>a.id==record.cgUnitId)
      let conversionRate:any= list[0].conversionRate
      let price:any=parseFloat(conversionRate)*parseFloat(money)
      if(price>0){
        record.tempTaxprice=parseFloat(price).toFixed(10)
        record.taxprice=record.tempTaxprice
      }
    }
  }
}
async function cgUnitIdChange(record) {
  if(status.value==1){
    record.cinvodeType= record.unitList.filter(a=>a.value==record.tempCgUnitId)[0].ggxh
    record.bcheck1= record.unitList.filter(a=>a.value==record.tempCgUnitId)[0].txm
    record.cgUnitId=record.unitList.filter(a=>a.value==record.tempCgUnitId)[0].value
    await findByPrice(record)
  }else{
    await editUnitType(record)
  }
}

// 修改状态下 并且 修改 计量单位 触发
async function editUnitType(record) {
  let oldCgUnitId=record.cgUnitId
  createConfirm({
    iconType: 'warning',
    title: '提示',
    content: '计量单位发生改变,数量和单价将重新计算,确定继续吗？',
    onOk: async () => {
      record.cinvodeType= record.unitList.filter(a=>a.value==record.tempCgUnitId)[0].ggxh
      record.bcheck1= record.unitList.filter(a=>a.value==record.tempCgUnitId)[0].txm
      record.cgUnitId=record.unitList.filter(a=>a.value==record.tempCgUnitId)[0].value

      if(record.cunitid==record.cgUnitId){
        record.cnumber=record.baseQuantity
        record.tempCnumber=record.cnumber
      }else if(!hasBlank(record.cunitidF1) && record.cunitidF1==record.cgUnitId){
        record.cnumber=record.subQuantity1
        record.tempCnumber=record.cnumber
      }else if(!hasBlank(record.cunitidF2) && record.cunitidF2==record.cgUnitId){
        record.cnumber=record.subQuantity2
        record.tempCnumber=record.cnumber
      }

      let o:any = assetsCardList.value.filter(it => tempType.value=='one'?(it.stockNum == record.cinvode) :tempType.value=='three'? (it.stockBarcode == record.bcheck1) : (it.stockName == record.cinvodeName))[0]
      record.cinvodeInfo = o
      await findByCgUnitIdSetByPrice(record)
      await assembleTotal(getDataSource())
    },onCancel: () => {
      record.tempCgUnitId=oldCgUnitId
    }
  })
}
async function findByCgUnitIdSetByPrice(record){
  // 获取对应供应商价格表【采购价格表】
  if(!hasBlank(record.cinvodeInfo.stockSupplier)){
    let data=await useRouteApi(findByStockSupplierPrice, {schemaName: dynamicTenantId})(record.cinvodeInfo.stockNum)
    let money:any=0
    if(data.length>0){
      switch (data[0].supPriceLevel) {
        case '协议价':
          money=data[0].memberprice
          break
        case '零售价':
          money=data[0].regularPrice
          break
        case '最低价':
          money=data[0].minPrice
          break
        case '最高价':
          money=data[0].maxPrice
          break
        case '一级采购价':
          money=data[0].invscost1
          break
        case '二级采购价':
          money=data[0].invscost2
          break
        case '三级采购价':
          money=data[0].invscost3
          break
        case '四级采购价':
          money=data[0].invscost4
          break
        case '五级采购价':
          money=data[0].invscost5
          break
        case '六级采购价':
          money=data[0].invscost6
          break
        case '七级采购价':
          money=data[0].invscost7
          break
        case '八级采购价':
          money=data[0].invscost8
          break
      }
    }
    let price:any=parseFloat(record.isum)/parseFloat(record.cnumber)
    if(price>0){
      record.tempTaxprice=parseFloat(price).toFixed(10)
      record.taxprice=record.tempTaxprice
    }
  }
}

/*变更专区*/
const cunitFormat = (list,id) => {
  if (null == list || hasBlank(id)) return id;
  let it = list.filter(it=>it.value == id)[0]
  return  null == it?id:it.title
}


const toPrintPage = () => {
  router.push({
    path:'/sz-print-template',
    query: {name: router.currentRoute?.value?.meta?.title,mark:  router.currentRoute?.value?.fullPath.replace('/','')},
  })
}

function openItems() {
  if (hasBlank(formItems.value.ccode) || formItems.value.biandong != '1'){
    message.info('暂未发现任何单据！')
  }else {
    openItemsSourcePage(true, {
      database: dynamicTenantId.value,code: formItems.value.ccode,type: 'CGDHD',datas: {ck:ckListOptions.value,oper:operatorList.value}
    })
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
          width: 49%;
          text-align: center;
        }

        > div:nth-of-type(2) {
          width: 20%;
          margin: 0 1px;
          text-align: left;
        }
        > div:nth-of-type(3) {
          width: 20%;
          text-align: left;
          margin: 0 1px;
        }
        > div:nth-of-type(4) {
          width: 10%;
          margin: 0 1px;
          text-align: left;
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
