<template>
  <div>
    <div class="app-container">
      <div class="app-container-head"><img :src="getThisIndexImg()" class="container-head-img" draggable="false" >
        <div class="container-head-title">
          <b class="noneSpan">对应科目设置</b>
        </div>
        <div class="ant-btn-group" data-v-a1ccd506="" style="float: right">
          <button type="button" class="ant-btn ant-btn-me" @click="isEdit=true" v-if="isEdit === false"><span>编辑</span></button>
          <button type="button" class="ant-btn ant-btn-me" @click="isEdit=false" v-if="isEdit === true"><span>返回</span></button>
          <button type="button" class="ant-btn ant-btn-me" @click="closeCurrent,router.push('/zhongZhang/home/welcome')"><span>退出</span></button>
        </div>
      </div>

      <div class="app-container-neck">
        <div style="float:left;width: 600px;">
          <AccountPicker  theme="one" @reloadTable="dynamicAdReload"/>
        </div>
        <div style="float: right; margin-left: 10px">
          <a-button style="padding: 0px 12px !important; margin-right: 10px" @click="reload">
            <SyncOutlined :style="{ fontSize: '14px' }" />
          </a-button>
        </div>
        <div style="float: right; position: relative">
          <!-- 搜索 -->
          <a-select v-model:value="pageParameter.searchConditon.requirement" style="width: 130px;" class="special_select">
            <template v-for="item in searchConditonList">
              <a-select-option :value="item.value">
                {{ item.title }}
              </a-select-option>
            </template>
          </a-select>
          <a-input-search
            placeholder=""
            v-model:value="pageParameter.searchConditon.value"
            @search="reload"
            style="width: 150px;border-radius: 4px"
          />
        </div>
      </div>
    </div>
    <div class="app-container">
      <div style="float: left;margin-top: 10px;">
        <a-tabs @change="tabsCheck" tab-position="left">
          <a-tab-pane v-for="(item, i) in typylist" :key="item.value" :tab="`${item.title}`"/>
        </a-tabs>
      </div>
      <div style="width: calc(100% - 184px); float: right;margin-top: 10px;">

        <BasicTable
          ref="tableRef"
          :class="'a-table-font-size-12'"
          :scroll="{ x: windowWidth,y: windowHeight }"
          :bordered="true"
          :row-selection="{ type: 'checkbox',selectedRowKeys: tableSelectedRowKeys, onChange: tableCheck }"
          :rowKey="r=>r.ccode"
          size="small"
          @register="registerTable"
        >

          <template #kmname="{ record }">
            <template v-if="record?.rowEdit&&isEdit">
              <a-select
                v-model:value="record.kmcode"
                show-search
                style="width: 220px;text-align: center;"
                allowClear="true"
                :filter-option="filterOption"
              >
                <a-select-option v-for="d in kmList" :value="d.ccode">
                  {{ d.value }}
                </a-select-option>
              </a-select>
              <CheckOutlined  @click="dbSave(record);" style="padding-left: 5px;"/>
            </template>
            <template v-else>
              <span class="a-table-font-arial">
                {{record.kmcode}}  {{record.kmname}}
              <EditOutlined  v-if="isEdit" @click="record.rowEdit = true;"/></span>
            </template>

         </template>

          <template #ccode="{ record }">
            <span style="float: left;">{{ record.ccode}}</span>
          </template>

          <template #ccodeName="{ record }">
            <span style="float: left;">{{ addspace(record.igrade,record.ccodeName) }}</span>
          </template>

        </BasicTable>
      </div>
    </div>
    <a-table :columns="columns" :data-source="data" :row-selection="rowSelection" />
    <a-modal v-model:visible="visibleModel" title="复制平行记账科目" @ok="handleModelOk">
      <br>
      <div style="margin-left: 10%;">
        选择上年区间： <a-select v-model:value="upiyear" style="width: 130px;" class="special_select">
        <a-select-option v-for="item in upiyearList" :value="item.accountYear">
          {{ item.accountYear }}
        </a-select-option>
      </a-select>
      </div>
      <br>
    </a-modal>
  </div>

