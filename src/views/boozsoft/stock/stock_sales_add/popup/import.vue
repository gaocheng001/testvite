<template>
  <BasicModal
    width="700px"
    v-bind="$attrs"
    title="资产引入"
    :canFullscreen="false"
    @register="register"
  >
    <div class="import-centent-div" style="margin: 2% 5% 0%">
      <div class="import-info-div">
        <div class="import-div-top">
          <div>
          </div>
          <div>
            <span>资产引入</span><br/><br/>
            <Badge status="success"/>
            <span>盘点资产引入</span>
          </div>
          <div>
            <Button size="small" style="color: #3eadbe">查看帮助</Button>&emsp;
            <EllipsisOutlined style="cursor: pointer"/>
          </div>
        </div>
        <div class="import-div-bottom">
          <Tabs @change="fileList = []">
            <TabPane key="1" tab="资产引入">
            </TabPane>
          </Tabs>
        </div>
      </div>

      <div class="import-download-div"
           :style="{marginTop: '40px',textAlign: 'right'}">
        <span>下载模板文件</span>&emsp;&emsp;
        <div class="download-div" @click="downLoad()">
          <DownloadOutlined/>
        </div>
      </div>
      <div style="margin: 3% 5%">
        <ImpExcel v-if="isActiveImpExcel" @success="loadDataSuccess">
          <a-button class="m-3"> 请选择引入的文件</a-button>
        </ImpExcel>
      </div>
    </div>
    <template #footer>
      <div style="height: 35px">
        <div style="float: right">
          <Button @click="handleClose">放弃</Button>
          <Button @click="handleOk(true)" type="primary" :loading="uploading"
                  :disabled="list.length == 0">
            {{ uploading != 0 ? '' : '开始引入' }}
          </Button>
        </div>
      </div>
    </template>
  </BasicModal>
</template>
<script setup lang="ts">
import {nextTick, onMounted, ref, unref} from 'vue'
import {BasicModal, useModalInner} from '/@/components/Modal'
import {message} from 'ant-design-vue'
import {jsonToSheetXlsx} from '/@/components/Excel';
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
import {ImpExcel, ExcelData} from '/@/components/Excel';

const SelectOption = Select.Option;
const AInputSearch = AInput.Search;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
// 上传文件
const uploading = ref(false)
const fileList = ref([])

const emit = defineEmits(['register', 'save'])
const pageSchemaName = ref('')
const isActiveImpExcel = ref(false)
const queryParameter = ref({})

const [register, {closeModal}] = useModalInner((data) => {
  pageSchemaName.value = data.schemaName
  queryParameter.value = data.query
  isActiveImpExcel.value = false
  nextTick(() => {
    isActiveImpExcel.value = true
  })
})

onMounted(async () => {
})

import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {findFaAssetListByCondition} from "/@/api/fa/fa-pandian";
import {hasBlank} from "/@/api/task-api/tast-bus-api";

const list: any = ref([])

function loadDataSuccess(excelDataList) {
  list.value = []
  const items = excelDataList[0].results
  if (items.length > 0) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const item1: any = {}
      item1.assetsCode = item['资产编码']
      item1.realityAmount = item['实际数量']
      list.value.push(item1)
    }
    for (let i = 0; i < list.value.length; i++) {
      const item1 = list.value[i];
      //判断导入编码是否为空
      if (hasBlank(item1.assetsCode)) {
        createErrorModal({
          iconType: 'warning',
          title: '提示',
          content: '第' + (i + 1) + '行资产卡片编码为空,请完善数据后再进行信息引入'
        })
        list.value = []
        return false
      }
      if (hasBlank(item1.realityAmount)) {
        createErrorModal({
          iconType: 'warning',
          title: '提示',
          content: '第' + (i + 1) + '行资产卡片实际数量为空,请完善数据后再进行信息引入'
        })
        list.value = []
        return false
      }
    }
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '未发现引入数据，请检查数据是否在sheet1页签中'
    })
  }
}

let msg = ''

async function checkExcel() {
  msg = ''
  if (list.value.length > 0) {
    // 拿到数据库
    let dbList = await useRouteApi(findFaAssetListByCondition, {schemaName: pageSchemaName.value})(queryParameter.value)
    // 获取所以满族条件的
    if (null == dbList || dbList.length == 0) {
      msg = '请检查该管理代码下是否存在资产卡片数据!'
      return false
    }
    let codes = list.value.map(it => it.assetsCode) // 所以引入code
    let exists = dbList.filter(it => codes.indexOf(it.assetsCode) != -1) // 数据库能导入的卡片信息
    if (exists.length > 0) {
      for (let j = 0; j < exists.length; j++) {
        exists[j].realityAmount = list.value[list.value.findIndex(it => it.assetsCode == exists[j].assetsCode)].realityAmount
      }
      list.value = exists;
    } else {
      msg = '请检查引入的资源编码系统是否存在!'
      return false
    }
    return true
  } else {
    msg = '请选择您需要引入的文件!'
    return false
  }
}

const downLoad = () => {
  jsonToSheetXlsx({data: [], header: ['资产编码', '实际数量'], filename: '资产引入模板.xlsx'})
}

const handleOk = async (flag) => {
  await checkExcel()
  if (msg == '') {
    emit('save', unref(list))
    closeModal()
    return true
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '导入失败',
      content: msg
    })
    return false
  }
}
const handleClose = () => {
  fileList.value = [];
  closeModal()
}
</script>
<style lang="less" scoped="scoped" src="../../../../../assets/styles/global-import-open.less">

</style>
