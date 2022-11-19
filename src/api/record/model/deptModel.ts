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
 * @description: Get menu interface
 */
export interface getDeptListByIdParams {
  id: number | string;
}

/**
 * @description: Get menu return value
 */
export type getDeptListByIdParamsResultModel = RouteItem[];
