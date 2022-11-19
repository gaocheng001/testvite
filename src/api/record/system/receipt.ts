import { defHttp } from '/@/utils/http/axios';

/**
 * @description: Get Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export function findReceiptAll() {
  return defHttp.request({
    url: '/receipt/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true,
    },
  });
}

export function saveReceipt(params: any) {
  return defHttp.request({
    url: '/receipt',
    method: 'POST',
    headers: {
      ignoreCancelToken: true,
    },
    params,
  });
}

export function deleteReceipt(params: any) {
  return defHttp.request({
    url: '/receipt',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true,
    },
    params,
  });
}

export function findReceiptByUniqueCode(uniqueCode: any) {
  return defHttp.request({
    url: '/receipt/findReceiptByUniqueCode?uniqueCode=' + uniqueCode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true,
    },
  });
}

export function findByReceCode(receCode: any) {
  return defHttp.request({
    url: '/receipt/findByReceCode?receCode=' + receCode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true,
    },
  });
}
