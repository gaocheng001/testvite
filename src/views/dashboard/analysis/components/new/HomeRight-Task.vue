<template>
  <div class="nc-hr">
    <div class="nc-hr-top">
      <div class="nc-hr-top-left">
        <div>
          <Avatar src="" :size="{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 80 }">
            <UnlockFilled style="font-size: 30px;color: #146dc1;" />
          </Avatar>
        </div>
        <div>
          <span>任务中心</span><br/>
          <span>档案审批、单据审批、预警提现、定期任务管理中心</span>
        </div>
      </div>
      <div class="nc-hr-top-right">
        <div>
          <Rate v-model:value="rateValue" allow-half/>
          <br/>
          <span>单据审批流程自由定制</span>
        </div>
        <div>
          <span>了解任务中心功能</span>
        </div>
      </div>
    </div>
    <div class="nc-hr-middle">
      <div>
        <Button>预警</Button>
        <Button style="border-left: none;" >流程</Button>
        <Button style="border-left: none;" >设置</Button>
        <Button style="border-left: none;" >退出</Button>
      </div>
      <div>
<!--        <span>超过
          <Input v-model:value="overtime.time"  @pressEnter="enterOverTime" style="width: 50px;color: black;text-align: center;height: 25px;border-radius: 2px"/>
          分钟，将设置成异常状态</span>-->
      </div>
      <div>
<!--        <InputSearch placeholder="" style="width: 200px; border-radius: 4px;border-color: #c9c9c9;margin-right: 1em;"/>-->
        <Button @click="reload()">
          <SyncOutlined :style="{ fontSize: '14px' }"/>
        </Button>
        <Button>
          <FilterFilled :style="{ fontSize: '14px' }"/>
        </Button>
      </div>
    </div>
    <div class="nc-hrm-body" :style="{maxHeight: windowHeight+'px'}">
<!--        :row-selection="{ type: 'checkbox',selectedRowKeys: tableSelectedRowKeys, onChange: onSelectChange }"-->
      <BasicTable
        :loading="loadMark"
        class="alone-basic-table"
        @register="registerTable"
        size="small"
      >
        <template #two="{ record }">
          <Button :type="record.two!='0'?'primary':'dashed'" shape="round" style="width: 70px;">
            {{ record.two }}
          </Button>
        </template>
        <template #four="{ record }">
          <Button :type="record.two!='0'?'primary':'dashed'"  style="width: 100px;">
          进入
          </Button>
        </template>
      </BasicTable>
    </div>
  </div>
</template>
<script setup lang="ts">
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {
  AppstoreOutlined,
  AccountBookOutlined,
  AimOutlined,
  BlockOutlined,
  DollarCircleOutlined,
  EuroOutlined,
  GroupOutlined,
  HddOutlined,
  InsertRowBelowOutlined,
  GatewayOutlined,
  OneToOneOutlined,
  ReconciliationOutlined,UnlockFilled,SyncOutlined,FilterFilled
} from '@ant-design/icons-vue';
import {
  Input, Select, Button,
  Tag, DatePicker as ADatePicker, Avatar,
  Steps, Rate, message
} from "ant-design-vue";
import {onMounted, reactive, ref} from "vue";

