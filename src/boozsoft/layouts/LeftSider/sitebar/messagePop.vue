<template>
  <BasicModal
    width="900px"
    :minHeight="500"
    :height="500"
    v-bind="$attrs"
    title="消息"
    @ok="handleOk()"
    @cancel="handleOk()"
    @register="register"
  >
    <template #title>
      <div style="display: flex;" class="vben-basic-title">
        <span style="line-height: 25px;font-size: 20px;">
          <MessageTwoTone style="width:25px;margin-right: 10px;"/>
          消息
        </span>
      </div>
    </template>
    <div style="background-color: #158eb8;height: 50px;padding-top: 10px;padding-left:10px;border-radius: 5px;">
      <a-select style="width: 120px;" v-model:value="pageParameter.searchConditon.requirement">
        <a-select-option value="sender">发送人</a-select-option>
        <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
      </a-select>
      <a-input-search placeholder="" v-model:value="pageParameter.selectValue" style="width: 200px; border-radius: 4px" @search="query()"/>
      <div style="float: right;margin-right: 5px;">
        <button type="button" class="ant-btn ant-btn-me" @click="openQueryPage()"><span>发送</span></button>
        <button type="button" class="ant-btn ant-btn-me" @click="read()"><span>查阅</span></button>
        <button type="button" class="ant-btn ant-btn-me" @click="notShow()"><span>隐藏</span></button>
<!--        <button type="button" class="ant-btn ant-btn-me" @click="del(record.messageId)"><span>撤销</span></button>-->
        <button type="button" class="ant-btn ant-btn-me" @click="query"><span>刷新</span></button>
      </div>
    </div>
    <div class="bg-white" style="display: inline;width: 25%;float: left;margin-top: 5px;">
      <Tabs type="card" size="small" :tabBarGutter="0" v-model:activeKey="pageParameter.lb" @change="changeTab">
        <TabPane key="1" tab="接收消息" :style="pageParameter.lb=='2'?{height: (windowHeight-285)+'px'}:{}">
          <BasicTree
            title=""
            :click-row-to-expand="false"
            :autoExpandParent="true"
            :tree-data="treeDatas"
            :replace-fields="{ key: 'id', title: 'typeName' }"
            v-model:selectedKeys="selectedKeys"
            v-model:expandedKeys="expandedKeys"
            @select="handleSelect"
          />
        </TabPane>
        <TabPane key="2" tab="发送消息" :style="pageParameter.lb=='1'?{height: (windowHeight-285)+'px'}:{}">
          <BasicTree
            title=""
            :click-row-to-expand="false"
            :autoExpandParent="true"
            :tree-data="treeDatas"
            :replace-fields="{ key: 'id', title: 'typeName' }"
            v-model:selectedKeys="selectedKeys"
            v-model:expandedKeys="expandedKeys"
            @select="handleSelect"
          />
        </TabPane>
      </Tabs>
    </div>
    <div style="display: inline;width: 75%;float: right;margin-top: 5px;">
      <BasicTable @register="registerTable" :scroll="{ y: 400 }"
                  :class="'a-table-font-size-12'"
                  :row-selection="{ type: 'checkbox', selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
                  @row-dbClick="rowDbClick">
        <template #number="{record,index }">
        <span slot="number" slot-scope="text,record,index">
         {{index+1}}
        </span>
        </template>

        <template #ifrag="{record,index }">
          <a-tag color="success" v-if="record.ifrag === '1'" slot="ifrag" @click="look(record)" slot-scope="text,record,index">
            {{formatIfrag(record.ifrag)}}
          </a-tag>
          <a-tag color="processing" v-else-if="record.ifrag === '0'"  @click="look(record)" slot="ifrag"  slot-scope="text,record,index">
            {{formatIfrag(record.ifrag)}}
          </a-tag>
          <a-tag color="warning" v-else-if="record.ifrag === '2'"  @click="look(record)" slot="ifrag" slot-scope="text,record,index">
            {{formatIfrag(record.ifrag)}}
          </a-tag>
          <a-tag color="success" v-else="record.ifrag != '-1'"  @click="look(record)" slot="ifrag" slot-scope="text,record,index">
            已发送
          </a-tag>
        </template>


        <template #sendTime="{record,index }">
        <span slot="sendTime" slot-scope="text,record,index">
            {{formatTime(record.sendTime)}}
        </span>
        </template>

        <template #weights="{record,index }">
          <a-tag v-if="record.weights === '1'" color="red">重要紧急</a-tag>
          <a-tag v-if="record.weights === '2'" color="orange">重要不紧急</a-tag>
          <a-tag v-if="record.weights === '3'" color="blue">紧急不重要</a-tag>
          <a-tag v-if="record.weights === '4'" color="green">一般</a-tag>
        </template>

      </BasicTable>
    </div>

    <template #footer>
      <a-button @click="handleOk()" type="primary">关闭</a-button>
    </template>

    <Query @save="loadPage" @register="registerQueryPage"/>
    <Look @register="registerLookPage"/>
  </BasicModal>
