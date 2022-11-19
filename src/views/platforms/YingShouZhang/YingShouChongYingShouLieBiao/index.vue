<template>
  <div>
        <!-- 请注释下行，不要删除下行，方便快速定位页面  -->
<!--   <div><textarea>应收冲应收列表的页面</textarea>复制内容快速定位页面</div>-->
    <div class="app-container">

      <div class="app-container-head">
        <div class="container-head-title" style="float: left;margin-left: -10px;">
          <b class="noneSpan" style="font-size: 60px;"><ProfileOutlined /></b>
        </div>
        <div class="container-head-title" style="padding-left: 35%;text-align: center;margin-top: 20px;">
          <b class="noneSpan" style="font-size: 26px;">应收冲应收列表</b>
          <div style="font-size: 14px;text-align: center;margin-top: 30px;">
            <span style="font-size: 14px;font-weight: bold;">
              期间：2022.01.01 - 2022.12.31
            </span>
          </div>
        </div>
        <div class="ant-btn-group" style="float: right;margin-right: 10px;">
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="openQuery()"
          ><span>查询</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="addPage()"
          ><span>新增</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="editPage()"
          ><span>查看</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="delList()"
          ><span>删除</span></button>
          <!--          <Popover placement="bottom">
                      <a-button class="ant-btn ant-btn-me"><span>审核</span></a-button>
                      <template #content>
                        <span class="group-btn-span-special2 p_specifics" @click="approved()">审核</span><br/>
                        <span class="group-btn-span-special2 p_specifics" @click="unApproved()">弃审</span>
                      </template>
                    </Popover>-->
<!--          <Popover placement="bottom">
            <a-button class="ant-btn ant-btn-me"><span>联查</span></a-button>
            <template #content>
              <span class="group-btn-span-special2 p_specifics">来源单据</span><br/>
              <span class="group-btn-span-special2 p_specifics">下游单据</span>
            </template>
          </Popover>-->
          <!--          <button
                      type="button"
                      class="ant-btn ant-btn-me"
                    ><span>导入</span></button>-->
          <!--          <button
                      type="button"
                      class="ant-btn ant-btn-me"
                      @click="excelData()"
                    ><span>导出</span></button>
                    <button
                      type="button"
                      class="ant-btn ant-btn-me"
                    ><span>打印</span></button>-->
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="closeCurrent()"
          ><span>退出</span></button>
        </div>
      </div>

      <div style="clear: none"/>
      <div style="margin-top: -30px;margin-left: 50px;">
        <div style="display: inline-block;float: left;margin-left: 1%;margin-top: -20px;">
          <AccountPicker theme="three" readonly @reloadTable="dynamicAdReload"/>
        </div>

        <div style="float: right; margin-left: 10px;margin-right: 10px;">
          <Button class="ant-btn-me" @click="reloadTable()">
            <SyncOutlined :style="{ fontSize: '14px' }"/>
          </Button>
          <Popover class="ant-btn-default" placement="bottom">
            <template #content>
              <a-popconfirm
                placement="leftTop"
                ok-text="确定"
                cancel-text="放弃"
                @confirm="confirm"
                @cancel="cancel">
                <template #icon><b>栏目设置</b><br></template>
                <template #title>
                  <div style="width: 650px;max-height: 500px;overflow-y: auto;">
                  <a-table bordered :data-source="dynamicColumnData" :columns="dynamicColumns"
                           childrenColumnName="children" :pagination="false"
                           style="max-height: 500px;overflow-y: auto" class="lanmu-table">
                    <template #checkBox="{ text, record }">
                      <a-checkbox v-model:checked="record.check" :disabled="record.isFixed"/>
                    </template>
                    <template #widthInput="{ text, record }">
                      <div class="editable-cell">
                        <div v-if="editableData[record.key]" class="editable-cell-input-wrapper">
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
            <Button>
              <SettingFilled :style="{ fontSize: '14px' }"/>
            </Button>
          </Popover>
          <Button @click="excelData()">
            <UsbOutlined :style="{ fontSize: '14px' }"/>
          </Button>
          <Button class="ant-btn-me">
            <PrinterOutlined :style="{ fontSize: '14px' }"/>
          </Button>
        </div>
        <div style="float: right; position: relative">
          <Select v-model:value="formItems.selectType" style="width: 150px;font-size: 12px;" class="special_select">
            <SelectOption style="font-size: 12px;" value="1">单据编码</SelectOption>
            <SelectOption style="font-size: 12px;" value="2">供应商简称</SelectOption>
            <SelectOption style="font-size: 12px;" value="3">仓库</SelectOption>
            <SelectOption style="font-size: 12px;" value="4">存货名称</SelectOption>
          </Select>
          <!-- 搜索 -->
          <InputSearch
            placeholder=""
            style="width: 150px; border-radius: 4px"
            @search="onSearch"
          />
        </div>
        <div style="clear:both"/>
      </div>

    </div>
    <div class="app-container">
      <div class="temp">
      <BasicTable
        ref="tableRef"
        :row-selection="{ type: 'checkbox', selectedRowKeys: state.selectedRowKeys,getCheckboxProps:rowSelection.getCheckboxProps, onChange: onSelectChange }"
        :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
        @register="registerTable"
        :dataSource="tableData"
        :scroll="{ x: totalColumnWidth,y: windowHeight }"
        :loading="loadMark"
        @selection-change="selectionChange"
        @row-click="rowClick"
      >
        <template #ccode="{ record }">
          <a class="tableUStyle" @click="openPage(record)">{{ record.ccode }}</a>
        </template>
        <template #cvencodeZc="{ record }">{{formatCvencode(record.cvencodeZc)}}</template>
        <template #cvencodeZr="{ record }">{{formatCvencode(record.cvencodeZr)}}</template>
        <template #cpersoncode="{ record }">{{formatCpersoncode(record.cpersoncode)}}</template>
        <template #cdepcode="{ record }">{{formatCdepcode(record.cdepcode)}}</template>
        <template #cxIsum="{ record }">{{toThousandFilter(record.cxIsum=='0'?'':record.cxIsum)}}</template>

