// @ts-ignore
import { defHttp } from '/@/utils/http/axios';


export function originCustomerFindAll(params) {
  return defHttp.request({
    url: '/originSupplier/findAll',params,
    method: 'POST',timeout: 100000000000,
  });
}
export function originCustomerSaveAll(params) {
  return defHttp.request({
    url: '/originSupplier/saveAll',params,
    method: 'POST',timeout: 100000000000,
  });
}
export function originCustomerDelById(params) {
  return defHttp.request({
    url: '/originSupplier/delById',params,
    method: 'POST',timeout: 100000000000,
  });
}
