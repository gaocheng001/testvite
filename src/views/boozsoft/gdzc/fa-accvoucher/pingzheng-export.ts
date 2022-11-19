import XLSX from "xlsx-js-style";
import {sheet_from_array_of_arrays, Workbook, writeExcel, defaultV} from "/@/utils/boozsoft/excel/excel2";
/************ 凭证导出 *************/
export function exportExcel ({titles,tables,fileName}) {
  // 获取当前账套所有带辅助核算的科目
  let colWidths = [15,20]
  if (titles.length > 2){
    let leng = titles.length - 2
    for (let i = 0;i < leng;i++){
      colWidths.push(12)
    }
  }
  const sheet= [
    {
      tHeader: titles,
      table: tables,
      keys: titles,
      cellStyle: [
        // {
        //   cell: 'A1',
        //   font: {
        //    // color: { rgb: "FF0000" },
        //   },
        // },
        // {
        //   cell: 'B1',
        //   font: {
        //    // color: { rgb: "000000" },
        //   },
        // },
        // {
        //   cell: 'C1',
        //   font: {
        //    // color: { rgb: "FF0000" },
        //   },
        // },
        // {
        //   cell: 'D1',
        //   font: {
        //    // color: { rgb: "FF0000" },
        //   },
        // },
        // {
        //   cell: 'E1',
        //   font: {
        //    // color: { rgb: "FF0000" },
        //   },
        // },
        // {
        //   cell: 'F1',
        //   font: {
        //    // color: { rgb: "FF0000" },
        //   },
        // },
        // {
        //   cell: 'G1',
        //   font: {
        //    // color: { rgb: "FF0000" },
        //   },
        // },
        // {
        //   cell: 'H1',
        //   font: {
        //    // color: { rgb: "FF0000" },
        //   },
        // },
        // {
        //   cell: 'I1',
        //   font: {
        //    // color: { rgb: "FF0000" },
        //   },
        // },
        // {
        //   cell: 'J1',
        //   font: {
        //    // color: { rgb: "FF0000" },
        //   },
        // },
        // {
        //   cell: 'K1',
        //   font: {
        //    // color: { rgb: "FF0000" },
        //   },
        // },
      ],
      colWidth: colWidths
    }
  ]

  // 处理数据前
  if (!sheet || sheet.length <= 0) {
    this.onError('Table data cannot be empty')
    return
  }
  const wb = Workbook()




  sheet.forEach((item, index) => {
    let {
      // 标题
      title,
      // 表头
      tHeader,
      // 多级表头
      multiHeader,
      // 表格数据
      table,
      // 表格底部数据
      foot,
      // 合并项
      merges,
      // 数据键值
      keys,
      // 列宽
      colWidth,
      // 表名
      sheetName,
      // 全局样式
      globalStyle,
      // 单元格样式
      cellStyle
    } = item
    sheetName = sheetName || defaultV.sheetName
    // 默认全局样式覆盖
    const dgStyle = defaultV.globalStyle
    if (globalStyle) {
      Object.keys(dgStyle).forEach(key => {
        globalStyle[key] = {...dgStyle[key], ...globalStyle[key]}
      })
    } else {
      globalStyle = dgStyle
    }
    //表头对应字段
    let data = table.map(v => keys.map(j => v[j]))
    // 多级表头
    if (multiHeader) {
      // 倒序循环
      for (let i = multiHeader.length - 1; i >= 0; i--) {
        data.unshift(multiHeader[i]);
      }
    }
    tHeader && data.unshift(tHeader);
    title && data.unshift(title);
    const ws = sheet_from_array_of_arrays(data);
    if (merges && merges.length > 0) {
      if (!ws['!merges']) ws['!merges'] = [];
      merges.forEach(merge => {
        ws['!merges'].push(XLSX.utils.decode_range(merge))
      })
    }

    ws['!cols'] = colWidth.map(i => {
      return {wch: i}
    })

    // 添加工作表
    wb.SheetNames.push(sheetName);
    wb.Sheets[sheetName] = ws;
    let dataInfo = wb.Sheets[wb.SheetNames[index]];

    (function () {
      let rightArr = []
      Object.keys(dataInfo).forEach(i => {
        if (i == '!ref' || i == '!merges' || i == '!cols') {
        } else {
          // debugger
          dataInfo[i.toString()].s = globalStyle;
          let flag =  dataInfo[i.toString()].v == '原币借方金额' || dataInfo[i.toString()].v == '原币贷方金额' || dataInfo[i.toString()].v == '凭证金额'
          if (i.substring(1)=='1' && flag){
            rightArr.push(i.substring(0,1))
          }
          const {border, font, alignment, fill} = globalStyle;
          if (i.substring(1)=='1'){
            dataInfo[i.toString()].s = {
              border: border == {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              alignment: {
                horizontal: "center",
              },
              fill: fill || globalStyle.fill
            }
          }  else if ( rightArr.indexOf(i.substring(0,1)) != -1) {
            dataInfo[i.toString()].s = {
              border: border == {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "right",
              }
            }
          }
        }
      });
    })();
    // 单个样式
    (function () {
      if (!cellStyle || cellStyle.length <= 0) {
        return
      }
      cellStyle.forEach(s => {
        const {border, font, alignment, fill} = s;
        dataInfo[s.cell].s = {
          border: border == {} ? border : border || globalStyle.border,
          font: font || globalStyle.font,
          alignment: alignment || globalStyle.alignment,
          fill: fill || globalStyle.fill
        }
      });
    })();
  })
  // 类型默认为xlsx
  const bookType = 'xlsx'
  writeExcel(wb, bookType, fileName)
}
export function startExportBefore({titles,tableRef,fileName}){
  let trs = tableRef.$refs.wrapRef?.childNodes[1]?.getElementsByTagName("tr")
  let tableTexts = []
  if (null != trs && trs.length > 1){
    for (let i = 1;i < trs.length;i++){
      let celValues = {}
      for (let j = 1;j < trs[i].cells.length;j++){
        celValues[titles[(j-1)]] =  null == trs[i].cells[j]?'':trs[i].cells[j]?.innerText
      }
      tableTexts.push(celValues)
    }
  }
  exportExcel({titles: titles,tables: tableTexts,fileName: fileName})
}
