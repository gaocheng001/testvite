<template>
  <div class="app-container">
        <!-- 请注释下行，不要删除下行，方便快速定位页面  -->
<!--   <div><textarea>费用单的页面</textarea>复制内容快速定位页面</div>-->
    <div class="app-container-top lcr-theme-div">
      <div>
        <div>
          <CopyOutlined style="color: white;font-size: 50px;"/>
        </div>
        <div>
          <AccountPicker theme="three" :readonly="status==3" @reloadTable="dynamicAdReload"/>
        </div>
      </div>
      <div></div>
      <div>
        <div>
          <Button class="actod-btn" @click="" v-if="status == 3">查看</Button>
          <Button class="actod-btn" @click="startEdit('add')" v-if="status == 3">新增</Button>
          <Button class="actod-btn" @click="saveData" v-if="status == 1 || status == 2">保存</Button>
          <Button class="actod-btn" @click="giveUp" v-if="status == 1 || status == 2">放弃</Button>
          <Button class="actod-btn" @click="startEdit('edit')" v-if="status == 3 && formItems.bcheck!='1'">修改</Button>
          <Button class="actod-btn" @click="tableAdd" v-if="status == 1 || status == 2">插行</Button>
          <Button class="actod-btn" @click="tableDel" v-if="status == 1 || status == 2">删行</Button>
          <Button class="actod-btn" @click="startDel" v-if="status == 3 && formItems.id != null">删除</Button>
          <Popover placement="bottom" v-if="formItems.bcheck=='1'">
            <template #content>
              <span class="group-btn-span-special">&nbsp;生成退款单</span><br/>
              <span class="group-btn-span-special">&nbsp;生成记账凭证</span><br/>
            </template>
            <Button class="actod-btn">生单</Button>
          </Popover>
          <Button class="actod-btn" @click="startReview(true)" v-if="status == 3 && formItems.bcheck!='1' ">审核</button>
          <Button class="actod-btn" @click="startReview(false)" v-if="status == 3 && formItems.bcheck=='1' ">弃审</button>
          <Popover placement="bottom" v-if="status == 3">
            <template #content>
              <span class="group-btn-span-special">&nbsp;来源单据&emsp;&emsp;</span><br/>
              <span class="group-btn-span-special">&nbsp;下游单据&emsp;&emsp;</span><br/>
            </template>
            <Button class="actod-btn">联查</Button>
          </Popover>
          <Popover placement="bottom" v-if="status == 3">
            <template #content>
              <span class="group-btn-span-special">&nbsp;复制&emsp;&emsp;</span><br/>
              <span class="group-btn-span-special">&nbsp;导入&emsp;&emsp;</span><br/>
              <span class="group-btn-span-special">&nbsp;导出&emsp;&emsp;</span><br/>
            </template>
            <Button class="actod-btn">更多</Button>
          </Popover>
          <Button v-if="status != 3" class="actod-btn">导入</Button>
          <!--          <PrintTest></PrintTest>-->
          <!--          <Hello></Hello>-->
          <!--          <Button v-if="status == 3" class="actod-btn" @click="exportExcel()">导出</Button>
                    <Button v-if="status == 3" class="actod-btn" @click="printData()">打印</Button>-->
          <Button class="actod-btn actod-btn-last" @click="outBefore">退出</Button>
        </div>
        <div :class="status != 3?'status-look':''">
          <!--          <div class="acttd-right-d-search">
                      <InputSearch
                        class="acttdrd-search-input"
                        placeholder="存货编码或名称"
                        style="border-left:1px solid #c9c9c9;"
                        @search="pageSearch"
                        v-model:value="pageParameter.searchConditon.value"
                      />
                    </div>-->
          <div class="acttd-right-d-btns">
            <Button class="acttdrd-btn" @click="pageReload()">
              <SyncOutlined :style="{ fontSize: '14px' }"/>
            </Button>
            <Popover placement="bottom">
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
              <span style="color: white;">{{
                  status == 0 ? '暂存' : status == 1 ? '新增' : status == 2 ? '编辑' : '查看'
                }}</span>
            </div>
          </div>
          <div class="acbgead-one-changes" :class="status == 1 || status == 2 ?'status-look':''">
            <!--            已审核、已核销、已开票-->
            <VerticalRightOutlined @click="contentSwitch('first')"/>&nbsp;
            <LeftOutlined @click="contentSwitch('prev')"/>&nbsp;
            <RightOutlined @click="contentSwitch('next')"/>&nbsp;
            <VerticalLeftOutlined @click="contentSwitch('tail')"/>&nbsp;&nbsp;
            <span v-if="formItems.bcheck=='1'">
              <Tag color="volcano">已审核</Tag>
            </span>
            <span v-if="formItems.writeOffStatus=='1'">
              <Tag color="volcano">已核销</Tag>
            </span>
          </div>
          <span style="font-size: 28px;font-weight: bold;border-bottom:3px double #0096c7;" :style="{color: titleValue===0?'#0096c7':'red'}">
            {{ titleContents[titleValue] }}
          </span>
        </div>
        <div class="acbgead-two" :style="status == 3?{ pointerEvents: 'none'}:{}">
          <label>单据日期：</label>
          <DatePicker v-model:value="formItems.ddate" @change="generateCode(formItems.ddate)" :disabled-date="disabledDate" :locale="localeCn" placeholder="变动日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 15%;"/>
          <label>单据编号：</label>
          <Input v-model:value="formItems.ccode" :disabled="true" style="width: 15%;"/>
          <label>业务类型：</label>
          <Select v-model:value="formItems.ctype" style="width: 15%;">
            <template #suffixIcon><CaretDownOutlined v-if="status == 1 || status == 2"/></template>
            <SelectOption value="WLFY">往来费用</SelectOption>
            <SelectOption value="XJFY">现金费用</SelectOption>
          </Select>
          <label>票据类型：</label>
          <Select v-model:value="formItems.pjType" style="width: 15%;">
            <template #suffixIcon><CaretDownOutlined v-if="status == 1 || status == 2"/></template>
            <SelectOption value="ZYFP">专用发票</SelectOption>
            <SelectOption value="PTFP">普通发票</SelectOption>
            <SelectOption value="SJ">收据</SelectOption>
          </Select>
          <br/>

          <label>记账方向：</label>
          <Select v-model:value="formItems.billStyle" @change="changeBillStyle()" style="width: 15%;">
            <template #suffixIcon></template>
            <SelectOption value="ar">应收</SelectOption>
            <SelectOption value="ap">应付</SelectOption>
            <SelectOption value="qt">其他</SelectOption>
          </Select>
          <label>往来单位：</label>
          <Select v-model:value="formItems.cvencode" :disabled="formItems.billStyle!='ar' && formItems.billStyle!='ap'" style="width: 15%;">
            <template #suffixIcon>
              <span v-if="formItems.billStyle=='ar' || formItems.billStyle=='ap'">
                <SearchOutlined v-if="status == 1 || status == 2" @click="openHeadSelectContent('cvencode')"/>
              </span>
            </template>
            <SelectOption v-if="formItems.billStyle=='ar'" v-for="item in customerList" :value="item.id" >
              {{ item.custName }}
            </SelectOption>
            <SelectOption v-if="formItems.billStyle=='ap'" v-for="item in supplierList" :value="item.id" >
              {{ item.custName }}
            </SelectOption>
          </Select>
          <label>部门：</label>
          <Select v-model:value="formItems.cdepcode" style="width: 15%;">
            <template #suffixIcon>
              <SearchOutlined v-if="status == 1 || status == 2" @click="openHeadSelectContent('cdepcode')"/>
            </template>
            <SelectOption v-for="item in deptList" :value="item.id" >
              {{ item.deptName }}
            </SelectOption>
          </Select>
          <label>业务员：</label>
          <Select v-model:value="formItems.cpersoncode" style="width: 15%;">
            <template #suffixIcon>
              <SearchOutlined  v-if="status == 1 || status == 2" @click="openHeadSelectContent('cpersoncode')"/>
            </template>
            <SelectOption v-for="item in psnList" :value="item.id" >
              {{ item.psnName }}
            </SelectOption>
          </Select>
          <label>现结金额：</label>
          <Input v-model:value="formItems.isum" style="width: 15%;"/>
          <label>使用预付：</label>
          <Input v-model:value="formItems.useYf" style="width: 15%;"/>
        </div>
      </div>
      <div class="acb-centent">
        <!--  针对过滤框显示添加的内容高度 :class="status == 3?'status-look':''"  -->
        <!--       :rowKey="r=>r.assetsCode"-->
        <div>
          <!--          <span style="font-size: 18px;font-weight: bold;color: #0096c7;">收款明细</span>
                    <div style="float: right;">
                      <Button class="ant-btn-sm actod-btn" @click="tableAdd">增行</Button>
                      <Button class="ant-btn-sm actod-btn" @click="tableDel">删行</Button>
                    </div>-->
          <BasicTable
            ref="tableRef"
            :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
            :clickToRowSelect="false"
            :loading="loadMark"
            :row-selection="{ type: 'checkbox',selectedRowKeys: tableSelectedRowKeys, onChange: onSelectChange }"
            :scroll="{ x: totalColumnWidth,y: 450 }"
            @register="registerTable"
            :dataSource="tableData"
          >
            <template #fyname="{ record }">
              <template v-if="record.editOne">
