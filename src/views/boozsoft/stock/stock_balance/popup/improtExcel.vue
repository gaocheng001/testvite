<template>
  <BasicModal
    width="600px"
    v-bind="$attrs"
    :canFullscreen="false"
    @register="register"
  >
    <Loading :loading="compState.loading" :absolute="compState.absolute" :tip="compState.tip" />
    <template #title>
      <div style="height: 30px;width: 100%;background-color: #5f375c;color: white;line-height: 30px;">
        <AppstoreOutlined  style="margin: 0 2px;font-size: 14px;"/>
        <span style="font-size: 14px">数据导入</span>
      </div>
    </template>
    <div style="width: 100%;display: table;">
      <div  style="text-align: right;width: 50%;float: left;">
        <CloudUploadOutlined style="margin: 0 2px;font-size: 40px;color: #0096c7;"/>
      </div>
      <div  style="text-align: left;width: 47%;float: right;font-size: 24px;font-weight: bold;color: #0096c7;">
        单据导入
      </div>
    </div>
    <div style="margin-top: 40px;margin-left: 30px;">
      <span style="font-size: 20px;">导入内容：</span><span style="font-weight: bold;font-size: 20px;">库存期初余额</span>
      <p/>
      <span style="font-size: 20px;">模板样式：</span>
      <Select
        v-model:value="codeTemplateId"
        placeholder=""
        style="width: 30%;margin-right: 2%;font-weight: bold;font-size: 20px;"
      >
        <SelectOption v-for="tem in templateList" :key="tem.id" :value="tem.id">
          {{ tem.tname }}
        </SelectOption>
        <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
      </Select>
      <span style="font-size: 18px;margin-left: 100px;">
        <DownloadOutlined style="font-size: 30px;"/>
        <a @click="excelTemplate(codeTemplateId)">&emsp;模板下载</a>
      </span>
    </div>
    <Tabs style="margin-top: 40px;">
      <TabPane key="1" tab="数据文件">
        <br>
        <span style="margin-left: 70px;">
            <a-upload
              :file-list="fileList"
              :remove="handleRemove"
              :before-upload="beforeUpload"
            >
          <a-button type="primary">
            请选择导入的文件
          </a-button>
        </a-upload>
        </span>
        <br><br>
      </TabPane>
    </Tabs>
    <a-modal v-model:visible="visible" :closable="false" @ok="ModalClose" @cancel="ModalClose" style="top: 150px;" width="450px">
      <p style="color: #0096c7;font-size: 20px;font-weight: bold;margin-left: 10px;margin-top: 10px;">
        <CheckCircleOutlined style="font-size: 20px;font-weight: bold;"/>&nbsp;导入完成
      </p>
      <img src="/download2.png" style="float: right;width: 68px;margin-top: -25px;margin-right: 20px;" >
      <div style="height: 150px;margin-top:80px;">
        <p style="margin-left: 50px;font-size: 14px;font-weight: bold;">
          记录总数：
          <span style="float: right;margin-right: 30%;">{{excelResultInfo.excellistLength-1}}条</span>
        </p>
        <p style="margin-left: 50px;font-size: 14px;font-weight: bold;">
          导入成功：
          <span style="float: right;margin-right: 30%;">{{excelResultInfo.successInfo}}条</span>
        </p>
        <p style="margin-left: 50px;font-size: 14px;font-weight: bold;">
          导入失败：
          <span style="float: right;margin-right: 30%;">{{excelResultInfo.errorInfo}}条</span>
        </p>
        <p style="margin-left: 20px;font-size: 14px;">
          <a v-if="excelResultInfo.errorInfo>0" style="margin-left: 30px;" @click="errorExcel">下载描述错误excel</a>
        </p>
      </div>
    </a-modal>
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
          <a-button @click="handleOk(true)" type="primary" :loading="uploading" :disabled="fileList.length == 0 || fileList.length> 1">开始导入
          </a-button>
        </div>
      </div>
    </template>
  </BasicModal>
