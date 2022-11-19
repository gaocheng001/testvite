// import {voucherNoAutocomplete} from "../data";
import {convertCurrency} from "/@/utils/boozsoft/moneyUtil";
import {tableStyle} from "/@/store/modules/abc-print";
const voucherNoAutocomplete=null
/**
 * A4 竖向两版偏上
 * @param doc
 * @param printList 数据
 * @param etcArr 表头表尾数据
 * @param maxRowLen 合计行下标
 */
export function generateA4TwoUp(doc, printList, etcArr, maxRowLen) {
  /*let model = {
    unit: '北京汇智泽凯管理有限公司',
    quantity: '2',
    date: '2022-01-19',
    number: '记-0001-2/2',
    book:'张三',
    check:'李四',
    cashier:'王武',
    maker:'赵柳',
  }*/
  var theHeight = 0
  var spacing = 38
  let theGlobalStyle = tableStyle()
  theGlobalStyle.valign = 'middle'
  const {
    bodySize,
    headSize,
    etcSize,
    headRowHeight,
    bodyRowHeight
  } = getTwoStyleParameter(maxRowLen)
  let up = {emptyCollection: true, etc: {}, list: []}
  let down = {emptyCollection: true, etc: {}, list: []}
  if (printList.length > 0) {
    up.emptyCollection = false, up.etc = printList[0]['etc'], up.list = printList[0]['list']
    if (printList.length > 1) down.emptyCollection = false, down.etc = printList[1]['etc'], down.list = printList[1]['list']
  }
  if (!up.emptyCollection)
    doc.autoTable({
      head: [['记账凭证', '', '', ''],
        ['核算单位：' + up.etc.unit, '', '凭证号：' + up.etc.number, ''],
        ['摘要', '科目', '借方', '贷方']],
      body: up.list,
      // startY: 60,
      styles: theGlobalStyle,
      margin: {
        left: 40,
        top: 20,
        bottom: 20
      },
      addPageContent: (data) => {
        //data.table.finalY 表格最大可容纳y轴坐标，超出时将根据设置决定是否另取一页.在页面需要分页时出现
        if (theHeight == 0) theHeight = data.cursor.y
        let tabHeigth = data.table.height,
          tabMarginTop = data.settings.margin.top,
          tabSize = data.table.finalY - tabMarginTop,//表格最大Y轴-表格顶部距离得到每页表格的最大值
          tabMarginLeft = data.settings.margin.left;
        if (data.table.finalY) if (data.pageNumber != Math.ceil(tabHeigth / tabSize)) return;
        //data.cursor.y ,data.cursor.x:表格最后一个单元坐标
        data.doc.setFontSize(etcSize)
        doc.autoTableText(
          '附单据数：' + up.etc.quantity,
          data.cursor.x - 40,
          26.5,
          0
        );

        doc.autoTableText(
          '日期：' + up.etc.date,
          data.cursor.x / 2 - 16,
          45,
          0
        );
        doc.autoTableText(
          '记账：' + up.etc.book,
          tabMarginLeft,
          data.cursor.y + 5,
          0
        );
        doc.autoTableText(
          '审核：' + up.etc.check,
          (data.cursor.x / 4) * 1.3,
          data.cursor.y + 5,
          0
        );
        doc.autoTableText(
          '出纳：' + up.etc.cashier,
          (data.cursor.x / 4) * 2.2,
          data.cursor.y + 5,
          0
        );
        doc.autoTableText(
          '制单：' + up.etc.maker,
          (data.cursor.x / 4) * 3.1,
          data.cursor.y + 5,
          0
        );
        // 画分割线
        doc.setLineDash([1, 1], 0); //虚线
        doc.setDrawColor(0, 0, 0); // 背景颜色
        doc.setLineWidth(1);
        doc.setFillColor(0, 0, 0); // 边框颜色

        // 长度、y起点,x起点,y终点
        doc.line(428, data.cursor.y + 32, 40, data.cursor.y + 32);
        doc.setLineDash([]);  // 取消虚线
        data.cursor.y += spacing
      },
      didParseCell(data) {
        data.cell.styles.fillColor = [255, 255, 255]
        data.cell.styles.lineColor = [0, 0, 0]
        data.cell.styles.fontSize = bodySize
        data.cell.styles.minCellHeight = headRowHeight
        data.cell.styles.cellPadding = {top: 2, left: 2, right: 2, bottom: 2}
        if (data.section == 'head' && data.row.index == 0) {
          // data.cell.styles.fontStyle = 'bold'
          data.cell.styles.lineColor = [255, 255, 255]
          if (data.column.index == 0) {
            data.cell.styles.fontSize = 20
            data.cell.styles.halign = 'center'
            data.cell.colSpan = 4
          }
        }
        if (data.section == 'head' && data.row.index == 1) {
          data.cell.styles.fontSize = etcSize
          data.cell.styles.lineColor = [255, 255, 255]
          if (data.column.index == 0) {
            data.cell.colSpan = 2
            data.cell.styles.halign = 'left'
          }
          if (data.column.index == 2) {
            data.cell.colSpan = 2
            data.cell.styles.halign = 'right'
          }
        }

        if (data.section == 'head' && data.row.index == 2) {
          data.cell.styles.fontSize = headSize
          data.cell.styles.cellPadding = {top: 4, left: 2, right: 2, bottom: 4}
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.halign = 'center'
        }
        if (data.section == 'body') {
          data.cell.styles.lineColor = [0, 0, 0]
          /* if (data.row.index%2==1) {
              data.cell.styles.fillColor = [255,255,255]
           }*/
          data.cell.styles.minCellHeight = bodyRowHeight
          if (data.row.index == maxRowLen) {
            data.cell.styles.minCellHeight = headRowHeight
            if (data.column.index == 0) {
              data.cell.colSpan = 2
              data.cell.styles.halign = 'left'
              data.cell.styles.cellPadding = {top: 4, left: 10, right: 10, bottom: 4}
              data.cell.styles.fontStyle = 'bold'
              data.cell.styles.fontSize = etcSize
            }
          }
        }
      },
      columnStyles: {
        0: {cellWidth: 100, halign: 'left'},
        1: {cellWidth: 150, halign: 'left'},
        2: {cellWidth: 70, halign: 'right'},
        3: {cellWidth: 70, halign: 'right'}
      }
    })
  if (!down.emptyCollection)
    doc.autoTable({
      head: [['记账凭证', '', '', ''],
        ['核算单位：' + down.etc.unit, '', '凭证号：' + down.etc.number, ''],
        ['摘要', '科目', '借方', '贷方']],
      body: down.list,
      // startY: 60,
      styles: theGlobalStyle,
      margin: {
        left: 40,
        top: 20,
        bottom: 20
      },
      addPageContent: (data) => {
        //data.table.finalY 表格最大可容纳y轴坐标，超出时将根据设置决定是否另取一页.在页面需要分页时出现
        let tabHeigth = data.table.height,
          tabMarginTop = data.settings.margin.top,
          tabSize = data.table.finalY - tabMarginTop,//表格最大Y轴-表格顶部距离得到每页表格的最大值
          tabMarginLeft = data.settings.margin.left;
        if (data.table.finalY)//是否分页 有分页时才有该属性finalY
          if (data.pageNumber != Math.ceil(tabHeigth / tabSize)) return;//如果需要每一页都显示页尾则注释该行代码
        //data.cursor.y ,data.cursor.x:表格最后一个单元坐标
        data.doc.setFontSize(etcSize)
        doc.autoTableText(
          '附单据数：' + down.etc.quantity,
          data.cursor.x - 40,
          theHeight + spacing + 20,
          0
        );
        // data.doc.setFont('fuhuiR', 'bold')
        doc.autoTableText(
          '日期：' + down.etc.date,
          data.cursor.x / 2 - 16,
          theHeight + spacing + 40,
          0
        );

        doc.autoTableText(
          '记账：' + down.etc.book,
          tabMarginLeft,
          data.cursor.y + 5,
          0
        );
        doc.autoTableText(
          '审核：' + down.etc.check,
          (data.cursor.x / 4) * 1.3,
          data.cursor.y + 5,
          0
        );
        doc.autoTableText(
          '出纳：' + down.etc.cashier,
          (data.cursor.x / 4) * 2.2,
          data.cursor.y + 5,
          0
        );
        doc.autoTableText(
          '制单：' + down.etc.maker,
          (data.cursor.x / 4) * 3.1,
          data.cursor.y + 5,
          0
        );
        doc.setLineDash([1, 1], 0);
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(1);
        // 长度、y起点,x起点,y终点
        doc.line(428, data.cursor.y + 32, 40, data.cursor.y + 32);
        doc.setLineDash([]);

      },
      didParseCell(data) {
        data.cell.styles.fillColor = [255, 255, 255]
        data.cell.styles.lineColor = [0, 0, 0]
        data.cell.styles.fontSize = bodySize
        data.cell.styles.minCellHeight = headRowHeight
        data.cell.styles.cellPadding = {top: 2, left: 2, right: 2, bottom: 2}
        if (data.section == 'head' && data.row.index == 0) {
          // data.cell.styles.fontStyle = 'bold'
          data.cell.styles.lineColor = [255, 255, 255]
          if (data.column.index == 0) {
            data.cell.styles.fontSize = 20
            data.cell.styles.halign = 'center'
            data.cell.colSpan = 4
          }
        }
        if (data.section == 'head' && data.row.index == 1) {
          data.cell.styles.fontSize = etcSize
          data.cell.styles.lineColor = [255, 255, 255]
          if (data.column.index == 0) {
            data.cell.colSpan = 2
            data.cell.styles.halign = 'left'
          }
          if (data.column.index == 2) {
            data.cell.colSpan = 2
            data.cell.styles.halign = 'right'
          }
        }

        if (data.section == 'head' && data.row.index == 2) {
          data.cell.styles.fontSize = headSize
          data.cell.styles.cellPadding = {top: 4, left: 2, right: 2, bottom: 4}
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.halign = 'center'
        }
        if (data.section == 'body') {
          data.cell.styles.lineColor = [0, 0, 0]
          /* if (data.row.index%2==1) {
              data.cell.styles.fillColor = [255,255,255]
           }*/
          data.cell.styles.minCellHeight = bodyRowHeight
          if (data.row.index == maxRowLen) {
            data.cell.styles.minCellHeight = headRowHeight
            if (data.column.index == 0) {
              data.cell.colSpan = 2
              data.cell.styles.halign = 'left'
              data.cell.styles.cellPadding = {top: 4, left: 10, right: 10, bottom: 4}
              data.cell.styles.fontStyle = 'bold'
              data.cell.styles.fontSize = etcSize
            }
          }
        }
      },
      columnStyles: {
        0: {cellWidth: 100, halign: 'left'},
        1: {cellWidth: 150, halign: 'left'},
        2: {cellWidth: 70, halign: 'right'},
        3: {cellWidth: 70, halign: 'right'}
      }
    })
}

