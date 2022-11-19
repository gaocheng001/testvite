import { defHttp } from '/@/utils/http/axios'

/**
 * @description: Get Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export function getApprovalDocList() {
  return defHttp.request({
    url: '/approval/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function saveApprovalDoc(params:any) {
  return defHttp.request({
    url: '/approval',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function deleteApprovalDoc(params:any) {
  return defHttp.request({
    url: '/approval',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function findByCode(docCode:any) {
  return defHttp.request({
    url: '/approval/findByCode?docCode='+docCode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}
