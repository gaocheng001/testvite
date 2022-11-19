import {defHttp} from "/@/utils/http/axios";

/**
 * @description: Get jigou Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export function psnTypeFindAll() {
  return defHttp.request({
    url: '/groupSys/psnType/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function savePsnType(params:any) {
  return defHttp.request({
    url: '/groupSys/psnType',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function deletePsnType(params:any) {
  return defHttp.request({
    url: '/groupSys/psnType',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function excelPsnType(params: any) {
  return defHttp.request({
    url: '/groupSys/psnType/excel',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}
