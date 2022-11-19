import {defHttp} from "/@/utils/http/axios";

enum Api {
  findAll = '/sys/role/findAll',
  saveRole = '/sys/role/saveSysRole',
  findByRoleName = '/sys/role/findByRoleName',
  delRole = '/sys/role/delRole',

}


export function  findByRoleName(roleName) {
  return defHttp.request({
    url: Api.findByRoleName+'?roleName='+roleName,
    method: 'POST',
  })
}
export function  findAll() {
  return defHttp.request({
    url: Api.findAll ,
    method: 'GET',
  })
}
export function  saveRole(params) {
  return defHttp.request({
    url: Api.saveRole ,
    method: 'POST',
    params
  })
}
export function  delRole(params) {
  return defHttp.request({
    url: Api.delRole ,
    method: 'DELETE',
    params
  })
}
export function saveAudit(params) {
  return defHttp.request({
    url: '/audit-role',
    method: 'POST',
    params
  })
}
