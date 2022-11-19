// @ts-ignore
import {defHttp} from '/@/utils/http/axios';
// @ts-ignore
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

enum Api {
  findAll = '/cusrtomer/findAll',
  findById = '/cusrtomer/findById',
  findAllByFlag = '/cusrtomer/findAllByFlag',
  findAllCountry = '/cusrtomer/findAllCountry',
  findAllSysTradeNature = '/cusrtomer/findAllSysTradeNature',
  customerAddApi = '/cusrtomer/save',
  saveCus = '/cusrtomer/saveCus',
  allotSave = '/cusrtomer/allotSave',
  duLiSaveApi = '/cusrtomer/duLiSave',
  verifyCustomerId = '/cusrtomer/verifyCustomerId',
  verifyCustAccount = '/cusrtomer/verifyCustAccount',
  verifyCustomerName = '/cusrtomer/verifyCustomerName',
  verifyCustomerNum = '/cusrtomer/verifyCustomerNum',
  verifyByCustAbbname = '/cusrtomer/verifyByCustAbbname',
  verifyByCustSregcode = '/cusrtomer/verifyByCustSregcode',
  findByDatabaseUniqueCode = '/cusrtomer/findByDatabaseUniqueCode',
  updateKeyWordIsAutoSave = '/cusrtomer/updateKeyWordIsAutoSave',
  editDatabaseApi = '/cusrtomer/editDatabaseApi',
  exportExcelFindAllJSON = '/cusrtomer/exportExcelFindAllJSON',
  importCus = '/cusrtomer/importCus',
  editCusFlag = '/cusrtomer/editCusFlag',
  countAccVoucheryByCusUnique = '/cusrtomer/countAccVoucherByCusUnique',
  countAccVoucherByCusUnique20 = '/cusrtomer/countAccVoucherByCusUnique20',
  countAccVoucherByCusUnique21 = '/cusrtomer/countAccVoucherByCusUnique21',
  delCus = '/cusrtomer/delCus',
  delCusArr = '/cusrtomer/delCusArr',
  findAllByUniqueCustclass = '/cusrtomer/findAllByUniqueCustclass',
  findAllByAllotRecordCus = '/cusrtomer/findAllByAllotRecordCus',
  findAllOrderByCustCode = '/cusrtomer/findAllOrderByCustCode',
  custCountAll = '/cusrtomer/custCountAll',
  getCustAll = '/cusrtomer/getCustAll',
}

export const getCustAll = defRouteApi(async () => {
  return {
    timeout: 100000000000,
    url: Api.getCustAll,
    method: 'GET',
  };
});
export const custCountAll = defRouteApi(async () => {
  return {
    timeout: 100000000000,
    url: Api.custCountAll,
    method: 'GET',
  };
});

export const findById = defRouteApi(async (id) => {
  return {
    timeout: 100000000000,
    url: Api.findById + '?id=' + id,
    method: 'GET',
  };
});
export const findAllOrderByCustCode = defRouteApi(async () => {
  return {
    timeout: 100000000000,
    url: Api.findAllOrderByCustCode,
    method: 'GET',
  };
});

export const findAllByAllotRecordCus = defRouteApi(async (accId) => {
  return {
    timeout: 100000000000,
    url: Api.findAllByAllotRecordCus + '?accId=' + accId,
    method: 'POST',
  };
});

/* 导出信息 */
export async function exportExcelFindAllJSON() {
  return defHttp.request({
    timeout: 100000000000,
    url: Api.exportExcelFindAllJSON,
    method: 'GET',
  });
}

export function findByDatabaseUniqueCode() {
  return defHttp.request({
    timeout: 100000000000,
    url: Api.findByDatabaseUniqueCode,
    method: 'POST',
  });
}

export const verifyByCustSregcode = defRouteApi(async (custSregcode) => {
  return {
    timeout: 100000000000,
    url: Api.verifyByCustSregcode + '?custSregcode=' + custSregcode,
    method: 'POST',
  };
});

export const verifyByCustAbbname = defRouteApi(async (custAbbname) => {
  return {
    timeout: 100000000000,
    url: Api.verifyByCustAbbname + '?custAbbname=' + custAbbname,
    method: 'POST',
  };
});

export const verifyCustomerNum = defRouteApi(async (num) => {
  return {
    timeout: 100000000000,
    url: Api.verifyCustomerNum + '?num=' + num,
    method: 'POST',
  };
});

export const verifyCustomerName = defRouteApi(async (name) => {
  return {
    timeout: 100000000000,
    url: Api.verifyCustomerName + '?name=' + name,
    method: 'POST',
  };
});

export const verifyCustAccount = defRouteApi(async (bankNum) => {
  return {
    timeout: 100000000000,
    url: Api.verifyCustAccount + '?bankNum=' + bankNum,
    method: 'POST',
  };
});

export const verifyCustomerId = defRouteApi(async (id) => {
  return {
    timeout: 100000000000,
    url: Api.verifyCustomerId + '?id=' + id,
    method: 'POST',
  };
});


/* 获取启用中的客户信息 */
export const findAllByFlag = defRouteApi(async (flag) => {
  return {
    timeout: 100000000000,
    url: Api.findAllByFlag + '?flag=' + flag,
    method: 'GET',
  };
});

/* 获取国家信息*/
export async function findAllCountry() {
  return defHttp.request({
    url: Api.findAllCountry,
    timeout: 100000000000,
    method: 'GET',
  });
}