/**
 * A4 竖向两版居中
 * @param doc
 * @param printList 数据
 * @param etcArr 表头表尾数据
 * @param maxRowLen 合计行下标
 */
export function generateA4TwoCentered(doc, printList, etcArr, maxRowLen) {
  /*let model = {
    unit: '北京汇智泽凯管理有限公司',
    quantity: '2',
    date: '2022-01-19',
    number: '记-0001-2/2',
    book:'张三',
    check:'李四',
    cashier:'王武',
    maker:'赵柳',
  }*/
  var theHeight = 0
  var spacing = 100 // 下面部分位置
  let theGlobalStyle = tableStyle()
  theGlobalStyle.valign = 'middle'
  const {
    bodySize,
    headSize,
    etcSize,
    headRowHeight,
    bodyRowHeight
  } = getTwoStyleParameter(maxRowLen)
  let up = {emptyCollection: true, etc: {}, list: []}
  let down = {emptyCollection: true, etc: {}, list: []}
  if (printList.length > 0) {
    up.emptyCollection = false, up.etc = printList[0]['etc'], up.list = printList[0]['list']
    if (printList.length > 1) down.emptyCollection = false, down.etc = printList[1]['etc'], down.list = printList[1]['list']
  }
  if (!up.emptyCollection)
    doc.autoTable({
      head: [['记账凭证', '', '', ''],
        ['核算单位：' + up.etc.unit, '', '凭证号：' + up.etc.number, ''],
        ['摘要', '科目', '借方', '贷方']],
      body: up.list,
      // startY: 60,
      styles: theGlobalStyle,
      margin: {
        left: 40,
        top: 30,
        bottom: 20
      },
      addPageContent: (data) => {
        //data.table.finalY 表格最大可容纳y轴坐标，超出时将根据设置决定是否另取一页.在页面需要分页时出现
        if (theHeight == 0) theHeight = data.cursor.y
        let tabHeigth = data.table.height,
          tabMarginTop = data.settings.margin.top,
          tabSize = data.table.finalY - tabMarginTop,//表格最大Y轴-表格顶部距离得到每页表格的最大值
          tabMarginLeft = data.settings.margin.left;
        if (data.table.finalY) if (data.pageNumber != Math.ceil(tabHeigth / tabSize)) return;
        //data.cursor.y ,data.cursor.x:表格最后一个单元坐标
        data.doc.setFontSize(etcSize)
        doc.autoTableText(
          '附单据数：' + up.etc.quantity,
          data.cursor.x - 40,
          36.5,
          0
        );

        doc.autoTableText(
          '日期：' + up.etc.date,
          data.cursor.x / 2 - 16,
          55,
          0
        );
        doc.autoTableText(
          '记账：' + up.etc.book,
          tabMarginLeft,
          data.cursor.y + 5,
          0
        );
        doc.autoTableText(
          '审核：' + up.etc.check,
          (data.cursor.x / 4) * 1.3,
          data.cursor.y + 5,
          0
        );
        doc.autoTableText(
          '出纳：' + up.etc.cashier,
          (data.cursor.x / 4) * 2.2,
          data.cursor.y + 5,
          0
        );
        doc.autoTableText(
          '制单：' + up.etc.maker,
          (data.cursor.x / 4) * 3.1,
          data.cursor.y + 5,
          0
        );
        // 画分割线
        doc.setLineDash([1, 1], 0); //虚线
        doc.setDrawColor(0, 0, 0); // 背景颜色
        doc.setLineWidth(1);
        doc.setFillColor(0, 0, 0); // 边框颜色

        // 长度、y起点,x起点,y终点
        doc.line(428, data.cursor.y + 85, 40, data.cursor.y + 85);
        doc.setLineDash([]);  // 取消虚线
        data.cursor.y += spacing
      },
      didParseCell(data) {
        data.cell.styles.fillColor = [255, 255, 255]
        data.cell.styles.lineColor = [0, 0, 0]
        data.cell.styles.fontSize = bodySize
        data.cell.styles.minCellHeight = headRowHeight
        data.cell.styles.cellPadding = {top: 2, left: 2, right: 2, bottom: 2}
        if (data.section == 'head' && data.row.index == 0) {
          // data.cell.styles.fontStyle = 'bold'
          data.cell.styles.lineColor = [255, 255, 255]
          if (data.column.index == 0) {
            data.cell.styles.fontSize = 20
            data.cell.styles.halign = 'center'
            data.cell.colSpan = 4
          }
        }
        if (data.section == 'head' && data.row.index == 1) {
          data.cell.styles.fontSize = etcSize
          data.cell.styles.lineColor = [255, 255, 255]
          if (data.column.index == 0) {
            data.cell.colSpan = 2
            data.cell.styles.halign = 'left'
          }
          if (data.column.index == 2) {
            data.cell.colSpan = 2
            data.cell.styles.halign = 'right'
          }
        }

        if (data.section == 'head' && data.row.index == 2) {
          data.cell.styles.fontSize = headSize
          data.cell.styles.cellPadding = {top: 4, left: 2, right: 2, bottom: 4}
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.halign = 'center'
        }
        if (data.section == 'body') {
          data.cell.styles.lineColor = [0, 0, 0]
          /* if (data.row.index%2==1) {
              data.cell.styles.fillColor = [255,255,255]
           }*/
          data.cell.styles.minCellHeight = bodyRowHeight
          if (data.row.index == maxRowLen) {
            data.cell.styles.minCellHeight = headRowHeight
            if (data.column.index == 0) {
              data.cell.colSpan = 2
              data.cell.styles.halign = 'left'
              data.cell.styles.cellPadding = {top: 4, left: 10, right: 10, bottom: 4}
              data.cell.styles.fontStyle = 'bold'
              data.cell.styles.fontSize = etcSize
            }
          }
        }
      },
      columnStyles: {
        0: {cellWidth: 100, halign: 'left'},
        1: {cellWidth: 150, halign: 'left'},
        2: {cellWidth: 70, halign: 'right'},
        3: {cellWidth: 70, halign: 'right'}
      }
    })
  if (!down.emptyCollection)
    doc.autoTable({
      head: [['记账凭证', '', '', ''],
        ['核算单位：' + down.etc.unit, '', '凭证号：' + down.etc.number, ''],
        ['摘要', '科目', '借方', '贷方']],
      body: down.list,
      // startY: 60,
      styles: theGlobalStyle,
      margin: {
        left: 40,
        top: 30,
        bottom: 20
      },
      addPageContent: (data) => {
        //data.table.finalY 表格最大可容纳y轴坐标，超出时将根据设置决定是否另取一页.在页面需要分页时出现
        let tabHeigth = data.table.height,
          tabMarginTop = data.settings.margin.top,
          tabSize = data.table.finalY - tabMarginTop,//表格最大Y轴-表格顶部距离得到每页表格的最大值
          tabMarginLeft = data.settings.margin.left;
        if (data.table.finalY)//是否分页 有分页时才有该属性finalY
          if (data.pageNumber != Math.ceil(tabHeigth / tabSize)) return;//如果需要每一页都显示页尾则注释该行代码
        //data.cursor.y ,data.cursor.x:表格最后一个单元坐标
        data.doc.setFontSize(etcSize)
        doc.autoTableText(
          '附单据数：' + down.etc.quantity,
          data.cursor.x - 40,
          theHeight + spacing + 20,
          0
        );
        // data.doc.setFont('fuhuiR', 'bold')
        doc.autoTableText(
          '日期：' + down.etc.date,
          data.cursor.x / 2 - 16,
          theHeight + spacing + 40,
          0
        );

        doc.autoTableText(
          '记账：' + down.etc.book,
          tabMarginLeft,
          data.cursor.y + 5,
          0
        );
        doc.autoTableText(
          '审核：' + down.etc.check,
          (data.cursor.x / 4) * 1.3,
          data.cursor.y + 5,
          0
        );
        doc.autoTableText(
          '出纳：' + down.etc.cashier,
          (data.cursor.x / 4) * 2.2,
          data.cursor.y + 5,
          0
        );
        doc.autoTableText(
          '制单：' + down.etc.maker,
          (data.cursor.x / 4) * 3.1,
          data.cursor.y + 5,
          0
        );
        /*      doc.setLineDash([1, 1], 0);
              doc.setDrawColor(0, 0, 0);
              doc.setLineWidth(1);
              // 长度、y起点,x起点,y终点
              doc.line(428, data.cursor.y + 32, 40, data.cursor.y + 32);
              doc.setLineDash([]);*/

      },
      didParseCell(data) {
        data.cell.styles.fillColor = [255, 255, 255]
        data.cell.styles.lineColor = [0, 0, 0]
        data.cell.styles.fontSize = bodySize
        data.cell.styles.minCellHeight = headRowHeight
        data.cell.styles.cellPadding = {top: 2, left: 2, right: 2, bottom: 2}
        if (data.section == 'head' && data.row.index == 0) {
          // data.cell.styles.fontStyle = 'bold'
          data.cell.styles.lineColor = [255, 255, 255]
          if (data.column.index == 0) {
            data.cell.styles.fontSize = 20
            data.cell.styles.halign = 'center'
            data.cell.colSpan = 4
          }
        }
        if (data.section == 'head' && data.row.index == 1) {
          data.cell.styles.fontSize = etcSize
          data.cell.styles.lineColor = [255, 255, 255]
          if (data.column.index == 0) {
            data.cell.colSpan = 2
            data.cell.styles.halign = 'left'
          }
          if (data.column.index == 2) {
            data.cell.colSpan = 2
            data.cell.styles.halign = 'right'
          }
        }

        if (data.section == 'head' && data.row.index == 2) {
          data.cell.styles.fontSize = headSize
          data.cell.styles.cellPadding = {top: 4, left: 2, right: 2, bottom: 4}
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.halign = 'center'
        }
        if (data.section == 'body') {
          data.cell.styles.lineColor = [0, 0, 0]
          /* if (data.row.index%2==1) {
              data.cell.styles.fillColor = [255,255,255]
           }*/
          data.cell.styles.minCellHeight = bodyRowHeight
          if (data.row.index == maxRowLen) {
            data.cell.styles.minCellHeight = headRowHeight
            if (data.column.index == 0) {
              data.cell.colSpan = 2
              data.cell.styles.halign = 'left'
              data.cell.styles.cellPadding = {top: 4, left: 10, right: 10, bottom: 4}
              data.cell.styles.fontStyle = 'bold'
              data.cell.styles.fontSize = etcSize
            }
          }
        }
      },
      columnStyles: {
        0: {cellWidth: 100, halign: 'left'},
        1: {cellWidth: 150, halign: 'left'},
        2: {cellWidth: 70, halign: 'right'},
        3: {cellWidth: 70, halign: 'right'}
      }
    })
}

