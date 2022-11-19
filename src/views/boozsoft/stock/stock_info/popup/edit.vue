<template>
  <BasicModal
    width="950px"
    :height="500"
    v-bind="$attrs"
    :closable="false"
    @ok="handleOk()"
    @cancel="closeOk()"
    @register="register"
  >
    <template #title>
      <div style="display: flex;color: #0096c7;margin-left: 10px;">
        <span style="line-height:40px;font-size: 28px;">
          <FormOutlined style="font-size: 24px;font-weight: bold" v-if="isEdit"/>
          <FileSearchOutlined style="font-size: 24px;font-weight: bold" v-else/>
        </span>
        <span style="line-height:40px;font-size: 22px;">
          &nbsp;&nbsp;存货档案
        </span>
      </div>
    </template>
    <div class="nc-open-content" style="height: 100%;" >
      <div class="open-content-down" style="text-align: center;margin-top: 30px;">
        <Tabs v-model:activeKey="activeKey" type="card">
          <TabPane key="1" tab="基本信息">
            <div class="down-tab-content" >
              <div class="acco-sideline">
                <span>基础信息</span>
                <div class="acco-sideline-content" style="margin-left: 20px;">
                  <label>存货编码：</label>
                  <Input v-model:value="formItems.stockNum" style="width: 20%;" disabled/>
                  <span class="red_span">*</span>
                  <label>存货名称：</label>
                  <Input v-model:value="formItems.stockName" style="width: 20%;" :disabled="no_edit"/>
                  <span class="red_span">*</span>
                  <label>规格型号：</label>
                  <Input v-model:value="formItems.stockGgxh" style="width: 15%;" :disabled="no_edit" @blur="resetValue('stockGgxh')"/>
                  <span class="red_span" />
                  <label>助记码：</label>
                  <Input v-model:value="formItems.stockZjm" style="width: 20%;"/>
                  <span class="red_span"/>
                  <label>存货分类：</label>
                  <Select v-model:value="formItems.stockClass" style="width: 20%;">
                    <SelectOption v-for="data in stockClassTreeData" :key="data.uniqueStockclass" :value="data.uniqueStockclass">{{ data.stockCclassName }}</SelectOption>
                    <template #suffixIcon>
                      <CaretDownOutlined style="color:#666666;"/>
                    </template>
                  </Select>
                  <span class="red_span">*</span>
                  <label>条形码：</label>
                  <Input v-model:value="formItems.stockBarcode" style="width: 15%;" @blur="resetValue('stockBarcode')"/>
                  <span class="red_span"/>
                  <label>存货代码：</label>
                  <Input v-model:value="formItems.stockCode" style="width: 20%;"/>
                  <span class="red_span"/>
                  <label>生产厂商：</label>
                  <Input v-model:value="formItems.stockManufacture" style="width: 20%;"/>
                  <span class="red_span"/>
                  <label>生产地点：</label>
                  <Input v-model:value="formItems.stockManufactureAddress" style="width: 15%;"/>
                  <span class="red_span"/>
                  <label>生产地：</label>
                  <Select v-model:value="formItems.stockCountry" style="width: 20%;">
                    <SelectOption v-for="countrys in countryList" :key="countrys.namech"
                                  :value="countrys.namech">{{ countrys.namech }}
                    </SelectOption>
                    <template #suffixIcon>
                      <CaretDownOutlined style="color:#666666;"/>
                    </template>
                  </Select>
                  <span class="red_span"/>
                  <label>品牌：</label>
                  <Input v-model:value="formItems.stockBrand" style="width: 20%;margin-left: 0px;"/>
                  <span class="red_span"/>
                  <label>计价方式：</label>
                  <Select v-model:value="formItems.stockValuationType" style="width: 15%;">
                    <SelectOption value="移动平均">移动平均</SelectOption>
                    <SelectOption value="全月平均">全月平均</SelectOption>
                    <SelectOption value="先进先出">先进先出</SelectOption>
                    <SelectOption value="个别计价">个别计价</SelectOption>
                    <template #suffixIcon>
                      <CaretDownOutlined style="color:#666666;"/>
                    </template>
                  </Select>
                  <span class="red_span"/>
                </div>
              </div>
              <div class="acco-sideline">
                <span>计量单位</span>
                <div class="acco-sideline-content" style="margin-left: -100px;">
                  <label>计量方式</label>
                  <Select v-model:value="formItems.stockMeasurementType" style="width: 20%;" @change="MeasurementCheck" disabled>
                    <SelectOption value="单计量">单计量</SelectOption>
                    <SelectOption value="多计量">多计量</SelectOption>
                    <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
                  </Select>
                  <span class="red_span"/>
                  &emsp;
                  <label>计量单位</label>
                  <Select v-model:value="formItems.stockMeasurementUnit" style="width: 20%;" disabled @change="MeasurementUnitCheck">
                    <SelectOption v-for="u in singleUnitOfMeaList" :key="u.value" :value="u.value">{{ u.title }}</SelectOption>
                    <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
                  </Select>
                  <span class="red_span"/>
                  <br>
                  <label>默认采购单位</label>
                  <Select :disabled="selectReadonly" v-model:value="formItems.stockPurchaseUnit" style="width: 20%;">
                    <SelectOption v-for="u in singleUnitOfMeaList2" :key="u.value" :value="u.value">{{ u.title }}</SelectOption>
                    <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
                  </Select>
                  <span class="red_span"/>
                  &emsp;
                  <label>默认销售单位</label>
                  <Select :disabled="selectReadonly" v-model:value="formItems.stockMarketUnit" style="width: 20%;">
                    <SelectOption v-for="u in singleUnitOfMeaList2" :key="u.value" :value="u.value">{{ u.title }}</SelectOption>
                    <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
                  </Select>
                  <span class="red_span"/>
                </div>
              </div>
              <div class="acco-sideline">
                <span>默认值</span>
                <div class="acco-sideline-content" style="margin-left: -66px;">
                  <label>默认供应商</label>
                  <Select allowClear showSearch :filterOption="filterOption" v-model:value="formItems.stockSupplier" style="width: 20%;">
                    <SelectOption v-for="sup in supplierList" :key="sup.uniqueCode" :value="sup.uniqueCode">{{ sup.custName }}</SelectOption>
                    <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
                  </Select>
                  &nbsp;
                  <a style="font-weight: bold;font-size: 18px;"><LinkOutlined @click="supModalShow" /></a>
                  <span class="red_span"/>

                  <label>默认仓库</label>
                  <Select allowClear showSearch :filterOption="filterCangkuOption" v-model:value="formItems.stockCangku" style="width: 20%;">
                    <SelectOption v-for="ck in cangkuList" :key="ck.ckName" :value="ck.id">{{ ck.ckName }}</SelectOption>
                    <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
                  </Select>
                  &nbsp;
                  <a style="font-weight: bold;font-size: 18px;"><LinkOutlined @click="stockCangKuModalShow" /></a>
                  <span class="red_span"/>

                </div>
              </div>
            </div>
          </TabPane>
          <TabPane key="2" tab="控制">
            <div class="down-tab-content" :class="isEdit=='2'?'status-look':''">
              <div class="acco-sideline">
                <span>存货属性</span>
                <div style="text-align: center;">
                  <div style="display: inline-block;margin-top: 10px;">
                    <Checkbox style="width: 150px;" v-model:checked="formItems.stockPropertyMarket" :disabled="checkboxflag">销售</Checkbox><p/>
                    <Checkbox style="width: 150px;" v-model:checked="formItems.stockPropertyYslwfy" :disabled="checkboxflag" @change="yslwfyCnange">应税劳务费用</Checkbox>
                  </div>
                  <div style="display: inline-block;">
                    <Checkbox style="width: 150px;" v-model:checked="formItems.stockPropertyPurchase" :disabled="checkboxflag">采购</Checkbox><p/>
                    <Checkbox style="width: 150px;" v-model:checked="formItems.stockPropertyBatch" :disabled="checkboxflag" @change="batchChange">批次管理</Checkbox>
                  </div>
                  <div style="display: inline-block;">
                    <Checkbox style="width: 150px;" v-model:checked="formItems.stockPropertyProduction" :disabled="checkboxflag">生产</Checkbox><p/>
                    <Checkbox style="width: 150px;" v-model:checked="formItems.stockPropertySeriesNumber" :disabled="checkboxflag">序列号管理</Checkbox>
                  </div>
                  <div style="display: inline-block;">
                    <Checkbox style="width: 150px;" v-model:checked="formItems.stockPropertyEntrust" :disabled="checkboxflag">委托</Checkbox><p/>
                    <Checkbox style="width: 150px;" v-model:checked="formItems.stockPropertyMa" :disabled="checkboxflag">MA管理</Checkbox>
                  </div>
                  <p/>
                </div>
              </div>
              <div class="acco-sideline">
                <span>有效期控制</span>
                <div class="acco-sideline-content">
                  <Checkbox style="width: 150px;display: inline-flex;" v-model:checked="formItems.stockIndateManage" :disabled="checkboxflag" @change="indateChange">有效期管理</Checkbox>
                  <label style="width: 10%;">有效期单位：</label>
                  <Select v-model:value="formItems.stockIndateUnit" :disabled="indateFlag" style="width: 12%;">
                    <SelectOption value="天">天</SelectOption>
                    <SelectOption value="月">月</SelectOption>
                    <SelectOption value="年">年</SelectOption>
                    <template #suffixIcon>
                      <CaretDownOutlined style="color:#666666;"/>
                    </template>
                  </Select>
                  <label style="width: 10%;">有效期时长：</label>
                  <InputNumber v-model:value="formItems.stockIndateDuration" min="1" :disabled="indateFlag" style="width: 12%;"/>
                  <label style="width: 10%;">预警天数：</label>
                  <InputNumber v-model:value="formItems.stockIndateWarningDay" min="1" :disabled="indateFlag" style="width: 12%;" />
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane key="3" tab="条形码">
            <div class="down-tab-content">
              <Table bordered :dataSource="singleUnitOfMeaTable" :columns="columns" :loading="loadingMsg" :pagination="false" class="a-table-font-size-12">
                <template #index="{ record }">
                  <span style="float: left">
                    {{ record.index }}
                  </span>
                </template>
                <template #stockBarcode="{ record }">
                  <span v-if="record.index==1">
                    <Input v-model:value="record.stockBarcode" style="width: 100%;" @blur="resetValue2('stockBarcode',record)"/>
                  </span>
                  <span v-else>
                    <Input v-model:value="record.stockBarcode" style="width: 100%;"/>
                  </span>
                </template>
                <template #stockGgxh="{ record }">
                  <span v-if="record.index==1">
                    <Input v-model:value="record.stockGgxh" style="width: 100%;" @blur="resetValue2('stockGgxh',record)"/>
                  </span>
                  <span v-else>
                    <Input v-model:value="record.stockGgxh" style="width: 100%;"/>
                  </span>
                </template>
              </Table>
            </div>
          </TabPane>
          <TabPane key="4" tab="销售价格表">
            <div class="down-tab-content">
              <Table bordered  :dataSource="priceTable" :columns="xscolumns" :loading="loadingMsg" :pagination="false" :scroll="{ x: 2000 }" class="a-table-font-size-12">
                <template #memberprice="{ record }">
                  <span>
                    <InputNumber v-model:value="record.memberprice" @click="record.editOne = true" @keyup.enter="priceChange(record);record.editOne = null" style="width: 85%;margin: -5px 0"/>
                    <CheckOutlined @click="record.editOne = null;priceChange(record);" v-show=" record.editOne != null"/>
                  </span>
                </template>

                <template #regularPrice="{ record }">
                  <span>
                    <InputNumber v-model:value="record.regularPrice" @click="record.editTwo = true" @keyup.enter="priceChange(record);record.editTwo = null" style="width: 85%;margin: -5px 0"/>
                    <CheckOutlined @click="record.editTwo = null;priceChange(record)" v-show=" record.editTwo != null"/>
                  </span>
                </template>

                <template #minPrice="{ record }">
                  <InputNumber v-model:value="record.minPrice" @click="record.editThree = true" @keyup.enter="priceChange(record);record.editThree = null" style="width: 85%;margin: -5px 0"/>
                  <CheckOutlined @click="record.editThree = null;priceChange(record)" v-show=" record.editThree != null"/>
                </template>

                <template #maxPrice="{ record }">
                  <InputNumber v-model:value="record.maxPrice" @click="record.editFour = true" @keyup.enter="priceChange(record);record.editFour = null" style="width: 85%;margin: -5px 0"/>
                  <CheckOutlined @click="record.editFour = null;priceChange(record)" v-show=" record.editFour != null"/>
                </template>

                <template #invscost1="{ record }">
                  <InputNumber v-model:value="record.invscost1" @click="record.editFive = true" @keyup.enter="priceChange(record);record.editFive = null" style="width: 85%;margin: -5px 0"/>
                  <CheckOutlined @click="record.editFive = null;priceChange(record)" v-show=" record.editFive != null"/>
                </template>
                <template #invscost2="{ record }">
                  <InputNumber v-model:value="record.invscost2" @click="record.editSix = true" @keyup.enter="priceChange(record);record.editSix = null" style="width: 85%;margin: -5px 0"/>
                  <CheckOutlined @click="record.editSix = null;priceChange(record)" v-show=" record.editSix != null"/>
                </template>
                <template #invscost3="{ record }">
                  <InputNumber v-model:value="record.invscost3" @click="record.editI3 = true" @keyup.enter="priceChange(record);record.editI3 = null" style="width: 85%;margin: -5px 0"/>
                  <CheckOutlined @click="record.editI3 = null;priceChange(record)" v-show=" record.editI3 != null"/>
                </template>
                <template #invscost4="{ record }">
                  <InputNumber v-model:value="record.invscost4" @click="record.editI4 = true" @keyup.enter="priceChange(record);record.editI4 = null" style="width: 85%;margin: -5px 0"/>
                  <CheckOutlined @click="record.editI4 = null;priceChange(record)" v-show=" record.editI4 != null"/>
                </template>
                <template #invscost5="{ record }">
                  <InputNumber v-model:value="record.invscost5" @click="record.editI5 = true" @keyup.enter="priceChange(record);record.editI5 = null" style="width: 85%;margin: -5px 0"/>
                  <CheckOutlined @click="record.editI5 = null;priceChange(record)" v-show=" record.editI5 != null"/>
                </template>
                <template #invscost6="{ record }">
                  <InputNumber v-model:value="record.invscost6" @click="record.editI6 = true" @keyup.enter="priceChange(record);record.editI6 = null" style="width: 85%;margin: -5px 0"/>
                  <CheckOutlined @click="record.editI6 = null;priceChange(record)" v-show=" record.editI6 != null"/>
                </template>
                <template #invscost7="{ record }">
                  <InputNumber v-model:value="record.invscost7" @click="record.editI7 = true" @keyup.enter="priceChange(record);record.editI7 = null" style="width: 85%;margin: -5px 0"/>
                  <CheckOutlined @click="record.editI7 = null;priceChange(record)" v-show=" record.editI7 != null"/>
                </template>
                <template #invscost8="{ record }">
                  <InputNumber v-model:value="record.invscost8" @click="record.editI8 = true" @keyup.enter="priceChange(record);record.editI8 = null" style="width: 85%;margin: -5px 0"/>
                  <CheckOutlined @click="record.editI8 = null;priceChange(record)" v-show=" record.editI8 != null"/>
                </template>
              </Table>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
    <SupModalPop @throwData="throwSupData" @register="registerSupModalPopPage" />
    <StockCangKuModalPop @throwData="throwStockCangKuData" @register="registerStockCangKuModalPage" />
    <template #footer>
      <div v-if="!isEdit">
        <a-button @click="closeOk()" type="primary">关闭</a-button>
      </div>
      <div v-if="isEdit">
        <a-button @click="closeOk()">取消</a-button>
        <a-button @click="handleOk()" type="primary">保存</a-button>
      </div>
    </template>
  </BasicModal>
