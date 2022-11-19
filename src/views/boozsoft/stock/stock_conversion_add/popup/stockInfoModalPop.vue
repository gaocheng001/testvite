<template>
  <BasicModal
    width="900px"
    :minHeight="500"
    :height="500"
    v-bind="$attrs"
    :closable="false"
    title="选择科目"
    @ok="handleOk()"
    @register="register"
  >
    <template #title>
      <div style="display: flex;" class="vben-basic-title">
        <span style="line-height: 25px;font-size: 20px;">
          <SearchOutlined style="width:25px;margin-right: 10px;"/>
          选择存货档案
        </span>
      </div>
    </template>
    <div style="background-color: #158eb8;height: 50px;padding-top: 10px;padding-left:10px;border-radius: 5px;">
      <a-select style="width: 100px;" v-model:value="pageParameter.searchConditon.requirement">
        <a-select-option value="stockNum">存货编码</a-select-option>
        <a-select-option value="stockName">存货名称</a-select-option>
        <a-select-option value="stockBarcode">条形码</a-select-option>
        <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
      </a-select>
      <a-input-search placeholder="" v-model:value="pageParameter.searchConditon.value" style="width: 200px; border-radius: 4px" @search="findByStockByEnterTime()"/>
      <div style="float: right;margin-right: 5px;">
        <a-radio-group v-model:value="multipleFlag" @change="selectedRowKeys=[],selectedRowData=[]">
          <a-radio :value="false">
            单选
          </a-radio>
          <a-radio :value="true">
            多选
          </a-radio>
        </a-radio-group>
      </div>
    </div>

    <div style="width: calc(100% - 25px); float: left;margin-top: 5px;">
      <BasicTable @register="registerTable" :dataSource="tableData" :row-selection="{ type: multipleFlag?'checkbox':'radio',selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" @row-dbClick="rowDbClick" :class="'a-table-font-size-12'">
        <template #stockNum="{ record }">
          {{record.stockNum}}
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
  Statistic as AStatistic,
} from 'ant-design-vue';
import {useMessage} from "/@/hooks/web/useMessage";
import {reactive, ref} from "vue";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {GetStockClassTree} from "/@/api/record/stock/stock_class";
import {findAllByXcl} from "/@/api/record/stock/stock";
import {findCangkuJoinName} from "/@/api/record/stock/stock-cangku-level-record";
import {hasBlank} from "/@/api/task-api/tast-bus-api";

const ASelectOption = ASelect.Option;
const AInputSearch = AInput.Search;
const AStatisticCountdown = AStatistic.Countdown;
const AFormItem = AForm.Item;
const ARadioGroup = ARadio.Group
const { createConfirm,createWarningModal,createMessage } = useMessage();
const emit=defineEmits(['register','throwData']);
const database:any = ref('');
const tableData:any = ref([]);
const treeData:any = ref([]);
const loading:any = ref(true);
const loadMark = ref(false);
const selectedKeys2:any = ref([]);
const selectedRowKeys:any = ref([]);
const selectedRowData:any = ref([]);
// 单选\多选
const multipleFlag:any = ref(false);
const stockClassId: any = ref([]);

const CrudApi = {
  columns: [
    {
      title: '存货编码',
      dataIndex: 'stockNum',
      ellipsis: true,
      slots: { customRender: 'stockNum' },
    },
    {
      title: '存货名称',
      dataIndex: 'stockName',
      ellipsis: true,
      slots: { customRender: 'stockName' },
    },
    {
      title: '规格型号',
      dataIndex: 'stockGgxh',
      ellipsis: true,
    },
    {
      title: '批号',
      dataIndex: 'batchId',
      ellipsis: true,
      slots: { customRender: 'batchId' },
    },
    {
      title: '生效日期',
      dataIndex: 'dpdate',
      ellipsis: true,
      slots: { customRender: 'dpdate' },
    },
    {
      title: '失效日期',
      dataIndex: 'dvdate',
      ellipsis: true,
      slots: { customRender: 'dvdate' },
    },
    {
      title: '显存量',
        dataIndex: 'xcl',
      ellipsis: true,
      slots: { customRender: 'xcl' },
    },
    {
      title: '单价',
      dataIndex: 'price',
      ellipsis: true,
      slots: { customRender: 'price' },
    },
    {
      title: '计量方式',
      dataIndex: 'stockMeasurementType',
      ellipsis: true,
      align: 'left',
    },
    {
      title: '计量单位',
      dataIndex: 'stockMeasurementName',
      ellipsis: true,
      align: 'left',
    },
  ],
};
const pageParameter = reactive({
  stockFlag:'1',
  stockClass:'',
  iyear:'2022',
  cwhcode:'2022',
  cangku:'',
  searchConditon: {
    requirement: 'stockName',
    value: '',
  },
})
const dynamicTenant:any = ref(null)

