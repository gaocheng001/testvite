<template>
  <BasicModal
    width="800px"
    :minHeight="260"
    :height="260"
    v-bind="$attrs"
    @ok="handleOk()"
    @cancel="handleClose()"
    @register="register"
  >
    <template #title>
      <div style="height: 30px;width: 100%;background-color: #5f375c;color: white;line-height: 30px;">
        <AppstoreOutlined  style="margin: 0 2px;font-size: 14px;"/>
        <span style="font-size: 14px">存货管理</span>
      </div>
    </template>
    <div style="display: inline-flex;justify-content: space-between;width: 100%;min-height:260px;">
      <div style="height:100%;min-height:260px;">
        <div style="text-align: center;padding: 10px 0 5px;">
          <AccountBookTwoTone style="font-size: 24px;color: #0096c7;margin-top: 2px"/>
          <span style="line-height:30px;font-size: 24px;color: #0096c7;font-weight: bold;">&ensp;销售价格表</span>
        </div>
        <div class="nc-open-content" style="padding-top: 15px;max-height:260px;">
          <div class="app-container-bottom" style="max-width: 750px;">
            <span style="float: left;width: 70%;text-align: left;">&ensp;
              <span style="color: black;font-size: 15px;">存货名称: </span>
              <span style="font-size: 16px;font-weight: bold;"> {{pageParameter.stockNum}} - {{pageParameter.stockName}}</span>
            </span>
            <span style="float: right;width: 25%;text-align: right;">
              <span style="color: black;font-size: 15px;">规格型号: </span>
              <span style="font-size: 16px;font-weight: bold;"> {{pageParameter.stockGgxh}}</span>
           </span>

            <BasicTable
              ref="tableRef"
              :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
              :columns="tableColumns"
              :scroll="{ x: totalColumnWidth,y:260 }"
              :dataSource="tableData"
              :loading="loading"
              size="small"
              style="padding-top: 5px;"
              @register="registerTable"
              :showIndexColumn="true"
              @row-click="doEdit"
              :indexColumnProps="{width: 60, fixed: 'left', title: '序号'}"
              :pagination="{
                  pageSize: 3,
                  showSizeChanger: true,
                  pageSizeOptions: ['3',],
                  showTotal: (t) => `总共${t}条数据`,
              }"
            >

              <template #memberprice="{ record }">
                <template v-if="record.memberpriceEdit">
                  <a-input-number v-model:value="record.memberprice"
                                  class="memberprice"
                                  :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                  :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                                   min="0"
                                   style="width: 85%;margin: -5px 0"
                                  @keyup.enter="record.memberpriceEdit = null,dbSave(record);"/>
                  <CheckOutlined @click="record.memberpriceEdit = null,dbSave(record)"/>
                </template>
                <template v-else>
                  <div class="suspended-div" @click="record.memberpriceEdit = true;">
                      <span class="a-table-font-arial" :style="(record.memberprice < 0 )?{color: 'red'}:{}"  >{{
                          money(record.memberprice)
                        }}</span>
                  </div>
                </template>
              </template>

              <template #regularPrice="{ record }">
                <template v-if="record.regularPriceEdit">
                  <a-input-number v-model:value="record.regularPrice"  min="0"
                                  :formatter="value =>`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                  :parser="value =>`${value}`.replace(/\$\s?|(,*)/g,'')"
                                  :precision="10" style="width: 85%;margin: -5px 0"
                                  @keyup.enter="record.regularPriceEdit = null;dbSave(record);"/>
                  <CheckOutlined @click="record.regularPriceEdit = null,dbSave(record);" />
                </template>
                <template v-else>
                  <div class="suspended-div" @click="record.regularPriceEdit = true;">
                  <span class="a-table-font-arial" :style="(record.regularPrice < 0 )?{color: 'red'}:{}">{{
                      money(record.regularPrice)
                    }}</span>
                  </div>
                </template>
              </template>
              <template #minPrice="{ record }">
                <template v-if="record.minPriceEdit">
                  <a-input-number v-model:value="record.minPrice"  min="0"
                                  :formatter="value =>`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                  :parser="value =>`${value}`.replace(/\$\s?|(,*)/g,'')"
                                  :precision="10" style="width: 85%;margin: -5px 0"
                                  @keyup.enter="record.minPriceEdit = null;dbSave(record);"/>
                  <CheckOutlined @click="record.minPriceEdit = null,dbSave(record)" />
                </template>
                <template v-else>
                  <div class="suspended-div" @click="record.minPriceEdit = true;">
                  <span class="a-table-font-arial" :style="(record.minPrice < 0 )?{color: 'red'}:{}">{{
                      money(record.minPrice)
                    }}</span>
                  </div>
                </template>
              </template>

              <template #maxPrice="{ record }">
                <template v-if="record.maxPriceEdit">
                  <a-input-number v-model:value="record.maxPrice" min="0"
                                  :formatter="value =>`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                  :parser="value =>`${value}`.replace(/\$\s?|(,*)/g,'')"
                                  :precision="10" style="width: 85%;margin: -5px 0"

                                  @keyup.enter="record.maxPriceEdit = null;dbSave(record);"/>
                  <CheckOutlined @click="record.maxPriceEdit = null;dbSave(record)"/>

                </template>
                <template v-else>
                  <div class="suspended-div" @click="record.maxPriceEdit = true;">
                  <span class="a-table-font-arial" :style="(record.maxPrice < 0 )?{color: 'red'}:{}">{{
                      money(record.maxPrice)
                    }}</span>
                  </div>
                </template>
              </template>
              <template #invscost1="{ record }">
                <template v-if="record.invscost1Edit">
                  <a-input-number v-model:value="record.invscost1" min="0"
                                  :formatter="value =>`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                  :parser="value =>`${value}`.replace(/\$\s?|(,*)/g,'')"
                                  :precision="10" style="width: 85%;margin: -5px 0"

                                  @keyup.enter="record.invscost1Edit = null;dbSave(record);"/>
                  <CheckOutlined @click="record.invscost1Edit = null;dbSave(record)"/>

                </template>
                <template v-else>
                  <div class="suspended-div" @click="record.invscost1Edit = true;">
                    <span class="a-table-font-arial" :style="(record.invscost1 < 0 )?{color: 'red'}:{}">{{
                        money(record.invscost1)
                      }}</span>
                  </div>

                    </template>
              </template>
              <template #invscost2="{ record }">
                <template v-if="record.invscost2Edit">
                  <a-input-number v-model:value="record.invscost2" min="0"
                                  :formatter="value =>`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                  :parser="value =>`${value}`.replace(/\$\s?|(,*)/g,'')"
                                  :precision="10" style="width: 85%;margin: -5px 0"

                                  @keyup.enter="record.invscost2Edit = null;dbSave(record);"/>
                  <CheckOutlined @click="record.invscost2Edit = null;dbSave(record)"/>

                </template>
                <template v-else>
                  <div class="suspended-div" @click="record.invscost2Edit = true;">
                  <span class="a-table-font-arial" :style="(record.invscost2 < 0 )?{color: 'red'}:{}">{{
                      money(record.invscost2)
                    }}</span>
                  </div>

                </template>
              </template>
              <template #invscost3="{ record }">
                <template v-if="record.invscost3Edit">
                  <a-input-number v-model:value="record.invscost3" min="0"
                                  :formatter="value =>`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                  :parser="value =>`${value}`.replace(/\$\s?|(,*)/g,'')"
                                  :precision="10" style="width: 85%;margin: -5px 0"

                                  @keyup.enter="record.invscost3Edit = null;dbSave(record);"/>
                  <CheckOutlined @click="record.invscost3Edit = null;dbSave(record)"/>

                </template>
                <template v-else>
                  <div class="suspended-div" @click="record.invscost3Edit = true;">
                    <span class="a-table-font-arial" :style="(record.invscost3 < 0 )?{color: 'red'}:{}">{{
                        money(record.invscost3)
                      }}</span>
                  </div>
                </template>
              </template>
              <template #invscost4="{ record }">
                <template v-if="record.invscost4Edit">
                  <a-input-number v-model:value="record.invscost4" min="0"
                                  :formatter="value =>`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                  :parser="value =>`${value}`.replace(/\$\s?|(,*)/g,'')"
                                  :precision="10" style="width: 85%;margin: -5px 0"

                                  @keyup.enter="record.invscost4Edit = null;dbSave(record);"/>
                  <CheckOutlined @click="record.invscost4Edit = null;dbSave(record)"/>

                </template>
                <template v-else>
                  <div class="suspended-div" @click="record.invscost4Edit = true;">
                    <span class="a-table-font-arial" :style="(record.invscost4 < 0 )?{color: 'red'}:{}">{{
                        money(record.invscost4)
                      }}</span>
                  </div>

                </template>
              </template>
              <template #invscost5="{ record }">
                <template v-if="record.invscost5Edit">
                  <a-input-number v-model:value="record.invscost5" min="0"
                                  :formatter="value =>`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                  :parser="value =>`${value}`.replace(/\$\s?|(,*)/g,'')"
                                  :precision="10" style="width: 85%;margin: -5px 0"

                                  @keyup.enter="record.invscost5Edit = null;dbSave(record);"/>
                  <CheckOutlined @click="record.invscost5Edit = null;dbSave(record)"/>

                </template>
                <template v-else>
                  <div class="suspended-div" @click="record.invscost5Edit = true;">
                    <span class="a-table-font-arial" :style="(record.invscost5 < 0 )?{color: 'red'}:{}">{{
                        money(record.invscost5)
                      }}</span>
                  </div>
                </template>
              </template>
              <template #invscost6="{ record }">
                <template v-if="record.invscost6Edit">
                  <a-input-number v-model:value="record.invscost6" min="0"
                                  :formatter="value =>`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                  :parser="value =>`${value}`.replace(/\$\s?|(,*)/g,'')"
                                  :precision="10" style="width: 85%;margin: -5px 0"

                                  @keyup.enter="record.invscost6Edit = null;dbSave(record);record.roweditflg= false"/>
                  <CheckOutlined @click="record.invscost6Edit = null;record.roweditflg= false;dbSave(record)"/>

                </template>
                <template v-else>
                  <div class="suspended-div" @click="record.invscost6Edit = true;">
                   <span class="a-table-font-arial" :style="(record.invscost6 < 0 )?{color: 'red'}:{}">{{
                       money(record.invscost6)
                     }}</span>
                  </div>

                </template>
              </template>
              <template #invscost7="{ record }">
                <template v-if="record.invscost7Edit">
                  <a-input-number v-model:value="record.invscost7" min="0"
                                  :formatter="value =>`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                  :parser="value =>`${value}`.replace(/\$\s?|(,*)/g,'')"
                                  :precision="10" style="width: 85%;margin: -5px 0"

                                  @keyup.enter="record.invscost7Edit = null;dbSave(record);record.roweditflg= false"/>
                  <CheckOutlined @click="record.invscost7Edit = null;record.roweditflg= false;dbSave(record)"/>

                </template>
                <template v-else>

                  <div class="suspended-div" @click="record.invscost7Edit = true;">
                  <span class="a-table-font-arial" :style="(record.invscost7 < 0 )?{color: 'red'}:{}">{{
                      money(record.invscost7)
                    }}</span>
                  </div>

                </template>
              </template>
              <template #invscost8="{ record }">
                <template v-if="record.invscost8Edit">
                  <a-input-number v-model:value="record.invscost8" min="0"
                                  :formatter="value =>`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                  :parser="value =>`${value}`.replace(/\$\s?|(,*)/g,'')"
                                  :precision="10" style="width: 85%;margin: -5px 0"

                                  @keyup.enter="record.invscost8Edit = null;dbSave(record);record.roweditflg= false"/>
                  <CheckOutlined @click="record.invscost8Edit = null;record.roweditflg= false;dbSave(record)"/>

                </template>
                <template v-else>
                  <div class="suspended-div" @click="record.invscost8Edit = true;">
                  <span class="a-table-font-arial" :style="(record.invscost8 < 0 )?{color: 'red'}:{}">{{
                      money(record.invscost8)
                    }}</span>
                  </div>

                </template>
              </template>
              <template #newPrice="{ record }">
                <template v-if="record.newPriceEdit">
                  <a-input-number v-model:value="record.newPrice" min="0"
                                  :formatter="value =>`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                  :parser="value =>`${value}`.replace(/\$\s?|(,*)/g,'')"
                                  :precision="10" style="width: 85%;margin: -5px 0"
                                  @keyup.enter="record.newPriceEdit = null;dbSave(record);record.roweditflg= false"/>
                  <CheckOutlined @click="record.newPriceEdit = null;record.roweditflg= false;dbSave(record)"/>

                </template>
                <template v-else>
                  <div class="suspended-div" @click="record.newPriceEdit = true;">
                  <span class="a-table-font-arial" :style="(record.newPrice < 0 )?{color: 'red'}:{}">{{
                      money(record.newPrice)
                    }}</span>
                  </div>

                </template>
              </template>
            </BasicTable>

          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div>
        <Button @click="handleOk()"  type="primary">保存</Button>
        <Button @click="closeModal()">取消</Button>
      </div>
    </template>
  </BasicModal>
