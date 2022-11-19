<template>
  <BasicModal
    destroyOnClose
    width="900px"
    :height="460"
    :closable="false"
    v-bind="$attrs"
    title="供应商信息"
    @ok="handleOk()"
    @cancel="closeOk()"
    @register="register"
  >
    <template #title>
      <div style="display: flex;color: #0096c7;">
        <span>
          <PlusCircleOutlined style="font-size: 24px;font-weight: bold;margin-top:5px;"/>
        </span>
        <span style="line-height:40px;font-size: 22px;margin-top:-5px;">
          &nbsp;&nbsp;账套-供应商信息
        </span>
      </div>
      <div style="display: inline-block;position:absolute;right: 40px;top: 10px;z-index: 100000;background:#ffffff">
        <img src="/cus.png" style="height:80px;margin-right: 55px;"/>
      </div>
    </template>

    <div :class="'nc-open-content'" style="height: 100%; overflow: hidden">
      <div class="open-content-up" style="margin-top: 20px">
        <a-radio-group v-model:value="manageType" style="margin-left: 50px;">
          <a-radio value="1">
            <span style="color: #000000;font-weight: bold;font-size: 10px;">外部供应商</span>
          </a-radio>
          <a-radio value="0" >
            <span style="color: #000000;font-weight: bold;font-size: 10px;">内部供应商</span>
          </a-radio>
        </a-radio-group>
        <br/>
        <label style="font-size: 18px;margin-left: 70px;width:150px;">供应商全称：</label>
        <a-input
          v-model:value="formItems.custName"
          class="abc"
          style="width: 70%;border-bottom: 2px solid #000000;"
        />
        <span class="red_span">*</span>
        <span style="color: red;margin-left: 40%;">{{nameAllError}}</span>
        <br/><br/><br/>
        <label>供应商编号：</label>
        <a-input v-model:value="formItems.custCode" style="pointer-events: none"/>
        <span class="red_span">*</span>
        <label>供应商简称：</label>
        <a-input
          v-model:value.trim="formItems.custAbbname"
          @blur="verifyAbbname(formItems.custAbbname)"
          autocomplete="off"
        />
        <span class="red_span">*</span>
        <br/>
        <label>税号：</label>
        <a-input
          v-model:value.trim="formItems.custSregcode"
          autocomplete="off"
          placeholder=""
        />
        <span class="red_span"></span>
        <label>供应商分类：</label>
        <a-select
          v-model:value="formItems.uniqueCustclass"
          show-search
          placeholder="供应商分类"
          option-filter-prop="children"
          style="width: 30%"
          allow-clear
        >
          <a-select-option
            v-for="custmerclass in custmerClassList"
            :key="custmerclass.uniqueCustclass"
            :value="custmerclass.uniqueCustclass"
          >
            {{ custmerclass.cusCclassName }}
          </a-select-option>
          <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
        </a-select>
        <span class="red_span"></span>
      </div>
      <div class="open-content-down" style="margin-top: 80px;">
        <a-tabs v-model:activeKey="activeKey" type="card">
          <a-tab-pane key="1" tab="管理信息">
            <div class="content-down-tab">
              <div class="down-tab-content">
                <label>母公司：</label>
                <a-select
                  v-model:value="formItems.uniqueCodeCcus"
                  show-search
                  option-filter-prop="children"
                  style="width: 27%;"
                  allow-clear
                >
                  <a-select-option
                    v-for="customer in supplierList"
                    :key="customer.uniqueCode"
                    :value="customer.uniqueCode"
                  >
                    {{ customer.custName }}
                  </a-select-option>
                  <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
                </a-select>
                &nbsp;
                <a style="font-weight: bold;font-size: 18px;"><LinkOutlined @click="modalShow" /></a>
                <label>对应客户：</label>
                <a-select
                  v-model:value="formItems.uniqueCodeSupplier"
                  show-search
                  option-filter-prop="children"
                  style="width: 26%;margin-left: -8px;"
                  allow-clear
                >
                  <a-select-option
                    v-for="supplier in custmerList"
                    :key="supplier.uniqueCode"
                    :value="supplier.uniqueCode"
                  >
                    {{ supplier.custName }}
                  </a-select-option>
                  <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
                </a-select>
                &nbsp;
                <a style="font-weight: bold;font-size: 18px;"><LinkOutlined @click="cusModalShow"/></a>

                <label>国家(地区)：</label>
                <a-select
                  v-model:value="formItems.countryName"
                  show-search
                  option-filter-prop="children"
                  style="width: 27%;"
                  allow-clear
                >
                  <a-select-option
                    v-for="countrys in countryList"
                    :key="countrys.countryId"
                    :value="countrys.countryId"
                  >
                    {{ countrys.namech }}
                  </a-select-option>
                  <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
                </a-select>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <label>行业性质：</label>
                <a-select
                  v-model:value="formItems.industryclassName"
                  show-search
                  option-filter-prop="children"
                  style="width: 26%;margin-left: -8px;"
                  allow-clear
                >
                  <a-select-option
                    v-for="nature in systradenatureList"
                    :key="nature.name"
                    :value="nature.name"
                  >
                    {{ nature.name }}
                  </a-select-option>
                  <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
                </a-select>
                <label>销售组织：</label>
                <a-select style="width: 27%;">
                  <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
                </a-select>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <label>成立日期：</label>
                <DatePicker style="width: 230px;margin-left: -9px;"/>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="联系方式">
            <div class="content-down-tab">
              <div class="down-tab-content">
                <label>省市：</label>
                <Cascader
                  v-model:value="zoneVal"
                  :options="zoningList"
                  placeholder="省/市/区"
                  style="width: 240px;border: none;text-align: center"
                  @change="zoneChange"
                />
                <label>邮政编码：</label>
                <a-input
                  v-model:value.trim="formItems.beiyong1"
                  autocomplete="off"
                  placeholder=""
                />
                <label>详细地址：</label>
                <a-input
                  v-model:value.trim="formItems.address2"
                  autocomplete="off"
                  placeholder=""
                  style="width: 27%"
                />
                <span style="margin-left: 4px;">
                  <label>官网：</label>
                  <a-input
                    v-model:value.trim="formItems.website"
                    autocomplete="off"
                    placeholder=""
                    style="width: 30%"
                  />
                </span>
                <label>联系人：</label>
                <a-input
                  v-model:value.trim="formItems.contacts"
                  autocomplete="off"
                  placeholder=""
                  style="width: 27%"
                />
                <span style="margin-left: 4px;">
                  <label>联系电话：</label>
                  <a-input
                    v-model:value.trim="formItems.telephone"
                    autocomplete="off"
                    placeholder=""
                  />
                </span>
                <label>手机：</label>
                <a-input
                  v-model:value.trim="formItems.cellPhoneNum"
                  autocomplete="off"
                  placeholder=""
                  style="width: 27%"
                />
                <span style="margin-left: 4px;">
                    <label>EMail：</label>
                    <a-input
                      v-model:value.trim="formItems.email"
                      autocomplete="off"
                      placeholder=""
                      style="width: 30%"
                    />
                </span>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="3" tab="银行账户">
            <div class="content-down-tab">
              <div class="down-tab-content">
                <label>开户银行：</label>
                <a-input
                  v-model:value.trim="formItems.custBank"
                  autocomplete="off"
                  placeholder="例如：中国建设银行朝阳路支行"
                />

                <label>开户地：</label>
                <a-input
                  v-model:value.trim="formItems.bankArea"
                  autocomplete="off"
                  placeholder="例如：武汉市汉阳区"
                />
                <br />
                <label>银行账号：</label>
                <a-input
                  v-model:value.trim="formItems.custAccount"
                  autocomplete="off"
                  placeholder=""
                  @change="verifyAccount"
                  style="width:30%;"
                />

                <label>银行行号：</label>
                <a-input
                  v-model:value.trim="formItems.bankCode"
                  autocomplete="off"
                  placeholder=""
                  style="width:30%;"
                />
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="4" tab="开发票">
            <div class="content-down-tab">
              <div class="down-tab-content">
                <label>开票抬头全称：</label>
                <a-input autocomplete="off" />

                <label>纳税人识别号：</label>
                <a-input autocomplete="off" />

                <label>地址、电话：</label>
                <a-input autocomplete="off" />

                <label>开户行及账号：</label>
                <a-input autocomplete="off" />
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="5" tab="财务设置">
            <div class="content-down-tab">
              <div class="down-tab-content">
                <label>应收科目控制：</label>
                <a-input autocomplete="off" />
                <label>收款策略：</label>
                <a-input autocomplete="off" />
                <label>业务币种：</label>
                <a-input autocomplete="off" />
                <label>价格级次：</label>
                <a-input autocomplete="off" />

                <label>信用控制：</label>
                <a-radio-group >
                  <a-radio value="1" style="width:100px;">
                    <span style="color: #000000;font-weight: bold;font-size: 10px;">不控制</span>
                  </a-radio>
                  <a-radio value="0" style="margin-left: -10px;">
                    <span style="color: #000000;font-weight: bold;font-size: 10px;">严格控制</span>
                  </a-radio>
                </a-radio-group>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <template #footer>
      <a-button @click="closeOk()">取消</a-button>
      <a-button @click="handleOk('close')" :disabled="saveClick">保存</a-button>
      <a-button @click="handleOk('add')" :disabled="saveClick" type="primary">保存并新增</a-button>
    </template>
    <ModalPop @throwData="parentModalData" @register="registerParentModalPopPage" />
    <CusModalPop @throwData="cusThrowData" @register="registerCusModalPopPage" />
  </BasicModal>
