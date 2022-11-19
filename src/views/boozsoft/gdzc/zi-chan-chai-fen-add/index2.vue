<template>
  <div>
    <div class="app-container">
      <div class="app-container-top">

        <div class="app-container-head">

          <div class="ant-btn-group" style="float: right;">
            <button
              type="button"
              class="ant-btn ant-btn-me"
              @click="addNewDate()"
            ><span>新增</span></button>
            <button
              type="button"
              class="ant-btn ant-btn-me"
              v-if="isEdit!='2'"
              @click="saveData()"
            ><span>保存</span></button>
            <button
              type="button"
              class="ant-btn ant-btn-me"
              @click="isEdit='2'"
              v-if="isEdit!='2'"
            ><span>放弃</span></button>
            <button
              type="button"
              class="ant-btn ant-btn-me"
              @click="isEdit='1'"
              v-if="isEdit=='2'"
            ><span>修改</span></button>
            <button
              type="button"
              class="ant-btn ant-btn-me"
              @click="addRow()"
              v-if="isEdit=='0'"
            ><span>增行</span></button>
            <button
              type="button"
              class="ant-btn ant-btn-me"
              @click="delRow()"
              v-if="isEdit=='0'"
            ><span>删行</span></button>
            <button
              type="button"
              class="ant-btn ant-btn-me"
              v-if="isEdit=='1'"
            ><span>删除</span></button>
            <button
              type="button"
              class="ant-btn ant-btn-me"
              @click="closeCurrent()"
            ><span>退出</span></button>
          </div>
        </div>

        <div style="clear:both"/>

        <div style="margin-left: 30px;">
          <div style="float:left;" :class="isEdit=='0'?'':'status-look'">
            <AccountPicker theme="one" @reloadTable="dynamicAdReload"/>
          </div>

          <div style="float:left;" :class="isEdit=='0'?'':'status-look'">
            <label>管理代码：</label>
            <Select v-model:value="formItems.manageCode" placeholder="管理类型" style="width: 200px;">
              <SelectOption v-for="item in accountList" :value="item.id">FA{{item.faAccId}}-{{item.faAccName}}</SelectOption>
            </Select>
          </div>

          <div style="float: right; margin-left: 10px">
            <Button class="ant-btn-me">
              <SyncOutlined :style="{ fontSize: '14px' }"/>
            </Button>
            <Popover class="ant-btn-default" placement="bottom">
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
              <Button>
                <SettingFilled :style="{ fontSize: '14px' }"/>
              </Button>
            </Popover>
            <Popover class="ant-btn-default" placement="bottom">
              <Button>
                <PicLeftOutlined :style="{ fontSize: '14px' }"/>
              </Button>
              <template #content>
              </template>
            </Popover>
            <Button>
              <FilterFilled :style="{ fontSize: '14px' }" />
            </Button>
          </div>
        </div>
        <div style="clear: none"/>
      </div>

      <div class="open-content-down" :style="{height: (windowHeight+70)+'px'}">
        <div class="acb-head">
          <div class="acbgead-one">
            <div class="acbgead-one-triangle">
              <div></div>
              <div>
                <span style="color: white;font-size: 14px;">{{ isEdit=='0'?'新增':isEdit=='1'?'修改':'查看' }}</span>
              </div>
            </div>

            <div class="acbgead-one-changes">
              <VerticalRightOutlined/>&nbsp;
              <LeftOutlined/>&nbsp;
              <RightOutlined/>&nbsp;
              <VerticalLeftOutlined/>
            </div>
            <span style="font-size: 24px;color: #0096c7;font-weight: bold;">资产拆分单</span>
          </div>
        </div>
        <div class="acco-sideline-content" :class="isEdit=='2'?'status-look':''">
          <label>拆分日期：</label>
          <DatePicker v-model:value="formItems.chaifenTime" :disabled="isEdit!='0'" :disabled-date="disabledDate" @change="reloadCardMaster()" :locale="localeCn" placeholder="变动日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 12%;"/>
          <label>单据编号：</label>
          <Input v-model:value="formItems.chaifenCode" :disabled="true" style="width: 12%;"/>
          <label>拆分原因：</label>
          <Input v-model:value="formItems.chaifenReason" style="width: 12%;"/>
          <label>资产编码：</label>
          <Input v-if="isEdit!='0'" v-model:value="formItems.cardCode" :readonly="true" style="width: 12%;"/>
          <Popover v-if="isEdit=='0'" placement="bottom">
            <Input v-model:value="formItems.cardCode" style="width: 12%;">
              <template #suffix>
                <SearchOutlined />
              </template>
            </Input>
            <template #content>
              <RadioGroup v-model:value="formItems.cardUnique" @change="changeCard()">
                <span v-if="cardMasterList.length>0" v-for="item in cardMasterList">
                <Radio :value="item.cardUnique" style="line-height:30px">{{item.cardCode}}-{{item.faName}}</Radio><br/>
                </span>
              </RadioGroup>
              <label v-if="cardMasterList.length==0" style="line-height:30px;">暂无数据,请先选择日期或添加卡片!</label>
            </template>
          </Popover>
          <label>资产名称：</label>
          <Input v-model:value="formItems.faName" :disabled="true" style="width: 12%;"/>
          <br/>
          <label>数量：</label>
          <Input v-model:value="formItems.shuliang" :disabled="true" :precision="0" style="width: 12%;text-align: right;"/>
          <label>原值：</label>
          <Input :value="toThousandFilter(formItems.yuanzhi)" :disabled="true" :precision="2" style="width: 12%;text-align: right;"/>
          <label>进项税额：</label>
          <Input :value="toThousandFilter(formItems.jingxiangshui)" :disabled="true" :precision="2" style="width: 12%;text-align: right;"/>
          <label>累计折旧：</label>
          <Input :value="toThousandFilter(formItems.ljzhejiu)" :disabled="true" :precision="2" style="width: 12%;text-align: right;"/>
          <label>净值：</label>
          <Input :value="toThousandFilter(formItems.jingzhi)" :disabled="true" :precision="2" style="width: 12%;text-align: right;"/>
        </div>
        <BasicTable
          ref="tableRef"
          :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
          :row-selection="{ type: 'checkbox',selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
          :loading="loadMark"
          :dataSource="tableData"
          @register="registerTable"
          :scroll="{ x: totalColumnWidth,y: (windowHeight-150) }"
        >
          <!-- 资产编码 -->
          <template #cardCode="{ record,index }">
            <span v-if="record.cardCodeFlag!='1'">{{record.cardCode}}<EditOutlined v-if="isEdit!=2" @click="record.cardCodeFlag='1'"/></span>
            <span v-if="record.cardCodeFlag=='1'"><Input v-model:value="record.cardCode" @blur="checkCode(record,index)" style="width: 85%;"/><CheckOutlined @click="saveRow(record,index);record.cardCodeFlag='0'"/></span>
          </template>
          <!-- 资产名称 -->
          <template #faName="{ record,index }">
            <span v-if="record.faNameFlag!='1'">{{record.faName}}<EditOutlined v-if="isEdit!=2" @click="record.faNameFlag='1'"/></span>
            <span v-if="record.faNameFlag=='1'"><Input v-model:value="record.faName" style="width: 85%;"/><CheckOutlined @click="record.faNameFlag='0'"/></span>
          </template>
          <!-- 规格型号 -->
          <template #speciType="{ record,index }">
            <span v-if="record.speciTypeFlag!='1'">{{record.speciType}}<EditOutlined v-if="isEdit!=2" @click="record.speciTypeFlag='1'"/></span>
            <span v-if="record.speciTypeFlag=='1'"><Input v-model:value="record.speciType" style="width: 85%;"/><CheckOutlined @click="record.speciTypeFlag='0'"/></span>
          </template>
          <!-- 计提方式 -->
          <template #jitiType="{ record,index }">
            <span>增加次月开始计提</span>
          </template>
          <!-- 数量 -->
          <template #shuliang="{ record,index }">
            <span v-if="record.shuliangFlag!='1'">{{record.shuliang}}<EditOutlined v-if="isEdit!=2" @click="record.shuliangFlag='1'"/></span>
            <span v-if="record.shuliangFlag=='1'"><InputNumber v-model:value="record.shuliang" :precision="0" style="width: 85%;"/><CheckOutlined @click="countShuliang(record,index)"/></span>
          </template>
          <!-- 原值 -->
          <template #yuanzhi="{ record,index }">
            <span v-if="record.yuanzhiFlag!='1'">{{toThousandFilter(record.yuanzhi)}}<EditOutlined v-if="isEdit!=2" @click="record.yuanzhiFlag='1'"/></span>
            <span v-if="record.yuanzhiFlag=='1'"><InputNumber v-model:value="record.yuanzhi" class="right" :precision="2" style="width: 85%;"/><CheckOutlined @click="countYuanzhi(record,index)"/></span>
          </template>
          <!-- 进项税额 -->
          <template #jingxiangshui="{ record,index }">
            <span>{{toThousandFilter(record.jingxiangshui)}}</span>
          </template>
          <!-- 累计折旧 -->
          <template #ljzhejiu="{ record,index }">
            <span v-if="record.ljzhejiuFlag!='1'">{{toThousandFilter(record.ljzhejiu)}}<EditOutlined v-if="isEdit!=2" @click="record.ljzhejiuFlag='1'"/></span>
            <span v-if="record.ljzhejiuFlag=='1'"><InputNumber v-model:value="record.ljzhejiu" class="right" :precision="2" style="width: 85%;"/><CheckOutlined @click="countLjzhejiu(record,index)"/></span>
          </template>
          <!-- 净值 -->
          <template #jingzhi="{ record,index }">
            <span>{{toThousandFilter(record.jingzhi)}}</span>
          </template>
          <!-- 卡片日期 -->
          <template #cdate="{ record,index }">
            <span>{{record.cdate}}</span>
          </template>
          <template #summary>
            <TableSummaryRow>
              <TableSummaryCell :index="0"></TableSummaryCell>
              <TableSummaryCell :index="1"></TableSummaryCell>
              <!-- 资产编码 -->
              <TableSummaryCell :index="2">合计</TableSummaryCell>
              <!-- 资产名称 -->
              <TableSummaryCell :index="3"></TableSummaryCell>
              <!-- 规格型号 -->
              <TableSummaryCell :index="4"></TableSummaryCell>
              <!-- 计提方式 -->
              <TableSummaryCell :index="5"></TableSummaryCell>
              <!-- 数量 -->
              <TableSummaryCell :index="6" align="center">{{shuliang}}</TableSummaryCell>
              <!-- 原值 -->
              <TableSummaryCell :index="7" align="right">{{toThousandFilter(yuanzhi)}}</TableSummaryCell>
              <!-- 进项税额 -->
              <TableSummaryCell :index="8" align="right">{{toThousandFilter(jingxiangshui)}}</TableSummaryCell>
              <!-- 累计折旧 -->
              <TableSummaryCell :index="9" align="right">{{toThousandFilter(ljzhejiu)}}</TableSummaryCell>
              <!-- 净值 -->
              <TableSummaryCell :index="10" align="right">{{toThousandFilter(jingzhi)}}</TableSummaryCell>
              <!-- 卡片日期 -->
              <TableSummaryCell :index="11" align="right"></TableSummaryCell>
            </TableSummaryRow>
          </template>
        </BasicTable>
      </div>
    </div>
  </div>
