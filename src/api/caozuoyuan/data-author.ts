import { defHttp } from '/@/utils/http/axios'

export function getTheControlArchives(params) {
  return defHttp.request({
    url: '/dataAuthor/getTheControlArchives',
    method: 'POST',
    params
  })
}
export function getArchivesAllDataList(params) {
  return defHttp.request({
    url: '/dataAuthor/getArchivesAllDataList',
    method: 'POST',
    params
  })
}
export function saveDataAuthor(params) {
  return defHttp.request({
    url: '/dataAuthor/saveDataAuthor',
    method: 'POST',
    params
  })
}
export function findUserAuthor(params) {
  return defHttp.request({
    url: '/dataAuthor/findUserAuthor',
    method: 'POST',
    params
  })
}
