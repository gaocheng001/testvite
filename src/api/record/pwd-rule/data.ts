import {defHttp} from "/@/utils/http/axios";

export function  findByPwdName(pwdName) {
  return defHttp.request({
    url: '/sys/pwdrule/findByPwdName?pwdName='+pwdName,
    method: 'POST',
  })
}
export function  findAll(params) {
  return defHttp.request({
    url: '/sys/pwdrule/findAll',
    method: 'POST',params
  })
}
export function  savePwdRule(params) {
  return defHttp.request({
    url: '/sys/pwdrule/savePwdRule',
    method: 'POST',
    params
  })
}
export function  delPwdRule(params) {
  return defHttp.request({
    url: '/sys/pwdrule/delPwdRule',
    method: 'DELETE',
    params
  })
}
