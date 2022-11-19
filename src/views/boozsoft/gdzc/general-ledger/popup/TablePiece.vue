<template>
  <div class="app-container-node">
    <div class="app-container-head" style="margin-top: -10px;">
      <div style="margin-top: .5%;">
        <div style="display: inline-block;float: left;margin-left: 1%;width: 60%">
          <span style="font-size: 16px;color: #aaa;font-weight: bold;">核算单位：{{props.pageAccName}}</span>
        </div>
        <div style="float: right; position: relative">
          <!-- 搜索 -->
          <a-select v-model:value="pageParameter.searchConditon.requirement" style="width: 130px;"
                    class="special_select">
            <template v-for="item in searchConditonList">
              <a-select-option v-if="item.ifShow == true" :value="item.dataIndex">
                {{ item.title }}
              </a-select-option>
            </template>
          </a-select>
          <a-input-search
            placeholder=""
            @search="pageSearch"
            style="width: 150px;border-radius: 4px"
          />

          <a-button class="ant-btn-default" style="padding-top: 0.1px;" @click="openImportExcelView">
            <UsbOutlined/>
          </a-button>
          <a-button class="ant-btn-default" style="padding-top: 0.1px;">
            <PrinterOutlined/>
          </a-button>
        </div>
      </div>
    </div>
    <div style="clear:both"/>
    <BasicTable
      ref="tableRef"
      :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
      :scroll="{ x: totalColumnWidth,y: windowHeight }"
      size="small"
      @register="registerTable"
    >
      <template #sjnum="{ record }" class="a-table-money-font-size a-table-font-arial">
        <span style="color: #0096c7;font-weight: bold;">{{ formatNum(record.sjnum) }}</span>
      </template>
      <template #sjwb="{ record }" class="a-table-money-font-size a-table-font-arial">
        <span style="color: #0096c7;float: right">{{ formatData(record.sjwb) }}</span>
      </template>
      <template #sjmoney="{ record }" class="a-table-money-font-size a-table-font-arial">
        <span style="color: #0096c7;float: right" @click="goto()">{{ formatData(record.sjmoney) }}</span>
      </template>

      <template #sdnum="{ record }" class="a-table-money-font-size a-table-font-arial">
        <span style="color: #0096c7;font-weight: bold;">{{ formatNum(record.sdnum) }}</span>
      </template>
      <template #sdwb="{ record }" class="a-table-money-font-size a-table-font-arial">
        <span style="color: #0096c7;float: right">{{ formatData(record.sdwb) }}</span>
      </template>
      <template #sdmoney="{ record }" class="a-table-money-font-size a-table-font-arial">
        <span style="color: #0096c7;float: right" @click="goto()">{{ formatData(record.sdmoney) }}</span>
      </template>

      <template #synum="{ record }" class="a-table-money-font-size a-table-font-arial">
        <span style="color: #0096c7;font-weight: bold;">{{ formatNum(record.synum) }}</span>
      </template>
      <template #sywb="{ record }" class="a-table-money-font-size a-table-font-arial">
        <span style="color: #0096c7;float: right">{{ formatData(record.sywb) }}</span>
      </template>
      <template #symoney="{ record }" class="a-table-money-font-size a-table-font-arial" >
        <span style="color: #0096c7;float: right" @click="goto()">{{ formatData(record.symoney) }}</span>
      </template>

    </BasicTable>
  </div>
</template>
<script setup lang="ts">
import {BasicTable, useTable} from '/@/components/Table'
import {
  DatePicker as ADatePicker, Select as ASelect, Input as AInput,
  Radio as ARadio, Table as ATable,
  message, Drawer as ADrawer
} from "ant-design-vue"
import {UsbOutlined,PrinterOutlined} from '@ant-design/icons-vue'
import { useGlStore } from '/@/api/record/generalLedger/generalLedger'

import {onMounted, reactive, ref, watch,inject} from "vue";
import {initDynamics, assemblyDynamicColumn} from "../data";
import {useMessage} from "/@/hooks/web/useMessage";
import {
  getCurrentAccountName,
} from "/@/api/task-api/tast-bus-api";
import {findAll} from "/@/api/record/generalLedger/data";
import {useUserStore, useUserStoreWidthOut} from "/@/store/modules/user";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useRoute} from "vue-router";
import {findCodeKmByPeriod} from "/@/api/record/generalLedger/data";
import { findDbLanMuList} from '/@/api/record/system/accvoucher'
import {exportExcel} from "/@/api/record/generalLedger/excelExport";
import router from "/@/router";

