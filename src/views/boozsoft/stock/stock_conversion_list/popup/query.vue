<template>
  <BasicModal
    width="700px"
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
      <div style="height: 30px;width: 100%;background-color: #5f375c;color: white;line-height: 30px;">
        <AppstoreOutlined  style="margin: 0 2px;font-size: 14px;"/>
        <span style="font-size: 14px">库存管理</span>
      </div>
    </template>
    <div style="display: inline-flex;justify-content: space-between;width: 100%;">
      <div style="width: calc(100% - 150px);height: 100%;">
        <div style="text-align: center;padding: 10px 0 5px;">
          <SearchOutlined style="font-size: 24px;color: #0096c7;margin-top: 2px"/>
          <span style="line-height:30px;font-size: 24px;color: #0096c7;font-weight: bold;">&ensp;形态转换单</span>
        </div>
        <div class="nc-open-content">
          <div class="open-content-up">
            <div class="border-div">
              <span>业务范围</span>
              <AccountPicker  theme="three" @reloadTable="dynamicAdReload"/>
            </div>
            <div class="border-div">
              <span>日期条件</span>
              <div>
                <div class="sbd-left" style="padding-left: 5%;">
                  <p>
                    <span><font style="color: red">*</font>制单日期：</span>
                    <a-date-picker style="width: 160px;" v-model:value="formItems.dateStart" format="YYYY-MM-DD" value-format="YYYY-MM-DD"/>
                    -
                    <a-date-picker style="width: 160px;" v-model:value="formItems.dateEnd" format="YYYY-MM-DD" value-format="YYYY-MM-DD"/>
                  </p>
                </div>
              </div>
            </div>
            <div class="border-div">
              <span>查询条件</span>
              <div style="padding-left: 15px;">
                <label>单据编码：</label>
                <a-input  style="width: 280px;margin-left: 20px;" :allowClear="true" placeholder=""
                         v-model:value="ccode"/>
              </div>

              <div style="padding-left: 15px;">
                <label>业务部门：</label>
                <a-select
                  v-model:value="dept"
                  show-search
                  style="width: 280px;margin-left: 20px;"
                >
                  <a-select-option
                    v-for="item in deptList"
                    :key="item.uniqueCode"
                    :value="item.uniqueCode"
                  >
                    {{ item.deptCode +'-'+ item.deptName}}
                  </a-select-option>
                  <template #suffixIcon><CaretDownOutlined style="color:#666666;"/></template>
                </a-select>
                <a style="font-weight: bold;font-size: 18px;"><LinkOutlined @click="openHeadSelectContent('dept')" /></a>
              </div>

             <div style="padding-left: 15px;">
                <span class="right_span">业务人员：</span>
               <a-select
                 v-model:value="user"
                 show-search
                 style="width: 280px;margin-left: 20px;"
               >
                 <a-select-option
                   v-for="item in psnList"
                   :key="item.id"
                   :value="item.id"
                 >
                   {{ item.psnName}}
                 </a-select-option>
                 <template #suffixIcon><CaretDownOutlined style="color:#666666;"/></template>
               </a-select>
               <a style="font-weight: bold;font-size: 18px;"><LinkOutlined @click="openHeadSelectContent('user')" /></a>
              </div>



              <div style="padding-left: 15px;">
                <label > &nbsp;状 &nbsp;&nbsp;态：</label>
                <a-select
                  v-model:value="dataType"
                  show-search
                  style="width: 280px;text-align: center;margin-left: 30px;"
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

            </div>
          </div>
        </div>
      </div>
      <div class="right-btns">
        <Button style="width: 100px;" shape="round" @click="handleOk"  type="primary">查询</Button>
        <Button style="width: 100px;margin-top: 10px" shape="round" @click="handleClose">取消</Button>
      </div>
    </div>


    <StockCangKuModalPop @register="registerStockCangKuModalPage" @throwData="modalData"/>
    <DeptModalPop @register="registerSelectDeptPage" @save="modalData"/>
    <SelectPsn @register="registerSelectPsnPage" @save="modalData"/>
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
import {hasBlank, pointMessage} from "/@/api/task-api/tast-bus-api";
import moment, {Moment} from 'moment';
import dayjs from "dayjs";
import {psnFindAll, psnFindByFlag} from "/@/api/psn/psn";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {findAll as cangkuAll} from "/@/api/record/stock/stock-cangku";
import {findDeptList} from "/@/api/record/stock/stock_taking";