const [registerSavePage, { openModal: openSavePage }] = useModal();
// 这是示例组件 虫哥
const [registerTable, { reload,getSelectRows,getDataSource,setTableData }] = useTable({
  // api:useRouteApi(CrudApi.list,{schemaName: database}),
  columns: CrudApi.columns,
  loading: loadMark.value,
  pagination:{ pageSize: 50,showSizeChanger: true, pageSizeOptions: ['50','100'],showTotal: t => `总共${t}条数据` },
  searchInfo: pageParameter
});
const [register, { closeModal }] = useModalInner( async (data) => {
  stockClassId.value=data.stockClassId
  selectedRowKeys.value=[]
  selectedRowData.value=[]
  database.value=data.database
  if (data.many != null)multipleFlag.value = true
  if(!hasBlank(stockClassId.value)){
    fetch2()
  }else{
    fetch()
  }
  pageParameter.cwhcode = data.cangku
  pageParameter.cangku = data.cangku
  pageParameter.rkBcheck = data.rkBcheck
  pageParameter.ckBcheck = data.ckBcheck
  setTimeout(() => {
    findByStockByEnterTime()
  }, 500);
});
function onSelectChange(a,b) {
  if(a.length>0){
    selectedRowKeys.value=a
    selectedRowData.value=b
  }
}
function rowDbClick(data) {
  selectedRowData.value=[data]
  handleOk()
}

async function findByStockByEnterTime() {
  await useRouteApi(findAllByXcl,{schemaName: database})(pageParameter)
  .then(async (data)=>{
    data.forEach(async (a)=>{
      if(a.stockCangkuDuli=='0' && a.stockCangku!==''){
        let cangkuJoinName=await useRouteApi(findCangkuJoinName,{schemaName: database})(  {id:a.stockCangku})
        a.stockCangkuName=cangkuJoinName[0].cangkuRecordJoinName
      }
    })
    setTimeout(()=>{
      tableData.value=data
    },500)
  })
}
async function fetch() {
  let deptTree = await useRouteApi(GetStockClassTree,{schemaName: database})('')
  deptTree=deptTree.length==0?[]:deptTree.filter(aa=>aa.flag=='1')
  function a(customerTree) {
    customerTree.forEach((item) => {
      if (item.children != null) {
        a(item.children);
      }
      item.title = '[' + item.stockClass + '] ' + item.stockCclassName;
      item.key = item.uniqueStockclass;
    });
  }
  a(deptTree);
  treeData.value = []
  treeData.value.push({title: '全部',key:'0',children: deptTree})
  selectedKeys2.value='0'
}

async function fetch2() {
  let deptTree = await useRouteApi(GetStockClassTree,{schemaName: database})('')
  deptTree=deptTree.length==0?[]:deptTree.filter(aa=>aa.flag=='1')

  if(!hasBlank(stockClassId.value)){
    let templist=[]
    stockClassId.value.forEach(a=>{
      let temp=deptTree.filter(aa=>aa.key==a)
      templist.push(temp[0])
    })
    deptTree=templist
  }
  function a(customerTree) {
    customerTree.forEach((item) => {
      if (item.children != null) {
        a(item.children);
      }
      item.title = '[' + item.stockClass + '] ' + item.stockCclassName;
      item.key = item.uniqueStockclass;
    });
  }
  a(deptTree);
  treeData.value = []
  treeData.value=deptTree
  selectedKeys2.value=deptTree[0].uniqueStockclass
  pageParameter.stockClass=deptTree[0].uniqueStockclass
}
// 存货分类
function handleSelect(val) {
  if(val.length==0){
    val=['0']
  }
  selectedKeys2.value=val
  pageParameter.stockClass=val[0]
  findByStockByEnterTime()
}

async function handleOk() {
  if(selectedRowData.value.length==0){
    return createWarningModal({ content: '至少选择一条数据' });
  }
  emit('throwData', selectedRowData.value);
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
