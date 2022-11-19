<template>
  <div class="app-container">
    <div class="app-container-top" style="background-color: #c9c7c7;">
      <div class="app-container-top-one">
        <div class="act-one-d-left" style="width: 22%;"></div>
        <div class="act-one-d-title">

        </div>
        <div class="act-one-d-btn-group">
          <Button class="actod-btn" @click="openQpage" v-if="status == 3">新增</Button>
          <Button class="actod-btn" @click="saveData" :disabled="saveBtnR" v-if="status == 1 || status == 2">保存</Button>
          <Button class="actod-btn" @click="giveUp" v-if="status == 1 || status == 2">放弃</Button>
          <Button class="actod-btn" @click="startEdit"
                  v-if="status == 3 && (!isSettle) && hasBlank(formItems.verifyUsername)">修改
          </Button>
          <Button class="actod-btn" @click="tableAdd" v-if="status == 1 || status == 2">增行</Button>
          <Button class="actod-btn" @click="startDel" v-if="status == 1 || status == 2">删行</Button>
          <Button class="actod-btn" @click="startDel"
                  v-if="status == 3 && (!isSettle) && hasBlank(formItems.verifyUsername)">删除
          </button>
          <Button class="actod-btn" @click="startReview" v-if="status == 3 && (!isSettle)">
            {{ hasBlank(formItems.verifyUsername) ? '审核' : '弃审' }}
          </button>
          <Button v-if="status == 3" class="actod-btn" @click="exportExcel()">导出</Button>
          <Button v-if="status == 3" class="actod-btn" @click="printData()">打印</Button>
          <Button class="actod-btn actod-btn-last" @click="closeCurrent()">退出</Button>
        </div>
      </div>
      <div class="app-container-top-two" :class="status != 3?'status-look':''">
        <div class="act-two-d-left">
          <AccountPicker theme="one" @reloadTable="dynamicAdReload"/>
        </div>
        <div class="act-two-d-center">
<!--          <span>管理代码：</span>
          <Select class="acttdrd-search-select" v-model:value="pageParameter.managementCode"
                  style="width: 200px;" placeholder="FA">
            <template #suffixIcon>
              <SearchOutlined/>
            </template>
            <SelectOption v-for="item in faAccountList" :value="item.split('==')[0]">FA{{
                item.split('==')[1] + ' - ' + item.split('==')[2]
              }}
            </SelectOption>
          </Select>-->
        </div>
        <div class="act-two-d-right">
          <div class="acttd-right-d-search">
            <InputSearch
              class="acttdrd-search-input"
              placeholder="资产编码"
              style="border-left:1px solid #c9c9c9;"
            />
          </div>
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
            <Button class="acttdrd-btn">
              <FilterFilled :style="{ fontSize: '14px' }"/>
            </Button>
          </div>
        </div>
      </div>
    </div>
    <div class="app-container-bottom" :style="{height: (windowHeight+60)+'px'}">
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
          </div>
          <span style="font-size: 22px;color: #0096c7;font-weight: bold;">资产变动单</span>
          <span
            style="font-size: 18px;color: red;font-weight: bold;margin-left: 5%;display: inline-block"
            v-if="!hasBlank(formItems.verifyUsername)">已审核</span><span
          v-else>&emsp;&emsp;&emsp;</span>
        </div>
        <div class="acbgead-two" :class="status == 3?'status-look':''">
          <span>变动日期：</span>
          <DatePicker :locale="localeCn" v-model:value="formItems.changeDate"
                      :disabled="status != 1"
                      :disabled-date="disabledDate"
                      placeholder="" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                      style="width: 120px"/>
          <span>单据编号：</span> <Input v-model:value="formItems.changeCode"
                                    style="width: 10%"/>
          <span>变动原因：</span>
          <Input style="width: 15%"
                 v-model:value="formItems.changeCause"/>
          <span>变动内容：</span>
          <Input :disabled="true" style="width: 20%"
                 :value="changeContentText(formItems.changeContent)"/>
          <br/><br/>
        </div>
      </div>
      <div class="acb-centent">
        <!--  针对过滤框显示添加的内容高度  -->
        <!--    :class="status == 3?'status-look':''"      :rowKey="r=>r.assetsCode"-->
        <BasicTable
          ref="tableRef"
          :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
          :row-selection="{ type: 'checkbox',fixed: true,selectedRowKeys: tableSelectedRowKeys, onChange: onSelectChange }"
          :scroll="{ y: windowHeight-160 }"
          :loading="loadMark"
          size="small"
          @register="registerTable"
        >
          <template #sysId="{ record }">
            <template v-if="record?.editOne">
              <Select
                v-model:value="record.tempOne"
                show-search
                style="width: 88%;"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                :options="cardListOptions"
                @search="value=>handleSearch(value,'one')"
                @change="value=>handleChange(value,'one')"
              ></Select>
              <CheckOutlined
                @click="record.editOne = null;record.sysId=record.tempOne;rowDataGrab(record,'one');"/>
            </template>
            <template v-else>
              <span class="a-table-font-arial">{{ record.sysId }}
              <SearchOutlined v-if="status == 1 || status == 2"
                            @click="record.editOne = true;record.editTwo = null;record.editThree = null;record.tempOne=record.sysId"/></span>
            </template>
          </template>
          <template #assetsCode="{ record }">
            <template v-if="record?.editTwo">
              <Select
                v-model:value="record.tempTwo"
                show-search
                style="width: 88%;"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                :options="cardListOptions"
                @search="value=>handleSearch(value,'two')"
                @change="value=>handleChange(value,'two')"
              ></Select>
              <CheckOutlined
                @click="record.editTwo = null;record.assetsCode=record.tempTwo;rowDataGrab(record,'two');"/>
            </template>
            <template v-else>
              <span class="a-table-font-arial">{{ record.assetsCode }}
              <SearchOutlined v-if="status == 1 || status == 2"
                            @click="record.editOne = null;record.editTwo = true;record.editThree = null;record.tempTwo=record.assetsCode"/></span>
            </template>
          </template>
          <template #assetsName="{ record }">
            <template v-if="record?.editThree">
              <Select
                v-model:value="record.tempThree"
                show-search
                style="width: 92%;"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                :options="cardListOptions"
                @search="value=>handleSearch(value,'three')"
                @change="value=>handleChange(value,'three')"
              ></Select>
              <CheckOutlined
                @click="record.editThree = null;record.assetsName=record.tempThree;rowDataGrab(record,'three');"/>
            </template>
            <template v-else>
              <span>{{ record.assetsName }}
              <SearchOutlined v-if="status == 1 || status == 2"
                            @click="record.editOne = null;record.editTwo = null;record.editThree = true;record.editThree = true;record.tempThree=record.assetsName"/></span>
            </template>
          </template>
          <template #changeCause="{ record }">
            <template v-if="record?.editFour">
              <Input v-model:value="record.tempFour"
                     style="width: 90%;"
                     @keyup.enter="record.editFour = null;record.changeCause=record.tempFour;"/>
              <CheckOutlined @click="record.editFour = null;record.changeCause=record.tempFour;"/>
            </template>
            <template v-else>
              <span>{{ record.changeCause }}
              <EditOutlined v-if="status == 1 || status == 2"
                            @click="record.editFour = true;record.tempFour=record.changeCause"/></span>
            </template>
          </template>

          <template #changeAfter1="{ record}">
            <template v-if="record?.editFive">
              <Input v-model:value="record.tempFive" v-if="getChangeType('1') == 'INPUT'"
                     style="width: 86%;"
                     @keyup.enter="record.editFive = null;record.changeAfter1=record.tempFive;"/>
              <Select v-model:value="record.tempFive" v-else style="width: 86%;"
                      :options="changeAfterOptions['1']"></Select>
              <CheckOutlined @click="record.editFive = null;record.changeAfter1=record.tempFive;"/>
            </template>
            <template v-else>
              <span v-if="getChangeType('1') == 'INPUT'" class="a-table-font-arial">{{
                  record.changeAfter1
                }}</span>
              <span v-else style="display: inline-block;min-width: 86%;">{{
                  getCurrSelectText(record.changeAfter1, '1', record)
                }}</span>
              <EditOutlined
                v-if="( null != record?.assetsName && (getChangeType('1')).indexOf('OPEN')==-1) && (status == 1 || status == 2)"
                @click="record.editFive = true;record.tempFive=record.changeAfter1"/>
              <EditOutlined
                v-if="(null != record?.assetsName && (getChangeType('1')).indexOf('OPEN')!=-1) && (status == 1 || status == 2)"
                @click="openOther(record,'1')"/>
            </template>
          </template>

          <!-- class="a-table-font-arial"
                         :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                     :parser="value => value.replace(/\$\s?|(,*)/g, '')"-->
          <template #changeAfter2="{ record }">
            <template v-if="record?.editSix">
              <Input v-model:value="record.tempSix" v-if="getChangeType('2') == 'INPUT'"
                     style="width: 86%;"
                     @keyup.enter="record.editSix = null;record.changeAfter2=record.tempSix;"/>
              <Select v-model:value="record.tempSix" v-else style="width: 86%;"
                      :options="changeAfterOptions['2']"></Select>
              <CheckOutlined @click="record.editSix = null;record.changeAfter2=record.tempSix;"/>
            </template>
            <template v-else>
              <span v-if="getChangeType('2')  == 'INPUT'" class="a-table-font-arial">{{
                  record.changeAfter2
                }}</span>
              <span v-else style="display: inline-block;min-width: 86%;">{{
                  getCurrSelectText(record.changeAfter2, '2', record)
                }}</span>
              <EditOutlined
                v-if="( null != record?.assetsName && (getChangeType('2')).indexOf('OPEN')==-1) && (status == 1 || status == 2)"
                @click="record.editSix = true;record.tempSix=record.changeAfter2"/>
              <EditOutlined
                v-if="(null != record?.assetsName && (getChangeType('2')).indexOf('OPEN')!=-1) && (status == 1 || status == 2)"
                @click="openOther(record,'2')"/>
            </template>
          </template>
          <template #changeAfter3="{ record }">
            <template v-if="record?.editSeven">
              <Input v-model:value="record.tempSeven" v-if="getChangeType('3')  == 'INPUT'"
                     style="width: 86%;"
                     @keyup.enter="record.editSeven = null;record.changeAfter3=record.tempSeven;"/>
              <Select v-model:value="record.tempSeven" v-else style="width: 86%;"
                      :options="changeAfterOptions['3']"></Select>
              <CheckOutlined
                @click="record.editSeven = null;record.changeAfter3=record.tempSeven;"/>
            </template>
            <template v-else>
              <span v-if="getChangeType('3')  == 'INPUT'" class="a-table-font-arial">{{
                  record.changeAfter3
                }}</span>
              <span v-else style="display: inline-block;min-width: 86%;">{{
                  getCurrSelectText(record.changeAfter3, '3', record)
                }}</span>
              <EditOutlined
                v-if="( null != record?.assetsName && (getChangeType('3')).indexOf('OPEN')==-1) && (status == 1 || status == 2)"
                @click="record.editSeven = true;record.tempSeven=record.changeAfter3"/>
              <EditOutlined
                v-if="(null != record?.assetsName && (getChangeType('3')).indexOf('OPEN')!=-1) && (status == 1 || status == 2)"
                @click="openOther(record,'3')"/>
            </template>
          </template>
          <template #changeBefore1="{ record }">
            <span v-if="getChangeType('1') == 'INPUT'" class="a-table-font-arial">{{
                record.changeBefore1
              }}</span>
            <span v-else style="display: inline-block;min-width: 86%;">{{
                getCurrSelectText(record.changeBefore1, '1', record)
              }}</span>
          </template>
          <template #changeBefore2="{ record }">
            <span v-if="getChangeType('2') == 'INPUT'" class="a-table-font-arial">{{
                record.changeBefore2
              }}</span>
            <span v-else style="display: inline-block;min-width: 86%;">{{
                getCurrSelectText(record.changeBefore2, '2', record)
              }}</span>
          </template>
          <template #changeBefore3="{ record }">
            <span v-if="getChangeType('3') == 'INPUT'" class="a-table-font-arial">{{
                record.changeBefore3
              }}</span>
            <span v-else style="display: inline-block;min-width: 86%;">{{
                getCurrSelectText(record.changeBefore3, '3', record)
              }}</span>
          </template>

        </BasicTable>
        <Query
          @query="loadPage"
          @register="registerQueryPage"
        />
        <AddDept
          @save="saveAddDept"
          @register="registerAddDeptPage"
        />
        <AddProject
          @save="saveAddProject"
          @register="registerAddProjectPage"
        />
      </div>
    </div>
  </div>
