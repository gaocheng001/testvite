import { defHttp } from '/@/utils/http/axios'
import { GetJigouInfoModel } from './model/jigou'
enum Api {
  //
  ACCOUNT_INFO = '/api/currency/getAll',
  ACCOUNT_INFO2 = '/api/currency/getone',
}

// Get personal center-basic settings
export function getCurrencyAll() {
  return defHttp.request<GetJigouInfoModel>({
    url: Api.ACCOUNT_INFO,
    method: 'GET'
  })
}
export function getCurrencyOne() {
  return defHttp.request<GetJigouInfoModel>({
    url: Api.ACCOUNT_INFO2,
    method: 'GET'
  })
}
