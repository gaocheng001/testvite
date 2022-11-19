<template>
  <div class="app-container">
    <div class="app-container-top lcr-theme-div">
      <div    >
        <div>
          <CopyOutlined style="color: white;font-size: 50px;"/>
        </div>
        <div>  <AccountPicker theme="three" @reloadTable="dynamicAdReload" :readonly="status != 3?'':'false'"/></div>
      </div>
      <div></div>
      <div>
        <div>
            <Button class="actod-btn" @click="router.push('/kc-xsDepot-list')">查询</Button>
            <Button class="actod-btn" @click="startEdit('add')" v-if="status == 3">新增</Button>
            <Button class="actod-btn" v-if="status != 3 && formItems.bcheck != '1'" @click="referData()" >参照</Button>
            <Button class="actod-btn" @click="saveData" v-if="status == 1 || status == 2" >保存</Button>
            <Button class="actod-btn" @click="giveUp" v-if="status == 1 || status == 2">放弃</Button>
            <Button class="actod-btn" @click="startEdit('edit')"
                    v-if="status == 3 &&formItems.ccode !=null && formItems.bcheck != '1'" >修改
            </Button>
            <!--          <Button class="actod-btn" @click="tableAdd" v-if="status == 1 || status == 2">插行</Button>-->
            <Button class="actod-btn" @click="tableDel" v-if="status == 1 || status == 2">删行</Button>
            <Button class="actod-btn" @click="startDel" v-if="status == 3 && formItems.bcheck != '1'" >
              删除
            </Button>
            <Button class="actod-btn" @click="startReview(true)"
                    v-if="status == 3 && formItems.bcheck != '1'">审核
            </button>
            <Button class="actod-btn" @click="startReview(false)"
                    v-if="status == 3 && formItems.bcheck == '1'">弃审
            </button>
            <Popover placement="bottom" v-if="status == 3">
              <template #content>
                <Button  style="width: 120px;margin-bottom: 2px" @click="lySourcePop">来源单据</Button><br/>
                <Button style="width: 120px;margin-bottom: 2px" @click="xySourcePop">确认变化差异</Button>
              </template>
              <Button  class="actod-btn">联查</Button>
            </Popover>
            <Button class="actod-btn actod-btn-last" @click="outBefore">退出</Button>

          </div>
        <div :class="status != 3?'status-look':''">
          <div class="acttd-right-d-search">
            <InputSearch
              class="acttdrd-search-input"
              placeholder="存货编码或名称"
              @search="pageSearch"
              v-model:value="pageParameter.searchConditon.value"
              style="border-left:1px solid #c9c9c9;"
            />
          </div>
          <div class="acttd-right-d-btns">
            <Button class="acttdrd-btn" @click="pageReload()">
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
            <VerticalRightOutlined @click="contentSwitch('first')"/>&nbsp;
            <LeftOutlined @click="contentSwitch('prev')"/>&nbsp;
            <RightOutlined @click="contentSwitch('next')"/>&nbsp;
            <VerticalLeftOutlined @click="contentSwitch('tail')"/>
            <span v-if="status=='3'" class="anticon" style="margin-left: 1em">
              <Tag v-if="formItems.bcheck=='1'" :color="'volcano' ">
                已审核
              </Tag>
            </span>
          </div>
          <span style="font-size: 22px;font-weight: bold;"
                :style="{color: titleValue===0?'#0096c7':'red'}">{{
              titleContents[titleValue]
            }}</span>
          <span style="display: inline-block;width: 280px;"></span>
        </div>
        <div class="acbgead-two" :style="status == 3?{ pointerEvents: 'none'}:{}">
          <DynamicForm :datasource="dynamicFormModel" :formDataFun="formFuns"
                       :accId="dynamicTenantId" @open="openHeadSelectContent"/>
        </div>
      </div>
      <div class="acb-centent">
        <!--  针对过滤框显示添加的内容高度 :class="status == 3?'status-look':''"  -->
        <!--       :rowKey="r=>r.assetsCode"-->
        <BasicTable
          ref="tableRef"
          :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
          :clickToRowSelect="false"
          :loading="loadMark"
          :row-selection="{ type: 'checkbox',selectedRowKeys: tableSelectedRowKeys, onChange: onSelectChange ,getCheckboxProps:(r)=>({disabled: r.cinvode== null})}"
          :scroll="{ x: totalColumnWidth,y: windowHeight-(150 + (formRowNum*39))}"
          size="small"
          @register="registerTable"
        >
          <template #cwhcode="{ record }">
            <template v-if="record.editOne">
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
<!--              <div @click="record.tempOne=record.cwhcode,record.editOne = true;"
                   :class="status == 1 || status == 2?'suspended-div':'status-look'">-->
              <div>
                <span>{{ record.cwhcodeText }}</span>
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
                @keyup.enter="chFocus = 'one';focusNext(record,'cinvode')"
              ></Select>
              <SearchOutlined @click="openSelectContent(record,'cinvode')"/>
            </template>
            <template v-else>
<!--              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempTwo=record.cinvode,record.editTwo = true;">-->
              <div>
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
                @keyup.enter="chFocus = 'two';focusNext(record,'cinvode')"
              ></Select>
              <SearchOutlined @click="openSelectContent(record,'cinvode')"/>
            </template>
            <template v-else>
<!--              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempEleven=record.cinvodeName,record.editEleven = true;">-->
              <div>
                <span class="a-table-font-arial">{{ record?.cinvodeName }}</span>
              </div>
            </template>
          </template>

          <template #cinvodeBarcode="{ record }">
            <template v-if="record.editThree">
              <Select
                v-model:value="record.tempThree"
                show-search
                style="width: 82%;"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                :options="cardListOptions"
                @change="value=>handleChange(value,'three')"
                @search="value=>handleSearch(value,'three')"
                @keyup.enter="chFocus = 'three';focusNext(record,'cinvode')"
              ></Select>
              <SearchOutlined @click="openSelectContent(record,'cinvode')"/>
            </template>
            <template v-else>
