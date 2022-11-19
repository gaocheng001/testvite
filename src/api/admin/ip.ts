import { defHttp } from '/@/utils/http/axios'
import { GetJigouInfoModel } from './model/jigou'
enum Api {
  //
  ACCOUNT_INFO = '/api/ip/getAll',
  ACCOUNT_INFO2 = '/api/ip/getone',
}

// Get personal center-basic settings
export function getIpAll() {
  return defHttp.request<GetJigouInfoModel>({
    url: Api.ACCOUNT_INFO,
    method: 'GET'
  })
}
export function getIpOne() {
  return defHttp.request<GetJigouInfoModel>({
    url: Api.ACCOUNT_INFO2,
    method: 'GET'
  })
}
