<template>
  <div>
    <div class="app-container lcr-theme-div">
      <div>
        <div>
          <SettingFilled style="color: #0096c7;font-size: 50px;"/>
        </div>
        <div>
          <AccountPicker theme="three"  @reloadTable="dynamicAdReload"/>
        </div>
      </div>
      <div>
        <b class="noneSpan" style="font-size: 26px;color: #0096c7;">{{titleValue}}打印模板</b>
      </div>
      <div>
        <div>
          <template v-if="status == 3">
            <button type="button" class="ant-btn ant-btn-me" @click="previewStencil"><span>预览</span></button>
          </template>
          <template v-if="status == 3">
            <button type="button" class="ant-btn ant-btn-me" @click="startOperate('edit')"><span>修改</span></button>
          </template>
          <template v-if="status == 2">
            <button type="button" class="ant-btn ant-btn-me"  @click="startOperate('modify')"><span>保存</span></button>
            <button type="button" class="ant-btn ant-btn-me"  @click="startOperate('give')"><span>放弃</span></button>
            <button type="button" class="ant-btn ant-btn-me"  @click="startOperate('add')"><span>增行</span></button>
            <button type="button" class="ant-btn ant-btn-me"  @click="startOperate('del')"><span>删行</span></button>
          </template>
          <button type="button" class="ant-btn ant-btn-me" ><span>导入</span></button>
          <button type="button" class="ant-btn ant-btn-me" ><span>导出</span></button>
          <button type="button" class="ant-btn ant-btn-me" @click="closeCurrent()"><span>退出</span></button>
        </div>
        <div class="acttd-right-d-search">
          <div>
            <Select v-model:value="formItems.selectType" class="acttdrd-search-select">
              <SelectOption style="font-size: 12px;" value="cvencodeJsCode">栏目名称</SelectOption>
            </Select>
            <InputSearch
              class="acttdrd-search-input"
              @search="onSearch"/>
          </div>
          <div>
            <Button @click="reloadTable()">
              <SyncOutlined :style="{ fontSize: '14px' }"/>
            </Button>
            <Popover class="ant-btn-default" placement="bottom">
              <template #content>
                <a-popconfirm
                  ok-text="确定"
                  cancel-text="放弃"
                  @confirm="confirm"
                  @cancel="cancel">
                  <template #icon><b>栏目设置</b><br></template>
                  <template #title>
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
                            <span style="float: right;">{{ record.min  + '~' + record.max }}</span>
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
          </div>
        </div>
      </div>
    </div>
    <div class="app-container">
      <LeftTree v-if="showTree"  @select="treeFilter" @save="treeOperate" />
      <div style="display: inline-block;height: 100%; float: left;margin-left: 5px;"
           :style="showTree?{width: 'calc(100% - 255px)'}:{width: '99.8%'}">
        <BasicTable
                ref="tableRef"
                :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
                :row-selection="{ type: 'checkbox',fixed: true, selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
                @register="registerTable"
                :dataSource="tableData"
                :clickToRowSelect="false"
                :scroll="{ x: totalColumnWidth,y: windowHeight }"
                :loading="loadMark"
        >
          <template #systemName="{ record }">
            <span v-if="status == 3">{{record.systemName}}</span>
            <Select v-else v-model:value="record.systemName" style="width: 100%;" @change="systemChange(record)" :options="systemColumns" />
          </template>
          <template #printName="{ record }">
            <span v-if="status == 3">{{record.printName}}</span>
            <Input v-else v-model:value="record.printName" />
          </template>
          <template #alignWay="{ record }">
            <ARadioGroup v-model:value="record.alignWay" size="small" :disabled="status == 3">
              <ARadioButton value="left">居左</ARadioButton>
              <ARadioButton value="center">居中</ARadioButton>
              <ARadioButton value="right">居右</ARadioButton>
            </ARadioGroup>
          </template>
          <template #printWidth="{ record }">
            <span v-if="status == 3">{{record.printWidth}}</span>
            <InputNumber v-else v-model:value="record.printWidth" />
          </template>
          <template #fontSize="{ record }">
            <span v-if="status == 3">{{record.fontSize}}</span>
            <InputNumber v-else v-model:value="record.fontSize" />
          </template>
          <template #propertyName="{ record }">{{record.propertyName}}</template>
          <template #belongArea="{ record }">{{record.belongArea=='0'?'标题':record.belongArea=='1'?'表头':record.belongArea=='2'?'表体':'表尾'}}</template>
          <template #isPrint="{ record }">
            <Switch v-model:checked="record.isPrint" checked-children="是" un-checked-children="否" :disabled="status == 3"/>
          </template>
          <template #action="{ record }">
            <div>
              <a-button size="small" :disabled="status==3 || pageParameter.type == '0'" @click="move(record,'up')">
                <VerticalAlignTopOutlined />
              </a-button>
              <a-button size="small"  :disabled="status==3 || pageParameter.type == '0'" @click="move(record,'down')">
              <VerticalAlignBottomOutlined />
              </a-button>
            </div>
          </template>
        </BasicTable>
        <Save @save="treeSave" @register="registerSavePage"/>
      </div>
    </div>
  </div>
