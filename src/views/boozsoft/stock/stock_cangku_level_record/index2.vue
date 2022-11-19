<template>
  <div>
    <div class="app-container lcr-theme-div">
      <div>
        <div>
          <ProfileOutlined style="color: #0096c7;font-size: 50px;"/>
        </div>
        <div> <AccountPicker theme="three" @reloadTable="dynamicAdReload"/></div>
        <div style="display: inline-block;position:absolute;top:60px;left:80px;font-size: 10px;color:#999999;">共 {{ tableData.length }} 条记录</div>
      </div>
      <div>
        <div>  <b class="noneSpan" style="font-size: 26px;color: #0096c7;">仓库级别档案</b></div>
      </div>
      <div>
        <div>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            ant-click-animating-without-extra-node="false"
            @click="condClick"
          ><span>查询</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            ant-click-animating-without-extra-node="false"
            @click="add"
          ><span>扩容</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            ant-click-animating-without-extra-node="false"
            @click="addRecord"
          ><span>添加说明</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            ant-click-animating-without-extra-node="false"
            @click="del"
          ><span>缩容</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            ant-click-animating-without-extra-node="false"
            @click="startflag('1')"
          ><span>启用</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            ant-click-animating-without-extra-node="false"
            @click="startflag('0')"
          ><span>停用</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            ant-click-animating-without-extra-node="false"
            @click="setdefault('0')"
          ><span>设置默认</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            ant-click-animating-without-extra-node="false"
            @click="closeCurrent(),router.push('/zhongZhang/home/welcome')"
          ><span>退出</span></button>
        </div>
      </div>
    </div>
    <div class="app-container">
      <BasicTable @register="registerTable" :dataSource="dataSource" :row-selection="{ type: 'checkbox',selectedRowKeys: selectedRowKeys, onChange: rowSelection }" :class="'a-table-font-size-12'" >
        <template #recordFlag="{ record }">
          <a-tag :color="record.recordFlag === '1' ? 'green' : 'volcano'">
            {{ record.recordFlag =='1'?'启用':'停用'}}
          </a-tag>
        </template>
      </BasicTable>
    </div>
    <Query
      @save="loadPage"
      @register="registerQueryPage"
    />
    <a-modal
      v-model:visible="visibleModel"
      title="添加档案说明"
      @ok="modelOk"
      @cancel="visibleModel=false"
      okText="确定"
      cancelText="关闭"
    >
      <a-textarea v-model:value="textareaText" rows="5" cols="33"/>
    </a-modal>
    <a-modal
      v-model:visible="visibleModel2"
      title="初始化默认数据"
      @ok="modelOk2"
      @cancel="visibleModel2=false"
      okText="确定"
      cancelText="关闭"
    >
      <br />
      &nbsp;&nbsp;&nbsp;&nbsp;默认
      <a-input-number
        v-model:value="visibleValue"
        :min="10"
        :max="10"
        style="width: 100px"
      />条数据(最大10条) <br /><br />
    </a-modal>
  </div>
</template>
<script setup lang="ts">
import {SyncOutlined,UnorderedListOutlined,ProfileOutlined} from '@ant-design/icons-vue';
import {BasicTable, useTable} from '/@/components/Table';
import router from "/@/router";
import {useModal} from '/@/components/Modal';
import {
  Input as AInput,
  InputNumber as AInputNumber,
  Modal as AModal,
  Select as ASelect,
  Statistic as AStatistic,
  Tabs as ATabs,
  Tag as ATag,
} from 'ant-design-vue';
import {onMounted, reactive, ref, unref} from 'vue';
import {useUserStore,} from '/@/store/modules/user';
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {getCurrentAccountName} from "/@/api/task-api/tast-bus-api";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-DATA.vue";
import Query from "/@/views/boozsoft/stock/stock_cangku_level_record/popup/query.vue";
import {useTabs} from "/@/hooks/web/useTabs";
import {useMessage} from "/@/hooks/web/useMessage";
import {
  editBydefaultflag,
  editByExpalin,
  editRecordByflag,
  findAllByCangkuIdAndCangkuLevelOrder,
  findAllByCangkuIdAndCangkuLevelOrderAndParentId,
  saveRecord
} from "/@/api/record/stock/stock-cangku-level-record";
import {findDataBase} from "/@/api/record/system/account";
import {findAllStockClass} from "/@/api/record/stock/stock_class";

const ATextarea=AInput.TextArea

const ASelectOption = ASelect.Option;
const AInputSearch = AInput.Search;
const AStatisticCountdown = AStatistic.Countdown;
const ATabPane = ATabs.TabPane;
const { closeCurrent } =useTabs();
const userStore = useUserStore();

const {createConfirm, createWarningModal} = useMessage();
// 这是示例组件
const database=ref(getCurrentAccountName(true));
const accId=ref(getCurrentAccountName(false));

