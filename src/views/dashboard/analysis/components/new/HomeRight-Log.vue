<template>
  <div class="nc-hr">
    <div class="nc-hr-top">
      <div class="nc-hr-top-left">
        <div>
          <Avatar src="" :size="{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 80 }">
            <UnlockFilled style="font-size: 30px;color: #146dc1;" />
          </Avatar>
        </div>
        <div>
          <span>操作员</span><br/>
          <span>操作日志</span>
        </div>
      </div>
      <div class="nc-hr-top-right">
        <div>
          <Rate v-model:value="rateValue" allow-half/>
          <br/>
          <span>99.99%的操作工作及任务记录</span>
        </div>
        <div>
          <span>全面支持ERP系统审计</span>
        </div>
      </div>
    </div>
    <div class="nc-hr-middle">
      <div>
        <Button >查询</Button>
        <Button style="border-left: none;" @click="exportOrPrint('1')">导出</Button>
        <Button style="border-left: none;" @click="exportOrPrint('0')">打印</Button>
        <Button style="border-left: none;" >退出</Button>
      </div>
      <div>

      </div>
      <div>
        <Select  v-model:value="searchCondition.requirement" style="width: 120px;">
          <SelectOption v-for="it in CrudApi.columns" :value="it.dataIndex">{{it.title}}</SelectOption>
        </Select>
        <InputSearch placeholder="" v-model:value="searchCondition.value" @search="onSearch"  style="width: 200px; border-radius: 4px;border-color: #c9c9c9;margin-right: 1em;"/>
        <Button @click="reload()">
          <SyncOutlined :style="{ fontSize: '14px' }"/>
        </Button>
        <Popover placement="bottom">
          <template #content>
            <Popconfirm
              ok-text="保存"
              cancel-text="关闭"
              @confirm="confirm"
              @cancel="cancel">
              <template #icon><b>栏目设置</b><br></template>
              <template #title>
                <div style="width: 640px">
                  <Table bordered :data-source="dynamicColumnData" :columns="dynamicColumns"
                           childrenColumnName="children" :pagination="false" style="max-height: 500px;overflow-y: auto" class="lanmu-table">
                    <template #checkBox="{ text, record }">
                      <Checkbox v-model:checked="record.check" :disabled="record.isFixed"/>
                    </template>
                    <template #widthInput="{ text, record }">
                      <div class="editable-cell">
                        <div v-if="editableData[record.key]" class="editable-cell-input-wrapper">
                          <Input type="number" v-model:value="editableData[record.key].width"
                                   @pressEnter="save(record.key,record.min,record.max)"
                                   style="width: 80px"/>
                          <CheckOutlined class="editable-cell-icon-check"
                                          @click="save(record.key,record.min,record.max)"/>
                        </div>
                        <div v-else class="editable-cell-text-wrapper">
                          {{ text || ' ' }}
                          <EditOutlined class="editable-cell-icon" @click="edit(record.key)"/>
                          <span style="float: right;">{{ record.min + '~' + record.max }}</span>
                        </div>
                      </div>
                    </template>
                    <template #nameInput="{ text, record }">
                      <div class="editable-cell">
                        <div v-if="editableData[record.key]" class="editable-cell-input-wrapper">
                          <a-input type="text" v-model:value="editableData[record.key].nameNew"
                                   @pressEnter="saveName(record.key)" style="width: 100px"/>
                          <CheckOutlined class="editable-cell-icon-check"
                                          @click="saveName(record.key)"/>
                        </div>
                        <div v-else class="editable-cell-text-wrapper">
                          {{ text || ' ' }}
                          <EditOutlined class="editable-cell-icon" @click="edit(record.key)"/>
                        </div>
                      </div>
                    </template>
                    <template #alignRadio="{ text, record }">
                      <RadioGroup default-value="a" size="small" v-model:value="record.align"
                                     :disabled="record.align==''">
                        <RadioButton value="left">
                          左
                        </RadioButton>
                        <RadioButton value="center">
                          中
                        </RadioButton>
                        <RadioButton value="right">
                          右
                        </RadioButton>
                      </RadioGroup>
                    </template>
                  </Table>
                </div>
              </template>
              <Button style="width: 120px;margin-bottom: 2px">栏目设置</Button>
            </Popconfirm>
            <br/>
            <span class="group-btn-span-special2" @click="showRulesSize = 'MAX'"
                  :style="showRulesSize==='MAX'?{backgroundColor: '#0096c7',color: 'white'}:''">
                <SortDescendingOutlined/>&nbsp;大号字体&ensp;<CheckOutlined
              v-if="showRulesSize==='MAX'"/></span><br/>
            <span class="group-btn-span-special2" @click="showRulesSize = 'MIN'"
                  :style="showRulesSize==='MIN'?{backgroundColor: '#0096c7',color: 'white'}:''">
                <SortAscendingOutlined/>&nbsp;小号字体&ensp;<CheckOutlined
              v-if="showRulesSize==='MIN'"/></span>
          </template>
          <Button>
            <SettingFilled :style="{ fontSize: '14px' }"/>
          </Button>
        </Popover>
        <Button>
          <FilterFilled :style="{ fontSize: '14px' }" @click="showTree= !showTree"/>
        </Button>
      </div>
    </div>
    <div class="nc-hrm-body">
      <LogDateTree v-show="showTree" @select="treeFilter"/>
      <div style="display: inline-block;height: 100%; float: left;" :style="showTree?{width: 'calc(100% - 202px)',marginLeft: '5px'}:{width: '99.8%'}">
        <BasicTable
        :loading="loadMark"
        ref="tableRef"
        :row-selection="{ type: 'checkbox',fixed: true, selectedRowKeys: tableSelectedRowKeys, onSelect: onSelectChange,onSelectAll: onSelectChange2 }"
        :scroll="{ x: totalColumnWidth,y: windowHeight }"
        class="alone-basic-table"
        :class="showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
        @register="registerTable"
        size="small"
      >
      </BasicTable>
      </div>
    </div>
  </div>
