import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {defHttp} from "/@/utils/http/axios";
import {excelVoucherType} from "/@/api/record/system/dept-class";

/**
 * @description: Get jigou Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export function getDeptList() {
  return defHttp.request({
    url: '/group/zfClass/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function getDeptListById() {
  return defHttp.request({
    url: '/group/zfClass/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function saveDept(params) {
  return defHttp.request({
    url: '/group/zfClass/save',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function deleteDept(params) {
  return defHttp.request({
    url: '/group/zfClass/del',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function editFlag(params) {
  return defHttp.request({
    url: '/group/zfClass/editFlag',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function GetDeptTree(params) {
  return defHttp.request({
    url: '/group/zfClass/treeDept',
    method: 'GET',
    params
  })
}

export function GetDeptTreeByFlag() {
  return defHttp.request({
    url: '/group/zfClass/treeDeptByFlag',
    method: 'GET',
  })
}

export function excelVoucherType(params:any) {
  return defHttp.request({
    url: '/sys/zfClass/excel',
    method: 'POST',
    params
  })
}
export function getMaxCode(code) {
  return defHttp.request({
    url: '/sys/zfClass/getMaxCode?id='+code,
    method: 'GET',
  })
}


export function findDelAll(params:any) {
  return defHttp.request({
    url: '/group/zfClass/findDelAll',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function deleteList(params:any) {
  return defHttp.request({
    url: '/group/zfClass/deleteList',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}


export function reductionList(params:any) {
  return defHttp.request({
    url: '/group/zfClass/reductionList',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

