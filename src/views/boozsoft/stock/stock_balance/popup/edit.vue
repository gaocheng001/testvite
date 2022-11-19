<template>
  <BasicModal
    width="750px"
    v-bind="$attrs"
    :closable="false"
    :maskClosable="false"
    :draggable="false"
    @ok="handleOk()"
    @register="register"
    :canFullscreen="false"
    :footer="null"
  >
    <template #title>
      <div style="height: 30px;width: 100%;background-color: #5f375c;color: white;line-height: 30px;text-align: left;">
        <AppstoreOutlined  style="margin: 0 2px;font-size: 14px;"/>
        <span style="font-size: 14px">存货管理</span>
      </div>
    </template>
    <div style="display: inline-flex;justify-content: space-between;width: 100%;">
      <div style="width: calc(100% - 150px);height: 100%;">
        <div style="text-align: center;padding: 10px 0 5px;">
          <PlusCircleOutlined style="font-size: 24px;color: #0096c7;margin-top: 2px"/>
          <span style="line-height:30px;font-size: 24px;color: #0096c7;font-weight: bold;">&ensp;存货期初余额</span>
        </div>
        <div class="nc-open-content">
          <div class="open-content-up">
            <div class="border-div">
              <span>存货信息</span>
              <div>
                <label style="font-size: 13px;font-weight: bold;color: #5a5a5a">存货名称：</label>
                &nbsp;
                <a-select
                  allowClear
                  show-search
                  v-model:value="formItems.stockNum"
                  style="width: 350px;text-align: center;"
                  :filter-option="filterOption"
                  @change="handleChange"
                >
                  <a-select-option v-for="data in searchData" :key="data.stockNum+data.stockName" :data="data" :value="data.stockNum">{{ data.stockNum }} - {{ data.stockName }}</a-select-option>
                  <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
                </a-select>
                &nbsp;
                <a style="font-weight: bold;font-size: 18px;"><LinkOutlined @click="stockInfoModalShow" /></a>
                <br>
                <div style="margin-top: 10px;display: inline-block;width: 230px;">
                  <label style="font-size: 13px;font-weight: bold;color: #5a5a5a">规格型号：</label>
                  {{ formItems.stockGgxh }}
                </div>
                <div style="margin-top: 10px;width: 200px;float: right;">
                  <label style="font-size: 13px;font-weight: bold;color: #5a5a5a">计量单位名称：</label>
                  {{ unitName }}
                </div>
              </div>
            </div>
            <div class="border-div">
              <span>期初数量</span>
              <div style="margin-left: 14px;">
                <label style="font-size: 13px;font-weight: bold;color: #5a5a5a">主计量:</label>
                &nbsp;
                <a-input readonly style="width: 100px;" :value="formItems.primaryUnit" />
                <span v-if="!hasBlank(formItems.secondaryUnit1)">
                   &emsp;
                  <label style="font-size: 13px;font-weight: bold;color: #5a5a5a">计量1:</label>
                  &nbsp;
                  <a-input readonly style="width: 80px;" :value="formItems.secondaryUnit1" />
                </span>

                <span v-if="!hasBlank(formItems.secondaryUnit2)">
                  &emsp;
                  <label style="font-size: 13px;font-weight: bold;color: #5a5a5a">计量2:</label>
                  &nbsp;
                  <a-input readonly style="width: 80px;" :value="formItems.secondaryUnit2" />
                </span>


                <br>
                <label style="font-size: 13px;font-weight: bold;color: #5a5a5a">主数量:</label>
                &nbsp;
                <a-input-number
                  :min="0"
                  v-model:value="formItems.primaryNumber"
                  @keyup="multiUnitNumber('1')"
                  @step="multiUnitNumber('1')"
                />
                <span v-if="!hasBlank(formItems.secondaryUnit1)">
                   &emsp;
                    <label style="font-size: 13px;font-weight: bold;color: #5a5a5a">数量1:</label>
                    &nbsp;
                    <a-input-number
                      :min="0"
                      v-model:value="formItems.primaryNumber1"
                      @keyup="multiUnitNumber('2')"
                      @step="multiUnitNumber('2')"
                    />
                </span>

                <span v-if="!hasBlank(formItems.secondaryUnit2)">
                   &emsp;
                  <label style="font-size: 13px;font-weight: bold;color: #5a5a5a">数量2:</label>&nbsp;
                  <a-input-number
                    :min="0"
                    style="margin-left: 3px;"
                    v-model:value="formItems.primaryNumber2"
                    @keyup="multiUnitNumber('3')"
                    @step="multiUnitNumber('3')"
                  />
                </span>
              </div>
            </div>
            <div class="border-div">
              <span>期初金额</span>
              <div style="margin-left: 14px;">
                <label style="font-size: 13px;font-weight: bold;color: #5a5a5a"> 无税单价:</label>&nbsp;
                <a-input style="width: 140px;" v-model:value="formItems.price"
                         oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,10})?).*$/g, '$1')"
                         onblur="value = value == ''?'0.00':(parseFloat(value).toFixed(2).replace(/\d+/, function (n) {return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) { return $1 + ','})}));"
                         @keyup="countPrimaryNumber('price')"
                         @blur="countPrimaryNumber('price')"
                />
                &emsp;&emsp;
                <label style="font-size: 13px;font-weight: bold;color: #5a5a5a"> 无税金额:</label>&nbsp;
                <a-input style="width: 140px;" v-model:value="formItems.money"
                         oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,10})?).*$/g, '$1')"
                         onblur="value = value == ''?'0.00':(parseFloat(value).toFixed(2).replace(/\d+/, function (n) {return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) { return $1 + ','})}));"
                         @keyup="countPrimaryNumber('money')"
                         @blur="countPrimaryNumber('money')"
                />
              </div>
            </div>
            <div class="border-div">
              <span>批次效期</span>
              <div style="margin-left: 14px;">
                <label style="font-size: 13px;font-weight: bold;color: #5a5a5a"> 批号:</label>&nbsp;
                <a-input style="width: 140px;margin-left: 27px;" v-model:value="formItems.batchNumber"/>
                <br>
                <label style="font-size: 13px;font-weight: bold;color: #5a5a5a"> 生产日期:</label>&nbsp;
                <a-date-picker style="width: 140px;" placeholder="" v-model:value="formItems.dpdate" @change="dpdateChange"/>
                &emsp;&emsp;
                <label style="font-size: 13px;font-weight: bold;color: #5a5a5a"> 失效日期:</label>&nbsp;
                <a-date-picker style="width: 140px;" placeholder="" v-model:value="formItems.dvdate" @change="dvdateChange"/>
              </div>
            </div>
            <div class="border-div">
              <span>单据信息</span>
              <div style="margin-left: 14px;">
                <label style="font-size: 13px;font-weight: bold;color: #5a5a5a"> 入库单号:</label>&nbsp;
                <a-input  style="width: 140px;" v-model:value="formItems.stockRukuNumber"/>
                &emsp;&emsp;
                <label style="font-size: 13px;font-weight: bold;color: #5a5a5a"> 入库日期:</label>&nbsp;
                <a-date-picker style="width: 140px;" placeholder="" @change="ddateChenck" v-model:value="formItems.stockRukuDate" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right-btns">
        <a-button style="width: 100px;" shape="round" @click="handleOk('1')"  type="primary">保存并新增</a-button>
        <a-button style="width: 100px;margin-top: 10px" shape="round" @click="handleOk('0')"  >保存</a-button>
        <a-button style="width: 100px;margin-top: 10px" shape="round" @click="closeOk">取消</a-button>
      </div>
    </div>

    <StockInfiModalPop @throwData="throwStockInfoData" @register="registerStockInfoModalPage"/>
    <StockCangKuModalPop @throwData="throwStockCangKuData" @register="registerStockCangKuModalPage" />
    <SelectProject @save="saveSelectProject" @register="registerSelectProjectPage"/>
  </BasicModal>
