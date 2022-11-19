;
//import {jsPDF} from "jspdf";
const jsPDF=null
export async function addFont(jsPDF){
  const name='fuhuiR'
  const puhuittf=window.puhuittf
    // debugger
  ;(function(jsPDFAPI) {
    var font =puhuittf;
    var callAddFont = function(aa) {
      this.addFileToVFS(name+'-normal.ttf', font)
      this.addFont(name+'-normal.ttf', name, 'normal')
    }
    jsPDFAPI.events.push(['addFonts', callAddFont])
  })(jsPDF.API)
}



const data=''

export function tableStyle() {
  return {
    font: 'fuhuiR',
    fontStyle: 'normal',
    overflow: 'linebreak', // linebreak, ellipsize, visible or hidden
    fillColor: false, // Either false for transparent, rbg array e.g. [255, 255, 255] or gray level e.g 200
    textColor: 20,
    halign: 'left', // left, center, right, justify
    valign: 'top', // top, middle, bottom
    fontSize: 10,
    // cellPadding: {
    //     top:6,
    //     left:6,
    //     right:6,
    //     bottom:6,
    // }, // number or {top,left,right,left,vertical,horizontal}
    cellWidth: 'auto', // 'auto'|'wrap'|number
    minCellHeight: 0,
    minCellWidth: 0,
    // lineColor: [0, 0, 0],
    lineColor:[0, 0, 0],
    lineWidth: 0.2
  }
}

export async function printDefault(fun){
  await addFont(jsPDF)
  const doc: any = new jsPDF('p', 'px', 'a4', true);


  doc.setFont('fuhuiR')

  fun(doc)
  // doc.save("aaa.pdf")
  return doc
}

export async function hangPrintDefault(fun){
  await addFont(jsPDF)
  const doc: any = new jsPDF('l', 'px', 'a4', true);


  doc.setFont('fuhuiR')

  fun(doc)
  // doc.save("aaa.pdf")
  return doc
}