</template>
<script setup="props, { content }" lang="ts">
import {CaretDownOutlined, FormOutlined, LinkOutlined,FileSearchOutlined,CheckOutlined} from '@ant-design/icons-vue'
import {reactive, ref, unref} from 'vue';
import {BasicModal, useModal, useModalInner} from '/@/components/Modal';
import {Button, Checkbox, DatePicker, InputNumber,Input, Radio, Select, Tabs, TreeSelect,Table} from "ant-design-vue";
import {getCurrentAccountName, hasBlank, trim} from "/@/api/task-api/tast-bus-api";
import {useMessage} from "/@/hooks/web/useMessage";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {
  countByStockUnitBarcode1NotInStockNum, countByStockUnitBarcode2NotInStockNum,
  countByStockUnitBarcode,
  findByStockIdToBalanceAndSwsAndSss,
  findByStockNameAndGgxh, findByStockNum, getMaxStockNumByCodingFlag,
  multiUnitOfMea,
  multiUnitOfMeaMX,
  singleUnitOfMea,
  stockSave, verifyStockIsData
} from "/@/api/record/stock/stock";
import {findAllStockClassBend1, GetStockClassTree} from "/@/api/record/stock/stock_class";
import {findAllCountry} from "/@/api/record/costomer_data/customer";
import {findAllByFlag} from "/@/api/record/supplier_data/supplier";
import SupModalPop from '/@/views/boozsoft/global/popup/supplier/modalPop.vue';
import StockCangKuModalPop
  from '/@/views/boozsoft/stock/stock_cangku/popup/stockCangKuModalPop.vue';
