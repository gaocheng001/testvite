<template>
  <BasicModal
    :showOkBtn="false"
    width="900px"
    v-bind="$attrs"
    title="存货档案自定义项导入模板"
    @ok="handleOk()"
    @register="register"
  >
    <Loading :loading="compState.loading" :absolute="compState.absolute" :tip="compState.tip" />
    <div style="position: relative;background: #ffffff;border: 1px solid #999999;padding: 10px 20px;margin-top: 20px;width: 70%;margin-left: 17%;">
      <div style="position: absolute;background: #ffffff; top: -15px;left: 20px;padding: 0 10px;">导入说明</div>
      <p>1.导入文件格式必须为xls或xlsx，且数据表内容必须放置在第一个页签sheet1中；</p>
      <p>2.自定义项名称+档案名称不允许与当前库重复；</p>
    </div>
    <div style="margin-left: 18%;margin-top: 20px;">
      <label style="width: 150px;">
        <a @click="
       handleDownByData()"><DownloadOutlined/>下载导入模板</a>
      </label>
    </div>
    <div style="margin-left: 155px;margin-top: 30px;">
      <a-upload
        :file-list="fileList"
        :remove="handleRemove"
        :before-upload="beforeUpload"
      >
        <a-button type="primary">
          请选择导入的文件
        </a-button>
      </a-upload>
      <br>
      <br>
    </div>
    <template #footer>
      <div style="height: 35px">
        <div style="float: right">
          <a-button @click="handleClose">放弃</a-button>
          <a-button @click="handleOk(true)" type="primary" :loading="uploading" :disabled="fileList.length == 0 || fileList.length> 1">开始导入
          </a-button>
        </div>
      </div>
    </template>
    <a-modal v-model:visible="visible" title="导入结果" @ok="ModalClose" @cancel="ModalClose" centered="true">
      <p>文件数据：{{excelResultInfo.excellistLength-1}}个</p>
      <p>导入成功：{{excelResultInfo.successInfo}}个</p>
      <p>导入失败：{{excelResultInfo.errorInfo}}个 <a v-if="excelResultInfo.errorInfo>0" style="margin-left: 30px;" @click="errorExcel">下载描述错误excel</a></p>
    </a-modal>
  </BasicModal>
</template>
<script setup="props, { content }" lang="ts">
import {reactive, ref} from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { message } from 'ant-design-vue';
import {aoaToSheetXlsx, jsonToSheetXlsx} from '/@/components/Excel';

  import { getToken } from '/@/utils/auth';
  import { useUserStoreWidthOut } from '/@/store/modules/user';
  import {
    Select as ASelect,
    Input as AInput,
    Modal as AModal,
    Upload as AUpload,
  } from 'ant-design-vue';
  import {
    useCompanyOperateStoreWidthOut,
  } from '/@/store/modules/operate-company';
  import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {exportExcel, exportExcel2} from "/@/api/record/generalLedger/excelExport";
  const ASelectOption = ASelect.Option;
  const AInputSearch = AInput.Search;
  // 上传文件
  const headers = ref({
    authorization: useUserStoreWidthOut().getToken,
    datasource: JSON.stringify({
      databaseName: '',
      schemaName: useCompanyOperateStoreWidthOut().getSchemaName,
    }),
  });

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
  const excelResultInfo:any = reactive({
    excellistInfo:[],
    excellistLength:'',
    successInfo:'',
    errorInfo:''
  })

  const [register, { closeModal }] = useModalInner((data) => {
    database.value=data.database
    // uniqueAccStandard.value = data.data.uniqueAccStandard;
    // templateId.value = data.data.templateId;
    // iyear.value = data.data.iyear;
  });

/******************* 弹框加载中 **************************/
import { Loading } from '/@/components/Loading';
import {importStockDefineBody} from "/@/api/record/stock/stock-define-body";
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
    header: ['自定义项名称','字段类型','档案名称'],
    filename: '存货档案自定义项导入模板.xlsx',
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

    await useRouteApi(importStockDefineBody,{schemaName: database})(formData)
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
  aoaToSheetXlsx({
    data: excelResultInfo.excellistInfo.splice(1),
    header: ['自定义项名称','字段类型','档案名称','失败原因'],
    filename: '导入失败存货档案自定义项.xlsx',
  });
}
</script>
<style lang="less" scoped>
  :dept(.ant-calendar-picker-input.ant-input),
  :deep(.ant-select-single:not(.ant-select-customize-input)
    .ant-select-selector
    .ant-select-selection-search-input) {
    border: none;
    border-bottom: solid 1px rgb(191, 191, 191) !important;
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

  .nc-open-content {
    input {
      width: 35%;
      border: none !important;
      border-bottom: 1px solid #bdb9b9 !important;
    }

    .ant-input:focus {
      box-shadow: none;
    }

    :deep(.ant-select-selector) {
      border: none !important;
      border-bottom: 1px solid #bdb9b9 !important;
    }

    label {
      text-align: right;
      width: 110px;
      display: inline-block;
      padding: 5px 10px;
    }

    .open-content-down {
      margin-top: 5%;
    }
  }
</style>
