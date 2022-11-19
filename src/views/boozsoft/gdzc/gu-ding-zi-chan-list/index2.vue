<template>
  <div>
    <div class="app-container">

      <div class="app-container-head">
<!--        <img :src="getThisIndexImg()" class="container-head-img" draggable="false">-->
        <div class="container-head-title" style="margin-left: 40%;text-align: center;">
          <b class="noneSpan">资产列表</b>
          <div style="font-size: 14px;text-align: center;margin-top: 20px;">
          <span style="font-size: 14px;font-weight: bold;">
            资产节点日期：{{pageParameter.cdate}}
<!--            <DatePicker v-model:value="pageParameter.cdate" :locale="localeCn" placeholder="时点日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 120px;"/>-->
          </span>
          </div>
        </div>
        <div class="ant-btn-group" style="float: right">
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
          ><span>修改</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="delList()"
          ><span>删除</span></button><!--已减少卡片随便删，正常卡片与录入日期月份相同是可删除，已拆分卡片不能删除，已借出卡片不能删除-->
          <button
            type="button"
            class="ant-btn ant-btn-me"
          ><span>变动</span></button>
<!--          <button
            type="button"
            class="ant-btn ant-btn-me"
          ><span>拆分</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
          ><span>借用</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
          ><span>调出</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
          ><span>处置</span></button>-->
          <button
            type="button"
            class="ant-btn ant-btn-me"
          ><span>盘点</span></button>
<!--          <button
            type="button"
            class="ant-btn ant-btn-me"
          ><span>导入</span></button>-->
          <Popover placement="bottom">
            <Button class="ant-btn ant-btn-me"><span>更多</span></Button>
            <template #content>
              <span class="group-btn-span-special2 p_specifics">拆分</span><br/>
              <span class="group-btn-span-special2 p_specifics">借用</span><br/>
              <span class="group-btn-span-special2 p_specifics">调出</span><br/>
              <span class="group-btn-span-special2 p_specifics">处置</span><br/>
              <span class="group-btn-span-special2 p_specifics">导入</span><br/>
            </template>
          </Popover>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="closeCurrent()"
          ><span>退出</span></button>
        </div>
      </div>

      <div style="clear: none"/>
      <div>
        <div style="display: inline-block;float: left;">
          <AccountPicker theme="one" readonly @reloadTable="dynamicAdReload"/>
        </div>
