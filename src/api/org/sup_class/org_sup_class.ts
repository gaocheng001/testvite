// @ts-ignore
import { defHttp } from '/@/utils/http/axios';


export function findAllOrgCusClass(params) {
  return defHttp.request({
    url: '/originSupplierClass/findAll',params,
    method: 'POST',timeout: 100000000000,
  });
}
export function treeCustomerClass(params) {
  return defHttp.request({
    url: '/originSupplierClass/treeCustomerClass',params,
    method: 'POST',timeout: 100000000000,
  });
}
export function saveAll(params) {
  return defHttp.request({
    url: '/originSupplierClass/saveAll',params,
    method: 'POST',timeout: 100000000000,
  });
}
export function findByBringGroupClassAccount(params) {
  return defHttp.request({
    url: '/originSupplierClass/findByBringGroupClassAccount',params,
    method: 'POST',timeout: 100000000000,
  });
}
export function findByBringOrgTenantId(params) {
  return defHttp.request({
    url: '/originSupplierClass/findByBringOrgTenantId',params,
    method: 'POST',timeout: 100000000000,
  });
}

export function deloriginSupplierClassById(params) {
  return defHttp.request({
    url: '/originSupplierClass/deloriginSupplierClassById',params,
    method: 'POST',timeout: 100000000000,
  });
}