<!--                <Input v-model:value="record.tempOne" class="fyname" style="width: 85%;" placeholder="" @keyup.enter="focusNext(record,'fyname')"/>-->
                <Select v-model:value="record.tempOne" style="width: 85%;"
                        class="fyname"
                        @change="value=>handleChange(value,'one')"
                        @search="value=>handleSearch(value,'one')"
                        @keyup.enter="focusNext(record,'fyname')">
                  <template #suffixIcon><CaretDownOutlined/></template>
                  <SelectOption v-for="item in expenseList" :value="item.cname" >
                    {{ item.cname }}
                  </SelectOption>
                </Select>
                <CheckOutlined @click="record.editOne = null;record.fyname=record.tempOne;tableDataChange(record,'fyname')"/>
              </template>
              <template v-else>
                <div @click="record.editOne = true;" :class="status == 1 || status == 2?'suspended-div':'status-look'">
                  <span class="a-table-font-arial">{{record.fyname}}</span>
                </div>
              </template>
            </template>
            <template #fycode="{ record }">
              <template v-if="record.editTwo">
<!--                <Input v-model:value="record.tempTwo" class="fycode" style="width: 85%;" placeholder="" @keyup.enter="focusNext(record,'fycode')"/>-->
                <Select v-model:value="record.tempTwo" style="width: 85%;"
                        class="fycode"
                        @change="value=>handleChange(value,'two')"
                        @search="value=>handleSearch(value,'two')"
                        @keyup.enter="focusNext(record,'fycode')">
                  <template #suffixIcon><CaretDownOutlined/></template>
                  <SelectOption v-for="item in expenseList" :value="item.ccode" >
                    {{ item.cname }}
                  </SelectOption>
                </Select>
                <CheckOutlined @click="record.editTwo = null;record.fycode=record.tempTwo;tableDataChange(record,'fycode')"/>
              </template>
              <template v-else>
                <div @click="record.editTwo = true;" :class="status == 1 || status == 2?'suspended-div':'status-look'">
                  <span class="a-table-font-arial">{{record.fycode}}</span>
                </div>
              </template>
            </template>
            <template #itax="{ record }">
              <template v-if="record.editThree">
                <InputNumber v-model:value="record.tempThree" class="itax" style="width: 85%;" placeholder="" @keyup.enter="focusNext(record,'itax')"/>
                <CheckOutlined @click="record.editThree = null;record.itax=record.tempThree;tableDataChange(record,'itax')"/>
              </template>
              <template v-else>
                <div @click="record.editThree = true;" :class="status == 1 || status == 2?'suspended-div':'status-look'">
                  <span class="a-table-font-arial">{{toThousandFilter(record.itax)}}</span>
                </div>
              </template>
            </template>
            <template #money="{ record }">
              <template v-if="record.editFour">
                <InputNumber v-model:value="record.tempFour" class="money" style="width: 85%;" placeholder="" @keyup.enter="focusNext(record,'money')"/>
                <CheckOutlined @click="record.editFour = null;record.money=record.tempFour;tableDataChange(record,'money')"/>
              </template>
              <template v-else>
                <div @click="record.editFour = true;" :class="status == 1 || status == 2?'suspended-div':'status-look'">
                  <span class="a-table-font-arial">{{toThousandFilter(record.money)}}</span>
                </div>
              </template>
            </template>
            <template #itaxMoney="{ record }">
              <span class="a-table-font-arial">{{toThousandFilter(record.itaxMoney)}}</span>
            </template>
            <template #isum="{ record }">
              <template v-if="record.editSix">
                <InputNumber v-model:value="record.tempSix" class="isum" style="width: 85%;" @keyup.enter="focusNext(record,'isum')"/>
                <CheckOutlined @click="record.editSix = null;record.isum=record.tempSix;tableDataChange(record,'isum')"/>
              </template>
              <template v-else>
                <div @click="record.editSix = true;"
                     :class="status == 1 || status == 2?'suspended-div':'status-look'">
                  <span class="a-table-font-arial">{{toThousandFilter(record.isum)}}</span>
                </div>
              </template>
            </template>
            <template #ljjsIsum="{ record }">
              <span class="a-table-font-arial">{{toThousandFilter(record.ljjsIsum)}}</span>
            </template>
            <template #yongtu="{ record }">
              <template v-if="record.editEight">
                <Input v-model:value="record.tempEight" class="yongtu" style="width: 85%;" placeholder="" @keyup.enter="focusNext(record,'yongtu')"/>
                <CheckOutlined @click="record.editEight = null;record.yongtu=record.tempEight;tableDataChange(record,'yongtu')"/>
              </template>
              <template v-else>
                <div @click="record.editEight = true;" :class="status == 1 || status == 2?'suspended-div':'status-look'">
                  <span class="a-table-font-arial">{{record.yongtu}}</span>
                </div>
              </template>
            </template>
            <template #yifentan="{ record }">
              <span class="a-table-font-arial">{{record.yifentan}}</span>
            </template>