</template>

<script setup="props, {content}" lang="ts">
/********************************************* 公共参数 ********************************************************/
import {BasicModal, useModal, useModalInner} from '/@/components/Modal'
import {
  DatePicker as ADatePicker,
  Select as ASelect,
  Input as AInput, InputNumber as AInputNumber,
  Popover as APopover,
  Radio as ARadio,
  Pagination as APagination,
  Popconfirm as APopconfirm,
  Table as ATable,
  Checkbox as ACheckbox,
  Statistic as AStatistic, Modal as AModal,
  Drawer as ADrawer, Collapse, message, Divider, Button, Progress
} from "ant-design-vue"
import {
  CaretDownOutlined,
  AppstoreOutlined,CheckOutlined,
  LinkOutlined,AccountBookTwoTone,
  SearchOutlined
} from '@ant-design/icons-vue';
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {useUserStore, useUserStoreWidthOut} from "/@/store/modules/user";
import {useMessage} from "/@/hooks/web/useMessage";
import {nextTick, reactive, ref} from "vue";
import router from "/@/router";
import {useTabs} from "/@/hooks/web/useTabs";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {findAll, savePrice,findListByTypeAndId} from "/@/api/record/stock/stock-price";
import {columnProps} from "ant-design-vue/es/table/interface";
import {BasicTable, useTable} from '/@/components/Table';
import {getCurrentAccountName} from "/@/api/task-api/tast-bus-api";
import {findDbLanMuList} from "/@/api/record/system/accvoucher";
import {
  assemblyDynamicColumn,
  combineParameters,
  initDynamics
} from "/@/views/boozsoft/stock/stock_price/data";
const { closeCurrent } = useTabs(router);
const emit = defineEmits(['register', 'save'])
const ARangePicker = ADatePicker.RangePicker
const ASelectOption = ASelect.Option
const AInputSearch = AInput.Search
const ARadioGroup = ARadio.Group
const ARadioButton = ARadio.Button
const CollapsePanel = Collapse.Panel
const AStatisticCountdown = AStatistic.Countdown;
const userStore = useUserStore();
const busDate = useCompanyOperateStoreWidthOut().getLoginDate
const {createWarningModal} = useMessage();
const companyOperateStore = useCompanyOperateStoreWidthOut()
const openType = ref('')
const databaseTrue = ref('')
const formItems: any = ref({});