</template>
<script setup="props, {emit}" lang="ts">
import {
  Input,
  InputNumber,
  Select,
  Popover,
  Tabs,
  DatePicker,
  Button,
  Radio,
  message
} from "ant-design-vue";
import Query from "./popup/query.vue";
// import Import from "./popup/import.vue";
import localeCn from 'ant-design-vue/es/date-picker/locale/zh_CN';

const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const InputSearch = Input.Search
const SelectOption = Select.Option
const TabPane = Tabs.TabPane
import {
  SettingFilled,
  SyncOutlined,
  FilterFilled,
  CheckOutlined,
  EditOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  VerticalLeftOutlined,
  VerticalRightOutlined,
  LeftOutlined,
  RightOutlined, SearchOutlined
} from '@ant-design/icons-vue';
import {onMounted, reactive, ref, computed, watch, onActivated, onUpdated} from "vue";
import {useMessage} from "/@/hooks/web/useMessage";
import {getCurrentAccountName, hasBlank} from "/@/api/task-api/tast-bus-api";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-GDZC.vue";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {psnFindByFlag} from "/@/api/psn/psn";
import AddDept from '/@/views/boozsoft/gdzc/gu-ding-zi-chan-add/popup/add-dept.vue'
import AddProject from '/@/views/boozsoft/gdzc/gu-ding-zi-chan-add/popup/add-project.vue'

const {createErrorModal, createConfirm} = useMessage()
const {closeCurrent} = useTabs(router);
const windowHeight = (window.innerHeight - 300)
const faAccountList = ref([])
const dynamicTenantId = ref(getCurrentAccountName(true))
const pageParameter = reactive({
  showRulesSize: 'MIN',
  searchConditon: {
    requirement: '',
    value: '',
  },
  managementCode: ''
})
const changeAfterOptions = reactive({
  '1': [],
  '2': [],
  '3': []
})
const formItems: any = ref({})
const saveBtnR = ref(false)
const changeBtns = ref({
  first: true,
  prev: true,
  next: true,
  tail: true,
})

import {JsonTool} from "/@/api/task-api/tools/universal-tools";

const dynamicAdReload = async (obj) => {
  dynamicTenantId.value = obj.accountMode
  pageParameter.managementCode = obj.managementCode
  if (pageParameter.managementCode == '') {
    message.warning('请先建立该公司下资产账后进行操作！')
  }else {
    assetsDate.value = obj.managementYearInfo.date
    formItems.value = {}
    setTableData([])
    assetCardList.value = await useRouteApi(findCardMasterEffectiveAll, {schemaName: dynamicTenantId})({})
    if (null != route.query && Object.keys(route.query).length >= 2) {
      pageParameter.managementCode  = route.query.code
      if (route.query.status == '1') {
        openQpage()
      } else {
        formItems.value.changeCode = route.query.pId
        await contentSwitch('curr')
      }
    } else {
      await contentSwitch('tail')
    }
  }
}

const route = useRoute();

const pageReload = async () => {
  if (!hasBlank(pageParameter.managementCode) && !hasBlank(formItems.value.changeCode)) {
    await contentSwitch('curr')
  }
}

