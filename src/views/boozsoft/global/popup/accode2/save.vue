<template>
  <BasicModal
    destroyOnClose
    width="800px"
    v-bind="$attrs"
    okText="保存"
    title="会计科目"
    @ok="handleOk()"
    @cancel="handleClose()"
    @register="register"
  >
    <template #title>
      <div style="display: flex;color: #0096c7;margin-top: 5px;">
        <span style="line-height:60px;font-size: 28px;">
          <PlusCircleOutlined style="font-size: 34px;font-weight: bold"/>
        </span>
        <span style="line-height:40px;font-size: 28px;margin-top:5px;">
          &nbsp;&nbsp;会计科目
        </span>
        <label style="margin-left: 15%;color: black;font-size: 14px;margin-top:15px;">编码级次规则：{{jici}}</label>
      </div>
      <div style="display: inline-block;position:absolute;right: 40px;top: 10px;z-index: 100000;background:#ffffff">
        <img src="/cus.png" style="height:90px;margin-right: 55px;"/>
      </div>
    </template>
    <div class="nc-open-content">
      <div class="open-content-up">
        <div style="margin-left: 20px;margin-top: 53px;">
          <a-radio-group v-model:value="formItems.bprogerty" v-model:disabled="bprogertyDisabled" style="width:40%;">
            <a-radio value="1">
              <span style="color: #000000;font-weight: bold;font-size: 10px;">借方</span>
            </a-radio>
            <a-radio value="0" style="margin-left: -10px;">
              <span style="color: #000000;font-weight: bold;font-size: 10px;">贷方</span>
            </a-radio>
          </a-radio-group>
          <br/>
          <label>上级科目：</label>
          <TreeSelect
            style="width: 67%;"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="codelist"
            placeholder="请选择上级科目"
            tree-default-expand-all
            allow-clear
            show-search
            v-model:value="superiorCcode"
            v-model:disabled="superiorTreeFlag"
            @change="superiorCcodeChange"
            :filterTreeNode="filterOption"
          >
            <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
          </TreeSelect>
          &nbsp;
          <a style="font-weight: bold;font-size: 18px;"><LinkOutlined v-if="isState!='2'" @click="openModalAll" /></a>
          <br/>
          <label>科目编码：</label>
          <a-input
            @blur="ccodeblur"
            @keyup="ccodeWacth"
            @change="findByCclass"
            @focus="focusInput($event)"
            v-model:value.trim="formItems.ccode"
            autocomplete="off"
            style="width: 25%;"
            onkeyup="value=value.replace(/o/,'').replace(/l/,'').replace(/[\u4e00-\u9fa5]/, '')"
          />
          <label>科目类型：</label>
          <a-select
            v-model:value="formItems.cclass"
            v-model:disabled="cclassflg"
            style="width: 25%;text-align: center;font-weight: bold;"
            allow-clear
          >
            <a-select-option :value="item.cclass" v-for="(item, i) in styleName">{{
                item.cclass
              }}</a-select-option>
            <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
          </a-select>
          <br/><br/>
          <span style="margin-left: 23px;">
            <label style="font-size: 18px;margin-left: 0;width:150px;">科目名称：</label>
            <a-input v-model:value.trim="formItems.ccodeName" placeholder="科目名称" autocomplete="off" class="abc" style="font-size: 18px;width: 60%;" />
            <span class="red_span">*</span>
          </span>
          <br/>
        </div>
      </div>
      <div class="open-content-down">
        <a-tabs v-model:activeKey="activeKey" type="card" @change="tabChange">
          <a-tab-pane key="1" tab="科目属性">
            <div class="down-tab-content">
              <a-radio-group v-model:value="formItems.bcash" v-model:disabled="bcashDisabled" @change="bcashchecked" style="width: 50%">
                <label>现金科目：&emsp;&emsp;&emsp;</label>
                <a-radio value="0" style="width:80px;margin-left: -10px;">
                  否
                </a-radio>
                <a-radio value="1" style="width:80px;margin-left: -10px;">
                  是
                </a-radio>
              </a-radio-group>
              <a-radio-group v-model:value="formItems.bbank" v-model:disabled="bbankDisabled" @change="bbankchecked" style="width: 50%">
                <label>银行科目：&emsp;&emsp;&emsp;</label>
                <a-radio value="0" style="width:80px;margin-left: -10px;">
                  否
                </a-radio>
                <a-radio value="1" style="width:80px;margin-left: -10px;">
                  是
                </a-radio>
              </a-radio-group>
              <br/>
              <a-radio-group v-model:value="formItems.bcashEquivalence" v-model:disabled="bcashEquivalenceDisabled" @change="bcashEquivalencechecked" style="width: 50%">
                <label>现金等价物科目：</label>
                <a-radio value="0" style="width:80px;margin-left: -10px;">
                  否
                </a-radio>
                <a-radio value="1" style="width:80px;margin-left: -10px;">
                  是
                </a-radio>
              </a-radio-group>
              <a-radio-group v-model:value="formItems.xjll" v-model:disabled="xjllDisabled" style="width: 50%">
                <label>现金流量科目：&emsp;</label>
                <a-radio value="0" style="width:80px;margin-left: -10px;">
                  否
                </a-radio>
                <a-radio value="1" style="width:80px;margin-left: -10px;">
                  是
                </a-radio>
              </a-radio-group>
              <br/>
              <a-radio-group v-model:value="formItems.bdaybook" v-model:disabled="bdaybookDisabled" style="width: 50%">
                <label>日记账科目：&emsp;&emsp;</label>
                <a-radio value="0" style="width:80px;margin-left: -10px;">
                  否
                </a-radio>
                <a-radio value="1" style="width:80px;margin-left: -10px;">
                  是
                </a-radio>
              </a-radio-group>
              <a-radio-group v-model:value="formItems.controlled" v-model:disabled="controlledDisabled" style="width: 50%">
                <label>业务受控科目：&emsp;</label>
                <a-radio value="0" style="width:80px;margin-left: -10px;">
                  否
                </a-radio>
                <a-radio value="1" style="width:80px;margin-left: -10px;">
                  是
                </a-radio>
              </a-radio-group>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="辅助核算">
            <div class="down-tab-content">
              <a-table
                ref="tableRef"
                :pagination="false"
                :class="'a-table-font-size-12'"
                :dataSource="fuzhuModalDataSource"
                :columns="fuzhuModalColumns"
                :row-selection="{selectedRowKeys:selectedRowKeys, onChange: onFuzhuHeSuanChange,getCheckboxProps:rowSelection.getCheckboxProps }"
                :scroll="{ y: 50 }"
              />
            </div>
          </a-tab-pane>
          <a-tab-pane key="3" tab="外币核算">
            <div style="margin-top: 20px;margin-left: 25%;" class="down-tab-content">
              <label>外币币种：</label>
              <a-select
                v-model:value="formItems.currencyType"
                v-model:disabled="currencyTypeflg"
                @change="currencychecked"
                show-search
                style="width: 25%;text-align: center;"
                allow-clear
              >
                <a-select-option value="">无</a-select-option>
                <a-select-option :value="item.foreignName" v-for="(item, i) in currencylist">
                  {{ item.foreignName }}
                </a-select-option>
                <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
              </a-select>
            </div>
          </a-tab-pane>
          <a-tab-pane key="4" tab="数量核算">
            <div style="margin-top: 20px;margin-left: 25%;" class="down-tab-content">
              <label>计量单位</label>
              <a-select
                v-model:value="formItems.menterage"
                v-model:disabled="menterageflg"
                show-search
                @change="bnumchecked"
                style="width: 25%;text-align: center;"
                allow-clear
              >
                <a-select-option value="">无</a-select-option>
                <a-select-option :value="item" v-for="(item, i) in unit_meaList">
                  {{ item }}
                </a-select-option>
                <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
              </a-select>
            </div>
          </a-tab-pane>
          <a-tab-pane key="5" tab="集团账套" v-if="!independent">
            <div style="margin-top: 20px;" class="down-tab-content">
              <a-radio-group v-model:value="formItems.lowerControl" v-model:disabled="lowerDisabled" style="width: 50%">
                <label>允许添加下级科目：</label>
                <a-radio value="0" style="width:80px;margin-left: -23px;">
                  否
                </a-radio>
                <a-radio value="1" style="width:80px;margin-left: -10px;">
                  是
                </a-radio>
              </a-radio-group>
              <a-radio-group v-model:value="formItems.fuzhuControl" v-model:disabled="fuzhutDisabled" style="width: 50%">
                <label>允许添加辅助核算：</label>
                <a-radio value="0" style="width:80px;margin-left: -23px;">
                  否
                </a-radio>
                <a-radio value="1" style="width:80px;margin-left: -10px;">
                  是
                </a-radio>
              </a-radio-group>
            </div>
          </a-tab-pane>
          <a-tab-pane key="6" tab="预算会计" v-if="ibudgetAccounting=='1'">
            <div style="margin-top: 20px;" class="down-tab-content">
              <a-radio-group v-model:value="formItems.pxjz" v-model:disabled="pxjzDisabled" style="width: 50%">
                <label>平行记账科目：&emsp;</label>
                <a-radio value="0" style="width:80px;margin-left: -23px;">
                  否
                </a-radio>
                <a-radio value="1" style="width:80px;margin-left: -10px;">
                  是
                </a-radio>
              </a-radio-group>
              <a-radio-group v-model:value="formItems.cyfx" v-model:disabled="cyfxDisabled" style="width: 50%">
                <label>差异分析科目：&emsp;</label>
                <a-radio value="0" style="width:80px;margin-left: -10px;">
                  否
                </a-radio>
                <a-radio value="1" style="width:80px;margin-left: -10px;">
                  是
                </a-radio>
              </a-radio-group>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <template #footer>
      <a-button @click="closeModal(),handleClose()">取消</a-button>
      <a-button @click="handleOk('close')" :disabled="saveClick">保存</a-button>
      <!--弹框调用新增页面 禁用连续增加按钮-->
      <a-button @click="handleOk('add')" :disabled="saveClick" type="primary" v-if="modelType!=='pop'">保存并新增</a-button>
    </template>

    <ModalAllPop @throwData="modalAllData" @register="registerCodeAllPopPage" />
  </BasicModal>
