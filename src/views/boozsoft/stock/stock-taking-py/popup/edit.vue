<template>
  <BasicModal
    width="700px"
    v-bind="$attrs"
    title="盘点单"
    @ok="handleOk()"
    @register="register"
  >
    <template #title>
      <div style="display: flex;" class="vben-basic-title">
        <span style="line-height:40px;font-size: 28px;">
          <PlusCircleOutlined v-if="!isEdit" style="font-size: 34px;font-weight: bold;"/>
          <FormOutlined v-if="isEdit" style="font-size: 34px;font-weight: bold;" /> &nbsp;&nbsp;盘点单
        </span>
      </div>
      <div style="display: inline-block;position:absolute;right: 40px;top: 10px;z-index: 100000;background:#ffffff">
        <img src="../../../../../assets/images/012.png" style="height:80px;margin-right: 10px;"/>
      </div>
    </template>
    <div
      class="nc-open-content"
    >
      <div class="open-content-up" style="text-align: center;margin-top: 10%;">

        <label>盘点日期:</label>
        <a-date-picker  style="width: 140px;" v-model:value="formItems.startDate"  placeholder="价格生效日期" />
        -
        <a-date-picker  style="width: 140px;"  v-model:value="formItems.stopDate"  placeholder="价格失效日期" />
        <br/><br/>
        <label>盘点仓库:</label>
        <span>
          <a-select
            v-model:value="formItems.cwhcode"
            :show-arrow="false"
            :filter-option="true"
            :not-found-content="null"
            style="width: 260px"
            @keydown.enter.native="$refs.focus2.focus()"
          >
            <a-select-option v-for="data in searchData" :key="data.key" :value="data.key">{{ data.label }}</a-select-option>
          </a-select>
          &nbsp;
          <a style="font-weight: bold;font-size: 18px;"><LinkOutlined @click="stockCangKuModalShow" /></a>
        </span>
        <br/><br/>
        <label>盘点范围:</label>
        <a-select
          v-model:value="formItems.bstyle"
          style="width: 300px;text-align: center;"
          ref="select"
        >
          <a-select-option value="0">全仓库</a-select-option>
          <a-select-option value="1">存货分类</a-select-option>
          <a-select-option value="2">存货</a-select-option>
          <a-select-option value="3">存货+批号</a-select-option>
          <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
        </a-select>
        <br/><br/>

        <template v-if="formItems.bstyle === '1'">
          <label>存货分类:</label>
          <a-select
            v-model:value="formItems.classList"
            style="width: 300px;text-align: center;"
            ref="select"
            mode="multiple"
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
          <label>存 货:</label>
          <a-select
            v-model:value="formItems.cunList"
            style="width: 300px;text-align: center;"
            mode="multiple"
            ref="select"
          >
            <a-select-option
              v-for="item in chList"
              :key="item.stockNum"
              :value="item.stockNum+item.stockClass"
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
            style="width: 300px;text-align: center;"
            mode="multiple"
            ref="select"
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

        <label>盘点部门:</label>
        <a-select
          v-model:value="formItems.cdepcode"
          :show-arrow="false"
          :filter-option="true"
          :not-found-content="null"
          style="width: 260px"
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
        <br/><br/>

        <label>盘点人:</label>
        <a-select
          v-model:value="formItems.pdUserid"
          :show-arrow="false"
          :filter-option="true"
          :not-found-content="null"
          style="width: 260px"
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

        <br/><br/>

        <label>库管员:</label>
          <a-select
            v-model:value="formItems.kgUserid"
            :show-arrow="false"
            :filter-option="true"
            :not-found-content="null"
            style="width: 260px"
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
    <template #footer>
      <a-button @click="closeModal()">取消</a-button>
      <a-button v-if="isEdit" @click="handleOk(false)" type="primary" :disabled="saveClick">确定</a-button>
      <a-button v-if="!isEdit" @click="handleOk(false)" :disabled="saveClick">保存</a-button>
      <a-button v-if="!isEdit" @click="handleOk(true)" :disabled="saveClick" type="primary">保存并新增</a-button>
    </template>

    <StockCangKuModalPop @throwData="throwStockCangKuData" @register="registerStockCangKuModalPage" />
    <DeptModalPop @register="registerSelectDeptPage" @save="doDeptData"/>
    <SelectPsn @register="registerSelectPsnPage" @save="doPsnData"/>
  </BasicModal>
