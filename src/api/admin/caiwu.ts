
import { defHttp } from '/@/utils/http/axios'
import {GetJigouInfoModel} from './model/jigou'
enum Api {
  //
  ACCOUNT_INFO = '/record/caiwu/getAll',
  ACCOUNT_INFO2 = '/record/caiwu/getone',
}

// Get personal center-basic settings
export function getCaiwuAll() {
  return defHttp.request<GetJigouInfoModel>({
    url: Api.ACCOUNT_INFO,
    method: 'GET',
  });
}
export function getCaiwuOne() {
  return defHttp.request<GetJigouInfoModel>({
    url: Api.ACCOUNT_INFO2,
    method: 'GET',
  });
}