</template>
<script setup="props, { content }" lang="ts">
import {
  CaretDownOutlined,
  CloudUploadOutlined,
  DownloadOutlined,
  EllipsisOutlined,
  AppstoreOutlined
} from '@ant-design/icons-vue';
import {reactive, ref} from 'vue';
import {BasicModal, useModalInner} from '/@/components/Modal';
import {
  Popover as APopover,
  Input as AInput,
  message,
  Modal as AModal,
  Select as ASelect,
  Select,
  Tabs,
  Upload as AUpload
} from 'ant-design-vue';
import {aoaToSheetXlsx} from '/@/components/Excel';
import {useUserStoreWidthOut} from '/@/store/modules/user';
import {useCompanyOperateStoreWidthOut} from '/@/store/modules/operate-company';
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
/******************* 弹框加载中 **************************/
import {Loading} from '/@/components/Loading';
import {importStockBalanceDuli, importStockBalanceJiBie} from "/@/api/record/stock/stock_balance";
import {exportExcel3} from "/@/api/record/generalLedger/excelExport";

const AInputSearch=AInput.Search
const ASelectOption=ASelect.Option
const SelectOption = Select.Option;
// 上传文件
const headers = ref({
  authorization: useUserStoreWidthOut().getToken,
  datasource: JSON.stringify({
    databaseName: '',
    schemaName: useCompanyOperateStoreWidthOut().getSchemaName,
  }),
});
const excelValue:any = ref(1)
const excelResultInfo:any = reactive({
  excellistInfo:[],
  excellistLength:'',
  successInfo:'',
  errorInfo:''
})
const codeTemplateId = ref('1');
const templateList = ref([{tname:'独立仓库模板',id:'1'}]);
const fileList = ref([]);
const iyear = ref('');
const userId = ref('');
const emit=defineEmits([]);
const uploading=ref(false)
const visible = ref<boolean>(false);
const database=ref('')
const excelcolumn=ref('')

const [register, { closeModal }] = useModalInner((data) => {
  userId.value = data.userId;
  iyear.value = data.iyear;
  database.value=data.database
  fileList.value=[]
});

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
  codeTemplateId.value=data
  handleDownByData(data)
}
const columns1 = reactive([
  {title:'仓库名称',key:'a0'},
  {title:'存货编码',key:'a1'},
  {title:'存货名称',key:'a2'},
  {title:'规格型号',key:'a3'},
  {title:'计量单位',key:'a4'},
  {title:'数量',key:'a4'},
  {title:'金额',key:'a6'},
  {title:'批号',key:'a7'},
  {title:'生产日期',key:'a8'},
  {title:'失效日期',key:'a9'},
  {title:'入库单号',key:'a10'},
  {title:'入库日期',key:'a11'}])
const columns2 = reactive([
  {title:'*仓库级别1*',key:'a0'},
  {title:'仓库级别2',key:'a1'},
  {title:'仓库级别3',key:'a2'},
  {title:'仓库级别4',key:'a3'},
  {title:'仓库级别5',key:'a4'},
  {title:'仓库级别6',key:'a5'},
  {title:'*存货编码*',key:'a6'},
  {title:'存货名称',key:'a7'},
  {title:'规格型号',key:'a8'},
  {title:'*主数量*',key:'a9'},
  {title:'单价',key:'a10'},
  {title:'*金额*',key:'a11'},
  {title:'批号',key:'a12'},
  {title:'生产日期',key:'a13'},
  {title:'失效日期',key:'a14'},
  {title:'入库单号',key:'a15'},
  {title:'入库日期',key:'a16'}])

// 文件下载
const handleDownByData = async (val: any) => {
  const multiHeader:any = [[]]
  const keys:any = []
  //样式靠右列
  let rightrow:any=[]
  //样式靠左列
  let leftrow:any=[]

  let columns=val=='1'?columns1:columns2
  const cell = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
  columns.forEach((v,index)=>{
    if(v.title.indexOf('数量')!=-1||v.title.indexOf('单价')!=-1||v.title.indexOf('金额')!=-1){
      rightrow.push(cell[index])
    }else{
      leftrow.push(cell[index])
    }
    multiHeader[0].push(v.title)
    keys.push(v.key)
  })
  const sheet =[
    {
      multiHeader: multiHeader,
      table: [],
      keys: keys,
      sheetName: 'sheet1',
      cellStyle: [],
      rightrow:rightrow,
      leftrow:leftrow,
    },
  ]
  exportExcel3(sheet, 'xlsx','库存期初余额导入模板')
}

