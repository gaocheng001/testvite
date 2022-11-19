import {defHttp} from "/@/utils/http/axios";

/**
 * @description: Get jigou Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export async function getUnitList(params: any) {
  return defHttp.request({
    url: '/sys/account/findNew/list',
    method: 'GET',
    timeout: 100000000000,
    params
  })
}

export async function getUnitList2(params: any) {
  return defHttp.request({
    url: '/sys/account/findNew/createList',
    method: 'GET',
    timeout: 100000000000,
    params
  })
}

// 非独立账套
export async function getUnitListNoGroup() {
  return defHttp.request({
    url: '/sys/account/findNew/listNo',
    method: 'GET',
    timeout: 100000000000,
  })
}

export async function getUnitAvailables() {
  return defHttp.request({
    url: '/sys/account/findNew/available',
    method: 'GET',
    timeout: 100000000000,
  })
}

export async function getAccountAvailable() {
  return defHttp.request({
    url: '/sys/account/findNew/available',
    method: 'GET',
    timeout: 100000000000,
  })
}

export async function corpAvailable() {
  return defHttp.request({
    url: '/sys/account/findNew/corpAvailable',
    method: 'GET',
    timeout: 100000000000,
  })
}

export async function saveUnit(params: any) {
  return defHttp.request({
    url: '/sys/account/saveNew',
    method: 'POST',
    timeout: 999999999999,
    params
  })
}

export async function saveUnitTwo(params: any) {
  return defHttp.request({
    url: '/sys/account/saveUnitTwo',
    method: 'POST',
    timeout: 999999999999,
    params
  })
}

export async function copyUnit(params: any) {
  return defHttp.request({
    url: '/sys/account/copyUnit',
    method: 'POST',
    timeout: 999999999999,
    params
  })
}


export async function resetCode(params: any) {
  return defHttp.request({
    url: '/sys/account/resetCode',
    method: 'POST',
    timeout: 999999999999,
    params
  })
}

export async function checkUsed(params: any) {
  return defHttp.request({
    url: '/sys/account/checkUsed',
    method: 'POST',
    timeout: 100000000000,
    params
  })
}

export async function deleteUnit(params: any) {
  return defHttp.request({
    url: '/sys/account/deleteNew',
    method: 'DELETE',
    timeout: 100000000000,
    params
  })
}

export async function deleteUnitAcc(params: any) {
  return defHttp.request({
    url: '/sys/account/deleteNew2',
    method: 'DELETE',
    timeout: 100000000000,
    params
  })
}

export async function busUnit(params: any) {
  return defHttp.request({
    url: '/sys/account/findNew/status-bus',
    method: 'POST',
    timeout: 100000000000,
    params
  })
}

export async function changeUnit(params: any) {
  return defHttp.request({
    url: '/sys/account/findNew/status',
    method: 'POST',
    timeout: 100000000000,
    params
  })
}

export async function findByCode(params: any) {
  return defHttp.request({
    url: '/sys/account/findByCode',
    method: 'GET',
    params
  })
}
export async function findByCode2(params: any) {
  return defHttp.request({
    url: '/sys/account/findByCode2',
    method: 'GET',
    params
  })
}
export async function findByName(params: any) {
  return defHttp.request({
    url: '/sys/account/findByName',
    method: 'GET',
    params
  })
}
export async function findByName2(params: any) {
  return defHttp.request({
    url: '/sys/account/findByName2',
    method: 'GET',
    params
  })
}

export async function findLastValByCoCode(params: any) {
  return defHttp.request({
    url: '/sys/account/findLastValByCoCode',
    method: 'GET',
    params
  })
}

export async function modifyAuthor(params: any) {
  return defHttp.request({
    url: '/sys/account/modifyAuthor',
    timeout: 100000000000,
    method: 'POST',
    params
  })
}

export async function findAuthors(params: any) {
  return defHttp.request({
    url: '/sys/account/findAuthors',
    timeout: 100000000000,
    method: 'POST',
    params
  })
}

export async function findYearListByAccId(params: any) {
  return defHttp.request({
    url: '/sys/account/findAuthors',
    timeout: 100000000000,
    method: 'POST',
    params
  })
}


/************* 固定资产 *************/
export async function getAssetsList(params: any) {
  return defHttp.request({
    url: '/sys/account/assets/list',
    method: 'GET',
    timeout: 100000000000,
    params
  })
}

