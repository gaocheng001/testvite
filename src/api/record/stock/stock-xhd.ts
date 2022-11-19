// @ts-ignore
import { defRouteApi } from '/@/utils/boozsoft/datasource/datasourceUtil';

export const findBillByCondition = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/findBillByCondition',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});

export const findBillByCondition2 = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/findBillByCondition2',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});

export const findEntityAndDetailsByCcode = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/findEntityAndDetailsByCcode',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});

export const findBillCode = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/code',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});

export const findBillLastDate = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/lastDate',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});

export const savePlhd = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/batch',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const getBatch = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/getBatch',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const saveXhd = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const saveFp = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/xsfp',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const saveXhdQc = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/qcxhd',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const saveCkdQt = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/qtckd',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const saveCkd = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/ckd',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const saveXsqrd = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/qrckd',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});


export const delBefore = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/before',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});

export const delXhd = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing',
    timeout: 10000000,
    method: 'DELETE',
    params,
  };
});

export const delRuKu = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing',
    timeout: 10000000,
    method: 'DELETE',
    params,
  };
});
export const delQrd = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/qrd',
    timeout: 10000000,
    method: 'DELETE',
    params,
  };
});
export const delBatch = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/batch',
    timeout: 10000000,
    method: 'DELETE',
    params,
  };
});

export const batchReview = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/batchReview',
    method: 'POST',
    params,
  };
});

export const batchReviewCkd = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/batchReview/ckd',
    method: 'POST',
    params,
  };
});

export const reviewRuKu = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/review',
    method: 'POST',
    params,
  };
});

export const reviewXsdd = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/review/xsdd',
    method: 'POST',
    params,
  };
});

export const unAuditBefore = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/unAuditBefore',
    method: 'POST',
    params,
  };
});

export const changeBefore = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/changeBefore',
    method: 'POST',
    params,
  };
});
export const reviewCkd = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/review/ckd',
    method: 'POST',
    params,
  };
});

export const reviewQrd = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/review/qrd',
    method: 'POST',
    params,
  };
});
export const reviewSpecialQrd = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/review/specialQrd',
    method: 'POST',
    params,
  };
});

export const findQrdChangeList = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/review/change',
    method: 'POST',
    params,
  };
});
export const batchSelectorList = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/batchSelectorList',
    method: 'POST',
    params,
  };
});

export const findOutByTypeList = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/findOutByTypeList',
    method: 'POST',
    params,
  };
});

export const findByDdateAndType = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/findByDdateAndType',
    method: 'POST',
    params,
  };
});
export const findAllByStockSaleousingsTypeAndIyear = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/findAllByStockSaleousingsTypeAndIyear',
    method: 'POST',
    params,
  };
});


export const findByDdateAndCk = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/findByDdateAndCk',
    method: 'POST',
    params,
  };
});
export const findAllJhzxByDate = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/findAllJhzxByDate',
    method: 'POST',
    params,
  };
});

export const findbyStockSaleousingsCodeAndBillStyle = defRouteApi(async ({code,billStyle}) => {
  return {
    url: '/stock/saleousing/findbyStockSaleousingsCodeAndBillStyle?code='+code+'&billStyle='+billStyle,
    method: 'POST',
  };
});
export const findbyStockSaleousingsCode = defRouteApi(async (ccode) => {
  return {
    url: '/stock/saleousing/findbyStockSaleousingsCode?code='+ccode,
    method: 'POST',
  };
});

export const findbyStockSaleousingCode = defRouteApi(async (code) => {
  return {
    url: '/stock/saleousing/findbyStockSaleousingCode?code='+code,
    method: 'POST',
  };
});
export const findMingXiDeduplicationByCodes = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/findMingXiDeduplicationByCodes',
    method: 'POST',
    params,
  };
});
export const findMingXiBySoureCodes = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/findMingXiBySoureCodes',
    method: 'POST',
    params,
  };
});

export const findAllSaleousingByCodes = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/findAllSaleousingByCodes',
    method: 'POST',
    params,
  };
});

export const findTongJi = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/findTongJi',
    method: 'POST',
    params,
  };
});

export const findMingXi = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/findMingXi',
    method: 'POST',
    params,
  };
});
export const findAllXHD_And_QCXHD = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/findAllXHD_And_QCXHD',
    method: 'POST',
    params,
  };
});
export const findAllSalesRefer = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/findAllSalesRefer',
    method: 'POST',
    params,
  };
});

export const findAllXSCKD = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/findAllXSCKD',
    method: 'POST',
    params,
  };
});

export const findAllByStockSalesListCcode=defRouteApi( (params)=>{
  return {
    url: '/stock/saleousing/findAllByListCcode',
    method: 'POST',params
  }
})
export const findXclByZero=defRouteApi( (params)=>{
  return {
    url: '/stockKcXCL/findXclByZero',
    method: 'POST',params
  }
})
export const findXclListByYear=defRouteApi( (params)=>{
  return {
    url: '/stockKcXCL/findXclListByYear',
    method: 'POST',params
  }
})

export const findCustYsYue = defRouteApi(async (params: any) => {
  return {
    url: '/stock/custBalance/findCustYsYue',
    method: 'POST',
    params,
  };
});
export const generateCkd = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/generateCkd',
    method: 'POST',
    params,
  };
});


export const generateThd = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/generateThd',
    method: 'POST',
    params,
  };
});

export const generateXhd = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/generateXhd',
    method: 'POST',
    params,
  };
});


export const saveXhdChange = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/change',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const findChangeList = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/findChangeList',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});


export const findReceiptList = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/findReceiptList',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const copyReceipt = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/copyReceipt',
    method: 'POST',
    params,
  };
});
export const operateBeforeCheck = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/operateBeforeCheck',
    method: 'POST',
    params,
  };
});

