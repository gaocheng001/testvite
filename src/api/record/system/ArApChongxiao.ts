// @ts-ignore
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

export const saveArApChongxiao=defRouteApi( (params)=>{
  return {
    url: '/arApChongxiao/saveArApChongxiao',
    method: 'POST',
    params
  }
})

export const saveArApChongxiaos=defRouteApi( (params)=>{
  return {
    url: '/arApChongxiao/saveArApChongxiaos',
    method: 'POST',
    params
  }
})

export const saveArApChongxiaosList=defRouteApi( (params)=>{
  return {
    url: '/arApChongxiao/saveArApChongxiaosList',
    method: 'POST',
    params
  }
})

export const findBukongCcode=defRouteApi( ({num,sum,qzNum,qianzhui,billStyle})=>{
  return {
    url: '/arApChongxiao/findBukongCcode?num='+num+'&sum='+sum+'&qzNum='+qzNum+'&qianzhui='+qianzhui+'&billStyle='+billStyle,
    method: 'GET',
  }
})

export const findMaxCcode=defRouteApi( ({num,sum,qzNum,qianzhui,billStyle})=>{
  return {
    url: '/arApChongxiao/findMaxCcode?num='+num+'&sum='+sum+'&qzNum='+qzNum+'&qianzhui='+qianzhui+'&billStyle='+billStyle,
    method: 'GET',
  }
})

export const deleteArApChongxiaoById=defRouteApi( (id)=>{
  return {
    url: '/arApChongxiao/deleteArApChongxiaoById?id='+id,
    method: 'DELETE',
  }
})

export const deleteArApChongxiaosById=defRouteApi( (id)=>{
  return {
    url: '/arApChongxiao/deleteArApChongxiaosById?id='+id,
    method: 'DELETE',
  }
})

export const deleteArApChongxiaosByCcode=defRouteApi( ({ccode,billStyle})=>{
  return {
    url: '/arApChongxiao/deleteArApChongxiaosByCcode?ccode='+ccode+'&billStyle='+billStyle,
    method: 'DELETE',
  }
})

export const findArApChongxiaoList=defRouteApi( ({billStyle,iyear})=>{
  return {
    url: '/arApChongxiao/findArApChongxiaoList?billStyle='+billStyle+'&iyear='+iyear,
    method: 'GET',
  }
})

export const findArApChongxiaosByCcode=defRouteApi( ({ccode,billStyle})=>{
  return {
    url: '/arApChongxiao/findArApChongxiaosByCcode?ccode='+ccode+'&billStyle='+billStyle,
    method: 'GET',
  }
})

export const findChongxiaosByCcode=defRouteApi( ({ccode,billStyle})=>{
  return {
    url: '/arApChongxiao/findChongxiaosByCcode?ccode='+ccode+'&billStyle='+billStyle,
    method: 'GET',
  }
})

export const findChongxiaosByIyearAndBillStyle=defRouteApi( ({iyear,billStyle})=>{
  return {
    url: '/arApChongxiao/findChongxiaosByIyearAndBillStyle?iyear='+iyear+'&billStyle='+billStyle,
    method: 'GET',
  }
})

export const deleteByCxCcode=defRouteApi( ({ccode,billStyle})=>{
  return {
    url: '/arApChongxiao/deleteByCxCcode?ccode='+ccode+'&billStyle='+billStyle,
    method: 'DELETE',
  }
})