const isSettle = ref(false) //当前年月是否记账
const assetsDate = ref('')
const assetCardList = ref([])
async function reloadList(obj) {
  faAccountList.value = await findAssetsUniqueCodeAndCode({code: dynamicTenantId.value.substring(0, dynamicTenantId.value.length - 5)}) || []
  // 校验权限问题
  if (faAccountList.value.length > 0) {

    if (faAccountList.value.length == 1) {
      pageParameter.managementCode = faAccountList.value[0].split('==')[0]
    } else {
      let codes = (await findByAuthAssetsByUniqueCode({code: useUserStoreWidthOut().getUserInfo.id})).map(it => it.manageUniqueCode)
      if (null != codes && codes.length > 0) {
        if (null != codes[0]) {
          faAccountList.value = faAccountList.value.filter(it => codes.indexOf(it.split('==')[0]) != -1)
          pageParameter.managementCode = faAccountList.value[0].split('==')[0]
        }
      } else {
        faAccountList.value = []
        pageParameter.managementCode = ''
        message.warning('请先获取管理代码权限!')
      }
    }
  } else {
    pageParameter.managementCode = ''
    message.warning('请先建立资产账！')
  }
}

function formatUniqueCodeCard(uniqueCodeDept: any, key) {
  let str = uniqueCodeDept
  assetCardList.value.forEach(
    function (dept: any) {
      if (dept.cardUnique == uniqueCodeDept) {
        str = dept[key]
      }
    }
  )
  return str || ''
}

async function contentSwitch(action) {
  if (!hasBlank(pageParameter.managementCode)) {
    loadMark.value = true
    let res = await useRouteApi(findFaChangeByCondition, {schemaName: dynamicTenantId})({
      code: pageParameter.managementCode,
      action: action,
      curr: formItems.value.changeCode
    })
    if (null != res) {
      let oldDate = formItems.value.changeDate || ''
      formItems.value = res
      formItems.value.changeContent = JsonTool.parseObj(formItems.value.changeContent)
      if (!hasBlank(formItems.value.beiyong5)) {
        setTableData([])
        await changeColumns(formItems.value.changeContent)
        let dbList = JsonTool.parseObj(formItems.value.beiyong5)
        formItems.value.beiyong5 = null
        let dbBList = JsonTool.parseObj(formItems.value.beiyong4)
        formItems.value.beiyong4 = null
        if (formItems.value.changeContent.length > 0) {
          let arr = formItems.value.changeContent
          changeContents.value[9]['type'] = 'SELECT'
          changeContents.value[10]['type'] = 'SELECT'
          for (let i = 0; i < arr.length; i++) {
            let key = arr[i]
            dbList.forEach((it, index) => {
              it['sysId']      = formatUniqueCodeCard(it.cardUnique,'sysId')
              it['assetsCode'] =  formatUniqueCodeCard(it.cardUnique,'cardCode')
              it['assetsName'] =  formatUniqueCodeCard(it.cardUnique,'faName')
              if (key == 'DEPT' || key == 'PRO') {
                let ds = JsonTool.parseObj(it.beiyong1)
                let ps = JsonTool.parseObj(it.beiyong2)
                let oldE = dbBList[index]
                if (key == 'DEPT' && ds.length > 0) {
                  let jds = []
                  if (dbBList.length > 0 && !hasBlank(oldE['beiyong1'])) jds = JsonTool.parseObj(oldE['beiyong1'])
                  it[`changeBefore${i + 1}`] = jds.map(dt => dt.deptUnique)
                  it[`changeBeforeOpen${i + 1}`] = jds
                  it[`changeAfter${i + 1}`] = ds.map(dt => dt.deptUnique)
                  it[`changeAfterOpen${i + 1}`] = ds
                  it['zhejiuType'] = ds[0]['isMany'] == '1' ? '0' : ''
                  changeContents.value[9]['type'] = 'DEPTOPEN'
                } else if (key == 'PRO' && ps.length > 0) {
                  let jds = []
                  if (dbBList.length > 0 && !hasBlank(dbBList[index]['beiyong2'])) jds = JsonTool.parseObj(dbBList[index]['beiyong2'])
                  it[`changeBefore${i + 1}`] = jds.map(dt => dt.deptUnique)
                  it[`changeBeforeOpen${i + 1}`] = jds
                  it[`changeAfter${i + 1}`] = ps.map(dt => dt.projectUnique)
                  it[`changeAfterOpen${i + 1}`] = ps
                  it['zhejiuType'] = ps[0]['isMany'] == '1' ? '0' : ''
                  changeContents.value[10]['type'] = 'PROOPEN'
                } else {
                  it[`changeBefore${i + 1}`] = []
                  it[`changeAfter${i + 1}`] = []
                  it[`changeAfterOpen${i + 1}`] = []
                  it[`changeBeforeOpen${i + 1}`] = []
                  changeContents.value[9]['type'] = 'DEPTOPEN'
                  changeContents.value[10]['type'] = 'PROOPEN'
                }
                it[`beiyong1`] = ''
                it[`beiyong2`] = ''
              } else {
                it[`changeBefore${i + 1}`] = dbBList.length > 0 ? dbBList[index][key] : it[key]
                it[`changeAfter${i + 1}`] = it[key]
              }
            })

          }
        }
        setTableData(dbList)
      }
      formItems.value.beiyong5 = null
      if (oldDate.substring(0, 7) != formItems.value.changeDate.substring(0, 7)) {
        let e = await findFaCheckByDate({
          code: pageParameter.managementCode,
          date: formItems.value.changeDate
        })
        isSettle.value = (null == e || e.isSettle == '1')
      }
    } else {
      message.success('暂无数据！')
    }
    loadMark.value = false
  }
}

import {BasicTable, useTable} from '/@/components/Table'
import {useModal} from '/@/components/Modal'
import {
  delChange,
  findLastFaChangeInfoByCode, findFaAssetListByCondition,
  findFaInvoiceByDate,
  findFaChangeByCondition, reviewChange,
  saveChange
} from "/@/api/fa/fa-change";
import {
  findAssetsDate,
  findAssetsUniqueCodeAndCode,
  findByAuthAssetsByUniqueCode
} from "/@/api/record/group/im-unit";
import {findDeptAll} from "/@/api/record/generalLedger/data";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {useRoute} from "vue-router";
// 0 暂存 1 新建 2编辑 3查看
const status = ref(3)

