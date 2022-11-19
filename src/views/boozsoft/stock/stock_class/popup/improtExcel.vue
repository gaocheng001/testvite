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
            <span>导入内容：</span><span style="font-weight: bold;font-size: 20px;">存货分类</span><br/><br/>
            <span>模板样式：</span>
            <Select
              disabled
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
              <a @click="handleDownByData()">&emsp;模板下载</a>
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
    <a-modal v-model:visible="visible" @ok="ModalClose" @cancel="ModalClose" style="top: 150px;" width="450px">
      <p style="color: #0096c7;font-size: 20px;font-weight: bold;margin-left: 10px;margin-top: 10px;">
        <CheckCircleOutlined style="font-size: 20px;font-weight: bold;"/>&nbsp;导入完成
      </p>
      <img style="float: right;width: 68px;margin-top: -25px;margin-right: 20px;" >
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
import { DownloadOutlined,CloudUploadOutlined,CaretDownOutlined,EllipsisOutlined,CheckCircleOutlined } from '@ant-design/icons-vue';
import {reactive, ref} from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { message,Select } from 'ant-design-vue';
import {aoaToSheetXlsx, jsonToSheetXlsx} from '/@/components/Excel';

import { getToken } from '/@/utils/auth';
import { useUserStoreWidthOut } from '/@/store/modules/user';
import {Upload as AUpload,
  Select as ASelect,
  Input as AInput,
  Modal as AModal,Button, Tabs,Tooltip} from 'ant-design-vue'
import {
  useCompanyOperateStore,
  useCompanyOperateStoreWidthOut,
} from '/@/store/modules/operate-company';
import axios from "axios";
import {uploadFile} from "/@/utils/boozsoft/axios/uploadFile";
import {GetCustomerClassTree, importCusClass} from "/@/api/record/system/customer_class";
import {getCurrentAccountName} from "/@/api/task-api/tast-bus-api";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {exportExcel} from "/@/api/record/generalLedger/excelExport";
import {importStockClass} from "/@/api/record/stock/stock_class";

const ASelectOption = ASelect.Option;
const AInputSearch = AInput.Search;
const SelectOption = Select.Option;
// 上传文件
const headers = ref({
  authorization: useUserStoreWidthOut().getToken,
  datasource: JSON.stringify({
    databaseName: '',
    schemaName: useCompanyOperateStoreWidthOut().getSchemaName,
  }),
});
const codeTemplateId = ref('1');
const templateList = ref([{tname:'系统标准模板',id:'1'}]);
const fileList = ref([]);
const data = ref('');
const uniqueAccStandard = ref('');
const templateId = ref('');
const iyear = ref('');
const uploading=ref(false)
const emit=defineEmits(['register']);
const visible = ref<boolean>(false);
const database=ref('')
const excelcolumn=ref('')
const accountInfo=ref({})
const excelResultInfo:any = reactive({
  excellistInfo:[],
  excellistLength:'',
  successInfo:'',
  errorInfo:''
})

const [register, { closeModal }] = useModalInner((data) => {
  database.value=data.database
  accountInfo.value=data.accountInfo
  // uniqueAccStandard.value = data.data.uniqueAccStandard;
  // templateId.value = data.data.templateId;
  // iyear.value = data.data.iyear;
});

/******************* 弹框加载中 **************************/
import { Loading } from '/@/components/Loading';
import {saveAllLog, saveLog} from "/@/api/record/system/group-sys-login-log";
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
// 文件下载
const handleDownByData = async () => {
  aoaToSheetXlsx({
    data: [],
    header: ['分类编码','分类名称','上级分类编码'],
    filename: '存货分类信息.xlsx',
  });
}

const ModalClose = () => {
  visible.value=false
  emit('save');
  closeModal();
}

const handleOk = async () => {
  openCompFullLoading()
  const formData = new FormData();
  fileList.value.forEach((file) => {
    formData.append('file', file as any);
  });

  await useRouteApi(importStockClass,{schemaName: database})(formData)
    .then(async (info:any)=>{
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

        let loglist:any=[]
        for (let i = 0; i < info[0].list.length; i++) {
          // 埋点-操作日志
          let log='操作内容【导入存货分类】,账套代码【'+accountInfo.value.coCode+'】,账套名称【'+accountInfo.value.companyName+'】' +
            ',分类编码【'+info[0].list[i].cusClass+'】,分类编码【'+info[0].list[i].cusCclassName+'】'
          /************** 记录操作日志 ****************/
          let logmap={
            loginTime:new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "),
            userId: useUserStoreWidthOut().getUserInfo.username,
            userName: useUserStoreWidthOut().getUserInfo.realName,
            optModule:'master_data',
            optFunction:'存货分类',
            optRange:'1',
            uniqueCode:database.value,
            optAction:'新增',
            optContent:log,
          }
          loglist.push(logmap)
          // await saveLog(logmap)
          /************** 记录操作日志 ****************/
        }
        await saveAllLog(loglist)
      }else{
        fileList.value = [];
        uploading.value = false;
        compState.loading = false
        message.error(info[0].error);
      }
    })
};
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
    filename: '导入失败c存货分类信息.xlsx',
  });
}
</script>
<style src="../../../../../assets/styles/global-import-open3.less" lang="less" ></style>