</template>
<script setup="props, { content }" lang="ts">
import Query from "./popup/add.vue";
import Look from "./popup/look.vue";
import {BasicTable, useTable} from '/@/components/Table';
import { BasicTree } from '/@/components/Tree';
import { SearchOutlined,CaretDownOutlined,DeleteOutlined,MessageTwoTone  } from '@ant-design/icons-vue';
import { onMounted, reactive, ref, toRaw, unref } from 'vue';
import {BasicModal, useModal, useModalInner} from '/@/components/Modal';
import {
  Select as ASelect,
  Form as AForm,
  Input as AInput,
  Statistic as AStatistic, message, Tabs,Tag as ATag
} from 'ant-design-vue';
import {getCurrentAccountName} from "/@/api/task-api/tast-bus-api";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useMessage} from "/@/hooks/web/useMessage";
import {findAllByAccCountPartColumn} from "/@/api/record/system/account";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {
  deleteList,
  reductionList,
} from '/@/api/record/group/dept-class'

import { findAll,hide,goread,chexiao,getTypeList } from "/@/api/record/message/data";

import {columnProps} from "ant-design-vue/es/table/interface";
import {aoaToSheetXlsx} from "/@/components/Excel";
import moment from "moment";
import {deleteDept} from "/@/api/record/system/zf-class";
const ASelectOption = ASelect.Option;
const AInputSearch = AInput.Search;
const TabPane = Tabs.TabPane
const AStatisticCountdown = AStatistic.Countdown;
const AFormItem = AForm.Item;
const { createErrorModal } = useMessage()
const emit=defineEmits(['register']);
const database = ref(getCurrentAccountName(true));
const accId = ref('');
const loading = ref(true);
const treeData:any = ref([]);
const selectedKeys:any = ref([]);
const expandedKeys:any = ref([]);
const dataSource:any = ref([]);

const CrudApi = {
  list: [],
  columns: [
    {
      title: '状态',
      dataIndex: 'ifrag',
      key: 'ifrag',
      align: 'center',
      width: '80px',
      slots: { customRender: 'ifrag' },
    },
    {
      title: '发送人',
      dataIndex: 'username',
      key: 'username',
      width: '100px',
      align: 'center',
      slots: { customRender: 'username' },
    },
    {
      title: '消息内容',
      dataIndex: 'content',
      key: 'content',
      align: 'left',
      width: '220px',
      slots: { customRender: 'content' },
    },
    {
      title: '发送时间',
      dataIndex: 'sendTime',
      key: 'sendTime',
      width: '100px',
      align: 'center',
      slots: { customRender: 'sendTime' },
    },
    {
      title: '优先级',
      dataIndex: 'weights',
      key: 'weights',
      width: '80px',
      align: 'center',
      slots: { customRender: 'weights' },
    },
    {
      title: '消息类型',
      dataIndex: 'typename',
      key: 'typename',
      width: '80px',
      align: 'center',
      slots: { customRender: 'typename' },
    },
  ],
  editData: {
    id: '',
    flag: '',
    unitCode: '',
    unitName: '',
    typename: '',
    isMain: '',
    conversionType: '',
    conversionRate: '',
  }
}

const selectedRowKeys:any = ref([]);
const selectedRowData:any = ref({});
const styleList:any = ref([]);

//选中内容
type Key = columnProps['id'];