</template>
<script setup="props, { content }" lang="ts">
import {CaretDownOutlined, LinkOutlined, PlusCircleOutlined} from '@ant-design/icons-vue'
import {
  DatePicker,
  Input as AInput,
  Radio as ARadio,
  Select as ASelect,
  Statistic as AStatistic,
  Tabs as ATabs,
  Cascader
} from 'ant-design-vue';
import {ref, unref} from 'vue';
import {BasicModal, useModal, useModalInner} from '/@/components/Modal';
import {
  findAllSysTradeNature,
  findByCustAbbnameAndCustName,
  findByTenantIdCusAbbNameAndCustNameAssignAccount
} from "/@/api/record/system/supplier_group";
import {useMessage} from "/@/hooks/web/useMessage";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {saveLog} from "/@/api/record/system/group-sys-login-log";
import {findByUserIdAndTenantId} from "/@/api/record/system/group-permission";
import {useTable} from "/@/components/Table";
import {
  assignOrgSave,
  findAllCustomerClass,
  findByOrgAssigTenantId
} from "/@/api/record/system/supplier_class_group";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {customerSaveCusClass, findAllByCusBendEq1} from "/@/api/record/system/supplier_class";
import {findAllByFlag} from "/@/api/record/supplier_data/supplier";
import {findAllByFlag as findAllCusByFlag} from "/@/api/record/costomer_data/customer";
import ModalPop from '/@/views/boozsoft/global/popup/supplier/modalPop.vue';
import CusModalPop from '/@/views/boozsoft/global/popup/customer_info/modalPop.vue';
import {findAllProvince, findByZoneId} from "/@/api/record/system/zone";


