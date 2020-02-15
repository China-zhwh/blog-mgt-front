import homeChartData from '../service';

export default {
  namespace: 'homeChart',

  state: {
    homeVisitData: [],
    homeSalesData: [],
    homeOfflineChartData: [],
    homeSalesTypeData: [],
    loading: false,
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(homeChartData);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    // *fetchSalesData(_, { call, put }) {
    //   const response = yield call(homeChartData);
    //   yield put({
    //     type: 'save',
    //     payload: {
    //       salesData: response.salesData,
    //     },
    //   });
    // },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return {
        homeVisitData: [],
        homeSalesData: [],
        homeOfflineChartData: [],
        homeSalesTypeData: [],
      };
    },
  },
};
