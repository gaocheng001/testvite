// import {ROLE_ADMIN, ROLE_CAIWU, ROLE_DEV, roles, useRole} from '../../../rbac/utils/roleDataUtils';
import {
  ROLE_ADMIN,
  ROLE_CAIWU,
  ROLE_DEV,
  useRole
} from "../../../src/utils/boozsoft/rbac/utils/roleDataUtils";

let i = 1

function createUser(params) {
  const {id, name} = params
  return {
    id,
    'deptId': null,
    'idToken': null,
    'jigou': null,
    name,
    'password': null,
    'phone': '0000000000',
    'realName': name,
    'username': 'admin',
    'avatar': null,
    'email': null,
    'birthday': null,
    'gender': null,
    'postId': null
  }
}

export function getUsersModel() {
  const abc = [
    {
      user: createUser({id: i++, name: '开发账号44444'}),
      roles: [useRole(ROLE_DEV)],
      permissions: [],
      token: 'mock token'
    },
    {
      user: createUser({id: i++, name: '超级管理员'}),
      roles: [useRole(ROLE_ADMIN)],
      permissions: [],
      token: 'mock token1'
    },
    {
      user: createUser({id: i++, name: '张三1'}),
      roles: [useRole(ROLE_CAIWU)],
      permissions: [],
      token: 'mock token2'
    },
    {
      user: createUser({id: i++, name: '张三2'}),
      roles: [useRole(ROLE_CAIWU)],
      permissions: [],
      token: 'mock token3'
    },
    {
      user: createUser({id: i++, name: '张三3'}),
      roles: [useRole(ROLE_CAIWU)],
      permissions: [],
      token: 'mock token4'
    },
    {
      user: createUser({id: i++, name: '张三4'}),
      roles: [useRole(ROLE_CAIWU)],
      permissions: [],
      token: 'mock token5'
    },
    {
      user: createUser({id: i++, name: '张三5'}),
      roles: [useRole(ROLE_CAIWU)],
      permissions: [],
      token: 'mock token6'
    }
  ]
  return abc
}


export function useUser(id) {
  return getUsersModel().filter(item => item.user.id == id)[0]
}

export function createState(info) {
  return {
    user: info.user,
    roles: info.roles.map(item => {
        if (item.id == '1123598816738675201') {
          item.id = 100
        } else if (item.id == '1123598816738675202') {
          item.id = 200
        } else if (item.id == '1340925547478441986') {
          item.id = 300
        } else if (item.id == '1339804920791662594') {
          item.id = 400
        } else if (item.id == '1340925547478441987') {
          item.id = 500
        }
        return item
      }
    ),
    permissions: [],
    token: info.token
  }
}


export let tokenState = {}