const [register, {closeModal, setModalProps}] = useModalInner(async (data) => {
  formItems.value.openOne = data.data.openOne;
  pageParameter.id = data.data.id
  console.log(data.data)
  pageParameter.stockNum = data.data.stockNum
  pageParameter.stockName = data.data.stockName
  pageParameter.stockGgxh = data.data .stockGgxh
  //初始化数据 查询计量单位
  tableData.value = []
  resetDynamicColumnData()

  if(data.data.stockMeasurementType == '多计量'){
    const a = await useRouteApi(findListByTypeAndId, {schemaName: data.accId})({
      type: data.data.stockMeasurementType,
      id:data.data.stockMeasurementUnit
    })
    //获取主计量
    const main = a.filter(v=> v.isMain == 'true')
    tableData.value.push({
      stockNum:pageParameter.stockNum,
      uname:main[0].unitName,
      memberprice:data.data.memberprice,
      regularPrice:data.data.regularPrice,
      minPrice: data.data.minPrice,
      maxPrice: data.data.maxPrice,
      invscost1:data.data.invscost1,
      invscost2:data.data.invscost2,
      invscost3:data.data.invscost3,
      invscost4:data.data.invscost4,
      invscost5:data.data.invscost5,
      invscost6:data.data.invscost6,
      invscost7:data.data.invscost7,
      invscost8:data.data.invscost8,
      newPrice: data.data.newPrice,
      isMain:'true',
    })
    const notmain = a.filter(v=> v.isMain == 'false')
    let index = 1
    notmain.forEach(v=>{
      //计算值
      tableData.value.push({
        uname:v.unitName,
        memberprice:data.data.memberprice * v.conversionRate,
        regularPrice:data.data.regularPrice * v.conversionRate,
        minPrice:data.data.minPrice * v.conversionRate,
        maxPrice:data.data.maxPrice * v.conversionRate,
        invscost1:data.data.invscost1 * v.conversionRate,
        invscost2:data.data.invscost2 * v.conversionRate,
        invscost3:data.data.invscost3 * v.conversionRate,
        invscost4:data.data.invscost4 * v.conversionRate,
        invscost5:data.data.invscost5 * v.conversionRate,
        invscost6:data.data.invscost6 * v.conversionRate,
        invscost7:data.data.invscost7 * v.conversionRate,
        invscost8:data.data.invscost8 * v.conversionRate,
        newPrice:data.data.newPrice * v.conversionRate,
        isMain:'false',
        index:index,
        conversionRate:v.conversionRate,
      })
      index = index+1
    })

  }else{
    tableData.value.push({
      uname:data.data.uname,
      stockNum:pageParameter.stockNum,
      memberprice:data.data.memberprice,
      regularPrice:data.data.regularPrice,
      minPrice: data.data.minPrice,
      maxPrice: data.data.maxPrice,
      invscost1:data.data.invscost1,
      invscost2:data.data.invscost2,
      invscost3:data.data.invscost3,
      invscost4:data.data.invscost4,
      invscost5:data.data.invscost5,
      invscost6:data.data.invscost6,
      invscost7:data.data.invscost7,
      invscost8:data.data.invscost8,
      newPrice: data.data.newPrice,
    })
  }

  setModalProps({ minHeight: 340 });
})


