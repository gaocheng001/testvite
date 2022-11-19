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
          <span>记账凭证</span><br/>
          <span>业务单据生成总账模块记账凭证</span>
        </div>
      </div>
      <div style="line-height: 75px;">
        <span style="font-size: 32px;">业务单据凭证制单</span>
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
        <AccountPicker theme="three" :readonly="stepValue==0" @reloadTable="dynamicAdReload"/>
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
      <div><span>生单业务期间：</span>
        <span>
          <Select
            v-model:value="month"
            show-search
            :disabled="dateselflg"
            style="width: 100px"
            @focus="focusEndDate"
            @change="handleChangeEndDate"
          >
            <SelectOption
              v-for="item in dateList"
              :value="item.stockYear+'-'+item.stockMonth"
              :disabled="item.stoclFlag=='1'"
            >
              {{ item.stockYear+'-'+item.stockMonth }}
            </SelectOption>
          </Select>
        </span>
      </div>
      <div>
        <Steps :current="stepValue" status="success">
          <Step title="单据类型" description=""/>
          <Step title="单据范围" description=""/>
          <Step title="生单规则" description=""/>
          <Step title="生成凭证" description=""/>
          <Step title="保存凭证" description=""/>
        </Steps>
      </div>
      <div style="height: 400px;">
        <div v-show="stepValue==0">
          <!--          <BasicTable
                      :row-selection="{ type: 'checkbox', selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
                      @register="registerTable"
                      :dataSource="tableData"
                      class="a-table-font-size-12"
                      style="width: 300px;"
                    >
                    </BasicTable>-->
          <div class="acco-sideline">
            <span>单据类型</span>
            <div class="acco-sideline-content-there">
              <Row>
                <Col :span="12">
                  <Checkbox v-model:checked="XHD">
                    销货单
                  </Checkbox>
                </Col>
                <Col :span="12">
                  <Checkbox v-model:checked="XSCKD">
                    销售出库单
                  </Checkbox>
                </Col>
                <br/><br/>
                <Col :span="12">
                  <Checkbox v-model:checked="CGRKD">
                    采购入库单
                  </Checkbox>
                </Col>
                <Col :span="12">
                  <Checkbox v-model:checked="JHD">
                    进货单
                  </Checkbox>
                </Col>
                <br/><br/>
                <Col :span="12">
                  <Checkbox v-model:checked="HZHCD">
                    红字回冲单
                  </Checkbox>
                </Col>
                <Col :span="12">
                  <Checkbox v-model:checked="LZHCD">
                    蓝字回冲单
                  </Checkbox>
                </Col>
                <br/><br/>
                <Col :span="12">
                  <Checkbox v-model:checked="CCPRKD">
                    产成品入库单
                  </Checkbox>
                </Col>
                <Col :span="12">
                  <Checkbox v-model:checked="CLCKD">
                    材料出库单
                  </Checkbox>
                </Col>
                <br/><br/>
                <Col :span="12">
                  <Checkbox v-model:checked="QTRKD">
                    其他入库单
                  </Checkbox>
                </Col>
                <Col :span="12">
                  <Checkbox v-model:checked="QTCKD">
                    其他出库单
                  </Checkbox>
                </Col>
                <br/><br/>
                <Col :span="12">
                  <Checkbox v-model:checked="DBD">
                    调拨单
                  </Checkbox>
                </Col>
                <Col :span="12">
                  <Checkbox v-model:checked="RKTZD">
                    入库调整单
                  </Checkbox>
                </Col>
              </Row>
            </div>
          </div>
        </div>
        <div class="nc-open-content" style="background-color: #f1f1f1;margin-left: 5%;padding: 5px 10px;width: 800px;text-align: left;" v-show="stepValue==1">
          <label>单据日期：</label>
          <DatePicker v-model:value="fromItems.date1" style="width: 120px;" format="YYYY-MM-DD" value-format="YYYY-MM-DD" /> ~
          <DatePicker v-model:value="fromItems.date2" style="width: 120px;" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
          <label>单据编号：</label>
          <Input v-model:value="fromItems.ccode1" style="width: 120px;" /> ~
          <Input v-model:value="fromItems.ccode2" style="width: 120px;" />
          <br/>
          <label>出库类别：</label>
          <Input v-model:value="fromItems.ckType" style="width: 255px;" />
          <label>入库类别：</label>
          <Input v-model:value="fromItems.rkType" style="width: 255px;" />
          <br/>
          <label>仓库：</label>
          <Input v-model:value="fromItems.cangku" style="width: 255px;" />
          <label>项目分类：</label>
          <Input v-model:value="fromItems.projectClass" style="width: 255px;" />
          <br/>
          <label>项目：</label>
          <Input v-model:value="fromItems.project" style="width: 255px;" />
          <label>存货分类：</label>
          <Input v-model:value="fromItems.cunhuoClass" style="width: 255px;" />
          <br/>
          <label>存货：</label>
          <Input v-model:value="fromItems.cunhuo1" style="width: 120px;" /> ~
          <Input v-model:value="fromItems.cunhuo2" style="width: 120px;" />
          <label>部门：</label>
          <Input v-model:value="fromItems.dept" style="width: 255px;" />
          <br/>
          <label>人员：</label>
          <Input v-model:value="fromItems.psn" style="width: 255px;" />
          <label>往来单位分类：</label>
          <Input v-model:value="fromItems.wldwClass" style="width: 255px;" />
          <br/>
          <label>往来单位：</label>
          <Input v-model:value="fromItems.wldw" style="width: 255px;" />
          <label>收入：</label>
          <Input v-model:value="fromItems.shouru" style="width: 255px;" />
          <br/>
          <label>费用：</label>
          <Input v-model:value="fromItems.feiyong" style="width: 255px;" />
          <label>账号：</label>
          <Input v-model:value="fromItems.zhanghao" style="width: 255px;" />
          <br/>
          <label>结算方式：</label>
          <Input v-model:value="fromItems.jiesuan" style="width: 255px;" />
          <label>采购入库单：</label>
          <Input v-model:value="fromItems.hesuan" style="width: 255px;" />
        </div>
        <div style="width: 400px;" v-show="stepValue==2">
          <!--          <label style="font-weight: bold;">选择凭证合并规则</label>
                    <BasicTable
                      :row-selection="{ type: 'checkbox', selectedRowKeys: state1.selectedRowKeys, onChange: onSelectChange1 }"
                      @register="registerTable1"
                      :dataSource="tableData1"
                      class="a-table-font-size-12"
                      style="width: 400px;"
                    >
                    </BasicTable>-->
          <div class="acco-sideline">
            <span>合并规则</span>
            <div class="acco-sideline-content-there">
              <Row>
                <Col :span="12">
                  <Checkbox v-model:checked="DJLX">
                    单据类型
                  </Checkbox>
                </Col>
                <Col :span="12">
                  <Checkbox v-model:checked="YELX">
                    业务类型
                  </Checkbox>
                </Col>
                <br/><br/>
                <Col :span="12">
                  <Checkbox v-model:checked="DJRQ">
                    单据日期
                  </Checkbox>
                </Col>
                <Col :span="12">
                  <Checkbox v-model:checked="BZ">
                    币种
                  </Checkbox>
                </Col>
                <br/><br/>
                <Col :span="12">
                  <Checkbox v-model:checked="ZH">
                    账号
                  </Checkbox>
                </Col>
                <Col :span="12">
                  <Checkbox v-model:checked="CKLB">
                    出库类别
                  </Checkbox>
                </Col>
                <br/><br/>
                <Col :span="12">
                  <Checkbox v-model:checked="RKLB">
                    入库类别
                  </Checkbox>
                </Col>
                <Col :span="12">
                  <Checkbox v-model:checked="BM">
                    部门
                  </Checkbox>
                </Col>
                <br/><br/>
                <Col :span="12">
                  <Checkbox v-model:checked="WLDW">
                    往来单位
                  </Checkbox>
                </Col>
                <Col :span="12">
                  <Checkbox v-model:checked="JHDYCKD">
                    进货单与入库单合并
                  </Checkbox>
                </Col>
                <br/><br/>
                <Col :span="12">
                  <Checkbox v-model:checked="KM">
                    相同科目合并
                  </Checkbox>
                </Col>
                <Col :span="12">
                  <Checkbox v-model:checked="XM">
                    项目科目合并时，摘要不同也合并
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
        <div v-show="stepValue==4">
        </div>
      </div>
      <div>
        <!--  :disabled="!isClose"      -->
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
import {reactive, ref} from "vue";
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
const stepModel = ref({
  '1': {
    cg: {finish: false,number: 0},
    qtr: {finish: false,number: 0},
  },
  '2':{
    db: {finish: false,number: 0},
  },
  '3':{
    xt: {finish: false,number: 0},
  },
  '4':{
    pd: {finish: false,number: 0},
  },
  '5':{
    ck: {finish: false,number: 0},
    cl: {finish: false,number: 0},
    qtc: {finish: false,number: 0},
  },
  '6':{
    jh: {finish: false,number: 0},
    wl: {finish: false,number: 0},
  }
})
const indicator = ref(false)

