import {defHttp} from "/@/utils/http/axios";

// params 是getEmpListByIdParams 类型的
export function findAll() {
  return defHttp.request({
    url: '/groupPermission/findAll',
    timeout: 1000000,
    method: 'GET',
  })
}

export function findByUserIdAndOriginId(userId,originId,baseEnName) {
  return defHttp.request({
    url: '/groupPermission/findByUserIdAndOriginId?userId=' + userId + '&originId=' + originId + '&baseEnName=' + baseEnName,
    timeout: 1000000,
    method: 'GET',
  })
}

export function findByUserIdAndTenantId(userId,tenantId,baseEnName) {
  return defHttp.request({
    url: '/groupPermission/findByUserIdAndTenantId?userId=' + userId + '&tenantId=' + tenantId + '&baseEnName=' + baseEnName,
    timeout: 1000000,
    method: 'GET',
  })
}
/************审批授权************/
export function saveApproveAuthor(params) {
  return defHttp.request({
    url: '/groupPermission/saveApproveAuthor',
    method: 'POST',
    params
  })
}
export function findUserApproveAuthor(params) {
  return defHttp.request({
    url: '/groupPermission/findUserApproveAuthor',
    method: 'POST',
    params
  })
}
/************审批授权************/