</template>
<script setup="props, {emit}" lang="ts">
import {BasicTable, useTable} from '/@/components/Table'
import {onMounted, provide, reactive, ref} from 'vue'
import {
    CheckOutlined,
    SortAscendingOutlined,
    SortDescendingOutlined,
    SyncOutlined,SettingFilled,VerticalAlignTopOutlined,VerticalAlignBottomOutlined,EditOutlined
} from '@ant-design/icons-vue'
import {
  Button,
  Checkbox as ACheckbox,
  Input,InputNumber,
  message,
  Popconfirm as APopconfirm,
  Popover,
  Radio as ARadio,
  Select,
  Table as ATable,Switch
} from 'ant-design-vue'
import {useMessage} from "/@/hooks/web/useMessage";
import { hasBlank} from "/@/api/task-api/tast-bus-api";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
/**********************明细栏目设置**********************/
import {assemblyDynamicColumn, getTablePropertys, initDynamics} from "./data";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {findStockDbLanMuList, saveStockLanMuList} from "/@/api/record/system/stock-column-view-settings";
import {cloneDeep} from "lodash-es";
import {DateTool, JsonTool, ObjTool} from "/@/api/task-api/tools/universal-tools";
import LeftTree from "./popup/LeftTree.vue";
import {
  copyTree,
  findTable,
  findTree,
  initDefault,
  delTree, modifyTable, findStencil,
} from "/@/api/record/stock/stock-template";
import {getTempProperty} from "/@/views/boozsoft/stock/stock-print-template/default";
import {useModal} from "/@/components/Modal";
import Save from "./popup/save.vue";
import {useRoute} from "vue-router";
import {dataModelBuildingTwoData} from "/@/views/boozsoft/stock/stock_sales_add/popup/ts/printData";
import {
  getPrintStencilParameter
} from "/@/views/boozsoft/stock/stock_sales_add/popup/ts/printTemplate";
import {useNewPrint} from "/@/utils/boozsoft/print/print";
const InputSearch = Input.Search
const SelectOption = Select.Option
const ARadioButton = ARadio.Button
const ARadioGroup = ARadio.Group

const {
    createSuccessModal,
    createErrorModal,
    createWarningModal,
    createConfirm
} = useMessage()

const {closeCurrent} = useTabs(router);

const formItems = ref({
  selectType: 'cvencodeJsCode'
})
const showTree = ref(false)
const treeFilter = (obj) => {
  if (null != obj && obj != 'all' && obj.indexOf('-') != -1 && obj != pageParameter.selectValue){
    pageParameter.selectValue = obj
    pageParameter.type = obj.split('-')[1]
    reloadTable()
  }
}

const dynamicTenantId = ref('')
const titleValue = ref('销货单')