const ARangePicker = ADatePicker.RangePicker
const ASelectOption = ASelect.Option
const AInputSearch = AInput.Search
const ARadioGroup = ARadio.Group
const ARadioButton = ARadio.Button
const {createConfirm, createWarningModal} = useMessage();
// 全局常量
const glStore = useGlStore()
const props = defineProps(['modelValue', 'pageAccId','pageAccName','exportData','ljchecked'])
const targetKeys = ref([])

// 页面变量
const pageParameter = reactive({
  queryMark: 'J',
  showRulesSize: 'MIN',
  condition: {},
  searchConditon: {
    requirement: 'fx',
    value: '',
  },
  filterConditon: {
    amountMinDf: '',
    amountMaxDf: '',
    amountMinJf: '',
    amountMaxJf: '',
    amountMinYe: '',
    amountMaxYe: '',
  },
  reloadMark: false,
  km: "",
  minKm:"" ,
  maxKm: "",
  // 显示期间
  endDate: "",
  strDate: "",
  //显示未记账
  ibook: true,
  // 级次
  minJc: "1",
  maxJc: "1",
  moji: 1,
  jd: 2,
  dw: '',
  wb: '',

  //科目类别权限
  userId: '',
  year: '',
  accId: '',
  isType: '',
  isCode: '',
})

const styleName = ref<String>("金额式")
// 科目名称标题
const titleName = ref<String>("")
const showStyle = ref([
  {
    'name': '金额式',
    'value': 'J'
  }, {
    'name': '数量金额式',
    'value': 'SJ'
  }, {
    'name': '外币金额式',
    'value': 'WJ'
  }, {
    'name': '数量外币式',
    'value': 'SWJ'
  }
])
const visible = ref(false);
const searchConditonList = ref([])
const lanMuData = {
  'accId': '',
  'menuName': '总账',
  'type': '',
  objects: '',
  username: useUserStoreWidthOut().getUserInfo.username
}

// 表格参数
const loadMark = ref(false)
const windowWidth = (document.documentElement.clientWidth - 70)
const windowHeight = (window.innerHeight - (350))
const totalColumnWidth = ref(0)

const tableRefNode = ref(null)
const userName = useUserStoreWidthOut().getUserInfo.username
const userStore = useUserStore();
// 数据库模式名称
const database = ref(props.pageAccId + '-' + getCurrentAccountName(true).split('-')[2]);

const digestLanMuData = {
  'accId': database.value.substring(0, database.value.length - 5),
  'menuName': '总账摘要',
  'type': '',
  objects: '',
  username: useUserStoreWidthOut().getUserInfo.username
}

const CrudApi = {
  list: findAll,
  columns: JSON.parse(JSON.stringify(glStore.getColumns(pageParameter.queryMark)))
}
// 组件实例区
const [registerTable, {
  reload,
  setTableData,
  setColumns,
  getColumns,
  getPaginationRef,
  setPagination,
  getDataSource
}] = useTable({
  api: useRouteApi(CrudApi.list, {schemaName: database}),
  columns: CrudApi.columns,
  bordered: true,
  loading: loadMark.value,
  immediate: false,
  canResize: true,
  showIndexColumn: false, //显示序号列
  pagination: {
    pageSize: 200,
    showSizeChanger: true,
    pageSizeOptions: ['200', '500', '1000', '1500'],
    showTotal: t => `总共${t}条数据`
  },
  searchInfo: pageParameter,
})
const route = useRoute();
const routemsg = ref(route.query);
onMounted(async () => {
  initPageParameter()
})
const ljchecked = inject('ljchecked')
watch(()=>ljchecked.value,(a,b)=>{
  reloadColumns()
})

