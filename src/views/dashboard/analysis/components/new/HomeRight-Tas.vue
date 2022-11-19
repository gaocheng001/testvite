<template>
  <div class="nc-hr">
    <div class="nc-hr-top">
      <div class="nc-hr-top-one">
        <div>
          <AccountPicker theme="one" @reloadTable="reloadTable"/>
        </div>
        <div><span style="font-weight: bold;font-size: 22px;color: #0096c7;">数据导入</span></div>
        <div style="width: 30%;text-align: right;">
          <Button>导入</Button>
          <Button style="border-left: none;">模板下载</Button>
          <Button style="border-left: none;">退出</Button>
        </div>
      </div>
      <div class="nc-hr-top-two">
        <div>
          <span>数据类型：</span>
          <Select value="档案/期初数/单据" style="width: 250px;text-align: center"></Select>
        </div>
        <div>
          <Select value="编码"/>
          <InputSearch placeholder=""
                       style="width: 200px; border-radius: 4px;border-color: #c9c9c9;margin-right: 1em;"/>
          <Button @click="reload()">
            <SyncOutlined :style="{ fontSize: '14px' }"/>
          </Button>
          <Button>
            <FilterFilled :style="{ fontSize: '14px' }"/>
          </Button>
        </div>
      </div>
    </div>
    <div class="nc-hrm-body" :style="{maxHeight: windowHeight+'px'}">
      <div class="nc-hr-body-tags">
        <Tabs
          v-model:activeKey="activeKey"
          tab-position="top"
          type="card"
          :style="{ height: '50px',width: '100%',display: 'inline-flex' }">
          <TabPane v-for="i in 30" :key="i" :tab="`Tab-${i}`"></TabPane>
        </Tabs>
      </div>
      <div class="nc-hr-body-basic">
        <div class="body-basic-left">
          <div>
            <Button type="primary">下载模板</Button>
          </div>
          <div>
            <ul>
              <li>档案列表</li>
              <li>
                <MenuOutlined/>&emsp;显示全部
              </li>
              <li>
                <CheckOutlined/>&emsp;模板校验
              </li>
              <li>
                <DeleteFilled/>&emsp;取消选择
              </li>
            </ul>
            <Divider/>
          </div>
          <div>
            <Input placeholder="搜索档案名称"/>
          </div>
        </div>
        <div class="body-basic-right">
          <BasicTable
            :loading="loadMark"
            :row-selection="{ type: 'radio',selectedRowKeys: tableSelectedRowKeys, onChange: onSelectChange }"
            class="alone-basic-table"
            @register="registerTable"
            size="small">
            <template #fileOperate="{ record }">
              <Button size="small" type="primary" :disabled="tableSelectedRowKeys.indexOf(record.key) == -1">选择上传文件</Button><span>text.xls</span>
            </template>
          </BasicTable>
        </div>
      </div>
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
  OneToOneOutlined, MenuOutlined, CheckOutlined, DeleteFilled,
  ReconciliationOutlined, UnlockFilled, SyncOutlined, FilterFilled
} from '@ant-design/icons-vue';
import {
  Input, Select, Button,
  Tag, DatePicker as ADatePicker, Avatar,
  Steps, Rate, message, Tabs, Divider
} from "ant-design-vue";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker.vue";
import {onMounted, reactive, ref} from "vue";