</template>`column.slots` is deprecated. Please use `v-slot:headerCell` `v-slot:bodyCell` instead
<script setup lang="ts">
import {UnlockFilled,SyncOutlined,FilterFilled,CheckOutlined,EditOutlined,SortDescendingOutlined,SortAscendingOutlined,SettingFilled} from '@ant-design/icons-vue';
import {Input, Select, Button, Table,Radio,Avatar, Steps, Rate,Checkbox,Popconfirm,Popover, message} from "ant-design-vue";
import {onMounted, reactive, ref} from "vue";
const Step = Steps.Step
const InputSearch = Input.Search
const SelectOption = Select.Option
const RadioGroup = Radio.Group
const RadioButton = Radio.Button
const props = defineProps(['modelValue'])
const windowHeight = (window.innerHeight - 380 )
/*列表逻辑*/
import {BasicTable, useTable} from '/@/components/Table'
const {createErrorModal, createSuccessModal, createConfirm,createWarningModal} = useMessage()
import {useMessage} from "/@/hooks/web/useMessage";
import LogDateTree from "/@/views/dashboard/analysis/components/new/etc-components/LogDateTree.vue";
import {findCondition} from "/@/api/record/system/group-sys-login-log";
import {getCurrentAccountName, hasBlank} from "/@/api/task-api/tast-bus-api";
import {assemblyDynamicColumn, initDynamics} from "./ts/data";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {findDbLanMuList, saveLanMuList} from "/@/api/record/system/accvoucher";
import {cloneDeep} from "lodash-es";
// import {
//   aoaToSheetXlsx
// } from "/@/views/boozsoft/xian_jin_liu_liang/yin_hang_dui_zhang/yin_hang_dui_zhang_dan/excel/components/importexcel";
const aoaToSheetXlsx=null
import {DateTool} from "/@/api/task-api/tools/universal-tools";
import {useNewPrint} from "/@/utils/boozsoft/print/print";
import {tableStyle} from "/@/store/modules/abc-print";
const loadMark = ref(false)
const rateValue = ref(4)
const showRulesSize = ref('MIN')
const totalColumnWidth = ref(0)
const tableSelectedRowKeys =ref([])
const tableSelectedRowObjs =ref([])
const searchCondition = reactive({requirement: 'userName', value: ''})
const showTree = ref(true)
const CrudApi = {
  list: findCondition, //getTaskList
  columns: [
    {
      title: '账套名称',
      dataIndex: 'stockAccName',
      ellipsis: true,
    },
    {
      title: '操作时间',
      dataIndex: 'loginTime',
      ellipsis: true,
    },
    {
      title: '操作员账号',
      dataIndex: 'userId',
      ellipsis: true
    },
    {
      title: '操作员名称',
      dataIndex: 'userName',
      ellipsis: true,
    },
    {
      title: '模块',
      dataIndex: 'optModule',
      ellipsis: true,format: (t)=>moduleForMat(t)
    },
    {
      title: '功能',
      dataIndex: 'optFunction',
      ellipsis: true,
    },
    {
      title: '动作',
      dataIndex: 'optAction',
      ellipsis: true,
    },
    {
      title: '操作内容',
      dataIndex: 'optContent',
      ellipsis: true,
    },
    {
      title: '浏览器信息',
      dataIndex: 'browserinfo',
      ellipsis: true,
    },
    {
      title: '操作系统信息',
      dataIndex: 'osInfo',
      ellipsis: true,
    },
    {
      title: '客户端主机名称',
      dataIndex: 'clientName',
      ellipsis: true,
    }, {
      title: '客户端IP',
      dataIndex: 'clientIp',
      ellipsis: true,
    }
]
}
const queryParameter = reactive({
  date: ''
})
onMounted(()=>resetDynamicColumnData())
// 这是示例组件
const [registerTable, { reload,getDataSource,setTableData,setColumns,getColumns }] = useTable({
  api: CrudApi.list,
  columns: CrudApi.columns,
  bordered: true,
  showIndexColumn: true,
  pagination: {
    pageSize: 200,
    showSizeChanger: true,
    pageSizeOptions: ['200', '500', '1000', '1500'],
    showTotal: t => `总共${t}条数据`
  },
  searchInfo: queryParameter
})