</template>

<script setup="props, {emit}" lang="ts">
import {
  Input,
  InputNumber,
  Select,
  TreeSelect,
  Popover,
  Tabs,
  DatePicker,
  Button,
  Popconfirm,
  Checkbox,
  Radio,
  Table,
  Drawer,
  message
} from "ant-design-vue";

const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const InputSearch = Input.Search
const SelectOption = Select.Option
const TabPane = Tabs.TabPane
const TableSummary = Table.Summary
const TableSummaryRow = TableSummary.Row
const TableSummaryCell = TableSummary.Cell
import {useModal} from '/@/components/Modal'
import {
  CaretDownFilled,
  FormOutlined,
  DeleteOutlined,
  SettingFilled,
  SyncOutlined,
  PicLeftOutlined,
  EditFilled,
  PieChartFilled,
  FilterFilled,
  CheckOutlined,
  EditOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  VerticalLeftOutlined,
  VerticalRightOutlined,
  LeftOutlined,
  RightOutlined,
  SearchOutlined
} from '@ant-design/icons-vue'
import {onMounted, reactive, ref,provide} from "vue";
import {useMessage} from "/@/hooks/web/useMessage";
import {getCurrentAccountName, hasBlank} from "/@/api/task-api/tast-bus-api";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {getThisAdInfoData} from "/@/api/record/system/financial-settings";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker.vue";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useUserStore} from "/@/store/modules/user";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import { buildUUID } from '/@/utils/uuid';
import {findSettModesByFlag as findEconomyUseByFlag} from "/@/api/record/system/fa-economy-use";
import {findSettModesByFlag as findAssetGroupByFlag} from "/@/api/record/system/fa-asset-group";
import {add, div, mul, pad, sub,toThousandFilter} from "/@/views/boozsoft/gdzc/gu-ding-zi-chan-add/calculation";
import localeCn from 'ant-design-vue/es/date-picker/locale/zh_CN';
import {findAllProject} from "/@/api/record/system/project";
import {getDeptList} from "/@/api/record/system/dept";
import {useRoute} from "vue-router";
import moment from "moment";
import {findFaAccountByAccId} from "/@/api/record/gdzc/zc-options";
import {BasicTable, useTable} from '/@/components/Table'
import {
  findByCardCode,
  findCardList,
  findCardMasterByCardUnique,
  findCardMasterByCdateList,
  findChangeByCardUnique,
  findChangeDeptByCardUnique,
  findChangeProjectByCardUnique,
  findMaxSysId,
  findZhejiuMethodByFlag,
  saveFaCardMaster,
  saveFaChange, saveFaChangeDeptList, saveFaChangeProjectList
} from "/@/api/fa/fa-card";
import {
  findCardByCardUnique,
  findCardByLessCdateList, findCardBySourceCardUnique,
  findChaifenByCardUnique,
  findMaxChaifenCode,
  saveFaChaifenHead
} from "/@/api/fa/fa-chaifen";
import {findAssetsDate} from "/@/api/record/group/im-unit";