export async function saveAssets(params: any) {
  return defHttp.request({
    url: '/sys/account/assets/save',
    method: 'POST',
    timeout: 100000000000,
    params
  })
}

export async function delAssets(params: any) {
  return defHttp.request({
    url: '/sys/account/assets/del',
    method: 'DELETE',
    timeout: 100000000000,
    params
  })
}

export async function findByCodeAssets(params: any) {
  return defHttp.request({
    url: '/sys/account/assets/findByCode',
    method: 'GET',
    params
  })
}

export async function findByNameAssets(params: any) {
  return defHttp.request({
    url: '/sys/account/assets/findByName',
    method: 'GET',
    params
  })
}

export async function findByUniqueCodeAssets() {
  return defHttp.request({
    url: '/sys/account/assets/used',
    method: 'GET',
  })
}

export async function findAssetsUniqueCodeAndCode({code}) {
  return defHttp.request({
    url: '/sys/account/assets/codes?code=' + code,
    method: 'GET',
  })
}

export async function findAssetsDate({code, iyear}) {
  return defHttp.request({
    url: '/sys/account/assets/date?code=' + code + '&iyear=' + iyear,
    method: 'GET',
  })
}

export async function findByAuthAssetsByUniqueCode({code}) {
  return defHttp.request({
    url: '/sys/account/assets/author?code=' + code,
    method: 'GET',
  })
}

export async function modifyManageAuthor(params: any) {
  return defHttp.request({
    url: '/sys/account/assets/modifyManageAuthor',
    timeout: 100000000000,
    method: 'POST',
    params
  })
}

export async function findZiChanPeriodByCode({code, iyear}) {
  return defHttp.request({
    url: '/sys/account/assets/period?code=' + code + '&iyear=' + iyear,
    method: 'GET',
  })
}

export async function findZiChanUnPeriodByCode({code, iyear}) {
  return defHttp.request({
    url: '/sys/account/assets/unPeriod?code=' + code + '&iyear=' + iyear,
    method: 'GET',
  })
}

export async function closeBill(params: any) {
  return defHttp.request({
    url: '/sys/account/assets/closeBill',
    method: 'POST',
    params
  })
}


/************* 固定资产 *************/
/************* 存货管理 *************/
export async function closeBillStock(params: any) {
  return defHttp.request({
    url: '/group/stockAccount/period/closeBill',
    method: 'POST',
    params
  })
}

export async function getStockList(params: any) {
  return defHttp.request({
    url: '/group/stockAccount/list',
    method: 'GET',
    timeout: 100000000000,
    params
  })
}

export async function saveStock(params: any) {
  return defHttp.request({
    url: '/group/stockAccount/save',
    method: 'POST',
    timeout: 100000000000,
    params
  })
}

export async function delStock(params: any) {
  return defHttp.request({
    url: '/group/stockAccount/del',
    method: 'DELETE',
    timeout: 100000000000,
    params
  })
}

export async function findByNameStock(params: any) {
  return defHttp.request({
    url: '/group/stockAccount/findByName',
    method: 'GET',
    params
  })
}
export async function findByNameCode(params: any) {
  return defHttp.request({
    url: '/group/stockAccount/findByCode',
    method: 'GET',
    params
  })
}
export async function findByUniqueCodeStock() {
  return defHttp.request({
    url: '/group/stockAccount/used',
    method: 'GET',
  })
}
/************* 存货管理 *************/

export async function getCorpDelAll() {
  return defHttp.request({
    url: '/sys/account/findNew/corpDel',
    timeout: 100000000000,
    method: 'GET',
  })
}
export async function deleteCorpTrue(params: any) {
  return defHttp.request({
    url: '/sys/account/deleteNewTrue',
    method: 'DELETE',
    timeout: 100000000000,
    params
  })
}
export async function reductionCorp(params: any) {
  return defHttp.request({
    url: '/sys/account/reductionCorp',
    method: 'POST',
    timeout: 100000000000,
    params
  })
}


