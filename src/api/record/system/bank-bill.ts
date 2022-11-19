import { defHttp } from '/@/utils/http/axios'

/**
 * @description: Get Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export function getBankBillList() {
  return defHttp.request({
    url: '/bankbill/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function saveBankBill(params:any) {
  return defHttp.request({
    url: '/bankbill',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function deleteBankBill(params:any) {
  return defHttp.request({
    url: '/bankbill',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function findByCode(billNum:any) {
  return defHttp.request({
    url: '/bankbill/findByCode?billNum='+billNum,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}
