<template>
  <BasicModal
    width="800px"
    v-bind="$attrs"
    title="应付款期初余额"
    @ok="handleOk()"
    @register="register"
    :canFullscreen="false"
  >
    <template #title>
      <div style="display: flex;margin-top: 10px;margin-left: 20px;" class="vben-basic-title">
        <span style="line-height:40px;font-size: 28px;" v-if="isState=='0'">
          <PlusCircleOutlined style="font-size: 34px;font-weight: bold"/>&nbsp;&nbsp;应付款期初余额
        </span>
        <span style="line-height:40px;font-size: 28px;" v-if="isState=='1'">
          <FormOutlined style="font-size: 34px;font-weight: bold"/>&nbsp;&nbsp;应付款期初余额
        </span>
        <span style="line-height:40px;font-size: 28px;" v-if="isState=='2'">
          <FileSearchOutlined style="font-size: 34px;font-weight: bold"/>&nbsp;&nbsp;应付款期初余额
        </span>
      </div>
      <div style="display: inline-block;position:absolute;right: 60px;top: 10px;z-index: 100000;background:#ffffff">
        <img src="/@/assets/images/person.png" style="height:100px;margin-right: 10px;"/>
      </div>
    </template>
    <div :class="isState!='2'?'nc-open-content':'nc-open-show-content'">
      <div class="open-content-up" style="margin-top: 20px;margin-bottom: 10px;">
        <div style="width:80%;margin-left: 10%">
