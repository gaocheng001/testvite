import {itemsToTreeData} from '../src/utils/treeUtil';
import {MockMethod} from 'vite-plugin-mock';
import {
  getRequestToken, R,
  requestParams,
  resultError,
  resultPageSuccess,
  resultSuccess
} from './_util';


import {
  createState,
  tokenState,
  useUser
} from '../mock-api/_datatable/tokenResource_data/tokenResource_data';
import {mockUsers} from '../mock-api/_datatable/user_data/userData';
import {menuMockState} from "./data/menu";
import {getMenuMockData2} from "/@/utils/boozsoft/rbac/utils/roleDataUtils";
import {roleMenus} from "./_utils/_roleMenuUtils";
async function useBoozsoftResponse(req,res){
  function getQueryVariable(url) {
    // 通过 ? 分割获取后面的参数字符串
    let urlStr = url.split('?')[1]
    // 创建空对象存储参数
    let obj = {};
    // 再通过 & 将每一个参数单独分割出来
    let paramsArr = urlStr.split('&')
    for(let i = 0,len = paramsArr.length;i < len;i++){
      // 再通过 = 将每一个参数分割为 key:value 的形式
      let arr = paramsArr[i].split('=')
      obj[arr[0]] = arr[1];
    }
    return obj
  }

  let reqbody = ''
  await new Promise((resolve) => {
    req.on('data', (chunk) => {
      reqbody += chunk
    })
    req.on('end', () => resolve(undefined))
  })
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.statusCode = 200
  let body=null
  try{
    body=JSON.parse(reqbody)
  }catch (e){

  }
  return{
    body,
    getQueryVariable,
    sendObject(obj){
      res.end(JSON.stringify(obj))
    }
  }
}
function makeNum(num) {
  const str = Math.random()
    .toString()
    .slice(-1 * num); //随机生成九位数 235690486
  const arr = str.split(''); // 字符串转数组  ["2", "3", "5", "6", "9", "0", "4", "8", "6"]
  function sum(arr) {
    let total = 0;
    if (!arr.length) return;
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i]) {
        total += Number(arr[i]);
      }
    }
    return total;
  }

  arr[9] = (sum(arr) % 10).toString(); // sum(arr)求和 并获取第十位
  const lastStr = arr.join(''); // 将获取的十位数数组转字符串
  return lastStr;
}

export function createFakeUserList() {
  return [
    {
      userId: '1',
      username: 'vben',
      realName: '财税达NC 用户1',
      avatar: 'https://q1.qlogo.cn/g?b=qq&nk=190848757&s=640',
      desc: 'manager',
      password: '123456',
      token: 'fakeToken1',
      roles: [
        {
          roleName: 'Super Admin',
          value: 'super'
        }
      ]
    },
    {
      userId: '2',
      username: 'test',
      password: '123456',
      realName: 'test user',
      avatar: 'https://q1.qlogo.cn/g?b=qq&nk=339449197&s=640',
      desc: 'tester',
      token: 'fakeToken2',
      roles: [
        {
          roleName: 'Tester',
          value: 'test'
        }
      ]
    }
  ];
}

const fakeCodeList: any = {
  '1': ['1000', '3000', '5000'],

  '2': ['2000', '4000', '6000']
};

const list = [
  {
    id: '81',
    userName: '123',
    phone: '123',
    email: '123',
    flag: '1'
  }
];

function getTokenRoleMenus() {
  return roleMenus()
    .filter(item => tokenState.roles.map(item => item.id).indexOf(item.roleId) != -1)

}