const tableData:any = ref([]);
const tableDataAll:any = ref([]);
const loadMark = ref(false)
async function reloadTable(){
  loadMark.value = true
  tableDataAll.value = (await useRouteApi(findTable,{schemaName: dynamicTenantId})(pageParameter)).map(it=>{it.isPrint = (it.isPrint == 'true');return it})
  tableData.value =JsonTool.parseProxy(tableDataAll.value)
  await setPagination({
    total: tableData.value.length
  })
  loadMark.value = false
}
const status = ref(3)
const pageParameter: any = reactive({
  queryMark: '1',
  showRulesSize: 'MIN',
  selectValue: '',
  type: '',
})

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
  columns: getTablePropertys(pageParameter.queryMark),
  bordered: true,
  showIndexColumn: true,
  pagination: {
    pageSize: 50,
    showSizeChanger: true,
    pageSizeOptions: ['10', '25', '50', '100'],
    showTotal: t => `总共${t}条数据`
  },
  actionColumn: {
    width: 120,
    title: '操作',
    dataIndex: 'action',
    slots: {customRender: 'action'}
  }
})

//选中内容
const state = reactive<{
    selectedRowKeys: [];
    loading: boolean;
}>({
    selectedRowKeys: [], // Check here to configure the default column
    loading: true,
});
const checkRow: any = ref([])
const onSelectChange = (selectedRowKeys, row) => {
  if (status.value !=3){
    state.selectedRowKeys = selectedRowKeys;
    checkRow.value = row
  }
};



function onSearch(v) {
  let list = JsonTool.parseProxy( tableDataAll.value.filter(item => item[formItems.value.selectType].indexOf(v) != -1))
  setTableData()
  tableData.value = list
  setPagination({total: list.length})
}

/*start栏目设置*/
const visible = ref(false);
const windowWidth = (window.innerWidth)
const windowHeight = (window.innerHeight - (335) )
const totalColumnWidth = ref(0)
const dynamicColumns = initDynamics().DEFAULT
const dynamicColumnData: any = ref([])
let dynamicColumnDataCopy = []
const editableData = reactive({});
const tableRef: any = ref(null)
const lanMuData = {
  'accId': '',
  'menuName': '打印模板',
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
  let newA = JSON.parse(JSON.stringify(getTablePropertys(pageParameter.queryMark)))
  newA = assemblyDynamicColumn(dynamicColumnData.value, newA)
  setColumns(newA)
  initTableWidth(newA)
  //searchConditonList.value = newA
}

function resetDynamicColumnData() {
  // 先从数据查询是否已经设置
  lanMuData.type = pageParameter.queryMark
  findStockDbLanMuList(lanMuData).then(res => {
    // 栏目列
    let dbList = res.items
      let statiList = initDynamics()[ pageParameter.queryMark]
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
  })
}

