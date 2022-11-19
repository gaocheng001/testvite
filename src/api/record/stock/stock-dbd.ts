// @ts-ignore
import { defRouteApi } from '/@/utils/boozsoft/datasource/datasourceUtil';

export const findBillByCondition = defRouteApi(async (params: any) => {
  return {
    url: '/stock/stockTransfers/findBillByCondition',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const findBillCode = defRouteApi(async (params: any) => {
  return {
    url: '/stock/stockTransfers/code',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});

export const findBillLastDate = defRouteApi(async (params: any) => {
  return {
    url: '/stock/stockTransfers/lastDate',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});


export const saveXhd = defRouteApi(async (params: any) => {
  return {
    url: '/stock/stockTransfers',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});

export const delBefore = defRouteApi(async (params: any) => {
  return {
    url: '/stock/stockTransfers/before',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});

export const delRuKu = defRouteApi(async (params: any) => {
  return {
    url: '/stock/stockTransfers',
    timeout: 10000000,
    method: 'DELETE',
    params,
  };
});

export const reviewRuKu = defRouteApi(async (params: any) => {
  return {
    url: '/stock/stockTransfers/review',
    method: 'POST',
    params,
  };
});


export const unAuditBefore = defRouteApi(async (params: any) => {
  return {
    url: '/stock/stockTransfers/unAuditBefore',
    method: 'POST',
    params,
  };
});

export const batchSelectorList = defRouteApi(async (params: any) => {
  return {
    url: '/stock/stockTransfers/batchSelectorList',
    method: 'POST',
    params,
  };
});
export const reviewBack = defRouteApi(async (params: any) => {
  return {
    url: '/stock/stockTransfers/reviewBack',
    method: 'POST',
    params,
  };
});
export const findAllMainList = defRouteApi(async (params: any) => {
  return {
    url: '/stock/stockTransfers/findAllMainList',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const audit = defRouteApi( async (params,)=>{
  return  {
    url: '/stock/stockTransfers/review',
    method: 'POST',
    timeout: 10000000,
    params,
  }
})
export const auditBack = defRouteApi( async (params)=>{
  return  {
    url: '/stock/stockTransfers/reviewBack',
    method: 'POST',
    timeout: 10000000,
    params,
  }
})

export const auditCheck = defRouteApi( async ({ccode,rkBcheck,ckBcheck,flg,type})=>{
  return  {
    url: '/stock/stockTransfers/auditCheck2/'+ccode+'/'+rkBcheck+'/'+ckBcheck+'/'+flg+'/'+type,
    method: 'GET',
    timeout: 10000000,
  }
})

export const deleteSettModes = defRouteApi((params)=> {
  return {
    url: '/stock/stockTransfers',
    method: 'DELETE',
    params
  }
})
export const findAllByCondition = defRouteApi(async (params: any) => {
  return {
    url: '/stock/stockTransfers/findAllByCondition',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});

export const findByXyCcode = defRouteApi( async ({ccode,year,type})=>{
  return  {
    url: '/stock/stockTransfers/findByXyCcode/'+ccode+'/'+year+'/'+type,
    method: 'GET',
    timeout: 10000000,
  }
})
export const getDataInfo = defRouteApi( async (ccode)=>{
  return  {
    url: '/stock/stockTransfers/findStockWareByCcode?ccode='+ccode,
    method: 'POST',
    timeout: 10000000,
  }
})
