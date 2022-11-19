<template>
  <BasicModal
    width="900px"
    v-bind="$attrs"
    @ok="handleOk()"
    :showOkBtn="startBtn"
    @register="register"
    :loading="uploading"
    loading-tip="正在进行导入中请耐心等候..."
  >
    <template #title>
      <div style="display: flex;" class="vben-basic-title">
        <CloudUploadOutlined style="font-size: 50px;color: #0096c7;"/>
        <span style="line-height:50px;font-size: 30px;color: #0096c7;">&ensp;数据导入</span>
      </div>
    </template>
    <div class="nc-open-content">
      <div class="open-content-up" style="height: 400px;margin-left: 5%;width:90%;">
        <div class="open-content-up-one">
          <div>
            <img src="/@/assets/images/import.png" draggable="false" style="height:140px;margin: 10px 0"/>
          </div>
          <div>
            <label>导入内容：</label><span style="display: inline-flex;width: 60%; font-weight: bold;">科目期初余额</span>
            <Button size="small" style="color: #3eadbe;margin-left: 2%">查看帮助</Button>&emsp;<EllipsisOutlined style="cursor: pointer"/>
            <br/>
            <label>模板样式：</label><a-select style="width: 50%;margin-right: 10%;" :value="0">
            <a-select-option :value="0">系统标准模板</a-select-option>
          </a-select>
            <DownloadOutlined  style="font-size: 28px;margin: 0 2%" @click="exportExcelBofore"/><a @click="exportExcelBofore">模板下载</a>
          </div>
        </div>
<!--  @change="fileList = []" v-model:activeKey="excelValue" -->
        <Tabs type="card">
          <TabPane :key="1" tab="科目期初余额导入"></TabPane>
        </Tabs>
        <div style="margin-left: 40px;margin-top: 30px;">
          <a-upload
            :file-list="fileList"
            :remove="handleRemove"
            :before-upload="beforeUpload"
          >
            <a-button type="primary">
              请选择导入模板
            </a-button>
          </a-upload>
        </div>
        <br>
      </div>
    </div>