/**
 * A4 横向
 * @param doc
 * @param printList 数据
 * @param etcArr 表头表尾数据
 * @param maxRowLen 合计行下标
 */
export function generateA4L(doc, printModel, etcArr, maxRowLen) {
  let theGlobalStyle = tableStyle()
  theGlobalStyle.valign = 'middle'
  let etc = printModel.etc
  let printList = printModel.list
  doc.autoTable({
    head: [['记账凭证', '', '', ''],
      ['', '', '', ''],
      ['核算单位：' + etc.unit, '', etc.number, ''],
      ['摘要', '科目', '借方', '贷方']],
    body: printList,
    // startY: 60,
    styles: theGlobalStyle,
    margin: {
      left: 50,
      top: 20,
      bottom: 20
    },
    addPageContent: (data) => {
      //data.table.finalY 表格最大可容纳y轴坐标，超出时将根据设置决定是否另取一页.在页面需要分页时出现
      let tabHeigth = data.table.height,
        tabMarginTop = data.settings.margin.top,
        tabSize = data.table.finalY - tabMarginTop,//表格最大Y轴-表格顶部距离得到每页表格的最大值
        tabMarginLeft = data.settings.margin.left;
      if (data.table.finalY) if (data.pageNumber != Math.ceil(tabHeigth / tabSize)) return;
      //data.cursor.y ,data.cursor.x:表格最后一个单元坐标
      data.doc.setFontSize(10)
      doc.autoTableText(
        '附单据数  ' + etc.quantity + '  张',
        data.cursor.x - 50,
        47,
        0
      );
      doc.autoTableText(
        '' + etc.date,
        data.cursor.x / 2 - 3,
        47,
        0
      );
      data.doc.setFontSize(12)
      doc.autoTableText(
        '记账：' + etc.book,
        tabMarginLeft,
        data.cursor.y + 5,
        0
      );
      doc.autoTableText(
        '审核：' + etc.check,
        (data.cursor.x / 4) * 1.3,
        data.cursor.y + 5,
        0
      );
      doc.autoTableText(
        '出纳：' + etc.cashier,
        (data.cursor.x / 4) * 2.2,
        data.cursor.y + 5,
        0
      );
      doc.autoTableText(
        '制单：' + etc.maker,
        (data.cursor.x / 4) * 3.1,
        data.cursor.y + 5,
        0
      );
    },
    didParseCell(data) {
      data.cell.styles.minCellHeight = 18
      data.cell.styles.cellPadding = {top: 3, left: 2, right: 2, bottom: 2}
      data.cell.styles.fillColor = [255, 255, 255]
      data.cell.styles.fontSize = 12
      data.cell.styles.lineColor = [0, 0, 0]
      if (data.section == 'head' && data.row.index == 0) {
        data.cell.styles.lineColor = [255, 255, 255]
        if (data.column.index == 0) {
          data.cell.styles.fontSize = 20
          data.cell.styles.halign = 'center'
          data.cell.colSpan = 4
        }
      }
      if (data.section == 'head' && data.row.index == 1) {
        data.cell.styles.lineColor = [255, 255, 255]
        data.cell.styles.minCellHeight = 10
      }
      if (data.section == 'head' && data.row.index == 2) {
        data.cell.styles.lineColor = [255, 255, 255]
        if (data.column.index == 0) {
          data.cell.colSpan = 2
          data.cell.styles.halign = 'left'
        }
        if (data.column.index == 2) {
          data.cell.colSpan = 2
          data.cell.styles.halign = 'right'
          data.cell.styles.fontSize = 10
        }
      }

      if (data.section == 'head' && data.row.index == 3) {
        data.cell.styles.cellPadding = {top: 4, left: 2, right: 2, bottom: 3}
        data.cell.styles.fontStyle = 'bold'
        data.cell.styles.fontSize = 12
        data.cell.styles.halign = 'center'
      }
      if (data.section == 'body') {
        data.cell.styles.minCellHeight = 26
        if (data.row.index == maxRowLen) {
          data.cell.styles.minCellHeight = 18
          if (data.column.index == 0) {
            data.cell.colSpan = 2
            data.cell.styles.halign = 'left'
            data.cell.styles.cellPadding = {top: 3, left: 10, right: 10, bottom: 2}
            data.cell.styles.fontStyle = 'bold'
            data.cell.styles.fontSize = 12
          }
        }
      }
    },
    columnStyles: {
      0: {cellWidth: 140, halign: 'left'},
      1: {cellWidth: 220, halign: 'left'},
      2: {cellWidth: 95, halign: 'right'},
      3: {cellWidth: 95, halign: 'right'}
    }
  })
}

