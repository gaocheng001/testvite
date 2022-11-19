import { defHttp } from '/@/utils/http/axios'
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

/**
 * @description: Get Emp based on id
 */

export function findSettModesAll() {
  return defHttp.request({
    url: '/group/faAssetGroup/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function findSettModesByFlag() {
  return defHttp.request({
    url: '/group/faAssetGroup/findByFlag',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function saveSettModes(params) {
  return defHttp.request({
    url: '/group/faAssetGroup',
    method: 'POST',
    params
  })
}

export function deleteSettModes(params) {
  return defHttp.request({
    url: '/group/faAssetGroup',
    method: 'DELETE',
    params
  })
}


export function findBySettModes(settModesCode) {
  return defHttp.request({
    url: '/group/faAssetGroup/findByCode?settModesCode='+settModesCode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}
export function findByBsName(settModesCode) {
  return defHttp.request({
    url: '/group/faAssetGroup/findByBsName?settModesCode='+settModesCode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function editFlag(params) {
  return defHttp.request({
    url: '/group/faAssetGroup/editFlag',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function excelVoucherType(params) {
  return defHttp.request({
    url: '/group/faAssetGroup/excel',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}



