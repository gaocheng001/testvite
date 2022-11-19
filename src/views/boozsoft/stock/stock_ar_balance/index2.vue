<template>
  <div>
    <div class="app-container">
      <div class="app-container-head">
        <div class="container-head-title" style="width: 57%;float: left;">
          <AccountPicker  theme="one" @reloadTable="dynamicAdReload"/>
          <span style="font-size: 24px;color: #0096c7;font-weight: bold;float: right;margin-top: -27px;">应收款期初余额</span>
        </div>
        <div class="ant-btn-group" data-v-a1ccd506="" style="float: right">
          <button
            style="float: left"
            type="button"
            class="ant-btn ant-btn-me"
            @click="editflg(edittext)"
          ><span>{{ edittext }}</span></button>
          <span v-if="btnShow">
            <button type="button" class="ant-btn ant-btn-me" @click="addFun"><span>添加</span></button>
            <button type="button" class="ant-btn ant-btn-me" @click="editFun" :disabled="editAndDelBtnShow"><span>修改</span></button>
            <button type="button" class="ant-btn ant-btn-me" @click="del" :disabled="editAndDelBtnShow"><span>删除</span></button>
            <button type="button" class="ant-btn ant-btn-me"><span>导入</span></button>
            <button type="button" class="ant-btn ant-btn-me" @click="audit('1')"><span>审核</span></button>
            <button type="button" class="ant-btn ant-btn-me" @click="audit('0')"><span>弃审</span></button>
          </span>
          <button type="button" class="ant-btn ant-btn-me" @click="closeCurrent(),router.push('/zhongZhang/home/welcome')"><span>退出</span></button>
        </div>
        <div style="clear:both;margin-top: 2.5%" />
        <div style="float: right; margin-left: 10px">
          <a-popover placement="bottom">
            <template #content>
              <a-popconfirm
                ok-text="保存"
                cancel-text="关闭"
                @confirm="confirm"
                @cancel="cancel"
              >
                <template #icon><b>栏目设置</b><br></template>
                <template #title>
                  <a-table bordered :data-source="dynamicColumnData" :columns="dynamicColumns"
                           childrenColumnName="children" :pagination="false" style="max-height: 500px;overflow-y: auto" class="a-table-font-size-12">
                    <template #checkBox="{ text, record }">
                      <a-checkbox v-model:checked="record.check" :disabled="record.isFixed"/>
                    </template>
                    <template #widthInput="{ text, record }">
                      <div class="editable-cell">
                        <div v-if="editableData[record.key]" class="editable-cell-input-wrapper">
                          <a-input type="number" v-model:value="editableData[record.key].width"
                                   @pressEnter="save(record.key,record.min,record.max)" style="width: 80px"/>
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
                <a-button style="width: 165px;border: none">栏目设置</a-button>
              </a-popconfirm>
            </template>
            <a-button>
              <SettingFilled :style="{ fontSize: '14px' }"/>
            </a-button>
          </a-popover>
          <a-button @click="findByStockArBalanceData">
            <SyncOutlined :style="{ fontSize: '14px' }" />
          </a-button>
        </div>
      </div>
      <div style="clear: both"></div>
    </div>
    <div class="app-container">
      <PageWrapper dense content-full-height fixed-height content-class="flex">
        <div class="bg-white m-4 mr-0 overflow-hidden" style="margin-top: -0.5px;margin-left: -5px;float: left;width: 20%;">
          <div style="width: 100%; height: 32px;background-color: #d9d9d9;padding-top:5px;padding-left:10px;font-weight: bold;">
            期初客户列表
            <div style="float: right;">
              <a style="color: black;font-size: 14px;" @click="findArCustAll"><reloadOutlined /></a>&nbsp;
              <a style="color: black;font-size: 14px;" @click="inputShow=true" v-if="!inputShow"><SearchOutlined /></a>&nbsp;
              <a-input v-model:value="serachVal" v-if="inputShow" style="width: 110px;height: 30px;margin-top: -5px;" @keyup.enter="handleSearch"/>