/**
 * A4 横向 - 发票
 * @param doc
 * @param printList 数据
 * @param etcArr 表头表尾数据
 * @param maxRowLen 合计行下标
 */
export function generateA4LFP(doc, printModel, etcArr, maxRowLen, type) {
  let theGlobalStyle = tableStyle()
  theGlobalStyle.valign = 'middle'
  const {bodySize, headSize, etcSize, headRowHeight, bodyRowHeight} = getFPStyleParameter(maxRowLen)
  let etc = printModel.etc
  let printList = printModel.list
  doc.autoTable({
    head: [['记账凭证', '', '', ''],
      ['', '', '', ''],
      ['核算单位：' + etc.unit, '', etc.number, ''],
      ['摘要', '科目', '借方', '贷方']],
    body: printList,
    // startY: 60,
    styles: theGlobalStyle,
    margin: {
      left: 40,
      top: 75,
      bottom: 20
    },
    addPageContent: (data) => {
      //data.table.finalY 表格最大可容纳y轴坐标，超出时将根据设置决定是否另取一页.在页面需要分页时出现
      let tabHeigth = data.table.height,
        tabMarginTop = data.settings.margin.top,
        tabSize = data.table.finalY - tabMarginTop,//表格最大Y轴-表格顶部距离得到每页表格的最大值
        tabMarginLeft = data.settings.margin.left;
      if (data.table.finalY) if (data.pageNumber != Math.ceil(tabHeigth / tabSize)) return;
      //data.cursor.y ,data.cursor.x:表格最后一个单元坐标
      data.doc.setFontSize(etcSize)
      doc.autoTableText(
        '附单据数  ' + etc.quantity + '  张',
        data.cursor.x - 50,
        47 + 55,
        0
      );
      doc.autoTableText(
        '' + etc.date,
        data.cursor.x / 2 - 6,
        47 + 55,
        0
      );
      doc.autoTableText(
        '记账：' + etc.book,
        tabMarginLeft,
        data.cursor.y + 5,
        0
      );
      doc.autoTableText(
        '审核：' + etc.check,
        (data.cursor.x / 4) * 1.3,
        data.cursor.y + 5,
        0
      );
      doc.autoTableText(
        '出纳：' + etc.cashier,
        (data.cursor.x / 4) * 2.2,
        data.cursor.y + 5,
        0
      );
      doc.autoTableText(
        '制单：' + etc.maker,
        (data.cursor.x / 4) * 3.1,
        data.cursor.y + 5,
        0
      );
    },
    didParseCell(data) {
      data.cell.styles.fillColor = [255, 255, 255]
      data.cell.styles.lineColor = [0, 0, 0]
      data.cell.styles.fontSize = bodySize
      data.cell.styles.minCellHeight = headRowHeight
      data.cell.styles.cellPadding = {top: 2, left: 2, right: 2, bottom: 2}
      if (data.section == 'head' && data.row.index == 0) {
        data.cell.styles.lineColor = [255, 255, 255]
        if (data.column.index == 0) {
          data.cell.styles.fontSize = 20
          data.cell.styles.halign = 'center'
          data.cell.colSpan = 4
        }
      }
      if (data.section == 'head' && data.row.index == 1) {
        data.cell.styles.lineColor = [255, 255, 255]
        data.cell.styles.minCellHeight = 10
      }
      if (data.section == 'head' && data.row.index == 2) {
        data.cell.styles.lineColor = [255, 255, 255]
        if (data.column.index == 0) {
          data.cell.colSpan = 2
          data.cell.styles.halign = 'left'
        }
        if (data.column.index == 2) {
          data.cell.colSpan = 2
          data.cell.styles.halign = 'right'
          data.cell.styles.fontSize = etcSize
        }
      }

      if (data.section == 'head' && data.row.index == 3) {
        data.cell.styles.cellPadding = {top: 4, left: 2, right: 2, bottom: 4}
        data.cell.styles.fontStyle = 'bold'
        data.cell.styles.fontSize = headSize
        data.cell.styles.halign = 'center'
      }
      if (data.section == 'body') {
        data.cell.styles.minCellHeight = bodyRowHeight
        if (data.row.index == maxRowLen) {
          data.cell.styles.minCellHeight = headRowHeight
          if (data.column.index == 0) {
            data.cell.colSpan = 2
            data.cell.styles.halign = 'left'
            data.cell.styles.cellPadding = {top: 4, left: 10, right: 10, bottom: 4}
            data.cell.styles.fontStyle = 'bold'
            data.cell.styles.fontSize = etcSize
          }
        }
      }
    },
    columnStyles: {
      0: {cellWidth: 110, halign: 'left'},
      1: {cellWidth: 180, halign: 'left'},
      2: {cellWidth: 80, halign: 'right'},
      3: {cellWidth: 80, halign: 'right'}
    }
  })
}

