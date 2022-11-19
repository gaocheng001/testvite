<template>
  <BasicModal
    width="800px"
    class="spaceLogo"
    v-bind="$attrs"
    @ok="handleOk()"
    @cancel="handleClose()"
    @register="register"
    :canFullscreen="false"
    :footer="null"
    loadingTip="查询参数初始化中"
  >
    <template #title>
      <div style="height: 30px;width: 100%;background-color: #5f375c;color: white;line-height: 30px;text-align: left;">
        <AppstoreOutlined  style="margin: 0 2px;font-size: 14px;"/>
        <span style="font-size: 14px">库存管理</span>
      </div>
    </template>
    <div style="display: inline-flex;justify-content: space-between;width: 100%;">
      <div style="width: calc(100% - 150px);height: 100%;">
        <div style="text-align: center;padding: 10px 0 5px;">
          <SearchOutlined style="font-size: 24px;color: #0096c7;margin-top: 2px"/>
          <span style="line-height:30px;font-size: 24px;color: #0096c7;font-weight: bold;">&ensp;盘点出入库单列表</span>
        </div>
        <div class="nc-open-content">
          <div class="open-content-up">
            <div class="border-div">
              <span>业务范围</span>
              <AccountPicker  style="text-align: center" theme="three" @reloadTable="dynamicAdReload"/>
            </div>
            <div class="border-div">
              <span>查询日期</span>
              <div style="margin-left: 14px;">
                <ul>
                  <li style="margin: 2% 0px;">
                    <div style="text-align: center">
                      <label style="text-align: center">单据日期：</label>
                      <a-date-picker style="width: 180px;" v-model:value="formItems.dateStart" format="YYYY-MM-DD" value-format="YYYY-MM-DD"/>
                      -
                      <a-date-picker style="width: 180px;" v-model:value="formItems.dateEnd" format="YYYY-MM-DD" value-format="YYYY-MM-DD"/>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="border-div">
              <span>查询条件</span>
              <div style="text-align: center">
                <label>业务类型：</label>
                <a-select
                  v-model:value="dataType"
                  show-search
                  style="width: 58%;text-align: center;margin-left: 25px;"
                >
                  <a-select-option
                    v-for="item in dataTypeList"
                    :value="item.value"
                  >
                    {{ item.title }}
                  </a-select-option>
                  <template #suffixIcon><CaretDownOutlined style="color:#666666;"/></template>
                </a-select>
              </div>

              <div style="text-align: center">
                <label >单据编码：</label>
                <a-input :allowClear="true" v-model:value="ccode" placeholder="" style="width: 60%;margin-left: 15px;"/>
              </div>

              <div style="text-align: center">
                <label>盘点仓库：</label>
                <a-select
                  v-model:value="cangku"
                  show-search
                  allowClear
                  style="width: 58%;margin-left: 12px;"
                >
                  <a-select-option
                    v-for="item in cangkuList"
                    :value="item.id"
                  >
                    {{ item.ckName }}
                  </a-select-option>
                  <template #suffixIcon><CaretDownOutlined style="color:#666666;"/></template>
                </a-select>
                <a style="font-weight: bold;font-size: 18px;"><LinkOutlined @click="stockCangKuModalShow" /></a>
              </div>

              <div style="text-align: center">
                <label>盘点部门：</label>
                <a-select
                  v-model:value="cdepcode"
                  :show-arrow="false"
                  :not-found-content="null"
                  showSearch
                  allowClear
                  style="width: 58%;margin-left: 12px;"
                  @keydown.enter.native="$refs.focus2.focus()"
                >
                  <a-select-option
                    v-for="item in deptList"
                    :key="item.uniqueCode"
                    :value="item.uniqueCode"
                  >
                    {{ item.deptCode+'-'+ item.deptName}}
                  </a-select-option>
                </a-select>
                <a style="font-weight: bold;font-size: 18px;"><LinkOutlined @click="stockDeptShow" /></a>
              </div>


              <div style="text-align: center">
                <label >盘 点 人：</label>
                <a-select
                  v-model:value="cmaker"
                  showSearch
                  allowClear
                  :show-arrow="false"
                  :not-found-content="null"
                  style="width: 58%;margin-left: 15px;"
                  @keydown.enter.native="$refs.focus2.focus()"
                >
                  <a-select-option
                    v-for="item in userList"
                    :key="item.uniqueCode"
                    :value="item.uniqueCode"
                  >
                    {{ item.psnCode+'-'+ item.psnName}}
                  </a-select-option>
                </a-select>
                <a style="font-weight: bold;font-size: 18px;"><LinkOutlined @click="stockPsnShow('1')" /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right-btns">
        <Button style="width: 100px;" shape="round" @click="handleOk"  type="primary">查询</Button>
        <Button style="width: 100px;margin-top: 10px" shape="round" @click="handleClose">取消</Button>
      </div>
    </div>

    <StockInfoModalPop @throwData="throwStockData" @register="registerStockPopPage"/>
    <StockCangKuModalPop @throwData="throwStockCangkuData" @register="registerStockCangKuPopPage"/>
    <DeptModalPop @register="registerSelectDeptPage" @save="doDeptData"/>
    <SelectPsn @register="registerSelectPsnPage" @save="doPsnData"/>
  </BasicModal>
