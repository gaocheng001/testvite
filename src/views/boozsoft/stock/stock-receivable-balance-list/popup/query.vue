<template>
  <BasicModal
    width="650px"
    class="spaceLogo"
    v-bind="$attrs"
    @ok="handleOk()"
    @cancel="handleClose()"
    :canFullscreen="false"
    @visible-change="openOrClose"
    @register="register"
    :loading="modelLoadIng"
    :footer="null"
    loadingTip="查询参数初始化中"
  >
    <template #title>
<!--      <div style="display: flex;" class="vben-basic-title">
        <SearchOutlined style="font-size: 34px;color: #0096c7;line-height: 40px"/>
        <span style="line-height:50px;font-size: 30px;color: #0096c7;">&ensp;销售排行榜</span>
      </div>
      <div style="display: inline-block;position:absolute;right: 70px;top: 20px;background:#ffffff">
        <FileSearchOutlined style="font-size: 70px;color: #e7e7e7;"/>
      </div>-->
      <div style="height: 30px;width: 100%;background-color: #5f375c;color: white;line-height: 30px;">
        <AppstoreOutlined  style="margin: 0 2px;font-size: 14px;"/>
        <span style="font-size: 14px">销售管理</span>
      </div>
    </template>
    <div class="nc-open-content" style="height: 100%">
      <div class="con-left">
        <SecondaryTitle :iconType="'query'">客户应收余额表</SecondaryTitle>
        <div class="open-content-up">
          <ul style="width: 100%;display: inline-block;">
            <li>
              <div class="special-border-div">
                <span>业务范围</span>
                <AccountPicker theme="three" @reloadTable="codeChange"/>
              </div>
            </li>
            <li>
              <div class="special-border-div">
                <span>核算条件</span>
                <div style="display: inline-block;width: 96%;">
                  <div >
                    <span class="right_span"><span style="color: red;">*</span>截止日期：</span>
                    <DatePicker  v-model:value="queryModel.variable.expirationDate"
                                 placeholder="截止日期"
                                 format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 250px"/>
                  </div>
                  <div >
                    <span class="right_span">客户分类：</span>
                    <a-select
                      :allowClear="true"
                      show-searchplaceholder=""
                      style="width: 250px"
                      :options="dataMap['custClass']"
                      @change="queryModel.variable.cinvode = ''"
                      v-model:value="queryModel.variable.cvencodeClass"
                    >
                    </a-select>
                    <!--                  <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;" @click="openHeadSelectContent('cinvodeClass')"/>-->
                  </div>
<!--                  <div >
                    <span class="right_span">销售客户：</span>
                    <a-select
                      :allowClear="true"
                      show-searchplaceholder=""
                      style="width: 250px"
                      v-model:value="queryModel.variable.cvencode"
                      @change="xscustChange(true)"
                      :options="dataMap['cust']"
                    >
                    </a-select>
                    <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;" @click="openHeadSelectContent('cvencode')"/>
                  </div>-->
                  <div >
                    <span class="right_span">结算客户：</span>
                    <a-select
                      :allowClear="true"
                      show-searchplaceholder=""
                      style="width: 250px"
                      v-model:value="queryModel.variable.cvencodeJs"
                      @change="xscustChange(false)"
                      :options="dataMap['cust']"
                    >
                    </a-select>
                    <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;" @click="openHeadSelectContent('cvencodeJs')"/>
                  </div>
                  <div >
                    <span class="right_span">单据状态：</span>
                    <a-select
                      :allowClear="true"
                      show-searchplaceholder="全部/已审核/未审核"
                      style="width: 250px;text-align-last: center;"
                      v-model:value="queryModel.variable.bcheck">
                      <a-select-option value="">全部</a-select-option>
                      <a-select-option value="0">未审核</a-select-option>
                      <a-select-option value="1">已审核</a-select-option>
                    </a-select>
                  </div>
                  <div  >
                    <span class="right_span">业务部门：</span>
                    <a-select
                      :allowClear="true"
                      show-searchplaceholder=""
                      style="width: 250px"
                      :options="dataMap['dept']"
                      v-model:value="queryModel.variable.cdepcode"
                    >
                    </a-select>
                    <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;" @click="openHeadSelectContent('cdepcode')"/>
                  </div>
                  <div  >
                    <span class="right_span">业务员：</span>
                    <a-select
                      :allowClear="true"
                      show-searchplaceholder=""
                      style="width: 250px"
                      :options="dataMap['user']"
                      v-model:value="queryModel.variable.cpersoncode"
                    >
                    </a-select>
                    <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;" @click="openHeadSelectContent('cpersoncode')"/>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div  class="con-right right-btns">
        <a-button @click="handleOk" v-if="!modelLoadIng" type="primary" shape="round"  style="width: 100px">开始</a-button>
        <a-button @click="handleClose" shape="round" style="width: 100px;margin-top: 10px">取消</a-button>
      </div>
      <SupperModalPop @throwData="modalData" @register="registerModalPopPage"/>
      <DeptModalPop @register="registerSelectDeptPage" @save="modalData"/>
      <SelectPsn @register="registerSelectPsnPage" @save="modalData"/>

    </div>
