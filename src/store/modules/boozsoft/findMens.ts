import {getUserMenuTreeByPlatformId} from '/@/api/sys/user';
import { AppRouteRecordRaw } from '/@/router/types';
import {getAuthCache, setAuthCache} from '/@/utils/auth';
import {createLocalStorage} from '/@/utils/cache';
import {Memory} from '/@/utils/cache/memory';
import {sysMenuQueryAll} from "/@/utils/boozsoft/rbac/menuData";

const ls=createLocalStorage()
export async function findMenus({ layoutId }) {
  const platformMenus_key='platformMenus-' + layoutId

  let platformMenu = getAuthCache(platformMenus_key)
  if (platformMenu != null) {
    return JSON.parse(platformMenu);
  }
  platformMenu = (await getUserMenuTreeByPlatformId({ platformId:layoutId })) as AppRouteRecordRaw[];
  setAuthCache(platformMenus_key,JSON.stringify(platformMenu))
  return platformMenu;
}
