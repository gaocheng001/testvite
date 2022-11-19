import {
  parseTemplateParameters
} from "/@/views/boozsoft/stock/stock_sales_add/popup/ts/printTemplate";

/**
 * 两栏数据组装
 * @param dataArr 数据
 * @param etcInfo 表头表尾信息
 * @param rNumber 表体内容行数
 * @param stencils 模版数据
 */
export function dataModelBuildingTwoData(dataArr, etcInfo, rNumber: number,stencils) {
  let dataModel:any = []
  let markNumer = (dataArr.length < rNumber?dataArr.length:rNumber) -1
  let todys:any = []
  let page = Math.ceil(dataArr.length / rNumber)
  const temps = parseTemplateParameters(stencils).bodyList
  var number = 1
  for (let i =0;i<dataArr.length;i++){
    todys.push(dataArr[i])
    if (i == markNumer){
      let o:any = {etc: {},list: []}
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
const TwoDataConvert = (items, bodyList,dataArr)=> {
  var list:any = []
  var rowNumber = 1
  let slIndex = bodyList.findIndex(it=>it.systemName == '数量')
  let zslIndex = bodyList.findIndex(it=>it.systemName == '主数量')
  let djIndex = bodyList.findIndex(it=>it.systemName == '含税单价')
  let jsIndex = bodyList.findIndex(it=>it.systemName == '价税合计')
  let wdjIndex = bodyList.findIndex(it=>it.systemName == '无税单价')
  let wjsIndex = bodyList.findIndex(it=>it.systemName == '无税金额')
  let slTotal = 0
  let zslTotal = 0
  let wjsTotal = 0
  let wdjTotal = 0
  let djTotal = 0
  let jsTotal = 0
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
    if (slIndex != -1) slTotal=parseFloat(sumArr(dataArr.map(a=>a.cnumber)))
    if (zslIndex != -1) zslTotal=parseFloat(sumArr(dataArr.map(a=>a.baseQuantity)))
    if (wjsIndex != -1) wjsTotal=parseFloat(sumArr(dataArr.map(a=>a.icost)))
    if (wjsIndex != -1) jsTotal=parseFloat(sumArr(dataArr.map(a=>a.isum)))
    if (wdjIndex != -1) wdjTotal=wjsTotal/slTotal
    if (wdjIndex != -1) djTotal=jsTotal/slTotal

    list.push(item1)
    rowNumber+=1
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
  }
  if (items.length > 0){
    if (slIndex != -1)tObj[slIndex] = slTotal.toFixed(2)
    if (zslIndex != -1)tObj[zslIndex] = zslTotal.toFixed(2)
    if (wjsIndex != -1)tObj[wjsIndex] = wjsTotal.toFixed(2)
    if (wdjIndex != -1)tObj[wdjIndex] = wdjTotal.toFixed(2)
    if (djIndex != -1)tObj[djIndex] = djTotal.toFixed(2)
    if (jsIndex != -1)tObj[jsIndex] = jsTotal.toFixed(2)
  }
  list.push(tObj)
  return list
}

function sumArr(arr) {
  return arr.reduce(function(prev, curr){
    return parseFloat(prev) + parseFloat(curr);
  });
}