<!--        <div style="display: inline-block;float: left;margin-left: 1%;">
          <label>管理类型：</label>
          <Select v-model:value="manageCode" :disabled="true" placeholder="管理类型" style="width: 200px;">
            <SelectOption v-for="item in accountList" :value="item.id">FA{{item.faAccId}}-{{item.faAccName}}</SelectOption>
          </Select>&emsp;
        </div>-->

        <div style="float: right; margin-left: 10px">
          <Button class="ant-btn-me">
            <SyncOutlined :style="{ fontSize: '14px' }"/>
          </Button>
          <Popover class="ant-btn-default" placement="bottom">
            <template #content>
              <Popconfirm
                ok-text="确定"
                cancel-text="放弃"
                @confirm="confirm"
                @cancel="cancel">
                <template #icon><b>栏目设置</b><br></template>
                <template #title>
                  <div style="width:665px">
                  <Table bordered :data-source="dynamicColumnData" :columns="dynamicColumns"
                           childrenColumnName="children" :pagination="false"
                           style="max-height: 500px;overflow-y: auto" class="lanmu-table">
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
                          <Input type="text" v-model:value="editableData[record.key].nameNew"
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
              <span class="group-btn-span-special2" @click="pageParameter.showRulesSize = 'MAX'"
                    :style="pageParameter.showRulesSize==='MAX'?{backgroundColor: '#0096c7',color: 'white'}:''">
                <SortDescendingOutlined/>&nbsp;大号字体&ensp;<CheckOutlined
                v-if="pageParameter.showRulesSize==='MAX'"/></span><br/>
              <span class="group-btn-span-special2" @click="pageParameter.showRulesSize = 'MIN'"
                    :style="pageParameter.showRulesSize==='MIN'?{backgroundColor: '#0096c7',color: 'white'}:''">
                <SortAscendingOutlined/>&nbsp;小号字体&ensp;<CheckOutlined
                v-if="pageParameter.showRulesSize==='MIN'"/></span>
            </template>
            <!--            <template #title>
                          <b>设置表格字号</b></template>-->
            <a-button>
              <SettingFilled :style="{ fontSize: '14px' }"/>
            </a-button>
          </Popover>
          <Button class="ant-btn-me">
            <UsbOutlined/>
          </Button>
          <Button class="ant-btn-me">
            <PrinterOutlined/>
          </Button>
          <Popover class="ant-btn-default" placement="bottom">
            <template #content>
              <span class="group-btn-span-special2" :style="typeFlag=='0'?{backgroundColor: '#0096c7',color: 'white'}:''" @click="clickTypeFlag('0')" style="width: 160px;">
                使用中资产&emsp;<CheckOutlined v-if="typeFlag=='0'"/></span><br/>
              <span class="group-btn-span-special2" :style="typeFlag=='1'?{backgroundColor: '#0096c7',color: 'white'}:''" @click="clickTypeFlag('1')" style="width: 160px;">
                已拆分资产&emsp;<CheckOutlined v-if="typeFlag=='1'"/></span><br/>
              <span class="group-btn-span-special2" :style="typeFlag=='2'?{backgroundColor: '#0096c7',color: 'white'}:''" @click="clickTypeFlag('2')" style="width: 160px;">
                已减少资产&emsp;<CheckOutlined v-if="typeFlag=='2'"/></span><br/>
              <span class="group-btn-span-special2" :style="typeFlag=='3'?{backgroundColor: '#0096c7',color: 'white'}:''" @click="clickTypeFlag('3')" style="width: 160px;">
                役龄资产&emsp;<CheckOutlined v-if="typeFlag=='3'"/></span><br/>
              <span class="group-btn-span-special2" :style="typeFlag=='4'?{backgroundColor: '#0096c7',color: 'white'}:''" @click="clickTypeFlag('4')" style="width: 160px;">
                逾龄资产&emsp;<CheckOutlined v-if="typeFlag=='4'"/></span><br/>
              <span class="group-btn-span-special2" :style="typeFlag=='5'?{backgroundColor: '#0096c7',color: 'white'}:''" @click="clickTypeFlag('5')" style="width: 160px;">
                借出资产&emsp;<CheckOutlined v-if="typeFlag=='5'"/></span>
            </template>
            <Button>
              <PicLeftOutlined :style="{ fontSize: '14px' }"/>
            </Button>
          </Popover>
          <Button @click="showTree=!showTree">
            <PieChartFilled :style="{ fontSize: '14px' }" />
          </Button>
          <!--        <Popover placement="bottom">
                    <Button>
                      <SettingFilled :style="{ fontSize: '14px' }" />
                    </Button>
                  </Popover>-->
<!--        <Button>
          <PicLeftOutlined :style="{ fontSize: '14px' }" />
        </Button>-->
