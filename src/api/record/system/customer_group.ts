// @ts-ignore
import { defHttp } from '/@/utils/http/axios';

enum Api {
  findAll = '/sys/cusrtomer_group/findAll',
  findAllByFlag = '/sys/cusrtomer_group/findAllByFlag',
  findAllCountry = '/sys/cusrtomer_group/findAllCountry',
  findAllSysTradeNature = '/sys/cusrtomer_group/findAllSysTradeNature',
  GroupCustomerAddApi = '/sys/cusrtomer_group/save',
  verifyCustAccount = '/sys/cusrtomer_group/verifyCustAccount',
  verifyCustomerName = '/sys/cusrtomer_group/verifyCustomerName',
  verifyCustomerNum = '/sys/cusrtomer_group/verifyCustomerNum',
  verifyByCustAbbname = '/sys/cusrtomer_group/verifyByCustAbbname',
  verifyByCustSregcode = '/sys/cusrtomer_group/verifyByCustSregcode',
  exportExcelFindAllJSON = '/sys/cusrtomer_group/exportExcelFindAllJSON',
  sysimportCusInfoGroup = '/sys/cusrtomer_group/importCus',
  delCusGroup = '/sys/cusrtomer_group/delCus',
  delCusArrGroup = '/sys/cusrtomer_group/delCusArr',
  findAllByUniqueCustclass = '/sys/cusrtomer_group/findAllByUniqueCustclass',
  findAllByGroupAndAllot = '/sys/cusrtomer_group/findAllByGroupAndAllot',
  findAllByAllot = '/sys/cusrtomer_group/findAllByAllot',
  countAllotByCustUnique = '/sys/cusrtomer_group/countAllotByCustUnique',
}
export function findByCustName(custName: any) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/cusrtomer_group/findByCustName?custName=' + custName,
    method: 'POST',
  });
}
export function findByCustAbbname(custAbbname: any) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/cusrtomer_group/findByCustAbbname?custAbbname=' + custAbbname,
    method: 'POST',
  });
}

export function countAllotByCustUnique(cusUnique: any) {
  return defHttp.request({
    timeout: 100000000000,
    url: Api.countAllotByCustUnique + '?cusUnique=' + cusUnique,
    method: 'POST',
  });
}
export function findAllByAllot() {
  return defHttp.request({
    timeout: 100000000000,
    url: Api.findAllByAllot,
    method: 'POST',
  });
}

export function findAllByGroupAndAllot(tenantId: any) {
  return defHttp.request({
    timeout: 100000000000,
    url: Api.findAllByGroupAndAllot + '?tenantId=' + tenantId,
    method: 'POST',
  });
}

export function delCusArrGroup(id: any) {
  return defHttp.request({
    timeout: 100000000000,
    url: Api.delCusArrGroup + '?id=' + id,
    method: 'POST',
  });
}
export function delCusGroup(id: any,delName) {
  return defHttp.request({
    timeout: 100000000000,
    url: Api.delCusGroup + '?id=' + id+'&delName='+delName,
    method: 'POST',
  });
}
export function verifyByCustSregcode(custSregcode: any) {
  return defHttp.request({
    timeout: 100000000000,
    url: Api.verifyByCustSregcode + '?custSregcode=' + custSregcode,
    method: 'POST',
    headers: {
      ignoreCancelToken: true,
    },
  });
}
export function verifyByCustAbbname(custAbbname: any) {
  return defHttp.request({
    timeout: 100000000000,
    url: Api.verifyByCustAbbname + '?custAbbname=' + custAbbname,
    method: 'POST',
    headers: {
      ignoreCancelToken: true,
    },
  });
}
export function verifyCustomerNum(num: any) {
  return defHttp.request({
    timeout: 100000000000,
    url: Api.verifyCustomerNum + '?num=' + num,
    method: 'POST',
    headers: {
      ignoreCancelToken: true,
    },
  });
}

export function findByCustAbbnameAndCustName(custAbbname: any,custName) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/cusrtomer_group/findByCustAbbnameAndCustName?custAbbname=' + custAbbname+'&custName='+custName,
    method: 'POST',
  });
}
export function verifyCustomerName(name: any) {
  return defHttp.request({
    timeout: 100000000000,
    url: Api.verifyCustomerName + '?name=' + name,
    method: 'POST',
    headers: {
      ignoreCancelToken: true,
    },
  });
}
export function verifyCustAccount(bankNum: any) {
  return defHttp.request({
    timeout: 100000000000,
    url: Api.verifyCustAccount + '?bankNum=' + bankNum,
    method: 'POST',
    headers: {
      ignoreCancelToken: true,
    },
  });
}

/* 获取启用中的客户信息 */
export async function findAllByFlag(flag: any) {
  return defHttp.request({
    timeout: 100000000000,
    url: Api.findAllByFlag + '?flag=' + flag,
    method: 'GET',
  });
}

