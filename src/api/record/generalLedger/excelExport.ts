import { saveAs } from 'file-saver'
import XLSX from 'xlsx-js-style'

export function writeExcel (wb, bookType, filename) {
  const wbout = XLSX.write(wb, {
    bookType: bookType,
    bookSST: false,
    type: 'binary'
  });
  const blob = new Blob([s2ab(wbout)], {
    type: "application/octet-stream"
  })
  saveAs(blob, `${filename}.${bookType}`);
}

/**
 * @name: 设置数据类型
 * @param {type}
 * @return:
 */
export function sheet_from_array_of_arrays (data) {
  let ws = {};
  const range = {
    s: {
      c: 1000000000,
      r: 1000000000
    },
    e: {
      c: 0,
      r: 0
    }
  };
  for (let R = 0; R != data.length; ++R) {
    for (let C = 0; C != data[R].length; ++C) {
      if (range.s.r > R) range.s.r = R;
      if (range.s.c > C) range.s.c = C;
      if (range.e.r < R) range.e.r = R;
      if (range.e.c < C) range.e.c = C;
      let cell = {
        v: data[R][C]
      };
      if (cell.v == null) continue;
      let cell_ref = XLSX.utils.encode_cell({
        c: C,
        r: R
      });

      if (typeof cell.v === 'number') cell.t = 'n';
      else if (typeof cell.v === 'boolean') cell.t = 'b';
      else if (cell.v instanceof Date) {
        cell.t = 'n';
        cell.z = XLSX.SSF._table[14];
        cell.v = this.datenum(cell.v);
      } else cell.t = 's';

      ws[cell_ref] = cell;
    }
  }
  if (range.s.c < 1000000000) ws['!ref'] = XLSX.utils.encode_range(range);
  return ws;
}

/**
 * @name: 转换格式
 * @param {type}
 * @return:
 */
export function s2ab (s) {
  const b = new ArrayBuffer(s.length);
  const v = new Uint8Array(b);
  for (let i = 0; i < s.length; i++) {
    v[i] = s.charCodeAt(i) & 0xFF
  }
  return b;
}
export function Workbook () {
  class WB {
    constructor() {
      this.SheetNames = [];
      this.Sheets = {};
    }
  }
  return new WB()
}
const sheet2= [
  {
    title: '插件信息',
    tHeader: ['作者', '语言', '插件名称', '插件用途'],
    table: [{ author: 'pikaz', language: 'javascript', name: 'pikaz-excel-js', application: 'excel的导入导出' }],
    keys: ['author', 'language', 'name', 'application'],
    sheetName: '插件信息',
    cellStyle: [
      {
        cell: 'A1',
        font: {
          sz: 14,
          color: { rgb: "ffffff" },
          bold: true,
        },
        fill: {
          fgColor: { rgb: "ff7e00" },
        }
      }
    ]
  },
  {
    title: '插件信息2',
    multiHeader: [['基础信息', '', '', '详细信息'], ['作者', '语言', '插件名称', '插件用途']],
    table: [{ author: 'pikaz', language: 'javascript', name: 'pikaz-excel-js', application: 'excel的导入导出' }],
    keys: ['author', 'language', 'name', 'application'],
    merges: ['A2:C2'],
    colWidth: [16, 16, 16, 20],
    sheetName: '插件信息2',
    globalStyle: {
      font: {
        color: { rgb: "ff7e00" },
      }
    },
    cellStyle: [
      {
        cell: 'A1',
        font: {
          name: '宋体',
          sz: 14,
          color: { rgb: "ffffff" },
          bold: true
        },
        fill: {
          fgColor: { rgb: "ff7e00" },
        }
      }
    ]
  }
]

const defaultV= {
  sheetName: 'sheet',
  globalStyle: {
    border: {
      top: {
        style: 'thin',
        color: { rgb: "000000" }
      },
      bottom: {
        style: 'thin',
        color: { rgb: "000000" }
      },
      left: {
        style: 'thin',
        color: { rgb: "000000" }
      },
      right: {
        style: 'thin',
        color: { rgb: "000000" }
      }
    },
    font: {
      name: '宋体',
      sz: 12,
      color: { rgb: "000000" },
      bold: false,
      italic: false,
      underline: false,
      shadow: false
    },
    alignment: {
      horizontal: "center",
      vertical: "center",
      wrapText: false
    },
    fill: {
      fgColor: { rgb: "ffffff" },
    }
  },
}