<!--        <template #footer>
          <div class="nc-summary">
            <div>
              <span>合计</span>
            </div>
            <div>
              <span>收款金额:</span>
              <span>&ensp;{{ toThousandFilter(isum) }}</span>
            </div>
            <div>
              <span>累计核销金额:</span>
              <span>&ensp;{{ toThousandFilter(hxIsum) }}</span>
            </div>
          </div>
        </template>-->
<!--        <template #summary>
          <TableSummary fixed>
            <TableSummaryRow style="background-color: #cccccc;font-weight: bold;">
              <TableSummaryCell :index="0" :colSpan="9" :align="'center'" style="background-color: #cccccc;font-weight: bold;">合&emsp;&emsp;计</TableSummaryCell>
              <TableSummaryCell :index="9" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{toThousandFilter(cxIsum)}}</TableSummaryCell>
              <TableSummaryCell :index="10" :align="'right'" style="background-color: #cccccc;font-weight: bold;"></TableSummaryCell>
            </TableSummaryRow>
          </TableSummary>
        </template>-->
        <template #summary>
          <TableSummary fixed>
            <TableSummaryRow style="background-color: #cccccc;font-weight: bold;">
              <TableSummaryCell class="nc-summary" :index="0" :align="'center'">合</TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="1" :align="'center'">计</TableSummaryCell>
              <TableSummaryCell class="nc-summary" v-for="cell in getCurrSummary()" :index="cell.ind" :align="cell.align"><span class="a-table-font-arial">{{null == summaryModel[cell.dataIndex]?'':toThousandFilter(summaryModel[cell.dataIndex])}}</span></TableSummaryCell>
            </TableSummaryRow>
          </TableSummary>
        </template>
      </BasicTable>
      <div class="pagination-text" v-show="showPaginationText">
        共 {{paginationNumber}} 条记录&nbsp;&nbsp; 每页 200 条
      </div>
      </div>
    </div>
    <Query @save="saveQuery" @register="registerQueryPage"/>
  </div>
</template>
<script setup="props, {emit}" lang="ts">
import { BasicTable, useTable } from '/@/components/Table'
import { useModal } from '/@/components/Modal'
import {onMounted, reactive, ref} from 'vue'
import Icon from '/@/components/Icon/index'
import {
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
  FilterFilled,
  SortDescendingOutlined,
  CheckOutlined,
  SortAscendingOutlined,
  UsbOutlined,
  PrinterOutlined,
  EditOutlined,
  BarChartOutlined,
  ProfileOutlined
} from '@ant-design/icons-vue'
import {
  Select,
  Input,
  Popover,
  Button,
  Tag,
  message,
  Checkbox as ACheckbox,
  Radio as ARadio,
  Table as ATable,
  Popconfirm as APopconfirm,
} from 'ant-design-vue'
import {useMessage} from "/@/hooks/web/useMessage";
import {getCurrentAccountName, getThisIndexImg, hasBlank} from "/@/api/task-api/tast-bus-api";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {add, sub, toThousandFilter} from "../YingShouKuanQiChuYuE/calculation";
import Query from './popup/query.vue'
import {findAll as findCustAll} from "/@/api/record/costomer_data/customer";
import {getPsnList} from "/@/api/record/system/psn";
import {findDeptByFlag} from "/@/api/record/system/dept";

const InputSearch = Input.Search
const SelectOption = Select.Option
const ARadioButton = ARadio.Button
const ARadioGroup = ARadio.Group
const TableSummary = ATable.Summary
const TableSummaryRow = TableSummary.Row
const TableSummaryCell = TableSummary.Cell

const {
  createSuccessModal,
  createErrorModal,
  createWarningModal,
  createConfirm
} = useMessage()

const {closeCurrent} = useTabs(router);

const formItems = ref({
  selectType: '1'
})

const titleValue = ref(0)

const [registerQueryPage, {openModal: openQueryPage}] = useModal()
//文件导入
const val = ref({
  openOne: 0,
  total: 0
})
const openQuery = async () => {
  val.value.openOne = 0
  openQueryPage(true, {
    data: val
  })
}

