<template>
  <BasicModal
    width="750px"
    class="spaceLogo"
    v-bind="$attrs"
    @ok="handleOk()"
    @cancel="handleClose()"
    @register="register"
    :loading="modelLoadIng"
    :canFullscreen="false"
    :footer="null"
    loadingTip="查询参数初始化中"
  >
    <template #title>
      <div style="height: 30px;width: 100%;background-color: #5f375c;color: white;line-height: 30px;">
        <AppstoreOutlined  style="margin: 0 2px;font-size: 14px;"/>
        <span style="font-size: 14px">盘点单查询</span>
      </div>
    </template>
    <div style="display: inline-flex;justify-content: space-between;width: 100%;">
      <div style="width: calc(100% - 150px);height: 100%;">
        <div style="text-align: center;padding: 10px 0 5px;">
          <SearchOutlined style="font-size: 24px;color: #0096c7;margin-top: 2px"/>
          <span style="line-height:30px;font-size: 24px;color: #0096c7;font-weight: bold;">&ensp;盘点单</span>
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
                <span class="right_span">单据编号：</span>
                <a-input :allowClear="true" placeholder="" style="width: 160px"/>

                <span class="right_span" style="margin-left: 20px" >审核状态：</span>
                <a-select
                  :allowClear="true"
                  v-model:value="formItems.flgs"
                  show-searchplaceholder=""
                  style="width: 160px"
                >
                  <a-select-option value="2">全部</a-select-option>
                  <a-select-option value="1">已审核</a-select-option>
                  <a-select-option value="0">未审核</a-select-option>
                </a-select>
              </div>

              <div style="padding-left: 15px;">

                <span class="right_span">存货仓库：</span>
                <a-select
                  v-model:value="cangku"
                  show-search
                  style="width: 150px;"
                >
                  <a-select-option
                    v-for="item in cangkuList"
                    :value="item.id"
                  >
                    {{ item.ckName }}
                  </a-select-option>
                  <template #suffixIcon><CaretDownOutlined style="color:#666666;"/></template>
                </a-select>
                &nbsp;
                <a style="font-weight: bold;font-size: 18px;"><LinkOutlined @click="stockCangKuModalShow" /></a>


                <span class="right_span" style="margin-left: 15px">业务部门：</span>
                <a-select
                  v-model:value="dept"
                  :show-arrow="false"
                  :filter-option="true"
                  :not-found-content="null"
                  style="width: 150px"
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

            </div>
          </div>
        </div>
      </div>
      <div class="right-btns">
        <Button style="width: 100px;" shape="round" @click="handleOk"  type="primary">查询</Button>
        <Button style="width: 100px;margin-top: 10px" shape="round" @click="handleClose">取消</Button>
      </div>
    </div>
  </BasicModal>
</template>

<script setup="props, {content}" lang="ts">
import {ref, unref, reactive, onMounted, watch, computed} from 'vue'
import {BasicModal, useModal, useModalInner} from '/@/components/Modal'
import {
  DatePicker as ADatePicker,
  Select as ASelect,
  Input as AInput,
  Checkbox as ACheckbox,
  Radio as ARadio,
  Button,
  Tabs as ATabs, message, Transfer as ATransfer
} from "ant-design-vue"
import {
  SearchOutlined,AppstoreOutlined,CaretDownOutlined,LinkOutlined,
  PicLeftOutlined, PaperClipOutlined
} from '@ant-design/icons-vue';
import {useTabs} from '/@/hooks/web/useTabs';
import router from "/@/router";
import moment, {Moment} from 'moment';
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {useUserStore} from "/@/store/modules/user";
import {useMessage} from "/@/hooks/web/useMessage";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import dayjs, { Dayjs } from "dayjs";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {findAll as cangkuAll} from "/@/api/record/stock/stock-cangku";
import {findAll as findSupAll} from "/@/api/record/supplier_data/supplier";
import {hasBlank} from "/@/api/task-api/tast-bus-api";
import {findDeptList} from "/@/api/record/stock/stock_taking";
//红字（无现金科目，请设置现金科目后再进行查询）
const {closeCurrent} = useTabs(router);
const emit = defineEmits(['register', 'save'])

const ARangePicker = ADatePicker.RangePicker
const ASelectOption = ASelect.Option
const AInputSearch = AInput.Search
const ARadioGroup = ARadio.Group
const ARadioButton = ARadio.Button
const ACheckboxGroup = ACheckbox.Group
const ATabPane = ATabs.TabPane

const userStore = useUserStore();
const formItems: any = ref({
  dateStart:  dayjs(moment(useCompanyOperateStoreWidthOut().getLoginDate).subtract(1, 'month').format('YYYY-MM-DD')),
  dateEnd:dayjs(useCompanyOperateStoreWidthOut().getLoginDate),
  flgs:'2'
});let changeBeforeModel: any = {}

