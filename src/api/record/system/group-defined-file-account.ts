// @ts-ignore
import {defHttp} from "/@/utils/http/axios";

/**
 * @description: Get jigou Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export function findAll() {
  return defHttp.request({
    url: '/groupDefinedFileAccount/findAll',
    method: 'GET',
  })
}

export function save(params: any) {
  return defHttp.request({
    url: '/groupDefinedFileAccount/save',
    method: 'POST',
    params
  })
}

export function saveAccount(params: any) {
  return defHttp.request({
    url: '/groupDefinedFileAccount/save',
    method: 'POST',
    params
  })
}

export function saveList(params: any) {
  return defHttp.request({
    url: '/groupDefinedFileAccount/saveList',
    method: 'POST',
    params
  })
}

export function deleteById(id: any) {
  return defHttp.request({
    url: '/groupDefinedFileAccount/deleteById?id=' + id,
    method: 'DELETE',
  })
}

export function findByOriginId(originId) {
  return defHttp.request({
    url: '/groupDefinedFileAccount/findByOriginId?originId=' + originId,
    method: 'GET',
  })
}

export function findByTenantId(tenantId) {
  return defHttp.request({
    url: '/groupDefinedFileAccount/findByTenantId?tenantId=' + tenantId,
    method: 'GET',
  })
}

export function findByOriginIdAndUniqueCode(originId,uniqueCode) {
  return defHttp.request({
    url: '/groupDefinedFileAccount/findByOriginIdAndUniqueCode?originId=' + originId + '&uniqueCode='+uniqueCode,
    method: 'GET',
  })
}

export function findByTenantIdAndUniqueCode(tenantId,uniqueCode) {
  return defHttp.request({
    url: '/groupDefinedFileAccount/findByTenantIdAndUniqueCode?tenantId=' + tenantId + '&uniqueCode='+uniqueCode,
    method: 'GET',
  })
}

export function findByUniqueCode(uniqueCode) {
  return defHttp.request({
    url: '/groupDefinedFileAccount/findByUniqueCode?uniqueCode='+uniqueCode,
    method: 'GET',
  })
}
