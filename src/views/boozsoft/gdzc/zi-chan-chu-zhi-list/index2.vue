<template>
  <div class="app-container">
    <div class="app-container-top">
      <div class="app-container-top-one">
        <div class="act-one-d-left" style="width: 22%;"></div>
        <div class="act-one-d-title">
          <span class="acto-d-title-span">资产处置列表</span>
        </div>
        <div class="act-one-d-btn-group">
          <Button class="actod-btn" @click="toAddPage(null)">新增</Button>
          <Button class="actod-btn" @click="startDel">删除</Button>
          <Button class="actod-btn" @click="startReview">审核</button>
          <Button class="actod-btn"><span>导出</span></button>
          <Button class="actod-btn"><span>打印</span></button>
          <Button class="actod-btn actod-btn-last" @click="closeCurrent()">退出</Button>
        </div>
      </div>
      <div class="app-container-top-two">
        <div class="act-two-d-left">
          <AccountPicker theme="one" @reloadTable="pageReload2"/>
        </div>
        <div class="act-two-d-center">

        </div>
        <div class="act-two-d-right">
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
                             childrenColumnName="children" :pagination="false"
                             style="max-height: 500px;overflow-y: auto" class="lanmu-table">
                        <template #checkBox="{ text, record }">
                          <Checkbox v-model:checked="record.check" :disabled="record.isFixed"/>
                        </template>
                        <template #widthInput="{ text, record }">
                          <div class="editable-cell">
                            <div v-if="editableData[record.key]"
                                 class="editable-cell-input-wrapper">
                              <Input type="number" v-model:value="editableData[record.key].width"
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
                            <div v-if="editableData[record.key]"
                                 class="editable-cell-input-wrapper">
                              <Input type="text" v-model:value="editableData[record.key].nameNew"
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

              </template>
              <Button class="acttdrd-btn">
                <PicLeftOutlined :style="{ fontSize: '14px' }"/>
              </Button>
            </Popover>
          </div>
        </div>
      </div>
    </div>
    <div class="app-container-bottom" :style="{height: (windowHeight+60)+'px',marginTop: '5px'}">
      <!--  针对过滤框显示添加的内容高度  -->
      <VoucherTree v-show="showTree" :treeInterval="treeInterval" :database="manipulateDbName"
                   @select="treeFilter"/>
      <div style="display: inline-block;height: 100%; float: left;margin-left: 5px;"
           :style="showTree?{width: 'calc(100% - 185px)'}:{width: '99.8%'}">
        <BasicTable
          ref="tableRef"
          :loading="loadMark"
          :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
          :row-selection="{ type: 'radio',selectedRowKeys: tableSelectedRowKeys, onChange: onSelectChange }"
          :scroll="{ x: totalColumnWidth,y: (windowHeight - 15) }"
          :rowKey="r=>r.id"
          size="small"
          @change="pageChange"
          @register="registerTable"
        >
          <template #czId="{record,index }">
          <span class="tableUStyle"
                @click="toAddPage(record)">{{ record.czId }}</span>&ensp;
          </template>
          <template #czMethod="{record,index }">
            {{ formatUniqueChuZhi(record.czMethod) }}
          </template>
          <template #czDept="{record,index }">
            {{ formatUniqueCodeDept(record.czDept) }}
          </template>
          <template #czUser="{record,index }">
            {{ formatUniqueCodeUser(record.czUser) }}
          </template>
        </BasicTable>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {BasicTable, useTable} from '/@/components/Table'
import router from '/@/router';
import {usePingZhengFillinStoreWidthOut} from '/@/store/modules/boozsoft/pingzheng-fillin';
import {
  DatePicker as ADatePicker,
  Select,
  Input,
  Popover,
  Radio,
  Popconfirm,
  Table,
  Checkbox,
  message,
  Drawer, Collapse, Tooltip, Tag as ATag, Button
} from "ant-design-vue"

const ARangePicker = ADatePicker.RangePicker
const SelectOption = Select.Option
const InputSearch = Input.Search
const RadioGroup = Radio.Group
const RadioButton = Radio.Button
const CollapsePanel = Collapse.Panel;
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
  ExclamationCircleOutlined, FileSearchOutlined
} from '@ant-design/icons-vue';
import {
  findAllAccvoucher,
  findDbLanMuList,
  saveLanMuList,
} from '/@/api/record/system/accvoucher'
import {useAccvoucherStore} from '/@/store/modules/accvoucher'
import {onMounted, reactive, ref, computed} from "vue";
import {
  initDynamics,
  assemblyDynamicColumn,
  combineParameters,
} from "./data";
import {cloneDeep} from "lodash-es";
import {useMessage} from "/@/hooks/web/useMessage";
import {useUserStore, useUserStoreWidthOut} from "/@/store/modules/user";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useTabs} from "/@/hooks/web/useTabs";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-GDZC.vue";

