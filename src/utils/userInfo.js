// use localStorage to store the authority info, which might be sent from server in actual project.

//  用户拥有的功能,用于权限
const SMART_EDU_FUNCTION_AUTHORITY = 'smart-edu-function-authority';
//  用户登录token
const SMART_EDU_USER_TOKEN = 'smart-edu-user-token';

export function getFunctionAuthority(str) {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  const authorityString =
    typeof str === 'undefined' ? localStorage.getItem(SMART_EDU_FUNCTION_AUTHORITY) : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  return authority || ['admin'];
}

export function setFunctionAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem(SMART_EDU_FUNCTION_AUTHORITY, JSON.stringify(proAuthority));
}

export function setUserToken(token) {
  localStorage.setItem(SMART_EDU_USER_TOKEN, token);
}

//获取当前用户的token
export function getCurrentUserToken() {
  return localStorage.getItem(SMART_EDU_USER_TOKEN);
}

export function isLogin() {
  const userToken = localStorage.getItem(SMART_EDU_USER_TOKEN);
  if (!userToken || typeof userToken === 'undefined' || userToken === 'undefined') {
    return false;
  }
  return true;
}

export function clearUserLogin() {
  localStorage.removeItem(SMART_EDU_USER_TOKEN);
  localStorage.removeItem(SMART_EDU_FUNCTION_AUTHORITY);
}