</template>
<script setup="props, { content }" lang="ts">
  import { reactive, ref, toRaw, watch } from 'vue';
  import {BasicModal, useModal, useModalInner} from '/@/components/Modal';
  import { PlusCircleOutlined,CaretDownOutlined,LinkOutlined } from '@ant-design/icons-vue'
  import {
    company_findByCodeNum,
    findAllByCurrency,
    company_findByLowerMaxCodeNum,
    company_findByCcode,
    company_treeCode,
    company_findByCodeName,
    company_findBySuperCodeName, company_delFindByCodekemu,
  } from '/@/api/codekemu/codekemu';
  import {
    Tabs as ATabs,
    Select as ASelect,
    Input as AInput,
    Statistic as AStatistic,
    Table as ATable,
    Radio as ARadio,
    TreeSelect
  } from 'ant-design-vue';
  import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
  import { findFuzhuHesuanList } from "/@/api/record/system/fuzhu-hesuan";
  import {findAllByUnitName} from '/@/api/record/system/unit-mea'
  import {useMessage} from "/@/hooks/web/useMessage";
  import ModalAllPop from '/@/views/boozsoft/global/popup/accode2/modalAllPop.vue';



  const ASelectOption = ASelect.Option;
  const AInputSearch = AInput.Search;
  const AStatisticCountdown = AStatistic.Countdown;
  const ATabPane = ATabs.TabPane;
  const ARadioGroup = ARadio.Group
  const emit=defineEmits(['register','save']);
  const {createConfirm, createWarningModal, createMessage} = useMessage();
  const [registerCodeAllPopPage, { openModal: openCodeAllPopPage }] = useModal();
  // 上级科目末级状态
  const superCodeBend = ref('');
  const tableRef = ref(null)
  const saveClick = ref(false);
  const bcashDisabled = ref(false);
  const bbankDisabled = ref(false);
  const bcashEquivalenceDisabled = ref(false);
  const bprogertyDisabled = ref(false);
  const controlledDisabled = ref(false);
  const pxjzDisabled = ref(false);
  const cyfxDisabled = ref(false);
  const xjllDisabled = ref(false);
  const bdaybookDisabled = ref(false);
  const currencyDisabled = ref(false);
  const bnumDisabled = ref(false);
  const lowerDisabled = ref(false);
  const fuzhutDisabled = ref(false);

  // 'no' 只能修改名称、编码；其他属性与上级科目一致,'yes' 全部
  const allProperty: any = ref(true);
  // 辅助model
  const fuzhuModal = ref(false);
  // 是否独立账套
  const independent = ref(false);
  // 计算单位list
  const unitmealist: any = ref([]);
  // 货币list
  const currencylist: any = ref([]);
  // 科目list
  const codelist: any = ref([]);
  // 计量单位状态
  const menterageflg: any = ref(false);
  // 科目类型状态
  const cclassflg: any = ref(false);
  // 币种状态
  const currencyTypeflg: any = ref(false);
  // 会计准则
  const standardName: any = ref('');
  const standardUnique: any = ref('');
  const templateID: any = ref('');
  const templateName: any = ref('');
  // 账套是否预算会计 1是 0否
  const ibudgetAccounting: any = ref('');
  // 级次
  const jici: any = ref('');
  // 级次:增加科目用到-上级科目级次
  const jici2: any = ref(1);
  // 级次:增加科目用到-下级科目级次
  const last_jici: any = ref(1);
  // 科目类型
  const styleName: any = ref([]);
  const unit_meaList: any = ref([]);
  // 本位币
  const currency: any = ref('人民币');
  // 上级科目
  const superiorCcode: any = ref('');
  const superiorTreeFlag: any = ref(true);
  const lowerControl: any = ref(false);
  const fuzhuControl: any = ref(false);

  // 上级科目-科目下级控制
  const super_lowerControl: any = ref(false);
  // 业务受控制
  const controlled: any = ref(false);
  // 表单封装数据
  const formItems = reactive({
    ysYsly:'0',
    ysZfzcjjfl:'0',
    ysBmzcjjfl:'0',
    ysZcgnfl:'0',
    controlled: '0',
    ccode: '',
    ccodeName: '',
    cclass: '',
    bprogerty: '1',
    bnum: '0',
    menterage: '',
    currency: '0',
    currencyType: '',
    bcash: '',
    bbank: '',
    bcashEquivalence: '',
    bdaybook: '0',
    igrade: '',
    uniqueAccStandard: '',
    superiorCcode: '',
    templateId: '',
    lowerControl: '0',
    fuzhuControl: '0',
    uniqueAccStandardName: '',
    templateName: '',
    bend: '1',
    flag: '1',
    iyear: '',
    pxjz: '0',
    xjll: '',
    cyfx: '0',
    fuzhuhesuan: '',
    yusuan: '',
    superCodeBend: '',
    oldCcode: '',
    closeflag: '',
  });
  // 辅助项checkbox禁用状态
  const fuzhuCheckflag: any = ref(true);
  // 数据库模式名称
  const database = ref('');
  const accId = ref('');
  const iyear: any = ref('');
  // tab默认
  const activeKey = ref('1');
  const fzcolumns = ref([
    {
      title: '自定义项编码',
      dataIndex: 'ccode',
      key: 'ccode',
    },
    {
      title: '自定义项名称',
      dataIndex: 'cname',
      key: 'cname',
    }
  ]);
  const fuzhuModalDataSource = ref([]);
  const fuzhuModalColumns = ref([
    {
      title: '辅助项',
      dataIndex: 'cname',
      key: 'cname',
      width:'20%',
      colSpan: 2,
      customRender: ({ text, index }) => {
        const obj = {
          children: text,
          props: {} as any,
        };
        obj.props.colSpan = 2;
        return obj;
      },
    },
  ]);
  const selectedRowKeys = ref([]);
  const ccodeInfo=ref('')
  const modelType=ref('')
  const [register, { closeModal }] = useModalInner(async (data) => {
    // handleClose()
    modelType.value = data.modalType
    saveClick.value = false
    jici.value = data.data.jici;
    ibudgetAccounting.value=data.ibudgetAccounting
    standardUnique.value = data.data.standardUnique;
    templateID.value = data.data.templateID;
    styleName.value = data.data.styleName.filter(v=>v.cclass!=='全部');
    independent.value = data.data.independent;
    iyear.value = data.data.iyear;
    database.value = data.data.database;
    accId.value = data.data.accId;
    superiorCcode.value=data.ccodeInfo!==''?data.ccodeInfo[0].ccode:''
    allProperty.value = data.all==='yes'?true:false;
    if(superiorCcode.value!==''){
      superiorCcodeChange(superiorCcode.value)
    }else{
      findByAllProperty('')
    }
    ccodeInfo.value=data.ccodeInfo
    // 不是增加下级，可勾选辅助项
    if(data.ccodeInfo===''){
      fuzhuCheckflag.value=false
    }
    await useRouteApi(company_treeCode,{schemaName:database})({
      iyear:data.data.iyear,
    }).then((res) => {
      codelist.value = res;
    });

    // 获取所有国币-读取常用外币表
    await useRouteApi(findAllByCurrency,{schemaName:database})('').then((res) => {
      currencylist.value = res;
    });

    formItems.bprogerty='1'
    formItems.bdaybook='0'
    formItems.controlled='0'
    formItems.bcash='0'
    formItems.bcashEquivalence='0'
    formItems.bbank='0'
    formItems.xjll='0'
    formItems.pxjz='0'
    formItems.cyfx='0'
    formItems.currency='0'
    formItems.bnum='0'
    formItems.iyear = data.data.iyear;

    if(data.superiorCcode!=='0'){
      superiorCcode.value=data.superiorCcode
      superiorCcodeChange(data.superiorCcode)
    }
    await fuzhuModalShow()
  });

  watch(() => superiorCcode.value,async (newValue, oldValue) => {
    if(newValue===undefined){
      formItems.ccode=''
      formItems.cclass=''
      cclassflg.value=false
      last_jici.value =1 ;
      jici2.value =1 ;
      superiorCcode.value ='' ;
      // findByAllProperty(true)
    }
  });

  const rowSelection = {
    getCheckboxProps: (record) => ({
      disabled: fuzhuCheckflag.value,
    }),
  };

  function focusInput(event) {
    event.currentTarget.select();
  }
  function ccodeWacth() {
    if(formItems.ccode=='' ){
      superiorCcode.value =''
      allProperty.value=true
      findByAllProperty('')
    }
  }
 async function findByCodePzQc(ccode) {
    // 判断 凭证、期初、现金流量是否使用
    const delFirstMsg=await useRouteApi(company_delFindByCodekemu,{schemaName: database})({
      ccode: ccode,
      iyear: iyear.value,
      databasenum:database.value
    })
   if(delFirstMsg.code==='200'){
     allProperty.value=true
   }else{
     if(delFirstMsg.msg==='accvoucher' || delFirstMsg.msg==='qc'){
       allProperty.value=false
     }else{
       allProperty.value=true
     }
   }
  }
  async function findByAllProperty(data) {
    if(!allProperty.value){
      formItems.ccode = '';
      formItems.ccodeName = '';
      formItems.menterage = data.menterage;
      formItems.currencyType = data.currencyType;
      formItems.bdaybook = data.bdaybook!=='1'?'0':'1'
      formItems.controlled = data.controlled!=='1'?'0':'1'
      formItems.bnum = data.bnum;
      formItems.currency = data.currency;
      formItems.bprogerty = data.bprogerty;
      formItems.cclass = data.cclass;
      formItems.iyear = data.iyear;
      formItems.pxjz = data.pxjz;
      formItems.xjll = data.xjll;
      formItems.cyfx = data.cyfx;


      cclassflg.value=true
      lowerDisabled.value=true
      fuzhutDisabled.value=true
      bnumDisabled.value=true
      currencyDisabled.value=true
      bcashEquivalenceDisabled.value=true
      bbankDisabled.value=true
      bcashDisabled.value=true
      bdaybookDisabled.value=true
      cyfxDisabled.value=true
      pxjzDisabled.value=true
      controlledDisabled.value=true
      bprogertyDisabled.value=true
      xjllDisabled.value=true

      // 现金...3个
      formItems.bcash = data.bcash;
      formItems.bbank = data.bbank;
      formItems.bcashEquivalence = data.bcashEquivalence;
      formItems.currency = data.currency;
      formItems.bnum = data.bnum;

      if (data.fuzhu!==null && data.fuzhu !== '') {
        for (let i = 0; i < data.fuzhu.split(',').length; i++) {
          let list = fuzhuModalDataSource.value.filter(item => item.cname === data.fuzhu.split(',')[i]);
          if(list.length>0){
            selectedRowKeys.value.push(list[0].cfield)
            selectData.value.push({
              key: i,
              ccode: list[0].ccode,
              cname: list[0].cname,
              cdfine: list[0].cfield,
            })
          }
        }
      }
    }
    else{
      formItems.ccode = '';
      formItems.ccodeName = '';
      formItems.currencyType=''
      formItems.menterage=''
      formItems.bdaybook='0'
      formItems.controlled='0'

      formItems.bnum='0'
      formItems.currency='0'
      formItems.bcashEquivalence='0'
      formItems.bbank='0'
      formItems.bcash='0'
      formItems.xjll='0'
      formItems.pxjz='0'
      formItems.cyfx='0'
      formItems.bprogerty='1'

      cclassflg.value=false
      xjllDisabled.value=false;
      pxjzDisabled.value=false;
      cyfxDisabled.value=false;
      bprogertyDisabled.value=false;
      controlledDisabled.value=false;
      bdaybookDisabled.value=false;
      bcashDisabled.value=false;
      bbankDisabled.value=false;
      bcashEquivalenceDisabled.value=false;
      lowerDisabled.value=false;
      fuzhutDisabled.value=false;
      currencyDisabled.value=false
      bnumDisabled.value=false
      selectData.value=[]
      selectedRowKeys.value=[]
    }
  }

  // 科目编码blur触发
  async function findByAllProperty2(data) {
    if(!allProperty.value){
      formItems.menterage = data.menterage;
      formItems.currencyType = data.currencyType;
      formItems.bdaybook = data.bdaybook!=='1'?'0':'1'
      formItems.controlled = data.controlled!=='1'?'0':'1'
      formItems.bnum = data.bnum;
      formItems.currency = data.currency;
      formItems.bprogerty = data.bprogerty;
      formItems.cclass = data.cclass;
      formItems.iyear = data.iyear;
      formItems.pxjz = data.pxjz;
      formItems.xjll = data.xjll;
      formItems.cyfx = data.cyfx;
    //
      lowerDisabled.value=true
      fuzhutDisabled.value=true
      bnumDisabled.value=true
      currencyDisabled.value=true
      bcashEquivalenceDisabled.value=true
      bbankDisabled.value=true
      bcashDisabled.value=true
      bdaybookDisabled.value=true
      cyfxDisabled.value=true
      pxjzDisabled.value=true
      controlledDisabled.value=true
      bprogertyDisabled.value=true
      xjllDisabled.value=true
      // 现金...3个
      formItems.bcash = data.bcash;
      formItems.bbank = data.bbank;
      formItems.bcashEquivalence =data.bcashEquivalence;

      if (data.fuzhu!==null && data.fuzhu !== '') {
        for (let i = 0; i < data.fuzhu.split(',').length; i++) {
          let list = fuzhuModalDataSource.value.filter(item => item.cname === data.fuzhu.split(',')[i]);
          if(list.length>0){
            selectedRowKeys.value.push(list[0].cfield)
            selectData.value.push({
              key: i,
              ccode: list[0].ccode,
              cname: list[0].cname,
              cdfine: list[0].cfield,
            })
          }
        }
      }
    }
  }
  function createConfirmPop(text) {
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: text,
      onOk: async() => {},
    })
  }

  const superiorCcodeChange = async (val) => {
      var sumname;
      if(superiorCcode.value===''){
        sumname = await useRouteApi(company_findByCodeName,{schemaName:database})({
          uniqueAccStandard: standardUnique.value,
          templateId: templateID.value,
          ccode: formItems.ccodeName,
        });
      }else{
        sumname = await useRouteApi(company_findBySuperCodeName,{schemaName:database})({
          uniqueAccStandard: standardUnique.value,
          templateId: templateID.value,
          ccode: formItems.ccodeName,
          superCcod: superiorCcode.value,
          iyear: iyear.value,
        });
      }
      if (sumname > 0) {
        createConfirmPop('科目名称已存在')
        return false;
      }

      // 获取上级科目信息
      const code = await useRouteApi(company_findByCcode,{schemaName:database})({ccode: val,iyear:iyear.value});
      await findByCodePzQc(val)
      if(!allProperty.value){
        createConfirm({
          iconType: 'warning',
          title: '警告',
          content: '科目已经使用，新增下级时本科目数据将自动更换成新增加的下级科目，确定继续吗？',
          onOk: async() => {
            fuzhuCheckflag.value=true
            findByAllProperty(code)
            getNewCcode(code,val)
          },
          onCancel: async() => {
            // closeModal();
            handleClose()
            return false
          }
        })
      }
      else{
        fuzhuCheckflag.value=false
        findByAllProperty('')
        getNewCcode(code,val)
      }
  }


 async function getNewCcode(code,val) {
    if(code!=='不存在'){
      const igrade = code.igrade;
      if(!independent.value){
        // 开启下级控制
        super_lowerControl.value = code.lowerControl === '0';
        if (code.lowerControl === '0') {
          formItems.ccode=''
          createConfirmPop('新增下级科目控制已开启,不能增加下级科目！')
          return false;
        }
      }

      superCodeBend.value = code.bend;
      formItems.cclass = code.cclass;
      formItems.bprogerty = code.bprogerty;
      formItems.lowerControl = code.lowerControl;
      formItems.fuzhuControl = code.fuzhuControl;
      cclassflg.value = true;
      last_jici.value = parseInt(igrade) + 1 ;
      const arr = jici.value.replaceAll('-', '').substring(0, last_jici.value);
      var code_length = 0; // 符合规则的科目长度
      for (let i = parseInt(igrade); i < arr.length; i++) {
        code_length += parseInt(arr[i]);
      }
      if(val!=undefined){
        // 编码_级次
        const newccode = await useRouteApi(company_findByLowerMaxCodeNum,{schemaName:database})({
          superiorCcode: val,
          code_length: code_length,
        });
        formItems.ccode = newccode;
        // 获取上级科目级次
        jici2.value =  igrade;
      }
    }
    else{
      formItems.bprogerty = '1';
    }
  }