<!--              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempThree=record.cinvodeBarcode,record.editThree = true;">-->
              <div>
                <span class="a-table-font-arial">{{ record?.cinvodeBarcode }}</span>
              </div>
            </template>
          </template>
          <template #xsUnitId="{ record }">
            <div>
              <span>{{cunitFormat(record.unitList,record.xsUnitId)}}</span>
              </div>
          </template>

          <template #cunitid="{ record }">
            <div>
              <span>{{cunitFormat(record.unitList,record.cunitid)}}</span>
            </div>
          </template>
          <template #cunitidF1="{ record }">
            <div >
              <span>{{cunitFormat(record.unitList,record.cunitidF1)}}</span>
            </div>
          </template>
          <template #cunitidF2="{ record }">
            <div>
              <span>{{cunitFormat(record.unitList,record.cunitidF2)}}</span>
            </div>
          </template>
          <template #quantity="{ record }">
            <template v-if="record?.editQuantity &&  record.cinvode != null">
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
                   @click="record.tempQuantity=record.quantity,record.editQuantity = true;">
                    <span class="a-table-font-arial">{{
                        (record.quantity == null ? '' : parseFloat(record.quantity).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }}</span>
              </div>
            </template>
          </template>
          <template #baseQuantity="{ record }">
<!--            <template v-if="record?.editSix">
              <InputNumber v-model:value="record.tempSix"
                           class="baseQuantity"
                           :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           style="width: 82%;"
                           @keyup.enter="/*tableDataChange(record);*/focusNext(record,'baseQuantity')"/>
              <CheckOutlined
                @click="record.editSix = null;record.baseQuantity=record.tempSix;tableDataChange(record,'baseQuantity')"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempSix=record.baseQuantity,record.editSix = true;">-->
            <div>
                    <span class="a-table-font-arial">{{
                        (record.baseQuantity == null ? '' : parseFloat(record.baseQuantity).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }}</span>
              </div>
<!--            </template>-->
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
            <template v-if="record?.editNine">
              <InputNumber v-model:value="record.tempNine" class="price"
                           :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           style="width: 82%;"
                           @keyup.enter="focusNext(record,'price')"/>
              <CheckOutlined
                @click="record.editNine = null;record.price=record.tempNine;tableDataChange(record,'price')"/>
            </template>
            <template v-else>
              <div>
         <span class="a-table-font-arial">{{
             (record.price == null ? '' : parseFloat(record.price).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
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
                @click="record.editTen = null;record.icost=record.tempTen;tableDataChange(record,'icost')"/>
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
          <!-- 含税单价-->
          <template #taxprice="{ record }">
            <template v-if="record?.editTaxprice">
              <InputNumber v-model:value="record.tempTaxprice" class="taxprice"
                           :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           style="width: 82%;"
                           @keyup.enter="focusNext(record,'taxprice')"/>
              <CheckOutlined
                @click="record.editTaxprice = null,record.taxprice=record.tempTaxprice,tableDataChange(record,'taxprice')"/>
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
          <!-- 税率-->
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
<!--              <div :class="record.isGive ||  status == 3?'status-look':'suspended-div'"
                   @click="record.tempItaxrate=record.itaxrate,record.editItaxrate = true;">-->
              <div>
                    <span class="a-table-font-arial">{{
                        (record.itaxrate == null ? '' : parseFloat(record.itaxrate*100).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
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

          <template #isGive="{ record }">
            <Switch v-model:checked="record.isGive" :disabled="true|| status == 3" size="small"
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
              <!--         focusNext(record,'batchId')     <CheckOutlined @click="record.editTwelve = null;record.batchId=record.tempTwelve;"/>-->
            </template>
            <template v-else>
<!--              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempTwelve=record.batchId,record.editTwelve = true;">-->
              <div>
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
              <!--              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                                 @click="record.tempFifteen=record.dvdate,record.editFifteen = true;">-->
              <div>
                <span class="a-table-font-arial">{{ record.dvdate }}</span>
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
                <TableSummaryCell class="nc-summary" v-for="cell in getCurrSummary()"  :index="cell.ind" :align="cell.align"><span class="a-table-font-arial">{{null == summaryModel[cell.dataIndex]?'':summaryModel[cell.dataIndex].toFixed(2)}}</span></TableSummaryCell>
              </TableSummaryRow>
            </TableSummary>
          </template>
        </BasicTable>
        <Import
          @save="introduceData"
          @register="registerImportPage"
        />
        <Query
          @query="loadPage"
          @register="registerQueryPage"
        />
      </div>
    </div>
    <SupperModalPop @throwData="modalData" @register="registerModalPopPage"/>
    <DeptModalPop @register="registerSelectDeptPage" @save="modalData"/>
    <StockCangKuModalPop @register="registerStockCangKuModalPage" @throwData="modalData"/>
    <SelectPsn @register="registerSelectPsnPage" @save="modalData"/>
    <StockInfiModalPop @register="registerStockInfoModalPage" @throwData="modalData"/>

    <Difference @register="registerXySourcePage"/>
    <LySource @register="registerlySourcePage"/>
    <Refer @register="registerReferModalPage" @throwData="referThrowData"/>
  </div>
</template>

<script setup="props, {emit}" lang="ts">
import {
  Button,
  Checkbox,
  DatePicker,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Popover,
  Radio,
  Select,
  Switch,
  Table,
  Tabs,Tag
} from "ant-design-vue";
import Query from "./popup/query.vue";
import Import from "./popup/import.vue";
import Refer from "./popup/refer.vue";
import DynamicForm from './component/DynamicForm.vue';
import CustomizeConfirmContent from "./component/CustomizeConfirmContent.vue";
import {
  CheckOutlined,
  EditOutlined,
  LeftOutlined,
  PicLeftOutlined,
  RightOutlined,
  SearchOutlined,
  SettingFilled,
  SortAscendingOutlined,
  SortDescendingOutlined,
  SyncOutlined,
  VerticalLeftOutlined,
  VerticalRightOutlined,FileSearchOutlined,CopyOutlined
} from '@ant-design/icons-vue';
import {createVNode, getCurrentInstance, nextTick, reactive, ref} from "vue";
import {useMessage} from "/@/hooks/web/useMessage";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {JsonTool, NumberTool, ObjTool} from "/@/api/task-api/tools/universal-tools";
import {BasicTable, useTable} from '/@/components/Table'
import {useModal} from '/@/components/Modal'
import {findFaAssetInfoByCode} from "/@/api/fa/fa-assets-minus";
import DynamicColumn from "/@/views/boozsoft/stock/stock_sales_add/component/DynamicColumn.vue";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {useRoute} from "vue-router";
/**********************栏目设置**********************/
import { initDynamics} from "./data";
import {assemblyDynamicColumn} from "/@/views/boozsoft/stock/stock_sales_add/component/DynamicColumn";
import {usePlatformsStore} from "/@/store/modules/platforms";
import {GenerateDynamicColumn} from "./component/DynamicForm";
/*import SupperModalPop from "/@/views/boozsoft/system/supplier/popup/modalPop.vue";
import DeptModalPop from "/@/views/boozsoft/system/department/popup/select-dept.vue";*/
const SupperModalPop = null;
const DeptModalPop = null;
const SelectPsn = null;
import StockCangKuModalPop
  from "/@/views/boozsoft/stock/stock_cangku/popup/stockCangKuModalPop.vue";
/*import SelectPsn from "/@/views/boozsoft/system/department/popup/select-psn.vue";*/
import StockInfiModalPop from "/@/views/boozsoft/stock/stock_info/popup/stockInfoModalPop.vue";
import {findAll as findAllJiLang, findUnitInfoList} from "/@/api/record/system/unit-mea";
import {findCunHuoAllList} from "/@/api/record/stock/stock-caigou";
import {
  batchSelectorList, delQrd,
  delRuKu,
  findBillByCondition,
  findBillCode,
  findBillLastDate, findEntityAndDetailsByCcode, findQrdChangeList,
  reviewQrd, reviewSpecialQrd,
  saveXsqrd, unAuditBefore,
} from "/@/api/record/stock/stock-xhd";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {checkMonth, findStockPeriodInfoByYm} from "/@/api/record/group/im-unit";
import Difference from "./popup/difference.vue";
import LySource from "/@/views/boozsoft/stock/stock_sales_add/popup/lySource.vue";

const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const InputSearch = Input.Search
const SelectOption = Select.Option
const TabPane = Tabs.TabPane
const TableSummary = Table.Summary
const TableSummaryRow = Table.Summary.Row
const TableSummaryCell = Table.Summary.Cell

import {hasBlank, pointMessage} from "/@/api/task-api/tast-bus-api";
import {
  getByStockBalanceTask,
  stockBalanceTaskSave,
  stockTaskDelById
} from "/@/api/record/stock/stock_balance";
import {saveLog} from "/@/api/record/system/group-sys-login-log";
import {findByXyOutDataSourrce} from "/@/api/record/stock/stock-xy-source";
import {useNcModals} from "/@/views/boozsoft/stock/stock_out_add/otherServerReferences";
const {createErrorModal, createConfirm, createWarningModal} = useMessage()
const {closeCurrent} = useTabs(router);
const [registerQueryPage, {openModal: openQueryPageM}] = useModal()
const [registerImportPage, {openModal: openImportPageM}] = useModal()
const windowHeight = (window.innerHeight - 300)
const dynamicTenantId = ref('')
const dynamicTenant = ref(null)
const dynamicAccId = ref('')
const dynamicYear = ref('')
const titleContents = ['销售出库确认单', '销售出库确认单', '销售出库确认单']
const titleValue = ref(0)
const formRowNum = ref(1)
const pageParameter = reactive({
  showRulesSize: 'MIN',
  searchConditon: {
    requirement: '',
    value: '',
  },
  type: 'XSQRD'
})

const formItems: any = ref({})
const summaryModel: any = ref({})
const jiList = ref([])
const manyJiList = ref([])
const ckListOptions = ref([])
const operatorList = ref([])
const cardListOptions = ref([])
const assetsCardList = ref([])
const route = useRoute();
const searchList = ref([])
let num = 0
const dynamicAdReload = async (obj) => {
  num+=1
  dynamicTenant.value = obj
  dynamicTenantId.value = obj.accountMode
  dynamicAccId.value = obj.accId
  dynamicYear.value = obj.stockYear
  if (num != 2){
    await columnReload()
    await reloadList()
    lanMuData.value.changeNumber+=1
  }else {
    initTable()
  }

}
const dynamicFormModel = ref([])
const formFuns = ref({
  getFormValue: () => {
  }, setFormValue: () => {
  }, getSelectMap: () => {
  }
})
const columnReload = async () => {
  dynamicFormModel.value = await GenerateDynamicColumn(dynamicTenantId.value) || []
  formRowNum.value = Math.ceil((dynamicFormModel.value.filter(it=>it.isShow).length/4))-1
}

const routeData:any = route.query;
const pageReload = async () => {
  if(routeData.type!==undefined){
    if(routeData.type=='add'){
      await startEdit('add')
    }else if(routeData.type=='edit'){
      status.value=2
      await contentSwitch('tail',routeData.ccode)
    }else{
      await contentSwitch('tail',routeData.ccode)
    }
  }else{
    await contentSwitch(formItems.value.id == null?'tail':'curr')
  }
}
async function reloadList() {
  jiList.value = await useRouteApi(findAllJiLang, {schemaName: dynamicTenantId})({unitName: ''})
  manyJiList.value = await useRouteApi(findUnitInfoList, {schemaName: dynamicTenantId})({})
  assetsCardList.value = (await useRouteApi(findCunHuoAllList, {schemaName: dynamicTenantId})({date: useCompanyOperateStoreWidthOut().getLoginDate}))
  nextTick(()=>{
    ckListOptions.value = formFuns.value.getSelectMap()['warehouse']
    operatorList.value = formFuns.value.getSelectMap()['operator']
  })
}
// 当前期间是否已经结账
const ymPeriod:any = ref(false)
const periodValue = ref('')
async function contentSwitch(action) {
  loadMark.value = true
  await flushPeriod()
  let res = await useRouteApi(findBillByCondition, {schemaName: dynamicTenantId})({
    type: pageParameter.type,
    iyear: dynamicYear.value || '2022',
    action: action,
    curr: route.query?.ccode != null?route.query.ccode:( formFuns.value.getFormValue()?.ccode || '')
  })
  if (null != res) {
    res.xsRate = dynamicTenant.value.target.xsRate || 0
    res.deliveryUser =  hasBlank(res.deliveryUser) || res.deliveryUser == '[]'?null:res.deliveryUser.split(',')
    titleValue.value = parseInt(res.bdocumStyle || 0)
    if (!hasBlank(res.entryList)) {
      let list = JsonTool.parseObj(res.entryList).map(it => resetRow(it))
      res.lyCcode = list[0]?.sourcecode
      res.lyDdate = list[0]?.sourcedate
      let len = list.length
      for (let i = 0; i < (25 - len); i++) {
        list.push({})
      }
      setTableData(list)
    }
    res.entryList = null
       formFuns.value.setFormValue(res)
    formItems.value = JsonTool.parseProxy(res)
    pageParameter.searchConditon.value = ''
    searchList.value = []
    formItems.value.entryList = null
  } else {
    message.success('暂无数据！')
    formItems.value = {}
    formFuns.value.setFormValue({})
    let list = []
    for (let i = 0; i < (25); i++) {
      list.push({})
    }
    setTableData(list)
  }
  calculateTotal()
  loadMark.value = false
}

const flushPeriod = async() => {
  let busDate = useCompanyOperateStoreWidthOut().getLoginDate;
  if ( periodValue.value != busDate?.substring(0,7)){
    periodValue.value = busDate.substring(0,7)
    // 获取当前期间是否已经结账
    ymPeriod.value =  (await useRouteApi(checkMonth, {schemaName: dynamicTenantId})({
      id: dynamicTenant.value.target.id,
      date: periodValue.value
    }))
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
    },
    {
      title: '存货编码',
      dataIndex: 'cinvode',
      ellipsis: true,
      slots: {customRender: 'cinvode'}
    },
    {
      title: '存货名称',
      dataIndex: 'cinvodeName',
      ellipsis: true,
      slots: {customRender: 'cinvodeName'},
    },
    {
      title: '条形码',
      dataIndex: 'cinvodeBarcode',
      ellipsis: true,
      slots: {customRender: 'cinvodeBarcode'},
    },
    {
      title: '规格型号',
      dataIndex: 'cinvodeType',
      ellipsis: true,
      slots: {customRender: 'cinvodeType'},
    },{
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
      ellipsis: true,
      slots: {customRender: 'cunitid'},
    },{
      title: '主数量',
      dataIndex: 'baseQuantity',
      slots: {customRender: 'baseQuantity'},
      ellipsis: true,
    },
    {
      title: '计量一',
      dataIndex: 'cunitidF1',
      ellipsis: true,
      slots: {customRender: 'cunitidF1'},
      align: 'left',
    },{
      title: '数量一',
      dataIndex: 'subQuantity1',
      ellipsis: true,
      slots: {customRender: 'subQuantity1'},
    },
    {
      title: '计量二',
      dataIndex: 'cunitidF2',
      ellipsis: true,
      align: 'left',
      slots: {customRender: 'cunitidF2'},
    },
    {
      title: '数量二',
      dataIndex: 'subQuantity2',
      ellipsis: true,
      slots: {customRender: 'subQuantity2'},
    },
    {
      title: '批号',
      dataIndex: 'batchId',
      ellipsis: true,
      slots: {customRender: 'batchId'},
    },
    {
      title: '生产日期',
      dataIndex: 'dpdate',
      ellipsis: true,
    },
    {
      title: '失效日期',
      dataIndex: 'dvdate',
      slots: {customRender: 'dvdate'},
      ellipsis: true,
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
const tableDel = () => {
  if (tableSelectedRowKeys.value.length == 1) {
    let list = getDataSource()
    let aList = list.filter(it=>it.key != null && it.ccode != null) // 有效的
    if (aList.length == 1 && aList[0].key ==tableSelectedRowKeys.value[0]){
      // startDel()
      createErrorModal({
        iconType: 'warning',
        title: '温馨提示',
        content: '最后行,不能进行删除操作次！'
      })
    }else{
      let selectIndex = list.findIndex(it => it.key === tableSelectedRowKeys.value[0])
      list.splice(selectIndex, 1)
      setTableData(list)
    }
    tableSelectedRowKeys.value = []
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请选择删除行次！'
    })
  }
}
async function checkBusDate(date) {
  let dates = date.split('-')
  let list = await findStockPeriodInfoByYm({code:dynamicTenant.value.target.id,date: date})
  formItems.value.ddate = date
  if (list.length == 0){
    createWarningModal({title: "温馨提示",content: '当年度暂未创建，不能新增销售出库单，请先创建该年度'})
    return false;
  }else {
    if (list.filter(it=>it.istock == '1').length == list.length){
      createWarningModal({title: "温馨提示",content: '当年度已经全部结账，不能新增销售出库确认单，请切换公司代码或年度'})
      return false;
    }else if(list.filter(it=>it.stockMonth == dates[1] && it.istock == '1').length > 0){ // 业务年月结账去当年最后一张单据日期
      let n =  (await useRouteApi(findBillLastDate, {schemaName: dynamicTenantId})({year: dates[0],type:"XSQRD"}))
      formItems.value.ddate = n
    }
  }
  return true;
}

const startEdit = async (type) => {
  if (ymPeriod.value) return createWarningModal({title: "温馨提示",content: '当前业务期间已结账，不能进行新增单据操作！'});
  if (await tempCheck('月末结账','结账'))return false;
  tempTaskSave(type=='add'?'新增':'修改')
  let maxR = 20
  if (type === 'add') {
    status.value = 1
    formItems.value = {}
    let busDate = useCompanyOperateStoreWidthOut().getLoginDate;
    if (await checkBusDate(busDate)){
      formItems.value.ccode = await generateCode(busDate)
      formFuns.value.setFormValue({
        ddate: formItems.value.ddate,
        ccode: formItems.value.ccode
      })
    }
    let list = []
    for (let i = 0; i < maxR; i++) {
      list.push({})
    }
    setTableData(list)
    nextTick(()=>referData())
  } else {
    status.value = 2
    let list = getDataSource()
    let dLen = list.length
    for (let i = 0; i < (maxR - dLen); i++) {
      list.push({})
    }
    setTableData(list)
  }
}
async function tempTaskSave(method) {
  await useRouteApi(stockBalanceTaskSave, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,userName:useUserStoreWidthOut().getUserInfo.username,functionModule:'销售出库确认单',method:method,recordNum:formItems.value.ccode})
    .then((a)=>{
      taskIds.value.push(a.id)
    })
}
async function generateCode(date) {
  return await useRouteApi(findBillCode, {schemaName: dynamicTenantId})({
    type: pageParameter.type,
    date: date,
    key: '3-11',prefix: 'QR'
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
    if (await tempCheck('月末结账','结账'))return false;
    createConfirm({
      iconType: 'warning',
      title: '确认单删除',
      content: '您确定要进行销售确认单删除吗!',
      onOk: async () => {
        await useRouteApi(delQrd, {schemaName: dynamicTenantId})({id: formItems.value.id})
        message.success('删除成功！')
        formItems.value.czId = ''
        await contentSwitch('tail')
        writeLog('删除',formItems.value,null)
      }
    });
  }
}
function codeToName(arr) {
  let names = {'XSCKD':'物流单'}
  return arr.map(s=>names[s]).filter(s=>s != null && s != '').join(',')
}
const startReview = async (b) => {
  if (await tempCheck('月末结账','结账'))return false;
  if (ymPeriod.value) return createWarningModal({title: "温馨提示",content: '当前业务期间已结账，不能进行弃审单据操作！'});
  if (await tempCheck('销售出库确认单','修改,删除,审核'))return false;
  let a = useUserStoreWidthOut().getUserInfo.id
  if (!hasBlank(a) && !hasBlank(formItems.value.id)) {
    if (b && await qrdReviewCheck())return false;
    if (!b){
     let res =  await useRouteApi(findQrdChangeList, {schemaName: dynamicTenantId})({code: formItems.value.ccode,iyear:formItems.value.iyear })
      if (res.length > 0){
        createConfirm({
          iconType: 'warning',
          title: '确认单弃审',
          content: '该确认单已发生出库单数量调整，弃审后调整差异记录将被删除，原出库单数量记录将无法还原，您确定要继续弃审吗!',
          onOk: async () => {
            await useRouteApi(reviewQrd, {schemaName: dynamicTenantId})({
              id: formItems.value.id,
              keys: [],
              userId: a,
              type: b
            })
          }
        });
      }
    }else {
      await useRouteApi(reviewQrd, {schemaName: dynamicTenantId})({
        id: formItems.value.id,
        keys: [],
        userId: a,
        type: b
      })
    }
    message.success(`${b ? '审核' : '弃审'}成功！`)
    await pageReload()
  } else {
    if (hasBlank(a)) message.error('获取用户信息异常！')
  }
}
async function qrdReviewCheck(){
  if (hasBlank(formItems.value.lyCcode)){
    createWarningModal({title: "温馨提示",content: '来源单据异常！'})
    return true
  }else {
    let tip = await useRouteApi(findEntityAndDetailsByCcode, {schemaName: dynamicTenantId})({iyear: formItems.value.iyear,code: formItems.value.lyCcode})
    if (null == tip)  {
      createWarningModal({title: "温馨提示",content: '来源单据数据异常！'})
      return true
    }
    let qrList = getDataSource().filter(it => it.id != null)
    let changeList = tip.t2.filter(it=>{
      let row = qrList.filter(it2=> it2.sourcedetailId == it.lineCode)[0]
      if(row != null){ // 非空=调整数量 空=删除
        it.cfree1 = row?.quantity
        it.cfree2 = row?.baseQuantity
        it.cfree3 = row?.subQuantity1
        it.cfree4 = row?.subQuantity2
      }
      return row == null || ( parseFloat(it.baseQuantity).toFixed(10) != parseFloat(row.baseQuantity).toFixed(10))
    })
    if (changeList.length > 0){ // 存在变动
        async function confT() {
          createConfirm({
            iconType: 'warning',
            content: createVNode(CustomizeConfirmContent),
            icon: null,
            okText: '审核',
            mask:true,
            cancelText: '放弃',
            onOk: async () => {
              let checks = ['XSQRD']
              document.getElementsByClassName("customize-cc")[0]?.getElementsByClassName('ant-checkbox-wrapper-checked')?.forEach((e,i)=>checks.push(e.parentNode.getAttribute('suo')))
              // 判断下游
              let list = ((await useRouteApi(findByXyOutDataSourrce,{schemaName: dynamicTenantId})({billStyle:'XSCKD',code:formItems.value.lyCcode,type: ''}) || []).filter(it=>checks.indexOf(it.xyBillStyle) == -1))
              if (list.length > 0){
                let text = '销售出库单已生成单据，不能修改单据数量，请检查单据！'
                if (list.filter(it=>it.xyBillStyle == 'XSFP').length > 0){
                  text = '销售出库单已生成销售发票，不能修改单据数量，请删除下游销售发票后继续！'
                } else if (list.filter(it=>it.xyBillStyle == 'XHD').length > 0) {
                  text = '销售出库单已生成销货单，不能修改单据数量，请删除下游销货单后继续！'
                }else if (list.filter(it=>it.xyBillStyle == 'JHZXD').length > 0) {
                  text = '销售出库单已生成拣货装箱单，必须勾选拣货装箱单同步选项，两项同时进行同步！'
                }else if (list.filter(it=>it.xyBillStyle == 'WLSHD').length > 0) {
                  text = '销售出库单已生成物流送货单，必须勾选物流送货单同步选项，两项同时进行同步！'
                }
                createWarningModal({title: "温馨提示",content: text,onOk: async ()=> await confT()},)
              }else {
                await useRouteApi(reviewSpecialQrd,{schemaName: dynamicTenantId})({id: formItems.value.id,userId:useUserStoreWidthOut().getUserInfo.id,checks: checks,changeRow: JsonTool.json(changeList)})
                message.success('审核成功！')
                await pageReload()
              }
            },
            onCancel: async () => {

            }
          })
        }
        await confT()
      return true
    }else {
      return false
    }
  }
}


async function stockCheck(list,model) {
  let err = ''
  let set = [...new Set(list.map(it=>it.cinvode))]
  let dbs =await useRouteApi(batchSelectorList, {schemaName: dynamicTenantId})({year: model.ddate.split('-')[0],codes: set})
  try {
    for (const s of set) {
      let tStock =  assetsCardList.value.filter(it=>it.stockNum == s)[0]
      let tList = list.filter(it=>it.cinvode == s)
      let tNum = 0;tList.map(it=> tNum+=parseFloat(it.baseQuantity))
      let kNum = 0; // 可用量
      if (tStock["stockPropertyBatch"] == '1'){
        let eList = dbs.filter(r=>{
          let it =  tList.filter(it2=>it2.batchId == r.batchId)[0]
          if (r == null) return true;
          if (it == null) return false;
          return  parseFloat(r['baseQuantity']) < parseFloat(it.baseQuantity)
        })
        eList.map(r=>err+=`行次【${tList.filter(it2=>it2.batchId == r.batchId)[0].lineId}】存货编码【${s}】存货现存量不足,现存量主数量【${r.baseQuantity}】,差额主数量【${Math.abs(tList.filter(it2=>it2.batchId == r.batchId)[0].baseQuantity-r.baseQuantity)}】;`)
      }else {
        dbs.filter(it=>it.invCode == s).map(r=> (kNum+= parseFloat(r['baseQuantity'])))
        // 可用量 > 消单数量
        if (kNum < tNum)
          err+=`行次【${tList[0].lineId}】存货编码【${s}】存货现存量不足,现存量主数量【${dbs[0].baseQuantity}】,差额主数量【${Math.abs(tNum-dbs[0].baseQuantity)}】;`
      }
    }
  }catch (e) {
    err = '检查现存量时发生异常！'
  }
  if (err != ''){
    createWarningModal({title: '温馨提示', content: err})
    return  false;
  }
  return true;
}
const loadMark = ref(false)

//保存验证
function saveCheck(list) {
  let form = formFuns.value.getFormValue();

  if (hasBlank(form.ccode)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '确认单号不能为空！'
    })
    return false
  }

  if (hasBlank(form.ddate)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '确认单日期不能为空！'
    })
    return false
  }
  if (hasBlank(form.lyCcode)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '来源单不能为空！'
    })
    return false
  } if (hasBlank(form.lyDdate)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '来源单日期不能为空！'
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
  if (list.length == 0) {
    createWarningModal({
      title: '温馨提示',
      content: '列表完整内容至少存在一条!仓库级别与存货编码为必选项,主数量、无税单价和本币无税金额为必填项,请补充完整!'
    })
    return false
  }/* else if ((list.filter(it => hasBlank(it.cunitid) || hasBlank(it.baseQuantity) || hasBlank(it.icost + '') || hasBlank(it.price + ''))).length > 0) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '列表内容:仓库级别与存货编码为必选项,主数量、无税单价和本币无税金额为必填项,请补充完整,且必须存在一条！'
    })
    return false
  }*/
  return true
}

//数据保存
async function saveData() {
  let id = formItems.value.id
  formItems.value = formFuns.value.getFormValue()
  formItems.value.id = id // 制单人
  formItems.value.cmaker = useUserStoreWidthOut().getUserInfo.id // 制单人
  formItems.value.billStyle = pageParameter.type // 制单人
  formItems.value.bdocumStyle = "0"
  formItems.value.deliveryUser = !hasBlank(formItems.value.deliveryUser)? formItems.value.deliveryUser.join():[]
  let list = getDataSource().filter(it => !hasBlank(it.cwhcode) && !hasBlank(it.cinvode) && !hasBlank(it.cunitid) && !hasBlank(it.baseQuantity) /*&& !hasBlank(it.icost + '') && !hasBlank(it.price + '') */&& (parseFloat(it.quantity) <= parseFloat(it.quantityOld)))
  if (saveCheck(list)) {
    list = list.map(it => ObjTool.dels(it, Object.keys(it).map(i => i.startsWith('edit') || i.startsWith('temp')))) //清理辅助字段
    list.forEach((o, i) => {  //转化
      o['id']=null
      if (o.cangkuDuli == '1'){
        o['cwhcode1'] = o['cwhcode']
      }else if (o.cangkuDuli == '0'){
        let arr =  o['cwhcode'].split("\\")
        for (let j = 0; j < arr.length; j++) {
          o[`cwhcode${j+1}`] = arr[j]
        }
      }
      o['sourcetype'] = 'XSCKD'
      o['sourcecode'] = formItems.value.lyCcode
      o['sourcedate'] = formItems.value.lyDdate
      o['lineCode'] = o['key']
      o['lineId'] = (i + 1) + ''
    })
    formItems.value.entryList = JsonTool.json(list)
    if (formItems.value?.id == null)
      formItems.value.ccode = await generateCode(formItems.value.ddate)
    await useRouteApi(saveXsqrd, {schemaName: dynamicTenantId})(formItems.value)
     // await useRouteApi(wuliuSongHuoSave, {schemaName: dynamicTenantId})({ccode:formItems.value.ccode,iyear:dynamicYear.value,person:hasBlank(formItems.value.deliveryUser)?"":formItems.value.deliveryUser.join(',')})
    message.success('保存成功！')
     if (taskIds.value.length > 0)taskIds.value.map(async (id)=>await tempTaskDel(id))
    writeLog(formItems.value?.id == null?'新增':'修改',formItems.value,null)
    await pageReload()
    status.value = 3
  }
}
async function tempTaskDel(id) {
  await useRouteApi(stockTaskDelById, { schemaName: dynamicTenantId })(id)
    .then((a)=>{
      taskIds.value = taskIds.value.filter(i=>i != id)
    })
}
async function tempCheck(menu,methd){
  let taskData=await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:(dynamicYear.value || '2022'),name:menu,method:methd,recordNum:''})
  if(!hasBlank(taskData)){
    createWarningModal({title: '温馨提示',content: '操作员'+taskData.caozuoUnique+'正在对当前账套进行'+menu+'处理，不能进行单据业务操作，请销后再试！'})
    return  true;
  }else {
    return  false;
  }
}

async function giveUp() {
  if (status.value == 1) {
    await contentSwitch('first')
    if (taskIds.value.length > 0)taskIds.value.map(async (id)=>await tempTaskDel(id))
  } else if (status.value == 2) {
    await contentSwitch('curr')
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
  let arr = assetsCardList.value.filter(it => (type == 'one' ? (it.sysId == rowObj.sysId) : type == 'two' ? (it.assetsCode == rowObj.assetsCode) : (it.assetsName == rowObj.assetsName)))
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
    let filterList =[] // getDataSource().filter(it => !hasBlank(it.cinvode)).map(it => it.cinvode)
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
    /*let qData = {
      date: formFuns.value.getFormValue().ddate,
      type: type,
      qValue: value,
    }
    let res = await useRouteApi(findCunHuoListByCondition, {schemaName: dynamicTenantId})(qData) || []*/
    let res = assetsCardList.value.filter(it=>it[type == 'one'?'stockNum':'stockName'].indexOf(value) !=-1)
    let data = []
    res = res.filter(it => filterList.indexOf(it.stockNum) == -1)
    res.forEach((r: any) => {
      data.push({
        value: r[type == 'one' ? 'stockNum' : 'stockName'],
        label: (r['stockNum'] + ' ' + r['stockName']),
      });
    });
    callback(data);
  }

  timeout = setTimeout(fake, 300);
}

const mark = usePlatformsStore().getCurrentPlatformId
const visible = ref(false);
const windowWidth = (document.documentElement.clientWidth - (70/*+280*/))
const totalColumnWidth = ref(0)
const tableRef = ref(null)
const dynamicColumnModel = ref({value:[]})
const lanMuData = ref(
  {
    'accId': 'postgres',
    'menuName': '销售出库确认单新增',
    'type': '列表',
    objects: '',
    username: useUserStoreWidthOut().getUserInfo.username,  changeNumber:0
  }
)
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
    tableRef.value.$el.style.setProperty('width', (windowWidth + 40 - f) + 'px')
  } else {
    totalColumnWidth.value = total
    tableRef.value.$el.style.setProperty('width', (total + 40) + 'px')
  }
}

