// @ts-ignore
import { defRouteApi } from '/@/utils/boozsoft/datasource/datasourceUtil';
// @ts-ignore
import {defHttp} from "/@/utils/http/axios";

export const saveStockWarehousingPOJO = defRouteApi(async (params: any) => {
  return {
    url: '/stock/warehousing/biandong/saveStockWarehousingPOJO',
    method: 'POST',
    params,
  };
});
export const saveStockWarehousingsListPOJO = defRouteApi(async (params: any) => {
  return {
    url: '/stock/warehousing/biandong/saveStockWarehousingsListPOJO',
    method: 'POST',
    params,
  };
});
export const delStockJoinPojo = defRouteApi(async (ccode) => {
  return {
    url: '/stock/warehousing/biandong/delStockJoinPojo?ccode='+ccode,
    method: 'POST',
  };
});

export const getBianDongNewCcode = defRouteApi(async (ccode) => {
  return {
    url: '/stock/warehousing/biandong/getBianDongNewCcode?ccode='+ccode,
    method: 'GET',
  };
});
export const findAllByBianDongCcodeLike = defRouteApi(async (ccode) => {
  return {
    url: '/stock/warehousing/biandong/findAllByBianDongCcodeLike?ccode='+ccode,
    method: 'POST',
  };
});
export const findBianDongBillByCondition = defRouteApi(async (params) => {
  return {
    url: '/stock/warehousing/biandong/findBianDongBillByCondition',
    method: 'POST',params
  };
});
export const findStockWareBianDongByCcode = defRouteApi(async (ccode) => {
  return {
    url: '/stock/warehousing/biandong/findStockWareBianDongByCcode?ccode='+ccode,
    method: 'POST',
  };
});