<!--            <template #footer>
              <div class="nc-summary">
                <div>
                  <span>合计</span>
                </div>
                <div>
                  <span>金额:</span>
                  <span>&ensp;{{ toThousandFilter(isum) }}</span>
                </div>
                <div>
                  <span>税额:</span>
                  <span>&ensp;{{ toThousandFilter(isum) }}</span>
                </div>
                <div>
                  <span>含税金额:</span>
                  <span>&ensp;{{ toThousandFilter(isum) }}</span>
                </div>
                <div>
                  <span>累计结款金额:</span>
                  <span>&ensp;{{ toThousandFilter(isum) }}</span>
                </div>
              </div>
            </template>-->
<!--            <template #summary>
              <TableSummary fixed>
                <TableSummaryRow style="background-color: #cccccc;font-weight: bold;">
                  <TableSummaryCell :index="0" :colSpan="4" :align="'center'" style="background-color: #cccccc;font-weight: bold;">合&emsp;&emsp;计</TableSummaryCell>
                  <TableSummaryCell :index="1" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{toThousandFilter(isum)}}</TableSummaryCell>
                  <TableSummaryCell :index="2" :align="'right'" style="background-color: #cccccc;font-weight: bold;"></TableSummaryCell>
                  <TableSummaryCell :index="3" :align="'right'" style="background-color: #cccccc;font-weight: bold;"></TableSummaryCell>
                  <TableSummaryCell :index="4" :align="'right'" style="background-color: #cccccc;font-weight: bold;"></TableSummaryCell>
                  <TableSummaryCell :index="5" :align="'right'" style="background-color: #cccccc;font-weight: bold;"></TableSummaryCell>
                  <TableSummaryCell :index="6" :align="'right'" style="background-color: #cccccc;font-weight: bold;"></TableSummaryCell>
                  <TableSummaryCell :index="7" :align="'right'" style="background-color: #cccccc;font-weight: bold;"></TableSummaryCell>
                </TableSummaryRow>
              </TableSummary>
            </template>-->
            <template #summary>
              <TableSummary fixed>
                <TableSummaryRow style="background-color: #cccccc;font-weight: bold;">
                  <TableSummaryCell class="nc-summary" :index="0" :align="'center'" style="background-color: #cccccc;font-weight: bold;">合</TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="1" :align="'center'" style="background-color: #cccccc;font-weight: bold;">计</TableSummaryCell>
                  <TableSummaryCell class="nc-summary" v-for="cell in getCurrSummary()" :index="cell.ind" :align="cell.align" style="background-color: #cccccc;font-weight: bold;"><span class="a-table-font-arial">{{null == summaryModel[cell.dataIndex]?'':toThousandFilter(summaryModel[cell.dataIndex])}}</span></TableSummaryCell>
                </TableSummaryRow>
              </TableSummary>
            </template>
          </BasicTable>
        </div>
      </div>
    </div>
    <SupperModalPop @throwData="modalData" @register="registerModalPopPage"/>
    <CustomerModalPop @throwData="modalData" @register="registerModalPopCustPage" />
    <DeptModalPop @register="registerSelectDeptPage" @save="modalData"/>
    <SelectPsn @register="registerSelectPsnPage" @save="modalData"/>
    <SelectProject @register="registerSelectProjectPage" @save="modalData"/>
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
  Tabs,
  Tag
} from "ant-design-vue";
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
  VerticalRightOutlined,
  CaretDownOutlined,CopyOutlined
} from '@ant-design/icons-vue';
import {getCurrentInstance, nextTick, onMounted, reactive, ref} from "vue";
import {useMessage} from "/@/hooks/web/useMessage";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {JsonTool, NumberTool, ObjTool} from "/@/api/task-api/tools/universal-tools";
import {BasicTable, useTable} from '/@/components/Table'
import {useModal} from '/@/components/Modal'
import {delChuZhi, findFaAssetInfoByCode, reviewChuZhi} from "/@/api/fa/fa-assets-minus";

import {useUserStore, useUserStoreWidthOut} from "/@/store/modules/user";
import {useRoute} from "vue-router";
import {getCurrentAccountName, hasBlank} from "/@/api/task-api/tast-bus-api";
import {cloneDeep} from "lodash-es";
// import SupperModalPop from "/@/views/boozsoft/system/customer_info/popup/modalPop.vue";
// import DeptModalPop from "/@/views/boozsoft/system/department/popup/select-dept.vue";
// import SelectPsn from "/@/views/boozsoft/system/department/popup/select-psn.vue";
// import SelectProject from "/@/views/boozsoft/system/project/popup/select-project.vue";
import SupperModalPop from "/@/views/boozsoft/global/popup/supplier/modalPop.vue";
import CustomerModalPop from "/@/views/boozsoft/global/popup/customer_info/modalPop.vue";
import DeptModalPop from "/@/views/boozsoft/global/popup/dept/select-dept.vue";
import SelectPsn from "/@/views/boozsoft/global/popup/dept/select-psn.vue"
import SelectProject from "/@/views/boozsoft/global/popup/project/select-project.vue";
import {
  findAll as findAllJiLang,
  findUnitInfoList
} from "/@/api/record/system/unit-mea";
import {findCunHuoAllList} from "/@/api/record/stock/stock-caigou";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import moment from "moment";
import localeCn from 'ant-design-vue/es/date-picker/locale/zh_CN';
import {findPsnByFlag} from "/@/api/record/system/psn";
import {findDeptByFlag} from "/@/api/record/system/dept";
import {findAll} from "/@/api/record/costomer_data/customer";
import {findAll as findBySupAll} from "/@/api/record/supplier_data/supplier";
import {buildUUID} from "/@/utils/uuid";
import {findAllProject} from "/@/api/record/system/project";
import {findSettModesByFlag} from "/@/api/record/system/sett-modes";
import {
  add, mul,
  pad,
  sub,
  toThousandFilter
} from "./calculation";
import {getSysBankAccountByStatus} from "/@/api/record/system/sys-bank-account";
import {
  findBukongCcode,
  deleteArApExpensesById,
  saveArApExpense,
  saveArApExpensesList,
  deleteArApExpenseById, deleteArApExpensesByCcode, findArApExpensesByCcode, findArApExpenseList
} from "/@/api/record/system/ArApExpense";
import {getSysExpenseByFlag} from "/@/api/record/system/sys-expense";

