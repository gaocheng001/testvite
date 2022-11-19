<template>
  <BasicModal width="700px"
              v-bind="$attrs"
              :title="''"
              @register="register">
    <template #title>
      <div style="display: flex;margin-left: 10px;margin-top: 5px;" class="vben-basic-title">
        <SearchOutlined style="font-size: 29px;color: rgb(21, 142, 184)"/>
        <span style="line-height: 29px;font-size: 20px;margin-left: 10px;color: rgb(21, 142, 184)">{{titlePrefix}}下游单据</span>
      </div>
    </template>
    <div class="nc-query-open-content">
      <div style="background-color: #158eb8;height: 50px;padding-top: 10px;padding-left:10px;border-radius: 5px;">
        <div style="float: left;">
          <RadioGroup v-model:value="queryV" @change="findAllXySource()" v-show="groupList.length > 0" >
            <Radio style="color: white" :value="it.value" v-for="it in groupList">{{it.title}}</Radio>
          </RadioGroup>
        </div>
        <div style="float: right;margin-right: 5px;">

          <button type="button" class="ant-btn ant-btn-me" @click="findAllXySource()"><span>刷新</span></button>
        </div>
      </div>
      <div class="content-body" style="margin-top: 5px;">
        <BasicTable
          :scroll="{ y: 220 }"
          class="alone-basic-table"
          size="small"
          @register="registerTable"
        >
          <template #xyBillStyle="{ record }">
            {{formatName(record.xyBillStyle)}}
          </template>
          <template #xyccode="{ record }">
            <a @click="goRuter(record)">{{ record.xyccode }}</a>
          </template>
          <template #baseQuantity="{ record }">
            {{ toThousandFilter(record.baseQuantity) }}
          </template>
          <template #isum="{ record }">
            {{ toThousandFilter(record.isum) }}
          </template>
          <template #cwhcode="{ record }">
            {{ formatCwhcode(record.cwhcode) }}
          </template>
        </BasicTable>
      </div>
    </div>
    <template #footer>
      <div style="height: 35px">
        <div style="float: right">
          <Button @click="handleOk" type="primary">关闭</Button>
        </div>
      </div>
    </template>
  </BasicModal>
</template>
<script setup="props, { content }" lang="ts">
import {reactive, ref} from 'vue';
import {BasicModal, useModalInner} from '/@/components/Modal';
import {CaretDownOutlined,SearchOutlined} from '@ant-design/icons-vue';
import {Button,DatePicker, Input, message, Radio, Select, Tag} from 'ant-design-vue';
import {BasicTable, useTable} from '/@/components/Table'
import {hasBlank} from "/@/api/task-api/tast-bus-api";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {JsonTool, ObjTool} from "/@/api/task-api/tools/universal-tools";

import {findByXyOutDataSourrce} from "/@/api/record/stock/stock-xy-source";
import router from "/@/router";
import {useTabs} from "/@/hooks/web/useTabs";

const RangePicker = DatePicker.RangePicker;
const SelectOption = Select.Option;
const RadioGroup = Radio.Group;
const InputSearch = Input.Search;
const emit = defineEmits(['register', 'query']);

const schemaName = ref('')
const schemaCode = ref('')
const queryType = ref('')
const ccodeV = ref('')
const queryV = ref('')
const titlePrefix = ref('')
const groupList = ref([])

function formatCwhcode(cwhcode){
  let str = cwhcode
  ckList.value.forEach(item=>{
    if(item.id == cwhcode){
      str = item.ckName
    }
  })
  return str
}
function formatName(cwhcode){
  let str = cwhcode
  groupList.value.forEach(item=>{
    if(item.value == cwhcode){
      str = item.title
    }
  })
  return str
}