const tableTotal=ref(0);
const visibleModel=ref(false);
const visibleModel2=ref(false);
const visibleValue=ref(10);
const textareaText=ref('');
const ckNum=ref('');
const ckName=ref('');
const ckId=ref('');
const recordName=ref('');//档案名称,用于新增
const tableData=ref([]);

const accIyear=ref('');
// 页面变量
const pageParameter=reactive({
  database: database.value,
})
const windowHeight = (window.innerHeight - 350)
const [registerQueryPage, {openModal: openQueryPageM}] = useModal()
const selectedRowKeys:any = ref([]);
const selectedRowData:any = ref([]);


const dataSource:any = ref([]);
const columns:any = ref([]);
const val = { openOne: 0 }

// 这是示例组件
const [registerTable, { reload,getSelectRows,getDataSource,setTableData }] = useTable({
  columns: columns,
  isTreeTable: true,
  pagination:{ pageSize: 50,showSizeChanger: true, pageSizeOptions: ['50','100'],showTotal: t => `总共${t}条数据` },
});

onMounted(async()=>{
  condClick()
})
function condClick() {
  val.openOne = 1
  openQueryPageM(true, {
    data: val
  })
}
async function loadPage(data) {
  columns.value=[]
  dataSource.value=[]

  tableData.value=data
  ckNum.value=[...new Set(data.map(v=>v.ckNum))].toString()
  ckName.value=[...new Set(data.map(v=>v.ckName))].toString()
  ckId.value=[...new Set(data.map(v=>v.cangkuId))].toString()
  // 二级
  if(data.length===1){
    recordName.value=data[0].title
    columns.value.push(
      {
        title: '仓库信息',
        dataIndex: 'ckNum',
      },
      {
        title: '档案级次',
        dataIndex: 'parentLevelNum',
      },
      {
        title: '档案名称',
        dataIndex: 'title',
      },
      {
        title: '档案说明',
        dataIndex: 'recordExplain',
      },

      {
        title: '是否默认',
        dataIndex: 'recordDefault',
        width:80
      },
      {
        title: '状态',
        dataIndex: 'recordFlag',
        width:80,
        slots: { customRender: 'recordFlag' },
      }
    )
    let item=await useRouteApi(findAllByCangkuIdAndCangkuLevelOrder,{ schemaName: database })({cangkuId:ckId.value,levelOrder:data.length+1})  // levelOrder也可以直接写死 2...3....
    item.forEach((v,index)=>{
      dataSource.value.push(
        {ckNum:ckNum.value+'-'+ckName.value,title:v.recordName,sysNum:v.sysNum,key:index+1,id:v.id,parentLevelNum:v.parentLevelNum,recordExplain:v.recordExplain,recordDefault:v.recordDefault=='0'?'':'是',recordFlag:v.recordFlag}
      )
    })
  }
  // 3级
  if(data.length===2){
    recordName.value=data[1].title
    let parentData=data[0].list.filter(v=>v.value===data[0].value)[0].name
    columns.value.push(
      {
        title: '仓库信息',
        dataIndex: 'ckNum',
      },
      {
        title: '级别2',
        dataIndex: 'parent1',
      },
      {
        title: '档案级次',
        dataIndex: 'parentLevelNum',
      },
      {
        title: '档案名称',
        dataIndex: 'title',
      },
      {
        title: '档案说明',
        dataIndex: 'recordExplain',
      },

      {
        title: '是否默认',
        dataIndex: 'recordDefault',
        width:80
      },
      {
        title: '状态',
        dataIndex: 'recordFlag',
        width:80,
        slots: { customRender: 'recordFlag' },
      }
    )

    let parentId=data[0].value
    let item=await useRouteApi(findAllByCangkuIdAndCangkuLevelOrderAndParentId,{ schemaName: database })({cangkuId:ckId.value,levelOrder:data.length+1,parentId:parentId})
    item.forEach((v,index)=>{
      dataSource.value.push(
        {ckNum:ckNum.value+'-'+ckName.value,title:v.recordName,sysNum:v.sysNum,key:index+1,id:v.id,parentLevelNum:v.parentLevelNum,recordExplain:v.recordExplain,recordDefault:v.recordDefault=='0'?'':'是',recordFlag:v.recordFlag,
        parent1:parentData
        }
      )
    })
  }
  // 4级
  if(data.length===3){
    recordName.value=data[2].title
    columns.value.push(
      {
        title: '仓库信息',
        dataIndex: 'ckNum',
      },
      {
        title: '级别2',
        dataIndex: 'parent1',
      },
      {
        title: '级别3',
        dataIndex: 'parent2',
      },
      {
        title: '档案级次',
        dataIndex: 'parentLevelNum',
      },
      {
        title: '档案名称',
        dataIndex: 'title',
      },
      {
        title: '档案说明',
        dataIndex: 'recordExplain',
      },

      {
        title: '是否默认',
        dataIndex: 'recordDefault',
        width:80
      },
      {
        title: '状态',
        dataIndex: 'recordFlag',
        width:80,
        slots: { customRender: 'recordFlag' },
      }
    )
    let parentData=data[0].list.filter(v=>v.value===data[0].value)[0].name
    let parentData2=data[1].list.filter(v=>v.value===data[1].value)[0].name

    let parentId=data[1].value
    let item=await useRouteApi(findAllByCangkuIdAndCangkuLevelOrderAndParentId,{ schemaName: database })({cangkuId:ckId.value,levelOrder:data.length+1,parentId:parentId})
    item.forEach((v,index)=>{
      dataSource.value.push(
        {ckNum:ckNum.value+'-'+ckName.value,title:v.recordName,sysNum:v.sysNum,key:index+1,id:v.id,parentLevelNum:v.parentLevelNum,recordExplain:v.recordExplain,recordDefault:v.recordDefault=='0'?'':'是',recordFlag:v.recordFlag,
          parent1:parentData,parent2:parentData2
        }
      )
    })
  }
  // 5级
  if(data.length===4){
    recordName.value=data[3].title
    let parentData=data[0].list.filter(v=>v.value===data[0].value)[0].name
    let parentData2=data[1].list.filter(v=>v.value===data[1].value)[0].name
    let parentData3=data[2].list.filter(v=>v.value===data[2].value)[0].name
    columns.value.push(
      {
        title: '仓库信息',
        dataIndex: 'ckNum',
      },
      {
        title: '级别2',
        dataIndex: 'parent1',
      },
      {
        title: '级别3',
        dataIndex: 'parent2',
      },
      {
        title: '级别4',
        dataIndex: 'parent3',
      },
      {
        title: '档案级次',
        dataIndex: 'parentLevelNum',
      },
      {
        title: '档案名称',
        dataIndex: 'title',
      },
      {
        title: '档案说明',
        dataIndex: 'recordExplain',
      },

      {
        title: '是否默认',
        dataIndex: 'recordDefault',
        width:80
      },
      {
        title: '状态',
        dataIndex: 'recordFlag',
        width:80,
        slots: { customRender: 'recordFlag' },
      }
    )

    let parentId=data[2].value
    let item=await useRouteApi(findAllByCangkuIdAndCangkuLevelOrderAndParentId,{ schemaName: database })({cangkuId:ckId.value,levelOrder:data.length+1,parentId:parentId})
    item.forEach((v,index)=>{
      dataSource.value.push(
        {ckNum:ckNum.value+'-'+ckName.value,title:v.recordName,sysNum:v.sysNum,key:index+1,id:v.id,parentLevelNum:v.parentLevelNum,recordExplain:v.recordExplain,recordDefault:v.recordDefault=='0'?'':'是',recordFlag:v.recordFlag,
          parent1:parentData,parent2:parentData2,parent3:parentData3
        }
      )
    })
  }
  // 6级
  if(data.length===5){
    recordName.value=data[4].title
    let parentData=data[0].list.filter(v=>v.value===data[0].value)[0].name
    let parentData2=data[1].list.filter(v=>v.value===data[1].value)[0].name
    let parentData3=data[2].list.filter(v=>v.value===data[2].value)[0].name
    let parentData4=data[3].list.filter(v=>v.value===data[3].value)[0].name
    columns.value.push(
      {
        title: '仓库信息',
        dataIndex: 'ckNum',
      },
      {
        title: '级别2',
        dataIndex: 'parent1',
      },
      {
        title: '级别3',
        dataIndex: 'parent2',
      },
      {
        title: '级别4',
        dataIndex: 'parent3',
      },
      {
        title: '级别5',
        dataIndex: 'parent4',
      },
      {
        title: '档案级次',
        dataIndex: 'parentLevelNum',
      },
      {
        title: '档案名称',
        dataIndex: 'title',
      },
      {
        title: '档案说明',
        dataIndex: 'recordExplain',
      },

      {
        title: '是否默认',
        dataIndex: 'recordDefault',
        width:80
      },
      {
        title: '状态',
        dataIndex: 'recordFlag',
        width:80,
        slots: { customRender: 'recordFlag' },
      }
    )

    let parentId=data[3].value
    let item=await useRouteApi(findAllByCangkuIdAndCangkuLevelOrderAndParentId,{ schemaName: database })({cangkuId:ckId.value,levelOrder:data.length+1,parentId:parentId})
    item.forEach((v,index)=>{
      dataSource.value.push(
        {ckNum:ckNum.value+'-'+ckName.value,title:v.recordName,sysNum:v.sysNum,key:index+1,id:v.id,parentLevelNum:v.parentLevelNum,recordExplain:v.recordExplain,recordDefault:v.recordDefault=='0'?'':'是',recordFlag:v.recordFlag,
          parent1:parentData,parent2:parentData2,parent3:parentData3,parent4:parentData4
        }
      )
    })
  }
}

