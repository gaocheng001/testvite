import {defHttp} from "/@/utils/http/axios";

// params 是getEmpListByIdParams 类型的
export function findAll() {
  return defHttp.request({
    url: '/groupReportAcc/findAll',
    timeout: 1000000,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function findByAccStandardOrderByNum(accStandard) {
  return defHttp.request({
    url: '/groupReportAcc/findByAccStandardOrderByNum?accStandard=' + accStandard,
    timeout: 1000000,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function save(params: any) {
  return defHttp.request({
    url: '/groupReportAcc/save',
    timeout: 1000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function deleteById(id: any) {
  return defHttp.request({
    url: '/groupReportAcc/deleteById?id=' + id,
    timeout: 1000000,
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    }
  })
}