const [registerTable, {getDataSource, setTableData}] = useTable({
  columns: [
    {
      title: '单据类型',
      dataIndex: 'xyBillStyle',
      width: '120px',
      slots: {customRender: 'xyBillStyle'}
    },
    {
      title: '单据编码',
      dataIndex: 'xyccode',
      width: '130px',
      align: 'left',
      slots: {customRender: 'xyccode'}
    },
    {
      title: '单据日期',
      dataIndex: 'xyccodeDate',
      width: '100px',
      align: 'left',
    },
    {
      title: '仓库',
      dataIndex: 'cwhcode',
      width: '120px',
      align: 'left', slots: {customRender: 'cwhcode'}
    },
     {
       title: '业务部门',
       dataIndex: 'deptName',
       width: '140px',
     },
     {
       title: '业务员',
       dataIndex: 'psnName',
       width: '80px',
     },
    {
      title: '备注',
      dataIndex: 'cmemo',
      width: '120px',
      align: 'left',
    }
  ],
  bordered: true,
  showIndexColumn: true,
  pagination: {
    pageSize: 50,
    showSizeChanger: true,
    pageSizeOptions: ['50'],
    showTotal: t => `总共${t}条数据`
  },
})
const ckList = ref([])
const isRed = ref(false)
const [register, {closeModal, setModalProps}] = useModalInner(async (o) => {
  setModalProps({minHeight: 420});
  schemaName.value = o.database
  schemaCode.value = o.databaseCode
  queryType.value = o.type
  isRed.value = o.isRed
  resetTool ()
  ccodeV.value = o.code
  ckList.value = o.datas.ck
  findAllXySource()
});

const resetTool =  () => {
  if (queryType.value == 'XHD'){
    titlePrefix.value = isRed.value?'退货单':'销货单'
    if (isRed.value){
      groupList.value =[{value: 'XSCKD',title:'红字销售出库单',path: '/kc-xsDepot'},{value: 'XSFP',title:'红字销售发票',path:''}]
    }else {
      groupList.value =[{value: 'XSCKD',title:'销售出库单',path: '/kc-xsDepot'},{value: 'XSFP',title:'销售发票',path:''},{value: 'XHD',title:'退货单',path:'/xs-return'}]
    }
    queryV.value =  groupList.value[0].value
  }else if(queryType.value == 'XSCKD'){
    titlePrefix.value = (isRed.value?'红字':'')+'销售出库单'
    groupList.value =[{value: 'XSFP',title:(isRed.value?'红字':'')+'销售发票',path:''},{value: 'CWPZ',title:'财务凭证',path:''}]
    if (!isRed.value)groupList.value.push({value: 'XHD',title:'销货单',path:'/xs-arrive'})
    queryV.value =  groupList.value[0].value
  }else if(queryType.value == 'XSFP'){
    titlePrefix.value = (isRed.value?'红字':'')+'销售发票'
    groupList.value =[{value: 'CWPZ',title:'财务凭证',path:''}]
    queryV.value =  groupList.value[0].value
  }else {
    groupList.value =[]
    titlePrefix.value =''
    queryV.value =''
  }
}

async function findAllXySource() {
  let list = await useRouteApi(findByXyOutDataSourrce,{schemaName: schemaName})({billStyle:queryType.value,code:ccodeV.value,type: queryV.value})
  setTableData(list)
}

async function handleOk() {
  closeModal();
  return true;
}
const {closeToFullPaths} = useTabs(router);
// 跳转对应的单据
async function goRuter(data) {
  let path = groupList.value.filter(it=>it.value == queryV.value)[0].path
  if (!hasBlank(path)){
    await closeToFullPaths(path)
    setTimeout(()=>{
      router.push({path: path,query: {ccode:data.xyccode,bdate: data.xyccodeDate,bdocum: isRed.value?1:0,type:'show',co: schemaCode.value}});
    },1000)
    handleOk()
  }else {
    message.warn('请检查单据编码后重试！')
  }
}

</script>
<style lang="less" scoped="scoped">
@import '/@/assets/styles/part-open.less';
@import '/@/assets/styles/alone-basic-table.less';

.nc-query-open-content {
  text-align: center;
  padding: 1%;
  height: 100%;

  .content-head {
    text-align: right;
    margin-bottom: 1em;
  }
}
</style>