async function saveQuery(data) {}

const typeFlag = ref('0')

const dynamicTenantId = ref(getCurrentAccountName(true))
const defaultAdName = ref(useCompanyOperateStoreWidthOut().getSchemaName)

const summaryModel: any = ref({})

const tableData:any = ref([]);
const tableDataAll:any = ref([]);

const showPaginationText = ref(false)
const paginationNumber = ref(0)

const loadMark = ref(false)
const cxIsum = ref(0)
async function reloadTable(){
  loadMark.value = true
  showPaginationText.value = false
  let len = 0
  const res = await useRouteApi(findArApChongxiaoList,{schemaName: dynamicTenantId})({billStyle:'SS',iyear:pageParameter.year})
  tableDataAll.value = res
  tableData.value = tableDataAll.value
  let num = 50-(tableDataAll.value.length%50)
  for (let i=0;i<num;i++){
    tableData.value.push({})
  }
  await setPagination({
    total: tableData.value.length
  })
  countTable()
  calculateTotal()
  len = tableData.value.filter(item=>item.id!=null && item.id!='').length
  paginationNumber.value = len
  showPaginationText.value = true
  loadMark.value = false
}

function countTable(){
  cxIsum.value = 0
  tableData.value.map(item=>{
    cxIsum.value = add(cxIsum.value,item.cxIsum==null?'0':item.cxIsum)
    return item
  })
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
  accId: defaultAdName.value,
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
async function reloadList() {
  psnList.value = await useRouteApi(getPsnList,{schemaName: dynamicTenantId})({})
  deptList.value = await useRouteApi(findDeptByFlag,{schemaName: dynamicTenantId})({})
  const res2 = await useRouteApi(findCustAll,{schemaName: dynamicTenantId})(parameter)
  customerList.value = res2.items
}

const CrudApi = {
  columns: [
    {
      title: '单据日期',
      dataIndex: 'ddate',
      width: 100,
      align: 'left',
      ellipsis: true,
    },
    {
      title: '单据编码',
      dataIndex: 'ccode',
      width: 100,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'ccode'}
    },
    {
      title: '转出结算客户',
      dataIndex: 'cvencodeZc',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'cvencodeZc'}
    },
    {
      title: '转入结算客户',
      dataIndex: 'cvencodeZr',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'cvencodeZr'}
    },
    {
      title: '转入部门',
      dataIndex: 'cdepcode',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'cdepcode'}
    },
    {
      title: '转入业务员',
      dataIndex: 'cpersoncode',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'cpersoncode'}
    },
    {
      title: '转入项目',
      dataIndex: 'citemcode',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'citemcode'}
    },
    {
      title: '冲销金额',
      dataIndex: 'cxIsum',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'cxIsum'}
    },
    {
      title: '制单人',
      dataIndex: 'cmaker',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'cmaker'}
    },
  ]
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

function formatCpersoncode(cpersoncode){
  let str = cpersoncode
  psnList.value.forEach(item=>{
    if(item.id == cpersoncode){
      str = item.psnName
    }
  })
  return str
}

function formatCdepcode(cdepcode){
  let str = cdepcode
  deptList.value.forEach(item=>{
    if(item.id == cdepcode){
      str = item.deptName
    }
  })
  return str
}

// 这是示例组件
const [registerTable, {
  reload,
  getDataSource,
  setTableData,
  setPagination,
  getPaginationRef,
  getColumns,
  setColumns,
  deleteSelectRowByKey
}] = useTable({
  // api: CrudApi.list,
  columns: CrudApi.columns,
  bordered: true,
  showIndexColumn: true,
  indexColumnProps:{ fixed:true },
  pagination: {
    pageSize: 200,
    // showSizeChanger: false,
    simple:true,
    showTotal: t => `共${t}条记录    每页200条`
  },
  /*pagination: {
    pageSize: 50,
    showSizeChanger: true,
    pageSizeOptions: ['10', '25', '50', '100'],
    showTotal: t => `总共${t}条数据`
  },*/
  /*actionColumn: {
    width: 120,
    title: '操作',
    dataIndex: 'action',
    slots: {customRender: 'action'}
  }*/
})

//选中内容
const state = reactive<{
  selectedRowKeys: [];
  loading: boolean;
}>({
  selectedRowKeys: [], // Check here to configure the default column
  loading: false,
});
const checkRow: any = ref([])
const onSelectChange = (selectedRowKeys,row) => {
  // console.log('selectedRowKeys changed: ', row);
  state.selectedRowKeys = selectedRowKeys;
  checkRow.value = row.filter(item=>item.id!=null)
};

const rowSelection = {
  getCheckboxProps: (record) => ({
    disabled:  record.id==undefined
  }),
};
// 行勾选事件
const editAndDelBtnShow = ref(false);
function selectionChange(a) {
  editAndDelBtnShow.value=a.rows.filter(aa=>aa.id=='1').length>0?true:false
}

function rowClick(a) {
  if(hasBlank(a.id)){
    deleteSelectRowByKey(a.key)
  }
}