import {load} from "/@/api/record/encoding_rules/FileEncodingRules";
import {findByAll as findByAllCangku} from "/@/api/record/stock/stock-cangku";
import {savePrice, getPriceDataByStockNum, savePriceTwo} from "/@/api/record/stock/stock-price";

import {useUserStoreWidthOut} from "/@/store/modules/user";

const {createConfirm, createWarningModal } = useMessage();
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const InputSearch = Input.Search
const SelectOption = Select.Option
const TabPane = Tabs.TabPane

const emit=defineEmits(['register']);
const formItems:any = ref({})
const database = ref(getCurrentAccountName(true));
const startPeriod:any = ref('');
const iyear:any = ref('');
const projectClassCtl:any = ref('');
const arDirList:any = ref([]);
const proUnique:any = ref('');
const proName:any = ref('');
const proItem:any = ref('');
const selectReadonly:any = ref(false);
const ysIsumBenbiReadonly:any = ref(true);
const arIsumBenbiReadonly:any = ref(true);
const activeKey: any = ref('1')
const stockClassTreeData: any = ref([])
const countryList: any = ref([])
const singleUnitOfMeaList: any = ref([])
const singleUnitOfMeaList2: any = ref([])
// 条形码表格
const singleUnitOfMeaTable: any = ref([])
//销售价格表
const priceTable: any = ref([])
const unitOfMeaList: any = ref([])
const supplierList: any = ref([])
const cangkuList: any = ref([])
const oldStockNum: any = ref('')
const oldStockName: any = ref('')
const oldStockGgxh: any = ref('')
const oldStockPropertyYslwfy: any = ref('')
const oldStockPropertyBatch: any = ref('')
const oldStockIndateManage: any = ref('')
const indateFlag: any = ref(true)
const isEdit: any = ref('')
const stockCangkuName: any = ref('')
const codeReadonly: any = ref(true)
const disble: any = ref(false)
const checkboxflag: any = ref(true)
const no_edit: any = ref(false)
const pageParameter = reactive({
  showRulesSize: 'MIN',
  companyCode: '',
  companyName: '',
  ifUnit: false,
  total: 0,
  thisAdInfo: {},
  thisLeftKey: '',
  flag: '1',
  database: database.value,
  username: useUserStoreWidthOut().getUserInfo.username,
  uniqueCustclass: '',
  searchConditon: {
    requirement: 'ckNum',
    value: '',
  },
  ckIsDuli:''
});
const columns=reactive([
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',align: 'center',width:50,
    slots: { customRender: 'index' },
  },
  {
    title: '计量单位',
    dataIndex: 'unitName',
    key: 'unitName',align: 'center',width:60,
  },
  {
    title: '条形码',
    dataIndex: 'stockBarcode',
    key: 'stockBarcode',align: 'center',
    slots: { customRender: 'stockBarcode' },width:150,
  },
  {
    title: '规格型号',
    dataIndex: 'stockGgxh',
    key: 'stockGgxh',align: 'center',
    slots: { customRender: 'stockGgxh' },width:80,
  }
])

const xscolumns=reactive([
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',align: 'center',width:50,
    slots: { customRender: 'index' },
    fixed: 'left',
  },
  {
    title: '计量单位',
    dataIndex: 'unitName',
    key: 'unitName',align: 'center',width:100,
  },
  {
    title: '协议价',
    dataIndex: 'memberprice',
    key: 'memberprice',align: 'center',
    slots: { customRender: 'memberprice' },width: 150,
  },
  {
    title: '零售价',
    dataIndex: 'regularPrice',
    key: 'regularPrice',align: 'center',
    slots: { customRender: 'regularPrice' },width: 150,
  },{
    title: '最低价',
    dataIndex: 'minPrice',
    key: 'minPrice',align: 'center',
    slots: { customRender: 'minPrice' },width: 150,
  },{
    title: '最高价',
    dataIndex: 'maxPrice',
    key: 'maxPrice',align: 'center',
    slots: { customRender: 'maxPrice' },width: 150,
  },{
    title: '一级客户价',
    dataIndex: 'invscost1',
    key: 'invscost1',align: 'center',
    slots: { customRender: 'invscost1' },width: 150,
  },{
    title: '二级客户价',
    dataIndex: 'invscost2',
    key: 'invscost2',align: 'center',
    slots: { customRender: 'invscost2' },width: 150,
  },{
    title: '三级客户价',
    dataIndex: 'invscost3',
    key: 'invscost3',align: 'center',
    slots: { customRender: 'invscost3' },width: 150,
  },{
    title: '四级客户价',
    dataIndex: 'invscost4',
    key: 'invscost4',align: 'center',
    slots: { customRender: 'invscost4' },width: 150,
  },{
    title: '五级客户价',
    dataIndex: 'invscost5',
    key: 'invscost5',align: 'center',
    slots: { customRender: 'invscost5' },width: 150,
  },{
    title: '六级客户价',
    dataIndex: 'invscost6',
    key: 'invscost6',align: 'center',
    slots: { customRender: 'invscost6' },width: 150,
  },{
    title: '七级客户价',
    dataIndex: 'invscost7',
    key: 'invscost7',align: 'center',
    slots: { customRender: 'invscost7' },width: 150,
  },{
    title: '八级客户价',
    dataIndex: 'invscost8',
    key: 'invscost8',align: 'center',
    slots: { customRender: 'invscost8' },width: 150,
  },
])
const loadingMsg:any = ref(false);


const [registerSupModalPopPage, { openModal: openSupMoalPopPage }] = useModal();
const [registerStockCangKuModalPage, { openModal: openStockCangKuModalPage }] = useModal();