</template>
<script setup="props, { content }" lang="ts">
import {LinkOutlined, FormOutlined,AppstoreOutlined,PlusCircleOutlined} from '@ant-design/icons-vue'
import {reactive, ref} from 'vue';
import {BasicModal, useModal, useModalInner} from '/@/components/Modal';
import {
  Spin as Aspin,
  DatePicker as ADatePicker,
  InputNumber as AInputNumber,
  Form as AForm,
  Input as AInput,
  Select as ASelect,
  Statistic as AStatistic,
} from 'ant-design-vue';
import {getCurrentAccountName, hasBlank} from "/@/api/task-api/tast-bus-api";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useMessage} from "/@/hooks/web/useMessage";
import StockInfiModalPop from "/@/views/boozsoft/stock/stock_info/popup/stockInfoModalPop.vue";
import StockCangKuModalPop from '/@/views/boozsoft/stock/stock_cangku/popup/stockJcCangKuByParentIdModalPop.vue';

import {
  findAllBySearch,
  findStockById,
  findByStockNum2,
  multiUnitOfMea,
  multiUnitOfMeaMX,
  singleUnitOfMea, findAll
} from "/@/api/record/stock/stock";
import {getAllProject, stockBalanceEdit} from "/@/api/record/stock/stock_balance";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import dayjs from "dayjs";
import SelectProject from '/@/views/boozsoft/global/popup/project/select-project.vue'
import {saveLog} from "/@/api/record/system/group-sys-login-log";

