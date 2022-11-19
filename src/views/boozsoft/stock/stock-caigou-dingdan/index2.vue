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
          <Button class="actod-btn" @click="router.push('/cg-dingdan-list')">查询</Button>
          <!-- 审核后的 -->
          <span v-if="stockWareData.bcheck=='1'">
            <Button v-if="status==3" :disabled="ymPeriod" class="actod-btn" @click="startEdit('add')">新增</Button>
            <Popover placement="bottom" v-if="status==3 && stockWareData.bcloser=='0'">
              <template v-if="!ymPeriod" #content>
                <Button style="width: 88px;" :disabled="ymPeriod" class="actod-btn"  @click="biandong='1';startEdit('biangeng')">变更</Button><br>
                <Button style="margin-bottom: 2px" >变更清单</Button><br/>
              </template>
              <Button :disabled="ymPeriod" class="actod-btn">
                变更
              </Button>
            </Popover>
            <span v-if="status ==2">
              <Button class="actod-btn" @click="saveBiandong">保存</Button>
              <Button class="actod-btn" @click="giveUp">放弃</Button>
              <Button class="actod-btn" @click="tableAdd" v-if="status == 1 || status == 2">插行</Button>
              <Button class="actod-btn" @click="tableDelBiandong">删行</Button>
            </span>
            <span v-else>
              <Popover placement="bottom" v-if="stockWareData.bcloser=='0'">
                <template v-if="!ymPeriod" #content>
                  <Button style="width: 120px;margin-bottom: 2px" @click="setCGDHD_data">采购到货单</Button><br/>
                  <Button style="width: 120px;margin-bottom: 2px" @click="setCGRKD_data">采购入库单</Button><br/>
                  <Button style="width: 120px;margin-bottom: 2px" @click="setCGFP_data">采购发票</Button><br/>
                </template>
                <Button :disabled="ymPeriod || stockWareData.bcloser=='1'" class="actod-btn">
                  生单
                </Button>
              </Popover>
              <Button :disabled="ymPeriod" class="actod-btn actod-btn-last" @click="stockWareData.bcheck=='1'?startReview(false):startReview(true)">{{ stockWareData.bcheck=='1'?'弃审':'审核' }}</Button>
<!--              <Button :disabled="ymPeriod" class="actod-btn actod-btn-last" @click="stockWareData.bcloser=='1'?setBcloser(false):setBcloser(true)">{{ stockWareData.bcloser=='1'?'启用':'停用' }}</Button>-->
              <Popover placement="bottom">
                <template #content>
                  <Button style="width: 120px;margin-bottom: 2px" @click="xySourcePop">下游单据</Button>
                </template>
                <Button :disabled="ymPeriod" class="actod-btn">联查</Button>
              </Popover>
              <Button :disabled="ymPeriod" class="actod-btn" @click="copyFun">复制</Button>
            </span>
          </span>
          <!-- 未审核 -->
          <span v-else>
            <span v-if="status < 3">
              <Popover placement="bottom">
                  <template #content>
                    <Button class="actod-btn">销售订单</Button><br/>
                  </template>
                  <Button class="actod-btn">参照</Button>
                </Popover>
              <Button class="actod-btn" @click="saveData">保存</Button>
              <Button class="actod-btn" @click="giveUp">放弃</Button>
               <Button class="actod-btn" @click="tableAdd" v-if="status == 1 || status == 2">插行</Button>
              <Button class="actod-btn" @click="tableDel">删行</Button>
            </span>
            <span v-else>
              <Button :disabled="ymPeriod" class="actod-btn" @click="startEdit('add')">新增</Button>
              <Button :disabled="ymPeriod" class="actod-btn" @click="startEdit('edit')">修改</Button>
              <Button :disabled="ymPeriod" class="actod-btn" @click="startDel">删除</Button>
              <Button v-if="stockWareData.bcheck=='0'" :disabled="ymPeriod" class="actod-btn actod-btn-last" @click="stockWareData.bcheck=='1'?startReview(false):startReview(true)">{{ stockWareData.bcheck=='1'?'弃审':'审核' }}</Button>
<!--              <Button v-if="stockWareData.bcheck=='1'" :disabled="ymPeriod" class="actod-btn actod-btn-last" @click="stockWareData.bcloser=='1'?setBcloser(false):setBcloser(true)">{{ stockWareData.bcloser=='1'?'启用':'停用' }}</Button>-->
              <Popover placement="bottom">
                <template v-if="!ymPeriod" #content>
                  <Button style="width: 120px;margin-bottom: 2px" @click="xySourcePop">下游单据</Button>
                </template>
                <Button :disabled="ymPeriod" class="actod-btn">联查</Button>
              </Popover>