const {closeCurrent} = useTabs(router);
const {createConfirm, createWarningModal} = useMessage();
// 全局常量
const accvoucherStore = useAccvoucherStore()
// 页面变量
const pageParameter = reactive({
  queryMark: '1',
  showRulesSize: 'MIN',
  searchConditon: {
    requirement: 'czId',
    value: '',
  },
  treeConditon: []
})
const val = ref({
  openOne: 0,
  total: 0
})
const tableMap = ref({})
const accIdList = ref({})

const userStore = useUserStore();
const visible = ref(false);
const IsTrue = ref(true);
const searchConditonList = ref([])
const lanMuData = {
  'accId': '',
  'menuName': '资产处置列表',
  'type': '',
  objects: '',
  username: useUserStoreWidthOut().getUserInfo.username
}
// 表格参数
const loadMark = ref(false)
const tableSelectedRowKeys = ref([])
const tableSelectedRowObjs = ref([])
const showTree = ref(true)
const windowWidth = computed(() => (document.documentElement.clientWidth - 70 - (showTree.value ? 190 : 0)))
const windowHeight = (window.innerHeight - 290)
const totalColumnWidth = ref(0)
const manipulateDbName = ref('')
const manipulateYear = ref('')
const treeInterval = ref([])
const collapseValue = ref(['1'])
const CrudApi = reactive({
  columns: [
    {
      title: '处置单号',
      dataIndex: 'czId',
      fixed: 'left',
      slots: {customRender: 'czId'}
    },
    {
      title: '处置日期',
      dataIndex: 'handleDate',
      className: 'a-table-font-arial'
    }, {
      title: '处置方式',
      dataIndex: 'czMethod',
      slots: {customRender: 'czMethod'}
    },  {
      title: '处置部门',
      dataIndex: 'czDept',
      slots: {customRender: 'czDept'}
    }, {
      title: '处置人',
      dataIndex: 'czUser',
      slots: {customRender: 'czUser'}
    },{
      title: '制单人',
      dataIndex: 'makerUsername',
      slots: {customRender: 'makerUsername'}
    }, {
      title: '审核人',
      dataIndex: 'verifyUsername',
      slots: {customRender: 'verifyUsername'}
    }, {
      title: '审核日期',
      dataIndex: 'verifyTime',
      className: 'a-table-font-arial'
    },

  ]
})
const tableRef = ref(null)
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

onMounted(async () => {
  treeInterval.value = ['2021-01-01', '2021-12-01']
})

const toAddPage = (o) => {
  if (null == o) {
    router.push({
      path: '/handle/zc-handle-add',
      query: {
        status: 1,
        code: managementCode.value,
        pId: ''
      },
    });
  } else {
    router.push({
      path: '/handle/zc-handle-add',
      query: {
        status: 3,
        code: managementCode.value,
        pId: o.czId
      },
    });
  }
}
const startDel = async () => {
  if (tableSelectedRowKeys.value.length == 0) {
    createWarningModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请至少选择一条资产！'
    })
  } else if (!hasBlank((getDataSource().filter(it => it.id == tableSelectedRowKeys.value[0]))[0].verifyUsername)) {
    createWarningModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '固定资产账该月已结账或处置单已审核不能删除！'
    })
  } else {
    createConfirm({
      iconType: 'warning',
      title: '处置单删除',
      content: '您确定要进行处置单删除吗!',
      onOk: async () => {
        await useRouteApi(delChuZhi, {schemaName: manipulateDbName.value})({id: tableSelectedRowKeys.value[0]})
        message.success('删除成功！')
        await pageReload()
      }
    });
  }
}