const ASelectOption = ASelect.Option;
  const AInputSearch = AInput.Search;
  const AStatisticCountdown = AStatistic.Countdown;
  const AFormItem = AForm.Item;
  const {createConfirm, createWarningModal } = useMessage();
  const emit=defineEmits(['register']);
  const formItems:any = ref({})
  const database = ref(getCurrentAccountName(true));
  const secondary1UnitDisabled = ref(false);
  const secondary2UnitDisabled = ref(false);
  const batchDisabled = ref(false);
  const dvdateDisabled = ref(false);
  const dataReadonly1 = ref(false);
  const dataReadonly2 = ref(false);
  const secondaryUnitAllFlag = ref(false);
  // 动态小数位数
  const numberDecimalPlace = ref(10);
  const stockMeasurementType = ref('单计量');
  const multiUnitOfMeaMXList:any = ref([]);
  const iyear:any = ref('');
  const cangkuFlag:any = ref('');
  const stockBalanceId:any = ref('');
  const tenantId:any = ref('');
  const iineId:any = ref('');
  const searchData:any = ref([]);
  const stockIndateUnit:any = ref('');
  const stockIndateDuration:any = ref('');
  const cangku = reactive({
    id:'',
    cangkuName:''
  })
const projectClassCtl:any = ref('');
const projectInfo:any = ref([]);
const unitName:any = ref('');
const dynamicTenant:any = ref('');


  const [registerStockInfoModalPage, {openModal: openStockInfoModalPage}] = useModal();
  const [registerStockCangKuModalPage, { openModal: openStockCangKuModalPage }] = useModal();
  const [registerSelectProjectPage, { openModal: openSelectProjectPage }] = useModal()

  // 数据库模式名称
  const [register, { closeModal }] = useModalInner( async (data) => {
    unitName.value=''
    dynamicTenant.value=data.dynamicTenant
    database.value=data.database
    iyear.value=data.iyear
    cangkuFlag.value=data.cangkuFlag
    stockBalanceId.value=data.tableData.id
    tenantId.value=data.tableData.tenantId
    iineId.value=data.tableData.iineId
    stockMeasurementType.value=data.tableData.cunitidType

    formItems.value={}
    formItems.value.stockNum=data.tableData.stockNum
    formItems.value.stockName=data.tableData.stockName
    formItems.value.stockGgxh=data.tableData.stockGgxh
    formItems.value.cunitidType=data.tableData.cunitidType
    formItems.value.stockClass=data.tableData.stockClass
    formItems.value.stockId=data.tableData.stockNum
    formItems.value.stockRukuNumber=data.tableData.stockRukuNumber
    formItems.value.stockRukuDate=hasBlank(data.tableData.stockRukuDate)?null:dayjs(data.tableData.stockRukuDate)
    formItems.value.citemCode=data.tableData.citemCode
    formItems.value.stockCangkuId=data.tableData.stockCangkuId
    // 全部项目
    findAllPro()

    // 主计量:id、名称、数量
    formItems.value.primaryUnit=data.tableData.cunitidName
    formItems.value.cunitid=data.tableData.cunitid
    formItems.value.primaryNumber=data.tableData.baseQuantity

    formItems.value.price=data.tableData.price
    formItems.value.money=data.tableData.icost
    // 辅计量1:id、名称、数量
    if(data.tableData.subQuantity1>0){
      secondary1UnitDisabled.value=true
      formItems.value.secondaryUnit1=data.tableData.cunitidF1Name
      formItems.value.cunitidF1=data.tableData.cunitidF1
      formItems.value.primaryNumber1=data.tableData.subQuantity1
    }

    // 辅计量2:id、名称、数量
    if(data.tableData.subQuantity2>0){
      secondary2UnitDisabled.value=true
      formItems.value.secondaryUnit2=data.tableData.cunitidF2Name
      formItems.value.cunitidF2=data.tableData.cunitidF2
      formItems.value.primaryNumber2=data.tableData.subQuantity2
    }

    if(data.tableData.batchNumber!=='' && data.tableData.batchNumber!==null){
      batchDisabled.value=true
      formItems.value.batchNumber=data.tableData.batchNumber
    }

    if(data.tableData.dvdate!=='' && data.tableData.dvdate!==null){
      dvdateDisabled.value=true
      formItems.value.dvdate=dayjs(data.tableData.dvdate)
    }
    if(data.tableData.dpdate!=='' && data.tableData.dpdate!==null){
      dvdateDisabled.value=true
      formItems.value.dpdate=dayjs(data.tableData.dpdate)
    }

    if(data.tableData.cangkuDuli=='0'){
      cangku.cangkuName=data.tableData.cwhcodeJoin
      cangku.id=data.tableData.stockCangkuRecordId
    }

    // 存货档案信息
    let stockObj=await useRouteApi(findByStockNum2, {schemaName: database})(data.tableData.stockId)
    stockIndateDuration.value=stockObj.stockIndateDuration
    stockIndateUnit.value=stockObj.stockIndateUnit

    if(data.tableData.cunitidType=='多计量'){
      findMultiUnitOfMea(stockObj.stockMeasurementUnit)
    }else{
      findAllSingleUnitOfMea(stockObj.stockMeasurementUnit)
    }

    let stockAll=await useRouteApi(findAll,{schemaName: database})({
      stockFlag:'',
      stockClass:'',
      searchConditon:{
        requirement:'',
        value:''
      }
    })
    searchData.value=stockAll

  });

  async function findAllPro() {
    let proAll=await useRouteApi(getAllProject, {schemaName: database})({})
    if(proAll.length>0){
      let findBy=proAll.filter(a=>a.id==formItems.value.citemCode)
      projectInfo.value=findBy
    }
  }

  async function handleOk() {
    let primaryNumber:any= formItems.value.primaryNumber==undefined || formItems.value.primaryNumber==''?0:parseFloat(formItems.value.primaryNumber)
    let price:any= formItems.value.price==undefined || formItems.value.price==''?0:parseFloat(formItems.value.price)
    let money:any= formItems.value.money==undefined || formItems.value.money==''?0:parseFloat(formItems.value.money)
    if(primaryNumber==0){
     return createWarningModal({ content: '请填写数量！' });
    }else if(price==0){
      return createWarningModal({ content: '请填写无税单价！' });
    }else if(money==0){
      return createWarningModal({ content: '请填写无税金额！' });
    }else if(batchDisabled.value&& (formItems.value.batchNumber=='' || formItems.value.batchNumber==undefined)){
      return createWarningModal({ content: '请填写批号！' });
    }else if(dvdateDisabled.value&& (formItems.value.dpdate=='' || formItems.value.batchNumber==undefined || formItems.value.batchNumber==null)){
      return createWarningModal({ content: '请选择生效日期！' });
    }else if(dvdateDisabled.value&& (formItems.value.dvdate=='' || formItems.value.dvdate==undefined||formItems.value.dvdate==null)){
      return createWarningModal({ content: '请选择失效日期！' });
    }


    formItems.value.id=stockBalanceId.value
    formItems.value.cangkuName=cangku.cangkuName
    formItems.value.iineId=iineId.value
    formItems.value.iyear=iyear.value
    formItems.value.cangkuDuli=cangkuFlag.value
    formItems.value.stockCangkuRecordId=cangku.id
    formItems.value.cmaker=useUserStoreWidthOut().getUserInfo.id

    await useRouteApi(stockBalanceEdit, {schemaName: database})(formItems.value)
    saveLogData('修改')
    emit('save', '');
    closeModal();
  }

  // 存货档案弹框
  function stockInfoModalShow() {
    openStockInfoModalPage(true, {
      database: database.value,
    })
  }
  async function throwStockInfoData(data) {
    formItems.value={}
    batchDisabled.value=false
    dvdateDisabled.value=false
    secondary1UnitDisabled.value=false
    secondary2UnitDisabled.value=false
    secondaryUnitAllFlag.value=false
    // 是否批次管理
    batchDisabled.value=data[0].stockPropertyBatch=='1'?true:false
    dvdateDisabled.value=data[0].stockIndateManage=='1'?true:false
    formItems.value.stockId=data[0].id
    formItems.value.stockNum=data[0].stockNum
    formItems.value.stockName=data[0].stockName
    formItems.value.stockGgxh=data[0].stockGgxh
    formItems.value.stockClass=data[0].stockClass
    formItems.value.cunitidType=data[0].stockMeasurementType
    stockIndateDuration.value=data[0].stockIndateDuration
    stockIndateUnit.value=data[0].stockIndateUnit
    verifyStockPrimaryType(data[0])
  }

  // 判断存货档案计量单位类型