export async function getZzDelAll() {
  return defHttp.request({
    url: '/sys/account/findNew/availableDel',
    timeout: 100000000000,
    method: 'GET',
  })
}
export async function deleteZzTrue(params: any) {
  return defHttp.request({
    url: '/sys/account/deleteNew2/true',
    method: 'DELETE',
    timeout: 100000000000,
    params
  })
}
export async function reductionZz(params: any) {
  return defHttp.request({
    url: '/sys/account/reductionZz',
    method: 'POST',
    timeout: 100000000000,
    params
  })
}


export async function getFaDelAll() {
  return defHttp.request({
    url: '/sys/account/assets/allDel',
    timeout: 100000000000,
    method: 'GET',
  })
}
export async function deleteFaTrue(params: any) {
  return defHttp.request({
    url: '/sys/account/assets/delTrue',
    method: 'DELETE',
    timeout: 100000000000,
    params
  })
}
export async function reductionFa(params: any) {
  return defHttp.request({
    url: '/sys/account/assets/reduction',
    method: 'POST',
    timeout: 100000000000,
    params
  })
}


export async function getStockDelAll() {
  return defHttp.request({
    url: '/group/stockAccount/allDel',
    timeout: 100000000000,
    method: 'GET',
  })
}
export async function deleteStockTrue(params: any) {
  return defHttp.request({
    url: '/group/stockAccount/delTrue',
    method: 'DELETE',
    timeout: 100000000000,
    params
  })
}
export async function reductionStock(params: any) {
  return defHttp.request({
    url: '/group/stockAccount/reduction',
    method: 'POST',
    timeout: 100000000000,
    params
  })
}
export async function findStockPeriodInfoByYm(params: any) {
  return defHttp.request({
    url: '/group/stockAccount/periodInfoByYm',
    method: 'POST',
    timeout: 100000000000,
    params
  })
}
export async function findPeriodDateByYear(params: any) {
  return defHttp.request({
    url: '/group/stockAccount/findPeriodDateByYear',
    method: 'POST',
    timeout: 100000000000,
    params
  })
}

export async function checkMonth(params: any) {
  return defHttp.request({
    url: '/group/stockAccount/period/checkMonth',
    method: 'POST',
    timeout: 100000000000,
    params
  })
}

export async function findStockPeriodList(params: any) {
  return defHttp.request({
    url: '/group/stockAccount/period/list',
    method: 'GET',
    timeout: 100000000000,
    params
  })
}

export async function findStockPeriodTree(params: any) {
  return defHttp.request({
    url: '/group/stockAccount/period/tree',
    method: 'GET',
    timeout: 100000000000,
    params
  })
}

export async function generateNextYearPeriod(params: any) {
  return defHttp.request({
    url: '/group/stockAccount/period/generate',
    method: 'POST',
    timeout: 100000000000,
    params
  })
}
export async function findStockPeriodLatest(params: any) {
  return defHttp.request({
    url: '/group/stockAccount/period/latest',
    method: 'POST',
    timeout: 100000000000,
    params
  })
}
export async function findStockPeriodListByYear(params: any) {
  return defHttp.request({
    url: '/group/stockAccount/period/yearList',
    method: 'POST',
    timeout: 100000000000,
    params
  })
}
export async function resetPeriodStart(params: any) {
  return defHttp.request({
    url: '/group/stockAccount/period/resetStart',
    method: 'POST',
    timeout: 100000000000,
    params
  })
}
export async function delYearPeriod(params: any) {
  return defHttp.request({
    url: '/group/stockAccount/period/delYear',
    method: 'POST',
    timeout: 100000000000,
    params
  })
}
export async function periodAllList(params: any) {
  return defHttp.request({
    url: '/group/stockAccount/periods',
    method: 'POST',
    timeout: 100000000000,
    params
  })
}