async function dynamicAdReload(data) {
  await findDataBase(data.accId,data.year).then(async (item)=>{
    accIyear.value=item.accountYear
    accId.value=item.accountId
    database.value =item.accountMode

    columns.value=[]
    dataSource.value=[]
    selectedRowKeys.value=[]
    selectedRowData.value=[]
    loadPage(tableData.value)
  })
}
function createConfirmPop(text) {
  createConfirm({
    iconType: 'warning',
    title: '警告',
    content: text,
    onOk: async () => {}
  })
}
function rowSelection(a,b) {
  selectedRowKeys.value=a
  selectedRowData.value=b
}
async function startflag(flag) {
  if(selectedRowData.value.length==0){
    return createConfirmPop('至少选择一项');
  }
  let map={
    flag:flag,
    id:selectedRowData.value.map(v=>v.id).join(',')
  }
  await useRouteApi(editRecordByflag,{ schemaName: database })(map)
  columns.value=[]
  dataSource.value=[]
  selectedRowKeys.value=[]
  selectedRowData.value=[]
  loadPage(tableData.value)
}
async function setdefault() {
  if(selectedRowData.value.length==0){
    return createConfirmPop('只能选择一项');
  }

 let defaults= dataSource.value.filter(v=>v.recordDefault==='是')
  if(defaults.length>0){
    // 将已是默认修改成否
    await useRouteApi(editBydefaultflag,{ schemaName: database })({flag:'0',id:defaults[0].id})
  }
  // 新的ID改成默认
  await useRouteApi(editBydefaultflag,{ schemaName: database })({flag:'1',id:selectedRowData.value[0].id})
  columns.value=[]
  dataSource.value=[]
  selectedRowKeys.value=[]
  selectedRowData.value=[]
  loadPage(tableData.value)
}
function addRecord() {
  if(selectedRowData.value.length!==1){
    return createConfirmPop('只能选择一条进行添加!')
  }
  visibleModel.value=true
  textareaText.value=selectedRowData.value[0].recordExplain
}

