import {defHttp} from "/@/utils/http/axios";

export function findCorpBankAll() {
  return defHttp.request({
    url: '/corpBank/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function findCorpBankById() {
  return defHttp.request({
    url: '/corpBank/findById',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function saveCorpBank(params:any) {
  return defHttp.request({
    url: '/corpBank',
    method: 'post',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function deleteCorpBank(params:any) {
  return defHttp.request({
    url: '/corpBank/del',
    method: 'post',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}