const onSelectChange = (selectedRowKeys, obj) => {
    tableSelectedRowObjs.value = obj;
    tableSelectedRowKeys.value = selectedRowKeys;
};
const onSelectChange2 = (selectedRowKeys, obj) => {
  tableSelectedRowObjs.value = obj;
  tableSelectedRowKeys.value = selectedRowKeys;
};
const treeFilter = async (e) => {
  queryParameter.date = e.date
  await reload()
}
let searchDataSource = []

function onSearch() {
  if (searchDataSource.length == 0) searchDataSource = getDataSource()
  if (hasBlank(searchCondition.value.trim())) {
    setTableData(searchDataSource)
  } else {
    let searchAfter = searchDataSource.filter(item => hasBlank(item[searchCondition.requirement]) ? false : item[searchCondition.requirement].indexOf(searchCondition.value.trim()) != -1)
    setTableData(searchAfter)
  }
}
const moduleForMat = (v) => {
  let text = ''
  switch (v) {
    case 'group':
      text = '集团'
      break;
    case 'org':
      text = '组织'
      break;
    case 'master_data':
      text = '主数据'
      break;
    case 'gl':
      text = '总账'
      break;
    case 'cashier':
      text = '现金银行'
      break;
    case 'stock':
      text = '存货管理'
      break;
    case 'fa':
      text = '固定资产'
      break;
    case 'bb':
      text = '报表中心'
      break;
    default:
      text = v
      break;
  }
  return text
}
/*列表逻辑*/
/****栏目设置****/
const windowWidth = (document.documentElement.clientWidth - (70 /*+ 280*/))
const dynamicColumns = initDynamics().DEFAULT
const dynamicColumnData: any = ref([])
let dynamicColumnDataCopy = []
const editableData = reactive({});
const tableRef: any = ref(null)
const lanMuData = {
  'accId': 'postgres',
  'menuName': '操作日志',
  'type': '列表',
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
    let arr: any = key.split('-');
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
    let arr: any = key.split('-');
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
  /*let a: any = []
  a = getColumns()
  let last = a.pop()*/
  let newA = JSON.parse(JSON.stringify(CrudApi.columns))
  newA = assemblyDynamicColumn(dynamicColumnData.value, newA)
  // newA.push(last)
  newA = newA.map(it=>{if (it.title == '模块')it.format =(t)=>moduleForMat(t);return it})
  setColumns(newA)
  initTableWidth(newA)
  //searchConditonList.value = newA
}

