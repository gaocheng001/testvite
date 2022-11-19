import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";



export const findRiqiList = defRouteApi( async ({iyear,id}) => {
    return {
      url:'/stockCostAcc/findRiqiList/'+iyear+'/'+id,
      method: 'GET',
      timeout: 100000000000,
    };
  }
);


export const warehousingOne = defRouteApi((params: any) => {
  return {
    url:'/stockCostAcc/warehousingOne',
    method: 'POST',
    params
  }
})
export const warehousingTwo = defRouteApi((params: any) => {
  return {
    url:'/stockCostAcc/warehousingTwo',
    method: 'POST',
    params
  }
})
export const warehousingThree = defRouteApi((params: any) => {
  return {
    url:'/stockCostAcc/warehousingThree',
    method: 'POST',
    params
  }
})

export const getCkPrice = defRouteApi((params: any) => {
  return {
    url:'/stockCostAcc/getCkPrice',
    method: 'POST',
    params
  }
})
export const getCkPriceList = defRouteApi((params: any) => {
  return {
    url:'/stockCostAcc/getCkPriceList',
    method: 'POST',
    params
  }
})
