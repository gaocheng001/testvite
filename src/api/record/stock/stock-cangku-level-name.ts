import {defHttp} from "/@/utils/http/axios";


export function findAllLevelName() {
  return defHttp.request({
    url: '/cangku_level_name/findAll',
    method: 'POST',
  })
}
export function levelNamesave(name) {
  return defHttp.request({
    url: '/cangku_level_name/save?name='+name,
    method: 'POST',
  })
}
export function countByLevelName(name) {
  return defHttp.request({
    url: '/cangku_level_name/countByLevelName?name='+name,
    method: 'POST',
  })
}
export function delById(params) {
  return defHttp.request({
    url: '/cangku_level_name/delById',
    method: 'POST',params
  })
}