const openSetting = () => {
  openQueryPageM(true, {schemaName: dynamicTenantId.value})
}
/*栏目设置end*/
const thisEditObj = ref(null)
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
      let data = formFuns.value.getFormValue()
      openStockCangKuModalPage(true, {
        database: dynamicTenantId.value,
        ckIsDuli: null != o ?o['cangkuDuli']: null,
        entity: null != o? ckListOptions.value.filter(it => it.id == data.cwhcode)[0]: null
      })
      break;
  }
}
const {openCustomModal,openDeptModal,openPsnModal} =  useNcModals()
const openHeadSelectContent = (type) => {
  thisEditType.value = type
  if (status.value == 3) return false
  switch (type) {
    case 'cvencode':
      openCustomModal(dynamicTenant.value).then(res=>modalData(res))
      break;
    case 'cdepcode':
      openDeptModal(dynamicTenant.value).then(res=>modalData(res))
      break;
    case 'cpersoncode':
    case 'deliveryUser':
      openPsnModal(dynamicTenant.value).then(res=>modalData(res))
      break;
    case 'cwhcode':
      openStockCangKuModalPage(true, {
        database: dynamicTenantId.value,
      })
      break;
  }
}
const modalData = (o) => {
  if (thisEditObj.value) {
    if (thisEditType.value == 'cinvode') {
      thisEditObj.value['tempTwo'] = o[0].stockNum
    } else {
      if (thisEditObj.value['cangkuDuli'] == '0'){
        thisEditObj.value['tempOne'] = o[0].cangkuId
      }else {
        thisEditObj.value['tempOne'] = o[0].id
      }
    }
    focusNext(thisEditObj.value,thisEditType.value)
    thisEditObj.value = null
  } else {
    let e = formFuns.value.getFormValue()
    e[thisEditType.value] = thisEditType.value == 'cvencode' || thisEditType.value == 'cwhcode' ? o[0].id : thisEditType.value == 'cdepcode' ? o.uniqueCode : o.id
    formFuns.value.setFormValue(e)
  }
}
const resetRow = (record) => {
  record['key'] = record.lineCode
  record['quantityOld'] = record.quantity
  let o = assetsCardList.value.filter(it => it.stockNum == record.cinvode )[0]
  record.cinvodeName = o?.stockName || ''
  record.cinvodeType = o?.stockGgxh // 规格型号
  record.cinvodeBarcode = o?.stockBarcode // 条形码
  record.isGive = record.isGive == '1'
  if (record.cwhcode.indexOf("\\") != -1) {
    record.cangkuDuli = "0"
    // 找到
    let arr = record.cwhcode.split("\\")
    record.cwhcodeText =  assemblyName(arr)
  } else {
    record.cangkuDuli = "1"
    record.cwhcodeText = ckListOptions.value.filter(it => it.id == record.cwhcode)[0]?.ckName
  }

  // 计量类型
  record.cunitType = o?.stockMeasurementType ==  '单计量'?'1':'0'
  if (record.cunitType == '0'){ //
    let res =  manyJiList.value.filter(it=>it.id == o?.stockMeasurementUnit)[0]
    if (res != null) {
      record.unitInfo = res
      record.unitList = JsonTool.parseObj(res.detail) || []
    }
  }else{
    let res = jiList.value.filter(it => it.id == o?.stockMeasurementUnit)
    if (null !=  res && res.length >0){
      record.unitInfo = res[0]
      record.unitList = res.map(it=>{it.value=it.id;it.label=it.unitName;it.ggxh=o?.stockGgxh;it.barcode =o?.stockBarcode;return it;})
    }
  }
  record.isBatch = o?.stockPropertyBatch == '1'
  return record;
}
const assemblyName = (arr) => {
  let text = ''
  for (let i = 0; i < arr.length; i++) {

  }
  text = ckListOptions.value.filter(it=>it.id == arr[0])[0]?.ckName
  return text
}
const tableDataChange =  (r,c) => {
  let h = formFuns.value.getFormValue();
  if (hasBlank(r.cwhcode) && !hasBlank(h.cwhcode)){
    let cangkuInfo =  ckListOptions.value.filter(it => it.id == h.cwhcode)[0]
    if (null != cangkuInfo){
      r['cangkuDuli'] = cangkuInfo.ckIsDuli
      if (cangkuInfo.ckIsDuli == '1')
        r['cwhcode']=h.cwhcode
    }
  }
  switch (c) {
    case 'cinvode':
      if (r.cinvode == null) r.cinvodeName = r.tempEleven
      if (r.cinvode !=null || r.cinvodeName != null) chChange(r)
      break;
    case 'quantity':
      r.editQuantity = null;
      if (r.tempQuantity == '' || 0 >= parseFloat(r.tempQuantity) || parseFloat(r.tempQuantity) > parseFloat(r.quantityOld)) {
        message.warning(`支持修改的数量范围[0～${r.quantityOld}],且不包含0！`)
        r.quantity =  r.quantityOld
        return false
      }
      r.quantity = r.tempQuantity;
      slChangeNew(r,c)
      break;
    case 'baseQuantity':
    case 'price':
      break;
    case 'icost':
      if (!hasBlank(r.baseQuantity) && !hasBlank(r.icost)) { //反算 单价
        let n = parseFloat(r.baseQuantity).toFixed(10)
        if (titleValue.value != 0 && n > 0) n = 0 - (Math.abs(n))
        let d = parseFloat(r.icost).toFixed(4)
        r.baseQuantity = n + ''
        r.icost = d + ''
        r.tempTen = d + ''
        r.price = (d / n).toFixed(10) + ''
      } else if (!hasBlank(r.price) && !hasBlank(r.icost)) { //反算 数量
        let n = parseFloat(r.price).toFixed(10)
        let d = parseFloat(r.icost).toFixed(4)
        if (titleValue.value != 0 && d > 0) d = 0 - (Math.abs(d))
        r.price = n + ''
        r.icost = d + ''
        r.tempTen = d + ''
        r.baseQuantity = (d / n).toFixed(10) + ''
        slChange(r,c)
      }
      break;
  }
}