function verifyStockPrimaryType(data) {
  stockMeasurementType.value=data.stockMeasurementType
  if(data.stockMeasurementType=='多计量'){
    dataReadonly1.value=false
    dataReadonly2.value=false
    findMultiUnitOfMea(data.stockMeasurementUnit)
  }else{
    dataReadonly1.value=true
    dataReadonly2.value=true
    findAllSingleUnitOfMea(data.stockMeasurementUnit)
  }
}

  // 获取单计量单位
  async function findAllSingleUnitOfMea(id) {
    await useRouteApi(singleUnitOfMea, {schemaName: database})('').then((res) => {
      let temp=res.filter(a=>a.id==id)
      unitName.value=temp[0].unitName
      // 类型是数量的主计量必须大于等于0
      numberDecimalPlace.value=temp[0].unitType=='2'?0:temp[0].unitType
      formItems.value.primaryUnit =temp[0].unitName
      formItems.value.cunitid =temp[0].id
    });
  }
  // 获取多计量单位
  async function findMultiUnitOfMea(id) {
    await useRouteApi(multiUnitOfMea, {schemaName: database})('').then((res) => {
      let temp=res.filter(a=>a.id==id)
      unitName.value=temp[0].unitName
      // 类型是数量的主计量必须大于等于0
      numberDecimalPlace.value=temp[0].unitType=='2'?0:temp[0].unitType
      findMultiUnitOfMeaMx(temp[0].unitCode)
    });
  }
  // 获取多计量单位明细
