<template>
  <BasicModal
    width="600px"
    :height="415"
    class="spaceLogo"
    v-bind="$attrs"
    @ok="handleOk()"
    @register="register"
    :canFullscreen="false"
    :footer="null"
    loadingTip="查询参数初始化中"
  >
    <template #title>
      <div style="height: 30px;width: 100%;background-color: #5f375c;color: white;line-height: 30px;">
        <AppstoreOutlined  style="margin: 0 2px;font-size: 14px;"/>
        <span v-if="isEdit == false" style="font-size: 14px">新增盘点单</span>
        <span v-if="isEdit == true" style="font-size: 14px">修改盘点单</span>
      </div>
    </template>
    <div style="display: inline-flex;justify-content: space-between;width: 100%;">
      <div style="width: 100%;height: 100%;">
        <div style="text-align: center;padding: 10px 0 5px;">
          <PlusCircleTwoTone style="font-size: 24px;color: #0096c7;margin-top: 2px"/>
          <span  v-if="isEdit == false" style="line-height:30px;font-size: 24px;color: #0096c7;font-weight: bold;">&ensp;新增盘点单</span>
          <span v-if="isEdit == true" style="line-height:30px;font-size: 24px;color: #0096c7;font-weight: bold;">&ensp;修改盘点单</span>
        </div>
        <div class="nc-open-content">
          <div class="open-content-up">

            <div class="border-div" style="padding-left: 20%;">
              <span>业务范围</span>
              <AccountPicker  theme="three" readonly @reloadTable="dynamicAdReload"/>
            </div>

            <div class="border-div">
              <span>盘点信息</span>
              <div style="padding-left: 15px;">
                <label>盘点日期:</label>
                <a-date-picker  style="width: 35%;text-align: center;" :disabled-date="disabledDate"  format="YYYY-MM-DD"
                                v-model:value="formItems.startDate1"  :disabled="isEdit" placeholder="盘点开始日期" />
                -
                <a-date-picker  style="width: 35%;text-align: center;"  :disabled-date="disabledDate" format="YYYY-MM-DD"
                                v-model:value="formItems.stopDate1"  :disabled="isEdit" placeholder="盘点结束日期" />
              </div>

              <div style="padding-left: 15px;">
                <label>盘点仓库:</label>
                <a-select
                  v-model:value="formItems.cwhcode"
                  :show-arrow="false"
                  :filter-option="true"
                  :not-found-content="null"
                  style="width: 70%;text-align: center;"
                  :disabled="isEdit"
                  @keydown.enter.native="$refs.focus2.focus()"
                >
                  <a-select-option v-for="data in searchData" :key="data.key" :value="data.id">{{ data.label }}</a-select-option>
                </a-select>
                <a style="font-weight: bold;font-size: 18px;"><LinkOutlined @click="stockCangKuModalShow" /></a>
              </div>

              <div style="padding-left: 15px;">
                <label>盘点范围:</label>
                <a-select
                  v-model:value="formItems.bstyle"
                  style="width: 70%;text-align: center;"
                  :disabled="isEdit"
                  ref="select"
                >
                  <a-select-option value="0">仓库</a-select-option>
                  <a-select-option value="1">存货分类</a-select-option>
                  <a-select-option value="2">存货</a-select-option>
                  <!--          <a-select-option value="3">存货+批号</a-select-option>-->
                  <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
                </a-select>


                <template v-if="formItems.bstyle === '1'">
                  <label>存货分类:</label>
                  <a-select
                    v-model:value="formItems.classList"
                    style="width: 75%;text-align: center;"
                    ref="select"
                    mode="multiple"
                    :disabled="isEdit"
                    @change="handleChangeClass"
                  >
                    <a-select-option
                      v-for="item in chcList"
                      :key="item.uniqueStockclass"
                      :value="item.uniqueStockclass"
                    >
                      {{ item.stockClass+'-'+ item.stockCclassName}}
                    </a-select-option>
                    <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
                  </a-select>
                  <br/><br/>
                </template>

                <template v-else-if="formItems.bstyle === '2'">
                  <label>存  货:</label>
                  <a-select
                    v-model:value="formItems.cunList"
                    style="width: 75%;text-align: center;"
                    mode="multiple"
                    ref="select"
                    :disabled="isEdit"
                  >
                    <a-select-option
                      v-for="item in chList"
                      :key="item.stockNum"
                      :value="item.stockNum+'-'+item.stockClass"
                    >
                      {{ item.stockNum+'-'+ item.stockName}}
                    </a-select-option>
                    <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
                  </a-select>
                  <br/><br/>
                </template>
                <template v-else-if="formItems.bstyle === '3'">
                  <label>存货+批号:</label>
                  <a-select
                    v-model:value="formItems.classList"
                    style="width: 75%;text-align: center;"
                    mode="multiple"
                    ref="select"
                    :disabled="isEdit"
                  >
                    <a-select-option
                      v-for="item in chpcList"
                      :key="item.stockNum"
                      :value="item.stockNum"
                    >
                      {{ item.stockNum+'-'+ item.stockName}}
                    </a-select-option>
                    <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
                  </a-select>
                  <br/><br/>
                </template>

              </div>

              <div style="padding-left: 15px;">
                <label>盘点部门:</label>
                <a-select
                  v-model:value="formItems.cdepcode"
                  :show-arrow="false"
                  :filter-option="true"
                  :not-found-content="null"
                  style="width: 70%;text-align: center;"
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

              <div style="padding-left: 15px;">
                <label>盘  点  人:</label>
                <a-select
                  v-model:value="formItems.pdUserid"
                  :show-arrow="false"
                  :filter-option="true"
                  :not-found-content="null"
                  style="width: 26%;text-align: center;"
                  @keydown.enter.native="$refs.focus2.focus()"
                >
                  <a-select-option
                    v-for="item in userList"
                    :key="item.id"
                    :value="item.id"
                  >
                    {{ item.psnCode+'-'+ item.psnName}}
                  </a-select-option>
                </a-select>

                <a style="font-weight: bold;font-size: 18px;"><LinkOutlined @click="stockPsnShow('1')" /></a>


                <label style="padding-left:25px;">库  管  员:</label>
                <a-select
                  v-model:value="formItems.kgUserid"
                  :show-arrow="false"
                  :filter-option="true"
                  :not-found-content="null"
                  style="width: 26%;text-align: center;"
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
                <a style="font-weight: bold;font-size: 18px;"><LinkOutlined @click="stockPsnShow('2')" /></a>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right-btns" style="float: right;">
      <Button @click="closeModal()">取消</Button>
      <Button v-if="isEdit" style="width: 100px;margin-left: 25px" @click="handleOk(false)" type="primary" :disabled="saveClick">确定</Button>
      <Button v-if="!isEdit" style="width: 100px;margin-left: 20px" @click="handleOk(false)" type="primary" :disabled="saveClick">生成</Button>
    </div>
    <StockCangKuModalPop @throwData="throwStockCangKuData" @register="registerStockCangKuModalPage" />
    <DeptModalPop @register="registerSelectDeptPage" @save="doDeptData"/>
    <SelectPsn @register="registerSelectPsnPage" @save="doPsnData"/>
  </BasicModal>
