<template>
  <div>
    <PdfViewer ref="pdfViewerRef" v-model="pdfmodel"></PdfViewer>
  </div>
</template>
<script setup>
import PdfViewer from '/@/components/BoozsoftPdf/HelloPdf.vue'
import {tableStyle} from "../../../store/modules/abc-print";
import {usePrint} from "./print";
import {ref} from 'vue'
const pdfViewerRef=ref()
const pdfmodel = ref({})
const props = defineProps(['params', 'fun'])
async function printData() {
  const printParams=usePrint()
  await printParams.print(props.params, props.fun)
  // pdfmodel.value = printParams.pdfmodel.data
  // pdfViewerRef.value.startPrint()
}

setTimeout(()=>{
  printData()
},2000)
</script>