</template>
<script setup lang="ts">
import router from "/@/router";
import {BasicTable, useTable} from '/@/components/Table';
import {SyncOutlined,EditOutlined,CheckOutlined} from '@ant-design/icons-vue';
import {
  Checkbox as ACheckbox,
  Table as ATable,
  Modal as AModal,
  Input as AInput,
  Select as ASelect,
  Statistic as AStatistic,
  Tabs as ATabs,
} from 'ant-design-vue';
import {reactive, ref} from 'vue';
import {getCurrentAccountName,getThisIndexImg} from "/@/api/task-api/tast-bus-api";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker.vue";
import {useTabs} from "/@/hooks/web/useTabs";
import {
  company_editCodePxjzOrCyfx,
  company_findAllCodePxjzOrCyfxOrderByAsc, company_findByFirstCcodeLength,
} from "/@/api/codekemu/codekemu";
import {
  getGdzcList,
  save,
} from "/@/api/record/gdzc/fa-km";

import {useMessage} from "/@/hooks/web/useMessage";
import {exportExcel} from "/@/api/record/generalLedger/excelExport";
import {findYearByAccount} from "/@/api/record/system/bank-statement";
import {findDataBase} from "/@/api/record/system/account";
import {aoaToSheetXlsx} from "/@/components/Excel";
import {findCodeKmAll} from "/@/api/record/generalLedger/data";
const ASelectOption = ASelect.Option;
const AInputSearch = AInput.Search;
const AStatisticCountdown = AStatistic.Countdown;
const ATabPane = ATabs.TabPane;
const database = ref(getCurrentAccountName(true));
const columns = [
  {title: '类别编码',dataIndex: 'ecode',key: 'ecode',slots: { customRender: 'ecode' },width:150},
  {title: '类别名称',dataIndex: 'ename',key: 'ename',slots: { customRender: 'ename' },width:150},
  {title: '科目名称',dataIndex: 'kmname',key: 'kmname',slots: { customRender: 'kmname' },width:150},
  {title: '科目编码',dataIndex: 'kmcode',key: 'kmcode',slots: { customRender: 'kmcode' },width:150, defaultHidden: true,},
  {title: 'id',dataIndex: 'id',key: 'id',slots: { customRender: 'id' },width:150, defaultHidden: true,},


];
const columns2 = [
  {title: '部门编码',dataIndex: 'ecode',key: 'ecode',slots: { customRender: 'ecode' },width:150},
  {title: '部门名称',dataIndex: 'ename',key: 'ename',slots: { customRender: 'ename' },width:150},
  {title: '科目名称',dataIndex: 'kmname',key: 'kmname',slots: { customRender: 'kmname' },width:150},
  {title: '科目编码',dataIndex: 'kmcode',key: 'kmcode',slots: { customRender: 'kmcode' },width:150, defaultHidden: true,},

];
const columns3 = [
  {title: '项目编码',dataIndex: 'ecode',key: 'ecode',slots: { customRender: 'ecode' },width:150},
  {title: '项目名称',dataIndex: 'ename',key: 'ename',slots: { customRender: 'ename' },width:150},
  {title: '科目名称',dataIndex: 'kmname',key: 'kmname',slots: { customRender: 'kmname' },width:150},
  {title: '科目编码',dataIndex: 'kmcode',key: 'kmcode',slots: { customRender: 'kmcode' },width:150, defaultHidden: true,},


];
const searchConditonList = ref([
  {title:'科目编码',value: 'ccode'},
  {title:'科目名称',value: 'ccodeName'},
  {title:'科目方向',value: 'bprogerty'},
  {title:'科目类型',value: 'cclass'},
])
const typylist=reactive([
  {title:'固定资产',value:'0'},
  {title:'累计折旧',value:'1'},
  {title:'部门科目',value:'2'},
  {title:'项目科目',value:'3'},

])
// 会计科目
const kmList: any = ref([])
const isEdit = ref(false)
const visibleModel = ref(false)
const upiyearList = ref([])
const tableSelectedRowKeys = ref([])
const tableSelectedRowObjs = ref([])
const upiyear = ref('')
const tableRef = ref(null)
const windowWidth = (document.documentElement.clientWidth - 900)
const windowHeight = (window.innerHeight - (310))
const { closeCurrent } =useTabs();
const { createConfirm,createWarningModal,createMessage } = useMessage();
const pageParameter = reactive({
  searchConditon: {
    value:'',
    requirement:'ccode',
  },
  flag: '0',
  type: 'pxjz',
  companyName: '',
  iyear: '',
  accId: '',
})