</template>
<script setup="props, {content}" lang="ts">
import { ref, unref } from 'vue'
import moment from "moment";
import {BasicModal, useModal, useModalInner} from '/@/components/Modal'
import {Select as ASelect,Input as AInput,  DatePicker as ADatePicker, Button, message} from "ant-design-vue"
import {useMessage} from "/@/hooks/web/useMessage";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {
  PlusCircleOutlined,
  FormOutlined,PlusCircleTwoTone,AppstoreOutlined,
  CaretDownOutlined,LinkOutlined
} from '@ant-design/icons-vue'
import StockCangKuModalPop from '/@/views/boozsoft/stock/stock_cangku/popup/stockCangKuModalPop.vue';
import DeptModalPop from "/@/views/boozsoft/global/popup/dept/select-dept.vue";
import SelectPsn from "/@/views/boozsoft/global/popup/dept/select-psn.vue";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";

import {
  findDeptList,
  findSearchAll,
  findUserList,
  findAllStockClass,
  findAllStock,
  checkAdd,
  deleteSettModes
} from '/@/api/record/stock/stock_taking'
import {
  psnFindByFlag
} from '/@/api/psn/psn'

const ATextarea=AInput.TextArea
const ASelectOption = ASelect.Option
const {
  createErrorModal
} = useMessage()

const emit=defineEmits(['register','save'])

const formItems:any = ref({
  bstyle: '0',
  isEdit: false,
  classList: [],
  chList: []
})

let changeBeforeModel:any = {}

