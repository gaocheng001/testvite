<template>
  <BasicModal
    width="900px"
    v-bind="$attrs"
    title="科目辅助期初余额导入"
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
            <label>导入内容：</label><span style="display: inline-flex;width: 60%; font-weight: bold;">辅助项科目期初余额</span>
            <Button size="small" style="color: #3eadbe;margin-left: 2%">查看帮助</Button>&emsp;<EllipsisOutlined style="cursor: pointer"/>
            <br/>
            <label>模板样式：</label><a-select style="width: 50%;margin-right: 10%;" :value="0">
            <a-select-option :value="0">系统标准模板</a-select-option>
          </a-select>
            <DownloadOutlined  style="font-size: 28px;margin: 0 2%" @click="exportExcel()"/><a @click="exportExcel()">模板下载</a>
          </div>
        </div>
        <!--  @change="fileList = []" v-model:activeKey="excelValue" -->
        <Tabs type="card">
          <TabPane :key="1" tab="辅助项科目期初余额导入">
            <h2>数据导入格式</h2>
            <RadioGroup v-model:value="templateFormat">
              <Radio style="display: block;height: 30px;" value="0">
                辅助核算项按编码导入，如：部门、个人、客户、供应商、项目等需要填写编码
              </Radio>
              <Radio style="display: block;height: 30px;" value="1">
                辅助核算项按名称导入，如：部门、个人、客户、供应商、项目等需要填写名称
              </Radio>
            </RadioGroup>
          </TabPane>
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
          <Badge status="success"/>
          <span>辅助项科目期初余额导入</span>
        </div>
        <div>
          <Button size="small" style="color: #3eadbe">查看帮助</Button>&emsp;
          <EllipsisOutlined style="cursor: pointer"/>
        </div>
      </div>
      <div class="import-div-bottom">
        <Tabs v-model:activeKey="activeKey" @change="fileList = []">
          <TabPane key="1" tab="辅助项科目期初余额导入">
            <h2>数据导入格式</h2>
            <RadioGroup v-model:value="templateFormat">
              <Radio style="display: block;height: 30px;" value="0">
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

    <div
      style="width: 100%;height: 60px;display: inline-flex; justify-content: center; line-height: 50px;"
      :style="{marginTop: '110px'}">
      <span>下载模板文件</span>&emsp;&emsp;<div class="download-div" @click="exportExcel()">
      <DownloadOutlined/>
    </div>
    </div>
    <div style="margin: 2% 5%">
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
          <a-button @click="handleOk(true)" type="primary" v-if="startBtn"
                    :disabled="fileList.length == 0 || fileList.length> 1">开始导入
          </a-button>
        </div>
      </div>
    </template>
  </BasicModal>
</template>
<script setup="props, { content }" lang="ts">
import {ref} from 'vue';
import {BasicModal, useModalInner} from '/@/components/Modal';
import {message} from 'ant-design-vue';
import {
  findAllByBendAndIyearOrderByCcode,
  importInitalBalanceFz,
} from '/@/api/subjectInitialBalance/subjectInitialBalance';

import {useUserStoreWidthOut} from '/@/store/modules/user';
import {
  Select as ASelect,
  Input as AInput,
  Upload as AUpload, Badge, Button, Tabs, Radio
} from 'ant-design-vue';

const ASelectOption = ASelect.Option;
const AInputSearch = AInput.Search;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
import {getCurrentAccountName} from "/@/api/task-api/tast-bus-api";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {EllipsisOutlined, DownloadOutlined,CloudUploadOutlined} from '@ant-design/icons-vue';
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
const templateFormat = ref('1');
const activeKey = ref('1');
const emit = defineEmits(['register']);
const uploading = ref(false);
const startBtn = ref(true);
const isLiji = ref(false);
const [register, {closeModal, setModalProps}] = useModalInner((data) => {
  databaseTrue.value = data.databaseTrue;
  database.value = data.database;
  iyear123.value = data.iyear;
  isLiji.value = data.isLiji;
  setModalProps({minHeight: 440});
});

//  When reading a file, save style/theme info to the .s field When writing a file, export style/theme info
//批量导出Excel
import XLSX from "xlsx-js-style";
import {
  sheet_from_array_of_arrays,
  Workbook,
  writeExcel,
  defaultV
} from "/@/utils/boozsoft/excel/excel2";
import {findAllFuzhuHesuanList} from "/@/api/record/system/fuzhu-hesuan";
import {JsonTool} from "/@/api/task-api/tools/universal-tools";