const selectData=ref([])
const onFuzhuHeSuanChange = (a,b) => {
  selectedRowKeys.value=a
  selectData.value=b.filter(item=>a.indexOf(item.key)!=-1)
  if(a.length>10){
    createConfirmPop('不能超过10个自定义项')
    selectedRowKeys.value=[]
    selectData.value=[]
  }
}

async function fuzhuModalShow() {
  fuzhuModal.value=true
  const fuzhuhesuan=await useRouteApi(findFuzhuHesuanList,{schemaName:database.value})('')
  fuzhuModalDataSource.value=[]
  if(fuzhuhesuan.items.length>0){
    for (let i = 0; i < fuzhuhesuan.items.length; i++) {
      fuzhuModalDataSource.value.push({
        key:i,
        ccode:fuzhuhesuan.items[i].ccode,
        cname:fuzhuhesuan.items[i].cname,
        cdfine:fuzhuhesuan.items[i].cfield
      })
    }
  }
}
function cancelModel() {
  selectedRowKeys.value=[]
  selectData.value=[]
  fuzhuModalDataSource.value=[]
}
  function modalOk() {
    fuzhuModal.value=false
  }
  // 选中数量核算单位
  const bnumchecked = async (val: any) => {
    if(val!==undefined){
      formItems.bnum='1'
    }
  };
  // 选中外币核算
  const currencychecked = (val: any) => {
    if(val!==undefined){
      formItems.currency='1'
    }
  };
  // 选中现金
  const bcashchecked = (val: any) => {
    formItems.bdaybook=val.target.value
    bbankDisabled.value = val.target.value=='1';
    bcashEquivalenceDisabled.value = val.target.value=='1';
    bdaybookDisabled.value=val.target.value=='1';
  };
  // 选中银行
  const bbankchecked = (val: any) => {
    formItems.bdaybook=val.target.value
    bcashDisabled.value = val.target.value=='1';
    bcashEquivalenceDisabled.value = val.target.value=='1';
    bdaybookDisabled.value=val.target.value=='1';
  };
  // 选中现金等价物
  const bcashEquivalencechecked = (val) => {
    formItems.bdaybook=val.target.value
    bbankDisabled.value = val.target.value=='1';
    bcashDisabled.value = val.target.value=='1';
    bdaybookDisabled.value=val.target.value=='1';
  };

  // 获取编码第几级
  function getJiCiIndex(jiciLenth){
    let jiciIndes='0'
    let temp=formItems.ccode.length
    jiciLenth.forEach((v,index)=>{
      if(v===temp){
        jiciIndes=index
      }
    })
    return jiciIndes
  }

  const ccodeblur = async () => {
    // 每级的长度
    let jiciLenth:any=[]
    let t:any=0
    jici.value.split('-').forEach((v,index)=>{
      if(index==0){
        if(parseInt(v)===4||parseInt(v)===3){t=parseInt(v)}
      }else{t+=parseInt(v)}
      jiciLenth.push(t)
    })

    // 下级科目
    if(formItems.ccode.length>4){
      let index= getJiCiIndex(jiciLenth)
      let codeLength=jiciLenth[parseInt(index)]
      if(codeLength===undefined){
        createConfirmPop('科目级次不符合！')
        return false;
      }
      // 算出上级科目
      let superiorCcode2=formItems.ccode.substring(0,parseInt(jiciLenth[parseInt(0)]))
      if(formItems.ccode.substring(superiorCcode2.length)==='00'){
        createConfirmPop('科目编码必须大于正整数！')
        return false;
      }
      // 获取上级科目信息
      const superCodeInfo = await useRouteApi(company_findByCcode,{schemaName:database})({ccode: superiorCcode2,iyear:iyear.value});
      if(superCodeInfo==='不存在'){
        createConfirmPop('没有上级科目信息！')
        return false;
      }else{
        superiorCcode.value=superCodeInfo.ccode
        cclassflg.value=true
        await findByCodePzQc(superiorCcode2)
        if(!allProperty.value){
          createConfirm({
            iconType: 'warning',
            title: '警告',
            content: '当前科目已经使用！增加下级科目后，原科目所有关联单据均会修改为当前新增的下级科目，该操作无法撤销，功能不可逆2，你确定要继续吗？',
            onOk: async() => {
              findByAllProperty2(superCodeInfo)
              // 不是增加下级，可勾选辅助项
              fuzhuCheckflag.value=true
              // 重新加载辅助项
              fuzhuModalShow()
            },
            onCancel: async() => {
              // closeModal();
              handleClose()
              return false
            }
          })
        }
        else{
          formItems.bprogerty=superCodeInfo.bprogerty
        }
      }
    }
    else{
      // 不是增加下级，可勾选辅助项
      fuzhuCheckflag.value=false
      fuzhuModalShow()
      // 科目编码是一级科目，上级科目下拉框清空
      if(superiorCcode.value!==''){
        superiorCcode.value=''
        allProperty.value=true
        // findByAllProperty3()
        findByAllProperty('')
      }
    }

    last_jici.value = superiorCcode.value !== '' ? parseInt(jici2.value) + 1 : 1;
    const arr = jici.value.replaceAll('-', '').substring(0, last_jici.value);
    var code_length = 0; // 符合规则的科目长度
    for (let i = 0; i < arr.length; i++) {
      code_length += parseInt(arr[i]);
    }

    const newcode_length = formItems.ccode !== '' ? formItems.ccode.length : 0; // 计算输入的科目长度
    console.log('true=' + code_length);
    console.log('false=' + newcode_length);
    if(formItems.ccode!==''){
      if(code_length!==newcode_length){
        createConfirmPop('科目级次不符合！')
        return false;
      }
    }

    // 开启新增下级科目控制，不能提交
    if (super_lowerControl.value) {
      formItems.ccode=''
      createConfirmPop('新增下级科目控制已开启,不能增加下级科目！');
      return false;
    }
    if (formItems.ccode !== '') {
      const sum = await useRouteApi(company_findByCodeNum,{schemaName:database})({
        uniqueAccStandard: standardUnique.value,
        templateId: templateID.value,
        ccode: formItems.ccode,
        iyear: iyear.value,
      });

      var sumname;
      if(superiorCcode.value===''){
        sumname = await useRouteApi(company_findByCodeName,{schemaName:database})({
          uniqueAccStandard: standardUnique.value,
          templateId: templateID.value,
          ccode: formItems.ccodeName,
          iyear: iyear.value,
        });
      }else{
        sumname = await useRouteApi(company_findBySuperCodeName,{schemaName:database})({
          uniqueAccStandard: standardUnique.value,
          templateId: templateID.value,
          ccode: formItems.ccodeName,
          superCcod: superiorCcode.value,
          iyear: iyear.value,
        });
      }

      if (sum > 0) {
        createConfirmPop('新增的会计科目编码在系统中重复！不能添加，请修改科目编码后继续');
        return false;
      }
      if (sumname > 0) {
        createConfirmPop('新增的会计科目名称在系统中重复！不能添加，请修改科目名称后继续');
        return false;
      }
    }
    return true;
  };
  // 根据编码首位查询类型
  const findByCclass = () => {
    if(formItems.ccode!==''){
      formItems.cclass=styleName.value.filter(v=>v.order === formItems.ccode.charAt(0))[0].cclass
    }else{formItems.cclass=''}
  }
  async function handleOk(closeflag) {
    if (formItems.ccodeName === '') {
      createConfirmPop('请填写科目名称!')
      return false;
    }
    if (formItems.ccode === '') {
      createConfirmPop('请填写科目编码!')
      return false;
    }
    if (formItems.cclass === '') {
      createConfirmPop('请选择科目类型!')
      return false;
    }
    if (formItems.bprogerty === '') {
      createConfirmPop('请选择科目方向!')
      return false;
    }
    if (formItems.bnum==='1') {
      if (formItems.menterage === '') {
        createConfirmPop('新增科目为数量核算科目，计量单位不能为空，请设置计量单位！');
        return false;
      }
    }
    if (formItems.currency==='1') {
      if (formItems.currencyType === '') {
        createConfirmPop('新增科目为外币核算科目，外币名称不能为空，请选择对应的外币档案！');
        return false;
      }
    }
    let findByCclass= styleName.value.filter(v=>v.order === formItems.ccode.charAt(0))
    if(findByCclass.length==0 || findByCclass[0].cclass!==formItems.cclass){
      createConfirm({
        iconType: 'warning',
        title: '警告',
        content: '科目类型不一致,确定添加吗',
        onOk: async() => {
          save123(closeflag)
        }
      })
    }
    else{
      save123(closeflag)
    }
  }

  async function save123(closeflag) {
    // 获取是否预算科目标志
    let yusuanflag=styleName.value.filter((x)=>{
      return x.cclass===formItems.cclass;
    })
    formItems.superiorCcode = superiorCcode.value.split('_')[0];
    formItems.flag = '1';
    formItems.igrade = last_jici.value;
    formItems.uniqueAccStandard = standardUnique.value;
    formItems.templateId = templateID.value;
    formItems.lowerControl = lowerControl.value === true ? '1' : '0';
    formItems.fuzhuControl = fuzhuControl.value === true ? '1' : '0';
    formItems.uniqueAccStandardName = standardName.value;
    formItems.templateName = templateName.value;
    formItems.yusuan = yusuanflag[0].flagYusuan==='1'?'1':'0';
    formItems.superCodeBend = superCodeBend.value
    formItems.oldCcode = formItems.ccode
    formItems.closeflag = closeflag
    let fzccode:any=[]
    if(selectData.value.length>0){
      fzccode=selectData.value.map(item=>item.cdfine)
    }
    formItems.fuzhuhesuan = fzccode.length>0?fzccode.join(','):'';

    let info=toRaw(formItems)
    saveClick.value=true
    emit('save', info);
    saveClick.value=false
    closeModal();
  }

  function handleClose() {
    activeKey.value='1'
    superCodeBend.value = ''
    // 辅助model
     fuzhuModal.value = false
    // 是否独立账套
     independent.value = false
    // 计算单位list
    unitmealist.value=[]
    // 货币list
    currencylist.value=[]
    // 科目类型状态
    cclassflg.value=false

    // 级次:增加科目用到-上级科目级次
    jici2.value=1
    // 级次:增加科目用到-下级科目级次
    last_jici.value=1
    selectData.value=[]
    // 本位币
    currency.value='人民币'
    // 上级科目
    superiorCcode.value=''
    lowerControl.value=false
    fuzhuControl.value=false
    // 上级科目-科目下级控制
    super_lowerControl.value=false
    // 业务受控制
    controlled.value=false
    // 表单封装数据
    formItems.ccode = ''
    formItems.ccodeName = ''
    formItems.cclass = ''
    formItems.bprogerty = '1'
    formItems.menterage = ''
    formItems.currencyType = ''
    formItems.igrade = ''
    formItems.uniqueAccStandard = ''
    formItems.superiorCcode = ''
    formItems.templateId = ''
    formItems.lowerControl = ''
    formItems.fuzhuControl = ''
    formItems.uniqueAccStandardName = ''
    formItems.templateName = ''
    formItems.flag = ''
    formItems.iyear = ''
    formItems.fuzhuhesuan = ''
    formItems.yusuan = ''
    formItems.bdaybook = '';
    formItems.controlled = '';
    formItems.pxjz = '';
    formItems.xjll = '';
    formItems.cyfx = '';
    selectedRowKeys.value=[]

    // 现金科目
    bcashDisabled.value=false
    // 银行科目
    bbankDisabled.value=false
    // 现金等价物
    bcashEquivalenceDisabled.value=false
    controlledDisabled.value=false
    bdaybookDisabled.value=false
    lowerDisabled.value=false
    fuzhutDisabled.value=false
    pxjzDisabled.value=false
    xjllDisabled.value=false
    cyfxDisabled.value=false
    fuzhuCheckflag.value=true
    return true;
  }
  function tabChange() {
    if(activeKey.value=='2'){
      tableRef.value.$el.style.setProperty('width', '500px')
    }
  }
  function filterOption(input, option) {
    // 不是数字
    if(isNaN(input)){
      return option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    }else{
      return option.title.toLowerCase().startsWith(input.toLowerCase());
    }
  }

  // 弹框
  function openModalAll() {
    openCodeAllPopPage(true, {
      database: database.value,
      accId: accId.value,
      iyear: iyear.value,
    });
  }
  function modalAllData(data) {
    superiorCcode.value=data.ccode
    superiorCcodeChange(data.ccode)
  }
