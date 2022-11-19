// @ts-ignore
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

export const findByXhd=defRouteApi( (year)=>{
  return {
    url: '/hexiao/findByXhd?year='+year,
    method: 'GET',
  }
})

export const findBySkWhxXhd=defRouteApi( ({year,cvencode})=>{
  return {
    url: '/hexiao/findBySkWhxXhd?year='+year+'&cvencode='+cvencode,
    method: 'GET',
  }
})

export const findByCgdhd=defRouteApi( (year)=>{
  return {
    url: '/hexiao/findByCgdhd?year='+year,
    method: 'GET',
  }
})

export const findByFkWhxCgdhd=defRouteApi( ({year,cvencode})=>{
  return {
    url: '/hexiao/findByFkWhxCgdhd?year='+year+'&cvencode='+cvencode,
    method: 'GET',
  }
})

export const findSkWhxskdByEndDate=defRouteApi(({year,endDate})=>{
  return {
    url: '/hexiao/findSkWhxskdByEndDate?year='+year+'&endDate='+endDate,
    method: 'GET',
  }
})

export const findFkWhxCgdhdByEndDate=defRouteApi(({year,endDate})=>{
  return {
    url: '/hexiao/findFkWhxCgdhdByEndDate?year='+year+'&endDate='+endDate,
    method: 'GET',
  }
})