// 数据库模式名称
const [register, { closeModal }] = useModalInner( async (data) => {
  activeKey.value='1'
  database.value=data.database
  iyear.value=data.iyear
  isEdit.value=data.isEdit
  formItems.value=data.data

  oldStockNum.value=data.data.stockNum
  oldStockName.value=data.data.stockName
  oldStockGgxh.value=data.data.stockGgxh

  formItems.value.stockPropertyBatch = data.data.stockPropertyBatch == '1' ? true : false
  formItems.value.stockPropertyEntrust = data.data.stockPropertyEntrust == '1' ? true : false
  formItems.value.stockPropertyMa = data.data.stockPropertyMa == '1' ? true : false
  formItems.value.stockPropertyMarket = data.data.stockPropertyMarket == '1' ? true : false
  formItems.value.stockPropertyRosh = data.data.stockPropertyRosh == '1' ? true : false
  formItems.value.stockIndateManage = data.data.stockIndateManage == '1' ? true : false
  formItems.value.stockPropertyDanger = data.data.stockPropertyDanger == '1' ? true : false
  formItems.value.stockPropertyCkrkzj = data.data.stockPropertyCkrkzj == '1' ? true : false
  formItems.value.stockPropertyCkrk = data.data.stockPropertyCkrk == '1' ? true : false
  formItems.value.stockPropertyProduction = data.data.stockPropertyProduction == '1' ? true : false
  formItems.value.stockPropertyPurchase = data.data.stockPropertyPurchase == '1' ? true : false
  formItems.value.stockPropertySeriesNumber = data.data.stockPropertySeriesNumber == '1' ? true : false
  formItems.value.stockPropertyYslwfy = data.data.stockPropertyYslwfy == '1' ? true : false
  oldStockPropertyYslwfy.value=formItems.value.stockPropertyYslwfy
  oldStockPropertyBatch.value=formItems.value.stockPropertyBatch
  oldStockIndateManage.value=formItems.value.stockIndateManage

  indateFlag.value=!formItems.value.stockIndateManage

  stockClass()
  // 国家信息
  findAllCountry().then((res) => { countryList.value = res.items;});
  MeasurementCheckFirst()
  findBySupAll()
  findByBalanceCount(data.data.id)

  // 计量单位
  let unit=await useRouteApi(singleUnitOfMea, {schemaName: database})('')
  if(unit.length==0){
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '系统未发现计量单位信息，请添加计量信息后继续！',
      onOk: async () => {
        closeOk()
      },
      onCancel: () => {
        closeOk()
        return false
      }
    })
  }
  //价格表信息
  getPriceData()
  // 是否已做过单子
  let stockIsData=await verifyStockIsData(data.data.stockNum)
  no_edit.value=stockIsData>0

  let cangku=await useRouteApi(findByAllCangku,{schemaName: database})(pageParameter)
  cangkuList.value=cangku.items

  if(singleUnitOfMeaTable.value.length==2){
    singleUnitOfMeaTable.value[1].stockBarcode=data.data.stockUnitBarcode1
    singleUnitOfMeaTable.value[1].stockGgxh=data.data.stockUnitGgxh1
  }
  if(singleUnitOfMeaTable.value.length==3){
    singleUnitOfMeaTable.value[1].stockBarcode=data.data.stockUnitBarcode1
    singleUnitOfMeaTable.value[1].stockGgxh=data.data.stockUnitGgxh1

    singleUnitOfMeaTable.value[2].stockBarcode=data.data.stockUnitBarcode2
    singleUnitOfMeaTable.value[2].stockGgxh=data.data.stockUnitGgxh2
  }
});
async function MeasurementCheckFirst() {
  singleUnitOfMeaList.value = []
  singleUnitOfMeaList2.value = []
  singleUnitOfMeaTable.value = []
  unitOfMeaList.value = []
  if (formItems.value.stockMeasurementType === '单计量') {
    await useRouteApi(singleUnitOfMea, {schemaName: database})('').then((res) => {
      res.forEach(v => {
        singleUnitOfMeaList.value.push({title: v.unitName, value: v.id, code: v.unitCode})

        if(v.id==formItems.value.stockMeasurementUnit){
          singleUnitOfMeaTable.value.push({unitName:v.unitName,key:v.id,index:1,stockBarcode:formItems.value.stockBarcode,stockGgxh:formItems.value.stockGgxh})
        }
      })
      singleUnitOfMeaList2.value = singleUnitOfMeaList.value
    });
  } else if (formItems.value.stockMeasurementType === '多计量') {
    await useRouteApi(multiUnitOfMea, {schemaName: database})('').then((res) => {
      res.forEach(v => {
        singleUnitOfMeaList.value.push({title: v.unitName, value: v.id, code: v.unitCode})
      })
    });
    let temp = singleUnitOfMeaList.value.filter(v => v.value === formItems.value.stockMeasurementUnit)
    if (temp.length > 0) {
      // 查询多计量明细
      await useRouteApi(multiUnitOfMeaMX, {schemaName: database})(temp[0].code).then((res) => {
         //多计量mx
        res.forEach((v,index) => {
          singleUnitOfMeaList2.value.push({title: v.unitName, value: v.id, code: v.unitCode,isMain:v.isMain})
          singleUnitOfMeaTable.value.push({unitName:v.unitName,key:v.id,index:index+1,stockBarcode:v.isMain=='true'?formItems.value.stockBarcode:'',stockGgxh:v.isMain=='true'?formItems.value.stockGgxh:''})
          unitOfMeaList.value.push(v)
        })

        if(hasBlank(formItems.value.stockPurchaseUnit)){
          formItems.value.stockPurchaseUnit=singleUnitOfMeaList2.value[0]?.value
        }
        if(hasBlank(formItems.value.stockMarketUnit)){
          formItems.value.stockMarketUnit=singleUnitOfMeaList2.value[0]?.value
        }
      });
    }
  }
}

async function getCodingRuleNum() {
  // 读取编码规则-存货档案
  let temp=await useRouteApi(load,{schemaName: database})('4-0')
  if(temp!==undefined){
    if(temp.codeWay=='1'){
      codeReadonly.value=false
    }else{
      let temp2=await useRouteApi(getMaxStockNumByCodingFlag,{schemaName: database})(temp)
      formItems.value.stockNum=temp2
      codeReadonly.value=true
    }
  }
  else{
    codeReadonly.value=false
  }
}

async function findByBalanceCount(id) {
 let count= await useRouteApi(findByStockIdToBalanceAndSwsAndSss, {schemaName: database})(id)
  disble.value=count>0?true:false
  if(disble.value){
    indateFlag.value=true
  }
}

async function verifyNum() {
  if(oldStockNum.value!==formItems.value.stockNum){
    let num=await useRouteApi(findByStockNum, {schemaName: database})(formItems.value.stockNum)
    if(num>0){
      return createWarningModal({content: '存货编码不能重复！'});
    }
  }
}