function initTableWidth(thisCs) {
  let total = 60 + 120
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
/*明细栏目设置end*/
let dyMark = 0
const treeList = ref([])
const pathMark = ref('xs-arrive')
const systemColumns =ref( [{value: '文本',label: '文本',property: 'text'}])
const route = useRoute();
const routeData:any = route.query;
const dynamicAdReload = async (obj) => {
  dynamicTenantId.value = obj.accountMode
  lanMuData.accId = obj.accId
  dyMark+=1
  if (dyMark != 2){
    resetDynamicColumnData()
    // 判断当前账套是否存在系统默认模板
    if(routeData.name!==undefined){
      titleValue.value = routeData.name
      pathMark.value = routeData.mark
    }
    await checkLeftData()
  }
}
const checkLeftData = async () => {
  // 查询左侧树
   let res = await useRouteApi(findTree,{schemaName: dynamicTenantId})({belong:pathMark.value})
   if (null != res && res.length==0) // 初始化默认模板
     res = await useRouteApi(initDefault,{schemaName: dynamicTenantId})({json:getTempProperty(pathMark.value)})
   showTree.value = true
   treeList.value = res
}
const treeOperate = (v) => {
  if (v == 'add' && treeList.value.length > 0){
    openSave()
  }else if (v == 'del' && pageParameter.selectValue != 'all'){
      let id = pageParameter.selectValue.indexOf('-') != -1? pageParameter.selectValue.split('-')[0]:pageParameter.selectValue
      let o = treeList.value.filter(it=>it.id==id)[0]
      if (o.templateType == '0'){
        createWarningModal({title:'温馨提示',content: '系统模板不能进行删除操作！'})
        return false
      }else {
        createConfirm({
          iconType: 'warning',
          title: '温馨提示',
          content: '您确定要删除模板【'+treeList.value.filter(it=>it.id==id)[0]?.templateName+'】吗?删除后无法恢复！',
          onOk: async () => {
            let a = await useRouteApi(delTree, {schemaName: dynamicTenantId.value})({id: id})
            message.success(`删除成功！`)
            pageReload()
          },
          onCancel: async () => {
          }
        });
      }
  }else {
    createWarningModal({title:'温馨提示',content: '请选择模板后再操作！'})
  }
}
const [registerSavePage, {openModal: openSavePage}] = useModal()
const openSave = () => {
  openSavePage(true, {
    data: {
      dynamicTenantId: dynamicTenantId.value,
    }
  })
}
const treeSave = async (e) => {
  let res = await useRouteApi(copyTree,{schemaName: dynamicTenantId})(e)
  message.success(`添加成功！`)
  pageReload()
}

const pageReload = async () => {
  showTree.value = false
  await checkLeftData()
}
const startOperate = async (v) => {
  let id = pageParameter.selectValue.indexOf('-') != -1? pageParameter.selectValue.split('-')[0]:pageParameter.selectValue
  if (v == 'edit'){
    if (treeList.value.filter(it=>it.id==id)[0].templateType == 0){
      createWarningModal({title:'温馨提示',content: '系统模板不能进行修改操作！'})
    }else {
      status.value = 2
    }
  }else if (v == 'modify'){
    // 保存
    let tList = getDataSource()
    if (tList.filter(it=> hasBlank(it.systemName) || hasBlank(it.printName) || hasBlank(it.printWidth)
      || hasBlank(it.fontSize) || hasBlank(it.belongArea) || hasBlank(it.propertyName)).length > 0){
      createWarningModal({title:'温馨提示',content: '请先完善插行内容！'})
    }
    if (tableDataAll.value.length != tList.length ||  tList.filter(it=>{
      let a = tableDataAll.value.filter(it2=>it2.id==it.id)[0]
      if (null == a || it.systemName.trim() != a.systemName.trim() || it.printName.trim() != a.printName.trim()
        || it.printWidth != a.printWidth || it.fontSize != a.fontSize || it.paintSort != a.paintSort || it.alignWay != a.alignWay || it.isPrint != a.isPrint
      ) return true;
      return  false;
    }).length > 0){
      let res = await useRouteApi(modifyTable,{schemaName: dynamicTenantId})({selectValue: pageParameter.selectValue,json: JsonTool.json(tList)})
      message.info('保存成功！')
      reloadTable()
      status.value = 3
    }else {
      createWarningModal({title:'温馨提示',content: '请先修改后再保存！'})
    }
  }else if (v == 'give'){
    reloadTable()
    status.value = 3
  }else if (v == 'add'){
    if (pageParameter.type == '0'){
      createWarningModal({title:'温馨提示',content: '标题行不能新增！'})
    }else {
      let tList = getDataSource();
      tList.push({alignWay:'center',printWidth: '15',fontSize: '10',belongArea: pageParameter.type})
      setTableData(tList)
    }
  }else if (v == 'del'){
    if (pageParameter.type == '0'){
      createWarningModal({title:'温馨提示',content: '标题不能进行删除！'})
    }else if (checkRow.value.length==0){
      createWarningModal({title:'温馨提示',content: '请选中要删行！'})
    }else {
      let keys = checkRow.value.map(it=>it.key)
      let tList = getDataSource().filter(it=>keys.indexOf(it.key)==-1);
      setTableData(tList)
    }
  }
}
let swapItems = (arr, index1, index2) => {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0];
   arr.forEach((v,i)=> v['paintSort'] = (i+1)) // 整理后台序号
  return arr;
};
const move = (e,action) => {
  state.selectedRowKeys = []
  checkRow.value = []
  let list =  getDataSource()
  let $index = list.findIndex(it=>it.key == e.key)
  if ((action=='up' && $index != 0)  || (action == 'down' &&  $index != (list.length-1)) ){
    list = swapItems(list, $index, action=='up'?($index - 1):($index + 1));
    setTableData(list)
  }
}
const systemChange = (e) => {
    e.propertyName =  systemColumns.value.filter(it=>it.value == e.systemName)[0]?.property
    e.printName =  systemColumns.value.filter(it=>it.value == e.systemName)[0]?.property
}