const {
  createErrorModal
} = useMessage()

const {closeCurrent} = useTabs(router);

const windowHeight = (window.innerHeight - 300)
const windowWidth = (document.documentElement.clientWidth - (70 + 280))
const tableRef: any = ref(null)
const totalColumnWidth = ref(0)

const pageParameter = reactive({
  showRulesSize: 'MIN',
  searchConditon: {
    requirement: '',
    value: '',
  },
  managementCode: ''
})

const activeKey: any = ref('1')
const year: any = ref('')
const dynamicTenantId = ref(getCurrentAccountName(true))
const defaultAdName = ref(useCompanyOperateStoreWidthOut().getSchemaName)

const formItems: any = ref({})

const route = useRoute();
const routemsg = ref(route.query);
//0添加、1修改，2查看
const isEdit:any = ref("0")

const loadMark = ref(false)
const tableData:any = ref([]);

async function addNewDate(){
  num = 0
  isEdit.value = '0'
  formItems.value = {}
  await reloadList()
  formItems.value.uniqueCode = defaultAdName.value
  tableData.value = []
  countSum()
}

onMounted(async () => {
  // console.log(routemsg.value)
  if (JSON.stringify(routemsg.value).length === 2) {
  } else {
    loadMark.value = true
    dynamicTenantId.value = routemsg.value.dynamicTenantId
    defaultAdName.value = routemsg.value.defaultAdName
    year.value = routemsg.value.year
    isEdit.value = routemsg.value.isEdit
    chaifenHead.value = await useRouteApi(findChaifenByCardUnique,{schemaName: dynamicTenantId})(routemsg.value.cardUnique)
    // console.log(chaifenHead.value)
    formItems.value.uniqueCode = chaifenHead.value.uniqueCode
    formItems.value.manageCode = chaifenHead.value.manageCode
    formItems.value.cardUnique = chaifenHead.value.cardUnique
    formItems.value.chaifenCode = chaifenHead.value.chaifenCode
    formItems.value.chaifenTime = moment(chaifenHead.value.chaifenTime)
    formItems.value.chaifenReason = chaifenHead.value.chaifenReason
    formItems.value.iyear = chaifenHead.value.iyear
    formItems.value.imonth = chaifenHead.value.imonth
    await reloadCardMaster()
    const card = await useRouteApi(findCardByCardUnique,{schemaName: dynamicTenantId})(routemsg.value.cardUnique)
    formItems.value.cardCode = card.cardCode
    formItems.value.faName = card.faName
    formItems.value.speciType = card.speciType
    formItems.value.shuliang = card.shuliang
    formItems.value.yuanzhi = card.yuanzhi
    formItems.value.jingxiangshui = card.jingxiangshui
    formItems.value.jinxiangshuilv = card.jinxiangshuilv
    formItems.value.iyear = card.iyear
    formItems.value.imonth = card.imonth
    if (card.jitiLife==0){
      formItems.value.yuezhejiue = card.yuezhejiue
      formItems.value.ljzhejiu = card.ljzhejiu
    } else {
      formItems.value.yuezhejiue = card.zjBy
      formItems.value.ljzhejiu = card.zjLj
    }
    formItems.value.jingzhi = sub(formItems.value.yuanzhi,formItems.value.ljzhejiu).toFixed(5)
    //查询行信息
    const cardList = await useRouteApi(findCardBySourceCardUnique,{schemaName: dynamicTenantId})(routemsg.value.cardUnique)
    cardList.forEach(item=>{
      num++
      tableData.value.push({
        num: num,
        uniqueCode: item.uniqueCode,
        cardCode: item.cardCode,
        faName: item.faName,
        speciType: item.speciType,
        jitiType: item.jitiType,
        shuliang: item.shuliang,
        yuanzhi: item.yuanzhi,
        jingxiangshui: item.jingxiangshui,
        ljzhejiu: item.ljzhejiu,
        jingzhi: sub(item.yuanzhi, item.ljzhejiu).toFixed(5),
        cdate: formItems.value.chaifenTime,
      })
    })
    //计算合计
    countSum()
    setTableData(tableData.value)
    await setPagination({
      total: tableData.value.length
    })
    loadMark.value = false
  }
})