export function exportExcel (sheet, bookType, filename) {
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
      cellStyle,
      rightrow,
      leftrow,
    } = item
    sheetName = sheetName || defaultV.sheetName
    // 默认全局样式覆盖
    const dgStyle = defaultV.globalStyle
    if (globalStyle) {
      Object.keys(dgStyle).forEach(key => {
        globalStyle[key] = { ...dgStyle[key], ...globalStyle[key] }
      })
    } else {
      globalStyle = dgStyle
    }
    // 处理标题格式
    if (title || title === 0 || title === '') {
      // 取表头、多级表头中的最大值
      const tHeaderLength = tHeader && tHeader.length || 0
      const multiHeaderLength = multiHeader && Math.max(...multiHeader.map(m => m.length)) || 0
      const titleLength = Math.max(tHeaderLength, multiHeaderLength, keys.length)
      // 第一个元素为title，剩余以空字符串填充
      title = [title].concat(Array(titleLength - 1).fill(''))

      // 处理标题的合并
      const cell=['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z','AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ',]
      let mergeSecond='A1'
      let mergeSecond2='A2'
      if(titleLength>26){
        const one=parseInt(titleLength/26)
        const two=titleLength%26
        mergeSecond=cell[one-1]+cell[two-1]+'1'
        mergeSecond2=cell[one-1]+cell[two-1]+'2'
      }else{
        mergeSecond = cell[titleLength-1]+'1'
        mergeSecond2= cell[titleLength-1]+'2'
      }

      const titleMerge = `A1:${mergeSecond}`
      const titleMerge2 = `A2:${mergeSecond2}`
      if (!merges) {
        merges = [titleMerge]
      } else {
        if (merges.indexOf(titleMerge) === -1) {
          merges.push(titleMerge)
          merges.push(titleMerge2)
        }
      }
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
    // 如果没有列宽则自适应
    if (!colWidth) {
      // 基准比例，以12为标准
      const benchmarkRate = globalStyle.font.sz && globalStyle.font.sz / 12 || 1
      // 空字符长度
      const nullstr = 10 * benchmarkRate + 2
      // 单个中文字符长度
      const chinese = 2 * benchmarkRate
      // 单个非中文字符长度
      const nChinese = benchmarkRate
      //设置worksheet每列的最大宽度,并+2调整一点列宽
      const sheetColWidth = data.map(row => row.map(val => {
        //先判断是否为null/undefined
        if (!val) {
          return {
            'wch': nullstr
          };
        } else {
          const strArr = val.toString().split('')
          const pattern = new RegExp("[\u4E00-\u9FA5]+")
          let re = strArr.map(str => {
            // 是否为中文
            if (pattern.test(str)) {
              return chinese
            } else {
              return nChinese
            }
          })
          re = re.reduce((total, r) => total + r, 0)
          return {
            'wch': re + 2
          };
        }
      }))
      /*以第二行为初始值*/
      let result = sheetColWidth[0];
      for (let i = 2; i < sheetColWidth.length; i++) {
        for (let j = 0; j < sheetColWidth[i].length; j++) {
          if (result[j]['wch'] < sheetColWidth[i][j]['wch']) {
            result[j]['wch'] = sheetColWidth[i][j]['wch'];
          }
        }
      }
      ws['!cols'] = result;
    } else {
      ws['!cols'] = colWidth.map(i => {
        return { wch: i }
      })
    }

    // 添加工作表
    wb.SheetNames.push(sheetName);
    wb.Sheets[sheetName] = ws;
    let dataInfo = wb.Sheets[wb.SheetNames[index]];

    //全局样式
    (function () {
      Object.keys(dataInfo).forEach(i => {
        if (i == '!ref' || i == '!merges' || i == '!cols') {
        }
        else {
           dataInfo[i.toString()].s = globalStyle;

          let rightrows = rightrow
          let leftrows = leftrow

          const {border, font, alignment, fill} = globalStyle;

          if (i.substring(1) == '1') {
            dataInfo[i.toString()].s = {
              border: {},
              font: font || globalStyle.font,
              alignment: alignment || globalStyle.alignment,
              fill: fill || globalStyle.fill
            }
          } else if (i.substring(1) == '2') {
            dataInfo[i.toString()].s = {
              border: {},
              font: font || globalStyle.font,
              alignment: alignment || globalStyle.alignment,
              fill: fill || globalStyle.fill
              // border: {},
              // font: {
              //   name: '宋体',
              //   //sz: 10,
              //   color: {rgb: "000000"},
              //   bold: true,
              // },
              // fill: fill || globalStyle.fill,
              // alignment: {
              //   horizontal: "left",
              // }
            }
          }

          if (i.substring(1) == '3' || i.substring(1) == '4') {//3 4行表头加粗
                dataInfo[i.toString()].s = {
                  border: border === {} ? border : border || globalStyle.border,
                  font: {
                    name: '宋体',
                    //sz: 10,
                    color: {rgb: "000000"},
                    bold: true,
                  },
                  alignment: alignment || globalStyle.alignment,
                  fill: {fgColor: {rgb: "cccccc"}}
                }
              }
          else if (rightrows.indexOf(i.substring(0, 1)) > -1) {   // 这些列数据都是居右
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "right",
              }
            }
          } else if (leftrows.indexOf(i.substring(0, 1)) > -1) {   // 这些列数据都是居左
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "left",
              }
            }
          }else{//其余居中
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "center",
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
        const { border, font, alignment, fill } = s;
        dataInfo[s.cell].s = {
          border: false ? border : border || globalStyle.border,
          // border: border === {} ? border : border || globalStyle.border,
          font: font || globalStyle.font,
          alignment: alignment || globalStyle.alignment,
          fill: fill || globalStyle.fill
        }
      });
    })();
  })
  // 类型默认为xlsx
  writeExcel(wb, bookType, filename)
}