<!--    <template #footer>
      <div style="height: 35px">
        <div style="float: right">

        </div>
      </div>
    </template>-->
  </BasicModal>
</template>

<script setup="props, {content}" lang="ts">
import {computed, onMounted, reactive, ref, unref, watch} from 'vue'
import {BasicModal, useModal, useModalInner} from '/@/components/Modal'
import {
  Checkbox as ACheckbox,
  DatePicker,
  Input as AInput,
  message,
  Radio as ARadio,
  Select as ASelect,
  Tabs
} from "ant-design-vue"
import {FileSearchOutlined, PaperClipOutlined, AppstoreOutlined,PicLeftOutlined} from '@ant-design/icons-vue';
import {useTabs} from '/@/hooks/web/useTabs';
import router from "/@/router";
import moment, {Moment} from 'moment';
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {useUserStore} from "/@/store/modules/user";
import {hasBlank, pointMessage} from "/@/api/task-api/tast-bus-api";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useMessage} from "/@/hooks/web/useMessage";
import {findParameterValue, modifyParameterValue} from "/@/api/task-api/query-bus-api";
import {ObjTool, StrTool} from "/@/api/task-api/tools/universal-tools";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import dayjs from "dayjs";
import {findStockCaiGouList} from "/@/api/record/stock/stock-caigou";
import SupperModalPop from "/@/views/boozsoft/global/popup/customer_info/modalPop.vue";
import DeptModalPop from "/@/views/boozsoft/global/popup/dept/select-dept.vue";
import StockCangKuModalPop from "/@/views/boozsoft/stock/stock_cangku/popup/stockCangKuModalPop.vue";
import SelectPsn from "/@/views/boozsoft/global/popup/dept/select-psn.vue";
import StockInfiModalPop from "/@/views/boozsoft/stock/stock_info/popup/stockInfoModalPop.vue";
import {findAllProvince} from "/@/api/record/system/zone";
import {periodAllList} from "/@/api/record/group/im-unit";
import SecondaryTitle from "/@/views/boozsoft/stock/stock_piliang/popup/SecondaryTitle.vue";
const {closeCurrent} = useTabs(router);
const emit = defineEmits(['register', 'query'])

const ASelectOption = ASelect.Option
const AInputSearch = AInput.Search
const ARadioGroup = ARadio.Group
const ARadioButton = ARadio.Button
const ACheckboxGroup = ACheckbox.Group
const TabPane = Tabs.TabPane

const userStore = useUserStore();
const formItems: any = ref({})
let changeBeforeModel: any = {}
// 会计区间
const dateList: any = ref([])
const quarterList: any = ref([])
// 人员
const dataMap: any = ref({})
const defaultTabsKey = ref('1')

const busDate = useCompanyOperateStoreWidthOut().getLoginDate
const maxPingzhengQj = ref('')
const ifCrossYear = ref('1')

const userId = userStore.getUserInfo.id
//查询条件

const currentDynamicTenant = ref('')
const {createWarningModal} = useMessage();

onMounted(async () => {
});



const [register, {closeModal, setModalProps}] = useModalInner((data) => {
  formItems.value = data.data
  changeBeforeModel = JSON.parse(JSON.stringify(formItems.value))
  defaultTabsKey.value = data.data.mark
  setModalProps({minHeight: 420});
})


