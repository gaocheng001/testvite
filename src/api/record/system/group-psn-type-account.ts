import {defHttp} from "/@/utils/http/axios";

/**
 * @description: Get jigou Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export function findAll() {
  return defHttp.request({
    url: '/groupSysPsnTypeAccount/findAll',
    method: 'GET',
  })
}

/*export function findByPsnTypeIdAndAccId({psnTypeId, accId}) {
  return defHttp.request({
    url: '/groupSysPsnTypeAccount/findByPsnTypeIdAndAccId?psnTypeId=' + psnTypeId + '&accId=' + accId,
    method: 'GET',
  })
}

export function findByPsnTypeId({psnTypeId}) {
  return defHttp.request({
    url: '/groupSysPsnTypeAccount/findByPsnTypeId?psnTypeId=' + psnTypeId,
    method: 'GET',
  })
}

export function findByAccId({accId, flag}) {
  return defHttp.request({
    url: '/groupSysPsnTypeAccount/findByAccId?accId=' + accId + '&flag=' + flag,
    method: 'GET',
  })
}*/

export function save(params: any) {
  return defHttp.request({
    url: '/groupSysPsnTypeAccount/save',
    method: 'POST',
    params
  })
}

export function saveList(params: any) {
  return defHttp.request({
    url: '/groupSysPsnTypeAccount/saveList',
    method: 'POST',
    params
  })
}

export function deleteById(id: any) {
  return defHttp.request({
    url: '/groupSysPsnTypeAccount/deleteById?id=' + id,
    method: 'DELETE',
  })
}

export function findByOriginId(originId) {
  return defHttp.request({
    url: '/groupSysPsnTypeAccount/findByOriginId?originId=' + originId,
    method: 'GET',
  })
}

export function findByTenantId(tenantId) {
  return defHttp.request({
    url: '/groupSysPsnTypeAccount/findByTenantId?tenantId=' + tenantId,
    method: 'GET',
  })
}

export function findByOriginIdAndUniqueCode(originId,uniqueCode) {
  return defHttp.request({
    url: '/groupSysPsnTypeAccount/findByOriginIdAndUniqueCode?originId=' + originId + '&uniqueCode='+uniqueCode,
    method: 'GET',
  })
}

export function findByTenantIdAndUniqueCode(tenantId,uniqueCode) {
  return defHttp.request({
    url: '/groupSysPsnTypeAccount/findByTenantIdAndUniqueCode?tenantId=' + tenantId + '&uniqueCode='+uniqueCode,
    method: 'GET',
  })
}

export function findByUniqueCode(uniqueCode) {
  return defHttp.request({
    url: '/groupSysPsnTypeAccount/findByUniqueCode?uniqueCode='+uniqueCode,
    method: 'GET',
  })
}