export function exportExcel2 (sheet, bookType, filename) {
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
      cellStyle,
      rightrow,
      leftrow,
    } = item
    sheetName = sheetName || defaultV.sheetName
    // 默认全局样式覆盖
    const dgStyle = defaultV.globalStyle
    if (globalStyle) {
      Object.keys(dgStyle).forEach(key => {
        globalStyle[key] = { ...dgStyle[key], ...globalStyle[key] }
      })
    } else {
      globalStyle = dgStyle
    }
    // 处理标题格式
    if (title || title === 0 || title === '') {
      // 取表头、多级表头中的最大值
      // const tHeaderLength = tHeader && tHeader.length || 0
      // const multiHeaderLength = multiHeader && Math.max(...multiHeader.map(m => m.length)) || 0
      // const titleLength = Math.max(tHeaderLength, multiHeaderLength, keys.length)
      // // 第一个元素为title，剩余以空字符串填充
      // title = [title].concat(Array(titleLength - 1).fill(''))
      //
      // // 处理标题的合并\
      // const cell=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','AA', 'AB','AC']
      // let mergeSecond='A1'
      // if(titleLength>26){
      //   const one=parseInt(titleLength/26)
      //   const two=titleLength%26
      //   mergeSecond=cell[one-1]+cell[two-1]+'1'
      // }else{
      //   mergeSecond = cell[titleLength-1]+'1'
      // }
      // const titleMerge = `A1:${mergeSecond}`
      // const titleMerge2 = `A2:${mergeSecond}`
      // if (!merges) {
      //   merges = [titleMerge]
      // } else {
      //   if (merges.indexOf(titleMerge) === -1) {
      //     merges.push(titleMerge)
      //     merges.push(titleMerge2)
      //   }
      // }
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
    //tHeader && data.unshift(tHeader);
    //title && data.unshift(title);
    const ws = sheet_from_array_of_arrays(data);
    if (merges && merges.length > 0) {
      if (!ws['!merges']) ws['!merges'] = [];
      merges.forEach(merge => {
        ws['!merges'].push(XLSX.utils.decode_range(merge))
      })
    }
    // 如果没有列宽则自适应
    if (!colWidth) {
      // 基准比例，以12为标准
      const benchmarkRate = globalStyle.font.sz && globalStyle.font.sz / 12 || 1
      // 空字符长度
      const nullstr = 10 * benchmarkRate + 2
      // 单个中文字符长度
      const chinese = 2 * benchmarkRate
      // 单个非中文字符长度
      const nChinese = benchmarkRate
      //设置worksheet每列的最大宽度,并+2调整一点列宽
      const sheetColWidth = data.map(row => row.map(val => {
        //先判断是否为null/undefined
        if (!val) {
          return {
            'wch': nullstr
          };
        } else {
          const strArr = val.toString().split('')
          const pattern = new RegExp("[\u4E00-\u9FA5]+")
          let re = strArr.map(str => {
            // 是否为中文
            if (pattern.test(str)) {
              return chinese
            } else {
              return nChinese
            }
          })
          re = re.reduce((total, r) => total + r, 0)
          return {
            'wch': re + 2
          };
        }
      }))
      /*以第二行为初始值*/
      let result = sheetColWidth[0];

      for (let i = 0; i < sheetColWidth.length; i++) {
        for (let j = 0; j < sheetColWidth[i].length; j++) {
          if (result[j]['wch'] < sheetColWidth[i][j]['wch']) {
            result[j]['wch'] = sheetColWidth[i][j]['wch'];
          }
        }
      }
      ws['!cols'] = result;
    } else {
      ws['!cols'] = colWidth.map(i => {
        return { wch: i }
      })
    }

    // 添加工作表
    wb.SheetNames.push(sheetName);
    wb.Sheets[sheetName] = ws;
    let dataInfo = wb.Sheets[wb.SheetNames[index]];

    //全局样式
    (function () {
      Object.keys(dataInfo).forEach(i => {
        if (i == '!ref' || i == '!merges' || i == '!cols') {
        }
        else {
          dataInfo[i.toString()].s = globalStyle;

          let rightrows = rightrow
          let leftrows = leftrow

          const {border, font, alignment, fill} = globalStyle;

          /*          if (i.substring(1) == '1') {
                      dataInfo[i.toString()].s = {
                        border: {},
                        font: font || globalStyle.font,
                        alignment: alignment || globalStyle.alignment,
                        fill: fill || globalStyle.fill
                      }
                    } else if (i.substring(1) == '2') {
                      dataInfo[i.toString()].s = {
                        border: {},
                        font: {
                          name: '宋体',
                          //sz: 10,
                          color: {rgb: "000000"},
                          bold: true,
                        },
                        fill: fill || globalStyle.fill,
                        alignment: {
                          horizontal: "left",
                        }
                      }
                    }*/

          if (i.substring(1) == '1' || i.substring(1) == '2') {//3 4行表头加粗
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: {
                name: '宋体',
                //sz: 10,
                color: {rgb: "000000"},
                bold: true,
              },
              alignment: alignment || globalStyle.alignment,
              fill: {fgColor: {rgb: "cccccc"}}
            }
          }else if (rightrows.indexOf(i.substring(0, 1)) > -1) {   // 这些列数据都是居右
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "right",
              }
            }
          } else if (leftrows.indexOf(i.substring(0, 1)) > -1) {   // 这些列数据都是居左
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "left",
              }
            }
          }else{//其余居中
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "center",
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
        const { border, font, alignment, fill } = s;
        dataInfo[s.cell].s = {
          border: false ? border : border || globalStyle.border,
          // border: border === {} ? border : border || globalStyle.border,
          font: font || globalStyle.font,
          alignment: alignment || globalStyle.alignment,
          fill: fill || globalStyle.fill
        }
      });
    })();
  })
  // 类型默认为xlsx
  writeExcel(wb, bookType, filename)
}

