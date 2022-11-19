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
        <div>  <b class="noneSpan" style="font-size: 26px;color: #0096c7;">客户促销活动</b></div>
      </div>
      <div>
        <div>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="openAddPage()"
          ><span>新增</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="editOpen()"
          ><span>修改</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="delList()"
          ><span>删除</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="closeCurrent(),router.push('/one/home/welcome')">
            <span>退出</span></button>
        </div>
        <div>
          <a-button class="ant-btn-me" @click="reloadCurrentPage()">
            <SyncOutlined :style="{ fontSize: '14px' }" />
          </a-button>
          <a-popover class="ant-btn-default" placement="bottom">
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
            <a-button>
              <SettingFilled :style="{ fontSize: '14px' }"/>
            </a-button>
          </a-popover>
        </div>
      </div>
    </div>
    <div class="app-container" style="bottom:12px;">

      <Edit @save="saveData" @register="registerEditPage"/>
      <Loading :loading="compState.loading" :absolute="compState.absolute" :tip="compState.tip" />
      <BasicTable
        v-if="activeKey"
        ref="tableRef"
        :dataSource="tableData"
        :row-selection="{ type: 'checkbox', selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
        @row-click="condClick"
        style="width: 100%;"
        :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
        @register="registerTable"
      >
        <template #status="{ record }">
          <span>
            <a-tag v-if="record.status === '1'" color="green">开始中</a-tag>
            <a-tag v-if="record.status === '2'" color="blue">已结束</a-tag>
            <a-tag v-if="record.status === '0'" color="orange">未开始</a-tag>
          </span>
        </template>

        <template #flag="{ record }">
            <span>
              <a-tag :color="record.flag!=null ? record.flag === '1' ? 'green' : 'volcano' : ''">
                {{ record.flag!=null ? record.flag === '1' ? '启用' : '停用':'' }}
              </a-tag>
            </span>
        </template>

        <template #activityCode="{ record }">
          <span>
            <a  @click="openListsPage(record)" >{{ record.activityCode }}</a>
          </span>
        </template>

        <template #activityScope="{ record }">
          <span> {{ record.activityScope!= null ? record.activityScope === '1' ? '全部客户' : '选定客户' :'' }}</span>
        </template>

        <template #activityName="{ record }">
          <span>
            <a  @click="openListsPage(record)" >{{ record.activityName }}</a>
          </span>
        </template>

        <template #action="{ record }">
        <div v-if="record.activityCode !=null">
          <a-popover placement="bottom">
            <a-button style="padding: 0px 4px; height: 20px;">
              <CaretDownFilled />
            </a-button>
            <template #content>
              <p v-if="record.flag=='0'" class="p_specifics" style="cursor: pointer"
                 @click="editFlagData(record)">
                <CheckCircleOutlined/>
                启用
              </p>
              <p v-if="record.flag=='1'" class="p_specifics" style="cursor: pointer"
                 @click="editFlagData(record)">
                <CloseCircleOutlined/>
                停用
              </p>
            </template>
          </a-popover>
        </div>
      </template>

      </BasicTable>

      <div class="pagination-text" >
        {{`共 ${paginationNumber} 条记录   &nbsp;&nbsp;每页 200 条`}}
      </div>
    </div>
  </div>
</template>
<script setup="props, {emit}" lang="ts">
import {
  findSettModesAll,
  findSettModesByFlag,
  deleteSettModes,
  saveSettModes,
  excelVoucherType,
  editFlag
} from '/@/api/record/stock/stock_promote_price'
import {getCurrentAccountName, getThisIndexImg} from "/@/api/task-api/tast-bus-api";
import {BasicTable, useTable} from '/@/components/Table'
import { useModal } from '/@/components/Modal'
import {onMounted, reactive, ref} from 'vue'
import Edit from './popup/edit.vue'

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
  CheckOutlined,
  SortDescendingOutlined,PicRightOutlined,
  UnorderedListOutlined,AccountBookTwoTone,
  SortAscendingOutlined
} from '@ant-design/icons-vue'
import {
  DatePicker as ADatePicker,
  Select as ASelect,
  Input as AInput,
  Popover as APopover,
  Switch as ASwitch,
  Radio as ARadio,
  Upload as AUpload,
  List as AList,
  Row as ARow,
  Menu as AMenu,
  message,
  Tag as ATag
} from "ant-design-vue"
import {columnProps} from "ant-design-vue/es/table/interface";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useMessage} from "/@/hooks/web/useMessage";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {findByAccId, findDataBase} from "/@/api/record/system/account";
import {findAllCustomerClass} from "/@/api/record/system/customer_class";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {aoaToSheetXlsx} from "/@/components/Excel";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {useNewPrint} from "/@/utils/boozsoft/print/print";
import {tableStyle} from "/@/store/modules/abc-print";
import { Loading } from '/@/components/Loading';