<!--        <Button>
          <EditFilled :style="{ fontSize: '14px' }" />
        </Button>-->
          <!--        <Popover placement="bottom">
                  </Popover>

                  <Button>
                    <EditFilled :style="{ fontSize: '14px' }" />
                  </Button>

                  <Button @click="activeKey=!activeKey">
                    <PieChartFilled :style="{ fontSize: '14px' }" />
                  </Button>
                  <Button>
                    <FilterFilled :style="{ fontSize: '14px' }" />
                  </Button>-->
        </div>
        <div style="float: right; position: relative">
          <Select v-model:value="formItems.selectType" style="width: 120px;font-size: 12px;" class="special_select">
            <SelectOption style="font-size: 12px;" value="1">系统编号</SelectOption>
            <SelectOption style="font-size: 12px;" value="2">资产卡片编码</SelectOption>
            <SelectOption style="font-size: 12px;" value="3">资产卡片名称</SelectOption>
          </Select>
          <!-- 搜索 -->
          <InputSearch
            placeholder=""
            style="width: 200px; border-radius: 4px"
            @search="onSearch"
          />
        </div>
      </div>

      <div style="clear:both"/>

    </div>
    <div class="app-container">
      <PageWrapper dense content-full-height fixed-height content-class="flex">
        <div class="w-1/4 xl:w-1/5" v-show="showTree" style="width: 250px;min-height: 250px;border: 1px #cccccc solid;margin-right: .2%;margin-bottom: 58px;">
          <Tabs type="card" size="small" class="bg-white" :tabBarGutter="0" v-model:activeKey="activeKey">
            <TabPane key="1" tab="按资产类别显示" :style="activeKey=='1'?{height: (windowHeight-285)+'px'}:{}">
              <BasicTree
                title=""
                :click-row-to-expand="false"
                :tree-data="assetTypeTreeData"
                :replace-fields="{ key: 'id', title: 'value' }"
                v-model:selectedKeys="assetTypeSelectedKeys"
                v-model:expandedKeys="assetTypeExpandedKeys"
                @select="handleSelect"
              />
            </TabPane>
            <TabPane key="2" tab="按部门显示" :style="activeKey=='2'?{height: (windowHeight-285)+'px'}:{}">
              <BasicTree
                title=""
                :click-row-to-expand="false"
                :tree-data="deptTreeData"
                :replace-fields="{ key: 'id', title: 'value' }"
                v-model:selectedKeys="deptSelectedKeys"
                v-model:expandedKeys="deptExpandedKeys"
                @select="deptHandleSelect"
              />
            </TabPane>
          </Tabs>
        </div>
        <div style="float: right;" :style="showTree?{width: 'calc(100% - 250px)'}:{width: '100%'}">
          <BasicTable
            :row-selection="{ type: 'checkbox', selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
            :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
            @register="registerTable"
            :dataSource="tableData"
          >
            <template #jiechu="{ record }">
              <span>
                <Tag v-if="FormatJiechu(record)=='借出'" color="volcano">借出</Tag>
                <Tag v-if="FormatJiechu(record)=='役龄'" color="green">役龄</Tag>
                <Tag v-if="FormatJiechu(record)=='逾龄'" color="volcano">逾龄</Tag>
                <Tag v-if="FormatJiechu(record)=='已减少'" color="volcano">已减少</Tag>
                <Tag v-if="FormatJiechu(record)=='已拆分'" color="volcano">已拆分</Tag>
              </span>
            </template>
            <template #cardCode="{ record }"><span class="tableUStyle" @click="openEdit(record)">{{ record.cardCode }}</span></template>
            <template #faName="{ record }"><span class="tableUStyle" @click="openEdit(record)">{{ record.faName }}</span></template>
            <template #jitiLife="{ record }"><span>{{ record.jitiLife==0?'':record.jitiLife }}</span></template>
            <template #yuanzhi="{ record }"><span>{{ toThousandFilter(record.yuanzhi) }}</span></template>
            <template #ljzhejiu="{ record }">
              <span v-if="record.jitiLife==0">{{ record.ljzhejiu==0?'':toThousandFilter(record.ljzhejiu) }}</span>
              <span v-if="record.jitiLife>0">{{ record.zjLj==0?'':toThousandFilter(record.zjLj) }}</span>
            </template>
            <template #jingzhi="{ record }">
              <span v-if="record.jitiLife==0">{{ sub(record.yuanzhi,record.ljzhejiu)==0?'':toThousandFilter(sub(record.yuanzhi,record.ljzhejiu)) }}</span>
              <span v-if="record.jitiLife>0">{{ sub(record.yuanzhi,record.zjLj)==0?'':toThousandFilter(sub(record.yuanzhi,record.zjLj)) }}</span>
            </template>
            <template #yuezhejiue="{ record }"><span>{{ toThousandFilter(record.zjBy) }}</span></template>
          </BasicTable>
        </div>
      </PageWrapper>
      <Query
        @save="saveQuery"
        @register="registerQueryPage"
      />
    </div>
  </div>
