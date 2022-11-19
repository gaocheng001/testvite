<template>
  <BasicModal
    width="900px"
    :minHeight="500"
    :height="500"
    :closable="false"
    v-bind="$attrs"
    @ok="handleOk()"
    @register="register"
  >
    <template #title>
      <div style="display: flex;" class="vben-basic-title">
        <span style="line-height: 25px;font-size: 20px;">
          <SearchOutlined style="width:25px;margin-right: 10px;"/>
          选择仓库信息
        </span>
      </div>
    </template>
    <div style="background-color: #158eb8;height: 50px;padding-top: 10px;padding-left:10px;border-radius: 5px;">
<!--      <span v-if="cangkuFlag=='1'">-->
<!--        <a-select style="width: 100px;" v-model:value="pageParameter.searchConditon.requirement">-->
<!--          <a-select-option value="ckNum">仓库编码</a-select-option>-->
<!--          <a-select-option value="ckName">仓库名称</a-select-option>-->
<!--          <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>-->
<!--        </a-select>-->
<!--        <a-input-search placeholder="" v-model:value="pageParameter.searchConditon.value" style="width: 200px; border-radius: 4px" @search="findByStockByEnterTime()"/>-->
<!--      </span>-->
<!--      <div style="float: right;margin-right: 5px;">-->
<!--        <a-radio-group v-model:value="cangkuFlag" @change="cangkuChange">-->
<!--          <a-radio value="1">-->
<!--            独立仓库-->
<!--          </a-radio>-->
<!--          <a-radio value="0">-->
<!--            级别仓库-->
<!--          </a-radio>-->
<!--        </a-radio-group>-->
<!--      </div>-->
    </div>
<!--    <div class="bg-white" style="display: inline;width: 30%;float: left;margin-top: 5px;">-->
<!--      <div style="width: 100%; height: 26px;text-align: center;background-color: rgb(216 216 216);">-->
<!--        <label style="font-size: 14px;font-weight: bold;">仓库级别</label>-->
<!--      </div>-->
<!--      <BasicTree-->
<!--        defaultExpandAll-->
<!--        :click-row-to-expand="false"-->
<!--        :tree-data="treeData"-->
<!--        v-model:selectedKeys="selectedKeys2"-->
<!--        @select="handleSelect"-->
<!--      />-->
<!--    </div>-->
    <div style="width: 100%; float: right;margin-top: 5px;">
      <BasicTable @register="registerTable" :scroll="{ y:400 }" :dataSource="tableData" :row-selection="{ type: 'radio',selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" @row-dbClick="rowDbClick" :class="'a-table-font-size-12'">
        <template #ckFlag="{ record }">
          <a-tag :color="record.ckFlag === '1' ? 'green' : 'volcano'">
            {{ record.ckFlag === '1' ? '启用' : '停用' }}
          </a-tag>
        </template>
        <template #ckIsDuli="{ record }">
          {{ record.ckIsDuli === '1' ? '独立仓库' : '库位仓库' }}
        </template>
        <template #ckType="{ record }">
          {{ record.ckType === '1' ? '自有仓库' : '供应商直发库' }}
        </template>
      </BasicTable>
    </div>
  </BasicModal>
</template>
<script setup="props, { content }" lang="ts">
import {BasicTable, useTable} from '/@/components/Table';
import {BasicTree} from '/@/components/Tree';
import {SearchOutlined,CaretDownOutlined} from '@ant-design/icons-vue'
import {BasicModal, useModal, useModalInner} from '/@/components/Modal';
import {
  Form as AForm,
  Input as AInput,
  Radio as ARadio,
  Select as ASelect,
  Tag as ATag,
  Statistic as AStatistic,
} from 'ant-design-vue';
import {useMessage} from "/@/hooks/web/useMessage";
import {reactive, ref} from "vue";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {findByAll, findByCkIsDuli, findByCkNoIsDuliTree} from "/@/api/record/stock/stock-cangku";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {findByIdLevel, findByIdLevelPojo} from "/@/api/record/stock/stock-cangku-level";
import {
  findAllByCangkuIdAndCangkuLevelIdAndCangkuLevelOrder, findAllByRecordBend,
  findByStockRecordId, findCangkuJoinName
} from "/@/api/record/stock/stock-cangku-level-record";


