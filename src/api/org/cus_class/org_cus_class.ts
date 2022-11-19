// @ts-ignore
import { defHttp } from '/@/utils/http/axios';


export function findAllOrgCusClass(params) {
  return defHttp.request({
    url: '/originCustomerClass/findAll',params,
    method: 'POST',timeout: 100000000000,
  });
}
export function treeCustomerClass(params) {
  return defHttp.request({
    url: '/originCustomerClass/treeCustomerClass',params,
    method: 'POST',timeout: 100000000000,
  });
}
export function saveAll(params) {
  return defHttp.request({
    url: '/originCustomerClass/saveAll',params,
    method: 'POST',timeout: 100000000000,
  });
}
export function findByBringGroupClassAccount(params) {
  return defHttp.request({
    url: '/originCustomerClass/findByBringGroupClassAccount',params,
    method: 'POST',timeout: 100000000000,
  });
}
export function findByBringOrgTenantId(params) {
  return defHttp.request({
    url: '/originCustomerClass/findByBringOrgTenantId',params,
    method: 'POST',timeout: 100000000000,
  });
}

export function delOriginCustomerClassById(params) {
  return defHttp.request({
    url: '/originCustomerClass/delOriginCustomerClassById',params,
    method: 'POST',timeout: 100000000000,
  });
}
