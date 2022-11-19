import { defHttp } from '/@/utils/http/axios'

/**
 * @description: Get Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export function getBankList() {
  return defHttp.request({
    url: '/bank/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}
export function accGetBankList() {
  return defHttp.request({
    url: '/bank/accFindAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function saveBank(params:any) {
  return defHttp.request({
    url: '/bank',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}
export function accSaveBank(params:any) {
  return defHttp.request({
    url: '/bank/accSave',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function deleteBank(params:any) {
  return defHttp.request({
    url: '/bank',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function accDeleteBank(params:any) {
  return defHttp.request({
    url: '/bank/accDelete',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function findByBankCode(bankCode:any) {
  return defHttp.request({
    url: '/bank/findByCode?bankCode='+bankCode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function findByDatabaseUniqueCode() {
  return defHttp.request({
    url: '/bank/findByDatabaseUniqueCode',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function approveBank(params:any) {
  return defHttp.request({
    url: '/bank/approve',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}