// 存货分类
async function stockClass() {
  const aa = await useRouteApi(findAllStockClassBend1, {schemaName: database})('')
  stockClassTreeData.value = aa
}
// 计量方式触发
async function MeasurementCheck() {
  singleUnitOfMeaList.value = []
  singleUnitOfMeaList2.value = []
  singleUnitOfMeaTable.value = []
  priceTable.value = []
  formItems.value.stockInventoryUnit=''
  formItems.value.stockPurchaseUnit=''
  formItems.value.stockMarketUnit=''
  formItems.value.stockMeasurementUnit=''
  if (formItems.value.stockMeasurementType === '单计量') {
    selectReadonly.value=true
    await useRouteApi(singleUnitOfMea, {schemaName: database})('').then((res) => {
      res.forEach(v => {
        singleUnitOfMeaList.value.push({title: v.unitName, value: v.id, code: v.unitCode})
      })
      singleUnitOfMeaList2.value = singleUnitOfMeaList.value
      formItems.value.stockMeasurementUnit = singleUnitOfMeaList.value[0].value
      formItems.value.stockPurchaseUnit = singleUnitOfMeaList.value[0].value
      formItems.value.stockMarketUnit = singleUnitOfMeaList.value[0].value
    });
    // 条形码表格
    let unitName= singleUnitOfMeaList2.value.filter(a=>a.value==formItems.value.stockMeasurementUnit)[0].title
    singleUnitOfMeaTable.value.push(
      {unitName:unitName,key:formItems.value.stockMeasurementUnit,index:1,stockBarcode:formItems.value.stockBarcode,stockGgxh:formItems.value.stockGgxh}
    )
    //销售价格表
    priceTable.value.push({
      unitName:unitName,
      key:formItems.value.stockMeasurementUnit,
      index:1,
    })
  } else if (formItems.value.stockMeasurementType === '多计量') {
    selectReadonly.value=false
    await useRouteApi(multiUnitOfMea, {schemaName: database})('').then((res) => {
      res.forEach(v => {
        singleUnitOfMeaList.value.push({title: v.unitName, value: v.id, code: v.unitCode})
      })
    });
    formItems.value.stockMeasurementUnit = singleUnitOfMeaList.value[0].value
    MeasurementUnitCheck()
  }
}
// 计量单位触发-多计量
async function MeasurementUnitCheck() {
  singleUnitOfMeaTable.value=[]
  priceTable.value = []
  if (formItems.value.stockMeasurementType === '多计量') {
    singleUnitOfMeaList2.value = []
    let temp = singleUnitOfMeaList.value.filter(v => v.value === formItems.value.stockMeasurementUnit)
    if (temp.length > 0) {
      // 查询多计量明细
      await useRouteApi(multiUnitOfMeaMX, {schemaName: database})(temp[0].code).then((res) => {
        res.forEach((v,index) => {
          singleUnitOfMeaList2.value.push({title: v.unitName, value: v.id, code: v.unitCode,isMain:v.isMain})
          singleUnitOfMeaTable.value.push({unitName:v.unitName,key:v.id,index:index+1,stockBarcode:v.isMain=='true'?formItems.value.stockBarcode:'',stockGgxh:v.isMain=='true'?formItems.value.stockGgxh:''})
          priceTable.value.push({
            unitName:v.unitName,
            key:v.id,
            index:index+1,
            conversionRate:v.conversionRate,
          })
        })
      });
      formItems.value.stockPurchaseUnit = singleUnitOfMeaList2.value[0].value
      formItems.value.stockMarketUnit = singleUnitOfMeaList2.value[0].value
    }
  }
  else{
    formItems.value.stockPurchaseUnit=formItems.value.stockMeasurementUnit
    formItems.value.stockMarketUnit=formItems.value.stockMeasurementUnit

    // 条形码表格
    let unitName= singleUnitOfMeaList2.value.filter(a=>a.value==formItems.value.stockMeasurementUnit)[0].title
    singleUnitOfMeaTable.value.push(
      {unitName:unitName,key:formItems.value.stockMeasurementUnit,index:1,stockBarcode:formItems.value.stockBarcode,stockGgxh:formItems.value.stockGgxh}
    )
    //销售价格表
    priceTable.value.push({
      unitName:unitName,
      key:formItems.value.stockMeasurementUnit,
      index:1,
    })
  }
}
const filterOption = (input: string, option: any) => {
  return option.children[0].children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
const filterCangkuOption = (input: string, option: any) => {
  return option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
// 全部供应商信息
async function findBySupAll() {
  await useRouteApi(findAllByFlag, {schemaName: database})('1').then((res) => {
    supplierList.value = res.items;
  });
}
const supModalShow = () => {
  openSupMoalPopPage(true, {
    database: database.value,
    accId: database.value.substring(0,database.value.length-5),
  });
}
function throwSupData(data) {
  formItems.value.stockSupplier=data[data.length-1].uniqueCode
}
function stockCangKuModalShow() {
  openStockCangKuModalPage(true,{
    database:database.value,
  })
}
function throwStockCangKuData(data,cangkuFlag) {
  // cangkuFlag 1=独立仓库。2=级别仓库
  formItems.value.stockCangku=data[0].id
  formItems.value.stockCangkuDuli=cangkuFlag
}
async function handleOk() {
  if(hasBlank(trim(formItems.value.stockNum))){
    return createWarningModal({content: '存货编码不能为空！'});
  }else if(oldStockNum.value!==trim(formItems.value.stockNum)){
    let num=await useRouteApi(findByStockNum, {schemaName: database})(trim(formItems.value.stockNum))
    if(num>0){
      return createWarningModal({content: '存货编码与现有存货重复，请重新输入存货编码！'});
    }
  }
  if (hasBlank(trim(formItems.value.stockName))) {
    return createWarningModal({content: '存货名称不能为空！'});
  }
  if (hasBlank(trim(formItems.value.stockClass))) {
    return createWarningModal({content: '存货分类不能为空！'});
  }

  if(oldStockName.value!==trim(formItems.value.stockName) || oldStockGgxh.value!==trim(formItems.value.stockGgxh)){
    let temp = trim(formItems.value.stockName).indexOf('\\') != -1
    if (temp) { return createWarningModal({content: '存货名称不能有\\！'}); }
    let item = 0
    if (!hasBlank(trim(formItems.value.stockName))) {
      item = await useRouteApi(findByStockNameAndGgxh, {schemaName: database})({
        name: trim(formItems.value.stockName),
        ggxh: hasBlank(trim(formItems.value.stockGgxh))?'':trim(formItems.value.stockGgxh)
      })
      if (item > 0) {
        return createWarningModal({content: '存货名称和规格型号与现有存货重复，请重新输入存货名称和规格型号！'});
      }
    }
    if(!hasBlank(trim(formItems.value.stockBarcode))){
      let item = await useRouteApi(countByStockUnitBarcode, {schemaName: database})(formItems.value.stockBarcode)
      if(item>0){
        return createWarningModal({content: '存货条形码与现有存货重复，请重新输入存货条形码'});
      }
    }
    for (let i = 1; i < singleUnitOfMeaTable.value.length; i++) {
      if(i==1){
        if(!hasBlank(trim(singleUnitOfMeaTable.value[1].stockGgxh))){
          let item = await useRouteApi(findByStockNameAndGgxh, {schemaName: database})({
            name: trim(formItems.value.stockName),
            ggxh: trim(singleUnitOfMeaTable.value[1].stockGgxh),
            ggxhType: '1',
          })
          if (item > 0) { return createWarningModal({content: '存货名称和规格型号1与现有存货重复，请重新输入存货名称和规格型号！'}); }
        }
        if(!hasBlank(trim(singleUnitOfMeaTable.value[1].stockBarcode))){
          let barcode1=await useRouteApi(countByStockUnitBarcode1NotInStockNum, {schemaName: database})({stockNum:trim(formItems.value.stockNum),stockUnitBarcode1:trim(singleUnitOfMeaTable.value[1].stockBarcode)})
          if (barcode1 > 0) { return createWarningModal({content: '条形码1与现有存货重复，请重新输入！'}); }
        }
      }else{
        if(!hasBlank(trim(singleUnitOfMeaTable.value[2].stockGgxh))){
          let item = await useRouteApi(findByStockNameAndGgxh, {schemaName: database})({
            name: trim(formItems.value.stockName),
            ggxh: trim(singleUnitOfMeaTable.value[2].stockGgxh),
            ggxhType: '2',
          })
          if (item > 0) { return createWarningModal({content: '存货名称和规格型号2与现有存货重复，请重新输入存货名称和规格型号！'}); }
        }
        if(!hasBlank(trim(singleUnitOfMeaTable.value[2].stockBarcode))){
          let barcode1=await useRouteApi(countByStockUnitBarcode2NotInStockNum, {schemaName: database})({stockNum:trim(formItems.value.stockNum),stockUnitBarcode2:trim(singleUnitOfMeaTable.value[2].stockBarcode)})
          if (barcode1 > 0) { return createWarningModal({content: '条形码1与现有存货重复，请重新输入！'}); }
        }
      }
    }
  }

  if(formItems.value.stockIndateManage&&hasBlank(formItems.value.stockIndateDuration)){
    return createWarningModal({content: '有效期管理存货必须录入有效期时长，不能为空！'});
  }

  formItems.value.stockPropertyBatch = formItems.value.stockPropertyBatch ? '1' : '0'
  formItems.value.stockPropertyEntrust = formItems.value.stockPropertyEntrust ? '1' : '0'
  formItems.value.stockPropertyMa = formItems.value.stockPropertyMa ? '1' : '0'
  formItems.value.stockPropertyMarket = formItems.value.stockPropertyMarket ? '1' : '0'
  formItems.value.stockIndateManage = formItems.value.stockIndateManage ? '1' : '0'
  formItems.value.stockPropertyRosh = formItems.value.stockPropertyRosh ? '1' : '0'
  formItems.value.stockPropertyDanger = formItems.value.stockPropertyDanger ? '1' : '0'
  formItems.value.stockPropertyCkrkzj = formItems.value.stockPropertyCkrkzj ? '1' : '0'
  formItems.value.stockPropertyCkrk = formItems.value.stockPropertyCkrk ? '1' : '0'
  formItems.value.stockPropertyProduction = formItems.value.stockPropertyProduction ? '1' : '0'
  formItems.value.stockPropertyPurchase = formItems.value.stockPropertyPurchase ? '1' : '0'
  formItems.value.stockPropertySeriesNumber = formItems.value.stockPropertySeriesNumber ? '1' : '0'
  formItems.value.stockPropertyYslwfy = formItems.value.stockPropertyYslwfy ? '1' : '0'

  let stockUnitId=''
  let stockUnitName=''
  let stockUnitId1=''
  let stockUnitName1=''
  let stockUnitBarcode1=''
  let stockUnitGgxh1=''

  let stockUnitId2=''
  let stockUnitName2=''
  let stockUnitBarcode2=''
  let stockUnitGgxh2=''

  stockUnitId= singleUnitOfMeaTable.value[0].key
  stockUnitName= singleUnitOfMeaTable.value[0].unitName
  if(singleUnitOfMeaTable.value.length==2){
    stockUnitId1= singleUnitOfMeaTable.value[1].key
    stockUnitName1= singleUnitOfMeaTable.value[1].unitName
    stockUnitBarcode1= hasBlank(trim(singleUnitOfMeaTable.value[1].stockBarcode))?'':trim(singleUnitOfMeaTable.value[1].stockBarcode)
    stockUnitGgxh1= hasBlank(trim(singleUnitOfMeaTable.value[1].stockGgxh))?'':trim(singleUnitOfMeaTable.value[1].stockGgxh)
  }
  if(singleUnitOfMeaTable.value.length==3){
    stockUnitId1= singleUnitOfMeaTable.value[1].key
    stockUnitName1= singleUnitOfMeaTable.value[1].unitName
    stockUnitBarcode1= hasBlank(trim(singleUnitOfMeaTable.value[1].stockBarcode))?'':trim(singleUnitOfMeaTable.value[1].stockBarcode)
    stockUnitGgxh1= hasBlank(trim(singleUnitOfMeaTable.value[1].stockGgxh))?'':trim(singleUnitOfMeaTable.value[1].stockGgxh)

    stockUnitId2= singleUnitOfMeaTable.value[2].key
    stockUnitName2= singleUnitOfMeaTable.value[2].unitName
    stockUnitBarcode2= hasBlank(trim(singleUnitOfMeaTable.value[2].stockBarcode))?'':trim(singleUnitOfMeaTable.value[2].stockBarcode)
    stockUnitGgxh2= hasBlank(trim(singleUnitOfMeaTable.value[2].stockGgxh))?'':trim(singleUnitOfMeaTable.value[2].stockGgxh)
  }
  formItems.value.stockUnitId=stockUnitId
  formItems.value.stockUnitName=stockUnitName

  formItems.value.stockUnitId1=stockUnitId1
  formItems.value.stockUnitName1=stockUnitName1
  formItems.value.stockUnitBarcode1=stockUnitBarcode1
  formItems.value.stockUnitGgxh1=stockUnitGgxh1

  formItems.value.stockUnitId2=stockUnitId2
  formItems.value.stockUnitName2=stockUnitName2
  formItems.value.stockUnitBarcode2=stockUnitBarcode2
  formItems.value.stockUnitGgxh2=stockUnitGgxh2

  //价格表添加
  priceTable.value
  if(priceTable.value.length>0){
    priceTable.value[0].stockNum = formItems.value.stockNum
    await useRouteApi(savePriceTwo, {schemaName: database})(priceTable.value[0]);
  }

  await useRouteApi(stockSave, {schemaName: database})(unref(formItems));
  formItems.value={}
  emit('save', '');
  closeModal();
}
const closeOk = () => {
  formItems.value={}
  emit('closeOk');
  closeModal();
}
function indateChange(val) {
  if(no_edit.value){
    formItems.value.stockIndateManage=oldStockIndateManage.value
    return
  }
  indateFlag.value=!val.target.checked
  formItems.value.stockIndateUnit=!val.target.checked?'':'天'
  formItems.value.stockIndateDuration=''
  formItems.value.stockIndateWarningDay=''
}
function batchChange(val) {
  if(no_edit.value){
    createWarningModal({content: '已做过单据,不能修改！'});
    formItems.value.stockPropertyBatch=oldStockPropertyBatch.value
    return
  }
  if(!val.target.checked){
    formItems.value.stockIndateManage=false
    indateChange(val)
  }
}
function yslwfyCnange(val) {
  if(no_edit.value){
    formItems.value.stockPropertyYslwfy=oldStockPropertyYslwfy.value
    return
  }
  if(val.target.checked){
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '其他存货属性将取消勾选,确定勾选吗?',
      onOk: async () => {
        formItems.value.stockPropertyMarket=false
        formItems.value.stockPropertyPurchase=false
        formItems.value.stockPropertyBatch=false
        formItems.value.stockPropertyProduction=false
        formItems.value.stockPropertySeriesNumber=false
        formItems.value.stockPropertyEntrust=false
        formItems.value.stockPropertyMa=false
        formItems.value.stockPropertyBatch=false
        formItems.value.stockIndateManage=false
        formItems.value.stockIndateUnit=''
        formItems.value.stockIndateDuration=''
        checkboxflag.value=true
      },onCancel: () => {
        formItems.value.stockPropertyYslwfy=false
      }
    });
  }else{
    checkboxflag.value=false
    formItems.value.stockPropertyMarket=true
    formItems.value.stockPropertyPurchase=true
    formItems.value.stockPropertyEntrust=true
    formItems.value.stockPropertyProduction=true
  }
}
async function getPriceData() {
  await useRouteApi(getPriceDataByStockNum, {schemaName: database})(oldStockNum.value).then((res) => {
    if (formItems.value.stockMeasurementType === '单计量') {
      res.unitName = singleUnitOfMeaTable.value[0].unitName
      priceTable.value = []
      priceTable.value.push(res)
    }else{
      priceTable.value = []
      //遍历计量 添加
      res.index = 1
      res.unitName = unitOfMeaList.value[0]?.unitName
      priceTable.value.push(res)

      priceTable.value.push({
        unitName:  unitOfMeaList.value[1]?.unitName,
        memberprice:  res.memberprice  * unitOfMeaList.value[1]?.conversionRate,
        regularPrice: res.regularPrice * unitOfMeaList.value[1]?.conversionRate,
        minPrice:  res.minPrice  * unitOfMeaList.value[1]?.conversionRate,
        maxPrice:  res.maxPrice  * unitOfMeaList.value[1]?.conversionRate,
        invscost1: res.invscost1 * unitOfMeaList.value[1]?.conversionRate,
        invscost2: res.invscost2 * unitOfMeaList.value[1]?.conversionRate,
        invscost3: res.invscost3 * unitOfMeaList.value[1]?.conversionRate,
        invscost4: res.invscost4 * unitOfMeaList.value[1]?.conversionRate,
        invscost5: res.invscost5 * unitOfMeaList.value[1]?.conversionRate,
        invscost6: res.invscost6 * unitOfMeaList.value[1]?.conversionRate,
        invscost7: res.invscost7 * unitOfMeaList.value[1]?.conversionRate,
        invscost8: res.invscost8 * unitOfMeaList.value[1]?.conversionRate,
        newPrice:  res.newPrice  * unitOfMeaList.value[1]?.conversionRate,
        index:2,
        conversionRate:unitOfMeaList.value[1]?.conversionRate,
      })
      if(unitOfMeaList.value.length > 2){
        priceTable.value.push({
          unitName:  unitOfMeaList.value[2]?.unitName,
          memberprice:  res.memberprice  * unitOfMeaList.value[2]?.conversionRate,
          regularPrice: res.regularPrice * unitOfMeaList.value[2]?.conversionRate,
          minPrice:  res.minPrice  * unitOfMeaList.value[2]?.conversionRate,
          maxPrice:  res.maxPrice  * unitOfMeaList.value[2]?.conversionRate,
          invscost1: res.invscost1 * unitOfMeaList.value[2]?.conversionRate,
          invscost2: res.invscost2 * unitOfMeaList.value[2]?.conversionRate,
          invscost3: res.invscost3 * unitOfMeaList.value[2]?.conversionRate,
          invscost4: res.invscost4 * unitOfMeaList.value[2]?.conversionRate,
          invscost5: res.invscost5 * unitOfMeaList.value[2]?.conversionRate,
          invscost6: res.invscost6 * unitOfMeaList.value[2]?.conversionRate,
          invscost7: res.invscost7 * unitOfMeaList.value[2]?.conversionRate,
          invscost8: res.invscost8 * unitOfMeaList.value[2]?.conversionRate,
          newPrice:  res.newPrice  * unitOfMeaList.value[2]?.conversionRate,
          index:3,
          conversionRate:unitOfMeaList.value[2]?.conversionRate,
        })
      }
    }
  });

}
function priceChange(data) {
  if (formItems.value.stockMeasurementType === '多计量') {
    //计算
    let priceTableCope = JSON.parse(JSON.stringify(priceTable.value))
    if(data.index == '1'){
      priceTable.value  = []
      priceTable.value.push(data)
      priceTable.value.push({
        unitName:  priceTableCope[1]?.unitName,
        memberprice:  (data.memberprice  * priceTableCope[1]?.conversionRate).toFixed(10),
        regularPrice: (data.regularPrice * priceTableCope[1]?.conversionRate).toFixed(10),
        minPrice:  (data.minPrice  * priceTableCope[1]?.conversionRate).toFixed(10),
        maxPrice:  (data.maxPrice  * priceTableCope[1]?.conversionRate).toFixed(10),
        invscost1: (data.invscost1 * priceTableCope[1]?.conversionRate).toFixed(10),
        invscost2: (data.invscost2 * priceTableCope[1]?.conversionRate).toFixed(10),
        invscost3: (data.invscost3 * priceTableCope[1]?.conversionRate).toFixed(10),
        invscost4: (data.invscost4 * priceTableCope[1]?.conversionRate).toFixed(10),
        invscost5: (data.invscost5 * priceTableCope[1]?.conversionRate).toFixed(10),
        invscost6: (data.invscost6 * priceTableCope[1]?.conversionRate).toFixed(10),
        invscost7: (data.invscost7 * priceTableCope[1]?.conversionRate).toFixed(10),
        invscost8: (data.invscost8 * priceTableCope[1]?.conversionRate).toFixed(10),
        newPrice:  (data.newPrice  * priceTableCope[1]?.conversionRate).toFixed(10),
        index:2,
        conversionRate:priceTableCope[1].conversionRate,
      })
      if(priceTableCope.length>2){
        priceTable.value.push({
          unitName: priceTableCope[2]?.unitName,
          memberprice:  (data.memberprice  * priceTableCope[2]?.conversionRate).toFixed(10),
          regularPrice: (data.regularPrice *  priceTableCope[2]?.conversionRate).toFixed(10),
          minPrice:  (data.minPrice  * priceTableCope[2]?.conversionRate).toFixed(10),
          maxPrice:  (data.maxPrice  * priceTableCope[2]?.conversionRate).toFixed(10),
          invscost1: (data.invscost1 * priceTableCope[2]?.conversionRate).toFixed(10),
          invscost2: (data.invscost2 * priceTableCope[2]?.conversionRate).toFixed(10),
          invscost3: (data.invscost3 * priceTableCope[2]?.conversionRate).toFixed(10),
          invscost4: (data.invscost4 * priceTableCope[2]?.conversionRate).toFixed(10),
          invscost5: (data.invscost5 * priceTableCope[2]?.conversionRate).toFixed(10),
          invscost6: (data.invscost6 * priceTableCope[2]?.conversionRate).toFixed(10),
          invscost7: (data.invscost7 * priceTableCope[2]?.conversionRate).toFixed(10),
          invscost8: (data.invscost8 * priceTableCope[2]?.conversionRate).toFixed(10),
          newPrice:  (data.newPrice  * priceTableCope[2]?.conversionRate).toFixed(10),
          index:3,
          conversionRate:priceTableCope[2]?.conversionRate,
        })
      }
    }else if(data.index == '2'){
      priceTable.value  = []
      priceTable.value.push({
        unitName:  priceTableCope[0]?.unitName,
        memberprice:  (data.memberprice  / priceTableCope[1]?.conversionRate).toFixed(10),
        regularPrice: (data.regularPrice / priceTableCope[1]?.conversionRate).toFixed(10),
        minPrice:  (data.minPrice  / priceTableCope[1]?.conversionRate).toFixed(10),
        maxPrice:  (data.maxPrice  / priceTableCope[1]?.conversionRate).toFixed(10),
        invscost1: (data.invscost1 / priceTableCope[1]?.conversionRate).toFixed(10),
        invscost2: (data.invscost2 / priceTableCope[1]?.conversionRate).toFixed(10),
        invscost3: (data.invscost3 / priceTableCope[1]?.conversionRate).toFixed(10),
        invscost4: (data.invscost4 / priceTableCope[1]?.conversionRate).toFixed(10),
        invscost5: (data.invscost5 / priceTableCope[1]?.conversionRate).toFixed(10),
        invscost6: (data.invscost6 / priceTableCope[1]?.conversionRate).toFixed(10),
        invscost7: (data.invscost7 / priceTableCope[1]?.conversionRate).toFixed(10),
        invscost8: (data.invscost8 / priceTableCope[1]?.conversionRate).toFixed(10),
        newPrice:  (data.newPrice  / priceTableCope[1]?.conversionRate).toFixed(10),
        index:1,
      })
      priceTable.value.push(data)
      if(priceTableCope.length>2){
        priceTable.value.push({
          unitName: priceTableCope[2]?.unitName,
          memberprice:  (priceTable.value[0]?.memberprice  * priceTableCope[2]?.conversionRate).toFixed(10),
          regularPrice: (priceTable.value[0]?.regularPrice *  priceTableCope[2]?.conversionRate).toFixed(10),
          minPrice:  (priceTable.value[0]?.minPrice  * priceTableCope[2]?.conversionRate).toFixed(10),
          maxPrice:  (priceTable.value[0]?.maxPrice  * priceTableCope[2]?.conversionRate).toFixed(10),
          invscost1: (priceTable.value[0]?.invscost1 * priceTableCope[2]?.conversionRate).toFixed(10),
          invscost2: (priceTable.value[0]?.invscost2 * priceTableCope[2]?.conversionRate).toFixed(10),
          invscost3: (priceTable.value[0]?.invscost3 * priceTableCope[2]?.conversionRate).toFixed(10),
          invscost4: (priceTable.value[0]?.invscost4 * priceTableCope[2]?.conversionRate).toFixed(10),
          invscost5: (priceTable.value[0]?.invscost5 * priceTableCope[2]?.conversionRate).toFixed(10),
          invscost6: (priceTable.value[0]?.invscost6 * priceTableCope[2]?.conversionRate).toFixed(10),
          invscost7: (priceTable.value[0]?.invscost7 * priceTableCope[2]?.conversionRate).toFixed(10),
          invscost8: (priceTable.value[0]?.invscost8 * priceTableCope[2]?.conversionRate).toFixed(10),
          newPrice:  (priceTable.value[0]?.newPrice  * priceTableCope[2]?.conversionRate).toFixed(10),
          index:3,
          conversionRate:priceTableCope[2]?.conversionRate,
        })
      }
    }else{
      priceTable.value  = []
      priceTable.value.push({
        unitName:  priceTableCope[0]?.unitName,
        memberprice:  (data.memberprice  /  priceTableCope[2]?.conversionRate).toFixed(10),
        regularPrice: (data.regularPrice / priceTableCope[2]?.conversionRate).toFixed(10),
        minPrice:  (data.minPrice  / priceTableCope[2]?.conversionRate).toFixed(10),
        maxPrice:  (data.maxPrice  / priceTableCope[2]?.conversionRate).toFixed(10),
        invscost1: (data.invscost1 / priceTableCope[2]?.conversionRate).toFixed(10),
        invscost2: (data.invscost2 / priceTableCope[2]?.conversionRate).toFixed(10),
        invscost3: (data.invscost3 / priceTableCope[2]?.conversionRate).toFixed(10),
        invscost4: (data.invscost4 / priceTableCope[2]?.conversionRate).toFixed(10),
        invscost5: (data.invscost5 / priceTableCope[2]?.conversionRate).toFixed(10),
        invscost6: (data.invscost6 / priceTableCope[2]?.conversionRate).toFixed(10),
        invscost7: (data.invscost7 / priceTableCope[2]?.conversionRate).toFixed(10),
        invscost8: (data.invscost8 / priceTableCope[2]?.conversionRate).toFixed(10),
        newPrice:  (data.newPrice  / priceTableCope[2]?.conversionRate).toFixed(10),
        index:1,
      })
      priceTable.value.push({
        unitName:  priceTableCope[1]?.unitName,
        memberprice:  (priceTable.value[0]?.memberprice  * priceTableCope[1]?.conversionRate).toFixed(10),
        regularPrice: (priceTable.value[0]?.regularPrice * priceTableCope[1]?.conversionRate).toFixed(10),
        minPrice:  (priceTable.value[0]?.minPrice  * priceTableCope[1]?.conversionRate).toFixed(10),
        maxPrice:  (priceTable.value[0]?.maxPrice  * priceTableCope[1]?.conversionRate).toFixed(10),
        invscost1: (priceTable.value[0]?.invscost1 * priceTableCope[1]?.conversionRate).toFixed(10),
        invscost2: (priceTable.value[0]?.invscost2 * priceTableCope[1]?.conversionRate).toFixed(10),
        invscost3: (priceTable.value[0]?.invscost3 * priceTableCope[1]?.conversionRate).toFixed(10),
        invscost4: (priceTable.value[0]?.invscost4 * priceTableCope[1]?.conversionRate).toFixed(10),
        invscost5: (priceTable.value[0]?.invscost5 * priceTableCope[1]?.conversionRate).toFixed(10),
        invscost6: (priceTable.value[0]?.invscost6 * priceTableCope[1]?.conversionRate).toFixed(10),
        invscost7: (priceTable.value[0]?.invscost7 * priceTableCope[1]?.conversionRate).toFixed(10),
        invscost8: (priceTable.value[0]?.invscost8 * priceTableCope[1]?.conversionRate).toFixed(10),
        newPrice:  (priceTable.value[0]?.newPrice  * priceTableCope[1]?.conversionRate).toFixed(10),
        index:2,
        conversionRate:priceTableCope[1].conversionRate,
      })
      priceTable.value.push(data)
    }
  }
}

