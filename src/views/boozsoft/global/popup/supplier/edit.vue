<template>
  <BasicModal
    width="900px"
    :height="490"
    v-bind="$attrs"
    title="供应商信息"
    @ok="handleOk()"
    @cancel="closeOk()"
    :showOkBtn="isEdit"
    :showCancelBtn="isEdit"
    @register="register"
  >
    <Loading :loading="compState.loading" :absolute="compState.absolute" :tip="compState.tip" />

    <template v-if="openType=='add'" #title>
      <div style="display: flex;color: #0096c7;">
        <span style="line-height:40px;font-size: 28px;">
          <PlusCircleOutlined style="font-size: 29px;font-weight: bold"/>
        </span>
        <span style="line-height:40px;font-size: 28px;">
          &nbsp;&nbsp;供应商
        </span>
      </div>
      <div style="display: inline-block;position:absolute;right: 40px;top: 10px;z-index: 100000;background:#ffffff">
        <img src="/cus.png" style="height:90px;margin-right: 55px;"/>
      </div>
    </template>
    <template v-if="openType=='edit'" #title>
      <div style="display: flex;color: #0096c7;">
        <span style="line-height:40px;font-size: 28px;">
          <FormOutlined style="font-size: 29px;font-weight: bold"/>
        </span>
        <span style="line-height:40px;font-size: 28px;">
          &nbsp;&nbsp;供应商
        </span>
      </div>
      <div style="display: inline-block;position:absolute;right: 40px;top: 10px;z-index: 100000;background:#ffffff">
        <img src="/cus.png" style="height:90px;margin-right: 55px;"/>
      </div>
    </template>
    <template v-if="openType=='look'" #title>
      <div style="display: flex;color: #0096c7;">
        <span style="line-height:40px;font-size: 28px;">
          <FileSearchOutlined style="font-size: 29px;font-weight: bold"/>
        </span>
        <span style="line-height:40px;font-size: 28px;">
          &nbsp;&nbsp;供应商
        </span>
      </div>
      <div style="display: inline-block;position:absolute;right: 40px;top: 10px;z-index: 100000;background:#ffffff">
        <img src="/cus.png" style="height:90px;margin-right: 55px;"/>
      </div>
    </template>

    <div :class="isEdit?'nc-open-content':'nc-open-show-content'" style="height: 100%; overflow: hidden;margin-top: 20px;">
      <div class="open-content-up">
        <a-radio-group style="margin-left: 53px;" v-model:value="formItems.manageType" v-model:disabled="manageTypeFlag">
          <a-radio value="1" >
            <span style="color: #000000;font-weight: bold;font-size: 10px;">外部供应商</span>
          </a-radio>
          <a-radio value="0" style="margin-left: -10px;">
            <span style="color: #000000;font-weight: bold;font-size: 10px;">内部供应商</span>
          </a-radio>
        </a-radio-group>
        <br/>
        <label style="font-size: 18px;margin-left: 70px;width:150px;">供应商全称：</label>
        <a-input
          v-model:disabled="custNameFlag"
          v-model:value="formItems.custName"
          class="abc"
          style="width: 60%;border-bottom: 2px solid #000000;"
          @change="verifyName(formItems.custName)"
        />
        <span class="red_span">*</span>
        <span style="color: red;margin-left: 40%;">{{nameAllError}}</span>
        <br/><br/><br/>
        <label>供应商编号：</label>
        <a-input v-model:value="formItems.custCode" @change="verifyNum(formItems.custCode)"/>
        <span class="red_span">*</span>
        <label>供应商分类：</label>
        <a-select
          v-model:value="uniqueCustclass"
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
        <br/>
        <label>供应商简称：</label>
        <a-input
          v-model:disabled="custAbbnameFlag"
          v-model:value.trim="formItems.custAbbname"
          @change="verifyAbbname(formItems.custAbbname)"
          autocomplete="off"
        />
        <span class="red_span">*</span>
        <label>税号：</label>
        <a-input
          v-model:disabled="custSregcodeFlag"
          v-model:value.trim="formItems.custSregcode"
          @change="verifySregcode(formItems.custSregcode)"
          autocomplete="off"
          placeholder=""
        />
        <label>备注：</label>
        <a-input
          v-model:value.trim="formItems.remarks"
          autocomplete="off"
          placeholder=""
          style="width: 695px;"
          show-count :maxlength="100"
        />
        <br/>

        <span v-if="openType=='edit'">
          <label>启用状态：</label>
          <a-radio-group v-model:value="custflag">
            <a-radio value="1" >
              <span style="color: #000000;font-weight: bold;font-size: 10px;">启用</span>
            </a-radio>
            <a-radio value="0" style="margin-left: -10px;">
              <span style="color: #000000;font-weight: bold;font-size: 10px;">停用</span>
            </a-radio>
          </a-radio-group>
        </span>
      </div>
      <div class="open-content-down" style="margin-top: 74px;">
        <a-tabs v-model:activeKey="activeKey" type="card">
          <a-tab-pane key="1" tab="管理信息">
            <div class="content-down-tab">
              <div class="down-tab-content">
                <label>母公司：</label>
                <a-select
                  v-model:value="formItems.uniqueCodeCcus"
                  v-model:disabled="uniqueCodeCcusFlag"
                  show-search
                  placeholder="请选择母公司"
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
                <a v-if="isEdit" style="font-weight: bold;font-size: 18px;"><LinkOutlined @click="modalShow" /></a>
                <a v-else style="font-weight: bold;font-size: 18px;">&emsp;</a>

                <label>对应客户：</label>
                <a-select
                  v-model:value="formItems.uniqueCodeSupplier"
                  v-model:disabled="uniqueCodeSupplierFlag"
                  show-search
                  placeholder="请选择客户"
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
                <a v-if="isEdit" style="font-weight: bold;font-size: 18px;"><LinkOutlined @click="cusModalShow"/></a>
                <a v-else style="font-weight: bold;font-size: 18px;">&emsp;</a>

                <label>国家(地区)：</label>
                <a-select
                  v-model:value="formItems.countryName"
                  v-model:disabled="countryNameFlag"
                  show-search
                  placeholder="国家/地区"
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
                  v-model:disabled="industryclassNameFlag"
                  show-search
                  placeholder="行业性质"
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
                  v-model:disabled="websiteFlag"
                  v-model:value.trim="formItems.beiyong4"
                  autocomplete="off"
                  placeholder=""
                />
                <label>详细地址：</label>
                <a-input
                  v-model:disabled="address2Flag"
                  v-model:value.trim="formItems.address2"
                  autocomplete="off"
                  placeholder=""
                  style="width: 27%"
                />

                <span style="margin-left: 4px;">
                  <label>官网：</label>
                  <a-input
                    v-model:disabled="websiteFlag"
                    v-model:value.trim="formItems.website"
                    autocomplete="off"
                    placeholder=""
                    style="width: 30%"
                  />
                </span>
                  <label>联系人：</label>
                  <a-input
                    v-model:disabled="contactsFlag"
                    v-model:value.trim="formItems.contacts"
                    autocomplete="off"
                    placeholder=""
                    style="width: 27%"
                  />
                  <span style="margin-left: 4px;">
                    <label>联系电话：</label>
                    <a-input
                      v-model:disabled="telephoneFlag"
                      v-model:value.trim="formItems.telephone"
                      autocomplete="off"
                      placeholder=""
                    />
                  </span>
                    <label>手机：</label>
                    <a-input
                      v-model:disabled="cellPhoneNumFlag"
                      v-model:value.trim="formItems.cellPhoneNum"
                      autocomplete="off"
                      placeholder=""
                      style="width: 27%"
                    />
                    <span style="margin-left: 4px;">
                        <label>EMail：</label>
                        <a-input
                          v-model:disabled="emailFlag"
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
                  v-model:disabled="custBankFlag"
                  v-model:value.trim="formItems.custBank"
                  autocomplete="off"
                  placeholder="例如：中国建设银行朝阳路支行"
                />

                  <label>开户地：</label>
                  <a-input
                    v-model:disabled="bankAreaFlag"
                    v-model:value.trim="formItems.bankArea"
                    autocomplete="off"
                    placeholder="例如：武汉市汉阳区"
                  />

                <br />
                <label>银行账号：</label>
                <a-input
                  v-model:disabled="custAccountFlag"
                  v-model:value.trim="formItems.custAccount"
                  autocomplete="off"
                  placeholder=""
                  @change="verifyAccount"
                  style="width:30%;"
                />

                  <label>银行行号：</label>
                  <a-input
                    v-model:disabled="bankCodeFlag"
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
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="6" tab="业务信息">
            <div class="content-down-tab">
              <div class="down-tab-content">
                <label>税率：</label>
                <a-input v-model:value="formItems.taxRate" autocomplete="off" />
                <label>价格级次：</label>
                <a-select
                  v-model:value="formItems.priceLevel"
                  option-filter-prop="children"
                  style="width: 27%;"
                  allow-clear
                >
                  <a-select-option value="协议价">协议价</a-select-option>
                  <a-select-option value="零售价">零售价</a-select-option>
                  <a-select-option value="一级">一级</a-select-option>
                  <a-select-option value="二级">二级</a-select-option>
                  <a-select-option value="三级">三级</a-select-option>
                  <a-select-option value="四级">四级</a-select-option>
                  <a-select-option value="五级">五级</a-select-option>
                  <a-select-option value="六级">六级</a-select-option>
                  <a-select-option value="七级">七级</a-select-option>
                  <a-select-option value="八级">八级</a-select-option>
                  <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
                </a-select>
                <label>信用控制：</label>
                <a-radio-group v-model:value="formItems.creditMommand" >
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
      <div v-if="!isEdit">
        <a-button @click="closeOk()" type="primary">关闭</a-button>
      </div>
      <div v-if="isEdit">
        <a-button @click="closeOk()">取消</a-button>

        <span v-if="openType=='edit'">
          &emsp;
          <a-button @click="handleOk('close')" :disabled="saveClick" type="primary">保存</a-button>
        </span>
        <span v-else>&emsp;
          <a-button @click="handleOk('close')" :disabled="saveClick">保存</a-button>
          <a-button @click="handleOk('add')" :disabled="saveClick" type="primary">保存并新增</a-button>
        </span>
      </div>
    </template>
    <ModalPop @throwData="parentModalData" @register="registerParentModalPopPage" />
    <CusModalPop @throwData="cusThrowData" @register="registerCusModalPopPage" />
  </BasicModal>