const ASelectOption = ASelect.Option;
const AInputSearch = AInput.Search;
const AStatisticCountdown = AStatistic.Countdown;
const AFormItem = AForm.Item;
const ARadioGroup = ARadio.Group
const { createConfirm,createWarningModal,createMessage } = useMessage();
const emit=defineEmits(['register']);
const database:any = ref('');
const tableData:any = ref([]);
const treeData:any = ref([{title: '独立仓库',key:'1',data:{},type:'duli',children: []}]);
const loading:any = ref(true);
const loadMark = ref(false);
const cangkuFlag = ref('1');
const selectedKeys2:any = ref(['1']);
const selectedRowKeys:any = ref([]);
const selectedRowData:any = ref([]);


const CrudApi = {
  list: findByAll,
  columns: [
  {
    title: '仓库编码',
    dataIndex: 'ckNum',
    ellipsis: true,
    fixed: 'left',
  },
  {
    title: '仓库名称',
    dataIndex: 'ckName',
    ellipsis: true,
    fixed: 'left',
  },
  {
    title: '仓库级别',
    dataIndex: 'ckIsDuli',
    slots: { customRender: 'ckIsDuli' },
  },
  {
    title: '管理属性',
    dataIndex: 'ckType',
    slots: { customRender: 'ckType' },
  },
  {
    title: '所在城市',
    width: 100,
    dataIndex: 'ckCity',
  },
  {
    title: '仓库注释',
    width: 100,
    dataIndex: 'ckRemark',
  }]
};
const pageParameter = reactive({
  showRulesSize: 'MIN',
  companyCode: '',
  companyName: '',
  ifUnit: false,
  total: 0,
  thisAdInfo: {},
  thisLeftKey: '',
  flag: '1',
  database: database.value,
  username: useUserStoreWidthOut().getUserInfo.username,
  uniqueCustclass: '',
  searchConditon: {
    requirement: 'ckNum',
    value: '',
  },
  ckIsDuli:''
});

const [registerSavePage, { openModal: openSavePage }] = useModal();
// 这是示例组件
const [registerTable, { reload,getSelectRows,getDataSource,setTableData,setColumns }] = useTable({
  // api:useRouteApi(CrudApi.list,{schemaName: database}),
  columns: CrudApi.columns,
  loading: loadMark.value,
  pagination:{ pageSize: 30,showSizeChanger: true, pageSizeOptions: ['50','100'],showTotal: t => `总共${t}条数据` },
  searchInfo: pageParameter
});
const theData = ref(null)
const [register, { closeModal }] = useModalInner( async (data) => {
  tableData.value=[]
  theData.value = data
  database.value=data.database
  setColumns(CrudApi.columns)
  treeData.value=[{title: '独立仓库',key:'1',value:{},type:'duli',children: []}]
  selectedRowKeys.value=['1']
  cangkuFlag.value='1'
  if (data.ckIsDuli != null){
    cangkuFlag.value = data.ckIsDuli
    cangkuChange({target:{value:cangkuFlag.value}})
  }
  findByStockByEnterTime()
});

async function cangkuChange(val) {
  treeData.value=[]
  tableData.value=[]
  selectedKeys2.value=['1']
  setColumns(CrudApi.columns)
  findByStockByEnterTime()
}

