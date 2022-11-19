<template>
  <BasicModal
    width="700px"
    v-bind="$attrs"
    title="凭证导入"
    :canFullscreen="false"
    @register="register"
  >
    <div class="import-centent-div" style="margin: 2% 5% 0%">
      <!--      <div style="position: relative;border:1px solid #9b9b9b;padding: 20px;">
              <span
                style="position: absolute; display: block; width: 80px; top: -12px; left: 50px; background-color: white; text-align: center;">导入说明</span>
              <div style="color: black;">
                <p>1.导入文件格式必须为xIs或xIsx,且数据表内容必须放置在第一个页签sheet1中;</p>
                <p>2.“简约凭证模板”是用于不包含数量核算、外币核算和自定义项附助核算的凭证;</p>
                <p>3.“标准凭证模板”可以用于所有凭证的导入;</p>
                <p>4.凭证状态导入时默认可以为空,状态值参数如下: 0正常，1作废, 2暂存, 3错误。</p>
              </div>
            </div>-->
      <div class="import-info-div">
        <div class="import-div-top">
          <div>
          </div>
          <div>
            <span>凭证导入</span><br/><br/>
            <Badge status="success"/>
            <span>凭证列表导入</span>
          </div>
          <div>
            <Button size="small" style="color: #3eadbe">查看帮助</Button>&emsp;
            <EllipsisOutlined style="cursor: pointer"/>
          </div>
        </div>
        <div class="import-div-bottom">
          <Tabs @change="fileList = []">
            <TabPane key="1" tab="凭证列表导入">
              <h2>数据导入格式</h2>
              <RadioGroup v-model:value="templateType">
                <Radio style="display: block;height: 30px;" value="2">
                  辅助核算项按编码导入，如：部门、个人、客户、供应商、项目等需要填写编码
                </Radio>
                <Radio style="display: block;height: 30px;" value="1">
                  辅助核算项按名称导入，如：部门、个人、客户、供应商、项目等需要填写名称
                </Radio>
              </RadioGroup>
            </TabPane>
          </Tabs>
        </div>
      </div>

      <div class="import-download-div"
           :style="{marginTop: '110px',textAlign: 'right'}">
        <span>下载模板文件</span>&emsp;&emsp;
        <div class="download-div" @click="downLoad()">
          <DownloadOutlined/>
        </div>
      </div>
      <div style="margin: 3% 5%">
        <span>选择导入模板：</span>
        <Select
          v-model:value="templateName"
          placeholder=""
          style="width: 30%;margin-right: 2%"
          allow-clear>
          <SelectOption v-for="(tem,index) in templateList" :key="tem.id"
                        :value="tem.id+'--'+tem.templateType+'--'+index">
            {{ tem.templateName }}
          </SelectOption>
        </Select>
        <a-upload
          :file-list="fileList"
          :remove="handleRemove"
          :before-upload="beforeUpload"
        >
          <a-button type="primary">
            请选择导入的文件
          </a-button>
        </a-upload>
      </div>
    </div>
    <template #footer>
      <div style="height: 35px">
        <div style="float: left">
          <Checkbox v-model:checked="templateNumber">系统自动生成编码</Checkbox>
        </div>
        <div style="float: right">
          <Button @click="handleClose">放弃</Button>
          <Button @click="handleOk(false)">检查</Button>
          <Button @click="handleOk(true)" type="primary" :loading="uploading"
                  :disabled="fileList.length == 0 || fileList.length> 1">
            {{ uploading != 0 ? '' : '开始导入' }}
          </Button>
        </div>
      </div>
    </template>
  </BasicModal>
</template>
<script setup="props, {content}" lang="ts">
import {onMounted, ref} from 'vue'
import {BasicModal, useModalInner} from '/@/components/Modal'
import {
  findAllAccvoucherTemplate,
  findAllAccvoucherFieldsApi
} from '/@/api/record/system/accvoucher_template'
import {
  findByFunctionModule,
  offsetToStr,
  compareTime,
} from '/@/api/task-api/tast-bus-api'
import {message} from 'ant-design-vue'
import {jsonToSheetXlsx} from '/@/components/Excel';
import {
  voucherBackgroundImport,
  downLoadCheckResultFile,
  delCheckResultFile
} from '/@/api/record/system/accvoucher';
import {useMessage} from "/@/hooks/web/useMessage";

const {
  createErrorModal, createWarningModal
} = useMessage()
import {EllipsisOutlined, DownloadOutlined} from '@ant-design/icons-vue';
import {
  Select,
  Input as AInput,
  Upload as AUpload, Badge, Button, Tabs, Radio, Checkbox
} from 'ant-design-vue';

const SelectOption = Select.Option;
const AInputSearch = AInput.Search;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
// 选中模板
const templateName = ref()
const templateType = ref('2')
const templateNumber = ref(false) // false 1自定义 true 2系统生成
const isShow = ref(false)
const templateList = ref([])
const headers = ref({})
// 上传文件
const uploading = ref(false)
const projectClassCtl = ref(false)
const fileList = ref([])

const emit = defineEmits(['register'])
const pageSchemaName = ref('')

const [register, {closeModal}] = useModalInner((data) => {
  pageSchemaName.value = data.data.schemaName
  projectClassCtl.value = data.data.projectClassCtl
  findAllAccvoucherTemplate().then(res => {
    /* if (res[0].templateType == '1'){
       isShow.value=true
     }*/
    // templateName.value = res[0].id+'--'+res[0].templateType+'--'+(isShow.value?'1':'2')+'--0'
    templateList.value = res
  })
  fileList.value = []
})