</template>
<script setup="props, { content }" lang="ts">
import {
  CaretDownOutlined,
  FileSearchOutlined,
  FormOutlined,
  LinkOutlined,
  PlusCircleOutlined
} from '@ant-design/icons-vue'
import {
  DatePicker,
  Input as AInput,
  Radio as ARadio,
  Select as ASelect,
  Statistic as AStatistic,
  Tabs as ATabs,
  Cascader
} from 'ant-design-vue';
import {reactive, ref, unref} from 'vue';
import {BasicModal, useModal, useModalInner} from '/@/components/Modal';
import {
  auditSupplierSave,
  findAllByFlag,
  findAllCountry,
  findAllSysTradeNature,
  verifyByCustAbbname,
  verifyByCustSregcode,
  verifyCustAccount,
  verifyCustomerId,
  verifyCustomerName,
  verifyCustomerNum,
} from '/@/api/record/supplier_data/supplier';
import {findAllByFlag as custfindAllByFlag} from '/@/api/record/costomer_data/customer';
import {findAllByCusBendEq1} from '/@/api/record/system/supplier_class';
import {findAllProvince, findByZoneId} from '/@/api/record/system/zone';
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useUserStoreWidthOut} from '/@/store/modules/user';
import ModalPop from '/@/views/boozsoft/global/popup/supplier/modalPop.vue';
import CusModalPop from '/@/views/boozsoft/global/popup/customer_info/modalPop.vue';
/******************* 弹框加载中 **************************/
import {Loading} from '/@/components/Loading';
import {useMessage} from "/@/hooks/web/useMessage";
import {saveLog} from "/@/api/record/system/group-sys-login-log";


