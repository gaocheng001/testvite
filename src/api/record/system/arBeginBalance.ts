// @ts-ignore
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
// @ts-ignore
import {defHttp} from "/@/utils/http/axios";

export const findAll=defRouteApi( ()=>{
  return {
    url: '/arBeginBalance/findAll',
    method: 'GET',
  }
})

export const findByBillStyleAndIyearOrderByCcode=defRouteApi( ({billStyle, iyear})=>{
  return {
    url: '/arBeginBalance/findByBillStyleAndIyearOrderByCcode?billStyle='+billStyle+'&iyear='+iyear,
    method: 'GET',
  }
})

export const saveBeginBalance=defRouteApi( (params)=>{
  return {
    url: '/arBeginBalance/save',
    method: 'POST',
    params
  }
})

export const deleteBeginBalanceById=defRouteApi( (id)=>{
  return {
    url: '/arBeginBalance/deleteById?id='+id,
    method: 'DELETE',
  }
})

export const findBukongCcode=defRouteApi( ({num,sum,qzNum,qianzhui})=>{
  return {
    url: '/arBeginBalance/findBukongCcode?num='+num+'&sum='+sum+'&qzNum='+qzNum+'&qianzhui='+qianzhui,
    method: 'GET',
  }
})

export const findMaxCcode=defRouteApi( ({num,sum,qzNum,qianzhui})=>{
  return {
    url: '/arBeginBalance/findMaxCcode?num='+num+'&sum='+sum+'&qzNum='+qzNum+'&qianzhui='+qianzhui,
    method: 'GET',
  }
})

export const findByCvencode=defRouteApi( ({cvencode, iyear})=>{
  return {
    url: '/arBeginBalance/findByCvencode?cvencode='+cvencode+'&iyear='+iyear,
    method: 'GET',
  }
})

export const findWhxList = defRouteApi(({billStyle,iyear}) => {
  return {
    url: '/arBeginBalance/findWhxList?billStyle='+billStyle+'&iyear='+iyear,
    method: 'GET'
  }
})

export function findYearByUniqueCode(id){
  return defHttp.request({
    url: '/arBeginBalance/findYearByUniqueCode?id='+id,
    method: 'GET',
  })
}

export const saveArXySource=defRouteApi( (params)=>{
  return {
    url: '/arBeginBalance/saveArXySource',
    method: 'POST',
    params
  }
})

export const findArBeginBalanceByCcode=defRouteApi( (ccode)=>{
  return {
    url: '/arBeginBalance/findByCcode?ccode='+ccode,
    method: 'GET',
  }
})

export const findArXySourceByCcodeAndXyccode=defRouteApi( ({ccode, xyccode})=>{
  return {
    url: '/arBeginBalance/findArXySourceByCcodeAndXyccode?ccode='+ccode+'&xyccode='+xyccode,
    method: 'GET',
  }
})

export const deleteArXySouceById=defRouteApi( (id)=>{
  return {
    url: '/arBeginBalance/deleteArXySouceById?id='+id,
    method: 'DELETE',
  }
})

export const findYszzYueList=defRouteApi( ({iyear,bcheck})=>{
  return {
    url: '/arBeginBalance/findYszzYueList?iyear='+iyear+'&bcheck='+bcheck,
    method: 'GET',
  }
})

export const findYszzYueByCvencodeList=defRouteApi( ({bcheck,iyear,cvencode})=>{
  return {
    url: '/arBeginBalance/findYszzYueByCvencodeList?bcheck='+bcheck+'&iyear='+iyear+'&cvencode='+cvencode,
    method: 'GET',
  }
})

export const findSkdYueList=defRouteApi( ({iyear,bcheck})=>{
  return {
    url: '/arBeginBalance/findSkdYueList?iyear='+iyear+'&bcheck='+bcheck,
    method: 'GET',
  }
})

export const findFkdYueList=defRouteApi( ({iyear,bcheck})=>{
  return {
    url: '/arBeginBalance/findFkdYueList?iyear='+iyear+'&bcheck='+bcheck,
    method: 'GET',
  }
})

export const findSkdYueByCvencodeList=defRouteApi( ({bcheck,iyear,cvencode})=>{
  return {
    url: '/arBeginBalance/findSkdYueByCvencodeList?bcheck='+bcheck+'&iyear='+iyear+'&cvencode='+cvencode,
    method: 'GET',
  }
})

export const findFkdYueByCvencodeList=defRouteApi( ({bcheck,iyear,cvencode})=>{
  return {
    url: '/arBeginBalance/findFkdYueByCvencodeList?bcheck='+bcheck+'&iyear='+iyear+'&cvencode='+cvencode,
    method: 'GET',
  }
})

export const findWhxByBillStyleList = defRouteApi(({billStyle,iyear}) => {
  return {
    url: '/arBeginBalance/findWhxByBillStyleList?billStyle='+billStyle+'&iyear='+iyear,
    method: 'GET'
  }
})

export const findWhxByArStyleList = defRouteApi(({arStyle,iyear}) => {
  return {
    url: '/arBeginBalance/findWhxByArStyleList?arStyle='+arStyle+'&iyear='+iyear,
    method: 'GET'
  }
})
