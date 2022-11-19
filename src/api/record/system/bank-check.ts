import { defHttp } from '/@/utils/http/axios'

/**
 * @description: Get Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export function getBankCheckList() {
  return defHttp.request({
    url: '/bankcheck/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function saveBankCheck(params:any) {
  return defHttp.request({
    url: '/bankcheck',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function deleteBankCheck(params:any) {
  return defHttp.request({
    url: '/bankcheck',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function findByCode(checkNum:any) {
  return defHttp.request({
    url: '/bankcheck/findByCode?checkNum='+checkNum,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}
