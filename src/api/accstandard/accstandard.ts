import { defHttp } from '/@/utils/http/axios';
import { defRouteApi } from '/@/utils/boozsoft/datasource/datasourceUtil';

enum Api {
  findByAccStyle = '/sys/accstandard/findByAccStyle',
  findByAccIdAccStyle = '/sys/accstandard/findByAccIdAccStyle',
  findByAccStyleStr = '/sys/accstandard/findByAccStyleStr',
  findByStandardName = '/sys/accstandard/findByStandardName',
  saveStandard = '/sys/accstandard/saveStandard',
  findByUniqueAccStandardDelStandard = '/sys/accstandard/findByUniqueAccStandardDelStandard',
  findByStandardID = '/sys/accstandard/findByStandardID',
  findAllAcctandard = '/sys/accstandard/findAllAcctandard',
  findByStandardUnique = '/sys/accstandard/findByStandardUnique',
  findAllStyleByUnique = '/sys/accstandard/findAllStyleByUnique',
  findAllAcctandardList = '/sys/accstandard/findAllAcctandardList',
  findByTypeAcctandardList = '/sys/accstandard/findByTypeAcctandardList',
  company_findAllStyleByUnique = '/sys/accstandard/company_findAllStyleByUnique',
  company_findAllAcctandardList = '/sys/accstandard/company/company_findAllAcctandardList',
}

export function findAllAcctandard() {
  return defHttp.request({
    url: Api.findAllAcctandard,
    method: 'GET',timeout: 100000000000,
  });
}
export function findAllAcctandardList() {
  return defHttp.request({
    url: Api.findAllAcctandardList,
    method: 'POST',timeout: 100000000000,
  });
}
export function findByTypeAcctandardList() {
  return defHttp.request({
    url: Api.findByTypeAcctandardList,
    method: 'POST',timeout: 100000000000,
  });
}
export function findByStandardUnique(unique:any) {
  return defHttp.request({
    url: Api.findByStandardUnique+'?unique='+unique,
    method: 'POST',timeout: 100000000000,
  });
}

export const company_findAllAcctandardList = defRouteApi(async () => {
  return {
    url: Api.company_findAllAcctandardList,
    method: 'GET',timeout: 100000000000,
  };
});

export function findByStandardID(id: any) {
  return defHttp.request({
    url: Api.findByStandardID + '?id=' + id,
    method: 'POST',timeout: 100000000000,
  });
}
export function findAllStyleByUnique(unique: any) {
  return defHttp.request({
    url: Api.findAllStyleByUnique + '?unique=' + unique,
    method: 'POST',timeout: 100000000000,
  });
}
export const company_findAllStyleByUnique = defRouteApi(async () => {
  return {
    url: Api.company_findAllStyleByUnique,
    method: 'POST',timeout: 100000000000,
  };
});
export function findByAccStyle(uniqueAccStandard:any) {
  return defHttp.request({
    url: Api.findByAccStyle+'?uniqueAccStandard='+uniqueAccStandard,
    method: 'POST',timeout: 100000000000,
  });
}

export const findByAccIdAccStyle = defRouteApi(async (accId) => {
  return {
    url: Api.findByAccIdAccStyle+'?accId='+accId,
    method: 'POST',timeout: 100000000000,
  };
});
export function findByAccStyleStr() {
  return defHttp.request({
    url: Api.findByAccStyleStr,
    method: 'GET',timeout: 100000000000,
  });
}
export function findByStandardName(name) {
  return defHttp.request({
    url: Api.findByStandardName+'?name='+name,
    method: 'POST',timeout: 100000000000,
  });
}
export function saveStandard(accStandardName,codeType) {
  return defHttp.request({
    url: Api.saveStandard+'?accStandardName='+accStandardName+'&codeType='+codeType,
    method: 'POST',timeout: 100000000000,
  });
}

export function findByUniqueAccStandardDelStandard(uniqueAccStandard,templateId) {
  return defHttp.request({
    url: Api.findByUniqueAccStandardDelStandard+'?uniqueAccStandard='+uniqueAccStandard+'&templateId='+templateId,
    method: 'POST',timeout: 100000000000,
  });
}