function resetValue(type) {
  if(type=='stockGgxh'&&!hasBlank(trim(formItems.value.stockGgxh))){
    singleUnitOfMeaTable.value[0].stockGgxh=trim(formItems.value.stockGgxh)
  }else if(type=='stockBarcode'&&!hasBlank(trim(formItems.value.stockBarcode))){
    singleUnitOfMeaTable.value[0].stockBarcode=trim(formItems.value.stockBarcode)
  }
}
function resetValue2(type,r) {
  if(type=='stockGgxh'&&!hasBlank(trim(r.stockGgxh))){
    formItems.value.stockGgxh=trim(r.stockGgxh)
  }else if(type=='stockBarcode'&&!hasBlank(trim(r.stockBarcode))){
    formItems.value.stockBarcode=trim(r.stockBarcode)
  }
}
</script>
<style src="../global-menu-index.less" scoped lang="less"></style>
<style scoped lang="less">
:deep(.ant-checkbox-wrapper) {
  span {
    margin-left: 10%;
  }
}

.app-container {
  background-color: #f2f2f2;
  padding: 10px 5px;
  margin: 10px 10px 5px;

  .acb-head {
    .acbgead-one {
      text-align: center;
      height: 60px;
      line-height: 60px;
      margin-top: -10px;
      margin-left: -5px;

      .acbgead-one-triangle {
        > div:nth-of-type(1) {
          width: 0px;
          height: 0px;
          border-top: 60px solid #5141d7;
          border-right: 70px solid transparent;
          position: absolute;
        }

        > div:nth-of-type(2) {
          width: max-content;
          color: #fff;
          transform: rotate(-45deg) translateY(-2px) translateX(10px);
          position: absolute;
        }
      }
    }
  }
}

