import {defHttp} from "/@/utils/http/axios";

export function saveLog(params) {
  return defHttp.request({
    url: '/group/sysLoginLog/saveLog',
    method: 'POST',
    params
  })
}
export function saveAllLog(params) {
  return defHttp.request({
    url: '/group/sysLoginLog/saveAllLog',
    method: 'POST',
    params
  })
}
export function findCondition(params) {
  return defHttp.request({
    url: '/group/sysLoginLog/condition',
    method: 'POST',
    params
  })
}
export function findLeftTree(params) {
  return defHttp.request({
    url: '/group/sysLoginLog/tree',
    method: 'POST',
    params
  })
}
