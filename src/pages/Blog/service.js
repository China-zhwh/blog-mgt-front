import { stringify } from 'qs';
import request from '@/utils/request';
/**
 * 尽量的简单，只负责中转传参数
 */
export async function queryBlogList(params) {
  return request(`/api/common/blog/list?${stringify(params)}`);
}

export async function addBlog(params) {
  return request('/api/common/blog/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function getBlog(params) {
  return request(`/api/common/blog/get?${stringify(params)}`);
}

export async function editBlog(params) {
  return request(`/api/common/blog/edit?id=${params.id}`, {
    method: 'POST',
    body: {
      ...params.formValues,
    },
  });
}

export async function deleteBlog(params) {
  return request(`/api/common/blog/delete`, {
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