const CrudApi = {
  columns: [
    {
      title: '系统编码',
      dataIndex: 'sysId',
      ellipsis: true,
      slots: {customRender: 'sysId'},
      width: 130
    },
    {
      title: '资产编码',
      dataIndex: 'assetsCode',
      ellipsis: true,
      slots: {customRender: 'assetsCode'},
      width: 130
    },
    {
      title: '资产名称',
      dataIndex: 'assetsName',
      ellipsis: true,
      align: 'left',
      slots: {customRender: 'assetsName'},
      width: 300
    },
    {
      title: '变动原因',
      dataIndex: 'changeCause',
      ellipsis: true,
      align: 'left',
      width: 180,
      slots: {customRender: 'changeCause'},
    }
  ]
}
// 这是示例组件
const [registerTable, {
  reload,
  getDataSource,
  setTableData, getColumns, setColumns,
  setPagination,
  getPaginationRef
}] = useTable({
  columns: CrudApi.columns,
  bordered: true,
  showIndexColumn: false,
  pagination: {
    pageSize: 30,
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
const [registerQueryPage, {openModal: openQueryPageM}] = useModal()
const openQpage = async () => {
  if (!hasBlank(pageParameter.managementCode)) {
    openQueryPageM(true, {
      data: {
        code: pageParameter.managementCode,
        mode: dynamicTenantId.value,
        date: assetsDate.value
      }
    })
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请先给该公司创建固定资产账！'
    })
  }
}

const changeContents = ref(
  [
    {value: "yuanzhi", label: '原值', type: 'INPUT'},// not 0
    {value: "ljzhejiu", label: '累计折旧/摊销', type: 'INPUT'},
    {value: "jingcanzhilv", label: '预计净残值(率)', type: 'INPUT'},
    {value: "zhejiuMethod", label: '折旧/摊销方法', type: 'SELECT'},
    {value: "life", label: '预计使用年限(月)', type: 'INPUT'},// not 0
    {value: "shuliang", label: '数量', type: 'INPUT'},
    {value: "faClass", label: '资产分类', type: 'SELECT'},
    {value: "zongliang", label: '预计工作总量', type: 'INPUT'},
    {value: "addr", label: '存放位置', type: 'SELECT'},
    {value: "DEPT", label: '部门', type: 'SELECT'},
    {value: "PRO", label: '项目', type: 'SELECT'},
    {value: "zerenUser", label: '责任人', type: 'SELECT'},
    {value: "useType", label: '使用状况', type: 'SELECT'},
    {value: "jinxiangshuilv", label: '进项税率', type: 'INPUT'}
  ]
)

function changeContentText(arr) {
  if (null == arr) return ''
  return changeContents.value.filter(it => arr.indexOf(it.value) != -1).map(it => it.label).join(',')
}

const loadPage = async (o) => {
  formItems.value = {id: null}
  formItems.value.changeDate = o.date
  formItems.value.changeCode = o.code
  formItems.value.changeContent = o.values
  formItems.value.makerUsername = useUserStoreWidthOut().getUserInfo.username
  // 改变动态列
  setTableData([])
  await changeColumns(o.values)
  // 初始化列
  let maxR = 20
  let list = []
  for (let i = 0; i < maxR; i++) {
    list.push({})
  }
  setTableData(list)
  status.value = 1
}
const tableDataGroup = reactive({
  assetClasOptions: [],
  amortMethodOptions: [],
  storageLocationOptions: [],
  deptOptions: [],
  userOptions: [],
  proOptions: [],
  usageStatusOptions: [],
})
const changeColumns = async (values) => {
  if (null != values && values.length > 0) {
    let arr = changeContentText(values).split(',')
    let thisCs = getColumns().filter(it => ['change1', 'change2', 'change3'].indexOf(it.dataIndex) == -1)
    for (let i = 0; i < arr.length; i++) {
      let name = arr[i]
      let c = {
        title: name,
        dataIndex: `change${i + 1}`,
        width: 240,
        children: [
          {
            title: '变动前',
            dataIndex: `changeBefore${i + 1}`,
            width: 120,
            ellipsis: true,
            slots: {customRender: `changeBefore${i + 1}`},
          },
          {
            title: '变动后',
            dataIndex: `changeAfter${i + 1}`,
            width: 120, ellipsis: true,
            slots: {customRender: `changeAfter${i + 1}`},
          }
        ]
      }
      thisCs.push(c)
      if ('SELECT' == getChangeType(`${i + 1}`)) await initOptions(i, values)
    }
    setColumns(thisCs)
  }
}

async function initOptions(i, values) {
  let theOptions = []
  switch (values[i]) {
    case 'faClass':
      if (tableDataGroup.assetClasOptions.length == 0) {
        let arr = await useRouteApi(findFaAssetTypeByFlagAndBend, {schemaName: dynamicTenantId})({})
        tableDataGroup.assetClasOptions = arr.map(it => ({
          'value': it.uniqueCode,
          'label': it.ecName
        }))
      }
      theOptions = tableDataGroup.assetClasOptions
      break
    case 'zhejiuMethod':
      if (tableDataGroup.amortMethodOptions.length == 0) {
        let arr = await useRouteApi(findZhejiuMethodByFlag, {schemaName: dynamicTenantId})({})
        tableDataGroup.amortMethodOptions = arr.map(it => ({
          'value': it.id,
          'label': it.zjName
        }))
      }
      theOptions = tableDataGroup.amortMethodOptions
      break
    case 'addr':
      if (tableDataGroup.storageLocationOptions.length == 0) {
        let arr = await useRouteApi(findLocationByFlagAndBend, {schemaName: dynamicTenantId})({})
        tableDataGroup.storageLocationOptions = arr.map(it => ({
          'value': it.uniqueCode,
          'label': it.ecName
        }))
      }
      theOptions = tableDataGroup.storageLocationOptions
      break
    case 'DEPT':
      if (tableDataGroup.deptOptions.length == 0) {
        let arr = await useRouteApi(findDeptAll, {schemaName: dynamicTenantId})({})
        deptList.value = arr;
        tableDataGroup.deptOptions = arr.map(it => ({
          'value': it.uniqueCode,
          'label': it.deptName
        }))
      }
      theOptions = tableDataGroup.deptOptions
      break
    case 'PRO':
      if (tableDataGroup.proOptions.length == 0) {
        let arr = await useRouteApi(findAllProject, {schemaName: dynamicTenantId})({})
        projectList.value = arr;
        tableDataGroup.proOptions = arr.map(it => ({
          'value': it.uniqueCode,
          'label': it.projectName
        }))
      }
      theOptions = tableDataGroup.proOptions
      break
    case 'zerenUser':
      if (tableDataGroup.userOptions.length == 0) {
        let arr = await useRouteApi(psnFindByFlag, {schemaName: dynamicTenantId})({})
        tableDataGroup.userOptions = arr.map(it => ({
          'value': it.uniqueCode,
          'label': it.ecName
        }))
      }
      theOptions = tableDataGroup.userOptions
      break
    case 'useType':
      if (tableDataGroup.usageStatusOptions.length == 0) {
        let arr = await useRouteApi(findFaUsageStatusByFlagAndBend, {schemaName: dynamicTenantId})({})
        tableDataGroup.usageStatusOptions = arr.map(it => ({
          'value': it.uniqueCode,
          'label': it.ecName
        }))
      }
      theOptions = tableDataGroup.usageStatusOptions
      break
  }
  changeAfterOptions[`${i + 1}`] = theOptions
}

function getChangeType(v) {
  if (null != formItems.value.changeContent && formItems.value.changeContent.length > 0) {
    let value = formItems.value.changeContent[parseInt(v - 1)]
    return (changeContents.value.filter(it => it.value == value)[0]?.type)
  }
  return '';
}

function getCurrSelectText(v, type, objE) {
  let text = ''
  if (null == v || hasBlank(v) || hasBlank(formItems.value.changeContent)) return text
  let key = formItems.value.changeContent[parseInt(type - 1)]
  let list = []
  switch (key) {
    case 'faClass':
      list = tableDataGroup.assetClasOptions
      break
    case 'zhejiuMethod':
      list = tableDataGroup.amortMethodOptions
      break
    case 'addr':
      list = tableDataGroup.storageLocationOptions
      break
    case 'DEPT':
      list = tableDataGroup.deptOptions
      break
    case 'PRO':
      list = tableDataGroup.proOptions
      break
    case 'zerenUser':
      list = tableDataGroup.userOptions
      break
    case 'useType':
      list = tableDataGroup.usageStatusOptions
      break
  }
  if ((objE.zhejiuType == '0' && key == 'DEPT') || (objE.zhejiuType == '1' && key == 'PRO')) {
    let arr = list.filter(it => v.indexOf(it.value) != -1).map(it => it.label)
    if (arr.length > 0) text = arr.join(',')
  } else {
    if (list.length > 0)
      text = list.filter(it => it.value == v)[0].label
  }
  return text;
}

const tableAdd = () => {
  let list = getDataSource()
  list.push({changeCause: formItems.value.czMethod})
  setTableData(list)
}

const startEdit = () => {
  if (!hasBlank(pageParameter.managementCode)) {
    status.value = 2
    let maxR = 20
    let list = getDataSource()
    let dLen = list.length
    for (let i = 0; i < (maxR - dLen); i++) {
      list.push({changeCause: formItems.value.czMethod})
    }
    setTableData(list)
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请先给该公司创建固定资产账！'
    })
  }
}


