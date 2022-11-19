// @ts-ignore
import {defHttp} from "/@/utils/http/axios";

export function findAll() {
  return defHttp.request({
    url: '/groupProjectAccount/findAll',
    method: 'GET',
  })
}

export function save(params: any) {
  return defHttp.request({
    url: '/groupProjectAccount/save',
    method: 'POST',
    params
  })
}

export function saveAccount(params: any) {
  return defHttp.request({
    url: '/groupProjectAccount/save',
    method: 'POST',
    params
  })
}

export function saveList(params: any) {
  return defHttp.request({
    url: '/groupProjectAccount/saveList',
    method: 'POST',
    params
  })
}

export function deleteById(id: any) {
  return defHttp.request({
    url: '/groupProjectAccount/deleteById?id=' + id,
    method: 'DELETE',
  })
}

export function findByOriginId(originId) {
  return defHttp.request({
    url: '/groupProjectAccount/findByOriginId?originId=' + originId,
    method: 'GET',
  })
}

export function findByTenantId(tenantId) {
  return defHttp.request({
    url: '/groupProjectAccount/findByTenantId?tenantId=' + tenantId,
    method: 'GET',
  })
}

export function findByOriginIdAndUniqueCode(originId,uniqueCode) {
  return defHttp.request({
    url: '/groupProjectAccount/findByOriginIdAndUniqueCode?originId=' + originId + '&uniqueCode='+uniqueCode,
    method: 'GET',
  })
}

export function findByTenantIdAndUniqueCode(tenantId,uniqueCode) {
  return defHttp.request({
    url: '/groupProjectAccount/findByTenantIdAndUniqueCode?tenantId=' + tenantId + '&uniqueCode='+uniqueCode,
    method: 'GET',
  })
}

export function findByUniqueCode(uniqueCode) {
  return defHttp.request({
    url: '/groupProjectAccount/findByUniqueCode?uniqueCode='+uniqueCode,
    method: 'GET',
  })
}
