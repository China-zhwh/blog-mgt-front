import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}

//  用户登录
export async function login(params) {
  return request('/api/base/token', {
    method: 'POST',
    body: params,
    type: 'form',
  });
}
//  获取当前登录用户功能权限
export async function queryUserFunctionAuthority() {
  return request('/api/base/getCurrentSysUserFunctionList?functionCode=1001', {
    method: 'POST',
  });
}

//  获取当前登录用户信息
export async function queryUserInfo() {
  return request('/api/base/getCurrentSysUser', {
    method: 'POST',
  });
}