</template>
<script setup="props, {emit}" lang="ts">
import {BasicTree} from '/@/components/Tree'
import {PageWrapper} from '/@/components/Page'
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
  PrinterOutlined,
  UsbOutlined,
  EditOutlined
} from '@ant-design/icons-vue'
import {
  Select,
  Input,
  DatePicker,
  Popover,
  Button,
  Tabs,
  Tag,
  Popconfirm,
  Checkbox,
  Radio,
  Table,
  message
} from 'ant-design-vue'
import {useMessage} from "/@/hooks/web/useMessage";
import {getThisAdInfoData} from "/@/api/record/system/financial-settings";
import {getCurrentAccountName, getThisIndexImg} from "/@/api/task-api/tast-bus-api";
// import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker.vue";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-GDZC.vue";
import Query from "./popup/query.vue";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import localeCn from 'ant-design-vue/es/date-picker/locale/zh_CN';
import {
  deleteCardMasterByCardUnique,
  deleteChangeByCardUnique,
  deleteChangeDeptByCardUnique,
  deleteChangeProjectByCardUnique, deleteDepreciationByCardUnique, findCardList,
  findCardMasterAll
} from "/@/api/fa/fa-card";
import {findFaAccountByAccId} from "/@/api/record/gdzc/zc-options";
import {GetDeptTreeByFlag as GetAssetTypeTreeByFlag} from "/@/api/record/system/fa-asset-type";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {findDbLanMuList, saveLanMuList} from "/@/api/record/system/accvoucher";
import {cloneDeep} from "lodash-es";
import {initDynamics, assemblyDynamicColumn} from "./data";
import {GetDeptTreeByFlag} from "/@/api/sys/dept";
import {sub,toThousandFilter} from "../gu-ding-zi-chan-add/calculation";

const InputSearch = Input.Search
const SelectOption = Select.Option
const TabPane = Tabs.TabPane
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

const {
  createSuccessModal,
  createErrorModal,
  createWarningModal,
  createConfirm
} = useMessage()

const {closeCurrent} = useTabs(router);

const activeKey = ref('1')
const showTree = ref(true)
const windowHeight = (window.innerHeight)

//查询页面
const [registerQueryPage, {openModal: openQueryPage}] = useModal()
const openQuery = () => {
  openQueryPage(true, {
    data: {}
  })
}

//查询页面
async function saveQuery(data){
  // console.log(data.dynamicTenantId)
  pageParameter.defaultAdName = data.defaultAdName
  pageParameter.dynamicTenantId = data.dynamicTenantId
  pageParameter.year = data.year
  pageParameter.cdate = data.cdate
  manageCode.value = data.manageCode
  await reloadTable()
}

//资产类别树形控件
const assetTypeTreeData: any = ref([])
const assetTypeSelectedKeys = ref<string[]>([])
const assetTypeExpandedKeys = ref<string[]>([])
async function fetch() {
  let assetTypeTree = await useRouteApi(GetAssetTypeTreeByFlag,{schemaName: dynamicTenantId})({})
  function a(assetTypeTree: any) {
    assetTypeTree.forEach((item: any) => {
      if (item.children != null) {
        a(item.children)
      }
      item.value = '[' + item.ecCode + ']  ' + item.ecName
    })
  }

  function b(assetTypeTree: any) {
    let arr: any = []
    arr.push(assetTypeTree[0].uniqueCode)
    return arr
  }

  a(assetTypeTree)
  assetTypeTreeData.value = []
  assetTypeTreeData.value.push({id:'0',uniqueCode:'0',key:'',value: '全部',children: assetTypeTree})
  let checks = b(assetTypeTreeData.value)
  assetTypeSelectedKeys.value = checks
  assetTypeExpandedKeys.value = checks
}
function handleSelect(keys: string, e: any) {
  let keyStr = keys[0]+',';
  if (null != e.selectedNodes && e.selectedNodes.length > 0
    && null != e.selectedNodes[0].children &&  e.selectedNodes[0].children.length > 0){
    keyStr = getThisNodeStr(e.selectedNodes[0].children,keyStr)
  }
  console.log(keyStr)
}

function getThisNodeStr(list,str) {
  for (const nods of list) {
    str+=(nods.id+',')
    if (null != nods.children && nods.children.length > 0){
      str = getThisNodeStr(nods.children,str)
    }
  }
  return str
}