async function findMultiUnitOfMeaMx(id) {
  await useRouteApi(multiUnitOfMeaMX, {schemaName: database})(id).then((res) => {
    let data=res.filter(a=>!hasBlank(a.unitName))
    multiUnitOfMeaMXList.value=data
    if(data.length==1){
      formItems.value.primaryUnit =data[0].unitName
    }

    if(data.length==2){
      secondary1UnitDisabled.value=true
      let temp=data.filter(a=>a.isMain=='true')
      formItems.value.primaryUnit =temp[0].unitName
      formItems.value.secondaryUnit1 =res[1].unitName
      formItems.value.cunitid =temp[0].id
      formItems.value.cunitidF1 =res[1].id
    }
    if(data.length==3){
      secondary1UnitDisabled.value=true
      secondary2UnitDisabled.value=true
      secondaryUnitAllFlag.value=true
      let temp=data.filter(a=>a.isMain=='true')
      formItems.value.primaryUnit =temp[0].unitName
      formItems.value.secondaryUnit1 =data[1].unitName
      formItems.value.secondaryUnit2 =data[2].unitName
      formItems.value.cunitid =temp[0].id
      formItems.value.cunitidF1 =data[1].id
      formItems.value.cunitidF2 =data[2].id
    }
  });
}

function countNumber() {
  if(formItems.value.primaryNumber!==undefined && formItems.value.primaryNumber!==''){
    countPrimaryNumber('price')
    countPrimaryNumber('money')
  }else{
    formItems.value.money=''
    formItems.value.price=''
  }
}

  function countPrimaryNumber(type) {
   let primaryNumber:any= formItems.value.primaryNumber==undefined || formItems.value.primaryNumber==''?0:parseFloat(formItems.value.primaryNumber)
   let price:any= formItems.value.price==undefined || formItems.value.price==''?0:parseFloat(formItems.value.price)
   let money:any= formItems.value.money==undefined || formItems.value.money==''?0:parseFloat(formItems.value.money)
    if(primaryNumber==0){
      formItems.value.money=''
      formItems.value.price=''
      return false;
    }
    if(type=='price'){
      formItems.value.money=''
      money=primaryNumber.toFixed(10)*price.toFixed(10)
      formItems.value.money=money==0?'':money.toFixed(2)
    }
    if(type=='money'){
      formItems.value.price=''
      price=money.toFixed(4)/primaryNumber.toFixed(10)
      formItems.value.price=price==0?'':price.toFixed(2)
    }
  }

  // 多计量换算
  function multiUnitNumber(type){
    // 3级
    if(multiUnitOfMeaMXList.value.length==3){
      // 获取辅助计量1 换算率
      let conversionRate1=multiUnitOfMeaMXList.value.filter(a=>a.unitName==formItems.value.secondaryUnit1)[0].conversionRate
      let conversionRate2=multiUnitOfMeaMXList.value.filter(a=>a.unitName==formItems.value.secondaryUnit2)[0].conversionRate
      // 主计量数量
      if(type=='1'){
        formItems.value.primaryNumber1=parseFloat(formItems.value.primaryNumber/conversionRate1).toFixed(2)==0||isNaN(parseFloat(formItems.value.primaryNumber/conversionRate1).toFixed(2))?'':parseFloat(formItems.value.primaryNumber/conversionRate1).toFixed(2)
        formItems.value.primaryNumber2=parseFloat(formItems.value.primaryNumber/conversionRate2).toFixed(2)==0||isNaN(parseFloat(formItems.value.primaryNumber/conversionRate2).toFixed(2))?'':parseFloat(formItems.value.primaryNumber/conversionRate2).toFixed(2)
      }else if(type=='2'){
        // 辅计量
        formItems.value.primaryNumber=parseFloat(formItems.value.primaryNumber1*conversionRate1).toFixed(2)==0||isNaN(parseFloat(formItems.value.primaryNumber1*conversionRate1).toFixed(2))?'':Math.ceil(parseFloat(formItems.value.primaryNumber1*conversionRate1).toFixed(2))
        formItems.value.primaryNumber2=parseFloat(formItems.value.primaryNumber/conversionRate2).toFixed(2)==0||isNaN(parseFloat(formItems.value.primaryNumber/conversionRate2).toFixed(2))?'':parseFloat(formItems.value.primaryNumber/conversionRate2).toFixed(2)
      }else if(type=='3'){
        // 辅计量
        formItems.value.primaryNumber=parseFloat(formItems.value.primaryNumber2*conversionRate2).toFixed(2)==0||isNaN(parseFloat(formItems.value.primaryNumber2*conversionRate2).toFixed(2))?'':Math.ceil(parseFloat(formItems.value.primaryNumber2*conversionRate2).toFixed(2))
        formItems.value.primaryNumber1=parseFloat(formItems.value.primaryNumber/conversionRate1).toFixed(2)==0||isNaN(parseFloat(formItems.value.primaryNumber/conversionRate1).toFixed(2))?'':parseFloat(formItems.value.primaryNumber/conversionRate1).toFixed(2)
      }
    }else if(multiUnitOfMeaMXList.value.length==2){
      // 获取辅助计量1 换算率
      let conversionRate1=multiUnitOfMeaMXList.value.filter(a=>a.unitName==formItems.value.secondaryUnit1)[0].conversionRate
      // 主计量数量
      if(type=='1'){
        // 获取辅助计量1 换算率
        formItems.value.primaryNumber1=parseFloat(formItems.value.primaryNumber/conversionRate1).toFixed(2)==0||isNaN(parseFloat(formItems.value.primaryNumber/conversionRate1).toFixed(2))?'':parseFloat(formItems.value.primaryNumber/conversionRate1).toFixed(2)
      }else if(type=='2'){
        // 获取辅助计量1 换算率
        formItems.value.primaryNumber=parseFloat(formItems.value.primaryNumber1*conversionRate1).toFixed(2)==0||isNaN(parseFloat(formItems.value.primaryNumber1*conversionRate1).toFixed(2))?'':Math.ceil(parseFloat(formItems.value.primaryNumber1*conversionRate1).toFixed(2))
      }
    }
  }
