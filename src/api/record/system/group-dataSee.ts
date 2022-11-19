import {defHttp} from "/@/utils/http/axios";
/************授权控制************/
export function saveDataSeeAuthor(params) {
  return defHttp.request({
    url: '/dataSee/saveDataSeeAuthor',
    method: 'POST',
    params
  })
}
export function findDataSeeAuthor(params) {
  return defHttp.request({
    url: '/dataSee/findDataSeeAuthor',
    method: 'POST',
    params
  })
}
export function findAllByUniqueCodeAndDatabaseNameAndIsCtrl(params) {
  return defHttp.request({
    url: '/dataSee/findAllByUniqueCodeAndDatabaseNameAndIsCtrl',
    method: 'POST',
    params
  })
}
/************授权控制************/