const startDel = async () => {
  if (null == formItems.value || hasBlank(formItems.value.id)) {

  } else if (!hasBlank(formItems.value.verifyUsername) || false) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '固定资产账该月已结账或变动单已审核不能删除！'
    })
  } else {
    if (status.value == 3) {
      createConfirm({
        iconType: 'warning',
        title: '盘点单删除',
        content: '您确定要进行盘点单删除吗!',
        onOk: async () => {
          await useRouteApi(delChange, {schemaName: dynamicTenantId})({id: formItems.value.id})
          message.success('删除成功！')
          formItems.value.changeCode = ''
          await contentSwitch('prev')
        }
      });
    } else if (status.value == 1 || status.value == 2) {
      if (tableSelectedRowKeys.value.length == 0) {
        createErrorModal({
          iconType: 'warning',
          title: '温馨提示',
          content: '请至少选择一条资产！'
        })
      } else {
        let tables = getDataSource()
        tables = tables.filter(it => tableSelectedRowObjs.value[0]?.key.indexOf(it.key) == -1)
        setTableData(tables)
        tableSelectedRowKeys.value = []
      }
    }
  }
}

const startReview = async () => {
  let a = useUserStoreWidthOut().getUserInfo.username
  if (!hasBlank(a) && !hasBlank(formItems.value.id)) {
    await useRouteApi(reviewChange, {schemaName: dynamicTenantId})({
      id: formItems.value.id,
      verifyUsername: a
    })
    message.success('审核成功！')
    await pageReload()
  } else {
    if (hasBlank(a)) message.error('获取用户信息异常！')
  }
}

const loadMark = ref(false)

//保存验证
function saveCheck() {
  if (formItems.value.changeDate == null || formItems.value.changeDate == "") {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '变动日期不能为空！'
    })
    return false
  }
  if (formItems.value.changeCode == null || formItems.value.changeCode == "") {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '单据编号不能为空！'
    })
    return false
  }
  if (formItems.value.changeContent == null || hasBlank(formItems.value.changeContent)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '变动内容不能为空！'
    })
    return false
  }
  let list = getDataSource()
  if (list.length == 0) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '列表资产内容至少存在一条！'
    })
    return false
  } else if ((list.filter(it => !hasBlank(it.sysId) && !hasBlank(it.assetsCode) && !hasBlank(it.assetsName))).length == 0) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '列表资产内容:系统编码、资产编码和资产名称为必选项,且必须存在一条！'
    })
    return false
  } else if ((list.filter(it => (it?.changeBefore1 != it?.changeAfter1) || (it?.changeBefore2 != it?.changeAfter2) || (it?.changeBefore3 != it?.changeAfter3))).length == 0) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '列表资产内容:【' + changeContentText(formItems.value.changeContent) + '】为变动项不得为空且必须存在变动！'
    })
    return false
  }
  return true
}

//计算公式
const zhejiuMethodList:any = ref()
async function calculationFormula(list: any) {
  list = transformChange(getDataSource().filter(it => !hasBlank(it.sysId) && !hasBlank(it.assetsCode) && !hasBlank(it.assetsName)), formItems.value.changeContent)
  zhejiuMethodList.value = await useRouteApi(findZhejiuMethodByFlag, {schemaName: dynamicTenantId})({})
  for (const change of list) {
    const cardMaster = await useRouteApi(findCardMasterByCardUnique, {schemaName: dynamicTenantId})(change.cardUnique)
    const change1 = await useRouteApi(findChangeByCardUnique, {schemaName: dynamicTenantId})(change.cardUnique)
    change.yuanzhi = change.yuanzhi == null ? change1.yuanzhi : change.yuanzhi
    change.ljzhejiu = change.ljzhejiu == null ? change1.ljzhejiu : change.ljzhejiu
    change.life = change.life == null ? change1.life : change.life
    change.zhejiuMethod = change.zhejiuMethod == null ? change1.zhejiuMethod : change.zhejiuMethod
    change.jingcanzhilv = change.jingcanzhilv == null ? change1.jingcanzhilv : change.jingcanzhilv
    change.jinxiangshuilv = change.jinxiangshuilv == null ? change1.jinxiangshuilv : change.jinxiangshuilv
    //进项税额 = 原值*进项税率
    change.jingxiangshui = mul(change.yuanzhi, div(change.jinxiangshuilv, 100)).toFixed(5)
    let useLife = 0
    let useLife1 = 0
    if (change.jitiType == '1') {
      useLife = add(mul(sub(cardMaster.creatTime.substring(0, 4), cardMaster.buyTime.substring(0, 4)), 12), sub(cardMaster.creatTime.substring(5, 7), cardMaster.buyTime.substring(5, 7)))
    } else {
      useLife = add(add(mul(sub(cardMaster.creatTime.substring(0, 4), cardMaster.buyTime.substring(0, 4)), 12), sub(cardMaster.creatTime.substring(5, 7), cardMaster.buyTime.substring(5, 7))), 1)
    }
    if (sub(change.life, useLife) >= 0) {
      useLife1 = useLife
    } else {
      useLife1 = change.life
    }
    zhejiuMethodList.value.forEach(item => {
      //平均年限法
      if (item.id == change.zhejiuMethod) {
        if (item.zjName == '平均年限法') {
          //月折旧率 = （1-净残值率）/使用年限*100
          change.yuezhejiulv = mul(div(sub(1, div(change.jingcanzhilv, 100)), change.life), 100).toFixed(5)
          const yuezhejiulv = mul(div(sub(1, div(change.jingcanzhilv, 100)), sub(change.life, useLife1)), 100).toFixed(5)
          //月折旧额 = （原值-累计折旧）*月折旧率
          change.yuezhejiue = mul(sub(change.yuanzhi, change.ljzhejiu), div(yuezhejiulv, 100)).toFixed(5)
        }
        //不计提
        if (item.zjName == '不计提') {
          change.yuezhejiulv = ''
          change.yuezhejiue = ''
        }
      }
    })
  }
  return list;
}

//数据保存
async function saveData() {
  saveBtnR.value = true
  if (!saveCheck()){
    saveBtnR.value = false
    return false
  }
  let data = JsonTool.parseProxy(formItems.value)
  /**=============================计算公式开始========================*/
  let list:any = []
  list = await calculationFormula(list);
  /**=============================计算公式结束========================*/
  // data.beiyong5 = JsonTool.json(transformChange(getDataSource().filter(it => !hasBlank(it.sysId) && !hasBlank(it.assetsCode) && !hasBlank(it.assetsName)), formItems.value.changeContent))
  data.beiyong5 = JsonTool.json(list)
  data.changeContent = JsonTool.json(data.changeContent)
  data.manageCode = pageParameter.managementCode
  await useRouteApi(saveChange, {schemaName: dynamicTenantId})(data)
  message.success('保存成功！')
  await pageReload()
  status.value = 3
  saveBtnR.value = false
}

function transformChange(list, values) {
  if (list.length > 0 && values.length > 0) {
    for (let i = 0; i < values.length; i++) {
      let key = values[i]
      list.forEach(it => {
        if (key == 'DEPT' || key == 'PRO') {
          if (it.zhejiuType == '0' && key == 'DEPT') {
            it['beiyong1'] = it[`changeAfterOpen${i + 1}`]
          } else if (it.zhejiuType == '1' && key == 'PRO') {
            it['beiyong2'] = it[`changeAfterOpen${i + 1}`]
          } else {
            if (key == 'DEPT') {
              it['beiyong1'] = generateDept(it[`changeAfter${i + 1}`], it)
            } else {
              it['beiyong2'] = generatePro(it[`changeAfter${i + 1}`], it)
            }
          }
        } else {
          it[key] = it[`changeAfter${i + 1}`]
        }
      })
    }
  }
  return list;
}

