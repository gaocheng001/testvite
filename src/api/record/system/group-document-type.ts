import {defHttp} from "/@/utils/http/axios";

/**
 * @description: Get jigou Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export function findDocumentTypeAll() {
  return defHttp.request({
    url: '/groupDocumentType/findAll',
    method: 'GET',
  })
}
