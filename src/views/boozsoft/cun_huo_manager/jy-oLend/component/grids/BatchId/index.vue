<template>
  <div>
    <Select
      v-model:value="props.record.tempEleven"
      show-search
      style="width: 82%;"
      :default-active-first-option="false"
      :show-arrow="false"
      :filter-option="false"
      :not-found-content="null"
      :options="props.cardListOptions"
      @change="value=>handleChange(value,'two')"
      @search="value=>handleSearch(value,'two')"
      @keyup.enter="/*chChange(record,'two'),*/focusNext(record,'cinvode')"
    />
    <SearchOutlined @click="openSelectContent"/>
    <HelloPop @register="registerHelloPopPage" @save="modalData"/>
  </div>
</template>
<script setup>
import {Select} from "ant-design-vue";
import {useModal} from "../../../../../../../components/Modal";
import StockInfiModalPop from "/@/views/boozsoft/global/popup/stockInfoModalPop.vue";
import {SearchOutlined} from '@ant-design/icons-vue';
import {inject, ref} from "vue";
import HelloPop from '../../../popup/BatchPop.vue'


const [registerHelloPopPage, {openModal: openHelloPopPage}] = useModal()
const dynamicTenantId = inject('dynamicTenantId')
const props = defineProps(['record', 'cardListOptions'])
const openSelectContent = (o, type) => {

  // thisEditObj.value = o
  // thisEditType.value = type
  openHelloPopPage(true, {
    record:getRecord(),
    database: dynamicTenantId.value,
    cwhcode: "1512709242262523904",
    code: "010106",
    year: "2022"
  })
}

function handleChange() {

}

function handleSearch() {

}

function focusNext() {

}

const visible = inject('visible')
const setGridVisible = inject('setGridVisible')
const getRecord = inject('getRecord')
const setRecord = inject('setRecord')

function modalData(e) {

  setGridVisible(false)
  console.log(getRecord())
  console.log(e[0])
  setRecord({
    cinvodeName: e[0].stockName,
    stockGgxh: e[0].stockGgxh

  })
  // const aaa = {
  //   createTime: "2022-04-21 11:21:20",
  //   id: "1515882866893000704",
  //   key: "61e0a6ccee7b40a699451488239dec1b",
  //   stockAfterSaleType: null,
  //   stockAfterSaleWeb: null,
  //   stockBarcode: "",
  //   stockBrand: null,
  //   stockCangku: "1518111481848270848",
  //   stockCangkuDuli: "0",
  //   stockCangkuLevel1Name: "测试仓库-通道-货架",
  //   stockCangkuLevel2Name: "通道3",
  //   stockCangkuLevel3Name: "货架6",
  //   stockCangkuLevel4Name: "",
  //   stockCangkuLevel5Name: null,
  //   stockCangkuLevel6Name: null,
  //   stockCangkuName: "测试仓库-通道-货架\\通道3\\货架6",
  //   stockCclassName: "测试分类2",
  //   stockClass: "6251341ae08d2a5a8d18bc0b",
  //   stockCode: null,
  //   stockCountry: "中国",
  //   stockCustomsUnit: null,
  //   stockEnterTime: "2022-04-18 10:40:13",
  //   stockFlag: "1",
  //   stockGgxh: "c+c+c",
  //   stockIndateDuration: null,
  //   stockIndateManage: "0",
  //   stockIndateUnit: null,
  //   stockIndateWarningDay: null,
  //   stockInventoryUnit: null,
  //   stockKuwei: null,
  //   stockManufacture: null,
  //   stockManufactureAddress: null,
  //   stockMarketUnit: null,
  //   stockMeasurementName: "条",
  //   stockMeasurementType: "单计量",
  //   stockMeasurementUnit: "1496853378985234432",
  //   stockName: "存货3库位6",
  //   stockNum: "010103",
  //   stockProductionUnit: null,
  //   stockPropertyBatch: "0",
  //   stockPropertyCkrk: "0",
  //   stockPropertyCkrkzj: "0",
  //   stockPropertyDanger: "0",
  //   stockPropertyEntrust: "1",
  //   stockPropertyMa: "0",
  //   stockPropertyMarket: "1",
  //   stockPropertyProduction: "1",
  //   stockPropertyPurchase: "1",
  //   stockPropertyRosh: "0",
  //   stockPropertySeriesNumber: "0",
  //   stockPropertyYslwfy: "0",
  //   stockPurchaseDept: null,
  //   stockPurchaseUnit: null,
  //   stockPurchaseUser: null,
  //   stockReportingUnit: null,
  //   stockRetailUnit: null,
  //   stockSupplier: null,
  //   stockValuationType: "移动平均",
  //   stockZjm: null,
  //   tenantId: "bjhzzkgl-003-2022",
  // }

}
</script>