/**
 * A4 横向 - 发票 - 外币或数量
 * @param doc
 * @param printList 数据
 * @param etcArr 表头表尾数据
 * @param maxRowLen 合计行下标
 */
export function generateA4LFPETC(doc, printModel, etcArr, maxRowLen, type) {
  /*let model = {
    item1[0] = '一二三四五六七八九十一二三四五六七八九十一二'//varLimit(item.cdigest,34) // 34
    item1[1] = '一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八'
    item1[2] = '0.11123             9,999,912.00'
    item1[3] = item.md == '0.00'?"":thousandsLimit(item.md)
    item1[4] = item.mc == '0.00'?"":thousandsLimit(item.mc)
  }*/
  let theGlobalStyle = tableStyle()
  theGlobalStyle.valign = 'middle'
  const {bodySize, headSize, etcSize, headRowHeight, bodyRowHeight} = getFPStyleParameter(maxRowLen)
  let etc = printModel.etc
  let printList = printModel.list
  doc.autoTable({
    head: [['记账凭证', '', '', '', ''],
      ['', '', '', ''],
      ['核算单位：' + etc.unit, '', '', etc.number, ''],
      ['摘要', '科目', `${type == 1 ? '汇率/外币' : '数量/单价'}`, '借方', '贷方']],
    body: printList,
    // startY: 60,
    styles: theGlobalStyle,
    margin: {
      left: 40,
      top: 75,
      bottom: 20
    },
    addPageContent: (data) => {
      //data.table.finalY 表格最大可容纳y轴坐标，超出时将根据设置决定是否另取一页.在页面需要分页时出现
      let tabHeigth = data.table.height,
        tabMarginTop = data.settings.margin.top,
        tabSize = data.table.finalY - tabMarginTop,//表格最大Y轴-表格顶部距离得到每页表格的最大值
        tabMarginLeft = data.settings.margin.left;
      if (data.table.finalY) if (data.pageNumber != Math.ceil(tabHeigth / tabSize)) return;
      //data.cursor.y ,data.cursor.x:表格最后一个单元坐标
      data.doc.setFontSize(etcSize)
      doc.autoTableText(
        '附单据数  ' + etc.quantity + '  张',
        data.cursor.x - 50,
        47 + 55,
        0
      );
      doc.autoTableText(
        '' + etc.date,
        data.cursor.x / 2 - 8,
        47 + 55,
        0
      );
      doc.autoTableText(
        '记账：' + etc.book,
        tabMarginLeft,
        data.cursor.y + 5,
        0
      );
      doc.autoTableText(
        '审核：' + etc.check,
        (data.cursor.x / 4) * 1.3,
        data.cursor.y + 5,
        0
      );
      doc.autoTableText(
        '出纳：' + etc.cashier,
        (data.cursor.x / 4) * 2.2,
        data.cursor.y + 5,
        0
      );
      doc.autoTableText(
        '制单：' + etc.maker,
        (data.cursor.x / 4) * 3.1,
        data.cursor.y + 5,
        0
      );
    },
    didParseCell(data) {
      data.cell.styles.fillColor = [255, 255, 255]
      data.cell.styles.lineColor = [0, 0, 0]
      data.cell.styles.fontSize = bodySize
      data.cell.styles.minCellHeight = headRowHeight
      data.cell.styles.cellPadding = {top: 2, left: 2, right: 2, bottom: 2}
      if (data.section == 'head' && data.row.index == 0) {
        data.cell.styles.lineColor = [255, 255, 255]
        if (data.column.index == 0) {
          data.cell.styles.fontSize = 20
          data.cell.styles.halign = 'center'
          data.cell.colSpan = 5
        }
      }
      if (data.section == 'head' && data.row.index == 1) {
        data.cell.styles.lineColor = [255, 255, 255]
        data.cell.styles.minCellHeight = 10
      }
      if (data.section == 'head' && data.row.index == 2) {
        data.cell.styles.lineColor = [255, 255, 255]
        if (data.column.index == 0) {
          data.cell.colSpan = 3
          data.cell.styles.halign = 'left'
        }
        if (data.column.index == 3) {
          data.cell.colSpan = 2
          data.cell.styles.halign = 'right'
          data.cell.styles.fontSize = etcSize
        }
      }

      if (data.section == 'head' && data.row.index == 3) {
        data.cell.styles.cellPadding = {top: 4, left: 2, right: 2, bottom: 4}
        data.cell.styles.fontStyle = 'bold'
        data.cell.styles.fontSize = headSize
        data.cell.styles.halign = 'center'
      }
      if (data.section == 'body') {
        data.cell.styles.minCellHeight = bodyRowHeight
        if (data.row.index == maxRowLen) {
          data.cell.styles.minCellHeight = headRowHeight
          if (data.column.index == 0) {
            data.cell.colSpan = 3
            data.cell.styles.halign = 'left'
            data.cell.styles.cellPadding = {top: 4, left: 10, right: 10, bottom: 4}
            data.cell.styles.fontStyle = 'bold'
            data.cell.styles.fontSize = etcSize
          }
        }
      }
    },
    columnStyles: {
      0: {cellWidth: 90, halign: 'left'},
      1: {cellWidth: 150, halign: 'left'},
      2: {cellWidth: 70, halign: 'right'},
      3: {cellWidth: 70, halign: 'right'},
      4: {cellWidth: 70, halign: 'right'}
    }
  })
}

/**
 * A4宽 12CM or 14Cm
 * @param doc
 * @param printList 数据
 * @param etcArr 表头表尾数据
 * @param maxRowLen 合计行下标
 */
