import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {defHttp} from "/@/utils/http/axios";
import {excelVoucherType} from "/@/api/record/system/dept-class";

/**
 * @description: Get jigou Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export function getDeptList() {
  return defHttp.request({
    url: '/group/faZhejiuMethod/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function getDeptListById() {
  return defHttp.request({
    url: '/group/faZhejiuMethod/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function saveDept(params) {
  return defHttp.request({
    url: '/group/faZhejiuMethod/save',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function deleteDept(params) {
  return defHttp.request({
    url: '/group/faZhejiuMethod/del',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function editFlag(params) {
  return defHttp.request({
    url: '/group/faZhejiuMethod/editFlag',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function GetDeptTree(params) {
  return defHttp.request({
    url: '/group/faZhejiuMethod/treeDept',
    method: 'GET',
    params
  })
}

export function GetDeptTreeByFlag() {
  return defHttp.request({
    url: '/group/faZhejiuMethod/treeDeptByFlag',
    method: 'GET',
  })
}

export function excelVoucherType(params:any) {
  return defHttp.request({
    url: '/sys/faZhejiuMethod/excel',
    method: 'POST',
    params
  })
}
export function getMaxCode(code) {
  return defHttp.request({
    url: '/sys/faZhejiuMethod/getMaxCode?id='+code,
    method: 'GET',
  })
}