async function giveUp() {
  if (status.value == 1) {
    await contentSwitch('first')
  } else if (status.value == 2) {
    await contentSwitch('curr')
  }
  tableSelectedRowKeys.value = []
  status.value = 3
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


const disabledDate = (current) => {
  // 获取区间最小区间
  if (!hasBlank(formItems.value.handleDate)) {
    let variable = formItems.value.handleDate.substring(0, 7)
    let min = moment(variable + '-01', 'YYYY-MM-DD')
    let max = moment(variable, 'YYYY-MM-DD').endOf('month')
    return current < min || current > max
  }
};
const cardListOptions = ref([])
const assetsCardList = ref([])

const rowDataGrab = async (rowObj, type: string) => {
  let arr = assetsCardList.value.filter(it => (type == 'one' ? (it.sysId == rowObj.sysId) : type == 'two' ? (it.assetsCode == rowObj.assetsCode) : (it.assetsName == rowObj.assetsName)))
  if (arr.length > 0 && rowObj['cardUnique'] != arr[0].assetsUniqueCode) {
    rowObj['cardUnique'] = arr[0].assetsUniqueCode
    rowObj['sysId'] = arr[0].sysId
    rowObj['assetsCode'] = arr[0].assetsCode
    rowObj['assetsName'] = arr[0].assetsName
    rowObj['changeCause'] = formItems.value.changeCause
    rowObj['zhejiuType'] = arr[0].beiyong1
    // 初始化其他参数
    let arr2 = formItems.value.changeContent
    let isExpand = ((arr2.indexOf('DEPT') != -1) || (arr2.indexOf('PRO') != -1) ? true : false)
    let res = await useRouteApi(findLastFaChangeInfoByCode, {schemaName: dynamicTenantId})({
      code: arr[0].assetsUniqueCode,
      isExpand: isExpand
    }) || []
    if (null != res && arr2.length > 0) {
      // 默认为下拉
      changeContents.value[9]['type'] = 'SELECT'
      changeContents.value[10]['type'] = 'SELECT'
      for (let i = 0; i < arr2.length; i++) {
        let key = arr2[i]
        if (key == 'DEPT' || key == 'PRO') {
          let many = rowObj['zhejiuType']
          if (key == 'DEPT' /*&& many == '0'*/) { //多部门
            changeContents.value[9]['type'] = 'DEPTOPEN'
            changeContents.value[10]['type'] = 'PROOPEN'
            let depts = JsonTool.parseObj(res.beiyong1)
            if (depts.length > 0) {
              rowObj[`changeBefore${i + 1}`] = depts.map(it => it.deptUnique)
              rowObj[`changeBeforeOpen${i + 1}`] = depts
              rowObj[`changeAfter${i + 1}`] = depts.map(it => it.deptUnique)
              rowObj[`changeAfterOpen${i + 1}`] = depts
            }
          } else if (key == 'PRO' /*&& many == '1'*/) { // 多项目
            changeContents.value[9]['type'] = 'DEPTOPEN'
            changeContents.value[10]['type'] = 'PROOPEN'
            let pros = JsonTool.parseObj(res.beiyong2)
            if (pros.length > 0) {
              rowObj[`changeBefore${i + 1}`] = pros.map(it => it.deptUnique)
              rowObj[`changeBeforeOpen${i + 1}`] = pros
              rowObj[`changeAfter${i + 1}`] = pros.map(it => it.deptUnique)
              rowObj[`changeAfterOpen${i + 1}`] = pros
            }
          } else {//普通
            if (key == 'DEPT') {
              rowObj[`changeBefore${i + 1}`] = res['beiyong1']
              rowObj[`changeAfter${i + 1}`] = res['beiyong1']
            } else {
              rowObj[`changeBefore${i + 1}`] = res['beiyong2']
              rowObj[`changeAfter${i + 1}`] = res['beiyong2']
            }
          }
        } else {
          rowObj[`changeBefore${i + 1}`] = res[key]
          rowObj[`changeAfter${i + 1}`] = res[key]
        }
      }
    }
    cardListOptions.value = []
  }
}

const handleSearch = async (val: string, type: string) => {
  if (!hasBlank(val)) {
    let filterList = getDataSource().filter(it => !hasBlank(it.cardUnique)).map(it => it.cardUnique)
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
    let qData = {
      code: pageParameter.managementCode,
      date: formItems.value.changeDate,
      type: type,
      qValue: value,
    }
    let res = await useRouteApi(findFaAssetListByCondition, {schemaName: dynamicTenantId})(qData) || []
    let data = []
    res = res.filter(it => filterList.indexOf(it.cardUnique) == -1)
    res.forEach((r: any) => {
      data.push({
        value: r[type == 'one' ? 'sysId' : type == 'two' ? 'assetsCode' : 'assetsName'],
        label: type == 'tow' ? (r['assetsCode'] + ' ' + r['assetsName']) : (r['sysId'] + ' ' + r['assetsName']),
      });
    });
    assetsCardList.value = res
    callback(data);
  }

  timeout = setTimeout(fake, 300);
}

/***** 引用别的组件 *****/
const thisRowMark = ref({
  key: '', type: ''
})
const openOther = (o, type) => {
  let v = formItems.value.changeContent[(parseInt(type) - 1)]
  let vList = o[`changeAfterOpen${type}`] || []
  changeDeptList.value = []
  changeProjectList.value = []
  thisRowMark.value.key = o.key
  thisRowMark.value.type = type
  if (v == 'DEPT') {
    changeDeptList.value = vList
    openAddDept()
  } else {
    changeProjectList.value = vList
    openAddProject()
  }
  changeDeptList.value = []
  changeProjectList.value = []
}

//部门列表
const changeDeptList: any = ref([])
const deptList: any = ref([])
//新增资产卡片部门弹框
const [registerAddDeptPage, {openModal: openAddDeptPage}] = useModal()
const openAddDept = () => {
  openAddDeptPage(true, {
    data: {
      deptList: deptList.value,
      changeDeptList: changeDeptList.value
    }
  })
}

function generateDept(v, thisRow) {
  if (hasBlank(v)) return []
  let u = useUserStoreWidthOut().getUserInfo
  let nList = []
  const changeDept: any = {}
  changeDept.uniqueCode = ''
  changeDept.manageCode = pageParameter.managementCode
  changeDept.cardUnique = thisRow.cardUnique
  changeDept.deptUnique = v
  changeDept.proportion = '100'
  changeDept.cdate = formItems.value.changeDate
  changeDept.cuserId = u.id + ''
  changeDept.iyear = formItems.value.changeDate.substring(0, 4)
  changeDept.imonth = formItems.value.changeDate.substring(5, 7)
  changeDept.isMany = '0'
  nList.push(changeDept)
  return nList
}

async function saveAddDept(data) {
  let tableList = getDataSource()
  let thisRow = tableList.filter(it => it.key == thisRowMark.value.key)[0]
  let u = useUserStoreWidthOut().getUserInfo
  let nList = []
  data.forEach((item, index) => {
    const changeDept: any = {}
    changeDept.uniqueCode = ''
    changeDept.manageCode = pageParameter.managementCode
    changeDept.cardUnique = thisRow.cardUnique
    changeDept.deptUnique = item.deptUnique
    changeDept.proportion = item.proportion
    changeDept.cdate = formItems.value.changeDate
    changeDept.cuserId = u.id + ''
    changeDept.iyear = formItems.value.changeDate.substring(0, 4)
    changeDept.imonth = formItems.value.changeDate.substring(5, 7)
    changeDept.isMany = '1'
    nList.push(changeDept)
  })
  if (nList.length > 0) {
    thisRow[`changeAfter${thisRowMark.value.type}`] = nList.map(it => it.deptUnique)
    thisRow[`changeAfterOpen${thisRowMark.value.type}`] = nList
    tableList[tableList.findIndex(it => it.key == thisRowMark.value.key)] = thisRow
    setTableData(tableList)
  }
  thisRowMark.value = {key: '', type: ''}
}


const projectList = ref([])
const changeProjectList = ref([])
//新增资产卡片项目弹框
const [registerAddProjectPage, {openModal: openAddProjectPage}] = useModal()
const openAddProject = () => {
  openAddProjectPage(true, {
    data: {
      projectList: projectList.value,
      changeProjectList: changeProjectList.value
    }
  })
}

function generatePro(v, thisRow) {
  if (hasBlank(v)) return []
  let u = useUserStoreWidthOut().getUserInfo
  let nList = []
  const changeProject: any = {}
  changeProject.uniqueCode = ''
  changeProject.manageCode = pageParameter.managementCode
  changeProject.cardUnique = thisRow.cardUnique
  changeProject.projectUnique = v
  changeProject.proportion = '100'
  changeProject.cdate = formItems.value.changeDate
  changeProject.cuserId = u.id + ''
  changeProject.iyear = formItems.value.changeDate.substring(0, 4)
  changeProject.imonth = formItems.value.changeDate.substring(5, 7)
  changeProject.isMany = '0'
  nList.push(changeProject)
  return nList
}

//项目列表
async function saveAddProject(data) {
  let tableList = getDataSource()
  let thisRow = tableList.filter(it => it.key == thisRowMark.value.key)[0]
  let u = useUserStoreWidthOut().getUserInfo
  let nList = []
  data.forEach((item, index) => {
    const changeProject: any = {}
    changeProject.uniqueCode = ''
    changeProject.manageCode = pageParameter.managementCode
    changeProject.cardUnique = thisRow.cardUnique
    changeProject.projectUnique = item.projectUnique
    changeProject.proportion = item.proportion
    changeProject.cdate = formItems.value.creatTime.format('YYYY-MM-DD')
    changeProject.cuserId = u.id + ''
    changeProject.iyear = formItems.value.changeDate.substring(0, 4)
    changeProject.imonth = formItems.value.changeDate.substring(5, 7)
    changeProject.isMany = '1'
    nList.push(changeProject)
  })
  if (nList.length > 0) {
    thisRow[`changeAfter${thisRowMark.value.type}`] = nList.map(it => it.projectUnique)
    thisRow[`changeAfterOpen${thisRowMark.value.type}`] = nList
    tableList[tableList.findIndex(it => it.key == thisRowMark.value.key)] = thisRow
    setTableData(tableList)
  }
  thisRowMark.value = {key: '', type: ''}
}

/***** 引用别的组件 *****/
/*打印导出*/
import {useNewPrint} from "/@/utils/boozsoft/print/print";
import {tableStyle} from "/@/store/modules/abc-print";


function printData() {
  let dataArr = getDataSource()
  if (dataArr.length == 0) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请先新增一条变动单！'
    })
    return false;
  }
  let printList: any = []
  let isReview = !hasBlank(formItems.value.verifyUsername)
  let tArr = formItems.value.changeContent;
  let context = changeContentText(formItems.value.changeContent)
  let contexts = context.split(',')
  dataArr.forEach((item, index) => {
    let item1 = {}
    item1[0] = item.sysId
    item1[1] = item.assetsCode
    item1[2] = item.assetsName
    item1[3] = item.changeCause || ''
    item1[4] = ''
    item1[5] = ''
    item1[6] = ''
    item1[7] = ''
    item1[8] = ''
    item1[9] = ''
    if (tArr.length > 0) {
      item1[4] = getChangeType('1') == 'INPUT' ? item['changeBefore1'] : getCurrSelectText(item['changeBefore1'], '1', item)
      item1[5] = getChangeType('1') == 'INPUT' ? item['changeAfter1'] : getCurrSelectText(item['changeAfter1'], '1', item)
      if (tArr.length > 1) {
        item1[6] = getChangeType('2') == 'INPUT' ? item['changeBefore2'] : getCurrSelectText(item['changeBefore2'], '2', item)
        item1[7] = getChangeType('2') == 'INPUT' ? item['changeAfter2'] : getCurrSelectText(item['changeAfter2'], '2', item)
        if (tArr.length > 2) {
          item1[8] = getChangeType('3') == 'INPUT' ? item['changeBefore3'] : getCurrSelectText(item['changeBefore3'], '3', item)
          item1[9] = getChangeType('3') == 'INPUT' ? item['changeAfter3'] : getCurrSelectText(item['changeAfter3'], '3', item)
        }
      }
    }
    printList.push(item1)
  })
  let maxR = 25;
  if ((maxR - printList.length) > 0) {
    maxR = (maxR - printList.length)
    for (let i = 0; i < maxR; i++) {
      printList.push({0: '', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: '', 10: ''})
    }
  }
  useNewPrint({data: ['l', 'px', 'a4', true]}, (doc) => {
    loadMark.value = false
    doc.autoTable({
      head: [
        ['资产变动单', '', '', '', '', '', '', '', '', ''],
        ['单据编号：' + formItems.value.changeCode, '', '', '变动日期：' + formItems.value.changeDate, '', '', '', '变动内容：' + context, '', ''],
        ['系统编码', '资产编码', '资产名称', '变动原因', (contexts.length > 0 ? contexts[0] : '变动一'), '', contexts.length > 1 ? contexts[1] : '变动二', '', contexts.length > 2 ? contexts[2] : '变动三', ''],
        ['', '', '', '', '变动前', '变动后', '变动前', '变动后', '变动前', '变动后'],
      ],
      body: printList,
      // startY: 60,
      styles: tableStyle(),
      margin: {
        left: 25,
        top: 20,
        bottom: 20
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
        /* doc.autoTableText(
           '变动部门：' + (isReview ? formatUniqueCodeDept(formItems.value.czDept) : ''),
           tabMarginLeft,
           data.cursor.y + 3,
           0
         );
         doc.autoTableText(
           '审核人：' + (isReview ? formItems.value.verifyUsername : ''),
           data.cursor.x / 2 - 20,
           data.cursor.y + 3,
           0
         );
         doc.autoTableText(
           '变动人：' + (isReview ? formatUniqueCodeUser(formItems.value.czUser) : ''),
           data.cursor.x - 70,
           data.cursor.y + 3,
           0
         );*/
      },
      didParseCell(data) {
        data.cell.styles.cellPadding = {top: 3, left: 2, right: 2, bottom: 2}
        data.cell.styles.fillColor = [255, 255, 255]
        data.cell.styles.fontSize = 9
        data.cell.styles.lineColor = [150, 150, 150]
        // data.cell.styles.bold = false

        if (data.section == 'head' && data.row.index == 0) {

          data.cell.styles.fontSize = 20
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.lineColor = [255, 255, 255]
          if (data.column.index == 0) {
            data.cell.colSpan = 11
            data.cell.styles.halign = 'center'
          }
        }
        if (data.section == 'head' && data.row.index == 1) {
          data.cell.styles.fontSize = 10
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.lineColor = [255, 255, 255]
          if (data.column.index == 0) {
            data.cell.colSpan = 3
            data.cell.styles.halign = 'left'
          } else if (data.column.index == 3) {
            data.cell.styles.halign = 'center'
            data.cell.colSpan = 4
          } else if (data.column.index == 7) {
            data.cell.styles.halign = 'right'
            data.cell.colSpan = 3
          } else {
            data.cell.styles.halign = 'center'
          }
        }

        /*        if (data.section == 'head' && data.row.index == 2) {
                  data.cell.styles.fontSize = 10
                  data.cell.styles.fontStyle = 'bold'
                  data.cell.styles.lineColor = [255, 255, 255]
                  if (data.column.index == 0) {
                    data.cell.colSpan = 3
                    data.cell.styles.halign = 'left'
                  }/!* else if (data.column.index == 2) {
                    data.cell.colSpan = 4
                    data.cell.styles.halign = 'left'
                  } else if (data.column.index == 6) {
                    data.cell.styles.halign = 'right'
                    data.cell.colSpan = 3
                  }*!/ else {
                    data.cell.styles.halign = 'right'
                  }
                }*/
        if (data.section == 'head' && data.row.index == 2) {
          data.cell.styles.fontSize = 10
          data.cell.styles.cellPadding = {top: 4, left: 2, right: 2, bottom: 3}
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.fillColor = [200, 200, 200]
          data.cell.styles.halign = 'center'
          if (data.column.index == 0 || data.column.index == 1 || data.column.index == 2 || data.column.index == 3) {
            data.cell.styles.valign = 'middle'
            data.cell.rowSpan = 2
          }
          if (data.column.index == 4 || data.column.index == 6 || data.column.index == 8) {
            data.cell.colSpan = 2
          }
        }
        /* if (data.section == 'head' && data.row.index == 4) {
           data.cell.styles.fontSize = 10
           data.cell.styles.cellPadding = {top: 4, left: 2, right: 2, bottom: 3}
           data.cell.styles.fontStyle = 'bold'
           data.cell.styles.fillColor = [230, 230, 230]
           data.cell.styles.halign = 'center'
         }*/
        if (data.section == 'head' && data.row.index == 3) {
          data.cell.styles.fontSize = 10
          data.cell.styles.cellPadding = {top: 4, left: 2, right: 2, bottom: 3}
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.fillColor = [200, 200, 200]
          data.cell.styles.halign = 'center'
        }
        if (data.section == 'body') {
          if (data.row.index % 2 == 1) {
            data.cell.styles.fillColor = [240, 240, 240]
          }
        }
      },
      columnStyles: {
        0: {cellWidth: 40, halign: 'left'},
        1: {cellWidth: 40, halign: 'left'},
        2: {cellWidth: 100, halign: 'left'},
        3: {cellWidth: 70, halign: 'left'},
        4: {cellWidth: 55, halign: 'left'},
        5: {cellWidth: 55, halign: 'left'},
        6: {cellWidth: 55, halign: 'left'},
        7: {cellWidth: 55, halign: 'left'},
        8: {cellWidth: 55, halign: 'left'},
        9: {cellWidth: 55, halign: 'left'},
      }
    })
  })
}

