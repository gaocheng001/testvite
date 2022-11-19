import { defHttp } from '/@/utils/http/axios'
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

/**
 * @description: Get Emp based on id
 */

export function findSettModesAll() {
  return defHttp.request({
    url: '/budgetSource/findAll',
    method: 'GET',
  })
}

export function findSettModesByFlag() {
  return defHttp.request({
    url: '/budgetSource/findByFlag',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

/*export function saveSettModes(params:any) {
  return defHttp.request({
    url: '/budgetSource',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}*/
export function saveSettModes(params) {
  return defHttp.request({
    url: '/budgetSource',
    method: 'POST',
    params
  })
}

export function deleteSettModes(params) {
  return defHttp.request({
    url: '/budgetSource',
    method: 'DELETE',
    params
  })
}


export function findBySettModes(settModesCode:any) {
  return defHttp.request({
    url: '/budgetSource/findByCode?settModesCode='+settModesCode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}
export function findByBsName(settModesCode:any) {
  return defHttp.request({
    url: '/budgetSource/findByBsName?settModesCode='+settModesCode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}
export function editFlag(params:any) {
  return defHttp.request({
    url: '/budgetSource/editFlag',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}
export function excelVoucherType(params:any) {
  return defHttp.request({
    url: '/budgetSource/excel',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function findDelAll(params:any) {
  return defHttp.request({
    url: '/budgetSource/findDelAll',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function deleteList(params:any) {
  return defHttp.request({
    url: '/budgetSource/deleteList',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}


export function reductionList(params:any) {
  return defHttp.request({
    url: '/budgetSource/reductionList',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

