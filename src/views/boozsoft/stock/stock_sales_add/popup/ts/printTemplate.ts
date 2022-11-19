import {tableStyle} from "/@/store/modules/abc-print";
import {hasBlank} from "/@/api/task-api/tast-bus-api";

/**
 * 两栏
 * @param doc
 * @param printObj 数据
 * @param maxRowLen 合计行下标
 * @param stencils 打印模版
 */
 function generatePrint(doc, printObj, maxRowLen,stencils,maxWidth) {
  var theHeight = 0
  var spacing = 100 // 下面部分位置
  let theGlobalStyle = tableStyle()
  theGlobalStyle.valign = 'middle'
  const {
    titleName,
    titleSize,
    bodySize,
    headSize,
    footerSize,
    headList,bodyList,
    footerList,
    widthStyles,
    headers
  } = parseTemplateParameters(stencils)
  let up = {emptyCollection: true, etc: printObj['etc'], list: printObj['list']}
  // 获取数量列index =
  let numberColIndex = (bodyList.findIndex(it=>it.systemName == '数量') || 2)
  doc.autoTable({
      head: headers,
      body: up.list,
      styles: theGlobalStyle,
      margin: {
        left: 10,
        top: 5,
        bottom: 0
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
        // 写入大标题
        data.doc.setFontSize(titleSize)
        // data.doc.setFont('fuhuiR', '','bold')
        doc.autoTableText(titleName,((maxWidth / 2)-(8*(Math.floor(titleName.length / 2)))),  6, 0);
        // 写入其他
        data.doc.setFontSize(headSize)
        let rowNumber = 0
        for (let i = 0; i < headList.length; i++) {
          const head = headList[i];
          if ((i+1)%4 == 1){
            rowNumber+=1
            doc.autoTableText(head.printName+'：'+(up.etc[head.propertyName] || ''), tabMarginLeft+2, 11+(rowNumber*8), 0);
          }
          if ((i+1)%4 == 2) doc.autoTableText(head.printName+'：'+(up.etc[head.propertyName] || ''),   (maxWidth / 4) * 1.3,  11+(rowNumber*8), 0);
          if ((i+1)%4 == 3) doc.autoTableText(head.printName+'：'+(up.etc[head.propertyName] || ''),   (maxWidth / 4) * 2.2,  11+(rowNumber*8), 0);
          if ((i+1)%4 == 0) doc.autoTableText(head.printName+'：'+(up.etc[head.propertyName] || ''),   (maxWidth / 4) * 3.1,  11+(rowNumber*8), 0);
        }
        data.doc.setFontSize(footerSize)
        let rowNumber2 = 0

        for (let i = 0; i < footerList.length; i++) {
          const head = footerList[i];
          if ((i+1)%4 == 1){
            rowNumber2+=1
            doc.autoTableText(!hasBlank((head.printName))?head.printName+'：'+(up.etc[head.propertyName] || ''):'', tabMarginLeft, data.cursor.y +(rowNumber2*4), 0);
          }
          if ((i+1)%4 == 2) doc.autoTableText(!hasBlank((head.printName))?head.printName+'：'+(up.etc[head.propertyName] || ''):'',   (maxWidth / 4) * 1.3,  data.cursor.y +(rowNumber2*4), 0);
          if ((i+1)%4 == 3) doc.autoTableText(!hasBlank((head.printName))?head.printName+'：'+(up.etc[head.propertyName] || ''):'',   (maxWidth / 4) * 2.2,  data.cursor.y +(rowNumber2*4), 0);
          if ((i+1)%4 == 0) doc.autoTableText(!hasBlank((head.printName))?head.printName+'：'+(up.etc[head.propertyName] || ''):'',   (maxWidth / 4) * 3.1,  data.cursor.y +(rowNumber2*4), 0);
        }
        /*// 画分割线
        doc.setLineDash([1, 1], 0); //虚线
        doc.setDrawColor(0, 0, 0); // 背景颜色
        doc.setLineWidth(1);
        doc.setFillColor(0, 0, 0); // 边框颜色

        // 长度、y起点,x起点,y终点
        doc.line(428, data.cursor.y + 85, 40, data.cursor.y + 85);
        doc.setLineDash([]);  // 取消虚线*/
        // data.cursor.y += spacing
      },
      didParseCell(data) {
        data.cell.styles.fillColor = [255, 255, 255]
        data.cell.styles.lineColor = [88, 88, 88]
        data.cell.styles.overflow = 'ellipsize'
        // data.cell.styles.lineWidth = 0.1 //线宽默认 0.1
        data.cell.styles.fontSize = bodySize
        data.cell.styles.minCellHeight = 5
        // data.cell.styles.cellPadding = {top: 2, left: 2, right: 2, bottom: 2}
        if (data.section == 'head' && data.row.index == 0) {
          data.cell.styles.minCellHeight = 15
          // data.cell.styles.fontStyle = 'bold'
          data.cell.styles.lineColor = [255, 255, 255]
          if (data.column.index == 0) {
            data.cell.styles.fontSize = titleSize
            data.cell.styles.halign = 'center'
            data.cell.colSpan = bodyList.length
          }
        }
        let rowNumber =  Math.ceil(headList.length / 4)
        if (data.section == 'head' && (data.row.index > 0   &&  data.row.index <= rowNumber)) {
          data.cell.styles.lineColor = [255, 255, 255]
        }
        if (data.section == 'head' && data.row.index == (rowNumber+1)) {
          data.cell.styles.fontSize = headSize
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.halign = 'center'
        }
        if (data.section == 'body') {
          data.cell.styles.lineColor =  [88, 88, 88]//[0, 0, 0]
          /* if (data.row.index%2==1) {
              data.cell.styles.fillColor = [255,255,255]
           }*/
          if (data.row.index == maxRowLen) {
              data.cell.styles.fontStyle = 'bold'
            if (data.column.index == 0) {
              data.cell.colSpan = numberColIndex
              data.cell.styles.halign = 'center'
            }
          }
        }
      },
      columnStyles: widthStyles
    })
}

