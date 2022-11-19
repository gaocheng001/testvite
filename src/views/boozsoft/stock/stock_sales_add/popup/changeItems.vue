<template>
  <BasicModal width="925px"
              v-bind="$attrs"
              :title="''"
              @register="register">
    <template #title>
      <div style="display: flex;" class="vben-basic-title">
        <SearchOutlined style="font-size: 29px;"/>
        <span style="line-height: 29px;font-size: 20px;margin-left: 10px;">变更清单</span>
      </div>
    </template>
    <div style="background-color: #158eb8;height: 50px;padding-top: 10px;padding-left:10px;border-radius: 5px;">
      <Select style="width: 130px;" v-model:value="searchConditon.requirement">
        <SelectOption value="ccode">单据编码</SelectOption>
        <SelectOption value="ddate">单据日期</SelectOption>
        <SelectOption value="cmemo">备注</SelectOption>
        <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
      </Select>
      <InputSearch placeholder="" v-model:value="searchConditon.value" style="width: 200px; border-radius: 4px" @search="openReFresh"/>
      <div style="float: right;margin-right: 5px;">
<!--        <RadioGroup v-model:value="queryV" @change="findAllXySource()" v-show="groupList.length > 0" >
          <Radio style="color: white" :value="it.value" v-for="it in groupList">{{it.title}}</Radio>
        </RadioGroup>-->
        <button type="button" class="ant-btn ant-btn-me" @click="findAllXySource()"><span>刷新</span></button>
      </div>
    </div>
    <div class="nc-query-open-content">
      <div class="content-body">
        <BasicTable
          :scroll="{ y: 340 }"
          class="alone-basic-table"
          size="small"
          @register="registerTable"
        >
          <template #ccode="{ record }">
            <a @click="goRuter(record)">{{ record.ccode }}</a>
          </template>
          <template #cwhcode="{ record }">{{formatCwhcode(record.cwhcode)}}</template>
          <template #biandongUser="{ record }">{{formatOperator(record.biandongUser)}}</template>
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
import {findChangeList} from "/@/api/record/stock/stock-xhd";

const RangePicker = DatePicker.RangePicker;
const SelectOption = Select.Option;
const RadioGroup = Radio.Group;
const InputSearch = Input.Search;
const emit = defineEmits(['register', 'query']);

const searchConditon = reactive({
  requirement:'ccode',value:''
})
const schemaName = ref('')
const queryType = ref('')
const ccodeV = ref('')
const queryV = ref('')
const titlePrefix = ref('')
const groupList = ref([])
const tableSelectedRowKeys = ref([])

function formatCwhcode(cwhcode){
  let str = cwhcode
  ckList.value.forEach(item=>{
    if(item.id == cwhcode){
      str = item.ckName
    }
  })
  return str
}



function formatOperator(uniqueCodeUser) {
  let str = uniqueCodeUser
  operatorList.value.forEach(
    function (psn: any) {
      if (psn.id == uniqueCodeUser) {
        str = psn.realName
      }
    }
  )
  return str || ''
}

const onSelectChange = (record, selected, obj, nativeEvent) => {
  let o = obj.map(it => it.field)
  tableSelectedRowKeys.value = o.filter(v => v != 'field1' && v != 'field2' && v != 'field3')
}
const onCheckChange = (record) => {
  return {disabled: (record.label === '到货日期' || record.label === '到货单号' || record.label === '供应商' || record.label === '仓库')}
}

const [registerTable, {getDataSource, setTableData}] = useTable({
  columns: [
    {
      title: '单据编码',
      dataIndex: 'ccode',
      width: '150px',
      align: 'left',
      slots: {customRender: 'ccode'}
    },
    {
      title: '单据日期',
      dataIndex: 'ddate',
      width: '90px',
      align: 'left',
    },
    {
      title: '仓库',
      dataIndex: 'cwhcode',
      width: '120px',
      align: 'left', slots: {customRender: 'cwhcode'}
    },{
      title: '数量合计',
      dataIndex: 'squantity',
      width: '120px',
      align: 'center',format: (v)=>parseFloat(v || '0').toFixed(2)
    },{
      title: '价税合计',
      dataIndex: 'isum',
      width: '120px',
      align: 'right',format: (v)=>parseFloat(v || '0').toFixed(2)
    },{
      title: '变动人',
      dataIndex: 'biandongUser',
      width: '120px',
      align: 'left',slots: {customRender: 'biandongUser'}
    },{
      title: '变动时间',
      dataIndex: 'baindongDate',
      width: '150px',
      align: 'left',
    },{
      title: '备注',
      dataIndex: 'cmemo',
      width: '120px',
      align: 'left',
    }
    /* {
       title: '单位简称',
       dataIndex: 'component',
       width: '140px',
       align: 'left',
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
     }*/
  ],
  bordered: true,
  showIndexColumn: false,
  pagination: {
    pageSize: 50,
    showSizeChanger: true,
    pageSizeOptions: ['50'],
    showTotal: t => `总共${t}条数据`
  },
})
const tableAll = ref([])
const ckList = ref([])
const operatorList = ref([])


const [register, {closeModal, setModalProps}] = useModalInner(async (o) => {
  setModalProps({minHeight: 420});
  schemaName.value = o.database
  queryType.value = o.type
  ccodeV.value = o.code
  ckList.value = o.datas.ck
  operatorList.value = o.datas.oper
  findAllXySource()
});

async function findAllXySource() {
  let list = await useRouteApi(findChangeList,{schemaName: schemaName})({code:ccodeV.value})
  setTableData(list)
  tableAll.value = list;
}
async function handleOk() {
  closeModal();
  return true;
}

// 跳转对应的单据
function goRuter(data) {
  if (!hasBlank(data.ccode)){
    router.push({path: '/xs-arrive-change',query: {ccode:data.ccode,database:schemaName.value}});
    handleOk()
  }
}

const openReFresh = () => {
  if (null != tableAll.value && !hasBlank(searchConditon.requirement) && !hasBlank(searchConditon.value)){
    let list =  tableAll.value.filter(it=>it[searchConditon.requirement]?.indexOf(searchConditon.value) != -1)
    setTableData(list)
  }else if (tableAll.value != null){
    setTableData(JsonTool.parseProxy(tableAll.value))
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