<!--              <a-popover v-model:visible="serachVisible" trigger="click" placement="bottom">-->
<!--                <template #content>-->
<!--                  <a-input v-model:value="serachVal" placeholder="search" @keyup.enter="handleSearch"/>-->
<!--                </template>-->
<!--                <a style="color: black;font-size: 14px;"><SearchOutlined /></a>-->
<!--              </a-popover>-->
              <a style="color: black;font-size: 14px;" @click="custModalShow"><PlusCircleTwoTone /></a>&nbsp;
              <a style="color: black;font-size: 14px;" @click="delArBalance"><MinusCircleTwoTone /></a>&emsp;
            </div>

          </div>
          <BasicTree
            defaultExpandAll
            :tree-data="treeData"
            :checkable="true"
            v-if="treeData.length"
            v-model:selectedKeys="selectedKeys2"
            v-model:checkedKeys="checkedKeys"
            @select="handleSelect"
          />
        </div>
        <div style="width: 80%;float: right;margin-left: 5px;">
          <BasicTable ref="tableRef" @register="registerTable" :dataSource="tableData" :scroll="{ x: totalColumnWidth,y: windowHeight }" :class="'a-table-font-size-12'" @selection-change="selectionChange">
            <template #bcheck="{ record }">
              <a-tag :color="record.bcheck === '1' ? 'green' : 'volcano'">
                {{ record.bcheck === '1' ? '已审核' : '未审核' }}
              </a-tag>
            </template>
            <template #arStyle="{ record }">
              {{ record.arStyle === 'XSFP' ? '销售发票' : record.arStyle === 'YSK'?'应收款':record.arStyle === 'YUSK'?'预收款':'应收票据' }}
            </template>
            <template #arDir="{ record }">
              {{ record.arDir === '1' ? '预收' : '应收' }}
            </template>
            <template #ysIsumBenbi="{ record }">
              {{ toThousandFilter(record.ysIsumBenbi) }}
            </template>
            <template #arIsumBenbi="{ record }">
              {{ toThousandFilter(record.arIsumBenbi) }}
            </template>
            <template #isumBenbi="{ record }">
              {{  toThousandFilter(record.isumBenbi)  }}
            </template>
          </BasicTable>
        </div>
      </PageWrapper>
    </div>
    <Add @save="findByStockArBalanceData" @register="registerSavePage" />
    <Edit @save="findByStockArBalanceData" @register="registerEditPage" />
    <CustModalPop @throwData="custThrowData" @register="registerCustModalPopPage" />
  </div>
</template>
<script setup lang="ts">
import {
  CheckOutlined,
  EditOutlined,
  MinusCircleTwoTone,
  PlusCircleTwoTone,
  ReloadOutlined,
  SearchOutlined,
  SettingFilled,
  SyncOutlined
} from '@ant-design/icons-vue'
import router from "/@/router";
import {BasicTable, useTable} from '/@/components/Table';
import {
  Checkbox as ACheckbox,
  Input as AInput,
  message,
  Popconfirm as APopconfirm,
  Popover as APopover,
  Radio as ARadio,
  Select as ASelect,
  Statistic as AStatistic,
  Table as ATable,
  Tabs as ATabs,
  Tag as ATag,
} from 'ant-design-vue';
import {reactive, ref} from 'vue';
import {getCurrentAccountName} from "/@/api/task-api/tast-bus-api";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {useTabs} from "/@/hooks/web/useTabs";
import {useMessage} from "/@/hooks/web/useMessage";
import {BasicTree} from '/@/components/Tree';
import {PageWrapper} from '/@/components/Page';
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {
  auditStockArBalance,
  delStockArBalance,
  findByStockArBalance,
  getByStockArBalanceTask,
  stockArBalanceTaskDelByUserName,
  stockArBalanceTaskEditNewTime,
  stockArBalanceTaskSave
} from "/@/api/record/stock/stock_ar_balance";
import {useUserStoreWidthOut} from '/@/store/modules/user';
import {useModal} from "/@/components/Modal";
import Add from '/@/views/boozsoft/stock/stock_ar_balance/popup/save.vue';
import Edit from '/@/views/boozsoft/stock/stock_ar_balance/popup/edit.vue';
import CustModalPop from '/@/views/boozsoft/global/popup/customer_info/modalPop.vue';
import {
  delSrCustByCustId,
  getArCustCustId,
  stockArCustFindAll,
  stockArCustSave
} from "/@/api/record/stock/stock_ar_cust";
import {assemblyDynamicColumn, initDynamics} from "/@/views/boozsoft/stock/stock_ar_balance/data";
import {cloneDeep} from "lodash-es";
import {findDbLanMuList, saveLanMuList} from "/@/api/record/system/accvoucher";
import {getThisAdInfoData} from "/@/api/record/system/financial-settings";

