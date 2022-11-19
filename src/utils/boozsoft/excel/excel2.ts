import XLSX from "xlsx-js-style";
import { saveAs,s } from 'file-saver'


/**
 * @name: 转换格式
 * @param {type}
 * @return:
 */
function s2ab (s) {
  const b = new ArrayBuffer(s.length);
  const v = new Uint8Array(b);
  for (let i = 0; i < s.length; i++) {
    v[i] = s.charCodeAt(i) & 0xFF
  }
  return b;
}

/**
 * @name: 设置数据类型
 * @param {type}
 * @return:
 */
export function sheet_from_array_of_arrays (data, opts) {
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

export function writeExcel (wb, bookType, filename) {
  const wbout = XLSX.write(wb, {
    bookType: bookType,
    bookSST: false,
    type: 'binary'
  });
  // const reader = new FileReader();
  // reader.readAsArrayBuffer(wbout);
  window.top.ncSaveFile(s2ab(wbout),filename+'.'+bookType)
  // reader.onload = function (e) {
  //   let fileU8A = new Uint8Array(e.target.result);
  //   writeBinaryFile({ contents: fileU8A, path: `` });
  //   datas.tip = '图片保存成功';
  // };
  // const blob = new Blob([s2ab(wbout)], {
  //   type: "application/octet-stream"
  // })
  // console.log(blob)
  // saveAs(blob, `${filename}.${bookType}`);
}

export function Workbook() {
  class WB {
    constructor() {
      this.SheetNames = [];
      this.Sheets = {};
    }
  }

  return new WB()
}

export const defaultV = {
  sheetName: 'sheet',
  globalStyle: {
    border: {
      top: {
        style: 'thin',
        color: {rgb: "000000"}
      },
      bottom: {
        style: 'thin',
        color: {rgb: "000000"}
      },
      left: {
        style: 'thin',
        color: {rgb: "000000"}
      },
      right: {
        style: 'thin',
        color: {rgb: "000000"}
      }
    },
    font: {
      name: '宋体',
      sz: 10,
      color: {rgb: "000000"},
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
      fgColor: {rgb: "ffffff"},
    }
  },
}