function handleOk() {
  let d = getDataSource()
  console.log(getDataSource())
  d[0].id = pageParameter.id
  d[0].stockNum = pageParameter.stockNum,
  console.log(pageParameter.id)
  emit('throwData', d[0]);
  closeModal();
}

async function handleClose() {
  closeModal();
  return true;
}

const pageParameter = reactive({
  cclass: '0',
  ccode:'',
  bend:'',
  databasenum: databaseTrue.value,
  queryMark: '1',
  showRulesSize: 'MIN',
  uniqueAccStandard: '',
  templateId: '',
  activeKey: '',
  reloadMark: false,
  companyCode: '',
  companyName: '',
  ifUnit: false,
})
const tableRef = ref(null)
const windowWidth = (document.documentElement.clientWidth - 70)
const windowHeight = (window.innerHeight - 300)
const totalColumnWidth = ref(0)
const loading = ref(false);
const tableDataAll = ref([]);
const tableData = ref([]);
const tableColumns = ref([
  {
    title: "主计量",
    dataIndex: "uname",
    width: 50,
    slots: {customRender: "uname"},
  },
  {
    title: "协议价",
    dataIndex: "memberprice",
    slots: {customRender: "memberprice"},
  },
  {
    title: "零售价",
    dataIndex: "regularPrice",
    slots: {customRender: "regularPrice"},
  },
  {
    title: "最低价",
    dataIndex: "minPrice",
    slots: {customRender: "minPrice"},
  },
  {
    title: "最高价",
    dataIndex: "maxPrice",
    slots: {customRender: "maxPrice"},
  },
  {
    title: "一级客户价",
    dataIndex: "invscost1",
    slots: {customRender: "invscost1"},
  },
  {
    title: "二级客户价",
    dataIndex: "invscost2",
    slots: {customRender: "invscost2"},
  },
  {
    title: "三级客户价",
    dataIndex: "invscost3",
    slots: {customRender: "invscost3"},
  },
  {
    title: "四级客户价",
    dataIndex: "invscost4",
    slots: {customRender: "invscost4"},
  },
  {
    title: "五级客户价",
    dataIndex: "invscost5",
    slots: {customRender: "invscost5"},
  },
  {
    title: "六级客户价",
    dataIndex: "invscost6",
    slots: {customRender: "invscost6"},
  },
  {
    title: "七级客户价",
    dataIndex: "invscost7",
    slots: {customRender: "invscost7"},
  },
  {
    title: "八级客户价",
    dataIndex: "invscost8",
    slots: {customRender: "invscost8"},
  },
])
const [registerTable, {
  reload,
  setColumns,
  getDataSource,
  setTableData,
  getSelectRows
}] = useTable();
//点击行显示编辑
const doEdit = (record, index) => {
  record.roweditflg = true
}
// 金额格式化
function money(val: any) {
  if (val == null) {
    return  '0.00';
  }
  val = val.toString().replace(/\$|\,\-/g, '');
  if (isNaN(val)) {
    return  '0.00';
  }
  let fs = val.indexOf('-') != -1
  const sign = val === (val = Math.abs(val));
  val = Math.floor(val * 100 + 0.50000000001);
  let cents = val % 100;
  val = Math.floor(val / 100).toString();
  if (cents < 10) {
    cents = '0' + cents;
  }
  for (let i = 0; i < Math.floor((val.length - (1 + i)) / 3); i++) {
    val =
      val.substring(0, val.length - (4 * i + 3)) + ',' + val.substring(val.length - (4 * i + 3));
  }
  return (sign ? '' : '') + (fs ? '-' : '') + val + '.' + cents;
}
type Key = columnProps['id'];

