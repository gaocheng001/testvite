import {useNewPrint} from "/@/utils/boozsoft/print/print";
import {tableStyle} from "/@/store/modules/abc-print";
export async function useThisPrint(params,recordData){
  const data=await recordData.value.crud[0]()
  useNewPrint((doc) => {
    doc.autoTable({
      head: [['未设置档案名', '', '', ''],
        ['项目', '行次', '本月累计', '本年累计金额']],
      body:data.map(it=>Object.values(it)),
      // startY: 60,
      styles: tableStyle(),
      margin: {left: 35},
      addPageContent: (data) => {
        //data.table.finalY 表格最大可容纳y轴坐标，超出时将根据设置决定是否另取一页.在页面需要分页时出现
        let tabHeigth = data.table.height,
          tabMarginTop = data.settings.margin.top,
          tabSize = data.table.finalY - tabMarginTop,//表格最大Y轴-表格顶部距离得到每页表格的最大值
          tabMarginLeft = data.settings.margin.left;
        if (data.table.finalY)//是否分页 有分页时才有该属性finalY
          if (data.pageNumber != Math.ceil(tabHeigth / tabSize)) return;//如果需要每一页都显示页尾则注释该行代码
        //data.cursor.y ,data.cursor.x:表格最后一个单元坐标

        data.doc.setFontSize(10)
      },
      didParseCell(data) {
        // data.cell.styles.cellPadding = {top:10,left:2,right:4,bottom:9}
        data.cell.styles.cellPadding = {top: 4, left: 2, right: 1, bottom: 2}
        data.cell.styles.fillColor = [255, 255, 255]
        data.cell.styles.fontSize = 8

        if (data.section == 'head' && data.row.index == 0) {
          data.cell.styles.fontSize = 14
          data.cell.styles.bold = true
          data.cell.styles.lineColor = [255, 255, 255]
          data.cell.colSpan = 4
          data.cell.styles.halign= 'center'
        }
        if (data.section == 'head' && data.row.index == 1) {
          data.cell.styles.fontSize = 10
          data.cell.styles.lineColor = [255, 255, 255]
          data.cell.colSpan = 4
          data.cell.styles.halign= 'right'
        }
        if (data.section == 'head' && data.row.index == 2) {
          data.cell.styles.fontSize = 10
          data.cell.styles.lineColor = [255, 255, 255]
          if (data.column.index == 0) {
            data.cell.styles.halign= 'left'
          } else if (data.column.index == 1){
            data.cell.colSpan = 2
            data.cell.styles.halign= 'left'
          } else {
            data.cell.styles.halign = 'right'
          }
        }
        if (data.section == 'head' && data.row.index == 3) {
          data.cell.styles.cellPadding = {top:7,left:2,right:2,bottom:2}
          data.cell.styles.halign= 'center'
        }
      },
      columnStyles: {
        0: {maxHeight: 10, cellWidth: 200, halign: 'left'},
        1: {cellWidth: 20, halign: 'center'},
        2: {cellWidth: 80, halign: 'right'},
        3: {cellWidth: 80, halign: 'right'},
      }
    })
  })
}
