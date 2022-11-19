<template>
  <div class="nci-hr">
        <!-- 请注释下行，不要删除下行，方便快速定位页面  -->
<!--   <div><textarea>取消结账的页面</textarea>复制内容快速定位页面</div>-->
    <div class="nc-hr-top">
      <div class="nc-hr-top-left">
        <div>
          <Avatar src="" :size="{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 80 }">
            <CarryOutOutlined style="font-size: 30px;color: #146dc1;"/>
          </Avatar>
        </div>
        <div>
          <span>应付款管理</span><br/>
          <span>取消存货管理业务期间结账标志</span>
        </div>
      </div>
      <div style="line-height: 75px;">
        <span style="font-size: 32px;">取消月末结账</span>
      </div>
      <div class="nc-hr-top-right">
        <div>
          <Rate v-model:value="rateValue" allow-half/>
        </div>
        <div>
          <span>了解取消月末结账操作</span>
        </div>
      </div>
    </div>
    <div class="nc-hr-middle">
      <div>
        <AccountPicker theme="three" @reloadTable="dynamicAdReload"/>
        <div class="customize-select-year">
          <span>年度：</span>
          <Select style="width: 80px" v-model:value="dynamicYear" :options="yearList.map(it=>({value:it,label:it}))" @change="yearChange" />
        </div>
      </div>
      <div>

      </div>
      <div>
        <Button class="ant-btn-me" v-show="isClose" @click="startBill">
          取消结账
        </Button>
        <Button class="ant-btn-me" @click="closeCurrent()">
          退出
        </Button>
      </div>
    </div>
    <div class="nc-hrm-body" :style="{maxHeight: windowHeight+'px'}">
      <div>
        <BasicTable
          :class="'alone-basic-table'"
          :clickToRowSelect="false"
          :row-selection="{ type: 'checkbox',selectedRowKeys: tableSelectedRowKeys, onChange: onSelectChange }"
          size="small"
          @register="registerTable"
        >
          <template #iap="{ record }">
            <Tag v-if="record.iap == '1'" color="green">已结账</Tag>
            <Tag v-else color="red">未结账</Tag>
          </template>
        </BasicTable>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {CarryOutOutlined} from '@ant-design/icons-vue';
import {Avatar, Button, Input, message, Rate, Select, Spin, Steps,Tag} from "ant-design-vue";
import {ref} from "vue";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {useMessage} from "/@/hooks/web/useMessage";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {
  findStockPeriodListByYear,
  findStockPeriodTree,
} from "/@/api/record/group/im-unit";
import {useUserStore} from "/@/store/modules/user";
import {useTable,BasicTable} from "/@/components/Table";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {hasBlank} from "/@/api/task-api/tast-bus-api";

const Step = Steps.Step
const InputSearch = Input.Search
const SelectOption = Select.Option
const props = defineProps(['modelValue'])
const windowHeight = (window.innerHeight - (280))
/*列表逻辑*/
const {
  createErrorModal,
  createSuccessModal,
  createConfirm
} = useMessage()


const {closeCurrent} = useTabs(router);
const rateValue = ref(4)
const stepValue = ref(0)
const isClose = ref(false)

const yearList = ref([])
const currId = ref('')
const userId = useUserStore().getUserInfo.id
const dynamicTenantId = ref('')
const accountId = ref('')
const dynamicYear = ref('')
const managementCode = ref('')
const tipText = ref('')

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
}
import {DateTool} from "/@/api/task-api/tools/universal-tools";
import {saveApPeriod, savePeriod} from "/@/api/record/system/ar-ap-period";
async function loadYears(){
  yearList.value =  (await findStockPeriodTree({id: accountId.value})) || []
  // 获取最新未结账月
  if (yearList.value.length > 0){
    if (hasBlank(dynamicYear.value)){
      const businessDate:any = useCompanyOperateStoreWidthOut().getLoginDate;
      dynamicYear.value = yearList.value.indexOf(businessDate.substring(0,4)) != -1?businessDate.substring(0,4):yearList.value[yearList.value.length-1]
    }
    yearChange()
  }
}

const yearChange = async () => {
  let res =  (await findStockPeriodListByYear({id: accountId.value,year: dynamicYear.value})) || []
  if (null == res || res.length == 0){
    message.info('暂未发现数据')
    setTableData([{},{},{},{},{},{},{},{},{},{},{},{}])
    isClose.value = false
  }else {
    const dtool = DateTool()
    let list =  res.map(it=>{
      it['businessDate']=it.stockYear+'.'+it.stockMonth
      it['startDate']=it.stockYear+'-'+it.stockMonth+'-01'
      it['endDate']=it.stockYear+'-'+it.stockMonth+'-'+dtool.getLastDay(it.stockYear,it.stockMonth)
      return it;
    })
    setTableData(list)
    isClose.value = list.filter(it=>it.iar=='1').length>0?true:false
  }
}
const [registerTable, {
  reload,
  getDataSource,
  setTableData,
  setPagination,
  getPaginationRef,
  getColumns,
  setColumns
}] = useTable({
  columns: [{
    title: '结账状态',
    dataIndex: 'iap',
    ellipsis: true, width: 150, align: 'center',
    slots: {customRender: 'iap'},
  },{
    title: '业务日期',
    dataIndex: 'businessDate',
    ellipsis: true, width: 150, align: 'center',
  },{
    title: '开始日期',
    dataIndex: 'startDate',
    ellipsis: true, width: 150, align: 'center',
  },{
    title: '结束日期',
    dataIndex: 'endDate',
    ellipsis: true, width: 150, align: 'center',
  },],
  bordered: true,
  showIndexColumn: true,
  pagination: false,
})

const tableSelectedRowKeys:any = ref([])
const tableSelectedRowObjs:any = ref([])
const onSelectChange = (k, o) => {
  tableSelectedRowKeys.value = k
  tableSelectedRowObjs.value = o
}
const startBill = async () => {
  if (tableSelectedRowObjs.value.length != 1){
    message.success('请选中一条进行取消结账操作！')
  }else if( tableSelectedRowObjs.value[0].iar !='1'){
    message.success('所选未结账不能进行取消结账操作！')
  }else {
    currId.value = tableSelectedRowObjs.value[0].id
    // let e = await closeBill({id: currId.value, value: '0',user: userId})
    let e = await saveApPeriod({id: currId.value, value: '0',user: userId})
    setTimeout(async () => {
      if (null != e) {
        message.success('已成功完成取消结账操作！')
        setTimeout(async () => {
          await yearChange()
        }, 1000)
      }
    }, 2000)
  }

}
</script>
<style lang="less" scoped>
@import '/@/assets/styles/alone-basic-table.less';
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
      width: 400px;

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

    > div {
      background-color: white;
      width: 900px;
      height: auto;
    }


  }
}

.ant-btn-me {
  color: #0096c7;
  font-size: 14px;
}
</style>
