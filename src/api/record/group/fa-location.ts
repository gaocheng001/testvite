import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {defHttp} from "/@/utils/http/axios";

/**
 * @description: Get jigou Emp based on id
 */
export function getDeptList() {
  return defHttp.request({
    url: '/group/faLocatin/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}
export function getDeptListById() {
  return defHttp.request({
    url: '/group/faLocatin/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}
export function saveDept(params) {
  return defHttp.request({
    url: '/group/faLocatin/save',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function deleteDept(params) {
  return defHttp.request({
    url: '/group/faLocatin/del',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function editFlag(params) {
  return defHttp.request({
    url: '/group/faLocatin/editFlag',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function excelDept(params) {
  return defHttp.request({
    url: '/group/faLocatin/excel',
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
    url: '/group/faLocatin/treeDept',
    method: 'GET',
    params
  })
}

export function GetDeptTreeByFlag() {
  return defHttp.request({
    url: '/group/faLocatin/treeDeptByFlag',
    method: 'GET'
  })
}

export function getMaxCode(code) {
  return defHttp.request({
    url: '/group/faLocatin/getMaxCode?id='+code,
    method: 'GET',
  })
}