const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const InputSearch = Input.Search
const SelectOption = Select.Option
const TabPane = Tabs.TabPane
const TableSummary = Table.Summary
const TableSummaryRow = TableSummary.Row
const TableSummaryCell = TableSummary.Cell

const {createErrorModal, createConfirm, createWarningModal} = useMessage()
const {closeCurrent} = useTabs(router);
const windowHeight = (window.innerHeight -300)
const totalColumnHeight = (document.documentElement.clientHeight - 480)
const totalColumnWidth = ref(0)
const dynamicTenantId:any = ref('')
const dynamicAccId:any = ref('')
const dynamicYear:any = ref('')
const titleContents = ['费用单', '费用单', '费用单']
const titleValue = ref(0)
const formRowNum = ref(1)

const summaryModel: any = ref({})

const clickMoney = ref(true)

const pageParameter:any = reactive({
  showRulesSize: 'MIN',
  searchConditon: {
    requirement: '',
    value: '',
  },
  type: 'ar'
})
const changeBtns = ref({
  first: true,
  prev: true,
  next: true,
  tail: true,
})
const formItems: any = ref({})
const jiList:any = ref([])
const manyJiList:any = ref([])
const ckListOptions:any = ref([])
const operatorList:any = ref([])
const cardListOptions:any = ref([])
const assetsCardList:any = ref([])
const arApYsyfList:any = ref([])
const dynamicAdReload = async (obj) => {
  dynamicTenantId.value = obj.accountMode
  dynamicAccId.value = obj.accId
  dynamicYear.value = obj.stockYear
  await columnReload()
  await reloadList()
  await pageReload()
}

const tableData:any = ref([]);
const tableData1:any = ref([]);

const dynamicFormModel:any = ref([])
const formFuns:any = ref({
  getFormValue: () => {
  }, setFormValue: () => {
  }, getSelectMap: () => {
  }
})
const columnReload = async () => {
  formRowNum.value = Math.ceil((dynamicFormModel.value.filter(it=>it.isShow).length/4))-1
}
const route = useRoute();
const routemsg = ref(route.query);
onMounted(async () => {
  /*console.log(routemsg.value)
  console.log(routemsg.value.id)
  console.log(JSON.stringify(routemsg.value).length)*/
  dynamicTenantId.value = routemsg.value.dynamicTenantId
  dynamicAccId.value = routemsg.value.defaultAdName
  dynamicYear.value = routemsg.value.year
  //新增
  if (routemsg.value.isEdit == '1') {
    status.value = routemsg.value.isEdit
    formItems.value.id = null
    await startEdit('add')
  } else if (routemsg.value.isEdit == '2' || routemsg.value.isEdit == '3') {
    status.value = routemsg.value.isEdit
    formItems.value.id = routemsg.value.id
    // await contentSwitch('curr')
  }
})