/**
 * 单行表头,不上下合并,没有标题
 * @param sheet
 * @param bookType
 * @param filename
 */
export function exportExcel3 (sheet, bookType, filename) {
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
      cellStyle,
      rightrow,
      leftrow,
    } = item
    sheetName = sheetName || defaultV.sheetName
    // 默认全局样式覆盖
    const dgStyle = defaultV.globalStyle
    if (globalStyle) {
      Object.keys(dgStyle).forEach(key => {
        globalStyle[key] = { ...dgStyle[key], ...globalStyle[key] }
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
    const ws = sheet_from_array_of_arrays(data);
    // 如果没有列宽则自适应
    if (!colWidth) {
      // 基准比例，以12为标准
      const benchmarkRate = globalStyle.font.sz && globalStyle.font.sz / 12 || 1
      // 空字符长度
      const nullstr = 10 * benchmarkRate + 2
      // 单个中文字符长度
      const chinese = 2 * benchmarkRate
      // 单个非中文字符长度
      const nChinese = benchmarkRate
      //设置worksheet每列的最大宽度,并+2调整一点列宽
      const sheetColWidth = data.map(row => row.map(val => {
        //先判断是否为null/undefined
        if (!val) {
          return {
            'wch': nullstr
          };
        } else {
          const strArr = val.toString().split('')
          const pattern = new RegExp("[\u4E00-\u9FA5]+")
          let re = strArr.map(str => {
            // 是否为中文
            if (pattern.test(str)) {
              return chinese
            } else {
              return nChinese
            }
          })
          re = re.reduce((total, r) => total + r, 0)
          return {
            'wch': re + 2
          };
        }
      }))
      /*以第二行为初始值*/
      let result = sheetColWidth[0];
      for (let i = 0; i < sheetColWidth.length; i++) {
        for (let j = 0; j < sheetColWidth[i].length; j++) {
          if (result[j]['wch'] < sheetColWidth[i][j]['wch']) {
            result[j]['wch'] = sheetColWidth[i][j]['wch'];
          }
        }
      }
      ws['!cols'] = result;
    } else {
      ws['!cols'] = colWidth.map(i => {
        return { wch: i }
      })
    }
    // 添加工作表
    wb.SheetNames.push(sheetName);
    wb.Sheets[sheetName] = ws;
    let dataInfo = wb.Sheets[wb.SheetNames[index]];

    //全局样式
    (function () {
      Object.keys(dataInfo).forEach(i => {
        if (i == '!ref' || i == '!merges' || i == '!cols') {
        }
        else {
          dataInfo[i.toString()].s = globalStyle;

          let rightrows = rightrow
          let leftrows = leftrow

          const {border, font, alignment, fill} = globalStyle;
          if (i.substring(1) == '1') {
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: {
                name: '宋体',
                //sz: 10,
                color: {rgb: "000000"},
                bold: true,
              },
              alignment: alignment || globalStyle.alignment,
              fill: {fgColor: {rgb: "cccccc"}}
            }
          }else if (rightrows.indexOf(i.substring(0, 1)) > -1) {   // 这些列数据都是居右
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "right",
              }
            }
          } else if (leftrows.indexOf(i.substring(0, 1)) > -1) {   // 这些列数据都是居左
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "left",
              }
            }
          }else{//其余居中
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "center",
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
        const { border, font, alignment, fill } = s;
        dataInfo[s.cell].s = {
          border: false ? border : border || globalStyle.border,
          // border: border === {} ? border : border || globalStyle.border,
          font: font || globalStyle.font,
          alignment: alignment || globalStyle.alignment,
          fill: fill || globalStyle.fill
        }
      });
    })();
  })
  // 类型默认为xlsx
  writeExcel(wb, bookType, filename)
}