const Step = Steps.Step
const InputSearch = Input.Search
const SelectOption = Select.Option
const TabPane = Tabs.TabPane
const props = defineProps(['modelValue'])
const windowHeight = (window.innerHeight - (230))
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
const activeKey = ref('1')
const totalColumnWidth = ref(0)
const tableSelectedRowKeys = ref([])
const tableSelectedRowObjs = ref([])
const pageParameter = reactive({
  searchValue: '',
  accGroup: '',
  overtime: '0'
})
const CrudApi = {
  list: getTaskList,
  columns: [
    {
      title: '下载模板名称',
      dataIndex: 'companyName',
      ellipsis: true,
      width: 300,
      align: 'left',

    },
    {
      title: '请选择文件',
      dataIndex: 'fileOperate',
      ellipsis: true,
      width: 400,
      slots: {customRender: 'fileOperate'}
    },
  ]
}
// 这是示例组件
const [registerTable, {reload, getDataSource}] = useTable({
  api: CrudApi.list,
  columns: CrudApi.columns,
  bordered: true,
  showIndexColumn: false,
  pagination: {
    pageSize: 50,
    showSizeChanger: true,
    pageSizeOptions: ['50', '100', '200'],
    showTotal: t => `总共${t}条数据`
  },
  searchInfo: pageParameter
})

async function delList() {
  let num = 0
  if (tableSelectedRowObjs.value.length > 0) {
    tableSelectedRowObjs.value.forEach(
      function (item) {
        if (item.state == 1) {
          num++
        }
      }
    )
    if (num > 0) {
      createConfirm({
        iconType: 'warning',
        title: '清除任务',
        content: '清除任务可能会影响当前用户的正常操作，确定要清除吗?',
        onOk: async () => {
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
onMounted(async () => {

})
const reloadTable = async (e) => {

}
/*列表逻辑*/

</script>
<style lang="less" scoped>
.nc-hr {
  .nc-hr-top {
    height: 90px;
    padding: 5px 10px;
    background-color: #f1f1f1;

    > div {
      width: 100%;
      display: inline-flex;
      justify-content: space-between;
    }

    .nc-hr-top-one {
      .ant-btn {
        border-color: #c9c9c9
      }
    }

    .nc-hr-top-two {
      margin-top: 0.8%;

      > div:nth-of-type(1) {
        >span{
          color: #666666;
          font-weight: bold;
        }
        :deep(.ant-select-selector) {
          border: none;
          background-color: #f1f1f1;
          border-bottom: 1px solid #c9c9c9;
          .ant-select-selection-item{
            font-weight: bold;
            color: black;
          }
        }
      }

      > div:nth-of-type(2) {
        :deep(.ant-select-selector) {
          border-color: #c9c9c9;
          border-radius: 4px;
          width: 120px;
        }
        .ant-btn {
          border-color: #c9c9c9;
          margin-left: 2px;
        }
      }
    }
  }

  .nc-hrm-body {
    margin: .5% 0;
    height: calc(100% - 50px);
    background-color: white;
    overflow-y: auto;

    .nc-hr-body-tags {
      display: list-item;
      height: 40px;
      line-height: 40px;
      padding: 0;

      :deep(.ant-tabs) {
        .ant-tabs-nav-list {
          border-bottom: 2px solid #0096c7;

          .ant-tabs-tab-active {
            border-top: 3px solid #0096c7;
          }
        }
      }
    }

    .nc-hr-body-basic {
      height: calc(100% - 40px);
      background-color: white;
      padding: 1% 0;

      > div {
        display: inline-block;
      }

      .body-basic-left {
        width: 300px;
        height: 100%;
        text-align: center;

        > div {
          width: 80%;
          margin: 0 10%;
        }

        > div:nth-of-type(1) {
          .ant-btn {
            width: 100%;
            color: white;
            font-weight: bold;
          }
        }

        > div:nth-of-type(2) {
          padding: 10% 0 5%;
          text-align: left;

          ul {
            li {
              font-weight: bold;
              margin: 4% 0;
            }

            li:not(:nth-of-type(1)):hover {
              background-color: #f1f1f1;
              cursor: pointer;
            }
          }
        }

        > div:nth-of-type(3) {
        }
      }

      .body-basic-right {
        width: calc(100% - 300px);
        height: 100%;
        padding: 5px;
        float: right;
        background-color: #b4c8e3;
      }
    }
  }
}
</style>
<style src="../../../../../assets/styles/alone-basic-table.less" lang="less" scoped></style>