// 查询独立仓库
async function findByStockByEnterTime() {
  await useRouteApi(findByAll,{schemaName: database})(pageParameter)
  .then(data=>{
    tableData.value=data.items
  })
}
// 仓库
async function handleSelect(a,b) {
  if(a.length>0 && cangkuFlag.value=='0'){
    selectedKeys2.value=a
    findByStockCangKuLevel(b.node.value)
  }
}
// 查询仓库级别
async function findByStockCangKuLevel(data) {
  tableData.value=[]
  let cangkuLevelOrder=parseInt(data.cangkuLevelOrder)+1
  // 查询仓库级别档案
  let cangkuRecord= await useRouteApi(findAllByRecordBend,{schemaName: database})(  {cangkuId:data.cangkuId,parentId:data.parentId})
  // 2级
  if(cangkuLevelOrder==2){
    setColumns([
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
    ])
    if(cangkuRecord.length>0){
      cangkuRecord.forEach((v,index)=>{
        tableData.value.push(
          {ckNum:data.ckNum+'-'+data.ckName,title:v.recordName,sysNum:v.sysNum,key:index+1,id:v.id,parentLevelNum:v.parentLevelNum,
            recordExplain:v.recordExplain,recordDefault:v.recordDefault=='0'?'':'是'}
        )
      })
      setTableData(tableData.value)
    }
  }
  // 3级
  if(cangkuLevelOrder==3){
    let cangkuRecordParentId=Array.from(new Set(cangkuRecord.map(a=>a.parentId)))
    // 获取上级仓库级别档案
    let cangkuRecordParentData1=await useRouteApi(findByStockRecordId,{schemaName: database})(cangkuRecordParentId[0])
    setColumns([
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
      ])
    if(cangkuRecord.length>0){
      cangkuRecord.forEach((v,index)=>{
        tableData.value.push(
          {ckNum:data.cangkuNum+'-'+data.cangkuName,title:v.recordName,sysNum:v.sysNum,key:index+1,id:v.id,parentLevelNum:v.parentLevelNum,
            recordExplain:v.recordExplain,recordDefault:v.recordDefault=='0'?'':'是',parent1:cangkuRecordParentData1.recordName}
        )
      })
      setTableData(tableData.value)
    }
  }
  // 4级
  if(cangkuLevelOrder==4){
    let cangkuRecordParentId=Array.from(new Set(cangkuRecord.map(a=>a.parentId)))
    // 获取上级仓库级别档案
    let cangkuRecordParentData1=await useRouteApi(findByStockRecordId,{schemaName: database})(cangkuRecordParentId[0])
    let cangkuRecordParentData2=await useRouteApi(findByStockRecordId,{schemaName: database})(cangkuRecordParentData1.parentId)
    setColumns([
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
      ])
    if(cangkuRecord.length>0){
      cangkuRecord.forEach((v,index)=>{
        tableData.value.push(
          {ckNum:data.cangkuNum+'-'+data.cangkuName,title:v.recordName,sysNum:v.sysNum,key:index+1,id:v.id,parentLevelNum:v.parentLevelNum,
            recordExplain:v.recordExplain,recordDefault:v.recordDefault=='0'?'':'是',
            parent1:cangkuRecordParentData1.recordName,parent2:cangkuRecordParentData2.recordName}
        )
      })
      setTableData(tableData.value)
    }
  }
  // 5级
  if(cangkuLevelOrder==5){
    let cangkuRecordParentId=Array.from(new Set(cangkuRecord.map(a=>a.parentId)))
    // 获取上级仓库级别档案
    let cangkuRecordParentData1=await useRouteApi(findByStockRecordId,{schemaName: database})(cangkuRecordParentId[0])
    let cangkuRecordParentData2=await useRouteApi(findByStockRecordId,{schemaName: database})(cangkuRecordParentData1.parentId)
    let cangkuRecordParentData3=await useRouteApi(findByStockRecordId,{schemaName: database})(cangkuRecordParentData2.parentId)

    setColumns([
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
      }])
    if(cangkuRecord.length>0){
      cangkuRecord.forEach((v,index)=>{
        tableData.value.push(
          {ckNum:data.cangkuNum+'-'+data.cangkuName,title:v.recordName,sysNum:v.sysNum,key:index+1,id:v.id,parentLevelNum:v.parentLevelNum,
            recordExplain:v.recordExplain,recordDefault:v.recordDefault=='0'?'':'是',
            parent1:cangkuRecordParentData1.recordName,parent2:cangkuRecordParentData2.recordName,parent3:cangkuRecordParentData3.recordName}
        )
      })
      setTableData(tableData.value)
    }
  }
  // 6级
  if(cangkuLevelOrder==6){
    let cangkuRecordParentId=Array.from(new Set(cangkuRecord.map(a=>a.parentId)))
    // 获取上级仓库级别档案
    let cangkuRecordParentData1=await useRouteApi(findByStockRecordId,{schemaName: database})(cangkuRecordParentId[0])
    let cangkuRecordParentData2=await useRouteApi(findByStockRecordId,{schemaName: database})(cangkuRecordParentData1.parentId)
    let cangkuRecordParentData3=await useRouteApi(findByStockRecordId,{schemaName: database})(cangkuRecordParentData2.parentId)
    let cangkuRecordParentData4=await useRouteApi(findByStockRecordId,{schemaName: database})(cangkuRecordParentData3.parentId)

    setColumns([
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
      }])
    if(cangkuRecord.length>0){
      cangkuRecord.forEach((v,index)=>{
        tableData.value.push(
          {ckNum:data.cangkuNum+'-'+data.cangkuName,title:v.recordName,sysNum:v.sysNum,key:index+1,id:v.id,parentLevelNum:v.parentLevelNum,
            recordExplain:v.recordExplain,recordDefault:v.recordDefault=='0'?'':'是',
            parent1:cangkuRecordParentData1.recordName,parent2:cangkuRecordParentData2.recordName,parent3:cangkuRecordParentData3.recordName,parent4:cangkuRecordParentData4.recordName}
        )
      })
      setTableData(tableData.value)
    }
  }
}