const currMonth = ref('12')
const yearList = ref([])
const currId = ref('')
const userId = useUserStore().getUserInfo.id
const dynamicTenantId = ref('')
const accountId = ref('')
const dynamicYear = ref('')
const managementCode = ref('')
const tipText = ref('')
const faAccountList = ref([])
const month:any = ref('')
const fromItems:any = ref({})

const dynamicAdReload = async (obj) => {
  dynamicTenantId.value = obj.accountMode
  // dynamicYear.value = obj.managementYear
  managementCode.value = obj.managementCode
  accountId.value = obj.target.id
  if ( managementCode.value == '') {
    message.warning('请先建立该公司下资产账后进行操作！')
  }else {
    await loadYears()
  }
  await reloadTable()
  await reloadTable1()
  await reloadTable2()
}

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
    title: '单据类型',
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

const tableData:any = ref([])
function reloadTable(){
  tableData.value = [{
    key: 'XHD',
    billStyle: '销货单'
  },{
    key: 'XSCKD',
    billStyle: '销售出库单'
  },{
    key: 'CGRKD',
    billStyle: '采购入库单'
  },{
    key: 'JHD',
    billStyle: '进货单'
  },{
    key: 'HZHCD',
    billStyle: '红字回冲单'
  },{
    key: 'LZHCD',
    billStyle: '蓝字回冲单'
  },{
    key: 'CCPRKD',
    billStyle: '产成品入库单'
  },{
    key: 'CLCKD',
    billStyle: '材料出库单'
  },{
    key: 'QTRKD',
    billStyle: '其他入库单'
  },{
    key: 'QTCKD',
    billStyle: '其他出库单'
  },{
    key: 'DBD',
    billStyle: '调拨单'
  },{
    key: 'RKTZD',
    billStyle: '入库调整单'
  }]
}