const ASelectOption = ASelect.Option;
  const AInputSearch = AInput.Search;
  const AStatisticCountdown = AStatistic.Countdown;
  const ATabPane = ATabs.TabPane;
  const ARadioGroup = ARadio.Group
  const activeKey = ref('1');
  const emit=defineEmits(['register']);
  const {createConfirm, createWarningModal, createMessage} = useMessage();

  const saveClick: any = ref(false);
  const nameAllError: any = ref('');
  const tenantId: any = ref('');
  const orgUnique: any = ref('');
  const manageType: any = ref('1');
  const orgSaveFlag: any = ref('0');

  const accountInfo: any = ref({});
  const formItems: any = ref({});
  const oldformItems: any = ref({});
  const countryList: any = ref([]);
  const supplierList: any = ref([]);
  const custmerList: any = ref([]);
  const custmerClassList: any = ref([]);
  const systradenatureList: any = ref([]);
const zoningList = ref([]);
const zoneVal = ref([]);
const zoneData = ref('');
  const [registerParentModalPopPage, { openModal: openParentMoalPopPage }] = useModal();
  const [registerCusModalPopPage, { openModal: openCusMoalPopPage }] = useModal();

  const [registerTable, { reload ,getColumns ,setTableData,setColumns,getSelectRows,getDataSource,clearSelectedRowKeys,setPagination}] = useTable({

  });

  const [register, { closeModal }] = useModalInner(async (data) => {
    accountInfo.value=data.accountInfo
    formItems.value=data.data
    oldformItems.value=data.data
    tenantId.value = data.tenantId;
    orgUnique.value = data.orgUnique;
    saveClick.value=false

    zoningList.value = await findAllProvince()
    zoneVal.value=data.data.zone==undefined|| data.data.zone==null?[]:data.data.zone.split(',')
    let zoneArr:any=[]
    if(data.data.zone!==undefined && data.data.zone!=='' && data.data.zone!==null){
      for (let i = 0; i < data.data.zone.split(',').length; i++) {
        let temp=await findByZoneId(data.data.zone.split(',')[i])
        zoneArr.push(
          {value:temp[0].id,label:temp[0].zone_name}
        )
      }
    }
    zoneData.value=zoneArr.length>0?zoneArr:''

    setTimeout(()=>{
      // 供应商分类
      findByClass()
      // 母公司
      findBySupAll()
      // 对应客户
      findByCusAll()
    },200)
    // 全部行业信息
    findAllSysTradeNature().then((res) => {
      systradenatureList.value = res.items;
    });
    findByGroupPermission()
  });
  // 供应商分类
  async function findByClass() {
    // 全部供应商分类
    await useRouteApi(findAllByCusBendEq1,{schemaName: tenantId})('').then((res) => {
      if (res.items.length > 0) {
        custmerClassList.value = res.items;
        formItems.value.uniqueCustclass=custmerClassList.value[0].uniqueCustclass
      }else{
        closeModal();
        return createWarningModal({ content: '请先引入供应商分类！' });
      }
    });
  }
  // 集团档案权限分配表-集团供应商
  async function findByGroupPermission() {
    // 集团档案权限分配表-集团供应商
    let findByPermission=await findByUserIdAndTenantId(useUserStoreWidthOut().getUserInfo.id,tenantId.value,'customer')
    if(findByPermission.length>0){
      orgSaveFlag.value=findByPermission[0].isAuto
    }
  }
  // 母公司
  async function findBySupAll() {
    // 全部供应商信息
    await useRouteApi(findAllByFlag,{schemaName: tenantId})('1').then((res) => {
      supplierList.value = res.items;
    });
  }
  // 对应客户
  async function findByCusAll() {
    // 全部供应商信息
    await useRouteApi(findAllCusByFlag,{schemaName: tenantId})('1').then((res) => {
      custmerList.value = res.items;
    });
  }

  async function verifyAbbname(abbname: any) {
    if(formItems.value.custName=='' || formItems.value.custName==undefined){
      return createWarningModal({ content: '供应商全称不能为空！' });
    }
    if(orgSaveFlag.value=='1'&&abbname!==undefined&&abbname!==''){
      // 查询引入信息是否简称重复
      let orgAssignAbbName= await findByTenantIdCusAbbNameAndCustNameAssignAccount('2','1',abbname,formItems.value.custName,tenantId.value)
      if(orgAssignAbbName>0){
        return createWarningModal({ content: '供应商信息已引入,不允许重复！' });
      }
      // 查询未引入信息是否简称重复
      let noOrgAssignAbbName= await findByTenantIdCusAbbNameAndCustNameAssignAccount('2','0',abbname,formItems.value.custName,tenantId.value)
      if(noOrgAssignAbbName>0){
        return createWarningModal({ content: '供应商信息已存在,未引入！' });
      }
      const a = await findByCustAbbnameAndCustName(abbname,formItems.value.custName);
      if (a !='') {
        createConfirm({
          iconType: 'warning',
          title: '提示',
          okText:'引用',
          content: '供应商信息在集团供应商中存在,是否直接引入',
          onOk: async () => {
            let cusClassUnique:any=[]
            // 所有集团供应商分类
            let map={
              searchValue: '',
              superid: '',
              page: '1',
              size: '10000000',
            }
            let dataSource=await findAllCustomerClass(map)
            // 分配账套的供应商分类
            let assignData=await findByOrgAssigTenantId(orgUnique.value,'2',tenantId.value)
            // 集团供应商档案分配表数据
            let groupAssignData:any=[]
            // 所属分类是否分配给组织：没有 查询分类 一并分配
            let findByOrgCusLcass= assignData.filter(cl=>cl.dataUnique==a.uniqueCustclass)
            if(findByOrgCusLcass.length==0){
              let aa=dataSource.items.filter(f=>f.uniqueCustclass==a.uniqueCustclass)
              cusClassUnique.push(aa[0])
            }

            a.dataUnique=a.uniqueCode
            a.orgUnique=orgUnique.value
            a.flag=orgSaveFlag.value
            a.ctype='1'
            a.assignUserId=useUserStoreWidthOut().getUserInfo.id
            a.assignDate=getNowDate()
            a.acceptUserId=useUserStoreWidthOut().getUserInfo.id
            a.acceptDate=getNowDate()
            groupAssignData.push(a)
            //****************** 查找分类 ****************
            let data:any=[]
            cusClassUnique.forEach(a=>{
              if(a.cusClassGrade=='1'){
                data.push(a)
              }
              else{
                if(a.cusClassGrade=='2'){
                  // 2找1级
                  let temp= dataSource.items.filter(b=>b.uniqueCustclass==a.parentId)
                  let t=assignData.filter(c=>c.dataUnique==temp[0].uniqueCustclass)
                  if(t.length==0){
                    data.push(temp[0])
                  }
                }
                else if(a.cusClassGrade=='3'){
                  // 3找2级
                  let temp= dataSource.items.filter(b=>b.uniqueCustclass==a.parentId)
                  let t=assignData.filter(c=>c.dataUnique==temp[0].uniqueCustclass)
                  if(t.length==0){
                    data.push(temp[0])
                  }
                  // 2找1级
                  let temp2= dataSource.items.filter(b=>b.uniqueCustclass==temp[0].parentId)
                  let t2=assignData.filter(c=>c.dataUnique==temp2[0].uniqueCustclass)
                  if(t2.length==0){
                    data.push(temp2[0])
                  }
                }
              }
            })
            // 往账套供应商分类表添加
            let orgCusClassAssignArr= data.concat(cusClassUnique)
            if(orgCusClassAssignArr.length>0){
              orgCusClassAssignArr.forEach(async (a)=>{
                a.dataUnique=a.uniqueCustclass
                a.id=null
                a.orgUnique=orgUnique.value
                a.flag='1'
                a.ctype='1'
                a.assignUserId=useUserStoreWidthOut().getUserInfo.id
                a.assignDate=getNowDate()
                a.acceptUserId=useUserStoreWidthOut().getUserInfo.id
                a.acceptDate=getNowDate()
              })
              // 添加集团供应商分类分配表
              let map={ list:JSON.stringify([...new Set(orgCusClassAssignArr)])}
              await assignOrgSave(map)

              // 添加集团供应商分类分配表：类型改为组织
              orgCusClassAssignArr.forEach(async (a)=>{
                a.ctype='2'
              })
              // 添加集团供应商分类分配表
              let map2={ list:JSON.stringify([...new Set(orgCusClassAssignArr)])}
              await assignOrgSave(map2)

              // 往账套供应商分类表添加
              await useRouteApi(customerSaveCusClass,{schemaName: tenantId})(orgCusClassAssignArr)
            }
            //****************** 查找分类END ****************
            formItems.value=a

            formItems.value.manageType = manageType.value;
            formItems.value.closeflag = 'close';
            formItems.value.flag = '1';
            formItems.value.province =zoneData.value!==''?zoneData.value[0].label:formItems.value.province;
            formItems.value.city = zoneData.value!==''?zoneData.value[1].label:formItems.value.city;
            formItems.value.area = zoneData.value!==''?zoneData.value[2].label:formItems.value.area;
            formItems.value.zone = zoneVal.value.join(',')
            formItems.value.custCode = a.custCode;
            emit('save', unref(formItems.value));
            closeModal();
          },
          onCancel: async () => {
            formItems.value.custAbbname=''
          }
        })
      }
    }
    else{
      // 查询引入信息是否重复
      let orgAssignAbbName= await findByTenantIdCusAbbNameAndCustNameAssignAccount('2','1',formItems.value.custAbbname,formItems.value.custName,tenantId.value)
      if(orgAssignAbbName>0){
        return createWarningModal({ content: '供应商信息已引入,不允许重复！' });
      }
      // 查询未引入信息是否重复
      let noOrgAssignAbbName= await findByTenantIdCusAbbNameAndCustNameAssignAccount('2','0',formItems.value.custAbbname,formItems.value.custName,tenantId.value)
      if(noOrgAssignAbbName>0){
        return createWarningModal({ content: '供应商信息已分配组织,未引入！' });
      }
    }
  }

  async function handleOk(closeflag) {
    if(formItems.value.custName=='' || formItems.value.custName==undefined){
      return createWarningModal({ content: '供应商全称不能为空！' });
    }
    if(formItems.value.custAbbname==''|| formItems.value.custAbbname==undefined){
      return createWarningModal({ content: '供应商简称不能为空！' });
    }
    // 查询引入信息是否重复
    let orgAssignAbbName= await findByTenantIdCusAbbNameAndCustNameAssignAccount('2','1',formItems.value.custAbbname,formItems.value.custName,tenantId.value)
    if(orgAssignAbbName>0){
      return createWarningModal({ content: '供应商信息已引入,不允许重复！' });
    }
    // 查询未引入信息是否重复
    let noOrgAssignAbbName= await findByTenantIdCusAbbNameAndCustNameAssignAccount('2','0',formItems.value.custAbbname,formItems.value.custName,tenantId.value)
    if(noOrgAssignAbbName>0){
      return createWarningModal({ content: '供应商信息已分配组织,未引入！' });
    }

    formItems.value.manageType = manageType.value;
    formItems.value.closeflag = closeflag;
    formItems.value.successState = '0';
    formItems.value.flag = '1';
    formItems.value.province =zoneData.value!==''?zoneData.value[0].label:formItems.value.province;
    formItems.value.city = zoneData.value!==''?zoneData.value[1].label:formItems.value.city;
    formItems.value.area = zoneData.value!==''?zoneData.value[2].label:formItems.value.area;
    formItems.value.zone = zoneVal.value.join(',')
    saveClick.value=true
    emit('save', unref(formItems.value));
    closeModal();
  }
  const closeOk = async () => {
    /************** 记录操作日志 ****************/
    let map={
      loginTime:new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "),
      userId: useUserStoreWidthOut().getUserInfo.username,
      userName: useUserStoreWidthOut().getUserInfo.realName,
      optModule:'master_data',
      optFunction:'账套',
      optRange:'1',
      uniqueCode:orgUnique.value,
      optAction:'新增申请',
      optContent:'操作内容【关闭新增申请-修改】,账套代码【'+accountInfo.value.coCode+'】,账套名称【'+accountInfo.value.companyName+'】',
    }
    await saveLog(map)
    /************** 记录操作日志 End ****************/
    emit('closeOk');
    closeModal();
  }
  // 当前时间
  function getNowDate() {
    return new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," ");
  }

  function cusThrowData(data) {
    formItems.value.uniqueCodeSupplier=data[data.length-1].uniqueCode
  }
  function parentModalData(data) {
    formItems.value.uniqueCodeCcus=data[data.length-1].uniqueCode
  }

  const modalShow = () => {
    openParentMoalPopPage(true, {
      database: tenantId.value,
      accId: tenantId.value.substring(0,tenantId.value.length-5),
    });
  }
  const cusModalShow = () => {
    openCusMoalPopPage(true, {
      database: tenantId.value,
      accId: tenantId.value.substring(0,tenantId.value.length-5),
    });
  }
