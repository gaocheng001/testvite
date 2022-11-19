import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {defHttp} from "/@/utils/http/axios";


export const findFaPingGuListByCondition = defRouteApi((params) => {
  return {
    url: '/faPg/findFaPingGuListByCondition',
    method: 'POST',
    params
  }
})
export const findFaAssetByCondition = defRouteApi((params) => {
  return {
    url: '/faPg/findFaAssetByCondition',
    method: 'POST',
    params
  }
})
export const findFaAssetInfoByCode = defRouteApi((params) => {
  return {
    url: '/faPg/findFaAssetInfoByCode',
    method: 'POST',
    params
  }
})
export const findFaAssetListByCondition = defRouteApi((params) => {
  return {
    url: '/faPg/findFaAssetListByCondition',
    method: 'POST',
    params
  }
})

export const findFaPingGuByCondition = defRouteApi((params) => {
  return {
    url: '/faPg/findFaPingGuByCondition',
    method: 'POST',
    params
  }
})

export const findFaInvoiceByDate = defRouteApi((params) => {
  return {
    url: '/faPg/generate',
    method: 'POST',
    params
  }
})

export const savePingGu = defRouteApi((params) => {
  return {
    url: '/faPg/save',
    method: 'POST',
    params
  }
})

export function findFaCheckByDate(params) {
  return defHttp.request({
    url: '/faPg/checkDate',
    method: 'GET',
    params
  })
}
export const delPingGu = defRouteApi((params) => {
  return {
    url: '/faPg/del',
    method: 'DELETE',
    params
  }
})
export const reviewPingGu = defRouteApi((params) => {
  return {
    url: '/faPg/review',
    method: 'POST',
    params
  }
})