let count = 0
const codeChange = async (value) => {
  ++count
  if (count == 2) return false; // 防止重复打开
  // 赋值默认参数
  dbQueryJson.accountId = value.accId;
  defaultModel.constant.tenantId = value.accountMode
  defaultModel.constant.companyName = value.companyName
  modelLoadIng.value = true
  let dbQueryData = await findParameterValue(dbQueryJson)
  if (null != dbQueryData) { // 存在
    dbQueryJson.id = dbQueryData.id
    dbQueryJson.queryConditions = dbQueryData.queryConditions
    dbQueryJson.filterConditions = dbQueryData.filterConditions

    if (!hasBlank(dbQueryData.queryConditions)) {
      let queryMap = JSON.parse(dbQueryData.queryConditions)
      queryModel.constant = queryMap.constant
      queryModel.variable = queryMap.variable
    }
  } else {
    // 清除条件
    queryModel.constant = defaultModel.constant
    queryModel.variable = defaultModel.variable
    dbQueryJson.id = null
  }
  // 初始化基础参数
  queryModel.constant.tenantId = value.accountMode
  currentDynamicTenant.value = value.accountMode
  await reLifeEtcList(currentDynamicTenant.value)
  modelLoadIng.value = false
}

async function reLifeEtcList(dynamicTenant) {
  let q = ['user', 'cust', 'dept', 'operator',  'custClass']
  dataMap.value = (await useRouteApi(findStockCaiGouList, {schemaName: currentDynamicTenant})([...new Set(q)].join(',')))
  dataMap.value['zone'] = (await findAllProvince())
}


/*********Mr·Ye*********/
const modelLoadIng = ref(false)

const defaultModel = {
  constant: {
    tenantId: '',
    companyName: ''
  },
  variable: {
    cvencode: '',
    cvencodeClass: '',
    cvencodeJs: '',
    cpersoncode: '',
    cdepcode: '',
    bcheck: '',
    expirationDate: ''
  }
}

const queryModel = reactive({constant: {}, variable: {}})

const openOrClose = (visible: boolean) => {
  // 初始化选中
}
/*********Mr·Ye*********/
let isChanged: boolean = false

async function handleOk() {
  if (hasBlank(queryModel.variable.expirationDate)){
      message.error('截止日期为必选项!');
      return false;
  }
  modelLoadIng.value = false
  emit('query', {data: unref(queryModel),map: dataMap.value})
  closeModal()
  return true
}

async function handleClose() {
  if (null != formItems.value.openOne && formItems.value.openOne == 1)
    await closeCurrent()
  closeModal()
}

// 查询


const dbQueryJson = reactive({ // 后台数据模型
  id: null,
  accountId: '',
  owningMenuName: '销货单列表',
  owningPlan: '1',
  planPerson: userId,
  filterConditions: '',
  queryConditions: ''
})

/**
 * 针对与凭证查询条件是否改变
 */
const modelNoChange = () => {
  let constant = queryModel.constant
  if (!hasBlank(dbQueryJson.queryConditions)) {
    let map = JSON.parse(dbQueryJson.queryConditions)
    let variableJSON = JSON.stringify(ObjTool.dels(queryModel.variable, []))
    let s = StrTool
    let flag = s.eq(constant.companyCode, map.constant.companyCode) && s.eq(constant.currency, map.constant.currency) && s.eq(constant.tenantId, map.constant.tenantId)
      && s.eq(variableJSON, JSON.stringify(map.variable))
    return flag;
  }
  return false;
}
/*辅助核算过滤框*/

const thisEditType = ref('')
const [registerModalPopPage, {openModal: openMoalPopPage}] = useModal();
const [registerSelectDeptPage, {openModal: openSelectDeptPage}] = useModal()
const [registerSelectPsnPage, {openModal: openSelectPsnPage}] = useModal()
const openHeadSelectContent = (type) => {
  thisEditType.value = type
  switch (type) {
    case 'cvencode':
    case 'cvencodeJs':
      openMoalPopPage(true, {
        database: currentDynamicTenant.value,
        accId: dbQueryJson.accountId,
      });
      break;
    case 'cdepcode':
      openSelectDeptPage(true, {
        currentDynamicTenant: currentDynamicTenant.value
      })
      break;
    case 'cpersoncode':
    case 'wuliuUser':
      openSelectPsnPage(true, {
        currentDynamicTenant: currentDynamicTenant.value
      })
      break;
    case 'cvencodeClass':
        break;
  }
}
const modalData = (o) => {
  queryModel.variable[thisEditType.value] = thisEditType.value == 'cvencode' || thisEditType.value == 'cvencodeJs' || thisEditType.value == 'cwhcode' ? o[0].id : thisEditType.value == 'cdepcode' ? o.uniqueCode : o.id
  if (thisEditType.value == 'cvencode'){
    xscustChange(true)
  }else if (thisEditType.value == 'cvencodeJs'){
    xscustChange(false)
  }
}
const xscustChange = (b) => {
  if (b){
    queryModel.variable.cvencodeJs = ''
  }else {
    queryModel.variable.cvencode = ''
  }
}

