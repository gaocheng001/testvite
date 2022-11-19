import { printDefault } from './abc-print';

export function usePrint() {
  const pdfmodel = {
    data: null,
  };

  function print(params, fun) {
    pdfmodel.data = printDefault(params, fun).output('dataurlnewwindow');
  }

  return {
    print,
    pdfmodel,
  };
}

import print from './print.vue';
import { createApp } from 'vue';

export function useNewPrint(params, fun) {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  createApp(print, { params, fun }).mount(dom);
}

export function savePdf(name, params, fun) {
  const doc = printDefault(params, fun);
  doc.save(name);
}