//选中内容
const state = reactive<{
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
};

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

const tableData1:any = ref([])
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
}

//选中内容
const state1 = reactive<{
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
};

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
    /*let date = currMonth.value.replace('.', '-')
    let types = []
    let keys = Object.keys(stepModel.value)
    keys.map(k => types.push(...(Object.keys(stepModel.value[k]))))
    let res = await useRouteApi(closeBeforeCheck, {schemaName: dynamicTenantId})({
      date: date,
      types: types.join()
    })
    new Promise((resolve, reject) => {
      for (let i = 0; i <= keys.length; i++) {
        setTimeout(() => {
          tipText.value = getCurrTip((i+1) + '')
          stepValue.value += 1
          if (i!=0)
            for (let l of Object.keys(stepModel.value[(i) + ''])){
              let d =  res[l]
              d.finish = d.finish=='true'
              stepModel.value[(i) + ''][l] = d
            }
          if (i == 6)resolve('')

        }, (i + 1) * 2000)
      }
    }).then((i) => {
        // 校验最终结果
      tipText.value = ''
      indicator.value = false
      types = []
      keys.map(k => types.push(...(Object.values(stepModel.value[k]).map(it=>it.finish))))
      stepValue.value += 1
      isClose.value = types.filter(s=>!s).length == 0 // 可以完成结账
    }).catch((i) => {

    })*/
    stepValue.value += 1
    if (stepValue.value==4){
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
  width: 800px;
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
