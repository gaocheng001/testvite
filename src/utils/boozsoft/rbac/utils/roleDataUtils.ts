import {menuMockState} from "../../../../../mock/data/menu";
import {platformMenuIds} from "../../../../../pages/record/three";

function getModules(){
  return menuMockState.modules
}
export function getMenuMockData2(){
  return hello333(getModules())
}


export function createRole(params) {
  const {id, name, roleValue} = params
  return {
    id,
    'tenantId': '000000',
    'parentId': '0',
    roleName: name,
    'sort': 1,
    'roleAlias': roleValue,
    'isDeleted': 0
  }
}

let roleMenuId = 1

export function createRoleMenu({
                          roleId,
                          menuId,
                          platformId
                        }) {
  return {
    id: roleMenuId++,
    roleId,
    menuId,
    sortNo: roleMenuId,
    platformId
  }
}
export const ROLE_DEV = 100
export const ROLE_ADMIN = 200
export const ROLE_GROUP = 300
export const ROLE_ORIGIN = 400
export const ROLE_COMPANY = 500
export const ROLE_CAIWU = 600
export const ROLE_CHUNA = 700

export function toRoleMenus(roleMenusModel){
  return roleMenusModel.flatMap(({roleId, platforms}) => {
      return platforms.flatMap((platformData) => {
          const {id: platformId, menuIds} = platformData
          return menuIds.flatMap((menuId) => {
            return createRoleMenu({roleId, platformId, menuId})
          })
        }
      )
    }
  )
}
export function hello333(modules){
  const ROLE_DEV = 100
  const ROLE_ADMIN = 200
  const ROLE_GROUP = 300
  const ROLE_ORIGIN = 400
  const ROLE_COMPANY = 500
  const ROLE_CAIWU = 600
  const ROLE_CHUNA = 700

  const abc= Object.values(modules)

    .filter(it=>Object.keys(it).length!=0)
    .filter(it =>
      it.platformMenuIds.key == 'devComponents' ||
      it.platformMenuIds.key == 'xinchou' ||
      it.platformMenuIds.key == 'zhongZhang' ||
      it.platformMenuIds.key == 'ncDesktop' ||
      it.platformMenuIds.key == 'system' ||
      it.platformMenuIds.key == 'origin' ||
      it.platformMenuIds.key == 'yingShouZhang' ||
      it.platformMenuIds.key == 'yingFuZhang' ||
      it.platformMenuIds.key == 'xianJinYinHang' ||
      it.platformMenuIds.key == 'guDingZiChan' ||
      it.platformMenuIds.key == 'dianZiPiaoJu' ||
      it.platformMenuIds.key == 'wangShangBaoShui' ||
      it.platformMenuIds.key == 'one' ||
      it.platformMenuIds.key == 'two' ||
      it.platformMenuIds.key == 'three' ||
      it.platformMenuIds.key == 'caoZuoYuan' ||
      it.platformMenuIds.key == 'clearLock' ||
      it.platformMenuIds.key == 'log' ||
      it.platformMenuIds.key == 'permission' ||
      it.platformMenuIds.key == 'reportCenter' ||
      it.platformMenuIds.key == 'CuoHuoRecord' ||
      it.platformMenuIds.key == 'four'
    )
    .map(it => it.platformMenuIds)
    .sort((a,b)=>a.sort-b.sort) as any

  const roleMenusModel = [
    // 开发用户
    {
      roleId: ROLE_DEV,
      name: '开发角色',
      roleValue: 'devrole',
      platforms:abc
    },
    // 超级管理员
    {
      roleId: ROLE_ADMIN,
      name: '超级管理员',
      roleValue: 'administrator',
      platforms: Object.values(modules)
        .filter(it =>
          it.key == 'devComponents' ||
          it.key == 'xinchou' ||
          it.key == 'zhongZhang' ||
          it.key == 'ncDesktop' ||
          it.key == 'system' ||
          it.key == 'origin' ||
          it.key == 'yingShouZhang' ||
          it.key == 'yingFuZhang' ||
          it.key == 'xianJinYinHang' ||
          it.key == 'guDingZiChan' ||
          it.key == 'dianZiPiaoJu' ||
          it.key == 'wangShangBaoShui' ||
          it.key == 'one' ||
          it.key == 'two' ||
          it.key == 'three' ||
          it.key == 'four'
        ).map(it => it.platformMenuIds) as any
    },
    // 集团操作员
    {
      roleId: ROLE_GROUP,
      name: '集团操作员',
      roleValue: 'group',
      platforms: Object.values(modules)
        .filter(it =>
          it.key == 'system'
        ).map(it => it.platformMenuIds) as any
    },
    // 组织操作员
    {
      roleId: ROLE_ORIGIN,
      name: '组织操作员',
      roleValue: 'origin',
      platforms: Object.values(modules)
        .filter(it =>
          it.key == 'origin'
        ).map(it => it.platformMenuIds) as any
    },
    // 公司操作员
    {
      roleId: ROLE_COMPANY,
      name: '公司操作员',
      roleValue: 'company',
      platforms: Object.values(modules)
        .filter(it =>
          it.key == 'ncDesktop'
        ).map(it => it.platformMenuIds) as any
    },
    // 财务
    {
      roleId: ROLE_CAIWU,
      name: '财务',
      roleValue: 'caiwu',
      platforms: Object.values(modules)
        .filter(it =>
          it.key == 'ncDesktop' ||
          it.key == 'zhongZhang'
        ).map(it => it.platformMenuIds) as any
    },
    // 出纳
    {
      roleId: ROLE_CHUNA,
      name: '出纳',
      roleValue: 'chuna',
      platforms: Object.values(modules)
        .filter(it =>
          it.key == 'xianJinYinHang' ||
          it.key == 'zhongZhang'
        ).map(it => it.platformMenuIds) as any
    },

  ]
// 角色数据
  const roles = roleMenusModel.map(({roleId, name, roleValue}) => createRole({
    id: roleId,
    name,
    roleValue
  }))

  return [roleMenusModel,roles]
}

export function useRole(id) {

  const [roleMenusModel,roles]=getMenuMockData2()
  const bbb=roles.filter(item => item.id == id)[0]
  return bbb
}
