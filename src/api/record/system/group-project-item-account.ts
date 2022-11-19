// @ts-ignore
import {defHttp} from "/@/utils/http/axios";

/**
 * @description: Get jigou Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export function findAll() {
  return defHttp.request({
    url: '/groupProjectItemAccount/findAll',
    method: 'GET',
  })
}

export function save(params: any) {
  return defHttp.request({
    url: '/groupProjectItemAccount/save',
    method: 'POST',
    params
  })
}

export function saveAccount(params: any) {
  return defHttp.request({
    url: '/groupProjectItemAccount/save',
    method: 'POST',
    params
  })
}

export function saveList(params: any) {
  return defHttp.request({
    url: '/groupProjectItemAccount/saveList',
    method: 'POST',
    params
  })
}

export function deleteById(id: any) {
  return defHttp.request({
    url: '/groupProjectItemAccount/deleteById?id=' + id,
    method: 'DELETE',
  })
}

export function findByOriginId(originId) {
  return defHttp.request({
    url: '/groupProjectItemAccount/findByOriginId?originId=' + originId,
    method: 'GET',
  })
}

export function findByTenantId(tenantId) {
  return defHttp.request({
    url: '/groupProjectItemAccount/findByTenantId?tenantId=' + tenantId,
    method: 'GET',
  })
}

export function findByOriginIdAndUniqueCode(originId,uniqueCode) {
  return defHttp.request({
    url: '/groupProjectItemAccount/findByOriginIdAndUniqueCode?originId=' + originId + '&uniqueCode='+uniqueCode,
    method: 'GET',
  })
}

export function findByTenantIdAndUniqueCode(tenantId,uniqueCode) {
  return defHttp.request({
    url: '/groupProjectItemAccount/findByTenantIdAndUniqueCode?tenantId=' + tenantId + '&uniqueCode='+uniqueCode,
    method: 'GET',
  })
}

export function findByUniqueCode(uniqueCode) {
  return defHttp.request({
    url: '/groupProjectItemAccount/findByUniqueCode?uniqueCode='+uniqueCode,
    method: 'GET',
  })
}
