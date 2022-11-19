// @ts-ignore
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

export const saveJiesuanPojo=defRouteApi( (params)=>{
  return {
    url: '/stockJiesuan/saveJiesuanPojo',
    method: 'POST',params
  }
})
export const saveJiesuansPojo=defRouteApi( (params)=>{
  return {
    url: '/stockJiesuan/saveJiesuansPojo',
    method: 'POST',params
  }
})

export const getNewStockJiesuanNum=defRouteApi( ()=>{
  return {
    url: '/stockJiesuan/getNewStockJiesuanNum',
    method: 'GET'
  }
})
export const delJiesuansByCcodeRuku=defRouteApi( (ccodeRuku)=>{
  return {
    url: '/stockJiesuan/delJiesuansByCcodeRuku?ccodeRuku='+ccodeRuku,
    method: 'POST'
  }
})
export const delJiesuansByCcode=defRouteApi( (ccode)=>{
  return {
    url: '/stockJiesuan/delJiesuansByCcode?ccode='+ccode,
    method: 'POST'
  }
})
export const findBillByCondition=defRouteApi( (params)=>{
  return {
    url: '/stockJiesuan/findBillByCondition',
    method: 'POST',params
  }
})
export const findAllStockJiesuanList=defRouteApi( (params)=>{
  return {
    url: '/stockJiesuan/findAllStockJiesuanList',
    method: 'POST',params
  }
})
export const findByCcodeStockJiesuanList=defRouteApi( (ccode)=>{
  return {
    url: '/stockJiesuan/findByCcodeStockJiesuanList?ccode='+ccode,
    method: 'POST',
  }
})
export const findJieSuanByCaigouDaoHuo=defRouteApi( (params)=>{
  return {
    url: '/stockJiesuan/findJieSuanByCaigouDaoHuo',
    method: 'POST',params
  }
})
export const findJieSuanTableList=defRouteApi( (params)=>{
  return {
    url: '/stockJiesuan/findJieSuanTableList',
    method: 'POST',params
  }
})
export const deleteByCcodeDaohuo=defRouteApi( (ccodeRuku)=>{
  return {
    url: '/stockJiesuan/deleteByCcodeDaohuo?ccodeRuku='+ccodeRuku,
    method: 'POST',
  }
})
