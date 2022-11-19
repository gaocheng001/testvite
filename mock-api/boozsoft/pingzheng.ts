import {resultSuccess} from '../../mock/_util';
import {MockMethod} from 'vite-plugin-mock';
import {any} from "vue-types";
import {  accvoucher_total} from "../_datatable/_pingzheng";
const accvocher=null
function ok(data) {
  return {
    "code": 0,
    "type": "success",
    "message": "ok",
    "result": {"total": 1365, "items": data, list: null}
  }
}
/*
*
* {
  constant: { currency: '人民币元' },
  variable: {
    periodStart: '2021-05',
    periodEnd: '2021-05',
    dateStart: '',
    dateEnd: '',
    voucherNumberStart: '001',
    voucherNumberEnd: '004',
    voucherType: '记',
    summary: '费',
    reviewStatus: '0',
    bookStatus: '0',
    subjectNumber: '',
    direction: '',
    amountMax: '200',
    amountMin: '100',
    numberMax: '',
    numberMin: '',
    wbAmountMax: '',
    wbAmountMin: '',
    billNumberStart: '',
    billNumberEnd: '',
    preparedMan: '',
    cashierMan: '',
    reviewMan: '',
    bookMan: ''
  },
  openOne: 1
}
*
* */
// admin页 end
export default [
  {
    url: '/api/accvoucher/findAllPingZhengList22',
    timeout: 0,
    method: 'post',
    response: ({body}) => {
      const { page, pageSize, queryMark, condition,searchConditon,filterConditon} = body // get
      // const {interval, page, pageSize, queryMark, year} = body //post
      const _accvoucher_all={"code":0,"type":"success","message":"ok","result":{"items":[]}}
      let startP = condition.variable.periodStart.replace('-','')
      let endP = condition.variable.periodEnd.replace('-','')
      let startD = condition.variable.dateStart
      let endD = condition.variable.dateEnd
      let startV = condition.variable.voucherNumberStart
      let endV = condition.variable.voucherNumberEnd
      let type = condition.variable.voucherType
      let summary = condition.variable.summary
      let amountMin = condition.variable.amountMin
      let amountMax = condition.variable.amountMax
      let direction = condition.variable.direction
      let reviewStatus = condition.variable.reviewStatus
      let bookStatus = condition.variable.bookStatus
      if (
        page == 1 &&
        pageSize == 200 &&
      /*  year == "2021"&&*/
        // interval ==  '["2021-01-01","2021-02-28"]' &&
        queryMark == "1"
      ) {
         console.log('过滤前------------》'+accvocher.length)
         let accvocherNew = accvocher.filter(item=>{
          if (startP != ''){
            if (item.iyperiod < startP ||  item.iyperiod > endP) return false
          }else {
            if (item.dbillDate <startD || item.dbillDate > endD) return false
          }
          if (startV != '' && endV != ''){
            if (item.inoId < startV || item.inoId　> endV) return false
          }
          if (type != '' && type != item.csign)return  false
          if ( summary != '' && item.cdigest.indexOf(summary) == -1)return false
          if (bookStatus != '' && bookStatus != item.ibook) return false
          if (reviewStatus != '' && '' == item.ccheck) return false
          if (amountMin  != '' && amountMax != ''){
            let md = item.md=='' || item.md== null?'0':item.md
            let mc = item.mc=='' || item.mc == null?'0':item.mc
            if (direction != '' && direction=='jf'){
              if (parseFloat(md) < parseFloat(amountMin) || parseFloat(md) > parseFloat(amountMax))return false
            }else if (direction != '' && direction=='df'){
              if (parseFloat(mc) < parseFloat(amountMin) || parseFloat(mc) > parseFloat(amountMax))return false
            }else if (direction == '' && (md != '0' || mc != '0')) {
              if (md != '0' && md != '0.00'){
                if (parseFloat(md) < parseFloat(amountMin) || parseFloat(md) > parseFloat(amountMax)) return false

              }else if (mc != '0' && mc != '0.00') {
                if (parseFloat(mc) < parseFloat(amountMin) || parseFloat(mc) > parseFloat(amountMax)) return false
              }
            }
          }
          return true
        })
        if (searchConditon.value != ''){
          accvocherNew = accvocherNew.filter(item=>{
            if (null == item[searchConditon.requirement] ||  item[searchConditon.requirement] == '' || item[searchConditon.requirement].indexOf(searchConditon.value) == -1)return false
            return true
          })
        }
        if (filterConditon.amountMin != '' && filterConditon.amountMax != ''){
          accvocherNew = accvocherNew.filter(item=>{
            let md = item.md=='' || item.md== null?'0':item.md
            let mc = item.mc=='' || item.mc == null?'0':item.mc
            if (md != '0' && md != '0.00'){
              if (parseFloat(md) < parseFloat(filterConditon.amountMin) || parseFloat(md) > parseFloat(filterConditon.amountMax)) return false
            }else if (mc != '0' && mc != '0.00') {
              if (parseFloat(mc) < parseFloat(filterConditon.amountMin) || parseFloat(mc) > parseFloat(filterConditon.amountMax)) return false
            }
            return true
          })
        }
        console.log('过滤后------------》'+accvocherNew.length)
        _accvoucher_all.result.items = accvocherNew.splice(0,20)
        return _accvoucher_all
      } else if(
        page == 1 &&
        pageSize == 200 &&
 /*       year == "2021"&&*/
        // interval ==  '["2021-01-01","2021-02-28"]' &&
        queryMark == "2"
      ){
        const _accvoucher_mix=JSON.parse(JSON.stringify(accvoucher_total))
        console.log('过滤前------------》'+_accvoucher_mix.result.items.length)
        let filterList = _accvoucher_mix.result.items.filter(item=>{
          if (startP != ''){
            if (item.iyperiod < startP ||  item.iyperiod > endP) return false
          }else {
            if (item.dbillDate <startD || item.dbillDate > endD) return false
          }
          if (startV != '' && endV != ''){
            if (item.inoId < startV || item.inoId　> endV) return false
          }
          if (type != '' && type != item.csign)return  false
          if ( summary != '' && item.cdigest.indexOf(summary) == -1)return false
          if (bookStatus != '' && bookStatus != item.ibook) return false
          if (reviewStatus != '' && '' == item.ccheck) return false
          if (amountMin  != '' && amountMax != ''){
            let md = item.md=='' || item.md== null?'0':item.md
            let mc = item.mc=='' || item.mc == null?'0':item.mc
            if (direction != '' && direction=='jf'){
              if (parseFloat(md) < parseFloat(amountMin) || parseFloat(md) > parseFloat(amountMax))return false
            }else if (direction != '' && direction=='df'){
              if (parseFloat(mc) < parseFloat(amountMin) || parseFloat(mc) > parseFloat(amountMax))return false
            }else if (direction == '' && (md != '0' || mc != '0')) {
              if (md != '0' && md != '0.00'){
                if (parseFloat(md) < parseFloat(amountMin) || parseFloat(md) > parseFloat(amountMax)) return false
              }else if (mc != '0' && mc != '0.00') {
                if (parseFloat(mc) < parseFloat(amountMin) || parseFloat(mc) > parseFloat(amountMax)) return false
              }
            }
          }
          return true
        })
        if (searchConditon.value != ''){
          filterList = filterList.filter(item=>{
            if (null == item[searchConditon.requirement] ||  item[searchConditon.requirement] == '' || item[searchConditon.requirement].indexOf(searchConditon.value) == -1)return false
            return true
          })
        }
        if (filterConditon.amountMin != '' && filterConditon.amountMax != ''){
          filterList = filterList.filter(item=>{
            let md = item.md=='' || item.md== null?'0':item.md
            let mc = item.mc=='' || item.mc == null?'0':item.mc
            if (md != '0' && md != '0.00'){
              if (parseFloat(md) < parseFloat(filterConditon.amountMin) || parseFloat(md) > parseFloat(filterConditon.amountMax)) return false
            }else if (mc != '0' && mc != '0.00') {
              if (parseFloat(mc) < parseFloat(filterConditon.amountMin) || parseFloat(mc) > parseFloat(filterConditon.amountMax)) return false
            }
            return true
          })
        }
        console.log('过滤后------------》'+filterList.length)
        _accvoucher_mix.result.items = filterList.splice(0,20)
        return  _accvoucher_mix
      }else{
      }
      return "没有模拟条件"
    }
  }
] as MockMethod[];
