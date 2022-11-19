import {defRouteApi, otherRouteApi, useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {defHttp} from "/@/utils/http/axios";
import {R} from "../../../mock/_util";
import {usePlatformsStoreWidthOut} from "/@/store/modules/platforms";


enum Api {
  savePlatform    = '/group/sys/platform/savePlatform',
}
/**
 * 查询所有分类list
 * @return
 */
export async function savePlatforms(params) {
  console.warn('未开发接口')
  return R.ok()
  // return defHttp.request({
  //   url: Api.savePlatform,
  //   method: 'GET',
  //   params
  // })
}

export async function findOwnPlatforms() {
  console.warn('未开发接口')
  return [20007, 20008, 20009, 20010, 1001, 20012, 1013, 20006, 20003, 20001, 1014, 1003, 1006, 1007, 20017, 1005]
}