const pageParameter: any = reactive({
  id: '',
  isEdit: '0',
  dynamicTenantId: '',
  defaultAdName: '',
  year: '',
  thisAdInfo: {},
  total: 0,
  showRulesSize: 'MIN'
})

function onSearch() {
}

const defaultPage = ref(false)
onMounted(async() => {
  resetDynamicColumnData()
})

//打开收款单添加页
function addPage(){
  pageParameter.isEdit = '1'
  router.push({
    path: '/YingShouZhang/ChongXiao/CaoZuo/YingShouChongYingShou',
    query: pageParameter
  });
}

//修改收款单
function editPage(){
  if (checkRow.value.length == 1) {
    let num = 0
    for (let i = 0; i < checkRow.value.length; i++) {
      const item = checkRow.value[i]
      if (item.bcheck == '1') {
        num++
        createErrorModal({
          iconType: 'warning',
          title: '警告',
          content: '单据已审核，不能进行修改操作！'
        })
        return false
      }
    }
    if (num == 0) {
      pageParameter.id = checkRow.value[0].id
      pageParameter.isEdit = '3'
      router.push({
        path: '/YingShouZhang/ChongXiao/CaoZuo/YingShouChongYingShou',
        query: pageParameter
      });
    }
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '警告',
      content: '请选择需要修改的内容！'
    })
    return false
  }
}

//查看收款单
function openPage(data){
  pageParameter.id = data.id
  pageParameter.isEdit = '3'
  router.push({
    path: '/YingShouZhang/ChongXiao/CaoZuo/YingShouChongYingShou',
    query: pageParameter
  });
}

