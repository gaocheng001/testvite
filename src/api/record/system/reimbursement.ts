import { defHttp } from '/@/utils/http/axios'

/**
 * @description: Get Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export function findReimburseAll() {
  return defHttp.request({
    url: '/reimbursement/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function saveReimburse(params:any) {
  return defHttp.request({
    url: '/reimbursement',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function deleteReimburse(params:any) {
  return defHttp.request({
    url: '/reimbursement',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function findByReimCode(reimCode:any) {
  return defHttp.request({
    url: '/reimbursement/findByCode?reimCode='+reimCode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}
