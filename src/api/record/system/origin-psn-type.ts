import {defHttp} from "/@/utils/http/axios";

/**
 * @description: Get jigou Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export function psnTypeFindAll(originId) {
  return defHttp.request({
    url: '/originSys/psnType/findAll?originId='+originId,
    method: 'GET',
  })
}

export function savePsnType(params:any) {
  return defHttp.request({
    url: '/originSys/psnType',
    method: 'POST',
    params
  })
}

export function deletePsnType(params:any) {
  return defHttp.request({
    url: '/originSys/psnType',
    method: 'DELETE',
    params
  })
}

export function excelPsnType(params: any) {
  return defHttp.request({
    url: '/originSys/psnType/excel',
    method: 'POST',
    params
  })
}
