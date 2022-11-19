// @ts-ignore
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

export const findByTypeList=defRouteApi( ({type,year})=>{
  return {
    url: '/arApYsyf/findByTypeList?type='+type+'&year='+year,
    method: 'GET',
  }
})

export const findByTypeByDateList=defRouteApi( ({type,ddate1,ddate2})=>{
  return {
    url: '/arApYsyf/findByTypeByDateList?type='+type+'&ddate1='+ddate1+'&ddate2='+ddate2,
    method: 'GET',
  }
})

export const findByTypeLists=defRouteApi( ({type,year})=>{
  return {
    url: '/arApYsyf/findByTypeLists?type='+type+'&year='+year,
    method: 'GET',
  }
})

export const saveYsyf=defRouteApi( (params)=>{
  return {
    url: '/arApYsyf/saveYsyf',
    method: 'POST',
    params
  }
})

export const saveYsyfs=defRouteApi( (params)=>{
  return {
    url: '/arApYsyf/saveYsyfs',
    method: 'POST',
    params
  }
})

export const saveYsyfsList=defRouteApi( (params)=>{
  return {
    url: '/arApYsyf/saveYsyfsList',
    method: 'POST',
    params
  }
})

export const saveWriteOff=defRouteApi( (params)=>{
  return {
    url: '/arApYsyf/saveWriteOff',
    method: 'POST',
    params
  }
})

export const saveWriteOffList=defRouteApi( (params)=>{
  return {
    url: '/arApYsyf/saveWriteOffList',
    method: 'POST',
    params
  }
})

export const findBukongCcode=defRouteApi( ({num,sum,qzNum,qianzhui,billStyle})=>{
  return {
    url: '/arApYsyf/findBukongCcode?num='+num+'&sum='+sum+'&qzNum='+qzNum+'&qianzhui='+qianzhui+'&billStyle='+billStyle,
    method: 'GET',
  }
})

export const findMaxCcode=defRouteApi( ({num,sum,qzNum,qianzhui,billStyle})=>{
  return {
    url: '/arApYsyf/findMaxCcode?num='+num+'&sum='+sum+'&qzNum='+qzNum+'&qianzhui='+qianzhui+'&billStyle='+billStyle,
    method: 'GET',
  }
})

export const findCustomerByFlag = defRouteApi(()=>{
  return {
    url:'/sys/cusrtomer/findAllByFlag',
    method: 'GET'
  }
})

export const findArApYsyfByCcode=defRouteApi( (ccode)=>{
  return {
    url: '/arApYsyf/findArApYsyfByCcode?ccode='+ccode,
    method: 'GET',
  }
})

export const findArApYsyfsByCcode=defRouteApi( (ccode)=>{
  return {
    url: '/arApYsyf/findArApYsyfsByCcode?ccode='+ccode,
    method: 'GET',
  }
})

export const findArApWriteOffByCcode=defRouteApi( (ccode)=>{
  return {
    url: '/arApYsyf/findArApWriteOffByCcode?ccode='+ccode,
    method: 'GET',
  }
})

export const findArApWriteOffByCcodeAndHxCcode=defRouteApi( ({ccode,hxCcode})=>{
  return {
    url: '/arApYsyf/findArApWriteOffByCcodeAndHxCcode?ccode='+ccode+'&hxCcode='+hxCcode,
    method: 'GET',
  }
})

export const findArApWriteOffByType=defRouteApi( ({type,year})=>{
  return {
    url: '/arApYsyf/findArApWriteOffByType?type='+type+'&year='+year,
    method: 'GET',
  }
})

export const saveSaleousing=defRouteApi( (params)=>{
  return {
    url: '/arApYsyf/saveSaleousing',
    method: 'POST',
    params
  }
})

export const saveStockXyCsource=defRouteApi( (params)=>{
  return {
    url: '/arApYsyf/saveStockXyCsource',
    method: 'POST',
    params
  }
})

export const findYskhxmxb=defRouteApi( (year)=>{
  return {
    url: '/arApYsyf/findYskhxmxb?year='+year,
    method: 'GET',
  }
})

export const findYskhxmxbYue=defRouteApi( (year)=>{
  return {
    url: '/arApYsyf/findYskhxmxbYue?year='+year,
    method: 'GET',
  }
})

export const findYfkhxmxb=defRouteApi( (year)=>{
  return {
    url: '/arApYsyf/findYfkhxmxb?year='+year,
    method: 'GET',
  }
})

export const findYfkhxmxbYue=defRouteApi( (year)=>{
  return {
    url: '/arApYsyf/findYfkhxmxbYue?year='+year,
    method: 'GET',
  }
})

export const findQuxiaohexiaoList=defRouteApi( (year)=>{
  return {
    url: '/arApYsyf/findQuxiaohexiaoList?year='+year,
    method: 'GET',
  }
})

