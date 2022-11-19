import { defHttp } from '/@/utils/http/axios';
export async function findParameterValue(params:any) {
  return defHttp.request({
    url: '/group-query-plan',
    method: 'GET',
    params
  })
}

export async function modifyParameterValue(params:any) {
  return defHttp.request({
    url: '/group-query-plan',
    method: 'POST',
    params
  })
}