// 全局常量
  const databaseName = ref('');
  const treeData:any = ref([]);
  const selectedKeys2:any = ref<string[]>(['0'])
  const checkedKeys:any = ref<string[]>([])
  const {createConfirm, createWarningModal, createMessage} = useMessage();
  const ARadioGroup = ARadio.Group
  const ARadioButton = ARadio.Button
  const ASelectOption = ASelect.Option;
  const AInputSearch = AInput.Search;
  const AStatisticCountdown = AStatistic.Countdown;
  const ATabPane = ATabs.TabPane;
  const database = ref(getCurrentAccountName(true));
  const accId = ref(getCurrentAccountName(false));
  const iyear = ref('');
  const startPeriod = ref('');// 账套启用期间
  const edittext = ref('编辑');
  const editAndDelBtnShow = ref(false);
  const btnShow = ref(false);
  const serachVisible = ref(false);
  const tableData = ref([])
  const serachVal = ref('')
  const dynamicColumnData:any = ref([])
  let dynamicColumnDataCopy = []
  const dynamicColumns = initDynamics().DEFAULT
const editableData = reactive({});
const lanMuData = {'accId':'','menuName':'应收款期初余额','type':'账套',objects: '',username:useUserStoreWidthOut().getUserInfo.username}
const windowWidth  = (document.documentElement.clientWidth -(70+280))
const windowHeight = (window.innerHeight - (302))
const visible = ref(false);
const totalColumnWidth = ref(0)
const tableRef:any = ref(null)
const custDataChange:any = ref('')
const CrudApi = {
columns: [
  {
    title: '状态',
    dataIndex: 'bcheck',
    ellipsis: true,
    align: 'center',
    slots: { customRender: 'bcheck' },
  },
  {
    title: '应收类型',
    dataIndex: 'arStyle',
    ellipsis: true,
    align: 'left',
    slots: { customRender: 'arStyle' },
  },
  {
    title: '客户名称',
    dataIndex: 'custName',
    ellipsis: true,
    align: 'left',
  },
  {
    title: '收款方向',
    dataIndex: 'arDir',
    ellipsis: true,
    align: 'left',
    slots: { customRender: 'arDir' },
  },
  {
    title: '单据日期',
    dataIndex: 'ddate',
    ellipsis: true,
    align: 'left',
  },
  {
    title: '预收账款',
    dataIndex: 'ysIsumBenbi',
    ellipsis: true,
    align: 'right',
    slots: { customRender: 'ysIsumBenbi' },
  },
  {
    title: '应收账款',
    dataIndex: 'arIsumBenbi',
    ellipsis: true,
    align: 'right',slots: { customRender: 'arIsumBenbi' },
  },
  {
    title: '期初余额',
    dataIndex: 'isumBenbi',
    ellipsis: true,
    align: 'right',slots: { customRender: 'isumBenbi' },
  },
  {
    title: '项目',
    dataIndex: 'citemName',
    ellipsis: true,
    align: 'left',
  },
  {
    title: '审核人',
    dataIndex: 'bcheckUserName',
    ellipsis: true,
    align: 'left',
  },
  {
    title: '审核时间',
    dataIndex: 'bcheckTime',
    ellipsis: true,
    align: 'left',
  },

]
}
const pageParameter = reactive({
    custId:'',
    iyear:''
  })