// 这是示例组件
const [registerTable, { reload,getSelectRows,getDataSource,setTableData,getColumns,clearSelectedRowKeys,deleteSelectRowByKey,setColumns }] = useTable({
  api: useRouteApi(getGdzcList,{schemaName: database}),
  columns: columns,
  isTreeTable: true,
  pagination:{ pageSize: 200,showSizeChanger: true, pageSizeOptions: ['200','500','1000','1500'],showTotal: t => `总共${t}条数据` },
  searchInfo: pageParameter
});
const dynamicAdReload = async(obj) => {
  database.value=obj.accId+'-'+obj.iyear
  pageParameter.companyName=obj.companyName
  pageParameter.iyear=obj.iyear
  pageParameter.accId=obj.accId

  // 会计科目
  kmList.value = await useRouteApi(findCodeKmAll,{schemaName:database})({});

  reload()
}
const tabsCheck = (data) => {
  tableSelectedRowObjs.value = [];
  tableSelectedRowKeys.value = [];
  if(data === '0'){
    setColumns(columns)
  }else if(data === '1'){
    setColumns(columns)
  }else if(data === '2'){
    setColumns(columns2)
  }else if(data === '3'){
    setColumns(columns3)
  }
  pageParameter.flag=data
  pageReload()
}
const pageReload =  () =>{
  console.log(pageParameter)
  reload({
    searchInfo: pageParameter
  })
}
const toSave = async (flag) => {
  if(tableSelectedRowKeys.value.length===0){
    createConfirmPop('至少选择一条会计科目进行操作')
    return false;
  }
  let ccode:any=[]
  let list=getSelectRows()
  list.forEach(v=>{
    ccode.push(v.ccode)
  })
  let map={
    data:tableSelectedRowKeys.value.join(','),
    type:'pxjz',
    flag:flag
  }
  await useRouteApi(company_editCodePxjzOrCyfx,{schemaName: database})(map)
    .then(()=>{
      reload()
    })
}

// 两个数组去重
function getArrDifference(arr1, arr2) {
  if(arr2.length==0) return [];
  return arr1.concat(arr2).filter(function(v, i, arr) {
    return arr.indexOf(v) === arr.lastIndexOf(v);
  });
}

function createConfirmPop(text) {
  createConfirm({
    iconType: 'warning',
    title: '警告',
    content: text,
    onOk: async() => {}
  })
}

function addspace(igrade, str) {
  var space = '';
  for (let i = 1; i < igrade; i++) {
    space += '\xa0\xa0\xa0\xa0';
  }
  return space + str;
}

const dbSave = async (o) => {
  //添加科目
  console.log(o)
  o.flg = pageParameter.flag
  await useRouteApi(save,{schemaName: database})(o)
    .then(()=>{
      reload()
    })
}
</script>
<style src="../../../../assets/styles/global-menu-index-block.less" lang="less" scoped></style>
<style src="../../../../assets/styles/global-menu-index.less" lang="less" scoped></style>
<style src="../../../../assets/styles/global-container-index.less" lang="less" scoped></style>
<style>
/*分页那栏颜色*/
.ant-table-wrapper{
  padding: 0 !important;
  background: #f2f2f2 !important;
}
</style>
<style scoped>
.app-container:nth-of-type(1) {
  background-color: #f2f2f2;
  padding: 10px 5px;
  margin: 10px 10px 5px;
}
/*第二段背景色长度*/
.app-container:nth-of-type(2) {
  background-color: #f2f2f2;
  padding: 0px;
  margin: 5px 10px;
  height: 725px;
}

.a-table-font-size-12 :deep(td),
.a-table-font-size-12 :deep(th) {
  font-size: 14px !important;
  padding: 2px 8px !important;
}
:deep(.ant-calendar-picker-input.ant-input),
:deep(.ant-select-single:not(.ant-select-customize-input)
      .ant-select-selector
      .ant-select-selection-search-input) {
  border: none;
  border-bottom: solid 1px rgb(191, 191, 191) !important;
}
.tableUStyle {
  color: blue;
  cursor: pointer;
  text-decoration:none;
}
.tableUStyle:hover{
  color: red;
}
</style>