//添加行
let num = 0
async function addRow(){
  if (formItems.value.cardCode!=null && formItems.value.cardCode!='') {
    num++
    tableData.value.push({
      num: num,
      cardCode: formItems.value.cardCode+'-'+pad(num,2),
      faName: formItems.value.faName,
      speciType: formItems.value.speciType,
      jitiType: '1',
      shuliang: formItems.value.shuliang,
      yuanzhi: sub(formItems.value.yuanzhi, yuanzhi.value).toFixed(5),
      jingxiangshui: sub(formItems.value.jingxiangshui, jingxiangshui.value).toFixed(5),
      ljzhejiu: sub(formItems.value.ljzhejiu, ljzhejiu.value).toFixed(5),
      jingzhi: sub(formItems.value.jingzhi, jingzhi.value).toFixed(5),
      cdate: formItems.value.chaifenTime,
    })
    countSum()
    setTableData(tableData.value)
    await setPagination({
      total: tableData.value.length
    })
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '请先选择需要拆分的卡片！'
    })
  }
}
//删除选中的行
async function delRow(){
  if (checkRow.value.length>0) {
    checkRow.value.forEach(res => {
      // console.log(res.key)
      tableData.value.forEach((item, index) => {
        // console.log(item.key)
        if (res.num == item.num) {
          // console.log(item)
          tableData.value.splice(index, 1)
        }
      })
    })
    setTableData(tableData.value)
    await setPagination({
      total: tableData.value.length
    })
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '请先选择需要删除的行！'
    })
  }
}