//删除
async function delList(){
  if (checkRow.value.length > 0) {
    for (let x = 0; x < checkRow.value.length; x++) {
      let chongxiao = checkRow.value[x]
      //判断存货和应收模块是否结账
      await jiezhang(chongxiao.ddate)
      if(flag.value){
        return createWarningModal({ content: '应收款已进行月末结账,不能进行操作！' });
      }
      //判断当前操作账套是否有人正在做结账
      let ymjz= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:pageParameter.year,name:'应收款月末结账',method:'月末结账'})
      if(ymjz.length){
        return createWarningModal({ content: ymjz[0]?.username+'正在进行应收款月末结账,不能同时进行操作！' });
      }
      let zdhx= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:pageParameter.year,name:'应收自动核销',method:'核销'})
      if(zdhx.length){
        return createWarningModal({ content: zdhx[0]?.username+'正在进行应收自动核销,不能同时进行操作！' });
      }
      //判断新生成的应收单是否做过核销
      let ysd = await useRouteApi(findSaleousingByCcode, {schemaName: dynamicTenantId})({
        ccode: chongxiao.targetCode,
        billStyle: 'YSD'
      })
      if (ysd.hxIsum != null && ysd.hxIsum != '' && ysd.hxIsum != '0') {
        createErrorModal({
          iconType: 'warning',
          title: '温馨提示',
          content: '生成的应收单已做过核销，不能删除！'
        })
        return false
      }
      //判断应收单没有其他下游单据（除应收冲应收）
    }
    createConfirm({
      iconType: 'warning',
      title: '应收冲应收单删除',
      content: '您确定要进行应收冲应收删除吗!',
      onOk: async () => {
        for (let x = 0; x < checkRow.value.length; x++) {
          let chongxiao = checkRow.value[x]
          let ysd = await useRouteApi(findSaleousingByCcode, {schemaName: dynamicTenantId})({
            ccode: chongxiao.targetCode,
            billStyle: 'YSD'
          })
          //判断应收冲应收
          let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:pageParameter.year,name:'应收冲应收',method:'删除',recordNum:chongxiao.ccode})
          if(taskData.length==0){
            await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({iyear:pageParameter.year,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:'应收冲应收',method:'删除',recordNum:chongxiao.ccode,caozuoModule:'ar'})
          } else {
            // 任务不是当前操作员的
            if(String(taskData[0]?.caozuoUnique)!==String(useUserStoreWidthOut().getUserInfo.id)){
              return createWarningModal({ content: taskData[0]?.username+'正在'+taskData[0]?.method+'应收冲应收,不能同时进行操作！' });
            }else{
              await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({id:taskData[0]?.id,iyear:pageParameter.year,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:'应收冲应收',method:'删除',recordNum:chongxiao.ccode,caozuoModule:'ar'})
            }
          }
          //判断应收单
          let ysdData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:pageParameter.year,name:'应收单',method:'修改,删除,审核,弃审,复核,弃复',recordNum:ysd.ccode})
          if(ysdData.length==0){
            await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({iyear:pageParameter.year,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:'应收单',method:'删除',recordNum:ysd.ccode,caozuoModule:'ar'})
          } else {
            // 任务不是当前操作员的
            if(String(ysdData[0]?.caozuoUnique)!==String(useUserStoreWidthOut().getUserInfo.id)){
              return createWarningModal({ content: ysdData[0]?.username+'正在'+ysdData[0]?.method+'应收单,不能同时进行操作！' });
            }else{
              await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({id:ysdData[0]?.id,iyear:pageParameter.year,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:'应收单',method:'删除',recordNum:ysd.ccode,caozuoModule:'ar'})
            }
          }
          //删除新生成的应收单
          await useRouteApi(deleteSaleousingById, {schemaName: dynamicTenantId})(ysd.id)
          await useRouteApi(deleteSaleousingsByCcode, {schemaName: dynamicTenantId})({
            ccode: ysd.ccode,
            billStyle: ysd.billStyle
          })
          //删除下游单据
          const xyCsource = await useRouteApi(findXyCsourceByCcodeAndXyccode, {schemaName: dynamicTenantId})({
            ccode: ysd.ccode,
            xyccode: chongxiao.ccode
          })
          if (xyCsource.length > 0) {
            await useRouteApi(deleteXyCsouceById, {schemaName: dynamicTenantId})(xyCsource[0].id)
          }
          //修改对应应收单核销金额
          const list = await useRouteApi(findArApChongxiaosByCcode, {schemaName: dynamicTenantId})({
            ccode: chongxiao.ccode,
            billStyle: chongxiao.busStyle
          })
          for (let i = 0; i < list.length; i++) {
            let item = list[i]
            // if (item.sourcetype.substring(0, 2) == 'QC') {
            if(item.sourcetype=='QCYSD'){
              //期初应收单
              const xhdyue = await useRouteApi(findArBeginBalanceByCcode, {schemaName: dynamicTenantId})(item.targetCode)
              xhdyue.hxIsum = sub(xhdyue.hxIsum, add(item.hxIsum == null ? '' : item.hxIsum, item.idiscount == null ? '' : item.idiscount))
              xhdyue.hxFlag = '0'
              await useRouteApi(saveBeginBalance, {schemaName: dynamicTenantId})(xhdyue)
              //删除下游单据
              const xySource = await useRouteApi(findArXySourceByCcodeAndXyccode, {schemaName: dynamicTenantId})({
                ccode: xhdyue.ccode,
                xyccode: chongxiao.ccode
              })
              if (xySource.length > 0) {
                await useRouteApi(deleteArXySouceById, {schemaName: dynamicTenantId})(xySource[0].id)
              }
            } else {
              //普通应收单
              const saleousing = await useRouteApi(findSaleousingByCcode, {schemaName: dynamicTenantId})({ccode:item.targetCode,billStyle:item.billStyle})
              saleousing.hxIsum = sub(saleousing.hxIsum, add(item.hxIsum == null ? '' : item.hxIsum, item.idiscount == null ? '' : item.idiscount))
              saleousing.hxFlag = '0'
              await useRouteApi(saveSaleousing, {schemaName: dynamicTenantId})(saleousing)
              //修改销货单子表
              const sales = await useRouteApi(findSaleousingsByCcode, {schemaName: dynamicTenantId})({
                ccode: saleousing.ccode,
                billStyle: saleousing.billStyle
              })
              let salesList: any = []
              let money = item.hxIsum
              for (let j = 0; j < sales.length; j++) {
                const aa = sales[sales.length - 1 - j]
                if (!hasBlank(money) && money != 0) {
                  if (money > 0) {
                    if (aa.hxIsum < money) {
                      aa.hxIsum = '0'
                      aa.hxFlag = '0'
                      money = sub(money, aa.hxIsum == null ? '0' : aa.hxIsum)
                    } else {
                      aa.hxIsum = sub(aa.hxIsum == null ? '0' : aa.hxIsum, money)
                      aa.hxFlag = '0'
                      money = 0
                    }
                  } else {
                    if (aa.hxIsum > money) {
                      aa.hxIsum = '0'
                      aa.hxFlag = '0'
                      money = sub(money, aa.hxIsum == null ? '0' : aa.hxIsum)
                    } else {
                      aa.hxIsum = sub(aa.hxIsum == null ? '0' : aa.hxIsum, money)
                      aa.hxFlag = '0'
                      money = 0
                    }
                  }
                  salesList.push(aa)
                }
              }
              await useRouteApi(saveSaleousingsList, {schemaName: dynamicTenantId})(salesList)
              //删除下游单据
              const xyCsource = await useRouteApi(findXyCsourceByCcodeAndXyccode, {schemaName: dynamicTenantId})({
                ccode: sales.ccode,
                xyccode: chongxiao.ccode
              })
              if (xyCsource.length > 0) {
                await useRouteApi(deleteXyCsouceById, {schemaName: dynamicTenantId})(xyCsource[0].id)
              }
            }
          }
          //删除冲销表
          await useRouteApi(deleteArApChongxiaosById, {schemaName: dynamicTenantId})(chongxiao.id)
          await useRouteApi(deleteArApChongxiaosByCcode, {schemaName: dynamicTenantId})({
            ccode: chongxiao.ccode,
            billStyle: chongxiao.busStyle
          })
          //删除任务锁定
          await useRouteApi(stockBalanceTaskDelByUserName, { schemaName: dynamicTenantId })({iyear:pageParameter.year,userName:useUserStoreWidthOut().getUserInfo.id,functionModule:'应收冲应收',method:'删除',recordNum:chongxiao.ccode})
          await useRouteApi(stockBalanceTaskDelByUserName, { schemaName: dynamicTenantId })({iyear:pageParameter.year,userName:useUserStoreWidthOut().getUserInfo.id,functionModule:'应收单',method:'删除',recordNum:ysd.ccode})
          message.success('删除成功！')
        }
        state.selectedRowKeys = []
        checkRow.value = []
        await reloadTable()
        return true
      }
    });
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '警告',
      content: '请选择需要删除的内容！'
    })
    return false
  }
}