export const findQuxiaohexiaoYueList=defRouteApi( (year)=>{
  return {
    url: '/arApYsyf/findQuxiaohexiaoYueList?year='+year,
    method: 'GET',
  }
})

export const findQuxiaohexiaoYfdList=defRouteApi( (year)=>{
  return {
    url: '/arApYsyf/findQuxiaohexiaoYfdList?year='+year,
    method: 'GET',
  }
})

export const findQuxiaohexiaoYfdYueList=defRouteApi( (year)=>{
  return {
    url: '/arApYsyf/findQuxiaohexiaoYfdYueList?year='+year,
    method: 'GET',
  }
})

export const findSaleousingByCcode=defRouteApi( (ccode)=>{
  return {
    url: '/arApYsyf/findSaleousingByCcode?ccode='+ccode,
    method: 'GET',
  }
})

export const findXyCsourceByCcodeAndXyccode=defRouteApi( ({ccode, xyccode})=>{
  return {
    url: '/arApYsyf/findXyCsourceByCcodeAndXyccode?ccode='+ccode+'&xyccode='+xyccode,
    method: 'GET',
  }
})

export const deleteXyCsouceById=defRouteApi( (id)=>{
  return {
    url: '/arApYsyf/deleteXyCsouceById?id='+id,
    method: 'DELETE',
  }
})

export const deleteArApWriteOffById=defRouteApi( (id)=>{
  return {
    url: '/arApYsyf/deleteArApWriteOffById?id='+id,
    method: 'DELETE',
  }
})

export const findWhxskd = defRouteApi( ({year,cvencode})=>{
  return {
    url: '/arApYsyf/findWhxskd?year='+year+'&cvencode='+cvencode,
    method: 'GET'
  }
})

export const findWhxskdByEndDate = defRouteApi( ({billStyle,year,endDate})=>{
  return {
    url: '/arApYsyf/findWhxskdByEndDate?billStyle='+billStyle+'&year='+year+'&endDate='+endDate,
    method: 'GET'
  }
})

export const deleteArApYsyfById=defRouteApi( (id)=>{
  return {
    url: '/arApYsyf/deleteArApYsyfById?id='+id,
    method: 'DELETE',
  }
})

export const deleteArApYsyfsByCcode=defRouteApi( (ccode)=>{
  return {
    url: '/arApYsyf/deleteArApYsyfsByCcode?ccode='+ccode,
    method: 'DELETE',
  }
})

export const deleteArApYsyfsById=defRouteApi( (id)=>{
  return {
    url: '/arApYsyf/deleteArApYsyfsById?id='+id,
    method: 'DELETE',
  }
})

export const findSkdtjbList=defRouteApi( ({bcheck,ddate1,ddate2})=>{
  return {
    url: '/arApYsyf/findSkdtjbList?bcheck='+bcheck+'&ddate1='+ddate1+'&ddate2='+ddate2,
    method: 'GET',
  }
})

export const findSkdmxzList=defRouteApi( ({bcheck,ddate1,ddate2,cvencode})=>{
  return {
    url: '/arApYsyf/findSkdmxzList?bcheck='+bcheck+'&ddate1='+ddate1+'&ddate2='+ddate2+'&cvencode='+cvencode,
    method: 'GET',
  }
})

export const findFkdtjbList=defRouteApi( ({bcheck,ddate1,ddate2})=>{
  return {
    url: '/arApYsyf/findFkdtjbList?bcheck='+bcheck+'&ddate1='+ddate1+'&ddate2='+ddate2,
    method: 'GET',
  }
})

export const findFkdmxzList=defRouteApi( ({bcheck,ddate1,ddate2,cvencode})=>{
  return {
    url: '/arApYsyf/findFkdmxzList?bcheck='+bcheck+'&ddate1='+ddate1+'&ddate2='+ddate2+'&cvencode='+cvencode,
    method: 'GET',
  }
})

export const findSkdByEndDateList=defRouteApi( ({bcheck,iyear,endDate})=>{
  return {
    url: '/arApYsyf/findSkdByEndDateList?bcheck='+bcheck+'&iyear='+iyear+'&endDate='+endDate,
    method: 'GET',
  }
})

export const findFkdByEndDateList=defRouteApi( ({bcheck,iyear,endDate})=>{
  return {
    url: '/arApYsyf/findFkdByEndDateList?bcheck='+bcheck+'&iyear='+iyear+'&endDate='+endDate,
    method: 'GET',
  }
})

export const findWriteOffByIyearAndBillStyle=defRouteApi( ({iyear,billStyle})=>{
  return {
    url: '/arApYsyf/findWriteOffByIyearAndBillStyle?iyear='+iyear+'&billStyle='+billStyle,
    method: 'GET',
  }
})