const CrudApi = {
  columns: [
    {
      title: '资产编码',
      dataIndex: 'cardCode',
      ellipsis: true,
      align: 'left',
      width: 150,
      slots: {customRender: 'cardCode'}
    },
    {
      title: '资产名称',
      dataIndex: 'faName',
      ellipsis: true,
      align: 'left',
      width: 150,
      slots: {customRender: 'faName'}
    },
    {
      title: '规格型号',
      dataIndex: 'speciType',
      ellipsis: true,
      align: 'left',
      width: 120,
      slots: {customRender: 'speciType'}
    },
    {
      title: '计提方式',
      dataIndex: 'jitiType',
      ellipsis: true,
      width: 150,
      slots: {customRender: 'jitiType'}
    },
    {
      title: '数量',
      dataIndex: 'shuliang',
      ellipsis: true,
      width: 120,
      slots: {customRender: 'shuliang'}
    },
    {
      title: '原值',
      dataIndex: 'yuanzhi',
      ellipsis: true,
      align: 'right',
      width: 120,
      slots: {customRender: 'yuanzhi'}
    },
    {
      title: '进项税额',
      dataIndex: 'jingxiangshui',
      ellipsis: true,
      align: 'right',
      width: 120,
      slots: {customRender: 'jingxiangshui'}
    },
    {
      title: '累计折旧/摊销',
      dataIndex: 'ljzhejiu',
      ellipsis: true,
      align: 'right',
      width: 120,
      slots: {customRender: 'ljzhejiu'}
    },
    {
      title: '净值',
      dataIndex: 'jingzhi',
      ellipsis: true,
      align: 'right',
      width: 120,
      slots: {customRender: 'jingzhi'}
    },
    {
      title: '卡片日期',
      dataIndex: 'cdate',
      ellipsis: true,
      align: 'right',
      width: 120,
      slots: {customRender: 'cdate'}
    },
  ]
}
// 这是示例组件
const [registerTable, {
  reload,
  getDataSource,
  setTableData,
  setPagination,
  getPaginationRef
}] = useTable({
  columns: CrudApi.columns,
  bordered: true,
  showIndexColumn: true,
  pagination: {
    pageSize: 30,
    showSizeChanger: true,
    pageSizeOptions: ['30', '50', '100'],
    showTotal: t => `总共${t}条数据`
  },
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
  // console.log('keys: ', selectedRowKeys);
  // console.log('changed: ', row);
  state.selectedRowKeys = selectedRowKeys;
  checkRow.value = row
};

const accountList:any = ref([])
const zhejiuMethodList:any = ref([])
async function reloadList(){
  accountList.value = await findFaAccountByAccId(defaultAdName.value)
  // console.log(accountList.value)
  if (accountList.value.length>0){
    formItems.value.manageCode = accountList.value[0].id
    const time = await findAssetsDate({code: formItems.value.manageCode, iyear: year.value})
    formItems.value.chaifenTime = time.date
    await reloadCardMaster()
  }
  zhejiuMethodList.value = await useRouteApi(findZhejiuMethodByFlag,{schemaName: dynamicTenantId})({})
}

const disabledDate = (current) => {
  // 获取区间最小区间
  if (!hasBlank(formItems.value.chaifenTime)) {
    let variable = formItems.value.chaifenTime.substring(0, 7)
    let min = moment(variable.substring(0,7) + '-01', 'YYYY-MM-DD')
    let max = moment(variable, 'YYYY-MM-DD').endOf('month')
    return current < min || current > max
  }
};

const cardMasterList:any = ref([])
async function reloadCardMaster(){
  if (formItems.value.manageCode!=null && formItems.value.manageCode!='' && formItems.value.chaifenTime!=null && formItems.value.chaifenTime!='') {
    const res = await useRouteApi(findCardByLessCdateList, {schemaName: dynamicTenantId})({
      manageCode: formItems.value.manageCode,
      cdate: formItems.value.chaifenTime,
      jianshao:'0',
      chaifen:'0',
      jiechu:''
    })
    cardMasterList.value = res.items
    // console.log(cardMasterList.value)
    const maxCode = await useRouteApi(findMaxChaifenCode, {schemaName: dynamicTenantId})({
      manageCode: formItems.value.manageCode,
      cdate: formItems.value.chaifenTime
    })
    if (maxCode!=null && maxCode.chaifenCode!=null && maxCode.chaifenCode!='') {
      console.log(maxCode.chaifenCode.substring(9))
      formItems.value.chaifenCode = 'CF_' + formItems.value.chaifenTime.substring(0,4) + formItems.value.chaifenTime.substring(5,7) + pad(add(maxCode.chaifenCode.substring(9),1),3)
    } else {
      formItems.value.chaifenCode = 'CF_' + formItems.value.chaifenTime.substring(0,4) + formItems.value.chaifenTime.substring(5,7) + '001'
    }
  }
}

function changeCard(){
  tableData.value =[]
  cardMasterList.value.forEach(item=>{
    if (formItems.value.cardUnique == item.cardUnique){
      // console.log(item)
      formItems.value.cardCode = item.cardCode
      formItems.value.faName = item.faName
      formItems.value.speciType = item.speciType
      formItems.value.shuliang = item.shuliang
      formItems.value.yuanzhi = item.yuanzhi
      formItems.value.jingxiangshui = item.jingxiangshui
      formItems.value.jinxiangshuilv = item.jinxiangshuilv
      formItems.value.iyear = item.iyear
      formItems.value.imonth = item.imonth
      formItems.value.buyTime = item.buyTime
      formItems.value.life = item.life
      //计算已计提年限
      let useLife = 0
      if (formItems.value.buyTime!=null && formItems.value.buyTime!='' && formItems.value.chaifenTime!=null && formItems.value.chaifenTime!=''){
        useLife = add(mul(sub(formItems.value.chaifenTime.substring(0, 4), formItems.value.buyTime.substring(0, 4)), 12), sub(formItems.value.chaifenTime.substring(5, 7), formItems.value.buyTime.substring(5, 7)))
        if (sub(formItems.value.life,useLife)>=0){
          formItems.value.useLife = useLife
        } else {
          formItems.value.useLife = formItems.value.life
        }
      }
      if (item.jitiLife==0){
        formItems.value.yuezhejiue = item.yuezhejiue
        formItems.value.ljzhejiu = item.ljzhejiu
      } else {
        formItems.value.yuezhejiue = item.zjBy
        formItems.value.ljzhejiu = item.zjLj
      }
      formItems.value.jingzhi = sub(formItems.value.yuanzhi,formItems.value.ljzhejiu).toFixed(5)
      //添加行
      addRow()
      //计算合计
      countSum()
    }
  })
}

//行赋值
function saveRow(row,index){
  tableData.value[index] = row
  countSum()
}

//修改数量
function countShuliang(row,index){
  tableData.value[index] = row
  countSum()
  row.shuliangFlag='0'
}

//修改原值
function countYuanzhi(row,index){
  tableData.value[index] = row
  countSum()
  row.yuanzhiFlag='0'
}

//修改进项税额
function countJingxiangshui(row,index){
  tableData.value[index] = row
  countSum()
  row.jingxiangshuiFlag='0'
}

//修改累计折旧
function countLjzhejiu(row,index){
  tableData.value[index] = row
  countSum()
  row.ljzhejiuFlag='0'
}
//计算合计行
const shuliang = ref('0')
const yuanzhi = ref('0')
const jingxiangshui = ref('0')
const ljzhejiu = ref('0')
const jingzhi = ref('0')
function countSum(){
  shuliang.value = '0'
  yuanzhi.value = '0'
  jingxiangshui.value = '0'
  ljzhejiu.value = '0'
  tableData.value.forEach(item=>{
    if (formItems.value.jinxiangshuilv!=null && formItems.value.jinxiangshuilv!='') {
      item.jingxiangshui = mul(item.yuanzhi == '' ? '0' : item.yuanzhi, div(formItems.value.jinxiangshuilv, 100)).toFixed(5)
    }
    item.jingzhi = sub(item.yuanzhi==''?'0':item.yuanzhi,item.ljzhejiu==''?'0':item.ljzhejiu).toFixed(5)
    shuliang.value = add(shuliang.value,item.shuliang==''?'0':item.shuliang).toFixed(0)
    yuanzhi.value = add(yuanzhi.value,item.yuanzhi==''?'0':item.yuanzhi).toFixed(5)
    jingxiangshui.value = add(jingxiangshui.value,item.jingxiangshui==''?'0':item.jingxiangshui).toFixed(5)
    ljzhejiu.value = add(ljzhejiu.value,item.ljzhejiu==''?'0':item.ljzhejiu).toFixed(5)
  })
  jingzhi.value = sub(yuanzhi.value,ljzhejiu.value).toFixed(5)
  // console.log(tableData.value)
}

//验证资产编码是否重复
async function checkCode(row, index) {
  for (let i = 0; i < tableData.value.length; i++) {
    const item = tableData.value[i]
    if (i!=index){
      if(item.cardCode==row.cardCode){
        createErrorModal({
          iconType: 'warning',
          title: '提示',
          content: '资产编码已存在，请重新输入！'
        })
        row.cardCode = ''
        return false
      }
    }
  }
  if (row.cardCode == null || row.cardCode == '' || row.cardCode == tableData.value[index].cardCode) {
    return true
  }
  const res = await useRouteApi(findByCardCode, {schemaName: dynamicTenantId})(row.cardCode)
  if (res.length != 0) {
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '资产编码已存在，请重新输入！'
    })
    row.cardCode = ''
    return false
  }
}