<!--              <Popover placement="bottom">-->
<!--                <Button :disabled="ymPeriod" class="actod-btn">更多</Button>-->
<!--              </Popover>-->
            </span>
          </span>
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
    <div class="app-container-bottom" :style="{height: (windowHeight+70)+'px'}">
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
              <Tag v-if="stockWareData.bcheck=='1'" :color="'volcano' ">
                已审核
              </Tag>
              <Tag :color="'volcano'" v-if="stockWareData.swsIsumDaohuo>0">
                已到货
              </Tag>
              <Tag :color="'volcano'" v-if="stockWareData.swsIsumRuku>0">
                已入库
              </Tag>
              <Tag :color="'volcano'" v-if="stockWareData.biandong=='1'">
                已变更
              </Tag>
              <Tag :color="'volcano'" v-if="stockWareData.bcloser=='1'">
                已停用
              </Tag>
            </span>
          </div>
          <span style="font-size: 22px;font-weight: bold;margin-right: 300px;"
                :style="{color: titleValue===0?'#0096c7':'red'}">{{
              titleContents[titleValue]
            }}</span>

        </div>
        <div class="acbgead-two" :style="status == 3?{ pointerEvents: 'none'}:{}">
          <DynamicForm :datasource="dynamicFormModel" :formDataFun="formFuns"
                       :accId="dynamicTenantId" @open="openHeadSelectContent" :dynamicTenant="dynamicTenant"/>
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
          <template #bcheck1="{ record }">
            <template v-if="record.editThree">
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
            <template v-if="record.editTwo">
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
                @keyup.enter="tempType = 'one';focusNext(record,'cinvode')"
              ></Select>
              <SearchOutlined @click="tempType = 'one';openSelectContent(record,'cinvode')"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempTwo=record.cinvode,record.editTwo = true;">
                <span class="a-table-font-arial">{{ record.cinvode }}</span>
              </div>
            </template>
          </template>
          <template #cinvodeName="{ record }">
            <template v-if="record.editEleven">
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
            <template v-if="record.editCgUnitId">
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

          <template #baseQuantity="{ record }">
            <span class="a-table-font-arial">{{
                (record.baseQuantity == null || record.baseQuantity == 0 ? '' : parseFloat(record.baseQuantity).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }}
             </span>
          </template>
          <template #price="{ record }">
            <template v-if="record?.editNine">
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
            <template v-if="record?.editTen">
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
            <template v-if="record?.editItaxrate">
              <InputNumber v-model:value="record.tempItaxrate" class="itaxrate"
                           :min="0"
                           :max="100"
                           :formatter="value => `${value}%`"
                           :parser="value => value.replace('%', '')"
                           style="width: 82%;"
                           @click="getColumnRate(record)"
                           @keyup.enter="focusNext(record,'itaxrate')"/>
              <CheckOutlined
                @click="record.editItaxrate = null;record.itaxrate=record.tempItaxrate;tableDataChange(record,'itaxrate')"/>
            </template>
            <template v-else>
              <div :class="record.isGive ||  status == 3?'status-look':'suspended-div'"
                   @click="record.tempItaxrate=record.itaxrate,record.editItaxrate = true;">
                    <span class="a-table-font-arial" v-if="!hasBlank(record.itaxrate)">{{ parseFloat(record.itaxrate).toFixed(2) }}%</span>
              </div>
            </template>
          </template>
          <!-- 含税单价-->
          <template #taxprice="{ record }">
            <template v-if="biandong=='0'&&record?.editTaxprice">
              <InputNumber v-model:value="record.tempTaxprice" class="taxprice"
                           :min="0"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           style="width: 82%;"
                           @click="findBySupPrice(record)"
                           @keyup.enter="focusNext(record,'taxprice')"/>
              <CheckOutlined
                @click="record.editTaxprice = null;record.taxprice=record.tempTaxprice;tableDataChange(record,'taxprice')"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
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
            <template v-if="record?.editIsum">
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
          <template #isGive="{ record }">
            <Switch v-model:checked="record.isGive" :disabled="status == 3" size="small"
                    @change="isGiveChange(record)"/>
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
          <!--到货日期-->
          <template #arrivalDate="{ record }">
            <template v-if="record?.editArrivalDate">
              <DatePicker v-model:value="record.tempArrivalDate" value-format="YYYY-MM-DD"
                          class="arrivalDate"
                          format="YYYY-MM-DD" style="width: 82%;"
                          @openChange="(b)=>null!=record.tempArrivalDate && !b?focusNext(record,'arrivalDate'):null"/>
              <CheckOutlined @click="record.editArrivalDate = null;record.arrivalDate=record.tempArrivalDate;"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempArrivalDate=record.arrivalDate,record.editArrivalDate = true;">
                <span class="a-table-font-arial">{{ record.arrivalDate }}</span>
              </div>
            </template>
          </template>
          <template #bcheck="{ record }">
            {{ formatUniqueOperator(record.bcheckUser)}}
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
        <Import @save="introduceData" @register="registerImportPage" />
        <Query @query="loadPage" @register="registerQueryPage" />
      </div>
    </div>
    <SupperModalPop @throwData="modalData" @register="registerModalPopPage"/>
    <DeptModalPop @register="registerSelectDeptPage" @save="modalData"/>
    <StockCangKuModalPop @register="registerStockCangKuModalPage" @throwData="modalData"/>
    <SelectPsn @register="registerSelectPsnPage" @save="modalData"/>
    <XySource @register="registerXySourcePage"/>
    <StockInfiModalPop @register="registerStockInfoModalPage" @throwData="modalData"/>
    <Print @save="loadPrint" @register="registerPrintPage"/>

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
  Switch, Table,
  Tabs,
  Tag,
} from "ant-design-vue";
import Query from "./popup/query.vue";
import Import from "./popup/import.vue";
import XySource from "./popup/xySource.vue";
import DynamicForm from './component/DynamicForm.vue';
import Print from '/@/views/boozsoft/stock/stock-caigou-rk/popup/print.vue';
import {
  BarcodeOutlined,
  PrinterOutlined,
  CheckOutlined,
  CopyOutlined,
  LeftOutlined,
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
import {assemblyDynamicColumn, initDynamics} from "./data";
import {hasBlank} from "/@/api/task-api/tast-bus-api";
import {usePlatformsStore} from "/@/store/modules/platforms";
import {
  GenerateDynamicColumn
} from "/@/views/boozsoft/stock/stock-caigou-dingdan/component/DynamicForm";
import StockCangKuModalPop
  from "/@/views/boozsoft/stock/stock_cangku/popup/stockCangKuModalPop.vue";
import StockInfiModalPop from "/@/views/boozsoft/stock/stock_info/popup/stockInfoModalPop.vue";
import DynamicColumn from "/@/views/boozsoft/stock/stock_sales_add/component/DynamicColumn.vue";
import {
  findAll as findAllJiLang,
  findUnitAssociationList,
  findUnitInfoList
} from "/@/api/record/system/unit-mea";
import {findCunHuoAllList} from "/@/api/record/stock/stock-caigou";
import {
  delRuKu,
  findBillByCondition,
  findBillCode,
  findByStockPeriodIsClose,
  findByStockWareRecentlySupMoney, findByWarSearch,
  findStockPeriodYmFlag,
  findStockWareByCcode,
  reviewSetCGRKG,
  reviewSetCGRKGMx,
  saveRuKu, verifyDataState, verifySyCsourceByXyCode,
  verifyXyCsourceByXyCode, xyCsourceSave,
} from "/@/api/record/stock/stock-ruku";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {findCangkuJoinName} from "/@/api/record/stock/stock-cangku-level-record";
import {company_executeSQL} from "/@/api/codekemu/codekemu";
import {
  getByStockBalanceTask, stockBalanceTaskDelByUserName,
  stockBalanceTaskEditNewTime,
  stockBalanceTaskSave,
  stockTaskDelById,
  updateStockCurrentRevision
} from "/@/api/record/stock/stock_balance";
import {stockSupPriceFindBySupIdAndStockNum} from "/@/api/record/stock/stock_sup_price";
import {
  findByStockNum2,
  findByStockSupplierPrice,
  singleUnitOfMea
} from "/@/api/record/stock/stock";
import {saveLog} from "/@/api/record/system/group-sys-login-log";
import {
  findByIyearAndCcodeAndXyBillStyle, findByStockWareSMax,
  verifySyLineCodeExistXyData
} from "/@/api/record/stock/stock-xy-source";
import {
  saveStockWarehousingPOJO,
  saveStockWarehousingsListPOJO
} from "/@/api/record/stock/stock-ruku-biandong";
import {
  deleteByStockWarehLineCode,
  findAllByCcodeAndBillStyle, getUnitRate,
  stockWarehListSave
} from "/@/api/record/system/stock-wareh";
import {dataModelBuildingTwoData} from "/@/views/boozsoft/stock/stock_sales_add/popup/ts/printData";
import {
  getPrintStencilParameter
} from "/@/views/boozsoft/stock/stock_sales_add/popup/ts/printTemplate";
import {useNewPrint} from "/@/utils/boozsoft/print/print";
import ReceiptSearch from "/@/views/boozsoft/stock/stock_sales_add/component/ReceiptSearch.vue";
import {useNcModals} from "/@/views/boozsoft/stock/stock_out_add/otherServerReferences";

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
const route = useRoute();
const [registerQueryPage, {openModal: openQueryPageM}] = useModal()
const [registerImportPage, {openModal: openImportPageM}] = useModal()
const [registerXySourcePage, {openModal: openXySourcePage}] = useModal()
const [registerPrintPage, {openModal: openPrintPage}] = useModal()


const windowHeight = (window.innerHeight - 300)
const taskInfo:any = ref('')
const dynamicTenant:any = ref('')
const dynamicTenantId:any = ref('')
const dynamicAccId:any = ref('')
const dynamicYear:any = ref('')
const titleContents:any = ['采购订单', '采购订单']
const titleValue:any = ref(0)
const formRowNum :any= ref(1)
const tempType:any =  ref('')
const pageParameter:any = reactive({
  showRulesSize: 'MIN',
  searchConditon: {
    requirement: '',
    value: '',
  },
  type: 'CGDD'
})
const changeBtns:any = ref({
  first: true,
  prev: true,
  next: true,
  tail: true,
})
const formItems: any = ref({})
const jiList:any = ref([])
const duoJlMxList:any = ref([])
const manyJiList:any = ref([])
const ckListOptions:any = ref([])
const custList:any = ref([])
const userList:any = ref([])
const operatorList:any = ref([])
const cardListOptions:any = ref([])
const assetsCardList:any = ref([])
const routeData:any = route.query;
const stockWareData:any = ref('')
const ymPeriod:any = ref(false)
const summary:any = ref({})
const visible3:any = ref(false)
const biandong = ref('0')
const newDate=ref(new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "))

/********** 单据搜索 *********/
const showSearch=ref(false)
const searchData = ref({
  year: '',
  type: pageParameter.type,
  qValue: '',
  style: '0',
  model: 'CG',
})
const toReceipt = async (v) => {
  nextTick(async ()=>contentSwitch('tail',v))
}
/********** 单据搜索 *********/

async function getCKName(id) {
  let str=''
  let cangkuJoinName=await useRouteApi(findCangkuJoinName,{schemaName: dynamicTenantId})(  {id:id})
  if(cangkuJoinName.length>0){
    str=cangkuJoinName[0].cangkuRecordJoinName
  }
  return str
}

// 查看下游数据
function xySourcePop() {
  openXySourcePage(true, {
    database: dynamicTenantId.value,
    ccode:formItems.value.ccode
  })
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
  dynamicTenant.value = obj
  dynamicTenantId.value = obj.accountMode
  dynamicAccId.value = obj.accId
  lanMuData.value.accId=obj.accountMode
  let year = (useCompanyOperateStoreWidthOut().getLoginDate?.substring(0,4));
  dynamicYear.value = year || obj.stockYear
  searchData.value.year = year || obj.stockYear
  stockWareData.value=''
  visible3.value = true
  showSearch.value = true
  await columnReload()
  await reloadList()
  lanMuData.value.changeNumber+=1
}
// 获取单据信息
async function findStockWareByCcodeData(ccode) {
  stockWareData.value=await useRouteApi(findStockWareByCcode, {schemaName: dynamicTenantId})(ccode)
}
const dynamicFormModel:any = ref([])
const formFuns:any = ref({
  getFormValue: () => {
  }, setFormValue: () => {
  }, getSelectMap: () => {
  }
})
const accountPickerFuns = ref({
  resetCoCode: (v) => {}
})
const columnReload = async () => {
  dynamicFormModel.value = await GenerateDynamicColumn(dynamicTenantId.value) || []
  formRowNum.value = Math.ceil((dynamicFormModel.value.filter(it=>it.isShow).length/4))-1
}

const pageReload = async () => {
  status.value=3
  await reloadList()
  stockWareData.value=''
  // 列表跳转过来
  if(routeData.ccode!==undefined){
    if (!hasBlank(routeData.co) && dynamicTenant.value?.coCode !=routeData.co){
      accountPickerFuns.value.resetCoCode(routeData.co)
      return false
    }
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
    custList.value = formFuns.value.getSelectMap()['supplier']
    userList.value = formFuns.value.getSelectMap()['user']
  })
}
const cmakerTime=ref('')
async function contentSwitch(action,ccode) {
  loadMark.value = true
  let res = await useRouteApi(findBillByCondition, {schemaName: dynamicTenantId})({
    type: pageParameter.type,
    iyear: dynamicYear.value || '2022',
    action: action,
    ccode: ccode,
    curr: formFuns.value.getFormValue()?.ccode || ''
  })
  if (null != res) {
    findStockWareByCcodeData(res.ccode)
    countStockPeriodYmFlag(res.iyear,'1')
    formItems.value = JsonTool.parseProxy(res)
    cmakerTime.value=formItems.value.cmakerTime
    if(hasBlank(cmakerTime.value)){
      cmakerTime.value=new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," ")
    }
    res.entryList = null
    // 格式化 定金
    res.theDeposit = !hasBlank(res.theDeposit)?parseFloat(res.theDeposit).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','):''
    formFuns.value.setFormValue(res)
    titleValue.value = parseInt(res.bdocumStyle || 0)
    if (!hasBlank(formItems.value.entryList)) {
      let list = JsonTool.parseObj(formItems.value.entryList).map(it => resetRow(it))
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
    let list:any = []
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
  let icost = 0
  let isum = 0
  let itaxprice = 0
  for (let i = 0; i < list.length; i++) {
    const e = list[i];
    cnumber+=parseFloat(e['cnumber'] || 0)
    icost+=parseFloat(e['icost'] || 0)
    isum+=parseFloat(e['isum'] || 0)
    itaxprice+=parseFloat(e['itaxprice'] || 0)
  }
  summary.value={
    cnumber: cnumber==0?null:parseFloat(cnumber).toFixed(2),
    icost: icost==0?null:toThousandFilter(icost),
    isum: isum==0?null:toThousandFilter(isum),
    itaxprice: itaxprice==0?null:toThousandFilter(itaxprice),
  }
}
// 0 暂存 1 新建 2编辑 3查看
const status = ref(3)

const CrudApi = {
  columns: [
    {
      title: '条形码',
      dataIndex: 'bcheck1',
      ellipsis: true,
      slots: {customRender: 'bcheck1'},
    },
    {
      title: '存货编码',
      dataIndex: 'cinvode',
      ellipsis: true,
      slots: {customRender: 'cinvode'},
    },
    {
      title: '存货名称',
      dataIndex: 'cinvodeName',
      ellipsis: true,
      slots: {customRender: 'cinvodeName'},
    },
    {
      title: '规格型号',
      dataIndex: 'cinvodeType',
      ellipsis: true,
      slots: {customRender: 'cinvodeType'},
    },{
      title: '采购单位',
      dataIndex: 'cgUnitId',
      ellipsis: true,
      slots: {customRender: 'cgUnitId'},
    },{
      title: '数量',
      dataIndex: 'cnumber',
      ellipsis: true,
      slots: {customRender: 'cnumber'},
    },
    {
      title: '主计量',
      dataIndex: 'cunitid',
      ellipsis: true,
      align: 'left',
      slots: {customRender: 'cunitid'},
    },{
      title: '主数量',
      dataIndex: 'baseQuantity',
      slots: {customRender: 'baseQuantity'},
      ellipsis: true,
    },
    {
      title: '税率%',
      dataIndex: 'itaxrate',
      slots: {customRender: 'itaxrate'},
      ellipsis: true,
      align: 'right'
    },
    {
      title: '含税单价',
      dataIndex: 'taxprice',
      slots: {customRender: 'taxprice'},
      ellipsis: true,
      align: 'right'
    },
    {
      title: '价税合计',
      dataIndex: 'isum',
      slots: {customRender: 'isum'},
      ellipsis: true,
      align: 'right'
    },
    {
      title: '预计到货日期',
      dataIndex: 'arrivalDate',
      slots: {customRender: 'arrivalDate'},
      ellipsis: true,
      align: 'right'
    },
    {
      title: '备注',
      dataIndex: 'cmemo',
      ellipsis: true,
      slots: {customRender: 'cmemo'},
    },
    {
      title: '项目',
      dataIndex: 'citemcode',
      ellipsis: true,
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
  indexColumnProps:{ fixed:true },
  pagination: false
})

const tableSelectedRowKeys:any = ref([])
const tableSelectedRowObjs:any = ref([])
const onSelectChange = (k, o) => {
  tableSelectedRowKeys.value = k
  tableSelectedRowObjs.value = o
}

async function findBySearch(val) {
  loadMark.value = true
  let bySearchData=await useRouteApi(findByWarSearch, {schemaName: dynamicTenantId})({billStyle: 'CGDD',ccode:val})
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
      content: '请先给该公司创建存货账套！'
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
    let selectIndex:any = list.findIndex(it => it.key === tableSelectedRowKeys.value[0])
    rowDelData.value.push(list.filter(it => it.key === tableSelectedRowKeys.value[0]))
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
    stockWareData.value=''
    // 获取最新
    let code = await generateCode(useCompanyOperateStoreWidthOut().getLoginDate)
    formItems.value = {
      ddate: date,
      ccode: code,
      rate: hasBlank(dynamicTenant.value.target.cgRate)?0:dynamicTenant.value.target.cgRate,
      invoiceStyle: 'zyfp',
      methodPay: 'QT',
    }
    formFuns.value.setFormValue({
      ddate: date,
      ccode: code,
      rate: hasBlank(dynamicTenant.value.target.cgRate)?0:dynamicTenant.value.target.cgRate,
      invoiceStyle: 'zyfp',
      methodPay: 'QT',
    })
    let list:any = []
    for (let i = 0; i < maxR; i++) {
      list.push({})
    }
    setTableData(list)
    tempTaskSave('新增')
  }
  else if(type=='edit'){
    if(formItems.value.ccode==undefined){return }
    // 执行操作前判断单据是否存在
    let ccodeBcheck=formItems.value.ccode+'>>>'+(hasBlank(formItems.value.bcheck)?'0':formItems.value.bcheck)
    let msg=await useRouteApi(verifyDataState, { schemaName: dynamicTenantId })({dataType:'cg',operation:'audit',list:[ccodeBcheck]})
    if(hasBlank(msg)){
      return message.error("单据已发生变化,请刷新当前单据！")
    }

    // 任务
    let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'采购订单',method:'修改,审核,删除',recordNum:formItems.value.ccode})
    if(taskData==''){
      tempTaskSave('修改')
    }else{
      for (let i = 0; i < taskData.length; i++) {
        // 任务不是当前操作员的
        if(taskData[i]?.caozuoUnique!==useUserStoreWidthOut().getUserInfo.id){
          return createWarningModal({ content: taskData[i]?.username+'正在'+taskData[i]?.method+'采购订单,不能同时进行操作！' });
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
    // 任务
    let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'采购订单',method:'修改,审核,删除',recordNum:formItems.value.ccode})
    if(taskData==''){
      tempTaskSave('变更')
    }else{
      for (let i = 0; i < taskData.length; i++) {
        // 任务不是当前操作员的
        if(taskData[i]?.caozuoUnique!==useUserStoreWidthOut().getUserInfo.id){
          return createWarningModal({ content: taskData[i]?.username+'正在'+taskData[i]?.method+'采购订单,不能同时进行操作！' });
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

async function generateCode(date) {
  return await useRouteApi(findBillCode, {schemaName: dynamicTenantId})({
    type: "CGDD",
    date: date,
    prefix: "",key: '3-0'
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
    loadMark.value=true
    // 执行操作前判断单据是否存在
    let ccodeBcheck=formItems.value.ccode+'>>>'+(hasBlank(formItems.value.bcheck)?'0':formItems.value.bcheck)
    let msg=await useRouteApi(verifyDataState, { schemaName: dynamicTenantId })({dataType:'cg',operation:'audit',list:[ccodeBcheck]})
    if(hasBlank(msg)){
      loadMark.value=false
      return message.error("单据已发生变化,请刷新当前单据！")
    }

    // 任务
    let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'采购订单',method:'修改,审核,删除',recordNum:formItems.value.ccode})
    if(!hasBlank(taskData)){
      for (let i = 0; i < taskData.length; i++) {
        // 任务不是当前操作员的
        if(taskData[i]?.caozuoUnique!==useUserStoreWidthOut().getUserInfo.id){
          loadMark.value=false
          return createWarningModal({ content: taskData[i]?.username+'正在'+taskData[i]?.method+'采购订单,不能同时进行操作！' });
        }
        await useRouteApi(stockBalanceTaskEditNewTime, { schemaName: dynamicTenantId })(taskData[i]?.id)
      }
    }

    tempTaskSave('删除')
    createConfirm({
      iconType: 'warning',
      title: '采购订单删除',
      content: '您确定要进行采购订单删除吗!',
      onOk: async () => {
        await useRouteApi(delRuKu, {schemaName: dynamicTenantId})({id: formItems.value.id})
        message.success('删除成功！')
        tempTaskDel(taskInfo.value?.id)
        saveLogData('删除')
        formItems.value.czId = ''
        loadMark.value=false
        await contentSwitch('tail','')
      },onCancel: () => {
        loadMark.value=false
        tempTaskDel(taskInfo.value?.id)
        return false
      }
    });
  }
}

const startReview = async (b) => {
  loadMark.value=true
  // 执行操作前判断单据是否存在
  let ccodeBcheck=formItems.value.ccode+'>>>'+(hasBlank(formItems.value.bcheck)?'0':formItems.value.bcheck)
  let msg=await useRouteApi(verifyDataState, { schemaName: dynamicTenantId })({dataType:'cg',operation:'audit',list:[ccodeBcheck]})
  if(hasBlank(msg)){
    loadMark.value=false
    return message.error("单据已发生变化,请刷新当前单据！")
  }
  // 弃审
  if(!b){
    if(stockWareData.bcloser=='1'){
      loadMark.value=false
      return message.error('请先启用单据,再弃审！')
    }
    if(stockWareData.value.biandong>0){
      loadMark.value=false
      return message.error('已有变更,不能弃审!')
    }
    let findByRukuData=await useRouteApi(verifySyCsourceByXyCode, {schemaName: dynamicTenantId})({year:formItems.value.iyear,ccode:formItems.value.ccode,billStyle:'CGDD'})
    if(findByRukuData.length>0 ){
      loadMark.value=false
      message.error('已经生成下游单据,不能弃审！')
      return false;
    }
  }

  tempTaskSave('审核')
  let a = useUserStoreWidthOut().getUserInfo.id
  if (!hasBlank(a) && !hasBlank(formItems.value.id))  {
    let res = await useRouteApi(findBillByCondition, {schemaName: dynamicTenantId})({
      type: pageParameter.type,
      iyear: dynamicYear.value || '2022',
      action: 'tail',
      ccode: formItems.value.ccode,
      bdocumStyle: '',
      curr: ''
    })
    // 审核、弃审
    let bcheck=b?'1':'0'
    let bcheckTime=b?new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "):''
    let bcheckUser=b?a:''
    res.bcheck=bcheck
    res.bcheckTime=bcheckTime
    res.bcheckUser=bcheckUser
    await useRouteApi(reviewSetCGRKG, {schemaName: dynamicTenantId})(res)

    let list = getDataSource().filter(it =>!hasBlank(it.cinvode) && !hasBlank(it.cunitid) && !hasBlank(it.baseQuantity))
    list.forEach(tx=>{
      tx.bcheck=bcheck
      tx.bcheckTime=bcheckTime
      tx.bcheckUser=bcheckUser
    })
    await useRouteApi(reviewSetCGRKGMx, {schemaName: dynamicTenantId})(list)
    tempTaskDel(taskInfo.value?.id)
    saveLogData('审核')
    message.success(`${b?'审核':'弃审'}成功！`)
    pageParameter.type='CGDD'
    loadMark.value=false
    await contentSwitch('curr','')
  }else {
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
  let form = formFuns.value.getFormValue();

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
  if (list.length == 0) {
    createWarningModal({
      title: '温馨提示',
      content: '列表完整内容至少存在一条!仓库级别与存货编码为必选项,主数量、无税单价和本币无税金额为必填项,请补充完整!'
    })
    return false
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
  formItems.value = formFuns.value.getFormValue()
  if(status.value==1){
    formItems.value.ccode =  await generateCode(useCompanyOperateStoreWidthOut().getLoginDate)
  }
  formItems.value.cmaker = useUserStoreWidthOut().getUserInfo.id // 制单人
  formItems.value.billStyle = pageParameter.type // 制单人
  formItems.value.bdocumStyle = titleValue.value == 0 ? "0" : "1" // 制单人
  formItems.value.cmakerTime=!hasBlank(cmakerTime.value)?cmakerTime.value:new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," ")
  // 去除格式化
  formItems.value.theDeposit = !hasBlank(formItems.value.theDeposit)?formItems.value.theDeposit.replace(/\$\s?|(,*)/g, ''):''

  // 新的明细
  let list = getDataSource().filter(it => !hasBlank(it.cinvode) && !hasBlank(it.cunitid) && !hasBlank(it.baseQuantity) && !hasBlank(it.icost + '') && !hasBlank(it.price + ''))
  if (saveCheck(list)) {
    list = list.map(it => ObjTool.dels(it, Object.keys(it).map(i => i.startsWith('edit') || i.startsWith('temp')))) //清理辅助字段
    list.forEach((o, i) => {  //转化
      o['iyear'] = dynamicYear.value
      o['lineCode'] = o['key']==undefined?randomString(30):o['key']
      o['lineId'] = (i + 1) + ''
      o['isGive'] = '0'
      o['isIndate'] = '0'
      o['isBatch'] = '0'

      o['cwhcode1'] = o['cwhcode']
      if (o.cangkuDuli == '0'){
        let arr =  o['tempCangkuId']
        for (let j = 0; j < arr.split('\\').length; j++) {
          o[`cwhcode${j+1}`] = arr.split('\\')[j]
        }
      }
    })

    formItems.value.entryList = JsonTool.json(list)
    if (formItems.value?.id == null)
      formItems.value.ccode = await generateCode(formItems.value.ddate)

    await useRouteApi(saveRuKu, {schemaName: dynamicTenantId})(formItems.value)
    tempTaskDel(taskInfo.value?.id)
    saveLogData(status.value==1?'新增':'修改')
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
const dynamicColumns = initDynamics().DEFAULT
const dynamicColumnData = ref({value:[]})
let dynamicColumnDataCopy:any = []
const editableData = reactive({});
const tableRef:any = ref(null)
const lanMuData = ref({
  accId: 'postgres',
  menuName: '采购订单',
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
  let total = 60
  thisCs.forEach(item => {
    if (item.ifShow == null || item.ifShow)
      total += parseInt(item.width)
  })
  if (total > windowWidth) {
    let f = 0
    totalColumnWidth.value = Number(windowWidth) - f
    // tableRef.value.$el.style.setProperty('width', (windowWidth + 40 - f) + 'px')
  } else {
    totalColumnWidth.value = total
    // tableRef.value.$el.style.setProperty('width', (total + 40) + 'px')
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
const [registerSelectDeptPage, {openModal: openSelectDeptPage}] = useModal()
const [registerStockCangKuModalPage, {openModal: openStockCangKuModalPage}] = useModal();
const [registerSelectPsnPage, {openModal: openSelectPsnPage}] = useModal()

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

const {openDeptModal,openPsnModal} =  useNcModals()
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
      openDeptModal(dynamicTenant.value).then(res=>modalData(res))
      break;
    case 'cwhcode':
      openStockCangKuModalPage(true, {
        database: dynamicTenantId.value,
      })
      break;
    case 'cpersoncode':
      openPsnModal(dynamicTenant.value).then(res=>modalData(res))
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
      let cvencodeJslist=dynamicFormModel.value.filter(a=>a.field=='cvencodeJs')[0]?.list.filter(a=>a.uniqueCode==o[0]?.uniqueCodeCcus)
      e['cvencodeJs']=hasBlank(o[0]?.uniqueCodeCcus)?e['cvencode']:cvencodeJslist[0]?.id
    }else if(thisEditType.value=='cdepcode'){
      e['cdepcode']=o.uniqueCode
    }else if(thisEditType.value=='cpersoncode'){
      e['cpersoncode']=o.id
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
    let res = jiList.value.filter(it => it.id == o?.stockMeasurementUnit)
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
  if(biandong.value=='1'){
    // 累计到货、入库、发票数量 最大值
    let isumMax=await useRouteApi(findByStockWareSMax, {schemaName: dynamicTenantId})({ccode: formItems.value.ccode})
    if(isumMax.length>0){
      if(parseFloat(r.cnumber)>parseFloat(Object.values(isumMax[0])[0])){
        r.cnumber=null
        r.baseQuantity=null
        let text=Object.keys(isumMax[0])[0]=='daohuo'?'到货单':Object.keys(isumMax[0])[0]=='ruku'?'入库单':'发票'
        return message.error('变更数量必须大于等于下游单据【'+text+',数量:'+Object.values(isumMax[0])[0]+'】，请重新输入！')
      }
    }
    r.biandong='1'
  }

  let h = formFuns.value.getFormValue();
  if (hasBlank(r.cwhcode) && !hasBlank(h.cwhcode)){
    let cangkuInfo =  ckListOptions.value.filter(it => it.id == h.cwhcode)[0]
    if (null != cangkuInfo) {
      r['cangkuDuli'] = cangkuInfo.ckIsDuli
      if (cangkuInfo.ckIsDuli == '1') {
        r['cwhcode'] = h.cwhcode
        r['cwhcodeText'] = cangkuInfo.ckName
      }
    }
  }
  r.itaxrate=isNaN(r.itaxrate)?0:r.itaxrate
  switch (c) {
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
      break;
    case 'bcheck1':
      if(r.bcheck1!==undefined){
        chChange(r)
      }
      break;
    case 'cinvode':
      console.log(tempType.value)
      if (r.cinvodeName == null) r.cinvodeName = r.tempEleven
      if (r.bcheck1 == null ) r.bcheck1 = r.tempThree
      chChange(r)
      break;
    case 'itaxrate':// 税率 【itaxprice 税额】
       if(!hasBlank(r.cnumber)){
          let str=''
         if(!hasBlank(r.taxprice)){
           str='taxprice'
         }else if(!hasBlank(r.isum)){
           str='isum'
         }
         tableDataChange(r,str)
       }
      break;
    case 'taxprice':// 含税单价
      if (!hasBlank(r.cnumber)) {
        let n:any = parseFloat(r.cnumber).toFixed(10)
        if (titleValue.value != 0 && n > 0) n = 0 - (Math.abs(n))
        let d:any = hasBlank(r.taxprice)?0:parseFloat(r.taxprice).toFixed(10)
        r.isum = parseFloat(String(n * d )).toFixed(4)
        r.tempIsum = r.isum

        let itaxrate:any=hasBlank(r.itaxrate)?1:1+(r.itaxrate/100)
        // 无税金额=价税合计÷税率
        r.tempTen =parseFloat(String(r.isum/itaxrate)).toFixed(4)
        r.icost =r.tempTen
        // 无税单价
        r.tempNine =parseFloat(String(r.icost/n)).toFixed(10)
        r.price =r.tempNine
        // 税额=价税合计-无税金额
        r.itaxprice=r.isum-r.icost>0?parseFloat(String(r.isum-r.icost)).toFixed(4):0
      }
      break;
    case 'isum':// 价税合计
      if (!hasBlank(r.cnumber)) { //反算 单价
        let n:any = parseFloat(r.cnumber).toFixed(10)
        if (titleValue.value != 0 && n > 0) n = 0 - (Math.abs(n))
        let d:any = hasBlank(r.isum)?0:parseFloat(r.isum).toFixed(4)

        r.taxprice = d/n>0?parseFloat(String(d/n) ).toFixed(10) + '':0
        r.tempTaxprice = r.taxprice

        let itaxrate:any=hasBlank(r.itaxrate)?1:1+(r.itaxrate/100)
        // 无税金额
        r.tempTen =parseFloat(String(r.isum/itaxrate)).toFixed(4)
        r.icost =r.tempTen
        // 无税单价
        r.tempNine =parseFloat(String(r.icost/n)).toFixed(10)
        r.price =r.tempNine
        // 税额=价税合计-无税金额
        r.itaxprice=r.isum-r.icost>0?parseFloat(String(r.isum-r.icost)).toFixed(4):0
      }
      break;
  }
}

const findByUnitList = async (record) => {
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
const slChange0 = (r) => {
  if ( r.cunitType == '0' && r.unitInfo != null){ // 存在多计量的清空
    // 运算辅助数量
    let list = JsonTool.parseObj(r.unitInfo.detail) || []
    list=list.filter(jl=>!hasBlank(jl.unitName))
    if (list.length > 0){
      let conversionRate=list.filter(a=>a.id==r.cgUnitId)[0].conversionRate
      r.baseQuantity=parseFloat(r.cnumber)*parseFloat(conversionRate)
      r.tempSix=r.baseQuantity

      let n:any = parseFloat(r.baseQuantity).toFixed(10)
      let isnum  = (r.unitInfo.unitType == '2')
      let conversionRate1:any=0
      let conversionRate2:any=0
      if(list.length==2){
        conversionRate1=list[1].conversionRate
      }else if(list.length==3){
        conversionRate1=list[1].conversionRate
        conversionRate2=list[2].conversionRate
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
  findByUnitList(record)
  record.baseQuantity=null
  record.subQuantity1=null
  await findByPrice(record)
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
    }
    tableDataChange(record,'cnumber')
  }
  else{
    tableDataChange(record,'taxprice')
  }
}
const isGiveChange = (r) => {
  if (r.isGive){
    r.tempNine=0;
    r.tempTen=0;
    r.tempTaxprice=0;
    r.tempIsum=0;
    r.price=r.tempNine
    r.icost=r.tempTen
    r.taxprice=r.tempTaxprice
    r.isum=r.tempIsum
    tableDataChange(r,'taxprice')

    // 重新计算合计行
    setTimeout(()=>{
      calculateTotal()
    },200)
  }else {
    message.info('请完善单价！')
  }
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
const {proxy}:any = getCurrentInstance()
/**
 * @param e 回车确定事件
 * @param r rowObj
 * @param c className
 * @param t mark
 */
const focusNext =  (r, c) => {
  // 得到当前临时标记
  if(c=='bcheck1'){
    c=r.tempThree==undefined?'bcheck1':'cinvode'
  }
  let t = getNextMark(c,false)
  Object.keys(r).map(i=>{if (i.startsWith('edit')) r[i] = null})
  r[`${c}`] = r[`temp${t}`];
  // 列表值发生变动 监听调整
  tableDataChange(r,c)
  // 获取供应商价格表
  findBySupPrice(r)
    // 查找下一个
    let list = getDataSource();
    let filters:any = ['isGive','cinvodeType','cunitid','cinvodeName','cunitidF1','cunitidF2','itaxprice','baseQuantity','subQuantity1', 'subQuantity2']
    // 要求填批号才填写
    if (!r.isBatch)filters.push('batchId')
    if (!r.isIndate)filters.push('dpdate'),filters.push('dvdate')
    // 单计量跳过计量1、2
    if (r.cunitType=='1')filters.push('subQuantity1'),filters.push('subQuantity2');
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
        r[`${nextC}`] = r[`temp${nextMark}`];
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
  let model = {cnumber:'Cnumber',cgUnitId:'CgUnitId',cwhcode:'One',bcheck1:'Three',cinvode:'Two',baseQuantity:'Six',subQuantity1:'SubQuantity1',subQuantity2:'SubQuantity2',price:'Nine',icost:'Ten',taxprice:'Taxprice',itaxrate:'Itaxrate',isum:'Isum',batchId:'Twelve',dpdate:'Dpdate',arrivalDate:'ArrivalDate',dvdate:'Fifteen',cmemo:'Thirteen'}
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
  let cvencode=formFuns.value.getFormValue().cvencode
  let supPrice=await useRouteApi(stockSupPriceFindBySupIdAndStockNum, {schemaName: dynamicTenantId})({supId:cvencode,stockNum:cinvode})
  let memberprice=supPrice!==''?supPrice.memberprice:0

  if(supPrice!==''){
    // 供应商价格表含税（默认值1是，0或空否）
    if(dynamicTenant.value.target.cgPriceIsRate=='1'){
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
    if(dynamicTenant.value.target.cgPriceZjyc=='1'){
      let temp= await useRouteApi(findByStockWareRecentlySupMoney, {schemaName: dynamicTenantId})({supId:formFuns.value.getFormValue().cvencode})
      memberprice=temp==''?0:temp
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

/*变更专区*/
const cunitFormat = (list,id) => {
  if (null == list || hasBlank(id)) return id;
  let it = list.filter(it=>it.value == id)[0]
  return  null == it?id:it.title
}

async function cgUnitIdChange(record) {
  record.cinvodeType= record.unitList.filter(a=>a.value==record.tempCgUnitId)[0].ggxh
  record.bcheck1= record.unitList.filter(a=>a.value==record.tempCgUnitId)[0].txm
  record.cgUnitId=record.unitList.filter(a=>a.value==record.tempCgUnitId)[0].value
  slChange0(record)
}
async function tempTaskSave(method) {
  await useRouteApi(stockBalanceTaskSave, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,userName:useUserStoreWidthOut().getUserInfo.id,functionModule:'采购订单',method:method,recordNum:formItems.value.ccode,caozuoModule:'stock'})
    .then((a)=>{
      taskInfo.value=a
      console.log('任务='+JSON.stringify(a))
    })
}
async function tempTaskDel(id) {
  await useRouteApi(stockTaskDelById, { schemaName: dynamicTenantId })(id)
}
async function saveLogData(optAction) {
  let logmap={
    loginTime:new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "),
    userId: useUserStoreWidthOut().getUserInfo.username,
    userName: useUserStoreWidthOut().getUserInfo.realName,
    optModule:'stock',
    optFunction:'采购订单',
    uniqueCode:formItems.value?.ccode,
    optAction:optAction,
    accId:dynamicAccId.value,
    optContent:'操作内容【采购订单】,单据编号【'+formItems.value?.ccode+'】',
  }
  await saveLog(logmap)
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
// 变动后保存
async function saveBiandong() {
  // 数量改变时加入变动表
  let biandongTrue=false
  // 新的明细
  let list = getDataSource().filter(it => !hasBlank(it.cinvode) && !hasBlank(it.cunitid) && !hasBlank(it.baseQuantity) && !hasBlank(it.icost + '') && !hasBlank(it.price + ''))
  for (let i = 0; i < list.length; i++) {
    list[i].isGive=list[i].isGive?'1' : '0'
    list[i].isBatch=list[i].isBatch?'1' : '0'
    if(list[i].biandong=='1'){ biandongTrue=true }
  }

  if (saveCheck(list)) {
    if(biandongTrue) formItems.value.biandong='1'

    // 变更前主数据
    await useRouteApi(findStockWareByCcode, {schemaName: dynamicTenantId})(formItems.value.ccode)
    .then(async (a)=>{
        a.id=null
        a.biandong='1'
        a.biandongUser=useUserStoreWidthOut().getUserInfo.id
        a.baindongDate=newDate.value
        a.theDeposit = !hasBlank(a.theDeposit)?a.theDeposit.replace(/\$\s?|(,*)/g, ''):''
        // to变更表
        if(biandongTrue) await useRouteApi(saveStockWarehousingPOJO, {schemaName: dynamicTenantId})(a)
      })
    // 变更前子数据
    await useRouteApi(findAllByCcodeAndBillStyle, {schemaName: dynamicTenantId})({ccode:formItems.value.ccode,type:'CGDD'})
    .then(async (a)=>{
        a.forEach(item=>{
          item.id=null
          item.biandong='1'
          item.biandongUser=useUserStoreWidthOut().getUserInfo.id
          item.baindongDate=newDate.value
        })
        // to变更zi表
        if(biandongTrue) await useRouteApi(saveStockWarehousingsListPOJO, {schemaName: dynamicTenantId})(a)
      })

    formItems.value.squantity=sumArr(list.map(a=>a.baseQuantity))
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
function sumArr(arr) {
  if(arr.length==0)return
  return arr.reduce(function(prev, curr, idx, arr){
    return parseFloat(prev) + parseFloat(curr);
  });
}

// 单据 关闭/开启
const setBcloser = async (flag) => {
  let aaa:any=flag?'单据停用后不可被参照、生单。确定继续吗？':'单据启用后可被参照、生单。确定继续吗？'
  createConfirm({
    iconType: 'warning',
    title: '提示',
    content: aaa,
    onOk: async () => {
      formItems.value.bcloser=flag?'1':'0'
      formItems.value.bcloserTime=flag?newDate.value:''
      formItems.value.bcloserUser=flag?useUserStoreWidthOut().getUserInfo.id:''
      await useRouteApi(reviewSetCGRKG, {schemaName: dynamicTenantId})(formItems.value)
      // 新的明细
      let list = getDataSource().filter(it => !hasBlank(it.cinvode) && !hasBlank(it.cunitid) && !hasBlank(it.baseQuantity) && !hasBlank(it.icost + '') && !hasBlank(it.price + ''))
      for (let i = 0; i < list.length; i++) {
        list[i].bcloser=flag?'1':'0'
        list[i].bcloserTime=flag?newDate.value:''
        list[i].bcloserUser=flag?useUserStoreWidthOut().getUserInfo.id:''
      }
      await useRouteApi(stockWarehListSave, {schemaName: dynamicTenantId})(list)
      tempTaskDel(taskInfo.value?.id)
      saveLogData(flag?'停用':'启用')
      message.success(`${flag?'停用':'启用'}成功！`)
      pageParameter.type='CGDD'
      await contentSwitch('curr','')
    }
  })
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
      pageName:'采购订单'
    }
  })
}
const toPrintPage = () => {
  router.push({
    path:'/sz-print-template',
    query: {name: router.currentRoute?.value?.meta?.title,mark:  router.currentRoute?.value?.fullPath.replace('/','')},
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

// 生成采购到货单
const setCGDHD_data = async () => {
  loadMark.value=true
  //  是否生成过 采购入库单
  let cgrkd= await useRouteApi(findByIyearAndCcodeAndXyBillStyle, {schemaName: dynamicTenantId})({iyear:dynamicYear.value,ccode:formItems.value.ccode,xyBillStyle:'CGRKD'})
  if(!hasBlank(cgrkd)){
    loadMark.value=false
    return message.error('当前单据已生成采购入库单,不能生成其他类型！！')
  }

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
      loadMark.value=false
      return message.error('当前单据业务期间已经结账，不能进行变更操作，请取消期间结账后继续！！')
    },1000)
  }
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

  createConfirm({
    iconType: 'warning',
    title: '生成采购到货单',
    content: '您确定要生成采购到货单吗!',
    onOk: async () => {
      // 生成到货单明细
      let listarr:any=[]
      let list = JsonTool.parseObj(res.entryList).map(it => resetRow(it))
      let oldlist = JsonTool.parseObj(res.entryList).map(it => resetRow(it))
      for (let i = 0; i < list.length; i++) {
        let temp=list[i]
        let parentLineCode=temp.lineCode
        // 寻找就数据
        let oldData=oldlist.filter(a=>a.key==temp.key)
        let unitRate= await useRouteApi(getUnitRate, {schemaName: dynamicTenantId})({cgUnitId:temp.cgUnitId,ccode:temp.ccode})
        temp.cnumber=(parseFloat(oldData[0]?.baseQuantity)-parseFloat(hasBlank(oldData[0]?.isumDaohuo)?0:oldData[0]?.isumDaohuo))/parseFloat(unitRate?.conversionRate)
        let baseQuantity:any=parseFloat(temp.cnumber)
        temp.tempCnumber=baseQuantity
        temp.cnumber=baseQuantity
        // 计算主计量....
        slChange0(temp)

        // 存货信息
        let stockInfo2=await useRouteApi(findByStockNum2,{schemaName: dynamicTenantId})(temp.cinvode)

        temp.id=null
        temp.isGive=false
        temp.isBatch=stockInfo2.stockPropertyBatch=='1'?true:false
        temp.isIndate=stockInfo2.stockIndateManage=='1'?true:false
        temp.bdocumStyle='0'
        temp.billStyle='CGDHD'
        temp.ccode=newRuKuNum
        temp.lineCode=randomString(30)
        temp.key=temp.lineCode
        temp.bcheck='0'
        temp.bcheckTime=''
        temp.bcheckUser=''
        temp.isumDaohuo='0'
        temp.sourcetype='CGDD'
        temp.sourcecode=oldNum
        temp.sourcedetailId=parentLineCode
        temp.sourcedate=oldddate
        temp.cinvodeInfo = stockInfo2
        // 规格型号、条形码
        // temp.cinvodeType=temp.unitList.filter(a=>a.id==temp.cgUnitId)[0]?.ggxh
        // temp.bcheck1=temp.unitList.filter(a=>a.id==temp.cgUnitId)[0]?.barcode

        if(baseQuantity>0){
          listarr.push(temp)
        }
      }
      if(listarr.length==0){
        message.error('数量不足，无法生成采购到货单')
        return false;
      }

      // 生成到货单
      formItems.value.id=null
      formItems.value.ccode=newRuKuNum
      formItems.value.billStyle='CGDHD'
      formItems.value.bcheck='0'
      formItems.value.bcheckTime=''
      formItems.value.bcheckUser=''
      formItems.value.bdocumStyle='0'
      formItems.value.sourcetype='CGDD'
      formItems.value.sourceccode=formFuns.value.getFormValue().ccode
      formItems.value.isum=sumArr(listarr.map(a=>a.isum))
      formItems.value.icost=sumArr(listarr.map(a=>a.icost))
      formItems.value.squantity=sumArr(listarr.map(a=>a.baseQuantity))
      formItems.value.taxAmount=sumArr(listarr.map(a=>a.itaxprice))
      message.success(`跳转采购到货单页签！`)
      let dataArr={
        data:formItems.value,
        mx:JSON.stringify(listarr)
      }
      loadMark.value=false
      // 跳转到货单页面
      router.push({path:'cg-arrive',query:{type:'cgdd',json:JSON.stringify(dataArr)}})
    }
  })
}
// 生成采购入库单
const setCGRKD_data = async () => {
  loadMark.value=true
  //  是否生成过 采购到货单
  let cgrkd= await useRouteApi(findByIyearAndCcodeAndXyBillStyle, {schemaName: dynamicTenantId})({iyear:dynamicYear.value,ccode:formItems.value.ccode,xyBillStyle:'CGDHD'})
  if(!hasBlank(cgrkd)){
    loadMark.value=false
    return message.error('当前单据已生成采购到货单,不能生成其他类型！！')
  }

  let ddate=''
  if(parseFloat(useCompanyOperateStoreWidthOut().getLoginDate.replaceAll('-',''))<parseFloat(formItems.value.ddate.replaceAll('-',''))){
    ddate=formItems.value.ddate
  }else{
    ddate=useCompanyOperateStoreWidthOut().getLoginDate
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

      // 生成入库单明细
      let listarr:any=[]
      let list = JsonTool.parseObj(res.entryList).map(it => resetRow(it))
      let oldlist = JsonTool.parseObj(res.entryList).map(it => resetRow(it))
      for (let i = 0; i < list.length; i++) {
        let temp=list[i]
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
        // 存货信息
        let stockInfo2=await useRouteApi(findByStockNum2,{schemaName: dynamicTenantId})(temp.cinvode)
        temp.id=null
        temp.isGive=false
        temp.isBatch=stockInfo2.stockPropertyBatch=='1'?true:false
        temp.isIndate=stockInfo2.stockIndateManage=='1'?true:false
        temp.bdocumStyle='0'
        temp.billStyle='CGRKD'
        temp.ccode=newRuKuNum
        temp.lineCode=randomString(30)
        temp.key=temp.lineCode
        temp.bcheck='0'
        temp.bcheckTime=''
        temp.bcheckUser=''
        temp.isumRuku='0'
        temp.sourcetype='CGDD'
        temp.sourcecode=oldNum
        temp.sourcedetailId=parentLineCode
        temp.sourcedate=oldddate
        temp.cinvodeInfo = stockInfo2
        // 规格型号、条形码
        // temp.cinvodeType=temp.unitList.filter(a=>a.id==temp.cgUnitId)[0]?.ggxh
        // temp.bcheck1=temp.unitList.filter(a=>a.id==temp.cgUnitId)[0]?.barcode

        if(baseQuantity>0){
          listarr.push(temp)
        }
      }

      if(listarr.length==0){
        message.error('数量不足，无法生成采购入库单')
        return false;
      }

      // 生成入库单
      formItems.value.id=null
      formItems.value.ccode=newRuKuNum
      formItems.value.billStyle='CGRKD'
      formItems.value.bcheck='0'
      formItems.value.bcheckTime=''
      formItems.value.bcheckUser=''
      formItems.value.bdocumStyle='0'
      formItems.value.sourcetype=oldNum
      formItems.value.isum=sumArr(listarr.map(a=>a.isum))
      formItems.value.icost=sumArr(listarr.map(a=>a.icost))
      formItems.value.squantity=sumArr(listarr.map(a=>a.baseQuantity))
      formItems.value.taxAmount=sumArr(listarr.map(a=>a.itaxprice))

      message.success(`跳转采购入库单页签！`)
      let dataArr={
        data:formItems.value,
        mx:JSON.stringify(listarr)
      }
      loadMark.value=false
      // 跳转入库单页面
      router.push({path:'kc-cgDepot',query:{type:'cgdd',json:JSON.stringify(dataArr)}})
    }
  })
}
// 生成采购发票
const setCGFP_data = () => {
  loadMark.value=true
  let ddate=''
  if(parseFloat(useCompanyOperateStoreWidthOut().getLoginDate.replaceAll('-',''))<parseFloat(formItems.value.ddate.replaceAll('-',''))){
    ddate=formItems.value.ddate
  }else{
    ddate=useCompanyOperateStoreWidthOut().getLoginDate
  }
  createConfirm({
    iconType: 'warning',
    title: '生成采购发票',
    content: '您确定要生成采购发票吗？',
    onOk: async () => {
      let oldNum=formItems.value.ccode
      let oldddate=formItems.value.ddate
      let newRuKuNum=await useRouteApi(findBillCode, {schemaName: dynamicTenantId})({type: "CGFP",date:  ddate,prefix: "",key: '3-2'})
      let res = await useRouteApi(findBillByCondition, {schemaName: dynamicTenantId})({
        type: pageParameter.type,
        iyear: dynamicYear.value || '2022',
        action: 'tail',
        ccode: formItems.value.ccode,
        bdocumStyle: '0',
        curr: ''
      })

      // 生成入库单明细
      let listarr:any=[]
      let list = JsonTool.parseObj(res.entryList).map(it => resetRow(it))
      let oldlist = JsonTool.parseObj(res.entryList).map(it => resetRow(it))
      for (let i = 0; i < list.length; i++) {
        let temp=list[i]
        let parentLineCode=temp.lineCode
        // 寻找就数据
        let oldData=oldlist.filter(a=>a.key==temp.key)
        let unitRate= await useRouteApi(getUnitRate, {schemaName: dynamicTenantId})({cgUnitId:temp.cgUnitId,ccode:temp.ccode})

        temp.cnumber=(parseFloat(oldData[0]?.baseQuantity)-parseFloat(hasBlank(oldData[0]?.isumFapiao)?0:oldData[0]?.isumFapiao))/parseFloat(unitRate?.conversionRate)
        let baseQuantity:any=parseFloat(temp.cnumber)
        temp.tempCnumber=baseQuantity
        temp.cnumber=baseQuantity
        // 计算主计量....
        slChange0(temp)
        temp.id=null
        temp.isGive=false
        temp.isBatch=false
        temp.bdocumStyle='0'
        temp.billStyle='CGFP'
        temp.ccode=newRuKuNum
        temp.lineCode=randomString(30)
        temp.key=temp.lineCode
        temp.bcheck='0'
        temp.bcheckTime=''
        temp.bcheckUser=''
        temp.isumRuku='0'
        temp.sourcetype='CGDD'
        temp.sourcecode=oldNum
        temp.sourcedetailId=parentLineCode
        temp.sourcedate=oldddate
        // 规格型号、条形码
        // temp.cinvodeType=temp.unitList.filter(a=>a.id==temp.cgUnitId)[0]?.ggxh
        // temp.bcheck1=temp.unitList.filter(a=>a.id==temp.cgUnitId)[0]?.barcode

        // 存货信息
        let stockInfo2=await useRouteApi(findByStockNum2,{schemaName: dynamicTenantId})(temp.cinvode)
        temp.cinvodeInfo = stockInfo2

        if(baseQuantity>0){
          listarr.push(temp)
        }
      }

      if(listarr.length==0){
        message.error('数量不足，无法生成采购发票')
        return false;
      }

      // 生成入库单
      formItems.value.id=null
      formItems.value.ccode=newRuKuNum
      formItems.value.billStyle='CGFP'
      formItems.value.bcheck='0'
      formItems.value.bcheckTime=''
      formItems.value.bcheckUser=''
      formItems.value.bdocumStyle='0'
      formItems.value.sourcetype=oldNum
      formItems.value.isum=sumArr(listarr.map(a=>a.isum))
      formItems.value.icost=sumArr(listarr.map(a=>a.icost))
      formItems.value.squantity=sumArr(listarr.map(a=>a.baseQuantity))
      formItems.value.taxAmount=sumArr(listarr.map(a=>a.itaxprice))

      message.success(`跳转采购发票页签！`)
      let dataArr={
        data:formItems.value,
        mx:JSON.stringify(listarr)
      }
      loadMark.value=false
      // 跳转入库单页面
      router.push({path:'cg-bill',query:{type:'cgdd',json:JSON.stringify(dataArr)}})
    }
  })
}
// 复制
const copyFun = async () => {
  // loadMark.value=true
  status.value = 2
  stockWareData.value=''

  // 获取最新
  let code = await generateCode(useCompanyOperateStoreWidthOut().getLoginDate)
  formFuns.value.setFormValue({
    id:null,
    ddate: useCompanyOperateStoreWidthOut().getLoginDate,
    ccode: code,
    cvencode: formItems.value.cvencode,
    cvencodeContact: formItems.value.cvencodeContact,
    invoiceStyle: formItems.value.invoiceStyle,
    methodPay: formItems.value.methodPay,
    payDate: formItems.value.payDate,
    theDeposit: formItems.value.theDeposit,
    rate: formItems.value.rate,
    cdepcode: formItems.value.cdepcode,
    cpersoncode: formItems.value.cpersoncode,
    cmemo: formItems.value.cmemo,
  })
  let list = getDataSource().map(t=>{t.id=null;t.ccode=code;t.sourcecode=null;t.sourcetype=null;t.sourcedetailId=null;t.sourcedate=null;
    t.isumJiesuan=0;t.isumFapiao=0;t.isumRuku=0;t.hxIsum=0;t.isumDaohuo=0;t.isumTuiHuo=0;t.isumFapiaoMoney=0;t.lineCode=randomString(30);return t;})
  let dLen = list.length
  for (let i = dLen; i < 50; i++) {
    list.push({})
  }
  setTableData(list)
  loadMark.value=false
}
import { onBeforeRouteLeave } from 'vue-router'
onBeforeRouteLeave(giveUp)
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