function onSelectChange(a,b) {
  if(a.length>0){
    selectedRowKeys.value=a
    selectedRowData.value=b
  }
}
function rowDbClick(data) {
  handleOk()
}
async function handleOk() {
  if(selectedRowData.value.length==0){
    return createWarningModal({ content: '请选择数据！' });
  }
  let cangkuName=selectedRowData.value[0].ckName+','
  let map:any=[]
  // 独立仓库
  if(cangkuFlag.value=='1'){
    map.push({
      id:selectedRowData.value[0].id,
      value:selectedRowData.value[0].ckName,
      num:selectedRowData.value[0].ckNum,
      cangkuFlag:cangkuFlag.value,
      cangkuName:cangkuName.substring(0,cangkuName.length-1),
      cangkuId:selectedRowData.value[0].id,
      nameJoinId:selectedRowData.value[0].id+'&&'+cangkuName.substring(0,cangkuName.length-1)
    })
  }else{
    let cangkuJoinName=await useRouteApi(findCangkuJoinName,{schemaName: database})(  {id:selectedRowData.value[0].id})
    map.push({
      id:selectedRowData.value[0].id,
      value:selectedRowData.value[0].title,
      num:selectedRowData.value[0].sysNum,
      cangkuFlag:cangkuFlag.value,
      cangkuName:cangkuJoinName[0].cangkuRecordJoinName,
      cangkuId:cangkuJoinName[0].cangkuRecordJoinId,
      nameJoinId:selectedRowData.value[0].id+'&&'+cangkuJoinName[0].cangkuRecordJoinName
    })
  }
  emit('throwData', map,cangkuFlag.value);
  closeModal();
}


//js切割字符串
function setString(str, len) {
  var strlen = 0;
  var s = '';
  for (var i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 128) {
      strlen += 2;
    } else {
      strlen += 1.2;
    }
    s += str.charAt(i);
    if (strlen >= len) {
      return s + '...';
    }
  }
  return s;
}
</script>
<style>
.ant-modal-title{
  margin-top: -10px;
}
.ant-modal-header{
  height: 10px;
}
.scrollbar__view{
  overflow-y: hidden;
}
.vben-basic-title {
  color: rgb(1, 129, 226) !important;
}

.ant-modal-body {
  padding: 0px;
  border: 1px solid rgb(1, 129, 226);
  border-left: none;
  border-right: none;
}

.scroll-container .scrollbar__wrap {
  margin-bottom: -5px !important;
}
</style>
<style lang="less" scoped>
:deep(.ant-table-thead th) {
  background-color: #d8d8d8 !important;
  font-weight: bold !important;
  border-left: 1px solid #d8d8d8 !important;
  border-bottom: 1px solid #d8d8d8 !important;
  border-top: 1px solid #d8d8d8 !important;
}
.bg-white{
  width: 220px ;
  min-height: 462px ;
  height: calc(100% - 462px);
  border: 1px #cccccc solid;
  background:white ;
}
.a-table-font-size-12 :deep(td),
.a-table-font-size-12 :deep(th) {
  font-size: 14px !important;
  padding: 2px 8px !important;
}
:deep(.ant-tree .ant-tree-node-content-wrapper.ant-tree-node-selected),
:deep(.ant-table-tbody > tr.ant-table-row-selected > td){
  background-color: #1488b1;
  color: white;
}
</style>
