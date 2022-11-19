import {defHttp} from '/@/utils/http/axios'

export function saveServerConfigInfo(params: any) {
  return defHttp.request({
    url: '/group/config',
    method: 'POST',
    params
  })
}

export function findServerConfigInfo() {
  return defHttp.request({
    url: '/group/config',
    method: 'GET',
  })
}