export function generateA4Width(doc, printModel, type, maxRowLen) {
  /*let model = {
    unit: '北京汇智泽凯管理有限公司',
    quantity: '2',
    date: '2022-01-19',
    number: '记-0001-2/2',
    book:'张三',
    check:'李四',
    cashier:'王武',
    maker:'赵柳',
  }*/
  let theGlobalStyle = tableStyle()
  theGlobalStyle.valign = 'middle'
    if (type == '12'){
      const {
        bodySize,
        headSize,
        etcSize,
        headRowHeight,
        bodyRowHeight
      } = getTwoStyleParameter(maxRowLen)
      doc.autoTable({
        head: [['记账凭证', '', '', ''],
          ['核算单位：' + printModel.etc.unit, '', '凭证号：' + printModel.etc.number, ''],
          ['摘要', '科目', '借方', '贷方']],
        body: printModel.list,
        // startY: 60,
        styles: theGlobalStyle,
        margin: {
          left: 40,
          top: 20,
          bottom: 20
        },
        addPageContent: (data) => {
          //data.table.finalY 表格最大可容纳y轴坐标，超出时将根据设置决定是否另取一页.在页面需要分页时出现
          let tabHeigth = data.table.height,
            tabMarginTop = data.settings.margin.top,
            tabSize = data.table.finalY - tabMarginTop,//表格最大Y轴-表格顶部距离得到每页表格的最大值
            tabMarginLeft = data.settings.margin.left;
          if (data.table.finalY) if (data.pageNumber != Math.ceil(tabHeigth / tabSize)) return;
          //data.cursor.y ,data.cursor.x:表格最后一个单元坐标
          data.doc.setFontSize(etcSize)
          doc.autoTableText(
            '附单据数：' + printModel.etc.quantity,
            data.cursor.x - 40,
            26.5,
            0
          );

          doc.autoTableText(
            '日期：' + printModel.etc.date,
            data.cursor.x / 2 - 16,
            45,
            0
          );
          doc.autoTableText(
            '记账：' + printModel.etc.book,
            tabMarginLeft,
            data.cursor.y + 5,
            0
          );
          doc.autoTableText(
            '审核：' + printModel.etc.check,
            (data.cursor.x / 4) * 1.3,
            data.cursor.y + 5,
            0
          );
          doc.autoTableText(
            '出纳：' + printModel.etc.cashier,
            (data.cursor.x / 4) * 2.2,
            data.cursor.y + 5,
            0
          );
          doc.autoTableText(
            '制单：' + printModel.etc.maker,
            (data.cursor.x / 4) * 3.1,
            data.cursor.y + 5,
            0
          );
        },
        didParseCell(data) {
          data.cell.styles.fillColor = [255, 255, 255]
          data.cell.styles.lineColor = [0, 0, 0]
          data.cell.styles.fontSize = bodySize
          data.cell.styles.minCellHeight = headRowHeight
          data.cell.styles.cellPadding = {top: 2, left: 2, right: 2, bottom: 2}
          if (data.section == 'head' && data.row.index == 0) {
            // data.cell.styles.fontStyle = 'bold'
            data.cell.styles.lineColor = [255, 255, 255]
            if (data.column.index == 0) {
              data.cell.styles.fontSize = 20
              data.cell.styles.halign = 'center'
              data.cell.colSpan = 4
            }
          }
          if (data.section == 'head' && data.row.index == 1) {
            data.cell.styles.fontSize = etcSize
            data.cell.styles.lineColor = [255, 255, 255]
            if (data.column.index == 0) {
              data.cell.colSpan = 2
              data.cell.styles.halign = 'left'
            }
            if (data.column.index == 2) {
              data.cell.colSpan = 2
              data.cell.styles.halign = 'right'
            }
          }

          if (data.section == 'head' && data.row.index == 2) {
            data.cell.styles.fontSize = headSize
            data.cell.styles.cellPadding = {top: 4, left: 2, right: 2, bottom: 4}
            data.cell.styles.fontStyle = 'bold'
            data.cell.styles.halign = 'center'
          }
          if (data.section == 'body') {
            data.cell.styles.lineColor = [0, 0, 0]
            /* if (data.row.index%2==1) {
                data.cell.styles.fillColor = [255,255,255]
             }*/
            data.cell.styles.minCellHeight = bodyRowHeight
            if (data.row.index == maxRowLen) {
              data.cell.styles.minCellHeight = headRowHeight
              if (data.column.index == 0) {
                data.cell.colSpan = 2
                data.cell.styles.halign = 'left'
                data.cell.styles.cellPadding = {top: 4, left: 10, right: 10, bottom: 4}
                data.cell.styles.fontStyle = 'bold'
                data.cell.styles.fontSize = etcSize
              }
            }
          }
        },
        columnStyles: {
          0: {cellWidth: 100, halign: 'left'},
          1: {cellWidth: 150, halign: 'left'},
          2: {cellWidth: 70, halign: 'right'},
          3: {cellWidth: 70, halign: 'right'}
        }
      })
    }else {
      const {
        bodySize,
        headSize,
        etcSize,
        headRowHeight,
        bodyRowHeight
      } = getA4Width14Parameter(maxRowLen)
      console.log('14')
      doc.autoTable({
        head: [['记账凭证', '', '', ''],
          ['核算单位：' + printModel.etc.unit, '', '凭证号：' + printModel.etc.number, ''],
          ['摘要', '科目', '借方', '贷方']],
        body: printModel.list,
        // startY: 60,
        styles: theGlobalStyle,
        margin: {
          left: 40,
          top: 20,
          bottom: 20
        },
        addPageContent: (data) => {
          //data.table.finalY 表格最大可容纳y轴坐标，超出时将根据设置决定是否另取一页.在页面需要分页时出现
          let tabHeigth = data.table.height,
            tabMarginTop = data.settings.margin.top,
            tabSize = data.table.finalY - tabMarginTop,//表格最大Y轴-表格顶部距离得到每页表格的最大值
            tabMarginLeft = data.settings.margin.left;
          if (data.table.finalY) if (data.pageNumber != Math.ceil(tabHeigth / tabSize)) return;
          //data.cursor.y ,data.cursor.x:表格最后一个单元坐标
          data.doc.setFontSize(etcSize)
          doc.autoTableText(
            '附单据数：' + printModel.etc.quantity,
            data.cursor.x - 40,
            26.5,
            0
          );

          doc.autoTableText(
            '日期：' + printModel.etc.date,
            data.cursor.x / 2 - 16,
            45,
            0
          );
          doc.autoTableText(
            '记账：' + printModel.etc.book,
            tabMarginLeft,
            data.cursor.y + 5,
            0
          );
          doc.autoTableText(
            '审核：' + printModel.etc.check,
            (data.cursor.x / 4) * 1.3,
            data.cursor.y + 5,
            0
          );
          doc.autoTableText(
            '出纳：' + printModel.etc.cashier,
            (data.cursor.x / 4) * 2.2,
            data.cursor.y + 5,
            0
          );
          doc.autoTableText(
            '制单：' + printModel.etc.maker,
            (data.cursor.x / 4) * 3.1,
            data.cursor.y + 5,
            0
          );
        },
        didParseCell(data) {
          data.cell.styles.fillColor = [255, 255, 255]
          data.cell.styles.lineColor = [0, 0, 0]
          data.cell.styles.fontSize = bodySize
          data.cell.styles.minCellHeight = headRowHeight
          data.cell.styles.cellPadding = {top: 2, left: 2, right: 2, bottom: 2}
          if (data.section == 'head' && data.row.index == 0) {
            // data.cell.styles.fontStyle = 'bold'
            data.cell.styles.lineColor = [255, 255, 255]
            if (data.column.index == 0) {
              data.cell.styles.fontSize = 20
              data.cell.styles.halign = 'center'
              data.cell.colSpan = 4
            }
          }
          if (data.section == 'head' && data.row.index == 1) {
            data.cell.styles.fontSize = etcSize
            data.cell.styles.lineColor = [255, 255, 255]
            if (data.column.index == 0) {
              data.cell.colSpan = 2
              data.cell.styles.halign = 'left'
            }
            if (data.column.index == 2) {
              data.cell.colSpan = 2
              data.cell.styles.halign = 'right'
            }
          }

          if (data.section == 'head' && data.row.index == 2) {
            data.cell.styles.fontSize = headSize
            data.cell.styles.cellPadding = {top: 4, left: 2, right: 2, bottom: 4}
            data.cell.styles.fontStyle = 'bold'
            data.cell.styles.halign = 'center'
          }
          if (data.section == 'body') {
            data.cell.styles.lineColor = [0, 0, 0]
            /* if (data.row.index%2==1) {
                data.cell.styles.fillColor = [255,255,255]
             }*/
            data.cell.styles.minCellHeight = bodyRowHeight
            if (data.row.index == maxRowLen) {
              data.cell.styles.minCellHeight = headRowHeight
              if (data.column.index == 0) {
                data.cell.colSpan = 2
                data.cell.styles.halign = 'left'
                data.cell.styles.cellPadding = {top: 4, left: 10, right: 10, bottom: 4}
                data.cell.styles.fontStyle = 'bold'
                data.cell.styles.fontSize = etcSize
              }
            }
          }
        },
        columnStyles: {
          0: {cellWidth: 100, halign: 'left'},
          1: {cellWidth: 150, halign: 'left'},
          2: {cellWidth: 70, halign: 'right'},
          3: {cellWidth: 70, halign: 'right'}
        }
      })
    }
}

