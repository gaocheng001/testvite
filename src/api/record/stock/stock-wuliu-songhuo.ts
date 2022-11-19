// @ts-ignore
import { defRouteApi } from '/@/utils/boozsoft/datasource/datasourceUtil';

export const wuliuSongHuoSave = defRouteApi(async (params: any) => {
  return {
    url: '/stock/wuliuSongHuo/wuliuSongHuoSave',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const findAllByWuliuSongHuoCode = defRouteApi(async (ccode) => {
  return {
    url: '/stock/wuliuSongHuo/findAllByWuliuSongHuoCode?ccode='+ccode,
    timeout: 10000000,
    method: 'POST',
  };
});
export const delByWuliuSongHuoCode = defRouteApi(async (ccode) => {
  return {
    url: '/stock/wuliuSongHuo/delByWuliuSongHuoCode?ccode='+ccode,
    timeout: 10000000,
    method: 'POST',
  };
});