const startReview = async () => {
  if (tableSelectedRowKeys.value.length == 0) {
    createWarningModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请至少选择一条资产！'
    })
  } else {
    let a = useUserStoreWidthOut().getUserInfo.username
    if (!hasBlank(a) && !hasBlank(tableSelectedRowKeys.value[0])) {
      await useRouteApi(reviewChuZhi, {schemaName: manipulateDbName.value})({
        id: tableSelectedRowKeys.value[0],
        verifyUsername: a
      })
      message.success('审核成功！')
      await pageReload()
    } else {
      if (hasBlank(a)) message.error('获取用户信息异常！')
    }
  }

}
const onSelectChange = (selectedRowKeys, obj) => {
  tableSelectedRowKeys.value = selectedRowKeys;
  tableSelectedRowObjs.value = obj;
};
const currentTableDatasource = ref([])
const faAccountList = ref([])

const pageReload = async (currentPageNum) => {
  let data = {
    yearMonth: manipulateYear.value + '-',
    condition: ObjTool.dels(JsonTool.parseProxy(pageParameter), ['queryMark', 'showRulesSize']),
    code: managementCode.value
  }
  data.page = null == currentPageNum ? getPaginationRef().current : currentPageNum
  data.size = getPaginationRef().pageSize
  let res = await useRouteApi(findFaPanDianListByCondition, {schemaName: manipulateDbName.value})(data)
  setTableData([])
  if (res != null && res.items.length > 0) {
    loadMark.value = true
    // 清空可能残留的数据
    currentTableDatasource.value = res.items
    setTableData(res.items)
    // 底部分页信息
    setPagination({total: res.total})
  }
  loadMark.value = false
}

const pageReload2 = async (obj) => {
  manipulateDbName.value = obj.accountMode
  manipulateYear.value = obj.managementYear
  managementCode.value = obj.managementCode
  if (managementCode.value == '') {
    message.warning('请先建立资产账后进行操作！')
  }else {
    loadMark.value = true
    resetDynamicColumnData()
    reloadList()
  }
}

const assetTypeList = ref([])
const usageStatusList = ref([])
const psnList = ref([])
const deptList = ref([])
const proList = ref([])
const locationList = ref([])
const minusList = ref([])

async function reloadList() {
  assetTypeList.value = await useRouteApi(findFaAssetTypeByFlagAndBend, {schemaName: manipulateDbName.value})({})
  usageStatusList.value = await useRouteApi(findFaUsageStatusByFlagAndBend, {schemaName: manipulateDbName.value})({})
  psnList.value = await useRouteApi(psnFindByFlag, {schemaName: manipulateDbName.value})({})
  deptList.value = await useRouteApi(findDeptAll, {schemaName: manipulateDbName.value})({});
  locationList.value = await useRouteApi(findLocationByFlagAndBend, {schemaName: manipulateDbName.value})({})
  minusList.value = (await useRouteApi(getCutModeAllList, {schemaName: manipulateDbName.value})({})).filter(it => it.isAccrual == '2' && it.bend == '1')
}

function getCurrRangeText(v, values) {
  let str = 'all'
  switch (v) {
    case '1':
      assetTypeList.value.forEach(it => {
        if (values.indexOf(it.uniqueCode) != -1) str += (it.ecName + ',')
      })
      break
    case '2':
      deptList.value.forEach(it => {
        if (values.indexOf(it.uniqueCode) != -1) str += (it.ecName + ',')
      })
      break
    case '3':
      proList.value.forEach(it => {
        if (values.indexOf(it.uniqueCode) != -1) str += (it.ecName + ',')
      })
      break
    case '4':
      psnList.value.forEach(it => {
        if (values.indexOf(it.uniqueCode) != -1) str += (it.ecName + ',')
      })
      break
    case '5':
      locationList.value.forEach(it => {
        if (values.indexOf(it.uniqueCode) != -1) str += (it.ecName + ',')
      })
      break
    case '6':
      usageStatusList.value.forEach(it => {
        if (values.indexOf(it.uniqueCode) != -1) str += (it.ecName + ',')
      })
      break
  }
  return str == 'all' ? '全部' : str.substring(0, str.length - 1)
}

function formatUniqueCodeDept(uniqueCodeDept: any) {
  let str = uniqueCodeDept
  deptList.value.forEach(
    function (dept: any) {
      if (dept.uniqueCode == uniqueCodeDept) {
        str = dept.deptName
      }
    }
  )
  return str
}