const pageReload = async () => {
  await contentSwitch(formItems.value.id == null?'tail':'curr')
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
  accId: dynamicAccId.value,
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
const supplierList:any = ref([])
const projectList:any = ref([])
const settModesList:any = ref([])
const bankAccountList:any = ref([])
const expenseList:any = ref([])
async function reloadList() {
  psnList.value = await useRouteApi(findPsnByFlag,{schemaName: dynamicTenantId})({})
  deptList.value = await useRouteApi(findDeptByFlag,{schemaName: dynamicTenantId})({})
  const res = await useRouteApi(findAll,{schemaName: dynamicTenantId})(parameter)
  customerList.value = res.items
  const supList = await useRouteApi(findBySupAll,{schemaName: dynamicTenantId})(parameter)
  supplierList.value = supList.items
  projectList.value = await useRouteApi(findAllProject,{schemaName:dynamicTenantId})({})
  const res1 = await useRouteApi(findSettModesByFlag,{schemaName: dynamicTenantId})({})
  settModesList.value = res1.items
  bankAccountList.value = await useRouteApi(getSysBankAccountByStatus,{schemaName: dynamicTenantId})({})

  jiList.value = await useRouteApi(findAllJiLang, {schemaName: dynamicTenantId})({unitName: ''})
  manyJiList.value = await useRouteApi(findUnitInfoList, {schemaName: dynamicTenantId})({})
  assetsCardList.value = (await useRouteApi(findCunHuoAllList, {schemaName: dynamicTenantId})({date: useCompanyOperateStoreWidthOut().getLoginDate}))
  expenseList.value = await useRouteApi(getSysExpenseByFlag, {schemaName: dynamicTenantId})({})
}

//修改记账类型
function changeBillStyle(){
  formItems.value.cvencode = ''
}

const num = ref(0)
async function contentSwitch(action) {
  loadMark.value = true
  const res = await useRouteApi(findArApExpenseList,{schemaName: dynamicTenantId})({billStyle:'ar',iyear:dynamicYear.value})
  arApYsyfList.value = res
  delIds.value = []
  if(arApYsyfList.value.length>0){
    if (action=='first'){
      num.value = 0
      formItems.value = JsonTool.parseProxy(arApYsyfList.value[0])
    } else if (action=='prev'){
      num.value = num.value==0?0:num.value-1
      formItems.value = JsonTool.parseProxy(arApYsyfList.value[num.value])
    } else if (action=='next'){
      num.value = num.value==arApYsyfList.value.length-1?arApYsyfList.value.length-1:num.value+1
      formItems.value = JsonTool.parseProxy(arApYsyfList.value[num.value])
    } else if (action=='tail') {
      num.value = arApYsyfList.value.length-1
      formItems.value = JsonTool.parseProxy(arApYsyfList.value[num.value])
    } else {
      for (let i = 0; i < arApYsyfList.value.length; i++) {
        const item = arApYsyfList.value[i]
        if (routemsg.value.id == item.id){
          num.value = i
        }
      }
      formItems.value = JsonTool.parseProxy(arApYsyfList.value[num.value])
    }
    const res = await useRouteApi(findArApExpensesByCcode,{schemaName: dynamicTenantId})({ccode:formItems.value.ccode,billStyle:'ar'})
    tableData.value = res
    if (tableData.value.length<20) {
      let num = 20 - tableData.value.length
      for (let i = 0; i < num; i++) {
        tableData.value.push({})
      }
    }
    setTableData(tableData.value)
    countTable()
  } else {
    await startEdit('add')
    message.success('暂无数据！')
  }
  loadMark.value = false
}

// 0 暂存 1 新建 2编辑 3查看
const status:any = ref(3)

const CrudApi = {
  columns: [
    {
      title: '费用名称',
      dataIndex: 'fyname',
      ellipsis: true,
      slots: {customRender: 'fyname'},
      width: 150,
    },
    {
      title: '费用编码',
      dataIndex: 'fycode',
      ellipsis: true,
      slots: {customRender: 'fycode'},
      width: 120,
    },
    {
      title: '税率',
      dataIndex: 'itax',
      ellipsis: true,
      slots: {customRender: 'itax'},
      align: 'right',
      width: 150,
    },
    {
      title: '无税金额',
      dataIndex: 'money',
      ellipsis: true,
      slots: {customRender: 'money'},
      align: 'right',
      width: 150,
    },
    {
      title: '税额',
      dataIndex: 'itaxMoney',
      ellipsis: true,
      slots: {customRender: 'itaxMoney'},
      align: 'right',
      width: 150,
    },
    {
      title: '价税合计',
      dataIndex: 'isum',
      ellipsis: true,
      slots: {customRender: 'isum'},
      align: 'right',
      width: 150,
    },
    {
      title: '累计结款金额',
      dataIndex: 'ljjsIsum',
      ellipsis: true,
      slots: {customRender: 'ljjsIsum'},
      align: 'right',
      width: 150,
    },
    {
      title: '用途',
      dataIndex: 'yongtu',
      ellipsis: true,
      slots: {customRender: 'yongtu'},
      align: 'right',
      width: 150,
    },
    {
      title: '已分摊',
      dataIndex: 'yifentan',
      ellipsis: true,
      slots: {customRender: 'yifentan'},
      align: 'right',
      width: 150,
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
  pagination: {
    pageSize: 50,
    hideOnSinglePage: true,
    showSizeChanger: true,
    pageSizeOptions: ['30', '50', '100'],
    showTotal: t => `总共${t}条数据`
  },

})

function formatCunitid(cunitid) {
  let str = cunitid
  settModesList.value.forEach(item=>{
    if(cunitid==item.settModesCode){
      str = item.settModesName
    }
  })
  return str
}

function formatCunitidF1(cunitidF1) {
  let str = ''
  bankAccountList.value.forEach(item=>{
    if (cunitidF1==item.ccode){
      str = item.cname
    }
  })
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

function formatHxStyle(hxStyle){
  let str = hxStyle
  //XHD销货单、PLXHD批量销货单、XSCKD销售出库单、QTCKD其他出库单、DBCKD调拨出库单、XTZHCKD形态转换出库单、JYJCD借用借出单
  if (hxStyle=='XHD'){
    str = '销货单'
  } else if (hxStyle=='PLXHD'){
    str = '批量销货单'
  } else if (hxStyle=='XSCKD'){
    str = '销售出库单'
  } else if (hxStyle=='QTCKD'){
    str = '其他出库单'
  } else if (hxStyle=='DBCKD'){
    str = '调拨出库单'
  } else if (hxStyle=='XTZHCKD'){
    str = '形态转换出库单'
  } else if (hxStyle=='JYJCD'){
    str = '借用借出单'
  }
  return str
}

function checkMoney(record,index,str){
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

const tableSelectedRowKeys:any = ref([])
const tableSelectedRowObjs:any = ref([])
const onSelectChange = (k, o) => {
  tableSelectedRowKeys.value = k
  tableSelectedRowObjs.value = o
}

const tableSelectedRowKeys1:any = ref([])
const tableSelectedRowObjs1:any = ref([])
const onSelectChange1 = (k, o) => {
  tableSelectedRowKeys1.value = k
  tableSelectedRowObjs1.value = o
}

const tableAdd = () => {
  tableData.value.push({})
  setTableData(tableData.value)
  tableSelectedRowKeys.value = []
  /*if (tableSelectedRowKeys.value.length == 1) {
    let list = getDataSource()
    let selectIndex = list.findIndex(it => it.key === tableSelectedRowKeys.value[0])
    list.splice(selectIndex, 0, {cwhcode: formFuns.value.getFormValue().cwhcode})
    tableData.value = list
    setTableData(list)
    tableSelectedRowKeys.value = []
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请选择插入行次！'
    })
  }*/
}

const delIds:any = ref([])

const tableDel = () => {
  if (tableSelectedRowKeys.value.length > 0) {
    let list = getDataSource()
    for (let i = 0; i < tableSelectedRowObjs.value.length; i++) {
      let item = tableSelectedRowObjs.value[i]
      let selectIndex = list.findIndex(it => it.key === item.key)
      list.splice(selectIndex, 1)
      if(item.id!=null && item.id!='') {
        delIds.value.push(item.id)
      }
    }
    tableData.value = list
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
  let maxR = 20
  if (type === 'add') {
    status.value = 1
    formItems.value.id=null
    let date = useCompanyOperateStoreWidthOut().getLoginDate
    // 获取最新
    let code = await generateCode(date)
    formItems.value = {
      ddate: date,
      ccode: code,
      billStyle: 'ar',
    }
    formFuns.value.setFormValue({
      ddate: date,
      ccode: code,
      billStyle: 'ar',
    })
    let list:any = []
    for (let i = 0; i < maxR; i++) {
      list.push({})
    }
    countTable()
    tableData.value = list
    setTableData(list)
    tableData1.value = []
    // setTableData1(list)
  } else {
    status.value = 2
    let list = getDataSource()
    let dLen = list.length
    for (let i = 0; i < (maxR - dLen); i++) {
      list.push({})
    }
    countTable()
    tableData.value = list
    setTableData(list)
  }

}

async function generateCode(date) {
  let code=''
  //日期(年月)
  let yy = new Date().getFullYear()
  let mm = new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth()+ 1) : (new Date().getMonth()+ 1)
  if(date!=null && date!='') {
    yy = date.substring(0, 4)
    mm = date.substring(5, 7)
  }
  // let yy = formItems.value.ddate.substring(0,4)
  // let mm = formItems.value.ddate.substring(5,7)
  let str = 'BE-' + yy + mm + '-'
  const ysyf = await useRouteApi(findBukongCcode,{schemaName: dynamicTenantId})({
    num:4,
    sum:14,
    qzNum:10,
    qianzhui:str
  })
  if (ysyf.ccode != null && ysyf.ccode != ''){
    code = str + pad(ysyf.ccode, 4)
  } else {
    code = str + '0001'
  }
  formItems.value.ccode = code
  return code
  /*return await useRouteApi(findBillCode, {schemaName: dynamicTenantId})({
    type: pageParameter.type,
    date: date
  })*/
}

const startDel = async () => {
  if (null == formItems.value || hasBlank(formItems.value.id)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '暂无任何单据！'
    })
  } else {
    if (formItems.value.bcheck=='1') {
      createErrorModal({
        iconType: 'warning',
        title: '警告',
        content: '记录已有核销记录，操作无效！'
      })
    } else {
      createConfirm({
        iconType: 'warning',
        title: '收款单删除',
        content: '您确定要进行收款单删除吗!',
        onOk: async () => {
          // await useRouteApi(delRuKu, {schemaName: dynamicTenantId})({id: formItems.value.id})
          await useRouteApi(deleteArApExpenseById,{schemaName: dynamicTenantId})(formItems.value.id)
          await useRouteApi(deleteArApExpensesByCcode,{schemaName: dynamicTenantId})(formItems.value.ccode)
          message.success('删除成功！')
          // formItems.value.czId = ''
          await contentSwitch('tail')
        }
      });
    }
  }
}

const startReview = async (b) => {
  let a = useUserStoreWidthOut().getUserInfo.id
  if (!hasBlank(a) && !hasBlank(formItems.value.id)) {
    if (b==true){
      // console.log('审核')
      let dateTime = new_Date()
      formItems.value.bcheck = '1'
      formItems.value.bcheckTime = dateTime
      formItems.value.bcheckUser = useUserStore().getUserInfo['name']
      await useRouteApi(saveArApExpense, {schemaName: dynamicTenantId})(formItems.value)
      const ysyfsList = await useRouteApi(findArApExpensesByCcode,{schemaName: dynamicTenantId})({ccode:formItems.value.ccode,billStyle:'ar'})
      ysyfsList.map(ysyfs=>{
        ysyfs.bcheck = '1'
        ysyfs.bcheckTime = dateTime
        ysyfs.bcheckUser = useUserStore().getUserInfo['name']
        return ysyfs
      })
      await useRouteApi(saveArApExpensesList,{schemaName: dynamicTenantId})(ysyfsList)
    } else {
      // console.log('取消审核')
      if (formItems.value.hxFlag=='1' || formItems.value.hxIsum>0) {
        createErrorModal({
          iconType: 'warning',
          title: '警告',
          content: '记录已有核销记录，操作无效！'
        })
      } else {
        formItems.value.bcheck = '0'
        formItems.value.bcheckTime = ''
        formItems.value.bcheckUser = ''
        await useRouteApi(saveArApExpense, {schemaName: dynamicTenantId})(formItems.value)
        const ysyfsList = await useRouteApi(findArApExpensesByCcode,{schemaName: dynamicTenantId})({ccode:formItems.value.ccode,billStyle:'ar'})
        ysyfsList.map(ysyfs => {
          ysyfs.bcheck = '0'
          ysyfs.bcheckTime = ''
          ysyfs.bcheckUser = ''
          return ysyfs
        })
        await useRouteApi(saveArApExpensesList, {schemaName: dynamicTenantId})(ysyfsList)
      }
    }
    message.success(`${b?'审核':'弃审'}成功！`)
    await pageReload()
  } else {
    if (hasBlank(a)) message.error('获取用户信息异常！')
  }
}

const loadMark = ref(false)

//行赋值
function saveRow(row,index){
  tableData1.value[index] = row
  countTable()
}

//数据保存
//只有预收款才能审核，普通收款直接审核核销
//收款金额为0时强制为预收款，审核时核销状态改为完成
async function saveData() {
  if (hasBlank(formItems.value.ccode)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '单据编号不能为空！'
    })
    return false
  }
  if (hasBlank(formItems.value.ddate)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '单据日期不能为空！'
    })
    return false
  }
  if (hasBlank(formItems.value.cvencode)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '客户不能为空！'
    })
    return false
  }
  if (isum.value==0){
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '价税合计不能为0！'
    })
    return false
  }
  let a=0
  if (getDataSource().length!=0){
    for (let i = 0; i < getDataSource().length; i++) {
      const item = getDataSource()[i]
      if (!hasBlank(item.fycode) && !hasBlank(item.isum) && item.isum!=0) {
        a++
      }
    }
  }
  if(a==0){
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '明细至少有一条！'
    })
    return false
  }
  //保存收款单主表
  let fyd:any = {}
  if (formItems.value.id!=null && formItems.value.id!=''){
    fyd.id = formItems.value.id
  }
  fyd.iyear = dynamicYear.value
  fyd.ccode = formItems.value.ccode
  fyd.ccodePl = formItems.value.ccodePl
  fyd.cmaker = useUserStoreWidthOut().getUserInfo.id
  fyd.ddate = formItems.value.ddate
  fyd.ccode = formItems.value.ccode
  fyd.ddate = formItems.value.ddate
  fyd.ctype = formItems.value.ctype
  fyd.pjType = formItems.value.pjType
  fyd.cvencode = formItems.value.cvencode
  fyd.billStyle = 'ar'
  fyd.cdepcode = formItems.value.cdepcode
  fyd.cpersoncode = formItems.value.cpersoncode
  fyd.isum = formItems.value.isum
  fyd.useYf = formItems.value.useYf
  fyd.bcheck = '0'
  fyd.bcheckTime = formItems.value.bcheckTime
  fyd.bcheckUser = formItems.value.bcheckUser
  fyd.cmemo = formItems.value.cmemo
  await useRouteApi(saveArApExpense,{schemaName: dynamicTenantId})(fyd)
  //删除收款单子表
  for (let i = 0; i < delIds.value.length; i++) {
    let id = delIds.value[i]
    await useRouteApi(deleteArApExpensesById,{schemaName: dynamicTenantId})(id)
  }
  let list:any = []
  //保存应收单子表
  for (let i = 0; i < getDataSource().length; i++) {
    const item = getDataSource()[i]
    if(!hasBlank(item.isum)) {
      let fyds: any = {}
      fyds.id = item.id
      fyds.iyear = dynamicYear.value
      fyds.ccode = formItems.value.ccode
      fyds.lineId = i+1
      fyds.ddate = formItems.value.ddate
      fyds.cmaker = useUserStoreWidthOut().getUserInfo.id
      fyds.ctype = formItems.value.ctype
      fyds.pjType = formItems.value.pjType
      fyds.cvencode = formItems.value.cvencode
      fyds.billStyle = formItems.value.billStyle
      fyds.cdepcode = formItems.value.cdepcode
      fyds.cpersoncode = formItems.value.cpersoncode
      fyds.xjIsum = item.xjIsum
      fyds.useYf = item.useYf
      fyds.fycode = item.fycode
      fyds.itax = item.itax
      fyds.money = item.money
      fyds.itaxMoney = item.itaxMoney
      fyds.isum = item.isum
      fyds.ljjsIsum = item.ljjsIsum
      fyds.yongtu = item.yongtu
      fyds.yifentan = item.yifentan
      fyds.bcheck = '0'
      fyds.bcheckTime = item.bcheckTime
      fyds.bcheckUser = item.bcheckUser
      list.push(fyds)
    }
  }
  await useRouteApi(saveArApExpensesList,{schemaName: dynamicTenantId})(list)
  message.success('保存成功！')
  await pageReload()
  status.value = 3
}

