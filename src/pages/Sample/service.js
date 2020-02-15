import { stringify } from 'qs';
import request from '@/utils/request';
/**
 * 尽量的简单，只负责中转传参数
 */
export async function queryUserList(params) {
  //使用stringify主要用于把js对象解析成 url querystring的形式 aa=1&bb=2
  //TODO 向后台请求的url参数，需要提前考虑设计
  return request(`/api/common/user/list?${stringify(params)}`);
}

export async function addUser(params) {
  return request('/api/common/user/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function getUser(params) {
  return request(`/api/common/user/get?${stringify(params)}`);
}

export async function editUser(params) {
  return request(`/api/common/user/edit?id=${params.id}`, {
    method: 'POST',
    body: {
      ...params.formValues,
    },
  });
}

export async function deleteUser(params) {
  return request(`/api/common/user/delete`, {
    method: 'POST',
    body: {
      ids: params.ids.join(','),
    },
  });
}

//  获取动态表单的初始列表
export async function queryCategoryList(params) {
  return request(`/api/common/category/list?${stringify(params)}`);
}
