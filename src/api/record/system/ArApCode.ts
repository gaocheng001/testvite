// @ts-ignore
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

export const findArApCodeByBillStyle=defRouteApi( (billStyle)=>{
  return {
    url: '/ArApCode/findByBillStyle?billStyle='+billStyle,
    method: 'GET',
  }
})

export const saveArApCode=defRouteApi( (params)=>{
  return {
    url: '/ArApCode/saveArApCode',
    method: 'POST',
    params
  }
})