/**
 * 两版不同行数参数
 * @param code
 */
function getTwoStyleParameter(code: number) {
  let model = {}
  switch (code) {
    case 6:
      model = {
        bodySize: 9,
        headSize: 10,
        etcSize: 10,
        headRowHeight: 16,
        bodyRowHeight: 22,
        colOneLength: 28,
        colTwoLength: 44
      }
      break;
    case 7:
      model = {
        bodySize: 9,
        headSize: 10,
        etcSize: 10,
        headRowHeight: 16,
        bodyRowHeight: 17,
        colOneLength: 28,
        colTwoLength: 44
      }
      break;
    case 8:
      model = {
        bodySize: 8,
        headSize: 10,
        etcSize: 10,
        headRowHeight: 16,
        bodyRowHeight: 14,
        colOneLength: 32,
        colTwoLength: 48
      }
      break;
    default:
      model = {
        bodySize: 10,
        headSize: 12,
        etcSize: 12,
        headRowHeight: 16,
        bodyRowHeight: 25,
        colOneLength: 26,
        colTwoLength: 38
      }
  }
  return model
}

function getA4Width14Parameter(code: number) {
  let model = {}
  switch (code) {
    case 6:
      model = {
        bodySize: 10,
        headSize: 12,
        etcSize: 12,
        headRowHeight: 20,
        bodyRowHeight: 31,
        colOneLength: 26,
        colTwoLength: 38
      }
      break;
    case 7:
      model = {
        bodySize: 10,
        headSize: 12,
        etcSize: 10,
        headRowHeight: 18,
        bodyRowHeight: 28,
        colOneLength: 26,
        colTwoLength: 38
      }
      break;
    case 8:
      model = {
        bodySize: 9,
        headSize: 10,
        etcSize: 10,
        headRowHeight: 16,
        bodyRowHeight: 24,
        colOneLength: 26,
        colTwoLength: 38
      }
      break;
    default:
      model = {
        bodySize: 12,
        headSize: 12,
        etcSize: 12,
        headRowHeight: 20,
        bodyRowHeight: 35,
        colOneLength: 26,
        colTwoLength: 38
      }
  }
  return model
}

function getFPStyleParameter(code: number, type: number) {
  let model = {}
  switch (code) {
    case 6:
      model = {
        bodySize: 10,
        headSize: 12,
        etcSize: 10,
        headRowHeight: 16,
        bodyRowHeight: 26,
        colOneLength: type == 4 ? 28 : 22,
        colTwoLength: type == 4 ? 46 : 38
      }
      break;
    case 7:
      model = {
        bodySize: 10,
        headSize: 12,
        etcSize: 10,
        headRowHeight: 16,
        bodyRowHeight: 22,
        colOneLength: 28,
        colTwoLength: 46
      }
      break;
    case 8:
      model = {
        bodySize: 10,
        headSize: 12,
        etcSize: 10,
        headRowHeight: 16,
        bodyRowHeight: 18,
        colOneLength: 28,
        colTwoLength: 46
      }
      break;
    default:
      model = {
        bodySize: 10,
        headSize: 12,
        etcSize: 10,
        headRowHeight: 16,
        bodyRowHeight: 30,
        colOneLength: 28,
        colTwoLength: 46
      }
  }
  return model
}

export function getCurrPrintParameter(code: number) {
  let model = {
    fx: 'p', size: 'a4', fun: () => {
    }
  }
  switch (code) {
    case 2:
      model.fun = (doc, printList, etcArr, maxRowLen) => generateA4TwoUp(doc, printList, etcArr, maxRowLen)
      break;
    case 3:
      model.fun = (doc, printList, etcArr, maxRowLen) => generateA4TwoCentered(doc, printList, etcArr, maxRowLen)
      break;
    case 7:
      model.fun = (doc, printList, etcArr, maxRowLen) => generateA4Width(doc, printList, '12', maxRowLen)
      break;
    case 8:
      model.fun = (doc, printList, etcArr, maxRowLen) => generateA4Width(doc, printList, '14', maxRowLen)
      break;
    case 4:
      model.fx = 'l'
      model.fun = (doc, printList, etcArr, maxRowLen) => generateA4LFP(doc, printList, etcArr, maxRowLen)
      break;
    case 5:
      model.fx = 'l'
      model.fun = (doc, printList, etcArr, maxRowLen) => generateA4LFPETC(doc, printList, etcArr, maxRowLen, 1)
      break;
    case 6:
      model.fx = 'l'
      model.fun = (doc, printList, etcArr, maxRowLen) => generateA4LFPETC(doc, printList, etcArr, maxRowLen, 2)
      break;
    default:
      model.fx = 'l'
      model.fun = (doc, printList, etcArr, maxRowLen) => generateA4L(doc, printList, etcArr, maxRowLen)
  }
  return model
}


/**
 * 创建一个迭代器
 * @param items
 */
function createIterator(items) {
  var i = 0;
  return {
    next: function () {
      var done = (i >= items.length);
      var value = !done ? items[i++] : undefined;
      return {
        done: done,
        value: value
      };
    },
    exist: function () {
      return (i < items.length);
    }
  };
}

export function varLimit(text: string, len: number) {
  let v = ''
  if (null == text || '' == text) return v
  return text.length > len ? text.substring(0, len) : text
}

export function thousandsLimit(text: string) {
  let v = ''
  if (null == text || '' == text) return v
  let re = /\d{1,3}(?=(\d{3})+$)/g;
  let n1 = (text + "").replace(/^(\d+)((\.\d+)?)$/, (s, s1, s2) => s1.replace(re, "$&,") + s2);
  return n1;
}

/**
 * A4 两版数据对接
 */
function A4TwoConvert(items, isWb, varLimitModel, total) {
  var list = []
  items.forEach(it => {
    let item1 = {} // item.mc == '0.00'?"":thousandsLimit(item.mc)
    item1[0] = it.cdigest == null ? '' : !isWb ? it.cdigest : `${it.cdigest}` + spliceSummaryAndQuantity(it, 'all')
    item1[1] = it.ccode == null ? '' : it.ccode + ' ' + it.ccodeName,
      item1[0] = varLimit(item1[0], varLimitModel.colOneLength || 26) // 34
    item1[1] = varLimit(item1[1], varLimitModel.colTwoLength || 38)
    item1[2] = it.md == '0.00' || it.md == '0' ? "" : thousandsLimit(it.md)
    item1[3] = it.mc == '0.00' || it.mc == '0' ? "" : thousandsLimit(it.mc)
    list.push(item1)
  })
  list.push({
    0: '合计：' + convertCurrency(total),
    1: '',
    2: thousandsLimit(total),
    3: thousandsLimit(total)
  })
  return list
}

