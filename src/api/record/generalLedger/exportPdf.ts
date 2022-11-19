;
////import {jsPDF} from "jspdf";
const jsPDF=null
export function addFont(jsPDF,{base64,name}){
  ;(function(jsPDFAPI) {
    var font =base64;
    var callAddFont = function(aa) {
      this.addFileToVFS(name+'-normal.ttf', font)
      this.addFont(name+'-normal.ttf', name, 'normal')
    }
    jsPDFAPI.events.push(['addFonts', callAddFont])
  })(jsPDF.API)
}
addFont(jsPDF, {base64: puhuittf, name: 'fuhuiR'})
const data=''

function tableStyle() {
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
const puhuittf=window.puhuittf
// import {puhuittf} from './print/font/hello'
export function printDefault(){

  const doc: any = new jsPDF('p', 'px', 'a4', true);
  doc.setFont('fuhuiR')
  doc.autoTable({
    head: [['摘要','辅助核算','借方金额','贷方金额'] ],
    body: [['','','','']] ,
    startY:100,
    styles: tableStyle(),
    margin: {left: 55},
    didDrawPage(data){
      data.doc.setFontSize(10)
      data.doc.text('附单据数: '+'', data.cursor.x-80,data.settings.startY-20);
      data.doc.text('凭证号: '+''+' - '+''+' - '+''+'/'+'', data.cursor.x-80,data.settings.startY-5);
    },
    didParseCell(data) {
      data.cell.styles.cellPadding = {top:10,left:2,right:4,bottom:9}
      data.cell.styles.fillColor = [255, 255, 255]

      if (data.section == 'head' && data.row.index == 0) {
        data.cell.styles.cellPadding = {top:7,left:2,right:2,bottom:2}
      }

      if (data.section == 'body' && data.column.index == 0) {
        if (data.cell.raw.replace(/[^\u0000-\u00ff]/g,"aa").length > 18) {
          data.cell.styles.cellPadding = {top:6,left:3,right:5,bottom:2}
        } else {
          // data.cell.styles.cellPadding = {top:5left:3}
          // data.cell.styles.halign= 'center'
          //     data.cell.valign= 'top'
          // data.cell.styles.center = {left: 20, top: 10,bottom:0}
        }
      }

      if (data.section == 'body' && data.column.index == 1) {
        if (data.cell.raw.replace(/[^\u0000-\u00ff]/g,"aa").length > 40) {
          data.cell.styles.cellPadding = {top:6,left:3,right:5,bottom:2}
        } else {
          // data.cell.styles.cellPadding = {top:5left:3}
          // data.cell.styles.halign= 'center'
          //     data.cell.valign= 'top'
          // data.cell.styles.center = {left: 20, top: 10,bottom:0}
        }
      }

      if (data.section == 'head' && data.row.index == 0 && data.column.index == 0) {
        data.cell.colSpan=2

        data.cell.styles.cellPadding={top:3,left:10}
      }

      if (data.section == 'foot' && data.row.index === 0) {
        data.cell.styles.cellPadding = {top:5,bottom:5};
        data.cell.styles.fontSize = 10;
      }
      if (data.section == 'foot' && data.row.index === 1) {
        data.cell.styles.cellPadding = 7;
      }
      if (data.section == 'foot' && data.row.index === 0 ) {
        // data.cell.styles.cellPadding={top:4}
        if(data.column.index==0){
          data.cell.colSpan=2
        }
        if(data.column.index!=0){
          data.cell.styles.halign='right'
          data.cell.styles.valign='top'
          data.cell.styles.cellPadding={top:5,right:4}
        }
      }
      if (data.section == 'foot' && data.row.index === 1 ) {
        // data.cell.styles.cellPadding={top:4}

        if(data.column.index==1){
          data.cell.colSpan=3
        }
      }
    },
    columnStyles: {
      0: {maxHeight: 10, cellWidth: 81, halign: 'left'},
      1: {cellWidth: 179, cellPadding:{left:2},halign: 'left'},
      2: {cellWidth: 58, halign: 'right'},
      3: {cellWidth: 58, halign: 'right'}
    }
  })
  return doc
}