</script>
<style lang="less" scoped>
  .red_span {
    color: red;
    font-weight: bold;
    display: inline-block;
    width: 20px;
    text-align: right;
  }
  .nc-open-content {
    input {
      width: 35%;
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
    }
    label {
      padding: 5px 35px;
      color: #535353;
      font-size: 13px;
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
        background-color: #0096c7;
      }
    }
  }
  :deep(.ant-checkbox){
    border: 1px solid #2f2a2a
  }
  .nc-border-div {
    position: relative;
    border: 1px solid #4949496b;
    margin: 2% 0;
    width: 83%;

    .nc-border-div-span {
      min-width: 140px;
      background-color: white;
      position: absolute;
      top: -12px;
      left: 50px;
      display: block;
      text-align: center;
      color: black;
      font-weight: bold;
    }

    .nc-border-div-content {
      padding: 10px;
      min-height: 40px;
    }
  }
  .divtop{
    margin-top: 10px;
  }
  :deep(.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab) {
    height: 40px;
    margin: 0;
    margin-right: 2px;
    padding: 0 16px;
    line-height: 38px;
    background: #fafafa;
    border: 1px solid #f0f0f0;
    border-radius: 2px 2px 0 0;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    font-weight: bold;
    font-size: 13px;
  }
 .tablePointer {
    pointer-events: none;
  }
  .a-table-font-size-12 :deep(td),
  .a-table-font-size-12 :deep(th) {
    font-size: 14px !important;
    padding: 2px 8px !important;
  }

  :deep(.ant-tabs-content-holder){
    margin-top: -9px;
  }
</style>