export default [
  // mock user login
  {
    url: '/api/mock/putMenu',
    timeout: 200,
    method: 'post',
    rawResponse: async (req, res) => {

      const {body,sendObject}=await useBoozsoftResponse(req,res)


      menuMockState.data = body.menus
      menuMockState.modules = body.modules
      sendObject(R.ok())

    },

  },

  {
    url: '/basic-api/login',
    timeout: 200,
    method: 'post',
    rawResponse: async (req, res) => {
      let reqbody = ''
      await new Promise((resolve) => {
        req.on('data', (chunk) => {
          reqbody += chunk
        })
        req.on('end', () => resolve(undefined))
      })
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.statusCode = 200

      const body2=JSON.parse(reqbody)

      const {username, password} = body2;
      const checkUser = createFakeUserList().find(
        (item) => item.username === username && password === item.password
      );
      if (!checkUser) {
        return resultError('Incorrect account or password！');
      }
      const {userId, username: _username, token, realName, desc, roles} = checkUser;

      res.end(JSON.stringify( resultSuccess({
        roles,
        userId,
        username: _username,
        token,
        realName,
        desc
      })))
    },
  },
  {
    url: '/basic-api/getUserInfo',
    method: 'get',
    response: (request: requestParams) => {
      const token = getRequestToken(request);
      if (!token) return resultError('Invalid token');
      const checkUser = createFakeUserList().find((item) => item.token === token);
      if (!checkUser) {
        return resultError('The corresponding user information was not obtained!');
      }
      return resultSuccess(checkUser);
    }
  },
  {
    url: '/basic-api/getPermCode',
    timeout: 200,
    method: 'get',
    response: (request: requestParams) => {
      const token = getRequestToken(request);
      if (!token) return resultError('Invalid token');
      const checkUser = createFakeUserList().find((item) => item.token === token);
      if (!checkUser) {
        return resultError('Invalid token!');
      }
      const codeList = fakeCodeList[checkUser.userId];

      return resultSuccess(codeList);
    }
  },

  {
    url: '/api/sys/user/makeNum',
    timeout: 200,
    method: 'get',
    response: (request: requestParams) => {
      function checkNum(num) {
        const arr = [];
        if (num) return false;
      }

      function getNum() {
        const num = makeNum(9);
        if (!checkNum(num)) {
          return num;
        }
      }

      return resultSuccess(getNum());
    }
  },
  {
    url: '/api/sys/user/findAllBoozUser',
    timeout: 200,
    method: 'get',
    response: (request: requestParams) => {
      return resultPageSuccess(1, 10, list);
    }
  },
  {
    url: '/api/sys/user/saveBoozUser',
    timeout: 200,
    method: 'get',
    response: ({query: user}) => {
      user.id = makeNum(15);
      user.flag = '1';
      list.push(user);
      return resultSuccess(user);
    }
  },
  {
    url: '/api/sys/user/getMockUserInfo',
    timeout: 200,
    method: 'get',
    response: ({query}) => {
      const userInfo = {
        user: {},
        permisssion: null,
        role: null
      };
      const user = mockUsers.filter(item => item.id == query.id)[0];
      userInfo.user = user;
      if (user.id == 1) {
        // userInfo.role
      }
      return mockUsers;
    }
  },
  // {
  //   url: '/api/sys/user/pushUserState',
  //   timeout: 200,
  //   method: 'post',
  //   response: ({body}) => {
  //     console.log(body)
  //     Object.assign(tokenState,createState(body.info))
  //     return R.ok()
  //
  //   }
  // },
  {
    url: '/api/sys/user/querySystemUserInfo',
    timeout: 200,
    method: 'get',
    response: () => {
      const token = tokenState.token
      if (token == 'mock token') {
        // 开发账号
        Object.assign(tokenState, useUser(1))
      } else if (token == 'mock token1') {
        Object.assign(tokenState, useUser(2))
      } else if (token == 'mock token2') {
        Object.assign(tokenState, useUser(3))
      } else if (token == 'mock token3') {

      } else if (token == 'mock token4') {

      } else if (token == 'mock token5') {

      } else if (token == 'mock token6') {

      } else {
        throw new Error('mock用户错误')
      }

      return R.ok(tokenState)
    }
  },

  /**
   * 获取平台列表
   */
  {
    url: '/api/tokenResource/getTokenPlatforms',
    timeout: 0,
    method: 'get',
    async rawResponse(req,res){

      const {body,sendObject}=await useBoozsoftResponse(req,res)



      const rolePlatformIds = [...new Set(getTokenRoleMenus().map(item => item.platformId))]
      const rolePlatforms = rolePlatformIds
        .map(it=>menuMockState.data[menuMockState.data.map(it2=>it2.id).indexOf(it)])
      // const rolePlatforms = menuMockState.data
      //   .filter(it=>it!=null)222
      //   .filter(it => rolePlatformIds.indexOf(it.id) != -1)
      sendObject({
        code: 0,
        type: 'success',
        message: 'ok',
        result: rolePlatforms,
        list: null
      })

    },
  },


  /**
   * 获取平台列表
   */
  {
    url: '/api/sys/menu/getAllPlatform',
    timeout: 0,
    method: 'get',
    // rawResponse(req,res){
    //   res.statusCode=302;
    //   res.setHeader('Location','http://www.xker.com/')
    //   res.sendDate=true
    //   res.end();
    //   return res
    // },

    response: ({query}) => {
      debugger
      return {
        code: 0,
        type: 'success',
        message: 'ok',
        result: menuMockState.data,
        list: null
      };
    }
  },
  /**
   * 获取平台列表
   */
  {
    url: '/api/sys/menu/tree2',
    timeout: 0,
    method: 'get',
    response: ({query}) => {
      return {
        code: 0,
        type: 'success',
        message: 'ok',
        result: itemsToTreeData(menuMockState.data),
        list: null
      };
    }
  },
  {
    url: '/api/tokenResource/getTokenTreeMenus',
    timeout: 0,
    method: 'get',
    async rawResponse(req,res) {



      const {body,sendObject,getQueryVariable}=await useBoozsoftResponse(req,res)


      const menus = menuMockState.data.filter(it=>it!=null)
        .filter(item => item.platformId == getQueryVariable(req.url)['platformId']);


      sendObject(
        resultSuccess(
          itemsToTreeData(
            menus.map((item) => {
              item.meta = {title: item.name.toString()};
              return item;
            })
          )
        ))



    }
  },
  {
    url: '/api/login/abc',
    timeout: 0,
    method: 'get',
    rawResponse: async (req, res) => {
      let reqbody = ''
      await new Promise((resolve) => {
        req.on('data', (chunk) => {
          reqbody += chunk
        })
        req.on('end', () => resolve(undefined))
      })
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.statusCode = 200


      Object.assign(tokenState, useUser(1))
      res.end(JSON.stringify( R.ok({
        info: tokenState
      })))
    }

  },
  {
    url: '/api/sys/menu/getTokenMenuTreeByPlatformId',
    timeout: 0,
    method: 'get',
    response: ({query}) => {
      const menuIds = getTokenRoleMenus()
        .filter(item => item.platformId == query.platformId)
        .map((item) => item.menuId);
      const owenerMenu = menuMockState.data.filter(item => menuIds.indexOf(item.id) != -1);
      return {
        code: 0,
        type: 'success',
        message: 'ok',
        result: itemsToTreeData(
          owenerMenu.map((item) => {
            item.meta = {title: item.name.toString()};
            return item;
          })
        ),
        list: null,
      };
    },
  },
  {
    url: '/api/sys/user/commitMockToken',
    timeout: 0,
    method: 'get',
    response: ({query}) => {
      const a = query.token
      tokenState.token = a
      return R.ok()
    },
  },
] as MockMethod[];