const ARangePicker = ADatePicker.RangePicker
const ASelectOption = ASelect.Option
const AInputSearch = AInput.Search
const ARadioGroup = ARadio.Group
const AListItem = AList.Item
const AMenuItem = AMenu.Item
const {closeCurrent} = useTabs(router);
const windowHeight = (window.innerHeight - 300)

const {
  createConfirm,
  createWarningModal
} = useMessage()
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
const database = ref(getCurrentAccountName(true));
const accId = ref(getCurrentAccountName(false));
const CrudApi = {
/*
  list: useRouteApi(findSettModesAll,{schemaName: database}),
*/
  columns: [
    {
      title: 'ID',
      dataIndex: 'id',
      defaultHidden: true,
      ellipsis: true
    },
    {
      title: '活动进度',
      dataIndex: 'status',
      width: '15%',
      customHeaderCell: () => {		// 表头加粗
        return {style: {'font-weight':'bold'}} // return 想要设置的样式
      },
      ellipsis: true,
      slots: {customRender: 'status'}
    },
    {
      title: '活动编码',
      dataIndex: 'activityCode',
      width: '20%',
      customHeaderCell: () => {		// 表头加粗
        return {style: {'font-weight':'bold'}} // return 想要设置的样式
      },
      ellipsis: true,
      align: 'left',
      slots: {customRender: 'activityCode'}
    },
    {
      title: '活动名称',
      dataIndex: 'activityName',
      width: '30%',
      align: 'left',
      customHeaderCell: () => {		// 表头加粗
        return {style: {'font-weight':'bold'}} // return 想要设置的样式
      },
      ellipsis: true,
      slots: {customRender: 'activityName'}
    },
    {
      title: '活动内容',
      dataIndex: 'activityContent',
      width: '40%',
      customHeaderCell: () => {		// 表头加粗
        return {style: {'font-weight':'bold'}} // return 想要设置的样式
      },
      ellipsis: true
    },
    {
      title: '活动范围',
      dataIndex: 'activityScope',
      width: '15%',
      customHeaderCell: () => {		// 表头加粗
        return {style: {'font-weight':'bold'}} // return 想要设置的样式
      },
      ellipsis: true,
      slots: {customRender: 'activityScope'}
    },
    {
      title: '价格生效日期',
      dataIndex: 'startDate',
      width: '20%',
      customHeaderCell: () => {		// 表头加粗
        return {style: {'font-weight':'bold'}} // return 想要设置的样式
      },
      ellipsis: true
    },
    {
      title: '价格失效日期',
      dataIndex: 'stopDate',
      width: '20%',
      customHeaderCell: () => {		// 表头加粗
        return {style: {'font-weight':'bold'}} // return 想要设置的样式
      },
      ellipsis: true
    },
    {
      title: '是否启用',
      dataIndex: 'flag',
      width: '15%',
      ellipsis: true,
      customHeaderCell: () => {		// 表头加粗
        return {style: {'font-weight':'bold'}} // return 想要设置的样式
      },
      slots: {customRender: 'flag'}
    }
  ],
  editData: {
    id: '',
    settModesCode: '',
    settModesName: ''
  }
}