//资产类别树形控件
const deptTreeData: any = ref([])
const deptSelectedKeys = ref<string[]>([])
const deptExpandedKeys = ref<string[]>([])
async function deptFetch() {
  let deptTree = await useRouteApi(GetDeptTreeByFlag,{schemaName: dynamicTenantId})({})
  function a(deptTree: any) {
    deptTree.forEach((item: any) => {
      if (item.children != null) {
        a(item.children)
      }
      item.value = '[' + item.deptCode + ']  ' + item.deptName
    })
  }

  function b(deptTree: any) {
    let arr: any = []
    arr.push(deptTree[0].uniqueCode)
    return arr
  }

  a(deptTree)
  deptTreeData.value = []
  deptTreeData.value.push({id:'0',uniqueCode:'0',key:'',value: '全部',children: deptTree})
  let checks = b(deptTreeData.value)
  deptSelectedKeys.value = checks
  deptExpandedKeys.value = checks
}

function deptHandleSelect(keys: string, e: any) {
  let keyStr = keys[0]+',';
  if (null != e.selectedNodes && e.selectedNodes.length > 0
    && null != e.selectedNodes[0].children &&  e.selectedNodes[0].children.length > 0){
    keyStr = getThisNodeStr(e.selectedNodes[0].children,keyStr)
  }
  console.log(keyStr)
}

const formItems = ref({
  selectType: '1'
})

const typeFlag = ref('0')

const manageCode:any = ref("")
const month:any = ref("1")

const accountList:any = ref([])
async function reloadList(){
  accountList.value = await findFaAccountByAccId(defaultAdName.value)
  if (accountList.value.length>0){
    manageCode.value = accountList.value[0].id
    await fetch()
    await deptFetch()
  }
}

const dynamicTenantId = ref(getCurrentAccountName(true))
const defaultAdName = ref(useCompanyOperateStoreWidthOut().getSchemaName)

const tableData:any = ref([]);
const tableDataAll:any = ref([]);
const loadMark = ref(false)

async function clickTypeFlag(str){
  typeFlag.value = str
  await reloadTable()
}
async function reloadTable(){
  let jianshao = '0'
  let chaifen = '0'
  let jiechu = ''
  if (typeFlag.value=='0'){
    //正常卡片
  } else if (typeFlag.value=='1'){
    //拆分卡片
    chaifen = '1'
  } else if (typeFlag.value=='2'){
    //减少卡片
    jianshao = '1'
  } else if (typeFlag.value=='3'){
    //役龄资产
    jiechu = '1'
  } else if (typeFlag.value=='4'){
    //逾龄资产
    jiechu = '1'
  } else {
    //借出资产
    jiechu = '0'
  }
  loadMark.value = true
  if (pageParameter.cdate!=null && pageParameter.cdate!='') {
    let time = pageParameter.cdate
    const res = await useRouteApi(findCardList, {schemaName: dynamicTenantId})({manageCode:manageCode.value,cdate:time,jianshao,chaifen,jiechu})
    tableDataAll.value = []
    if (typeFlag.value=='3'){
      tableDataAll.value = res.items.filter(item => item.jzdqrTime>time)
    }  else if (typeFlag.value=='4'){
      tableDataAll.value = res.items.filter(item => item.jzdqrTime<=time)
    } else {
      tableDataAll.value = res.items
    }
    tableData.value = tableDataAll.value
    await setPagination({
      total: tableData.value.length
    })
  } else {
    tableDataAll.value = []
    tableData.value = []
  }
  loadMark.value = false
}
const CrudApi = {
  // list: useRouteApi(findCardList, {schemaName: dynamicTenantId}),
  columns: [
    {
      title: '系统编号',
      dataIndex: 'sysId',
      width: 120,
      fixed: 'left',
      ellipsis: true,
    },
    {
      title: '资产编号',
      dataIndex: 'cardCode',
      width: 120,
      fixed: 'left',
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'cardCode'}
    },
    {
      title: '资产名称',
      dataIndex: 'faName',
      width: 200,
      fixed: 'left',
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'faName'}
    },
    {
      title: '状态',
      dataIndex: 'jiechu',
      width: 100,
      ellipsis: true,
      slots: { customRender: 'jiechu' }
    },
    {
      title: '入账日期',
      dataIndex: 'creatTime',
      width: 100,
      ellipsis: true
    },
    {
      title: '购买日期',
      dataIndex: 'buyTime',
      width: 100,
      ellipsis: true
    },
    {
      title: '规格型号',
      dataIndex: 'speciType',
      width: 150,
      align: 'left',
      ellipsis: true,
    },
    {
      title: '资产类别',
      dataIndex: 'faClass',
      width: 150,
      align: 'left',
      ellipsis: true,
    },
    {
      title: '部门',
      dataIndex: 'deptName',
      width: 150,
      align: 'left',
      ellipsis: true,
    },
    {
      title: '项目',
      dataIndex: 'projectName',
      width: 150,
      align: 'left',
      ellipsis: true,
    },
    {
      title: '使用状态',
      dataIndex: 'useType',
      width: 100,
      align: 'left',
      ellipsis: true
    },
    {
      title: '使用年限(月)',
      dataIndex: 'life',
      width: 150,
      ellipsis: true
    },
    {
      title: '已计提年限(月)',
      dataIndex: 'jitiLife',
      width: 150,
      ellipsis: true,
      slots: { customRender: 'jitiLife' }
    },
    {
      title: '资产原值',
      dataIndex: 'yuanzhi',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'yuanzhi' }
    },
    {
      title: '累计折旧',
      dataIndex: 'ljzhejiu',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'ljzhejiu' }
    },
    {
      title: '净值',
      dataIndex: 'jingzhi',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'jingzhi' }
    },
    {
      title: '月折旧额',
      dataIndex: 'yuezhejiue',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'yuezhejiue' }
    },
  ],
}