.status-look {
  pointer-events: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

:deep(.ant-calendar-picker-input.ant-input), :deep(.ant-input) {
  border: none;
  border-bottom: solid 1px rgb(191, 191, 191) !important;
  width: 100%;
  font-size: 14px;
  font-weight: bold;
}

:deep(.ant-input-number) {
  border: none;
  border-bottom: solid 1px rgb(191, 191, 191) !important;
  width: 100%;
  input {
    font-size: 14px;
    font-weight: bold;
    font-family: Arial !important;
  }
}

:deep(.right) input {
  text-align: right;
}

:deep(.ant-picker) {
  border: none;
  border-bottom: solid 1px rgb(191, 191, 191) !important;

  input {
    font-size: 14px;
    font-weight: bold;
  }
}

:deep(.ant-input-affix-wrapper) {
  border: none;
  border-bottom: solid 1px rgb(191, 191, 191) !important;
  width: 100%;
  font-size: 14px;
  font-weight: bold;

  .ant-input {
    border: none !important;
  }
}

.red_span {
  color: red;
  font-weight: bold;
  display: inline-block;
  width: 20px;
  text-align: right;
}

:deep(.open-content-down) {
  margin-top: 5%;
  background-color: #ffffff;

  .ant-tabs-tab {
    font-weight: bold !important;
    font-size: 13px !important;
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
    pointer-events: none;
    background-color: rgb(1, 143, 251);
    font-weight: bold;
    font-size: 13px;
  }

  .acco-sideline {
    position: relative;
    border: 1px #acabab solid;
    width: 98%;
    margin: 10px 1% 20px;

    > span {
      position: absolute;
      top: -12px;
      left: 50px;
      background: white;
      padding: 0 15px;
      font-size: 14px;
      font-weight: bold;
    }

    .ant-checkbox-inner, .ant-radio-inner {
      border-color: #4c4c4c !important;
    }

    .acco-sideline-content {
      margin: 20px;

      label {
        text-align: left;
        width: 9%;
        display: inline-block;
        padding-top: 5px;
        padding-bottom: 5px;
        //padding-left: 2em;
        color: #535353;
        font-size: 13px;
        font-weight: bold;
        margin-left: 3%;
      }

      > div {
        width: 45%;
        display: inline-block;

        .ant-select-selector {
          border: none;
          border-bottom: 1px rgb(191, 191, 191) solid;
          font-size: 14px;
          font-weight: bold;
        }

        .ant-select-disabled .ant-select-selector {
          background: white;
          color: black;
          font-size: 14px;
          font-weight: bold;
        }

        .against-input-mark {
          border: none;
          border-bottom: 1px slategrey solid;
          background-color: white;
          color: black;
          font-size: 14px;
          font-weight: bold;
        }
      }
    }
  }
}
.a-table-font-size-12 :deep(td),
.a-table-font-size-12 :deep(th) {
  font-size: 14px !important;
  padding: 4px 8px !important;
  border-color: #aaaaaa !important;
}
:deep(.ant-table-thead th) {
  background-color: #d8d8d8 !important;
  font-weight: bold !important;
  border-left: 1px solid #d8d8d8 !important;
  border-bottom: 1px solid #d8d8d8 !important;
  border-top: 1px solid #d8d8d8 !important;
}
</style>
