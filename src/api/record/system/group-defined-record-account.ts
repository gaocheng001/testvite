// @ts-ignore
import {defHttp} from "/@/utils/http/axios";

/**
 * @description: Get jigou Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export function findAll() {
  return defHttp.request({
    url: '/groupDefinedRecordAccount/findAll',
    method: 'GET',
  })
}

export function save(params: any) {
  return defHttp.request({
    url: '/groupDefinedRecordAccount/save',
    method: 'POST',
    params
  })
}

export function saveAccount(params: any) {
  return defHttp.request({
    url: '/groupDefinedRecordAccount/save',
    method: 'POST',
    params
  })
}

export function saveList(params: any) {
  return defHttp.request({
    url: '/groupDefinedRecordAccount/saveList',
    method: 'POST',
    params
  })
}

export function deleteById(id: any) {
  return defHttp.request({
    url: '/groupDefinedRecordAccount/deleteById?id=' + id,
    method: 'DELETE',
  })
}

export function findByOriginId(originId,definedCode) {
  return defHttp.request({
    url: '/groupDefinedRecordAccount/findByOriginId?originId=' + originId+'&definedCode='+definedCode,
    method: 'GET',
  })
}

export function findByTenantId(tenantId,definedCode) {
  return defHttp.request({
    url: '/groupDefinedRecordAccount/findByTenantId?tenantId=' + tenantId+'&definedCode='+definedCode,
    method: 'GET',
  })
}

export function findByOriginIdAndUniqueCode(originId,uniqueCode,definedCode) {
  return defHttp.request({
    url: '/groupDefinedRecordAccount/findByOriginIdAndUniqueCode?originId=' + originId + '&uniqueCode='+uniqueCode+'&definedCode='+definedCode,
    method: 'GET',
  })
}

export function findByTenantIdAndUniqueCode(tenantId,uniqueCode,definedCode) {
  return defHttp.request({
    url: '/groupDefinedRecordAccount/findByTenantIdAndUniqueCode?tenantId=' + tenantId + '&uniqueCode='+uniqueCode+'&definedCode='+definedCode,
    method: 'GET',
  })
}

export function findByUniqueCode(uniqueCode,definedCode) {
  return defHttp.request({
    url: '/groupDefinedRecordAccount/findByUniqueCode?uniqueCode='+uniqueCode+'&definedCode='+definedCode,
    method: 'GET',
  })
}