const handleRemove = (file) => {
  const index = fileList.value.indexOf(file);
  const newFileList = fileList.value.slice();
  newFileList.splice(index, 1);
  fileList.value = newFileList;
};
const beforeUpload = (file) => {
  // 默认存储最新单文件
  if (fileList.value.length > 0) fileList.value = []
  fileList.value = [...fileList.value, file]
  return false;
}
const handleClose = () => {
  fileList.value = [];
  closeModal()
}
const handleOk = async () => {
  openCompFullLoading()
  const formData = new FormData();
  fileList.value.forEach((file) => {
    formData.append('file', file as any);
  });
  formData.append('userId', userId.value);
  formData.append('iyear', iyear.value);
  await useRouteApi(codeTemplateId.value=='1'?importStockBalanceDuli:importStockBalanceJiBie,{schemaName: database})(formData).then(async (info:any)=>{
    // console.log(info[0])
    if(info[0].code==='200' || info[0].error==='error'){
      visible.value=true
      compState.loading = false
      excelResultInfo.successInfo=info[0].list.length
      excelResultInfo.excellistLength=info[0].excellist.length
      excelResultInfo.excellistInfo=info[0].excellist
      excelcolumn.value=info[0].column;
      let column=info[0].column;
      let errorsize=0
      excelResultInfo.excellistInfo.forEach(v=>{
        if(v[column]!==null){
          errorsize=errorsize+1;
        }
      })
      excelResultInfo.errorInfo=errorsize
    }else{
      fileList.value = [];
      uploading.value = false;
      compState.loading = false
      message.error(info[0].error);
    }
  })
};
const ModalClose = () => {
  visible.value=false
  emit('save');
  closeModal();
}
// 把错误信息生成新的Excel导出
const errorExcel = () => {
  let columns:any = []
  if(codeTemplateId.value=='1'){
    columns=columns1
    columns.push({title:'失败原因',key:'a12'})
  }else{
    columns=columns2
    columns.push({title:'失败原因',key:'a17'})
  }

  let list=[]
  if(codeTemplateId.value=='1'){
    excelResultInfo.excellistInfo.splice(1).forEach((v,index)=>{
      let dd:any={}
      dd.a0=v[0]
      dd.a1=v[1]
      dd.a2=v[2]
      dd.a3=v[3]
      dd.a4=v[4]
      dd.a5=v[5]
      dd.a6=v[6]
      dd.a7=v[7]
      dd.a8=v[8]
      dd.a9=v[9]
      dd.a10=v[10]
      dd.a11=v[11]
      dd.a12=v[12]
      list.push(dd)
    })
  }else{
    excelResultInfo.excellistInfo.splice(1).forEach(v=>{
      let dd:any={}
      dd.a0=v[0]
      dd.a1=v[1]
      dd.a2=v[2]
      dd.a3=v[3]
      dd.a4=v[4]
      dd.a5=v[5]
      dd.a6=v[6]
      dd.a7=v[7]
      dd.a8=v[8]
      dd.a9=v[9]
      dd.a10=v[10]
      dd.a11=v[11]
      dd.a12=v[12]
      dd.a13=v[13]
      dd.a14=v[14]
      dd.a15=v[15]
      dd.a16=v[16]
      dd.a17=v[17]
      list.push(dd)
    })
  }

  const multiHeader:any = [[]]
  const keys:any = []
  //样式靠右列
  let rightrow:any=[]
  //样式靠左列
  let leftrow:any=[]

  const cell = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
  columns.forEach((v,index)=>{
    if(v.title.indexOf('数量')!=-1||v.title.indexOf('单价')!=-1||v.title.indexOf('金额')!=-1){
      rightrow.push(cell[index])
    }else{
      leftrow.push(cell[index])
    }
    multiHeader[0].push(v.title)
    keys.push(v.key)
  })
  const sheet =[
    {
      multiHeader: multiHeader,
      table: list,
      keys: keys,
      sheetName: 'sheet1',
      cellStyle: [],
      rightrow:rightrow,
      leftrow:leftrow,
    },
  ]
  exportExcel3(sheet, 'xlsx','导入失败库存期初余额信息')
}
</script>
<style lang="less" scoped>
@import '/@/assets/styles/redTitle-open.less';
:deep(.ant-select-selector) {
  border: none !important;
  border-bottom: 1px solid #bdb9b9 !important;
}
</style>