const inputShow:any = ref(false)

  const { closeCurrent } =useTabs();
  const [registerCustModalPopPage, { openModal: openCustMoalPopPage }] = useModal();
  const [registerSavePage, { openModal: openSavePage }] = useModal();
  const [registerEditPage, { openModal: openEditPage }] = useModal();
  // 这是示例组件
  const [registerTable, { reload,getSelectRows,getDataSource,setTableData,setColumns,clearSelectedRowKeys,getColumns }] = useTable({
    columns: initDynamics()['DATA'],
    rowSelection: { type: 'checkbox' },
    pagination:{ pageSize: 50,showSizeChanger: true, pageSizeOptions: ['50','100'],showTotal: t => `总共${t}条数据` },
  });
  const dynamicAdReload = async (obj) => {
    accId.value=obj.accId
    iyear.value=obj.year
    database.value=obj.accountMode
    pageParameter.iyear=obj.year
    // 进页面执行
    getThisAdInfoData({ accId: obj.accId }).then((res) => {
      startPeriod.value=res.startPeriod
    });

    findArCustAll()
    resetDynamicColumnData()
    findByStockArBalanceData()
  }
  async function editflg(text) {
    if(iyear.value=='' || iyear.value==undefined){
      return createWarningModal({ content: '请先选择年度!' });
    }
    if(text=='编辑'){
     let taskData= await useRouteApi(getByStockArBalanceTask, { schemaName: database })(iyear.value)
      if(taskData==''){
        balanceTaskSave()
      }else{
        // 任务不是当前操作员的
        if(taskData.caozuoUnique!==useUserStoreWidthOut().getUserInfo.username){
          return createWarningModal({ content: taskData.caozuoUnique+'正在编辑库存期初余额,不能同时进行操作！' });
        }else{
          await useRouteApi(stockArBalanceTaskEditNewTime, { schemaName: database })(taskData.id)
        }
      }
    }else{
      balanceTaskDel()
    }
    btnShow.value=text=='编辑'?true:false
    edittext.value=text=='编辑'?'返回':'编辑'
  }
  async function balanceTaskDel() {
    await useRouteApi(stockArBalanceTaskDelByUserName, { schemaName: database })({iyear:iyear.value,userName:useUserStoreWidthOut().getUserInfo.username,functionModule:'应付款期初余额',method:'编辑'})
  }
  async function balanceTaskSave() {
    await useRouteApi(stockArBalanceTaskSave, { schemaName: database })({iyear:iyear.value,userName:useUserStoreWidthOut().getUserInfo.username,functionModule:'应付款期初余额',method:'编辑'})
  }

//金额格式化
function toThousandFilter(num:any) {
  if (num=='' || num==null){
    return ''
  }
  return (+num || 0).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
}

// 行勾选事件
function selectionChange(a) {
  editAndDelBtnShow.value=a.rows.filter(aa=>aa.bcheck=='1').length>0?true:false
}
const custModalShow = () => {
  openCustMoalPopPage(true, {
    database: database.value,
    accId: accId.value,
  });
}
async function custThrowData(obj) {
  let custid=await useRouteApi(getArCustCustId, { schemaName: database })('')
  let map:any=[]
  obj.forEach(async (a)=>{
    let sum=custid.length==0?0:custid.filter(id=>id==a.id).length
    if(sum==0){
      map.push(
        {custId:a.id,cmaker:useUserStoreWidthOut().getUserInfo.id,cmakerDate:new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," ")}
      )
    }
  })
  // 添加到应收款期初客户
  await useRouteApi(stockArCustSave, { schemaName: database })(map)
  findArCustAll()
}