/**
 * 根据模版设置获取相应参数
 * @param code
 */
export function parseTemplateParameters(stencils) {
  let zeros = stencils.filter(it=>it.belongArea == '0');
  let ones = stencils.filter(it=>it.belongArea == '1');
  let twos = stencils.filter(it=>it.belongArea == '2');
  let threes = stencils.filter(it=>it.belongArea == '3');
  let widths = {}
  twos.forEach((it,index)=> widths[index] = {cellWidth: parseInt(it.printWidth || 15),halign: it.alignWay})
  let data =  {
    titleName: zeros.length > 0?zeros[0].printName:'未设置',
    titleSize:  zeros.length > 0?parseInt(zeros[0].fontSize || 20):20,
    bodySize:twos.length > 0?parseInt(twos[0].fontSize || 8):8,
    headSize:ones.length > 0?parseInt(ones[0].fontSize || 10):10,
    footerSize:threes.length > 0?parseInt(threes[0].fontSize || 10):10,
    headList: ones,
    bodyList: twos,
    footerList: threes,
    widthStyles: widths,
    headers:[]
}
  function generateBlank(i){
    let arr = []
    for (let j = 0; j < i; j++) arr.push('')
    return arr
  }
  let headers = []
  let as = generateBlank(twos.length)
  // as[0] = data.titleName // 写入标题
  headers.push(as)
  let z =  Math.ceil(ones.length / 4)
  for (let i = 0; i < z; i++) headers.push(generateBlank(twos.length))
  headers.push((twos.map(it=>it.printName)))
  data.headers = headers;
  return  data
}

/**
 *
 * @param code 模版类型
 * @param stencils 模版数据
 */
export function getPrintStencilParameter(code: string,stencils:any) {
  let model = {fx: 'l', size: [210,297], fun: () => {}}
  switch (code) {
    case 'p2':
      model.size = [140,241]
      model.fun = (doc, printList, maxRowLen) => generatePrint(doc, printList, maxRowLen,stencils,241)
      break;
    case 'p3':
      model.size = [93,241]
      model.fun = (doc, printList, maxRowLen) => generatePrint(doc, printList, maxRowLen,stencils,241)
      break;
    case 'a4p':
      model.size = [210,297]
      model.fx = 'p'
      model.fun = (doc, printList,maxRowLen) => generatePrint(doc, printList, maxRowLen,stencils,210)
      break;
    default:
      model.size = [210,297]
      model.fun = (doc, printList,maxRowLen) => generatePrint(doc, printList, maxRowLen,stencils,297)
  }
  return model
}