function FormatJiechu(data){
  let str = ''
  let jzdqrTime = data.jzdqrTime.substring(0,7)
  let time = pageParameter.cdate==null?'':pageParameter.cdate.substring(0,7)
  if (data.jianshao=='1'){
    str = '已减少'
  } else if(data.chaifen=='1'){
    str = '已拆分'
  } else if (data.jiechu=='1'){
    str = '借出'
  } else if(jzdqrTime>=time) {
    str = '役龄'
  } else {
    str = '逾龄'
  }
  return str
}

// 这是示例组件
const [registerTable, {
  reload,
  getDataSource,
  setTableData,
  setColumns,
  getColumns,
  setPagination,
  getPaginationRef
}] = useTable({
  // api: CrudApi.list,
  columns: CrudApi.columns,
  bordered: true,
  showIndexColumn: true,
  pagination: {
    pageSize: 50,
    showSizeChanger: true,
    pageSizeOptions: ['10', '25', '50', '100'],
    showTotal: t => `总共${t}条数据`
  },
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
const onSelectChange = (selectedRowKeys, row) => {
  // console.log('selectedRowKeys changed: ', row);
  state.selectedRowKeys = selectedRowKeys;
  checkRow.value = row
};

const pageParameter: any = reactive({
  showRulesSize:'MIN',
  cardUnique: '',
  isEdit: '0',
  dynamicTenantId: '',
  defaultAdName: '',
  year: '',
  thisAdInfo: {},
  total: 0,
})

//打开资产卡片添加页
function addPage(){
  router.push({
    path: '/handle/gd-incr',
  });
}
//查看固定资产
function openEdit(data){
  pageParameter.cardUnique=data.cardUnique
  pageParameter.isEdit='2'
  router.push({
    path: '/handle/gd-incr',
    query: pageParameter
  })
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
          await useRouteApi(deleteCardMasterByCardUnique, {schemaName: dynamicTenantId})(item.cardUnique)
          await useRouteApi(deleteChangeByCardUnique, {schemaName: dynamicTenantId})(item.cardUnique)
          await useRouteApi(deleteChangeDeptByCardUnique, {schemaName: dynamicTenantId})(item.cardUnique)
          await useRouteApi(deleteChangeProjectByCardUnique, {schemaName: dynamicTenantId})(item.cardUnique)
          await useRouteApi(deleteDepreciationByCardUnique, {schemaName: dynamicTenantId})(item.cardUnique)
        }
        message.success('删除成功！')
        checkRow.value = []
        state.selectedRowKeys = []
        await reload()
      },
      onCancel: () => {
        return false
      }
    })
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '删除',
      content: '请选择需要删除的内容！'
    })
    return false
  }
}

function onSearch() {
}

const defaultPage = ref(false)
onMounted(async() => {
  resetDynamicColumnData()
  openQueryPage(true, {
    data: {
      openOne: '1'
    }
  })
})