async function goRouter(ccode) {
 /* const kmStyle =  kmList.value.filter(o=> o.ccode === pageParameter.km)[0].cbookType //科目样式
  if(kmStyle){
    pageParameter.queryMark  = showStyle.value.filter(o=> o.name === kmStyle)[0].value //显示样式
  }else {
    pageParameter.queryMark  = 'J';
  }*/
  const json = {
    strDate: pageParameter.strDate,
    endDate: pageParameter.endDate,
    minJc: pageParameter.minJc,
    maxJc: pageParameter.maxJc,
    //km:  kmList.value[0].ccode,
    timflg: 'qj',
    showStyle: pageParameter.queryMark,
    fontSize: pageParameter.showRulesSize,
    bzName:'全部',
    jc: pageParameter.moji,
    riqi: '',
    openOne: '2',
    database: getCurrentAccountName(true),
  }
  console.log(json)
  router.push({
    path: '/zhongZhang/account-book/ab-kemuzhang/abk-mxtable',
    query: json,
  });
}
function test() {
  props.exportData.map[props.pageAccName]=getDataSource()
}
const initPageParameter = async () => {
  database.value = props.pageAccId + '-' + getCurrentAccountName(true).split('-')[2]
  pageParameter.database = database.value
  pageParameter.km = props.modelValue.km
  pageParameter.queryMark = props.modelValue.queryMark
  pageParameter.condition = props.modelValue.condition
  pageParameter.searchConditon.requirement = props.modelValue.searchConditon.requirement
  pageParameter.filterConditon = props.modelValue.filterConditon
  pageParameter.numJd = props.modelValue.numJd
  pageParameter.priceJd = props.modelValue.priceJd
  pageParameter.lvJd = props.modelValue.lvJd
  pageParameter.moneyJd = props.modelValue.moneyJd
  pageParameter.wb = props.modelValue.wb
  pageParameter.dw = props.modelValue.dw
  pageParameter.minKm = props.modelValue.minKm
  pageParameter.maxKm = props.modelValue.maxKm
  pageParameter.endDate = props.modelValue.endDate.replaceAll("-",".")
  pageParameter.strDate = props.modelValue.strDate.replaceAll("-",".")
  pageParameter.ishaveRjz = props.modelValue.ishaveRjz
  pageParameter.minJc = props.modelValue.minJc
  pageParameter.maxJc = props.modelValue.maxJc
  pageParameter.bend = props.modelValue.bend
  pageParameter.timflg = 'rq'
  pageParameter.bz = props.modelValue.bz
  pageParameter.styleValue = props.modelValue.styleValue
  pageParameter.digestStyle = props.modelValue.digestStyle
  pageParameter.cclass = props.modelValue.cclass
  resetDynamicColumnData()
}

function tableRow(row: any, num: any) {
  return (row.cdigest == '本月合计' ? 'table-month-striped' : null)
    || (row.cdigest == '本年累计' ? 'table-year-striped' : null)
}


function digestDynamicColumnData() {
  findDbLanMuList(digestLanMuData).then(res => {
    // 栏目列
    let dbList = res.items
    let arr = []
    if (dbList.length > 0) {
      for (let i = 0; i < dbList[0].key.split(',').length; i++) {
        arr.push(dbList[0].key.split(',')[i])
      }
    }
    targetKeys.value = arr
  })
}



const pageReload = () => {
  pageParameter.digestStyle = targetKeys.value.length > 0 ? targetKeys.value.join(',') : ''
  reload({
    searchInfo: pageParameter
  })
}

watch(props.modelValue, async () => {
  if (props.modelValue.queryMark != pageParameter.queryMark) onChangeSwitch(props.modelValue.queryMark)
  if (props.modelValue.reloadMark) {
    initPageParameter()
  }
})

const onChangeSwitch = async (v) => { // 动态列
  styleName.value = showStyle.value.filter(o => o.value === v)[0].name
  pageParameter.queryMark = v
  resetDynamicColumnData()
  pageParameter.searchConditon.requirement = 'fx'
  pageParameter.searchConditon.value = ''
}
const pageSearch = async (a) => {
  // 搜索前校验格式
  if ('' == pageParameter.searchConditon.requirement.trim()) {
    message.warn('请选择检索条件')
    return false
  }
  pageParameter.searchConditon.value = a
  // 校验完成后搜索
  closeFilterV()
  pageReload()
}

