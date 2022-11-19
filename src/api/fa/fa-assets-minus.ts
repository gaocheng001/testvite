import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {defHttp} from "/@/utils/http/axios";


export const findFaPanDianListByCondition = defRouteApi((params) => {
  return {
    url: '/faCz/findMinusListByCondition',
    method: 'POST',
    params
  }
})

export const findFaAssetListByCondition = defRouteApi((params) => {
  return {
    url: '/faCz/findFaAssetListByCondition',
    method: 'POST',
    params
  }
})
export const findFaAssetInfoByCode = defRouteApi((params) => {
  return {
    url: '/faCz/findFaAssetInfoByCode',
    method: 'POST',
    params
  }
})

export const findFaChuZhiByCondition = defRouteApi((params) => {
  return {
    url: '/faCz/findFaPanDianByCondition',
    method: 'POST',
    params
  }
})

export const findFaInvoiceByDate = defRouteApi((params) => {
  return {
    url: '/faCz/generate',
    method: 'POST',
    params
  }
})

export const saveChuZhi = defRouteApi((params) => {
  return {
    url: '/faCz/save',
    method: 'POST',
    params
  }
})

export function findFaCheckByDate(params) {
  return defHttp.request({
    url: '/faCz/checkDate',
    method: 'GET',
    params
  })
}
export const delChuZhi = defRouteApi((params) => {
  return {
    url: '/faCz/del',
    method: 'DELETE',
    params
  }
})
export const reviewChuZhi = defRouteApi((params) => {
  return {
    url: '/faCz/review',
    method: 'POST',
    params
  }
})
