import {menuMockState} from "../data/menu";
import {hello333, toRoleMenus} from "/@/utils/boozsoft/rbac/utils/roleDataUtils";




export const roleMenus = () => {
  return toRoleMenus(hello333(menuMockState.modules)[0])
}



