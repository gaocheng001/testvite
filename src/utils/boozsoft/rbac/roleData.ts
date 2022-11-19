import { hello333, toRoleMenus} from "./utils/roleDataUtils";
import {modules} from "./menuData";

export const getMockRoleMenus = async () => {
  return toRoleMenus((await hello333(modules))[0])
}


