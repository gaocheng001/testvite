import {defHttp} from '/@/utils/http/axios'

enum Api {
    findAll = `/TableAudit/findAll`,
    findById = `/TableAudit/findById`,
    save = `/TableAudit/save`,
    deleteById = `/TableAudit/deleteById`
}

export function findTableAuditAllApi() {
    return defHttp.request({
        url: Api.findAll,
        method: 'GET'
    })
}

export function findTableAuditByIdApi() {
    return defHttp.request({
        url: Api.findById,
        method: 'GET'
    })
}

export function saveTableAuditApi(params) {
    return defHttp.request({
        url: Api.save,
        method: 'POST',
        params
    })
}

export async function deleteTableAuditByIdApi(params) {
    return defHttp.request({
        url: Api.deleteById,
        method: 'DELETE',
        params
    })
}
