import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {defHttp} from "/@/utils/http/axios";

/**
 * @description: Get jigou Emp based on id
 */
export function getDeptList() {
  return defHttp.request({
    url: '/group/faAssetType/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function getDeptListById() {
  return defHttp.request({
    url: '/group/faAssetType/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function saveDept(params) {
  return defHttp.request({
    url: '/group/faAssetType/save',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}


export function deleteDept(params) {
  return defHttp.request({
    url: '/group/faAssetType/del',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function editFlag(params) {
  return defHttp.request({
    url: '/group/faAssetType/editFlag',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function excelDept(params) {
  return defHttp.request({
    url: '/group/faAssetType/excel',
    timeout:100000000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function GetDeptTree(params) {
  return defHttp.request({
    url: '/group/faAssetType/treeDept',
    method: 'GET',
    params
  })
}

export function GetDeptTreeByFlag() {
  return defHttp.request({
    url: '/group/faAssetType/treeDeptByFlag',
    method: 'GET',
  })
}
/*export function GetDeptTreeByFlag(code) {
  return defHttp.request({
    url: '/group/faAssetType/getMaxCode?id='+code,
    method: 'GET',
  })
}*/

export function getMaxCode(code: any) {
  return defHttp.request({
    url: '/group/faAssetType/getMaxCode?id='+code,
    method: 'GET',
  })
}
export function getFaProperty() {
  return defHttp.request({
    url: '/group/faAssetType/getFaProperty',
    method: 'GET',
  })
}

export function getFaZhejiuMethod() {
  return defHttp.request({
    url: '/group/faAssetType/getFaZhejiuMethod',
    method: 'GET',
  })
}

export function getSysUnitOfMeaType() {
  return defHttp.request({
    url: '/group/faAssetType/getSysUnitOfMeaType',
    method: 'GET',
  })
}

