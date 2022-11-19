<template>
  <BasicModal
    width="600px"
    :height="300"
    class="spaceLogo"
    v-bind="$attrs"
    :scroll="false"
    @ok="handleOk()"
    @cancel="handleClose()"
    :canFullscreen="false"
    :footer="null"
    @register="register"
    loadingTip="查询参数初始化中"
  >
    <template #title>
      <div style="height: 30px;width: 100%;background-color: #5f375c;color: white;line-height: 30px;">
        <AppstoreOutlined  style="margin: 0 2px"/>
        <span style="font-size: 13px">成本核算</span>
      </div>
    </template>

    <div style="display: inline-flex;justify-content: space-between;width: 100%;">
      <div style="width: calc(100% - 150px);height: 100%;">
        <div style="display: flex;margin-top: 10px;text-align: center;">
          <ProfileTwoTone style="font-size: 30px;color: #0096c7;margin-left: 4em;"/>
          <span style="line-height:30px;font-size: 24px;color: #0096c7;font-weight: bold;">&ensp;自动成本核算</span>
        </div>
        <div class="nc-open-content">
          <div class="open-content-up">
            <div class="border-div">
              <span>业务范围</span>
              <AccountPicker style="text-align: center;" theme="three" @reloadTable="dynamicAdReload"/>
            </div>
            <div class="border-div">
              <span>查询条件</span>
              <div style="margin-left: 52px;">
                <ul>
                  <li style="margin: 1% 0px;">
                    <label style="text-align: left"><font style="color: red">*</font>核算期间：</label>
                    <a-select
                      :allowClear="true"
                      v-model:value="formItems.riqi"
                      style="width: 60%;margin-left: 28px;"
                      ref="select"
                    >
                      <a-select-option v-for="data in rqList" :key="data.id" :value="data.stockYear+'-'+ data.stockMonth">{{ data.stockYear+'-'+ data.stockMonth}}</a-select-option>
                    </a-select>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="width: 150px;background-color: #f1f1f1;padding: 10% 4%;height: 250px;">
        <Button style="width: 100px;" shape="round" @click="handleOk"  type="primary">确定</Button>
        <Button style="width: 100px;margin-top: 10px" shape="round" @click="handleClose">放弃</Button>
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
  Popconfirm as APopconfirm,
  Tabs as ATabs, message, Transfer as ATransfer,Button
} from "ant-design-vue"
import {
  PlusSquareOutlined,
  FileSearchOutlined,
  SearchOutlined,AppstoreOutlined,ProfileTwoTone,
  PicLeftOutlined, PaperClipOutlined
} from '@ant-design/icons-vue';
import {useTabs} from '/@/hooks/web/useTabs';
import router from "/@/router";
import moment, {Moment} from 'moment';

import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";

import {useUserStore} from "/@/store/modules/user";
import {
  hasBlank,
  pointMessage
} from "/@/api/task-api/tast-bus-api";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useMessage} from "/@/hooks/web/useMessage";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {
  findRiqiList
} from "/@/api/record/stock/stock_cost";

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
  type: '1',
  scope: '1',
})
let changeBeforeModel: any = {}

const busDate = useCompanyOperateStoreWidthOut().getLoginDate
const maxPingzhengQj = ref('')
const ifCrossYear = ref('1')

const ishaveRjz = ref<boolean>(true)
const isShowQjlh = ref<boolean>(false)
const userId = userStore.getUserInfo.id
//查询条件
// 已授权账套列表
const accAuthList = ref([])

const currentDynamicTenant = ref('')
const {createWarningModal} = useMessage();

const targetKeys: any = ref(['subjectNumber', 'direction', 'number', 'amount', 'wbAmount', 'reviewStatus', 'bookStatus', 'preparedMan'])
const selectedKeys: any = ref([])

const targetKeys2: any = ref([])
const startRendering = ref(false)
const selectedKeys2: any = ref([])

const companyOperateStore = useCompanyOperateStoreWidthOut()


const [register, {closeModal, setModalProps}] = useModalInner((data) => {
  // 方式2
  changeBeforeModel = JSON.parse(JSON.stringify(formItems.value))
  setModalProps({minHeight: 300});

})


let count = 0

async function reLifeKmList(dynamicTenant, sameYear) {
  if (hasBlank(dynamicTenant)) return
  let tenantName = dynamicTenant.split('-')[0] + '-' + dynamicTenant.split('-')[1]
}

async function reLifeEtcList(dynamicTenant) {

}

const oldStrYear = ref('')
const stockFlag = ref()


let isChanged: boolean = false

async function handleOk() {
  if(formItems.scope == '1'){
    if ((formItems.value.cwhcode??true) == true){
      message.error('请先选择存货仓库!');
      return
    }
  }
  formItems.value.accId = currentDynamicTenant.value
  formItems.value.iyear = iyear.value
  //启用日期标记
  formItems.value.flg = stockFlag.value
  formItems.value.rkBcheck = rkBcheck.value
  formItems.value.ckBcheck = ckBcheck.value
  formItems.value.hsFlg = hsFlg.value
  emit('save', unref(formItems.value))
  closeModal()
  return true
}

async function handleClose() {
  if (null != formItems.value.openOne && formItems.value.openOne == 1) {
    await closeCurrent()
    router.push('/zhongZhang/home/welcome')
  }
  closeModal()
}

// 查询

let radiovalue = ref('2');
const riqi: any = ref([]);

const getAssistNameByKey = (key, list) => {
  let arr = list.filter(item => key == item.key)
  return arr.length > 0 ? arr[0].title : '未知'
}


const chList:any = ref([]);
const searchData:any = ref([]);
const ckList: any = ref([]);
const rqList: any = ref([]);
const chcList: any = ref([]);
const qiFlag: any = ref([]);

async function initData() {
  //核算日期
  rqList.value = await useRouteApi(findRiqiList,{schemaName: currentDynamicTenant})({
    iyear: iyear.value,
     id: id.value
  })
  //启用日期标记
  qiFlag.value = rqList.value.stockFlag
}
const id: any = ref([]);
const iyear: any = ref('2022');
const rkBcheck = ref('')
const ckBcheck = ref('')
const hsFlg = ref('')
const dynamicAdReload = async (obj) =>{
  currentDynamicTenant.value=obj.accountMode
  iyear.value=obj.year
  formItems.riqi = ''
  console.log(obj)
  id.value = obj.target.id
  rkBcheck.value = obj.target?.kcCgrkCheck
  ckBcheck.value = obj.target?.kcXsckCheck
  hsFlg.value = obj.target?.kcCostAccounting
  initData()
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
