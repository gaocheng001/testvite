import { defHttp } from '/@/utils/http/axios'
import {GetJigouInfoModel} from './model/jigou'
enum Api {
  //
  ACCOUNT_INFO = '/record/dept/getAll',
  ACCOUNT_INFO2 = '/record/dept/getone',
}

// Get personal center-basic settings
export function getDeptAll() {
  return defHttp.request<GetJigouInfoModel>({
    url: Api.ACCOUNT_INFO,
    method: 'GET',
  });
}
export function getDeptOne() {
  return defHttp.request<GetJigouInfoModel>({
    url: Api.ACCOUNT_INFO2,
    method: 'GET',
  });
}