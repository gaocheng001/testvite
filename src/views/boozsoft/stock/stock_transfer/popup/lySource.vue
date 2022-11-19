<template>
  <BasicModal width="925px"
              v-bind="$attrs"
              :title="''"
              @register="register">
    <template #title>
      <div style="display: flex;" class="vben-basic-title">
        <SearchOutlined style="font-size: 29px;"/>
        <span style="line-height: 29px;font-size: 20px;margin-left: 10px;">来源单据</span>
      </div>
    </template>

    <div style="background-color: #158eb8;height: 50px;padding-top: 10px;padding-left:10px;border-radius: 5px;">
      <Select style="width: 130px;" v-model:value="searchConditon.requirement">
        <SelectOption value="xyccode">单据编码</SelectOption>
        <SelectOption value="cwhcode">仓库</SelectOption>
        <SelectOption value="stockNum">存货编码</SelectOption>
        <SelectOption value="stockName">存货名称</SelectOption>
        <SelectOption value="cmemo">备注</SelectOption>

        <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
      </Select>
      <InputSearch placeholder="" v-model:value="searchConditon.value" style="width: 200px; border-radius: 4px" @search="openReFresh"/>
      <div style="float: right;margin-right: 5px;">
        <RadioGroup v-model:value="queryV" @change="findAllXySource()" v-show="groupList.length > 0" >
          <Radio style="color: white" :value="it.value" v-for="it in groupList">{{it.title}}</Radio>
        </RadioGroup>
        <button type="button" class="ant-btn ant-btn-me" @click="findAllXySource()"><span>刷新</span></button>
      </div>
    </div>
    <div class="nc-query-open-content">
      <div class="content-body">
<!--
    :row-selection="{ type: 'checkbox',fixed: true,selectedRowKeys: tableSelectedRowKeys, onSelect: onSelectChange ,getCheckboxProps: onCheckChange}"
        :row-key="r=>r.field"
        -->
        <BasicTable

          :scroll="{ y: 340 }"
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
          <template #cwhcode="{ record }">{{formatCwhcode(record.cwhcode)}}</template>
          <template #cunitid="{ record }">{{formatUniqueJiLiang(record.cunitid)}}</template>
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
import {ref,reactive} from 'vue';
import {BasicModal, useModalInner} from '/@/components/Modal';
import {CheckOutlined, CaretDownOutlined,SearchOutlined} from '@ant-design/icons-vue';
import {Button, Checkbox, DatePicker, Input, message, Radio, Select, Tag} from 'ant-design-vue';

import {BasicTable, useTable} from '/@/components/Table'
import {hasBlank} from "/@/api/task-api/tast-bus-api";

import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {JsonTool, ObjTool} from "/@/api/task-api/tools/universal-tools";
import {
  findByLyOutDataSourrce,
} from "/@/api/record/stock/stock-xy-source";
import router from "/@/router";

const RangePicker = DatePicker.RangePicker;
const SelectOption = Select.Option;
const RadioGroup = Radio.Group;
const InputSearch = Input.Search;

const emit = defineEmits(['register', 'query']);
const formItems: any = ref({});
const schemaName = ref('')
const yearV = ref('')
const queryType = ref('')
const queryV = ref('')
const titlePrefix = ref('')
const groupList = ref([])
const searchConditon = reactive({
  requirement:'xyccode',value:''
})
const dataSourceList = ref([{value: 'customer', label: '客户'}, {value: 'supplier', label: '供应商'}])
const tableSelectedRowKeys = ref([])
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
      title: '单据类型',
      dataIndex: 'xyBillStyle',
      width: '90px',
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
      align: 'left',  slots: {customRender: 'cwhcode'}
    },
    {
      title: '存货编码',
      dataIndex: 'stockNum',
      width: '100px',
      align: 'left',
    },
    {
      title: '存货名称',
      dataIndex: 'stockName',
      width: '150px',
      align: 'left',
    },{
      title: '规格型号',
      dataIndex: 'stockGgxh',
      width: '100px',
      align: 'left',
    },{
      title: '主计量',
      dataIndex: 'cunitid',
      width: '80px',
      align: 'left',  slots: {customRender: 'cunitid'}
    },{
      title: '主数量',
      dataIndex: 'baseQuantity',
      width: '80px',
      align: 'center',
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
  showIndexColumn: true,
  pagination: {
    pageSize: 50,
    showSizeChanger: true,
    pageSizeOptions: ['50'],
    showTotal: t => `总共${t}条数据`
  },
})

const [register, {closeModal, setModalProps}] = useModalInner(async (o) => {
  schemaName.value = o.database
  yearV.value = o.code
  queryType.value = o.type
  ckList.value = o.datas.ck
  jiList.value = o.datas.ji
  manyList.value = o.datas.many
  findAllXySource()
  setModalProps({minHeight: 420});
  resetTool ()
});

const tableAll = ref(null)
async function findAllXySource() {
  let list =  await useRouteApi(findByLyOutDataSourrce,{schemaName: schemaName})({billStyle:queryType.value,code:yearV.value,type: queryV.value})
  setTableData(list)
  tableAll.value = list
}
async function handleOk() {
  closeModal();
  return true;
}
const ckList = ref([])
const jiList = ref([])
const manyList = ref([])
// 跳转对应的单据
function goRuter(data) {
  router.push({path: '/kc-cgDepot',query: {ccode:data.xyccode}});
  handleOk()
}
const openReFresh = () => {
  if (null != tableAll.value && !hasBlank(searchConditon.requirement) && !hasBlank(searchConditon.value)){
     let list =  tableAll.value.filter(it=>it[searchConditon.requirement].indexOf(searchConditon.value) != -1)
    setTableData(list)
  }else if (tableAll.value != null){
    setTableData(JsonTool.parseProxy(tableAll.value))
  }
}
function formatUniqueJiLiang(uniqueCodeUser) {
  let str = ''
  jiList.value.forEach(
    function (psn: any) {
      if (psn.id == uniqueCodeUser) {
        str = psn.unitName
      }
    }
  )
  if (str == ''){
    let res = manyList.value.filter(it => it.id == uniqueCodeUser)[0]
    if (res != null) {
      let list = JsonTool.parseObj(res.detail) || []
      if (list.length > 0) {
        str = list[0].unitName + `[${list[0].conversionRate}]`
      }
    }
  }
  return str || ''
}
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
const resetTool =  () => {
  if (queryType.value == 'XHD'){
    titlePrefix.value = '销货单'
    groupList.value =[{value: 'XSDD',title:'销售订单'},{value: 'XSFP',title:'销售发票'},{value: 'XSCKD',title:'销售出库单'},{value: 'XHD',title:'销货单'}]
    queryV.value =  groupList.value[0].value
  }else if(queryType.value == 'XSCKD'){
    titlePrefix.value = '销售出库单'
    groupList.value =[{value: 'XHD',title:'销货单'},{value: 'XSDD',title:'销售订单'},{value: 'XSFP',title:'销售发票'},{value: 'XSCKD',title:'销售出库单'}]
    queryV.value =  groupList.value[0].value
  }else {
    groupList.value =[]
    titlePrefix.value =''
    queryV.value =''
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