//获取当年月日
function new_Date() {
  let dateTime
  let yy = new Date().getFullYear()
  let mm = new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth()+ 1) : (new Date().getMonth()+ 1)
  let dd = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()
  let hh = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours()
  let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
  let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
  dateTime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
  // console.log(dateTime)
  return dateTime
}

async function giveUp() {
  if (status.value == 1) {
    // await contentSwitch('first')
    await contentSwitch('tail')
  } else if (status.value == 2) {
    await contentSwitch('curr')
  }
  tableSelectedRowKeys.value = []
  status.value = 3
}

const disabledDate = (current) => {
  // 获取区间最小区间
  if (!hasBlank(formItems.value.handleDate)) {
    let variable = formItems.value.handleDate.substring(0, 7)
    let min = moment(variable + '-01', 'YYYY-MM-DD')
    let max = moment(variable, 'YYYY-MM-DD').endOf('month')
    return current < min || current > max
  }
};

const handleSearch = async (val: string, type: string) => {
  if (!hasBlank(val)) {
    // 排除已存在到存货
    let filterList =[] // getDataSource().filter(it => !hasBlank(it.cinvode)).map(it => it.cinvode)
    await fetch(val, type, filterList, (d: any[]) => (cardListOptions.value = d));
  }
};
const handleChange = async (val: string, type: string) => {
  // debugger
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
    let data:any = []
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

/*栏目设置end*/
const formEtcData = ref({
  makerMan: '',
  auditMan: '',
})
const thisEditObj:any = ref(null)
const thisEditType:any = ref('')
const [registerModalPopPage, {openModal: openMoalPopPage}] = useModal();
const [registerModalPopCustPage, {openModal: openMoalPopCustPage}] = useModal();
const [registerSelectDeptPage, {openModal: openSelectDeptPage}] = useModal()
const [registerSelectPsnPage, {openModal: openSelectPsnPage}] = useModal()
const [registerSelectProjectPage, {openModal: openSelectProjectPage}] = useModal()

const openHeadSelectContent = (type) => {
  thisEditType.value = type
  switch (type) {
    case 'cvencode':
      if (formItems.value.billStyle=='ar') {
        openMoalPopCustPage(true, {
          database: dynamicTenantId.value,
          accId: dynamicAccId.value,
        });
      } else {
        openMoalPopPage(true, {
          database: dynamicTenantId.value,
          accId: dynamicAccId.value,
        });
      }
      break;
    case 'cvencodeJs':
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
    case 'cpersoncode':
      openSelectPsnPage(true, {
        dynamicTenantId: dynamicTenantId.value
      })
      break;
    case 'itemCode':
      openSelectProjectPage(true, {
        dynamicTenantId: dynamicTenantId.value
      })
      break;

  }
}
const modalData = (o) => {
  console.log(thisEditObj.value)
  console.log(thisEditType.value)
  if (thisEditType.value=='cvencode'){
    formItems.value.cvencode = o[0].id
  }
  if (thisEditType.value=='cdepcode'){
    formItems.value.cdepcode = o.id
  }
  if (thisEditType.value=='cpersoncode'){
    formItems.value.cpersoncode = o.id
  }
  if (thisEditType.value=='itemCode'){
    formItems.value.itemCode = o.id
  }
  /*if (thisEditObj.value) {
    if (thisEditType.value == 'cinvode') {
      thisEditObj.value['tempTwo'] = o[0].stockNum
    } else {
      thisEditObj.value['tempOne'] = o[0].id
    }
    focusNext(thisEditObj.value,thisEditType.value)
    thisEditObj.value = null
  } else {
    let e = formFuns.value.getFormValue()
    e[thisEditType.value] = thisEditType.value == 'cvencode' || thisEditType.value == 'cwhcode' ? o[0].id : thisEditType.value == 'cdepcode' ? o.uniqueCode : o.id
    formFuns.value.setFormValue(e)
  }*/
}

const isum:any = ref('0')
const isum1:any = ref('0')
const hxIsum:any = ref('0')
const hxMoney:any = ref('0')
const idiscount:any = ref('0')
//计算收款明细和核销明细
function countTable(){
  isum.value = 0
  getDataSource().forEach(item=>{
    if (item.isum!=null && item.isum!=''){
      isum.value = add(isum.value,item.isum)
    }
  })
  isum1.value = 0
  hxIsum.value = 0
  hxMoney.value = 0
  idiscount.value = 0
  calculateTotal()
}

//无税金额=价税合计/(1+税率)%
//无税金额=价税合计/(100+税率)
//价税合计=无税金额*（100+税率）
const tableDataChange =  (r,c) => {
  if(c=='fyname'){
    const aa = expenseList.filter(item=>item.fyname==r.tempOne)
    if (aa.length>0) {
      r.fycode = aa[0].fycode
      r.tempTwo = r.fycode
      r.itax = aa[0].itax
    }
  }
  if(c=='fycode'){
    const aa = expenseList.filter(item=>item.fyname==r.tempTwo)
    if (aa.length>0) {
      r.fyname = aa[0].fyname
      r.tempOne = r.fyname
      r.itax = aa[0].itax
    }
  }
  //修改税率----根据价税合计计算无税金额
  if (c=='itax'){
    if (r.itax==null || r.itax==''){
      r.itax = '0'
    }
    if (r.isum!=null && r.isum!=''){
      r.money = sub(r.isum,sub(add(100,r.itax==null?'':r.itax),100))
    } else {
      r.money = r.isum
    }
  }
  //无税金额
  if (c=='money'){
    if (r.itax==null || r.itax==''){
      r.itax = '0'
    }
    if (r.itax == '0'){
      r.money = r.isum
    }
    if (r.money!=null && r.money!=''){
      r.isum = mul(r.money,sub(add(100,r.itax==null?'':r.itax),100))
    } else {
      r.isum = r.money
    }
  }
  //价税合计
  if (c=='isum'){
    if (r.itax==null || r.itax==''){
      r.itax = '0'
    }
    if (r.itax == '0'){
      r.isum = r.money
    }
    if (r.isum!=null && r.isum!=''){
      r.money = sub(r.isum,sub(add(100,r.itax==null?'':r.itax),100))
    } else {
      r.money = r.isum
    }
  }
  r.itaxMoney = sub(r.isum==null?'':r.isum,r.money==null?'':r.money)
  countTable()
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

/**
 * @param e 回车确定事件
 * @param r rowObj
 * @param c className
 * @param t mark
 */
const focusNext =  (r, c) => {
  if(c=='fyname'){
    const aa = expenseList.filter(item=>item.fyname==r.tempOne)
    if (aa.length>0) {
      r.fycode = aa[0].fycode
      r.tempTwo = r.fycode
    }
  }
  if(c=='fycode'){
    const aa = expenseList.filter(item=>item.fyname==r.tempTwo)
    if (aa.length>0) {
      r.fyname = aa[0].fyname
      r.tempOne = r.fyname
    }
  }
  // 得到当前临时标记
  let t = getNextMark(c,false)
  Object.keys(r).map(i=>{if (i.startsWith('edit')) r[i] = null})
  r[`${c}`] = r[`temp${t}`];
  // 列表值发生变动 监听调整
  // debugger
  tableDataChange(r,c)
  // 查找下一个
  let list = getDataSource();
  let filters = ['fyname','fycode','itax','money','itaxMoney','isum','ljjsIsum','yongtu','yifentan']
  // if (!r.isBatch)filters.push('batchId') 要求填批号才填写
  // let cols:any = getColumns().filter(it=>it.title!='序号' && filters.indexOf(it.dataIndex) == -1)
  let cols:any = getColumns().filter(it=>it.title!='序号')
  let index = list.findIndex(it => it.key == r.key)
  let nextC = cols[0].dataIndex // 获取下一个列位置
  if (index == list.length - 1 && cols[cols.length - 1].dataIndex == c) { // 最后一行最后一列回车追加
    list.push({editOne: true})
    tableData.value = list
    setTableData(list)
  } else {
    let cObj = cols[cols.findIndex(it => it.dataIndex == c) + 1]
    if (cObj != null) {
      nextC = cols[cols.findIndex(it => it.dataIndex == c) + 1].dataIndex
      // 的到指定位置
      let nextMark = getNextMark(c, true)
      r[`edit${nextMark}`] = true;
      r[`${nextC}`] = r[`temp${nextMark}`];
    } else { //之后一列时换行
      nextC = cols[0].dataIndex``
      let nextMark = getNextMark(nextC, false)
      ++index
      list[index][`edit${nextMark}`] = true
      list[index][`${nextC}`] = list[index][`temp${nextMark}`];
      tableData.value = list
      setTableData(list)
    }
  }
  nextTick(() => {
    //let doms:any = nextC == 'fyname' || nextC == 'fycode' || nextC == 'itax' || nextC == 'money' || nextC == 'itaxMoney' || nextC == 'isum' || nextC == 'ljjsIsum' || nextC == 'yongtu' || nextC == 'yifentan' ? document.getElementsByClassName(nextC)[0] : document.getElementsByClassName(nextC)[0]?.getElementsByTagName('input')[0]
    let doms:any = nextC == 'fyname' || nextC == 'fycode' || nextC == 'yongtu' || nextC == 'yifentan' ? document.getElementsByClassName(nextC)[0] : document.getElementsByClassName(nextC)[0]?.getElementsByTagName('input')[0]
    if (null != doms) doms.focus()
  })
}
const getNextMark = (c,b) => {
  let model:any = {fyname:'One',fycode:'Two',itax:'Three',money:'Four',itaxMoney:'Five',isum:'Six',ljjsIsum:'Seven',yongtu:'Eight',yifentan:'Nine'}
  if (b){
    // 获取下一个
    let keys= Object.keys(model)
    return model[keys[keys.findIndex(k=>k == c)+1]]
  }else {
    return model[c]
  }
}

/*** 合计 ***/
const getCurrSummary  = () => {
  return (getColumns().filter((it:any)=>it.title != '序号').map((it,ind)=>{it['ind']=ind+2;return it;}))
}
const calculateTotal = () => {
  let list = getDataSource()
  if (list.length == 0){
    summaryModel.value = {}
    return false;
  }
  let num1 = 0
  let num2 = 0
  let num3 = 0
  let num4 = 0
  let num5 = 0
  for (let i = 0; i < list.length; i++) {
    const e = list[i];
    num1+=parseFloat(e['isum'] || 0)
    num2+=parseFloat(e['itax'] || 0)
    num3+=parseFloat(e['money'] || 0)
    num4+=parseFloat(e['itaxMoney'] || 0)
    num5+=parseFloat(e['ljjsIsum'] || 0)
  }
  summaryModel.value={
    isum: num1,
    itax: num2,
    money: num3,
    itaxMoney: num4,
    ljjsIsum: num5
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
    /*    background-image: url(/@/assets/images/homes/bg-pattern2.png);
        background-repeat: no-repeat;
        background-position: center;*/
  }

  .app-container-bottom {
    background-color: white;

    .actod-btn {
      color: @Global-Comm-BcOrText-Color;
      font-size: 14px;
      border-color: @Global-Border-Color;
      //border-right: none;
    }

    .actod-btn-last {
      border-right: 1px solid @Global-Border-Color;
    }

    .actod-btn:hover {
      background-color: @Global-Comm-BcOrText-Color;
      color: white;
    }

    :deep(.ant-calendar-picker-input.ant-input), :deep(.ant-input),:deep(.ant-select) {
      border: none;
      border-bottom: solid 1px rgb(191, 191, 191) !important;
      width: 100%;
      font-size: 14px;
      font-weight: bold;
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

    :deep(.ant-picker){
      border: none;
      border-bottom: solid 1px rgb(191, 191, 191) !important;
      input {
        font-size: 14px;
        font-weight: bold;
      }
    }

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
        margin: 0 5rem 10px;

        label {
          text-align: left;
          width: 10%;
          display: inline-block;
          padding-top: 5px;
          padding-bottom: 5px;
          padding-left: 2em;
          color: #535353;
          font-size: 13px;
          font-weight: bold;
        }

        :deep(.ant-select-selector), :deep(.ant-picker), .ant-input {
          border: none;
          background-color: white;
          color: black;

          .ant-picker-input {
            > input {
              color: black;
            }
          }
        }

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
        > div:nth-of-type(2),> div:nth-of-type(3),> div:nth-of-type(4),> div:nth-of-type(5){
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