const previewStencil = async () => {
  if (hasBlank(pageParameter.selectValue)){
    createWarningModal({title:'温馨提示',content: '请先选择模板样式！'})
  }else {
    let arr =  pageParameter.selectValue.split('-')
    let tempList = await useRouteApi(findStencil, { schemaName: dynamicTenantId })({'selectValue': arr[0]})
    if (tempList == null || tempList.length == 0){
      createWarningModal({title:'温馨提示',content: '未找到相关模版，请先检查打印模版！'})
    }else {
      message.info('加载中。。。请稍后。。。！')
      let type = arr[1] == '2'?'a4p':arr[1] == '3'?'p2':arr[1] == '4'?'p3':'a4l'
      let maxRowLen = arr[1] == '2'?30:arr[1] == '3'?8:arr[1] == '4'?4:20
      let dateModel = dataModelBuildingTwoData([{}],{},maxRowLen,tempList)
      let {fx, size, fun} = getPrintStencilParameter(type,tempList)
      useNewPrint({data: [fx,  'mm', size,false]}, (doc) => {
        dateModel.forEach((printObj,index)=>{
          fun(doc, printObj, maxRowLen)
          if (index < (dateModel.length-1)) doc.addPage()
        })
      })
  }
 }
}

provide('treeList',treeList)
provide('pathMark',pathMark)
</script>
<style scoped lang="less">
@import "../../../../assets/styles/global-menu-index.less";
:deep(.ant-card-body) {
  padding: 16px;
  border-left: 2px solid rgb(1, 143, 251);
  box-shadow: rgb(72 113 140) -3px 1px 7px -1px;
}
.ant-btn-me {
  color: #0096c7;
}
.a-table-font-size-16 :deep(td),
.a-table-font-size-16 :deep(th) {
  font-size: 16px !important;
  padding: 5px 8px !important;
  border-color: #aaaaaa !important;
  font-weight: 550;
  height: 36px;
}

.a-table-font-size-12 :deep(td),
.a-table-font-size-12 :deep(th) {
  font-size: 13px !important;
  padding: 2px 8px !important;
  border-color: #aaaaaa !important;
  font-weight: 600;
  height: 27px;
}
:deep(.ant-table-measure-row){
  td{
    padding: 0 !important;
  }
}
.app-container:nth-of-type(1) {
  background-color: #f2f2f2;
  padding: 10px 5px;
  margin: 10px 10px 5px;
}

.app-container:nth-of-type(2) {
  padding: 0px;
  margin: 0px 10px;
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
  margin: 0!important;
}

:deep(.vben-basic-table){
  min-height: 500px;
  height: calc(100% - 160px);
  margin-bottom: 20px;
}

:deep(.ant-input),:deep(.ant-btn){
  border: 1px solid #c9c9c9;
}
:deep(.ant-select-selector){
  border: 1px solid #c4c4c4!important;
}
.lcr-theme-div{
  display: inline-flex;justify-content: space-between;width: 99%;height: 100px;
  >div:nth-of-type(1){
    width: 40%;

    >div:nth-of-type(1){width: 64px;display: inline-block;text-align: center;margin-top: 10px}
    >div:nth-of-type(2){
      width: calc( 100% - 64px);display: inline-block;vertical-align: text-bottom;
    }
  }
  >div:nth-of-type(2){
    width: 20%;text-align:center;    margin-top: 20px;
  }
  >div:nth-of-type(3){
    width: 40%;text-align: right;
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
      >div:nth-of-type(2){
        display: inline-flex;justify-content: space-between;margin-top: 15px;
      }
  }
}
.tableUStyle {
  color: #0096c9;
  text-decoration: none;
  cursor: pointer;
}

.tableUStyle:hover {
  color: black;
}

</style>
