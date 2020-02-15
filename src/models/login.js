import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { fakeAccountLogin, getFakeCaptcha } from '@/services/api';
import { login } from '@/services/user';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { setUserToken, clearUserLogin } from '@/utils/userInfo';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    type: 'account', //写死，只用账号登录
    message: '',
  },

  effects: {
    *login({ payload }, { call, put }) {
      let response;
      //  集成测试或是运行环境，则调用后端地址
      if (process.env.NODE_ENV === 'production' || INTEGRATED_TEST) {
        response = yield call(login, payload);
      } else {
        response = yield call(fakeAccountLogin, payload);
      }
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.state) {
        //设置登录用户token
        setUserToken(response.data);
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          state: true,
          currentAuthority: 'guest',
        },
      });

      //清除当前登录token
      clearUserLogin();
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: !!payload.state,
        message: payload.message,
      };
    },
  },
};
