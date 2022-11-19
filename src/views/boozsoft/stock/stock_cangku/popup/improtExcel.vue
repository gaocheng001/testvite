<template>
  <BasicModal
    width="800px"
    v-bind="$attrs"
    :canFullscreen="false"
    @register="register"
  >
    <Loading :loading="compState.loading" :absolute="compState.absolute" :tip="compState.tip" />
    <template #title>
      <div style="display: flex;color: #0096c7;">
        <span style="line-height:40px;font-size: 28px;">
          <CloudUploadOutlined style="font-size: 34px;font-weight: bold"/>
        </span>
        <span style="line-height:40px;font-size: 22px;margin-top:-5px;">
          &nbsp;&nbsp;数据导入
        </span>
      </div>
    </template>

    <div class="import-centent-div" >
      <div class="import-info-div">
        <div class="import-div-top">
          <div>
          </div>
          <div>
            <span>导入内容：</span><span style="font-weight: bold;font-size: 20px;">仓库信息</span><br/><br/>
            <span>模板样式：</span>
            <Select
              v-model:value="codeTemplateId"
              placeholder=""
              style="width: 50%;margin-right: 2%"
              allow-clear>
              <SelectOption v-for="tem in templateList" :key="tem.id" :value="tem.id">
                {{ tem.tname }}
              </SelectOption>
              <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
            </Select>
          </div>
          <div>
            <Tooltip placement="top" >
              <Button size="small" style="color: #3eadbe">查看帮助</Button>
              <EllipsisOutlined style="cursor: pointer;margin-left: 10%;color: #3eadbe"/>
            </Tooltip>
            <br>
            <br>
            <Tooltip placement="top" >
              <DownloadOutlined style="font-size: 30px;"/>
              <a @click="excelTemplate(codeTemplateId)">&emsp;模板下载</a>
            </Tooltip>
          </div>
        </div>
      </div>
      <div class="import-div-bottom">
        <Tabs>
          <TabPane key="1" tab="全新添加导入">
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
          <TabPane key="2" disabled tab="覆盖">

          </TabPane>
        </Tabs>
      </div>
    </div>
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
import { DownloadOutlined,CloudUploadOutlined,CaretDownOutlined,EllipsisOutlined } from '@ant-design/icons-vue';
import {reactive, ref} from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import {message, Select} from 'ant-design-vue';
import {aoaToSheetXlsx, jsonToSheetXlsx} from '/@/components/Excel';
import { useUserStoreWidthOut } from '/@/store/modules/user';
import { useCompanyOperateStoreWidthOut} from '/@/store/modules/operate-company';
import {importCus} from "/@/api/record/costomer_data/customer";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {Upload as AUpload,
  Select as ASelect,
  Input as AInput,
  Modal as AModal,Button, Tabs,Tooltip} from 'ant-design-vue'
import {exportExcel} from "/@/api/record/generalLedger/excelExport";
import {importCangku} from "/@/api/record/stock/stock-cangku";

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
const templateList = ref([{tname:'系统简约模板',id:'1'}]);
const fileList = ref([]);
const username = ref('');
const emit=defineEmits([]);
const uploading=ref(false)
const visible = ref<boolean>(false);
const databaseName=ref('')
const database=ref('')
const excelcolumn=ref('')
const accountInfo=ref({})
const ckLevelList:any=ref([])

const [register, { closeModal }] = useModalInner((data) => {
  username.value = data.data;
  databaseName.value=data.baseName
  database.value=data.database
  accountInfo.value=data.accountInfo
  ckLevelList.value=data.ckLevelList
  fileList.value=[]
});

/******************* 弹框加载中 **************************/
import { Loading } from '/@/components/Loading';
import {saveLog} from "/@/api/record/system/group-sys-login-log";
import {importStock} from "/@/api/record/stock/stock";
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
  aoaToSheetXlsx({
    data: [],
    header: ['仓库编码','仓库名称','仓库级别(*\\*)','管理属性','所在城市','仓库注释'],
    filename: '仓库信息导入模板.xlsx',
  });
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
  formData.append('ckLevelList', JSON.stringify(ckLevelList.value));
  await useRouteApi(importCangku,{schemaName: database})(formData).then(async (info:any)=>{
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
  const columns1:any = []
  let biaotou=excelResultInfo.excellistInfo[0];
  for (let i = 0; i < biaotou.length; i++) {
    if(biaotou[i]!==null){
      columns1.push(biaotou[i])
    }
  }
  columns1.push('失败原因')
  aoaToSheetXlsx({
    data: excelResultInfo.excellistInfo.splice(1),
    header: columns1,
    filename: '导入失败存货档案.xlsx',
  });
}
</script>
<style src="../../../../../assets/styles/global-import-open3.less" lang="less"></style>
<style lang="less" scoped>
:deep(.ant-select-selector) {
  border: none !important;
  border-bottom: 1px solid #bdb9b9 !important;
}
</style>