async function exportExcel() {
  // 获取当前账套所有带辅助核算的科目
  const {titles, tables} = await generateTitle()
  let colWidths = [15, 20]
  if (titles.length > 2) {
    let leng = titles.length - 2
    for (let i = 0; i < leng; i++) {
      colWidths.push(12)
    }
  }
  const sheet = [
    {
      tHeader: titles,
      table: tables,
      keys: ['ccode', 'ccodeName'],
      cellStyle: [
        {
          cell: 'A1',
          font: {
            color: {rgb: "FF0000"},
          },
        },
        {
          cell: 'B1',
          font: {
            color: {rgb: "000000"},
          },
        },
        {
          cell: 'C1',
          font: {
            color: {rgb: "FF0000"},
          },
        },
        {
          cell: 'D1',
          font: {
            color: {rgb: "FF0000"},
          },
        },
        {
          cell: 'E1',
          font: {
            color: {rgb: "FF0000"},
          },
        },
        {
          cell: 'F1',
          font: {
            color: {rgb: "FF0000"},
          },
        },
        {
          cell: 'G1',
          font: {
            color: {rgb: "FF0000"},
          },
        },
        {
          cell: 'H1',
          font: {
            color: {rgb: "FF0000"},
          },
        },
        {
          cell: 'I1',
          font: {
            color: {rgb: "FF0000"},
          },
        },
        {
          cell: 'J1',
          font: {
            color: {rgb: "FF0000"},
          },
        },
        {
          cell: 'K1',
          font: {
            color: {rgb: "FF0000"},
          },
        },
      ],
      colWidth: colWidths
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
  writeExcel(wb, bookType, '科目辅助期初余额导入模板')
}

async function generateTitle() {
  const lastCodeList = await useRouteApi(findAllByBendAndIyearOrderByCcode, {schemaName: databaseTrue.value})({bend: '1', iyear: iyear123.value});
  const otherFzList = await useRouteApi(findAllFuzhuHesuanList, {schemaName: databaseTrue.value})({});
  let arr = [];
  let titles = ['科目编码', '科目名称', '本币借方金额', '本币贷方金额', '数量', '外币金额']
  if (isLiji)titles = ['科目编码', '科目名称', '本币借方金额', '本币贷方金额','数量','外币金额', '累计借方金额', '累计贷方金额','累计借方数量','累计贷方数量','累计外币借方','累计外币贷方']
  let threeItems = 0
  let deptIndex = 0
  let personIndex = 0
  let cusIndex = 0
  let supIndex = 0
  let itemIndex = 0
  let cdfines = {}

  for (let i = 0; i < lastCodeList.length; i++) {
    if (threeItems == 1) { //存在个人、客户与供应商
      titles.splice(2, 0, '凭证日期', '凭证号', '凭证摘要')
      threeItems += 1;
    }
    let flag = true;
    if ("1" == lastCodeList[i].bperson) {
      flag = false;
      threeItems += 1;
      personIndex += 1;
    }
    if ("1" == lastCodeList[i].bcus) {
      flag = false;
      threeItems += 1;
      cusIndex += 1;
    }
    if ("1" == lastCodeList[i].bsup) {
      flag = false;
      threeItems += 1;
      supIndex += 1;
    }
    if ("1" == lastCodeList[i].bdept) {
      flag = false;
      deptIndex += 1;
    }
    if ("1" == lastCodeList[i].bitem) {
      flag = false;
      itemIndex += 1;
    }

    if ("1" == lastCodeList[i].cdfine1) {
      flag = false;
      cdfines['cdfine1'] = 1;
    }
    if ("1" == lastCodeList[i].cdfine2) {
      flag = false;
      cdfines['cdfine2'] = 1;
    }
    if ("1" == lastCodeList[i].cdfine3) {
      flag = false;
      cdfines['cdfine3'] = 1;
    }
    if ("1" == lastCodeList[i].cdfine4) {
      flag = false;
      cdfines['cdfine4'] = 1;
    }
    if ("1" == lastCodeList[i].cdfine5) {
      flag = false;
      cdfines['cdfine5'] = 1;
    }
    if ("1" == lastCodeList[i].cdfine6) {
      flag = false;
      cdfines['cdfine6'] = 1;
    }
    if ("1" == lastCodeList[i].cdfine7) {
      flag = false;
      cdfines['cdfine7'] = 1;
    }
    if ("1" == lastCodeList[i].cdfine8) {
      flag = false;
      cdfines['cdfine8'] = 1;
    }
    if ("1" == lastCodeList[i].cdfine9) {
      flag = false;
      cdfines['cdfine9'] = 1;
    }
    if ("1" == lastCodeList[i].cdfine10) {
      flag = false;
      cdfines['cdfine10'] = 1;
    }
    if ("1" == lastCodeList[i].cdfine11) {
      flag = false;
      cdfines['cdfine11'] = 1;
    }
    if ("1" == lastCodeList[i].cdfine12) {
      flag = false;
      cdfines['cdfine12'] = 1;
    }
    if ("1" == lastCodeList[i].cdfine13) {
      flag = false;
      cdfines['cdfine13'] = 1;
    }
    if ("1" == lastCodeList[i].cdfine14) {
      flag = false;
      cdfines['cdfine14'] = 1;
    }
    if ("1" == lastCodeList[i].cdfine15) {
      flag = false;
      cdfines['cdfine15'] = 1;
    }
    if ("1" == lastCodeList[i].cdfine16) {
      flag = false;
      cdfines['cdfine16'] = 1;
    }
    if ("1" == lastCodeList[i].cdfine17) {
      flag = false;
      cdfines['cdfine17'] = 1;
    }
    if ("1" == lastCodeList[i].cdfine18) {
      flag = false;
      cdfines['cdfine18'] = 1;
    }
    if ("1" == lastCodeList[i].cdfine19) {
      flag = false;
      cdfines['cdfine19'] = 1;
    }
    if ("1" == lastCodeList[i].cdfine20) {
      flag = false;
      cdfines['cdfine20'] = 1;
    }
    if ("1" == lastCodeList[i].cdfine21) {
      flag = false;
      cdfines['cdfine21'] = 1;
    }
    if ("1" == lastCodeList[i].cdfine22) {
      flag = false;
      cdfines['cdfine22'] = 1;
    }
    if ("1" == lastCodeList[i].cdfine23) {
      flag = false;
      cdfines['cdfine23'] = 1;
    }
    if ("1" == lastCodeList[i].cdfine24) {
      flag = false;
      cdfines['cdfine24'] = 1;
    }
    if ("1" == lastCodeList[i].cdfine25) {
      flag = false;
      cdfines['cdfine25'] = 1;
    }
    if ("1" == lastCodeList[i].cdfine26) {
      flag = false;
      cdfines['cdfine26'] = 1;
    }
    if ("1" == lastCodeList[i].cdfine27) {
      flag = false;
      cdfines['cdfine27'] = 1;
    }
    if ("1" == lastCodeList[i].cdfine28) {
      flag = false;
      cdfines['cdfine28'] = 1;
    }
    if ("1" == lastCodeList[i].cdfine29) {
      flag = false;
      cdfines['cdfine29'] = 1;
    }
    if ("1" == lastCodeList[i].cdfine30) {
      flag = false;
      cdfines['cdfine30'] = 1;
    }
    if (!flag && "1" == lastCodeList[i].flag) {
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

  if (deptIndex > 0) titles.push(`部门${getName()}`)
  if (personIndex > 0) titles.push(`个人${getName()}`)
  if (cusIndex > 0) titles.push(`客户${getName()}`)
  if (supIndex > 0) titles.push(`供应商${getName()}`)
  if (itemIndex > 0) {
    titles.push(`项目大类编码`);
    titles.push(`项目${getName()}`)
  }

  if (null != cdfines['cdfine1']) titles.push(`${customizationTitle('1', otherFzList)}`)
  if (null != cdfines['cdfine2']) titles.push(`${customizationTitle('2', otherFzList)}`)
  if (null != cdfines['cdfine2']) titles.push(`${customizationTitle('2', otherFzList)}`)
  if (null != cdfines['cdfine3']) titles.push(`${customizationTitle('3', otherFzList)}`)
  if (null != cdfines['cdfine4']) titles.push(`${customizationTitle('4', otherFzList)}`)
  if (null != cdfines['cdfine5']) titles.push(`${customizationTitle('5', otherFzList)}`)
  if (null != cdfines['cdfine6']) titles.push(`${customizationTitle('6', otherFzList)}`)
  if (null != cdfines['cdfine7']) titles.push(`${customizationTitle('7', otherFzList)}`)
  if (null != cdfines['cdfine8']) titles.push(`${customizationTitle('8', otherFzList)}`)
  if (null != cdfines['cdfine9']) titles.push(`${customizationTitle('9', otherFzList)}`)
  if (null != cdfines['cdfine10']) titles.push(`${customizationTitle('10', otherFzList)}`)
  if (null != cdfines['cdfine11']) titles.push(`${customizationTitle('11', otherFzList)}`)
  if (null != cdfines['cdfine12']) titles.push(`${customizationTitle('12', otherFzList)}`)
  if (null != cdfines['cdfine12']) titles.push(`${customizationTitle('12', otherFzList)}`)
  if (null != cdfines['cdfine13']) titles.push(`${customizationTitle('13', otherFzList)}`)
  if (null != cdfines['cdfine14']) titles.push(`${customizationTitle('14', otherFzList)}`)
  if (null != cdfines['cdfine15']) titles.push(`${customizationTitle('15', otherFzList)}`)
  if (null != cdfines['cdfine16']) titles.push(`${customizationTitle('16', otherFzList)}`)
  if (null != cdfines['cdfine17']) titles.push(`${customizationTitle('17', otherFzList)}`)
  if (null != cdfines['cdfine18']) titles.push(`${customizationTitle('18', otherFzList)}`)
  if (null != cdfines['cdfine19']) titles.push(`${customizationTitle('19', otherFzList)}`)
  if (null != cdfines['cdfine20']) titles.push(`${customizationTitle('20', otherFzList)}`)
  if (null != cdfines['cdfine20']) titles.push(`${customizationTitle('20', otherFzList)}`)
  if (null != cdfines['cdfine21']) titles.push(`${customizationTitle('21', otherFzList)}`)
  if (null != cdfines['cdfine22']) titles.push(`${customizationTitle('22', otherFzList)}`)
  if (null != cdfines['cdfine22']) titles.push(`${customizationTitle('22', otherFzList)}`)
  if (null != cdfines['cdfine23']) titles.push(`${customizationTitle('23', otherFzList)}`)
  if (null != cdfines['cdfine24']) titles.push(`${customizationTitle('24', otherFzList)}`)
  if (null != cdfines['cdfine25']) titles.push(`${customizationTitle('25', otherFzList)}`)
  if (null != cdfines['cdfine26']) titles.push(`${customizationTitle('26', otherFzList)}`)
  if (null != cdfines['cdfine27']) titles.push(`${customizationTitle('27', otherFzList)}`)
  if (null != cdfines['cdfine28']) titles.push(`${customizationTitle('28', otherFzList)}`)
  if (null != cdfines['cdfine29']) titles.push(`${customizationTitle('29', otherFzList)}`)
  if (null != cdfines['cdfine30']) titles.push(`${customizationTitle('30', otherFzList)}`)

  return {codeList: lastCodeList, titles: titles, tables: arr}
}

function customizationTitle(index, otherFzList) {
  return otherFzList.filter(item => item.cdfine == index)[0].cname + (templateFormat.value == '1' ? '名称' : '编码')
}

function getName() {
  return templateFormat.value == '1' ? '名称' : '编码'
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
  startBtn.value = false
  uploading.value = true
  const databasenum = database.value + '-' + iyear123.value

  const formData = new FormData();
  fileList.value.forEach((file) => {
    formData.append('file', file as any);
  });
  const {titles} = await generateTitle()

  await useRouteApi(importInitalBalanceFz, {schemaName: databasenum})({
    params: formData,
    databasenum: databasenum,
    iyear: iyear123.value,
    mark: templateFormat.value,
    titlesJson: JsonTool.json(titles)
  })
    .then(async (info: any) => {
      if (info[0].code === '401') {
        fileList.value = [];
        uploading.value = false;
        message.error(info[0].error);
        startBtn.value = true
        return false;
      } else {
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
<!--<style lang="less" scoped>
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

.import-div {
  width: 90%;
  margin-left: 5%;
  height: 180px;
  border: 1px #f0f0f0 solid;
  border-radius: 4px;

  .import-div-top {
    width: 100%;
    height: 70%;
    display: inline-flex;
    justify-content: space-between;

    > div:nth-of-type(1) {
      width: 25%;
      height: auto;
      background-image: url(/nc/img/bg/download.png);
      background-size: 80% 80%;
      background-repeat: no-repeat;
      background-position: 12px;
    }

    > div:nth-of-type(2) {
      width: 55%;
      height: auto;
      padding: 18px 2%;

      > span {
        color: black;
        font-size: 13px;
      }

      > span:nth-of-type(1) {
        font-size: 20px;
      }
    }

    > div:nth-of-type(3) {
      width: 20%;
      height: auto;
      padding: 3% 0;
    }
  }

  .import-div-bottom {
    margin-left: 2%;
    width: 96%;
    height: 30%;
    border-top: 2px solid #f0f0f0;
  }

}

.download-div {
  width: 50px;
  height: 50px;
  display: block;
  background-color: #6a6a6a;
  border-radius: 50%;
  padding: 2px 10px;
  font-size: 30px;
  color: white;
  cursor: pointer;
}

.download-div:hover {
  color: #0096c7;
  background-color: #b4b4b4;
}
</style>-->
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