//金额格式化
function toThousandFilter(num:any) {
  if (num=='' || num==null){
    return ''
  }
  return (+num || 0).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
}

const filterOption = (input: string, option: any) => {
  return option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}

async function handleChange(val,b) {
  if(hasBlank(val)){
    dataReadonly1.value=true
    dataReadonly2.value=true
    formItems.value.primaryNumber=null
    formItems.value.primaryNumber1=null
    formItems.value.primaryNumber2=null
    unitName.value=''
    return
  }
  throwStockInfoData([b.data])
}
// 时间格式化
function formatTimer(value) {
  let date:any = new Date(value);
  let y = date.getFullYear();
  let MM = date.getMonth() + 1;
  MM = MM < 10 ? "0" + MM : MM;
  let d = date.getDate();
  d = d < 10 ? "0" + d : d;
  let h = date.getHours();
  h = h < 10 ? "0" + h : h;
  let m = date.getMinutes();
  m = m < 10 ? "0" + m : m;
  let s = date.getSeconds();
  s = s < 10 ? "0" + s : s;
  return y + "-" + MM + "-" + d + " " + h + ":" + m;
}
function formatTimer2(value) {
  let date:any = new Date(value);
  let y = date.getFullYear();
  let MM = date.getMonth() + 1;
  MM = MM < 10 ? "0" + MM : MM;
  return y + "" + MM;
}

