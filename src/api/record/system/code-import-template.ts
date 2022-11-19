import {defHttp} from "/@/utils/http/axios";

export function findAll() {
  return defHttp.request({
    url: '/codeimporttemplate/findAll',timeout: 100000000000,
    method: 'POST',
  });
}

export function countByTname(tname) {
  return defHttp.request({
    url: '/codeimporttemplate/countByTname?tname='+tname,timeout: 100000000000,
    method: 'POST',
  });
}
export function save(params) {
  return defHttp.request({
    url: '/codeimporttemplate/save',timeout: 100000000000,
    method: 'POST',params
  });
}
export function findByIdDel(params) {
  return defHttp.request({
    url: '/codeimporttemplate/findByIdDel',timeout: 100000000000,
    method: 'POST',params
  });
}
