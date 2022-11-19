import { defHttp } from '/@/utils/http/axios'
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

/**
 * @description: Get Emp based on id
 */

export function findSettModesAll(code) {
  return defHttp.request({
    url: '/group/faEconomyUse/findAll',
    method: 'GET',
  })
}

export function findSettModesByFlag(code) {
  return defHttp.request({
    url: '/group/faEconomyUse/findByFlag',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function saveSettModes(params) {
  return defHttp.request({
    url: '/group/faEconomyUse',
    method: 'POST',
    params
  })
}

export function deleteSettModes(params) {
  return defHttp.request({
    url: '/group/faEconomyUse',
    method: 'DELETE',
    params
  })
}

export function findBySettModes(settModesCode) {
  return defHttp.request({
    url: '/group/faEconomyUse/findByCode?settModesCode='+settModesCode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}
export function findByBsName(settModesCode) {
  return defHttp.request({
    url: '/group/faEconomyUse/findByBsName?settModesCode='+settModesCode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function editFlag(params) {
  return defHttp.request({
    url: '/group/faEconomyUse/editFlag',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function excelVoucherType(params) {
  return defHttp.request({
    url: '/group/faEconomyUse/excel',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}



