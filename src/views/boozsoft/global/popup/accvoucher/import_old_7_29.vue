<template>
  <BasicModal
    width="900px"
    v-bind="$attrs"
    title="会计凭证导入模板"
    @ok="handleOk()"
    @register="register"
  >
    <span>请选择系统模板：</span>
    <a-select
      v-model:value="templateName"
      show-search
      placeholder="请选择模板"
      style="width: 30%"
      allow-clear
    >
<!--      @change="checkTemplateType(templateName)"-->
      <a-select-option v-for="(tem,index) in templateList" :key="tem.id" :value="tem.id+'--'+tem.templateType+'--'+index">
        {{tem.templateName}}
      </a-select-option>
    </a-select>
<!--    <template v-if="isShow">-->
      <span style="margin-left: 5%">标准模板导入规则：</span>
      <a-radio-group  v-model:value="templateType">
        <a-radio-button value="1">
          按辅助项名称导入
        </a-radio-button>
        <a-radio-button value="2">
          按辅助项编码导入
        </a-radio-button>
      </a-radio-group>
<!--    </template>-->
    <br>
    <span >凭证编码生成规则：</span><a-switch checked-children="自定义编码" un-checked-children="编码生成"  :checked="templateNumber=='1'" default-checked style="margin:2% 0%" @change="(v)=>{templateNumber = v?'1':'2'}" />
    <br>
    <a-button @click="downLoad()"  >
      <download-outlined></download-outlined>
      下载导入模板
    </a-button>
    &emsp;
    <a-upload
      v-model:file-list="fileList"
      :action="'/api/accvoucher/importAccvoucher2?templateID='+uploadParm"
      :headers="headers"
      @change="handleChange"
      :before-upload="beforeUpload"
    >
      <a-button>
        <upload-outlined></upload-outlined>
        选择文件
      </a-button>
    </a-upload>
  </BasicModal>
</template>
<script setup="props, {content}" lang="ts">
import {onMounted, ref, unref} from 'vue'
import { BasicModal, useModalInner } from '/@/components/Modal'
import { UploadOutlined,DownloadOutlined } from '@ant-design/icons-vue'
import { findAllAccvoucherTemplate,findAllAccvoucherFieldsApi } from '/@/api/record/system/accvoucher_template'
import {findByFunctionModule, offsetToStr, compareTime, markAnomaly} from '/@/api/task-api/tast-bus-api'
import { message } from 'ant-design-vue'
import { jsonToSheetXlsx } from '/@/components/Excel';
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {defHttp} from "/@/utils/http/axios";
import {useMessage} from "/@/hooks/web/useMessage";
const {
  createErrorModal,createWarningModal
} = useMessage()
import {DatePicker as ADatePicker,Select as ASelect,Input as AInput,Popover as APopover,Switch as ASwitch,Radio as ARadio,Upload as AUpload,Table as ATable} from "ant-design-vue"
const ARangePicker=ADatePicker.RangePicker
const ASelectOption=ASelect.Option
const AInputSearch=AInput.Search
const ARadioGroup=ARadio.Group
const ARadioButton=ARadio.Button
// 选中模板
const templateName = ref()
const templateType = ref('2')
const templateNumber = ref('1') // 1 自定义 2系统生成
const isShow = ref(false)
const templateList = ref([])
const headers=ref({})
// 上传文件

const fileList = ref([])

const emit=defineEmits(['register'])

const [register, { closeModal }] = useModalInner((data) => {
  findAllAccvoucherTemplate().then(res => {

   /* if (res[0].templateType == '1'){
      isShow.value=true
    }*/
   // templateName.value = res[0].id+'--'+res[0].templateType+'--'+(isShow.value?'1':'2')+'--0'
    templateList.value = res
  })
  fileList.value =[]
})

