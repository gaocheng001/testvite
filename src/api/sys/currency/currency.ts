import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetJigouTree = '/sys/jigou/tree'
}

export function GetJigouTree() {
  return defHttp.request({
    url: Api.GetJigouTree,
    method: 'GET'
  })
}