const {createConfirm, createWarningModal, createMessage} = useMessage();
  // tab默认
  const zoneVal = ref([]);
  const zoneData = ref('');
  const activeKey = ref('1');
  const ASelectOption = ASelect.Option;
  const AInputSearch = AInput.Search;
  const AStatisticCountdown = AStatistic.Countdown;
  const ATabPane = ATabs.TabPane;
  const ARadioGroup = ARadio.Group
  const emit=defineEmits(['save','approveSave','updateKeyWordIsAutoSave', 'edit_database','register']);
  const  saveClick= ref(false)
  const  isEdit= ref(true)
  const verifyCustAccountFlag: any = ref(true);
  const verifyNameFlag: any = ref(true);
  const verifyNumFlag: any = ref(true);
  const verifyAbbnameFlag: any = ref(true);
  const verifySregcodeFlag: any = ref(true);
  const accountInfo: any = ref({});
  const formItems: any = ref({});
  const oldformItems: any = ref({});
  const countryList: any = ref([]);
  const supplierList: any = ref([]);
  const custmerList: any = ref([]);
  const custmerClassList: any = ref([]);
  const systradenatureList: any = ref([]);
  const custflag: any = ref('1');
  // 供应商分类
  const uniqueCustclass: any = ref();
  // 省
  const provinceList: any = ref();
  // 市
  const cityList: any = ref([]);
  // 区
  const districtList: any = ref([]);
  // 是否管控
  const isControl: any = ref();
  // 是否自动分配
  const isAuto: any = ref();
  // 允许修改关键字
  const isKeyword: any = ref();
  // 允许允许修改其他信息
  const isOther: any = ref();
  // 添加/修改 区分标识
  const type: any = ref();
  /* ************关键字**************** */
  // 全称是否可输入状态
  const custNameFlag: any = ref(false);
  // 简称是否可输入状态
  const custAbbnameFlag: any = ref(false);
  // 税号是否可输入状态
  const custSregcodeFlag: any = ref(false);
  /* ************非关键字**************** */
  // 管理类型
  const manageTypeFlag: any = ref(false);
  // 母公司
  const uniqueCodeCcusFlag: any = ref(false);
  // 供应商
  const uniqueCodeSupplierFlag: any = ref(false);
  // 省
  const provinceFlag: any = ref(false);
  // 市
  const cityFlag: any = ref(false);
  // 区
  const areaFlag: any = ref(false);
  // 联系人
  const contactsFlag: any = ref(false);
  // 街道
  const address2Flag: any = ref(false);
  // 电话
  const telephoneFlag: any = ref(false);
  // 国家
  const countryNameFlag: any = ref(false);
  // 手机
  const cellPhoneNumFlag: any = ref(false);
  // 网址
  const websiteFlag: any = ref(false);
  // 邮箱
  const emailFlag: any = ref(false);
  // 行业性质
  const industryclassNameFlag: any = ref(false);
  // 开户银行
  const custBankFlag: any = ref(false);
  // 开户地
  const bankAreaFlag: any = ref(false);
  // 银行账户
  const custAccountFlag: any = ref(false);
  // 银行行号
  const bankCodeFlag: any = ref(false);
  const defaultPage: any = ref(true);
  const database: any = ref('');
  const nameAllError: any = ref('');
  const openType: any = ref('');
  const zoningList = ref([]);

  const [registerParentModalPopPage, { openModal: openParentMoalPopPage }] = useModal();
  const [registerCusModalPopPage, { openModal: openCusMoalPopPage }] = useModal();

  const options = ref([]);
  const [register, { closeModal }] = useModalInner(async (data) => {
    openCompFullLoading()
    accountInfo.value=data.accountInfo
    openType.value=data.type
    database.value=data.database
    defaultPage.value=data.defaultPage
    // data.defaultPage=true (独立账套)，data.defaultPage=false (公司账套)
    console.log('独立账套='+data.defaultPage)

    zoningList.value = await findAllProvince()
    // 全部客户信息
    await useRouteApi(custfindAllByFlag,{schemaName: database})('1').then((res) => {
      custmerList.value = res.items;
    });
    // 全部供应商
    findBySup()
    // 全部供应商分类
   await useRouteApi(findAllByCusBendEq1,{schemaName: database})('').then((res) => {
      custmerClassList.value = res.items;
      if (res.items.length > 0) {
        if (data.type === 'add') {
          uniqueCustclass.value = res.items[0].uniqueCustclass;
        } else {
          uniqueCustclass.value = data.data.uniqueCustclass;
        }
      }
    });
    // 全部行业信息
    findAllSysTradeNature().then((res) => {
      systradenatureList.value = res.items;
    });
    // 国家信息
    findAllCountry().then((res) => {
      countryList.value = res.items;
    });

    type.value = data.type;
    if(data.type==='add'){
      custNameFlag.value = false;
      custAbbnameFlag.value = false;
      custSregcodeFlag.value = false;
      formItems.value.creditMommand='0'
      formItems.value.priceLevel='协议价'
    }else{
      formItems.value.creditMommand=data.data.creditMommand
      formItems.value.priceLevel=data.data.priceLevel
    }

    formItems.value.address1=data.data.address1
    formItems.value.address2=data.data.address2
    formItems.value.applyDatabaseUniqueCode=data.data.applyDatabaseUniqueCode
    formItems.value.applyDate=data.data.applyDate
    formItems.value.applyUser=data.data.applyUser
    formItems.value.approveDate=data.data.approveDate
    formItems.value.approveUser=data.data.approveUser
    formItems.value.area=data.data.area
    formItems.value.bankArea=data.data.bankArea
    formItems.value.bankCode=data.data.bankCode
    formItems.value.beiyong1=data.data.beiyong1
    formItems.value.beiyong2=data.data.beiyong2
    formItems.value.beiyong3 =data.data.beiyong3
    formItems.value.beiyong4=data.data.beiyong4
    formItems.value.beiyong5=data.data.beiyong5
    formItems.value.beiyong6=data.data.beiyong6
    formItems.value.beiyong7=data.data.beiyong7
    formItems.value.beiyong8=data.data.beiyong8
    formItems.value.beiyong9=data.data.beiyong9
    formItems.value.beiyong10=data.data.beiyong10
    formItems.value.biandongMethod=data.data.biandongMethod
    formItems.value.cellPhoneNum=data.data.cellPhoneNum
    formItems.value.city=data.data.city
    formItems.value.contacts=data.data.contacts
    formItems.value.countryName=data.data.countryName
    formItems.value.custAbbname=data.data.custAbbname
    formItems.value.custAccount=data.data.custAccount
    formItems.value.custBank=data.data.custBank
    formItems.value.custCode=data.data.custCode
    formItems.value.custDevdate=data.data.custDevdate
    formItems.value.custName=data.data.custName
    formItems.value.custSregcode=data.data.custSregcode
    formItems.value.email=data.data.email
    formItems.value.flag=data.data.flag
    formItems.value.id=data.data.id
    formItems.value.industryclassName=data.data.industryclassName
    formItems.value.manageType=data.data.manageType===''?'1':data.data.manageType
    formItems.value.province=data.data.province
    formItems.value.remarks=data.data.remarks
    formItems.value.successState=data.data.successState
    formItems.value.telephone=data.data.telephone
    formItems.value.tenantId=data.data.tenantId
    formItems.value.uniqueCode=data.data.uniqueCode
    formItems.value.uniqueCodeCcus=data.data.uniqueCodeCcus
    formItems.value.uniqueCodeSupplier=data.data.uniqueCodeSupplier
    formItems.value.uniqueCustclass=data.data.uniqueCustclass
    formItems.value.uniqueCustclassName=data.data.uniqueCustclassName
    formItems.value.website=data.data.website
    formItems.value.isDel=data.data.isDel
    formItems.value.taxRate=data.data.taxRate
    formItems.value.zone=data.data.zone
    zoneVal.value=data.data.zone==undefined ||data.data.zone==null?[]:data.data.zone.split(',')
    let zoneArr:any=[]
    if(data.data.zone!==undefined && data.data.zone!==''&& data.data.zone!==null){
      for (let i = 0; i < data.data.zone.split(',').length; i++) {
        let temp=await findByZoneId(data.data.zone.split(',')[i])
        zoneArr.push(
          {value:temp[0].id,label:temp[0].zone_name}
        )
      }
    }
    zoneData.value=zoneArr.length>0?zoneArr:''

    oldformItems.value.address1=data.data.address1
    oldformItems.value.address2=data.data.address2
    oldformItems.value.applyDatabaseUniqueCode=data.data.applyDatabaseUniqueCode
    oldformItems.value.applyDate=data.data.applyDate
    oldformItems.value.applyUser=data.data.applyUser
    oldformItems.value.approveDate=data.data.approveDate
    oldformItems.value.approveUser=data.data.approveUser
    oldformItems.value.area=data.data.area
    oldformItems.value.bankArea=data.data.bankArea
    oldformItems.value.bankCode=data.data.bankCode
    oldformItems.value.beiyong1=data.data.beiyong1
    oldformItems.value.beiyong2=data.data.beiyong2
    oldformItems.value.beiyong3 =data.data.beiyong3
    oldformItems.value.beiyong4=data.data.beiyong4
    oldformItems.value.beiyong5=data.data.beiyong5
    oldformItems.value.beiyong6=data.data.beiyong6
    oldformItems.value.beiyong7=data.data.beiyong7
    oldformItems.value.beiyong8=data.data.beiyong8
    oldformItems.value.beiyong9=data.data.beiyong9
    oldformItems.value.beiyong10=data.data.beiyong10
    oldformItems.value.biandongMethod=data.data.biandongMethod
    oldformItems.value.cellPhoneNum=data.data.cellPhoneNum
    oldformItems.value.city=data.data.city
    oldformItems.value.contacts=data.data.contacts
    oldformItems.value.countryName=data.data.countryName
    oldformItems.value.custAbbname=data.data.custAbbname
    oldformItems.value.custAccount=data.data.custAccount
    oldformItems.value.custBank=data.data.custBank
    oldformItems.value.custCode=data.data.custCode
    oldformItems.value.custDevdate=data.data.custDevdate
    oldformItems.value.custName=data.data.custName
    oldformItems.value.custSregcode=data.data.custSregcode
    oldformItems.value.email=data.data.email
    oldformItems.value.flag=data.data.flag
    oldformItems.value.industryclassName=data.data.industryclassName
    oldformItems.value.manageType=data.data.manageType===''?'1':data.data.manageType
    oldformItems.value.province=data.data.province
    oldformItems.value.remarks=data.data.remarks
    oldformItems.value.successState=data.data.successState
    oldformItems.value.telephone=data.data.telephone
    oldformItems.value.tenantId=data.data.tenantId
    oldformItems.value.uniqueCode=data.data.uniqueCode
    oldformItems.value.uniqueCodeCcus=data.data.uniqueCodeCcus
    oldformItems.value.uniqueCodeSupplier=data.data.uniqueCodeSupplier
    oldformItems.value.uniqueCustclass=data.data.uniqueCustclass
    oldformItems.value.uniqueCustclassName=data.data.uniqueCustclassName
    oldformItems.value.website=data.data.website
    oldformItems.value.isDel=data.data.isDel
    oldformItems.value.taxRate=data.data.taxRate
    oldformItems.value.zone=data.data.zone

    isEdit.value = data.isEdit
    custflag.value = data.data.flag==undefined || data.data.flag=='1'?'1':'0'
    compState.loading = false
    saveClick.value = false
  });