const endDate = ref<String>("")
const strDate = ref<String>("")
let time: any = ref<Moment[]>([]);
// 日期是否可选
let timeselflg: any = ref(true);
// 期间是否可选
let dateselflg: any = ref(false);

const busDate = useCompanyOperateStoreWidthOut().getLoginDate
const maxPingzhengQj = ref('')
const ifCrossYear = ref('1')

const ishaveRjz = ref<boolean>(true)
const isShowQjlh = ref<boolean>(false)
const userId = userStore.getUserInfo.id
//查询条件

const currentDynamicTenant = ref('')
const {createWarningModal} = useMessage();

const targetKeys: any = ref(['subjectNumber', 'direction', 'number', 'amount', 'wbAmount', 'reviewStatus', 'bookStatus', 'preparedMan'])
const selectedKeys: any = ref([])
const filterDatas = [
  {
    key: 'subjectNumber',
    title: `科目编码`
  }
  , {
    key: 'direction',
    title: `科目方向`
  },
  {
    key: 'number',
    title: `数量`
  },
  {
    key: 'amount',
    title: `本币金额`
  },
  {
    key: 'wbAmount',
    title: `外币金额`
  },
  {
    key: 'reviewStatus',
    title: `审核状态`
  },
  {
    key: 'bookStatus',
    title: `记账状态`
  },
  {
    key: 'preparedMan',
    title: `制单人`
  },
  {
    key: 'checkMan',
    title: `审核人`
  },
  {
    key: 'cashierMan',
    title: `出纳人`
  }, {
    key: 'reviewMan',
    title: `财务主管`
  }, {
    key: 'bookMan',
    title: `记账人`
  }
]

const targetKeys2: any = ref([])
const startRendering = ref(false)
const selectedKeys2: any = ref([])
const filterDatas2 = [
  {
    key: 'cdeptId',
    title: `部门`
  }
  , {
    key: 'cpersonId',
    title: `员工`
  },
  {
    key: 'ccusId',
    title: `客户`
  },
  {
    key: 'csupId',
    title: `供应商`
  },
  {
    key: 'projectId',
    title: `项目`
  }
]

const companyOperateStore = useCompanyOperateStoreWidthOut()
onMounted(async () => {
});



const [register, {closeModal, setModalProps}] = useModalInner((data) => {
  // 方式2
  formItems.value.openOne = data.data.openOne;
  setModalProps({minHeight: 400});
})


const oldStrYear = ref('')


const confirm = () => {

}
const cancel = () => {

}
/*********Mr·Ye*********/
const defaultTabsKey = ref('1')
const modelLoadIng = ref(false)

const defaultModel = {
  constant: {
    currency: '',
    tenantId: '',
    companyCode: '',
    queryType: '1',
    showType: '2',
    thisAdInfo: {}
  },
  authority: {codes: [], types: []},
  variable: {
    periodStart: '',
    periodEnd: '',


    accounting: {},
    assists: {}
  }
}


let isChanged: boolean = false
const strTime = ref<Dayjs>()
const endTime = ref<Dayjs>()
async function handleOk() {
  modelLoadIng.value = false

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
    database:databaseTrue.value,
    coCode:coCode.value,
    companyName:companyName.value,
    iyear: iyear.value,
    type:'PDD',
    obj:dynamicTenant.value
  }
  emit('save', map);
  closeModal()
}

async function handleClose() {
  if (null != formItems.value.openOne && formItems.value.openOne == 1) {
    await closeCurrent()
    router.push('/zhongZhang/home/welcome')
  }
  closeModal()
}
const databaseTrue = ref('')
const dynamicAccId = ref('')
const iyear = ref('2022')
const coCode = ref('')
const companyName = ref('')
const dynamicTenant:any = ref('')
const dynamicAdReload = async (obj) =>{
  dynamicTenant.value = obj
  cangku.value = ''
  dept.value = ''
  formItems.value.flgs = '2'
  databaseTrue.value=obj.accountMode
  dynamicAccId.value=obj.accId
  modelLoadIng.value=true
  coCode.value =obj.coCode
  companyName.value =obj.companyName
  iyear.value=obj.year
  await getCangku(obj.accountMode)
  await getDept(obj.accountMode)
  modelLoadIng.value=false
}
const cangku: any = ref('')
const cangkuList: any = ref([])
const deptList:any = ref([]);
const dept:any = ref();

async function getCangku(accountMode) {
  let temp=await useRouteApi(cangkuAll,{schemaName: accountMode})({searchConditon:{requirement:'stockNum', value:''}})
  cangkuList.value=temp.items
}
async function getDept(accountMode) {
  //部门 deptList
  deptList.value = await useRouteApi(findDeptList,{schemaName: accountMode})({})
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