</script>
<style lang="less" scoped>
:deep(.ant-calendar-picker-input.ant-input), :deep(.ant-select-single:not(.ant-select-customize-input) .ant-select-selector .ant-select-selection-search-input) {
  border: none;
  border-bottom: solid 1px rgb(191, 191, 191) !important;
  width: 100%;
  font-weight: bold;
}

:deep(.ant-select-single:not(.ant-select-customize-input)
.ant-select-selector
.ant-select-selection-search-input) {
  border: none !important;
}

.vben-basic-title {
  color: rgb(1, 129, 226) !important;
}

.ant-modal-body {
  padding: 0px;
  border: 1px solid rgb(1, 129, 226);
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
    padding-bottom: 5px;
    padding-left: 2em;
    color: #535353;
    font-size: 13px;
    margin-left: 2em;
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

.nc-open-show-content {

  input {
    width: 30%;
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
    font-weight: bold;
    font-size: 14px;
  }

  .abc{
    border-bottom: 2px solid #666666 !important;
    font-size: 18px;
  }

  pointer-events: none;
  cursor: default;

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
    padding-bottom: 5px;
    padding-left: 2em;
    color: #535353;
    font-size: 13px;
    margin-left: 2em;
    font-weight: bold;
  }

  .open-content-down {
    margin-top: 5%;

    :deep(.ant-tabs-tab) {
      pointer-events: auto;
    }

    .ant-tabs-tab-active::before {
      position: absolute;
      top: 0px;
      left: 0;
      width: 100%;
      border-top: 2px solid transparent;
      border-radius: 2px 2px 0 0;
      transition: all 0.3s;
      content: '';
      background-color: rgb(1, 143, 251);
    }
  }
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

</style>
