// @ts-ignore
import {defHttp} from "/@/utils/http/axios";

export function findAll() {
  return defHttp.request({
    url: '/groupProjectClassAccount/findAll',
    method: 'GET',
  })
}

export function save(params: any) {
  return defHttp.request({
    url: '/groupProjectClassAccount/save',
    method: 'POST',
    params
  })
}

export function saveAccount(params: any) {
  return defHttp.request({
    url: '/groupProjectClassAccount/save',
    method: 'POST',
    params
  })
}

export function saveList(params: any) {
  return defHttp.request({
    url: '/groupProjectClassAccount/saveList',
    method: 'POST',
    params
  })
}

export function deleteById(id: any) {
  return defHttp.request({
    url: '/groupProjectClassAccount/deleteById?id=' + id,
    method: 'DELETE',
  })
}

export function findByOriginId(originId) {
  return defHttp.request({
    url: '/groupProjectClassAccount/findByOriginId?originId=' + originId,
    method: 'GET',
  })
}

export function findByTenantId(tenantId) {
  return defHttp.request({
    url: '/groupProjectClassAccount/findByTenantId?tenantId=' + tenantId,
    method: 'GET',
  })
}

export function findByOriginIdAndUniqueCode(originId,uniqueCode) {
  return defHttp.request({
    url: '/groupProjectClassAccount/findByOriginIdAndUniqueCode?originId=' + originId + '&uniqueCode='+uniqueCode,
    method: 'GET',
  })
}

export function findByTenantIdAndUniqueCode(tenantId,uniqueCode) {
  return defHttp.request({
    url: '/groupProjectClassAccount/findByTenantIdAndUniqueCode?tenantId=' + tenantId + '&uniqueCode='+uniqueCode,
    method: 'GET',
  })
}

export function findByUniqueCode(uniqueCode) {
  return defHttp.request({
    url: '/groupProjectClassAccount/findByUniqueCode?uniqueCode='+uniqueCode,
    method: 'GET',
  })
}