//根据日期判断是否结账
const flag = ref(false)
const stockFlag = ref(false)
async function jiezhang(ddate) {
  if(ddate==null || ddate==''){
    ddate = useCompanyOperateStoreWidthOut().getLoginDate
  }
  let yy = ddate.substring(0, 4)
  let mm = ddate.substring(5, 7)
  const res = await findPeriodByYearList(yy)
  for (let i = 0; i < res.length; i++) {
    let item = res[0]
    if (item.stockMonth == mm) {
      if (item.iar == '1') {
        flag.value = true
      }
      if (item.stockFlag == '1'){
        stockFlag.value = true
      }
    }
  }
  flag.value = false
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

//导出
import {
  defaultV,
  sheet_from_array_of_arrays,
  Workbook,
  writeExcel
} from "/@/utils/boozsoft/excel/excel2";
import XLSX from "xlsx-js-style";
const excelData = () => {
  // console.log("导出成功！")
  const arrData = tableData.value
  arrData.forEach(item=>{
    // item.billStyle = formatHxStyle(item.billStyle)
    item.cvencodeJs = formatCvencode(item.cvencodeJs)
    item.cvencode = formatCvencode(item.cvencode)
    item.hxIsum = item.hxIsum==null?'0.00':toThousandFilter(item.hxIsum)
    item.isum = item.isum==null?'0.00':toThousandFilter(sub(item.isum,item.hxIsum))
    item.hxMoney = item.hxMoney==null?'':toThousandFilter(item.hxMoney)
    item.hxStyle = item.hxStyle==null?'':'收款单'
    item.hxDate = item.hxDate==null?'':item.hxDate
    item.hxCode = item.hxCode==null?'':item.hxCode
    item.idiscount = item.idiscount==null?'':toThousandFilter(item.idiscount)
  })
  const sheet:any = [
    {
      title: '应收款核销明细表',
      multiHeader: [
        ['单位：'+pageParameter.companyName, '','', '', '', '期间：2022.01.01 - 2022.12.31', '', '', '', '','',''],
        ['单据类型', '单据日期','单据编码', '结算客户名称', '客户名称', '核销金额', '余额', '核销单据类型', '核销单据日期', '核销单据编号','核销金额','折扣金额']
      ],
      table: arrData,
      keys: ['billStyle', 'ddate', 'ccode', 'cvencodeJs', 'cvencode', 'hxIsum', 'isum', 'hxStyle', 'hxDate', 'hxCode','hxMoney','idiscount'],
      merges: ['A2:D2','F2:H2'],
      sheetName: '应收款核销明细表',
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
      colWidth: [10, 10, 10, 15, 15, 15, 15, 15, 15, 15, 15, 15]
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
          if (i.substring(1) == '1' || i.substring(1) == '2') {
            dataInfo[i.toString()].s = {
              border: {},
              font: font || globalStyle.font,
              alignment: alignment || globalStyle.alignment,
              fill: fill || globalStyle.fill
            }
            if (i == 'A2') {
              dataInfo[i.toString()].s = {
                border: {},
                font: font || globalStyle.font,
                alignment: {
                  horizontal: "left",
                },
                fill: fill || globalStyle.fill
              }
            }
          } else if (i.substring(1) == '3') {
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
              alignment: {
                horizontal: "left",
              }
            }
          } else if (i.substring(0, 1) == 'C' || i.substring(0, 1) == 'D'
            || i.substring(0, 1) == 'E' || i.substring(0, 1) == 'H'
            || i.substring(0, 1) == 'I' || i.substring(0, 1) == 'J') {
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "left",
              }
            }
          } else if (i.substring(0, 1) == 'F' || i.substring(0, 1) == 'G' || i.substring(0, 1) == 'K' || i.substring(0, 1) == 'L') {
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "right",
              }
            }
          }
          /*if (foot.length > 0) {
            if (i.substring(1) == data.length) {
              dataInfo[i.toString()].s = {
                border: {},
                font: {
                  name: '宋体',
                  sz: 10,
                  color: {rgb: "000000"},
                  bold: true,
                },
                fill: fill || globalStyle.fill,
                alignment: {
                  horizontal: "left",
                }
              }
            }
          }*/
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
  writeExcel(wb, bookType, '应收款核销明细表_'+pageParameter.companyName)
}

