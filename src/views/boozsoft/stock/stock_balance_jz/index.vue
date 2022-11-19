<template>
  <div class="nci-hr">
        <!-- 请注释下行，不要删除下行，方便快速定位页面  -->
<!--   <div><textarea>应收款制单的页面</textarea>复制内容快速定位页面</div>-->
    <div class="nc-hr-top">
      <div class="nc-hr-top-left">
        <div>
          <Avatar src="" :size="{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 80 }">
            <CarryOutOutlined style="font-size: 30px;color: #146dc1;"/>
          </Avatar>
        </div>
        <div>
          <span>年度结转</span><br/>
          <span>上年未执行完成的业务数据结转</span>
        </div>
      </div>
      <div style="line-height: 75px;">
        <span style="font-size: 32px;">库存期初余额结转上年</span>
      </div>
      <div class="nc-hr-top-right">
        <div>
          <Rate v-model:value="rateValue" allow-half/>
        </div>
        <div>
          <span>查看操作手册</span>
        </div>
      </div>
    </div>
    <div class="nc-hr-middle">
      <div>
        <AccountPicker theme="three" readonly @reloadTable="dynamicAdReload"/>
      </div>
      <div>

      </div>
      <div>
        <Button class="ant-btn ant-btn-me" @click="closeCurrent()">
          退出
        </Button>
      </div>
    </div>
    <div class="nc-hrm-body" :style="{maxHeight: windowHeight+'px'}">
      <div><span>库存期初结转年度：</span>
        <span>{{ dynamicYear }}年</span>
      </div>
      <div>
        <Steps :current="stepValue" status="success">
          <Step title="结转类型" description=""/>
          <Step title="结转规则" description=""/>
          <Step title="审核数据" description=""/>
          <Step title="完成结转" description=""/>
        </Steps>
      </div>
      <div style="height: 400px;">
        <div v-show="stepValue==0">

          <div class="acco-sideline">
            <span>结转类型</span>
            <div class="acco-sideline-content-there">
              <Row>
                <Col :span="12">
                  <Checkbox v-model:checked="XCL">
                    存货现存量结转
                  </Checkbox>
                </Col>
                <Col :span="12">
                  <Checkbox v-model:checked="RKD">
                    未完成采购结算采购入库单结转
                  </Checkbox>
                </Col>
                <br><br>
                <Col :span="12">
                  <Checkbox v-model:checked="CRKD">
                    未完成凭证制单出入库单结转
                  </Checkbox>
                </Col>
                <Col :span="12">
                  <Checkbox v-model:checked="JRJY">
                    未完成借入借用单结转
                  </Checkbox>
                </Col>
                <br><br>
                <Col :span="12">
                  <Checkbox v-model:checked="JCJY">
                    未完成借出借用单结转
                  </Checkbox>
                </Col>
              </Row>
            </div>
          </div>
        </div>
        <div v-show="stepValue==1">
          <div class="acco-sideline">
            <span>凭证制单</span>
            <div class="acco-sideline-content-there">
              <Row>
                <Col :span="12">
                  <Checkbox v-model:checked="WZDYSD">
                    未完成凭证制单的应收单
                  </Checkbox>
                </Col>
                <Col :span="12">
                  <Checkbox v-model:checked="WZDSKD">
                    未完成凭证制单的收款单
                  </Checkbox>
                </Col>
                <br/><br/>
                <Col :span="12" v-if="arCheckFlag!='1'">
                  <Checkbox v-model:checked="WZDXHD">
                    未完成凭证制单的销货单
                  </Checkbox>
                </Col>
                <Col :span="12" v-if="arCheckFlag=='1'">
                  <Checkbox v-model:checked="WZDXSFP">
                    未完成凭证制单的销售发票
                  </Checkbox>
                </Col>
              </Row>
            </div>
          </div>
          <div class="acco-sideline">
            <span>数据汇总</span>
            <div class="acco-sideline-content-there">
              <Row>
                <Col :span="12">
                  <Checkbox v-model:checked="SJHZYSD">
                    应收单按明细模式结转
                  </Checkbox>
                </Col>
                <Col :span="12">
                  <Checkbox v-model:checked="SJHZSKD">
                    收款单按明细结转
                  </Checkbox>
                </Col>
                <br/><br/>
                <Col :span="12" v-if="arCheckFlag!='1'">
                  <Checkbox v-model:checked="SJHZXHD">
                    销货单按明细结转
                  </Checkbox>
                </Col>
                <Col :span="12" v-if="arCheckFlag=='1'">
                  <Checkbox v-model:checked="SJHZXSFP">
                    销售哦发票按明细结转
                  </Checkbox>
                </Col>
              </Row>
            </div>
          </div>
        </div>
        <div style="width: 400px;" v-show="stepValue==2">
          <div class="acco-sideline">
            <span>数据审核</span>
            <div class="acco-sideline-content-there">
              <Row>
                <Col :span="12">
                  <Checkbox v-model:checked="WSHYSD">
                    包含未审核应收单
                  </Checkbox>
                </Col>
                <Col :span="12">
                  <Checkbox v-model:checked="WSHSKD">
                    包含未审核收款单
                  </Checkbox>
                </Col>
                <br/><br/>
                <Col :span="12" v-if="arCheckFlag!='1'">
                  <Checkbox v-model:checked="WSHXHD">
                    包含未审核销货单
                  </Checkbox>
                </Col>
                <Col :span="12" v-if="arCheckFlag=='1'">
                  <Checkbox v-model:checked="WSHXSFP">
                    包含未审核销售发票
                  </Checkbox>
                </Col>
              </Row>
            </div>
          </div>
        </div>
        <div v-show="stepValue==3">
          <BasicTable
            :row-selection="{ type: 'checkbox', selectedRowKeys: state2.selectedRowKeys, onChange: onSelectChange2 }"
            @register="registerTable2"
            :dataSource="tableData2"
            class="a-table-font-size-12"
            :scroll="{ y: 330 }"
          >
          </BasicTable>
        </div>
      </div>
      <div>
        <Button shape="round" size="large" @click="stepValue=stepValue-1;isClose=false" v-if="stepValue>0">
          上一步
        </Button>&nbsp;&nbsp;
        <Button shape="round" size="large" @click="startBill" v-if="!isClose">
          下一步
        </Button>
        <Button type="primary" shape="round" size="large" @click="startBill" v-if="isClose">
          保存
        </Button>&nbsp;&nbsp;
        <Button shape="round" size="large" @click="stepValue=0;isClose=false" v-if="isClose">
          放弃
        </Button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {CarryOutOutlined} from '@ant-design/icons-vue';
