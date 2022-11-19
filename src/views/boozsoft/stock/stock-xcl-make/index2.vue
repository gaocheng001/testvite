<template>
  <div class="app-container">
    <div class="app-container-top">

      <div class="app-container-head">


        <div class="ant-btn-group" style="float: right">
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="openQuery()"
          ><span>整理</span></button>
        </div>
      </div>

      <div style="clear: none"/>
      <div style="margin-top: -30px;margin-left: 80px;">
        <div style="display: inline-block;float: left;margin-left: 1%;margin-top: -30px;">
        </div>
        <div style="clear: both;"></div>

        <div style="float: right; margin-left: 10px">
          <Button class="ant-btn-me">
          </Button>
<!--          <Button>
            <UsbOutlined :style="{ fontSize: '14px' }"/>
          </Button>
          <Button class="ant-btn-me">
            <PrinterOutlined :style="{ fontSize: '14px' }"/>
          </Button>-->
        </div>
        <div style="float: right; position: relative">

        </div>
      </div>

      <div style="clear:both"/>

    </div>
    <div class="app-container-bottom">

    </div>
    <Query @save="saveQuery" @register="registerQueryPage"/>
    <StockInfiModalPop @register="registerStockInfoModalPage" @throwData="modalData"/>
  </div>
</template>
<script setup="props, {emit}" lang="ts">
import { useModal } from '/@/components/Modal'
import {onMounted, reactive, ref} from 'vue'
import {
  SettingFilled,
  SyncOutlined,
  PicLeftOutlined,
  SortDescendingOutlined,
  CheckOutlined,
  SortAscendingOutlined,
  EditOutlined,
  BarChartOutlined,
} from '@ant-design/icons-vue'
import {
  Select,
  Input,
  Popover,
  Button,
  Tag,
  message,
  Checkbox as ACheckbox,
  Radio as ARadio,
  Table as ATable,
  Popconfirm as APopconfirm,
} from 'ant-design-vue'
import {useMessage} from "/@/hooks/web/useMessage";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {findOption} from "/@/api/record/stock/stock-option";
import Query from './popup/query.vue'

const InputSearch = Input.Search
const SelectOption = Select.Option
const ARadioButton = ARadio.Button
const ARadioGroup = ARadio.Group

const {
  createSuccessModal,
  createErrorModal,
  createWarningModal,
  createConfirm
} = useMessage()


const formItems = ref({
  selectType: '1'
})

const [registerQueryPage, {openModal: openQueryPage}] = useModal()
//文件导入
const val = ref({
  openOne: 0,
  total: 0
})
const openQuery = async () => {
  val.value.openOne = 0
  openQueryPage(true, {
    data: val
  })
}

async function saveQuery(data) {

}


onMounted( ()=>{
  val.value.openOne = 0
  openQueryPage(true, {
    data: val
  })
})



</script>
<style lang="less" scoped>
@import '/@/assets/styles/global-menu-index.less';
</style>
<style scoped lang="less">
:deep(.ant-card-body) {
  padding: 16px;
  border-left: 2px solid rgb(1, 143, 251);
  box-shadow: rgb(72 113 140) -3px 1px 7px -1px;
}

.a-table-font-size-16 :deep(td),
.a-table-font-size-16 :deep(th) {
  font-size: 16px !important;
  padding: 5px 8px !important;
  border-color: #aaaaaa !important;
  font-weight: 550;
}

.a-table-font-size-12 :deep(td),
.a-table-font-size-12 :deep(th) {
  font-size: 13px !important;
  padding: 2px 8px !important;
  border-color: #aaaaaa !important;
  font-weight: 600;
}

.app-container {
  background-color: #f2f2f2;
  padding: 0px;
  margin: 10px 10px 0;
}


.app-container-bottom {

  :deep(.nc-summary) {
    font-size: 14px;
    font-weight: bold;
    width: 100%;
    > div {
      background-color: #d8d8d8;
      padding: 1px;
      width: 15%;
      margin: 0 1px;
      display: inline-flex;
      justify-content: space-between;
    }
    > div:nth-of-type(1) {
      width: 54%;
      display: inline-block;
      text-align: center;
    }
  }

  :deep(.ant-table-footer) {
    padding: 0px 0px;
  }

  :deep(.vben-basic-table .ant-pagination ) {
    margin: 0px 0 0;
  }
}

</style>
