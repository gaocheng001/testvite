import { defHttp } from '/@/utils/http/axios'

/**
 * @description: Get user Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export function getUserListById() {
  return defHttp.request({
    url: '/sys/user/list',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function saveUser(params:any) {
  return defHttp.request({
    url: '/sys/user',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function deleteUser(id:any) {
  return defHttp.request({
    url: '/sys/user?id=' + id,
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    }
  })
}

//
// function createUserList() {
//   return [
//     // {
//   userId: '1',
//   username: 'super',
//   realName: 'BoozNC超级管理',
//   desc: 'manager',
//   password: '123456',
//   token: 'fakeToken1',
//   role: ['super']
// },
// {
//   userId: '2',
//   username: 'admin',
//   password: '1',
//   realName: '系统超级管理员',
//   desc: 'tester',
//   token: 'fakeToken2',
//   role: ['admin']
// },
// {
//   userId: '3',
//   username: 'cw1',
//   password: '1',
//   realName: '财务',
//   desc: 'tester',
//   token: 'fakeToken2',
//   role: ['cw']
// },
// {
//   userId: '4',
//   username: 'oidc',
//   password: 'oidc',
//   realName: '账户授权中心',
//   desc: 'tester',
//   token: 'fakeToken2',
//   role: ['oidc']
// },
// {
//   userId: '5',
//   username: 'api',
//   password: 'api',
//   realName: 'api系统',
//   desc: 'tester',
//   token: 'fakeToken2',
//   role: ['api']
// }
// ]
// }
//
// // const code: any = {
//   '1': ['1000', '3000', '5000'],
//
//   '2': ['2000', '4000', '6000'],
//   '3': ['admin', '1000']
// }
// export default [
//   // mock user login
//   {
//     url: '/sys/login',
//     timeout: 1000,
//     method: 'POST',
//     response: ({ body }) => {
//       const { username, password } = body
//       const checkUser = createUserList().find(
//         (item) => item.username === username && password === item.password
//       )
//       if (!checkUser) {
//         return resultError('Incorrect account or password！')
//       }
//       const { userId, username: _username, token, realName, desc, role } = checkUser
//       return resultSuccess({
//         role,
//         userId,
//         username: _username,
//         token,
//         realName,
//         desc
//       })
//     }
//   },
//   {
//     url: '/sys/getUserInfoById',
//     timeout: 200,
//     method: 'get',
//     response: ({ query }) => {
//       const { userId } = query
//       const checkUser = createUserList().find((item) => item.userId === userId)
//       if (!checkUser) {
//         return resultError('The corresponding user information was not obtained!')
//       }
//       return resultSuccess(checkUser)
//     }
//   },
//   {
//     url: '/api/getPermCodeByUserId',
//     timeout: 200,
//     method: 'get',
//     response: ({ query }) => {
//       const { userId } = query
//       if (!userId) {
//         return resultError('userId is not null!')
//       }
//       const codeList = code[userId]
//
//       return resultSuccess(codeList)
//     }
//   }
// ] as UserMethod[]