<!--        <a-radio-group v-model:value="formItems.busStyle" @change="changeBusStyle()" :disabled="isState=='1'" style="margin-left: -20px;">
          <a-radio value="YFD" style="width:100px;">
            <span style="color: #000000;font-weight: bold;font-size: 12px;">应付单</span>
          </a-radio>
          <a-radio value="FKD" style="width:100px;margin-left: -10px;">
            <span style="color: #000000;font-weight: bold;font-size: 12px;">付款单</span>
          </a-radio>
        </a-radio-group>-->
        <br/><br/>

          <div v-if="formItems.busStyle=='YFD'">
            <span class="red_span">{{isState=='2'?'':'*'}}</span>
            <label style="font-size: 18px;margin-left: 0;width:150px;">供应商名称：</label>
            <a-select v-model:value="formItems.cvencodeXs" @change="changeCvencodeXs" class="abc" style="width: 60%;border-bottom: 2px solid #000000;">
              <template #suffixIcon><CaretDownOutlined v-if="isState!='2'" /></template>
              <a-select-option v-for="item in customerList" :value="item.id" >
                {{ item.custName }}
              </a-select-option>
            </a-select>
            <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;" v-if="isState!='2'" @click="openHeadSelectContent('cvencodeXs')"/>
          </div>
          <div v-if="formItems.busStyle=='FKD'">
            <span class="red_span">{{isState=='2'?'':'*'}}</span>
            <label style="font-size: 18px;margin-left: 0;width:150px;">结算供应商：</label>
            <a-select v-model:value="formItems.cvencodeJs" class="abc" style="width: 60%;border-bottom: 2px solid #000000;">
              <template #suffixIcon><CaretDownOutlined v-if="isState!='2'" /></template>
              <a-select-option v-for="item in customerList" :value="item.id" >
                {{ item.custName }}
              </a-select-option>
            </a-select>
            <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;" v-if="isState!='2'" @click="openHeadSelectContent('cvencodeJs')"/>
          <br/>
          </div>
          <span class="red_span">{{isState=='2'?'':'*'}}</span>
          <label style="font-size: 18px;margin-left: 0;width:150px;">金额：</label>
          <a-input-number
            v-model:value="formItems.money"
            placeholder=""
            class="abc"
            style="width: 60%;border-bottom: 2px solid #000000;"
          />
        </div>
        <br/><br/>

        <label>单据类型：</label>
        <a-select v-model:value="formItems.arStyle" @change="generateCode()" style="width: 30%">
          <template #suffixIcon><CaretDownOutlined v-if="isState!='2'" style="color:#666666;" /></template>
          <a-select-option v-if="formItems.busStyle=='YFD'" value="YFD">应付单</a-select-option>
          <a-select-option v-if="formItems.busStyle=='YFD'" value="DHD">到货单</a-select-option>
          <a-select-option v-if="formItems.busStyle=='YFD'" value="CGFP">采购发票</a-select-option>
          <a-select-option v-if="formItems.busStyle=='FKD'" value="PTFK">普通付款</a-select-option>
          <a-select-option v-if="formItems.busStyle=='FKD'" value="YFK">预付款</a-select-option>
        </a-select>
        <span class="red_span">{{isState=='2'?'':'*'}}</span>
        <label>单据日期：</label>
        <a-date-picker
          v-model:value="formItems.ddate"
          placeholder=""
          :locale="localeCn"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          :disabled-date="disabledDate"
          style="width: 30%"
        />
        <span class="red_span">{{isState=='2'?'':'*'}}</span>
        <br />

        <label>单据编码：</label>
        <a-input v-model:value="formItems.ccode" />
        <span class="red_span"></span>
        <label>币种：</label>
        <a-select v-model:value="formItems.currencyId" style="width: 30%">
          <template #suffixIcon><CaretDownOutlined v-if="isState!='2'" style="color:#666666;" /></template>
          <a-select-option
            v-for="currency in currencyList"
            :key="currency.foreignName"
            :value="currency.foreignCode"
          >
            {{ currency.foreignName }}
          </a-select-option>
        </a-select>
        <span class="red_span"></span>
        <br/>

        <label>业务部门：</label>
        <a-select v-model:value="formItems.cdepcode" style="width: 30%">
          <template #suffixIcon><CaretDownOutlined v-if="isState!='2'" style="color:#666666;" /></template>
          <a-select-option v-for="item in deptList" :value="item.id" >
            {{ item.deptName }}
          </a-select-option>
        </a-select>
        <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;" v-if="isState!='2'" @click="openHeadSelectContent('cdepcode')"/>
        <span v-if="isState=='2'" class="red_span"></span>
        <label>业务员：</label>
        <a-select v-model:value="formItems.cmakerId" style="width: 30%">
          <template #suffixIcon><CaretDownOutlined v-if="isState!='2'" style="color:#666666;" /></template>
          <a-select-option v-for="item in psnList" :value="item.id" >
            {{ item.psnName }}
          </a-select-option>
        </a-select>
        <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;" v-if="isState!='2'" @click="openHeadSelectContent('cmakerId')"/>
        <span v-if="isState=='2'" class="red_span"></span>
        <br/>

        <label>项目：</label>
        <a-select v-model:value="formItems.citemId" style="width: 30%">
          <template #suffixIcon><CaretDownOutlined v-if="isState!='2'" style="color:#666666;" /></template>
        </a-select>
        <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;" v-if="isState!='2'" @click="openHeadSelectContent('citemId')"/>
        <span v-if="isState=='2'" class="red_span"></span>

        <label>摘要：</label>
        <a-input v-model:value="formItems.cmemo" />
        <span class="red_span"></span>
      </div>
    </div>

    <SupperModalPop @throwData="modalData" @register="registerModalPopPage"/>
    <DeptModalPop @register="registerSelectDeptPage" @save="modalData"/>
    <SelectPsn @register="registerSelectPsnPage" @save="modalData"/>
    <SelectProject @register="registerSelectProjectPage" @save="modalData"/>

    <template #footer>
      <div v-if="isState=='2'">
        <a-button @click="closeModal()" type="primary">关闭</a-button>
      </div>
      <div v-if="isState=='0'">
        <a-button @click="closeModal()">取消</a-button>
        <a-button @click="handleOk()" :disabled="saveClick">保存</a-button>
        <a-button @click="handleOkAdd()" :disabled="saveClick" type="primary">保存并新增</a-button>
      </div>
      <div v-if="isState=='1'">
        <a-button @click="closeModal()">放弃</a-button>
        <a-button @click="handleOk()" :disabled="saveClick" type="primary">保存</a-button>
      </div>
    </template>
  </BasicModal>
