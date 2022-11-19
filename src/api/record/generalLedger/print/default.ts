;
// import '../../../../lib/useFont'
//import {jsPDF} from "jspdf";
const jsPDF=null

const doc: any = new jsPDF('p', 'px', 'a4', true);
// const doc: any = new jsPDF('p', 'px', [452*1.3, 333*1.3], true);


import {taodaData} from "./data";

doc.setFont('mitubachi');


const SHOW_LINE=true
function tableStyle() {
  return {
    font: 'mitubachi',
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
    lineColor:SHOW_LINE? [0, 0, 0]:[255, 255, 255],
    lineWidth: 0.2
  }
}
function createAutoTable({params,title,total,index,arr,startY}){
  return {
    head: [['                 '+params.head01,'','',''],SHOW_LINE?[...title]:['','','',''] ],
    startY,
    styles: tableStyle(),
    margin: {left: 55},
    didDrawPage(data){
      data.doc.setFontSize(10)
      data.doc.text('附单据数: '+params.fuDanJuShu, data.cursor.x-80,data.settings.startY-20);
      data.doc.text('凭证号: '+params.type+' - '+params.num+' - '+index+'/'+total, data.cursor.x-80,data.settings.startY-5);
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
    },
    body: arr ,
    foot: [['                             '+ params.totalUpper, '', params.sumJie,params.sumDai], ['                         '+params.person02, `                                                    ${params.person03}                                                         ${params.person04}`]]

  }
}

function renderPage(title, arr) {
  doc.autoTable(createAutoTable({params:arr[0].params,title,total:arr[0].total,index:arr[0].index,arr: arr[0].data, startY:40}))
  if(arr[1]!=null){
      doc.autoTable(createAutoTable({params:arr[1].params,title,total:arr[1].total,index:arr[1].index,arr: arr[1].data, startY:310}))
    }
  }
export function renderTaoDaPrint(taodaData){
    taodaData.data.forEach((item,j) => {
      renderPage(taodaData.title, item)
      function isLastPage() {
        return taodaData.data.length == j + 1
      }

      if (!isLastPage()) {
        doc.addPage()
      }

    })
    return doc
}