const database:any = ref({})
const isEdit:any = ref(false)
const searchData:any = ref([]);
const deptList:any = ref([]);
const userList:any = ref([]);
const chList:any = ref([]);
const chcList:any = ref([]);
const chpcList:any = ref([]);
import dayjs, {Dayjs} from 'dayjs';
const [register, { closeModal }] = useModalInner(async(data) => {
  // 方式2
  database.value = data.data.database
  formItems.value.iyear = data.data.iyear
  //初始化数据
  initData()
  if(data.obj){
    formItems.value.id = data.obj.id
    formItems.value.ccode = data.obj.ccode
    formItems.value.startDate1 = dayjs(data.obj.startDate)
    formItems.value.stopDate1 = dayjs(data.obj.stopDate)
    formItems.value.ddate = data.obj.ddate
    formItems.value.bstyle   = data.obj.bstyle
    formItems.value.cdepcode = data.obj.cdepcode
    formItems.value.pdUserid = data.obj.pdUserid
    formItems.value.kgUserid = data.obj.kgUserid
    formItems.value.cwhcode  = data.obj.cwhcode
    formItems.value.iyear  = data.obj.iyear
    isEdit.value = true
  }else{
    formItems.value = {
      bstyle: '0',
      classList: [],
      chList: []
    }
    isEdit.value = false
  }
  changeBeforeModel = JSON.parse(JSON.stringify(formItems.value))
})
let isChanged:boolean = true
async function handleOk(fls) {

  if (formItems.value.bstyle==undefined || formItems.value.bstyle=='') {
    createErrorModal({
      iconType: 'error',
      title: '提示',
      content: '请选择盘点范围！'
    })
    return false
  }
  formItems.value.startDate = dayjs(formItems.value.startDate1).format('YYYY-MM-DD')
  formItems.value.stopDate = dayjs(formItems.value.stopDate1).format('YYYY-MM-DD')
  //修改
  if(isEdit.value){
    formItems.value.isEdit=true
    emit('save', unref(formItems))
    closeModal()
  }else {
    //新增
    //验证范围是否重复
    // 1.全仓库未审核 则不能添加
    // 2.存货分类未审核  已添加 不能重复
    let ss = await useRouteApi(checkAdd,{schemaName: database})({
      cwhcode: formItems.value.cwhcode,
      bstyle: formItems.value.bstyle,
      classList: formItems.value.classList,
      cunList: formItems.value.cunList,
    })
    if(ss === false){
      message.error("范围存在已被盘点内容！")
      return
    }
    formItems.value.isEdit=false
    emit('save', unref(formItems))
    closeModal()
  }
  return true
}

async function handleSearch(val) {
  searchData.value=[]
  let searchList=await useRouteApi(findSearchAll, {schemaName: database})(val)
  searchData.value=searchList
}

const [registerStockCangKuModalPage, { openModal: openStockCangKuModalPage }] = useModal();
const [registerSelectDeptPage, {openModal: openSelectDeptPage}] = useModal()
const [registerSelectPsnPage, {openModal: openSelectPsnPage}] = useModal()

const stockCangkuId:any = ref('0');
function stockCangKuModalShow() {
  openStockCangKuModalPage(true,{
    database:database.value,
  })
}

function throwStockCangKuData(data,ckFlag) {
  console.log(data)
  // 独立仓库
  if (ckFlag === '1') {
    formItems.value.cwhcode = data[0].num
  }else{
// 级别仓库
  }
}
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
async function initData() {
  //部门 deptList
  deptList.value = await useRouteApi(findDeptList,{schemaName: database})({})
  //仓库
  await handleSearch('')
  //人员
  userList.value = await useRouteApi(psnFindByFlag,{schemaName: database})({})
  //存货分类
  chcList.value = await useRouteApi(findAllStockClass,{schemaName: database})({})
  //存货
  chList.value = await useRouteApi(findAllStock,{schemaName: database})({})
  //存货——批次
  chpcList.value = await useRouteApi(findAllStock,{schemaName: database})({})
}
function handleChangeClass(value: string[]) {
  console.log(value)

}
const dynamicAdReload = async (obj) =>{


}
const range = (start: number, end: number) => {
  const result = [];

  for (let i = start; i < end; i++) {
    result.push(i);
  }

  return result;
};

const disabledDate = (current: Dayjs) => {
  // Can not select days before today and today
  return current && current <= dayjs().subtract(1, 'day').endOf('day');
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
  width: 200px;
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
