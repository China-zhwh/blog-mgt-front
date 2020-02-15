import { queryCategoryList } from '../service';

export default {
  namespace: 'sampleCategory',
  state: {
    list: [],
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryCategoryList, payload);
      yield put({
        type: 'save',
        payload: { list: response.data },
      });
    },
  },
  reducers: {
    //保存state
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
