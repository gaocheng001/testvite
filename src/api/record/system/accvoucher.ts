import {defHttp, otherHttp} from '/@/utils/http/axios'
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

enum Api {
  findAllAccvoucher = '/accvoucher/findAllPingZhengList',
  setAccvoucherRevision = '/accvoucher/setRevision',
  findAllXuShiZhangList = '/accvoucher/findAllXuShiZhangList',
  findAllCashierAccvoucher = '/accvoucher/findAllCashierPingZhengList',
  breakNumTidy = '/accvoucher/breakNumTidy',
  operateInvalid = '/accvoucher/operateInvalid',
  findAllMxByKeys = '/accvoucher/findAllMxByKeys',
  delSpecify = '/accvoucher/delSpecify',
  columnSettingsApi = '/api/columnSettings',
  delDigestColumnSettingsApi = '/api/columnSettings/delDigestColumnSettingsApi',
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
  findAllAccvoucherXianJin = '/accvoucher/findAllAccvoucherXianJin',
  getDistributeInfo = '/cashFolw/getDistributeInfo',
  getFpInfo = '/cashFolw/getFpInfo',
  groupByCbill = '/KeMuHuiZong/groupByCbill',
  replaceVoucherApi = '/accvoucher/replacePingZheng',
  findByUniqueCodeOrderByInid = '/accvoucher/findByUniqueCodeOrderByInid',
  findNewDateApi = '/accvoucher/newDate',
  findAllAccvoucherHexiao = '/accvoucher/findAllAccvoucherHexiao',
  findAllAccvoucherTree = '/accvoucher/dateTree',
  checkAccvoucherError = '/accvoucher/checkError',
  checkAccvoucherSequenceDate = '/accvoucher/checkSequenceDate',
  checkAccvoucherBreakSign = '/accvoucher/checkBreakSign',
  checkAccvoucherNumber = '/accvoucher/checkNumber',
  execAccvoucherReciewOrBook = '/accvoucher/execVoucher',
  findPrintDataByConditionApi = '/accvoucher/findPrintDataByCondition',
  findAllAccvoucherTreeXianjin = '/accvoucher/dateTreeXianJin',
  findAllByIfrag = '/accvoucher/findAllByIfrag',

}

export const getDistributeInfo = defRouteApi(async (params: any) => {
  return {
    url: Api.getDistributeInfo,
    timeout: 500000000,
    method: 'POST',
    params
  }
})
export const getFpInfo = defRouteApi(async (params: any) => {
  return {
    url: Api.getFpInfo,
    timeout: 500000000,
    method: 'POST',
    params
  }
})
export const findAllAccvoucher = defRouteApi(async (params: any) => {
  return {
    url: Api.findAllAccvoucher,
    timeout: 500000000,
    method: 'POST',
    params
  }
})
export const findAllXuShiZhangList = defRouteApi(async (params: any) => {
  return {
    url: Api.findAllXuShiZhangList,
    timeout: 500000000,
    method: 'POST',
    params
  }
})

// 设置单据乐观锁
export const setAccvoucherRevision = defRouteApi(async (params: any) => {
  return {
    url: Api.setAccvoucherRevision,
    timeout: 500000000,
    method: 'POST',
    params
  }
})
//现金流量
export const findAllAccvoucherXianJin = defRouteApi(async (params: any) => {
  return {
    url: Api.findAllAccvoucherXianJin,
    timeout: 500000000,
    method: 'POST',
    params
  }
})
export const findAllCashierAccvoucher = defRouteApi(async (params: any) => {
  return {
    url: Api.findAllCashierAccvoucher,
    timeout: 500000000,
    method: 'POST',
    params
  }
})

export const startVoucherReviewProcedural = defRouteApi(async (params: any) => {
  return {
    url: Api.reviewVoucherApi,
    timeout: 500000000,
    method: 'POST',
    params
  }
})
export const startVoucherSignProcedural = defRouteApi(async (params: any) => {
  return {
    url: Api.signVoucherApi,
    timeout: 500000000,
    method: 'POST',
    params
  }
})

export async function startVoucherCloseSignProcedural(params: any) {
  return defHttp.request({
    url: Api.closeSignVoucherApi,
    method: 'POST',
    params
  })
}

export const startVoucherBookProcedural = defRouteApi(async (params: any) => {
  return {
    url: Api.bookVoucherApi,
    timeout: 500000000,
    method: 'POST',
    params
  }
})

export async function startVoucherCloseBookProcedural(params: any) {
  return defHttp.request({
    url: Api.closeBookVoucherApi,
    method: 'POST',
    params
  })
}

export const startVoucherStatusProcedural = defRouteApi(async (params: any) => {
  return {
    url: Api.changeVoucherStatusApi,
    timeout: 500000000,
    method: 'POST',
    params
  }
})
export const startVoucherCloseStatusProcedural = defRouteApi(async (params: any) => {
  return {
    url: Api.resetVoucherStatusApi,
    timeout: 500000000,
    method: 'POST',
    params
  }
})

export const startVoucherCashierProcedural = defRouteApi(async (params: any) => {
  return {
    url: Api.cashierVoucherApi,
    timeout: 500000000,
    method: 'POST',
    params
  }
})

export const startVoucherReplaceProcedural = defRouteApi(async (params: any) => {
  return {
    url: Api.replaceVoucherApi,
    timeout: 500000000,
    method: 'POST',
    params
  }
})

export async function startVoucherCloseCashierProcedural(params: any) {
  return defHttp.request({
    url: Api.closeCashierVoucherApi,
    method: 'POST',
    params
  })
}

export const breakNumTidy = defRouteApi(async (params: any) => {
  return {
    url: Api.breakNumTidy,
    method: 'POST',
    timeout: 500000000,
     params
  }
})