</template>

<script setup="props, {content}" lang="ts">
/********************************************* 公共参数 ********************************************************/
import {BasicModal, useModal, useModalInner} from '/@/components/Modal'
import {
  message,
  Button,
  Checkbox as ACheckbox,
  DatePicker as ADatePicker,
  Input as AInput,
  Radio as ARadio,
  Select as ASelect,
  Tabs as ATabs
} from "ant-design-vue"
import {AppstoreOutlined, SearchOutlined,CaretDownOutlined,LinkOutlined} from '@ant-design/icons-vue';
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {useUserStore} from "/@/store/modules/user";
import {useMessage} from "/@/hooks/web/useMessage";
import {ref} from "vue";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import router from "/@/router";
import {useTabs} from "/@/hooks/web/useTabs";
import {periodAllList} from "/@/api/record/group/im-unit";
import {hasBlank, pointMessage} from "/@/api/task-api/tast-bus-api";
import moment, {Moment} from 'moment';
import dayjs, {Dayjs} from "dayjs";
import { findAll as findSupAll} from "/@/api/record/supplier_data/supplier";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {findAll as stockAll} from "/@/api/record/stock/stock";
import {findAll as cangkuAll} from "/@/api/record/stock/stock-cangku";
import {findAllStockClass} from "/@/api/record/stock/stock_class";
import StockInfoModalPop from "/@/views/boozsoft/stock/stock_info/popup/stockInfoModalPop.vue";
import DeptModalPop from "/@/views/boozsoft/global/popup/dept/select-dept.vue";
import SelectPsn from "/@/views/boozsoft/global/popup/dept/select-psn.vue";
import {findAllStock, findDeptList, findSearchAll} from "/@/api/record/stock/stock_taking";
import {psnFindByFlag} from "/@/api/psn/psn";
const { closeCurrent } = useTabs(router);
const emit = defineEmits(['register', 'save'])
const ARangePicker = ADatePicker.RangePicker
const ASelectOption = ASelect.Option
const AInputSearch = AInput.Search
const ARadioGroup = ARadio.Group
const ARadioButton = ARadio.Button
const ACheckboxGroup = ACheckbox.Group
const ATabPane = ATabs.TabPane
const userStore = useUserStore();
const busDate = useCompanyOperateStoreWidthOut().getLoginDate
const {createWarningModal} = useMessage();
const companyOperateStore = useCompanyOperateStoreWidthOut()
const modelLoadIng = ref(false)
const openType = ref('')
const databaseTrue = ref('')
const dynamicAccId = ref('')
const formItems: any = ref({
  dateStart:dayjs(useCompanyOperateStoreWidthOut().getLoginDate),
  dateEnd:dayjs(useCompanyOperateStoreWidthOut().getLoginDate),
});
//************************************* new ***************************
let radiovalue = ref('1');
const endDate2:any = ref<String>("")
const strDate2:any = ref<Dayjs>()
const endDate = ref<Dayjs>()
const strDate = ref<String>("")
let endDateList: any = ref([])
let strDateList: any = ref([])
let time: any = ref<Moment[]>([]);
// 日期是否可选
let timeselflg: any = ref(true);
const maxPingzhengQj = ref('')
// 期间是否可选
let dateselflg: any = ref(false);
// 会计区间
const dateList: any = ref([])
const quarterList: any = ref([])
//************************************* 查询条件 ***************************
const dataType: any = ref('PYRKD')
const dataTypeList: any = ref([{title:'盘盈入库',value:'PYRKD'},{title:'盘亏出库',value:'PKCKD'}])
const sup: any = ref('')
const supList: any = ref([])
const jssup: any = ref('')
const stock: any = ref('')
const stockList: any = ref([])
const ggxh: any = ref('')
const cangku: any = ref('')
const cangkuList: any = ref([])
const cdepcode: any = ref('')
const cmaker: any = ref('')
const ccode: any = ref('')
const iyear: any = ref('2022')
const [registerModalPopPage, {openModal: openMoalPopPage}] = useModal();
const [registerStockPopPage, {openModal: openStockPopPage}] = useModal();
const [registerStockCangKuPopPage, {openModal: openStockCangkuPopPage}] = useModal();

