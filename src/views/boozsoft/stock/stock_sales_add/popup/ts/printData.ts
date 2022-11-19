import {convertCurrency} from "/@/utils/boozsoft/moneyUtil";
import {tableStyle} from "/@/store/modules/abc-print";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {toThousandFilter} from "/@/views/boozsoft/gdzc/gu-ding-zi-chan-add/calculation";
import {useNewPrint} from "/@/utils/boozsoft/print/print";
import {parseTemplateParameters} from "/@/views/boozsoft/stock/stock_sales_add/popup/ts/printTemplate";

/**
 * 两栏数据组装
 * @param dataArr 数据
 * @param etcInfo 表头表尾信息
 * @param rNumber 表体内容行数
 * @param stencils 模版数据
 */
export function dataModelBuildingTwoData(dataArr, etcInfo, rNumber: number,stencils) {
  let dataModel = []
  let markNumer = (dataArr.length < rNumber?dataArr.length:rNumber) -1
  let todys = []
  let page = Math.ceil(dataArr.length / rNumber)
  const temps = parseTemplateParameters(stencils).bodyList
  var number = 1
  for (let i =0;i<dataArr.length;i++){
    todys.push(dataArr[i])
    if (i == markNumer){
      let o = {etc: {},list: []}
      if (todys.length < rNumber) { // 不足时 补充空白
        let cnum = rNumber - todys.length
        for (let j = 0; j < cnum; j++) {
          todys.push({})
        }
      }
      o.etc = JSON.parse(JSON.stringify(etcInfo))
      o.etc.index = `第${number}页 / 共${page}页`
      o.list = TwoDataConvert(todys,temps,dataArr)
      dataModel.push(o)
      todys = []
      number+=1
      markNumer = ((rNumber * number) < (dataArr.length)?((rNumber * number)-1):dataArr.length-1)
    }
  }
  return dataModel
}

/**
 * 两栏数据组装
 */
 const TwoDataConvert = (items, bodyList,dbList)=> {
  var list = []
  var rowNumber = 1
  let slIndex = bodyList.findIndex(it=>it.systemName == '数量')
  let zslIndex = bodyList.findIndex(it=>it.systemName == '主数量')
  let djIndex = bodyList.findIndex(it=>it.systemName == '含税单价')
  let wdjIndex = bodyList.findIndex(it=>it.systemName == '无税单价')
  let jsIndex = bodyList.findIndex(it=>it.systemName == '价税合计')
  let wjsIndex = bodyList.findIndex(it=>it.systemName == '无税金额')
  let seIndex = bodyList.findIndex(it=>it.systemName == '税额')
  let slTotal = 0
  let zslTotal = 0
  let djTotal = 0
  let wdjTotal = 0
  let jsTotal = 0
  let wjsTotal = 0
  let seTotal = 0
  items.forEach(it => {
    let item1 = {}
    for (let i = 0; i < bodyList.length; i++) {
      const e = bodyList[i];
      if (i==0){
        item1[i] = rowNumber
      }else {
        item1[i] = it[e.propertyName] || ''
      }
    }
/*    if (slIndex != -1) slTotal+=parseFloat(item1[slIndex] == ''? 0:item1[slIndex])
    if (zslIndex != -1) zslTotal+=parseFloat(item1[zslIndex] == ''? 0:item1[zslIndex])
    if (djIndex != -1) djTotal+=parseFloat(item1[djIndex] == ''? 0:item1[djIndex])
    if (wdjIndex != -1) wdjTotal+=parseFloat(item1[wdjIndex] == ''? 0:item1[wdjIndex])
    if (jsIndex != -1) jsTotal+=parseFloat(item1[jsIndex] == ''? 0:item1[jsIndex])
    if (wjsIndex != -1) wjsTotal+=parseFloat(item1[wjsIndex] == ''? 0:item1[wjsIndex])
    if (seIndex != -1) seTotal+=parseFloat(item1[seIndex] == ''? 0:item1[seIndex])*/
    list.push(item1)
    rowNumber+=1
  })
  dbList.forEach(it=>{
    if (slIndex != -1) slTotal+=parseFloat(it[ bodyList[slIndex].propertyName] == null? 0:it[ bodyList[slIndex].propertyName])
    if (zslIndex != -1) zslTotal+=parseFloat(it[ bodyList[zslIndex].propertyName] == null? 0:it[ bodyList[zslIndex].propertyName])
    if (djIndex != -1) djTotal+=parseFloat(it[ bodyList[djIndex].propertyName] == null? 0:it[ bodyList[djIndex].propertyName])
    if (wdjIndex != -1) wdjTotal+=parseFloat(it[ bodyList[wdjIndex].propertyName] == null? 0:it[ bodyList[wdjIndex].propertyName])
    if (jsIndex != -1) jsTotal+=parseFloat(it[ bodyList[jsIndex].propertyName] == null? 0:it[ bodyList[jsIndex].propertyName])
    if (wjsIndex != -1) wjsTotal+=parseFloat(it[ bodyList[wjsIndex].propertyName] == null? 0:it[ bodyList[wjsIndex].propertyName])
    if (seIndex != -1) seTotal+=parseFloat(it[ bodyList[seIndex].propertyName] == null? 0:it[ bodyList[seIndex].propertyName])
  })
  let tObj = {
    0: '合计：',
    1: '',
    2: '',
    3: '',
    4: '',
    5: '',
    6: '',
    7: '',
    8: '',
    9: '',
    10: '',
    11: '',
    12: '',
    13: '',
    14: '',
    15: '',
  }
  if (items.length > 0){
    if (slIndex != -1)tObj[slIndex] = slTotal.toFixed(2)
    if (zslIndex != -1)tObj[zslIndex] = zslTotal.toFixed(2)
    if (djIndex != -1)tObj[djIndex] = djTotal.toFixed(2)
    if (wdjIndex != -1)tObj[wdjIndex] = wdjTotal.toFixed(2)
    if (jsIndex != -1)tObj[jsIndex] = jsTotal.toFixed(2)
    if (wjsIndex != -1)tObj[wjsIndex] = wjsTotal.toFixed(2)
    if (seIndex != -1)tObj[seIndex] = seTotal.toFixed(2)
  }
  list.push(tObj)
  return list
}

export const voucherNoAutocomplete = (val, rule) => {
  let numberStr = parseInt(val) + ''
  let difference = rule - numberStr.length
  let prefix = ''
  let i = 0
  while (i < difference) {
    prefix += '0'
    i++;
  }
  return prefix + numberStr
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
