<template>
  <BasicModal
    width="900px"
    v-bind="$attrs"
    title="期初余额导入模板"
    @ok="handleOk()"
    @register="register"
  >
    1、<a-select style="width: 250px" placeholder="下载导入模板" @change="handleDownByData">
      <a-select-option value="1">空白模板-只有表头</a-select-option>
      <a-select-option value="2">当前账套模板-自带末级科目</a-select-option>
    </a-select>

    &nbsp;
<!--    <a-upload-->
<!--      v-model:file-list="fileList"-->
<!--      :headers="headers"-->
<!--      :action="'/api/subjectinitialBalance/importInitalBalance?iyear=' + iyear123"-->
<!--      @change="handleChange"-->
<!--    >-->
<!--      2、-->
<!--      <a-button>-->
<!--        &lt;!&ndash;        <upload-outlined />&ndash;&gt;-->
<!--        选择文件-->
<!--      </a-button>-->
<!--    </a-upload>-->
    <a-upload
      :file-list="fileList"
      :remove="handleRemove"
      :before-upload="beforeUpload"
    >
      <a-button type="primary">
        2、请选择导入的文件
      </a-button>
    </a-upload>
    <template #footer>
      <div style="height: 35px">
        <div style="float: right">
          <a-button @click="handleClose">放弃</a-button>
          <a-button @click="handleOk(true)" type="primary" :loading="uploading"
                    :disabled="fileList.length == 0 || fileList.length> 1">开始导入
          </a-button>
        </div>
      </div>
    </template>
  </BasicModal>