// 这是示例组件
const [registerTable, { reload,getDataSource,setTableData,setColumns,getColumns,getPaginationRef,setPagination }] = useTable({
  /*api: CrudApi.list,*/
  columns: CrudApi.columns,
  bordered: true,
  showIndexColumn: true,
  pagination: {
    pageSize: 200,
    simple: true,
  },
  actionColumn: {
    width: '10%',
    title: '操作',
    dataIndex: 'action',
    customHeaderCell: () => {		// 表头加粗
      return {style: {'font-weight':'bold'}} // return 想要设置的样式
    },
    slots: {customRender: 'action'}
  }
})
const [registerEditPage, { openModal: openEditPage }] = useModal()
const val = {
  id: '',
  settModesCode: '',
  settModesName: '',
  database: '',
}
const condClick = (data:any, e:any) => {
  /*if (e.target.cellIndex == 1) {
    openEditPage(true, {
      data: data
    })
  }*/
}
const openAddPage = () => {
  val.database = database.value
  openEditPage(true, {
    data: val
  })
}
const openEdit = (data:any) => {
  data.data.database = database.value
  openEditPage(true, {
    data: data
  })
}
const del = async(data:any) => {
  await useRouteApi(deleteSettModes,{schemaName: database})(data)
  await reloadCurrentPage()
  message.success('删除成功！')
  // alert('删除成功！')
  await reload()
  checkRow.value = []
  state.selectedRowKeys = []
}
const activeKey = ref(true)

const tableData:any = ref([]);
const paginationNumber = ref(0)
const cardList:any = ref({})
async function reloadCurrentPage() {
  let v =  await useRouteApi(findSettModesAll,{schemaName: database})({})
  console.log(v)
  paginationNumber.value = v.items.length
  if(v.items.length < 25){
    let s = 25-v.items.length
    for (let i = 0; i < s; i++) {
      v.items.push({})
    }
  }
  tableData.value =  v.items
  setPagination({
    total: tableData.value.length
  })

  /*const res = await useRouteApi(findSettModesByFlag,{schemaName: database})({})
  cardList.value = res.items*/
}


async function saveData(data: any) {
  await useRouteApi(saveSettModes,{schemaName: database})(data)
  await reloadCurrentPage()
  await reload()
  checkRow.value = []
  state.selectedRowKeys = []
}

async function editFlagData(data: any) {
  await useRouteApi(editFlag,{schemaName: database})(data)
  await reload()
  checkRow.value = []
  state.selectedRowKeys = []
}

//选中内容
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
const editOpen = () => {
  if (checkRow.value.length == 1) {
    checkRow.value[0].isEdit = true
    openEditPage(true, {
      data: checkRow.value[0]
    })
  } else {
    createWarningModal({
      iconType: 'warning',
      title: '编辑',
      content: '请选择一条进行编辑！'
    })
  }
}

async function delList() {
  if (checkRow.value.length > 0) {
    createConfirm({
      iconType: 'error',
      title: '警告',
      content: '删除后数据将不能恢复，你确认要删除吗?',
      onOk: async () => {
        for (let i = 0; i < checkRow.value.length; i++) {
          const item = checkRow.value[i]
          await useRouteApi(deleteSettModes,{schemaName: database})(item)
        }
        checkRow.value = []
        state.selectedRowKeys = []
        message.success('删除成功！')
        await reload()
      },
      onCancel: () => {
        return false
      }
    })
  } else {
    createWarningModal({
      iconType: 'warning',
      title: '删除',
      content: '请选择需要删除的内容！'
    })
  }
}

function onSearch() {
}

const pageParameter: any = reactive({
  showRulesSize: 'MIN'
})