//保存单据
async function saveData(){
  if (!saveCheck()){
    return false
  }
  loadMark.value = true
  //保存拆分表头
  await saveChaifenHead()
  if (isEdit.value=='0') {
    //保存卡片
    await saveCard()
  } else {
    //修改卡片
    await editCard()
  }
  loadMark.value = false
  isEdit.value='2'
  message.success('保存成功')
}

function saveCheck(){
  if (formItems.value.chaifenTime==null || formItems.value.chaifenTime==''){
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '拆分日期不能为空！'
    })
    return false
  }
  if (formItems.value.chaifenCode==null || formItems.value.chaifenCode==''){
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '单据编号不能为空！'
    })
    return false
  }
  if (formItems.value.cardUnique==null || formItems.value.cardUnique==''){
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '需要拆分的资产不能为空！'
    })
    return false
  }
  for (let i = 0; i < tableData.value.length; i++) {
    const item = tableData.value[i]
    if (item.cardCode==null || item.cardCode==''){
      createErrorModal({
        iconType: 'warning',
        title: '提示',
        content: '拆分资产编码不能为空！'
      })
      return false
    }
    if (item.faName==null || item.faName==''){
      createErrorModal({
        iconType: 'warning',
        title: '提示',
        content: '拆分资产名称不能为空！'
      })
      return false
    }
    if (item.shuliang==null || item.shuliang==''){
      createErrorModal({
        iconType: 'warning',
        title: '提示',
        content: '拆分资产数量不能为空！'
      })
      return false
    }
    if (item.yuanzhi==null || item.yuanzhi==''){
      createErrorModal({
        iconType: 'warning',
        title: '提示',
        content: '拆分资产原值不能为空！'
      })
      return false
    }
  }
  if (sub(formItems.value.yuanzhi,yuanzhi.value)!=0){
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '拆分资产原值合计必须等于原资产原值！'
    })
    return false
  }
  if (sub(formItems.value.ljzhejiu,ljzhejiu.value)!=0){
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '拆分资产累计折旧合计必须等于原资产累计折旧！'
    })
    return false
  }
  return true
}

