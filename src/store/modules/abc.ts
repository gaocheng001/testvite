import { defineStore } from 'pinia'
import { store } from '/@/store'
;
// import '../../../../lib/useFont'
//import {jsPDF} from "jspdf";
const jsPDF=null
import {
  hangPrintDefault,
  hangPrintDefaultPDF,
  printDefault,
  printDefaultPDF,
  tableStyle
} from './abc-print'



export const useAbcTemplateStore = defineStore({
  id: 'acctemplate',
  state: (): any => ({
    pdfmodel:null,
    hangPdfmodel:null,
  }),
  getters: {
    getPdfmodel(){
      return this.pdfmodel
    },
    getHangPdfmodel(){
      return this.hangPdfmodel
    }
  },
  actions:{
    async print(fun){


      this.pdfmodel=(await printDefault(fun)).output("datauristring")
    },
    async hangPrint(fun){
      this.hangPdfmodel=(await hangPrintDefault(fun)).output("datauristring")
    }
  }
})

// Need to be used outside the setup
export function useAbcTemplateStoreWidthOut() {
  return useAbcTemplateStore(store)
}