</script>
<style lang="less" scoped>
@import '/@/assets/styles/redTitle-open.less';
.nc-open-content {
  background-image: url(/@/assets/images/homes/bg-pattern.png);
  background-repeat: no-repeat;
  background-position: 66% 8%;
  background-size: contain;
  position: relative;
  width: 100%;

  .open-content-title {
    > div {
      display: inline-block;
    }

    > div:nth-of-type(1) {
      width: 200px;
      background-color: #efeeee;
      color: black;
      font-size: 20px;
      text-align: center;
      padding: 5px 10px
    }
  }

  .open-content-up {
    position: relative;

    .ocup-position {
      position: absolute;
      left: 0;
      width: 170px;
      background-color: #65cbec;
      color: white;
      font-size: 16px;
      text-align: left;
      padding: 5px 10px;
    }

    .ocup-position:nth-of-type(1) {
      top: 0px;
    }

    .ocup-position:nth-of-type(2) {
      top: 190px;
    }

    ul {
      padding: 0 10px;

      li {
        margin: 10px 0;

        span {
          font-size: 14px;
          color: #747272;
        }

        .right_span{
          display: inline-block;
          width: 90px !important;
        }

        /*> span:nth-of-type(1), .right_span {
          display: inline-block;
          width: 120px;
        }*/

        .ant-select {
          font-size: 14px;
        }
      }


    }
  }

  .open-content-foot {
    display: block;
    position: fixed;
    margin-top: 43px;
  }

  .ant-tabs-tabpane-active {
    overflow-y: auto;
    height: 400px;
  }

  .ant-select-selection-search-input {
    border-bottom: none !important;
  }

  .ant-input:focus {
    box-shadow: none;
  }

  :deep(.ant-input) {
    background: none !important;
  }

  :deep(.ant-select-selector), :deep(.ant-input-affix-wrapper) {
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
    background: none;
  }

  label:not(.ant-radio-button-wrapper) {
    text-align: right;
    width: 110px;
    display: inline-block;
    padding: 5px 10px;
  }

  .ant-radio-group {
    .ant-radio-wrapper {
      width: 70px;

      .ant-radio-input {
        border-color: slategrey;
      }
    }

    p:nth-of-type(2) {
      margin-bottom: 0;
    }
  }

  :deep(.ant-picker-range),:deep(.ant-picker) {
    background: none;
    border: none;
    border-bottom: 1px solid #bdb9b9;

    input {
      text-align: center;
    }
  }
  .special-border-div {
    position: relative;
    border: 1px #acabab solid;
    margin: 20px 0;

    > span {
      position: absolute;
      top: -12px;
      left: 50px;
      font-size: 15px;
      background: white;
      padding: 0 15px;
    }

    > div {
      margin: 15px;
      color: black;
      display: flex;

      .sbd-left {
        width: 60%;

        .ant-radio-group {
          .ant-radio-wrapper {
            width: 11% !important;
            text-align: left;

            .ant-radio-input {
              border-color: slategrey;
            }
          }
        }
      }

      .sbd-right {
        width: 40%;
        padding: 2% 5% 0;

        > div:nth-of-type(2) {
          margin-top: 14px;
        }

        .ant-radio-button-wrapper {
          color: #0096c7;
        }
      }

    }
  }
  display: inline-flex;
  justify-content: space-between;
  .con-left{
    width: 75%;
  }
  .con-right{
    width: 25%;
    background-color: #f1f1f1;
    padding: 5%;
    .right-btns{
      width: 150px;background-color: #f1f1f1;padding: 10% 4%;height: 490px;
      :deep(.ant-btn-primary:hover){
        border: 1px solid #5f375c;
      }
    }
  }
}

:deep(.ant-tabs-left-bar) {
  margin-right: 0px !important;
}

:deep(.ant-tabs-left) {
  .ant-tabs-tab {
    width: 170px;
    font-weight: bold;
    display: inline-block;
  }

  .ant-tabs-tab-active {
    color: #65cbec !important;
    .ant-tabs-tab-btn:after{
      content: '√';
      margin-left: 5px;
    }
  }

  .ant-tabs-tabpane-active {
    padding-left: 0 !important;
  }

  .ant-tabs-tab:nth-of-type(1) {
    margin-top: 35px;
  }

/*  .ant-tabs-tab:nth-of-type(3) {
    margin-top: 110px !important;
  }*/
}
:deep(.ant-cascader-input){
  border: none;
  border-bottom: 1px solid #bdb9b9;
}
</style>
