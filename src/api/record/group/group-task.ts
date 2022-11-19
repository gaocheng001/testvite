// @ts-ignore
import {defHttp} from "/@/utils/http/axios";


export function findByFunctionModuleAndIyearAndRecordNum(functionModule,iyear,orgUnique) {
  return defHttp.request({
    url: '/groupTask/findByFunctionModuleAndIyearAndRecordNum?functionModule='+functionModule+'&iyear='+iyear+'&orgUnique='+orgUnique,
    method: 'POST',
  })
}
export function groupTaskDelByUserIdAndOrgUniqueAndFunctionModule(functionModule,iyear,orgUnique,userId) {
  return defHttp.request({
    url: '/groupTask/groupTaskDelByUserIdAndOrgUniqueAndFunctionModule?functionModule='+functionModule+'&iyear='+iyear+'&orgUnique='+orgUnique+'&userId='+userId,
    method: 'POST',
  })
}

export function groupTaskSave(data) {
  return defHttp.request({
    url: '/groupTask/groupTaskSave',
    method: 'POST',data
  })
}