import {Avatar, Button, Input, message, Rate, Select, Spin, Steps,DatePicker,Radio,Checkbox,Row,Col} from "ant-design-vue";
import {onMounted, reactive, ref} from "vue";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {useMessage} from "/@/hooks/web/useMessage";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {
  findStockPeriodLatest,
  findStockPeriodTree,
  closeBillStock as closeBill, periodAllList,
} from "/@/api/record/group/im-unit";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useUserStore} from "/@/store/modules/user";
import {useAccvoucherStoreWidthOut} from "/@/store/modules/accvoucher";
import {BasicTable, useTable} from "/@/components/Table";
import {useRoute} from "vue-router";

const Step = Steps.Step
const InputSearch = Input.Search
const SelectOption = Select.Option
const CheckboxGroup = Checkbox.Group
const RadioGroup = Radio.Group

const props = defineProps(['modelValue'])
const windowHeight = (window.innerHeight - (280))
/*列表逻辑*/
const {
  createErrorModal,
  createSuccessModal,
  createConfirm
} = useMessage()


const {closeCurrent} = useTabs(router);
const rateValue = ref(5)
const stepValue = ref(0)
const isClose = ref(false)

const indicator = ref(false)

const currMonth = ref('12')
const yearList = ref([])
const currId = ref('')
const userId = useUserStore().getUserInfo.id
const dynamicTenantId:any = ref('')
const dynamicAccId:any = ref('')
const accountId = ref('')
const dynamicYear:any = ref('')
const managementCode = ref('')
const tipText = ref('')
const faAccountList = ref([])
const month:any = ref('')
const fromItems:any = ref({})

const YSD:any = ref(true)
const SKD:any = ref(true)
const XHD:any = ref(true)
const XSFP:any = ref(true)

const WZDYSD:any = ref(true)
const WZDSKD:any = ref(true)
const WZDXHD:any = ref(true)
const WZDXSFP:any = ref(true)

const SJHZYSD:any = ref(true)
const SJHZSKD:any = ref(true)
const SJHZXHD:any = ref(true)
const SJHZXSFP:any = ref(true)

const WSHYSD:any = ref(true)
const WSHSKD:any = ref(true)
const WSHXHD:any = ref(true)
const WSHXSFP:any = ref(true)

const dynamicAdReload = async (obj) => {
  dynamicTenantId.value = obj.accountMode
  managementCode.value = obj.managementCode
  accountId.value = obj.target.id
  if ( managementCode.value == '') {
    message.warning('请先建立该公司下资产账后进行操作！')
  }else {
    await loadYears()
  }
  await reloadTable2()
}

