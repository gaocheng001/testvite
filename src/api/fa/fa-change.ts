import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {defHttp} from "/@/utils/http/axios";


export const findFaChangeListByCondition = defRouteApi((params) => {
  return {
    url: '/faBd/findFaChangeListByCondition',
    method: 'POST',
    params
  }
})

export const findFaAssetListByCondition = defRouteApi((params) => {
  return {
    url: '/faBd/findFaAssetListByCondition',
    method: 'POST',
    params
  }
})
export const findLastFaChangeInfoByCode = defRouteApi((params) => {
  return {
    url: '/faBd/findLastFaChangeInfoByCode',
    method: 'POST',
    params
  }
})

export const findFaChangeByCondition = defRouteApi((params) => {
  return {
    url: '/faBd/findFaChangeByCondition',
    method: 'POST',
    params
  }
})

export const findFaInvoiceByDate = defRouteApi((params) => {
  return {
    url: '/faBd/generate',
    method: 'POST',
    params
  }
})

export const saveChange = defRouteApi((params) => {
  return {
    url: '/faBd/save',
    method: 'POST',
    params
  }
})
export const canChangeContent = defRouteApi((params) => {
  return {
    url: '/faBd/canChangeContent',
    method: 'POST',
    params
  }
})


export function findFaCheckByDate(params) {
  return defHttp.request({
    url: '/faBd/checkDate',
    method: 'GET',
    params
  })
}
export const delChange = defRouteApi((params) => {
  return {
    url: '/faBd/del',
    method: 'DELETE',
    params
  }
})
export const reviewChange = defRouteApi((params) => {
  return {
    url: '/faBd/review',
    method: 'POST',
    params
  }
})