/**
 * 单行表头,不上下合并,有标题
 * @param sheet
 * @param bookType
 * @param filename
 */
export function exportExcel4 (sheet, bookType, filename) {
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
      cellStyle,
      rightrow,
      leftrow,
    } = item
    sheetName = sheetName || defaultV.sheetName
    // 默认全局样式覆盖
    const dgStyle = defaultV.globalStyle
    if (globalStyle) {
      Object.keys(dgStyle).forEach(key => {
        globalStyle[key] = { ...dgStyle[key], ...globalStyle[key] }
      })
    } else {
      globalStyle = dgStyle
    }
    // 处理标题格式
    if (title || title === 0 || title === '') {
      // 取表头、多级表头中的最大值
      const tHeaderLength = tHeader && tHeader.length || 0
      const multiHeaderLength = multiHeader && Math.max(...multiHeader.map(m => m.length)) || 0
      const titleLength = Math.max(tHeaderLength, multiHeaderLength, keys.length)
      // 第一个元素为title，剩余以空字符串填充
      title = [title].concat(Array(titleLength - 1).fill(''))

      // 处理标题的合并
      const cell=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','AA', 'AB','AC']
      let mergeSecond='A1'
      let mergeSecond2='A2'
      if(titleLength>26){
        const one=parseInt(titleLength/26)
        const two=titleLength%26
        mergeSecond=cell[one-1]+cell[two-1]+'1'
        mergeSecond2=cell[one-1]+cell[two-1]+'2'
      }else{
        mergeSecond = cell[titleLength-1]+'1'
        mergeSecond2= cell[titleLength-1]+'2'
      }

      const titleMerge = `A1:${mergeSecond}`
      const titleMerge2 = `A2:${mergeSecond2}`
      merges = [titleMerge,titleMerge2]
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
    // 如果没有列宽则自适应
    if (!colWidth) {
      // 基准比例，以12为标准
      const benchmarkRate = globalStyle.font.sz && globalStyle.font.sz / 12 || 1
      // 空字符长度
      const nullstr = 10 * benchmarkRate + 2
      // 单个中文字符长度
      const chinese = 2 * benchmarkRate
      // 单个非中文字符长度
      const nChinese = benchmarkRate
      //设置worksheet每列的最大宽度,并+2调整一点列宽
      const sheetColWidth = data.map(row => row.map(val => {
        //先判断是否为null/undefined
        if (!val) {
          return {
            'wch': nullstr
          };
        } else {
          const strArr = val.toString().split('')
          const pattern = new RegExp("[\u4E00-\u9FA5]+")
          let re = strArr.map(str => {
            // 是否为中文
            if (pattern.test(str)) {
              return chinese
            } else {
              return nChinese
            }
          })
          re = re.reduce((total, r) => total + r, 0)
          return {
            'wch': re + 2
          };
        }
      }))
      /*以第二行为初始值*/
      let result = sheetColWidth[0];
      for (let i = 2; i < sheetColWidth.length; i++) {
        for (let j = 0; j < sheetColWidth[i].length; j++) {
          if (result[j]['wch'] < sheetColWidth[i][j]['wch']) {
            result[j]['wch'] = sheetColWidth[i][j]['wch'];
          }
        }
      }
      ws['!cols'] = result;
    } else {
      ws['!cols'] = colWidth.map(i => {
        return { wch: i }
      })
    }

    // 添加工作表
    wb.SheetNames.push(sheetName);
    wb.Sheets[sheetName] = ws;
    let dataInfo = wb.Sheets[wb.SheetNames[index]];

    //全局样式
    (function () {
      Object.keys(dataInfo).forEach(i => {
        if (i == '!ref' || i == '!merges' || i == '!cols') {
        }
        else {
          dataInfo[i.toString()].s = globalStyle;

          let rightrows = rightrow
          let leftrows = leftrow

          const {border, font, alignment, fill} = globalStyle;
          if (i.substring(1) == '3') {//3行表头加粗
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: {
                name: '宋体',
                //sz: 10,
                color: {rgb: "000000"},
                bold: true,
              },
              alignment: alignment || globalStyle.alignment,
              fill: {fgColor: {rgb: "cccccc"}}
            }
          }
          else if (rightrows.indexOf(i.substring(0, 1)) > -1) {   // 这些列数据都是居右
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "right",
              }
            }
          } else if (leftrows.indexOf(i.substring(0, 1)) > -1) {   // 这些列数据都是居左
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "left",
              }
            }
          }else{//其余居中
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "center",
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
        dataInfo[s.cell].s = {
          font: s.font ,
          alignment: s.alignment ,
          fill: s.fill
        }
      });
    })();
  })
  // 类型默认为xlsx
  writeExcel(wb, bookType, filename)
}