const filterSearch = async () => {
  /* if (''==pageParameter.searchConditon.value.trim())return false*/
  // 搜索前校验格式
  let min = pageParameter.filterConditon.amountMinJf.trim()
  let max = pageParameter.filterConditon.amountMaxJf.trim()
  if (max != '' || min != '') {
    if (min != '' && max != '' && (!isRealNum(min) || !isRealNum(max) || parseFloat(min) == 0 || parseFloat(max) == 0)) {
      message.warn('请输入数值类型值并且值不能为0！')
      closeFilterV()
      return false
    } else if (parseFloat(min) > parseFloat(max)) {
      message.warn('金额区间最小值部门大于最大值！')
      closeFilterV()
      return false
    }
  }

  let min2 = pageParameter.filterConditon.amountMinDf.trim()
  let max2 = pageParameter.filterConditon.amountMaxDf.trim()
  if (max2 != '' || min2 != '') {
    if (min2 != '' && max2 != '' && (!isRealNum(min2) || !isRealNum(max2) || parseFloat(min2) == 0 || parseFloat(max2) == 0)) {
      message.warn('请输入数值类型值并且值不能为0！')
      closeFilterV()
      return false
    } else if (parseFloat(min2) > parseFloat(max2)) {
      message.warn('金额区间最小值部门大于最大值！')
      closeFilterV()
      return false
    }
  }

  let min3 = pageParameter.filterConditon.amountMinYe.trim()
  let max3 = pageParameter.filterConditon.amountMaxYe.trim()
  if (max != '' || min3 != '') {
    if (min3 != '' && max3 != '' && (!isRealNum(min3) || !isRealNum(max3) || parseFloat(min3) == 0 || parseFloat(max3) == 0)) {
      message.warn('请输入数值类型值并且值不能为0！')
      closeFilterV()
      return false
    } else if (parseFloat(min3) > parseFloat(max3)) {
      message.warn('金额区间最小值部门大于最大值！')
      closeFilterV()
      return false
    }
  }

  // 校验完成后搜索
  pageReload()
}

const closeFilterV = () => {
  pageParameter.filterConditon.amountMinDf = ''
  pageParameter.filterConditon.amountMaxDf = ''
  pageParameter.filterConditon.amountMinJf = ''
  pageParameter.filterConditon.amountMaxJf = ''
  pageParameter.filterConditon.amountMinYe = ''
  pageParameter.filterConditon.amountMaxYe = ''
  visible.value = false
  reloadColumns()
}

function isRealNum(val) {
  // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除，
  if (val === "" || val == null) {
    return false;
  }
  if (!isNaN(val)) {
    //对于空数组和只有一个数值成员的数组或全是数字组成的字符串，isNaN返回false，例如：'123'、[]、[2]、['123'],isNaN返回false,   //所以如果不需要val包含这些特殊情况，则这个判断改写为if(!isNaN(val) && typeof val === 'number' )
    return true;
  } else {
    return false;
  }
}