const slChangeNew = (r) => {
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
  }
}
const chChange = (record) => {
  let o = assetsCardList.value.filter(it => (it.stockNum == record.cinvode) || (it.stockName == record.cinvodeName))[0]
  record.cinvodeName = o?.stockName
  record.cinvode = o?.stockNum
  record.cinvodeType = o?.stockGgxh // 规格型号
  record.cinvodeBarcode = o?.stockBarcode // 条形码
  // 计量类型
  record.cunitType = o.stockMeasurementType == '单计量'?'1':'0'
  record.isBatch = o?.stockPropertyBatch == '1' // 批号必须输入
  if (record.cunitType == '0' && !hasBlank(o?.stockMeasurementUnit) && record?.unitInfo == null) {
    let res = manyJiList.value.filter(it => it.id == o?.stockMeasurementUnit)[0]
    if (res != null) {
      record.unitInfo = res
      let list = JsonTool.parseObj(res.detail) || []
      record.unitList = list.map(it=>{it.value=it.id;it.label=it.unitName;it.ggxh='';it.barcode ='';return it;})
    }
  }else if (record.cunitType == '1' &&  !hasBlank(o?.stockMeasurementUnit)){
    let res = jiList.value.filter(it => it.id == o?.stockMeasurementUnit)
    if (null !=  res && res.length >0){
      record.unitInfo = res[0]
      record.unitList = res.map(it=>{it.value=it.id;it.label=it.unitName;it.ggxh=o?.stockGgxh;it.barcode =o?.stockBarcode;return it;})
      record.xsUnitId = record.unitList[0].value
      record.cunitid = record.unitList[0].value
    }
  }
  record['quantityOld'] = record.quantity
  if (record.cwhcode.indexOf("\\") != -1) {
    record.cangkuDuli = "0"
    // 找到
    let arr = record.cwhcode.split("\\")
    record.cwhcodeText = assemblyName(arr)
  } else {
    record.cangkuDuli = "1"
    record.cwhcodeText = ckListOptions.value.filter(it => it.id == record.cwhcode)[0]?.ckName
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
        if (formItems.value?.id == null && taskIds.value.length > 0)taskIds.value.map(async (id)=>await tempTaskDel(id))
        closeCurrent()
      },
      onCancel: async () => {

      }
    });
  } else {
    closeCurrent()
  }
}
const {proxy} = getCurrentInstance()
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
  let cols = getColumns().filter(it=> ['quantity','cmemo'].indexOf(it.dataIndex) != -1 && it.ifShow)
  let index = list.findIndex(it => it.key == r.key)
  let nextC = cols[0].dataIndex // 获取下一个列位置
  if (index == list.length - 1 && cols[cols.length - 1].dataIndex == c) { // 最后一行最后一列回车追加
    list.push({editOne: true})
    setTableData(list)
  } else {
    let cObj = cols[cols.findIndex(it => it.dataIndex == c) + 1]
    if (cObj != null) {
      nextC = cObj.dataIndex
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
    let doms =nextC == 'cmemo' ? document.getElementsByClassName(nextC)[0] : document.getElementsByClassName(nextC)[0]?.getElementsByTagName('input')[0]
    if (null != doms) doms.focus()
  })
}
const getNextMark = (c,b) => {
  let model = {cwhcode:'One','cinvode':'Two',baseQuantity:'Six',quantity:'Quantity',baseQuantity:'Six',price:'Nine',icost:'Ten',batchId:'Twelve',dvdate:'Fifteen',cmemo:'Thirteen'}
  if (b){
    // 获取下一个
    let keys= Object.keys(model)
    return model[keys[keys.findIndex(k=>k == c)+1]]
  }else {
    return model[c]
  }
}
const pageSearch = async (v) => {
  if (searchList.value.length == 0) searchList.value = getDataSource().filter(it => it.key != null && it.ccode != null);
  let newList = hasBlank(v) ? searchList.value : searchList.value.filter(it => it.cinvode.indexOf(v) != -1 || it.cinvodeName.indexOf(v) != -1)
  let len = newList.length
  for (let i = 0; i < (25 - len); i++) {
    newList.push({})
  }
  setTableData(newList)
}
const [registerXySourcePage, {openModal: openXySourcePage}] = useModal()
const [registerlySourcePage, {openModal: openLySourcePage}] = useModal()
const [registerReferModalPage, {openModal: openReferPage}] = useModal()
// 查看下游数据
async function xySourcePop() {
  if (hasBlank(formItems.value.ccode)){
    message.info('暂未发现任何单据！')
  }else {
    let res = await useRouteApi(findQrdChangeList, {schemaName: dynamicTenantId})({code: formItems.value.ccode,iyear:formItems.value.iyear }) || []
    if (null == res || res?.length == 0){
      message.info('确认单与出库单数量一致，无差异记录！')
    }else {
      openXySourcePage(true, {
        list: res,
        datas: {ch:assetsCardList.value,ji:jiList.value,many:manyJiList.value}
      })
    }
  }
}
// 查看下游数据
function lySourcePop() {
  if (hasBlank(formItems.value.ccode)){
    message.info('暂未发现任何单据！')
  }else {
    openLySourcePage(true, {
      database: dynamicTenantId.value,code: formItems.value.ccode,type: 'XSQRD',datas: {ck:ckListOptions.value,ji:jiList.value,many:manyJiList.value}
    })
  }
}
function formatData(data:any){
  let str = ""
  if(data != null){
    // 千分位保留2位小数
    var source = String(data).split("."); //按小数点分成2部分
    source[0] = source[0].replace( new RegExp('(\\d)(?=(\\d{3})+$)' , 'ig'), "$1,");//只将整数部分进行都好分割
    str = source.join("." );//再将小数部分合并进来
  }
  return str;
}
// 参照
function referData() {
/*
  if(formFuns.value.getFormValue().cvencode==undefined){
    return message.error('请选择销售客户！')
  }
*/

  openReferPage(true, {
    dynamicTenantId:dynamicTenantId.value,
    dynamicAccId:dynamicAccId.value,
    cvencode:''||formFuns.value.getFormValue().cvencode,
    iyear:formFuns.value.getFormValue().ddate.split('-')[0]
  })
}
const chFocus = ref('one')
const taskIds = ref([])
// 参照回调 明细list
async function referThrowData(e) {
  taskIds.value.push(e.taskId)
  let data = e.list
  let old =  formFuns.value.getFormValue()
  old.lyCcode = data[0].ccode
  old.lyDdate = data[0].ddate
  old.cwhcode = data[0].cwhcode1
  old.cvencode = data[0].cvencode
  old.cvencodeJs = data[0].cvencodeJs
  formFuns.value.setFormValue(old)
  setTableData(data)
  getDataSource().forEach(async (b)=>{
    chChange(b)
    // 重新计算金额
    // tableDataChange(b,'price')
  })

  let list=getDataSource()
  for (let i = 0; i < 25-list.length; i++) {
    list.push({})
  }
  setTableData(list)
}

