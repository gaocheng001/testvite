import { defHttp } from '/@/utils/http/axios';


export function originCustomerFindAll(params) {
  return defHttp.request({
    url: '/originCustomer/findAll',params,
    method: 'POST',timeout: 100000000000,
  });
}
export function originCustomerSaveAll(params) {
  return defHttp.request({
    url: '/originCustomer/saveAll',params,
    method: 'POST',timeout: 100000000000,
  });
}
export function originCustomerDelById(params) {
  return defHttp.request({
    url: '/originCustomer/delById',params,
    method: 'POST',timeout: 100000000000,
  });
}
