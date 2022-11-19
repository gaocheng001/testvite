import { defHttp } from '/@/utils/http/axios'

/**
 * @description: Get Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export function getElectOrderList() {
  return defHttp.request({
    url: '/electorder/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function saveElectOrder(params:any) {
  return defHttp.request({
    url: '/electorder',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function deleteElectOrder(params:any) {
  return defHttp.request({
    url: '/electorder',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function findByCode(serialNumber:any) {
  return defHttp.request({
    url: '/electorder/findByCode?serialNumber='+serialNumber,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}
