const jspdf =null
const jsPDF = null


export function addFont(jsPDF, {fontBase64, name}) {

}

// jsPDF.API.events.push(['addFonts', function () {
//   this.addFileToVFS('fuhuiR-normal.ttf', window.puhuittf)
//   this.addFont('fuhuiR-normal.ttf', 'fuhuiR', 'normal')
// }])
//
// jsPDF.API.events.push(['addFonts', function () {
//   this.addFileToVFS('fuhuiR-bold.ttf', window.AlibabaRBold)
//   this.addFont('fuhuiR-bold.ttf', 'fuhuiR', 'bold')
// }])
const data = ''

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
    lineColor: [0, 0, 0],
    lineWidth: 0.2
  }
}

export function printDefault(params, fun) {

  const doc: any = new jsPDF(...params.data);

  doc.setFont('fuhuiR')

  fun(doc)
  // doc.save("aaa.pdf")
  return doc
}

export function hangPrintDefault(fun) {

  const doc: any = new jsPDF('l', 'px', 'a4', true);


  doc.setFont('fuhuiR')

  fun(doc)
  // doc.save("aaa.pdf")
  return doc
}
