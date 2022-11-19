<template>
  <BasicModal width="925px"
              v-bind="$attrs"
              :title="''"
              @ok="handleOk()"
              :canFullscreen="false"
              :draggable="false"
              :maskClosable="false"
              @register="register">
    <template #title>
      <!--      <div style="display: flex;" class="vben-basic-title">
              <img src="/create.svg" style="width:25px;margin-right: 10px;"/>
              <span style="line-height: 25px;font-size: 16px;">批号选择</span>
            </div>-->
      <div
        style="height: 30px;width: 100%;background-color: #5f375c;color: white;line-height: 30px;text-align: left;">
        <AppstoreOutlined style="margin: 0 2px;font-size: 14px;"/>
        <span style="font-size: 14px">存货管理</span>
      </div>
    </template>
    <div class="nc-query-open-content">
      <div class="content-title">
        <div><span>{{ isLack ? `${queryMode == 'xcl'?'现存量':'可用量'}不足！` : '' }}</span></div>
        <div>
          <SecondaryTitle :iconType="'query'">选择批号</SecondaryTitle>
        </div>
        <div></div>
      </div>
      <div class="content-head">
        <Row style="width: 100%;">
          <!--          <Col :span="8"><label class="left-label">存储位置：</label><span class="underscore-span">&nbsp;{{rowInfo.cwhcodeText}}</span></Col>-->
          <Col style="text-align: left;" :span="4"><label class="left-label">存货编码：</label><span
            class="underscore-span">{{ rowInfo.cinvode }}</span></Col>
          <Col style="text-align: left;" :span="10"><label class="left-label">存货名称：</label><span
            class="underscore-span">{{ rowInfo.cinvodeName }}</span></Col>
          <Col style="text-align: left;" :span="4"><label class="left-label">规格型号：</label><span
            class="underscore-span">{{ rowInfo.cinvodeType }}</span></Col>
          <Col style="text-align: right;" :span="6">
            <Button size="small" v-show="isLack" @click="reset()">按{{queryMode == 'xcl'?'现存量':'可用量'}}出库</Button>&emsp;<Button
            size="small" @click="reloadPage()">刷新
          </Button>
          </Col>
        </Row>
      </div>
      <div class="content-body">
        <BasicTable
          :row-selection="{ type: 'checkbox',fixed: true,selectedRowKeys: tableSelectedRowKeys, onSelect: onSelectChange ,getCheckboxProps: onCheckChange}"
          :loading="isLoading"
          :scroll="{ y: 290 }"
          class="alone-basic-table"
          size="small"
          @register="registerTable"
        >
          <template #outQuantity="{ record }">
            <template v-if="record?.editQuantity">
              <InputNumber v-model:value="record.tempQuantity"
                           :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                           :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                           style="width: 82%;" size="small" :min="1" :max="record.availability"
                           @keyup.enter="record.editQuantity = null;record.outQuantity=record.tempQuantity;"/>
              <CheckOutlined
                @click="record.editQuantity = null;record.outQuantity=record.tempQuantity;"/>
            </template>
            <template v-else>
              <div class="suspended-div" @click="openEdit(record)">
                    <span class="a-table-font-arial">{{
                        (record.outQuantity == null ? '0.00' : parseFloat(record.outQuantity).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }}</span>
              </div>
            </template>
          </template>
        </BasicTable>
      </div>
    </div>
  </BasicModal>
</template>
<script setup="props, { content }" lang="ts">
import {ref} from 'vue';
import {BasicModal, useModalInner} from '/@/components/Modal';
import {AppstoreOutlined, CheckOutlined} from '@ant-design/icons-vue';
import {Button, Col, DatePicker, InputNumber, Radio, Row, Select,message} from 'ant-design-vue';
import {useMessage} from "/@/hooks/web/useMessage";
import {BasicTable, useTable} from '/@/components/Table'
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {batchSelectorList} from "/@/api/record/stock/stock-currents";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import SecondaryTitle from "/@/views/boozsoft/stock/stock_piliang/popup/SecondaryTitle.vue";
import {hasBlank} from "/@/api/task-api/tast-bus-api";
import {JsonTool} from "/@/api/task-api/tools/universal-tools";

const RangePicker = DatePicker.RangePicker;
const SelectOption = Select.Option;
const RadioGroup = Radio.Group;

const emit = defineEmits(['register', 'throwData']);
const schemaName = ref('')
const dynamicTenant = ref(null)
const isLoading = ref(false)
const isLack = ref(true)
const lackNumber = ref(0)
const tableSelectedRowKeys = ref([])
const tableSelectedRowObjs = ref([])
const busDate = useCompanyOperateStoreWidthOut().getLoginDate;
const onSelectChange = (record, selected, obj, nativeEvent) => {
  // 检查日期
  // 判断数量是否符合标准
  if (new Date(record.dvdate)<new Date(busDate)) return createWarningModal({title: '温馨提示', content: '当前存货批号已经失效,不能选择！'});
  const xN = parseFloat(rowInfo.value.quantity)
  let cN = 0;
  tableSelectedRowObjs.value = obj.filter(it => {
    // if (xN > 0 && cN >= xN) return false   // 精准限制数量
    let tN = parseFloat(it.availability)
    cN += tN
    return true;
  })
  let len = tableSelectedRowObjs.value.filter(it => it.key == record['key']).length
  let yN = 0
  tableSelectedRowObjs.value.filter(it => tableSelectedRowKeys.value.indexOf(it.key) != -1).map(it => yN += parseFloat(it.outQuantity))
  selected
    ? (len > 0 ? (record['outQuantity'] = cN >= xN ? xN - yN : record['availability']) : null)
    : (record['outQuantity'] = 0)
  tableSelectedRowKeys.value = tableSelectedRowObjs.value.map(it => it.key)
}

const onCheckChange = (record) => {
  return {disabled: isLack.value || (parseFloat(record.availability) <= 0)}
}

const [registerTable, {getDataSource, setTableData,getColumns,setColumns}] = useTable({
  columns: [
    {
      title: '批号',
      dataIndex: 'batchId',
      width: '120px',
      align: 'left',
    },
    {
      title: '计量单位',
      dataIndex: 'xsUnitId',
      width: '100px',
      format: (o) => {
        let list = rowInfo.value['unitList']
        let id = o
        if (null == list || hasBlank(id)) return id;
        let it = list.filter(it => it.id == id)[0]
        return null == it ? id : it.label
      }
    },/* {
      title: '现存量',
      dataIndex: 'baseQuantity',
      width: '100px',
    },*/
    {
      title: `可用量`,
      dataIndex: 'availability',
      width: '100px',
    },
    {
      title: '本次数量',
      dataIndex: 'outQuantity',
      width: '120px', slots: {customRender: 'outQuantity'},
    },/* {
      title: '数量1',
      dataIndex: 'outQuantity2',
      width: '100px',
    }, {
      title: '本次使用',
      dataIndex: 'outQuantity3',
      width: '100px',
    },  {
      title: '数量2',
      dataIndex: 'outQuantity3',
      width: '100px',
    },*/ {
      title: '仓库',
      dataIndex: 'cwhcode',
      width: '160px',
      format: (o)=> {
        let l = ckList.value.filter(it => it.id ==  o)[0]?.ckName
        return   l == null?o:l
      }
    },
    {
      title: '生产日期',
      dataIndex: 'dpdate',
      width: '100px',
    }, {
      title: '失效日期',
      dataIndex: 'dvdate',
      width: '100px',
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

const dynamicColumnDataCopy = ref([])

const rowInfo = ref({})
const　ckList = ref([])
const　queryMode = ref('all')

const [register, {closeModal, setModalProps}] = useModalInner(async (o) => {
  setModalProps({minHeight: 420});
  schemaName.value =  o.tenant.accountMode
  dynamicTenant.value = o.tenant
  queryMode.value = (o?.mode || 'all')
  rowInfo.value = o.row
  ckList.value = o.list
  reloadPage()
  setColumns(getColumns().map(it=>{
    if (it.dataIndex == 'availability')
      it.title = queryMode.value=='all'?'可用量':'现存量'
    return it;
  }))
});

async function reloadPage() {
  isLoading.value = true
  tableSelectedRowKeys.value = []
  tableSelectedRowObjs.value = []
  let checks=[];if (dynamicTenant.value?.target?.kcCgrkCheck == '1')checks.push('cg');if (dynamicTenant.value?.target?.kcXsckCheck == '1')checks.push('xs');
  let list = await useRouteApi(batchSelectorList, {schemaName: schemaName.value})({
    year: busDate.split('-')[0],mode:(queryMode.value),checks: JsonTool.json(checks),
    parameters: JsonTool.json([rowInfo.value.cwhcode+'='+rowInfo.value.cinvode+'=1'])
  })
  setTableData(conversionCalculation(list))
  isLoading.value = false
}

function reset() {
  let list = JsonTool.parseProxy(getDataSource())
  if (list.length > 0) {
    rowInfo.value['quantity'] = JsonTool.parseProxy(lackNumber.value)
    tableSelectedRowObjs.value = list.map(it=>{
      it.outQuantity = it.availability
      return it;
    })
    tableSelectedRowKeys.value = tableSelectedRowObjs.value.map(it=>it.key)
    handleOk()
  }
}
function openEdit(record){
  if (tableSelectedRowKeys.value.indexOf(record['key']) == -1){
    message.info("请选中行后在进行操作！")
  }else{
    record.tempQuantity=record.outQuantity;
    record.editQuantity = true;
  }
}
/**
 * @param list
 * @param b 可用量包含采购购在途量？
 */
function conversionCalculation(list) {
  let c = rowInfo.value['cunitid']
  let x = rowInfo.value['xsUnitId']
  let q = rowInfo.value['quantity']
  let unitList = rowInfo.value['unitList']
  let arr = []
  let lack = 0
  for (let r of list) {
    let bNum =  parseFloat(r['baseQuantity'])
    r['xsUnitId'] = x
    r['batchId'] = r['batchNumber']
    r['cwhcode'] = r['stockCangkuId']
    r['availability'] = (c == x ? bNum : bNum / parseFloat((unitList[unitList.findIndex(it => it.id == x)]?.conversionRate))).toFixed(2)
    if (parseFloat(r['availability']) > 0) {
      lack += parseFloat(r['availability'])
      arr.push(r)
    }
  }
  isLack.value =   lack < q
  lackNumber.value = lack
  return arr;
}
const {createWarningModal, createConfirm} = useMessage()

async function handleOk() {
  if (tableSelectedRowKeys.value.length == 0){
    createWarningModal({title: '温馨提示', content: '请选择批号！'});
  }else {
    let list =  tableSelectedRowObjs.value.filter(it=>parseFloat(it.outQuantity)>0)
    let sN =0
    list.map(it=>sN+=parseFloat(it.outQuantity))
    if (sN != parseFloat(rowInfo.value.quantity)){
      createWarningModal({title: '温馨提示', content: '表头主数量与表体已选总出库量不想等！'});
    }else {
      emit('throwData',list)
      closeModal()
      tableSelectedRowKeys.value = []
      tableSelectedRowObjs.value = []
    }
  }
}
// ((parseFloat(r['baseQuantity'])+(parseFloat(r['ztrkQuantityInt'])+parseFloat(r['ztrkQuantityCcprk'])+parseFloat(r['ztrkQuantityQtrk'])+parseFloat(r['ztrkQuantityCgrk'])+parseFloat(r['ztrkQuantityCgdh'])))-
//(parseFloat(r['ztckQuantityOut'])+parseFloat(r['ztckQuantityQtck'])+parseFloat(r['ztckQuantityClly'])+parseFloat(r['ztckQuantityXsck'])+parseFloat(r['ztckQuantityXhd']))).toFixed(2)
</script>
<style lang="less" scoped="scoped">
@import '/@/assets/styles/part-open.less';
@import '/@/assets/styles/alone-basic-table.less';
@import '/@/assets/styles/redTitle-open.less';
.nc-query-open-content {
  text-align: center;
  padding: 0 1%;
  height: 100%;

  .content-title {
    width: 100%;
    display: inline-flex;
    justify-content: space-between;

    > div:nth-of-type(odd) {
      width: 30%;
      line-height: 44px;
      color: red;
      font-weight: bold;
    }
  }

  .content-head {
    width: 100%;
    background-color: #158eb8;
    height: 40px;
    padding: 10px;
    border-radius: 5px;
    display: inline-flex;
    justify-content: space-between;
    color: white;
    font-weight: bold;

    .left-label {
      display: inline-block;
      text-align: left;
      width: 80px;
    }

    .underscore-span {
      text-align: left;
      width: calc(100% - 80px);
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      display: inline-block;
      vertical-align: top;
    }
  }

  .content-body {
    margin-top: 5px;

  }

}

.suspended-div:hover {
  cursor: text;
  background-color: #e4e7e7;

  .anticon-form {
    display: block;
  }
}
</style>
