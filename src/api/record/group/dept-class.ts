import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {defHttp} from "/@/utils/http/axios";

/**
 * @description: Get jigou Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export function getDeptList() {
  return defHttp.request({
    url: '/group/deptClass/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function getDeptListById() {
  return defHttp.request({
    url: '/group/deptClass/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function saveDept(params) {
  return defHttp.request({
    url: '/group/deptClass/save',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function deleteDept(params) {
  return defHttp.request({
    url: '/group/deptClass/del',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function editFlag(params) {
  return defHttp.request({
    url: '/group/deptClass/editFlag',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function GetDeptTree(params) {
  return defHttp.request({
    url: '/group/deptClass/treeDept',
    method: 'GET',
    params
  })
}


export function GetDeptTreeByFlag() {
  return defHttp.request({
    url: '/group/deptClass/treeDeptByFlag',
    method: 'GET',
  })
}

//末级
export function  GetZfTreeByFlag(){
  return defHttp.request({
    url: '/group/zfClass/treeDeptByIsEnd',
    method: 'GET',
  })
}
export function  excelVoucherType(params:any){
  return defHttp.request({
    url: '/sys/deptClass/excel',
    method: 'POST',
    params
  })
}
export function  getMaxCode(code: any){
  return defHttp.request({
    url: '/group/deptClass/getMaxCode?id='+code,
    method: 'GET',
  })
}

export function findDelAll(params:any) {
  return defHttp.request({
    url: '/group/deptClass/findDelAll',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function deleteList(params:any) {
  return defHttp.request({
    url: '/group/deptClass/deleteList',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}


export function reductionList(params:any) {
  return defHttp.request({
    url: '/group/deptClass/reductionList',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}


