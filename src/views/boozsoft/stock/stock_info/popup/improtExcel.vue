<template>
  <BasicModal
    width="600px"
    v-bind="$attrs"
    :canFullscreen="false"
    @register="register"
  >
    <Loading :loading="compState.loading" :absolute="compState.absolute" :tip="compState.tip"/>
    <template #title>
      <div
        style="height: 30px;width: 100%;background-color: #5f375c;color: white;line-height: 30px;text-align: left;">
        <AppstoreOutlined style="margin: 0 2px;font-size: 14px;"/>
        <span style="font-size: 14px">数据导入</span>
      </div>
    </template>
    <div style="width: 100%;display: table;">
      <div style="text-align: right;width: 44%;float: left;">
        <CloudUploadOutlined style="margin: 0 2px;font-size: 40px;color: #0096c7;"/>
      </div>
      <div
        style="text-align: left;width: 54%;float: right;font-size: 24px;font-weight: bold;color: #0096c7;">
        主数据导入
      </div>
    </div>
    <div style="margin-top: 40px;margin-left: 30px;text-align: left;">
      <span style="font-size: 16px;font-weight: bold;">导入内容：</span>
      <span style="font-weight: bold;font-size: 20px;margin-left: 16%;">存货档案</span>
      <p/>
      <span style="font-size: 16px;font-weight: bold;">模板样式：</span>
      <Select
        v-model:value="codeTemplateId"
        placeholder=""
        style="width: 50%;margin-right: 2%;font-size: 20px;text-align: center;"
        allow-clear>
        <SelectOption v-for="tem in templateList" :key="tem.id" :value="tem.id">
          {{ tem.tname }}
        </SelectOption>
        <template #suffixIcon>
          <CaretDownOutlined style="color:#666666;"/>
        </template>
      </Select>
      <span style="font-size: 14px;margin-left: 80px;">
        <DownloadOutlined style="font-size: 20px;"/>
        <a @click="excelTemplate(codeTemplateId)">&emsp;模板下载</a>
      </span>
    </div>
    <Tabs v-model:activeKey="tabPaneKey" style="margin-top: 40px;">
      <TabPane key="1" tab="新增导入"/>
      <TabPane key="2" tab="附加字段导入"/>
    </Tabs>

    <br/>
    <ImpExcel @success="loadDataSuccess">
      <a-button class="m-3"> 导入Excel</a-button>
    </ImpExcel>
    <template #footer>
      <div style="height: 35px">
        <div style="float: left">
          <a-popover title="使用说明" trigger="click">
            <template #content>
              <p>文件中带 * 为必填项</p>
            </template>
            <a-button>使用说明</a-button>
          </a-popover>
        </div>
        <div style="float: right">
          <a-button @click="handleClose" :disabled="uploading">放弃</a-button>
          <a-button @click="handleOk(true)" type="primary" :loading="uploading" :disabled="disabledFlag">开始导入</a-button>
        </div>
      </div>
    </template>
  </BasicModal>
</template>
<script setup="props, { content }" lang="ts">
import {
  AppstoreOutlined,
  CaretDownOutlined,
  CloudUploadOutlined,
  DownloadOutlined
} from '@ant-design/icons-vue';
import {reactive, ref, unref} from 'vue';
import {BasicModal, useModalInner} from '/@/components/Modal';
import {
  Input as AInput,
  message,
  Modal as AModal,
  Select,
  Select as ASelect,
  Tabs
} from 'ant-design-vue';
import {aoaToSheetXlsx} from '/@/components/Excel';
import {useUserStoreWidthOut} from '/@/store/modules/user';
import {useCompanyOperateStoreWidthOut} from '/@/store/modules/operate-company';
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
//import {ImpExcel} from "/@/views/boozsoft/system/project/excel/components/importexcel";
const ImpExcel=null

/******************* 弹框加载中 **************************/
import {Loading} from '/@/components/Loading';
import {
  findAll,
  multiUnitOfMea,
  multiUnitOfMeaMX,
  singleUnitOfMea
} from "/@/api/record/stock/stock";
import {useMessage} from "/@/hooks/web/useMessage";
import {hasBlank, trim} from "/@/api/task-api/tast-bus-api";
import {findAllStockClass} from "/@/api/record/stock/stock_class";
import {findAll as findSupAll} from "/@/api/record/supplier_data/supplier";
import {findAll as findCangkuAll} from "/@/api/record/stock/stock-cangku";
import {importStockColumn} from "/@/api/record/stock/stock";