//保存拆分表头
const chaifenHead: any = ref({})
async function saveChaifenHead(){
  chaifenHead.value.uniqueCode = formItems.value.uniqueCode
  chaifenHead.value.manageCode = formItems.value.manageCode
  chaifenHead.value.cardUnique = formItems.value.cardUnique
  chaifenHead.value.chaifenCode = formItems.value.chaifenCode
  chaifenHead.value.chaifenTime = formItems.value.chaifenTime
  chaifenHead.value.chaifenReason = formItems.value.chaifenReason
  chaifenHead.value.iyear = formItems.value.chaifenTime.substring(0,4)
  chaifenHead.value.imonth = formItems.value.chaifenTime.substring(5,7)
  chaifenHead.value = await useRouteApi(saveFaChaifenHead,{schemaName: dynamicTenantId})(chaifenHead.value)
}

//保存卡片
async function saveCard(){
  //查询卡片信息
  let cardMaster = await useRouteApi(findCardMasterByCardUnique, {schemaName: dynamicTenantId})(formItems.value.cardUnique)
  let change = await useRouteApi(findChangeByCardUnique, {schemaName: dynamicTenantId})(formItems.value.cardUnique)
  let changeDeptList = await useRouteApi(findChangeDeptByCardUnique, {schemaName: dynamicTenantId})(formItems.value.cardUnique)
  let changeProjectList = await useRouteApi(findChangeProjectByCardUnique, {schemaName: dynamicTenantId})(formItems.value.cardUnique)
  //获取最大系统编码
  const MaxSysId = await useRouteApi(findMaxSysId,{schemaName:dynamicTenantId})({})
  let sysId = '0'
  if (MaxSysId!=null && MaxSysId.sysId!=null && MaxSysId.sysId!=''){
    sysId = MaxSysId.sysId
  }
  formItems.value.cuserId = useUserStore().getUserInfo['realName']
  //原值单据变动
  change.id = null
  change.cdate = formItems.value.chaifenTime
  change.cuserId = formItems.value.cuserId
  change.chaifen = '1'
  change.jjTime = formItems.value.chaifenTime
  change.iyear = formItems.value.chaifenTime.substring(0,4)
  change.imonth = formItems.value.chaifenTime.substring(5,7)
  change.buyTime = cardMaster.buyTime
  await useRouteApi(saveFaChange, {schemaName: dynamicTenantId})(change)
  for (const item of tableData.value) {
    //保存主表信息
    sysId = pad(add(sysId,1),5)
    cardMaster.id = null
    cardMaster.cardUnique = buildUUID()
    cardMaster.sysId = sysId
    cardMaster.cardCode = item.cardCode
    cardMaster.faName = item.faName
    cardMaster.speciType = item.speciType
    cardMaster.jitiType = item.jitiType
    cardMaster.isYuanshi = '1'
    cardMaster.cuserId = formItems.value.cuserId
    cardMaster.cdate = formItems.value.chaifenTime
    cardMaster.creatTime = formItems.value.chaifenTime
    cardMaster.sourceCardUnique = formItems.value.cardUnique
    await useRouteApi(saveFaCardMaster, {schemaName: dynamicTenantId})(cardMaster)
    //保存变动表信息
    change.id = null
    change.cardUnique = cardMaster.cardUnique
    change.shuliang = item.shuliang
    change.yuanzhi = item.yuanzhi
    change.ljzhejiu = item.ljzhejiu
    change.jingxiangshui = item.jingxiangshui
    change.cuserId = formItems.value.cuserId
    change.chaifen = '0'
    change.jjTime = null
    change.cdate = formItems.value.chaifenTime
    change.iyear = formItems.value.chaifenTime.substring(0,4)
    change.imonth = formItems.value.chaifenTime.substring(5,7)
    change.buyTime = cardMaster.buyTime
    zhejiuMethodList.value.forEach(zhejiu=> {
      //平均年限法
      if (zhejiu.id == change.zhejiuMethod) {
        if (zhejiu.zjName == '平均年限法') {
          //月折旧率 = （1-净残值率）/使用年限*100
          change.yuezhejiulv = mul(div(sub(1, div(change.jingcanzhilv, 100)), change.life), 100).toFixed(5)
          //计算月折旧率
          formItems.value.yuezhejiulv = mul(div(sub(1, div(change.jingcanzhilv, 100)), sub(formItems.value.life,formItems.value.useLife)), 100).toFixed(5)
          //月折旧额 = （原值-累计折旧）*月折旧率
          change.yuezhejiue = mul(sub(change.yuanzhi,change.ljzhejiu), div(formItems.value.yuezhejiulv, 100)).toFixed(5)
        }
        //不计提
        if (zhejiu.zjName == '不计提') {
          change.yuezhejiulv = ''
          change.yuezhejiue = ''
        }
      }
    })
    await useRouteApi(saveFaChange, {schemaName: dynamicTenantId})(change)
  }
  //保存部门
  if (changeDeptList.length>0){
    changeDeptList.map(dept=>{
      dept.id=null
      dept.cardUnique = cardMaster.cardUnique
      dept.cdate = formItems.value.chaifenTime
      dept.iyear = formItems.value.chaifenTime.substring(0,4)
      dept.imonth = formItems.value.chaifenTime.substring(5,7)
      dept.cuserId = formItems.value.cuserId
    })
    await useRouteApi(saveFaChangeDeptList, {schemaName: dynamicTenantId})(changeDeptList)
  }
  //保存项目
  if (changeProjectList.length>0){
    changeProjectList.map(project=>{
      project.id=null
      project.cardUnique = cardMaster.cardUnique
      project.cdate = formItems.value.chaifenTime
      project.iyear = formItems.value.chaifenTime.substring(0,4)
      project.imonth = formItems.value.chaifenTime.substring(5,7)
      project.cuserId = formItems.value.cuserId
    })
    await useRouteApi(saveFaChangeProjectList, {schemaName: dynamicTenantId})(changeProjectList)
  }
}

