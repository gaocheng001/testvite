<template>
  <BasicModal
    width="800px"
    v-bind="$attrs"
    @ok="handleOk()"
    :showOkBtn="startBtn"
    @register="register"
    :loading="uploading"
    loading-tip="正在进行导入中请耐心等候..."
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
            <span>导入内容：</span><span style="font-weight: bold;font-size: 20px;">盘点信息</span><br/><br/>
            <span>模板样式：</span>
            <a-select style="width: 50%;margin-right: 10%;" v-model:value="importmb">
              <a-select-option :value="0">存货模板</a-select-option>
              <a-select-option :value="1">条形码模板</a-select-option>
            </a-select>
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
              <a @click="exportExcelBofore()">&emsp;模板下载</a>
            </Tooltip>
          </div>
        </div>
      </div>
      <div class="import-div-bottom">
        <Tabs>
          <TabPane key="1" tab="全新添加导入">
            <ImpExcel v-if="isActiveImpExcel" @success="loadDataSuccess">
              <a-button class="m-3"> 导入Excel </a-button>
            </ImpExcel>
          </TabPane>

        </Tabs>
      </div>
    </div>


    <template #footer>
      <div style="height: 35px">
        <div style="float: right">
          <a-button @click="handleClose" :disabled="uploading">放弃</a-button>
          <a-button @click="handleOk(true)" type="primary" :loading="uploading" >开始导入
          </a-button>
        </div>
      </div>
    </template>
  </BasicModal>
</template>
<script setup="props, { content }" lang="ts">
import {nextTick, reactive, ref, unref} from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import {EllipsisOutlined,DownloadOutlined,CloudUploadOutlined} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import {
  findAllByBendAndIyearOrderByCcode,
  importInitalBalance, importInitalBalanceFz,
} from '/@/api/subjectInitialBalance/subjectInitialBalance';
import { jsonToSheetXlsx } from '/@/components/Excel';
import { ImpExcel } from '/@/components/Excel'

import { useUserStoreWidthOut } from '/@/store/modules/user';
import {
  Select as ASelect,
  Input as AInput,
  Upload as AUpload,Badge,Button,Tabs,Radio
} from 'ant-design-vue';
const ASelectOption = ASelect.Option;
const AInputSearch = AInput.Search;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {getCurrentAccountName} from "/@/api/task-api/tast-bus-api";
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
const activeKey = ref('1');
const iyear123 = ref('');
// 数据库模式名称
const database = ref('');
const databaseTrue = ref('');
const emit=defineEmits(['register']);
const uploading=ref(false);
const startBtn=ref(true);
const isLiji = ref(false);
const importmb = ref(0);
const {
  createErrorModal
} = useMessage()
const year = ref('2022');
const pdCode = ref('');
const [register, { closeModal,setModalProps }] = useModalInner((data) => {
  console.log(data)
  databaseTrue.value = data.databaseTrue;
  database.value = data.database;
  iyear123.value = data.iyear;
  isLiji.value = data.isLiji
  year.value = data.year;
  pdCode.value = data.pdCode;

  isActiveImpExcel.value=false
  nextTick(()=>{
    isActiveImpExcel.value=true
  })
  setModalProps({minHeight: 360});
});
const loadingRef = ref(false);
const excelValue:any = ref(1)
const excelResultInfo:any = reactive({
  excellistInfo:[],
  excellistLength:'',
  successInfo:'',
  errorInfo:''
})
/******************* 弹框加载中 **************************/
import { Loading } from '/@/components/Loading';
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


//批量导出Excel
import XLSX from "xlsx-js-style";
import {sheet_from_array_of_arrays, Workbook, writeExcel, defaultV} from "/@/utils/boozsoft/excel/excel2";
import AButton from "/@/components/Button/src/BasicButton.vue";
import {JsonTool} from "/@/api/task-api/tools/universal-tools";
import {useMessage} from "/@/hooks/web/useMessage";
import {
  improtExcel,improtExcel2
} from '/@/api/record/stock/stock_taking';
const exportExcelBofore = () => {
  exportExcel()
}

