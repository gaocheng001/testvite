import { defHttp } from '/@/utils/http/axios'
import {GetJigouInfoModel} from './model/jigou'
enum Api {
  //
  ACCOUNT_INFO = '/record/emp/getAll',
  ACCOUNT_INFO2 = '/record/emp/getone',
}

// Get personal center-basic settings
export function getEmpAll() {
  return defHttp.request<GetJigouInfoModel>({
    url: Api.ACCOUNT_INFO,
    method: 'GET',
  });
}
export function getEMpOne() {
  return defHttp.request<GetJigouInfoModel>({
    url: Api.ACCOUNT_INFO2,
    method: 'GET',
  });
}