import StockCangKuModalPop from "/@/views/boozsoft/stock/stock_cangku/popup/stockCangKuModalPop.vue";
import DeptModalPop from "/@/views/boozsoft/global/popup/dept/select-dept.vue";
import SelectPsn from "/@/views/boozsoft/global/popup/dept/select-psn.vue";

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
  dateStart:  dayjs(moment(useCompanyOperateStoreWidthOut().getLoginDate).subtract(1, 'month').format('YYYY-MM-DD')),
  dateEnd:dayjs(useCompanyOperateStoreWidthOut().getLoginDate),
});

//************************************* new ***************************
let radiovalue = ref('1');
const riqi: any = ref([]);
const endDate = ref<String>("")
const strDate = ref<String>("")
let endDateList: any = ref([])
let strDateList: any = ref([])
let time: any = ref<Moment[]>([]);
const quarterList: any = ref([])
//************************************* 查询条件 ***************************
const strNum: any = ref('')
const endNum: any = ref('')
const dataType: any = ref('')
const dataTypeList: any = ref([{title:'全部',value:''},{title:'已审核',value:'1'},{title:'未审核',value:'0'}])
const sup: any = ref('')
const supList: any = ref([])
const cangku: any = ref('')
const cangrk: any = ref('')
const cangck: any = ref('')
const cangkuList: any = ref([])
const thisEditType = ref('')
const ccode: any = ref('')

const [registerModalPopPage, {openModal: openMoalPopPage}] = useModal();
const [registerStockCangKuModalPage, {openModal: openStockCangKuModalPage}] = useModal();
const [registerSelectDeptPage, {openModal: openSelectDeptPage}] = useModal()
const [registerSelectPsnPage, {openModal: openSelectPsnPage}] = useModal()
const openHeadSelectContent = (type) => {
  thisEditType.value = type
  switch (type) {
    case 'dept':
      openSelectDeptPage(true, {
        currentDynamicTenant: databaseTrue.value
      })
      break;
    case 'cangck':
      openStockCangKuModalPage(true, {
        database: databaseTrue.value,
      })
      break;
    case 'cangrk':
      openStockCangKuModalPage(true, {
        database: databaseTrue.value,
      })
      break;
    case 'user':
      openSelectPsnPage(true, {
        currentDynamicTenant: databaseTrue.value
      })
      break;
  }
}
const modalData = (o) => {
  switch (thisEditType.value) {
    case 'dept':
      dept.value = o.uniqueCode
      break;
    case 'cangck':
      cangck.value = o[0].id
      break;
    case 'cangrk':
      cangrk.value = o[0].id
      break;
    case 'user':
      console.log(o)
      user.value = o.id
      break;
  }
}

const [register, {closeModal, setModalProps}] = useModalInner((data) => {
  formItems.value.openOne = data.data.openOne;
  openType.value=data.openType
  setModalProps({ minHeight: 475 });
})
const dynamicTenant:any = ref('')
const dynamicAdReload = async (obj) =>{
  dynamicTenant.value = obj
  databaseTrue.value=obj.accountMode
  dynamicAccId.value=obj.accId
  modelLoadIng.value=true
  iyear.value=obj.year
  coCode.value =obj.coCode
  companyName.value =obj.companyName

  await getSup(obj.accountMode)
  await getCangku(obj.accountMode)
  await getDept(obj.accountMode)
  modelLoadIng.value=false
}

const dept:any = ref('')
const deptList:any = ref([])
const user:any = ref('')
const psnList:any = ref([])
async function getDept(accountMode) {
  //部门 deptList
  deptList.value = await useRouteApi(findDeptList,{schemaName: accountMode})({})
}
async function getSup(accountMode) {
  let res = await useRouteApi(psnFindByFlag,{schemaName: accountMode})({})
  psnList.value = res
  console.log(res)
}

async function getCangku(accountMode) {
  let temp=await useRouteApi(cangkuAll,{schemaName: accountMode})({searchConditon:{requirement:'stockNum', value:''}})
  cangkuList.value=temp.items
  console.log(cangkuList.value)
}


const coCode = ref('')
const companyName = ref('')
const iyear = ref('2022')
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
    ccode:ccode.value,
    dataType:dataType.value,
    user:user.value,
    dept:dept.value,
    /*cangrk:cangrk.value,
    cangck:cangck.value,*/
    iyear: iyear.value,
    database:databaseTrue.value,
    coCode:coCode.value,
    companyName:companyName.value,
    type:'XTZHD',
    obj:dynamicTenant.value
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