const route = useRoute();
const routemsg:any = ref(route.query);
const arHexiaoAuto:any = ref('')
const arSourceFlag:any = ref('')
const arCheckFlag:any = ref('')
onMounted(async() => {
  dynamicTenantId.value = routemsg.value.dynamicTenantId
  dynamicYear.value = routemsg.value.iyear
  arHexiaoAuto.value = routemsg.value.arHexiaoAuto
  arSourceFlag.value = routemsg.value.arSourceFlag
  arCheckFlag.value = routemsg.value.arCheckFlag
  await reloadTable2()
})

const dateList:any = ref([])
async function loadYears(){
  yearList.value =  (await findStockPeriodTree({id: accountId.value})) || []
  // 获取最新未结账月
  if (yearList.value.length > 0){
    dateList.value = await periodAllList({id: accountId.value});
    let res = (await findStockPeriodLatest({id: accountId.value,action: '0'}))
    dynamicYear.value = res.stockYear
    currMonth.value = res.stockYear+'.'+res.stockMonth
    month.value = currMonth.value
    currId.value = res.id
  }
}

/*const columns = [
  {
    title: '结转类型',
    dataIndex: 'billStyle',
    align: 'left',
    ellipsis: true,
  }
]*/

// 这是示例组件
/*const [registerTable, {reload,getColumns,getDataSource,setTableData,setPagination}] = useTable({
  columns: columns,
  bordered: true,
  showIndexColumn: true,
  pagination: false,
})*/

/*const tableData:any = ref([])
function reloadTable(){
  tableData.value = [{
    key: 'YSD',
    billStyle: '上年未核销完成的应收单结转'
  },{
    key: 'SKD',
    billStyle: '上年未完成的收款单结转'
  }]
  setTableData(tableData.value)
}*/

//选中内容
/*const state = reactive<{
  selectedRowKeys: [];
  loading: boolean;
}>({
  selectedRowKeys: [], // Check here to configure the default column
  loading: false,
});

const checkRow: any = ref([])
const onSelectChange = (selectedRowKeys, row) => {
  // console.log('selectedRowKeys changed: ', row);
  // if(selectedRowKeys.length>0){
  state.selectedRowKeys = selectedRowKeys;
  checkRow.value = row
  // }
};*/

/*const columns1 = [
  {
    title: '数据项名称',
    dataIndex: 'columnName',
    align: 'left',
    ellipsis: true,
  }
]*/

// 这是示例组件
/*const [registerTable1, {
  reload:reload1,
  getColumns:getColumns1,
  getDataSource:getDataSource1,
  setTableData:setTableData1,
  setPagination:setPagination1,
}] = useTable({
  columns: columns1,
  bordered: true,
  showIndexColumn: true,
  pagination: false,
})*/

/*const tableData1:any = ref([])
function reloadTable1(){
  tableData1.value = [{
    key: '1',
    columnName: '单据类型'
  },{
    key: '2',
    columnName: '业务类型'
  },{
    key: '3',
    columnName: '单据日期'
  },{
    key: '4',
    columnName: '币种'
  },{
    key: '5',
    columnName: '账号'
  },{
    key: '6',
    columnName: '出库类别'
  },{
    key: '7',
    columnName: '入库类别'
  },{
    key: '8',
    columnName: '部门'
  },{
    key: '9',
    columnName: '往来单位'
  },{
    key: '10',
    columnName: '进货单与入库单合并'
  },{
    key: '11',
    columnName: '相同科目合并'
  },{
    key: '12',
    columnName: '项目科目合并时，摘要不同也合并'
  }]
  setTableData1(tableData1.value)
}*/

//选中内容
/*const state1 = reactive<{
  selectedRowKeys: [];
  loading: boolean;
}>({
  selectedRowKeys: [], // Check here to configure the default column
  loading: false,
});

const checkRow1: any = ref([])
const onSelectChange1 = (selectedRowKeys, row) => {
  // console.log('selectedRowKeys changed: ', row);
  // if(selectedRowKeys.length>0){
  state1.selectedRowKeys = selectedRowKeys;
  checkRow1.value = row
  // }
};*/

