import { defHttp } from '/@/utils/http/axios'

enum Api {
  closePopDelFtp = '/ftp/closePopDelFtp'
}

export function closePopDelFtp(filename:any) {
  return defHttp.request({
    url: Api.closePopDelFtp + '?filename=' + filename,
    method: 'POST'
  })
}

