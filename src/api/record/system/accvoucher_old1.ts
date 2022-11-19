import { defHttp } from '/@/utils/http/axios'
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

enum Api {
  findAllAccvoucher = '/accvoucher/findAllPingZhengList',
  findAllCashierAccvoucher = '/accvoucher/findAllCashierPingZhengList',
  breakNumTidy = '/accvoucher/breakNumTidy',
  columnSettingsApi = '/api/columnSettings',
  reviewVoucherApi = '/accvoucher/reviewPingZheng',
  clsoeReviewVoucherApi = '/accvoucher/closeReviewPingZheng',
  signVoucherApi = '/accvoucher/symbolPingZheng',
  closeSignVoucherApi = '/accvoucher/closesymbolPingZheng',
  bookVoucherApi = '/accvoucher/bookPingZheng',
  closeBookVoucherApi = '/accvoucher/closeBookPingZheng',
  changeVoucherStatusApi = '/accvoucher/changeStatusPingZheng',
  resetVoucherStatusApi = '/accvoucher/resetStatusPingZheng',
  cashierVoucherApi = '/accvoucher/cashierPingZheng',
  closeCashierVoucherApi = '/accvoucher/closeCashierPingZheng',
  changeVoucherSettlementInfoApi = '/accvoucher/changeSettlementInfo',
  changeVoucherXjInfoApi = '/accvoucher/changeXjllInfo',
}


export const findAllAccvoucher=defRouteApi( (params)=>{
  return{
    url: Api.findAllAccvoucher,
    timeout:10000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})
export const findAllCashierAccvoucher=defRouteApi( (params)=>{
  return{
    url: Api.findAllCashierAccvoucher,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})


export  const startVoucherReviewProcedural =  defRouteApi(  (params:any)=>{
  return{
    url: Api.reviewVoucherApi,
    method: 'POST',
    params
  }
})

export  const startVoucherCloseReviewProcedural =  defRouteApi(  (params:any)=>{
  return{
    url: Api.clsoeReviewVoucherApi,
    method: 'POST',
    params
  }
})



export  const startVoucherSignProcedural =  defRouteApi(  (params:any)=>{
  return{
    url: Api.signVoucherApi,
    method: 'POST',
    params
  }
})

export  const startVoucherCloseSignProcedural =  defRouteApi(  (params:any)=>{
  return{
    url: Api.closeSignVoucherApi,
    method: 'POST',
    params
  }
})

export  const startVoucherBookProcedural =  defRouteApi(  (params:any)=>{
  return{
    url: Api.bookVoucherApi,
    method: 'POST',
    params
  }
})

export  const startVoucherCloseBookProcedural =  defRouteApi(  (params:any)=>{
  return{
    url: Api.closeBookVoucherApi,
    method: 'POST',
    params
  }
})

export  const startVoucherStatusProcedural =  defRouteApi(  (params:any)=>{
  return{
    url: Api.changeVoucherStatusApi,
    method: 'POST',
    params
  }
})

export  const startVoucherCloseStatusProcedural =  defRouteApi(  (params:any)=>{
  return{
    url: Api.resetVoucherStatusApi,
    method: 'POST',
    params
  }
})

export  const startVoucherCashierProcedural =  defRouteApi(  (params:any)=>{
  return{
    url: Api.cashierVoucherApi,
    method: 'POST',
    params
  }
})

export  const startVoucherCloseCashierProcedural =  defRouteApi(  (params:any)=>{
  return{
    url: Api.closeCashierVoucherApi,
    method: 'POST',
    params
  }
})


export function breakNumTidy() {
  return defHttp.request({
    url: Api.breakNumTidy,
    method: 'POST'
  })
}

export async function findDbLanMuList(params:any) {
  return  defHttp.request({
    url: Api.columnSettingsApi,
    method: 'GET',
    params
  })
}
export async function saveLanMuList(params:any) {
  return defHttp.request({
    url: Api.columnSettingsApi,
    method: 'POST',
    params
  })
}

export  const changeVoucherSettlementInfo =  defRouteApi(  (params:any)=>{
  return{
    url: Api.changeVoucherSettlementInfoApi,
    method: 'POST',
    params
  }
})

export  const changeVoucherXjInfo =  defRouteApi(  (params:any)=>{
  return{
    url: Api.changeVoucherXjInfoApi,
    method: 'POST',
    params
  }
})

export  const voucherBackgroundImport =  defRouteApi(  (params:any)=>{
  return{
    url: '/accvoucher/importAccvoucher2',
    timeout: 100000000000,
    method: 'POST',
    params
  }
})



