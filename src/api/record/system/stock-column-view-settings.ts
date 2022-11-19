// @ts-ignore
import {defHttp} from "/@/utils/http/axios";

export async function findStockDbLanMuList(params: any) {
  return defHttp.request({
    url: '/api/stockColumnViewSettings',
    method: 'GET',
    params
  })
}

export async function saveStockLanMuList(params: any) {
  return defHttp.request({
    url: '/api/stockColumnViewSettings',
    method: 'POST',
    params
  })
}

export async function delStockDigestLanMuList(params: any) {
  return defHttp.request({
    url: '/api/stockColumnViewSettings/delDigestColumnSettingsApi',
    method: 'POST',
    params
  })
}