</template>
<script setup="props, {content}" lang="ts">
import { ref, unref } from 'vue'
import moment from "moment";
import {BasicModal, useModal, useModalInner} from '/@/components/Modal'
import {Select as ASelect,Input as AInput,  DatePicker as ADatePicker, message} from "ant-design-vue"
import {useMessage} from "/@/hooks/web/useMessage";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {
  PlusCircleOutlined,
  FormOutlined,
  CaretDownOutlined,LinkOutlined
} from '@ant-design/icons-vue'
import StockCangKuModalPop from '/@/views/boozsoft/stock/stock_cangku/popup/stockCangKuModalPop.vue';
import DeptModalPop from "/@/views/boozsoft/global/popup/dept/select-dept.vue";
import SelectPsn from "/@/views/boozsoft/global/popup/dept/select-psn.vue";
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
import dayjs from 'dayjs';
const [register, { closeModal }] = useModalInner((data) => {
  // 方式2
  database.value = data.data.database
  //初始化数据
  initData()
  if(data.obj){
    formItems.value.id = data.obj.id
    formItems.value.ccode = data.obj.ccode
    formItems.value.startDate = moment(data.obj.startDate, 'YYYY-MM-DD')
    formItems.value.stopDate = moment(data.obj.stopDate, 'YYYY-MM-DD')
    formItems.value.ddate = data.obj.ddate
    formItems.value.bstyle   = data.obj.bstyle
    formItems.value.cdepcode = data.obj.cdepcode
    formItems.value.pdUserid = data.obj.pdUserid
    formItems.value.kgUserid = data.obj.kgUserid
    formItems.value.cwhcode  = data.obj.cwhcode
    isEdit.value = true
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
  if(isChanged){
    //验证范围是否重复
    // 1.全仓库未审核 则不能添加
    // 2.存货分类未审核  已添加 不能重复

    let ss = await useRouteApi(checkAdd,{schemaName: database})({
      cwhcode: formItems.value.cwhcode,
      bstyle: formItems.value.bstyle,
      classList: formItems.value.classList,
      cunList: formItems.value.cunList,
    })
    console.log(ss)
    if(ss === false){
      message.error("范围存在已被盘点内容！")
      return
    }

    if(fls === true){
      emit('save', unref(formItems))
      formItems.value = {}
      changeBeforeModel = JSON.parse(JSON.stringify(formItems.value))
    }else{
      emit('save', unref(formItems))
      closeModal()
    }
    return true
  }
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


</script>
<style>
.vben-basic-title {
  color: #0096c7 !important;
  border:none !important;
}

.ant-modal-body {
  padding: 0px;
  border-bottom: 1px solid rgb(1, 129, 226);
  border-left: none;
  border-right: none;
  border-top: none !important;
}
.ant-modal-header{
  border: none !important;
}
</style>
<style lang="less" scoped>
:deep(.vben-basic-title) {
  color: #0096c7 !important;
}
.ant-modal-header{
  border: none !important;
}


:deep(.ant-select-single:not(.ant-select-customize-input)
.ant-select-selector
.ant-select-selection-search-input) {
  border: none !important;
}

.vben-basic-title {
  color: #0096c7 !important;
  border: none !important;
}

.ant-modal-body {
  padding: 0px;
  border-bottom: 1px solid rgb(1, 129, 226);
  border-left: none;
  border-right: none;
  border-top: none !important;
}

.red_span {
  color: red;
  font-weight: bold;
  display: inline-block;
  width: 20px;
  text-align: right;
}

.nc-open-content {
  input {
    width: 50%;
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
    font-weight: bold;
    font-size: 14px;
  }

  .abc{
    border-bottom: 2px solid #666666 !important;
    font-size: 18px;
  }

  .ant-input:focus {
    box-shadow: none;
  }

  :deep(.ant-select-selector) {
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
    font-weight: bold;
    font-size: 14px;
  }

  label {
    text-align: left;
    width: 120px;
    display: inline-block;
    padding-top: 5px;
    padding-left: 5px;
    padding-bottom: 5px;
    color: #535353;
    font-size: 13px;
    margin-left: 1em;
    font-weight: bold;
  }

  .open-content-down {
    margin-top: 5%;

    .ant-tabs-tab-active::before {
      position: absolute;
      top: 0px;
      left: 0;
      width: 100%;
      border-top: 2px solid transparent;
      border-radius: 2px 2px 0 0;
      transition: all 0.3s;
      content: '';
      pointer-events: none;
      background-color: rgb(1, 143, 251);
    }
  }
}
</style>
