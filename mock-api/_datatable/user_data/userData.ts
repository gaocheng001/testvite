
function createUser({id,name}){
  return   {
    'deptId': null,
    id,
    'idToken': null,
    'jigou': null,
    name,
    'password': null,
    'phone': '0000000000',
    'realName':name,
    'roleList': null,
    'username': 'admin',
    'avatar': null,
    'email': null,
    'birthday': null,
    'gender': null,
    'postId': null
  }
}
// 开发账户
export const mockUsers =[
  createUser({id:100,name:'开发账号'}),
  createUser({id:200,name:'超级管理员'}),
  createUser({id:300,name:'张三1'}),
  createUser({id:400,name:'张三2'}),
  createUser({id:500,name:'张三3'}),
  createUser({id:600,name:'张三4'}),
  createUser({id:700,name:'张三5'}),
  createUser({id:800,name:'张三6'})
]