const state = reactive<{
  selectedRowKeys: Key[];
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

const loadPage = (data) => {
  reload()
};

const pageParameter = reactive({
  ifrag: '-1',
  user:  useUserStoreWidthOut().getUserInfo.id,
  lb: '1',
  type: '0',
  showRulesSize: 'MIN',
  companyCode: '',
  companyName: '',
  ifUnit: false,
  total: 0,
  thisLeftKey: '',
  flag:'1',
  username: useUserStoreWidthOut().getUserInfo.username,
  selectValue:'',
  typeCode:'',
  searchConditon: {
    requirement: 'sender',
    value: '',
  },
})

const [registerSavePage, { openModal: openSavePage }] = useModal();
// 这是示例组件


const [registerTable, { reload,getSelectRows,getDataSource,setTableData,setColumns }] = useTable({
  api: findAll,
  columns: CrudApi.columns,
  loading: loading.value,
  bordered: true,
  pagination:{ pageSize: 50,showSizeChanger: true, pageSizeOptions: ['50','100'],showTotal: t => `总共${t}条数据` },
  searchInfo: pageParameter
});
const [register, { closeModal }] = useModalInner( async (data) => {
  database.value=data.database
  reload()

  let arr = await getTypeList()
  let list = []
  list.push({id: '0', typeName: '全部'})
  arr.forEach(v=>{
    list.push(v)
  })
  treeDatas.value = list
  selectedKeys.value = ['k1']
  expandedKeys.value = ['k1']
});


async function handleOk() {
  if(selectedRowData.value!==''){
    emit('throwData', unref(selectedRowData.value[0]));
    closeModal();
  }
}

function rowDbClick(data) {
  console.log(data)
}

const val = {
  data: '',
  flg: '',
  openOne: 0
};
async function openAddPage() {
  let temp=await findAllByAccCountPartColumn(accId.value)
  openSavePage(true, {
    data: val,
    type: 'add',
    defaultPage:temp.independent=='1'?true:false, // 是否独立账套
    database:database.value,
    isEdit:true
  });
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

function createErrorPop(text) {
  createErrorModal({
    iconType: 'warning',
    title: '提示',
    content: text
  })
  return false
}

const {
  createConfirm,
  createWarningModal
} = useMessage()

function formatFlag(flag:any) {
  let str = '启用'
  switch (flag) {
    case '1':
      str = '启用'
      break
    case '0':
      str = '停用'
      break
  }
  return str
}
const treeselectedKeys = ref<string[]>([])
const treeexpandedKeys = ref<string[]>([])
const treeDatas = ref([])


async function query() {
  reload()
}

const changeTab =  async(data) =>{
  console.log(pageParameter)
  reload()
}

const [registerQueryPage, { openModal: openQueryPageM }] = useModal()
const [registerLookPage, { openModal: openLookPageM }] = useModal()

const openQueryPage = () => {
  openQueryPageM(true, {
    data: val
  })
}

const look =  async(data) =>{
  val.flg = pageParameter.lb
  val.data = data
  let arr = []
  arr.push(data.messageId)
  await goread(useUserStoreWidthOut().getUserInfo.id, arr)
  reload()
  openLookPageM(true, {
    data: val
  })

}

const notShow =  async(id) =>{
  //获取选中信息
  let ids = []
  if (checkRow.value.length > 0) {
    for (let i = 0; i < checkRow.value.length; i++) {
      ids.push(checkRow.value[i].messageId)
    }
    await hide(useUserStoreWidthOut().getUserInfo.id, ids)
    message.info('操作成功！')
    reload()
  } else {
    createWarningModal({
      iconType: 'warning',
      title: '编辑',
      content: '请选择一条数据！'
    })
  }
}
const read =  async(id) =>{
  //获取选中信息
  let ids = []
  if (checkRow.value.length > 0) {
    for (let i = 0; i < checkRow.value.length; i++) {
      ids.push(checkRow.value[i].messageId)
    }
    await goread(useUserStoreWidthOut().getUserInfo.id, ids)
    message.info('操作成功！')
    reload()
  } else {
    createWarningModal({
      iconType: 'warning',
      title: '编辑',
      content: '请选择一条数据！'
    })
  }
}
const del =  async(data) =>{
  //5分钟内可以撤销
  const c = moment().diff(moment(data.sendTime),'m')
  if(c < 6 && c >= 0){
    await chexiao(useUserStoreWidthOut().getUserInfo.id, data.messageId)
    message.info('撤销成功!')
  }else{
    message.error('已超过5分钟无法撤销!')
  }
}

const formatIfrag = (val)=>{
  let str
  if(val === '1'){
    str = '已读'
  }else if(val === '0'){
    str = '未读'
  }else{
    str = '隐藏'
  }
  return str;
}
const formatWeights = (val)=>{
  let str
  if(val === '1'){
    str = '重要紧急'
  }else if(val === '2'){
    str = '重要不紧急'
  }else if(val === '3'){
    str = '紧急不重要'
  }else{
    str = '一般'
  }
  return str;
}
const formatTime = (val)=>{
  return moment(val).format('YYYY-MM-DD')
}

function handleSelect(keys: string, e:any) {

  let keyStr = keys[0]+',';
  if (null != e.selectedNodes && e.selectedNodes.length > 0
    && null != e.selectedNodes[0].children &&  e.selectedNodes[0].children.length > 0){
    keyStr = getThisNodeStr(e.selectedNodes[0].children,keyStr)
  }
  pageParameter.type = keys[0]
  reload()
}

function getThisNodeStr(list,str) {
  for (const nods of list) {
    str+=(nods.typeCode+',')
    if (null != nods.children && nods.children.length > 0){
      str = getThisNodeStr(nods.children,str)
    }
  }
  return str
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

:deep(.ant-tabs-nav) {
  margin-bottom: 0px;

  .ant-tabs-tab-active {
    background-color: #f1f1f1;
    border-top: 2px solid #0096c7;
    border-bottom: none;
  }
}


</style>