const dateFormat = 'YYYY-MM-DD';
function dpdateChange(data) {
  let dpdate_year=formatTimer(data).split(' ')[0].split('-')[0]
  let dpdate_month=formatTimer(data).split(' ')[0].split('-')[1]
  let dpdate_day=formatTimer(data).split(' ')[0].split('-')[2]
  let time=dpdate_year+':'+dpdate_month+':'+dpdate_day+''
  if(data==null){
    formItems.value.dvdate=null
  }else{
    if(stockIndateUnit.value=='天'){
      formItems.value.dvdate=dayjs(time, dateFormat).add(parseInt(stockIndateDuration.value), 'day').subtract(1, 'day')
    }else if(stockIndateUnit.value=='月'){
      formItems.value.dvdate=dayjs(time, dateFormat).add(parseInt(stockIndateDuration.value), 'month')
    }else if(stockIndateUnit.value=='年'){
      formItems.value.dvdate=dayjs(time, dateFormat).add(parseInt(stockIndateDuration.value), 'year')
    }
  }
}
function dvdateChange(data) {
  let dpdate_year=formatTimer(data).split(' ')[0].split('-')[0]
  let dpdate_month=formatTimer(data).split(' ')[0].split('-')[1]
  let dpdate_day=formatTimer(data).split(' ')[0].split('-')[2]
  let time=dpdate_year+':'+dpdate_month+':'+dpdate_day+''
  if(data==null){
    formItems.value.dpdate=null
  }else{
    if(stockIndateUnit.value=='天'){
      formItems.value.dpdate=dayjs(time, dateFormat).subtract(parseInt(stockIndateDuration.value), 'day').add(1, 'day')
    }else if(stockIndateUnit.value=='月'){
      formItems.value.dpdate=dayjs(time, dateFormat).subtract(parseInt(stockIndateDuration.value), 'month')
    }else if(stockIndateUnit.value=='年'){
      formItems.value.dpdate=dayjs(time, dateFormat).subtract(parseInt(stockIndateDuration.value), 'year')
    }
  }
}
const closeOk = () => {
  formItems.value={}
  emit('closeOk');
  closeModal();
}