export const operateInvalidPingZheng = defRouteApi(async (params: any) => {
  return {
    url: Api.operateInvalid,
    method: 'POST', params
  }
})
export const findAllMxByKeysPingZheng = defRouteApi(async (params: any) => {
  return {
    url: Api.findAllMxByKeys,
    method: 'POST', params
  }
})

export const delSpecifyPingZheng = defRouteApi(async (params: any) => {
  return {
    url: Api.delSpecify,
    method: 'POST', params
  }
})

export async function findDbLanMuList(params: any) {
  return defHttp.request({
    url: Api.columnSettingsApi,
    method: 'GET',
    params
  })
}

export async function saveLanMuList(params: any) {
  return defHttp.request({
    url: Api.columnSettingsApi,
    method: 'POST',
    params
  })
}

export async function delDigestLanMuList(params: any) {
  return defHttp.request({
    url: Api.delDigestColumnSettingsApi,
    method: 'POST',
    params
  })
}

export async function changeVoucherSettlementInfo(params: any) {
  return defHttp.request({
    url: Api.changeVoucherSettlementInfoApi,
    method: 'POST',
    params
  })
}

export async function changeVoucherXjInfo(params: any) {
  return defHttp.request({
    url: Api.changeVoucherXjInfoApi,
    method: 'POST',
    params
  })
}

/*export  async function voucherBackgroundImport(params:any){

  return defHttp.request({
    url: params.isCheck?'/accvoucher/importAccvoucher2':'/accvoucher/importAccvoucher',
    timeout: 5000000000000,
    method: 'POST',
    params
})
}*/

export const voucherBackgroundImport = defRouteApi(async (params: any) => {
  return {
    url: params.isCheck ? '/accvoucher/importAccvoucher2' : '/accvoucher/importAccvoucher',
    timeout: 500000000,
    method: 'POST',
    params
  }
})

export const voucherBackgroundImportQiChu = defRouteApi(async (params: any) => {
  return {
    url: params.isCheck ? '/accvoucher/importAccvoucherQiChu' : '/accvoucher/importAccvoucherQiChu',
    timeout: 500000000,
    method: 'POST',
    params
  }
})

export async function downLoadCheckResultFile(params: any) {
  return otherHttp.request({
    url: '/accvoucher/downCheckFile',
    method: 'POST',
    responseType: 'blob',
    params
  })
}

export async function delCheckResultFile(params: any) {
  return defHttp.request({
    url: '/accvoucher/delCheckFile',
    timeout: 5000000000000,
    method: 'POST',
    params
  })
}

export const groupByCbill = defRouteApi(async ({strDate, endDate}) => {
  return {
    url: Api.groupByCbill + '?strDate=' + strDate + '&endDate=' + endDate,
    timeout: 500000000,
    method: 'POST',
  }
})

export const findByUniqueCodeOrderByInid = defRouteApi((uniqueCode) => {
  return {
    url: Api.findByUniqueCodeOrderByInid + '?uniqueCode=' + uniqueCode,
    method: 'GET',
  }
})
export const findNewDate = defRouteApi(() => {
  return {
    url: Api.findNewDateApi,
    method: 'GET',
  }
})
//往来核销
export const findAllAccvoucherHexiao = defRouteApi(async (params: any) => {
  return {
    url: Api.findAllAccvoucherHexiao,
    timeout: 500000000,
    method: 'POST',
    params
  }
})

// 获取凭证树
export const findAllAccvoucherTree = defRouteApi((params: any) => {
  return {
    url: Api.findAllAccvoucherTree,
    timeout: 500000000,
    method: 'GET', params
  }
})

// 获取凭证树
export const findAllAccvoucherTreeXianjin = defRouteApi((params: any) => {
  return {
    url: Api.findAllAccvoucherTreeXianjin,
    timeout: 500000000,
    method: 'GET',
    params
  }
})
/**
 *   checkAccvoucherErrorApi = '/accvoucher/checkError',
 *   checkAccvoucherSequenceDateApi = '/accvoucher/checkSequenceDate',
 *   checkAccvoucherBreakSignApi = '/accvoucher/checkBreakSign',
 *   checkAccvoucherNumberApi = '/accvoucher/checkNumber',
 */

export const checkAccvoucherError = defRouteApi((params: any) => {
  return {
    url: Api.checkAccvoucherError,
    method: 'POST',
    params
  }
})
export const checkAccvoucherSequenceDate = defRouteApi((params: any) => {
  return {
    url: Api.checkAccvoucherSequenceDate,
    method: 'POST',
    params
  }
})
export const checkAccvoucherBreakSign = defRouteApi((params: any) => {
  return {
    url: Api.checkAccvoucherBreakSign,
    method: 'POST',
    params
  }
})
export const checkAccvoucherNumber = defRouteApi((params: any) => {
  return {
    url: Api.checkAccvoucherNumber,
    method: 'POST',
    params
  }
})
// 执行
export const execAccvoucherReciewOrBook = defRouteApi((params: any) => {
  return {
    url: Api.execAccvoucherReciewOrBook,
    method: 'POST',
    params
  }
})
//
export const findPrintDataByCondition = defRouteApi((params: any) => {
  return {
    url: Api.findPrintDataByConditionApi,
    method: 'POST',
    params
  }
})
export const finByMonthMaxInoId = defRouteApi((imonth: any) => {
  return {
    url: '/accvoucher/finByMonthMaxInoId?imonth='+imonth,
    method: 'POST',
  }
})
export const findAllByIfrag = defRouteApi(async (params: any) => {
  return {
    url: Api.findAllByIfrag,
    timeout: 500000000,
    method: 'POST',
    params
  }
})
