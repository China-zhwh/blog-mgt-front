import fetch from 'dva/fetch';
import { notification, message } from 'antd';
import router from 'umi/router';
import hash from 'hash.js';
import moment from 'moment';
import obj2fd from 'obj2fd';
import md5 from 'md5';
import { isAntdPro } from './utils';
import { isLogin, getCurrentUserToken } from './userInfo';

/**
 * request中的option增加了如下个参数
 * type : 'form' 将会把body中的js 对象转换成formItem并提交（默认将会转换成json字符串，并以payload的方式提交）
 * noCheckReturn : true   不对返回的json对象的state值进行检测（默认当返回的state为0时，弹出错误信息）
 */

//覆盖moment的tojson方法，使其当运行JSON.stringify时，可以装换成需要的格式
//主要为了在JSON.stringify时，转换成符合要求的格式
moment.prototype.toJSON = function toJSON() {
  return moment(this).format('YYYY-MM-DD HH:mm:ss');
};

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户请求签名错误或令牌过期。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext,
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
};

const cachedSave = (response, hashcode) => {
  /**
   * Clone a response data and store it in sessionStorage
   * Does not support data other than json, Cache only json
   */
  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.match(/application\/json/i)) {
    // All data is saved as text
    response
      .clone()
      .text()
      .then(content => {
        sessionStorage.setItem(hashcode, content);
        sessionStorage.setItem(`${hashcode}:timestamp`, Date.now());
      });
  }
  return response;
};

const checkReturn = returnJson => {
  if ('state' in returnJson) {
    if (returnJson.state === 0) {
      message.error(returnJson.message);
    }
  }
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, option) {
  const options = {
    expirys: isAntdPro(),
    ...option,
  };

  if (isLogin()) {
    //console.log("url",url);
    //console.log("是否登录",isLogin());
    //  添加业务相关header token timestamp sign
    let { headers } = options;
    headers = headers || {};
    headers.HeaderAuthorization = getCurrentUserToken();
    headers.HeaderTimeStamp = Date.now();
    headers.HeaderSign = md5(
      headers.HeaderTimeStamp +
        headers.HeaderAuthorization +
        headers.HeaderTimeStamp +
        headers.HeaderAuthorization
    );
    options.headers = headers;
  }

  /**
   * Produce fingerprints based on url and parameters
   * Maybe url has the same parameters
   */
  const fingerprint = url + (options.body ? JSON.stringify(options.body) : '');
  const hashcode = hash
    .sha256()
    .update(fingerprint)
    .digest('hex');

  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    if (!(newOptions.body instanceof FormData) && newOptions.type !== 'form') {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
      //  将js对象转成formData
      newOptions.body = obj2fd(newOptions.body);
    }
  }

  const expirys = options.expirys && 60;
  // options.expirys !== false, return the cache,
  if (options.expirys !== false) {
    const cached = sessionStorage.getItem(hashcode);
    const whenCached = sessionStorage.getItem(`${hashcode}:timestamp`);
    if (cached !== null && whenCached !== null) {
      const age = (Date.now() - whenCached) / 1000;
      if (age < expirys) {
        const response = new Response(new Blob([cached]));
        return response.json();
      }
      sessionStorage.removeItem(hashcode);
      sessionStorage.removeItem(`${hashcode}:timestamp`);
    }
  }
  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => cachedSave(response, hashcode))
    .then(response => {
      // DELETE and 204 do not return data by default
      // using .json will report an error.
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      const returnJson = response.json();
      if (!newOptions.noCheckReturn) {
        checkReturn(returnJson);
      }
      return returnJson;
    })
    .catch(e => {
      const status = e.name;
      if (status === 401 || status === 403) {
        // 在后台系统中，403表示 token或sign 验证
        // https://umijs.org/zh/guide/with-dva.html#配置及插件
        // @HACK
        /* eslint-disable no-underscore-dangle */
        window.g_app._store.dispatch({
          type: 'login/logout',
        });
        return;
      }
      // environment should not be used
      // if (status === 403) {
      //   router.push('/exception/403');
      //   return;
      // }
      if (status <= 504 && status >= 500) {
        router.push('/exception/500');
        return;
      }
      if (status >= 404 && status < 422) {
        router.push('/exception/404');
      }
    });
}
