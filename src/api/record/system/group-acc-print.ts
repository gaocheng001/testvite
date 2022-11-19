import {defHttp} from "/@/utils/http/axios";

export function findAccPrintAll() {
    return defHttp.request({
        url: '/groupAccPrint/findAll',
        method: 'GET',
    })
}

export function findAccPrintByAccIdAndMenuName({accId, menuName}) {
    return defHttp.request({
        url: '/groupAccPrint/findByAccIdAndMenuName?accId=' + accId + '&menuName=' + menuName,
        method: 'GET',
    })
}

export function findAccPrintById(id) {
    return defHttp.request({
        url: '/groupAccPrint/findById?id=' + id,
        method: 'GET',
    })
}

export function saveAccPrint(params: any) {
    return defHttp.request({
        url: '/groupAccPrint/save',
        method: 'POST',
        params
    })
}

export function deleteAccPrintById(id: any) {
    return defHttp.request({
        url: '/groupAccPrint/deleteById?id=' + id,
        method: 'DELETE',
    })
}
