<template>
  <BasicModal width="925px"
              v-bind="$attrs"
              :title="''"
              @register="register">
    <template #title>
      <div style="display: flex;" class="vben-basic-title">
        <SelectOutlined style="font-size: 29px;"/>
        <span style="line-height: 29px;font-size: 20px;margin-left: 10px;">来源单据</span>
      </div>
    </template>
    <div class="nc-query-open-content">
      <div class="content-body">
        <BasicTable
          :row-selection="{ type: 'checkbox',fixed: true,selectedRowKeys: tableSelectedRowKeys, onSelect: onSelectChange ,getCheckboxProps: onCheckChange}"
          :row-key="r=>r.field"
          :scroll="{ y: 340 }"
          class="alone-basic-table"
          size="small"
          @register="registerTable"
        >
          <template #xyBillStyle="{ record }">
            <span v-if="record.xyBillStyle=='PLXHD'">
              批量销货单
            </span>
            <span v-if="record.xyBillStyle=='XHD'">
              销货单
            </span>
          </template>
          <template #xyccode="{ record }">
            <a @click="goRuter(record)">{{ record.xyccode }}</a>
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
import {ref} from 'vue';
import {BasicModal, useModalInner} from '/@/components/Modal';
import {CheckOutlined, EditOutlined,SelectOutlined} from '@ant-design/icons-vue';
import {Button, Checkbox, DatePicker, Input, message, Radio, Select, Tag} from 'ant-design-vue';
import {useMessage} from "/@/hooks/web/useMessage";
import {BasicTable, useTable} from '/@/components/Table'
import {hasBlank} from "/@/api/task-api/tast-bus-api";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {delStockColumnList, saveStockColumnList} from "/@/api/record/stock/stock-caigou";
import {JsonTool, ObjTool} from "/@/api/task-api/tools/universal-tools";
import {
  GenerateDynamicColumn
} from "/@/views/boozsoft/stock/stock-caigou-dh/component/DynamicForm";
import {
  findByLyOutDataSourrce,
  findByXyDataSourrce,
  findByXyOutDataSourrce
} from "/@/api/record/stock/stock-xy-source";
import router from "/@/router";

const RangePicker = DatePicker.RangePicker;
const SelectOption = Select.Option;
const RadioGroup = Radio.Group;

const emit = defineEmits(['register', 'query']);
const formItems: any = ref({});
const schemaName = ref('')
const yearV = ref('')
const queryType = ref('')

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
    }, {
      title: '单据日期',
      dataIndex: 'xyccodeDate',
      width: '120px',
      align: 'left',
    },
    {
      title: '单位简称',
      dataIndex: 'component',
      width: '140px',
      align: 'left',
    },
    {
      title: '业务部门',
      dataIndex: 'deptName',
      width: '140px',
    }, {
      title: '业务员',
      dataIndex: 'psnName',
      width: '80px',
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

const [register, {closeModal, setModalProps}] = useModalInner(async (o) => {
  formItems.value = {}
  schemaName.value = o.database
  yearV.value = o.year
  queryType.value = o.type
  findAllXySource()
  setModalProps({minHeight: 420});
});

async function findAllXySource() {
  let list =  await useRouteApi(findByLyOutDataSourrce,{schemaName: schemaName})({billStyle:queryType.value,year:yearV.value})
  setTableData(list)
}
async function handleOk() {
  closeModal();
  return true;
}

// 跳转对应的单据
function goRuter(data) {
  router.push({path: '/kc-cgDepot',query: {ccode:data.xyccode}});
  handleOk()
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