const columns2 = [
  {
    title: '合并号',
    dataIndex: 'num',
    width: 60,
    ellipsis: true,
  },{
    title: '单据类型',
    dataIndex: 'billStyle',
    width: 100,
    align: 'left',
    ellipsis: true,
  },{
    title: '业务类型',
    dataIndex: 'busStyle',
    width: 100,
    align: 'left',
    ellipsis: true,
  },{
    title: '单据日期',
    dataIndex: 'ddate',
    width: 100,
    align: 'left',
    ellipsis: true,
  },{
    title: '单据编号',
    dataIndex: 'ccode',
    width: 100,
    align: 'left',
    ellipsis: true,
  },{
    title: '金额',
    dataIndex: 'isum',
    width: 150,
    align: 'left',
    ellipsis: true,
  },{
    title: '部门名称',
    dataIndex: 'deptName',
    width: 200,
    align: 'left',
    ellipsis: true,
  },{
    title: '人员名称',
    dataIndex: 'psnName',
    width: 150,
    align: 'left',
    ellipsis: true,
  },{
    title: '往来单位',
    dataIndex: 'wldw',
    // width: 200,
    align: 'left',
    ellipsis: true,
  }
]

// 这是示例组件
const [registerTable2, {
  reload:reload2,
  getColumns:getColumns2,
  getDataSource:getDataSource2,
  setTableData:setTableData2,
  setPagination:setPagination2,
}] = useTable({
  columns: columns2,
  bordered: true,
  showIndexColumn: true,
  pagination: false,
})

const tableData2:any = ref([])
function reloadTable2(){
  tableData2.value = []
  for (let i = 0; i < 20; i++) {
    tableData2.value.push({
      num: i+1
    })
  }
  setTableData2(tableData2.value)
}

//选中内容
const state2 = reactive<{
  selectedRowKeys: [];
  loading: boolean;
}>({
  selectedRowKeys: [], // Check here to configure the default column
  loading: false,
});

const checkRow2: any = ref([])
const onSelectChange2 = (selectedRowKeys, row) => {
  // console.log('selectedRowKeys changed: ', row);
  // if(selectedRowKeys.length>0){
  state2.selectedRowKeys = selectedRowKeys;
  checkRow2.value = row
  // }
};

const startBill = async () => {
  indicator.value = true
  if (isClose.value){ // 点击保存
    // 保存凭证
    stepValue.value = 0
    isClose.value = false
  }else {
    // 点击下一步
    stepValue.value += 1
    if (stepValue.value==3){
      //查询上一年的数据
      //应收单
      if (YSD.value) {}
      //收款单
      if (SKD.value) {}
      //销货单
      if (XHD.value && arCheckFlag.value!='1') {}
      //销售发票
      if (XSFP.value && arCheckFlag.value=='1') {}
      isClose.value = true
    } else {
      isClose.value = false
    }
  }
}
const getCurrTip = (k) => {
  let text = ''
  switch (k) {
    case '1':
      text = '单据类型';
      break;
    case '2':
      text = '单据范围';
      break;
    case '3':
      text = '生单规则';
      break;
    case '4':
      text = '生成凭证';
      break;
    case '5':
      text = '保存凭证';
      break;
    default:
      break
  }
  return text
}