function formatUniqueCodeUser(uniqueCodeUser) {
  let str = uniqueCodeUser
  psnList.value.forEach(
    function (psn: any) {
      if (psn.id == uniqueCodeUser) {
        str = psn.psnName
      }
    }
  )
  return str
}
function formatUniqueChuZhi(uniqueCodeUser) {
  let str = uniqueCodeUser
  minusList.value.forEach(
    function (psn: any) {
      if (psn.uniqueCode == uniqueCodeUser) {
        str = psn.ecName
      }
    }
  )
  return str || ''
}
const selectChange = (v) => {

}

const pageSearch = async () => {
  if ('' == pageParameter.searchConditon.requirement.trim()) {
    message.warn('请选择检索条件')
    return false
  }
  // 校验完成后搜索
  loadMark.value = true
  pageReload()
}


/*start栏目设置*/
const dynamicColumns = initDynamics().DEFAULT
const dynamicColumnData = ref([])
let dynamicColumnDataCopy = []
const editableData = reactive({});

const confirm = (e: MouseEvent) => {
  // 询问
  createConfirm({
    iconType: 'warning',
    title: '栏目同步',
    content: '是否将刚才设置同步数据库!',
    onOk: async () => {
      // 调整数据库 列参数
      lanMuData.accId = manipulateDbName.value.substring(0, manipulateDbName.value.length - 5)
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
    } catch (e) {
      if (e.message == 'ok') {
        return true
      } else {
        return false
      }
    }
  })
  return a;
}

const cancel = (e: MouseEvent) => {
  // 恢复默认
  dynamicColumnData.value = []
  dynamicColumnData.value = dynamicColumnDataCopy
}


function resetDynamicColumnData() {
  // 先从数据查询是否已经设置
  lanMuData.accId = manipulateDbName.value.substring(0, manipulateDbName.value.length - 5)
  lanMuData.type = '列表'
  findDbLanMuList(lanMuData).then(res => {
    // 栏目列
    let dbList = res.items
    let statiList = excludeBeforeCoulumn('lanmu')
    dbList = dbList.length > 0 ? combineParameters(statiList, dbList) : statiList
    dynamicColumnData.value = dbList
    dynamicColumnDataCopy = JSON.parse(JSON.stringify(dbList))
    // 表格列
    reloadColumns()
    pageReload()
  })
}

function excludeBeforeCoulumn(type: string) {
  return (initDynamics()['DATA'])
}

const edit = (key: string) => {
  if (key.toString().indexOf('-') != -1) {
    let arr = key.split('-');
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
    let arr = key.split('-');
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
    let arr = key.split('-');
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

const reloadColumns = () => {
  let newA = JSON.parse(JSON.stringify(CrudApi.columns))
  newA = assemblyDynamicColumn(dynamicColumnData.value, newA)
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
/**
 *  根据指定条件  账套列表
 * */
const pingzhengEditor = usePingZhengFillinStoreWidthOut()
/* 对接 查看凭证*/
const showPingZheng = (obj: any) => {
  if (null != obj) {
    let b = obj.uniqueCode
    let thisTableSelectedRowObjs = getDataSource().filter(item => item.uniqueCode == b)
    pingzhengEditor.openPingZhengShowEditer(thisTableSelectedRowObjs)
  }
}

const pageChange = (a) => {
  loadMark.value = true
  pageReload(a.current)
}


import VoucherTree from "/@/views/boozsoft/gdzc/zi-chan-pan-dian-list/Component/VoucherTree.vue";
import {
  findAssetsUniqueCodeAndCode,
  findByAuthAssetsByUniqueCode
} from "/@/api/record/group/im-unit";
import {delChuZhi, findFaPanDianListByCondition, reviewChuZhi} from "/@/api/fa/fa-assets-minus";
import {
  findFaAssetTypeByFlagAndBend,
  findFaUsageStatusByFlagAndBend,
  findLocationByFlagAndBend
} from "/@/api/fa/fa-card";
import {psnFindByFlag} from "/@/api/psn/psn";
import {findDeptAll} from "/@/api/record/generalLedger/data";
import {hasBlank} from "/@/api/task-api/tast-bus-api";
import {JsonTool, ObjTool} from "/@/api/task-api/tools/universal-tools";
import {getCutModeAllList} from "/@/api/record/system/fa-ac";

/*****************左侧树变化******************/
const treeFilter = async (obj) => {
  pageParameter.treeConditon = obj.treeCondition
  pageReload()
}
/*****************左侧树变化******************/

const managementCode = ref('')
</script>
<style  lang="less" scoped>
@import '/@/assets/styles/pingzheng-menu-index.less';
</style>