function throwStockCangKuData(data,ckFlag) {
  cangku.id = data[0].id
  cangku.cangkuName = data[0].value
  cangkuFlag.value = ckFlag
  // 级别仓库
  if (ckFlag == '0') {
    cangku.cangkuName = data[0].cangkuName.replaceAll(',', '\\')
  }
}
const openSelectProject = () => {
  openSelectProjectPage(true, {
    dynamicTenantId: database.value,
    projectClassCtl: projectClassCtl.value,
  })
}
function saveSelectProject(data) {
  formItems.value.citemCode=data.id
  projectInfo.value=[data]
}

async function saveLogData(optAction) {
  let stockNum=searchData.value.filter(a=>a.stockNum==formItems.value.stockNum)[0]?.stockNum
  let stockName=searchData.value.filter(a=>a.stockNum==formItems.value.stockNum)[0]?.stockName
  let logmap={
    loginTime:new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "),
    userId: useUserStoreWidthOut().getUserInfo.username,
    userName: useUserStoreWidthOut().getUserInfo.realName,
    optRange:'1',
    optModule:'stock',
    optFunction:'库存期初余额',
    optAction:optAction,
    optContent:'操作内容【库存期初余额】,【'+stockNum+','+stockName+'】',
  }
  await saveLog(logmap)
}

const ddateChenck = async (v) => {
  let iyear=dynamicTenant.value.target.startDate.split('-')[0]
  let ddate1=dynamicTenant.value.target.startDate.replaceAll('-','')
  let ddate2=formatTimer2(v)
  // 入库日期大于账套启用日期
  if(parseInt(ddate2)>parseInt(ddate1)){
    formItems.value.stockRukuDate=dayjs((parseInt(iyear)-1)+'12-31')
  }
}
</script>
<style lang="less" scoped>
:deep(.ant-checkbox){
  margin-top: -8px;
}
:deep(.ant-select-selector), :deep(.ant-input-affix-wrapper), :deep(.ant-input),:deep(.ant-picker),:deep(.ant-input-number) {
  border: none !important;
  border-bottom: 1px solid #bdb9b9 !important;
  background: none;
  min-width: 100px;
}
.nc-open-content {
  background-image: url(/@/assets/images/homes/bg-pattern.png);
  background-repeat: no-repeat;
  background-position: 66% 8%;
  background-size: contain;
  position: relative;

  .border-div {
    position: relative;
    border: 1px #a29f9f solid;
    margin: 20px 10px;
    padding: 2.5%;
    text-align: left;
    > span {
      display: block;
      width: 80px;
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
  width: 150px;background-color: #f1f1f1;padding: 10% 4%;height: 536px;
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
</style>
