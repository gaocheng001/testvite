import {defHttp, otherHttp} from '/@/utils/http/axios'
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

enum Api {
  autoWriteOff            = '/writeOff/autoWriteOff',
  findAllAccvoucherHexiao = '/writeOff/findAllAccvoucherHexiao',
  findAllAccvoucherHexiaoGeren = '/writeOff/findAllAccvoucherHexiaoGeren',
  findAllAccvoucherHexiaoGys = '/writeOff/findAllAccvoucherHexiaoGys',
  findAllHexiaoHistory    = '/writeOff/findAllHexiaoHistory',
  backHx                  = '/writeOff/backHx',
  manualWriteOff          = '/writeOff/manualWriteOff',
  save                     = '/writeOff/save',
  countHxRecordApi = '/writeOff/countHxRecord'
}

//个人往来核销
export const findAllAccvoucherHexiaoGeren = defRouteApi( async (params:any)=>{
  return  {
    url: Api.findAllAccvoucherHexiaoGeren,
    timeout:10000000,
    method: 'POST',
    params
  }
})
//客户往来核销
export const findAllAccvoucherHexiao = defRouteApi( async (params:any)=>{
  return  {
    url: Api.findAllAccvoucherHexiao,
    timeout:10000000,
    method: 'POST',
    params
  }
})

//供应商往来核销
export const findAllAccvoucherHexiaoGys = defRouteApi( async (params:any)=>{
  return  {
    url: Api.findAllAccvoucherHexiaoGys,
    timeout:10000000,
    method: 'POST',
    params
  }
})


//往来核销历史
export const findAllHexiaoHistory = defRouteApi( async (params:any)=>{
  return  {
    url: Api.findAllHexiaoHistory,
    timeout:10000000,
    method: 'POST',
    params
  }
})

//自动核销
export const autoWriteOff = defRouteApi( async (params:any)=>{
  return  {
    url: Api.autoWriteOff,
    timeout:10000000,
    method: 'POST',
    params
  }
})
//手动核销
export const manualWriteOff = defRouteApi( async (params:any)=>{
  return  {
    url: Api.manualWriteOff,
    timeout:10000000,
    method: 'POST',
    params
  }
})
//添加手动核销
export const saveManualWriteOff = defRouteApi( async (params:any)=>{
  return  {
    url: Api.save,
    timeout:10000000,
    method: 'POST',
    params
  }
})
//反核销
export const backHx = defRouteApi( async (params:any)=>{
  return  {
    url: Api.backHx,
    timeout:10000000,
    method: 'POST',
    params
  }
})
// 查询指定凭证分录核销数量
export const countHxRecord = defRouteApi( async (params:any)=>{
  return  {
    url: Api.countHxRecordApi,
    timeout:10000000,
    method: 'POST',
    params
  }
})