const Step = Steps.Step
const InputSearch = Input.Search
const SelectOption = Select.Option
const props = defineProps(['modelValue'])
const windowHeight = (window.innerHeight - (280))
/*列表逻辑*/
import {BasicTable, useTable} from '/@/components/Table'
const {
  createErrorModal,
  createSuccessModal,
  createConfirm
} = useMessage()
import {
  deleteByState,
  deleteList,
  editGroupAccuracyOverTime,
  getTaskList, GroupAccuracyOverTime, saveGroupAccuracyOverTime
} from "/@/api/record/system/task";
import {useMessage} from "/@/hooks/web/useMessage";
const loadMark = ref(false)
const rateValue = ref(4)
const totalColumnWidth = ref(0)
const tableSelectedRowKeys =ref([])
const tableSelectedRowObjs =ref([])
const overtime=reactive({
  id:'',
  time:'30'
})
const pageParameter = reactive({
  searchValue: '',
  accGroup:'',
  overtime:'0'
})
const CrudApi = {
  list: [{one: '基础档案-集团',two: '0',three: '无'},{one: '基础档案-组织',two: '2',three: '无'}], //getTaskList
  columns: [
    {
      title: '任务&预警',
      dataIndex: 'one',
      ellipsis: true,    align:'left',
    },
    {
      title: '数量',
      dataIndex: 'two',
      ellipsis: true,
      align:'center',
      width: 200,slots: { customRender: 'two' }
    },
    {
      title: '审批流',
      dataIndex: 'three',
      ellipsis: true,
      width: 300,
      align:'center'
    },
    {
      title: '操作',
      dataIndex: 'four',
      ellipsis: true,
      width: 300,slots: { customRender: 'four' }
    },
  ]
}
// 这是示例组件
const [registerTable, { reload,getDataSource }] = useTable({
  // api: CrudApi.list,
  dataSource: CrudApi.list,
  columns: CrudApi.columns,
  bordered: true,
  showIndexColumn: false,
  pagination: {
    pageSize: 200,
    showSizeChanger: true,
    pageSizeOptions: ['200', '500', '1000', '1500'],
    showTotal: t => `总共${t}条数据`
  },
  searchInfo: pageParameter
})
async function delList(){
  let num = 0
  if (tableSelectedRowObjs.value.length>0) {
    tableSelectedRowObjs.value.forEach(
      function (item){
        if (item.state==1){
          num++
        }
      }
    )
    if (num>0){
      createConfirm({
        iconType: 'warning',
        title: '清除任务',
        content: '清除任务可能会影响当前用户的正常操作，确定要清除吗?',
        onOk: async() => {
          await deleteList(tableSelectedRowObjs.value)
          reload()
        }
      })
    } else {
      await deleteList(tableSelectedRowObjs.value)
      reload()
    }
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '清除任务',
      content: '请至少选择一条记录进行清除！'
    })
  }
}
async function delState() {
  await deleteByState()
  createSuccessModal({
    iconType: 'success',
    title: '清除异常',
    content: '清除异常成功！'
  })
  reload()
}
const onSelectChange = (selectedRowKeys, obj) => {
    tableSelectedRowObjs.value = obj;
    tableSelectedRowKeys.value = selectedRowKeys;
};
const enterOverTime = async () => {
  if(overtime.time!==''){
    await editGroupAccuracyOverTime(overtime.id,overtime.time)
    message.success('设置成功')
    reload()
  }
}
onMounted(async ()=>{
  let test=await GroupAccuracyOverTime()
  if(test!==''){
    overtime.id=test.id
    overtime.time=test.decimalPlaces
    pageParameter.overtime=test.decimalPlaces
  }else{
    await saveGroupAccuracyOverTime(overtime.time)
  }
  reload()
})
/*列表逻辑*/

</script>
<style lang="less" scoped>
@import '/@/assets/styles/alone-basic-table.less';
.nc-hr {
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
      width: 450px;

      > div:nth-of-type(1) {
        width: 80px;
        height: 80px;
        border-radius: 50%;

        .ant-avatar {
          background-color: white;
        }
      }

      > div:nth-of-type(2) {
        padding:3% 5%;

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

    >div:nth-of-type(1){
      width: 20%;
      text-align: center;
    }
    >div:nth-of-type(2){
      >span{
        color: red;
      }
    }

    .ant-btn{
      border-color: #c9c9c9
    }
  }
  .nc-hrm-body {
    :deep(.alone-basic-table){
      th{
        height: 40px !important;
        line-height: 40px !important;
      }
      tr:not(:first-child){
        td{
          height: 40px !important;
          line-height: 40px !important;
        }
      }
    }
  }
}
</style>
