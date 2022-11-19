<template>
  <div class="app-container">
    <div class="app-container-top">
      <div class="app-container-top-one" style="position: relative;">
        <div class="act-one-d-left" style="width: 22%;">
          <AccountPicker  readonly="" theme="three"/>
        </div>
        <span style="font-weight: bold;position: absolute;position: absolute;left: 22%;top: -4px;">&emsp;拣货装箱单号：{{saveModel.ccode}}</span>
        <div class="act-one-d-title">
          <span class="acto-d-title-span">拣货装箱单</span>
        </div>
        <div class="act-one-d-btn-group" style="min-width: 18%;text-align: right">
             <Button class="actod-btn" v-show="status == 3" @click="openQueryPage()">新增</Button>
             <Button class="actod-btn" v-show="status == 3 && saveModel?.bcheck != '1'" @click="operationFun('edit')">修改</Button>
             <Button class="actod-btn" v-show="status == 3" @click="operationFun('review')">{{saveModel?.bcheck != '1'?'审核':'弃审'}}</Button>
             <Button class="actod-btn" v-show="status == 3 && saveModel?.bcheck != '1'" @click="operationFun('del')">删除</Button>
             <Button class="actod-btn" v-show="status != 3" @click="operationFun('save')">保存</Button>
             <Button class="actod-btn" v-show="status != 3" @click="operationFun('give')">放弃</Button>

          <Button class="actod-btn actod-btn-last" @click="operationFun('close')">退出</Button>
        </div>
      </div>
      <div class="app-container-top-two" >
        <div class="act-two-d-left"  :style="isSee?{width: '640px',pointerEvents: 'none'}:{width: '640px'}" style="position: relative;">
          <span style="font-weight: bold;color: #666666;">&emsp;操作部门：&emsp;</span>
          <Select :options="deptList" style="width: 120px" v-model:value="saveModel.cdepcode"/> <SearchOutlined v-show="!isSee" style=" color: #0096c7;cursor: pointer;  font-weight: bold;margin-left: 1rem;" @click="openSelectContent(null,'cdepcode')"/>
          <span style="font-weight: bold;color: #666666;">&emsp;库管员：&emsp;</span>
          <Select :options="userList" style="width: 120px" v-model:value="saveModel.kgUserId"/> <SearchOutlined  v-show="!isSee" style=" color: #0096c7;cursor: pointer;  font-weight: bold;margin-left: 1rem;" @click="openSelectContent(null,'kgUserId')"/>
          <span v-show="saveModel?.bcheck == '1'" style="font-weight: bold;position: absolute;right: 22%;top: 0px;">&emsp;<Tag color="red">已审核</Tag></span>
        </div>
        <div class="act-two-d-center" style="width: 208px;"><span style="color: black;font-weight: bold">单据日期：{{saveModel.ddate}}</span></div>
        <div class="act-two-d-right" :class="status != 3?'status-look':''">
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
            <Button class="acttdrd-btn" @click="pageReload">
              <SyncOutlined :style="{ fontSize: '14px' }"/>
            </Button>
            <Popover placement="bottom" v-model:visible="visible">
              <template #content>
                <DynamicColumn :defaultData="initDynamics()['DATA']" :dynamicData="dynamicColumnModel" :lanmuInfo="lanMuData" @reload="reloadColumns"/>
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
                <span class="group-btn-span-special" @click="excelData">导出当前</span>
              </template>
              <Button class="acttdrd-btn">
                <UsbOutlined :style="{ fontSize: '14px' }"/>
              </Button>
            </Popover>
            <Popover placement="bottom">
              <template #content>
                <span class="group-btn-span-special" @click="openPrintPage">打印单据</span><br/>
                <span class="group-btn-span-special" @click="toPrintPage">模版设置</span>
              </template>
              <Button class="acttdrd-btn">
                <PrinterOutlined :style="{ fontSize: '14px' }"/>
              </Button>
            </Popover>
          </div>
        </div>
      </div>
    </div>
    <div class="app-container-bottom" :style="{height: (windowHeight+56)+'px',marginTop: '5px'}">
      <!--  针对过滤框显示添加的内容高度  -->
      <LeftTree v-if="showTree"  :database="manipulateDbName" @select="treeFilter"/>
      <div style="display: inline-block;height: 100%; float: left;margin-left: 5px;"
           :style="showTree?{width: 'calc(100% - 305px)'}:{width: '99.8%'}">
        <BasicTable
          ref="tableRef"
          :loading="loadMark"
          :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
          :scroll="{ x: totalColumnWidth,y: (windowHeight - 15) }"
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
<!--              <div @click="record.tempOne=record.cwhcode,record.editOne = true;" :class="status == 1 || status == 2?'suspended-div':'status-look'">-->
                <div>
                <span>{{record.cwhcode?.indexOf('\\') == -1 ?cangKuList.filter(it => it.id == record.cwhcode)[0]?.ckName:assemblyName(record.cwhcode)}}</span>
              </div>
            </template>
          </template>
          <template #cinvode="{ record }">
                <span>{{record.cinvode}}</span>
          </template>
          <template #cvencodeName="{ record }">
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
<!--              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempEleven=record.cvencodeName,record.editEleven = true;">-->
              <div>
                <span>{{ stockList.filter(it=>it.stockNum == record?.cinvode)[0]?.stockName }}</span>
              </div>
            </template>
          </template>
          <template #cinvodeBarcode="{ record }">
              <div>
                <span>{{ stockList.filter(it=>it.stockNum == record?.cinvode)[0]?.cinvodeBarcode }}</span>
              </div>
          </template>

          <template #xsUnitId="{ record }">
            <div>
              <span>{{formatUniqueJiLiang(record.xsUnitId,stockList.filter(it=>it.stockNum == record?.cinvode)[0])}}</span>
            </div>
          </template>
          <template #cunitid="{ record }">
            <div>
              <span>{{formatUniqueJiLiang(record.cunitid,stockList.filter(it=>it.stockNum == record?.cinvode)[0])}}</span>
            </div>
          </template>
          <template #cunitidF1="{ record }">
            <div>
              <span>{{formatUniqueJiLiang(record.cunitidF1,stockList.filter(it=>it.stockNum == record?.cinvode)[0])}}</span>
            </div>
          </template>
          <template #cunitidF2="{ record }">
            <div>
              <span>{{formatUniqueJiLiang(record.cunitidF2,stockList.filter(it=>it.stockNum == record?.cinvode)[0])}}</span>
            </div>
          </template>
          <template #quantity="{ record }">
              <div>
                    <span class="a-table-font-arial">{{
                        (record.quantity == null ? '' : parseFloat(record.quantity).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }}</span>
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
                        (record.baseQuantity == null ? '' : parseFloat(record.baseQuantity).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
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
<!--                 <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                      @click="record.tempSeven=record.subQuantity1,record.editSeven = true;">-->
                 <div>
                       <span class="a-table-font-arial">{{
                           (record.subQuantity1 == null || record.subQuantity1 == 0? '' : parseFloat(record.subQuantity1).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
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
<!--                 <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                      @click="record.tempEight=record.subQuantity2,record.editEight = true;">-->
                 <div>
                      <span class="a-table-font-arial">{{
                          (record.subQuantity2 == null || record.subQuantity2 == 0 ? '' : parseFloat(record.subQuantity2).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        }}
                 </span>
                 </div>
               </template>
          </template>
          <template #itaxprice="{ record }">
            <span class="a-table-font-arial">{{
                (record.itaxprice == null ? '' : parseFloat(record.itaxprice).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
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
<!--              <div :class="record.isGive ||  status == 3?'status-look':'suspended-div'"
                   @click="record.tempIsum=record.isum,record.editIsum = true;">-->
              <div>
          <span class="a-table-font-arial">{{
              (record.isum == null ? '' : parseFloat(record.isum).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
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
<!--              <div :class="record.isGive ||  status == 3?'status-look':'suspended-div'"
                   @click="record.tempNine=record.price,record.editNine = true;">-->
              <div>
         <span class="a-table-font-arial">{{
             (record.price == null ? '' : parseFloat(record.price).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
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
<!--              <div :class="record.isGive ||  status == 3?'status-look':'suspended-div'"
                   @click="record.tempTaxprice=record.taxprice,record.editTaxprice = true;">-->
              <div>
                    <span class="a-table-font-arial">{{
                        (record.taxprice == null ? '' : parseFloat(record.taxprice).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
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
<!--              <div :class="record.isGive ||  status == 3?'status-look':'suspended-div'"
                   @click="record.tempTen=record.icost,record.editTen = true;">-->
              <div>
          <span class="a-table-font-arial">{{
              (record.icost == null ? '' : parseFloat(record.icost).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }}</span>
              </div>
            </template>
          </template>
          <template #isGive="{ record }">
            <Switch v-model:checked="record.isGive" :disabled="status == 3" size="small"
                    @change="record.price=0;record.icost=0"/>
          </template>
          <template #batchId="{ record }">
            <template v-if="record?.editTwelve/* && record.isBatch*/">
              <Input v-model:value="record.tempTwelve"
                     style="width: 82%;" class="batchId"
                     @keyup.enter="focusNext(record,'batchId')"/>
              <CheckOutlined @click="record.editTwelve = null;record.batchId=record.tempTwelve;"/>
            </template>
            <template v-else>
<!--              :class="status == 1 || status == 2?'suspended-div':'status-look'"
              @click="record.tempTwelve=record.batchId,record.editTwelve = true;"-->
              <div >
                <span class="a-table-font-arial">{{ record.batchId }}</span>
              </div>
            </template>
          </template>
          <template #cmemo="{ record }">
            <template v-if="record?.editThirteen && record?.cinvode != null">
              <Input v-model:value="record.tempThirteen"
                     style="width: 82%;" class="cmemo"
                     @keyup.enter="record.editThirteen = null;record.cmemo=record.tempThirteen;"/>
              <CheckOutlined @click="record.editThirteen = null;record.cmemo=record.tempThirteen;"/>
            </template>
            <template v-else>
              <div :class="(status == 1 || status == 2 ) && !isSee?'suspended-div':'status-look'"
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
                @click="record.editItaxrate = null;record.itaxrate=record.tempItaxrate;tableDataChange(record,'itaxrate')"/>
            </template>
            <template v-else>
<!--              <div :class="record.isGive ||  status == 3?'status-look':'suspended-div'"
                   @click="record.tempItaxrate=record.itaxrate,record.editItaxrate = true;">-->
              <div>
                    <span class="a-table-font-arial">{{
                        (record.itaxrate == null ? '' : parseFloat(record.itaxrate).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }}</span>
              </div>
            </template>
          </template>
        </BasicTable>
      </div>

    </div>
    <Query
      @save="loadPage"
      @register="registerQueryPage"
    />
    <Print
      @save="loadPrint"
      @register="registerPrintPage"
    />
    <StockCangKuModalPop @register="registerStockCangKuModalPage" @throwData="modalData"/>
    <SelectPsn @register="registerSelectPsnPage" @save="modalData"/>
  </div>
</template>
<script setup lang="ts">
import {BasicTable, useTable} from '/@/components/Table'
import {useModal} from '/@/components/Modal'
import router from '/@/router';
import StockCangKuModalPop
  from "/@/views/boozsoft/stock/stock_cangku/popup/stockCangKuModalPop.vue";
import DynamicColumn from "/@/views/boozsoft/stock/stock_sales_add/component/DynamicColumn.vue";
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
  Drawer, Collapse, Tooltip,  Button,Switch,InputNumber,Tag
} from "ant-design-vue"

const RangePicker = DatePicker.RangePicker
const SelectOption = Select.Option
const InputSearch = Input.Search
const RadioGroup = Radio.Group
const RadioButton = Radio.Button
const CollapsePanel = Collapse.Panel
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
  ExclamationCircleOutlined, PaperClipOutlined
} from '@ant-design/icons-vue';
import {useAccvoucherStore} from '/@/store/modules/accvoucher'
import {
  onMounted,
  reactive,
  ref,
  computed,
  provide,
  getCurrentInstance,
  nextTick
} from "vue";
import {initDynamics, assemblyDynamicColumn} from "./data";
import Print from '/@/views/boozsoft/stock/stock_sales_add/popup/print.vue';
import Query from "./popup/query.vue";
import {useMessage} from "/@/hooks/web/useMessage";
import { hasBlank,pointMessage } from "/@/api/task-api/tast-bus-api";
import {useUserStore, useUserStoreWidthOut} from "/@/store/modules/user";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useTabs} from "/@/hooks/web/useTabs";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
// import SelectPsn from "/@/views/boozsoft/system/department/popup/select-psn.vue";
const SelectPsn = null;
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
    requirement: 'cinvode',
    value: '',
  }
})
const val = ref({
  openOne: 0,
  total: 0
})
const cangKuList = ref([])
const operatorList = ref([])
const stockList = ref([])
const userStore = useUserStore();
const visible = ref(false);
const IsTrue = ref(true);
const status = ref(1);
const searchConditonList = ref([])
const lanMuData = ref({
  'accId': '',
  'menuName': '拣货装箱单',
  'type': '',
  objects: '',
  username: useUserStoreWidthOut().getUserInfo.username,  changeNumber:0
})
// 表格参数
const loadMark = ref(false)
const tableSelectedRowKeys = ref([])
const tableSelectedRowObjs = ref([])
const showTree = ref(false)
const windowWidth = computed(() => (document.documentElement.clientWidth - 70 - (showTree.value ? 190 : 0)))
const windowHeight = (window.innerHeight - 290)
const totalColumnWidth = ref(0)
const manipulateDbName = ref('')
const unitName = ref('')
const unitCode = ref('')
const collapseValue = ref(['1'])
const CrudApi = reactive({
  columns: [{
    title: '仓库',
    dataIndex: 'cwhcode',
    ellipsis: true,
    slots: {customRender: 'cwhcode'}
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
      slots: {customRender: 'cvencodeName'},
      width: 200
    },{
    title: '条形码',
    dataIndex: 'cinvodeBarcode',
    ellipsis: true,
      slots: {customRender: 'cinvodeBarcode'},
    width: 120,
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
      title: '计量单位',
      dataIndex: 'xsUnitId',
      ellipsis: true,
      slots: {customRender: 'xsUnitId'},
    },{
      title: '数量',
      dataIndex: 'quantity',
      slots: {customRender: 'quantity'},
      ellipsis: true,
    },
    {
    title: '主计量',
    dataIndex: 'cunitid',
    ellipsis: true,slots: {customRender: 'cunitid'}
  },{
    title: '主数量',
    dataIndex: 'baseQuantity',
    ellipsis: true,
    slots: {customRender: 'baseQuantity'}
  },
    {
      title: '备注',
      dataIndex: 'cmemo',
      ellipsis: true,
      width: 120,
      slots: {customRender: 'cmemo'},
    }
  ]
})
const tableRef = ref(null)
const saveModel = ref({})

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
  immediate: false,
  canResize: true,
  showIndexColumn: true, //显示序号列
  indexColumnProps: {width: 60, fixed: 'left', title: '序号'},
  pagination: {
    pageSize: 200,
    showSizeChanger: true,
    pageSizeOptions: ['200', '500', '1000'],
    showTotal: t => `总共${t}条数据`,
  }
})


const [registerQueryPage, {openModal: openQueryPageM}] = useModal()
const [registerPrintPage, {openModal: openPrintPageM}] = useModal()
const [registerStockCangKuModalPage, {openModal: openStockCangKuModalPage}] = useModal();
const [registerSelectPsnPage, {openModal: openSelectPsnPage}] = useModal()
const route = useRoute();
const routeQuery = ref(null);
const isSee  = ref(false)
const selectModel = ref({})
onMounted(async () => {
  routeQuery.value = JsonTool.parseProxy(route.query)
  if (JSON.stringify(routeQuery.value).length === 2 || null == routeQuery.value) {
    openQueryPage()
    isSee.value = false
  }else {
    let q = routeQuery.value
    manipulateDbName.value = q.tid
    lanMuData.value.accId = q.aid
    routeQuery.value = null
    isSee.value = true
    status.value = 3
     selectModel.value = (await useRouteApi(findStockCaiGouList, {schemaName: q.tid})('warehouse,dept,user,operator,cust,stock'))
    cangKuList.value = selectModel.value['warehouse']
    operatorList.value = selectModel.value['operator']
    deptList.value = selectModel.value['dept']
    userList.value = selectModel.value['user']
    stockList.value = selectModel.value['stock']
    await reloadList()
    await loadCodeData(q.code,selectModel.value)
  }
})
let num = 0
const tbodyData = ref([])
const tableAllData = ref([])
async function loadCodeData(code,selectModel){
  if (num == 0) initTable()
  num+=1
  let map = await useRouteApi(findByCode,{schemaName: manipulateDbName})({code: code})
  loadMark.value = true
  if (null != map){
    saveModel.value = map.one
    showTree.value = false
    khListList.value = selectModel['cust'].filter(it=>map.two.indexOf(it.id) != -1)
    showTree.value = true
    tableAllData.value = JsonTool.parseProxy(map.three || [])
    let list = map.three
    let l = 30-list.length
    for (let i = 0; i < l; i++) {
      list.push({})
    }
    setTableData(list)
  }else {
    showTree.value = false
    setTimeout(()=>{
        saveModel.value = {}
        khListList.value  = []
        showTree.value = true
      }
      ,100)
    let list = []
    tableAllData.value = []
    let l = 30
    for (let i = 0; i < l; i++) {
      list.push({})
    }
    setTableData(list)
  }
  setTimeout(()=>loadMark.value = false,1000)
}
const openQueryPage = () => {
  val.value.openOne = 1
  openQueryPageM(true, {
    data: val.value
  })
}

//数据保存
async function saveData() {
 /* if (hasBlank(saveModel.value.cdepcode)) {
    createWarningModal({
      title: '温馨提示',
      content: '请选择操作部门!'
    })
    return false
  }else */if (hasBlank(saveModel.value.kgUserId)){
    createWarningModal({
      title: '温馨提示',
      content: '请选择库管员!'
    })
    return false
  }
  let list = getDataSource().filter(it=>it.cinvode != null)
  if (list.length == 0) {
    createWarningModal({
      title: '温馨提示',
      content: '列表完整内容至少存在一条!'
    })
    return false
  }else if (await checkData(saveModel.value.codes)){
    createWarningModal({
      title: '温馨提示',
      content: '所选来源出库单,已被使用!'
    })
  }else {
    let delKyes = Object.keys(list[0]).filter(i => i.startsWith('edit') || i.startsWith('temp') )
    delKyes.push(...['cwhcodeInfo','unitInfo'])
    saveModel.value.entryList = JsonTool.json(list)
    saveModel.value.cmaker = useUserStoreWidthOut().getUserInfo.id // 制单人
    if (saveModel.value?.id == null)
      saveModel.value.ccode = await generateCode(saveModel.value.ddate)
    await useRouteApi(saveJhzx, {schemaName: manipulateDbName})(ObjTool.dels(saveModel.value,['openOne','cwhcode']))
    message.success('保存成功！') //继续新增
    status.value = 3
    isSee.value = true
    writeLog('新增',saveModel.value,null)
    if (taskIds.value.length>0) taskIds.value.map(async (id)=>await tempTaskDel(id))
  }
}
async function modifyData() {
  if (hasBlank(saveModel.value.kgUserId)){
    createWarningModal({
      title: '温馨提示',
      content: '请选择库管员!'
    })
    return false
  }
  let list = getDataSource().filter(it=>it.cinvode != null)
  let delKyes = Object.keys(list[0]).filter(i => i.startsWith('edit') || i.startsWith('temp') )
  delKyes.push(...['cwhcodeInfo','unitInfo'])
  saveModel.value.entryList = JsonTool.json(list)
  await useRouteApi(modifyJhzx, {schemaName: manipulateDbName})(ObjTool.dels(saveModel.value,['openOne','cwhcode']))
  message.success('保存成功！') //继续新增
  status.value = 3
  isSee.value = true
  writeLog('修改',saveModel.value,null)
}


async function checkData(list){
  return false;
}
async function generateCode(date) {
  return await useRouteApi(findBillCode, {schemaName: manipulateDbName})({
    type: "JHZXD",
    date: date,
    prefix: "JH",key: '3-11'
  })
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
const pageReload = async () => {
  await loadCodeData(saveModel.value.ccode,selectModel.value)
  tbodyData.value = []
  pageParameter.searchConditon.value = ''
}
const queryReload = async () => {
  let o = saveModel.value
  let list = await useRouteApi(findMingXiDeduplicationByCodes, {schemaName: manipulateDbName})({
    type: "XSCKD",
    codes: o.codes
  })
  // 计算数量
  list.forEach(it=>{
    if (it.xsUnitId == it.cunitid){
      it.quantity = it.baseQuantity
    }else {
      it.quantity = calculateQuantity(it)
    }
  })
  // 获取合并后的的数量
  let l = 30-list.length
  for (let i = 0; i < l; i++) {
    list.push({})
  }
  setTableData(list)
}

const createRow = (it,o,v) => {
  let s =  stockList.value.filter(it=>it.id == v)[0]
  let r ={
    cinvode: s.stockNum,cdepcode:o.cdepcode,cpersoncode: o.cpersoncode,cvencode: it.value,cvencodeJs: it.value,cvencodeName: it.label,billStyle:'XHD',
    cunitid: s?.stockMeasurementUnit,cunitidText: '',cunitidF1: '',cunitidF2: '',cunitType : s.stockMeasurementType == '单计量'?'1':'0',
    isBatch: s?.stockPropertyBatch == '1',itaxrate: '0.06'
  }
  let cangkuInfo =  cangKuList.value.filter(it => it.id == o.cwhcode)[0]
  if (null != cangkuInfo){
    r['cangkuDuli'] = cangkuInfo.ckIsDuli
    if (cangkuInfo.ckIsDuli == '1')
      r['cwhcode']=o.cwhcode
  }
  if (s?.stockMeasurementType == '多计量'){
    let res =  manyJiList.value.filter(it1=>it1.id == r.cunitid)[0]
    if (res != null){
      r.unitInfo = res
      let list = JsonTool.parseObj(res.detail) || []
      if (list.length > 0){
        r.cunitidText = list[0].unitName +`[${list[0].conversionRate}]`
        if (list.length > 1){
          r.cunitidF1 = list[1].unitName +`[${list[1].conversionRate}]`
          if (list.length > 2){
            r.cunitidF2 = list[2].unitName +`[${list[2].conversionRate}]`
          }
        }
      }
    }
  }
  return  r
}
const showThis = ref(true)

const pageSearch = async () => {
  if ('' == pageParameter.searchConditon.requirement.trim()) {
    message.warn('请选择检索条件')
    return false
  }else {
    loadMark.value = true
    let list = JsonTool.parseProxy(tableAllData.value)
    if (!hasBlank(pageParameter.searchConditon.value)){
      if (tbodyData.value.length == 0)initTbodayData()
      let ids = tbodyData.value.filter(it=>it[pageParameter.searchConditon.requirement]?.indexOf(pageParameter.searchConditon.value) != -1).map(it=>it?.id)
      list=list.filter(it=>ids.indexOf(it.id)!=-1)
    }
    let l = 30-list.length
    for (let i = 0; i < l; i++) {
      list.push({})
    }
    setTableData(list)
    setTimeout(()=>loadMark.value = false,1000)
  }
}

const jiList = ref([])
const manyJiList = ref([])
async function reloadList() {
  jiList.value = await useRouteApi(findAllJiLang, {schemaName: manipulateDbName})({unitName: ''})
  manyJiList.value = await useRouteApi(findUnitInfoList, {schemaName: manipulateDbName})({})
}

/*start栏目设置*/
const dynamicColumnModel = ref({value:[]})
const initTable = ()=>{
  visible.value = true
  setTimeout(()=>{
      lanMuData.value.changeNumber+=1
      visible.value = false
    }
    ,100)
}
const reloadColumns = () => {
  let newA = JSON.parse(JSON.stringify(CrudApi.columns))
  newA = assemblyDynamicColumn(dynamicColumnModel.value.value, newA)
  setColumns(newA)
  initTableWidth(newA)
  searchConditonList.value = newA
  !isSee.value && queryReload()
}

function initTableWidth(thisCs) {
  let total = 60 + 60 // 选择列与序号列
  thisCs.forEach(item => {
    if (item.ifShow == null || item.ifShow)
      total += parseInt(item.width)
  })
  if (total > windowWidth.value) {
    let f = 0
    totalColumnWidth.value = Number(windowWidth.value) - f
    tableRef.value.$el.style.setProperty('width', (windowWidth.value + 52 - f) + 'px')
  } else {
    totalColumnWidth.value = total
    tableRef.value.$el.style.setProperty('width', (total + 52) + 'px')
  }
}
/*栏目设置end*/



let voucherRuleSize = '4';

const loadPage = async (data) => {
  status.value = 1
  let b = JsonTool.parseProxy(isSee.value)
  isSee.value = false
  manipulateDbName.value = data.tenant.accountMode
  unitName.value = data.tenant.companyName
  unitCode.value = data.tenant.coCode
  lanMuData.value.accId =data.tenant.accId
  taskIds.value = data.taskIds
  cangKuList.value = data.selectModel['warehouse']
  operatorList.value = data.selectModel['operator']
  deptList.value = data.selectModel['dept']
  userList.value = data.selectModel['user']
  saveModel.value = data.parm
  stockList.value = data.selectModel['stock']
  showTree.value = false
  khListList.value = data.selectModel['cust'].filter(it=>data.parm.cvencodes.indexOf(it.id) != -1)
  if (data.parm.openOne == 1) { // 第一次初始化 + 条件查询
     await reloadList()
     initTable()
     b && await queryReload()
  } else { // 查询条件查询
    pageParameter.searchConditon.value = ''
  }
  showTree.value = true
}

const pageChange = (a) => {
  // 分页改变
  loadMark.value = true
  // pageReload(a.current)
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
import {JsonTool, NumberTool, ObjTool} from "/@/api/task-api/tools/universal-tools";
function formatUniqueJiLiang(uniqueCodeUser,stock) {
  if (hasBlank(uniqueCodeUser)) return  ''
  let str = uniqueCodeUser
  if (stock.stockMeasurementType == '单计量'){
    jiList.value.forEach(
      function (psn: any) {
        if (psn.id == uniqueCodeUser) {
          str = psn.unitName
        }
      }
    )
  }else{
    let res =  manyJiList.value.filter(it=>it.id == stock.stockMeasurementUnit)[0]
    if (res != null) {
      let list = JsonTool.parseObj(res.detail) || []
      if (list.length > 0){
        let u =  list.filter(it=>it.id == uniqueCodeUser)[0]
        str = u.unitName
      }
    }
  }
  return str || ''
}

function calculateQuantity(r) {
  let stock = stockList.value.filter(it=>it.stockNum == r.cinvode)[0]
  let res =  manyJiList.value.filter(it=>it.id == stock.stockMeasurementUnit)[0]
  if (res != null) {
    let list = JsonTool.parseObj(res.detail) || []
    if (list.length > 0){
      let z = parseFloat(r.baseQuantity)
      let c = z
      let index = list.findIndex(it => it.id == r.xsUnitId)
      if (index == 1 && list.length > 1) {
        c = z / parseFloat(list[1].conversionRate)
      } else if (index == 2 && list.length > 2) {
        c = z / parseFloat(list[2].conversionRate)
      }
      return c.toFixed(10)
    }
  }else {
    return r.quantity
  }
}


import LeftTree from "./popup/LeftTree.vue";
import {saveLog} from "/@/api/record/system/group-sys-login-log";

import {
  findAll as findAllJiLang,
  findUnitInfoList
} from "/@/api/record/system/unit-mea";
import {
  findMingXiDeduplicationByCodes,
} from "/@/api/record/stock/stock-xhd";
import {
  saveJhzx,
  findBillCode,
  findByCode,
  review, dels, modifyJhzx
} from "/@/api/record/stock/stock-jhzx";
import {useRoute} from "vue-router";
import {findStockCaiGouList} from "/@/api/record/stock/stock-caigou";
import {
  getByStockBalanceTask,
  stockBalanceTaskSave,
  stockTaskDelById
} from "/@/api/record/stock/stock_balance";

/*****************左侧树变化******************/
const treeFilter = (obj) => {
}
/*****************左侧树变化******************/
/************写入日志补充************/

/****************核心业务*****************/
const {proxy} = getCurrentInstance()
const thisEditObj = ref(null)
const khListOptions = ref([])
const khListList = ref([])
const deptList = ref([])
const userList = ref([])
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
  let filters = ['isGive','bcheck','cinvodeType','cunitid','cinvodeName','baseQuantity1','subQuantity1','subQuantity2','cunitidF1','cunitidF2','itaxrate','taxprice','itaxprice','isum','dvdate','batchId']
  // if (!r.isBatch)filters.push('batchId') 要求填批号才填写
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
    let doms = nextC == 'batchId' || nextC == 'cmemo' ? document.getElementsByClassName(nextC)[0] : document.getElementsByClassName(nextC)[0]?.getElementsByTagName('input')[0]
    if (null != doms) doms.focus()
  })
}

const getNextMark = (c,b) => {
  let model = {cvencode:'Two',cvencodeJs:'Three',cwhcode:'One',baseQuantity:'Six',price:'Nine',icost:'Ten'/*,batchId:'Twelve',dvdate:'Fifteen'*/,cmemo:'Thirteen',taxprice: 'Taxprice', itaxrate: 'Itaxrate', isum: 'Isum'}
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
  switch (c) {
    case 'baseQuantity':
    case 'price':
      if (!hasBlank(r.baseQuantity) && !hasBlank(r.price)) {
        let n = parseFloat(r.baseQuantity).toFixed(10)
        // if (titleValue.value != 0 && n > 0) n = 0 - (Math.abs(n))
        let d = parseFloat(r.price).toFixed(10)
        r.icost = (n * d).toFixed(4) + ''
        r.tempTen = r.icost
        r.isum = ( (n * d)*(1+parseFloat(r.itaxrate))).toFixed(4) + ''
        r.baseQuantity = n + ''
        r.price = d + ''
        r.taxprice = (d*(1+parseFloat(r.itaxrate))).toFixed(10) + ''
        r.itaxprice = ((d*parseFloat(r.itaxrate)) * n).toFixed(4) + ''
      }
      slChange(r,c)
      break;
    case 'icost':
      if (!hasBlank(r.baseQuantity) && !hasBlank(r.icost)) { //反算 单价
        let n = parseFloat(r.baseQuantity).toFixed(10)
        // if (titleValue.value != 0 && n > 0) n = 0 - (Math.abs(n))
        let d = parseFloat(r.icost).toFixed(4)
        r.baseQuantity = n + ''
        r.icost = d + ''
        r.isum = ( d*(1+parseFloat(r.itaxrate))).toFixed(10) + ''
        r.tempTen = d + ''
        r.price = (d / n).toFixed(10) + ''
        r.taxprice = ((r.price * (1+n))*parseFloat(r.itaxrate)).toFixed(10) + ''
        r.itaxprice = (d*parseFloat(r.itaxrate)).toFixed(4) + ''
      } else if (!hasBlank(r.price) && !hasBlank(r.icost)) { //反算 数量
        let n = parseFloat(r.price).toFixed(10)
        let d = parseFloat(r.icost).toFixed(4)
        // if (titleValue.value != 0 && d > 0) d = 0 - (Math.abs(d))
        r.price = n + ''
        r.taxprice = ( n*(1+parseFloat(r.itaxrate))).toFixed(10) + ''
        r.icost = d + ''
        r.isum = ( d*(1+parseFloat(r.itaxrate))).toFixed(10) + ''
        r.itaxprice = ( d*(parseFloat(r.itaxrate))).toFixed(4) + ''
        r.tempTen = d + ''
        r.baseQuantity = (d / n).toFixed(10) + ''
        slChange(r,c)
      }
      break;
  }
}
const slChange = (r,c) => {
  if (c == 'baseQuantity' && r.cunitType == '0' && r.unitInfo != null){ // 存在多计量的清空
    // 运算辅助数量
    let list = JsonTool.parseObj(r.unitInfo.detail) || []
    if (list.length > 0){
      let n = parseFloat(r.baseQuantity).toFixed(10)
      let isnum  = (r.unitInfo.unitType == '2')
      let one =  parseFloat((n/parseFloat(list[1].conversionRate))).toFixed(10)
      let two =  null != list[2]?parseFloat((n/parseFloat(list[2].conversionRate))).toFixed(10):0
      if (isnum){ //取整数}
        r.baseQuantity = NumberTool.toCeil(n,2)+''
        r.subQuantity1 = NumberTool.toCeil(one,2)+''
        r.subQuantity2 = NumberTool.toCeil(two,2)+''
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
    case 'kgUserId':
      openSelectPsnPage(true, {
        dynamicTenantId: manipulateDbName.value
      })
      break;
    case 'cwhcode':
      // 独立仓库打时 几次仓库打开时
      openStockCangKuModalPage(true, {
        database: manipulateDbName.value,
        ckIsDuli: null != o ?o['cangkuDuli']: null,
        entity: null != o? cangKuList.value.filter(it => it.id == saveModel.value.cwhcode)[0]: null
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
    } else {
      thisEditObj.value[(thisEditType.value == 'cvencode'?'tempTwo':'tempThree')] = o[0].id
    }
    focusNext(thisEditObj.value,thisEditType.value)
    thisEditObj.value = null
  } else {
    saveModel.value[thisEditType.value] = o[0].id
  }
}
const operationFun = async (action) => {
  if (hasBlank(saveModel.value?.ccode)){
    createWarningModal({title: '温馨提示', content: '暂未发现可操作的单据'})
    return false
  }
  if (await tempCheck('月末结账','结账'))return false;
  if (action == 'save'){
    status.value == 1?saveData():modifyData()
  }else if (action == 'edit'){
    status.value = 2
    isSee.value = false
  } else if(action == 'del'){
      createConfirm({
        iconType: 'warning',
        title: '拣货装箱单删除',
        content: '您确定要进行拣货装箱单删除吗!',
        onOk: async () => {
          await useRouteApi(dels, {schemaName: manipulateDbName})({ codes: [saveModel.value?.ccode]})
          message.success('删除成功！')
          writeLog('删除',saveModel.value,null)
          pageReload()
        },onCancel: async () => {
        }
      });
  } else if(action == 'review'){
    await startReview(saveModel.value.bcheck  != '1')
  } else if(action == 'close'){
    if (taskIds.value.length>0){
      let a = taskIds.value.map(async (id)=>await tempTaskDel(id))
      taskIds.value = []
    }
    closeCurrent()
  }else{// 放弃
    status.value = 3
    isSee.value = true
    pageReload()
    if (taskIds.value.length>0)taskIds.value.map(async (id)=>await tempTaskDel(id))

  }
}

const startReview = async (b) => {
  let a = useUserStoreWidthOut().getUserInfo.id
  if (!hasBlank(a)) {
    let checkRow = [saveModel.value]
    if ((b && checkRow.filter(it => it.bcheck == '1').length > 0) || (!b && checkRow.filter(it => it.bcheck != '1').length > 0)) {
      createWarningModal({title: '温馨提示', content: `选中的${b ? '审核' : '弃审'}的单据中存在已${b ? '审核' : '弃审'}单据，请先排除！`})
    } else {
      let codes = [...new Set(checkRow.map(it => it.ccode))]
      let res = await useRouteApi(review, {schemaName: manipulateDbName})({
        codes: codes,
        userId: a,
        type: b
      })
      message.success(`${b ? '审核' : '弃审'}成功！`)
      writeLog(`${b?'审核':'弃审'}`,saveModel.value,null)
      await pageReload()
    }
  } else {
    if (hasBlank(a)) message.error('获取用户信息异常！')
  }
}
const printLog = (text) => {
  writeLog("打印",saveModel.value,null)
}
async function writeLog(action, a, content) {
  /************** 记录操作日志 ****************/
  if (action == '修改') {
    let old = getDataSource().filter(it => it.id == a.id)[0]
    // let keys = (Object.keys(old)).filter(k => old[k] != a[k] && k != 'key')
    let text = `操作内容【${action}拣货装箱单】,` + '拣货装箱单号【' + a.ccode + '】,单据日期【' + a.ddate + '】,'
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
    optFunction: '拣货装箱单',
    optRange: '2',
    uniqueCode: '',
    optAction: action,accId:lanMuData.value.accId,
    optContent: content || `操作内容【${action}拣货装箱单】,` + '拣货装箱单号【' + a.ccode + '】,单据日期【' + a.ddate + '】',
  }
  await saveLog(map)
}
const taskInfo = ref(null)
const taskIds = ref([])

async function tempCheck(menu,methd){
  let taskData=await useRouteApi(getByStockBalanceTask, { schemaName: manipulateDbName })({iyear:(saveModel.value.ddate.substring(0,4)),name:menu,method:methd,recordNum:''})
  if(!hasBlank(taskData)){
    createWarningModal({title: '温馨提示',content: '操作员'+taskData.caozuoUnique+'正在对当前账套进行'+menu+'处理，不能进行单据业务操作，请销后再试！'})
    return  true;
  }else {
    return  false;
  }
}

async function tempTaskDel(id) {
  await useRouteApi(stockTaskDelById, { schemaName: manipulateDbName })(id)
    .then((a)=>{
      taskIds.value = taskIds.value.filter(i=>i != id)
    })
}
/****************核心业务*****************/
const assemblyName = (s) => {
  let text = ''
  if (!hasBlank(s)){
    let arr = s.split('\\')
    if (cangKuList.value.length > 0)  text = cangKuList.value.filter(it=>it.id == arr[0])[0]?.ckName
  }
  return text
}
const initTbodayData = () => {
  let dataArr = JsonTool.parseProxy(tableAllData.value)
  if (dataArr.length == 0)return false
  dataArr.forEach((item,index)=>{
    let stock = stockList.value.filter(it=>it.stockNum == item?.cinvode)[0]
    item['cwhcode'] = item.cangkuDuli == '0'? assemblyName(item.cwhcode.split("\\")):cangKuList.value.filter(it => it.id == item.cwhcode)[0]?.ckName
    item['xsUnitId'] =  formatUniqueJiLiang(item.xsUnitId,stock)
    item['cinvodeName'] =  stock.stockName
    item['cinvodeBarcode'] =  stock.stockBarcode
    item['quantity'] =  parseFloat(item.quantity).toFixed(2)
    item['cunitid'] =  formatUniqueJiLiang(item.cunitid,stock)
    item['baseQuantity'] = parseFloat(item.baseQuantity).toFixed(2)
  })
  tbodyData.value = dataArr
}
const openPrintPage = () => {
  if (hasBlank(saveModel.value.id)){
    message.info('暂未发现可打印单据！')
    return false;
  }
  let path  = router.currentRoute?.value?.fullPath
  if (path.indexOf('?'))path = path.split('?')[0]
  openPrintPageM(true, {
    dynamicTenantId: manipulateDbName.value,
    mark: path.replace('/',''),
    name: router.currentRoute?.value.meta.title
  })
}
import {useNewPrint} from "/@/utils/boozsoft/print/print";
import {getPrintStencilParameter} from "/@/views/boozsoft/stock/stock_sales_add/popup/ts/printTemplate";
import {dataModelBuildingTwoData} from "/@/views/boozsoft/stock/stock_sales_add/popup/ts/printData";
import {
  defaultV,
  sheet_from_array_of_arrays,
  Workbook,
  writeExcel
} from "/@/utils/boozsoft/excel/excel2";
import XLSX from "xlsx-js-style";

const loadPrint =  (obj) => {
  if (tableAllData.value.length == 0) {
    message.info('暂未发现可参与打印的单据！')
    return false;
  }else { // 数据处理
    if (tbodyData.value.length == 0)initTbodayData()
    const dataArr = JsonTool.parseProxy(tbodyData.value)
    let etc = JsonTool.parseProxy(saveModel.value)
    etc.cdepcode = hasBlank(etc.cdepcode)?'':(deptList.value.filter(it=>it.value == etc.cdepcode)[0]?.label || '')
    etc.kgUserId = hasBlank(etc.kgUserId)?'': (userList.value.filter(it=>it.value ==  etc.kgUserId)[0]?.label || '')
    let type = obj.template
    let maxRowLen = obj.rowNumber
    let dateModel = dataModelBuildingTwoData(dataArr,etc,maxRowLen,obj.list)
    let {fx, size, fun} = getPrintStencilParameter(type,obj.list)
    useNewPrint({data: [fx,  'mm', size,false]}, (doc) => {
      dateModel.forEach((printObj,index)=>{
        fun(doc, printObj, maxRowLen)
        if (index < (dateModel.length-1)) doc.addPage()
      })
    })
  }
}

const toPrintPage = () => {
  let path  = router.currentRoute?.value?.fullPath
  if (path.indexOf('?'))path = path.split('?')[0]
  router.push({
    path:'/sz-print-template',
    query: {name: router.currentRoute?.value?.meta?.title,mark: path.replace('/','') }
  })
}

const excelData = () => {
  let list: any = []
  if (tableAllData.value.length == 0) {
    message.info('暂未发现可参与导出的单据！')
    return false;
  }
  if (tbodyData.value.length == 0)initTbodayData()
  const arrData = JsonTool.parseProxy(tbodyData.value)
  arrData.forEach((item,index)=>{
    let item1 = {}
    item1[0] = (index+1)+''
    item1[1] = item.cwhcode
    item1[2] = item.cinvodeBarcode
    item1[3] = item.cinvode
    item1[4] = item.cinvodeName
    item1[5] = item.batchId
    item1[6] = item.dpdate
    item1[7] = item.dvdate
    item1[8] = item.xsUnitId
    item1[9] = item.quantity
    item1[10] = item.cunitid
    item1[11] =item.baseQuantity
    item1[12] = item.cmemo || ''
    list.push(item1)
  })
  const sheet:any = [
    {
      title: '拣货装箱单',
      multiHeader: [
        ['序号', '仓储位置', '条形码', '存货编码', '存货名称', '批号', '生效日期', '失效日期', '计量单位','数量','主计量','主数量','备注']
      ],
      table: list,
      keys: [0, 1, 2, 3, 4, 5, 6, 7, 8,9,10,11,12],
      merges: [],
      sheetName: '拣货装箱单',
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
      colWidth: [8, 15, 15, 15, 20, 15, 15, 15, 15, 15, 15, 15, 15]
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
              alignment:  alignment || globalStyle.alignment,
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
              alignment:  alignment || globalStyle.alignment,
            }
          } else if (i.substring(0, 1) == 'I' || i.substring(0, 1) == 'J' || i.substring(0, 1) == 'K') {
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment:  alignment || globalStyle.alignment,
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
  writeExcel(wb, bookType, '拣货装箱单_'+saveModel.value.ccode)
}
provide('khList',khListList)
</script>
<style scoped="scoped" lang="less">
@import '/@/assets/styles/pingzheng-menu-index.less';
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
.status-look {
  pointer-events: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