const loadingRef = ref(false);
  const compState = reactive({
    absolute: false,
    loading: false,
    tip: '加载中...',
  });
  function openCompFullLoading() {
    openLoading(false);
  }
  function openLoading(absolute: boolean) {
    compState.absolute = absolute;
    compState.loading = true;
  }
  /*******************END**************************/
  function cusThrowData(data) {
    formItems.value.uniqueCodeSupplier=data[data.length-1].uniqueCode
  }
  function parentModalData(data) {
    formItems.value.uniqueCodeCcus=data[data.length-1].uniqueCode
  }

  const modalShow = () => {
    openParentMoalPopPage(true, {
      database: database.value,
      accId: database.value.substring(0,database.value.length-5),
    });
  }
  const cusModalShow = () => {
    openCusMoalPopPage(true, {
      database: database.value,
      accId: database.value.substring(0,database.value.length-5),
    });
}

  async function findBySup() {
    // 全部供应商信息
    await useRouteApi(findAllByFlag,{schemaName: database})('1').then((res) => {
      supplierList.value = res.items;
    });
  }
  const verifyAccount = async () => {
    if(formItems.value.custAccount!==''){
      const custAccount = await useRouteApi(verifyCustAccount,{schemaName: database})(formItems.value.custAccount)
      if (custAccount > 0) {
        createWarningModal({ content: '银行账户已存在' });
        verifyCustAccountFlag.value = false;
      } else {
        verifyCustAccountFlag.value = true;
      }
    }else{
      verifyCustAccountFlag.value = false;
    }
  }
  async function verifyName(name: any) {
    if(name!==''){
      const a = await useRouteApi(verifyCustomerName,{schemaName: database})(name)
      if (a > 0) {
        nameAllError.value='供应商全称已存在'
        verifyNameFlag.value = false;
      } else {
        nameAllError.value=''
        verifyNameFlag.value = true;
      }
    }
  }
  async function verifyNum(num: any) {
    if(num!==''){
      const a = await useRouteApi(verifyCustomerNum,{schemaName: database})(num)
      if (a > 0) {
        createWarningModal({ content: '供应商编码已存在' });
        verifyNumFlag.value = false;
      } else {
        verifyNumFlag.value = true;
      }
    }
  }
  async function verifyAbbname(abbname: any) {
    if(abbname!==''){
      const a = await useRouteApi(verifyByCustAbbname,{schemaName: database})(abbname)
      if (a > 0) {
        createWarningModal({ content: '供应商简称已存在' });
        verifyAbbnameFlag.value = false;
      } else {
        verifyAbbnameFlag.value = true;
      }
    }
  }
  async function verifySregcode(sregcode: any) {
    if (sregcode !== '') {
      const a = await useRouteApi(verifyByCustSregcode,{schemaName: database})(sregcode)
      if (a > 0) {
        createWarningModal({ content: '税号已存在' });
        verifySregcodeFlag.value = false;
      } else {
        verifySregcodeFlag.value = true;
      }
    }
  }

  async function handleOk(closeflag) {
    if (formItems.value.custName === '') {
      createWarningModal({ content: '请填写供应商全称' });
      return;
    } else if (!verifyNameFlag.value) {
      nameAllError.value='供应商全称已存在'
    }

    if (formItems.value.custCode === '') {
      createWarningModal({ content: '请填写供应商编码' });
      return;
    } else if (!verifyNumFlag.value) {
      createWarningModal({ content: '供应商编码已存在' });
      return;
    }else if(formItems.value.custCode !== ''){
      if(type.value==='add'){
        formItems.value.beiyong1=useUserStoreWidthOut().getUserInfo.id
      }else{
        formItems.value.beiyong3=useUserStoreWidthOut().getUserInfo.id
        // 提交前判断单据是否被删除
        let findByExist=await useRouteApi(verifyCustomerId,{schemaName: database})(formItems.value.id)
        if(findByExist===0){
          return createWarningModal({ content: '单据已删除' });
        }
      }
    }

    if (formItems.value.custAbbname === '') {
      return createWarningModal({ content: '请填写供应商简称' });
    } else if (!verifyAbbnameFlag.value) {
      return createWarningModal({ content: '供应商简称已存在' });
    }
    if (!verifySregcodeFlag.value) {
      return createWarningModal({ content: '税号已存在' });
    }
    if (!verifyCustAccountFlag.value) {
      return createWarningModal({ content: '银行账户已存在' });
    }

    formItems.value.uniqueCustclass = uniqueCustclass.value;
    formItems.value.flag = custflag.value;
    formItems.value.province =zoneData.value!==''?zoneData.value[0].label:formItems.value.province;
    formItems.value.city = zoneData.value!==''?zoneData.value[1].label:formItems.value.city;
    formItems.value.area = zoneData.value!==''?zoneData.value[2].label:formItems.value.area;
    formItems.value.zone = zoneVal.value.join(',')

    let log=''
    if(formItems.value.id!==''){
      if(oldformItems.value.custName!==formItems.value.custName){
        log+='供应商全称【'+oldformItems.value.custName+','+formItems.value.custName+'】,'
      }
      if(oldformItems.value.custAbbname!==formItems.value.custAbbname){
        log+='供应商简称【'+oldformItems.value.custAbbname+','+formItems.value.custAbbname+'】,'
      }
      if(oldformItems.value.custCode!==formItems.value.custCode){
        log+='供应商编码【'+oldformItems.value.custCode+','+formItems.value.custCode+'】,'
      }
      if(oldformItems.value.uniqueCustclass!==formItems.value.uniqueCustclass){
        let old=custmerClassList.value.filter(a=>a.uniqueCustclass==oldformItems.value.uniqueCustclass)
        let news=custmerClassList.value.filter(a=>a.uniqueCustclass==formItems.value.uniqueCustclass)
        let oldClassName=old.length>0?old[0].supClassName:''
        let newClassName=news.length>0?news[0].supClassName:''
        log+='供应商分类【'+oldClassName+','+newClassName+'】,'
      }
      if(oldformItems.value.custSregcode!==formItems.value.custSregcode){
        log+='税号【'+oldformItems.value.custSregcode+','+formItems.value.custSregcode+'】,'
      }
      if(oldformItems.value.uniqueCodeCcus!==formItems.value.uniqueCodeCcus){
        let old=supplierList.value.filter(a=>a.uniqueCode==oldformItems.value.uniqueCodeCcus)
        let news=supplierList.value.filter(a=>a.uniqueCode==formItems.value.uniqueCodeCcus)
        let oldName=old.length>0?old[0].custName:''
        let newName=news.length>0?news[0].custName:''
        log+='母公司【'+oldName+','+newName+'】,'
      }
      if(oldformItems.value.uniqueCodeSupplier!==formItems.value.uniqueCodeSupplier){
        let old=custmerList.value.filter(a=>a.uniqueCode==oldformItems.value.uniqueCodeSupplier)
        let news=custmerList.value.filter(a=>a.uniqueCode==formItems.value.uniqueCodeSupplier)
        let oldName=old.length>0?old[0].custName:''
        let newName=news.length>0?news[0].custName:''
        log+='对应客户【'+oldName+','+newName+'】,'
      }
      if(oldformItems.value.manageType!==formItems.value.manageType){
        log+='管理类型【'+oldformItems.value.manageType=='1'?'外部客户':'内部客户'+','+formItems.value.manageType=='1'?'外部客户':'内部客户'+'】,'
      }
      if(oldformItems.value.countryName!==formItems.value.countryName){
        let old=countryList.value.filter(a=>a.countryId==oldformItems.value.countryName)
        let news=countryList.value.filter(a=>a.countryId==formItems.value.countryName)
        let oldName=old.length>0?old[0].namech:''
        let newName=news.length>0?news[0].namech:''
        log+='国家(地区)【'+oldName+','+newName+'】,'
      }

      if(oldformItems.value.province!==formItems.value.province){
        log+='省【'+oldformItems.value.province+','+formItems.value.province+'】,'
      }
      if(oldformItems.value.city!==formItems.value.city){
        log+='市【'+oldformItems.value.city+','+formItems.value.city+'】,'
      }
      if(oldformItems.value.area!==formItems.value.area){
        log+='区【'+oldformItems.value.area+','+formItems.value.area+'】,'
      }
      if(oldformItems.value.beiyong4!==formItems.value.beiyong4){
        log+='邮政编码【'+oldformItems.value.beiyong4+','+formItems.value.beiyong4+'】,'
      }
      if(oldformItems.value.address2!==formItems.value.address2){
        log+='详细地址【'+oldformItems.value.address2+','+formItems.value.address2+'】,'
      }
      if(oldformItems.value.website!==formItems.value.website){
        log+='官网【'+oldformItems.value.website+','+formItems.value.website+'】,'
      }
      if(oldformItems.value.contacts!==formItems.value.contacts){
        log+='联系人【'+oldformItems.value.contacts+','+formItems.value.contacts+'】,'
      }
      if(oldformItems.value.telephone!==formItems.value.telephone){
        log+='联系电话【'+oldformItems.value.telephone+','+formItems.value.telephone+'】,'
      }
      if(oldformItems.value.cellPhoneNum!==formItems.value.cellPhoneNum){
        log+='联系电话【'+oldformItems.value.cellPhoneNum+','+formItems.value.cellPhoneNum+'】,'
      }
      if(oldformItems.value.email!==formItems.value.email){
        log+='EMail【'+oldformItems.value.email+','+formItems.value.email+'】,'
      }
      if(oldformItems.value.custBank!==formItems.value.custBank){
        log+='开户银行【'+oldformItems.value.custBank+','+formItems.value.custBank+'】,'
      }
      if(oldformItems.value.bankArea!==formItems.value.bankArea){
        log+='开户地【'+oldformItems.value.bankArea+','+formItems.value.bankArea+'】,'
      }
      if(oldformItems.value.custAccount!==formItems.value.custAccount){
        log+='银行账号【'+oldformItems.value.custAccount+','+formItems.value.custAccount+'】,'
      }
      if(oldformItems.value.bankCode!==formItems.value.bankCode){
        log+='银行行号【'+oldformItems.value.bankCode+','+formItems.value.bankCode+'】,'
      }
    }

    let logtime=new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," ")
    // 埋点-操作日志
    if(formItems.value.id!==''){
      let arrlog='操作内容【修改供应商信息】,'+log.substring(0,log.length-1)
      if(log==''){
        arrlog='操作内容【供应商信息,未发生修改】,账套代码【'+accountInfo.value.coCode+'】,账套名称【'+accountInfo.value.companyName+'】,供应商编码【'+formItems.value.custCode+'】,供应商全称【'+formItems.value.custName+'】,供应商简称【'+formItems.value.custAbbname+'】'
      }else if(!defaultPage.value&&log!==''){
        // 只对集团账套审计记录-保存修改前的
        oldformItems.value.optMethod='0'
        oldformItems.value.optUsername=useUserStoreWidthOut().getUserInfo.realName
        oldformItems.value.optTime=logtime
        await useRouteApi(auditSupplierSave,{schemaName: database})(unref(oldformItems))
      }
      /************** 记录操作日志 ****************/
      let map={
        loginTime:logtime,
        userId: useUserStoreWidthOut().getUserInfo.username,
        userName: useUserStoreWidthOut().getUserInfo.realName,
        optModule:'master_data',
        optFunction:'供应商',
        optRange:'1',
        uniqueCode:database.value.substring(0,database.value.length-5),
        optAction:'修改',
        optContent:arrlog,
      }
      await saveLog(map)
      /************** 记录操作日志 ****************/
    }
    else{
      let arrlog='操作内容【新增供应商信息】,账套代码【'+accountInfo.value.coCode+'】,账套名称【'+accountInfo.value.companyName+'】,供应商编码【'+formItems.value.cusCode+'】,供应商全称【'+formItems.value.cusName+'】,供应商简称【'+formItems.value.cusAbbname+'】'
      /************** 记录操作日志 ****************/
      let map={
        loginTime:logtime,
        userId: useUserStoreWidthOut().getUserInfo.username,
        userName: useUserStoreWidthOut().getUserInfo.realName,
        optModule:'master_data',
        optFunction:'供应商',
        optRange:'1',
        uniqueCode:database.value.substring(0,database.value.length-5),
        optAction:'新增',
        optContent:arrlog,
      }
      await saveLog(map)
      /************** 记录操作日志 ****************/
    }

    saveClick.value=true
    if(closeflag=='add'){
      emit('dulisave', unref(formItems));
      saveClick.value=false
      formItems.value={}
      formItems.value.manageType='1'
      formItems.value.creditMommand='0'
      setTimeout(()=>{
        findBySup()
      },500)
      return false;
    }
    emit('dulisave', unref(formItems));
    closeModal();
    saveClick.value=false
  }

  function clearData() {
    formItems.value.address1=''
    formItems.value.address2=''
    formItems.value.applyDatabaseUniqueCode=''
    formItems.value.applyDate=''
    formItems.value.applyUser=''
    formItems.value.approveDate=''
    formItems.value.approveUser=''
    formItems.value.area=''
    formItems.value.bankArea=''
    formItems.value.bankCode=''
    formItems.value.beiyong1=''
    formItems.value.beiyong2=''
    formItems.value.beiyong3 =''
    formItems.value.beiyong4=''
    formItems.value.beiyong5=''
    formItems.value.beiyong6=''
    formItems.value.beiyong7=''
    formItems.value.beiyong8=''
    formItems.value.beiyong9=''
    formItems.value.beiyong10=''
    formItems.value.biandongMethod=''
    formItems.value.cellPhoneNum=''
    formItems.value.city=''
    formItems.value.contacts=''
    formItems.value.countryName=''
    formItems.value.custAbbname=''
    formItems.value.custAccount=''
    formItems.value.custBank=''
    formItems.value.custCode=''
    formItems.value.custDevdate=''
    formItems.value.custName=''
    formItems.value.custSregcode=''
    formItems.value.email=''
    formItems.value.flag=''
    formItems.value.id=''
    formItems.value.industryclassName=''
    formItems.value.manageType='1'
    formItems.value.province=''
    formItems.value.remarks=''
    formItems.value.successState=''
    formItems.value.telephone=''
    formItems.value.tenantId=''
    formItems.value.uniqueCode=''
    formItems.value.uniqueCodeCcus=''
    formItems.value.uniqueCodeSupplier=''
    formItems.value.uniqueCustclass=''
    formItems.value.uniqueCustclassName=''
    formItems.value.website=''
    formItems.value.isDel='0'
  }

  const closeOk = () => {
    emit('closeOk');
    closeModal();
  }
  function zoneChange(a,b) {
    zoneVal.value=a
    zoneData.value=b
  }
</script>
<style>
.ant-modal-body {
  padding: 0px;
  border-bottom: 1px solid #0096c7;
  border-left: none;
  border-right: none;
  border-top: none !important;
}
.ant-modal-header{
  border: none !important;
}
</style>
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