</template>
<script setup="props, { content }" lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { message } from 'ant-design-vue';
  import {
    findAllByBendAndIyearOrderByCcode,
    importInitalBalance,
  } from '/@/api/subjectInitialBalance/subjectInitialBalance';
  import { jsonToSheetXlsx } from '/@/components/Excel';

  import { useUserStoreWidthOut } from '/@/store/modules/user';
  import {
    Select as ASelect,
    Input as AInput,
    Popover as APopover,
    Checkbox as ACheckbox,
    Modal as AModal,
    Upload as AUpload,
  } from 'ant-design-vue';
  import {
    useCompanyOperateStore,
    useCompanyOperateStoreWidthOut,
  } from '/@/store/modules/operate-company';
  import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
  import {getCurrentAccountName} from "/@/api/task-api/tast-bus-api";
  const ASelectOption = ASelect.Option;
  const AInputSearch = AInput.Search;
  // 上传文件
  const headers = ref({
    authorization: useUserStoreWidthOut().getToken,
    datasource: JSON.stringify({
      databaseName: '',
      schemaName: getCurrentAccountName(true),
    }),
  });

  const fileList = ref([]);
  const data = ref('');
  const iyear123 = ref('');
  // 数据库模式名称
  const database = ref('');
  const databaseTrue = ref('');
  const emit=defineEmits(['register']);
  const uploading=ref(false);

  const [register, { closeModal }] = useModalInner((data) => {
    databaseTrue.value = data.databaseTrue;
    database.value = data.database;
    iyear123.value = data.iyear;
  });

  // 文件下载
  const handleDownByData = async (val: any) => {
    const lastCodeList = await useRouteApi(findAllByBendAndIyearOrderByCcode,{schemaName:databaseTrue.value})({ bend: '1', iyear: iyear123.value });
    var arr = [];
    for (let i = 0; i < lastCodeList.length; i++) {

      let flag = true;

      if("1" == lastCodeList[i].bperson){flag = false;}
      if("1" == lastCodeList[i].bcus){flag = false;}
      if("1" == lastCodeList[i].bsup){flag = false;}
      if("1" == lastCodeList[i].bdept){flag = false;}
      if("1" == lastCodeList[i].bitem){flag = false;}

      if("1" == lastCodeList[i].cdfine1){flag = false;}
      if("1" == lastCodeList[i].cdfine2){flag = false;}
      if("1" == lastCodeList[i].cdfine3){flag = false;}
      if("1" == lastCodeList[i].cdfine4){flag = false;}
      if("1" == lastCodeList[i].cdfine5){flag = false;}
      if("1" == lastCodeList[i].cdfine6){flag = false;}
      if("1" == lastCodeList[i].cdfine7){flag = false;}
      if("1" == lastCodeList[i].cdfine8){flag = false;}
      if("1" == lastCodeList[i].cdfine9){flag = false;}
      if("1" == lastCodeList[i].cdfine10){flag = false;}
      if("1" == lastCodeList[i].cdfine11){flag = false;}
      if("1" == lastCodeList[i].cdfine12){flag = false;}
      if("1" == lastCodeList[i].cdfine13){flag = false;}
      if("1" == lastCodeList[i].cdfine14){flag = false;}
      if("1" == lastCodeList[i].cdfine15){flag = false;}
      if("1" == lastCodeList[i].cdfine16){flag = false;}
      if("1" == lastCodeList[i].cdfine17){flag = false;}
      if("1" == lastCodeList[i].cdfine18){flag = false;}
      if("1" == lastCodeList[i].cdfine19){flag = false;}
      if("1" == lastCodeList[i].cdfine20){flag = false;}
      if("1" == lastCodeList[i].cdfine21){flag = false;}
      if("1" == lastCodeList[i].cdfine22){flag = false;}
      if("1" == lastCodeList[i].cdfine23){flag = false;}
      if("1" == lastCodeList[i].cdfine24){flag = false;}
      if("1" == lastCodeList[i].cdfine25){flag = false;}
      if("1" == lastCodeList[i].cdfine26){flag = false;}
      if("1" == lastCodeList[i].cdfine27){flag = false;}
      if("1" == lastCodeList[i].cdfine28){flag = false;}
      if("1" == lastCodeList[i].cdfine29){flag = false;}
      if("1" == lastCodeList[i].cdfine30){flag = false;}

      if(!"1" == lastCodeList[i].flag){flag = false;}

      if(flag){
        arr.push({
          ccode: lastCodeList[i].ccode,
          ccodeName: lastCodeList[i].ccodeName,
          md: '',
          mc: '',
          num: '',
          rate: '',
          wbmoney: '',
          jsnum: '',
          jspnum: '',
          pjdate: '',
          dwname: '',
        });
      }
    }
    arr = val === '1' ? [] : arr;
    dataExcel(arr);
  };

  function dataExcel(val: any) {
    jsonToSheetXlsx({
      data: val,
      header: {
        ccode: '科目编码',
        ccodeName: '科目名称',
        md: '借方金额',
        mc: '贷方金额',
        num: '数量',
        rate: '汇率',
        wbmoney: '原币金额',
        jsnum: '结算方式编码',
        jspnum: '结算票据号',
        pjdate: '票据日期',
        dwname: '对方单位名称',
      },
      filename: '期初余额导入模板.xlsx',
    });
  }

  // 上传回调
  const handleChange = async (info: any) => {
    if (info.fileList[0].status === 'done') {
      if (info.fileList[0].response.result[0].code === '401') {
        fileList.value = [];
        message.error(info.fileList[0].response.result[0].error);
        return false;
      } else {
        message.success('导入成功', 1, function () {
          handleOk();
        });
      }
    }
  };

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
    const databasenum=database.value+'-'+iyear123.value

    const formData = new FormData();
    fileList.value.forEach((file) => {
      formData.append('file', file as any);
    });
    await useRouteApi(importInitalBalance,{schemaName:databasenum})({params:formData,databasenum:databasenum,iyear:iyear123.value})
      .then(async (info:any)=>{
        if(info[0].code==='401'){
          fileList.value = [];
          uploading.value = false;
          message.error(info[0].error);
          return false;
        }else{
          fileList.value = [];
          uploading.value = false;
          message.success('导入成功', 1, function () {
            emit('save');
            closeModal();
          });
        }
      })
    // emit('save');
    // closeModal();
  };
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
