import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {defHttp} from "/@/utils/http/axios";

/**
 * @description: Get jigou Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export function getDeptList() {
  return defHttp.request({
    url: '/group/expenditureClass/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function getDeptListById() {
  return defHttp.request({
    url: '/group/expenditureClass/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function saveDept(params) {
  return defHttp.request({
    url: '/group/expenditureClass/save',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function deleteDept(params) {
  return defHttp.request({
    url: '/group/expenditureClass/del',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function editFlag(params) {
  return defHttp.request({
    url: '/group/expenditureClass/editFlag',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function GetDeptTree(params) {
  return defHttp.request({
    url: '/group/expenditureClass/treeDept',
    method: 'GET',
    params
  })
}


export function GetDeptTreeByFlag() {
  return defHttp.request({
    url: '/group/expenditureClass/treeDeptByFlag',
    method: 'GET',
  })
}
export function excelVoucherType(params:any) {
  return defHttp.request({
    url: '/group/expenditureClass/excel',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}
export function getMaxCode(code: any) {
  return defHttp.request({
    url: '/sys/expenditureClass/getMaxCode?id='+code,
    method: 'GET',
  })
}



export function findDelAll(params:any) {
  return defHttp.request({
    url: '/group/expenditureClass/findDelAll',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function deleteList(params:any) {
  return defHttp.request({
    url: '/group/expenditureClass/deleteList',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}


export function reductionList(params:any) {
  return defHttp.request({
    url: '/group/expenditureClass/reductionList',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