async function modelOk() {
  await useRouteApi(editByExpalin,{ schemaName: database })({explain:textareaText.value,id:selectedRowData.value[0].id})
  visibleModel.value=false
  columns.value=[]
  dataSource.value=[]
  selectedRowKeys.value=[]
  selectedRowData.value=[]
  loadPage(tableData.value)
}

function add() {
  visibleModel2.value=true
}
async function modelOk2() {
  let last=parseInt(dataSource.value[dataSource.value.length-1].sysNum)
  // 过滤最后一条
  let item=await useRouteApi(findAllByCangkuIdAndCangkuLevelOrder,{ schemaName: database })({cangkuId:ckId.value,levelOrder:tableData.value.length+1})
  let lastItem=item[item.length-1]
  let list:any=[]
  for (let i = 0; i < visibleValue.value; i++) {
    last+=1
    list.push({
      accId: lastItem.accId,
      cangkuId: lastItem.cangkuId,
      cangkuLevelId: lastItem.cangkuLevelId,
      cangkuLevelOrder: lastItem.cangkuLevelOrder,
      sysNum: last,
      recordName: recordName.value+(parseInt(lastItem.sysNum)+i+1),
      recordDefault: '0',
      recordFlag: '1',
      parentId: lastItem.parentId,
      parentLevelNum: lastItem.parentLevelNum+'-'+last,
    });
  }
  await useRouteApi(saveRecord, { schemaName: database })(unref(list))
  visibleModel2.value=false
  columns.value=[]
  dataSource.value=[]
  selectedRowKeys.value=[]
  selectedRowData.value=[]
  loadPage(tableData.value)
}
</script>
<style src="./global-menu-index.less" lang="less" scoped></style>
<style scoped>
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
textarea {
  font-size: .8rem;
  letter-spacing: 1px;
}
textarea {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  box-shadow: 1px 1px 1px #999;
  margin-left: 10px;
  width: 96%;
}
.app-container:nth-of-type(1) {
  background-color: #f2f2f2;
  padding: 10px 5px;
  margin: 10px 10px 5px;
  height: 100px;
}
.app-container:nth-of-type(2) {
  padding: 0px;
  margin: 5px 10px;
  background: #b4c8e3 !important;
}

:deep(.ant-checkbox) {
  border: 1px solid #2f2a2a;
  border-radius: 4px;
}

.a-table-font-size-12 :deep(td),
.a-table-font-size-12 :deep(th) {
  font-size: 14px !important;
  padding: 2px 8px !important;
}
</style>