function exportExcel () {
  let hs = ['存货编码', '计量单位', '数量','批次','生效日期','失效日期']
  let hs1 = ['条形码', '数量','批次','生效日期','失效日期']
  const sheet= [
    {
      tHeader: importmb.value == 0?hs:hs1,
      table: [],
      keys: [],
      cellStyle: importmb.value == 0?
        [
          {
            cell: 'A1',
            font: {
              color: { rgb: "FF0000" },
            },
          },
          {
            cell: 'B1',
            font: {
              color: { rgb: "FF0000" },
            },
          },
          {
            cell: 'C1',
            font: {
              color: { rgb: "FF0000" },
            },
          },
          {
            cell: 'D1',
            font: {
              color: { rgb: "000000" },
            },
          },
          {
            cell: 'E1',
            font: {
              color: { rgb: "000000" },
            },
          },
          {
            cell: 'F1',
            font: {
              color: { rgb: "000000" },
            },
          },
        ]:[
          {
            cell: 'A1',
            font: {
              color: { rgb: "FF0000" },
            },
          },
          {
            cell: 'B1',
            font: {
              color: { rgb: "FF0000" },
            },
          },
          {
            cell: 'C1',
            font: {
              color: { rgb: "000000" },
            },
          },
          {
            cell: 'D1',
            font: {
              color: { rgb: "000000" },
            },
          },
          {
            cell: 'E1',
            font: {
              color: { rgb: "000000" },
            },
          },
        ],
      colWidth: importmb.value == 0?[20,20,15,20,20,20]:[20,20,20,20,20]
    }
  ]

  // 处理数据前
  if (!sheet || sheet.length <= 0) {
    this.onError('Table data cannot be empty')
    return
  }
  const wb = Workbook()
  sheet.forEach((item, index) => {
    let {
      // 标题
      title,
      // 表头
      tHeader,
      // 多级表头
      multiHeader,
      // 表格数据
      table,
      // 表格底部数据
      foot,
      // 合并项
      merges,
      // 数据键值
      keys,
      // 列宽
      colWidth,
      // 表名
      sheetName,
      // 全局样式
      globalStyle,
      // 单元格样式
      cellStyle
    } = item
    sheetName = sheetName || defaultV.sheetName
    // 默认全局样式覆盖
    const dgStyle = defaultV.globalStyle
    if (globalStyle) {
      Object.keys(dgStyle).forEach(key => {
        globalStyle[key] = {...dgStyle[key], ...globalStyle[key]}
      })
    } else {
      globalStyle = dgStyle
    }
    //表头对应字段
    let data = table.map(v => keys.map(j => v[j]))
    // 多级表头
    if (multiHeader) {
      // 倒序循环
      for (let i = multiHeader.length - 1; i >= 0; i--) {
        data.unshift(multiHeader[i]);
      }
    }
    tHeader && data.unshift(tHeader);
    title && data.unshift(title);
    const ws = sheet_from_array_of_arrays(data);
    if (merges && merges.length > 0) {
      if (!ws['!merges']) ws['!merges'] = [];
      merges.forEach(merge => {
        ws['!merges'].push(XLSX.utils.decode_range(merge))
      })
    }

    ws['!cols'] = colWidth.map(i => {
      return {wch: i}
    })

    // 添加工作表
    wb.SheetNames.push(sheetName);
    wb.Sheets[sheetName] = ws;
    let dataInfo = wb.Sheets[wb.SheetNames[index]];


    // 单个样式
    (function () {
      if (!cellStyle || cellStyle.length <= 0) {
        return
      }
      cellStyle.forEach(s => {
        const {border, font, alignment, fill} = s;
        dataInfo[s.cell].s = {
          border: border === {} ? border : border || globalStyle.border,
          font: font || globalStyle.font,
          alignment: alignment || globalStyle.alignment,
          fill: fill || globalStyle.fill
        }
      });
    })();
  })
  // 类型默认为xlsx
  const bookType = 'xlsx'
  writeExcel(wb, bookType, importmb.value == 0?'存货编码导入模板':'条形码码导入模板')
}

const handleClose = () => {
  fileList.value = [];
  closeModal()
}