/* 获取行业性质信息*/
export async function findAllSysTradeNature() {
  return defHttp.request({
    timeout: 100000000000,
    url: Api.findAllSysTradeNature,
    method: 'GET',
  });
}

export const findAll = defRouteApi(async (params) => {
  return {
    timeout: 100000000000,
    url: Api.findAll,
    method: 'POST',
    params,
  };
});

export const customerAddApi = defRouteApi(async (params) => {
  return {
    timeout: 100000000000,
    url: Api.customerAddApi,
    method: 'POST',
    headers: {
      ignoreCancelToken: true,
    },
    params,
  };
});

export const saveCus = defRouteApi(async (params) => {
  return {
    timeout: 100000000000,
    url: Api.saveCus,
    method: 'POST',
    headers: {
      ignoreCancelToken: true,
    },
    params,
  };
});

export const allotSave = defRouteApi(async (params) => {
  return {
    timeout: 100000000000,
    url: Api.allotSave,
    method: 'POST',
    headers: {
      ignoreCancelToken: true,
    },
    params,
  };
});

export const duLiSaveApi = defRouteApi(async (params) => {
  return {
    timeout: 100000000000,
    url: Api.duLiSaveApi,
    method: 'POST',
    headers: {
      ignoreCancelToken: true,
    },
    params,
  };
});

export const importCus = defRouteApi(async ({params, userid}) => {
  return {
    url: Api.importCus + '?userid=' + userid,
    timeout: 100000000000000000,
    method: 'POST',
    params
  };
});

export function updateKeyWordIsAutoSave(params: any) {
  return defHttp.request({
    timeout: 100000000000,
    url: Api.updateKeyWordIsAutoSave,
    method: 'POST',
    params,
  });
}

export const editDatabaseApi = defRouteApi(async ({params, username}) => {
  return {
    timeout: 100000000000,
    url: Api.editDatabaseApi + '?username=' + username,
    method: 'POST',
    params,
  };
});
export const editCusFlag = defRouteApi(async ({id, flag}) => {
  return {
    timeout: 100000000000,
    url: Api.editCusFlag + '?id=' + id + '&flag=' + flag,
    method: 'POST',
  };
});
export const countAccVoucheryByCusUnique = defRouteApi(async ({cusUnique}) => {
  return {
    timeout: 100000000000,
    url: Api.countAccVoucheryByCusUnique + '?cusUnique=' + cusUnique,
    method: 'POST',
  };
});
export const countAccVoucherByCusUnique20 = defRouteApi(async ({cusUnique}) => {
  return {
    timeout: 100000000000,
    url: Api.countAccVoucherByCusUnique20 + '?cusUnique=' + cusUnique,
    method: 'POST',
  };
});
export const countAccVoucherByCusUnique21 = defRouteApi(async ({cusUnique}) => {
  return {
    timeout: 100000000000,
    url: Api.countAccVoucherByCusUnique21 + '?cusUnique=' + cusUnique,
    method: 'POST',
  };
});
export const delCus = defRouteApi(async ({id}) => {
  return {
    timeout: 100000000000,
    url: Api.delCus + '?id=' + id,
    method: 'POST',
  };
});
export const delCusArr = defRouteApi(async ({id}) => {
  return {
    timeout: 100000000000,
    url: Api.delCusArr + '?id=' + id,
    method: 'POST',
  };
});
export const editIsDel = defRouteApi(async (params) => {
  return {
    timeout: 100000000000,
    url: '/cusrtomer/editIsDel',
    method: 'POST',params
  };
});
export const recoverIsDel = defRouteApi(async (params) => {
  return {
    timeout: 100000000000,
    url: '/cusrtomer/recoverIsDel',
    method: 'POST',params
  };
});

export const findAllIsDel = defRouteApi(async (params) => {
  return {
    timeout: 100000000000,
    url: '/cusrtomer/findAllIsDel',
    method: 'POST',params
  };
});


export const findAllByUniqueCustclass = defRouteApi(async ({uniqueCustclass}) => {
  return {
    timeout: 100000000000,
    url: Api.findAllByUniqueCustclass + '?uniqueCustclass=' + uniqueCustclass,
    method: 'POST',
  };
});
export const applyImportCus = defRouteApi(async (params) => {
  return {
    timeout: 100000000000,
    url: '/cusrtomer/applyImportCus',
    method: 'POST',params
  };
});
export const findByCustMaxNum = defRouteApi(async (params) => {
  return {
    timeout: 100000000000,
    url: '/cusrtomer/findByCustMaxNum',
    method: 'POST',params
  };
});

export const editUniqueCustclass = defRouteApi(async ({uniqueCustclass,oldUniqueCustclass}) => {
  return {
    timeout: 100000000000,
    url: '/cusrtomer/editUniqueCustclass?uniqueCustclass='+uniqueCustclass+'&oldUniqueCustclass='+oldUniqueCustclass,
    method: 'POST',
  };
});
export const batchEditCust = defRouteApi(async (params) => {
  return {
    timeout: 100000000000,
    url: '/cusrtomer/batchEditCust',
    method: 'POST',params
  };
});
/**************************************************** 审计日志记录 ***************************************************************************/
export const auditCustomerSave = defRouteApi(async (params) => {
  return {
    timeout: 100000000000,
    url: '/cusrtomer/auditCustomerSave',
    method: 'POST',params
  };
});
