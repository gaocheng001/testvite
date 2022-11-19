// @ts-ignore
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

export const saveArApExpense=defRouteApi( (params)=>{
  return {
    url: '/arApExpense/saveArApExpense',
    method: 'POST',
    params
  }
})

export const saveArApExpenses=defRouteApi( (params)=>{
  return {
    url: '/arApExpense/saveArApExpenses',
    method: 'POST',
    params
  }
})

export const saveArApExpensesList=defRouteApi( (params)=>{
  return {
    url: '/arApExpense/saveArApExpensesList',
    method: 'POST',
    params
  }
})

export const findBukongCcode=defRouteApi( ({num,sum,qzNum,qianzhui,billStyle})=>{
  return {
    url: '/arApExpense/findBukongCcode?num='+num+'&sum='+sum+'&qzNum='+qzNum+'&qianzhui='+qianzhui+'&billStyle='+billStyle,
    method: 'GET',
  }
})

export const findMaxCcode=defRouteApi( ({num,sum,qzNum,qianzhui,billStyle})=>{
  return {
    url: '/arApExpense/findMaxCcode?num='+num+'&sum='+sum+'&qzNum='+qzNum+'&qianzhui='+qianzhui+'&billStyle='+billStyle,
    method: 'GET',
  }
})

export const deleteArApExpenseById=defRouteApi( (id)=>{
  return {
    url: '/arApExpense/deleteArApExpenseById?id='+id,
    method: 'DELETE',
  }
})

export const deleteArApExpensesById=defRouteApi( (id)=>{
  return {
    url: '/arApExpense/deleteArApExpensesById?id='+id,
    method: 'DELETE',
  }
})

export const deleteArApExpensesByCcode=defRouteApi( ({ccode,billStyle})=>{
  return {
    url: '/arApExpense/deleteArApExpensesByCcode?ccode='+ccode+'&billStyle='+billStyle,
    method: 'DELETE',
  }
})

export const findArApExpenseList=defRouteApi( ({billStyle,iyear})=>{
  return {
    url: '/arApExpense/findArApExpenseList?billStyle='+billStyle+'&iyear='+iyear,
    method: 'GET',
  }
})

export const findArApExpensesByCcode=defRouteApi( ({ccode,billStyle})=>{
  return {
    url: '/arApExpense/findArApExpensesByCcode?ccode='+ccode+'&billStyle='+billStyle,
    method: 'GET',
  }
})