/**********************明细栏目设置**********************/
import {assemblyDynamicColumn, initDynamics} from "./data";
import {useUserStore, useUserStoreWidthOut} from "/@/store/modules/user";
import {findStockDbLanMuList, saveStockLanMuList} from "/@/api/record/system/stock-column-view-settings";
import {cloneDeep} from "lodash-es";
import {
  deleteXyCsouceById,
  findArApYsyfByCcode,
  findXyCsourceByCcodeAndXyccode,
  saveSaleousing,
  saveYsyf
} from "/@/api/record/system/arApYsyf";
import {
  deleteSaleousingById, deleteSaleousingsByCcode,
  findSaleousingByCcode,
  findSaleousingsByCcode,
  saveSaleousingsList
} from "/@/api/record/system/ysd";
import {
  getByStockBalanceTask,
  stockBalanceTaskDelByUserName
} from "/@/api/record/stock/stock_balance";
import {saveTaskApi} from "/@/api/record/system/task";
import {
  deleteArApChongxiaosByCcode,
  deleteArApChongxiaosById,
  findArApChongxiaoList,
  findArApChongxiaosByCcode
} from "/@/api/record/system/ArApChongxiao";
import {findPeriodByYearList} from "/@/api/record/system/ar-ap-period";
import {
  deleteArXySouceById,
  findArBeginBalanceByCcode,
  findArXySourceByCcodeAndXyccode,
  saveBeginBalance
} from "/@/api/record/system/arBeginBalance";

/*start栏目设置*/
const visible = ref(false);
const windowWidth = (window.innerWidth)
const windowHeight = (window.innerHeight - (320))
const totalColumnWidth = ref(0)
const dynamicColumns = initDynamics().DEFAULT
const dynamicColumnData: any = ref([])
let dynamicColumnDataCopy = []
const editableData = reactive({});
const tableRef: any = ref(null)
const lanMuData = {
  'accId': '',
  'menuName': '应收冲应收',
  'type': '列表',
  objects: '',
  username: useUserStoreWidthOut().getUserInfo.username,
  userId: useUserStoreWidthOut().getUserInfo.id,
  isType: '0'
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
        saveStockLanMuList(lanMuData).then(res => {
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
const cancel = (e: MouseEvent) => {
  // 恢复默认
  dynamicColumnData.value = []
  dynamicColumnData.value = dynamicColumnDataCopy
}
const edit = (key: string) => {
  if (key.toString().indexOf('-') != -1) {
    let arr: any = key.split('-');
    let one = parseInt(arr[0])
    if (arr.length == 2) {
      editableData[key] = cloneDeep(dynamicColumnData.value[one].children.filter(item => key === item.key)[0]);
    } else {
      let two = parseInt(arr[1]) - 1
      editableData[key] = cloneDeep(dynamicColumnData.value[one].children[two].children.filter(item => key === item.key)[0]);
    }
  } else {
    editableData[key] = cloneDeep(dynamicColumnData.value.filter(item => key === item.key)[0]);
  }
}
const save = (key: string, min: number, max: number) => {
  editableData[key].width = editableData[key].width > max ? max : editableData[key].width < min ? min : editableData[key].width
  if (key.toString().indexOf('-') != -1) {
    let arr: any = key.split('-');
    let one = parseInt(arr[0])
    if (arr.length == 2) {
      Object.assign(dynamicColumnData.value[one].children.filter(item => key === item.key)[0], editableData[key]);
      Object.assign(dynamicColumnData.value[one].children.filter(item => key === item.key)[0], editableData[key]);
    } else {
      let two = parseInt(arr[1]) - 1
      Object.assign(dynamicColumnData.value[one].children[two].children.filter(item => key === item.key)[0], editableData[key]);
    }
  } else {
    Object.assign(dynamicColumnData.value.filter(item => key === item.key)[0], editableData[key]);
  }
  delete editableData[key];
}
const saveName = (key: string) => {
  if (key.toString().indexOf('-') != -1) {
    let arr: any = key.split('-');
    let one = parseInt(arr[0])
    if (arr.length == 2) {
      Object.assign(dynamicColumnData.value[one].children.filter(item => key === item.key)[0], editableData[key]);
      Object.assign(dynamicColumnData.value[one].children.filter(item => key === item.key)[0], editableData[key]);
    } else {
      let two = parseInt(arr[1]) - 1
      Object.assign(dynamicColumnData.value[one].children[two].children.filter(item => key === item.key)[0], editableData[key]);
    }
  } else {
    Object.assign(dynamicColumnData.value.filter(item => key === item.key)[0], editableData[key]);
  }
  delete editableData[key];
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
    } catch (e: any) {
      if (e.message == 'ok') {
        return true
      } else {
        return false
      }
    }
  })
  return a;
}

function combineParameters(staticList: any, dbList: any) {
  staticList.forEach(item => {
    dbList.forEach(item2 => {
      if (item.key === item2.key && item.name === item2.name) {
        item.nameNew = item2.nameNew
        item.width = parseInt(item2.width)
        item.check = item2.check == 'true'
        item.align = item2.align
      }
    })
  })
  return staticList
}

