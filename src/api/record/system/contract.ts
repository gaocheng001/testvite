import { defHttp } from '/@/utils/http/axios'

/**
 * @description: Get Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export function getContractList() {
  return defHttp.request({
    url: '/contract/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function saveContract(params:any) {
  return defHttp.request({
    url: '/contract',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function deleteContract(params:any) {
  return defHttp.request({
    url: '/contract',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function findByCode(conNum:any) {
  return defHttp.request({
    url: '/contract/findByCode?conNum='+conNum,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function findByBiaodi(conId:any) {
  return defHttp.request({
    url: '/contract/findByBiaodi?conId='+conId,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}
