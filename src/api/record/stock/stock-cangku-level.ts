import {defHttp} from "/@/utils/http/axios";


export function  findAll() {
  return defHttp.request({
    url: '/cangku_level/findAll',
    method: 'POST',
  })
}
export function  findByIdLevel(id) {
  return defHttp.request({
    url: '/cangku_level/findByIdLevel?id='+id,
    method: 'POST',
  })
}
export function  findByIdLevelPojo(id) {
  return defHttp.request({
    url: '/cangku_level/findByIdLevelPojo?id='+id,
    method: 'POST',
  })
}
export function  findByOneLevel() {
  return defHttp.request({
    url: '/cangku_level/findByOneLevel',
    method: 'POST',
  })
}

export function  delByIdList(params) {
  return defHttp.request({
    url: '/cangku_level/delByIdList',
    method: 'POST',params
  })
}
export function  cangkuLevelSave(params) {
  return defHttp.request({
    url: '/cangku_level/cangkuLevelSave',
    method: 'POST',params
  })
}
export function  countByLevel2(level2) {
  return defHttp.request({
    url: '/cangku_level/countByLevel2?level2='+level2,
    method: 'POST',
  })
}
export function  countByLevel3(level2,level3) {
  return defHttp.request({
    url: '/cangku_level/countByLevel3?level2='+level2+'&level3='+level3,
    method: 'POST',
  })
}
export function  countByLevel4(level2,level3,level4) {
  return defHttp.request({
    url: '/cangku_level/countByLevel4?level2='+level2+'&level3='+level3+'&level4='+level4,
    method: 'POST',
  })
}
export function  countByLevel5(level2,level3,level4,level5) {
  return defHttp.request({
    url: '/cangku_level/countByLevel5?level2='+level2+'&level3='+level3+'&level4='+level4+'&level5='+level5,
    method: 'POST',
  })
}
export function  countByLevel6(level2,level3,level4,level5,level6) {
  return defHttp.request({
    url: '/cangku_level/countByLevel6?level2='+level2+'&level3='+level3+'&level4='+level4+'&level5='+level5+'&level6='+level6,
    method: 'POST',
  })
}