const handleOk = async () => {
  uploading.value = true
  if(importmb.value == 0) {
    await useRouteApi(improtExcel, {schemaName: databaseTrue})({
      list: JSON.stringify(unref(list)),
      year: year.value,
      pdCode: pdCode.value
    }).then(v=>{
      message.success("导入成功！")
      uploading.value = false
      emit('save');
      closeModal();
    })
  }else{
    await useRouteApi(improtExcel2, {schemaName: databaseTrue})({
      list: unref(list),
      year: year.value,
      pdCode: pdCode.value
    }).then(v=>{
      message.success("导入成功！")
      uploading.value = false
      emit('save');
      closeModal();
    })
  }
};
const isActiveImpExcel=ref(false)
const list:any = ref([])
function loadDataSuccess(excelDataList) {
  if(importmb.value == 0) {
    list.value = []
    const items = excelDataList[0].results
    if (items.length>0) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const item1: any = {}
        item1.stockNum = item['存货编码']+""
        item1.unitName = item['计量单位']+""
        item1.num = item['数量']+""
        item1.batchId = item['批次']+""
        item1.dpdate = item['生效日期']+""
        item1.dvdate = item['失效日期']+""
        list.value.push(item1)
      }
      for (let i=0; i<list.value.length; i++){
        const item1 = list.value[i];
        //判断导入编码是否为空
        const deptCode = item1.stockNum
        if (deptCode==null || deptCode==''){
          createErrorModal({
            iconType: 'warning',
            title: '提示',
            content: '第'+(i+1)+'行存货编码为空,不能进行信息导入'
          })
          list.value = []
          return false
        }
        //判断导入名称是否为空
        const deptName = item1.unitName
        if (deptName==null || deptName==''){
          createErrorModal({
            iconType: 'warning',
            title: '提示',
            content: '第'+(i+1)+'行计量单位为空,不能进行信息导入'
          })
          list.value = []
          return false
        }

        const deptName1 = item1.num
        if (deptName1==null || deptName1==''){
          createErrorModal({
            iconType: 'warning',
            title: '提示',
            content: '第'+(i+1)+'行数量为空,不能进行信息导入'
          })
          list.value = []
          return false
        }
/*        for (let j=0; j<list.value.length; j++) {
          const item2 = list.value[j];
          if (i!=j){
            if (item1.unitName==item2.unitName){
              createErrorModal({
                iconType: 'warning',
                title: '提示',
                content: '第'+(i+1)+'行计量单位组名称与第'+(j+1)+'行的信息重复，请修改后重新导入！'
              })
              list.value = []
              return false
            }
          }
        }*/
      }
    } else {
      createErrorModal({
        iconType: 'warning',
        title: '提示',
        content: '未发现导入数据，请检查数据是否在sheet1页签中'
      })
    }
  }else{
    list.value = []
    const items = excelDataList[0].results
    if (items.length>0) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const item1: any = {}
        item1.stockBarcode = item['条形码']+""
        item1.num = item['数量']+""
        item1.batchId = item['批次']+""
        item1.dpdate = item['生效日期']+""
        item1.dvdate = item['失效日期']+""
        list.value.push(item1)
      }
      for (let i=0; i<list.value.length; i++){
        const item1 = list.value[i];
        const deptCode = item1.stockBarcode
        if (deptCode==null || deptCode==''){
          createErrorModal({
            iconType: 'warning',
            title: '提示',
            content: '第'+(i+1)+'行条形码为空,不能进行信息导入'
          })
          list.value = []
          return false
        }
        const deptName = item1.num
        if (deptName==null || deptName==''){
          createErrorModal({
            iconType: 'warning',
            title: '提示',
            content: '第'+(i+1)+'行数量为空,不能进行信息导入'
          })
          list.value = []
          return false
        }

        for (let j=0; j<list.value.length; j++) {
          const item2 = list.value[j];
          if (i!=j){
            if (item1.stockBarcode==item2.stockBarcode){
              createErrorModal({
                iconType: 'warning',
                title: '提示',
                content: '第'+i+'行条形码与第'+j+'行的信息重复，请修改后重新导入！'
              })
              list.value = []
              return false
            }
          }
        }
      }
    } else {
      createErrorModal({
        iconType: 'warning',
        title: '提示',
        content: '未发现导入数据，请检查数据是否在sheet1页签中'
      })
    }
  }
}
//导入时判断
let msg=''
function checkExcel(){
/*  msg=''
  if (list.value.length>0) {
    for (let i = 0; i < list.value.length; i++) {
      const item = list.value[i];
      for (let j = 0; j < deptList.value.length; j++) {
        const dept = deptList.value[j];
        if (dept.unitName == item.unitName) {
          msg = '第'+(i+1)+'行计量单位组名称重复,不能进行信息导入'
          return msg
        }
      }
    }
    return msg
  } else {
    msg = '请选择您需要导入的文件!'
    return msg
  }*/
}
</script>

<style src="../../../../../assets/styles/global-import-open3.less" lang="less"></style>
<style lang="less" scoped>
:deep(.ant-select-selector) {
  border: none !important;
  border-bottom: 1px solid #bdb9b9 !important;
}
</style>