//修改卡片
async function editCard(){
  for (const item of tableData.value) {
    //查询卡片信息
    let cardMaster = await useRouteApi(findCardMasterByCardUnique, {schemaName: dynamicTenantId})(item.cardUnique)
    let change = await useRouteApi(findChangeByCardUnique, {schemaName: dynamicTenantId})(item.cardUnique)
    //保存主表信息
    cardMaster.cardCode = item.cardCode
    cardMaster.faName = item.faName
    cardMaster.speciType = item.speciType
    cardMaster.jitiType = item.jitiType
    await useRouteApi(saveFaCardMaster, {schemaName: dynamicTenantId})(cardMaster)
    //保存变动表信息
    change.shuliang = item.shuliang
    change.yuanzhi = item.yuanzhi
    change.ljzhejiu = item.ljzhejiu
    change.jingxiangshui = item.jingxiangshui
    change.buyTime = cardMaster.buyTime
    zhejiuMethodList.value.forEach(zhejiu=> {
      //平均年限法
      if (zhejiu.id == change.zhejiuMethod) {
        if (zhejiu.zjName == '平均年限法') {
          //月折旧率 = （1-净残值率）/使用年限*100
          change.yuezhejiulv = mul(div(sub(1, div(change.jingcanzhilv, 100)), change.life), 100).toFixed(5)
          //计算月折旧率
          formItems.value.yuezhejiulv = mul(div(sub(1, div(change.jingcanzhilv, 100)), sub(formItems.value.life,formItems.value.useLife)), 100).toFixed(5)
          //月折旧额 = （原值-累计折旧）*月折旧率
          change.yuezhejiue = mul(sub(change.yuanzhi,change.ljzhejiu), div(formItems.value.yuezhejiulv, 100)).toFixed(5)
        }
        //不计提
        if (zhejiu.zjName == '不计提') {
          change.yuezhejiulv = ''
          change.yuezhejiue = ''
        }
      }
    })
    await useRouteApi(saveFaChange, {schemaName: dynamicTenantId})(change)
  }
}

const dynamicAdReload = async (obj) => {
  dynamicTenantId.value = obj.accountMode
  defaultAdName.value = obj.accId
  year.value = obj.year
  formItems.value.uniqueCode = obj.accId
  await reloadList()
}

</script>
<style src="../../../../assets/styles/global-menu-index.less" lang="less" scoped></style>
<style scoped lang="less">
.app-container {
  background-color: #f2f2f2;
  padding: 10px 0 0;
  margin: 10px 10px 5px;
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
      :deep(.ant-select-selector), :deep(.ant-picker), .ant-input {
        border: none;
        border-bottom: 1px solid #c9c9c9;
        background-color: white;
        color: black;

        .ant-picker-input {
          > input {
            color: black;
          }
        }
      }

      > span {
        font-weight: bold;
        color: #666666;
        //margin-left: 4%;
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

:deep(.ant-calendar-picker-input.ant-input), :deep(.ant-input) {
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

:deep(.ant-input-affix-wrapper){
  border: none;
  border-bottom: solid 1px rgb(191, 191, 191) !important;
  width: 100%;
  font-size: 14px;
  font-weight: bold;
  .ant-input {
    border: none !important;
  }
}

.red_span {
  color: red;
  font-weight: bold;
  display: inline-block;
  width: 20px;
  text-align: right;
}

:deep(.open-content-down) {
  margin-top: 30px;
  background-color: #ffffff;
  .acco-sideline-content {
    margin: 10px;

    label {
      text-align: left;
      width: 7%;
      display: inline-block;
      padding-top: 5px;
      padding-bottom: 5px;
      padding-left: 2em;
      color: #535353;
      font-size: 13px;
      font-weight: bold;
    }
  }
}

:deep(.ant-table-thead) th{
  text-align: center !important;
  background: #c9c7c7;
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

</style>
