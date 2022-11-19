import { defHttp } from '/@/utils/http/axios'

enum Api {
  findAll = '/sys/currency/findAll',
  currencySaveApi = '/sys/currency/save',
  delCurrencyApi = '/sys/currency/del',
sysimportCurrency = '/sys/currency/sysimportCurrency'
}

export function currencySaveApi(params) {
  return defHttp.request({
    url: Api.currencySaveApi,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}
export function findAll(params) {
  return defHttp.request({
    url: Api.findAll,
    method: 'POST',params
  })
}
export function delCurrency(id, params) {
  return defHttp.request({
    url: Api.delCurrencyApi + '?id=' + id,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    }, params
  })
}

export function sysimportCurrency(params) {
  return defHttp.request({
    url: Api.sysimportCurrency,
    timeout: 100000000000,
    method: 'POST',params
  })
}