function resetDynamicColumnData() {
  // 先从数据查询是否已经设置
  lanMuData.accId = getCurrentAccountName(false)
  findDbLanMuList(lanMuData).then(res => {
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
  // debugger
  if (total > windowWidth) {
    let f = 0
    totalColumnWidth.value = Number(windowWidth) - f
    tableRef.value.$el.style.setProperty('width', (windowWidth + 70 - f) + 'px')
  } else {
    if ((windowWidth - 260) < total) total -= (total - (windowWidth - 260))
    totalColumnWidth.value = total
    tableRef.value.$el.style.setProperty('width', (total + 70) + 'px')
  }
}
/****栏目设置****/
/***** 打印or导出 *****/
function exportOrPrint(t) {
  let keys = CrudApi.columns.map(it => it.dataIndex)
  let titleList = CrudApi.columns.map(it => it.title)
  let dataList =  getDataSource().map((item) => keys.map(column =>{
    if (column == 'loginTime' || column == 'optModule'){
      return column == 'loginTime'?item[column].substring(10,20):moduleForMat(item[column])
    }else {
      return item[column]
    }
  }));
  if (dataList.length == 0 ){
    createWarningModal({title: '温馨提示', content: '暂未发现可进行'+(t == '1'?'导出':'打印')+'的数据！'})
    return false;
  }
  let  date = queryParameter.date || DateTool().nowDate()
  if (t == '1'){
    aoaToSheetXlsx({
      data: dataList,
      header: titleList,
      filename:  `${date}_NC操作日志.xlsx`,
    });
  }else {
    let page = Math.ceil(dataList.length  / 16)
    useNewPrint({data: ['l', 'px', 'a4', false]}, (doc) => {
      doc.autoTable({
        head: [['NC操作日志','', '','', '','','','', '', '',''],
          ['日期：'+date, '', '', '','','', '', '','', '',''],
          titleList],
        body: dataList,
        styles: tableStyle(),
        margin: {
          left: 20,
          top: 10,
        },
        addPageContent: (data) => {
          data.doc.setFontSize(9)
          doc.autoTableText(
            '第'+data.doc.getCurrentPageInfo().pageNumber+'页/共'+page+'页',
            data.cursor.x - 40,
            32,
            0
          );
        },
        didParseCell(data) {
          data.cell.styles.cellPadding = {top: 3, left: 2, right: 2, bottom: 2}
          data.cell.styles.fillColor = [255, 255, 255]
          data.cell.styles.lineColor = [150, 150, 150]
          // data.cell.styles.bold = false
          //data.cell.styles.fontStyle = 'bold'

          if (data.section == 'head' && data.row.index == 0) {
            data.cell.styles.fontSize = 16
            data.cell.styles.fontStyle = 'bold'
            data.cell.styles.lineColor = [255, 255, 255]
            if (data.column.index == 0) {
              data.cell.colSpan = 11
              data.cell.styles.halign = 'center'
            }
          }
          if (data.section == 'head' && data.row.index == 1) {
            data.cell.styles.fontSize = 9
            data.cell.styles.fontStyle = 'bold'
            data.cell.styles.lineColor = [255, 255, 255]
            data.cell.colSpan = 5
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
            data.cell.styles.fontSize = 8
            if (data.row.index%2==1) {
              data.cell.styles.fillColor = [240,240,240]
            }
          }
        },
        columnStyles: {
          0: {cellWidth: 40, halign: 'center'},
          1: {cellWidth: 50, halign: 'left'},
          2: {cellWidth: 50, halign: 'left'},
          3: {cellWidth: 40, halign: 'center'},
          4: {cellWidth: 50, halign: 'left'},
          5: {cellWidth: 20, halign: 'center'},
          6: {cellWidth: 155, halign: 'left'},
          7: {cellWidth: 45, halign: 'left'},
          8: {cellWidth: 50, halign: 'left'},
          9: {cellWidth: 55, halign: 'left'},
          10:{cellWidth: 40, halign: 'center'}
        }
      })
    })
  }
}
/***** 打印or导出 *****/
</script>
<style lang="less" scoped>
.nc-hr {
  .nc-hr-top {
    font-weight: bold;
    color: white;
    height: 120px;
    width: 100%;
    background-color: #146dc1;
    display: inline-flex;
    justify-content: space-between;
    padding: 1.2% 5%;

    > div {
      display: inline-flex;
      justify-content: space-between;
    }

    .nc-hr-top-left {
      width: 250px;

      > div:nth-of-type(1) {
        width: 80px;
        height: 80px;
        border-radius: 50%;

        .ant-avatar {
          background-color: white;
        }
      }

      > div:nth-of-type(2) {
        padding:3% 5%;

        span:nth-of-type(2) {
          font-size: 22px;
        }
      }
    }

    .nc-hr-top-right {
      width: 360px;
      padding: 1% 0;

      > div:nth-of-type(1) {
        text-align: center;
        > span {
          font-size: 13px;
        }
      }

      > div:nth-of-type(2) {
        width: 180px;
        background-color: white;
        height: 50px;
        line-height: 50px;
        border-radius: 5px;
        text-align: center;
        cursor: pointer;
        color: #146dc1;

        > span {
          font-size: 13px;
        }
      }

      > div:nth-of-type(2):hover {
        background-color: #f1f1f1;
        color: rebeccapurple;
      }
    }
  }

  .nc-hr-middle {
    height: 50px;
    margin: .5% 0;
    line-height: 40px;
    background-color: #f1f1f1;
    padding: 5px;
    display: flex;
    justify-content: space-between;

    >div:nth-of-type(1){
      width: 20%;
      min-width: 254px;
      text-align: center;
    }
    >div:nth-of-type(2){
      >span{
        color: red;
      }

    }
    :deep(.ant-select-selector){
      border: 1px solid #c9c9c9;
    }
    .ant-btn{
      border-color: #c9c9c9
    }

  }
  .nc-hrm-body {
  }
}
.group-btn-span-special2 {
  font-size: 14px;
  display: inline-block;
  width: 120px;
  padding: 5px 10%;
}

.group-btn-span-special2:hover {
  cursor: pointer;
}
.lanmu-table{
  :deep(.ant-table-content){
    .ant-table-thead{
      tr{
        th{
          padding: 5px 8px !important;
          text-align: center !important;
          font-weight: bold;
          background-color: #f1f1f1 !important;
          font-size: 13px !important;
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
</style>
<style src="../../../../../assets/styles/alone-basic-table.less" lang="less" scoped></style>
<!--<style scoped>
.a-table-font-size-16 :deep(td), .a-table-font-size-16 :deep(th) {
  font-size: 16px !important;
  padding: 5px 8px !important;
}

.a-table-font-size-16 :deep(th), .a-table-font-size-12 :deep(th) {
  text-align: center !important;
  font-weight: bold;
  background-color: #f1f1f1;
}

.a-table-font-size-12 :deep(td), .a-table-font-size-12 :deep(th) {
  font-size: 14px !important;
  padding: 2px 8px !important;
}
</style>-->