</script>
<style src="./global-menu-index.less" lang="less" scoped="scoped"></style>
<style lang="less" scoped>
.nci-hr {
  padding: 10px;

  .nc-hr-top {
    font-weight: bold;
    color: white;
    height: 120px;
    width: 100%;
    background-color: #146dc1;
    display: inline-flex;
    justify-content: space-between;
    padding: 1.2% 5%;

    > div {
      display: inline-flex;
      justify-content: space-between;
    }

    .nc-hr-top-left {
      width: 320px;

      > div:nth-of-type(1) {
        width: 80px;
        height: 80px;
        border-radius: 50%;

        .ant-avatar {
          background-color: white;
        }
      }

      > div:nth-of-type(2) {
        padding: 4%;

        span:nth-of-type(1) {
          font-size: 22px;

        }
      }
    }

    .nc-hr-top-right {
      width: 360px;
      padding: 1% 0;

      > div:nth-of-type(1) {
        > span {
          font-size: 13px;
        }
      }

      > div:nth-of-type(2) {
        width: 180px;
        background-color: white;
        height: 50px;
        line-height: 50px;
        border-radius: 5px;
        text-align: center;
        cursor: pointer;
        color: #146dc1;

        > span {
          font-size: 13px;
        }
      }

      > div:nth-of-type(2):hover {
        background-color: #f1f1f1;
        color: rebeccapurple;
      }
    }
  }

  .nc-hr-middle {
    height: 50px;
    margin: .5% 0;
    line-height: 40px;
    background-color: #f1f1f1;
    padding: 5px;
    display: flex;
    justify-content: space-between;
    > div:nth-of-type(1) {
      text-align: left;
      padding: 4px 0px;
      display: flex;
      justify-content: space-between;
      .customize-select-year{
        margin-left: 2em;
        line-height: 32px;
        >span{
          font-weight: bold;
        }
        :deep(.ant-select-selector){
          border: 1px solid #c9c9c9;
          .ant-select-selection-item{
            font-weight: bold;
          }
        }
      }
    }

    > div:nth-of-type(2) {

    }

    .ant-btn {
      border-color: #c9c9c9
    }
  }

  .nc-hrm-body {
    background-color: #f1f1f1;

    > div {
      width: 100%;
      //height: 150px;
      padding: 1% 5%;
      text-align: center;
    }

    > div:nth-of-type(1) {
      font-size: 16px;
      font-weight: bold;

      span:nth-of-type(1) {
        //color: #666666;
      }
    }

    > div:nth-of-type(2) {
      //border: 1px solid #000000;
      font-weight: bold;
    }

    > div:nth-of-type(3) {
      text-align: center;
    }
    .step-div{
      font-size: 12px;
      .span-green{
        color: green;
      }
      .span-red{
        color: red;
      }
    }

    :deep(.vben-basic-table) {
      .ant-table-wrapper {
        .ant-table-measure-row{
          td{
            padding: 0!important;
          }
        }
      }
    }
    .a-table-font-size-12 :deep(td),
    .a-table-font-size-12 :deep(th) {
      font-size: 13px !important;
      padding: 2px 8px !important;
      border-color: #aaaaaa !important;
    }
  }
  :deep(.ant-table-thead) th{
    text-align: center !important;
    font-weight: bold;
    //background-color: #f2f2f2 !important;
    background-color: #cccccc !important;
    border-color: #aaaaaa !important;
  }

  :deep(.vben-basic-table) .ant-table-wrapper {
    padding: 0px;
    border-color: #aaaaaa !important;
  }

  :deep(.vben-basic-table) .ant-table {
    width: 100%;
    margin: 0;
    overflow-x: hidden;
    border-color: #aaaaaa !important;
  }

  :deep(.nc-open-content) {
    input {
      width: 30%;
      border: none !important;
      border-bottom: 1px solid #bdb9b9 !important;
      font-weight: bold;
      font-size: 14px;
    }

    .abc{
      border-bottom: 2px solid #666666 !important;
      font-size: 19px;
    }

    .ant-input:focus {
      box-shadow: none;
    }

    :deep(.ant-select-selector) {
      border: none !important;
      border-bottom: 1px solid #bdb9b9 !important;
    }

    label {
      text-align: right;
      width: 120px;
      display: inline-block;
      padding: 5px 10px;
      //margin-left: 1em;
      color: #535353;
      font-weight: bold;
      font-size: 13px;
    }
  }
}

:deep(.ant-btn-me) {
  color: #0096c7 !important;
  font-size: 14px !important;
}

:deep(.ant-steps-item-finish) > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title{
  color: #0096c7 !important;
}

:deep(.ant-steps-item-active) > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title {
  color: #0096c7 !important;
}

:deep(.acco-sideline){
  position: relative;
  border: 1px #acabab solid;
  width: 1060px;
  margin: 10px 1% 20px;

  > span{
    position: absolute;
    top: -12px;
    left: 50px;
    background: #f1f1f1;
    padding: 0 15px;
  }
  .ant-checkbox-inner,.ant-radio-inner{
    border-color: #4c4c4c !important;
  }
  .acco-sideline-content-one{
    > div{
      width: 45%;
      display: inline-block;
      padding: 10px 50px;
      .ant-select-selector{
        border:none;
        border-bottom: 1px slategrey solid;
      }
      .ant-select-disabled  .ant-select-selector{
        background: white;
        color: black;
      }
      .against-input-mark{
        border:none;
        border-bottom: 1px slategrey solid;
        background-color: white;
        color: black;
      }
    }
  }
  .acco-sideline-content-two{
    width: 100%;
    margin: 20px 50px;
    .ant-row{
      .ant-col{
        margin: 10px 0;
        .ant-checkbox-wrapper-disabled{
          > span{
            color: black;
          }
        }
      }
    }
  }
  .acco-sideline-content-there{
    width: 100%;
    margin: 20px 50px;
    text-align: left;
    ul{
      li{
        padding: 5px 0;
        .ant-radio-group{
          width: 80%;
          .ant-radio-wrapper{
            margin: 0 8%;
          }
          .ant-radio-wrapper-disabled{
            > span{
              color: black;
            }
          }
        }
      }
    }
  }
}

</style>