const dynamicAdReload = async (obj) => {
  // const dataBase:any = await findDataBase(obj.accId,obj.year)
  dynamicTenantId.value = obj.accountMode
  defaultAdName.value = obj.accId
  manageCode.value = obj.managementCode
  await reloadList()
  await reloadTable()
  /*let data: any = {}
  data.page = getPaginationRef().current
  data.size = getPaginationRef().pageSize
  let res: any = await useRouteApi(CrudApi.list, {schemaName: obj.accountMode})(data)
  setTableData([]) // 清空可能残留的数据
  setTableData(res.items)*/
  // 底部分页信息
  pageParameter.thisAdInfo = {}
  pageParameter.thisAdInfo = obj
  pageParameter.total = tableData.value.length
  pageParameter.dynamicTenantId = obj.accountMode
  pageParameter.defaultAdName = obj.accId
  pageParameter.year = obj.year
  setPagination({total: tableData.value.length})
}

/**********************栏目设置**********************/
/*start栏目设置*/
/*const pageParameter = reactive({
  showRulesSize: 'MIN',
  companyCode: '100',
  companyName: '湖北万亚软件技术有限公司',
  ifUnit: false,
  total: 0,
  thisAdInfo: {}
})*/
const visible = ref(false);
const windowWidth = (document.documentElement.clientWidth - (70 + 280))
// const windowHeight = (window.innerHeight - (300))
const totalColumnWidth = ref(0)
const dynamicColumns = initDynamics().DEFAULT
const dynamicColumnData: any = ref([])
let dynamicColumnDataCopy = []
const editableData = reactive({});
const tableRef: any = ref(null)
const lanMuData = {
  'accId': '',
  'menuName': '固定资产',
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
  let newA = JSON.parse(JSON.stringify(CrudApi.columns))
  newA = assemblyDynamicColumn(dynamicColumnData.value, newA)
  setColumns(newA)
  initTableWidth(newA)
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
    // tableRef.value.$el.style.setProperty('width',(windowWidth+20-f)+'px')
  } else {
    if (visible.value && (windowWidth - 260) < total) total -= (total - (windowWidth - 260))
    totalColumnWidth.value = total
    // tableRef.value.$el.style.setProperty('width',(total+20)+'px')
  }
}

const pageReload = () => {
  setTableData([]) // 清空可能残留的数据
  reload({
    searchInfo: pageParameter
  })
}
/*栏目设置end*/
</script>
<style src="../../../../assets/styles/global-menu-index-block.less" lang="less" scoped></style><style lang='less' scoped ></style>
<style src="../../../../assets/styles/global-menu-index.less" lang="less" scoped></style><style lang='less' scoped ></style>
<style scoped lang="less">
:deep(.ant-card-body) {
  padding: 16px;
  border-left: 2px solid rgb(1, 143, 251);
  box-shadow: rgb(72 113 140) -3px 1px 7px -1px;
}

.a-table-font-size-16 :deep(td),
.a-table-font-size-16 :deep(th) {
  font-size: 16px !important;
  padding: 5px 8px !important;
}

.a-table-font-size-12 :deep(td),
.a-table-font-size-12 :deep(th) {
  font-size: 14px !important;
  padding: 2px 8px !important;
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
}

.voucher-list-tree {
  display: inline-block;
  height: calc(100%);
  width: 236px;
  float: left;
  :deep(.ant-select-selector) {
    background-color: #f1f1f1;
    border: none;
    border-bottom: solid 1px rgb(191, 191, 191) !important;
  }

  :deep(.ant-tabs-nav) {
    margin-bottom: 0px;

    .ant-tabs-tab-active {
      background-color: #f1f1f1;
      border-top: 2px solid #0096c7;
      border-bottom: none;
    }
  }

  :deep(.ant-tabs-content) {
    padding: 0 10px 10px;
    background-color: #f1f1f1;

    .scroll-container {
      border: 2px groove #cac2c2;
      background-color: #f1f1f1;
      height: calc(100% - 60px) !important;
      .ant-tree-list{
        background-color: #f1f1f1 !important;
      }
    }
  }
}
.bg-white {
  width: 250px !important;
  min-height: 250px !important;
  height: calc(100% - 170px);
  border: 1px #cccccc solid;
  background: white !important;
  margin-right: .2%;
}
</style>