const cunitFormat = (list,id) => {
  if (null == list || hasBlank(id)) return id;
  let it = list.filter(it=>it.id == id)[0]
  return  null == it?id:it.unitName
}

async function writeLog(action, a, content) {
  /************** 记录操作日志 ****************/
  let map = {
    loginTime: new Date(+new Date() + 8 * 3600 * 1000).toJSON().substr(0, 19).replace("T", " "),
    userId: useUserStoreWidthOut().getUserInfo.username,
    userName: useUserStoreWidthOut().getUserInfo.realName,
    optModule: 'stock',
    optFunction: '销售出库确认单',
    optRange: '2',
    uniqueCode: '',
    optAction: action,accId:lanMuData.value.accId,
    optContent: content || `操作内容【${action}销售出库确认单】,` + '单据编码【' + a.ccode + '】,单据日期【' + a.ddate + '】',
  }
  await saveLog(map)
}
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
    background-color: @Global-Comm-BcOrText-Color !important;
    border-radius: 5px 5px 0 0;
    padding: 10px;

    > div {
      width: 100%;
      display: inline-flex;
      justify-content: space-between;
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
      margin: 5px 4% 0;

      :deep(.nc-summary) {
        font-size: 14px;
        font-weight: bold;
        width: 100%;

        > div {
          background-color: #d8d8d8;
          padding: 5px;
          width: 15%;
          margin: 0 1px;
          display: inline-flex;
          justify-content: space-between;
        }
        > div:nth-of-type(1) {
          width: 24%;
          display: inline-block;
          text-align: center;
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
    width: 40%;text-align: right;
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