</template>

<script setup="props, { content }" lang="ts">
  import { ref, unref } from 'vue';
  import {BasicModal, useModal, useModalInner} from '/@/components/Modal';
  import {
    Select as ASelect,
    Input as AInput,
    InputNumber as AInputNumber,
    DatePicker as ADatePicker,
    Radio as ARadio,
    message
  } from 'ant-design-vue';
  import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
  import {currentCyDatas} from "/@/api/record/system/financial-settings";
  import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
  import {useMessage} from "/@/hooks/web/useMessage";
  import {
    PlusCircleOutlined,
    FormOutlined,
    FileSearchOutlined,
    CaretDownOutlined,
    PaperClipOutlined
  } from '@ant-design/icons-vue'
  import localeCn from 'ant-design-vue/es/date-picker/locale/zh_CN';
  import SupperModalPop from "/@/views/boozsoft/global/popup/supplier/modalPop.vue";
  import DeptModalPop from "/@/views/boozsoft/global/popup/dept/select-dept.vue";
  import SelectPsn from "/@/views/boozsoft/global/popup/dept/select-psn.vue"
  import SelectProject from "/@/views/boozsoft/global/popup/project/select-project.vue";
  import {findBukongCcode} from "/@/api/record/system/arBeginBalance";
  import {pad, sub} from "../calculation";
  import {hasBlank} from "/@/api/task-api/tast-bus-api";
  import moment from "moment";

  const AInputSearch = AInput.Search;
  const ASelectOption = ASelect.Option;
  const ARadioGroup = ARadio.Group
  const emit=defineEmits(['register','save']);

  const {
    createErrorModal
  } = useMessage()

  const formItems: any = ref({});
  const isState = ref('0')
  const saveClick:any = ref(false)

  const currencyList: any = ref([]);

  let changeBeforeModel: any = {};
  const psnList:any = ref([])
  const deptList:any = ref([])
  const customerList:any = ref([])
  const defaultAdName = ref()
  const dynamicTenantId = ref()
  const [register, { closeModal }] = useModalInner((data) => {
    saveClick.value=false
    defaultAdName.value = data.defaultAdName
    dynamicTenantId.value = data.dynamicTenantId
    customerList.value = data.customerList
    deptList.value = data.deptList
    psnList.value = data.psnList
    isState.value = data.isState
    //币种信息
    currencyList.value = [];
    useCompanyOperateStoreWidthOut().getAccountList.forEach(item => {
      if (item.accId == data.defaultAdName && item.currency != '' && item.currency != null) {
        currencyList.value = [{
          accountId: defaultAdName.value,
          foreignCode: item.currency,
          foreignName: item.currencyName
        }]
        if (formItems.value.currencyId == null || formItems.value.currencyId == '') {
          formItems.value.currencyId = item.currency
        }
      }
    })
    useRouteApi(currentCyDatas,{schemaName: dynamicTenantId})({accId: defaultAdName.value}).then(res=>{
      currencyList.value.push(...res.items)
      // bzList.value = res.items/*.filter(item=>item.foreignName.indexOf('人民币') == -1)*/
    });

    // 方式2
    formItems.value.id = data.data.id
    formItems.value.iyear = data.data.iyear
    formItems.value.lineCode = data.data.lineCode
    formItems.value.ccode = data.data.ccode
    formItems.value.arStyle = data.data.arStyle
    formItems.value.busStyle = data.data.busStyle
    formItems.value.billStyle = data.data.billStyle
    formItems.value.ddate = data.data.ddate
    formItems.value.cvencodeXs = data.data.cvencodeXs
    formItems.value.cvencodeJs = data.data.cvencodeJs
    formItems.value.citemClass = data.data.citemClass
    formItems.value.citemId = data.data.citemId
    formItems.value.cdepcode = data.data.cdepcode
    formItems.value.cmakerId = data.data.cmakerId
    formItems.value.currency = data.data.currency
    formItems.value.ysIsumYuanbi = data.data.ysIsumYuanbi
    formItems.value.ysIsumBenbi = data.data.ysIsumBenbi
    formItems.value.arIsumYuanbi = data.data.arIsumYuanbi
    formItems.value.arIsumBenbi = data.data.arIsumBenbi
    formItems.value.isumYuanbi = data.data.isumYuanbi
    formItems.value.isumBenbi = data.data.isumBenbi
    formItems.value.bcheck = data.data.bcheck
    formItems.value.bcheckTime = data.data.bcheckTime
    formItems.value.bcheckUser = data.data.bcheckUser
    formItems.value.cmemo = data.data.cmemo

    if (data.data.arStyle=='YFD') {
      formItems.value.money = data.data.arIsumBenbi
    } else {
      formItems.value.money = data.data.ysIsumBenbi
    }
    if (formItems.value.ddate=='') {
      formItems.value.ddate = sub(data.data.iyear,1) + '-12-31'
    }

    generateCode()

    changeBeforeModel = JSON.parse(JSON.stringify(formItems.value));
  });

  function changeBusStyle(){
    if (formItems.value.busStyle=='YFD'){
      formItems.value.arStyle = 'YFD'
    } else {
      formItems.value.arStyle = 'PTFK'
    }
    generateCode()
  }

  async function generateCode() {
    let code=''
    let qz = ''
    if (formItems.value.arStyle=='YFD'){
      qz = 'YF-'
    } else if (formItems.value.arStyle=='CGDHD'){
      qz = 'PS-'
    } else if (formItems.value.arStyle=='CGFP'){
      qz = 'FB-'
    } else if (formItems.value.arStyle=='PTFK'){
      qz = 'FK-'
    } else if (formItems.value.arStyle=='YFK'){
      qz = 'FK-'
    }
    //日期(年月)
    // let yy = new Date().getFullYear()
    // let mm = new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth()+ 1) : (new Date().getMonth()+ 1)
    let yy = formItems.value.ddate.substring(0,4)
    let mm = formItems.value.ddate.substring(5,7)
    let str = qz + yy + mm + '-'
    const ysyf = await useRouteApi(findBukongCcode,{schemaName: dynamicTenantId})({
      num:4,
      sum:14,
      qzNum:10,
      qianzhui:str
    })
    if (ysyf.ccode != null && ysyf.ccode != ''){
      code = str + pad(ysyf.ccode, 4)
    } else {
      code = str + '0001'
    }
    formItems.value.ccode = code
  }

  const disabledDate = (current) => {
    // 获取区间最小区间
    if (!hasBlank(formItems.value.iyear)) {
      let variable = formItems.value.ddate.substring(0, 7)
      let max = moment(variable, 'YYYY-MM-DD').endOf('month')
      return current > max
    }
  };

  let isChanged = false;
  async function handleOk() {
    saveClick.value=true
    if (formItems.value.arStyle=='' || formItems.value.arStyle==null){
      createErrorModal({
        iconType: 'warning',
        title: '提示',
        content: '请先选择应收类型！'
      })
      saveClick.value=false
      return false
    }
    if (formItems.value.busStyle=='YFD' && (formItems.value.cvencodeXs=='' || formItems.value.cvencodeXs==null)){
      createErrorModal({
        iconType: 'warning',
        title: '提示',
        content: '供应商名称不能为空！'
      })
      saveClick.value=false
      return false
    }
    if (formItems.value.busStyle=='FKD' && (formItems.value.cvencodeJs=='' || formItems.value.cvencodeJs==null)){
      createErrorModal({
        iconType: 'warning',
        title: '提示',
        content: '结算供应商名称不能为空！'
      })
      saveClick.value=false
      return false
    }
    if (formItems.value.money=='' || formItems.value.money==null){
      createErrorModal({
        iconType: 'warning',
        title: '提示',
        content: '金额不能为空！'
      })
      saveClick.value=false
      return false
    }
    if (formItems.value.ddate=='' || formItems.value.ddate==null){
      createErrorModal({
        iconType: 'warning',
        title: '提示',
        content: '单据日期不能为空！'
      })
      saveClick.value=false
      return false
    }
    if (formItems.value.busStyle=='' || formItems.value.busStyle==null){
      createErrorModal({
        iconType: 'warning',
        title: '提示',
        content: '单据类型不能为空！'
      })
      saveClick.value=false
      return false
    }

    if (formItems.value.arStyle=='YFD') {
      formItems.value.arIsumBenbi = formItems.value.money
      formItems.value.isumBenbi = formItems.value.arIsumBenbi
    } else {
      formItems.value.ysIsumBenbi = formItems.value.money
      formItems.value.isumBenbi = -formItems.value.ysIsumBenbi
    }

    isChanged = !(
      formItems.value.id == changeBeforeModel.id &&
      formItems.value.iyear == changeBeforeModel.iyear &&
      formItems.value.lineCode == changeBeforeModel.lineCode &&
      formItems.value.ccode == changeBeforeModel.ccode &&
      formItems.value.arStyle == changeBeforeModel.arStyle &&
      formItems.value.busStyle == changeBeforeModel.busStyle &&
      formItems.value.ddate == changeBeforeModel.ddate &&
      formItems.value.cvencodeXs == changeBeforeModel.cvencodeXs &&
      formItems.value.cvencodeJs == changeBeforeModel.cvencodeJs &&
      formItems.value.citemClass == changeBeforeModel.citemClass &&
      formItems.value.citemId == changeBeforeModel.citemId &&
      formItems.value.cdepcode == changeBeforeModel.cdepcode &&
      formItems.value.cmakerId == changeBeforeModel.cmakerId &&
      formItems.value.currency == changeBeforeModel.currency &&
      formItems.value.ysIsumYuanbi == changeBeforeModel.ysIsumYuanbi &&
      formItems.value.ysIsumBenbi == changeBeforeModel.ysIsumBenbi &&
      formItems.value.arIsumYuanbi == changeBeforeModel.arIsumYuanbi &&
      formItems.value.arIsumBenbi == changeBeforeModel.arIsumBenbi &&
      formItems.value.isumYuanbi == changeBeforeModel.isumYuanbi &&
      formItems.value.isumBenbi == changeBeforeModel.isumBenbi &&
      formItems.value.bcheck == changeBeforeModel.bcheck &&
      formItems.value.bcheckTime == changeBeforeModel.bcheckTime &&
      formItems.value.bcheckUser == changeBeforeModel.bcheckUser &&
      formItems.value.cmemo == changeBeforeModel.cmemo
    );
    if (isChanged) {
      emit('save', unref(formItems));
      closeModal();
      saveClick.value=false
      return true;
    }
    closeModal();
    saveClick.value=false
    // alert("没有改变过")
    return false;
  }

  async function handleOkAdd() {
    saveClick.value=true
    if (formItems.value.arStyle=='' || formItems.value.arStyle==null){
      createErrorModal({
        iconType: 'warning',
        title: '提示',
        content: '请先选择应收类型！'
      })
      saveClick.value=false
      return false
    }
    if (formItems.value.busStyle=='YFD' && (formItems.value.cvencodeXs=='' || formItems.value.cvencodeXs==null)){
      createErrorModal({
        iconType: 'warning',
        title: '提示',
        content: '供应商名称不能为空！'
      })
      saveClick.value=false
      return false
    }
    if (formItems.value.busStyle=='FKD' && (formItems.value.cvencodeJs=='' || formItems.value.cvencodeJs==null)){
      createErrorModal({
        iconType: 'warning',
        title: '提示',
        content: '结算供应商名称不能为空！'
      })
      saveClick.value=false
      return false
    }
    if (formItems.value.money=='' || formItems.value.money==null){
      createErrorModal({
        iconType: 'warning',
        title: '提示',
        content: '金额不能为空！'
      })
      saveClick.value=false
      return false
    }
    if (formItems.value.ddate=='' || formItems.value.ddate==null){
      createErrorModal({
        iconType: 'warning',
        title: '提示',
        content: '单据日期不能为空！'
      })
      saveClick.value=false
      return false
    }
    if (formItems.value.busStyle=='' || formItems.value.busStyle==null){
      createErrorModal({
        iconType: 'warning',
        title: '提示',
        content: '单据类型不能为空！'
      })
      saveClick.value=false
      return false
    }

    if (formItems.value.arStyle=='YFD') {
      formItems.value.arIsumBenbi = formItems.value.money
      formItems.value.isumBenbi = formItems.value.arIsumBenbi
    } else {
      formItems.value.ysIsumBenbi = formItems.value.money
      formItems.value.isumBenbi = -formItems.value.ysIsumBenbi
    }

    isChanged = !(
      formItems.value.id == changeBeforeModel.id &&
      formItems.value.iyear == changeBeforeModel.iyear &&
      formItems.value.lineCode == changeBeforeModel.lineCode &&
      formItems.value.ccode == changeBeforeModel.ccode &&
      formItems.value.arStyle == changeBeforeModel.arStyle &&
      formItems.value.busStyle == changeBeforeModel.busStyle &&
      formItems.value.ddate == changeBeforeModel.ddate &&
      formItems.value.cvencodeXs == changeBeforeModel.cvencodeXs &&
      formItems.value.cvencodeJs == changeBeforeModel.cvencodeJs &&
      formItems.value.citemClass == changeBeforeModel.citemClass &&
      formItems.value.citemId == changeBeforeModel.citemId &&
      formItems.value.cdepcode == changeBeforeModel.cdepcode &&
      formItems.value.cmakerId == changeBeforeModel.cmakerId &&
      formItems.value.currency == changeBeforeModel.currency &&
      formItems.value.ysIsumYuanbi == changeBeforeModel.ysIsumYuanbi &&
      formItems.value.ysIsumBenbi == changeBeforeModel.ysIsumBenbi &&
      formItems.value.arIsumYuanbi == changeBeforeModel.arIsumYuanbi &&
      formItems.value.arIsumBenbi == changeBeforeModel.arIsumBenbi &&
      formItems.value.isumYuanbi == changeBeforeModel.isumYuanbi &&
      formItems.value.isumBenbi == changeBeforeModel.isumBenbi &&
      formItems.value.bcheck == changeBeforeModel.bcheck &&
      formItems.value.bcheckTime == changeBeforeModel.bcheckTime &&
      formItems.value.bcheckUser == changeBeforeModel.bcheckUser &&
      formItems.value.cmemo == changeBeforeModel.cmemo
    );
    if (isChanged) {
      emit('save', unref(formItems));
      // closeModal();
      // await useRouteApi(saveBankStatement, {schemaName: dynamicTenantId})(formItems.value)
      message.success('保存成功！')
      formItems.value = JSON.parse(JSON.stringify(changeBeforeModel))
      saveClick.value=false
      return true;
    }
    // closeModal();
    // alert("没有改变过")
    saveClick.value=false
    return false;
  }

  const thisEditObj:any = ref(null)
  const thisEditType:any = ref('')
  const [registerModalPopPage, {openModal: openMoalPopPage}] = useModal();
  const [registerSelectDeptPage, {openModal: openSelectDeptPage}] = useModal()
  const [registerSelectPsnPage, {openModal: openSelectPsnPage}] = useModal()
  const [registerSelectProjectPage, {openModal: openSelectProjectPage}] = useModal()

  const openHeadSelectContent = (type) => {
    thisEditType.value = type
    switch (type) {
      case 'cvencodeXs':
        openMoalPopPage(true, {
          database: dynamicTenantId.value,
          accId: defaultAdName.value,
        });
        break;
      case 'cvencodeJs':
        openMoalPopPage(true, {
          database: dynamicTenantId.value,
          accId: defaultAdName.value,
        });
        break;
      case 'cdepcode':
        openSelectDeptPage(true, {
          dynamicTenantId: dynamicTenantId.value
        })
        break;
      case 'cmakerId':
        openSelectPsnPage(true, {
          dynamicTenantId: dynamicTenantId.value
        })
        break;
      case 'citemId':
        openSelectProjectPage(true, {
          dynamicTenantId: dynamicTenantId.value
        })
        break;
    }
  }

  const modalData = (o) => {
    console.log(thisEditObj.value)
    console.log(thisEditType.value)
    if (thisEditType.value=='cvencodeXs'){
      formItems.value.cvencodeXs = o[0].id
      if(o[0].uniqueCodeCcus!=null && o[0].uniqueCodeCcus!=''){
        const res = customerList.value.filter(item=>item.uniqueCodeCcus==item.uniqueCode)
        if (res.length!=0) {
          formItems.value.cvencodeJs = res[0].id
        } else {
          formItems.value.cvencodeJs = o[0].id
        }
      }
    }
    if (thisEditType.value=='cvencodeJs'){
      formItems.value.cvencodeJs = o[0].id
    }
    if (thisEditType.value=='cdepcode'){
      formItems.value.cdepcode = o.id
    }
    if (thisEditType.value=='cmakerId'){
      formItems.value.cmakerId = o.id
    }
    if (thisEditType.value=='citemId'){
      formItems.value.itemCode = o.id
    }
  }

  function changeCvencodeXs(){
    const cusList = customerList.value.filter(item=>formItems.value.cvencodeXs==item.id)
    if(cusList[0].uniqueCodeCcus!=null && cusList[0].uniqueCodeCcus!=''){
      const res = customerList.value.filter(item=>item.uniqueCodeCcus==item.uniqueCode)
      if (res.length!=0) {
        formItems.value.cvencodeJs = res[0].id
      }
    } else {
      formItems.value.cvencodeJs = formItems.value.cvencodeXs
    }
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
:deep(.ant-calendar-picker-input.ant-input),
:deep(.ant-select-single:not(.ant-select-customize-input)
      .ant-select-selector
      .ant-select-selection-search-input) {
  border: none;
  border-bottom: solid 1px rgb(191, 191, 191) !important;
  width: 100%;
}

:deep(.ant-picker){
  border: none !important;
  border-bottom: solid 1px rgb(191, 191, 191) !important;
  input {
    font-size: 14px;
    font-weight: bold;
    border: none !important;
  }
}

:deep(.ant-input-number){
  border: none;
  border-bottom: solid 1px rgb(191, 191, 191) !important;
  width: 100%;

  .ant-input-number-handler-wrap{
    display:none;
  }
  input{
    font-size: 14px;
    font-weight: bold;
    font-family: Arial !important;
  }
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
    width: 30%;
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
    font-weight: bold;
    font-size: 14px;
  }

  .abc{
    border-bottom: 2px solid #666666 !important;
    font-size: 19px;
  }

  .ant-input:focus {
    box-shadow: none;
  }

  :deep(.ant-select-selector) {
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
  }

  label {
    text-align: left;
    width: 90px;
    display: inline-block;
    padding: 5px 10px;
    margin-left: 2em;
    color: #535353;
    font-weight: bold;
    font-size: 13px;
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

.nc-open-show-content {
  pointer-events: none;
  cursor: default;
  input {
    width: 30%;
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
    font-weight: bold;
    font-size: 14px;
  }

  .abc{
    border-bottom: 2px solid #666666 !important;
    font-size: 19px;
  }

  .ant-input:focus {
    box-shadow: none;
  }

  :deep(.ant-select-selector) {
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
  }

  label {
    text-align: left;
    width: 90px;
    display: inline-block;
    padding: 5px 10px;
    margin-left: 2em;
    color: #535353;
    font-weight: bold;
    font-size: 13px;
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
