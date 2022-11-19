import {defHttp} from "/@/utils/http/axios";

/**
 * @description: Get jigou Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export async function getOrganizeList(params: any) {
  return defHttp.request({
    url: '/group/sys-org',
    method: 'GET',
    timeout: 100000000000,
    params
  })
}

export async function getOrganizeAll() {
  return defHttp.request({
    url: '/group/sys-org/all',
    timeout: 100000000000,
    method: 'GET',
  })
}

export async function getOrganizeDelAll() {
  return defHttp.request({
    url: '/group/sys-org/allDel',
    timeout: 100000000000,
    method: 'GET',
  })
}

export async function getOrganizeAllAndUnit() {
  return defHttp.request({
    url: '/group/sys-org/allAndUnit',
    timeout: 100000000000,
    method: 'GET',
  })
}

export async function saveOrganize(params: any) {
  return defHttp.request({
    url: '/group/sys-org',
    method: 'POST',
    timeout: 100000000000,
    params
  })
}

export async function reductionOrganize(params: any) {
  return defHttp.request({
    url: '/group/sys-org/reduction',
    method: 'POST',
    timeout: 100000000000,
    params
  })
}


export async function deleteOrganize(params: any) {
  return defHttp.request({
    url: '/group/sys-org',
    method: 'DELETE',
    timeout: 100000000000,
    params
  })
}

export async function deleteOrganizeTrue(params: any) {
  return defHttp.request({
    url: '/group/sys-org/true',
    method: 'DELETE',
    timeout: 100000000000,
    params
  })
}

export async function findByCode(params: any) {
  return defHttp.request({
    url: '/group/sys-org/findByCode',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export async function findByName(params: any) {
  return defHttp.request({
    url: '/group/sys-org/findByName',
    method: 'GET',
    timeout: 100000000000,
    params
  })
}

export async function findById(id: any) {
  return defHttp.request({
    url: '/group/sys-org/findById?id=' + id,
    method: 'POST',
    timeout: 100000000000,
  })
}
export async function modifyAuthor(params: any) {
  return defHttp.request({
    url: '/group/sys-org/modifyAuthor',
    method: 'POST',
    params
  })
}

export async function findAuthors(params: any) {
  return defHttp.request({
    url: '/group/sys-org/findAuthors',
    method: 'POST',
    params
  })
}

export async function findOrgAuthorsById(params: any) {
  return defHttp.request({
    url: '/group/sys-org/findOrgAuthorsById',
    method: 'POST',
    params
  })
}
export async function findByUniqueCode(uniqueCode: any) {
  return defHttp.request({
    url: '/group/sys-org/findByUniqueCode?uniqueCode=' + uniqueCode,
    method: 'POST',
    timeout: 100000000000,
  })
}

export async function countAllByUniqueAccStandard(uniqueAccStandard: any) {
  return defHttp.request({
    url: '/group/sys-org/countAllByUniqueAccStandard?uniqueAccStandard=' + uniqueAccStandard,
    method: 'POST',
    timeout: 100000000000,
  })
}

export async function groupByOrgPeriodIyear(orgId: any) {
  return defHttp.request({
    url: '/org-period/groupByOrgPeriodIyear?orgId=' + orgId,
    method: 'POST',
    timeout: 100000000000,
  })
}

export async function groupByOrgPeriodList(orgId: any) {
  return defHttp.request({
    url: '/org-period/groupByOrgPeriodList?orgId=' + orgId,
    method: 'GET',
  })
}

export async function saveNextYearPeriod(params: any) {
  return defHttp.request({
    url: '/org-period/saveNextYear',
    method: 'POST', params, timeout: 100000000000
  })
}

export async function saveAccNextYearPeriod(params: any) {
  return defHttp.request({
    url: '/org-period/saveAccNextYear',
    method: 'POST', params, timeout: 100000000000
  })
}

export async function delTheYearPeriod(params: any) {
  return defHttp.request({
    url: '/org-period/delYear',
    method: 'DELETE', params
  })
}

export async function delAccTheYearPeriod(params: any) {
  return defHttp.request({
    url: '/org-period/delAccYear',
    method: 'DELETE', params
  })
}

export async function saveOrgCash(params: any) {
  return defHttp.request({
    url: '/org-period/saveOrgCash',
    method: 'POST', params
  })
}

export async function saveOrgPeriod(params: any) {
  return defHttp.request({
    url: '/org-period/saveOrgPeriod',
    method: 'POST', params, timeout: 100000000000
  })
}