// 获取期初客户
async function findArCustAll() {
  serachVal.value=''
  let temp=await useRouteApi(stockArCustFindAll, { schemaName: database })('')
  let tree:any=[]
  temp.forEach(a=>{
    tree.push(
      {key:a.id,title:'['+a.custCode+']'+a.custName,custName:a.custName,children:[]}
    )
  })
  treeData.value = []
  treeData.value.push({title: '全部',key:'0',checkable:false,children: tree})
  selectedKeys2.value=['0']
}
function handleSelect(obj) {
  if(obj.toString()!==''){
    selectedKeys2.value=obj
    custDataChange.value=treeData.value[0].children.filter(a=>a.key==obj[0])[0]
    pageParameter.custId=treeData.value[0].children.filter(a=>a.key==obj[0])[0].key
  }else{
    pageParameter.custId=''
    custDataChange.value=''
    selectedKeys2.value=['0']
  }
  findByStockArBalanceData()
}
async function delArBalance() {
  if(checkedKeys.value.length==0){
    return createWarningModal({ content: '至少选择一条数据进行删除！' });
  }
  let rightTableId=[]
  for (let i = 0; i < checkedKeys.value.length; i++) {
    let sum=await useRouteApi(countByCustIdAndIyearAndBcheck, { schemaName: database })({custId:checkedKeys.value[i],iyear:iyear.value})
    if(sum>0){
      return createWarningModal({ content: '客户【'+treeData.value[0].children.filter(a=>a.key==checkedKeys.value[i])[0].custName+'】期初有已审核,不能删除！' });
    }else{
      let temp=tableData.value.filter(a=>a.custId==checkedKeys.value[i])
      if(temp.length>0){
        rightTableId.push(temp[0].id)
      }
    }
  }
  createConfirm({
    iconType: 'warning',
    title: '警告',
    content: '删除后数据不能恢复，你确认要删除吗？',
    onOk: async () => {
      await useRouteApi(delSrCustByCustId, { schemaName: database })(checkedKeys.value)
      // 删除期初数据
      if(rightTableId.length>0){
        await useRouteApi(delStockArBalance,{schemaName: database})({id:rightTableId})
      }
      findArCustAll()
      findByStockArBalanceData()
    }
  })
}
async function handleSearch() {
    if(serachVal.value==''){
      inputShow.value=false
    }
  serachVisible.value=false
  let temp=treeData.value[0].children.filter(a=>a.title.indexOf(serachVal.value)!=-1)
  if(serachVal.value!==''){
    treeData.value = []
    treeData.value.push({title: '全部',key:'0',checkable:false,children: temp})
  }else{
    findArCustAll()
  }
}

function addFun() {
  if(iyear.value==undefined|| iyear.value==''){
    return createWarningModal({ content: '请选择年度！' });
  }
  if(custDataChange.value==''){
    return createWarningModal({ content: '请选择客户档案！' });
  }
  openSavePage(true,{
    database:database.value,
    iyear:iyear.value,
    custDataChange:custDataChange.value,
    startPeriod:startPeriod.value,
  })
}
// 查询应收款期初余额
async function findByStockArBalanceData() {
  clearSelectedRowKeys()
  let temp=await useRouteApi(findByStockArBalance, { schemaName: database })(pageParameter)
  tableData.value=temp
}

