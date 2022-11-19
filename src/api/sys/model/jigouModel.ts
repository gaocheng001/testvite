import { RouteMeta } from '/@/router/types';
export interface RouteItem {
  path: string;
  component: any;
  meta: RouteMeta;
  name?: string;
  alias?: string | string[];
  redirect?: string;
  caseSensitive?: boolean;
  children?: RouteItem[];
}

/**
 * @description: Get jigou interface
 */
export interface getJigouListByIdParams {
  id: number | string;
}

/**
 * @description: Get jigou return value
 */
export type getJigouListByIdParamsResultModel = RouteItem[];