//导出Excel
import XLSX from "xlsx-js-style";
import {
  sheet_from_array_of_arrays, Workbook,
  writeExcel, defaultV
} from "/@/utils/boozsoft/excel/excel2";
import {getThisAdInfoData} from "/@/api/record/system/financial-settings";
import {useUserStore} from "/@/store/modules/user";
import {getCutModeAllList} from "/@/api/record/system/fa-ac";
import moment from "moment";
import {findFaCheckByDate} from "/@/api/fa/fa-pandian";
import {
  findCardMasterByCardUnique,
  findCardMasterEffectiveAll, findChangeByCardUnique,
  findFaAssetTypeByFlagAndBend,
  findFaUsageStatusByFlagAndBend,
  findLocationByFlagAndBend, findZhejiuMethodByFlag, saveFaChangeProjectList
} from "/@/api/fa/fa-card";
import {findAllProject} from "/@/api/record/system/project";
import {add, div, mul, sub} from "/@/views/boozsoft/gdzc/gu-ding-zi-chan-add/calculation";

async function exportExcel() {
  let dataArr = getDataSource()
  if (dataArr.length == 0) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请先新增一条盘点单！'
    })
    return false;
  }
  let printList: any = []
  let isReview = !hasBlank(formItems.value.verifyUsername)
  let tArr = formItems.value.changeContent;
  let context = changeContentText(formItems.value.changeContent)
  let contexts = context.split(',')
  dataArr.forEach((item, index) => {
    let item1 = {}
    item1[0] = item.sysId
    item1[1] = item.assetsCode
    item1[2] = item.assetsName
    item1[3] = item.changeCause || ''
    item1[4] = ''
    item1[5] = ''
    item1[6] = ''
    item1[7] = ''
    item1[8] = ''
    item1[9] = ''
    if (tArr.length > 0) {
      item1[4] = getChangeType('1') == 'INPUT' ? item['changeBefore1'] : getCurrSelectText(item['changeBefore1'], '1', item)
      item1[5] = getChangeType('1') == 'INPUT' ? item['changeAfter1'] : getCurrSelectText(item['changeAfter1'], '1', item)
      if (tArr.length > 1) {
        item1[6] = getChangeType('2') == 'INPUT' ? item['changeBefore2'] : getCurrSelectText(item['changeBefore2'], '2', item)
        item1[7] = getChangeType('2') == 'INPUT' ? item['changeAfter2'] : getCurrSelectText(item['changeAfter2'], '2', item)
        if (tArr.length > 2) {
          item1[8] = getChangeType('3') == 'INPUT' ? item['changeBefore3'] : getCurrSelectText(item['changeBefore3'], '3', item)
          item1[9] = getChangeType('3') == 'INPUT' ? item['changeAfter3'] : getCurrSelectText(item['changeAfter3'], '3', item)
        }
      }
    }
    printList.push(item1)
  })
  const sheet = [
    {
      title: '资产变动单',
      multiHeader: [
        ['单据编号：' + formItems.value.changeCode, '', '', '变动日期：' + formItems.value.changeDate, '', '', '', '变动内容：' + context, '', ''],
        ['系统编码', '资产编码', '资产名称', '变动原因', (contexts.length > 0 ? contexts[0] : '变动一'), '', contexts.length > 1 ? contexts[1] : '变动二', '', contexts.length > 2 ? contexts[2] : '变动三', ''],
        ['', '', '', '', '变动前', '变动后', '变动前', '变动后', '变动前', '变动后'],
      ],
      table: printList,
      foot: ['', '', '', '', '', '', '', '', ''],
      keys: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      merges: ['A2:C2', 'D2:G2', 'H2:J2', 'E3:F3', 'G3:H3', 'I3:J3', 'A3:A4', 'B3:B4', 'C3:C4', 'D3:D4'],
      sheetName: '资产变动单',
      cellStyle: [
        {
          cell: 'A1',
          font: {
            name: '宋体',
            sz: 14,
            color: {rgb: "000000"},
            bold: true,
          },
          /*fill: {
          fgColor: { rgb: "ff7e00" },
        }*/
          border: {color: {rgb: "ffffff"}}
        },
      ],
      colWidth: [8, 8, 16, 12, 10, 10, 10, 10, 10, 10]
    }
  ]
  // 处理数据前
  if (!sheet || sheet.length <= 0) {
    this.onError('Table data cannot be empty')
    return
  }
  const wb = Workbook()
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
      const titleLength = Math.max(tHeaderLength, multiHeaderLength, keys.length)
      // 第一个元素为title，剩余以空字符串填充
      title = [title].concat(Array(titleLength - 1).fill(''))
      // 处理标题的合并\
      const cell = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      let mergeSecond = 'A1'
      if (titleLength > 26) {
        const one = parseInt(titleLength / 26)
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
    if (foot || foot === '') {
      foot && data.push(foot);
      /*      const str1 = ('A' + data.length) + (':C' + data.length)
            const str2 = ('E' + data.length) + (':G' + data.length)
            const str3 = ('J' + data.length) + (':K' + data.length)
            merges.push(str1)
            merges.push(str2)
            merges.push(str3)*/
    }
    const ws = sheet_from_array_of_arrays(data);
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
          dataInfo[i.toString()].s = globalStyle;
          const {border, font, alignment, fill} = globalStyle;
          if (i.substring(1) == '1') {
            dataInfo[i.toString()].s = {
              border: {},
              font: font || globalStyle.font,
              alignment: alignment || globalStyle.alignment,
              fill: fill || globalStyle.fill
            }
          } else if (i.substring(1) == '2') {
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
            if (i == 'D2') {
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
                  horizontal: "center",
                }
              }
            }
            if (i == 'H2') {
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
                  horizontal: "right",
                }
              }
            }
          } else if (i.substring(1) == '3' || i.substring(1) == '4') {
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
          } else if (i.substring(0, 1) == 'A' || i.substring(0, 1) == 'C' || i.substring(0, 1) == 'B' || i.substring(0, 1) == 'D' || i.substring(0, 1) == 'E' || i.substring(0, 1) == 'I') {
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "left",
              }
            }
          } else if (i.substring(0, 1) == 'F' || i.substring(0, 1) == 'G' || i.substring(0, 1) == 'H' || i.substring(0, 1) == 'J' || i.substring(0, 1) == 'K') {
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "left",
              }
            }
          }
          if (foot.length > 0) {
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
                  horizontal: "center",
                }
              }
              if (i.substring(0, 1) == 'A') {
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
              if (i.substring(0, 1) == 'E' || i.substring(0, 1) == 'J') {
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
                    horizontal: "center",
                  }
                }
              }
            }
          }
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
  writeExcel(wb, bookType, '资产变动单')
}
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
          margin-left: 4%;
        }
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
</style>
<style  lang="less" scoped>
@import '/@/assets/styles/global-menu-index1.less';
</style>