function editFun() {
  if(iyear.value==undefined|| iyear.value==''){
    return createWarningModal({ content: '请选择年度！' });
  }
  if(getSelectRows().length!==1){
    return createWarningModal({ content: '请选择一条数据进行修改！' });
  }
  openEditPage(true,{
    database:database.value,
    iyear:iyear.value,
    custDataChange:custDataChange.value,
    startPeriod:startPeriod.value,
    data:getSelectRows()[0]
  })
}
// 审核
async function audit(type) {
  if(getSelectRows().length==0){
    return createWarningModal({ content: '至少选择一条数据！' });
  }
  let map={}
  if(type=='1'){
    map={
      bcheck:'1',
      bcheckUser:useUserStoreWidthOut().getUserInfo.username,
      bcheckTime:new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "),
      id:getSelectRows().map(a=>a.id),
    }
  }
  else{
    map={
      bcheck:'0',
      bcheckUser:'',
      bcheckTime:'',
      id:getSelectRows().map(a=>a.id),
    }
  }
  await useRouteApi(auditStockArBalance, {schemaName: database})(map)
  findByStockArBalanceData()
}
async function del() {
  if(getSelectRows().length==0){
    return createWarningModal({ content: '至少选择一条数据进行删除！' });
  }
  createConfirm({
    iconType: 'warning',
    title: '警告',
    content: '删除后数据不能恢复，你确认要删除吗？',
    onOk: async () => {
      await useRouteApi(delStockArBalance,{schemaName: database})({id:getSelectRows().map(a=>a.id)})
      findByStockArBalanceData()
    }
  })
}
/*************************** 栏目操作 **********************************/
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
const save = (key: string, min: number, max: number) => {
  editableData[key].width = editableData[key].width > max ? max : editableData[key].width < min ? min : editableData[key].width
  if (key.toString().indexOf('-') != -1) {
    let arr:any = key.split('-');
    let one:any = parseInt(arr[0])
    if (arr.length == 2) {
      Object.assign(dynamicColumnData.value[one].children.filter(item => key === item.key)[0], editableData[key]);
      Object.assign(dynamicColumnData.value[one].children.filter(item => key === item.key)[0], editableData[key]);
    } else {
      let two:any = parseInt(arr[1] - 1)
      Object.assign(dynamicColumnData.value[one].children[two].children.filter(item => key === item.key)[0], editableData[key]);
    }
  } else {
    Object.assign(dynamicColumnData.value.filter(item => key === item.key)[0], editableData[key]);
  }
  delete editableData[key];
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
function resetDynamicColumnData() {
  // 先从数据查询是否已经设置
  lanMuData.accId = database.value
  findDbLanMuList(lanMuData).then(res=>{
    // 栏目列
    let dbList = res.items
    if (dbList.length > 0){
      let statiList:any = initDynamics()['DATA']
      dbList = combineParameters(statiList,dbList)
      dynamicColumnData.value = dbList
      dynamicColumnDataCopy = JSON.parse(JSON.stringify(dbList))
      // 表格列
      reloadColumns()
    }
    else {
      let statiList:any = initDynamics()['DATA']
      dynamicColumnData.value = statiList
      dynamicColumnDataCopy = JSON.parse(JSON.stringify(statiList))
      // 表格列
      reloadColumns()
    }
  })
}
function combineParameters(staticList:any,dbList:any) {
  staticList.forEach(item=>{
    dbList.forEach(item2=>{
      if (item.key === item2.key && item.name === item2.name){
        item.nameNew = item2.nameNew
        item.width = parseInt(item2.width)
        item.check = item2.check == 'true'
        item.align = item2.align
      }
    })
  })
  return staticList
}
const reloadColumns = ()=>{
  let a = []
  a = getColumns()
  let last = a.pop()
  let newA = JSON.parse(JSON.stringify(CrudApi.columns))
  newA= assemblyDynamicColumn(JSON.parse(JSON.stringify(dynamicColumnData.value)),newA)
  setColumns(newA)
}
const cancel = (e: MouseEvent) => {
  // 恢复默认
  dynamicColumnData.value = []
  dynamicColumnData.value = dynamicColumnDataCopy
}
const confirm = (e: MouseEvent) => {
  // 询问
  createConfirm({
    iconType: 'warning',
    title: '栏目同步',
    content: '是否将刚才设置同步数据库!',
    onOk: async() => {
      // 调整数据库 列参数
      lanMuData.accId = database.value
      lanMuData.objects = JSON.stringify(filterModifyData(dynamicColumnData.value, dynamicColumnDataCopy))
      if (lanMuData.objects == '[]'){
        createWarningModal({content: '请先做修改后再进行确认同步数据库！'})
      }else {
        saveLanMuList(lanMuData).then(res=>{
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
function filterModifyData(lanMuList:any,copyList) {
  let a =  lanMuList.filter(item=> {
    try {
      copyList.forEach(item2=>{
        if (item.key === item2.key && item.name == item2.name){
          if (item.nameNew != item2.nameNew || item.width != item2.width || item.check != item2.check || item.align != item2.align)
            throw new Error('ok')
        }
      })
      return false
    }catch (e) {
      if (e.message == 'ok'){
        return  true
      }else {
        return  false
      }
    }
  })
  return a;
}
/************************************* End **********************************/
</script>
<style src="../../../../assets/styles/global-menu-index-block.less" lang="less" scoped></style>
<style src="../../../../assets/styles/global-menu-index.less" lang="less" scoped></style>
<style scoped>
.ant-table-wrapper .ant-table-content .ant-table-tbody tr:nth-of-type(1) > td {
  padding: -1px;
}
.app-container:nth-of-type(1) {
  background-color: #f2f2f2;
  padding: 10px 5px;
  margin: 10px 10px 5px;
}
.app-container:nth-of-type(2) {
  padding: 0px;
  margin: 5px 10px;
}

.bg-white{
  width: 250px ;
  height: calc(100% - 235px);
  border: 1px #cccccc solid;
  background:white ;
  margin-top: -0.5%;
}

.a-table-font-size-12 :deep(td),
.a-table-font-size-12 :deep(th) {
  font-size: 14px !important;
  padding: 2px 8px !important;
}
.a-table-font-size-12 :deep(th) {
  background-color: #d9d9d9;
  font-weight: bold;
}
</style>
