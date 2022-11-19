<template>
  <BasicModal width="925px"
              v-bind="$attrs"
              :title="''"
              @register="register">
    <template #title>
      <div style="display: flex;" class="vben-basic-title">
        <SearchOutlined style="font-size: 29px;"/>
        <span style="line-height: 29px;font-size: 20px;margin-left: 10px;">确认变化差异</span>
      </div>
    </template>
    <div style="background-color: #158eb8;height: 50px;padding-top: 10px;padding-left:10px;border-radius: 5px;">
      <Select style="width: 130px;" v-model:value="searchConditon.requirement">
        <SelectOption value="invoiceId">存货编码</SelectOption>
        <SelectOption value="stockName">存货名称</SelectOption>
        <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
      </Select>
      <InputSearch placeholder="" v-model:value="searchConditon.value" style="width: 200px; border-radius: 4px" @search="openReFresh"/>
    </div>
    <div class="nc-query-open-content">
      <div class="content-body">
        <BasicTable
          :scroll="{ y: 340 }"
          class="alone-basic-table"
          size="small"
          @register="registerTable"
       />
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

const RangePicker = DatePicker.RangePicker;
const SelectOption = Select.Option;
const RadioGroup = Radio.Group;
const InputSearch = Input.Search;
const emit = defineEmits(['register', 'query']);

const searchConditon = reactive({
  requirement:'invoiceId',value:''
})
const schemaName = ref('')
const queryType = ref('')
const ccodeV = ref('')
const accId = ref('')
const queryV = ref('')
const titlePrefix = ref('')
const groupList = ref([])
const tableSelectedRowKeys = ref([])



const [registerTable, {getDataSource, setTableData}] = useTable({
  columns: [

    {
      title: '存货编码',
      dataIndex: 'invoiceId',
      width: '120px',
      align: 'left',ellipsis: true,
    },
    {
      title: '存货名称',
      dataIndex: 'stockName',
      width: '150px',
      align: 'left',
      slots: {customRender: 'stockName'},ellipsis: true,
    },
    {
      title: '批号',
      dataIndex: 'batchId',
      width: '100px',
      align: 'left',
    },
    {
      title: '失效日期',
      dataIndex: 'dvdate',
      width: '120px',
      align: 'left',
    },
    {
      title: '计量单位',
      dataIndex: 'unitId',
      width: '80px',
      align: 'left', slots: {customRender: 'unitId'}
    },
    {
      title: '原单数量',
      dataIndex: 'squantity',
      width: '80px',
      align: 'center',
    },
    {
      title: '确认数量',
      dataIndex: 'squantityQr',
      width: '80px',
      align: 'center',
    },    {
      title: '出库单编码',
      dataIndex: 'ccode',
      width: '130px',
      align: 'left',
    },
    {
      title: '出库单日期',
      dataIndex: 'ddate',
      width: '120px',
      align: 'left',
    },
    {
      title: '确认单编码',
      dataIndex: 'querdId',
      width: '130px',
      align: 'left',
    },
    {
      title: '确认单日期',
      dataIndex: 'querdDate',
      width: '130px',
      align: 'left',
    },
  ],
  bordered: true,
  showIndexColumn: false,
  pagination: false,
})
const tableAll = ref([])
const chList = ref([])
const jiList = ref([])
const manyList = ref([])

const [register, {closeModal, setModalProps}] = useModalInner(async (o) => {
  setModalProps({minHeight: 420});
  chList.value = o.datas.ch
  jiList.value = o.datas.ji
  manyList.value = o.datas.many
  findAllXySource(o.list)
});

async function findAllXySource(list) {
  for (let e of list) {
    let stock  = chList.value.filter(it => it.stockNum == e.invoiceId )[0]
    e['stockName'] = stock?.stockName
    e['unitId'] = formatUniqueJiLiang(e.unitId,stock)
  }
  setTableData(list)
  tableAll.value = list;
}
async function handleOk() {
  closeModal();
  return true;
}
function formatUniqueJiLiang(uniqueCodeUser,stock) {
  if (hasBlank(uniqueCodeUser)) return  ''
  let str = uniqueCodeUser
  if (stock.stockMeasurementType == '单计量'){
    jiList.value.forEach(
      function (psn: any) {
        if (psn.id == uniqueCodeUser) {
          str = psn.unitName
        }
      }
    )
  }else{
    let res =  manyList.value.filter(it=>it.id == stock.stockMeasurementUnit)[0]
    if (res != null) {
      let list = JsonTool.parseObj(res.detail) || []
      if (list.length > 0){
        let u =  list.filter(it=>it.id == uniqueCodeUser)[0]
        str = u.unitName
      }
    }
  }
  return str || ''
}
// 跳转对应的单据
function goRuter(data) {
  if (data.xyBillStyle == 'XSCKD'){
    router.push({path: '/kc-xsDepot',query: {ccode:data.xyccode,bdate: data.xyccodeDate}});
  }
  if (data.xyBillStyle == 'JHZXD'){
    router.push({
      path: '/kc-box',
      query: {code: data.xyccode,tid: schemaName.value,aid: accId.value},
    });
  }
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
