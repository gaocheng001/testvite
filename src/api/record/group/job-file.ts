import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {defHttp} from "/@/utils/http/axios";

/**
 * @description: Get jigou Emp based on id
 */
export function getDeptList() {
  return defHttp.request({
    url: '/sys/jobfile/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}
export function getTypeList() {
  return defHttp.request({
    url: '/group/jobfile/getTypeList',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function getDeptListById() {
  return defHttp.request({
    url: '/group/jobfile/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function saveDept(params) {
  return defHttp.request({
    url: '/group/jobfile/save',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function saveJobType(params) {
  return defHttp.request({
    url: '/group/jobfile/saveJobType',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function deleteDept(params) {
  return defHttp.request({
    url: '/group/jobfile/del',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function editFlag(params) {
  return defHttp.request({
    url: '/group/jobfile/editFlag',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function excelDept(params) {
  return defHttp.request({
    url: '/group/jobfile/excel',
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
    url: '/group/jobfile/treeDept',
    method: 'GET',
    params
  })
}
export function GetDeptTreeByFlag() {
  return defHttp.request({
    url: '/group/jobfile/treeDeptByFlag',
    method: 'GET',
  })
}

export function getMaxCode(code) {
  return defHttp.request({
    url: '/group/jobfile/getMaxCode?id='+code,
    method: 'GET',
  })
}

export function delTypeById(id) {
  return defHttp.request({
    url: '/group/jobfile/delTypeById?id='+id,
    method: 'GET',
  })
}

export function excelVoucherType(params) {
  return defHttp.request({
    url: '/group/jobfile/excel',
    method: 'POST',
    params
  })
}