<!--    <div class="import-div">
        <div class="import-div-top">
          <div>
          </div>
          <div>
            <span>期初余额导入</span><br/><br/>
            <Badge status="success" />
            <span>科目期初余额导入</span>&emsp;&emsp;
          </div>
          <div>
            <Button size="small" style="color: #3eadbe">查看帮助</Button>&emsp;
            <EllipsisOutlined style="cursor: pointer" />
          </div>
        </div>
        <div class="import-div-bottom">
          <Tabs v-model:activeKey="activeKey" @change="fileList = []">
            <TabPane key="1" tab="科目期初余额导入"></TabPane>
          </Tabs>
        </div>
    </div>
    <div style="width: 100%;height: 60px;display: inline-flex; justify-content: center; line-height: 50px;" :style="{marginTop: '15px'}">
      <span>下载模板文件</span>&emsp;&emsp;<div class="download-div" @click="exportExcelBofore"><DownloadOutlined /></div>
    </div>
    <div style="margin: 0 5%">
      <a-upload
        :file-list="fileList"
        :remove="handleRemove"
        :before-upload="beforeUpload"
      >
        <a-button type="primary">
          请选择要导入的文件
        </a-button>
      </a-upload>
    </div>-->
    <template #footer>
      <div style="height: 35px">
        <div style="float: right">
          <a-button @click="handleClose">放弃</a-button>
          <a-button v-if="startBtn" @click="handleOk(true)" type="primary"
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
  import {EllipsisOutlined,DownloadOutlined,CloudUploadOutlined} from '@ant-design/icons-vue';
  import { message } from 'ant-design-vue';
  import {
    findAllByBendAndIyearOrderByCcode,
    importInitalBalance, importInitalBalanceFz,
  } from '/@/api/subjectInitialBalance/subjectInitialBalance';
  import { jsonToSheetXlsx } from '/@/components/Excel';

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

  const [register, { closeModal,setModalProps }] = useModalInner((data) => {
    databaseTrue.value = data.databaseTrue;
    database.value = data.database;
    iyear123.value = data.iyear;
    isLiji.value = data.isLiji
    setModalProps({minHeight: 360});
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
    debugger
    arr = val === '1' ? [] : arr;
    // dataExcel(arr);
  };
  //  When reading a file, save style/theme info to the .s field When writing a file, export style/theme info
  //批量导出Excel
  import XLSX from "xlsx-js-style";
  import {sheet_from_array_of_arrays, Workbook, writeExcel, defaultV} from "/@/utils/boozsoft/excel/excel2";
  import AButton from "/@/components/Button/src/BasicButton.vue";
  import {JsonTool} from "/@/api/task-api/tools/universal-tools";

  const exportExcelBofore = () => {
      exportExcel()
  }

  function exportExcel () {
    let hs =  ['科目编码', '科目名称', '本币借方金额', '本币贷方金额','数量','外币金额']
    if (isLiji)hs = ['科目编码', '科目名称', '本币借方金额', '本币贷方金额','数量','外币金额', '累计借方金额', '累计贷方金额','累计借方数量','累计贷方数量','累计外币借方','累计外币贷方']
    const sheet= [
      {
        tHeader: hs,
        table: [],
        keys: [],
        cellStyle: [
          {
            cell: 'A1',
            font: {
              color: { rgb: "FF0000" },
            },
          },
          {
            cell: 'B1',
            font: {
              color: { rgb: "000000" },
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
              color: { rgb: "FF0000" },
            },
          },
          {
            cell: 'E1',
            font: {
              color: { rgb: "FF0000" },
            },
          },
          {
            cell: 'F1',
            font: {
              color: { rgb: "FF0000" },
            },
          },{
            cell: 'G1',
            font: {
              color: { rgb: "FF0000" },
            },
          },{
            cell: 'H1',
            font: {
              color: { rgb: "FF0000" },
            },
          },{
            cell: 'I1',
            font: {
              color: { rgb: "FF0000" },
            },
          },{
            cell: 'J1',
            font: {
              color: { rgb: "FF0000" },
            },
          },{
            cell: 'K1',
            font: {
              color: { rgb: "FF0000" },
            },
          },{
            cell: 'L1',
            font: {
              color: { rgb: "FF0000" },
            },
          },
        ],
        colWidth: [20,30,15,15,10,15,15,15,10,10,15,15]
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
      writeExcel(wb, bookType, '科目期初余额导入模板')
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
    startBtn.value = false
    uploading.value = true
    let data = {params:formData,databasenum:databasenum,iyear:iyear123.value,mark: isLiji.value?'1':'0'}
    await useRouteApi(importInitalBalance,{schemaName:databasenum})(data)
      .then(async (info:any)=>{
        if(info[0].code==='401'){
          fileList.value = [];
          uploading.value = false;
          message.error(info[0].error);
          startBtn.value = true
          return false;
        }else{
          fileList.value = [];
          uploading.value = false;
          message.success('导入成功', 1, function () {
            emit('save');
            startBtn.value = true
            closeModal();
          });
        }
      })
    // emit('save');
    // closeModal();
  };

</script>
<style lang="less" scoped>
@import '/@/assets/styles/part-open.less';
.nc-open-content {
  :deep(.ant-select-selector) {
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
    font-weight: bold;
  }
  :deep(.ant-tabs-tab-active){
    border-top: 2px solid #0096c7;
  }

  :deep(.ant-upload-list):nth-of-type(2){
    width: 70%;
    float: right;
    display: inline-flex;
    .ant-upload-list-item-card-actions{
      right: -25px;
    }
  }
  .open-content-up-one{
    height: 200px;
    width: 100%;
    display: inline-flex;
    margin-top: 15px;

    >div:nth-of-type(1){
      width: 25%;
      height: 100%;
    }
    >div:nth-of-type(2){
      width: 75%;
      height: 100%;
      padding: 2% 2%;
      font-size: 14px;
      label {
        text-align: right;
        width: 110px;
        display: inline-block;
        padding: 20px 10px;
        font-weight: bold;
        color: #666666;
      }
    }
  }
}
</style>