const AInputSearch = AInput.Search
const ASelectOption = ASelect.Option
const SelectOption = Select.Option;
// 上传文件
const headers = ref({
  authorization: useUserStoreWidthOut().getToken,
  datasource: JSON.stringify({
    databaseName: '',
    schemaName: useCompanyOperateStoreWidthOut().getSchemaName,
  }),
});
const tabPaneKey: any = ref('1')
const codeTemplateId = ref('1');
const templateList = ref([{tname: '系统模板', id: '1'}, {tname: '系统标准模板', id: '2'}]);
const emit = defineEmits([]);
const uploading = ref(false)
const disabledFlag = ref(false)
const databaseName = ref('')
const database = ref('')

const cangkuList: any = ref([]);
const supList: any = ref([]);
const stockList: any = ref([]);
const stockClass: any = ref([]);
const danJL: any = ref([]);
const duoJL: any = ref([]);

const {createWarningModal} = useMessage()

const [register, {closeModal}] = useModalInner((data) => {
  databaseName.value = data.baseName
  database.value = data.database
  disabledFlag.value=true
  list.value=[]
  getCangkuAll()
  gerSupplierAll()
  stockAll()
  getStockClassAll()
  danjl()
  duojl()
});

async function getCangkuAll() {
  let ck=await useRouteApi(findCangkuAll, {schemaName: database})({
    flag: '1',
    uniqueCustclass: '',
    searchConditon: {
      requirement: 'ckNum',
      value: '',
    },
  })
  cangkuList.value=ck.items
}
async function gerSupplierAll() {
  let sup=await useRouteApi(findSupAll, {schemaName: database})({
    flag:'1',
    uniqueCustclass:'',
    searchConditon: {
      requirement: 'custCode',
      value: '',
    },
  })
  supList.value=sup.items
}
async function stockAll() {
  let data = await useRouteApi(findAll, {schemaName: database})({
    stockFlag:'',
    stockClass:'',
    searchConditon:{
      requirement:'stockNum',
      value:''
    }
  })
  stockList.value=data
}
async function getStockClassAll() {
  let list = await useRouteApi(findAllStockClass, {schemaName: database})({
    page: '1',
    size: '99999999',
    stockFlag: '',
    searchValue: '',
    superid: ''
  })
  stockClass.value = list.items
}
async function danjl() {
  let dan = await useRouteApi(singleUnitOfMea, {schemaName: database})('')
  danJL.value = dan
}
async function duojl() {
  let duo = await useRouteApi(multiUnitOfMea, {schemaName: database})('')
  duoJL.value = duo
}


const loadingRef = ref(false);
const compState = reactive({
  absolute: false,
  loading: false,
  tip: '处理中...',
});

function openCompFullLoading() {
  openLoading(false);
}

function openLoading(absolute: boolean) {
  compState.absolute = absolute;
  compState.loading = true;
}

/*******************END**************************/

const excelTemplate = (data) => {
  handleDownByData(data)
}
// 文件下载
const handleDownByData = async (val: any) => {
  const columns1 = ['存货编码', '存货名称', '规格型号', '存货分类名称', '计量单位名称']
  const columns2 = ['存货编码', '存货名称', '规格型号', '规格型号1', '规格型号2', '存货分类名称', '计量单位名称', '默认采购单位', '默认销售单位', '助记码',
    '条形码', '条形码1', '条形码2', '存货代码', '生产厂商', '生产地点', '品牌', '计价方式', '供应商名称', '仓库名称', '是否销售', '是否采购',
    '是否生产', '是否委托', '是否应税劳务费用', '是否批次管理', '是否序列号管理', '是否MA管理', '是否有效期管理', '有效期单位', '有效期时长']
  aoaToSheetXlsx({
    data: [],
    header: val === '1' ? columns1 : columns2,
    filename: databaseName.value + '-存货档案导入模板.xlsx',
  });
}

const handleClose = () => {
  closeModal()
}
const ModalClose = () => {
  emit('save');
  closeModal();
}
const handleOk = async () => {
  uploading.value=true
  await useRouteApi(importStockColumn, {schemaName: database})(unref(list.value))
  .then((a)=>{
    message.success('导入成功!')
    uploading.value=false
    ModalClose()
  })
};