const reloadColumns = () => {
  let a: any = []
  a = getColumns()
  let last = a.pop()
  let newA = JSON.parse(JSON.stringify(CrudApi.columns))
  newA = assemblyDynamicColumn(dynamicColumnData.value, newA)
  setColumns(newA)
  initTableWidth(newA)
  //searchConditonList.value = newA
}

function resetDynamicColumnData() {
  // 先从数据查询是否已经设置
  lanMuData.accId = getCurrentAccountName(false)
  findStockDbLanMuList(lanMuData).then(res => {
    // 栏目列
    let dbList = res.items
    if (dbList.length > 0) {
      let statiList = initDynamics()['DATA']
      dbList = combineParameters(statiList, dbList)
      dynamicColumnData.value = dbList
      dynamicColumnDataCopy = JSON.parse(JSON.stringify(dbList))
    } else {
      let statiList = initDynamics()['DATA']
      dynamicColumnData.value = statiList
      dynamicColumnDataCopy = JSON.parse(JSON.stringify(statiList))
    }
    // 表格列
    reloadColumns()
    //pageReload()
  })
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
    tableRef.value.$el.style.setProperty('width', (windowWidth + 70 - f) + 'px')
  } else {
    if (visible.value && (windowWidth - 260) < total) total -= (total - (windowWidth - 260))
    totalColumnWidth.value = total
    tableRef.value.$el.style.setProperty('width', (total + 70) + 'px')
  }
}

const pageReload = () => {
  setTableData([]) // 清空可能残留的数据
  reload({
    searchInfo: pageParameter
  })
}
/*明细栏目设置end*/

const dynamicAdReload = async (obj) => {
  // const dataBase:any = await findDataBase(obj.accId,obj.year)
  dynamicTenantId.value = obj.accountMode
  defaultAdName.value = obj.accId
  // 底部分页信息
  pageParameter.thisAdInfo = {}
  pageParameter.thisAdInfo = obj
  pageParameter.dynamicTenantId = obj.accountMode
  pageParameter.defaultAdName = obj.accId
  pageParameter.companyName = obj.companyName
  pageParameter.year = obj.year
  await reloadList()
  await reloadTable()
}

/*** 合计 ***/
const getCurrSummary  = () => {
  return (getColumns().filter((it:any)=>it.title != '序号' && it.ifShow).map((it,ind)=>{it['ind']=ind+2;return it;}))
}
const calculateTotal = () => {
  let list = getDataSource()
  if (list.length == 0){
    summaryModel.value = {}
    return false;
  }
  let num1 = 0
  for (let i = 0; i < list.length; i++) {
    const e = list[i];
    num1+=parseFloat(e['cxIsum'] || 0)
  }
  summaryModel.value={
    cxIsum: num1,
  }
}
/*** 合计 ***/

</script>
<style src="./global-menu-index.less" lang="less" scoped="scoped"></style>
<style scoped lang="less">
:deep(.vben-basic-table) {
  .ant-table-wrapper {
    .ant-table-measure-row{
      td{
        padding: 0!important;
      }
    }
  }
}

:deep(.ant-card-body) {
  padding: 16px;
  border-left: 2px solid rgb(1, 143, 251);
  box-shadow: rgb(72 113 140) -3px 1px 7px -1px;
}

.a-table-font-size-16 :deep(td),
.a-table-font-size-16 :deep(th) {
  font-size: 14px !important;
  padding: 2px 8px !important;
  border-color: #aaaaaa !important;
  //font-weight: 550;
  color: #000000 !important;
}

.a-table-font-size-12 :deep(td),
.a-table-font-size-12 :deep(th) {
  font-size: 13px !important;
  padding: 2px 8px !important;
  border-color: #aaaaaa !important;
  //font-weight: 550;
  color: #000000 !important;
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
  /*position: relative;
  :deep(.pagination-text){
    position: absolute;
    bottom: 6px;
    right: 40%;
    font-size: 13px;
    color: black;
    z-index: 99999999;
  }*/
}

.temp{
  position: relative;
  .pagination-text {
    position: absolute;
    bottom: 6px;
    right: 40%;
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
  margin: 0;
}

:deep(.vben-basic-table){
  min-height: 500px;
  height: calc(100% - 160px);
  margin-bottom: 20px;
}

:deep(.ant-input),:deep(.ant-select),:deep(.ant-btn){
  border: 1px solid #c9c9c9;
}

:deep(.nc-summary) {
  font-size: 14px;
  font-weight: bold !important;
  width: 100%;
  background-color: #cccccc;
  border:none !important;
  border-bottom: 1px solid #000000 !important;

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
    width: 23%;
    text-align: center;
  }

  > div:nth-of-type(2) {
    width: 19%;
    margin: 0 1px;
    text-align: right;
  }
  > div:nth-of-type(3) {
    width: 19%;
    text-align: right;
    margin: 0 1px;
  }
  > div:nth-of-type(4) {
    width: 19%;
    margin: 0 1px;
    text-align: right;
  }
  > div:nth-of-type(5) {
    width: 19%;
    margin: 0 1px;
    text-align: right;
  }
}
</style>