/*start栏目设置*/
const dynamicColumnData = ref([])
let dynamicColumnDataCopy = []

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

  //对子节点处理  过滤有子节点并且变动 添加到a
  lanMuList.forEach((item, index) => {
    if (item.children) {
      let b = item.children.filter(item2 => {
        try {
          copyList[index].children.forEach(item3 => {
            if (item2.key === item3.key && item2.name == item3.name) {
              if (item2.nameNew != item3.nameNew || item2.width != item3.width || item2.check != item3.check || item2.align != item3.align)
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
      b.forEach(item => {
        a.push(item);
      })
    }
  })
  return a;
}
function resetDynamicColumnData() {
  // 先从数据查询是否已经设置
  lanMuData.accId = database.value.substring(0, database.value.length - 5)
  lanMuData.type = pageParameter.queryMark
  findDbLanMuList(lanMuData).then(res => {
    // 栏目列
    let dbList = res.items
    if (dbList.length > 0) {
      let statiList = initDynamics()[pageParameter.queryMark]
      dbList = combineParameters(statiList, dbList)
      dynamicColumnData.value = dbList
      dynamicColumnDataCopy = JSON.parse(JSON.stringify(dbList))
    } else {
      let statiList = initDynamics()[pageParameter.queryMark]
      dynamicColumnData.value = statiList
      dynamicColumnDataCopy = JSON.parse(JSON.stringify(statiList))
    }
    // 表格列
    reloadColumns()
    digestDynamicColumnData()
    pageReload()
  })
}
function combineParameters(staticList: any, dbList: any) {
  staticList.forEach(item => {
    dbList.forEach(item2 => {
      if (item.key === item2.key && item.name === item2.name) {
        item.nameNew = item2.nameNew
        item.width = parseInt(item2.width)
        item.check = item2.check == 'true'
        item.align = item2.align
      } else {
        //对子节点处理
        if (item.children) {
          item.children.forEach(item3 => {
            if (item3.key === item2.key && item3.name === item2.name) {
              item3.nameNew = item2.nameNew
              item3.width = parseInt(item2.width)
              item3.check = item2.check == 'true'
              item3.align = item2.align
            }
          })
        }
      }
    })
  })
  return staticList
}
const reloadColumns = () => {
  let newA = JSON.parse(JSON.stringify(glStore.getColumns(pageParameter.queryMark,ljchecked.value)))
  newA = assemblyDynamicColumn(dynamicColumnData.value, newA)
  setColumns(newA)
  initTableWidth(newA)
  //多表头 添加子节点筛选
  let seachList = []
  newA.forEach(item => {
    if (item.children) {
      item.children.forEach(item2 => {
        item2.title = item.title + item2.title
        seachList.push(item2)
      })
    } else {
      seachList.push(item)
    }
  })
  searchConditonList.value = seachList
}
function initTableWidth(thisCs) {
  let total = 60
  thisCs.forEach(item => {
    if (item.ifShow == null || item.ifShow)
      total += parseInt(item.width)
  })
  if (total > windowWidth) {
    let f = 0
    if (visible.value) f = 260
    totalColumnWidth.value = Number(windowWidth) - f
    // tableRef.value.$el.style.setProperty('width', (windowWidth + 20 - f) + 'px')
  } else {
    if (visible.value && (windowWidth - 260) < total) total -= (total - (windowWidth - 260))
    totalColumnWidth.value = total
    // tableRef.value.$el.style.setProperty('width', (total + 20) + 'px')
  }
}
/*栏目设置end*/

async function handleChangeMinKm() {
  styleName.value = showStyle.value.filter(o => o.value === pageParameter.queryMark)[0].name
  closeFilterV()
  pageReload()
}
// 金额格式化
function moneyformat(data: any) {
  let str = ""
  if (data) {
    // 千分位保留2位小数
    var source = String(data.toFixed(pageParameter.moneyJd)).split("."); //按小数点分成2部分
    source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)', 'ig'), "$1,");//只将整数部分进行都好分割
    str = source.join(".");//再将小数部分合并进来
  }
  return str;
}
// 数量格式化
function numformat(data: any) {
  let str = ""
  if (data) {
    if (0 === data) {
      str = ""
    } else {
      var source = String(data.toFixed(pageParameter.numJd)).split("."); //按小数点分成2部分
      source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)', 'ig'), "$1,");//只将整数部分进行都好分割
      str = source.join(".");
    }
  }
  return str;
}

const openImportExcelView = async () => {
  let strDate=props.modelValue.strDate.substring(0,4)+'.'+props.modelValue.strDate.substring(4,6)+'.'+props.modelValue.strDate.substring(6,8)
  let endDate=props.modelValue.endDate.substring(0,4)+'.'+props.modelValue.endDate.substring(4,6)+'.'+props.modelValue.endDate.substring(6,8)
  const data = JSON.parse(JSON.stringify(getDataSource()))
  const columns = getColumns()
  //筛选条件
  const title = [ "公司名称："+props.pageAccName+'   日期：'+strDate+' - '+endDate ]
  //根据columns 格式化导出excel数据
  const multiHeader:any = [[],[]]
  const keys:any = []
  const merges:any = []
  const cellStyle = [
    {
      cell: 'A1',
      font: {
        sz: 16,
        color: { rgb: "000000" },
        bold: true,
      },
      fill: {
        fgColor: { rgb: "ffffff" },
      }
    }
  ]
  const cell = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
  let flg = 0;
  columns.forEach((v,index)=>{
    //多级表头
    if(v.children){
      multiHeader[0].push(v.title)
      for (let i = 0; i < v.children.length; i++) {
        if(i < v.children.length-1){
          multiHeader[0].push('')
        }
        multiHeader[1].push(v.children[i].title)
        keys.push(v.children[i].dataIndex)
      }
      //根据子节点数量合并单元格 5 56  6 78 7 9 10
      if(flg === 0){
        flg = index
      }
      merges.push('`' + cell[flg] + '3:' + cell[flg + v.children.length-1] +'3`');
      flg = flg + v.children.length
    }else{
      multiHeader[0].push(v.title)
      multiHeader[1].push('')
      keys.push(v.key)
      //合并上下单元格
      merges.push('`' + cell[flg] + '3:' + cell[flg] +'4`');
      flg = flg + 1
    }
  })
  merges.push('`A2:' + cell[keys.length-1] +'2`');
  data.forEach(v=>{
    v.ccodeName=v.ccodeName===null?'':v.ccodeName
    v.ljMc=v.ljMc===null?'':moneyformat(v.ljMc)
    v.ljMd=v.ljMd===null?'':moneyformat(v.ljMd)
    v.ljNfrat=v.ljNfrat===null?'':moneyformat(v.ljNfrat)
    v.ljNum=v.ljNum===null?'':moneyformat(v.ljNum)
    v.mc=v.mc===null?'':moneyformat(v.mc)
    v.md=v.md===null?'':moneyformat(v.md)
    v.mdF=v.mdF===null?'':moneyformat(v.mdF)
    v.ncS=v.ncS===null?'':moneyformat(v.ncS)
    v.ncnum=v.ncnum===null?'':numformat(v.ncnum)
    v.ndS=v.ndS===null?'':numformat(v.ndS)
    v.nfrat_mc=v.nfrat_mc===null?'':moneyformat(v.nfrat_mc)
    v.nfrat_md=v.nfrat_md===null?'':moneyformat(v.nfrat_md)
    v.yue=v.yue===null?'':moneyformat(v.yue)
    v.yue_nfrat=v.yue_nfrat===null?'':moneyformat(v.yue_nfrat)
    v.yue_num=v.yue_num===null?'':numformat(v.yue_num)
    v.pzMc=v.pzMc===null?'':moneyformat(v.pzMc)
    v.pzMd=v.pzMd===null?'':moneyformat(v.pzMd)
    v.pzNfrat=v.pzNfrat===null?'':moneyformat(v.pzNfrat)
    v.pzNum=v.pzNum===null?'':numformat(v.pzNum)
    v.qcMc=v.qcMc===null?'':moneyformat(v.qcMc)
    v.qcMd=v.qcMd===null?'':moneyformat(v.qcMd)
    v.qcNfrat=v.qcNfrat===null?'':moneyformat(v.qcNfrat)
    v.qcNum=v.qcNum===null?'':numformat(v.qcNum)
    v.qmMc=v.qmMc===null?'':moneyformat(v.qmMc)
    v.qmMd=v.qmMd===null?'':moneyformat(v.qmMd)
    v.qmNfrat=v.qmNfrat===null?'':moneyformat(v.qmNfrat)
    v.qmNum=v.qmNum===null?'':numformat(v.qmNum)
  })
  const sheet =[
    {
      title: '科目余额表',
      tHeader: title,
      multiHeader: multiHeader,
      table: data,
      keys: keys,
      merges: merges,
      sheetName: 'sheet1',
      cellStyle: cellStyle
    },
  ]
  exportExcel(sheet, 'xlsx',props.pageAccName+'-科目余额表-'+strDate+'-'+endDate)
}
</script>
<style lang="less" scoped>
.app-container-node {
  background: white;
  padding: 10px 20px;
  .ant-btn {
    border-color: #aaaaaa;
    font-size: 16px;
  }

  .ant-input-affix-wrapper {
    border-color: #aaaaaa;
  }

}

:deep(.ant-table-scroll) {
  overflow: hidden;
}

:deep(.ant-table-header), :deep(ant-table-body) {
  .ant-table-thead th {
    text-align: center;
    border-right: 1px solid #f0f0f0;

    .ant-table-column-title {
      color: black !important;
      font-weight: bold !important;
    }
  }
}

:deep(td) {
  padding: 5px 8px !important;
  border: 1px solid #a7a7a7 !important;
  border-left: none !important;
  border-bottom: none !important;
  color: black !important;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

:deep(.ant-table-footer) .ant-table-body {
  overflow: hidden !important;
}

:deep(.ant-table-footer) {
  padding: 0;

  tr {
    font-weight: bold !important;
  }
}

.a-table-font-size-16 :deep(td), .a-table-font-size-16 :deep(th) {
  font-size: 16px !important;
}

.a-table-font-size-12 :deep(td), .a-table-font-size-12 :deep(th) {
  font-size: 12px !important;
}

:deep(.table-striped) {
  background-color: azure;
}

:deep(.table-month-striped) {
  background-color: honeydew;
}

:deep(.table-year-striped) {
  background-color: lightyellow;
}
</style>