function spliceSummaryAndQuantity(it, type) {
  let text = ''
  if (type == 'wb'){
    if ((null != it.mdF && '' != it.mdF && null != it.nfrat && '' != it.nfrat))
      text = `汇率:${it.mdF}%/外币:${it.nfrat}`
    } else if (type == 'sl') {
      if ((null != it.cunitPrice && '' != it.cunitPrice && (null != it.ndS && '' != it.ndS) || (null != it.ncS && '' != it.ncS)))
        text = `数量:${it.mdF}%/单价:${it.nfrat}`
    } else {
      if ((null != it.mdF && '' != it.mdF && null != it.nfrat && '' != it.nfrat)) {
        text += `汇率:${it.mdF}%/外币:${it.nfrat};`
        if ((null != it.cunitPrice && '' != it.cunitPrice && ((null != it.ndS && '' != it.ndS) || (null != it.ncS && '' != it.ncS))))
          text += `数量:${it.mdF}%/单价:${it.nfrat};`
        if ('' != text) text = `【${text}】`
      }
    }
  return text
}
  /**
   * A4 发票数据对接
   */
  function A4FPConvert(items, isWb, varLimitModel, code, total) {
    var list = []
    items.forEach(it => {
      let item1 = {} // item.mc == '0.00'?"":thousandsLimit(item.mc)
      item1[0] = it.cdigest == null ? '' : !isWb && code != 1 ? it.cdigest : `${it.cdigest}` + spliceSummaryAndQuantity(it, 'all')
      item1[1] = it.ccode == null ? '' : it.ccode + ' ' + it.ccodeName,
        item1[0] = varLimit(item1[0], varLimitModel.colOneLength || 30) // 34
      item1[1] = varLimit(item1[1], varLimitModel.colTwoLength || 48)
      if (code == 5 || code == 6) {
        item1[2] = spliceSummaryAndQuantity(it, code == 5 ? 'wb' : 'sl')
        item1[3] = it.md == '0.00' || it.md == '0' ? "" : thousandsLimit(it.md)
        item1[4] = it.mc == '0.00' || it.mc == '0' ? "" : thousandsLimit(it.mc)
      } else {
        item1[2] = it.md == '0.00' || it.md == '0' ? "" : thousandsLimit(it.md)
        item1[3] = it.mc == '0.00' || it.mc == '0' ? "" : thousandsLimit(it.mc)
      }
      list.push(item1)
    })
    let item2 = {}
    if (code == 5 || code == 6) {
      item2 = {
        0: '合计：' + convertCurrency(total),
        1: '',
        2: '',
        3: thousandsLimit(total),
        4: thousandsLimit(total)
      }
    } else {
      item2 = {
        0: '合计：' + convertCurrency(total),
        1: '',
        2: thousandsLimit(total),
        3: thousandsLimit(total)
      }
    }
    list.push(item2)
    return list
  }

  function getCurrInoIdIumpSum(list) {
    let sum = 0
    list.forEach(it => {
      if (null != it.md && parseFloat(it.md) != 0) sum += parseFloat(it.md)
    })
    return parseFloat(sum).toFixed(2)
  }

  /**
   * A4两栏数据组装
   * @param dataArr
   * @param etcInfo
   * @param code
   * @param rNumber
   */
  export function dataModelBuildingTwoP(dataArr, etcInfo, code: number, rNumber: number) {
    let dataModel = []
    let pageModel = []
    let start = true
    const varLimitModel = getTwoStyleParameter(rNumber)
    var iterator = createIterator([...new Set(dataArr.map(it => it.uniqueCode))]);
    do {
      let elem = iterator.next()
      if (elem.done) {//不存在
        start = false
      } else {
        let pList = dataArr.filter(it => elem.value == it.uniqueCode)
        let sum = getCurrInoIdIumpSum(pList)
        let tnum = Math.ceil(pList.length / rNumber) // 每张凭证栏数
        for (let i = 0; i < tnum; i++) {
          let todys = pList.slice(rNumber * i, rNumber * (i + 1))
          let o = {etc: {}, list: todys}
          if (todys.length < rNumber) { // 不足时 补充空白
            let cnum = rNumber - todys.length
            for (let j = 0; j < cnum; j++) {
              todys.push({md: '0.00', mc: '0.00'})
            }
          }
          o.etc = {
            unit: etcInfo.unit,
            quantity: todys[0].idoc || 0,
            date: todys[0].dbillDate,
            number: `${todys[0].csign}-${voucherNoAutocomplete(todys[0].inoId, 4)}-${i + 1}/${tnum}`,
            book: todys[0].cbook || '',
            check: todys[0].ccheck || '',
            cashier: todys[0].ccashier || '',
            maker: todys[0].cbill || ''
          }
          o.list = A4TwoConvert(todys, true, varLimitModel, sum)
          pageModel.push(o)
          if (pageModel.length == 2 || ((i + 1) == tnum && pageModel.length == 1 && !iterator.exist())) {
            dataModel.push(pageModel)
            pageModel = []
          }
        }
      }
    } while (start)
    return dataModel
  }


  /**
   * A4横版数据组装
   * @param dataArr
   * @param etcInfo
   * @param code
   * @param rNumber
   */
  export function dataModelBuildingL(dataArr, etcInfo, code: number, rNumber: number) {
    let dataModel = []
    let start = true
    const varLimitModel = code == 1 ? {} : getFPStyleParameter(rNumber)
    var iterator = createIterator([...new Set(dataArr.map(it => it.uniqueCode))]);
    do {
      let elem = iterator.next()
      if (elem.done) {//不存在
        start = false
      } else {
        let pList = dataArr.filter(it => elem.value == it.uniqueCode)
        let sum = getCurrInoIdIumpSum(pList)
        let tnum = Math.ceil(pList.length / rNumber) // 每张凭证栏数
        for (let i = 0; i < tnum; i++) {
          let todys = pList.slice(rNumber * i, rNumber * (i + 1))
          let o = {etc: {}, list: todys}
          if (todys.length < rNumber) { // 不足时 补充空白
            let cnum = rNumber - todys.length
            for (let j = 0; j < cnum; j++) {
              todys.push({
                mdF: '',
                ljMd: '0',
                ljMc: '0',
                ndS: '0',
                ncS: '0',
                md: '0.00',
                mc: '0.00'
              })
            }
          }
          let dates = todys[0].dbillDate.split('-')
          o.etc = {
            unit: etcInfo.unit,
            quantity: todys[0].idoc || 0,
            date: `${dates[0]}年${dates[1]}月${dates[2]}日`,
            number: `第  ${voucherNoAutocomplete(todys[0].inoId, 4)}  号 - ${i + 1}/${tnum}`,
            book: todys[0].cbook || '',
            check: todys[0].ccheck || '',
            cashier: todys[0].ccashier || '',
            maker: todys[0].cbill || ''
          }
          o.list = A4FPConvert(todys, false, varLimitModel, code, sum)
          dataModel.push(o)
        }
      }
    } while (start)
    return dataModel
  }
