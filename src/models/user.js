import { query as queryUsers, queryCurrent, queryUserInfo } from '@/services/user';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      //当是集成环境和运行环境，则使用真实的后端接口
      if (process.env.NODE_ENV === 'production' || INTEGRATED_TEST) {
        const response = yield call(queryUserInfo);
        const { data: userInfo } = response;
        //  为了兼容开发模式，加了如下字段
        userInfo.name = userInfo.userNameCn;
        userInfo.avatar =
          userInfo.userPhoto ||
          'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png';
        yield put({
          type: 'saveCurrentUser',
          payload: userInfo,
        });
      } else {
        const response = yield call(queryCurrent);
        yield put({
          type: 'saveCurrentUser',
          payload: response,
        });
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