/* 获取国家信息*/
export async function findAllCountry() {
  return defHttp.request({
    timeout: 100000000000,
    url: Api.findAllCountry,
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
export async function findAll(params: any) {
  return defHttp.request({
    timeout: 100000000000,
    url: Api.findAll,
    method: 'POST',
    params,
  });
}

export function GroupCustomerAddApi(params) {
  return defHttp.request({
    timeout: 100000000000,
    url: Api.GroupCustomerAddApi,
    method: 'POST',
    params,
  });
}

export async function exportExcelFindAllJSON() {
  return defHttp.request({
    timeout: 100000000000,
    url: Api.exportExcelFindAllJSON,
    method: 'GET',
  });
}
export  async function sysimportCusInfoGroup(params:any){
  return defHttp.request({
    url: Api.sysimportCusInfoGroup,
    timeout: 100000000000,
    method: 'POST',
    params
  })
}
export  async function OrgApplyImportCus(params:any){
  return defHttp.request({
    url: '/sys/cusrtomer_group/OrgApplyImportCus',
    timeout: 100000000000,
    method: 'POST',
    params
  })
}

export async function findAllByUniqueCustclass(params) {
  return defHttp.request({
    timeout: 100000000000,
    url: Api.findAllByUniqueCustclass,
    method: 'POST',params
  });
}
// 读取编码规则
export async function getCodingRule(ctype) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/cusrtomer_group/getCodingRule?ctype='+ctype,
    method: 'POST',
  });
}
// 获取最新编码
export async function getMaxCusCodeByCodingFlag(params) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/cusrtomer_group/getMaxCusCodeByCodingFlag',params,
    method: 'POST',
  });
}
export async function recoverCus(id) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/cusrtomer_group/recoverCus?id='+id,
    method: 'POST',
  });
}

export async function findGroupCusByOrg(params) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/cusrtomer_group/findGroupCusByOrg',params,
    method: 'POST',
  });
}
export async function findGroupCusByTenantId(params) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/cusrtomer_group/findGroupCusByTenantId',params,
    method: 'POST',
  });
}

export async function editGroupCusAll(params) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/cusrtomer_group/editGroupCusAll',params,
    method: 'POST',
  });
}
export async function findAllByGroupCusNameAndCustAbbnameLike(name,abbName) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/cusrtomer_group/findAllByGroupCusNameAndCustAbbnameLike?name='+name+'&abbName='+abbName,
    method: 'POST',
  });
}
export async function editByIdSuccessState(id,approveUser) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/cusrtomer_group/editByIdSuccessState?id='+id+'&approveUser='+approveUser,
    method: 'POST',
  });
}
export async function delByIdCustNameAndCustAbbnameAndSuccessState(custName,custAbbName,successState) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/cusrtomer_group/delByIdCustNameAndCustAbbnameAndSuccessState?custName='+custName+'&custAbbName='+custAbbName+'&successState='+successState,
    method: 'POST',
  });
}






/******************************************* Assign *****************************************************/
export async function findByOrgAssigAccount(orgUnique,ctype) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/customerAssign/findByOrgAssigAccount?orgUnique='+orgUnique+'&ctype='+ctype,
    method: 'POST',
  });
}
export async function groupCusAssignOrgSave(params) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/customerAssign/groupCusAssignOrgSave',params,
    method: 'POST',
  });
}
export async function groupCusAssignDelById(orgUnique,ctype,dataUnique) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/customerAssign/groupCusAssignDelById?orgUnique='+orgUnique+'&ctype='+ctype+'&dataUnique='+dataUnique,
    method: 'POST',
  });
}
export async function groupCusAssignDelByIdAndTenantId(orgUnique,ctype,tenantId,dataUnique) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/customerAssign/groupCusAssignDelByIdAndTenantId?orgUnique='+orgUnique+'&ctype='+ctype+'&tenantId='+tenantId+'&dataUnique='+dataUnique,
    method: 'POST',
  });
}
export async function findAllByOrgUniqueAndCtypeAndFlag(params) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/customerAssign/findAllByOrgUniqueAndCtypeAndFlag',params,
    method: 'POST',
  });
}
export async function editFlagByCtypeAndOrgUnique(params) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/customerAssign/editFlagByCtypeAndOrgUnique',params,
    method: 'POST',
  });
}
export async function editFlagByCtypeAndOrgUniqueAndTenantId(params) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/customerAssign/editFlagByCtypeAndOrgUniqueAndTenantId',params,
    method: 'POST',
  });
}

export async function findByOrgAssigAccountCtype(ctype) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/customerAssign/findByOrgAssigAccountCtype?ctype='+ctype,
    method: 'POST',
  });
}
export async function findByOrgCusAbbNameAssignAccount(ctype,flag,abbName,orgUnique) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/customerAssign/findByOrgCusAbbNameAssignAccount?ctype='+ctype+'&flag='+flag+'&abbName='+abbName+'&orgUnique='+orgUnique,
    method: 'POST',
  });
}
export async function findByOrgCusNameAssignAccount(ctype,flag,name,orgUnique) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/customerAssign/findByOrgCusNameAssignAccount?ctype='+ctype+'&flag='+flag+'&name='+name+'&orgUnique='+orgUnique,
    method: 'POST',
  });
}
export async function findByOrgCusAbbNameAndCustNameAssignAccount(ctype,flag,abbName,custName,orgUnique) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/customerAssign/findByOrgCusAbbNameAndCustNameAssignAccount?ctype='+ctype+'&flag='+flag+'&abbName='+abbName+'&custName='+custName+'&orgUnique='+orgUnique,
    method: 'POST',
  });
}
export async function findByTenantIdCusAbbNameAndCustNameAssignAccount(ctype,flag,abbName,custName,tenantId) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/customerAssign/findByTenantIdCusAbbNameAndCustNameAssignAccount?ctype='+ctype+'&flag='+flag+'&abbName='+abbName+'&custName='+custName+'&tenantId='+tenantId,
    method: 'POST',
  });
}
export async function findAllByCusAssignLeftJoinGroupCusDataAndTenantId(orgUnique,ctype,tenantId) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/customerAssign/findAllByCusAssignLeftJoinGroupCusDataAndTenantId?orgUnique='+orgUnique+'&ctype='+ctype+'&tenantId='+tenantId,
    method: 'POST',
  });
}
export async function findAllByOrgUniqueAndTenantIdAndCtypeAndFlag(params) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/customerAssign/findAllByOrgUniqueAndTenantIdAndCtypeAndFlag',
    method: 'POST',params
  });
}