onMounted(()=>{
  useCompanyOperateStoreWidthOut().commitSchemaName(
    ///*JSON.parse(window.localStorage.getItem('datasource')).schemaName +*/ 'bjxgkj-001-' + '2021'
    /*JSON.parse(window.localStorage.getItem('datasource')).schemaName +*/ 'deptprohs-001-2021'
  );

  headers.value = {
    'Authorization':useUserStoreWidthOut().getToken,
    'datasource':window.localStorage.getItem('datasource')
  }
})

// 唯一码 -- 模板类型 -- 是否为名称 -- 数据下标 -- 是否自定义编码
const uploadParm = ref('')
// 上传回调
const handleChange = async(info:any) => {
  if (info.fileList[0].status === 'done') {
    if (info.fileList[0].response.result[0].code === 404) {
      createErrorModal({title: '模板导入检测结果',content: info.fileList[0].response.result[0].result })
      return false
    } else {
      message.success('导入成功')
      emit('reloadProjects')
      closeModal()
    }
  }
}

function checkTemplateType(value){
  if (value != null && value != ''){
       value.split('--')[1]==='1'?(isShow.value=true):(isShow.value=false)
  }
}

const beforeUpload = (file) => {
  if (null == templateName.value){
    fileList.value =[]
    message.info("请先选择凭证模板！")
  }else {
    uploadParm.value =(templateName.value.split('--')[0]+'--'+templateName.value.split('--')[1]+'--'+templateType.value+'--'+templateName.value.split('--')[2]+'--'+templateNumber.value)
    return true;

    // 校验是否 被锁定
    let msg = '';
    // 终止for循环，使用break
    /*findByFunctionModule(2021).then(res=>{
      let checkMenu = ['会计科目','凭证','月末结账','人员档案','客户档案','部门档案','项目档案','部门档案']
      res.forEach(item=>{
          if (checkMenu.indexOf(item.functionModule) != -1 && item.state == '1'){
              // 校验时间
              if (item.time != '' && !compareTime(offsetToStr(item.time))){ // 超时
                msg = '提示：任务冲突！操作员【' +
                  item.caozuoUnique +
                  '】正在进行'+item.functionModule+'处理!不能继续进行凭证导入操作，请销后再试，或联系财务主管清理该记账任务!'
                return false;
              }else {
                // 标记异常
                markAnomaly(item.id,item.iyear);
              }
          }
      })
      if (msg != ''){
        fileList.value =[]
        createWarningModal({title: '模板导入检测',content: msg })
        return false
      }else {
        uploadParm.value =(templateName.value.split('--')[0]+'--'+templateName.value.split('--')[1]+'--'+templateType.value+'--'+templateName.value.split('--')[2]+'--'+templateNumber.value)
        return  true;
      }
    })*/
  }
  return false;
}

const handleOk = () => {
  if (null == templateName.value){
    message.info("请先选择凭证模板！")
  }else if (fileList.value.length == 0){
    message.info("请先选择要进行导入的Excel！")
  }else {
    emit('reloadProjects')
    closeModal()
  }
}

const downLoad = () => {
  if (null == templateName.value){
    message.info("请先选择要下载的凭证模板！")
    return false;
  }
  let arr  = templateName.value.split('--')
  let data = templateList.value[arr[2]]
  findAllAccvoucherFieldsApi({id: data.id,templateType: templateType.value}).then(res=>{
    if (res.length > 0){
      let name = data.templateName+(isShow.value?'辅助项'+(arr[3]=='1'?'名称':'编码'):'')+'导入模板.xlsx'
      jsonToSheetXlsx({data: [],header: res,filename:name})
    }
  })
}
</script>
<style lang="less" scoped>

:deep(.ant-calendar-picker-input.ant-input),:deep(.ant-select-single:not(.ant-select-customize-input) .ant-select-selector .ant-select-selection-search-input){
  border: none;
  border-bottom: solid 1px rgb(191, 191, 191) !important;
}
.vben-basic-title {
  color: #0096c7 !important;
}

.ant-modal-body {
  padding: 0px;
  border: 1px solid #0096c7;
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