const accNameAll =  ref(null)
const totalData = ref('0')
const companyName = ref('');
const dynamicAdReload = async (obj) => {
  accNameAll.value = obj.target.accName
  accId.value=obj.accountId
  database.value =obj.accountMode
  companyName.value =  obj.companyName
  reloadCurrentPage()
}
function formatFlag(flag:any) {
  let str = '启用'
  switch (flag) {
    case '1':
      str = '启用'
      break
    case '0':
      str = '停用'
      break
  }
  return str
}
const exportExcelNow = async () => {
  const data = JSON.parse(JSON.stringify(getDataSource()))
  // debugger
  const arrHeader = ['资产组编码', '资产组名称', '状态'];
  const columnList = ['bsCode','bsName','flag']
  data.forEach(v=>{
    v.flag = formatFlag(v.flag )
  })
  const arrData = data.map((item) => columnList.map(column=>item[column]));
  // 保证data顺序与header一致
  aoaToSheetXlsx({
    data: arrData,
    header: arrHeader,
    filename: '资产组.xlsx',
  });
}
//导入Excel
const dynamicTenantId = ref(getCurrentAccountName(true))
const [registerExcelPage, { openModal: openExcelPage }] = useModal()
const openExcel = () => {
  openExcelPage(true, {
    data: {
      dynamicTenantId: dynamicTenantId.value
    }
  })
}
async function saveExcel(data:any) {
  await useRouteApi(excelVoucherType, {schemaName: dynamicTenantId})(data)
  reload()
}
const [registerPrintPage, {openModal: openPrintPage}] = useModal()
const openPrint = () => {
  openPrintPage(true, {
    data: {
      dynamicTenantId: dynamicTenantId.value,
      defaultAdName: useCompanyOperateStoreWidthOut().getSchemaName,
      year: '2021',
    }
  })
}
const userName = useUserStoreWidthOut().getUserInfo.username
const loadPrint = (obj) => {
  openCompFullLoading()
  const data = JSON.parse(JSON.stringify(getDataSource()))
  let printList: any = []
  let printUser = ''
  if(obj.printUser){
    printUser = '制表人：'+ userName
  }

  let title = '资产组'
  //格式化数据
  data.forEach((item,index) => {
    let item1 = {}
    item1[0] = item.bsCode
    item1[1] = item.bsName
    item1[2] = formatFlag(item.flag)
    printList.push(item1)
  })
  for (let i=0; i<printList.length%40; i++){
    let item1 = {}
    item1[0] = ''
    item1[1] = ''
    item1[2] = ''
    printList.push(item1)
  }
  let num = Math.ceil(printList.length/40)
  useNewPrint({data: ['p', 'px', 'a4', true]}, (doc) => {
    doc.autoTable({
      head: [['', title, ''],
        ['核算单位:'+accNameAll.value, ''],
        ['资产组编码', '资产组名称', '状态']],
      body: printList,
      // startY: 60,
      styles: tableStyle(),
      margin: {
        left: 60,
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
        /*doc.autoTableText(
          '核算单位：' ,
          tabMarginLeft,
          data.cursor.y + 3,
          0
        );*/
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
          if (data.column.index == 1) {
            data.cell.colSpan = 1
            data.cell.styles.halign = 'center'
          }
        }
        if (data.section == 'head' && data.row.index == 1) {
          data.cell.styles.fontSize = 10
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.lineColor = [255, 255, 255]
          data.cell.colSpan = 3
          data.cell.styles.halign = 'left'
        }
        if (data.section == 'head' && data.row.index == 2) {
          data.cell.styles.fontSize = 10
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
        0: {maxHeight: 10,cellWidth: 70, halign: 'left'},
        1: {cellWidth: 200, halign: 'left'},
        2: {cellWidth: 70, halign: 'center'},
      }
    })
    compState.loading = false
  })

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
//加
function add(a, b) {
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
//减
function sub(a, b) {
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
  return e = Math.pow(10, Math.max(c, d)), (a * e - b * e) / e;
}

const openListsPage = (data) => {
  console.log(data)
  router.push({
    path: '/sz-gys-mx',
    query: {
      activityId: data.id,
      accName: companyName.value,
      activityScope: data.activityScope,
      activityContent: data.activityContent?.substring(0,10),
      activityName: data.activityCode + '-' +data.activityName,
      activityDate: data.startDate + '~' +data.stopDate,
      accId: dynamicTenantId.value,
    },
  });

}




</script>
<style scoped lang="less">
@import "../../../../assets/styles/global-menu-index.less";
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
.app-container:nth-of-type(2) {
  padding: 0px;
  margin: 5px 10px;
  background: #b4c8e3 !important;
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
</style>