const state = reactive<{
  selectedRowKeys: Key[];
  loading: boolean;
}>({
  selectedRowKeys: [], // Check here to configure the default column
  loading: false,
});
const checkRow: any = ref([])
const onSelectChange = (selectedRowKeys, row) => {
  // console.log('selectedRowKeys changed: ', row);
  state.selectedRowKeys = selectedRowKeys;
  checkRow.value = row
};
const dbSave = async (data) => {
  data.roweditflg = false
  if(tableData.value.length > 1){
    let tableDataCope = []
    if(data.isMain=='true'){
      tableDataCope.push(data)
      tableDataCope.push({
        uname:  tableData.value[1].uname,
        memberprice:  data.memberprice * tableData.value[1].conversionRate,
        regularPrice: data.regularPrice * tableData.value[1].conversionRate,
        minPrice:  data.minPrice  * tableData.value[1].conversionRate,
        maxPrice:  data.maxPrice  * tableData.value[1].conversionRate,
        invscost1: data.invscost1 *  tableData.value[1].conversionRate,
        invscost2: data.invscost2 *  tableData.value[1].conversionRate,
        invscost3: data.invscost3 *  tableData.value[1].conversionRate,
        invscost4: data.invscost4 *  tableData.value[1].conversionRate,
        invscost5: data.invscost5 *  tableData.value[1].conversionRate,
        invscost6: data.invscost6 *  tableData.value[1].conversionRate,
        invscost7: data.invscost7 *  tableData.value[1].conversionRate,
        invscost8: data.invscost8 *  tableData.value[1].conversionRate,
        newPrice:  data.newPrice  * tableData.value[1].conversionRate,
        isMain:'false',
        index:1,
        conversionRate:tableData.value[1].conversionRate,
      })
      if(tableData.value.length>2){
        tableDataCope.push({
          uname: tableData.value[2].uname,
          memberprice:  data.memberprice * tableData.value[2].conversionRate,
          regularPrice: data.regularPrice * tableData.value[2].conversionRate,
          minPrice:  data.minPrice  * tableData.value[2].conversionRate,
          maxPrice:  data.maxPrice  * tableData.value[2].conversionRate,
          invscost1: data.invscost1 * tableData.value[2].conversionRate,
          invscost2: data.invscost2 * tableData.value[2].conversionRate,
          invscost3: data.invscost3 * tableData.value[2].conversionRate,
          invscost4: data.invscost4 * tableData.value[2].conversionRate,
          invscost5: data.invscost5 * tableData.value[2].conversionRate,
          invscost6: data.invscost6 * tableData.value[2].conversionRate,
          invscost7: data.invscost7 * tableData.value[2].conversionRate,
          invscost8: data.invscost8 * tableData.value[2].conversionRate,
          newPrice:  data.newPrice  * tableData.value[2].conversionRate,
          isMain:'false',
          index:2,
          conversionRate:tableData.value[2].conversionRate,
        })
      }
    }else{
        if(data.index==1){
            tableDataCope.push({
              uname:  tableData.value[0].uname,
              memberprice:  data.memberprice / tableData.value[1].conversionRate,
              regularPrice: data.regularPrice / tableData.value[1].conversionRate,
              minPrice:  data.minPrice / tableData.value[1].conversionRate,
              maxPrice:  data.maxPrice / tableData.value[1].conversionRate,
              invscost1: data.invscost1 / tableData.value[1].conversionRate,
              invscost2: data.invscost2 / tableData.value[1].conversionRate,
              invscost3: data.invscost3 / tableData.value[1].conversionRate,
              invscost4: data.invscost4 / tableData.value[1].conversionRate,
              invscost5: data.invscost5 / tableData.value[1].conversionRate,
              invscost6: data.invscost6 / tableData.value[1].conversionRate,
              invscost7: data.invscost7 / tableData.value[1].conversionRate,
              invscost8: data.invscost8 / tableData.value[1].conversionRate,
              newPrice:  data.newPrice  / tableData.value[1].conversionRate,
              isMain:'true',
            })
            tableDataCope.push(data)
            if(tableData.value.length>2){
              tableDataCope.push({
                uname: tableData.value[2].uname,
                memberprice:  tableDataCope[0].memberprice / tableData.value[2].conversionRate,
                regularPrice: tableDataCope[0].regularPrice / tableData.value[2].conversionRate,
                minPrice:  tableDataCope[0].minPrice  / tableData.value[2].conversionRate,
                maxPrice:  tableDataCope[0].maxPrice  / tableData.value[2].conversionRate,
                invscost1: tableDataCope[0].invscost1 / tableData.value[2].conversionRate,
                invscost2: tableDataCope[0].invscost2 / tableData.value[2].conversionRate,
                invscost3: tableDataCope[0].invscost3 / tableData.value[2].conversionRate,
                invscost4: tableDataCope[0].invscost4 / tableData.value[2].conversionRate,
                invscost5: tableDataCope[0].invscost5 / tableData.value[2].conversionRate,
                invscost6: tableDataCope[0].invscost6 / tableData.value[2].conversionRate,
                invscost7: tableDataCope[0].invscost7 / tableData.value[2].conversionRate,
                invscost8: tableDataCope[0].invscost8 / tableData.value[2].conversionRate,
                newPrice:  tableDataCope[0].newPrice  / tableData.value[2].conversionRate,
                isMain:'false',
                index:2,
                conversionRate:tableData.value[2].conversionRate,
              })
        }
      }else{
          tableDataCope.push({
            uname:  tableData.value[1].uname,
            memberprice:  data.memberprice / tableData.value[2].conversionRate,
            regularPrice: data.regularPrice / tableData.value[2].conversionRate,
            minPrice:  data.minPrice / tableData.value[2].conversionRate,
            maxPrice:  data.maxPrice / tableData.value[2].conversionRate,
            invscost1: data.invscost1 / tableData.value[2].conversionRate,
            invscost2: data.invscost2 / tableData.value[2].conversionRate,
            invscost3: data.invscost3 / tableData.value[2].conversionRate,
            invscost4: data.invscost4 / tableData.value[2].conversionRate,
            invscost5: data.invscost5 / tableData.value[2].conversionRate,
            invscost6: data.invscost6 / tableData.value[2].conversionRate,
            invscost7: data.invscost7 / tableData.value[2].conversionRate,
            invscost8: data.invscost8 / tableData.value[2].conversionRate,
            newPrice:  data.newPrice  / tableData.value[2].conversionRate,
            isMain:'true',
          })
          tableDataCope.push({
            uname: tableData.value[1].uname,
            memberprice:  tableDataCope[0].memberprice  * tableData.value[1].conversionRate,
            regularPrice: tableDataCope[0].regularPrice *  tableData.value[1].conversionRate,
            minPrice:  tableDataCope[0].minPrice  * tableData.value[1].conversionRate,
            maxPrice:  tableDataCope[0].maxPrice  * tableData.value[1].conversionRate,
            invscost1: tableDataCope[0].invscost1 * tableData.value[1].conversionRate,
            invscost2: tableDataCope[0].invscost2 * tableData.value[1].conversionRate,
            invscost3: tableDataCope[0].invscost3 * tableData.value[1].conversionRate,
            invscost4: tableDataCope[0].invscost4 * tableData.value[1].conversionRate,
            invscost5: tableDataCope[0].invscost5 * tableData.value[1].conversionRate,
            invscost6: tableDataCope[0].invscost6 * tableData.value[1].conversionRate,
            invscost7: tableDataCope[0].invscost7 * tableData.value[1].conversionRate,
            invscost8: tableDataCope[0].invscost8 * tableData.value[1].conversionRate,
            newPrice:  tableDataCope[0].newPrice  * tableData.value[1].conversionRate,
            isMain:'false',
            index:1,
            conversionRate:tableData.value[1].conversionRate,
          })
          
          tableDataCope.push(data)
      }
    }
    setTableData(tableDataCope)
  }
}
const lanMuData = {
  'accId': '',
  'menuName': '销售价格修改表',
  'type': '',
  objects: '',
  username: useUserStoreWidthOut().getUserInfo.username
}
const dynamicColumns = initDynamics().DEFAULT
const dynamicColumnData = ref([])
let dynamicColumnDataCopy = []
function resetDynamicColumnData() {
  // 栏目列
  let statiList =  initDynamics()['DATA2']
  dynamicColumnData.value = statiList
  dynamicColumnDataCopy = JSON.parse(JSON.stringify(statiList))

  // 表格列
  reloadColumns()
  // pageReload()

}
const visible = ref(false);
const menterage = ref(true)
const currencyType = ref(true)
const reloadColumns = () => {
  let newA = JSON.parse(JSON.stringify(tableColumns.value))
  newA = assemblyDynamicColumn(dynamicColumnData.value, newA)
  setColumns(newA)
  initTableWidth(newA)
}
function initTableWidth(thisCs) {
  let total = 60 + 60 // 选择列与序号列
  thisCs.forEach(item => {
    if (item.ifShow == null || item.ifShow)
      total += parseInt(item.width)
  })

  if (total > windowWidth) {
    let f = 0
    if (visible.value) f = 380
    totalColumnWidth.value = Number(windowWidth) - f
    tableRef.value.$el.style.setProperty('width', (windowWidth + 62 - f) + 'px')
  } else {
    if (visible.value && (windowWidth - 380) < total) total -= (total - (windowWidth - 380))
    totalColumnWidth.value = total
    tableRef.value.$el.style.setProperty('width', (total + 62) + 'px')
  }
}
const currentShowColumns = (type) => {
  let flag = false
  if (!menterage.value || !currencyType.value) flag = true
  if (type == 'lanmu') {
    return flag ? initDynamics()['DATA' + pageParameter.queryMark + '2'] : initDynamics()['DATA' + pageParameter.queryMark]
  } else {
    return flag ? tableColumns22.value : tableColumns2.value;
  }
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
  :deep(.ant-select-selector), :deep(.ant-input-affix-wrapper) {
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

@import "../../../../../assets/styles/global-menu-index.less";
:deep(.ant-card-body) {
  padding: 16px;
  border-left: 2px solid rgb(1, 143, 251);
  box-shadow: rgb(72 113 140) -3px 1px 7px -1px;
}
:global(.ant-modal-header) {
  padding: 10px 0 !important;
}
:global(.ant-modal-close-x){
  height: 30px !important;
  color: white;
}
.a-table-font-size-16 :deep(td),
.a-table-font-size-16 :deep(th) {
  font-size: 16px !important;
  padding: 5px 8px !important;
  border-color: #aaaaaa !important;
  font-weight: 550;
}

.a-table-font-size-12 :deep(td),
.a-table-font-size-12 :deep(th) {
  font-size: 13px !important;
  padding: 2px 8px !important;
  border-color: #aaaaaa !important;
  font-weight: 600;
}

.app-container:nth-of-type(1) {
  background-color: #f2f2f2;
  padding: 10px 5px;
  margin: 10px 10px 5px;
}

.app-container:nth-of-type(2) {
  padding: 0px;
  margin: 5px 10px;
  background: #b4c8e3 !important;
}

:deep(.ant-table-thead) th{
  text-align: center !important;
  font-weight: bold;
  //background-color: #f2f2f2 !important;
  background-color: #cccccc !important;
  border-color: #aaaaaa !important;
}

:deep(.vben-basic-table) .ant-table-wrapper {
  padding: 0px;
}

:deep(.vben-basic-table) .ant-table {
  width: 100%;
  margin: 0;
  overflow-x: hidden;
  height: calc(100% - 160px);
  min-height: 500px;
}

:deep(.vben-basic-table) .ant-pagination {
  background-color: #cccccc;
  padding-right: 20px;
  padding-top: 5px;
  padding-bottom: 5px;
}

:deep(.vben-basic-table){
  max-height: 250px;
  height: 250px;
  margin-bottom: 20px;
}

:deep(.ant-input),:deep(.ant-select),:deep(.ant-btn){
  border: 1px solid #c9c9c9;
}
:deep(.vben-basic-table) {
  .ant-table-wrapper {
    .ant-table-tbody {
      tr.ant-table-measure-row{
        visibility: collapse!important;
      }
    }
  }
}

</style>
