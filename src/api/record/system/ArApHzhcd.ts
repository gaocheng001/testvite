// @ts-ignore
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

export const saveArApHzhcd=defRouteApi( (params)=>{
  return {
    url: '/arApHzhcd/saveArApHzhcd',
    method: 'POST',
    params
  }
})

export const saveArApHzhcds=defRouteApi( (params)=>{
  return {
    url: '/arApHzhcd/saveArApHzhcds',
    method: 'POST',
    params
  }
})

export const saveArApHzhcdsList=defRouteApi( (params)=>{
  return {
    url: '/arApHzhcd/saveArApHzhcdsList',
    method: 'POST',
    params
  }
})

export const findBukongCcode=defRouteApi( ({num,sum,qzNum,qianzhui,billStyle})=>{
  return {
    url: '/arApHzhcd/findBukongCcode?num='+num+'&sum='+sum+'&qzNum='+qzNum+'&qianzhui='+qianzhui+'&billStyle='+billStyle,
    method: 'GET',
  }
})

export const findMaxCcode=defRouteApi( ({num,sum,qzNum,qianzhui,billStyle})=>{
  return {
    url: '/arApHzhcd/findMaxCcode?num='+num+'&sum='+sum+'&qzNum='+qzNum+'&qianzhui='+qianzhui+'&billStyle='+billStyle,
    method: 'GET',
  }
})

export const deleteArApHzhcdById=defRouteApi( (id)=>{
  return {
    url: '/arApHzhcd/deleteArApHzhcdById?id='+id,
    method: 'DELETE',
  }
})

export const deleteArApHzhcdsById=defRouteApi( (id)=>{
  return {
    url: '/arApHzhcd/deleteArApHzhcdsById?id='+id,
    method: 'DELETE',
  }
})

export const deleteArApHzhcdsByCcode=defRouteApi( ({ccode,billStyle})=>{
  return {
    url: '/arApHzhcd/deleteArApHzhcdsByCcode?ccode='+ccode+'&billStyle='+billStyle,
    method: 'DELETE',
  }
})

export const findArApHzhcdList=defRouteApi( ({billStyle,iyear})=>{
  return {
    url: '/arApHzhcd/findArApHzhcdList?billStyle='+billStyle+'&iyear='+iyear,
    method: 'GET',
  }
})

export const findArApHzhcdsByCcode=defRouteApi( ({ccode,billStyle})=>{
  return {
    url: '/arApHzhcd/findArApHzhcdsByCcode?ccode='+ccode+'&billStyle='+billStyle,
    method: 'GET',
  }
})

export const findHzhcdsByCcode=defRouteApi( ({ccode,billStyle,busStyle})=>{
  return {
    url: '/arApHzhcd/findHzhcdsByCcode?ccode='+ccode+'&billStyle='+billStyle+'&busStyle='+busStyle,
    method: 'GET',
  }
})

export const findHzhcdsByIyearAndBillStyle=defRouteApi( ({iyear,billStyle})=>{
  return {
    url: '/arApHzhcd/findHzhcdsByIyearAndBillStyle?iyear='+iyear+'&billStyle='+billStyle,
    method: 'GET',
  }
})