const list: any = ref([])
async function loadDataSuccess(excelDataList) {
  list.value=[]
  console.log(excelDataList)
  disabledFlag.value=false
  const items = excelDataList[0].results
  if (items.length > 0) {
    // 新增
    if (tabPaneKey.value == '1') {
      let str = ['存货编码', '存货名称', '规格型号', '规格型号1', '规格型号2', '存货分类名称', '计量单位名称', '默认采购单位', '默认销售单位', '助记码',
        '条形码', '条形码1', '条形码2', '存货代码', '生产厂商', '生产地点', '品牌', '计价方式', '供应商名称', '仓库名称', '是否销售', '是否采购',
        '是否生产', '是否委托', '是否应税劳务费用', '是否批次管理', '是否序列号管理', '是否MA管理', '是否有效期管理', '有效期单位', '有效期时长']

      if (excelDataList[0].header.length < 5) {
        return createWarningModal({
          title: '提示',
          content: '【存货编码,存货名称,规格型号,存货分类名称,计量单位名称】必须存在，请修改后重新导入！'
        })
      } else {
        verifyColnum(excelDataList, str);
      }
      if (excelDataList[0].header[0] !== '存货编码') {
        return createWarningModal({title: '提示', content: '第一列必须【存货编码】，请修改后重新导入！'})
      }
      verifyColnum(excelDataList, str);
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const item1: any = {}

        if (hasBlank(trim(item['存货编码']))) {
          disabledFlag.value=true
          return createWarningModal({title: '提示', content: '第' + (i + 1) + '行存货编码为空，请修改后重新导入！'})
        } else {
          let stock=stockList.value.filter(a=>a.stockNum==trim(item['存货编码']))
          if(stock.length>0){
            disabledFlag.value=true
            return createWarningModal({title: '提示', content: '第' + (i + 1) + '行存货编码已存在，请修改后重新导入！'})
          }
          item1.stockNum = trim(item['存货编码'])
        }
        if (hasBlank(trim(item['存货名称']))) {
          disabledFlag.value=true
          return createWarningModal({title: '提示', content: '第' + (i + 1) + '行存货名称为空，请修改后重新导入！'})
        } else {
          let stock=stockList.value.filter(a=>a.stockName==trim(item['存货名称'])&&a.stockGgxh==trim(item['规格型号']))
          if(stock.length>0){
            disabledFlag.value=true
            return createWarningModal({title: '提示', content: '第' + (i + 1) + '行存货名称+规格型号已存在，请修改后重新导入！'})
          }
          item1.stockName = trim(item['存货名称'])
        }
        if (hasBlank(trim(item['存货分类名称']))) {
          disabledFlag.value=true
          return createWarningModal({title: '提示', content: '第' + (i + 1) + '行存货分类名称为空，请修改后重新导入！'})
        } else {
          if (stockClass.value.length == 0) {
            disabledFlag.value=true
            return createWarningModal({title: '提示', content: '存货分类档案为空，请新增后重新导入！'})
          } else {
            let list = stockClass.value.filter(a => a.stockCclassName == trim(item['存货分类名称']))
            if (list.length == 0) {
              disabledFlag.value=true
              return createWarningModal({
                title: '提示',
                content: '第' + (i + 1) + '行存货分类名称在档案中不存在，请修改后重新导入！'
              })
            }
            item1.stockClass = list[0].uniqueStockclass
          }
        }
        if (hasBlank(trim(item['计量单位名称']))) {
          disabledFlag.value=true
          return createWarningModal({title: '提示', content: '第' + (i + 1) + '行计量单位名称为空，请修改后重新导入！'})
        } else {
          let dan = danJL.value.filter(a => a.unitName == trim(item['计量单位名称']))
          if (dan.length > 0) {
            item1.stockMeasurementType = '单计量'
            item1.stockMeasurementUnit = dan[0]?.id
            item1.stockUnitName = dan[0]?.unitName
            item1.stockUnitId = dan[0]?.id
          }
          let duo = duoJL.value.filter(a => a.unitName == trim(item['计量单位名称']))
          if (duo.length > 0) {
            item1.stockMeasurementType = '多计量'
            item1.stockMeasurementUnit = duo[0]?.id

            let mx:any=await useRouteApi(multiUnitOfMeaMX, {schemaName: database})(duo[0]?.unitCode)
            if(mx.length>0){
              // 主
              let main=mx.filter(a=>a.isMain=='true')
              item1.stockUnitName=main[0].unitName
              item1.stockUnitId=main[0].id
              // 辅
              let noMain=mx.filter(a=>a.isMain=='false')
              if(noMain.length==1){
                item1.stockUnitName1=noMain[0].unitName
                item1.stockUnitId1=noMain[0].id
              }else if(noMain.length==1){
                item1.stockUnitName1=noMain[0].unitName
                item1.stockUnitId1=noMain[0].id
                item1.stockUnitName2=noMain[1].unitName
                item1.stockUnitId2=noMain[1].id
              }
            }
          }
          if (dan.length == 0 && duo.length == 0) {
            disabledFlag.value=true
            return createWarningModal({
              title: '提示',
              content: '第' + (i + 1) + '行计量单位名称在档案中不存在，请修改后重新导入！'
            })
          }
        }
        if(hasBlank(trim(item['默认采购单位']))){
          item1.stockPurchaseUnit=item1.stockUnitId
        }else{
          if(item1.stockMeasurementType=='单计量'){
            item1.stockPurchaseUnit=item1.stockUnitId
          }else{
            let duo = duoJL.value.filter(a => a.unitName == trim(item['计量单位名称']))
            if (duo.length > 0) {
              let mx:any=await useRouteApi(multiUnitOfMeaMX, {schemaName: database})(duo[0]?.unitCode)
              if(mx.length>0){
                let data=mx.filter(a=>a.unitName==trim(item['默认采购单位']))
                if(data.length>0){
                  item1.stockPurchaseUnit=data[0].id
                }else{
                  item1.stockPurchaseUnit=item1.stockUnitId
                }
              }
            }
          }
        }
        if(hasBlank(trim(item['默认销售单位']))){
          item1.stockMarketUnit=item1.stockUnitId
        }else{
          if(item1.stockMeasurementType=='单计量'){
            item1.stockMarketUnit=item1.stockUnitId
          }else{
            let duo = duoJL.value.filter(a => a.unitName == trim(item['计量单位名称']))
            if (duo.length > 0) {
              let mx:any=await useRouteApi(multiUnitOfMeaMX, {schemaName: database})(duo[0]?.unitCode)
              if(mx.length>0){
                let data=mx.filter(a=>a.unitName==trim(item['默认销售单位']))
                if(data.length>0){
                  item1.stockMarketUnit=data[0].id
                }else{
                  item1.stockMarketUnit=item1.stockUnitId
                }
              }
            }
          }
        }
        if(!hasBlank(trim(item['供应商名称']))){
          let sup=supList.value.filter(a=>a.custName==trim(item['供应商名称']))
          if(sup.length>0){ item1.stockSupplier=sup[0].uniqueCode }
        }
        if(!hasBlank(trim(item['仓库名称']))){
          let sup=cangkuList.value.filter(a=>a.ckName==trim(item['仓库名称']))
          if(sup.length>0){ item1.stockCangku=sup[0].id }
        }

        item1.stockGgxh=trim(item['规格型号'])
        item1.stockUnitGgxh1=trim(item['规格型号1'])
        item1.stockUnitGgxh2=trim(item['规格型号2'])
        item1.stockUnitGgxh2=trim(item['规格型号2'])
        item1.stockBarcode=trim(item['条形码'])
        item1.stockUnitBarcode1=trim(item['条形码1'])
        item1.stockUnitBarcode2=trim(item['条形码2'])
        item1.stockZjm=trim(item['助记码'])
        item1.stockCode=trim(item['存货代码'])
        item1.stockManufacture=trim(item['生产厂商'])
        item1.stockManufactureAddress=trim(item['生产地点'])
        item1.stockBrand=trim(item['品牌'])
        item1.stockPropertyMarket=trim(item['是否销售'])=='是'?'1':trim(item['是否销售'])=='1'?'1':'1'
        item1.stockPropertyPurchase=trim(item['是否采购'])=='是'?'1':trim(item['是否采购'])=='1'?'1':'1'
        item1.stockPropertyProduction=trim(item['是否生产'])=='是'?'1':trim(item['是否生产'])=='1'?'1':'1'
        item1.stockPropertyEntrust=trim(item['是否委托'])=='是'?'1':trim(item['是否委托'])=='1'?'1':'1'
        item1.stockPropertyYslwfy=trim(item['是否应税劳务费用'])=='是'?'1':trim(item['是否应税劳务费用'])=='1'?'1':'0'
        item1.stockPropertyMa=trim(item['是否MA管理'])=='是'?'1':trim(item['是否MA管理'])=='1'?'1':'0'
        item1.stockPropertySeriesNumber=trim(item['是否序列号管理'])=='是'?'1':trim(item['是否序列号管理'])=='1'?'1':'0'
        item1.stockPropertyBatch=trim(item['是否批次管理'])=='是'?'1':trim(item['是否批次管理'])=='1'?'1':'0'
        item1.stockIndateManage=trim(item['是否有效期管理'])=='是'?'1':trim(item['是否有效期管理'])=='1'?'1':'0'
        item1.stockIndateUnit='天'
        item1.stockIndateDuration='15'

        if(item1.stockPropertyBatch=='1'&&item1.stockIndateManage=='1'){
          if(!hasBlank(trim(item['有效期单位']))){
            switch (trim(item['有效期单位'])) {
              case '天' :
                item1.stockIndateUnit='天'
                break;
              case '月' :
                item1.stockIndateUnit='月'
                break;
              case '年' :
                item1.stockIndateUnit='年'
                break;
            }
          }
          if(!hasBlank(trim(item['有效期时长']))&&!Math.floor(trim(item['有效期时长'])) === trim(item['有效期时长'])){
            disabledFlag.value=true
            return createWarningModal({title: '提示', content: '第' + (i + 1) + '行有效期时长必须是整数，请修改后重新导入！'})
          }
        }
        item1.stockValuationType=hasBlank(trim(item['计价方式']))?'移动平均':trim(item['计价方式'])
        list.value.push(item1)
      }
    }
    // 附加
    else{
      let str = ['存货编码', '存货名称', '规格型号', '规格型号1', '规格型号2', '存货分类名称', '助记码',
        '条形码', '条形码1', '条形码2', '存货代码', '生产厂商', '生产地点', '品牌', '计价方式', '供应商名称', '仓库名称', '是否销售', '是否采购',
        '是否生产', '是否委托', '是否应税劳务费用', '是否批次管理', '是否序列号管理', '是否MA管理', '是否有效期管理', '有效期单位', '有效期时长']

      if (excelDataList[0].header[0] !== '存货编码') {
        return createWarningModal({title: '提示', content: '第一列必须【存货编码】，请修改后重新导入！'})
      }
      verifyColnum(excelDataList, str);
      for (let i = 0; i < items.length; i++) {
        let item1=stockList.value.filter(a=>a.stockNum==trim(items[i]['存货编码']))[0]
        const item = items[i]

        if (hasBlank(trim(item['存货编码']))) {
          disabledFlag.value=true
          return createWarningModal({title: '提示', content: '第' + (i + 1) + '行存货编码为空，请修改后重新导入！'})
        }
        if (!hasBlank(trim(item['存货名称']))) {
          let stock=stockList.value.filter(a=>a.stockName==trim(item['存货名称'])&&a.stockGgxh==trim(item['规格型号']))
          if(stock.length>0){
            disabledFlag.value=true
            return createWarningModal({title: '提示', content: '第' + (i + 1) + '行存货名称+规格型号已存在，请修改后重新导入！'})
          }
          item1.stockName = trim(item['存货名称'])
        }
        if (!hasBlank(trim(item['存货分类名称']))) {
          if (stockClass.value.length == 0) {
            disabledFlag.value=true
            return createWarningModal({title: '提示', content: '存货分类档案为空，请新增后重新导入！'})
          } else {
            let list = stockClass.value.filter(a => a.stockCclassName == trim(item['存货分类名称']))
            if (list.length == 0) {
              disabledFlag.value=true
              return createWarningModal({
                title: '提示',
                content: '第' + (i + 1) + '行存货分类名称在档案中不存在，请修改后重新导入！'
              })
            }
            item1.stockClass = list[0].uniqueStockclass
          }
        }
        if(!hasBlank(trim(item['供应商名称']))){
          let sup=supList.value.filter(a=>a.custName==trim(item['供应商名称']))
          if(sup.length>0){ item1.stockSupplier=sup[0].uniqueCode }
        }
        if(!hasBlank(trim(item['仓库名称']))){
          let sup=cangkuList.value.filter(a=>a.ckName==trim(item['仓库名称']))
          if(sup.length>0){ item1.stockCangku=sup[0].id }
        }

        item1.stockGgxh=trim(item['规格型号'])
        item1.stockUnitGgxh1=trim(item['规格型号1'])
        item1.stockUnitGgxh2=trim(item['规格型号2'])
        item1.stockUnitGgxh2=trim(item['规格型号2'])
        item1.stockBarcode=trim(item['条形码'])
        item1.stockUnitBarcode1=trim(item['条形码1'])
        item1.stockUnitBarcode2=trim(item['条形码2'])
        item1.stockZjm=trim(item['助记码'])
        item1.stockCode=trim(item['存货代码'])
        item1.stockManufacture=trim(item['生产厂商'])
        item1.stockManufactureAddress=trim(item['生产地点'])
        item1.stockBrand=trim(item['品牌'])
        item1.stockPropertyMarket=trim(item['是否销售'])=='是'?'1':trim(item['是否销售'])=='1'?'1':'1'
        item1.stockPropertyPurchase=trim(item['是否采购'])=='是'?'1':trim(item['是否采购'])=='1'?'1':'1'
        item1.stockPropertyProduction=trim(item['是否生产'])=='是'?'1':trim(item['是否生产'])=='1'?'1':'1'
        item1.stockPropertyEntrust=trim(item['是否委托'])=='是'?'1':trim(item['是否委托'])=='1'?'1':'1'
        item1.stockPropertyYslwfy=trim(item['是否应税劳务费用'])=='是'?'1':trim(item['是否应税劳务费用'])=='1'?'1':'0'
        item1.stockPropertyMa=trim(item['是否MA管理'])=='是'?'1':trim(item['是否MA管理'])=='1'?'1':'0'
        item1.stockPropertySeriesNumber=trim(item['是否序列号管理'])=='是'?'1':trim(item['是否序列号管理'])=='1'?'1':'0'
        item1.stockPropertyBatch=trim(item['是否批次管理'])=='是'?'1':trim(item['是否批次管理'])=='1'?'1':'0'
        item1.stockIndateManage=trim(item['是否有效期管理'])=='是'?'1':trim(item['是否有效期管理'])=='1'?'1':'0'
        item1.stockIndateUnit='天'
        item1.stockIndateDuration='15'

        if(item1.stockPropertyBatch=='1'&&item1.stockIndateManage=='1'){
          if(!hasBlank(trim(item['有效期单位']))){
            switch (trim(item['有效期单位'])) {
              case '天' :
                item1.stockIndateUnit='天'
                break;
              case '月' :
                item1.stockIndateUnit='月'
                break;
              case '年' :
                item1.stockIndateUnit='年'
                break;
            }
          }
          if(!hasBlank(trim(item['有效期时长']))&&!Math.floor(trim(item['有效期时长'])) === trim(item['有效期时长'])){
            disabledFlag.value=true
            return createWarningModal({title: '提示', content: '第' + (i + 1) + '行有效期时长必须是整数，请修改后重新导入！'})
          }
        }
        item1.stockValuationType=hasBlank(trim(item['计价方式']))?'移动平均':trim(item['计价方式'])
        list.value.push(item1)
      }
    }
  } else {
    disabledFlag.value=true
    list.value=[]
    return createWarningModal({title: '提示', content: '未发现导入数据，请检查数据是否在sheet1页签中'})
  }
}

function verifyColnum(excelDataList, str) {
  let colnumArr: any = []
  let temp: any = true
  for (let i = 0; i < str.length; i++) {
    let colnum = excelDataList[0].header.filter(a => str.indexOf(a) == -1)
    if (colnum.length > 0) {
      colnumArr.push(colnum[0])
    }
  }
  // 列名不存在
  if (Array.from(new Set(colnumArr)).length > 0) {
    createWarningModal({
      title: '提示',
      content: '【' + Array.from(new Set(colnumArr)) + '】列不存在，请修改后重新导入！'
    })
    temp = false
  }
  return temp;
}
</script>
<style lang="less" scoped>
@import '/@/assets/styles/redTitle-open.less';

:deep(.ant-select-selector) {
  border: none !important;
  border-bottom: 1px solid #bdb9b9 !important;
}

:deep(.ant-select-selection-item) {
  font-weight: bold;
}
</style>