const [register, {closeModal, setModalProps}] = useModalInner((data) => {
  formItems.value.openOne = data.data.openOne;
  openType.value=data.openType
  setModalProps({ minHeight: 475 });
})
const coCode = ref('')
const companyName = ref('')
const dynamicAdReload = async (obj) =>{
  databaseTrue.value=obj.accountMode
  dynamicAccId.value=obj.accId
  modelLoadIng.value=true
  iyear.value=obj.year
  coCode.value =obj.coCode
  companyName.value =obj.companyName
  await getCangku(obj.accountMode)
  initData()
  //重置数据
  strDate2.value = dayjs('2022-07-22')
  endDate2.value = dayjs('2022-07-22')
  cdepcode.value = ''
  cmaker.value = ''
  cangku.value = ''
  modelLoadIng.value=false
}

function throwSupData(data) {
  let temp=data[data.length-1]
  sup.value=temp.uniqueCode
}

function throwStockData(data) {
  let temp=data[data.length-1]
  stock.value=temp.stockNum
}

async function getCangku(accountMode) {
  let temp=await useRouteApi(cangkuAll,{schemaName: accountMode})({searchConditon:{requirement:'stockNum', value:''}})
  cangkuList.value=temp.items
}
function stockCangKuModalShow() {
  openStockCangkuPopPage(true,{
    database:databaseTrue.value,
  })
}
function throwStockCangkuData(data) {
  let temp=data[data.length-1]
  cangku.value=temp.id
}

function handleOk() {
  if(!formItems.value.dateStart){
    message.error("请输入开始日期")
    return
  }

  if(!formItems.value.dateEnd){
    message.error("请输入开始日期")
    return
  }
  let map={
    strDate:timeformat(formItems.value.dateStart),
    endDate:timeformat(formItems.value.dateEnd),
    dataType:dataType.value,
    databaseTrue:databaseTrue.value,
    cdepcode: cdepcode.value,
    cmaker: cmaker.value,
    cangku:cangku.value,
    ccode:ccode.value,
    iyear:iyear.value,
    coCode:coCode.value,
    companyName:companyName.value,
  }
  emit('save', map);
  closeModal();
}

async function handleClose() {
  if (null != formItems.value.openOne && formItems.value.openOne == 1) {
    await closeCurrent();
    router.push('/zhongZhang/home/welcome');
  }else{
    closeModal();
  }
  return true;
}
// 日期格式化
function timeformat(dateData) {
  let date = new Date(dateData);
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  let d = date.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}

const [registerSelectPsnPage, {openModal: openSelectPsnPage}] = useModal()

const [registerSelectDeptPage, {openModal: openSelectDeptPage}] = useModal()
function stockDeptShow() {
  openSelectDeptPage(true,{
    database:database.value,
  })
}

function doDeptData(data) {
  console.log(data)
  formItems.value.cdepcode = data.uniqueCode
}

const flag:any = ref('1');
function stockPsnShow(d) {
  flag.value  = d
  openSelectPsnPage(true,{
    dynamicTenantId:database.value,
  })
}
function doPsnData(data) {
  console.log(data)
  if(flag.value === '1'){
    formItems.value.pdUserid = data.uniqueCode
  }else{
    formItems.value.kgUserid = data.uniqueCode
  }
}

const database:any = ref({})
const isEdit:any = ref(false)
const searchData:any = ref([]);
const deptList:any = ref([]);
const userList:any = ref([]);
const chList:any = ref([]);
async function initData() {
  //部门 deptList
  deptList.value = await useRouteApi(findDeptList,{schemaName: databaseTrue})({})
  //人员
  userList.value = await useRouteApi(psnFindByFlag,{schemaName: databaseTrue})({})
}
const filterOption = (input: string, option: any) => {
  return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
</script>
<style lang="less" scoped>
:deep(.ant-checkbox){
  margin-top: -8px;
}
.nc-open-content {
  background-image: url(/@/assets/images/homes/bg-pattern.png);
  background-repeat: no-repeat;
  background-position: 66% 8%;
  background-size: contain;
  position: relative;
  :deep(.ant-select-selector),:deep(.ant-input),:deep(.ant-picker), :deep(.ant-input-affix-wrapper) {
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
    background: none;
  }
  .border-div {
    position: relative;
    border: 1px #a29f9f solid;
    margin: 20px 10px;
    padding: 2.5%;
    text-align: left;

    > span {
      display: block;
      text-align: center;
      background-color: white;
      position: absolute;
      left: 50px;
      top: -10px;
      color: #888888;
      font-size: 12px;
      font-weight: bold;
    }
    :deep(.account-picker){
      >div{
        text-align: left;
      }
    }
  }

}

.right-btns{
  width: 150px;background-color: #f1f1f1;padding: 10% 4%;height: 475px;
  :deep(.ant-btn-primary:hover){
    border: 1px solid #5f375c;
  }
}
:global(.ant-modal-header) {
  padding: 10px 0 !important;
}
:global(.ant-modal-close-x){
  height: 30px !important;
  color: white;
}

:deep(.ant-radio-button-wrapper){
  color: #0096c7;
}
</style>
