// @ts-ignore
import { defRouteApi } from '/@/utils/boozsoft/datasource/datasourceUtil';

export const findBillByCondition = defRouteApi(async (params: any) => {
  return {
    url: '/stock/change/findBillByCondition',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const findBillCode = defRouteApi(async (params: any) => {
  return {
    url: '/stock/change/code',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});

export const findBillLastDate = defRouteApi(async (params: any) => {
  return {
    url: '/stock/change/lastDate',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});

export const savePlhd = defRouteApi(async (params: any) => {
  return {
    url: '/stock/change/batch',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});

export const saveXhd = defRouteApi(async (params: any) => {
  return {
    url: '/stock/change',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const saveCkd = defRouteApi(async (params: any) => {
  return {
    url: '/stock/change/ckd',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const delBefore = defRouteApi(async (params: any) => {
  return {
    url: '/stock/change/before',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});

export const delXhd = defRouteApi(async (params: any) => {
  return {
    url: '/stock/change',
    timeout: 10000000,
    method: 'DELETE',
    params,
  };
});

export const delRuKu = defRouteApi(async (params: any) => {
  return {
    url: '/stock/change',
    timeout: 10000000,
    method: 'DELETE',
    params,
  };
});
export const batchReview = defRouteApi(async (params: any) => {
  return {
    url: '/stock/change/batchReview',
    method: 'POST',
    params,
  };
});
export const reviewRuKu = defRouteApi(async (params: any) => {
  return {
    url: '/stock/change/review',
    method: 'POST',
    params,
  };
});

export const auditCheckBcheck = defRouteApi(async (params: any) => {
  return {
    url: '/stock/change/auditCheckBcheck',
    method: 'POST',
    params,
  };
});
export const reviewXsdd = defRouteApi(async (params: any) => {
  return {
    url: '/stock/change/review/xsdd',
    method: 'POST',
    params,
  };
});

export const unAuditBefore = defRouteApi(async (params: any) => {
  return {
    url: '/stock/change/unAuditBefore',
    method: 'POST',
    params,
  };
});
export const reviewCkd = defRouteApi(async (params: any) => {
  return {
    url: '/stock/change/review/ckd',
    method: 'POST',
    params,
  };
});


export const batchSelectorList = defRouteApi(async (params: any) => {
  return {
    url: '/stock/change/batchSelectorList',
    method: 'POST',
    params,
  };
});

export const findAllMainList = defRouteApi(async (params: any) => {
  return {
    url: '/stock/change/findAllMainList',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const audit = defRouteApi( async (    params,)=>{
  return  {
    url: '/stock/change/review',
    method: 'POST',
    timeout: 10000000,
    params,
  }
})

export const deleteSettModes = defRouteApi((params)=> {
  return {
    url: '/stock/change',
    method: 'DELETE',
    params
  }
})
export const findByXyOutDataSourrce = defRouteApi(async (params) => {
  return {
    url: '/stock/change/findByXyOutDataSourrce',
    timeout: 100000000000,
    method: 'POST',
    params
  };
});

export const findAllByCondition = defRouteApi(async (params: any) => {
  return {
    url: '/stock/change/findAllByCondition',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const findByXyCcode = defRouteApi( async ({ccode,year,type})=>{
  return  {
    url: '/stock/change/findByXyCcode/'+ccode+'/'+year+'/'+type,
    method: 'GET',
    timeout: 10000000,
  }
})
export const auditCheck = defRouteApi( async ({ccode,rkBcheck,ckBcheck,flg,type})=>{
  return  {
    url: '/stock/change/auditCheck/'+ccode+'/'+rkBcheck+'/'+ckBcheck+'/'+flg+'/'+type,
    method: 'GET',
    timeout: 10000000,
  }
})
export const getDataInfo = defRouteApi( async (ccode)=>{
  return  {
    url: '/stock/change/findStockWareByCcode?ccode='+ccode,
    method: 'POST',
    timeout: 10000000,
  }
})