onMounted(async () => {
  /*useCompanyOperateStoreWidthOut().commitSchemaName(
    ///!*JSON.parse(window.localStorage.getItem('datasource')).schemaName +*!/ 'bjxgkj-001-' + '2021'
    /!*JSON.parse(window.localStorage.getItem('datasource')).schemaName +*!/ 'deptprohs-001'
  );
  headers.value = {
    'Authorization': useUserStoreWidthOut().getToken,
    'datasource': window.localStorage.getItem('datasource')
  }*/
})

// 唯一码 -- 模板类型 -- 是否为名称 -- 数据下标 -- 是否自定义编码 -- 账套accId -- 是否项目大类控制科目及项目
const uploadParm = ref('')
// 上传回调
const handleChange = async (info: any) => {
  if (info.fileList[0].status === 'done') {
    if (info.fileList[0].response.result[0].code === 404) {
      createErrorModal({title: '模板导入检测结果', content: info.fileList[0].response.result[0].result})
      return false
    } else {
      message.success('导入成功')
      emit('reloadProjects')
      closeModal()
    }
  }
}
import {downloadByData} from "/@/utils/file/download";
import {dlownload} from "/@/api/record/eletronicInvoice_data/eletronic_invoice";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

const beforeUpload = (file) => {
  // 默认存储最新单文件
  if (fileList.value.length > 0) fileList.value = []
  fileList.value = [...fileList.value, file]
  return false;
}

const handleOk = (flag) => {
  if (null == templateName.value) {
    createWarningModal({title: '凭证导入前检测', content: '请先选择要进行导入的凭证模板类型！'})
  } else if (fileList.value.length == 0) {
    createWarningModal({title: '凭证导入前检测', content: '请先选择要进行导入的Excel文件！'})
  } else {
    let msg = '';
    findByFunctionModule({iyear: 2021}).then(res => {
      let checkMenu = ['会计科目修改', '凭证导入', '月末结账', '人员档案', '客户档案', '部门档案', '项目档案', '部门档案']
      res.forEach(item => {
        if (checkMenu.indexOf(item.functionModule) != -1 && item.state == '1') {
          // 校验时间
          if (item.time != '' && !compareTime(offsetToStr(item.time))) { // 超时
            msg = '提示：任务冲突！操作员【' +
              item.caozuoUnique +
              '】正在进行' + item.functionModule + '处理!不能继续进行凭证导入操作，请销后再试，或联系财务主管清理该记账任务!'
            return false;
          } else {
            // 标记异常
            // markAnomaly(item.id, item.iyear);
          }
        }
      })
      if (msg != '') {
        fileList.value = []
        createWarningModal({title: '凭证导入前检测', content: msg})
        return false
      } else {
        uploadParm.value = (templateName.value.split('--')[0] + '--' + templateName.value.split('--')[1] + '--' + templateType.value
          + '--' + templateName.value.split('--')[2] + '--' + (templateNumber.value ? '2' : '1'))
        const formData = new FormData();
        fileList.value.forEach((file) => {
          formData.append('file', file as any);
        });
        uploading.value = true;
        let s = pageSchemaName.value.split('-')[0] + '-' + pageSchemaName.value.split('-')[1]
        formData.append('templateInfo', uploadParm.value + '--' + s+ '--' + (projectClassCtl.value ? '1' : '0'))
        formData.append('isCehck', flag)
        useRouteApi(voucherBackgroundImport, {schemaName: pageSchemaName.value})(formData)
          .then(async (info: any) => {
            fileList.value = [];
            uploading.value = false;
            if (null != info.pass) { // 检查
              if (!info.pass) {
                createErrorModal({
                  title: '模板导入检测结果',
                  content: '后台检查不通过是否下载表格查看错误注释！',
                  cancelButtonProps: {title: '放弃'},
                  onOk: async () => {
                    const data = await downLoadCheckResultFile({parm: info.path})
                    const fileName = data.headers['content-disposition'].split('filename=')[1];
                    downloadByData(data.data, fileName);
                  },
                  onCancel: () => {
                    delCheckResultFile({parm: info.path})
                  }
                })
                return false
              } else {
                message.success('导入成功')
                emit('reloadProjects')
                closeModal()
              }
            } else { // 导入
              if (info[0].code == 404) {
                createWarningModal({title: '凭证导入前检测', content: info[0].result})
              } else {
                message.success('导入成功')
                emit('reloadProjects')
                closeModal()
              }
            }
            return false;
          })
          .catch((err) => {
            fileList.value = [];
            uploading.value = false;
            message.error('导入失败')
          })
      }
    })
  }
}
const handleClose = () => {
  fileList.value = [];
  closeModal()
}
const handleRemove = (file) => {
  const index = fileList.value.indexOf(file);
  const newFileList = fileList.value.slice();
  newFileList.splice(index, 1);
  fileList.value = newFileList;
};
const downLoad = () => {
  if (null == templateName.value) {
    createWarningModal({title: '凭证导入前检测', content: '请先选择要进行下载的凭证模板类型！'})
    return false;
  }
  let arr = templateName.value.split('--')
  let data = templateList.value[arr[2]]
  findAllAccvoucherFieldsApi({id: data.id, templateType: templateType.value}).then(res => {
    if (res.length > 0) {
      let name = data.templateName + (isShow.value ? '辅助项' + (arr[3] == '1' ? '名称' : '编码') : '') + '导入模板.xlsx'
      jsonToSheetXlsx({data: [], header: res, filename: name})
    }
  })
}
</script>
<style src="../../../../../assets/styles/global-import-open.less" lang="less" scoped="scoped"></style>
