<template>
  <div>
    <input
      ref="inputRef"
      type="file"
      v-show="false"
      accept=".xlsx, .xls"
      @change="handleInputClick"
    />
    <a-upload @change="handleInputClick" :file-list="fileList" :before-upload="()=>false">
      <a-button @click="clickQk()" style="background: #0096c7;color: #ffffff;border-radius: 5px;">
        请选择导入的文件
      </a-button>
    </a-upload>

    <!--    <div @click="handleUpload">-->
    <!--      <slot></slot>-->
    <!--    </div>-->
  </div>
</template>
<style>
.ant-upload,.ant-upload-select,.ant-upload-select-text {
  float: left;
  width: 160px;
}

.ant-upload-list-item{
  float: left;
  width: 100%;
}
</style>
<script setup lang="ts">
import {Upload as AUpload} from 'ant-design-vue'
import {defineComponent, onMounted, reactive, ref, unref} from 'vue';
import XLSX from 'xlsx';

import type { ExcelData } from './types';
import {useMessage} from "/@/hooks/web/useMessage";
const inputRef = ref<HTMLInputElement | null>(null);
const loadingRef = ref<Boolean>(false);
const  fileList=ref([])
// setTimeout(()=>{fileList.value=[]},3000)
/**
 * @description: 第一行作为头部
 */
function getHeaderRow(sheet: XLSX.WorkSheet) {
  if (!sheet || !sheet['!ref']) return [];
  const headers: string[] = [];
  // A3:B7=>{s:{c:0, r:2}, e:{c:1, r:6}}
  const range = XLSX.utils.decode_range(sheet['!ref']);

  const R = range.s.r;
  /* start in the first row */
  for (let C = range.s.c; C <= range.e.c; ++C) {
    /* walk every column in the range */
    const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })];
    /* find the cell in the first row */
    let hdr = 'UNKNOWN ' + C; // <-- replace with your desired default
    if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
    headers.push(hdr);
  }
  return headers;
}

/**
 * @description: 获得excel数据
 */
function getExcelData(workbook: XLSX.WorkBook) {
  const excelData: ExcelData[] = [];
  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    const header: string[] = getHeaderRow(worksheet);
    const results = XLSX.utils.sheet_to_json(worksheet);
    excelData.push({
      header,
      results,
      meta: {
        sheetName,
      },
    });
  }
  return excelData;
}
const emit=defineEmits(['success'])
/**
 * @description: 读取excel数据
 */
function readerData(rawFile: File) {
  loadingRef.value = true;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target && e.target.result;
        const workbook = XLSX.read(data, { type: 'array' });
        // console.log(workbook);
        /* DO SOMETHING WITH workbook HERE */
        const excelData = getExcelData(workbook);
        emit('success', excelData);
        resolve('');
      } catch (error) {
        reject(error);
        emit('error');
      } finally {
        loadingRef.value = false;
      }
    };
    reader.readAsArrayBuffer(rawFile);
  });
}

async function upload(rawFile: File) {
  const inputRefDom = unref(inputRef);
  if (inputRefDom) {
    // fix can't select the same excel
    inputRefDom.value = '';
  }
  await readerData(rawFile);
}

const {
  createErrorModal
} = useMessage()
/**
 * @description: 触发选择文件管理器
 */
function handleInputClick({file}) {
  fileList.value=[]

  const fileLast= file.name.split(".")[1]
  // console.log(file.name)
  // console.log(fileLast)
  if (fileLast=='xlsx' || fileLast=='xls' || fileLast=='XLSX' || fileLast=='XLS') {
    const status=file.status?file.status:200
    if(status=='removed'){
      return
    }else if(status==200){
      fileList.value.push(file)
      upload(file);
    }
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '文件格式错误',
      content: '导入文件扩展名格式必须是.xlsx或.xls，请核对后重新导入！'
    })
  }

  // const rawFile = files && files[0]; // only setting files[0]
  // if (!rawFile) return;
  // upload(file);
}
function clickQk(){
  // console.log(fileList)
  fileList.value=[]
  // debugger
}
</script>