export function exportExcel5 (sheet, bookType, filename) {
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
      cellStyle,
      rightrow,
      leftrow,
    } = item
    sheetName = sheetName || defaultV.sheetName
    // 默认全局样式覆盖
    const dgStyle = defaultV.globalStyle
    if (globalStyle) {
      Object.keys(dgStyle).forEach(key => {
        globalStyle[key] = { ...dgStyle[key], ...globalStyle[key] }
      })
    } else {
      globalStyle = dgStyle
    }
    // 处理标题格式
    if (title || title === 0 || title === '') {
      // 取表头、多级表头中的最大值
      const tHeaderLength = tHeader && tHeader.length || 0
      const multiHeaderLength = multiHeader && Math.max(...multiHeader.map(m => m.length)) || 0
      const titleLength = Math.max(tHeaderLength, multiHeaderLength, keys.length)
      // 第一个元素为title，剩余以空字符串填充
      title = [title].concat(Array(titleLength - 1).fill(''))

      // 处理标题的合并
      const cell=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','AA', 'AB','AC']
      let mergeSecond='A1'
      let mergeSecond2='A2'
      if(titleLength>26){
        const one=parseInt(titleLength/26)
        const two=titleLength%26
        mergeSecond=cell[one-1]+cell[two-1]+'1'
        mergeSecond2=cell[one-1]+cell[two-1]+'2'
      }else{
        mergeSecond = cell[titleLength-1]+'1'
        mergeSecond2= cell[titleLength-1]+'2'
      }

      const titleMerge = `A1:${mergeSecond}`
      const titleMerge2 = `A2:${mergeSecond2}`
      if (!merges) {
        merges = [titleMerge]
      } else {
        if (merges.indexOf(titleMerge) === -1) {
          merges.push(titleMerge)
          merges.push(titleMerge2)
        }
      }
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
    // 如果没有列宽则自适应
    if (!colWidth) {
      // 基准比例，以12为标准
      const benchmarkRate = globalStyle.font.sz && globalStyle.font.sz / 12 || 1
      // 空字符长度
      const nullstr = 10 * benchmarkRate + 2
      // 单个中文字符长度
      const chinese = 2 * benchmarkRate
      // 单个非中文字符长度
      const nChinese = benchmarkRate
      //设置worksheet每列的最大宽度,并+2调整一点列宽
      const sheetColWidth = data.map(row => row.map(val => {
        //先判断是否为null/undefined
        if (!val) {
          return {
            'wch': nullstr
          };
        } else {
          const strArr = val.toString().split('')
          const pattern = new RegExp("[\u4E00-\u9FA5]+")
          let re = strArr.map(str => {
            // 是否为中文
            if (pattern.test(str)) {
              return chinese
            } else {
              return nChinese
            }
          })
          re = re.reduce((total, r) => total + r, 0)
          return {
            'wch': re + 2
          };
        }
      }))
      /*以第二行为初始值*/
      let result = sheetColWidth[0];
      for (let i = 2; i < sheetColWidth.length; i++) {
        for (let j = 0; j < sheetColWidth[i].length; j++) {
          if (result[j]['wch'] < sheetColWidth[i][j]['wch']) {
            result[j]['wch'] = sheetColWidth[i][j]['wch'];
          }
        }
      }
      ws['!cols'] = result;
    } else {
      ws['!cols'] = colWidth.map(i => {
        return { wch: i }
      })
    }

    // 添加工作表
    wb.SheetNames.push(sheetName);
    wb.Sheets[sheetName] = ws;
    let dataInfo = wb.Sheets[wb.SheetNames[index]];

    //全局样式
    (function () {
      Object.keys(dataInfo).forEach(i => {
        if (i == '!ref' || i == '!merges' || i == '!cols') {
        }
        else {
          dataInfo[i.toString()].s = globalStyle;

          let rightrows = rightrow
          let leftrows = leftrow

          const {border, font, alignment, fill} = globalStyle;

          if (i.substring(1) == '1') {
            dataInfo[i.toString()].s = {
              border: {},
              font: font || globalStyle.font,
              alignment: alignment || globalStyle.alignment,
              fill: fill || globalStyle.fill
            }
          } else if (i.substring(1) == '2') {
            dataInfo[i.toString()].s = {
              border: {},
              font: font || globalStyle.font,
              alignment: alignment || globalStyle.alignment,
              fill: fill || globalStyle.fill
              // border: {},
              // font: {
              //   name: '宋体',
              //   //sz: 10,
              //   color: {rgb: "000000"},
              //   bold: true,
              // },
              // fill: fill || globalStyle.fill,
              // alignment: {
              //   horizontal: "left",
              // }
            }
          }

          if (i.substring(1) == '2' || i.substring(1) == '2') {//3 4行表头加粗
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: {
                name: '宋体',
                //sz: 10,
                color: {rgb: "000000"},
                bold: true,
              },
              alignment: alignment || globalStyle.alignment,
              fill: {fgColor: {rgb: "cccccc"}}
            }
          }
          else if (rightrows.indexOf(i.substring(0, 1)) > -1) {   // 这些列数据都是居右
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "right",
              }
            }
          } else if (leftrows.indexOf(i.substring(0, 1)) > -1) {   // 这些列数据都是居左
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "left",
              }
            }
          }else{//其余居中
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "center",
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
        const { border, font, alignment, fill } = s;
        dataInfo[s.cell].s = {
          border: false ? border : border || globalStyle.border,
          // border: border === {} ? border : border || globalStyle.border,
          font: font || globalStyle.font,
          alignment: alignment || globalStyle.alignment,
          fill: fill || globalStyle.fill
        }
      });
    })();
  })
  // 类型默认为xlsx
  writeExcel(wb, bookType, filename)
}
